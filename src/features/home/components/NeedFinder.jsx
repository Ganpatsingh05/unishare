"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import { TOUR } from "../homeData";
import { SCENES } from "./featureScenes";

// What a student might actually need, in their words, for each feature.
const NEEDS = {
  rides: "get home this weekend",
  rooms: "find a room near campus",
  market: "sell my old textbooks",
  tickets: "pass on a concert ticket",
  lostfound: "find my lost ID card",
  announcements: "tell everyone about our event",
  resources: "get notes for my exams",
  contacts: "call campus security",
};
const ORDER = TOUR.map((t) => t.key);
const BY_KEY = Object.fromEntries(TOUR.map((t) => [t.key, t]));
const RISE = [0.22, 1, 0.36, 1];
const TYPE_MS = 42;
const ERASE_MS = 22;
const HOLD_MS = 2600;
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--h-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

/** Three steps; a line runs down through them and each number lights up as it is reached. */
function Steps({ steps, ink, reduce }) {
  const at = (k) => (reduce ? 0 : 0.35 + k * 0.6);
  return (
    <ol className="relative mt-5 grid gap-3">
      <span aria-hidden className="absolute bottom-3.5 left-[13px] top-3.5 w-[2px] rounded-full bg-[var(--h-border)]" />
      <motion.span aria-hidden className="absolute bottom-3.5 left-[13px] top-3.5 w-[2px] origin-top rounded-full" style={{ backgroundColor: ink }} initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: reduce ? 0 : 1.3, delay: at(0) + 0.1, ease: "easeInOut" }} />
      {steps.map((step, k) => (
        <motion.li key={step} className="relative flex items-center gap-3 text-[15.5px] font-semibold leading-snug text-[var(--h-text)]" initial={reduce ? false : { opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.45, delay: at(k), ease: RISE }}>
          <motion.span
            className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 text-[12.5px] font-extrabold"
            style={{ borderColor: ink }}
            initial={reduce ? false : { backgroundColor: "rgba(0,0,0,0)", color: ink, scale: 0.8 }}
            animate={{ backgroundColor: ink, color: "#FFFFFF", scale: 1 }}
            transition={{ duration: 0.35, delay: at(k) + 0.15 }}
          >
            {k + 1}
          </motion.span>
          {step}
        </motion.li>
      ))}
    </ol>
  );
}

/**
 * "What do you need?": a sentence that types itself, cycling through real
 * student needs, with all eight needs as chips underneath. Pick one (or let it
 * cycle) and the answer card shows the feature that solves it: its scene, how
 * it works in three steps, and where to go.
 */
