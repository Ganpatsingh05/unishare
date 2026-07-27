"use client";
import React, { useEffect, useState, useRef } from "react";
import { useUI } from "./../../lib/contexts/UniShareContext";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Ticket, IndianRupee, MapPin, Clock, Music, Search,
  Calendar, Users, Tag, Star, Sparkles, QrCode, Eye, Handshake,
  PartyPopper, Plane, Trophy, Laugh, Drama, Mic, Ferris, ShieldCheck
} from "lucide-react";
import SmallFooter from "./../../_components/layout/SmallFooter";
import { fetchTickets } from "./../../lib/api";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const FONT_STYLE = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const TICKET_STUBS = [
  {
    title: "Browse Tickets",
    description: "Discover event tickets posted by students around campus.",
    href: "/ticket/buy",
    color: "#3b82f6",
    colorLight: "#dbeafe",
    colorDark: "#1e3a5f",
    gradient: "from-blue-500 to-blue-600",
    gradientDark: "from-blue-600 to-blue-700",
    image: "/images/tickets/browse.jpg",
    icon: Search,
  },
  {
    title: "Sell Ticket",
    description: "List your extra tickets and connect with interested buyers.",
    href: "/ticket/sell",
    color: "#f97316",
    colorLight: "#ffedd5",
    colorDark: "#7c2d12",
    gradient: "from-orange-500 to-orange-600",
    gradientDark: "from-orange-600 to-orange-700",
    image: "/images/tickets/sell.jpg",
    icon: Tag,
  },
  {
    title: "My Tickets",
    description: "View and manage your listed or purchased tickets.",
    href: "/ticket/my-tickets",
    color: "#8b5cf6",
    colorLight: "#ede9fe",
    colorDark: "#4c1d95",
    gradient: "from-purple-500 to-purple-600",
    gradientDark: "from-purple-600 to-purple-700",
    image: "/images/tickets/my_tickets.jpg",
    icon: Ticket,
  },
];

const TIMELINE_STEPS = [
  { label: "Find", icon: Search, description: "Browse available events" },
  { label: "Reserve", icon: Ticket, description: "Secure your ticket" },
  { label: "Meet", icon: Handshake, description: "Meet on campus" },
  { label: "Enjoy", icon: PartyPopper, description: "Attend the event" },
];

