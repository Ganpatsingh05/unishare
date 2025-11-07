"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "../ui/NoticeBar";
import ClientHeader from "./ClientHeader";

/**
 * SiteChrome conditionally renders the public site chrome (announcement bar + header)
 * and hides them for any /admin routes where the admin dashboard provides its own layout.
 * Also hides the notice bar on the profile page.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Prevent hydration mismatch by ensuring client-side rendering for conditional logic
  if (!isClient) {
    return (
      <div className="pt-16 md:pt-20" style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    );
  }
  
  const isAdmin = pathname?.startsWith("/admin");
  const isProfile = pathname === "/profile";

  return (
    <>
      {!isAdmin && (
        <>
          {!isProfile && <AnnouncementBar />}
          <ClientHeader />
        </>
      )}
      {/* Content area - adding proper padding to prevent header overlap */}
      <div className="pt-16 md:pt-20" style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    </>
  );
}
