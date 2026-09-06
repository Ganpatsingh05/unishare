# Spring Boot Backend Migration - Axiom-frontend Branch

## Overview
This branch (`Axiom-frontend`) is **exclusively compatible with Spring Boot backend**. It is NOT backward compatible with the Node.js backend.

## Current Status
- ✅ Branch `Axiom-frontend` created for Spring Boot compatibility
- ✅ Spring Boot backend has authentication system implemented
- ✅ Frontend API layer updated for Spring Boot compatibility
- ✅ All endpoints now use `/api` prefix
- ✅ Response parsing updated to handle Spring Boot format
- ✅ Error handling updated for Spring Boot error format

## Backend Configuration
- **Spring Boot Backend URL**: `http://localhost:0011` (development)
- **Environment Variable**: `NEXT_PUBLIC_BACKEND_URL=http://localhost:0011`
- **API Prefix**: All endpoints use `/api` prefix (e.g., `/api/auth/login`)

## Spring Boot Response Format

### Success Response
```json
{
  "status": "success",
  "data": { 
    "user": {
      "id": "123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  "message": "Login successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Invalid credentials",
  "errors": ["Email or password is incorrect"],
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/auth/login"
}
```

## Authentication Endpoints

All authentication endpoints use the `/api` prefix:

| Feature | Spring Boot Endpoint | Method | Request Body | Response |
|---------|---------------------|--------|--------------|----------|
| Current User | `/api/auth/me` | GET | - | `{ status, data: {user}, message }` |
| Login (Email) | `/api/auth/login` | POST | `{ email, password }` | `{ status, data: {user}, message }` |
| Register | `/api/auth/register` | POST | `{ firstName, lastName, email, password, university }` | `{ status, data: {user}, message }` |
| Logout | `/api/auth/logout` | POST | - | `{ status, message }` |
| Google OAuth | `/api/auth/google` | GET | - | Redirects to Google |
| Google Callback | `/api/auth/google/callback` | GET | `?code=...` | Redirects to frontend |
| GitHub OAuth | `/api/auth/github` | GET | - | Redirects to GitHub |
| GitHub Callback | `/api/auth/github/callback` | GET | `?code=...` | Redirects to frontend |
| Forgot Password | `/api/auth/forgot-password` | POST | `{ email }` | `{ status, message }` |
| Reset Password | `/api/auth/reset-password` | POST | `{ token, password }` | `{ status, message }` |

## Session Management
- Spring Boot backend uses Spring Security with session-based authentication
- Frontend sends `credentials: 'include'` for cookie-based auth
- Session cookies are httpOnly and secure in production

## Completed Changes

### Phase 1: API Layer Updates ✅
- [x] Create migration branch `Axiom-frontend`
- [x] Update API base URL to include `/api` prefix
- [x] Update response parsing to handle Spring Boot format
- [x] Update error handling for Spring Boot error format
- [x] Update `base.js` to automatically add `/api` prefix
- [x] Update `auth.js` for Spring Boot response format
- [x] Update Google OAuth callback to use `/api` prefix

### Phase 2: Authentication Updates ✅
- [x] Update `auth.js` API calls for Spring Boot endpoints
- [x] Update Google OAuth flow with Spring Boot
- [x] Update email/password login and registration
- [x] Update password reset flow
- [x] Session management compatible with Spring Boot
- [ ] **Testing required**: Verify all auth flows work with Spring Boot backend

### Phase 3: Other API Endpoints (Future)
- [ ] Update marketplace/buy-sell endpoints
- [ ] Update housing/rooms endpoints
- [ ] Update rideshare endpoints
- [ ] Update contacts endpoints
- [ ] Update resources endpoints
- [ ] Update admin panel endpoints

### Phase 4: Testing & Validation
- [ ] Test all authentication flows
- [ ] Test API error handling
- [ ] Test session persistence
- [ ] Test CORS configuration
- [ ] Performance testing

### Phase 5: Deployment
- [ ] Update production environment variables
- [ ] Deploy Spring Boot backend
- [ ] Deploy updated frontend
- [ ] Monitor logs and errors

## Files Updated for Spring Boot Compatibility

### Core API Files ✅
- ✅ `src/app/lib/api/base.js` - Spring Boot response format, automatic `/api` prefix, error handling
- ✅ `src/app/lib/api/auth.js` - Updated auth endpoints and response parsing
- ⏳ `src/app/lib/api/marketplace.js` - Future update (when marketplace API is ready)
- ⏳ `src/app/lib/api/rooms.js` - Future update (when housing API is ready)
- ⏳ `src/app/lib/api/rideshare.js` - Future update (when rideshare API is ready)

### Configuration Files ✅
- ✅ `.env` - Updated to `http://localhost:0011`
- `.env.local` - (create for production with production Spring Boot URL)

### Authentication Pages ✅
- ✅ `src/app/auth/google/callback/page.jsx` - Updated callback URL with `/api` prefix
- Other auth pages work automatically through `auth.js` API functions

## Important Notes

### API Prefix Handling
The `base.js` file automatically adds `/api` prefix to all endpoints, so you can call:
```javascript
apiCall('/auth/login', { method: 'POST', body: ... })
```
And it will automatically become: `http://localhost:0011/api/auth/login`

### Response Format
All Spring Boot responses follow this format:
- Success: `{ status: 'success', data: {...}, message: '...' }`
- Error: `{ status: 'error', message: '...', errors: [...], timestamp: '...' }`

The API layer handles this format and returns data directly to calling functions.

## Testing Checklist

### Authentication Tests
- [ ] Google OAuth login
- [ ] Email/password login
- [ ] Email/password registration
- [ ] Password reset request
- [ ] Password reset confirmation
- [ ] Session persistence on page refresh
- [ ] Logout functionality
- [ ] Protected route access

### API Tests
- [ ] Successful API calls return correct data
- [ ] Failed API calls show appropriate errors
- [ ] Network errors are handled gracefully
- [ ] Timeout errors are handled
- [ ] Retry logic works correctly
- [ ] Cache invalidation works

## Notes
- ⚠️ **This branch is ONLY compatible with Spring Boot backend**
- The Spring Boot backend MUST be running on port 8080 (or update `.env` accordingly)
- The Spring Boot backend MUST use `/api` prefix for all endpoints
- Spring Boot backend MUST return responses in format: `{ status, data, message, timestamp }`
- CORS configuration must allow credentials from frontend domain
- Make sure Spring Boot backend is running before testing frontend

## Rollback Plan
If you need to use Node.js backend:
1. Switch back to `main` branch: `git checkout main`
2. The `main` branch still uses Node.js backend format
3. Do NOT merge `Axiom-frontend` into `main` until Spring Boot backend is fully ready

## Contact
For backend API questions, contact the Spring Boot backend team.
