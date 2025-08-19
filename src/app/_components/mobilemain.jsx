"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle, Filter, TrendingUp, Zap, Menu, X } from 'lucide-react';
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
    description: 'Sell unused items quickly.',
    icon: <Tag className="w-6 h-6" />,
    href: '/marketplace/sell',
    color: 'from-purple-500 to-violet-500',
    category: 'marketplace',
    keyFeature: 'Easy listing'
  },
  {
    title: 'Find Housing',
    description: 'Discover rooms & its mates',
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
    keyFeature: 'AI matching'
  },
  {
    title: 'Found Items',
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
    if (Math.abs(diff) > 50 && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  return (
    <main 
      className="max-w-sm mx-auto px-3 pt-4 pb-12 min-h-screen"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Header - Compact */}
      <div 
        className="text-center mb-6 transition-all duration-800"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        {/* Compact Welcome Badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4 transition-all duration-500 ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-300/20 to-blue-300/20 text-yellow-300 border border-yellow-300/30' 
              : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200'
          }`}
        >
          <Zap className="w-3 h-3" />
          <span>Campus Community</span>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            darkMode ? 'bg-green-400' : 'bg-green-500'
          }`} />
        </div>

        <p 
          className={`text-lg mb-6 px-2 leading-relaxed font-medium ${
            darkMode ? 'text-blue-200' : 'text-blue-700'
          }`}
        >
          Everything you need for campus life
        </p>
        
        {/* Compact Search Bar with Logo */}
        <div className="relative mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-20">
              <Link href="/" className="flex items-center">
                <Image
                  src={logoImage}
                  alt="UniShare"
                  width={20}
                  height={24}
                  className="transition-transform duration-200 active:scale-95"
                  priority
                />
              </Link>
            </div>
            
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-14 pr-10 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 text-sm ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-yellow-400/30 focus:border-yellow-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500'
              } shadow-sm`}
            />
            
            <button
              type="button"
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg ${
                darkMode ? 'text-gray-400 active:text-yellow-300 active:bg-gray-700' : 'text-gray-500 active:text-blue-600 active:bg-gray-100'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            showFilters
              ? darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-blue-600 text-white'
              : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-gray-100 text-gray-700 border border-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>{activeFilter}</span>
          {showFilters ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mt-3 p-3 rounded-lg bg-opacity-50 backdrop-blur-sm border">
            {['All', 'Transport', 'Housing', 'Marketplace', 'Resources'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setShowFilters(false);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter
                    ? darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-blue-600 text-white'
                    : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Services Grid - Compact Cards */}
      {filteredSections.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mb-8">
          {filteredSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block group active:scale-95 transition-transform duration-150"
            >
              <div
                className={`relative p-4 rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/60 border-gray-700/50 active:bg-gray-800/80'
                    : 'bg-white/60 border-gray-200/50 active:bg-white/80'
                } backdrop-blur-sm shadow-md active:shadow-lg`}
              >
                {/* Gradient overlay */}
                <div 
                  className={`absolute inset-0 rounded-2xl opacity-0 group-active:opacity-10 transition-opacity duration-200 bg-gradient-to-br ${section.color}`}
                />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 transition-all duration-200 group-active:scale-110 bg-gradient-to-br ${section.color} text-white shadow-md`}>
                    {section.icon}
                  </div>

                  {/* Title */}
                  <h3 className={`text-sm font-bold mb-2 leading-tight ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-xs mb-2 leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>

                  {/* Key Feature Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color}`} />
                    <span>{section.keyFeature}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-medium mb-1">No services found</h3>
          <p className="text-sm">Try a different search term</p>
        </div>
      )}

      {/* Mobile Stats Section - Compact */}
      <div className="mt-8">
        <div className="text-center mb-6">
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Community Impact
          </h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Making campus life better together
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { 
              label: 'Users', 
              value: '2,500', 
              icon: <Users className="w-5 h-5" />,
              color: 'from-blue-500 to-cyan-500',
              suffix: '+'
            },
            { 
              label: 'Rides', 
              value: '15,000', 
              icon: <Car className="w-5 h-5" />,
              color: 'from-green-500 to-emerald-500',
              suffix: '+'
            },
            { 
              label: 'Items', 
              value: '8,500', 
              icon: <ShoppingCart className="w-5 h-5" />,
              color: 'from-purple-500 to-violet-500',
              suffix: '+'
            },
            { 
              label: 'Satisfaction', 
              value: '96', 
              icon: <Star className="w-5 h-5" />,
              color: 'from-yellow-500 to-orange-500',
              suffix: '%'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center p-4 rounded-xl transition-all duration-300 active:scale-95 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50' 
                  : 'bg-white/60 border border-gray-200/50'
              } backdrop-blur-sm shadow-md`}
            >
              <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                {stat.icon}
              </div>
              
              <div className={`text-2xl font-bold mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <AnimatedCounter 
                  end={stat.value} 
                  isVisible={animatedStats} 
                  suffix={stat.suffix}
                />
              </div>
              
              <div className={`text-xs font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="h-4" />
    </main>
  );
};

export default MobileMain;