export default function NeedFinder({ dark }) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { margin: "-15% 0px -15% 0px" });
  const [active, setActive] = useState(ORDER[0]);
  const [prev, setPrev] = useState(ORDER[0]); // the need being erased
  const [typed, setTyped] = useState(reduce ? NEEDS[ORDER[0]] : "");
  const [picked, setPicked] = useState(false); // once the user picks, it stops cycling
  const [held, setHeld] = useState(false);
  const target = NEEDS[active];

  // Type the current need, letter by letter (or erase, then type a picked one).
  useEffect(() => {
    if (reduce) {
      setTyped(target);
      return undefined;
    }
    if (typed === target) return undefined;
    const typing = target.startsWith(typed);
    const id = setTimeout(() => setTyped(typing ? target.slice(0, typed.length + 1) : typed.slice(0, -1)), typing ? TYPE_MS : ERASE_MS);
    return () => clearTimeout(id);
  }, [typed, target, reduce]);

  // When a need is fully typed and nobody has picked one, move on to the next.
  const cycling = !picked && !held && inView && !reduce;
  useEffect(() => {
    if (!cycling || typed !== target) return undefined;
    const id = setTimeout(() => {
      setPrev(active);
      setActive(ORDER[(ORDER.indexOf(active) + 1) % ORDER.length]);
    }, HOLD_MS);
    return () => clearTimeout(id);
  }, [cycling, typed, target, active]);

  const choose = (key) => {
    setPicked(true);
    if (key === active) return;
    setPrev(active);
    setActive(key);
  };

  // While the old need is still being erased, its colour and card stay up;
  // the new ones arrive as the new need starts typing.
  const shown = typed === "" || target.startsWith(typed) ? active : prev;
  const stop = BY_KEY[shown];
  const f = featureByKey[shown];
  const ink = f.ink[dark ? 1 : 0];
  const deep = f.ink[0];
  const Scene = SCENES[shown];
  const [main, extra] = stop.actions;

  return (
    <section id="features" aria-labelledby="hm-need" className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 sm:px-6">
      <div ref={rootRef} onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)} onPointerLeave={(e) => e.pointerType === "mouse" && setHeld(false)}>
        <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--h-accent)]">Everything in one place</p>

        {/* The sentence. Screen readers get the plain heading; the typing is visual only. */}
        <h2 id="hm-need" className="sr-only">What do you need? UniShare has a place for it.</h2>
        <p aria-hidden className="mt-3 min-h-[2.2em] text-[clamp(2.2rem,5.6vw,4.6rem)] font-extrabold leading-[1.05] tracking-[-0.04em] text-[var(--h-text)] sm:min-h-[1.15em]">
          I want to{" "}
          <span className="relative whitespace-normal" style={{ color: ink, transition: "color 300ms ease" }}>
            {typed}
            <span className="nf-caret ml-[0.04em] inline-block h-[0.9em] w-[0.08em] translate-y-[0.1em] rounded-full" style={{ backgroundColor: ink }} />
          </span>
        </p>

        {/* Every need, always visible. */}
        <div className="mt-7">
          <p id="nf-pick" className="text-[14px] font-bold text-[var(--h-muted)]">Pick what you need</p>
          <div role="radiogroup" aria-labelledby="nf-pick" className="-mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 [&::-webkit-scrollbar]:hidden">
            {ORDER.map((key) => {
              const k = featureByKey[key];
              const c = k.ink[dark ? 1 : 0];
              const on = key === active;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(key)}
                  className={`group relative inline-flex h-11 items-center gap-2.5 overflow-hidden rounded-full border-2 px-4 text-[14.5px] font-bold shrink-0 transition-[transform,border-color,color] duration-300 hover:-translate-y-0.5 ${RING}`}
                  style={{ borderColor: on ? c : "var(--h-border)", color: on ? (dark ? "#12233A" : "#FFFFFF") : "var(--h-text)", backgroundColor: on ? undefined : "var(--h-surface-solid)" }}
                >
                  {on ? <motion.span layoutId="nf-chip" className="absolute inset-0" style={{ backgroundColor: c }} transition={{ type: "spring", stiffness: 420, damping: 34 }} /> : null}
                  <span aria-hidden className="relative h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125" style={{ backgroundColor: on ? (dark ? "#12233A" : "#FFFFFF") : c }} />
                  <span className="relative">{NEEDS[key]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The answer. */}
        <div aria-live="polite" className="mt-8 lg:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            <motion.article
              key={shown}
              className="grid overflow-hidden rounded-[30px] border border-[var(--h-border)] bg-[var(--h-surface-solid)] shadow-[var(--h-shadow)] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotateX: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -18, scale: 0.98 }}
              transition={{ duration: 0.5, ease: RISE }}
              style={{ transformPerspective: 1200 }}
            >
              {/* Scene on the feature's colour. */}
              <div className="relative grid min-h-[260px] place-items-center overflow-hidden p-6 md:min-h-[420px]" style={{ backgroundColor: deep }}>
                <span aria-hidden className="absolute -left-10 -top-10 h-44 w-44 rounded-full border-[18px] border-white/10" />
                <span aria-hidden className="absolute -bottom-16 -right-12 h-56 w-56 rounded-full bg-white/[0.06]" />
                <motion.div
                  className="relative aspect-square w-[min(64vw,300px)] rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.12)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)" }}
                  initial={reduce ? false : { scale: 0.6, rotate: -25, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 17, delay: reduce ? 0 : 0.1 }}
                >
                  <div className="h-full w-full p-[7%]">
                    <Scene c={f.ink[1]} still={reduce} />
                  </div>
                </motion.div>
                <span className="absolute left-5 top-5 rounded-full bg-white px-3 py-1 text-[12.5px] font-extrabold uppercase tracking-[0.12em]" style={{ color: deep }}>
                  {f.label}
                </span>
              </div>

              {/* How it works, and where to go. */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12">
                <p className="text-[13px] font-extrabold uppercase tracking-[0.14em]" style={{ color: ink }}>UniShare {f.label}</p>
                <h3 className="mt-2 max-w-[20ch] text-[clamp(1.6rem,2.8vw,2.4rem)] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--h-text)]">{stop.title}</h3>
                <p className="mt-3 max-w-[32rem] text-[16px] leading-relaxed text-[var(--h-muted)]">{stop.body}</p>
                <Steps steps={stop.steps} ink={ink} reduce={reduce} />
                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <Link href={main.href} className={`group inline-flex h-12 items-center gap-2 rounded-full px-5 text-[15px] font-extrabold text-white transition-transform hover:-translate-y-0.5 ${RING}`} style={{ backgroundColor: deep }}>
                    {main.label}
                    <ArrowRight size={17} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  {extra ? (
                    <Link href={extra.href} className={`inline-flex h-12 items-center rounded-full border-2 border-[var(--h-border)] px-5 text-[15px] font-bold text-[var(--h-text)] transition-colors hover:border-[var(--h-text)] ${RING}`}>
                      {extra.label}
                    </Link>
                  ) : null}
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </div>
      <style>{`
        @keyframes nfBlink { 0%, 45% { opacity: 1; } 55%, 100% { opacity: 0; } }
        .nf-caret { animation: nfBlink 1s steps(1) infinite; }
        @media (prefers-reduced-motion: reduce) { .nf-caret { animation: none; } }
      `}</style>
    </section>
  );
}
