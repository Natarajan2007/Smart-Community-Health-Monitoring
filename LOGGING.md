# Advanced Logging & Audit Trail

## Overview

The application includes an advanced logging system with request tracking, error logging, audit trails, and structured logging for comprehensive monitoring and compliance.

## Features

### 1. **Request/Response Logging**
- Automatic logging of all API requests and responses
- Request duration tracking
- Response size monitoring
- IP address and user-agent tracking
- Optional request/response body logging

### 2. **Error Logging**
- Comprehensive error tracking with stack traces
- HTTP error status logging
- Error categorization by type
- Error context preservation
- Endpoint-specific error metrics

### 3. **Audit Trail**
- Security-focused event logging
- Action and entity tracking
- Timestamp and request ID association
- Compliance-ready audit logs
- Customizable audit events

### 4. **Structured Logging**
- JSON-formatted logs for easy parsing
- Timestamp and request ID for correlation
- Hierarchical logging levels
- Optional file-based persistence

## Using Advanced Logger

### Basic Setup

```javascript
import advancedLogger from './services/advancedLogger.js';
import { createLoggingMiddleware, errorLoggingMiddleware } from './services/loggingMiddleware.js';

const app = express();

// Add logging middleware
app.use(createLoggingMiddleware({
  logRequests: true,
  logResponses: true,
  logErrors: true,
  excludePaths: ['/health', '/metrics'],
  includeBody: false,
  includeHeaders: false
}));

// Log specific action
advancedLogger.info('Server started', { port: 5000 });

// Add error handling
app.use(errorLoggingMiddleware);
```

### Logging Methods

```javascript
// Info level
advancedLogger.info('User logged in', { userId: 123, email: 'user@example.com' }, requestId);

// Error level (with error object)
advancedLogger.error('Database error', new Error('Connection failed'), requestId);

// Warning level
advancedLogger.warn('High memory usage', { heapUsed: '150MB' }, requestId);

// Debug level (only if DEBUG=true)
advancedLogger.debug('Processing request', { payload: {...} }, requestId);

// Audit logging (for compliance)
advancedLogger.audit('USER_DELETE', 'User', { userId: 123, reason: 'Request' }, requestId);

// API-specific error logging
advancedLogger.logApiError('/api/users', error, { username: 'john' }, requestId);
```

### Request/Response Logging

```javascript
// Manual request logging
advancedLogger.logRequest(req, { timestamp: Date.now() });

// Manual response logging
advancedLogger.logResponse(req, res, 245, { records: 100 });
```

## Logging Levels

| Level | Usage | Example |
|-------|-------|---------|
| INFO | General information | User actions, milestone events |
| WARN | Warning conditions | High memory, deprecated API use |
| ERROR | Error events | Failed requests, exceptions |
| DEBUG | Detailed diagnostics | Variable states, data values |
| AUDIT | Security events | User actions, data changes |

## Log File Structure

When `FILE_LOGGING=true`, logs are stored in `/logs/`:

```
logs/
├── info.log          # Info level messages
├── error.log         # Error level messages
├── warn.log          # Warning level messages
├── debug.log         # Debug level messages
├── audit.log         # Audit trail events
└── all.log           # Combined log
```

## Accessing Log Analytics

### In-Memory Analytics

```javascript
// Get request summary
const requests = advancedLogger.getRequestSummary();
// { totalRequests: 150, recentRequests: [...], logSize: 150 }

// Get error summary
const errors = advancedLogger.getErrorSummary();
// { totalErrors: 5, recentErrors: [...], errorTypes: {...}, endpoints: {...} }

// Get audit summary
const audits = advancedLogger.getAuditSummary();
// { totalEvents: 20, recentEvents: [...], actions: {...}, entities: {...} }
```

### Middleware Options

```javascript
{
  logRequests: true,        // Log incoming requests
  logResponses: true,       // Log outgoing responses
  logErrors: true,          // Log errors
  excludePaths: [],         // Skip paths like /health
  includeHeaders: false,    // Include request headers
  includeBody: false        // Include request/response body
}
```

## Audit Trail Example

```javascript
// Track user creation
app.post('/api/users', createAuditMiddleware('USER_CREATE', 'User', (req) => ({
  userId: req.body.id,
  username: req.body.username,
  role: req.body.role,
  createdAt: new Date().toISOString()
})));

// Track data export
app.post('/api/export', createAuditMiddleware('DATA_EXPORT', 'Report', (req) => ({
  reportType: req.body.type,
  recordCount: req.body.records?.length,
  exportedAt: new Date().toISOString()
})));
```

## Log Retention

- Logs older than 7 days are automatically cleaned up
- In-memory logs (request/error/audit) are stored indefinitely
- Use `advancedLogger.clear()` to clear in-memory logs
- File-based logs use automatic rotation

## Query Examples

### Find requests for a specific user
```javascript
const userRequests = advancedLogger.requestLog
  .filter(log => log.data?.userId === '123');
```

### Find slow requests
```javascript
const slowRequests = advancedLogger.requestLog
  .filter(log => log.data?.duration > 1000);
```

### Find recent errors
```javascript
const recentErrors = advancedLogger.errorLog
  .slice(-20);
```

### Audit changes to specific entity
```javascript
const userAudits = advancedLogger.auditLog
  .filter(log => log.entity === 'User' && log.action === 'USER_UPDATE');
```

## Performance Considerations

- Logging adds ~1-2ms per request
- In-memory storage uses ~2-5MB per 10,000 logs
- Enable file logging only for production
- Use excludePaths for high-volume endpoints
- Consider log rotation for long-running processes

## Best Practices

1. **Always include request IDs** for tracing across services
2. **Use appropriate log levels** to avoid log pollution
3. **Audit sensitive operations** for compliance
4. **Monitor log size** to prevent memory leaks
5. **Keep sensitive data out** of logs (passwords, tokens)
6. **Use structured data** for better query-ability
7. **Set up log rotation** in production
8. **Aggregate logs** from multiple instances

## Troubleshooting

### Logs not appearing
- Check `DEBUG=true` environment variable for DEBUG level
- Verify middleware is registered before routes
- Ensure error handler is last middleware

### Too many logs
- Use `excludePaths` to skip noisy endpoints
- Reduce `includeBody` logging
- Filter by log level

### Memory issues
- Reduce in-memory log retention
- Enable file logging instead
- Call `advancedLogger.clear()` periodically

## Integration Examples

### With ELK Stack
```javascript
// Ship logs to Elasticsearch
const logstash = require('logstash-client');
const logger = new logstash.Logger({...});

advancedLogger.info = (msg, data) => {
  logger.send(JSON.stringify({ message: msg, data }));
};
```

### With Sentry
```javascript
import * as Sentry from "@sentry/node";

// Error logging integrated with Sentry
advancedLogger.error = (msg, error) => {
  Sentry.captureException(error, { contexts: { message: msg } });
};
```
