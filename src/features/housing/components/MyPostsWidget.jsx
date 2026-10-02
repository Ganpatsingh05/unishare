"use client";

import React from 'react';
import { t, HOUSING_THEME } from './housingTheme';
import { motion } from 'framer-motion';
import { Home, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function MyPostsWidget({ darkMode = false, userRooms = null }) {
  const theme = t(darkMode);

  // Status counts derived from userRooms
  const hasRooms = Array.isArray(userRooms) && userRooms.length > 0;

  const activeCount = hasRooms
    ? userRooms.filter((r) => {
        const s = (r?.status || '').toLowerCase().trim();
        return !s || s === 'active' || s === 'available';
      }).length
    : 0;

  const pendingCount = hasRooms
    ? userRooms.filter((r) => {
        const s = (r?.status || '').toLowerCase().trim();
        return s === 'pending';
      }).length
    : 0;

  const closedCount = hasRooms
    ? userRooms.filter((r) => {
        const s = (r?.status || '').toLowerCase().trim();
        return s === 'closed' || s === 'unavailable';
      }).length
    : 0;

  const greenAccent = HOUSING_THEME.accent.green;
  const yellowAccent = HOUSING_THEME.accent.yellow;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-[320px] rounded-2xl p-4 backdrop-blur-md flex flex-col justify-between transition-all duration-200"
      style={{
        backgroundColor: theme.surface.glass,
        borderColor: theme.borderColor,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: theme.shadow?.sm || '0 2px 8px rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: theme.borderSubtle }}>
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: darkMode ? greenAccent.bgDark : greenAccent.bg,
              color: darkMode ? greenAccent.light : greenAccent.base,
            }}
          >
            <Home className="w-4 h-4" />
          </div>
          <h3
            className="font-semibold text-base tracking-tight"
            style={{ color: theme.text.primary }}
          >
            Your Spaces
          </h3>
        </div>

        {hasRooms && (
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
              color: theme.text.muted,
            }}
          >
            {userRooms.length} {userRooms.length === 1 ? 'space' : 'spaces'}
          </span>
        )}
      </div>

      {/* Body Content */}
      <div className="py-3.5">
        {hasRooms ? (
          <div className="grid grid-cols-3 gap-2">
            {/* Active Pill */}
            <div
              className="flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all"
              style={{
                backgroundColor: darkMode ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.05)',
                borderColor: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: greenAccent.base }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: darkMode ? greenAccent.light : greenAccent.base }}
                >
                  {activeCount}
                </span>
              </div>
              <span
                className="text-[11px] font-medium leading-tight"
                style={{ color: theme.text.secondary }}
              >
                Active
              </span>
            </div>

            {/* Pending Pill */}
            <div
              className="flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all"
              style={{
                backgroundColor: darkMode ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.05)',
                borderColor: darkMode ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)',
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: yellowAccent.base }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: darkMode ? yellowAccent.light : yellowAccent.base }}
                >
                  {pendingCount}
                </span>
              </div>
              <span
                className="text-[11px] font-medium leading-tight"
                style={{ color: theme.text.secondary }}
              >
                Pending
              </span>
            </div>

            {/* Closed Pill */}
            <div
              className="flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all"
              style={{
                backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                borderColor: theme.borderSubtle,
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: darkMode ? '#64748b' : '#94a3b8' }}
                />
                <span
                  className="text-sm font-bold"
                  style={{ color: theme.text.secondary }}
                >
                  {closedCount}
                </span>
              </div>
              <span
                className="text-[11px] font-medium leading-tight"
                style={{ color: theme.text.muted }}
              >
                Closed
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-1 py-1">
            <p
              className="text-xs font-normal"
              style={{ color: theme.text.muted }}
            >
              No listings yet
            </p>
            <Link
              href="/housing/post"
              className="inline-flex items-center gap-1 text-xs font-medium transition-colors hover:underline"
              style={{ color: darkMode ? greenAccent.light : greenAccent.base }}
            >
              <span>Post your first space</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="pt-2 border-t" style={{ borderColor: theme.borderSubtle }}>
        <Link
          href="/my-activity"
          className="group flex items-center justify-between text-xs font-medium py-1 transition-colors"
          style={{ color: theme.text.secondary }}
        >
          <span className="group-hover:text-blue-500 transition-colors">
            Manage My Posts
          </span>
          <ArrowRight
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
            style={{ color: theme.text.muted }}
          />
        </Link>
      </div>
    </motion.div>
  );
}
