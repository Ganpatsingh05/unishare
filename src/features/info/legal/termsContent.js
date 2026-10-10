import { CONTACT_EMAIL, LEGAL_UPDATED, MAILTO, relatedExcept } from "./legalShared";

// Terms of service, in plain language.

export const TERMS = {
  eyebrow: "Terms of service",
  titleLead: "The deal,",
  titleAccent: "kept simple.",
  intro: "The rules for using UniShare. By creating an account or using UniShare, you agree to them.",
  updated: LEGAL_UPDATED,
  summaryTitle: "The short version",
  summary: [
    { title: "We connect, you decide", text: "Rides, rooms and trades are agreements between students. UniShare isn't part of them." },
    { title: "No payments here", text: "UniShare doesn't handle money. You pay each other directly." },
    { title: "Follow the guidelines", text: "Be honest and respectful, and only post what you're allowed to." },
    { title: "Your posts stay yours", text: "You own what you post. You let us show it on UniShare." },
  ],
  sections: [
    {
      id: "about",
      title: "What UniShare is",
      blocks: [
        { type: "p", text: "UniShare is a free platform where students post rides, rooms, items, tickets and lost & found items, send each other requests, and find campus announcements, resources and contacts." },
        {
          type: "callout",
          tone: "warn",
          title: "UniShare isn't a party to your arrangements",
          text: "We're not a transport company, landlord, seller or ticket office. When you share a ride, rent a room, or buy or sell something, the agreement is between you and the other student. We don't check people, vehicles, rooms or items, and we don't handle payments.",
        },
      ],
    },
    {
      id: "account",
      title: "Your account",
      blocks: [
        {
          type: "list",
          items: [
            "You must be 18 or over to use UniShare.",
            "Give accurate information, and keep your profile up to date.",
            "Keep your password safe. You're responsible for what happens on your account.",
            "One account per person. Don't use someone else's account or pretend to be someone else.",
          ],
        },
      ],
    },
    {
      id: "conduct",
      title: "How to use UniShare",
      blocks: [
        { type: "p", text: "Follow the community guidelines. In particular, you must not:" },
        {
          type: "list",
          items: [
            "Post anything false or misleading, including fake listings or photos",
            "Harass, threaten, or discriminate against anyone",
            "Post anything illegal, stolen, counterfeit, dangerous or explicit",
            "Scam people, or ask for payment for something they haven't seen",
            "Share other people's personal information, or copyrighted material, without permission",
            "Spam, advertise businesses not run by students, or create accounts to get around a restriction",
            "Try to break, overload or get around UniShare's security",
          ],
        },
        { type: "callout", text: "The full rules, by activity, take about two minutes to read.", link: { label: "Community guidelines", href: "/info/guidelines" } },
      ],
    },
    {
      id: "rides",
      title: "Rides",
      blocks: [
        {
          type: "list",
          items: [
            "If you offer a ride, you're responsible for having a valid driving licence, insurance and a roadworthy vehicle, and for driving safely and legally.",
            "Cost sharing should cover the trip, not make a profit.",
            "Riders and drivers travel at their own risk. Check details and follow the safety guidelines.",
          ],
        },
      ],
    },
    {
      id: "content",
      title: "Your posts",
      blocks: [
        { type: "p", text: "You own what you post. By posting, you let UniShare store, show and share it on UniShare so the feature works, for as long as it's up. This ends when you delete the post or your account." },
        { type: "p", text: "Only post things you have the right to post. You're responsible for what you post and for any arrangement you make through UniShare." },
      ],
    },
    {
      id: "moderation",
      title: "Moderation",
      blocks: [
        { type: "p", text: "Announcements and resources are reviewed before they're published. Other posts go up straight away." },
        { type: "p", text: "We may remove any post, or limit or close any account, that breaks these terms or the community guidelines, or that puts someone at risk. Where the law or someone's safety is involved, we may share information with the university or the police." },
      ],
    },
    {
      id: "disclaimer",
      title: "No guarantees",
      blocks: [
        { type: "p", text: "UniShare is provided as it is. We work to keep it running and accurate, but we can't promise it will always be available or free of errors, or that what people post is true." },
        { type: "p", text: "As far as the law allows, UniShare isn't responsible for losses or harm that come from arrangements between students, from what other people post, or from UniShare being unavailable." },
      ],
    },
    {
      id: "leaving",
      title: "Leaving UniShare",
      blocks: [{ type: "p", text: "You can delete your account at any time from Settings. These terms stop applying to you when you do, except for anything that by its nature should continue, like responsibility for what you posted." }],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [{ type: "p", text: "We may update these terms as UniShare changes. We'll change the date at the top, and for big changes we'll tell you on UniShare. If you keep using UniShare after that, you accept the new terms." }],
    },
    {
      id: "law",
      title: "Governing law",
      blocks: [{ type: "p", text: "These terms are governed by the laws of India. Any dispute will be handled by the courts of India." }],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [{ type: "callout", text: `Questions about these terms? Email ${CONTACT_EMAIL}.`, link: { label: "Email us", href: MAILTO } }],
    },
  ],
  related: relatedExcept("/info/terms"),
};
