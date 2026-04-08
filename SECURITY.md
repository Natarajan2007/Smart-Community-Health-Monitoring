# Security Guidelines & Best Practices

## Overview

The Smart Community Health Monitoring API includes comprehensive security utilities for data protection, encryption, hashing, and threat detection.

## Security Features

### 1. **Encryption Service (AES-256-GCM)**

Encrypt and decrypt sensitive data with military-grade encryption.

```javascript
import { encryptionService } from './services/securityService.js';

// Encrypt sensitive data
const encrypted = encryptionService.encrypt('user@example.com');
console.log(encrypted); // Base64-encoded encrypted data

// Decrypt data
const decrypted = encryptionService.decrypt(encrypted);
console.log(decrypted); // 'user@example.com'
```

**Configuration:**
```
ENCRYPTION_KEY=<32-byte hex key>
ENCRYPTION_MASTER_PASS=<master password for key derivation>
```

**Generate Encryption Key:**
```javascript
import { EncryptionService } from './services/securityService.js';
const key = EncryptionService.generateKey();
console.log(key); // 64-char hex string
```

---

### 2. **Password Hashing (PBKDF2-SHA512)**

Securely hash passwords with 100,000 iterations.

```javascript
import { HashingService } from './services/securityService.js';

// Hash password
const hashed = HashingService.hashPassword('userPassword123');
// {
//   algorithm: 'pbkdf2-sha512',
//   iterations: 100000,
//   salt: 'abc123...',
//   hash: 'def456...'
// }

// Verify password
const isValid = HashingService.verifyPassword('userPassword123', hashed);
console.log(isValid); // true
```

**Security Levels:**
- PBKDF2-SHA512 with 100,000 iterations (NIST recommended)
- Unique salt per password
- Resistant to: dictionary attacks, rainbow tables, GPU cracking

---

### 3. **Hashing Functions**

Multiple hash algorithms for different use cases:

```javascript
import { HashingService } from './services/securityService.js';

// SHA-256 (fast, for non-sensitive data)
const sha256 = HashingService.sha256('data');

// SHA-512 (slower, more secure)
const sha512 = HashingService.sha512('data');

// HMAC-SHA256 (keyed hash for authentication)
const hmac = HashingService.hmac256('data', 'secret-key');
```

---

### 4. **Token Generation & Validation**

Generate secure tokens and JWT-like tokens.

```javascript
import { TokenService } from './services/securityService.js';

// Generate random token (32 bytes)
const token = TokenService.generateToken();
console.log(token); // 64-char hex string

// Generate JWT-like token
const jwtToken = TokenService.generateJWTToken(
  { userId: 123, role: 'admin' },
  'secret-key',
  3600 // Expires in 1 hour
);

// Verify JWT token
const payload = TokenService.verifyJWTToken(jwtToken, 'secret-key');
console.log(payload); // { userId: 123, role: 'admin', iat: ..., exp: ... }
```

---

### 5. **Data Sanitization**

Remove potentially dangerous content from user input.

```javascript
import { SanitizationService } from './services/securityService.js';

// Sanitize strings
const safe = SanitizationService.sanitizeString(userInput);

// Sanitize objects recursively
const safeObj = SanitizationService.sanitizeObject(userObject);

// Detect SQL injection
const hasSQLi = SanitizationService.containsSQLInjection(userInput);

// Detect XSS patterns
const hasXSS = SanitizationService.containsXSS(userInput);

// Mask sensitive data
const masked = SanitizationService.maskData('user@example.com', 'email');
// Output: 'us***@example.com'
```

---

## OWASP Top 10 Protection

### 1. **Injection Prevention**
- Input sanitization for SQL and XSS
- Parameterized queries
- Input validation and length limits

```javascript
if (SanitizationService.containsSQLInjection(userInput)) {
  throw new Error('Invalid input detected');
}
```

### 2. **Authentication & Session Management**
- Secure password hashing (PBKDF2-SHA512)
- Token-based authentication
- Session expiration

```javascript
const hashed = HashingService.hashPassword(password);
const verified = HashingService.verifyPassword(userPassword, hashed);
```

### 3. **Sensitive Data Exposure**
- AES-256-GCM encryption at rest
- HTTPS in production
- Secure token storage

```javascript
const encrypted = encryptionService.encrypt(sensitiveData);
```

