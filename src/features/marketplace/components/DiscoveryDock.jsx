import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Laptop, Gamepad2, Bike, Music, Home, Trophy, SlidersHorizontal, ChevronDown } from 'lucide-react';

const CATEGORIES = [
  { id: 'books', label: 'Books', icon: BookOpen, color: '#f59e0b', bg: '#fef3c7' },
  { id: 'electronics', label: 'Electronics', icon: Laptop, color: '#3b82f6', bg: '#dbeafe' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#ec4899', bg: '#fce7f3' },
  { id: 'cycles', label: 'Cycles', icon: Bike, color: '#10b981', bg: '#d1fae5' },
  { id: 'music', label: 'Music', icon: Music, color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'hostel', label: 'Hostel', icon: Home, color: '#f97316', bg: '#ffedd5' },
  { id: 'sports', label: 'Sports', icon: Trophy, color: '#14b8a6', bg: '#ccfbf1' },
];

export default function DiscoveryDock({ category, setCategory, isDrawerOpen, setIsDrawerOpen, darkMode, itemCounts = {} }) {
  const dockBg = darkMode ? 'rgba(30,41,59,0.7)' : 'rgba(255,255,255,0.7)';
  const borderClr = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <div className="w-full relative z-30 mb-8">
      {/* Floating Container */}
      <div 
        className="max-w-6xl mx-auto rounded-full p-2 backdrop-blur-xl border shadow-lg flex items-center justify-between overflow-x-auto hide-scrollbar"
        style={{ backgroundColor: dockBg, borderColor: borderClr }}
      >
        <div className="flex items-center gap-2 px-2">
          
          <button
            onClick={() => setCategory('all')}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 ${category === 'all' ? 'shadow-md scale-105' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            style={{
              backgroundColor: category === 'all' ? (darkMode ? '#334155' : '#1e293b') : 'transparent',
              color: category === 'all' ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b')
            }}
          >
            All Items
          </button>

          <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 flex-shrink-0" />

          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = category === cat.id;
            const count = itemCounts[cat.id] || 0;

            return (
              <motion.button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-full transition-all duration-300 ${isSelected ? 'shadow-md scale-105' : 'opacity-80 hover:opacity-100 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                style={{
                  backgroundColor: isSelected ? cat.bg : 'transparent',
                }}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-white/50 dark:bg-black/20' : ''}`}
                  style={{ color: isSelected ? cat.color : (darkMode ? '#cbd5e1' : '#475569') }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                
                <span className={`text-sm font-bold transition-colors`} style={{ color: isSelected ? cat.color : (darkMode ? '#94a3b8' : '#475569') }}>
                  {cat.label}
                </span>

                <AnimatePresence>
                  {isSelected && (
                    <motion.span 
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                      exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/50 dark:bg-black/20 font-black"
                      style={{ color: cat.color }}
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        {/* More Filters Toggle */}
        <div className="pl-4 pr-2 border-l sticky right-0" style={{ borderColor: borderClr, backgroundColor: dockBg }}>
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full text-sm font-bold transition-all ${isDrawerOpen ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            <motion.div animate={{ rotate: isDrawerOpen ? 180 : 0 }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
