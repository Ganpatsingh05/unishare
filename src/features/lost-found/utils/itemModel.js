// Turns API rows from /api/lostfound into the shape the landing page uses,
// and guesses a kind of item from its name (the API has no category field).

const DAY = 86400000;

// Order matters: the first matching kind wins.
export const CATEGORIES = [
  { key: "wallet", words: ["wallet", "purse", "card holder", "cardholder", "money"] },
  { key: "id", words: ["id card", "identity", "i-card", "icard", "aadhaar", "aadhar", "license", "licence", "pan card", "student card", "card"] },
  { key: "keys", words: ["key", "keychain", "keyring"] },
  { key: "charger", words: ["charger", "charging", "cable", "power bank", "powerbank", "adapter", "adaptor", "plug", "type c", "usb"] },
  { key: "watch", words: ["watch", "smartwatch", "smart watch", "fitbit", "smart band", "fitness band"] },
  { key: "audio", words: ["airpod", "airdope", "earpod", "tws", "earphone", "earbud", "headphone", "headset", "buds", "neckband"] },
  { key: "phone", words: ["phone", "iphone", "mobile", "samsung", "redmi", "oneplus", "pixel"] },
  { key: "laptop", words: ["laptop", "macbook", "tablet", "ipad", "mouse", "calculator"] },
  { key: "bag", words: ["bag", "backpack", "pouch", "tote", "umbrella", "jacket", "hoodie"] },
  { key: "bottle", words: ["bottle", "flask", "tumbler", "mug", "tiffin", "lunch box"] },
  { key: "glasses", words: ["glasses", "spectacles", "specs", "sunglasses", "goggles"] },
  { key: "jewel", words: ["ring", "earring", "bracelet", "chain", "necklace", "pendant", "anklet", "jewel"] },
  { key: "books", words: ["book", "notebook", "notes", "register", "diary", "file", "copy"] },
];

export function categoryOf(text = "") {
  // Words must start at a word boundary, so "ring" doesn't match "engineering".
  const value = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ")} `;
  const hit = CATEGORIES.find((c) => c.words.some((w) => value.includes(` ${w.replace(/[^a-z0-9]+/g, " ")}`)));
  return hit ? hit.key : "other";
}

function parseDay(value) {
  if (!value) return null;
  const [y, mo, d] = String(value).slice(0, 10).split("-").map(Number);
  return y ? new Date(y, mo - 1, d) : null;
}

function imageList(value) {
  if (Array.isArray(value)) return value.filter((v) => typeof v === "string" && v.trim());
  if (typeof value === "string" && value.trim()) {
    try {
      return imageList(JSON.parse(value));
    } catch {
      return [value.trim()];
    }
  }
  return [];
}

/** Short, stable code printed on found-item tickets. */
export const ticketCode = (id = "") => String(id).replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase() || "0000";

export function normalizeItem(raw) {
  const lost = raw.mode === "lost";
  const name = (raw.item_name || "").trim() || "Unnamed item";
  return {
    id: raw.id,
    mode: lost ? "lost" : "found",
    name,
    description: (raw.description || "").trim(),
    place: ((lost ? raw.where_last_seen : raw.where_found) || "").trim(),
    date: parseDay(lost ? raw.date_lost : raw.date_found),
    time: ((lost ? raw.time_lost : raw.time_found) || "").slice(0, 5),
    images: imageList(raw.image_urls),
    contact: raw.contact_info && typeof raw.contact_info === "object" ? raw.contact_info : {},
    poster: raw.users?.name || "",
    ownerId: raw.user_id || raw.users?.id || null,
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
    category: categoryOf(name) !== "other" ? categoryOf(name) : categoryOf(raw.description || ""),
  };
}

/** Whole days between the item's date (or post date) and today. */
export function ageInDays(item, now = new Date()) {
  const ref = item.date || item.createdAt;
  if (!ref) return null;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const day = new Date(ref);
  day.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today - day) / DAY));
}

export function matchItems(items, { mode = "all", category = "all", query = "" }) {
  const q = query.trim().toLowerCase();
  return items.filter((item) => {
    if (mode !== "all" && item.mode !== mode) return false;
    if (category !== "all" && item.category !== category) return false;
    if (q && !`${item.name} ${item.description} ${item.place}`.toLowerCase().includes(q)) return false;
    return true;
  });
}
