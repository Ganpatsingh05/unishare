// Normalises backend ride and request rows into the shape the landing page
// renders. Backend field names are documented in unishare-backend
// routes/api/shareride.js.

import { RIDE_STRINGS } from "../constants/rideStrings";
import { parseRideDateTime } from "./rideFormat";

const CONTACT_MARKER = "\u{1F4DE} Contact me via:";

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeRide(raw, currentUserId) {
  const seatsTotal = toNumber(raw.seats, 0);
  const seatsLeft = Math.max(0, toNumber(raw.available_seats, seatsTotal));
  const driverId = raw.user_id ?? raw.users?.id ?? null;
  return {
    id: raw.id,
    driverName: raw.driver_name || raw.users?.name || RIDE_STRINGS.recent.driverFallback,
    driverAvatar: raw.users?.picture || null,
    driverId,
    from: raw.from_location || raw.from || "",
    to: raw.to_location || raw.to || "",
    date: raw.date || "",
    time: (raw.time || "").slice(0, 5),
    startsAt: parseRideDateTime(raw.date, raw.time),
    seatsTotal: Math.max(seatsTotal, seatsLeft),
    seatsLeft,
    price: toNumber(raw.price, NaN),
    vehicle: raw.vehicle_info || raw.vehicle || "",
    description: raw.description || "",
    contactInfo: raw.contact_info || {},
    status: raw.status || "active",
    createdAt: raw.created_at || null,
    totalRequests: toNumber(raw.total_requests, 0),
    confirmedBookings: toNumber(raw.confirmed_bookings, 0),
    isOwn: Boolean(currentUserId && driverId && driverId === currentUserId),
  };
}

export function isUpcoming(ride, now = new Date()) {
  return ride.status === "active" && ride.startsAt && ride.startsAt > now;
}

function cleanMessage(message = "") {
  const index = message.indexOf(CONTACT_MARKER);
  return (index >= 0 ? message.slice(0, index) : message).trim();
}

export function normalizeRequest(raw) {
  const profile = raw.requester_profile || {};
  const requester = raw.requester || {};
  const ride = raw.ride || {};
  return {
    id: raw.id,
    rideId: raw.ride_id ?? ride.id,
    name: profile.display_name || requester.name || RIDE_STRINGS.recent.driverFallback,
    avatar: profile.profile_image_url || requester.picture || null,
    seats: toNumber(raw.seats_requested, 1),
    message: cleanMessage(raw.message),
    pickup: raw.pickup_location || "",
    status: raw.status,
    createdAt: raw.created_at,
    ride: {
      from: ride.from_location || "",
      to: ride.to_location || "",
      date: ride.date || "",
      time: (ride.time || "").slice(0, 5),
      startsAt: parseRideDateTime(ride.date, ride.time),
      price: toNumber(ride.price, NaN),
      seats: toNumber(ride.seats, 0),
    },
  };
}

// The backend has used both vocabularies for request states.
const STATUS_ALIASES = { accepted: "confirmed", rejected: "declined" };
export const normalizeStatus = (status) => STATUS_ALIASES[status] || status || "pending";

/** A request the signed-in user sent to someone else's ride (GET /my/requested). */
export function normalizeSentRequest(raw) {
  const ride = raw.ride || {};
  const owner = ride.owner || {};
  const profile = raw.ride_owner_profile || {};
  return {
    id: raw.id,
    rideId: raw.ride_id ?? ride.id,
    status: normalizeStatus(raw.status),
    seats: toNumber(raw.seats_requested, 1),
    message: cleanMessage(raw.message),
    createdAt: raw.created_at || null,
    hostName: profile.display_name || owner.name || RIDE_STRINGS.recent.driverFallback,
    hostAvatar: profile.profile_image_url || owner.picture || null,
    ride: {
      from: ride.from_location || "",
      to: ride.to_location || "",
      date: ride.date || "",
      time: (ride.time || "").slice(0, 5),
      startsAt: parseRideDateTime(ride.date, ride.time),
      price: toNumber(ride.price, NaN),
      seats: toNumber(ride.seats, 0),
    },
  };
}

/** Body for PUT /api/shareride/:id, which re-validates every field. */
export function toRideUpdateBody(ride, patch) {
  const next = { ...ride, ...patch };
  return {
    from: next.from,
    to: next.to,
    date: next.date,
    time: next.time,
    seats: Number(next.seatsTotal),
    price: Number(next.price),
    vehicle: next.vehicle,
    description: next.description,
    contact_info: next.contactInfo,
  };
}
