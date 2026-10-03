"use client";

import { useId, useRef, useState } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import DatePicker from "antd/es/date-picker";
import TimePicker from "antd/es/time-picker";
import InputNumber from "antd/es/input-number";
import { m, useReducedMotion } from "framer-motion";
import { CalendarBlank, Clock, Minus, Plus, X } from "@phosphor-icons/react";
import RouteLine from "../primitives/RouteLine";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { SEAT_LIMITS } from "../../../constants/ridePlaces";
import { formatRupee } from "../../../utils/rideFormat";

const S = RIDE_STRINGS.manage;
const SHEET_WIDTH = 420;
const RUPEE = formatRupee(0).replace(/[\d\s.,]/g, "");
const noop = () => {};

function initialValues(ride) {
  const booked = Math.max(0, ride.seatsTotal - ride.seatsLeft);
  const [hh = 0, mm = 0] = String(ride.time || "").split(":").map(Number);
  const date = ride.date ? dayjs(ride.date) : null;
  return {
    date: date && date.isValid() ? date : null,
    time: ride.time ? dayjs().hour(hh).minute(mm).second(0).millisecond(0) : null,
    seats: Math.max(ride.seatsTotal || 1, booked, SEAT_LIMITS.min),
    price: Number.isFinite(ride.price) ? ride.price : null,
    booked,
  };
}

function validate(values) {
  const errors = {};
  if (!values.date || !values.time) errors.when = RIDE_STRINGS.hero.requiredWhen;
  else {
    const starts = values.date.hour(values.time.hour()).minute(values.time.minute());
    if (!starts.isAfter(dayjs())) errors.when = RIDE_STRINGS.manage.editTimePast;
  }
  if (!Number.isFinite(values.price) || values.price < 1) errors.price = RIDE_STRINGS.manage.editPriceRequired;
  return errors;
}

