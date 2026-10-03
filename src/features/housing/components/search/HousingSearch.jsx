"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Bed, CalendarCheck, ImageSquare, MapPin, Plus, Rows, SquaresFour } from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import useRoomListings from "../../hooks/useRoomListings";
import useRoomSearch from "../../hooks/useRoomSearch";
import useShortlist from "../../hooks/useShortlist";
import { budgetSteps, neighbourhoods, sortRooms } from "../../utils/roomModel";
import SentenceSearch, { INITIAL_FILTERS } from "../landing/SentenceSearch";
import Shortlist from "../landing/Shortlist";
import { SortSwitch } from "../landing/HousingLanding";
import RentRuler from "./RentRuler";
import HousingTopBar from "../manage/HousingTopBar";
import RoomTagCard, { RoomTagCardSkeleton } from "./RoomTagCard";

const s = HOUSING_STRINGS.search;
const r = HOUSING_STRINGS.results;
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });

/** Reads the search from the address bar once, and keeps it there. */
function useUrlState() {
  const [state, setState] = useState({ filters: INITIAL_FILTERS, sort: "newest", view: "grid", ready: false });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const beds = q.get("beds");
    setState({
      filters: {
        area: q.get("area") || null,
        maxRent: Number(q.get("max")) || null,
        beds: beds === "4+" ? "4+" : Number(beds) || null,
        moveIn: q.get("from") || null,
      },
      sort: ["newest", "cheapest", "soonest"].includes(q.get("sort")) ? q.get("sort") : "newest",
      view: q.get("view") === "list" ? "list" : "grid",
      ready: true,
    });
  }, []);
  useEffect(() => {
    if (!state.ready) return;
    const q = new URLSearchParams();
    const { area, maxRent, beds, moveIn } = state.filters;
    if (area) q.set("area", area);
    if (maxRent) q.set("max", String(maxRent));
    if (beds) q.set("beds", String(beds));
    if (moveIn) q.set("from", moveIn);
    if (state.sort !== "newest") q.set("sort", state.sort);
    if (state.view !== "grid") q.set("view", state.view);
    const next = `${window.location.pathname}${q.toString() ? `?${q}` : ""}`;
    if (next !== window.location.pathname + window.location.search) window.history.replaceState(window.history.state, "", next);
  }, [state]);
  return [state, useCallback((patch) => setState((prev) => ({ ...prev, ...patch })), [])];
}

