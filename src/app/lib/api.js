// lib/api.js - Main API entry point (distributed system)
// This file maintains backward compatibility while using the new modular structure

// Re-export all base utilities
export { apiCall, apiCallFormData, BACKEND_URL } from './api/base.js';

// Re-export all authentication functions
export {
  fetchCurrentUser,
  checkAuthStatus,
  logout,
  checkAdminStatus,
  startGoogleLogin
} from './api/auth.js';

// Re-export all profile functions  
export {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
  deleteUserAvatar,
  getUserStats,
  getUserDashboard,
  fetchPublicProfile
} from './api/profile.js';

// Re-export all housing functions
export {
  fetchhousedata,
  fetchMyRooms,
  postRoom,
  updateRoom,
  deleteRoom,
  fetchRoom,
  uploadRoomImages,
  validateRoomData
} from './api/housing.js';

// Re-export all marketplace functions
export {
  fetchMarketplaceItems,
  fetchMyItems,
  createItem,
  updateItem,
  deleteItem,
  fetchItem,
  uploadItemImage,
  deleteItemImage,
  validateItemData
} from './api/marketplace.js';

// Re-export all ride sharing functions
export {
  fetchRides,
  createRide,
  getMyRides,
  updateRide,
  deleteRide,
  requestRideJoin,
  getRideRequests,
  respondToRideRequest,
  getRideById,
  getRideStats,
  validateRideData
} from './api/rideSharing.js';

// Re-export all ticket functions
export {
  fetchTickets,
  fetchMyTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  fetchTicket
} from './api/tickets.js';

// Re-export all lost & found functions
export {
  fetchLostFoundItems,
  fetchMyLostFoundItems,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  fetchLostFoundItem,
  contactLostFoundItem,
  getLostFoundStats
} from './api/lostFound.js';

// Re-export all announcement functions
export {
  createSystemAnnouncement,
  getSystemAnnouncements,
  updateSystemAnnouncement,
  deleteSystemAnnouncement
} from './api/announcements.js';

// Re-export all notice functions
export {
  getAllNotices,
  getPublicNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getNoticesForNoticeBar
} from './api/notice.js';

// Re-export all utility functions
export {
  fetchUserDashboardData,
  formatContactInfo,
  parseContactInfo,
  formatDate,
  getTimeSince,
  validateImageFile
} from './api/utils.js';

// Re-export all admin functions
export {
  getAdminDashboardStats,
  getAdminUsers,
  updateUserRole,
  updateUserStatus,
  suspendUser,
  deleteUser,
  bulkUserAction,
  getAdminAnalytics,
  getAdminReports,
  updateReportStatus,
  getAdminRecentActivity,
  dismissReport,
  bulkModerationAction,
  getContentForModeration,
  moderateContent,
  deleteContent,
  restoreContent,
  getSystemLogs,
  getSystemHealth,
  getSystemSettings,
  createDataBackup,
  getBackupHistory,
  downloadBackup,
  exportData,
  sendAdminNotification
} from './api/admin.js';