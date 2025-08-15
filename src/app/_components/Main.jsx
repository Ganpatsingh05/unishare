"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle, Filter, TrendingUp, Zap } from 'lucide-react';

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
    href: '/lost-found/report',
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

  return (
    <main className="max-w-6xl mx-auto px-4 pt-8 md:pt-16 pb-16">
      {/* Enhanced Interactive Header with Scroll Animations */}
      <div 
        className="text-center mb-16 transition-all duration-1000"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        }}
      >
        {/* Interactive Welcome Badge */}
        <div 
          className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-700 transform hover:scale-105 cursor-pointer group ${
            darkMode 
              ? 'bg-gradient-to-r from-yellow-300/20 to-blue-300/20 text-yellow-300 border border-yellow-300/40 hover:border-yellow-300/60' 
              : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 hover:border-blue-300'
          }`}
          style={{
            animationDelay: '200ms',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: 'all 0.8s ease-out 0.2s'
          }}
        >
          <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-bold">Welcome to Your Campus Community</span>
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            darkMode ? 'bg-green-400' : 'bg-green-500'
          }`} />
        </div>

        <h2 
          className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s ease-out 0.4s'
          }}
        >
          Everything You Need for{' '}
          <span className={`${darkMode ? 'text-yellow-300' : 'text-blue-600'} relative`}>
            Campus Life
            <div className={`absolute -bottom-2 left-0 w-full h-1 rounded-full ${
              darkMode ? 'bg-yellow-300/30' : 'bg-blue-600/30'
            } transition-all duration-1000 ${isVisible ? 'scale-x-100' : 'scale-x-0'}`} />
          </span>
        </h2>
        
        <p 
          className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.6s'
          }}
        >
          Discover all the amazing features and services available in your campus community. 
          From sharing rides to finding study materials, we've got everything you need to thrive.
        </p>
        
        {/* Enhanced Interactive Search Bar */}
        <div 
          className="relative max-w-lg mx-auto mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
            transition: 'all 0.8s ease-out 0.8s'
          }}
        >
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`h-5 w-5 transition-colors duration-300 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </div>
          <input
            type="text"
            placeholder="Search services, features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`block w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
              darkMode 
                ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:ring-yellow-400/20 focus:border-yellow-400 backdrop-blur-sm' 
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/20 focus:border-blue-500 backdrop-blur-sm'
            } shadow-xl hover:shadow-2xl hover:scale-102`}
          />
          {/* Right search icon button for clearer affordance */}
          <button
            type="button"
            aria-label="Search"
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:text-yellow-300 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
            }`}
            onClick={() => { /* search is live as you type; this is a visual affordance */ }}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Buttons */}
        <div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 1s'
          }}
        >
          {['All', 'Transport', 'Housing', 'Marketplace', 'Resources'].map((filter, index) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={`px-6 py-2 rounded-full font-medium transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeFilter === filter
                  ? darkMode 
                    ? 'bg-yellow-400 text-gray-900 shadow-lg' 
                    : 'bg-blue-600 text-white shadow-lg'
                  : darkMode
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                // Limit transition to opacity/transform only (no delay), so color changes on click are instant
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredSections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredSections.map((section, index) => (
            <Link
              key={index}
              href={section.href}
              className="block group relative"
              onMouseEnter={() => setHoveredSection(index)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => handleSectionClick(index)}
            >
              <div
                className={`relative h-full p-8 rounded-3xl border transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                  clickedSection === index ? 'scale-95' : ''
                } ${
                  darkMode
                    ? 'bg-gray-800/60 border-gray-700/50 hover:bg-gray-800/80 hover:border-gray-600'
                    : 'bg-white/60 border-gray-200/50 hover:bg-white/80 hover:border-gray-300'
                } backdrop-blur-md shadow-xl hover:shadow-2xl`}
                style={{
                  background: hoveredSection === index
                    ? darkMode
                      ? `linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)`
                      : `linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.95) 100%)`
                    : undefined,
                }}
              >
                {/* Gradient overlay on hover */}
                <div 
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-gradient-to-br ${section.color}`}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                    hoveredSection === index 
                      ? `bg-gradient-to-br ${section.color} text-white shadow-lg` 
                      : darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-600'
                  }`}>
                    {section.icon}
                  </div>

                  <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    hoveredSection === index 
                      ? darkMode ? 'text-yellow-300' : 'text-blue-600'
                      : darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h3>

                  <p className={`text-base mb-6 leading-relaxed transition-colors duration-300 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {section.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          hoveredSection === index 
                            ? darkMode ? 'bg-yellow-400' : 'bg-blue-500'
                            : darkMode ? 'bg-gray-600' : 'bg-gray-400'
                        }`} />
                        <span className={`text-sm transition-colors duration-300 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action button */}
                  <div className="flex items-center gap-2 text-sm font-medium transition-all duration-300 group-hover:gap-3">
                    <span className={hoveredSection === index 
                      ? darkMode ? 'text-yellow-300' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-gray-500'
                    }>
                      Explore Service
                    </span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      hoveredSection === index 
                        ? darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 text-white'
                        : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'
                    } group-hover:translate-x-1`}>
                      →
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No services found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Enhanced Animated Stats Section */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Community Impact
          </h3>
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            See how our platform is making a difference in campus life
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8" id="stats-section">
          {[
            { 
              label: 'Active Users', 
              value: '2,500', 
              icon: <Users className="w-8 h-8" />,
              color: 'from-blue-500 to-cyan-500',
              suffix: '+'
            },
            { 
              label: 'Rides Shared', 
              value: '15,000', 
              icon: <Car className="w-8 h-8" />,
              color: 'from-green-500 to-emerald-500',
              suffix: '+'
            },
            { 
              label: 'Items Traded', 
              value: '8,500', 
              icon: <ShoppingCart className="w-8 h-8" />,
              color: 'from-purple-500 to-violet-500',
              suffix: '+'
            },
            { 
              label: 'Satisfaction Rate', 
              value: '96', 
              icon: <Star className="w-8 h-8" />,
              color: 'from-yellow-500 to-orange-500',
              suffix: '%'
            }
          ].map((stat, index) => (
            <div
              key={index}
              className={`group text-center p-8 rounded-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${
                darkMode 
                  ? 'bg-gray-800/60 border border-gray-700/50 hover:bg-gray-800/80' 
                  : 'bg-white/60 border border-gray-200/50 hover:bg-white/80'
              } backdrop-blur-md shadow-xl hover:shadow-2xl cursor-pointer`}
            >
              {/* Gradient background on hover */}
              <div 
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${stat.color}`}
              />
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  {stat.icon}
                </div>
                
                <div className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                  darkMode ? 'text-white group-hover:text-yellow-300' : 'text-gray-900 group-hover:text-blue-600'
                }`}>
                  <AnimatedCounter 
                    end={stat.value} 
                    isVisible={animatedStats} 
                    suffix={stat.suffix}
                  />
                </div>
                
                <div className={`text-lg font-medium ${
                  darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-600 group-hover:text-gray-700'
                }`}>
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Main;