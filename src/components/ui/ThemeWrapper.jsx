"use client";

import { useUI } from '@contexts/UniShareContext';

export default function ThemeWrapper({ children }) {
  const { darkMode } = useUI();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-transparent">
      {children}
    </div>
  );
}
