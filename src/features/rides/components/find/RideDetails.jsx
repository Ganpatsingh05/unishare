"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  CarProfile,
  CheckCircle,
  Clock,
  CurrencyInr,
  EnvelopeSimple,
  HourglassMedium,
  InstagramLogo,
  Info,
  Minus,
  Phone,
  Plus,
  Seat,
  X,
} from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { SEAT_LIMITS } from "../../constants/ridePlaces";
import { formatRideDay, formatRideTime, formatRupee } from "../../utils/rideFormat";
import { buildLoginHref, RIDE_ROUTES } from "../../utils/rideLinks";
import PersonAvatar from "../landing/primitives/PersonAvatar";
import RouteLine from "../landing/primitives/RouteLine";
import SeatMeter from "../landing/primitives/SeatMeter";
import { rideAction } from "./ResultCard";

const s = RIDE_STRINGS.find.details;
const MESSAGE_MAX = 300;
const CONTACT_ICONS = { mobile: Phone, phone: Phone, email: EnvelopeSimple, instagram: InstagramLogo };

function Fact({ icon: Icon, label, children }) {
  const t = useRideTokens();
  return (
    <Box sx={{ p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surfaceInteractive, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12.5, fontWeight: 650, color: t.color.textOnInset }}>
        <Icon size={15} weight="duotone" aria-hidden />
        {label}
      </Box>
      <Box sx={{ mt: 0.5, fontSize: 15.5, fontWeight: 700, color: t.color.text, overflowWrap: "anywhere" }}>{children}</Box>
    </Box>
  );
}

