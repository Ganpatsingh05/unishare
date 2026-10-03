// Copy for the Contacts page. Keep user-facing text here, not in components.
export const CONTACT_STRINGS = {
  meta: {
    title: "Contacts | UniShare",
    description: "Campus security, the medical centre, offices, wardens and student services, with numbers you can tap to call.",
  },
  hero: {
    titleBefore: "Campus,",
    titleAccent: "On call.",
    lead: "Every office, desk and helpline on campus. Tap a number to call, or an address to email.",
  },
  emergency: {
    title: "In an emergency",
    lead: (n) => (n ? `${n} emergency ${n === 1 ? "contact" : "contacts"}: security, medical, fire and help desks.` : "Security, medical, fire and help desks."),
    show: "Show emergency contacts",
    call: (name) => `Call ${name}`,
    none: "No emergency contacts are listed yet. Use the directory below.",
    loading: "Loading emergency contacts",
  },
  categories: {
    label: "Category",
    all: "Everyone",
    emergency: "Emergency",
    administration: "Administration",
    academics: "Academics",
    hostel: "Hostel",
    student: "Student & clubs",
  },
  directory: {
    title: "The directory",
    count: (n) => (n === 0 ? "Nobody matches" : `${n} ${n === 1 ? "contact" : "contacts"}`),
    searchLabel: "Search contacts",
    searchPlaceholder: "Search names, roles and places",
    clear: "Clear search",
    loading: "Loading contacts",
  },
  card: {
    call: (number) => `Call ${number}`,
    email: (address) => `Email ${address}`,
    copy: "Copy number",
    copied: "Copied",
    openNow: "Open now",
    closed: "Closed now",
  },
  empty: {
    title: "Nobody matches that",
    body: "Try another name, role or place.",
    reset: "Clear filters",
    noneTitle: "No contacts yet",
    noneBody: "The directory is being set up. Check back soon.",
  },
  error: {
    title: "Couldn't load contacts",
    body: "Check your connection and try again. In an emergency, call your national emergency number.",
    retry: "Try again",
  },
};
