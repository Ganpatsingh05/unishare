"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import { useAuth } from "@contexts/UniShareContext";
import { featureByKey } from "@components/layout/header/navConfig";
import { ACTIVITY_STRINGS } from "../constants/activityStrings";
import { MODULES, cancelRequest, loadAllRequests, respondToRequest } from "../services/activity.service";
import { byPriority, toRequest } from "../utils/requestModel";
import RequestCard from "./RequestCard";

const S = ACTIVITY_STRINGS;
const KEYS = Object.keys(MODULES);
const STATUSES = ["all", "pending", "accepted", "declined", "cancelled"];

function useRequests(enabled) {
  const [state, setState] = useState({ status: "loading", received: [], sent: [], failed: [] });

  const load = useCallback(async () => {
    try {
      const res = await loadAllRequests();
      if (res.authError && !Object.keys(res.received).length && !Object.keys(res.sent).length) {
        setState({ status: "signedout", received: [], sent: [], failed: [] });
        return;
      }
      if (res.failed.length === KEYS.length) {
        setState((s) => ({ ...s, status: "error" }));
        return;
      }
      const received = KEYS.flatMap((k) => (res.received[k] || []).map((r) => toRequest(k, "received", r)));
      const sent = KEYS.flatMap((k) => (res.sent[k] || []).map((r) => toRequest(k, "sent", r)));
      setState({ status: "ready", received, sent, failed: res.failed });
    } catch {
      setState((s) => ({ ...s, status: "error" }));
    }
  }, []);

  useEffect(() => {
    if (enabled) load();
  }, [enabled, load]);

  // Update one request in place after an action, without a reload.
  const patch = useCallback((req, next) => {
    setState((s) => {
      const list = req.direction === "received" ? "received" : "sent";
      return { ...s, [list]: s[list].map((r) => (r.key === req.key ? { ...r, ...next } : r)) };
    });
  }, []);

  return { ...state, reload: load, patch };
}

/** A summary card that takes you to the right tab. */
function SummaryCard({ title, count, action, onClick, hot, t }) {
  const c = t.color;
  return (
    <Box sx={{ flex: "1 1 260px", display: "flex", alignItems: "center", gap: 2, p: { xs: 2, sm: 2.5 }, borderRadius: "20px", border: `1px solid ${hot ? t.brand.yellow : c.border}`, backgroundColor: hot ? `${t.brand.yellow}1F` : c.surface }}>
      <Box sx={{ fontSize: 40, fontWeight: 850, lineHeight: 1, fontVariantNumeric: "tabular-nums", color: hot ? (t.mode === "dark" ? t.brand.yellow : t.brand.inkNavy) : c.text, minWidth: 44 }}>{count}</Box>
      <Box sx={{ flex: 1, minWidth: 0, fontSize: 15.5, fontWeight: 700, color: c.text, lineHeight: 1.35 }}>{title}</Box>
      {count ? (
        <Button variant={hot ? "contained" : "outlined"} onClick={onClick} sx={{ minHeight: 40, borderRadius: 99, flexShrink: 0, ...(hot ? { backgroundColor: t.brand.inkNavy, color: "#fff", "&:hover": { backgroundColor: t.brand.inkNavy } } : {}) }}>
          {action}
        </Button>
      ) : null}
    </Box>
  );
}

