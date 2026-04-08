/**
 * Health Check Service
 * Monitors server and dependency health with detailed diagnostics
 */

export class HealthCheckService {
  constructor() {
    this.metrics = {
      apiCalls: 0,
      apiErrors: 0,
      apiTimeout: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      startTime: Date.now(),
    };
    this.requestMetrics = [];
  }

  /**
   * Record API request metric
   * @param {number} duration - Request duration in milliseconds
   * @param {number} status - HTTP status code
   * @param {boolean} success - Whether request succeeded
   */
  recordRequest(duration, status, success) {
    this.metrics.apiCalls++;
    
    if (!success) {
      this.metrics.apiErrors++;
    }
    
    if (status === 504 || status === 408) {
      this.metrics.apiTimeout++;
    }
    
    this.metrics.totalResponseTime += duration;
    this.metrics.averageResponseTime = Math.round(this.metrics.totalResponseTime / this.metrics.apiCalls);
    
    this.requestMetrics.push({
      timestamp: Date.now(),
      duration,
      status,
      success
    });
    
    // Keep only last 100 metrics to avoid memory leak
    if (this.requestMetrics.length > 100) {
      this.requestMetrics.shift();
    }
  }

  /**
   * Check API health status
   * @returns {Object} Health check result
   */
  getHealthStatus() {
    const uptime = Date.now() - this.metrics.startTime;
    const errorRate = this.metrics.apiCalls > 0 
      ? ((this.metrics.apiErrors / this.metrics.apiCalls) * 100).toFixed(2)
      : 0;
    
    const status = errorRate > 10 ? 'degraded' : 'healthy';
    
    return {
      status,
      uptime: Math.round(uptime / 1000), // seconds
      memoryUsage: this._getMemoryUsage(),
      metrics: {
        totalRequests: this.metrics.apiCalls,
        errorCount: this.metrics.apiErrors,
        timeoutCount: this.metrics.apiTimeout,
        errorRate: `${errorRate}%`,
        averageResponseTime: `${this.metrics.averageResponseTime}ms`
      },
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cpuCount: require('os').cpus().length
      }
    };
  }

  /**
   * Get memory usage details
   * @private
   * @returns {Object} Memory usage info
   */
  _getMemoryUsage() {
    const mem = process.memoryUsage();
    return {
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      external: `${Math.round(mem.external / 1024 / 1024)}MB`
    };
  }

  /**
   * Get detailed metrics for monitoring
   * @returns {Object} Detailed metrics
   */
  getDetailedMetrics() {
    const recentRequests = this.requestMetrics.slice(-20); // Last 20 requests
    const successCount = recentRequests.filter(r => r.success).length;
    const avgRecent = recentRequests.length > 0
      ? Math.round(recentRequests.reduce((sum, r) => sum + r.duration, 0) / recentRequests.length)
      : 0;
    
    return {
      timestamp: new Date().toISOString(),
      summary: {
        totalRequests: this.metrics.apiCalls,
        successCount: this.metrics.apiCalls - this.metrics.apiErrors,
        errorCount: this.metrics.apiErrors,
        timeoutCount: this.metrics.apiTimeout,
        errorRate: `${((this.metrics.apiErrors / Math.max(this.metrics.apiCalls, 1)) * 100).toFixed(2)}%`
      },
      recentPerformance: {
        lastRequestCount: recentRequests.length,
        successRate: `${((successCount / Math.max(recentRequests.length, 1)) * 100).toFixed(2)}%`,
        averageResponseTime: `${avgRecent}ms`,
        maxResponseTime: `${Math.max(...recentRequests.map(r => r.duration), 0)}ms`,
        minResponseTime: `${Math.min(...recentRequests.map(r => r.duration), 0)}ms`
      },
      memory: this._getMemoryUsage(),
      uptime: `${Math.round((Date.now() - this.metrics.startTime) / 1000)}s`
    };
  }

  /**
   * Reset metrics (useful for testing)
   */
  reset() {
    this.metrics = {
      apiCalls: 0,
      apiErrors: 0,
      apiTimeout: 0,
      averageResponseTime: 0,
      totalResponseTime: 0,
      startTime: Date.now(),
    };
    this.requestMetrics = [];
  }
}

export default new HealthCheckService();
