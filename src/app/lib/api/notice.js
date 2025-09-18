// api/notice.js - Notice management API functions
import { apiCall } from './base.js';

// ============== ADMIN NOTICE MANAGEMENT ==============

// Get all notices (both active and inactive) for admin use
export const getAllNotices = async () => {
  try {
    const response = await apiCall('/admin/notice');
    
    // Handle the response structure - backend returns {success: true, data: [...]}
    const noticesArray = response.data || response || [];
    
    return {
      success: true,
      data: Array.isArray(noticesArray) ? noticesArray : [],
      notices: Array.isArray(noticesArray) ? noticesArray : [],
      message: response.message || `Found ${Array.isArray(noticesArray) ? noticesArray.length : 0} notices`
    };
  } catch (error) {
    console.warn('Admin notices endpoint not available, using fallback:', error.message);
    
    // Return demo/fallback notices for development when backend is not available
    const fallbackNotices = [
      {
        id: 1,
        heading: 'System Maintenance',
        body: 'Scheduled maintenance this weekend. Some features may be temporarily unavailable.',
        priority: 'high',
        active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        users: { name: 'Admin', email: 'admin@example.com' }
      },
      {
        id: 2,
        heading: 'New Feature Available',
        body: 'Check out our new resource sharing feature in the Resources section.',
        priority: 'normal',
        active: true,
        created_at: '2024-01-02T00:00:00Z',
        updated_at: '2024-01-02T00:00:00Z',
        users: { name: 'Admin', email: 'admin@example.com' }
      },
      {
        id: 3,
        heading: 'Pending Notice',
        body: 'This notice is awaiting approval before going live.',
        priority: 'low',
        active: false,
        created_at: '2024-01-03T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        users: { name: 'Staff Member', email: 'staff@example.com' }
      }
    ];
    
    return { 
      success: true, 
      notices: fallbackNotices,
      message: 'Using demo notices (backend not available)' 
    };
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

// ============== ADMIN NOTICE CRUD OPERATIONS ==============

// Create a new notice (admin only)
export const createNotice = async (noticeData) => {
  try {
    // Ensure required fields are set
    const payload = {
      user_id: noticeData.user_id, // Admin can specify any user, or use their own ID
      heading: noticeData.heading,
      body: noticeData.body,
      priority: noticeData.priority || 'normal',
      active: noticeData.active !== undefined ? noticeData.active : true
    };

    const response = await apiCall('/admin/notice', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data: response.data,
      notice: response.data,
      message: response.message || 'Notice created successfully'
    };
  } catch (error) {
    console.warn('Create notice endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to create notice' 
    };
  }
};

// Update an existing notice (admin only)
export const updateNotice = async (noticeId, updates) => {
  try {
    // Prepare update payload matching backend schema
    const payload = {
      heading: updates.heading,
      body: updates.body,
      priority: updates.priority || 'normal',
      active: updates.active !== undefined ? updates.active : true
    };

    const response = await apiCall(`/admin/notice/${noticeId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data: response.data,
      notice: response.data,
      message: response.message || 'Notice updated successfully'
    };
  } catch (error) {
    console.warn('Update notice endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to update notice' 
    };
  }
};

// Delete a notice (admin only)
export const deleteNotice = async (noticeId) => {
  try {
    const response = await apiCall(`/admin/notice/${noticeId}`, {
      method: 'DELETE',
    });

    return {
      success: true,
      data: response.data,
      message: response.message || 'Notice deleted successfully'
    };
  } catch (error) {
    console.warn('Delete notice endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to delete notice' 
    };
  }
};