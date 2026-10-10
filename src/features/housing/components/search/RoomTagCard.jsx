"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { m } from "framer-motion";
import { Bed, Heart, ImageSquare, MapPin } from "@phosphor-icons/react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import { HOUSING_STRINGS } from "../../constants/housingStrings";

const s = HOUSING_STRINGS.tag;
const r = HOUSING_STRINGS.results;
const DAY = 86400000;
const HORIZON = 60; // days shown by the move-in bar
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

/** "Ready now", "Free in 12 days" or a date, plus how full the bar is. */
function availability(room) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!room.moveIn || room.moveIn <= today) return { text: s.readyNow, fill: 1, now: true };
  const days = Math.ceil((room.moveIn - today) / DAY);
  return { text: days <= HORIZON ? s.inDays(days) : s.from(dateFmt.format(room.moveIn)), fill: Math.max(0.06, 1 - days / HORIZON), now: false };
}

/**
 * A listing as a key tag: the rent hangs from a yellow tag on a string over
 * the photo (it swings when the card is hovered), beds show as little bed
 * marks, and a bar counts down to the move-in date.
 */
export default function RoomTagCard({ room, headingId, saved, onToggleSave, preview = false }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const when = availability(room);
  const beds = Math.min(room.beds, 4);

  return (
    <Box
      component={m.article}
      aria-labelledby={headingId}
      initial="rest"
      whileHover="hover"
      animate="rest"
      sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", borderRadius: `${t.radius.xl}px`, backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: t.elevation[1], overflow: "hidden", transition: "box-shadow 200ms ease, transform 200ms ease", "&:hover": { boxShadow: t.elevation[2], transform: "translateY(-3px)" }, "&:focus-within": { borderColor: c.action } }}
    >
      {/* Photo, inset with a rounded frame. */}
      <Box sx={{ p: 1, pb: 0 }}>
        <Box sx={{ position: "relative", aspectRatio: "5 / 4", borderRadius: `${t.radius.lg}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive, display: "grid", placeItems: "center", color: c.textOnInset }}>
          {room.photos[0] ? (
            <Box component={m.img} src={room.photos[0]} alt="" loading="lazy" variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.5 }} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <ImageSquare size={36} weight="duotone" aria-hidden />
          )}

          {/* The tag on its string. */}
          <Box component={m.div} variants={{ rest: { rotate: -4 }, hover: { rotate: [null, 7, -3, 2, 0] } }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ originX: 0.12, originY: 0 }} sx={{ position: "absolute", left: 14, top: 0, zIndex: 1 }}>
            <Box aria-hidden sx={{ width: 2, height: 16, ml: "14px", backgroundColor: dark ? "rgba(255,255,255,0.7)" : t.brand.inkNavy }} />
            <Box
              sx={{
                position: "relative",
                display: "inline-flex",
                alignItems: "baseline",
                gap: 0.4,
                pl: 3.25,
                pr: 1.5,
                py: 0.75,
                // A tag: square right end, clipped point on the left.
                clipPath: "polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)",
                backgroundColor: t.brand.yellow,
                color: t.brand.inkNavy,
                filter: "drop-shadow(0 4px 8px rgba(8,18,32,0.25))",
              }}
            >
              <Box component="span" aria-hidden sx={{ position: "absolute", left: 10, top: "50%", width: 7, height: 7, mt: "-3.5px", borderRadius: "50%", backgroundColor: c.surface }} />
              <Box component="span" sx={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                {Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}
              </Box>
              <Box component="span" sx={{ fontSize: 11.5, fontWeight: 700 }}>{r.perMonth}</Box>
            </Box>
          </Box>

          {onToggleSave ? (
            <IconButton
              aria-label={saved ? r.unsave(room.title) : r.save(room.title)}
              aria-pressed={saved}
              onClick={onToggleSave}
              sx={{ position: "absolute", top: 10, right: 10, zIndex: 2, width: 40, height: 40, backgroundColor: saved ? t.brand.yellow : "rgba(8,18,32,0.55)", color: saved ? t.brand.inkNavy : "#fff", "&:hover": { backgroundColor: saved ? t.brand.yellow : "rgba(8,18,32,0.75)" } }}
            >
              <Heart size={19} weight={saved ? "fill" : "bold"} aria-hidden />
            </IconButton>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ p: 2, pt: 1.75, display: "flex", flexDirection: "column", gap: 1.25, flex: 1 }}>
        <Box>
          <Box component="h3" id={headingId} sx={{ m: 0, fontSize: 16.5, fontWeight: 750, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {preview ? (
              room.title
            ) : (
              <Box component={Link} href={`/housing/${room.id}`} sx={{ color: "inherit", textDecoration: "none", "&::after": { content: '""', position: "absolute", inset: 0 }, "&:focus-visible": { outline: "none" } }}>
                {room.title}
              </Box>
            )}
          </Box>
          {room.location ? (
            <Box sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5, fontSize: 13.5, color: c.textSecondary, minWidth: 0 }}>
              <MapPin size={15} weight="duotone" aria-hidden style={{ flexShrink: 0 }} />
              <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.location}</Box>
            </Box>
          ) : null}
        </Box>

        <Box sx={{ mt: "auto", display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: 1.5 }}>
          {/* Beds as marks. */}
          <Box aria-label={s.beds(room.beds)} role="img" sx={{ display: "flex", alignItems: "center", gap: 0.25, color: dark ? t.brand.skyBright : t.brand.actionBlue }}>
            {Array.from({ length: beds }, (_, i) => <Bed key={i} size={18} weight="fill" aria-hidden />)}
            {room.beds > 4 ? <Box component="span" sx={{ ml: 0.5, fontSize: 12.5, fontWeight: 760 }}>+{room.beds - 4}</Box> : null}
          </Box>
          {/* Move-in countdown. */}
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 12.5, fontWeight: 750, color: when.now ? c.success : c.textSecondary, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{when.text}</Box>
            <Box aria-hidden sx={{ mt: 0.5, height: 4, borderRadius: 2, backgroundColor: c.surfaceInteractive, overflow: "hidden" }}>
              <Box sx={{ width: `${Math.round(when.fill * 100)}%`, height: "100%", borderRadius: 2, backgroundColor: when.now ? c.success : t.brand.yellow, ml: "auto" }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Loading placeholder with the same shape as the tag card. */
export function RoomTagCardSkeleton() {
  const t = useRideTokens();
  const bar = (w, h = 14) => <Box sx={{ width: w, height: h, borderRadius: `${t.radius.xs}px`, backgroundColor: t.color.surfaceInteractive }} />;
  return (
    <Box aria-hidden sx={{ height: "100%", borderRadius: `${t.radius.xl}px`, border: `1px solid ${t.color.border}`, backgroundColor: t.color.surface, overflow: "hidden" }}>
      <Box sx={{ p: 1, pb: 0 }}>
        <Box sx={{ aspectRatio: "5 / 4", borderRadius: `${t.radius.lg}px`, backgroundColor: t.color.surfaceInteractive }} />
      </Box>
      <Box sx={{ p: 2, pt: 1.75, display: "flex", flexDirection: "column", gap: 1 }}>
        {bar("80%", 18)}
        {bar("55%")}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          {bar(60, 18)}
          {bar("45%", 8)}
        </Box>
      </Box>
    </Box>
  );
}
