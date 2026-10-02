"use client";

import { useEffect, useState } from "react";
import { CAMPUS_ORIGIN } from "../constants/ridePlaces";
import { fetchRoute, findKnownPlace, verifyPlace } from "../utils/geo";

const CAMPUS = { label: CAMPUS_ORIGIN.value, detail: CAMPUS_ORIGIN.area, lat: CAMPUS_ORIGIN.lat, lng: CAMPUS_ORIGIN.lng, source: "known" };

async function resolve(text, signal) {
  const value = (text || "").trim();
  if (!value) return null;
  return findKnownPlace(value) || verifyPlace(value, signal);
}

/**
 * Places and road route for one ride, in the shape RouteMap takes. A start
 * that can't be found falls back to the campus main gate, so the map always
 * has an origin. Lookups and routes are cached by the geo helpers.
 */
export default function useRideRoute(ride) {
  const key = ride ? `${ride.id}|${ride.from}|${ride.to}` : "";
  const [state, setState] = useState({ key: "", origin: null, destination: null, route: null, routeStatus: "idle" });

  useEffect(() => {
    if (!ride) return undefined;
    const controller = new AbortController();
    const { signal } = controller;
    setState({ key, origin: null, destination: { status: "checking", place: null }, route: null, routeStatus: "loading" });
    (async () => {
      try {
        const [from, to] = await Promise.all([resolve(ride.from, signal), resolve(ride.to, signal)]);
        const origin = from ? { status: "verified", place: from } : { status: "default", place: CAMPUS };
        const destination = to ? { status: "verified", place: to } : { status: "notfound", place: null };
        setState({ key, origin, destination, route: null, routeStatus: to ? "loading" : "idle" });
        if (!to) return;
        const route = await fetchRoute(origin.place, to, signal);
        setState({ key, origin, destination, route, routeStatus: "ready" });
      } catch (error) {
        if (error.name !== "AbortError") {
          setState((prev) => ({ ...prev, destination: prev.destination?.place ? prev.destination : { status: "error", place: null }, routeStatus: "error" }));
        }
      }
    })();
    return () => controller.abort();
    // `key` captures the fields that matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!ride || state.key !== key || !state.origin) {
    return {
      ready: false,
      preview: false,
      origin: { status: "default", place: CAMPUS },
      destination: { status: ride ? "checking" : "empty", place: null },
      route: null,
      routeStatus: ride ? "loading" : "idle",
      toText: ride?.to || "",
    };
  }
  return { ready: true, preview: false, ...state, toText: ride.to };
}