function Tabs({ value, onChange, counts, t }) {
  const c = t.color;
  return (
    <Box role="tablist" aria-label="Received or sent" sx={{ display: "inline-flex", p: 0.5, gap: 0.5, borderRadius: 99, backgroundColor: c.surfaceInteractive }}>
      {["received", "sent"].map((k) => {
        const on = value === k;
        return (
          <ButtonBase key={k} role="tab" aria-selected={on} onClick={() => onChange(k)} sx={{ height: 40, px: 2.25, gap: 1, borderRadius: 99, fontSize: 15, fontWeight: 750, color: on ? c.text : c.textSecondary, backgroundColor: on ? c.surface : "transparent", boxShadow: on ? t.elevation[1] : "none", "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
            {S.tabs[k]}
            <Box component="span" sx={{ minWidth: 22, px: 0.75, borderRadius: 99, fontSize: 12.5, fontWeight: 800, lineHeight: "20px", textAlign: "center", backgroundColor: on ? c.actionSoft : c.surface, color: on ? c.accentText : c.textMuted }}>{counts[k]}</Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function FeatureChips({ value, onChange, counts, t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  const options = ["all", ...KEYS.filter((k) => counts[k])];
  return (
    <Box role="radiogroup" aria-label={S.filters.feature} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {options.map((k) => {
        const on = value === k;
        const f = k === "all" ? null : featureByKey[k];
        const ink = f ? f.ink[dark ? 1 : 0] : c.text;
        return (
          <ButtonBase
            key={k}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(k)}
            sx={{ flex: "0 0 auto", height: 36, px: 1.5, gap: 0.75, borderRadius: 99, fontSize: 14, fontWeight: 700, border: `1px solid ${on ? ink : c.border}`, color: on ? (dark || !f ? ink : `color-mix(in srgb, ${ink} 72%, #000)`) : c.textSecondary, backgroundColor: on ? `${ink}${dark ? "1F" : "12"}` : c.surface, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}
          >
            {f ? f.label : S.filters.all}
            <Box component="span" sx={{ fontSize: 12.5, fontWeight: 800, opacity: 0.75 }}>{k === "all" ? counts.all : counts[k]}</Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function ActivityContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const params = useSearchParams();
  const { isAuthenticated, authLoading } = useAuth();
  const { notify } = useRideFeedback();
  const req = useRequests(Boolean(isAuthenticated));
  const [tab, setTab] = useState(params.get("tab") === "sent" ? "sent" : "received");
  const [feature, setFeature] = useState(KEYS.includes(params.get("feature")) ? params.get("feature") : "all");
  const [status, setStatus] = useState("all");

  const list = tab === "received" ? req.received : req.sent;
  const featureCounts = useMemo(() => Object.fromEntries([["all", list.length], ...KEYS.map((k) => [k, list.filter((r) => r.module === k).length])]), [list]);
  const shown = useMemo(() => list.filter((r) => (feature === "all" || r.module === feature) && (status === "all" || r.status === status)).sort(byPriority), [list, feature, status]);
  const waitingOnYou = req.received.filter((r) => r.status === "pending").length;
  const yourPending = req.sent.filter((r) => r.status === "pending").length;

  useEffect(() => {
    if (feature !== "all" && !featureCounts[feature]) setFeature("all");
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const onRespond = async (r, decision, note) => {
    try {
      await respondToRequest(r.module, r.id, decision, note);
      req.patch(r, { status: decision === "accept" ? "accepted" : "declined", reply: note || r.reply });
      notify({ message: S.done[decision], tone: "success" });
    } catch (e) {
      notify({ message: e.message || "That didn't go through. Try again.", tone: "error" });
    }
  };
  const onCancel = async (r) => {
    try {
      await cancelRequest(r.module, r.id);
      req.patch(r, { status: "cancelled" });
      notify({ message: S.done.cancel, tone: "success" });
    } catch (e) {
      notify({ message: e.message || "Couldn't cancel it. Try again.", tone: "error" });
    }
  };

  const container = { width: "100%", maxWidth: 980, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } };
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };

  if (!authLoading && (!isAuthenticated || req.status === "signedout")) {
    return (
      <Box sx={container}>
        <Panel radius="xl" sx={{ mt: 4 }}>
          <StateBlock title={S.signedOut.title} body={S.signedOut.body} action={<Button component={Link} href="/login?redirect=/my-activity" variant="contained" sx={{ minHeight: 44, borderRadius: 99 }}>{S.signedOut.cta}</Button>} />
        </Panel>
      </Box>
    );
  }

  return (
    <Box sx={container}>
      <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 52 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
        <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{S.hero.lead}</Box> <Box component="span" sx={accentSx}>{S.hero.accent}</Box>
      </Box>
      <Box component="p" sx={{ m: 0, mt: 1.25, maxWidth: 560, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{S.hero.body}</Box>

      {req.status === "loading" || authLoading ? (
        <Box aria-busy="true" aria-label="Loading your requests" sx={{ mt: 4, display: "grid", gap: 2 }}>
          <Skeleton variant="rounded" height={84} sx={{ borderRadius: "20px" }} />
          {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: "20px" }} />)}
        </Box>
      ) : req.status === "error" ? (
        <Panel radius="xl" sx={{ mt: 4 }}>
          <StateBlock tone="error" title={S.error.title} body={S.error.body} onRetry={req.reload} retryLabel={S.error.retry} />
        </Panel>
      ) : (
        <>
          <Box sx={{ mt: 3.5, display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <SummaryCard t={t} hot={waitingOnYou > 0} count={waitingOnYou} title={waitingOnYou ? S.summary.waitingTitle(waitingOnYou) : S.summary.waitingNone} action={S.summary.waitingAction} onClick={() => (setTab("received"), setStatus("pending"))} />
            <SummaryCard t={t} count={yourPending} title={yourPending ? S.summary.sentTitle(yourPending) : S.summary.sentNone} action={S.summary.sentAction} onClick={() => (setTab("sent"), setStatus("pending"))} />
          </Box>

          <Box sx={{ mt: 4, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
            <Tabs t={t} value={tab} onChange={(v) => (setTab(v), setStatus("all"))} counts={{ received: req.received.length, sent: req.sent.length }} />
            <Box component="label" sx={{ display: "inline-flex", alignItems: "center", gap: 1, fontSize: 14, fontWeight: 650, color: c.textSecondary }}>
              {S.filters.status}
              <Box component="select" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ height: 40, px: 1.5, borderRadius: "12px", border: `1px solid ${c.border}`, backgroundColor: c.surface, color: c.text, fontSize: 14, fontWeight: 650, "&:focus-visible": { outline: `2px solid ${c.focus}` } }}>
                {STATUSES.map((v) => <option key={v} value={v}>{v === "all" ? S.filters.statusAll : S.filters[v]}</option>)}
              </Box>
            </Box>
          </Box>

          {list.length ? (
            <Box sx={{ mt: 2 }}>
              <FeatureChips t={t} value={feature} onChange={setFeature} counts={featureCounts} />
            </Box>
          ) : null}

          {req.failed.length ? (
            <Box role="status" sx={{ mt: 2, px: 2, py: 1.25, borderRadius: "14px", backgroundColor: c.dangerSoft, color: c.text, fontSize: 14 }}>
              {S.failed(req.failed.map((k) => featureByKey[k].label).join(", "))}
            </Box>
          ) : null}

          <Box component="section" aria-label={S.tabs[tab]} sx={{ mt: 2.5 }}>
            {shown.length === 0 ? (
              <Panel radius="xl">
                <StateBlock title={list.length ? S.empty.filtered.title : S.empty[tab].title} body={list.length ? S.empty.filtered.body : S.empty[tab].body} />
              </Panel>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                <Box key={`${tab}-${feature}-${status}`} component={m.div} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} sx={{ display: "grid", gap: 2 }}>
                  {shown.map((r, i) => (
                    <RequestCard key={r.key} req={r} index={i} onRespond={onRespond} onCancel={onCancel} />
                  ))}
                </Box>
              </AnimatePresence>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

/** "My activity": every request you've received and sent, in one place. */
export default function ActivityPage() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ActivityContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
