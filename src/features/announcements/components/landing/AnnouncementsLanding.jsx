"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Skeleton from "@mui/material/Skeleton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { MagnifierIcon as Magnifier } from "@solar-icons/react/line-duotone/magnifier";
import { PenNewSquareIcon as PenNewSquare } from "@solar-icons/react/bold-duotone/pen-new-square";
import { SirenRoundedIcon as SirenRounded } from "@solar-icons/react/bold-duotone/siren-rounded";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { ANNOUNCEMENT_STRINGS } from "../../constants/announcementStrings";
import useAnnouncements from "../../hooks/useAnnouncements";
import { groupByDay, matchFeed, topicsIn } from "../../utils/announcementModel";
import OnAirTitle from "./OnAirTitle";
import FlapBoard from "./FlapBoard";
import AnnouncementCard from "./AnnouncementCard";
import ManageLink from "../manage/ManageLink";
import { tagIcon, TAG_ICONS } from "./tagIcons";

const s = ANNOUNCEMENT_STRINGS;
const STEP = 10;
const dayFmt = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long" });

function dayLabel(date, now = new Date()) {
  if (!date) return "";
  if (date.toDateString() === now.toDateString()) return s.day.today;
  const y = new Date(now);
  y.setDate(y.getDate() - 1);
  if (date.toDateString() === y.toDateString()) return s.day.yesterday;
  return dayFmt.format(date);
}

function SearchField({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minHeight: 52, px: 1.75, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surface, border: `1px solid ${c.borderStrong}`, transition: "border-color 160ms ease, box-shadow 160ms ease", "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` } }}>
      <Magnifier size={22} color={c.accentText} aria-hidden />
      <InputBase value={value} onChange={(e) => onChange(e.target.value.slice(0, 80))} placeholder={s.feed.searchPlaceholder} inputProps={{ "aria-label": s.feed.searchLabel, type: "search", enterKeyHint: "search" }} sx={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 }, "& input::-webkit-search-cancel-button": { display: "none" } }} />
      {value ? (
        <IconButton onClick={() => onChange("")} aria-label={s.feed.clear} sx={{ width: 36, height: 36, color: c.textMuted }}>
          <Close size={18} aria-hidden />
        </IconButton>
      ) : null}
    </Box>
  );
}

