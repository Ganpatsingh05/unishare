"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Edit3, Share2, Trash2, QrCode, Ticket, MapPin, 
  IndianRupee, Calendar, Clock, Loader, AlertCircle, 
  BadgeCheck, FolderOpen, Printer, X, Plane, Mic, Sparkles, Bus
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchMyTickets, deleteTicket } from "./../../../lib/api";
import { useAuth, useMessages, useUI } from "./../../../lib/contexts/UniShareContext";
import useIsMobile from "./../../../_components/ui/useIsMobile";
import SmallFooter from "./../../../_components/layout/SmallFooter";

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ═══════════════════════════════════════════════════════════════════════════════
const FONT = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const TICKET_STYLES = [
  { bgLight: '#fef3c7', textLight: '#92400e', bgDark: '#422006', textDark: '#fde68a', accent: '#d97706' }, // Amber
  { bgLight: '#dbeafe', textLight: '#1e40af', bgDark: '#1e3a8a', textDark: '#bfdbfe', accent: '#2563eb' }, // Blue
  { bgLight: '#f3e8ff', textLight: '#6b21a8', bgDark: '#3b0764', textDark: '#e9d5ff', accent: '#9333ea' }, // Purple
  { bgLight: '#d1fae5', textLight: '#065f46', bgDark: '#022c22', textDark: '#a7f3d0', accent: '#059669' }, // Emerald
  { bgLight: '#ffe4e6', textLight: '#9f1239', bgDark: '#4c0519', textDark: '#fecdd3', accent: '#e11d48' }, // Rose
];

