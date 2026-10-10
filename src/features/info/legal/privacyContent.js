import { CONTACT_EMAIL, LEGAL_UPDATED, MAILTO, PROCESSORS, relatedExcept } from "./legalShared";

// Privacy policy. Describes what the code does today; if that changes,
// this page has to change with it.

export const PRIVACY = {
  eyebrow: "Privacy policy",
  titleLead: "Your data,",
  titleAccent: "in plain words.",
  intro: "What UniShare collects, who can see it, who it's shared with, and what you can do about it. Written to be read, not skimmed past.",
  updated: LEGAL_UPDATED,
  summaryTitle: "The short version",
  summary: [
    { title: "We keep what you give us", text: "Your account, profile, posts and requests. Nothing is bought from anyone else." },
    { title: "Posts are public", text: "Anything you post, including contact details you add to it, can be seen by anyone." },
    { title: "No ads, no selling", text: "We don't sell your data, show ads, or use tracking or analytics tools." },
    { title: "You can leave", text: "Delete your account from Settings at any time, or email us about your data." },
  ],
  sections: [
    {
      id: "who",
      title: "Who we are",
      blocks: [
        { type: "p", text: "UniShare is a platform for college and university students to share rides, rooms, items, tickets and lost property, and to find campus announcements, resources and contacts. In this policy, \"UniShare\", \"we\" and \"us\" mean the team that runs it." },
        { type: "p", text: `For anything about your data, email ${CONTACT_EMAIL}.` },
      ],
    },
    {
      id: "collect",
      title: "What we collect",
      intro: "Only what you give us while using UniShare.",
      blocks: [
        {
          type: "table",
          caption: "Data UniShare collects",
          columns: ["What", "Details", "Where it comes from"],
          rows: [
            ["Account", "Name, email address, university if you add it, and a password stored only as a secure hash. If you sign in with Google: your Google account ID, name and profile photo.", "You, or Google when you choose Sign in with Google"],
            ["Profile", "Display name, username, bio, campus, profile photo, and a phone number if you add one.", "You"],
            ["Posts", "Rides, rooms, items, tickets and lost & found posts: places, dates, prices, descriptions, photos, and any contact details you add.", "You"],
            ["Requests", "Requests you send or answer: your message, seats, dates, offered price, how to contact you, and the reply.", "You"],
            ["Announcements and resources", "What you submit for review, linked to your account.", "You"],
            ["Activity", "Which tickets you've viewed while signed in, which notifications you've read, and when you last signed in.", "Your use of UniShare"],
            ["Reports and feedback", "What you write in Report a problem or Send feedback, with your name and email if you're signed in or choose to add it.", "You"],
            ["Technical", "Your IP address and the pages you request, in our hosting providers' server logs.", "Your browser"],
          ],
        },
        { type: "p", text: "We don't collect your precise location. The ride map works out places from the text you type, inside your browser." },
      ],
    },
    {
      id: "use",
      title: "How we use it",
      blocks: [
        {
          type: "list",
          items: [
            "To run your account and keep you signed in",
            "To show your posts and profile, and pass requests between students",
            "To show you notifications about your requests and campus notices",
            "To review announcements and resources before they're published",
            "To look into reports and keep UniShare safe, including removing posts or accounts",
            "To fix problems and improve UniShare",
          ],
        },
        { type: "p", text: "We don't use your data for advertising, we don't sell it, and we don't build profiles of you for anyone else." },
      ],
    },
    {
      id: "public",
      title: "What other people can see",
      blocks: [
        {
          type: "callout",
          tone: "warn",
          title: "Posts are public, even to people who aren't signed in",
          text: "Rides, rooms, items, tickets and lost & found posts can be seen by anyone who visits UniShare, along with any contact details you put in them. Your name and your account email are attached to rides, items, tickets and lost & found posts. Only add contact details you're happy to share publicly.",
        },
        {
          type: "list",
          items: [
            "Your public profile at /u/your-username shows your display name, username, photo, bio and when you joined. It doesn't show your phone number, email or campus.",
            "People can search for you by name or username.",
            "When you send a request, the person you send it to sees your message and the contact details you include.",
            "Photos you upload are stored at public web addresses.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      intro: "We use a few services to run UniShare. They handle your data for us and nothing else.",
      blocks: [
        { type: "table", caption: "Services that receive data", columns: ["Service", "What it does", "What it receives"], rows: PROCESSORS },
        {
          type: "list",
          items: [
            "The UniShare team: team members with admin access can see accounts and posts so they can moderate, answer reports and remove things that break the rules.",
            "The law: we'll share information if the law requires it, or to protect someone's safety.",
          ],
        },
      ],
    },
    {
      id: "where",
      title: "Where it's stored",
      blocks: [
        { type: "p", text: "Your data is stored by Supabase and processed by servers run by Render in the United States, so it's stored and processed outside India. By using UniShare you agree to this transfer." },
      ],
    },
    {
      id: "keep",
      title: "How long we keep it",
      blocks: [
        {
          type: "list",
          items: [
            "Your account and posts: until you delete them or your account.",
            "Rides: removed automatically once the ride's date and time have passed.",
            "Cancelled requests: removed automatically about a day after they're cancelled.",
            "Sign-in sessions: end after 7 days.",
          ],
        },
        { type: "p", text: "When you delete your account, most of your data is deleted straight away. Data protection explains exactly what's removed and what isn't yet." },
        { type: "callout", text: "See what's deleted when you close your account.", link: { label: "Data protection", href: "/info/data-protection" } },
      ],
    },
    {
      id: "rights",
      title: "Your rights",
      intro: "Under India's Digital Personal Data Protection Act, 2023, you can:",
      blocks: [
        {
          type: "list",
          items: [
            "Ask what personal data we have about you, and who we've shared it with",
            "Correct or update it. Most of it you can edit yourself from your profile and your posts",
            "Delete it, by deleting your account from Settings or by asking us",
            "Withdraw your consent, by deleting your account",
            "Raise a complaint with us, and then with the Data Protection Board of India if you're not satisfied",
          ],
        },
        { type: "callout", text: `Email ${CONTACT_EMAIL} from the address on your account, and say what you'd like us to do.`, link: { label: "Email us", href: MAILTO } },
      ],
    },
    {
      id: "security",
      title: "Security",
      blocks: [
        { type: "p", text: "Passwords are stored only as secure hashes, never as plain text. Your sign-in is kept in a cookie that page scripts can't read, and the site is served over HTTPS. Only a small number of team members have admin access." },
        { type: "p", text: "No system is completely secure. If a breach affects your data, we'll tell you and the authorities as the law requires." },
      ],
    },
    {
      id: "age",
      title: "Age",
      blocks: [{ type: "p", text: "UniShare is for students aged 18 or over. If you're under 18, please don't create an account." }],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [{ type: "p", text: "When we change how UniShare handles your data, we'll update this page and the date at the top. For big changes, we'll also tell you on UniShare." }],
    },
  ],
  related: relatedExcept("/info/privacy"),
};
