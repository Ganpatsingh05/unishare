// Frequently asked questions: short "is it / why / can I" answers. Step-by-step
// how-tos live in the help centre. Every answer describes UniShare as it is.

export const FAQ_GROUPS = [
  {
    key: "general",
    label: "About UniShare",
    items: [
      {
        id: "what",
        q: "What is UniShare?",
        a: "A place for students to share with each other: rides, rooms, things to buy and sell, event tickets, and lost and found. It also has campus announcements, shared notes and campus contacts.",
      },
      {
        id: "cost",
        q: "Does UniShare charge anything or handle payments?",
        a: "No. Posting and sending requests are free, and payments don't go through UniShare. You pay each other directly, after you've seen what you're getting.",
        link: { label: "Safety guidelines", href: "/info/support-guidelines" },
      },
      {
        id: "join",
        q: "Who can join?",
        a: "Anyone can sign up with a Google account, or with an email and password. UniShare is built for students, so keep what you post about campus life.",
        link: { label: "Sign in", href: "/login" },
      },
      {
        id: "app",
        q: "Is there an app to download?",
        a: "No download needed. UniShare works in the browser on your phone and your computer.",
      },
    ],
  },
  {
    key: "requests",
    label: "Requests",
    items: [
      {
        id: "request",
        q: "What is a request?",
        a: "It's how you ask for something on UniShare: a seat in a ride, a room, an item, a ticket, or a found item that's yours. The other person accepts or declines it, and you both see it in My activity.",
        link: { label: "Open My activity", href: "/my-activity" },
      },
      {
        id: "answered",
        q: "How do I know if someone answered my request?",
        a: "Open My activity and choose Sent. Each request shows whether it's still waiting, or was accepted or declined, along with any note they left.",
        link: { label: "Open My activity", href: "/my-activity" },
      },
      {
        id: "change-request",
        q: "Can I change a request after sending it?",
        a: "Not directly. While it's still waiting, cancel it in My activity and send a new one.",
      },
      {
        id: "ride-left",
        q: "Why can't I answer a request for my ride?",
        a: "Requests close once the ride has left, so nobody is left waiting for an answer about a trip that's already gone.",
      },
    ],
  },
  {
    key: "posting",
    label: "Posting",
    items: [
      {
        id: "announcement-review",
        q: "Why isn't my announcement showing yet?",
        a: "Announcements and suggested resources are reviewed by the UniShare team before anyone else sees them. You can see where yours stands under Manage announcements.",
        link: { label: "Manage announcements", href: "/announcements/manage" },
      },
      {
        id: "edit-post",
        q: "Can I edit a ride or room after posting it?",
        a: "Yes. Use Manage rides for rides and Manage listings for rooms. You can also remove them there.",
        link: { label: "Manage rides", href: "/share-ride/manage" },
      },
      {
        id: "allowed",
        q: "What am I not allowed to post?",
        a: "Anything illegal, stolen, fake or explicit, and anything that harasses or misleads people. The community guidelines list it all in a two-minute read.",
        link: { label: "Community guidelines", href: "/info/guidelines" },
      },
    ],
  },
  {
    key: "account",
    label: "Account and privacy",
    items: [
      {
        id: "visible",
        q: "Who can see my phone number or email?",
        a: "Anyone can see the contact details you add to a post, and your name and account email are attached to rides, items, tickets and lost & found posts. In a request, only the person you send it to sees the contact details you include. Your public profile doesn't show your phone or email.",
        link: { label: "Privacy policy", href: "/info/privacy#public" },
      },
      {
        id: "google-password",
        q: "I signed up with Google. Can I also use a password?",
        a: "Yes. Set one in Settings, and you can sign in either way.",
        link: { label: "Open settings", href: "/settings#signin" },
      },
      {
        id: "delete",
        q: "Can I delete my account?",
        a: "Yes, from Settings. It removes your account and everything you've posted, and it can't be undone.",
        link: { label: "Open settings", href: "/settings#danger" },
      },
    ],
  },
  {
    key: "trust",
    label: "Safety and trust",
    items: [
      {
        id: "verified",
        q: "Does UniShare check who people are?",
        a: "No. UniShare doesn't verify student IDs, so treat someone you haven't met like any stranger: meet somewhere public on campus, and check things before you pay.",
        link: { label: "Safety guidelines", href: "/info/support-guidelines" },
      },
      {
        id: "scammed",
        q: "What if I've been scammed?",
        a: "Report it to us with screenshots, the post and the time. If money was taken, also contact your bank straight away and the national cybercrime helpline on 1930.",
        link: { label: "Report a problem", href: "/info/report" },
      },
      {
        id: "anonymous-report",
        q: "Will the person I report know it was me?",
        a: "No. Reports go only to the UniShare team.",
        link: { label: "Report a problem", href: "/info/report" },
      },
    ],
  },
];

export const ALL_FAQS = FAQ_GROUPS.flatMap((g) => g.items.map((i) => ({ ...i, group: g.key, groupLabel: g.label })));

const FILLER = new Set(["a", "an", "the", "i", "my", "me", "how", "do", "does", "to", "can", "is", "it", "of", "for", "on", "in", "and", "or", "what", "where", "why", "who"]);

/** Questions matching a query, best first. Question matches count most. */
export function searchFaqs(query) {
  const words = query.trim().toLowerCase().split(/\s+/).filter((w) => w && !FILLER.has(w));
  if (!words.length) return [];
  return ALL_FAQS.map((f) => {
    const q = f.q.toLowerCase();
    const body = `${f.a} ${f.groupLabel}`.toLowerCase();
    let score = 0;
    let hits = 0;
    for (const w of words) {
      if (q.includes(w)) (score += 3), hits++;
      else if (body.includes(w)) (score += 1), hits++;
    }
    return hits >= Math.ceil(words.length * 0.5) ? { f, score } : null;
  })
    .filter(Boolean)
    .sort((x, y) => y.score - x.score)
    .map((x) => x.f);
}
