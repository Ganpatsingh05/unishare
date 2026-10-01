# Password Reset Flow Diagram

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────┐
│                    PASSWORD RESET FLOW                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐
│  Login Page  │ 
│  /login      │
└──────┬───────┘
       │
       │ User clicks "Forgot password?"
       ▼
┌──────────────────────┐
│  Forgot Password     │
│  /forgot-password    │
│                      │
│  [Enter Email]       │
│  [Send Reset Link]   │
└──────┬───────────────┘
       │
       │ POST /api/user-management/password-update
       │ { "email": "user@university.edu" }
       ▼
┌────────────────────────────────────────────────┐
│         BACKEND (Spring Boot)                  │
│  ┌──────────────────────────────────────────┐ │
│  │  UserPasswordController                   │ │
│  │  ↓                                        │ │
│  │  PasswordResetService                     │ │
│  │  ├─ Generate secure token (32 bytes)     │ │
│  │  ├─ Hash token (SHA-256)                 │ │
│  │  ├─ Store in database                    │ │
│  │  │  - token_hash                         │ │
│  │  │  - user_id                            │ │
│  │  │  - expires_at (now + 5 mins)          │ │
│  │  │  - used = false                       │ │
│  │  └─ Send email with raw token            │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
       │
       │ Email sent via MailService
       ▼
┌──────────────────────────────────────────┐
│          USER EMAIL INBOX                │
│                                          │
│  Subject: Password Reset Request         │
│                                          │
│  Click link to reset your password:      │
│  https://frontend.com/reset-password?    │
│  token=XXXXXXXXXXXXXXXXXXXXX             │
│                                          │
│  Link expires in 5 minutes.              │
└──────┬───────────────────────────────────┘
       │
       │ User clicks link
       ▼
┌──────────────────────────────────┐
│  Reset Password Page             │
│  /reset-password?token=XXXXX     │
│                                  │
│  Token: (auto-extracted from URL)│
│  [New Password]                  │
│  [Confirm Password]              │
│  [Reset Password Button]         │
└──────┬───────────────────────────┘
       │
       │ User enters new password
       │ Validation:
       │  ✓ Min 8 characters
       │  ✓ Passwords match
       │
       │ POST /api/user-management/password-update/confirm
       │ { 
       │   "token": "XXXXX",
       │   "newPassword": "NewPass123"
       │ }
       ▼
┌────────────────────────────────────────────────┐
│         BACKEND (Spring Boot)                  │
│  ┌──────────────────────────────────────────┐ │
│  │  UserPasswordController                   │ │
│  │  ↓                                        │ │
│  │  PasswordResetService.resetPassword()    │ │
│  │  ├─ Hash received token                  │ │
│  │  ├─ Find token in database               │ │
│  │  ├─ Validate:                            │ │
│  │  │   ✓ Token exists                      │ │
│  │  │   ✓ Not expired (< 5 mins)            │ │
│  │  │   ✓ Not already used                  │ │
│  │  ├─ Encode new password (BCrypt)         │ │
│  │  ├─ Update user.password                 │ │
│  │  └─ Mark token as used                   │ │
│  └──────────────────────────────────────────┘ │
└────────────────────────────────────────────────┘
       │
       │ Success response
       ▼
┌──────────────────────────────────┐
│  Reset Password Page             │
│                                  │
│  ✅ Success!                     │
│  "Password has been updated      │
│   successfully."                 │
│                                  │
│  Redirecting to login...         │
└──────┬───────────────────────────┘
       │
       │ Auto-redirect after 2 seconds
       ▼
┌──────────────────────────────────┐
│  Login Page                      │
│  /login                          │
│                                  │
│  User can now login with         │
│  new password                    │
└──────────────────────────────────┘
```

---

## Error Scenarios

### 1. Invalid/Expired Token
```
┌──────────────────────────────────┐
│  Reset Password Page             │
│  /reset-password?token=XXXXX     │
└──────┬───────────────────────────┘
       │
       │ Token validation fails:
       │  - Token expired (> 5 mins)
       │  - Token already used
       │  - Invalid token format
       ▼
