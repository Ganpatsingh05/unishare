"use client";

import { useEffect, useState } from "react";
import { CAMPUS_ORIGIN, DEFAULT_PREVIEW } from "../constants/ridePlaces";
import { fetchRoute, findKnownPlace, verifyPlace } from "../utils/geo";

const SETTLE_MS = 650;

const asPlace = (p) => ({ label: p.value, detail: p.area, lat: p.lat, lng: p.lng, source: "known" });
const DEFAULT_ORIGIN = { status: "default", place: asPlace(CAMPUS_ORIGIN) };
const PREVIEW_ORIGIN = { status: "default", place: asPlace(DEFAULT_PREVIEW.from) };
const PREVIEW_DESTINATION = { status: "default", place: asPlace(DEFAULT_PREVIEW.to) };

function useSettled(value, delay) {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}

/**
 * Verifies one place field. Known campus places resolve instantly; anything
 * else is looked up once typing settles.
 * @returns {{status: "empty"|"checking"|"verified"|"notfound"|"error", place: object|null}}
 */
function usePlace(text) {
  const settled = useSettled(text, SETTLE_MS);
  const [state, setState] = useState({ key: "", status: "empty", place: null });

  useEffect(() => {
    const value = settled.trim();
    if (!value) {
      setState({ key: "", status: "empty", place: null });
      return undefined;
    }
    const known = findKnownPlace(value);
    if (known) {
      setState({ key: value, status: "verified", place: known });
      return undefined;
    }
    const controller = new AbortController();
    setState({ key: value, status: "checking", place: null });
    verifyPlace(value, controller.signal)
      .then((place) => setState({ key: value, status: place ? "verified" : "notfound", place }))
      .catch((error) => {
        if (error.name !== "AbortError") setState({ key: value, status: "error", place: null });
      });
    return () => controller.abort();
  }, [settled]);

  const current = text.trim();
  if (!current) return { status: "empty", place: null };
  // While the user is still typing, report "checking" rather than a stale result.
  if (current !== state.key && !findKnownPlace(current)) return { status: "checking", place: null };
  if (current !== state.key) return { status: "verified", place: findKnownPlace(current) };
  return { status: state.status, place: state.place };
}

/**
 * Resolves the hero's From and To text into verified places and a road
 * route for the map.
 * - Both empty: a preview route (campus main gate to Jalandhar City station).
 * - Only To filled: the route starts at the campus main gate.
 * Default places carry status "default" and count as verified.
 */
export default function useResolvedRoute(fromText, toText) {
  const fromState = usePlace(fromText);
  const toState = usePlace(toText);
  const preview = fromState.status === "empty" && toState.status === "empty";
  const origin = preview ? PREVIEW_ORIGIN : fromState.status === "empty" ? DEFAULT_ORIGIN : fromState;
  const destination = preview ? PREVIEW_DESTINATION : toState;
  const [route, setRoute] = useState({ key: "", data: null, status: "idle" });

  const a = origin.status === "verified" || origin.status === "default" ? origin.place : null;
  const b = destination.status === "verified" || destination.status === "default" ? destination.place : null;
  const routeKey = a && b ? `${a.lat},${a.lng};${b.lat},${b.lng}` : "";

  useEffect(() => {
    if (!routeKey) {
      setRoute({ key: "", data: null, status: "idle" });
      return undefined;
    }
    const [p, q] = routeKey.split(";").map((pair) => {
      const [lat, lng] = pair.split(",").map(Number);
      return { lat, lng };
    });
    const controller = new AbortController();
    setRoute((prev) => ({ key: routeKey, data: prev.data, status: "loading" }));
    fetchRoute(p, q, controller.signal)
      .then((data) => setRoute({ key: routeKey, data, status: "ready" }))
      .catch((error) => {
        if (error.name !== "AbortError") setRoute({ key: routeKey, data: null, status: "error" });
      });
    return () => controller.abort();
  }, [routeKey]);

  return {
    preview,
    origin,
    destination,
    route: route.key === routeKey ? route.data : null,
    routeStatus: route.key === routeKey ? route.status : routeKey ? "loading" : "idle",
  };
}
