"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import logoImage from '../assets/images/logounishare1.png';
import { useUI } from '../lib/contexts/UniShareContext';

const NavigationLoader = () => {
  const { navigationLoading, navigationMessage, darkMode } = useUI();
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  // Animate loading dots
  useEffect(() => {
    if (!navigationLoading) return;
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400); // Faster dots animation

    return () => clearInterval(interval);
  }, [navigationLoading]);

  // Smooth progress simulation
  useEffect(() => {
    if (!navigationLoading) {
      setProgress(0);
      return;
    }
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Cap at 90% until actual completion
        return Math.min(prev + Math.random() * 8 + 2, 90); // Smoother, more realistic progress
      });
    }, 80); // Faster updates for smoother animation

    return () => clearInterval(interval);
  }, [navigationLoading]);

  if (!navigationLoading) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-md' 
        : 'bg-gradient-to-br from-orange-50/95 via-white/95 to-orange-100/95 backdrop-blur-md'
    }`}>
      
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className={`w-full h-full ${
          darkMode 
            ? 'bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.2),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(245,158,11,0.2),transparent_40%)]'
            : 'bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.15),transparent_40%),radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.15),transparent_40%)]'
        }`} />
      </div>

      {/* Main Loader Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Enhanced Loading Rings */}
        <div className="relative">
          {/* Outer Ring - Fast spin */}
          <div className={`w-28 h-28 rounded-full border-3 border-transparent ${
            darkMode 
              ? 'border-t-yellow-400 border-r-sky-400'
              : 'border-t-yellow-500 border-r-sky-500'
          }`} 
          style={{
            animation: 'fastSpin 1.2s linear infinite'
          }} />
          
          {/* Middle Ring - Medium spin reverse */}
          <div className={`absolute inset-2 w-24 h-24 rounded-full border-2 border-transparent ${
            darkMode 
              ? 'border-t-sky-300 border-l-yellow-300'
              : 'border-t-sky-400 border-l-yellow-400'
          }`}
          style={{
            animation: 'mediumSpin 1.8s linear infinite reverse'
          }} />
          
          {/* Inner Ring - Slow pulse */}
          <div className={`absolute inset-4 w-20 h-20 rounded-full border border-transparent ${
            darkMode 
              ? 'border-yellow-200/60'
              : 'border-orange-300/60'
          }`}
          style={{
            animation: 'gentlePulse 2s ease-in-out infinite'
          }} />

          {/* Logo Container with Smooth Float */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-800/90 backdrop-blur-sm shadow-xl shadow-gray-900/30'
                : 'bg-white/95 backdrop-blur-sm shadow-xl shadow-orange-200/30'
            } transition-all duration-300`}
            style={{
              animation: 'smoothFloat 3s ease-in-out infinite'
            }}>
              
              {/* UniShare Logo */}
              <div className="w-8 h-8 relative">
                <Image
                  src={logoImage}
                  alt="UniShare"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Additional Glow Effect */}
          <div className={`absolute inset-6 w-16 h-16 rounded-full ${
            darkMode 
              ? 'bg-gradient-to-br from-yellow-400/20 to-sky-400/20'
              : 'bg-gradient-to-br from-yellow-500/20 to-sky-500/20'
          }`}
          style={{
            animation: 'glowPulse 2.5s ease-in-out infinite alternate'
          }} />
        </div>

        {/* Loading Text */}
        <div className="mt-6 text-center">
          <div className={`text-lg font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            <span className="brand-wordmark">
              <span className="brand-uni">Uni</span>
              <span className="brand-share">Share</span>
            </span>
          </div>
          
          <div className={`text-sm font-medium min-h-[20px] ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
          </div>
        </div>
      </div>

      {/* Enhanced Custom Animations */}
      <style jsx>{`
        @keyframes fastSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes mediumSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes smoothFloat {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.3; transform: scale(0.98); }
          50% { opacity: 0.7; transform: scale(1.02); }
        }
        
        @keyframes glowPulse {
          0% { opacity: 0.2; transform: scale(0.95); }
          100% { opacity: 0.5; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default NavigationLoader;