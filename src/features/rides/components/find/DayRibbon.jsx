"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { m } from "framer-motion";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRideDay } from "../../utils/rideFormat";
import { dayKey } from "../../utils/rideMatch";

const s = RIDE_STRINGS.find.ribbon;
const DAYS_SHOWN = 7;
const weekday = new Intl.DateTimeFormat("en-IN", { weekday: "short" });

/**
 * A strip of the next seven days with a ride count under each, plus "Any
 * day". It is a single-select radio group: arrow keys move, Home/End jump.
 * @param {string|null} value "YYYY-MM-DD" or null for any day
 * @param {Record<string, number>} counts rides per day key (route-matched)
 */
export default function DayRibbon({ value, onChange, counts, total }) {
  const t = useRideTokens();
  const c = t.color;
  const refs = useRef([]);
  const options = [
    { key: null, top: s.any, bottom: s.count(total), count: total },
    ...Array.from({ length: DAYS_SHOWN }, (_, i) => {
      const key = dayKey(i);
      const date = new Date(`${key}T00:00`);
      const label = i < 2 ? formatRideDay(key) : `${weekday.format(date)} ${date.getDate()}`;
      return { key, top: label, bottom: s.count(counts[key] || 0), count: counts[key] || 0 };
    }),
  ];
  const selectedIndex = Math.max(0, options.findIndex((option) => option.key === value));

  const move = (index) => {
    const next = (index + options.length) % options.length;
    onChange(options[next].key);
    refs.current[next]?.focus();
  };
  const onKeyDown = (event, index) => {
    const map = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: options.length - 1 };
    if (event.key in map) {
      event.preventDefault();
      move(map[event.key]);
    }
  };

  return (
    <Box
      role="radiogroup"
      aria-label={s.label}
      sx={{
        display: "flex",
        gap: 1,
        overflowX: "auto",
        scrollSnapType: "x proximity",
        pb: 0.5,
        mx: { xs: -2, sm: 0 },
        px: { xs: 2, sm: 0 },
        scrollbarWidth: "none",
        // Fade the trailing edge so it reads as scrollable.
        maskImage: "linear-gradient(to right, #000 calc(100% - 40px), transparent)",
        WebkitMaskImage: "linear-gradient(to right, #000 calc(100% - 40px), transparent)",
        pr: 5,
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      {options.map((option, index) => {
        const selected = index === selectedIndex;
        const empty = option.count === 0;
        return (
          <ButtonBase
            key={option.key || "any"}
            ref={(node) => {
              refs.current[index] = node;
            }}
            role="radio"
            aria-checked={selected}
            aria-label={RIDE_STRINGS.find.ribbon.optionLabel(option.top, option.count)}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            sx={{
              position: "relative",
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.25,
              minWidth: 92,
              minHeight: 60,
              px: 1.75,
              py: 1.1,
              borderRadius: `${t.radius.md}px`,
              border: `1px solid ${selected ? "transparent" : c.border}`,
              backgroundColor: selected ? "transparent" : c.surface,
              color: selected ? c.onAction : c.text,
              textAlign: "left",
              transition: "border-color 160ms ease, transform 160ms ease",
              "&:hover": { borderColor: selected ? "transparent" : c.borderStrong },
              "&:active": { transform: "scale(0.98)" },
              "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
            }}
          >
            {selected ? (
              <Box
                component={m.span}
                layoutId="rs-day-pill"
                transition={t.motion.spring}
                aria-hidden
                sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.action, boxShadow: t.elevation[2] }}
              />
            ) : null}
            <Box component="span" sx={{ position: "relative", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap" }}>
              {option.top}
            </Box>
            <Box
              component="span"
              sx={{
                position: "relative",
                fontSize: 12.5,
                fontWeight: 600,
                whiteSpace: "nowrap",
                color: selected ? c.onAction : empty ? c.textMuted : c.textSecondary,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {option.bottom}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
