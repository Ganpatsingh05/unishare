"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Handshake,
  PaperPlaneTilt,
  CheckCircle,
  XCircle,
  ArrowsLeftRight,
} from "@phosphor-icons/react";
import {
  roomsAPI,
  marketplaceAPI,
  lostFoundAPI,
  ridesAPI,
} from "@lib/api/requests.js";
import { REQUEST_STATUS, BRAND } from "@features/profile/lib/profileTokens";
import { useUI } from "@contexts/UniShareContext";
import { getTimeSince } from "@lib/api/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

/** Module display metadata — label + accent colour */
const MODULE_META = {
  rooms:      { label: "Rooms",       color: BRAND.actionBlue },
  itemsell:   { label: "Marketplace", color: BRAND.yellow },
  lostfound:  { label: "Lost & Found", color: "#16A34A" },
  shareride:  { label: "Rides",       color: BRAND.pinkMagenta },
};

/** All API instances paired with their module key */
const MODULE_APIS = [
  { key: "rooms",     api: roomsAPI     },
  { key: "itemsell",  api: marketplaceAPI },
  { key: "lostfound", api: lostFoundAPI },
  { key: "shareride", api: ridesAPI     },
];

const SPRING = { type: "spring", stiffness: 260, damping: 26 };

// ─── State reducer ───────────────────────────────────────────────────────────

const initialState = {
  sentRequests:     [],
  receivedRequests: [],
  loading:          true,
  error:            null,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOADED":
      return {
        ...state,
        loading:          false,
        sentRequests:     action.sent,
        receivedRequests: action.received,
      };
    case "ERROR":
      return { ...state, loading: false, error: action.message };
    case "REMOVE_RECEIVED":
      return {
        ...state,
        receivedRequests: state.receivedRequests.filter((r) => r.id !== action.id),
      };
    case "UPDATE_RECEIVED_STATUS":
      return {
        ...state,
        receivedRequests: state.receivedRequests.map((r) =>
          r.id === action.id ? { ...r, status: action.status } : r
        ),
      };
    default:
      return state;
  }
}

// ─── Helper: normalise a raw API request item ────────────────────────────────

/**
 * Different modules return slightly different shapes.
 * We normalise here so the UI only deals with one shape.
 */
