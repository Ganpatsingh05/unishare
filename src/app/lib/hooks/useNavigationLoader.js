// hooks/useNavigationLoader.js
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Routes that should NOT use the custom navigation loader
// These will use their existing custom GIF loaders
const EXCLUDED_ROUTES = [
  '/share-ride',
  '/housing', 
  '/marketplace',
  '/ticket',
  '/lost-found',
  '/announcements',
  '/contacts',
  '/resources'
];

// Check if route should be excluded from custom navigation loader
const shouldExcludeRoute = (pathname) => {
  if (!pathname) return false;
  
  return EXCLUDED_ROUTES.some(route => {
    // Exact match or starts with route path
    return pathname === route || pathname.startsWith(route + '/');
  });
};

export const useNavigationLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading...');
  const pathname = usePathname();

  // Start loading
  const startLoading = (message = 'Loading...') => {
    // Don't show navigation loader for excluded routes
    if (shouldExcludeRoute(pathname)) {
      return;
    }
    
    setLoadingMessage(message);
    setIsLoading(true);
  };

  // Stop loading
  const stopLoading = () => {
    setIsLoading(false);
  };

  // Auto-stop loading after route changes (safety net)
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000); // Auto-stop after 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [isLoading, pathname]);

  return {
    isLoading: isLoading && !shouldExcludeRoute(pathname),
    loadingMessage,
    startLoading,
    stopLoading,
    isExcludedRoute: shouldExcludeRoute(pathname)
  };
};