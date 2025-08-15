"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, UploadCloud, Users, ArrowRight } from "lucide-react";
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
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Housing</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>What would you like to do?</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Search for a roommate/room */}
            <Link
              href="/housing/search"
              className={`group rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeBlue}`}>
                  <Search className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Find a roommate or room</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeBlue}`}>Popular</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    Search listings posted by students. Filter by location, budget, and move-in date.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Start searching
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Post your room to find a roommate */}
            <Link
              href="/housing/post"
              className={`group rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeGreen}`}>
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Post a room and find a roommate</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeGreen}`}>New</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    List your place with photos and details. Get connected with interested roommates.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Create a listing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Or divider */}
          <div className="my-8 flex items-center gap-3">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className={`text-xs ${textMuted}`}>or</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          {/* Helpful tips */}
          <div className={`rounded-2xl border ${tipBorder} ${tipBg} p-4 sm:p-5`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/10 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                <Users className="w-4 h-4" />
              </div>
              <p className={`text-xs sm:text-sm ${textMuted}`}>
                Safety tip: meet in public places for viewings and verify student IDs when possible.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
