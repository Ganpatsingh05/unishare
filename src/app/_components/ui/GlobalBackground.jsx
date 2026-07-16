"use client";

import { useUI } from "../../lib/contexts/UniShareContext";
import GalaxyDesktop from "./GalaxyDesktop";

export default function GlobalBackground() {
  const { darkMode } = useUI();

  return (
    <div 
      className="fixed inset-0 transition-colors duration-500 overflow-hidden -z-50"
      style={{ backgroundColor: darkMode ? '#0a0a0a' : '#fafafa' }}
    >
      <GalaxyDesktop />
    </div>
  );
}
