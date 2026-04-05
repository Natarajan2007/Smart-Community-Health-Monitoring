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
 * Validates that value is not null or undefined
 * @param {*} value - Value to validate
 * @returns {boolean} True if value exists
 * @example
 * isRequired('test') // true
 * isRequired(null) // false
 */
export const isRequired = (value) => {
  return value !== null && value !== undefined && value !== '';
};

/**
 * Validates URL format
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 * @example
 * isValidUrl('https://example.com') // true
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates that string contains only numbers
 * @param {string} value - Value to validate
 * @returns {boolean} True if contains only numbers
 */
export const isNumeric = (value) => {
  return /^\d+$/.test(value?.toString() || '');
};

/**
 * Validates that string contains only alphabetic characters
 * @param {string} value - Value to validate
 * @returns {boolean} True if alphabetic only
 */
export const isAlphabetic = (value) => {
  return /^[a-zA-Z\s]+$/.test(value?.toString() || '');
};

/**
 * Validates that value is within a numeric range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if value is in range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Validates all form data in an object with support for nested validation
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

    if (Array.isArray(rule.validators)) {
      // Multiple validators for same field
      for (const validator of rule.validators) {
        if (!validator.check(value)) {
          errors[field] = validator.message;
          isValid = false;
          break;
        }
      }
    } else if (rule.validator) {
      // Single validator
      if (!rule.validator(value)) {
        errors[field] = rule.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * Create a reusable validator function
 * @param {Function} validatorFn - Validation function
 * @param {string} errorMessage - Error message to display
 * @returns {Object} Validator object
 */
export const createValidator = (validatorFn, errorMessage) => {
  return {
    check: validatorFn,
    message: errorMessage
  };
};

/**
 * Batch validate multiple inputs with custom validators
 * @param {Object} inputs - Input values to validate
 * @param {Array<{field: string, validators: Array}>} schema - Validation schema
 * @returns {Object} Validation result with errors
 */
export const batchValidate = (inputs, schema) => {
  const errors = {};
  const validated = {};

  schema.forEach(({ field, validators }) => {
    const value = inputs[field];
    validated[field] = value;

    for (const validator of validators) {
      if (!validator.check(value)) {
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(validator.message);
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    validated
  };
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
