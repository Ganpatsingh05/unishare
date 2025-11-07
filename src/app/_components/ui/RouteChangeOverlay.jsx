"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useUI } from "./../../lib/contexts/UniShareContext";

const MIN_DURATION_MS = 800; // Much shorter minimum duration
const MAX_DURATION_MS = 2500; // Maximum loading time as safety net

export default function RouteChangeOverlay() {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const timerRef = useRef(null);
  const maxTimerRef = useRef(null);
  const { startNavigationLoading, stopNavigationLoading } = useUI();

  // Detect when page is actually loaded
  useEffect(() => {
    if (!pathname) return;

    const handleLoadComplete = () => {
      // Stop navigation loading when page is ready
      setTimeout(() => {
        stopNavigationLoading();
      }, MIN_DURATION_MS); // Small delay for smooth UX
    };

    // Listen for various load complete events
    if (typeof window !== 'undefined') {
      window.addEventListener('load', handleLoadComplete);
      document.addEventListener('DOMContentLoaded', handleLoadComplete);
      
      // Also check if already loaded
      if (document.readyState === 'complete') {
        handleLoadComplete();
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('load', handleLoadComplete);
        document.removeEventListener('DOMContentLoaded', handleLoadComplete);
      }
    };
  }, [pathname, stopNavigationLoading]); // Keep dependencies consistent

  useEffect(() => {
    // On client navigation, show NavigationLoader for ALL routes
    if (prevPathRef.current !== pathname && pathname !== prevPathRef.current) {
      
      // Clear any existing timers
      clearTimeout(timerRef.current);
      clearTimeout(maxTimerRef.current);
      
      // Custom messages for different routes
      const routeMessages = {
        '/share-ride': 'Finding available rides...',
        '/housing': 'Loading housing options...',
        '/marketplace': 'Loading marketplace...',
        '/ticket': 'Loading event tickets...',
        '/lost-found': 'Loading lost & found items...',
        '/announcements': 'Loading announcements...',
        '/resources': 'Loading resources...',
        '/contacts': 'Loading contacts...',
        '/profile': 'Loading your profile...',
        '/login': 'Signing you in...',
        '/register': 'Setting up your account...',
        '/admin': 'Loading admin dashboard...',
        '/info': 'Loading information...',
        '/settings': 'Loading settings...',
        '/': 'Loading UniShare...'
      };
      
      // Find the appropriate message
      let message = 'Loading...';
      for (const [route, msg] of Object.entries(routeMessages)) {
        if (pathname === '/' || pathname?.startsWith(route)) {
          message = msg;
          break;
        }
      }
      
      // Use NavigationLoader for ALL routes now
      startNavigationLoading(message);
      
      // Safety net - force stop after maximum duration
      maxTimerRef.current = setTimeout(() => {
        stopNavigationLoading();
      }, MAX_DURATION_MS);
      
      prevPathRef.current = pathname;
    }
    
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(maxTimerRef.current);
    };
  }, [pathname, startNavigationLoading, stopNavigationLoading]); // Keep dependencies consistent

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(maxTimerRef.current);
      stopNavigationLoading();
    };
  }, [stopNavigationLoading]);

  // NavigationLoader handles all loading now - no need for custom GIF loaders
  return null;
}
