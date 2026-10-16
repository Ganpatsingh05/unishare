// User Profile API - the signed-in student's profile (Spring Boot backend).
//
// This is the only profile client. A second copy used to live in
// `lib/api/profile.js`, speaking the same endpoints with different field names,
// and the two quietly disagreed; that copy is gone.
//
// The backend contract, from UserController (`@RequestMapping("/api/user")`):
//
//   GET /api/user/me              → { success, user: UserResponse }
//   PUT /api/user/update/profile  → { success, message }   (multipart/form-data)
//
// UpdateUserProfileRequest accepts exactly three fields — `username`, `bio` and
// `universityName` — plus an optional `profileImage` part. UserResponse carries
// { id, username, email, roles, authProvider, active,
//   profile: { bio, profilePictureUrl, universityName, dateOfBirth } }.
//
// So there is no display name, no handle, no phone, no dateOfBirth write path,
// and no /api/profile/* routes at all. Nothing the backend cannot store is
// invented here: the profile UI edits username, campus (universityName), about
// (bio) and the photo, and this module sends exactly those.

import { apiCall, apiCallFormData, APIError } from '@lib/api/base.js';
import { normalizeUser } from '@lib/api/auth.js';

// ============== LIMITS (the backend's own) ==============
//
// users.username:        @Size(min = 3, max = 50) and ^[a-zA-Z0-9_]+$
// user_profiles.bio:     @Size(max = 500)
// user_profiles.university_name: @Size(max = 200)
export const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const USERNAME_MIN = 3;
export const USERNAME_MAX = 50;
export const BIO_MAX = 500;
export const CAMPUS_MAX = 200;
// Not a backend rule — the upload goes through Cloudinary, so this is our own
// guard against a phone photo of 40 MB.
export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// ============== VALIDATION (mirrors the backend) ==============

/** @returns {{valid: boolean, message: string}} */
export const validateUsername = (value) => {
  const username = String(value ?? '').trim();
  if (!username) return { valid: false, message: 'Pick a username.' };
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return {
      valid: false,
      message: `Username must be between ${USERNAME_MIN} and ${USERNAME_MAX} characters.`,
    };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers and underscores.' };
  }
  return { valid: true, message: '' };
};

/** @returns {{valid: boolean, message: string}} */
export const validateCampus = (value) => {
  const campus = String(value ?? '').trim();
  if (campus.length > CAMPUS_MAX) {
    return { valid: false, message: `Campus name cannot exceed ${CAMPUS_MAX} characters.` };
  }
  return { valid: true, message: '' };
};

/** @returns {{valid: boolean, message: string}} */
export const validateProfileImage = (file) => {
  if (!file) return { valid: true, message: '' };
  if (!IMAGE_TYPES.includes(file.type)) {
    return { valid: false, message: 'Photo must be a JPEG, PNG, WebP or GIF.' };
  }
  if (file.size > IMAGE_MAX_BYTES) {
    return { valid: false, message: 'Photo must be smaller than 5 MB.' };
  }
  return { valid: true, message: '' };
};

// ============== READ ==============

// GET /api/user/me
// Never cached: the profile editor reads this immediately after saving.
export const getCurrentUserProfile = async () => {
  const data = await apiCall('/api/user/me', { cache: false });

  if (!data?.success || !data.user) {
    return { success: false, message: data?.message || 'Could not load your profile.' };
  }

  const user = normalizeUser(data.user);

  return {
    success: true,
    data: {
      id: user.id,
      username: user.username || '',
      email: user.email || '',
      roles: user.roles,
      authProvider: user.authProvider,
      active: user.active,
      bio: user.bio || '',
      universityName: user.universityName || '',
      profilePictureUrl: user.picture || null,
      dateOfBirth: user.dateOfBirth || null,
      // Read aliases for the header and the legacy profile helpers, which still
      // ask for these names. `username` is the only name the backend has, so the
      // "display name" alias is that same value.
      display_name: user.username || '',
      profile_image_url: user.picture || null,
    },
  };
};

// ============== WRITE ==============

/**
 * Update the signed-in user's profile — PUT /api/user/update/profile.
 *
 * Sends only what the backend reads. A username the backend's rule rejects is
 * refused here, with a message the caller can show, instead of being dropped
 * from the request: dropping it used to report "Saved" while changing nothing.
 *
 * @param {{username?: string, bio?: string, universityName?: string}} profileData
 * @param {File|null} profileImage
 * @returns {Promise<{success: boolean, message: string}>}
 * @throws {APIError} validation failure (400) or backend failure
 */
export const updateUserProfile = async (profileData = {}, profileImage = null) => {
  const formData = new FormData();

  const username = String(profileData.username ?? '').trim();
  if (username) {
    const check = validateUsername(username);
    if (!check.valid) throw new APIError(check.message, 400);
    formData.append('username', username);
  }

  if (typeof profileData.bio === 'string') {
    const bio = profileData.bio.trim();
    if (bio.length > BIO_MAX) throw new APIError(`About you cannot exceed ${BIO_MAX} characters.`, 400);
    formData.append('bio', bio);
  }

  if (typeof profileData.universityName === 'string') {
    const campus = profileData.universityName.trim();
    const check = validateCampus(campus);
    if (!check.valid) throw new APIError(check.message, 400);
    formData.append('universityName', campus);
  }

  if (profileImage) {
    const check = validateProfileImage(profileImage);
    if (!check.valid) throw new APIError(check.message, 400);
    formData.append('profileImage', profileImage);
  }

  // A photo can't be removed: the backend only ever sets profilePictureUrl, and
  // there is no endpoint that clears it, so the editor offers no such control.
  return apiCallFormData('/api/user/update/profile', formData, { method: 'PUT' });
};

// ============== PUBLIC PASS (blocked on the backend) ==============

/**
 * A student's public pass, by username.
 *
 * NOT IMPLEMENTED: the backend has no /api/profile/* route, so this call always
 * fails and the pass page shows its "no pass with that username" state. Kept so
 * the /u/[handle] route and the admin console still resolve; making it work
 * needs a new backend endpoint that returns the public fields only.
 */
export const getPublicUserProfile = async (username) => {
  const handle = String(username ?? '').replace(/^@/, '');
  return apiCall(`/api/profile/${encodeURIComponent(handle)}`);
};
