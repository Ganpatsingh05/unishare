"use client";

import { LEDGER_KINDS } from "../consoleData";
import { Tag } from "../ui";

/** The latest things that happened across UniShare, newest first. */
export default function Ledger({ items }) {
  return (
    <section aria-labelledby="c-ledger" className="flex min-h-0 flex-col overflow-hidden rounded-[14px] border border-[var(--c-line)] bg-[var(--c-panel)]">
      <div className="border-b border-[var(--c-line)] px-5 pb-3.5 pt-4">
        <h2 id="c-ledger" className="text-[17px] font-bold text-[var(--c-text)]">Recent activity</h2>
        <p className="mt-0.5 text-[13.5px] text-[var(--c-muted)]">Sign-ups, posts and reports from the past week.</p>
      </div>
      {items.length === 0 ? (
        <p className="px-5 py-12 text-center text-[14px] text-[var(--c-muted)]">Nothing has happened this week.</p>
      ) : (
        <ul tabIndex={0} aria-label="Recent activity" className="min-h-0 flex-1 divide-y divide-[var(--c-line)] overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--c-ring)]">
          {items.map((r, i) => {
            const kind = LEDGER_KINDS[r.type] || { label: r.type || "Update", tone: "neutral" };
            return (
              <li key={i} className="flex items-start gap-3 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] text-[var(--c-text)]">
                    {r.who ? <span className="font-semibold">{r.who}</span> : null}
                    {r.who ? <span className="text-[var(--c-muted)]"> · </span> : null}
                    <span className="text-[var(--c-muted)]">{r.action}</span>
                  </div>
                  {r.what ? <div className="mt-0.5 truncate text-[13.5px] font-medium text-[var(--c-text)]">{r.what}</div> : null}
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <Tag tone={kind.tone}>{kind.label}</Tag>
                  <span className="text-[12.5px] text-[var(--c-faint)]">{r.time}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
