"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, MapPin, Home, Building, Users, Plus, ChevronRight,
  X, Shield
} from "lucide-react";
import SmallFooter from '@components/layout/SmallFooter';
import { useUI } from '@contexts/UniShareContext';
import useIsMobile from '@components/ui/useIsMobile';
import {
  UniversityCampus, StudentApartment, PGHostel, IndependentHouse, SharedHouse,
  CoffeeShop, GroceryStore, BusStop, HousingOffice, Vehicle,
  Tree, Bush, StreetLamp, Bench, BicycleRack, Crosswalk, FlowerBed,
  TrashBin, WalkingStudent, TrafficSignal, RoadSign, CampusMapStyles
} from '@features/housing/components/CampusIllustrations';

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const AREAS = [
  {
    id: "law-gate",
    name: "Law Gate",
    listings: 24,
    status: "green",
    statusLabel: "24 listings",
    color: "#f59e0b",
    lightBg: "#fef3c7",
    position: { top: "72%", left: "18%" },
    popupAlign: "center",
    icon: "house",
    desc: "Popular student hub with affordable PGs and rooms.",
  },
  {
    id: "green-valley",
    name: "Green Valley",
    listings: 9,
    status: "yellow",
    statusLabel: "9 listings",
    color: "#10b981",
    lightBg: "#d1fae5",
    position: { top: "55%", left: "64%" },
    popupAlign: "center",
    icon: "apartment",
    desc: "Peaceful locality with modern apartments.",
  },
  {
    id: "phagwara",
    name: "Phagwara City",
    listings: 15,
    status: "green",
    statusLabel: "15 listings",
    color: "#8b5cf6",
    lightBg: "#ede9fe",
    position: { top: "14%", left: "14%" },
    popupAlign: "right",
    icon: "shared",
    desc: "Budget-friendly rooms and shared apartments.",
  },
  {
    id: "model-town",
    name: "Model Town",
    listings: 6,
    status: "blue",
    statusLabel: "6 roommates",
    color: "#3b82f6",
    lightBg: "#dbeafe",
    position: { top: "14%", left: "82%" },
    popupAlign: "left",
    icon: "pg",
    desc: "Premium housing and furnished flats.",
  },
];

const STATUS_COLORS = { green: "#22c55e", yellow: "#eab308", blue: "#3b82f6" };

const AREA_ICONS = {
  house: <Home className="w-5 h-5" style={{ color: "#f59e0b" }} />,
  apartment: <Building className="w-5 h-5" style={{ color: "#10b981" }} />,
  shared: <Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />,
  pg: <Building className="w-5 h-5" style={{ color: "#3b82f6" }} />,
};

// ═══════════════════════════════════════════════════════════════════════════════
// AREA PIN — with bouncing 📍, colored outline, hover zoom
// ═══════════════════════════════════════════════════════════════════════════════

