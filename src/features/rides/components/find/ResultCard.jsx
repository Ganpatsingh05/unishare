"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { m } from "framer-motion";
import { CarProfile, CheckCircle, Clock, HourglassMedium, ProhibitInset, UserCircle } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRideDay, formatRideTime, formatRupee } from "../../utils/rideFormat";
import PersonAvatar from "../landing/primitives/PersonAvatar";
import RouteLine from "../landing/primitives/RouteLine";
import SeatMeter from "../landing/primitives/SeatMeter";

const s = RIDE_STRINGS.find.card;

/** What the card's action shows for the user's relation to this ride. */
export function rideAction(ride, requestStatus) {
  if (ride.isOwn) return { kind: "own", label: s.yours, icon: UserCircle };
  if (requestStatus === "pending") return { kind: "pending", label: s.pending, icon: HourglassMedium };
  if (requestStatus === "confirmed") return { kind: "confirmed", label: s.confirmed, icon: CheckCircle };
  if (ride.seatsLeft <= 0) return { kind: "full", label: s.full, icon: ProhibitInset };
  const again = requestStatus === "declined" || requestStatus === "cancelled";
  return { kind: "request", label: again ? s.requestAgain : s.request, icon: null };
}

function StatusPill({ action, t }) {
  const tone = {
    own: { bg: t.color.surfaceInteractive, fg: t.color.textOnInset },
    pending: { bg: t.color.driverSoft, fg: t.mode === "dark" ? t.color.driver : t.brand.inkNavy },
    confirmed: { bg: t.color.successSoft, fg: t.color.success },
    full: { bg: t.color.surfaceInteractive, fg: t.color.textOnInset },
  }[action.kind];
  const Icon = action.icon;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        minHeight: 36,
        px: 1.5,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: tone.bg,
        color: tone.fg,
        fontSize: 13.5,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={16} weight="fill" aria-hidden />
      {action.label}
    </Box>
  );
}

/**
 * One search result: a ticket with the departure stub on the left, the route
 * and driver in the middle and the fare on the right. Hovering or focusing
 * anywhere in it shows its route on the map.
 */
