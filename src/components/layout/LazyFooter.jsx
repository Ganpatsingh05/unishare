"use client";

import dynamic from "next/dynamic";

// ✅ PERFORMANCE: Lazy load Footer — keeps the initial JS bundle lean
// while still rendering on all pages including mobile.
// No loading state needed as it's at the bottom of the page
const Footer = dynamic(() => import("./Footer"), {
  loading: () => null,
  ssr: true, // Keep SSR for SEO on info pages
});

export default Footer;