function FieldLabel({ htmlFor, icon, children, t }) {
  return (
    <Box
      component="label"
      htmlFor={htmlFor}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        mb: 0.75,
        fontSize: 13,
        fontWeight: 650,
        color: t.color.textSecondary,
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

function FieldError({ id, children, t }) {
  if (!children) return null;
  return (
    <Box id={id} sx={{ mt: 0.75, fontSize: 12.5, fontWeight: 600, color: t.color.danger }}>
      {children}
    </Box>
  );
}

function SeatStepper({ id, value, min, max, onChange, describedBy, t }) {
  const reduce = useReducedMotion();
  const tap = reduce ? undefined : { scale: 0.92 };
  const stepButtonSx = {
    border: `1px solid ${t.color.borderStrong}`,
    borderRadius: `${t.radius.pill}px`,
    "&.Mui-disabled": { opacity: 0.45 },
  };
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <m.span whileTap={tap} style={{ display: "inline-flex" }}>
        <IconButton
          aria-label={RIDE_STRINGS.manage.editFewerSeats}
          aria-controls={id}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          sx={stepButtonSx}
        >
          <Minus size={18} weight="regular" aria-hidden />
        </IconButton>
      </m.span>
      <InputNumber
        id={id}
        value={value}
        min={min}
        max={max}
        precision={0}
        controls={false}
        changeOnWheel={false}
        inputMode="numeric"
        aria-describedby={describedBy}
        onChange={(next) => {
          if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
        }}
        style={{ width: 72 }}
        styles={{
          input: {
            textAlign: "center",
            fontWeight: 700,
            fontSize: 17,
            fontVariantNumeric: "tabular-nums",
          },
        }}
      />
      <m.span whileTap={tap} style={{ display: "inline-flex" }}>
        <IconButton
          aria-label={RIDE_STRINGS.manage.editMoreSeats}
          aria-controls={id}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          sx={stepButtonSx}
        >
          <Plus size={18} weight="regular" aria-hidden />
        </IconButton>
      </m.span>
    </Box>
  );
}

function EditForm({ ride, onClose, onSave, titleId, t }) {
  const uid = useId();
  const popupRef = useRef(null);
  const [values, setValues] = useState(() => initialValues(ride));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const ids = {
    date: `${uid}-date`,
    time: `${uid}-time`,
    when: `${uid}-when-error`,
    seats: `${uid}-seats`,
    seatsHint: `${uid}-seats-hint`,
    price: `${uid}-price`,
    priceError: `${uid}-price-error`,
  };
  const minSeats = Math.max(values.booked, SEAT_LIMITS.min);
  const popupContainer = () => popupRef.current || document.body;

  const set = (patch) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      if ("date" in patch || "time" in patch) delete next.when;
      if ("price" in patch) delete next.price;
      return next;
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (saving) return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(found.when ? ids.date : ids.price)?.focus();
      return;
    }
    setSaving(true);
    const result = await onSave({
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      seatsTotal: values.seats,
      price: values.price,
    });
    setSaving(false);
    if (result?.success) onClose();
  };

  const pickerStyle = { width: "100%", height: t.layout.controlHeight };

  return (
    <Box
      component="form"
      noValidate
      onSubmit={submit}
      sx={{ display: "flex", flexDirection: "column", minHeight: 0, flex: 1 }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2.5, md: 3 },
          pt: { xs: 1, md: 3 },
          pb: 2,
        }}
      >
        <Box
          component="h3"
          id={titleId}
          sx={{
            m: 0,
            fontSize: 20,
            fontWeight: t.typography.displayWeight,
            letterSpacing: t.typography.displayTracking,
            color: t.color.text,
          }}
        >
          {S.editTitle}
        </Box>
        <IconButton aria-label={RIDE_STRINGS.manage.editCloseLabel} onClick={onClose}>
          <X size={20} weight="regular" aria-hidden />
        </IconButton>
      </Box>

      <Box
        ref={popupRef}
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          px: { xs: 2.5, md: 3 },
          pb: 3,
          display: "grid",
          alignContent: "start",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: `${t.radius.md}px`,
            backgroundColor: t.color.surfaceInteractive,
          }}
        >
          <RouteLine from={ride.from} to={ride.to} dense clamp={2} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <FieldLabel htmlFor={ids.date} t={t} icon={<CalendarBlank size={18} weight="regular" aria-hidden />}>
              {RIDE_STRINGS.hero.date}
            </FieldLabel>
            <DatePicker
              id={ids.date}
              value={values.date}
              onChange={(date) => set({ date })}
              format="ddd, D MMM"
              allowClear={false}
              inputReadOnly
              disabledDate={(day) => day.isBefore(dayjs(), "day")}
              getPopupContainer={popupContainer}
              status={errors.when ? "error" : undefined}
              aria-invalid={Boolean(errors.when)}
              aria-describedby={errors.when ? ids.when : undefined}
              style={pickerStyle}
            />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <FieldLabel htmlFor={ids.time} t={t} icon={<Clock size={18} weight="regular" aria-hidden />}>
              {RIDE_STRINGS.hero.time}
            </FieldLabel>
            <TimePicker
              id={ids.time}
              value={values.time}
              onChange={(time) => set({ time })}
              format="h:mm a"
              use12Hours
              minuteStep={5}
              needConfirm={false}
              allowClear={false}
              inputReadOnly
              getPopupContainer={popupContainer}
              status={errors.when ? "error" : undefined}
              aria-invalid={Boolean(errors.when)}
              aria-describedby={errors.when ? ids.when : undefined}
              style={pickerStyle}
            />
          </Box>
        </Box>
        <FieldError id={ids.when} t={t}>
          {errors.when}
        </FieldError>

        <Box>
          <FieldLabel htmlFor={ids.seats} t={t}>
            {RIDE_STRINGS.hero.seats}
          </FieldLabel>
          <SeatStepper
            id={ids.seats}
            value={values.seats}
            min={minSeats}
            max={SEAT_LIMITS.maxPost}
            onChange={(seats) => set({ seats })}
            describedBy={ids.seatsHint}
            t={t}
          />
          <Box id={ids.seatsHint} sx={{ mt: 0.75, fontSize: 12.5, color: t.color.textMuted }}>
            {values.booked > 0
              ? RIDE_STRINGS.manage.editSeatsBooked(values.booked)
              : RIDE_STRINGS.manage.editSeatsRange(minSeats, SEAT_LIMITS.maxPost)}
          </Box>
        </Box>

        <Box>
          <FieldLabel htmlFor={ids.price} t={t}>
            {S.price}
          </FieldLabel>
          <InputNumber
            id={ids.price}
            value={values.price}
            min={1}
            precision={0}
            controls={false}
            changeOnWheel={false}
            inputMode="numeric"
            prefix={
              <Box component="span" aria-hidden sx={{ color: t.color.textMuted, fontWeight: 650 }}>
                {RUPEE}
              </Box>
            }
            onChange={(price) => set({ price: Number.isFinite(price) ? price : null })}
            status={errors.price ? "error" : undefined}
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? ids.priceError : undefined}
            style={{ width: "100%", maxWidth: 200, height: t.layout.controlHeight, alignItems: "center" }}
            styles={{ input: { fontWeight: 700, fontSize: 16, fontVariantNumeric: "tabular-nums" } }}
          />
          <FieldError id={ids.priceError} t={t}>
            {errors.price}
          </FieldError>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1.4fr",
          gap: 1.5,
          px: { xs: 2.5, md: 3 },
          pt: 2,
          pb: "calc(16px + env(safe-area-inset-bottom))",
          borderTop: `1px solid ${t.color.border}`,
          backgroundColor: t.color.surface,
        }}
      >
        <Button variant="outlined" onClick={onClose} disabled={saving}>
          {S.editCancel}
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          loading={saving}
          aria-busy={saving || undefined}
        >
          {S.editSave}
        </Button>
      </Box>
    </Box>
  );
}

/**
 * Edit date, time, seats and price of one of the driver's rides. Bottom
 * sheet below 900px, right-hand panel above.
 */
export default function EditRideSheet({ ride, open, onClose, onSave }) {
  const t = useRideTokens();
  const titleId = useId();
  const side = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const anchor = side ? "right" : "bottom";

  const paperSx = side
    ? {
        width: SHEET_WIDTH,
        maxWidth: "100vw",
        height: "100%",
        borderRadius: `${t.radius.xl}px 0 0 ${t.radius.xl}px`,
      }
    : {
        maxHeight: "88vh",
        borderRadius: `${t.radius.xl}px ${t.radius.xl}px 0 0`,
      };

  return (
    <SwipeableDrawer
      anchor={anchor}
      open={open && Boolean(ride)}
      onClose={onClose}
      onOpen={noop}
      disableSwipeToOpen
      slotProps={{
        paper: {
          role: "dialog",
          "aria-modal": true,
          "aria-labelledby": titleId,
          sx: { ...paperSx, display: "flex", flexDirection: "column", overflow: "hidden" },
        },
      }}
    >
      {!side ? (
        <Box aria-hidden sx={{ display: "flex", justifyContent: "center", pt: 1.25, pb: 0.5 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: `${t.radius.pill}px`, backgroundColor: t.color.borderStrong }} />
        </Box>
      ) : null}
      {ride ? <EditForm key={ride.id} ride={ride} onClose={onClose} onSave={onSave} titleId={titleId} t={t} /> : null}
    </SwipeableDrawer>
  );
}