const getStatusDetails = (status) => {
  switch(status?.toLowerCase()) {
    case 'active': return { label: 'ACTIVE', color: '#10b981', rotation: -3, stamp: true };
    case 'sold': return { label: 'SOLD', color: '#ef4444', rotation: 4, stamp: true };
    case 'expired': return { label: 'EXPIRED', color: '#64748b', rotation: 0, opacity: 0.6 };
    default: return { label: 'DRAFT', color: '#f59e0b', rotation: -2, stamp: false };
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// DECORATIVE BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const CabinetBackground = ({ darkMode }) => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
    {/* Paper grain overlay */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    
    {/* Cabinet dividers */}
    <div className={`absolute top-0 bottom-0 left-10 border-l border-dashed ${darkMode ? 'opacity-20' : 'opacity-20'}`} style={{ borderColor: darkMode ? '#fff' : '#000' }} />
    <div className={`absolute top-0 bottom-0 right-10 border-r border-dashed ${darkMode ? 'opacity-20' : 'opacity-20'}`} style={{ borderColor: darkMode ? '#fff' : '#000' }} />
    
    {/* Faint ticket outlines */}
    <svg className={`absolute top-20 right-20 w-64 h-32 rotate-[15deg] ${darkMode ? 'opacity-[0.12]' : 'opacity-[0.18]'}`} viewBox="0 0 200 100" fill="none">
      <rect x="10" y="10" width="180" height="80" rx="8" stroke={darkMode ? '#cbd5e1' : '#334155'} strokeWidth="1.5" strokeDasharray="6 3" />
      <circle cx="10" cy="50" r="10" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#cbd5e1' : '#334155'} strokeWidth="1.5" />
      <circle cx="190" cy="50" r="10" fill={darkMode ? '#0a0f1a' : '#f8fafc'} stroke={darkMode ? '#cbd5e1' : '#334155'} strokeWidth="1.5" />
    </svg>
    <svg className={`absolute bottom-32 left-10 w-48 h-24 -rotate-[8deg] ${darkMode ? 'opacity-[0.1]' : 'opacity-[0.15]'}`} viewBox="0 0 200 100" fill="none">
      <rect x="10" y="10" width="180" height="80" rx="8" stroke={darkMode ? '#cbd5e1' : '#334155'} strokeWidth="1.5" strokeDasharray="6 3" />
      {Array.from({length: 10}).map((_, i) => <rect key={i} x={30 + i*14} y="40" width={i%2===0?6:3} height="20" fill={darkMode ? '#cbd5e1' : '#334155'} />)}
    </svg>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// SHREDDER ANIMATION
// ═══════════════════════════════════════════════════════════════════════════════
const ShredderAnimation = ({ isActive, darkMode }) => {
  if (!isActive) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center overflow-hidden">
      {/* Shredder machine graphic */}
      <motion.div 
        className="absolute bottom-0 w-full h-1/3 rounded-t-xl z-20 flex flex-col items-center pt-2"
        style={{ backgroundColor: darkMode ? '#1e293b' : '#334155', borderTop: '2px solid #000' }}
        initial={{ y: '100%' }} animate={{ y: 0 }}
      >
        <div className="w-2/3 h-1.5 bg-black rounded-full shadow-inner mb-4" />
        <div className="flex gap-1">
          {Array.from({length: 20}).map((_, i) => (
            <motion.div 
              key={i} className="w-1.5 h-16" style={{ backgroundColor: darkMode ? '#e2e8f0' : '#ffffff' }}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: [0, 20, 60], opacity: [0, 1, 0] }}
              transition={{ delay: 0.6 + i * 0.02, duration: 0.8, ease: "linear" }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TICKET CARD (Interactive Physical Ticket)
// ═══════════════════════════════════════════════════════════════════════════════
const TicketCard = ({ ticket, index, darkMode, onShred, onEdit }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isShredding, setIsShredding] = useState(false);
  const [isPrinterSucking, setIsPrinterSucking] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const styleIdx = index % TICKET_STYLES.length;
  const style = TICKET_STYLES[styleIdx];
  const stat = getStatusDetails(ticket.status);
  
  const serial = `UNI-${String(ticket.id).slice(-4).padStart(4, '0')}`;
  
  const handleShred = (e) => {
    e.stopPropagation();
    setIsShredding(true);
    setTimeout(() => onShred(ticket.id), 2000); // Trigger actual delete after animation
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsPrinterSucking(true);
    setTimeout(() => onEdit(ticket.id), 1200);
  };
  
  const handleShare = (e) => {
    e.stopPropagation();
    setShowQR(true);
  };

  // If shredding, animate the ticket sliding down into the shredder
  const shredAnim = isShredding ? { y: 200, opacity: 0, scale: 0.8, transition: { duration: 1.5, ease: "linear" }} : {};
  // If editing, animate ticket getting sucked up into printer
  const printAnim = isPrinterSucking ? { y: -200, opacity: 0, scale: 0.5, transition: { duration: 1, ease: "anticipate" }} : {};

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'travel': return <Plane className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" style={{ color: style.textLight }} />;
      case 'event': return <Mic className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" style={{ color: style.textLight }} />;
      case 'club': return <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" style={{ color: style.textLight }} />;
      default: return <Ticket className="w-8 h-8 sm:w-12 sm:h-12 opacity-60" style={{ color: style.textLight }} />;
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: (index % 2 === 0 ? -1 : 1) * (Math.random() * 2) }}
        animate={{ opacity: stat.opacity || 1, y: 0, ...shredAnim, ...printAnim }}
        whileHover={!isShredding && !isPrinterSucking ? { y: -8, rotate: 0, scale: 1.02 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`relative w-full aspect-[21/9] sm:aspect-[24/9] max-h-48 cursor-pointer group ${!isShredding && !isPrinterSucking ? 'hover:shadow-2xl hover:z-10' : ''}`}
        onClick={() => !isShredding && !isPrinterSucking && setIsFlipped(!isFlipped)}
        style={{ perspective: 1000 }}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateX: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* ─── FRONT OF TICKET ─── */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl flex overflow-hidden shadow-md"
            style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}` }}
          >
            {/* Left Image Section */}
            <div className="w-[30%] sm:w-[25%] relative bg-slate-100 dark:bg-slate-800">
              {ticket.image_url ? (
                <img src={ticket.image_url} alt={ticket.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center" style={{ backgroundColor: style.bgLight }}>
                  {getCategoryIcon(ticket.category)}
                </div>
              )}
              {/* Category Strip */}
              <div className="absolute top-0 bottom-0 right-0 w-1.5 sm:w-2" style={{ backgroundColor: style.accent }} />
            </div>

            {/* Perforation Divider */}
            <div className="relative flex flex-col justify-between -ml-2.5 z-10 py-1">
              {Array.from({length: 6}).map((_, i) => (
                <div key={i} className="w-5 h-5 rounded-full" style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }} />
              ))}
            </div>

            {/* Right Details Section */}
            <div className="flex-1 p-3 sm:p-5 flex flex-col relative z-0">
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm sm:text-base font-black line-clamp-1 mb-1" style={{ ...FONT, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                    {ticket.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1.5 mb-2" style={{ color: style.accent }}>
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span className="text-lg font-black">{ticket.price}</span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] sm:text-xs font-semibold" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {ticket.venue && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> <span className="truncate max-w-[100px]">{ticket.venue}</span></span>}
                  {ticket.event_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ticket.event_date).toLocaleDateString('en-IN', {month:'short', day:'numeric'})}</span>}
                  <span className="flex items-center gap-1"><Ticket className="w-3 h-3" /> {ticket.quantity_available} Available</span>
                </div>
              </div>

              {/* Action Buttons (visible on hover or mobile) */}
              <div className="flex items-center gap-2 pt-2 border-t mt-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" style={{ borderColor: darkMode ? '#334155' : '#f1f5f9' }}>
                <button onClick={handleEdit} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold" style={{ backgroundColor: darkMode?'#1e293b':'#f1f5f9', color: darkMode?'#94a3b8':'#64748b' }}>
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button onClick={handleShare} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold" style={{ backgroundColor: darkMode?'#1e293b':'#f1f5f9', color: darkMode?'#94a3b8':'#64748b' }}>
                  <Share2 className="w-3 h-3" /> Share
                </button>
                <div className="flex-1" />
                <button onClick={handleShred} className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
                  <Trash2 className="w-3 h-3" /> Shred Ticket
                </button>
              </div>

              {/* Status Stamp */}
              {stat.stamp && (
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-80 pointer-events-none" style={{ transform: `rotate(${stat.rotation}deg)` }}>
                  <div className="px-3 py-1 border-4 rounded-lg font-black text-xl sm:text-2xl tracking-widest" style={{ borderColor: stat.color, color: stat.color, textShadow: `0 0 2px ${stat.color}40`, boxShadow: `inset 0 0 4px ${stat.color}40` }}>
                    {stat.label}
                  </div>
                </div>
              )}
              
              {/* Subtle Details */}
              {index % 3 === 0 && <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full border-2 border-dashed opacity-20 pointer-events-none" style={{ borderColor: style.accent }} />}
              {index % 4 === 0 && <div className="absolute top-0 right-0 w-8 h-8" style={{ background: `linear-gradient(225deg, ${darkMode ? '#0a0f1a' : '#f8fafc'} 50%, transparent 50%)` }} />}
            </div>
          </div>

          {/* ─── BACK OF TICKET ─── */}
          <div 
            className="absolute inset-0 backface-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md flex flex-col justify-between"
            style={{ backgroundColor: style.bgLight, border: `1px solid ${style.accent}40`, transform: 'rotateX(180deg)' }}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: style.textLight, opacity: 0.7 }}>Serial No.</p>
                <p className="text-sm font-mono font-black" style={{ color: style.textLight }}>{serial}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: style.textLight, opacity: 0.7 }}>Listed On</p>
                <p className="text-xs font-bold" style={{ color: style.textLight }}>{new Date(ticket.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex-1 flex items-center justify-center my-2">
              <QrCode className="w-16 h-16 sm:w-20 sm:h-20" style={{ color: style.textLight }} />
            </div>

            <div className="flex items-center justify-between border-t pt-2" style={{ borderColor: `${style.textLight}30` }}>
              <div className="flex items-center gap-[1px] opacity-60">
                {Array.from({length: 20}).map((_, i) => (
                  <div key={i} className="h-4 sm:h-6 rounded-sm" style={{ width: i%3===0 ? 3 : 1.5, backgroundColor: style.textLight }} />
                ))}
              </div>
              <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: style.textLight }} />
            </div>
          </div>
        </motion.div>

        {/* Shredder Animation overlay */}
        <ShredderAnimation isActive={isShredding} darkMode={darkMode} />
      </motion.div>

      {/* Share QR Modal */}
      <AnimatePresence>
        {showQR && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowQR(false)}>
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
              style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff' }}
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setShowQR(false)} className="absolute top-4 right-4 p-2 rounded-full hover:opacity-70 transition-opacity">
                <X className="w-5 h-5" style={{ color: darkMode ? '#94a3b8' : '#64748b' }} />
              </button>
              <h3 className="text-xl font-black mb-2" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}>{ticket.title}</h3>
              <p className="text-sm font-bold mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>Scan to view listing</p>
              <div className="p-6 rounded-2xl border-2 flex items-center justify-center mb-6" style={{ backgroundColor: darkMode ? '#0f172a' : '#f8fafc', borderColor: darkMode ? '#334155' : '#f1f5f9' }}>
                <QrCode className="w-40 h-40" style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }} />
              </div>
              <p className="text-xs font-mono font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>{serial}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function MyTicketsCabinet() {
  const { isAuthenticated } = useAuth();
  const { darkMode } = useUI();
  const { showTemporaryMessage } = useMessages();
  const router = useRouter();
  const isMobile = useIsMobile();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchTickets();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetchMyTickets();
      if (res.success) setTickets(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTicket(id);
      setTickets(prev => prev.filter(t => t.id !== id));
      showTemporaryMessage("Ticket Shredded", "success");
    } catch (e) {
      console.error(e);
      showTemporaryMessage("Failed to shred ticket", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (id) => {
    showTemporaryMessage("Retrieving ticket...", "success");
    // Wait for the "suck into printer" animation to finish before routing
    setTimeout(() => {
      router.push(`/ticket/sell?edit=${id}`);
    }, 1200);
  };

  const tabs = ['All', 'Active', 'Sold', 'Expired', 'Draft'];
  
  const filteredTickets = tickets.filter(t => {
    if (activeTab === 'All') return true;
    return t.status?.toLowerCase() === activeTab.toLowerCase();
  });

  if (!isAuthenticated && !loading) {
    return (
      <main className="max-w-lg mx-auto px-4 py-20 text-center">
        <FolderOpen className="w-16 h-16 mx-auto mb-5 text-blue-500" />
        <h2 className="text-xl font-black mb-3 text-slate-900 dark:text-slate-100">Ticket Cabinet Locked</h2>
        <p className="text-sm text-slate-500 mb-6">Log in to view your printed tickets.</p>
        <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Login</Link>
      </main>
    );
  }

  return (
    <>
      <CabinetBackground darkMode={darkMode} />
      
      <main className={`relative z-10 ${isMobile ? 'px-4 py-6' : 'max-w-4xl mx-auto px-6 py-10'}`}>
        {/* HERO */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 pb-10 border-b border-dashed" style={{ borderColor: darkMode ? '#334155' : '#cbd5e1' }}>
          <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center" style={{ border: `4px solid ${darkMode ? '#1e293b' : '#fff'}`, boxShadow: darkMode ? '0 10px 25px rgba(0,0,0,0.5)' : '0 10px 25px rgba(0,0,0,0.1)' }}>
            <img src="/images/tickets/cabinet.jpg" alt="Cabinet" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
            <FolderOpen className="w-12 h-12 text-slate-300 absolute -z-10" />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-black mb-2" style={{ ...FONT, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
              My Ticket <span style={{ color: darkMode ? '#f59e0b' : '#d97706' }}>Cabinet</span>
            </h1>
            <p className="text-sm font-semibold mb-4 sm:mb-0" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>
              All your printed tickets, organized in one place.
            </p>
          </div>
          <div className="shrink-0">
            <Link href="/ticket/sell" className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <Printer className="w-4 h-4" /> Print Ticket
            </Link>
          </div>
        </div>

        {/* HANGING TABS */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-8 pt-4 pb-2" style={{ borderBottom: `2px solid ${darkMode ? '#1e293b' : '#e2e8f0'}` }}>
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-5 py-2.5 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap"
                style={{
                  backgroundColor: isActive ? (darkMode ? '#1e293b' : '#ffffff') : 'transparent',
                  color: isActive ? (darkMode ? '#facc15' : '#d97706') : (darkMode ? '#64748b' : '#94a3b8'),
                  borderTop: isActive ? `2px solid ${darkMode ? '#1e293b' : '#e2e8f0'}` : '2px solid transparent',
                  borderLeft: isActive ? `2px solid ${darkMode ? '#1e293b' : '#e2e8f0'}` : '2px solid transparent',
                  borderRight: isActive ? `2px solid ${darkMode ? '#1e293b' : '#e2e8f0'}` : '2px solid transparent',
                  borderBottom: 'none',
                  transform: isActive ? 'translateY(2px)' : 'translateY(0)',
                  boxShadow: isActive ? (darkMode ? '0 -4px 10px rgba(0,0,0,0.3)' : '0 -4px 10px rgba(0,0,0,0.05)') : 'none',
                  zIndex: isActive ? 10 : 1
                }}
              >
                {tab}
                {/* Visual file tab hooks */}
                <div className="absolute top-1 -left-1 w-2 h-2 rounded-full" style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }} />
                <div className="absolute top-1 -right-1 w-2 h-2 rounded-full" style={{ backgroundColor: darkMode ? '#0a0f1a' : '#f8fafc' }} />
              </button>
            );
          })}
        </div>

        {/* TICKETS DRAWER */}
        <div className="relative rounded-b-3xl rounded-tr-3xl p-6 sm:p-8 min-h-[400px]" style={{ backgroundColor: darkMode ? '#111827' : '#f8fafc', border: `1px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`, boxShadow: darkMode ? 'inset 0 10px 20px -10px rgba(0,0,0,0.5)' : 'inset 0 10px 20px -10px rgba(0,0,0,0.05)' }}>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 opacity-50">
              <Loader className="w-8 h-8 animate-spin mb-4" style={{ color: darkMode ? '#475569' : '#94a3b8' }} />
              <p className="text-sm font-bold" style={{ color: darkMode ? '#475569' : '#94a3b8' }}>Opening Drawer...</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="relative mb-6">
                <FolderOpen className="w-16 h-16" style={{ color: darkMode ? '#334155' : '#cbd5e1' }} />
                <div className="absolute -bottom-2 -right-2 px-3 py-2 bg-yellow-100 border border-yellow-200 rotate-12 shadow-sm rounded-sm">
                  <p className="text-[10px] font-black text-yellow-800" style={FONT}>Nothing here</p>
                </div>
              </div>
              <p className="text-sm font-bold mb-4" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>This drawer is empty.</p>
              <Link href="/ticket/sell" className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                Print New Ticket
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:gap-8">
              <AnimatePresence>
                {filteredTickets.map((ticket, index) => (
                  <TicketCard 
                    key={ticket.id} 
                    ticket={ticket} 
                    index={index} 
                    darkMode={darkMode} 
                    onShred={handleDelete}
                    onEdit={handleEdit}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      
      {/* Global styles for 3D flip effect and scrollbar */}
      <style dangerouslySetInnerHTML={{__html:`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      
      <SmallFooter />
    </>
  );
}
