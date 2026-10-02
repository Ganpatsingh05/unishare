"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  CaretDown,
  ListBullets,
  MapTrifold,
  MagnifyingGlass,
  SlidersHorizontal,
  Plus,
} from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "../../theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "../../hooks/useRideFeedback";
import useRideSearch from "../../hooks/useRideSearch";
import useRideRoute from "../../hooks/useRideRoute";
import useResolvedRoute from "../../hooks/useResolvedRoute";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { SEAT_LIMITS } from "../../constants/ridePlaces";
import { formatRideDay, formatRupee } from "../../utils/rideFormat";
import { buildFindHref, buildPostHref, readRidePrefill, RIDE_ROUTES } from "../../utils/rideLinks";
import { routeTier, sortRides, timeWindow } from "../../utils/rideMatch";
import Panel from "../landing/primitives/Panel";
import StateBlock from "../landing/primitives/StateBlock";
import { CompactFields, InlineFields } from "../landing/hero/CommandHero";
import { clampSeats } from "../landing/hero/SeatsField";
import DayRibbon from "./DayRibbon";
import FilterPanel, { INITIAL_FILTERS, activeFilterCount } from "./FilterPanel";
import ResultCard, { ResultCardSkeleton } from "./ResultCard";
import RideDetails from "./RideDetails";

const RouteMap = dynamic(() => import("../landing/hero/RouteMap"), {
  ssr: false,
  loading: () => <Box aria-hidden sx={{ position: "absolute", inset: 0 }} />,
});

const s = RIDE_STRINGS.find;
const INITIAL_FORM = { mode: "find", from: "", to: "", date: null, time: null, seats: 1 };
const URL_SYNC_MS = 400;

const srOnly = { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" };

/** Keeps the address bar in step with the trip, so a search can be shared. */
function useUrlSync(form) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const href = buildFindHref({
        from: form.from,
        to: form.to,
        date: form.date ? form.date.format("YYYY-MM-DD") : "",
        seats: form.seats > 1 ? form.seats : "",
      });
      if (href !== window.location.pathname + window.location.search) window.history.replaceState(window.history.state, "", href);
    }, URL_SYNC_MS);
    return () => clearTimeout(timer);
  }, [form.from, form.to, form.date, form.seats]);
}

/**
 * Route-matched, filtered and sorted results plus the counts the day ribbon
 * and summary need.
 */
function useResults(rides, form, filters, requests) {
  return useMemo(() => {
    const dateKey = form.date ? form.date.format("YYYY-MM-DD") : null;
    const seats = clampSeats(form.seats, "find");
    // Rides on the route with enough seats (rides already requested stay visible).
    const onRoute = [];
    for (const ride of rides) {
      const tier = routeTier(ride, form.from, form.to);
      if (!tier) continue;
      if (ride.seatsLeft < seats && !requests[ride.id] && !ride.isOwn) continue;
      onRoute.push({ ...ride, tier });
    }
    const dayCounts = {};
    for (const ride of onRoute) dayCounts[ride.date] = (dayCounts[ride.date] || 0) + 1;

    const onDay = dateKey ? onRoute.filter((ride) => ride.date === dateKey) : onRoute;
    const prices = onDay.map((ride) => ride.price).filter((price) => Number.isFinite(price) && price > 0);
    const priceRange = prices.length ? { min: Math.min(...prices), max: Math.max(...prices) } : null;

    const filtered = onDay.filter((ride) => {
      if (filters.windows.length && !filters.windows.includes(timeWindow(ride))) return false;
      if (filters.maxPrice !== null && Number.isFinite(ride.price) && ride.price > filters.maxPrice) return false;
      return true;
    });
    const sorted = sortRides(filtered, filters.sort);
    const grouped = Boolean(form.from.trim() && form.to.trim());
    const groups = grouped
      ? [
          { key: "exact", title: s.groups.exact, items: sorted.filter((ride) => ride.tier === "exact") },
          { key: "close", title: s.groups.close, hint: s.groups.closeHint, items: sorted.filter((ride) => ride.tier === "close") },
        ].filter((group) => group.items.length)
      : [{ key: "all", title: null, items: sorted }];

    const fares = filtered.map((ride) => ride.price).filter((price) => Number.isFinite(price) && price > 0);
    const next = filtered.reduce((soonest, ride) => (!soonest || ride.startsAt < soonest ? ride.startsAt : soonest), null);
    return {
      list: groups.flatMap((group) => group.items),
      groups,
      dayCounts,
      dayTotal: onRoute.length,
      onDayCount: onDay.length,
      priceRange,
      summary: { count: filtered.length, minFare: fares.length ? Math.min(...fares) : null, next },
    };
  }, [rides, form.from, form.to, form.date, form.seats, filters, requests]);
}

