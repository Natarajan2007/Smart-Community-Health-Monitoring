# Utility Functions Documentation

## Overview
The `utils` directory contains reusable utility functions and modules for common operations across the Smart Community Health Monitoring application.

## Validation Module (`validation.js`)

A comprehensive input validation library for form validation, data sanitization, and business logic validation.

### Available Functions

#### Email Validation
```javascript
import { isValidEmail } from '../utils/validation';

isValidEmail('user@example.com'); // true
isValidEmail('invalid-email');     // false
```

#### Phone Number Validation (Indian Format)
```javascript
import { isValidPhone } from '../utils/validation';

isValidPhone('9876543210');  // true
isValidPhone('1234567890');  // false
```

#### Aadhaar Number Validation
```javascript
import { isValidAadhaar } from '../utils/validation';

isValidAadhaar('123456789012');  // true
isValidAadhaar('1234567890');    // false
```

#### Bank Account Number Validation
```javascript
import { isValidAccountNumber } from '../utils/validation';

isValidAccountNumber('12345678901234');  // true
isValidAccountNumber('123');             // false
```

#### IFSC Code Validation
```javascript
import { isValidIFSC } from '../utils/validation';

isValidIFSC('SBIN0001234');  // true
isValidIFSC('INVALID');      // false
```

#### General String Validation
```javascript
import { isNotEmpty, isValidLength } from '../utils/validation';

isNotEmpty('hello');        // true
isNotEmpty('   ');          // false

isValidLength('hello', 1, 10);   // true
isValidLength('hi', 5, 10);      // false
```

#### Input Sanitization
```javascript
import { sanitizeInput } from '../utils/validation';

sanitizeInput('<script>alert("xss")</script>');  // Removes dangerous characters
```

#### Form Validation
```javascript
import { validateForm } from '../utils/validation';

const rules = {
  email: { 
    validator: isValidEmail, 
    message: 'Please enter a valid email address' 
  },
  phone: { 
    validator: isValidPhone, 
    message: 'Please enter a valid 10-digit phone number' 
  }
};

const result = validateForm(formData, rules);
// result = { isValid: true/false, errors: {...} }
```

#### Eligibility Validation
```javascript
import { validateEligibility } from '../utils/validation';

const eligibilityResult = validateEligibility({
  age: 25,
  aadhaar: '123456789012',
  accountType: 'DBT'
});

// result = { isEligible: true, errors: [] }
```

## Usage Best Practices

1. **Always validate user input** before processing:
   ```javascript
   if (isValidEmail(email)) {
     // Process email
   }
   ```

2. **Use sanitizeInput** for user-generated content to prevent XSS:
   ```javascript
   const cleanInput = sanitizeInput(userInput);
   ```

3. **Use validateForm** for complex form validation:
   ```javascript
   const { isValid, errors } = validateForm(formData, validationRules);
   if (!isValid) {
     // Display errors
     console.log(errors);
   }
   ```

4. **Combine validators for comprehensive checks**:
   ```javascript
   if (isValidLength(password, 8, 20) && isNotEmpty(password)) {
     // Password is valid
   }
   ```

## Error Handling Example

```javascript
import { validateEligibility, isValidAadhaar } from '../utils/validation';
import { translations } from '../data/en'; // or hi

function handleUserSubmit(formData) {
  // First validate individual fields
  if (!isValidAadhaar(formData.aadhaar)) {
    return {
      success: false,
      error: translations.errors.invalidAadhaar
    };
  }

  // Then validate eligibility
  const { isEligible, errors } = validateEligibility(formData);
  
  if (!isEligible) {
    return {
      success: false,
      error: translations.errors.notEligible,
      details: errors
    };
  }

  // Process the data
  return {
    success: true,
    message: translations.success.processed
  };
}
```

## Security Considerations

- All email, phone, and IFSC validations use regex patterns
- `sanitizeInput` removes potentially harmful HTML characters
- Aadhaar and account numbers are validated for format only
- Always validate on both frontend and backend
- Use HTTPS for sensitive data transmission
- Never log sensitive information (Aadhaar, account numbers)

## Future Enhancements

- Add UPI ID validation
- Add PAN number validation
- Add address format validation
- Add date validation utilities
- Add credit score validation ranges
