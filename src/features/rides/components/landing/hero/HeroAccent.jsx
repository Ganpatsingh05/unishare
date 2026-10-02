"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { animate, useReducedMotion } from "framer-motion";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { ACCENT_ADVANCE, ACCENT_GLYPHS, ACCENT_TEXT } from "../../../constants/rideAccentGlyphs";

/**
 * "Ride together." with the tails of the "e" and the "g" reaching out and
 * shaking hands.
 *
 * The line is drawn as one SVG from the outlines of the Geist letters (see
 * scripts/generate-ride-accent-glyphs.mjs), so the arms are continuations of
 * the letters' own strokes and nothing depends on the font having loaded, on
 * measuring the DOM, or on the page zoom. Everything below is in font units
 * (1000 = 1em, y down, baseline at 0). Framer Motion's animate() drives the
 * sequence, writing straight to SVG attributes, so a frame costs no React work.
 */

const FIRST_WORD = 4; // glyphs of "Ride"
const E = 3; // the "e" of "Ride"
const G = 6; // the "g" of "together"

// Each letter is cut along a horizontal line through the gap below its bowl
// and the stroke that runs through that line carries on as the arm:
//  e: the left wall of the bowl drops on, so the lower curve and terminal go;
//  g: the right stem drops on, so the left half of the descender hook goes.
// The anchor is where that stroke crosses the cut (its centre, x local to the
// glyph), its width is measured square to the stroke, and dir is the stroke's
// heading there. These come from scanning the Geist outlines. The g is cut
// above the slanted tip of its hook, so no sliver of the hook is left behind.
const CUT = {
  e: { y: -186, x: 127.25, width: 159.7, dir: { x: 0.2615, y: 0.965 } },
  g: { y: -12, x: 492.5, width: 157.4, dir: { x: -0.318, y: 0.948 } },
};

const TOP = -820; // one headline line (1.05em) above the baseline
const PAD = 40;
const WIDTH = ACCENT_ADVANCE + PAD * 2;

const glyph = (index) => ACCENT_GLYPHS[index];

// Where each arm leaves its letter, in glyph space.
const E_ARM = { ...CUT.e, x: glyph(E).x + CUT.e.x };
const G_ARM = { ...CUT.g, x: glyph(G).x + CUT.g.x };

// Hand unit: the arms' thickness. The hands meet midway between the letters,
// well below the words.
const U = (E_ARM.width + G_ARM.width) / 2;
const M = { x: (E_ARM.x + G_ARM.x) / 2, y: Math.max(E_ARM.y, G_ARM.y) + U * 2.9 };
const BOTTOM = Math.ceil(M.y + U * 2.4);

// Keep-regions of the two letters: everything above the cut line.
const FAR = 20000; // well past every glyph's absolute x, so the regions never fold over
const above = (y) => [[-FAR, -FAR], [FAR, -FAR], [FAR, y], [-FAR, y]];
const clipE = above(E_ARM.y);
const clipG = above(G_ARM.y);
// The arms overlap their letters by a few units, so the two anti-aliased edges
// at a cut never leave a hairline between them.
const SEAM = 4;
// Ink outline around the yellow word in light mode, in font units per side.
const OUTLINE = 13;
const points = (list) => list.map(([x, y]) => `${x},${y}`).join(" ");

// Hands in hand units (1 unit = U; origin at the clasp, y down). Each wrist
// is one unit tall so the arm runs into it without a step.
const TILT = { blue: 12, yellow: 8 };
const BLUE_LIFT = -1.4; // the blue palm rides high, so its top shows above the yellow one
const WRIST = { blue: { x: -3.2, y: 0.5 }, yellow: { x: 3.2, y: -0.5 } };
const PALM = {
  blue: `M -4 0 L -3.2 0 C -2.4 0, -1.6 -0.75, -0.4 -0.85 C 1.1 -0.95, 2.1 -0.3, 2.1 0.55
    C 2.1 1.4, 1.0 1.8, -0.4 1.68 C -1.5 1.58, -2.4 1, -3.2 1 L -4 1 Z`,
  yellow: `M 4 -1 L 3.2 -1 C 2.5 -1, 1.8 -1.7, 0.4 -1.7 C -1.1 -1.7, -2.15 -1.05, -2.15 0
    C -2.15 1.05, -1.0 1.6, 0.3 1.4 C 1.7 1.2, 2.5 0, 3.2 0 L 4 0 Z`,
  // The yellow palm's leading edge, stroked in the page colour just outside it.
  yellowEdge: "M 0.4 -1.7 C -1.1 -1.7, -2.15 -1.05, -2.15 0 C -2.15 1.05, -1.0 1.6, 0.3 1.4",
};

const rotate = ({ x, y }, deg) => {
  const r = (deg * Math.PI) / 180;
  return { x: x * Math.cos(r) - y * Math.sin(r), y: x * Math.sin(r) + y * Math.cos(r) };
};
const toPage = (p) => ({ x: M.x + p.x * U, y: M.y + p.y * U });
const fmt = (n) => Math.round(n * 100) / 100;

