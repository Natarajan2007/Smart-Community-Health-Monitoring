/**
 * Safe localStorage wrapper with error handling and validation
 * Prevents app crashes from corrupted localStorage data
 */

/**
 * Safely get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found or corrupted
 * @returns {any} Parsed value or default
 */
export const safeGetStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[SafeStorage] Failed to parse localStorage key "${key}":`, error);
    }
    // Return default value on parse error instead of crashing
    return defaultValue;
  }
};

/**
 * Safely set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be stringified)
 * @returns {boolean} Success status
 */
export const safeSetStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[SafeStorage] Failed to set localStorage key "${key}":`, error);
    }
    // Silently fail to prevent app crashes
    return false;
  }
};

/**
 * Safely remove item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const safeRemoveStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[SafeStorage] Failed to remove localStorage key "${key}":`, error);
    }
    return false;
  }
};

/**
 * Safely clear all localStorage items
 * @returns {boolean} Success status
 */
export const safeClearStorage = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[SafeStorage] Failed to clear localStorage:', error);
    }
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Availability status
 */
export const isStorageAvailable = () => {
  try {
    const test = '__test_storage__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export default {
  get: safeGetStorage,
  set: safeSetStorage,
  remove: safeRemoveStorage,
  clear: safeClearStorage,
  isAvailable: isStorageAvailable
};
