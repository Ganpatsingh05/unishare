// User Profile API functions
import { useState, useCallback } from 'react';
import { apiCall, apiCallFormData } from './base.js';

// Get current user's profile
export const getCurrentUserProfile = async () => {
  try {
    const response = await apiCall('/api/profile');
    return response;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Get public user profile by custom user ID
export const getPublicUserProfile = async (customUserId) => {
  try {
    // Ensure customUserId is properly formatted
    const userId = customUserId.startsWith('@') ? customUserId : `@${customUserId}`;
    const response = await apiCall(`/api/profile/${encodeURIComponent(userId)}`);
    return response;
  } catch (error) {
    console.error('Error fetching public user profile:', error);
    throw error;
  }
};

// Create or update user profile
export const updateUserProfile = async (profileData, profileImage = null) => {
  try {
    if (profileImage) {
      // Use FormData for image upload
      const formData = new FormData();
      
      // Add profile fields
      if (profileData.display_name) formData.append('display_name', profileData.display_name);
      if (profileData.bio) formData.append('bio', profileData.bio);
      if (profileData.custom_user_id) formData.append('custom_user_id', profileData.custom_user_id);
      
      // Add image file
      formData.append('profileImage', profileImage);
      
      const response = await apiCallFormData('/api/profile', formData, { method: 'POST' });
      return response;
    } else {
      // Use JSON for text-only updates
      const response = await apiCall('/api/profile', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      return response;
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// ============== VALIDATION FUNCTIONS ==============

// Validate custom user ID format
export const validateCustomUserId = (customUserId) => {
  if (!customUserId) return { valid: true }; // Optional field
  
  // Check if it starts with @
  if (!customUserId.startsWith('@')) {
    return { valid: false, message: 'Custom user ID must start with @' };
  }
  
  // Check length (3-21 characters including @)
  if (customUserId.length < 3 || customUserId.length > 21) {
    return { valid: false, message: 'Custom user ID must be 3-21 characters long (including @)' };
  }
  
  // Check format (letters, numbers, underscores only after @)
  const usernamePattern = /^@[a-zA-Z0-9_]{2,20}$/;
  if (!usernamePattern.test(customUserId)) {
    return { valid: false, message: 'Custom user ID can only contain letters, numbers, and underscores' };
  }
  
  // Check for reserved usernames
  const reserved = ['@admin', '@system', '@support', '@help', '@api', '@www', '@mail'];
  if (reserved.includes(customUserId.toLowerCase())) {
    return { valid: false, message: 'This username is reserved and cannot be used' };
  }
  
  return { valid: true };
};

// Validate profile image
export const validateProfileImage = (file) => {
  if (!file) return { valid: true }; // Optional field
  
  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, message: 'Profile image must be smaller than 5MB' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Profile image must be JPEG, PNG, WebP, or GIF format' };
  }
  
  return { valid: true };
};

// Validate display name
export const validateDisplayName = (displayName) => {
  if (!displayName) return { valid: true }; // Optional field
  
  if (displayName.length < 1 || displayName.length > 100) {
    return { valid: false, message: 'Display name must be 1-100 characters long' };
  }
  
  return { valid: true };
};

// Validate bio
export const validateBio = (bio) => {
  if (!bio) return { valid: true }; // Optional field
  
  if (bio.length > 500) {
    return { valid: false, message: 'Bio must be 500 characters or less' };
  }
  
  return { valid: true };
};

// Validate all profile data
export const validateProfileData = (profileData, profileImage = null) => {
  const errors = {};
  
  const displayNameValidation = validateDisplayName(profileData.display_name);
  if (!displayNameValidation.valid) {
    errors.display_name = displayNameValidation.message;
  }
  
  const bioValidation = validateBio(profileData.bio);
  if (!bioValidation.valid) {
    errors.bio = bioValidation.message;
  }
  
  const customUserIdValidation = validateCustomUserId(profileData.custom_user_id);
  if (!customUserIdValidation.valid) {
    errors.custom_user_id = customUserIdValidation.message;
  }
  
  const imageValidation = validateProfileImage(profileImage);
  if (!imageValidation.valid) {
    errors.profileImage = imageValidation.message;
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

// ============== ENHANCED API FUNCTIONS ==============

// Check username availability
export const checkUsernameAvailability = async (customUserId) => {
  try {
    // Ensure username starts with @ if not already
    const username = customUserId.startsWith('@') ? customUserId : `@${customUserId}`;
    const response = await apiCall(`/api/profile/check-availability/${encodeURIComponent(username)}`);
    return response;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
};

// Get username suggestions
export const getUsernameSuggestions = async (baseUsername) => {
  try {
    // Remove @ symbol if present for the base username
    const base = baseUsername.startsWith('@') ? baseUsername.slice(1) : baseUsername;
    const response = await apiCall(`/api/profile/suggest-username/${encodeURIComponent(base)}`);
    return response;
  } catch (error) {
    console.error('Error getting username suggestions:', error);
    throw error;
  }
};

// Search user profiles
export const searchUserProfiles = async (query) => {
  try {
    const response = await apiCall(`/api/profile/search/${encodeURIComponent(query)}`);
    return response;
  } catch (error) {
    console.error('Error searching user profiles:', error);
    throw error;
  }
};

// Delete profile image
export const deleteProfileImage = async () => {
  try {
    const response = await apiCall('/api/profile/image', { method: 'DELETE' });
    return response;
  } catch (error) {
    console.error('Error deleting profile image:', error);
    throw error;
  }
};

// ============== REACT HOOKS ==============

// Custom hook for username validation with real-time checking
export const useUsernameValidation = () => {
  const [availability, setAvailability] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState('');

  const checkAvailability = useCallback(async (username) => {
    if (!username || username.length < 3) {
      setAvailability(null);
      setSuggestions([]);
      return;
    }

    // Avoid duplicate checks
    if (username === lastChecked && availability !== null) {
      return;
    }

    setLoading(true);
    setLastChecked(username);

    try {
      const result = await checkUsernameAvailability(username);
      setAvailability(result);

      // If username is not available, get suggestions
      if (result.success && !result.available) {
        const baseUsername = username.replace('@', '');
        const suggestionsResult = await getUsernameSuggestions(baseUsername);
        setSuggestions(suggestionsResult.success ? suggestionsResult.suggestions || [] : []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setAvailability({
        success: false,
        available: false,
        message: 'Error checking username availability',
        error_code: 'NETWORK_ERROR'
      });
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [lastChecked, availability]);

  const reset = useCallback(() => {
    setAvailability(null);
    setSuggestions([]);
    setLoading(false);
    setLastChecked('');
  }, []);

  return { 
    availability, 
    suggestions, 
    loading, 
    checkAvailability, 
    reset 
  };
};

// Enhanced validation with error codes
export const validateProfileDataEnhanced = (profileData, profileImage = null) => {
  const errors = {};
  
  // Display name validation
  if (!profileData.display_name || profileData.display_name.trim().length === 0) {
    errors.display_name = {
      message: 'Display name is required',
      error_code: 'REQUIRED_FIELD'
    };
  } else if (profileData.display_name.trim().length > 100) {
    errors.display_name = {
      message: 'Display name must be 100 characters or less',
      error_code: 'TOO_LONG'
    };
  }
  
  // Bio validation
  if (profileData.bio && profileData.bio.length > 500) {
    errors.bio = {
      message: 'Bio must be 500 characters or less',
      error_code: 'TOO_LONG'
    };
  }
  
  // Enhanced custom user ID validation
  if (profileData.custom_user_id) {
    const customUserId = profileData.custom_user_id.trim();
    
    // Must start with @
    if (!customUserId.startsWith('@')) {
      errors.custom_user_id = {
        message: 'Username must start with @',
        error_code: 'INVALID_FORMAT'
      };
    } else {
      const username = customUserId.slice(1); // Remove @
      
      // Length validation
      if (username.length < 2 || username.length > 20) {
        errors.custom_user_id = {
          message: 'Username must be between 2-20 characters long',
          error_code: 'INVALID_LENGTH'
        };
      }
      
      // Character validation
      else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.custom_user_id = {
          message: 'Username can only contain letters, numbers, and underscores',
          error_code: 'INVALID_CHARACTERS'
        };
      }
      
      // Reserved usernames
      const reservedUsernames = ['admin', 'root', 'api', 'www', 'mail', 'support', 'help', 'info', 'contact', 'news', 'blog', 'dev', 'test', 'staging'];
      if (reservedUsernames.includes(username.toLowerCase())) {
        errors.custom_user_id = {
          message: 'This username is reserved and cannot be used',
          error_code: 'RESERVED_USERNAME'
        };
      }
    }
  }
  
  // Profile image validation
  if (profileImage) {
    const imageValidation = validateProfileImage(profileImage);
    if (!imageValidation.valid) {
      errors.profileImage = {
        message: imageValidation.message,
        error_code: 'INVALID_IMAGE'
      };
    }
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};