/**
 * One smooth path per arm. It leaves the cut on the stroke's own heading
 * (flat end, same width) and keeps that heading for `leadK` of the drop, so it
 * runs nearly straight down the letter's stroke first. Then it sweeps round
 * and, for the last `RUN` hand units, runs dead straight along the wrist, so
 * its edges meet the hand's edges exactly with no step. The final stretch
 * carries on under the palm so the join is always covered. The start sits
 * inside the letter, so the cut shows no seam.
 */
const RUN = 1.6;
function armPath(from, wrist, tiltDeg, intoX, leadK, tailK) {
  const end = toPage(rotate(wrist, tiltDeg));
  const into = rotate({ x: intoX, y: 0 }, tiltDeg);
  const pre = { x: end.x - into.x * RUN * U, y: end.y - into.y * RUN * U };
  // Handles scale with the chord, so the bend stays round however far the hand is.
  const chord = Math.hypot(pre.x - from.x, pre.y - from.y);
  const lead = chord * leadK;
  const tail = chord * tailK;
  const inside = from.width * 0.45;
  const start = { x: from.x - from.dir.x * inside, y: from.y - from.dir.y * inside };
  const c1 = { x: from.x + from.dir.x * lead, y: from.y + from.dir.y * lead };
  const c2 = { x: pre.x - into.x * tail, y: pre.y - into.y * tail };
  const hidden = { x: end.x + into.x * U * 0.9, y: end.y + into.y * U * 0.9 };
  return `M ${fmt(start.x)} ${fmt(start.y)} C ${fmt(c1.x)} ${fmt(c1.y)}, ${fmt(c2.x)} ${fmt(c2.y)}, ${fmt(pre.x)} ${fmt(pre.y)} L ${fmt(hidden.x)} ${fmt(hidden.y)}`;
}

const BLUE_ARM = armPath(E_ARM, { x: WRIST.blue.x, y: WRIST.blue.y + BLUE_LIFT }, TILT.blue, 1, 0.3, 0.4);
const YELLOW_ARM = armPath(G_ARM, WRIST.yellow, -TILT.yellow, -1, 0.26, 0.5);

// The timeline (seconds): the arms draw out of the letters, then each palm
// opens out of its arm's tip. Nothing slides in from outside.
const ARM = { delay: 0.2, duration: 0.85, ease: [0.65, 0, 0.35, 1] };
const PALM_OPEN = { delay: 0.95, duration: 0.6, ease: [0.25, 0.8, 0.3, 1] };
const REACH = 9; // palm reveal radius, in hand units

// The current progress is kept on the svg, so shapes that mount later (the
// light-mode outline after a theme switch) can be brought to the same point.
const setArms = (svg, progress) => {
  svg.dataset.arm = String(progress);
  svg.querySelectorAll("[data-arm]").forEach((node) => node.setAttribute("stroke-dashoffset", String(1 - progress)));
};
const setPalms = (svg, progress) => {
  svg.dataset.palm = String(progress);
  svg.querySelectorAll("[data-reveal]").forEach((node) => node.setAttribute("r", String(progress * REACH)));
};

/** Plays the whole sequence from the start; returns a function that stops it. */
function play(svg) {
  setArms(svg, 0);
  setPalms(svg, 0);
  const arms = animate(0, 1, { ...ARM, onUpdate: (value) => setArms(svg, value) });
  const palms = animate(0, 1, { ...PALM_OPEN, onUpdate: (value) => setPalms(svg, value) });
  return () => {
    arms.stop();
    palms.stop();
  };
}

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clipPath: "inset(50%)",
  whiteSpace: "nowrap",
};

