/**
 * Performance Monitoring Service
 * Tracks and reports performance metrics for debugging and optimization
 * @module performanceService
 */

/**
 * Performance metrics store
 * @type {Object}
 */
const metrics = {
  pageMetrics: {},
  apiMetrics: {},
  componentMetrics: {},
  resourceTimings: []
};

/**
 * Record API call performance
 * @param {string} endpoint - API endpoint called
 * @param {number} duration - Request duration in milliseconds
 * @param {number} status - HTTP status code
 * @param {boolean} success - Whether request succeeded
 * @returns {void}
 */
export const recordApiMetric = (endpoint, duration, status, success = true) => {
  if (!metrics.apiMetrics[endpoint]) {
    metrics.apiMetrics[endpoint] = {
      calls: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      successCount: 0,
      errorCount: 0,
      statusCodes: {}
    };
  }

  const metric = metrics.apiMetrics[endpoint];
  metric.calls++;
  metric.totalTime += duration;
  metric.avgTime = metric.totalTime / metric.calls;
  metric.minTime = Math.min(metric.minTime, duration);
  metric.maxTime = Math.max(metric.maxTime, duration);

  if (success) {
    metric.successCount++;
  } else {
    metric.errorCount++;
  }

  if (!metric.statusCodes[status]) {
    metric.statusCodes[status] = 0;
  }
  metric.statusCodes[status]++;

  logPerformanceWarnings(endpoint, duration);
};

/**
 * Record page navigation timing
 * @param {string} pageName - Page identifier
 * @param {number} duration - Time to load in milliseconds
 * @returns {void}
 */
export const recordPageMetric = (pageName, duration) => {
  if (!metrics.pageMetrics[pageName]) {
    metrics.pageMetrics[pageName] = {
      visits: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0,
      timestamps: []
    };
  }

  const metric = metrics.pageMetrics[pageName];
  metric.visits++;
  metric.totalTime += duration;
  metric.avgTime = metric.totalTime / metric.visits;
  metric.minTime = Math.min(metric.minTime, duration);
  metric.maxTime = Math.max(metric.maxTime, duration);
  metric.timestamps.push(new Date().toISOString());
};

/**
 * Record component render time
 * @param {string} componentName - Component identifier
 * @param {number} duration - Render duration in milliseconds
 * @returns {void}
 */
export const recordComponentMetric = (componentName, duration) => {
  if (!metrics.componentMetrics[componentName]) {
    metrics.componentMetrics[componentName] = {
      renders: 0,
      totalTime: 0,
      avgTime: 0,
      minTime: Infinity,
      maxTime: 0
    };
  }

  const metric = metrics.componentMetrics[componentName];
  metric.renders++;
  metric.totalTime += duration;
  metric.avgTime = metric.totalTime / metric.renders;
  metric.minTime = Math.min(metric.minTime, duration);
  metric.maxTime = Math.max(metric.maxTime, duration);

  logPerformanceWarnings(`Component: ${componentName}`, duration);
};

/**
 * Start timing a function execution
 * @param {string} label - Label for the timing
 * @returns {Function} Function to call when done timing
 */
