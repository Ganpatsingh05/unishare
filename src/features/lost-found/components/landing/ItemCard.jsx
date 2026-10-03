"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { m } from "framer-motion";
import { CalendarIcon as Calendar } from "@solar-icons/react/bold-duotone/calendar";
import { MapPointIcon as MapPoint } from "@solar-icons/react/bold-duotone/map-point";
import { VerifiedCheckIcon as VerifiedCheck } from "@solar-icons/react/bold-duotone/verified-check";
import { DangerCircleIcon as DangerCircle } from "@solar-icons/react/bold-duotone/danger-circle";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";
import { ageInDays, ticketCode } from "../../utils/itemModel";
import { CATEGORY_ICONS } from "./categoryIcons";

const s = LOST_FOUND_STRINGS.card;
const w = LOST_FOUND_STRINGS.when;

export function whenText(item, now = new Date()) {
  const days = ageInDays(item, now);
  if (days === null) return w.unknown;
  if (days === 0) return w.today;
  if (days === 1) return w.yesterday;
  return w.days(days);
}

function Picture({ item, tint }) {
  const t = useRideTokens();
  const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;
  return (
    <Box sx={{ position: "relative", aspectRatio: "4 / 3", overflow: "hidden", backgroundColor: tint, display: "grid", placeItems: "center" }}>
      {item.images[0] ? (
        <Box component={m.img} src={item.images[0]} alt="" loading="lazy" variants={{ rest: { scale: 1 }, hover: { scale: 1.05 } }} transition={{ duration: 0.5 }} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <Icon size={60} color={t.color.textOnInset} aria-hidden />
      )}
    </Box>
  );
}

function Facts({ item }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, fontSize: 13, color: c.textSecondary }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, minWidth: 0 }}>
        <MapPoint size={16} aria-hidden style={{ flexShrink: 0 }} />
        <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          <Box component="span" sx={{ fontWeight: 700 }}>{item.mode === "lost" ? s.lastSeen : s.foundAt}</Box> {item.place || s.noPlace}
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
        <Calendar size={16} aria-hidden />
        {whenText(item)}
      </Box>
    </Box>
  );
}

/**
 * A board post. Lost items are a taped-up "Missing" poster that hangs a
 * little crooked and straightens on hover; found items are a claim ticket
 * with a perforated tear line and a short claim code.
 */
