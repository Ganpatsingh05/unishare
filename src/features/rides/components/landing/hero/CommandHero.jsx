"use client";

import { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowsDownUp,
  CalendarBlank,
  CaretRight,
  CheckCircle,
  CircleNotch,
  MagnifyingGlass,
  WarningCircle,
} from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { buildFindHref, buildPostHref } from "../../../utils/rideLinks";
import Panel from "../primitives/Panel";
import ModeSwitch from "./ModeSwitch";
import PlaceField, { FieldError, PlacePicker, StopGlyph } from "./PlaceField";
import WhenField, { DATE_FORMAT, TIME_FORMAT } from "./WhenField";
import SeatsField, { clampSeats } from "./SeatsField";
import FieldSheet from "./FieldSheet";
import HeroAccent from "./HeroAccent";
import useResolvedRoute from "../../../hooks/useResolvedRoute";

// The route map (Leaflet + tiles) is the heaviest part of the page, so
// it is code-split and never server-rendered. Its slot keeps a fixed size.
const RouteMap = dynamic(() => import("./RouteMap"), {
  ssr: false,
  loading: () => <Box aria-hidden sx={{ width: "100%", height: "100%" }} />,
});

const s = RIDE_STRINGS.hero;

const IDS = {
  title: "rs-hero-title",
  hint: "rs-hero-post-hint",
  from: "rs-hero-from",
  to: "rs-hero-to",
  date: "rs-hero-date",
  seats: "rs-hero-seats",
};

const ROW_IDS = { from: "rs-hero-from-row", to: "rs-hero-to-row", when: "rs-hero-when-row" };

const FIELD_ORDER = ["from", "to", "when"];

const noop = () => {};

function validatePost(form) {
  const from = form.from.trim();
  const to = form.to.trim();
  const errors = {};
  if (!from) errors.from = s.requiredFrom;
  if (!to) errors.to = s.requiredTo;
  else if (from && from.toLowerCase() === to.toLowerCase()) errors.to = s.samePlace;
  if (!form.date || !form.time) errors.when = s.requiredWhen;
  return errors;
}

function groupSx(t) {
  // 1px gaps over a border-coloured fill draw the hairlines between cells.
  return {
    display: "grid",
    gap: "1px",
    minWidth: 0,
    backgroundColor: t.color.border,
    border: `1px solid ${t.color.border}`,
    borderRadius: `${t.radius.md}px`,
    overflow: "hidden",
  };
}

function VerifyLine({ t, label, state, text }) {
  const value = text.trim();
  if (!value || state.status === "empty") return null;
  let icon = <CircleNotch size={16} aria-hidden />;
  let message = RIDE_STRINGS.stage.checking(value);
  let color = t.color.textMuted;
  if (state.status === "verified" && state.place) {
    icon = <CheckCircle size={16} weight="fill" aria-hidden />;
    message = RIDE_STRINGS.stage.verified(state.place.label, state.place.detail);
    color = t.color.success;
  } else if (state.status === "notfound") {
    icon = <WarningCircle size={16} weight="fill" aria-hidden />;
    message = RIDE_STRINGS.stage.notFound(value);
    color = t.color.warning;
  } else if (state.status === "error") {
    icon = <WarningCircle size={16} weight="fill" aria-hidden />;
    message = RIDE_STRINGS.stage.lookupFailed;
    color = t.color.warning;
  }
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, fontSize: 13, lineHeight: 1.4, color }}>
      <Box component="span" sx={{ display: "inline-flex", mt: "1px", flexShrink: 0 }}>
        {icon}
      </Box>
      <Box component="span" sx={{ minWidth: 0, wordBreak: "break-word" }}>
        <Box component="span" sx={{ fontWeight: 700 }}>
          {label}:
        </Box>{" "}
        {message}
      </Box>
    </Box>
  );
}

/** Live verification of the typed places, announced politely. */
function VerifyNotes({ form, resolved }) {
  const t = useRideTokens();
  const showFrom = form.from.trim() && resolved.origin.status !== "default";
  const showTo = form.to.trim();
  return (
    <Box role="status" aria-live="polite" sx={{ display: "grid", gap: 0.5, minHeight: 0, "&:empty": { display: "none" } }}>
      {showFrom ? <VerifyLine t={t} label={s.from} state={resolved.origin} text={form.from} /> : null}
      {showTo ? <VerifyLine t={t} label={s.to} state={resolved.destination} text={form.to} /> : null}
    </Box>
  );
}

