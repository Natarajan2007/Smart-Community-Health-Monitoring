/**
 * Advanced Logging Service
 * Comprehensive logging with request tracking, audit trails, and structured logging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

export class AdvancedLogger {
  constructor(logName = 'app', enableFileLogging = false) {
    this.logName = logName;
    this.enableFileLogging = enableFileLogging;
    this.requestLog = [];
    this.errorLog = [];
    this.auditLog = [];
  }

  /**
   * Format log message with timestamp and level
   * @private
   * @param {string} level - Log level (INFO, ERROR, WARN, DEBUG)
   * @param {string} message - Log message
   * @param {object} data - Additional data
   * @param {string} requestId - Request ID for tracking
   * @returns {string} Formatted log message
   */
  _formatLog(level, message, data, requestId = '') {
    const timestamp = new Date().toISOString();
    const requestIdStr = requestId ? ` [${requestId}]` : '';
    const dataStr = Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${level}${requestIdStr}: ${message}${dataStr}`;
  }

  /**
   * Log to console
   * @private
   * @param {string} level - Log level
   * @param {string} formattedMessage - Pre-formatted message
   */
  _logToConsole(level, formattedMessage) {
    switch (level) {
      case 'ERROR':
        console.error(formattedMessage);
        break;
      case 'WARN':
        console.warn(formattedMessage);
        break;
      case 'DEBUG':
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  /**
   * Log to file
   * @private
   * @param {string} level - Log level
   * @param {string} formattedMessage - Pre-formatted message
   */
  _logToFile(level, formattedMessage) {
    if (!this.enableFileLogging) return;

    try {
      const logFile = path.join(LOG_DIR, `${level.toLowerCase()}.log`);
      const allLogsFile = path.join(LOG_DIR, 'all.log');

      // Write to level-specific log
      fs.appendFileSync(logFile, formattedMessage + '\n');
      // Write to combined log
      fs.appendFileSync(allLogsFile, formattedMessage + '\n');

      // Clean up old logs (keep only 7 days)
      this._cleanOldLogs();
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Clean up old log files
   * @private
   */
  _cleanOldLogs() {
    try {
      const now = Date.now();
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

      fs.readdirSync(LOG_DIR).forEach(file => {
        const filePath = path.join(LOG_DIR, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() && now - stat.mtimeMs > sevenDaysInMs) {
          fs.unlinkSync(filePath);
        }
      });
    } catch (error) {
      console.error('Failed to clean old logs:', error.message);
    }
  }

  /**
   * Log info level message
   * @param {string} message - Log message
   * @param {object} data - Additional data
   * @param {string} requestId - Request ID
   */
  info(message, data = {}, requestId = '') {
    const formatted = this._formatLog('INFO', message, data, requestId);
    this._logToConsole('INFO', formatted);
    this._logToFile('INFO', formatted);
    this.requestLog.push({ timestamp: Date.now(), level: 'INFO', message, data, requestId });
  }

  /**
   * Log error level message
   * @param {string} message - Log message
   * @param {object} error - Error object
   * @param {string} requestId - Request ID
   */
  error(message, error = {}, requestId = '') {
    const errorData = {
      message: error.message || error.toString(),
      stack: error.stack || 'No stack trace',
      code: error.code || 'UNKNOWN',
      ...error
    };
    const formatted = this._formatLog('ERROR', message, errorData, requestId);
    this._logToConsole('ERROR', formatted);
    this._logToFile('ERROR', formatted);
    this.errorLog.push({
      timestamp: Date.now(),
      level: 'ERROR',
      message,
      error: errorData,
      requestId
    });
  }

  /**
   * Log warning level message
   * @param {string} message - Log message
   * @param {object} data - Additional data
   * @param {string} requestId - Request ID
   */
  warn(message, data = {}, requestId = '') {
    const formatted = this._formatLog('WARN', message, data, requestId);
    this._logToConsole('WARN', formatted);
    this._logToFile('WARN', formatted);
  }

  /**
   * Log debug level message
   * @param {string} message - Log message
   * @param {object} data - Additional data
   * @param {string} requestId - Request ID
   */
  debug(message, data = {}, requestId = '') {
    if (process.env.DEBUG !== 'true') return;
    const formatted = this._formatLog('DEBUG', message, data, requestId);
    this._logToConsole('DEBUG', formatted);
    this._logToFile('DEBUG', formatted);
  }

  /**
   * Log API request
   * @param {object} req - Express request object
   * @param {object} metadata - Additional metadata
   */
  logRequest(req, metadata = {}) {
    this.info('API Request', {
      method: req.method,
      path: req.path,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      ...metadata
    }, req.id);
  }

  /**
   * Log API response
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   * @param {number} duration - Request duration in ms
   * @param {object} metadata - Additional metadata
   */
  logResponse(req, res, duration, metadata = {}) {
    this.info('API Response', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      size: res.get('content-length') || 'unknown',
      ...metadata
    }, req.id);
  }

  /**
   * Log audit event (for security/compliance)
   * @param {string} action - Action performed
   * @param {string} entity - Entity affected
   * @param {object} details - Audit details
   * @param {string} requestId - Request ID
   */
  audit(action, entity, details = {}, requestId = '') {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action,
      entity,
      details,
      requestId
    };
    this.auditLog.push(auditEntry);
    this.info('AUDIT', auditEntry, requestId);
    this._logToFile('AUDIT', JSON.stringify(auditEntry));
  }

  /**
   * Log API error with context
   * @param {string} endpoint - API endpoint
   * @param {object} error - Error object
   * @param {object} context - Request context
   * @param {string} requestId - Request ID
   */
  logApiError(endpoint, error, context = {}, requestId = '') {
    const errorEntry = {
      endpoint,
      errorMessage: error.message,
      errorCode: error.code || error.status || 'UNKNOWN',
      statusCode: error.statusCode || 500,
      timestamp: new Date().toISOString(),
      context,
      requestId
    };
    this.errorLog.push(errorEntry);
    this.error(`API Error at ${endpoint}`, error, requestId);
  }

  /**
   * Get request log summary
   * @returns {object} Summary of requests
   */
  getRequestSummary() {
    return {
      totalRequests: this.requestLog.length,
      recentRequests: this.requestLog.slice(-10),
      logSize: this.requestLog.length
    };
  }

  /**
   * Get error log summary
   * @returns {object} Summary of errors
   */
  getErrorSummary() {
    return {
      totalErrors: this.errorLog.length,
      recentErrors: this.errorLog.slice(-10),
      errorTypes: this._groupByProperty(this.errorLog, 'error.code'),
      endpoints: this._groupByProperty(this.errorLog, 'endpoint')
    };
  }

  /**
   * Get audit log summary
   * @returns {object} Summary of audit events
   */
  getAuditSummary() {
    return {
      totalEvents: this.auditLog.length,
      recentEvents: this.auditLog.slice(-10),
      actions: this._groupByProperty(this.auditLog, 'action'),
      entities: this._groupByProperty(this.auditLog, 'entity')
    };
  }

  /**
   * Group log entries by property
   * @private
   */
  _groupByProperty(logs, property) {
    return logs.reduce((acc, log) => {
      const keys = property.split('.');
      const value = keys.reduce((obj, key) => obj?.[key], log) || 'unknown';
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }

  /**
   * Clear logs
   */
  clear() {
    this.requestLog = [];
    this.errorLog = [];
    this.auditLog = [];
  }
}

export default new AdvancedLogger('app', process.env.FILE_LOGGING === 'true');
