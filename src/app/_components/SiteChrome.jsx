"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./NoticeBar";
import ClientHeader from "./ClientHeader";

/**
 * SiteChrome conditionally renders the public site chrome (announcement bar + header)
 * and hides them for any /admin routes where the admin dashboard provides its own layout.
 * Also hides the notice bar on the profile page.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
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
      {/* Add spacing for fixed header and notice bar when not in admin mode */}
      <div 
        className={!isAdmin ? "pt-[calc(var(--notice-bar-height,0px)+6rem)]" : ""}
        style={{
          paddingTop: !isAdmin ? 'calc(var(--notice-bar-height, 0px) + 6rem)' : '0'
        }}
      >
        {children}
      </div>
    </>
  );
}