function HeroHeading({ mode }) {
  const t = useRideTokens();
  const reduceMotion = useReducedMotion();
  const post = mode === "post";
  const swapTransition = reduceMotion ? { duration: 0 } : { duration: t.motion.duration.base, ease: t.motion.ease };
  const enter = reduceMotion ? false : { opacity: 0, y: 10 };

  return (
    <Box
      sx={{
        mb: { xs: 2, md: 3, lg: 4 },
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) minmax(280px, 400px)" },
        alignItems: "end",
        columnGap: 6,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Box
          component="h1"
          id={IDS.title}
          sx={{
            m: 0,
            minHeight: "2.1em",
            // The accent line is drawn from Geist outlines, so the whole headline is set in Geist.
            fontFamily: t.typography.family,
            fontSize: { xs: "clamp(30px, 8.6vw, 34px)", sm: 46, md: 54, lg: 58 },
            lineHeight: 1.05,
            fontWeight: t.typography.displayWeight,
            letterSpacing: t.typography.displayTracking,
            color: t.color.text,
            textWrap: "balance",
            wordBreak: "break-word",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <m.span
              key={mode}
              initial={enter}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
              transition={swapTransition}
              style={{ display: "block" }}
            >
              <span style={{ display: "block" }}>{post ? s.titlePost : s.titleFind}</span>
              <HeroAccent text={post ? s.titlePostAccent : s.titleFindAccent} />
            </m.span>
          </AnimatePresence>
        </Box>
      </Box>
      <Box
        component="p"
        sx={{
          m: 0,
          mt: { xs: 1.5, md: 2, lg: 0 },
          mb: { lg: 1 },
          maxWidth: 560,
          minHeight: "3em",
          fontSize: { xs: 15, md: 17 },
          lineHeight: 1.5,
          color: t.color.textSecondary,
          textWrap: "pretty",
          // Side-by-side on desktop: a short braided-ribbon rule anchors the lead.
          "&::before": {
            content: '""',
            display: { xs: "none", lg: "block" },
            width: 40,
            height: 7,
            mb: 1.5,
            background: `linear-gradient(${t.color.rider}, ${t.color.rider}) top / 100% 2px no-repeat, linear-gradient(${t.color.driver}, ${t.color.driver}) bottom / 100% 2px no-repeat`,
          },
        }}
      >
        {post ? s.leadPost : s.leadFind}
      </Box>
    </Box>
  );
}

function SwapButton({ onSwap }) {
  const t = useRideTokens();
  const [turns, setTurns] = useState(0);
  return (
    <IconButton
      component={m.button}
      whileTap={{ scale: 0.97 }}
      type="button"
      aria-label={s.swap}
      onClick={() => {
        setTurns((n) => n + 1);
        onSwap();
      }}
      sx={{
        border: `1px solid ${t.color.border}`,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: t.color.surface,
        boxShadow: t.elevation[1],
      }}
    >
      <Box component="span" sx={{ display: "inline-flex", transform: { sm: "rotate(90deg)", md: "none" } }}>
        <m.span
          animate={{ rotate: turns * 180 }}
          transition={t.motion.springSnappy}
          style={{ display: "inline-flex" }}
        >
          <ArrowsDownUp size={20} weight="regular" aria-hidden />
        </m.span>
      </Box>
    </IconButton>
  );
}

function SubmitArea({ mode, pending }) {
  const t = useRideTokens();
  const post = mode === "post";
  return (
    <m.div layout="position">
      <Button
        component={m.button}
        whileTap={{ scale: 0.97 }}
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        aria-busy={pending || undefined}
        aria-describedby={post ? IDS.hint : undefined}
        startIcon={post ? undefined : <MagnifyingGlass size={20} weight="regular" aria-hidden />}
        endIcon={post ? <ArrowRight size={20} weight="regular" aria-hidden /> : undefined}
        sx={{ opacity: pending ? 0.85 : 1 }}
      >
        {post ? s.submitPost : s.submitFind}
      </Button>
      <AnimatePresence initial={false}>
        {post ? (
          <m.p
            key="hint"
            id={IDS.hint}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              margin: 0,
              marginTop: t.space(2.5),
              fontSize: 13,
              lineHeight: 1.45,
              textAlign: "center",
              color: t.color.textMuted,
            }}
          >
            {s.postHint}
          </m.p>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}

/** Desktop and tablet fields: route group, timing group, submit. */
function InlineFields({ form, onFormChange, rides, errors, onSwap }) {
  const t = useRideTokens();
  const post = form.mode === "post";
  const timingAreas = post
    ? { sm: '"date time seats"', md: '"date time" "seats seats"' }
    : { sm: '"date seats"', md: '"date seats"' };
  const timingColumns = post
    ? { sm: "minmax(0, 1fr) minmax(0, 1fr) auto", md: "minmax(0, 1fr) minmax(0, 1fr)" }
    : { sm: "minmax(0, 1fr) auto", md: "minmax(0, 1fr) auto" };

  return (
    <>
      <Box
        sx={{
          ...groupSx(t),
          gridTemplateAreas: { xs: '"from swap" "to swap"', sm: '"from swap to"', md: '"from swap" "to swap"' },
          gridTemplateColumns: {
            xs: "minmax(0, 1fr) auto",
            sm: "minmax(0, 1fr) auto minmax(0, 1fr)",
            md: "minmax(0, 1fr) auto",
          },
        }}
      >
        <Box sx={{ gridArea: "from", minWidth: 0, display: "flex", flexDirection: "column", "& > *": { flex: 1 } }}>
          <PlaceField
            field="from"
            id={IDS.from}
            value={form.from}
            onChange={(from) => onFormChange({ from })}
            otherValue={form.to}
            rides={rides}
            error={errors.from}
            connector="down"
          />
        </Box>
        <Box
          sx={{
            gridArea: "swap",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 0.75,
            backgroundColor: t.color.surface,
          }}
        >
          <SwapButton onSwap={onSwap} />
        </Box>
        <Box sx={{ gridArea: "to", minWidth: 0, display: "flex", flexDirection: "column", "& > *": { flex: 1 } }}>
          <PlaceField
            field="to"
            id={IDS.to}
            value={form.to}
            onChange={(to) => onFormChange({ to })}
            otherValue={form.from}
            rides={rides}
            error={errors.to}
            connector="up"
          />
        </Box>
      </Box>

      <Box
        component={m.div}
        layout
        sx={{ ...groupSx(t), gridTemplateAreas: timingAreas, gridTemplateColumns: timingColumns }}
      >
        <WhenField
          mode={form.mode}
          date={form.date}
          time={form.time}
          onChange={onFormChange}
          error={errors.when}
        />
        <m.div layout style={{ gridArea: "seats", minWidth: 0 }}>
          <SeatsField mode={form.mode} value={form.seats} onChange={(seats) => onFormChange({ seats })} id={IDS.seats} />
        </m.div>
      </Box>
    </>
  );
}

function SheetRow({ id, label, value, placeholder, leading, onOpen, error, errorId }) {
  const t = useRideTokens();
  const filled = Boolean(value);
  return (
    <Box sx={{ minWidth: 0, backgroundColor: t.color.surface }}>
      <Box
        component={m.button}
        whileTap={{ scale: 0.99 }}
        type="button"
        id={id}
        onClick={onOpen}
        aria-haspopup="dialog"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
          width: "100%",
          minHeight: t.layout.controlHeightLg,
          px: 1.5,
          py: 0.75,
          border: 0,
          background: "none",
          font: "inherit",
          textAlign: "left",
          color: t.color.text,
          cursor: "pointer",
          boxShadow: error ? `inset 0 0 0 1.5px ${t.color.danger}` : "none",
          "&:active": { backgroundColor: t.color.surfaceInteractive },
          "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: -2 },
        }}
      >
        <Box aria-hidden sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, flexShrink: 0, color: t.color.textMuted }}>
          {leading}
        </Box>
        <Box component="span" sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <Box component="span" sx={{ fontSize: 12.5, fontWeight: 650, lineHeight: 1.4, color: t.color.textSecondary }}>
            {label}
          </Box>
          <Box
            component="span"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
              fontSize: filled ? 16 : 15,
              fontWeight: filled ? 650 : 500,
              lineHeight: 1.35,
              color: filled ? t.color.text : t.color.textMuted,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {filled ? value : placeholder}
          </Box>
        </Box>
        <Box component="span" sx={{ display: "inline-flex", flexShrink: 0, color: t.color.textMuted }}>
          <CaretRight size={18} weight="regular" aria-hidden />
        </Box>
      </Box>
      {error ? (
        <Box sx={{ px: 1.5, pb: 1 }}>
          <FieldError id={errorId}>{error}</FieldError>
        </Box>
      ) : null}
    </Box>
  );
}

