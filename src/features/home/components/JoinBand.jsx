"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { featureByKey } from "@components/layout/header/navConfig";
import { BRAND } from "../homeData";

const POINTS = ["Free to use", "Edit or remove your posts any time", "No ads, no tracking"];
const ACTIONS = [
  { label: "Offer a ride", href: "/share-ride/postride", feature: "rides" },
  { label: "Sell an item", href: "/marketplace/sell", feature: "market" },
  { label: "List a room", href: "/housing/post", feature: "rooms" },
  { label: "Sell a ticket", href: "/ticket/sell", feature: "tickets" },
  { label: "Report lost or found", href: "/lost-found/report", feature: "lostfound" },
  { label: "Post an announcement", href: "/announcements/submit", feature: "announcements" },
];
const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[#12233A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFD24C]";

/**
 * Closing band in solid UniShare yellow with navy type. Signed in: one tap to
 * each thing you can post. Signed out: sign in or keep looking around.
 */
export default function JoinBand({ signedIn }) {
  return (
    <section aria-labelledby="hm-join" className="mx-auto max-w-[1320px] px-3 sm:px-6">
      <div className="relative overflow-hidden rounded-[28px] px-6 py-8 sm:px-10 lg:rounded-[32px] lg:px-12 lg:py-10" style={{ backgroundColor: BRAND.yellow, color: BRAND.navy }}>
        {/* Two flat brand circles for shape, no blur or blend. */}
        <span aria-hidden className="pointer-events-none absolute -right-16 -top-20 h-[220px] w-[220px] rounded-full" style={{ backgroundColor: BRAND.yellowDeep, opacity: 0.35 }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-24 right-[30%] h-[160px] w-[160px] rounded-full border-[14px]" style={{ borderColor: BRAND.navy, opacity: 0.08 }} />

        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
          <div>
            <h2 id="hm-join" className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">Got something to share?</h2>
            <p className="mt-2 max-w-[30rem] text-[16px] font-medium leading-relaxed" style={{ color: BRAND.navy }}>
              {signedIn ? "Pick what you want to post. It takes about a minute." : "Sign in and post your first ride, room or item. It's free."}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-[13.5px] font-bold">
              {POINTS.map((p) => (
                <li key={p} className="rounded-full px-3 py-1" style={{ backgroundColor: "rgba(18,35,58,0.08)" }}>{p}</li>
              ))}
            </ul>
          </div>

          {signedIn ? (
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {ACTIONS.map((a) => {
                const f = featureByKey[a.feature];
                const ink = f.ink[0];
                return (
                  <li key={a.href}>
                    <Link href={a.href} className={`group flex min-h-[52px] items-center gap-3 rounded-[18px] bg-white px-3.5 text-[15.5px] font-bold shadow-[0_2px_0_rgba(18,35,58,0.12)] transition-transform hover:-translate-y-0.5 ${RING}`} style={{ color: BRAND.navy }}>
                      <span aria-hidden className="h-7 w-1 shrink-0 rounded-full" style={{ backgroundColor: ink }} />
                      <span className="flex-1">{a.label}</span>
                      <ArrowRight size={18} weight="bold" aria-hidden className="shrink-0 opacity-40 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href="/login" className={`group inline-flex h-[52px] items-center gap-2 rounded-full px-6 text-[16px] font-extrabold transition-transform hover:-translate-y-0.5 ${RING}`} style={{ backgroundColor: BRAND.navy, color: "#fff" }}>
                Sign in
                <ArrowRight size={18} weight="bold" aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="#features" className={`inline-flex h-[52px] items-center rounded-full border-2 px-6 text-[16px] font-bold transition-colors hover:bg-white/40 ${RING}`} style={{ borderColor: BRAND.navy, color: BRAND.navy }}>
                Look around first
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
