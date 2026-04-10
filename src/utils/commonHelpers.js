/**
 * Common Helper Functions & Utilities
 * Reusable utility functions across the application
 */

// ===== String Utilities =====

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case
 */
export const titleCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

/**
 * Slugify string (for URLs)
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str, maxLength = 100, suffix = '...') => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
};

// ===== Number Utilities =====

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '';
  return num.toLocaleString('en-IN');
};

/**
 * Format currency (Indian Rupee)
 */
export const formatCurrency = (amount, currency = '₹') => {
  const formatted = formatNumber(Math.abs(amount));
  return `${currency}${formatted}`;
};

/**
 * Round to decimal places
 */
export const roundTo = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

/**
 * Generate random number
 */
export const randomNumber = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ===== Date Utilities =====

/**
 * Format date to readable string
 */
export const formatDate = (date, format = 'dd/mm/yyyy') => {
  if (!date) return '';
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  const dateMap = {
    'dd/mm/yyyy': `${day}/${month}/${year}`,
    'mm/dd/yyyy': `${month}/${day}/${year}`,
    'yyyy-mm-dd': `${year}-${month}-${day}`,
  };

  return dateMap[format] || dateMap['dd/mm/yyyy'];
};

/**
 * Get time ago string
 */
export const timeAgo = (date) => {
  const now = Date.now();
  const diff = now - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds}s ago`;
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;

  return formatDate(date);
};

/**
 * Add days to date
 */
export const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

// ===== Array Utilities =====

/**
 * Remove duplicate items from array
 */
export const uniqueArray = (arr, key = null) => {
  if (!Array.isArray(arr)) return [];

  if (key) {
    const seen = new Set();
    return arr.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  return [...new Set(arr)];
};

/**
 * Flatten nested array
 */
export const flattenArray = (arr, depth = Infinity) => {
  return arr.flat(depth);
};

/**
 * Chunk array into smaller arrays
 */
export const chunkArray = (arr, size = 10) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

/**
 * Group array by key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

// ===== Object Utilities =====

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

/**
 * Merge objects deeply
 */
export const deepMerge = (target = {}, source = {}) => {
  const result = deepClone(target);

  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
};

/**
 * Pick specific keys from object
 */
export const pick = (obj, keys = []) => {
  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = (obj, keys = []) => {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
};

// ===== Promise Utilities =====

/**
 * Delay promise by milliseconds
 */
export const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Timeout promise
 */
export const timeout = (promise, ms, message = 'Promise timeout') => {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(message)), ms)
    ),
  ]);
};

/**
 * Retry promise with backoff
 */
export const retryPromise = async (fn, maxAttempts = 3, delayMs = 1000) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const waitTime = delayMs * Math.pow(2, attempt - 1);
      await delay(waitTime);
    }
  }
};

// ===== Validation Utilities =====

/**
 * Check if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is valid JSON
 */
export const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if string is URL
 */
export const isValidURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

// ===== Storage Utilities =====

/**
 * Safely get localStorage value
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

/**
 * Safely set localStorage value
 */
export const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove localStorage value
 */
export const removeStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

// ===== Browser Utilities =====

/**
 * Check if device is mobile
 */
export const isMobileDevice = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
};

/**
 * Get browser name
 */
export const getBrowserName = () => {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  return 'Unknown';
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    return true;
  } catch {
    return false;
  }
};

export default {
  // String
  capitalize,
  titleCase,
  slugify,
  truncate,
  // Number
  formatNumber,
  formatCurrency,
  roundTo,
  randomNumber,
  // Date
  formatDate,
  timeAgo,
  addDays,
  // Array
  uniqueArray,
  flattenArray,
  chunkArray,
  groupBy,
  // Object
  deepClone,
  deepMerge,
  pick,
  omit,
  // Promise
  delay,
  timeout,
  retryPromise,
  // Validation
  isEmpty,
  isValidJSON,
  isValidURL,
  // Storage
  getStorage,
  setStorage,
  removeStorage,
  // Browser
  isMobileDevice,
  getBrowserName,
  copyToClipboard,
};
