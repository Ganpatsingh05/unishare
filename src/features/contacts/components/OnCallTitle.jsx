"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";

// Dial a number: wind clockwise, then spring back. Two near-identical
// targets so every hover replays.
const DIALS = [
  { rotate: [0, 0, 150, 150, 0] },
  { rotate: [0, 0, 150, 150, 0.01] },
];
// When the phone rings the receiver jumps. Same trick for replays.
const RINGS = [
  { y: ["0em", "-0.12em", "0em", "-0.07em", "0em"] },
  { y: ["0em", "-0.12em", "0em", "-0.07em", "0.0001em"] },
];
const HOLES = Array.from({ length: 10 }, (_, i) => -60 + i * 28); // degrees round the dial
const RED = { hi: "#FF6B70", mid: "#D7212E", lo: "#931019", face: "#6E0B12" };

/** The capital "O" of "On" as a rotary dial; `anchorRef` marks the cord socket at its base. */
function DialO({ dials, reduce, edge, anchorRef }) {
  const t = useRideTokens();
  return (
    <Box component="span" sx={{ position: "relative", zIndex: 1, display: "inline-block", color: "transparent", WebkitTextStroke: 0 }}>
      O
      <Box component="span" aria-hidden sx={{ position: "absolute", left: "-0.02em", bottom: "0.06em", width: "0.84em", height: "0.84em", pointerEvents: "none" }}>
        <Box component="svg" viewBox="0 0 100 100" sx={{ width: "100%", height: "100%", overflow: "visible", display: "block" }}>
          {edge ? <circle cx="50" cy="50" r="47" fill={edge} /> : null}
          <circle cx="50" cy="50" r={edge ? 43.5 : 47} fill={t.brand.yellow} />
          <m.g
            style={{ originX: "50px", originY: "50px", transformBox: "view-box" }}
            initial={reduce ? false : { rotate: 0 }}
            animate={reduce ? { rotate: 0 } : DIALS[dials % 2]}
            transition={reduce ? { duration: 0 } : { duration: 1.3, delay: dials ? 0 : 0.5, times: [0, 0.05, 0.45, 0.55, 1], ease: ["linear", "easeOut", "linear", [0.3, 1.5, 0.5, 1]] }}
          >
            {HOLES.map((deg) => {
              const a = (deg * Math.PI) / 180;
              return <circle key={deg} cx={50 + 30 * Math.cos(a)} cy={50 + 30 * Math.sin(a)} r="6.6" fill={t.brand.inkNavy} opacity="0.85" />;
            })}
          </m.g>
          <circle cx="50" cy="50" r="14" fill={t.brand.inkNavy} />
          <circle cx="50" cy="50" r="6.5" fill="#E5484D" />
          <path d="M 84 64 L 97 72" stroke={t.brand.inkNavy} strokeWidth="6" strokeLinecap="round" />
        </Box>
        {/* Cord socket: bottom of the dial ring. */}
        <Box ref={anchorRef} component="span" sx={{ position: "absolute", left: "50%", top: "93%", width: 0, height: 0 }} />
      </Box>
    </Box>
  );
}

/**
 * The red mouthpiece bar, lying flat on top of the letters of "Campus,".
 * The left block is deeper with grille slots; it steps up towards the right
 * end, where the cord comes out. `anchorRef` marks the cord exit.
 */
