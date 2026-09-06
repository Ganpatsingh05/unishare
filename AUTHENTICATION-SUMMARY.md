# UniShare Authentication System - Spring Boot Integration

## ✅ Completed Setup

The **Axiom-frontend** branch is now fully configured with a **three-way authentication system** compatible with your Spring Boot backend running on **port 0011**.

---

## 🔐 Three Authentication Methods

### 1. **Google OAuth** ✅
- **Frontend Route**: `/api/auth/google`
- **Callback Route**: `/auth/google/callback`
- **Backend Endpoint**: `http://localhost:0011/api/auth/google`
- **Callback Endpoint**: `http://localhost:0011/api/auth/google/callback`

### 2. **GitHub OAuth** ✅
- **Frontend Route**: `/api/auth/github`
- **Callback Route**: `/auth/github/callback`
- **Backend Endpoint**: `http://localhost:0011/api/auth/github`
- **Callback Endpoint**: `http://localhost:0011/api/auth/github/callback`

### 3. **UniShare Email/Password** ✅
- **Login Endpoint**: `http://localhost:0011/api/auth/login`
- **Register Endpoint**: `http://localhost:0011/api/auth/register`
- **Forgot Password**: `http://localhost:0011/api/auth/forgot-password`
- **Reset Password**: `http://localhost:0011/api/auth/reset-password`

---

## 📋 Backend Requirements

### Port Configuration
```properties
# application.properties
server.port=0011
```

### Required Endpoints

All endpoints use `/api` prefix:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/auth/me` | Get current authenticated user |
| `POST` | `/api/auth/login` | Email/password login |
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/logout` | Logout user |
| `GET` | `/api/auth/google` | Start Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Handle Google OAuth callback |
| `GET` | `/api/auth/github` | Start GitHub OAuth flow |
| `GET` | `/api/auth/github/callback` | Handle GitHub OAuth callback |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "university": "Example University"
  },
  "message": "Operation successful",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error 1", "Detailed error 2"],
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/auth/login"
}
```

### CORS Configuration

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
                    .allowCredentials(true)
                    .allowedHeaders("*");
            }
        };
    }
}
```

### OAuth Configuration

```properties
# Google OAuth
google.client.id=your-google-client-id
google.client.secret=your-google-client-secret
google.redirect.uri=http://localhost:0011/api/auth/google/callback

# GitHub OAuth
github.client.id=your-github-client-id
github.client.secret=your-github-client-secret
github.redirect.uri=http://localhost:0011/api/auth/github/callback

# Frontend
frontend.url=http://localhost:3000
```

---

## 🚀 Testing the Setup

### 1. Start Backend
```bash
# In your Spring Boot backend directory
./mvnw spring-boot:run
# Should start on http://localhost:0011
```

### 2. Verify Backend is Running
```bash
curl http://localhost:0011/api/auth/me
# Should return JSON response (not 404)
```

### 3. Start Frontend
```bash
# In unishare-frontend directory
npm run dev
# Should start on http://localhost:3000
```

### 4. Test Login Page
Visit `http://localhost:3000/login` and you should see:
- ✅ **Continue with Google** button
- ✅ **Continue with GitHub** button
- ✅ Email/password login form

---

## 📁 Frontend Files Modified

### API Layer
- ✅ `src/app/lib/api/base.js` - Spring Boot API layer with automatic `/api` prefix
- ✅ `src/app/lib/api/auth.js` - Authentication functions with Spring Boot responses
- ✅ `src/app/lib/api.js` - Main API exports including `startGithubLogin`

### Login Pages
- ✅ `src/app/(auth)/login/page.jsx` - Desktop login with all 3 auth methods
- ✅ `src/app/(auth)/login/MobileLoginPage.jsx` - Mobile login with all 3 auth methods

### OAuth Callbacks
- ✅ `src/app/auth/google/callback/page.jsx` - Google OAuth callback handler
- ✅ `src/app/auth/github/callback/page.jsx` - GitHub OAuth callback handler

### Configuration
- ✅ `.env` - Backend URL set to `http://localhost:0011`

---

## 🔧 Frontend Environment Setup

**User must create `.env.local` (gitignored) with:**
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:0011
```

Or use the existing `.env` file (not recommended for production):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:0011
```

---

## 📖 Documentation Files

- **`SETUP-GUIDE.md`** - Complete setup instructions
- **`BRANCH-README.md`** - Quick reference for this branch
- **`docs/SPRING-BOOT-MIGRATION.md`** - Migration details
- **`docs/SPRING-BOOT-BACKEND-REQUIREMENTS.md`** - Backend implementation guide with code examples

---

## ⚠️ Important Notes

1. **Port Number**: Backend MUST run on port **0011** (not 8080)
2. **API Prefix**: All backend endpoints MUST use `/api` prefix
3. **Response Format**: Backend MUST return `{ status, data, message, timestamp }`
4. **CORS**: Backend MUST allow `http://localhost:3000` with credentials
5. **Session/Cookies**: Backend MUST support session-based or JWT authentication
6. **OAuth Redirects**: After successful OAuth, backend MUST redirect to `http://localhost:3000/`

---

## 🐛 Troubleshooting

### Frontend Shows "Backend not available"
- ✅ Check `.env` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:0011`
- ✅ Verify Spring Boot backend is running on port 0011
- ✅ Restart Next.js dev server after changing `.env`

### CORS Errors
- ✅ Configure CORS in Spring Boot to allow `http://localhost:3000`
- ✅ Ensure `allowCredentials(true)` is set

### OAuth Not Working
- ✅ Check Google/GitHub OAuth credentials are configured
- ✅ Verify redirect URIs match: `http://localhost:0011/api/auth/{google|github}/callback`
- ✅ Ensure backend redirects to frontend after successful OAuth

### Login Works but Session Lost on Refresh
- ✅ Verify backend session configuration
- ✅ Check cookies are httpOnly and sent with requests
- ✅ Ensure `credentials: 'include'` is working (already configured in frontend)

---

## ✨ Features Implemented

- ✅ Three-way authentication (Google, GitHub, Email/Password)
- ✅ Automatic `/api` prefix for all backend calls
- ✅ Spring Boot response format parsing
- ✅ Error handling with Spring Boot error format
- ✅ Session management compatible with Spring Boot
- ✅ Mobile and desktop responsive login pages
- ✅ OAuth callback handlers for Google and GitHub
- ✅ Password strength validator
- ✅ Email validation
- ✅ Remember me functionality
- ✅ Forgot/reset password flow

---

## 📞 Next Steps

1. **Backend Team**: Implement all authentication endpoints listed above
2. **OAuth Setup**: Configure Google and GitHub OAuth apps with correct redirect URIs
3. **Testing**: Test all three authentication methods
4. **Production**: Update `.env` with production backend URL when deploying

---

## 🎯 Success Criteria

- [ ] Backend running on port 0011
- [ ] All authentication endpoints implemented
- [ ] CORS configured properly
- [ ] Google OAuth working
- [ ] GitHub OAuth working
- [ ] Email/password login working
- [ ] Email/password registration working
- [ ] Session persistence working
- [ ] Logout working

---

**Last Updated**: After implementing three-way authentication with port 0011

**Branch**: `Axiom-frontend`

**Backend Port**: `0011`

**Frontend Port**: `3000`
