/**
 * Request/Response Logging Service
 * Comprehensive logging for API calls, network requests, and client-server communication
 * @module loggingService
 */

/**
 * Logger levels
 */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  SILENT: 4
};

/**
 * Current log level (can be changed)
 */
let currentLogLevel = LOG_LEVELS.INFO;

/**
 * Store for log history (for debugging)
 */
const logHistory = {
  requests: [],
  responses: [],
  errors: [],
  all: []
};

const maxHistorySize = 100;

/**
 * Set the current log level
 * @param {number} level - Log level from LOG_LEVELS
 */
export const setLogLevel = (level) => {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level;
  }
};

/**
 * Get current log level
 * @returns {number} Current log level
 */
export const getLogLevel = () => {
  return currentLogLevel;
};

/**
 * Format timestamp for logs
 * @param {Date} date - Date to format
 * @returns {string} Formatted timestamp
 */
const getTimestamp = (date = new Date()) => {
  return date.toISOString();
};

/**
 * Get color for console output based on type
 * @param {string} type - Log type (request, response, error, warning)
 * @returns {string} Console color code
 */
const getConsoleColor = (type) => {
  const colors = {
    request: 'color: #1976d2; font-weight: bold;', // Blue
    response: 'color: #28a745; font-weight: bold;', // Green
    error: 'color: #dc3545; font-weight: bold;', // Red
    warning: 'color: #ffc107; font-weight: bold;', // Orange
    info: 'color: #17a2b8; font-weight: bold;', // Cyan
    debug: 'color: #6c757d;' // Gray
  };
  return colors[type] || '';
};

/**
 * Log API request
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Object} data - Request payload
 * @param {Object} headers - Request headers
 * @returns {void}
 */
export const logRequest = (method, url, data = null, headers = {}) => {
  if (currentLogLevel > LOG_LEVELS.DEBUG) return;

  const timestamp = getTimestamp();
  const request = {
    timestamp,
    method,
    url,
    data,
    headers,
    size: JSON.stringify(data).length
  };

  // Add to history
  logHistory.requests.push(request);
  logHistory.all.push({ type: 'request', ...request });
  if (logHistory.requests.length > maxHistorySize) {
    logHistory.requests.shift();
  }

  // Console output
  console.log(
    `%c[${method}] ${url}`,
    getConsoleColor('request'),
    `at ${timestamp}`
  );

  if (data) {
    console.table(data);
  }

  if (Object.keys(headers).length > 0 && headers.Authorization) {
    console.log('%cHeaders (sensitive data masked):', 'font-weight: bold;');
    const maskedHeaders = {
      ...headers,
      Authorization: '***'
    };
    console.table(maskedHeaders);
  }
};

/**
 * Log API response
 * @param {string} method - HTTP method
 * @param {string} url - Response URL
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data
 * @param {number} duration - Request duration in ms
 * @returns {void}
 */
export const logResponse = (method, url, status, data = null, duration = 0) => {
  if (currentLogLevel > LOG_LEVELS.DEBUG) return;

  const timestamp = getTimestamp();
  
  // Color code based on status
  const getStatusColor = (code) => {
    if (code >= 200 && code < 300) return 'color: #28a745;'; // Green
    if (code >= 300 && code < 400) return 'color: #17a2b8;'; // Cyan
    if (code >= 400 && code < 500) return 'color: #ffc107;'; // Orange
    return 'color: #dc3545;'; // Red
  };

  const response = {
    timestamp,
    method,
    url,
    status,
    duration,
    data,
    size: JSON.stringify(data).length
  };

  logHistory.responses.push(response);
  logHistory.all.push({ type: 'response', ...response });
  if (logHistory.responses.length > maxHistorySize) {
    logHistory.responses.shift();
  }

  console.log(
    `%c[${status}] ${method} ${url} (${duration}ms)`,
    `${getStatusColor(status)} font-weight: bold;`,
    `at ${timestamp}`
  );

  if (data) {
    console.table(data);
  }
};

/**
 * Log API error
 * @param {string} method - HTTP method
 * @param {string} url - Request URL
 * @param {Error} error - Error object
 * @param {Object} context - Additional context
 * @returns {void}
 */
export const logError = (method, url, error, context = {}) => {
  if (currentLogLevel > LOG_LEVELS.ERROR) return;

  const timestamp = getTimestamp();
  const errorLog = {
    timestamp,
    method,
    url,
    error: {
      message: error.message,
      status: error.status || error.response?.status,
      data: error.data || error.response?.data,
      stack: error.stack
    },
    context
  };

  logHistory.errors.push(errorLog);
  logHistory.all.push({ type: 'error', ...errorLog });
  if (logHistory.errors.length > maxHistorySize) {
    logHistory.errors.shift();
  }

  console.error(
    `%c❌ ERROR [${method}] ${url}`,
    getConsoleColor('error'),
    `at ${timestamp}`
  );

  console.error('Error Details:', {
    message: error.message,
    status: error.status,
    data: error.data
  });

  if (Object.keys(context).length > 0) {
    console.error('Context:', context);
  }
};

/**
 * Log warning
 * @param {string} message - Warning message
 * @param {Object} context - Additional context
 * @returns {void}
 */
