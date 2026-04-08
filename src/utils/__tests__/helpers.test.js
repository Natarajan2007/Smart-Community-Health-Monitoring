/**
 * Unit tests for helper utilities
 * Tests formatting, validation helpers, and utility functions
 */

import {
  formatPhone,
  formatAadhaar,
  maskAccountNumber,
  generateMockData,
  getStatusColor,
  calculatePercentage
} from '../helpers.js';

describe('Helper Utilities', () => {
  
  describe('formatPhone', () => {
    test('should format phone with default format', () => {
      const result = formatPhone('9876543210');
      expect(result).toMatch(/^\d{5}\s\d{5}$/);
    });

    test('should format phone with custom format', () => {
      const result = formatPhone('9876543210', '+91-XXXXX-XXXXX');
      expect(result).toContain('+91-');
    });

    test('should handle short phone numbers', () => {
      const result = formatPhone('123');
      expect(result).toBeTruthy();
    });
  });

  describe('formatAadhaar', () => {
    test('should format Aadhaar with default spacing', () => {
      const result = formatAadhaar('123456789012');
      expect(result).toMatch(/^\d{4}\s\d{4}\s\d{4}$/);
    });

    test('should handle masked format', () => {
      const result = formatAadhaar('123456789012', true);
      expect(result).toContain('X');
    });
  });

  describe('maskAccountNumber', () => {
    test('should mask account number in middle', () => {
      const result = maskAccountNumber('1234567890123456');
      expect(result).toContain('****');
      expect(result.length).toBe(16);
    });

    test('should show first and last digits', () => {
      const result = maskAccountNumber('1234567890123456');
      expect(result.charAt(0)).toBe('1');
      expect(result.charAt(result.length - 1)).toBe('6');
    });

    test('should handle short account numbers', () => {
      const result = maskAccountNumber('123456');
      expect(result).toContain('*');
    });
  });

  describe('getStatusColor', () => {
    test('should return green for success status', () => {
      const result = getStatusColor('success');
      expect(['green', '#00AA00', 'rgb(0,170,0)']).toContain(result.toLowerCase());
    });

    test('should return red for error status', () => {
      const result = getStatusColor('error');
      expect(result.toLowerCase()).toContain('red');
    });

    test('should return yellow for warning status', () => {
      const result = getStatusColor('warning');
      expect(['yellow', '#FFAA00', 'rgb(255,170,0)']).toContain(result.toLowerCase());
    });

    test('should handle pending status', () => {
      const result = getStatusColor('pending');
      expect(result).toBeTruthy();
    });
  });

  describe('calculatePercentage', () => {
    test('should calculate percentage correctly', () => {
      const result = calculatePercentage(50, 100);
      expect(result).toBe(50);
    });

    test('should handle zero total', () => {
      const result = calculatePercentage(50, 0);
      expect(result).toBe(0);
    });

    test('should round to specified decimal places', () => {
      const result = calculatePercentage(1, 3, 2);
      expect(result).toBe(33.33);
    });

    test('should calculate decimal percentages', () => {
      const result = calculatePercentage(0.5, 1);
      expect(result).toBe(50);
    });
  });

  describe('generateMockData', () => {
    test('should generate phone number', () => {
      const result = generateMockData('phone');
      expect(result).toMatch(/^\d{10}$/);
    });

    test('should generate Aadhaar number', () => {
      const result = generateMockData('aadhaar');
      expect(result).toMatch(/^\d{12}$/);
    });

    test('should generate valid email', () => {
      const result = generateMockData('email');
      expect(result).toMatch(/@/);
    });

    test('should handle unknown type', () => {
      const result = generateMockData('unknown');
      expect(result).toBeTruthy();
    });
  });
});
