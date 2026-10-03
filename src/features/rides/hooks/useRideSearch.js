"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import { fetchRides, getUserSentRequests, requestRideJoin } from "../services/rides.service";
import { normalizeRide, isUpcoming } from "../utils/rideModel";

// The list endpoint caps a page at 100 rides; the Find page loads one page of
// upcoming rides (soonest first) and matches routes in the browser.
const SEARCH_LIMIT = 100;

// The backend has used both vocabularies for request states.
const STATUS_ALIASES = { accepted: "confirmed", rejected: "declined" };
const normStatus = (status) => STATUS_ALIASES[status] || status;

/** Latest request status per ride for the signed-in user. */
function statusesByRide(requests = []) {
  const latest = {};
  for (const request of requests) {
    const prev = latest[request.ride_id];
    if (!prev || new Date(request.created_at || 0) > new Date(prev.created_at || 0)) latest[request.ride_id] = request;
  }
  const map = {};
  for (const [rideId, request] of Object.entries(latest)) map[rideId] = normStatus(request.status);
  return map;
}

/**
 * Upcoming rides plus the signed-in user's request status for each, with a
 * "request seats" action that updates optimistically and rolls back on error.
 * Data refreshes quietly when the tab regains focus.
 */
export default function useRideSearch() {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id ?? null;
  const [rides, setRides] = useState([]);
  const [status, setStatus] = useState("loading");
  const [requests, setRequests] = useState({}); // rideId -> pending | confirmed | declined | cancelled
  const [sending, setSending] = useState(null); // rideId being requested
  const requestsRef = useRef(requests);
  requestsRef.current = requests;

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!quiet) setStatus("loading");
      const [feed, sent] = await Promise.all([
        fetchRides({ sort: "date", order: "asc", limit: SEARCH_LIMIT }),
        isAuthenticated ? getUserSentRequests() : Promise.resolve({ success: true, data: [] }),
      ]);
      if (!feed.success) {
        if (!quiet) setStatus("error");
        return;
      }
      const now = new Date();
      setRides(
        (Array.isArray(feed.data) ? feed.data : [])
          .map((raw) => normalizeRide(raw, userId))
          .filter((ride) => isUpcoming(ride, now))
      );
      if (sent.success) setRequests(statusesByRide(sent.data || []));
      setStatus("ready");
    },
    [isAuthenticated, userId]
  );

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") load({ quiet: true });
    };
    document.addEventListener("visibilitychange", refresh);
    return () => document.removeEventListener("visibilitychange", refresh);
  }, [load]);

  /**
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const requestSeats = useCallback(async (ride, { seats, message }) => {
    const previous = requestsRef.current[ride.id];
    setSending(ride.id);
    setRequests((prev) => ({ ...prev, [ride.id]: "pending" }));
    const result = await requestRideJoin(ride.id, { seatsRequested: seats, message, contactMethod: "mobile" });
    if (!result.success) {
      setRequests((prev) => {
        const next = { ...prev };
        if (previous) next[ride.id] = previous;
        else delete next[ride.id];
        return next;
      });
    }
    setSending(null);
    return result;
  }, []);

  return { rides, status, reload: load, requests, sending, requestSeats, isAuthenticated };
}
