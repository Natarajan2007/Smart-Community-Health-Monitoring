/**
 * Error Response Utilities
 * 
 * Provides standardized error response formatting and handling
 * for consistent error communication across the application.
 * 
 * @module errorResponse
 */

/**
 * Standard error response format
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false for errors
 * @property {Object} error - Error details
 * @property {string} error.code - Machine-readable error code
 * @property {string} error.message - Technical error message
 * @property {string} error.userMessage - User-friendly error message
 * @property {Object} error.details - Additional error details
 * @property {string} error.timestamp - ISO timestamp of error
 */

/**
 * Create standardized error response
 * @param {string} code - Error code (e.g., 'VALIDATION_ERROR')
 * @param {string} message - Technical error message
 * @param {string} userMessage - User-friendly message
 * @param {Object} details - Additional error details
 * @returns {Object} Formatted error response
 */
export const createErrorResponse = (
  code,
  message,
  userMessage,
  details = {}
) => {
  return {
    success: false,
    error: {
      code,
      message,
      userMessage,
      details,
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Validation error response
 * @param {string} field - Field that failed validation
 * @param {string} message - Validation error message
 * @returns {Object} Error response
 */
export const validationError = (field, message) => {
  return createErrorResponse(
    'VALIDATION_ERROR',
    `Invalid ${field}`,
    message || `Please provide a valid ${field}`,
    { field }
  );
};

/**
 * Authentication error response
 * @param {string} message - Optional custom message
 * @returns {Object} Error response
 */
export const authenticationError = (message = 'Authentication required') => {
  return createErrorResponse(
    'AUTHENTICATION_ERROR',
    'Unauthorized access',
    message,
    { statusCode: 401 }
  );
};

/**
 * Authorization error response
 * @param {string} message - Optional custom message
 * @returns {Object} Error response
 */
export const authorizationError = (message = 'Insufficient permissions') => {
  return createErrorResponse(
    'AUTHORIZATION_ERROR',
    'Forbidden access',
    message,
    { statusCode: 403 }
  );
};

/**
 * Not found error response
 * @param {string} resource - Resource that was not found
 * @returns {Object} Error response
 */
export const notFoundError = (resource) => {
  return createErrorResponse(
    'NOT_FOUND',
    `${resource} not found`,
    `The ${resource} you are looking for does not exist`,
    { statusCode: 404, resource }
  );
};

/**
 * Rate limit error response
 * @param {number} retryAfter - Seconds to wait before retry
 * @returns {Object} Error response
 */
export const rateLimitError = (retryAfter = 60) => {
  return createErrorResponse(
    'RATE_LIMIT_EXCEEDED',
    'Too many requests',
    `Please wait ${retryAfter} seconds before trying again`,
    { statusCode: 429, retryAfter }
  );
};

/**
 * Server error response
 * @param {string} message - Optional custom message
 * @returns {Object} Error response
 */
export const serverError = (message = 'An unexpected error occurred') => {
  return createErrorResponse(
    'INTERNAL_SERVER_ERROR',
    'Server processing failed',
    message,
    { statusCode: 500 }
  );
};

/**
 * Network error response
 * @param {string} message - Optional custom message
 * @returns {Object} Error response
 */
export const networkError = (message = 'Network request failed') => {
  return createErrorResponse(
    'NETWORK_ERROR',
    'Connection failed',
    message || 'Please check your internet connection and try again',
    { statusCode: 0 }
  );
};

/**
 * Timeout error response
 * @param {number} timeout - Timeout duration in milliseconds
 * @returns {Object} Error response
 */
export const timeoutError = (timeout = 30000) => {
  return createErrorResponse(
    'REQUEST_TIMEOUT',
    'Request timeout',
    'The request took too long. Please try again.',
    { statusCode: 408, timeout }
  );
};

/**
 * Conflict error response
 * @param {string} message - Conflict message
 * @param {Object} details - Additional details
 * @returns {Object} Error response
 */
export const conflictError = (message, details = {}) => {
  return createErrorResponse(
    'CONFLICT',
    'Resource conflict',
    message,
    { statusCode: 409, ...details }
  );
};

/**
 * Bad request error response
 * @param {Object} errors - Field-level errors
 * @returns {Object} Error response
 */
export const badRequestError = (errors = {}) => {
  return createErrorResponse(
    'BAD_REQUEST',
    'Invalid request',
    'Please check your input and try again',
    { statusCode: 400, errors }
  );
};

/**
 * Format multiple field errors
 * @param {Object} fieldErrors - Object with field names as keys and error messages as values
 * @returns {Object} Formatted error response
 */
export const formatFieldErrors = (fieldErrors) => {
  const errors = {};
  for (const [field, message] of Object.entries(fieldErrors)) {
    errors[field] = {
      message,
      code: `INVALID_${field.toUpperCase()}`
    };
  }
  return badRequestError(errors);
};

/**
 * Log error response with context
 * @param {Object} errorResponse - Error response object
 * @param {Object} context - Additional context
 */
export const logErrorResponse = (errorResponse, context = {}) => {
  const logData = {
    ...errorResponse.error,
    context
  };

  console.error('[Error Response]', JSON.stringify(logData, null, 2));
};

export default {
  createErrorResponse,
  validationError,
  authenticationError,
  authorizationError,
  notFoundError,
  rateLimitError,
  serverError,
  networkError,
  timeoutError,
  conflictError,
  badRequestError,
  formatFieldErrors,
  logErrorResponse
};
