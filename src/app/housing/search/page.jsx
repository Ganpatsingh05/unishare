"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, IndianRupee, Calendar } from "lucide-react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";

export default function HousingSearchPage() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
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
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const boxBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const boxBg = darkMode ? "bg-gray-900/60" : "bg-gray-50";

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Find a roommate or room</h1>

          <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Keywords</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="e.g., 1BHK near campus, female roommate"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Area / landmark"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Max budget (₹/month)</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="5000"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Move-in by</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={moveIn}
                  onChange={(e) => setMoveIn(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium">
                <Search className="w-4 h-4" />
                Search
              </button>
              <button type="reset" onClick={() => { setQ(""); setLocation(""); setBudget(""); setMoveIn(""); }} className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>
                Reset
              </button>
            </div>
          </form>

          {/* Results placeholder */}
          <div className={`mt-8 rounded-2xl border ${boxBorder} ${boxBg} p-4 text-sm ${textMuted}`}>
            Results will appear here.
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
