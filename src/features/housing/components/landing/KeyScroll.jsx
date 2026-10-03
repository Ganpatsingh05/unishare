"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// Layout of the indicator, in px.
const TRACK = 240; // distance the key travels before it reaches the door
const KEY = 36; // key box size
const RING_Y = (8 / 28) * KEY; // centre of the key's ring inside its box
// House badge drawn in a 48 x 56 box and shown at 75% size; HOLE is the
// keyhole centre in that box.
const HOUSE_SCALE = 0.75;
const HOLE = 41;
const DOOR = { top: TRACK + 40, w: 48 * HOUSE_SCALE, h: 56 * HOUSE_SCALE, hole: HOLE * HOUSE_SCALE };
const LAND = DOOR.top + DOOR.hole - RING_Y; // key position with its ring over the keyhole
const OPEN_AT = 0.985;

const SPRING = { type: "spring", stiffness: 220, damping: 22 };

/**
 * A small key on the right margin that doubles as a scroll indicator.
 * Going down the page it hangs and sways with the scroll speed as it slides
 * down a track. Near the end its blade slides into a door's keyhole; at the
 * bottom it turns, and the door swings open onto warm light. Scrolling back
 * plays it in reverse. Transforms only; shown where the page has a margin.
 */
export default function KeyScroll() {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const dark = t.mode === "dark";
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 });
  const p = reduce ? scrollYProgress : progress;

  const y = useTransform(p, [0, 0.9, OPEN_AT - 0.005], [0, TRACK, LAND], { clamp: true });
  // The blade disappears into the keyhole as the key lands.
  const blade = useTransform(p, [0.9, OPEN_AT - 0.005], [1, 0], { clamp: true });
  // The solid line follows the key all the way to the door.
  const fill = useTransform(y, (v) => Math.min(1, Math.max(0, v / (DOOR.top - RING_Y))));
  // Sway like a key on a ring: tilt against the scroll speed, settle when it stops.
  const velocity = useVelocity(scrollYProgress);
  const tilt = useTransform(velocity, [-1.2, 0, 1.2], [18, 0, -18], { clamp: true });
  const sway = useSpring(tilt, { stiffness: 140, damping: 9 });
  const settle = useTransform(p, [0.86, 0.92], [1, 0], { clamp: true });
  const rotate = useTransform([sway, settle], ([s, k]) => (reduce ? 0 : s * k));

  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = v >= OPEN_AT;
    setOpen((prev) => (prev === next ? prev : next));
  });

  const body = dark ? t.brand.skyBright : t.brand.yellow;
  const edge = dark ? "none" : t.brand.inkNavy;
  const track = dark ? "rgba(148, 178, 214, 0.28)" : "rgba(21, 101, 216, 0.22)";
  const travelled = dark ? t.brand.skyBright : t.brand.actionBlue;
  const brand = dark ? t.brand.skyBright : t.brand.actionBlue;
  const wall = dark ? "#16233A" : "#FFFFFF";
  const doorPanel = dark ? "#1E4C8F" : t.brand.actionBlue;
  const step = reduce ? { duration: 0 } : SPRING;

  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "none", lg: "block" },
        position: "fixed",
        right: 24,
        top: "50%",
        mt: `-${(DOOR.top + DOOR.h) / 2}px`,
        width: DOOR.w,
        height: DOOR.top + DOOR.h,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      {/* Track: dotted ahead, solid where the key has been. */}
      <Box sx={{ position: "absolute", left: "50%", top: RING_Y, height: DOOR.top - RING_Y, width: 0, borderLeft: `2px dotted ${track}` }} />
      <Box
        component={m.div}
        style={{ scaleY: fill, originY: 0 }}
        sx={{ position: "absolute", left: "calc(50% - 1px)", top: RING_Y, height: DOOR.top - RING_Y, width: 2, borderRadius: 1, backgroundColor: travelled, opacity: 0.55 }}
      />

      {/* The house: a rounded badge with a gable window and an arched front
          door. When the key turns, the door swings open onto warm light. */}
      <Box sx={{ position: "absolute", left: 0, top: DOOR.top, width: DOOR.w, height: DOOR.h }}>
        <svg viewBox="0 0 48 56" width={DOOR.w} height={DOOR.h} style={{ overflow: "visible" }}>
          <path
            d="M 24 3 L 43.5 18.6 Q 46 20.6 46 23.8 V 50 Q 46 54 42 54 H 6 Q 2 54 2 50 V 23.8 Q 2 20.6 4.5 18.6 Z"
            fill={wall}
            stroke={brand}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Gable window: lights up with the door. */}
          <circle cx="24" cy="19" r="4" fill={dark ? "#0B1626" : "#E8F1FF"} stroke={brand} strokeWidth="1.6" />
          <m.circle cx="24" cy="19" r="2.8" fill={t.brand.yellow} initial={false} animate={{ opacity: open ? 1 : 0 }} transition={reduce ? { duration: 0 } : { duration: 0.3, delay: open ? 0.6 : 0 }} />
          {/* Warm light inside the doorway. */}
          <path d="M 15 54 V 37 A 9 9 0 0 1 33 37 V 54 Z" fill={t.brand.yellow} />
          <m.path d="M 15 54 V 37 A 9 9 0 0 1 33 37 V 54 Z" fill="#FFF6D6" initial={false} animate={{ opacity: open ? 0.75 : 0 }} transition={reduce ? { duration: 0 } : { duration: 0.5, delay: open ? 0.5 : 0 }} />
          {/* The door leaf, hinged on its left edge, with a ring keyhole. */}
          <m.g
            initial={false}
            animate={{ scaleX: open ? 0.14 : 1 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 15, delay: open ? 0.4 : 0 }}
            style={{ originX: 0, transformBox: "fill-box" }}
          >
            <path d="M 15 54 V 37 A 9 9 0 0 1 33 37 V 54 Z" fill={doorPanel} />
            <circle cx="24" cy={HOLE} r="2.6" fill="none" stroke="#FFFFFF" strokeWidth="1.4" />
            <rect x="23.3" y={HOLE + 1.6} width="1.4" height="3.6" rx="0.7" fill="#FFFFFF" />
          </m.g>
          {/* Step under the door. */}
          <rect x="12" y="52.6" width="24" height="2.6" rx="1.3" fill={brand} />
        </svg>
      </Box>

      {/* A soft glow pulses once when the door opens. */}
      <Box
        component={m.div}
        initial={false}
        animate={open && !reduce ? { opacity: [0, 0.9, 0], scale: [0.8, 1.4, 1.7] } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
        sx={{ position: "absolute", left: 3, top: DOOR.top + 10, width: DOOR.w - 6, height: DOOR.h - 12, borderRadius: "10px", boxShadow: "0 0 0 6px rgba(255, 210, 76, 0.45)" }}
      />

      {/* The key, in front of the door; its blade slides into the keyhole. */}
      <Box component={m.div} style={{ y, rotate, originX: 0.5, originY: RING_Y / KEY }} sx={{ position: "absolute", left: (DOOR.w - KEY) / 2, top: 0, width: KEY, height: KEY }}>
        <m.div
          initial={false}
          // Turning the key: the bow narrows as it rotates, then it is pulled out.
          animate={open ? { scaleX: [1, 0.25, 0.25], opacity: [1, 1, 0] } : { scaleX: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : open ? { duration: 0.55, times: [0, 0.6, 1], ease: "easeInOut" } : step}
          style={{ width: KEY, height: KEY }}
        >
          <svg viewBox="0 0 28 28" width={KEY} height={KEY} style={{ overflow: "visible" }}>
            <m.g style={{ scaleY: blade, originY: 13 / 28, originX: 0.5 }}>
              <rect x="12" y="13" width="4" height="13" rx="1.5" fill={body} stroke={edge} strokeWidth="0.8" />
              <path d="M 15.5 19 H 20 V 26 H 15.5 V 24 H 17.5 V 21 H 15.5 Z" fill={body} stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
            </m.g>
            {/* Ring with the UniShare colours: brand body, navy edge. */}
            <circle cx="14" cy="8" r="6" fill="none" stroke={body} strokeWidth="4" />
            {/* Navy edge on both sides of the ring in light mode. */}
            {edge !== "none" ? (
              <>
                <circle cx="14" cy="8" r="8.2" fill="none" stroke={edge} strokeWidth="0.8" />
                <circle cx="14" cy="8" r="3.8" fill="none" stroke={edge} strokeWidth="0.8" />
              </>
            ) : null}
          </svg>
        </m.div>
      </Box>
    </Box>
  );
}
