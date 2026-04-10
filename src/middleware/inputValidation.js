/**
 * Input Validation Middleware
 * Comprehensive input validation and sanitization for Express.js
 */

import express from 'express';
import { ValidationError } from './enhancedErrorHandling.js';

/**
 * Sanitize input string
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['";]/g, '') // Remove quotes and semicolons
    .replace(/\\/g, ''); // Remove backslashes
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
};

/**
 * Validate email address
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone?.replace(/\D/g, ''));
};

/**
 * Validate Aadhaar number
 */
export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar?.replace(/\D/g, ''));
};

/**
 * Validate JSON structure
 */
export const validateJSON = (json) => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

/**
 * Middleware: Validate Content-Type
 */
export const validateContentType = (req, res, next) => {
  const contentType = req.headers['content-type'];
  
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    if (!contentType || !contentType.includes('application/json')) {
      throw new ValidationError('Content-Type must be application/json');
    }
  }
  
  next();
};

/**
 * Middleware: Limit request size
 */
export const limitRequestSize = (maxSize = '1mb') => {
  return express.json({ limit: maxSize });
};

/**
 * Middleware: Validate and sanitize request body
 */
export const validateRequestBody = (rules = {}) => {
  return (req, res, next) => {
    const errors = {};
    const sanitized = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      // Check required
      if (rule.required && !value) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (!value) {
        sanitized[field] = value;
        continue;
      }

      // Check type
      if (rule.type && typeof value !== rule.type) {
        errors[field] = `${field} must be ${rule.type}`;
        continue;
      }

      // Check length
      if (typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors[field] = `${field} must be at least ${rule.minLength} characters`;
          continue;
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          errors[field] = `${field} must be at most ${rule.maxLength} characters`;
          continue;
        }
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[field] = rule.patternError || `${field} format is invalid`;
        continue;
      }

      // Check enum
      if (rule.enum && !rule.enum.includes(value)) {
        errors[field] = `${field} must be one of: ${rule.enum.join(', ')}`;
        continue;
      }

      // Custom validator
      if (rule.validate && !rule.validate(value)) {
        errors[field] = rule.validateError || `${field} is invalid`;
        continue;
      }

      // Sanitize
      sanitized[field] = typeof value === 'string' ? sanitizeString(value) : value;
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    req.body = sanitized;
    next();
  };
};

/**
 * Middleware: Validate query parameters
 */
export const validateQueryParams = (rules = {}) => {
  return (req, res, next) => {
    const errors = {};

    for (const [param, rule] of Object.entries(rules)) {
      const value = req.query[param];

      if (rule.required && !value) {
        errors[param] = `${param} is required`;
        continue;
      }

      if (!value) continue;

      // Type check
      if (rule.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== rule.type) {
          errors[param] = `${param} must be ${rule.type}`;
        }
      }

      // Pattern check
      if (rule.pattern && !rule.pattern.test(value)) {
        errors[param] = `${param} format is invalid`;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Query validation failed', errors);
    }

    next();
  };
};

/**
 * Middleware: Validate route parameters
 */
export const validateRouteParams = (rules = {}) => {
  return (req, res, next) => {
    const errors = {};

    for (const [param, rule] of Object.entries(rules)) {
      const value = req.params[param];

      if (rule.required && !value) {
        errors[param] = `${param} is required`;
        continue;
      }

      if (!value) continue;

      if (rule.pattern && !rule.pattern.test(value)) {
        errors[param] = `${param} format is invalid`;
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError('Route parameter validation failed', errors);
    }

    next();
  };
};

/**
 * Middleware: Sanitize all inputs
 */
export const sanitizeAllInputs = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

/**
 * Middleware: Rate limiting
 */
export const createRateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const store = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!store.has(ip)) {
      store.set(ip, []);
    }

    const requests = store.get(ip).filter((time) => time > windowStart);
    
    if (requests.length >= maxRequests) {
      const retryAfter = Math.ceil((requests[0] + windowMs - now) / 1000);
      res.set('Retry-After', retryAfter);
      throw new ValidationError('Rate limit exceeded', { retryAfter });
    }

    requests.push(now);
    store.set(ip, requests);
    next();
  };
};

/**
 * Middleware: Validate API keys
 */
export const validateApiKey = (apiKeyHeader = 'x-api-key') => {
  return (req, res, next) => {
    const apiKey = req.headers[apiKeyHeader];
    
    if (!apiKey) {
      throw new ValidationError('API key is missing', {
        header: apiKeyHeader,
      });
    }

    if (apiKey !== process.env.API_KEY) {
      throw new ValidationError('Invalid API key');
    }

    next();
  };
};

/**
 * Middleware: Log request details
 */
export const logRequestDetails = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };

    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    console[logLevel]('[Request]', JSON.stringify(log));
  });

  next();
};

export default {
  sanitizeString,
  sanitizeObject,
  validateEmail,
  validatePhone,
  validateAadhaar,
  validateJSON,
  validateContentType,
  limitRequestSize,
  validateRequestBody,
  validateQueryParams,
  validateRouteParams,
  sanitizeAllInputs,
  createRateLimiter,
  validateApiKey,
  logRequestDetails,
};
