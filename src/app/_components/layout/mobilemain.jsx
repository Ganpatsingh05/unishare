"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle, Filter, TrendingUp, Zap, Menu, X, Ticket } from "lucide-react";
import Image from "next/image";


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
      className="max-w-sm mx-auto px-3 pt-4 pb-2 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Header - Compact */}
      <div 
        className="text-center mb-4 transition-all duration-800 opacity-100"
      >
        {/* Compact Welcome Badge */}
        <div 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-6 transition-all duration-500"
          style={{
            background: darkMode 
              ? 'rgba(30, 41, 59, 0.8)'  // Dark slate background
              : 'rgba(15, 23, 42, 0.7)', // Very dark blue-gray
            border: '1px solid rgba(71, 85, 105, 0.5)',
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
              backgroundColor: darkMode ? '#257381' : '#0a2b60'
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
            // Color mapping matching desktop theme
            const getCardColor = (colorClass) => {
              const colorMap = {
                'from-blue-500 to-cyan-500': '#1A2E4A',      // Darker Navy Blue
                'from-green-500 to-emerald-500': '#295742',  // Darker Forest Green
                'from-purple-500 to-violet-500': '#5A327F',  // Darker Royal Purple
                'from-pink-500 to-rose-500': '#6c193a',      // Darker Magenta Rose
                'from-orange-500 to-red-500': '#782e2e',     // Darker Crimson Red
                'from-indigo-500 to-blue-500': '#252b53',    // Darker Deep Indigo
                'from-teal-500 to-cyan-500': '#005A4F',      // Darker Teal
                'from-rose-500 to-pink-500': '#592f41',      // Darker Deep Rose
                'from-teal-500 to-green-500': '#254727',     // Darker Emerald Green
                'from-violet-500 to-purple-500': '#352e3d',  // Darker Midnight Purple
              };
              return colorMap[colorClass] || '#1A2E4A';
            };

            const cardColor = getCardColor(section.color);
            const isYellow = false; // No yellow in this theme
            
            return (
              <Link
                key={index}
                href={section.href}
                className="block group rounded-[28px] overflow-hidden transition-all duration-300 ease-in-out transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50"
                style={{
                  boxShadow: `0 10px 25px -5px ${cardColor}40, 0 8px 10px -6px ${cardColor}20`,
                  '--card-color': cardColor,
                  '--ring-color': `${cardColor}50`,
                }}
              >
                <div
                  className="relative w-full h-full pt-6 pb-5 px-4 flex flex-col justify-between min-h-[210px] transition-all duration-300 ease-in-out"
                  style={{
                    background: cardColor,
                  }}
                >
                  {/* Decorative Background Elements */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    {/* Large decorative circle bottom left */}
                    <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full border-2 border-white/20" />
                    {/* Medium circle top right */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full border-2 border-white/20" />
                    {/* Small accent circle */}
                    <div className="absolute top-5 left-5 w-3 h-3 rounded-full bg-white/30" />
                    {/* Additional decorative circles */}
                    <div className="absolute top-1/2 right-8 w-4 h-4 rounded-full border-2 border-white/15" />
                    <div className="absolute bottom-16 left-8 w-5 h-5 rounded-full border-2 border-white/15" />
                    {/* Decorative dots cluster */}
                    <div className="absolute bottom-5 right-5 grid grid-cols-2 gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/25" />
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <div className="w-2 h-2 rounded-full bg-white/35" />
                    </div>
                    {/* Curved lines */}
                    <div className="absolute top-10 left-1/4 w-12 h-12 rounded-full border-2 border-white/10 transform rotate-45" />
                  </div>

                  {/* 3D Floating Content Card */}
                  <div
                    className="absolute top-3 left-2 right-2 backdrop-blur-lg rounded-[18px] border"
                    style={{
                      background: darkMode 
                        ? 'rgba(17, 24, 39, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      boxShadow: '0 8px 16px -4px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div className="p-4">
                      {/* Category Badge */}
                      <div className="mb-3 flex items-center justify-between">
                        <div 
                          className="px-3 py-1.5 rounded-lg text-[9px] font-black tracking-[0.12em] uppercase"
                          style={{
                            background: `${cardColor}15`,
                            color: '#3B82F6',
                            border: `1px solid ${cardColor}30`,
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                          }}
                        >
                          {section.category}
                        </div>
                        <div className="flex gap-1">
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cardColor }} 
                          />
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: cardColor }} 
                          />
                        </div>
                      </div>

                      {/* Icon */}
                      <div 
                        className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] mb-3 transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: cardColor,
                          boxShadow: `0 6px 12px -3px ${cardColor}60`,
                          color: '#ffffff',
                        }}
                      >
                        <div style={{ transform: 'scale(0.9)' }}>
                          {section.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className="text-base font-black tracking-tight leading-tight mb-1"
                        style={{
                          letterSpacing: '-0.02em',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          color: '#FFFFFF'
                        }}
                      >
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs leading-snug"
                        style={{
                          color: darkMode ? '#9CA3AF' : '#6B7280',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                        }}
                      >
                        {section.description}
                      </p>
                    </div>
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
