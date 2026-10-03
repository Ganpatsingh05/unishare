"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { useInView, useReducedMotion } from "framer-motion";
import { BackpackIcon as Backpack } from "@solar-icons/react/bold-duotone/backpack";
import { BookIcon as Book } from "@solar-icons/react/bold-duotone/book";
import { CalculatorIcon as Calculator } from "@solar-icons/react/bold-duotone/calculator";
import { BottleIcon as Bottle } from "@solar-icons/react/bold-duotone/bottle";
import { GlassesIcon as Glasses } from "@solar-icons/react/bold-duotone/glasses";
import { HeadphonesRoundIcon as HeadphonesRound } from "@solar-icons/react/bold-duotone/headphones-round";
import { UserIdIcon as UserId } from "@solar-icons/react/bold-duotone/user-id";
import { KeyIcon as Key } from "@solar-icons/react/bold-duotone/key";
import { LaptopIcon as Laptop } from "@solar-icons/react/bold-duotone/laptop";
import { BatteryChargeIcon as BatteryCharge } from "@solar-icons/react/bold-duotone/battery-charge";
import { UmbrellaIcon as Umbrella } from "@solar-icons/react/bold-duotone/umbrella";
import { WalletIcon as Wallet } from "@solar-icons/react/bold-duotone/wallet";
import { WatchRoundIcon as WatchRound } from "@solar-icons/react/bold-duotone/watch-round";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";

const s = LOST_FOUND_STRINGS.lens;
// Lens size as a share of the scene width (container query units), so the
// glass and its see-through circle scale together on every screen.
const LENS = 28; // cqw

// Things on the mat: icon, left %, top %, rotation, size (cqw), colour key.
// The four stops are where the lens pauses; the rest are scenery.
const STOPS = [
  { Icon: Wallet, x: 24, y: 30, r: -12, size: 10, tint: "brown" },
  { Icon: WatchRound, x: 73, y: 27, r: 14, size: 9.5, tint: "blue" },
  { Icon: Key, x: 69, y: 68, r: -28, size: 9.5, tint: "gold" },
  { Icon: UserId, x: 28, y: 68, r: 9, size: 10, tint: "green" },
];
const SCENERY = [
  { note: "backpack", Icon: Backpack, x: 9, y: 13, r: -6, size: 9, tint: "blue" },
  { note: "audio", Icon: HeadphonesRound, x: 47, y: 11, r: 8, size: 8.5, tint: "slate" },
  { note: "calculator", Icon: Calculator, x: 91, y: 11, r: 10, size: 7.5, tint: "slate" },
  { note: "bottle", Icon: Bottle, x: 8, y: 49, r: -10, size: 7.5, tint: "blue" },
  { note: "glasses", Icon: Glasses, x: 45, y: 46, r: -8, size: 9, tint: "slate" },
  { note: "laptop", Icon: Laptop, x: 91, y: 47, r: 6, size: 10.5, tint: "slate" },
  { note: "book", Icon: Book, x: 48, y: 73, r: 5, size: 8, tint: "green" },
  { note: "umbrella", Icon: Umbrella, x: 10, y: 86, r: 18, size: 8.5, tint: "gold" },
  { note: "charger", Icon: BatteryCharge, x: 90, y: 85, r: -16, size: 8, tint: "blue" },
];

// The tour: 16s round the four stops, holding at each, eased in between.
const CYCLE = 16000;
const HOLD = 0.56; // share of each leg spent resting on the stop
const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
function tourAt(ms) {
  const leg = ((((ms % CYCLE) + CYCLE) % CYCLE) / CYCLE) * STOPS.length;
  const i = Math.floor(leg);
  const a = STOPS[i];
  const b = STOPS[(i + 1) % STOPS.length];
  const p = ease(Math.max(0, (leg - i - HOLD) / (1 - HOLD)));
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p };
}

function Things({ items, color, scale = 1, shadow, extra }) {
  return items.map((item, i) => {
    const { Icon, x, y, r, size, tint } = item;
    return (
    <Box key={i} component="span" sx={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: `translate(-50%, -50%) rotate(${r}deg)`, display: "grid", justifyItems: "center", color: typeof color === "function" ? color(tint) : color, filter: shadow }}>
      <Box component={Icon} sx={{ width: `${size * scale}cqw`, height: `${size * scale}cqw` }} />
      {typeof extra === "function" ? extra(item) : extra}
    </Box>
    );
  });
}

/** A detective's sticky note, only shown under the glass while hovering. */
function Note({ text, x, y }) {
  // Keep notes inside the mat: nudge in from the sides, and flip above
  // things that sit near the bottom edge.
  const shift = x < 20 ? "30%" : x > 80 ? "-30%" : "0%";
  return (
    <Box
      component="span"
      className="lf-note"
      sx={{
        order: y > 78 ? -1 : 1,
        mt: y > 78 ? 0 : "0.8cqw",
        mb: y > 78 ? "0.8cqw" : 0,
        width: "max-content",
        maxWidth: "17cqw",
        px: "1.2cqw",
        py: "0.6cqw",
        borderRadius: "0.6cqw",
        fontSize: "2.35cqw",
        fontStyle: "italic",
        fontWeight: 650,
        lineHeight: 1.25,
        textAlign: "center",
        backgroundColor: "#FFF6D6",
        color: "#3B2F12",
        boxShadow: "0 2px 5px rgba(8,18,32,0.22)",
        transform: `translateX(${shift}) rotate(-3deg)`,
      }}
    >
      {text}
    </Box>
  );
}

