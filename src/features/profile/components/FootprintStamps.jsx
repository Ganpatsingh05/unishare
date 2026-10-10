"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import { animate, m, useInView, useReducedMotion } from "framer-motion";
import { Car as CarIcon } from "lucide-react";
import { House as HomeSmileIcon } from "lucide-react";
import { Tag as TagPriceIcon } from "lucide-react";
import { Ticket as TicketIcon } from "lucide-react";
import { Search as MagnifierIcon } from "lucide-react";
import { Megaphone as SpeakerIcon } from "lucide-react";
import { BookOpen as BookmarkOpenedIcon } from "lucide-react";
import { ChevronRight as AltArrowRight } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { SOURCES } from "../hooks/useFootprint";

const s = PROFILE_STRINGS.footprint;
// Colour per feature: [light, dark].
export const STAMP_INK = {
  rides: { icon: CarIcon, ink: ["#1D5FD1", "#7CB8FF"] },
  rooms: { icon: HomeSmileIcon, ink: ["#0F766E", "#5EEAD4"] },
  market: { icon: TagPriceIcon, ink: ["#B45309", "#FDBA74"] },
  tickets: { icon: TicketIcon, ink: ["#7C3AED", "#C4B5FD"] },
  lostfound: { icon: MagnifierIcon, ink: ["#B91C1C", "#FCA5A5"] },
  announcements: { icon: SpeakerIcon, ink: ["#BE185D", "#F9A8D4"] },
  resources: { icon: BookmarkOpenedIcon, ink: ["#4338CA", "#A5B4FC"] },
};

/** A number that counts up from zero the first time it scrolls into view. */
function CountUp({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true, margin: "-30px" });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!seen || reduce || !value) {
      el.textContent = String(value);
      return undefined;
    }
    const controls = animate(0, value, { duration: 0.9, ease: "easeOut", onUpdate: (v) => (el.textContent = String(Math.round(v))) });
    return () => controls.stop();
  }, [seen, value, reduce]);
  return <span ref={ref}>0</span>;
}

/**
 * The campus footprint as one panel: the total number of posts, a bar that
 * splits it by feature (segments grow in when it scrolls into view), and a
 * list with one row per feature that opens its manage page.
 */
export default function FootprintStamps({ counts, status }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const barRef = useRef(null);
  const barSeen = useInView(barRef, { once: true, margin: "-40px" });
  const ready = status === "ready";
  const rows = SOURCES.map((src) => ({ ...src, n: counts[src.key], meta: STAMP_INK[src.key] }));
  const total = rows.reduce((sum, r) => sum + (r.n || 0), 0);

  return (
    <Panel radius="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Total and split bar. */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
        <Box sx={{ fontSize: { xs: 40, sm: 48 }, fontWeight: 850, lineHeight: 1, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
          {ready ? <CountUp value={total} /> : "–"}
        </Box>
        <Box sx={{ fontSize: 15, fontWeight: 700, color: c.textSecondary }}>{s.totalLabel(total)}</Box>
      </Box>
      <Box ref={barRef} role="img" aria-label={ready ? rows.map((r) => `${s.stamps[r.key]} ${r.n || 0}`).join(", ") : s.loading} sx={{ mt: 1.75, display: "flex", gap: "3px", height: 12, borderRadius: 6, overflow: "hidden", backgroundColor: c.surfaceInteractive }}>
        {ready && total
          ? rows.filter((r) => r.n).map((r, i) => (
              <Box
                key={r.key}
                component={m.span}
                initial={reduce ? false : { flexGrow: 0.0001 }}
                animate={{ flexGrow: barSeen || reduce ? r.n : 0.0001 }}
                transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                sx={{ flexBasis: 0, minWidth: 4, backgroundColor: r.meta.ink[dark ? 1 : 0] }}
              />
            ))
          : null}
      </Box>

      {/* One row per feature. */}
      <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 2.5, p: 0, display: "grid", columnGap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
        {rows.map((r) => {
          const Icon = r.meta.icon;
          const ink = r.meta.ink[dark ? 1 : 0];
          const empty = ready && !r.n;
          return (
            <Box component="li" key={r.key} sx={{ borderTop: `1px solid ${c.border}` }}>
              <Box
                component={Link}
                href={r.href}
                aria-label={ready ? s.open(s.stamps[r.key], r.n || 0) : s.stamps[r.key]}
                sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25, px: 1, mx: -1, borderRadius: `${t.radius.md}px`, color: "inherit", textDecoration: "none", transition: "background-color 150ms ease", "&:hover": { backgroundColor: c.surfaceInteractive }, "&:hover .fp-arrow": { transform: "translateX(3px)" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}
              >
                <Box aria-hidden sx={{ flexShrink: 0, display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: "12px", backgroundColor: `${ink}${dark ? "29" : "1F"}`, color: ink }}>
                  <Icon size={21} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, fontSize: 15, fontWeight: 720, color: empty ? c.textMuted : c.text }}>{s.stamps[r.key]}</Box>
                <Box sx={{ fontSize: 17, fontWeight: 820, fontVariantNumeric: "tabular-nums", color: empty ? c.textMuted : c.text }}>{ready ? (r.n === null ? "–" : r.n) : ""}</Box>
                <Box component="span" className="fp-arrow" aria-hidden sx={{ display: "inline-flex", color: c.textMuted, transition: "transform 150ms ease" }}>
                  <AltArrowRight size={18} />
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Panel>
  );
}