const TICKET_CARD_ACCENTS = ["#3b82f6", "#f97316", "#8b5cf6", "#10b981"];

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE SVG BACKGROUNDS
// ═══════════════════════════════════════════════════════════════════════════════
const DecorativeBackground = ({ darkMode }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    {/* Giant faint ticket outlines */}
    <svg className="absolute -top-20 -right-32 w-[500px] h-[700px] opacity-[0.04]" viewBox="0 0 200 300" fill="none">
      <rect x="10" y="10" width="180" height="280" rx="16" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="8 4" />
      <circle cx="0" cy="150" r="20" fill={darkMode ? '#111827' : '#f8fafc'} stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" />
      <circle cx="200" cy="150" r="20" fill={darkMode ? '#111827' : '#f8fafc'} stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" />
      {/* Barcode lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={40 + i * 6} y="240" width={i % 3 === 0 ? 3 : 2} height="30" fill={darkMode ? '#fff' : '#000'} />
      ))}
    </svg>

    {/* Second ticket outline — bottom left */}
    <svg className="absolute -bottom-32 -left-20 w-[400px] h-[550px] opacity-[0.03] rotate-12" viewBox="0 0 200 300" fill="none">
      <rect x="10" y="10" width="180" height="280" rx="16" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="8 4" />
      <circle cx="0" cy="150" r="20" fill={darkMode ? '#111827' : '#f8fafc'} stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" />
      <circle cx="200" cy="150" r="20" fill={darkMode ? '#111827' : '#f8fafc'} stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" />
    </svg>

    {/* Confetti dots */}
    {[
      { top: '15%', left: '5%', size: 6, color: '#3b82f6' },
      { top: '25%', right: '8%', size: 4, color: '#f97316' },
      { top: '60%', left: '12%', size: 5, color: '#8b5cf6' },
      { top: '75%', right: '15%', size: 7, color: '#10b981' },
      { top: '45%', left: '88%', size: 4, color: '#f43f5e' },
      { top: '85%', left: '25%', size: 5, color: '#eab308' },
    ].map((dot, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{ top: dot.top, left: dot.left, right: dot.right, width: dot.size, height: dot.size, backgroundColor: dot.color, opacity: 0.15 }}
        animate={{ y: [0, -8, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
      />
    ))}

    {/* Curved stage lines */}
    <svg className="absolute top-1/3 left-0 w-full h-40 opacity-[0.03]" viewBox="0 0 1200 160" fill="none">
      <path d="M0,80 Q300,0 600,80 T1200,80" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
      <path d="M0,100 Q300,20 600,100 T1200,100" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════════
const HeroSection = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative py-12 sm:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Text */}
        <motion.div
          className="flex-1 text-center lg:text-left z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{
              ...FONT_STYLE,
              backgroundColor: darkMode ? 'rgba(139,92,246,0.15)' : 'rgba(139,92,246,0.1)',
              color: darkMode ? '#c4b5fd' : '#7c3aed',
              border: `1px solid ${darkMode ? 'rgba(139,92,246,0.25)' : 'rgba(139,92,246,0.2)'}`,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Ticket className="w-3.5 h-3.5" />
            THE TICKET HALL
          </motion.div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-4"
            style={{ ...FONT_STYLE, letterSpacing: '-0.03em' }}
          >
            <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Never</span>{" "}
            <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Miss an</span>{" "}
            <span style={{ color: darkMode ? '#c4b5fd' : '#8b5cf6' }}>Event.</span>
          </h1>
          <p
            className="text-base sm:text-lg lg:text-xl mb-8 max-w-lg mx-auto lg:mx-0 font-medium"
            style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}
          >
            Exchange tickets within your campus. Find concerts, sports events, festivals, and more — all from fellow students.
          </p>

          <Link href="/ticket/buy">
            <motion.button
              className="px-8 py-4 rounded-2xl text-white font-bold text-base shadow-xl"
              style={{
                ...FONT_STYLE,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -12px rgba(99,102,241,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="flex items-center gap-2">
                Browse Tickets
                <ArrowRight className="w-5 h-5" />
              </span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="flex-1 relative z-10 max-w-md lg:max-w-lg"
          initial={{ opacity: 0, x: 40, rotate: 2 }}
          animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative overflow-visible">
            <Image
              src="/images/tickets/hero.jpg"
              alt="The Ticket Hall"
              width={600}
              height={340}
              className="w-full rounded-3xl"
              style={{
                boxShadow: darkMode
                  ? '0 30px 60px -15px rgba(0,0,0,0.5)'
                  : '0 30px 60px -15px rgba(0,0,0,0.15)',
              }}
              priority
            />
          </div>
          {/* Floating icons — no background, positioned on the outer wrapper */}
          <motion.div
            className="absolute -bottom-4 -left-4 z-30"
            animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Ticket className="w-8 h-8" style={{ color: darkMode ? '#f97316' : '#ea580c' }} />
          </motion.div>
          <motion.div
            className="absolute -top-5 -right-5 z-30"
            animate={{ y: [0, -4, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <Music className="w-7 h-7" style={{ color: darkMode ? '#a78bfa' : '#8b5cf6' }} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATED TIMELINE
// ═══════════════════════════════════════════════════════════════════════════════
const AnimatedTimeline = ({ darkMode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-10 sm:py-14">
      <div className="max-w-3xl mx-auto">
        {/* Desktop — horizontal */}
        <div className="hidden sm:flex items-center justify-between relative">
          {/* Dotted line */}
          <motion.div
            className="absolute top-6 left-[12%] right-[12%] h-0.5"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${darkMode ? '#475569' : '#cbd5e1'} 0px, ${darkMode ? '#475569' : '#cbd5e1'} 6px, transparent 6px, transparent 12px)`,
            }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            style2={{ transformOrigin: "left" }}
          />
          {/* Moving ticket on the line */}
          {isInView && (
            <motion.div
              className="absolute top-3 z-10"
              initial={{ left: '12%' }}
              animate={{ left: ['12%', '88%'] }}
              transition={{ duration: 3, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Ticket className="w-5 h-5" style={{ color: darkMode ? '#a78bfa' : '#8b5cf6' }} />
            </motion.div>
          )}

          {TIMELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex flex-col items-center relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2"
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}
              >
                {React.createElement(step.icon, { className: 'w-5 h-5', style: { color: darkMode ? '#a78bfa' : '#8b5cf6' } })}
              </div>
              <span className="text-sm font-bold" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                {step.label}
              </span>
              <span className="text-[10px] mt-0.5" style={{ ...FONT_STYLE, color: darkMode ? '#64748b' : '#94a3b8' }}>
                {step.description}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Mobile — vertical */}
        <div className="sm:hidden flex flex-col items-center gap-0">
          {TIMELINE_STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
                  border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                }}
              >
                {React.createElement(step.icon, { className: 'w-4 h-4', style: { color: darkMode ? '#a78bfa' : '#8b5cf6' } })}
              </div>
              <div>
                <span className="text-sm font-bold" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                  {step.label}
                </span>
                <span className="text-[10px] block" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                  {step.description}
                </span>
              </div>
              {i < TIMELINE_STEPS.length - 1 && (
                <div className="w-0.5 h-6 mx-auto my-1" style={{ backgroundColor: darkMode ? '#334155' : '#e2e8f0' }} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET STUB CARD
// ═══════════════════════════════════════════════════════════════════════════════
const TicketStubCard = ({ stub, darkMode, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const StubIcon = stub.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
    >
      <Link href={stub.href}>
        <motion.div
          className="group relative cursor-pointer"
          whileHover={{ y: -6, rotate: index === 1 ? -2 : 2, scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Ticket shape */}
          <div
            className="relative rounded-3xl overflow-visible"
            style={{
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              border: `2.5px solid ${darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
              boxShadow: darkMode
                ? `0 20px 40px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`
                : `0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)`,
            }}
          >
            {/* Perforated edge — right side */}
            <div className="absolute top-4 -right-[1px] bottom-4 w-[3px] z-10"
              style={{
                backgroundImage: `repeating-linear-gradient(to bottom, ${darkMode ? '#111827' : '#ffffff'} 0px, ${darkMode ? '#111827' : '#ffffff'} 4px, transparent 4px, transparent 8px)`,
              }}
            />
            {/* Perforated notches — right side semicircles */}
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full z-10"
              style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }}
            />
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 w-6 h-6 rounded-full z-10"
              style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }}
            />

            <div className="flex flex-col sm:flex-row">
              {/* Color accent strip */}
              <div
                className="w-full sm:w-2 h-2 sm:h-auto rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl shrink-0"
                style={{ backgroundColor: stub.color }}
              />

              {/* Content */}
              <div className="flex-1 p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: darkMode ? stub.colorDark + '40' : stub.colorLight,
                      color: stub.color,
                    }}
                  >
                    <StubIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-lg sm:text-xl font-black tracking-tight mb-1"
                      style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}
                    >
                      {stub.title}
                    </h3>
                    <p
                      className="text-sm mb-3 line-clamp-2"
                      style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}
                    >
                      {stub.description}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5"
                      style={{ color: stub.color }}
                    >
                      Get started
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Illustration */}
              <div className="hidden md:flex items-center justify-center w-36 p-3 shrink-0">
                <Image
                  src={stub.image}
                  alt={stub.title}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>

            {/* Bottom barcode strip */}
            <div className="flex items-center gap-0.5 px-6 pb-3 pt-1 opacity-30">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded-sm"
                  style={{
                    width: i % 3 === 0 ? 3 : 2,
                    backgroundColor: darkMode ? '#475569' : '#94a3b8',
                  }}
                />
              ))}
              <span className="ml-auto text-[8px] font-mono" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
                UNISHARE-{String(index + 1).padStart(3, '0')}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINI TICKET CARD (Recent Tickets)
