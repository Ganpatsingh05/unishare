"use client";

import { useUI } from "./../../lib/contexts/UniShareContext";

export default function ThemeWrapper({ children }) {
  const { darkMode } = useUI();

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "theme-bg-dark"
        : "theme-bg-light"
    }`}>
      {children}
    </div>
  );
}
