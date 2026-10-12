// api/profile.js - User profile API functions (Spring Boot backend)
import { apiCall, apiCallFormData } from '@lib/api/base.js';

// ============== USER PROFILE MANAGEMENT ==============

// GET /api/auth/unishare/me → ApiResponse<UserDTO>: { status, data, message }
export const fetchUserProfile = async () => {
  try {
    const data = await apiCall('/api/auth/unishare/me');
    if (data.status === 'success' && data.data) {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.message || 'Failed to fetch profile' };
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to view your profile');
    throw error;
  }
};

// PUT /api/update/profile — multipart/form-data only
// Fields: username, bio, universityName, dateOfBirth, profileImage (file)
export const updateUserProfile = async (profileData, avatarFile = null) => {
  try {
    const formData = new FormData();
    if (profileData.username !== undefined && profileData.username !== null)
      formData.append('username', profileData.username);
    if (profileData.bio !== undefined && profileData.bio !== null)
      formData.append('bio', profileData.bio);
    if (profileData.universityName !== undefined && profileData.universityName !== null)
      formData.append('universityName', profileData.universityName);
    if (profileData.dateOfBirth !== undefined && profileData.dateOfBirth !== null)
      formData.append('dateOfBirth', profileData.dateOfBirth);
    if (avatarFile) formData.append('profileImage', avatarFile);

    return await apiCallFormData('/api/update/profile', formData, { method: 'PUT' });
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to update your profile');
    throw error;
  }
};

export const uploadUserAvatar = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', imageFile);
    return await apiCallFormData('/api/update/profile', formData, { method: 'PUT' });
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to upload avatar');
    throw error;
  }
};

// No dedicated delete-avatar endpoint — send empty FormData
export const deleteUserAvatar = async () => {
  try {
    return await apiCallFormData('/api/update/profile', new FormData(), { method: 'PUT' });
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to delete avatar');
    throw error;
  }
};

// No dedicated stats endpoint — derive from my-rides PageResponse
export const getUserStats = async () => {
  try {
    const data = await apiCall('/api/rides/my-rides');
    return { success: true, data };
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to view stats');
    throw error;
  }
};

// Combine my rides + my requests for dashboard
export const getUserDashboard = async () => {
  try {
    const [rides, requests] = await Promise.all([
      apiCall('/api/rides/my-rides'),
      apiCall('/api/rides/my-requests')
    ]);
    // Both return PageResponse: { content, page, size, totalElements, totalPages }
    return { success: true, data: { rides: rides.content || [], requests: requests.content || [] } };
  } catch (error) {
    if (error.message.includes('401')) throw new Error('Please log in to view dashboard');
    throw error;
  }
};

// No public-profile-by-userId endpoint on backend yet
export const fetchPublicProfile = async (userId) => {
  throw new Error('Public profile endpoint not available on backend yet');
};
