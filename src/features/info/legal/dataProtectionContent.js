import { CONTACT_EMAIL, LEGAL_UPDATED, MAILTO, relatedExcept } from "./legalShared";

// Data protection: how to use your rights, and what deleting your account
// actually removes. Keep the deletion lists in step with the delete-account
// endpoint.

export const DATA_PROTECTION = {
  eyebrow: "Data protection",
  titleLead: "Your data,",
  titleAccent: "your call.",
  intro: "How to see, change or delete what UniShare holds about you, and exactly what happens when you close your account.",
  updated: LEGAL_UPDATED,
  summaryTitle: "Quick answers",
  summary: [
    { title: "Change it", text: "Edit your profile and posts yourself, any time." },
    { title: "Delete it", text: "Close your account from Settings. Most data goes straight away." },
    { title: "Ask us", text: "Email us for a copy of your data, or anything we can't do in the app." },
  ],
  sections: [
    {
      id: "rights",
      title: "Your rights",
      intro: "Under India's Digital Personal Data Protection Act, 2023:",
      blocks: [
        {
          type: "cards",
          numbered: false,
          items: [
            { title: "See your data", text: "Ask for a summary of the personal data we hold about you and who we've shared it with. Email us and we'll send it." },
            { title: "Correct it", text: "Update your name, photo, bio, campus and phone from your profile, and edit your posts where they're managed." },
            { title: "Erase it", text: "Delete your account from Settings, or ask us to delete specific data." },
            { title: "Complain", text: "Tell us first. If we don't sort it out, you can go to the Data Protection Board of India." },
          ],
        },
      ],
    },
    {
      id: "delete",
      title: "Deleting your account",
      blocks: [
        {
          type: "steps",
          items: [
            "Open Settings from your avatar menu, or the Settings tab on your phone.",
            "Scroll to Delete account and choose Delete account.",
            "Type DELETE to confirm, and your password if you have one.",
          ],
        },
        { type: "p", text: "This can't be undone. You'll be signed out straight away." },
        {
          type: "dodont",
          doLabel: "Deleted straight away",
          dontLabel: "Not deleted automatically yet",
          do: [
            "Your account and profile, including your profile photo",
            "Your rides, rooms, items, tickets and lost & found posts",
            "Announcements and resources you submitted",
            "Requests you sent or received",
            "Your ticket views and notification history",
          ],
          dont: [
            "Photos you added to items, rooms or lost & found posts",
            "Notifications sent to or by you",
            "Reports made by or about you",
            "Anything you sent through Report a problem or Send feedback",
            "Sign-ins on other devices, which end on their own within 7 days",
          ],
        },
        { type: "callout", tone: "warn", title: "Want those gone too?", text: `Email ${CONTACT_EMAIL} after deleting your account, and we'll remove what's left.`, link: { label: "Email us", href: MAILTO } },
      ],
    },
    {
      id: "automatic",
      title: "What we remove automatically",
      blocks: [
        {
          type: "list",
          items: [
            "Rides, once their date and time have passed",
            "Cancelled requests, about a day after they're cancelled",
            "Signed-in sessions, after 7 days",
          ],
        },
      ],
    },
    {
      id: "protect",
      title: "How we protect it",
      blocks: [
        {
          type: "list",
          items: [
            "Passwords are stored only as secure hashes",
            "Your sign-in is a random ID in a cookie that page scripts can't read",
            "The site is served over HTTPS",
            "Only a small number of team members have admin access",
            "We collect only what UniShare needs to work, and no tracking or analytics",
          ],
        },
        { type: "p", text: "If a breach affects your personal data, we'll tell you and the Data Protection Board of India as the law requires." },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        { type: "p", text: "Email us from the address on your UniShare account, so we know the request is really from you, and say what you'd like us to do." },
        { type: "callout", text: CONTACT_EMAIL, link: { label: "Email us", href: MAILTO } },
      ],
    },
  ],
  related: relatedExcept("/info/data-protection"),
};
