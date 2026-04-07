/**
 * Comprehensive form validation utilities
 * Provides reusable validation functions for email, phone, text, etc.
 */

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Indian phone: 10 digits starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/;
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (!phoneRegex.test(digitsOnly)) {
    return { isValid: false, error: 'Please enter a valid 10-digit phone number' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates Aadhaar number (12 digits)
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateAadhaar = (aadhaar) => {
  if (!aadhaar) {
    return { isValid: false, error: 'Aadhaar number is required' };
  }
  
  const aadhaarRegex = /^\d{12}$/;
  const digitsOnly = aadhaar.replace(/\s/g, '');
  
  if (!aadhaarRegex.test(digitsOnly)) {
    return { isValid: false, error: 'Aadhaar must be 12 digits' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates text field (not empty, min/max length)
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length (default: 1)
 * @param {number} maxLength - Maximum length (default: 500)
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateText = (text, minLength = 1, maxLength = 500) => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'This field is required' };
  }
  
  if (text.length < minLength) {
    return { isValid: false, error: `Minimum ${minLength} characters required` };
  }
  
  if (text.length > maxLength) {
    return { isValid: false, error: `Maximum ${maxLength} characters allowed` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates bank account number
 * @param {string} accountNumber - Bank account number
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateAccountNumber = (accountNumber) => {
  if (!accountNumber) {
    return { isValid: false, error: 'Account number is required' };
  }
  
  // 9-18 digits (typical Indian bank account range)
  const accountRegex = /^\d{9,18}$/;
  const digitsOnly = accountNumber.replace(/\s/g, '');
  
  if (!accountRegex.test(digitsOnly)) {
    return { isValid: false, error: 'Account number must be 9-18 digits' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates IFSC code (Indian Financial System Code)
 * @param {string} ifsc - IFSC code
 * @returns {object} - { isValid: boolean, error: string|null }
 */
export const validateIFSC = (ifsc) => {
  if (!ifsc) {
    return { isValid: false, error: 'IFSC code is required' };
  }
  
  // IFSC format: 4 letters + 0 + 6 digits/letters
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const code = ifsc.toUpperCase().replace(/\s/g, '');
  
  if (!ifscRegex.test(code)) {
    return { isValid: false, error: 'Invalid IFSC code format' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validates entire form object
 * @param {object} formData - Form data object
 * @param {object} validationRules - Validation rules { fieldName: validationType }
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.entries(validationRules).forEach(([field, rule]) => {
    const value = formData[field];
    let result;

    switch (rule.type) {
      case 'email':
        result = validateEmail(value);
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      case 'aadhaar':
        result = validateAadhaar(value);
        break;
      case 'account':
        result = validateAccountNumber(value);
        break;
      case 'ifsc':
        result = validateIFSC(value);
        break;
      case 'text':
        result = validateText(value, rule.minLength, rule.maxLength);
        break;
      default:
        result = { isValid: true, error: null };
    }

    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePhone,
  validateAadhaar,
  validateText,
  validateAccountNumber,
  validateIFSC,
  validateForm
};
