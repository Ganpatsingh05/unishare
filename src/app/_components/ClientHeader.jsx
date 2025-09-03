"use client";

import { useState, useEffect } from "react";
import Header from "./Header";

export default function ClientHeader() {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);

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
          setLogoRotation((prev) => (Math.abs(prev - rotation) < 0.1 ? prev : rotation));
          ticking.mouse = false;
        });
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  return (
    <Header 
      darkMode={darkMode} 
      onThemeToggle={handleThemeToggle} 
      logoRotation={logoRotation} 
    />
  );
}