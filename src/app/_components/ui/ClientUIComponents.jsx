"use client";

import dynamic from "next/dynamic";

// ✅ PERFORMANCE: Dynamic imports for heavy client components
// These components are lazy-loaded only when needed, reducing initial JS bundle
const CookieConsent = dynamic(() => import("./CookieConsent"), {
  ssr: false, // Cookie consent doesn't need SSR
});

const RouteChangeOverlay = dynamic(() => import("./RouteChangeOverlay"), {
  ssr: false,
});

const NavigationLoader = dynamic(() => import("./NavigationLoader"), {
  ssr: false,
});

const ScrollToTop = dynamic(() => import("./ScrollToTop"), {
  ssr: false,
});

const MessageNotification = dynamic(() => import("./MessageNotification"), {
  ssr: false,
});

const DynamicIslandWrapper = dynamic(() => import("./DynamicIslandWrapper"), {
  ssr: false,
});

/**
 * ClientUIComponents - Wrapper for all client-only UI components
 * Keeps layout.js as a Server Component while allowing dynamic imports
 */
export default function ClientUIComponents() {
  return (
    <>
      <ScrollToTop />
      <NavigationLoader />
      <CookieConsent />
      <MessageNotification />
      <DynamicIslandWrapper />
      <RouteChangeOverlay />
    </>
  );
}
