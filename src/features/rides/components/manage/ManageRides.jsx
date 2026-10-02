"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowLeft, MagnifyingGlass, Plus, Seat, SteeringWheel } from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "../../theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "../../hooks/useRideFeedback";
import useManageRides, { hostBucket, sentBucket } from "../../hooks/useManageRides";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { buildLoginHref, buildPostHref, RIDE_ROUTES } from "../../utils/rideLinks";
import Panel from "../landing/primitives/Panel";
import StateBlock from "../landing/primitives/StateBlock";
import EditRideSheet from "../landing/manage/EditRideSheet";
import { ResultCardSkeleton } from "../find/ResultCard";
import HostRideCard from "./HostRideCard";
import SentRequestCard from "./SentRequestCard";

const s = RIDE_STRINGS.my;
const TABS = [
  { key: "hosting", icon: SteeringWheel },
  { key: "joining", icon: Seat },
];
const BUCKETS = ["upcoming", "past", "cancelled"];

/** Reads and writes ?tab= and ?show= so a view can be linked and survives reloads. */
function useViewParams() {
  const [view, setView] = useState({ tab: "hosting", show: "upcoming" });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    const show = params.get("show");
    setView({ tab: TABS.some((x) => x.key === tab) ? tab : "hosting", show: BUCKETS.includes(show) ? show : "upcoming" });
  }, []);
  const update = useCallback((patch) => {
    setView((prev) => {
      const next = { ...prev, ...patch };
      const params = new URLSearchParams(window.location.search);
      params.set("tab", next.tab);
      if (next.show === "upcoming") params.delete("show");
      else params.set("show", next.show);
      window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
      return next;
    });
  }, []);
  return [view, update];
}

