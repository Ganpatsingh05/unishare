// api/auth.js - Authentication API functions (Spring Boot backend)
import { apiCall, clearAPICache, BACKEND_URL } from '@lib/api/base.js';

// ============== USER SHAPE ==============

/**
 * Maps the backend's user payload onto the field names the UI already reads.
 *
 * The backend returns { id, username, email, roles, authProvider, active, profile }.
 * Existing components read `name` and `picture`, so those are aliased here once, at
 * the API boundary, instead of in every consumer.
 */
export const normalizeUser = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  const profile = raw.profile || {};
  const name = raw.name || raw.username || raw.displayName || '';

  return {
    ...raw,
    name,
    username: raw.username || name,
    email: raw.email || null,
    roles: Array.isArray(raw.roles) ? raw.roles : [],
    picture: raw.picture || profile.profilePictureUrl || raw.avatar || null,
    avatar: raw.avatar || profile.profilePictureUrl || null,
    bio: raw.bio ?? profile.bio ?? null,
    universityName: raw.universityName ?? profile.universityName ?? null,
    dateOfBirth: raw.dateOfBirth ?? profile.dateOfBirth ?? null,
  };
};

// ============== AUTHENTICATION ==============

// GET /api/user/me → { success, user: UserResponse } | 401 { success: false, message }
// Never cached: this decides whether the app believes a session exists.
export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/api/user/me', { cache: false });
    if (data.success && data.user) {
      return normalizeUser(data.user);
    }
    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const checkAuthStatus = async () => {
  try {
    const user = await fetchCurrentUser();
    return {
      authenticated: !!user,
      user,
      isAuthenticated: !!user
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { authenticated: false, user: null, isAuthenticated: false };
  }
};

// POST /api/user/logout → { success, message }
export const logout = async () => {
  try {
    const response = await apiCall('/api/user/logout', { method: 'POST' });
    return response.success === true;
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = `${BACKEND_URL}/api/user/logout`;
    return false;
  } finally {
    // Session-scoped GETs must not outlive the session, or the next
    // auth check would still see the signed-out user.
    clearAPICache();
  }
};

export const checkAdminStatus = async () => {
  try {
    const user = await fetchCurrentUser();
    if (!user) return { isAdmin: false, user: null, loading: false };
    // roles is a set of strings e.g. ["USER", "ADMIN"]
    const isAdmin = Array.isArray(user.roles)
      ? user.roles.includes('ADMIN')
      : false;
    return { isAdmin, user, loading: false };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, user: null, loading: false };
  }
};

export const startGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

export const startGithubLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/github`;
};

// POST /api/auth/unishare/login → AuthResponseDTO: { success, message, user }
export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiCall('/api/auth/unishare/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.success) {
      // Drop anything cached before the session existed.
      clearAPICache();
      return { success: true, user: normalizeUser(response.user), message: response.message };
    }
    return { success: false, message: response.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Login failed. Please try again.' };
  }
};

// POST /api/auth/unishare/register → AuthResponseDTO: { success, message, user }
export const registerWithEmail = async (userData) => {
  try {
    const response = await apiCall('/api/auth/unishare/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.username || userData.firstName || userData.email.split('@')[0],
        firstName: userData.firstName,
        lastName: userData.lastName
      })
    });
    if (response.success) {
      clearAPICache();
      return { success: true, user: normalizeUser(response.user), message: response.message || 'Registration successful!' };
    }
    return { success: false, message: response.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Registration failed. Please try again.' };
  }
};

// POST /api/user-management/password-update → PasswordResetResponse: { message }
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiCall('/api/user-management/password-update', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return { success: true, message: response.message || 'Password reset email sent!' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: error.message || 'Failed to send reset email. Please try again.' };
  }
};

// POST /api/user-management/password-update/confirm → PasswordResetResponse: { message }
export const confirmPasswordReset = async (token, newPassword) => {
  try {
    const response = await apiCall('/api/user-management/password-update/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
    return { success: true, message: response.message || 'Password reset successful!' };
  } catch (error) {
    console.error('Password reset confirmation error:', error);
    return { success: false, message: error.message || 'Failed to reset password. Please try again.' };
  }
};
