// lib/api.js - Main API entry point
// Centralized exports from the restructured API

// Core
export { apiCall, API_CONFIG } from './api/core/client.js';

// Auth
export {
  fetchCurrentUser,
  loginWithEmail,
  registerWithEmail,
  startGoogleLogin,
  startGithubLogin,
  logout,
  requestPasswordReset,
  resetPassword,
  checkAdminStatus,
  checkAuthStatus
} from './api/services/auth/index.js';

// Rides
export {
  fetchRides,
  createRide,
  getMyRides,
  updateRide,
  deleteRide,
  requestRideJoin,
  getRideRequests,
  getUserSentRequests,
  respondToRideRequest,
  getRideById,
  getRideStats,
  validateRideData,
  formatRideDateTime,
  getRideStatusInfo
} from './api/services/rides/index.js';

// Housing
export {
  fetchRooms,
  fetchHousingListings,
  fetchhousedata,
  fetchRoom,
  fetchMyRooms,
  getMyHousingListings,
  createRoom,
  createHousingListing,
  postRoom,
  deleteRoom
} from './api/services/housing/index.js';

// Marketplace
export {
  fetchMarketplaceItems,
  searchMarketplaceItems,
  fetchItem,
  getMarketplaceItemById,
  fetchMyItems,
  getMyMarketplaceItems,
  createItem,
  createMarketplaceItem,
  updateItem,
  updateMarketplaceItem,
  deleteItem,
  deleteMarketplaceItem
} from './api/services/marketplace/index.js';

// Community
export {
  fetchLostFoundItems,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  getMyLostFoundItems,
  getLostFoundItemById,
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  fetchMyTickets,
  getMyTickets,
  getTicketById,
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getNoticeById,
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementById
} from './api/services/community/index.js';

// User
export {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  deleteUserAvatar,
  getUserStats,
  fetchPublicProfile,
  fetchContacts,
  getAllContacts,
  addContact,
  updateContact,
  deleteContact,
  getCurrentUserProfile,
  getPublicUserProfile,
  validateCustomUserId,
  validateCampusName,
  validatePhoneNumber,
  validateProfileImage,
  validateDisplayName,
  validateBio,
  validateProfileData,
  checkUsernameAvailability,
  getUsernameSuggestions,
  searchUserProfiles,
  deleteProfileImage
} from './api/services/user/index.js';

// Admin
export {
  fetchAllUsers,
  getUserById as getAdminUserById,
  updateUserRole,
  deleteUser as deleteUserAdmin,
  fetchSystemStats,
  fetchAuditLogs,
  moderateContent
} from './api/services/admin/index.js';

// Shared
export {
  fetchUserDashboardData,
  getUserActivity,
  formatDate,
  getTimeSince,
  formatPrice,
  formatContactInfo,
  parseContactInfo,
  getUserNotifications,
  fetchNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendAdminNotification,
  getAllAdminNotifications,
  deleteAdminNotification,
  getNotificationStats,
  getResources,
  fetchResources,
  getResourceCategories,
  getResource,
  getMyResources,
  submitResourceSuggestion,
  updateResource,
  UniversalRequestAPI,
  roomsAPI,
  marketplaceAPI,
  lostFoundAPI,
  ticketsAPI,
  ridesAPI,
  getAllRequestCounts
} from './api/shared/index.js';
