/**
 * Security Best Practices Implementation Guide
 * 
 * This document outlines critical security improvements needed for production deployment.
 * All items should be reviewed and implemented before going live.
 */

# Security Best Practices & Improvements

## Current Implementation Status

### ✅ Completed Improvements

1. **Production Logging Control**
   - ✅ All debug logs wrapped in NODE_ENV checks
   - ✅ No sensitive data exposed in production console
   - ✅ Enhanced logger with automatic redaction

2. **Input Validation**
   - ✅ Sanitization of user input (openaiService.js)
   - ✅ Form validation utilities (src/utils/formValidation.js)
   - ✅ Request validation middleware (server.js - rate limiting, size limits)

3. **Error Handling**
   - ✅ Comprehensive error boundary (ErrorBoundary.jsx)
   - ✅ API error classification with appropriate HTTP codes
   - ✅ Safe localStorage wrapper prevents data corruption crashes

4. **Rate Limiting**
   - ✅ Server-side rate limiting (10 requests per 60 seconds per IP)
   - ✅ Request size limits (1MB payload)
   - ✅ Timeout enforcement (30 seconds for OpenAI calls)

---

## ⚠️ CRITICAL: Authentication & Token Management

### Current Risk: Tokens Stored in localStorage (Plaintext)
**Severity**: 🔴 CRITICAL - XSS vulnerability allows token theft

**Affected Files**:
- `src/services/apiClient.js` (line 47)
- `src/middleware/interceptors.js` (line 28)

**Current Code**:
```javascript
// ❌ VULNERABLE - Tokens visible to XSS attacks
const token = localStorage.getItem('auth_token');
config.headers.Authorization = `Bearer ${token}`;
```

### Recommended Solution: Secure HTTP-Only Cookies
Replace with secure cookie approach:

**Option 1: httpOnly Cookies (RECOMMENDED)**
```javascript
// ✅ Server sets httpOnly cookie (not accessible via JavaScript)
// Automatically included in requests with credentials: 'include'
axios.defaults.withCredentials = true;

// No need to manually set Authorization header
// Server sends token via Set-Cookie header
```

**Option 2: Session Storage + CSRF Token**
```javascript
// ✅ Use sessionStorage (cleared on browser close)
import { safeGetStorage, safeSetStorage } from '@/utils/safeStorage';

const token = safeGetStorage('session_token'); // Cleared on page close
// Include CSRF token with every POST request
config.headers['X-CSRF-Token'] = csrfToken;
```

### Implementation Steps
1. **Backend Migration**: Create authentication endpoint that sets httpOnly cookies
2. **Remove localStorage Tokens**: Replace with cookie-based auth
3. **Add CSRF Protection**: Implement CSRF token mechanism
4. **Update Interceptors**: Remove manual Authorization header logic
5. **Test**: Verify XSS protection with DevTools

**Timeline**: Before production deployment

---

## 🔒 Data Protection

### 1. Sensitive Data in Logs
**Status**: ✅ Partially Fixed

**Remaining Issues**:
- User inputs may be logged with PII
- Error messages include stack traces with paths
- Analytics may collect unnecessary user behavior

**Fixes Needed**:
```javascript
// ✅ Sanitize before logging
const sanitizedData = {
  ...data,
  email: data.email ? '[EMAIL]' : undefined,
  phone: data.phone ? '[PHONE]' : undefined,
  aadhaar: data.aadhaar ? '[AADHAAR]' : undefined,
};
logger.error('User action failed', sanitizedData);
```

### 2. HTTPS Enforcement
**Status**: ⚠️ NOT IMPLEMENTED

**Required for Production**:
```javascript
// Add to server.js or Vite config
if (isProduction()) {
  app.use((req, res, next) => {
    if (!req.secure && req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}
```

### 3. Environment Variables
**Status**: ✅ Good - See DEVELOPMENT_GUIDE.md

All secrets stored in `.env.local` (not in `.env.example`)

---

## 🛡️ API Security

### 1. CORS Configuration
**Status**: ⚠️ NEEDS REVIEW

**Current**: See server.js

