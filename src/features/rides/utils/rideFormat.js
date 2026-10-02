import { formatDate, getTimeSince } from "@lib/api/utils.js";
import { RIDE_STRINGS } from "../constants/rideStrings";

const LOCALE = "en-IN";

const rupee = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const clock = new Intl.DateTimeFormat(LOCALE, { hour: "numeric", minute: "2-digit", hour12: true });

/** "₹120". Returns an em dash for missing values. */
export function formatRupee(value) {
  const n = Number(value);
  return Number.isFinite(n) ? rupee.format(n) : "—";
}

/** Local Date from backend "YYYY-MM-DD" and "HH:MM[:SS]" (no UTC shift). */
export function parseRideDateTime(date, time = "00:00") {
  if (!date) return null;
  const [y, m, d] = date.split("-").map(Number);
  const [hh = 0, mm = 0] = String(time || "00:00").split(":").map(Number);
  const result = new Date(y, (m || 1) - 1, d || 1, hh, mm);
  return Number.isNaN(result.getTime()) ? null : result;
}

/** "9:30 am" */
export function formatRideTime(date, time) {
  const value = parseRideDateTime(date, time);
  return value ? clock.format(value) : "";
}

function startOfDay(value) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function dayOffset(date, now = new Date()) {
  const value = parseRideDateTime(date);
  if (!value) return null;
  return Math.round((startOfDay(value) - startOfDay(now)) / 86400000);
}

/** "Today", "Tomorrow" or "12 Oct" using the app's formatDate. */
export function formatRideDay(date) {
  const offset = dayOffset(date);
  if (offset === 0) return RIDE_STRINGS.recent.filters.today;
  if (offset === 1) return RIDE_STRINGS.recent.filters.tomorrow;
  return formatDate(date, { year: undefined });
}

/** @returns {"past"|"today"|"tomorrow"|"week"|"later"} */
export function dayBucket(date) {
  const offset = dayOffset(date);
  if (offset === null || offset < 0) return "past";
  if (offset === 0) return "today";
  if (offset === 1) return "tomorrow";
  if (offset < 7) return "week";
  return "later";
}

export function matchesDayFilter(date, filter) {
  const bucket = dayBucket(date);
  if (filter === "today") return bucket === "today";
  if (filter === "tomorrow") return bucket === "tomorrow";
  return bucket === "today" || bucket === "tomorrow" || bucket === "week";
}

/** "requested today" style phrase using the app's getTimeSince. */
export function formatAgo(dateString) {
  if (!dateString) return "";
  const phrase = getTimeSince(dateString);
  return phrase ? phrase.charAt(0).toLowerCase() + phrase.slice(1) : "";
}

export function initials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "U";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

/** Today's date as "YYYY-MM-DD" in local time. */
export function todayKey(now = new Date()) {
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}
