"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
    features: ['Real-time matching', 'Cost splitting', 'Safe rides'],
    image: '/images/cards/ride.png',
    cta: 'Find a Ride',
    imageContainerClass: 'justify-center',
    imageClass: 'w-[90%] max-h-[200px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
  },
  {
    title: 'Sell Your Items',
    description: 'Sell your unused or used items to others in the community.',
    icon: <Tag className="w-10 h-10" />,
    href: '/marketplace/sell',
    color: 'from-purple-500 to-violet-500',
    category: 'marketplace',
    features: ['Easy listing', 'Price suggestions', 'Quick sales'],
    image: '/images/cards/boy_sell.png',
    cta: 'Start Selling',
    imageContainerClass: 'justify-end',
    imageClass: 'w-[90%] max-h-[300px] translate-x-10 -translate-y-28',
    overflow: 'visible',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
  },
  {
    title: 'Buy in Marketplace',
    description: 'Buy items within your college community at great prices.',
    icon: <ShoppingCart className="w-10 h-10" />,
    href: '/marketplace/buy',
    color: 'from-green-500 to-emerald-500',
    category: 'marketplace',
    features: ['Student verification', 'Price comparison', 'Local pickup'],
    image: '/images/cards/girl_buy.png',
    cta: 'Browse Deals',
    imageContainerClass: 'justify-start',
    imageClass: 'w-[90%] max-h-[300px] -translate-x-10 -translate-y-28',
    overflow: 'visible',
    textAlign: 'text-right',
    ctaAlign: 'flex justify-end',
    badgeAlign: 'flex justify-end',
  },
  {
    title: 'Buy & Sell Tickets',
    description: 'Buy event tickets or sell your extra tickets to fellow students.',
    icon: <Ticket className="w-10 h-10" />,
    href: '/ticket',
    color: 'from-pink-500 to-rose-500',
    category: 'marketplace',
    features: ['Event verification', 'Secure transfers', 'Price protection'],
    image: '/images/cards/tickets.png',
    cta: 'Get Tickets',
    imageContainerClass: 'justify-center',
    imageClass: 'w-full max-h-[280px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
  },
  {
    title: 'Find Housing & Roommates',
    description: 'Discover housing options and connect with potential roommates.',
    icon: <Home className="w-10 h-10" />,
    href: '/housing',
    color: 'from-orange-500 to-red-500',
    category: 'housing',
    features: ['Location filtering', 'Roommate matching', 'Virtual tours'],
    image: '/images/cards/room.png',
    cta: 'Browse Matches',
    imageContainerClass: 'justify-center',
    imageClass: 'w-full max-h-[200px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
  },
  {
    title: 'Report Lost/Found Items',
    description: 'Report lost items or help others find their missing belongings.',
    icon: <Search className="w-10 h-10" />,
    href: '/lost-found',
    color: 'from-indigo-500 to-blue-500',
    category: 'community',
    features: ['AI matching', 'Photo recognition', 'Community help'],
    image: '/images/cards/lost_found.png',
    cta: 'Report Item',
    imageContainerClass: 'justify-center',
    imageClass: 'w-full max-h-[280px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
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
    features: ['Real-time alerts', 'Priority filtering', 'Push notifications'],
    image: '/images/cards/announcement.png',
    layout: 'billboard',
    cta: 'View Updates',
  },
  {
    title: 'Notes & Resources',
    description: 'Access notes, syllabus, PPTs, PDFs, previous year questions, and more.',
    icon: <BookOpen className="w-10 h-10" />,
    href: '/resources',
    color: 'from-teal-500 to-green-500',
    category: 'academic',
    features: ['Subject filtering', 'Quality ratings', 'Download tracking'],
    image: '/images/cards/notes (1).png',
    cta: 'Browse Notes',
    imageContainerClass: 'justify-center',
    imageClass: 'w-full max-h-[300px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
  },
  {
    title: 'Important Contacts',
    description: 'Find essential contacts and information for your locality or institution.',
    icon: <Phone className="w-10 h-10" />,
    href: '/contacts',
    color: 'from-violet-500 to-purple-500',
    category: 'communication',
    features: ['Emergency contacts', 'Department info', 'Quick dial'],
    image: '/images/cards/contacts.png',
    cta: 'View Contacts',
    imageContainerClass: 'justify-center',
    imageClass: 'w-[90%] max-h-[200px]',
    overflow: 'hidden',
    textAlign: '',
    ctaAlign: '',
    badgeAlign: '',
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
    <main id="features" className="w-full px-4 pt-8 md:pt-16 pb-16">
      {/* Brave-style Hero Section — massive bold text + watermark */}
      <div className="max-w-6xl mx-auto mb-20 relative overflow-hidden">
        {/* Giant watermark text behind — UniShare brand */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true">
          <span className={`text-[12vw] font-black leading-none tracking-tighter whitespace-nowrap ${
            darkMode ? 'text-white/[0.03]' : 'text-black/[0.03]'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            UniShare
          </span>
        </div>

        <div className="relative z-10">
          {/* Left-aligned massive heading (Section 1 = LEFT) */}
          <div className="mb-16">
            <h1 
              className={`text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            >
              Your Campus,
              <br />
              <span className="brand-wordmark relative inline-block mt-1">
                <span className="brand-uni">Conn</span><span className="brand-share">ected</span>
              </span>
            </h1>
            
            <p 
              className={`text-lg md:text-xl max-w-2xl mt-6 leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              Share rides, trade items, find housing, and access resources—
              <span className={`font-semibold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}> everything you need</span>
            </p>
          </div>

          {/* Clean Filter Chips — bordered, minimal */}
          <div className="flex flex-wrap gap-3 mb-8">
            {['All', 'Transport', 'Housing', 'Marketplace', 'Resources'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                  activeFilter === filter
                    ? darkMode 
                      ? 'bg-white text-gray-900 border-white' 
                      : 'bg-gray-900 text-white border-gray-900'
                    : darkMode
                      ? 'bg-transparent border-gray-700 text-gray-300 hover:border-gray-500 hover:text-gray-100'
                      : 'bg-transparent border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-900'
                }`}
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Subtle helper text */}
          <p className={`text-sm mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            All in one place, <span className={`font-semibold ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>designed for Students</span>
          </p>
        </div>
      </div>

      {/* Services Grid — Brave-style bordered cards with tinted bg */}
      <div className="max-w-6xl mx-auto px-4">
        {filteredSections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filteredSections.map((section, index) => {
            // Hide "View Found Items" card on large screens for perfect 3x3 grid
            const isViewFoundItems = section.title === 'View Found Items';
            if (isViewFoundItems && !isMobile) {
              return null;
            }

            // Rotating tinted backgrounds like Brave — white, blue, peach, mint (4 tints for variety)
            const tintCycle = [
              { bg: darkMode ? 'rgba(30,35,45,0.7)' : '#ffffff', border: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)' },
              { bg: darkMode ? 'rgba(28,35,52,0.7)' : '#eef4ff', border: darkMode ? 'rgba(100,150,255,0.2)' : 'rgba(0,0,0,0.18)' },
              { bg: darkMode ? 'rgba(42,32,36,0.7)' : '#fff1ee', border: darkMode ? 'rgba(255,120,100,0.18)' : 'rgba(0,0,0,0.18)' },
              { bg: darkMode ? 'rgba(30,40,38,0.7)' : '#ecfdf5', border: darkMode ? 'rgba(72,220,170,0.18)' : 'rgba(0,0,0,0.18)' },
            ];
            const tint = tintCycle[index % 4];

            // Accent color from gradient
            const getAccent = (color) => {
              const map = {
                'from-blue-500 to-cyan-500': darkMode ? '#60a5fa' : '#2563eb',
                'from-green-500 to-emerald-500': darkMode ? '#34d399' : '#059669',
                'from-purple-500 to-violet-500': darkMode ? '#a78bfa' : '#7c3aed',
                'from-pink-500 to-rose-500': darkMode ? '#f472b6' : '#db2777',
                'from-orange-500 to-red-500': darkMode ? '#fb923c' : '#ea580c',
                'from-indigo-500 to-blue-500': darkMode ? '#818cf8' : '#4f46e5',
                'from-teal-500 to-cyan-500': darkMode ? '#2dd4bf' : '#0d9488',
                'from-rose-500 to-pink-500': darkMode ? '#fb7185' : '#e11d48',
                'from-teal-500 to-green-500': darkMode ? '#34d399' : '#0d9488',
                'from-violet-500 to-purple-500': darkMode ? '#c084fc' : '#7c3aed',
              };
              return map[color] || (darkMode ? '#60a5fa' : '#2563eb');
            };
            const accent = getAccent(section.color);
            
            return (
            <Link
              key={index}
              href={section.href}
              className="block group relative h-full"
              style={{ zIndex: 1 }}
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => handleSectionClick(index)}
              aria-label={`${section.title} - ${section.description}`}
            >
              <div
                className={`relative rounded-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-[380px] ${
                  section.overflow === 'visible' ? 'overflow-visible' : 'overflow-hidden'
                }`}
                style={{
                  background: tint.bg,
                  border: darkMode 
                    ? (hoveredSection === index ? '2px solid rgba(255,255,255,0.35)' : '2px solid rgba(255,255,255,0.18)')
                    : (hoveredSection === index ? '2px solid #111' : '2px solid #222'),
                  boxShadow: hoveredSection === index
                    ? (darkMode 
                        ? '4px 6px 0 0 rgba(255,255,255,0.12), 0 20px 40px -10px rgba(0,0,0,0.5)'
                        : '4px 6px 0 0 #222, 0 20px 40px -10px rgba(0,0,0,0.15)')
                    : (darkMode
                        ? '3px 4px 0 0 rgba(255,255,255,0.08), 0 4px 12px -4px rgba(0,0,0,0.4)'
                        : '3px 4px 0 0 #222, 0 4px 12px -4px rgba(0,0,0,0.08)'),
                }}
              >
                {section.layout === 'billboard' ? (
                  /* ── BILLBOARD CARD: image background with text on the billboard sign ── */
                  <div className="relative w-full h-full">
                    {/* Full-card background image */}
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      className="object-cover object-center"
                      priority={false}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    {/* Text overlay positioned on the billboard sign area */}
                    <div
                      className="absolute flex flex-col items-center justify-center text-center px-6"
                      style={{
                        top: '5%',
                        left: '13%',
                        right: '13%',
                        bottom: '52%',
                      }}
                    >
                      {/* Category badge */}
                      <span
                        className="px-3 py-1 rounded-full text-[9px] font-black tracking-[0.12em] uppercase mb-2"
                        style={{
                          color: accent,
                          background: `${accent}15`,
                          border: `1px solid ${accent}30`,
                        }}
                      >
                        {section.category}
                      </span>

                      {/* Title */}
                      <h3
                        className="text-lg font-black tracking-tight leading-tight mb-1"
                        style={{
                          color: '#1a1a2e',
                          letterSpacing: '-0.02em',
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                        }}
                      >
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p
                        className="text-xs leading-snug max-w-[90%]"
                        style={{
                          color: '#374151',
                        }}
                      >
                        {section.description}
                      </p>

                      {/* CTA pill */}
                      <span
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white mt-2 transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]"
                        style={{ backgroundColor: accent }}
                      >
                        <span>{section.cta || 'Learn More'}</span>
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                          className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                ) : section.image ? (
                  /* ── Brave-style IMAGE CARD: text top, illustration bottom ── */
                  <>
                    <div className={`relative z-20 p-5 pb-2 ${section.textAlign || ''}`}>
                      {/* Category badge */}
                      <div className={`mb-3 ${section.badgeAlign || ''}`}>
                        <span 
                          className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.12em] uppercase border"
                          style={{
                            color: accent,
                            borderColor: `${accent}25`,
                            background: `${accent}08`,
                          }}
                        >
                          {section.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 
                        className={`text-xl font-black mb-2 tracking-tight leading-tight ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}
                        style={{
                          letterSpacing: '-0.02em',
                          fontFamily: 'system-ui, -apple-system, sans-serif'
                        }}
                      >
                        {section.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-sm leading-relaxed ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {section.description}
                      </p>

                      {/* CTA pill */}
                      <div className={`mt-3 ${section.ctaAlign || ''}`}>
                        <span 
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]"
                          style={{ backgroundColor: accent }}
                        >
                          <span>{section.cta || 'Learn More'}</span>
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" 
                            className="transition-transform duration-300 group-hover:translate-x-1">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Illustration — below text, clipped to card */}
                    <div className={`relative z-10 w-full flex-1 flex items-end px-0 pb-0 ${
                      section.imageContainerClass || 'justify-center'
                    }`}>
                      <Image
                        src={section.image}
                        alt={section.title}
                        width={400}
                        height={300}
                        className={`h-auto object-contain drop-shadow-md ${section.imageClass || 'w-[90%] max-h-[200px]'}`}
                        priority={false}
                      />
                    </div>
                  </>
                ) : (
                  /* ── Standard card (no image) ── */
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Category badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span 
                        className="px-3 py-1 rounded-full text-[10px] font-black tracking-[0.12em] uppercase border"
                        style={{
                          color: accent,
                          borderColor: `${accent}25`,
                          background: `${accent}08`,
                        }}
                      >
                        {section.category}
                      </span>
                    </div>

                    {/* Icon */}
                    <div 
                      className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3"
                      style={{
                        background: `${accent}12`,
                        color: accent,
                      }}
                    >
                      <div className="scale-75">{section.icon}</div>
                    </div>

                    {/* Title */}
                    <h3 
                      className={`text-xl font-black mb-2 tracking-tight leading-tight ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{
                        letterSpacing: '-0.02em',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                      }}
                    >
                      {section.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed mb-3 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {section.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-1.5 mb-4">
                      {section.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" 
                            style={{ backgroundColor: accent }} />
                          <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA — Brave-style colored pill button */}
                    <div className="mt-auto pt-2">
                      <span 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]"
                        style={{ backgroundColor: accent }}
                      >
                        <span>Learn More</span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" 
                          className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                )}
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

      {/* Stats Section — Brave-style with watermark, RIGHT-aligned (alternating) */}
      <div className="max-w-6xl mx-auto mt-20 hidden md:block relative px-4">
        {/* Giant watermark text — UniShare brand */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <span className="text-[12rem] font-black tracking-tight"
            style={{
              color: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.06em',
              lineHeight: 1,
            }}>
            UniShare
          </span>
        </div>

        <div className="relative z-10">
          {/* Centered massive heading */}
          <div className="mb-14 text-center">
            <h2 
              className={`text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              Community<br />
              <span style={{ color: '#f97316' }}>impact.</span>
            </h2>
            <p className={`text-lg mt-5 max-w-lg mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              See how our platform is making a real difference across campus life.
            </p>
          </div>

          {/* 4-column bordered stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5" id="stats-section">
            {[
              { label: 'Active Users', value: '400', suffix: '+', accent: '#2563eb' },
              { label: 'Rides Shared', value: '630', suffix: '+', accent: '#059669' },
              { label: 'Items Traded', value: '200', suffix: '+', accent: '#7c3aed' },
              { label: 'Satisfaction', value: '90', suffix: '%', accent: '#ea580c' },
            ].map((stat, index) => {
              const tints = [
                { bg: darkMode ? 'rgba(30,35,45,0.7)' : '#ffffff', border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                { bg: darkMode ? 'rgba(28,35,52,0.7)' : '#eef4ff', border: darkMode ? 'rgba(80,130,255,0.12)' : 'rgba(59,130,246,0.12)' },
                { bg: darkMode ? 'rgba(42,32,36,0.7)' : '#fff1ee', border: darkMode ? 'rgba(255,100,80,0.1)' : 'rgba(239,68,68,0.08)' },
                { bg: darkMode ? 'rgba(35,30,42,0.7)' : '#f5f3ff', border: darkMode ? 'rgba(139,92,246,0.1)' : 'rgba(139,92,246,0.1)' },
              ];
              const t = tints[index];

              return (
                <div
                  key={index}
                  className="group rounded-2xl border p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  style={{
                    background: t.bg,
                    borderColor: t.border,
                  }}
                >
                  {/* Value */}
                  <div 
                    className={`text-5xl font-black mb-2 transition-colors duration-300 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    style={{
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {stat.value}<span style={{ color: stat.accent }}>{stat.suffix}</span>
                  </div>

                  {/* Label */}
                  <div className={`text-sm font-bold uppercase tracking-widest ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
