import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, ShieldCheck, Heart, AlertTriangle, MessageCircle, ChevronRight, Share2, CameraOff } from 'lucide-react';
import Image from 'next/image';

export default function ProductDetailDrawer({ item, isOpen, onClose, darkMode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!item) return null;

  const {
    title,
    price,
    condition = 'good',
    location,
    description,
    created_at,
    image_url,
    profiles,
    category
  } = item;

  const bgDrawer = darkMode ? '#0f172a' : '#ffffff';
  const textPrimary = darkMode ? '#f8fafc' : '#0f172a';
  const textSecondary = darkMode ? '#94a3b8' : '#64748b';
  const borderClr = darkMode ? '#1e293b' : '#f1f5f9';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full md:w-[500px] lg:w-[600px] z-50 shadow-2xl flex flex-col overflow-hidden"
            style={{ backgroundColor: bgDrawer }}
          >
            {/* Header / Nav */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: borderClr }}>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                style={{ color: textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" style={{ color: textSecondary }}>
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 custom-scrollbar">
              
              {/* Image Gallery */}
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden relative mb-6 bg-gray-100 dark:bg-gray-800 shadow-inner">
                {image_url ? (
                  <Image src={image_url} alt={title} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <CameraOff className="w-10 h-10 text-gray-400 mb-2" />
                    <span className="text-gray-400 font-medium">No Image</span>
                  </div>
                )}
              </div>

              {/* Title & Price */}
              <div className="mb-6">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h2 className="text-2xl md:text-3xl font-black leading-tight" style={{ color: textPrimary, letterSpacing: '-0.03em' }}>
                    {title}
                  </h2>
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                    ₹{price}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: textSecondary }}>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Listed {new Date(created_at).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {location}</span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 font-bold capitalize text-xs">
                    {condition.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Seller Box */}
              <div className="p-4 rounded-2xl mb-8 flex items-center justify-between" style={{ backgroundColor: darkMode ? '#1e293b' : '#f8fafc' }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-inner overflow-hidden">
                    {profiles?.avatar_url ? (
                      <Image src={profiles.avatar_url} alt="Seller" width={48} height={48} className="object-cover" />
                    ) : (
                      (profiles?.full_name || 'U')[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-base flex items-center gap-1.5" style={{ color: textPrimary }}>
                      {profiles?.full_name || 'Anonymous Student'}
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </h4>
                    <p className="text-xs" style={{ color: textSecondary }}>Verified Student • Responds in ~1 hr</p>
                  </div>
                </div>
                <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform" style={{ color: textPrimary }}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-3" style={{ color: textPrimary }}>Description</h3>
                <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: textSecondary }}>
                  {description || "No description provided."}
                </p>
              </div>

              {/* Warning/Report */}
              <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t" style={{ borderColor: borderClr }}>
                <AlertTriangle className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">If this listing seems suspicious, <button className="underline hover:text-gray-600 dark:hover:text-gray-200">report it</button>.</span>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="p-4 md:p-6 border-t flex gap-3" style={{ borderColor: borderClr, backgroundColor: bgDrawer }}>
              <button 
                className="flex-1 py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-95"
                style={{ backgroundColor: '#2563eb' }}
                onClick={() => alert("Messaging features coming soon!")}
              >
                <MessageCircle className="w-5 h-5" />
                Message Seller
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
