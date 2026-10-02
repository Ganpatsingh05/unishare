"use client";

import dynamic from "next/dynamic";

// ✅ PERFORMANCE: Lazy load Footer for info pages
// Footer is 19KB and rarely accessed on mobile
// No loading state needed as it's at the bottom of the page
const Footer = dynamic(() => import("./Footer"), {
  loading: () => null,
  ssr: true, // Keep SSR for SEO on info pages
});

export default Footer;
