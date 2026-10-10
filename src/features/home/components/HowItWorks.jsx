"use client";

import { useMemo, useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import LottieLoop from "./LottieLoop";
import { BrandInk, Eyebrow, RISE } from "./brandKit";
import { BRAND, STEPS } from "../homeData";
import { STEP_ART } from "../homeLottie";

// The frame each animation rests on for reduced motion: the finished picture.
const REST = { signin: 100, pin: 90, meet: 100 };

/**
 * How a share happens, in three stops. A path in UniShare blue draws
 * itself between them as you scroll: across on wide screens, down on phones.
 */
export default function HowItWorks({ dark }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const drawn = reduce ? 1 : progress;
  const art = useMemo(() => Object.fromEntries(STEPS.map((s) => [s.art, STEP_ART[s.art]()])), []);

  return (
    <section ref={ref} aria-labelledby="hm-how" className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="text-center">
        <Eyebrow className="justify-center">How it works</Eyebrow>
        <h2 id="hm-how" className="mx-auto mt-4 max-w-[18ch] text-[clamp(2.1rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--h-text)]">
          Three steps from <BrandInk dark={dark} tone="magenta">need to sorted.</BrandInk>
        </h2>
      </div>

      <div className="relative mt-12 lg:mt-16">
        {/* Desktop: a wave from stop to stop through the middle of each picture. */}
        <svg aria-hidden viewBox="0 0 1000 120" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-[8%] top-[60px] hidden h-[120px] w-[84%] -translate-y-1/2 overflow-visible lg:block">
          <path d="M 0 60 C 160 -20, 340 140, 500 60 S 840 -20, 1000 60" fill="none" stroke="var(--h-border)" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <motion.path d="M 0 60 C 160 -20, 340 140, 500 60 S 840 -20, 1000 60" fill="none" stroke={BRAND.blue} strokeWidth="4" strokeLinecap="round" vectorEffect="non-scaling-stroke" style={{ pathLength: drawn }} />
        </svg>
        {/* Phones and tablets: a line down the left. */}
        <span aria-hidden className="absolute bottom-10 left-[44px] top-10 w-[3px] rounded-full bg-[var(--h-border)] lg:hidden" />
        <motion.span aria-hidden className="absolute bottom-10 left-[44px] top-10 w-[3px] origin-top rounded-full lg:hidden" style={{ scaleY: drawn, backgroundColor: BRAND.blue }} />

        <ol className="relative grid gap-8 lg:grid-cols-3 lg:gap-10">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.art}
              className="flex gap-5 lg:flex-col lg:items-center lg:text-center"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: RISE, delay: i * 0.12 }}
            >
              <div className="relative shrink-0">
                <div className="grid h-[90px] w-[90px] place-items-center rounded-full border-4 border-[var(--h-surface-solid)] shadow-[var(--h-shadow)] lg:h-[132px] lg:w-[132px]" style={{ backgroundColor: `color-mix(in srgb, ${s.tint} 22%, var(--h-surface-solid))` }}>
                  <LottieLoop data={art[s.art]} rest={REST[s.art]} className="h-[78%] w-[78%]" />
                </div>
                <span className="absolute -right-1 -top-1 grid h-8 w-8 place-items-center rounded-full text-[13px] font-extrabold shadow-md lg:h-9 lg:w-9" style={{ backgroundColor: s.tint, color: s.tint === BRAND.yellow ? BRAND.navy : "#FFFFFF" }}>
                  {i + 1}
                </span>
              </div>
              <div className="pt-2 lg:pt-6">
                <h3 className="text-[22px] font-extrabold tracking-[-0.02em] text-[var(--h-text)] lg:text-[26px]">{s.title}</h3>
                <p className="mt-2 max-w-[32ch] text-[15.5px] leading-relaxed text-[var(--h-muted)] lg:mx-auto">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
