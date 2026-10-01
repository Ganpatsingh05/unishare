// api/auth.js - Authentication API functions for Spring Boot backend
import { apiCall, BACKEND_URL } from "../../core/client.js";


// ============== AUTHENTICATION ==============

export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/auth/me');
    
    // Spring Boot returns: { status: 'success', data: {...user}, message: '...' }
    // or { status: 'success', data: null, message: 'No user authenticated' }
    if (data.status === 'success') {
      return data.data; // This will be user object or null
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
    const data = await apiCall('/auth/logout', {
      method: 'POST'
    });
    // Spring Boot returns: { status: 'success', message: 'Logged out successfully' }
    return data.status === 'success';
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: navigate to logout endpoint if fetch fails
    window.location.href = `${BACKEND_URL}/api/auth/logout`;
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

// OAuth Login - Google
export const startGoogleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

// OAuth Login - GitHub
export const startGithubLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/github`;
};

// Email/Password Login
export const loginWithEmail = async (email, password) => {
  try {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    // Spring Boot returns: { status: 'success', data: {user}, message: '...' }
    if (response.status === 'success') {
      return { 
        success: true, 
        user: response.data?.user || response.data, 
        message: response.message || 'Login successful' 
      };
    }
    return { success: false, message: response.message || 'Login failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error.message || 'Login failed. Please try again.',
      errors: error.errors || []
    };
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
    
    // Spring Boot returns: { status: 'success', data: {user}, message: '...' }
    if (response.status === 'success') {
      return { 
        success: true, 
        user: response.data?.user || response.data, 
        message: response.message || 'Registration successful!' 
      };
    }
    return { success: false, message: response.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      message: error.message || 'Registration failed. Please try again.',
      errors: error.errors || []
    };
  }
};

// Request password reset - Send reset token via email
// Backend endpoint: POST /api/user-management/password-update
export const requestPasswordReset = async (email) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user-management/password-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email })
    });
    
    const data = await response.json();
    
    // Backend returns: { message: "If an account exists for this email, a password reset link has been sent." }
    return { 
      success: true, 
      message: data.message || 'If an account exists for this email, a password reset link has been sent.'
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to send password reset email. Please try again.'
    };
  }
};

// Reset password with token (from email link)
// Backend endpoint: POST /api/user-management/password-update/confirm
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/user-management/password-update/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        token, 
        newPassword 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Invalid or expired token');
    }
    
    const data = await response.json();
    
    // Backend returns: { message: "Password has been updated successfully." }
    return { 
      success: true, 
      message: data.message || 'Password has been updated successfully!'
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to reset password. The link may be invalid or expired.'
    };
  }
};
