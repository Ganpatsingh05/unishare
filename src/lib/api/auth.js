// api/auth.js - Authentication API functions (Spring Boot backend)
import { apiCall, BACKEND_URL } from '@lib/api/base.js';

// ============== AUTHENTICATION ==============

export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/api/auth/unishare/me');
    // Backend returns ApiResponse<UserDTO>: { status, data, message, timestamp }
    if (data.status === 'success' && data.data) {
      return data.data;
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

export const logout = async () => {
  try {
    const response = await apiCall('/api/auth/unishare/logout', { method: 'POST' });
    // Backend returns ApiResponse<Void>: { status, message }
    return response.status === 'success';
  } catch (error) {
    console.error('Logout error:', error);
    window.location.href = `${BACKEND_URL}/api/auth/unishare/logout`;
    return false;
  }
};

export const checkAdminStatus = async () => {
  try {
    const user = await fetchCurrentUser();
    if (!user) return { isAdmin: false, user: null, loading: false };
    // roles is Set<String> of role names e.g. ["USER", "ADMIN"]
    const isAdmin = user.roles?.includes('ADMIN') || false;
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

// Email/Password Login
// Backend returns AuthResponseDTO: { success, message, user }
export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiCall('/api/auth/unishare/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (response.success) {
      return { success: true, user: response.user, message: response.message };
    }
    return { success: false, message: response.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: error.message || 'Login failed. Please try again.' };
  }
};

// Email/Password Registration
// Backend returns AuthResponseDTO: { success, message, user }
export const registerWithEmail = async (userData) => {
  try {
    const response = await apiCall('/api/auth/unishare/register', {
      method: 'POST',
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
        username: userData.username || userData.firstName || userData.email.split('@')[0]
      })
    });
    if (response.success) {
      return { success: true, user: response.user, message: response.message || 'Registration successful!' };
    }
    return { success: false, message: response.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: error.message || 'Registration failed. Please try again.' };
  }
};

// Request password reset
// Backend returns PasswordResetResponse: { message } only — no success field
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

// Confirm password reset with token
// Backend returns PasswordResetResponse: { message } only — no success field
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