function SummaryChips({ summary }) {
  const t = useRideTokens();
  const minutes = summary.next ? Math.max(0, Math.round((summary.next - Date.now()) / 60000)) : null;
  const items = [
    s.summary.rides(summary.count),
    summary.minFare !== null ? s.summary.from(formatRupee(summary.minFare)) : null,
    minutes !== null ? s.summary.next(s.summary.inMinutes(minutes)) : null,
  ].filter(Boolean);
  return (
    <Box component="ul" aria-label={s.summary.label} sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((item, index) => (
        <Box
          component="li"
          key={item}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 0.75,
            borderRadius: `${t.radius.pill}px`,
            fontSize: 13.5,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            backgroundColor: index === 0 ? t.color.highlight : t.color.surface,
            color: index === 0 ? t.color.onHighlight : t.color.textSecondary,
            border: index === 0 ? "1px solid transparent" : `1px solid ${t.color.border}`,
          }}
        >
          {item}
        </Box>
      ))}
    </Box>
  );
}

/** Mobile: one-line trip summary that expands into the trip fields. */
function TripPill({ form, expanded, onToggle, controlsId }) {
  const t = useRideTokens();
  const route = form.from || form.to ? [form.from || RIDE_STRINGS.hero.from, form.to || RIDE_STRINGS.hero.to].join(" → ") : s.tripSummaryEmpty;
  const meta = [form.date ? formatRideDay(form.date.format("YYYY-MM-DD")) : s.tripSummaryAnyDay, RIDE_STRINGS.hero.seatsNeeded(form.seats)].join(" · ");
  return (
    <ButtonBase
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={controlsId}
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        minHeight: 60,
        px: 2,
        borderRadius: `${t.radius.lg}px`,
        backgroundColor: t.color.surface,
        border: `1px solid ${t.color.border}`,
        boxShadow: t.elevation[2],
        textAlign: "left",
        "&.Mui-focusVisible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: "50%", backgroundColor: t.color.actionSoft, color: t.color.accentText, flexShrink: 0 }}>
        <MagnifyingGlass size={18} weight="bold" aria-hidden />
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Box sx={{ fontSize: 15, fontWeight: 700, color: t.color.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{route}</Box>
        <Box sx={{ fontSize: 13, color: t.color.textMuted }}>{meta}</Box>
      </Box>
      <Box component="span" sx={{ display: "inline-flex", color: t.color.textMuted, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }}>
        <CaretDown size={18} aria-hidden />
      </Box>
      <Box component="span" sx={srOnly}>
        {s.tripEdit}
      </Box>
    </ButtonBase>
  );
}

function ViewToggle({ view, onChange }) {
  const t = useRideTokens();
  const options = [
    { key: "list", label: s.view.list, icon: ListBullets },
    { key: "map", label: s.view.map, icon: MapTrifold },
  ];
  return (
    <Box role="radiogroup" aria-label={s.view.label} sx={{ display: "inline-flex", p: 0.5, gap: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: t.color.surfaceInteractive }}>
      {options.map((option) => {
        const selected = view === option.key;
        const Icon = option.icon;
        return (
          <ButtonBase
            key={option.key}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.key)}
            sx={{
              position: "relative",
              minHeight: 40,
              px: 1.75,
              gap: 0.75,
              borderRadius: `${t.radius.pill}px`,
              fontSize: 14,
              fontWeight: 700,
              color: selected ? t.color.text : t.color.textOnInset,
              "&.Mui-focusVisible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 1 },
            }}
          >
            {selected ? (
              <Box component={m.span} layoutId="rs-view-pill" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: t.color.surface, boxShadow: t.elevation[1] }} />
            ) : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              <Icon size={17} weight={selected ? "fill" : "regular"} aria-hidden />
              {option.label}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/**
 * Sticky map. It shows the highlighted ride's route, or the searched trip
 * (the popular campus route when nothing is typed) while there is no ride.
 */
function MapPanel({ ride, form, height }) {
  const rideRoute = useRideRoute(ride);
  const tripRoute = useResolvedRoute(form.from, form.to);
  const shown = ride ? rideRoute : { ...tripRoute, toText: form.to };
  return (
    <Panel radius="xl" sx={{ position: "relative", height, overflow: "hidden", p: 0 }}>
      <RouteMap preview={shown.preview} origin={shown.origin} destination={shown.destination} route={shown.route} routeStatus={shown.routeStatus} toText={shown.toText} />
    </Panel>
  );
}

function EmptyResults({ form, filters, onAnyDay, onResetFilters, dayTotal, onDayCount }) {
  const filteredOut = onDayCount > 0;
  const dayOnly = !filteredOut && form.date && dayTotal > 0;
  const postHref = buildPostHref({ from: form.from, to: form.to, date: form.date ? form.date.format("YYYY-MM-DD") : "" });
  const title = filteredOut ? s.empty.titleFiltered : dayOnly ? s.empty.titleDay : s.empty.title;
  const body = filteredOut ? s.empty.bodyFiltered : dayOnly ? s.empty.bodyDay : s.empty.body;
  const action = (
    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
      {filteredOut && activeFilterCount(filters) ? (
        <Button variant="outlined" onClick={onResetFilters} sx={{ minHeight: 44 }}>
          {s.empty.reset}
        </Button>
      ) : null}
      {dayOnly ? (
        <Button variant="outlined" onClick={onAnyDay} sx={{ minHeight: 44 }}>
          {s.empty.anyDay}
        </Button>
      ) : null}
      <Button component={Link} href={postHref} variant="contained" startIcon={<Plus size={16} weight="bold" aria-hidden />} sx={{ minHeight: 44 }}>
        {s.empty.post}
      </Button>
    </Box>
  );
  return (
    <Panel variant="flat" radius="xl">
      <StateBlock title={title} body={body} action={action} />
    </Panel>
  );
}

function ResultList({ results, requests, selectedId, onSelect, onOpen, showMatch }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {results.groups.map((group) => (
        <Box key={group.key} component="section" aria-labelledby={group.title ? `rs-find-group-${group.key}` : undefined}>
          {group.title ? (
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 1.25, flexWrap: "wrap" }}>
              <Box component="h2" id={`rs-find-group-${group.key}`} sx={{ m: 0, fontSize: 16, fontWeight: 750, color: t.color.text }}>
                {group.title}
              </Box>
              <Box component="span" sx={{ fontSize: 13.5, fontWeight: 600, color: t.color.textMuted }}>
                {group.hint || s.summary.rides(group.items.length)}
              </Box>
            </Box>
          ) : null}
          <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
            <AnimatePresence initial={false}>
              {group.items.map((ride, index) => (
                <Box
                  component={m.li}
                  key={ride.id}
                  layout={reduce ? false : "position"}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(index, 6) * 0.04, ease: t.motion.ease } }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, transition: { duration: 0.16 } }}
                >
                  <ResultCard
                    ride={ride}
                    tier={ride.tier}
                    showMatch={showMatch}
                    requestStatus={requests[ride.id]}
                    selected={ride.id === selectedId}
                    onSelect={onSelect}
                    onOpen={onOpen}
                    headingId={`rs-find-ride-${ride.id}`}
                  />
                </Box>
              ))}
            </AnimatePresence>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function FindContent() {
  const t = useRideTokens();
  const { notify } = useRideFeedback();
  const search = useRideSearch();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const isRail = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const isWide = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const [form, setForm] = useState(INITIAL_FORM);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [tripOpen, setTripOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [detailsId, setDetailsId] = useState(null);

  // Prefill from the landing page (?from=&to=&date=&seats=).
  useEffect(() => {
    const prefill = readRidePrefill();
    setForm((prev) => ({
      ...prev,
      from: prefill.from || "",
      to: prefill.to || "",
      date: prefill.date && dayjs(prefill.date).isValid() ? dayjs(prefill.date) : null,
      seats: prefill.seats ? Math.min(prefill.seats, SEAT_LIMITS.maxFind) : 1,
    }));
  }, []);
  useUrlSync(form);

  const onFormChange = useCallback((patch) => setForm((prev) => ({ ...prev, ...patch })), []);
  const onSwap = useCallback(() => setForm((prev) => ({ ...prev, from: prev.to, to: prev.from })), []);
  const results = useResults(search.rides, form, filters, search.requests);

  // The highlighted ride falls back to the first result.
  const selected = results.list.find((ride) => ride.id === selectedId) || results.list[0] || null;
  const detailsRide = search.rides.find((ride) => ride.id === detailsId) || null;

  const onRequest = useCallback(
    async (ride, payload) => {
      const result = await search.requestSeats(ride, payload);
      notify(
        result.success
          ? { message: RIDE_STRINGS.recent.requestSent(ride.driverName), tone: "success" }
          : { message: result.error || RIDE_STRINGS.recent.requestFailed, tone: "error" }
      );
      return result;
    },
    [search, notify]
  );

  const setDate = (key) => setForm((prev) => ({ ...prev, date: key ? dayjs(key) : null }));
  const ribbonValue = form.date ? form.date.format("YYYY-MM-DD") : null;
  const filterCount = activeFilterCount(filters);
  const mapHeight = isDesktop
    ? `min(calc((100vh - ${t.layout.stickyTop + 56}px) / ${t.layout.pageZoom}), 820px)`
    : { xs: "62vh", sm: `calc(62vh / ${t.layout.pageZoom})` };
  const stickyTop = { sm: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` };

  const tripFields = isWide ? (
    <InlineFields form={form} onFormChange={onFormChange} rides={search.rides} errors={{}} onSwap={onSwap} />
  ) : (
    <CompactFields form={form} onFormChange={onFormChange} rides={search.rides} errors={{}} onSwap={onSwap} />
  );
  const filterPanel = <FilterPanel filters={filters} onChange={setFilters} priceRange={results.priceRange} />;

  let body;
  if (search.status === "loading") {
    body = (
      <Box aria-busy="true" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[0, 1, 2, 3].map((key) => (
          <ResultCardSkeleton key={key} />
        ))}
      </Box>
    );
  } else if (search.status === "error") {
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={() => search.reload()} retryLabel={s.error.retry} />
      </Panel>
    );
  } else if (!results.list.length) {
    body = (
      <EmptyResults
        form={form}
        filters={filters}
        dayTotal={results.dayTotal}
        onDayCount={results.onDayCount}
        onAnyDay={() => setDate(null)}
        onResetFilters={() => setFilters(INITIAL_FILTERS)}
      />
    );
  } else {
    body = <ResultList showMatch={Boolean(form.from.trim() || form.to.trim())} results={results} requests={search.requests} selectedId={selected?.id} onSelect={setSelectedId} onOpen={(ride) => setDetailsId(ride.id)} />;
  }

  const showMapInsteadOfList = !isDesktop && view === "map";

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop + 200,
        mx: "auto",
        px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` },
        pt: { xs: 2, md: 4 },
        pb: { xs: 12, md: 9 },
      }}
    >
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href={RIDE_ROUTES.home} variant="text" startIcon={<ArrowLeft size={16} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: t.color.textSecondary }}>
          {s.back}
        </Button>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box
              component="h1"
              sx={{
                m: 0,
                fontFamily: t.typography.family,
                fontSize: { xs: 28, sm: 36, md: 42 },
                lineHeight: 1.08,
                fontWeight: t.typography.displayWeight,
                letterSpacing: t.typography.displayTracking,
                color: t.color.text,
                overflowWrap: "anywhere",
              }}
            >
              {s.titleFor(form.from.trim(), form.to.trim())}
            </Box>
            <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: t.color.textSecondary }}>
              {s.lead}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: { xs: "flex-start", md: "flex-end" }, gap: 1.5 }}>
            {/* Going the same way with seats to spare? Straight to posting, with the trip carried over. */}
            <Button
              component={Link}
              href={buildPostHref({ from: form.from, to: form.to, date: form.date ? form.date.format("YYYY-MM-DD") : "" })}
              variant="outlined"
              startIcon={<Plus size={17} weight="bold" aria-hidden />}
              sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, borderColor: t.color.driverEdge, color: t.color.text, "&:hover": { borderColor: t.color.driverEdge, backgroundColor: t.color.driverSoft } }}
            >
              {s.postRide}
            </Button>
            {search.status === "ready" ? <SummaryChips summary={results.summary} /> : null}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: { xs: 2, md: 3 },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "320px minmax(0, 1fr)", lg: "316px minmax(0, 1.3fr) minmax(340px, 0.85fr)" },
          alignItems: "start",
        }}
      >
        {/* Trip and filters: a sticky rail on wider screens, a collapsible panel on phones. */}
        <Box sx={{ position: { md: "sticky" }, top: stickyTop, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          {isRail ? (
            <>
              <Panel radius="xl" sx={{ p: 2 }}>
                <Box component="h2" sx={{ m: 0, mb: 1.5, fontSize: 15, fontWeight: 750 }}>
                  {s.tripTitle}
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>{tripFields}</Box>
              </Panel>
              <Panel radius="xl" sx={{ p: 2 }}>
                <Box component="h2" sx={{ m: 0, mb: 1.75, fontSize: 15, fontWeight: 750, display: "flex", alignItems: "center", gap: 1 }}>
                  <SlidersHorizontal size={18} weight="duotone" aria-hidden />
                  {s.filters.title}
                </Box>
                {filterPanel}
              </Panel>
            </>
          ) : (
            <>
              {isWide ? (
                <Panel radius="xl" sx={{ p: 1.5 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>{tripFields}</Box>
                </Panel>
              ) : (
                <>
                  <TripPill form={form} expanded={tripOpen} onToggle={() => setTripOpen((open) => !open)} controlsId="rs-find-trip" />
                  <Collapse in={tripOpen} id="rs-find-trip" unmountOnExit>
                    <Panel radius="xl" sx={{ p: 1.5 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>{tripFields}</Box>
                      <Button variant="contained" fullWidth onClick={() => setTripOpen(false)} sx={{ mt: 1.5, minHeight: 48 }}>
                        {s.showResults(results.summary.count)}
                      </Button>
                    </Panel>
                  </Collapse>
                </>
              )}
            </>
          )}
        </Box>

        <Box component="section" aria-label={s.resultsLabel} sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          <DayRibbon value={ribbonValue} onChange={setDate} counts={results.dayCounts} total={results.dayTotal} />
          {!isRail ? (
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Badge badgeContent={filterCount} color="secondary" overlap="circular">
                <Button
                  variant="outlined"
                  onClick={() => setFiltersOpen((open) => !open)}
                  aria-expanded={filtersOpen}
                  aria-controls="rs-find-filters"
                  startIcon={<SlidersHorizontal size={17} aria-hidden />}
                  sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}
                >
                  {s.filters.open}
                </Button>
              </Badge>
              <ViewToggle view={view} onChange={setView} />
            </Box>
          ) : !isDesktop ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <ViewToggle view={view} onChange={setView} />
            </Box>
          ) : null}
          {!isRail ? (
            <Collapse in={filtersOpen} id="rs-find-filters">
              <Panel radius="xl" sx={{ p: 2 }}>
                {filterPanel}
              </Panel>
            </Collapse>
          ) : null}

          <Box aria-live="polite" sx={srOnly}>
            {search.status === "ready" ? s.resultsLive(results.summary.count) : ""}
          </Box>

          {showMapInsteadOfList ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <MapPanel ride={selected} form={form} height={mapHeight} />
              {selected ? (
                <ResultCard
                  ride={selected}
                  tier={selected.tier}
                  showMatch={Boolean(form.from.trim() || form.to.trim())}
                  requestStatus={search.requests[selected.id]}
                  selected
                  onSelect={() => {}}
                  onOpen={(ride) => setDetailsId(ride.id)}
                  headingId="rs-find-map-ride"
                />
              ) : null}
            </Box>
          ) : (
            body
          )}
        </Box>

        {isDesktop ? (
          <Box sx={{ position: "sticky", top: stickyTop, minWidth: 0 }}>
            <MapPanel ride={search.status === "ready" ? selected : null} form={form} height={mapHeight} />
          </Box>
        ) : null}
      </Box>

      <RideDetails
        ride={detailsRide}
        open={Boolean(detailsRide)}
        onClose={() => setDetailsId(null)}
        requestStatus={detailsRide ? search.requests[detailsRide.id] : undefined}
        sending={search.sending}
        isAuthenticated={search.isAuthenticated}
        onRequest={onRequest}
      />
    </Box>
  );
}

/** The Find a ride page body. The route page renders the footer after it. */
export default function FindRides() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <FindContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}

