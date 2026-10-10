// Community guidelines, written to be scanned: short lines, grouped by what
// the reader is doing on UniShare.

export const UPDATED = "4 October 2026";

export const BASICS = [
  { title: "Stay safe", text: "Meet in public places on campus and trust your instincts." },
  { title: "Be honest", text: "Post real things, with real details and photos." },
  { title: "Be respectful", text: "No harassment, hate or pressure. Ever." },
  { title: "Follow through", text: "Do what you agreed to, or say so early." },
];

// `feature` matches a key in the header's FEATURES list for icon and colour.
export const ACTIVITIES = [
  {
    key: "rides",
    feature: "rides",
    label: "Rides",
    lead: "Sharing a ride only works when both sides do what they said.",
    do: [
      "Post the real route, time and seats",
      "Be at the pickup point on time",
      "Say early if your plans change",
      "Split costs exactly as agreed",
    ],
    dont: [
      "Drive tired, or after drinking",
      "Bring extra people nobody agreed to",
      "Change the price after someone confirms",
      "Leave someone waiting without a word",
    ],
    link: { label: "Go to Rides", href: "/share-ride" },
  },
  {
    key: "rooms",
    feature: "rooms",
    label: "Housing",
    lead: "Finding a room is a big decision. Make it easy to decide well.",
    do: [
      "Use current photos of the real room",
      "Be clear about rent, deposit and house rules",
      "Treat everyone who asks the same way",
      "Visit before you commit, ideally with a friend",
    ],
    dont: [
      "Take money before someone has seen the room",
      "Turn people away for their religion, caste, gender or identity",
      "Leave the listing up once the room is taken",
    ],
    link: { label: "Go to Housing", href: "/housing" },
  },
  {
    key: "market",
    feature: "market",
    label: "Buying and selling",
    lead: "Covers the marketplace and tickets. Keep it fair and simple.",
    do: [
      "Use your own photos and mention any flaws",
      "Hand things over somewhere public on campus",
      "Check the item before you pay",
      "Mark it sold once it's gone",
    ],
    dont: [
      "Ask for money before the buyer has seen it",
      "List things you don't have",
      "Resell tickets for more than you paid",
      "Sell anything illegal, stolen or fake",
    ],
    link: { label: "Go to the Marketplace", href: "/marketplace/buy" },
  },
  {
    key: "lostfound",
    feature: "lostfound",
    label: "Lost & Found",
    lead: "Help things get back to the right person.",
    do: [
      "Say where and when it was lost or found",
      "Ask a claimant something only the owner would know",
      "Hand items back somewhere public",
    ],
    dont: [
      "Claim something that isn't yours",
      "Show ID numbers or card details in photos",
    ],
    link: { label: "Go to Lost & Found", href: "/lost-found" },
  },
  {
    key: "posts",
    feature: "announcements",
    label: "Announcements and notes",
    lead: "The UniShare team reviews these before anyone else sees them.",
    do: [
      "Post real events and notices for students",
      "Include the date, time and place",
      "Share notes you made, or are allowed to share",
    ],
    dont: [
      "Advertise businesses not run by students",
      "Share paid material or exam papers that aren't public",
      "Post the same thing again and again",
    ],
    link: { label: "Go to Announcements", href: "/announcements" },
  },
];

export const NEVER = [
  { title: "Harassment and hate", text: "Threats, bullying, unwanted sexual messages, or attacks on who someone is." },
  { title: "Scams and fake listings", text: "Taking money without delivering, fake photos, or pretending to be someone else." },
  { title: "Putting people at risk", text: "Unsafe driving, pushing someone to meet in private, or sharing their details." },
  { title: "Spam and fake accounts", text: "Mass posting, or new accounts to get around a restriction." },
];

export const NEVER_NOTE = "Explicit content, illegal items, and anything against the law or your university's rules are also not allowed.";

export const REPORT_STEPS = [
  "Open Report a problem.",
  "Say what happened, who or which post, and when.",
  "The UniShare team reviews it and acts.",
];

// From lightest to most serious. What we do depends on what happened.
export const CONSEQUENCES = [
  { title: "Post removed", text: "Anything that breaks these rules comes down." },
  { title: "A warning", text: "We tell you what to change." },
  { title: "Account limited", text: "For serious or repeated problems." },
  { title: "Account removed", text: "When someone's safety or the law is involved, we may also tell the university or police." },
];

export const RELATED = [
  { label: "Safety guidelines", href: "/info/support-guidelines" },
  { label: "Help centre", href: "/info/help" },
  { label: "Terms of service", href: "/info/terms" },
];