function TopicChips({ topics, value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.tags.label} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {["all", ...topics].map((key) => {
        const on = key === value;
        const Icon = key === "all" ? TAG_ICONS.all : tagIcon(key);
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(on && key !== "all" ? "all" : key)} sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
            <Icon size={18} aria-hidden />
            {s.tags[key] || key}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function LandingContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { items, status, reload } = useAnnouncements();
  const [tag, setTag] = useState("all");
  const [query, setQuery] = useState("");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [shown, setShown] = useState(STEP);
  const [expanded, setExpanded] = useState(() => new Set());
  const [copied, setCopied] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const cards = useRef(new Map());

  const topics = useMemo(() => topicsIn(items), [items]);
  const results = useMemo(() => matchFeed(items, { tag, query, urgentOnly }), [items, tag, query, urgentOnly]);
  const groups = useMemo(() => groupByDay(results.slice(0, shown)), [results, shown]);
  const urgentCount = items.filter((a) => a.priority === "high").length;
  const filtered = tag !== "all" || query.trim() || urgentOnly;

  // Open one post: clear filters if they hide it, expand it, scroll to it.
  const openPost = useCallback(
    (id) => {
      const index = items.findIndex((a) => a.id === id);
      if (index < 0) return;
      setTag("all");
      setQuery("");
      setUrgentOnly(false);
      setShown((n) => Math.max(n, index + 1));
      setExpanded((prev) => new Set(prev).add(id));
      setHighlight(id);
      requestAnimationFrame(() => requestAnimationFrame(() => cards.current.get(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })));
      setTimeout(() => setHighlight((h) => (h === id ? null : h)), 2400);
    },
    [items, reduce]
  );

  // Shared links: /announcements?a=<id>
  useEffect(() => {
    if (status !== "ready") return;
    const id = new URLSearchParams(window.location.search).get("a");
    if (id) openPost(id);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyLink = async (id) => {
    const url = `${window.location.origin}/announcements?a=${encodeURIComponent(id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied((cur) => (cur === id ? null : cur)), 1600);
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  };
  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.feed.loading} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={150} sx={{ borderRadius: `${t.radius.lg}px` }} />)}
      </Box>
    );
  } else if (status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={reload} retryLabel={s.error.retry} /></Panel>;
  } else if (!results.length) {
    const none = !items.length;
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock
          title={none ? s.empty.noneTitle : s.empty.title}
          body={none ? s.empty.noneBody : s.empty.body}
          action={
            filtered ? (
              <Button variant="contained" onClick={() => { setTag("all"); setQuery(""); setUrgentOnly(false); }} sx={{ minHeight: 44 }}>{s.empty.reset}</Button>
            ) : (
              <Button component={Link} href="/announcements/submit" variant="contained" startIcon={<PenNewSquare size={18} aria-hidden />} sx={{ minHeight: 44 }}>{s.hero.post}</Button>
            )
          }
        />
      </Panel>
    );
  } else {
    body = (
      <>
        <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: { xs: 3, md: 4 } }}>
          {groups.map((group) => (
            <Box component="li" key={group.key} sx={{ display: "grid", gap: { xs: 1.25, md: 3 }, gridTemplateColumns: { xs: "1fr", md: "180px minmax(0, 1fr)" }, alignItems: "start" }}>
              {/* Day label on a rail. */}
              <Box sx={{ position: { md: "sticky" }, top: { md: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` }, display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box component="span" aria-hidden sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: t.brand.yellow, boxShadow: `0 0 0 4px ${c.surface}, 0 0 0 5px ${c.border}`, flexShrink: 0 }} />
                <Box component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 800, color: c.text }}>{dayLabel(group.date)}</Box>
              </Box>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5, position: "relative", "&::before": { content: '""', position: "absolute", left: { xs: 5, md: -29 }, top: 0, bottom: 0, width: 2, borderRadius: 1, backgroundColor: c.border, display: { xs: "none", md: "block" } } }}>
                <AnimatePresence initial={false}>
                  {group.items.map((item, i) => (
                    <Box component={m.li} key={item.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(i, 5) * 0.04, ease: t.motion.ease } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                      <AnnouncementCard
                        ref={(el) => (el ? cards.current.set(item.id, el) : cards.current.delete(item.id))}
                        item={item}
                        expanded={expanded.has(item.id)}
                        onToggle={() => toggle(item.id)}
                        copied={copied === item.id}
                        onCopy={() => copyLink(item.id)}
                        highlight={highlight === item.id}
                      />
                    </Box>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          ))}
        </Box>
        {results.length > shown ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" onClick={() => setShown((n) => n + STEP)} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.feed.showMore}</Button>
          </Box>
        ) : null}
      </>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 3, md: 6 }, pb: { xs: 12, md: 9 } }}>
      <Box component="section" aria-labelledby="an-title" sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }, alignItems: "center" }}>
        <Box sx={{ minWidth: 0 }}>
          <OnAirTitle id="an-title" before={s.hero.titleBefore} accent={s.hero.titleAccent} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54, md: 64 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }} />
          <Box component="p" sx={{ m: 0, mt: 2, mb: 3, maxWidth: 480, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{s.hero.lead}</Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/announcements/submit" variant="contained" startIcon={<PenNewSquare size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{s.hero.post}</Button>
            <ManageLink sx={{ minHeight: 48 }} />
          </Box>
        </Box>
        <FlapBoard items={items} status={status} onOpen={openPost} />
      </Box>

      <Box component="section" id="an-feed" aria-labelledby="an-feed-title" sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop}px` }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
          <Box>
            <Box component="h2" id="an-feed-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.feed.title}</Box>
            <Box aria-live="polite" sx={{ mt: 0.5, fontSize: 14.5, color: c.textSecondary }}>{status === "ready" ? s.feed.count(results.length) : s.feed.loading}</Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 420 } }}>
            <SearchField value={query} onChange={(v) => { setQuery(v); setShown(STEP); }} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, minWidth: 0 }}>
          {urgentCount ? (
            <ButtonBase onClick={() => { setUrgentOnly((v) => !v); setShown(STEP); }} aria-pressed={urgentOnly} sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 760, border: `1px solid ${urgentOnly ? "transparent" : c.border}`, backgroundColor: urgentOnly ? c.danger : c.surface, color: urgentOnly ? "#fff" : c.danger, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
              <SirenRounded size={18} aria-hidden />
              {s.feed.urgentOnly}
              <Box component="span" sx={{ fontVariantNumeric: "tabular-nums", opacity: 0.85 }}>{urgentCount}</Box>
            </ButtonBase>
          ) : null}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <TopicChips topics={topics} value={tag} onChange={(v) => { setTag(v); setShown(STEP); }} />
          </Box>
        </Box>
        {body}
      </Box>
    </Box>
  );
}

/** Announcements landing page body. The route page renders the footer after it. */
export default function AnnouncementsLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
