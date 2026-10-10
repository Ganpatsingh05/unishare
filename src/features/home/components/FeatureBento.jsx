"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";
import { FEATURES } from "@components/layout/header/navConfig";
import { SCENES } from "./featureScenes";
import { BrandInk, Eyebrow, RING, RISE } from "./brandKit";
import { TOUR } from "../homeData";

const STOP = Object.fromEntries(TOUR.map((t) => [t.key, t]));
// Desktop bento: the two biggest stories lead, the rest fill the rows below.
const SPAN = {
  rides: "lg:col-span-7",
  rooms: "lg:col-span-5",
  market: "lg:col-span-4",
  tickets: "lg:col-span-4",
  lostfound: "lg:col-span-4",
  announcements: "lg:col-span-5",
  resources: "lg:col-span-4",
  contacts: "lg:col-span-3",
};
const BIG = new Set(["rides", "rooms"]);
// Where the flood starts: about the centre of the scene.
const FLOOD_AT = "84% 16%";

/**
 * One feature tile. Hover or focus floods it with the feature's colour from
 * the scene outward, and the scene starts to play.
 */
function Tile({ f, n, dark, reduce }) {
  const [hot, setHot] = useState(false);
  const stop = STOP[f.key];
  const Scene = SCENES[f.key];
  const big = BIG.has(f.key);
  const ink = f.ink[dark ? 1 : 0];
  const deep = f.ink[0];
  const [main, extra] = stop.actions;
  const on = hot && !reduce;
  const textOn = hot;

  return (
    <motion.article
      className={`group relative isolate flex min-h-[290px] flex-col overflow-hidden rounded-[30px] border border-[var(--h-border)] bg-[var(--h-surface-solid)] p-6 shadow-[0_24px_50px_-40px_rgba(18,35,58,0.5)] sm:col-span-1 ${big ? "md:col-span-2 lg:min-h-[400px] lg:p-8" : ""} ${SPAN[f.key]}`}
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, ease: RISE, delay: (n % 3) * 0.08 }}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHot(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setHot(false)}
    >
      {/* The flood. */}
      <motion.div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ backgroundColor: deep }}
        initial={false}
        animate={{ clipPath: hot ? `circle(150% at ${FLOOD_AT})` : `circle(0% at ${FLOOD_AT})` }}
        transition={{ duration: reduce ? 0 : 0.7, ease: RISE }}
      />

      <div className="relative flex flex-1 flex-col transition-colors duration-500" style={{ color: textOn ? "#FFFFFF" : "var(--h-text)" }}>
        {/* Number and name on the left, the scene on the right. */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <span aria-hidden className="block text-[44px] font-extrabold leading-none tracking-[-0.04em] tabular-nums" style={{ WebkitTextStroke: `1.5px ${textOn ? "rgba(255,255,255,0.7)" : ink}`, color: "transparent" }}>
              {String(n + 1).padStart(2, "0")}
            </span>
            <p className="mt-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] transition-colors duration-500" style={{ color: textOn ? "rgba(255,255,255,0.85)" : ink }}>
              {f.label}
            </p>
          </div>
          <div
            className={`aspect-square shrink-0 rounded-full p-[5%] transition-colors duration-500 ${big ? "w-[140px] lg:w-[170px]" : "w-[104px]"}`}
            style={{ backgroundColor: textOn ? "rgba(255,255,255,0.14)" : `${deep}1A` }}
          >
            <div className="h-full w-full rounded-full p-[6%]" style={{ backgroundColor: textOn ? "transparent" : deep, transition: "background-color 400ms" }}>
              <Scene c={f.ink[1]} still={!on} />
            </div>
          </div>
        </div>
        <h3 className={`mt-3 font-extrabold leading-[1.12] tracking-[-0.025em] ${big ? "max-w-[20ch] text-[clamp(1.5rem,2.4vw,2.1rem)]" : "max-w-[24ch] text-[20px]"}`}>{stop.title}</h3>
        <p className={`mt-2.5 text-[15px] leading-relaxed transition-colors duration-500 ${big ? "max-w-[36ch]" : ""}`} style={{ color: textOn ? "rgba(255,255,255,0.85)" : "var(--h-muted)" }}>
          {stop.body}
        </p>

        {big ? (
          <ol className="mt-5 flex flex-wrap gap-2">
            {stop.steps.map((s, k) => (
              <li key={s} className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors duration-500" style={{ borderColor: textOn ? "rgba(255,255,255,0.35)" : "var(--h-border)" }}>
                <span className="grid h-5 w-5 place-items-center rounded-full text-[11px] font-extrabold" style={{ backgroundColor: textOn ? "#FFFFFF" : deep, color: textOn ? deep : "#FFFFFF" }}>
                  {k + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6">
          <Link
            href={main.href}
            className={`group/btn inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14.5px] font-extrabold transition-colors duration-500 ${RING}`}
            style={{ backgroundColor: textOn ? "#FFFFFF" : deep, color: textOn ? deep : "#FFFFFF" }}
          >
            {main.label}
            <ArrowRight size={16} weight="bold" aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
          {extra ? (
            <Link href={extra.href} className={`rounded-full text-[14.5px] font-bold underline decoration-2 underline-offset-4 ${RING}`} style={{ textDecorationColor: textOn ? "rgba(255,255,255,0.5)" : "var(--h-border)" }}>
              {extra.label}
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}

/** Phones: a compact square for each feature; the whole square is the link. */
function Square({ f, n, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.7 });
  const Scene = SCENES[f.key];
  return (
    <motion.li ref={ref} initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: RISE, delay: (n % 2) * 0.06 }}>
      <Link href={f.href} className={`relative flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--h-border)] bg-[var(--h-surface-solid)] active:scale-[0.98] ${RING} transition-transform`}>
        <div className="relative aspect-[5/4] p-3" style={{ backgroundColor: f.ink[0] }}>
          <span aria-hidden className="absolute left-3 top-2.5 text-[13px] font-extrabold tabular-nums text-white/70">{String(n + 1).padStart(2, "0")}</span>
          <ArrowUpRight size={16} weight="bold" aria-hidden className="absolute right-3 top-3 text-white/80" />
          <div className="mx-auto aspect-square h-full">
            <Scene c={f.ink[1]} still={reduce || !inView} />
          </div>
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          <span className="text-[15.5px] font-extrabold leading-tight text-[var(--h-text)]">{f.label}</span>
          <span className="mt-1 text-[13px] leading-snug text-[var(--h-muted)]">{f.desc}</span>
        </div>
      </Link>
    </motion.li>
  );
}

/** All eight features, each on its own: a bento on wider screens, squares on phones. */
export default function FeatureBento({ dark }) {
  const reduce = useReducedMotion();
  return (
    <section id="features" aria-labelledby="hm-features" className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 sm:px-6">
      <div className="grid items-end gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div>
          <Eyebrow>Eight ways to share</Eyebrow>
          <h2 id="hm-features" className="mt-4 text-[clamp(2.1rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--h-text)]">
            Everything campus asks for. <BrandInk dark={dark}>One handshake away.</BrandInk>
          </h2>
        </div>
        <p className="max-w-[30rem] text-[16.5px] leading-relaxed text-[var(--h-muted)] lg:justify-self-end lg:pb-2">
          From a seat home to a sheet of notes, each corner of UniShare does one job well. Pick where you want to start.
        </p>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-3 sm:hidden">
        {FEATURES.map((f, n) => (
          <Square key={f.key} f={f} n={n} reduce={reduce} />
        ))}
      </ul>

      <div className="mt-12 hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
        {FEATURES.map((f, n) => (
          <Tile key={f.key} f={f} n={n} dark={dark} reduce={reduce} />
        ))}
      </div>
    </section>
  );
}
