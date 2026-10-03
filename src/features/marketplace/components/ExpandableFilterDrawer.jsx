import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, IndianRupee, MapPin } from 'lucide-react';

const CONDITIONS = [
  { id: 'all', label: 'Any' },
  { id: 'new', label: 'New' },
  { id: 'like-new', label: 'Like New' },
  { id: 'good', label: 'Good' },
  { id: 'fair', label: 'Fair' },
];

export default function ExpandableFilterDrawer({ 
  isOpen,
  condition, setCondition,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  location, setLocation,
  onReset,
  darkMode,
  isMobile,
  setIsOpen // needed for mobile bottom sheet
}) {
  const panelBg = darkMode ? '#1e293b' : '#ffffff';
  const borderClr = darkMode ? '#334155' : '#e2e8f0';
  const textClr = darkMode ? '#f8fafc' : '#0f172a';
  const labelClr = darkMode ? '#94a3b8' : '#64748b';
  const inputBg = darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)';

  const content = (
    <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 lg:gap-12 w-full max-w-6xl mx-auto">
      
      {/* Column 1: Price */}
      <div className="flex-1">
        <label className="block text-xs font-bold uppercase tracking-wider mb-4 flex justify-between items-center" style={{ color: labelClr }}>
          Price Range
          <button onClick={() => {setMinPrice(''); setMaxPrice('');}} className="text-[10px] text-indigo-500 hover:underline">Clear</button>
        </label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: textClr }} />
            <input 
              type="text" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} 
              placeholder="Min" 
              className="w-full pl-10 pr-4 py-4 rounded-2xl outline-none text-base font-medium transition-colors placeholder-gray-400 focus:ring-2 ring-indigo-500/50" 
              style={{ backgroundColor: inputBg, color: textClr }} 
            />
          </div>
          <span style={{ color: labelClr }}>to</span>
          <div className="relative flex-1">
            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" style={{ color: textClr }} />
            <input 
              type="text" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} 
              placeholder="Max" 
              className="w-full pl-10 pr-4 py-4 rounded-2xl outline-none text-base font-medium transition-colors placeholder-gray-400 focus:ring-2 ring-indigo-500/50" 
              style={{ backgroundColor: inputBg, color: textClr }} 
            />
          </div>
        </div>
      </div>

      {/* Column 2: Condition (Segmented Pills) */}
      <div className="flex-[1.5]">
        <label className="block text-xs font-bold uppercase tracking-wider mb-4" style={{ color: labelClr }}>Item Condition</label>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => {
            const isSelected = condition === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCondition(c.id)}
                className={`relative px-5 py-3 rounded-xl text-sm font-bold transition-all ${isSelected ? 'text-white shadow-md' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                style={{
                  backgroundColor: isSelected ? '#6366f1' : inputBg,
                  color: isSelected ? '#ffffff' : textClr
                }}
              >
                {isSelected && <motion.div layoutId="conditionBg" className="absolute inset-0 bg-indigo-500 rounded-xl -z-10" />}
                <span className="relative z-10 flex items-center gap-2">
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  {c.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Column 3: Location */}
      <div className="flex-1">
        <label className="block text-xs font-bold uppercase tracking-wider mb-4" style={{ color: labelClr }}>Pickup Location</label>
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50" style={{ color: textClr }} />
          <input 
            type="text" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="e.g. Law Gate, Hostel C..." 
            className="w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-base font-medium transition-colors placeholder-gray-400 focus:ring-2 ring-indigo-500/50" 
            style={{ backgroundColor: inputBg, color: textClr }} 
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={onReset}
            className="px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            style={{ color: labelClr }}
          >
            Reset All Filters
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full rounded-t-3xl shadow-2xl pb-10"
              style={{ backgroundColor: panelBg }}
            >
              <div className="flex justify-center p-4">
                <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700" />
              </div>
              {content}
              <div className="px-6 pb-6 pt-2">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg shadow-lg active:scale-95 transition-transform"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  }

  // Desktop Expandable Area
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0, marginTop: -32 }}
          animate={{ height: 'auto', opacity: 1, marginTop: 0 }}
          exit={{ height: 0, opacity: 0, marginTop: -32 }}
          className="overflow-hidden relative z-20 mb-8"
        >
          <div 
            className="border-y shadow-inner" 
            style={{ backgroundColor: panelBg, borderColor: borderClr }}
          >
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
