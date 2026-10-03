"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, Plus } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { matchesDayFilter } from "../../../utils/rideFormat";
import { RIDE_ROUTES } from "../../../utils/rideLinks";
import Panel from "../primitives/Panel";
import SectionHeader from "../primitives/SectionHeader";
import StateBlock from "../primitives/StateBlock";
import DayFilter, { DAY_FILTERS } from "./DayFilter";
import RideCard from "./RideCard";
import RideCardSkeleton from "./RideCardSkeleton";

const S = RIDE_STRINGS.recent;
const MAX_CARDS = 9;
const SKELETONS = 3;
const CAROUSEL_GAP = 12;

function pickDefaultFilter(counts) {
  if (counts.today > 0) return "today";
  if (counts.tomorrow > 0) return "tomorrow";
  return "week";
}

function byDeparture(a, b) {
  return (a.startsAt?.getTime() ?? 0) - (b.startsAt?.getTime() ?? 0);
}

/** Tracks which card sits at the start of the snap carousel. */
function useCarouselIndex(ref, enabled, length, resetKey) {
  const [index, setIndex] = useState(0);
  const frame = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!enabled || !node) return undefined;
    const measure = () => {
      frame.current = 0;
      const first = node.firstElementChild;
      if (!first) return;
      const step = first.getBoundingClientRect().width + CAROUSEL_GAP;
      const atEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      setIndex(atEnd ? length - 1 : Math.round(node.scrollLeft / step));
    };
    const onScroll = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure);
    };
    node.scrollLeft = 0;
    measure();
    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      node.removeEventListener("scroll", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [ref, enabled, length, resetKey]);

  return Math.min(index, Math.max(length - 1, 0));
}

function SeeAllLink({ t }) {
  return (
    <Box
      component={Link}
      href={RIDE_ROUTES.find}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        minHeight: t.layout.touch,
        px: 1,
        mx: -1,
        borderRadius: `${t.radius.sm}px`,
        fontSize: 14.5,
        fontWeight: 650,
        whiteSpace: "nowrap",
        // The link sits on the page background, not a surface: the deeper
        // blue keeps it AA on the light sky backdrop.
        color: t.mode === "light" ? t.color.actionHover : t.color.action,
        textDecoration: "none",
        "& svg": { transition: `transform ${t.motion.duration.base}s` },
        "@media (hover: hover)": {
          "&:hover": { textDecoration: "underline", textUnderlineOffset: "4px" },
          "&:hover svg": { transform: "translateX(3px)" },
        },
        "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
      }}
    >
      {S.viewAll}
      <ArrowRight size={18} weight="regular" aria-hidden />
    </Box>
  );
}

/** Slot for one card: grid cell on tablet and desktop, snap item on phones. */
const cardSlotSx = {
  minWidth: 0,
  flex: { xs: "0 0 84%", sm: "initial" },
  scrollSnapAlign: { xs: "start", sm: "none" },
};

function RideList({ t, rides, filter, isMobile, requestState, onRequest }) {
  const reduce = useReducedMotion();
  const listRef = useRef(null);
  const index = useCarouselIndex(listRef, isMobile, rides.length, filter);

  return (
    <Box role={isMobile ? "region" : undefined} aria-label={isMobile ? S.carouselLabel : undefined}>
      <Box ref={listRef} role="list" tabIndex={isMobile ? 0 : undefined} sx={listSx(t)}>
        <AnimatePresence>
          {rides.map((ride, i) => (
            <Box
              key={ride.id}
              component={m.div}
              layout={!reduce}
              role="listitem"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
              viewport={{ once: true, amount: "some", margin: "0px 0px -64px 0px" }}
              transition={{ ...t.motion.spring, delay: reduce ? 0 : (i % 3) * t.motion.stagger, layout: t.motion.spring }}
              sx={cardSlotSx}
            >
              <RideCard ride={ride} state={requestState?.[ride.id]} onRequest={onRequest} />
            </Box>
          ))}
        </AnimatePresence>
      </Box>
      {isMobile && rides.length > 1 ? (
        <Box
          aria-hidden
          sx={{
            mt: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1.25,
            fontSize: 12.5,
            fontWeight: 650,
            color: t.color.textSecondary,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Box component="span" sx={{ display: "grid", gap: "3px", width: 28 }}>
            <Box component="span" sx={{ height: 2, borderRadius: 1, backgroundColor: t.color.rider }} />
            <Box component="span" sx={{ height: 2, borderRadius: 1, backgroundColor: t.color.driver }} />
          </Box>
          {RIDE_STRINGS.recent.position(index + 1, rides.length)}
        </Box>
      ) : null}
    </Box>
  );
}

/** Grid on tablet and desktop; edge-to-edge snap carousel on phones. */
function listSx(t) {
  return {
    display: { xs: "flex", sm: "grid" },
    gridTemplateColumns: { sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
    gap: { xs: `${CAROUSEL_GAP}px`, sm: "20px" },
    alignItems: "stretch",
    overflowX: { xs: "auto", sm: "visible" },
    overflowY: { xs: "hidden", sm: "visible" },
    scrollSnapType: { xs: "x mandatory", sm: "none" },
    scrollPaddingInline: { xs: `${t.layout.gutterMobile}px`, sm: 0 },
    mx: { xs: `-${t.layout.gutterMobile}px`, sm: 0 },
    px: { xs: `${t.layout.gutterMobile}px`, sm: 0 },
    // Room for the hover lift and card shadows inside the scroll clip.
    py: { xs: 1.5, sm: 0 },
    my: { xs: -1.5, sm: 0 },
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": { display: "none" },
    "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: -2, borderRadius: `${t.radius.lg}px` },
  };
}

function LoadingList({ t }) {
  return (
    <Box aria-busy="true" sx={listSx(t)}>
      {Array.from({ length: SKELETONS }, (_, i) => (
        <Box key={i} sx={[cardSlotSx, i === SKELETONS - 1 && { display: { xs: "none", md: "block" } }]}>
          <RideCardSkeleton />
        </Box>
      ))}
    </Box>
  );
}

const GHOST_NOTCH = `radial-gradient(circle at 0 calc(100% - 40px), transparent 8px, #000 8.5px) left / 51% 100% no-repeat, radial-gradient(circle at 100% calc(100% - 40px), transparent 8px, #000 8.5px) right / 51% 100% no-repeat`;

/** An unfilled ride pass: dashed outline, notches and blank rows. Decorative. */
function GhostPass({ t, tilt }) {
  const bar = (width) => ({ height: 8, width, borderRadius: 4, backgroundColor: t.color.surfaceInteractive });
  return (
    <Box
      aria-hidden
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifySelf: tilt < 0 ? "end" : "start",
        width: 200,
        height: 132,
        p: 2,
        gap: 1.25,
        borderRadius: `${t.radius.lg}px`,
        border: `1.5px dashed ${t.color.borderStrong}`,
        backgroundColor: t.color.surfaceAlt,
        transform: `rotate(${tilt}deg)`,
        mask: GHOST_NOTCH,
        WebkitMask: GHOST_NOTCH,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: "50%", border: `2.5px solid ${t.color.rider}`, flexShrink: 0 }} />
        <Box sx={bar("62%")} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{ width: 9, height: 9, mx: "0.5px", borderRadius: "2px", transform: "rotate(45deg)", backgroundColor: t.color.driver, flexShrink: 0 }}
        />
        <Box sx={bar("46%")} />
      </Box>
      <Box sx={{ mt: "auto", mx: -2, px: 2.5, mb: 1.25 }}>
        <Box sx={{ borderTop: `1.5px dashed ${t.color.borderStrong}` }} />
      </Box>
      <Box sx={{ ...bar("100%"), height: 14, borderRadius: `${t.radius.pill}px` }} />
    </Box>
  );
}

