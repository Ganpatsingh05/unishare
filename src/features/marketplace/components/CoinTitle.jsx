"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// A coin toss: spin on its vertical axis and land face up. Two
// near-identical targets so every hover replays.
const FLIPS = [
  { rotateY: [0, 720], y: ["0em", "-0.28em", "0em"] },
  { rotateY: [0, 720.01], y: ["0em", "-0.28em", "0em"] },
];

/** The first "o" of "second-hand" as a gold rupee coin. */
function CoinO({ flips, reduce, edge }) {
  return (
    <Box component="span" sx={{ position: "relative", display: "inline-block", color: "transparent", WebkitTextStroke: 0, perspective: "3em" }}>
      o
      <Box
        component={m.span}
        aria-hidden
        initial={reduce ? false : { rotateY: 0, y: "0em" }}
        animate={reduce ? { rotateY: 0 } : FLIPS[flips % 2]}
        transition={reduce ? { duration: 0 } : { duration: 1.1, delay: flips ? 0 : 0.5, ease: [0.3, 0.7, 0.4, 1], y: { duration: 1.1, delay: flips ? 0 : 0.5, times: [0, 0.4, 1], ease: ["easeOut", "easeIn"] } }}
        sx={{ position: "absolute", left: "-0.01em", bottom: "0.13em", width: "0.6em", height: "0.6em", pointerEvents: "none" }}
      >
        <Box component="svg" viewBox="0 0 100 100" sx={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}>
          <defs>
            <radialGradient id="mk-gold" cx="38%" cy="32%" r="75%">
              <stop offset="0" stopColor="#FFF3B0" />
              <stop offset="0.45" stopColor="#FFD43B" />
              <stop offset="1" stopColor="#C98A00" />
            </radialGradient>
          </defs>
          {edge ? <circle cx="50" cy="50" r="49" fill={edge} /> : null}
          <circle cx="50" cy="50" r={edge ? 45 : 49} fill="url(#mk-gold)" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="#B07800" strokeWidth="3" strokeDasharray="2 4" />
          <text x="50" y="66" textAnchor="middle" fontSize="48" fontWeight="900" fill="#8A5A00" style={{ fontFamily: "system-ui, sans-serif" }}>₹</text>
          <path d="M 24 34 A 30 30 0 0 1 40 20" stroke="#fff" strokeOpacity="0.7" strokeWidth="5" strokeLinecap="round" fill="none" />
        </Box>
      </Box>
    </Box>
  );
}

/** "Campus, second-hand." Lead is blue and the accent yellow in both themes. */
export default function CoinTitle({ before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [flips, setFlips] = useState(0);
  const dark = t.mode === "dark";
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.07em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const at = accent.indexOf("o");
  return (
    <Box component="h1" id={id} onMouseEnter={() => !reduce && setFlips((n) => n + 1)} sx={[{ pt: "0.2em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{before}</Box>{" "}
      <Box component="span" sx={{ whiteSpace: "nowrap", ...accentSx }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <CoinO flips={flips} reduce={reduce} edge={dark ? null : t.brand.inkNavy} />
            {accent.slice(at + 1)}
          </>
        )}
      </Box>
    </Box>
  );
}
