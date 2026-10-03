"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getRideRequests, respondToRideRequest } from "../services/rides.service";
import { normalizeRequest } from "../utils/rideModel";
import { motion as motionTokens } from "../theme/rideTokens";

/**
 * Pending join requests on the signed-in driver's rides.
 *
 * Accept and decline are optimistic with an undo window: the row leaves the
 * queue at once, and the API call is sent when the window closes. Undo puts
 * the row back without calling the API. A failed call restores the row.
 */
export default function useRideRequests({ enabled, onCommitError }) {
  const [requests, setRequests] = useState([]);
  const requestsRef = useRef(requests);
  requestsRef.current = requests;
  const [status, setStatus] = useState(enabled ? "loading" : "idle");
  const pendingRef = useRef(new Map()); // requestId -> { timer, request, index, action }
  const errorRef = useRef(onCommitError);
  errorRef.current = onCommitError;

  const load = useCallback(async () => {
    if (!enabled) {
      setStatus("idle");
      setRequests([]);
      return;
    }
    setStatus("loading");
    const result = await getRideRequests();
    if (!result.success) {
      setStatus("error");
      return;
    }
    const now = new Date();
    const pending = (result.data || [])
      .map(normalizeRequest)
      .filter((r) => r.status === "pending" && (!r.ride.startsAt || r.ride.startsAt > now))
      .filter((r) => !pendingRef.current.has(r.id))
      .sort((a, b) => (a.ride.startsAt?.getTime() ?? 0) - (b.ride.startsAt?.getTime() ?? 0));
    setRequests(pending);
    setStatus("ready");
  }, [enabled]);

  useEffect(() => {
    load();
  }, [load]);

  const restore = useCallback((entry) => {
    setRequests((prev) => {
      if (prev.some((r) => r.id === entry.request.id)) return prev;
      const next = [...prev];
      next.splice(Math.min(entry.index, next.length), 0, entry.request);
      return next;
    });
  }, []);

  const commit = useCallback(
    async (requestId) => {
      const entry = pendingRef.current.get(requestId);
      if (!entry) return;
      pendingRef.current.delete(requestId);
      const result = await respondToRideRequest(requestId, entry.action);
      if (!result.success) {
        restore(entry);
        errorRef.current?.(entry.request, result.error);
      }
    },
    [restore]
  );

  /** @param {"confirm"|"decline"} action */
  const respond = useCallback(
    (request, action) => {
      const index = requestsRef.current.findIndex((r) => r.id === request.id);
      setRequests((prev) => prev.filter((r) => r.id !== request.id));
      const timer = setTimeout(() => commit(request.id), motionTokens.undoWindowMs);
      pendingRef.current.set(request.id, { timer, request, index: Math.max(index, 0), action });
    },
    [commit]
  );

  const undo = useCallback(
    (requestId) => {
      const entry = pendingRef.current.get(requestId);
      if (!entry) return false;
      clearTimeout(entry.timer);
      pendingRef.current.delete(requestId);
      restore(entry);
      return true;
    },
    [restore]
  );

  // Never drop a decision: commit anything still waiting when leaving the page.
  useEffect(() => {
    const pending = pendingRef.current;
    const flush = () => {
      for (const [id, entry] of pending) {
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

  return { requests, status, reload: load, respond, undo };
}
