// Shared facts for the legal pages. Keep these in step with how UniShare
// actually works; each page's text depends on them.

export const LEGAL_UPDATED = "5 October 2026";
export const CONTACT_EMAIL = "support.unisharelpu@gmail.com";
export const MAILTO = `mailto:${CONTACT_EMAIL}`;

// Services that receive data to make UniShare work.
export const PROCESSORS = [
  ["Supabase", "Stores the database (accounts, profiles, posts, requests) and the photos you upload.", "Everything you give UniShare"],
  ["Render", "Runs UniShare's server, in the United States.", "Requests your browser sends to UniShare"],
  ["Vercel", "Hosts the UniShare website.", "Pages you load, and your IP address"],
  ["Google", "Sign in with Google, and the forms behind Report a problem and Send feedback.", "Your Google name, email and photo when you sign in; what you write in a report or feedback"],
  ["Map services", "Photon (Komoot), OpenStreetMap Nominatim, OSRM and Esri suggest places and draw the route map for rides.", "The place names you type, and your IP address"],
];

export const LEGAL_RELATED = [
  { label: "Privacy policy", href: "/info/privacy" },
  { label: "Terms of service", href: "/info/terms" },
  { label: "Cookie policy", href: "/info/cookies" },
  { label: "Data protection", href: "/info/data-protection" },
];

export const relatedExcept = (href) => LEGAL_RELATED.filter((r) => r.href !== href);
