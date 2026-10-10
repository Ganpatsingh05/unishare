"use client";

import { featureByKey } from "@components/layout/header/navConfig";
import { TICKER } from "../homeData";

/** One chip, cut like a luggage tag: a notched end with a punched hole. */
function Tag({ item, dark }) {
  const f = featureByKey[item.k];
  const ink = f.ink[dark ? 1 : 0];
  return (
    <li className="relative flex shrink-0 items-center gap-2.5 rounded-r-[16px] border border-l-0 border-[var(--h-border)] bg-[var(--h-surface-solid)] py-3 pl-8 pr-5 text-[14.5px] font-semibold text-[var(--h-text)] [clip-path:polygon(14px_0,100%_0,100%_100%,14px_100%,0_50%)]">
      <span aria-hidden className="absolute left-[10px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full" style={{ backgroundColor: ink }} />
      {item.t}
    </li>
  );
}

/**
 * Two rows of tags drifting in opposite directions: the everyday things
 * students share. Pauses on hover; stands still for reduced motion.
 */
export default function CampusTicker({ dark }) {
  return (
    <section aria-labelledby="hm-ticker" className="relative">
      <h2 id="hm-ticker" className="mx-auto max-w-[1320px] px-4 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--h-muted)] sm:px-6">
        From weekend rides to revision notes
      </h2>
      <div className="hm-ticker mt-5 flex flex-col gap-3 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {TICKER.map((row, r) => (
          <div key={r} className="flex overflow-hidden">
            {/* The row twice, so the loop is seamless; the copy is hidden from screen readers. */}
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1 || undefined} className="hm-ticker-row flex shrink-0 gap-3 pr-3" style={{ animationDuration: `${r ? 52 : 44}s`, animationDirection: r ? "reverse" : "normal" }}>
                {row.map((item) => <Tag key={item.t} item={item} dark={dark} />)}
              </ul>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes hmTicker { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        .hm-ticker-row { animation-name: hmTicker; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        .hm-ticker:hover .hm-ticker-row { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .hm-ticker-row { animation: none; } }
      `}</style>
    </section>
  );
}
