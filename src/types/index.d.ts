/**
 * TypeScript Type Definitions
 * Comprehensive type definitions for the Smart Community Health Monitoring platform
 */

// ===== API Types =====
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: number;
  statusCode: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  statusCode: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ===== User & Authentication Types =====
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

// ===== Account Types =====
export interface BankAccount {
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  accountHolder: string;
}

export interface AadhaarAccount {
  aadhaarNumber: string;
  linkedBankAccounts: BankAccount[];
  linkDate: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface DBTAccount extends AadhaarAccount {
  dbtBenefits: DBTBenefit[];
  eligibilityStatus: 'eligible' | 'ineligible' | 'pending_verification';
}

export interface DBTBenefit {
  id: string;
  name: string;
  description: string;
  amount: number;
  frequency: 'monthly' | 'yearly' | 'one-time';
  status: 'active' | 'inactive';
}

// ===== Form & Validation Types =====
export interface ValidationRule {
  type: 'email' | 'phone' | 'aadhaar' | 'text' | 'accountNumber' | 'ifsc' | 'custom';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error: string | null;
  value?: any;
}

export interface FormValidationRules {
  [fieldName: string]: ValidationRule | ValidationRule[];
}

export interface FormData {
  [key: string]: any;
}

// ===== Chat & Messaging Types =====
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  language: 'en' | 'hi';
}

export interface ConversationContext {
  messages: ChatMessage[];
  sessionId: string;
  userId?: string;
  language: 'en' | 'hi';
}

// ===== Analytics Types =====
export interface AnalyticsEvent {
  eventName: string;
  eventType: 'page_view' | 'click' | 'form_submit' | 'error' | 'custom';
  userId?: string;
  sessionId: string;
  timestamp: Date;
  properties: Record<string, any>;
}

export interface PerformanceMetric {
  endpoint: string;
  duration: number;
  status: number;
  success: boolean;
  timestamp: Date;
}

export interface PageMetric {
  pageName: string;
  duration: number;
  timestamp: Date;
}

// ===== Component Props Types =====
export interface AlertProps {
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  autoClose?: boolean;
  autoCloseDelay?: number;
  onClose?: () => void;
}

export interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
}

export interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  error?: string;
}

// ===== Configuration Types =====
export interface AppConfig {
  apiUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  maxTokens: number;
  appName: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error' | 'silent';
  port: number;
  nodeEnv: 'development' | 'staging' | 'production';
}

export interface RequestConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  rateLimitRequests: number;
  rateLimitWindow: number;
  maxRequestSize: string;
}

// ===== Error Types =====
export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
}

// ===== Language & Localization =====
export type Language = 'en' | 'hi';
export type LanguageContent = Record<string, any>;

export interface LocalizationConfig {
  currentLanguage: Language;
  supportedLanguages: Language[];
  translations: Record<Language, LanguageContent>;
}

// ===== Environment Variables =====
export interface EnvironmentVariables {
  VITE_OPENAI_API_KEY: string;
  VITE_OPENAI_MODEL: string;
  VITE_OPENAI_MAX_TOKENS: number;
  VITE_APP_NAME: string;
  VITE_API_URL: string;
  PORT: number;
  NODE_ENV: 'development' | 'staging' | 'production';
  DEBUG: boolean;
}

// ===== Utility Types =====
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;
export type Callback<T = void> = (...args: any[]) => T;

// ===== React Hook Types =====
export interface UseStateHook<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => void;
}

export interface UseEffectDependencies extends Array<any> {}

export type ReactComponent<P = {}> = (props: P) => JSX.Element | null;
