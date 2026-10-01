// User Service - User profile and contacts management

// Profile
export {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar as uploadProfilePicture,
  deleteUserAvatar,
  getUserStats
} from './profile.service.js';

// Contacts
export {
  getPublicContacts as fetchContacts,
  getAllContacts,
  createContact as addContact,
  updateContact,
  deleteContact
} from './contacts.service.js';

// User Profile (extended from userProfile.service)
export {
  getCurrentUserProfile,
  getPublicUserProfile,
  getPublicUserProfile as fetchPublicProfile,
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
  deleteProfileImage,
  useUsernameValidation,
  validateProfileDataEnhanced
} from './userProfile.service.js';
