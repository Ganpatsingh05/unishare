"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// Lightweight, privacy-friendly cookie consent banner.
// Stores consent in localStorage under key 'cookie:consent:v1'.
// Usage: Place <CookieConsent /> in RootLayout to show across the app.

const CONSENT_KEY = "cookie:consent:v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only run on client
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      const consent = raw ? JSON.parse(raw) : null;
      if (!consent || consent?.accepted !== true) {
        setVisible(true);
      }
    } catch (_) {
      // If localStorage is unavailable, still show banner
      setVisible(true);
    }
  }, []);

  const acceptAll = useCallback(() => {
    try {
      localStorage.setItem(
        CONSENT_KEY,
        JSON.stringify({ accepted: true, date: new Date().toISOString(), version: 1 })
      );
    } catch (_) {
      // noop
    }
    setVisible(false);
    // Hook: initialize analytics or other scripts here if added later
    // e.g., window.gtag && window.gtag('consent', 'update', { ad_user_data: 'granted', ad_personalization: 'granted', ad_storage: 'granted', analytics_storage: 'granted' });
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:w-[420px]"
    >
      <div className="relative rounded-2xl bg-white text-gray-800 shadow-2xl ring-1 ring-black/5 px-5 pt-8 pb-4 sm:px-6 sm:pt-9 sm:pb-5">
        {/* Cookie badge overlay */}
  <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          {/* Prefer cookie.png if present; keep .svg as a fallback via onError swap */}
          <Image
            src="/cookie.png"
            alt="Cookie"
            width={100}
            height={100}
            priority
            onError={(e) => {
              const img = e?.target;
              if (img && img.tagName === 'IMG') {
                img.src = '/cookie.svg';
              }
            }}
          />
        </div>

        <p className="text-sm leading-6 text-gray-700 pr-2">
          We use cookies for essential website functions and to better understand how you use our site, so we can create the best possible experience for you <span aria-hidden>💗</span>
        </p>

        <div className="mt-4 flex items-center gap-3">
          <Link
            href="/footerpages/privacy"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 underline underline-offset-4"
          >
            Privacy Policy
          </Link>
          <button
            onClick={acceptAll}
            className="ml-auto inline-flex items-center justify-center rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.98]"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
