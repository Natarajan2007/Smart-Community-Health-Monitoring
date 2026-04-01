import React from 'react';
import '../scss/ErrorBoundary.scss';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays fallback UI
 * Logs error information for debugging purposes
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // In production, you could send error to a logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const isDev = process.env.NODE_ENV === 'development';

      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            
            {isDev && this.state.error && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre className="error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="error-actions">
              <button 
                onClick={this.handleReset}
                className="btn-primary"
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-secondary"
              >
                Go to Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p className="error-warning">
                Multiple errors detected. Please refresh the page.
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
