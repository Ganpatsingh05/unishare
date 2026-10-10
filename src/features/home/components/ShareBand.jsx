"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import LottieLoop from "./LottieLoop";
import { BRAND } from "../homeData";
import { confetti } from "../homeLottie";

const ACTIONS = [
  { label: "Offer a ride", href: "/share-ride/postride", feature: "rides" },
  { label: "Sell an item", href: "/marketplace/sell", feature: "market" },
  { label: "List a room", href: "/housing/post", feature: "rooms" },
  { label: "Sell a ticket", href: "/ticket/sell", feature: "tickets" },
  { label: "Report lost or found", href: "/lost-found/report", feature: "lostfound" },
  { label: "Post an announcement", href: "/announcements/submit", feature: "announcements" },
];
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[#12233A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFD24C]";
const MEET = [0.65, 0, 0.35, 1];

/** The logo in two halves that slide together and shake hands, then confetti. */
function Handshake({ reduce }) {
  const ref = useRef(null);
  const met = useInView(ref, { once: true, amount: 0.6 });
  const burst = useMemo(() => confetti(), []);
  const half = (side) => ({
    initial: reduce ? false : { x: side * 56, rotate: side * 10 },
    animate: met || reduce ? { x: 0, rotate: 0 } : undefined,
    transition: { duration: 1, ease: MEET },
  });
  return (
    <div ref={ref} aria-hidden className="relative mx-auto h-[150px] w-[150px] rounded-full bg-white shadow-[0_20px_40px_-20px_rgba(18,35,58,0.5)] sm:h-[180px] sm:w-[180px]">
      <div className="absolute inset-[17%]">
        <motion.div className="absolute inset-0 [clip-path:inset(-20%_50%_-20%_-60%)]" {...half(-1)}>
          <Image src="/images/logos/logounishare1.png" alt="" fill sizes="120px" className="object-contain" />
        </motion.div>
        <motion.div className="absolute inset-0 [clip-path:inset(-20%_-60%_-20%_50%)]" {...half(1)}>
          <Image src="/images/logos/logounishare1.png" alt="" fill sizes="120px" className="object-contain" />
        </motion.div>
      </div>
      {met && !reduce ? <LottieLoop data={burst} loop={false} className="pointer-events-none absolute -inset-[60%]" /> : null}
    </div>
  );
}

/**
 * Closing band in solid UniShare yellow with navy type. Signed in: one tap to
 * each thing you can post. Signed out: sign in or keep looking around.
 */
export default function ShareBand({ signedIn }) {
  const reduce = useReducedMotion();
  return (
    <section aria-labelledby="hm-join" className="mx-auto w-full max-w-[1320px] px-3 sm:px-6">
      <div className="relative overflow-hidden rounded-[32px] px-6 py-10 sm:px-10 lg:rounded-[40px] lg:px-14 lg:py-14" style={{ backgroundColor: BRAND.yellow, color: BRAND.navy }}>
        {/* Two flat circles for shape, as before: no blur, no blend. */}
        <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-[260px] w-[260px] rounded-full" style={{ backgroundColor: BRAND.yellowDeep, opacity: 0.3 }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-28 left-[38%] h-[200px] w-[200px] rounded-full border-[16px]" style={{ borderColor: BRAND.navy, opacity: 0.07 }} />

        <div className="relative grid items-center gap-10 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <Handshake reduce={reduce} />

          <div className="text-center lg:text-left">
            <h2 id="hm-join" className="text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[1.04] tracking-[-0.035em]">Got something to share?</h2>
            <p className="mx-auto mt-3 max-w-[30rem] text-[16.5px] font-medium leading-relaxed lg:mx-0">
              {signedIn ? "Pick what you want to post. It takes about a minute." : "Sign in and post your first ride, room or item. It's free."}
            </p>
          </div>

          {signedIn ? (
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {ACTIONS.map((a) => (
                <li key={a.href}>
                  <Link href={a.href} className={`group flex min-h-[54px] items-center gap-3 rounded-[18px] bg-white px-4 text-[15.5px] font-bold shadow-[0_3px_0_rgba(18,35,58,0.14)] transition-transform hover:-translate-y-0.5 ${RING}`} style={{ color: BRAND.navy }}>
                    <span aria-hidden className="h-7 w-1 shrink-0 rounded-full" style={{ backgroundColor: featureByKey[a.feature].ink[0] }} />
                    <span className="flex-1">{a.label}</span>
                    <ArrowRight size={18} weight="bold" aria-hidden className="shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              <Link href="/login" className={`group inline-flex h-14 items-center gap-2 rounded-full px-7 text-[16px] font-extrabold text-white transition-transform hover:-translate-y-0.5 ${RING}`} style={{ backgroundColor: BRAND.navy }}>
                Sign in, it's free
                <ArrowRight size={18} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="#features" className={`inline-flex h-14 items-center rounded-full border-2 px-7 text-[16px] font-bold transition-colors hover:bg-white/40 ${RING}`} style={{ borderColor: BRAND.navy, color: BRAND.navy }}>
                Look around first
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
