/**
 * Security Utilities
 * Encryption, hashing, tokenization, and data protection utilities
 */

import crypto from 'crypto';

/**
 * Encryption service with AES-256-GCM
 */
export class EncryptionService {
  constructor(masterKey = null) {
    // Use environment variable or generate from master key
    this.masterKey = masterKey || 
      (process.env.ENCRYPTION_KEY ? Buffer.from(process.env.ENCRYPTION_KEY, 'hex') : null);
    
    if (!this.masterKey || this.masterKey.length !== 32) {
      this.masterKey = crypto.scryptSync(
        process.env.ENCRYPTION_MASTER_PASS || 'default-key',
        'salt',
        32
      );
    }
  }

  /**
   * Encrypt data with AES-256-GCM
   * @param {string} plaintext - Data to encrypt
   * @returns {string} Encrypted data (base64)
   */
  encrypt(plaintext) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.masterKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Return: iv + authTag + encrypted (all base64)
    return Buffer.concat([iv, authTag, Buffer.from(encrypted, 'hex')])
      .toString('base64');
  }

  /**
   * Decrypt data
   * @param {string} ciphertext - Encrypted data (base64)
   * @returns {string} Decrypted plaintext
   */
  decrypt(ciphertext) {
    try {
      const buffer = Buffer.from(ciphertext, 'base64');
      const iv = buffer.slice(0, 16);
      const authTag = buffer.slice(16, 32);
      const encrypted = buffer.slice(32).toString('hex');
      
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.masterKey, iv);
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error.message}`);
    }
  }

  /**
   * Generate encryption key for external use
   * @returns {string} Hex-encoded 32-byte key
   */
  static generateKey() {
    return crypto.randomBytes(32).toString('hex');
  }
}

/**
 * Hashing service for password and data hashing
 */
export class HashingService {
  /**
   * Hash password with PBKDF2
   * @param {string} password - Password to hash
   * @param {number} iterations - PBKDF2 iterations (default: 100000)
   * @returns {object} { hash, salt }
   */
  static hashPassword(password, iterations = 100000) {
    const salt = crypto.randomBytes(32);
    const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512');
    
    return {
      algorithm: 'pbkdf2-sha512',
      iterations,
      salt: salt.toString('hex'),
      hash: hash.toString('hex')
    };
  }

  /**
   * Verify password against hash
   * @param {string} password - Password to verify
   * @param {object} stored - Stored hash object
   * @returns {boolean} Password matches
   */
  static verifyPassword(password, stored) {
    const hash = crypto.pbkdf2Sync(
      password,
      Buffer.from(stored.salt, 'hex'),
      stored.iterations,
      64,
      'sha512'
    );
    
    return hash.toString('hex') === stored.hash;
  }

  /**
   * Generate SHA-256 hash
   * @param {string} data - Data to hash
   * @returns {string} Hex-encoded hash
   */
  static sha256(data) {
    return crypto.createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate SHA-512 hash
   * @param {string} data - Data to hash
   * @returns {string} Hex-encoded hash
   */
  static sha512(data) {
    return crypto.createHash('sha512')
      .update(data)
      .digest('hex');
  }

  /**
   * Generate HMAC-SHA256
   * @param {string} data - Data to hash
   * @param {string} key - Secret key
   * @returns {string} Hex-encoded HMAC
   */
  static hmac256(data, key) {
    return crypto.createHmac('sha256', key)
      .update(data)
      .digest('hex');
  }
}

/**
 * Token generation and validation
 */
export class TokenService {
  /**
   * Generate secure random token
   * @param {number} length - Token length in bytes (default: 32)
   * @returns {string} Hex-encoded token
   */
  static generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate JWT-like token (simplified)
   * @param {object} payload - Token data
   * @param {string} secret - Secret key
   * @param {number} expiresIn - Expiration time in seconds
   * @returns {string} Token (base64)
   */
  static generateJWTToken(payload, secret, expiresIn = 3600) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const data = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresIn
    };

    const headerEncoded = Buffer.from(JSON.stringify(header)).toString('base64');
    const payloadEncoded = Buffer.from(JSON.stringify(data)).toString('base64');

    const signature = crypto.createHmac('sha256', secret)
      .update(`${headerEncoded}.${payloadEncoded}`)
      .digest('base64');

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  }

  /**
   * Verify JWT-like token
   * @param {string} token - Token to verify
   * @param {string} secret - Secret key
   * @returns {object|null} Decoded payload or null if invalid
   */
  static verifyJWTToken(token, secret) {
    try {
      const [headerEncoded, payloadEncoded, signature] = token.split('.');

      const computedSignature = crypto.createHmac('sha256', secret)
        .update(`${headerEncoded}.${payloadEncoded}`)
        .digest('base64');

      if (signature !== computedSignature) {
        return null;
      }

      const payload = JSON.parse(Buffer.from(payloadEncoded, 'base64').toString());

      if (payload.exp < Math.floor(Date.now() / 1000)) {
        return null; // Token expired
      }

      return payload;
    } catch (error) {
      return null;
    }
  }
}

/**
 * Data sanitization and validation
 */
export class SanitizationService {
  /**
   * Remove potentially dangerous characters from string
   * @param {string} input - Input string
   * @returns {string} Sanitized string
   */
  static sanitizeString(input) {
    if (typeof input !== 'string') return '';

    return input
      .replace(/[<>\"'`;]/g, '') // Remove HTML/SQL special chars
      .trim()
      .substring(0, 10000); // Max length
  }

  /**
   * Sanitize JSON object recursively
   * @param {object} obj - Object to sanitize
   * @returns {object} Sanitized object
   */
  static sanitizeObject(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeString(value);
      } else if (typeof value === 'object') {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Mask sensitive data (email, phone, etc.)
   * @param {string} data - Data to mask
   * @param {string} type - Type: 'email', 'phone', 'card', 'aadhaar'
   * @returns {string} Masked data
   */
  static maskData(data, type = 'email') {
    switch (type) {
      case 'email':
        return data.replace(/(.{2})(.*)(@.*)/, '$1***$3');
      case 'phone':
        return data.replace(/(\d{2})(\d+)(\d{4})/, '$1***$3');
      case 'card':
        return data.replace(/(\d{4})\d+(\d{4})/, '$1***$2');
      case 'aadhaar':
        return data.replace(/(\d{4})\d+(\d{4})/, '$1****$2');
      default:
        return data;
    }
  }

  /**
   * Check if string contains SQL injection patterns
   * @param {string} input - Input to check
   * @returns {boolean} Contains SQL injection patterns
   */
  static containsSQLInjection(input) {
    const sqlPatterns = [
      /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
      /(--|#|\/\*|\*\/|;)/,
      /(\bOR\b.*=.*)/i,
      /(\bAND\b.*=.*)/i
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Check if string contains XSS patterns
   * @param {string} input - Input to check
   * @returns {boolean} Contains XSS patterns
   */
  static containsXSS(input) {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /on\w+\s*=/gi,
      /<iframe/gi,
      /<embed/gi,
      /<object/gi,
      /javascript:/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }
}

// Export instances
export const encryptionService = new EncryptionService();
export default {
  EncryptionService,
  HashingService,
  TokenService,
  SanitizationService,
  encryptionService
};
