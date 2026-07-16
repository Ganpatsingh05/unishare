"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, Search, UploadCloud, Users, Shield, MapPin, Star } from "lucide-react";
import SmallFooter from "./../../_components/layout/SmallFooter";
import { useUI } from "./../../lib/contexts/UniShareContext";

export default function HousingHubPage() {
  const { darkMode } = useUI();
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    // Staggered entrance animation
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen relative">
      {/* Earth Theme Background */}
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/*  HERO / LANDING SECTION — full viewport, centered      */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
            <Image
              src="/images/logos/logounishare1.png"
              alt="UniShare Housing"
              width={96}
              height={96}
              className="w-full h-full object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <div
          className={`text-center transition-all duration-700 delay-150 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1
            className={`text-3xl sm:text-4xl md:text-5xl font-light tracking-tight ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            Welcome to{" "}
            <span className="font-semibold">
              <span style={{ color: "#facc15" }}>Uni</span>
              <span style={{ color: "#38bdf8" }}>Housing</span>
            </span>
          </h1>
          <p
            className={`mt-4 text-base sm:text-lg max-w-md mx-auto ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            We make finding the perfect roommate super easy.
          </p>
        </div>

        {/* CTA Links */}
        <div
          className={`mt-10 flex flex-col items-center gap-4 transition-all duration-700 delay-300 ease-out ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/housing/search"
            className={`group text-lg sm:text-xl font-medium transition-all duration-200 hover:tracking-wide ${
              darkMode
                ? "text-sky-400 hover:text-sky-300"
                : "text-sky-500 hover:text-sky-600"
            }`}
          >
            Find a Room
            <span className="block h-[1.5px] w-0 group-hover:w-full transition-all duration-300 bg-current mx-auto" />
          </Link>
          <Link
            href="/housing/post"
            className={`group text-lg sm:text-xl font-medium transition-all duration-200 hover:tracking-wide ${
              darkMode
                ? "text-sky-400 hover:text-sky-300"
                : "text-sky-500 hover:text-sky-600"
            }`}
          >
            Post a Room
            <span className="block h-[1.5px] w-0 group-hover:w-full transition-all duration-300 bg-current mx-auto" />
          </Link>
        </div>

        {/* Scroll-down chevron */}
        <button
          onClick={scrollToContent}
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500 animate-bounce ${
            mounted ? "opacity-60" : "opacity-0"
          } ${darkMode ? "text-gray-500" : "text-gray-400"}`}
          aria-label="Scroll down"
        >
          <ChevronDown className="w-7 h-7" />
        </button>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/*  BELOW-FOLD CONTENT — feature cards + tips             */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section
        ref={contentRef}
        className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-4xl">
          {/* Section Title */}
          <div className="text-center mb-12 sm:mb-16">
            <h2
              className={`text-2xl sm:text-3xl font-bold tracking-tight ${
                darkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              How it works
            </h2>
            <p
              className={`mt-2 text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Two simple paths to your next home
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-8">
            {/* Search Card */}
            <Link
              href="/housing/search"
              className={`group relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                darkMode
                  ? "border-gray-800 bg-gray-900/60 hover:border-sky-500/30"
                  : "border-gray-200 bg-white/80 hover:border-sky-300"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  darkMode
                    ? "bg-sky-500/10 text-sky-400"
                    : "bg-sky-50 text-sky-600"
                }`}
              >
                <Search className="w-6 h-6" />
              </div>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Find a roommate or room
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Browse listings posted by students. Filter by location, budget,
                and move-in date to find your perfect match.
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  darkMode ? "text-sky-400" : "text-sky-600"
                }`}
              >
                Start searching
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>

              {/* Popular badge */}
              <span
                className={`absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                  darkMode
                    ? "bg-sky-500/15 text-sky-300"
                    : "bg-sky-50 text-sky-600"
                }`}
              >
                Popular
              </span>
            </Link>

            {/* Post Card */}
            <Link
              href="/housing/post"
              className={`group relative rounded-2xl border p-6 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                darkMode
                  ? "border-gray-800 bg-gray-900/60 hover:border-emerald-500/30"
                  : "border-gray-200 bg-white/80 hover:border-emerald-300"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                  darkMode
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Post a room & find a roommate
              </h3>
              <p
                className={`text-sm leading-relaxed mb-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                List your place with photos and details. Get connected with
                interested and verified roommates.
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-sm font-medium ${
                  darkMode ? "text-emerald-400" : "text-emerald-600"
                }`}
              >
                Create a listing
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>

              {/* New badge */}
              <span
                className={`absolute top-4 right-4 text-[10px] px-2.5 py-1 rounded-full font-semibold ${
                  darkMode
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                New
              </span>
            </Link>
          </div>

          {/* Trust / info strip */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: Shield,
                title: "Verified Students",
                desc: "All users are verified university students",
                color: darkMode ? "text-yellow-400" : "text-yellow-600",
                bg: darkMode ? "bg-yellow-500/10" : "bg-yellow-50",
              },
              {
                icon: MapPin,
                title: "Campus Nearby",
                desc: "Listings near your university campus",
                color: darkMode ? "text-sky-400" : "text-sky-600",
                bg: darkMode ? "bg-sky-500/10" : "bg-sky-50",
              },
              {
                icon: Star,
                title: "Rated Roommates",
                desc: "See ratings and reviews from other students",
                color: darkMode ? "text-emerald-400" : "text-emerald-600",
                bg: darkMode ? "bg-emerald-500/10" : "bg-emerald-50",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  darkMode
                    ? "border-gray-800 bg-gray-900/40"
                    : "border-gray-200 bg-gray-50/80"
                }`}
              >
                <div
                  className={`p-2 rounded-lg flex-shrink-0 ${item.bg} ${item.color}`}
                >
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      darkMode ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      darkMode ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Safety tip */}
          <div
            className={`mt-8 rounded-2xl border p-4 sm:p-5 ${
              darkMode
                ? "border-gray-800 bg-gray-900/40"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  darkMode
                    ? "bg-yellow-500/10 text-yellow-300"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                <Users className="w-4 h-4" />
              </div>
              <p
                className={`text-xs sm:text-sm ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span className="font-semibold">Safety tip:</span> Meet in
                public places for viewings and verify student IDs when possible.
                Never share financial information before meeting in person.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SmallFooter />
    </div>
  );
}
