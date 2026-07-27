"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search, Tag, MapPin, IndianRupee, Calendar, Phone, Instagram, Mail,
  Link2, AlertCircle, Loader, X, Clock, Users, Plus, Ticket, Music,
  ArrowRight, Heart, Star, CalendarDays, QrCode, BadgeCheck, Shield,
  Zap, Trophy, Laugh, Drama, Mic, Sparkles, Plane, SlidersHorizontal,
  ArrowUpDown, ChevronDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useIsMobile from "./../../../_components/ui/useIsMobile";
import RequestButton from "./../../../_components/forms/RequestButton";
import SmallFooter from "./../../../_components/layout/SmallFooter";
import { fetchTickets } from "./../../../lib/api";
import {
  useAuth,
  useMessages,
  useUI
} from "./../../../lib/contexts/UniShareContext";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const CATEGORIES = [
  { value: "all", label: "All Events", icon: Ticket },
  { value: "event", label: "Events", icon: Music },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "other", label: "Other", icon: Tag },
];

const EVENT_TYPES = [
  { value: "all", label: "All Types", icon: Sparkles },
  { value: "concert", label: "Concerts", icon: Music },
  { value: "sports", label: "Sports", icon: Trophy },
  { value: "comedy", label: "Comedy", icon: Laugh },
  { value: "theater", label: "Theater", icon: Drama },
  { value: "conference", label: "Conference", icon: Mic },
  { value: "other", label: "Other", icon: Tag },
];

const TIME_TABS = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "weekend", label: "This Weekend" },
  { value: "upcoming", label: "Upcoming" },
];

