"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import { SCENES } from "./featureScenes";
import { BrandInk, Eyebrow, RING, RISE } from "./brandKit";
import { WEEK } from "../homeData";

/** Monday is 0. Read on the client only, so the server and browser agree. */
function useToday() {
  const [today, setToday] = useState(null);
  useEffect(() => setToday((new Date().getDay() + 6) % 7), []);
  return today;
}

/** The open day's story on its feature colour. */
function DayStory({ d, reduce, compact = false }) {
  const f = featureByKey[d.k];
  const Scene = SCENES[d.k];
  return (
    <div className="relative flex h-full flex-col overflow-hidden p-6 text-white sm:p-8">
      {!compact ? (
        <div aria-hidden className="absolute -bottom-8 -right-8 aspect-square w-[46%] max-w-[260px] rounded-full bg-white/10 p-[4%]">
          <Scene c={f.ink[1]} still={reduce} />
        </div>
      ) : null}
      <p className="text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-white/75">
        {d.day} · {d.time}
      </p>
      <p className={`mt-3 font-extrabold leading-[1.12] tracking-[-0.025em] ${compact ? "text-[21px]" : "max-w-[19ch] text-[clamp(1.6rem,2.6vw,2.4rem)]"}`}>{d.text}</p>
      <div className="mt-auto pt-6">
        <span className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-[12px] font-extrabold uppercase tracking-[0.12em]">{f.label}</span>
        <div>
          <Link href={d.link.href} className={`group inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-[14.5px] font-extrabold transition-transform hover:-translate-y-0.5 ${RING}`} style={{ color: f.ink[0] }}>
            {d.link.label}
            <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * A week on campus, one day per feature. Wide screens: seven columns, the open
 * one stretched to tell its story; today's day opens first. Phones: a
 * swipeable row of day cards.
 */
export default function CampusWeek({ dark }) {
  const reduce = useReducedMotion();
  const today = useToday();
  const [open, setOpen] = useState(4);
  const listRef = useRef(null);
  useEffect(() => {
    if (today === null) return;
    setOpen(today);
    // Phones: start the row at today's card, without moving the page.
    const list = listRef.current;
    const card = list?.children[today];
    if (list && card) list.scrollLeft = card.offsetLeft - list.offsetLeft - 16;
  }, [today]);

  return (
    <section aria-labelledby="hm-week" className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <Eyebrow>A week on campus</Eyebrow>
          <h2 id="hm-week" className="mt-4 text-[clamp(2.1rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--h-text)]">
            Seven days. <BrandInk dark={dark} tone="magenta">Seven little saves.</BrandInk>
          </h2>
        </div>
        <p className="max-w-[30rem] text-[16.5px] leading-relaxed text-[var(--h-muted)] lg:justify-self-end lg:pb-2">How UniShare fits into an ordinary week, from the Monday quiz to the Sunday move-out.</p>
      </div>

      {/* Wide screens. */}
      <div role="tablist" aria-label="Days of the week" className="mt-10 hidden h-[400px] gap-2.5 md:flex">
        {WEEK.map((d, i) => {
          const f = featureByKey[d.k];
          const on = i === open;
          return (
            <motion.div key={d.day} layout transition={{ layout: { duration: reduce ? 0 : 0.55, ease: RISE } }} className="relative min-w-0 overflow-hidden rounded-[26px]" style={{ flex: on ? 5 : 1, backgroundColor: on ? f.ink[0] : "var(--h-surface-solid)", boxShadow: "inset 0 0 0 1px var(--h-border)" }}>
              {on ? (
                <AnimatePresence mode="wait">
                  <motion.div key={d.day} role="tabpanel" aria-label={d.day} className="h-full" initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: reduce ? 0 : 0.2, ease: RISE }}>
                    <DayStory d={d} reduce={reduce} />
                  </motion.div>
                </AnimatePresence>
              ) : null}
              <button
                type="button"
                role="tab"
                aria-selected={on}
                aria-label={`${d.day}: ${f.label}`}
                onClick={() => setOpen(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(i)}
                className={`absolute inset-0 flex flex-col items-center justify-between py-5 transition-colors hover:bg-[var(--h-faint)] ${on ? "pointer-events-none opacity-0" : ""} ${RING}`}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: f.ink[dark ? 1 : 0] }} />
                <span className="text-[15px] font-extrabold tracking-[0.04em] text-[var(--h-text)] [writing-mode:vertical-rl] rotate-180">{d.day}</span>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[var(--h-muted)]">{i === today ? "Today" : d.day.slice(0, 3)}</span>
              </button>
              {on && i === today ? <span className="absolute right-5 top-5 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: f.ink[0] }}>Today</span> : null}
            </motion.div>
          );
        })}
      </div>

      {/* Phones. */}
      <ul ref={listRef} className="-mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {WEEK.map((d, i) => (
          <li key={d.day} className="relative min-h-[300px] w-[82%] shrink-0 snap-center overflow-hidden rounded-[24px]" style={{ backgroundColor: featureByKey[d.k].ink[0] }}>
            {i === today ? <span className="absolute right-4 top-4 z-10 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ color: featureByKey[d.k].ink[0] }}>Today</span> : null}
            <DayStory d={d} reduce compact />
          </li>
        ))}
      </ul>
    </section>
  );
}
