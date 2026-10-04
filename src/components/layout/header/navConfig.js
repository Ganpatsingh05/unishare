import {
  BookOpen,
  Car,
  CircleHelp,
  FileText,
  Flag,
  History,
  House,
  Info,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  Phone,
  ScrollText,
  Search,
  Settings,
  ShieldCheck,
  Tag,
  Ticket,
  User,
} from "lucide-react";

/**
 * Every UniShare feature, in the order the header shows them. `base` is the
 * route prefix that marks a page as part of the feature; `ink` is [light, dark].
 */
export const FEATURES = [
  { key: "rides", label: "Rides", desc: "Find or offer a ride", href: "/share-ride", base: "/share-ride", icon: Car, ink: ["#1D5FD1", "#7CB8FF"] },
  { key: "rooms", label: "Housing", desc: "Rooms and flatmates nearby", href: "/housing", base: "/housing", icon: House, ink: ["#0F766E", "#5EEAD4"] },
  { key: "market", label: "Marketplace", desc: "Buy and sell with students", href: "/marketplace/buy", base: "/marketplace", icon: Tag, ink: ["#B45309", "#FDBA74"] },
  { key: "tickets", label: "Tickets", desc: "Event tickets, passed on fairly", href: "/ticket", base: "/ticket", icon: Ticket, ink: ["#7C3AED", "#C4B5FD"] },
  { key: "lostfound", label: "Lost & Found", desc: "Report it, find it, return it", href: "/lost-found", base: "/lost-found", icon: Search, ink: ["#B91C1C", "#FCA5A5"] },
  { key: "announcements", label: "Announcements", short: "Announce­ments", desc: "What's happening on campus", href: "/announcements", base: "/announcements", icon: Megaphone, ink: ["#BE185D", "#F9A8D4"] },
  { key: "resources", label: "Resources", desc: "Notes and guides by students", href: "/resources", base: "/resources", icon: BookOpen, ink: ["#4338CA", "#A5B4FC"] },
  { key: "contacts", label: "Contacts", desc: "Campus numbers, on call", href: "/contacts", base: "/contacts", icon: Phone, ink: ["#0369A1", "#7DD3FC"] },
];

/** Things people come to post. Shown in the Explore menu and the search. */
export const QUICK_ACTIONS = [
  { label: "Offer a ride", href: "/share-ride/postride", feature: "rides" },
  { label: "List a room", href: "/housing/post", feature: "rooms" },
  { label: "Sell an item", href: "/marketplace/sell", feature: "market" },
  { label: "Report a lost item", href: "/lost-found/report", feature: "lostfound" },
  { label: "Post an announcement", href: "/announcements/submit", feature: "announcements" },
];

export const ACCOUNT_LINKS = [
  { label: "My profile", href: "/profile", icon: User },
  { label: "My activity", href: "/my-activity", icon: History },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const HELP_LINKS = [
  { label: "Help centre", href: "/info/help", icon: LifeBuoy },
  { label: "FAQs", href: "/info/faqs", icon: CircleHelp },
];

export const featureByKey = Object.fromEntries(FEATURES.map((f) => [f.key, f]));

/** The feature the current page belongs to, or null. */
export function sectionFor(pathname) {
  if (!pathname) return null;
  return FEATURES.find((f) => pathname === f.base || pathname.startsWith(`${f.base}/`)) || null;
}

/** True when `href` is the current page or a parent of it. */
export function isCurrent(pathname, href) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const feature = (key) => featureByKey[key];
const action = (label, href, key, keywords = "") => ({ group: "Actions", label, hint: feature(key).label, href, icon: feature(key).icon, ink: feature(key).ink, keywords: `${feature(key).label} ${keywords}` });
const page = (group, label, href, icon, keywords = "") => ({ group, label, href, icon, ink: null, keywords });

/** Everything the search palette can jump to. */
export const SEARCH_INDEX = [
  ...FEATURES.map((f) => ({ group: "Features", label: f.label, hint: f.desc, href: f.href, icon: f.icon, ink: f.ink, keywords: f.desc })),
  action("Find a ride", "/share-ride/findride", "rides", "search travel carpool"),
  action("Offer a ride", "/share-ride/postride", "rides", "post driver carpool"),
  action("Manage my rides", "/share-ride/manage", "rides", "edit delete"),
  action("Search rooms", "/housing/search", "rooms", "pg flat hostel rent"),
  action("List a room", "/housing/post", "rooms", "post rent flatmate"),
  action("Manage my rooms", "/housing/manage", "rooms", "edit delete listings"),
  action("Browse the marketplace", "/marketplace/buy", "market", "shop buy"),
  action("Sell an item", "/marketplace/sell", "market", "post listing"),
  action("Buy tickets", "/ticket/buy", "tickets", "event concert"),
  action("Sell tickets", "/ticket/sell", "tickets", "event resale"),
  action("My tickets", "/ticket/my-tickets", "tickets", "manage"),
  action("Report a lost or found item", "/lost-found/report", "lostfound", "missing"),
  action("Post an announcement", "/announcements/submit", "announcements", "event notice"),
  action("Manage my announcements", "/announcements/manage", "announcements", "edit delete"),
  action("Suggest a resource", "/resources/suggest", "resources", "notes upload share"),
  action("Manage my resources", "/resources/manage", "resources", "edit delete"),
  page("Account", "My profile", "/profile", User, "pass account me"),
  page("Account", "My activity", "/my-activity", History, "requests history"),
  page("Account", "Settings", "/settings", Settings, "password theme account"),
  page("Help", "Help centre", "/info/help", LifeBuoy, "support"),
  page("Help", "FAQs", "/info/faqs", CircleHelp, "questions"),
  page("Help", "About UniShare", "/info/about", Info, "mission team"),
  page("Help", "Community guidelines", "/info/guidelines", ScrollText, "rules"),
  page("Help", "Send feedback", "/info/feedback", MessageSquare, "suggestion"),
  page("Help", "Report a problem", "/info/report", Flag, "bug abuse"),
  page("Help", "Privacy policy", "/info/privacy", ShieldCheck, "data"),
  page("Help", "Terms of use", "/info/terms", FileText, "legal"),
];

/** Rank index entries against a query; best matches first. */
export function searchIndex(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = [];
  for (const item of SEARCH_INDEX) {
    const label = item.label.toLowerCase();
    let score = 0;
    if (label.startsWith(q)) score = 4;
    else if (label.split(/\s+/).some((w) => w.startsWith(q))) score = 3;
    else if (label.includes(q)) score = 2;
    else if (`${item.keywords} ${item.hint || ""}`.toLowerCase().includes(q)) score = 1;
    if (score) scored.push({ item, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.item);
}
