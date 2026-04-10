/**
 * API Response Standardization
 * Standardized response format for all API endpoints
 */

/**
 * Standard API response wrapper
 */
export class ApiResponse {
  constructor(
    success = true,
    data = null,
    message = null,
    error = null,
    statusCode = 200
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.error = error;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  static success(data, message = 'Success', statusCode = 200) {
    return new ApiResponse(true, data, message, null, statusCode);
  }

  static created(data, message = 'Resource created successfully') {
    return new ApiResponse(true, data, message, null, 201);
  }

  static noContent() {
    return new ApiResponse(true, null, 'No content', null, 204);
  }

  static badRequest(error, message = 'Bad request') {
    return new ApiResponse(false, null, message, error, 400);
  }

  static unauthorized(error = 'Unauthorized', message = 'Authentication required') {
    return new ApiResponse(false, null, message, error, 401);
  }

  static forbidden(error = 'Forbidden', message = 'Access denied') {
    return new ApiResponse(false, null, message, error, 403);
  }

  static notFound(error = 'Not found', message = 'Resource not found') {
    return new ApiResponse(false, null, message, error, 404);
  }

  static conflict(error, message = 'Conflict') {
    return new ApiResponse(false, null, message, error, 409);
  }

  static serverError(error, message = 'Internal server error') {
    return new ApiResponse(false, null, message, error, 500);
  }

  static serviceUnavailable(error = 'Service unavailable', message = 'Service temporarily unavailable') {
    return new ApiResponse(false, null, message, error, 503);
  }

  toJSON() {
    return {
      success: this.success,
      data: this.data,
      message: this.message,
      ...(this.error && { error: this.error }),
      timestamp: this.timestamp,
    };
  }
}

/**
 * Paginated response wrapper
 */
export class PaginatedResponse extends ApiResponse {
  constructor(
    data = [],
    page = 1,
    limit = 10,
    total = 0,
    message = 'Success'
  ) {
    super(true, data, message, null, 200);
    this.pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit),
    };
  }

  static create(data, page, limit, total, message = 'Success') {
    return new PaginatedResponse(data, page, limit, total, message);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      pagination: this.pagination,
    };
  }
}

/**
 * Express response helper middleware
 */
export const responseHelper = (req, res, next) => {
  // Success response
  res.success = (data, message = 'Success', statusCode = 200) => {
    const response = ApiResponse.success(data, message, statusCode);
    return res.status(statusCode).json(response.toJSON());
  };

  // Created response
  res.created = (data, message = 'Resource created successfully') => {
    const response = ApiResponse.created(data, message);
    return res.status(201).json(response.toJSON());
  };

  // No content response
  res.noContent = () => {
    return res.status(204).send();
  };

  // Bad request response
  res.badRequest = (error, message = 'Bad request') => {
    const response = ApiResponse.badRequest(error, message);
    return res.status(400).json(response.toJSON());
  };

  // Unauthorized response
  res.unauthorized = (error = 'Unauthorized') => {
    const response = ApiResponse.unauthorized(error);
    return res.status(401).json(response.toJSON());
  };

  // Forbidden response
  res.forbidden = (error = 'Forbidden') => {
    const response = ApiResponse.forbidden(error);
    return res.status(403).json(response.toJSON());
  };

  // Not found response
  res.notFound = (error = 'Not found') => {
    const response = ApiResponse.notFound(error);
    return res.status(404).json(response.toJSON());
  };

  // Conflict response
  res.conflict = (error, message = 'Conflict') => {
    const response = ApiResponse.conflict(error, message);
    return res.status(409).json(response.toJSON());
  };

  // Server error response
  res.serverError = (error, message = 'Internal server error') => {
    const response = ApiResponse.serverError(error, message);
    return res.status(500).json(response.toJSON());
  };

  // Service unavailable response
  res.serviceUnavailable = (error = 'Service unavailable') => {
    const response = ApiResponse.serviceUnavailable(error);
    return res.status(503).json(response.toJSON());
  };

  // Paginated response
  res.paginated = (data, page, limit, total, message = 'Success') => {
    const response = PaginatedResponse.create(data, page, limit, total, message);
    return res.status(200).json(response.toJSON());
  };

  next();
};

export default {
  ApiResponse,
  PaginatedResponse,
  responseHelper,
};
