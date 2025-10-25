"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle, Filter, TrendingUp, Zap, Menu, X, Ticket } from 'lucide-react';
import Image from 'next/image';
import logoImage from '../assets/images/logounishare1.png';

// Animated Counter Component (optimized for mobile)
const AnimatedCounter = ({ end, duration = 1500, isVisible, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!isVisible) return;
    
    let startTime = null;
    const startValue = 0;
    const endValue = parseInt(end.replace(/,/g, '').replace(/\+/g, '').replace(/%/g, ''));
    
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easeOutCubic * endValue);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);
  
  const formatNumber = (num) => {
    if (suffix === '%') return `${num}%`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k+`;
    return `${num.toLocaleString()}+`;
  };
  
  return <span>{formatNumber(count)}</span>;
};

// Mobile-optimized sections with essential features only
const sections = [
  {
    title: 'Share a Ride',
    description: 'Find rides & split costs with others.',
    icon: <Car className="w-6 h-6" />,
    href: '/share-ride',
    color: 'from-blue-500 to-cyan-500',
    category: 'transport',
    keyFeature: 'Cost splitting'
  },
  {
    title: 'Buy Items',
    description: 'Shop from your college community.',
    icon: <ShoppingCart className="w-6 h-6" />,
    href: '/marketplace/buy',
    color: 'from-green-500 to-emerald-500',
    category: 'marketplace',
    keyFeature: 'Student verified'
  },
  {
    title: 'Sell Items',
    description: 'Sell unused and unused items quickly.',
    icon: <Tag className="w-6 h-6" />,
    href: '/marketplace/sell',
    color: 'from-purple-500 to-violet-500',
    category: 'marketplace',
    keyFeature: 'Easy listing'
  },
  {
    title: 'Buy/Sell Tickets',
    description: 'Browse campus event tickets or list extras securely.',
    icon: <Ticket className="w-6 h-6" />,
    href: '/ticket',
    color: 'from-pink-500 to-rose-500',
    category: 'marketplace',
    keyFeature: 'Secure transfers'
  },
  {
    title: 'Find Housing',
    description: 'Discover rooms & Roomates',
    icon: <Home className="w-6 h-6" />,
    href: '/housing',
    color: 'from-orange-500 to-red-500',
    category: 'housing',
    keyFeature: 'Location match'
  },
  {
    title: 'Lost & Found',
    description: 'Report or find missing items.',
    icon: <Search className="w-6 h-6" />,
    href: '/lost-found/report',
    color: 'from-indigo-500 to-blue-500',
    category: 'community',
    keyFeature: 'Easy Reporting'
  },
  {
    title: 'View Found Items',
    description: 'Browse found items to claim.',
    icon: <CheckCircle className="w-6 h-6" />,
    href: '/lost-found/view-found',
    color: 'from-teal-500 to-cyan-500',
    category: 'community',
    keyFeature: 'Photo search'
  },
  {
    title: 'Announcements',
    description: 'Important community updates.',
    icon: <Megaphone className="w-6 h-6" />,
    href: '/announcements',
    color: 'from-rose-500 to-pink-500',
    category: 'communication',
    keyFeature: 'Real-time alerts'
  },
  {
    title: 'Study Resources',
    description: 'Notes, PDFs & exam materials.',
    icon: <BookOpen className="w-6 h-6" />,
    href: '/resources',
    color: 'from-teal-500 to-green-500',
    category: 'academic',
    keyFeature: 'Quality rated'
  },
  {
    title: 'Contacts',
    description: 'Essential campus contacts.',
    icon: <Phone className="w-6 h-6" />,
    href: '/contacts',
    color: 'from-violet-500 to-purple-500',
    category: 'communication',
    keyFeature: 'Quick dial'
  }
];

const MobileMain = ({ darkMode, isVisible = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState(sections);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);

  // Filter sections
  useEffect(() => {
    let filtered = sections;
    
    if (activeFilter !== 'All') {
      const filterMap = {
        'Transport': 'transport',
        'Housing': 'housing', 
        'Marketplace': 'marketplace',
        'Resources': 'academic'
      };
      filtered = filtered.filter(section => 
        section.category === filterMap[activeFilter]
      );
    }
    
    if (searchTerm !== '') {
      filtered = filtered.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.keyFeature.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSections(filtered);
  }, [searchTerm, activeFilter]);

  // Animate stats when visible
  useEffect(() => {
    if (isVisible && !animatedStats) {
      setAnimatedStats(true);
    }
  }, [isVisible, animatedStats]);

  // Handle touch gestures for better mobile interaction
  const handleTouchStart = (e) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;
    
    // Subtle haptic feedback on scroll (if supported)
    // if (Math.abs(diff) > 50 && 'vibrate' in navigator) {
    //   navigator.vibrate(50);
    // }
  };

  return (
    <div
      className="max-w-sm mx-auto px-3 pt-2 pb-2 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Header - Compact */}
      <div 
        className="text-center mb-4 transition-all duration-800 opacity-100"
      >
        {/* Compact Welcome Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 transition-all duration-500 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-400/30' 
              : 'bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-300/30'
          }`}
          style={{
            color: '#FFFFFF',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}
        >
          <Zap className="w-3.5 h-3.5" style={{ color: darkMode ? '#06B6D4' : '#3B82F6' }} />
          <span>Campus Community</span>
          <div 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{
              backgroundColor: darkMode ? '#06B6D4' : '#3B82F6'
            }}
          />
        </div>

        {/* Modern Tagline */}
        <h2 
          className="text-2xl font-bold mb-3 px-2 leading-tight"
          style={{
            color: '#FFFFFF',
            letterSpacing: '-0.02em'
          }}
        >
          Everything you need for{' '}
          <span 
            className={`${
              darkMode 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
                : 'bg-gradient-to-r from-blue-500 to-violet-500'
            } bg-clip-text text-transparent`}
            style={{
              fontWeight: 800
            }}
          >
            campus life
          </span>
        </h2>

        {/* Bottom Tagline */}
        <p 
          className="text-sm mb-6 px-2"
          style={{
            color: darkMode ? '#9CA3AF' : '#6B7280',
            fontWeight: 400,
            letterSpacing: '-0.01em'
          }}
        >
          All in one place,{' '}
          <span style={{ 
            fontWeight: 600,
            color: darkMode ? '#06B6D4' : '#3B82F6'
          }}>
            designed for Students
          </span>
        </p>

      </div>

      {/* Mobile Services Grid - Modern Card Design */}
      {filteredSections.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mb-2 mt-8">
          {filteredSections.map((section, index) => {
            const cardColor = darkMode
              ? ['#2563EB', '#FBBF24', '#1D4ED8', '#F59E0B', '#3B82F6', '#D97706', '#1E40AF', '#EAB308'][index % 8]
              : ['#3B82F6', '#F59E0B', '#2563EB', '#FBBF24', '#1D4ED8', '#D97706', '#1E40AF', '#EAB308'][index % 8];
            
            const isYellow = cardColor.startsWith('#F') || cardColor.startsWith('#D') || cardColor.startsWith('#E');

            return (
              <Link
                key={index}
                href={section.href}
                className="block group rounded-3xl overflow-hidden transition-all duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                style={{
                  boxShadow: darkMode ? `0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.2)` : `0 10px 25px -5px ${cardColor}40, 0 8px 10px -6px ${cardColor}20`,
                  '--card-color': cardColor,
                  '--ring-color': isYellow ? 'rgba(251, 191, 36, 0.5)' : 'rgba(59, 130, 246, 0.5)',
                }}
              >
                <div
                  className="relative w-full h-full pt-6 pb-5 px-4 flex flex-col justify-between min-h-[210px] transition-all duration-300 ease-in-out"
                  style={{
                    background: `linear-gradient(150deg, ${cardColor} 30%, ${isYellow ? '#A16207' : '#1E3A8A'} 100%)`,
                  }}
                >
                  {/* Glossy Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                  
                  {/* Icon */}
                  <div className="relative z-10 flex justify-start">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ease-in-out transform group-hover:scale-110 group-hover:-rotate-6"
                      style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                      }}
                    >
                      <div className="transform scale-125">
                        {section.icon}
                      </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="relative z-10 mt-auto">
                    <h3
                      className="text-white text-lg font-black tracking-tight leading-tight"
                      style={{
                        textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                      }}
                    >
                      {section.title}
                    </h3>
                    <p
                      className="text-white/70 text-xs mt-1"
                      style={{
                        textShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {section.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/70 group-hover:bg-white/20 group-hover:text-white transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium mb-1">No services found</h3>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
};

export default MobileMain;