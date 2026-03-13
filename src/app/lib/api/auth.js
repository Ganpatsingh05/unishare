// api/auth.js - Authentication related API functions
import { apiCall, BACKEND_URL } from "./base.js";

// ============== AUTHENTICATION ==============

export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/auth/me');
    
    // Your backend returns { success: true, user: {...} } or { success: true, user: null }
    if (data.success) {
      return data.user;
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
      isAuthenticated: !!user // Add for backward compatibility
    };
  } catch (error) {
    console.error('Error checking auth status:', error);
    return { authenticated: false, user: null, isAuthenticated: false };
  }
};

export const logout = async () => {
  try {
    // Use fetch POST to properly destroy the session on the server
    const response = await fetch(`${BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: navigate to GET logout endpoint if fetch fails
    window.location.href = `${BACKEND_URL}/auth/logout`;
    return false;
  }
};

// Check if current user is admin based on backend logic
export const checkAdminStatus = async () => {
  try {
    const user = await fetchCurrentUser();
    
    if (!user) {
      return { isAdmin: false, user: null, loading: false };
    }

    // Define the same admin emails as your backend
    const ADMIN_EMAILS = [
      'itspracin750@gmail.com',
      'ask.gsinghr@gmail.com', 
      'mishrilalparihar30221@gmail.com',
      'sumanthjupudi22@gmail.com'
    ];

    const isAdmin = ADMIN_EMAILS.includes(user.email);
    
    return { 
      isAdmin, 
      user,
      loading: false,
      adminEmails: ADMIN_EMAILS 
    };
  } catch (error) {
    console.error('Error checking admin status:', error);
    return { isAdmin: false, user: null, loading: false };
  }
};

export const startGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/auth/google`;
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiCall('/auth/login', {
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
export const registerWithEmail = async (userData) => {
  try {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        university: userData.university || ''
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
export const requestPasswordReset = async (email) => {
  try {
    const response = await apiCall('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    
    if (response.success) {
      return { success: true, message: response.message || 'Password reset email sent!' };
    }
    return { success: false, message: response.message || 'Failed to send reset email' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, message: error.message || 'Failed to send reset email. Please try again.' };
  }
};
