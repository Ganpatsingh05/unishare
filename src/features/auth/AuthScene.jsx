"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { AUTH } from "./authTheme";

/**
 * The cinematic campus-gate backdrop.
 *
 * Motion here is measured on purpose: one slow parallax, drifting motes, and the
 * gate edges parting once. The decorative layers are generated from a fixed seed
 * and the parallax is written to CSS variables through a ref, so nothing here
 * re-renders React on mouse move or differs between the server and the browser.
 */

const seededRandom = (seed) => () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
};

const MOTES = (() => {
  const random = seededRandom(20261016);
  return Array.from({ length: 20 }, () => ({
    left: Number((random() * 100).toFixed(2)),
    top: Number((16 + random() * 78).toFixed(2)),
    size: Number((1.5 + random() * 2.5).toFixed(2)),
    delay: Number((random() * 7).toFixed(2)),
    duration: Number((8 + random() * 8).toFixed(2)),
    warm: random() > 0.62,
    peak: Number((0.25 + random() * 0.45).toFixed(2)),
  }));
})();

export default function AuthScene({ opening = false, granted = false }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return undefined;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return undefined;

    let frame = 0;
    const onPointerMove = (event) => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        node.style.setProperty("--mx", (event.clientX / window.innerWidth - 0.5).toFixed(3));
        node.style.setProperty("--my", (event.clientY / window.innerHeight - 0.5).toFixed(3));
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ "--mx": 0, "--my": 0 }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes authMote {
              0%, 100% { opacity: .14; transform: translate3d(0, 0, 0) scale(1); }
              50%      { opacity: var(--peak); transform: translate3d(7px, -22px, 0) scale(1.18); }
            }
            @keyframes authHorizon {
              0%, 100% { opacity: .5; }
              50%      { opacity: .78; }
            }
            @media (prefers-reduced-motion: reduce) {
              .auth-mote, .auth-horizon { animation: none !important; }
              .auth-parallax { transform: scale(1.12) !important; }
            }
          `,
        }}
      />

      {/* Night sky behind the photograph. */}
      <div className="absolute inset-0" style={{ background: AUTH.sky }} />

      {/* Campus gate photograph, graded so the card always has contrast under it. */}
      <div
        className="auth-parallax absolute inset-0 transition-transform duration-700 ease-out"
        style={{
          transform: "translate3d(calc(var(--mx) * -16px), calc(var(--my) * -10px), 0) scale(1.12)",
        }}
      >
        <Image
          src="/images/backgrounds/campus-gate.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background: granted
              ? "linear-gradient(180deg, rgba(5,20,16,0.74) 0%, rgba(3,12,10,0.9) 100%)"
              : "linear-gradient(180deg, rgba(6,11,20,0.52) 0%, rgba(5,10,19,0.7) 46%, rgba(3,7,15,0.9) 100%)",
          }}
        />
      </div>

      {/* Warm horizon glow, the light source the brand yellow reads against. */}
      <div
        className="auth-horizon absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          animation: "authHorizon 12s ease-in-out infinite",
          background:
            "radial-gradient(120% 100% at 50% 118%, rgba(255,210,76,0.26) 0%, rgba(255,143,90,0.10) 38%, transparent 72%)",
        }}
      />

      {/* Drifting motes. */}
      <div className="absolute inset-0">
        {MOTES.map((mote, index) => (
          <span
            key={index}
            className="auth-mote absolute rounded-full"
            style={{
              left: `${mote.left}%`,
              top: `${mote.top}%`,
              width: `${mote.size}px`,
              height: `${mote.size}px`,
              background: mote.warm ? "rgba(255,210,76,0.85)" : "rgba(150,214,246,0.8)",
              boxShadow: mote.warm
                ? "0 0 8px rgba(255,210,76,0.5)"
                : "0 0 8px rgba(60,195,242,0.5)",
              "--peak": mote.peak,
              animation: `authMote ${mote.duration}s ease-in-out ${mote.delay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Gate edges: the only structural framing, and they part on success. */}
      <div
        className="absolute inset-y-0 left-0 w-[14%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: opening
            ? "translate3d(-110%, 0, 0)"
            : "translate3d(calc(var(--mx) * 22px), 0, 0)",
          background:
            "linear-gradient(90deg, rgba(2,5,12,0.86) 0%, rgba(2,5,12,0.4) 55%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-[14%] transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          transform: opening
            ? "translate3d(110%, 0, 0)"
            : "translate3d(calc(var(--mx) * 22px), 0, 0)",
          background:
            "linear-gradient(270deg, rgba(2,5,12,0.86) 0%, rgba(2,5,12,0.4) 55%, transparent 100%)",
        }}
      />

      {/* Exposure lift as the gate opens, then a clean white hand-off. */}
      <div
        className="absolute inset-0"
        style={{
          background: granted ? "radial-gradient(circle at 50% 46%, rgba(110,231,183,0.14), transparent 62%)" : "transparent",
          transition: "background 700ms ease-out",
        }}
      />
      <div
        className="absolute inset-0 bg-white"
        style={{
          opacity: opening ? 1 : 0,
          transition: "opacity 900ms ease-in 260ms",
        }}
      />
    </div>
  );
}