function normalise(raw, moduleKey, direction) {
  return {
    id:            raw.id ?? raw._id,
    status:        raw.status ?? "pending",
    title:         raw.item_title ?? raw.room_title ?? raw.title ?? raw.listing_title ?? "Untitled",
    module:        moduleKey,
    created_at:    raw.created_at ?? raw.createdAt,
    // For received: the person who sent the request
    requesterName: raw.requester_name ?? raw.requester?.name ?? raw.sender_name ?? "Someone",
    // For sent: the owner of the item
    ownerName:     raw.owner_name ?? raw.owner?.name ?? raw.poster_name ?? "Owner",
    direction,
    _api:          MODULE_APIS.find((m) => m.key === moduleKey)?.api,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Animated status chip */
function StatusChip({ status }) {
  const cfg = REQUEST_STATUS[status] ?? REQUEST_STATUS.pending;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bgToken} ${cfg.textToken}`}
    >
      {cfg.label}
    </span>
  );
}

/** Module badge */
function ModuleBadge({ moduleKey }) {
  const meta = MODULE_META[moduleKey] ?? { label: moduleKey, color: "#6B7280" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={{
        background: meta.color + "1A",
        color: meta.color,
      }}
    >
      {meta.label}
    </span>
  );
}

/** Single skeleton row */
function SkeletonRow() {
  return (
    <div className="h-14 animate-pulse bg-surface-interactive rounded-xl" />
  );
}

/** Brief toast — fades in and auto-dismisses */
function Toast({ message, variant = "success" }) {
  const { darkMode } = useUI();
  const bg =
    variant === "error"
      ? darkMode
        ? "rgba(220,38,38,0.9)"
        : "rgba(220,38,38,0.92)"
      : darkMode
      ? "rgba(22,163,74,0.9)"
      : "rgba(22,163,74,0.92)";

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={SPRING}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl shadow-lg text-white text-sm font-semibold pointer-events-none"
      style={{ background: bg }}
    >
      {message}
    </motion.div>
  );
}

/** A single received-request row */
function ReceivedRow({ item, onAccept, onReject, busy }) {
  const { darkMode } = useUI();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={SPRING}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl border border-border-default"
      style={{
        background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
      }}
    >
      {/* Left — info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
          <ModuleBadge moduleKey={item.module} />
          <StatusChip status={item.status} />
        </div>
        <p
          className="text-sm font-semibold text-text-primary truncate"
          title={item.title}
        >
          {item.title}
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">
          From{" "}
          <span className="font-medium text-text-secondary">
            {item.requesterName}
          </span>{" "}
          · {item.created_at ? getTimeSince(item.created_at) : "—"}
        </p>
      </div>

      {/* Right — actions (only show for pending) */}
      {item.status === "pending" && (
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onAccept(item)}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-700 active:scale-95 text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
            aria-label={`Accept request from ${item.requesterName}`}
          >
            <CheckCircle size={14} weight="bold" />
            Accept
          </button>
          <button
            onClick={() => onReject(item)}
            disabled={busy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 active:scale-95 text-white transition-all disabled:opacity-50 disabled:pointer-events-none"
            aria-label={`Reject request from ${item.requesterName}`}
          >
            <XCircle size={14} weight="bold" />
            Reject
          </button>
        </div>
      )}
    </motion.div>
  );
}

/** A single sent-request row */
function SentRow({ item }) {
  const { darkMode } = useUI();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12, height: 0, marginBottom: 0 }}
      transition={SPRING}
      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl border border-border-default"
      style={{
        background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.015)",
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
          <ModuleBadge moduleKey={item.module} />
          <StatusChip status={item.status} />
        </div>
        <p
          className="text-sm font-semibold text-text-primary truncate"
          title={item.title}
        >
          {item.title}
        </p>
        <p className="text-[11px] text-text-muted mt-0.5">
          To{" "}
          <span className="font-medium text-text-secondary">
            {item.ownerName}
          </span>{" "}
          · {item.created_at ? getTimeSince(item.created_at) : "—"}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * RequestsSection
 *
 * Fetches sent + received requests across Rooms, Marketplace, Lost & Found,
 * and Rides. Shows them in two pill-tab-switched lists with accept/reject
 * actions for pending received requests.
 *
 * @param {{ userId: string }} props
 */
export default function RequestsSection({ userId }) {
  const { darkMode } = useUI();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [activeTab, setActiveTab] = useState("received"); // "received" | "sent"
  const [toast, setToast] = useState(null);
  const [busyIds, setBusyIds] = useState(new Set());
  const toastTimer = useRef(null);

  // ── Fetch ────────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      // Build all 8 fetch calls (4 modules × 2 directions)
      const calls = MODULE_APIS.flatMap(({ key, api }) => [
        api.getSentRequests().then((r) => ({ key, direction: "sent",     data: r })),
        api.getReceivedRequests().then((r) => ({ key, direction: "received", data: r })),
      ]);

      const results = await Promise.allSettled(calls);

      if (cancelled) return;

      const sent     = [];
      const received = [];

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const { key, direction, data } = result.value;
        // API returns { data: [...] } or { requests: [...] } or plain []
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.requests)
          ? data.requests
          : [];

        items.forEach((raw) => {
          const normalised = normalise(raw, key, direction);
          if (direction === "sent") sent.push(normalised);
          else received.push(normalised);
        });
      });

      // Sort newest first
      const byDate = (a, b) =>
        new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0);

      dispatch({
        type: "LOADED",
        sent:     sent.sort(byDate),
        received: received.sort(byDate),
      });
    }

    fetchAll().catch((err) => {
      if (!cancelled)
        dispatch({ type: "ERROR", message: err?.message ?? "Failed to load requests." });
    });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // ── Toast helper ─────────────────────────────────────────────────────────

  const showToast = useCallback((message, variant = "success") => {
    setToast({ message, variant, key: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2800);
  }, []);

  // ── Accept / Reject ───────────────────────────────────────────────────────

  const handleRespond = useCallback(
    async (item, action) => {
      if (busyIds.has(item.id)) return;
      setBusyIds((prev) => new Set(prev).add(item.id));

      // Optimistic: remove from list immediately
      dispatch({ type: "REMOVE_RECEIVED", id: item.id });

      try {
        await item._api.respondToRequest(item.id, action);
        showToast(
          action === "accept"
            ? "Request accepted ✓"
            : "Request rejected.",
          action === "accept" ? "success" : "error"
        );
      } catch {
        // Roll back — put the item back with original status (re-fetch is simpler but we keep it local)
        dispatch({
          type: "UPDATE_RECEIVED_STATUS",
          id: item.id,
          status: item.status,
        });
        showToast("Something went wrong. Please try again.", "error");
      } finally {
        setBusyIds((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    },
    [busyIds, showToast]
  );

  // ── Render ────────────────────────────────────────────────────────────────

  const { sentRequests, receivedRequests, loading, error } = state;
  const activeList = activeTab === "received" ? receivedRequests : sentRequests;

  const pendingCount = receivedRequests.filter((r) => r.status === "pending").length;

  return (
    <section aria-label="Requests" className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: BRAND.actionBlue + "18" }}
        >
          <ArrowsLeftRight
            size={20}
            weight="duotone"
            style={{ color: BRAND.actionBlue }}
          />
        </div>
        <div>
          <h2 className="text-base font-black text-text-primary leading-tight">
            Requests
          </h2>
          <p className="text-xs text-text-muted">
            Manage requests across all your listings
          </p>
        </div>
      </div>

      {/* ── Pill tab switcher ── */}
      <div
        className="flex gap-1.5 p-1 rounded-2xl w-fit"
        style={{
          background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        }}
        role="tablist"
        aria-label="Request direction"
      >
        {[
          { id: "received", label: "Received", count: pendingCount },
          { id: "sent",     label: "Sent",     count: 0 },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold transition-colors select-none"
              style={{
                color: isActive
                  ? darkMode
                    ? BRAND.inkNavy
                    : BRAND.inkNavy
                  : "var(--text-secondary)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="req-tab-pill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: BRAND.yellow }}
                  transition={SPRING}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className="relative z-10 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-black text-white"
                  style={{ background: BRAND.pinkMagenta }}
                >
                  {tab.count > 9 ? "9+" : tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="flex flex-col gap-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : error ? (
        <div className="px-4 py-8 rounded-2xl border border-border-default text-center">
          <p className="text-sm text-red-500 font-medium">{error}</p>
        </div>
      ) : (
        <AnimatePresence mode="popLayout" initial={false}>
          {activeList.length === 0 ? (
            /* ── Empty state ── */
            <motion.div
              key={`empty-${activeTab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={SPRING}
              className="flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-2xl border border-dashed border-border-default text-center"
            >
              {activeTab === "received" ? (
                <Handshake
                  size={48}
                  weight="duotone"
                  style={{ color: BRAND.yellow }}
                />
              ) : (
                <PaperPlaneTilt
                  size={48}
                  weight="duotone"
                  style={{ color: BRAND.skyBlue }}
                />
              )}
              <p className="text-sm text-text-muted max-w-xs">
                {activeTab === "received"
                  ? "No received requests yet — when someone wants your stuff, they'll show up here."
                  : "No sent requests yet."}
              </p>
            </motion.div>
          ) : (
            /* ── Request list ── */
            <motion.div
              key={`list-${activeTab}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-3"
            >
              <AnimatePresence initial={false}>
                {activeList.map((item) =>
                  activeTab === "received" ? (
                    <ReceivedRow
                      key={item.id}
                      item={item}
                      busy={busyIds.has(item.id)}
                      onAccept={(i) => handleRespond(i, "accept")}
                      onReject={(i) => handleRespond(i, "reject")}
                    />
                  ) : (
                    <SentRow key={item.id} item={item} />
                  )
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <Toast key={toast.key} message={toast.message} variant={toast.variant} />
        )}
      </AnimatePresence>
    </section>
  );
}
