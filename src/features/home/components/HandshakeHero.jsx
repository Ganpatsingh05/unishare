"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, MagnifyingGlass, Pause, Play } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import { SCENES } from "./featureScenes";
import LottieLoop from "./LottieLoop";
import { BrandInk, Eyebrow, JOIN, RING, RISE, UArms, U_RADIUS } from "./brandKit";
import { BRAND, SEARCH_HINTS, SLIDES } from "../homeData";
import { pulse } from "../homeLottie";

const DURATION = 7000;
const SIZES = "(min-width: 1024px) 46vw, 100vw";
const FACTS = ["Free to use", "No app to download", "Made for campus life"];

// Hero files that failed once, so later slides skip straight to the scene.
const missing = new Set();

/** The search palette lives in the header; it opens on Ctrl/Cmd+K. */
function openSearch() {
  document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, metaKey: false, bubbles: true }));
}

/** A slide's picture, or, until its file exists, the feature's scene on its colour. */
function SlideArt({ slide, priority, moving }) {
  const [failed, setFailed] = useState(() => !slide.image || missing.has(slide.image));
  const f = featureByKey[slide.key];
  if (failed) {
    const Scene = SCENES[slide.key];
    return (
      <div className="absolute inset-0" style={{ backgroundColor: f.ink[0] }}>
        <div aria-hidden className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.55)_1.2px,transparent_1.2px)] [background-size:22px_22px]" />
        <div className="absolute left-1/2 top-[42%] aspect-square w-[min(68%,360px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 p-[6%] ring-1 ring-white/20">
          <Scene c={f.ink[1]} still={!moving} />
        </div>
      </div>
    );
  }
  return (
    <Image
      src={slide.image}
      alt=""
      fill
      sizes={SIZES}
      priority={priority}
      className="object-cover"
      style={{ objectPosition: `${slide.focus}% 50%` }}
      onError={() => {
        missing.add(slide.image);
        setFailed(true);
      }}
    />
  );
}

/** Rotating search hints in a pill that opens the real search. */
function SearchPill({ reduce }) {
  const [i, setI] = useState(0);
  const [mac, setMac] = useState(false);
  useEffect(() => {
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    if (reduce) return undefined;
    const id = setInterval(() => setI((n) => (n + 1) % SEARCH_HINTS.length), 2800);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Search UniShare"
      className={`group flex h-14 w-full max-w-[460px] items-center gap-3 rounded-full border border-[var(--h-border)] bg-[var(--h-surface-solid)] pl-5 pr-2 text-left shadow-[0_14px_34px_-22px_rgba(18,35,58,0.55)] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(21,101,216,0.55)] ${RING}`}
    >
      <MagnifyingGlass size={20} weight="bold" aria-hidden className="shrink-0 text-[var(--h-accent)]" />
      <span className="relative h-6 min-w-0 flex-1 overflow-hidden text-[15.5px] text-[var(--h-muted)]">
        <span className="absolute inset-y-0 left-0 flex items-center whitespace-nowrap">
          I need&nbsp;
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={i} className="font-semibold text-[var(--h-text)]" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} transition={{ duration: 0.35, ease: RISE }}>
              {SEARCH_HINTS[i]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      <kbd className="hidden h-10 shrink-0 items-center rounded-full bg-[var(--h-faint)] px-3.5 font-sans text-[12.5px] font-bold text-[var(--h-muted)] sm:inline-flex">{mac ? "⌘" : "Ctrl"} K</kbd>
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--h-accent)] text-[var(--h-on-accent)] sm:hidden">
        <ArrowRight size={17} weight="bold" />
      </span>
    </button>
  );
}

/** The current slide's card: what it is, and where to go. Floats over the window's edge on desktop. */
function Caption({ slide, dark, reduce }) {
  const f = featureByKey[slide.key];
  const ink = f.ink[dark ? 1 : 0];
  return (
    <motion.div
      key={slide.key}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, transition: { duration: 0.2 } }}
      transition={{ duration: 0.55, ease: RISE, delay: reduce ? 0 : 0.25 }}
      className="rounded-[24px] border border-[var(--h-border)] bg-[var(--h-surface)] p-5 shadow-[var(--h-shadow)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em]" style={{ color: ink }}>
        <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: ink }} />
        {slide.label}
      </div>
      <p className="mt-2 text-[22px] font-extrabold leading-[1.1] tracking-[-0.025em] text-[var(--h-text)]">
        {slide.lines[0]} <span style={{ color: ink }}>{slide.lines[1]}</span>
      </p>
      <p className="mt-1.5 text-[14.5px] leading-snug text-[var(--h-muted)]">{slide.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href={slide.primary.href} className={`group inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14.5px] font-extrabold text-white transition-transform hover:-translate-y-0.5 ${RING}`} style={{ backgroundColor: f.ink[0] }}>
          {slide.primary.label}
          <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href={slide.secondary.href} className={`rounded-full text-[14.5px] font-bold text-[var(--h-text)] underline decoration-[var(--h-border)] decoration-2 underline-offset-4 transition-colors hover:decoration-current ${RING}`}>
          {slide.secondary.label}
        </Link>
      </div>
    </motion.div>
  );
}

