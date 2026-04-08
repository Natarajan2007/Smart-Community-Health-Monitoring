/**
 * Database Models & Schemas
 * Defines data models for users, sessions, messages, and analytics
 */

/**
 * User Model
 * Stores user account information securely
 */
export const UserModel = {
  collection: 'users',
  schema: {
    id: { type: 'string', primaryKey: true, required: true },
    username: { type: 'string', required: true, unique: true, index: true },
    email: { type: 'string', required: true, unique: true, index: true },
    phoneNumber: { type: 'string', required: false, unique: true },
    passwordHash: { type: 'object', required: true },
    aadhaarHash: { type: 'string', required: false }, // Hash only, encrypted storage
    profile: {
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      avatar: { type: 'string' },
      preferredLanguage: { type: 'string', default: 'en' }
    },
    status: { type: 'string', enum: ['active', 'inactive', 'suspended'], default: 'active' },
    roles: { type: 'array', default: ['user'] },
    emailVerified: { type: 'boolean', default: false },
    phoneVerified: { type: 'boolean', default: false },
    twoFactorEnabled: { type: 'boolean', default: false },
    lastLogin: { type: 'date' },
    lastLoginIp: { type: 'string' },
    loginAttempts: { type: 'number', default: 0 },
    lockedUntil: { type: 'date' },
    metadata: { type: 'object' },
    createdAt: { type: 'date', default: 'now', index: true },
    updatedAt: { type: 'date', default: 'now' },
    deletedAt: { type: 'date' } // Soft delete
  },
  indexes: ['email', 'username', 'createdAt'],
  validation: {
    username: (val) => val && val.length >= 3 && val.length <= 50,
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phoneNumber: (val) => !val || /^\d{10}$/.test(val)
  }
};

/**
 * Session Model
 * Tracks user sessions for audit and security
 */
export const SessionModel = {
  collection: 'sessions',
  schema: {
    id: { type: 'string', primaryKey: true },
    userId: { type: 'string', required: true, index: true, foreignKey: 'users.id' },
    token: { type: 'string', required: true, unique: true, index: true },
    ipAddress: { type: 'string', required: true },
    userAgent: { type: 'string' },
    deviceId: { type: 'string' },
    deviceType: { type: 'string', enum: ['mobile', 'tablet', 'desktop'] },
    browser: { type: 'string' },
    os: { type: 'string' },
    isActive: { type: 'boolean', default: true, index: true },
    lastActivityAt: { type: 'date', index: true },
    expiresAt: { type: 'date', required: true, index: true },
    createdAt: { type: 'date', default: 'now' },
    metadata: { type: 'object' }
  },
  indexes: ['userId', 'token', 'expiresAt', 'isActive'],
  ttl: { field: 'expiresAt' } // Auto-delete expired sessions
};

/**
 * Chat Message Model
 * Stores conversation history for analytics and compliance
 */
export const ChatMessageModel = {
  collection: 'chatMessages',
  schema: {
    id: { type: 'string', primaryKey: true },
    sessionId: { type: 'string', required: true, index: true },
    userId: { type: 'string', required: true, index: true, foreignKey: 'users.id' },
    role: { type: 'string', enum: ['user', 'assistant', 'system'], required: true },
    content: { type: 'string', required: true },
    contentLength: { type: 'number' },
    language: { type: 'string', default: 'en' },
    sentiment: { type: 'string', enum: ['positive', 'neutral', 'negative'] },
    responseTime: { type: 'number' }, // milliseconds
    model: { type: 'string' }, // GPT model used
    tokens: {
      prompt: { type: 'number' },
      completion: { type: 'number' },
      total: { type: 'number' }
    },
    searchQuery: { type: 'string' }, // For search feature
    metadata: { type: 'object' },
    createdAt: { type: 'date', default: 'now', index: true },
    updatedAt: { type: 'date' }
  },
  indexes: ['sessionId', 'userId', 'createdAt', 'role'],
  retention: 365 // Days
};

/**
 * Analytics Event Model
 * Tracks user interactions and events for analytics
 */
