"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowRight, CaretLeft, CaretRight, Pause, Play } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import { useUI } from "@contexts/UniShareContext";
import HomeArt from "./HomeArt";
import { BRAND, SLIDES } from "../homeData";

const DURATION = 7000;
const JOIN = [0.76, 0, 0.24, 1];
const RISE = [0.22, 1, 0.36, 1];
const SIZES = "(min-width: 1024px) 62vw, 100vw";
const ZOOM = 1.08;
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--h-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--h-surface-solid)]";

function Photo({ slide, priority = false }) {
  const { darkMode } = useUI();
  return <HomeArt src={slide.image} feature={slide.key} kind="photo" dark={darkMode} sizes={SIZES} priority={priority} style={{ objectPosition: `${slide.focus}% 50%` }} />;
}

/** The settled slide: a slow Ken Burns drift. While the next one sweeps in, it eases back, blurs and dims. */
function Settled({ slide, priority, leaving, reduce }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={leaving && !reduce ? { x: "-5%", scale: 0.97, opacity: 0.25, filter: "blur(8px)" } : { x: "0%", scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.15, ease: JOIN }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: `${slide.focus}% 50%` }}
        initial={{ scale: reduce ? 1 : ZOOM }}
        animate={{ scale: 1 }}
        transition={{ duration: reduce ? 0 : DURATION / 1000 + 1.5, ease: "linear" }}
      >
        <Photo slide={slide} priority={priority} />
      </motion.div>
    </motion.div>
  );
}

/**
 * The next slide sweeps in from the left behind a soft, feathered edge,
 * settling out of a deeper zoom. It ends at the same zoom the settled slide
 * starts from, so the hand-over is seamless.
 */
function Reveal({ slide, onDone }) {
  const p = useMotionValue(0);
  const edge = useTransform(p, (v) => v * 140 - 40);
  const feather = useTransform(p, (v) => v * 140);
  const mask = useMotionTemplate`linear-gradient(90deg, #000 ${edge}%, transparent ${feather}%)`;
  useEffect(() => {
    const run = animate(p, 1, { duration: 1.25, ease: JOIN, onComplete: onDone });
    return () => run.stop();
  }, [p, onDone]);
  return (
    <motion.div className="absolute inset-0 z-10" style={{ maskImage: mask, WebkitMaskImage: mask }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: `${slide.focus}% 50%` }}
        initial={{ scale: ZOOM + 0.1, x: "-3%" }}
        animate={{ scale: ZOOM, x: "0%" }}
        transition={{ duration: 1.25, ease: JOIN }}
      >
        <Photo slide={slide} />
      </motion.div>
    </motion.div>
  );
}

