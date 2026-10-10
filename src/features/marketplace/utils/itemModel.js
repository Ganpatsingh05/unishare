// Shapes rows from /api/itemsell for the buy pages.

export const CATEGORIES = ["electronics", "books", "furniture", "accessories", "cycles", "gaming", "other"];
export const CONDITIONS = ["new", "like-new", "good", "fair", "damaged"];
const DAY = 86400000;

function photoOf(raw) {
  const list = [raw.image_url, ...(Array.isArray(raw.photos) ? raw.photos : [])];
  return list.find((p) => typeof p === "string" && /^https?:\/\//.test(p.trim())) || null;
}

export function normalizeItem(raw) {
  const price = Number(raw.price);
  return {
    id: String(raw.id),
    title: (raw.title || "").trim() || "Untitled item",
    price: Number.isFinite(price) && price >= 0 ? price : null,
    category: CATEGORIES.includes((raw.category || "").toLowerCase()) ? raw.category.toLowerCase() : "other",
    condition: CONDITIONS.includes(raw.condition) ? raw.condition : "good",
    location: (raw.location || "").trim(),
    description: (raw.description || "").trim(),
    photo: photoOf(raw),
    seller: (raw.users?.name || "").trim(),
    sellerId: raw.user_id || raw.users?.id || null,
    contact: raw.contact_info && typeof raw.contact_info === "object" ? raw.contact_info : {},
    availableFrom: raw.available_from ? new Date(raw.available_from) : null,
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
  };
}

export const rupees = (n) => (n === null ? "—" : `₹${Math.round(n).toLocaleString("en-IN")}`);

export function ageText(date, strings, now = new Date()) {
  if (!date) return "";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / DAY);
  if (days <= 0) return strings.today;
  if (days === 1) return strings.yesterday;
  return strings.days(days);
}

export function matchItems(list, { category = "all", condition = "all", query = "", sort = "newest" }) {
  const q = query.trim().toLowerCase();
  const out = list.filter((it) => {
    if (category !== "all" && it.category !== category) return false;
    if (condition !== "all" && it.condition !== condition) return false;
    if (q && !`${it.title} ${it.description} ${it.location} ${it.category}`.toLowerCase().includes(q)) return false;
    return true;
  });
  if (sort === "low") out.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  else if (sort === "high") out.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  else out.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return out;
}
