"use client";

import { useMemo } from "react";
import dayjs from "dayjs";
import DatePicker from "antd/es/date-picker";
import TimePicker from "antd/es/time-picker";
import Box from "@mui/material/Box";
import { AnimatePresence, m } from "framer-motion";
import { CalendarBlank, Clock, XCircle } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { formatRideDay } from "../../../utils/rideFormat";
import { FieldError, FieldSegment } from "./PlaceField";

const DATE_FORMAT = "ddd, D MMM";
const TIME_FORMAT = "h:mm a";
const QUICK_DAYS = 7;

const range = (start, end) => Array.from({ length: Math.max(end - start, 0) }, (_, i) => start + i);

const disabledDate = (current) => Boolean(current) && current.isBefore(dayjs().startOf("day"));

/** On today's date, hide times that have already passed. */
function useDisabledTime(date) {
  return useMemo(() => {
    if (!date || !date.isSame(dayjs(), "day")) return undefined;
    return () => {
      const now = dayjs();
      return {
        disabledHours: () => range(0, now.hour()),
        disabledMinutes: (hour) => (hour === now.hour() ? range(0, now.minute() + 1) : []),
      };
    };
  }, [date]);
}

function pickerSx(t) {
  return {
    "& .ant-picker": { width: "100%" },
    "& .ant-picker-input > input": {
      fontSize: 16,
      fontWeight: 600,
      color: t.color.text,
      fontVariantNumeric: "tabular-nums",
    },
    "& .ant-picker-input > input::placeholder": { fontWeight: 500, color: t.color.textMuted },
    "& .ant-picker-suffix, & .ant-picker-clear": { color: t.color.textMuted },
  };
}

const clearIcon = (label) => ({ clearIcon: <XCircle size={18} weight="fill" aria-label={label} /> });

const cellMotion = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.96 },
};

