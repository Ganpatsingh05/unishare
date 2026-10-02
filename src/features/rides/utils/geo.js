// Place lookup and road routing for the hero map.
//
// - Suggestions while typing: Photon (photon.komoot.io), which allows
//   search-as-you-type. Results are limited to India and to places within
//   MAX_DISTANCE_KM of campus.
// - Verifying a settled value: Nominatim (nominatim.openstreetmap.org), which
//   is more accurate for stations but forbids autocomplete, so it is only
//   called once typing has settled, at most once per distinct value.
// - Route: public OSRM servers. Trips under WALK_LIMIT_KM use the foot
//   profile (routing.openstreetmap.de), since campus paths are often closed
//   to cars; longer trips use the car profile (router.project-osrm.org).
// These are public, keyless endpoints meant for light use. A production
// deployment should move them behind a keyed provider or a backend proxy.

import { CAMPUS_PLACES } from "../constants/ridePlaces";

const PHOTON_URL = "https://photon.komoot.io/api/";
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_DRIVE_URL = "https://router.project-osrm.org/route/v1/driving/";
const OSRM_WALK_URL = "https://routing.openstreetmap.de/routed-foot/route/v1/foot/";
const WALK_LIMIT_KM = 3;
const CAMPUS = { lat: 31.2556, lng: 75.7047 };
const MAX_DISTANCE_KM = 600;
// Lookups are bounded to North India around campus.
const VIEWBOX = "72.5,34.5,79.5,27.5";

const verifyCache = new Map();
const suggestCache = new Map();
const routeCache = new Map();

const norm = (value = "") => value.trim().toLowerCase();

export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

function nearCampus(point) {
  return distanceKm(CAMPUS, point) <= MAX_DISTANCE_KM;
}

/** A curated place matching the text exactly (case-insensitive), if any. */
export function findKnownPlace(text) {
  const key = norm(text);
  if (!key) return null;
  const hit = CAMPUS_PLACES.find((place) => norm(place.value) === key);
  return hit ? { label: hit.value, detail: hit.area, lat: hit.lat, lng: hit.lng, source: "known" } : null;
}

function photonLabel(props) {
  const name = props.name || props.street || "";
  const area = [props.city || props.county, props.state].filter(Boolean).filter((part) => part !== name);
  return { label: name, detail: area.slice(0, 2).join(", ") };
}

/**
 * Records the coordinates of a suggestion the user may pick, so verifying
 * that exact text later uses the same point without another lookup.
 */
export function rememberPlace(text, place) {
  const key = norm(text);
  if (!key || verifyCache.has(key)) return;
  verifyCache.set(key, { label: place.label, detail: place.detail, lat: place.lat, lng: place.lng, source: "osm" });
}

/**
 * Search-as-you-type suggestions near campus.
 * @returns {Promise<Array<{label: string, detail: string, lat: number, lng: number}>>}
 */
export async function suggestPlaces(query, signal) {
  const key = norm(query);
  if (key.length < 3) return [];
  if (suggestCache.has(key)) return suggestCache.get(key);
  const params = new URLSearchParams({ q: query, lat: String(CAMPUS.lat), lon: String(CAMPUS.lng), limit: "8", lang: "en" });
  const response = await fetch(`${PHOTON_URL}?${params}`, { signal });
  if (!response.ok) return [];
  const data = await response.json();
  const seen = new Set();
  const results = (data.features || [])
    .filter((feature) => feature.properties?.countrycode === "IN")
    .map((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      return { ...photonLabel(feature.properties), lat, lng };
    })
    .filter((place) => place.label && nearCampus(place))
    .filter((place) => {
      const id = `${norm(place.label)}|${norm(place.detail)}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .slice(0, 5);
  suggestCache.set(key, results);
  return results;
}

/**
 * Resolves free text to one place near campus, or null when it cannot be
 * found. Curated places resolve without a network call.
 * @returns {Promise<{label: string, detail: string, lat: number, lng: number, source: string} | null>}
 */
export async function verifyPlace(text, signal) {
  const known = findKnownPlace(text);
  if (known) return known;
  const key = norm(text);
  if (key.length < 2) return null;
  if (verifyCache.has(key)) return verifyCache.get(key);
  const params = new URLSearchParams({
    q: text,
    format: "jsonv2",
    limit: "3",
    countrycodes: "in",
    viewbox: VIEWBOX,
    "accept-language": "en",
  });
  const response = await fetch(`${NOMINATIM_URL}?${params}`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`lookup ${response.status}`);
  const rows = await response.json();
  const match = rows
    .map((row) => ({
      label: row.name || row.display_name.split(",")[0],
      detail: row.display_name.split(",").slice(1, 3).map((part) => part.trim()).join(", "),
      lat: Number(row.lat),
      lng: Number(row.lon),
      source: "osm",
    }))
    .find((place) => Number.isFinite(place.lat) && nearCampus(place));
  const result = match || null;
  verifyCache.set(key, result);
  return result;
}

function curvedFallback(a, b) {
  // A gentle arc when no road route is available, so the map still shows a path.
  const steps = 24;
  const midLat = (a.lat + b.lat) / 2 + (b.lng - a.lng) * 0.12;
  const midLng = (a.lng + b.lng) / 2 - (b.lat - a.lat) * 0.12;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const u = 1 - t;
    points.push([u * u * a.lat + 2 * u * t * midLat + t * t * b.lat, u * u * a.lng + 2 * u * t * midLng + t * t * b.lng]);
  }
  return points;
}

/**
 * Route between two points as [lat, lng] pairs, plus distance, duration and
 * travel mode when the router answers. Falls back to an arc.
 * @returns {Promise<{points: Array<[number, number]>, distanceKm: number|null, minutes: number|null,
 *   mode: "walk"|"drive", approximate: boolean}>}
 */
export async function fetchRoute(a, b, signal) {
  const key = `${a.lat.toFixed(4)},${a.lng.toFixed(4)};${b.lat.toFixed(4)},${b.lng.toFixed(4)}`;
  if (routeCache.has(key)) return routeCache.get(key);
  const mode = distanceKm(a, b) < WALK_LIMIT_KM ? "walk" : "drive";
  let result;
  try {
    const base = mode === "walk" ? OSRM_WALK_URL : OSRM_DRIVE_URL;
    const url = `${base}${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal });
    const data = response.ok ? await response.json() : null;
    const route = data?.routes?.[0];
    if (!route) throw new Error("no route");
    result = {
      points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      distanceKm: route.distance / 1000,
      minutes: Math.max(1, Math.round(route.duration / 60)),
      mode,
      approximate: false,
    };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    result = { points: curvedFallback(a, b), distanceKm: distanceKm(a, b), minutes: null, mode, approximate: true };
  }
  routeCache.set(key, result);
  return result;
}
