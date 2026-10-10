// Content for the home page. All home art lives in /public/images/home; until a
// hero file exists its slide shows the feature's animated scene instead. Hero
// art is text-free, and `focus` is the object-position X that keeps the subject
// in frame. `chip` is the little note that floats beside the hero window.

/** Colours for the home page as CSS variables; flips with the theme. */
export function homeVars(dark) {
  return dark
    ? {
        "--h-surface": "rgba(19, 26, 38, 0.86)",
        "--h-surface-solid": "#131A26",
        "--h-panel": "#0F1622",
        "--h-border": "rgba(255, 255, 255, 0.1)",
        "--h-text": "#F1F5F9",
        "--h-muted": "#A3B1C4",
        "--h-faint": "rgba(255, 255, 255, 0.06)",
        "--h-accent": "#3CC3F2",
        "--h-on-accent": "#12233A",
        "--h-ring": "#FFD24C",
        "--h-shadow": "0 30px 70px -30px rgba(0, 0, 0, 0.75)",
      }
    : {
        "--h-surface": "rgba(255, 255, 255, 0.88)",
        "--h-surface-solid": "#FFFFFF",
        "--h-panel": "#F6F8FB",
        "--h-border": "rgba(18, 35, 58, 0.1)",
        "--h-text": "#12233A",
        "--h-muted": "#4F6075",
        "--h-faint": "rgba(18, 35, 58, 0.05)",
        "--h-accent": "#1565D8",
        "--h-on-accent": "#FFFFFF",
        "--h-ring": "#1565D8",
        "--h-shadow": "0 30px 70px -32px rgba(18, 35, 58, 0.35)",
      };
}

// The logo's colours: a cyan-to-blue arm, a magenta-to-plum arm and a yellow hand.
export const BRAND = {
  yellow: "#FFD24C",
  yellowDeep: "#E0A800",
  sky: "#3CC3F2",
  cyan: "#00A6E0",
  blue: "#1565D8",
  navy: "#12233A",
  deepBlue: "#254790",
  magenta: "#E5097F",
  plum: "#662483",
  mist: "#A8D3DE",
};

export const SLIDES = [
  {
    key: "rides",
    label: "Rides",
    image: "/images/home/hero-rides.png",
    // The students and the car sit right of centre in this picture.
    focus: 70,
    chip: "One fare, split four ways",
    lines: ["Share the ride.", "Split the fare."],
    body: "Find students heading your way, split the cost and get there together.",
    primary: { label: "Find a ride", href: "/share-ride/findride" },
    secondary: { label: "Offer a ride", href: "/share-ride/postride" },
  },
  {
    key: "rooms",
    label: "Housing",
    image: "/images/home/hero-housing2.png",
    focus: 58,
    chip: "Rooms from students moving out",
    lines: ["Find your space.", "Live your way."],
    body: "Rooms and flatmates near campus, listed by the students who know the place.",
    primary: { label: "Browse rooms", href: "/housing" },
    secondary: { label: "List a room", href: "/housing/post" },
  },
  {
    key: "market",
    label: "Marketplace",
    short: "Market",
    image: "/images/home/hero-marketplace.png",
    focus: 50,
    chip: "Handed over on campus",
    lines: ["Buy smart.", "Sell easily."],
    body: "Books, gadgets and gear from students on your campus, at student prices.",
    primary: { label: "Browse the marketplace", href: "/marketplace/buy" },
    secondary: { label: "Sell an item", href: "/marketplace/sell" },
  },
  {
    key: "tickets",
    label: "Tickets",
    image: "/images/home/hero-tickets.webp",
    focus: 50,
    chip: "Can't make it? Pass it on",
    lines: ["Never miss", "a campus moment."],
    body: "Buy, sell or pass on event tickets with other students.",
    primary: { label: "Browse tickets", href: "/ticket/buy" },
    secondary: { label: "Sell a ticket", href: "/ticket/sell" },
  },
];

