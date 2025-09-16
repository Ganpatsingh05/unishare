// api/notice.js - Notice management API functions
import { apiCall } from './base.js';

// ============== NOTICE MANAGEMENT ==============

// Get all notices (admin only)
export const getAllNotices = async () => {
  try {
    const data = await apiCall('/admin/notice');
    console.log('Fetched all notices:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all notices:', error);
    throw error;
  }
};

// Get active notices for public display
export const getPublicNotices = async () => {
  try {
    // Use the same endpoint as admin but filter for active notices on frontend
    const data = await apiCall('/admin/notice');
    console.log('Fetched public notices:', data);
    
    if (data.success && data.notices) {
      // Filter only active notices for public display
      const activeNotices = data.notices.filter(notice => notice.active === true);
      
      return {
        success: true,
        notices: activeNotices,
        message: `Found ${activeNotices.length} active notices`
      };
    }
    
    return data;
  } catch (error) {
    console.warn('Notice endpoint not available yet:', error.message);
    // Return fallback for public notices when endpoint doesn't exist
    return { 
      success: true, 
      notices: [],
      message: 'Notice system not yet implemented' 
    };
  }
};

// Create new notice (admin only)
export const createNotice = async (notice) => {
  try {
    const noticeData = {
      heading: notice.heading || notice.title,
      body: notice.body || notice.content,
      active: notice.active !== false,
      priority: notice.priority || 'normal'
    };
    
    const data = await apiCall('/admin/notice', {
      method: 'POST',
      body: JSON.stringify(noticeData),
    });
    
    console.log('Created notice:', data);
    return data;
  } catch (error) {
    console.error('Error creating notice:', error);
    throw error;
  }
};

// Update existing notice (admin only)
export const updateNotice = async (noticeId, updates) => {
  try {
    const updateData = {};
    
    if (updates.heading !== undefined) updateData.heading = updates.heading;
    if (updates.title !== undefined) updateData.heading = updates.title;
    if (updates.body !== undefined) updateData.body = updates.body;
    if (updates.content !== undefined) updateData.body = updates.content;
    if (updates.active !== undefined) updateData.active = updates.active;
    if (updates.priority !== undefined) updateData.priority = updates.priority;
    
    const data = await apiCall(`/admin/notice/${noticeId}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    
    console.log('Updated notice:', data);
    return data;
  } catch (error) {
    console.error('Error updating notice:', error);
    throw error;
  }
};

// Delete notice (admin only)
export const deleteNotice = async (noticeId) => {
  try {
    const data = await apiCall(`/admin/notice/${noticeId}`, {
      method: 'DELETE',
    });
    
    console.log('Deleted notice:', data);
    return data;
  } catch (error) {
    console.error('Error deleting notice:', error);
    throw error;
  }
};

// Helper function to transform notices for NoticeBar component
export const getNoticesForNoticeBar = async () => {
  try {
    const response = await getPublicNotices();
    
    if (response.success && response.notices) {
      // Transform notices to match NoticeBar expected format
      const notices = response.notices.map(notice => ({
        id: notice.id,
        title: notice.heading || notice.title,
        body: notice.body || notice.message,
        priority: notice.priority || 'normal',
        category: notice.category || 'general',
        link: notice.link || null,
        expires: notice.expires || null,
        active: notice.active !== false, // Public endpoint only returns active notices
        createdAt: notice.created_at || notice.createdAt,
        updatedAt: notice.updated_at || notice.updatedAt
      }));
      
      return {
        success: true,
        announcements: notices, // Keep 'announcements' key for backward compatibility
        data: notices,
        message: `Found ${notices.length} active notices`
      };
    }
    
    return response;
  } catch (error) {
    console.error('Error getting notices for notice bar:', error);
    return { 
      success: true, 
      announcements: [],
      data: [],
      message: 'No notices available' 
    };
  }
};