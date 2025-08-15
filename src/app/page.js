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
  Star,
  MapPin,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  MessageCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [visibleStats, setVisibleStats] = useState([]);
  const [logoRotation, setLogoRotation] = useState(0);
  
  const heroRef = useRef(null);
  const mainRef = useRef(null);
  const transitionRef = useRef(null);

  // Client-only particle state
  const [particles, setParticles] = useState([]);

  // Static main quote
  const mainQuote = "Where Students Connect, Share, and Thrive Together";

  // Interactive features showcase
  const features = [
    { 
      icon: Car, 
      label: "Share Rides", 
      count: "1.2K+", 
      color: "from-blue-500 to-cyan-500",
      description: "Split costs, make friends"
    },
    { 
      icon: ShoppingCart, 
      label: "Buy & Sell", 
      count: "850+", 
      color: "from-green-500 to-emerald-500",
      description: "Student marketplace"
    },
    { 
      icon: HomeIcon, 
      label: "Find Housing", 
      count: "200+", 
      color: "from-purple-500 to-violet-500",
      description: "Rooms & roommates"
    },
    { 
      icon: BookOpen, 
      label: "Study Resources", 
      count: "500+", 
      color: "from-orange-500 to-red-500",
      description: "Notes & materials"
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

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 3);
    }, 5000);

  // Initial scroll position check
  onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      clearInterval(testimonialInterval);
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
      {/* Announcement bar */}
      <div
        className={`w-full flex items-center justify-center px-4 py-2 md:py-3 border-b transition-all duration-300
          ${darkMode
            ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-yellow-300/20'
            : 'bg-gradient-to-r from-yellow-100 via-white to-yellow-50 border-yellow-400/20'}
        `}
        style={{letterSpacing: '0.01em'}}
      >
        <div className="flex items-center gap-3 max-w-5xl w-full justify-center">
          <span className={`inline-flex items-center justify-center rounded-full font-bold text-xs px-2 py-1 mr-2
            ${darkMode ? 'bg-yellow-300/20 text-yellow-300 border border-yellow-300/40' : 'bg-yellow-400/20 text-yellow-700 border border-yellow-400/40'}
          `}>
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"/></svg>
            NOTICE
          </span>
          <span className={`font-medium text-sm md:text-base tracking-wide ${darkMode ? 'text-yellow-100' : 'text-yellow-900'}`}>Welcome to <span className="font-bold">UniShare</span> — Your Campus Community Awaits!</span>
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
          {/* Dynamic Logo/Brand */}
          <div className="mb-4 md:mb-6 flex justify-center items-center gap-3 md:gap-4">
            <div className={`text-6xl font-black transition-all duration-500 transform hover:scale-110 ${
              darkMode ? 'text-yellow-300' : 'text-blue-600'
            }`}>
              Uni<span className={darkMode ? 'text-sky-300' : 'text-sky-500'}>Share</span>
            </div>
          </div>

          {/* Static Main Quote */}
          <div className="mb-6 md:mb-8 flex items-center justify-center">
            <h1
              className={`font-bold text-2xl md:text-4xl lg:text-5xl leading-tight transition-all duration-300 text-center ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {mainQuote}
            </h1>
          </div>

          <p className={`mb-8 md:mb-10 text-base md:text-xl max-w-2xl mx-auto leading-relaxed ${
            darkMode ? "text-gray-300" : "text-gray-700"
          }`}>
            Connect with your campus community through ride sharing, marketplace, housing, 
            study resources, and so much more. Your university life, simplified.
          </p>

          {/* Enhanced Interactive CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-6 md:mb-12">
            <button
              className={`group px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center gap-3 relative overflow-hidden ${
                darkMode 
                  ? "bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 hover:from-yellow-300 hover:to-yellow-200" 
                  : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600"
              }`}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05) rotateY(5deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotateY(0deg)';
              }}
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Join UniShare Today</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" />
            </button>
            
            <button
              className={`group px-8 py-4 rounded-2xl font-semibold border-2 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 relative overflow-hidden ${
                darkMode 
                  ? "border-yellow-300 text-yellow-300 hover:bg-yellow-300/10 hover:border-yellow-200" 
                  : "border-blue-600 text-blue-600 hover:bg-blue-600/10 hover:border-blue-700"
              }`}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05) rotateY(-5deg)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1) rotateY(0deg)';
              }}
            >
              <div className={`absolute inset-0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ${
                darkMode ? 'bg-yellow-300/10' : 'bg-blue-600/10'
              }`}></div>
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300 relative z-10" />
              <span className="relative z-10">Watch Demo</span>
            </button>
          </div>

          {/* Quick Stats (mobile only) */}
          <div className="grid grid-cols-2 gap-3 md:hidden max-w-md mx-auto mt-4">
            {[
              { label: 'Rides', count: '1.2k+' },
              { label: 'Listings', count: '850+' },
              { label: 'Rooms', count: '200+' },
              { label: 'Resources', count: '500+' },
            ].map((s, i) => (
              <div key={i} className={`${darkMode ? 'bg-gray-800/70 text-gray-200 border-gray-700' : 'bg-white/80 text-gray-800 border-gray-200'} border rounded-xl py-3 px-4 flex items-center justify-between backdrop-blur-sm`}> 
                <span className="text-xs opacity-80">{s.label}</span>
                <span className={`${darkMode ? 'text-yellow-300' : 'text-blue-600'} font-semibold`}>{s.count}</span>
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
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How UniShare Works
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Getting started is simple. Join thousands of students already using UniShare to enhance their campus experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Sign up with your university email and customize your profile with your interests and needs.",
                icon: User,
                color: "from-blue-500 to-cyan-500"
              },
              {
                step: "02", 
                title: "Explore & Connect",
                description: "Browse available rides, items, housing, and resources. Connect with fellow students in your area.",
                icon: Search,
                color: "from-purple-500 to-pink-500"
              },
              {
                step: "03",
                title: "Share & Succeed",
                description: "Start sharing rides, trading items, and accessing resources. Build your campus community.",
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

      {/* Interactive Testimonials Section */}
      <section className={`py-20 transition-all duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What Students Are Saying
            </h2>
            <p className={`text-xl max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Real stories from students who've transformed their campus experience with UniShare.
            </p>
          </div>

          {/* Interactive Testimonial Carousel */}
          <div className="relative h-80 mb-8 max-w-4xl mx-auto">
            {[
              {
                name: "Sarah Chen",
                university: "Stanford University",
                story: "Found my perfect study group and saved $200 on textbooks in my first month. UniShare connected me with people I never would have met otherwise!",
                avatar: "👩‍🎓",
                metric: "Saved $200",
                role: "Computer Science Senior"
              },
              {
                name: "Marcus Rodriguez", 
                university: "UCLA",
                story: "Sharing rides to campus has cut my transportation costs by 70%. Plus, I've made some great friends along the way!",
                avatar: "👨‍🎓",
                metric: "70% savings",
                role: "Business Junior"
              },
              {
                name: "Emily Johnson",
                university: "MIT",
                story: "Lost my laptop charger and found a replacement within 2 hours through UniShare's lost & found. The community is incredibly helpful!",
                avatar: "👩‍💻",
                metric: "Found in 2hrs",
                role: "Engineering Sophomore"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  index === activeTestimonial
                    ? 'opacity-100 scale-100 translate-x-0'
                    : index < activeTestimonial
                    ? 'opacity-0 scale-95 -translate-x-full'
                    : 'opacity-0 scale-95 translate-x-full'
                }`}
              >
                <div className={`p-12 rounded-3xl border h-full flex flex-col justify-center transition-all duration-500 ${
                  darkMode 
                    ? 'bg-gray-900/80 border-gray-700 backdrop-blur-sm' 
                    : 'bg-gray-50/80 border-gray-200 backdrop-blur-sm'
                }`}>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-6xl">{testimonial.avatar}</div>
                    <div>
                      <h3 className={`font-bold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {testimonial.name}
                      </h3>
                      <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {testimonial.role}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {testimonial.university}
                      </p>
                    </div>
                  </div>
                  
                  <p className={`text-xl leading-relaxed mb-8 italic text-center ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    "{testimonial.story}"
                  </p>
                  
                  <div className="flex justify-center">
                    <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-medium ${
                      darkMode 
                        ? 'bg-yellow-300/20 text-yellow-300' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Star className="w-5 h-5" />
                      {testimonial.metric}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Testimonial Navigation */}
          <div className="flex justify-center items-center space-x-6">
            <button
              onClick={() => setActiveTestimonial(prev => prev === 0 ? 2 : prev - 1)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex space-x-3">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activeTestimonial
                      ? darkMode ? 'bg-yellow-400 scale-125' : 'bg-blue-500 scale-125'
                      : darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={() => setActiveTestimonial(prev => prev === 2 ? 0 : prev + 1)}
              className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
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
            Trusted by Universities Nationwide
          </h2>
          <p className={`text-xl mb-12 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            UniShare partners with leading universities to create safer, more connected campus communities.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {[
              { name: "Stanford", students: "2.1K" },
              { name: "MIT", students: "1.8K" },
              { name: "Harvard", students: "2.3K" },
              { name: "UCLA", students: "1.9K" }
            ].map((university, index) => (
              <div key={index} className={`p-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
              }`}>
                <div className={`text-3xl font-bold mb-2 ${
                  darkMode ? 'text-yellow-300' : 'text-blue-600'
                }`}>
                  {university.students}
                </div>
                <div className={`font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {university.name} Students
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
            Growing by 500+ students every week
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
            Ready to Transform Your Campus Experience?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of students who are already connecting, sharing, and thriving with UniShare. Your campus community is waiting.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white text-blue-700 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              Get Started Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="px-8 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-700">
              Learn More
            </button>
          </div>

          <div className="mt-12 flex justify-center items-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-green-900 text-xs">✓</span>
              </div>
              <span>100% Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-green-900 text-xs">✓</span>
              </div>
              <span>University Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-green-900 text-xs">✓</span>
              </div>
              <span>Safe & Secure</span>
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