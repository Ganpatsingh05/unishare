// api/announcements.js - Announcements related API functions
import { apiCall } from "./base.js";

// ============== SYSTEM ANNOUNCEMENTS ==============

// Get all announcements (both active and inactive) for admin use
export const getAllSystemAnnouncements = async () => {
  try {
    const response = await apiCall('/admin/announcements');
    
    // Handle the response structure - backend returns {success: true, data: [...]}
    const announcementsArray = response.data || response || [];
    
    return {
      success: true,
      data: Array.isArray(announcementsArray) ? announcementsArray : [],
      announcements: Array.isArray(announcementsArray) ? announcementsArray : [],
      message: response.message || `Found ${Array.isArray(announcementsArray) ? announcementsArray.length : 0} announcements`
    };
  } catch (error) {
    console.warn('Admin announcements endpoint not available, using fallback:', error.message);
    
    // Return demo/fallback announcements for development when backend is not available
    const fallbackAnnouncements = [
      {
        id: 1,
        title: 'Welcome to UniShare!',
        body: 'We are excited to announce the launch of UniShare - your one-stop platform for campus life!',
        priority: 'high',
        tags: ['welcome', 'launch', 'community'],
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        users: { name: 'Admin', email: 'admin@example.com' }
      },
      {
        id: 2,
        title: 'System Maintenance',
        body: 'Scheduled maintenance this weekend. Some features may be temporarily unavailable.',
        priority: 'normal',
        tags: ['maintenance', 'system'],
        active: false,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        users: { name: 'Admin', email: 'admin@example.com' }
      },
      {
        id: 3,
        title: 'New Features Coming Soon',
        body: 'Stay tuned for exciting new features in the next update!',
        priority: 'low',
        tags: ['features', 'update'],
        active: true,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        users: { name: 'Admin', email: 'admin@example.com' }
      }
    ];
    
    return { 
      success: true, 
      announcements: fallbackAnnouncements,
      message: 'Using demo announcements (backend not available)' 
    };
  }
};

export const createSystemAnnouncement = async (announcement) => {
  try {
    // Ensure required fields are set - admin creates with user_id
    const payload = {
      user_id: announcement.user_id, // Admin can specify any user, or use their own ID
      title: announcement.title,
      body: announcement.body,
      priority: announcement.priority || 'normal',
      tags: announcement.tags || [],
      active: announcement.active !== undefined ? announcement.active : true,
      expires_at: announcement.expiresAt || null
    };

    const response = await apiCall('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data: response.data,
      announcement: response.data,
      message: response.message || 'Announcement created successfully'
    };
  } catch (error) {
    console.warn('Create announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to create announcement' 
    };
  }
};

// Get active announcements for public display (only shows announcements that admin has made active)
export const getSystemAnnouncements = async () => {
  try {
    // This endpoint only returns active announcements that admin has approved
    const data = await apiCall('/api/announcements');
    
    if (data.success && data.announcements) {
      // Transform announcements to ensure consistent format
      const announcements = data.announcements.map(announcement => ({
        id: announcement.id,
        title: announcement.title || announcement.heading,
        body: announcement.body || announcement.message,
        category: announcement.category || 'general',
        priority: announcement.priority || 'normal',
        link: announcement.link || null,
        expires: announcement.expires || null,
        active: announcement.active !== false,
        createdAt: announcement.createdAt || announcement.created_at,
        updatedAt: announcement.updatedAt || announcement.updated_at
      }));
      
      return {
        success: true,
        announcements,
        data: announcements,
        message: `Found ${announcements.length} active announcements`
      };
    }
    
    return data;
  } catch (error) {
    console.warn('Announcements endpoint not available yet:', error.message);
    // Return empty announcements instead of throwing
    return { 
      success: true, 
      data: [],
      announcements: [],
      message: 'Announcements feature not yet implemented' 
    };
  }
};

