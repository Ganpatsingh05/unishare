"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { t, HOUSING_THEME, BUDGET_RANGES, ROOM_TYPES, CAMPUS_AREAS } from './housingTheme';

export default function HousingFilters({
  darkMode = false,
  filters = { location: '', budget: '', roomType: '', furnished: '', moreFilters: {} },
  onFilterChange = () => {},
  resultCount = 0,
  onReset = () => {},
}) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const barRef = useRef(null);
  const theme = t(darkMode);

  // Safe accessor for moreFilters
  const moreFilters = filters?.moreFilters || {};

  // Active status checks
  const isAreaActive = Boolean(filters?.location);
  const isBudgetActive = Boolean(filters?.budget);
  const isRoomTypeActive = Boolean(filters?.roomType);
  const isFurnishedActive = Boolean(filters?.furnished && filters.furnished !== 'any');
  
  const moreFiltersCount = (
    (moreFilters.gender && moreFilters.gender !== 'any' ? 1 : 0) +
    (moreFilters.roommate && moreFilters.roommate !== 'any' ? 1 : 0)
  );
  const isMoreActive = moreFiltersCount > 0;

  const totalActiveCount = (
    (isAreaActive ? 1 : 0) +
    (isBudgetActive ? 1 : 0) +
    (isRoomTypeActive ? 1 : 0) +
    (isFurnishedActive ? 1 : 0) +
    moreFiltersCount
  );

  const hasActiveFilters = totalActiveCount > 0;

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (barRef.current && !barRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleDropdown = (key) => {
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleMoreFilterChange = (key, value) => {
    const updated = { ...moreFilters, [key]: value };
    onFilterChange('moreFilters', updated);
  };

  // Label resolvers
  const getAreaLabel = () => {
    if (!filters?.location) return 'Area';
    const found = CAMPUS_AREAS.find(
      (a) => a.id === filters.location || a.name.toLowerCase() === filters.location.toLowerCase()
    );
    return found ? found.name : filters.location;
  };

  const getBudgetLabel = () => {
    if (!filters?.budget) return 'Budget';
    const found = BUDGET_RANGES.find((b) => b.value === filters.budget);
    return found ? found.label : filters.budget;
  };

  const getRoomTypeLabel = () => {
    if (!filters?.roomType) return 'Room Type';
    const found = ROOM_TYPES.find((r) => r.value === filters.roomType);
    return found ? found.label : filters.roomType;
  };

  const getFurnishedLabel = () => {
    if (!filters?.furnished || filters.furnished === 'any') return 'Furnished';
    if (filters.furnished === 'yes' || filters.furnished === 'furnished') return 'Furnished';
    if (filters.furnished === 'no' || filters.furnished === 'unfurnished') return 'Unfurnished';
    return `Furnished: ${filters.furnished}`;
  };

  // Button styling helper
  const getFilterButtonStyles = (isActive) => {
    if (isActive) {
      return {
        backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.16)' : 'rgba(59, 130, 246, 0.12)',
        borderColor: darkMode ? 'rgba(96, 165, 250, 0.45)' : 'rgba(59, 130, 246, 0.35)',
        color: darkMode ? '#93c5fd' : '#2563eb',
      };
    }
    return {
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
      borderColor: theme.borderSubtle,
      color: theme.text.primary,
    };
  };

  const dropdownContainerStyles = {
    backgroundColor: darkMode ? '#141829' : '#ffffff',
    borderColor: theme.borderColor,
    boxShadow: darkMode ? HOUSING_THEME.shadow.dark.lg : HOUSING_THEME.shadow.light.lg,
  };

  return (
    <div ref={barRef} className="w-full relative select-none">
      {/* ── DESKTOP & TABLET HORIZONTAL BAR (md and above) ── */}
      <div
        className="hidden md:flex items-center justify-between gap-3 p-2.5 rounded-2xl border backdrop-blur-xl transition-all duration-200"
        style={{
          backgroundColor: theme.surface.glass,
          borderColor: theme.borderColor,
          boxShadow: darkMode ? HOUSING_THEME.shadow.dark.sm : HOUSING_THEME.shadow.light.sm,
        }}
      >
        {/* Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 1. AREA FILTER */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('area')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={getFilterButtonStyles(isAreaActive)}
            >
              <span className="truncate max-w-[130px]">{getAreaLabel()}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  openDropdown === 'area' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'area' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-72 p-2 rounded-xl border z-50 backdrop-blur-xl"
                  style={dropdownContainerStyles}
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-60" style={{ color: theme.text.muted }}>
                    Select Campus Area
                  </div>
                  <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                    {/* All Areas Option */}
                    <button
                      type="button"
                      onClick={() => {
                        onFilterChange('location', '');
                        setOpenDropdown(null);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        !filters?.location ? 'font-medium' : ''
                      }`}
                      style={{
                        backgroundColor: !filters?.location
                          ? darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                          : 'transparent',
                        color: !filters?.location
                          ? darkMode ? '#93c5fd' : '#2563eb'
                          : theme.text.primary,
                      }}
                    >
                      <span>All Areas</span>
                      {!filters?.location && <Check className="w-4 h-4 text-blue-500" />}
                    </button>

                    {CAMPUS_AREAS.map((area) => {
                      const isSelected = filters?.location === area.id || filters?.location === area.name;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => {
                            onFilterChange('location', area.id);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            isSelected ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                              : 'transparent',
                            color: isSelected
                              ? darkMode ? '#93c5fd' : '#2563eb'
                              : theme.text.primary,
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="leading-snug">{area.name}</span>
                            {area.desc && (
                              <span className="text-[11px] opacity-60 leading-tight" style={{ color: theme.text.muted }}>
                                {area.desc}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {area.count !== null && (
                              <span
                                className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                                  color: theme.text.muted,
                                }}
                              >
                                {area.count}
                              </span>
                            )}
                            {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. BUDGET FILTER */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('budget')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={getFilterButtonStyles(isBudgetActive)}
            >
              <span className="truncate max-w-[130px]">{getBudgetLabel()}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  openDropdown === 'budget' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'budget' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-64 p-2 rounded-xl border z-50 backdrop-blur-xl"
                  style={dropdownContainerStyles}
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-60" style={{ color: theme.text.muted }}>
                    Budget Range
                  </div>
                  <div className="space-y-1">
                    {BUDGET_RANGES.map((range) => {
                      const isSelected = (filters?.budget || '') === range.value;
                      return (
                        <button
                          key={range.value || 'all'}
                          type="button"
                          onClick={() => {
                            onFilterChange('budget', range.value);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            isSelected ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                              : 'transparent',
                            color: isSelected
                              ? darkMode ? '#93c5fd' : '#2563eb'
                              : theme.text.primary,
                          }}
                        >
                          <span>{range.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. ROOM TYPE FILTER */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('roomType')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={getFilterButtonStyles(isRoomTypeActive)}
            >
              <span className="truncate max-w-[130px]">{getRoomTypeLabel()}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  openDropdown === 'roomType' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'roomType' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-60 p-2 rounded-xl border z-50 backdrop-blur-xl"
                  style={dropdownContainerStyles}
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-60" style={{ color: theme.text.muted }}>
                    Room Type
                  </div>
                  <div className="space-y-1">
                    {ROOM_TYPES.map((type) => {
                      const isSelected = (filters?.roomType || '') === type.value;
                      return (
                        <button
                          key={type.value || 'all'}
                          type="button"
                          onClick={() => {
                            onFilterChange('roomType', type.value);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            isSelected ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                              : 'transparent',
                            color: isSelected
                              ? darkMode ? '#93c5fd' : '#2563eb'
                              : theme.text.primary,
                          }}
                        >
                          <span>{type.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 4. FURNISHED FILTER */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('furnished')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={getFilterButtonStyles(isFurnishedActive)}
            >
              <span className="truncate max-w-[130px]">{getFurnishedLabel()}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  openDropdown === 'furnished' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'furnished' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-56 p-2 rounded-xl border z-50 backdrop-blur-xl"
                  style={dropdownContainerStyles}
                >
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider opacity-60" style={{ color: theme.text.muted }}>
                    Furnishing
                  </div>
                  <div className="space-y-1">
                    {[
                      { label: 'Any Status', value: '' },
                      { label: 'Furnished', value: 'yes' },
                      { label: 'Unfurnished', value: 'no' },
                    ].map((item) => {
                      const isSelected =
                        item.value === ''
                          ? !filters?.furnished || filters.furnished === 'any'
                          : filters?.furnished === item.value ||
                            (item.value === 'yes' && filters?.furnished === 'furnished') ||
                            (item.value === 'no' && filters?.furnished === 'unfurnished');

                      return (
                        <button
                          key={item.value || 'any'}
                          type="button"
                          onClick={() => {
                            onFilterChange('furnished', item.value);
                            setOpenDropdown(null);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                            isSelected ? 'font-medium' : ''
                          }`}
                          style={{
                            backgroundColor: isSelected
                              ? darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                              : 'transparent',
                            color: isSelected
                              ? darkMode ? '#93c5fd' : '#2563eb'
                              : theme.text.primary,
                          }}
                        >
                          <span>{item.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 5. MORE FILTERS */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('more')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer hover:brightness-105 active:scale-[0.98]"
              style={getFilterButtonStyles(isMoreActive)}
            >
              <span>More</span>
              {moreFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {moreFiltersCount}
                </span>
              )}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 opacity-70 ${
                  openDropdown === 'more' ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {openDropdown === 'more' && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute left-0 top-full mt-2 w-80 p-4 rounded-xl border z-50 backdrop-blur-xl"
                  style={dropdownContainerStyles}
                >
                  <div className="space-y-4">
                    {/* Gender Preference */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70" style={{ color: theme.text.secondary }}>
                        Gender Preference
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                        {[
                          { label: 'Any', value: '' },
                          { label: 'Male', value: 'male' },
                          { label: 'Female', value: 'female' },
                        ].map((opt) => {
                          const isSelected = (moreFilters.gender || '') === opt.value;
                          return (
                            <button
                              key={opt.value || 'any'}
                              type="button"
                              onClick={() => handleMoreFilterChange('gender', opt.value)}
                              className={`py-1.5 text-xs rounded-md font-medium transition-all ${
                                isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? darkMode ? '#3b82f6' : '#2563eb'
                                  : 'transparent',
                                color: isSelected ? '#ffffff' : theme.text.primary,
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Roommate Required */}
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2 opacity-70" style={{ color: theme.text.secondary }}>
                        Roommate Required
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg" style={{ backgroundColor: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
                        {[
                          { label: 'Any', value: '' },
                          { label: 'Yes', value: 'yes' },
                          { label: 'No', value: 'no' },
                        ].map((opt) => {
                          const isSelected = (moreFilters.roommate || '') === opt.value;
                          return (
                            <button
                              key={opt.value || 'any'}
                              type="button"
                              onClick={() => handleMoreFilterChange('roommate', opt.value)}
                              className={`py-1.5 text-xs rounded-md font-medium transition-all ${
                                isSelected ? 'shadow-sm' : 'opacity-70 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: isSelected
                                  ? darkMode ? '#3b82f6' : '#2563eb'
                                  : 'transparent',
                                color: isSelected ? '#ffffff' : theme.text.primary,
                              }}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.borderSubtle }}>
                      <button
                        type="button"
                        onClick={() => {
                          onFilterChange('moreFilters', {});
                        }}
                        className="text-xs font-medium text-red-500 hover:text-red-600 transition-colors"
                      >
                        Reset More
                      </button>
                      <button
                        type="button"
                        onClick={() => setOpenDropdown(null)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Reset & Result Count */}
        <div className="flex items-center gap-3 shrink-0">
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </motion.button>
          )}

          {/* Result Count Pill */}
          <div
            className="px-3 py-1.5 rounded-full text-xs font-medium border"
            style={{
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              borderColor: theme.borderSubtle,
              color: theme.text.muted,
            }}
          >
            <span className="font-semibold" style={{ color: theme.text.primary }}>
              {resultCount}
            </span>{' '}
            results
          </div>
        </div>
      </div>

      {/* ── MOBILE BAR & TRIGGER (below md) ── */}
      <div className="md:hidden flex items-center justify-between gap-2 p-2 rounded-2xl border backdrop-blur-xl"
        style={{
          backgroundColor: theme.surface.glass,
          borderColor: theme.borderColor,
        }}
      >
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-150"
          style={getFilterButtonStyles(hasActiveFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {totalActiveCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
              {totalActiveCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="p-2.5 rounded-xl border text-rose-500 hover:bg-rose-500/10 transition-colors"
            style={{ borderColor: theme.borderSubtle }}
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <div
          className="px-3 py-2 rounded-xl text-xs font-medium border shrink-0"
          style={{
            backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
            borderColor: theme.borderSubtle,
            color: theme.text.muted,
          }}
        >
          <span className="font-semibold" style={{ color: theme.text.primary }}>
            {resultCount}
          </span>{' '}
          results
        </div>
      </div>

      {/* ── MOBILE BOTTOM-SHEET PANEL ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sheet Container */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 w-full max-h-[85vh] flex flex-col rounded-t-3xl border-t shadow-2xl overflow-hidden"
              style={{
                backgroundColor: darkMode ? '#111528' : '#ffffff',
                borderColor: theme.borderColor,
                color: theme.text.primary,
              }}
            >
              {/* Sheet Header */}
              <div
                className="flex items-center justify-between px-6 py-4 border-b shrink-0"
                style={{ borderColor: theme.borderSubtle }}
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-500" />
                  <h3 className="text-base font-bold">Filters</h3>
                  {totalActiveCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-semibold">
                      {totalActiveCount} active
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={onReset}
                      className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1"
                    >
                      Reset All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Sheet Body (Scrollable) */}
              <div className="p-6 space-y-6 overflow-y-auto">
                {/* 1. Area */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                    Campus Area
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onFilterChange('location', '')}
                      className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                        !filters?.location ? 'font-semibold' : ''
                      }`}
                      style={getFilterButtonStyles(!filters?.location)}
                    >
                      All Areas
                    </button>
                    {CAMPUS_AREAS.map((area) => {
                      const isSelected = filters?.location === area.id || filters?.location === area.name;
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => onFilterChange('location', area.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSelected ? 'font-semibold' : ''
                          }`}
                          style={getFilterButtonStyles(isSelected)}
                        >
                          {area.name}
                          {area.count !== null && (
                            <span className="ml-1.5 opacity-60 text-[10px]">({area.count})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Budget */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                    Budget Range
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_RANGES.map((range) => {
                      const isSelected = (filters?.budget || '') === range.value;
                      return (
                        <button
                          key={range.value || 'all'}
                          type="button"
                          onClick={() => onFilterChange('budget', range.value)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSelected ? 'font-semibold' : ''
                          }`}
                          style={getFilterButtonStyles(isSelected)}
                        >
                          {range.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Room Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                    Room Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {ROOM_TYPES.map((type) => {
                      const isSelected = (filters?.roomType || '') === type.value;
                      return (
                        <button
                          key={type.value || 'all'}
                          type="button"
                          onClick={() => onFilterChange('roomType', type.value)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSelected ? 'font-semibold' : ''
                          }`}
                          style={getFilterButtonStyles(isSelected)}
                        >
                          {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Furnished */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                    Furnishing Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Any', value: '' },
                      { label: 'Furnished', value: 'yes' },
                      { label: 'Unfurnished', value: 'no' },
                    ].map((item) => {
                      const isSelected =
                        item.value === ''
                          ? !filters?.furnished || filters.furnished === 'any'
                          : filters?.furnished === item.value ||
                            (item.value === 'yes' && filters?.furnished === 'furnished') ||
                            (item.value === 'no' && filters?.furnished === 'unfurnished');

                      return (
                        <button
                          key={item.value || 'any'}
                          type="button"
                          onClick={() => onFilterChange('furnished', item.value)}
                          className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                            isSelected ? 'font-semibold' : ''
                          }`}
                          style={getFilterButtonStyles(isSelected)}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. More: Gender & Roommate */}
                <div className="pt-2 border-t space-y-4" style={{ borderColor: theme.borderSubtle }}>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                      Gender Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Any', value: '' },
                        { label: 'Male Only', value: 'male' },
                        { label: 'Female Only', value: 'female' },
                      ].map((opt) => {
                        const isSelected = (moreFilters.gender || '') === opt.value;
                        return (
                          <button
                            key={opt.value || 'any'}
                            type="button"
                            onClick={() => handleMoreFilterChange('gender', opt.value)}
                            className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                              isSelected ? 'font-semibold' : ''
                            }`}
                            style={getFilterButtonStyles(isSelected)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.text.secondary }}>
                      Roommate Required
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Any', value: '' },
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ].map((opt) => {
                        const isSelected = (moreFilters.roommate || '') === opt.value;
                        return (
                          <button
                            key={opt.value || 'any'}
                            type="button"
                            onClick={() => handleMoreFilterChange('roommate', opt.value)}
                            className={`py-2 rounded-xl text-xs font-medium border transition-all ${
                              isSelected ? 'font-semibold' : ''
                            }`}
                            style={getFilterButtonStyles(isSelected)}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sheet Footer */}
              <div
                className="p-4 border-t flex items-center gap-3 shrink-0"
                style={{
                  borderColor: theme.borderSubtle,
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-lg shadow-blue-500/25"
                >
                  Show {resultCount} Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
