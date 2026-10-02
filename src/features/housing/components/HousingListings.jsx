"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, Map } from 'lucide-react';
import { t, HOUSING_THEME } from './housingTheme';
import HousingCard from './HousingCard';
import RoommateCard from './RoommateCard';

export default function HousingListings({
  darkMode = false,
  listings = [],
  isLoading = false,
}) {
  const [viewMode, setViewMode] = useState('discover'); // 'discover' | 'map'
  const theme = t(darkMode);

  // Stagger animation container for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // Card motion variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="w-full">
      {/* ── 1. SECTION HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2
            className="text-2xl md:text-3xl font-bold tracking-tight"
            style={{ color: theme.text.primary }}
          >
            Spaces Available
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
            Places students are currently looking to fill.
          </p>
        </div>

        {/* View Toggle */}
        <div
          className="inline-flex items-center p-1 rounded-full border backdrop-blur-md self-start sm:self-auto"
          style={{
            backgroundColor: theme.surface.glass,
            borderColor: theme.borderColor,
          }}
        >
          <button
            type="button"
            onClick={() => setViewMode('discover')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              viewMode === 'discover'
                ? 'text-white shadow-sm'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor:
                viewMode === 'discover'
                  ? HOUSING_THEME.accent.blue.base
                  : 'transparent',
              color:
                viewMode === 'discover' ? '#ffffff' : theme.text.secondary,
            }}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Discover</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              viewMode === 'map'
                ? 'text-white shadow-sm'
                : 'hover:opacity-80'
            }`}
            style={{
              backgroundColor:
                viewMode === 'map'
                  ? HOUSING_THEME.accent.blue.base
                  : 'transparent',
              color:
                viewMode === 'map' ? '#ffffff' : theme.text.secondary,
            }}
          >
            <Map className="w-4 h-4" />
            <span>Map</span>
          </button>
        </div>
      </div>

      {/* ── 2. LOADING STATE ── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: darkMode
                ? 'rgba(96, 165, 250, 0.2)'
                : 'rgba(59, 130, 246, 0.2)',
              borderTopColor: 'transparent',
            }}
          />
          <p
            className="mt-4 text-sm font-medium"
            style={{ color: theme.text.muted }}
          >
            Discovering spaces...
          </p>
        </div>
      ) : (
        /* ── 3 & 4. VIEWS (Discover Grid vs Map Placeholder) ── */
        <AnimatePresence mode="wait">
          {viewMode === 'discover' ? (
            listings.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border backdrop-blur-xl"
                style={{
                  backgroundColor: theme.surface.glass,
                  borderColor: theme.borderColor,
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3.5"
                  style={{
                    backgroundColor: darkMode
                      ? 'rgba(59, 130, 246, 0.12)'
                      : 'rgba(59, 130, 246, 0.08)',
                    color: HOUSING_THEME.accent.blue.base,
                  }}
                >
                  <LayoutGrid className="w-7 h-7" />
                </div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: theme.text.primary }}
                >
                  No Spaces Found
                </h3>
                <p
                  className="text-sm max-w-md"
                  style={{ color: theme.text.muted }}
                >
                  We couldn&apos;t find any listings matching your current filters. Try adjusting your search criteria.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="discover-grid"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {listings.map((item, index) => (
                  <motion.div
                    key={item?.id || item?._id || index}
                    variants={cardVariants}
                    className="h-full"
                  >
                    {item?.type === 'ROOMMATE' ? (
                      <RoommateCard item={item} darkMode={darkMode} />
                    ) : (
                      <HousingCard
                        item={item}
                        darkMode={darkMode}
                        index={index}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            <motion.div
              key="map-placeholder"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl border backdrop-blur-xl"
              style={{
                backgroundColor: theme.surface.glass,
                borderColor: theme.borderColor,
                boxShadow: darkMode
                  ? HOUSING_THEME.shadow.dark.md
                  : HOUSING_THEME.shadow.light.md,
              }}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
                style={{
                  backgroundColor: darkMode
                    ? 'rgba(59, 130, 246, 0.12)'
                    : 'rgba(59, 130, 246, 0.08)',
                  color: HOUSING_THEME.accent.blue.base,
                }}
              >
                <Map className="w-16 h-16" strokeWidth={1.5} />
              </div>
              <h3
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: theme.text.primary }}
              >
                Map View
              </h3>
              <p
                className="text-sm max-w-md"
                style={{ color: theme.text.muted }}
              >
                Coming soon — we&apos;re mapping every corner of campus.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
