"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { useUI } from "../lib/contexts/UniShareContext";

export default function AnnouncementBar() {
  const { darkMode } = useUI();
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({
    id: 'fallback-welcome',
    title: 'Welcome to UniShare',
    body: 'Your campus hub for rides, deals, rooms, and notes. Stay connected!',
    priority: 'normal'
  }); // Start with fallback value
  const [visible, setVisible] = useState(true);
  const [error, setError] = useState(null);

  // LocalStorage key for dismiss (stores announcement id & timestamp)
  const DISMISS_KEY = 'unishare_announcement_dismiss';

  // Set CSS custom property for notice bar height
  useEffect(() => {
    if (visible) {
      // Set a reasonable height estimate for the notice bar
      document.documentElement.style.setProperty('--notice-bar-height', '48px');
    } else {
      document.documentElement.style.setProperty('--notice-bar-height', '0px');
    }
  }, [visible]);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const { getNoticesForNoticeBar } = await import('../lib/api');
        const res = await getNoticesForNoticeBar();
        const list = res.announcements || res.data || (Array.isArray(res) ? res : []);
        // Pick most recent active (optionally check expiresAt)
        const active = list
          .filter(a => a.active !== false && (!a.expiresAt || new Date(a.expiresAt) > new Date()))
          .sort((a,b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        const latest = active[0];
        if (!cancelled) {
          if (latest) {
            // Check dismiss record
            try {
              const raw = localStorage.getItem(DISMISS_KEY);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.id === latest.id) {
                  setVisible(false);
                } else {
                  // Update to fetched announcement if not dismissed
                  setAnnouncement(latest);
                }
              } else {
                // No dismiss record, show the fetched announcement
                setAnnouncement(latest);
              }
            } catch { 
              // If localStorage fails, show the announcement anyway
              setAnnouncement(latest);
            }
          }
          // If no latest announcement, keep the fallback (no change needed)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          // Keep the fallback announcement on error, don't override it
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const dismiss = () => {
    if (announcement?.id) {
      try {
        localStorage.setItem(DISMISS_KEY, JSON.stringify({ id: announcement.id, ts: Date.now() }));
      } catch {/* ignore */}
    }
    setVisible(false);
    // Update CSS custom property when dismissed
    document.documentElement.style.setProperty('--notice-bar-height', '0px');
  };

  if (!visible) return null;

  const priorityAccent = announcement?.priority === 'high'
    ? (darkMode ? 'text-red-400' : 'text-red-600')
    : announcement?.priority === 'low'
      ? (darkMode ? 'text-gray-400' : 'text-gray-600')
      : (darkMode ? 'text-yellow-400' : 'text-orange-600');

  return (
    <div className={`w-full transition-all duration-300 border-b backdrop-blur-md relative z-60 ${darkMode ? 'bg-gradient-to-r from-gray-900/95 via-gray-950/90 to-gray-900/95 border-gray-700/50' : 'bg-gradient-to-r from-orange-50/95 via-orange-100/90 to-orange-50/95 border-orange-200/50'}`}> 
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
        <div className="flex items-center gap-3 py-2.5 sm:py-3">
          <p className={`flex-1 text-center text-xs sm:text-sm tracking-wide transition-all duration-500 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <Megaphone className={`inline-block w-4 h-4 mr-2 align-[-2px] ${priorityAccent}`} />
            {announcement && (
              <>
                <span className="font-semibold mr-1">{announcement.title}:</span>
                <span>{announcement.body}</span>
                {announcement.expiresAt && (
                  <span className={`ml-2 italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>({new Date(announcement.expiresAt).toLocaleDateString()})</span>
                )}
              </>
            )}
          </p>
          <button aria-label="Dismiss notice" onClick={dismiss} className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border transition-colors ${darkMode ? 'border-gray-600/50 text-gray-300 hover:bg-gray-800/80 hover:border-gray-500' : 'border-orange-300/50 text-gray-700 hover:bg-orange-100/80 hover:border-orange-400'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}