# API Monitoring & Health Checks

## Overview

The backend API includes comprehensive monitoring endpoints to track server health, performance metrics, and dependency status.

## Monitoring Endpoints

### 1. Health Check Endpoint

**GET** `/api/health`

Returns the current health status of the API with error rates and performance metrics.

**Response:**
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

**Status Codes:**
- `200 OK` - Service is healthy (error rate < 10%)
- `503 Service Unavailable` - Service is degraded (error rate >= 10%)

**Health Thresholds:**
- **Healthy**: Error rate < 10%
- **Degraded**: Error rate >= 10%

---

### 2. Metrics Endpoint

**GET** `/api/metrics`

Returns detailed performance metrics with recent request statistics.

**Response:**
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

**Metrics Tracked:**
- Total requests and success/error counts
- Most recent 20 requests for trend analysis
- Response time statistics (avg, min, max)
- Memory usage and uptime
- Per-request timestamps and status codes

---

### 3. Status Endpoint

**GET** `/api/status`

Returns comprehensive server status including all dependencies.

**Response:**
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

## Monitoring Best Practices

### Set Up Health Checks

Check the health endpoint periodically to detect issues early:

```bash
# Every 30 seconds
curl http://localhost:5000/api/health
```

### Monitor Error Rates

Alert if error rate exceeds thresholds:
- Warning: > 5% error rate
- Critical: > 10% error rate

```javascript
const health = await fetch('http://localhost:5000/api/health').then(r => r.json());
if (parseFloat(health.metrics.errorRate) > 10) {
  // Send alert
}
```

### Track Performance Trends

Check metrics regularly to identify performance degradation:

```javascript
const metrics = await fetch('http://localhost:5000/api/metrics').then(r => r.json());
const avgTime = parseInt(metrics.recentPerformance.averageResponseTime);
if (avgTime > 500) {
  // Investigate slow requests
}
```

### Memory Monitoring

Monitor memory usage to prevent memory leaks:

```javascript
const status = await fetch('http://localhost:5000/api/status').then(r => r.json());
const heapUsed = parseInt(status.memory.heapUsed);
if (heapUsed > 150) {
  // Restart server or investigate
}
```

---

## Integration with Monitoring Tools

### With Prometheus

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/api/metrics'
```

### With DataDog

```javascript
const datadog = require('dogstatsd').StatsD;
const client = new datadog();

// Record metrics
client.gauge('api.uptime', uptime);
client.gauge('api.error_rate', errorRate);
client.gauge('api.avg_response_time', avgResponseTime);
```

### With ELK Stack

Add metric collection to access logs:

```json
GET /api/metrics
GET /api/health
GET /api/status
```

---

## Performance Optimization Tips

1. **Response Time**: Most requests should be < 500ms
2. **Error Rate**: Keep below 1% for production
3. **Memory Usage**: Alert if heap usage > 70% of total
4. **Uptime**: Monitor for unexpected restarts

---

## Troubleshooting

### High Error Rate

Check the metrics endpoint for specific error patterns:
```bash
curl http://localhost:5000/api/metrics
```

### Memory Leak

Monitor memory growth over time:
```bash
# Run every minute
curl http://localhost:5000/api/status | jq '.memory'
```

### Slow Requests

Identify slow requests in the recent metrics:
```bash
curl http://localhost:5000/api/metrics | jq '.recentPerformance.maxResponseTime'
```