function EmptyRides({ t, filter }) {
  return (
    <Panel
      variant="flat"
      radius="lg"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "1fr minmax(0, 380px) 1fr" },
        alignItems: "center",
        columnGap: 3,
        px: { md: 4 },
        overflow: "hidden",
      }}
    >
      <GhostPass t={t} tilt={-4} />
      <StateBlock
        title={S.emptyTitle(filter)}
        body={S.emptyBody}
        action={
          <Button
            component={Link}
            href={RIDE_ROUTES.post}
            variant="contained"
            color="secondary"
            startIcon={<Plus size={18} aria-hidden />}
          >
            {S.emptyCta}
          </Button>
        }
      />
      <GhostPass t={t} tilt={4} />
    </Panel>
  );
}

/**
 * "Going soon": upcoming rides filtered by day, as ride-pass cards.
 * @param {{ feed: { rides: object[], status: "loading"|"ready"|"error", reload: () => void, requestState: Record<string, string>, requestSeat: (ride: object) => void } }} props
 */
export default function RecentRides({ feed }) {
  const t = useRideTokens();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [chosen, setChosen] = useState(null);
  const rides = feed?.rides;

  const counts = useMemo(() => {
    const result = { today: 0, tomorrow: 0, week: 0 };
    for (const ride of rides || []) {
      for (const key of DAY_FILTERS) if (matchesDayFilter(ride.date, key)) result[key] += 1;
    }
    return result;
  }, [rides]);

  const loading = feed.status === "loading";
  const filter = chosen ?? (loading ? DAY_FILTERS[0] : pickDefaultFilter(counts));
  // A filter over nothing (load failed, or no rides at all) is noise.
  const showFilter = loading || (feed.status === "ready" && DAY_FILTERS.some((key) => counts[key] > 0));

  const visible = useMemo(
    () =>
      (rides || [])
        .filter((ride) => matchesDayFilter(ride.date, filter))
        .sort(byDeparture)
        .slice(0, MAX_CARDS),
    [rides, filter]
  );

  let body;
  if (loading) {
    body = <LoadingList t={t} />;
  } else if (feed.status === "error") {
    body = (
      <Panel variant="flat" radius="lg">
        <StateBlock
          tone="error"
          title={S.errorTitle}
          body={S.errorBody}
          onRetry={feed.reload}
          retryLabel={S.retry}
        />
      </Panel>
    );
  } else if (!visible.length) {
    body = <EmptyRides t={t} filter={filter} />;
  } else {
    body = (
      <RideList
        t={t}
        rides={visible}
        filter={filter}
        isMobile={isMobile}
        requestState={feed.requestState}
        onRequest={feed.requestSeat}
      />
    );
  }

  return (
    <Box>
      <SectionHeader
        id="rs-recent-title"
        eyebrow={S.eyebrow}
        eyebrowIcon={Clock}
        title={S.title}
        trailing={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexWrap: { xs: "wrap", sm: "nowrap" },
              justifyContent: { xs: "space-between", sm: "flex-end" },
              rowGap: 1,
              columnGap: { xs: 2, md: 3 },
              width: { xs: "100%", sm: "auto" },
            }}
          >
            {showFilter ? <DayFilter value={filter} onChange={setChosen} counts={loading ? null : counts} /> : null}
            <SeeAllLink t={t} />
          </Box>
        }
        sx={{ "& > :last-child": { width: { xs: "100%", sm: "auto" } } }}
      />
      {body}
    </Box>
  );
}
