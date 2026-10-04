"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { MapPin as MapPoint } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { initialsOf, passUrl } from "../utils/profileModel";

const s = PROFILE_STRINGS.card;
// One palette per theme. Light: white card stock with a sunny yellow header
// and a gold rim. Dark: a midnight card with an electric-blue header, a
// glowing blue rim and yellow accents, so it pops on the dark page.
const PALETTES = {
  light: {
    paper: "#FFFFFF",
    ink: "#0B2147",
    muted: "#5B6B85",
    accent: "#1D6FE0",
    header: "linear-gradient(120deg, #FFE066 0%, #FFD43B 45%, #FFB703 100%)",
    headerInk: "#0B2147",
    wordShare: "#1D6FE0",
    back: "linear-gradient(160deg, #FFE066 0%, #FFD43B 50%, #FFB703 100%)",
    backInk: "#0B2147",
    dots: "rgba(29,111,224,0.10)",
    chip: "#EEF4FF",
    slot: "#FFFFFF",
    photoBg: "linear-gradient(135deg, #DCEBFF, #9EC5FF)",
    photoInk: "#1D6FE0",
    photoRing: "#FFFFFF",
    border: "#F2B705",
    rim: "0 0 0 3px #FFFFFF, 0 0 0 5px #F2B705",
    shadow: "0 30px 60px -24px rgba(11,33,71,0.45)",
    strap: "#1D6FE0",
  },
  dark: {
    paper: "linear-gradient(170deg, #142041 0%, #0B1430 100%)",
    ink: "#F8FAFC",
    muted: "#94A3C4",
    accent: "#FFD43B",
    header: "linear-gradient(120deg, #2563EB 0%, #1D6FE0 45%, #7C3AED 100%)",
    headerInk: "#FFFFFF",
    wordShare: "#FFD43B",
    back: "linear-gradient(160deg, #1E40AF 0%, #1D6FE0 50%, #6D28D9 100%)",
    backInk: "#FFFFFF",
    dots: "rgba(125,211,252,0.10)",
    chip: "rgba(255,255,255,0.08)",
    slot: "#0B1430",
    photoBg: "linear-gradient(135deg, #FFE066, #FFB703)",
    photoInk: "#0B2147",
    photoRing: "#1E2B52",
    border: "#3B82F6",
    rim: "0 0 0 2px #3B82F6, 0 0 22px -2px rgba(59,130,246,0.55)",
    shadow: "0 30px 60px -24px rgba(0,0,0,0.7)",
    strap: "#FFD43B",
  },
};
const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" });

function Wordmark({ size = 15, uni, share }) {
  return (
    <Box component="span" sx={{ fontSize: size, fontWeight: 900, letterSpacing: "-0.02em" }}>
      <Box component="span" sx={{ color: uni }}>Uni</Box>
      <Box component="span" sx={{ color: share }}>Share</Box>
    </Box>
  );
}

/**
 * The strap and clip the pass hangs from. The two straps open out in a V and
 * run past the top of the page, so the pass looks hung from the screen edge. `short` takes
 * less layout height so the pass sits higher (phones).
 */
function Lanyard({ dark, strap, short = false }) {
  return (
    <Box component="svg" aria-hidden viewBox={short ? "0 56 200 54" : "0 0 200 110"} sx={{ display: "block", width: 200, height: short ? 54 : 110, mx: "auto", mb: "-14px", position: "relative", zIndex: 2, overflow: "visible", pointerEvents: "none" }}>
      <defs>
        <linearGradient id="pc-metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1F5F9" />
          <stop offset="0.5" stopColor="#94A3B8" />
          <stop offset="1" stopColor="#E2E8F0" />
        </linearGradient>
        <pattern id="pc-text" width="44" height="12" patternUnits="userSpaceOnUse" patternTransform="translate(97 0) rotate(90)">
          <text x="0" y="9" fontSize="7.5" fontWeight="800" fill={dark ? "#0B2147" : "#FFD43B"} opacity="0.85" style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "1px" }}>UNISHARE</text>
        </pattern>
      </defs>
      {/* Two straps tilted out from the clip into a V, off the top of the page. */}
      <g transform="rotate(-24 100 74)">
        <rect x="84" y="-340" width="16" height="420" fill={strap} />
        <rect x="86" y="-340" width="12" height="412" fill="url(#pc-text)" />
      </g>
      <g transform="rotate(24 100 74)">
        <rect x="100" y="-340" width="16" height="420" fill={strap} />
        <rect x="100" y="-340" width="16" height="420" fill="#000" opacity="0.18" />
      </g>
      {/* Clasp and swivel ring. */}
      <rect x="88" y="70" width="24" height="16" rx="4" fill="url(#pc-metal)" />
      <circle cx="100" cy="94" r="9" fill="none" stroke="url(#pc-metal)" strokeWidth="5" />
      <rect x="96" y="98" width="8" height="12" rx="2" fill="url(#pc-metal)" />
    </Box>
  );
}

