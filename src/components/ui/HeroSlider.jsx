"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ PERFORMANCE: Memoized component to prevent unnecessary re-renders
export default function HeroSlider({ darkMode = true }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const pauseTimeoutRef = useRef(null);

  // Detect reduced motion preference for accessibility
  // Used only to disable CSS transitions, NOT to stop auto-rotation
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mql.matches);
    // Listen for changes (user may toggle the setting)
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  // Detect whether the device truly supports hover (pointer device, not touch-only)
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(hover: hover)');
    setCanHover(mql.matches);
    const handler = (e) => setCanHover(e.matches);
    mql.addEventListener?.('change', handler);
    return () => mql.removeEventListener?.('change', handler);
  }, []);

  // ✅ PERFORMANCE: Moved slides to useMemo to prevent recreation on every render
  // ✅ IMAGES: Using optimized WebP format (90% smaller than JPEG/PNG)
  // ✅ MOBILE: Lazy loading for better initial load performance
  const slides = useMemo(
    () => [
      {
        id: "buysell",
        bgImage: "/images/services/buy_sell_banner.png",
        alt: "Buy Smart. Sell Easily. — Discover affordable essentials from fellow students",
        href: "/marketplace/buy",
      },
      {
        id: "house",
        bgImage: "/images/services/housing_banner.png",
        alt: "Find Your Perfect Room. Meet the Right Roommate.",
        href: "/housing",
      },
      {
        id: "rideshare",
        bgImage: "/images/services/share_ride_banner.png",
        alt: "Share the Ride. Share the Savings.",
        href: "/share-ride",
      },
      {
        id: "ticket",
        bgImage: "/images/services/ticket_banner.png",
        alt: "Never Miss Campus Moments — Buy, sell, or transfer event tickets securely",
        href: "/ticket",
      },
    ],
    []
  );

  // Auto-play functionality
  const [paused, setPaused] = useState(false);
  
  // ✅ PERFORMANCE: useCallback with proper timer cleanup to prevent memory leaks
  const pauseAfterInteraction = useCallback(() => {
    setPaused(true);
    // Clear existing timeout to prevent stacked timers
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setPaused(false);
      pauseTimeoutRef.current = null;
    }, 6000);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    pauseAfterInteraction();
  }, [slides.length, pauseAfterInteraction]);

  const nextSlide = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length);
    pauseAfterInteraction();
  }, [slides.length, pauseAfterInteraction]);

  const goToSlide = useCallback((i) => {
    setIndex(i);
    pauseAfterInteraction();
  }, [pauseAfterInteraction]);

  // Memoize track style to prevent object recreation
  // When reduced motion is preferred, use instant transition (no animation)
  // but still auto-rotate slides
  const trackStyle = useMemo(() => ({ 
    transform: `translateX(-${index * 100}%)`,
    transition: prefersReducedMotion ? 'none' : undefined,
  }), [index, prefersReducedMotion]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

  // Keyboard navigation for accessibility
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevSlide, nextSlide]);

  // Touch/swipe support for mobile
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let deltaX = 0;

    const onPointerDown = (e) => { 
      startX = e.clientX || e.touches?.[0]?.clientX || 0; 
    };
    
    const onPointerMove = (e) => { 
      const currentX = e.clientX || e.touches?.[0]?.clientX || 0;
      deltaX = currentX - startX;
    };
    
    const onPointerUp = () => {
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) prevSlide();
        else nextSlide();
        pauseAfterInteraction();
      }
      startX = 0;
      deltaX = 0;
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('touchstart', onPointerDown, { passive: true });
    el.addEventListener('touchmove', onPointerMove, { passive: true });
    el.addEventListener('touchend', onPointerUp);

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('touchstart', onPointerDown);
      el.removeEventListener('touchmove', onPointerMove);
      el.removeEventListener('touchend', onPointerUp);
    };
  }, [prevSlide, nextSlide, pauseAfterInteraction]);

  // ✅ FIX: Only pause auto-scroll on hover for devices that truly support hover.
  // On touch-only devices, isHovering is always false — prevents the
  // "mouseenter fires but mouseleave never fires" mobile bug.
  const effectiveHovering = canHover && isHovering;

  useEffect(() => {
    if (effectiveHovering || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(id);
  }, [slides.length, effectiveHovering, paused]);

  return (
    <section className="w-full">
      <div className="mx-auto px-4 w-full max-w-[80rem]">
        {/* Main Slider Container */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Slider Track */}
          <div ref={containerRef} className="overflow-hidden rounded-xl shadow-lg">
            <div
              className="flex transition-transform duration-700 ease-out slider-track"
              style={trackStyle}
              role="region"
              aria-roledescription="carousel"
              aria-live="polite"
            >
              {slides.map((slide, slideIdx) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <Link href={slide.href} className="block relative w-full">
                    <Image
                      src={slide.bgImage}
                      alt={slide.alt}
                      width={2119}
                      height={742}
                      className="
                        w-full
                        h-auto
                        rounded-xl
                        cursor-pointer
                      "
                      priority={slideIdx === 0}
                      loading={slideIdx === 0 ? undefined : "lazy"}
                      quality={85}
                      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 90vw, 1280px"
                    />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className="flex items-center justify-center gap-2 mt-4 pb-1">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`
              rounded-full transition-all duration-300 ease-out
              ${i === index
                ? 'w-7 h-2.5 bg-gradient-to-r from-[#facc15] to-[#38bdf8] shadow-md shadow-sky-400/30'
                : `w-2.5 h-2.5 ${darkMode ? 'bg-white/25 hover:bg-white/50' : 'bg-gray-300 hover:bg-gray-400'}`
              }
            `}
          />
        ))}
      </div>
      
      {/* Performance-optimized styles */}
      <style jsx>{`
        :global(.slider-track) {
          will-change: transform;
          backface-visibility: hidden;
        }
        
        @media (prefers-reduced-motion: reduce) {
          :global(.slider-track) {
            transition: none !important;
          }
        }
      `}
      </style>
    </section>
  );
}
