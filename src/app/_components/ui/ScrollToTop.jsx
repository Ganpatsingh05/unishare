"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useUI } from "./../../lib/contexts/UniShareContext";

const ScrollToTop = () => {
  const pathname = usePathname();
  const { navigationLoading } = useUI();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' // Smooth scrolling animation
      });
    };

    // Immediate scroll when route changes
    scrollToTop();
    
    // Also scroll after a small delay to catch any delayed content loading
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // Also scroll to top when navigation loading completes
  useEffect(() => {
    if (!navigationLoading) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }, 50);
    }
  }, [navigationLoading]);

  return null; // This component doesn't render anything
};

export default ScrollToTop;
