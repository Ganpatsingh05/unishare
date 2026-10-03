"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Calendar, Heart, MessageCircle, ChevronDown, CheckCircle, Home, Users, Building, Armchair } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { fetchRooms } from '@features/housing/services/housing.service';

// --- COLORS ---
const COLORS = {
  warmWhite: "#fef7ed",
  cream: "#fffbeb",
  sageGreen: { light: "#dcfce7", dark: "#22c55e", textDark: "#16a34a", textLight: "#4ade80" },
  skyBlue: { light: "#e0f2fe", dark: "#0ea5e9", textDark: "#0284c7", textLight: "#38bdf8" },
  terracotta: { light: "#ffedd5", dark: "#f97316", textDark: "#ea580c", textLight: "#fb923c" },
  mutedYellow: { light: "#fef9c3", dark: "#eab308", textDark: "#ca8a04", textLight: "#facc15" },
  
  // Warm Dark Mode Colors
  darkBg: "#1c1917", // Stone 900
  darkCard: "#292524", // Stone 800
  darkOffset: "#1c1917", // Stone 900
  darkBorder: "#44403c", // Stone 700
  darkText: "#fafaf9", // Stone 50
  darkTextMuted: "#a8a29e", // Stone 400
};

// --- BACKGROUND ---
const NeighborhoodBackground = ({ darkMode }) => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-colors duration-700"
    style={{ backgroundColor: darkMode ? COLORS.darkBg : "#fdfbf7" }}>
    {/* Subtle paths and grass */}
    <svg className="absolute w-full h-full opacity-[0.03] dark:opacity-[0.04]" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ color: darkMode ? '#ffffff' : '#000000' }}>
      <path d="M 0,200 Q 250,220 500,180 T 1000,250" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" />
      <path d="M 0,400 Q 300,350 600,450 T 1000,400" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M 0,600 Q 400,650 700,550 T 1000,600" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 15" />
      <path d="M 0,800 Q 200,850 500,750 T 1000,850" fill="none" stroke="currentColor" strokeWidth="3" />
      
      {/* Trees */}
      <circle cx="150" cy="180" r="20" fill="currentColor" />
      <circle cx="160" cy="190" r="15" fill="currentColor" />
      <circle cx="850" cy="400" r="30" fill="currentColor" />
      <circle cx="830" cy="380" r="25" fill="currentColor" />
      
      {/* Houses */}
      <rect x="400" y="320" width="40" height="30" fill="currentColor" />
      <polygon points="400,320 420,290 440,320" fill="currentColor" />
      <rect x="100" y="700" width="50" height="40" fill="currentColor" />
      <polygon points="100,700 125,660 150,700" fill="currentColor" />
    </svg>
  </div>
);

