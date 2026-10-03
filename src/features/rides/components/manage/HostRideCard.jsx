"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { m } from "framer-motion";
import { CaretDown, CarProfile, Clock, DotsThreeVertical, MagnifyingGlass, PencilSimple, Prohibit, UsersThree } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRideDay, formatRideTime, formatRupee } from "../../utils/rideFormat";
import { buildFindHref } from "../../utils/rideLinks";
import PersonAvatar from "../landing/primitives/PersonAvatar";
import RouteLine from "../landing/primitives/RouteLine";
import SeatMeter from "../landing/primitives/SeatMeter";
import RequestRow from "../landing/manage/RequestRow";

const s = RIDE_STRINGS.my.host;

function Rider({ request }) {
  const t = useRideTokens();
  return (
    <Box component="li" sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, py: 0.75 }}>
      <PersonAvatar name={request.name} src={request.avatar} size={34} role="rider" decorative />
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ fontSize: 14.5, fontWeight: 650, color: t.color.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{request.name}</Box>
        {request.message ? (
          <Box sx={{ fontSize: 13, color: t.color.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{request.message}</Box>
        ) : null}
      </Box>
      <Box sx={{ flexShrink: 0, fontSize: 13, fontWeight: 650, color: t.color.textSecondary }}>{s.riderSeats(request.seats)}</Box>
    </Box>
  );
}

/**
 * One ride I offer: a ticket header (time stub, route, fare, seats) with a
 * menu of actions, and a drawer of riders and waiting requests. The drawer
 * starts open while someone is waiting for an answer.
 */
