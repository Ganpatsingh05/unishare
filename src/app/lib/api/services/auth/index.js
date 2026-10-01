// Auth Service - Centralized authentication APIs
export {
  fetchCurrentUser,
  loginWithEmail,
  registerWithEmail,
  startGoogleLogin,
  startGithubLogin,
  logout,
  requestPasswordReset,
  resetPassword,
  checkAdminStatus,
  checkAuthStatus
} from './auth.service.js';