export const AnalyticsEventModel = {
  collection: 'analyticsEvents',
  schema: {
    id: { type: 'string', primaryKey: true },
    userId: { type: 'string', index: true, foreignKey: 'users.id' },
    sessionId: { type: 'string', index: true },
    eventType: {
      type: 'string',
      enum: [
        'page_view',
        'button_click',
        'form_submit',
        'chat_message',
        'search',
        'quiz_start',
        'quiz_complete',
        'eligibility_check',
        'language_change',
        'error'
      ],
      index: true
    },
    category: { type: 'string' },
    action: { type: 'string' },
    label: { type: 'string' },
    value: { type: 'number' },
    metadata: { type: 'object' },
    deviceInfo: {
      type: { type: 'string' },
      os: { type: 'string' },
      browser: { type: 'string' }
    },
    location: {
      country: { type: 'string' },
      region: { type: 'string' },
      city: { type: 'string' }
    },
    createdAt: { type: 'date', default: 'now', index: true }
  },
  indexes: ['userId', 'sessionId', 'eventType', 'createdAt'],
  retention: 90 // Days
};

/**
 * Eligibility Check Model
 * Stores user eligibility verification results
 */
export const EligibilityCheckModel = {
  collection: 'eligibilityChecks',
  schema: {
    id: { type: 'string', primaryKey: true },
    userId: { type: 'string', required: true, index: true, foreignKey: 'users.id' },
    checkType: {
      type: 'string',
      enum: ['aadhaar_linked', 'aadhaar_seeded', 'dbt_eligible'],
      required: true
    },
    status: { type: 'string', enum: ['eligible', 'ineligible', 'unknown'], required: true },
    details: { type: 'object' },
    documentProof: { type: 'string' }, // URL to stored document
    verifiedAt: { type: 'date' },
    verifiedBy: { type: 'string' },
    expiresAt: { type: 'date' },
    metadata: { type: 'object' },
    createdAt: { type: 'date', default: 'now', index: true },
    updatedAt: { type: 'date', index: true }
  },
  indexes: ['userId', 'checkType', 'status', 'createdAt']
};

/**
 * Audit Log Model
 * Comprehensive audit trail for compliance and security
 */
export const AuditLogModel = {
  collection: 'auditLogs',
  schema: {
    id: { type: 'string', primaryKey: true },
    userId: { type: 'string', index: true, foreignKey: 'users.id' },
    action: { type: 'string', required: true, index: true },
    entity: { type: 'string', required: true },
    entityId: { type: 'string' },
    changes: {
      before: { type: 'object' },
      after: { type: 'object' }
    },
    reason: { type: 'string' },
    status: { type: 'string', enum: ['success', 'failure'] },
    errorMessage: { type: 'string' },
    ipAddress: { type: 'string' },
    userAgent: { type: 'string' },
    requestId: { type: 'string' },
    metadata: { type: 'object' },
    createdAt: { type: 'date', default: 'now', index: true }
  },
  indexes: ['userId', 'action', 'entity', 'createdAt'],
  immutable: true, // Cannot be modified after creation
  retention: 2555 // 7 years for compliance
};

/**
 * Error Log Model
 * Stores error events for debugging and monitoring
 */
export const ErrorLogModel = {
  collection: 'errorLogs',
  schema: {
    id: { type: 'string', primaryKey: true },
    userId: { type: 'string', index: true },
    sessionId: { type: 'string', index: true },
    errorType: { type: 'string', required: true, index: true },
    message: { type: 'string', required: true },
    stackTrace: { type: 'string' },
    context: { type: 'object' },
    endpoint: { type: 'string' },
    method: { type: 'string' },
    statusCode: { type: 'number' },
    requestId: { type: 'string' },
    browserInfo: { type: 'object' },
    resolved: { type: 'boolean', default: false },
    resolvedAt: { type: 'date' },
    resolvedBy: { type: 'string' },
    createdAt: { type: 'date', default: 'now', index: true }
  },
  indexes: ['errorType', 'resolved', 'createdAt'],
  retention: 180 // Days
};

export default {
  UserModel,
  SessionModel,
  ChatMessageModel,
  AnalyticsEventModel,
  EligibilityCheckModel,
  AuditLogModel,
  ErrorLogModel
};
