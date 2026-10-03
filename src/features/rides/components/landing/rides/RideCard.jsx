"use client";

import { useId } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Tag from "antd/es/tag";
import { m, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Armchair, CheckCircle, Prohibit, SteeringWheel } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { formatRideDay, formatRideTime, formatRupee } from "../../../utils/rideFormat";
import Panel from "../primitives/Panel";
import PersonAvatar from "../primitives/PersonAvatar";
import RouteLine from "../primitives/RouteLine";
import SeatMeter from "../primitives/SeatMeter";

const S = RIDE_STRINGS.recent;

const MAX_TILT = 3;
const TILT_SPRING = { stiffness: 220, damping: 24 };

/**
 * Fixed row heights shared with RideCardSkeleton so loading and loaded cards
 * have identical outer dimensions. Everything below the perforation has a
 * fixed height, so the ticket notches can be cut at a fixed distance from
 * the bottom edge whatever the route above wraps to.
 */
export const RIDE_CARD_METRICS = {
  padding: { xs: 2, sm: 2.5 },
  topRow: 44,
  route: 92,
  perforation: 14,
  driverRow: 44,
  action: 44,
  gap: 2,
};

const PAD_PX = { xs: 16, sm: 20 };
const GAP_PX = 16;
const NOTCH_R = 9;
const RIM = 1.5;

/** Distance from the card's bottom edge to the perforation's centre line. */
function notchOffset(pad) {
  const M = RIDE_CARD_METRICS;
  return pad + M.action + GAP_PX + M.driverRow + GAP_PX + M.perforation / 2;
}

/** Two half-circle bites, one on each side edge, at the perforation line. */
function notchMask(pad) {
  const y = `calc(100% - ${notchOffset(pad)}px)`;
  const bite = (x) => `radial-gradient(circle at ${x} ${y}, transparent ${NOTCH_R}px, #000 ${NOTCH_R + 0.5}px)`;
  return `${bite("0")} left / 51% 100% no-repeat, ${bite("100%")} right / 51% 100% no-repeat`;
}

const MASK = { xs: notchMask(PAD_PX.xs), sm: notchMask(PAD_PX.sm) };

// The mask clips box-shadows, so the ticket's depth is a drop-shadow on a
// wrapper instead; it follows the notches. Values mirror elevation 2 and 3.
const TICKET_SHADOW = {
  light: {
    rest: "drop-shadow(0 1px 1px rgba(18, 35, 58, 0.06)) drop-shadow(0 8px 12px rgba(18, 35, 58, 0.09))",
    hover: "drop-shadow(0 2px 2px rgba(18, 35, 58, 0.06)) drop-shadow(0 16px 22px rgba(18, 35, 58, 0.16))",
  },
  dark: {
    rest: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.40)) drop-shadow(0 10px 14px rgba(0, 0, 0, 0.40))",
    hover: "drop-shadow(0 2px 2px rgba(0, 0, 0, 0.45)) drop-shadow(0 18px 24px rgba(0, 0, 0, 0.55))",
  },
};

export const srOnly = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

const ellipsis = { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 };

/** Hairline rim tracing one notch: rider sky on the left, driver yellow on the right. */
function NotchRim({ side, color }) {
  const size = 2 * (NOTCH_R + RIM);
  const bottom = (pad) => `${notchOffset(pad) - NOTCH_R - RIM}px`;
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        position: "absolute",
        [side]: -(NOTCH_R + RIM),
        bottom: { xs: bottom(PAD_PX.xs), sm: bottom(PAD_PX.sm) },
        width: size,
        height: size,
        boxSizing: "border-box",
        borderRadius: "50%",
        border: `${RIM}px solid ${color}`,
        pointerEvents: "none",
      }}
    />
  );
}

/**
 * The notched ticket surface shared by RideCard and RideCardSkeleton.
 * `wrapperProps` go on the shadow wrapper (motion and pointer handlers);
 * everything else goes on the Panel.
 */
