"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus } from "@phosphor-icons/react";
import { ALL_FAQS } from "@features/info/faqs/faqContent";
import { Eyebrow, RING, RISE } from "./brandKit";
import { HOME_FAQ_IDS } from "../homeData";

const ITEMS = HOME_FAQ_IDS.map((id) => ALL_FAQS.find((f) => f.id === id)).filter(Boolean);

/** A few common questions, one open at a time, with a way to all of them. */
export default function HomeFaq() {
  const reduce = useReducedMotion();
  const base = useId();
  const [open, setOpen] = useState(ITEMS[0]?.id ?? null);

  return (
    <section aria-labelledby="hm-faq" className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>Questions</Eyebrow>
          <h2 id="hm-faq" className="mt-4 text-[clamp(2.1rem,5vw,3.4rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--h-text)]">
            Asked before you asked.
          </h2>
          <Link href="/info/faqs" className={`group mt-6 inline-flex h-12 items-center gap-2 rounded-full border-2 border-[var(--h-border)] px-5 text-[15px] font-bold text-[var(--h-text)] transition-colors hover:border-[var(--h-text)] ${RING}`}>
            All questions
            <ArrowRight size={17} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="divide-y divide-[var(--h-border)] border-y border-[var(--h-border)]">
          {ITEMS.map((item) => {
            const on = open === item.id;
            const panel = `${base}-${item.id}`;
            return (
              <li key={item.id}>
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={panel} onClick={() => setOpen(on ? null : item.id)} className={`flex w-full items-center justify-between gap-4 py-5 text-left text-[17px] font-bold text-[var(--h-text)] sm:text-[19px] ${RING} rounded-lg`}>
                    {item.q}
                    <motion.span aria-hidden animate={{ rotate: on ? 45 : 0 }} transition={{ duration: reduce ? 0 : 0.3, ease: RISE }} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors ${on ? "bg-[var(--h-accent)] text-[var(--h-on-accent)]" : "bg-[var(--h-faint)]"}`}>
                      <Plus size={16} weight="bold" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on ? (
                    <motion.div id={panel} key="a" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease: RISE }} className="overflow-hidden">
                      <div className="max-w-[60ch] pb-6 text-[15.5px] leading-relaxed text-[var(--h-muted)]">
                        {item.a}
                        {item.link ? (
                          <>
                            {" "}
                            <Link href={item.link.href} className={`rounded font-bold text-[var(--h-text)] underline decoration-2 underline-offset-4 ${RING}`}>
                              {item.link.label}
                            </Link>
                          </>
                        ) : null}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
