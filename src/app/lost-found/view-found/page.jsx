"use client";
import React, { useMemo, useState } from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { Search, Calendar, MapPin, Clock, Image as ImageIcon } from "lucide-react";

export default function ViewFoundPage() {
  const [darkMode, setDarkMode] = useState(true);
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

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
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
  <Header darkMode={darkMode} onThemeToggle={() => setDarkMode((p) => !p)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>View Found Items</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm`}>Search items that others have reported as found on campus.</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Keywords</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., wallet, bottle, id card" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>From</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>To</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className={`text-sm font-medium ${labelClr}`}>Results</h2>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.length === 0 && (
                <div className={`col-span-full text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No items match your filters.</div>
              )}
              {filtered.map((it) => (
                <div key={it.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'} hover:shadow-sm`}> 
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <ImageIcon className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${titleClr}`}>{it.title}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{it.where}</div>
                      <div className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{it.date}</div>
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

