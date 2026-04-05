/**
 * Environment Variable Validator
 * Validates required environment variables at application startup
 * @module envValidator
 */

/**
 * List of required environment variables
 * @type {Object}
 */
const REQUIRED_ENV_VARS = {
  VITE_OPENAI_API_KEY: {
    required: true,
    description: 'OpenAI API key for chat functionality'
  },
  VITE_APP_NAME: {
    required: false,
    description: 'Application name',
    default: 'Aadhaar & DBT Awareness Platform'
  },
  VITE_API_URL: {
    required: false,
    description: 'Backend API URL',
    default: 'http://localhost:5000'
  }
};

/**
 * Validates all required environment variables
 * Logs warnings for missing optional variables
 * @returns {Object} Validation result with status and details
 * @throws {Error} If critical required variables are missing
 */
export const validateEnvironmentVariables = () => {
  const validationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    variables: {}
  };

  Object.entries(REQUIRED_ENV_VARS).forEach(([varName, config]) => {
    const value = import.meta.env[varName];

    if (!value && config.required) {
      validationResult.isValid = false;
      validationResult.errors.push(
        `Missing required environment variable: ${varName} (${config.description})`
      );
    }

    if (!value && !config.required && config.default) {
      validationResult.warnings.push(
        `${varName} not set, using default: ${config.default}`
      );
      validationResult.variables[varName] = config.default;
    } else if (value) {
      validationResult.variables[varName] = value;
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
  const value = import.meta.env[varName];
  
  if (value === undefined && defaultValue !== undefined) {
    console.warn(`Environment variable ${varName} not found, using default`);
    return defaultValue;
  }

  return value;
};

/**
 * Check if running in production environment
 * @returns {boolean} True if in production
 */
export const isProduction = () => {
  return import.meta.env.MODE === 'production';
};

/**
 * Check if running in development environment
 * @returns {boolean} True if in development
 */
export const isDevelopment = () => {
  return import.meta.env.MODE === 'development';
};
