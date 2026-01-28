"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle, Filter, TrendingUp, Zap, Ticket } from "lucide-react";

// ✅ PERFORMANCE: Lazy load mobile version (16KB) - only needed on mobile devices
const MobileMain = dynamic(() => import("./mobilemain"), {
  loading: () => null,
  ssr: false, // Mobile UI not needed for SSR
});

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, isVisible, suffix = "" }) => {
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

// Define sections outside component to prevent re-creation on every render
const sections = [
  {
    title: 'Share a Ride',
    description: 'Find or share info about destinations, connect with others to share taxi/auto fares.',
    icon: <Car className="w-10 h-10" />,
    href: '/share-ride',
    color: 'from-blue-500 to-cyan-500',
    category: 'transport',
    features: ['Real-time matching', 'Cost splitting', 'Safe rides']
  },
  {
    title: 'Buy in Marketplace',
    description: 'Buy items within your college community at great prices.',
    icon: <ShoppingCart className="w-10 h-10" />,
    href: '/marketplace/buy',
    color: 'from-green-500 to-emerald-500',
    category: 'marketplace',
    features: ['Student verification', 'Price comparison', 'Local pickup']
  },
  {
    title: 'Sell Your Items',
    description: 'Sell your unused or used items to others in the community.',
    icon: <Tag className="w-10 h-10" />,
    href: '/marketplace/sell',
    color: 'from-purple-500 to-violet-500',
    category: 'marketplace',
    features: ['Easy listing', 'Price suggestions', 'Quick sales']
  },
  {
    title: 'Buy & Sell Tickets',
    description: 'Buy event tickets or sell your extra tickets to fellow students.',
    icon: <Ticket className="w-10 h-10" />,
    href: '/ticket',
    color: 'from-pink-500 to-rose-500',
    category: 'marketplace',
    features: ['Event verification', 'Secure transfers', 'Price protection']
  },
  {
    title: 'Find Housing & Roommates',
    description: 'Discover housing options and connect with potential roommates.',
    icon: <Home className="w-10 h-10" />,
    href: '/housing',
    color: 'from-orange-500 to-red-500',
    category: 'housing',
    features: ['Location filtering', 'Roommate matching', 'Virtual tours']
  },
  {
    title: 'Report Lost/Found Items',
    description: 'Report lost items or help others find their missing belongings.',
    icon: <Search className="w-10 h-10" />,
    href: '/lost-found',
    color: 'from-indigo-500 to-blue-500',
    category: 'community',
    features: ['AI matching', 'Photo recognition', 'Community help']
  },
  {
    title: 'View Found Items',
    description: 'Browse items that have been found and claim yours if you see it.',
    icon: <CheckCircle className="w-10 h-10" />,
    href: '/lost-found/view-found',
    color: 'from-teal-500 to-cyan-500',
    category: 'community',
    features: ['Image search', 'Location tracking', 'Verification system']
  },
  {
    title: 'Community Announcements',
    description: 'See important and urgent announcements from the community.',
    icon: <Megaphone className="w-10 h-10" />,
    href: '/announcements',
    color: 'from-rose-500 to-pink-500',
    category: 'communication',
    features: ['Real-time alerts', 'Priority filtering', 'Push notifications']
  },
  {
    title: 'Notes & Resources',
    description: 'Access notes, syllabus, PPTs, PDFs, previous year questions, and more.',
    icon: <BookOpen className="w-10 h-10" />,
    href: '/resources',
    color: 'from-teal-500 to-green-500',
    category: 'academic',
    features: ['Subject filtering', 'Quality ratings', 'Download tracking']
  },
  {
    title: 'Important Contacts',
    description: 'Find essential contacts and information for your locality or institution.',
    icon: <Phone className="w-10 h-10" />,
    href: '/contacts',
    color: 'from-violet-500 to-purple-500',
    category: 'communication',
    features: ['Emergency contacts', 'Department info', 'Quick dial']
  }
];

const Main = ({ darkMode, isVisible = false }) => {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSections, setFilteredSections] = useState(sections);
  const [animatedStats, setAnimatedStats] = useState(false);
  const [clickedSection, setClickedSection] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkIsMobile = () => {
      const width = window.innerWidth;
      const isMobileDevice = width < 768; // md breakpoint
      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkIsMobile();

    // Add resize listener
    const handleResize = () => {
      checkIsMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter sections based on search term and active filter
  useEffect(() => {
    let filtered = sections;
    
    // Filter by active filter first
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
    
    // Then filter by search term
    if (searchTerm !== '') {
      filtered = filtered.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredSections(filtered);
  }, [searchTerm, activeFilter]);

  // Animate stats when component becomes visible
  useEffect(() => {
    if (isVisible && !animatedStats) {
      setAnimatedStats(true);
    }
  }, [isVisible, animatedStats]);

  const handleSectionClick = (index) => {
    setClickedSection(index);
    setTimeout(() => setClickedSection(null), 200);
  };

  // Return mobile component if mobile detected
  if (isMobile) {
    return <MobileMain darkMode={darkMode} isVisible={isVisible} />;
  }

  // Desktop version (original implementation)
  return (
    <main className="w-full px-4 pt-8 md:pt-16 pb-16">
      {/* Modern Hero Section - Full Width - Always Visible */}
      <div 
        className="max-w-7xl mx-auto mb-24"
      >
        {/* Hero Content with Visual Elements */}
        <div className="relative">
          {/* Top Section */}
          <div className="text-center mb-20">

            {/* Modern Headline with Better Typography */}
            <h1 
              className={`text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[0.95] tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            >
              Your Campus,
              <br />
              <span className="brand-wordmark relative inline-block mt-2 whitespace-nowrap"
              style={{
                fontWeight: 900,
                letterSpacing: '-0.05em'
              }}>
                <span className="brand-uni">Conn</span><span className="brand-share">ected</span>
              </span>
            </h1>
            
            {/* Elegant Subtitle with Modern Font */}
            <p 
              className="text-xl md:text-2xl mb-16 max-w-4xl mx-auto leading-relaxed"
              style={{
                fontWeight: 400,
                letterSpacing: '-0.01em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                color: darkMode ? '#9CA3AF' : '#6B7280'
              }}
            >
              Share rides, trade items, find housing, and access resources—
              <span style={{ 
                fontWeight: 600,
                color: darkMode ? '#06B6D4' : '#3B82F6'
              }}> everything you need</span>
            </p>
          </div>

          {/* Modern Filter Chips */}
          <div 
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            {['All', 'Transport', 'Housing', 'Marketplace', 'Resources'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-8 py-3.5 rounded-2xl text-base transition-all duration-200 border-2 shadow-sm ${
                  activeFilter === filter
                    ? darkMode 
                      ? 'text-white shadow-lg hover:shadow-xl' 
                      : 'text-white shadow-lg hover:shadow-xl'
                    : darkMode
                      ? 'bg-slate-800/40 border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-blue-400 hover:shadow-md'
                }`}
                style={{
                  letterSpacing: '0.03em',
                  fontWeight: activeFilter === filter ? 700 : 600,
                  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  color: activeFilter === filter 
                    ? '#FFFFFF' 
                    : darkMode ? '#9CA3AF' : '#6B7280',
                  ...(activeFilter === filter && {
                    backgroundColor: darkMode ? '#8B5CF6' : '#3B82F6',
                    borderColor: darkMode ? '#8B5CF6' : '#3B82F6'
                  })
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Colorful Bottom Text */}
          <div 
            className="text-center mt-16"
          >
            <p 
              className="text-lg md:text-xl font-light tracking-tight"
              style={{
                letterSpacing: '-0.01em',
                fontWeight: 400,
                color: darkMode ? '#9CA3AF' : '#6B7280'
              }}
            >
              All in one place,
              {' '}
              <span style={{ 
                fontWeight: 600,
                color: darkMode ? '#06B6D4' : '#3B82F6'
              }}>
                designed for Students
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4">
        {filteredSections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {filteredSections.map((section, index) => {
            // Hide "View Found Items" card on large screens for perfect 3x3 grid
            const isViewFoundItems = section.title === 'View Found Items';
            if (isViewFoundItems && !isMobile) {
              return null;
            }

            // Get solid color for each card - Premium Dark iPhone Tones
            const getCardColor = (colorClass) => {
              const colorMap = {
                // Premium Dark iPhone-Inspired Colors - Each Card Unique & Different
                'from-blue-500 to-cyan-500': '#1D3557', // Deep Ocean Blue
                'from-green-500 to-emerald-500': '#2A4A3E', // Forest Green
                'from-purple-500 to-violet-500': '#3A3F47', // Graphite Smoke — elegant, tech-inspired neutral
                'from-pink-500 to-rose-500': '#8B5A6F', // Rich Mauve (changed - lighter)
                'from-orange-500 to-red-500': '#5C3A3A', // Warm Burgundy
                'from-indigo-500 to-blue-500': '#2C3E50', // Slate Gray
                'from-teal-500 to-cyan-500': '#2D5F5D', // Deep Teal
                'from-rose-500 to-pink-500': '#412532', // Dark Dusty Rose (changed - different)
                'from-teal-500 to-green-500': '#3A5A52', // Pine Green
                'from-violet-500 to-purple-500': '#524463', // Midnight Purple (changed - different)
              };
              return colorMap[colorClass] || '#1D3557';
            };

            const cardColor = getCardColor(section.color);
            
            return (
            <Link
              key={index}
              href={section.href}
              className="block group relative h-full"
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => handleSectionClick(index)}
              style={{ perspective: '2000px' }}
              aria-label={`${section.title} - ${section.description}`}
            >
              <div
                className="relative h-full min-h-[450px] transition-all duration-500 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: hoveredSection === index 
                    ? 'rotateX(-4deg) rotateY(6deg) translateY(-8px) scale(1.01)' 
                    : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
                  willChange: hoveredSection === index ? 'transform' : 'auto',
                }}
              >
                {/* Main Card with Solid Background */}
                <div
                  className="relative h-full rounded-[28px] overflow-hidden"
                  style={{
                    background: cardColor,
                    transform: 'translateZ(0)',
                    boxShadow: hoveredSection === index
                      ? `0 30px 60px -15px ${cardColor}40, 0 15px 30px -8px rgba(0,0,0,0.3)`
                      : `0 20px 40px -10px ${cardColor}25, 0 8px 16px -4px rgba(0,0,0,0.2)`,
                    transition: 'box-shadow 0.5s ease-out',
                  }}
                >
                  {/* Decorative Background Elements - Optimized */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                    {/* Large decorative circle bottom left */}
                    <div 
                      className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 border-white/10"
                      style={{
                        transform: hoveredSection === index ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.4s ease-out',
                      }}
                    />
                    {/* Medium circle top right */}
                    <div 
                      className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/10"
                      style={{
                        transform: hoveredSection === index ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.4s ease-out',
                      }}
                    />
                    {/* Small accent circle */}
                    <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
                    {/* Decorative dots cluster - bottom right */}
                    <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                      <div className="w-2 h-2 rounded-full bg-white/15" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/20" />
                      <div className="w-2 h-2 rounded-full bg-white/25" />
                    </div>
                  </div>

                  {/* 3D Floating Content Card - Optimized */}
                  <div 
                    className="absolute top-6 left-5 right-5 backdrop-blur-lg rounded-[20px] transition-all duration-400 border"
                    style={{
                      background: darkMode 
                        ? 'rgba(17, 24, 39, 0.95)'
                        : 'rgba(255, 255, 255, 0.95)',
                      borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                      transform: hoveredSection === index 
                        ? 'translateZ(40px) scale(1.01)' 
                        : 'translateZ(20px)',
                      transformStyle: 'preserve-3d',
                      boxShadow: hoveredSection === index
                        ? '0 25px 50px -12px rgba(0,0,0,0.35)'
                        : '0 15px 30px -8px rgba(0,0,0,0.25)',
                      willChange: hoveredSection === index ? 'transform' : 'auto',
                    }}
                  >
                    <div className="p-7">
                      {/* Category Badge */}
                      <div className="mb-6 flex items-center justify-between">
                        <div 
                          className="px-4 py-2 rounded-xl text-[10px] font-black tracking-[0.15em] uppercase"
                          style={{
                            background: `${cardColor}15`,
                            color: cardColor.includes('F59E0B') || cardColor.includes('D97706') || cardColor.includes('FBBF24') || cardColor.includes('EAB308') ? '#F59E0B' : '#3B82F6',
                            border: `1.5px solid ${cardColor}30`,
                            letterSpacing: '0.12em',
                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                          }}
                        >
                          {section.category}
                        </div>
                        <div className="flex gap-1.5">
                          <div 
                            className="w-2 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              backgroundColor: cardColor,
                              boxShadow: hoveredSection === index ? `0 0 8px ${cardColor}` : 'none',
                            }} 
                          />
                          <div 
                            className="w-2 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              backgroundColor: cardColor,
                              boxShadow: hoveredSection === index ? `0 0 8px ${cardColor}` : 'none',
                            }} 
                          />
                        </div>
                      </div>

                      {/* Icon - Optimized */}
                      <div 
                        className="inline-flex items-center justify-center w-16 h-16 rounded-[18px] mb-5 transition-all duration-400"
                        style={{
                          background: cardColor,
                          transform: hoveredSection === index ? 'translateZ(25px) rotate(-4deg) scale(1.08)' : 'translateZ(12px)',
                          transformStyle: 'preserve-3d',
                          boxShadow: `0 12px 24px -6px ${cardColor}60`,
                          color: '#ffffff',
                        }}
                      >
                        <div style={{ transform: 'scale(1.1)' }}>
                          {section.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-xl font-black mb-3 tracking-tight leading-tight"
                        style={{
                          transform: hoveredSection === index ? 'translateZ(18px)' : 'translateZ(8px)',
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.4s ease-out',
                          letterSpacing: '-0.02em',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          color: '#FFFFFF'
                        }}
                      >
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p 
                        className="text-sm leading-relaxed"
                        style={{
                          transform: hoveredSection === index ? 'translateZ(15px)' : 'translateZ(6px)',
                          transformStyle: 'preserve-3d',
                          transition: 'transform 0.4s ease-out',
                          lineHeight: '1.65',
                          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                          fontWeight: 400,
                          color: '#3B82F6'
                        }}
                      >
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom section with title and CTA - Optimized */}
                  <div className="absolute bottom-0 left-0 right-0 p-7">
                    <h2 
                      className="text-3xl font-black text-white mb-4 tracking-tight leading-tight"
                      style={{
                        transform: hoveredSection === index ? 'translateZ(28px)' : 'translateZ(5px)',
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.4s ease-out',
                        textShadow: '0 4px 20px rgba(0,0,0,0.4)',
                        letterSpacing: '-0.03em',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
                      }}
                    >
                      {section.title}
                    </h2>
                    
                    <div 
                      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold group-hover:gap-3.5 group-hover:bg-white/20 transition-all duration-300"
                      style={{
                        transform: hoveredSection === index ? 'translateZ(24px) scale(1.03)' : 'translateZ(3px)',
                        transformStyle: 'preserve-3d',
                        boxShadow: '0 8px 16px -4px rgba(0,0,0,0.3)',
                        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        letterSpacing: '0.01em'
                      }}
                    >
                      <span>Learn More</span>
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 16 16" 
                        fill="none" 
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <path 
                          d="M6 12L10 8L6 4" 
                          stroke="currentColor" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Gradient Overlay - Simplified */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
                      opacity: 0.6,
                    }}
                  />
                </div>

                {/* 3D Stack Layers - Solid Colors */}
                <div 
                  className="absolute inset-0 rounded-[28px] -z-10 transition-opacity duration-400"
                  style={{
                    background: `${cardColor}90`,
                    transform: 'translateZ(-30px) translateY(15px) scale(0.96)',
                    filter: 'blur(8px)',
                    opacity: hoveredSection === index ? 0.8 : 0.5,
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[28px] -z-20 transition-opacity duration-400"
                  style={{
                    background: `${cardColor}70`,
                    transform: 'translateZ(-60px) translateY(30px) scale(0.92)',
                    filter: 'blur(15px)',
                    opacity: hoveredSection === index ? 0.6 : 0.3,
                  }}
                />
              </div>
            </Link>
            );
          })}
        </div>
      ) : (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No services found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
      </div>

      {/* Enhanced Animated Stats Section - Hidden on mobile, shown in FAB popup */}
      <div className="max-w-7xl mx-auto mt-16 hidden md:block relative">
        {/* Clean background without colors */}
        
        <div className="relative z-10">
          {/* Enhanced Header with clean styling */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              {/* Clean header without background glow */}
              
              <h1 
              className={`text-6xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-[0.95] tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            >
              Community 
              <br />
              <span className="brand-wordmark relative inline-block mt-2 whitespace-nowrap"
              style={{
                fontWeight: 900,
                letterSpacing: '-0.05em'
              }}>
                <span className="brand-uni">imp</span><span className="brand-share">act</span>
              </span>
            </h1>
            </div>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mt-8 font-bold ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              See how our platform is making a difference in campus life
            </p>
          </div>

          {/* Ultra-Premium Glass Morphism Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12" id="stats-section">
            {[
              { 
                label: 'Active Users', 
                value: '400', 
                color: 'from-blue-500 to-cyan-400',
                accentColor: '#3b82f6',
                suffix: '+',
                bgPattern: 'users'
              },
              { 
                label: 'Rides Shared', 
                value: '630', 
                color: 'from-green-500 to-emerald-400',
                accentColor: '#10b981',
                suffix: '+',
                bgPattern: 'rides'
              },
              { 
                label: 'Items Traded', 
                value: '200', 
                color: 'from-purple-500 to-violet-400',
                accentColor: '#a855f7',
                suffix: '+',
                bgPattern: 'items'
              },
              { 
                label: 'Satisfaction Rate', 
                value: '90', 
                color: 'from-amber-500 to-orange-400',
                accentColor: '#f59e0b',
                suffix: '%',
                bgPattern: 'satisfaction'
              }
            ].map((stat, index) => (
              <div
                key={index}
                className="group relative text-center"
              >
                {/* Ultra-Premium Bold Glass Card with Hover Effects */}
                <div className="relative p-10 rounded-[32px] backdrop-blur-3xl border-2 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl overflow-hidden"
                  style={{
                    background: darkMode 
                      ? `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.08) 0%,
                          rgba(255, 255, 255, 0.04) 100%)`
                      : `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.25) 0%,
                          rgba(255, 255, 255, 0.12) 100%)`,
                    borderColor: darkMode 
                      ? 'rgba(255, 255, 255, 0.15)'
                      : 'rgba(255, 255, 255, 0.25)',
                    boxShadow: `
                      0 32px 64px -12px rgba(0, 0, 0, 0.4),
                      0 20px 40px -15px rgba(0, 0, 0, 0.3),
                      inset 0 2px 0 rgba(255, 255, 255, 0.15),
                      inset 0 -2px 0 rgba(0, 0, 0, 0.05),
                      0 2px 0 rgba(255, 255, 255, 0.1)
                    `
                  }}>
                  
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0" style={{
                      backgroundImage: stat.bgPattern === 'users' 
                        ? `radial-gradient(circle at 20% 50%, ${stat.accentColor}15 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${stat.accentColor}10 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, ${stat.accentColor}08 0%, transparent 50%)`
                        : stat.bgPattern === 'rides'
                        ? `linear-gradient(135deg, ${stat.accentColor}08 0%, transparent 50%),
                           radial-gradient(circle at 70% 30%, ${stat.accentColor}12 0%, transparent 40%)`
                        : stat.bgPattern === 'items'
                        ? `radial-gradient(ellipse at 50% 50%, ${stat.accentColor}10 0%, transparent 50%),
                           conic-gradient(from 45deg at 50% 50%, transparent 0%, ${stat.accentColor}08 25%, transparent 50%)`
                        : `radial-gradient(circle at 50% 50%, ${stat.accentColor}15 0%, transparent 60%),
                           linear-gradient(45deg, ${stat.accentColor}05 25%, transparent 25%, transparent 75%, ${stat.accentColor}05 75%)`
                    }} />
                  </div>

                  {/* Decorative Background Symbols */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Large Background Symbol */}
                    <div className={`absolute transition-all duration-700 ${
                      stat.bgPattern === 'users' ? 'top-4 right-4 w-32 h-32' :
                      stat.bgPattern === 'rides' ? 'top-2 right-2 w-36 h-36' :
                      stat.bgPattern === 'items' ? 'bottom-2 right-2 w-32 h-32' :
                      'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40'
                    } group-hover:scale-110 group-hover:rotate-6`}
                      style={{
                        opacity: darkMode ? 0.04 : 0.06,
                        filter: 'blur(1px)'
                      }}>
                      {stat.bgPattern === 'users' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full text-gradient bg-gradient-to-br ${stat.color}`}>
                          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                          <circle cx="18" cy="8" r="3" opacity="0.6"/>
                          <circle cx="6" cy="8" r="3" opacity="0.6"/>
                        </svg>
                      )}
                      {stat.bgPattern === 'rides' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-full h-full text-gradient bg-gradient-to-br ${stat.color}`}>
                          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                          <path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10M13 16h5.586a1 1 0 00.707-.293l2.414-2.414A1 1 0 0022 12.586V10a1 1 0 00-1-1h-4"/>
                          <path d="M3 9h10" strokeLinecap="round"/>
                        </svg>
                      )}
                      {stat.bgPattern === 'items' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`w-full h-full text-gradient bg-gradient-to-br ${stat.color}`}>
                          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                          <circle cx="17" cy="8" r="1.5" opacity="0.5"/>
                          <circle cx="12" cy="6" r="1" opacity="0.5"/>
                        </svg>
                      )}
                      {stat.bgPattern === 'satisfaction' && (
                        <svg viewBox="0 0 24 24" fill="currentColor" className={`w-full h-full text-gradient bg-gradient-to-br ${stat.color}`}>
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          <circle cx="12" cy="12" r="4" opacity="0.3"/>
                        </svg>
                      )}
                    </div>

                    {/* Small Floating Decorative Elements */}
                    <div className="absolute top-6 left-6 w-2 h-2 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-500" style={{ boxShadow: `0 0 20px ${stat.accentColor}40` }} />
                    <div className="absolute bottom-8 left-8 w-1.5 h-1.5 rounded-full bg-white/15 group-hover:scale-150 group-hover:translate-y-1 transition-all duration-700" style={{ boxShadow: `0 0 15px ${stat.accentColor}30` }} />
                    <div className="absolute top-1/3 left-4 w-1 h-1 rounded-full bg-white/10 group-hover:scale-[2] transition-transform duration-600" />
                    
                    {/* Gradient Accent Line */}
                    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} 
                      style={{ 
                        boxShadow: `0 0 20px ${stat.accentColor}60, 0 0 40px ${stat.accentColor}30` 
                      }}
                    />
                  </div>
                  
                  {/* Counter with Enhanced Typography */}
                  <div className={`relative z-10 text-5xl font-bold mb-4 transition-all duration-500 group-hover:scale-110 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                    letterSpacing: '-0.03em',
                    fontWeight: 700,
                    textShadow: darkMode 
                      ? `0 0 40px ${stat.accentColor}40, 0 2px 8px rgba(0,0,0,0.3)`
                      : `0 2px 8px rgba(0,0,0,0.1)`
                  }}>
                    <AnimatedCounter 
                      end={stat.value} 
                      isVisible={animatedStats} 
                      suffix={stat.suffix}
                    />
                  </div>
                  
                  {/* Enhanced Label Typography with Hover Effect */}
                  <div className={`relative z-10 text-lg font-bold tracking-wide transition-all duration-300 group-hover:translate-y-1 ${
                    darkMode ? 'text-white/90 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                    letterSpacing: '0.01em'
                  }}>
                    {stat.label}
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                    style={{
                      background: `radial-gradient(circle at center, ${stat.accentColor}15 0%, transparent 70%)`,
                      filter: 'blur(20px)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
