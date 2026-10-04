"use client";

import React from "react";
import { usePathname } from "next/navigation";
import ClientHeader from "./ClientHeader";

export default function SiteChrome({ children }) {
  const pathname = usePathname();

  const isAdmin = pathname?.startsWith("/admin");
  const isAuthPage = pathname === "/login";

  return (
    <>
      {!isAdmin && !isAuthPage && (
        <ClientHeader />
      )}
      <div className={isAuthPage ? "" : "pt-16 md:pt-20"} style={{ minHeight: '100vh', backgroundColor: 'transparent' }}>
        {children}
      </div>
    </>
  );
}
