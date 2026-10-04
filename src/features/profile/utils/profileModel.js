// Profile shape, completeness, and the cross-feature activity feed.

export const LIMITS = { name: 100, bio: 500, campus: 100, handle: 20 };
export const HANDLE_RE = /^[a-zA-Z0-9_]{3,20}$/;
const DAY = 86400000;

/** Merge the stored profile (GET /api/profile) with the auth user as fallbacks. */
export function normalizeProfile(raw = {}, user = {}) {
  const handle = (raw.custom_user_id || "").replace(/^@/, "");
  return {
    name: (raw.display_name || user.name || "").trim(),
    handle,
    bio: (raw.bio || "").trim(),
    campus: (raw.campus_name || "").trim(),
    phone: (raw.phone_number || "").trim(),
    photo: raw.profile_image_url || user.picture || user.avatar || null,
    hasOwnPhoto: Boolean(raw.profile_image_url),
    email: user.email || "",
    memberSince: raw.created_at ? new Date(raw.created_at) : user.created_at ? new Date(user.created_at) : null,
  };
}

export const initialsOf = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "U";

export const COMPLETENESS = ["photo", "name", "handle", "campus", "bio", "phone"];
export function completeness(p) {
  const done = { photo: Boolean(p.photo), name: Boolean(p.name), handle: Boolean(p.handle), campus: Boolean(p.campus), bio: Boolean(p.bio), phone: Boolean(p.phone) };
  const pct = Math.round((COMPLETENESS.filter((k) => done[k]).length / COMPLETENESS.length) * 100);
  return { done, pct };
}

/** The body POST /api/profile expects. It replaces every field, so send them all. */
export function toProfilePayload(form) {
  return {
    display_name: form.name.trim(),
    bio: form.bio.trim(),
    custom_user_id: form.handle ? `@${form.handle}` : "",
    phone: form.phone.trim(),
    campus_name: form.campus.trim(),
  };
}

export function passUrl(handle) {
  if (!handle || typeof window === "undefined") return "";
  return `${window.location.origin}/u/${encodeURIComponent(handle)}`;
}

export function ageText(date, strings, now = new Date()) {
  if (!date) return "";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / DAY);
  if (days <= 0) return strings.today;
  if (days === 1) return strings.yesterday;
  return strings.days(days);
}
