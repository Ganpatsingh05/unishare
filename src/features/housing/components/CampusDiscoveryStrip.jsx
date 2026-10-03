"use client";

import React from 'react';
import { t, HOUSING_THEME, CAMPUS_AREAS } from './housingTheme';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

/**
 * Renders miniature SVG architectural silhouettes tailored for each campus area
 */
const renderAreaSilhouette = (id) => {
  switch (id) {
    case 'law-gate':
      // Simple gate/archway outline: two vertical lines with a connecting arc
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 20V9a7 7 0 0 1 14 0v11" />
          <path d="M3 20h18" />
          <path d="M4 8h16" />
          <circle cx="12" cy="5" r="0.75" fill="currentColor" />
        </svg>
      );

    case 'phagwara':
      // Small cityscape: 2-3 building rectangles of varying height
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="10" width="5" height="10" rx="0.5" />
          <rect x="9.5" y="4" width="5" height="16" rx="0.5" />
          <rect x="16" y="8" width="5" height="12" rx="0.5" />
          <line x1="2" y1="20" x2="22" y2="20" />
          <circle cx="12" cy="7" r="0.6" fill="currentColor" />
          <circle cx="12" cy="11" r="0.6" fill="currentColor" />
          <circle cx="18.5" cy="11" r="0.6" fill="currentColor" />
          <circle cx="5.5" cy="13" r="0.6" fill="currentColor" />
        </svg>
      );

    case 'green-valley':
      // Valley shape: two diagonal lines meeting at bottom with a small tree circle
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 8L12 18L22 8" />
          <circle cx="12" cy="11.5" r="2.75" />
          <line x1="12" y1="14.25" x2="12" y2="18" />
          <line x1="2" y1="20" x2="22" y2="20" strokeOpacity="0.4" />
        </svg>
      );

    case 'model-town':
      // House with chimney outline
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 10.5L12 3l9 7.5v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9z" />
          <path d="M18 7.5V4h-2.5v1.4" />
          <path d="M10 20v-5h4v5" />
        </svg>
      );

    case 'near-campus':
      // University building with columns
      return (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 9L12 3l10 6H2z" />
          <line x1="6" y1="12" x2="6" y2="18" />
          <line x1="10" y1="12" x2="10" y2="18" />
          <line x1="14" y1="12" x2="14" y2="18" />
          <line x1="18" y1="12" x2="18" y2="18" />
          <line x1="3" y1="20" x2="21" y2="20" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      );

    default:
      return <MapPin className="w-5 h-5" aria-hidden="true" />;
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const tileVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CampusDiscoveryStrip({
  darkMode = false,
  activeLocation = null,
  onLocationSelect = () => {},
}) {
  const theme = t(darkMode);

  return (
    <section className="w-full">
      {/* 1. Section Heading */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h2
          className="text-2xl font-bold tracking-tight"
          style={{ color: theme.text.primary }}
        >
          Popular Around Campus
        </h2>
      </div>

      {/* 2. Horizontal Scrolling Row */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto pb-3 pt-1 px-0.5 hide-scrollbar snap-x snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {CAMPUS_AREAS.map((area) => {
          const isSelected = activeLocation === area.id;
          const accent = HOUSING_THEME.accent[area.color] || HOUSING_THEME.accent.blue;

          return (
            <motion.button
              key={area.id}
              variants={tileVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onLocationSelect(area.id)}
              aria-pressed={isSelected}
              className={`snap-start relative flex-shrink-0 w-[160px] min-w-[160px] h-[120px] rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 backdrop-blur-md cursor-pointer`}
              style={{
                backgroundColor: isSelected
                  ? (darkMode ? accent.bgDark || `${accent.base}25` : accent.bg || `${accent.base}18`)
                  : theme.surface.glass,
                borderColor: isSelected
                  ? accent.base
                  : theme.borderColor,
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: isSelected
                  ? (theme.shadow?.glow ? theme.shadow.glow(accent.base) : `0 4px 18px ${accent.base}30`)
                  : (theme.shadow?.sm || '0 1px 4px rgba(0,0,0,0.05)'),
              }}
            >
              {/* Miniature SVG Silhouette at top + Availability dot */}
              <div className="flex items-center justify-between w-full">
                <div
                  className="p-1.5 rounded-xl flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: isSelected
                      ? `${accent.base}25`
                      : (darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'),
                    color: darkMode ? accent.light : accent.base,
                  }}
                >
                  {renderAreaSilhouette(area.id)}
                </div>

                {/* Small availability dot (pulsing green animation) */}
                <span className="relative flex h-2 w-2 shrink-0" title="Active listings available">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>

              {/* Location Name & Listing count */}
              <div className="flex flex-col gap-0.5 w-full mt-auto">
                <span
                  className="font-semibold text-sm truncate"
                  style={{ color: theme.text.primary }}
                >
                  {area.name}
                </span>
                <span
                  className="text-xs font-normal truncate"
                  style={{ color: theme.text.muted }}
                >
                  {area.count !== null && area.count !== undefined
                    ? `${area.count} spaces`
                    : 'Explore'}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
