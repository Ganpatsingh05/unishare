"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "../ui/NoticeBar";
import ClientHeader from "./ClientHeader";

/**
 * SiteChrome conditionally renders the public site chrome (announcement bar + header)
 * and hides them for any /admin routes where the admin dashboard provides its own layout.
 * Also hides the notice bar on the profile page.
 * Auth pages (login/register) handle their own header/footer.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  
  const isAdmin = pathname?.startsWith("/admin");
  const isProfile = pathname === "/profile";
  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAdmin && !isAuthPage && !isProfile && (
        <>
          <AnnouncementBar />
          <ClientHeader />
        </>
      )}
      {/* Content area - adding proper padding to prevent header overlap */}
      {/* Auth pages and profile page handle their own layout */}
      <div className={isAuthPage || isProfile ? "" : "pt-16 md:pt-20"} style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    </>
  );
}
