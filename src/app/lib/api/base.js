// api/base.js - Enhanced API utilities and configuration
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// API Configuration and Constants
export const API_CONFIG = {
  BASE_URL: BACKEND_URL,
  TIMEOUT: 30000, // 30 second timeout
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second base delay
  CACHE_TTL: 5 * 60 * 1000, // 5 minutes
};

// Simple in-memory cache for API responses
class APICache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  set(key, data, ttl = API_CONFIG.CACHE_TTL) {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

const apiCache = new APICache();

// Standardized API error class
export class APIError extends Error {
  constructor(message, status, details = null, errors = []) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.details = details;
    this.errors = errors;
  }
}

// Utility to create query parameters
export const buildQueryParams = (params = {}) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '');
  
  if (filtered.length === 0) return '';
  
  return '?' + new URLSearchParams(filtered).toString();
};

// Delay utility for retries
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced API call with retry logic, caching, and proper error handling
export const apiCall = async (endpoint, options = {}) => {
  const {
    method = 'GET',
    cache = method === 'GET', // Only cache GET requests by default
    cacheTTL = API_CONFIG.CACHE_TTL,
    retries = API_CONFIG.RETRY_ATTEMPTS,
    timeout = API_CONFIG.TIMEOUT,
    ...fetchOptions
  } = options;

  // Generate cache key for GET requests
  const cacheKey = method === 'GET' ? `${endpoint}_${JSON.stringify(fetchOptions)}` : null;
  
  // Check cache for GET requests
  if (cache && cacheKey) {
    const cachedData = apiCache.get(cacheKey);
    if (cachedData) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`📦 Cache hit for ${endpoint}`);
      }
      return cachedData;
    }
  }

  // Validate backend URL
  if (!BACKEND_URL) {
    console.warn(`Backend URL not configured. Skipping API call to ${endpoint}`);
    if (endpoint === '/auth/me') {
      return { success: true, user: null };
    }
    throw new APIError('Backend not available', 503, 'NEXT_PUBLIC_BACKEND_URL not configured');
  }

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method,
        credentials: 'include', // Essential for session-based auth
        signal: controller.signal,
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new APIError(
          'Invalid server response',
          response.status,
          `Server returned non-JSON response: ${parseError.message}`
        );
      }

      // Handle HTTP errors
      if (!response.ok) {
        throw new APIError(
          data.message || data.error || `HTTP ${response.status}`,
          response.status,
          data.details || null,
          data.errors || []
        );
      }

      // Cache successful GET requests
      if (cache && cacheKey && method === 'GET') {
        apiCache.set(cacheKey, data, cacheTTL);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ API ${method} ${endpoint}:`, data);
      }

      return data;

    } catch (error) {
      lastError = error;
      attempt++;

      // Don't retry on authentication errors or client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        break;
      }

      // Don't retry on abort (timeout)
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408, `Request exceeded ${timeout}ms timeout`);
      }

      // Retry on network errors or server errors (5xx)
      if (attempt <= retries) {
        const retryDelay = API_CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
        if (process.env.NODE_ENV === 'development') {
          console.warn(`🔄 Retrying ${endpoint} (attempt ${attempt}/${retries + 1}) in ${retryDelay}ms`);
        }
        await delay(retryDelay);
      }
    }
  }

  // If we get here, all retries failed
  if (process.env.NODE_ENV === 'development') {
    console.error(`❌ API call failed [${endpoint}] after ${retries + 1} attempts:`, lastError.message);
  }
  
  throw lastError;
};

// Enhanced FormData API call for file uploads with progress tracking
export const apiCallFormData = async (endpoint, formData, options = {}) => {
  const {
    method = 'POST',
    timeout = API_CONFIG.TIMEOUT * 2, // Double timeout for file uploads
    onUploadProgress = null,
    retries = 1, // Fewer retries for file uploads
  } = options;

  if (!BACKEND_URL) {
    throw new APIError('Backend not available', 503, 'NEXT_PUBLIC_BACKEND_URL not configured');
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`📁 FormData ${method} ${endpoint}`);
    console.log('FormData contents:', Array.from(formData.entries()));
  }

  let attempt = 0;
  let lastError;

  while (attempt <= retries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method,
        credentials: 'include',
        signal: controller.signal,
        body: formData, // Don't set Content-Type, let browser handle it for FormData
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new APIError(
          'Invalid server response',
          response.status,
          `Server returned non-JSON response: ${parseError.message}`
        );
      }

      if (!response.ok) {
        throw new APIError(
          data.message || data.error || `HTTP ${response.status}`,
          response.status,
          data.details || null,
          data.errors || []
        );
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ FormData upload successful:`, data);
      }

      // Clear related cache entries after successful upload
      if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
        const resourceType = endpoint.split('/')[2]; // Extract resource type from endpoint
        if (resourceType) {
          // Clear cache entries related to this resource type
          for (const key of apiCache.cache.keys()) {
            if (key.includes(resourceType)) {
              apiCache.delete(key);
            }
          }
        }
      }

      return data;

    } catch (error) {
      lastError = error;
      attempt++;

      // Don't retry on authentication errors or client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        break;
      }

      if (error.name === 'AbortError') {
        throw new APIError('Upload timeout', 408, `Upload exceeded ${timeout}ms timeout`);
      }

      if (attempt <= retries) {
        const retryDelay = API_CONFIG.RETRY_DELAY * attempt;
        if (process.env.NODE_ENV === 'development') {
          console.warn(`🔄 Retrying upload ${endpoint} (attempt ${attempt}/${retries + 1})`);
        }
        await delay(retryDelay);
      }
    }
  }

  throw lastError;
};

// Batch API calls utility
export const batchAPICall = async (requests) => {
  const results = await Promise.allSettled(
    requests.map(({ endpoint, options }) => apiCall(endpoint, options))
  );

  return results.map((result, index) => ({
    endpoint: requests[index].endpoint,
    success: result.status === 'fulfilled',
    data: result.status === 'fulfilled' ? result.value : null,
    error: result.status === 'rejected' ? result.reason : null,
  }));
};

// Clear cache utility
export const clearAPICache = (pattern = null) => {
  if (pattern) {
    for (const key of apiCache.cache.keys()) {
      if (key.includes(pattern)) {
        apiCache.delete(key);
      }
    }
  } else {
    apiCache.clear();
  }
};

// Invalidate specific cache entry
export const invalidateCache = (endpoint, options = {}) => {
  const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
  apiCache.delete(cacheKey);
};

// Export utilities and configuration
export { BACKEND_URL, apiCache, API_CONFIG };