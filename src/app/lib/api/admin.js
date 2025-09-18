// api/admin.js - Admin panel related API functions
import { apiCall } from './base.js';

// ===== ADMIN FUNCTIONS =====

// Admin Dashboard Stats
export const getAdminDashboardStats = async () => {
  return apiCall('/admin/dashboard/stats');
};

// Admin User Management  
export const getAdminUsers = async (filters = {}) => {
  try {
    // Use your actual backend endpoint
    const data = await apiCall('/admin/users');
    console.log('Admin users data from backend:', data);
    
    // Your backend returns { success: true, users: [...], message: "..." }
    if (data.success) {
      return {
        success: true,
        users: data.users || [],
        message: data.message,
        requestedBy: data.requestedBy,
        timestamp: data.timestamp
      };
    }
    
    throw new Error(data.message || 'Failed to fetch admin users');
  } catch (error) {
    console.error('Error fetching admin users:', error);
    // Handle authentication errors
    if (error.message.includes('401') || error.message.includes('Authentication required')) {
      throw new Error('Authentication required for admin access');
    }
    if (error.message.includes('403') || error.message.includes('Access denied')) {
      throw new Error('Access denied. Super user privileges required.');
    }
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  return apiCall(`/admin/users/${userId}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
};

export const updateUserStatus = async (userId, status) => {
  return apiCall(`/admin/users/${userId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

export const suspendUser = async (userId, duration, reason) => {
  return apiCall(`/admin/users/${userId}/suspend`, {
    method: 'POST',
    body: JSON.stringify({ duration, reason }),
  });
};

export const deleteUser = async (userId) => {
  return apiCall(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
};

export const bulkUserAction = async (userIds, action, data = {}) => {
  return apiCall('/admin/users/bulk-action', {
    method: 'POST',
    body: JSON.stringify({ userIds, action, data }),
  });
};

// Admin Analytics - Updated to match backend API
export const getAdminAnalytics = async () => {
  try {
    const data = await apiCall('/admin/analytics');
    console.log('Admin analytics data from backend:', data);
    
    if (data.success) {
      return {
        success: true,
        analytics: data,
        overview: data.overview,
        userStats: data.userStats,
        contentStats: data.contentStats,
        systemStats: data.systemStats
      };
    }
    
    throw new Error(data.message || 'Failed to fetch admin analytics');
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    if (error.message.includes('401') || error.message.includes('Authentication required')) {
      throw new Error('Authentication required for admin access');
    }
    if (error.message.includes('403') || error.message.includes('Access denied')) {
      throw new Error('Access denied. Super user privileges required.');
    }
    throw error;
  }
};

// Admin Content Moderation - Updated to match backend API
export const getAdminReports = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
    if (filters.limit) queryParams.append('limit', filters.limit);
    if (filters.offset) queryParams.append('offset', filters.offset);

    const endpoint = `/admin/reports${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const data = await apiCall(endpoint);
    
    console.log('Admin reports data from backend:', data);
    
    if (data.success) {
      return {
        success: true,
        reports: data.reports || [],
        total: data.total || 0,
        stats: data.stats || {}
      };
    }
    
    throw new Error(data.message || 'Failed to fetch admin reports');
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    throw error;
  }
};

export const updateReportStatus = async (reportId, status, action, notes) => {
  try {
    const data = await apiCall(`/admin/reports/${reportId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status,
        action,
        notes,
        resolvedAt: new Date().toISOString()
      }),
    });
    return data;
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
};

// Get recent activity using real-time backend endpoint
export const getAdminRecentActivity = async (limit = 10) => {
  try {
    const data = await apiCall(`/admin/activity?limit=${limit}`);
    console.log('Admin recent activity from backend:', data);
    
    if (data.success) {
      // Transform backend activity data to match frontend expectations
      const transformedActivities = (data.activities || []).map(activity => ({
        id: activity.id,
        type: activity.type,
        action: activity.action,
        user: activity.user,
        time: activity.time,
        icon: activity.icon,
        color: activity.color,
        details: activity.details
      }));

      return {
        success: true,
        activities: transformedActivities
      };
    }
    
    throw new Error(data.message || 'Failed to fetch recent activity');
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    
    // Return mock data as fallback
    return {
      success: true,
      activities: [
        {
          id: 'mock-1',
          type: 'user_registration',
          description: 'New user registered',
          user: { name: 'System', email: 'system@unishare.com' },
          timestamp: new Date().toISOString(),
          metadata: { userCount: '150+' }
        },
        {
          id: 'mock-2', 
          type: 'room_posted',
          description: 'New room listing posted',
          user: { name: 'User', email: 'user@example.com' },
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          metadata: { location: 'Campus Area' }
        },
        {
          id: 'mock-3',
          type: 'item_sold',
          description: 'Item marked as sold',
          user: { name: 'Seller', email: 'seller@example.com' },
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          metadata: { category: 'Electronics' }
        }
      ],
      summary: {
        totalActivities: 3,
        timeframe: `Last ${limit} activities`
      }
    };
  }
};

export const dismissReport = async (reportId, reason) => {
  return apiCall(`/admin/reports/${reportId}/dismiss`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

export const bulkModerationAction = async (reportIds, action, data = {}) => {
  return apiCall('/admin/reports/bulk-action', {
    method: 'POST',
    body: JSON.stringify({ reportIds, action, data }),
  });
};

// Admin Content Management
export const getContentForModeration = async (category, status = 'pending') => {
  return apiCall(`/admin/content/${category}?status=${status}`);
};

export const moderateContent = async (contentId, action, reason) => {
  return apiCall(`/admin/content/${contentId}/moderate`, {
    method: 'POST',
    body: JSON.stringify({ action, reason }),
  });
};

export const deleteContent = async (contentId, contentType, reason) => {
  return apiCall(`/admin/content/${contentId}`, {
    method: 'DELETE',
    body: JSON.stringify({ contentType, reason }),
  });
};

export const restoreContent = async (contentId, reason) => {
  return apiCall(`/admin/content/${contentId}/restore`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

// Admin System Management
export const getSystemLogs = async (level = 'all', limit = 100) => {
  return apiCall(`/admin/system/logs?level=${level}&limit=${limit}`);
};

export const getSystemHealth = async () => {
  return apiCall('/admin/system/health');
};

export const getSystemSettings = async () => {
  return apiCall('/admin/system/settings');
};

// Admin Backup & Export
export const createDataBackup = async () => {
  return apiCall('/admin/backup/create', {
    method: 'POST',
  });
};

export const getBackupHistory = async () => {
  return apiCall('/admin/backup/history');
};

export const downloadBackup = async (backupId) => {
  return apiCall(`/admin/backup/${backupId}/download`, {
    method: 'GET',
  });
};

export const exportData = async (options = {}) => {
  return apiCall('/admin/export', {
    method: 'POST',
    body: JSON.stringify(options),
  });
};

// Admin Notifications
// Admin Notifications - flexible signature
// sendAdminNotification function has been moved to api/notifications.js

// Helper function to format time ago
const formatTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};