function Receiver({ rings, reduce, anchorRef, onSettled }) {
  return (
    <Box
      component={m.span}
      aria-hidden
      initial={reduce ? false : { y: "-0.4em", opacity: 0 }}
      animate={reduce ? { y: 0, opacity: 1 } : rings ? { opacity: 1, ...RINGS[rings % 2] } : { y: 0, opacity: 1 }}
      transition={reduce ? { duration: 0 } : rings ? { duration: 0.6, ease: "easeOut" } : { type: "spring", stiffness: 260, damping: 15, delay: 0.15 }}
      onAnimationComplete={onSettled}
      sx={{ position: "absolute", right: "-0.06em", bottom: "calc(100% - 0.14em)", width: "2.3em", height: "0.38em", pointerEvents: "none" }}
    >
      <Box component="svg" viewBox="0 0 300 50" sx={{ width: "100%", height: "100%", overflow: "visible", display: "block", filter: "drop-shadow(0 0.04em 0.03em rgba(80,10,15,0.35))" }}>
        <defs>
          <linearGradient id="oc-red" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={RED.hi} />
            <stop offset="0.55" stopColor={RED.mid} />
            <stop offset="1" stopColor={RED.lo} />
          </linearGradient>
        </defs>
        <path d="M 12 0 H 288 Q 300 0 300 12 V 26 Q 300 38 288 38 H 142 Q 133 38 129 44 Q 125 50 116 50 H 12 Q 0 50 0 38 V 12 Q 0 0 12 0 Z" fill="url(#oc-red)" />
        {/* Underside shade, top gloss, and the grille on the deep end. */}
        <path d="M 4 44 Q 8 50 16 50 H 116 Q 125 50 129 44 Q 133 38 142 38 H 288 Q 298 38 300 30" fill="none" stroke={RED.lo} strokeWidth="3" />
        <path d="M 14 8 H 286" stroke="#fff" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round" />
        {[22, 36, 50, 64].map((x) => <rect key={x} x={x} y="18" width="6" height="20" rx="3" fill={RED.face} opacity="0.75" />)}
        <circle cx="297" cy="19" r="5.5" fill={RED.face} />
      </Box>
      <Box ref={anchorRef} component="span" sx={{ position: "absolute", left: "99%", top: "38%", width: 0, height: 0 }} />
    </Box>
  );
}

