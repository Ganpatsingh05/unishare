"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UploadCloud, Users, ArrowRight, Home } from "lucide-react";
import Image from "next/image";
import Header from "../_components/Header";
import Footer from "../_components/Footer";

export default function HousingHubPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);

  useEffect(() => {
    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rot = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) * 0.1;
      setLogoRotation((prev) => (Math.abs(prev - rot) < 0.1 ? prev : rot));
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const handleThemeToggle = () => setDarkMode((p) => !p);

  const pageBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800";
  const cardBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-900/70" : "bg-white/80";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const tipBg = darkMode ? "bg-gray-900/60" : "bg-gray-50";
  const tipBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const badgeBlue = darkMode ? "text-blue-300 bg-blue-500/10" : "text-blue-600 bg-blue-50";
  const badgeGreen = darkMode ? "text-emerald-300 bg-emerald-500/10" : "text-emerald-600 bg-emerald-50";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero Banner Section */}
        <div className="mx-auto max-w-4xl mb-10">
          <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/assets/images/housing-hero.jpg"
              alt="Student Housing Hero"
              width={1200}
              height={320}
              className="w-full h-48 object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 via-blue-700/40 to-transparent flex items-center pl-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg mb-2 flex items-center gap-2">
                  <Home className="w-8 h-8 text-yellow-300" />
                  Find Your Campus Home
                </h1>
                <p className="text-lg text-blue-100 max-w-xl">Browse rooms, connect with roommates, and make your campus life comfortable and safe.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Search for a roommate/room */}
            <Link
              href="/housing/search"
              className={`group rounded-3xl border-2 ${cardBorder} ${cardBg} shadow-lg hover:shadow-2xl transition-all duration-300 p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 hover:-translate-y-1`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Search className="w-7 h-7 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg sm:text-xl font-bold ${titleClr}`}>Find a roommate or room</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold`}>Popular</span>
                  </div>
                  <p className={`mt-2 text-base ${textMuted} line-clamp-2`}>Search listings posted by students. Filter by location, budget, and move-in date.</p>
                  <span className={`mt-4 inline-flex items-center gap-2 text-base font-semibold text-blue-600 dark:text-blue-300 group-hover:underline`}>Start searching <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>

            {/* Post your room to find a roommate */}
            <Link
              href="/housing/post"
              className={`group rounded-3xl border-2 ${cardBorder} ${cardBg} shadow-lg hover:shadow-2xl transition-all duration-300 p-7 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 hover:-translate-y-1`}
            >
              <div className="flex items-start gap-5">
                <div className={`p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <UploadCloud className="w-7 h-7 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-lg sm:text-xl font-bold ${titleClr}`}>Post a room and find a roommate</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 font-semibold`}>New</span>
                  </div>
                  <p className={`mt-2 text-base ${textMuted} line-clamp-2`}>List your place with photos and details. Get connected with interested roommates.</p>
                  <span className={`mt-4 inline-flex items-center gap-2 text-base font-semibold text-emerald-600 dark:text-emerald-300 group-hover:underline`}>Create a listing <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>
          </div>

          {/* Or divider */}
          <div className="my-10 flex items-center gap-3">
            <div className={`flex-1 h-px ${darkMode ? 'bg-blue-900' : 'bg-blue-200'}`} />
            <span className={`text-xs font-semibold text-blue-500 dark:text-blue-300`}>or</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-blue-900' : 'bg-blue-200'}`} />
          </div>

          {/* Helpful tips - more prominent */}
          <div className={`rounded-3xl border-2 ${tipBorder} ${tipBg} p-6 shadow-lg flex items-center gap-4 mt-8`}> 
            <div className={`p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center shadow-md`}>
              <Users className="w-7 h-7 text-yellow-700 dark:text-yellow-300" />
            </div>
            <div>
              <p className={`text-base font-medium ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>Safety tip:</p>
              <p className={`text-sm ${textMuted}`}>Meet in public places for viewings and verify student IDs when possible.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
