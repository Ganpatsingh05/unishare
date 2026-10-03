"use client";

import { useRef } from "react";
import Box from "@mui/material/Box";
import { m } from "framer-motion";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";

const S = RIDE_STRINGS.recent;
export const DAY_FILTERS = ["today", "tomorrow", "week"];
const MAX_BADGE = 99;

function PendingMark({ t }) {
  return <Box component="span" sx={{ width: 6, height: 2, borderRadius: 1, backgroundColor: t.color.borderStrong }} />;
}

/**
 * Today / Tomorrow / This week as a radio group with roving tabindex.
 * Arrow keys, Home and End move and select; the selected pill slides.
 * Pass `counts={null}` while rides are loading: badges keep their size but
 * show a quiet placeholder instead of a misleading zero.
 * @param {{ value: "today"|"tomorrow"|"week", onChange: (v: string) => void, counts?: Record<string, number>|null }} props
 */
export default function DayFilter({ value, onChange, counts = {} }) {
  const t = useRideTokens();
  const refs = useRef([]);

  const select = (index) => {
    const next = DAY_FILTERS[(index + DAY_FILTERS.length) % DAY_FILTERS.length];
    onChange(next);
    refs.current[DAY_FILTERS.indexOf(next)]?.focus();
  };

  const onKeyDown = (event, index) => {
    const moves = { ArrowRight: index + 1, ArrowDown: index + 1, ArrowLeft: index - 1, ArrowUp: index - 1, Home: 0, End: DAY_FILTERS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <Box
      role="radiogroup"
      aria-label={S.filterLabel}
      sx={{
        display: "flex",
        width: { xs: "100%", sm: "auto" },
        p: 0.5,
        gap: 0.5,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: t.color.surfaceInteractive,
        border: `1px solid ${t.color.border}`,
      }}
    >
      {DAY_FILTERS.map((key, index) => {
        const selected = key === value;
        const pending = counts === null;
        const count = pending ? 0 : (counts[key] ?? 0);
        return (
          <Box
            key={key}
            component={m.button}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={pending ? S.filters[key] : RIDE_STRINGS.recent.optionLabel(S.filters[key], count)}
            tabIndex={selected ? 0 : -1}
            ref={(node) => {
              refs.current[index] = node;
            }}
            onClick={() => onChange(key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            whileTap={{ scale: 0.97 }}
            sx={{
              position: "relative",
              flex: { xs: "1 1 auto", sm: "0 0 auto" },
              minWidth: 0,
              minHeight: t.layout.touch,
              px: { xs: 1, sm: 2 },
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 0.75, sm: 1 },
              border: 0,
              borderRadius: `${t.radius.pill}px`,
              background: "transparent",
              cursor: "pointer",
              font: "inherit",
              fontSize: { xs: 13, sm: 14 },
              fontWeight: 650,
              whiteSpace: "nowrap",
              color: selected ? t.color.text : t.color.textOnInset,
              transition: `color ${t.motion.duration.fast}s`,
              "@media (hover: hover)": { "&:hover": { color: t.color.text } },
              "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2, zIndex: 2 },
            }}
          >
            {selected ? (
              <Box
                component={m.span}
                layoutId="rs-day-indicator"
                aria-hidden
                transition={t.motion.springSnappy}
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: `${t.radius.pill}px`,
                  backgroundColor: t.color.surface,
                  boxShadow: t.elevation[1],
                }}
              />
            ) : null}
            <Box component="span" sx={{ position: "relative", overflow: "hidden", textOverflow: "ellipsis" }}>
              {S.filters[key]}
            </Box>
            <Box
              component="span"
              aria-hidden
              sx={{
                position: "relative",
                flexShrink: 0,
                minWidth: { xs: 20, sm: 22 },
                height: 20,
                px: { xs: 0.5, sm: 0.75 },
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: `${t.radius.pill}px`,
                fontSize: 11.5,
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
                backgroundColor: selected ? t.color.highlight : t.color.surface,
                color: selected ? t.color.onHighlight : t.color.textOnInset,
              }}
            >
              {pending ? <PendingMark t={t} /> : count > MAX_BADGE ? `${MAX_BADGE}+` : count}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
