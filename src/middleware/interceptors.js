/**
 * Request/Response Interceptors
 * Axios interceptors for requests and responses
 */

import axios from 'axios';

/**
 * Create HTTP client with interceptors
 */
export const createHttpClient = (baseURL, options = {}) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add timestamp
      config.metadata = { startTime: Date.now() };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[API Request]', {
          method: config.method.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      return Promise.reject(error);
    }
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      // Calculate request duration
      const duration = Date.now() - response.config.metadata.startTime;

      // Log response in development
      if (process.env.NODE_ENV === 'development') {
        console.log('[API Response]', {
          method: response.config.method.toUpperCase(),
          url: response.config.url,
          status: response.status,
          duration: `${duration}ms`,
          data: response.data,
        });
      }

      return response;
    },
    (error) => {
      const config = error.config || {};
      const duration = Date.now() - (config.metadata?.startTime || 0);

      // Handle specific error codes
      if (error.response?.status === 401) {
        // Token expired - refresh and retry
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Auth Error] Token expired, attempting refresh...');
        }
        localStorage.removeItem('authToken');
        // Redirect to login
        window.location.href = '/login';
      }

      if (error.response?.status === 429) {
        // Rate limit - exponential backoff
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Rate Limit] Backing off...');
        }
      }

      if (error.response?.status >= 500) {
        // Server error
        if (process.env.NODE_ENV === 'development') {
          console.error('[Server Error]', error.response.data);
        }
      }

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[API Error]', {
          method: config.method?.toUpperCase(),
          url: config.url,
          status: error.response?.status,
          duration: `${duration}ms`,
          error: error.message,
        });
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Retry interceptor for failed requests
 */
export const addRetryInterceptor = (client, maxRetries = 3, retryDelay = 1000) => {
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      // Initialize retry count
      if (!config.retryCount) {
        config.retryCount = 0;
      }

      // Check if we should retry
      const isRetryable =
        (error.response?.status >= 500 && error.response?.status < 600) ||
        error.response?.status === 429 ||
        error.code === 'ECONNABORTED' ||
        error.code === 'ENOTFOUND';

      if (config.retryCount < maxRetries && isRetryable) {
        config.retryCount += 1;
        const baseDelay = retryDelay * Math.pow(2, config.retryCount - 1);
        const delay = baseDelay + Math.random() * 1000; // Add jitter

        if (process.env.NODE_ENV === 'development') {
          console.log(
            `[Retry] Attempt ${config.retryCount}/${maxRetries} after ${delay}ms - ${config.url}`
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        return client(config);
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Cache interceptor for GET requests
 */
export const addCacheInterceptor = (client, cacheDuration = 5 * 60 * 1000) => {
  const cache = new Map();

  client.interceptors.request.use((config) => {
    if (config.method === 'get') {
      const cacheKey = `${config.method}:${config.url}`;
      const cachedData = cache.get(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
        config.cached = true;
        config.cachedData = cachedData.data;
      }
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      if (response.config.method === 'get') {
        const cacheKey = `${response.config.method}:${response.config.url}`;
        cache.set(cacheKey, {
          data: response.data,
          timestamp: Date.now(),
        });
      }
      return response;
    },
    (error) => {
      // Return cached data if available
      if (error.config.cached && error.config.cachedData) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Cache] Returning cached data due to network error');
        }
        return Promise.resolve({
          data: error.config.cachedData,
          status: 200,
          cached: true,
        });
      }
      return Promise.reject(error);
    }
  );
};

/**
 * Add authorization header interceptor
 */
export const addAuthInterceptor = (client, getToken) => {
  client.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

/**
 * Add request validation interceptor
 */
export const addRequestValidationInterceptor = (client, validators = {}) => {
  client.interceptors.request.use((config) => {
    const validator = validators[config.method?.toUpperCase()];

    if (validator && !validator(config)) {
      throw new Error(`Request validation failed for ${config.url}`);
    }

    return config;
  });
};

/**
 * Add response transformation interceptor
 */
export const addResponseTransformInterceptor = (client, transformers = {}) => {
  client.interceptors.response.use((response) => {
    const transformer = transformers[response.config.method?.toUpperCase()];

    if (transformer) {
      response.data = transformer(response.data);
    }

    return response;
  });
};

/**
 * Get request/response statistics
 */
export const getInterceptorStats = (client) => {
  return {
    requestCount: client.interceptors.request.handlers.length,
    responseCount: client.interceptors.response.handlers.length,
  };
};

export default {
  createHttpClient,
  addRetryInterceptor,
  addCacheInterceptor,
  addAuthInterceptor,
  addRequestValidationInterceptor,
  addResponseTransformInterceptor,
  getInterceptorStats,
};
