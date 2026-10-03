"use client";

import { useState, useEffect } from 'react';

/**
 * ✅ PERFORMANCE: Detect device capabilities for adaptive UI
 * Returns performance tier and reduced motion preferences
 */
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    isLowEnd: false,
    prefersReducedMotion: false,
    gpuTier: 'high',
    tier: 'HIGH'
  });

  useEffect(() => {
    // Check hardware concurrency (CPU cores)
    const cores = navigator.hardwareConcurrency || 4;
    
    // Check device memory (GB)
    const memory = navigator.deviceMemory || 4;
    
    // Check for old Android devices
    const isOldAndroid = /Android [4-6]/.test(navigator.userAgent);
    
    // Check for low-end indicators
    const isLowEnd = cores <= 4 || memory <= 4 || isOldAndroid;
    
    // Check for medium-tier devices
    const isMediumEnd = cores <= 6 && memory <= 6;
    
    // Check for reduced motion preference
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Determine performance tier
    let tier = 'HIGH';
    let gpuTier = 'high';
    
    if (isLowEnd || prefersReduced) {
      tier = 'LOW';
      gpuTier = 'low';
    } else if (isMediumEnd) {
      tier = 'MEDIUM';
      gpuTier = 'medium';
    }

    setCapabilities({
      isLowEnd: isLowEnd || prefersReduced,
      prefersReducedMotion: prefersReduced,
      gpuTier,
      tier
    });
  }, []);

  return capabilities;
};

/**
 * ✅ PERFORMANCE: Get blur class based on device tier
 */
export const useAdaptiveBlur = (defaultBlur = 'backdrop-blur-3xl') => {
  const { tier } = useDeviceCapabilities();
  
  const blurMap = {
    HIGH: defaultBlur,
    MEDIUM: 'backdrop-blur-xl',
    LOW: 'backdrop-blur-sm'
  };
  
  return blurMap[tier];
};

/**
 * ✅ PERFORMANCE: Get shadow class based on device tier
 */
export const useAdaptiveShadow = (defaultShadow = 'shadow-2xl') => {
  const { tier } = useDeviceCapabilities();
  
  const shadowMap = {
    HIGH: defaultShadow,
    MEDIUM: 'shadow-lg',
    LOW: 'shadow-md'
  };
  
  return shadowMap[tier];
};

export default useDeviceCapabilities;
