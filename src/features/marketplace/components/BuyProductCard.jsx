import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, ShieldCheck, Clock, CameraOff, Star, BadgeCheck, Laptop, BookOpen, Bike, Home, Gamepad2, Music, Trophy, Package } from 'lucide-react';
import Image from 'next/image';

const CONDITIONS = {
  new: { label: 'New', color: '#10b981' },
  'like-new': { label: 'Like New', color: '#3b82f6' },
  good: { label: 'Good', color: '#60a5fa' },
  fair: { label: 'Fair', color: '#f97316' },
  damaged: { label: 'Damaged', color: '#ef4444' },
};

const CATEGORY_MAP = {
  electronics: { label: 'Electronics', icon: Laptop },
  books: { label: 'Books', icon: BookOpen },
  furniture: { label: 'Hostel Essentials', icon: Home },
  accessories: { label: 'Accessories', icon: Package },
  other: { label: 'Other', icon: Package },
};

export default function BuyProductCard({ item, onClick, darkMode, index = 0 }) {
  const {
    id,
    title,
    price,
    condition = 'good',
    location,
    created_at,
    image_url,
    profiles,
    category,
    description
  } = item;

  const cond = CONDITIONS[condition] || CONDITIONS['good'];
  const catObj = CATEGORY_MAP[category] || CATEGORY_MAP['other'];
  const CatIcon = catObj.icon;

  const getTimeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    return 'Just now';
  };

  return (
    <motion.div
      onClick={() => onClick(id)}
      className="group cursor-pointer w-full h-full relative"
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Brush stroke border — sits ON TOP of the card as a frame */}
      {index === 0 && (
        <img 
          src="/images/borders/yellow_brush_tl.png" 
          alt="" 
          className="absolute pointer-events-none z-20" 
          style={{ 
            top: '-32px', 
            left: '-28px', 
            width: 'calc(100% + 56px)', 
            height: 'calc(100% + 80px)', 
            objectFit: 'fill',
          }}
        />
      )}
      <div
        className="relative z-10 w-full h-full rounded-3xl overflow-hidden transition-all duration-300 flex flex-col"
        style={{
          backgroundColor: darkMode ? '#111827' : '#ffffff',
          border: darkMode 
            ? '2px solid rgba(255,255,255,0.18)'
            : '2px solid #222',
          boxShadow: darkMode
            ? '4px 6px 0 0 rgba(255,255,255,0.08), 0 20px 40px -12px rgba(0,0,0,0.5)'
            : '4px 6px 0 0 #222, 0 25px 50px -12px rgba(0,0,0,0.15)',
        }}
      >
        {/* Time Badge Header */}
        <div
          className="px-4 py-2 border-b flex items-center justify-end"
          style={{ borderColor: darkMode ? '#1f2937' : '#f1f5f9', backgroundColor: darkMode ? '#0f172a' : '#f8fafc' }}
        >
          <span className="flex items-center gap-1.5 text-[10px] font-semibold" style={{ color: '#10b981' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {getTimeAgo(created_at)}
          </span>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden" style={{ backgroundColor: darkMode ? '#1e293b' : '#f1f5f9' }}>
          {image_url ? (
            <Image
              src={image_url}
              alt={title}
              fill
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="400px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CameraOff className="w-8 h-8 mb-2" style={{ color: darkMode ? '#374151' : '#cbd5e1' }} />
              <span className="text-xs font-medium" style={{ color: darkMode ? '#4b5563' : '#94a3b8' }}>
                No image
              </span>
            </div>
          )}

          {/* Category + Condition Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            <div
              className="px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
            >
              <CatIcon className="w-2.5 h-2.5" />
              {catObj.label}
            </div>
            {cond && (
              <div
                className="px-2 py-1 rounded-lg text-[9px] font-bold text-white flex items-center gap-1"
                style={{ backgroundColor: cond.color + 'DD' }}
              >
                <Star className="w-2.5 h-2.5" />
                {cond.label}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <button 
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
            style={{ backgroundColor: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(8px)' }}
            onClick={(e) => { e.stopPropagation(); }}
          >
            <Heart className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Title & Price */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <h3
              className="font-bold text-base leading-tight line-clamp-1"
              style={{ color: darkMode ? '#f1f5f9' : '#0f172a' }}
            >
              {title}
            </h3>
            <span
              className="text-lg font-black shrink-0"
              style={{ color: darkMode ? '#facc15' : '#0ea5e9' }}
            >
              ₹{price}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 mb-2.5">
            <MapPin className="w-3 h-3" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }} />
            <span className="text-[11px] font-medium" style={{ color: darkMode ? '#93c5fd' : '#0369a1' }}>
              {location || 'Campus'}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs line-clamp-2 leading-relaxed mb-3" style={{ color: darkMode ? '#9ca3af' : '#64748b' }}>
            {description || 'Great condition item available for pickup on campus.'}
          </p>

          {/* Seller */}
          <div className="pt-3 mt-auto border-t flex items-center gap-2.5" style={{ borderColor: darkMode ? '#1f2937' : '#f1f5f9' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)' }}
            >
              {profiles?.avatar_url ? (
                <Image src={profiles.avatar_url} alt="Seller" width={28} height={28} className="w-full h-full object-cover" />
              ) : (
                (profiles?.full_name || 'U')[0].toUpperCase()
              )}
            </div>
            <div>
              <p className="text-xs font-semibold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>
                {profiles?.full_name || 'Student'}
              </p>
              <div className="flex items-center gap-0.5 text-[9px] font-semibold" style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>
                <BadgeCheck className="w-2.5 h-2.5" /> Verified
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