/** Words for one slide; each line rises out of a mask. */
function SlideCopy({ slide, dark, reduce }) {
  const f = featureByKey[slide.key];
  const ink = f.ink[dark ? 1 : 0];
  const up = (delay) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: reduce ? 0 : delay, ease: RISE } });
  return (
    <motion.div key={slide.key} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.22 } }}>
      <motion.div {...up(0.05)} className="text-[13px] font-extrabold uppercase tracking-[0.14em]" style={{ color: ink }}>
        {slide.label}
      </motion.div>

      <h2 className="mt-4 text-[clamp(2.15rem,7.6vw,2.9rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[var(--h-text)] lg:text-[clamp(2.7rem,4.3vw,4.5rem)]">
        {slide.lines.map((line, i) => (
          <span key={line} className="block overflow-hidden pb-[0.08em]">
            <motion.span
              className="block"
              style={i === 1 ? { color: dark ? BRAND.sky : BRAND.blue } : undefined}
              initial={reduce ? false : { y: "108%", rotate: 2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.85, delay: reduce ? 0 : 0.12 + i * 0.09, ease: RISE }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h2>

      {/* Two short bars, blue from the left and yellow from the right, shaking hands. */}
      <div aria-hidden className="mt-4 flex h-[5px] w-[92px] overflow-hidden rounded-full">
        <motion.span className="h-full w-1/2" style={{ backgroundColor: dark ? BRAND.sky : BRAND.blue }} initial={reduce ? false : { x: "-110%" }} animate={{ x: 0 }} transition={{ duration: 0.7, delay: reduce ? 0 : 0.42, ease: JOIN }} />
        <motion.span className="h-full w-1/2" style={{ backgroundColor: BRAND.yellow }} initial={reduce ? false : { x: "110%" }} animate={{ x: 0 }} transition={{ duration: 0.7, delay: reduce ? 0 : 0.46, ease: JOIN }} />
      </div>

      <motion.p {...up(0.32)} className="mt-4 max-w-[30rem] text-[16px] leading-relaxed text-[var(--h-muted)] lg:text-[17.5px]">
        {slide.body}
      </motion.p>

      <motion.div {...up(0.42)} className="mt-6 flex flex-wrap gap-2.5">
        <Link href={slide.primary.href} className={`group inline-flex h-12 items-center gap-2 rounded-full bg-[var(--h-accent)] px-5 text-[15px] font-bold text-[var(--h-on-accent)] shadow-[0_10px_24px_-12px_var(--h-accent)] transition-transform hover:-translate-y-0.5 ${RING}`}>
          {slide.primary.label}
          <ArrowRight size={17} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href={slide.secondary.href} className={`inline-flex h-12 items-center rounded-full border border-[var(--h-border)] bg-[var(--h-surface-solid)] px-5 text-[15px] font-bold text-[var(--h-text)] transition-colors hover:bg-[var(--h-faint)] ${RING}`}>
          {slide.secondary.label}
        </Link>
      </motion.div>
    </motion.div>
  );
}

/**
 * The home page hero: the four big UniShare stories. Auto-advances every few
 * seconds with story-style progress tabs; pauses on hover, focus, off screen,
 * in a background tab or with the pause button. Swipe, arrow keys or the tabs
 * move between slides.
 */
export default function HeroShowcase({ dark }) {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const tabRefs = useRef([]);
  const swipe = useRef(null);
  const inView = useInView(rootRef, { amount: 0.35 });
  const [current, setCurrent] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [joinId, setJoinId] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [visible, setVisible] = useState(true);

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
      setPrevious(current);
      setCurrent(i);
      setJoinId((n) => n + 1);
    },
    [current]
  );

  const running = playing && !held && inView && visible;

  // Depth: the picture drifts against the pointer, the words a little with it.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 70, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 70, damping: 18, mass: 0.6 });
  const photoX = useTransform(sx, (v) => v * -18);
  const photoY = useTransform(sy, (v) => v * -12);
  const wordsX = useTransform(sx, (v) => v * 6);
  const wordsY = useTransform(sy, (v) => v * 4);
  const onCardMove = (e) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const clearDone = useCallback(() => setPrevious(null), []);
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

  const onPointerDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.5) go(current + (dx < 0 ? 1 : -1));
  };

  return (
    <section ref={rootRef} aria-roledescription="carousel" aria-label="UniShare highlights" className="relative mx-auto w-full max-w-[1320px] px-3 sm:px-6">

      <div
        className="relative overflow-hidden rounded-[28px] border border-[var(--h-border)] bg-[var(--h-surface-solid)] shadow-[var(--h-shadow)] lg:h-[clamp(500px,66vh,640px)] lg:rounded-[36px]"
        onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          setHeld(false);
          px.set(0);
          py.set(0);
        }}
        onPointerMove={onCardMove}
        onFocus={() => setHeld(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHeld(false)}
      >
        {/* Photo: no frame. It melts into the card from the left on desktop, and into the words below on phones. */}
        <motion.div
          id="hm-slide"
          role="tabpanel"
          aria-label={`${current + 1} of ${SLIDES.length}: ${slide.label}`}
          className="relative aspect-[4/3] touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(180deg,#000_58%,transparent_100%)] sm:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[68%] lg:[mask-image:linear-gradient(90deg,transparent_0%,rgba(0,0,0,0.04)_10%,rgba(0,0,0,0.18)_20%,rgba(0,0,0,0.45)_30%,rgba(0,0,0,0.78)_40%,#000_52%)]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
        >
          {/* Parallax layer, a touch oversized so its edges never show. */}
          <motion.div className="absolute -inset-6" style={{ x: photoX, y: photoY }}>
          <Settled key={`base-${previous ?? current}`} slide={SLIDES[previous ?? current]} priority={current === 0 && previous === null} leaving={previous !== null} reduce={reduce} />
          {previous !== null ? (
            reduce ? (
              <motion.div key={`fade-${joinId}`} className="absolute inset-0 z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35 }} onAnimationComplete={() => setPrevious(null)}>
                <Photo slide={slide} />
              </motion.div>
            ) : (
              <Reveal key={`join-${joinId}`} slide={slide} onDone={clearDone} />
            )
          ) : null}
          {/* Warm the next photo so its handshake starts crisp. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-0">
            <Photo slide={upcoming} />
          </div>
          </motion.div>
        </motion.div>

        {/* Words. */}
        <motion.div style={{ x: wordsX, y: wordsY }} className="relative z-10 -mt-16 px-5 pb-6 sm:-mt-24 sm:px-8 sm:pb-8 lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:flex lg:w-[44%] lg:flex-col lg:justify-center lg:pb-0 lg:pl-14 lg:pr-4 xl:pl-16">
          <AnimatePresence mode="wait" initial={false}>
            <SlideCopy key={slide.key} slide={slide} dark={dark} reduce={reduce} />
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Slide counter, story-style progress tabs, and one control pill. */}
      <div className="mt-4 flex items-center gap-3 sm:gap-5">
        <div aria-hidden className="hidden shrink-0 items-baseline gap-1 pl-1 font-extrabold tabular-nums text-[var(--h-text)] sm:flex">
          <span className="text-[22px] leading-none">{String(current + 1).padStart(2, "0")}</span>
          <span className="text-[13px] text-[var(--h-muted)]">/ {String(SLIDES.length).padStart(2, "0")}</span>
        </div>
        <div role="tablist" aria-label="Choose a highlight" className="grid flex-1 grid-cols-4 gap-1.5 sm:gap-2.5">
          {SLIDES.map((s, i) => {
            const on = i === current;
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
                    key={on ? `fill-${current}-${joinId}` : `idle-${i}`}
                    className="absolute inset-0 origin-left rounded-full bg-[var(--h-accent)]"
                    onAnimationEnd={on ? () => go(current + 1) : undefined}
                    style={{
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
        <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-[var(--h-border)] bg-[var(--h-surface-solid)] p-1 shadow-[0_6px_18px_-12px_rgba(18,35,58,0.45)]">
          <button type="button" onClick={() => go(current - 1)} aria-label="Previous highlight" className={`hidden h-9 w-9 place-items-center rounded-full text-[var(--h-text)] transition-colors hover:bg-[var(--h-faint)] sm:grid ${RING}`}>
            <CaretLeft size={17} weight="bold" aria-hidden />
          </button>
          <button type="button" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause highlights" : "Play highlights"} className={`grid h-9 w-9 place-items-center rounded-full bg-[var(--h-text)] text-[var(--h-surface-solid)] transition-transform hover:scale-105 ${RING}`}>
            {playing ? <Pause size={15} weight="fill" aria-hidden /> : <Play size={15} weight="fill" aria-hidden />}
          </button>
          <button type="button" onClick={() => go(current + 1)} aria-label="Next highlight" className={`hidden h-9 w-9 place-items-center rounded-full text-[var(--h-text)] transition-colors hover:bg-[var(--h-faint)] sm:grid ${RING}`}>
            <CaretRight size={17} weight="bold" aria-hidden />
          </button>
        </div>
      </div>
      <style>{`@keyframes hmFill { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </section>
  );
}
