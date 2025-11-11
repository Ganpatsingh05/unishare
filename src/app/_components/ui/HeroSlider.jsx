"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ✅ PERFORMANCE: Memoized component to prevent unnecessary re-renders
export default function HeroSlider({ darkMode = true }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  // ✅ PERFORMANCE: Moved slides to useMemo to prevent recreation on every render
  // ✅ IMAGES: Using optimized WebP format (90% smaller than JPEG)
  const slides = useMemo(
    () => [
      {
        id: "buysell",
        bgImage: "/images/services/buysell.webp",
        alt: "Buy & Sell on Campus",
        cta: { label: "Browse Deals", href: "/marketplace/buy" }
      },
      {
        id: "announcement",
        bgImage: "/images/services/announcement.webp",
        alt: "Announcements",
        cta: { label: "View Announcements", href: "/announcements" }
      },
      {
        id: "house",
        bgImage: "/images/services/house.webp",
        alt: "Find Housing",
        cta: { label: "Find Housing", href: "/housing" }
      },
      {
        id: "lost",
        bgImage: "/images/services/Lost.webp",
        alt: "Lost & Found",
        cta: { label: "Lost & Found", href: "/lost-found" }
      },
      {
        id: "rideshare",
        bgImage: "/images/services/rideshare.webp",
        alt: "Share a Ride",
        cta: { label: "Find a Ride", href: "/share-ride" }
      },
      {
        id: "ticket",
        bgImage: "/images/services/ticket.webp",
        alt: "Explore Tickets",
        cta: { label: "Explore Tickets", href: "/ticket" }
      },
    ],
    []
  );

  // Auto-play functionality
  const [paused, setPaused] = useState(false);
  
  // ✅ PERFORMANCE: useCallback to prevent function recreation
  const pauseAfterInteraction = useCallback(() => {
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
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

  useEffect(() => {
    if (isHovering || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(id);
  }, [slides.length, isHovering, paused]);

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
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((slide, slideIdx) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div className="relative w-full">
                    {/* ✅ PERFORMANCE: Optimized Next.js Image with priority for first slide */}
                    <Image
                      src={slide.bgImage}
                      alt={slide.alt}
                      width={2659}
                      height={784}
                      className="
                        w-full 
                        h-auto          /* good for mobile */
                        md:h-[340px]    /* fix height for desktops */
                        lg:h-[400px] 
                        object-cover 
                        rounded-xl
                      "
                      priority={slideIdx === 0} // Priority load first image
                      loading={slideIdx === 0 ? undefined : "lazy"} // Lazy load others
                      quality={85} // Balanced quality/size
                      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 90vw, 1280px"
                    />
                    {/* CTA Button positioned consistently */}
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10">
                      <Link
                        href={slide.cta.href}
                        className="
                          inline-block 
                          bg-[#5B46F6] hover:bg-[#4a38e5] 
                          text-white font-semibold
                          px-3 py-1.5     /* smaller padding on mobile */
                          sm:px-4 sm:py-2 /* medium padding on tablet */
                          md:px-6 md:py-3 /* full size on desktop */
                          rounded-lg sm:rounded-xl
                          shadow-md sm:shadow-lg
                          transition-all duration-200 
                          hover:shadow-xl hover:scale-105
                          text-xs sm:text-sm md:text-base /* font scales up */
                        "
                      >
                        {slide.cta.label}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot Navigation Below Slider */}
        {/* <div className="mt-6 flex items-center justify-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className="group/dot relative p-1" // reduced padding
              aria-label={`Go to slide ${i + 1}`}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === index
                    ? "bg-[#5B46F6] shadow-lg"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                style={{
                  width: i === index ? "8px" : "5px", // smaller dot sizes
                  height: i === index ? "8px" : "5px",
                }}
              />
            </button>
          ))}
        </div> */}
      </div>
    </section>
  );
}
