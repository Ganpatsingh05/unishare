import { CONTACT_EMAIL, LEGAL_UPDATED, MAILTO, relatedExcept } from "./legalShared";

// Cookie policy. UniShare sets one cookie and keeps a few settings in the
// browser; keep these tables in step with the code.

export const COOKIES = {
  eyebrow: "Cookie policy",
  titleLead: "One cookie,",
  titleAccent: "that's it.",
  intro: "UniShare uses a single cookie to keep you signed in, and remembers a few settings in your browser. No advertising, no tracking, no analytics.",
  updated: LEGAL_UPDATED,
  summaryTitle: "The short version",
  summary: [
    { title: "One cookie", text: "It keeps you signed in. Without it, you couldn't stay logged in." },
    { title: "Settings in your browser", text: "Things like dark mode and drafts stay on your device." },
    { title: "No tracking", text: "No advertising, analytics or third-party tracking cookies." },
  ],
  sections: [
    {
      id: "cookie",
      title: "The cookie we use",
      blocks: [
        {
          type: "table",
          caption: "Cookies set by UniShare",
          columns: ["Name", "What it's for", "How long"],
          rows: [["unishare.sid", "Keeps you signed in. It holds a random ID only, and page scripts can't read it.", "7 days, or until you sign out"]],
        },
        { type: "p", text: "This cookie is essential: UniShare can't keep you signed in without it, so it can't be switched off. It's only set once you sign in." },
      ],
    },
    {
      id: "storage",
      title: "What we keep in your browser",
      intro: "These aren't cookies. They stay on your device, are never sent to us, and you can clear them any time from your browser settings.",
      blocks: [
        {
          type: "table",
          caption: "Data stored in your browser",
          columns: ["What", "Why"],
          rows: [
            ["Theme", "Remembers light, dark or system mode."],
            ["Cookie notice", "Remembers that you've seen the cookie notice, so it doesn't keep appearing."],
            ["Notices", "Keeps campus notices for a few minutes so pages load faster, and remembers announcements you've dismissed."],
            ["Room shortlist", "The rooms you've saved to compare."],
            ["Ride draft", "An unfinished ride post, so you don't lose it. Contact details are never saved in it."],
          ],
        },
      ],
    },
    {
      id: "third-party",
      title: "Other services",
      blocks: [
        { type: "p", text: "UniShare doesn't use advertising, analytics or social media tracking cookies." },
        { type: "p", text: "When you use the ride map, place search and map images come from Photon, OpenStreetMap, OSRM and Esri. Those services receive your IP address like any website you visit, but UniShare doesn't let them set tracking cookies. If you sign in with Google, Google's own cookies apply on Google's sign-in page." },
      ],
    },
    {
      id: "control",
      title: "Your choices",
      blocks: [
        { type: "p", text: "You can block or delete cookies in your browser settings. If you block the sign-in cookie, you won't be able to stay signed in, but you can still browse public pages." },
        { type: "callout", text: `Questions about cookies? Email ${CONTACT_EMAIL}.`, link: { label: "Email us", href: MAILTO } },
      ],
    },
  ],
  related: relatedExcept("/info/cookies"),
};