function Note({ tone = "info", icon: Icon = Info, children }) {
  const t = useRideTokens();
  const c = t.color;
  const tones = {
    info: { bg: c.actionSoft, fg: c.accentText },
    success: { bg: c.successSoft, fg: c.success },
    warn: { bg: c.driverSoft, fg: t.mode === "dark" ? c.driver : t.brand.inkNavy },
  };
  return (
    <Box role="status" sx={{ display: "flex", gap: 1, alignItems: "flex-start", p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: tones[tone].bg, color: tones[tone].fg, fontSize: 14, fontWeight: 600, lineHeight: 1.45 }}>
      <Icon size={18} weight="fill" aria-hidden style={{ flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </Box>
  );
}

/** Seat count with large, labelled steppers. */
function SeatStepper({ value, max, onChange, labelId }) {
  const t = useRideTokens();
  const btn = { width: 44, height: 44, border: `1px solid ${t.color.border}`, backgroundColor: t.color.surface };
  return (
    <Box role="group" aria-labelledby={labelId} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <IconButton aria-label={RIDE_STRINGS.hero.seatFewer} disabled={value <= 1} onClick={() => onChange(value - 1)} sx={btn}>
        <Minus size={18} aria-hidden />
      </IconButton>
      <Box aria-live="polite" sx={{ minWidth: 28, textAlign: "center", fontSize: 20, fontWeight: 760, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Box>
      <IconButton aria-label={RIDE_STRINGS.hero.seatMore} disabled={value >= max} onClick={() => onChange(value + 1)} sx={btn}>
        <Plus size={18} aria-hidden />
      </IconButton>
    </Box>
  );
}

/** Animated tick drawn when the request goes through. */
function SentMark() {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const draw = reduce ? { initial: false } : { initial: { pathLength: 0 }, animate: { pathLength: 1 } };
  return (
    <Box component="svg" viewBox="0 0 64 64" aria-hidden sx={{ width: 72, height: 72 }}>
      <m.circle cx="32" cy="32" r="28" fill={t.color.successSoft} stroke={t.color.success} strokeWidth="3" {...draw} transition={{ duration: 0.5, ease: t.motion.ease }} />
      <m.path d="M20 33 L28.5 41 L45 24" fill="none" stroke={t.color.success} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" {...draw} transition={{ duration: 0.4, delay: 0.35, ease: t.motion.ease }} />
    </Box>
  );
}

function ContactList({ contactInfo }) {
  const t = useRideTokens();
  const entries = Object.entries(contactInfo || {}).filter(([, value]) => value);
  if (!entries.length) return null;
  return (
    <Box>
      <Box component="h3" sx={{ m: 0, mb: 0.5, fontSize: 15, fontWeight: 700 }}>
        {s.contact}
      </Box>
      <Box sx={{ fontSize: 13, color: t.color.textMuted, mb: 1 }}>{s.contactHint}</Box>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.75 }}>
        {entries.map(([type, value]) => {
          const Icon = CONTACT_ICONS[type] || Info;
          const href = type === "email" ? `mailto:${value}` : type === "mobile" || type === "phone" ? `tel:${value}` : undefined;
          return (
            <Box component="li" key={type} sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 44, fontSize: 15, fontWeight: 600 }}>
              <Icon size={18} weight="duotone" aria-hidden />
              {href ? (
                <Box component="a" href={href} sx={{ color: t.color.accentText, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  {value}
                </Box>
              ) : (
                <span>{value}</span>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/**
 * Ride details with the request step. Right-hand drawer on wider screens,
 * swipeable bottom sheet on phones.
 */
export default function RideDetails({ ride, open, onClose, requestStatus, sending, isAuthenticated, onRequest }) {
  const t = useRideTokens();
  const c = t.color;
  const wide = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const titleId = useId();
  const seatsLabelId = useId();
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Fresh form for each ride.
  useEffect(() => {
    if (!ride) return;
    setSeats(1);
    setMessage(s.messageDefault(ride.from, ride.to));
    setSent(false);
    setError("");
  }, [ride?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ride) return null;
  const action = rideAction(ride, requestStatus);
  const maxSeats = Math.max(1, Math.min(ride.seatsLeft, SEAT_LIMITS.maxFind));
  const canRequest = action.kind === "request";
  const busy = sending === ride.id;
  const loginHref = typeof window === "undefined" ? buildLoginHref(RIDE_ROUTES.find) : buildLoginHref(window.location.pathname + window.location.search);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    const result = await onRequest(ride, { seats, message: message.trim() });
    if (result.success) setSent(true);
    else setError(result.error || RIDE_STRINGS.recent.requestFailed);
  };

  const statusNote = {
    pending: <Note tone="warn" icon={HourglassMedium}>{s.statusPending}</Note>,
    confirmed: <Note tone="success" icon={CheckCircle}>{s.statusConfirmed}</Note>,
    own: <Note>{s.own}</Note>,
    full: <Note>{s.full}</Note>,
  }[action.kind];
  const againNote =
    requestStatus === "declined" ? <Note>{s.statusDeclined}</Note> : requestStatus === "cancelled" ? <Note>{s.statusCancelled}</Note> : null;
  const price = Number.isFinite(ride.price) && ride.price > 0 ? formatRupee(ride.price) : RIDE_STRINGS.find.card.free;

  return (
    <SwipeableDrawer
      anchor={wide ? "right" : "bottom"}
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      disableSwipeToOpen
      disableDiscovery
      slotProps={{
        paper: {
          role: "dialog",
          "aria-modal": true,
          "aria-labelledby": titleId,
          sx: wide
            ? { width: 460, maxWidth: "100%", backgroundColor: c.surface, color: c.text, borderLeft: `1px solid ${c.border}` }
            : {
                maxHeight: "92vh",
                borderTopLeftRadius: `${t.radius.xl}px`,
                borderTopRightRadius: `${t.radius.xl}px`,
                backgroundColor: c.surface,
                color: c.text,
                pb: "env(safe-area-inset-bottom)",
              },
        },
      }}
    >
      {!wide ? <Box aria-hidden sx={{ width: 40, height: 5, borderRadius: 3, backgroundColor: c.borderStrong, mx: "auto", mt: 1.25 }} /> : null}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 2.5, pt: wide ? 2.5 : 1.5, pb: 1 }}>
        <Box component="h2" id={titleId} sx={{ m: 0, fontSize: 19, fontWeight: 760, letterSpacing: "-0.01em" }}>
          {sent ? s.sentTitle : s.title}
        </Box>
        <IconButton aria-label={s.close} onClick={onClose} sx={{ width: 44, height: 44 }}>
          <X size={20} aria-hidden />
        </IconButton>
      </Box>

      <Box sx={{ px: 2.5, pb: 3, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2.25 }}>
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <Box
              key="sent"
              component={m.div}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.5, py: 3 }}
            >
              <SentMark />
              <Box sx={{ fontSize: 15.5, color: c.textSecondary, maxWidth: 340, lineHeight: 1.5 }}>{s.sentBody(ride.driverName)}</Box>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center", mt: 1 }}>
                <Button component={Link} href={`${RIDE_ROUTES.manage}?tab=joining`} variant="outlined" sx={{ minHeight: 48 }}>
                  {s.viewRequests}
                </Button>
                <Button variant="contained" onClick={onClose} sx={{ minHeight: 48 }}>
                  {s.done}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box key="details" component={m.div} initial={false} exit={{ opacity: 0 }} sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
              <Box sx={{ p: 2, borderRadius: `${t.radius.lg}px`, border: `1px solid ${c.border}`, backgroundColor: c.surfaceAlt }}>
                <RouteLine from={ride.from} to={ride.to} clamp={3} />
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1 }}>
                <Fact icon={Clock} label={s.departs}>
                  {formatRideDay(ride.date)}, {formatRideTime(ride.date, ride.time)}
                </Fact>
                <Fact icon={CurrencyInr} label={s.price}>
                  {price}
                </Fact>
                <Fact icon={Seat} label={s.seats}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <SeatMeter left={ride.seatsLeft} total={ride.seatsTotal} size="sm" showLabel={false} />
                    {`${ride.seatsLeft} / ${ride.seatsTotal}`}
                  </Box>
                </Fact>
                <Fact icon={CarProfile} label={s.vehicle}>
                  {ride.vehicle || s.vehicleUnknown}
                </Fact>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <PersonAvatar name={ride.driverName} src={ride.driverAvatar} size={44} decorative />
                <Box sx={{ minWidth: 0 }}>
                  <Box sx={{ fontSize: 12.5, fontWeight: 650, color: c.textMuted }}>{s.driver}</Box>
                  <Box sx={{ fontSize: 16, fontWeight: 700, overflowWrap: "anywhere" }}>{ride.driverName}</Box>
                </Box>
              </Box>

              {ride.description ? (
                <Box>
                  <Box component="h3" sx={{ m: 0, mb: 0.5, fontSize: 15, fontWeight: 700 }}>
                    {s.notes}
                  </Box>
                  <Box sx={{ fontSize: 15, lineHeight: 1.55, color: c.textSecondary, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
                    {ride.description}
                  </Box>
                </Box>
              ) : null}

              {statusNote}
              {action.kind === "confirmed" ? <ContactList contactInfo={ride.contactInfo} /> : null}

              {canRequest ? (
                <Box component="form" onSubmit={submit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
                  {againNote}
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                    <Box id={seatsLabelId} sx={{ fontSize: 15, fontWeight: 700 }}>
                      {s.seatsToRequest}
                    </Box>
                    <SeatStepper value={seats} max={maxSeats} onChange={setSeats} labelId={seatsLabelId} />
                  </Box>
                  <TextField
                    label={s.message}
                    helperText={`${s.messageHint} ${message.length}/${MESSAGE_MAX}`}
                    value={message}
                    onChange={(event) => setMessage(event.target.value.slice(0, MESSAGE_MAX))}
                    multiline
                    minRows={3}
                    fullWidth
                    slotProps={{ htmlInput: { maxLength: MESSAGE_MAX } }}
                  />
                  {error ? (
                    <Box role="alert" sx={{ color: c.danger, fontSize: 14, fontWeight: 600 }}>
                      {error}
                    </Box>
                  ) : null}
                  {isAuthenticated ? (
                    <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>
                      {busy ? s.sending : s.send(seats)}
                    </Button>
                  ) : (
                    <Button component={Link} href={loginHref} variant="contained" size="large" sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>
                      {s.signIn}
                    </Button>
                  )}
                </Box>
              ) : null}
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </SwipeableDrawer>
  );
}
