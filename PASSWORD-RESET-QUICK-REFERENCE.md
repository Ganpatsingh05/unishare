# Password Reset - Quick Reference Card

## 🚀 Quick Start

### Frontend URLs
```
Forgot Password:  /forgot-password
Reset Password:   /reset-password?token=XXXXX
Login:            /login
```

### Backend Endpoints
```
Request Reset:    POST /api/user-management/password-update
Confirm Reset:    POST /api/user-management/password-update/confirm
```

---

## 📝 API Usage

### JavaScript/React

```javascript
import { requestPasswordReset, resetPassword } from '@/app/lib/api';

// Request reset
const result = await requestPasswordReset('user@uni.edu');
if (result.success) {
  console.log(result.message);
}

// Reset with token
const result = await resetPassword('token123', 'NewPassword123');
if (result.success) {
  // Redirect to login
}
```

### cURL

```bash
# Request reset
curl -X POST http://localhost:7500/api/user-management/password-update \
  -H "Content-Type: application/json" \
  -d '{"email":"user@uni.edu"}'

# Confirm reset
curl -X POST http://localhost:7500/api/user-management/password-update/confirm \
  -H "Content-Type: application/json" \
  -d '{"token":"xyz123","newPassword":"NewPass123"}'
```

---

## 🔧 Backend Configuration Checklist

### application.properties
```properties
# Email Service
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password

# Frontend URL
app.frontend.url=http://localhost:3000
```

### Database
```sql
-- Table should already exist
SELECT * FROM password_reset_tokens;
```

---

## 🧪 Testing Commands

### 1. Request Password Reset
```bash
curl -X POST http://localhost:7500/api/user-management/password-update \
  -H "Content-Type: application/json" \
  -d '{"email":"test@uni.edu"}'
```

**Expected Response:**
```json
{
  "message": "If an account exists for this email, a password reset link has been sent."
}
```

### 2. Check Email & Get Token
Look in email inbox for reset link with token parameter

### 3. Reset Password
```bash
curl -X POST http://localhost:7500/api/user-management/password-update/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token":"YOUR_TOKEN_FROM_EMAIL",
    "newPassword":"NewPassword123"
  }'
```

**Expected Response:**
```json
{
  "message": "Password has been updated successfully."
}
```

### 4. Verify New Password Works
```bash
curl -X POST http://localhost:7500/api/auth/unishare/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@uni.edu",
    "password":"NewPassword123"
  }'
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Email not received | Check spam folder, verify SMTP config |
| "Invalid token" error | Token expired (>5 mins) or already used |
| "Scripts disabled" error | Run: `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` |
| OAuth user tries reset | Expected - OAuth users don't have passwords |
| Password too short | Must be 8+ characters |

---

## 📊 Database Queries

### Check Token Status
```sql
SELECT 
    id,
    user_id,
    used,
    expires_at,
    created_at,
    CASE 
        WHEN expires_at < NOW() THEN 'EXPIRED'
        WHEN used = true THEN 'USED'
        ELSE 'VALID'
    END as status
FROM password_reset_tokens
ORDER BY created_at DESC
LIMIT 10;
```

### Find User's Recent Tokens
```sql
SELECT *
FROM password_reset_tokens
WHERE user_id = (
    SELECT id FROM users WHERE email = 'test@uni.edu'
)
ORDER BY created_at DESC;
```

### Clean Up Expired Tokens
```sql
DELETE FROM password_reset_tokens
WHERE expires_at < NOW() - INTERVAL '1 hour';
```

---

## 🔐 Security Rules

| Rule | Implementation |
|------|----------------|
| Token expiration | 5 minutes |
| Token usage | Single use only |
| Token storage | SHA-256 hash only |
| Email enumeration | Same response for all requests |
| Password length | Min 8 characters |
| HTTPS required | Production only |

---

## 📁 File Locations

### Frontend
```
src/app/(auth)/forgot-password/page.jsx
src/app/(auth)/reset-password/page.jsx
src/app/(auth)/login/page.jsx
src/app/lib/api/services/auth/auth.service.js
src/app/lib/api/services/auth/index.js
src/app/lib/api.js
```

### Backend
```
controller/password/UserPasswordController.java
service/usermanagement/PasswordResetService.java
entity/auth/PasswordResetToken.java
repository/password/PasswordResetTokenRepository.java
dto/request/password/PasswordResetRequest.java
dto/request/password/PasswordUpdateRequest.java
dto/response/password/PasswordResetResponse.java
```

---

## 🎯 Testing Checklist

- [ ] Request reset with valid email
- [ ] Request reset with invalid email (should not reveal)
- [ ] Request reset for OAuth user
- [ ] Click email link with valid token
- [ ] Reset password successfully
- [ ] Login with new password
- [ ] Try to reuse token (should fail)
- [ ] Wait 5 minutes and try expired token (should fail)
- [ ] Test password validation (< 8 chars)
- [ ] Test password mismatch

---

## 📞 Support Commands

### Check Backend Logs
```bash
# Spring Boot logs
tail -f logs/application.log | grep -i password