/** Mobile fields: tappable rows that open bottom sheets, inline seat stepper. */
function CompactFields({ form, onFormChange, rides, errors, onSwap }) {
  const t = useRideTokens();
  const [sheet, setSheet] = useState({ kind: null, open: false });
  const [draft, setDraft] = useState("");
  const post = form.mode === "post";
  const placeSheet = sheet.kind === "from" || sheet.kind === "to";

  const open = (kind) => {
    if (kind === "from" || kind === "to") setDraft(form[kind]);
    setSheet({ kind, open: true });
  };
  const close = () => {
    if (placeSheet && sheet.open) onFormChange({ [sheet.kind]: draft.trim() });
    setSheet((prev) => ({ ...prev, open: false }));
  };
  const accept = (value) => {
    onFormChange({ [sheet.kind]: value.trim() });
    setSheet((prev) => ({ ...prev, open: false }));
  };

  const whenValue = form.date
    ? [form.date.format(DATE_FORMAT), post && form.time ? form.time.format(TIME_FORMAT) : null].filter(Boolean).join(", ")
    : "";
  const sheetTitle = { from: s.from, to: s.to, when: s.when }[sheet.kind] || "";

  return (
    <>
      <Box sx={{ ...groupSx(t), gridTemplateAreas: '"from swap" "to swap"', gridTemplateColumns: "minmax(0, 1fr) auto" }}>
        <Box sx={{ gridArea: "from", minWidth: 0 }}>
          <SheetRow
            id={ROW_IDS.from}
            label={s.from}
            value={form.from}
            placeholder={s.fromPlaceholder}
            leading={<StopGlyph kind="origin" />}
            onOpen={() => open("from")}
            error={errors.from}
            errorId={`${IDS.from}-error`}
          />
        </Box>
        <Box sx={{ gridArea: "swap", display: "flex", alignItems: "center", px: 0.25, backgroundColor: t.color.surface }}>
          <SwapButton onSwap={onSwap} />
        </Box>
        <Box sx={{ gridArea: "to", minWidth: 0 }}>
          <SheetRow
            id={ROW_IDS.to}
            label={s.to}
            value={form.to}
            placeholder={s.toPlaceholder}
            leading={<StopGlyph kind="destination" />}
            onOpen={() => open("to")}
            error={errors.to}
            errorId={`${IDS.to}-error`}
          />
        </Box>
      </Box>

      <Box component={m.div} layout sx={{ ...groupSx(t), gridTemplateColumns: "minmax(0, 1fr)" }}>
        <SheetRow
          id={ROW_IDS.when}
          label={s.when}
          value={whenValue}
          placeholder={post ? RIDE_STRINGS.hero.whenPostPlaceholder : s.whenPlaceholder}
          leading={<CalendarBlank size={20} weight="regular" aria-hidden />}
          onOpen={() => open("when")}
          error={errors.when}
          errorId={`${IDS.date}-error`}
        />
        <Box sx={{ px: 1.5, backgroundColor: t.color.surface }}>
          <SeatsField
            mode={form.mode}
            value={form.seats}
            onChange={(seats) => onFormChange({ seats })}
            layout="row"
            id={IDS.seats}
          />
        </Box>
      </Box>

      <FieldSheet open={sheet.open} onClose={close} onOpen={noop} title={sheetTitle}>
        {placeSheet ? (
          <PlacePicker
            key={sheet.kind}
            field={sheet.kind}
            value={draft}
            onChange={setDraft}
            onAccept={accept}
            otherValue={sheet.kind === "from" ? form.to : form.from}
            rides={rides}
            inputId={`${IDS[sheet.kind]}-sheet`}
          />
        ) : null}
        {sheet.kind === "when" ? (
          <WhenField
            variant="sheet"
            idPrefix="rs-hero-sheet"
            mode={form.mode}
            date={form.date}
            time={form.time}
            onChange={onFormChange}
            error={errors.when}
          />
        ) : null}
      </FieldSheet>
    </>
  );
}

