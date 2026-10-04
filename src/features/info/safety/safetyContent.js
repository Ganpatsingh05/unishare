// Safety guidelines: practical advice for meeting, riding and trading with
// other students. Only describes what UniShare actually does.

export const UPDATED = "4 October 2026";

// Any meet-up, in the order it happens.
export const MEETUP = [
  {
    key: "before",
    title: "Before you meet",
    items: [
      "Read the post and profile, and ask questions",
      "Agree on a time and a public place",
      "Tell a friend who you're meeting and where",
    ],
  },
  {
    key: "during",
    title: "When you meet",
    items: [
      "Stick to busy, well-lit spots on campus",
      "Bring a friend if you can",
      "Check what you're getting before you pay",
    ],
  },
  {
    key: "after",
    title: "Afterwards",
    items: [
      "Keep screenshots of what was agreed",
      "Mark your post as done so nobody else waits",
      "Report anything that felt wrong",
    ],
  },
];

// `feature` matches a key in the header's FEATURES list for icon and colour.
export const ACTIVITIES = [
  {
    key: "rides",
    feature: "rides",
    label: "Rides",
    tips: [
      "Send a friend the route, the time and who you're riding with",
      "Confirm the pickup point before you leave",
      "Keep your phone charged with location on",
      "Sit in the back if you don't know the driver",
    ],
    flags: [
      "The car or driver isn't who was agreed",
      "The route or price changes once you're in",
      "The driver seems tired, drunk or reckless",
    ],
    link: { label: "Go to Rides", href: "/share-ride" },
  },
  {
    key: "rooms",
    feature: "rooms",
    label: "Housing",
    tips: [
      "Visit in person before you agree to anything",
      "Go at different times of day to see the area",
      "Meet the people you'd live with",
      "Read the rental agreement before you sign or pay",
    ],
    flags: [
      "A deposit is asked for before you've seen the room",
      "You're told you can't visit, just pay to hold it",
      "The rent is far below anything nearby",
    ],
    link: { label: "Go to Housing", href: "/housing" },
  },
  {
    key: "market",
    feature: "market",
    label: "Buying and selling",
    tips: [
      "See and test the item before paying, especially electronics",
      "Pay when you hand over or receive the item, not before",
      "For tickets, check the event, date and how it transfers",
      "Bring a friend for anything expensive",
    ],
    flags: [
      "Pressure to pay now, before meeting",
      "A price that's too good to be true",
      "Photos that look copied from somewhere else",
    ],
    link: { label: "Go to the Marketplace", href: "/marketplace/buy" },
  },
  {
    key: "lostfound",
    feature: "lostfound",
    label: "Lost & Found",
    tips: [
      "Hide ID numbers, card details and addresses in photos",
      "Ask a claimant something only the owner would know",
      "Hand items back somewhere public, or at a campus desk",
    ],
    flags: [
      "A claimant can't describe the item",
      "Someone asks for a reward before returning it",
      "You're asked to come somewhere private to collect it",
    ],
    link: { label: "Go to Lost & Found", href: "/lost-found" },
  },
];

export const SCAM_SIGNS = [
  { title: "Pay first, see later", text: "Asking for money, or a deposit, before you've seen the item or room." },
  { title: "Rushing you", text: "\"Someone else wants it, pay now.\" Real sellers can wait an hour." },
  { title: "Too good to be true", text: "New phones at half price, or rooms far below the going rent." },
  { title: "Asking for codes", text: "Anyone who wants an OTP, password or UPI PIN is trying to take your money." },
  { title: "Moving somewhere private", text: "Pushing to meet off campus, at night, or alone." },
  { title: "The story keeps changing", text: "Different prices, places or reasons each time you ask." },
];

export const PRIVATE_INFO = {
  share: [
    "Your name and campus",
    "A phone number or email, only in a request you send",
    "A public meeting point",
  ],
  keep: [
    "OTPs, passwords and UPI PINs, with anyone",
    "Bank or card details",
    "Your home address, until you trust them",
    "ID card numbers and photos of documents",
  ],
};

export const RELATED = [
  { label: "Community guidelines", href: "/info/guidelines" },
  { label: "Help centre", href: "/info/help" },
  { label: "Report a problem", href: "/info/report" },
];
