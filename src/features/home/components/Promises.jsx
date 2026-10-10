"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck } from "@phosphor-icons/react";
import { BrandInk, Eyebrow, RING, RISE, UArms, U_RADIUS } from "./brandKit";
import { BRAND, PROMISES } from "../homeData";

/**
 * What UniShare promises, beside the mascot waving from inside the logo's U.
 * Ends with the honest bit: nobody's ID is checked, so meet in public.
 */
export default function Promises({ dark }) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hm-promise" className="mx-auto w-full max-w-[1320px] px-4 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* The mascot in the U. */}
        <div className="relative mx-auto w-full max-w-[420px] px-[12px] pb-6 lg:max-w-[480px]">
          <div className="relative">
            <UArms width={12} />
            <div className="relative m-[16px] aspect-[4/4.4] overflow-hidden" style={{ borderRadius: U_RADIUS, backgroundColor: BRAND.yellow }}>
              <div aria-hidden className="absolute inset-0 opacity-40 [background-image:radial-gradient(rgba(18,35,58,0.18)_1.2px,transparent_1.2px)] [background-size:20px_20px]" />
              <motion.div
                className="absolute inset-x-[-2%] bottom-[-3%] top-[24%]"
                initial={reduce ? false : { y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                <motion.div className="relative h-full w-full" animate={reduce ? undefined : { y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                  <Image src="/images/cards/mascot_girl.png" alt="A smiling student in a UniShare hoodie waving hello" fill sizes="(min-width: 1024px) 480px, 90vw" className="object-contain object-bottom" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        <div>
          <Eyebrow>Why UniShare</Eyebrow>
          <h2 id="hm-promise" className="mt-4 text-[clamp(2.1rem,5vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-[var(--h-text)]">
            Built like a handshake. <BrandInk dark={dark} tone="magenta">Simple, and between you.</BrandInk>
          </h2>

          <dl className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {PROMISES.map((p, i) => (
              <motion.div
                key={p.title}
                className="border-t-2 border-[var(--h-border)] pt-5"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, ease: RISE, delay: i * 0.08 }}
              >
                <dt>
                  <span className="block text-[clamp(2.4rem,4.4vw,3.4rem)] font-extrabold leading-none tracking-[-0.045em]" style={{ color: [BRAND.blue, BRAND.magenta, dark ? BRAND.yellow : BRAND.yellowDeep, dark ? BRAND.sky : BRAND.blue][i] }}>
                    {p.big}
                  </span>
                  <span className="mt-3 block text-[18px] font-extrabold text-[var(--h-text)]">{p.title}</span>
                </dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-[var(--h-muted)]">{p.body}</dd>
              </motion.div>
            ))}
          </dl>

          <p className="mt-9 flex items-start gap-3 rounded-[20px] border border-[var(--h-border)] bg-[var(--h-surface-solid)] p-4 text-[14.5px] leading-relaxed text-[var(--h-muted)]">
            <ShieldCheck size={24} weight="duotone" aria-hidden className="mt-0.5 shrink-0" style={{ color: dark ? BRAND.sky : BRAND.blue }} />
            <span>
              UniShare doesn't check student IDs, so treat anyone new like any stranger: meet somewhere public on campus and check things before you pay.{" "}
              <Link href="/info/support-guidelines" className={`whitespace-nowrap rounded font-bold text-[var(--h-text)] underline decoration-2 underline-offset-4 ${RING}`}>
                Safety guidelines
              </Link>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
