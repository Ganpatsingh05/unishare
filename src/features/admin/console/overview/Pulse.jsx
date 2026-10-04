"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { fmt } from "../consoleData";

function Count({ value }) {
  const ref = useRef(null);
  const seen = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (value == null) {
      el.textContent = "—";
      return undefined;
    }
    if (!seen || reduce) {
      el.textContent = fmt(value);
      return undefined;
    }
    const c = animate(0, value, { duration: 0.8, ease: "easeOut", onUpdate: (v) => (el.textContent = fmt(Math.round(v))) });
    return () => c.stop();
  }, [value, seen, reduce]);
  return <span ref={ref}>0</span>;
}

const pct = (v) => (v == null ? "—" : `${v}%`);

/**
 * Four figures across the top. "Waiting on you" wears the yellow marker
 * when there's something to do.
 */
export default function Pulse({ data }) {
  const waiting = data.inbox.length;
  const content = data.content;
  const cards = [
    { label: "Students", value: data.users?.total, sub: data.users ? `${pct(data.users.weekPct)} joined this week` : "couldn't load" },
    { label: "Posts", value: data.posts?.total, sub: data.posts ? `${pct(data.posts.weekPct)} posted this week` : "couldn't load", foot: "rides · rooms · tickets · lost & found" },
    {
      label: "Published content",
      value: content ? content.annLive + content.resLive : null,
      sub: content ? `${fmt(content.annLive)} announcements · ${fmt(content.resLive)} resources` : "couldn't load",
      foot: content ? `${fmt(content.annTotal + content.resTotal - content.annLive - content.resLive)} hidden or waiting` : "",
    },
    { label: "Waiting on you", value: waiting, sub: waiting ? "in the inbox below" : "you're all caught up", foot: waiting ? "approvals and reports" : "nothing pending", mark: waiting > 0 },
  ];

  return (
    <section aria-label="Pulse" className="grid grid-cols-1 gap-px overflow-hidden rounded-[12px] border border-[var(--c-line)] bg-[var(--c-line)] sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="flex flex-col justify-between gap-4 bg-[var(--c-panel)] p-5">
          <div>
            <div className="text-[13px] font-medium text-[var(--c-muted)]">{c.label}</div>
            <div className="c-mono mt-2 text-[34px] font-bold leading-none tracking-[-0.02em] text-[var(--c-text)]">
              {c.mark ? (
                <span className="relative inline-block px-1">
                  <span aria-hidden className="absolute inset-x-0 bottom-[-0.04em] top-[-0.02em] -skew-x-6 rounded-[3px] bg-[var(--c-mark)]" />
                  <span className="relative text-[var(--c-on-mark)]"><Count value={c.value} /></span>
                </span>
              ) : (
                <Count value={c.value} />
              )}
            </div>
            <div className="mt-1.5 text-[12.5px] text-[var(--c-faint)]">{c.sub}</div>
          </div>
          {c.foot ? <div className="text-[12.5px] text-[var(--c-muted)]">{c.foot}</div> : null}
        </div>
      ))}
    </section>
  );
}
