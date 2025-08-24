"use client";

import React, { useMemo, useState } from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { Search, SlidersHorizontal, Tag, MapPin, DollarSign, Star, ArrowUpDown, Image as ImageIcon, IndianRupee } from "lucide-react";

export default function MarketplaceBuyPage() {
  const [darkMode, setDarkMode] = useState(true);

  // Filters & sorting
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent"); // recent | price-asc | price-desc

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const cardBg = darkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-200";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const subClr = darkMode ? "text-gray-400" : "text-gray-600";

  // Demo data
  const items = useMemo(() => ([
    { id: 1, title: "Scientific Calculator", price: 700, category: "electronics", condition: "good", location: "Hostel A", rating: 4.5, date: "2025-08-09" },
    { id: 2, title: "DSA Textbook", price: 350, category: "books", condition: "like-new", location: "CS Block", rating: 4.9, date: "2025-08-12" },
    { id: 3, title: "Bluetooth Headphones", price: 1200, category: "electronics", condition: "fair", location: "Main Gate", rating: 4.2, date: "2025-08-11" },
    { id: 4, title: "Office Chair", price: 2500, category: "furniture", condition: "good", location: "Dorm C", rating: 4.6, date: "2025-08-08" },
    { id: 5, title: "Laptop Stand", price: 500, category: "accessories", condition: "like-new", location: "Library", rating: 4.7, date: "2025-08-10" },
  ]), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const l = location.trim().toLowerCase();
    let list = items.filter(it => {
      const inQuery = !q || it.title.toLowerCase().includes(q);
      const inCat = category === "all" || it.category === category;
      const inCond = condition === "all" || it.condition === condition;
      const inLoc = !l || it.location.toLowerCase().includes(l);
      const inMin = !minPrice || it.price >= Number(minPrice);
      const inMax = !maxPrice || it.price <= Number(maxPrice);
      return inQuery && inCat && inCond && inLoc && inMin && inMax;
    });
    switch (sort) {
      case "price-asc": list = list.sort((a,b) => a.price - b.price); break;
      case "price-desc": list = list.sort((a,b) => b.price - a.price); break;
      default: list = list.sort((a,b) => b.date.localeCompare(a.date));
    }
    return list;
  }, [items, query, category, condition, minPrice, maxPrice, location, sort]);

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Buy Items</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search items..." className={`w-56 sm:w-64 pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
              <button onClick={() => { setQuery(""); setCategory("all"); setCondition("all"); setMinPrice(""); setMaxPrice(""); setLocation(""); setSort("recent"); }} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                <SlidersHorizontal className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                <option value="all">All</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                <option value="all">All</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Min Price</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Max Price</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="5000" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Sort by</label>
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}>
                  <option value="recent">Most recent</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 && (
              <div className={`col-span-full text-sm ${subClr}`}>No items match your filters.</div>
            )}
            {filtered.map((it) => (
              <div key={it.id} className={`rounded-xl border p-4 ${cardBg} hover:shadow-sm`}>
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                    <ImageIcon className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${titleClr}`}>{it.title}</div>
                    <div className="mt-1 flex items-center gap-3 text-xs">
                      <span className={`${subClr} inline-flex items-center gap-1`}><Tag size={14} /> {it.category}</span>
                      <span className={`${subClr}`}>{it.condition}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                        <IndianRupee size={16} /> {it.price}
                      </div>
                      <div className={`text-xs inline-flex items-center gap-1 ${subClr}`}>
                        <Star size={14} className="text-yellow-400" /> {it.rating}
                      </div>
                    </div>
                    <div className={`mt-2 text-xs ${subClr} inline-flex items-center gap-1`}>
                      <MapPin size={14} /> {it.location}
                    </div>
                  </div>
                </div>
                <button className={`mt-4 w-full text-sm py-2.5 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  View details
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}