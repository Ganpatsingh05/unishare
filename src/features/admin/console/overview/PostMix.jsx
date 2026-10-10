"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fmt } from "../consoleData";

// Graphite steps for the segments; the biggest share gets the yellow marker.
const SHADES = [0.85, 0.6, 0.4, 0.25];

/** Where the posts are: one bar split by feature, largest first. */
export default function PostMix({ posts }) {
  const reduce = useReducedMotion();
  const kinds = [...posts.kinds].sort((a, b) => b.count - a.count);
  const total = kinds.reduce((s, k) => s + k.count, 0);

  return (
    <section aria-labelledby="c-mix" className="rounded-[12px] border border-[var(--c-line)] bg-[var(--c-panel)] p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="c-mix" className="text-[17px] font-bold text-[var(--c-text)]">Where the posts are</h2>
          <p className="mt-0.5 text-[13px] text-[var(--c-faint)]">
            <span className="c-mono text-[var(--c-text)]">{fmt(total)}</span> posts across rides, rooms, tickets and lost & found.
          </p>
        </div>
      </div>

      {total ? (
        <>
          <div role="img" aria-label={kinds.map((k) => `${k.label} ${k.count}`).join(", ")} className="mt-4 flex h-10 gap-[3px] overflow-hidden rounded-[6px]">
            {kinds.map((k, i) =>
              k.count ? (
                <motion.div
                  key={k.key}
                  initial={reduce ? false : { flexGrow: 0.0001 }}
                  animate={{ flexGrow: k.count }}
                  transition={{ duration: 0.8, delay: reduce ? 0 : i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  style={{ flexBasis: 0, minWidth: 6, backgroundColor: i === 0 ? "var(--c-mark)" : `rgba(var(--c-ink), ${SHADES[i] ?? 0.2})` }}
                />
              ) : null
            )}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
            {kinds.map((k, i) => (
              <li key={k.key} className="flex items-baseline gap-2">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 translate-y-[1px] rounded-[2px]" style={{ backgroundColor: i === 0 ? "var(--c-mark)" : `rgba(var(--c-ink), ${SHADES[i] ?? 0.2})` }} />
                <span className="text-[13.5px] text-[var(--c-muted)]">{k.label}</span>
                <span className="c-mono ml-auto text-[13px] text-[var(--c-text)]">{Math.round((k.count / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="mt-4 text-[14px] text-[var(--c-muted)]">No posts yet.</p>
      )}
    </section>
  );
}
