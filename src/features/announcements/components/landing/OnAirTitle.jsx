"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// Two near-identical targets so every hover replays the ripple.
const PULSES = [
  { opacity: [0, 1, 0.35, 1, 0.35, 1], scale: [0.6, 1, 1, 1, 1, 1] },
  { opacity: [0, 1, 0.35, 1, 0.35, 1.0001], scale: [0.6, 1, 1, 1, 1, 1] },
];

// Upper arc of radius r around the ring's centre, 30° above horizontal each side.
const arcPath = (r) => `M ${50 - r * 0.866} ${50 - r * 0.5} A ${r} ${r} 0 0 1 ${50 + r * 0.866} ${50 - r * 0.5}`;

/**
 * The "o" of "on" as a transmitter: a ring with a live dot, and two
 * signal arcs above it that ripple outwards on load and when the headline
 * is hovered. The "o" stays in the text (just invisible) so it still reads.
 */
function SignalO({ pulses, reduce, edge }) {
  const t = useRideTokens();
  const fill = t.brand.yellow;
  const arc = (r, i) => (
    <m.path
      key={r}
      d={arcPath(r)}
      fill="none"
      stroke={fill}
      strokeWidth="9"
      strokeLinecap="round"
      style={{ originX: "50px", originY: "50px", transformBox: "view-box" }}
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={reduce ? { opacity: 1, scale: 1 } : PULSES[pulses % 2]}
      transition={reduce ? { duration: 0 } : { duration: 1.6, delay: (pulses ? 0 : 0.5) + i * 0.12, ease: "easeOut" }}
    />
  );
  return (
    <Box component="span" sx={{ position: "relative", display: "inline-block", color: "transparent", WebkitTextStroke: 0 }}>
      o
      <Box component="svg" aria-hidden viewBox="0 0 100 100" sx={{ position: "absolute", left: "0.01em", bottom: "0.14em", width: "0.58em", height: "0.58em", overflow: "visible", pointerEvents: "none" }}>
        {edge ? (
          <g stroke={edge} fill="none" strokeLinecap="round">
            <circle cx="50" cy="50" r="38" strokeWidth="22" />
            <g transform="translate(0 -6)" strokeWidth="13">
              <path d={arcPath(54)} />
              <path d={arcPath(72)} />
            </g>
          </g>
        ) : null}
        <circle cx="50" cy="50" r="38" fill="none" stroke={fill} strokeWidth="17" />
        <m.circle cx="50" cy="50" r="13" fill="#FF5A5F" animate={reduce ? undefined : { opacity: [1, 0.35, 1] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        <g transform="translate(0 -6)">
          {arc(54, 0)}
          {arc(72, 1)}
        </g>
      </Box>
    </Box>
  );
}

/** "Campus, on air." with the transmitter "o". Accent is yellow in both themes. */
export default function OnAirTitle({ before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [pulses, setPulses] = useState(0);
  const dark = t.mode === "dark";
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.07em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const at = accent.indexOf("o");
  return (
    <Box component="h1" id={id} onMouseEnter={() => !reduce && setPulses((n) => n + 1)} sx={[{ pt: "0.25em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{before}</Box>{" "}
      <Box component="span" sx={{ whiteSpace: "nowrap", ...accentSx }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <SignalO pulses={pulses} reduce={reduce} edge={dark ? null : t.brand.inkNavy} />
            {accent.slice(at + 1)}
          </>
        )}
      </Box>
    </Box>
  );
}
