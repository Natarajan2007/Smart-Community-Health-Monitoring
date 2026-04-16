/**
 * Enhanced Logger - Production-safe logging utility
 * Logs only important information to production console
 * Sanitizes sensitive data and respects NODE_ENV
 */

const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format log message with timestamp and level
 * @param {string} level - Log level
 * @param {string} label - Label for the log
 * @param {any} data - Data to log
 * @returns {string} Formatted message
 */
const formatLog = (level, label, data) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level}] ${label}: ${typeof data === 'object' ? JSON.stringify(data) : data}`;
};

/**
 * Sanitize sensitive data from objects
 * @param {any} data - Data to sanitize
 * @returns {any} Sanitized data
 */
const sanitizeData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sensitiveKeys = ['token', 'password', 'apiKey', 'secret', 'key'];
  const sanitized = Array.isArray(data) ? [...data] : {...data};

  const sanitizeValueIfSensitive = (obj) => {
    Object.keys(obj).forEach(key => {
      if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        sanitizeValueIfSensitive(obj[key]);
      }
    });
  };

  sanitizeValueIfSensitive(sanitized);
  return sanitized;
};

/**
 * Production-safe logger
 */
export const logger = {
  /**
   * Log error (always in any environment)
   * @param {string} label - Error label
   * @param {Error|any} error - Error object or data
   */
  error: (label, error) => {
    const sanitized = sanitizeData(error);
    console.error(formatLog(LOG_LEVELS.ERROR, label, sanitized));
  },

  /**
   * Log warning (in development and production)
   * @param {string} label - Warning label
   * @param {any} data - Data to log
   */
  warn: (label, data) => {
    if (process.env.NODE_ENV !== 'production') {
      const sanitized = sanitizeData(data);
      console.warn(formatLog(LOG_LEVELS.WARN, label, sanitized));
    }
  },

  /**
   * Log info (development only)
   * @param {string} label - Info label
   * @param {any} data - Data to log
   */
  info: (label, data) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitized = sanitizeData(data);
      console.info(formatLog(LOG_LEVELS.INFO, label, sanitized));
    }
  },

  /**
   * Log debug (development only)
   * @param {string} label - Debug label
   * @param {any} data - Data to log
   */
  debug: (label, data) => {
    if (process.env.NODE_ENV === 'development') {
      const sanitized = sanitizeData(data);
      console.log(formatLog(LOG_LEVELS.DEBUG, label, sanitized));
    }
  },

  /**
   * Log performance metrics
   * @param {string} label - Metric label
   * @param {number} duration - Duration in ms
   * @param {string} status - Operation status (success, failed)
   */
  metric: (label, duration, status = 'success') => {
    if (process.env.NODE_ENV === 'development') {
      const message = `${label}: ${duration}ms [${status}]`;
      console.log(`[METRIC] ${message}`);
    }
  }
};

export default logger;