export default function ItemCard({ item, onOpen, tilt = 0, preview = false }) {
  // A preview (report page) is plain content, not a button.
  const Root = preview ? Box : ButtonBase;
  const interactive = preview ? { component: m.div } : { component: m.button, nativeButton: true, onClick: () => onOpen(item), "aria-label": s.open(item.name) };
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const lost = item.mode === "lost";
  const accent = lost ? c.danger : c.success;
  const soft = lost ? c.dangerSoft : c.successSoft;
  const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;

  const base = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    textAlign: "left",
    backgroundColor: c.surface,
    color: c.text,
    border: `1px solid ${c.border}`,
    boxShadow: t.elevation[1],
    transition: "box-shadow 200ms ease, transform 260ms cubic-bezier(.22,1,.36,1)",
    "&:hover": { boxShadow: t.elevation[2] },
    "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 },
  };

  if (lost) {
    return (
      <Root
        {...interactive}
        initial="rest"
        whileHover="hover"
        animate="rest"
        sx={{ ...base, borderRadius: `${t.radius.md}px`, transform: `rotate(${tilt}deg)`, "&:hover": { boxShadow: t.elevation[2], transform: "rotate(0deg) translateY(-3px)" } }}
      >
        {/* Tape holding the poster up. */}
        <Box aria-hidden sx={{ position: "absolute", top: -9, left: "50%", width: 78, height: 20, ml: "-39px", transform: `rotate(${-tilt * 2 - 2}deg)`, backgroundColor: dark ? "rgba(255, 236, 170, 0.32)" : "rgba(255, 221, 120, 0.7)", boxShadow: "0 1px 2px rgba(0,0,0,0.12)", zIndex: 2, borderRadius: "2px" }} />
        <Box sx={{ px: 1.5, pt: 1.75, pb: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, fontSize: 13, fontWeight: 850, letterSpacing: "0.16em", textTransform: "uppercase", color: accent }}>
            <DangerCircle size={18} aria-hidden />
            {s.lost}
          </Box>
          <Box component="span" aria-hidden sx={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "50%", backgroundColor: soft, color: accent }}>
            <Icon size={18} />
          </Box>
        </Box>
        <Box sx={{ mx: 1.25, borderRadius: `${t.radius.sm}px`, overflow: "hidden" }}>
          <Picture item={item} tint={soft} />
        </Box>
        <Box sx={{ p: 1.5, pt: 1.25, display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
          <Box component="h3" sx={{ m: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</Box>
          <Box sx={{ mt: "auto" }}>
            <Facts item={item} />
          </Box>
        </Box>
      </Root>
    );
  }

  // Found: a claim ticket. Notches on both sides line up with a dashed tear.
  const notch = `radial-gradient(circle 9px at 0 calc(100% - 92px), transparent 98%, #000) left / 51% 100% no-repeat, radial-gradient(circle 9px at 100% calc(100% - 92px), transparent 98%, #000) right / 51% 100% no-repeat`;
  return (
    <Root
      {...interactive}
      initial="rest"
      whileHover="hover"
      animate="rest"
      sx={{ ...base, borderRadius: `${t.radius.lg}px`, border: "none", filter: `drop-shadow(0 0 0.5px ${c.borderStrong})`, mask: notch, WebkitMask: notch, "&:hover": { boxShadow: t.elevation[2], transform: "translateY(-3px)" } }}
    >
      <Box sx={{ p: 1, pb: 0 }}>
        <Box sx={{ position: "relative", borderRadius: `${t.radius.md}px`, overflow: "hidden" }}>
          <Picture item={item} tint={soft} />
          <Box component="span" sx={{ position: "absolute", left: 8, top: 8, display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.12em", textTransform: "uppercase", backgroundColor: dark ? "#0F2A22" : "#fff", color: accent, boxShadow: "0 2px 6px rgba(8,18,32,0.18)" }}>
            <VerifiedCheck size={16} aria-hidden />
            {s.found}
          </Box>
        </Box>
      </Box>
      <Box sx={{ px: 1.5, pt: 1.25, pb: 1.5, flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Box component="h3" sx={{ m: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.01em", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.name}</Box>
      </Box>
      {/* Stub below the tear line. */}
      <Box sx={{ height: 92, px: 1.5, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.75, borderTop: `2px dashed ${c.border}` }}>
        <Facts item={item} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, fontWeight: 760, color: c.textMuted }}>
          <Box component="span" sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", letterSpacing: "0.06em" }}>{s.ticket(item.id === "preview" ? "····" : ticketCode(item.id))}</Box>
          <Icon size={17} aria-hidden />
        </Box>
      </Box>
    </Root>
  );
}

export function ItemCardSkeleton() {
  const t = useRideTokens();
  const bar = (wd, h = 14) => <Box sx={{ width: wd, height: h, borderRadius: `${t.radius.xs}px`, backgroundColor: t.color.surfaceInteractive }} />;
  return (
    <Box aria-hidden sx={{ height: "100%", borderRadius: `${t.radius.lg}px`, border: `1px solid ${t.color.border}`, backgroundColor: t.color.surface, p: 1, display: "flex", flexDirection: "column", gap: 1 }}>
      <Box sx={{ aspectRatio: "4 / 3", borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surfaceInteractive }} />
      <Box sx={{ p: 0.75, display: "flex", flexDirection: "column", gap: 1 }}>
        {bar("75%", 18)}
        {bar("60%")}
        {bar("40%")}
      </Box>
    </Box>
  );
}
