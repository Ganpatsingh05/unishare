"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowsLeftRight, Heart, ImageSquare, X } from "@phosphor-icons/react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import usePageScrollLock from "../../hooks/usePageScrollLock";

const s = HOUSING_STRINGS.shortlist;
const r = HOUSING_STRINGS.results;
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const moveText = (room) => (!room.moveIn || room.moveIn <= new Date() ? r.availableNow : r.availableFrom(dateFmt.format(room.moveIn)));

function Thumb({ room, size = 56, t }) {
  return room.photos[0] ? (
    <Box component="img" src={room.photos[0]} alt="" loading="lazy" sx={{ width: size, height: size, borderRadius: `${t.radius.md}px`, objectFit: "cover", display: "block" }} />
  ) : (
    <Box sx={{ width: size, height: size, borderRadius: `${t.radius.md}px`, display: "grid", placeItems: "center", backgroundColor: t.color.surfaceInteractive, color: t.color.textMuted }}>
      <ImageSquare size={22} weight="duotone" aria-hidden />
    </Box>
  );
}

/** Side-by-side comparison: one column per saved room, best values marked. */
function Compare({ rooms, open, onClose, onRemove }) {
  const t = useRideTokens();
  usePageScrollLock(open);
  const c = t.color;
  const rents = rooms.map((x) => x.rent).filter(Number.isFinite);
  const cheapest = rents.length ? Math.min(...rents) : null;
  const soonest = rooms.reduce((best, x) => (!best || (x.moveIn || 0) < (best.moveIn || 0) ? x : best), null);
  const rows = [
    { key: "rent", label: s.rows.rent, value: (x) => (Number.isFinite(x.rent) ? `${formatRupee(x.rent)}${r.perMonth}` : "—"), best: (x) => rooms.length > 1 && x.rent === cheapest, bestLabel: s.cheapest },
    { key: "beds", label: s.rows.beds, value: (x) => r.beds(x.beds) },
    { key: "moveIn", label: s.rows.moveIn, value: moveText, best: (x) => rooms.length > 1 && x === soonest, bestLabel: s.soonest },
    { key: "area", label: s.rows.area, value: (x) => x.location || "—" },
  ];
  return (
    <Dialog open={open} onClose={onClose} container={typeof document === "undefined" ? undefined : document.body} maxWidth="lg" fullWidth aria-labelledby="hs-compare-title" slotProps={{ paper: { sx: { m: { xs: 1.5, sm: 4 }, width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" }, maxHeight: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" }, borderRadius: `${t.radius.xl}px`, backgroundColor: c.surface, color: c.text } } }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, pt: 2.5, pb: 1 }}>
        <Box component="h2" id="hs-compare-title" sx={{ m: 0, fontSize: 21, fontWeight: 760 }}>
          {s.compareTitle}
        </Box>
        <IconButton aria-label={s.close} onClick={onClose} sx={{ width: 44, height: 44 }}>
          <X size={20} aria-hidden />
        </IconButton>
      </Box>
      <Box sx={{ overflowX: "auto", px: { xs: 2, sm: 3 }, pb: 3, overscrollBehaviorX: "contain" }}>
        <Box component="table" sx={{ borderCollapse: "separate", borderSpacing: "12px 0", ml: "-12px", minWidth: "100%" }}>
          <Box component="thead">
            <Box component="tr">
              <Box component="th" scope="col" sx={{ width: 110 }} />
              {rooms.map((room) => (
                <Box component="th" scope="col" key={room.id} sx={{ minWidth: { xs: "62vw", sm: 200 }, width: { xs: "62vw", sm: 260 }, textAlign: "left", verticalAlign: "top", pb: 1.5 }}>
                  <Box sx={{ position: "relative" }}>
                    <Box sx={{ height: { xs: 120, sm: 150 }, borderRadius: `${t.radius.md}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive }}>
                      {room.photos[0] ? <Box component="img" src={room.photos[0]} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : null}
                    </Box>
                    <IconButton aria-label={s.remove(room.title)} onClick={() => onRemove(room.id)} size="small" sx={{ position: "absolute", top: 6, right: 6, backgroundColor: "rgba(8,18,32,0.6)", color: "#fff", "&:hover": { backgroundColor: "rgba(8,18,32,0.8)" } }}>
                      <X size={14} weight="bold" aria-hidden />
                    </IconButton>
                  </Box>
                  <Box sx={{ mt: 1, fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>{room.title}</Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Box component="tbody">
            {rows.map((row) => (
              <Box component="tr" key={row.key}>
                <Box component="th" scope="row" sx={{ textAlign: "left", fontSize: 13, fontWeight: 700, color: c.textMuted, py: 1.25, borderTop: `1px solid ${c.border}`, verticalAlign: "top" }}>
                  {row.label}
                </Box>
                {rooms.map((room) => {
                  const best = row.best?.(room);
                  return (
                    <Box component="td" key={room.id} sx={{ py: 1.25, borderTop: `1px solid ${c.border}`, fontSize: 15, fontWeight: row.key === "rent" ? 760 : 600, verticalAlign: "top" }}>
                      {row.value(room)}
                      {best ? (
                        <Box component="span" sx={{ display: "inline-block", ml: 1, px: 0.75, py: 0.15, borderRadius: `${t.radius.pill}px`, fontSize: 11.5, fontWeight: 800, backgroundColor: t.brand.yellow, color: t.brand.inkNavy, verticalAlign: "middle" }}>
                          {row.bestLabel}
                        </Box>
                      ) : null}
                    </Box>
                  );
                })}
              </Box>
            ))}
            <Box component="tr">
              <Box component="td" />
              {rooms.map((room) => (
                <Box component="td" key={room.id} sx={{ pt: 1.5 }}>
                  <Button component={Link} href={`/housing/${room.id}`} variant="contained" fullWidth sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
                    {s.view}
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}

/** Tray of saved rooms with a Compare button. */
export default function Shortlist({ rooms, onRemove, onClear }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  return (
    <Box
      component="section"
      aria-labelledby="hs-shortlist-title"
      sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", p: { xs: 1.5, sm: 2 }, borderRadius: `${t.radius.xl}px`, border: `1px solid ${rooms.length ? t.color.driverEdge : c.border}`, backgroundColor: c.surface, boxShadow: t.elevation[1] }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
        <Box sx={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: `${t.radius.sm}px`, backgroundColor: t.brand.yellow, color: t.brand.inkNavy, flexShrink: 0 }}>
          <Heart size={20} weight="fill" aria-hidden />
        </Box>
        <Box>
          <Box component="h2" id="hs-shortlist-title" sx={{ m: 0, fontSize: 15.5, fontWeight: 760 }}>
            {s.title}
          </Box>
          <Box sx={{ fontSize: 13, color: c.textMuted }}>{rooms.length ? s.count(rooms.length) : s.empty}</Box>
        </Box>
      </Box>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", gap: 1, flex: 1, minWidth: 0, overflowX: "auto", py: 0.5 }}>
        <AnimatePresence initial={false}>
          {rooms.map((room) => (
            <Box component={m.li} key={room.id} layout={!reduce} initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={t.motion.spring} sx={{ position: "relative", flexShrink: 0 }}>
              <Link href={`/housing/${room.id}`} aria-label={room.title}>
                <Thumb room={room} t={t} />
              </Link>
              <IconButton aria-label={s.remove(room.title)} onClick={() => onRemove(room.id)} size="small" sx={{ position: "absolute", top: -8, right: -8, width: 24, height: 24, backgroundColor: c.surface, border: `1px solid ${c.border}`, "&:hover": { backgroundColor: c.surfaceInteractive } }}>
                <X size={12} weight="bold" aria-hidden />
              </IconButton>
            </Box>
          ))}
        </AnimatePresence>
      </Box>
      {rooms.length ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="text" onClick={onClear} sx={{ minHeight: 44 }}>
            {s.clear}
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)} disabled={rooms.length < 2} startIcon={<ArrowsLeftRight size={17} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
            {s.compare}
          </Button>
        </Box>
      ) : null}
      <Compare rooms={rooms} open={open && rooms.length > 0} onClose={() => setOpen(false)} onRemove={onRemove} />
    </Box>
  );
}
