"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useRef, memo, useMemo, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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
  Megaphone,
  X,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Main from "./_components/layout/Main";
import HeroSlider from "./_components/ui/HeroSlider";
import { useUI } from "./lib/contexts/UniShareContext";

// Dynamic imports for heavy visual components - improves initial load
const GalaxyDesktop = dynamic(() => import("./_components/ui/GalaxyDesktop"), { 
  ssr: false, 
  loading: () => null 
});
const Footer = dynamic(() => import("./_components/layout/Footer"), { 
  ssr: false, 
  loading: () => null 
});
const FloatingActionButton = dynamic(() => import("./_components/ui/FloatingActionButton"), { 
  ssr: false, 
  loading: () => null 
});

// Enhanced How It Works steps - moved outside to prevent recreation
const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Sign Up (Obviously)",
    shortTitle: "Sign Up",
    description: "Use your university email to join. We'll verify you're actually a student and not some weird bot.",
    mobileDescription: "Quick uni email verification - takes 30 seconds max",
    icon: User,
    color: "from-blue-500 to-cyan-500",
    features: ["University email required", "Instant verification", "Student-only access"]
  },
  {
    step: "02", 
    title: "Browse & Connect",
    shortTitle: "Browse",
    description: "Check out what's available around campus. Found something interesting? Hit up the person who posted it.",
    mobileDescription: "Swipe through campus listings and connect instantly",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    features: ["Real-time listings", "Campus-wide search", "Direct messaging"]
  },
  {
    step: "03",
    title: "Start Sharing",
    shortTitle: "Share",
    description: "Post your own stuff, offer rides, find study buddies. The more you share, the more you save.",
    mobileDescription: "Post anything - rides, stuff, rooms. Build your campus network",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    features: ["Easy posting", "Build reputation", "Save money together"]
  }
];

