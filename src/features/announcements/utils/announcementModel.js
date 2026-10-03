// Shapes rows from GET /api/announcements for the landing page.

export const KNOWN_TAGS = ["general", "events", "academics", "alerts", "clubs"];
const PRIORITY_RANK = { high: 0, normal: 1, low: 2 };

function tagList(tags) {
  const raw = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [];
  const clean = raw.map((x) => String(x).trim().toLowerCase()).filter(Boolean);
  return clean.length ? [...new Set(clean)] : ["general"];
}

export function normalizeAnnouncement(raw) {
  return {
    id: String(raw.id),
    title: (raw.title || "").trim() || "Untitled",
    body: (raw.body || "").trim(),
    priority: ["high", "normal", "low"].includes(raw.priority) ? raw.priority : "normal",
    tags: tagList(raw.tags),
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
  };
}

/** Newest first; urgent ones float to the top of their own day. */
export function sortFeed(list) {
  return [...list].sort((a, b) => {
    const da = a.createdAt ? a.createdAt.toDateString() : "";
    const db = b.createdAt ? b.createdAt.toDateString() : "";
    if (da !== db) return (b.createdAt || 0) - (a.createdAt || 0);
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || (b.createdAt || 0) - (a.createdAt || 0);
  });
}

export function matchFeed(list, { tag = "all", query = "", urgentOnly = false }) {
  const q = query.trim().toLowerCase();
  return list.filter((a) => {
    if (tag !== "all" && !a.tags.includes(tag)) return false;
    if (urgentOnly && a.priority !== "high") return false;
    if (q && !`${a.title} ${a.body} ${a.tags.join(" ")}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Topics to offer as filters: the known ones that appear, then any others. */
export function topicsIn(list) {
  const seen = new Set(list.flatMap((a) => a.tags));
  return [...KNOWN_TAGS.filter((t) => seen.has(t)), ...[...seen].filter((t) => !KNOWN_TAGS.includes(t)).sort()];
}

/** Groups a sorted list into day buckets: [{ key, date, items }]. */
export function groupByDay(list) {
  const groups = [];
  for (const item of list) {
    const key = item.createdAt ? item.createdAt.toDateString() : "undated";
    const last = groups[groups.length - 1];
    if (last && last.key === key) last.items.push(item);
    else groups.push({ key, date: item.createdAt, items: [item] });
  }
  return groups;
}
