// hooks/useTheme.js - Centralized theme configuration hook
import { useMemo } from 'react';
import { useUI } from '../contexts/UniShareContext';

export const useProfileTheme = () => {
  const { darkMode } = useUI();

  return useMemo(() => ({
    // Background themes
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    cardSecondary: darkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl',
    cardTertiary: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    
    // Border themes
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    borderLight: darkMode ? 'border-gray-700/50' : 'border-white/20',
    borderDark: darkMode ? 'border-gray-600' : 'border-gray-300',
    
    // Text themes
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-700',
    textLight: darkMode ? 'text-gray-500' : 'text-gray-500',
    
    // Interactive elements
    hover: darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    hoverSecondary: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50',
    focus: 'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
    
    // Form elements
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    inputFocus: darkMode ? 'border-gray-500' : 'border-gray-400',
    
    // Special elements
    profileImageBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    buttonBorder: darkMode ? 'border-gray-800' : 'border-white',
    loadingSkeleton: darkMode ? 'bg-gray-700' : 'bg-gray-200',
    
    // Status colors (maintain accessibility)
    errorBg: darkMode ? 'bg-red-900/20' : 'bg-red-100',
    errorBorder: darkMode ? 'border-red-800' : 'border-red-200',
    errorText: darkMode ? 'text-red-400' : 'text-red-700',
    successBg: darkMode ? 'bg-green-900/20' : 'bg-green-100',
    successBorder: darkMode ? 'border-green-800' : 'border-green-200',
    successText: darkMode ? 'text-green-400' : 'text-green-700',
    warningBg: darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100',
    warningBorder: darkMode ? 'border-yellow-800' : 'border-yellow-200',
    warningText: darkMode ? 'text-yellow-400' : 'text-yellow-700',
    
    // Utility
    shadow: darkMode ? 'shadow-gray-900/25' : 'shadow-gray-200/25',
    shadowLg: darkMode ? 'shadow-lg shadow-gray-900/25' : 'shadow-lg shadow-gray-200/25',
  }), [darkMode]);
};