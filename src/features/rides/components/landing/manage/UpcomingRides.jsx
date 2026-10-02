"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "antd/es/skeleton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Plus } from "@phosphor-icons/react";
import UpcomingRideItem, { DATE_BLOCK_CENTER } from "./UpcomingRideItem";
import StateBlock from "../primitives/StateBlock";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { RIDE_ROUTES } from "../../../utils/rideLinks";

const S = RIDE_STRINGS.manage;

// Gutter that holds the stop node and the rail.
const RAIL_GUTTER = 28;
const NODE_SIZE = 18;
const ITEM_PAD_Y = 16;
// Top of the node per breakpoint; its centre lines up with the date block's.
const NODE_TOP = {
  xs: ITEM_PAD_Y + DATE_BLOCK_CENTER.xs - NODE_SIZE / 2,
  sm: ITEM_PAD_Y + DATE_BLOCK_CENTER.sm - NODE_SIZE / 2,
};
const perBreakpoint = (fn) => ({ xs: fn(NODE_TOP.xs), sm: fn(NODE_TOP.sm) });

/** A departure stop on the timeline: a ring with a filled centre. */
function StopNode({ t }) {
  return (
    <svg width={NODE_SIZE} height={NODE_SIZE} viewBox="0 0 18 18" fill="none" aria-hidden focusable="false">
      <circle cx="9" cy="9" r="7" fill={t.color.surface} stroke={t.color.accentText} strokeWidth="2.5" />
      <circle cx="9" cy="9" r="2.6" fill={t.color.accentText} />
    </svg>
  );
}

/** Dashed rail joining the stops. */
function StopRail({ t }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        left: RAIL_GUTTER / 2 - 1,
        top: perBreakpoint((top) => top + NODE_SIZE + 2),
        bottom: perBreakpoint((top) => -(top - 2)),
        width: 0,
        borderLeft: `2px dashed ${t.color.borderStrong}`,
      }}
    />
  );
}

function ItemSkeleton({ t }) {
  return (
    <Box sx={{ display: "flex", gap: 2, py: 2, pl: `${RAIL_GUTTER + 4}px` }}>
      <Skeleton.Button active style={{ width: 72, height: 60, borderRadius: t.radius.md }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Skeleton active title={{ width: "70%" }} paragraph={{ rows: 2, width: ["50%", "35%"] }} />
      </Box>
    </Box>
  );
}

/** The driver's upcoming rides as a vertical timeline of departure stops. */
export default function UpcomingRides({ rides, status, pendingByRide = {}, onCancel, onEdit, onRetry }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const itemRefs = useRef(new Map());

  // After a cancel the focused button disappears; keep keyboard users in the
  // list. Items are tracked through refs so no ids end up in the DOM.
  const cancel = useCallback(
    (ride) => {
      onCancel(ride);
      requestAnimationFrame(() => {
        const list = listRef.current;
        if (!list) return;
        const cancelled = itemRefs.current.get(ride.id);
        const next = Array.from(list.children).find((item) => item !== cancelled);
        (next || list).focus({ preventScroll: true });
      });
    },
    [onCancel]
  );

  const itemRef = useCallback(
    (id) => (node) => {
      if (node) itemRefs.current.set(id, node);
      else itemRefs.current.delete(id);
    },
    []
  );

  if (status === "loading" || status === "idle") {
    return (
      <Box aria-busy="true">
        <Box aria-hidden>
          <ItemSkeleton t={t} />
          <ItemSkeleton t={t} />
        </Box>
      </Box>
    );
  }

  if (status === "error") {
    return (
      <StateBlock
        tone="error"
        compact
        title={RIDE_STRINGS.recent.errorTitle}
        body={RIDE_STRINGS.recent.errorBody}
        onRetry={onRetry}
        retryLabel={RIDE_STRINGS.recent.retry}
      />
    );
  }

  if (rides.length === 0) {
    return (
      <StateBlock
        compact
        title={S.emptyRidesTitle}
        body={S.emptyRidesBody}
        action={
          <Button
            component={Link}
            href={RIDE_ROUTES.post}
            variant="contained"
            color="secondary"
            startIcon={<Plus size={18} weight="regular" aria-hidden />}
          >
            {S.emptyRidesCta}
          </Button>
        }
      />
    );
  }

  return (
    <Box
      ref={listRef}
      component="ul"
      role="list"
      tabIndex={-1}
      aria-label={S.ridesTitle}
      sx={{ listStyle: "none", m: 0, p: 0, position: "relative", outline: "none" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {rides.map((ride, index) => (
          <Box
            component={m.li}
            key={ride.id}
            ref={itemRef(ride.id)}
            tabIndex={-1}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
            transition={t.motion.spring}
            sx={{
              position: "relative",
              pl: `${RAIL_GUTTER + 4}px`,
              py: `${ITEM_PAD_Y}px`,
              outline: "none",
              "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
            }}
          >
            <Box aria-hidden sx={{ position: "absolute", left: RAIL_GUTTER / 2 - NODE_SIZE / 2, top: NODE_TOP }}>
              <StopNode t={t} />
            </Box>
            {index < rides.length - 1 ? <StopRail t={t} /> : null}
            <UpcomingRideItem ride={ride} pending={pendingByRide[ride.id] || 0} onCancel={cancel} onEdit={onEdit} />
          </Box>
        ))}
      </AnimatePresence>
    </Box>
  );
}
