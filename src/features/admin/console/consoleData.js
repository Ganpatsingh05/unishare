"use client";

import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { apiCall } from "@lib/api/base";

// Console colours as CSS variables. Graphite and paper, with UniShare yellow
// kept for the one thing that matters most: what needs an admin.
export function consoleVars(dark) {
  return dark
    ? {
        "--c-bg": "#0D0F11",
        "--c-panel": "#14171A",
        "--c-panel-2": "#1A1E22",
        "--c-line": "#262B31",
        "--c-line-2": "#323840",
        "--c-text": "#E8EAED",
        "--c-muted": "#AEB5BD",
        "--c-faint": "#8A929B",
        "--c-mark": "#FFD24C",
        "--c-on-mark": "#12233A",
        "--c-good": "#4ADE80",
        "--c-bad": "#F87171",
        "--c-link": "#7DD3FC",
        "--c-ring": "#60A5FA",
        "--c-ink": "232, 234, 237",
        "--c-good-ink": "#86EFAC",
        "--c-accent": "#2563EB",
        "--c-on-accent": "#FFFFFF",
        "--c-accent-text": "#93C5FD",
        "--c-accent-soft": "rgba(59, 130, 246, 0.16)",
        "--c-warn-ink": "#FCD34D",
        "--c-warn-soft": "rgba(245, 158, 11, 0.16)",
        "--c-good-soft": "rgba(74, 222, 128, 0.14)",
        "--c-bad-soft": "rgba(248, 113, 113, 0.14)",
        "--c-bad-ink": "#FCA5A5",
        "--c-link-ink": "#93C5FD",
      }
    : {
        "--c-bg": "#F4F4F1",
        "--c-panel": "#FFFFFF",
        "--c-panel-2": "#FAFAF7",
        "--c-line": "#E3E3DE",
        "--c-line-2": "#D2D2CC",
        "--c-text": "#15171A",
        "--c-muted": "#4D535A",
        "--c-faint": "#656B72",
        "--c-mark": "#FFD24C",
        "--c-on-mark": "#12233A",
        "--c-good": "#15803D",
        "--c-bad": "#B91C1C",
        "--c-link": "#1565D8",
        "--c-ring": "#1565D8",
        "--c-ink": "21, 23, 26",
        "--c-good-ink": "#14532D",
        "--c-accent": "#2563EB",
        "--c-on-accent": "#FFFFFF",
        "--c-accent-text": "#1D4ED8",
        "--c-accent-soft": "#EAF1FF",
        "--c-warn-ink": "#7C2D12",
        "--c-warn-soft": "#FEF3C7",
        "--c-good-soft": "#DCFCE7",
        "--c-bad-soft": "#FEE2E2",
        "--c-bad-ink": "#7F1D1D",
        "--c-link-ink": "#1E3A8A",
      };
}

/** Kinds of things in the ledger, keyed by the activity feed's `type`. */
export const LEDGER_KINDS = {
  user: { label: "Sign-up", tone: "info" },
  ride: { label: "Ride", tone: "neutral" },
  marketplace: { label: "Ticket", tone: "neutral" },
  "lost-found": { label: "Lost & Found", tone: "neutral" },
  report: { label: "Report", tone: "bad" },
};

export const INBOX_KINDS = {
  announcement: { label: "Announcement", tone: "info", actions: [["publish", "Publish"], ["decline", "Decline"]], href: "/console/announcements" },
  resource: { label: "Resource", tone: "good", actions: [["publish", "Publish"], ["decline", "Decline"]], href: "/console/resources" },
  report: { label: "Report", tone: "bad", actions: [["resolve", "Resolve"], ["dismiss", "Dismiss"]], href: "/console/moderation" },
};

/** "4m", "3h", "2d", or a short date for anything older than a week. */
export function ago(iso, now = Date.now()) {
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}

export const fmt = (n) => (n == null || Number.isNaN(n) ? "—" : Number(n).toLocaleString());
const num = (v) => (v == null || v === "" || Number.isNaN(Number(v)) ? null : Number(v));

// Analytics' "marketplace" figures come from the tickets table, so they're
// labelled Tickets here. Marketplace (item sales) isn't in that endpoint.
const POST_KINDS = [
  { key: "rideshare", label: "Rides", href: "/console/moderation/rideshare" },
  { key: "housing", label: "Housing", href: "/console/moderation/rooms" },
  { key: "marketplace", label: "Tickets", href: "/console/moderation/ticket" },
  { key: "lostFound", label: "Lost & Found", href: "/console/moderation/lost-found" },
];

