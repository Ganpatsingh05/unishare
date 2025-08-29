"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroSlider({ darkMode = true }) {
  const [index, setIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);

  const slides = useMemo(
    () => [
      {
        id: "spend-lens",
        bgImage: "/assets/images/banners/banner1.jpg",
        alt: "UniShare Campus",
        cta: { label: "Get Started", href: "/" }
      },
      {
        id: "campus-deals",
        bgImage: "/assets/images/sliders/sellslider.png",
        alt: "Campus Deals",
        cta: { label: "Browse Deals", href: "/marketplace/buy" }
      },
      {
        id: "smart-ride",
        bgImage: "/assets/images/banners/banner3.jpg",
        alt: "Share Rides",
        cta: { label: "Find a Ride", href: "/share-ride" }
      },
      {
        id: "study-notes",
        bgImage: "/assets/images/banners/banner4.jpg",
        alt: "Study Notes",
        cta: { label: "Explore Notes", href: "/resources" }
      },
      {
        id: "housing",
        bgImage: "/assets/images/banners/banner5.jpg",
        alt: "Housing",
        cta: { label: "Find Housing", href: "/housing" }
      },
      {
        id: "ridesharingtemp",
        bgImage: "/assets/images/sliders/ridesharingtemp.jpeg",
        alt: "Ride Sharing Temp",
        cta: { label: "Share a Ride", href: "/share-ride" }
      },
    ],
    []
  );

  // Auto-play functionality
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (isHovering || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(id);
  }, [slides.length, isHovering, paused]);

  // Navigation controls
  const pauseAfterInteraction = () => {
    setPaused(true);
    setTimeout(() => setPaused(false), 6000);
  };

  const prevSlide = () => {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
    pauseAfterInteraction();
  };

  const nextSlide = () => {
    setIndex((i) => (i + 1) % slides.length);
    pauseAfterInteraction();
  };

  const goToSlide = (i) => {
    setIndex(i);
    pauseAfterInteraction();
  };

  return (
    <section className="w-full pt-8 sm:pt-12">
      <div className="max-w-6xl mx-auto px-4">
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
                <div key={slide.id} className="w-full flex-shrink-0 relative">
                  <div className="relative" style={{ width: '851px', height: '315px', maxWidth: '100%' }}>
                    {/* Banner image */}
                    <Image
                      src={slide.bgImage}
                      alt={slide.alt}
                      fill
                      className="object-cover rounded-xl"
                      priority={slideIdx === 0}
                      sizes="100vw"
                    />
                    {/* CTA Button positioned consistently */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <Link
                        href={slide.cta.href}
                        className="inline-block bg-[#5B46F6] hover:bg-[#4a38e5] text-white font-semibold px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-sm sm:text-base"
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
        <div className="mt-6 flex items-center justify-center gap-3">
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
        </div>
      </div>
    </section>
  );
}