"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useInView, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { ANNOUNCEMENT_STRINGS } from "../../constants/announcementStrings";
import { tagIcon } from "./tagIcons";
import { shortWhen } from "./AnnouncementCard";

const s = ANNOUNCEMENT_STRINGS.board;
const ROWS = 4;
const STEP_MS = 5000;

// Departure-board palette: the same in both themes, like the real thing.
const BOARD = { frame: "#0B1220", row: "#141C2C", rowEdge: "#0A0F1A", text: "#FFE58A", dim: "#8A97AE", hinge: "rgba(0,0,0,0.55)" };

/** One split-flap row; flips down when its announcement changes. A preview row is plain content. */
export function Row({ item, index = 0, onOpen, reduce, preview = false }) {
  const t = useRideTokens();
  const Icon = tagIcon(item.tags[0]);
  const urgent = item.priority === "high";
  const Root = preview ? Box : ButtonBase;
  const interactive = preview ? { component: m.div } : { component: m.button, nativeButton: true, onClick: () => onOpen(item.id) };
  return (
    <Box sx={{ position: "relative", perspective: 600 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <Root
          key={preview ? "preview" : item.id}
          {...interactive}
          initial={reduce ? false : { rotateX: -92, opacity: 0.4 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { rotateX: 92, opacity: 0.4 }}
          transition={{ duration: 0.42, delay: reduce ? 0 : index * 0.09, ease: [0.3, 0.6, 0.2, 1] }}
          style={{ transformOrigin: "50% 0%" }}
          sx={{
            position: "relative",
            width: "100%",
            display: "grid",
            gridTemplateColumns: "34px minmax(0, 1fr) auto",
            alignItems: "center",
            gap: 1.25,
            minHeight: 58,
            px: 1.5,
            textAlign: "left",
            borderRadius: "8px",
            background: `linear-gradient(180deg, ${BOARD.row} 0 49.5%, ${BOARD.rowEdge} 49.5% 50.5%, ${BOARD.row} 50.5%)`,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 0 rgba(0,0,0,0.35)",
            color: BOARD.text,
            "&:hover": { background: `linear-gradient(180deg, #1A2438 0 49.5%, ${BOARD.rowEdge} 49.5% 50.5%, #1A2438 50.5%)` },
            "&.Mui-focusVisible": { outline: `2px solid ${t.brand.yellow}`, outlineOffset: 2 },
          }}
        >
          <Box component="span" aria-hidden sx={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: "7px", backgroundColor: { xs: urgent ? "#FF5A5F" : "rgba(255,229,138,0.1)", sm: "rgba(255,229,138,0.1)" }, color: { xs: urgent ? "#fff" : BOARD.text, sm: BOARD.text } }}>
            <Icon size={20} />
          </Box>
          <Box component="span" sx={{ minWidth: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: "0.02em", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title}
          </Box>
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, fontWeight: 700, color: BOARD.dim, whiteSpace: "nowrap" }}>
            {urgent ? <Box component="span" sx={{ display: { xs: "none", sm: "inline" }, px: 0.75, py: 0.2, borderRadius: "4px", backgroundColor: "#D42F37", color: "#fff", letterSpacing: "0.08em" }}>{s.urgent}</Box> : null}
            {item.createdAt ? shortWhen(item.createdAt) : ANNOUNCEMENT_STRINGS.day.now}
          </Box>
        </Root>
      </AnimatePresence>
    </Box>
  );
}

/**
 * A split-flap "departures" board with the latest announcements. Rows flip
 * in on load and every few seconds move on to the next ones, only while the
 * board is on screen and never with reduced motion. Each row opens its post.
 */
export default function FlapBoard({ items, status, onOpen }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const visible = useInView(ref, { margin: "-10% 0px" });
  const [offset, setOffset] = useState(0);
  const pool = items.slice(0, 12);

  useEffect(() => {
    if (!visible || reduce || pool.length <= ROWS) return undefined;
    const id = setInterval(() => setOffset((o) => (o + 1) % pool.length), STEP_MS);
    return () => clearInterval(id);
  }, [visible, reduce, pool.length]);

  const rows = pool.length <= ROWS ? pool : Array.from({ length: ROWS }, (_, i) => pool[(offset + i) % pool.length]);

  return (
    <Box ref={ref} sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: "18px", backgroundColor: BOARD.frame, boxShadow: "0 24px 50px -20px rgba(8,18,32,0.6), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.5, pb: 1.5 }}>
        <Box component="h2" sx={{ m: 0, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: BOARD.dim }}>{s.title}</Box>
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#FF8A8E" }}>
          <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#FF5A5F", boxShadow: "0 0 0 3px rgba(255,90,95,0.25)", animation: reduce ? "none" : "an-live 1.6s ease-in-out infinite", animationPlayState: visible ? "running" : "paused", "@keyframes an-live": { "50%": { opacity: 0.35 } } }} />
          {s.live}
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minHeight: ROWS * 58 + (ROWS - 1) * 6 }}>
        {status !== "ready"
          ? Array.from({ length: ROWS }, (_, i) => <Box key={i} aria-hidden sx={{ height: 58, borderRadius: "8px", backgroundColor: BOARD.row, opacity: 0.6 }} />)
          : rows.length
            ? rows.map((item, i) => <Row key={i} item={item} index={i} onOpen={onOpen} reduce={reduce} />)
            : <Box sx={{ display: "grid", placeItems: "center", minHeight: 120, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 14, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: BOARD.dim }}>{s.empty}</Box>}
      </Box>
    </Box>
  );
}
