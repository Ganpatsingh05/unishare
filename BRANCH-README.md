# Axiom-frontend Branch - Spring Boot Backend

⚠️ **IMPORTANT**: This branch is **ONLY** compatible with Spring Boot backend. It will NOT work with the Node.js backend.

## Quick Start

### Prerequisites
1. Spring Boot backend must be running on `http://localhost:8080`
2. Spring Boot backend must have authentication system implemented
3. Spring Boot backend must use `/api` prefix for all endpoints

### Setup
```bash
# Install dependencies
npm install

# Make sure .env has Spring Boot backend URL
# .env should contain:
# NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Run development server
npm run dev
```

### Backend Requirements

Your Spring Boot backend MUST:
- Use `/api` prefix for all endpoints (e.g., `/api/auth/login`)
- Return responses in this format:
  ```json
  {
    "status": "success",
    "data": { ... },
    "message": "...",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```
- Support CORS with credentials from frontend domain
- Implement these authentication endpoints:
  - `GET /api/auth/me` - Get current user
  - `POST /api/auth/login` - Email/password login
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/logout` - Logout
  - `GET /api/auth/google` - Start Google OAuth flow
  - `GET /api/auth/google/callback` - Google OAuth callback
  - `POST /api/auth/forgot-password` - Request password reset
  - `POST /api/auth/reset-password` - Reset password

## What Changed from Main Branch

### API Layer (`src/app/lib/api/`)
- **base.js**: Automatically adds `/api` prefix to all endpoints
- **base.js**: Parses Spring Boot response format (`status`, `data`, `message`)
- **base.js**: Handles Spring Boot error format with `errors` array
- **auth.js**: Updated to work with Spring Boot response format
- **auth.js**: All functions now expect `{ status, data, message }` format

### Authentication
- Google OAuth callback now uses `/api/auth/google/callback`
- All auth endpoints automatically prefixed with `/api`
- Response parsing updated for Spring Boot format

### Environment
- `.env` configured for `http://localhost:8080`

## Testing Authentication

### 1. Test Current User Check
```javascript
import { fetchCurrentUser } from '@/app/lib/api/auth';

const user = await fetchCurrentUser();
console.log(user); // Should be null if not logged in, or user object if logged in
```

### 2. Test Login
```javascript
import { loginWithEmail } from '@/app/lib/api/auth';

const result = await loginWithEmail('test@example.com', 'password123');
console.log(result); // { success: true, user: {...}, message: '...' }
```

### 3. Test Google OAuth
```javascript
import { startGoogleLogin } from '@/app/lib/api/auth';

// This will redirect to: http://localhost:8080/api/auth/google
startGoogleLogin();
```

## Migration Documentation

See `docs/SPRING-BOOT-MIGRATION.md` for complete migration details.

## Troubleshooting

### Backend URL Not Configured
**Error**: `Backend not available`
**Solution**: Make sure `.env` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080`

### CORS Error
**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
**Solution**: Configure Spring Boot backend to allow frontend origin with credentials:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Invalid Response Format
**Error**: API calls fail with parsing errors
**Solution**: Ensure Spring Boot returns:
```json
{
  "status": "success",
  "data": { "user": {...} },
  "message": "Login successful"
}
```

### Authentication Not Persisting
**Error**: User logged in but session lost on refresh
**Solution**: 
- Verify Spring Boot session configuration
- Ensure cookies are httpOnly and sent with requests
- Check that `credentials: 'include'` is working

## Branch Status

- ✅ API layer updated for Spring Boot
- ✅ Authentication endpoints updated
- ✅ Google OAuth flow updated
- ✅ Error handling updated
- ⏳ Other API endpoints (marketplace, housing, rideshare) - pending Spring Boot backend implementation
- ⏳ Testing with live Spring Boot backend

## Next Steps

1. Start Spring Boot backend on port 8080
2. Test authentication flows (login, register, Google OAuth)
3. Verify session management works
4. Once other Spring Boot endpoints are ready, update respective API files
5. Update admin panel to work with Spring Boot backend

## Do NOT Merge to Main

This branch should remain separate until:
- Spring Boot backend is fully implemented
- All features are tested and working
- Production deployment is ready
- Team agrees to fully migrate from Node.js backend