const AreaPin = ({ area, darkMode, isActive, isHighlighted, onClick }) => {
  const statusColor = STATUS_COLORS[area.status];
  const glowing = isActive || isHighlighted;

  return (
    <motion.div
      data-area-pin
      className="absolute cursor-pointer z-20"
      style={{ top: area.position.top, left: area.position.left }}
      onClick={() => onClick(area.id)}
      initial={{ scale: 0, y: 20 }}
      animate={{ scale: isActive ? 1.15 : 1, y: 0 }}
      whileHover={{ scale: 1.12, y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="flex flex-col items-center">
        {/* Bouncing 📍 when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -6, 0] }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }, opacity: { duration: 0.2 } }}
              className="absolute -top-10 text-2xl"
              style={{ filter: `drop-shadow(0 4px 6px ${area.color}60)` }}
            >
              📍
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow ring */}
        {glowing && (
          <motion.div
            className="absolute inset-0 -m-3 rounded-full"
            style={{ backgroundColor: `${area.color}15`, border: `2px solid ${area.color}30` }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}

        {/* Icon Container — colored outline when active */}
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 relative overflow-hidden"
          style={{
            backgroundColor: darkMode ? "#1e293b" : area.lightBg,
            border: `3px solid ${glowing ? area.color : darkMode ? "#334155" : "#e2e8f0"}`,
            boxShadow: glowing ? `0 8px 25px ${area.color}50` : undefined,
          }}
        >
          {AREA_ICONS[area.icon]}
        </div>

        {/* Pin triangle */}
        <div className="w-4 h-4 rotate-45 -mt-2.5 border-r-[3px] border-b-[3px]"
          style={{ backgroundColor: darkMode ? "#1e293b" : area.lightBg, borderColor: glowing ? area.color : darkMode ? "#334155" : "#e2e8f0" }}
        />

        {/* Label + Pulse */}
        <div className="mt-1 text-center">
          <p className="text-[11px] sm:text-xs font-black whitespace-nowrap px-2 py-0.5 rounded-full"
            style={{ color: darkMode ? "#f1f5f9" : "#1e293b", backgroundColor: darkMode ? "#0f172a80" : "#ffffff80", ...FONT }}>
            {area.name}
          </p>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
            <span className="text-[9px] font-bold px-1 rounded-sm" style={{ color: statusColor, backgroundColor: darkMode ? "#0f172a40" : "#ffffff40" }}>{area.statusLabel}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// AREA POPUP — Speech-bubble connected to building
// ═══════════════════════════════════════════════════════════════════════════════

const AreaDetailPopup = ({ area, darkMode, onClose }) => {
  // Smart positioning: shift popup so it doesn't overflow edges
  const align = area?.popupAlign || "center";
  const translateX = align === "left" ? "calc(-80%)" : align === "right" ? "calc(-20%)" : "translate(-50%)";
  // Arrow position mirrors the popup shift
  const arrowLeft = align === "left" ? "75%" : align === "right" ? "25%" : "50%";

  return (
    <AnimatePresence>
      {area && (
        <motion.div
          data-area-popup
          className="absolute z-30 pointer-events-none"
          style={{ top: area.position.top, left: area.position.left, transform: `translateX(${align === "center" ? "-50%" : align === "left" ? "-75%" : "-25%"}) translateY(-100%)`, marginTop: "-50px" }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="relative pointer-events-auto filter drop-shadow-2xl">
            <div className="w-64 rounded-2xl overflow-hidden" style={{ backgroundColor: darkMode ? "#1e293b" : "#ffffff", border: `2px solid ${area.color}50` }}>
              <div className="px-4 py-3 border-b flex justify-between items-center" style={{ borderColor: darkMode ? "#334155" : "#f1f5f9", backgroundColor: `${area.color}10` }}>
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-7 h-7 rounded-lg" style={{ backgroundColor: `${area.color}15` }}>{AREA_ICONS[area.icon]}</span>
                  <h3 className="font-bold text-sm" style={{ color: darkMode ? "#f1f5f9" : "#0f172a" }}>{area.name}</h3>
                </div>
                <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                  <X className="w-4 h-4" style={{ color: darkMode ? "#94a3b8" : "#64748b" }} />
                </button>
              </div>
              <div className="p-4">
                <p className="text-xs mb-3 leading-relaxed" style={{ color: darkMode ? "#94a3b8" : "#475569" }}>{area.desc}</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: STATUS_COLORS[area.status] }} />
                  <span className="text-xs font-bold" style={{ color: STATUS_COLORS[area.status] }}>{area.statusLabel}</span>
                </div>
                <Link href={`/housing/search?area=${area.id}`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold text-white transition-transform hover:scale-[1.02] active:scale-95"
                  style={{ backgroundColor: area.color }}>
                  Explore <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {/* Speech bubble arrow — position matches popup alignment */}
            <div className="absolute bottom-0 w-6 h-6 translate-y-[10px] rotate-45 border-b-2 border-r-2"
              style={{ left: arrowLeft, transform: `translateX(-50%) translateY(10px) rotate(45deg)`, backgroundColor: darkMode ? "#1e293b" : "#ffffff", borderColor: `${area.color}50` }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROPERTY OFFICE PIN (Post Listing)
// ═══════════════════════════════════════════════════════════════════════════════

const PropertyOffice = ({ darkMode }) => (
  <Link href="/housing/post" className="group relative flex flex-col items-center cursor-pointer">
    <div className="relative transition-transform duration-500 group-hover:-translate-y-2">
      <div className="w-20 h-4 rounded-t-lg shadow-sm" style={{ backgroundColor: darkMode ? "#475569" : "#94a3b8" }} />
      <div className="w-20 h-16 relative flex flex-col items-center justify-end overflow-hidden" style={{ backgroundColor: darkMode ? "#1e293b" : "#f1f5f9", borderLeft: `3px solid ${darkMode ? "#334155" : "#cbd5e1"}`, borderRight: `3px solid ${darkMode ? "#334155" : "#cbd5e1"}`, borderBottom: `3px solid ${darkMode ? "#334155" : "#cbd5e1"}` }}>
        <div className="absolute top-2 w-14 px-1 py-0.5 rounded text-center" style={{ backgroundColor: darkMode ? "#065f46" : "#d1fae5", border: `1px solid ${darkMode ? "#10b981" : "#6ee7b7"}` }}>
          <motion.span className="text-[7px] font-black" style={{ color: darkMode ? "#6ee7b7" : "#065f46" }}
            animate={{ opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2 }}>OPEN</motion.span>
        </div>
        <div className="w-8 h-10 rounded-t-lg relative overflow-hidden" style={{ backgroundColor: darkMode ? "#78350f" : "#92400e" }}>
          <div className="absolute right-1.5 top-4 w-1 h-1 rounded-full bg-yellow-400" />
          <div className="absolute inset-0 bg-yellow-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </div>
    <p className="mt-2 text-[10px] font-black text-center" style={{ color: darkMode ? "#94a3b8" : "#64748b", ...FONT }}>Housing Office</p>
    <span className="text-[9px] font-bold mt-0.5 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" style={{ backgroundColor: "#10b98120", color: "#10b981" }}>
      Post a listing →
    </span>
  </Link>
);

// ═══════════════════════════════════════════════════════════════════════════════
// HOUSE-SHAPED LISTING CARD
// ═══════════════════════════════════════════════════════════════════════════════

const HouseListingCard = ({ index, darkMode }) => {
  const MOCK = [
    {
      type: "ROOM",
      tag: "Available",
      title: "Private Room Near Law Gate",
      price: "₹6,500",
      period: "/month",
      features: ["🛏 1 Room", "🚿 Attached Bath", "📶 Wi-Fi"],
      location: "Law Gate",
      distance: "5 min walk to LPU",
      availability: "Move in Today",
      user: { name: "Aman Sharma", role: "Verified Student" },
      accent: "folded-corner",
      themeColor: darkMode ? "#38bdf8" : "#0284c7", // Soft Blue
      themeBg: darkMode ? "#0ea5e920" : "#e0f2fe",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
    },
    {
      type: "PG",
      tag: "Girls Only",
      title: "Premium Girls PG",
      price: "₹8,000",
      period: "/month",
      features: ["🛏 2 Sharing", "🚿 Attached Bath", "❄ AC"],
      location: "Green Valley",
      distance: "10 min walk to LPU",
      availability: "From 1st Aug",
      user: { name: "Priya Singh", role: "Verified Owner" },
      accent: "hanging-tag",
      themeColor: darkMode ? "#4ade80" : "#16a34a", // Sage Green
      themeBg: darkMode ? "#22c55e20" : "#dcfce7",
      image: "https://images.unsplash.com/photo-1595526114101-da7b79a5b3a4?auto=format&fit=crop&q=80&w=400",
    },
    {
      type: "ROOMMATE",
      tag: "Roommate Needed",
      title: "Looking for flatmate",
      price: "₹4,500",
      period: "/month",
      features: ["🎓 CSE", "🚹 Male", "🕒 Night Owl"],
      location: "Phagwara City",
      distance: "Auto ride",
      availability: "Immediate",
      user: { name: "Rahul Verma", role: "Verified Student" },
      accent: "house-number",
      themeColor: darkMode ? "#fb923c" : "#ea580c", // Terracotta
      themeBg: darkMode ? "#f9731620" : "#ffedd5",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=400",
    },
    {
      type: "APARTMENT",
      tag: "Available",
      title: "2 BHK Furnished Flat",
      price: "₹12,000",
      period: "/month",
      features: ["🛏 2 BHK", "🛋 Furnished", "📶 Wi-Fi"],
      location: "Model Town",
      distance: "15 min bus to LPU",
      availability: "From 15 July",
      user: { name: "Karan Gupta", role: "Verified Owner" },
      accent: "pin-watermark",
      themeColor: darkMode ? "#facc15" : "#ca8a04", // Muted Yellow
      themeBg: darkMode ? "#eab30820" : "#fef9c3",
      image: "https://images.unsplash.com/photo-1502672260266-1c1e522d6d89?auto=format&fit=crop&q=80&w=400",
    },
  ];
  const item = MOCK[index % MOCK.length];

  return (
    <div className="group relative w-full aspect-[2/3] max-w-[320px] mx-auto rounded-[24px] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{
        backgroundColor: darkMode ? "#1e293b" : "#ffffff", // Warm White / Dark Slate
        border: `1px solid ${darkMode ? "#334155" : "#f1f5f9"}`,
        boxShadow: darkMode ? "0 4px 20px -2px rgba(0,0,0,0.4)" : "0 10px 30px -5px rgba(0,0,0,0.08)",
      }}>
      
      {/* ─── DECORATIVE ACCENTS ─── */}
      {item.accent === "folded-corner" && (
        <div className="absolute top-0 right-0 w-10 h-10 z-30 transition-transform duration-500 group-hover:scale-110 origin-top-right">
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
            <path d="M0,0 L40,40 L0,40 Z" fill={darkMode ? "#334155" : "#e2e8f0"} />
            <path d="M0,0 L40,0 L40,40 Z" fill={darkMode ? "#0f172a" : "#cbd5e1"} opacity="0.3" />
          </svg>
        </div>
      )}
      
      {item.accent === "hanging-tag" && (
        <div className="absolute -top-1 left-12 z-30 transition-transform duration-500 origin-top group-hover:rotate-[8deg]">
          <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
            <path d="M12 0L12 10" stroke="#94a3b8" strokeWidth="1.5" />
            <rect x="4" y="10" width="16" height="24" rx="2" fill={item.themeColor} />
            <circle cx="12" cy="14" r="2" fill={darkMode ? "#1e293b" : "#ffffff"} />
          </svg>
        </div>
      )}

      {item.accent === "house-number" && (
        <div className="absolute top-[35%] -right-1 z-30 px-1.5 py-1 rounded bg-slate-800 text-white text-[9px] font-black shadow-md border-l-2 border-white -rotate-3 transition-transform duration-300 group-hover:rotate-0">
          A-42
        </div>
      )}

      {item.accent === "pin-watermark" && (
        <div className="absolute bottom-20 right-4 z-0 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-6">
          <MapPin className="w-32 h-32" style={{ color: darkMode ? "#ffffff" : "#000000" }} />
        </div>
      )}

      {/* ─── IMAGE SECTION (Top 40%) ─── */}
      <div className="relative w-full h-[40%] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Top-left Overlay */}
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border"
          style={{
            backgroundColor: darkMode ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.85)",
            color: darkMode ? "#f8fafc" : "#334155",
            borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
          }}>
          {item.tag}
        </div>

        {/* Top-right Favorite */}
        <button className="absolute top-3 right-3 z-10 p-1.5 rounded-full backdrop-blur-md bg-white/20 hover:bg-white/40 transition-colors">
          <svg className="w-4 h-4 text-white drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Bottom-right Photos */}
        <div className="absolute bottom-2 right-3 z-10 px-2 py-0.5 rounded text-[9px] font-bold text-white bg-black/40 backdrop-blur-sm">
          6 Photos
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <div className="relative z-10 flex flex-col p-4 h-[60%]">
        
        {/* Type & Title */}
        <div className="mb-3">
          <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2 tracking-wide uppercase"
            style={{ backgroundColor: item.themeBg, color: item.themeColor }}>
            {item.type}
          </div>
          <h3 className="font-bold text-[17px] leading-tight line-clamp-1" style={{ color: darkMode ? "#f8fafc" : "#0f172a" }}>
            {item.title}
          </h3>
        </div>

        {/* Price with marker stroke */}
        <div className="relative inline-block mb-4 self-start">
          {/* Marker SVG */}
          <svg className="absolute -bottom-1 -left-1 w-[110%] h-[12px] -z-10 opacity-60" preserveAspectRatio="none" viewBox="0 0 100 10">
            <path d="M0,5 Q50,0 100,5 Q50,10 0,5 Z" fill={item.themeColor} opacity="0.3" />
          </svg>
          <span className="text-xl font-black" style={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}>{item.price}</span>
          <span className="text-xs font-medium ml-1" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>{item.period}</span>
        </div>

        {/* Quick Details (Icons) */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.features.map((feat, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium"
              style={{ backgroundColor: darkMode ? "#33415550" : "#f1f5f9", color: darkMode ? "#cbd5e1" : "#475569" }}>
              {feat}
            </div>
          ))}
        </div>

        {/* Location & Availability */}
        <div className="space-y-1.5 mb-auto">
          <div className="flex items-center gap-2 text-xs font-medium">
            <span style={{ color: item.themeColor }}>📍</span>
            <span style={{ color: darkMode ? "#e2e8f0" : "#334155" }}>{item.location}</span>
            <span className="text-gray-400">•</span>
            <span style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>{item.distance}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium">
            <span style={{ color: item.themeColor }}>📅</span>
            <span style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>{item.type === "ROOMMATE" ? "Available from" : "Move in:"}</span>
            <span style={{ color: darkMode ? "#e2e8f0" : "#334155" }}>{item.availability}</span>
          </div>
        </div>

        {/* Bottom Section (User & CTA) */}
        <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: darkMode ? "#334155" : "#e2e8f0" }}>
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold">
                {item.user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold" style={{ color: darkMode ? "#f8fafc" : "#1e293b" }}>{item.user.name.split(" ")[0]}</span>
              <span className="text-[9px] font-medium" style={{ color: darkMode ? "#94a3b8" : "#64748b" }}>{item.user.role}</span>
            </div>
          </div>
          
          <Link href={`/housing/${index}`} className="flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-bold text-white transition-all hover:scale-105 hover:opacity-90 active:scale-95"
            style={{ backgroundColor: item.themeColor, boxShadow: `0 4px 12px ${item.themeColor}40` }}>
            View Details
          </Link>
        </div>

      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DIRECTION SIGN
// ═══════════════════════════════════════════════════════════════════════════════

const DirectionSign = ({ label, direction, href }) => (
  <Link href={href} className="group transition-transform hover:scale-105 hover:rotate-1">
    <div className="px-5 py-2 font-black text-xs sm:text-sm shadow-lg border-2 whitespace-nowrap"
      style={{
        backgroundColor: "#6b4423", color: "#fef3c7", borderColor: "#451a03",
        clipPath: direction === "left" ? "polygon(12% 0, 100% 0, 100% 100%, 12% 100%, 0 50%)" : "polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%)",
        paddingLeft: direction === "left" ? "1.5rem" : undefined, paddingRight: direction === "right" ? "1.5rem" : undefined,
      }}>
      {direction === "left" ? `← ${label}` : `${label} →`}
    </div>
  </Link>
);

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function HousingHubPage() {
  const { darkMode } = useUI();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [activeArea, setActiveArea] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedArea, setHighlightedArea] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!searchQuery.trim()) { setHighlightedArea(null); return; }
    const match = AREAS.find((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setHighlightedArea(match?.id || null);
  }, [searchQuery]);

  const activeAreaData = AREAS.find((a) => a.id === activeArea);
  const handleAreaClick = (areaId) => setActiveArea((prev) => (prev === areaId ? null : areaId));

  // Close popup on outside click
  useEffect(() => {
    if (!activeArea) return;
    const handleOutsideClick = (e) => {
      // Don't close if clicking on a pin or inside the popup
      if (e.target.closest('[data-area-pin]') || e.target.closest('[data-area-popup]')) return;
      setActiveArea(null);
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [activeArea]);

  return (
    <div className="min-h-screen relative overflow-hidden transition-colors duration-700 bg-transparent">

      {/* ═══ DECORATIVE BACKGROUND — Housing-themed SVG outlines ═══ */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* House outline — top right */}
        <svg className="absolute -top-10 -right-20 w-[420px] h-[500px] opacity-[0.04]" viewBox="0 0 200 240" fill="none">
          <polygon points="100,10 10,80 190,80" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="8 4" />
          <rect x="20" y="80" width="160" height="140" rx="4" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="8 4" />
          <rect x="75" y="150" width="50" height="70" rx="3" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <rect x="35" y="100" width="35" height="30" rx="2" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <rect x="130" y="100" width="35" height="30" rx="2" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <circle cx="118" cy="185" r="3" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
          <rect x="85" y="40" width="8" height="30" fill={darkMode ? '#fff' : '#000'} opacity="0.3" />
        </svg>

        {/* Key outline — bottom left */}
        <svg className="absolute -bottom-16 -left-12 w-[350px] h-[350px] opacity-[0.03] rotate-[25deg]" viewBox="0 0 200 200" fill="none">
          <circle cx="60" cy="60" r="40" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="6 4" />
          <circle cx="60" cy="60" r="15" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <line x1="100" y1="60" x2="190" y2="60" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" />
          <line x1="160" y1="60" x2="160" y2="80" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <line x1="175" y1="60" x2="175" y2="75" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <line x1="190" y1="60" x2="190" y2="80" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
        </svg>

        {/* Apartment outline — mid left */}
        <svg className="absolute top-[40%] -left-24 w-[300px] h-[400px] opacity-[0.025] -rotate-12" viewBox="0 0 120 200" fill="none">
          <rect x="10" y="10" width="100" height="180" rx="4" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="6 4" />
          {[30, 60, 90, 120, 150].map((wy, i) => (
            <g key={i}>
              <rect x="22" y={wy} width="16" height="14" rx="1" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
              <rect x="52" y={wy} width="16" height="14" rx="1" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
              <rect x="82" y={wy} width="16" height="14" rx="1" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
            </g>
          ))}
        </svg>

        {/* Map pin outline — top left */}
        <svg className="absolute top-[8%] left-[8%] w-[100px] h-[140px] opacity-[0.04]" viewBox="0 0 60 80" fill="none">
          <path d="M30,5 C15,5 5,17 5,30 C5,50 30,75 30,75 C30,75 55,50 55,30 C55,17 45,5 30,5 Z" stroke={darkMode ? '#fff' : '#000'} strokeWidth="2" strokeDasharray="4 3" />
          <circle cx="30" cy="28" r="10" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
        </svg>

        {/* Confetti dots */}
        {[
          { top: '12%', left: '4%', size: 6, color: '#f59e0b' },
          { top: '28%', right: '7%', size: 4, color: '#3b82f6' },
          { top: '55%', left: '10%', size: 5, color: '#8b5cf6' },
          { top: '70%', right: '12%', size: 7, color: '#10b981' },
          { top: '42%', left: '90%', size: 4, color: '#ef4444' },
          { top: '88%', left: '22%', size: 5, color: '#eab308' },
        ].map((dot, i) => (
          <div key={i} className="absolute rounded-full"
            style={{ top: dot.top, left: dot.left, right: dot.right, width: dot.size, height: dot.size, backgroundColor: dot.color, opacity: 0.12 }} />
        ))}

        {/* Wavy line — like floor plan lines */}
        <svg className="absolute top-[35%] left-0 w-full h-32 opacity-[0.025]" viewBox="0 0 1200 120" fill="none">
          <path d="M0,60 Q150,10 300,60 T600,60 T900,60 T1200,60" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1.5" />
          <path d="M0,80 Q150,30 300,80 T600,80 T900,80 T1200,80" stroke={darkMode ? '#fff' : '#000'} strokeWidth="1" />
        </svg>

        {/* Stars (dark) / Clouds (light) */}
        {darkMode ? (
          [5,12,25,38,50,63,72,80,88,95].map((left, i) => (
            <div key={i} className="absolute bg-white rounded-full star-twinkle"
              style={{ width: `${1 + (i % 3)}px`, height: `${1 + (i % 3)}px`, top: `${3 + (i * 2.8)}%`, left: `${left}%`, "--star-dur": `${2.5 + (i % 4) * 0.8}s`, "--star-delay": `${(i * 0.3)}s` }} />
          ))
        ) : (
          <>
            <div className="absolute top-16 left-[10%] w-40 h-10 bg-black/[0.02] rounded-full blur-2xl cloud-drift" style={{ "--cloud-dur": "70s", "--cloud-dist": "80px" }} />
            <div className="absolute top-36 right-[15%] w-56 h-12 bg-black/[0.015] rounded-full blur-2xl cloud-drift" style={{ "--cloud-dur": "90s", "--cloud-dist": "-60px" }} />
          </>
        )}
      </div>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 text-center pt-24 sm:pt-28 pb-6 px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', letterSpacing: '-0.03em' }}>
            <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Find Your</span>{" "}
            <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Campus Home</span>
          </h1>
          <p className="text-sm sm:text-base font-medium max-w-md mx-auto mb-8" style={{ color: darkMode ? '#93C5FD' : '#0369a1' }}>
            Explore student neighborhoods around the university.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }} className="max-w-md mx-auto relative">
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border-2 transition-all duration-300"
            style={{
              backgroundColor: darkMode ? "#1e293b" : "#ffffff",
              borderColor: highlightedArea ? AREAS.find((a) => a.id === highlightedArea)?.color || "#e2e8f0" : darkMode ? "#334155" : "#e2e8f0",
              boxShadow: highlightedArea ? `0 0 20px ${AREAS.find((a) => a.id === highlightedArea)?.color || "#38bdf8"}30` : undefined,
            }}>
            <MapPin className="w-5 h-5 shrink-0" style={{ color: darkMode ? "#64748b" : "#94a3b8" }} />
            <input type="text" placeholder="Jump to an area..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none font-bold text-sm w-full" style={{ color: darkMode ? "#f1f5f9" : "#1e293b" }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                <X className="w-4 h-4" style={{ color: darkMode ? "#64748b" : "#94a3b8" }} />
              </button>
            )}
          </div>
          <AnimatePresence>
            {searchQuery.trim() && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                className="absolute top-full mt-2 w-full rounded-xl shadow-2xl border-2 overflow-hidden z-50"
                style={{ backgroundColor: darkMode ? "#1e293b" : "#ffffff", borderColor: darkMode ? "#334155" : "#e2e8f0" }}>
                {AREAS.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map((area) => (
                  <button key={area.id} onClick={() => { setActiveArea(area.id); setSearchQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ backgroundColor: `${area.color}15` }}>{AREA_ICONS[area.icon]}</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: darkMode ? "#f1f5f9" : "#1e293b" }}>{area.name}</p>
                      <p className="text-[11px]" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>{area.statusLabel}</p>
                    </div>
                    <div className="w-2 h-2 rounded-full ml-auto animate-pulse" style={{ backgroundColor: STATUS_COLORS[area.status] }} />
                  </button>
                ))}
                {AREAS.filter((a) => a.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                  <p className="px-4 py-3 text-sm font-medium" style={{ color: darkMode ? "#64748b" : "#94a3b8" }}>No areas found</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ═══ MAP + SIGNPOST LAYOUT ═══ */}
      <section ref={mapRef} className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8">

          {/* Signpost — left side on desktop, below on mobile */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 order-1 lg:order-none">
            <div className="relative flex flex-col items-center">
              <div className="w-3 h-6 rounded-t-sm" style={{ backgroundColor: "#5c3d1e", borderRight: "2px solid #3e2713" }} />
              <div className="flex flex-col gap-2">
                <DirectionSign label="Rooms" direction="left" href="/housing/search?type=room" />
                <DirectionSign label="PGs" direction="right" href="/housing/search?type=pg" />
                <DirectionSign label="Roommates" direction="left" href="/housing/search?type=roommate" />
                <DirectionSign label="Apartments" direction="right" href="/housing/search?type=apartment" />
              </div>
              <div className="w-3 h-20" style={{ backgroundColor: "#5c3d1e", borderRight: "2px solid #3e2713" }} />
              <div className="w-12 h-4 rounded-full blur-[1px] -mt-2" style={{ backgroundColor: darkMode ? "#064e3b" : "#34d399" }} />
            </div>
          </div>

          {/* Map — right side on desktop, full width on mobile */}
          <div className="relative w-full flex-1 rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl transition-all duration-700"
            style={{
              backgroundColor: darkMode ? "#0a0f1d" : "#7dd3fc",
              border: `6px solid ${darkMode ? "#1e293b" : "#ffffff"}`,
              aspectRatio: isMobile ? "3/4" : "16/9",
            }}>

          {/* SVG Map */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            {/* Sky / Base */}
            <rect x={0} y={0} width={800} height={500} fill={darkMode ? "#0a0f1d" : "#7dd3fc"} />
            {/* Ground */}
            <rect x={0} y={200} width={800} height={300} fill={darkMode ? "#0f172a" : "#d5ecd0"} />
            {/* Grass patches */}
            <ellipse cx={120} cy={320} rx={100} ry={50} fill={darkMode ? "#0a162850" : "#c6e7be"} />
            <ellipse cx={650} cy={380} rx={120} ry={60} fill={darkMode ? "#0a162840" : "#c6e7be80"} />

            {/* ─── ROADS ─── */}
            <rect x={0} y={260} width={800} height={45} fill={darkMode ? "#1e293b" : "#bbb5a6"} />
            <line x1={0} y1={282} x2={800} y2={282} stroke={darkMode ? "#334155" : "#d6d3cd"} strokeWidth={1.5} strokeDasharray="14 10" />
            <rect x={0} y={258} width={800} height={2} rx={0.5} fill={darkMode ? "#334155" : "#94a3b8"} opacity={0.6} />
            <rect x={0} y={305} width={800} height={2} rx={0.5} fill={darkMode ? "#334155" : "#94a3b8"} opacity={0.6} />

            {/* Vertical road */}
            <rect x={370} y={200} width={35} height={300} fill={darkMode ? "#1e293b" : "#bbb5a6"} />
            <line x1={387} y1={200} x2={387} y2={500} stroke={darkMode ? "#334155" : "#d6d3cd"} strokeWidth={1.5} strokeDasharray="10 8" />

            {/* ─── SIDEWALKS ─── */}
            <rect x={0} y={254} width={800} height={6} rx={1} fill={darkMode ? "#1e293b" : "#e2e8f0"} />
            <rect x={0} y={305} width={800} height={6} rx={1} fill={darkMode ? "#1e293b" : "#e2e8f0"} />

            {/* ─── CROSSWALKS ─── */}
            <Crosswalk x={370} y={268} width={35} darkMode={darkMode} />

            {/* ─── BUILDINGS ─── */}
            <UniversityCampus x={310} y={110} scale={1.1} darkMode={darkMode} />
            <SharedHouse x={60} y={120} scale={0.9} darkMode={darkMode} hovered={activeArea === "phagwara" || highlightedArea === "phagwara"} />
            <PGHostel x={640} y={95} scale={0.7} darkMode={darkMode} hovered={activeArea === "model-town" || highlightedArea === "model-town"} />
            <IndependentHouse x={80} y={330} scale={0.9} darkMode={darkMode} hovered={activeArea === "law-gate" || highlightedArea === "law-gate"} />
            <StudentApartment x={520} y={310} scale={0.75} darkMode={darkMode} hovered={activeArea === "green-valley" || highlightedArea === "green-valley"} />

            {/* ─── AMENITY BUILDINGS ─── */}
            <CoffeeShop x={250} y={315} scale={0.7} darkMode={darkMode} />
            <GroceryStore x={440} y={320} scale={0.65} darkMode={darkMode} />
            <HousingOffice x={430} y={400} scale={0.75} darkMode={darkMode} hovered={false} />

            {/* ─── BUS STOP ─── */}
            <BusStop x={200} y={310} scale={0.85} darkMode={darkMode} />

            {/* ─── TREES ─── */}
            <Tree x={280} y={245} scale={0.9} darkMode={darkMode} variant={0} />
            <Tree x={265} y={250} scale={0.7} darkMode={darkMode} variant={1} />
            <Tree x={620} y={440} scale={1} darkMode={darkMode} variant={0} />
            <Tree x={640} y={445} scale={0.8} darkMode={darkMode} variant={2} />
            <Tree x={655} y={442} scale={0.6} darkMode={darkMode} variant={1} />
            <Tree x={550} y={210} scale={0.85} darkMode={darkMode} variant={1} />
            <Tree x={535} y={215} scale={0.6} darkMode={darkMode} variant={0} />
            <Tree x={750} y={310} scale={0.7} darkMode={darkMode} variant={2} />
            <Tree x={30} y={440} scale={0.8} darkMode={darkMode} variant={0} />

            {/* ─── BUSHES ─── */}
            <Bush x={40} y={305} scale={0.7} darkMode={darkMode} />
            <Bush x={760} y={308} scale={0.6} darkMode={darkMode} />
            <Bush x={500} y={255} scale={0.5} darkMode={darkMode} />
            <Bush x={170} y={255} scale={0.6} darkMode={darkMode} />

            {/* ─── STREET LAMPS ─── */}
            <StreetLamp x={120} y={236} scale={0.8} darkMode={darkMode} />
            <StreetLamp x={320} y={236} scale={0.8} darkMode={darkMode} />
            <StreetLamp x={550} y={236} scale={0.8} darkMode={darkMode} />
            <StreetLamp x={720} y={236} scale={0.8} darkMode={darkMode} />

            {/* ─── BENCHES ─── */}
            <Bench x={265} y={250} scale={0.6} darkMode={darkMode} />
            <Bench x={640} y={455} scale={0.6} darkMode={darkMode} />

            {/* ─── BICYCLE RACKS ─── */}
            <BicycleRack x={200} y={315} scale={0.7} darkMode={darkMode} />

            {/* ─── FLOWER BEDS ─── */}
            <FlowerBed x={150} y={252} scale={0.6} darkMode={darkMode} />
            <FlowerBed x={600} y={252} scale={0.5} darkMode={darkMode} />

            {/* ─── TRASH BINS ─── */}
            <TrashBin x={230} y={252} scale={0.6} darkMode={darkMode} />
            <TrashBin x={680} y={252} scale={0.6} darkMode={darkMode} />

            {/* ─── TRAFFIC SIGNAL ─── */}
            <TrafficSignal x={365} y={240} scale={0.7} darkMode={darkMode} />

            {/* ─── ROAD SIGN ─── */}
            <RoadSign x={420} y={240} scale={0.6} darkMode={darkMode} text="30" />

            {/* ─── MOVING VEHICLES ─── */}
            <Vehicle type="scooter" y={268} speed={12} darkMode={darkMode} delay={0} />
            <Vehicle type="bicycle" y={288} speed={17} darkMode={darkMode} delay={3} />
            <Vehicle type="hatchback" y={272} speed={22} darkMode={darkMode} delay={7} />
            <Vehicle type="shuttle" y={280} speed={28} darkMode={darkMode} delay={12} />

            {/* ─── WALKING STUDENTS ─── */}
            <WalkingStudent x={350} y={256} direction={1} darkMode={darkMode} speed={9} />
            <WalkingStudent x={500} y={310} direction={-1} darkMode={darkMode} speed={12} />
            <WalkingStudent x={380} y={248} direction={1} darkMode={darkMode} speed={14} />

            {/* ─── CONTOUR LINES ─── */}
            <path d="M 50 400 Q 200 380 400 400 Q 600 420 750 390" fill="none" stroke={darkMode ? "#1e293b" : "#b8d4b0"} strokeWidth={0.5} opacity={0.3} />
            <path d="M 80 440 Q 300 420 500 450 Q 700 470 780 430" fill="none" stroke={darkMode ? "#1e293b" : "#b8d4b0"} strokeWidth={0.5} opacity={0.2} />
          </svg>

          {/* Flying birds (light mode) — CSS animated */}
          {!darkMode && (
            <div className="absolute top-[8%] left-0 text-sm opacity-30 pointer-events-none z-30 bird-fly">∼ ∼</div>
          )}

          {/* Area Pins */}
          {AREAS.map((area) => (
            <AreaPin key={area.id} area={area} darkMode={darkMode} isActive={activeArea === area.id} isHighlighted={highlightedArea === area.id} onClick={handleAreaClick} />
          ))}

          {/* Property Office Pin */}
          <div className="absolute z-20" style={{ top: "80%", left: "55%" }}>
            <PropertyOffice darkMode={darkMode} />
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-3 px-3 py-2 rounded-xl text-[10px] font-bold"
            style={{ backgroundColor: darkMode ? "#1e293bdd" : "#ffffffdd", color: darkMode ? "#94a3b8" : "#64748b", border: `1px solid ${darkMode ? "#334155" : "#e2e8f0"}`, backdropFilter: "blur(8px)" }}>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#22c55e]" /> Active</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#eab308]" /> Few</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Roommates</span>
          </div>
          </div>

          {/* Area Detail Popup — OUTSIDE overflow:hidden so it’s never clipped */}
          <AnimatePresence>
            {activeAreaData && <AreaDetailPopup area={activeAreaData} darkMode={darkMode} onClose={() => setActiveArea(null)} />}
          </AnimatePresence>

        </div>

        {/* Mobile-only signpost (below map) */}
        <div className="flex lg:hidden flex-col items-center mt-8">
          <div className="relative flex flex-col items-center">
            <div className="w-3 h-6 rounded-t-sm" style={{ backgroundColor: "#5c3d1e", borderRight: "2px solid #3e2713" }} />
            <div className="flex flex-col gap-2">
              <DirectionSign label="Rooms" direction="left" href="/housing/search?type=room" />
              <DirectionSign label="PGs" direction="right" href="/housing/search?type=pg" />
              <DirectionSign label="Roommates" direction="left" href="/housing/search?type=roommate" />
              <DirectionSign label="Apartments" direction="right" href="/housing/search?type=apartment" />
            </div>
            <div className="w-3 h-20" style={{ backgroundColor: "#5c3d1e", borderRight: "2px solid #3e2713" }} />
            <div className="w-12 h-4 rounded-full blur-[1px] -mt-2" style={{ backgroundColor: darkMode ? "#064e3b" : "#34d399" }} />
          </div>
        </div>
      </section>

      {/* ═══ RECENT LISTINGS ═══ */}
      <section className="relative z-10 px-4 sm:px-6 py-14 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl sm:text-3xl font-black" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif', letterSpacing: '-0.03em' }}>
            <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Recent</span>{" "}
            <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Additions</span>
          </h2>
          <Link href="/housing/search" className="flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {[0, 1, 2, 3].map((i) => <HouseListingCard key={i} index={i} darkMode={darkMode} />)}
        </div>
      </section>

      {/* ═══ NOTICE BOARD ═══ */}
      <section className="relative z-10 px-4 py-16 flex justify-center" style={{ backgroundColor: darkMode ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.03)" }}>
        <div className="relative w-full max-w-lg">
          <div className="p-3 rounded-lg shadow-2xl border-4" style={{ backgroundColor: "#78350f", borderColor: "#451a03" }}>
            <div className="rounded p-6 min-h-[200px] relative" style={{ backgroundColor: "#fcd34d", backgroundImage: "radial-gradient(#d97706 1px, transparent 1px)", backgroundSize: "10px 10px" }}>
              <h3 className="text-lg sm:text-xl font-black text-center mb-5 pb-2" style={{ color: "#78350f", borderBottom: "2px solid #d9770640" }}>
                📌 Neighborhood Notice Board
              </h3>
              <div className="flex flex-col gap-4">
                <div className="bg-[#fef08a] p-3 rounded shadow-md -rotate-2 w-4/5 mx-auto border border-[#fde047] relative hover:rotate-0 transition-transform cursor-default">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm" />
                  <p className="text-sm font-bold text-slate-800 mt-2 text-center">12 New Rooms Listed Today!</p>
                </div>
                <div className="bg-[#bbf7d0] p-3 rounded shadow-md rotate-2 w-3/4 ml-auto mr-4 border border-[#86efac] relative hover:-rotate-1 transition-transform cursor-default">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full shadow-sm" />
                  <p className="text-xs font-bold text-slate-800 mt-2 text-center">4 students looking for roommates in Green Valley</p>
                </div>
                <div className="bg-[#e9d5ff] p-3 rounded shadow-md -rotate-1 w-3/5 mx-auto border border-[#c4b5fd] relative hover:rotate-0 transition-transform cursor-default">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-500 rounded-full shadow-sm" />
                  <p className="text-xs font-bold text-slate-800 mt-2 text-center">New PG opens near Law Gate!</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-8 left-12 w-4 h-12 -z-10" style={{ backgroundColor: "#5c3d1e" }} />
          <div className="absolute -bottom-8 right-12 w-4 h-12 -z-10" style={{ backgroundColor: "#5c3d1e" }} />
        </div>
      </section>

      {/* ═══ SAFETY TIP ═══ */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 py-14">
        <div className="flex items-start gap-3 rounded-2xl border-2 p-5" style={{ backgroundColor: darkMode ? 'rgba(30,41,59,0.5)' : 'rgba(241,245,249,0.8)', borderColor: darkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.3)' }}>
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: darkMode ? 'rgba(251,191,36,0.1)' : '#fef3c7' }}>
            <Shield className="w-5 h-5" style={{ color: darkMode ? '#facc15' : '#d97706' }} />
          </div>
          <div>
            <p className="text-sm font-bold mb-1">
              <span style={{ color: darkMode ? '#facc15' : '#d97706' }}>Safety tip:</span>
            </p>
            <p className="text-xs leading-relaxed" style={{ color: darkMode ? '#38bdf8' : '#0369a1' }}>
              Meet in public places for viewings and verify student IDs when possible. Never share financial information before meeting in person.
            </p>
          </div>
        </div>
      </section>

      <SmallFooter />
      <CampusMapStyles />
    </div>
  );
}
