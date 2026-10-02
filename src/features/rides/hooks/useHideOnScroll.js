"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True while the user scrolls down, false when they scroll up or stop near
 * the top. Used for the mobile Post-a-ride FAB.
 */
export default function useHideOnScroll({ threshold = 8, topOffset = 120 } = {}) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        const delta = y - lastY.current;
        if (Math.abs(delta) < threshold) return;
        setHidden(delta > 0 && y > topOffset);
        lastY.current = y;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold, topOffset]);

  return hidden;
}
