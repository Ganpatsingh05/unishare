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
import { BookmarkOpenedIcon as BookmarkOpened } from "@solar-icons/react/bold-duotone/bookmark-opened";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import useResources from "../../hooks/useResources";
import { categoriesIn, matchResources, RESOURCE_TYPES } from "../../utils/resourceModel";
import BookmarkTitle from "./BookmarkTitle";
import Bookshelf from "./Bookshelf";
import ResourceCard from "./ResourceCard";
import { categoryIcon, typeIcon } from "./resourceIcons";
import SuggestionsLink from "../manage/SuggestionsLink";

const s = RESOURCE_STRINGS;
const STEP = 12;

function Chips({ label, options, value, onChange, iconFor, labelFor }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={label} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {options.map((key) => {
        const on = key === value;
        const Icon = iconFor(key);
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(on && key !== "all" ? "all" : key)} sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
            <Icon size={18} aria-hidden />
            {labelFor(key)}
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
  const { items, status, reload } = useResources();
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(STEP);
  const [copied, setCopied] = useState(null);
  const [highlight, setHighlight] = useState(null);
  const cards = useRef(new Map());

  const categories = useMemo(() => categoriesIn(items), [items]);
  const results = useMemo(() => matchResources(items, { category, type, query }), [items, category, type, query]);
  const filtered = category !== "all" || type !== "all" || query.trim();

  const openResource = useCallback(
    (id) => {
      const index = items.findIndex((r) => r.id === id);
      if (index < 0) return;
      setCategory("all");
      setType("all");
      setQuery("");
      setShown((n) => Math.max(n, index + 1));
      setHighlight(id);
      requestAnimationFrame(() => requestAnimationFrame(() => cards.current.get(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })));
      setTimeout(() => setHighlight((h) => (h === id ? null : h)), 2400);
    },
    [items, reduce]
  );

  // Shared links: /resources?r=<id>
  useEffect(() => {
    if (status !== "ready") return;
    const id = new URLSearchParams(window.location.search).get("r");
    if (id) openResource(id);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const copyLink = async (item) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.id);
      setTimeout(() => setCopied((cur) => (cur === item.id ? null : cur)), 1600);
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  };
  const reset = () => {
    setCategory("all");
    setType("all");
    setQuery("");
  };

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.library.loading} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} variant="rounded" height={210} sx={{ borderRadius: `${t.radius.lg}px` }} />)}
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
          action={filtered ? <Button variant="contained" onClick={reset} sx={{ minHeight: 44 }}>{s.empty.reset}</Button> : <Button component={Link} href="/resources/suggest" variant="contained" startIcon={<BookmarkOpened size={18} aria-hidden />} sx={{ minHeight: 44 }}>{s.hero.suggest}</Button>}
        />
      </Panel>
    );
  } else {
    body = (
      <>
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
          <AnimatePresence initial={false} mode="popLayout">
            {results.slice(0, shown).map((item, i) => (
              <Box component={m.li} key={item.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(i % STEP, 6) * 0.04, ease: t.motion.ease } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                <ResourceCard ref={(el) => (el ? cards.current.set(item.id, el) : cards.current.delete(item.id))} item={item} copied={copied === item.id} onCopy={() => copyLink(item)} highlight={highlight === item.id} />
              </Box>
            ))}
          </AnimatePresence>
        </Box>
        {results.length > shown ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" onClick={() => setShown((n) => n + STEP)} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.library.showMore}</Button>
          </Box>
        ) : null}
      </>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 3, md: 6 }, pb: { xs: 12, md: 9 } }}>
      <Box component="section" aria-labelledby="rs-title" sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }, alignItems: "center" }}>
        <Box sx={{ minWidth: 0 }}>
          <BookmarkTitle id="rs-title" before={s.hero.titleBefore} accent={s.hero.titleAccent} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54, md: 62 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }} />
          <Box component="p" sx={{ m: 0, mt: 1, mb: 3, maxWidth: 480, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{s.hero.lead}</Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/resources/suggest" variant="contained" startIcon={<BookmarkOpened size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{s.hero.suggest}</Button>
            <SuggestionsLink sx={{ minHeight: 48 }} />
          </Box>
        </Box>
        <Bookshelf items={items} status={status} onOpen={openResource} />
      </Box>

      <Box component="section" id="rs-library" aria-labelledby="rs-library-title" sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop}px` }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
          <Box>
            <Box component="h2" id="rs-library-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.library.title}</Box>
            <Box aria-live="polite" sx={{ mt: 0.5, fontSize: 14.5, color: c.textSecondary }}>{status === "ready" ? s.library.count(results.length) : s.library.loading}</Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 420 }, display: "flex", alignItems: "center", gap: 1.25, minHeight: 52, px: 1.75, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surface, border: `1px solid ${c.borderStrong}`, transition: "border-color 160ms ease, box-shadow 160ms ease", "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` } }}>
            <Magnifier size={22} color={c.accentText} aria-hidden />
            <InputBase value={query} onChange={(e) => { setQuery(e.target.value.slice(0, 80)); setShown(STEP); }} placeholder={s.library.searchPlaceholder} inputProps={{ "aria-label": s.library.searchLabel, type: "search", enterKeyHint: "search" }} sx={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 }, "& input::-webkit-search-cancel-button": { display: "none" } }} />
            {query ? <IconButton onClick={() => setQuery("")} aria-label={s.library.clear} sx={{ width: 36, height: 36, color: c.textMuted }}><Close size={18} aria-hidden /></IconButton> : null}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 1, mb: 3 }}>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Chips label={s.categories.label} options={["all", ...categories]} value={category} onChange={(v) => { setCategory(v); setShown(STEP); }} iconFor={categoryIcon} labelFor={(k) => s.categories[k] || k} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Chips label={s.types.label} options={["all", ...RESOURCE_TYPES]} value={type} onChange={(v) => { setType(v); setShown(STEP); }} iconFor={typeIcon} labelFor={(k) => s.types[k]} />
          </Box>
        </Box>
        {body}
      </Box>
    </Box>
  );
}

/** Resources landing page body. The route page renders the footer after it. */
export default function ResourcesLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
