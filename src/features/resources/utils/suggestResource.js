// Suggest form: limits (match POST /api/resources/suggest validation),
// a type guess from the link, checks, and the payload.
import { domainOf, KNOWN_CATEGORIES, RESOURCE_TYPES, safeUrl } from "./resourceModel";

export const LIMITS = { title: 150, desc: 500, url: 500, tag: 30, tags: 8 };
export const SUGGEST_CATEGORIES = KNOWN_CATEGORIES;

export const initialSuggestion = () => ({ url: "", title: "", desc: "", category: "", type: "link", tags: [] });

/** Best guess at a type from the link; null when nothing stands out. */
export function guessType(url) {
  const safe = safeUrl(url);
  if (!safe) return null;
  const host = domainOf(safe);
  const path = new URL(safe).pathname.toLowerCase();
  if (path.endsWith(".pdf")) return "pdf";
  if (/(^|\.)(youtube\.com|youtu\.be|vimeo\.com)$/.test(host)) return "video";
  if (host === "docs.google.com" || /\.(docx?|pptx?|odt)$/.test(path)) return "doc";
  return "link";
}

/** Field errors keyed like the form; empty when valid. */
export function validateSuggestion(form) {
  const errors = {};
  if (!safeUrl(form.url)) errors.url = "url";
  if (!form.title.trim()) errors.title = "title";
  if (!form.category) errors.category = "category";
  return errors;
}

export function cleanTag(text) {
  return text.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "-").slice(0, LIMITS.tag);
}

/** Body for POST /api/resources/suggest and PUT /api/resources/my/:id. */
export function toPayload(form) {
  return {
    title: form.title.trim().slice(0, LIMITS.title),
    desc: form.desc.trim().slice(0, LIMITS.desc),
    url: safeUrl(form.url),
    category: form.category,
    type: RESOURCE_TYPES.includes(form.type) ? form.type : "link",
    tags: form.tags.slice(0, LIMITS.tags),
  };
}
