import React from 'react';
import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { id: 'recent', label: 'Newest' },
  { id: 'popular', label: 'Popular' },
  { id: 'price-asc', label: 'Price ↑' },
  { id: 'price-desc', label: 'Price ↓' },
  { id: 'nearby', label: 'Nearby' },
];

export default function SegmentedSorting({ sort, setSort, darkMode }) {
  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-dashed" style={{ borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
      <h2 className="text-xl md:text-2xl font-black" style={{ color: darkMode ? '#ffffff' : '#0f172a' }}>Campus Market</h2>
      
      {/* Segmented Button Group */}
      <div 
        className="hidden md:flex p-1 rounded-full items-center gap-1 shadow-inner"
        style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)' }}
      >
        {SORT_OPTIONS.map((option) => {
          const isSelected = sort === option.id;
          return (
            <button
              key={option.id}
              onClick={() => setSort(option.id)}
              className="relative px-4 py-2 rounded-full text-sm font-bold transition-colors"
              style={{
                color: isSelected ? (darkMode ? '#ffffff' : '#0f172a') : (darkMode ? '#94a3b8' : '#64748b'),
              }}
            >
              <span className="relative z-10">{option.label}</span>
              {isSelected && (
                <motion.div
                  layoutId="sortUnderline"
                  className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full z-0"
                  style={{ backgroundColor: darkMode ? '#818cf8' : '#6366f1' }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Select */}
      <div className="md:hidden">
        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm font-bold outline-none"
          style={{ 
            backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
            color: darkMode ? '#ffffff' : '#0f172a'
          }}
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
