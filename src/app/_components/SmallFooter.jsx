"use client";

import { useUI } from "../lib/contexts/UniShareContext";

export default function SmallFooter() {
  const { darkMode } = useUI();

  return (
    <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1">
          <span className="brand-wordmark text-xs font-semibold tracking-wide">
            <span className="brand-uni">Uni</span>
            <span className="brand-share">Share</span>
          </span>
          <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            ™
          </span>
        </div>
      </div>
      <div className={`text-center text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        © 2025 All rights reserved
      </div>
    </div>
  );
}