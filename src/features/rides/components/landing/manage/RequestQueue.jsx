"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Skeleton from "antd/es/skeleton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import RequestRow from "./RequestRow";
import StateBlock from "../primitives/StateBlock";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";

const S = RIDE_STRINGS.manage;

// How long the accepted / declined confirmation stays before the row leaves.
const DECISION_MS = 650;
const DECISION_MS_REDUCED = 400;

function RowSkeleton({ t, first }) {
  return (
    <Box sx={{ py: 2, borderTop: first ? 0 : `1px solid ${t.color.border}` }}>
      <Skeleton active avatar={{ size: 40, shape: "circle" }} title={{ width: "40%" }} paragraph={{ rows: 2, width: ["85%", "55%"] }} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 1 }}>
        <Skeleton.Button active shape="round" style={{ width: 112, height: 44 }} />
        <Skeleton.Button active shape="round" style={{ width: 112, height: 44 }} />
      </Box>
    </Box>
  );
}

/**
 * Pending requests with a two-phase exit: the row first shows the decision,
 * then `onRespond` removes it and the remaining rows slide up.
 */
export default function RequestQueue({ requests, status, onRespond, onRetry }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const [decisions, setDecisions] = useState({});
  const timersRef = useRef(new Map());
  const listRef = useRef(null);
  const rowRefs = useRef(new Map());

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  // Keyboard users keep their place: focus moves to the row that slid into
  // the decided row's slot, or to the list when it was the last one. Rows are
  // tracked through refs so no ids end up in the DOM.
  const restoreFocus = useCallback((decidedId) => {
    requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;
      const decided = rowRefs.current.get(decidedId);
      const rows = Array.from(list.children);
      const index = rows.indexOf(decided);
      const rest = rows.filter((row) => row !== decided);
      const target = rest[Math.min(Math.max(index, 0), rest.length - 1)];
      (target || list).focus({ preventScroll: true });
    });
  }, []);

  const rowRef = useCallback(
    (id) => (node) => {
      if (node) rowRefs.current.set(id, node);
      else rowRefs.current.delete(id);
    },
    []
  );

  const decide = useCallback(
    (request, action) => {
      if (timersRef.current.has(request.id)) return;
      setDecisions((prev) => ({ ...prev, [request.id]: action }));
      const timer = setTimeout(
        () => {
          timersRef.current.delete(request.id);
          setDecisions((prev) => {
            const next = { ...prev };
            delete next[request.id];
            return next;
          });
          onRespond(request, action);
          restoreFocus(request.id);
        },
        reduce ? DECISION_MS_REDUCED : DECISION_MS
      );
      timersRef.current.set(request.id, timer);
    },
    [onRespond, reduce, restoreFocus]
  );

  if (status === "loading" || status === "idle") {
    return (
      <Box aria-busy="true" aria-live="polite">
        <Box aria-hidden>
          <RowSkeleton t={t} first />
          <RowSkeleton t={t} />
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

  return (
    <Box sx={{ position: "relative" }}>
      <AnimatePresence initial={false}>
        {requests.length === 0 ? (
          <m.div
            key="empty"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: t.motion.duration.base }}
          >
            <StateBlock compact title={S.emptyRequestsTitle} body={S.emptyRequestsBody} />
          </m.div>
        ) : null}
      </AnimatePresence>
      <Box
        ref={listRef}
        component="ul"
        role="list"
        tabIndex={-1}
        aria-label={S.requestsTitle}
        sx={{ listStyle: "none", m: 0, p: 0, position: "relative", outline: "none" }}
      >
        <AnimatePresence initial={false} mode="popLayout">
          {requests.map((request, index) => (
            <Box
              component={m.li}
              key={request.id}
              layout={!reduce}
              ref={rowRef(request.id)}
              tabIndex={-1}
              initial={reduce ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
              transition={t.motion.spring}
              sx={{
                borderTop: index === 0 ? "none" : `1px solid ${t.color.border}`,
                outline: "none",
                "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
              }}
            >
              <RequestRow request={request} decision={decisions[request.id] || null} onDecide={decide} />
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
