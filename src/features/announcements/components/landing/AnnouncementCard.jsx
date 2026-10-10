"use client";

import { forwardRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { AnimatePresence, m } from "framer-motion";
import { SirenRoundedIcon as SirenRounded } from "@solar-icons/react/bold-duotone/siren-rounded";
import { LinkRoundIcon as LinkRound } from "@solar-icons/react/bold-duotone/link-round";
import { CopyCheckIcon as CopyCheck } from "@solar-icons/react/bold-duotone/copy-check";
import { AltArrowDownIcon as AltArrowDown } from "@solar-icons/react/linear/alt-arrow-down";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { ANNOUNCEMENT_STRINGS } from "../../constants/announcementStrings";
import { tagIcon } from "./tagIcons";

const s = ANNOUNCEMENT_STRINGS.card;
const timeFmt = new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit" });
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const LONG = 260; // characters before "Read more"

/** "5 min ago" / "3 h ago" today, "Yesterday", else "12 Oct". */
export function shortWhen(date, now = new Date()) {
  if (!date) return "";
  const mins = Math.max(0, Math.round((now - date) / 60000));
  if (mins < 60 && now.toDateString() === date.toDateString()) return mins < 1 ? ANNOUNCEMENT_STRINGS.day.now : ANNOUNCEMENT_STRINGS.day.minutes(mins);
  if (now.toDateString() === date.toDateString()) return ANNOUNCEMENT_STRINGS.day.hours(Math.floor(mins / 60));
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (y.toDateString() === date.toDateString()) return ANNOUNCEMENT_STRINGS.day.yesterday;
  return dateFmt.format(date);
}

/**
 * A post in the feed. Urgent posts get a red edge and stamp; FYI posts are
 * quieter. Long bodies expand in place. The link button copies a URL that
 * opens the feed scrolled to this post.
 */
const AnnouncementCard = forwardRef(function AnnouncementCard({ item, expanded, onToggle, copied, onCopy, highlight, preview = false, stamp = null }, ref) {
  const t = useRideTokens();
  const c = t.color;
  const urgent = item.priority === "high";
  const low = item.priority === "low";
  const long = item.body.length > LONG || item.body.split("\n").length > 4;
  const bodyId = `an-body-${item.id}`;
  const accent = urgent ? c.danger : low ? c.border : t.brand.yellow;

  return (
    <Box
      ref={ref}
      component="article"
      id={preview ? undefined : `a-${item.id}`}
      aria-labelledby={`an-title-${item.id}`}
      sx={{
        position: "relative",
        scrollMarginTop: `${t.layout.stickyTop + 24}px`,
        p: { xs: 2, sm: 2.5 },
        pl: { xs: 2.5, sm: 3 },
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: c.surface,
        border: `1px solid ${highlight ? t.brand.yellow : c.border}`,
        boxShadow: highlight ? `0 0 0 4px ${t.mode === "dark" ? "rgba(255,212,59,0.18)" : "rgba(255,212,59,0.35)"}` : t.elevation[1],
        transition: "box-shadow 300ms ease, border-color 300ms ease",
        overflow: "hidden",
        // Priority edge.
        "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: accent },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 1 }}>
        {stamp}
        {urgent ? (
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", background: `linear-gradient(${c.dangerSoft}, ${c.dangerSoft}), ${c.surface}`, color: c.danger }}>
            <SirenRounded size={15} aria-hidden />
            {s.urgent}
          </Box>
        ) : null}
        {low ? (
          <Box component="span" sx={{ px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: c.surfaceInteractive, color: c.textSecondary }}>{s.low}</Box>
        ) : null}
        {item.tags.map((tag) => {
          const Icon = tagIcon(tag);
          return (
            <Box key={tag} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12.5, fontWeight: 700, backgroundColor: c.actionSoft, color: c.accentText }}>
              <Icon size={15} aria-hidden />
              {ANNOUNCEMENT_STRINGS.tags[tag] || tag}
            </Box>
          );
        })}
      </Box>

      <Box component="h3" id={`an-title-${item.id}`} sx={{ m: 0, fontSize: { xs: 17, sm: 18.5 }, fontWeight: 780, lineHeight: 1.3, letterSpacing: "-0.01em", overflowWrap: "anywhere" }}>{item.title}</Box>

      <Box
        id={bodyId}
        sx={{
          mt: 0.75,
          fontSize: 15,
          lineHeight: 1.6,
          color: c.textSecondary,
          whiteSpace: "pre-line",
          overflowWrap: "anywhere",
          ...(long && !expanded ? { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" } : {}),
        }}
      >
        {item.body}
      </Box>

      <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
        <Box component="time" dateTime={item.createdAt?.toISOString()} sx={{ fontSize: 13, fontWeight: 650, color: c.textMuted }}>
          {item.createdAt ? s.posted(`${shortWhen(item.createdAt)} · ${timeFmt.format(item.createdAt)}`) : ""}
        </Box>
        <Box sx={{ display: preview ? "none" : "flex", gap: 0.5 }}>
          {long ? (
            <Button size="small" onClick={onToggle} aria-expanded={expanded} aria-controls={bodyId} endIcon={<Box component={m.span} animate={{ rotate: expanded ? 180 : 0 }} sx={{ display: "inline-flex" }}><AltArrowDown size={16} aria-hidden /></Box>} sx={{ minHeight: 40, color: c.accentText }}>
              {expanded ? s.less : s.more}
            </Button>
          ) : null}
          <Button size="small" onClick={onCopy} startIcon={copied ? <CopyCheck size={18} aria-hidden /> : <LinkRound size={18} aria-hidden />} sx={{ minHeight: 40, color: copied ? c.success : c.textSecondary }}>
            <AnimatePresence mode="wait" initial={false}>
              <m.span key={copied ? "y" : "n"} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.14 }}>
                {copied ? s.copied : s.copy}
              </m.span>
            </AnimatePresence>
          </Button>
        </Box>
      </Box>
    </Box>
  );
});

export default AnnouncementCard;