export const updateSystemAnnouncement = async (announcementId, updates) => {
  try {
    // Prepare update payload matching backend schema
    const payload = {
      title: updates.title,
      body: updates.body,
      priority: updates.priority || 'normal',
      tags: updates.tags || [],
      active: updates.active !== undefined ? updates.active : true,
      expires_at: updates.expiresAt || null
    };

    const response = await apiCall(`/admin/announcements/${announcementId}`, {
      method: 'PUT', // Your backend uses PUT, not PATCH
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data: response.data,
      announcement: response.data,
      message: response.message || 'Announcement updated successfully'
    };
  } catch (error) {
    console.warn('Update announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to update announcement' 
    };
  }
};

export const deleteSystemAnnouncement = async (announcementId) => {
  try {
    const response = await apiCall(`/admin/announcements/${announcementId}`, {
      method: 'DELETE',
    });

    return {
      success: true,
      data: response.data,
      message: response.message || 'Announcement deleted successfully'
    };
  } catch (error) {
    console.warn('Delete announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to delete announcement' 
    };
  }
};

// Get active announcements for public display (used by show page)
export const getActiveAnnouncements = async () => {
  try {
    const result = await getSystemAnnouncements();
    
    if (result.success && result.announcements) {
      // Filter only active announcements for public display
      const activeAnnouncements = result.announcements.filter(announcement => 
        announcement.active !== false
      );
      
      return {
        success: true,
        announcements: activeAnnouncements,
        data: activeAnnouncements,
        message: `Found ${activeAnnouncements.length} active announcements`
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error getting active announcements:', error);
    return { 
      success: true, 
      announcements: [],
      data: [],
      message: 'No announcements available' 
    };
  }
};

// ============== USER ANNOUNCEMENT FUNCTIONS ==============

// Submit announcement (authenticated user) - Will be inactive by default until admin approves
export const submitAnnouncement = async (announcementData) => {
  try {
    // User submitted announcements are inactive by default and need admin approval to be visible to public
    const response = await apiCall('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({
        ...announcementData,
        // Backend will set active: false by default, but being explicit
        active: false
      })
    });

    return {
      success: true,
      data: response.data,
      message: 'Announcement submitted for review. It will be visible once approved by admin.'
    };
  } catch (error) {
    console.error('Error submitting announcement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get my submitted announcements (authenticated user)
export const getMyAnnouncements = async () => {
  try {
    const response = await apiCall('/api/announcements/my', { method: 'GET' });

    return {
      success: true,
      data: response.data || []
    };
  } catch (error) {
    console.error('Error fetching my announcements:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Update my announcement (authenticated user)
export const updateMyAnnouncement = async (announcementId, updateData) => {
  try {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    const response = await apiCall(`/api/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error updating announcement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete my announcement (authenticated user)
export const deleteMyAnnouncement = async (announcementId) => {
  try {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    const response = await apiCall(`/api/announcements/${announcementId}`, { 
      method: 'DELETE' 
    });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// ============== ADMIN ANNOUNCEMENT FUNCTIONS ==============

// Get all announcements for admin (including inactive/pending ones)
export const getAllAnnouncementsAdmin = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.active !== undefined) queryParams.append('active', filters.active);
    if (filters.userId) queryParams.append('userId', filters.userId);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.order) queryParams.append('order', filters.order);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/announcements${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiCall(endpoint, { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      announcements: response.data || [],
      total: response.total || 0,
      pagination: response.pagination || {},
      message: `Found ${response.total || 0} announcements`
    };
  } catch (error) {
    console.error('Error fetching announcements (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get pending announcements waiting for approval (admin)
export const getPendingAnnouncementsAdmin = async () => {
  try {
    const response = await apiCall('/admin/announcements/pending', { method: 'GET' });

    return {
      success: true,
      data: response.data || [],
      announcements: response.data || [],
      message: `Found ${response.data?.length || 0} pending announcements`
    };
  } catch (error) {
    console.error('Error fetching pending announcements (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Approve/activate announcement (admin) - Makes it visible to public users
export const approveAnnouncementAdmin = async (announcementId, approve = true) => {
  try {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    const response = await apiCall(`/admin/announcements/${announcementId}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ 
        active: approve,
        status: approve ? 'approved' : 'rejected'
      })
    });

    return {
      success: true,
      data: response.data,
      message: approve ? 'Announcement approved and is now visible to public' : 'Announcement rejected'
    };
  } catch (error) {
    console.error('Error approving announcement (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Toggle announcement visibility (admin)
export const toggleAnnouncementVisibilityAdmin = async (announcementId, makeActive) => {
  try {
    if (!announcementId) {
      throw new Error('Announcement ID is required');
    }

    const response = await apiCall(`/admin/announcements/${announcementId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({ active: makeActive })
    });

    return {
      success: true,
      data: response.data,
      message: makeActive ? 'Announcement is now visible to public' : 'Announcement is now hidden from public'
    };
  } catch (error) {
    console.error('Error toggling announcement visibility (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get announcement statistics (admin)
export const getAnnouncementStatsAdmin = async () => {
  try {
    const response = await apiCall('/admin/announcements/stats', { method: 'GET' });

    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching announcement stats (admin):', error);
    return {
      success: false,
      error: error.message
    };
  }
};
