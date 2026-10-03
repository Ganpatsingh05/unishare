"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, ArrowSquareOut, Trash, ArrowCounterClockwise } from "@phosphor-icons/react";
import { BRAND } from "@features/profile/lib/profileTokens";
import { useUI } from "@contexts/UniShareContext";
import { getTimeSince } from "@lib/api/utils";

// ─── Constants ──────────────────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = "unishare_saved_items";
const SPRING = { type: "spring", stiffness: 260, damping: 26 };
/** How long the undo snackbar is visible before the removal is committed */
const UNDO_WINDOW_MS = 4000;

// ─── Local Storage adapter ────────────────────────────────────────────────────
// ADAPTER: replace with real API when backend ships GET /api/saved

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

// ─── State reducer ────────────────────────────────────────────────────────────

const initialState = {
  items: [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, items: action.items, loading: false };
    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };
    case "RESTORE":
      // Re-insert the item at its original index
      return (() => {
        const next = [...state.items];
        const idx = Math.min(action.index, next.length);
        next.splice(idx, 0, action.item);
        return { ...state, items: next };
      })();
    default:
      return state;
  }
}

// ─── Category chip ────────────────────────────────────────────────────────────

/** Maps a category key to a display label + colour */
const CATEGORY_COLOURS = {
  room:        { label: "Room",        bg: BRAND.actionBlue + "1A", text: BRAND.actionBlue },
  marketplace: { label: "Marketplace", bg: BRAND.yellow + "30",     text: "#92600A" },
  "lost-found":{ label: "Lost & Found",bg: "#16A34A1A",             text: "#16A34A" },
  ride:        { label: "Ride",        bg: BRAND.pinkMagenta + "1A",text: BRAND.pinkMagenta },
  ticket:      { label: "Ticket",      bg: "#9333EA1A",             text: "#9333EA" },
};

function CategoryChip({ category }) {
  const cfg = CATEGORY_COLOURS[category] ?? {
    label: category ?? "Other",
    bg: "rgba(107,114,128,0.12)",
    text: "#6B7280",
  };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

/** Shows the item image or a coloured placeholder square */
function Thumbnail({ src, alt, category }) {
  const [errored, setErrored] = useState(false);
  const cfg = CATEGORY_COLOURS[category];
  const placeholderBg = cfg ? cfg.bg : "rgba(107,114,128,0.12)";
  const placeholderColor = cfg ? cfg.text : "#6B7280";

  if (!src || errored) {
    return (
      <div
        className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0 text-2xl font-black select-none"
        style={{ background: placeholderBg, color: placeholderColor }}
        aria-hidden
      >
        {(alt?.[0] ?? "?").toUpperCase()}
      </div>
    );
  }

  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
      <Image
        src={src}
        alt={alt ?? "Saved item"}
        fill
        sizes="64px"
        className="object-cover"
        onError={() => setErrored(true)}
      />
    </div>
  );
}

// ─── Undo snackbar ────────────────────────────────────────────────────────────

function UndoSnackbar({ message, onUndo, onDismiss }) {
  const { darkMode } = useUI();

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={SPRING}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium"
      style={{
        background: darkMode ? "rgba(30,30,40,0.96)" : "rgba(18,35,58,0.95)",
        color: "#fff",
        backdropFilter: "blur(12px)",
        minWidth: 260,
      }}
      role="status"
      aria-live="polite"
    >
      <span className="flex-1">{message}</span>
      <button
        onClick={onUndo}
        className="flex items-center gap-1 px-3 py-1 rounded-lg font-bold text-xs shrink-0 transition-colors"
        style={{
          background: BRAND.yellow,
          color: BRAND.inkNavy,
        }}
        aria-label="Undo removal"
      >
        <ArrowCounterClockwise size={13} weight="bold" />
        Undo
      </button>
    </motion.div>
  );
}

// ─── Saved item card ──────────────────────────────────────────────────────────

