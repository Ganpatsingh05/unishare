"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import { useUI } from "./../../lib/contexts/UniShareContext";

export default function ClientHeader() {
  const [mounted, setMounted] = useState(false);
  const { setLogoRotation } = useUI();

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Smooth, throttled mouse handler using requestAnimationFrame
    const ticking = { mouse: false };

    const onMouseMove = (e) => {
      if (!ticking.mouse) {
        ticking.mouse = true;
        requestAnimationFrame(() => {
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI) * 0.1;
          setLogoRotation(rotation);
          ticking.mouse = false;
        });
      }
    };

    if (mounted) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mounted, setLogoRotation]);

  // Show loading skeleton until mounted
  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full h-20 bg-white/95 dark:bg-[#1a1a1a]/95 border-b border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-md">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              <div className="hidden md:flex items-center relative flex-1 max-w-2xl mx-4">
                <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Now Header gets logoRotation from context, not props
  return <Header />;
}
