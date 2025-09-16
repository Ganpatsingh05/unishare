// api/base.js - Base API utilities and configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Helper function for API calls
export const apiCall = async (endpoint, options = {}) => {
  try {
    // If no backend URL is configured, return mock data or throw a descriptive error
    if (!BACKEND_URL) {
      console.warn(`Backend URL not configured. Skipping API call to ${endpoint}`);
      // Return mock data for development
      if (endpoint === '/auth/me') {
        return { isAuthenticated: false, user: null };
      }
      throw new Error('Backend not available');
    }

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      credentials: 'include', // Always include cookies
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Handle network errors or server unavailable
    if (!response.ok) {
      // If it's a 404 or connection error, it's likely the backend endpoint doesn't exist yet
      if (response.status === 404 || response.status >= 500) {
        throw new Error(`Backend endpoint not available: ${endpoint}`);
      }
    }

    const data = await response.json();
    console.log("Api data: ",data);

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    // Only log detailed errors in development
    if (process.env.NODE_ENV === 'development') {
      console.warn(`API call failed [${endpoint}]:`, error.message);
    }
    throw error;
  }
};

// Helper function for FormData calls (file uploads)
export const apiCallFormData = async (endpoint, formData, method = 'POST') => {
  try {
    // If no backend URL is configured, return mock data or throw a descriptive error
    if (!BACKEND_URL) {
      console.warn('NEXT_PUBLIC_BACKEND_URL is not configured. FormData API calls will be mocked.');
      throw new Error('Backend URL not configured');
    }

    console.log(`FormData API call to: ${BACKEND_URL}${endpoint}`);
    console.log('FormData contents:', Array.from(formData.entries()));

    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      credentials: 'include',
      body: formData // Don't set Content-Type, let browser handle it for FormData
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      throw new Error(`Server returned non-JSON response (${response.status})`);
    }

    console.log('Response data:', data);

    if (!response.ok) {
      throw new Error(data.message || data.error || data.details || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// Export the backend URL for other modules
export { BACKEND_URL };