"use client";

import { useState } from "react";
import { Megaphone, X } from "lucide-react";
import { useUI } from "../lib/contexts/UniShareContext";

export default function AnnouncementBar() {
  const [noticeVisible, setNoticeVisible] = useState(true);
  const { darkMode } = useUI();

  if (!noticeVisible) return null;

  return (
    <div
      className={`w-full transition-all duration-300 border-b backdrop-blur-md ${
        darkMode
          ? 'bg-gradient-to-r from-gray-900/95 via-gray-900/80 to-gray-900/95 border-gray-800'
          : 'bg-gradient-to-r from-yellow-50 via-blue-50 to-yellow-50 border-gray-200'
      }`}
    >
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="flex items-center gap-3 py-2.5 sm:py-3">
          <p className={`flex-1 text-center text-xs sm:text-sm tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <Megaphone className={`inline-block w-4 h-4 mr-2 align-[-2px] ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
            Welcome to <span className={`${darkMode ? 'text-yellow-300' : 'text-yellow-600'} font-semibold`}>Uni</span>
            <span className={`${darkMode ? 'text-sky-300' : 'text-sky-600'} font-semibold`}>Share</span> — your campus hub for rides, deals, rooms, and notes.
            <span className={`ml-2 hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Stay tuned for weekly updates and new features.</span>
          </p>
          <button
            aria-label="Dismiss notice"
            onClick={() => setNoticeVisible(false)}
            className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-colors ${
              darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}