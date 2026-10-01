// Shared utilities used across multiple services

// Utils
export {
  getUserActivity,
  formatDate,
  formatPrice,
  handleApiError
} from './utils.js';

// Notifications
export {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from './notifications.js';

// Resources
export {
  fetchResources,
  uploadResource,
  deleteResource
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
