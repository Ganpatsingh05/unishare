// api/notice.js - Notice management API functions
import { apiCall } from './base.js';

// ============== NOTICE MANAGEMENT ==============

// Get all notices (admin only)
export const getAllNotices = async () => {
  try {
    const data = await apiCall('/api/notice/admin');
    console.log('Fetched all notices:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all notices:', error);
    throw error;
  }
};

// Get active notices for public display
export const getPublicNotices = async () => {
  // Use the proper public endpoint first, then fallback options
  const endpoints = ['/api/notice', '/api/notices/public', '/api/notices'];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Trying notices endpoint: ${endpoint}`);
      const data = await apiCall(endpoint);
      console.log(`✅ Success from ${endpoint}:`, data);
      
      if (data.success && data.notices && Array.isArray(data.notices)) {
        // The /api/notice endpoint already returns only active notices
        // No need to filter further for the primary endpoint
        const notices = endpoint === '/api/notice' 
          ? data.notices 
          : data.notices.filter(notice => notice.active !== false);
        
        return {
          success: true,
          notices: notices,
          message: `Found ${notices.length} active notices from ${endpoint}`,
          source: endpoint,
          timestamp: data.timestamp
        };
      }
      
      // Handle different data structures from fallback endpoints
      if (data.success && data.data && Array.isArray(data.data)) {
        const activeNotices = data.data.filter(notice => notice.active !== false);
        return {
          success: true,
          notices: activeNotices,
          message: `Found ${activeNotices.length} active notices from ${endpoint}`,
          source: endpoint
        };
      }
      
    } catch (error) {
      console.warn(`❌ ${endpoint} failed:`, error.message);
      continue; // Try next endpoint
    }
  }
  
  // All endpoints failed
  console.warn('📢 All notice endpoints failed, using empty result');
  return { 
    success: true, 
    notices: [],
    message: 'No notice endpoints available',
    source: 'fallback'
  };
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
    
    const data = await apiCall('/api/notice/admin', {
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
    
    const data = await apiCall(`/api/notice/admin/${noticeId}`, {
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
    const data = await apiCall(`/api/notice/admin/${noticeId}`, {
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
  const CACHE_KEY = 'unishare_notices_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  // Try to get from cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        console.log('📢 Using cached notices');
        return data;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }
  
  try {
    const response = await getPublicNotices();
    console.log('📢 getNoticesForNoticeBar response:', response);
    
    if (response.success && response.notices && response.notices.length > 0) {
      // Transform notices to match NoticeBar expected format
      // Handle the specific structure from /api/notice endpoint
      const notices = response.notices.map(notice => ({
        id: notice.id,
        title: notice.heading || notice.title, // /api/notice returns 'heading'
        body: notice.body || notice.message,
        priority: notice.priority || 'normal',
        category: notice.category || 'general',
        link: notice.link || null,
        expires: notice.expires || null,
        active: notice.active !== false, // Public endpoint only returns active notices
        createdAt: notice.created_at || notice.createdAt,
        updatedAt: notice.updated_at || notice.updatedAt
      }));
      
      const result = {
        success: true,
        announcements: notices,
        data: notices,
        message: `Found ${notices.length} active notices`,
        source: response.source,
        timestamp: response.timestamp
      };
      
      // Cache the successful result
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      } catch (e) {
        // Ignore cache errors
      }
      
      return result;
    }
    
    // No notices found - return empty but valid response
    const emptyResult = {
      success: true,
      announcements: [],
      data: [],
      message: response.message || 'No notices available',
      source: response.source || 'api'
    };
    
    return emptyResult;
    
  } catch (error) {
    console.error('📢 Error getting notices for notice bar:', error);
    return { 
      success: true, 
      announcements: [],
      data: [],
      message: 'Notice system temporarily unavailable',
      source: 'error'
    };
  }
};