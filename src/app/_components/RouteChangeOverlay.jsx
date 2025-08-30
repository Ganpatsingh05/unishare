"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import RouteLoader from "./RouteLoader";

const MIN_DURATION_MS = 3000; // ensure the loader is visible long enough

export default function RouteChangeOverlay() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    // On client navigation, show overlay for a minimum duration
    if (prevPathRef.current !== pathname) {
      setVisible(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), MIN_DURATION_MS);
      prevPathRef.current = pathname;
    }
    return () => clearTimeout(timerRef.current);
  }, [pathname]);

  // Exclude share-ride and housing pages from showing the loader
  const excluded = pathname?.startsWith("/share-ride") || pathname?.startsWith("/housing");
  if (!visible || excluded) return null;

  // Infer a theme variant from the pathname for nicer visuals
  let variant = "default";
  if (pathname?.startsWith("/resources")) variant = "resources";
  else if (pathname?.startsWith("/marketplace/buy")) variant = "marketplace-buy";
  else if (pathname?.startsWith("/marketplace/sell")) variant = "marketplace-sell";
  else if (pathname?.startsWith("/lost-found/view-found")) variant = "lost-found-view";
  else if (pathname?.startsWith("/lost-found/found")) variant = "lost-found-found";
  else if (pathname?.startsWith("/lost-found/report")) variant = "lost-found-report";
  else if (pathname?.startsWith("/lost-found")) variant = "lost-found";

  return <RouteLoader variant={variant} />;
}
