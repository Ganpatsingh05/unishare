"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';
import logoImage from '../assets/images/logounishare1.png';
import { useUI } from '../lib/contexts/UniShareContext';
import { 
  Users, 
  MessageCircle, 
  Share2, 
  MapPin, 
  BookOpen, 
  Coffee, 
  GraduationCap, 
  Laptop, 
  Smartphone, 
  Lightbulb, 
  Star, 
  Bike, 
  PenTool, 
  FileText, 
  Building2, 
  Sparkles 
} from 'lucide-react';

const InitialAppLoader = () => {
  const { initialLoading, initialMessage, appReady, darkMode, setInitialMessage, setAppReady } = useUI();
  
  // Debug log to track loader state
  console.log('InitialAppLoader state:', { initialLoading, appReady });
  console.log('InitialAppLoader will render:', !initialLoading || appReady ? 'NO' : 'YES');
  
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [loaderStarted, setLoaderStarted] = useState(false);
  const containerRef = useRef(null);
  const logoControls = useAnimation();

  // Campus-themed loading stages with professional icons
  const loadingStages = [
    { 
      message: 'Opening campus gates...', 
      icon: MapPin,
      duration: 900, 
      progress: 20,
      CampusIcon: Building2
    },
    { 
      message: 'Gathering students...', 
      icon: Users,
      duration: 800, 
      progress: 45,
      CampusIcon: Users
    },
    { 
      message: 'Setting up study groups...', 
      icon: BookOpen,
      duration: 700, 
      progress: 70,
      CampusIcon: BookOpen
    },
    { 
      message: 'Brewing connections...', 
      icon: Coffee,
      duration: 600, 
      progress: 85,
      CampusIcon: Coffee
    },
    { 
      message: 'Ready to share!', 
      icon: Share2,
      duration: 500, 
      progress: 100,
      CampusIcon: Sparkles
    },
  ];

  // Create floating campus elements with professional icons
  useEffect(() => {
    const elements = [
      { id: 0, Icon: BookOpen, x: 15, y: 20, delay: 0.5, duration: 12 },
      { id: 1, Icon: Building2, x: 85, y: 15, delay: 1.2, duration: 10 },
      { id: 2, Icon: PenTool, x: 10, y: 70, delay: 0.8, duration: 14 },
      { id: 3, Icon: FileText, x: 90, y: 65, delay: 2.0, duration: 11 },
      { id: 4, Icon: Building2, x: 20, y: 85, delay: 1.5, duration: 13 },
      { id: 5, Icon: Bike, x: 75, y: 80, delay: 0.3, duration: 9 },
      { id: 6, Icon: Coffee, x: 5, y: 45, delay: 1.8, duration: 15 },
      { id: 7, Icon: Laptop, x: 95, y: 40, delay: 0.7, duration: 12 },
      { id: 8, Icon: GraduationCap, x: 30, y: 10, delay: 1.3, duration: 11 },
      { id: 9, Icon: Smartphone, x: 60, y: 90, delay: 2.2, duration: 13 },
      { id: 10, Icon: Star, x: 80, y: 25, delay: 0.9, duration: 10 },
      { id: 11, Icon: Lightbulb, x: 25, y: 60, delay: 1.7, duration: 14 }
    ];
    setFloatingElements(elements);
  }, []);

  // Ensure logo controls are ready before starting animations
  useEffect(() => {
    if (containerRef.current && logoControls) {
      console.log('Logo controls are ready');
    }
  }, [logoControls]);

  // Campus loading sequence
  useEffect(() => {
    // Only start if initialLoading is true, appReady is false, and we haven't started yet
    if (!initialLoading || appReady || loaderStarted) return;

    console.log('Starting loader sequence...');
    setLoaderStarted(true);

    const runCampusLoading = async () => {
      console.log('Starting campus loading sequence...');
      
      // Longer delay to ensure component is fully mounted and controls are ready
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Initial logo animation - only start if controls are available and component is mounted
      try {
        if (logoControls && containerRef.current) {
          await logoControls.start({
            scale: [0.5, 1.1, 1],
            rotate: [0, 5, -5, 0],
            transition: { duration: 1.2, ease: "easeOut" }
          });
        }
      } catch (error) {
        console.log('Logo controls not ready yet, continuing without animation');
      }

      for (let i = 0; i < loadingStages.length; i++) {
        const stage = loadingStages[i];
        setCurrentStage(i);
        setInitialMessage(stage.message);
        
        // Smooth progress with campus-like organic timing
        const startProgress = i === 0 ? 0 : loadingStages[i - 1].progress;
        const targetProgress = stage.progress;
        const duration = stage.duration;
        const steps = 25;
        const stepDuration = duration / steps;
        
        for (let step = 0; step <= steps; step++) {
          const easedProgress = startProgress + (targetProgress - startProgress) * (1 - Math.pow(1 - step / steps, 3));
          setProgress(Math.min(100, easedProgress));
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }

        // Logo bounce for each stage - only if controls are available and component is mounted
        try {
          if (logoControls && containerRef.current) {
            await logoControls.start({
              scale: [1, 1.1, 1],
              transition: { duration: 0.3 }
            });
          }
        } catch (error) {
          console.log('Logo bounce animation error:', error);
        }
      }
      
      setLoadingComplete(true);
      
      // Launch confetti celebration with fixed positions
      setShowConfetti(true);
      const pieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: 50 + ((i % 10) - 5) * 3, // Deterministic spread
        y: 40,
        color: ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B'][i % 5],
        delay: (i % 10) * 0.05 // Deterministic delays
      }));
      setConfettiPieces(pieces);
      
      setTimeout(() => {
        setShowConfetti(false);
        setTimeout(() => {
          console.log('Loader completing - setting sessionStorage and calling setAppReady');
          // Mark loader as shown in this session
          sessionStorage.setItem('uniShareLoaderShown', 'true');
          setAppReady();
        }, 400);
      }, 2000);
    };

    runCampusLoading();
  }, [initialLoading, appReady, loaderStarted, setInitialMessage, setAppReady, logoControls]);

  if (!initialLoading || appReady) return null;

  return (
    <AnimatePresence>
      <motion.div 
        ref={containerRef}
        className={`fixed inset-0 z-[10003] overflow-hidden ${
          darkMode 
            ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900' 
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
        }`}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Floating professional icons */}
        <div className="absolute inset-0">
          {floatingElements.map((element) => (
            <motion.div
              key={element.id}
              className={`absolute select-none pointer-events-none ${
                darkMode ? 'text-blue-300/40' : 'text-blue-500/40'
              }`}
              initial={{
                x: `${element.x}vw`,
                y: `${element.y}vh`,
                opacity: 0
              }}
              animate={{
                x: [`${element.x}vw`, `${(element.x + 20) % 100}vw`, `${element.x}vw`],
                y: [`${element.y}vh`, `${(element.y - 10) % 100}vh`, `${element.y}vh`],
                opacity: [0, 0.4, 0.15, 0.4, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: element.duration,
                delay: element.delay,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {React.createElement(element.Icon, { className: "w-6 h-6" })}
            </motion.div>
          ))}
        </div>

        {/* Campus building silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
          <svg viewBox="0 0 1200 200" className="w-full h-full">
            <motion.path
              d="M0,200 L0,150 L100,150 L100,80 L200,80 L200,120 L300,120 L300,60 L400,60 L400,100 L500,100 L500,40 L600,40 L600,90 L700,90 L700,70 L800,70 L800,110 L900,110 L900,85 L1000,85 L1000,130 L1100,130 L1100,95 L1200,95 L1200,200 Z"
              fill={darkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(79, 70, 229, 0.2)'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
          {/* Logo with Perfect Circular Boundary */}
          <motion.div className="relative mb-12 flex items-center justify-center">
            {/* Outer decorative rings - positioned absolutely from center */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Ring 1: Outermost */}
              <motion.div
                className={`absolute w-36 h-36 rounded-full border-2 border-dashed ${
                  darkMode ? 'border-blue-400/30' : 'border-blue-500/30'
                }`}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              {/* Ring 2: Middle */}
              <motion.div
                className={`absolute w-32 h-32 rounded-full border border-dashed ${
                  darkMode ? 'border-purple-400/40' : 'border-purple-500/40'
                }`}
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            {/* Community dots - orbiting around logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[
                { angle: 0, x: 52, y: -6 },
                { angle: 60, x: 20, y: 44.4 },
                { angle: 120, x: -35, y: 44.4 },
                { angle: 180, x: -64, y: -6 },
                { angle: 240, x: -35, y: -56.2 },
                { angle: 300, x: 20, y: -56.2 }
              ].map((dot, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-3 h-3 rounded-full ${
                    darkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  }`}
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(${dot.x}px, ${dot.y}px)`,
                  }}
                  animate={{
                    scale: [0.8, 1.2, 0.8],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{
                    duration: 3,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>

            {/* PERFECT LOGO CONTAINER */}
            <motion.div 
              className={`relative rounded-full shadow-2xl border-4 ${
                darkMode 
                  ? 'bg-white border-blue-200' 
                  : 'bg-white border-blue-300'
              } overflow-hidden`}
              style={{
                width: '96px',
                height: '96px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              animate={logoControls}
            >
              {/* Logo image - perfectly centered */}
              <Image 
                src={logoImage} 
                alt="UniShare" 
                width={72} 
                height={72} 
                className="object-contain"
                style={{
                  width: '72px',
                  height: '72px',
                  display: 'block'
                }}
                priority 
              />
              
              {/* Pulse effect overlay */}
              <motion.div
                className={`absolute inset-0 rounded-full pointer-events-none ${
                  darkMode ? 'bg-blue-400/20' : 'bg-blue-500/20'
                }`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Brand Text with Perfect Logo Colors */}
          <motion.div
            className="text-center mb-16"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.h1 
              className="text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <span 
                className={darkMode ? 'text-yellow-300' : 'text-yellow-500'}
                style={{ 
                  textShadow: darkMode 
                    ? '0 2px 4px rgba(253, 224, 71, 0.3)' 
                    : '0 2px 4px rgba(245, 158, 11, 0.3)'
                }}
              >
                Uni
              </span>
              <span 
                className={darkMode ? 'text-blue-300' : 'text-blue-600'}
                style={{ 
                  textShadow: darkMode 
                    ? '0 2px 4px rgba(147, 197, 253, 0.3)' 
                    : '0 2px 4px rgba(37, 99, 235, 0.3)'
                }}
              >
                Share
              </span>
            </motion.h1>
            
            <motion.p 
              className={`text-xl font-medium ${
                darkMode ? 'text-blue-200' : 'text-blue-700'
              }`}
              animate={{
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Where Campus Connects
            </motion.p>

            {/* Campus activity indicators */}
            <div className="flex justify-center items-center mt-6 space-x-4">
              {[Users, MessageCircle, BookOpen].map((Icon, i) => (
                <motion.div
                  key={i}
                  className={`p-2 rounded-full ${
                    darkMode ? 'bg-white/10' : 'bg-white/60'
                  } backdrop-blur-sm`}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Icon className={`w-5 h-5 ${
                    darkMode ? 'text-blue-300' : 'text-blue-600'
                  }`} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Campus-style progress section */}
          <motion.div
            className="w-full max-w-lg space-y-8"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Current stage with professional icon */}
            <div className="text-center space-y-4">
              <motion.div
                className={`flex justify-center ${
                  darkMode ? 'text-blue-300' : 'text-blue-600'
                }`}
                key={currentStage}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
              >
                {loadingStages[currentStage]?.CampusIcon && 
                  React.createElement(loadingStages[currentStage].CampusIcon, { className: "w-16 h-16" })
                }
              </motion.div>
              
              <motion.p 
                className={`text-lg font-medium ${
                  darkMode ? 'text-blue-100' : 'text-blue-800'
                }`}
                key={`message-${currentStage}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
              >
                {initialMessage}
              </motion.p>
            </div>

            {/* Campus walkway progress */}
            <div className="relative">
              <div className={`h-3 rounded-full ${
                darkMode ? 'bg-white/10' : 'bg-white/40'
              } backdrop-blur-sm border ${
                darkMode ? 'border-white/20' : 'border-white/60'
              }`}>
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    darkMode 
                      ? 'from-blue-400 via-purple-400 to-pink-400' 
                      : 'from-blue-500 via-purple-500 to-pink-500'
                  } shadow-lg relative overflow-hidden`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {/* Walking student icon */}
                  <motion.div
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                    animate={{
                      x: [-8, 2, -8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Users className="w-3 h-3" />
                  </motion.div>
                  
                  {/* Progress shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
              
              {/* Campus milestones */}
              <div className="flex justify-between mt-4">
                {loadingStages.map((stage, index) => (
                  <motion.div
                    key={index}
                    className={`flex flex-col items-center space-y-2 ${
                      index <= currentStage ? 'opacity-100' : 'opacity-40'
                    }`}
                    animate={index === currentStage ? {
                      scale: [1, 1.1, 1],
                      y: [0, -5, 0]
                    } : {}}
                    transition={{
                      duration: 1,
                      repeat: index === currentStage ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <div className={`p-2 rounded-full ${
                      index <= currentStage
                        ? (darkMode ? 'bg-blue-400 text-white' : 'bg-blue-500 text-white')
                        : (darkMode ? 'bg-white/20 text-blue-200' : 'bg-white/60 text-blue-400')
                    }`}>
                      <stage.icon className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Progress percentage */}
              <motion.div 
                className={`text-center mt-6 text-2xl font-bold ${
                  darkMode ? 'text-blue-300' : 'text-blue-600'
                }`}
                animate={{
                  scale: progress === 100 ? [1, 1.2, 1] : 1
                }}
                transition={{
                  duration: 0.5,
                  repeat: progress === 100 ? 3 : 0
                }}
              >
                {Math.round(progress)}%
              </motion.div>
            </div>

            {/* Completion celebration */}
            <AnimatePresence>
              {loadingComplete && (
                <motion.div
                  className="text-center space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className={`flex justify-center ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}
                    animate={{
                      scale: [1, 1.3, 1.1, 1.3, 1],
                      rotate: [0, -10, 10, -5, 0]
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeInOut"
                    }}
                  >
                    <Sparkles className="w-12 h-12" />
                  </motion.div>
                  
                  <motion.p
                    className={`text-xl font-semibold flex items-center justify-center gap-2 ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}
                    animate={{
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    Welcome to your campus community!
                    <Building2 className="w-6 h-6" />
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Confetti Effect */}
            <AnimatePresence>
              {showConfetti && (
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-[10004]">
                  {confettiPieces.map((piece) => (
                    <motion.div
                      key={piece.id}
                      className="absolute w-2 h-2 rounded-sm"
                      style={{
                        backgroundColor: piece.color,
                        left: `${piece.x}%`,
                        top: `${piece.y}%`
                      }}
                      initial={{
                        y: 0,
                        x: 0,
                        rotate: 0,
                        opacity: 1
                      }}
                      animate={{
                        y: [0, 300, 600],
                        x: [((piece.id % 10) - 5) * 40, ((piece.id % 20) - 10) * 20],
                        rotate: [0, 360, 720],
                        opacity: [1, 0.7, 0]
                      }}
                      transition={{
                        duration: 2,
                        delay: piece.delay,
                        ease: "easeOut"
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Footer campus motto */}
          <motion.div
            className={`absolute bottom-8 left-0 right-0 text-center text-sm ${
              darkMode ? 'text-blue-200/60' : 'text-blue-600/60'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <motion.p
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              "Connecting minds, building friendships, sharing knowledge"
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InitialAppLoader;
