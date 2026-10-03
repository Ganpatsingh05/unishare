"use client";

import InputNumber from "antd/es/input-number";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { AnimatePresence, m } from "framer-motion";
import { Minus, Plus } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { SEAT_LIMITS } from "../../../constants/ridePlaces";

export const seatMax = (mode) => (mode === "post" ? SEAT_LIMITS.maxPost : SEAT_LIMITS.maxFind);

export const clampSeats = (value, mode) => {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return SEAT_LIMITS.min;
  return Math.min(Math.max(n, SEAT_LIMITS.min), seatMax(mode));
};

function StepButton({ label, disabled, onClick, controls, children, t }) {
  return (
    <IconButton
      component={m.button}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      type="button"
      aria-label={label}
      aria-controls={controls}
      disabled={disabled}
      onClick={onClick}
      sx={{
        flexShrink: 0,
        width: t.layout.touch,
        height: t.layout.touch,
        borderRadius: `${t.radius.pill}px`,
        border: `1px solid ${t.color.borderStrong}`,
        backgroundColor: t.color.surface,
        color: t.color.text,
        "&.Mui-disabled": { color: t.color.textMuted, borderColor: t.color.border, opacity: 0.6 },
      }}
    >
      {children}
    </IconButton>
  );
}

/**
 * Seat stepper: minus, a centred tabular number, plus, and a live label.
 * Limits: 1 to 5 when finding, 1 to 6 when posting.
 * @param {"cell"|"row"} layout "cell" stacks label, stepper and live label
 *   (desktop/tablet grid cell, `gridArea: seats`); "row" puts the label left
 *   and the stepper right (mobile list row).
 */
export default function SeatsField({ mode, value, onChange, layout = "cell", id = "rs-hero-seats" }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const max = seatMax(mode);
  const seats = clampSeats(value, mode);
  const liveLabel = mode === "post" ? s.seatsOffered(seats) : s.seatsNeeded(seats);
  const labelId = `${id}-label`;
  const liveId = `${id}-live`;
  const row = layout === "row";

  const stepper = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0 }}>
      <StepButton
        label={RIDE_STRINGS.hero.seatFewer}
        disabled={seats <= SEAT_LIMITS.min}
        onClick={() => onChange(clampSeats(seats - 1, mode))}
        controls={id}
        t={t}
      >
        <Minus size={18} weight="regular" aria-hidden />
      </StepButton>
      <Box
        sx={{
          width: 44,
          borderRadius: `${t.radius.sm}px`,
          "&:focus-within": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
          "& .ant-input-number": { width: "100%", backgroundColor: "transparent" },
          "& .ant-input-number-input": {
            height: t.layout.touch,
            padding: 0,
            textAlign: "center",
            fontSize: 20,
            fontWeight: t.typography.displayWeight,
            letterSpacing: t.typography.displayTracking,
            fontVariantNumeric: "tabular-nums",
            color: t.color.text,
          },
        }}
      >
        <InputNumber
          id={id}
          value={seats}
          min={SEAT_LIMITS.min}
          max={max}
          step={1}
          precision={0}
          controls={false}
          variant="borderless"
          inputMode="numeric"
          changeOnWheel={false}
          onChange={(next) => {
            if (next !== null && next !== undefined) onChange(clampSeats(next, mode));
          }}
          aria-labelledby={labelId}
          aria-describedby={liveId}
        />
      </Box>
      <StepButton
        label={RIDE_STRINGS.hero.seatMore}
        disabled={seats >= max}
        onClick={() => onChange(clampSeats(seats + 1, mode))}
        controls={id}
        t={t}
      >
        <Plus size={18} weight="regular" aria-hidden />
      </StepButton>
    </Box>
  );

  const live = (
    <Box
      id={liveId}
      aria-live="polite"
      sx={{ position: "relative", minHeight: 18, fontSize: 12.5, fontWeight: 550, color: t.color.textMuted, whiteSpace: "nowrap" }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={liveLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.12 }}
          style={{ display: "inline-block" }}
        >
          {liveLabel}
        </m.span>
      </AnimatePresence>
    </Box>
  );

  const label = (
    <Box
      component="label"
      id={labelId}
      htmlFor={id}
      sx={{ display: "block", fontSize: row ? 15 : 12.5, fontWeight: 650, lineHeight: 1.4, color: row ? t.color.text : t.color.textSecondary }}
    >
      {s.seats}
    </Box>
  );

  if (row) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, minHeight: t.layout.controlHeightLg, minWidth: 0 }}>
        <Box sx={{ minWidth: 0 }}>
          {label}
          {live}
        </Box>
        {stepper}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        gap: 0.5,
        px: 1.75,
        py: 1,
        backgroundColor: t.color.surface,
      }}
    >
      {label}
      {stepper}
      {live}
    </Box>
  );
}
