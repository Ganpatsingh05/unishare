"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRightIcon as ArrowRight } from "@solar-icons/react/linear/arrow-right";
import { AddCircleIcon as AddCircle } from "@solar-icons/react/bold-duotone/add-circle";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import { MagnifierIcon as Magnifier } from "@solar-icons/react/line-duotone/magnifier";
import { HandHeartIcon as HandHeart } from "@solar-icons/react/line-duotone/hand-heart";
import { QuestionCircleIcon as QuestionCircle } from "@solar-icons/react/bold-duotone/question-circle";
import { ShopIcon as Shop } from "@solar-icons/react/bold-duotone/shop";
import { CheckCircleIcon as CheckCircle } from "@solar-icons/react/bold-duotone/check-circle";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";
import useLostFoundFeed from "../../hooks/useLostFoundFeed";
import { CATEGORIES, matchItems } from "../../utils/itemModel";
import { CATEGORY_ICONS } from "./categoryIcons";
import LensTitle from "./LensTitle";
import LensSearch from "./LensSearch";
import ItemCard, { ItemCardSkeleton } from "./ItemCard";
import ItemQuickView from "./ItemQuickView";

const s = LOST_FOUND_STRINGS;
const STEP = 12;
const TILTS = [-1.2, 0.8, -0.5, 1.1, -0.9, 0.6];
const MODES = [
  { key: "lost", icon: Magnifier },
  { key: "found", icon: HandHeart },
];
const FILTERS = ["all", "lost", "found"];

