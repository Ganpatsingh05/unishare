// Deep links from the landing page into the existing find and post flows.
// Both pages read these keys once on mount (see readRidePrefill).

export const RIDE_ROUTES = {
  home: "/share-ride",
  find: "/share-ride/findride",
  post: "/share-ride/postride",
  manage: "/share-ride/manage",
  login: "/login",
};

const KEYS = ["from", "to", "date", "time", "seats"];

function withQuery(base, values) {
  const params = new URLSearchParams();
  for (const key of KEYS) {
    const value = values[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  }
  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export const buildFindHref = (values) => withQuery(RIDE_ROUTES.find, values);
export const buildPostHref = (values) => withQuery(RIDE_ROUTES.post, values);
export const buildLoginHref = (redirect = RIDE_ROUTES.home) =>
  `${RIDE_ROUTES.login}?redirect=${encodeURIComponent(redirect)}`;

/**
 * Reads landing-page prefill from the current URL. Client-only; call inside
 * useEffect so server and first client render match.
 * @returns {{from?: string, to?: string, date?: string, time?: string, seats?: number}}
 */
export function readRidePrefill() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (!value) continue;
    if (key === "seats") {
      const n = Number.parseInt(value, 10);
      if (Number.isFinite(n) && n > 0) result.seats = n;
    } else if (key === "date") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) result.date = value;
    } else if (key === "time") {
      if (/^\d{2}:\d{2}$/.test(value)) result.time = value;
    } else {
      result[key] = value.slice(0, 120);
    }
  }
  return result;
}
