/**
 * Input Validation Utility Module
 * 
 * Provides reusable validation functions for common input types and patterns
 * used throughout the Smart Community Health Monitoring application.
 * 
 * @module validation
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email is valid
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid-email') // false
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
};

/**
 * Validates phone number format (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid 10-digit number
 * @example
 * isValidPhone('9876543210') // true
 * isValidPhone('12345') // false
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return typeof phone === 'string' && phoneRegex.test(phone.trim());
};

/**
 * Validates Aadhaar number format (12 digits)
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {boolean} True if Aadhaar number is valid
 * @example
 * isValidAadhaar('123456789012') // true
 * isValidAadhaar('1234567890') // false
 */
export const isValidAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/;
  return typeof aadhaar === 'string' && aadhaarRegex.test(aadhaar.trim());
};

/**
 * Validates bank account number format
 * @param {string} accountNumber - Bank account number to validate
 * @returns {boolean} True if account number is valid (9-18 digits)
 * @example
 * isValidAccountNumber('12345678901234') // true
 * isValidAccountNumber('123') // false
 */
export const isValidAccountNumber = (accountNumber) => {
  const accountRegex = /^\d{9,18}$/;
  return typeof accountNumber === 'string' && accountRegex.test(accountNumber.trim());
};

/**
 * Validates IFSC code format
 * @param {string} ifsc - IFSC code to validate
 * @returns {boolean} True if IFSC code is valid
 * @example
 * isValidIFSC('SBIN0001234') // true
 * isValidIFSC('INVALID') // false
 */
export const isValidIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return typeof ifsc === 'string' && ifscRegex.test(ifsc.trim());
};

/**
 * Validates if a string is not empty after trimming
 * @param {string} text - Text to validate
 * @returns {boolean} True if text is not empty
 * @example
 * isNotEmpty('hello') // true
 * isNotEmpty('   ') // false
 */
export const isNotEmpty = (text) => {
  return typeof text === 'string' && text.trim().length > 0;
};

/**
 * Validates string length within range
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if length is within range
 * @example
 * isValidLength('hello', 1, 10) // true
 * isValidLength('hi', 5, 10) // false
 */
export const isValidLength = (text, minLength, maxLength) => {
  const len = typeof text === 'string' ? text.trim().length : 0;
  return len >= minLength && len <= maxLength;
};

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {string} input - User input to sanitize
 * @returns {string} Sanitized input
 * @example
 * sanitizeInput('<script>alert("xss")</script>') // Removes dangerous characters
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/['"]/g, '') // Remove quotes
    .trim();
};

/**
 * Validates all form data in an object
 * @param {Object} data - Form data object to validate
 * @param {Object} rules - Validation rules object
 * @returns {Object} Object with validation results and errors
 * @example
 * const rules = {
 *   email: { validator: isValidEmail, message: 'Invalid email' },
 *   phone: { validator: isValidPhone, message: 'Invalid phone' }
 * };
 * validateForm(formData, rules);
 */
export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    if (!rule.validator(value)) {
      errors[field] = rule.message;
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Validates eligibility criteria for bank accounts
 * @param {Object} userInfo - User information object
 * @param {number} userInfo.age - User age
 * @param {string} userInfo.aadhaar - Aadhaar number
 * @param {string} userInfo.accountType - Type of account
 * @returns {Object} Eligibility validation result
 */
export const validateEligibility = (userInfo) => {
  const errors = [];

  if (!userInfo.age || userInfo.age < 18) {
    errors.push('Must be 18 years or older');
  }

  if (!isValidAadhaar(userInfo.aadhaar)) {
    errors.push('Invalid Aadhaar number');
  }

  if (!userInfo.accountType) {
    errors.push('Account type is required');
  }

  return {
    isEligible: errors.length === 0,
    errors
  };
};
