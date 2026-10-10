"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BRAND } from "../homeData";

export const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--h-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--h-surface-solid)]";
export const RISE = [0.22, 1, 0.36, 1];
export const JOIN = [0.76, 0, 0.24, 1];

/** The logo's U: the frame shape every "window" on the home page shares. */
export const U_RADIUS = "32px 32px 50% 50% / 32px 32px 40% 40%";

/**
 * The logo's two arms as a frame: blue down the left, magenta down the right,
 * meeting at the bottom where the hands shake. Drawn in real
 * pixels for its box, so the strokes keep their width and draw in cleanly.
 */
export function UArms({ width = 10, draw = true, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [box, setBox] = useState(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // Drawn with a CSS dash animation over a normalised path length.
  const anim = { pathLength: 1, strokeDasharray: "1 2", style: draw && !reduce ? { animation: "hmArm 1.4s cubic-bezier(0.76, 0, 0.24, 1) 0.15s both" } : undefined };
  let left = "";
  let right = "";
  if (box) {
    const { w, h } = box;
    const m = width / 2;
    const top = h * 0.12;
    const mid = h * 0.6;
    const rx = w / 2 - m;
    const ry = h - m - mid;
    left = `M${m} ${top} V${mid} A${rx} ${ry} 0 0 0 ${w / 2} ${h - m}`;
    right = `M${w - m} ${top} V${mid} A${rx} ${ry} 0 0 1 ${w / 2} ${h - m}`;
  }
  return (
    <svg ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full overflow-visible ${className}`}>
      {box ? (
        <>
          <path d={left} fill="none" stroke={BRAND.blue} strokeWidth={width} strokeLinecap="round" {...anim} />
          <path d={right} fill="none" stroke={BRAND.magenta} strokeWidth={width} strokeLinecap="round" {...anim} />
        </>
      ) : null}
      <style>{`@keyframes hmArm { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }`}</style>
    </svg>
  );
}

/** Small uppercase label that opens each section, with a two-tone tick. */
export function Eyebrow({ children, className = "" }) {
  return (
    <p className={`flex items-center gap-2.5 text-[12.5px] font-extrabold uppercase tracking-[0.16em] text-[var(--h-muted)] ${className}`}>
      <span aria-hidden className="flex h-[5px] w-7 overflow-hidden rounded-full">
        <span className="w-1/2" style={{ backgroundColor: BRAND.blue }} />
        <span className="w-1/2" style={{ backgroundColor: BRAND.magenta }} />
      </span>
      {children}
    </p>
  );
}

// Solid accent colours for headline words: [light, dark] per tone.
const INK = { blue: [BRAND.blue, BRAND.sky], magenta: [BRAND.magenta, "#FF5AAE"] };

/** A headline word in a solid UniShare colour: the logo's blue arm or its magenta one. */
export function BrandInk({ dark, tone = "blue", children, className = "" }) {
  return (
    <span className={className} style={{ color: INK[tone][dark ? 1 : 0] }}>
      {children}
    </span>
  );
}
