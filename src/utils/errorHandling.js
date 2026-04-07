/**
 * Error Handling Utilities
 * Centralized error handling, custom error classes, and error recovery strategies
 * @module errorHandling
 */

/**
 * Custom Error Classes
 */

/**
 * ValidationError - Invalid input data
 */
export class ValidationError extends Error {
  constructor(message, field = null, value = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.value = value;
    this.statusCode = 400;
  }
}

/**
 * AuthenticationError - Auth failure
 */
export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
  }
}

/**
 * AuthorizationError - Insufficient permissions
 */
export class AuthorizationError extends Error {
  constructor(message = 'Insufficient permissions') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
  }
}

/**
 * NotFoundError - Resource not found
 */
export class NotFoundError extends Error {
  constructor(resource = 'Resource', identifier = null) {
    const msg = identifier
      ? `${resource} not found: ${identifier}`
      : `${resource} not found`;
    super(msg);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.statusCode = 404;
  }
}

/**
 * ConflictError - Resource conflict
 */
export class ConflictError extends Error {
  constructor(message = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

/**
 * RateLimitError - Rate limit exceeded
 */
export class RateLimitError extends Error {
  constructor(retryAfter = 60) {
    super(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    this.statusCode = 429;
  }
}

/**
 * ServerError - Server error
 */
export class ServerError extends Error {
  constructor(message = 'Server error', details = null) {
    super(message);
    this.name = 'ServerError';
    this.details = details;
    this.statusCode = 500;
  }
}

/**
 * NetworkError - Network connectivity issue
 */
export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = 0;
  }
}

/**
 * TimeoutError - Request timeout
 */
export class TimeoutError extends Error {
  constructor(operation = 'Operation', timeout = 30000) {
    super(`${operation} timed out after ${timeout}ms`);
    this.name = 'TimeoutError';
    this.timeout = timeout;
    this.statusCode = 504;
  }
}

/**
 * Convert error to user-friendly message
 * @param {Error} error - Error object
 * @returns {string} User-friendly message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // Custom errors
  if (error instanceof ValidationError) {
    return `Invalid ${error.field}: ${error.message}`;
  }

  if (error instanceof AuthenticationError) {
    return 'Please log in to continue';
  }

  if (error instanceof AuthorizationError) {
    return 'You do not have permission to perform this action';
  }

  if (error instanceof NotFoundError) {
    return `${error.resource} not found`;
  }

  if (error instanceof ConflictError) {
    return error.message;
  }

  if (error instanceof RateLimitError) {
    return `Too many requests. Please wait ${error.retryAfter} seconds`;
  }

  if (error instanceof ServerError) {
    return 'Server error occurred. Please try again later';
  }

  if (error instanceof NetworkError) {
    return 'Network connection error. Please check your internet';
  }

  if (error instanceof TimeoutError) {
    return 'Request took too long. Please try again';
  }

  // Axios errors
  if (error.response) {
    const { status, data } = error.response;
    if (data?.message) return data.message;
    if (data?.error) return data.error;

    switch (status) {
      case 400:
        return 'Invalid request data';
      case 401:
        return 'Authentication required';
      case 403:
        return 'Access denied';
      case 404:
        return 'Resource not found';
      case 429:
        return 'Too many requests. Please wait';
      case 500:
        return 'Server error. Please try again later';
      case 503:
        return 'Service unavailable. Please try again later';
      default:
        return `Error ${status}: ${error.message}`;
    }
  }

  // Default error message
  return error.message || 'An unknown error occurred';
};

/**
 * Get error severity level
 * @param {Error} error - Error object
 * @returns {string} Severity level: 'low', 'medium', 'high', 'critical'
 */
export const getErrorSeverity = (error) => {
  if (error instanceof ValidationError) return 'low';
  if (error instanceof NotFoundError) return 'low';
  if (error instanceof AuthenticationError) return 'medium';
  if (error instanceof AuthorizationError) return 'medium';
  if (error instanceof NetworkError) return 'medium';
  if (error instanceof RateLimitError) return 'medium';
  if (error instanceof TimeoutError) return 'high';
  if (error instanceof ServerError) return 'high';
  if (error instanceof ConflictError) return 'high';
  return error.statusCode >= 500 ? 'critical' : 'medium';
};

/**
 * Check if error is retryable
 * @param {Error} error - Error object
 * @returns {boolean} Is retryable
 */
export const isRetryableError = (error) => {
  if (error instanceof ValidationError) return false;
  if (error instanceof AuthenticationError) return false;
  if (error instanceof AuthorizationError) return false;
  if (error instanceof NotFoundError) return false;
  if (error instanceof ConflictError) return false;

  // Retryable errors
  if (error instanceof NetworkError) return true;
  if (error instanceof TimeoutError) return true;
  if (error instanceof RateLimitError) return true;
  if (error instanceof ServerError) return true;

  // Check HTTP status
  if (error.response) {
    const status = error.response.status;
    return status === 408 || status === 429 || (status >= 500 && status < 600);
  }

  return true;
};

/**
 * Retry operation with exponential backoff
 * @param {Function} operation - Operation to retry
 * @param {number} maxAttempts - Maximum attempts
 * @param {number} initialDelay - Initial delay in ms
 * @returns {Promise} Operation result
 */
export const retryOperation = async (operation, maxAttempts = 3, initialDelay = 1000) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === maxAttempts) {
        throw error;
      }

      // Exponential backoff with jitter
      const delay = initialDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.1 * delay;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw lastError;
};

