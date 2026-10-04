"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { INBOX_KINDS, ago, useConsole } from "../consoleData";
import { Segmented, Tag } from "../ui";

const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]";
const FILTERS = [["all", "All"], ["announcement", "Announcements"], ["resource", "Resources"], ["report", "Reports"]];
// Decisions that delete something ask once more, inline.
const DESTRUCTIVE = new Set(["decline"]);

function ActionButton({ children, onClick, tone = "plain", disabled }) {
  const tones = {
    plain: "border-[var(--c-line-2)] text-[var(--c-text)] hover:bg-[var(--c-panel-2)]",
    go: "border-transparent bg-[var(--c-accent)] text-[var(--c-on-accent)] hover:brightness-110",
    danger: "border-transparent bg-[var(--c-bad)] text-white hover:opacity-90",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`h-8 rounded-[7px] border px-3 text-[13px] font-semibold transition disabled:opacity-50 ${tones[tone]} ${RING}`}>
      {children}
    </button>
  );
}

/**
 * "Waiting on you": user submissions and open reports, newest first. Act
 * inline, or drive it from the keyboard: j / k move, p or r to publish or
 * resolve, d to decline or dismiss.
 */
export default function Inbox({ items }) {
  const { act } = useConsole();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState("all");
  const [sel, setSel] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [note, setNote] = useState(null);
  const listRef = useRef(null);

  const shown = useMemo(() => (filter === "all" ? items : items.filter((i) => i.kind === filter)), [items, filter]);
  const counts = useMemo(() => Object.fromEntries(FILTERS.map(([k]) => [k, k === "all" ? items.length : items.filter((i) => i.kind === k).length])), [items]);
  useEffect(() => setSel((s) => Math.min(s, Math.max(0, shown.length - 1))), [shown.length]);

  const decide = async (item, decision) => {
    setConfirm(null);
    const label = INBOX_KINDS[item.kind].actions.find(([d]) => d === decision)?.[1] || decision;
    const res = await act(item, decision);
    setNote(res.ok ? { ok: true, text: `${label}: “${item.title}”` } : { ok: false, text: res.message });
  };

  const request = (item, decision) => (DESTRUCTIVE.has(decision) ? setConfirm(`${item.kind}:${item.id}`) : decide(item, decision));

  // Keyboard, while focus is inside the inbox.
  const onKeyDown = (e) => {
    if (e.target.tagName === "INPUT" || e.metaKey || e.ctrlKey || e.altKey) return;
    const item = shown[sel];
    if (e.key === "j" || e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => Math.min(shown.length - 1, s + 1));
    } else if (e.key === "k" || e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => Math.max(0, s - 1));
    } else if (item && (e.key === "p" || e.key === "r")) {
      e.preventDefault();
      request(item, INBOX_KINDS[item.kind].actions[0][0]);
    } else if (item && e.key === "d") {
      e.preventDefault();
      request(item, INBOX_KINDS[item.kind].actions[1][0]);
    } else if (e.key === "Escape") setConfirm(null);
  };

  // Keep the selected row visible inside the list (never scrolls the page).
  useEffect(() => {
    const list = listRef.current;
    const row = list?.querySelector(`[data-row="${sel}"]`);
    if (!list || !row || list.scrollHeight <= list.clientHeight) return;
    const top = row.offsetTop - list.offsetTop;
    if (top < list.scrollTop) list.scrollTop = top;
    else if (top + row.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top + row.offsetHeight - list.clientHeight;
  }, [sel]);

  return (
    <section aria-labelledby="c-inbox" className="flex min-h-0 flex-col rounded-[12px] border border-[var(--c-line)] bg-[var(--c-panel)]" onKeyDown={onKeyDown}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--c-line)] px-5 pb-3 pt-4">
        <div>
          <h2 id="c-inbox" className="text-[17px] font-bold text-[var(--c-text)]">Waiting on you</h2>
          <p className="mt-0.5 text-[13px] text-[var(--c-faint)]">Student submissions and open reports, newest first.</p>
        </div>
        <Segmented label="Filter the inbox" value={filter} onChange={(v) => (setFilter(v), setSel(0))} options={FILTERS.map(([k, label]) => ({ value: k, label, count: counts[k] }))} />
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
          <div className="text-[16px] font-semibold text-[var(--c-text)]">You're all caught up</div>
          <p className="mt-2 max-w-[22rem] text-[14px] text-[var(--c-muted)]">{filter === "all" ? "Nothing needs a decision right now. New submissions and reports land here." : "Nothing of this kind is waiting."}</p>
        </div>
      ) : (
        <ul ref={listRef} tabIndex={0} aria-label="Waiting items. Use j and k to move, p to publish or resolve, d to decline or dismiss." className="min-h-0 flex-1 overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--c-ring)]">
          <AnimatePresence initial={false}>
            {shown.map((item, n) => {
              const meta = INBOX_KINDS[item.kind];
              const key = `${item.kind}:${item.id}`;
              const on = n === sel;
              const asking = confirm === key;
              return (
                <motion.li
                  key={key}
                  data-row={n}
                  layout={!reduce}
                  initial={false}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0, transition: { duration: 0.22 } }}
                  className="relative border-b border-[var(--c-line)] last:border-b-0"
                  onClick={() => setSel(n)}
                >
                  {on ? <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[var(--c-mark)]" /> : null}
                  <div className={`flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center ${on ? "bg-[var(--c-panel-2)]" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Tag tone={meta.tone}>{meta.label}</Tag>
                        {item.priority === "high" ? <Tag tone="bad">High priority</Tag> : null}
                        <span className="truncate text-[14.5px] font-semibold">{item.title}</span>
                      </div>
                      {item.detail ? <p className="mt-1 line-clamp-1 text-[13.5px] text-[var(--c-muted)]">{item.detail}</p> : null}
                      <div className="mt-1 text-[13px] text-[var(--c-muted)]">
                        {item.by} · {ago(item.at)} ago
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {asking ? (
                        <>
                          <span className="mr-1 text-[13px] text-[var(--c-muted)]">Delete it?</span>
                          <ActionButton tone="danger" onClick={() => decide(item, "decline")}>Delete</ActionButton>
                          <ActionButton onClick={() => setConfirm(null)}>Keep</ActionButton>
                        </>
                      ) : (
                        <>
                          <ActionButton tone="go" onClick={() => request(item, meta.actions[0][0])}>{meta.actions[0][1]}</ActionButton>
                          <ActionButton onClick={() => request(item, meta.actions[1][0])}>{meta.actions[1][1]}</ActionButton>
                          <Link href={meta.href} className={`ml-1 hidden rounded-[6px] px-1.5 text-[13px] font-semibold text-[var(--c-accent-text)] hover:underline sm:inline ${RING}`}>Open</Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-[var(--c-line)] px-5 py-2.5">
        <p className="hidden text-[12.5px] text-[var(--c-faint)] md:block">Keyboard: J and K to move, P to publish or resolve, D to decline or dismiss</p>
        <p role="status" aria-live="polite" className="truncate text-[13px] font-semibold" style={{ color: note ? (note.ok ? "var(--c-good-ink)" : "var(--c-bad-ink)") : "var(--c-faint)" }}>
          {note ? note.text : ""}
        </p>
      </div>
    </section>
  );
}
