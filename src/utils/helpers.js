/**
 * Utility Helpers & Formatters
 * Common utility functions for formatting, calculations, and data manipulation
 * @module utilityHelpers
 */

/**
 * Currency Formatter
 * @param {number} value - Amount to format
 * @param {string} currency - Currency code (default: INR)
 * @param {string} locale - Locale (default: en-IN)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(value);
};

/**
 * Date Formatter
 * @param {Date|string|number} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD')
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  const formats = {
    'YYYY-MM-DD': `${year}-${month}-${day}`,
    'DD-MM-YYYY': `${day}-${month}-${year}`,
    'MM/DD/YYYY': `${month}/${day}/${year}`,
    'YYYY-MM-DD HH:MM:SS': `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    'DD/MM/YYYY HH:MM': `${day}/${month}/${year} ${hours}:${minutes}`
  };

  return formats[format] || formats['YYYY-MM-DD'];
};

/**
 * Relative Time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to convert
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

  return formatDate(date, 'DD-MM-YYYY');
};

/**
 * Format phone number
 * @param {string} phone - Phone number
 * @param {string} format - Format type (default: 'XXXXX XXXXX')
 * @returns {string} Formatted phone
 */
export const formatPhone = (phone, format = 'XXXXX XXXXX') => {
  const digits = phone.replace(/\D/g, '');
  let result = format;

  for (let i = 0, j = 0; i < result.length; i++) {
    if (result[i] === 'X') {
      result = result.substring(0, i) + digits[j++] + result.substring(i + 1);
    }
  }

  return result;
};

/**
 * Format Aadhaar number (XXXX XXXX XXXX)
 * @param {string} aadhaar - Aadhaar number
 * @returns {string} Formatted Aadhaar
 */
export const formatAadhaar = (aadhaar) => {
  const digits = aadhaar.replace(/\D/g, '');
  return digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50, suffix = '...') => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Convert to Title Case
 * @param {string} text - Text to convert
 * @returns {string} Title case text
 */
export const toTitleCase = (text) => {
  return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Slugify text (convert to URL-friendly)
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Convert bytes to human readable format
 * @param {number} bytes - Bytes
 * @param {number} decimals - Decimal places
 * @returns {string} Human readable size
 */
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};

/**
 * Calculate percentage
 * @param {number} part - Part value
 * @param {number} whole - Whole value
 * @param {number} decimals - Decimal places
 * @returns {number} Percentage
 */
export const calculatePercentage = (part, whole, decimals = 2) => {
  if (whole === 0) return 0;
  return parseFloat(((part / whole) * 100).toFixed(decimals));
};

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
export const generateUniqueId = (prefix = 'id') => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Deep clone object
 * @param {*} obj - Object to clone
 * @returns {*} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge objects deeply
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export const deepMerge = (target = {}, source = {}) => {
  const result = { ...target };

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }

  return result;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

/**
 * Throttle function
 * @param {Function} func - Function to throttle
 * @param {number} interval - Interval in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, interval = 300) => {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxAttempts - Maximum attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Promise result
 */
export const retryWithBackoff = async (fn, maxAttempts = 3, delay = 1000) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

/**
 * Flatten array
 * @param {Array} arr - Array to flatten
 * @param {number} depth - Depth to flatten
 * @returns {Array} Flattened array
 */
export const flattenArray = (arr, depth = Infinity) => {
  return arr.reduce((flat, item) => {
    return flat.concat(depth > 1 && Array.isArray(item) ? flattenArray(item, depth - 1) : item);
  }, []);
};

/**
 * Group array by key
 * @param {Array} arr - Array to group
 * @param {string|Function} key - Grouping key or function
 * @returns {Object} Grouped object
 */
export const groupBy = (arr, key) => {
  return arr.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};

/**
 * Remove duplicates from array
 * @param {Array} arr - Array with potential duplicates
 * @param {string|Function} key - Unique key or function
 * @returns {Array} Array without duplicates
 */
export const removeDuplicates = (arr, key = null) => {
  if (!key) return [...new Set(arr)];

  const seen = new Set();
  return arr.filter((item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

/**
 * Get random item from array
 * @param {Array} arr - Array to pick from
 * @returns {*} Random item
 */
export const getRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffle array
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
export const shuffleArray = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Sum array values
 * @param {Array} arr - Array of numbers
 * @param {Function} selector - Optional selector function
 * @returns {number} Sum
 */
export const sum = (arr, selector = null) => {
  return arr.reduce((total, item) => {
    const value = selector ? selector(item) : item;
    return total + (typeof value === 'number' ? value : 0);
  }, 0);
};

/**
 * Average array values
 * @param {Array} arr - Array of numbers
 * @param {Function} selector - Optional selector function
 * @returns {number} Average
 */
export const average = (arr, selector = null) => {
  if (arr.length === 0) return 0;
  return sum(arr, selector) / arr.length;
};

export default {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatPhone,
  formatAadhaar,
  truncateText,
  capitalize,
  toTitleCase,
  slugify,
  formatBytes,
  calculatePercentage,
  generateUniqueId,
  deepClone,
  deepMerge,
  debounce,
  throttle,
  retryWithBackoff,
  flattenArray,
  groupBy,
  removeDuplicates,
  getRandomItem,
  shuffleArray,
  sum,
  average
};
