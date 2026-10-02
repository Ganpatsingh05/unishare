"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { deleteRide, getMyRides, updateRide } from "../services/rides.service";
import { isUpcoming, normalizeRide, toRideUpdateBody } from "../utils/rideModel";

/** The signed-in user's active, future rides with optimistic cancel and edit. */
export default function useMyUpcomingRides({ enabled, userId }) {
  const [rides, setRides] = useState([]);
  const ridesRef = useRef(rides);
  ridesRef.current = rides;
  const [status, setStatus] = useState(enabled ? "loading" : "idle");

  const load = useCallback(async () => {
    if (!enabled) {
      setStatus("idle");
      setRides([]);
      return;
    }
    setStatus("loading");
    const result = await getMyRides({ sort: "date", order: "asc" });
    if (!result.success) {
      setStatus("error");
      return;
    }
    const now = new Date();
    const upcoming = (result.data || [])
      .map((raw) => normalizeRide(raw, userId))
      .filter((ride) => isUpcoming(ride, now))
      .sort((a, b) => a.startsAt - b.startsAt);
    setRides(upcoming);
    setStatus("ready");
  }, [enabled, userId]);

  useEffect(() => {
    load();
  }, [load]);

  /** Optimistically removes the ride; restores it if the API call fails. */
  const cancel = useCallback(async (ride) => {
    const index = ridesRef.current.findIndex((r) => r.id === ride.id);
    setRides((prev) => prev.filter((r) => r.id !== ride.id));
    const result = await deleteRide(ride.id);
    if (!result.success) {
      setRides((prev) => {
        const next = [...prev];
        next.splice(Math.max(index, 0), 0, ride);
        return next;
      });
    }
    return result;
  }, []);

  /** Optimistically applies the patch; reverts it if the API call fails. */
  const update = useCallback(async (ride, patch) => {
    const optimistic = { ...ride, ...patch };
    setRides((prev) => prev.map((r) => (r.id === ride.id ? optimistic : r)));
    const result = await updateRide(ride.id, toRideUpdateBody(ride, patch));
    if (!result.success) {
      setRides((prev) => prev.map((r) => (r.id === ride.id ? ride : r)));
    }
    return result;
  }, []);

  return { rides, status, reload: load, cancel, update };
}
