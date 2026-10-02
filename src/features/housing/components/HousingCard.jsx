"use client";

import { t, HOUSING_THEME } from './housingTheme';
import { motion } from 'framer-motion';
import { MapPin, Heart, ArrowRight, Clock, Wifi, Bath, Sofa } from 'lucide-react';
import Link from 'next/link';

const TYPE_COLORS = {
  ROOM: 'bg-blue-500',
  PG: 'bg-green-500',
  APARTMENT: 'bg-yellow-500',
  ROOMMATE: 'bg-purple-500',
};

const TYPE_TEXT_COLORS = {
  ROOM: 'text-blue-500',
  PG: 'text-green-500',
  APARTMENT: 'text-yellow-500',
  ROOMMATE: 'text-purple-500',
};

const TYPE_GRADIENTS = {
  ROOM: 'from-blue-500 to-blue-400',
  PG: 'from-green-500 to-green-400',
  APARTMENT: 'from-yellow-500 to-yellow-400',
  ROOMMATE: 'from-purple-500 to-purple-400',
};

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400";

export default function HousingCard({ item, darkMode, index }) {
  const theme = t(darkMode);
  const variant = index % 4;
  const accentBg = TYPE_COLORS[item.type] || 'bg-blue-500';
  const accentText = TYPE_TEXT_COLORS[item.type] || 'text-blue-500';
  const accentGradient = TYPE_GRADIENTS[item.type] || 'from-blue-500 to-blue-400';
  
  const imageUrl = item.image || FALLBACK_IMAGE;
  
  const CardContainer = ({ children, className }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${theme.surface.card} ${theme.borderColor} hover:${theme.borderHover} ${className}`}
      style={{ boxShadow: darkMode ? '0 1px 2px 0 rgba(0, 0, 0, 0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}
    >
      <Link href={`/housing/${item.id}`} className="absolute inset-0 z-10" aria-label={`View ${item.title}`} />
      {children}
    </motion.div>
  );

  const Badge = () => (
    <div className="absolute top-3 right-3 z-20 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-md">
      {item.availability || 'AVAILABLE'}
    </div>
  );

  const ImageSection = ({ className = "" }) => (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.img 
        src={imageUrl} 
        alt={item.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      <Badge />
    </div>
  );

  const Title = () => (
    <h3 className={`font-bold text-base line-clamp-1 ${theme.text.primary}`}>
      {item.title}
    </h3>
  );

  const Price = () => (
    <div className={`font-bold text-lg ${accentText}`}>
      ₹{item.price} <span className={`text-sm font-normal ${theme.text.tertiary}`}>/ month</span>
    </div>
  );

  const Location = () => (
    <div className={`flex items-center text-sm ${theme.text.secondary}`}>
      <MapPin className="mr-1 h-4 w-4 shrink-0" />
      <span className="line-clamp-1">{item.location} {item.distance && `• ${item.distance}`}</span>
    </div>
  );

  const Features = () => (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {item.features?.slice(0, 3).map((feat, i) => (
        <span key={i} className={`rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${theme.surface.background} ${theme.text.secondary} border ${theme.borderColor}`}>
          {feat}
        </span>
      ))}
    </div>
  );

  const Footer = () => (
    <div className={`mt-4 flex items-center justify-between border-t ${theme.borderColor} pt-3`}>
      <div className="flex items-center gap-2">
        {item.user?.avatar ? (
          <img src={item.user.avatar} alt={item.user.name} className="h-6 w-6 rounded-full object-cover" />
        ) : (
          <div className={`flex h-6 w-6 items-center justify-center rounded-full ${theme.surface.background} ${theme.text.secondary} text-xs font-bold`}>
            {item.user?.name?.charAt(0) || 'U'}
          </div>
        )}
        <span className={`text-xs font-medium ${theme.text.secondary}`}>{item.user?.name || 'Anonymous'}</span>
      </div>
      <div className={`flex items-center text-sm font-semibold transition-colors ${accentText}`}>
        View Space <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  );

  // VARIANT A: Editorial
  if (variant === 0) {
    return (
      <CardContainer className="flex flex-col h-full shadow-sm hover:shadow-md">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentBg} z-20`} />
        <ImageSection className="h-[200px] w-full shrink-0" />
        <div className="flex flex-1 flex-col p-5 pl-6">
          <div className="mb-2 flex items-center justify-between">
            <span className={`text-xs font-bold tracking-wider uppercase ${accentText}`}>{item.type}</span>
          </div>
          <Title />
          <div className="mt-1 mb-3"><Location /></div>
          <Price />
          <Features />
          <div className="mt-auto"><Footer /></div>
        </div>
      </CardContainer>
    );
  }

  // VARIANT B: Blueprint
  if (variant === 1) {
    return (
      <CardContainer className="flex flex-col h-full p-3 shadow-sm hover:shadow-md">
        {/* Blueprint Watermark */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="10" y="10" width="80" height="80" />
            <path d="M10,30 Q30,30 30,10" />
            <line x1="90" y1="50" x2="70" y2="50" />
          </svg>
        </div>
        <ImageSection className="h-[180px] w-full shrink-0 rounded-xl z-10" />
        <div className="relative z-10 mt-3 flex flex-1 flex-col px-1">
          <div className="grid grid-cols-2 gap-2 mb-2 border-b pb-2" style={{ borderColor: 'inherit' }}>
            <div>
              <span className={`text-[10px] uppercase tracking-wider ${theme.text.tertiary}`}>Price</span>
              <Price />
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-wider ${theme.text.tertiary}`}>Location</span>
              <Location />
            </div>
          </div>
          <Title />
          <Features />
          <div className="mt-auto"><Footer /></div>
        </div>
      </CardContainer>
    );
  }

  // VARIANT C: Location-Anchored
  if (variant === 2) {
    return (
      <CardContainer className="flex flex-col sm:flex-row h-full shadow-sm hover:shadow-md">
        <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${accentGradient} z-20`} />
        
        {/* Mobile: Image top, Desktop: Image right */}
        <ImageSection className="h-[180px] sm:h-auto sm:w-[60%] sm:order-last shrink-0" />
        
        <div className="flex flex-1 flex-col p-4 pl-6 sm:w-[40%]">
          <div className="mb-2">
            <div className={`flex items-start text-sm font-semibold mb-1 ${theme.text.primary}`}>
              <MapPin className={`mr-1.5 h-5 w-5 shrink-0 ${accentText}`} />
              <span className="line-clamp-2 leading-tight">{item.location}</span>
            </div>
            {item.distance && <div className={`text-xs ml-6 ${theme.text.tertiary}`}>{item.distance}</div>}
          </div>
          
          <div className="mt-2 mb-1"><Title /></div>
          <Price />
          <Features />
          
          <div className="mt-auto pt-3 border-t mt-3" style={{ borderColor: 'var(--tw-border-color)' }}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold tracking-wider uppercase ${accentText}`}>{item.type}</span>
              <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${accentText}`} />
            </div>
          </div>
        </div>
      </CardContainer>
    );
  }

  // VARIANT D: Compact Dossier
  return (
    <CardContainer className="flex flex-row h-full p-3 items-center shadow-sm hover:shadow-md">
      <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-xl">
        <motion.img 
          src={imageUrl} 
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-1 right-1 z-20 rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-white">
          {item.availability || 'NOW'}
        </div>
      </div>
      
      <div className="ml-4 flex flex-1 flex-col justify-center min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-[10px] font-bold tracking-wider uppercase ${accentText}`}>{item.type}</span>
          <div className={`font-bold ${accentText}`}>₹{item.price}<span className="text-xs font-normal">/mo</span></div>
        </div>
        <Title />
        <div className="mt-1"><Location /></div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-1 overflow-hidden">
            {item.features?.slice(0, 2).map((feat, i) => (
              <span key={i} className={`truncate rounded px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider ${theme.surface.background} ${theme.text.secondary} border ${theme.borderColor}`}>
                {feat}
              </span>
            ))}
          </div>
          <ArrowRight className={`h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 ${accentText}`} />
        </div>
      </div>
    </CardContainer>
  );
}
