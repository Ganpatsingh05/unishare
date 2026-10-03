"use client";

import React from 'react';
import { t, HOUSING_THEME } from './housingTheme';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HousingEmptyState({ darkMode = false }) {
  const theme = t(darkMode);
  const blueAccent = HOUSING_THEME.accent.blue;

  return (
    <div className="w-full flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Floating Floorplan SVG illustration */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 flex items-center justify-center"
        style={{ color: theme.text.muted }}
      >
        <svg
          width="200"
          height="150"
          viewBox="0 0 200 150"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[200px] h-[150px] opacity-80"
          aria-hidden="true"
        >
          {/* Top Wall with Window */}
          <line x1="30" y1="20" x2="75" y2="20" strokeWidth="2.2" />
          <rect x="75" y="16" width="50" height="8" rx="1.5" strokeWidth="1.6" />
          <line x1="100" y1="16" x2="100" y2="24" strokeWidth="1.4" />
          <line x1="125" y1="20" x2="170" y2="20" strokeWidth="2.2" />

          {/* Right Wall */}
          <line x1="170" y1="20" x2="170" y2="130" strokeWidth="2.2" />

          {/* Bottom Wall */}
          <line x1="170" y1="130" x2="65" y2="130" strokeWidth="2.2" />

          {/* Doorway in bottom-left corner with swing arc */}
          <line x1="30" y1="130" x2="30" y2="95" strokeWidth="2" />
          <path
            d="M 30 95 A 35 35 0 0 1 65 130"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Left Wall */}
          <line x1="30" y1="95" x2="30" y2="20" strokeWidth="2.2" />

          {/* Hanging Key in Center */}
          <line
            x1="100"
            y1="24"
            x2="100"
            y2="58"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          {/* Key Ring */}
          <circle cx="100" cy="65" r="7" strokeWidth="1.8" />
          <circle cx="100" cy="65" r="2.5" strokeWidth="1" opacity="0.5" />
          {/* Key Stem */}
          <line x1="100" y1="72" x2="100" y2="92" strokeWidth="1.8" />
          {/* Key Teeth */}
          <line x1="100" y1="84" x2="106" y2="84" strokeWidth="1.8" />
          <line x1="100" y1="90" x2="105" y2="90" strokeWidth="1.8" />

          {/* Subtle Decorative Star Sparkles */}
          <path
            d="M 135 52 L 136.5 55.5 L 140 57 L 136.5 58.5 L 135 62 L 133.5 58.5 L 130 57 L 133.5 55.5 Z"
            strokeWidth="1"
            opacity="0.35"
          />
          <path
            d="M 64 68 L 65 70.5 L 67.5 71.5 L 65 72.5 L 64 75 L 63 72.5 L 60.5 71.5 L 63 70.5 Z"
            strokeWidth="1"
            opacity="0.25"
          />
        </svg>
      </motion.div>

      {/* Heading & Message with Fade-in-up animation */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col items-center max-w-md"
      >
        <h3
          className="text-2xl font-bold tracking-tight mb-2"
          style={{ color: theme.text.primary }}
        >
          Looks quiet around here.
        </h3>
        <p
          className="text-base leading-relaxed"
          style={{ color: theme.text.muted }}
        >
          Try widening your search or be the first to post a space.
        </p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6"
        >
          <Link
            href="/housing/post"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: blueAccent.base,
            }}
          >
            Post a Space
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
