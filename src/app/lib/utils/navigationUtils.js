// utils/navigationUtils.js
"use client";

import { useUI } from '../contexts/UniShareContext';

// Custom hook for triggering navigation loading in components
export const useNavigationLoading = () => {
  const { startNavigationLoading, stopNavigationLoading, navigationLoading } = useUI();

  const showLoading = (message = 'Loading...', duration = 2000) => {
    startNavigationLoading(message);
    
    if (duration > 0) {
      setTimeout(() => {
        stopNavigationLoading();
      }, duration);
    }
  };

  return {
    showLoading,
    hideLoading: stopNavigationLoading,
    isLoading: navigationLoading
  };
};

// Utility function to trigger loading for async operations
export const withNavigationLoading = async (asyncFunction, message = 'Loading...') => {
  const { startNavigationLoading, stopNavigationLoading } = useUI();
  
  try {
    startNavigationLoading(message);
    const result = await asyncFunction();
    return result;
  } catch (error) {
    throw error;
  } finally {
    stopNavigationLoading();
  }
};