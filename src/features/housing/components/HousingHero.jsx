"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { t, HOUSING_THEME, CAMPUS_AREAS } from './housingTheme';

export default function HousingHero({
  darkMode,
  onSearch,
  searchQuery,
  setSearchQuery,
  activeLocation,
  setActiveLocation
}) {
  const theme = t(darkMode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <section className={`relative w-full overflow-hidden transition-colors duration-500 py-16 md:py-24 ${theme.gradient.hero}`}>
      {/* Background Decoration - Campus Route Lines */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04]">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <path d="M-100,50 Q100,200 300,50 T700,250 T1100,50" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M-100,300 Q150,100 400,300 T800,100 T1100,300" stroke="currentColor" strokeWidth="2" strokeDasharray="8 12" />
          <path d="M200,-50 Q300,150 200,450" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
          <path d="M800,-50 Q700,200 800,450" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
          <circle cx="300" cy="50" r="4" fill="currentColor" />
          <circle cx="700" cy="250" r="4" fill="currentColor" />
          <circle cx="400" cy="300" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* Subtle Glow */}
      <div className={`absolute inset-0 opacity-40 pointer-events-none ${theme.gradient.glow}`} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
        >
          <span className={`text-transparent bg-clip-text bg-gradient-to-r ${HOUSING_THEME.accent.gradient}`}>
            Find Your Place.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 ${theme.text.muted}`}
        >
          Discover rooms, roommates, and spaces around campus — your next home is closer than you think.
        </motion.p>

        {/* Search Surface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="w-full max-w-4xl"
        >
          <div className={`backdrop-blur-md rounded-2xl border ${theme.border} ${theme.bg.surface} shadow-xl overflow-hidden p-2 md:p-3`}>
            <form onSubmit={handleSubmit} className="relative flex items-center w-full">
              <div className={`absolute left-4 z-10 ${theme.text.muted}`}>
                <MapPin className="w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Search by area, hostel, landmark..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-4 pl-14 pr-16 bg-transparent border-none focus:ring-0 text-lg md:text-xl placeholder:opacity-50 ${theme.text.primary} focus:outline-none`}
              />
              <button
                type="submit"
                className={`absolute right-2 p-3 rounded-xl bg-gradient-to-r ${HOUSING_THEME.accent.gradient} text-white shadow-lg transition-transform hover:scale-105 active:scale-95`}
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Quick Location Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 md:gap-3">
            {CAMPUS_AREAS.map((area, index) => {
              const isActive = activeLocation === area.id;
              
              // Base colors derived from accent colors if defined in CAMPUS_AREAS, otherwise fallback
              const accentColorClass = area.color || 'bg-blue-500';
              const activeClasses = isActive 
                ? `${accentColorClass} text-white shadow-md font-medium border-transparent` 
                : `${theme.bg.card} ${theme.text.secondary} border ${theme.border} hover:${theme.borderGlow}`;

              return (
                <motion.button
                  key={area.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
                  onClick={() => setActiveLocation(area.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 flex items-center space-x-2 ${activeClasses}`}
                >
                  {area.icon && <span className="opacity-80">{area.icon}</span>}
                  <span>{area.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
