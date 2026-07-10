"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ClientHeader from "./ClientHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isProfile = pathname === "/profile";
  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAdmin && !isAuthPage && !isProfile && (
        <ClientHeader />
      )}
      <div className={isAuthPage || isProfile ? "" : "pt-16 md:pt-20"} style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    </>
  );
}
