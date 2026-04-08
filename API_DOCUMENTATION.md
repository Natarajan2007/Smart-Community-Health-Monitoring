# API Documentation

## Overview

The Smart Community Health Monitoring API provides endpoints for AI-powered chat assistance and comprehensive monitoring/analytics.

## Base URL

```
Development: http://localhost:5000
Production: https://api.example.com
```

## Authentication

Currently, the API does not require authentication. Rate limiting is applied per IP address (10 requests per 60 seconds).

## Rate Limiting

- **Limit**: 10 requests per 60 seconds per IP
- **Headers**: 
  - `X-Request-ID`: Unique request identifier
  - `Retry-After`: Seconds to wait before retrying (on 429)

---

## Endpoints

### Chat Endpoints

#### POST `/api/chat`

Send messages to the AI assistant for intelligent responses about DBT, Aadhaar, and related topics.

**Request:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant for explaining Aadhaar and DBT programs."
    },
    {
      "role": "user",
      "content": "What is Aadhaar-linked bank account?"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "An Aadhaar-linked bank account is...",
  "processingTime": 245
}
```

**Response (400 - Validation Error):**
```json
{
  "success": false,
  "error": "Each message must have role and content"
}
```

**Response (429 - Rate Limited):**
```json
{
  "success": false,
  "error": "Too many requests. Please wait before trying again.",
  "retryAfter": 45
}
```

**Parameters:**
| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| messages | array | Yes | 1-50 messages |
| messages[].role | string | Yes | One of: system, user, assistant |
| messages[].content | string | Yes | 1-4000 characters |

**Status Codes:**
- `200` - Success
- `400` - Invalid message format
- `429` - Rate limit exceeded
- `500` - Server error
- `504` - Request timeout

---

### Monitoring Endpoints

#### GET `/api/health`

Check if the API is healthy and return basic health metrics.

**Response (200):**
```json
{
  "status": "healthy",
  "uptime": 3600,
  "memoryUsage": {
    "heapUsed": "45MB",
    "heapTotal": "95MB",
    "rss": "120MB",
    "external": "2MB"
  },
  "metrics": {
    "totalRequests": 150,
    "errorCount": 3,
    "timeoutCount": 0,
    "errorRate": "2.00%",
    "averageResponseTime": "245ms"
  },
  "environment": {
    "nodeVersion": "v24.14.1",
    "platform": "win32",
    "cpuCount": 8
  }
}
```

**Status Code:**
- `200` - Healthy (error rate < 10%)
- `503` - Degraded (error rate >= 10%)

---

#### GET `/api/metrics`

Get detailed performance analytics and recent request statistics.

**Response (200):**
```json
{
  "timestamp": "2026-04-08T10:30:45.123Z",
  "summary": {
    "totalRequests": 150,
    "successCount": 147,
    "errorCount": 3,
    "timeoutCount": 0,
    "errorRate": "2.00%"
  },
  "recentPerformance": {
    "lastRequestCount": 20,
    "successRate": "95.00%",
    "averageResponseTime": "198ms",
    "maxResponseTime": "1250ms",
    "minResponseTime": "45ms"
  },
  "memory": {
    "heapUsed": "45MB",
    "heapTotal": "95MB",
    "rss": "120MB",
    "external": "2MB"
  },
  "uptime": "3600s"
}
```

---

#### GET `/api/status`

Get comprehensive server status including all dependencies.

**Response (200):**
```json
{
  "server": {
    "status": "running",
    "uptime": "3600s",
    "startTime": "2026-04-08T09:30:45.000Z",
    "currentTime": "2026-04-08T10:30:45.123Z",
    "nodeVersion": "v24.14.1",
    "platform": "win32",
    "cpuCount": 8
  },
  "api": {
    "status": "healthy",
    "totalRequests": 150,
    "errors": 3,
    "errorRate": "2.00%",
    "avgResponseTime": "245ms"
  },
  "memory": {
    "heapUsed": "45MB",
    "heapTotal": "95MB",
    "rss": "120MB",
    "external": "2MB"
  },
  "dependencies": {
    "openaiConfigured": true,
    "corsEnabled": true,
    "rateLimitingEnabled": true
  }
}
```

---

#### GET `/api/logs`

Access log analytics including request summaries, errors, and audit trails.

**Response (200):**
```json
{
  "timestamp": "2026-04-08T10:30:45.123Z",
  "requests": {
    "totalRequests": 150,
    "recentRequests": [...],
    "logSize": 150
  },
  "errors": {
    "totalErrors": 5,
    "recentErrors": [...],
    "errorTypes": { "TIMEOUT": 2, "VALIDATION": 3 },
    "endpoints": { "/api/chat": 4, "/api/health": 1 }
  },
  "audits": {
    "totalEvents": 20,
    "recentEvents": [...],
    "actions": { "USER_ACTION": 15, "SYSTEM_EVENT": 5 },
    "entities": { "User": 12, "System": 8 }
  },
  "message": "Log analytics summary"
}
```

---

## Error Handling

### Error Response Format

All errors return a consistent JSON format:

```json
{
  "success": false,
  "error": "Error description",
  "requestId": "req_1712577045123_abc123",
  "stack": "(development only)"
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Invalid request format | Validation failed |
| 429 | Too many requests | Rate limit exceeded |
| 500 | Internal server error | Server error occurred |
| 504 | Request timeout | Request took too long |

---

## Request Examples

### Using cURL

```bash
# Chat request
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "What is DBT?"}
    ]
  }'

# Health check
curl http://localhost:5000/api/health

# Metrics
curl http://localhost:5000/api/metrics

# Status
curl http://localhost:5000/api/status
```

### Using Fetch (JavaScript)

```javascript
// Chat request
const response = await fetch('http://localhost:5000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What is Aadhaar?' }
    ]
  })
});

const data = await response.json();
console.log(data.message);
```

### Using Axios (TypeScript)

```typescript
import axios from 'axios';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  success: boolean;
  message: string;
  processingTime: number;
}

const chat = async (messages: Message[]): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(
    'http://localhost:5000/api/chat',
    { messages }
  );
  return response.data;
};

const result = await chat([
  { role: 'user', content: 'Explain DBT' }
]);
```

---

## Best Practices

### 1. **Request IDs**
- Every response includes `X-Request-ID` header
- Use this for debugging and tracing

### 2. **Rate Limiting**
- Implement exponential backoff when hitting rate limits
- Monitor `Retry-After` header value
- Cache responses when possible

### 3. **Error Handling**
```javascript
try {
  const response = await fetch('/api/chat', {...});
  
  if (!response.ok) {
    if (response.status === 429) {
      // Handle rate limit
      const retryAfter = response.headers.get('Retry-After');
      console.log(`Wait ${retryAfter} seconds`);
    }
    throw new Error(`API Error: ${response.status}`);
  }
  
  return await response.json();
} catch (error) {
  console.error('Request failed:', error);
}
```

### 4. **Message History**
- Keep conversation context for better responses
- Limit to last 10-20 messages for performance
- Include system prompts for context

---

## Monitoring & Analytics

Use the monitoring endpoints to:
- Check service health
- Monitor performance trends
- Track error rates
- Access audit logs

See [MONITORING.md](../MONITORING.md) and [LOGGING.md](../LOGGING.md) for detailed guides.

---

## Support

For API issues or questions:
- Check [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- Review [LOGGING.md](../LOGGING.md) for debug info
- Check [MONITORING.md](../MONITORING.md) for diagnostics