┌──────────────────────────────────┐
│  ❌ Error Message                │
│                                  │
│  "Failed to reset password.      │
│   The link may be invalid or     │
│   expired."                      │
│                                  │
│  [Back to Login]                 │
└──────────────────────────────────┘
```

### 2. Password Validation Fails
```
┌──────────────────────────────────┐
│  Reset Password Page             │
│                                  │
│  New Password: "123"             │
│  Confirm: "123"                  │
│  [Reset Password]                │
└──────┬───────────────────────────┘
       │
       │ Frontend validation
       ▼
┌──────────────────────────────────┐
│  ❌ Error Message                │
│                                  │
│  "Password must be at least      │
│   8 characters long"             │
└──────────────────────────────────┘
```

### 3. OAuth User Attempts Reset
```
┌──────────────────────────────────┐
│  Forgot Password Page            │
│  Email: "oauth@gmail.com"        │
│  (Google OAuth user)             │
└──────┬───────────────────────────┘
       │
       │ Backend checks auth provider
       ▼
┌──────────────────────────────────┐
│  Backend Response                │
│                                  │
│  "Password reset not available   │
│   for GOOGLE accounts"           │
└──────────────────────────────────┘
```

---

## Database Schema

### PasswordResetToken Table
```sql
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash
    user_id BIGINT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index for fast lookups
CREATE INDEX idx_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX idx_user_id ON password_reset_tokens(user_id);
```

### Example Data
```
id: 550e8400-e29b-41d4-a716-446655440000
token_hash: a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4
user_id: 123
expires_at: 2024-10-02 15:30:00
used: false
created_at: 2024-10-02 15:25:00
```

---

## Security Considerations

### ✅ Secure Practices
1. **Token Hashing**: Only hash stored, never raw token
2. **Short Expiration**: 5 minutes reduces attack window
3. **Single Use**: Token invalidated after use
4. **No Email Enumeration**: Same response for all requests
5. **HTTPS Required**: Secure token transmission

### ⚠️ Potential Risks (Mitigated)
1. **Token Theft**: Mitigated by short expiration
2. **Brute Force**: Mitigated by token complexity (32 bytes = 256 bits)
3. **Email Interception**: Mitigated by HTTPS and email security
4. **Multiple Requests**: Old tokens invalidated on new request

---

## API Request/Response Examples

### Request Reset
```bash
POST /api/user-management/password-update
Content-Type: application/json

{
  "email": "student@university.edu"
}

Response:
{
  "message": "If an account exists for this email, a password reset link has been sent."
}
```

### Confirm Reset
```bash
POST /api/user-management/password-update/confirm
Content-Type: application/json

{
  "token": "xYz123AbC456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890",
  "newPassword": "MyNewSecurePassword123!"
}

Response (Success):
{
  "message": "Password has been updated successfully."
}

Response (Error):
{
  "message": "Invalid or expired password reset token"
}
```

---

## Frontend Component Structure

```
src/app/(auth)/
├── forgot-password/
│   └── page.jsx          # Email input form
├── reset-password/
│   └── page.jsx          # New password form (with token)
└── login/
    └── page.jsx          # Updated with "Forgot password?" link

src/app/lib/api/
├── services/
│   └── auth/
│       ├── auth.service.js   # Password reset functions
│       └── index.js          # Exports
└── api.js                    # Main API exports
```

---

## Testing Matrix

| Test Case | Input | Expected Result |
|-----------|-------|----------------|
| Valid email (UniShare) | user@uni.edu | Success message + email sent |
| Non-existent email | fake@uni.edu | Same success message (security) |
| OAuth email | google@gmail.com | Error or same message |
| Valid token | Fresh token | Password reset successful |
| Expired token | Token > 5 mins old | Error: expired |
| Used token | Already used token | Error: invalid |
| Invalid token | Random string | Error: invalid |
| Short password | "123" | Error: min 8 chars |
| Mismatch passwords | "pass1" ≠ "pass2" | Error: don't match |

---

## Monitoring & Logging

### Backend Logs to Check
```
- Token generation events
- Email sending success/failure
- Token validation attempts
- Password update events
- Failed token attempts (potential attacks)
```

### Frontend Analytics
```
- Forgot password page visits
- Reset password page visits
- Success rate
- Error types distribution
```
