"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@contexts/UniShareContext";
import { fetchRides, getUserSentRequests, requestRideJoin } from "../services/rides.service";
import { normalizeRide, isUpcoming } from "../utils/rideModel";
import { todayKey } from "../utils/rideFormat";
import { buildLoginHref } from "../utils/rideLinks";

const FEED_LIMIT = 100;
const OPEN_REQUEST_STATUSES = new Set(["pending", "confirmed"]);

function computeStats(rides) {
  if (!rides.length) return null;
  const today = todayKey();
  const priced = rides.filter((ride) => Number.isFinite(ride.price) && ride.price > 0);
  const routes = new Set(rides.map((ride) => `${ride.from.toLowerCase()}|${ride.to.toLowerCase()}`));
  return {
    ridesToday: rides.filter((ride) => ride.date === today).length,
    openSeats: rides.reduce((sum, ride) => sum + ride.seatsLeft, 0),
    avgPrice: priced.length ? Math.round(priced.reduce((sum, r) => sum + r.price, 0) / priced.length) : null,
    activeRoutes: routes.size,
  };
}

/**
 * Upcoming rides from GET /api/shareride plus the signed-in user's open
 * requests, with an optimistic "request a seat" action per ride.
 */
export default function useRideFeed({ onRequestResult } = {}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id ?? null;

  const [rides, setRides] = useState([]);
  const [status, setStatus] = useState("loading");
  const [requestState, setRequestState] = useState({}); // rideId -> "loading" | "requested"
  const resultRef = useRef(onRequestResult);
  resultRef.current = onRequestResult;

  const load = useCallback(async () => {
    setStatus("loading");
    const [feed, sent] = await Promise.all([
      fetchRides({ sort: "created_at", order: "desc", limit: FEED_LIMIT }),
      isAuthenticated ? getUserSentRequests() : Promise.resolve({ success: true, data: [] }),
    ]);
    if (!feed.success) {
      setStatus("error");
      return;
    }
    const now = new Date();
    const normalized = (Array.isArray(feed.data) ? feed.data : [])
      .map((raw) => normalizeRide(raw, userId))
      .filter((ride) => isUpcoming(ride, now));
    const requested = {};
    for (const request of sent.data || []) {
      if (OPEN_REQUEST_STATUSES.has(request.status)) requested[request.ride_id] = "requested";
    }
    setRides(normalized);
    setRequestState(requested);
    setStatus("ready");
  }, [isAuthenticated, userId]);

  useEffect(() => {
    load();
  }, [load]);

  const requestSeat = useCallback(
    async (ride, seatsRequested = 1) => {
      if (!isAuthenticated) {
        router.push(buildLoginHref());
        return;
      }
      setRequestState((prev) => ({ ...prev, [ride.id]: "loading" }));
      const result = await requestRideJoin(ride.id, {
        seatsRequested,
        message: `Hi! I would like to join your ride from ${ride.from} to ${ride.to} on ${ride.date}.`,
        contactMethod: "mobile",
      });
      if (result.success) {
        setRequestState((prev) => ({ ...prev, [ride.id]: "requested" }));
      } else {
        setRequestState((prev) => {
          const next = { ...prev };
          delete next[ride.id];
          return next;
        });
      }
      resultRef.current?.(ride, result);
    },
    [isAuthenticated, router]
  );

  const stats = useMemo(() => computeStats(rides), [rides]);

  return { rides, status, reload: load, stats, requestState, requestSeat };
}
