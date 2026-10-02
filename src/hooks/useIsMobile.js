/**
 * Mobile Detection Hook
 * Use this to conditionally render components based on device size
 * 
 * Usage:
 * const isMobile = useIsMobile();
 * return isMobile ? <MobileComponent /> : <DesktopComponent />;
 */

"use client";

import { useState, useEffect } from 'react';

/**
 * Debounce function to limit how often a function is called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 150) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Hook to detect if current device is mobile
 * @param {number} breakpoint - Width in pixels to consider mobile (default: 768)
 * @returns {boolean} true if window width is less than breakpoint
 */
export function useIsMobile(breakpoint = 768) {
  // Start with false to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return;

    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Set initial value
    checkMobile();

    // Debounced resize handler to avoid excessive updates
    const debouncedResize = debounce(checkMobile, 150);

    // Listen for window resize
    window.addEventListener('resize', debouncedResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to get current window size
 * Useful for more complex responsive logic
 * @returns {{ width: number, height: number, isMobile: boolean, isTablet: boolean, isDesktop: boolean }}
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // Set initial size
    handleResize();

    // Debounced resize handler
    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener('resize', debouncedResize);

    return () => window.removeEventListener('resize', debouncedResize);
  }, []);

  return windowSize;
}

/**
 * Hook to detect user's preference for reduced motion
 * Use this to disable animations for users who prefer less motion
 * @returns {boolean} true if user prefers reduced motion
 */
export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if media query is supported
    if (!window.matchMedia) {
      setPrefersReducedMotion(false);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to detect if animations should be enabled
 * Combines mobile detection and reduced motion preference
 * @param {boolean} forceDisableOnMobile - Disable animations on mobile regardless of preference
 * @returns {boolean} true if animations should be enabled
 */
export function useShouldAnimate(forceDisableOnMobile = true) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Disable animations if:
  // 1. User prefers reduced motion, OR
  // 2. On mobile and forceDisableOnMobile is true
  return !prefersReducedMotion && !(forceDisableOnMobile && isMobile);
}

export default useIsMobile;
