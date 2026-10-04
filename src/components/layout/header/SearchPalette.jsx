"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X } from "lucide-react";
import { useUI } from "@contexts/UniShareContext";
import { FEATURES, QUICK_ACTIONS, SEARCH_INDEX, searchIndex } from "./navConfig";
import { RING, headerVars, useScrollLock } from "./headerKit";

/** What the palette shows before anything is typed. */
const START = [
  ...SEARCH_INDEX.filter((i) => i.group === "Features"),
  ...QUICK_ACTIONS.map((a) => SEARCH_INDEX.find((i) => i.href === a.href)).filter(Boolean),
];

/**
 * Search across every UniShare feature, action and help page. Opens from the
 * header button, Ctrl/Cmd+K or "/". Arrow keys move, Enter opens, Esc closes.
 */
export default function SearchPalette({ open, onClose }) {
  const router = useRouter();
  const { darkMode } = useUI();
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const returnFocus = useRef(null);
  const listId = useId();
  useScrollLock(open);

  const results = useMemo(() => (query.trim() ? searchIndex(query) : START), [query]);

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;
    setQuery("");
    setActive(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      cancelAnimationFrame(id);
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item) => {
    if (!item) return;
    onClose();
    router.push(item.href);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Tab") {
      // Keep focus in the dialog: the input is its only tab stop.
      e.preventDefault();
    }
  };

  if (typeof document === "undefined") return null;

  // Rows grouped under headings, keeping the result order.
  let lastGroup = null;
  const rows = results.map((item, index) => {
    const heading = !query.trim() ? (index < FEATURES.length ? "Jump to" : "Post something") : item.group;
    const showHeading = heading !== lastGroup;
    lastGroup = heading;
    return { item, index, heading: showHeading ? heading : null };
  });

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[95] flex items-start justify-center px-3 pt-3 md:pt-[12vh]"
          style={headerVars(darkMode)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.16 }}
        >
          <div className="absolute inset-0 bg-[rgba(8,12,20,0.48)] backdrop-blur-[3px]" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search UniShare"
            className="relative flex max-h-[min(560px,calc(100dvh-24px))] w-full max-w-[620px] flex-col overflow-hidden rounded-[22px] border border-[var(--hd-border)] bg-[var(--hd-panel)] text-[var(--hd-text)] shadow-[var(--hd-shadow)]"
            initial={reduce ? false : { y: -12, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={reduce ? undefined : { y: -8, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center gap-3 border-b border-[var(--hd-border)] px-4">
              <Search size={20} className="shrink-0 text-[var(--hd-muted)]" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search rides, rooms, help…"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                className="h-14 min-w-0 flex-1 bg-transparent text-[16px] font-medium text-[var(--hd-text)] outline-none placeholder:text-[var(--hd-muted)]"
              />
              <button type="button" onClick={onClose} aria-label="Close search" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--hd-muted)] hover:bg-[var(--hd-hover)] ${RING}`}>
                <X size={18} aria-hidden />
              </button>
            </div>

            <ul ref={listRef} id={listId} role="listbox" aria-label="Results" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {rows.length === 0 ? (
                <li role="presentation" className="px-4 py-10 text-center text-[14.5px] text-[var(--hd-muted)]">
                  Nothing matches “{query.trim()}”. Try a feature name like “rides” or “rooms”.
                </li>
              ) : (
                rows.map(({ item, index, heading }) => {
                  const Icon = item.icon;
                  const ink = item.ink ? item.ink[darkMode ? 1 : 0] : "var(--hd-muted)";
                  const selected = index === active;
                  return (
                    <li key={`${item.group}-${item.href}`} role="presentation">
                      {heading ? <div role="presentation" className="px-3 pb-1.5 pt-3 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--hd-muted)]">{heading}</div> : null}
                      <div
                        id={`${listId}-${index}`}
                        role="option"
                        aria-selected={selected}
                        data-index={index}
                        onPointerMove={() => setActive(index)}
                        onClick={() => go(item)}
                        className={`flex cursor-pointer items-center gap-3 rounded-[14px] px-3 py-2.5 ${selected ? "bg-[var(--hd-hover)]" : ""}`}
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[11px]" style={{ color: ink, backgroundColor: item.ink ? `${ink}${darkMode ? "26" : "1A"}` : "var(--hd-hover)" }}>
                          <Icon size={18} aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[15px] font-semibold">{item.label}</span>
                          {item.hint ? <span className="block truncate text-[13px] text-[var(--hd-muted)]">{item.hint}</span> : null}
                        </span>
                        {selected ? <CornerDownLeft size={16} className="shrink-0 text-[var(--hd-muted)]" aria-hidden /> : null}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="hidden items-center gap-4 border-t border-[var(--hd-border)] px-4 py-2.5 text-[12.5px] text-[var(--hd-muted)] md:flex">
              <span className="inline-flex items-center gap-1.5"><Kbd><ArrowUp size={12} aria-hidden /></Kbd><Kbd><ArrowDown size={12} aria-hidden /></Kbd> to move</span>
              <span className="inline-flex items-center gap-1.5"><Kbd><CornerDownLeft size={12} aria-hidden /></Kbd> to open</span>
              <span className="inline-flex items-center gap-1.5"><Kbd>Esc</Kbd> to close</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

export function Kbd({ children }) {
  return <kbd className="inline-grid h-[22px] min-w-[22px] place-items-center rounded-[6px] border border-[var(--hd-border)] px-1.5 font-sans text-[11.5px] font-semibold text-[var(--hd-muted)]">{children}</kbd>;
}
