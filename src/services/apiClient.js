/**
 * API Client Service
 * Centralized Axios instance with interceptors for logging, error handling, and auth
 * @module apiClient
 */

import axios from 'axios';
import { getEnvVariable, isProduction } from '../utils/envValidator';
import {
  setupAxiosLogging,
  logError,
  logInfo,
  setLogLevel,
  LOG_LEVELS
} from './loggingService';
import { sanitizeInput } from './openaiService';

/**
 * Create and configure API client
 * @param {Object} config - Configuration options
 * @param {string} config.baseURL - Base URL for API
 * @param {number} config.timeout - Request timeout in ms
 * @param {Object} config.headers - Default headers
 * @returns {Object} Configured Axios instance
 */
const createApiClient = (config = {}) => {
  const baseURL = getEnvVariable('VITE_API_URL', 'http://localhost:5000');
  const timeout = parseInt(getEnvVariable('REQUEST_TIMEOUT', '30000'));

  const client = axios.create({
    baseURL,
    timeout,
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    ...config
  });

  // Setup logging interceptor
  setupAxiosLogging(client);

  // Request interceptor - add auth, sanitize input
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Sanitize request data
      if (config.data) {
        if (typeof config.data === 'string') {
          config.data = sanitizeInput(config.data);
        } else if (typeof config.data === 'object') {
          Object.keys(config.data).forEach((key) => {
            if (typeof config.data[key] === 'string') {
              config.data[key] = sanitizeInput(config.data[key]);
            }
          });
        }
      }

      // Add request metadata for timing
      config.metadata = { startTime: performance.now() };

      return config;
    },
    (error) => {
      logError('REQUEST_INTERCEPTOR', 'N/A', error, {
        stage: 'request_setup'
      });
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle errors, logging
  client.interceptors.response.use(
    (response) => {
      const duration = performance.now() - response.config.metadata.startTime;

      // Log successful API calls in development
      if (!isProduction()) {
        logInfo(`API Success: ${response.config.method.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          duration: `${duration.toFixed(2)}ms`
        });
      }

      return response;
    },
    (error) => {
      const duration = error.config
        ? performance.now() - error.config.metadata.startTime
        : 0;

      // Handle specific error cases
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        switch (status) {
          case 400:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'BAD_REQUEST', duration }
            );
            break;

          case 401:
            // Unauthorized - clear auth and redirect
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'UNAUTHORIZED', cleared: 'auth_token' }
            );
            break;

          case 403:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'FORBIDDEN' }
            );
            break;

          case 404:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'NOT_FOUND' }
            );
            break;

          case 429:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'RATE_LIMITED', retryAfter: error.response.headers['retry-after'] }
            );
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'SERVER_ERROR', status }
            );
            break;

          default:
            logError(
              error.config?.method?.toUpperCase() || 'REQUEST',
              error.config?.url || 'unknown',
              error,
              { type: 'API_ERROR', status }
            );
        }
      } else if (error.request) {
        // Request made but no response
        logError(
          'REQUEST',
          'unknown',
          error,
          { type: 'NO_RESPONSE', duration }
        );
      } else {
        // Error in request setup
        logError(
          'REQUEST',
          'unknown',
          error,
          { type: 'REQUEST_ERROR', duration }
        );
      }

      return Promise.reject(error);
    }
  );

  return client;
};

/**
 * Initialize API client with all interceptors
 */
const apiClient = createApiClient();

/**
 * Set API client log level
 * @param {number} level - Log level from LOG_LEVELS
 */
export const setApiLogLevel = (level) => {
  setLogLevel(level);
};

/**
 * Get current API client instance
 * @returns {Object} Axios instance
 */
export const getApiClient = () => {
  return apiClient;
};

/**
 * Make GET request
 * @param {string} url - Endpoint URL
 * @param {Object} config - Request config
 * @returns {Promise} Response data
 */
export const get = (url, config = {}) => {
  return apiClient.get(url, config).then((res) => res.data);
};

/**
 * Make POST request
 * @param {string} url - Endpoint URL
 * @param {*} data - Request payload
 * @param {Object} config - Request config
 * @returns {Promise} Response data
 */
export const post = (url, data, config = {}) => {
  return apiClient.post(url, data, config).then((res) => res.data);
};

/**
 * Make PUT request
 * @param {string} url - Endpoint URL
 * @param {*} data - Request payload
 * @param {Object} config - Request config
 * @returns {Promise} Response data
 */
export const put = (url, data, config = {}) => {
  return apiClient.put(url, data, config).then((res) => res.data);
};

/**
 * Make PATCH request
 * @param {string} url - Endpoint URL
 * @param {*} data - Request payload
 * @param {Object} config - Request config
 * @returns {Promise} Response data
 */
export const patch = (url, data, config = {}) => {
  return apiClient.patch(url, data, config).then((res) => res.data);
};

/**
 * Make DELETE request
 * @param {string} url - Endpoint URL
 * @param {Object} config - Request config
 * @returns {Promise} Response data
 */
export const del = (url, config = {}) => {
  return apiClient.delete(url, config).then((res) => res.data);
};

/**
 * Upload file with progress tracking
 * @param {string} url - Upload endpoint
 * @param {File} file - File to upload
 * @param {Function} onProgress - Progress callback
 * @returns {Promise} Upload result
 */
export const uploadFile = (url, file, onProgress = null) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };

  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentComplete = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentComplete);
    };
  }

  return apiClient.post(url, formData, config).then((res) => res.data);
};

/**
 * Set authorization token
 * @param {string} token - Auth token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('auth_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

/**
 * Get authorization token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

/**
 * Set custom header
 * @param {string} key - Header key
 * @param {string} value - Header value
 */
export const setHeader = (key, value) => {
  apiClient.defaults.headers.common[key] = value;
};

/**
 * Remove custom header
 * @param {string} key - Header key
 */
export const removeHeader = (key) => {
  delete apiClient.defaults.headers.common[key];
};

/**
 * Reset API client to default state
 */
export const resetApiClient = () => {
  delete apiClient.defaults.headers.common['Authorization'];
  localStorage.removeItem('auth_token');
};

export default {
  getApiClient,
  setApiLogLevel,
  get,
  post,
  put,
  patch,
  del,
  uploadFile,
  setAuthToken,
  getAuthToken,
  setHeader,
  removeHeader,
  resetApiClient
};
