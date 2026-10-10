"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { MagnifierIcon as Magnifier } from "@solar-icons/react/line-duotone/magnifier";
import { TagPriceIcon as TagPrice } from "@solar-icons/react/bold-duotone/tag-price";
import { ArrowDownIcon as ArrowDown } from "@solar-icons/react/linear/arrow-down";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { MARKET_STRINGS } from "../constants/marketStrings";
import useMarketItems from "../hooks/useMarketItems";
import { CATEGORIES, CONDITIONS, matchItems } from "../utils/itemModel";
import CoinTitle from "./CoinTitle";
import Receipt from "./Receipt";
import ItemCard, { ItemCardSkeleton } from "./ItemCard";
import { categoryIcon, conditionColor } from "./marketIcons";

const s = MARKET_STRINGS;
const STEP = 12;
const SORTS = ["newest", "low", "high"];

function Chips({ label, options, value, onChange, renderLead, labelFor }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={label} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {options.map((key) => {
        const on = key === value;
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(on && key !== "all" ? "all" : key)} sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
            {renderLead(key, on)}
            {labelFor(key)}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function SortSwitch({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.sort.label} sx={{ display: "inline-flex", p: 0.5, gap: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive, maxWidth: "100%", overflowX: "auto" }}>
      {SORTS.map((key) => {
        const on = key === value;
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(key)} sx={{ position: "relative", flex: "0 0 auto", minHeight: 38, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13, fontWeight: 720, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}>
            {on ? <Box component={m.span} layoutId="mk-sort" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative" }}>{s.sort[key]}</Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function LandingContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const { items, status, reload } = useMarketItems();
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [shown, setShown] = useState(STEP);
  const [highlight, setHighlight] = useState(null);

  const results = useMemo(() => matchItems(items, { category, condition, query, sort }), [items, category, condition, query, sort]);
  const filtered = category !== "all" || condition !== "all" || query.trim();
  const reset = () => {
    setCategory("all");
    setCondition("all");
    setQuery("");
  };

  // Receipt line → its card in the market, highlighted.
  const openFromReceipt = useCallback(
    (id) => {
      reset();
      setSort("newest");
      const index = items.findIndex((it) => it.id === id);
      setShown((n) => Math.max(n, index + 1));
      setHighlight(id);
      requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(`i-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })));
      setTimeout(() => setHighlight((h) => (h === id ? null : h)), 2400);
    },
    [items, reduce]
  );

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.market.loading} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
        {Array.from({ length: 8 }, (_, i) => <ItemCardSkeleton key={i} />)}
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
          action={filtered ? <Button variant="contained" onClick={reset} sx={{ minHeight: 44 }}>{s.empty.reset}</Button> : <Button component={Link} href="/marketplace/sell" variant="contained" startIcon={<TagPrice size={18} aria-hidden />} sx={{ minHeight: 44 }}>{s.hero.sell}</Button>}
        />
      </Panel>
    );
  } else {
    body = (
      <>
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: { xs: 1.5, sm: 2 }, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
          <AnimatePresence initial={false} mode="popLayout">
            {results.slice(0, shown).map((item, i) => (
              <Box component={m.li} key={item.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(i % STEP, 7) * 0.035, ease: t.motion.ease } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                <ItemCard item={item} highlight={highlight === item.id}/>
              </Box>
            ))}
          </AnimatePresence>
        </Box>
        {results.length > shown ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" onClick={() => setShown((n) => n + STEP)} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.market.showMore}</Button>
          </Box>
        ) : null}
      </>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 3, md: 6 }, pb: { xs: 12, md: 9 } }}>
      <Box component="section" aria-labelledby="mk-title" sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.1fr) minmax(0, 0.9fr)" }, alignItems: "center" }}>
        <Box sx={{ minWidth: 0 }}>
          <CoinTitle id="mk-title" before={s.hero.titleBefore} accent={s.hero.titleAccent} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 38, sm: 52, md: 60 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }} />
          <Box component="p" sx={{ m: 0, mt: 2, mb: 3, maxWidth: 480, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{s.hero.lead}</Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/marketplace/sell" variant="contained" startIcon={<TagPrice size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{s.hero.sell}</Button>
            <Button component="a" href="#mk-market" variant="outlined" endIcon={<ArrowDown size={18} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{s.hero.browse}</Button>
          </Box>
        </Box>
        <Receipt items={items} status={status} onOpen={openFromReceipt} />
      </Box>

      <Box component="section" id="mk-market" aria-labelledby="mk-market-title" sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop}px` }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
          <Box>
            <Box component="h2" id="mk-market-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.market.title}</Box>
            <Box aria-live="polite" sx={{ mt: 0.5, fontSize: 14.5, color: c.textSecondary }}>{status === "ready" ? s.market.count(results.length) : s.market.loading}</Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 420 }, display: "flex", alignItems: "center", gap: 1.25, minHeight: 52, px: 1.75, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surface, border: `1px solid ${c.borderStrong}`, transition: "border-color 160ms ease, box-shadow 160ms ease", "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` } }}>
            <Magnifier size={22} color={c.accentText} aria-hidden />
            <InputBase value={query} onChange={(e) => { setQuery(e.target.value.slice(0, 80)); setShown(STEP); }} placeholder={s.market.searchPlaceholder} inputProps={{ "aria-label": s.market.searchLabel, type: "search", enterKeyHint: "search" }} sx={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 }, "& input::-webkit-search-cancel-button": { display: "none" } }} />
            {query ? <IconButton onClick={() => setQuery("")} aria-label={s.market.clear} sx={{ width: 36, height: 36, color: c.textMuted }}><Close size={18} aria-hidden /></IconButton> : null}
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
          <Chips label={s.categories.label} options={["all", ...CATEGORIES]} value={category} onChange={(v) => { setCategory(v); setShown(STEP); }} labelFor={(k) => s.categories[k]} renderLead={(k) => { const Icon = categoryIcon(k); return <Icon size={18} aria-hidden />; }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Chips label={s.conditions.label} options={["all", ...CONDITIONS]} value={condition} onChange={(v) => { setCondition(v); setShown(STEP); }} labelFor={(k) => s.conditions[k]} renderLead={(k, on) => (k === "all" ? null : <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: on ? t.brand.inkNavy : conditionColor(k, dark) }} />)} />
            </Box>
            <SortSwitch value={sort} onChange={setSort} />
          </Box>
        </Box>
        {body}
      </Box>
    </Box>
  );
}

/** Marketplace buy page body. The route page renders the footer after it. */
export default function BuyLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
