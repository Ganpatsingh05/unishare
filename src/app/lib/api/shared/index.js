// Shared utilities used across multiple services

// Utils
export {
  fetchUserDashboardData,
  fetchUserDashboardData as getUserActivity,
  formatDate,
  getTimeSince,
  getTimeSince as formatPrice,
  formatContactInfo,
  parseContactInfo
} from './utils.js';

// Notifications
export {
  getUserNotifications,
  getUserNotifications as fetchNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendAdminNotification,
  getAllAdminNotifications,
  deleteAdminNotification,
  getNotificationStats
} from './notifications.js';

// Resources
export {
  getResources,
  getResources as fetchResources,
  getResourceCategories,
  getResource,
  getMyResources,
  submitResourceSuggestion,
  updateResource
} from './resources.js';

// Universal Requests System
export {
  UniversalRequestAPI,
  roomsAPI,
  marketplaceAPI,
  lostFoundAPI,
  ticketsAPI,
  ridesAPI,
  getAllRequestCounts
} from './requests.js';