/**
 * Decorative scene beside the headline: everyday things left on a desk mat,
 * faded, and a magnifying glass (the headline's "o") gliding between them.
 * Under the glass each thing is magnified and in colour, and the ones it
 * stops on wear a "Found" tag. Hovering the mat with a mouse hands the
 * glass to the pointer; leaving gives it back to the tour. One rAF loop that
 * eases towards its target, paused off screen; no tour with reduced motion.
 */
export default function LensSearch({ found, lost, ready }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "-10% 0px" });
  const matRef = useRef(null);
  const lensRef = useRef(null);
  const revealRef = useRef(null);
  const pointer = useRef(null); // {x, y} in % while a mouse is over the mat
  const pos = useRef({ x: STOPS[0].x, y: STOPS[0].y });
  const clock = useRef(0); // tour time, only advances while touring

  useEffect(() => {
    const place = ({ x, y }) => {
      if (lensRef.current) {
        lensRef.current.style.left = `${x}%`;
        lensRef.current.style.top = `${y}%`;
      }
      if (revealRef.current) revealRef.current.style.clipPath = `circle(${LENS / 2}cqw at ${x}% ${y}%)`;
    };
    place(pos.current);
    if (!visible) return undefined;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      // rAF can hand the first frame a timestamp from just before `last`.
      const dt = Math.max(0, Math.min(64, now - last));
      last = now;
      const follow = pointer.current;
      if (!follow && !reduce) clock.current += dt;
      const target = follow || (reduce ? pos.current : tourAt(clock.current));
      // Ease towards the target: snappier when following the pointer.
      const k = 1 - Math.exp(-dt / (follow ? 70 : 140));
      pos.current = { x: pos.current.x + (target.x - pos.current.x) * k, y: pos.current.y + (target.y - pos.current.y) * k };
      place(pos.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, reduce]);

  const onMove = (e) => {
    if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
    const r = matRef.current.getBoundingClientRect();
    if (revealRef.current) revealRef.current.dataset.hover = "1";
    // Keep the whole glass on the mat (its radius is LENS / 2 of the width).
    const rx = LENS / 2 + 2;
    const ry = (LENS / 2 + 2) * (r.width / r.height);
    const clamp = (v, m) => Math.min(100 - m, Math.max(m, v));
    pointer.current = { x: clamp(((e.clientX - r.left) / r.width) * 100, rx), y: clamp(((e.clientY - r.top) / r.height) * 100, ry) };
  };
  const onLeave = () => {
    pointer.current = null;
    if (revealRef.current) delete revealRef.current.dataset.hover;
  };
  const tints = dark
    ? { brown: "#E0A872", blue: t.brand.skyBright, gold: t.brand.yellow, green: "#4FD1A5", slate: "#CBD5E1" }
    : { brown: "#9A5B2E", blue: t.brand.actionBlue, gold: t.brand.yellowDeep, green: "#13795B", slate: "#334155" };
  const mat = dark
    ? { top: "#1C2A44", bottom: "#131E33", stitch: "rgba(148,163,184,0.22)", faded: "rgba(203,213,225,0.34)", grain: "rgba(255,255,255,0.035)" }
    : { top: "#F7FAFE", bottom: "#E6EDF7", stitch: "rgba(30,64,120,0.16)", faded: "rgba(51,65,85,0.3)", grain: "rgba(15,40,80,0.045)" };
  const tag = (
    <Box component="span" sx={{ mt: "0.8cqw", px: "1.4cqw", py: "0.2cqw", borderRadius: "0.8cqw", fontSize: "2.4cqw", fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: t.brand.yellow, color: t.brand.inkNavy, boxShadow: "0 2px 4px rgba(8,18,32,0.25)", transform: "rotate(-4deg)" }}>
      {s.tag}
    </Box>
  );

  return (
    <Box ref={ref} sx={{ position: "relative", containerType: "inline-size", width: "100%" }}>
      <Box
        ref={matRef}
        aria-hidden
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 0.86",
          "@media (hover: hover)": { cursor: "none" },
          borderRadius: `${t.radius.lg}px`,
          overflow: "hidden",
          // Desk mat: soft top light, fine grain, darker edges.
          background: `radial-gradient(120% 90% at 30% 10%, rgba(255,255,255,${dark ? 0.06 : 0.7}), transparent 60%), radial-gradient(${mat.grain} 0.8px, transparent 1px) 0 0 / 6px 6px, linear-gradient(180deg, ${mat.top}, ${mat.bottom})`,
          boxShadow: `inset 0 0 0 1px ${dark ? "rgba(255,255,255,0.06)" : "rgba(15,40,80,0.08)"}, inset 0 -18px 30px -18px ${dark ? "rgba(0,0,0,0.5)" : "rgba(15,40,80,0.14)"}`,
          // Stitched border, like a real mat.
          "&::before": { content: '""', position: "absolute", inset: 10, borderRadius: `${t.radius.md}px`, border: `1.5px dashed ${mat.stitch}`, pointerEvents: "none" },
        }}
      >
        {/* Things on the mat, faded. */}
        <Things items={[...STOPS, ...SCENERY]} color={mat.faded} shadow={`drop-shadow(0 1px 0 ${dark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.9)"})`} />

        {/* Seen through the glass: magnified and in colour. */}
        <Box
          ref={revealRef}
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${dark ? "#22355A" : "#FFFFFF"}, ${dark ? "#1A2A4A" : "#F3F8FF"})`,
            clipPath: `circle(${LENS / 2}cqw at ${STOPS[0].x}% ${STOPS[0].y}%)`,
            pointerEvents: "none",
            // Hidden extras: notes and invisible ink appear only while the
            // visitor steers the glass themselves.
            "& .lf-note, & .lf-ink": { opacity: 0, transition: "opacity 220ms ease" },
            "&[data-hover] .lf-note, &[data-hover] .lf-ink": { opacity: 1 },
          }}
        >
          <Things items={SCENERY} color={(k) => tints[k]} scale={1.25} shadow="drop-shadow(0 3px 4px rgba(8,18,32,0.25))" extra={(item) => <Note text={s.notes[item.note]} x={item.x} y={item.y} />} />
          {/* Invisible ink on an empty patch of the mat. */}
          <Box component="span" className="lf-ink" sx={{ position: "absolute", left: "68%", top: "48%", transform: "translate(-50%, -50%) rotate(-6deg)", width: "17cqw", textAlign: "center", fontSize: "2.7cqw", fontWeight: 800, fontStyle: "italic", lineHeight: 1.2, color: dark ? t.brand.yellow : t.brand.actionBlue }}>
            {s.ink}
          </Box>
          <Things items={STOPS} color={(k) => tints[k]} scale={1.25} shadow="drop-shadow(0 3px 4px rgba(8,18,32,0.25))" extra={tag} />
        </Box>

        {/* The magnifying glass. */}
        <Box
          ref={lensRef}
          sx={{
            position: "absolute",
            pointerEvents: "none",
            left: `${STOPS[0].x}%`,
            top: `${STOPS[0].y}%`,
            width: `${LENS}cqw`,
            height: `${LENS}cqw`,
            ml: `${-LENS / 2}cqw`,
            mt: `${-LENS / 2}cqw`,
          }}
        >
          <Box component="svg" viewBox="0 0 100 100" sx={{ width: "100%", height: "100%", overflow: "visible", filter: "drop-shadow(0 12px 14px rgba(8,18,32,0.3))" }}>
            <defs>
              <linearGradient id="lf-lens-rim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#FFE58A" />
                <stop offset="0.55" stopColor={t.brand.yellow} />
                <stop offset="1" stopColor={t.brand.yellowDeep} />
              </linearGradient>
            </defs>
            {/* Handle with a grip. */}
            <path d="M 85 85 L 124 124" stroke={t.brand.inkNavy} strokeWidth="15" strokeLinecap="round" />
            <path d="M 98 98 L 122 122" stroke={dark ? "#0B1626" : "#1E3A66"} strokeWidth="11" strokeLinecap="round" />
            <path d="M 84 84 L 93 93" stroke="url(#lf-lens-rim)" strokeWidth="13" strokeLinecap="round" />
            {/* Rim, with a navy edge so it reads on light mats. */}
            {dark ? null : <circle cx="50" cy="50" r="50" fill="none" stroke={t.brand.inkNavy} strokeWidth="11" />}
            <circle cx="50" cy="50" r="50" fill="none" stroke="url(#lf-lens-rim)" strokeWidth="7.5" />
            {/* Glass sheen. */}
            <path d="M 20 38 A 32 32 0 0 1 38 19" stroke="#fff" strokeOpacity="0.85" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 18 48 A 32 32 0 0 1 19 44" stroke="#fff" strokeOpacity="0.7" strokeWidth="4" strokeLinecap="round" fill="none" />
          </Box>
        </Box>
      </Box>

      {/* Live counts under the mat. */}
      {ready ? (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "center", gap: 1, flexWrap: "wrap" }}>
          {[
            { label: s.found(found), dot: c.success },
            { label: s.looking(lost), dot: c.danger },
          ].map(({ label, dot }) => (
            <Box key={label} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, px: 1.5, py: 0.6, borderRadius: `${t.radius.pill}px`, fontSize: 13, fontWeight: 760, backgroundColor: c.surfaceInteractive, color: c.text }}>
              <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot }} />
              {label}
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
