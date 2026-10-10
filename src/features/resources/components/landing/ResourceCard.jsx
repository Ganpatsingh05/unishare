"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AnimatePresence, m } from "framer-motion";
import { ArrowRightUpIcon as ArrowRightUp } from "@solar-icons/react/linear/arrow-right-up";
import { CopyIcon as Copy } from "@solar-icons/react/bold-duotone/copy";
import { CopyCheckIcon as CopyCheck } from "@solar-icons/react/bold-duotone/copy-check";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import { categoryColor, categoryIcon, typeIcon } from "./resourceIcons";

const s = RESOURCE_STRINGS.card;
const DAY = 86400000;

export function addedWhen(date, now = new Date()) {
  if (!date) return "";
  const days = Math.floor((new Date(now).setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / DAY);
  if (days <= 0) return RESOURCE_STRINGS.when.today;
  if (days === 1) return RESOURCE_STRINGS.when.yesterday;
  return RESOURCE_STRINGS.when.days(days);
}

/**
 * A library card: a category-coloured top with the type stamp, the title,
 * a short note, the site it lives on, and tags. "Open" goes to the link in
 * a new tab; "Copy link" copies it. Preview cards drop the actions.
 */
const ResourceCard = forwardRef(function ResourceCard({ item, copied, onCopy, highlight, preview = false, stamp = null }, ref) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const color = categoryColor(item.category, dark);
  const CatIcon = categoryIcon(item.category);
  const TypeIcon = typeIcon(item.type);
  const headingId = `rs-title-${item.id}`;

  return (
    <Box
      ref={ref}
      component="article"
      id={preview ? undefined : `r-${item.id}`}
      aria-labelledby={headingId}
      sx={{
        position: "relative",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        scrollMarginTop: `${t.layout.stickyTop + 24}px`,
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: c.surface,
        border: `1px solid ${highlight ? t.brand.yellow : c.border}`,
        boxShadow: highlight ? `0 0 0 4px ${dark ? "rgba(255,212,59,0.18)" : "rgba(255,212,59,0.35)"}` : t.elevation[1],
        overflow: "hidden",
        transition: "box-shadow 300ms ease, border-color 300ms ease, transform 200ms ease",
        "&:hover": preview ? undefined : { transform: "translateY(-2px)", boxShadow: t.elevation[2] },
      }}
    >
      {/* Category band, like the coloured top of an index card. */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, px: 2, py: 1.1, backgroundColor: color, color: dark ? "#0B1220" : "#fff" }}>
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 12.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <CatIcon size={17} aria-hidden />
          {RESOURCE_STRINGS.categories[item.category] || item.category}
        </Box>
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 0.9, py: 0.25, borderRadius: "6px", backgroundColor: dark ? "rgba(11,18,32,0.14)" : "rgba(0,0,0,0.2)", fontSize: 12, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <TypeIcon size={15} aria-hidden />
          {RESOURCE_STRINGS.types[item.type] || item.type}
        </Box>
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1, flex: 1, backgroundImage: `repeating-linear-gradient(180deg, transparent 0 27px, ${dark ? "rgba(148,163,184,0.08)" : "rgba(30,64,120,0.06)"} 27px 28px)` }}>
        {stamp ? <Box>{stamp}</Box> : null}
        <Box component="h3" id={headingId} sx={{ m: 0, fontSize: 17, fontWeight: 780, lineHeight: 1.3, letterSpacing: "-0.01em", overflowWrap: "anywhere" }}>{item.title}</Box>
        {item.desc ? (
          <Box sx={{ fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere" }}>{item.desc}</Box>
        ) : null}
        {item.tags.length ? (
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {item.tags.slice(0, 5).map((tag) => (
              <Box key={tag} component="span" sx={{ px: 0.9, py: 0.2, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 700, backgroundColor: c.surfaceInteractive, color: c.textSecondary }}>#{tag}</Box>
            ))}
          </Box>
        ) : null}
        <Box sx={{ mt: "auto", pt: 1, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
          <Box sx={{ minWidth: 0, fontSize: 12.5, fontWeight: 650, color: c.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {item.domain}
            {item.createdAt ? ` · ${s.added(addedWhen(item.createdAt))}` : ""}
          </Box>
          {!preview && item.url ? (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button size="small" onClick={onCopy} startIcon={copied ? <CopyCheck size={17} aria-hidden /> : <Copy size={17} aria-hidden />} sx={{ minHeight: 40, color: copied ? c.success : c.textSecondary }}>
                <AnimatePresence mode="wait" initial={false}>
                  <m.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}>
                    {copied ? s.copied : s.copy}
                  </m.span>
                </AnimatePresence>
              </Button>
              <Button component="a" href={item.url} target="_blank" rel="noopener noreferrer" aria-label={s.openLabel(item.title)} size="small" variant="contained" endIcon={<ArrowRightUp size={16} aria-hidden />} sx={{ minHeight: 40, px: 1.75, borderRadius: `${t.radius.pill}px` }}>
                {s.open}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
});

export default ResourceCard;
