"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  ImageIcon, Tag, MapPin, Phone, Instagram, Mail, Link2,
  Plus, Trash2, AlertCircle, CheckCircle, Upload,
  ArrowLeft, Loader, ArrowRight, ShoppingBag,
  Package, BookOpen, Laptop, Headphones, Bike, Gamepad2, Sofa,
  FileText, Camera, TrendingUp, Shield, Heart, BadgeCheck,
  CircleDot, Eye, Info, Check, ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createItem, formatContactInfo } from "./../../../lib/api";
import {
  useAuth,
  useMessages,
  useUI,
  useUserData
} from "./../../../lib/contexts/UniShareContext";
import { MarketplaceNotifications } from "./../../../lib/utils/actionNotifications";
import useIsMobile from "./../../../_components/ui/useIsMobile";

// ═══════════════════════════════════════════════════════════════════════════════
// Brand style matching Share Ride landing page
// ═══════════════════════════════════════════════════════════════════════════════
const FONT_STYLE = { fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif' };

const STEPS = [
  { id: 'category', title: 'Category', icon: Tag },
  { id: 'photos', title: 'Photos', icon: Camera },
  { id: 'details', title: 'Details', icon: FileText },
  { id: 'pricing', title: 'Price', icon: TrendingUp },
  { id: 'pickup', title: 'Pickup', icon: MapPin },
  { id: 'review', title: 'Publish', icon: Shield },
];

const CATEGORIES = [
  { value: 'electronics', label: 'Electronics', icon: Laptop, color: '#6366f1', bgLight: '#eef2ff', bgDark: '#312e81' },
  { value: 'books', label: 'Books', icon: BookOpen, color: '#f59e0b', bgLight: '#fffbeb', bgDark: '#78350f' },
  { value: 'furniture', label: 'Furniture', icon: Sofa, color: '#10b981', bgLight: '#ecfdf5', bgDark: '#064e3b' },
  { value: 'accessories', label: 'Accessories', icon: Headphones, color: '#ec4899', bgLight: '#fdf2f8', bgDark: '#831843' },
  { value: 'cycles', label: 'Cycles', icon: Bike, color: '#0ea5e9', bgLight: '#e0f2fe', bgDark: '#0c4a6e' },
  { value: 'gaming', label: 'Gaming', icon: Gamepad2, color: '#8b5cf6', bgLight: '#f5f3ff', bgDark: '#4c1d95' },
  { value: 'other', label: 'Other', icon: Package, color: '#64748b', bgLight: '#f8fafc', bgDark: '#334155' },
];

const CONDITIONS = [
  { value: 'new', label: 'Brand New', icon: Shield, desc: 'Unused, still in original packaging', color: '#10b981' },
  { value: 'like-new', label: 'Like New', icon: CheckCircle, desc: 'Barely used, excellent condition', color: '#6366f1' },
  { value: 'good', label: 'Good', icon: Check, desc: 'Used but works perfectly fine', color: '#3b82f6' },
  { value: 'fair', label: 'Fair', icon: Info, desc: 'Shows wear but fully functional', color: '#f59e0b' },
  { value: 'damaged', label: 'Damaged', icon: AlertCircle, desc: 'Has issues, priced accordingly', color: '#ef4444' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// JOURNEY INDICATOR
// ═══════════════════════════════════════════════════════════════════════════════
const JourneyIndicator = ({ currentStep, darkMode }) => (
  <div className="flex items-center justify-between mb-10 w-full">
    {STEPS.map((step, i) => {
      const isCompleted = i < currentStep;
      const isCurrent = i === currentStep;
      const StepIcon = step.icon;
      return (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1.5 relative z-10">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500"
              style={{
                backgroundColor: isCurrent
                  ? (darkMode ? '#facc15' : '#0ea5e9')
                  : isCompleted
                    ? '#10b981'
                    : darkMode ? '#1f2937' : '#f1f5f9',
                color: isCurrent || isCompleted ? '#fff' : darkMode ? '#6b7280' : '#94a3b8',
                boxShadow: isCurrent ? `0 4px 14px -3px ${darkMode ? 'rgba(250,204,21,0.4)' : 'rgba(14,165,233,0.35)'}` : 'none',
                transform: isCurrent ? 'scale(1.15)' : 'scale(1)',
                border: !isCurrent && !isCompleted ? `1.5px solid ${darkMode ? '#374151' : '#e2e8f0'}` : 'none',
              }}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
            </div>
            <span
              className="text-[10px] font-bold tracking-wide hidden md:block"
              style={{
                ...FONT_STYLE,
                color: isCurrent
                  ? (darkMode ? '#facc15' : '#0ea5e9')
                  : isCompleted
                    ? (darkMode ? '#34d399' : '#10b981')
                    : darkMode ? '#6b7280' : '#94a3b8',
              }}
            >
              {step.title}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-[2px] mx-1.5 relative z-0">
              <div className="absolute inset-0 rounded-full" style={{ backgroundColor: darkMode ? '#1f2937' : '#e2e8f0' }} />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ backgroundColor: '#10b981' }}
                initial={{ width: '0%' }}
                animate={{ width: isCompleted ? '100%' : '0%' }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM CONTACT DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════════
const ContactDropdown = ({ contact, handleContactChange, darkMode, fontStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    { value: 'mobile', label: 'Phone' },
    { value: 'email', label: 'Email' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'other', label: 'Other' },
  ];

  const selectedOption = options.find(o => o.value === contact.type) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 py-3.5 pl-3 pr-2 text-xs font-bold transition-colors outline-none"
        style={{ ...fontStyle, color: darkMode ? '#e2e8f0' : '#334155' }}
      >
        {selectedOption.label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-36 rounded-xl border overflow-hidden z-50 shadow-xl"
            style={{ 
              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
              borderColor: darkMode ? '#334155' : '#e2e8f0',
              boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className="w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between"
                style={{ 
                  ...fontStyle, 
                  color: contact.type === opt.value ? (darkMode ? '#38bdf8' : '#0ea5e9') : (darkMode ? '#94a3b8' : '#64748b'),
                  backgroundColor: contact.type === opt.value ? (darkMode ? 'rgba(56, 189, 248, 0.1)' : 'rgba(14, 165, 233, 0.05)') : 'transparent'
                }}
                onMouseEnter={(e) => { if (contact.type !== opt.value) e.currentTarget.style.backgroundColor = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={(e) => { if (contact.type !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
                onClick={() => {
                  handleContactChange(contact.id, 'type', opt.value);
                  setIsOpen(false);
                }}
              >
                {opt.label}
                {contact.type === opt.value && <Check className="w-3.5 h-3.5" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE PREVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════════
const LivePreviewCard = ({ title, price, category, condition, imagePreview, location, description, darkMode, user }) => {
  const catObj = CATEGORIES.find(c => c.value === category);
  const condObj = CONDITIONS.find(c => c.value === condition);

  return (
    <div className="w-full max-w-xs mx-auto">
      <motion.div
        className="w-full rounded-3xl overflow-hidden border transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          borderColor: darkMode ? '#1f2937' : '#cbd5e1',
          boxShadow: darkMode
            ? '0 20px 40px -12px rgba(0, 0, 0, 0.5)'
            : '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        }}
      >
        {/* Preview Header */}
        <div
          className="px-4 py-2.5 border-b flex items-center justify-between"
          style={{ borderColor: darkMode ? '#1f2937' : '#f1f5f9', backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}
        >
          <div className="flex items-center gap-1.5">
            <Eye className="w-3 h-3" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ ...FONT_STYLE, color: darkMode ? '#64748b' : '#94a3b8' }}>Preview</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: '#10b981' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Just now
          </span>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
          {imagePreview ? (
            <motion.img
              key={imagePreview}
              src={imagePreview}
              alt="Listing"
              className="w-full h-full object-cover"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <ImageIcon className="w-8 h-8 mb-2" style={{ color: darkMode ? '#374151' : '#cbd5e1' }} />
              <span className="text-xs font-medium" style={{ ...FONT_STYLE, color: darkMode ? '#4b5563' : '#94a3b8' }}>
                Your photo here
              </span>
            </div>
          )}

          {/* Floating Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {catObj && (
              <div
                className="px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1"
                style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
              >
                {React.createElement(catObj.icon, { className: "w-2.5 h-2.5" })}
                {catObj.label}
              </div>
            )}
            {condObj && (
              <div
                className="px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1"
                style={{ backgroundColor: condObj.color + 'DD' }}
              >
                {React.createElement(condObj.icon, { className: "w-2.5 h-2.5" })}
                {condObj.label}
              </div>
            )}
          </div>
          <button className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
          >
            <Heart className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3
              className="font-bold text-base leading-tight line-clamp-1"
              style={{ ...FONT_STYLE, color: title ? (darkMode ? '#f1f5f9' : '#0f172a') : (darkMode ? '#4b5563' : '#94a3b8') }}
            >
              {title || "Item name"}
            </h3>
            <span
              className="text-lg font-black shrink-0"
              style={{ ...FONT_STYLE, color: price ? (darkMode ? '#facc15' : '#0ea5e9') : (darkMode ? '#4b5563' : '#94a3b8') }}
            >
              ₹{price || "0"}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-2.5">
            <MapPin className="w-3 h-3" style={{ color: location ? (darkMode ? '#38bdf8' : '#0ea5e9') : (darkMode ? '#4b5563' : '#94a3b8') }} />
            <span className="text-[11px] font-medium" style={{ color: location ? (darkMode ? '#93c5fd' : '#0369a1') : (darkMode ? '#4b5563' : '#94a3b8') }}>
              {location || "Pickup location"}
            </span>
          </div>

          <p className="text-xs line-clamp-2 leading-relaxed mb-3" style={{ color: description ? (darkMode ? '#9ca3af' : '#64748b') : (darkMode ? '#4b5563' : '#94a3b8') }}>
            {description || "Describe your item to help buyers know what to expect..."}
          </p>

          {/* Seller */}
          <div className="pt-3 border-t flex items-center gap-2.5" style={{ borderColor: darkMode ? '#1f2937' : '#f1f5f9' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}
            >
              {(user?.picture || user?.avatar) ? (
                <img src={user.picture || user.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0] || user?.firstName?.[0] || 'U'
              )}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ ...FONT_STYLE, color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                {user?.name || user?.firstName || 'You'}
              </p>
              <div className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>
                <BadgeCheck className="w-2.5 h-2.5" /> Verified
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function MarketplaceSellPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, user } = useAuth();
  const { showMessage } = useMessages();
  const { darkMode } = useUI();
  const { addUserItem } = useUserData();
  const isMobile = useIsMobile();

  // ─── Form State ──────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ─── UI State ────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTitle, setSuccessTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => { return () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }; }, [imagePreview]);

  // ─── Handlers ────────────────────────────────────────────────────────
  const iconForType = (type) => {
    switch (type) { case 'mobile': return Phone; case 'instagram': return Instagram; case 'email': return Mail; default: return Link2; }
  };
  const handleAddContact = () => { if (contacts.length >= 3) return; setContacts([...contacts, { id: Date.now(), type: 'mobile', value: '' }]); };
  const handleRemoveContact = (id) => setContacts(contacts.filter(c => c.id !== id));
  const handleContactChange = (id, field, val) => setContacts(contacts.map(c => c.id === id ? { ...c, [field]: val } : c));

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErrorMsg("Image must be under 5MB"); return; }
    setImageFile(file); setImagePreview(URL.createObjectURL(file)); setErrorMsg("");
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { setErrorMsg("Image must be under 5MB"); return; }
      setImageFile(file); setImagePreview(URL.createObjectURL(file)); setErrorMsg("");
    }
  };

  // ─── Listing Score ───────────────────────────────────────────────────
  const { listingScore, suggestions } = useMemo(() => {
    let score = 0; const sugg = [];
    if (title.trim().length > 0) score += 5; else sugg.push('Add a descriptive title (+5)');
    if (title.trim().length >= 15) score += 5; else if (title.trim().length > 0) sugg.push('Use 15+ characters in title (+5)');
    if (title.trim().length >= 30) score += 5;
    if (category) score += 10;
    if (imageFile) score += 25; else sugg.push('Add a photo — listings with photos sell 3x faster (+25)');
    if (condition) score += 5;
    if (price && parseFloat(price) > 0) score += 10; else sugg.push('Set a competitive price (+10)');
    const dl = description.trim().length;
    if (dl > 0) score += 5; else sugg.push('Write a description (+5)');
    if (dl >= 100) score += 5; else if (dl > 0) sugg.push('Write at least 100 chars (+5)');
    if (dl >= 500) score += 5; else if (dl >= 100) sugg.push('500+ char descriptions sell 40% faster (+5)');
    if (location.trim().length > 0) score += 5; else sugg.push('Add pickup location (+5)');
    if (contacts.some(c => c.value.trim())) score += 5; else sugg.push('Add a contact method (+5)');
    const fc = contacts.filter(c => c.value.trim()).length;
    if (fc >= 2) score += 5; else if (fc === 1) sugg.push('Add a second contact method (+5)');
    return { listingScore: Math.min(score, 100), suggestions: sugg };
  }, [title, category, imageFile, condition, price, description, location, contacts]);

  const isValidContact = (contact) => {
    const val = contact.value.trim();
    if (val.length === 0) return false;
    if (contact.type === 'mobile') {
      const digits = val.replace(/\D/g, '');
      return digits.length >= 10;
    }
    if (contact.type === 'email') {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    }
    return true;
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: return !!category;
      case 1: return true;
      case 2: return title.trim().length > 0 && !!condition && description.trim().length > 0;
      case 3: return price && parseFloat(price) > 0;
      case 4: 
        const filledContacts = contacts.filter(c => c.value.trim().length > 0);
        return location.trim().length > 0 && filledContacts.length > 0 && filledContacts.every(isValidContact);
      default: return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setErrorMsg("");
      setCurrentStep(p => Math.min(p + 1, STEPS.length - 1));
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setErrorMsg("Please complete all required fields.");
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const handleBack = () => {
    setErrorMsg("");
    setCurrentStep(p => Math.max(p - 1, 0));
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(4) || listingScore < 30) { setErrorMsg("Please complete all steps."); return; }
    setLoading(true); setErrorMsg("");
    try {
      const formattedContacts = formatContactInfo(contacts);
      const itemData = { title: title.trim(), price: parseFloat(price), category, condition, location: location.trim(), description: description.trim(), contact_info: formattedContacts, available_from: new Date().toISOString() };
      const result = await createItem(itemData, imageFile);
      if (result.success) {
        if (result.data) addUserItem(result.data);
        MarketplaceNotifications.itemListed(showMessage, title.trim());
        setSuccessTitle(title.trim()); setShowSuccess(true);
      } else { setErrorMsg(result.error || "Failed to create listing."); }
    } catch (e) { setErrorMsg("Something went wrong. Please try again."); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setTitle(""); setPrice(""); setCategory(""); setCondition(""); setLocation(""); setDescription("");
    setContacts([{ id: 1, type: 'mobile', value: '' }]); setImageFile(null); setImagePreview(null);
    setCurrentStep(0); setShowSuccess(false); setSuccessTitle(""); setErrorMsg("");
  };

  // ─── Auth Guard ──────────────────────────────────────────────────────
  if (authLoading) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader className="w-8 h-8 animate-spin" style={{ color: '#0ea5e9' }} /></div>;
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
        <div className="max-w-md w-full p-8 rounded-3xl text-center border" style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)' }}>
          <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#f59e0b' }} />
          <h2 className="text-2xl font-black mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#f1f5f9' : '#0f172a' }}>Login Required</h2>
          <p className="text-sm mb-6" style={{ color: darkMode ? '#94a3b8' : '#64748b' }}>You need to be logged in to list items.</p>
          <Link href="/login" className="inline-block w-full py-3 rounded-xl font-bold text-white transition-colors hover:bg-sky-600" style={{ backgroundColor: '#0ea5e9' }}>Go to Login</Link>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════
  return (
    <div className={`fixed top-16 md:top-20 left-0 right-0 bottom-0 transition-colors duration-300 overflow-hidden bg-transparent`}>

      {/* ─── Minimal Back Button (no header bar) ─── */}
      <div className="absolute top-4 left-4 lg:left-6 z-20">
        <Link
          href="/marketplace/buy"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
          style={{
            ...FONT_STYLE,
            backgroundColor: darkMode ? '#1e293b' : '#ffffff',
            color: darkMode ? '#94a3b8' : '#475569',
            border: `1px solid ${darkMode ? '#334155' : '#cbd5e1'}`,
            boxShadow: darkMode ? 'none' : '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>

      {/* ─── Main Split Layout ─── */}
      <main className="relative z-10 w-full max-w-[1440px] mx-auto h-full flex flex-col lg:flex-row">

        {/* ════ LEFT: LIVE PREVIEW (30%) ════ */}
        {!isMobile && (
          <div className="w-full lg:w-[30%] h-full flex-shrink-0 lg:border-r flex flex-col items-center justify-center relative" style={{ borderColor: darkMode ? '#1e293b' : '#e2e8f0' }}>
            <div className="w-full p-4 lg:p-6 xl:p-8 flex flex-col items-center justify-center">
              <LivePreviewCard
                title={title} price={price} category={category}
                condition={condition} imagePreview={imagePreview}
                location={location} description={description}
                darkMode={darkMode} user={user}
              />

              {/* Contextual Tip */}
              <motion.div
                className="mt-4 max-w-xs w-full p-3 rounded-2xl flex items-start gap-2.5 border"
                style={{
                  backgroundColor: darkMode ? 'rgba(30,41,59,0.5)' : 'rgba(255,255,255,0.8)',
                  borderColor: darkMode ? '#334155' : '#cbd5e1',
                  backdropFilter: 'blur(8px)',
                  boxShadow: darkMode ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.05)'
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }} />
                <p className="text-[11px] font-medium leading-relaxed" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>
                  {currentStep === 0 && "Pick the right category so students can find your listing faster."}
                  {currentStep === 1 && "Well-lit real photos get significantly more interest than text-only listings."}
                  {currentStep === 2 && "Honest descriptions build trust and reduce back-and-forth with buyers."}
                  {currentStep === 3 && "Competitively priced items sell within 48 hours on average."}
                  {currentStep === 4 && "Provide an easy campus location like a hostel gate or library entrance."}
                  {currentStep === 5 && "Review everything before publishing. A higher quality score means more visibility!"}
                </p>
              </motion.div>
            </div>
          </div>
        )}

        {/* ════ RIGHT: FORM BUILDER (70%) ════ */}
        <div className="w-full lg:w-[70%] h-full flex-grow flex flex-col relative overflow-hidden">
          {showSuccess ? (
            /* ─── SUCCESS ─── */
            <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 text-center">
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: '#10b981', boxShadow: '0 12px 30px -6px rgba(16,185,129,0.35)' }}
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black mb-3" style={{ ...FONT_STYLE, letterSpacing: '-0.03em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Listing</span>{' '}
                <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Published</span>
              </h2>
              <p className="text-base mb-8 max-w-md" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>
                <strong style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{successTitle}</strong> is now live on the marketplace.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={resetForm} className="px-6 py-3 rounded-xl font-bold text-white transition-colors" style={{ ...FONT_STYLE, backgroundColor: '#0ea5e9' }}>Sell Another Item</button>
                <Link href="/marketplace/buy" className="px-6 py-3 rounded-xl font-bold border transition-colors" style={{ ...FONT_STYLE, borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#94a3b8' : '#64748b' }}>Browse Marketplace</Link>
              </div>
            </div>
          ) : (
            /* ─── FORM ─── */
            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full h-full overflow-hidden">

              {/* ─── STICKY HEADER ─── */}
              <div className="flex-shrink-0 p-4 lg:p-6 xl:px-12 xl:pt-6">
                {/* Page Title — Rideshare style */}
                <div className="mb-2">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ ...FONT_STYLE, letterSpacing: '-0.03em' }}>
                    <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>List</span>{' '}
                    <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Your Item</span>
                  </h1>
                  <p className="mt-2 text-sm font-medium" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>
                    Create a marketplace listing in a few quick steps.
                  </p>
                </div>
                <JourneyIndicator currentStep={currentStep} darkMode={darkMode} />
              </div>

              {/* ─── SCROLLABLE CONTENT ─── */}
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-4 lg:px-6 xl:px-12 pb-24 lg:pb-12 bg-transparent" style={{ scrollbarWidth: 'thin' }}>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3.5 rounded-xl flex items-center gap-3"
                    style={{ backgroundColor: darkMode ? 'rgba(127,29,29,0.2)' : 'rgba(254,226,226,0.6)', border: `1px solid ${darkMode ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.2)'}` }}
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                    <p className="text-sm font-medium" style={{ ...FONT_STYLE, color: darkMode ? '#fca5a5' : '#dc2626' }}>{errorMsg}</p>
                  </motion.div>
                )}

                <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="space-y-6"
                  >
                    {/* ─── STEP 1: CATEGORY ─── */}
                    {currentStep === 0 && (
                      <div>
                        <h2 className="text-2xl font-black mb-1" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                          What kind of item is it?
                        </h2>
                        <p className="text-sm mb-6" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>Choose the category that best fits.</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CATEGORIES.map((cat) => {
                            const CatIcon = cat.icon;
                            const isSelected = category === cat.value;
                            return (
                              <motion.button
                                key={cat.value} type="button"
                                onClick={() => { setCategory(cat.value); setErrorMsg(""); }}
                                className="relative p-3.5 rounded-2xl border text-left transition-all duration-300 overflow-hidden"
                                style={{
                                  backgroundColor: isSelected ? (darkMode ? cat.bgDark + '90' : cat.bgLight) : (darkMode ? '#1e293b' : '#ffffff'),
                                  borderColor: isSelected ? cat.color : (darkMode ? '#334155' : '#cbd5e1'),
                                  boxShadow: isSelected ? `0 0 0 2px ${cat.color}40` : (darkMode ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -1px rgba(0,0,0,0.04)'),
                                }}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.97 }}
                              >
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                                  style={{ backgroundColor: cat.color + (isSelected ? '25' : '10') }}
                                >
                                  <CatIcon className="w-5 h-5" style={{ color: cat.color }} />
                                </div>
                                <span className="text-sm font-bold block" style={{ ...FONT_STYLE, color: isSelected ? (darkMode ? '#f1f5f9' : '#0f172a') : (darkMode ? '#94a3b8' : '#64748b') }}>
                                  {cat.label}
                                </span>
                                {isSelected && (
                                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.color }}>
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 2: PHOTOS ─── */}
                    {currentStep === 1 && (
                      <div>
                        <h2 className="text-2xl font-black mb-1" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                          Add a photo
                        </h2>
                        <p className="text-sm mb-6" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>A clear photo makes your listing stand out.</p>

                        {!imagePreview ? (
                          <motion.label
                            className="flex flex-col items-center justify-center py-16 px-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300"
                            style={{
                              borderColor: isDragging ? '#0ea5e9' : (darkMode ? '#334155' : '#d1d5db'),
                              backgroundColor: isDragging ? (darkMode ? 'rgba(14,165,233,0.1)' : 'rgba(14,165,233,0.05)') : (darkMode ? '#1e293b' : '#ffffff'),
                            }}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={handleDrop}
                            whileHover={{ scale: 1.005 }}
                          >
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                              style={{ backgroundColor: darkMode ? 'rgba(14,165,233,0.15)' : 'rgba(14,165,233,0.1)' }}
                            >
                              <Camera className="w-8 h-8" style={{ color: '#0ea5e9' }} />
                            </div>
                            <h3 className="text-lg font-bold mb-1" style={{ ...FONT_STYLE, color: darkMode ? '#f1f5f9' : '#0f172a' }}>Click or drag to upload</h3>
                            <p className="text-xs" style={{ color: darkMode ? '#64748b' : '#94a3b8' }}>JPG, PNG — up to 5MB</p>
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                          </motion.label>
                        ) : (
                          <div className="relative w-full aspect-video rounded-3xl overflow-hidden group" style={{ border: `3px solid ${darkMode ? '#1e293b' : '#e2e8f0'}`, boxShadow: '0 12px 30px -8px rgba(0,0,0,0.12)' }}>
                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" style={{ backdropFilter: 'blur(4px)' }}>
                              <button type="button" onClick={() => { setImagePreview(null); setImageFile(null); }} className="px-5 py-2.5 rounded-xl text-white font-bold text-sm flex items-center gap-2" style={{ backgroundColor: '#ef4444' }}>
                                <Trash2 className="w-4 h-4" /> Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ─── STEP 3: DETAILS ─── */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-black mb-1" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                            Item details
                          </h2>
                          <p className="text-sm mb-6" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>Help buyers know what they're getting.</p>
                        </div>

                        {/* Title */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>Item Name *</label>
                          <input
                            value={title} onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Sony WH-1000XM4 Headphones"
                            maxLength={80}
                            className="w-full px-4 py-3.5 rounded-xl border text-base font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                            style={{
                              ...FONT_STYLE,
                              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                              borderColor: darkMode ? '#334155' : '#e2e8f0',
                              color: darkMode ? '#f1f5f9' : '#0f172a',
                              boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                          />
                          <div className="flex justify-between mt-1.5 px-0.5">
                            <span className="text-[11px] font-medium" style={{ ...FONT_STYLE, color: title.length >= 15 ? '#10b981' : '#f59e0b' }}>
                              {title.length === 0 ? "Be specific — include brand and model" : title.length < 15 ? "Add more detail" : "Looks good"}
                            </span>
                            <span className="text-[11px]" style={{ color: darkMode ? '#4b5563' : '#94a3b8' }}>{title.length}/80</span>
                          </div>
                        </div>

                        {/* Condition */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>Condition *</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {CONDITIONS.map((cond) => {
                              const CondIcon = cond.icon;
                              const isSelected = condition === cond.value;
                              return (
                                <button
                                  key={cond.value} type="button"
                                  onClick={() => setCondition(cond.value)}
                                  className="p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all duration-200"
                                  style={{
                                    backgroundColor: isSelected ? (darkMode ? '#1e293b' : '#ffffff') : (darkMode ? '#1e293b' : '#f8fafc'),
                                    borderColor: isSelected ? cond.color : (darkMode ? '#334155' : '#e2e8f0'),
                                    boxShadow: isSelected ? `0 0 0 2px ${cond.color}30` : 'none',
                                  }}
                                >
                                  <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: isSelected ? cond.color + '18' : (darkMode ? '#0f172a' : '#f1f5f9') }}
                                  >
                                    <CondIcon className="w-4 h-4" style={{ color: isSelected ? cond.color : (darkMode ? '#64748b' : '#94a3b8') }} />
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block text-sm font-bold" style={{ ...FONT_STYLE, color: isSelected ? (darkMode ? '#f1f5f9' : '#0f172a') : (darkMode ? '#94a3b8' : '#64748b') }}>
                                      {cond.label}
                                    </span>
                                    <span className="text-[10px] block mt-0.5 truncate" style={{ color: darkMode ? '#4b5563' : '#94a3b8' }}>{cond.desc}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Description */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>Description *</label>
                          <textarea
                            value={description} onChange={(e) => setDescription(e.target.value)}
                            placeholder="Share specifications, why you're selling, any flaws, included accessories..."
                            rows={4}
                            className="w-full px-4 py-3.5 rounded-xl border text-sm transition-all resize-none outline-none placeholder-slate-400 dark:placeholder-slate-500"
                            style={{
                              ...FONT_STYLE,
                              backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                              borderColor: darkMode ? '#334155' : '#e2e8f0',
                              color: darkMode ? '#f1f5f9' : '#0f172a',
                              boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                            }}
                          />
                          <div className="flex justify-between mt-1.5 px-0.5">
                            <span className="text-[11px] font-medium" style={{ ...FONT_STYLE, color: description.length >= 100 ? '#10b981' : '#f59e0b' }}>
                              {description.length === 0 ? "Buyers love detailed descriptions" : description.length < 100 ? `${100 - description.length} more chars needed` : "Great description"}
                            </span>
                            <span className="text-[11px]" style={{ color: darkMode ? '#4b5563' : '#94a3b8' }}>{description.length}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 4: PRICING ─── */}
                    {currentStep === 3 && (
                      <div>
                        <h2 className="text-2xl font-black mb-1 text-center" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                          Set your price
                        </h2>
                        <p className="text-sm mb-10 text-center" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>Price it right for a quick sale.</p>

                        <div className="max-w-xs mx-auto">
                          <div className="relative">
                            <span className="absolute inset-y-0 left-5 flex items-center text-3xl font-black" style={{ ...FONT_STYLE, color: darkMode ? '#64748b' : '#94a3b8' }}>₹</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={price}
                              onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, ''); setPrice(v); }}
                              placeholder="0"
                              className="w-full pl-14 pr-6 py-5 text-center text-4xl font-black rounded-2xl border-2 transition-all outline-none placeholder-slate-300 dark:placeholder-slate-600"
                              style={{
                                ...FONT_STYLE,
                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                borderColor: darkMode ? '#334155' : '#e2e8f0',
                                color: darkMode ? '#f1f5f9' : '#0f172a',
                                boxShadow: darkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.04)',
                              }}
                            />
                          </div>

                          <div
                            className="mt-6 p-4 rounded-2xl border flex items-start gap-3"
                            style={{
                              backgroundColor: darkMode ? 'rgba(49,46,129,0.2)' : '#eef2ff',
                              borderColor: darkMode ? 'rgba(99,102,241,0.2)' : '#c7d2fe',
                            }}
                          >
                            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#6366f1' }} />
                            <div>
                              <h4 className="text-sm font-bold" style={{ ...FONT_STYLE, color: darkMode ? '#a5b4fc' : '#4338ca' }}>Campus Average</h4>
                              <p className="text-xs mt-0.5" style={{ color: darkMode ? '#818cf8' : '#6366f1' }}>
                                Similar <strong>{CATEGORIES.find(c => c.value === category)?.label || 'items'}</strong> sell for ₹500–₹2,000.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 5: PICKUP & CONTACT ─── */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <div>
                          <h2 className="text-2xl font-black mb-1" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                            Pickup & Contact
                          </h2>
                          <p className="text-sm mb-6" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>Where and how can buyers reach you?</p>
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>Pickup Location *</label>
                          <div className="relative">
                            <MapPin className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                            <input
                              value={location} onChange={(e) => setLocation(e.target.value)}
                              placeholder="e.g. Main Library, Gate 2, Hostel A"
                              className="w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium transition-all outline-none placeholder-slate-400 dark:placeholder-slate-500"
                              style={{
                                ...FONT_STYLE,
                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                borderColor: darkMode ? '#334155' : '#e2e8f0',
                                color: darkMode ? '#f1f5f9' : '#0f172a',
                                boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                              }}
                            />
                          </div>
                        </div>

                        {/* Contacts */}
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>Contact Methods *</label>
                          <div className="space-y-2.5">
                            <AnimatePresence>
                              {contacts.map((contact) => {
                                const Icon = iconForType(contact.type);
                                return (
                                  <motion.div
                                    key={contact.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex gap-2"
                                  >
                                    <div
                                      className="flex items-center gap-2 flex-1 rounded-xl border px-3 transition-colors"
                                      style={{
                                        backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                        borderColor: darkMode ? '#334155' : '#e2e8f0',
                                        boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.04)',
                                      }}
                                    >
                                      <ContactDropdown 
                                        contact={contact} 
                                        handleContactChange={handleContactChange} 
                                        darkMode={darkMode} 
                                        fontStyle={FONT_STYLE} 
                                      />
                                      <div style={{ width: '1px', height: '20px', backgroundColor: darkMode ? '#334155' : '#e2e8f0' }} />
                                      <Icon className="w-3.5 h-3.5 ml-1 flex-shrink-0" style={{ color: darkMode ? '#64748b' : '#94a3b8' }} />
                                      <input
                                        type={contact.type === 'email' ? 'email' : 'text'}
                                        value={contact.value}
                                        onChange={(e) => handleContactChange(contact.id, 'value', e.target.value)}
                                        placeholder={contact.type === 'mobile' ? '+91 98765 43210' : contact.type === 'instagram' ? '@username' : contact.type === 'email' ? 'you@example.com' : 'Link or handle'}
                                        className="flex-1 py-3.5 outline-none text-sm font-medium placeholder-slate-400 dark:placeholder-slate-500"
                                        style={{
                                          ...FONT_STYLE,
                                          backgroundColor: 'transparent',
                                          color: darkMode ? '#f1f5f9' : '#0f172a',
                                        }}
                                      />
                                    </div>
                                    {contacts.length > 1 && (
                                      <button
                                        onClick={() => handleRemoveContact(contact.id)}
                                        className="w-12 rounded-xl border flex items-center justify-center transition-colors"
                                        style={{
                                          backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                          borderColor: darkMode ? '#334155' : '#e2e8f0',
                                          color: darkMode ? '#64748b' : '#94a3b8',
                                        }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    )}
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                            {contacts.length < 3 && (
                              <button
                                type="button"
                                onClick={handleAddContact}
                                className="w-full py-3.5 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors"
                                style={{
                                  ...FONT_STYLE,
                                  borderColor: darkMode ? '#334155' : '#d1d5db',
                                  color: darkMode ? '#38bdf8' : '#0ea5e9',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <Plus className="w-4 h-4" /> Add Another Method
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── STEP 6: REVIEW ─── */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-2xl font-black mb-1" style={{ ...FONT_STYLE, letterSpacing: '-0.02em', color: darkMode ? '#f1f5f9' : '#0f172a' }}>
                            Ready to publish?
                          </h2>
                          <p className="text-sm" style={{ ...FONT_STYLE, color: darkMode ? '#93C5FD' : '#0369a1' }}>Review your listing details.</p>
                        </div>

                        <div className="p-5 rounded-2xl border" style={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', boxShadow: darkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold" style={{ ...FONT_STYLE, color: darkMode ? '#f1f5f9' : '#0f172a' }}>Listing Quality</h3>
                            <span className="text-xl font-black" style={{ ...FONT_STYLE, color: listingScore >= 80 ? '#10b981' : listingScore >= 50 ? '#f59e0b' : '#ef4444' }}>{listingScore}%</span>
                          </div>

                          <div className="w-full h-2.5 rounded-full overflow-hidden mb-5" style={{ backgroundColor: darkMode ? '#0f172a' : '#f1f5f9' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: listingScore >= 80 ? '#10b981' : listingScore >= 50 ? '#f59e0b' : '#ef4444' }}
                              initial={{ width: 0 }}
                              animate={{ width: `${listingScore}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>

                          <div className="space-y-2.5">
                            {[
                              { label: 'Title & Category', valid: title && category },
                              { label: 'Photo Added', valid: !!imageFile },
                              { label: 'Price Set', valid: price > 0 },
                              { label: 'Description & Condition', valid: description && condition },
                              { label: 'Pickup & Contact', valid: location && contacts.some(c => c.value) }
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between py-1">
                                <span className="text-sm font-medium" style={{ ...FONT_STYLE, color: darkMode ? '#94a3b8' : '#64748b' }}>{item.label}</span>
                                {item.valid
                                  ? <CheckCircle className="w-4.5 h-4.5" style={{ color: '#10b981' }} />
                                  : <CircleDot className="w-4.5 h-4.5" style={{ color: darkMode ? '#334155' : '#d1d5db' }} />
                                }
                              </div>
                            ))}
                          </div>
                        </div>

                        {suggestions.length > 0 && (
                          <div className="p-4 rounded-2xl border" style={{ backgroundColor: darkMode ? 'rgba(120,53,15,0.15)' : '#fffbeb', borderColor: darkMode ? 'rgba(245,158,11,0.2)' : '#fde68a' }}>
                            <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2" style={{ ...FONT_STYLE, color: darkMode ? '#fbbf24' : '#92400e' }}>
                              <TrendingUp className="w-3.5 h-3.5" /> Tips to improve
                            </h4>
                            <ul className="space-y-1">
                              {suggestions.slice(0, 3).map((s, i) => (
                                <li key={i} className="text-[11px] font-medium" style={{ color: darkMode ? '#fcd34d' : '#a16207' }}>
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                </div>
              </div>

              {/* ─── STICKY BOTTOM NAV ─── */}
              <div className="flex-shrink-0 p-4 lg:p-6 xl:px-12 flex items-center justify-between border-t" style={{ borderColor: darkMode ? '#1e293b' : '#e2e8f0', backgroundColor: darkMode ? '#0f172a' : '#ffffff' }}>
                <button
                  type="button" onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-colors"
                  style={{
                    ...FONT_STYLE,
                    visibility: currentStep === 0 ? 'hidden' : 'visible',
                    color: darkMode ? '#94a3b8' : '#64748b',
                    backgroundColor: 'transparent',
                  }}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    type="button" onClick={handleNext}
                    className="px-7 py-3 rounded-xl font-bold flex items-center gap-2 text-sm text-white transition-all"
                    style={{ ...FONT_STYLE, backgroundColor: '#0ea5e9', boxShadow: '0 4px 14px -3px rgba(14,165,233,0.35)' }}
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button" onClick={handleSubmit}
                    disabled={loading || listingScore < 30 || !validateStep(4)}
                    className="px-8 py-3 rounded-xl font-bold flex items-center gap-2 text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ ...FONT_STYLE, backgroundColor: '#10b981', boxShadow: '0 4px 14px -3px rgba(16,185,129,0.35)' }}
                  >
                    {loading ? <><Loader className="w-4 h-4 animate-spin" /> Publishing...</> : <><Shield className="w-4 h-4" /> Publish Listing</>}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
