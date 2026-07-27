"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Search, Plus, Tag, MapPin, IndianRupee, Calendar, AlertCircle, Loader,
  X, Clock, Users, Ticket, CheckCircle, Phone, Instagram, Mail, Link2,
  Trash2, Edit3, Music, Trophy, Laugh, Drama, Mic, Sparkles, Plane,
  ArrowRight, QrCode, Printer, BadgeCheck, Eye, Zap, Shield
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useIsMobile from "./../../../_components/ui/useIsMobile";
import { fetchMyTickets, deleteTicket, createTicket, updateTicket, formatContactInfo } from "./../../../lib/api";
import SmallFooter from "./../../../_components/layout/SmallFooter";
import {
  useAuth,
  useMessages,
  useUI
} from "./../../../lib/contexts/UniShareContext";
import { TicketNotifications } from "./../../../lib/utils/actionNotifications";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════
const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const EVENT_TYPES = [
  { value: "concert", label: "Concert", icon: Music },
  { value: "sports", label: "Sports", icon: Trophy },
  { value: "comedy", label: "Comedy", icon: Laugh },
  { value: "theater", label: "Theatre", icon: Drama },
  { value: "conference", label: "Conference", icon: Mic },
  { value: "other", label: "Other", icon: Sparkles },
];

const TICKET_TYPES = ["General", "Standard", "Premium", "VIP", "Front Row"];

