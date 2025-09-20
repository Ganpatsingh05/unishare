// Profile utility functions

/**
 * Get the appropriate profile image URL with fallback logic
 * Priority: Custom profile image -> Google profile image -> null (for default avatar)
 * 
 * @param {Object} userProfile - User's profile data from the profile API
 * @param {Object} user - User's authentication data (may contain Google profile image)
 * @returns {string|null} - Profile image URL or null if no image available
 */
export const getProfileImageUrl = (userProfile, user) => {
  // Ensure inputs are objects, not error responses
  if (!userProfile || typeof userProfile !== 'object' || userProfile.message || userProfile.error_code) {
    userProfile = null;
  }
  if (!user || typeof user !== 'object' || user.message || user.error_code) {
    user = null;
  }

  // First priority: Custom profile image from user profile
  if (userProfile?.profile_image_url && typeof userProfile.profile_image_url === 'string') {
    return userProfile.profile_image_url;
  }
  
  // Second priority: Google profile image from user auth data
  if (user?.picture && typeof user.picture === 'string') {
    return user.picture;
  }
  if (user?.image && typeof user.image === 'string') {
    return user.image;
  }
  if (user?.avatar && typeof user.avatar === 'string') {
    return user.avatar;
  }
  
  // Third priority: Google profile image from nested structure
  if (user?.user?.picture && typeof user.user.picture === 'string') {
    return user.user.picture;
  }
  if (user?.user?.image && typeof user.user.image === 'string') {
    return user.user.image;
  }
  
  // No image available - will show default avatar
  return null;
};

/**
 * Get the appropriate display name with fallback logic
 * Priority: Custom display name -> Google display name -> Default name
 * 
 * @param {Object} userProfile - User's profile data from the profile API
 * @param {Object} user - User's authentication data
 * @returns {string} - Display name
 */
export const getDisplayName = (userProfile, user) => {
  // First priority: Custom display name from user profile
  if (userProfile?.display_name?.trim()) {
    return userProfile.display_name.trim();
  }
  
  // Second priority: Name from user auth data
  if (user?.name?.trim()) {
    return user.name.trim();
  }
  
  // Third priority: Display name from user auth data
  if (user?.displayName?.trim()) {
    return user.displayName.trim();
  }
  
  // Fourth priority: Email-based fallback
  if (user?.email) {
    const emailName = user.email.split('@')[0];
    return emailName.charAt(0).toUpperCase() + emailName.slice(1);
  }
  
  // Default fallback
  return 'UniShare User';
};

/**
 * Get user initials for avatar display
 * 
 * @param {string} displayName - User's display name
 * @returns {string} - User initials (1-2 characters)
 */
export const getUserInitials = (displayName) => {
  // Ensure displayName is a string
  if (!displayName || typeof displayName !== 'string') return 'U';
  
  const cleanName = displayName.trim();
  if (!cleanName) return 'U';
  
  const words = cleanName.split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Check if user has a custom profile (vs just Google auth data)
 * 
 * @param {Object} userProfile - User's profile data from the profile API
 * @returns {boolean} - True if user has customized their profile
 */
export const hasCustomProfile = (userProfile) => {
  if (!userProfile) return false;
  
  return !!(
    userProfile.display_name ||
    userProfile.bio ||
    userProfile.profile_image_url ||
    userProfile.custom_user_id
  );
};

/**
 * Format profile data for display components
 * 
 * @param {Object} userProfile - User's profile data from the profile API
 * @param {Object} user - User's authentication data
 * @returns {Object} - Formatted profile data for display
 */
export const formatProfileData = (userProfile, user) => {
  const profileImage = getProfileImageUrl(userProfile, user);
  const displayName = getDisplayName(userProfile, user);
  
  return {
    displayName,
    customUserId: userProfile?.custom_user_id || null,
    bio: userProfile?.bio || null,
    profileImage,
    userInitials: getUserInitials(displayName),
    hasCustomProfile: hasCustomProfile(userProfile),
    memberSince: userProfile?.created_at || user?.createdAt || user?.created_at,
    isGoogleImage: profileImage && !userProfile?.profile_image_url && !!(user?.picture || user?.image || user?.avatar)
  };
};