/** Smooth curve through points (Catmull-Rom), sampled densely with arc length. */
function sampleCurve(points, perSegment = 40) {
  const out = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    for (let j = 0; j < perSegment; j += 1) {
      const t = j / perSegment;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(points[points.length - 1]);
  let total = 0;
  out.forEach((p, i) => {
    total += i ? Math.hypot(p.x - out[i - 1].x, p.y - out[i - 1].y) : 0;
    p.s = total;
  });
  return { points: out, length: total };
}

/**
 * A coiled cord along a path through `points`. Each turn swings out along the
 * normal and back along the tangent (a trochoid), which draws the overlapping
 * loops of a phone cord. Coils taper to nothing at both ends.
 */
function coilPath(points, radius) {
  const { points: base, length } = sampleCurve(points);
  const turns = Math.max(4, Math.round(length / (radius * 1.9)));
  const steps = turns * 18;
  let k = 0;
  let d = "";
  for (let i = 0; i <= steps; i += 1) {
    const s = (i / steps) * length;
    while (k < base.length - 2 && base[k + 1].s < s) k += 1;
    const a = base[k];
    const b = base[k + 1];
    const u = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0;
    const px = a.x + (b.x - a.x) * u;
    const py = a.y + (b.y - a.y) * u;
    const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const tx = (b.x - a.x) / len;
    const ty = (b.y - a.y) / len;
    const t = i / steps;
    const envelope = Math.min(1, t / 0.05, (1 - t) / 0.05);
    const phase = t * turns * Math.PI * 2;
    const x = px + (-ty * Math.sin(phase) + tx * 1.15 * (Math.cos(phase) - 1)) * radius * envelope;
    const y = py + (tx * Math.sin(phase) + ty * 1.15 * (Math.cos(phase) - 1)) * radius * envelope;
    d += `${i ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
  }
  return d;
}

/**
 * "Campus, On call." A red receiver rests on "Campus," and its coiled cord
 * drops through the gap after the comma, loops under the line and plugs into
 * the base of the rotary-dial "O". On load the handset drops in, the dial
 * spins and the cord draws itself; hovering makes it ring again.
 */
export default function OnCallTitle({ before, accent, id, sx }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [plays, setPlays] = useState(0);
  const [cord, setCord] = useState(null);
  const titleRef = useRef(null);
  const beforeRef = useRef(null);
  const accentRef = useRef(null);
  const fromRef = useRef(null);
  const toRef = useRef(null);
  const measureRef = useRef(() => {});
  const dark = t.mode === "dark";
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.07em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const at = accent.indexOf("O");

  // Measure the cord's route in the heading's own (unzoomed) coordinates.
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return undefined;
    const measure = () => {
      const box = el.getBoundingClientRect();
      const rects = [fromRef, toRef, beforeRef, accentRef].map((r) => r.current?.getBoundingClientRect());
      if (rects.some((r) => !r) || !box.width) return;
      const [from, to, word, tail] = rects;
      const k = el.offsetWidth / box.width; // undo any CSS zoom on the page
      const pt = (x, y) => ({ x: (x - box.left) * k, y: (y - box.top) * k });
      const font = parseFloat(getComputedStyle(el).fontSize) || 48;
      const a = pt(from.left, from.top);
      const b = pt(to.left, to.top);
      const gapX = ((word.right + tail.left) / 2 - box.left) * k;
      const lineMid = ((tail.top + tail.bottom) / 2 - box.top) * k;
      const below = (tail.bottom - box.top) * k + font * 0.12;
      // Down through the gap after the comma, under the line, up into the dial.
      const route = [a, { x: a.x + font * 0.14, y: a.y + font * 0.04 }, { x: Math.max(gapX, a.x + font * 0.12), y: lineMid }, { x: gapX + font * 0.02, y: below }, { x: (gapX + b.x) / 2, y: below + font * 0.1 }, { x: b.x, y: b.y + font * 0.22 }, b];
      setCord({ w: el.offsetWidth, h: el.offsetHeight, d: coilPath(route, font * 0.06), width: Math.max(1.5, font * 0.03) });
    };
    measureRef.current = measure;
    measure();
    // Re-measure once the receiver has landed (also via onSettled), on resize, and when fonts land.
    const late = setTimeout(measure, 1500);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => {
      clearTimeout(late);
      ro.disconnect();
    };
  }, [before, accent]);

  const draw = { initial: reduce ? false : { pathLength: 0 }, animate: { pathLength: 1 }, transition: { duration: reduce ? 0 : 1.2, delay: reduce ? 0 : 0.7, ease: "easeInOut" } };
  return (
    <Box component="h1" id={id} ref={titleRef} onMouseEnter={() => !reduce && setPlays((n) => n + 1)} sx={[{ position: "relative", pt: "0.45em", pb: "0.45em" }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {cord ? (
        <Box component="svg" aria-hidden width={cord.w} height={cord.h} viewBox={`0 0 ${cord.w} ${cord.h}`} sx={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none", zIndex: 0 }}>
          <m.path d={cord.d} fill="none" stroke={RED.lo} strokeWidth={cord.width * 1.7} strokeLinecap="round" strokeLinejoin="round" {...draw} />
          <m.path d={cord.d} fill="none" stroke={RED.mid} strokeWidth={cord.width} strokeLinecap="round" strokeLinejoin="round" {...draw} />
        </Box>
      ) : null}
      <Box ref={beforeRef} component="span" sx={{ position: "relative", zIndex: 1, display: "inline-block", color: dark ? t.brand.skyBright : t.brand.actionBlue }}>
        <Receiver rings={plays} reduce={reduce} anchorRef={fromRef} onSettled={() => measureRef.current()} />
        {before}
      </Box>{" "}
      <Box ref={accentRef} component="span" sx={{ position: "relative", zIndex: 1, display: "inline-block", whiteSpace: "nowrap", ...accentSx }}>
        {at < 0 ? (
          accent
        ) : (
          <>
            {accent.slice(0, at)}
            <DialO dials={plays} reduce={reduce} edge={dark ? null : t.brand.inkNavy} anchorRef={toRef} />
            {accent.slice(at + 1)}
          </>
        )}
      </Box>
    </Box>
  );
}
