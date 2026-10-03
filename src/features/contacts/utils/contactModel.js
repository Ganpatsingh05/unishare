// Shapes rows from GET /api/contacts and reads opening hours.

export const KNOWN_CATEGORIES = ["emergency", "administration", "academics", "hostel", "student"];
const DAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Phones and emails arrive as strings or as objects like
// { type: "landline", number: "..." } / { type: "work", address: "..." }.
function list(key, ...values) {
  const out = [];
  const take = (x) => {
    if (x == null) return;
    if (typeof x === "object") take(x[key] ?? x.value);
    else out.push(...String(x).split(/[,;/]/));
  };
  for (const v of values) (Array.isArray(v) ? v : [v]).forEach(take);
  return [...new Set(out.map((x) => x.trim()).filter(Boolean))];
}

/** Digits and a leading + only, for tel: links. */
export const telHref = (number) => `tel:${String(number).replace(/(?!^\+)[^\d]/g, "")}`;

export function normalizeContact(raw) {
  return {
    id: String(raw.id),
    name: (raw.name || "").trim() || "Unnamed",
    role: (raw.role || "").trim(),
    phones: list("number", raw.phones, raw.phone),
    emails: list("address", raw.emails, raw.email).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)),
    category: (raw.category || "").trim().toLowerCase() || "administration",
    location: (raw.location || "").trim(),
    hours: (raw.hours || "").trim(),
  };
}

const toMinutes = (h, m) => Number(h) * 60 + Number(m || 0);

/**
 * Reads simple hours like "24/7", "Mon-Fri 9:00–17:00" or
 * "Mon-Sat 9-18; Sun 10:00-14:00". Returns true/false for open now, or null
 * when the text is anything else, so we never guess wrongly.
 */
export function isOpenNow(hours, now = new Date()) {
  const text = (hours || "").toLowerCase().trim();
  if (!text) return null;
  if (/^(24\s*[/x×]\s*7|24 hours|always open)$/.test(text)) return true;
  const today = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  let understood = false;
  for (const part of text.split(/[;,]/)) {
    const m = part.trim().match(/^([a-z]{3})[a-z]*(?:\s*[-–]\s*([a-z]{3})[a-z]*)?\s+(\d{1,2})(?::(\d{2}))?\s*[-–]\s*(\d{1,2})(?::(\d{2}))?$/);
    if (!m) return null;
    const from = DAYS.indexOf(m[1]);
    const to = m[2] ? DAYS.indexOf(m[2]) : from;
    if (from < 0 || to < 0) return null;
    understood = true;
    const inDays = from <= to ? today >= from && today <= to : today >= from || today <= to;
    if (inDays && minutes >= toMinutes(m[3], m[4]) && minutes < toMinutes(m[5], m[6])) return true;
  }
  return understood ? false : null;
}

export function matchContacts(items, { category = "all", query = "" }) {
  const q = query.trim().toLowerCase();
  return items.filter((c) => {
    if (category !== "all" && c.category !== category) return false;
    if (q && !`${c.name} ${c.role} ${c.location} ${c.phones.join(" ")} ${c.emails.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

export function categoriesIn(items) {
  const seen = new Set(items.map((c) => c.category));
  return [...KNOWN_CATEGORIES.filter((k) => seen.has(k)), ...[...seen].filter((k) => !KNOWN_CATEGORIES.includes(k)).sort()];
}