export default function HeroAccent({ text }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const svgRef = useRef(null);
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const outlined = text === ACCENT_TEXT;

  const dark = t.mode === "dark";
  const firstColor = dark ? t.brand.skyBright : t.brand.actionBlue;
  // The second word, its arm and hand are brand yellow in both modes. Bare
  // yellow is unreadable on light surfaces, so light mode traces it with an
  // ink-navy outline, the way the UniShare wordmark does.
  const restColor = t.brand.yellow;
  const yellowHand = t.brand.yellow;
  const outline = dark ? null : t.brand.inkNavy;
  // Thin line between the overlapping palms, close to the page behind.
  const handGap = dark ? "rgba(8, 18, 20, 0.9)" : "rgba(255, 255, 255, 0.95)";

  // After any re-render (theme switch), newly mounted arms and reveals start
  // where the animation already is instead of hidden.
  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || svg.dataset.arm === undefined) return;
    setArms(svg, Number(svg.dataset.arm));
    setPalms(svg, Number(svg.dataset.palm || 0));
  });

  useEffect(() => {
    const svg = svgRef.current;
    if (!outlined || !svg) return undefined;
    if (reduce) {
      setArms(svg, 1);
      setPalms(svg, 1);
      return undefined;
    }
    let stop = play(svg);
    // Pages restored from the back/forward cache replay the handshake too.
    const onShow = (event) => {
      if (!event.persisted) return;
      stop();
      stop = play(svg);
    };
    window.addEventListener("pageshow", onShow);
    return () => {
      stop();
      window.removeEventListener("pageshow", onShow);
    };
  }, [outlined, reduce]);

  if (!outlined) {
    return (
      <Box component="span" sx={{ color: firstColor }}>
        {text}
      </Box>
    );
  }

  const fadeId = `${uid}fade`;
  const ids = { e: `${uid}e`, g: `${uid}g`, blue: `${uid}pb`, yellow: `${uid}py`, armE: `${uid}ae`, armG: `${uid}ag` };
  const letters = ACCENT_GLYPHS.map((item, i) => {
    const clip = i === E ? ids.e : i === G ? ids.g : undefined;
    const traced = outline && i >= FIRST_WORD;
    return (
      <path
        key={`${item.ch}${i}`}
        d={item.d}
        fill={i < FIRST_WORD ? firstColor : restColor}
        clipPath={clip ? `url(#${clip})` : undefined}
        {...(traced ? { stroke: outline, strokeWidth: OUTLINE * 2, strokeLinejoin: "round", paintOrder: "stroke" } : {})}
      />
    );
  });
  // Each arm starts inside its letter, and is clipped to the cut line, so it
  // begins exactly on the letter's own outline: no bump past the edge, no gap.
  const arm = (d, color, width, clip) => (
    <path d={d} data-arm stroke={color} strokeWidth={width} strokeLinecap="butt" fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1} clipPath={`url(#${clip})`} />
  );

  return (
    <Box component="span" sx={{ position: "relative", display: "block", maxWidth: "100%" }}>
      <Box component="span" sx={visuallyHidden}>
        {text}
      </Box>
      <Box
        ref={svgRef}
        component="svg"
        aria-hidden
        focusable="false"
        viewBox={`${-PAD} ${TOP} ${WIDTH} ${BOTTOM - TOP}`}
        sx={{ display: "block", width: `${WIDTH / 1000}em`, height: `${(BOTTOM - TOP) / 1000}em`, maxWidth: "100%", overflow: "visible" }}
      >
        <defs>
          <clipPath id={ids.e}>
            <polygon points={points(clipE)} />
          </clipPath>
          <clipPath id={ids.g}>
            <polygon points={points(clipG)} />
          </clipPath>
          <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={handGap} />
            <stop offset="0.55" stopColor={handGap} />
            <stop offset="1" stopColor={handGap} stopOpacity="0" />
          </linearGradient>
          <clipPath id={ids.armE}>
            <rect x={-FAR} y={E_ARM.y - SEAM} width={FAR * 2} height={FAR} />
          </clipPath>
          <clipPath id={ids.armG}>
            <rect x={-FAR} y={G_ARM.y - SEAM} width={FAR * 2} height={FAR} />
          </clipPath>
          <clipPath id={ids.blue}>
            <circle data-reveal cx={WRIST.blue.x} cy={WRIST.blue.y} r={0} />
          </clipPath>
          <clipPath id={ids.yellow}>
            <circle data-reveal cx={WRIST.yellow.x} cy={WRIST.yellow.y} r={0} />
          </clipPath>
        </defs>
        {/* The yellow arm's outline goes under the letters, so the letter fill
            hides it where the two meet and the join stays seamless. */}
        {outline ? arm(YELLOW_ARM, outline, U + OUTLINE * 2, ids.armG) : null}
        {letters}
        {arm(BLUE_ARM, firstColor, U, ids.armE)}
        {arm(YELLOW_ARM, restColor, U, ids.armG)}
        <g transform={`translate(${M.x} ${M.y}) scale(${U})`}>
          <g transform={`rotate(${TILT.blue}) translate(0 ${BLUE_LIFT})`}>
            <g clipPath={`url(#${ids.blue})`}>
              <path d={PALM.blue} fill={firstColor} />
            </g>
          </g>
          <g transform={`rotate(${-TILT.yellow})`}>
            <g clipPath={`url(#${ids.yellow})`}>
              <path d={PALM.yellowEdge} stroke={`url(#${fadeId})`} strokeWidth={0.36} strokeLinecap="butt" fill="none" />
              <path
                d={PALM.yellow}
                fill={yellowHand}
                {...(outline ? { stroke: outline, strokeWidth: (OUTLINE * 2) / U, strokeLinejoin: "round", paintOrder: "stroke" } : {})}
              />
            </g>
          </g>
        </g>
        {/* Over the palm too, so the palm's outline never cuts across the wrist. */}
        {outline ? arm(YELLOW_ARM, restColor, U, ids.armG) : null}
      </Box>
    </Box>
  );
}