// ═══════════════════════════════════════════════════════════════════════════════
const MiniTicketCard = ({ ticket, darkMode, index }) => {
  const accent = TICKET_CARD_ACCENTS[index % TICKET_CARD_ACCENTS.length];
  const barcodePosition = index % 2 === 0 ? 'left' : 'right';
  const hasCornerFold = index % 3 === 0;

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return "Past event";
  };

  const getEventIcon = (type, cat) => {
    if (cat === 'travel') return Plane;
    switch (type) {
      case 'concert': return Music;
      case 'sports': return Trophy;
      case 'comedy': return Laugh;
      case 'theater': return Drama;
      case 'conference': return Mic;
      case 'festival': return Sparkles;
      default: return Ticket;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href="/ticket/buy">
        <motion.div
          className="group relative cursor-pointer"
          whileHover={{ y: -4, rotateZ: index % 2 === 0 ? 1 : -1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundColor: darkMode ? '#111827' : '#ffffff',
              border: `2px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`,
              boxShadow: darkMode
                ? '0 12px 30px -8px rgba(0,0,0,0.4)'
                : '0 12px 30px -8px rgba(0,0,0,0.08)',
            }}
          >
            {/* Top color accent */}
            <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />

            {/* Perforated notches */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 rounded-full z-10"
              style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }}
            />
            <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 rounded-full z-10"
              style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }}
            />

            <div className="flex">
              {/* Barcode strip — left */}
              {barcodePosition === 'left' && (
                <div className="flex flex-col items-center justify-center gap-[2px] px-2 py-4 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-3 rounded-sm" style={{ height: i % 3 === 0 ? 3 : 2, backgroundColor: darkMode ? '#475569' : '#94a3b8' }} />
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 p-4">
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: accent + '20', color: accent }}>
                    {React.createElement(getEventIcon(ticket.event_type, ticket.category), { className: 'w-3.5 h-3.5' })}
                  </div>
                  <h4
                    className="text-sm font-bold line-clamp-1 flex-1"
                    style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}
                  >
                    {ticket.title || 'Untitled Event'}
                  </h4>
                </div>

                <div className="flex items-center gap-1 text-lg font-black mb-2" style={{ color: accent }}>
                  <IndianRupee className="w-4 h-4" />
                  {ticket.price ?? '0'}
                </div>

                <div className="space-y-1">
                  {ticket.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                      <span className="text-[11px]" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>
                        {ticket.location}
                      </span>
                    </div>
                  )}
                  {ticket.event_date && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                      <span className="text-[11px] font-medium" style={{ ...FONT_STYLE, color: darkMode ? '#a78bfa' : '#7c3aed' }}>
                        {formatEventDate(ticket.event_date)}
                      </span>
                    </div>
                  )}
                </div>

                {/* QR + Seat */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
                  <QrCode className="w-6 h-6 opacity-20 group-hover:opacity-40 transition-opacity" style={{ color: darkMode ? '#94a3b8' : '#64748b' }} />
                  <span className="text-[9px] font-mono font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
                    {ticket.quantity_available ? `${ticket.quantity_available} left` : 'ADMIT ONE'}
                  </span>
                </div>
              </div>

              {/* Barcode strip — right */}
              {barcodePosition === 'right' && (
                <div className="flex flex-col items-center justify-center gap-[2px] px-2 py-4 shrink-0 opacity-40 group-hover:opacity-60 transition-opacity">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="w-3 rounded-sm" style={{ height: i % 3 === 0 ? 3 : 2, backgroundColor: darkMode ? '#475569' : '#94a3b8' }} />
                  ))}
                </div>
              )}
            </div>

            {/* Corner fold */}
            {hasCornerFold && (
              <div
                className="absolute top-0 right-0 w-5 h-5"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${darkMode ? '#1e293b' : '#e2e8f0'} 50%)`,
                }}
              />
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════════
const EmptyTicketState = ({ darkMode }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-12 px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <div
      className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4"
      style={{
        backgroundColor: darkMode ? '#1e293b' : '#f1f5f9',
        border: `2px dashed ${darkMode ? '#334155' : '#cbd5e1'}`,
      }}
    >
      <Ticket className="w-10 h-10" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
    </div>
    <p className="text-base font-semibold mb-1" style={{ ...FONT_STYLE, color: darkMode ? '#e2e8f0' : '#1e293b' }}>
      No recent tickets yet
    </p>
    <p className="text-sm text-center max-w-xs" style={{ ...FONT_STYLE, color: darkMode ? '#64748b' : '#94a3b8' }}>
      Be the first student to sell one. Your listing will appear here!
    </p>
    <Link href="/ticket/sell">
      <motion.button
        className="mt-6 px-6 py-2.5 rounded-xl text-white text-sm font-bold"
        style={{ background: 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        List a Ticket
      </motion.button>
    </Link>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function TicketHubPage() {
  const { darkMode } = useUI();
  const [recentTickets, setRecentTickets] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const recentRef = useRef(null);
  const recentInView = useInView(recentRef, { once: true, margin: "-50px" });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingRecent(true);
        const result = await fetchTickets({ sort: 'created_at', order: 'desc', limit: 4 });
        const list = result?.success ? (result.data || []) : (Array.isArray(result) ? result : (result?.data || []));
        if (!active) return;
        setRecentTickets(Array.isArray(list) ? list.slice(0, 4) : []);
      } catch (e) {
        if (active) setRecentTickets([]);
      } finally {
        if (active) setLoadingRecent(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative transition-colors bg-transparent">
      <DecorativeBackground darkMode={darkMode} />

      <main className="relative flex-1 px-4 sm:px-6 lg:px-8 pb-24" style={{ zIndex: 1 }}>
        <div className="mx-auto max-w-6xl">
          {/* Hero */}
          <HeroSection darkMode={darkMode} />

          {/* Timeline */}
          <AnimatedTimeline darkMode={darkMode} />

          {/* Ticket Stubs */}
          <section className="py-8 sm:py-12">
            <motion.div
              className="text-center mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <h2
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ ...FONT_STYLE, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}
              >
                What would you like to do?
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 max-w-3xl mx-auto">
              {TICKET_STUBS.map((stub, i) => (
                <TicketStubCard key={stub.title} stub={stub} darkMode={darkMode} index={i} />
              ))}
            </div>
          </section>

          {/* Safety tip */}
          <motion.div
            className="max-w-3xl mx-auto rounded-2xl p-4 sm:p-5 mb-10"
            style={{
              backgroundColor: darkMode ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)',
              border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg shrink-0"
                style={{
                  backgroundColor: darkMode ? 'rgba(234,179,8,0.1)' : '#fef9c3',
                  color: darkMode ? '#facc15' : '#a16207',
                }}
              >
                <Star className="w-4 h-4" />
              </div>
              <p className="text-xs sm:text-sm" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>
                <strong>Safety tip:</strong> Meet in public places for ticket exchanges and verify event details before purchasing.
              </p>
            </div>
          </motion.div>

          {/* Recent Tickets */}
          <section ref={recentRef} className="py-8">
            <div className="flex items-center justify-between mb-6">
              <motion.h2
                className="text-xl sm:text-2xl font-bold"
                style={{ ...FONT_STYLE, color: darkMode ? '#f1f5f9' : '#0f172a' }}
                initial={{ opacity: 0, x: -20 }}
                animate={recentInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                Recent Tickets
              </motion.h2>
              <Link
                href="/ticket/buy"
                className="text-sm font-semibold hover:underline"
                style={{ color: darkMode ? '#93c5fd' : '#3b82f6' }}
              >
                Browse all →
              </Link>
            </div>

            {loadingRecent && (
              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Ticket className="w-8 h-8" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
                </motion.div>
              </div>
            )}

            {!loadingRecent && recentTickets.length === 0 && (
              <EmptyTicketState darkMode={darkMode} />
            )}

            {!loadingRecent && recentTickets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {recentTickets.map((t, i) => (
                  <MiniTicketCard key={t.id} ticket={t} darkMode={darkMode} index={i} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}