export default function HostRideCard({ ride, bucket, onRespond, onEdit, onCancel }) {
  const t = useRideTokens();
  const c = t.color;
  const bodyId = useId();
  const menuId = useId();
  const [open, setOpen] = useState(ride.pending.length > 0);
  const [anchor, setAnchor] = useState(null);
  const upcoming = bucket === "upcoming";
  const time = formatRideTime(ride.date, ride.time);
  const [clock, meridiem = ""] = time.split(" ");
  const price = Number.isFinite(ride.price) && ride.price > 0 ? formatRupee(ride.price) : RIDE_STRINGS.find.card.free;
  const taken = ride.seatsTotal - ride.seatsLeft;
  const pendingCount = ride.pending.length;

  const close = () => setAnchor(null);
  const act = (fn) => () => {
    close();
    fn(ride);
  };

  return (
    <Box
      component={m.article}
      layout="position"
      aria-label={RIDE_STRINGS.find.card.heading(ride.from, ride.to, formatRideDay(ride.date), time)}
      sx={{
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: c.surface,
        border: `1px solid ${pendingCount && upcoming ? c.driverEdge : c.border}`,
        boxShadow: t.elevation[1],
        overflow: "hidden",
        opacity: upcoming ? 1 : 0.92,
      }}
    >
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "84px minmax(0, 1fr)", sm: "112px minmax(0, 1fr) auto" } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 0.5,
            px: { xs: 1.5, sm: 2 },
            py: 2,
            backgroundColor: upcoming ? c.driverSoft : c.surfaceAlt,
            borderRight: `1.5px dashed ${c.border}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.4, whiteSpace: "nowrap" }}>
            <Box component="span" sx={{ fontSize: { xs: 20, sm: 24 }, fontWeight: 760, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {clock}
            </Box>
            <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: c.textSecondary, textTransform: "uppercase" }}>
              {meridiem}
            </Box>
          </Box>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 13, fontWeight: 650, color: c.textSecondary }}>
            <Clock size={14} aria-hidden />
            {formatRideDay(ride.date)}
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, p: { xs: 1.75, sm: 2.25 }, display: "flex", flexDirection: "column", gap: 1.25 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
            {!upcoming ? (
              <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 700, backgroundColor: c.surfaceInteractive, color: c.textOnInset }}>
                {bucket === "cancelled" ? s.statusCancelled : s.statusPast}
              </Box>
            ) : null}
            {pendingCount && upcoming ? (
              <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 760, backgroundColor: c.highlight, color: c.onHighlight }}>
                {s.pending(pendingCount)}
              </Box>
            ) : null}
          </Box>
          <RouteLine from={ride.from} to={ride.to} dense />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <SeatMeter left={ride.seatsLeft} total={ride.seatsTotal} mode="filled" size="sm" />
            {ride.vehicle ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 12.5, color: c.textMuted, minWidth: 0 }}>
                <CarProfile size={14} aria-hidden />
                <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {ride.vehicle}
                </Box>
              </Box>
            ) : null}
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "baseline", gap: 0.75 }}>
            <Box sx={{ fontSize: 20, fontWeight: 760 }}>{price}</Box>
            <Box sx={{ fontSize: 12.5, color: c.textMuted }}>{RIDE_STRINGS.find.card.perSeat}</Box>
          </Box>
        </Box>

        <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between", p: 2.25, pl: 0 }}>
          <Box sx={{ textAlign: "right" }}>
            <Box sx={{ fontSize: 22, fontWeight: 760, letterSpacing: "-0.02em", lineHeight: 1.1 }}>{price}</Box>
            <Box sx={{ fontSize: 12.5, color: c.textMuted }}>{RIDE_STRINGS.find.card.perSeat}</Box>
          </Box>
        </Box>
      </Box>

      {/* Footer: expand riders and requests, and the actions menu. */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, py: 0.5, borderTop: `1px solid ${c.border}`, backgroundColor: c.surfaceAlt }}>
        <ButtonBase
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={bodyId}
          sx={{
            flex: 1,
            justifyContent: "flex-start",
            gap: 1,
            minHeight: 44,
            px: 1.25,
            borderRadius: `${t.radius.sm}px`,
            fontSize: 14,
            fontWeight: 650,
            color: c.textSecondary,
            "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: -2 },
          }}
        >
          <UsersThree size={18} weight="duotone" aria-hidden />
          <Box component="span">{s.ridersCount(taken, ride.seatsTotal)}</Box>
          <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            {open ? s.collapse : s.expand}
          </Box>
          <Box component="span" aria-hidden sx={{ display: "inline-flex", ml: "auto", transform: open ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}>
            <CaretDown size={16} />
          </Box>
        </ButtonBase>
        <IconButton aria-label={s.menu} aria-haspopup="menu" aria-controls={anchor ? menuId : undefined} aria-expanded={Boolean(anchor) || undefined} onClick={(event) => setAnchor(event.currentTarget)} sx={{ width: 44, height: 44 }}>
          <DotsThreeVertical size={20} weight="bold" aria-hidden />
        </IconButton>
        <Menu id={menuId} anchorEl={anchor} open={Boolean(anchor)} onClose={close} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
          {upcoming ? (
            <MenuItem onClick={act(onEdit)} sx={{ minHeight: 44 }}>
              <ListItemIcon>
                <PencilSimple size={18} aria-hidden />
              </ListItemIcon>
              {s.edit}
            </MenuItem>
          ) : null}
          <MenuItem component={Link} href={buildFindHref({ from: ride.from, to: ride.to })} onClick={close} sx={{ minHeight: 44 }}>
            <ListItemIcon>
              <MagnifyingGlass size={18} aria-hidden />
            </ListItemIcon>
            {s.view}
          </MenuItem>
          {upcoming ? (
            <MenuItem onClick={act(onCancel)} sx={{ minHeight: 44, color: c.danger }}>
              <ListItemIcon sx={{ color: "inherit" }}>
                <Prohibit size={18} aria-hidden />
              </ListItemIcon>
              {s.cancel}
            </MenuItem>
          ) : null}
        </Menu>
      </Box>

      <Collapse in={open} id={bodyId}>
        <Box sx={{ p: { xs: 1.75, sm: 2.25 }, pt: 1.5, display: "flex", flexDirection: "column", gap: 2, borderTop: `1px solid ${c.border}` }}>
          {pendingCount && upcoming ? (
            <Box>
              <Box component="h3" sx={{ m: 0, mb: 1, fontSize: 14, fontWeight: 750, color: c.textSecondary }}>
                {s.requestsTitle}
              </Box>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                {ride.pending.map((request) => (
                  <Box component="li" key={request.id}>
                    <RequestRow request={request} onDecide={onRespond} inRide />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
          <Box>
            <Box component="h3" sx={{ m: 0, mb: 0.5, fontSize: 14, fontWeight: 750, color: c.textSecondary }}>
              {s.riders}
            </Box>
            {ride.confirmed.length ? (
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
                {ride.confirmed.map((request) => (
                  <Rider key={request.id} request={request} />
                ))}
              </Box>
            ) : (
              <Box sx={{ fontSize: 14, color: c.textMuted }}>{s.noRiders}</Box>
            )}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