// --- CATEGORY NAVIGATION ---
const CategoryCards = ({ darkMode, activeCategory, setActiveCategory }) => {
  const categories = [
    { id: 'ROOMS', label: 'Rooms', icon: Home, color: COLORS.skyBlue },
    { id: 'ROOMMATES', label: 'Roommates', icon: Users, color: COLORS.terracotta },
    { id: 'PG', label: 'PGs', icon: Building, color: COLORS.sageGreen },
    { id: 'APARTMENTS', label: 'Apartments', icon: Armchair, color: COLORS.mutedYellow }
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar snap-x">
      {categories.map(cat => {
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`snap-start relative flex-shrink-0 w-32 h-36 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-300 border-2
              ${isActive ? 'scale-105 shadow-xl' : 'hover:-translate-y-1 shadow-md hover:shadow-lg'}`}
            style={{
              backgroundColor: darkMode ? (isActive ? cat.color.dark + '30' : COLORS.darkCard) : (isActive ? cat.color.light : '#ffffff'),
              borderColor: isActive ? cat.color.dark : (darkMode ? COLORS.darkBorder : '#f1f5f9')
            }}
          >
            {/* Tiny roof decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 rounded-b-md opacity-20" style={{ backgroundColor: cat.color.dark }} />
            
            <div className="p-3 rounded-full" style={{ backgroundColor: darkMode ? '#00000030' : '#ffffff80', color: isActive ? cat.color.textLight : (darkMode ? COLORS.darkTextMuted : '#64748b') }}>
              <cat.icon className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm" style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- NEIGHBORHOOD EXPLORER (SEARCH) ---
const NeighborhoodExplorer = ({ darkMode, onSearch }) => {
  return (
    <div className="w-full rounded-[32px] p-6 shadow-2xl relative overflow-hidden transition-colors duration-500"
      style={{ backgroundColor: darkMode ? COLORS.darkCard : '#ffffff', border: `1px solid ${darkMode ? COLORS.darkBorder : '#e2e8f0'}` }}>
      
      {/* Decorative compass/map element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 opacity-5 pointer-events-none">
        <svg viewBox="0 0 100 100" fill={darkMode ? '#ffffff' : '#000000'}>
          <circle cx="50" cy="50" r="45" strokeWidth="2" fill="none" stroke="currentColor" />
          <path d="M50 5 L50 95 M5 50 L95 50" strokeWidth="1" stroke="currentColor" strokeDasharray="4 4" />
          <polygon points="50,15 45,50 50,85 55,50" fill="currentColor" />
        </svg>
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <h2 className="text-xl font-black flex items-center gap-2" style={{ color: darkMode ? COLORS.darkText : '#0f172a' }}>
          <MapPin className="w-6 h-6 text-blue-500" /> Explore Neighborhoods
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Search Locality</label>
            <div className="relative">
              <input type="text" placeholder="e.g. Law Gate, Model Town..." 
                className="w-full pl-4 pr-10 py-4 rounded-2xl text-sm font-semibold outline-none transition-shadow focus:shadow-md"
                style={{ backgroundColor: darkMode ? COLORS.darkBg : '#f8fafc', color: darkMode ? COLORS.darkText : '#1e293b', border: `1px solid ${darkMode ? COLORS.darkBorder : '#e2e8f0'}` }} />
              <Search className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2" style={{ color: darkMode ? COLORS.darkTextMuted : '#94a3b8' }} />
            </div>
          </div>

          <div className="flex-1 relative">
            <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Monthly Rent</label>
            <div className="relative">
              <select className="w-full px-4 py-4 rounded-2xl text-sm font-semibold outline-none appearance-none transition-shadow focus:shadow-md cursor-pointer"
                style={{ backgroundColor: darkMode ? COLORS.darkBg : '#f8fafc', color: darkMode ? COLORS.darkText : '#1e293b', border: `1px solid ${darkMode ? COLORS.darkBorder : '#e2e8f0'}` }}>
                <option value="">Any budget</option>
                <option value="5000">Under ₹5,000</option>
                <option value="8000">₹5,000 - ₹8,000</option>
                <option value="12000">₹8,000 - ₹12,000</option>
                <option value="20000">Above ₹12,000</option>
              </select>
              <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: darkMode ? COLORS.darkTextMuted : '#94a3b8' }} />
            </div>
          </div>
          
          <div className="flex items-end">
            <button onClick={onSearch} className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
              style={{ backgroundColor: darkMode ? '#38bdf8' : '#0284c7' }}>
              Find Homes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- PRESENTATION BOARD CARD ---
const PresentationCard = ({ item, darkMode }) => {
  const isRoommate = item.type === 'ROOMMATE';
  
  // Resolve Theme Colors
  let tColor = COLORS.skyBlue;
  if (item.type === 'PG') tColor = COLORS.sageGreen;
  if (item.type === 'ROOMMATE') tColor = COLORS.terracotta;
  if (item.type === 'APARTMENT') tColor = COLORS.mutedYellow;

  const accentColor = darkMode ? tColor.textLight : tColor.textDark;
  const accentBg = darkMode ? tColor.dark + '20' : tColor.light;

  return (
    <div className="group relative w-full h-[480px] max-w-[340px] mx-auto transition-all duration-500 hover:-translate-y-4" style={{ perspective: '1000px' }}>
      
      {/* ── UNDERLAY INFO SHEET (Offset) ── */}
      <div className="absolute top-2 -right-3 w-full h-[98%] rounded-3xl opacity-50 transition-transform duration-500 group-hover:rotate-2 group-hover:translate-x-1"
        style={{ backgroundColor: darkMode ? COLORS.darkOffset : '#e2e8f0', border: `1px solid ${darkMode ? COLORS.darkCard : '#cbd5e1'}` }} />

      {/* ── MAIN MOUNTED BOARD ── */}
      <div className="absolute inset-0 rounded-[24px] overflow-hidden flex flex-col transition-all duration-500 transform-style-3d group-hover:shadow-2xl"
        style={{
          backgroundColor: darkMode ? COLORS.darkCard : '#fdfbf7', // Warm White / Dark Stone
          border: `1px solid ${darkMode ? COLORS.darkBorder : '#f1f5f9'}`,
          boxShadow: darkMode ? '0 10px 30px -10px rgba(0,0,0,0.6)' : '0 15px 35px -10px rgba(0,0,0,0.1)'
        }}>
        
        {/* ── ACCENTS ── */}
        {item.accent === 'folded' && (
          <div className="absolute top-0 right-0 w-12 h-12 z-30 transition-transform duration-500 group-hover:scale-110 origin-top-right">
            <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-md">
              <path d="M0,0 L40,40 L0,40 Z" fill={darkMode ? COLORS.darkBorder : "#e2e8f0"} />
              <path d="M0,0 L40,0 L40,40 Z" fill={darkMode ? COLORS.darkBg : "#cbd5e1"} opacity="0.3" />
            </svg>
          </div>
        )}

        {item.accent === 'hanging' && (
          <div className="absolute -top-1 left-8 z-30 transition-transform duration-700 origin-top group-hover:rotate-12">
            <svg width="30" height="50" viewBox="0 0 24 40" fill="none" className="drop-shadow-md">
              <path d="M12 0L12 12" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="4" y="12" width="16" height="24" rx="2" fill={accentColor} />
              <circle cx="12" cy="16" r="2" fill={darkMode ? COLORS.darkCard : "#ffffff"} />
            </svg>
          </div>
        )}

        {item.accent === 'blueprint' && (
          <div className="absolute bottom-24 right-4 z-0 opacity-10 transition-transform duration-1000 group-hover:rotate-[15deg] group-hover:scale-110 pointer-events-none">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke={darkMode ? "#ffffff" : "#000000"} strokeWidth="1">
              <rect x="10" y="10" width="80" height="80" />
              <rect x="10" y="10" width="40" height="40" />
              <line x1="50" y1="10" x2="50" y2="90" />
              <line x1="10" y1="50" x2="90" y2="50" />
              <path d="M70,50 A20,20 0 0,0 50,70" strokeDasharray="4 4" />
            </svg>
          </div>
        )}
        
        {/* ── IMAGE SECTION ── */}
        <div className="relative w-full h-[180px] shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img src={item.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400"} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          
          {/* Overlays */}
          <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg"
            style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#0f172a' }}>
            {item.tag || "Available"}
          </div>
          
          <button className="absolute top-4 right-4 z-10 p-2 rounded-full backdrop-blur-md bg-black/20 hover:bg-black/40 transition-colors shadow-lg border border-white/20">
            <Heart className="w-4 h-4 text-white" />
          </button>
          
          {/* Large circular avatar specifically for Roommate overlay */}
          {isRoommate && item.user?.avatar && (
            <div className="absolute -bottom-6 right-4 z-20">
               <img src={item.user.avatar} alt="User" className="w-16 h-16 rounded-full object-cover border-4 shadow-xl" style={{ borderColor: darkMode ? COLORS.darkCard : '#fdfbf7' }} />
            </div>
          )}
        </div>

        {/* ── CONTENT SECTION ── */}
        <div className="relative z-10 flex flex-col p-5 flex-1">
          
          {/* Type Chip */}
          <div className="self-start px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase mb-2 border"
            style={{ backgroundColor: accentBg, color: accentColor, borderColor: darkMode ? accentColor+'40' : accentColor+'20' }}>
            {item.type}
          </div>

          {/* Title */}
          <h3 className="font-black text-lg leading-tight line-clamp-1 mb-2 pr-8" style={{ color: darkMode ? COLORS.darkText : '#0f172a', fontFamily: 'system-ui, sans-serif' }}>
            {item.title}
          </h3>

          {/* Price with Hand-Drawn Marker */}
          <div className="relative inline-block self-start mb-3 mt-1">
            <svg className="absolute -bottom-1 -left-2 w-[120%] h-[14px] -z-10 opacity-70 transition-transform duration-500 group-hover:scale-x-110 origin-left" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M0,5 Q30,-2 70,7 T100,5" stroke={accentColor} strokeWidth="12" strokeLinecap="round" opacity={darkMode ? "0.4" : "0.3"} fill="none" />
            </svg>
            <span className="text-2xl font-black tracking-tight" style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>₹{item.price}</span>
            <span className="text-xs font-semibold ml-1" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>{item.period || "/mo"}</span>
          </div>

          {/* Features / Personality Chips */}
          <div className="flex flex-wrap gap-2 mb-3 max-h-16 overflow-hidden">
            {isRoommate ? (
              (item.traits || []).slice(0,3).map((trait, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-bold border shadow-sm whitespace-nowrap"
                  style={{ backgroundColor: darkMode ? COLORS.darkBg : '#f1f5f9', color: darkMode ? COLORS.darkTextMuted : '#475569', borderColor: darkMode ? COLORS.darkBorder : '#e2e8f0' }}>
                  {trait}
                </span>
              ))
            ) : (
              (item.features || []).slice(0,3).map((feat, i) => (
                <span key={i} className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm whitespace-nowrap"
                  style={{ backgroundColor: darkMode ? COLORS.darkCard : '#ffffff', color: darkMode ? COLORS.darkTextMuted : '#475569', border: `1px solid ${darkMode ? COLORS.darkBorder : '#e2e8f0'}` }}>
                  {feat}
                </span>
              ))
            )}
          </div>

          {/* Location Row */}
          <div className="flex items-center gap-2 mt-auto mb-3 line-clamp-1 overflow-hidden shrink-0">
            <MapPin className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
            <span className="text-xs font-bold truncate" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{item.location}</span>
            {item.distance && (
              <>
                <span className="text-gray-400 shrink-0">•</span>
                <span className="text-xs font-medium shrink-0" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>{item.distance}</span>
              </>
            )}
          </div>

          {/* Bottom Row */}
          <div className="pt-3 border-t flex items-center justify-between relative z-20 bg-inherit" style={{ borderColor: darkMode ? COLORS.darkBorder : '#e2e8f0' }}>
            <div className="flex items-center gap-2 overflow-hidden">
              {!isRoommate && (
                <div className="relative shrink-0">
                  {item.user?.avatar ? (
                    <img src={item.user.avatar} alt="User" className="w-9 h-9 rounded-full object-cover border-2" style={{ borderColor: accentBg }} />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shadow-inner" style={{ backgroundColor: accentBg, color: accentColor }}>
                      {item.user?.name ? item.user.name.charAt(0) : 'U'}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 border-2" style={{ borderColor: darkMode ? COLORS.darkCard : '#ffffff' }}>
                    <CheckCircle className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              )}
              {isRoommate && (
                <div className="relative shrink-0 w-4 h-4 bg-blue-500 rounded-full p-0.5 flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-black truncate" style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>{item.user?.name ? item.user.name.split(' ')[0] : 'User'}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider truncate" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>{item.user?.role || 'Verified'}</span>
              </div>
            </div>
            
            <button className="px-4 py-2 rounded-xl text-xs font-black text-white transition-all shadow-lg active:scale-95"
              style={{ backgroundColor: tColor.dark }}>
              View
            </button>
          </div>
        </div>
        
        {/* ── QUICK FACTS HOVER OVERLAY ── */}
        <div className="absolute inset-x-0 bottom-0 p-5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 flex flex-col justify-end backdrop-blur-xl z-10 border-t" 
          style={{ height: '55%', backgroundColor: darkMode ? 'rgba(28,25,23,0.95)' : 'rgba(255,255,255,0.95)', borderColor: tColor.dark }}>
          <h4 className="text-sm font-black mb-3" style={{ color: accentColor }}>Quick Facts</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold border-b pb-2" style={{ borderColor: darkMode ? COLORS.darkBorder : '#e2e8f0' }}>
              <span style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Move-in Date</span>
              <span style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>{item.availability || 'Immediate'}</span>
            </div>
            <div className="flex justify-between text-xs font-bold border-b pb-2" style={{ borderColor: darkMode ? COLORS.darkBorder : '#e2e8f0' }}>
              <span style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Deposit</span>
              <span style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>1 Month Rent</span>
            </div>
            <div className="flex justify-between text-xs font-bold pb-1">
              <span style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Verified Host</span>
              <span style={{ color: darkMode ? COLORS.darkText : '#1e293b' }}>Yes</span>
            </div>
          </div>
          <button className="w-full mt-4 py-3 rounded-xl text-xs font-black text-white transition-colors hover:opacity-90 shadow-md"
            style={{ backgroundColor: tColor.dark }}>
            Contact Now
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EMPTY STATE ---
const EmptyNeighborhood = ({ darkMode }) => (
  <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
    <svg width="200" height="150" viewBox="0 0 200 150" fill="none" className="mb-6 opacity-80 drop-shadow-md">
      {/* Quiet House */}
      <path d="M50 100 L50 60 L100 30 L150 60 L150 100 Z" strokeWidth="2" style={{ fill: darkMode ? COLORS.darkBg : '#ffffff', stroke: darkMode ? COLORS.darkBorder : '#e2e8f0' }} />
      <path d="M40 60 L100 20 L160 60" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: darkMode ? '#57534e' : '#cbd5e1' }} />
      <rect x="85" y="70" width="30" height="30" rx="4" style={{ fill: darkMode ? COLORS.darkBorder : '#e2e8f0' }} />
      <rect x="92" y="77" width="16" height="16" rx="2" style={{ fill: darkMode ? COLORS.darkBg : '#f8fafc' }} />
      {/* Mailbox */}
      <rect x="170" y="80" width="8" height="20" rx="2" style={{ fill: darkMode ? '#57534e' : '#94a3b8' }} />
      <path d="M162 70 C162 55, 186 55, 186 70 Z" fill="#ea580c" />
      <rect x="162" y="70" width="24" height="12" fill="#ea580c" rx="2" />
      {/* Grass/Sidewalk */}
      <line x1="20" y1="110" x2="180" y2="110" strokeWidth="3" strokeDasharray="10 6" strokeLinecap="round" style={{ stroke: darkMode ? COLORS.darkBorder : '#cbd5e1' }} />
    </svg>
    <h3 className="text-2xl font-black mb-2" style={{ color: darkMode ? COLORS.darkText : '#0f172a' }}>It's quiet around here...</h3>
    <p className="text-sm font-semibold max-w-sm mx-auto leading-relaxed" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>
      We couldn't find any homes matching your search right now. Why not explore a different area?
    </p>
  </div>
);

// --- MAIN PAGE ---
export default function HousingSearchPage() {
  const [activeCategory, setActiveCategory] = useState("ROOMS");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [listings, setListings] = useState([]);
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    // Sync darkMode with document.body which UniShareProvider modifies
    const checkTheme = () => setDarkMode(document.body.classList.contains('dark'));
    
    // Initial check
    checkTheme();
    
    // Observe body for class changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const loadRealData = async () => {
      setIsSearching(true);
      try {
        const res = await fetchRooms({ limit: 20 });
        if (res && res.success && res.data) {
          // Map real API data to PresentationCard format
          const mappedData = res.data.map((room, i) => {
            const accents = ["folded", "hanging", "blueprint"];
            
            // Map the type if exists, else fallback based on room type
            let mappedType = "ROOM";
            if (room.room_type?.toUpperCase().includes("PG") || room.title?.toUpperCase().includes("PG")) mappedType = "PG";
            else if (room.room_type?.toUpperCase().includes("APARTMENT") || room.title?.toUpperCase().includes("FLAT") || room.title?.toUpperCase().includes("BHK")) mappedType = "APARTMENT";
            
            return {
              id: room.id || i,
              type: mappedType,
              tag: room.status || "Available",
              title: room.title,
              price: room.rent?.toString() || "Contact",
              period: "/mo",
              features: room.amenities || [room.beds ? `${room.beds} Beds` : "Furnished", "Wi-Fi"],
              traits: room.amenities || ["Student", "Friendly"],
              location: room.location || "Near University",
              distance: "",
              availability: room.move_in_date ? new Date(room.move_in_date).toLocaleDateString() : "Immediate",
              user: room.users ? {
                name: room.users.name || "Owner",
                role: room.users.role || "Verified",
                avatar: room.users.avatar || null
              } : { name: "Owner", role: "Verified" },
              accent: accents[i % 3],
              image: (room.photos && room.photos.length > 0) ? room.photos[0] : null
            };
          });
          setListings(mappedData);
          setFeatured(mappedData.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to load real data:", err);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    };
    
    loadRealData();
  }, []);

  const handleSearch = () => {
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => setIsSearching(false), 1200);
  };

  return (
    <div className="min-h-screen relative font-sans selection:bg-blue-200">
      <NeighborhoodBackground darkMode={darkMode} />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-10 max-w-7xl mx-auto flex flex-col gap-14">
        
        {/* Top Section: Title & Categories */}
        <section className="flex flex-col gap-8">
          <header className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-4 leading-tight" style={{ color: darkMode ? COLORS.darkText : '#0f172a' }}>
              Find Your <br className="sm:hidden"/> <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Neighborhood</span>
            </h1>
            <p className="text-base sm:text-lg font-bold max-w-lg mx-auto sm:mx-0" style={{ lineHeight: 1.6, color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>
              Explore beautiful homes, vibrant PGs, and welcoming roommates around the university campus.
            </p>
          </header>
          
          <CategoryCards darkMode={darkMode} activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        </section>

        {/* Neighborhood Explorer */}
        <section>
          <NeighborhoodExplorer darkMode={darkMode} onSearch={handleSearch} />
        </section>

        {/* Featured Homes Carousel */}
        {!hasSearched && (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-black flex items-center gap-2" style={{ color: darkMode ? COLORS.darkText : '#0f172a' }}>
              <Heart className="w-6 h-6 text-red-500 fill-red-500" /> Featured Homes
            </h2>
            <div className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar snap-x">
              {featured.map((item, i) => (
                <div key={i} className="snap-start relative flex-shrink-0 w-[85vw] max-w-[600px] h-[300px] rounded-[32px] overflow-hidden shadow-2xl group cursor-pointer border-4" style={{ borderColor: darkMode ? COLORS.darkCard : 'white' }}>
                  <img src={item.image || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400"} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2 bg-white/20 backdrop-blur-md text-white border border-white/30">
                      {item.type}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1 drop-shadow-md">{item.title}</h3>
                    <div className="flex items-center gap-2 text-gray-200 text-sm font-bold truncate">
                      <MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{item.location}</span> {item.distance && `• ${item.distance}`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Main Listings Grid */}
        <section className="flex flex-col gap-8" id="listings">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-3xl font-black" style={{ color: darkMode ? COLORS.darkText : '#0f172a' }}>
              {isSearching ? 'Scouting area...' : 'Neighborhood Homes'}
            </h2>
            <span className="text-sm font-bold px-4 py-1.5 rounded-full inline-flex w-max" style={{ backgroundColor: darkMode ? COLORS.darkBorder : '#f1f5f9', color: darkMode ? COLORS.darkText : '#64748b' }}>
              {isSearching ? '...' : `${listings.length} found`}
            </span>
          </div>

          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-bold animate-pulse" style={{ color: darkMode ? COLORS.darkTextMuted : '#64748b' }}>Walking the neighborhood...</p>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16 items-start">
              {listings.map((item, index) => (
                <div key={item.id} className="transition-all duration-700 hover:z-20">
                  <PresentationCard item={item} darkMode={darkMode} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyNeighborhood darkMode={darkMode} />
          )}
        </section>

      </main>
    </div>
  );
}
