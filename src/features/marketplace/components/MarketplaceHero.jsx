import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Laptop, BookOpen, Bike, Home } from 'lucide-react';
import Image from 'next/image';

const QUICK_CHIPS = [
  { label: 'Books', icon: BookOpen, color: '#f59e0b', bg: '#fef3c7', val: 'books' },
  { label: 'Electronics', icon: Laptop, color: '#3b82f6', bg: '#dbeafe', val: 'electronics' },
  { label: 'Cycles', icon: Bike, color: '#10b981', bg: '#d1fae5', val: 'other' },
  { label: 'Hostel', icon: Home, color: '#8b5cf6', bg: '#ede9fe', val: 'furniture' },
];

export default function MarketplaceHero({ searchValue, setSearchValue, setCategory, darkMode }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl mb-12 border shadow-lg"
      style={{ borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
      {/* Background with abstract shapes */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          background: darkMode 
            ? 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)' 
            : 'linear-gradient(135deg, #eef2ff 0%, #fff1f2 100%)'
        }}
      >
        {/* Soft decorative blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-0 right-32 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between p-6 md:p-12 gap-8">
        
        {/* Text and Search */}
        <div className="flex-1 w-full max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-sm border border-white/50 dark:border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                Campus Discovery
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-[1.1]" style={{ color: darkMode ? '#ffffff' : '#0f172a', letterSpacing: '-0.03em' }}>
              Discover Hidden<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Campus Deals</span>
            </h1>

            {/* Premium Search Bar */}
            <div className="relative mb-6">
              <div 
                className={`flex items-center w-full rounded-2xl border-2 transition-all duration-300 ${
                  isFocused 
                    ? (darkMode ? 'border-indigo-500 bg-gray-900/90 shadow-[0_0_0_4px_rgba(99,102,241,0.2)]' : 'border-indigo-500 bg-white shadow-[0_0_0_4px_rgba(99,102,241,0.2)]') 
                    : (darkMode ? 'border-gray-700 bg-gray-800/60' : 'border-white bg-white/80')
                }`}
                style={{ backdropFilter: 'blur(12px)' }}
              >
                <Search className={`w-6 h-6 ml-5 ${isFocused ? 'text-indigo-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="What are you looking for?"
                  className="w-full px-4 py-5 bg-transparent border-none outline-none text-lg font-medium placeholder-gray-400"
                  style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
                />
              </div>
            </div>

            {/* Quick Chips */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-semibold mr-2" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Try:</span>
              {QUICK_CHIPS.map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setCategory(chip.val)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-transform hover:scale-105 active:scale-95 border"
                    style={{ 
                      backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : chip.bg, 
                      color: darkMode ? '#e2e8f0' : chip.color,
                      borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'transparent'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Illustration */}
        <motion.div 
          className="flex-1 w-full flex justify-center md:justify-end"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
            <Image
              src="/images/cards/girl_buy.png"
              alt="Students trading items"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
