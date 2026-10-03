/**
 * Performance Utilities
 * Debounce, throttle, and optimization helpers
 */

/**
 * Throttle function - Limits function calls to once per interval
 * @param {Function} func - Function to throttle
 * @param {number} delay - Minimum time between calls (ms)
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

/**
 * Debounce function - Delays function execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
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
 * RAF throttle - Uses requestAnimationFrame for optimal performance
 * @param {Function} func - Function to throttle
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(func) {
  let rafId = null;
  let lastArgs = null;

  return function (...args) {
    lastArgs = args;
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      func(...lastArgs);
      rafId = null;
    });
  };
}

/**
 * Detect if device is low-performance
 * @returns {boolean} True if device is low-performance
 */
export function isLowPerformanceDevice() {
  if (typeof navigator === 'undefined') return false;
  
  const deviceMemory = navigator.deviceMemory || 8;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  
  return isMobile || deviceMemory <= 4 || hardwareConcurrency <= 2;
}

/**
 * Get optimal blur value based on device capability
 * @param {boolean} isMobile - Is mobile device
 * @param {boolean} isLowPerf - Is low performance device
 * @returns {string} Blur CSS value
 */
export function getOptimalBlur(isMobile, isLowPerf) {
  if (isMobile) return 'blur(8px)';
  if (isLowPerf) return 'blur(12px)';
  return 'blur(16px)';
}

/**
 * Batch state updates into a single render
 * @param {Function[]} updates - Array of state update functions
 */
export function batchUpdates(updates) {
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}
