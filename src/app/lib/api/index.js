/**
 * UniShare API - Centralized API exports
 * 
 * Structure:
 * - core: HTTP client and configuration
 * - services: Feature-specific API services
 *   - auth: Authentication
 *   - rides: Ride sharing
 *   - housing: Housing/rooms
 *   - marketplace: Buy/sell items
 *   - community: Announcements, lost & found, tickets, notices
 *   - user: User profile and contacts
 *   - admin: Admin panel
 * - shared: Cross-cutting utilities (notifications, requests, utils)
 */

// Core
export { apiCall, API_CONFIG } from './core/client.js';
export { default as config } from './core/config.js';

// Auth Service
export {
  fetchCurrentUser,
  loginWithEmail,
  registerWithEmail,
  startGoogleLogin,
  startGithubLogin,
  logout
} from './services/auth/index.js';

// Rides Service
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
  // Mapper utilities
  mapToBackendRide,
  mapToFrontendRide,
  formatRideDateTime,
  getRideStatusInfo
} from './services/rides/index.js';

// Housing Service
export {
  fetchHousingListings,
  createHousingListing,
  updateHousingListing,
  deleteHousingListing,
  getMyHousingListings,
  getHousingById,
  // Rooms
  fetchRooms,
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,
  getMyRooms,
  searchRooms
} from './services/housing/index.js';

// Marketplace Service
export {
  fetchMarketplaceItems,
  createMarketplaceItem,
  updateMarketplaceItem,
  deleteMarketplaceItem,
  getMyMarketplaceItems,
  getMarketplaceItemById,
  searchMarketplaceItems
} from './services/marketplace/index.js';

// Community Service
export {
  // Lost & Found
  fetchLostFoundItems,
  createLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  getMyLostFoundItems,
  getLostFoundItemById,
  // Tickets
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  getMyTickets,
  getTicketById,
  // Notices
  fetchNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getNoticeById,
  // Announcements
  fetchAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getAnnouncementById
} from './services/community/index.js';

// User Service
export {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  updateUserSettings,
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById,
  getUserProfileById,
  getUserActivity,
  getUserStats
} from './services/user/index.js';

// Admin Service
export {
  fetchAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  fetchSystemStats,
  fetchAuditLogs,
  moderateContent
} from './services/admin/index.js';

// Shared Utilities
export {
  // Utils
  formatDate,
  formatPrice,
  handleApiError,
  // Notifications
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  // Resources
  fetchResources,
  uploadResource,
  deleteResource,
  // Requests
  UniversalRequestAPI,
  roomsAPI,
  marketplaceAPI,
  lostFoundAPI,
  ticketsAPI,
  ridesAPI,
  getAllRequestCounts
} from './shared/index.js';

// Re-export getUserActivity from shared/utils (backward compatibility)
export { getUserActivity } from './shared/utils.js';