const ResultCard = forwardRef(function ResultCard(
  { ride, tier, showMatch = true, requestStatus, selected, onSelect, onOpen, headingId, placeholders },
  ref
) {
  const t = useRideTokens();
  const c = t.color;
  const day = placeholders?.day ?? formatRideDay(ride.date);
  // Placeholders stand in for values not chosen yet (the Post page preview).
  const time = placeholders?.time ?? formatRideTime(ride.date, ride.time);
  // "11:20 pm": the clock is the headline, the meridiem rides small beside it.
  const [clock, meridiem = ""] = time.split(" ");
  const action = rideAction(ride, requestStatus);
  const price = Number.isFinite(ride.price) && ride.price > 0 ? formatRupee(ride.price) : placeholders?.fare ?? s.free;
  const exact = tier === "exact";

  return (
    <Box
      ref={ref}
      component={m.article}
      layout="position"
      aria-labelledby={headingId}
      onMouseEnter={() => onSelect(ride.id)}
      onFocus={() => onSelect(ride.id)}
      whileHover={{ y: -2 }}
      transition={t.motion.spring}
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: { xs: "84px minmax(0, 1fr)", sm: "112px minmax(0, 1fr) auto" },
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: c.surface,
        border: `1px solid ${selected ? c.action : c.border}`,
        boxShadow: selected ? `0 0 0 3px ${c.actionSoftStrong}, ${t.elevation[2]}` : t.elevation[1],
        transition: "border-color 160ms ease, box-shadow 200ms ease",
        overflow: "hidden",
        "&:focus-within": { borderColor: c.action },
      }}
    >
      {/* Departure stub, cut from the ticket by a dashed seam. */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0.5,
          px: { xs: 1.5, sm: 2 },
          py: 2,
          backgroundColor: exact && showMatch ? c.actionSoft : c.surfaceAlt,
          borderRight: `1.5px dashed ${c.border}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4, whiteSpace: "nowrap", color: c.text }}>
          <Box component="span" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 760, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            {clock}
          </Box>
          <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: c.textSecondary, textTransform: "uppercase" }}>
            {meridiem}
          </Box>
        </Box>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 13, fontWeight: 650, color: c.textSecondary }}>
          <Clock size={14} aria-hidden />
          {day}
        </Box>
      </Box>

      <Box sx={{ minWidth: 0, p: { xs: 1.75, sm: 2.25 }, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box component="h3" id={headingId} sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", m: 0 }}>
          {s.heading(ride.from, ride.to, day, time)}
        </Box>
        {showMatch ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1,
              py: 0.25,
              borderRadius: `${t.radius.pill}px`,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.02em",
              backgroundColor: exact ? c.actionSoftStrong : c.surfaceInteractive,
              color: exact ? c.accentText : c.textOnInset,
            }}
          >
            {exact ? RIDE_STRINGS.find.match.exact : RIDE_STRINGS.find.match.close}
          </Box>
        </Box>
        ) : null}
        <RouteLine from={ride.from} to={ride.to} dense />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, flexWrap: "wrap" }}>
          <PersonAvatar name={ride.driverName} src={ride.driverAvatar} size={30} decorative />
          <Box sx={{ minWidth: 0, flex: "1 1 120px" }}>
            <Box sx={{ fontSize: 14, fontWeight: 650, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {ride.driverName}
            </Box>
            {ride.vehicle ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 12.5, color: c.textMuted, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
                <CarProfile size={14} aria-hidden />
                {ride.vehicle}
              </Box>
            ) : null}
          </Box>
          <SeatMeter left={ride.seatsLeft} total={ride.seatsTotal} size="sm" />
        </Box>
        {/* Phones: fare and action sit under the route. */}
        <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Fare price={price} t={t} />
          <Actions action={action} onOpen={() => onOpen(ride)} t={t} />
        </Box>
      </Box>

      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1.5,
          p: 2.25,
          pl: 0,
          minWidth: 168,
        }}
      >
        <Fare price={price} t={t} align="right" />
        <Actions action={action} onOpen={() => onOpen(ride)} t={t} />
      </Box>
    </Box>
  );
});

function Fare({ price, t, align = "left" }) {
  return (
    <Box sx={{ textAlign: align }}>
      <Box sx={{ fontSize: 22, fontWeight: 760, letterSpacing: "-0.02em", color: t.color.text, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
        {price}
      </Box>
      <Box sx={{ fontSize: 12.5, color: t.color.textMuted }}>{s.perSeat}</Box>
    </Box>
  );
}

function Actions({ action, onOpen, t }) {
  if (action.kind === "request") {
    return (
      <Button variant="contained" onClick={onOpen} sx={{ minHeight: 44, px: 2.25, borderRadius: `${t.radius.pill}px`, whiteSpace: "nowrap" }}>
        {action.label}
      </Button>
    );
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      <StatusPill action={action} t={t} />
      <Button variant="text" onClick={onOpen} sx={{ minHeight: 44, minWidth: 0, px: 1.25 }}>
        {s.details}
      </Button>
    </Box>
  );
}

export default ResultCard;

/** Placeholder with the card's footprint while rides load. */
export function ResultCardSkeleton() {
  const t = useRideTokens();
  const bar = (w, h = 14) => (
    <Box
      sx={{
        width: w,
        height: h,
        borderRadius: `${t.radius.xs}px`,
        backgroundColor: t.color.surfaceInteractive,
        "@keyframes rsPulse": { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.55 } },
        animation: "rsPulse 1.4s ease-in-out infinite",
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    />
  );
  return (
    <Box
      aria-hidden
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "84px minmax(0, 1fr)", sm: "112px minmax(0, 1fr) auto" },
        minHeight: { xs: 196, sm: 158 },
        borderRadius: `${t.radius.lg}px`,
        border: `1px solid ${t.color.border}`,
        backgroundColor: t.color.surface,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, justifyContent: "center", borderRight: `1.5px dashed ${t.color.border}`, backgroundColor: t.color.surfaceAlt }}>
        {bar(58, 22)}
        {bar(44)}
      </Box>
      <Box sx={{ p: 2.25, display: "flex", flexDirection: "column", gap: 1.25 }}>
        {bar(90, 18)}
        {bar("70%", 16)}
        {bar("55%", 16)}
        {bar("40%")}
      </Box>
      <Box sx={{ display: { xs: "none", sm: "flex" }, p: 2.25, flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
        {bar(64, 22)}
        {bar(120, 40)}
      </Box>
    </Box>
  );
}
