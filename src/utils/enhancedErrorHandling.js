/**
 * Enhanced Error Handling Utilities
 * Comprehensive error handling with custom error classes and utilities
 */

/**
 * Base custom error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Validation error - 400
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

/**
 * Authentication error - 401
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Unauthorized', details?: Record<string, any>) {
    super(message, 'AUTHENTICATION_ERROR', 401, details);
  }
}

/**
 * Authorization error - 403
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Forbidden', details?: Record<string, any>) {
    super(message, 'AUTHORIZATION_ERROR', 403, details);
  }
}

/**
 * Not found error - 404
 */
export class NotFoundError extends AppError {
  constructor(resource: string, details?: Record<string, any>) {
    super(`${resource} not found`, 'NOT_FOUND', 404, details);
  }
}

/**
 * Conflict error - 409
 */
export class ConflictError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFLICT', 409, details);
  }
}

/**
 * Rate limit error - 429
 */
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 'RATE_LIMIT_EXCEEDED', 429, {
      retryAfter,
    });
  }
}

/**
 * API error - 502/503/504 etc
 */
export class ApiError extends AppError {
  constructor(
    message: string,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message, 'API_ERROR', statusCode, details);
  }
}

/**
 * Network error
 */
export class NetworkError extends AppError {
  constructor(message: string = 'Network request failed', details?: Record<string, any>) {
    super(message, 'NETWORK_ERROR', 0, details);
  }
}

/**
 * Timeout error
 */
export class TimeoutError extends AppError {
  constructor(message: string = 'Request timeout', timeout?: number) {
    super(message, 'TIMEOUT_ERROR', 408, { timeout });
  }
}

/**
 * Configuration error
 */
export class ConfigurationError extends AppError {
  constructor(message: string, details?: Record<string, any>) {
    super(message, 'CONFIGURATION_ERROR', 500, details);
  }
}

/**
 * Error handler utility
 */
export class ErrorHandler {
  /**
   * Parse any error into AppError
   */
  static parse(error: any): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error?.response) {
      // Axios error
      return new ApiError(
        error.message || 'API request failed',
        error.response.status,
        error.response.data
      );
    }

    if (error?.code === 'ECONNABORTED') {
      return new TimeoutError(error.message);
    }

    if (error?.code === 'ENOTFOUND' || error?.code === 'ECONNREFUSED') {
      return new NetworkError(error.message);
    }

    if (error instanceof SyntaxError) {
      return new ValidationError('Invalid JSON', { originalError: error.message });
    }

    if (error instanceof TypeError) {
      return new ValidationError('Type error', { originalError: error.message });
    }

    return new AppError(
      error?.message || 'An unexpected error occurred',
      'UNKNOWN_ERROR',
      500,
      { originalError: error }
    );
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: any): string {
    const appError = this.parse(error);

    const messages: Record<string, string> = {
      VALIDATION_ERROR: 'Please check your input and try again.',
      AUTHENTICATION_ERROR: 'Please log in to continue.',
      AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
      NOT_FOUND: 'The requested resource was not found.',
      CONFLICT: 'This resource already exists.',
      RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
      NETWORK_ERROR: 'Network connection failed. Please check your connection.',
      TIMEOUT_ERROR: 'The request took too long. Please try again.',
      CONFIGURATION_ERROR: 'Server configuration error. Please contact support.',
    };

    return messages[appError.code] || appError.message;
  }

  /**
   * Check if error is retryable
   */
  static isRetryable(error: any): boolean {
    const appError = this.parse(error);
    const retryableCodes = [408, 429, 500, 502, 503, 504];
    return retryableCodes.includes(appError.statusCode);
  }

  /**
   * Get HTTP status code
   */
  static getStatusCode(error: any): number {
    if (error instanceof AppError) {
      return error.statusCode;
    }
    return 500;
  }

  /**
   * Log error with context
   */
  static logError(
    error: any,
    context: Record<string, any> = {}
  ): void {
    const appError = this.parse(error);
    
    const errorLog = {
      timestamp: new Date().toISOString(),
      code: appError.code,
      message: appError.message,
      statusCode: appError.statusCode,
      details: appError.details,
      context,
      stack: appError.stack,
    };

    const logLevel = appError.statusCode >= 500 ? 'error' : 'warn';
    console[logLevel]('[App Error]', JSON.stringify(errorLog, null, 2));
  }

  /**
   * Create error response
   */
  static createErrorResponse(error: any) {
    const appError = this.parse(error);
    return {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        userMessage: this.getUserMessage(appError),
        statusCode: appError.statusCode,
        ...(process.env.NODE_ENV === 'development' && {
          details: appError.details,
          stack: appError.stack,
        }),
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Try-catch wrapper with error handling
   */
  static async wrapAsync<T>(
    fn: () => Promise<T>,
    errorContext: Record<string, any> = {}
  ): Promise<[Error | null, T | null]> {
    try {
      const result = await fn();
      return [null, result];
    } catch (error) {
      this.logError(error, errorContext);
      return [this.parse(error), null];
    }
  }

  /**
   * Retry logic with exponential backoff
   */
  static async retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        const appError = this.parse(error);
        if (!this.isRetryable(appError)) {
          throw appError;
        }

        if (attempt < maxAttempts) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  /**
   * Create network error details
   */
  static getNetworkErrorDetails(error: any): Record<string, any> {
    return {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url,
      method: error?.config?.method,
      timeout: error?.config?.timeout,
    };
  }

  /**
   * Format error for API response
   */
  static formatForResponse(error: any, includeStack: boolean = false) {
    const appError = this.parse(error);
    const response = {
      success: false,
      error: {
        code: appError.code,
        message: appError.message,
        statusCode: appError.statusCode,
      },
    };

    if (appError.details) {
      response.error.details = appError.details;
    }

    if (includeStack && appError.stack) {
      response.error.stack = appError.stack;
    }

    return response;
  }
}

export default ErrorHandler;