/** "I lost" / "I found": a sliding two-way switch. */
function ModeSwitch({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.hero.modeLabel} sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", p: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive, maxWidth: 460 }}>
      {MODES.map(({ key, icon: Icon }) => {
        const on = key === value;
        const accent = key === "lost" ? c.danger : c.success;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(key)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                onChange(key === "lost" ? "found" : "lost");
              }
            }}
            tabIndex={on ? 0 : -1}
            sx={{ position: "relative", minHeight: 52, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: { xs: 14, sm: 15.5 }, fontWeight: 760, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}
          >
            {on ? <Box component={m.span} layoutId="lf-mode" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Box component="span" aria-hidden sx={{ display: "grid", placeItems: "center", width: 30, height: 30, borderRadius: "50%", backgroundColor: on ? accent : "transparent", color: on ? "#fff" : "inherit", transition: "background-color 200ms ease" }}>
                <Icon size={18} />
              </Box>
              {s.hero.modes[key]}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function CategoryChips({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  const keys = ["all", ...CATEGORIES.map((x) => x.key), "other"];
  return (
    <Box role="radiogroup" aria-label={s.categories.label} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {keys.map((key) => {
        const on = key === value;
        const Icon = CATEGORY_ICONS[key];
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(on && key !== "all" ? "all" : key)}
            sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, transition: "background-color 160ms ease", "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
          >
            <Icon size={18} aria-hidden />
            {s.categories[key === "all" ? "all" : key]}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function SearchField({ mode, value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minHeight: 60, px: 2, borderRadius: `${t.radius.lg}px`, backgroundColor: c.surface, border: `1px solid ${c.borderStrong}`, boxShadow: t.elevation[1], transition: "border-color 160ms ease, box-shadow 160ms ease", "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` } }}>
      <Magnifier size={24} color={c.accentText} aria-hidden />
      <InputBase value={value} onChange={(e) => onChange(e.target.value.slice(0, 80))} placeholder={`${s.hero.searchLabel[mode]} ${s.hero.searchPlaceholder}`} inputProps={{ "aria-label": s.hero.searchLabel[mode], type: "search", enterKeyHint: "search" }} sx={{ flex: 1, fontSize: 17, fontWeight: 600, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 }, "& input::-webkit-search-cancel-button": { display: "none" } }} />
      {value ? (
        <IconButton onClick={() => onChange("")} aria-label={s.hero.clear} sx={{ width: 36, height: 36, color: c.textMuted }}>
          <Close size={18} aria-hidden />
        </IconButton>
      ) : null}
    </Box>
  );
}

function BoardFilter({ value, onChange, counts }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.board.filterLabel} sx={{ display: "inline-flex", gap: 0.5, p: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive }}>
      {FILTERS.map((key) => {
        const on = key === value;
        const dot = key === "lost" ? c.danger : key === "found" ? c.success : null;
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(key)} sx={{ position: "relative", minHeight: 40, px: 1.75, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 14, fontWeight: 720, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}>
            {on ? <Box component={m.span} layoutId="lf-board-filter" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              {dot ? <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: dot }} /> : null}
              {s.board.filters[key]}
              <Box component="span" sx={{ fontVariantNumeric: "tabular-nums", color: c.textSecondary, fontWeight: 650 }}>{counts[key] || 0}</Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function Tips() {
  const t = useRideTokens();
  const c = t.color;
  const icons = [QuestionCircle, Shop, CheckCircle];
  return (
    <Box component="section" aria-labelledby="lf-tips-title" sx={{ mt: { xs: 6, md: 8 } }}>
      <Box component="h2" id="lf-tips-title" sx={{ m: 0, mb: 2, fontSize: { xs: 22, md: 26 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.tips.title}</Box>
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
        {s.tips.items.map((tip, i) => {
          const Icon = icons[i];
          return (
            <Panel component="li" key={tip.title} variant="flat" radius="lg" sx={{ p: 2.25, display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box aria-hidden sx={{ position: "relative", flexShrink: 0, display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: `${t.radius.md}px`, backgroundColor: c.actionSoft, color: c.accentText }}>
                <Icon size={24} />
                <Box component="span" sx={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 850, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>{i + 1}</Box>
              </Box>
              <Box>
                <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 760 }}>{tip.title}</Box>
                <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 14, lineHeight: 1.55, color: c.textSecondary }}>{tip.body}</Box>
              </Box>
            </Panel>
          );
        })}
      </Box>
    </Box>
  );
}

function LandingContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { items, status, reload } = useLostFoundFeed();
  const [mode, setMode] = useState("lost");
  // If you lost something you want found posts, and the other way round.
  const [board, setBoard] = useState("found");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(STEP);
  const [viewing, setViewing] = useState({ item: null, open: false });

  const pickMode = (next) => {
    setMode(next);
    setBoard(next === "lost" ? "found" : "lost");
    setShown(STEP);
  };
  const base = useMemo(() => matchItems(items, { category, query }), [items, category, query]);
  const counts = useMemo(() => ({ all: base.length, lost: base.filter((x) => x.mode === "lost").length, found: base.filter((x) => x.mode === "found").length }), [base]);
  const results = board === "all" ? base : base.filter((x) => x.mode === board);
  const open = (item) => setViewing({ item, open: true });
  const filtered = category !== "all" || query.trim();

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.board.loading} sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } }}>
        {Array.from({ length: 4 }, (_, i) => <ItemCardSkeleton key={i} />)}
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
              <Button variant="contained" onClick={() => { setCategory("all"); setQuery(""); }} sx={{ minHeight: 44 }}>{s.empty.reset}</Button>
            ) : (
              <Button component={Link} href={`/lost-found/report?mode=${mode}`} variant="contained" startIcon={<AddCircle size={19} aria-hidden />} sx={{ minHeight: 44 }}>{s.hero.report[mode]}</Button>
            )
          }
        />
      </Panel>
    );
  } else {
    body = (
      <>
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, pt: 1, display: "grid", gap: 2.5, rowGap: 3, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" } }}>
          <AnimatePresence initial={false} mode="popLayout">
            {results.slice(0, shown).map((item, i) => (
              <Box
                component={m.li}
                key={item.id}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: Math.min(i % STEP, 6) * 0.04, ease: t.motion.ease } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <ItemCard item={item} onOpen={open} tilt={TILTS[i % TILTS.length]} />
              </Box>
            ))}
          </AnimatePresence>
        </Box>
        {results.length > shown ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="outlined" onClick={() => setShown((n) => n + STEP)} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.board.showMore}</Button>
          </Box>
        ) : null}
      </>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 3, md: 6 }, pb: { xs: 12, md: 9 } }}>
      {/* Hero: headline, the lost/found switch, search, and the lens scene. */}
      <Box component="section" aria-labelledby="lf-title" sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.15fr) minmax(0, 0.85fr)" }, alignItems: "center" }}>
        <Box sx={{ minWidth: 0 }}>
          <LensTitle id="lf-title" lead={s.hero.titleLead} before={s.hero.title} accent={s.hero.titleAccent} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 38, sm: 50, md: 60 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }} />
          <Box component="p" sx={{ m: 0, mt: 2, mb: 3, maxWidth: 500, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{s.hero.lead}</Box>
          <ModeSwitch value={mode} onChange={pickMode} />
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <SearchField mode={mode} value={query} onChange={(v) => { setQuery(v); setShown(STEP); }} />
            <CategoryChips value={category} onChange={(v) => { setCategory(v); setShown(STEP); }} />
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2.5 }}>
            <Button component={Link} href={`/lost-found/report?mode=${mode}`} variant="contained" startIcon={<AddCircle size={21} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>
              <AnimatePresence mode="wait" initial={false}>
                <m.span key={mode} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }} style={{ display: "inline-block" }}>
                  {s.hero.report[mode]}
                </m.span>
              </AnimatePresence>
            </Button>
            <Button component="a" href="#lf-board" variant="outlined" endIcon={<ArrowRight size={18} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{s.hero.browse}</Button>
          </Box>
        </Box>
        <Panel radius="xl" sx={{ p: 1.5, display: { xs: "none", md: "block" } }}>
          <LensSearch ready={status === "ready"} found={items.filter((x) => x.mode === "found").length} lost={items.filter((x) => x.mode === "lost").length} />
        </Panel>
      </Box>

      {/* Board. */}
      <Box component="section" id="lf-board" aria-labelledby="lf-board-title" sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop}px` }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2.5 }}>
          <Box>
            <Box component="h2" id="lf-board-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.board.title}</Box>
            <Box aria-live="polite" sx={{ mt: 0.5, fontSize: 14.5, color: c.textSecondary }}>{status === "ready" ? `${s.board.count(results.length)} · ${s.board.lead}` : s.board.lead}</Box>
          </Box>
          <BoardFilter value={board} onChange={(v) => { setBoard(v); setShown(STEP); }} counts={counts} />
        </Box>
        {body}
      </Box>

      <Tips />
      <ItemQuickView item={viewing.item} open={viewing.open} onClose={() => setViewing((v) => ({ ...v, open: false }))} />
    </Box>
  );
}

/** Lost & Found landing page body. The route page renders the footer after it. */
export default function LostFoundLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