**Recommendations**:
```javascript
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production'
  ? ['https://your-domain.com']
  : ['http://localhost:3000', 'http://localhost:5000'];

app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 2. Request Validation
**Status**: ✅ Implemented

- ✅ Message length validation (max 4000 chars)
- ✅ Conversation history validation
- ✅ Payload size limits (1MB)
- See `server.js` for details

### 3. Rate Limiting
**Status**: ✅ Implemented

- ✅ Per-IP rate limiting (10 req/60s)
- ✅ Timeout enforcement (30s)
- ✅ Error responses with Retry-After header

---

## 🔐 Content Security Policy (CSP)

**Status**: ⚠️ NOT IMPLEMENTED

**Required**: Add CSP headers to prevent XSS attacks

```javascript
// Add to server.js or Vite middleware
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://your-api.com"
  );
  next();
});
```

---

## 📋 Security Checklist for Production

### Before Deployment
- [ ] Switch token storage from localStorage to httpOnly cookies
- [ ] Implement CSRF protection
- [ ] Add CSP headers
- [ ] Enable HTTPS enforced (redirect HTTP → HTTPS)
- [ ] Review CORS whitelist
- [ ] Sanitize all user inputs before logging
- [ ] Remove all NODE_ENV !== 'production' debug code
- [ ] Audit environment variables (no secrets in code)
- [ ] Test rate limiting with tools like Apache Bench
- [ ] Verify error messages don't expose sensitive paths

### Ongoing Monitoring
- [ ] Set up error logging to external service (Sentry, LogRocket)
- [ ] Monitor for XSS attempts (CSP violation reports)
- [ ] Track failed authentication attempts
- [ ] Monitor unusual request patterns (DDoS detection)
- [ ] Review logs regularly for anomalies

### Security Headers
```javascript
// Add all to server.js
res.setHeader('X-Content-Type-Options', 'nosniff'); // Prevent MIME type sniffing
res.setHeader('X-Frame-Options', 'DENY'); // Prevent clickjacking
res.setHeader('X-XSS-Protection', '1; mode=block'); // Legacy XSS protection
res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
```

---

## 🧪 Testing & Validation

### Automated Security Testing
```bash
# Check for vulnerable dependencies
npm audit

# OWASP security test
npm install --save-dev owasp-dependency-check
```

### Manual Security Testing
1. **XSS Testing**: Inject `<script>alert('xss')</script>` in forms
2. **CSRF Testing**: Verify tokens are required for state changes
3. **Rate Limit Testing**: Send 20+ requests rapidly
4. **Input Validation**: Try SQL injection, path traversal, etc.

### Browser Testing
- [ ] Firefox Developer Edition (Security tab)
- [ ] Chrome DevTools (Network tab for cookies)
- [ ] OWASP ZAP (automated security scanning)

---

## Third-Party Dependencies

### Current Vulnerabilities
Run: `npm audit`

### Recommendations
- Keep dependencies updated: `npm update`
- Use `npm ci` in production (not `npm install`)
- Audit new dependencies before adding
- Consider removing unused packages

---

## Compliance & Privacy

### GDPR Compliance (if serving EU users)
- [ ] Privacy Policy available
- [ ] Consent for analytics tracking
- [ ] Right to data export (from localStorage)
- [ ] Right to deletion (`localStorage.clear()`)

### India-Specific Considerations
- [ ] MEITY guidelines compliance
- [ ] No personal data retention without consent
- [ ] Aadhaar number handling (PII) - encode/hash if stored

---

## Incident Response

### Error Reporting (Recommended Setup)
```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/project",
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Sanitize PII before sending
    return sanitizeEvent(event);
  },
});
```

### How to Handle Security Issues
1. Do NOT publish security vulnerabilities publicly
2. Create private GitHub security advisory
3. Notify users of security updates
4. Deploy patches ASAP
5. Document in SECURITY.md

---

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP React Security](https://cheatsheetseries.owasp.org/cheatsheets/React_Security_Cheat_Sheet.html)
- [MDN Security Guide](https://developer.mozilla.org/en-US/docs/Web/Security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated**: April 2026  
**Status**: Ready for Implementation  
**Priority**: CRITICAL (Before Production)
