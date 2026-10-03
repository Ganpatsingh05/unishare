"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// Two near-identical sways so every hover replays.
const SWAYS = [
  { rotate: [0, 9, -6, 3, -1, 0], scaleY: 1 },
  { rotate: [0, 9, -6, 3, -1, 0.01], scaleY: 1 },
];
const DROP = { rotate: [-14, 8, -4, 2, 0], scaleY: [0, 1, 1, 1, 1] };

/**
 * A ribbon bookmark tucked into the first "o": it drops in from the top of
 * the letter on load and sways when the headline is hovered. Light mode
 * gives it a navy edge, like the yellow lettering.
 */
function RibbonO({ sways, reduce, edge }) {
  const animate = reduce ? { rotate: 0, scaleY: 1 } : sways ? SWAYS[sways % 2] : DROP;
  const transition = reduce ? { duration: 0 } : sways ? { duration: 0.9, ease: "easeOut" } : { duration: 1.2, delay: 0.45, times: [0, 0.35, 0.6, 0.82, 1], ease: "easeOut" };
  const ribbon = "M 0 0 H 26 V 118 L 13 102 L 0 118 Z";
  return (
    <Box component="span" sx={{ position: "relative", display: "inline-block" }}>
      o
      <Box component="svg" aria-hidden viewBox="0 0 26 120" sx={{ position: "absolute", left: "50%", top: "0.33em", width: "0.13em", height: "0.62em", ml: "-0.065em", overflow: "visible", pointerEvents: "none" }}>
        <m.g style={{ originX: "13px", originY: "0px", transformBox: "view-box" }} initial={reduce ? false : { scaleY: 0, rotate: -14 }} animate={animate} transition={transition}>
          {edge ? <path d={ribbon} fill="none" stroke={edge} strokeWidth="12" strokeLinejoin="round" /> : null}
          <path d={ribbon} fill="#E5484D" />
          <path d="M 4 0 H 9 V 104" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="3" />
        </m.g>
      </Box>
    </Box>
  );
}

/** "Campus, bookmarked." Lead is blue and the accent yellow in both themes. */
export default function BookmarkTitle({ before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [sways, setSways] = useState(0);
  const dark = t.mode === "dark";
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.07em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const at = accent.indexOf("o");
  return (
    <Box component="h1" id={id} onMouseEnter={() => !reduce && setSways((n) => n + 1)} sx={[{ pb: "0.32em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{before}</Box>{" "}
      <Box component="span" sx={{ whiteSpace: "nowrap", ...accentSx }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <RibbonO sways={sways} reduce={reduce} edge={dark ? null : t.brand.inkNavy} />
            {accent.slice(at + 1)}
          </>
        )}
      </Box>
    </Box>
  );
}
