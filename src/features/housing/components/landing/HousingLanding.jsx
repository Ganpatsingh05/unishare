"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, CalendarCheck, CurrencyInr, Handshake, MapPinArea, Plus, VideoCamera, ChatText } from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { Eyebrow } from "@features/rides/components/landing/primitives/SectionHeader";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import useRoomListings from "../../hooks/useRoomListings";
import useShortlist from "../../hooks/useShortlist";
import { budgetSteps, matchRooms, neighbourhoods, sortRooms, SORTS } from "../../utils/roomModel";
import SentenceSearch, { INITIAL_FILTERS } from "./SentenceSearch";
import SwipeDeck from "./SwipeDeck";
import Shortlist from "./Shortlist";
import LitTitle from "./LitTitle";
import KeyScroll from "./KeyScroll";
import { ManageLink } from "../manage/HousingTopBar";
import RoomTagCard, { RoomTagCardSkeleton } from "../search/RoomTagCard";

const s = HOUSING_STRINGS;
// Rooms shown per step: fewer on phones, where cards stack in one column.
const PAGE = 8;
const PAGE_PHONE = 4;
const ROUTES = { post: "/housing/post", search: "/housing/search" };
const srOnly = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

function Section({ children, labelledBy, sx }) {
  const t = useRideTokens();
  return (
    <Box
      component={labelledBy ? "section" : "div"}
      aria-labelledby={labelledBy}
      sx={{
        width: "100%",
        maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop,
        mx: "auto",
        px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

function SectionTitle({ id, eyebrow, icon, title, trailing }) {
  const t = useRideTokens();
  return (
    <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 2.5 }}>
      <Box>
        {eyebrow ? <Eyebrow icon={icon}>{eyebrow}</Eyebrow> : null}
        <Box component="h2" id={id} sx={{ scrollMarginTop: 120, m: 0, mt: eyebrow ? 1 : 0, fontSize: { xs: 24, md: 30 }, fontWeight: 760, letterSpacing: "-0.02em", color: t.color.text }}>
          {title}
        </Box>
      </Box>
      {trailing}
    </Box>
  );
}

export function SortSwitch({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.results.sortLabel} sx={{ display: "inline-flex", p: 0.5, gap: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive, flexWrap: "wrap" }}>
      {SORTS.map((key) => {
        const selected = key === value;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(key)}
            sx={{ position: "relative", minHeight: 38, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, color: selected ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}
          >
            {selected ? <Box component={m.span} layoutId="hs-sort-pill" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative" }}>
              {s.results.sort[key]}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** Neighbourhood tiles built from where rooms are actually listed. */
function AreaBoard({ areas, selected, onPick }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" } }}>
      {areas.slice(0, 8).map((area, i) => {
        const on = selected === area.name;
        return (
          <Box component={m.li} key={area.name} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(i, 6) * 0.05 }}>
            <ButtonBase
              onClick={() => onPick(on ? null : area.name)}
              aria-pressed={on}
              aria-label={s.areas.pick(area.name)}
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 132, md: 156 },
                borderRadius: `${t.radius.lg}px`,
                overflow: "hidden",
                textAlign: "left",
                display: "block",
                backgroundColor: c.surfaceInteractive,
                outline: on ? `3px solid ${t.brand.yellow}` : "none",
                outlineOffset: 2,
                "&.Mui-focusVisible": { outline: `3px solid ${c.focus}` },
                "& img": { transition: "transform 400ms ease" },
                "&:hover img": { transform: "scale(1.05)" },
              }}
            >
              {area.cover ? <Box component="img" src={area.cover} alt="" loading="lazy" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : null}
              <Box aria-hidden sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,18,32,0.05) 20%, rgba(8,18,32,0.82) 100%)" }} />
              <Box sx={{ position: "absolute", left: 14, right: 14, bottom: 12, color: "#fff" }}>
                <Box sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 760, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{area.name}</Box>
                <Box sx={{ mt: 0.25, fontSize: 13, fontWeight: 600, opacity: 0.92 }}>
                  {s.areas.rooms(area.count)}
                  {area.median ? ` · ${s.areas.median(formatRupee(area.median))}` : ""}
                </Box>
              </Box>
              {on ? (
                <Box component="span" sx={{ position: "absolute", top: 10, left: 10, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 800, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
                  {s.areas.selected}
                </Box>
              ) : null}
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );
}

function ListYourRoom() {
  const t = useRideTokens();
  const c = t.color;
  const icons = [Camera, CurrencyInr, CalendarCheck];
  return (
    <Panel radius="xl" sx={{ overflow: "hidden", p: 0 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1.1fr 1fr" } }}>
        <Box sx={{ p: { xs: 3, md: 5 } }}>
          <Eyebrow icon={Plus}>{s.list.eyebrow}</Eyebrow>
          <Box component="h2" id="hs-list-title" sx={{ m: 0, mt: 1, fontSize: { xs: 24, md: 32 }, fontWeight: 760, letterSpacing: "-0.02em" }}>
            {s.list.title}
          </Box>
          <Box component="p" sx={{ mt: 1.25, mb: 3, color: c.textSecondary, fontSize: 15.5, lineHeight: 1.55, maxWidth: 460 }}>
            {s.list.body}
          </Box>
          <Button component={Link} href={ROUTES.post} variant="contained" size="large" endIcon={<ArrowRight size={18} aria-hidden />} sx={{ minHeight: 52, px: 3.5, borderRadius: `${t.radius.pill}px` }}>
            {s.list.cta}
          </Button>
        </Box>
        <Box component="ol" sx={{ listStyle: "none", m: 0, p: { xs: 3, md: 5 }, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1.5, backgroundColor: c.driverSoft }}>
          {s.list.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <Box component="li" key={step} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: c.surface, boxShadow: t.elevation[1] }}>
                <Box sx={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: `${t.radius.sm}px`, backgroundColor: t.brand.yellow, color: t.brand.inkNavy, flexShrink: 0 }}>
                  <Icon size={20} weight="duotone" aria-hidden />
                </Box>
                <Box sx={{ fontSize: 15, fontWeight: 700, color: c.text }}>
                  <Box component="span" sx={{ color: c.textMuted, mr: 0.75, fontVariantNumeric: "tabular-nums" }}>
                    {i + 1}.
                  </Box>
                  {step}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Panel>
  );
}

function Safety() {
  const t = useRideTokens();
  const c = t.color;
  const icons = [VideoCamera, Handshake, ChatText];
  return (
    <Box>
      <SectionTitle id="hs-safety-title" eyebrow={null} title={s.safety.title} />
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 1.5, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "repeat(3, minmax(0, 1fr))" } }}>
        {s.safety.tips.map((tip, i) => {
          const Icon = icons[i];
          return (
            <Box component="li" key={tip.title} sx={{ p: 2.5, borderRadius: `${t.radius.lg}px`, border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: c.accentText }}>
                <Icon size={22} weight="duotone" aria-hidden />
                <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 750, color: c.text }}>
                  {tip.title}
                </Box>
              </Box>
              <Box sx={{ fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary }}>{tip.body}</Box>
            </Box>
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
  const { rooms, status, reload } = useRoomListings();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [sort, setSort] = useState("newest");
  const phone = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const page = phone ? PAGE_PHONE : PAGE;
  const [extra, setExtra] = useState(0);
  const shown = page * (1 + extra);

  const areas = useMemo(() => neighbourhoods(rooms), [rooms]);
  const budgets = useMemo(() => budgetSteps(rooms), [rooms]);
  const matches = useMemo(() => sortRooms(matchRooms(rooms, filters), sort), [rooms, filters, sort]);

  // The deck walks the matches newest first, minus saved rooms and rooms
  // skipped during this visit. History powers the undo button.
  const shortlist = useShortlist();
  const [skipped, setSkipped] = useState([]);
  const [history, setHistory] = useState([]);
  const deckPool = useMemo(() => sortRooms(matchRooms(rooms, filters), "newest"), [rooms, filters]);
  const deck = deckPool.filter((room) => !skipped.includes(String(room.id)) && !shortlist.has(room.id));
  // Rooms saved before this visit are not in the deck; ones saved during it still count as seen.
  const savedNow = new Set(history.filter((x) => x.action === "save").map((x) => x.id));
  const deckTotal = deckPool.filter((room) => !shortlist.has(room.id) || savedNow.has(String(room.id))).length;
  const savedRooms = shortlist.ids.map((id) => rooms.find((room) => String(room.id) === id)).filter(Boolean);
  const onSave = (room) => {
    shortlist.add(room.id);
    setHistory((h) => [...h, { id: String(room.id), action: "save" }]);
  };
  const onSkip = (room) => {
    setSkipped((list) => [...list, String(room.id)]);
    setHistory((h) => [...h, { id: String(room.id), action: "skip" }]);
  };
  const onUndo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory((h) => h.slice(0, -1));
    if (last.action === "save") shortlist.remove(last.id);
    else setSkipped((list) => list.filter((id) => id !== last.id));
  };

  const onFilters = (next) => {
    setFilters(next);
    setExtra(0);
  };

  let results;
  if (status === "loading") {
    results = (
      <Box aria-busy="true" aria-label={s.results.loadingLabel} sx={gridSx}>
        {Array.from({ length: 4 }, (_, i) => (
          <RoomTagCardSkeleton key={i} />
        ))}
      </Box>
    );
  } else if (status === "error") {
    results = (
      <Panel variant="flat" radius="xl">
        <StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={reload} retryLabel={s.error.retry} />
      </Panel>
    );
  } else if (!matches.length) {
    const none = !rooms.length;
    results = (
      <Panel variant="flat" radius="xl">
        <StateBlock
          title={none ? s.empty.noneTitle : s.empty.title}
          body={none ? s.empty.noneBody : s.empty.body}
          action={
            none ? (
              <Button component={Link} href={ROUTES.post} variant="contained" startIcon={<Plus size={16} weight="bold" aria-hidden />} sx={{ minHeight: 44 }}>
                {s.list.cta}
              </Button>
            ) : (
              <Button variant="contained" onClick={() => onFilters(INITIAL_FILTERS)} sx={{ minHeight: 44 }}>
                {s.empty.reset}
              </Button>
            )
          }
        />
      </Panel>
    );
  } else {
    results = (
      <>
        <Box component="ul" sx={{ ...gridSx, listStyle: "none", m: 0, p: 0 }}>
          <AnimatePresence initial={false}>
            {matches.slice(0, shown).map((room, i) => (
              <Box
                component={m.li}
                key={room.id}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: Math.min(i % page, 6) * 0.04, ease: t.motion.ease } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                <RoomTagCard
                  room={room}
                  headingId={`hs-room-${room.id}`}
                  saved={shortlist.has(room.id)}
                  onToggleSave={() => (shortlist.has(room.id) ? shortlist.remove(room.id) : shortlist.add(room.id))}
                />
              </Box>
            ))}
          </AnimatePresence>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3, flexWrap: "wrap" }}>
          {matches.length > shown ? (
            <Button variant="outlined" onClick={() => setExtra((n) => n + 1)} sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px`, px: 3 }}>
              {s.results.showMore}
            </Button>
          ) : null}
          <Button component={Link} href={ROUTES.search} variant="text" endIcon={<ArrowRight size={16} aria-hidden />} sx={{ minHeight: 48 }}>
            {s.results.seeAll}
          </Button>
        </Box>
      </>
    );
  }

  return (
    <Box sx={{ position: "relative", pb: { xs: 12, md: 9 }, "& > :not([aria-hidden])": { position: "relative", zIndex: 1 } }}>
      <KeyScroll />
      {/* Hero: headline and the sentence search beside the swipe deck. */}
      <Section sx={{ pt: { xs: 3, md: 5 } }}>
        <Box component="section" aria-labelledby="hs-title" sx={{ display: "grid", gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" }, alignItems: "center" }}>
          <Box sx={{ minWidth: 0 }}>
            <LitTitle
              id="hs-title"
              before={s.hero.title}
              accent={s.hero.titleAccent}
              sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 36, sm: 48, md: 58 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }}
            />
            <Box component="p" sx={{ m: 0, mt: 2, maxWidth: 480, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>
              {s.hero.lead}
            </Box>
            <Panel radius="xl" sx={{ mt: 3, p: { xs: 2, sm: 3 } }}>
              <SentenceSearch filters={filters} onChange={onFilters} areas={areas} budgets={budgets} matchCount={matches.length} ready={status === "ready"} />
            </Panel>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2.5 }}>
              <Button component={Link} href={ROUTES.post} variant="contained" startIcon={<Plus size={18} weight="bold" aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>
                {s.hero.list}
              </Button>
              <Button component={Link} href={ROUTES.search} variant="outlined" sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>
                {s.hero.browse}
              </Button>
              <ManageLink sx={{ minHeight: 48 }} />
            </Box>
          </Box>
          <Box sx={{ minWidth: 0 }}>
            {status === "loading" ? (
              <Box aria-hidden sx={{ mx: "auto", width: "100%", maxWidth: 380, aspectRatio: "4 / 5", borderRadius: `${t.radius.xl}px`, backgroundColor: c.surfaceInteractive }} />
            ) : (
              <SwipeDeck
                rooms={deck}
                total={deckTotal}
                onSave={onSave}
                onSkip={onSkip}
                onUndo={onUndo}
                canUndo={history.length > 0}
                onReset={() => {
                  setSkipped([]);
                  setHistory([]);
                }}
              />
            )}
          </Box>
        </Box>
      </Section>

      <Section sx={{ mt: { xs: 4, md: 5 } }}>
        <Shortlist rooms={savedRooms} onRemove={shortlist.remove} onClear={shortlist.clear} />
      </Section>

      <Section labelledBy="hs-results-title" sx={{ mt: { xs: 4, md: 6 } }}>
        <SectionTitle id="hs-results-title" title={s.results.title} trailing={status === "ready" && matches.length > 1 ? <SortSwitch value={sort} onChange={setSort} /> : null} />
        <Box aria-live="polite" sx={srOnly}>
          {status === "ready" ? s.results.live(matches.length) : ""}
        </Box>
        {results}
      </Section>

      {areas.length > 1 ? (
        <Section labelledBy="hs-areas-title" sx={{ mt: { xs: 7, md: 10 } }}>
          <SectionTitle id="hs-areas-title" eyebrow={s.areas.eyebrow} icon={MapPinArea} title={s.areas.title} />
          <AreaBoard
            areas={areas}
            selected={filters.area}
            onPick={(area) => {
              onFilters({ ...filters, area });
              document.getElementById("hs-results-title")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            }}
          />
        </Section>
      ) : null}

      <Section labelledBy="hs-list-title" sx={{ mt: { xs: 7, md: 10 } }}>
        <ListYourRoom />
      </Section>

      <Section labelledBy="hs-safety-title" sx={{ mt: { xs: 7, md: 10 } }}>
        <Safety />
      </Section>
    </Box>
  );
}

const gridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
};

/** Housing landing page body. The route page renders the footer after it. */
export default function HousingLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
