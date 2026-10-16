// Normalises backend ride and request rows into the shape the landing page
// renders. Both the current Spring backend's camelCase fields and the older
// snake_case ones are accepted, so a response from either renders correctly.

import { RIDE_STRINGS } from "../constants/rideStrings";
import { parseRideDateTime } from "./rideFormat";

const CONTACT_MARKER = "\u{1F4DE} Contact me via:";

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function normalizeRide(raw, currentUserId) {
  const seatsTotal = toNumber(raw.totalSeats ?? raw.seats, 0);
  const seatsLeft = Math.max(0, toNumber(raw.availableSeats ?? raw.available_seats, seatsTotal));
  const driverId = raw.organizerId ?? raw.user_id ?? raw.users?.id ?? null;
  const rideDate = raw.rideDate || raw.date;
  const rideTime = raw.rideTime || raw.time;
  return {
    id: raw.id,
    driverName: raw.driver_name || raw.users?.name || RIDE_STRINGS.recent.driverFallback,
    driverAvatar: raw.users?.picture || null,
    driverId,
    from: raw.fromLocation || raw.from_location || raw.from || "",
    to: raw.toLocation || raw.to_location || raw.to || "",
    date: rideDate || "",
    time: (rideTime || "").slice(0, 5),
    startsAt: parseRideDateTime(rideDate, rideTime),
    seatsTotal: Math.max(seatsTotal, seatsLeft),
    seatsLeft,
    price: toNumber(raw.price, NaN),
    vehicle: raw.vehicleInfo || raw.vehicle_info || raw.vehicle || "",
    description: raw.description || "",
    contactInfo: raw.contactInfo || raw.contact_info || {},
    // The backend serialises RideStatus as ACTIVE/FULL/CANCELLED; the UI compares lowercase.
    status: String(raw.status || "active").toLowerCase(),
    createdAt: raw.createdAt || raw.created_at || null,
    totalRequests: toNumber(raw.total_requests, 0),
    confirmedBookings: toNumber(raw.confirmed_bookings, 0),
    isOwn: Boolean(currentUserId && driverId && driverId === currentUserId),
  };
}

// The backend flips a ride to FULL once every seat is taken. It has not been
// cancelled and has not happened yet, so it still counts as upcoming.
const UPCOMING_STATUSES = new Set(["active", "full"]);

export function isUpcoming(ride, now = new Date()) {
  return UPCOMING_STATUSES.has(ride.status) && ride.startsAt && ride.startsAt > now;
}

function cleanMessage(message = "") {
  const index = message.indexOf(CONTACT_MARKER);
  return (index >= 0 ? message.slice(0, index) : message).trim();
}

export function normalizeRequest(raw) {
  const profile = raw.requester_profile || {};
  const requester = raw.requester || {};
  const ride = raw.ride || {};
  const rideDate = ride.rideDate || ride.date;
  const rideTime = ride.rideTime || ride.time;
  return {
    id: raw.id,
    rideId: raw.rideId ?? raw.ride_id ?? ride.id,
    passengerId: raw.passengerId ?? null,
    name: profile.display_name || requester.name || RIDE_STRINGS.recent.driverFallback,
    avatar: profile.profile_image_url || requester.picture || null,
    seats: toNumber(raw.seatsRequested ?? raw.seats_requested, 1),
    message: cleanMessage(raw.message),
    pickup: raw.pickup_location || "",
    status: normalizeStatus(raw.status),
    createdAt: raw.createdAt || raw.created_at || null,
    ride: {
      from: ride.fromLocation || ride.from_location || "",
      to: ride.toLocation || ride.to_location || "",
      date: rideDate || "",
      time: (rideTime || "").slice(0, 5),
      startsAt: parseRideDateTime(rideDate, rideTime),
      price: toNumber(ride.price, NaN),
      seats: toNumber(ride.totalSeats ?? ride.seats, 0),
    },
  };
}

// The backend has used both vocabularies for request states, and serialises them
// upper case (PENDING/CONFIRMED/DECLINED/CANCELLED) while the UI compares lowercase.
const STATUS_ALIASES = { accepted: "confirmed", rejected: "declined" };
export const normalizeStatus = (status) => {
  const key = String(status || "pending").toLowerCase();
  return STATUS_ALIASES[key] || key;
};

/** A request the signed-in user sent to someone else's ride (GET /my/requested). */
export function normalizeSentRequest(raw) {
  const ride = raw.ride || {};
  const owner = ride.owner || {};
  const profile = raw.ride_owner_profile || {};
  const rideDate = ride.rideDate || ride.date;
  const rideTime = ride.rideTime || ride.time;
  return {
    id: raw.id,
    rideId: raw.rideId ?? raw.ride_id ?? ride.id,
    status: normalizeStatus(raw.status),
    seats: toNumber(raw.seatsRequested ?? raw.seats_requested, 1),
    message: cleanMessage(raw.message),
    createdAt: raw.createdAt || raw.created_at || null,
    hostName: profile.display_name || owner.name || RIDE_STRINGS.recent.driverFallback,
    hostAvatar: profile.profile_image_url || owner.picture || null,
    ride: {
      from: ride.fromLocation || ride.from_location || "",
      to: ride.toLocation || ride.to_location || "",
      date: rideDate || "",
      time: (rideTime || "").slice(0, 5),
      startsAt: parseRideDateTime(rideDate, rideTime),
      price: toNumber(ride.price, NaN),
      seats: toNumber(ride.totalSeats ?? ride.seats, 0),
    },
  };
}

/** Body for PATCH /api/rides/{id} — the backend's RideCreateRequest field names. */
export function toRideUpdateBody(ride, patch) {
  const next = { ...ride, ...patch };
  return {
    fromLocation: next.from,
    toLocation: next.to,
    rideDate: next.date,
    rideTime: next.time,
    totalSeats: Number(next.seatsTotal),
    price: Number(next.price),
    vehicleInfo: next.vehicle,
    description: next.description || "",
    contactInfo: next.contactInfo || {},
  };
}
