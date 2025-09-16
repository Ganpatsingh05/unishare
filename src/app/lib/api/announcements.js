// api/announcements.js - Announcements related API functions
import { apiCall } from './base.js';

// ============== SYSTEM ANNOUNCEMENTS ==============

export const createSystemAnnouncement = async (announcement) => {
  try {
    return await apiCall('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    });
  } catch (error) {
    console.warn('Create announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: 'Announcements feature not yet implemented' 
    };
  }
};

export const getSystemAnnouncements = async () => {
  try {
    const data = await apiCall('/admin/announcements');
    
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
        message: `Found ${announcements.length} announcements`
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
    return await apiCall(`/admin/announcements/${announcementId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  } catch (error) {
    console.warn('Update announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: 'Announcements feature not yet implemented' 
    };
  }
};

export const deleteSystemAnnouncement = async (announcementId) => {
  try {
    return await apiCall(`/admin/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.warn('Delete announcement endpoint not available:', error.message);
    return { 
      success: false, 
      error: 'Announcements feature not yet implemented' 
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