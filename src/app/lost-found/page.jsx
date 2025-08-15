"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Search, Package, FileText, ArrowRight } from "lucide-react";

export default function LostFoundHubPage() {
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
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-900/70" : "bg-white/80";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold ${titleClr}`}>Lost &amp; Found</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>Report a lost item or share something you&rsquo;ve found on campus.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <Link href="/lost-found/report" className={`group rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Report Lost Item</h2>
                  <p className={`mt-1 text-sm ${textMuted}`}>Describe what you lost and when you last saw it.</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Start report <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/lost-found/view-found" className={`group rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>View Found Items</h2>
                  <p className={`mt-1 text-sm ${textMuted}`}>Search items reported found by other students.</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Browse now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}
