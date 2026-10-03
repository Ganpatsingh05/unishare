"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import { HOUSING_STRINGS } from "../../constants/housingStrings";

const s = HOUSING_STRINGS.search.ruler;

/** Rounded ticks across the rent range. */
function ticks(min, max) {
  const span = max - min;
  const step = [500, 1000, 2000, 2500, 5000, 10000].find((v) => span / v <= 5) || 20000;
  const out = [];
  for (let v = Math.ceil(min / step) * step; v <= max; v += step) out.push(v);
  return out;
}

/**
 * Every matching room as a dot on a rent line. Rooms at similar rents stack
 * upward so none hide each other. Hovering a dot (or its card) highlights the
 * pair; clicking a dot scrolls to the room.
 */
export default function RentRuler({ rooms, activeId, onActive, onPick }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const priced = rooms.filter((r) => Number.isFinite(r.rent) && r.rent > 0);

  const layout = useMemo(() => {
    if (priced.length < 2) return null;
    const rents = priced.map((r) => r.rent);
    let min = Math.min(...rents);
    let max = Math.max(...rents);
    if (max === min) {
      min -= 500;
      max += 500;
    }
    const pad = (max - min) * 0.04;
    min -= pad;
    max += pad;
    const x = (v) => ((v - min) / (max - min)) * 100;
    // Stack dots that would overlap (closer than ~2.2% of the width).
    const placed = [];
    const dots = [...priced]
      .sort((a, b) => a.rent - b.rent)
      .map((room) => {
        const px = x(room.rent);
        let level = 0;
        while (placed.some((p) => p.level === level && Math.abs(p.px - px) < 2.2)) level += 1;
        placed.push({ px, level });
        return { room, px, level };
      });
    return { dots, ticks: ticks(min + pad, max - pad).map((v) => ({ v, px: x(v) })), levels: Math.max(...placed.map((p) => p.level)) + 1 };
  }, [priced]);

  if (!layout) return null;
  const DOT = 14;
  const TAP = 24;
  const height = Math.min(4, layout.levels) * (DOT + 4) + 6;
  return (
    <Box component="section" aria-label={s.label} sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: `${t.radius.xl}px`, border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 1, flexWrap: "wrap", mb: 1.5 }}>
        <Box sx={{ fontSize: 14, fontWeight: 760, color: c.text }}>{s.label}</Box>
        <Box sx={{ fontSize: 12.5, color: c.textMuted }}>{s.hint}</Box>
      </Box>
      <Box sx={{ position: "relative", height: height + 30, mt: 4, mx: 1 }}>
        {/* Axis */}
        <Box sx={{ position: "absolute", left: 0, right: 0, bottom: 24, height: 2, borderRadius: 1, backgroundColor: c.surfaceInteractive }} />
        {layout.ticks.map((tick) => (
          <Box key={tick.v} sx={{ position: "absolute", left: `${tick.px}%`, bottom: 0, transform: "translateX(-50%)", fontSize: 11.5, fontWeight: 650, color: c.textMuted, whiteSpace: "nowrap" }}>
            {formatRupee(tick.v)}
          </Box>
        ))}
        {/* Label for the active dot, kept inside the ruler so it always lines up. */}
        {(() => {
          const hit = layout.dots.find((d) => d.room.id === activeId);
          if (!hit) return null;
          const lvl = Math.min(hit.level, 3);
          return (
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                left: `clamp(90px, ${hit.px}%, calc(100% - 90px))`,
                bottom: 30 + lvl * (DOT + 4) + DOT + 8,
                transform: "translateX(-50%)",
                px: 1.25,
                py: 0.6,
                borderRadius: `${t.radius.sm}px`,
                backgroundColor: t.brand.inkNavy,
                color: "#fff",
                fontSize: 12.5,
                fontWeight: 700,
                whiteSpace: "nowrap",
                maxWidth: 240,
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxShadow: t.elevation[2],
                zIndex: 3,
                pointerEvents: "none",
              }}
            >
              {hit.room.title} · {formatRupee(hit.room.rent)}
            </Box>
          );
        })()}
        {layout.dots.map(({ room, px, level }, i) => {
          const on = activeId === room.id;
          const lvl = Math.min(level, 3);
          return (
              <ButtonBase
                key={room.id}
                component={m.button}
                nativeButton
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, scale: on ? 1.45 : 1 }}
                transition={{ ...t.motion.spring, delay: reduce ? 0 : Math.min(i, 20) * 0.015 }}
                aria-label={s.jump(room.title, formatRupee(room.rent))}
                onMouseEnter={() => onActive(room.id)}
                onMouseLeave={() => onActive(null)}
                onFocus={() => onActive(room.id)}
                onBlur={() => onActive(null)}
                onClick={() => onPick(room.id)}
                sx={{
                  position: "absolute",
                  left: `${px}%`,
                  // 24px tap target around a 14px dot.
                  bottom: 30 + lvl * (DOT + 4) - (TAP - DOT) / 2,
                  width: TAP,
                  height: TAP,
                  ml: `-${TAP / 2}px`,
                  borderRadius: "50%",
                  "&::after": {
                    content: '""',
                    width: DOT,
                    height: DOT,
                    borderRadius: "50%",
                    backgroundColor: on ? t.brand.yellow : t.mode === "dark" ? t.brand.skyBright : t.brand.actionBlue,
                    border: `2px solid ${c.surface}`,
                    boxShadow: on ? `0 0 0 4px ${c.driverSoft}` : "none",
                  },
                  zIndex: on ? 2 : 1,
                  "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
                }}
              />
          );
        })}
      </Box>
    </Box>
  );
}
