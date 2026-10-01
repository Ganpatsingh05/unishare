// User Service - User profile and contacts management

// Profile
export {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePicture,
  updateUserSettings
} from './profile.service.js';

// Contacts
export {
  fetchContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById
} from './contacts.service.js';

// User Profile (extended)
export {
  getUserProfileById,
  getUserActivity,
  getUserStats
} from './userProfile.service.js';
