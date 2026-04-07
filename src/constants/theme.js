/**
 * Theme & Constants Module
 * Centralized configuration for colors, spacing, typography, and app constants
 * @module theme-constants
 */

/**
 * Color Palette
 */
export const COLORS = {
  // Primary
  primary: '#1976d2',
  primaryLight: '#42a5f5',
  primaryDark: '#1565c0',

  // Secondary
  secondary: '#dc004e',
  secondaryLight: '#f73378',
  secondaryDark: '#9a0036',

  // Status Colors
  success: '#4caf50',
  successLight: '#81c784',
  successDark: '#2e7d32',
  warning: '#ff9800',
  warningLight: '#ffb74d',
  warningDark: '#e65100',
  error: '#f44336',
  errorLight: '#ef5350',
  errorDark: '#c62828',
  info: '#2196f3',
  infoLight: '#64b5f6',
  infoDark: '#1565c0',

  // Neutral
  white: '#ffffff',
  black: '#000000',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  // Semantic
  text: '#212121',
  textSecondary: '#757575',
  textDisabled: '#bdbdbd',
  background: '#fafafa',
  surface: '#ffffff',
  border: '#e0e0e0',
  divider: '#eeeeee'
};

/**
 * Dark Mode Colors
 */
export const DARK_COLORS = {
  ...COLORS,
  text: '#ffffff',
  textSecondary: '#b0bec5',
  textDisabled: '#78909c',
  background: '#121212',
  surface: '#1e1e1e',
  border: '#424242',
  divider: '#37474f'
};

/**
 * Spacing System (8px base unit)
 */
export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

/**
 * Typography
 */
export const TYPOGRAPHY = {
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.5px'
  },
  h2: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: '0px'
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.15px'
  },
  h4: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: '0.15px'
  },
  h5: {
    fontSize: '16px',
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: '0.15px'
  },
  h6: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '0.125px'
  },
  body1: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: '0.5px'
  },
  body2: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: '0.25px'
  },
  button: {
    fontSize: '14px',
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: '0.75px',
    textTransform: 'uppercase'
  },
  caption: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: '0.4px'
  }
};

/**
 * Border Radius
 */
export const BORDER_RADIUS = {
  none: '0px',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

/**
 * Shadows
 */
export const SHADOWS = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px rgba(0, 0, 0, 0.15)'
};

/**
 * Breakpoints
 */
export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/**
 * Z-Index Scale
 */
export const Z_INDEX = {
  hidden: -1,
  auto: 'auto',
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  backdrop: 1040,
  offcanvas: 1050,
  modal: 1060,
  popover: 1070,
  tooltip: 1080
};

/**
 * Animation Durations (milliseconds)
 */
export const ANIMATION = {
  fast: 150,
  base: 300,
  slow: 500
};

/**
 * App Constants
 */
export const APP_CONSTANTS = {
  // Authentication
  AUTH_TOKEN_KEY: 'auth_token',
  USER_KEY: 'user',
  SESSION_KEY: 'session',
  
  // API
  API_TIMEOUT: 30000,
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000,
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
  
  // Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_INPUT_LENGTH: 4000,
  MAX_HISTORY_SIZE: 100,
  
  // Timeouts
  DEBOUNCE_DELAY: 300,
  THROTTLE_INTERVAL: 500,
  
  // Cache
  CACHE_DURATION: 3600000, // 1 hour
  
  // Rich Text
  CHAR_LIMIT: 1000,
  WORD_LIMIT: 200
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  
  // 3xx Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,
  
  // 4xx Client Error
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  
  // 5xx Server Error
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

/**
 * User Roles
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
};

/**
 * Permissions
 */
export const PERMISSIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage'
};

/**
 * Languages
 */
export const LANGUAGES = {
  EN: 'en',
  HI: 'hi'
};

/**
 * Date Formats
 */
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD MMMM YYYY',
  FULL: 'dddd, DD MMMM YYYY',
  TIME: 'HH:MM:SS',
  ISO: 'YYYY-MM-DD',
  DISPLAY: 'DD-MM-YYYY HH:MM'
};

/**
 * Order Status
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  RETURNED: 'returned'
};

/**
 * Payment Status
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

/**
 * Notification Types
 */
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

/**
 * Form Field Types
 */
export const FORM_FIELD_TYPES = {
  TEXT: 'text',
  EMAIL: 'email',
  PASSWORD: 'password',
  NUMBER: 'number',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  DATE: 'date',
  FILE: 'file',
  PHONE: 'tel'
};

/**
 * Regular Expressions
 */
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  AADHAAR: /^\d{12}$/,
  IFSC: /^[A-Z]{4}0[A-Z0-9]{6}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

/**
 * Environment Variables
 */
export const ENV = {
  DEV: 'development',
  STAGING: 'staging',
  PROD: 'production'
};

export default {
  COLORS,
  DARK_COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDER_RADIUS,
  SHADOWS,
  BREAKPOINTS,
  Z_INDEX,
  ANIMATION,
  APP_CONSTANTS,
  HTTP_STATUS,
  USER_ROLES,
  PERMISSIONS,
  LANGUAGES,
  DATE_FORMATS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  NOTIFICATION_TYPES,
  FORM_FIELD_TYPES,
  REGEX,
  ENV
};
