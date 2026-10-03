"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { AnimatePresence, m, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { ArrowCounterClockwise, ArrowUpRight, Bed, CalendarCheck, Heart, ImageSquare, MapPin, X } from "@phosphor-icons/react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import { HOUSING_STRINGS } from "../../constants/housingStrings";

const s = HOUSING_STRINGS.deck;
const r = HOUSING_STRINGS.results;
const THRESHOLD = 110;
const FLING = 600;
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

function availability(room) {
  return !room.moveIn || room.moveIn <= new Date() ? r.availableNow : r.availableFrom(dateFmt.format(room.moveIn));
}

/** The face of a card: photo, rent, title, place and two facts. */
function CardFace({ room, t }) {
  const photo = room.photos[0];
  return (
    <>
      {photo ? (
        <Box component="img" src={photo} alt="" draggable={false} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }} />
      ) : (
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: t.color.textMuted, backgroundColor: t.color.surfaceInteractive }}>
          <ImageSquare size={44} weight="duotone" aria-hidden />
        </Box>
      )}
      <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,18,32,0) 38%, rgba(8,18,32,0.92) 100%)" }} />
      <Box sx={{ position: "absolute", left: 18, right: 72, bottom: 18, color: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5 }}>
          <Box sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}</Box>
          <Box sx={{ fontSize: 14, opacity: 0.85 }}>{r.perMonth}</Box>
        </Box>
        <Box sx={{ mt: 0.25, fontSize: 18, fontWeight: 700, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{room.title}</Box>
        {room.location ? (
          <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5, fontSize: 14, opacity: 0.9, minWidth: 0 }}>
            <MapPin size={15} weight="fill" aria-hidden style={{ flexShrink: 0 }} />
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {room.location}
            </Box>
          </Box>
        ) : null}
        <Box sx={{ mt: 1.25, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {[
            { icon: Bed, text: r.beds(room.beds) },
            { icon: CalendarCheck, text: availability(room) },
          ].map(({ icon: Icon, text }) => (
            <Box key={text} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: "rgba(255,255,255,0.16)", backdropFilter: "blur(6px)", fontSize: 13, fontWeight: 650 }}>
              <Icon size={14} weight="duotone" aria-hidden />
              {text}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}

/** Top card: draggable; a short drag snaps back, a long or fast one decides. */
function TopCard({ room, onDecide, reduce, t }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);
  const saveOpacity = useTransform(x, [30, THRESHOLD], [0, 1]);
  const skipOpacity = useTransform(x, [-THRESHOLD, -30], [1, 0]);
  const stamp = (text, color, side, opacity) => (
    <Box
      component={m.span}
      aria-hidden
      style={{ opacity }}
      sx={{
        position: "absolute",
        top: 22,
        [side]: 20,
        px: 1.5,
        py: 0.5,
        border: `3px solid ${color}`,
        borderRadius: `${t.radius.sm}px`,
        color,
        fontSize: 22,
        fontWeight: 900,
        letterSpacing: "0.12em",
        transform: `rotate(${side === "left" ? -14 : 14}deg)`,
        backgroundColor: "rgba(8,18,32,0.35)",
      }}
    >
      {text}
    </Box>
  );
  return (
    <Box
      component={m.div}
      drag={reduce ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > THRESHOLD || info.velocity.x > FLING) onDecide("save");
        else if (info.offset.x < -THRESHOLD || info.velocity.x < -FLING) onDecide("skip");
      }}
      whileTap={reduce ? undefined : { cursor: "grabbing" }}
      sx={{ position: "absolute", inset: 0, borderRadius: `${t.radius.xl}px`, overflow: "hidden", cursor: reduce ? "default" : "grab", touchAction: "pan-y", boxShadow: t.elevation[3] || t.elevation[2], backgroundColor: t.color.surface }}
    >
      <CardFace room={room} t={t} />
      {/* Rides along with the card while it is dragged. */}
      <Box sx={{ position: "absolute", bottom: 18, right: 18, zIndex: 2 }}>
        <Tooltip title={s.open}>
          <IconButton component={Link} href={`/housing/${room.id}`} aria-label={`${s.open}: ${room.title}`} onPointerDown={(event) => event.stopPropagation()} sx={{ width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)", color: "#fff", "&:hover": { backgroundColor: "rgba(255,255,255,0.3)" } }}>
            <ArrowUpRight size={18} weight="bold" aria-hidden />
          </IconButton>
        </Tooltip>
      </Box>
      {stamp(s.saveBadge, "#4FD1A5", "left", saveOpacity)}
      {stamp(s.skipBadge, "#FF8A93", "right", skipOpacity)}
    </Box>
  );
}