// Memoized StepCard component - extracted to prevent recreation on every render
const StepCard = memo(function StepCard({ step, index, isActive, isMobile, darkMode, onStepClick, stepsLength }) {
  const IconComponent = step.icon;
  const isCompleted = isActive && isMobile;
  
  // ✅ PERFORMANCE: Adaptive blur for mobile
  const adaptiveBlur = useMemo(() => {
    if (isMobile) return 'blur(12px)';
    return 'blur(30px)';
  }, [isMobile]);
  
  // Memoize computed styles to prevent object recreation
  const mobileGlassStyle = useMemo(() => ({
    background: isActive 
      ? `linear-gradient(135deg, ${step.color.replace('from-', '').replace(' to-', ', ').replace('-500', '').replace('-400', '')})` 
      : darkMode 
        ? `linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%)`
        : `linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.2) 100%)`,
    backdropFilter: adaptiveBlur,
    boxShadow: isMobile 
      ? `0 15px 30px -10px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.2)`
      : `0 25px 50px -15px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 2px 0 rgba(255, 255, 255, 0.1), inset 0 -2px 0 rgba(0, 0, 0, 0.05)`
  }), [isActive, darkMode, step.color, adaptiveBlur, isMobile]);

  const desktopGlassStyle = useMemo(() => ({
    background: darkMode 
      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`
      : `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.12) 100%)`,
    border: darkMode 
      ? '2px solid rgba(255, 255, 255, 0.12)'
      : '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: adaptiveBlur,
    boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.12), inset 0 2px 0 rgba(255, 255, 255, 0.15), 0 2px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 0 rgba(0, 0, 0, 0.05)`
  }), [darkMode, adaptiveBlur]);

  return (
    <div 
      data-step={index}
      className="relative group opacity-100 translate-y-0"
      onClick={() => isMobile && onStepClick(index)}
    >
      {/* Mobile: Ultra-Premium Bold Glass Card */}
      {isMobile ? (
        <div className="relative">
          {/* Main Bold Glass Container */}
          <div className={`relative overflow-hidden rounded-[32px] backdrop-blur-3xl border-2 ${
            isActive 
              ? `border-white/50` 
              : darkMode 
                ? 'border-white/15' 
                : 'border-white/25'
          }`}
          style={mobileGlassStyle}>
            
            {/* Bold Glass Top Highlight */}
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            <div className="absolute top-1 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Glass Side Highlights */}
            <div className="absolute top-8 bottom-8 left-0 w-0.5 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            <div className="absolute top-8 bottom-8 right-0 w-0.5 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            
            <div className="relative p-8 z-10">
              <div className="flex items-start gap-6">
                {/* Bold Floating Step Indicator */}
                <div className="relative">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center text-xl font-light ${
                    isActive 
                      ? 'bg-white/95 text-gray-900 scale-110' 
                      : `bg-gradient-to-br ${step.color} text-white scale-100 hover:scale-105`
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                    boxShadow: isMobile 
                      ? `0 10px 25px rgba(0, 0, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4)`
                      : `0 15px 35px rgba(0, 0, 0, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)`,
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                  }}>
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      step.step
                    )}
                    
                    {/* Bold Glass Shine */}
                    <div className="absolute inset-0 rounded-3xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)`
                      }} />
                  </div>
                  
                  {/* Larger Floating Particles */}
                  <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white/40 backdrop-blur-sm border-2 border-white/50" />
                </div>

                <div className="flex-1">
                  <h3 className={`text-2xl font-medium mb-4 transition-colors duration-1000 ${
                    isActive 
                      ? 'text-white' 
                      : darkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    {step.shortTitle}
                  </h3>
                  <p className={`text-base leading-relaxed transition-colors duration-1000 opacity-85 ${
                    isActive 
                      ? 'text-white/90' 
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-700'
                  }`}
                  style={{
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                  }}>
                    {step.mobileDescription}
                  </p>
                </div>

                <ChevronRight className={`w-7 h-7 ${
                  isActive 
                    ? 'text-white transform rotate-90' 
                    : darkMode 
                      ? 'text-gray-400 group-hover:text-gray-300' 
                      : 'text-gray-500 group-hover:text-gray-700'
                }`} />
              </div>

              {/* Enhanced Expanded Content with Bold Glass */}
              <div className={`overflow-hidden transition-all duration-500 ${
                isActive ? 'max-h-48 opacity-100 mt-8' : 'max-h-0 opacity-0'
              }`}>
                <div className="expanded-glass rounded-3xl p-6 border-2 border-white/30">
                  <div className="space-y-4">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-white/90 rounded-full feature-dot-glow" />
                        <span className="text-white/95 text-base font-medium"
                          style={{ fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif' }}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bold Progress Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 rounded-b-[32px] overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r from-white/90 to-white/70 ${
                  isActive ? 'w-full' : 'w-0'
                }`}
                style={{
                  boxShadow: isActive ? '0 0 25px rgba(255,255,255,0.6)' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Desktop: Ultra-Premium Bold Glass Design */
        <div className="relative group h-full">
          {/* Main Bold Glass Container */}
          <div 
            className="relative h-full p-10 rounded-[24px] border-2 backdrop-blur-3xl"
            style={desktopGlassStyle}>
            
            {/* Bold Glass Top Highlight */}
            <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <div className="absolute top-1 left-10 right-10 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            
            {/* Glass Side Highlights */}
            <div className="absolute top-6 bottom-6 left-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            <div className="absolute top-6 bottom-6 right-0 w-0.5 bg-gradient-to-b from-transparent via-white/30 to-transparent" />
            
            <div className="relative z-10">
              {/* Bold Floating Step Number */}
              <div className="relative inline-block mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} text-white text-xl font-light`}
                  style={{
                    backdropFilter: 'blur(20px)',
                    boxShadow: `
                      0 12px 35px rgba(0, 0, 0, 0.2),
                      inset 0 2px 0 rgba(255, 255, 255, 0.4),
                      inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                    `,
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif'
                  }}>
                  {step.step}
                  
                  {/* Bold Glass Shine */}
                  <div className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)`
                    }} />
                </div>
                
                {/* Larger Floating Particle */}
                <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/40" />
              </div>
              
              {/* Icon */}
              <div className="mb-6">
                <IconComponent className={`w-7 h-7 transition-colors duration-1000 ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`} />
              </div>
              
              <h3 className={`text-2xl font-medium mb-4 transition-colors duration-1000 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                letterSpacing: '-0.02em',
                textShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                {step.title}
              </h3>
              
              <p className={`text-base leading-relaxed transition-colors duration-1000 opacity-75 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}
              style={{
                fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
              }}>
                {step.description}
              </p>

              {/* Feature List with Bold Glass Effect */}
              <div className="mt-6 space-y-3"
                style={{ opacity: 1, transform: 'translateY(0)' }}>
                {step.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`}
                      style={{
                        boxShadow: '0 0 8px rgba(255,255,255,0.4)'
                      }} />
                    <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}
                      style={{ fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif' }}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced connection line for mobile with glow */}
      {isMobile && index < stepsLength - 1 && (
        <div className="flex justify-center py-4">
          <div className={`w-1 h-10 rounded-full transition-all duration-700 bg-gradient-to-b ${step.color} shadow-lg`} />
        </div>
      )}
    </div>
  );
});

