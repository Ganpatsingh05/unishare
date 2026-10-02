"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import {
  cancelRideRequest,
  deleteRide,
  getMyRides,
  getRideRequests,
  getUserSentRequests,
  respondToRideRequest,
  updateRide,
} from "../services/rides.service";
import { normalizeRequest, normalizeRide, normalizeSentRequest, normalizeStatus, toRideUpdateBody } from "../utils/rideModel";
import { motion as motionTokens } from "../theme/rideTokens";

/** "upcoming" | "past" | "cancelled" for one of my rides. */
export function hostBucket(ride, now = new Date()) {
  if (ride.status === "cancelled") return "cancelled";
  if (ride.status !== "active" || !ride.startsAt || ride.startsAt <= now) return "past";
  return "upcoming";
}

/** "upcoming" | "past" | "cancelled" for a request I sent. */
export function sentBucket(request, now = new Date()) {
  if (request.status === "declined" || request.status === "cancelled") return "cancelled";
  if (!request.ride.startsAt || request.ride.startsAt <= now) return "past";
  return "upcoming";
}

/**
 * Everything the Manage page shows for the signed-in user: rides they offer
 * (with the requests made to each), and requests they've sent. Accept and
 * decline wait out an undo window before reaching the server; cancel and
 * edit are optimistic and roll back on failure.
 */
export default function useManageRides({ onCommitError } = {}) {
  const { user, isAuthenticated, authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [status, setStatus] = useState("loading");
  const [rides, setRides] = useState([]);
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const decisions = useRef(new Map()); // requestId -> { timer, previous, action }
  const errorRef = useRef(onCommitError);
  errorRef.current = onCommitError;

  const load = useCallback(
    async ({ quiet = false } = {}) => {
      if (!isAuthenticated) {
        setStatus(authLoading ? "loading" : "signedout");
        return;
      }
      if (!quiet) setStatus("loading");
      const [mine, incoming, outgoing] = await Promise.all([getMyRides(), getRideRequests(), getUserSentRequests()]);
      if (!mine.success) {
        if (!quiet) setStatus("error");
        return;
      }
      setRides((mine.data || []).map((raw) => normalizeRide(raw, userId)));
      setReceived(
        (incoming.data || []).map((raw) => {
          const request = normalizeRequest(raw);
          const held = decisions.current.get(request.id);
          // A decision still inside its undo window wins over the server copy.
          return { ...request, status: held ? held.next : normalizeStatus(request.status) };
        })
      );
      setSent((outgoing.data || []).map(normalizeSentRequest));
      setStatus("ready");
    },
    [isAuthenticated, authLoading, userId]
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

  const setRequestStatus = (requestId, next) =>
    setReceived((prev) => prev.map((request) => (request.id === requestId ? { ...request, status: next } : request)));

  const commit = useCallback(async (requestId) => {
    const entry = decisions.current.get(requestId);
    if (!entry) return;
    decisions.current.delete(requestId);
    const result = await respondToRideRequest(requestId, entry.action);
    if (!result.success) {
      setRequestStatus(requestId, entry.previous);
      errorRef.current?.(result.error);
    }
  }, []);

  /** @param {"confirm"|"decline"} action */
  const respond = useCallback(
    (request, action) => {
      const next = action === "confirm" ? "confirmed" : "declined";
      setRequestStatus(request.id, next);
      const timer = setTimeout(() => commit(request.id), motionTokens.undoWindowMs);
      decisions.current.set(request.id, { timer, previous: request.status, action, next });
    },
    [commit]
  );

  const undo = useCallback((requestId) => {
    const entry = decisions.current.get(requestId);
    if (!entry) return false;
    clearTimeout(entry.timer);
    decisions.current.delete(requestId);
    setRequestStatus(requestId, entry.previous);
    return true;
  }, []);

  // Never drop a decision: send anything still waiting when leaving the page.
  useEffect(() => {
    const held = decisions.current;
    const flush = () => {
      for (const [id, entry] of held) {
        clearTimeout(entry.timer);
        commit(id);
      }
    };
    window.addEventListener("pagehide", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [commit]);

  const cancelRide = useCallback(async (ride) => {
    setRides((prev) => prev.map((r) => (r.id === ride.id ? { ...r, status: "cancelled" } : r)));
    const result = await deleteRide(ride.id);
    if (!result.success) setRides((prev) => prev.map((r) => (r.id === ride.id ? ride : r)));
    return result;
  }, []);

  const updateMyRide = useCallback(async (ride, patch) => {
    setRides((prev) => prev.map((r) => (r.id === ride.id ? { ...ride, ...patch } : r)));
    const result = await updateRide(ride.id, toRideUpdateBody(ride, patch));
    if (!result.success) setRides((prev) => prev.map((r) => (r.id === ride.id ? ride : r)));
    return result;
  }, []);

  const cancelRequest = useCallback(async (request) => {
    setSent((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "cancelled" } : r)));
    const result = await cancelRideRequest(request.id);
    if (!result.success) setSent((prev) => prev.map((r) => (r.id === request.id ? request : r)));
    return result;
  }, []);

  // Requests grouped under the ride they were made for.
  const hosting = useMemo(() => {
    const byRide = new Map();
    for (const request of received) {
      if (!byRide.has(request.rideId)) byRide.set(request.rideId, []);
      byRide.get(request.rideId).push(request);
    }
    return rides
      .map((ride) => {
        const requests = byRide.get(ride.id) || [];
        const confirmed = requests.filter((r) => r.status === "confirmed");
        const taken = confirmed.reduce((sum, r) => sum + r.seats, 0);
        return {
          ...ride,
          pending: requests.filter((r) => r.status === "pending"),
          confirmed,
          // Seats left follows decisions made here, before the server catches up.
          seatsLeft: Math.max(0, ride.seatsTotal - taken),
        };
      })
      .sort((a, b) => (a.startsAt?.getTime() ?? 0) - (b.startsAt?.getTime() ?? 0));
  }, [rides, received]);

  return {
    status,
    hosting,
    sent: useMemo(() => [...sent].sort((a, b) => (a.ride.startsAt?.getTime() ?? 0) - (b.ride.startsAt?.getTime() ?? 0)), [sent]),
    reload: load,
    respond,
    undo,
    cancelRide,
    updateRide: updateMyRide,
    cancelRequest,
  };
}
