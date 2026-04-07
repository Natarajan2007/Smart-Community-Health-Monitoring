import React, { useEffect } from 'react';
import { generateA11yId, announceToScreenReader } from '../utils/a11y';

/**
 * AccessibleAlert Component
 * Provides WCAG-compliant alerts and notifications
 * Automatically announces to screen readers
 */
const AccessibleAlert = ({
  message,
  type = 'info', // 'info', 'success', 'warning', 'error'
  onClose = null,
  autoClose = true,
  autoCloseDelay = 5000,
  role = 'alert'
}) => {
  const idPrefix = generateA11yId('alert');
  const headerId = `${idPrefix}-header`;
  const descId = `${idPrefix}-desc`;

  // Announce to screen readers
  useEffect(() => {
    const priority = type === 'error' || type === 'warning' ? 'assertive' : 'polite';
    announceToScreenReader(message, priority);
  }, [message, type]);

  // Auto-close if enabled
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoClose, autoCloseDelay, onClose]);

  const getAlertIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ⓘ';
    }
  };

  return (
    <div
      role={role}
      aria-live={type === 'error' || type === 'warning' ? 'assertive' : 'polite'}
      aria-atomic="true"
      className={`accessible-alert alert-${type}`}
      aria-describedby={descId}
    >
      <div className="alert-header" id={headerId}>
        <span className="alert-icon" aria-hidden="true">
          {getAlertIcon()}
        </span>
        <span className="alert-title">
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
      </div>
      <p id={descId} className="alert-message">
        {message}
      </p>
      {onClose && (
        <button
          onClick={onClose}
          aria-label={`Close ${type} alert`}
          className="alert-close"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default AccessibleAlert;
