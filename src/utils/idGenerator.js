/**
 * ID Generator Utility
 * Provides deterministic and random unique ID generation
 */

let idCounter = 0;

/**
 * Generate a unique ID based on timestamp and counter
 * @param {string} prefix - Optional prefix for the ID
 * @returns {string} Unique ID
 */
export const generateUniqueId = (prefix = 'id') => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substr(2, 9);
  idCounter = (idCounter + 1) % 10000;
  return `${prefix}_${timestamp}_${idCounter}_${randomPart}`;
};

/**
 * Generate a UUID v4-like ID
 * @returns {string} UUID-like string
 */
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Add IDs to an array of objects if they don't have an ID
 * @param {Array} items - Array of items
 * @param {string} prefix - Prefix for generated IDs
 * @returns {Array} Items with IDs
 */
export const ensureIds = (items, prefix = 'item') => {
  return items.map((item, index) => ({
    id: item.id || generateUniqueId(`${prefix}_${index}`),
    ...item
  }));
};

/**
 * Create ID-keyed map from an array
 * @param {Array} items - Array of items with IDs
 * @returns {Map} Map of ID -> item
 */
export const createIdMap = (items) => {
  const map = new Map();
  items.forEach(item => {
    if (item.id) {
      map.set(item.id, item);
    }
  });
  return map;
};

export default generateUniqueId;
