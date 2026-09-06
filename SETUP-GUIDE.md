# Setup Guide for Axiom-frontend Branch

## ✅ What's Been Done

The `Axiom-frontend` branch has been created and configured to work **exclusively** with your Spring Boot backend. Here's what was updated:

### 1. **API Layer Completely Rewritten** ✅
- **`src/app/lib/api/base.js`**: 
  - Automatically adds `/api` prefix to all endpoints
  - Parses Spring Boot response format: `{ status, data, message, timestamp }`
  - Handles Spring Boot error format with `errors` array
  - All API calls now compatible with Spring Boot

- **`src/app/lib/api/auth.js`**:
  - Updated all authentication functions for Spring Boot responses
  - `fetchCurrentUser()` - expects `{ status, data: {user} }`
  - `loginWithEmail()` - handles Spring Boot login response
  - `registerWithEmail()` - handles Spring Boot registration response
  - `logout()` - calls `/api/auth/logout`
  - `startGoogleLogin()` - redirects to `/api/auth/google`
  - All functions return consistent format

### 2. **Google OAuth Updated** ✅
- **`src/app/auth/google/callback/page.jsx`**: 
  - Now redirects to `/api/auth/google/callback` instead of `/auth/google/callback`
  - Compatible with Spring Boot OAuth flow

### 3. **Environment Configuration** ✅
- **`.env`**: Set to `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080`

### 4. **Documentation Created** ✅
- **`BRANCH-README.md`**: Quick start guide for this branch
- **`docs/SPRING-BOOT-MIGRATION.md`**: Complete migration details
- **`docs/SPRING-BOOT-BACKEND-REQUIREMENTS.md`**: Detailed backend requirements with code examples

---

## 🚀 Quick Start

### Step 1: Make Sure Spring Boot Backend is Running
```bash
# In your Spring Boot backend directory (unishareBackend)
./mvnw spring-boot:run

# OR if using Gradle
./gradlew bootRun
```

Backend should be running on: `http://localhost:8080`

### Step 2: Install Frontend Dependencies
```bash
# In frontend directory (unishare-frontend)
npm install
```

### Step 3: Verify Environment Configuration
Check that `.env` contains:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
```

### Step 4: Run Frontend
```bash
npm run dev
```

Frontend will run on: `http://localhost:3000`

---

## 🔍 Testing Authentication

### Test 1: Check Current User
Open browser console and try:
```javascript
const response = await fetch('http://localhost:8080/api/auth/me', {
  credentials: 'include'
});
const data = await response.json();
console.log(data);
```

Expected response:
```json
{
  "status": "success",
  "data": null,
  "message": "No user authenticated"
}
```

### Test 2: Test Login Page
1. Go to `http://localhost:3000/login`
2. Try to login with Google OAuth or email/password
3. Check browser console for any errors

### Test 3: Verify API Prefix
All API calls should go to URLs starting with `/api`:
- ✅ `http://localhost:8080/api/auth/me`
- ✅ `http://localhost:8080/api/auth/login`
- ❌ NOT `http://localhost:8080/auth/me` (old Node.js format)

---

## 📋 Backend Checklist

Your Spring Boot backend MUST have these features implemented:

### Required Endpoints
- [ ] `GET /api/auth/me` - Get current authenticated user
- [ ] `POST /api/auth/login` - Email/password login
- [ ] `POST /api/auth/register` - User registration
- [ ] `POST /api/auth/logout` - Logout
- [ ] `GET /api/auth/google` - Start Google OAuth flow
- [ ] `GET /api/auth/google/callback` - Handle Google OAuth callback
- [ ] `POST /api/auth/forgot-password` - Request password reset
- [ ] `POST /api/auth/reset-password` - Reset password

### Response Format
All endpoints must return:
```json
{
  "status": "success",
  "data": { ... },
  "message": "...",
  "timestamp": "2024-01-01T00:00:00"
}
```

### CORS Configuration
Backend must allow CORS from `http://localhost:3000` with credentials:
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

See `docs/SPRING-BOOT-BACKEND-REQUIREMENTS.md` for complete backend implementation guide.