/**
 * Hero command surface: mode-aware headline, the Find / Post form and the
 * route map. Form state lives in the parent (`form`, `onFormChange(patch)`).
 * - >= 900px: one panel, form (5/12) beside the lazy route map (7/12).
 * - 600-899px: map on top (300px), fields below in two columns.
 * - < 600px: compact panel headed by the route strip, with sheet-opening rows.
 */
export default function CommandHero({ form, onFormChange, rides = [] }) {
  const t = useRideTokens();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showErrors, setShowErrors] = useState(false);
  // Mobile-first before hydration: false on the server and first client render.
  const isWide = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const resolved = useResolvedRoute(form.from, form.to);

  const post = form.mode === "post";
  const errors = showErrors && post ? validatePost(form) : {};

  const changeMode = (mode) => {
    setShowErrors(false);
    onFormChange({ mode, seats: clampSeats(form.seats, mode) });
  };
  const swap = () => onFormChange({ from: form.to, to: form.from });

  const onSubmit = (event) => {
    event.preventDefault();
    const from = form.from.trim();
    const to = form.to.trim();
    if (!post) {
      const href = buildFindHref({ from, to, date: form.date?.format("YYYY-MM-DD"), seats: form.seats });
      startTransition(() => router.push(href));
      return;
    }
    const nextErrors = validatePost(form);
    const first = FIELD_ORDER.find((key) => nextErrors[key]);
    if (first) {
      setShowErrors(true);
      const target = isWide ? { from: IDS.from, to: IDS.to, when: IDS.date }[first] : ROW_IDS[first];
      window.requestAnimationFrame(() => document.getElementById(target)?.focus());
      return;
    }
    const href = buildPostHref({
      from,
      to,
      date: form.date.format("YYYY-MM-DD"),
      time: form.time.format("HH:mm"),
      seats: form.seats,
    });
    startTransition(() => router.push(href));
  };

  const fieldProps = { form, onFormChange, rides, errors, onSwap: swap };

  return (
    <Box component="section" aria-labelledby={IDS.title} sx={{ position: "relative", minWidth: 0 }}>
      <HeroHeading mode={form.mode} />

      <Panel
        radius="xl"
        sx={{
          boxShadow: t.elevation[3],
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 5fr) minmax(0, 7fr)" },
          gap: { xs: 0, sm: 1, md: 0 },
          p: 1.5,
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={onSubmit}
          aria-label={post ? s.modePost : s.modeFind}
          sx={{
            order: 0,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 0, sm: 1.5, md: 2.5, lg: 3.5 },
          }}
        >
          <ModeSwitch value={form.mode} onChange={changeMode} />
          <Box component={m.div} layout sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.5, sm: 2 }, minWidth: 0 }}>
            {isWide ? <InlineFields {...fieldProps} /> : <CompactFields {...fieldProps} />}
          </Box>
          <VerifyNotes form={form} resolved={resolved} />
          <Box sx={{ mt: { xs: 0.5, md: 1 } }}>
            <SubmitArea mode={form.mode} pending={pending} />
          </Box>
        </Box>
        {/* The route map: heads the panel on phones and tablets, sits beside the form on desktop. */}
        <Box
          sx={{
            order: { xs: -1, md: 0 },
            height: { xs: 260, sm: 300, md: "auto" },
            minHeight: { md: 460 },
            mb: { xs: 1.5, sm: 0 },
            minWidth: 0,
          }}
        >
          <Panel variant="inset" radius="lg" sx={{ height: "100%", overflow: "hidden" }}>
            <RouteMap
              preview={resolved.preview}
              origin={resolved.origin}
              destination={resolved.destination}
              route={resolved.route}
              routeStatus={resolved.routeStatus}
              toText={form.to}
              compact={!isWide}
            />
          </Panel>
        </Box>

      </Panel>
    </Box>
  );
}
