"use client";

import { t, HOUSING_THEME } from './housingTheme';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { DoorOpen, Users, PlusCircle } from 'lucide-react'; // imported as requested

export default function HousingModes({ darkMode }) {
  const theme = t(darkMode);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Helper for generating glow style strings if theme.shadow.glow isn't defined or a function
  const getGlow = (color) => {
    if (theme.shadow?.glow && typeof theme.shadow.glow === 'function') {
      return theme.shadow.glow(color);
    }
    return `0 0 20px ${color}40`;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full"
    >
      {/* PANEL A: FIND A ROOM (Left bordered, Horizontal LR) */}
      <motion.div variants={itemVariants} className="h-full">
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: getGlow(HOUSING_THEME.accent.blue) }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Link 
            href="/housing/search?type=room" 
            className={`block h-full relative overflow-hidden rounded-2xl border ${theme.borderColor} ${theme.surface.glass} backdrop-blur-xl group`}
          >
            {/* Left Border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: HOUSING_THEME.accent.blue }} />
            
            <div className="flex items-center justify-between p-6 h-full min-h-[220px]">
              <div className="flex flex-col flex-1 pr-4 z-10">
                <h3 className="text-xl font-bold mb-2">Find a Room</h3>
                <p className={`${theme.text.muted} mb-4 text-sm leading-relaxed`}>
                  Find a room that fits your location, budget, and lifestyle.
                </p>
                <span className="font-semibold text-sm transition-colors" style={{ color: HOUSING_THEME.accent.blue }}>
                  Explore Rooms &rarr;
                </span>
              </div>
              
              {/* Motif - Right aligned */}
              <div className={`opacity-30 group-hover:opacity-100 group-hover:text-[${HOUSING_THEME.accent.blue}] transition-all duration-300 flex-shrink-0 ${theme.text.muted}`}>
                <svg viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-20 h-24">
                  {/* Perspective Room / Doorway Motif */}
                  <path d="M20 90V10H60V90H20Z" strokeLinejoin="round"/>
                  <path d="M20 10L35 25V90" strokeLinejoin="round"/>
                  <path d="M60 10L75 25V90" strokeLinejoin="round"/>
                  <path d="M20 90L35 90H75" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* PANEL B: FIND A ROOMMATE (Top bordered, Horizontal RL) */}
      <motion.div variants={itemVariants} className="h-full">
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: getGlow(HOUSING_THEME.accent.purple) }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Link 
            href="/housing/search?type=roommate" 
            className={`block h-full relative overflow-hidden rounded-2xl border ${theme.borderColor} ${theme.surface.glass} backdrop-blur-xl group`}
          >
            {/* Top Border accent */}
            <div className="absolute left-0 right-0 top-0 h-1" style={{ backgroundColor: HOUSING_THEME.accent.purple }} />
            
            <div className="flex flex-row-reverse items-center justify-between p-6 h-full min-h-[220px]">
              <div className="flex flex-col flex-1 pl-4 z-10 text-right">
                <h3 className="text-xl font-bold mb-2">Find a Roommate</h3>
                <p className={`${theme.text.muted} mb-4 text-sm leading-relaxed`}>
                  Find someone who matches your lifestyle and preferences.
                </p>
                <span className="font-semibold text-sm transition-colors" style={{ color: HOUSING_THEME.accent.purple }}>
                  Find Roommates &rarr;
                </span>
              </div>
              
              {/* Motif - Left aligned */}
              <div className={`opacity-30 group-hover:opacity-100 group-hover:text-[${HOUSING_THEME.accent.purple}] transition-all duration-300 flex-shrink-0 ${theme.text.muted}`}>
                <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-20 h-20">
                  {/* Connected Circles Motif */}
                  <circle cx="30" cy="30" r="18" strokeLinecap="round" />
                  <circle cx="50" cy="50" r="18" strokeLinecap="round" />
                  <path d="M30 30L50 50" strokeDasharray="4 4" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* PANEL C: POST A SPACE (Bottom bordered, Centered) */}
      <motion.div variants={itemVariants} className="h-full">
        <motion.div 
          whileHover={{ scale: 1.02, boxShadow: getGlow(HOUSING_THEME.accent.green) }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <Link 
            href="/housing/post" 
            className={`block h-full relative overflow-hidden rounded-2xl border ${theme.borderColor} ${theme.surface.glass} backdrop-blur-xl group text-center flex flex-col justify-center`}
          >
            {/* Bottom Border accent */}
            <div className="absolute left-0 right-0 bottom-0 h-1" style={{ backgroundColor: HOUSING_THEME.accent.green }} />
            
            <div className="flex flex-col items-center p-6 h-full min-h-[220px] justify-center z-10">
              {/* Motif - Top/Center aligned */}
              <div className={`opacity-30 group-hover:opacity-100 group-hover:text-[${HOUSING_THEME.accent.green}] transition-all duration-300 mb-4 ${theme.text.muted}`}>
                <svg viewBox="0 0 60 80" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-20">
                  {/* Pinned Card Motif */}
                  <rect x="10" y="20" width="40" height="50" rx="2" />
                  <circle cx="30" cy="12" r="4" />
                  <path d="M30 16V20" />
                  <path d="M22 35H38" strokeLinecap="round" />
                  <path d="M22 45H32" strokeLinecap="round" />
                </svg>
              </div>
              
              <div className="flex flex-col">
                <h3 className="text-xl font-bold mb-2">Post a Space</h3>
                <p className={`${theme.text.muted} mb-4 text-sm leading-relaxed max-w-[200px] mx-auto`}>
                  Have an empty room or want to find someone to share your space?
                </p>
                <span className="font-semibold text-sm transition-colors" style={{ color: HOUSING_THEME.accent.green }}>
                  Post a Space &rarr;
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </motion.div>

    </motion.div>
  );
}