export const startTiming = (label) => {
  const startTime = performance.now();
  
  return () => {
    const duration = performance.now() - startTime;
    console.log(`⏱️  ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  };
};

/**
 * Log performance warnings if metrics exceed thresholds
 * @param {string} label - Label for the metric
 * @param {number} duration - Duration in milliseconds
 * @returns {void}
 */
const logPerformanceWarnings = (label, duration) => {
  // API threshold: 3 seconds
  const apiThreshold = 3000;
  // Component threshold: 100ms
  const componentThreshold = 100;

  if (label.startsWith('Component:') && duration > componentThreshold) {
    console.warn(
      `⚠️  Slow component detected: ${label} took ${duration.toFixed(2)}ms (threshold: ${componentThreshold}ms)`
    );
  } else if (!label.startsWith('Component:') && duration > apiThreshold) {
    console.warn(
      `⚠️  Slow API call: ${label} took ${duration.toFixed(2)}ms (threshold: ${apiThreshold}ms)`
    );
  }
};

/**
 * Get performance summary
 * @returns {Object} Summary of all performance metrics
 */
export const getPerformanceSummary = () => {
  const summary = {
    apiMetrics: metrics.apiMetrics,
    pageMetrics: metrics.pageMetrics,
    componentMetrics: metrics.componentMetrics,
    timestamp: new Date().toISOString()
  };

  return summary;
};

/**
 * Get performance report (formatted for display)
 * @returns {Object} Formatted performance report
 */
export const getPerformanceReport = () => {
  const report = {
    generatedAt: new Date().toISOString(),
    
    apiSummary: {
      totalEndpoints: Object.keys(metrics.apiMetrics).length,
      totalCalls: Object.values(metrics.apiMetrics).reduce(
        (sum, m) => sum + m.calls,
        0
      ),
      endpoints: Object.entries(metrics.apiMetrics).map(([ep, metric]) => ({
        endpoint: ep,
        calls: metric.calls,
        avgTime: `${metric.avgTime.toFixed(2)}ms`,
        minTime: `${metric.minTime.toFixed(2)}ms`,
        maxTime: `${metric.maxTime.toFixed(2)}ms`,
        success: `${metric.successCount}/${metric.calls}`,
        successRate: `${((metric.successCount / metric.calls) * 100).toFixed(1)}%`
      }))
    },

    pageSummary: {
      totalPages: Object.keys(metrics.pageMetrics).length,
      totalVisits: Object.values(metrics.pageMetrics).reduce(
        (sum, m) => sum + m.visits,
        0
      ),
      pages: Object.entries(metrics.pageMetrics).map(([page, metric]) => ({
        page,
        visits: metric.visits,
        avgTime: `${metric.avgTime.toFixed(2)}ms`,
        minTime: `${metric.minTime.toFixed(2)}ms`,
        maxTime: `${metric.maxTime.toFixed(2)}ms`
      }))
    },

    componentSummary: {
      totalComponents: Object.keys(metrics.componentMetrics).length,
      totalRenders: Object.values(metrics.componentMetrics).reduce(
        (sum, m) => sum + m.renders,
        0
      ),
      slowComponents: Object.entries(metrics.componentMetrics)
        .filter(([_, m]) => m.avgTime > 50)
        .map(([comp, metric]) => ({
          component: comp,
          renders: metric.renders,
          avgTime: `${metric.avgTime.toFixed(2)}ms`,
          maxTime: `${metric.maxTime.toFixed(2)}ms`
        }))
    }
  };

  return report;
};

/**
 * Log performance report to console
 * @returns {void}
 */
export const logPerformanceReport = () => {
  const report = getPerformanceReport();
  
  console.group('📊 Performance Report');
  console.log('Generated at:', report.generatedAt);
  
  console.group('API Calls');
  console.table(report.apiSummary.endpoints);
  console.log(`Total: ${report.apiSummary.totalCalls} calls across ${report.apiSummary.totalEndpoints} endpoints`);
  console.groupEnd();

  console.group('Page Loads');
  console.table(report.pageSummary.pages);
  console.log(`Total: ${report.pageSummary.totalVisits} visits across ${report.pageSummary.totalPages} pages`);
  console.groupEnd();

  if (report.componentSummary.slowComponents.length > 0) {
    console.group('⚠️  Slow Components');
    console.table(report.componentSummary.slowComponents);
    console.groupEnd();
  }

  console.groupEnd();
};

/**
 * Clear all performance metrics
 * @returns {void}
 */
export const clearMetrics = () => {
  metrics.pageMetrics = {};
  metrics.apiMetrics = {};
  metrics.componentMetrics = {};
  metrics.resourceTimings = [];
  console.log('✅ Performance metrics cleared');
};

/**
 * Get Web Vitals (Core Web Vitals)
 * @returns {Promise<void>}
 */
export const measureWebVitals = () => {
  // Largest Contentful Paint (LCP)
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('📊 Largest Contentful Paint (LCP):', lastEntry.renderTime.toFixed(2), 'ms');
  });

  try {
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // LCP not supported in this browser
  }

  // First Input Delay (FID)
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry) => {
      console.log('⌨️  First Input Delay:', entry.processingDuration.toFixed(2), 'ms');
    });
  });

  try {
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // FID not supported in this browser
  }
};

export default {
  recordApiMetric,
  recordPageMetric,
  recordComponentMetric,
  startTiming,
  getPerformanceSummary,
  getPerformanceReport,
  logPerformanceReport,
  clearMetrics,
  measureWebVitals
};
