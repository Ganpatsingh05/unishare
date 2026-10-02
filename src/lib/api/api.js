// lib/api/api.js - Main API entry point (distributed system)
// This file maintains backward compatibility while using the new modular structure

// Re-export all base utilities
export { apiCall, apiCallFormData, BACKEND_URL } from "@lib/api/base.js";

// Re-export all authentication functions
export {
  fetchCurrentUser, checkAuthStatus, logout, checkAdminStatus,
  startGoogleLogin, loginWithEmail, registerWithEmail, requestPasswordReset
} from "@lib/api/auth.js";

// Re-export all profile functions  
export {
  fetchUserProfile, updateUserProfile, uploadUserAvatar, deleteUserAvatar,
  getUserStats, getUserDashboard, fetchPublicProfile
} from "@lib/api/profile.js";

// Re-export all housing functions
export {
  fetchRooms, fetchhousedata, fetchMyRooms, createRoom, postRoom,
  updateRoom, deleteRoom, fetchRoom, batchFetchRooms, getRoomStats,
  searchRoomsAdvanced, validateRoomData, prepareRoomFormData
} from "@features/housing/services/housing.service.js";

// Re-export all marketplace functions
export {
  fetchMarketplaceItems, fetchMyItems, createItem, updateItem,
  deleteItem, fetchItem, uploadItemImage, deleteItemImage, validateItemData
} from "@features/marketplace/services/marketplace.service.js";

// Re-export all ride sharing functions
export {
  fetchRides, createRide, getMyRides, updateRide, deleteRide,
  requestRideJoin, getRideRequests, respondToRideRequest, getRideById,
  getRideStats, validateRideData, getUserSentRequests
} from "@features/rides/services/rides.service.js";

// Re-export all ticket functions
export {
  fetchTickets, fetchMyTickets, createTicket, updateTicket,
  deleteTicket, fetchTicket
} from "@features/tickets/services/tickets.service.js";

// Re-export all lost & found functions
export {
  fetchLostFoundItems, fetchMyLostFoundItems, createLostFoundItem,
  updateLostFoundItem, deleteLostFoundItem, fetchLostFoundItem,
  contactLostFoundItem, getLostFoundStats
} from "@features/lost-found/services/lostFound.service.js";

// Re-export all announcement functions
export {
  createSystemAnnouncement, getSystemAnnouncements,
  updateSystemAnnouncement, deleteSystemAnnouncement
} from "@features/announcements/services/announcements.service.js";

// Re-export all notice functions
export {
  getAllNotices, getPublicNotices, createNotice, updateNotice,
  deleteNotice, getNoticesForNoticeBar
} from "@features/notice/services/notice.service.js";

// Re-export all notification functions
export {
  getUserNotifications, getUnreadNotificationCount, markNotificationAsRead,
  markAllNotificationsAsRead, deleteUserNotification, markNotificationAsReadPublic,
  toggleNotificationReadStatusPublic, sendAdminNotification, getAllAdminNotifications,
  getAdminNotification, deleteAdminNotification, getNotificationStats, getNotificationsForUser
} from "@lib/api/notifications.js"; // notifications might be global rather than a feature, I put it in lib/api earlier

// Re-export all utility functions
export {
  fetchUserDashboardData, formatContactInfo, parseContactInfo,
  formatDate, getTimeSince, validateImageFile
} from "@lib/api/utils.js";

// Re-export all admin functions
export {
  getAdminDashboardStats, getAdminUsers, updateUserRole, updateUserStatus,
  suspendUser, deleteUser, bulkUserAction, getAdminAnalytics, getAdminReports,
  updateReportStatus, getAdminRecentActivity, dismissReport, bulkModerationAction,
  getContentForModeration, moderateContent, deleteContent, restoreContent,
  getSystemLogs, getSystemHealth, getSystemSettings, createDataBackup,
  getBackupHistory, downloadBackup, exportData
} from "@features/admin/services/admin.service.js";