---

## 🔧 Troubleshooting

### Issue: "Backend not available"
**Cause**: Backend URL not configured or backend not running
**Solution**: 
1. Check `.env` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:8080`
2. Verify Spring Boot backend is running on port 8080
3. Restart frontend dev server after changing `.env`

### Issue: CORS Errors
**Cause**: Backend not allowing frontend origin
**Solution**: Configure CORS in Spring Boot backend (see backend requirements doc)

### Issue: "Invalid server response"
**Cause**: Backend returning wrong format
**Solution**: Ensure backend returns `{ status, data, message, timestamp }` format

### Issue: Session Not Persisting
**Cause**: Cookies not being sent/received properly
**Solution**: 
1. Verify `credentials: 'include'` in API calls (already configured)
2. Check backend session configuration
3. Verify cookies are httpOnly and secure in production

### Issue: 404 on /auth endpoints
**Cause**: Backend not using `/api` prefix
**Solution**: All backend endpoints must start with `/api`

---

## 📁 Project Structure

```
unishare-frontend/
├── .env                          # Backend URL configuration
├── BRANCH-README.md              # Quick reference for this branch
├── SETUP-GUIDE.md               # This file - complete setup guide
├── docs/
│   ├── SPRING-BOOT-MIGRATION.md              # Migration details
│   └── SPRING-BOOT-BACKEND-REQUIREMENTS.md   # Backend implementation guide
├── src/app/lib/api/
│   ├── base.js                  # Core API layer (Spring Boot compatible)
│   └── auth.js                  # Auth functions (Spring Boot compatible)
└── src/app/auth/
    └── google/callback/page.jsx  # OAuth callback (updated for Spring Boot)
```

---

## 🎯 Next Steps

### For Frontend (This Branch)
1. ✅ API layer configured for Spring Boot
2. ✅ Authentication endpoints updated
3. ⏳ Test with live Spring Boot backend
4. ⏳ Update other API endpoints when Spring Boot backend is ready:
   - Marketplace API (`src/app/lib/api/marketplace.js`)
   - Housing API (`src/app/lib/api/rooms.js`)
   - Rideshare API (`src/app/lib/api/rideshare.js`)
   - Admin API (various admin panel files)

### For Backend (Spring Boot)
1. ⏳ Implement authentication endpoints with `/api` prefix
2. ⏳ Ensure response format matches: `{ status, data, message, timestamp }`
3. ⏳ Configure CORS with credentials
4. ⏳ Set up session management
5. ⏳ Test with frontend running on port 3000

---

## ⚠️ Important Notes

1. **This branch is NOT backward compatible with Node.js backend**
   - Do NOT try to use this with the old Node.js backend
   - It will fail because response formats are different

2. **Do NOT merge to main yet**
   - Keep this branch separate until Spring Boot backend is fully ready
   - Test thoroughly before merging

3. **Branch Name**: `Axiom-frontend`
   - To switch to this branch: `git checkout Axiom-frontend`
   - To switch back to main: `git checkout main`

4. **Environment Variables**
   - Development: `http://localhost:8080`
   - Production: Update `.env` with production Spring Boot URL

---

## 📞 Need Help?

If you encounter issues:

1. **Check the docs**:
   - `BRANCH-README.md` - Quick reference
   - `docs/SPRING-BOOT-MIGRATION.md` - Migration details
   - `docs/SPRING-BOOT-BACKEND-REQUIREMENTS.md` - Backend requirements

2. **Verify backend is running**:
   ```bash
   curl http://localhost:8080/api/auth/me
   ```
   Should return JSON response (not 404)

3. **Check browser console** for API errors

4. **Check Spring Boot logs** for backend errors

---

## ✨ Summary

You now have:
- ✅ New branch `Axiom-frontend` ready for Spring Boot
- ✅ Frontend API layer fully configured
- ✅ Authentication flow updated
- ✅ Documentation complete
- ✅ Ready to test with Spring Boot backend

**Next**: Start your Spring Boot backend and test the authentication flow!