function TabBar({ value, onChange, counts }) {
  const t = useRideTokens();
  const c = t.color;
  const onKeyDown = (event, index) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    onChange(next.key);
    document.getElementById(`rs-my-tab-${next.key}`)?.focus();
  };
  return (
    <Box role="tablist" aria-label={s.tabsLabel} sx={{ display: "inline-flex", alignSelf: "flex-start", gap: 0.5, p: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive, maxWidth: "100%" }}>
      {TABS.map((tab, index) => {
        const selected = tab.key === value;
        const Icon = tab.icon;
        return (
          <ButtonBase
            key={tab.key}
            id={`rs-my-tab-${tab.key}`}
            role="tab"
            aria-selected={selected}
            aria-controls="rs-my-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            sx={{
              position: "relative",
              minHeight: 48,
              px: { xs: 2, sm: 2.75 },
              gap: 1,
              borderRadius: `${t.radius.pill}px`,
              fontSize: 15,
              fontWeight: 720,
              color: selected ? c.text : c.textOnInset,
              "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 },
            }}
          >
            {selected ? (
              <Box component={m.span} layoutId="rs-my-tab" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} />
            ) : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
              {/* Icon tile: tinted and duotone on the selected tab, quiet otherwise. */}
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 30,
                  height: 30,
                  borderRadius: `${t.radius.sm}px`,
                  backgroundColor: selected ? c.actionSoftStrong : "transparent",
                  color: selected ? c.accentText : "inherit",
                  transition: "background-color 180ms ease, color 180ms ease",
                }}
              >
                <Icon size={19} weight={selected ? "duotone" : "regular"} />
              </Box>
              {s.tabs[tab.key]}
              {counts[tab.key] ? (
                <Box component="span" sx={{ minWidth: 22, height: 22, px: 0.75, display: "inline-grid", placeItems: "center", borderRadius: 11, fontSize: 12, fontWeight: 800, backgroundColor: c.highlight, color: c.onHighlight }}>
                  {counts[tab.key]}
                </Box>
              ) : null}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function BucketFilter({ value, onChange, counts }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.filtersLabel} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      {BUCKETS.map((key) => {
        const selected = key === value;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(key)}
            sx={{
              minHeight: 40,
              px: 1.75,
              gap: 0.75,
              borderRadius: `${t.radius.pill}px`,
              border: `1px solid ${selected ? c.action : c.border}`,
              backgroundColor: selected ? c.actionSoft : c.surface,
              color: selected ? c.accentText : c.textSecondary,
              fontSize: 14,
              fontWeight: 700,
              "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
            }}
          >
            {s.filters[key]}
            <Box component="span" sx={{ fontVariantNumeric: "tabular-nums", color: selected ? c.accentText : c.textMuted }}>
              {counts[key] || 0}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function StatChips({ items }) {
  const t = useRideTokens();
  return (
    <Box component="ul" aria-label={s.stats.label} sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((item) => (
        <Box
          component="li"
          key={item.key}
          sx={{
            px: 1.5,
            py: 0.75,
            borderRadius: `${t.radius.pill}px`,
            fontSize: 13.5,
            fontWeight: 700,
            backgroundColor: item.strong ? t.color.highlight : t.color.surface,
            color: item.strong ? t.color.onHighlight : t.color.textSecondary,
            border: item.strong ? "1px solid transparent" : `1px solid ${t.color.border}`,
          }}
        >
          {item.label}
        </Box>
      ))}
    </Box>
  );
}

function Confirm({ open, title, body, ok, onOk, onClose }) {
  const t = useRideTokens();
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="rs-my-confirm-title" slotProps={{ paper: { sx: { borderRadius: `${t.radius.xl}px`, p: 1, maxWidth: 420 } } }}>
      <DialogTitle id="rs-my-confirm-title" sx={{ fontWeight: 760 }}>
        {title}
      </DialogTitle>
      <DialogContent sx={{ color: t.color.textSecondary, fontSize: 15, lineHeight: 1.5 }}>{body}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ minHeight: 44 }} autoFocus>
          {s.host.confirmKeep}
        </Button>
        <Button onClick={onOk} variant="contained" color="error" sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
          {ok}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function ManageContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const data = useManageRides({ onCommitError: (error) => notify({ message: error || RIDE_STRINGS.errors.respondFailed, tone: "error" }) });
  const [view, setView] = useViewParams();
  const [editing, setEditing] = useState({ ride: null, open: false });
  const [confirm, setConfirm] = useState(null); // { kind: "ride" | "request", item }

  const now = new Date();
  const hosting = useMemo(() => data.hosting.map((ride) => ({ ride, bucket: hostBucket(ride, now) })), [data.hosting]); // eslint-disable-line react-hooks/exhaustive-deps
  const joining = useMemo(() => data.sent.map((request) => ({ request, bucket: sentBucket(request, now) })), [data.sent]); // eslint-disable-line react-hooks/exhaustive-deps
  const count = (list) => list.reduce((acc, { bucket }) => ({ ...acc, [bucket]: (acc[bucket] || 0) + 1 }), {});
  const hostCounts = count(hosting);
  const joinCounts = count(joining);
  const waiting = hosting.filter((x) => x.bucket === "upcoming").reduce((sum, x) => sum + x.ride.pending.length, 0);
  const booked = joining.filter((x) => x.bucket === "upcoming" && x.request.status === "confirmed").reduce((sum, x) => sum + x.request.seats, 0);

  const respond = useCallback(
    (request, action) => {
      data.respond(request, action);
      notify({
        message: action === "confirm" ? RIDE_STRINGS.manage.accepted(request.name) : RIDE_STRINGS.manage.declined(request.name),
        tone: "success",
        actionLabel: RIDE_STRINGS.manage.undo,
        onAction: () => data.undo(request.id),
      });
    },
    [data, notify]
  );

  const onConfirm = async () => {
    const current = confirm;
    setConfirm(null);
    if (!current) return;
    if (current.kind === "ride") {
      const result = await data.cancelRide(current.item);
      notify(result.success ? { message: s.host.cancelled, tone: "success" } : { message: result.error || s.host.cancelFailed, tone: "error" });
    } else {
      const result = await data.cancelRequest(current.item);
      notify(result.success ? { message: s.joining.cancelled, tone: "success" } : { message: result.error || s.joining.cancelFailed, tone: "error" });
    }
  };

  const onSave = useCallback(
    async (patch) => {
      const result = await data.updateRide(editing.ride, patch);
      notify(result.success ? { message: RIDE_STRINGS.manage.saved, tone: "success" } : { message: result.error || RIDE_STRINGS.errors.updateFailed, tone: "error" });
      return result;
    },
    [data, editing.ride, notify]
  );

  const tab = view.tab;
  const list = (tab === "hosting" ? hosting : joining).filter((x) => x.bucket === view.show);
  const emptyKey = `${tab}${view.show[0].toUpperCase()}${view.show.slice(1)}`;
  const empty = s.empty[emptyKey];
  const emptyAction =
    view.show === "upcoming" ? (
      <Button
        component={Link}
        href={tab === "hosting" ? buildPostHref({}) : RIDE_ROUTES.find}
        variant="contained"
        startIcon={tab === "hosting" ? <Plus size={16} weight="bold" aria-hidden /> : <MagnifyingGlass size={16} aria-hidden />}
        sx={{ minHeight: 44 }}
      >
        {tab === "hosting" ? s.post : s.find}
      </Button>
    ) : null;

  let body;
  if (data.status === "loading") {
    body = (
      <Box aria-busy="true" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[0, 1, 2].map((key) => (
          <ResultCardSkeleton key={key} />
        ))}
      </Box>
    );
  } else if (data.status === "signedout") {
    const href = buildLoginHref(typeof window === "undefined" ? RIDE_ROUTES.manage : window.location.pathname + window.location.search);
    body = (
      <Panel radius="xl">
        <StateBlock
          title={s.signIn.title}
          body={s.signIn.body}
          action={
            <Button component={Link} href={href} variant="contained" sx={{ minHeight: 48, px: 4, borderRadius: `${t.radius.pill}px` }}>
              {s.signIn.cta}
            </Button>
          }
        />
      </Panel>
    );
  } else if (data.status === "error") {
    body = (
      <Panel radius="xl">
        <StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={() => data.reload()} retryLabel={s.error.retry} />
      </Panel>
    );
  } else if (!list.length) {
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock title={empty.title} body={empty.body} action={emptyAction} />
      </Panel>
    );
  } else {
    body = (
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 1.5 }}>
        <AnimatePresence initial={false}>
          {list.map((entry, index) => {
            const key = tab === "hosting" ? entry.ride.id : entry.request.id;
            return (
              <Box
                component={m.li}
                key={key}
                layout={reduce ? false : "position"}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.26, delay: Math.min(index, 6) * 0.04, ease: t.motion.ease } }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
              >
                {tab === "hosting" ? (
                  <HostRideCard
                    ride={entry.ride}
                    bucket={entry.bucket}
                    onRespond={respond}
                    onEdit={(ride) => setEditing({ ride, open: true })}
                    onCancel={(ride) => setConfirm({ kind: "ride", item: ride })}
                  />
                ) : (
                  <SentRequestCard request={entry.request} bucket={entry.bucket} onCancel={(request) => setConfirm({ kind: "request", item: request })} />
                )}
              </Box>
            );
          })}
        </AnimatePresence>
      </Box>
    );
  }

  const ready = data.status === "ready";
  const affected = confirm?.kind === "ride" ? confirm.item.pending.length + confirm.item.confirmed.length : 0;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 960 + 2 * t.layout.gutterDesktop,
        mx: "auto",
        px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` },
        pt: { xs: 2, md: 4 },
        pb: { xs: 12, md: 9 },
      }}
    >
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href={RIDE_ROUTES.home} variant="text" startIcon={<ArrowLeft size={16} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: c.textSecondary }}>
          {s.back}
        </Button>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 28, sm: 36, md: 42 }, lineHeight: 1.08, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
              {s.title}
            </Box>
            <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>
              {s.lead}
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href={RIDE_ROUTES.find} variant="outlined" startIcon={<MagnifyingGlass size={17} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
              {s.find}
            </Button>
            <Button component={Link} href={buildPostHref({})} variant="contained" startIcon={<Plus size={17} weight="bold" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
              {s.post}
            </Button>
          </Box>
        </Box>
        {ready ? (
          <Box sx={{ mt: 2 }}>
            <StatChips
              items={[
                { key: "waiting", label: s.stats.waiting(waiting), strong: waiting > 0 },
                { key: "hosting", label: s.stats.hosting(hostCounts.upcoming || 0) },
                { key: "joining", label: s.stats.joining(booked) },
              ]}
            />
          </Box>
        ) : null}
      </Box>

      {data.status !== "signedout" ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2.5 }}>
          <TabBar value={tab} onChange={(next) => setView({ tab: next, show: "upcoming" })} counts={{ hosting: waiting, joining: 0 }} />
          <BucketFilter value={view.show} onChange={(show) => setView({ show })} counts={tab === "hosting" ? hostCounts : joinCounts} />
        </Box>
      ) : null}

      <Box id="rs-my-panel" role={data.status !== "signedout" ? "tabpanel" : undefined} aria-labelledby={data.status !== "signedout" ? `rs-my-tab-${tab}` : undefined}>
        {body}
      </Box>

      <EditRideSheet ride={editing.ride} open={editing.open} onClose={() => setEditing((prev) => ({ ...prev, open: false }))} onSave={onSave} />
      <Confirm
        open={Boolean(confirm)}
        title={confirm?.kind === "ride" ? s.host.confirmCancelTitle : s.joining.confirmCancelTitle}
        body={confirm?.kind === "ride" ? s.host.confirmCancelBody(affected) : s.joining.confirmCancelBody}
        ok={confirm?.kind === "ride" ? s.host.confirmCancelOk : s.joining.confirmCancelOk}
        onOk={onConfirm}
        onClose={() => setConfirm(null)}
      />
    </Box>
  );
}

/** The Manage rides page body. The route page renders the footer after it. */
export default function ManageRides() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ManageContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
