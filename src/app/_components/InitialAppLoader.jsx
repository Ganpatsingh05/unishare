"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoImage from '../assets/images/logounishare1.png';
import { useUI } from '../lib/contexts/UniShareContext';

/**
 * InitialAppLoader Component
 * 
 * Modern, aligned loading screen with smooth animations and consistent spacing
 */
const InitialAppLoader = () => {
  const { initialLoading, initialMessage, appReady, darkMode, setInitialMessage, setAppReady } = useUI();
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const [dots, setDots] = useState('');

  // Enhanced loading stages with better messaging
  const loadingStages = [
    { message: 'Welcome to UniShare', duration: 1200, progress: 12 },
    { message: 'Initializing platform', duration: 1000, progress: 25 },
    { message: 'Loading theme engine', duration: 800, progress: 40 },
    { message: 'Setting up navigation', duration: 900, progress: 55 },
    { message: 'Verifying authentication', duration: 1000, progress: 70 },
    { message: 'Preparing interface', duration: 800, progress: 85 },
    { message: 'Almost ready', duration: 600, progress: 100 },
  ];

  // Smooth dot animation
  useEffect(() => {
    if (!initialLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);

    return () => clearInterval(interval);
  }, [initialLoading]);

  // Enhanced loading sequence with smoother transitions
  useEffect(() => {
    if (!initialLoading || appReady) return;

    const runLoadingSequence = async () => {
      for (let i = 0; i < loadingStages.length; i++) {
        const stage = loadingStages[i];
        
        setCurrentStage(i);
        setInitialMessage(stage.message);
        
        // Smooth progress animation
        const startProgress = i === 0 ? 0 : loadingStages[i - 1].progress;
        const targetProgress = stage.progress;
        const progressSteps = 30;
        const stepDuration = stage.duration / progressSteps;
        const progressIncrement = (targetProgress - startProgress) / progressSteps;
        
        for (let step = 0; step <= progressSteps; step++) {
          setProgress(Math.min(100, startProgress + (progressIncrement * step)));
          await new Promise(resolve => setTimeout(resolve, stepDuration));
        }
      }
      
      // Smooth completion
      setTimeout(() => {
        setAppReady();
      }, 300);
    };

    runLoadingSequence();
  }, [initialLoading, appReady, setInitialMessage, setAppReady]);

  if (!initialLoading || appReady) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Animated orbs */}
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : 'bg-gradient-to-br from-blue-400 to-purple-500'
        }`} style={{ animation: 'float 8s ease-in-out infinite' }} />
        
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15 ${
          darkMode 
            ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
            : 'bg-gradient-to-br from-purple-400 to-pink-400'
        }`} style={{ animation: 'float 10s ease-in-out infinite reverse' }} />

        {/* Subtle grid pattern */}
        <div className={`absolute inset-0 opacity-5 ${
          darkMode ? 'bg-white' : 'bg-slate-900'
        }`} style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-8">
        
        {/* Logo Section with Modern Design */}
        <div className="relative mb-16 flex items-center justify-center">
          
          {/* Outer rotating ring */}
          <div className={`absolute w-32 h-32 rounded-full border border-transparent ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20'
              : 'bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20'
          }`} style={{ animation: 'spin 12s linear infinite' }}>
            <div className={`absolute inset-2 rounded-full border border-transparent ${
              darkMode 
                ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30'
                : 'bg-gradient-to-r from-purple-400/30 to-blue-400/30'
            }`} style={{ animation: 'spin 8s linear infinite reverse' }} />
          </div>

          {/* Logo container with glassmorphism effect */}
          <div className={`relative w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-xl border ${
            darkMode 
              ? 'bg-white/10 border-white/20 shadow-2xl shadow-blue-500/25'
              : 'bg-white/60 border-white/40 shadow-2xl shadow-blue-500/15'
          }`} style={{ animation: 'pulse 4s ease-in-out infinite' }}>
            
            <div className="w-10 h-10 relative">
              <Image
                src={logoImage}
                alt="UniShare"
                width={40}
                height={40}
                className="w-full h-full object-contain filter drop-shadow-lg"
                priority
              />
            </div>

            {/* Shine effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0"
                 style={{ animation: 'shine 3s ease-in-out infinite' }} />
          </div>

          {/* Floating particles with static positions */}
          <div className={`absolute w-2 h-2 rounded-full top-8 -right-6 ${
            darkMode ? 'bg-blue-400/60' : 'bg-blue-500/60'
          }`} style={{ animation: 'float 4s ease-in-out infinite' }} />
          
          <div className={`absolute w-2 h-2 rounded-full -top-2 right-2 ${
            darkMode ? 'bg-purple-400/60' : 'bg-purple-500/60'
          }`} style={{ animation: 'float 4.5s ease-in-out infinite 0.5s' }} />
          
          <div className={`absolute w-2 h-2 rounded-full -top-4 -left-4 ${
            darkMode ? 'bg-pink-400/60' : 'bg-pink-500/60'
          }`} style={{ animation: 'float 5s ease-in-out infinite 1s' }} />
          
          <div className={`absolute w-2 h-2 rounded-full bottom-6 -left-8 ${
            darkMode ? 'bg-blue-400/60' : 'bg-blue-500/60'
          }`} style={{ animation: 'float 5.5s ease-in-out infinite 1.5s' }} />
          
          <div className={`absolute w-2 h-2 rounded-full -bottom-2 left-8 ${
            darkMode ? 'bg-purple-400/60' : 'bg-purple-500/60'
          }`} style={{ animation: 'float 6s ease-in-out infinite 2s' }} />
          
          <div className={`absolute w-2 h-2 rounded-full bottom-2 right-6 ${
            darkMode ? 'bg-pink-400/60' : 'bg-pink-500/60'
          }`} style={{ animation: 'float 6.5s ease-in-out infinite 2.5s' }} />
        </div>

        {/* Brand Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className={`text-4xl font-bold tracking-tight ${
            darkMode 
              ? 'bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent'
              : 'bg-gradient-to-r from-slate-800 via-blue-700 to-purple-700 bg-clip-text text-transparent'
          }`}>
            <span className="font-black">Uni</span>
            <span className="font-light">Share</span>
          </h1>
          
          <p className={`text-lg font-medium ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Your Campus Community Platform
          </p>

          <div className={`w-24 h-1 mx-auto rounded-full ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500'
              : 'bg-gradient-to-r from-blue-400 to-purple-400'
          }`} />
        </div>

        {/* Loading Status with Better Typography */}
        <div className="w-full text-center mb-10 space-y-3">
          <div className={`text-lg font-medium min-h-[28px] flex items-center justify-center ${
            darkMode ? 'text-slate-200' : 'text-slate-700'
          }`}>
            <span>{initialMessage}</span>
            <span className="ml-1 w-4 text-left">{dots}</span>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            darkMode 
              ? 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
              : 'bg-white/60 text-slate-600 border border-slate-200/50'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              darkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`} style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
            Step {currentStage + 1} of {loadingStages.length}
          </div>
        </div>

        {/* Modern Progress Bar */}
        <div className="w-full max-w-sm space-y-4">
          <div className={`relative h-2 rounded-full overflow-hidden ${
            darkMode 
              ? 'bg-slate-800/60 border border-slate-700/30'
              : 'bg-slate-200/60 border border-slate-300/30'
          }`}>
            {/* Background glow */}
            <div className={`absolute inset-0 rounded-full ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20'
                : 'bg-gradient-to-r from-blue-400/20 to-purple-400/20'
            }`} />
            
            {/* Progress fill */}
            <div 
              className={`relative h-full rounded-full transition-all duration-700 ease-out ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/50'
                  : 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 shadow-lg shadow-blue-400/50'
              }`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                   style={{ animation: 'shimmer 2s ease-in-out infinite' }} />
            </div>
          </div>
          
          {/* Progress Text */}
          <div className={`flex justify-between items-center text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Loading</span>
            <span className={`font-mono ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Bottom Message */}
        <div className={`mt-12 text-center ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <div className={`w-1.5 h-1.5 rounded-full ${
              darkMode ? 'bg-purple-400' : 'bg-purple-500'
            }`} style={{ animation: 'pulse 2s ease-in-out infinite' }} />
            <span>Setting up your personalized experience</span>
            <div className={`w-1.5 h-1.5 rounded-full ${
              darkMode ? 'bg-blue-400' : 'bg-blue-500'
            }`} style={{ animation: 'pulse 2s ease-in-out infinite 0.5s' }} />
          </div>
        </div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.05); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          50%, 100% { transform: translateX(100%); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default InitialAppLoader;