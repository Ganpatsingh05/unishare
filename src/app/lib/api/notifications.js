// api/notifications.js - User and Admin notification management API functions
import { apiCall } from './base.js';
import { fetchCurrentUser } from './auth.js';

// ============== USER NOTIFICATION FUNCTIONS ==============

// Get user's notifications (authenticated users only)
export const getUserNotifications = async (options = {}) => {
  try {
    const { read, limit = 50 } = options;
    
    let queryParams = new URLSearchParams();
    if (read !== undefined) queryParams.append('read', read.toString());
    if (limit) queryParams.append('limit', limit.toString());
    
    const queryString = queryParams.toString();
    const endpoint = `/api/notifications${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(endpoint);
    
    return {
      success: true,
      data: response.data || response || [],
      notifications: response.data || response || [],
      message: response.message || `Found ${(response.data || response || []).length} notifications`
    };
  } catch (error) {
    console.warn('Get notifications endpoint not available:', error.message);
    
    // Return fallback notifications for development
    const fallbackNotifications = [
      {
        id: 1,
        title: 'Welcome to UniShare',
        message: 'Welcome to the UniShare platform! Explore features like ride sharing, marketplace, and more.',
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'System Update',
        message: 'System will be under maintenance tonight from 2-4 AM EST.',
        type: 'warning',
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      }
    ];
    
    return { 
      success: true,
      data: fallbackNotifications,
      notifications: fallbackNotifications,
      message: 'Using fallback notifications',
      source: 'fallback'
    };
  }
};

// Get count of unread notifications
export const getUnreadNotificationCount = async () => {
  try {
    const response = await apiCall('/api/notifications/unread-count');
    
    return {
      success: true,
      data: response.data,
      unreadCount: response.data?.unreadCount || 0,
      totalCount: response.data?.totalCount || 0,
      readCount: response.data?.readCount || 0,
      count: response.data?.unreadCount || 0, // Backward compatibility
      message: response.message || `${response.data?.unreadCount || 0} unread notifications`
    };
  } catch (error) {
    console.warn('Unread count endpoint not available:', error.message);
    return { 
      success: true,
      data: { unreadCount: 0, totalCount: 0, readCount: 0 },
      unreadCount: 0,
      totalCount: 0,
      readCount: 0,
      count: 0, // Backward compatibility
      message: 'No unread notifications',
      source: 'fallback'
    };
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiCall(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH'
    });
    
    return {
      success: true,
      data: response.data,
      notification: response.data,
      message: response.message || 'Notification marked as read'
    };
  } catch (error) {
    console.warn('Mark as read endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to mark notification as read' 
    };
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await apiCall('/api/notifications/mark-all-read', {
      method: 'PATCH'
    });
    
    return {
      success: true,
      data: response.data,
      count: response.data?.count || 0,
      message: response.message || `Marked ${response.data?.count || 0} notifications as read`
    };
  } catch (error) {
    console.warn('Mark all as read endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to mark all notifications as read' 
    };
  }
};

// Delete notification (user can only delete their own personal notifications)
export const deleteUserNotification = async (notificationId) => {
  try {
    const response = await apiCall(`/api/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Notification deleted successfully'
    };
  } catch (error) {
    console.warn('Delete notification endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to delete notification' 
    };
  }
};

// ============== PUBLIC NOTIFICATION FUNCTIONS (Requires User Authentication) ==============

// Mark notification as read (public route - requires user_id)
export const markNotificationAsReadPublic = async (notificationId) => {
  try {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const response = await apiCall(`/api/notifications/public/${notificationId}/read`, {
      method: 'PATCH',
      body: JSON.stringify({
        user_id: currentUser.id
      })
    });
    
    return {
      success: true,
      data: response.data,
      notification: response.data,
      message: response.message || 'Notification marked as read'
    };
  } catch (error) {
    console.warn('Public mark as read endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to mark notification as read' 
    };
  }
};

// Toggle notification read status (public route - requires user_id)
export const toggleNotificationReadStatusPublic = async (notificationId) => {
  try {
    const currentUser = await fetchCurrentUser();
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const response = await apiCall(`/api/notifications/public/${notificationId}/toggle`, {
      method: 'PATCH',
      body: JSON.stringify({
        user_id: currentUser.id
      })
    });
    
    return {
      success: true,
      data: response.data,
      notification: response.data,
      message: response.message || 'Notification read status toggled',
      previousStatus: response.previousStatus,
      newStatus: response.newStatus
    };
  } catch (error) {
    console.warn('Public toggle read status endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to toggle notification read status' 
    };
  }
};

// ============== ADMIN NOTIFICATION FUNCTIONS ==============