const exitVariants = {
  exit: (dir) => ({ x: dir * 520, rotate: dir * 18, opacity: 0, transition: { duration: 0.32, ease: [0.4, 0, 0.6, 1] } }),
};

/**
 * Card stack of the rooms matching the search. Save sends a room to the
 * shortlist; skip sets it aside for this visit. Buttons and the arrow keys
 * do the same as dragging.
 */
export default function SwipeDeck({ rooms, total, onSave, onSkip, onUndo, canUndo, onReset }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(1);
  const top = rooms[0];
  const seen = total - rooms.length;

  const decide = (action) => {
    if (!top) return;
    setDir(action === "save" ? 1 : -1);
    if (action === "save") onSave(top);
    else onSkip(top);
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      decide("save");
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      decide("skip");
    }
  };

  const roundBtn = (bg, fg, size = 60) => ({
    width: size,
    height: size,
    backgroundColor: bg,
    color: fg,
    boxShadow: t.elevation[2],
    border: `1px solid ${c.border}`,
    "& svg": { color: fg },
    "&:hover": { backgroundColor: bg, transform: "translateY(-2px)" },
    transition: "transform 160ms ease",
    "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 },
    "&.Mui-disabled": { opacity: 0.4, backgroundColor: bg },
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Box
        role="region"
        aria-roledescription="card stack"
        aria-label={s.label}
        tabIndex={0}
        onKeyDown={onKeyDown}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          aspectRatio: "4 / 5",
          outline: "none",
          borderRadius: `${t.radius.xl}px`,
          "&:focus-visible": { boxShadow: `0 0 0 3px ${c.focus}` },
        }}
      >
        {top ? (
          <>
            {/* The next two cards peek out behind the top one. */}
            {rooms.slice(1, 3).reverse().map((room, i, list) => {
              const depth = list.length - i;
              return (
                <Box
                  key={room.id}
                  component={m.div}
                  aria-hidden
                  initial={false}
                  animate={{ scale: 1 - depth * 0.05, y: depth * 16, opacity: 1 - depth * 0.18 }}
                  transition={t.motion.spring}
                  sx={{ position: "absolute", inset: 0, borderRadius: `${t.radius.xl}px`, overflow: "hidden", backgroundColor: c.surface, boxShadow: t.elevation[1], pointerEvents: "none" }}
                >
                  <CardFace room={room} t={t} />
                </Box>
              );
            })}
            <AnimatePresence initial={false} custom={dir}>
              <Box key={top.id} component={m.div} custom={dir} variants={exitVariants} exit="exit" initial={reduce ? false : { scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} transition={t.motion.spring} sx={{ position: "absolute", inset: 0 }}>
                <TopCard room={top} onDecide={decide} reduce={reduce} t={t} />
              </Box>
            </AnimatePresence>
          </>
        ) : (
          <Box sx={{ position: "absolute", inset: 0, borderRadius: `${t.radius.xl}px`, border: `2px dashed ${c.borderStrong}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 1.25, p: 3 }}>
            <Heart size={40} weight="duotone" color={t.brand.yellow} aria-hidden />
            <Box sx={{ fontSize: 19, fontWeight: 760 }}>{total ? s.doneTitle : s.emptyTitle}</Box>
            <Box sx={{ fontSize: 14.5, color: c.textSecondary, maxWidth: 260, lineHeight: 1.5 }}>{total ? s.doneBody : s.emptyBody}</Box>
            {total ? (
              <Button variant="outlined" onClick={onReset} startIcon={<ArrowCounterClockwise size={16} aria-hidden />} sx={{ mt: 1, minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
                {s.again}
              </Button>
            ) : null}
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Tooltip title={s.skip}>
          <span>
            <IconButton aria-label={s.skip} onClick={() => decide("skip")} disabled={!top} sx={roundBtn(c.surface, c.danger)}>
              <X size={26} weight="bold" aria-hidden />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={s.undo}>
          <span>
            <IconButton aria-label={s.undo} onClick={onUndo} disabled={!canUndo} sx={roundBtn(c.surface, c.textSecondary, 44)}>
              <ArrowCounterClockwise size={18} weight="bold" aria-hidden />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title={s.save}>
          <span>
            <IconButton aria-label={s.save} onClick={() => decide("save")} disabled={!top} sx={roundBtn(t.brand.yellow, t.brand.inkNavy)}>
              <Heart size={26} weight="fill" aria-hidden />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
      <Box sx={{ fontSize: 13, fontWeight: 650, color: c.textMuted, textAlign: "center" }}>
        {top ? `${s.position(seen + 1, total)} · ${s.hint}` : " "}
      </Box>
    </Box>
  );
}
