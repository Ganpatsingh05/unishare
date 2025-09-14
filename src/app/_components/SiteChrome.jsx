"use client";

import React from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import ClientHeader from "./ClientHeader";

/**
 * SiteChrome conditionally renders the public site chrome (announcement bar + header)
 * and hides them for any /admin routes where the admin dashboard provides its own layout.
 */
export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && (
        <>
          <AnnouncementBar />
          <ClientHeader />
        </>
      )}
      {children}
    </>
  );
}