// Send notification to users (admin only)
export const sendAdminNotification = async (notificationData) => {
  try {
    // Ensure required fields are set
    const payload = {
      users: notificationData.users || ['SELF'], // Array of user emails or ['ALL', 'SELF']
      message: notificationData.message,
      type: notificationData.type || 'info', // 'info', 'success', 'warning', 'error'
      title: notificationData.title || null
    };

    const response = await apiCall('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      data: response.data,
      notifications: response.data,
      message: response.message || 'Notifications sent successfully',
      sentBy: response.sentBy,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.warn('Send notification endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to send notification' 
    };
  }
};

// Get all notifications (admin view)
export const getAllAdminNotifications = async (options = {}) => {
  try {
    const { limit = 100, type, recipient_type } = options;
    
    let queryParams = new URLSearchParams();
    if (limit) queryParams.append('limit', limit.toString());
    if (type && type !== 'all') queryParams.append('type', type);
    if (recipient_type && recipient_type !== 'all') queryParams.append('recipient_type', recipient_type);
    
    const queryString = queryParams.toString();
    const endpoint = `/admin/notifications${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiCall(endpoint);
    
    return {
      success: true,
      data: response.data || response || [],
      notifications: response.data || response || [],
      message: response.message || `Found ${(response.data || response || []).length} notifications`,
      requestedBy: response.requestedBy,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.warn('Admin notifications endpoint not available:', error.message);
    
    // Return fallback notifications for development
    const fallbackNotifications = [
      {
        id: 1,
        title: 'System Notification',
        message: 'Welcome to the admin notification system.',
        type: 'info',
        recipient_type: 'all',
        recipient_id: null,
        read: false,
        created_at: new Date().toISOString(),
        sender: { name: 'Admin', email: 'admin@example.com' }
      }
    ];
    
    return { 
      success: true,
      data: fallbackNotifications,
      notifications: fallbackNotifications,
      message: 'Using fallback admin notifications',
      source: 'fallback'
    };
  }
};

// Get specific notification (admin view)
export const getAdminNotification = async (notificationId) => {
  try {
    const response = await apiCall(`/admin/notifications/${notificationId}`);
    
    return {
      success: true,
      data: response.data,
      notification: response.data,
      message: 'Notification retrieved successfully',
      requestedBy: response.requestedBy,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.warn('Get admin notification endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to get notification' 
    };
  }
};

// Delete notification (admin only)
export const deleteAdminNotification = async (notificationId) => {
  try {
    const response = await apiCall(`/admin/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    
    return {
      success: true,
      data: response.data,
      message: response.message || 'Notification deleted successfully',
      deletedBy: response.deletedBy,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.warn('Delete admin notification endpoint not available:', error.message);
    return { 
      success: false, 
      error: error.message || 'Failed to delete notification' 
    };
  }
};

// Get notification statistics (admin only)
export const getNotificationStats = async () => {
  try {
    const response = await apiCall('/admin/notifications/stats');
    
    return {
      success: true,
      data: response.data,
      stats: response.data,
      message: response.message || 'Notification statistics retrieved successfully',
      requestedBy: response.requestedBy,
      timestamp: response.timestamp
    };
  } catch (error) {
    console.warn('Notification stats endpoint not available:', error.message);
    
    // Return fallback stats for development
    const fallbackStats = {
      total: 0,
      unread: 0,
      read: 0,
      byType: {
        info: 0,
        success: 0,
        warning: 0,
        error: 0
      }
    };
    
    return { 
      success: true,
      data: fallbackStats,
      stats: fallbackStats,
      message: 'Using fallback notification statistics',
      source: 'fallback'
    };
  }
};

// ============== HELPER FUNCTIONS ==============

// Helper function to get notifications for user display (combines user notifications with formatting)
export const getNotificationsForUser = async (options = {}) => {
  try {
    const result = await getUserNotifications(options);
    
    if (result.success && result.notifications) {
      // Transform notifications for consistent UI display
      const formattedNotifications = result.notifications.map(notification => ({
        id: notification.id,
        title: notification.title || 'Notification',
        message: notification.message || '',
        type: notification.type || 'info',
        read: notification.read === true,
        createdAt: notification.created_at,
        readAt: notification.read_at,
        // Additional formatting for UI
        timeAgo: notification.created_at ? getTimeAgo(notification.created_at) : '',
        priority: notification.type === 'error' ? 'high' : notification.type === 'warning' ? 'medium' : 'normal'
      }));
      
      return {
        ...result,
        data: formattedNotifications,
        notifications: formattedNotifications
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error getting formatted notifications:', error);
    return { success: false, error: error.message };
  }
};

// Helper function to calculate time ago
function getTimeAgo(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return '';
  }
}