const TICKET_VARIATIONS = [
  { accent: "#3b82f6", accentLight: "#dbeafe", accentDark: "#1e3a5f", label: "Event" },
  { accent: "#f5e6d0", accentLight: "#fdf4e8", accentDark: "#92400e", label: "Cream" },
  { accent: "#f97316", accentLight: "#ffedd5", accentDark: "#9a3412", label: "Festival" },
  { accent: "#1e293b", accentLight: "#334155", accentDark: "#0f172a", label: "VIP" },
  { accent: "#8b5cf6", accentLight: "#ede9fe", accentDark: "#5b21b6", label: "Theatre" },
  { accent: "#10b981", accentLight: "#d1fae5", accentDark: "#065f46", label: "Sports" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const DecorativeBackground = ({ darkMode }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <svg className={`absolute -top-20 -right-40 w-[600px] h-[800px] ${darkMode ? 'opacity-[0.08]' : 'opacity-[0.12]'}`} viewBox="0 0 200 300" fill="none">
      <rect x="10" y="10" width="180" height="280" rx="16" stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" strokeDasharray="8 4" />
      <circle cx="0" cy="150" r="18" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
      <circle cx="200" cy="150" r="18" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={40 + i * 6} y="245" width={i % 3 === 0 ? 3 : 2} height="25" fill={darkMode ? '#94a3b8' : '#475569'} />
      ))}
    </svg>
    <svg className={`absolute -bottom-40 -left-20 w-[400px] h-[550px] rotate-12 ${darkMode ? 'opacity-[0.06]' : 'opacity-[0.10]'}`} viewBox="0 0 200 300" fill="none">
      <rect x="10" y="10" width="180" height="280" rx="16" stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" strokeDasharray="8 4" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const HeroBanner = ({ darkMode, ticketCount }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      className="relative rounded-3xl overflow-hidden mb-8"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #1e1b4b 100%)'
          : 'linear-gradient(135deg, #ede9fe 0%, #dbeafe 50%, #fce7f3 100%)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      <div className="relative z-10 px-6 sm:px-10 py-10 sm:py-14 flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3" style={{ ...FONT, letterSpacing: '-0.03em' }}>
            <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Campus</span>{" "}
            <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Ticket Wall</span>
          </h1>
          <p className="text-sm sm:text-base font-medium mb-1" style={{ ...FONT, color: darkMode ? '#93C5FD' : '#0369a1' }}>
            Browse tickets posted by students around your campus.
          </p>
          {ticketCount > 0 && (
            <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
              {ticketCount} tickets available right now
            </p>
          )}
        </div>
        <motion.div
          className="shrink-0"
          animate={{ y: [0, -6, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ticket className="w-16 h-16 sm:w-20 sm:h-20" style={{ color: darkMode ? '#a78bfa' : '#8b5cf6', opacity: 0.6 }} />
        </motion.div>
      </div>
      {/* Faint barcode strip at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-[2px] px-8 py-2 opacity-10">
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} className="h-3 rounded-sm" style={{ width: i % 3 === 0 ? 3 : 2, backgroundColor: darkMode ? '#fff' : '#000' }} />
        ))}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EVENT PASS MACHINE (FILTER SECTION)
// ═══════════════════════════════════════════════════════════════════════════════
const EventPassMachine = ({
  darkMode, searchValue, setSearchValue, category, setCategory,
  eventType, setEventType, priceRange, setPriceRange, dateTab, setDateTab,
  sort, setSort, handleReset, isAuthenticated
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-3xl mb-8 overflow-hidden"
      style={{
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        border: `2px solid ${darkMode ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}`,
        boxShadow: darkMode ? '0 8px 32px -8px rgba(0,0,0,0.3)' : '0 8px 32px -8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
            <Search className="w-4 h-4" style={{ color: darkMode ? '#a78bfa' : '#8b5cf6' }} />
          </div>
          <h2 className="text-base font-black" style={{ ...FONT, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
            Find Your Event
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <Link href="/ticket/sell" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <Plus className="w-3.5 h-3.5" /> Sell
            </Link>
          )}
          <button onClick={handleReset} className="text-xs font-medium px-3 py-1.5 rounded-xl" style={{ color: darkMode ? '#64748b' : '#94a3b8', backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
            Reset
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 sm:px-6 pb-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
          <input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2"
            style={{
              ...FONT,
              backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
              borderColor: darkMode ? '#1e293b' : '#e2e8f0',
              color: darkMode ? '#f1f5f9' : '#0f172a',
            }}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-5 sm:px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0"
                style={{
                  ...FONT,
                  backgroundColor: active ? (darkMode ? '#8b5cf6' : '#8b5cf6') : (darkMode ? '#1e293b' : '#f1f5f9'),
                  color: active ? '#ffffff' : (darkMode ? '#94a3b8' : '#64748b'),
                  border: active ? 'none' : `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}
              >
                {React.createElement(cat.icon, { className: 'w-3.5 h-3.5' })}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time tabs */}
      <div className="px-5 sm:px-6 pb-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {TIME_TABS.map((tab) => {
            const active = dateTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setDateTab(tab.value)}
                className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all shrink-0"
                style={{
                  ...FONT,
                  backgroundColor: active ? (darkMode ? '#facc15' : '#f59e0b') : 'transparent',
                  color: active ? '#000' : (darkMode ? '#64748b' : '#94a3b8'),
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable filters */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 sm:px-6 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition-colors"
        style={{
          color: darkMode ? '#64748b' : '#94a3b8',
          backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
          borderTop: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}`,
        }}
      >
        <SlidersHorizontal className="w-3 h-3" />
        {expanded ? 'Less filters' : 'More filters'}
        <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderTop: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
              <div>
                <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ ...FONT, color: darkMode ? '#475569' : '#94a3b8' }}>Event Type</label>
                <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-xs" style={{ ...FONT, backgroundColor: darkMode ? '#0f172a' : '#f8fafc', borderColor: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  {EVENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ ...FONT, color: darkMode ? '#475569' : '#94a3b8' }}>Price</label>
                <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-xs" style={{ ...FONT, backgroundColor: darkMode ? '#0f172a' : '#f8fafc', borderColor: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  <option value="all">All Prices</option>
                  <option value="under-500">Under ₹500</option>
                  <option value="500-1000">₹500 – ₹1000</option>
                  <option value="1000-2000">₹1000 – ₹2000</option>
                  <option value="over-2000">Above ₹2000</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ ...FONT, color: darkMode ? '#475569' : '#94a3b8' }}>Sort</label>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-3 py-2 rounded-lg border text-xs" style={{ ...FONT, backgroundColor: darkMode ? '#0f172a' : '#f8fafc', borderColor: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  <option value="recent">Most Recent</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                  <option value="date">Event Date</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold mb-1.5 uppercase tracking-wider" style={{ ...FONT, color: darkMode ? '#475569' : '#94a3b8' }}>Location</label>
                <input placeholder="City" className="w-full px-3 py-2 rounded-lg border text-xs" style={{ ...FONT, backgroundColor: darkMode ? '#0f172a' : '#f8fafc', borderColor: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#e2e8f0' : '#1e293b' }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET CARD — Admission Ticket Style
// ═══════════════════════════════════════════════════════════════════════════════
const TicketCard = ({ ticket, darkMode, index, onClick }) => {
  const variation = TICKET_VARIATIONS[index % TICKET_VARIATIONS.length];
  const isVIP = index % TICKET_VARIATIONS.length === 3;
  const hasFoldedCorner = index % 5 === 0;
  const barcodeOnLeft = index % 2 === 0;
  const serialNum = `UNI-${String(ticket.id || index).slice(-4).padStart(4, '0')}`;

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return "";
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays > 0) return `In ${diffInDays}d`;
    return "Past";
  };

  const getEventIcon = (type, cat) => {
    if (cat === 'travel') return Plane;
    switch (type) {
      case 'concert': return Music;
      case 'sports': return Trophy;
      case 'comedy': return Laugh;
      case 'theater': return Drama;
      case 'conference': return Mic;
      default: return Ticket;
    }
  };
  const EventIcon = getEventIcon(ticket.event_type, ticket.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.06, 0.5) }}
      className="group"
    >
      <motion.div
        className="cursor-pointer relative"
        onClick={() => onClick(ticket)}
        whileHover={{ y: -6, rotate: index % 2 === 0 ? 1.5 : -1.5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            border: `2px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            boxShadow: darkMode
              ? '0 12px 32px -8px rgba(0,0,0,0.5)'
              : '0 4px 24px -4px rgba(0,0,0,0.1)',
          }}
        >
          {/* Top accent strip */}
          <div className="h-1.5 w-full" style={{ backgroundColor: variation.accent }} />

          {/* Image section — 40% of card */}
            <div className="relative aspect-[16/9] w-full overflow-hidden" style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
            {ticket.image_url ? (
              <img
                src={ticket.image_url}
                alt={ticket.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <EventIcon className="w-10 h-10 mb-1" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
                <span className="text-[10px] font-medium capitalize" style={{ color: darkMode ? '#64748b' : '#64748b' }}>{ticket.category || 'event'}</span>
              </div>
            )}

            {/* Available badge — top left */}
            {ticket.quantity_available && (
              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}>
                <Ticket className="w-2.5 h-2.5" />
                {ticket.quantity_available} {ticket.quantity_available === 1 ? 'Ticket' : 'Tickets'}
              </div>
            )}

            {/* Favorite — top right */}
            <button
              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Perforated separator */}
          <div className="relative flex items-center" style={{ height: 0 }}>
            <div className="absolute -left-[9px] w-[18px] h-[18px] rounded-full z-10" style={{ backgroundColor: darkMode ? '#0f172a' : '#f0f4f8' }} />
            <div className="flex-1 border-t-2 border-dashed mx-3" style={{ borderColor: darkMode ? '#475569' : '#cbd5e1' }} />
            <div className="absolute -right-[9px] w-[18px] h-[18px] rounded-full z-10" style={{ backgroundColor: darkMode ? '#0f172a' : '#f0f4f8' }} />
          </div>

          {/* Content section */}
          <div className="p-4 pt-3">
            {/* Category badge */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="px-2 py-0.5 rounded-md text-[9px] font-bold flex items-center gap-1" style={{ backgroundColor: variation.accent + '25', color: darkMode ? variation.accent : variation.accentDark }}>
                {React.createElement(EventIcon, { className: 'w-2.5 h-2.5' })}
                {ticket.event_type || ticket.category || 'Event'}
              </div>
              {ticket.event_date && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: darkMode ? '#422006' : '#fef3c7', color: darkMode ? '#fbbf24' : '#b45309' }}>
                  {formatRelativeDate(ticket.event_date)}
                </span>
              )}
            </div>

            {/* Event name */}
            <h3 className="text-sm font-black line-clamp-1 mb-1.5" style={{ ...FONT, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              {ticket.title || 'Untitled Event'}
            </h3>

            {/* Venue + Date */}
            <div className="space-y-1 mb-3">
              {ticket.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }} />
                  <span className="text-[11px] font-medium" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>
                    {ticket.location}
                  </span>
                </div>
              )}
              {ticket.event_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                  <span className="text-[11px]" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                    {formatEventDate(ticket.event_date)}
                  </span>
                </div>
              )}
            </div>

            {/* Price — large and highlighted */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-0.5" style={{ color: darkMode ? '#10b981' : '#059669' }}>
                <IndianRupee className="w-4 h-4" />
                <span className="text-xl font-black" style={{ ...FONT, letterSpacing: '-0.03em' }}>
                  {ticket.price ?? '0'}
                </span>
              </div>
              {/* Trust chips */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: darkMode ? '#064e3b' : '#d1fae5', color: darkMode ? '#6ee7b7' : '#065f46' }}>
                  <BadgeCheck className="w-2 h-2 inline mr-0.5" />Verified
                </span>
              </div>
            </div>

            {/* Seller + View Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                  {(ticket.users?.name || 'S')[0].toUpperCase()}
                </div>
                <BadgeCheck className="w-3 h-3" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }} />
              </div>
              <button className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all group-hover:scale-105" style={{ background: darkMode ? `linear-gradient(135deg, ${variation.accent}, ${variation.accent}dd)` : 'linear-gradient(135deg, #1e293b, #334155)' }}>
                View Ticket <ArrowRight className="w-3 h-3 inline ml-0.5" />
              </button>
            </div>
          </div>

          {/* Bottom barcode + serial */}
          <div className="flex items-center justify-between px-4 pb-2.5 pt-1 opacity-30 group-hover:opacity-50 transition-opacity">
            <div className="flex items-center gap-[1px]">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="h-2.5 rounded-sm" style={{ width: i % 3 === 0 ? 2.5 : 1.5, backgroundColor: darkMode ? '#475569' : '#94a3b8' }} />
              ))}
            </div>
            <span className="text-[7px] font-mono font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
              {serialNum}
            </span>
          </div>

          {/* Corner fold decoration */}
          {hasFoldedCorner && (
            <div className="absolute top-[6px] right-0 w-4 h-4" style={{ background: `linear-gradient(135deg, transparent 50%, ${darkMode ? '#475569' : '#cbd5e1'} 50%)` }} />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET DETAIL MODAL — Expanded Ticket Design
// ═══════════════════════════════════════════════════════════════════════════════
const TicketDetailModal = ({ ticket, darkMode, onClose, onRequestSent }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString), now = new Date();
    const diff = Math.ceil((d - now) / 86400000);
    if (diff === 0) return "Today"; if (diff === 1) return "Tomorrow"; if (diff > 0) return `In ${diff} days`; return "Past event";
  };
  const getContactIcon = (type) => ({ mobile: Phone, instagram: Instagram, email: Mail, link: Link2 }[type] || Link2);
  const getEventIcon = (type) => ({ concert: Music, sports: Trophy, comedy: Laugh, theater: Drama, conference: Mic }[type] || Ticket);
  const EventIcon = getEventIcon(ticket.event_type);
  const accent = '#8b5cf6';

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-lg max-h-[88vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.92, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Ticket Container */}
        <div
          className="rounded-3xl overflow-hidden relative"
          style={{
            backgroundColor: darkMode ? '#111827' : '#ffffff',
            border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.5)',
          }}
        >
          {/* Top accent strip */}
          <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, #3b82f6, ${accent}, #f97316)` }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-4 w-8 h-8 rounded-full flex items-center justify-center z-20 transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Image section */}
          <div className="relative w-full aspect-[16/9] overflow-hidden" style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
            {ticket.image_url ? (
              <img src={ticket.image_url} alt={ticket.title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <EventIcon className="w-16 h-16 mb-2" style={{ color: darkMode ? '#1e293b' : '#e2e8f0' }} />
                <span className="text-xs font-bold capitalize" style={{ color: darkMode ? '#334155' : '#cbd5e1' }}>{ticket.event_type || ticket.category || 'Event'}</span>
              </div>
            )}
            {/* Gradient overlay at bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 h-16" style={{ background: `linear-gradient(to top, ${darkMode ? '#111827' : '#ffffff'}, transparent)` }} />
          </div>

          {/* Perforated separator with notches */}
          <div className="relative flex items-center" style={{ height: 0, marginTop: -1 }}>
            <div className="absolute -left-[11px] w-[22px] h-[22px] rounded-full z-10" style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.7)' }} />
            <div className="flex-1 border-t-2 border-dashed mx-4" style={{ borderColor: darkMode ? '#1e293b' : '#e2e8f0' }} />
            <div className="absolute -right-[11px] w-[22px] h-[22px] rounded-full z-10" style={{ backgroundColor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.7)' }} />
          </div>

          {/* Content */}
          <div className="px-5 sm:px-6 pt-4 pb-5">
            {/* Title + Badges */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold capitalize flex items-center gap-1" style={{ backgroundColor: accent + '20', color: accent }}>
                  {React.createElement(EventIcon, { className: 'w-2.5 h-2.5' })}
                  {ticket.event_type || 'Event'}
                </span>
                {ticket.ticket_type && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{ backgroundColor: darkMode ? '#1e3a5f' : '#dbeafe', color: darkMode ? '#93c5fd' : '#1d4ed8' }}>
                    {ticket.ticket_type}
                  </span>
                )}
                {ticket.event_date && (
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold" style={{ backgroundColor: darkMode ? '#422006' : '#fef3c7', color: darkMode ? '#fbbf24' : '#b45309' }}>
                    {formatEventDate(ticket.event_date)}
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black leading-tight" style={{ ...FONT, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                {ticket.title || 'Untitled Event'}
              </h2>
            </div>

            {/* Price — big and prominent */}
            <div className="flex items-center justify-between mb-5 px-4 py-3 rounded-2xl" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>Price</p>
                <div className="flex items-center gap-0.5 text-2xl font-black" style={{ ...FONT, letterSpacing: '-0.03em', color: '#10b981' }}>
                  <IndianRupee className="w-5 h-5" />{ticket.price || '0'}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>Available</p>
                <p className="text-sm font-black" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  {ticket.quantity_available || 0} <span className="text-[10px] font-normal" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>tickets</span>
                </p>
              </div>
            </div>

            {/* Event details grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {[
                { icon: CalendarDays, label: 'Event Date', value: ticket.event_date ? formatDate(ticket.event_date) : 'TBA', color: '#3b82f6' },
                { icon: MapPin, label: 'Venue', value: ticket.venue || ticket.location || 'TBA', color: '#8b5cf6' },
                { icon: Clock, label: 'Listed', value: ticket.created_at ? formatDate(ticket.created_at).split(',')[0] : '-', color: '#f97316' },
                { icon: Ticket, label: 'Category', value: ticket.category || 'Event', color: '#10b981' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}>
                  {React.createElement(item.icon, { className: 'w-3.5 h-3.5 shrink-0 mt-0.5', style: { color: item.color } })}
                  <div className="min-w-0">
                    <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>{item.label}</p>
                    <p className="text-[11px] font-semibold truncate" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            {ticket.description && (
              <div className="mb-5">
                <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ ...FONT, color: darkMode ? '#64748b' : '#94a3b8' }}>Description</h3>
                <p className="text-xs leading-relaxed" style={{ ...FONT, color: darkMode ? '#94a3b8' : '#64748b' }}>{ticket.description}</p>
              </div>
            )}

            {/* Contact info */}
            {ticket.contact_info && Object.keys(ticket.contact_info).length > 0 && (
              <div className="mb-5">
                <h3 className="text-xs font-black uppercase tracking-wider mb-2" style={{ ...FONT, color: darkMode ? '#64748b' : '#94a3b8' }}>Contact Seller</h3>
                <div className="space-y-2">
                  {Object.entries(ticket.contact_info).map(([type, value]) => {
                    const Icon = getContactIcon(type);
                    return (
                      <div key={type} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', border: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg, #0ea5e9, #8b5cf6)' }}>
                          <Icon className="w-3 h-3" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[8px] font-bold uppercase tracking-wider capitalize" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>{type}</p>
                          <p className="text-xs font-semibold truncate" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Seller row */}
            <div className="flex items-center justify-between py-3 mb-4 border-t border-b" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}>
                  {(ticket.users?.name || 'S')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-[10px] font-bold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{ticket.users?.name || 'Anonymous'}</p>
                  <p className="text-[8px]" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>Seller</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5" style={{ color: '#0ea5e9' }} />
                <span className="text-[9px] font-bold" style={{ color: '#0ea5e9' }}>Verified</span>
              </div>
            </div>

            {/* Action button */}
            <RequestButton module="ticketsell" itemId={ticket.id} onRequestSent={onRequestSent} className="w-full" />
          </div>

          {/* Bottom barcode strip */}
          <div className="flex items-center justify-between px-6 pb-3 pt-1">
            <div className="flex items-center gap-[1px] opacity-25">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="h-3 rounded-sm" style={{ width: i % 3 === 0 ? 2.5 : 1.5, backgroundColor: darkMode ? '#475569' : '#94a3b8' }} />
              ))}
            </div>
            <div className="flex items-center gap-2 opacity-25">
              <QrCode className="w-5 h-5" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
              <span className="text-[7px] font-mono font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
                UNI-{String(ticket.id || '0000').slice(-4).padStart(4, '0')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function TicketBuyPage() {
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setLoading } = useMessages();
  const { darkMode, searchValue, setSearchValue } = useUI();
  const isMobile = useIsMobile();

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [eventType, setEventType] = useState("all");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [dateTab, setDateTab] = useState("all");
  const [sort, setSort] = useState("recent");

  const fetchTicketData = async () => {
    setLoading(true);
    clearError();
    try {
      const filters = {
        search: searchValue || undefined,
        category: category !== 'all' ? category : undefined,
        event_type: eventType !== 'all' ? eventType : undefined,
        sort: sort === 'recent' ? 'created_at' : sort.replace('-', '_'),
        order: sort.includes('asc') ? 'asc' : 'desc'
      };
      if (priceRange !== 'all') {
        const map = { 'under-500': { max_price: 500 }, '500-1000': { min_price: 500, max_price: 1000 }, '1000-2000': { min_price: 1000, max_price: 2000 }, 'over-2000': { min_price: 2000 } };
        Object.assign(filters, map[priceRange] || {});
      }
      const result = await fetchTickets(filters);
      if (result.success) setTickets(result.data || []);
      else throw new Error(result.message || 'Failed to fetch tickets');
    } catch (err) {
      setError(err.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTicketData(); }, [searchValue, category, eventType, priceRange, dateTab, sort]);

  const handleReset = () => { setSearchValue(""); setEventType("all"); setCategory("all"); setPriceRange("all"); setDateTab("all"); setSort("recent"); clearError(); };

  const handleRequestSent = () => {
    window.dispatchEvent(new CustomEvent('showMessage', { detail: { message: 'Ticket request sent successfully!', type: 'success' } }));
  };

  return (
    <>
      <DecorativeBackground darkMode={darkMode} />

      <main className={`relative ${isMobile ? 'px-4 py-5' : 'max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8'}`} style={{ zIndex: 1 }}>
        {/* Hero */}
        <HeroBanner darkMode={darkMode} ticketCount={tickets.length} />

        {/* Event Pass Machine */}
        <EventPassMachine
          darkMode={darkMode} searchValue={searchValue} setSearchValue={setSearchValue}
          category={category} setCategory={setCategory} eventType={eventType} setEventType={setEventType}
          priceRange={priceRange} setPriceRange={setPriceRange} dateTab={dateTab} setDateTab={setDateTab}
          sort={sort} setSort={setSort} handleReset={handleReset} isAuthenticated={isAuthenticated}
        />

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-sm text-red-500">{error}</span>
            <button onClick={clearError} className="ml-auto"><X className="w-4 h-4 text-red-500" /></button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <Ticket className="w-8 h-8" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
            </motion.div>
          </div>
        )}

        {/* Tickets */}
        {!loading && (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-xs font-bold" style={{ ...FONT, color: darkMode ? '#64748b' : '#94a3b8' }}>
                {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} found
              </p>
            </div>

            {tickets.length === 0 && !error && (
              <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="w-20 h-20 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9', border: `2px dashed ${darkMode ? '#334155' : '#cbd5e1'}` }}>
                  <Ticket className="w-8 h-8" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
                </div>
                <h3 className="text-base font-bold mb-1" style={{ ...FONT, color: darkMode ? '#e2e8f0' : '#1e293b' }}>No tickets found</h3>
                <p className="text-sm mb-4" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>Try adjusting your filters</p>
                <button onClick={handleReset} className="text-sm font-bold" style={{ color: '#3b82f6' }}>Clear all filters</button>
              </motion.div>
            )}

            <div className={`grid gap-5 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              {tickets.map((ticket, i) => (
                <TicketCard key={ticket.id} ticket={ticket} darkMode={darkMode} index={i} onClick={setSelectedTicket} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <TicketDetailModal ticket={selectedTicket} darkMode={darkMode} onClose={() => setSelectedTicket(null)} onRequestSent={handleRequestSent} />
        )}
      </AnimatePresence>
      <SmallFooter />
    </>
  );
}
