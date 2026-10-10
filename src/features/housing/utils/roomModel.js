// Normalises GET /api/rooms rows and derives what the landing page shows
// (rent spectrum, neighbourhoods, move-in months) from the real listings.
// Field names follow unishare-backend routes/api/rooms.js.

const DAY = 86400000;

function toNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Local date from "YYYY-MM-DD" without a UTC shift. */
function parseDate(text) {
  if (!text) return null;
  const [y, m, d] = String(text).slice(0, 10).split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return Number.isNaN(date.getTime()) ? null : date;
}

function photoList(photos) {
  if (Array.isArray(photos)) return photos.filter((p) => typeof p === "string" && p.trim());
  if (typeof photos === "string") {
    try {
      return photoList(JSON.parse(photos));
    } catch {
      return photos.trim() ? [photos.trim()] : [];
    }
  }
  return [];
}

/** The listing as the landing page uses it. Contact details are left out on purpose. */
export function normalizeRoom(raw) {
  return {
    id: raw.id,
    title: (raw.title || "").trim() || "Room near campus",
    rent: toNumber(raw.rent, NaN),
    location: (raw.location || "").trim(),
    beds: Math.max(1, toNumber(raw.beds, 1)),
    moveIn: parseDate(raw.move_in_date),
    photos: photoList(raw.photos),
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
  };
}

/** The neighbourhood a free-text location belongs to: its first part, tidied. */
export function areaOf(location = "") {
  const first = location.split(/[,|/–-]/)[0].trim().replace(/\s+/g, " ");
  if (!first) return "";
  return first
    .toLowerCase()
    .replace(/\b(near|opp\.?|opposite|behind)\b.*$/, "")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
};

/** Neighbourhoods with at least one room, busiest first. */
export function neighbourhoods(rooms) {
  const groups = new Map();
  for (const room of rooms) {
    const name = areaOf(room.location);
    if (!name) continue;
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(room);
  }
  return [...groups.entries()]
    .map(([name, list]) => {
      const rents = list.map((r) => r.rent).filter(Number.isFinite);
      return {
        name,
        count: list.length,
        median: median(rents),
        min: rents.length ? Math.min(...rents) : null,
        cover: list.find((r) => r.photos.length)?.photos[0] || null,
      };
    })
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/**
 * Budget steps for the "under" picker, rounded to tidy amounts and spread
 * across the rents actually listed.
 */
export function budgetSteps(rooms) {
  const rents = rooms.map((r) => r.rent).filter((r) => Number.isFinite(r) && r > 0).sort((a, b) => a - b);
  if (!rents.length) return [];
  const round = (v) => (v < 10000 ? Math.ceil(v / 500) * 500 : Math.ceil(v / 1000) * 1000);
  const picks = [0.25, 0.5, 0.75, 1].map((q) => round(rents[Math.min(rents.length - 1, Math.floor(q * (rents.length - 1)))]));
  return [...new Set(picks)];
}

/** Rooms matching the sentence search. Area is a plain "contains" match on the location text. */
export function matchRooms(rooms, filters, now = new Date()) {
  const area = (filters.area || "").trim().toLowerCase();
  return rooms.filter((room) => {
    if (area && !room.location.toLowerCase().includes(area)) return false;
    if (filters.maxRent && Number.isFinite(room.rent) && room.rent > filters.maxRent) return false;
    // "4+" means four or more; any typed number is matched exactly.
    if (filters.beds && (filters.beds === "4+" ? room.beds < 4 : room.beds !== Number(filters.beds))) return false;
    if (filters.moveIn && /^\d{4}-\d{2}-\d{2}$/.test(filters.moveIn)) {
      // A typed date: the room must be free on or before it.
      const [y, mo, d] = filters.moveIn.split("-").map(Number);
      if (room.moveIn && room.moveIn > new Date(y, mo - 1, d)) return false;
    } else if (filters.moveIn) {
      const key = moveInKey(room, now);
      // "Now" means free today; a month means free by the end of that month.
      if (filters.moveIn === "now" ? key !== "now" : key !== "now" && key > filters.moveIn) return false;
    }
    return true;
  });
}

/** "now" when the room is free today or earlier, else "YYYY-MM" of the move-in month. */
export function moveInKey(room, now = new Date()) {
  if (!room.moveIn || room.moveIn <= now) return "now";
  return `${room.moveIn.getFullYear()}-${String(room.moveIn.getMonth() + 1).padStart(2, "0")}`;
}

/** Now plus the next five months, as move-in options. */
export function moveInOptions(now = new Date()) {
  const options = [{ key: "now" }];
  for (let i = 0; i < 5; i += 1) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, date: d });
  }
  return options;
}

export function isNew(room, now = new Date()) {
  return Boolean(room.createdAt && now - room.createdAt < 3 * DAY);
}

export const SORTS = ["newest", "cheapest", "soonest"];
const time = (d) => (d ? d.getTime() : 0);
const COMPARE = {
  newest: (a, b) => time(b.createdAt) - time(a.createdAt),
  cheapest: (a, b) => (Number.isFinite(a.rent) ? a.rent : Infinity) - (Number.isFinite(b.rent) ? b.rent : Infinity),
  soonest: (a, b) => time(a.moveIn) - time(b.moveIn),
};
export const sortRooms = (rooms, sort) => [...rooms].sort(COMPARE[sort] || COMPARE.newest);
