// Auth Service - Centralized authentication APIs
export {
  fetchCurrentUser,
  loginWithEmail,
  registerWithEmail,
  startGoogleLogin,
  startGithubLogin,
  logout,
  requestPasswordReset,
  resetPassword
} from './auth.service.js';
