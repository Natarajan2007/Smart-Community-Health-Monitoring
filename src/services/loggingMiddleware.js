/**
 * Advanced Logging Middleware
 * Express middleware for request/response logging and request tracking
 */

import advancedLogger from './advancedLogger.js';

/**
 * Create logging middleware
 * @param {object} options - Middleware options
 * @returns {function} Express middleware
 */
export function createLoggingMiddleware(options = {}) {
  const {
    logRequests = true,
    logResponses = true,
    logErrors = true,
    excludePaths = [],
    includeHeaders = false,
    includeBody = false
  } = options;

  return (req, res, next) => {
    // Skip logging for excluded paths
    if (excludePaths.includes(req.path)) {
      return next();
    }

    const startTime = Date.now();

    // Log incoming request
    if (logRequests) {
      const requestMetadata = {
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent')?.substring(0, 100),
        query: Object.keys(req.query).length > 0 ? req.query : undefined
      };

      if (includeHeaders) {
        requestMetadata.headers = req.headers;
      }

      if (includeBody && req.method !== 'GET' && req.body) {
        requestMetadata.body = JSON.stringify(req.body).substring(0, 500);
      }

      advancedLogger.logRequest(req, requestMetadata);
    }

    // Intercept response
    const originalSend = res.send;
    res.send = function(data) {
      const duration = Date.now() - startTime;

      // Log response
      if (logResponses) {
        advancedLogger.logResponse(req, res, duration, {
          responseSize: data ? data.length : 0
        });
      }

      // Log errors
      if (logErrors && res.statusCode >= 400) {
        advancedLogger.logApiError(req.path, {
          message: `HTTP ${res.statusCode}`,
          statusCode: res.statusCode,
          code: `HTTP_${res.statusCode}`
        }, {
          method: req.method,
          path: req.path,
          body: includeBody ? req.body : undefined
        }, req.id);
      }

      originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Error handling middleware with logging
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
export function errorLoggingMiddleware(err, req, res, next) {
  advancedLogger.logApiError(req.path, err, {
    method: req.method,
    path: req.path,
    ip: req.ip
  }, req.id);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: message,
    requestId: req.id,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Audit logging middleware
 * Logs significant actions for security/compliance
 * @param {string} action - Action name
 * @param {string} entity - Entity type
 * @param {function} getDetails - Function to extract details from request
 * @returns {function} Express middleware
 */
export function createAuditMiddleware(action, entity, getDetails = () => ({})) {
  return (req, res, next) => {
    const originalSend = res.send;

    res.send = function(data) {
      // Only audit successful operations
      if (res.statusCode < 400) {
        const details = getDetails(req, res);
        advancedLogger.audit(action, entity, details, req.id);
      }

      originalSend.call(this, data);
    };

    next();
  };
}

export default {
  createLoggingMiddleware,
  errorLoggingMiddleware,
  createAuditMiddleware,
  advancedLogger
};