/** The feature tour: one stop per feature, with its illustration. */
export const TOUR = [
  { key: "rides", image: "/images/home/tour-rides.png", title: "Ride together, pay less", body: "Post where you're heading or find someone already going. Split the fare and share the trip.", steps: ["Post your route, time and seats","Students request a seat","Accept, meet up and split the fare"], actions: [{ label: "Find a ride", href: "/share-ride/findride" }, { label: "Offer a ride", href: "/share-ride/postride" }] },
  { key: "rooms", image: "/images/home/tour-housing.png", title: "A room near campus, from someone who lived there", body: "Browse rooms and flatmate spots that students are leaving, with the details that matter.", steps: ["List the room with rent and photos","Students ask to see it","Approve the one that fits"], actions: [{ label: "Browse rooms", href: "/housing" }, { label: "List a room", href: "/housing/post" }] },
  { key: "market", image: "/images/home/tour-marketplace.png", title: "Your old stuff is someone's next semester", body: "Sell the calculator you no longer need. Buy the textbook you do, from someone a block away.", steps: ["List it with a price and photo","Buyers send a request or an offer","Accept and hand it over on campus"], actions: [{ label: "Browse items", href: "/marketplace/buy" }, { label: "Sell an item", href: "/marketplace/sell" }] },
  { key: "tickets", image: "/images/home/tour-tickets.png", title: "Can't make it? Pass it on", body: "Sell a ticket you can't use, or pick one up for a sold-out night.", steps: ["List the event and your price","Students request the tickets","Accept and pass them on"], actions: [{ label: "Buy tickets", href: "/ticket/buy" }, { label: "Sell a ticket", href: "/ticket/sell" }] },
  { key: "lostfound", image: "/images/home/tour-lost-found.png", title: "Lost it? Someone may have found it", body: "Report what you lost or found, and help it get back to its owner.", steps: ["Report what you lost or found","The owner claims it with a detail only they know","Accept and hand it back"], actions: [{ label: "See lost & found", href: "/lost-found" }, { label: "Report an item", href: "/lost-found/report" }] },
  { key: "announcements", image: "/images/home/tour-announcements.png", title: "Know what's on around campus", body: "Club events, deadlines and notices, all in one feed.", steps: ["Submit your announcement","The UniShare team reviews it","It goes live for everyone"], actions: [{ label: "See announcements", href: "/announcements" }, { label: "Post one", href: "/announcements/submit" }] },
  { key: "resources", image: "/images/home/tour-resources.png", title: "Notes from people who've done the course", body: "Notes, papers and guides shared by students, sorted by subject.", steps: ["Suggest your notes or a guide","The UniShare team reviews it","Students find it by subject"], actions: [{ label: "Browse resources", href: "/resources" }, { label: "Suggest one", href: "/resources/suggest" }] },
  { key: "contacts", image: "/images/home/tour-contacts.png", title: "Every campus number, one tap away", body: "The campus numbers you'll need, from emergencies to everyday help, ready when you are.", steps: ["Open campus contacts","Emergency numbers come first","Tap to call or email"], actions: [{ label: "Open contacts", href: "/contacts" }] },
];

/** The ticker: the kinds of things students share. */
export const TICKER = [
  [
    { k: "rides", t: "Rides home for the weekend" },
    { k: "rooms", t: "Single rooms near Law Gate" },
    { k: "market", t: "Scientific calculators" },
    { k: "rides", t: "Airport drops, split four ways" },
    { k: "market", t: "Cycles for the semester" },
    { k: "rooms", t: "Flatmates wanted" },
    { k: "market", t: "Drafter kits" },
    { k: "rides", t: "Station runs before exams" },
  ],
  [
    { k: "tickets", t: "Fest passes" },
    { k: "lostfound", t: "Lost ID cards" },
    { k: "announcements", t: "Club auditions" },
    { k: "resources", t: "Previous year papers" },
    { k: "tickets", t: "Concert tickets" },
    { k: "lostfound", t: "Found: water bottles" },
    { k: "announcements", t: "Hackathon sign-ups" },
    { k: "resources", t: "Lab manuals" },
  ],
];

/** What the hero's search pill suggests, one after another. */
export const SEARCH_HINTS = ["a ride home this Friday", "a room near campus", "a second-hand calculator", "a pass for fest night", "notes for my exams"];

/** How a share happens, start to finish. `art` names the Lottie in homeLottie. */
export const STEPS = [
  { art: "signin", tint: "#1565D8", title: "Sign in", body: "Use Google or your email. There's no app to download; UniShare runs in your browser." },
  { art: "pin", tint: "#FFD24C", title: "Post or ask", body: "List a ride, room, item or ticket in about a minute, or send a request on someone else's." },
  { art: "meet", tint: "#E5097F", title: "Shake on it", body: "They accept, you both see it in My activity, and you meet on campus. Payment stays between you." },
];

/** A week of campus life, Monday first; each day leans on one feature. */
export const WEEK = [
  { day: "Monday", time: "8:40 am", k: "resources", text: "Quiz at ten. Grab last year's paper on the walk to class.", link: { label: "Browse resources", href: "/resources" } },
  { day: "Tuesday", time: "1:15 pm", k: "lostfound", text: "Left your ID card in the library? See what's been handed in.", link: { label: "Check lost & found", href: "/lost-found" } },
  { day: "Wednesday", time: "6:00 pm", k: "announcements", text: "Your club's hackathon needs sign-ups. Tell the whole campus.", link: { label: "Post an announcement", href: "/announcements/submit" } },
  { day: "Thursday", time: "9:30 pm", k: "market", text: "That drafter you used twice? A first-year needs it this week.", link: { label: "Sell an item", href: "/marketplace/sell" } },
  { day: "Friday", time: "4:00 pm", k: "rides", text: "Heading home for the weekend. Three spare seats, one fare split four ways.", link: { label: "Find a ride", href: "/share-ride/findride" } },
  { day: "Saturday", time: "7:30 pm", k: "tickets", text: "Fest night, and a friend can't make it. Their pass finds a new owner.", link: { label: "Browse tickets", href: "/ticket/buy" } },
  { day: "Sunday", time: "11:00 am", k: "rooms", text: "Moving out next month? List your room for whoever moves in next.", link: { label: "List a room", href: "/housing/post" } },
];

/** What UniShare promises, stated plainly. */
export const PROMISES = [
  { big: "₹0", title: "Free to post, free to ask", body: "No fees for listing anything or sending a request." },
  { big: "0%", title: "No cut from your deals", body: "Payments don't go through UniShare. You pay each other directly, after you've seen what you're getting." },
  { big: "1 min", title: "To post almost anything", body: "A ride, a room, an item or a ticket. Edit or remove it any time." },
  { big: "0 apps", title: "Nothing to download", body: "UniShare works in the browser on your phone and your computer." },
];

/** The FAQ entries the home page shows, by id from the FAQ page. */
export const HOME_FAQ_IDS = ["what", "cost", "join", "verified", "app"];
