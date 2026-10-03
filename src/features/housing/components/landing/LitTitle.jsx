"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

/**
 * The second "o" of "room" doubles as the ring of a key. On load the key's
 * blade grows down out of the letter and swings on the ring until it settles;
 * the bit is cut as the UniShare "U" turned on its side. Hovering the
 * headline gives it another jingle.
 */
/**
 * The first "o" of "room" as an arched window, sized to the letter: frame in
 * the word's colour, four panes behind glazing bars, a sill, and curtains.
 * On load the room behind it lights up and the curtains draw open; hovering
 * the headline flicks the light off and on. The "o" stays in the text (just
 * invisible) so the headline still reads "room".
 */
function WindowO({ lit, reduce }) {
  const t = useRideTokens();
  const dark = t.mode === "dark";
  const frame = dark ? t.brand.yellow : t.brand.actionBlue;
  const night = dark ? "#0B1626" : "#1B3A66";
  const glow = dark ? "#FFF3C4" : t.brand.yellow;
  const curtain = dark ? t.brand.skyBright : t.brand.skyBright;
  const ease = reduce ? { duration: 0 } : { duration: 0.5, ease: [0.22, 1, 0.36, 1] };
  // Window outline: arched head, square base (viewBox 0 0 100 104).
  const outer = "M 6 100 V 44 A 44 44 0 0 1 94 44 V 100 Z";
  const glass = "M 20 88 V 46 A 30 30 0 0 1 80 46 V 88 Z";
  return (
    <Box component="span" sx={{ position: "relative", display: "inline-block", color: "transparent" }}>
      o
      <Box
        component="svg"
        aria-hidden
        viewBox="0 0 100 104"
        sx={{ position: "absolute", left: "0.03em", width: "0.56em", bottom: "0.135em", height: "0.585em", overflow: "visible", pointerEvents: "none" }}
      >
        <defs>
          <clipPath id="hs-window-glass">
            <path d={glass} />
          </clipPath>
          <radialGradient id="hs-window-light" cx="50%" cy="62%" r="65%">
            <stop offset="0" stopColor="#FFFBEA" />
            <stop offset="0.6" stopColor={glow} />
            <stop offset="1" stopColor={t.brand.yellowDeep} />
          </radialGradient>
        </defs>
        <path d={outer} fill={frame} />
        <g clipPath="url(#hs-window-glass)">
          <rect x="0" y="0" width="100" height="104" fill={night} />
          <m.rect x="0" y="0" width="100" height="104" fill="url(#hs-window-light)" initial={false} animate={{ opacity: lit ? 1 : 0 }} transition={reduce ? { duration: 0 } : { duration: 0.35, delay: lit ? 0.15 : 0 }} />
          {/* Curtains, drawn back to the sides once the light is on. */}
          <m.path d="M 20 14 H 52 C 46 40, 50 66, 44 88 H 20 Z" fill={curtain} initial={false} animate={{ x: lit ? -20 : 0, scaleX: lit ? 0.55 : 1 }} transition={{ ...ease, delay: lit && !reduce ? 0.35 : 0 }} style={{ originX: 0 }} />
          <m.path d="M 80 14 H 48 C 54 40, 50 66, 56 88 H 80 Z" fill={curtain} initial={false} animate={{ x: lit ? 20 : 0, scaleX: lit ? 0.55 : 1 }} transition={{ ...ease, delay: lit && !reduce ? 0.35 : 0 }} style={{ originX: 1 }} />
        </g>
        {/* Glazing bars over the glass. */}
        <path d="M 50 16 V 88 M 20 58 H 80" stroke={frame} strokeWidth="7" />
        {/* Sill. */}
        <rect x="0" y="92" width="100" height="12" rx="3" fill={frame} />
      </Box>
    </Box>
  );
}