/** Builds the console's model from the existing admin endpoints. Only real figures are kept. */
function buildModel({ analytics, activity, announcements, resources, reports }) {
  const missing = [];
  const model = { users: null, posts: null, content: null, inbox: [], activity: [], missing };

  if (analytics) {
    const o = analytics.overview || {};
    const c = analytics.contentStats || {};
    model.users = { total: num(o.totalUsers), weekPct: num(o.userGrowth) };
    model.posts = {
      total: num(o.totalPosts),
      weekPct: num(o.postsGrowth),
      kinds: POST_KINDS.map((k) => ({ ...k, count: num(c.postsByCategory?.[k.key]) ?? 0, livePct: num(c.engagementRates?.[k.key]) })),
    };
  } else missing.push("totals");

  if (announcements) {
    const pending = announcements.filter((a) => !a.active && a.user_id);
    model.inbox.push(...pending.map((a) => ({ kind: "announcement", id: a.id, title: a.title || "Untitled", detail: (a.body || "").slice(0, 160), by: a.users?.name || a.users?.email || "A student", at: a.created_at })));
  } else missing.push("announcements");

  if (resources) {
    const pending = resources.filter((r) => !r.active && r.user_id);
    model.inbox.push(...pending.map((r) => ({ kind: "resource", id: r.id, title: r.title || "Untitled", detail: [r.category, r.description].filter(Boolean).join(" · ").slice(0, 160), by: "A student", at: r.created_at })));
  } else missing.push("resources");

  if (reports) {
    model.inbox.push(...reports.map((r) => ({ kind: "report", id: r.id, title: r.reason || r.type || "Report", detail: (r.content || r.category || "").slice(0, 160), by: r.reportedBy || "A student", at: r.createdAt, priority: r.priority || null })));
  } else missing.push("reports");

  model.inbox.sort((a, b) => new Date(b.at) - new Date(a.at));

  if (announcements && resources) {
    model.content = {
      annTotal: announcements.length,
      annLive: announcements.filter((a) => a.active).length,
      resTotal: resources.length,
      resLive: resources.filter((r) => r.active).length,
    };
  }

  if (activity) {
    model.activity = activity.map((a) => {
      const d = a.details || {};
      const who = d.userName || d.driver || (typeof a.user === "string" ? a.user.split("@")[0] : null);
      const what = d.route || d.title || d.itemName || d.reportType || null;
      return { type: a.type, action: a.action, who, what, time: a.time };
    });
  } else missing.push("activity");

  return model;
}

const ConsoleContext = createContext(null);

/**
 * Loads the console's data once for the whole admin area (the sidebar's counts
 * and the overview share it), refreshes every minute while the tab is visible,
 * and acts on inbox items optimistically.
 */
export function ConsoleProvider({ children }) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const alive = useRef(true);

  const load = useCallback(async (quiet = false) => {
    if (!quiet) setStatus((s) => (s === "ready" ? "refreshing" : "loading"));
    const get = (path) => apiCall(path, { retries: 0 });
    const [an, ac, ann, res, rep] = await Promise.allSettled([
      get("/admin/analytics"),
      get("/admin/activity?limit=40"),
      get("/admin/announcements"),
      get("/admin/resources"),
      get("/admin/reports?status=pending&limit=50"),
    ]);
    if (!alive.current) return;
    const ok = (r, pick) => (r.status === "fulfilled" && r.value?.success !== false ? pick(r.value) : null);
    const parts = {
      analytics: ok(an, (v) => v),
      activity: ok(ac, (v) => v.activities || []),
      announcements: ok(ann, (v) => v.data || []),
      resources: ok(res, (v) => v.data || []),
      reports: ok(rep, (v) => (v.reports || []).filter((r) => !r.status || r.status === "pending")),
    };
    if (Object.values(parts).every((p) => p == null)) {
      setError("The admin endpoints didn't respond. Check that the backend is running.");
      setStatus((s) => (s === "refreshing" || s === "ready" ? "ready" : "error"));
      return;
    }
    setData(buildModel(parts));
    setError(null);
    setStatus("ready");
    setUpdatedAt(Date.now());
  }, []);

  useEffect(() => {
    alive.current = true;
    load();
    const id = setInterval(() => document.visibilityState === "visible" && load(true), 60000);
    return () => {
      alive.current = false;
      clearInterval(id);
    };
  }, [load]);

  /** Act on an inbox item with the existing admin endpoints. The row leaves at once and comes back if the server says no. */
  const act = useCallback(async (item, decision) => {
    setData((d) => (d ? { ...d, inbox: d.inbox.filter((x) => !(x.kind === item.kind && x.id === item.id)) } : d));
    const id = encodeURIComponent(item.id);
    const call = {
      "announcement:publish": () => apiCall(`/admin/announcements/${id}`, { method: "PUT", body: JSON.stringify({ active: true }), retries: 0 }),
      "announcement:decline": () => apiCall(`/admin/announcements/${id}`, { method: "DELETE", retries: 0 }),
      "resource:publish": () => apiCall(`/admin/resources/${id}/toggle`, { method: "PATCH", retries: 0 }),
      "resource:decline": () => apiCall(`/admin/resources/${id}`, { method: "DELETE", retries: 0 }),
      "report:resolve": () => apiCall(`/admin/reports/${id}`, { method: "PUT", body: JSON.stringify({ status: "resolved", action: "resolved", notes: "" }), retries: 0 }),
      "report:dismiss": () => apiCall(`/admin/reports/${id}`, { method: "PUT", body: JSON.stringify({ status: "dismissed", action: "dismissed", notes: "" }), retries: 0 }),
    }[`${item.kind}:${decision}`];
    try {
      if (!call) throw new Error("Unknown action");
      await call();
      return { ok: true };
    } catch (e) {
      setData((d) => (d ? { ...d, inbox: [...d.inbox, item].sort((a, b) => new Date(b.at) - new Date(a.at)) } : d));
      return { ok: false, message: e.message || "That didn't go through" };
    }
  }, []);

  const value = useMemo(() => ({ data, status, error, updatedAt, reload: () => load(), act }), [data, status, error, updatedAt, load, act]);
  return createElement(ConsoleContext.Provider, { value }, children);
}

export function useConsole() {
  const ctx = useContext(ConsoleContext);
  if (!ctx) throw new Error("useConsole must be used inside ConsoleProvider");
  return ctx;
}