/**
 * A decorative barcode, stable for each user: bar widths come from a hash of
 * the username (or name), framed by guard bars like a real code.
 */
function Barcode({ seed, color, width = 96, height = 30 }) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  const bars = [];
  let x = 0;
  const push = (w, on) => {
    if (on) bars.push([x, w]);
    x += w;
  };
  push(1, true); push(1, false); push(1, true); push(1, false); // start guard
  for (let i = 0; i < 26; i += 1) {
    h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0;
    push(1 + (h % 3), i % 2 === 0);
  }
  push(1, false); push(1, true); push(1, false); push(1, true); // end guard
  return (
    <Box component="svg" aria-hidden viewBox={`0 0 ${x} 10`} preserveAspectRatio="none" sx={{ display: "block", width, height }}>
      {bars.map(([bx, bw]) => <rect key={bx} x={bx} y="0" width={bw} height="10" fill={color} />)}
    </Box>
  );
}

function Photo({ profile, size, p }) {
  return (
    <Box sx={{ width: size, height: size, borderRadius: "22px", overflow: "hidden", flexShrink: 0, boxShadow: `0 0 0 5px ${p.photoRing}, 0 12px 26px -10px rgba(11,33,71,0.45)`, background: p.photoBg, display: "grid", placeItems: "center" }}>
      {profile.photo ? (
        <Box component="img" src={profile.photo} alt="" referrerPolicy="no-referrer" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Box component="span" sx={{ fontSize: size * 0.38, fontWeight: 900, color: p.photoInk, letterSpacing: "-0.04em" }}>{initialsOf(profile.name)}</Box>
      )}
    </Box>
  );
}

/**
 * The student's campus pass: a portrait ID card on a lanyard. It drops in and
 * settles with a swing, tilts toward the pointer, and flips over to a QR code for the public pass.
 */