function KeyO({ animate, transition, reduce }) {
  const t = useRideTokens();
  const dark = t.mode === "dark";
  // The whole key (ring and blade) is one brand object: yellow with a navy
  // outline on light pages, sky blue against the yellow words on dark ones.
  const body = dark ? t.brand.skyBright : t.brand.yellow;
  const edge = dark ? "none" : t.brand.inkNavy;
  return (
    <Box
      component="span"
      sx={{
        position: "relative",
        display: "inline-block",
        color: body,
        WebkitTextStroke: dark ? "0" : `0.028em ${t.brand.inkNavy}`,
        paintOrder: "stroke fill",
      }}
    >
      o
      <Box
        component={m.svg}
        aria-hidden
        viewBox="0 0 20 64"
        initial={reduce ? false : { rotate: -38, scaleY: 0, opacity: 0 }}
        animate={animate}
        transition={transition}
        style={{ originX: 0.5, originY: 0.04 }}
        sx={{
          position: "absolute",
          left: "50%",
          // The ring is the bottom of the letter: the blade hangs from just
          // above the baseline.
          top: "calc(100% - 0.26em)",
          width: "0.25em",
          height: "0.62em",
          ml: "-0.125em",
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        {/* Collar where the blade meets the ring. */}
        <rect x="3" y="0" width="14" height="8" rx="3" fill={dark ? t.brand.yellow : t.brand.actionBlue} />
        {/* Shaft. */}
        <rect x="6.5" y="6" width="7" height="54" rx="2.5" fill={body} stroke={edge} strokeWidth="1.6" />
        {/* The bit: a sideways U, the brand mark as the key's teeth. */}
        <path d="M 12.5 30 H 20 V 58 H 12.5 V 51.5 H 15.5 V 36.5 H 12.5 Z" fill={body} stroke={edge} strokeWidth="1.6" strokeLinejoin="round" />
      </Box>
    </Box>
  );
}

const DROP = {
  rotate: [-38, 22, -12, 6, -2, 0],
  scaleY: [0, 1, 1, 1, 1, 1],
  opacity: [0, 1, 1, 1, 1, 1],
};
const DROP_TIMING = { duration: 1.5, delay: 0.5, times: [0, 0.28, 0.5, 0.7, 0.86, 1], ease: "easeOut" };
// Two near-identical swings, so each hover is a new target and replays.
const JINGLES = [
  { rotate: [0, 16, -11, 6, -2, 0], scaleY: 1, opacity: 1 },
  { rotate: [0, 15.9, -11, 6, -2, 0.01], scaleY: 1, opacity: 1 },
];
const JINGLE_TIMING = { duration: 0.9, ease: "easeOut" };

export default function LitTitle({ before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  // Declarative keyframes (not imperative controls): the page loads its
  // animation features lazily, and they play once those arrive.
  const [jingles, setJingles] = useState(0);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setLit(true), reduce ? 0 : 450);
    return () => clearTimeout(id);
  }, [reduce]);
  const accentColor = t.mode === "dark" ? t.brand.yellow : t.brand.actionBlue;
  // The key hangs from the second "o" of the first "oo" (room).
  const at = accent.indexOf("oo");
  const animate = reduce ? { rotate: 0, scaleY: 1, opacity: 1 } : jingles ? JINGLES[jingles % 2] : DROP;
  const transition = reduce ? { duration: 0 } : jingles ? JINGLE_TIMING : DROP_TIMING;

  const jingle = () => {
    if (reduce) return;
    setJingles((n) => n + 1);
    setLit(false);
    setTimeout(() => setLit(true), 260);
  };

  return (
    <Box component="h1" id={id} onMouseEnter={jingle} sx={[{ pb: at < 0 ? 0 : "0.32em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {before}{" "}
      <Box component="span" sx={{ whiteSpace: "nowrap", color: accentColor }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <WindowO lit={lit} reduce={reduce} />
            <KeyO animate={animate} transition={transition} reduce={reduce} />
            {accent.slice(at + 2)}
          </>
        )}
      </Box>
    </Box>
  );
}
