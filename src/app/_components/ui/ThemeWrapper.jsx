"use client";

import { useUI } from "./../../lib/contexts/UniShareContext";

export default function ThemeWrapper({ children }) {
  const { darkMode } = useUI();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode
        ? "theme-bg-dark"
        : "theme-bg-light"
    }`}>
      {children}
    </div>
  );
}