# Check email service
tail -f logs/application.log | grep -i "mail\|email"
```

### Check Token in Database
```sql
-- Get token hash for debugging
SELECT 
    encode(digest('YOUR_RAW_TOKEN', 'sha256'), 'hex') as token_hash;

-- Check if hash exists
SELECT * FROM password_reset_tokens 
WHERE token_hash = 'YOUR_HASH_HERE';
```

### Test SMTP Connection
```bash
# Test connection
telnet smtp.gmail.com 587

# Or use openssl
openssl s_client -starttls smtp -connect smtp.gmail.com:587
```

---

## 🔄 User Flow Summary

```
1. User → Forgot Password Page
2. Enter Email → Backend
3. Backend → Generate Token → Send Email
4. User → Click Email Link
5. User → Reset Password Page (with token)
6. Enter New Password → Backend
7. Backend → Validate Token → Update Password
8. User → Redirected to Login
9. Login with New Password → Success!
```

---

## ⚡ Quick Troubleshooting

### Email Service Not Working
```bash
# Check environment variables
echo $SMTP_USERNAME
echo $SMTP_HOST

# Test with mail command
echo "Test" | mail -s "Test Subject" test@example.com
```

### Frontend Not Connecting
```bash
# Check environment variable
echo $NEXT_PUBLIC_BACKEND_URL

# Should output: http://localhost:7500 (dev) or production URL
```

### Token Not Validating
```sql
-- Check if token exists and is valid
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN 'Token not found'
        WHEN MAX(used) = true THEN 'Token already used'
        WHEN MAX(expires_at) < NOW() THEN 'Token expired'
        ELSE 'Token valid'
    END as token_status
FROM password_reset_tokens
WHERE token_hash = 'YOUR_HASH';
```

---

## 📚 Documentation Files

- `PASSWORD-RESET-SUMMARY.md` - Overview and implementation details
- `PASSWORD-RESET-IMPLEMENTATION.md` - Technical documentation
- `PASSWORD-RESET-FLOW.md` - Flow diagrams and sequences
- `EMAIL-TEMPLATE-REFERENCE.md` - Email configuration and templates
- `PASSWORD-RESET-QUICK-REFERENCE.md` - This file

---

## 🎓 Key Concepts

**Token Lifecycle:**
```
Generate → Hash → Store → Email → User Clicks → Validate → Use → Mark Used
```

**Security Layers:**
```
1. Token hashing (SHA-256)
2. Short expiration (5 min)
3. Single use
4. HTTPS transmission
5. No email enumeration
```

**Error Handling:**
```
Frontend Validation → Backend Validation → Database Check → Success/Error
```

---

## ✅ Production Deployment

### Pre-deployment
- [ ] Email service configured and tested
- [ ] Environment variables set
- [ ] DNS records configured (SPF, DKIM)
- [ ] HTTPS enabled
- [ ] Rate limiting implemented

### Post-deployment
- [ ] Test complete flow in production
- [ ] Monitor email delivery rates
- [ ] Check error logs
- [ ] Set up alerts for failures
- [ ] Document any issues

---

## 📞 Need Help?

1. Check logs: Backend and frontend console
2. Verify configuration: SMTP, environment variables
3. Test endpoints: Use cURL or Postman
4. Check database: Verify token creation
5. Review documentation: PASSWORD-RESET-IMPLEMENTATION.md

---

**Last Updated:** October 2, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
