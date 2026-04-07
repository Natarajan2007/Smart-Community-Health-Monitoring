/**
 * Accessibility Utilities
 * Provides helpers and utilities for maintaining WCAG compliance
 * and improving user experience for all users
 * @module a11y
 */

/**
 * Generate unique ID for elements
 * Used for connecting labels, descriptions, and elements
 * @param {string} prefix - Prefix for the ID
 * @returns {string} Unique ID
 */
export const generateA11yId = (prefix = 'a11y') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Create ARIA attributes for buttons
 * @param {Object} config - Configuration object
 * @param {string} config.pressed - Current pressed state (true/false)
 * @param {string} config.expanded - Current expanded state (true/false)
 * @param {string} config.disabled - Whether button is disabled
 * @param {string} config.label - Accessible label
 * @returns {Object} ARIA attributes
 */
export const createButtonA11yAttrs = (config = {}) => {
  const attrs = {};

  if (config.pressed !== undefined) {
    attrs['aria-pressed'] = config.pressed.toString();
  }

  if (config.expanded !== undefined) {
    attrs['aria-expanded'] = config.expanded.toString();
  }

  if (config.disabled) {
    attrs['aria-disabled'] = 'true';
  }

  if (config.label) {
    attrs['aria-label'] = config.label;
  }

  return attrs;
};

/**
 * Create ARIA attributes for form elements
 * @param {Object} config - Configuration object
 * @param {string} config.labelId - ID of the label element
 * @param {string} config.describedById - ID of description element
 * @param {boolean} config.required - Whether field is required
 * @param {string} config.invalid - Error message if invalid
 * @returns {Object} ARIA attributes
 */
export const createFormA11yAttrs = (config = {}) => {
  const attrs = {};

  if (config.labelId) {
    attrs['aria-labelledby'] = config.labelId;
  }

  if (config.describedById) {
    attrs['aria-describedby'] = config.describedById;
  }

  if (config.required) {
    attrs['aria-required'] = 'true';
  }

  if (config.invalid) {
    attrs['aria-invalid'] = 'true';
    if (config.errorId) {
      attrs['aria-describedby'] = config.errorId;
    }
  }

  return attrs;
};

/**
 * Announce message to screen readers
 * Uses aria-live region to notify users of dynamic content
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' (default) or 'assertive'
 * @returns {void}
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  // Create or get existing aria-live region
  let liveRegion = document.querySelector('[aria-live]');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only'; // Screenreader-only class
    document.body.appendChild(liveRegion);
  }

  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = message;
};

/**
 * Check if user prefers reduced motion
 * Respects system accessibility preferences
 * @returns {boolean} True if reduced motion is preferred
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Check if user prefers dark mode
 * @returns {boolean} True if dark mode is preferred
 */
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

/**
 * Create keyboard-friendly tooltip element
 * @param {string} text - Tooltip text
 * @param {string} position - 'top', 'bottom', 'left', 'right'
 * @returns {JSX.Element} Tooltip element
 */
export const createA11yTooltip = (text, position = 'top') => {
  return {
    'aria-label': text,
    'role': 'tooltip',
    'data-position': position
  };
};

/**
 * Create accessible alert box
 * @param {string} message - Alert message
 * @param {string} type - 'error', 'warning', 'success', 'info'
 * @returns {Object} Alert attributes
 */
export const createAlertA11yAttrs = (message, type = 'info') => {
  return {
    'role': 'alert',
    'aria-live': type === 'error' ? 'assertive' : 'polite',
    'aria-atomic': 'true',
    'class': `alert alert-${type}`
  };
};

/**
 * Create accessible dialog/modal attributes
 * @param {string} title - Dialog title
 * @param {string} titleId - ID of title element
 * @param {boolean} isOpen - Whether dialog is open
 * @returns {Object} Dialog attributes
 */
export const createDialogA11yAttrs = (title, titleId, isOpen = false) => {
  return {
    'role': 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': titleId,
    'aria-hidden': (!isOpen).toString(),
    'class': `dialog ${isOpen ? 'open' : 'closed'}`
  };
};

/**
 * Create accessible dropdown/select attributes
 * @param {string} label - Label for dropdown
 * @param {boolean} isOpen - Whether dropdown is open
 * @param {number} selectedIndex - Index of selected item
 * @returns {Object} Dropdown attributes
 */
export const createDropdownA11yAttrs = (label, isOpen, selectedIndex = 0) => {
  return {
    'role': 'combobox',
    'aria-label': label,
    'aria-expanded': isOpen.toString(),
    'aria-haspopup': 'listbox',
    'aria-controls': generateA11yId('listbox')
  };
};

/**
 * Trap focus within an element (for modals/dialogs)
 * @param {HTMLElement} element - Element to trap focus in
 * @param {Function} onEscape - Callback when Escape is pressed
 * @returns {Function} Function to remove focus trap
 */
export const trapFocus = (element, onEscape = null) => {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    return () => {};
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && onEscape) {
      onEscape();
    }

    if (e.key !== 'Tab') {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);
  firstElement.focus();

  return () => {
    element.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Create accessible skip link
 * Allows keyboard users to skip to main content
 * @returns {Object} Skip link attributes
 */
export const createSkipLinkA11yAttrs = () => {
  return {
    'href': '#main-content',
    'class': 'skip-link',
    'aria-label': 'Skip to main content'
  };
};

/**
 * Validate color contrast ratio
 * Checks if contrast meets WCAG AA standard (4.5:1 for normal text)
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @returns {Object} Contrast ratio and compliance status
 */
export const checkColorContrast = (foreground, background) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = ((rgb >> 16) & 0xff) / 255;
    const g = ((rgb >> 8) & 0xff) / 255;
    const b = (rgb & 0xff) / 255;

    const [rs, gs, bs] = [r, g, b].map((val) => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(foreground);
  const l2 = getLuminance(background);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  const ratio = (lighter + 0.05) / (darker + 0.05);

  return {
    ratio: ratio.toFixed(2),
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    compliant: ratio >= 4.5
  };
};

/**
 * Merge accessibility attributes
 * Safely combines multiple a11y attribute objects
 * @param {...Object} attrs - Attribute objects to merge
 * @returns {Object} Merged attributes
 */
export const mergeA11yAttrs = (...attrs) => {
  return attrs.reduce((acc, attr) => {
    if (!attr) return acc;

    Object.entries(attr).forEach(([key, value]) => {
      if (key === 'class') {
        acc[key] = `${acc[key] || ''} ${value}`.trim();
      } else {
        acc[key] = value;
      }
    });

    return acc;
  }, {});
};

export default {
  generateA11yId,
  createButtonA11yAttrs,
  createFormA11yAttrs,
  announceToScreenReader,
  prefersReducedMotion,
  prefersDarkMode,
  createA11yTooltip,
  createAlertA11yAttrs,
  createDialogA11yAttrs,
  createDropdownA11yAttrs,
  trapFocus,
  createSkipLinkA11yAttrs,
  checkColorContrast,
  mergeA11yAttrs
};
