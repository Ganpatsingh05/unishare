// Route matching, departure windows and sorting for the Find page. Rides
// are loaded once; everything here runs in the browser, so changing the
// route, day, seats or a filter never waits on the network.

import { todayKey } from "./rideFormat";

const STOP_WORDS = new Set(["the", "and", "near", "road", "rd", "city", "station", "stn", "railway", "bus", "stand", "gate"]);

/** Lower-case words of a place name, without punctuation. */
function words(text = "") {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * Whether ride place text and searched text refer to the same place:
 * one contains the other, or they share a distinctive word ("LPU" matches
 * "LPU Main Gate", "Jalandhar" matches "Jalandhar City Railway Station").
 */
export function placeMatches(rideText, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const r = rideText.toLowerCase();
  if (r.includes(q) || q.includes(r)) return true;
  const key = words(q).filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
  if (!key.length) return false;
  const rideWords = new Set(words(r));
  return key.some((word) => rideWords.has(word) || r.includes(word));
}

/**
 * How well a ride fits the searched route.
 * @returns {"exact"|"close"|null} exact: every filled end matches;
 *   close: both ends were given and one matches; null: no match.
 */
export function routeTier(ride, from, to) {
  const hasFrom = Boolean(from.trim());
  const hasTo = Boolean(to.trim());
  if (!hasFrom && !hasTo) return "exact";
  const fromOk = !hasFrom || placeMatches(ride.from, from);
  const toOk = !hasTo || placeMatches(ride.to, to);
  if (fromOk && toOk) return "exact";
  if (hasFrom && hasTo && (fromOk || toOk)) return "close";
  return null;
}

export const TIME_WINDOWS = ["morning", "afternoon", "evening", "night"];

/** Departure window of a ride's start time. */
export function timeWindow(ride) {
  const hour = ride.startsAt ? ride.startsAt.getHours() : 0;
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const SORTS = ["best", "soonest", "cheapest", "seats"];

const byStart = (a, b) => a.startsAt - b.startsAt;
const priceOf = (ride) => (Number.isFinite(ride.price) ? ride.price : Number.POSITIVE_INFINITY);

const COMPARE = {
  // Best match: exact routes first, then the soonest departure.
  best: (a, b) => (a.tier === b.tier ? byStart(a, b) : a.tier === "exact" ? -1 : 1),
  soonest: byStart,
  cheapest: (a, b) => priceOf(a) - priceOf(b) || byStart(a, b),
  seats: (a, b) => b.seatsLeft - a.seatsLeft || byStart(a, b),
};

export function sortRides(list, sort) {
  return [...list].sort(COMPARE[sort] || COMPARE.best);
}

/** "YYYY-MM-DD" for a day `offset` days from today. */
export function dayKey(offset, now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  return todayKey(d);
}
