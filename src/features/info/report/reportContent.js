// Report a problem: the choices people pick from. `id` values are what the
// report form has always sent, so keep them stable.

export const REPORT_TYPES = [
  { id: "safety", label: "Safety concern", hint: "Harassment, threats, or someone making you feel unsafe" },
  { id: "fraud", label: "Scam or fraud", hint: "Fake listings, payment scams, or someone pretending to be someone else" },
  { id: "user", label: "Someone's behaviour", hint: "Rude or abusive messages, spam, or a fake profile" },
  { id: "content", label: "A post that breaks the rules", hint: "Offensive photos, illegal items, or posts that don't belong" },
  { id: "technical", label: "Something isn't working", hint: "A page that won't load, an error, or a button that does nothing" },
  { id: "other", label: "Something else", hint: "Anything that doesn't fit above" },
];

export const URGENCY = [
  { id: "low", label: "Not urgent", hint: "A small problem or a suggestion" },
  { id: "medium", label: "Soon", hint: "It's getting in the way of using UniShare" },
  { id: "high", label: "Urgent", hint: "Someone's safety, money or account is at risk" },
];

export const NEXT_STEPS = [
  "The UniShare team reads every report.",
  "We look at the post or account involved, and may contact you for more detail.",
  "If the community guidelines were broken, we act on it, from removing a post to removing an account.",
];

export const DETAILS_MIN = 20;
export const DETAILS_MAX = 2000;
