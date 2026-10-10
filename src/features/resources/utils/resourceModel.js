// Shapes rows from GET /api/resources for the library page.

export const KNOWN_CATEGORIES = ["academics", "tools", "campus", "docs", "media"];
export const RESOURCE_TYPES = ["link", "pdf", "doc", "video"];

function tagList(tags) {
  const raw = Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",") : [];
  return [...new Set(raw.map((x) => String(x).trim().toLowerCase()).filter(Boolean))];
}

/** Only http(s) links are ever rendered as hrefs. */
export function safeUrl(url) {
  try {
    const u = new URL(String(url || "").trim());
    return ["http:", "https:"].includes(u.protocol) ? u.href : null;
  } catch {
    return null;
  }
}

export function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function normalizeResource(raw) {
  const url = safeUrl(raw.url);
  return {
    id: String(raw.id),
    title: (raw.title || "").trim() || "Untitled",
    desc: (raw.desc || "").trim(),
    url,
    domain: url ? domainOf(url) : "",
    category: (raw.category || "").trim().toLowerCase() || "academics",
    type: RESOURCE_TYPES.includes(raw.type) ? raw.type : "link",
    tags: tagList(raw.tags),
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
  };
}

export function matchResources(list, { category = "all", type = "all", query = "" }) {
  const q = query.trim().toLowerCase();
  return list.filter((r) => {
    if (category !== "all" && r.category !== category) return false;
    if (type !== "all" && r.type !== type) return false;
    if (q && !`${r.title} ${r.desc} ${r.tags.join(" ")} ${r.domain}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

/** Categories to offer as filters: known ones that appear, then any others. */
export function categoriesIn(list) {
  const seen = new Set(list.map((r) => r.category));
  return [...KNOWN_CATEGORIES.filter((c) => seen.has(c)), ...[...seen].filter((c) => !KNOWN_CATEGORIES.includes(c)).sort()];
}