/**
 * The home page hero. Left: who we are, and a search that opens the real
 * palette. Right: the four big UniShare stories inside the logo's U, framed by
 * its two arms; each new banner grows out of the handshake at the bottom.
 * Auto-advances with story-style progress tabs; pauses on hover, focus, off
 * screen, in a background tab or with the pause button. Swipe, arrow keys or
 * the tabs move between slides.
 */
export default function HandshakeHero({ dark }) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const swipe = useRef(null);
  const inView = useInView(rootRef, { amount: 0.3 });
  const [current, setCurrent] = useState(0);
  const [turn, setTurn] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);
  const live = useMemo(() => pulse(BRAND.blue), []);

  useEffect(() => {
    if (reduce) setPlaying(false);
  }, [reduce]);
  useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const go = useCallback(
    (next) => {
      const i = (next + SLIDES.length) % SLIDES.length;
      if (i === current) return;
      setCurrent(i);
      setTurn((n) => n + 1);
    },
    [current]
  );

  const running = playing && !held && inView && visible;
  const slide = SLIDES[current];
  const upcoming = SLIDES[(current + 1) % SLIDES.length];

  const onTabKey = (e, i) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const n = (i + step + SLIDES.length) % SLIDES.length;
    go(n);
    tabRefs.current[n]?.focus();
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(current + (dx < 0 ? 1 : -1));
  };
  const hold = {
    onPointerEnter: (e) => e.pointerType === "mouse" && setHeld(true),
    onPointerLeave: (e) => e.pointerType === "mouse" && setHeld(false),
    onFocus: () => setHeld(true),
    onBlur: (e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false),
  };
  const up = (delay) => ({ initial: reduce ? false : { opacity: 0, y: 22 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease: RISE } });

  return (
    <section ref={rootRef} aria-labelledby="hm-title" className="relative mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-14">
        {/* Who we are. */}
        <div className="pt-2 lg:pt-0">
          <h1 id="hm-title" className="mt-6 text-[clamp(2.9rem,11vw,3.6rem)] font-extrabold leading-[0.98] tracking-[-0.045em] text-[var(--h-text)] lg:text-[clamp(3.6rem,5.6vw,5.6rem)]">
            <motion.span {...up(0.08)} className="block">
              Your campus,
            </motion.span>
            <motion.span {...up(0.16)} className="relative inline-block pb-[0.12em]">
              <BrandInk dark={dark}>shared.</BrandInk>
              {/* The yellow hand, as a stroke under the word. */}
              <svg aria-hidden viewBox="0 0 200 20" preserveAspectRatio="none" className="absolute -bottom-[0.02em] left-[2%] h-[0.2em] w-[96%] overflow-visible">
                <motion.path d="M3 13 C 50 4, 120 2, 197 9" fill="none" stroke={BRAND.yellow} strokeWidth="9" strokeLinecap="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, delay: 0.7, ease: JOIN }} />
              </svg>
            </motion.span>
          </h1>

          <motion.p {...up(0.26)} className="mt-6 max-w-[34rem] text-[17px] leading-relaxed text-[var(--h-muted)] lg:text-[18.5px]">
            Rides, rooms, books, tickets, notes and lost things, passed between students hand to hand. One place for everything campus life asks of you.
          </motion.p>

          <motion.div {...up(0.34)} className="mt-7">
            <SearchPill reduce={reduce} />
          </motion.div>

          <motion.ul {...up(0.42)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] font-semibold text-[var(--h-muted)]">
            {FACTS.map((t, i) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: [BRAND.blue, BRAND.yellowDeep, BRAND.magenta][i] }} />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* The U. */}
        <div aria-roledescription="carousel" aria-label="UniShare highlights" className="relative" {...hold}>
          <div className="relative mx-auto w-full max-w-[600px] px-[14px] pb-8 lg:max-w-none lg:pl-[14px] lg:pr-[14px]">
            <div className="relative">
              <UArms width={12} />
              <motion.div
                id="hm-slide"
                role="tabpanel"
                aria-label={`${current + 1} of ${SLIDES.length}: ${slide.label}`}
                className="relative m-[16px] aspect-[4/4.3] touch-pan-y select-none overflow-hidden bg-[var(--h-panel)] shadow-[inset_0_0_0_1px_var(--h-border)] sm:aspect-[5/4.4] lg:aspect-auto lg:h-[clamp(500px,68vh,620px)]"
                style={{ borderRadius: U_RADIUS }}
                initial={reduce ? false : { opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: RISE }}
                onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
                onPointerUp={onPointerUp}
                onPointerCancel={() => (swipe.current = null)}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={`${slide.key}-${turn}`}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0, zIndex: 2 } : { clipPath: "circle(0% at 50% 100%)", zIndex: 2 }}
                    animate={reduce ? { opacity: 1, zIndex: 2 } : { clipPath: "circle(150% at 50% 100%)", zIndex: 2 }}
                    exit={{ zIndex: 1, opacity: 1, transition: { duration: reduce ? 0.35 : 1.15 } }}
                    transition={{ duration: reduce ? 0.35 : 1.15, ease: JOIN }}
                  >
                    {/* A slow drift while the slide is up. */}
                    <motion.div className="absolute inset-0" style={{ transformOrigin: `${slide.focus}% 60%` }} initial={{ scale: reduce ? 1 : 1.14 }} animate={{ scale: 1 }} transition={{ duration: reduce ? 0 : DURATION / 1000 + 1.2, ease: "linear" }}>
                      <SlideArt slide={slide} priority={turn === 0} moving={!reduce && inView && visible} />
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
                {/* Warm the next picture so its reveal starts crisp. */}
                {upcoming.image && !missing.has(upcoming.image) ? (
                  <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
                    <Image src={upcoming.image} alt="" fill sizes={SIZES} className="object-cover" />
                  </div>
                ) : null}
              </motion.div>

              {/* The handshake: the logo where the arms meet. */}
              <motion.div
                aria-hidden
                className="absolute bottom-0 left-1/2 z-10 grid h-[68px] w-[68px] -translate-x-1/2 translate-y-[38%] place-items-center rounded-full bg-white shadow-[0_14px_30px_-12px_rgba(18,35,58,0.55)] ring-4 ring-[var(--h-surface-solid)] lg:h-[78px] lg:w-[78px]"
                initial={reduce ? false : { scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: reduce ? 0 : 1.1 }}
              >
                <Image src="/images/logos/logounishare1.png" alt="" width={48} height={48} className="h-[46px] w-[46px] object-contain lg:h-[52px] lg:w-[52px]" />
              </motion.div>

              {/* A note beside the window, per slide. */}
              <div aria-hidden className="pointer-events-none absolute -right-3 top-[14%] z-10 hidden sm:block lg:-right-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={slide.key}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 12, transition: { duration: 0.2 } }}
                    transition={{ type: "spring", stiffness: 240, damping: 22, delay: reduce ? 0 : 0.6 }}
                    className="flex items-center gap-2 rounded-full border border-[var(--h-border)] bg-[var(--h-surface)] py-2 pl-2 pr-4 text-[13.5px] font-bold text-[var(--h-text)] shadow-[var(--h-shadow)] backdrop-blur-xl"
                  >
                    <LottieLoop data={live} rest={30} className="h-6 w-6" />
                    {slide.chip}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Desktop: the caption floats over the window's left edge. */}
            <div className="absolute -left-10 bottom-24 z-10 hidden w-[340px] lg:block xl:-left-16">
              <AnimatePresence mode="wait" initial={false}>
                <Caption key={slide.key} slide={slide} dark={dark} reduce={reduce} />
              </AnimatePresence>
            </div>
          </div>

          {/* Phones and tablets: the caption sits under the window. */}
          <div className="relative mt-6 lg:hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <Caption key={slide.key} slide={slide} dark={dark} reduce={reduce} />
            </AnimatePresence>
          </div>

          {/* Story-style progress tabs and play/pause. */}
          <div className="mt-5 flex items-center gap-3 lg:mt-2 lg:px-4">
            <div role="tablist" aria-label="Choose a highlight" className="grid flex-1 grid-cols-4 gap-1.5 sm:gap-2.5">
              {SLIDES.map((s, i) => {
                const on = i === current;
                const ink = featureByKey[s.key].ink[dark ? 1 : 0];
                return (
                  <button
                    key={s.key}
                    ref={(el) => (tabRefs.current[i] = el)}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    aria-controls="hm-slide"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`group min-w-0 rounded-[12px] px-1 py-2 text-left ${RING}`}
                  >
                    <span className={`block truncate text-[12.5px] font-bold transition-colors sm:text-[13.5px] ${on ? "text-[var(--h-text)]" : "text-[var(--h-muted)] group-hover:text-[var(--h-text)]"}`}>
                      <span className="sm:hidden">{s.short || s.label}</span>
                      <span className="hidden sm:inline">{s.label}</span>
                    </span>
                    <span className="relative mt-2 block h-1 overflow-hidden rounded-full bg-[var(--h-border)]">
                      <span
                        key={on ? `fill-${turn}` : `idle-${i}`}
                        className="absolute inset-0 origin-left rounded-full"
                        onAnimationEnd={on ? () => go(current + 1) : undefined}
                        style={{
                          backgroundColor: ink,
                          opacity: on ? 1 : 0.35,
                          transform: on ? undefined : `scaleX(${i < current ? 1 : 0})`,
                          animation: on ? `hmFill ${DURATION}ms linear forwards` : undefined,
                          animationPlayState: running ? "running" : "paused",
                        }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
            <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause highlights" : "Play highlights"} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--h-text)] text-[var(--h-surface-solid)] transition-transform hover:scale-105 ${RING}`}>
              {playing ? <Pause size={15} weight="fill" aria-hidden /> : <Play size={15} weight="fill" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes hmFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </section>
  );
}
