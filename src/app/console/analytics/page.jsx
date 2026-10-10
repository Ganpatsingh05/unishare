"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { getAdminAnalytics } from "@lib/api/api";
import { Button, Empty, Failed, FlashLine, PageHead, Panel, SkeletonRows, Stats, dateTime, useFlash } from "@features/admin/console/ui";

// The endpoint's "marketplace" figures come from the tickets table, so they're
// labelled Tickets. Only fields computed from real rows are read here.
const FEATURES = [
  { key: "rideshare", label: "Rides" },
  { key: "housing", label: "Housing" },
  { key: "marketplace", label: "Tickets" },
  { key: "lostFound", label: "Lost & found" },
];

const num = (v) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const fmt = (v) => (v == null ? "—" : v.toLocaleString());
const pct = (v) => (v == null ? "—" : `${v.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`);

function toModel(a) {
  const o = a?.overview || {};
  const c = a?.contentStats || {};
  const kinds = FEATURES.map((f) => ({ ...f, count: num(c.postsByCategory?.[f.key]), livePct: num(c.engagementRates?.[f.key]) }));
  const sum = kinds.reduce((s, k) => s + (k.count || 0), 0);
  const top = Math.max(0, ...kinds.map((k) => k.count || 0));
  return {
    totalUsers: num(o.totalUsers),
    userWeekPct: num(o.userGrowth),
    totalPosts: num(o.totalPosts),
    postWeekPct: num(o.postsGrowth),
    activeRooms: num(c.activeRooms),
    kinds: kinds.map((k) => ({ ...k, share: k.count != null && sum > 0 ? (k.count / sum) * 100 : null, top: top > 0 && k.count === top })),
    sum,
    at: a?.dataRefreshed || a?.timestamp || null,
  };
}

function PanelHead({ title, lead }) {
  return (
    <div className="border-b border-[var(--c-line)] px-4 py-3 sm:px-5">
      <h2 className="text-[15px] font-semibold">{title}</h2>
      {lead ? <p className="mt-0.5 text-[13px] text-[var(--c-muted)]">{lead}</p> : null}
    </div>
  );
}

/** One labelled horizontal bar. The bar itself is decoration; the figures are in the text. */
function BarRow({ label, value, sub, width, fill }) {
  return (
    <li className="grid gap-1.5 px-4 py-3 sm:grid-cols-[140px_minmax(0,1fr)_120px] sm:items-center sm:gap-4 sm:px-5">
      <span className="text-[13.5px] font-semibold">{label}</span>
      <span aria-hidden className="block h-2.5 overflow-hidden rounded-[3px] bg-[var(--c-panel-2)] ring-1 ring-inset ring-[var(--c-line)]">
        <span className="block h-full rounded-[3px]" style={{ width: `${Math.max(0, Math.min(100, width || 0))}%`, background: fill }} />
      </span>
      <span className="c-mono text-[12.5px] sm:text-right">
        {value}
        {sub ? <span className="ml-2 text-[var(--c-muted)]">{sub}</span> : null}
      </span>
    </li>
  );
}

function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [flash, showFlash] = useFlash();
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await getAdminAnalytics();
      if (!res?.success) throw new Error(res?.message || "Failed to load analytics");
      setData(toModel(res.analytics));
      if (loaded.current) showFlash("Refreshed");
      loaded.current = true;
      setStatus("ready");
    } catch (e) {
      const msg = e.message || "Failed to load analytics";
      setError(msg);
      if (loaded.current) showFlash(`Couldn't refresh: ${msg}`, false);
      else setStatus("error");
    } finally {
      setBusy(false);
    }
  }, [showFlash]);

  useEffect(() => {
    load();
  }, [load]);

  const ready = status === "ready" && data;
  const byShare = useMemo(() => (data ? [...data.kinds].sort((a, b) => (b.count || 0) - (a.count || 0)) : []), [data]);

  return (
    <div className="grid gap-5">
      <PageHead
        title="Analytics"
        lead="Totals counted from the users, rides, housing, tickets and lost & found tables."
        actions={
          <>
            {ready && data.at ? <span className="c-mono text-[12px] text-[var(--c-faint)]">as of {dateTime(data.at)}</span> : null}
            <Button tone="ghost" onClick={load} disabled={busy}>{busy && loaded.current ? "Refreshing…" : "Refresh"}</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Total users", value: ready ? fmt(data.totalUsers) : null },
          { label: "Share of users new in the last 7 days", value: ready ? pct(data.userWeekPct) : null },
          { label: "Total posts", value: ready ? fmt(data.totalPosts) : null },
          { label: "Share of posts made in the last 7 days", value: ready ? pct(data.postWeekPct) : null },
        ]}
      />

      <Panel>
        <PanelHead title="Posts by feature" lead="Each feature's share of all posts. The largest is highlighted." />
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : data.sum === 0 ? (
          <Empty title="no posts yet" body="Rides, housing, tickets and lost & found posts will be counted here." />
        ) : (
          <ul aria-label="Posts by feature" className="divide-y divide-[var(--c-line)]">
            {byShare.map((k) => (
              <BarRow key={k.key} label={k.label} value={fmt(k.count)} sub={pct(k.share)} width={k.share} fill={k.top ? "var(--c-mark)" : "rgba(var(--c-ink), 0.32)"} />
            ))}
          </ul>
        )}
        <p className="border-t border-[var(--c-line)] px-4 py-2.5 text-[12.5px] text-[var(--c-muted)] sm:px-5">
          Marketplace item sales aren&apos;t counted by this endpoint. Tickets are the ticket exchange.
        </p>
      </Panel>

      <Panel>
        <PanelHead title="Still live" lead="Share of each feature's posts that are still open, available or active." />
        {status === "loading" ? (
          <SkeletonRows rows={4} />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : (
          <ul aria-label="Share of posts still live" className="divide-y divide-[var(--c-line)]">
            {data.kinds.map((k) => (
              <BarRow
                key={k.key}
                label={k.label}
                value={k.count ? pct(k.livePct) : "—"}
                sub={k.key === "housing" && data.activeRooms != null ? `${fmt(data.activeRooms)} available` : null}
                width={k.count ? k.livePct : 0}
                fill="rgba(var(--c-ink), 0.55)"
              />
            ))}
          </ul>
        )}
        <FlashLine flash={flash} hint={ready && data.at ? `figures as of ${dateTime(data.at)}` : ""} />
      </Panel>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AnalyticsSection />
      </AdminLayout>
    </AdminGuard>
  );
}
