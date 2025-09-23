// api/auth.js - Authentication related API functions
import { apiCall, BACKEND_URL } from './base.js';

// ============== AUTHENTICATION ==============

export const fetchCurrentUser = async () => {
  try {
    const data = await apiCall('/auth/me');
    console.log("User data from backend:", data);
    
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
    // Use your backend logout endpoint which handles session destruction and redirects
    window.location.href = `${BACKEND_URL}/auth/logout`;
    return true;
  } catch (error) {
    console.error('Logout error:', error);
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
    
    console.log('Admin status check:', { userEmail: user.email, isAdmin });
    
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