export function TicketShell({ t, interactive = false, wrapperProps, sx, children, ...panelProps }) {
  const shadow = TICKET_SHADOW[t.mode] || TICKET_SHADOW.light;
  return (
    <Box
      component={interactive ? m.div : "div"}
      {...wrapperProps}
      sx={{
        height: "100%",
        filter: shadow.rest,
        transition: `filter ${t.motion.duration.base}s`,
        ...(interactive ? { "@media (hover: hover)": { "&:hover": { filter: shadow.hover } } } : null),
      }}
    >
      <Panel
        variant="flat"
        radius="lg"
        {...panelProps}
        sx={[
          {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            p: RIDE_CARD_METRICS.padding,
            mask: MASK,
            WebkitMask: MASK,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {children}
        <NotchRim side="left" color={t.color.rider} />
        <NotchRim side="right" color={t.color.driverEdge} />
      </Panel>
    </Box>
  );
}

/** Ticket perforation: a dashed hairline running between the two notches. */
export function Perforation({ t }) {
  return (
    <Box
      aria-hidden
      sx={{
        height: RIDE_CARD_METRICS.perforation,
        mx: { xs: `-${PAD_PX.xs}px`, sm: `-${PAD_PX.sm}px` },
        px: `${NOTCH_R + 6}px`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box component="span" sx={{ flex: 1, borderTop: `1.5px dashed ${t.color.borderStrong}` }} />
    </Box>
  );
}

/** Three-dot route loader (rider, ink, driver). Opacity only; static under reduced motion. */
function RouteDots({ t, still }) {
  const colors = [t.color.rider, t.color.text, t.color.driver];
  return (
    <Box component="span" aria-hidden sx={{ display: "inline-flex", gap: "5px", alignItems: "center" }}>
      {colors.map((color, i) => (
        <Box
          key={i}
          component={m.span}
          initial={{ opacity: still ? 1 : 0.3 }}
          animate={still ? { opacity: 1 } : { opacity: [0.3, 1, 0.3] }}
          transition={still ? { duration: 0 } : { duration: 0.9, ease: "easeInOut", repeat: Infinity, delay: i * 0.15 }}
          sx={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color }}
        />
      ))}
    </Box>
  );
}

function RequestAction({ ride, state, onRequest, t }) {
  const reduce = useReducedMotion();
  const base = { width: "100%", height: RIDE_CARD_METRICS.action, minHeight: RIDE_CARD_METRICS.action };
  const quietDisabled = {
    "&.Mui-disabled": {
      color: t.color.textOnInset,
      borderColor: t.color.border,
      backgroundColor: t.color.surfaceInteractive,
    },
  };

  if (ride.isOwn) {
    return (
      <Button variant="outlined" disabled startIcon={<SteeringWheel size={18} aria-hidden />} sx={[base, quietDisabled]}>
        {S.yours}
      </Button>
    );
  }

  if (state === "requested") {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={
          <Box
            component={m.span}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={t.motion.springSnappy}
            sx={{ display: "inline-flex" }}
          >
            <CheckCircle size={18} weight="fill" aria-hidden />
          </Box>
        }
        sx={[
          base,
          {
            "&.Mui-disabled": {
              color: t.color.success,
              borderColor: t.color.success,
              backgroundColor: t.color.successSoft,
            },
          },
        ]}
      >
        {S.requested}
      </Button>
    );
  }

  if (ride.seatsLeft === 0) {
    return (
      <Button variant="contained" disabled startIcon={<Prohibit size={18} aria-hidden />} sx={[base, quietDisabled]}>
        {S.full}
      </Button>
    );
  }

  if (state === "loading") {
    return (
      <Button
        variant="contained"
        aria-disabled="true"
        aria-busy="true"
        startIcon={<RouteDots t={t} still={reduce} />}
        sx={[
          base,
          {
            cursor: "progress",
            backgroundColor: t.color.actionSoftStrong,
            color: t.color.text,
            "&:hover": { backgroundColor: t.color.actionSoftStrong },
          },
        ]}
      >
        {S.requesting}
      </Button>
    );
  }

  return (
    <Button
      component={m.button}
      nativeButton
      whileTap={{ scale: 0.97 }}
      variant="contained"
      color="primary"
      onClick={() => onRequest?.(ride)}
      startIcon={<Armchair size={18} aria-hidden />}
      sx={base}
    >
      {S.request}
    </Button>
  );
}

/** Pointer-aware depth for mouse users: at most 3deg on each axis. */
function useTilt(enabled) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const smoothX = useSpring(px, TILT_SPRING);
  const smoothY = useSpring(py, TILT_SPRING);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);

  if (!enabled) return {};

  const onPointerMove = (event) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return { style: { rotateX, rotateY, transformPerspective: 900 }, onPointerMove, onPointerLeave };
}

/**
 * A ride as a boarding pass: departure and price up top, the route, a
 * perforation, then the driver, seats and the request action.
 * @param {{ ride: object, state?: "loading"|"requested", onRequest?: (ride: object) => void }} props
 */
export default function RideCard({ ride, state, onRequest }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const headingId = useId();
  const tilt = useTilt(!reduce);
  const M = RIDE_CARD_METRICS;

  const time = formatRideTime(ride.date, ride.time);
  const day = formatRideDay(ride.date);
  const isToday = day === S.filters.today;
  const hasPrice = Number.isFinite(ride.price);
  const display = {
    lineHeight: 1.15,
    fontWeight: t.typography.displayWeight,
    letterSpacing: t.typography.displayTracking,
    fontVariantNumeric: "tabular-nums",
    color: t.color.text,
    whiteSpace: "nowrap",
  };

  return (
    <TicketShell
      t={t}
      interactive
      component="article"
      aria-labelledby={headingId}
      wrapperProps={{ whileHover: reduce ? undefined : { y: -2 }, ...tilt }}
    >
      <Box component="h3" id={headingId} sx={srOnly}>
        {RIDE_STRINGS.recent.cardHeading(ride.from, ride.to, day, time)}
      </Box>

      <Box sx={{ minHeight: M.topRow, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", columnGap: 1.25, rowGap: 0.5, minWidth: 0 }}>
          <Box component="span" sx={{ ...display, fontSize: 22 }}>
            {time}
          </Box>
          <Tag
            variant="filled"
            style={{
              marginInlineEnd: 0,
              fontWeight: 650,
              fontSize: 12,
              lineHeight: "20px",
              paddingInline: 8,
              borderRadius: t.radius.pill,
              backgroundColor: isToday ? t.color.driverSoft : t.color.surfaceInteractive,
              color: t.color.text,
            }}
          >
            {day}
          </Tag>
        </Box>
        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Box sx={{ ...display, fontSize: 20 }}>{formatRupee(ride.price)}</Box>
          {hasPrice ? <Box sx={{ fontSize: 12, lineHeight: 1.4, color: t.color.textMuted }}>{S.perSeat}</Box> : null}
        </Box>
      </Box>

      <Box sx={{ mt: M.gap, minHeight: M.route, flex: "1 0 auto", minWidth: 0 }}>
        <RouteLine from={ride.from} to={ride.to} clamp={2} />
      </Box>

      <Box sx={{ my: M.gap, flexShrink: 0 }}>
        <Perforation t={t} />
      </Box>

      <Box sx={{ height: M.driverRow, flexShrink: 0, display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <PersonAvatar name={ride.driverName} src={ride.driverAvatar} size={36} role="driver" decorative />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box title={ride.driverName} sx={{ ...ellipsis, fontSize: 14.5, fontWeight: 650, lineHeight: 1.3, color: t.color.text }}>
            {ride.driverName}
          </Box>
          {ride.vehicle ? (
            <Box title={ride.vehicle} sx={{ ...ellipsis, fontSize: 12.5, lineHeight: 1.4, color: t.color.textMuted }}>
              {ride.vehicle}
            </Box>
          ) : null}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
          <SeatMeter left={ride.seatsLeft} total={ride.seatsTotal} mode="left" size="sm" showLabel={false} />
          <Box
            component="span"
            aria-hidden
            sx={{ fontSize: 12, fontWeight: 600, color: t.color.textSecondary, fontVariantNumeric: "tabular-nums" }}
          >
            {S.seatsLeftShort(ride.seatsLeft)}
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: M.gap, flexShrink: 0 }}>
        <RequestAction ride={ride} state={state} onRequest={onRequest} t={t} />
      </Box>
    </TicketShell>
  );
}
