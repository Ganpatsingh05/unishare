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
  resetPassword
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
  fetchHousingListings,
  createHousingListing,
  updateHousingListing,
  deleteHousingListing,
  getMyHousingListings,
  getHousingById,
  fetchRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  searchRooms
} from './api/services/housing/index.js';

// Marketplace
export {
  fetchMarketplaceItems,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMyMarketplaceItems,
  getMarketplaceItemById,
  searchMarketplaceItems
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
  getUserDashboard,
  fetchPublicProfile,
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById,
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
  formatDate,
  formatPrice,
  handleApiError,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  fetchResources,
  uploadResource,
  deleteResource,
  UniversalRequestAPI,
  roomsAPI,
  marketplaceAPI,
  lostFoundAPI,
  ticketsAPI,
  ridesAPI,
  getAllRequestCounts
} from './api/shared/index.js';

// Backward compatibility - export getUserActivity from both locations
export { getUserActivity } from './api/shared/utils.js';
