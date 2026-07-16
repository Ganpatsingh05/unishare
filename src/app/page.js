"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  User,
  Search,
  Heart,
  ArrowRight,
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

// Memoized StepCard removed — How It Works section now uses inline Brave-style cards

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
    isMainVisible: true,
    visibleStats: [0, 1, 2, 3]
  });
  // How It Works visibility state
  const [visibleSteps, setVisibleSteps] = useState([0, 1, 2]); // Show all steps immediately
  const [isMobile, setIsMobile] = useState(false);
  const [howItWorksVisible, setHowItWorksVisible] = useState(true);
  
  const heroRef = useRef(null);
  const mainRef = useRef(null);
  const transitionRef = useRef(null);
  const howItWorksRef = useRef(null);
  
  // Scroll cache for batched updates - moved to top level
  const scrollCache = useRef({
    offset: 0,
    progress: 0,
    mainVisible: true,
    statsVisible: true
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
          
          // ✅ PERFORMANCE: Batch commit all state updates into single call
          if (needsUpdate) {
            setScrollState(prev => ({
              offset: cache.offset,
              progress: cache.progress,
              isMainVisible: cache.mainVisible,
              visibleStats: prev.visibleStats
            }));
          }

          ticking.scroll = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

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

  return (
      <div className="relative min-h-screen bg-transparent">
        
      <div className="relative z-10">
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
      <section id="how-it-works" ref={howItWorksRef} className="py-20 md:py-28 transition-colors duration-300 relative overflow-hidden">
        {/* Giant watermark text behind — UniShare brand */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true">
          <span className={`text-[16vw] font-black leading-none tracking-tighter whitespace-nowrap ${
            darkMode ? 'text-white/[0.03]' : 'text-black/[0.04]'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            UniShare
          </span>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          {/* RIGHT-aligned massive header (Section 3 = RIGHT, alternating) */}
          <div className="mb-16 md:mb-20 text-right">
            <h2 
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
              style={{
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
              }}
            >
              How does it
              <br />
              <span className="brand-wordmark relative inline-block mt-1">
                <span className="brand-uni">actually</span>{" "}
                <span className="brand-share">work?</span>
              </span>
            </h2>
            
            <p className={`text-lg md:text-xl max-w-2xl mt-6 leading-relaxed ml-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Don't worry, it's super simple. Literally takes like 2 minutes to get started, and then you're in.
            </p>
          </div>

          {/* Brave-style bordered cards with tinted backgrounds */}
          {howItWorksVisible && (
          <div className="grid grid-cols-3 gap-6">
            {HOW_IT_WORKS_STEPS.map((step, index) => {
              const IconComponent = step.icon;
              // Tinted card backgrounds like Brave — white, blue, peach, mint
              const tints = [
                { bg: darkMode ? 'rgba(30,35,45,0.8)' : '#ffffff', border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', accent: darkMode ? '#60a5fa' : '#2563eb' },
                { bg: darkMode ? 'rgba(30,35,50,0.8)' : '#eef4ff', border: darkMode ? 'rgba(100,150,255,0.12)' : 'rgba(59,130,246,0.15)', accent: darkMode ? '#a78bfa' : '#7c3aed' },
                { bg: darkMode ? 'rgba(30,40,38,0.8)' : '#ecfdf5', border: darkMode ? 'rgba(52,211,153,0.12)' : 'rgba(16,185,129,0.12)', accent: darkMode ? '#34d399' : '#059669' },
              ];
              const tint = tints[index] || tints[0];
              
              return (
                <div key={index} className="group relative">
                  <div 
                    className="relative h-full rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col"
                    style={{ 
                      background: tint.bg, 
                      borderColor: tint.border,
                    }}
                  >
                    {/* Card content */}
                    <div className="p-8 flex-1">
                      {/* Step number */}
                      <span className={`text-sm font-bold tracking-widest uppercase mb-6 block ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        Step {step.step}
                      </span>

                      <h3 className={`text-2xl font-black mb-3 tracking-tight ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                      style={{ letterSpacing: '-0.02em', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {step.title}
                      </h3>
                      
                      <p className={`text-base leading-relaxed mb-6 ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>

                      {/* Features list */}
                      <div className="space-y-2.5">
                        {step.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 text-sm">
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0`} style={{ backgroundColor: tint.accent }} />
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom section with icon + colored CTA button like Brave */}
                    <div className="px-8 pb-8 pt-4 flex items-center justify-between">
                      <span 
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 group-hover:shadow-md group-hover:scale-[1.02]"
                        style={{ backgroundColor: tint.accent }}
                      >
                        Get Started
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                          <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        darkMode ? 'bg-white/5' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      </section>
      )}

      {/* Clean Premium Call to Action — Brave-inspired */}
      <section className="py-20 md:py-28 transition-colors duration-300 hidden md:block relative overflow-hidden">
        {/* Giant watermark text — UniShare brand */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
          aria-hidden="true">
          <span className={`text-[14vw] font-black leading-none tracking-tighter whitespace-nowrap ${
            darkMode ? 'text-white/[0.03]' : 'text-black/[0.04]'
          }`}
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            UniShare
          </span>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* LEFT-aligned Brave-style massive text (Section 4 = LEFT, alternating) */}
          <div className="mb-12">
            <h2 className={`text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.04em',
              }}>
              Ready to make
              <br />
              college life
              <br />
              <span className={`${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>less stressful?</span>
            </h2>
            
            <p className={`text-lg md:text-xl max-w-2xl mt-6 leading-relaxed ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Thousands of students are already using UniShare to save money, make friends, and actually enjoy their campus life. Your turn.
            </p>
          </div>

          {/* CTA Buttons — clean, bold */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/login" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold transition-all duration-200 hover:shadow-lg"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              <span>Let's get started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link href="/info/about" className={`inline-flex items-center justify-center px-8 py-4 rounded-full border-2 text-lg font-bold transition-all duration-200 ${
              darkMode 
                ? 'border-gray-700 text-gray-300 hover:border-gray-500 hover:bg-gray-800/50' 
                : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
            style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              Tell me more first
            </Link>
          </div>

          {/* Trust badges — bordered cards like Brave feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { text: "Totally free", desc: "No hidden fees, no premium tiers", icon: "✓" },
              { text: "University verified", desc: "Only real students can join", icon: "✓" },
              { text: "Actually safe", desc: "Verified community you can trust", icon: "✓" }
            ].map((feature, index) => {
              const tints = [
                { bg: darkMode ? 'rgba(30,35,45,0.7)' : '#ffffff', border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
                { bg: darkMode ? 'rgba(30,35,50,0.7)' : '#eef4ff', border: darkMode ? 'rgba(100,150,255,0.12)' : 'rgba(59,130,246,0.12)' },
                { bg: darkMode ? 'rgba(40,32,35,0.7)' : '#fff1f0', border: darkMode ? 'rgba(255,120,100,0.12)' : 'rgba(239,68,68,0.08)' },
              ];
              const tint = tints[index];
              return (
                <div key={index} 
                  className="rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: tint.bg, borderColor: tint.border }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-green-500 text-lg font-bold">✓</span>
                    <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                      {feature.text}
                    </span>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
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
