"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Simple, dependency-free slider inspired by the provided design
export default function HeroSlider({ darkMode = true }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // Typing text 
  const words = useMemo(() => ["UniShare", "your campus", "your community", "your college"], []);
  const [typed, setTyped] = useState("");
  const [wIndex, setWIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [delay, setDelay] = useState(80); // slower typing for readability

  useEffect(() => {
    const current = words[wIndex % words.length];
    const isFull = typed === current;
    const isEmpty = typed.length === 0;

    // adjust delay dynamically
  if (!deleting) setDelay(80); // typing speed (slower)
  else setDelay(65); // deleting speed (slower)
  if (isFull && !deleting) setDelay(900); // longer pause at full word
  if (isEmpty && deleting) setDelay(300); // longer pause before next word

    const timeout = setTimeout(() => {
      if (!deleting) {
        if (!isFull) setTyped(current.slice(0, typed.length + 1));
        else setDeleting(true);
      } else {
        if (!isEmpty) setTyped(current.slice(0, typed.length - 1));
        else {
          setDeleting(false);
          setWIndex((i) => (i + 1) % words.length);
        }
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [typed, deleting, wIndex, words, delay]);

  const slides = useMemo(
    () => [
      {
        id: "spend-lens",
        headline: "Discover more on campus with UniShare!",
        sub: "Share rides, buy & sell, find housing, and swap notes — all in one place.",
        cta: { label: "Get Started", href: "/" },
        bgClass: "bg-[#F8C821]",
        // local public icons used to mimic the logo bubbles
        bubbles: [
          { src: "/globe.svg", size: 52, top: 22, left: 58 },
          { src: "/next.svg", size: 52, top: 10, left: 70 },
          { src: "/vercel.svg", size: 44, top: 34, left: 77 },
          { src: "/window.svg", size: 56, top: 46, left: 64 },
          { src: "/file.svg", size: 48, top: 62, left: 73 },
          { src: "/globe.svg", size: 48, top: 72, left: 86 },
          { src: "/vercel.svg", size: 44, top: 18, left: 86 },
        ],
      },
      {
        id: "campus-deals",
        headline: "Find the Best Campus Deals, Effortlessly",
        sub: "Compare prices on items students actually buy.",
        cta: { label: "Browse Deals", href: "/marketplace/buy" },
        bgClass: darkMode ? "bg-gradient-to-br from-blue-600 to-sky-500" : "bg-gradient-to-br from-blue-500 to-cyan-400",
        bubbles: [
          { src: "/vercel.svg", size: 48, top: 18, left: 62 },
          { src: "/globe.svg", size: 52, top: 28, left: 82 },
          { src: "/next.svg", size: 56, top: 56, left: 70 },
          { src: "/window.svg", size: 44, top: 68, left: 88 },
        ],
      },
      {
        id: "smart-ride",
        headline: "Share Rides. Save Money. Meet People.",
        sub: "Post or find rides and split fares easily.",
        cta: { label: "Find a Ride", href: "/share-ride" },
        bgClass: darkMode ? "bg-gradient-to-br from-emerald-600 to-green-500" : "bg-gradient-to-br from-emerald-500 to-green-400",
        bubbles: [
          { src: "/globe.svg", size: 52, top: 20, left: 75 },
          { src: "/file.svg", size: 48, top: 36, left: 60 },
          { src: "/window.svg", size: 44, top: 68, left: 80 },
        ],
      },
      {
        id: "study-notes",
        headline: "Study smarter with peer-shared notes",
        sub: "Find and share notes to ace your next exam.",
        cta: { label: "Explore Notes", href: "/notes" },
        bgClass: darkMode ? "bg-gradient-to-br from-violet-600 to-fuchsia-500" : "bg-gradient-to-br from-violet-500 to-fuchsia-400",
        bubbles: [
          { src: "/file.svg", size: 52, top: 26, left: 70 },
          { src: "/globe.svg", size: 48, top: 44, left: 82 },
          { src: "/next.svg", size: 44, top: 66, left: 62 },
        ],
      },
      {
        id: "housing",
        headline: "Find rooms and roommates near campus",
        sub: "Filter by budget, location, and preferences.",
        cta: { label: "Find Housing", href: "/housing" },
        bgClass: darkMode ? "bg-gradient-to-br from-amber-500 to-orange-500" : "bg-gradient-to-br from-amber-400 to-orange-400",
        bubbles: [
          { src: "/window.svg", size: 56, top: 30, left: 78 },
          { src: "/vercel.svg", size: 44, top: 60, left: 64 },
          { src: "/globe.svg", size: 48, top: 72, left: 86 },
        ],
      },
    ],
    [darkMode]
  );

  // autoplay (faster)
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (isHovering || paused) return; // pause on hover or manual interaction
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 2800);
    return () => clearInterval(id);
  }, [slides.length, isHovering, paused]);

  // manual controls
  const pauseAfterInteraction = () => {
    setPaused(true);
    setTimeout(() => setPaused(false), 5000);
  };
  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    pauseAfterInteraction();
  };
  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length);
    pauseAfterInteraction();
  };

  const goTo = (i) => setIndex(i % slides.length);

  return (
  <section className="w-full"> 
  <div className={`max-w-6xl mx-auto px-4 sm:px-6 pt-0 sm:pt-1 pb-4 sm:pb-6 ${darkMode ? '' : 'bg-blue-50/60'}`}> 

  {/* Slider */}
        <div
          className="relative mt-6 sm:mt-8"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Track */}
          <div ref={containerRef} className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((s) => (
                <div key={s.id} className="w-full flex-shrink-0">
                  <div className={`${s.bgClass} relative rounded-2xl min-h-[220px] sm:min-h-[300px] md:min-h-[360px] p-5 sm:p-8 md:p-10 overflow-hidden`}> 
                    {/* Content */}
                    <div className="max-w-xl">
                      <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                        {s.headline}
                      </h2>
                      <p className="mt-2 sm:mt-3 text-gray-900/80 text-xs sm:text-sm md:text-base max-w-md">{s.sub}</p>
                      <div className="mt-4 sm:mt-6">
                        <Link
                          href={s.cta.href}
                          className="inline-block bg-[#5B46F6] hover:bg-[#4a38e5] text-white font-semibold px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl shadow-md transition-colors"
                        >
                          {s.cta.label}
                        </Link>
                      </div>
                    </div>

                    {/* Bubbles on right */}
                    <div className="pointer-events-none absolute inset-0">
                      {s.bubbles.map((b, i) => (
                        <div
                          key={i}
                          className={`absolute rounded-full bg-white/80 backdrop-blur-sm shadow-md items-center justify-center ${i > 2 ? 'hidden sm:flex' : 'flex'}`}
                          style={{ top: `${b.top}%`, left: `${b.left}%`, width: b.size, height: b.size }}
                        >
                          <Image src={b.src} alt="icon" width={b.size - 16} height={b.size - 16} className="opacity-90" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
                className="relative"
              >
                <span
                  className={`block rounded-full transition-all ${
                    i === index ? "bg-[#5B46F6]" : darkMode ? "bg-gray-500" : "bg-gray-400"
                  }`}
                  style={{ width: i === index ? 7 : 5, height: i === index ? 7 : 5 }}
                />
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
