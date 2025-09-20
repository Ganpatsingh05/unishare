// api/profile.js - User profile related API functions
import { apiCall, apiCallFormData } from './base.js';

// ============== USER PROFILE MANAGEMENT ==============

export const fetchUserProfile = async () => {
  try {
    const data = await apiCall('/profile/me');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view your profile');
    }
    throw error;
  }
};

export const updateUserProfile = async (profileData, avatarFile = null) => {
  try {
    console.log('Updating profile with data:', profileData, 'has avatar:', !!avatarFile);

    // Use FormData for profile update (supports file upload)
    const formData = new FormData();
    
    // Add profile fields
    Object.keys(profileData).forEach(key => {
      if (profileData[key] !== undefined && profileData[key] !== null) {
        formData.append(key, profileData[key]);
      }
    });

    // Add avatar file if provided
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    const data = await apiCallFormData('/profile/me', formData, { method: 'PUT' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to update your profile');
    }
    throw error;
  }
};

export const uploadUserAvatar = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('avatar', imageFile);
    
    const data = await apiCallFormData('/profile/me', formData, { method: 'PUT' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to upload avatar');
    }
    throw error;
  }
};

export const deleteUserAvatar = async () => {
  try {
    const data = await apiCall('/profile/avatar', { method: 'DELETE' });
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to delete avatar');
    }
    throw error;
  }
};

export const getUserStats = async () => {
  try {
    const data = await apiCall('/profile/stats');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view stats');
    }
    throw error;
  }
};

export const getUserDashboard = async () => {
  try {
    const data = await apiCall('/profile/dashboard');
    return data;
  } catch (error) {
    if (error.message.includes('401')) {
      throw new Error('Please log in to view dashboard');
    }
    throw error;
  }
};

export const fetchPublicProfile = async (userId) => {
  try {
    const data = await apiCall(`/profile/${userId}`);
    return data;
  } catch (error) {
    if (error.message.includes('404')) {
      throw new Error('Profile not found or not public');
    }
    throw error;
  }
};