/**
 * Unit tests for form validation utilities
 * Tests email, phone, Aadhaar, IFSC, and account number validation
 */

import {
  validateEmail,
  validatePhone,
  validateAadhaar,
  validateText,
  validateAccountNumber,
  validateIFSC,
  validateForm
} from '../formValidation.js';

describe('Form Validation Utilities', () => {
  
  describe('validateEmail', () => {
    test('should validate correct email', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject invalid email', () => {
      const result = validateEmail('invalid.email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    test('should require email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should handle special characters', () => {
      const result = validateEmail('user+tag@example.co.uk');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePhone', () => {
    test('should validate 10-digit Indian phone number', () => {
      const result = validatePhone('9876543210');
      expect(result.isValid).toBe(true);
    });

    test('should reject non-10-digit phone', () => {
      const result = validatePhone('987654321');
      expect(result.isValid).toBe(false);
    });

    test('should require phone', () => {
      const result = validatePhone('');
      expect(result.isValid).toBe(false);
    });

    test('should reject non-numeric phone', () => {
      const result = validatePhone('abcdefghij');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateAadhaar', () => {
    test('should validate 12-digit Aadhaar', () => {
      const result = validateAadhaar('123456789012');
      expect(result.isValid).toBe(true);
    });

    test('should reject non-12-digit Aadhaar', () => {
      const result = validateAadhaar('12345678901');
      expect(result.isValid).toBe(false);
    });

    test('should require Aadhaar', () => {
      const result = validateAadhaar('');
      expect(result.isValid).toBe(false);
    });

    test('should reject non-numeric Aadhaar', () => {
      const result = validateAadhaar('abcdefghijkl');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateText', () => {
    test('should validate text within length bounds', () => {
      const result = validateText('hello', 3, 10);
      expect(result.isValid).toBe(true);
    });

    test('should reject text below minimum length', () => {
      const result = validateText('hi', 3, 10);
      expect(result.isValid).toBe(false);
    });

    test('should reject text above maximum length', () => {
      const result = validateText('this is a very long text', 3, 10);
      expect(result.isValid).toBe(false);
    });

    test('should handle empty text', () => {
      const result = validateText('', 0, 10);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateIFSC', () => {
    test('should validate correct IFSC code', () => {
      const result = validateIFSC('ICIC0000001');
      expect(result.isValid).toBe(true);
    });

    test('should reject invalid IFSC', () => {
      const result = validateIFSC('INVALID');
      expect(result.isValid).toBe(false);
    });

    test('should be case-insensitive', () => {
      const result = validateIFSC('icic0000001');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateAccountNumber', () => {
    test('should validate 9-18 digit account number', () => {
      const result = validateAccountNumber('1234567890');
      expect(result.isValid).toBe(true);
    });

    test('should reject too short account number', () => {
      const result = validateAccountNumber('12345678');
      expect(result.isValid).toBe(false);
    });

    test('should reject too long account number', () => {
      const result = validateAccountNumber('1234567890123456789');
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateForm', () => {
    test('should validate form with multiple rules', () => {
      const formData = {
        email: 'user@example.com',
        phone: '9876543210'
      };
      const rules = {
        email: { type: 'email' },
        phone: { type: 'phone' }
      };
      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(true);
    });

    test('should return errors for invalid fields', () => {
      const formData = {
        email: 'invalid',
        phone: '123'
      };
      const rules = {
        email: { type: 'email' },
        phone: { type: 'phone' }
      };
      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    test('should skip validation for missing optional fields', () => {
      const formData = {
        email: 'user@example.com'
      };
      const rules = {
        email: { type: 'email' },
        phone: { type: 'phone', optional: true }
      };
      const result = validateForm(formData, rules);
      expect(result.isValid).toBe(true);
    });
  });
});
