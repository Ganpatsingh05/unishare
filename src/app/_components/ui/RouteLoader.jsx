"use client";

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";

export default function RouteLoader({ variant = "default", label }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");
  const [dots, setDots] = useState("");

  const theme = useMemo(() => {
    switch (variant) {
      case "resources":
        return {
          bgDark: "from-emerald-900 via-emerald-950 to-emerald-900",
          bgLight: "from-emerald-50 via-white to-emerald-50",
          glow: "from-emerald-400 via-teal-400 to-cyan-400",
          bar: "from-emerald-400 via-teal-400 to-cyan-400",
          spinner: "border-emerald-400",
          textDark: "text-emerald-100",
        };
      case "marketplace-buy":
        return {
          bgDark: "from-amber-900 via-amber-950 to-amber-900",
          bgLight: "from-amber-50 via-white to-amber-50",
          glow: "from-amber-300 via-orange-400 to-pink-400",
          bar: "from-amber-300 via-orange-400 to-pink-400",
          spinner: "border-amber-300",
          textDark: "text-amber-100",
        };
      case "marketplace-sell":
        return {
          bgDark: "from-fuchsia-900 via-purple-950 to-fuchsia-900",
          bgLight: "from-fuchsia-50 via-white to-fuchsia-50",
          glow: "from-fuchsia-400 via-purple-400 to-pink-400",
          bar: "from-fuchsia-400 via-purple-400 to-pink-400",
          spinner: "border-fuchsia-400",
          textDark: "text-fuchsia-100",
        };
      case "lost-found":
        return {
          bgDark: "from-cyan-900 via-slate-950 to-cyan-900",
          bgLight: "from-cyan-50 via-white to-cyan-50",
          glow: "from-cyan-400 via-sky-400 to-blue-400",
          bar: "from-cyan-400 via-sky-400 to-blue-400",
          spinner: "border-cyan-300",
          textDark: "text-cyan-100",
        };
      case "lost-found-view":
      case "lost-found-found":
        return {
          bgDark: "from-sky-900 via-slate-950 to-sky-900",
          bgLight: "from-sky-50 via-white to-sky-50",
          glow: "from-sky-400 via-cyan-400 to-blue-400",
          bar: "from-sky-400 via-cyan-400 to-blue-400",
          spinner: "border-sky-300",
          textDark: "text-sky-100",
        };
      case "lost-found-report":
        return {
          bgDark: "from-rose-900 via-rose-950 to-rose-900",
          bgLight: "from-rose-50 via-white to-rose-50",
          glow: "from-rose-400 via-orange-400 to-amber-300",
          bar: "from-rose-400 via-orange-400 to-amber-300",
          spinner: "border-rose-400",
          textDark: "text-rose-100",
        };
      default:
        return {
          bgDark: "from-gray-900 via-gray-950 to-gray-900",
          bgLight: "from-white via-slate-50 to-white",
          glow: "from-emerald-400 via-blue-400 to-purple-400",
          bar: "from-emerald-400 via-blue-400 to-purple-400",
          spinner: "border-emerald-400",
          textDark: "text-white",
        };
    }
  }, [variant, label]);

  // Background fixed to the same dark gradient across pages

  useEffect(() => {
    let aborted = false;
    // Ensure loader shows at least this long
  const minTimer = setTimeout(() => setMinElapsed(true), 1500);
    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
  // Keep static 'Loading' text; only animate dots
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : Math.min(100, p + 2)));
    }, 120);
    (async () => {
      try {
          async function fetchLottie() {
            // Try the public file first
            try {
              const res = await fetch("/loadnav.json", { cache: "force-cache" });
              if (res.ok) {
                const json = await res.json();
                const looksLikeLottie = json && (json.v || json.layers || json.assets);
                if (looksLikeLottie) return json;
              }
            } catch {}
            // Fallback to API which can read root or public file
            try {
              const res = await fetch("/api/loadnav", { cache: "no-store" });
              if (res.ok) {
                const json = await res.json();
                const looksLikeLottie = json && (json.v || json.layers || json.assets);
                if (looksLikeLottie) return json;
              }
            } catch {}
            throw new Error("Missing or invalid loadnav.json");
          }

          const json = await fetchLottie();
          setData(json);
      } catch (_) {
        if (!aborted) setError(true);
      }
    })();
    return () => {
      aborted = true;
  clearTimeout(minTimer);
      clearInterval(dotsInterval);
  // no text interval to clear
      clearInterval(progressInterval);
    };
  }, []);

  return (
  <div className={`fixed inset-0 z-[70] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 backdrop-blur-sm`}>
      <div className="relative z-10 text-center">
        {/* Animation container without frame */}
        <div className="mb-8 relative">
          <div className="w-[22rem] h-[22rem] sm:w-[26rem] sm:h-[26rem] md:w-[30rem] md:h-[30rem] mx-auto mb-6 flex items-center justify-center">
            {data && !error ? (
              <Lottie
                animationData={data}
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
                // @ts-ignore - lottie-react supports speed via props in recent versions
                speed={0.35}
              />
            ) : (
              <div className={`animate-spin w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 ${theme.spinner} border-t-transparent`} />
            )}
          </div>
          {/* Popping circular lines from center */}
          <div className="pointer-events-none absolute inset-0">
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-ping w-[20rem] h-[20rem]`} style={{ animationDelay: "0ms", animationDuration: "2.2s" }} />
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-ping w-[26rem] h-[26rem]`} style={{ animationDelay: "400ms", animationDuration: "2.6s" }} />
            <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15 animate-ping w-[32rem] h-[32rem]`} style={{ animationDelay: "800ms", animationDuration: "3s" }} />
          </div>
        </div>

        {/* Loading text */}
  <h2 className={`text-xl sm:text-2xl font-bold text-white mb-6`}>{loadingText}{dots}</h2>

        {/* Progress bar */}
        <div className="w-56 sm:w-64 mx-auto">
          <div className={`bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm`}>
            <div
              className={`bg-gradient-to-r ${theme.bar} h-full rounded-full transition-all duration-100 ease-out shadow-lg`}
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Percentage text removed as requested */}
        </div>
      </div>
    </div>
  );
}