export const logWarning = (message, context = {}) => {
  if (currentLogLevel > LOG_LEVELS.WARN) return;

  const timestamp = getTimestamp();

  console.warn(
    `%c⚠️  WARNING: ${message}`,
    getConsoleColor('warning'),
    `at ${timestamp}`
  );

  if (Object.keys(context).length > 0) {
    console.warn('Context:', context);
  }
};

/**
 * Log info message
 * @param {string} message - Info message
 * @param {Object} context - Additional context
 * @returns {void}
 */
export const logInfo = (message, context = {}) => {
  if (currentLogLevel > LOG_LEVELS.INFO) return;

  const timestamp = getTimestamp();

  console.log(
    `%c ℹ️  INFO: ${message}`,
    getConsoleColor('info'),
    `at ${timestamp}`
  );

  if (Object.keys(context).length > 0) {
    console.log('Context:', context);
  }
};

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {Object} data - Debug data
 * @returns {void}
 */
export const logDebug = (message, data = {}) => {
  if (currentLogLevel > LOG_LEVELS.DEBUG) return;

  const timestamp = getTimestamp();

  console.log(
    `%c🔍 DEBUG: ${message}`,
    getConsoleColor('debug'),
    `at ${timestamp}`
  );

  if (Object.keys(data).length > 0) {
    console.table(data);
  }
};

/**
 * Create Axios interceptor for automatic request/response logging
 * @param {Object} axiosInstance - Axios instance
 * @returns {void}
 */
export const setupAxiosLogging = (axiosInstance) => {
  // Request interceptor
  axiosInstance.interceptors.request.use((config) => {
    const startTime = performance.now();
    config.metadata = { startTime };

    logRequest(
      config.method.toUpperCase(),
      config.url,
      config.data,
      config.headers
    );

    return config;
  });

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      const duration = performance.now() - response.config.metadata.startTime;

      logResponse(
        response.config.method.toUpperCase(),
        response.config.url,
        response.status,
        response.data,
        duration
      );

      return response;
    },
    (error) => {
      const duration = performance.now() - (error.config?.metadata?.startTime || 0);

      logError(
        error.config?.method?.toUpperCase() || 'UNKNOWN',
        error.config?.url || 'unknown-url',
        error,
        { duration }
      );

      return Promise.reject(error);
    }
  );
};

/**
 * Get log history
 * @param {string} type - Filter by type: 'requests', 'responses', 'errors', 'all'
 * @returns {Array} Log history
 */
export const getLogHistory = (type = 'all') => {
  return logHistory[type] || [];
};

/**
 * Export logs as JSON
 * Useful for sending to analytics or debugging
 * @returns {Object} Complete log history
 */
export const exportLogs = () => {
  return {
    exportedAt: getTimestamp(),
    logLevel: currentLogLevel,
    requests: logHistory.requests,
    responses: logHistory.responses,
    errors: logHistory.errors,
    summary: {
      totalRequests: logHistory.requests.length,
      totalResponses: logHistory.responses.length,
      totalErrors: logHistory.errors.length
    }
  };
};

/**
 * Clear log history
 * @returns {void}
 */
export const clearLogs = () => {
  logHistory.requests = [];
  logHistory.responses = [];
  logHistory.errors = [];
  logHistory.all = [];
  console.log('%c✅ Log history cleared', 'color: #28a745; font-weight: bold;');
};

/**
 * Generate debugging report
 * Useful for troubleshooting issues
 * @returns {string} Formatted debugging report
 */
export const generateDebugReport = () => {
  const logs = exportLogs();
  
  return `
=== DEBUG REPORT ===
Generated: ${logs.exportedAt}
Log Level: ${Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === logs.logLevel)}

SUMMARY:
- Total Requests: ${logs.summary.totalRequests}
- Total Responses: ${logs.summary.totalResponses}
- Total Errors: ${logs.summary.totalErrors}

ERRORS:
${logs.errors.map(err => `  - ${err.error.message} (${err.method} ${err.url})`).join('\n')}

LAST 5 REQUESTS:
${logs.requests.slice(-5).map(req => `  - ${req.method} ${req.url} (${req.size} bytes)`).join('\n')}

LAST 5 RESPONSES:
${logs.responses.slice(-5).map(res => `  - ${res.status} ${res.method} ${res.url} (${res.duration}ms)`).join('\n')}
  `;
};

/**
 * Log to console with timestamp and formatted output
 * @param {string} level - Log level name
 * @param {string} message - Message to log
 * @param {*} data - Additional data
 * @returns {void}
 */
export const log = (level, message, data = null) => {
  const levelMap = {
    'debug': logDebug,
    'info': logInfo,
    'warn': logWarning,
    'error': logError
  };

  const logger = levelMap[level.toLowerCase()];
  if (logger) {
    logger(message, data);
  }
};

export default {
  LOG_LEVELS,
  setLogLevel,
  getLogLevel,
  logRequest,
  logResponse,
  logError,
  logWarning,
  logInfo,
  logDebug,
  setupAxiosLogging,
  getLogHistory,
  exportLogs,
  clearLogs,
  generateDebugReport,
  log
};
