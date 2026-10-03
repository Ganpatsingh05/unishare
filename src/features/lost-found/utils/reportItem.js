// Report form: initial state, validation and the payload for
// POST /api/lostfound/create (see services/lostFound.service createLostFoundItem).

export const PHOTO_LIMITS = { max: 5, mb: 5, accept: "image/jpeg,image/png,image/webp" };
export const LIMITS = { name: 80, description: 1000, place: 120 };

export function dayKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function yesterdayKey(now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

export const initialReport = (mode = "lost", email = "") => ({
  mode,
  name: "",
  description: "",
  place: "",
  date: dayKey(),
  time: "",
  mobile: "",
  email,
  instagram: "",
});

const MOBILE = /^(\+?91[\s-]?)?[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INSTAGRAM = /^@?[a-zA-Z0-9._]{1,30}$/;

/** Field errors (keys match the form); empty object when valid. */
export function validateReport(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "name";
  if (!form.description.trim()) errors.description = "description";
  if (!form.place.trim()) errors.place = "place";
  if (!form.date || form.date > dayKey()) errors.date = "date";
  const mobile = form.mobile.replace(/[\s-]/g, "");
  if (mobile && !MOBILE.test(mobile)) errors.mobile = "mobile";
  if (form.email.trim() && !EMAIL.test(form.email.trim())) errors.email = "email";
  if (form.instagram.trim() && !INSTAGRAM.test(form.instagram.trim())) errors.instagram = "instagram";
  if (!mobile && !form.email.trim() && !form.instagram.trim()) errors.contact = "contact";
  return errors;
}

/** Which parts of the form are complete, for the readiness meter. */
export function readiness(form, photos) {
  const e = validateReport(form);
  return {
    what: !e.name && !e.description,
    where: !e.place && !e.date,
    photos: photos.length > 0,
    contact: !e.contact && !e.mobile && !e.email && !e.instagram,
  };
}

/** Item data in the shape createLostFoundItem expects. */
export function toItemData(form) {
  const lost = form.mode === "lost";
  const contact = {};
  const mobile = form.mobile.replace(/[\s-]/g, "");
  if (mobile) contact.mobile = mobile;
  if (form.email.trim()) contact.email = form.email.trim();
  if (form.instagram.trim()) contact.instagram = form.instagram.trim().replace(/^@/, "");
  return {
    itemName: form.name.trim(),
    description: form.description.trim(),
    mode: form.mode,
    where_last_seen: lost ? form.place.trim() : null,
    where_found: lost ? null : form.place.trim(),
    date_lost: lost ? form.date : null,
    date_found: lost ? null : form.date,
    time_lost: lost && form.time ? form.time : null,
    time_found: !lost && form.time ? form.time : null,
    contact_info: contact,
  };
}
