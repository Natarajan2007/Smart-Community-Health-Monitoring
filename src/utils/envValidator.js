/**
 * Environment Variable Validator
 * Validates required environment variables at application startup
 * Provides configuration management and type validation
 * @module envValidator
 */

/**
 * List of required environment variables with validation rules
 * @type {Object}
 */
const REQUIRED_ENV_VARS = {
  // API Configuration
  VITE_OPENAI_API_KEY: {
    required: true,
    description: 'OpenAI API key for chat functionality',
    type: 'string',
    sensitive: true,
    validate: (value) => value && value.startsWith('sk-')
  },
  VITE_OPENAI_MODEL: {
    required: false,
    description: 'OpenAI model selection',
    default: 'gpt-3.5-turbo',
    type: 'string',
    allowedValues: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo-preview', 'gpt-4-turbo']
  },
  VITE_OPENAI_MAX_TOKENS: {
    required: false,
    description: 'Maximum tokens for API responses',
    default: '2048',
    type: 'number',
    validate: (value) => {
      const num = parseInt(value);
      return num >= 256 && num <= 4096;
    }
  },
  
  // Application Configuration
  VITE_APP_NAME: {
    required: false,
    description: 'Application name',
    default: 'Aadhaar & DBT Awareness Platform',
    type: 'string'
  },
  VITE_API_URL: {
    required: false,
    description: 'Backend API URL',
    default: 'http://localhost:5000',
    type: 'string',
    validate: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
  },
  
  // Server Configuration
  PORT: {
    required: false,
    description: 'Server port number',
    default: '5000',
    type: 'number',
    validate: (value) => {
      const port = parseInt(value);
      return port > 0 && port < 65535;
    }
  },
  NODE_ENV: {
    required: false,
    description: 'Application environment',
    default: 'development',
    type: 'string',
    allowedValues: ['development', 'staging', 'production']
  },
  DEBUG: {
    required: false,
    description: 'Enable debug logging',
    default: 'false',
    type: 'boolean'
  },
  
  // CORS Configuration
  CORS_ORIGINS: {
    required: false,
    description: 'Comma-separated origins for CORS',
    default: 'http://localhost:3000,http://localhost:5000',
    type: 'string'
  }
};

/**
 * Get configuration object with all environment variables
 * @returns {Object} Configuration object with validated values
 */
export const getConfig = () => {
  const config = {};
  
  Object.entries(REQUIRED_ENV_VARS).forEach(([varName, schema]) => {
    const value = import.meta.env[varName] || process.env[varName] || schema.default;
    
    // Type conversion
    if (schema.type === 'number' && value) {
      config[varName] = parseInt(value);
    } else if (schema.type === 'boolean' && value) {
      config[varName] = value === 'true' || value === true;
    } else {
      config[varName] = value;
    }
  });
  
  return config;
};

/**
 * Validates all required environment variables
 * Logs warnings for missing optional variables
 * Checks type correctness and custom validation rules
 * @returns {Object} Validation result with status, errors, and warnings
 */
export const validateEnvironmentVariables = () => {
  const validationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    variables: {}
  };

  Object.entries(REQUIRED_ENV_VARS).forEach(([varName, config]) => {
    const value = import.meta.env[varName] || process.env[varName];

    if (!value && config.required) {
      validationResult.isValid = false;
      validationResult.errors.push(
        `❌ Missing REQUIRED: ${varName} - ${config.description}`
      );
    } else if (!value && config.default) {
      validationResult.warnings.push(
        `⚠️  Using default for ${varName}: "${config.default}"`
      );
      validationResult.variables[varName] = config.default;
    } else if (value) {
      // Validate against allowed values
      if (config.allowedValues && !config.allowedValues.includes(value)) {
        validationResult.errors.push(
          `❌ Invalid value for ${varName}: "${value}". Allowed: ${config.allowedValues.join(', ')}`
        );
        validationResult.isValid = false;
      }
      
      // Custom validation
      if (config.validate && !config.validate(value)) {
        validationResult.errors.push(
          `❌ Invalid format for ${varName}: "${value}"`
        );
        validationResult.isValid = false;
      }
      
      // Don't expose sensitive values in logs
      const displayValue = config.sensitive ? '***' : value;
      validationResult.variables[varName] = displayValue;
    }
  });

  // Log results
  if (validationResult.errors.length > 0) {
    console.error('❌ Environment Validation Failed:', validationResult.errors);
  }

  if (validationResult.warnings.length > 0) {
    console.warn('⚠️  Environment Validation Warnings:', validationResult.warnings);
  }

  if (validationResult.isValid && validationResult.warnings.length === 0) {
    console.log('✅ Environment variables validated successfully');
  }

  return validationResult;
};

/**
 * Get a specific environment variable with fallback
 * @param {string} varName - Variable name
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Environment variable value or default
 */
export const getEnvVariable = (varName, defaultValue = undefined) => {
  const value = import.meta.env[varName] || process.env[varName];
  
  if (!value && defaultValue !== undefined) {
    console.warn(`⚠️  Environment variable ${varName} not found, using default`);
    return defaultValue;
  }

  return value;
};

/**
 * Check if running in production environment
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  const env = process.env.NODE_ENV || import.meta.env.MODE || 'development';
  return env === 'production';
};

/**
 * Check if running in development environment
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
  const env = process.env.NODE_ENV || import.meta.env.MODE || 'development';
  return env === 'development';
};

/**
 * Check if debug mode is enabled
 * @returns {boolean} True if debug is enabled
 */
export const isDebugMode = () => {
  const debug = getEnvVariable('DEBUG', 'false');
  return debug === 'true' || debug === true;
};

export default {
  getConfig,
  validateEnvironmentVariables,
  getEnvVariable,
  isProduction,
  isDevelopment,
  isDebugMode,
  REQUIRED_ENV_VARS
};