function ViewToggle({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  const options = [
    { key: "grid", label: s.view.grid, icon: SquaresFour },
    { key: "list", label: s.view.list, icon: Rows },
  ];
  return (
    <Box role="radiogroup" aria-label={s.view.label} sx={{ display: "inline-flex", p: 0.5, gap: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive }}>
      {options.map((o) => {
        const on = o.key === value;
        const Icon = o.icon;
        return (
          <ButtonBase key={o.key} role="radio" aria-checked={on} aria-label={o.label} onClick={() => onChange(o.key)} sx={{ position: "relative", width: 40, height: 38, borderRadius: `${t.radius.pill}px`, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
            {on ? <Box component={m.span} layoutId="hs-view-pill" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Icon size={18} weight={on ? "fill" : "regular"} style={{ position: "relative" }} aria-hidden />
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** Compact horizontal listing for the list view. */
function RoomRow({ room, headingId }) {
  const t = useRideTokens();
  const c = t.color;
  const available = !room.moveIn || room.moveIn <= new Date() ? r.availableNow : r.availableFrom(dateFmt.format(room.moveIn));
  return (
    <Box component="article" aria-labelledby={headingId} sx={{ position: "relative", display: "grid", gridTemplateColumns: { xs: "112px minmax(0, 1fr)", sm: "180px minmax(0, 1fr) auto" }, gap: 2, p: 1.25, borderRadius: `${t.radius.lg}px`, backgroundColor: c.surface, border: `1px solid ${c.border}`, "&:hover": { boxShadow: t.elevation[2] }, "&:focus-within": { borderColor: c.action } }}>
      <Box sx={{ position: "relative", aspectRatio: "4 / 3", borderRadius: `${t.radius.md}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive, display: "grid", placeItems: "center", color: c.textOnInset }}>
        {room.photos[0] ? <Box component="img" src={room.photos[0]} alt="" loading="lazy" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageSquare size={28} weight="duotone" aria-hidden />}
      </Box>
      <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 0.75 }}>
        <Box component="h3" id={headingId} sx={{ m: 0, fontSize: 16, fontWeight: 700, lineHeight: 1.3 }}>
          <Box component={Link} href={`/housing/${room.id}`} sx={{ color: "inherit", textDecoration: "none", "&::after": { content: '""', position: "absolute", inset: 0 }, "&:focus-visible": { outline: "none" } }}>
            {room.title}
          </Box>
        </Box>
        {room.location ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, fontSize: 13.5, color: c.textSecondary, minWidth: 0 }}>
            <MapPin size={15} weight="duotone" aria-hidden style={{ flexShrink: 0 }} />
            <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{room.location}</Box>
          </Box>
        ) : null}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {[{ icon: Bed, text: r.beds(room.beds) }, { icon: CalendarCheck, text: available }].map(({ icon: Icon, text }) => (
            <Box key={text} component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.4, borderRadius: `${t.radius.sm}px`, backgroundColor: c.surfaceInteractive, color: c.textOnInset, fontSize: 12.5, fontWeight: 650 }}>
              <Icon size={14} weight="duotone" aria-hidden />
              {text}
            </Box>
          ))}
        </Box>
        <Box sx={{ display: { xs: "block", sm: "none" }, fontSize: 18, fontWeight: 760 }}>{Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}<Box component="span" sx={{ fontSize: 12.5, fontWeight: 500, color: c.textMuted }}>{r.perMonth}</Box></Box>
      </Box>
      <Box sx={{ display: { xs: "none", sm: "flex" }, flexDirection: "column", alignItems: "flex-end", justifyContent: "center", pr: 1.5 }}>
        <Box sx={{ fontSize: 22, fontWeight: 760, letterSpacing: "-0.02em" }}>{Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}</Box>
        <Box sx={{ fontSize: 12.5, color: c.textMuted }}>{r.perMonth}</Box>
      </Box>
    </Box>
  );
}

function SearchContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const [state, setState] = useUrlState();
  const { filters, sort, view } = state;
  const search = useRoomSearch(state.ready ? filters : INITIAL_FILTERS);
  const sample = useRoomListings(); // newest rooms, for area and budget choices
  const areas = useMemo(() => neighbourhoods(sample.rooms), [sample.rooms]);
  const budgets = useMemo(() => budgetSteps(sample.rooms), [sample.rooms]);
  const results = useMemo(() => sortRooms(search.rooms, sort), [search.rooms, sort]);
  const shortlist = useShortlist();
  const [active, setActive] = useState(null);
  const savedRooms = shortlist.ids.map((id) => [...search.rooms, ...sample.rooms].find((room) => String(room.id) === id)).filter(Boolean);
  const unique = savedRooms.filter((room, i, all) => all.findIndex((x) => x.id === room.id) === i);

  const pick = (id) => {
    setActive(id);
    document.getElementById(`hs-res-${id}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };
  const ready = search.status === "ready" || search.status === "more";
  const clientFiltered = filters.beds === "4+" || Boolean(filters.moveIn);

  let body;
  if (search.status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.loading} sx={gridSx}>
        {Array.from({ length: 8 }, (_, i) => <RoomTagCardSkeleton key={i} />)}
      </Box>
    );
  } else if (search.status === "error") {
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock tone="error" title={HOUSING_STRINGS.error.title} body={HOUSING_STRINGS.error.body} onRetry={search.reload} retryLabel={HOUSING_STRINGS.error.retry} />
      </Panel>
    );
  } else if (!results.length) {
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock
          title={HOUSING_STRINGS.empty.title}
          body={HOUSING_STRINGS.empty.body}
          action={
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
              {search.hasMore ? <Button variant="outlined" onClick={search.loadMore} sx={{ minHeight: 44 }}>{s.loadMore}</Button> : null}
              <Button variant="contained" onClick={() => setState({ filters: INITIAL_FILTERS })} sx={{ minHeight: 44 }}>{HOUSING_STRINGS.empty.reset}</Button>
            </Box>
          }
        />
      </Panel>
    );
  } else {
    body = (
      <Box component="ul" sx={{ ...(view === "grid" ? gridSx : { display: "flex", flexDirection: "column", gap: 1.5 }), listStyle: "none", m: 0, p: 0 }}>
        <AnimatePresence initial={false}>
          {results.map((room, i) => (
            <Box
              component={m.li}
              key={`${view}-${room.id}`}
              id={`hs-res-${room.id}`}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(i % 12, 6) * 0.035 } }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              onMouseEnter={() => setActive(room.id)}
              onMouseLeave={() => setActive(null)}
              sx={{ borderRadius: `${t.radius.xl}px`, outline: active === room.id ? `3px solid ${t.brand.yellow}` : "3px solid transparent", outlineOffset: 3, transition: "outline-color 160ms ease" }}
            >
              {view === "grid" ? (
                <RoomTagCard room={room} headingId={`hs-room-${room.id}`} saved={shortlist.has(room.id)} onToggleSave={() => (shortlist.has(room.id) ? shortlist.remove(room.id) : shortlist.add(room.id))} />
              ) : (
                <RoomRow room={room} headingId={`hs-room-${room.id}`} />
              )}
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: 3 }}>
        <HousingTopBar backHref="/housing" backLabel={s.back} />
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 30, sm: 38, md: 44 }, lineHeight: 1.06, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>{s.title}</Box>
          <Button component={Link} href="/housing/post" variant="contained" startIcon={<Plus size={17} weight="bold" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.list}</Button>
        </Box>
      </Box>

      <Panel radius="xl" sx={{ p: { xs: 2, sm: 3 }, mb: 2.5 }}>
        <SentenceSearch filters={filters} onChange={(next) => setState({ filters: next })} areas={areas} budgets={budgets} matchCount={results.length} ready={ready} />
      </Panel>

      {unique.length ? (
        <Box sx={{ mb: 2.5 }}>
          <Shortlist rooms={unique} onRemove={shortlist.remove} onClear={shortlist.clear} />
        </Box>
      ) : null}

      {ready && results.length > 1 ? (
        <Box sx={{ mb: 2.5 }}>
          <RentRuler rooms={results} activeId={active} onActive={setActive} onPick={pick} />
        </Box>
      ) : null}

      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap", mb: 2 }}>
        <Box aria-live="polite" sx={{ fontSize: 16, fontWeight: 760 }}>
          {ready ? s.count(clientFiltered ? results.length : Math.max(search.total, results.length), clientFiltered && search.hasMore) : " "}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          {ready && results.length > 1 ? <SortSwitch value={sort} onChange={(next) => setState({ sort: next })} /> : null}
          <ViewToggle value={view} onChange={(next) => setState({ view: next })} />
        </Box>
      </Box>

      {body}

      {ready && results.length ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          {search.hasMore ? (
            <Button variant="outlined" onClick={search.loadMore} disabled={search.status === "more"} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.loadMore}</Button>
          ) : (
            <Box sx={{ fontSize: 14, color: c.textMuted }}>{s.end}</Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
}

const gridSx = {
  display: "grid",
  gap: 2,
  gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))", lg: "repeat(4, minmax(0, 1fr))" },
};

/** The Search rooms page body. The route page renders the footer after it. */
export default function HousingSearch() {
  return (
    <RideThemeBridge>
      <SearchContent />
    </RideThemeBridge>
  );
}
