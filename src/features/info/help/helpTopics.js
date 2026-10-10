// Help centre content. Every answer describes how UniShare works today;
// `link` points at the page that does the thing.

export const HELP_TOPICS = [
  {
    key: "start",
    label: "Getting started",
    blurb: "Signing in, your profile and settings",
    articles: [
      {
        id: "sign-in",
        q: "How do I sign in?",
        a: "Use Sign in at the top right of any page.",
        steps: ["Continue with Google, or", "Create an account with your email and a password.", "You'll land back where you were."],
        link: { label: "Sign in", href: "/login" },
      },
      {
        id: "profile",
        q: "How do I set up my profile?",
        a: "Your profile is your campus pass: name, username, photo, campus and a short bio.",
        steps: ["Open your profile from your avatar.", "Choose Edit profile.", "Add a username so people can find your public pass at /u/your-username."],
        link: { label: "Go to my profile", href: "/profile" },
      },
      {
        id: "requests",
        q: "Where do I see my requests?",
        a: "My activity shows every request in one place. Received has what people have asked you for, and Sent has what you've asked others for, across rides, rooms, items, tickets and lost & found.",
        link: { label: "Open My activity", href: "/my-activity" },
      },
      {
        id: "cancel-request",
        q: "How do I cancel a request I sent?",
        a: "You can cancel a request while it's still waiting for an answer.",
        steps: ["Open My activity and choose Sent.", "Find the request and choose Cancel request.", "Confirm, and the other person will see it was cancelled."],
        link: { label: "Open My activity", href: "/my-activity" },
      },
      {
        id: "password",
        q: "How do I change or set a password?",
        a: "Open Settings from your avatar menu. If you signed up with Google, you can set a password there so you can also sign in with email.",
        link: { label: "Open settings", href: "/settings" },
      },
      {
        id: "delete",
        q: "How do I delete my account?",
        a: "In Settings, choose Delete account. You'll be asked to type DELETE, and your password if you have one. This removes your account and everything you've posted, and it can't be undone.",
        link: { label: "Open settings", href: "/settings" },
      },
      {
        id: "theme",
        q: "Can I use dark mode?",
        a: "Yes. Use the sun or moon button in the header, or pick Light, Dark or System under Appearance in Settings.",
      },
    ],
  },
  {
    key: "rides",
    label: "Rides",
    blurb: "Offering, finding and joining rides",
    articles: [
      {
        id: "offer-ride",
        q: "How do I offer a ride?",
        a: "Post where you're going and how many seats you have.",
        steps: ["Go to Rides and choose Offer a ride.", "Add your start, destination, date and time.", "Set the seats and the price per seat, then publish."],
        link: { label: "Offer a ride", href: "/share-ride/postride" },
      },
      {
        id: "join-ride",
        q: "How do I join someone's ride?",
        a: "Find a ride going your way and send a request with the seats you need and where to pick you up. The driver confirms or declines, and you'll see the answer in My activity.",
        link: { label: "Find a ride", href: "/share-ride/findride" },
      },
      {
        id: "ride-requests",
        q: "Where do I answer requests for my ride?",
        a: "In My activity, under Received. Accept or decline each one, and add a note like where to meet. Requests can't be answered once the ride has left.",
        link: { label: "Open My activity", href: "/my-activity" },
      },
      {
        id: "manage-ride",
        q: "How do I edit or remove my ride?",
        a: "Go to Manage rides from the Rides page. You can update details or delete a ride there.",
        link: { label: "Manage rides", href: "/share-ride/manage" },
      },
    ],
  },
  {
    key: "rooms",
    label: "Housing",
    blurb: "Listing rooms and asking for one",
    articles: [
      {
        id: "list-room",
        q: "How do I list a room?",
        a: "Add the rent, location, move-in date and photos so students know what to expect.",
        steps: ["Go to Housing and choose List a room.", "Fill in the details and add photos.", "Publish. You can edit it later from Manage listings."],
        link: { label: "List a room", href: "/housing/post" },
      },
      {
        id: "request-room",
        q: "How do I ask for a room?",
        a: "Open the room and send a request with your move-in date and a short note about yourself. The person who listed it approves or declines it in their My activity.",
        link: { label: "Browse rooms", href: "/housing" },
      },
      {
        id: "manage-room",
        q: "How do I update or take down my listing?",
        a: "Use Manage listings on the Housing page to edit, update photos or remove a room.",
        link: { label: "Manage listings", href: "/housing/manage" },
      },
    ],
  },
  {
    key: "market",
    label: "Marketplace",
    blurb: "Buying, selling and making offers",
    articles: [
      {
        id: "sell-item",
        q: "How do I sell something?",
        a: "List your item with a price, its condition, where to pick it up and a photo.",
        link: { label: "Sell an item", href: "/marketplace/sell" },
      },
      {
        id: "make-offer",
        q: "Can I offer a different price?",
        a: "Yes. When you send a request for an item you can suggest your own price. The seller sees your offer next to their price and accepts or declines it.",
        link: { label: "Browse the marketplace", href: "/marketplace/buy" },
      },
      {
        id: "market-safety",
        q: "How do I buy and sell safely?",
        a: "Meet somewhere public on campus, check the item before you pay, and don't pay in advance for something you haven't seen. If something feels wrong, report it.",
        link: { label: "Report a problem", href: "/info/report" },
      },
    ],
  },
  {
    key: "tickets",
    label: "Tickets",
    blurb: "Passing on and picking up tickets",
    articles: [
      {
        id: "sell-ticket",
        q: "How do I sell a ticket?",
        a: "List the event, the price and how many tickets you have. Students can ask for one or more and offer a price.",
        link: { label: "Sell a ticket", href: "/ticket/sell" },
      },
      {
        id: "buy-ticket",
        q: "How do I get a ticket?",
        a: "Find the event and send a request with how many you need. When the seller accepts, the tickets are set aside for you.",
        link: { label: "Browse tickets", href: "/ticket/buy" },
      },
      {
        id: "my-tickets",
        q: "Where are the tickets I've listed?",
        a: "Under My tickets on the Tickets page.",
        link: { label: "My tickets", href: "/ticket/my-tickets" },
      },
    ],
  },
  {
    key: "lostfound",
    label: "Lost & Found",
    blurb: "Reporting and claiming items",
    articles: [
      {
        id: "report-item",
        q: "How do I report something I lost or found?",
        a: "Say whether you lost or found it, describe it, and add where and when.",
        link: { label: "Report an item", href: "/lost-found/report" },
      },
      {
        id: "claim-item",
        q: "How do I claim something someone found?",
        a: "Open the item and send a request with something only the owner would know, like a mark or what's inside. When the finder accepts, the item is marked as resolved.",
        link: { label: "See lost & found", href: "/lost-found" },
      },
    ],
  },
  {
    key: "announcements",
    label: "Announcements and resources",
    blurb: "Posting news and sharing notes",
    articles: [
      {
        id: "post-announcement",
        q: "How do I post an announcement?",
        a: "Submit it from the Announcements page. The UniShare team reviews submissions before they go live, and you can see where yours stands under Manage announcements.",
        link: { label: "Post an announcement", href: "/announcements/submit" },
      },
      {
        id: "suggest-resource",
        q: "How do I share notes or a resource?",
        a: "Suggest it from the Resources page with a title, subject and link. It's reviewed before it's listed for everyone.",
        link: { label: "Suggest a resource", href: "/resources/suggest" },
      },
      {
        id: "contacts",
        q: "Where can I find campus phone numbers?",
        a: "Contacts lists campus numbers and emails, with emergency contacts first.",
        link: { label: "Open contacts", href: "/contacts" },
      },
    ],
  },
  {
    key: "safety",
    label: "Safety and privacy",
    blurb: "What others see, and reporting problems",
    articles: [
      {
        id: "what-visible",
        q: "What can other people see about me?",
        a: "Your public pass shows your name, username, photo, bio and when you joined. Posts are public too: anyone can see a post, its contact details, and the name and email attached to rides, items, tickets and lost & found posts. In a request, only the person you send it to sees your message and contact details.",
      },
      {
        id: "report",
        q: "How do I report a post or a person?",
        a: "Use Report a problem and tell us what happened. Reports go to the UniShare team for review.",
        link: { label: "Report a problem", href: "/info/report" },
      },
      {
        id: "guidelines",
        q: "What are the community rules?",
        a: "Be honest about what you post, treat people with respect, and only post things you're allowed to share. The full guidelines explain what isn't allowed.",
        link: { label: "Read the guidelines", href: "/info/guidelines" },
      },
    ],
  },
];

/** Every article with its topic, for search. */
export const ALL_ARTICLES = HELP_TOPICS.flatMap((t) => t.articles.map((a) => ({ ...a, topic: t.key, topicLabel: t.label })));

// Words that carry no meaning in a help search.
const FILLER = new Set(["a", "an", "the", "i", "my", "me", "how", "do", "does", "to", "can", "is", "it", "of", "for", "on", "in", "and", "or", "what", "where", "why"]);

/** Articles matching a query, best first. */
export function searchHelp(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter((w) => w && !FILLER.has(w));
  if (!words.length) return [];
  return ALL_ARTICLES.map((a) => {
    const q = a.q.toLowerCase();
    const body = `${a.a} ${(a.steps || []).join(" ")} ${a.topicLabel}`.toLowerCase();
    // At least half the words must appear somewhere; matches in the question count more.
    let score = 0;
    let hits = 0;
    for (const w of words) {
      if (q.includes(w)) (score += 3), hits++;
      else if (body.includes(w)) (score += 1), hits++;
    }
    return hits >= Math.ceil(words.length * 0.5) ? { a, score } : null;
  })
    .filter(Boolean)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.a);
}
