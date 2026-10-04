"use client";

import Link from "next/link";
import { fmt } from "../consoleData";

function LiveBar({ pct }) {
  if (pct == null) return <span className="c-mono text-[13px] text-[var(--c-faint)]">—</span>;
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative h-1.5 w-24 overflow-hidden rounded-full bg-[var(--c-panel-2)] ring-1 ring-inset ring-[var(--c-line)]">
        <span className="absolute inset-y-0 left-0 rounded-full bg-[rgb(var(--c-ink))]" style={{ width: `${Math.min(100, pct)}%` }} />
      </span>
      <span className="c-mono text-[13px]">{Math.round(pct)}%</span>
    </span>
  );
}

/** Every feature on one table: how many posts and how much of it is still live. */
export default function FeatureTable({ posts, content }) {
  const rows = [
    ...(posts?.kinds || []).map((k) => ({ key: k.key, label: k.label, href: k.href, total: k.count, livePct: k.livePct })),
    ...(content
      ? [
          { key: "ann", label: "Announcements", href: "/console/announcements", total: content.annTotal, livePct: content.annTotal ? (content.annLive / content.annTotal) * 100 : null },
          { key: "res", label: "Resources", href: "/console/resources", total: content.resTotal, livePct: content.resTotal ? (content.resLive / content.resTotal) * 100 : null },
        ]
      : []),
  ];

  return (
    <section aria-labelledby="c-features" className="overflow-hidden rounded-[12px] border border-[var(--c-line)] bg-[var(--c-panel)]">
      <div className="border-b border-[var(--c-line)] px-5 pb-3 pt-4">
        <h2 id="c-features" className="text-[17px] font-bold text-[var(--c-text)]">By feature</h2>
        <p className="mt-0.5 text-[13px] text-[var(--c-faint)]">Marketplace isn't counted by the analytics endpoint yet, so it's left out here.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-left">
          <thead>
            <tr className="bg-[var(--c-panel-2)] text-[12.5px] text-[var(--c-muted)]">
              <th scope="col" className="px-5 py-2.5 font-medium">Feature</th>
              <th scope="col" className="px-3 py-2.5 text-right font-medium">Posts</th>
              <th scope="col" className="px-6 py-2.5 font-medium">Still live</th>
              <th scope="col" className="px-5 py-2.5"><span className="sr-only">Open</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="group border-t border-[var(--c-line)] hover:bg-[var(--c-panel-2)]">
                <th scope="row" className="px-5 py-3 text-[14px] font-semibold">{r.label}</th>
                <td className="c-mono px-3 py-3 text-right text-[13.5px]">{fmt(r.total)}</td>
                <td className="px-6 py-3"><LiveBar pct={r.livePct} /></td>
                <td className="px-5 py-3 text-right">
                  <Link href={r.href} className="rounded-[6px] text-[13px] font-semibold text-[var(--c-accent-text)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
