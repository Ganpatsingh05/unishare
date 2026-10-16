// Profile shape, completeness, and the pass link.
//
// The backend has exactly one name for a person — `users.username`, restricted to
// letters, numbers and underscores — plus a bio, a university name and a photo.
// This model carries those and nothing else, so no screen can promise a field the
// API cannot store.

// Mirrors the backend: users.username 3–50, user_profiles.bio 500,
// user_profiles.university_name 200.
export const LIMITS = { username: 50, bio: 500, campus: 200 };
export const USERNAME_RE = /^[a-zA-Z0-9_]{3,50}$/;
const DAY = 86400000;

/** Merge the stored profile (GET /api/user/me) with the auth user as fallbacks. */
export function normalizeProfile(raw = {}, user = {}) {
  return {
    username: (raw.username || raw.display_name || user.username || "").trim(),
    bio: (raw.bio || "").trim(),
    campus: (raw.universityName || raw.campus_name || "").trim(),
    photo: raw.profilePictureUrl || raw.profile_image_url || user.picture || user.avatar || null,
    email: user.email || "",
    memberSince: raw.created_at ? new Date(raw.created_at) : user.created_at ? new Date(user.created_at) : null,
  };
}

export const initialsOf = (value = "") =>
  String(value)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "U";

// Only fields the backend can actually store count towards a complete pass.
// It is also the list the pass shows, so 100% is reachable.
export const COMPLETENESS = ["photo", "username", "campus", "bio"];
export function completeness(p) {
  const done = {
    photo: Boolean(p.photo),
    username: Boolean(p.username),
    campus: Boolean(p.campus),
    bio: Boolean(p.bio),
  };
  const pct = Math.round((COMPLETENESS.filter((k) => done[k]).length / COMPLETENESS.length) * 100);
  return { done, pct };
}

/** The body PUT /api/user/update/profile expects. */
export function toProfilePayload(form) {
  return {
    username: form.username.trim(),
    bio: form.bio.trim(),
    universityName: form.campus.trim(),
  };
}

export function passUrl(username) {
  if (!username || typeof window === "undefined") return "";
  return `${window.location.origin}/u/${encodeURIComponent(username)}`;
}

export function ageText(date, strings, now = new Date()) {
  if (!date) return "";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / DAY);
  if (days <= 0) return strings.today;
  if (days === 1) return strings.yesterday;
  return strings.days(days);
}
