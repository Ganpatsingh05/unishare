"use client";

import { useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ArrowCounterClockwise, Moon, SunHorizon, Sun, CloudSun } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRupee } from "../../utils/rideFormat";
import { SORTS, TIME_WINDOWS } from "../../utils/rideMatch";

const s = RIDE_STRINGS.find.filters;
const WINDOW_ICONS = { morning: SunHorizon, afternoon: Sun, evening: CloudSun, night: Moon };

export const INITIAL_FILTERS = { sort: "best", windows: [], maxPrice: null };

/** Number of filters that narrow the results (sort does not count). */
export function activeFilterCount(filters) {
  return (filters.windows.length ? 1 : 0) + (filters.maxPrice !== null ? 1 : 0);
}

function Label({ id, children, trailing }) {
  const t = useRideTokens();
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 1, mb: 1 }}>
      <Box id={id} sx={{ fontSize: 13, fontWeight: 700, color: t.color.textSecondary }}>
        {children}
      </Box>
      {trailing}
    </Box>
  );
}

/**
 * Sort, departure window and price controls. Used in the desktop rail and in
 * the mobile trip panel; both read and write the same filter object.
 * @param {{min: number, max: number}|null} priceRange fares present in the results
 */
export default function FilterPanel({ filters, onChange, priceRange }) {
  const t = useRideTokens();
  const c = t.color;
  const ids = { sort: useId(), windows: useId(), price: useId() };
  const set = (patch) => onChange({ ...filters, ...patch });
  const hasPrices = priceRange && priceRange.max > priceRange.min;
  const priceValue = filters.maxPrice ?? priceRange?.max ?? 0;

  const groupSx = {
    display: "grid",
    gap: 0.75,
    "& .MuiToggleButton-root": {
      minHeight: 44,
      border: `1px solid ${c.border} !important`,
      borderRadius: `${t.radius.md}px !important`,
      m: "0 !important",
      textTransform: "none",
      fontSize: 13.5,
      fontWeight: 650,
      color: c.textSecondary,
      backgroundColor: c.surface,
      gap: 0.75,
      "&:hover": { backgroundColor: c.surfaceInteractive },
      "&.Mui-selected": {
        color: c.accentText,
        backgroundColor: c.actionSoft,
        borderColor: `${c.action} !important`,
        "&:hover": { backgroundColor: c.actionSoftStrong },
      },
      "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Label id={ids.sort}>{s.sortLabel}</Label>
        <ToggleButtonGroup
          exclusive
          value={filters.sort}
          onChange={(_, next) => next && set({ sort: next })}
          aria-labelledby={ids.sort}
          sx={{ ...groupSx, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {SORTS.map((key) => (
            <ToggleButton key={key} value={key}>
              {s.sort[key]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box>
        <Label id={ids.windows}>{s.windowLabel}</Label>
        <ToggleButtonGroup
          value={filters.windows}
          onChange={(_, next) => set({ windows: next })}
          aria-labelledby={ids.windows}
          sx={{ ...groupSx, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
        >
          {TIME_WINDOWS.map((key) => {
            const Icon = WINDOW_ICONS[key];
            return (
              <ToggleButton key={key} value={key} aria-label={`${s.windows[key]}, ${s.windowHint[key]}`} sx={{ flexDirection: "column", py: 1, gap: "2px !important" }}>
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                  <Icon size={17} weight="duotone" aria-hidden />
                  {s.windows[key]}
                </Box>
                <Box component="span" aria-hidden sx={{ fontSize: 11.5, fontWeight: 550, color: c.textMuted }}>
                  {s.windowHint[key]}
                </Box>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Box>

      {hasPrices ? (
        <Box>
          <Label
            id={ids.price}
            trailing={
              <Box sx={{ fontSize: 13, fontWeight: 700, color: c.text, fontVariantNumeric: "tabular-nums" }}>
                {filters.maxPrice === null ? s.priceAny : s.priceUpTo(formatRupee(filters.maxPrice))}
              </Box>
            }
          >
            {s.priceLabel}
          </Label>
          <Box sx={{ px: 1.25 }}>
            <Slider
              value={priceValue}
              min={priceRange.min}
              max={priceRange.max}
              step={priceRange.max - priceRange.min > 200 ? 10 : 5}
              onChange={(_, next) => set({ maxPrice: next >= priceRange.max ? null : next })}
              getAriaLabel={() => s.priceLabel}
              getAriaValueText={(value) => formatRupee(value)}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => formatRupee(value)}
              sx={{
                color: c.action,
                height: 6,
                "& .MuiSlider-thumb": {
                  width: 22,
                  height: 22,
                  backgroundColor: c.surface,
                  border: `3px solid ${c.action}`,
                  "&:hover, &.Mui-focusVisible": { boxShadow: `0 0 0 8px ${c.actionSoft}` },
                },
                "& .MuiSlider-rail": { backgroundColor: c.surfaceInteractive, opacity: 1 },
                "& .MuiSlider-valueLabel": { backgroundColor: t.brand.inkNavy, borderRadius: `${t.radius.sm}px`, fontWeight: 700 },
              }}
            />
          </Box>
        </Box>
      ) : null}

      {activeFilterCount(filters) || filters.sort !== INITIAL_FILTERS.sort ? (
        <Button
          variant="text"
          onClick={() => onChange(INITIAL_FILTERS)}
          startIcon={<ArrowCounterClockwise size={16} aria-hidden />}
          sx={{ alignSelf: "flex-start", minHeight: 44, px: 1.25 }}
        >
          {s.reset}
        </Button>
      ) : null}
    </Box>
  );
}
