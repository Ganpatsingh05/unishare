"use client";

import { useMemo } from 'react';
import { t, HOUSING_THEME } from './housingTheme';
import { motion } from 'framer-motion';
import { Users, MapPin, ArrowRight, Moon, Sparkles, Wallet, BookOpen } from 'lucide-react';
import Link from 'next/link';

/**
 * Generates initials from a given full name
 */
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'RM';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * RoommateCard - A compatibility-focused card for roommate listings.
 * Visually distinct with purple accent styling and trait indicators.
 */
export default function RoommateCard({ item = {}, darkMode = false }) {
  const theme = t(darkMode);
  const purpleAccent = HOUSING_THEME.accent.purple;

  // Extract user details with safe fallbacks
  const userName = item?.user?.name || item?.title || 'Anonymous Roommate';
  const avatarUrl = item?.user?.avatar;
  const initials = getInitials(userName);

  // Generate a consistent compatibility score between 70% and 95%
  const compatibility = useMemo(() => {
    if (!item?.id && !item?.title && !item?.user?.name) {
      return 85;
    }
    const seed = String(item?.id || '') + (item?.user?.name || '') + (item?.title || '');
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const normalized = Math.abs(hash) % 26; // 0 - 25
    return 70 + normalized; // 70 to 95 inclusive
  }, [item?.id, item?.user?.name, item?.title]);

  // Trait resolutions with intelligent fallbacks
  const traits = item?.traits && item.traits.length > 0 ? item.traits : (item?.features || []);
  const trait1 = traits[0] || 'Night Owl';
  const trait2 = traits[1] || 'Clean';
  const trait3 = traits[2] || 'Studious';

  // Budget formatting
  const formattedPrice = item?.price
    ? (typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : item.price)
    : '5,000';

  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: darkMode
          ? '0 14px 32px -4px rgba(124, 58, 237, 0.3), 0 0 20px rgba(124, 58, 237, 0.15)'
          : '0 14px 28px -4px rgba(124, 58, 237, 0.2), 0 0 16px rgba(124, 58, 237, 0.1)',
      }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative flex flex-col justify-between w-full max-w-[360px] mx-auto rounded-2xl p-5 sm:p-6 overflow-hidden transition-colors duration-300 backdrop-blur-xl border group"
      style={{
        backgroundColor: theme.surface.glass,
        borderColor: darkMode ? 'rgba(167, 139, 250, 0.25)' : 'rgba(124, 58, 237, 0.2)',
        boxShadow: darkMode ? theme.shadow.md : '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* ── Top Subtle Purple Radial Glow ── */}
      <div
        className="absolute -top-14 -right-14 w-36 h-36 rounded-full pointer-events-none blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-35"
        style={{ backgroundColor: purpleAccent.base }}
      />

      {/* ── 1. Top Section: Badge ── */}
      <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
          style={{
            backgroundColor: darkMode ? purpleAccent.bgDark : purpleAccent.bg,
            color: darkMode ? purpleAccent.light : purpleAccent.base,
            border: `1px solid ${darkMode ? 'rgba(167, 139, 250, 0.25)' : 'rgba(124, 58, 237, 0.2)'}`,
          }}
        >
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>Looking for a Roommate</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: theme.text.muted }}>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* ── 2. Profile Area: Avatar & Name ── */}
      <div className="flex flex-col items-center text-center my-2 relative z-10">
        <div className="relative mb-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={userName}
              className="w-16 h-16 rounded-full object-cover border-2 shadow-md"
              style={{
                borderColor: darkMode ? purpleAccent.light : purpleAccent.base,
              }}
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md border-2"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)',
                borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)',
              }}
            >
              {initials}
            </div>
          )}

          {/* Verification / Sparkle icon badge */}
          <div
            className="absolute -bottom-1 -right-1 p-1 rounded-full shadow-sm border"
            style={{
              backgroundColor: darkMode ? '#1e1b4b' : '#f5f3ff',
              borderColor: purpleAccent.base,
              color: purpleAccent.base,
            }}
          >
            <Sparkles className="w-3 h-3 fill-current" />
          </div>
        </div>

        <h3
          className="font-bold text-base sm:text-lg leading-tight truncate max-w-full px-2"
          style={{ color: theme.text.primary }}
        >
          {userName}
        </h3>

        {item?.title && item.title !== userName && (
          <p
            className="text-xs font-medium line-clamp-1 mt-1 max-w-[240px]"
            style={{ color: theme.text.muted }}
          >
            {item.title}
          </p>
        )}
      </div>

      {/* ── 3. Compatibility Section ── */}
      <div
        className="my-3 p-3 rounded-xl relative z-10 backdrop-blur-sm"
        style={{
          backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(124, 58, 237, 0.04)',
          border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.08)'}`,
        }}
      >
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold flex items-center gap-1.5" style={{ color: theme.text.secondary }}>
            <Sparkles className="w-3.5 h-3.5" style={{ color: purpleAccent.base }} />
            Compatibility
          </span>
          <span
            className="font-bold text-xs"
            style={{ color: darkMode ? purpleAccent.light : purpleAccent.base }}
          >
            {compatibility}%
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${compatibility}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)',
            }}
          />
        </div>
      </div>

      {/* ── 4. Trait Indicators ── */}
      <div className="grid grid-cols-2 gap-2 my-2 w-full relative z-10">
        {/* Moon Icon + Trait 1 */}
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors overflow-hidden"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
          }}
        >
          <Moon className="w-3.5 h-3.5 shrink-0" style={{ color: purpleAccent.light }} />
          <span className="truncate" style={{ color: theme.text.secondary }}>
            {trait1}
          </span>
        </div>

        {/* Sparkles Icon + Trait 2 */}
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors overflow-hidden"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
          }}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: purpleAccent.light }} />
          <span className="truncate" style={{ color: theme.text.secondary }}>
            {trait2}
          </span>
        </div>

        {/* Wallet Icon + Budget */}
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors overflow-hidden"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
          }}
        >
          <Wallet className="w-3.5 h-3.5 shrink-0" style={{ color: purpleAccent.light }} />
          <span className="truncate" style={{ color: theme.text.secondary }}>
            ₹{formattedPrice}/mo budget
          </span>
        </div>

        {/* BookOpen Icon + Trait 3 */}
        <div
          className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-medium transition-colors overflow-hidden"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'}`,
          }}
        >
          <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: purpleAccent.light }} />
          <span className="truncate" style={{ color: theme.text.secondary }}>
            {trait3}
          </span>
        </div>
      </div>

      {/* ── 5. Location Row ── */}
      <div className="flex items-center gap-1.5 mt-2 mb-4 px-0.5 text-xs relative z-10">
        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: purpleAccent.light }} />
        <span className="truncate font-medium" style={{ color: theme.text.muted }}>
          {item?.location || 'Near Campus'}
        </span>
      </div>

      {/* ── 6. CTA Button ── */}
      <div className="w-full relative z-10">
        <Link
          href={`/housing/${item?.id || ''}`}
          className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.98] group/btn cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            boxShadow: darkMode
              ? '0 4px 14px rgba(124, 58, 237, 0.35)'
              : '0 4px 12px rgba(124, 58, 237, 0.25)',
          }}
        >
          <span>Connect</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
}