function SavedCard({ item, onRemove }) {
  const { darkMode } = useUI();

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -8 }}
      transition={SPRING}
      className="flex flex-col gap-3 p-4 rounded-2xl border border-border-default"
      style={{
        background: darkMode
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.8)",
      }}
      aria-label={`Saved item: ${item.title}`}
    >
      {/* Top row: thumbnail + meta */}
      <div className="flex gap-3">
        <Thumbnail
          src={item.image ?? item.thumbnail ?? item.image_url ?? null}
          alt={item.title}
          category={item.category}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-1">
            <CategoryChip category={item.category} />
          </div>
          <p
            className="text-sm font-bold text-text-primary line-clamp-2 leading-snug"
            title={item.title}
          >
            {item.title}
          </p>
          {item.saved_at && (
            <p className="text-[11px] text-text-muted mt-1">
              Saved {getTimeSince(item.saved_at)}
            </p>
          )}
        </div>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-2 pt-1 border-t border-border-subtle">
        <Link
          href={item.url ?? "/"}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-colors"
          style={{
            background: BRAND.actionBlue + "18",
            color: BRAND.actionBlue,
          }}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${item.title}`}
        >
          <ArrowSquareOut size={13} weight="bold" />
          Open
        </Link>
        <button
          onClick={onRemove}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
          style={{
            background: "rgba(220,38,38,0.1)",
            color: "#DC2626",
          }}
          aria-label={`Remove ${item.title} from saved`}
        >
          <Trash size={13} weight="bold" />
          Remove
        </button>
      </div>
    </motion.article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * SavedSection
 *
 * Displays the user's saved items in a responsive 2-column grid.
 * Falls back to `localStorage` under the key `unishare_saved_items` while
 * the backend endpoint is not yet available.
 *
 * Removals are optimistic and reversible via an Undo snackbar that appears
 * for 4 seconds before the change is committed to storage.
 *
 * @param {{ savedItems?: Array }} props
 */
export default function SavedSection({ savedItems }) {
  const { darkMode } = useUI();
  const [state, dispatch] = useReducer(reducer, initialState);

  // Pending-removal queue: { id, item, index, timerId }
  const pendingRemovals = useRef(new Map());
  // Snackbar state — we only show one at a time; the latest removal wins
  const [snackbar, setSnackbar] = useState(null);

  // ── Bootstrap items ────────────────────────────────────────────────────────

  useEffect(() => {
    // ADAPTER: replace with real API when backend ships GET /api/saved
    let initial = [];

    if (Array.isArray(savedItems) && savedItems.length > 0) {
      initial = savedItems;
    } else {
      initial = loadFromLocalStorage();
    }

    dispatch({ type: "INIT", items: initial });
  }, [savedItems]);

  // ── Sync to localStorage whenever items change (adapter) ───────────────────
  useEffect(() => {
    if (!state.loading) {
      // ADAPTER: replace with real API when backend ships PATCH /api/saved
      saveToLocalStorage(state.items);
    }
  }, [state.items, state.loading]);

  // ── Remove (optimistic + undo) ─────────────────────────────────────────────

  const handleRemove = useCallback(
    (item) => {
      const index = state.items.findIndex((i) => i.id === item.id);
      if (index === -1) return;

      // Cancel any existing pending removal (clear its timer)
      const existing = pendingRemovals.current.get(item.id);
      if (existing) clearTimeout(existing.timerId);

      // Optimistically remove from UI
      dispatch({ type: "REMOVE", id: item.id });

      // Set a timer to commit after UNDO_WINDOW_MS
      const timerId = setTimeout(() => {
        pendingRemovals.current.delete(item.id);
        // Already removed from state — storage was synced via useEffect
        if (snackbar?.id === item.id) setSnackbar(null);
      }, UNDO_WINDOW_MS);

      pendingRemovals.current.set(item.id, { item, index, timerId });

      setSnackbar({ id: item.id, title: item.title });
    },
    [state.items, snackbar]
  );

  const handleUndo = useCallback(() => {
    if (!snackbar) return;
    const entry = pendingRemovals.current.get(snackbar.id);
    if (!entry) return;

    clearTimeout(entry.timerId);
    pendingRemovals.current.delete(snackbar.id);

    // Restore item at its original position
    dispatch({ type: "RESTORE", item: entry.item, index: entry.index });
    setSnackbar(null);
  }, [snackbar]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (state.loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse bg-surface-interactive rounded-2xl"
          />
        ))}
      </div>
    );
  }

  return (
    <section aria-label="Saved items" className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: BRAND.yellow + "30" }}
        >
          <Bookmark size={20} weight="duotone" style={{ color: BRAND.yellow }} />
        </div>
        <div>
          <h2 className="text-base font-black text-text-primary leading-tight">
            Saved
          </h2>
          <p className="text-xs text-text-muted">
            {state.items.length > 0
              ? `${state.items.length} saved item${state.items.length !== 1 ? "s" : ""}`
              : "Nothing saved yet"}
          </p>
        </div>
      </div>

      {/* ── Grid or Empty state ── */}
      {state.items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={SPRING}
          className="flex flex-col items-center justify-center gap-5 py-20 px-8 rounded-2xl border border-dashed border-border-default text-center"
        >
          <Bookmark
            size={64}
            weight="duotone"
            style={{ color: BRAND.yellow }}
            aria-hidden
          />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-muted max-w-xs leading-relaxed">
              Nothing saved yet — bookmark posts, items and rides you want to revisit.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 mt-1 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors self-center"
              style={{
                background: BRAND.yellow,
                color: BRAND.inkNavy,
              }}
            >
              Explore the platform
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <AnimatePresence initial={false}>
            {state.items.map((item, index) => (
              <SavedCard
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Undo snackbar ── */}
      <AnimatePresence>
        {snackbar && (
          <UndoSnackbar
            key={snackbar.id}
            message={`"${snackbar.title.slice(0, 30)}${snackbar.title.length > 30 ? "…" : ""}" removed`}
            onUndo={handleUndo}
            onDismiss={() => setSnackbar(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