function InlineWhen({ mode, date, time, onChange, error, ids }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const post = mode === "post";
  const disabledTime = useDisabledTime(date);
  const errorId = `${ids.date}-error`;
  const dateInvalid = Boolean(error) && !date;
  const timeInvalid = Boolean(error) && !time;

  return (
    <>
      <m.div layout style={{ gridArea: "date", minWidth: 0, display: "flex", flexDirection: "column" }}>
        <FieldSegment
          label={post ? s.date : s.when}
          htmlFor={ids.date}
          error={error}
          errorId={errorId}
          align="start"
          sx={[{ flex: 1 }, pickerSx(t)]}
        >
          <DatePicker
            id={ids.date}
            value={date}
            onChange={(next) => onChange({ date: next || null })}
            format={DATE_FORMAT}
            disabledDate={disabledDate}
            placeholder={post ? RIDE_STRINGS.hero.datePlaceholder : s.whenPlaceholder}
            variant="borderless"
            allowClear={clearIcon(s.clear)}
            suffixIcon={<CalendarBlank size={18} weight="regular" aria-hidden />}
            aria-invalid={dateInvalid || undefined}
            aria-describedby={dateInvalid ? errorId : undefined}
            styles={{ root: { width: "100%", height: 36, paddingInline: 0 } }}
          />
        </FieldSegment>
      </m.div>
      <AnimatePresence initial={false}>
        {post ? (
          <m.div
            key="time"
            layout
            {...cellMotion}
            style={{ gridArea: "time", minWidth: 0, display: "flex", flexDirection: "column" }}
          >
            <FieldSegment label={s.time} htmlFor={ids.time} align="start" sx={[{ flex: 1 }, pickerSx(t)]}>
              <TimePicker
                id={ids.time}
                value={time}
                onChange={(next) => onChange({ time: next || null })}
                format={TIME_FORMAT}
                use12Hours
                minuteStep={5}
                needConfirm={false}
                showNow={false}
                disabledTime={disabledTime}
                placeholder={RIDE_STRINGS.hero.timePickPlaceholder}
                variant="borderless"
                allowClear={clearIcon(s.clear)}
                suffixIcon={<Clock size={18} weight="regular" aria-hidden />}
                aria-invalid={timeInvalid || undefined}
                aria-describedby={timeInvalid ? errorId : undefined}
                styles={{ root: { width: "100%", height: 36, paddingInline: 0 } }}
              />
            </FieldSegment>
          </m.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function QuickDays({ mode, date, onChange }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const days = useMemo(() => {
    const start = dayjs().startOf("day");
    return range(0, QUICK_DAYS).map((offset) => start.add(offset, "day"));
  }, []);

  const chip = (key, selected, onClick, primary, secondary, ariaLabel) => (
    <Box
      key={key}
      component={m.button}
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      sx={{
        flex: "0 0 auto",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 64,
        minHeight: t.layout.controlHeightLg,
        px: 1.5,
        border: `1px solid ${selected ? t.color.action : t.color.border}`,
        borderRadius: `${t.radius.md}px`,
        backgroundColor: selected ? t.color.actionSoft : t.color.surface,
        color: t.color.text,
        font: "inherit",
        cursor: "pointer",
        boxShadow: selected ? `inset 0 -2px 0 ${t.color.action}` : "none",
        "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
      }}
    >
      <Box component="span" sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>
        {primary}
      </Box>
      {secondary ? (
        <Box
          component="span"
          sx={{
            fontSize: 12,
            fontWeight: 550,
            // textMuted fails AA on the selected actionSoft fill.
            color: selected ? t.color.textSecondary : t.color.textMuted,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {secondary}
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Box
      role="group"
      aria-label={RIDE_STRINGS.hero.quickDays}
      sx={{ display: "flex", gap: 1, overflowX: "auto", mx: -2, px: 2, pb: 0.5, scrollPaddingInline: 16 }}
    >
      {mode === "find"
        ? chip("any", !date, () => onChange({ date: null }), s.whenPlaceholder, null, s.whenPlaceholder)
        : null}
      {days.map((day, index) => {
        const label = index < 2 ? formatRideDay(day.format("YYYY-MM-DD")) : day.format("ddd");
        return chip(
          day.format("YYYY-MM-DD"),
          Boolean(date) && date.isSame(day, "day"),
          () => onChange({ date: day }),
          label,
          day.format("D MMM"),
          day.format("dddd, D MMMM")
        );
      })}
    </Box>
  );
}

function SheetWhen({ mode, date, time, onChange, error, ids }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const post = mode === "post";
  const disabledTime = useDisabledTime(date);
  const errorId = `${ids.date}-error`;
  const labelSx = { display: "block", mb: 0.75, fontSize: 13, fontWeight: 650, color: t.color.textSecondary };
  const pickerStyle = { width: "100%", height: t.layout.controlHeightLg, borderRadius: t.radius.md };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, ...pickerSx(t) }}>
      <QuickDays mode={mode} date={date} onChange={onChange} />
      <Box>
        <Box component="label" htmlFor={ids.date} sx={labelSx}>
          {post ? s.date : s.when}
        </Box>
        <DatePicker
          id={ids.date}
          value={date}
          onChange={(next) => onChange({ date: next || null })}
          format={DATE_FORMAT}
          disabledDate={disabledDate}
          placeholder={post ? RIDE_STRINGS.hero.datePlaceholder : s.whenPlaceholder}
          size="large"
          allowClear={clearIcon(s.clear)}
          suffixIcon={<CalendarBlank size={18} weight="regular" aria-hidden />}
          inputReadOnly
          placement="bottomLeft"
          aria-invalid={(Boolean(error) && !date) || undefined}
          aria-describedby={error ? errorId : undefined}
          style={pickerStyle}
        />
      </Box>
      {post ? (
        <Box>
          <Box component="label" htmlFor={ids.time} sx={labelSx}>
            {s.time}
          </Box>
          <TimePicker
            id={ids.time}
            value={time}
            onChange={(next) => onChange({ time: next || null })}
            format={TIME_FORMAT}
            use12Hours
            minuteStep={5}
            needConfirm={false}
            showNow={false}
            disabledTime={disabledTime}
            placeholder={RIDE_STRINGS.hero.timePickPlaceholder}
            size="large"
            allowClear={clearIcon(s.clear)}
            suffixIcon={<Clock size={18} weight="regular" aria-hidden />}
            inputReadOnly
            placement="bottomLeft"
            aria-invalid={(Boolean(error) && !time) || undefined}
            aria-describedby={error ? errorId : undefined}
            style={pickerStyle}
          />
        </Box>
      ) : null}
      <FieldError id={errorId}>{error}</FieldError>
    </Box>
  );
}

/**
 * Date (and, when posting, time) for the hero form.
 * - `variant="inline"` renders grid cells (`gridArea` date / time) for the
 *   desktop and tablet field groups; the time cell enters and leaves in place.
 * - `variant="sheet"` renders the mobile bottom-sheet body with quick day
 *   chips above full-size pickers.
 * `onChange(patch)` receives `{ date }` or `{ time }` as dayjs or null.
 */
export default function WhenField({ mode, date, time, onChange, error, variant = "inline", idPrefix = "rs-hero" }) {
  const ids = { date: `${idPrefix}-date`, time: `${idPrefix}-time` };
  const props = { mode, date, time, onChange, error, ids };
  return variant === "sheet" ? <SheetWhen {...props} /> : <InlineWhen {...props} />;
}

export { DATE_FORMAT, TIME_FORMAT };
