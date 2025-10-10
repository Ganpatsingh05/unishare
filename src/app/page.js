"use client";
/* eslint-disable react/no-unescaped-entities */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
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
import Main from "./_components/Main";
import HeroSlider from "./_components/HeroSlider";
import Footer from "./_components/Footer";
import FloatingActionButton from "./_components/FloatingActionButton";
import { useUI } from "./lib/contexts/UniShareContext";
// Particles background removed

/**
 * Page component with interactive hero section and enhanced scroll effects
 */
export default function Page() {
  // Use theme from context instead of local state
  const { darkMode } = useUI();
  
  const [offset, setOffset] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMainVisible, setIsMainVisible] = useState(false);
  const [visibleStats, setVisibleStats] = useState([]);
  
  // Interactive How It Works states
  const [activeStep, setActiveStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState([0, 1, 2]); // Show all steps immediately
  const [isMobile, setIsMobile] = useState(false);
  
  const heroRef = useRef(null);
  const mainRef = useRef(null);
  const transitionRef = useRef(null);

  // Removed particles state

  // Static main quote
  const mainQuote = "Where Students Connect, Share, and Thrive Together";

  // Enhanced How It Works steps
  const howItWorksSteps = [
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

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Smooth, throttled scroll handler using requestAnimationFrame
    const ticking = { scroll: false };

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

          // How It Works steps are always visible - no scroll detection needed

          ticking.scroll = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Removed particle generation

    // Initial scroll position check
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener('resize', checkMobile);
    };
  }, [visibleStats.length, visibleSteps]);

  const scrollToMain = () => {
    mainRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleStepClick = (index) => {
    setActiveStep(activeStep === index ? -1 : index);
  };

  const StepCard = ({ step, index, isActive, isVisible }) => {
    const IconComponent = step.icon;
    const isCompleted = index < activeStep || (isMobile && visibleSteps.includes(index));
    
    return (
      <div 
        data-step={index}
        className="relative group cursor-pointer transition-all duration-500 opacity-100 translate-y-0"
        onClick={() => isMobile && handleStepClick(index)}
      >
        {/* Mobile: Card style */}
        {isMobile ? (
          <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
            isActive 
              ? `border-transparent bg-gradient-to-r ${step.color}` 
              : darkMode 
                ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600' 
                : 'border-gray-200 bg-white hover:border-gray-300'
          }`}>
            {/* Background animation */}
            <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 transition-opacity duration-300 ${
              isActive ? 'opacity-100' : 'group-hover:opacity-10'
            }`} />
            
            <div className="relative p-6">
              <div className="flex items-start gap-4">
                {/* Step indicator */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : `bg-gradient-to-r ${step.color} text-white`
                }`}>
                  {isCompleted && isActive ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step.step
                  )}
                </div>

                <div className="flex-1">
                  <h3 className={`text-lg font-bold mb-2 transition-colors duration-300 ${
                    isActive 
                      ? 'text-white' 
                      : darkMode 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}>
                    {step.shortTitle}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isActive 
                      ? 'text-white/90' 
                      : darkMode 
                        ? 'text-gray-300' 
                        : 'text-gray-600'
                  }`}>
                    {step.mobileDescription}
                  </p>
                </div>

                <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                  isActive 
                    ? 'text-white transform rotate-90' 
                    : darkMode 
                      ? 'text-gray-400 group-hover:text-gray-300' 
                      : 'text-gray-400 group-hover:text-gray-600'
                }`} />
              </div>

              {/* Expanded content */}
              <div className={`overflow-hidden transition-all duration-300 ${
                isActive ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}>
                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
              <div 
                className={`h-full bg-white transition-all duration-500 ${
                  isActive ? 'w-full' : 'w-0'
                }`} 
              />
            </div>
          </div>
        ) : (
          /* Desktop: Enhanced original style */
          <div className="relative group">
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
        )}

        {/* Connection line for mobile */}
        {isMobile && index < howItWorksSteps.length - 1 && (
          <div className="flex justify-center py-3">
            <div className={`w-0.5 h-8 rounded-full transition-all duration-500 bg-gradient-to-b ${step.color}`} />
          </div>
        )}
      </div>
    );
  };

  return (
      <div className="min-h-screen relative">

  {/* Particles background removed */}

      <div className="relative z-10 mb-0 md:mb-5">
      {/* SLIDER SECTION (replacing previous hero) */}
      <HeroSlider darkMode={darkMode} />

      {/* ENHANCED MAIN SECTION */}
      <div ref={mainRef} className="mt-2 md:mt-0">
        <Main darkMode={darkMode} isVisible={isMainVisible} scrollProgress={scrollProgress} />
      </div>

      {/* Interactive How It Works Section - Hidden on mobile, shown in FAB popup */}
      <section className="py-16 md:py-20 transition-all duration-300 hidden md:block">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="relative inline-block">
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                How does this actually work?
              </h2>
              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 rounded-full ${
                darkMode ? 'bg-gradient-to-r from-orange-400 to-orange-600' : 'bg-gradient-to-r from-orange-500 to-orange-700'
              }`} />
            </div>
            <p className={`text-lg md:text-xl max-w-2xl mx-auto mt-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {isMobile 
                ? "Tap each step below to see how easy it is"
                : "Don't worry, it's super simple. Literally takes like 2 minutes to get started, and then you're in."
              }
            </p>
          </div>

          {/* Steps */}
          <div className={`${isMobile ? 'space-y-0' : 'grid grid-cols-3 gap-8'}`}>
            {howItWorksSteps.map((step, index) => (
              <StepCard
                key={index}
                step={step}
                index={index}
                isActive={activeStep === index}
                isVisible={true}
              />
            ))}
          </div>

          {/* Mobile: Progress indicator */}
          {isMobile && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {howItWorksSteps.map((step, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${step.color}`}
                    onClick={() => setActiveStep(index)}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Call to Action Section - Hidden on mobile, shown in FAB popup */}
      <section className="py-20 transition-all duration-300 hidden md:block">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Ready to make college less stressful?
          </h2>
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Thousands of students are already using UniShare to save money, make friends, and actually enjoy their campus life. Your turn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 ${
              darkMode 
                ? 'bg-orange-600 text-white hover:bg-orange-500' 
                : 'bg-orange-600 text-white hover:bg-orange-700'
            }`}>
              <span>Let's get started</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link href="/footerpages/about" className={`px-8 py-4 border-2 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-gray-900' 
                : 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
            }`}>
              Tell me more first
            </Link>
          </div>

          <div className={`mt-12 flex flex-wrap justify-center items-center gap-6 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span>Totally free</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span>University verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg">✓</span>
              <span>Actually safe</span>
            </div>
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
    </div>
  );
}