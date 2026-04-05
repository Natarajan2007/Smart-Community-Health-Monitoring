import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const app = express();
const PORT = process.env.PORT || 5000;
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;

// Logger utility for consistent logging with request tracking
const logger = {
  generateRequestId: () => `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  info: (msg, data = {}, requestId = '') => {
    const prefix = requestId ? `[${requestId}]` : '';
    console.log(`[${new Date().toISOString()}] INFO ${prefix}:`, msg, Object.keys(data).length > 0 ? data : '');
  },
  
  error: (msg, error = {}, requestId = '') => {
    const prefix = requestId ? `[${requestId}]` : '';
    console.error(`[${new Date().toISOString()}] ERROR ${prefix}:`, msg, error);
  },
  
  warn: (msg, data = {}, requestId = '') => {
    const prefix = requestId ? `[${requestId}]` : '';
    console.warn(`[${new Date().toISOString()}] WARN ${prefix}:`, msg, Object.keys(data).length > 0 ? data : '');
  },
  
  debug: (msg, data = {}, requestId = '') => {
    if (process.env.DEBUG === 'true') {
      const prefix = requestId ? `[${requestId}]` : '';
      console.log(`[${new Date().toISOString()}] DEBUG ${prefix}:`, msg, Object.keys(data).length > 0 ? data : '');
    }
  }
};

// Request ID middleware - add unique ID to each request
const requestIdMiddleware = (req, res, next) => {
  req.id = logger.generateRequestId();
  res.setHeader('X-Request-ID', req.id);
  next();
};

// Performance monitoring middleware
const performanceMonitor = (req, res, next) => {
  req.startTime = Date.now();
  
  logger.debug('Request started', {
    method: req.method,
    path: req.path,
    ip: req.ip
  }, req.id);
  
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - req.startTime;
    const memUsage = process.memoryUsage();
    
    logger.debug('Request completed', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      externalMem: `${Math.round(memUsage.external / 1024 / 1024)}MB`
    }, req.id);
    
    originalSend.call(this, data);
  };
  
  next();
};

// Rate limiting: track requests per IP
const requestLimits = new Map();
const RATE_LIMIT = 10; // 10 requests
const RATE_WINDOW = 60000; // per 60 seconds

/**
 * Rate limiting middleware to prevent API abuse
 */
const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  
  if (!requestLimits.has(ip)) {
    requestLimits.set(ip, []);
  }
  
  const timestamps = requestLimits.get(ip);
  const recentRequests = timestamps.filter(t => now - t < RATE_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT) {
    const retryAfter = Math.ceil((recentRequests[0] + RATE_WINDOW - now) / 1000);
    logger.warn('Rate limit exceeded', { 
      ip, 
      requestCount: recentRequests.length,
      retryAfter: `${retryAfter}s`
    }, req.id);
    
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please wait before trying again.',
      retryAfter
    });
  }
  
  recentRequests.push(now);
  requestLimits.set(ip, recentRequests);
  next();
};

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestIdMiddleware);
app.use(performanceMonitor);
app.use(rateLimitMiddleware);

/**
 * Validate message format and content
 * @param {Array} messages - Array of message objects
 * @returns {Object} Validation result with isValid and errors
 */
const validateMessages = (messages) => {
  if (!Array.isArray(messages)) {
    return { isValid: false, error: 'Messages must be an array' };
  }
  
  if (messages.length === 0) {
    return { isValid: false, error: 'Messages array cannot be empty' };
  }
  
  if (messages.length > 50) {
    return { isValid: false, error: 'Conversation history too long (max 50 messages)' };
  }
  
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return { isValid: false, error: 'Each message must have role and content' };
    }
    if (!['system', 'user', 'assistant'].includes(msg.role)) {
      return { isValid: false, error: 'Invalid message role' };
    }
    if (typeof msg.content !== 'string' || msg.content.trim().length === 0) {
      return { isValid: false, error: 'Message content must be a non-empty string' };
    }
    if (msg.content.length > 4000) {
      return { isValid: false, error: 'Message content too long (max 4000 characters)' };
    }
  }
  
  return { isValid: true };
};

// Chat endpoint
/**
 * POST /api/chat - Process chat messages with OpenAI
 * Features: Rate limiting, validation, error handling, performance monitoring
 * @param {string} messages - Array of message objects
 * @returns {Object} Response with success status and AI message
 */
app.post('/api/chat', async (req, res) => {
  const requestId = req.id;
  const startTime = Date.now();
  
  try {
    const { messages } = req.body;

    // Validate messages
    const validation = validateMessages(messages);
    if (!validation.isValid) {
      logger.warn('Invalid message format', { error: validation.error }, requestId);
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }

    if (!OPENAI_API_KEY) {
      logger.error('VITE_OPENAI_API_KEY is not configured', {}, requestId);
      return res.status(500).json({
        error: 'Server configuration error',
        success: false,
        message: 'API key not configured. Please check server setup.'
      });
    }

    logger.info('Processing chat request', { messageCount: messages.length }, requestId);

    // Call OpenAI API with timeout
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000 // 30 second timeout
      }
    );

    const aiMessage = response.data?.choices?.[0]?.message?.content;
    
    if (!aiMessage) {
      logger.error('Invalid response from OpenAI', { response: response.data }, requestId);
      throw new Error('Invalid response format from OpenAI');
    }
    
    const duration = Date.now() - startTime;
    logger.info('Chat request processed successfully', { 
      duration: `${duration}ms`,
      responseLength: aiMessage.length
    }, requestId);
    
    res.json({
      success: true,
      message: aiMessage,
      processingTime: duration
    });
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error.response?.data?.error?.message || error.message || 'Unknown error';
    logger.error('OpenAI API Error', { 
      message: errorMessage, 
      status: error.response?.status, 
      duration: `${duration}ms`,
      code: error.code
    }, requestId);
    
    // Determine appropriate status code
    let statusCode = 500;
    let userMessage = 'Sorry, I encountered an error. Please try again.';
    
    if (error.response?.status === 401) {
      statusCode = 500;
      userMessage = 'Authentication error. Please check server configuration.';
    } else if (error.response?.status === 429) {
      statusCode = 429;
      userMessage = 'Service is busy. Please try again in a moment.';
    } else if (error.code === 'ECONNABORTED') {
      statusCode = 504;
      userMessage = 'Request timeout. Please try a simpler question.';
    }
    
    res.status(statusCode).json({
      success: false,
      error: userMessage,
      message: userMessage
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  logger.info('Health check passed', { uptime: `${process.uptime()}s` }, req.id);
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  logger.info('Backend server started', { 
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development'
  });
  logger.info('Chat API ready', { 
    endpoint: `/api/chat`,
    url: `http://localhost:${PORT}/api/chat`
  });
  logger.info('Health check endpoint', { 
    url: `http://localhost:${PORT}/api/health`
  });
});
