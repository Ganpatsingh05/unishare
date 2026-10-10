"use client";

import Image from "next/image";
import { featureByKey } from "@components/layout/header/navConfig";
import { BRAND, TICKER } from "../homeData";

const LOOKS = [
  { bg: BRAND.navy, text: "#FFFFFF", tilt: "-2.2deg", speed: 46, dir: "normal", ink: 1 },
  { bg: BRAND.yellow, text: BRAND.navy, tilt: "1.6deg", speed: 54, dir: "reverse", ink: 0 },
];

function Row({ items, look }) {
  return (
    <ul className="hm-ribbon-row flex shrink-0 items-center" style={{ animationDuration: `${look.speed}s`, animationDirection: look.dir }}>
      {items.map((item) => {
        const f = featureByKey[item.k];
        return (
          <li key={item.t} className="flex shrink-0 items-center">
            <span className="whitespace-nowrap px-5 text-[15px] font-bold sm:text-[17px]">{item.t}</span>
            <span className="rounded-full px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.12em]" style={{ backgroundColor: f.ink[look.ink], color: look.ink ? BRAND.navy : "#FFFFFF" }}>
              {f.label}
            </span>
            <Image src="/images/logos/logounishare1.png" alt="" width={22} height={22} className="mx-5 h-[22px] w-[22px] rounded-full bg-white object-contain p-[2px]" />
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Two brand ribbons crossing the page in opposite directions, carrying the
 * everyday things students share. Pauses on hover; stands still for reduced
 * motion. The visible text is a list a screen reader can read once.
 */
export default function BrandRibbons() {
  return (
    <section aria-labelledby="hm-ribbons" className="relative overflow-hidden py-12 sm:py-16">
      <h2 id="hm-ribbons" className="sr-only">
        Things students share on UniShare
      </h2>
      <div className="hm-ribbons relative">
        {TICKER.map((row, r) => {
          const look = LOOKS[r];
          return (
            <div
              key={r}
              className={`relative -mx-[5%] flex w-[110%] overflow-hidden py-3.5 shadow-[0_18px_30px_-22px_rgba(18,35,58,0.6)] sm:py-4 ${r ? "-mt-[50px] sm:-mt-[58px]" : "z-10"}`}
              style={{ backgroundColor: look.bg, color: look.text, transform: `rotate(${look.tilt})` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} aria-hidden={copy === 1 || undefined} className="flex shrink-0">
                  <Row items={row} look={look} />
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes hmRibbon { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        .hm-ribbon-row { animation-name: hmRibbon; animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        @media (prefers-reduced-motion: reduce) { .hm-ribbon-row { animation: none; } }
      `}</style>
    </section>
  );
}
