"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "./header/SiteHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/console") || pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAdmin && !isAuthPage && (
        <SiteHeader />
      )}
      <div className={isAuthPage ? "" : "pt-16 md:pt-20"} style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    </>
  );
}
