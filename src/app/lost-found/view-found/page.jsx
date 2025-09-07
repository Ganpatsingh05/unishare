"use client";
import React, { useMemo, useState } from "react";
import Footer from "../../_components/Footer";
import { Search, Calendar, MapPin, Clock, Image as ImageIcon } from "lucide-react";

export default function ViewFoundPage() {
  const [darkMode, setDarkMode] = useState(true);
  // Palette toggle: 'warm', 'cool', 'neutral', 'gradient'
  const [palette, setPalette] = useState('neutral');
  const isCool = palette === 'cool';
  const isNeutral = palette === 'neutral';
  const isGradient = palette === 'gradient';
  const isDark = palette === 'dark';
  // Computed classes based on palette
  const labelClr = isGradient
    ? 'text-white/90'
    : isDark
      ? 'text-white/85'
      : isNeutral
        ? 'text-[#333333]/85'
        : (isCool ? 'text-[#1A1A1A]/85' : 'text-[#2D2D2D]/80');
  const inputBg = isGradient
    ? 'bg-white/10 border-white/25 text-white placeholder-white/70 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
    : isDark
      ? 'bg-[#0B1220]/60 border-[#334155] text-[#E5E7EB] placeholder-[#E5E7EB]/50 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
      : isNeutral
        ? 'bg-white border-[#FFD6C8] text-[#333333] placeholder-[#333333]/50 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
        : (isCool
          ? 'bg-white border-[#BBD4FF] text-[#1A1A1A] placeholder-[#1A1A1A]/50 focus:ring-4 focus:ring-[#1E90FF33] focus:border-[#1E90FF]'
          : 'bg-white border-[#FFD1B0] text-[#2D2D2D] placeholder-[#2D2D2D]/50 focus:ring-4 focus:ring-[#FF914D33] focus:border-[#FF914D]');
  const titleClr = (isGradient || isDark)
    ? 'text-white'
    : (isNeutral ? 'text-[#333333]' : (isCool ? 'text-[#1A1A1A]' : 'text-[#2D2D2D]'));
  
  // Card text colors based on palette
  const cardMainText = isDark ? 'text-[#E5E7EB]' : (isGradient ? 'text-[#333333]' : 'text-[#2D2D2D]');
  const cardSub1Text = isDark ? 'text-[#E5E7EB]/75' : (isGradient ? 'text-[#333333]/70' : 'text-[#2D2D2D]/70');
  const cardSub2Text = isDark ? 'text-[#E5E7EB]/65' : (isGradient ? 'text-[#333333]/60' : 'text-[#2D2D2D]/60');

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Placeholder sample data (client-side only)
  const sampleItems = useMemo(() => ([
    { id: 1, title: "Black Wallet", where: "Library Hall", date: "2025-08-01" },
    { id: 2, title: "USB Drive 64GB", where: "CS Lab 2", date: "2025-08-05" },
    { id: 3, title: "Blue Water Bottle", where: "Gym Entrance", date: "2025-08-10" },
  ]), []);

  const filtered = useMemo(() => sampleItems.filter(it => {
    const q = query.trim().toLowerCase();
    const l = location.trim().toLowerCase();
    const inQuery = !q || it.title.toLowerCase().includes(q);
    const inLoc = !l || it.where.toLowerCase().includes(l);
    const inFrom = !dateFrom || it.date >= dateFrom;
    const inTo = !dateTo || it.date <= dateTo;
    return inQuery && inLoc && inFrom && inTo;
  }), [sampleItems, query, location, dateFrom, dateTo]);

  return (
    <div className="min-h-dvh">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 transition-colors shadow-lg ${
            isGradient
              ? 'text-white border-transparent shadow-[0_10px_30px_-10px_rgba(255,111,60,0.35)]'
              : isDark
                ? 'bg-[#0F172A] border-[#1F2937] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]'
              : isNeutral
                ? 'bg-[#FFFFFF] border-[#FF6F3C] text-[#333333] shadow-[0_10px_30px_-10px_rgba(255,111,60,0.35)]'
                : isCool
                  ? 'bg-[#E6F2FF] border-[#CFE6FF] text-[#1A1A1A]'
                  : 'bg-[#FFF5E6] border-[#FFE2BF] text-[#2D2D2D]'
          }`}
          style={isGradient ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' } : undefined}
        >
          {!isGradient && (
            <div className={`absolute inset-x-0 top-0 h-1.5 ${
              isNeutral
                ? 'bg-[#FF6F3C]'
                : isCool
                  ? 'bg-[#1E90FF]'
                  : isDark
                    ? 'bg-[#FF6F3C]'
                    : 'bg-[#FF914D]'
            }`}></div>
          )}
          {/* Palette toggle */}
          <div className="absolute right-4 top-4 flex gap-2">
            <button
              onClick={() => setPalette('warm')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isCool ? 'border-[#FF6B35] text-[#FF6B35] bg-transparent' : 'bg-[#FF6B35] text-white border-[#FF6B35]'
              }`}
            >
              Warm
            </button>
            <button
              onClick={() => setPalette('cool')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isCool ? 'bg-[#0056B3] text-white border-[#0056B3]' : 'border-[#1E90FF] text-[#1E90FF] bg-transparent'
              }`}
            >
              Cool
            </button>
            <button
              onClick={() => setPalette('neutral')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isNeutral ? 'bg-[#FF6F3C] text-white border-[#FF6F3C]' : 'border-[#FF6F3C] text-[#FF6F3C] bg-transparent'
              }`}
            >
              Neutral
            </button>
            <button
              onClick={() => setPalette('gradient')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isGradient
                  ? 'text-white border-transparent'
                  : 'text-[#FF6F3C] border-[#FF6F3C] bg-transparent'
              }`}
              style={isGradient ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' } : undefined}
            >
              Gradient
            </button>
            <button
              onClick={() => setPalette('dark')}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                isDark ? 'bg-[#111827] text-white border-[#111827]' : 'border-[#111827] text-[#111827] bg-transparent'
              }`}
            >
              Dark
            </button>
          </div>
          <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>View Found Items</h1>
          <p className={`${isGradient ? 'text-white/90' : (isDark ? 'text-white/80' : (isNeutral ? 'text-[#333333]/80' : (isCool ? 'text-[#1A1A1A]/80' : 'text-[#2D2D2D]/80')))} mt-1 text-sm`}>Search items that others have reported as found on campus.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Keywords</label>
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., wallet, bottle, id card" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>From</label>
              <div className="relative">
                <Calendar className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>To</label>
              <div className="relative">
                <Calendar className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className={`text-sm font-medium ${labelClr}`}>Results</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.length === 0 && (
                <div className={`col-span-full text-sm ${isGradient ? 'text-white/85' : (isDark ? 'text-white/80' : (isNeutral ? 'text-[#333333]/70' : (isCool ? 'text-[#1A1A1A]/70' : 'text-[#2D2D2D]/70')))}`}>No items match your filters.</div>
              )}
              {filtered.map((it) => (
                <div
                  key={it.id}
                  className={`rounded-xl border p-4 transition-all hover:shadow-md ${
                    isGradient
                      ? 'bg-white border-[#FFC2A6] text-[#333333] shadow-[0_10px_25px_-12px_rgba(255,127,95,0.25)]'
                      : isDark
                        ? 'bg-[#111827] border-[#FF6F3C33] text-[#E5E7EB] shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)]'
                        : 'bg-white ' + (isNeutral
                          ? 'border-[#FF6F3C] text-[#333333] shadow-[0_10px_25px_-12px_rgba(255,111,60,0.25)]'
                          : isCool
                            ? 'border-[#BBD4FF] text-[#1A1A1A]'
                            : 'border-[#FFD1B0] text-[#2D2D2D]')
                  }`}
                > 
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                        isGradient
                          ? 'bg-[#FFF0E9] border-[#FFC2A6]'
                          : isDark
                            ? 'bg-[#0F172A] border-[#334155]'
                            : isNeutral
                              ? 'bg-white border-[#FF6F3C]'
                              : isCool
                                ? 'bg-[#E6F2FF] border-[#CFE6FF]'
                                : 'bg-[#FFF5E6] border-[#FFE2BF]'
                      }`}
                    >
                      <ImageIcon className={`${isGradient ? 'text-[#FF6F3C]' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} size={18} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${cardMainText}`}>{it.title}</div>
                      <div className={`text-xs mt-1 ${cardSub1Text}`}>{it.where}</div>
                      <div className={`text-xs mt-1 ${cardSub2Text}`}>{it.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}

