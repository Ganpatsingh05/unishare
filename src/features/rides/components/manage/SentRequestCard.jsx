"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { m } from "framer-motion";
import { CheckCircle, Clock, HourglassMedium, Prohibit, XCircle } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRideDay, formatRideTime, formatRupee } from "../../utils/rideFormat";
import { buildFindHref } from "../../utils/rideLinks";
import PersonAvatar from "../landing/primitives/PersonAvatar";
import RouteLine from "../landing/primitives/RouteLine";

const s = RIDE_STRINGS.my.joining;
const STATUS_ICONS = { pending: HourglassMedium, confirmed: CheckCircle, declined: XCircle, cancelled: Prohibit };

/** Status pill: icon, colour and word, so it never relies on colour alone. */
export function StatusPill({ status }) {
  const t = useRideTokens();
  const c = t.color;
  const tone = {
    pending: { bg: c.driverSoft, fg: t.mode === "dark" ? c.driver : t.brand.inkNavy },
    confirmed: { bg: c.successSoft, fg: c.success },
    declined: { bg: c.dangerSoft, fg: c.danger },
    cancelled: { bg: c.surfaceInteractive, fg: c.textOnInset },
  }[status] || { bg: c.surfaceInteractive, fg: c.textOnInset };
  const Icon = STATUS_ICONS[status] || HourglassMedium;
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, minHeight: 28, px: 1.25, borderRadius: `${t.radius.pill}px`, backgroundColor: tone.bg, color: tone.fg, fontSize: 13, fontWeight: 760, whiteSpace: "nowrap" }}>
      <Icon size={15} weight="fill" aria-hidden />
      {s.status[status] || status}
    </Box>
  );
}

/** A seat I asked for on someone else's ride. */
export default function SentRequestCard({ request, bucket, onCancel }) {
  const t = useRideTokens();
  const c = t.color;
  const { ride } = request;
  const day = formatRideDay(ride.date);
  const time = formatRideTime(ride.date, ride.time);
  const findHref = buildFindHref({ from: ride.from, to: ride.to });
  const price = Number.isFinite(ride.price) && ride.price > 0 ? formatRupee(ride.price) : null;

  return (
    <Box
      component={m.article}
      layout="position"
      aria-label={RIDE_STRINGS.find.card.heading(ride.from, ride.to, day, time)}
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) auto" },
        gap: 2,
        p: { xs: 1.75, sm: 2.25 },
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: c.surface,
        border: `1px solid ${request.status === "confirmed" && bucket === "upcoming" ? c.success : c.border}`,
        boxShadow: t.elevation[1],
      }}
    >
      <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <StatusPill status={request.status} />
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 13.5, fontWeight: 650, color: c.textSecondary }}>
            <Clock size={15} aria-hidden />
            {day}, {time}
          </Box>
        </Box>
        <RouteLine from={ride.from} to={ride.to} dense />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
          <PersonAvatar name={request.hostName} src={request.hostAvatar} size={30} decorative />
          <Box sx={{ fontSize: 14, fontWeight: 650, color: c.text, minWidth: 0 }}>{s.hostedBy(request.hostName)}</Box>
          <Box sx={{ fontSize: 13, color: c.textMuted, flexBasis: { xs: "100%", sm: "auto" } }}>
            {[s.seats(request.seats), price ? `${price} ${RIDE_STRINGS.find.card.perSeat}` : null].filter(Boolean).join(" · ")}
          </Box>
        </Box>
        <Box sx={{ fontSize: 13, color: c.textMuted }}>{s.statusHint[request.status]}</Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "row", sm: "column" }, alignItems: { xs: "center", sm: "flex-end" }, justifyContent: { sm: "center" }, gap: 1, flexWrap: "wrap" }}>
        {bucket === "upcoming" && request.status === "pending" ? (
          <Button variant="outlined" color="error" onClick={() => onCancel(request)} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
            {s.cancel}
          </Button>
        ) : null}
        <Button component={Link} href={findHref} variant={request.status === "confirmed" && bucket === "upcoming" ? "contained" : "text"} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
          {bucket === "cancelled" ? s.again : s.view}
        </Button>
      </Box>
    </Box>
  );
}
