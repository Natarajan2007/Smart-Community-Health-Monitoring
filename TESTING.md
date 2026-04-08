# Testing Guide

## Overview

This project includes comprehensive unit tests to ensure code quality and prevent regressions.

## Test Setup

### Test Files & Coverage

- **Form Validation Tests** (`src/utils/__tests__/formValidation.test.js`)
  - Email validation
  - Phone number validation (Indian format)
  - Aadhaar number validation
  - Text length validation
  - Account number validation
  - IFSC code validation
  - Batch form validation

- **Helper Utilities Tests** (`src/utils/__tests__/helpers.test.js`)
  - Phone number formatting
  - Aadhaar formatting with masking
  - Account number masking
  - Status color mapping
  - Percentage calculation
  - Mock data generation

## Running Tests

### Commands

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Configuration Files

- **jest.config.json** - Jest configuration with coverage thresholds
- **jest.setup.js** - Test environment setup with mocks for localStorage, window.matchMedia

## Coverage Targets

The project maintains the following coverage thresholds:

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Writing New Tests

### Test Structure

```javascript
import { functionName } from '../file.js';

describe('Feature Name', () => {
  describe('Specific Function', () => {
    test('should do something specific', () => {
      const result = functionName(input);
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Best Practices

1. One `describe` block per function or component
2. Clear test names starting with "should"
3. Arrange-Act-Assert pattern
4. Test both happy paths and edge cases
5. Mock external dependencies (API calls, localStorage, etc.)

## Mocks

### Provided Mocks

- **localStorage** - Full mock with getItem, setItem, removeItem, clear
- **window.matchMedia** - For responsive design testing
- **Environment Variables** - Pre-configured for tests

### Adding Custom Mocks

Add global mocks in `jest.setup.js`:

```javascript
jest.mock('module-name', () => ({
  functionName: jest.fn(),
}));
```

## Debugging Tests

### Run Single Test File

```bash
npm test -- formValidation.test.js
```

### Run Tests with Debug Info

```bash
npm test -- --verbose
```

### Use Test-Only Mode

```javascript
// Run only this test
test.only('should test this', () => {
  // test code
});

// Skip this test
test.skip('should skip this', () => {
  // test code
});
```

## CI/CD Integration

Tests should be run in CI/CD pipelines before deployment. Example GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test -- --coverage
  
- name: Check coverage
  run: npm test -- --coverage --passWithNoTests
```

## Troubleshooting

### Common Issues

**"Cannot find module" error**
- Check that the import path matches the actual file location
- Verify the module name mapper in jest.config.json

**"localStorage is not defined"**
- The mock is already set up in jest.setup.js
- Check that jest.setup.js is properly referenced in jest.config.json

**Tests timeout**
- Increase timeout: `jest.setTimeout(10000)`
- Check for unresolved promises in async tests

## Next Steps

- Add tests for React components
- Add E2E tests with Playwright or Cypress
- Set up GitHub Actions for automated testing
- Add pre-commit hooks to run tests
