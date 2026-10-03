"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";

// Lightweight, privacy-friendly cookie consent banner.
// Stores consent in localStorage under key 'cookie:consent:v1'.
// Rendered via createPortal directly into document.body so no parent
// transform / will-change / stacking-context can ever break position:fixed.

const CONSENT_KEY = "cookie:consent:v1";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client
    setMounted(true);
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

  // Don't render until client-side hydration is complete
  if (!mounted || !visible) return null;

  const banner = (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "20px",
        zIndex: 9999,
        width: "calc(100vw - 40px)",
        maxWidth: "420px",
      }}
    >
      <div
        style={{
          position: "relative",
          borderRadius: "16px",
          background: "#ffffff",
          color: "#1f2937",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
          padding: "32px 20px 16px",
        }}
      >
        {/* Cookie badge overlay */}
        <div
          style={{
            position: "absolute",
            top: "-64px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Image
            src="/images/services/cookie.webp"
            alt="Cookie"
            width={100}
            height={100}
            priority
          />
        </div>

        <p style={{ fontSize: "14px", lineHeight: "1.6", color: "#374151", paddingRight: "8px" }}>
          We use cookies for essential website functions and to better understand how you use our site, so we can create the best possible experience for you{" "}
          <span aria-hidden>💗</span>
        </p>

        <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/info/privacy"
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#4b5563",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
            }}
          >
            Privacy Policy
          </Link>
          <button
            onClick={acceptAll}
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              background: "#10b981",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "600",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              transition: "background 0.15s ease, transform 0.1s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );

  // Render via portal directly into document.body to bypass any parent
  // stacking context (transforms, will-change, overflow) that would
  // otherwise break position:fixed viewport anchoring.
  return createPortal(banner, document.body);
}
