"use client";

import { useEffect } from "react";

let locks = 0;
let saved = null;

/**
 * Freezes page scrolling while an overlay (dropdown, sheet, dialog) is open.
 * MUI only locks <body>, but globals.css gives <html> its own overflow, so the
 * page scrolls on <html> and MUI's lock does nothing. This locks both, and
 * keeps the scroll position. Nested overlays share one lock.
 */
export default function usePageScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const html = document.documentElement;
    const { body } = document;
    if (locks === 0) {
      saved = { html: html.style.overflow, body: body.style.overflow, behavior: html.style.scrollBehavior };
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
    locks += 1;
    return () => {
      locks -= 1;
      if (locks === 0 && saved) {
        // No smooth-scroll jump when the overflow comes back.
        html.style.scrollBehavior = "auto";
        html.style.overflow = saved.html;
        body.style.overflow = saved.body;
        requestAnimationFrame(() => {
          html.style.scrollBehavior = saved?.behavior ?? "";
        });
      }
    };
  }, [active]);
}
