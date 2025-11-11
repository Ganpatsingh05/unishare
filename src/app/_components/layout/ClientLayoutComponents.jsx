"use client";

import dynamic from "next/dynamic";

// ✅ PERFORMANCE: Dynamic imports for layout components
const MobileBottomNav = dynamic(() => import("./MobileBottomNav"), {
  ssr: false,
});

const ThemeWrapper = dynamic(() => import("../ui/ThemeWrapper"), {
  ssr: false,
});

const SiteChrome = dynamic(() => import("./SiteChrome"), {
  ssr: false,
});

/**
 * ClientLayoutComponents - Wrapper for client-only layout components
 * Allows dynamic imports with ssr: false in a Client Component
 */
export default function ClientLayoutComponents({ children }) {
  return (
    <ThemeWrapper>
      <SiteChrome>
        {children}
      </SiteChrome>
      <MobileBottomNav />
    </ThemeWrapper>
  );
}