/**
 * Error boundary handler
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @returns {Object} Error info for logging
 */
export const handleErrorBoundary = (error, context = 'Unknown') => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    message: error.message,
    stack: error.stack,
    type: error.name,
    severity: getErrorSeverity(error),
    userMessage: getErrorMessage(error),
    retryable: isRetryableError(error)
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error Boundary:', errorInfo);
  }

  return errorInfo;
};

/**
 * Create error response
 * @param {Error} error - Error object
 * @param {string} context - Error context
 * @returns {Object} Formatted error response
 */
export const createErrorResponse = (error, context = 'Operation failed') => {
  return {
    success: false,
    error: {
      message: getErrorMessage(error),
      code: error.statusCode || 500,
      type: error.name,
      severity: getErrorSeverity(error),
      retryable: isRetryableError(error),
      timestamp: new Date().toISOString(),
      context
    }
  };
};

/**
 * Async wrapper for error handling
 * @param {Function} fn - Async function
 * @returns {Function} Wrapped function
 */
export const asyncHandler = (fn) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error('Async operation error:', error);
      throw error;
    }
  };
};

/**
 * Safe JSON parse
 * @param {string} json - JSON string
 * @param {*} fallback - Fallback value
 * @returns {*} Parsed object or fallback
 */
export const safeJsonParse = (json, fallback = null) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return fallback;
  }
};

/**
 * Safe property access
 * @param {Object} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.profile.name')
 * @param {*} fallback - Fallback value
 * @returns {*} Property value or fallback
 */
export const safeGet = (obj, path, fallback = undefined) => {
  try {
    return path.split('.').reduce((current, prop) => current?.[prop], obj) ?? fallback;
  } catch (error) {
    return fallback;
  }
};

/**
 * Execute with fallback
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value
 * @returns {*} Function result or fallback
 */
export const executeWithFallback = (fn, fallback = null) => {
  try {
    return fn();
  } catch (error) {
    console.warn('Execution error:', error);
    return fallback;
  }
};

export default {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError,
  NetworkError,
  TimeoutError,
  getErrorMessage,
  getErrorSeverity,
  isRetryableError,
  retryOperation,
  handleErrorBoundary,
  createErrorResponse,
  asyncHandler,
  safeJsonParse,
  safeGet,
  executeWithFallback
};
