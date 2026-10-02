// Validation, payload and draft helpers for the Post a ride page. Rules
// mirror unishare-backend routes/api/shareride.js (validateRideData), which
// stays the authority; these only give earlier, field-level feedback.

import dayjs from "dayjs";
import { RIDE_STRINGS } from "../constants/rideStrings";
import { SEAT_LIMITS } from "../constants/ridePlaces";

const e = RIDE_STRINGS.post.errors;

export const CONTACT_TYPES = ["mobile", "email", "instagram"];
export const FARE_STEP = 10;

/**
 * Keeps what the user types as a fare: digits with at most one decimal point
 * and two decimal places (paise). Minus signs and letters are dropped, so the
 * fare can never be negative.
 */
export function cleanFare(text) {
  const raw = String(text).replace(/[^\d.]/g, "");
  const [whole, ...rest] = raw.split(".");
  const intPart = whole.replace(/^0+(?=\d)/, "").slice(0, 9);
  return rest.length ? `${intPart || "0"}.${rest.join("").slice(0, 2)}` : intPart;
}

export const INITIAL_POST = {
  mode: "post",
  from: "",
  to: "",
  date: null,
  time: null,
  seats: 1,
  vehicle: "",
  price: "",
  description: "",
  contacts: { mobile: "", email: "", instagram: "" },
};

/** Departure as a dayjs, from the separate date and time pickers. */
export function departure(form) {
  if (!form.date || !form.time) return null;
  return form.date.hour(form.time.hour()).minute(form.time.minute()).second(0).millisecond(0);
}

const CONTACT_CHECKS = {
  mobile: (v) => /^(\+?91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "")),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  instagram: (v) => /^@?[A-Za-z0-9._]{1,30}$/.test(v),
};

export function validateContacts(contacts) {
  const errors = {};
  let filled = 0;
  for (const type of CONTACT_TYPES) {
    const value = (contacts[type] || "").trim();
    if (!value) continue;
    filled += 1;
    if (!CONTACT_CHECKS[type](value)) errors[type] = e[type];
  }
  if (!filled) errors.contacts = e.contact;
  return errors;
}

/** Errors for one step: "route", "ride" or "contact". */
export function validateStep(step, form, routeErrors = {}) {
  if (step === "route") {
    const errors = { ...routeErrors };
    const when = departure(form);
    if (!errors.when && when && !when.isAfter(dayjs())) errors.when = e.past;
    return errors;
  }
  if (step === "ride") {
    const errors = {};
    if (!form.vehicle.trim()) errors.vehicle = e.vehicle;
    const price = Number(form.price);
    if (!form.price || !Number.isFinite(price) || price <= 0) errors.price = e.fare;
    return errors;
  }
  return validateContacts(form.contacts);
}

/** Request body for createRide (services/rides.service.js). */
export function toCreatePayload(form, driverName) {
  const when = departure(form);
  return {
    from: form.from.trim(),
    to: form.to.trim(),
    date: when.format("YYYY-MM-DD"),
    time: when.format("HH:mm"),
    seats: Math.min(Math.max(Number(form.seats) || 1, SEAT_LIMITS.min), SEAT_LIMITS.maxPost),
    price: Number(form.price),
    vehicle: form.vehicle.trim(),
    description: form.description.trim(),
    contacts: CONTACT_TYPES.map((type) => ({ type, value: (form.contacts[type] || "").trim() })).filter((c) => c.value),
    driver: driverName,
  };
}

// The unfinished ride is kept in this browser only, without contact details.
const DRAFT_KEY = "unishare:post-ride-draft:v1";

export function saveDraft(form) {
  try {
    const { contacts, ...rest } = form; // eslint-disable-line no-unused-vars
    const data = {
      ...rest,
      date: form.date ? form.date.format("YYYY-MM-DD") : null,
      time: form.time ? form.time.format("HH:mm") : null,
    };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    // Storage can be unavailable (private mode); drafts are a convenience.
  }
}

export function loadDraft() {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const date = data.date ? dayjs(data.date) : null;
    const time = data.time ? dayjs(`2000-01-01T${data.time}`) : null;
    const draft = { ...INITIAL_POST, ...data, date: date && date.isValid() ? date : null, time: time && time.isValid() ? time : null, contacts: INITIAL_POST.contacts };
    // A draft dated in the past keeps its route but drops the date.
    if (draft.date && draft.date.isBefore(dayjs(), "day")) draft.date = null;
    const meaningful = draft.from || draft.to || draft.vehicle || draft.price || draft.description;
    return meaningful ? draft : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    window.localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
}
