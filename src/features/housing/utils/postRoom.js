// Validation and request body for listing a room. The backend
// (unishare-backend routes/api/rooms.js validateRoomData) stays the authority;
// these rules only give earlier, field-level feedback.

import { HOUSING_STRINGS } from "../constants/housingStrings";

const e = HOUSING_STRINGS.post.errors;

export const PHOTO_LIMITS = { max: 10, mb: 5 };
export const DESCRIPTION_MAX = 1000;

export const INITIAL_ROOM = {
  title: "",
  location: "",
  rent: "",
  beds: 1,
  moveIn: "",
  description: "",
  mobile: "",
  email: "",
  instagram: "",
};

/** Digits only, no leading zeros, at most 7 digits. */
export const cleanRent = (text) => String(text).replace(/\D/g, "").replace(/^0+/, "").slice(0, 7);

/** "YYYY-MM-DD" in local time. */
export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function firstOfNextMonth(now = new Date()) {
  return dayKey(new Date(now.getFullYear(), now.getMonth() + 1, 1));
}

/** Errors keyed by field. */
export function validateRoom(form) {
  const errors = {};
  if (!form.title.trim()) errors.title = e.title;
  if (!form.location.trim()) errors.location = e.location;
  if (!(Number(form.rent) > 0)) errors.rent = e.rent;
  if (!(Number(form.beds) > 0)) errors.beds = e.beds;
  if (!form.moveIn || form.moveIn < dayKey()) errors.moveIn = e.moveIn;
  const mobile = form.mobile.trim();
  const email = form.email.trim();
  const instagram = form.instagram.trim();
  if (!mobile && !email && !instagram) errors.contact = e.contact;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = e.email;
  if (mobile && (!/^\+?[\d\s()-]+$/.test(mobile) || mobile.replace(/\D/g, "").length < 10)) errors.mobile = e.mobile;
  return errors;
}

/** Checklist shown beside the preview. */
export function readiness(form, photos) {
  return {
    photos: photos.length > 0,
    basics: Boolean(form.title.trim() && form.location.trim()),
    price: Number(form.rent) > 0 && Number(form.beds) > 0,
    date: Boolean(form.moveIn) && form.moveIn >= dayKey(),
    contact: Boolean(form.mobile.trim() || form.email.trim() || form.instagram.trim()),
  };
}

/** Multipart body for POST /api/rooms. Empty contact fields are left out. */
export function toFormData(form, photos) {
  const body = new FormData();
  body.append("title", form.title.trim());
  body.append("description", form.description.trim());
  body.append("rent", String(Number(form.rent)));
  body.append("location", form.location.trim());
  body.append("beds", String(form.beds));
  body.append("move_in_date", form.moveIn);
  const contact = {};
  for (const key of ["mobile", "email", "instagram"]) {
    const value = form[key].trim();
    if (value) contact[key] = value;
  }
  body.append("contact_info", JSON.stringify(contact));
  photos.forEach((photo) => body.append("photos", photo.file));
  return body;
}
