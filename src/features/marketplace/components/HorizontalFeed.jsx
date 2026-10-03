import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import BuyProductCard from './BuyProductCard';

export default function HorizontalFeed({ title, subtitle, items, darkMode, onCardClick, emptyMessage }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    if (!emptyMessage) return null;
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-black mb-1" style={{ color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em' }}>{title}</h2>
        {subtitle && <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>{subtitle}</p>}
        <div className="p-8 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center" 
             style={{ borderColor: darkMode ? '#334155' : '#cbd5e1', backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
          <p className="font-medium" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 relative group">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black mb-1" style={{ color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.02em' }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Desktop Navigation Buttons */}
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#cbd5e1' : '#475569' }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
            style={{ borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#cbd5e1' : '#475569' }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrolling Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-6 overflow-x-auto pb-6 pt-2 px-2 -mx-2 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {items.map((item, idx) => (
          <div key={item.id} className="snap-start shrink-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
            >
              <BuyProductCard 
                item={item} 
                darkMode={darkMode} 
                onClick={onCardClick} 
              />
            </motion.div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
