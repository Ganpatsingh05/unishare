"use client";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Car,
  ShoppingCart,
  Home as HomeIcon,
  BookOpen,
  Search,
  Heart,
  MapPin,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Header from "./_components/Header";
import Main from "./_components/Main";
import Footer from "./_components/Footer";

/**
 * Page component with interactive hero section and enhanced scroll effects
 */
export default function Page() {
  // Set default theme to dark
  const [darkMode, setDarkMode] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [visibleStats, setVisibleStats] = useState([]);
  const [logoRotation, setLogoRotation] = useState(0);
  
  const heroRef = useRef(null);
  const mainRef = useRef(null);
  const transitionRef = useRef(null);

  // Client-only particle state
  const [particles, setParticles] = useState([]);

  // Static main quote
  const mainQuote = "Where Students Connect, Share, and Thrive Together";

  // More realistic, human-centered features
  const features = [
    { 
      icon: Car, 
      label: "Catch a Ride", 
      count: "2.1k", 
      color: "from-blue-500 to-cyan-500",
      description: "Never walk alone again"
    },
    { 
      icon: ShoppingCart, 
      label: "Buy & Sell Stuff", 
      count: "847", 
      color: "from-green-500 to-emerald-500",
      description: "From textbooks to furniture"
    },
    { 
      icon: HomeIcon, 
      label: "Find a Place", 
      count: "203", 
      color: "from-purple-500 to-violet-500",
      description: "Rooms that don't suck"
    },
    { 
      icon: BookOpen, 
      label: "Share Notes", 
      count: "512", 
      color: "from-orange-500 to-red-500",
      description: "Study smarter, not harder"
    },
  ];

  useEffect(() => {
    // Smooth, throttled scroll/mouse handlers using requestAnimationFrame
    const ticking = { scroll: false, mouse: false };

    const onScroll = () => {
      if (!ticking.scroll) {
        ticking.scroll = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;

          // Parallax offset
          const newOffset = scrollY * 0.3;
          setOffset((prev) => (Math.abs(prev - newOffset) < 0.5 ? prev : newOffset));

          // Calculate scroll progress for hero section
          const heroHeight = heroRef.current?.offsetHeight || windowHeight;
          const progress = Math.min(scrollY / (heroHeight * 0.8), 1);
          setScrollProgress((prev) => (Math.abs(prev - progress) < 0.005 ? prev : progress));

          // Check if main section is visible
          if (mainRef.current) {
            const mainRect = mainRef.current.getBoundingClientRect();
            const isVisible = mainRect.top < windowHeight * 0.8;
            setIsMainVisible((prev) => (prev === isVisible ? prev : isVisible));
          }

          // Animate stats when they come into view
          const statsSection = document.getElementById('stats-section');
          if (statsSection && visibleStats.length === 0) {
            const statsRect = statsSection.getBoundingClientRect();
            if (statsRect.top < windowHeight * 0.8) {
              setVisibleStats([0, 1, 2, 3]);
            }
          }

          ticking.scroll = false;
        });
      }
    };

    const onMouseMove = (e) => {
      if (!ticking.mouse) {
        ticking.mouse = true;
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            setMousePosition({
              x: ((e.clientX - rect.left) / rect.width - 0.5) * 100,
              y: ((e.clientY - rect.top) / rect.height - 0.5) * 100,
            });
          }
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const deltaX = e.clientX - centerX;
          const deltaY = e.clientY - centerY;
          const rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI) * 0.1;
          setLogoRotation((prev) => (Math.abs(prev - rotation) < 0.1 ? prev : rotation));
          ticking.mouse = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Generate enhanced particles
    const p = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      opacity: `${Math.random() * 0.3 + 0.1}`,
      delay: `${Math.random() * 5}s`,
    }));
    setParticles(p);

  // Initial scroll position check
  onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [visibleStats.length]);

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  const scrollToMain = () => {
    mainRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800"
      }`}
    >
      {/* Organic announcement bar - more human, less corporate */}
      <div
        className={`w-full flex items-center justify-center px-4 py-3 border-b transition-all duration-300
          ${darkMode
            ? 'bg-gray-900/80 border-gray-700/50'
            : 'bg-orange-50/90 border-orange-200/60'}
        `}
      >
        <div className="flex items-center gap-2 max-w-5xl w-full justify-center text-center">
          <span className="text-lg">🎉</span>
          <span className={`font-medium text-sm tracking-wide ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Hey there! Welcome to <span className="font-semibold text-orange-600">UniShare</span> — where campus life gets a whole lot easier
          </span>
          <span className="text-lg">✨</span>
        </div>
      </div>

            <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />

      {/* INTERACTIVE HERO SECTION */}
  <section
    ref={heroRef}
    className="relative h-[85vh] md:h-screen flex flex-col justify-start md:justify-center items-center overflow-hidden cursor-default pt-5 md:pt-28"
        style={{
          background: darkMode
            ? `radial-gradient(circle at ${50 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.1}%, #1e293b 0%, #0f172a 100%)`
            : `radial-gradient(circle at ${50 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.1}%, #e0f2fe 0%, #f0f9ff 100%)`,
          transform: `translateY(${offset}px)`,
        }}
      >


        {/* Static Background Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute rounded-full transition-opacity duration-1000 ${
                darkMode ? 'bg-yellow-300/20' : 'bg-blue-500/20'
              }`}
              style={{
                top: particle.top,
                left: particle.left,
                width: particle.size,
                height: particle.size,
                opacity: Math.max(0.1, particle.opacity * (1 - scrollProgress)),
              }}
            />
          ))}
        </div>

        {/* Main Content with Enhanced Scroll Effects (mobile-first) */}
        <div 
          className="relative z-10 text-center px-4 sm:px-6 max-w-5xl -mt-2 md:mt-0"
          style={{
            opacity: 1 - scrollProgress * 0.7,
            transform: `translateY(${scrollProgress * -30}px) scale(${1 - scrollProgress * 0.06})`,
            willChange: 'transform, opacity'
          }}
        >
          {/* More natural, conversational headline */}
          <div className="mb-4 md:mb-6 flex justify-center items-center gap-3 md:gap-4">
            <div className={`text-5xl md:text-6xl font-black transition-all duration-500 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Uni<span className={darkMode ? 'text-orange-400' : 'text-orange-500'}>Share</span>
            </div>
          </div>

          {/* More human, relatable tagline */}
          <div className="mb-6 md:mb-8 flex items-center justify-center">
            <h1
              className={`font-bold text-2xl md:text-4xl lg:text-5xl leading-tight transition-all duration-300 text-center ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Your campus life, but <span className="italic">way</span> better
            </h1>
          </div>

          <p className={`mb-8 md:mb-10 text-base md:text-xl max-w-2xl mx-auto leading-relaxed ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Tired of walking everywhere? Need textbooks but broke? Looking for that perfect study buddy? 
            We've got you covered. This is where students actually help each other out.
          </p>

          {/* More casual, approachable CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-12">
            <button
              className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 relative overflow-hidden ${
                darkMode 
                  ? "bg-orange-500 hover:bg-orange-400 text-white" 
                  : "bg-orange-500 hover:bg-orange-600 text-white"
              }`}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
              }}
            >
              <span className="relative z-10">Yeah, let's do this!</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>
            
            <button
              className={`group px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 ${
                darkMode 
                  ? "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500" 
                  : "border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500"
              }`}
            >
              <span className="relative z-10">Show me how it works</span>
            </button>
          </div>

          {/* More realistic mobile stats */}
          <div className="grid grid-cols-2 gap-3 md:hidden max-w-md mx-auto mt-4">
            {[
              { label: 'Rides shared', count: '2.1k' },
              { label: 'Items sold', count: '847' },
              { label: 'Rooms found', count: '203' },
              { label: 'Notes shared', count: '512' },
            ].map((s, i) => (
              <div key={i} className={`${darkMode ? 'bg-gray-800/70 text-gray-200 border-gray-700' : 'bg-white/80 text-gray-800 border-gray-200'} border rounded-xl py-3 px-4 flex items-center justify-between backdrop-blur-sm`}> 
                <span className="text-xs opacity-80">{s.label}</span>
                <span className={`${darkMode ? 'text-orange-400' : 'text-orange-600'} font-semibold`}>{s.count}</span>
              </div>
            ))}
          </div>

          {/* Static Feature Showcase (desktop/tablet only) */}
          <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, idx) => {
              const IconComponent = feature.icon;
              const isHovered = idx === hoveredFeature;
              return (
                <div
                  key={idx}
                  className={`group relative p-6 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                    isHovered 
                      ? (darkMode ? "bg-gray-800/80 border-yellow-300/50 shadow-2xl" : "bg-white/80 border-blue-500/50 shadow-2xl")
                      : (darkMode ? "bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60" : "bg-white/40 border-gray-200/50 hover:bg-white/60")
                  }`}
                  onMouseEnter={() => setHoveredFeature(idx)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Gradient Background */}
                  <div 
                    className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${feature.color}`}
                  />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`mb-3 p-3 rounded-full transition-all duration-300 ${
                      isHovered 
                        ? `bg-gradient-to-br ${feature.color} text-white shadow-lg` 
                        : (darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-blue-600')
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    
                    <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${
                      isHovered 
                        ? (darkMode ? 'text-yellow-300' : 'text-blue-600')
                        : (darkMode ? 'text-gray-300' : 'text-gray-700')
                    }`}>
                      {feature.count}
                    </div>
                    
                    <div className={`text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {feature.label}
                    </div>
                    
                    <div className={`text-xs opacity-75 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced interactive scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 cursor-pointer group animate-bounce-slow transition-all duration-500 ease-in-out"
          onClick={scrollToMain}
          style={{
            opacity: 1 - scrollProgress,
          }}
        >
          <div className={`p-4 rounded-full border-2 transition-all duration-300 group-hover:scale-110 group-active:scale-95 ${
            darkMode 
              ? 'border-yellow-300/50 text-yellow-300 group-hover:border-yellow-300 group-hover:bg-yellow-300/10' 
              : 'border-blue-500/50 text-blue-500 group-hover:border-blue-500 group-hover:bg-blue-500/10'
          }`}>
            <ChevronDown className="w-6 h-6" />
          </div>
        </div>
      </section>

      {/* ENHANCED MAIN SECTION */}
  <div ref={mainRef} className="-mt-2 md:mt-0">
        <Main darkMode={darkMode} isVisible={isMainVisible} scrollProgress={scrollProgress} />
      </div>

      {/* Additional Content Sections */}
      
      {/* How It Works Section */}
      <section className={`py-20 transition-all duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          {/* More conversational "How It Works" */}
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How does this actually work?
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Don't worry, it's super simple. Literally takes like 2 minutes to get started, and then you're in.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up (Obviously)",
                description: "Use your university email to join. We'll verify you're actually a student and not some weird bot.",
                icon: User,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "Browse & Connect",
                description: "Check out what's available around campus. Found something interesting? Hit up the person who posted it.",
                icon: Search,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Start Sharing",
                description: "Post your own stuff, offer rides, find study buddies. The more you share, the more you save.",
                icon: Heart,
                color: "from-green-500 to-emerald-500"
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                  <div className={`relative p-8 rounded-2xl border transition-all duration-300 group-hover:transform group-hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800/80 border-gray-700 hover:border-gray-600' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white text-2xl font-bold mb-6`}>
                      {step.step}
                    </div>
                    <div className="mb-4">
                      <IconComponent className={`w-8 h-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {step.title}
                    </h3>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Campus Partners Section */}
      <section className={`py-20 transition-all duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Yeah, we're at a bunch of schools
          </h2>
          <p className={`text-xl mb-12 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Started small, but turns out students everywhere wanted this. Now we're helping out at universities across the country.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { name: "Stanford", students: "2.1k" },
              { name: "MIT", students: "1.8k" },
              { name: "Harvard", students: "2.3k" },
              { name: "UCLA", students: "1.9k" }
            ].map((university, index) => (
              <div key={index} className={`p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  darkMode ? 'text-orange-400' : 'text-orange-600'
                }`}>
                  {university.students}
                </div>
                <div className={`font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {university.name} students
                </div>
              </div>
            ))}
          </div>

          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
            darkMode 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-green-100 text-green-700 border border-green-200'
          }`}>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            About 500+ new students join every week (not bad, right?)
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`py-20 transition-all duration-300 ${
        darkMode 
          ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800'
      }`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to make college less stressful?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Thousands of students are already using UniShare to save money, make friends, and actually enjoy their campus life. Your turn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3">
              <span>Let's get started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-700">
              Tell me more first
            </button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-6 text-blue-200">
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>Totally free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>University verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400 text-lg">✓</span>
              <span>Actually safe</span>
            </div>
          </div>
        </div>
      </section>

      <Footer darkMode={darkMode} />
      
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(18px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translate(-50%, 0); }
          40%, 43% { transform: translate(-50%, -10px); }
          70% { transform: translate(-50%, -5px); }
          90% { transform: translate(-50%, -2px); }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}