const CATEGORIES = [
  { value: "event", label: "Event", icon: Ticket },
  { value: "travel", label: "Travel", icon: Plane },
  { value: "other", label: "Other", icon: Tag },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE BG
// ═══════════════════════════════════════════════════════════════════════════════
const DecorBg = ({ darkMode }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    <svg className={`absolute -top-20 -right-40 w-[600px] h-[800px] ${darkMode ? 'opacity-[0.06]' : 'opacity-[0.08]'}`} viewBox="0 0 200 300" fill="none">
      <rect x="10" y="10" width="180" height="280" rx="16" stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" strokeDasharray="8 4" />
      <circle cx="0" cy="150" r="18" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
      <circle cx="200" cy="150" r="18" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#94a3b8' : '#475569'} strokeWidth="1.5" />
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE TICKET PREVIEW — Left panel
// ═══════════════════════════════════════════════════════════════════════════════
const LiveTicketPreview = ({ darkMode, title, price, eventType, venue, location, eventDate, ticketType, description, category, progress }) => {
  const getIcon = (t) => ({ concert: Music, sports: Trophy, comedy: Laugh, theater: Drama, conference: Mic }[t] || Ticket);
  const EventIcon = getIcon(eventType);
  const serial = `UNI-${String(Date.now()).slice(-4)}`;
  const formatD = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

  // Ticket "emerges" as progress increases
  const clipPct = Math.min(100, 15 + progress * 0.85);

  return (
    <div className="sticky top-8">
      {/* Printer status */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: progress > 0 ? '#10b981' : '#64748b' }} />
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ ...FONT, color: darkMode ? '#64748b' : '#94a3b8' }}>
          {progress === 0 ? 'Printer Ready' : progress >= 100 ? 'Ticket Complete' : 'Printing...'}
        </span>
      </div>

      {/* Progress bar — printer status */}
      <div className="mb-5 rounded-full overflow-hidden h-1.5" style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f97316)' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <p className="text-[10px] font-mono font-bold mb-5 text-center" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
        {Math.round(progress)}% — {progress >= 100 ? 'Ready to print' : 'Fill details to print'}
      </p>

      {/* The actual ticket — clips reveal as user fills fields */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        style={{
          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
          border: `2px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
          boxShadow: darkMode ? '0 20px 60px -12px rgba(0,0,0,0.5)' : '0 20px 60px -12px rgba(0,0,0,0.1)',
          clipPath: `inset(0 0 ${100 - clipPct}% 0 round 24px)`,
        }}
        animate={{ clipPath: `inset(0 0 ${100 - clipPct}% 0 round 24px)` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Accent strip */}
        <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f97316)' }} />

        {/* Event image placeholder */}
        <div className="relative w-full aspect-[2/1] overflow-hidden" style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <EventIcon className="w-12 h-12 mb-1" style={{ color: darkMode ? '#334155' : '#cbd5e1' }} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>
              {category === 'travel' ? 'Travel' : eventType || 'Event'}
            </span>
          </div>
          {/* Category ribbon */}
          {eventType && (
            <motion.div
              className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-bold flex items-center gap-1"
              style={{ backgroundColor: darkMode ? '#8b5cf620' : '#8b5cf615', color: '#8b5cf6' }}
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {React.createElement(EventIcon, { className: 'w-2.5 h-2.5' })}
              {eventType}
            </motion.div>
          )}
        </div>

        {/* Perforation */}
        <div className="relative flex items-center" style={{ height: 0 }}>
          <div className="absolute -left-[9px] w-[18px] h-[18px] rounded-full z-10" style={{ backgroundColor: darkMode ? '#0f172a' : '#f0f4f8' }} />
          <div className="flex-1 border-t-2 border-dashed mx-3" style={{ borderColor: darkMode ? '#334155' : '#cbd5e1' }} />
          <div className="absolute -right-[9px] w-[18px] h-[18px] rounded-full z-10" style={{ backgroundColor: darkMode ? '#0f172a' : '#f0f4f8' }} />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Title */}
          <div className="mb-3 min-h-[28px]">
            {title ? (
              <motion.h3
                key={title}
                className="text-base font-black line-clamp-2"
                style={{ ...FONT, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {title}
              </motion.h3>
            ) : (
              <div className="h-4 rounded-md" style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0', width: '70%' }} />
            )}
          </div>

          {/* Venue + Date */}
          <div className="space-y-1.5 mb-3 min-h-[40px]">
            {(venue || location) ? (
              <motion.div className="flex items-center gap-1.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <MapPin className="w-3 h-3" style={{ color: '#0ea5e9' }} />
                <span className="text-[11px] font-medium" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>{venue}{venue && location ? ', ' : ''}{location}</span>
              </motion.div>
            ) : (
              <div className="h-3 rounded" style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0', width: '50%' }} />
            )}
            {eventDate ? (
              <motion.div className="flex items-center gap-1.5" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <Calendar className="w-3 h-3" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                <span className="text-[11px]" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>{formatD(eventDate)}</span>
              </motion.div>
            ) : (
              <div className="h-3 rounded mt-1" style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0', width: '40%' }} />
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            {price ? (
              <motion.div
                className="flex items-center gap-0.5"
                style={{ color: '#059669' }}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <IndianRupee className="w-4 h-4" />
                <span className="text-xl font-black" style={{ ...FONT, letterSpacing: '-0.03em' }}>{price}</span>
              </motion.div>
            ) : (
              <div className="h-5 rounded" style={{ backgroundColor: darkMode ? '#1e293b' : '#e2e8f0', width: '25%' }} />
            )}
            {ticketType && ticketType !== 'Standard' && (
              <motion.span
                className="text-[8px] font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: darkMode ? '#1e3a5f' : '#dbeafe', color: darkMode ? '#93c5fd' : '#1d4ed8' }}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
              >
                {ticketType}
              </motion.span>
            )}
          </div>

          {/* Description stub */}
          {description ? (
            <motion.p className="text-[10px] line-clamp-2 mb-3" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {description}
            </motion.p>
          ) : null}

          {/* Bottom barcode */}
          <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
            <div className="flex items-center gap-[1px] opacity-40">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-2.5 rounded-sm" style={{ width: i % 3 === 0 ? 2 : 1.5, backgroundColor: darkMode ? '#475569' : '#94a3b8' }} />
              ))}
            </div>
            <div className="flex items-center gap-1.5 opacity-40">
              <QrCode className="w-4 h-4" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
              <span className="text-[7px] font-mono font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>{serial}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRINTING CONTROLS — Right panel (form)
// ═══════════════════════════════════════════════════════════════════════════════
const PrintingControls = ({
  darkMode, category, setCategory, title, setTitle, price, setPrice,
  eventType, setEventType, eventDate, setEventDate, eventTime, setEventTime,
  venue, setVenue, location, setLocation, quantityAvailable, setQuantityAvailable,
  ticketType, setTicketType, description, setDescription, contacts, setContacts,
  origin, setOrigin, destination, setDestination, travelDate, setTravelDate,
  travelTime, setTravelTime, transportMode, setTransportMode, itemType, setItemType,
  handleSubmit, handleReset, loading, error, clearError, editingTicket
}) => {
  const iconForType = (t) => ({ mobile: Phone, instagram: Instagram, email: Mail, link: Link2 }[t] || Link2);
  const placeholderForType = (t) => ({ mobile: '+91 98765 43210', instagram: '@username', email: 'name@university.edu', link: 'https://...' }[t] || '');
  const addContact = () => setContacts(p => [...p, { id: Date.now(), type: 'mobile', value: '' }]);
  const updateContact = (idx, field, val) => setContacts(p => p.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  const removeContact = (id) => setContacts(p => p.filter(c => c.id !== id));

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2`;
  const inputStyle = {
    ...FONT,
    backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
    borderColor: darkMode ? '#1e293b' : '#e2e8f0',
    color: darkMode ? '#f1f5f9' : '#0f172a',
  };
  const labelStyle = { ...FONT, color: darkMode ? '#64748b' : '#94a3b8' };

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        backgroundColor: darkMode ? '#111827' : '#ffffff',
        border: `2px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: darkMode ? '0 8px 32px -8px rgba(0,0,0,0.3)' : '0 8px 32px -8px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header */}
      <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${darkMode ? '#1e293b' : '#f1f5f9'}` }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <Printer className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black" style={{ ...FONT, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              {editingTicket ? 'Update Ticket' : 'Printing Controls'}
            </h2>
            <p className="text-[10px]" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>Fill each section to print your ticket</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10b981' }} />
          <span className="text-[8px] font-bold uppercase" style={{ color: '#10b981' }}>Online</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-5">
        {/* Error */}
        {error && (
          <div className="p-3 rounded-xl flex items-center gap-2 text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="text-red-500 flex-1">{error}</span>
            <button type="button" onClick={clearError}><X className="w-3 h-3 text-red-500" /></button>
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Category</label>
          <div className="flex gap-2">
            {CATEGORIES.map(cat => {
              const active = category === cat.value;
              return (
                <button key={cat.value} type="button" onClick={() => setCategory(cat.value)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all"
                  style={{
                    backgroundColor: active ? (darkMode ? '#8b5cf6' : '#8b5cf6') : (darkMode ? '#0f172a' : '#f8fafc'),
                    color: active ? '#fff' : (darkMode ? '#94a3b8' : '#64748b'),
                    border: active ? 'none' : `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
                  }}>
                  {React.createElement(cat.icon, { className: 'w-3.5 h-3.5' })} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>
            {category === 'travel' ? 'Trip Title' : 'Event Name'} *
          </label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder={category === 'travel' ? 'e.g., Mumbai to Pune Weekend Ride' : 'e.g., Coldplay Live'}
            className={inputCls} style={inputStyle} required />
        </div>

        {/* Event Type — large cards */}
        {category === 'event' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Event Type *</label>
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map(t => {
                const active = eventType === t.value;
                return (
                  <button key={t.value} type="button" onClick={() => setEventType(t.value)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all"
                    style={{
                      backgroundColor: active ? (darkMode ? '#1e3a5f' : '#dbeafe') : (darkMode ? '#0f172a' : '#f8fafc'),
                      color: active ? (darkMode ? '#93c5fd' : '#1d4ed8') : (darkMode ? '#64748b' : '#94a3b8'),
                      border: `1px solid ${active ? (darkMode ? '#2563eb' : '#93c5fd') : (darkMode ? '#1e293b' : '#e2e8f0')}`,
                    }}>
                    {React.createElement(t.icon, { className: 'w-4 h-4' })} {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {category === 'travel' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Transport *</label>
            <select value={transportMode} onChange={e => setTransportMode(e.target.value)} className={inputCls} style={inputStyle}>
              <option value="bus">Bus</option><option value="train">Train</option><option value="flight">Flight</option><option value="carpool">Car / Ride Share</option><option value="other">Other</option>
            </select>
          </div>
        )}

        {category === 'other' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Item Type</label>
            <input value={itemType} onChange={e => setItemType(e.target.value)} className={inputCls} style={inputStyle} />
          </div>
        )}

        {/* Price — big input */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Price *</label>
          <div className="relative">
            <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#059669' }} />
            <input value={price} onChange={e => setPrice(e.target.value.replace(/[^0-9.]/g, ''))}
              placeholder="250" className={`${inputCls} pl-10 text-lg font-black`}
              style={{ ...inputStyle, letterSpacing: '-0.02em' }} required />
          </div>
        </div>

        {/* Date & Time */}
        {category === 'event' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Date *</label>
              <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                className={inputCls} style={inputStyle} min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Time</label>
              <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)}
                className={inputCls} style={inputStyle} />
            </div>
          </div>
        )}

        {category === 'travel' && (<>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Origin *</label>
              <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="From" className={inputCls} style={inputStyle} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Destination *</label>
              <input value={destination} onChange={e => setDestination(e.target.value)} placeholder="To" className={inputCls} style={inputStyle} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Travel Date *</label>
              <input type="date" value={travelDate} onChange={e => setTravelDate(e.target.value)} className={inputCls} style={inputStyle} min={new Date().toISOString().split('T')[0]} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Travel Time</label>
              <input type="time" value={travelTime} onChange={e => setTravelTime(e.target.value)} className={inputCls} style={inputStyle} />
            </div>
          </div>
        </>)}

        {/* Venue / Location */}
        {category === 'event' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Venue *</label>
              <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Stadium / Hall" className={inputCls} style={inputStyle} required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>City *</label>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City" className={inputCls} style={inputStyle} required />
            </div>
          </div>
        )}

        {category === 'other' && (
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Location / City *</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="City" className={inputCls} style={inputStyle} required />
          </div>
        )}

        {/* Quantity + Ticket Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Quantity *</label>
            <input type="number" min="1" max="50" value={quantityAvailable} onChange={e => setQuantityAvailable(e.target.value)}
              className={inputCls} style={inputStyle} required />
          </div>
          {category === 'event' && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Ticket Type</label>
              <div className="flex flex-wrap gap-1.5">
                {TICKET_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setTicketType(t)}
                    className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                    style={{
                      backgroundColor: ticketType === t ? (darkMode ? '#8b5cf6' : '#8b5cf6') : (darkMode ? '#0f172a' : '#f8fafc'),
                      color: ticketType === t ? '#fff' : (darkMode ? '#64748b' : '#94a3b8'),
                      border: ticketType === t ? 'none' : `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`,
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description — sticky note style */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-2" style={labelStyle}>Details</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
            placeholder={category === 'travel' ? 'Meeting point, luggage rules...' : 'Seats, reason for selling...'}
            className={`${inputCls} resize-none`} style={{
              ...inputStyle,
              backgroundColor: darkMode ? '#0f172a' : '#fffef5',
              borderColor: darkMode ? '#1e293b' : '#fde68a',
            }} />
        </div>

        {/* Contacts */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-widest" style={labelStyle}>Contact *</label>
            <button type="button" onClick={addContact} className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Plus className="w-3 h-3 inline mr-0.5" /> Add
            </button>
          </div>
          <div className="space-y-2.5">
            {contacts.map((contact, idx) => {
              const Icon = iconForType(contact.type);
              return (
                <div key={contact.id} className="flex gap-2 items-center">
                  <select value={contact.type} onChange={e => updateContact(idx, 'type', e.target.value)}
                    className="px-2 py-2 rounded-lg border text-[10px] font-bold w-24 shrink-0"
                    style={inputStyle}>
                    <option value="mobile">Mobile</option><option value="instagram">Instagram</option>
                    <option value="email">Email</option><option value="link">Link</option>
                  </select>
                  <div className="relative flex-1">
                    <Icon className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
                    <input value={contact.value} onChange={e => updateContact(idx, 'value', e.target.value)}
                      placeholder={placeholderForType(contact.type)}
                      className={`${inputCls} pl-8 text-xs`} style={inputStyle} />
                  </div>
                  {contacts.length > 1 && (
                    <button type="button" onClick={() => removeContact(contact.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            {loading ? <><Loader className="w-4 h-4 animate-spin" /> Printing...</> : <><Printer className="w-4 h-4" /> {editingTicket ? 'Reprint Ticket' : 'Print Ticket'}</>}
          </button>
          <button type="button" onClick={handleReset} disabled={loading}
            className="px-4 py-3 rounded-xl text-xs font-bold transition-all"
            style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9', color: darkMode ? '#94a3b8' : '#64748b' }}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET DESK — My tickets list
// ═══════════════════════════════════════════════════════════════════════════════
const TicketDesk = ({ darkMode, tickets, onEdit, onDelete, deletingId }) => {
  const getStatusStyle = (s) => ({
    active: { bg: darkMode ? '#064e3b' : '#d1fae5', color: darkMode ? '#6ee7b7' : '#065f46', label: 'ACTIVE' },
    sold: { bg: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#94a3b8' : '#64748b', label: 'SOLD' },
    expired: { bg: darkMode ? '#450a0a' : '#fee2e2', color: darkMode ? '#fca5a5' : '#991b1b', label: 'EXPIRED' },
  }[s] || { bg: darkMode ? '#1e293b' : '#e2e8f0', color: darkMode ? '#94a3b8' : '#64748b', label: s?.toUpperCase() || 'DRAFT' });

  if (tickets.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-black mb-5" style={{ ...FONT, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
        <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Your</span>{' '}
        <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Ticket Desk</span>
      </h2>
      <div className="space-y-3">
        {tickets.map((ticket, i) => {
          const status = getStatusStyle(ticket.status);
          return (
            <motion.div
              key={ticket.id}
              className="rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                border: `2px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                boxShadow: darkMode ? '0 4px 16px -4px rgba(0,0,0,0.3)' : '0 4px 16px -4px rgba(0,0,0,0.06)',
                transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)`,
              }}
              whileHover={{ rotate: 0, y: -4, boxShadow: darkMode ? '0 12px 32px -4px rgba(0,0,0,0.4)' : '0 12px 32px -4px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold truncate" style={{ ...FONT, color: darkMode ? '#f1f5f9' : '#0f172a' }}>{ticket.title}</h3>
                    {/* Ink stamp status */}
                    <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest shrink-0"
                      style={{ backgroundColor: status.bg, color: status.color, transform: 'rotate(-2deg)' }}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>
                    <span className="flex items-center gap-1 font-bold" style={{ color: '#059669' }}>
                      <IndianRupee className="w-3 h-3" />{ticket.price}
                    </span>
                    {ticket.venue && <span className="truncate">{ticket.venue}</span>}
                    {ticket.event_date && <span>{new Date(ticket.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => onEdit(ticket)} className="p-2 rounded-lg transition-colors"
                    style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
                    <Edit3 className="w-3.5 h-3.5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }} />
                  </button>
                  <button onClick={() => onDelete(ticket.id)} disabled={deletingId === ticket.id}
                    className="p-2 rounded-lg transition-colors hover:bg-red-500/10 disabled:opacity-50">
                    {deletingId === ticket.id ? <Loader className="w-3.5 h-3.5 animate-spin text-red-500" /> : <Trash2 className="w-3.5 h-3.5 text-red-500" />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function TicketSellPage() {
  const { isAuthenticated } = useAuth();
  const { error, success, loading, setError, clearError, setLoading, showTemporaryMessage } = useMessages();
  const { darkMode } = useUI();
  const isMobile = useIsMobile();

  const [myTickets, setMyTickets] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [deletingTicket, setDeletingTicket] = useState(null);

  // Form state
  const [category, setCategory] = useState('event');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [eventType, setEventType] = useState('concert');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [venue, setVenue] = useState('');
  const [location, setLocation] = useState('');
  const [quantityAvailable, setQuantityAvailable] = useState('1');
  const [ticketType, setTicketType] = useState('Standard');
  const [description, setDescription] = useState('');
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [travelTime, setTravelTime] = useState('');
  const [transportMode, setTransportMode] = useState('bus');
  const [itemType, setItemType] = useState('General');

  useEffect(() => {
    if (!eventDate) { const t = new Date(); t.setDate(t.getDate() + 1); setEventDate(t.toISOString().split('T')[0]); }
    if (!travelDate) { const t = new Date(); t.setDate(t.getDate() + 1); setTravelDate(t.toISOString().split('T')[0]); }
  }, [eventDate, travelDate]);

  useEffect(() => {
    if (editingTicket) {
      setCategory(editingTicket.category || 'event');
      setTitle(editingTicket.title || '');
      setPrice(editingTicket.price?.toString() || '');
      setEventType(editingTicket.event_type || 'concert');
      setVenue(editingTicket.venue || '');
      setLocation(editingTicket.location || '');
      setQuantityAvailable(editingTicket.quantity_available?.toString() || '1');
      setTicketType(editingTicket.ticket_type || 'Standard');
      setDescription(editingTicket.description || '');
      setOrigin(editingTicket.origin || '');
      setDestination(editingTicket.destination || '');
      setTransportMode(editingTicket.transport_mode || 'bus');
      setItemType(editingTicket.item_type || 'General');
      if (editingTicket.event_date) {
        const d = new Date(editingTicket.event_date);
        setEventDate(d.toISOString().split('T')[0]);
        setEventTime(d.toISOString().split('T')[1]?.slice(0, 5) || '');
      }
      if (editingTicket.travel_date) {
        const d = new Date(editingTicket.travel_date);
        setTravelDate(d.toISOString().split('T')[0]);
        setTravelTime(d.toISOString().split('T')[1]?.slice(0, 5) || '');
      }
      if (editingTicket.contact_info && typeof editingTicket.contact_info === 'object') {
        const arr = Object.entries(editingTicket.contact_info).map(([type, value], i) => ({ id: i + 1, type, value }));
        setContacts(arr.length > 0 ? arr : [{ id: 1, type: 'mobile', value: '' }]);
      }
    }
  }, [editingTicket]);

  // Calculate progress
  const progress = useMemo(() => {
    let p = 0;
    if (title.trim()) p += 20;
    if (price) p += 20;
    if (category === 'event') {
      if (venue.trim()) p += 15;
      if (location.trim()) p += 10;
      if (eventDate) p += 15;
    } else if (category === 'travel') {
      if (origin.trim()) p += 15;
      if (destination.trim()) p += 10;
      if (travelDate) p += 15;
    } else {
      if (location.trim()) p += 20;
      p += 20; // no venue needed
    }
    if (contacts.some(c => c.value.trim())) p += 20;
    return Math.min(100, p);
  }, [title, price, venue, location, eventDate, origin, destination, travelDate, contacts, category]);

  // API calls
  useEffect(() => { if (isAuthenticated) fetchMyTicketData(); }, [isAuthenticated]);

  const fetchMyTicketData = async () => {
    try {
      setLoading(true);
      const result = await fetchMyTickets();
      if (result.success) setMyTickets(result.data || []);
      else { setMyTickets([]); if (result.error) setError(result.error); }
      clearError();
    } catch (err) { setError("Failed to fetch your tickets"); setMyTickets([]); } finally { setLoading(false); }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      setDeletingTicket(ticketId);
      const result = await deleteTicket(ticketId);
      if (result.success) { setMyTickets(prev => prev.filter(t => t.id !== ticketId)); showTemporaryMessage(result.message || "Ticket deleted", "success"); }
      else throw new Error(result.message || "Failed to delete");
    } catch (err) { setError(err.message); } finally { setDeletingTicket(null); }
  };

  const handleReset = () => {
    setCategory('event'); setTitle(''); setPrice(''); setEventType('concert'); setEventDate(''); setEventTime('');
    setVenue(''); setLocation(''); setQuantityAvailable('1'); setTicketType('Standard'); setDescription('');
    setContacts([{ id: 1, type: 'mobile', value: '' }]); setOrigin(''); setDestination(''); setTravelDate('');
    setTravelTime(''); setTransportMode('bus'); setItemType('General'); setEditingTicket(null); clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { setError('Please log in to create a ticket listing'); return; }
    setLoading(true); clearError();
    try {
      if (!title.trim()) throw new Error('Title is required');
      if (!price || isNaN(price) || parseFloat(price) <= 0) throw new Error('Valid price is required');
      if (!quantityAvailable || parseInt(quantityAvailable) <= 0) throw new Error('Valid quantity is required');
      if (category === 'event') { if (!venue.trim()) throw new Error('Venue is required'); if (!location.trim()) throw new Error('City is required'); if (!eventDate) throw new Error('Event date is required'); }
      if (category === 'travel') { if (!origin.trim()) throw new Error('Origin is required'); if (!destination.trim()) throw new Error('Destination is required'); if (!travelDate) throw new Error('Travel date is required'); }
      if (category === 'other') { if (!location.trim()) throw new Error('Location/City is required'); }
      const dt = (d, t) => t ? `${d}T${t}:00.000Z` : `${d}T09:00:00.000Z`;
      const eventDateTime = dt(eventDate, eventTime);
      const travelDateTime = dt(travelDate, travelTime);
      const contactInfo = formatContactInfo(contacts);
      if (Object.keys(contactInfo).length === 0) throw new Error('At least one contact method is required');
      const base = { title: title.trim(), price: parseFloat(price), category, quantity_available: parseInt(quantityAvailable), description: description.trim(), contact_info: contactInfo };
      let payload = { ...base };
      if (category === 'event') payload = { ...payload, event_type: eventType, event_date: eventDateTime, venue: venue.trim(), location: location.trim(), ticket_type: ticketType };
      else if (category === 'travel') payload = { ...payload, origin: origin.trim(), destination: destination.trim(), travel_date: travelDateTime, transport_mode: transportMode, event_date: travelDateTime, venue: `${origin.trim()} → ${destination.trim()}`, location: destination.trim(), event_type: 'travel' };
      else payload = { ...payload, item_type: itemType, location: location.trim(), event_type: 'other', event_date: eventDateTime || new Date().toISOString() };

      let result;
      if (editingTicket) {
        result = await updateTicket(editingTicket.id, payload);
        if (result.success) { TicketNotifications.ticketUpdated(); showTemporaryMessage(`"${result.data.title}" updated!`, true, 3500); handleReset(); fetchMyTicketData(); }
        else throw new Error(result.message || 'Failed to update');
      } else {
        result = await createTicket(payload);
        if (result.success) { TicketNotifications.ticketListed(result.data.title); showTemporaryMessage(`"${result.data.title}" created!`, true, 3500); handleReset(); fetchMyTicketData(); }
        else throw new Error(result.message || 'Failed to create');
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <Ticket className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black mb-3" style={{ ...FONT, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>Login Required</h2>
        <p className="text-sm mb-6" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>You need to be logged in to print tickets</p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>Login</Link>
          <Link href="/ticket/buy" className="px-6 py-3 rounded-xl text-sm font-bold" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9', color: darkMode ? '#94a3b8' : '#64748b' }}>Browse Tickets</Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <DecorBg darkMode={darkMode} />
      <main className={`relative ${isMobile ? 'px-4 py-5' : 'max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8'}`} style={{ zIndex: 1 }}>
        {/* Hero */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ ...FONT, letterSpacing: '-0.03em' }}>
            <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Ticket</span>{' '}
            <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Printing Studio</span>
          </h1>
          <p className="text-sm font-medium" style={{ ...FONT, color: darkMode ? '#93C5FD' : '#0369a1' }}>
            Create a professional ticket for another student
          </p>
        </motion.div>

        {/* Two column layout: Live Ticket + Controls */}
        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-5'}`}>
          {/* Left — Live ticket (2/5) */}
          <div className={isMobile ? 'order-2' : 'col-span-2'}>
            <LiveTicketPreview
              darkMode={darkMode} title={title} price={price} eventType={eventType}
              venue={venue} location={location} eventDate={eventDate} ticketType={ticketType}
              description={description} category={category} progress={progress}
            />
          </div>

          {/* Right — Printing controls (3/5) */}
          <div className={isMobile ? 'order-1' : 'col-span-3'}>
            <PrintingControls
              darkMode={darkMode} category={category} setCategory={setCategory}
              title={title} setTitle={setTitle} price={price} setPrice={setPrice}
              eventType={eventType} setEventType={setEventType}
              eventDate={eventDate} setEventDate={setEventDate} eventTime={eventTime} setEventTime={setEventTime}
              venue={venue} setVenue={setVenue} location={location} setLocation={setLocation}
              quantityAvailable={quantityAvailable} setQuantityAvailable={setQuantityAvailable}
              ticketType={ticketType} setTicketType={setTicketType}
              description={description} setDescription={setDescription}
              contacts={contacts} setContacts={setContacts}
              origin={origin} setOrigin={setOrigin} destination={destination} setDestination={setDestination}
              travelDate={travelDate} setTravelDate={setTravelDate} travelTime={travelTime} setTravelTime={setTravelTime}
              transportMode={transportMode} setTransportMode={setTransportMode}
              itemType={itemType} setItemType={setItemType}
              handleSubmit={handleSubmit} handleReset={handleReset}
              loading={loading} error={error} clearError={clearError} editingTicket={editingTicket}
            />
          </div>
        </div>

        {/* Ticket Desk — my tickets */}
        <TicketDesk
          darkMode={darkMode}
          tickets={myTickets}
          onEdit={setEditingTicket}
          onDelete={handleDeleteTicket}
          deletingId={deletingTicket}
        />
      </main>
      <SmallFooter />
    </>
  );
}