export default function PassCard({ profile, width = 290 }) {
  const t = useRideTokens();
  const dark = t.mode === "dark";
  const p = PALETTES[dark ? "dark" : "light"];
  const reduce = useReducedMotion();
  const [flipped, setFlipped] = useState(false);
  const height = Math.round(width * 1.55);

  // Pointer position in -0.5..0.5, springed for a weighty tilt.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);

  const onMove = (e) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };
  const flip = () => setFlipped((f) => !f);
  const url = passUrl(profile.handle);
  const face = { position: "absolute", inset: 0, borderRadius: "26px", overflow: "hidden", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };

  return (
    <Box
      component={m.div}
      initial={reduce ? false : { y: -90, rotate: -7, opacity: 0 }}
      animate={reduce ? { opacity: 1 } : { y: 0, rotate: [-7, 4, -2.2, 1, 0], opacity: 1 }}
      transition={reduce ? { duration: 0 } : { y: { type: "spring", stiffness: 140, damping: 14 }, rotate: { duration: 1.6, ease: "easeOut" }, opacity: { duration: 0.3 } }}
      style={{ originX: 0.5, originY: 0 }}
      sx={{ width, mx: "auto" }}
    >
      <Lanyard dark={dark} strap={p.strap} short={width < 270} />
      <Box sx={{ perspective: 1100 }} onPointerMove={onMove} onPointerLeave={reset}>
        <Box component={m.div} style={reduce ? undefined : { rotateX, rotateY }} sx={{ transformStyle: "preserve-3d" }}>
          <Box
            component={m.div}
            role="button"
            tabIndex={0}
            aria-label={`${s.label(profile.name || "you")}. ${flipped ? s.flipBack : s.flip}`}
            aria-pressed={flipped}
            onClick={flip}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
              }
            }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 90, damping: 14 }}
            sx={{ position: "relative", width, height, transformStyle: "preserve-3d", cursor: "pointer", borderRadius: "26px", outline: "none", "&:focus-visible": { boxShadow: `0 0 0 4px ${t.color.focus}` } }}
          >
            {/* Front. */}
            <Box sx={{ ...face, background: p.paper, color: p.ink, boxShadow: `${p.rim}, ${p.shadow}` }}>
              {/* Faint dot grid across the card stock. */}
              <Box aria-hidden sx={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(${p.dots} 1px, transparent 1.3px)`, backgroundSize: "14px 14px" }} />
              {/* Header band with the lanyard slot. */}
              <Box sx={{ position: "relative", height: 96, px: 2.5, pt: 3.25, display: "flex", alignItems: "flex-start", justifyContent: "space-between", background: p.header, clipPath: "ellipse(120% 100% at 50% 0%)" }}>
                <Box aria-hidden sx={{ position: "absolute", left: "50%", top: 12, width: 54, height: 10, ml: "-27px", borderRadius: 5, backgroundColor: p.slot, boxShadow: "inset 0 2px 3px rgba(11,33,71,0.35)" }} />
                <Wordmark size={19} uni={p.headerInk} share={p.wordShare} />
                <Box component="span" sx={{ mt: 0.5, fontSize: 10.5, fontWeight: 850, letterSpacing: "0.22em", color: p.headerInk }}>{s.pass}</Box>
              </Box>
              <Box sx={{ position: "relative", px: 2.5, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <Box sx={{ mt: -3.5 }}><Photo profile={profile} size={Math.round(width * 0.42)} p={p} /></Box>
                <Box sx={{ mt: 2, fontSize: Math.round(width * 0.08), fontWeight: 850, lineHeight: 1.15, letterSpacing: "-0.01em", overflowWrap: "anywhere", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{profile.name || "—"}</Box>
                <Box sx={{ mt: 0.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, color: p.accent, minHeight: 20 }}>{profile.handle ? `@${profile.handle}` : ""}</Box>
                {profile.campus ? (
                  <Box sx={{ mt: 1.25, display: "inline-flex", alignItems: "center", gap: 0.6, maxWidth: "100%", px: 1.25, py: 0.5, borderRadius: 999, backgroundColor: p.chip, fontSize: 12.5, fontWeight: 700, color: p.ink }}>
                    <MapPoint size={15} color={p.accent} aria-hidden style={{ flexShrink: 0 }} />
                    <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.campus}</Box>
                  </Box>
                ) : null}
              </Box>
              {/* Footer: member since and a hologram seal. */}
              <Box sx={{ position: "absolute", left: 18, right: 18, bottom: 16, pt: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, borderTop: `1px dashed ${p.muted}`, fontSize: 11.5, fontWeight: 700, lineHeight: 1.25, color: p.muted }}>
                <Box component="span" sx={{ minWidth: 0 }}>{profile.memberSince ? s.member(monthFmt.format(profile.memberSince)) : ""}</Box>
                <Barcode seed={profile.handle || profile.name || "unishare"} color={p.ink} width={Math.round(width * 0.32)} height={26} />
              </Box>
            </Box>

            {/* Back. */}
            <Box sx={{ ...face, transform: "rotateY(180deg)", background: p.back, color: p.backInk, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, px: 3, textAlign: "center", boxShadow: `${p.rim}, ${p.shadow}` }}>
              <Box aria-hidden sx={{ position: "absolute", left: "50%", top: 12, width: 54, height: 10, ml: "-27px", borderRadius: 5, backgroundColor: p.slot, boxShadow: "inset 0 2px 3px rgba(11,33,71,0.35)" }} />
              {url ? (
                <>
                  <Box sx={{ p: 1.5, borderRadius: "18px", backgroundColor: "#fff", boxShadow: "0 12px 24px -12px rgba(11,33,71,0.5)" }}>
                    <QRCodeSVG value={url} title={s.scan} size={Math.round(width * 0.55)} fgColor="#0B2147" bgColor="#FFFFFF" level="M" marginSize={0} />
                  </Box>
                  <Box sx={{ fontSize: 15, fontWeight: 800 }}>{s.scan}</Box>
                  <Box sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13.5, fontWeight: 800, color: dark ? "#FFD43B" : "#1D6FE0" }}>@{profile.handle}</Box>
                </>
              ) : (
                <Box sx={{ fontSize: 15, fontWeight: 750, maxWidth: 200 }}>{s.noHandle}</Box>
              )}
              <Box sx={{ position: "absolute", bottom: 18 }}><Wordmark size={15} uni={p.backInk} share={dark ? "#FFD43B" : "#1D6FE0"} /></Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
