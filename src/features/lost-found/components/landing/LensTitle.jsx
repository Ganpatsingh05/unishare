"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// Two near-identical targets so every hover replays the sweep.
const SWEEPS = [{ x: [-70, 70] }, { x: [-70, 70.01] }];

/**
 * The "o" of "found" as a magnifying glass, sized to the letter. On load the
 * lens drops in with a small search wobble and a glint crosses the glass;
 * hovering the headline sends the glint across again. The "o" stays in the
 * text (just invisible) so the headline still reads "found".
 */
function LensO({ sweeps, reduce }) {
  const t = useRideTokens();
  const dark = t.mode === "dark";
  // Yellow in both themes; on light backgrounds a navy edge keeps it legible.
  const rim = t.brand.yellow;
  const edge = dark ? null : t.brand.inkNavy;
  const glass = dark ? "rgba(125, 211, 252, 0.16)" : "rgba(56, 189, 248, 0.16)";
  return (
    <Box component="span" sx={{ position: "relative", display: "inline-block", color: "transparent", WebkitTextStroke: 0 }}>
      o
      <Box
        component={m.svg}
        aria-hidden
        viewBox="0 0 100 100"
        initial={reduce ? false : { rotate: -28, scale: 0.4, opacity: 0 }}
        animate={reduce ? { rotate: 0, scale: 1, opacity: 1 } : { rotate: [-28, 10, -6, 0], scale: [0.4, 1.08, 1, 1], opacity: [0, 1, 1, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 1.1, delay: 0.35, times: [0, 0.45, 0.75, 1], ease: "easeOut" }}
        style={{ originX: 0.5, originY: 0.5 }}
        sx={{ position: "absolute", left: "-0.015em", bottom: "0.14em", width: "0.62em", height: "0.62em", overflow: "visible", pointerEvents: "none" }}
      >
        <defs>
          <clipPath id="lf-lens-glass">
            <circle cx="50" cy="50" r="31" />
          </clipPath>
        </defs>
        {/* Handle first, so the rim sits over its joint. */}
        {edge ? <path d="M 80 80 L 103 103" stroke={edge} strokeWidth="27" strokeLinecap="round" /> : null}
        <path d="M 80 80 L 103 103" stroke={rim} strokeWidth="19" strokeLinecap="round" />
                <circle cx="50" cy="50" r="31" fill={glass} />
        <g clipPath="url(#lf-lens-glass)">
          {/* Fixed highlight plus a glint band that crosses on load and hover. */}
          <path d="M 30 40 A 22 22 0 0 1 46 26" stroke="#fff" strokeOpacity="0.75" strokeWidth="6" strokeLinecap="round" fill="none" />
          <g transform="rotate(35 50 50)">
          <m.rect
            x="38"
            y="-20"
            width="14"
            height="140"
            fill="#fff"
            opacity={0.55}
            initial={{ x: -70 }}
            animate={reduce ? { x: -70 } : SWEEPS[sweeps % 2]}
            transition={reduce ? { duration: 0 } : { duration: 0.75, delay: sweeps ? 0 : 1.2, ease: [0.4, 0, 0.2, 1] }}
          />
          </g>
        </g>
        {edge ? <circle cx="50" cy="50" r="39" fill="none" stroke={edge} strokeWidth="25" /> : null}
        <circle cx="50" cy="50" r="39" fill="none" stroke={rim} strokeWidth="17" />
      </Box>
    </Box>
  );
}

/**
 * Headline in three parts: a lead ("Lost it?"), the middle ("Someone") and the
 * accent ("found it.") whose "o" is the lens. The lead is blue and the accent
 * yellow in both themes.
 */
export default function LensTitle({ lead, before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [sweeps, setSweeps] = useState(0);
  const dark = t.mode === "dark";
  // "found it." is yellow in both themes (navy edge in light); the lead is blue in both.
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.07em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const leadColor = dark ? t.brand.skyBright : t.brand.actionBlue;
  const at = accent.indexOf("o");
  return (
    <Box component="h1" id={id} onMouseEnter={() => !reduce && setSweeps((n) => n + 1)} sx={[{ pb: "0.12em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {lead ? (
        <Box component="span" sx={{ color: leadColor }}>
          {lead}{" "}
        </Box>
      ) : null}
      {before}{" "}
      <Box component="span" sx={{ whiteSpace: "nowrap", ...accentSx }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <LensO sweeps={sweeps} reduce={reduce} />
            {accent.slice(at + 1)}
          </>
        )}
      </Box>
    </Box>
  );
}