### 4. **XML External Entities (XXE)**
- Disabled XML parsing
- Input validation

### 5. **Broken Access Control**
- Request ID tracking for audit
- Logging of all operations
- Rate limiting per IP

### 6. **Security Misconfiguration**
- Environment variable validation
- Secure defaults
- Security headers

### 7. **XSS Prevention**
- Input sanitization
- Output encoding
- Content Security Policy headers

### 8. **Insecure Deserialization**
- Type validation
- Safe JSON parsing
- Object sanitization

### 9. **Using Components with Known Vulnerabilities**
- Regular dependency updates
- Vulnerability scanning
- Version pinning

### 10. **Insufficient Logging & Monitoring**
- Request logging
- Error logging
- Audit trails

---

## Implementation Examples

### Secure User Authentication

```javascript
import { HashingService, TokenService } from './services/securityService.js';

// Registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  
  // Hash password
  const hashed = HashingService.hashPassword(password);
  
  // Store: { username, hashed.algorithm, hashed.iterations, hashed.salt, hashed.hash }
  database.users.create({ username, ...hashed });
  
  res.json({ message: 'User created' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = database.users.findOne({ username });
  
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  
  // Verify password
  const isValid = HashingService.verifyPassword(password, {
    algorithm: user.algorithm,
    iterations: user.iterations,
    salt: user.salt,
    hash: user.hash
  });
  
  if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });
  
  // Generate token
  const token = TokenService.generateJWTToken(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    86400 // 24 hours
  );
  
  res.json({ token, message: 'Logged in successfully' });
});
```

### Encrypt Sensitive Data at Rest

```javascript
import { encryptionService } from './services/securityService.js';

// Store encrypted
app.post('/users', (req, res) => {
  const { email, phone } = req.body;
  
  const encrypted = {
    email: encryptionService.encrypt(email),
    phone: encryptionService.encrypt(phone)
  };
  
  database.users.create(encrypted);
  res.json({ message: 'User created' });
});

// Retrieve and decrypt
app.get('/users/:id', (req, res) => {
  const user = database.users.findOne({ id: req.params.id });
  
  const decrypted = {
    ...user,
    email: encryptionService.decrypt(user.email),
    phone: encryptionService.decrypt(user.phone)
  };
  
  res.json(decrypted);
});
```

### Input Validation Middleware

```javascript
import { SanitizationService } from './services/securityService.js';

function validateInput(req, res, next) {
  const { query, body } = req;
  
  // Check for SQL injection
  if (SanitizationService.containsSQLInjection(JSON.stringify(query))) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  // Check for XSS
  if (SanitizationService.containsXSS(JSON.stringify(body))) {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  // Sanitize input
  req.body = SanitizationService.sanitizeObject(body);
  
  next();
}

app.use(validateInput);
```

---

## Environment Configuration

Required security environment variables:

```env
# Encryption
ENCRYPTION_KEY=<32-byte hex key generated by EncryptionService.generateKey()>
ENCRYPTION_MASTER_PASS=<strong master password>

# JWT
JWT_SECRET=<strong random secret>
JWT_EXPIRY=86400

# Security
CORS_ORIGINS=https://trusted-domain.com
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60000

# HTTPS (production)
NODE_ENV=production
HTTPS_ENABLED=true
```

---

## Security Checklist

- [ ] All passwords hashed with PBKDF2-SHA512
- [ ] Sensitive data encrypted at rest (AES-256-GCM)
- [ ] Input validation for SQL injection and XSS
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] HTTPS enabled in production
- [ ] Audit logging enabled
- [ ] Secrets in environment variables
- [ ] Dependencies updated
- [ ] Error messages don't expose sensitive info

---

## Troubleshooting

### Encryption/Decryption Fails
- Verify `ENCRYPTION_KEY` is valid 32-byte hex string
- Check that data wasn't corrupted in transit
- Ensure same encryption key used for encryption and decryption

### Password Verification Fails
- Verify algorithm, iterations, and salt match stored values
- Check password encoding (UTF-8)

### Token Verification Fails
- Verify JWT secret matches issuer
- Check token hasn't expired
- Verify token format (3 dot-separated parts)

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Password Guidelines](https://pages.nist.gov/800-63-3/)
- [OWASP Cryptographic Storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