/**
 * Page component with interactive hero section and enhanced scroll effects
 */
export default function Page() {
  // Use theme from context instead of local state
  const { darkMode } = useUI();
  
  // ✅ PERFORMANCE: Batched scroll state for fewer re-renders
  const [scrollState, setScrollState] = useState({
    offset: 0,
    progress: 0,
    isMainVisible: false,
    visibleStats: []
  });
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Interactive How It Works states
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([0, 1, 2]); // Show all steps immediately
  const [isMobile, setIsMobile] = useState(false);
  const [howItWorksVisible, setHowItWorksVisible] = useState(false);
  
  const heroRef = useRef(null);
  const mainRef = useRef(null);
  const transitionRef = useRef(null);
  const howItWorksRef = useRef(null);
  
  // Scroll cache for batched updates - moved to top level
  const scrollCache = useRef({
    offset: 0,
    progress: 0,
    mainVisible: false,
    statsVisible: false
  });

  // Static main quote
  const mainQuote = "Where Students Connect, Share, and Thrive Together";

  // ✅ PERFORMANCE: Detect low-performance devices for reduced effects
  const isLowPerf = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const deviceMem = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 4;
    return isMobile || deviceMem <= 4 || cores <= 2;
  }, [isMobile]);
  
  // ✅ PERFORMANCE: Adaptive blur based on device capability
  const adaptiveBlur = useMemo(() => {
    if (isMobile) return 'blur(8px)';
    if (isLowPerf) return 'blur(12px)';
    return 'blur(24px)';
  }, [isMobile, isLowPerf]);

  // Stable callback to prevent StepCard re-renders
  const handleStepClick = useCallback((index) => {
    setActiveStep(prev => (prev === index ? -1 : index));
  }, []);

  useEffect(() => {
    // ✅ PERFORMANCE: Apply performance tier class to body for CSS optimizations
    const tier = isLowPerf ? 'performance-low' : isMobile ? 'performance-medium' : 'performance-high';
    document.body.classList.add(tier);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Optimized scroll handler with batched updates
    const ticking = { scroll: false };

    const onScroll = () => {
      if (!ticking.scroll) {
        ticking.scroll = true;
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const cache = scrollCache.current;
          
          // Batch compute all values
          const newOffset = scrollY * 0.3;
          const heroHeight = heroRef.current?.offsetHeight || windowHeight;
          const newProgress = Math.min(scrollY / (heroHeight * 0.8), 1);
          
          let needsUpdate = false;
          
          // Only update if meaningfully changed
          if (Math.abs(cache.offset - newOffset) > 0.5) {
            cache.offset = newOffset;
            needsUpdate = true;
          }
          
          if (Math.abs(cache.progress - newProgress) > 0.005) {
            cache.progress = newProgress;
            needsUpdate = true;
          }
          
          // Check main visibility
          if (mainRef.current) {
            const mainRect = mainRef.current.getBoundingClientRect();
            const isVisible = mainRect.top < windowHeight * 0.8;
            if (cache.mainVisible !== isVisible) {
              cache.mainVisible = isVisible;
              needsUpdate = true;
            }
          }
          
          // Check stats visibility
          if (!cache.statsVisible) {
            const statsSection = document.getElementById('stats-section');
            if (statsSection) {
              const statsRect = statsSection.getBoundingClientRect();
              if (statsRect.top < windowHeight * 0.8) {
                cache.statsVisible = true;
                needsUpdate = true;
              }
            }
          }
          
          // ✅ PERFORMANCE: Batch commit all state updates into single call
          if (needsUpdate) {
            setScrollState(prev => ({
              offset: cache.offset,
              progress: cache.progress,
              isMainVisible: cache.mainVisible,
              visibleStats: cache.statsVisible && prev.visibleStats.length === 0 ? [0, 1, 2, 3] : prev.visibleStats
            }));
          }

          ticking.scroll = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // ✅ PERFORMANCE: Lazy load How It Works section when it comes into view
    if (typeof IntersectionObserver !== 'undefined' && howItWorksRef.current) {
      const howItWorksObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !howItWorksVisible) {
              setHowItWorksVisible(true);
              howItWorksObserver.disconnect(); // Stop observing once loaded
            }
          });
        },
        { rootMargin: '100px' } // Load 100px before it comes into view
      );
      
      howItWorksObserver.observe(howItWorksRef.current);
    }

    // Pause animations when off-screen to reduce GPU load
    if (typeof IntersectionObserver !== 'undefined') {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.target) {
            e.target.classList.toggle('paused-anim', !e.isIntersecting);
          }
        });
      }, { threshold: 0.05 });

      document.querySelectorAll('.animatable').forEach(el => obs.observe(el));
      
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener('resize', checkMobile);
        obs.disconnect();
        // Clean up performance class
        document.body.classList.remove('performance-low', 'performance-medium', 'performance-high');
      };
    }

    // Initial scroll position check
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener('resize', checkMobile);
      // Clean up performance class
      document.body.classList.remove('performance-low', 'performance-medium', 'performance-high');
    };
  }, [scrollState.visibleStats.length, visibleSteps, isLowPerf, isMobile]);

  const scrollToMain = () => {
    mainRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // ✅ PERFORMANCE: Memoize CTA container style with adaptive blur
  const ctaContainerStyle = useMemo(() => ({
    background: darkMode 
      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)`
      : `linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.15) 100%)`,
    backdropFilter: adaptiveBlur,
    border: darkMode 
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '32px',
    padding: '3rem',
    boxShadow: isLowPerf 
      ? '0 10px 25px rgba(0, 0, 0, 0.1)'
      : `0 25px 50px -15px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 1px 0 rgba(255, 255, 255, 0.05)`
  }), [darkMode, adaptiveBlur]);

  return (
      <div 
        className="relative min-h-screen" 
        style={{ 
          backgroundColor: darkMode ? '#0a0a0a' : '#f0f9ff' 
        }}
      >
        {/* ✅ PERFORMANCE: Only render heavy 3D background on desktop */}
        {!isMobile && <GalaxyDesktop/>}
        
      <div
        className="relative z-10 mb-0 md:mb-5"
      >
      {/* SLIDER SECTION (replacing previous hero) */}
      <div ref={heroRef} className="mt-8 md:mt-8">
        <HeroSlider darkMode={darkMode} />
      </div>

      {/* ENHANCED MAIN SECTION */}
      <div ref={mainRef} className="mt-0">
        <Main darkMode={darkMode} isVisible={scrollState.isMainVisible} scrollProgress={scrollState.progress} />
      </div>

      {/* Interactive How It Works Section - Conditionally rendered for desktop only */}
      {!isMobile && (
      <section ref={howItWorksRef} className="py-12 md:py-16 transition-all duration-300 relative overflow-hidden animatable">
        {/* Clean background without colors */}
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Enhanced Header with premium glassmorphism - Community Impact Style */}
          <div className="text-center mb-12 md:mb-14">
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
                How does 
                <br />
                <span className="brand-wordmark relative inline-block mt-2 whitespace-nowrap"
                  style={{
                    fontWeight: 900,
                    letterSpacing: '-0.05em'
                  }}>
                  <span className="brand-uni">it</span><span className="brand-share"> work?</span>
                </span>
              </h1>
            </div>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mt-8 font-medium ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {isMobile 
                ? "Tap each step below to see how easy it is"
                : "Don't worry, it's super simple. Literally takes like 2 minutes to get started, and then you're in."
              }
            </p>
          </div>

          {/* Enhanced Steps Grid - Only render when visible */}
          {howItWorksVisible && (
          <div className="grid grid-cols-3 gap-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isActive={activeStep === index}
                isMobile={false}
                darkMode={darkMode}
                onStepClick={handleStepClick}
                stepsLength={HOW_IT_WORKS_STEPS.length}
              />
            ))}
          </div>
          )}
        </div>
      </section>
      )}

      {/* Ultra-Premium Glass Morphism Call to Action */}
      <section className="py-16 md:py-20 transition-all duration-300 hidden md:block relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/3 to-blue-500/5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-orange-300/10 to-purple-300/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          {/* Floating Glass Container */}
          <div className="relative group">
            <div 
              className="relative"
              style={ctaContainerStyle}>
              
              {/* Glass Top Highlight */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              
              {/* Floating Particles */}
              <div className="absolute top-8 right-8 w-3 h-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
              <div className="absolute top-1/3 left-8 w-2 h-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25" />
              <div className="absolute bottom-12 right-16 w-1.5 h-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20" />
              
              <div className="relative z-10">
                {/* Premium Typography */}
                <h2 className={`text-4xl md:text-5xl font-light mb-8 bg-gradient-to-r from-orange-400 via-purple-500 to-blue-400 bg-clip-text text-transparent`}
                  style={{
                    fontFamily: 'SF Pro Display, -apple-system, system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.1'
                  }}>
                  Ready to make college life more stressful?
                </h2>
                
                <p className={`text-lg md:text-xl mb-10 max-w-3xl mx-auto opacity-80 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}
                style={{
                  fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif',
                  lineHeight: '1.6'
                }}>
                  Thousands of students are already using UniShare to save money, make friends, and actually enjoy their campus life. Your turn.
                </p>

                {/* Floating Glass Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Link href="/register" className={`group px-8 py-4 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white relative overflow-hidden`}
                    style={{
                      boxShadow: `
                        0 15px 35px rgba(0, 0, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.3)
                      `,
                      fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                    }}>
                    <span>Let's get started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-1000" />
                    
                    {/* Button Glass Shine */}
                    <div className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 50%)`
                      }} />
                  </Link>
                  
                  <Link href="/info/about" className={`px-8 py-4 border rounded-2xl font-medium text-lg backdrop-blur-xl relative overflow-hidden ${
                    darkMode 
                      ? 'border-orange-400/30 text-orange-300 hover:bg-orange-400/5' 
                      : 'border-orange-500/30 text-orange-600 hover:bg-orange-500/5'
                  }`}
                  style={{
                    boxShadow: `
                      0 10px 25px rgba(0, 0, 0, 0.08),
                      inset 0 1px 0 rgba(255, 255, 255, 0.15)
                    `,
                    fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                  }}>
                    Tell me more first
                    
                    {/* Button Glass Shine */}
                    <div className="absolute inset-0 rounded-2xl"
                      style={{
                        background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                      }} />
                  </Link>
                </div>

                {/* Floating Feature Badges */}
                <div className="flex flex-wrap justify-center items-center gap-6">
                  {[
                    { text: "Totally free", icon: "✓" },
                    { text: "University verified", icon: "✓" },
                    { text: "Actually safe", icon: "✓" }
                  ].map((feature, index) => (
                    <div key={index} 
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl backdrop-blur-xl border relative overflow-hidden ${
                        darkMode ? 'bg-white/[0.06] border-white/15' : 'bg-white/[0.15] border-white/25'
                      }`}
                      style={{
                        boxShadow: `
                          0 8px 20px rgba(0, 0, 0, 0.08),
                          inset 0 1px 0 rgba(255, 255, 255, 0.12)
                        `
                      }}>
                      
                      {/* Floating Check Icon */}
                      <div className="relative">
                        <span className="text-green-400 text-sm font-bold"
                          style={{
                            textShadow: '0 0 12px rgba(74, 222, 128, 0.6)',
                            fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                          }}>{feature.icon}</span>
                        
                        {/* Check glow */}
                        <div className="absolute inset-0 w-2 h-2 bg-green-400/30 rounded-full blur-sm" />
                      </div>
                      
                      <span className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                      style={{
                        fontFamily: 'SF Pro Text, -apple-system, system-ui, sans-serif'
                      }}>{feature.text}</span>
                      
                      {/* Badge Glass Shine */}
                      <div className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
                        }} />
                      
                      {/* Floating particle */}
                      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Ambient Glow */}
            {/* Removed ambient glow effect */}
          </div>
        </div>
      </section>

      {/* Footer - Hidden on mobile */}
      <div className="hidden md:block">
        <Footer darkMode={darkMode} />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton darkMode={darkMode} />
      
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

        @keyframes float-gentle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.4;
          }
          33% { 
            transform: translateY(-15px) translateX(10px) scale(1.05);
            opacity: 0.6;
          }
          66% { 
            transform: translateY(10px) translateX(-5px) scale(0.95);
            opacity: 0.5;
          }
        }

        @keyframes galaxy-drift {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(25deg) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-30px) translateX(20px) rotate(27deg) scale(1.1);
            opacity: 0.9;
          }
        }

        @keyframes cosmic-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.6;
          }
          33% { 
            transform: translateY(-20px) translateX(15px) scale(1.1);
            opacity: 0.8;
          }
          66% { 
            transform: translateY(10px) translateX(-10px) scale(0.9);
            opacity: 0.7;
          }
        }

        @keyframes nebula-glow {
          0%, 100% { 
            transform: scale(1) rotate(0deg);
            opacity: 0.5;
            filter: blur(2rem) hue-rotate(0deg);
          }
          50% { 
            transform: scale(1.2) rotate(10deg);
            opacity: 0.7;
            filter: blur(1.5rem) hue-rotate(30deg);
          }
        }

        @keyframes cosmic-shimmer {
          0%, 100% { 
            transform: translateX(0px) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: translateX(50px) scale(1.05);
            opacity: 0.6;
          }
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

        @keyframes glassmorphism-float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            filter: blur(0px);
          }
          33% { 
            transform: translateY(-10px) translateX(5px) rotate(1deg);
            filter: blur(0.5px);
          }
          66% { 
            transform: translateY(5px) translateX(-3px) rotate(-0.5deg);
            filter: blur(0.3px);
          }
        }

        @keyframes glow-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 165, 0, 0.3), 0 0 40px rgba(255, 165, 0, 0.1);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 165, 0, 0.5), 0 0 60px rgba(255, 165, 0, 0.2);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes particle-float {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-20px) scale(1.1);
            opacity: 1;
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }

        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out;
        }

        .animate-glassmorphism-float {
          animation: glassmorphism-float 6s ease-in-out infinite;
        }

        .animate-glow-pulse {
          animation: glow-pulse 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-particle-float {
          animation: particle-float 4s ease-in-out infinite;
        }

        /* Enhanced glassmorphism effects */
        .glass-card {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .glass-card-dark {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }

        /* 3D transform effects */
        .transform-3d {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .rotate-3d-hover:hover {
          transform: rotateX(10deg) rotateY(10deg) scale(1.05);
        }

        /* Custom scrollbar for glassmorphism */
        .glass-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .glass-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .glass-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }

        .glass-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        /* Pause animations when off-screen for performance */
        .paused-anim {
          animation-play-state: paused !important;
        }

        /* Respect user's reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
  </div>
    </div>
  );
}
