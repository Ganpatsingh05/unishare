import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X, MapPin, IndianRupee } from 'lucide-react';

export default function FloatingFilterPanel({ 
  category, setCategory, 
  condition, setCondition,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  location, setLocation,
  sort, setSort,
  onReset,
  darkMode,
  isMobile,
  isOpen,
  setIsOpen
}) {
  const panelBg = darkMode ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)';
  const borderClr = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textClr = darkMode ? '#f8fafc' : '#0f172a';
  const labelClr = darkMode ? '#94a3b8' : '#64748b';
  const inputBg = darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)';

  // Mobile Bottom Sheet
  if (isMobile) {
    if (!isOpen) {
      return (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Filter className="w-6 h-6" />
        </button>
      );
    }

    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full bg-white dark:bg-slate-900 rounded-t-3xl p-6 shadow-2xl pb-10"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold" style={{ color: textClr }}>Filters</h3>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-full">
              <X className="w-5 h-5" style={{ color: textClr }} />
            </button>
          </div>
          <FilterContent {...{category, setCategory, condition, setCondition, minPrice, setMinPrice, maxPrice, setMaxPrice, location, setLocation, sort, setSort, onReset, labelClr, inputBg, textClr, borderClr}} />
        </motion.div>
      </div>
    );
  }

  // Desktop Floating Panel
  return (
    <div 
      className="sticky top-28 w-full xl:w-72 flex-shrink-0 rounded-3xl p-6 backdrop-blur-xl border shadow-xl"
      style={{ backgroundColor: panelBg, borderColor: borderClr }}
    >
      <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: borderClr }}>
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: textClr }}>
          <Filter className="w-5 h-5" /> Filters
        </h3>
        <button onClick={onReset} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors">
          Reset All
        </button>
      </div>
      <FilterContent {...{category, setCategory, condition, setCondition, minPrice, setMinPrice, maxPrice, setMaxPrice, location, setLocation, sort, setSort, labelClr, inputBg, textClr, borderClr}} />
    </div>
  );
}

function FilterContent({ category, setCategory, condition, setCondition, minPrice, setMinPrice, maxPrice, setMaxPrice, location, setLocation, sort, setSort, labelClr, inputBg, textClr, borderClr }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelClr }}>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl appearance-none outline-none text-sm font-medium transition-colors" style={{ backgroundColor: inputBg, color: textClr }}>
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="furniture">Furniture</option>
          <option value="accessories">Accessories</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelClr }}>Condition</label>
        <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-4 py-3 rounded-xl appearance-none outline-none text-sm font-medium transition-colors" style={{ backgroundColor: inputBg, color: textClr }}>
          <option value="all">Any Condition</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="damaged">Damaged</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelClr }}>Price Range</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" style={{ color: textClr }} />
            <input type="text" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Min" className="w-full pl-8 pr-3 py-3 rounded-xl outline-none text-sm font-medium transition-colors placeholder-gray-400" style={{ backgroundColor: inputBg, color: textClr }} />
          </div>
          <span style={{ color: labelClr }}>-</span>
          <div className="relative flex-1">
            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" style={{ color: textClr }} />
            <input type="text" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Max" className="w-full pl-8 pr-3 py-3 rounded-xl outline-none text-sm font-medium transition-colors placeholder-gray-400" style={{ backgroundColor: inputBg, color: textClr }} />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelClr }}>Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: textClr }} />
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Campus area..." className="w-full pl-9 pr-4 py-3 rounded-xl outline-none text-sm font-medium transition-colors placeholder-gray-400" style={{ backgroundColor: inputBg, color: textClr }} />
        </div>
      </div>

      {/* Sort */}
      <div className="pt-4 border-t mt-2" style={{ borderColor: borderClr }}>
        <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: labelClr }}>Sort By</label>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-4 py-3 rounded-xl appearance-none outline-none text-sm font-medium transition-colors" style={{ backgroundColor: inputBg, color: textClr }}>
          <option value="recent">Most Recent</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
