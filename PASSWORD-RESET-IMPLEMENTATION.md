# Password Reset Implementation

## Overview
Password reset functionality has been implemented for UniShare users (email/password authentication only, not OAuth users). The system uses a token-based approach with email delivery.

## Backend Implementation (Spring Boot)

### Endpoints
1. **Request Password Reset**
   - **Endpoint**: `POST /api/user-management/password-update`
   - **Request Body**: 
     ```json
     {
       "email": "user@university.edu"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "If an account exists for this email, a password reset link has been sent."
     }
     ```
   - **Notes**: Returns same message regardless of whether email exists (security best practice)

2. **Confirm Password Reset**
   - **Endpoint**: `POST /api/user-management/password-update/confirm`
   - **Request Body**:
     ```json
     {
       "token": "secure-token-from-email",
       "newPassword": "NewPassword123!"
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Password has been updated successfully."
     }
     ```
   - **Notes**: Token is single-use and expires after 5 minutes

### Backend Files
- **Controller**: `UserPasswordController.java`
- **Service**: `PasswordResetService.java`
- **Entity**: `PasswordResetToken.java`
- **Repository**: `PasswordResetTokenRepository.java`
- **DTOs**: 
  - `PasswordResetRequest.java` (contains email)
  - `PasswordUpdateRequest.java` (contains token + newPassword)
  - `PasswordResetResponse.java` (contains message)

### Security Features
- Token is hashed (SHA-256) before storage
- Raw token only sent via email
- Token expires after 5 minutes
- Single-use tokens (marked as used after password reset)
- Previous tokens invalidated when new reset requested
- Email existence not revealed (same response for all requests)

## Frontend Implementation (Next.js)

### API Functions
Located in `src/app/lib/api/services/auth/auth.service.js`:

1. **requestPasswordReset(email)**
   - Sends password reset request
   - Returns: `{ success: boolean, message: string }`

2. **resetPassword(token, newPassword)**
   - Resets password using token from email
   - Returns: `{ success: boolean, message: string }`

### Pages

1. **Forgot Password Page** (`/forgot-password`)
   - User enters email address
   - Receives confirmation message
   - Link to return to login
   - File: `src/app/(auth)/forgot-password/page.jsx`

2. **Reset Password Page** (`/reset-password?token=xxx`)
   - Accessed via email link
   - User enters new password and confirmation
   - Validates password match and minimum length (8 characters)
   - Redirects to login after successful reset
   - File: `src/app/(auth)/reset-password/page.jsx`

### Login Page Integration
- Added "Forgot password?" link in login form
- Link points to `/forgot-password`

## User Flow

1. **User Initiates Reset**
   - Clicks "Forgot password?" on login page
   - Lands on `/forgot-password`
   - Enters email address
   - Sees confirmation message

2. **Email Sent**
   - Backend sends email with reset link (via MailService)
   - Link format: `https://yourfrontend.com/reset-password?token=XXXXX`
   - Token expires in 5 minutes

3. **User Resets Password**
   - Clicks link in email
   - Lands on `/reset-password?token=XXXXX`
   - Enters new password (min 8 characters)
   - Confirms password
   - Submits form

4. **Password Updated**
   - Backend validates token
   - Updates password
   - Marks token as used
   - Returns success message
   - User redirected to login page

## Password Requirements
- Minimum 8 characters (enforced in backend DTO validation)
- Frontend validates minimum length before submission

## Error Handling
- Invalid/expired token: "Failed to reset password. The link may be invalid or expired."
- Password too short: "Password must be at least 8 characters long"
- Passwords don't match: "Passwords do not match"
- Network errors: Appropriate error messages displayed to user

## Testing Checklist
- [ ] Request reset for existing UniShare user
- [ ] Request reset for non-existent email (should show same message)
- [ ] Request reset for OAuth user (should handle gracefully)
- [ ] Verify email is sent with correct token
- [ ] Reset password with valid token
- [ ] Try to reuse same token (should fail)
- [ ] Try expired token (after 5 minutes)
- [ ] Try invalid token format
- [ ] Password validation (minimum 8 characters)
- [ ] Password mismatch validation
- [ ] Successful password reset and login with new password

## Future Enhancements
- Email templates with branded design
- Rate limiting on reset requests
- Password strength requirements (uppercase, lowercase, numbers, symbols)
- Account lockout after multiple failed attempts
- Security questions as backup option
- SMS/2FA for additional security

## Notes
- OAuth users (Google, GitHub) cannot use password reset (they don't have passwords in UniShare)
- Backend validates that user is a UniShare user before processing reset
- Token security: Only hash stored in database, raw token only in email
- Email service must be properly configured in backend for production use
