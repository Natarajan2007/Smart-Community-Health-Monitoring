# Development Guide

## Project Overview

The Smart Community Health Monitoring project is an educational platform helping Indian students understand Aadhaar and DBT (Direct Benefit Transfer) systems. This guide provides comprehensive information for developers.

## Architecture

### Frontend Structure
```
src/
├── components/       # React UI components
│   ├── Header       # Navigation and language switcher
│   ├── Hero         # Landing section
│   ├── Education    # Educational content
│   ├── Comparison   # Comparison table
│   ├── FAQ          # FAQ section
│   ├── ContactSection
│   ├── Footer
│   ├── ChatWidget   # AI chat assistant
│   ├── ChatPage     # Full chat interface
│   ├── EligibilityChecker
│   ├── GamifiedQuiz
│   ├── AnalyticsDashboard
│   ├── ErrorBoundary
│   └── AccessibleAlert
├── services/        # Backend service integrations
│   ├── openaiService.js
│   ├── analyticsService.js
│   ├── healthCheckService.js
│   ├── performanceService.js
│   ├── advancedLogger.js
│   └── eligibilityService.js
├── utils/           # Utility functions
│   ├── validation.js
│   ├── validation.js
│   ├── inputSanitization.js (NEW)
│   ├── errorResponse.js (NEW)
│   ├── commonHelpers.js
│   └── enhancedErrorHandling.js
├── hooks/           # Custom React hooks
│   ├── useAnalytics.js
│   └── customHooks.js
├── data/            # Localization and content
│   ├── en.js        # English translations
│   ├── hi.js        # Hindi translations
│   └── quizData.js
└── scss/            # Styling
```

### Backend Structure
```
server.js           # Express server with API endpoints
.env.local          # Environment configuration
```

## Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm v8 or higher
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/Natarajan2007/Smart-Community-Health-Monitoring.git
cd Smart-Community-Health-Monitoring

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Running the Application
```bash
# Development server (Frontend + Backend)
npm run dev
npm run server  # In separate terminal

# Production build
npm run build
npm run preview

# Run tests
npm test
npm run test:watch
npm run test:coverage
```

## Code Quality Tools

### ESLint
Maintains code consistency and catches potential errors.

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Prettier
Enforces consistent code formatting.

```bash
# Format code
npm run format

# Check formatting without changes
npm run format:check
```

## Build and Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build      # Creates optimized build in dist/
npm run preview    # Preview production build locally
```

## Component Performance

Components in this project are optimized using React.memo to prevent unnecessary re-renders:

- `Header` - Memoized with useCallback for event handlers
- `Hero` - Memoized to prevent re-renders
- `Footer` - Memoized for consistent rendering
- `Comparison` - Memoized for table performance

### Best Practices for New Components

```javascript
import React, { memo } from 'react';

/**
 * MyComponent - Description
 * 
 * Memoized component to prevent unnecessary re-renders.
 * 
 * @component
 * @param {Object} props - Component props
 * @returns {JSX.Element}
 */
function MyComponent(props) {
  // Component logic
  return <div>Content</div>;
}

export default memo(MyComponent);
```

## Security

### Input Validation and Sanitization

Use the enhanced validation utilities for all user inputs:

```javascript
import { 
  validateEmailEnhanced, 
  validatePhoneEnhanced, 
  detectInjectionPatterns 
} from '@/utils/inputSanitization';

// Single field validation
const emailResult = validateEmailEnhanced(userEmail);
if (!emailResult.isValid) {
  console.error(emailResult.error);
}

// Multiple field validation
const schema = {
  email: { type: 'email' },
  phone: { type: 'phone' },
  name: { minLength: 2, maxLength: 50 }
};
const validation = validateBatch(formData, schema);
```

### Injection Prevention

```javascript
import { detectInjectionPatterns } from '@/utils/inputSanitization';

const result = detectInjectionPatterns(userInput);
if (result.detected) {
  console.warn('Potential injection detected:', result.patterns);
}
```

## Error Handling

Use standardized error responses for consistency:

```javascript
import { 
  validationError, 
  serverError, 
  notFoundError 
} from '@/utils/errorResponse';

// Return structured error
return validationError('email', 'Please provide a valid email');
```

## Performance Monitoring

The application includes built-in performance monitoring:

```javascript
import { recordApiMetric, recordComponentMetric } from '@/services/performanceService';

// Record API performance
recordApiMetric('/api/chat', duration, 200, true);

// Record component render time
recordComponentMetric('ChatComponent', duration);
```

## Testing

### Unit Tests
```bash
npm test
```

### Coverage Report
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Environment Variables

Key environment variables (see .env.example):

```
VITE_OPENAI_API_KEY      # OpenAI API key (required)
VITE_OPENAI_MODEL        # Model to use (default: gpt-3.5-turbo)
VITE_OPENAI_MAX_TOKENS   # Max response tokens
PORT                     # Server port (default: 5000)
NODE_ENV                 # Environment (development/production)
DEBUG                    # Enable debug logging
```

## Common Tasks

### Adding a New Page
1. Create component in `src/components/`
2. Add route in `App.jsx`
3. Update navigation in `Header.jsx`
4. Add content to `src/data/en.js` and `src/data/hi.js`

### Adding a New Feature
1. Create utility functions in `src/utils/`
2. Create service if needed in `src/services/`
3. Use custom hooks from `src/hooks/`
4. Wrap component with memoization if frequently used

### Debugging

Enable debug logging:
```javascript
# In .env.local
DEBUG=true

# In code
console.log('[DEBUG]', message);
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID [PID] /F
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build Fails
```bash
# Clear Vite cache
rm -rf dist .vite
npm run build
```

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Follow code style: `npm run lint:fix && npm run format`
4. Commit with clear messages
5. Push and create pull request

## Deployment Checklist

- [ ] Run `npm run lint` - no errors
- [ ] Run `npm test` - all tests pass
- [ ] Run `npm run build` - build succeeds
- [ ] Test production build: `npm run preview`
- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md
- [ ] Commit and tag release
- [ ] Push to main branch

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Express.js Guide](https://expressjs.com)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules)
- [Prettier Options](https://prettier.io/docs/en/options.html)

## Support

For issues or questions:
1. Check existing issues on GitHub
2. Create detailed issue report
3. Include error logs and reproduction steps
4. Mention your environment (OS, Node version, etc.)
