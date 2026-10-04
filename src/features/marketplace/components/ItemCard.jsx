"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import { m } from "framer-motion";
import { MapPointIcon as MapPoint } from "@solar-icons/react/bold-duotone/map-point";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { MARKET_STRINGS } from "../constants/marketStrings";
import { ageText, rupees } from "../utils/itemModel";
import { categoryIcon, conditionColor } from "./marketIcons";

const s = MARKET_STRINGS;

/**
 * A listing card: the photo in a frame with a swing price tag on a string,
 * a condition chip, then title, pickup place and age. The whole card links
 * to the item page; hovering swings the tag and zooms the photo.
 */
export default function ItemCard({ item, highlight }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const Icon = categoryIcon(item.category);
  const condColor = conditionColor(item.condition, dark);
  const headingId = `mk-${item.id}`;

  return (
    <Box
      component={m.article}
      id={`i-${item.id}`}
      aria-labelledby={headingId}
      initial="rest"
      whileHover="hover"
      animate="rest"
      sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", scrollMarginTop: `${t.layout.stickyTop + 24}px`, borderRadius: `${t.radius.lg}px`, backgroundColor: c.surface, border: `1px solid ${highlight ? t.brand.yellow : c.border}`, boxShadow: highlight ? `0 0 0 4px ${dark ? "rgba(255,212,59,0.18)" : "rgba(255,212,59,0.35)"}` : t.elevation[1], overflow: "hidden", transition: "box-shadow 220ms ease, transform 220ms ease, border-color 300ms ease", "&:hover": { transform: "translateY(-3px)", boxShadow: t.elevation[2] }, "&:focus-within": { borderColor: c.action } }}
    >
      <Box sx={{ p: 1, pb: 0 }}>
        <Box sx={{ position: "relative", aspectRatio: "1 / 1", borderRadius: `${t.radius.md}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive, display: "grid", placeItems: "center", color: c.textOnInset }}>
          {item.photo ? (
            <Box component={m.img} src={item.photo} alt="" loading="lazy" variants={{ rest: { scale: 1 }, hover: { scale: 1.06 } }} transition={{ duration: 0.5 }} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Icon size={56} aria-hidden />
          )}
          {/* Swing tag with the price, hanging from a string at the top right. */}
          <Box component={m.span} variants={{ rest: { rotate: 4 }, hover: { rotate: [null, -8, 5, -3, 0] } }} transition={{ duration: 0.9, ease: "easeOut" }} style={{ originX: 0.85, originY: 0 }} sx={{ position: "absolute", right: 14, top: 0, zIndex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <Box component="span" aria-hidden sx={{ width: 2, height: 14, mr: "16px", backgroundColor: dark ? "rgba(255,255,255,0.75)" : t.brand.inkNavy }} />
            <Box component="span" sx={{ position: "relative", pl: 1.25, pr: 3, py: 0.6, clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)", backgroundColor: t.brand.yellow, color: t.brand.inkNavy, fontSize: 17, fontWeight: 850, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", filter: "drop-shadow(0 4px 8px rgba(8,18,32,0.25))" }}>
              {item.price === 0 ? s.card.free : rupees(item.price)}
              <Box component="span" aria-hidden sx={{ position: "absolute", right: 7, top: "50%", width: 6, height: 6, mt: "-3px", borderRadius: "50%", backgroundColor: c.surface }} />
            </Box>
          </Box>
          <Box component="span" sx={{ position: "absolute", left: 10, bottom: 10, display: "inline-flex", alignItems: "center", gap: 0.6, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 800, backgroundColor: dark ? "rgba(11,18,32,0.82)" : "rgba(255,255,255,0.92)", color: condColor, backdropFilter: "blur(4px)" }}>
            <Box component="span" aria-hidden sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: condColor }} />
            {s.conditions[item.condition]}
          </Box>
        </Box>
      </Box>
      <Box sx={{ p: 1.75, pt: 1.5, display: "flex", flexDirection: "column", gap: 0.75, flex: 1 }}>
        <Box component="h3" id={headingId} sx={{ m: 0, fontSize: 16, fontWeight: 760, lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          <Box component={Link} href={`/marketplace/buy/${encodeURIComponent(item.id)}`} aria-label={s.card.open(item.title)} sx={{ color: "inherit", textDecoration: "none", "&::after": { content: '""', position: "absolute", inset: 0 }, "&:focus-visible": { outline: "none" } }}>
            {item.title}
          </Box>
        </Box>
        <Box sx={{ mt: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, fontSize: 13, color: c.textSecondary }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
            <MapPoint size={16} aria-hidden style={{ flexShrink: 0 }} />
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.location || "—"}</Box>
          </Box>
          <Box component="span" sx={{ flexShrink: 0, color: c.textMuted, fontWeight: 650 }}>{ageText(item.createdAt, s.when)}</Box>
        </Box>
      </Box>
    </Box>
  );
}

export function ItemCardSkeleton() {
  const t = useRideTokens();
  const bar = (w, h = 14) => <Box sx={{ width: w, height: h, borderRadius: `${t.radius.xs}px`, backgroundColor: t.color.surfaceInteractive }} />;
  return (
    <Box aria-hidden sx={{ borderRadius: `${t.radius.lg}px`, border: `1px solid ${t.color.border}`, backgroundColor: t.color.surface, p: 1 }}>
      <Box sx={{ aspectRatio: "1 / 1", borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surfaceInteractive }} />
      <Box sx={{ p: 0.75, pt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
        {bar("80%", 16)}
        {bar("50%")}
      </Box>
    </Box>
  );
}
