"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from "react";
import { checkAuthStatus, logout as apiLogout } from "../api";

// =============================================================================
// CONTEXT DEFINITION
// =============================================================================

const UniShareContext = createContext(null);

// =============================================================================
// ACTION TYPES
// =============================================================================

const ActionTypes = {
  // Loading states
  SET_LOADING: 'SET_LOADING',
  SET_AUTH_LOADING: 'SET_AUTH_LOADING',
  SET_LOGO_ROTATION: 'SET_LOGO_ROTATION',
  
  // Authentication
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  
  // UI State
  SET_DARK_MODE: 'SET_DARK_MODE',
  SET_MOBILE_MENU: 'SET_MOBILE_MENU',
  
  // Notifications
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  MARK_ALL_NOTIFICATIONS_READ: 'MARK_ALL_NOTIFICATIONS_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  
  // Error handling
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Success messages
  SET_SUCCESS: 'SET_SUCCESS',
  CLEAR_SUCCESS: 'CLEAR_SUCCESS',
  
  // Search
  SET_SEARCH_VALUE: 'SET_SEARCH_VALUE',
  SET_SEARCH_FOCUSED: 'SET_SEARCH_FOCUSED',
  
  // Navigation Loading
  SET_NAVIGATION_LOADING: 'SET_NAVIGATION_LOADING',
  SET_NAVIGATION_MESSAGE: 'SET_NAVIGATION_MESSAGE',
  
  // Initial App Loading
  SET_INITIAL_LOADING: 'SET_INITIAL_LOADING',
  SET_INITIAL_MESSAGE: 'SET_INITIAL_MESSAGE',
  SET_APP_READY: 'SET_APP_READY',
  
  // Profile data
  SET_USER_ROOMS: 'SET_USER_ROOMS',
  SET_USER_ITEMS: 'SET_USER_ITEMS',
  UPDATE_USER_ROOMS: 'UPDATE_USER_ROOMS',
  UPDATE_USER_ITEMS: 'UPDATE_USER_ITEMS',
  REMOVE_USER_ROOM: 'REMOVE_USER_ROOM',
  REMOVE_USER_ITEM: 'REMOVE_USER_ITEM',
  UPDATE_SINGLE_USER_ROOM: 'UPDATE_SINGLE_USER_ROOM',
  UPDATE_SINGLE_USER_ITEM: 'UPDATE_SINGLE_USER_ITEM',
  
  // Toggle actions
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  TOGGLE_MOBILE_MENU: 'TOGGLE_MOBILE_MENU',
  
  // App initialization
  INITIALIZE_APP: 'INITIALIZE_APP',
};

// =============================================================================
// INITIAL STATE
// =============================================================================

const initialState = {
  // Authentication
  isAuthenticated: false,
  user: null,
  authLoading: true,
  logoRotation: 0,

  // UI State
  darkMode: true,
  mobileMenuOpen: false,
  searchValue: '',
  searchFocused: false,
  
  // Navigation Loading
  navigationLoading: false,
  navigationMessage: 'Loading...',
  
  // Initial App Loading
  initialLoading: true,
  initialMessage: 'Initializing UniShare...',
  appReady: false,
  
  // Notifications
  notifications: [
    { 
      id: '1', 
      title: 'Welcome to UniShare', 
      body: 'Thanks for joining! Explore rides, marketplace, housing and more.', 
      time: 'Just now', 
      type: 'announcement', 
      read: false 
    },
    { 
      id: '2', 
      title: 'New message', 
      body: 'Alex: "Hey! Are you still selling the calculator?"', 
      time: '5m', 
      type: 'message', 
      read: false 
    },
    { 
      id: '3', 
      title: 'Safety tip', 
      body: 'Meet in public places for trades. Keep it safe ✨', 
      time: '1h', 
      type: 'info', 
      read: true 
    },
  ],
  
  // Global loading and messages
  loading: false,
  error: null,
  success: null,
  
  // User data
  userRooms: [],
  userItems: [],
  
  // App state
  initialized: false,
};

// =============================================================================
// REDUCER
// =============================================================================

const uniShareReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
      
    case ActionTypes.SET_AUTH_LOADING:
      return { ...state, authLoading: action.payload };
      
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        authLoading: false,
        error: null,
      };
    case ActionTypes.SET_LOGO_ROTATION:
      return { ...state, logoRotation: action.payload };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        userRooms: [],
        userItems: [],
        authLoading: false,
      };
      
    case ActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
      
    case ActionTypes.SET_DARK_MODE:
      return { ...state, darkMode: action.payload };
    
    case ActionTypes.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
      
    case ActionTypes.SET_MOBILE_MENU:
      return { ...state, mobileMenuOpen: action.payload };
    
    case ActionTypes.TOGGLE_MOBILE_MENU:
      return { ...state, mobileMenuOpen: !state.mobileMenuOpen };
      
    case ActionTypes.SET_NOTIFICATIONS:
      return { ...state, notifications: Array.isArray(action.payload) ? action.payload : [] };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
      
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
      
    case ActionTypes.MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notif => ({ ...notif, read: true })),
      };
      
    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload),
      };
      
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, success: null };
      
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
      
    case ActionTypes.SET_SUCCESS:
      return { ...state, success: action.payload, error: null };
      
    case ActionTypes.CLEAR_SUCCESS:
      return { ...state, success: null };
      
    case ActionTypes.SET_SEARCH_VALUE:
      return { ...state, searchValue: action.payload };
      
    case ActionTypes.SET_SEARCH_FOCUSED:
      return { ...state, searchFocused: action.payload };
      
    case ActionTypes.SET_NAVIGATION_LOADING:
      return { ...state, navigationLoading: action.payload };
      
    case ActionTypes.SET_NAVIGATION_MESSAGE:
      return { ...state, navigationMessage: action.payload };
      
    case ActionTypes.SET_INITIAL_LOADING:
      return { ...state, initialLoading: action.payload };
      
    case ActionTypes.SET_INITIAL_MESSAGE:
      return { ...state, initialMessage: action.payload };
      
    case ActionTypes.SET_APP_READY:
      return { ...state, appReady: action.payload };
      
    case ActionTypes.SET_USER_ROOMS:
      return { ...state, userRooms: action.payload };
      
    case ActionTypes.SET_USER_ITEMS:
      return { ...state, userItems: action.payload };
      
    case ActionTypes.UPDATE_USER_ROOMS:
      return { ...state, userRooms: [...state.userRooms, action.payload] };
      
    case ActionTypes.UPDATE_USER_ITEMS:
      return { ...state, userItems: [...state.userItems, action.payload] };
    
    case ActionTypes.REMOVE_USER_ROOM:
      return { ...state, userRooms: state.userRooms.filter(room => room.id !== action.payload) };
    
    case ActionTypes.REMOVE_USER_ITEM:
      return { ...state, userItems: state.userItems.filter(item => item.id !== action.payload) };
    
    case ActionTypes.UPDATE_SINGLE_USER_ROOM:
      return {
        ...state,
        userRooms: state.userRooms.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload.data } : room
        ),
      };
    
    case ActionTypes.UPDATE_SINGLE_USER_ITEM:
      return {
        ...state,
        userItems: state.userItems.map(item =>
          item.id === action.payload.id ? { ...item, ...action.payload.data } : item
        ),
      };
      
    case ActionTypes.INITIALIZE_APP:
      return { ...state, initialized: true, authLoading: false };
      
    default:
      return state;
  }
};

// =============================================================================
// THEME UTILITY COMPONENTS
// =============================================================================

export const ThemeProvider = ({ children, className = "" }) => {
  const { darkMode } = useUI();
  
  return (
    <div className={`transition-colors duration-200 ${
      darkMode
        ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-blue-50"
        : "bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 text-gray-900"
    } ${className}`} style={{ willChange: 'background-color, color' }}>
      {children}
    </div>
  );
};

export const ThemeCard = ({ children, className = "", hover = true, variant = "default" }) => {
  const { darkMode } = useUI();
  
  const variants = {
    default: darkMode 
      ? `bg-slate-800/90 border-slate-700 text-blue-50 ${hover ? 'hover:border-blue-600 hover:bg-slate-800' : ''}` 
      : `bg-white border-orange-200 text-gray-900 ${hover ? 'hover:border-orange-300 hover:shadow-lg' : ''}`,
    glass: darkMode 
      ? `bg-slate-900/50 backdrop-blur-sm border-blue-800/50 text-blue-50 ${hover ? 'hover:border-blue-600 hover:bg-slate-900/70' : ''}` 
      : `bg-white/70 backdrop-blur-sm border-orange-300/50 text-gray-900 ${hover ? 'hover:border-orange-400 hover:shadow-xl' : ''}`,
    elevated: darkMode 
      ? `bg-slate-800 border-slate-600 text-blue-50 shadow-xl shadow-blue-900/20 ${hover ? 'hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/30' : ''}` 
      : `bg-white border-orange-200 text-gray-900 shadow-xl shadow-orange-200/30 ${hover ? 'hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-300/40' : ''}`
  };
  
  return (
    <div className={`transition-colors duration-150 ${variants[variant]} ${className}`} style={{ willChange: 'background-color, border-color' }}>
      {children}
    </div>
  );
};

export const ThemeButton = ({ 
  children, 
  variant = "primary", 
  size = "default",
  className = "", 
  ...props 
}) => {
  const { darkMode } = useUI();
  
  const variants = {
    primary: darkMode 
      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 focus:ring-blue-500/30" 
      : "bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-500 hover:to-orange-600 focus:ring-orange-500/30",
    secondary: darkMode 
      ? "bg-slate-700 text-blue-100 border-slate-600 hover:bg-slate-600 hover:border-slate-500 focus:ring-slate-500/30" 
      : "bg-white text-gray-900 border-orange-300 hover:bg-orange-50 hover:border-orange-400 focus:ring-orange-500/30",
    ghost: darkMode 
      ? "text-blue-200 hover:bg-slate-800 hover:text-blue-100 focus:ring-blue-500/30" 
      : "text-gray-600 hover:bg-orange-100 hover:text-gray-900 focus:ring-orange-500/30",
    danger: darkMode 
      ? "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/30" 
      : "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/30",
    success: darkMode 
      ? "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500/30" 
      : "bg-emerald-600 text-white hover:bg-emerald-500 focus:ring-emerald-500/30"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm",
    default: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl"
  };
  
  return (
    <button 
      className={`transition-all duration-150 transform hover:scale-105 active:scale-95 rounded-xl font-medium focus:outline-none focus:ring-2 ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ willChange: 'transform, background-color' }}
      {...props}
    >
      {children}
    </button>
  );
};

export const ThemeInput = ({ className = "", variant = "default", ...props }) => {
  const { darkMode } = useUI();
  
  const variants = {
    default: darkMode 
      ? "bg-slate-800 text-blue-50 border-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30" 
      : "bg-white text-gray-900 border-orange-300 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/30",
    filled: darkMode 
      ? "bg-slate-700 text-blue-50 border-slate-600 placeholder-slate-300 focus:border-blue-500 focus:ring-blue-500/30" 
      : "bg-orange-50 text-gray-900 border-orange-200 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/30"
  };
  
  return (
    <input 
      className={`transition-colors duration-150 rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 ${variants[variant]} ${className}`}
      style={{ willChange: 'border-color, background-color' }}
      {...props}
    />
  );
};

export const ThemeSelect = ({ children, className = "", ...props }) => {
  const { darkMode } = useUI();
  
  return (
    <select 
      className={`transition-colors duration-150 rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 ${
        darkMode 
          ? "bg-slate-800 text-blue-50 border-slate-700 focus:border-blue-500 focus:ring-blue-500/30" 
          : "bg-white text-gray-900 border-orange-300 focus:border-orange-500 focus:ring-orange-500/30"
      } ${className}`}
      style={{ willChange: 'border-color, background-color' }}
      {...props}
    >
      {children}
    </select>
  );
};

export const ThemeTextarea = ({ className = "", ...props }) => {
  const { darkMode } = useUI();
  
  return (
    <textarea 
      className={`transition-colors duration-150 rounded-xl px-4 py-2 border focus:outline-none focus:ring-2 resize-none ${
        darkMode 
          ? "bg-slate-800 text-blue-50 border-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/30" 
          : "bg-white text-gray-900 border-orange-300 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500/30"
      } ${className}`}
      style={{ willChange: 'border-color, background-color' }}
      {...props}
    />
  );
};

// =============================================================================
// CONTEXT PROVIDER
// =============================================================================

export const UniShareProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uniShareReducer, initialState);
  
  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('unishare_dark_mode');
    if (savedDarkMode !== null) {
      dispatch({ type: ActionTypes.SET_DARK_MODE, payload: JSON.parse(savedDarkMode) });
    }
  }, []);
  
  // Save dark mode to localStorage and manage body classes
  useEffect(() => {
    localStorage.setItem('unishare_dark_mode', JSON.stringify(state.darkMode));
    
    // ✅ PERFORMANCE: Use RAF to batch DOM updates and prevent layout thrashing
    requestAnimationFrame(() => {
      const body = document.body;
      const html = document.documentElement;
      
      // Batch class and attribute updates
      if (state.darkMode) {
        // Dark mode - Matte Black Charcoal theme
        body.className = body.className.replace(/light|theme-warm/g, '').trim() + ' dark theme-ocean';
        html.setAttribute('data-theme', 'dark');
        
        // Use CSS custom properties for instant theme switching
        html.style.setProperty('--theme-bg', '#1a1a1a');
        html.style.setProperty('--theme-text', '#FFFFFF');
      } else {
        // Light mode - Warm Orange theme
        body.className = body.className.replace(/dark|theme-ocean/g, '').trim() + ' light theme-warm';
        html.setAttribute('data-theme', 'light');
        
        // Use CSS custom properties for instant theme switching
        html.style.setProperty('--theme-bg', '#F9FAFB');
        html.style.setProperty('--theme-text', '#1f2937');
      }
    });
  }, [state.darkMode]);
  
  // Initialize app with loading sequence
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if this is first visit in this browser session
        const hasSeenLoader = sessionStorage.getItem('uniShareLoaderShown');
        
        if (!hasSeenLoader) {
          // Show loader for first time in this session
          // Ensure the loader state is set correctly
          dispatch({ type: ActionTypes.SET_INITIAL_LOADING, payload: true });
          dispatch({ type: ActionTypes.SET_APP_READY, payload: false });
          
          // Don't proceed with auth until loader is ready
          // The loader component will handle setting sessionStorage and calling setAppReady
          dispatch({ type: ActionTypes.SET_AUTH_LOADING, payload: true });
          
          // Do auth in background but don't finalize until loader is done
          const { authenticated, user } = await checkAuthStatus();
          
          if (authenticated && user) {
            dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
          } else {
            dispatch({ type: ActionTypes.LOGOUT });
          }
          
          // Don't call INITIALIZE_APP yet - let the loader component handle it
          return;
        } else {
          // Skip loader, go directly to app ready state
          dispatch({ type: ActionTypes.SET_INITIAL_LOADING, payload: false });
          dispatch({ type: ActionTypes.SET_APP_READY, payload: true });
        }
        
        dispatch({ type: ActionTypes.SET_AUTH_LOADING, payload: true });
        
        const { authenticated, user } = await checkAuthStatus();
        
        if (authenticated && user) {
          dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: user });
        } else {
          dispatch({ type: ActionTypes.LOGOUT });
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        dispatch({ type: ActionTypes.LOGOUT });
      } finally {
        // Only finalize if we're not showing the loader
        const hasSeenLoader = sessionStorage.getItem('uniShareLoaderShown');
        if (hasSeenLoader) {
          dispatch({ type: ActionTypes.INITIALIZE_APP });
        }
      }
    };
    
    initializeApp();
  }, []);

  // Load notifications when user is authenticated
  useEffect(() => {
    const loadUserNotifications = async () => {
      if (state.isAuthenticated && state.user && !state.authLoading) {
        try {
          const { getUserNotifications } = await import('../api/notifications');
          const response = await getUserNotifications();
          const notifications = response.notifications || response.data || [];
          dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
        } catch (error) {
          console.error('Failed to load notifications:', error);
          dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: [] });
        }
      }
    };

    loadUserNotifications();
  }, [state.isAuthenticated, state.user, state.authLoading]);
  
  // =============================================================================
  // ACTION CREATORS
  // =============================================================================
  
  const actions = useMemo(() => ({
    // Authentication actions
    login: (userData) => {
      dispatch({ type: ActionTypes.LOGIN_SUCCESS, payload: userData });
    },

    setLogoRotation: (rotation) => {
      dispatch({ type: ActionTypes.SET_LOGO_ROTATION, payload: rotation });
    },

    logout: async () => {
      try {
        await apiLogout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        dispatch({ type: ActionTypes.LOGOUT });
      }
    },
    
    updateUser: (userData) => {
      dispatch({ type: ActionTypes.UPDATE_USER, payload: userData });
    },
    
    // UI actions
    setDarkMode: (isDark) => {
      dispatch({ type: ActionTypes.SET_DARK_MODE, payload: isDark });
    },
    
    setMobileMenu: (isOpen) => {
      dispatch({ type: ActionTypes.SET_MOBILE_MENU, payload: isOpen });
    },
    
    // Search actions
    setSearchValue: (value) => {
      dispatch({ type: ActionTypes.SET_SEARCH_VALUE, payload: value });
    },
    
    setSearchFocused: (focused) => {
      dispatch({ type: ActionTypes.SET_SEARCH_FOCUSED, payload: focused });
    },
    
    // Notification actions
    addNotification: (notification) => {
      const newNotification = {
        id: Date.now().toString(),
        time: 'Just now',
        read: false,
        ...notification,
      };
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: newNotification });
    },
    
    markNotificationRead: (id) => {
      dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: id });
    },
    
    markAllNotificationsRead: () => {
      dispatch({ type: ActionTypes.MARK_ALL_NOTIFICATIONS_READ });
    },
    
    removeNotification: (id) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: id });
    },
    
    setNotifications: (notifications) => {
      dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
    },
    
    // Message actions
    setError: (error) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },
    
    setSuccess: (message) => {
      dispatch({ type: ActionTypes.SET_SUCCESS, payload: message });
    },
    
    clearSuccess: () => {
      dispatch({ type: ActionTypes.CLEAR_SUCCESS });
    },
    
    showTemporaryMessage: (message, isSuccess = true, duration = 3000) => {
      if (isSuccess) {
        dispatch({ type: ActionTypes.SET_SUCCESS, payload: message });
        setTimeout(() => {
          dispatch({ type: ActionTypes.CLEAR_SUCCESS });
        }, duration);
      } else {
        dispatch({ type: ActionTypes.SET_ERROR, payload: message });
        setTimeout(() => {
          dispatch({ type: ActionTypes.CLEAR_ERROR });
        }, duration);
      }
    },
    
    // Loading actions
    setLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
    },
    
    // Navigation Loading actions
    setNavigationLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: loading });
    },
    
    setNavigationMessage: (message) => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
    },
    
    startNavigationLoading: (message = 'Loading...') => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: true });
    },
    
    stopNavigationLoading: () => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: false });
    },
    
    // Enhanced loading helpers
    showFormLoading: (message = 'Processing...') => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: true });
    },
    
    showApiLoading: (message = 'Connecting to server...') => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: true });
    },
    
    showUploadLoading: (message = 'Uploading files...') => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: true });
    },
    
    showAuthLoading: (message = 'Authenticating...') => {
      dispatch({ type: ActionTypes.SET_NAVIGATION_MESSAGE, payload: message });
      dispatch({ type: ActionTypes.SET_NAVIGATION_LOADING, payload: true });
    },
    
    // Initial App Loading actions
    setInitialLoading: (loading) => {
      dispatch({ type: ActionTypes.SET_INITIAL_LOADING, payload: loading });
    },
    
    setInitialMessage: (message) => {
      dispatch({ type: ActionTypes.SET_INITIAL_MESSAGE, payload: message });
    },
    
    setAppReady: () => {
      dispatch({ type: ActionTypes.SET_INITIAL_LOADING, payload: false });
      dispatch({ type: ActionTypes.SET_APP_READY, payload: true });
    },
    
    startInitialLoading: () => {
      dispatch({ type: ActionTypes.SET_INITIAL_LOADING, payload: true });
      dispatch({ type: ActionTypes.SET_APP_READY, payload: false });
    },
    
    // User data actions
    setUserRooms: (rooms) => {
      dispatch({ type: ActionTypes.SET_USER_ROOMS, payload: rooms });
    },
    
    setUserItems: (items) => {
      dispatch({ type: ActionTypes.SET_USER_ITEMS, payload: items });
    },
    
    addUserRoom: (room) => {
      dispatch({ type: ActionTypes.UPDATE_USER_ROOMS, payload: room });
    },
    
    addUserItem: (item) => {
      dispatch({ type: ActionTypes.UPDATE_USER_ITEMS, payload: item });
    },
    
    removeUserRoom: (roomId) => {
      dispatch({ type: ActionTypes.REMOVE_USER_ROOM, payload: roomId });
    },
    
    removeUserItem: (itemId) => {
      dispatch({ type: ActionTypes.REMOVE_USER_ITEM, payload: itemId });
    },
    
    updateUserRoom: (roomId, updatedRoom) => {
      dispatch({ type: ActionTypes.UPDATE_SINGLE_USER_ROOM, payload: { id: roomId, data: updatedRoom } });
    },
    
    updateUserItem: (itemId, updatedItem) => {
      dispatch({ type: ActionTypes.UPDATE_SINGLE_USER_ITEM, payload: { id: itemId, data: updatedItem } });
    },
    
    toggleDarkMode: () => {
      dispatch({ type: ActionTypes.TOGGLE_DARK_MODE });
    },
    
    toggleMobileMenu: () => {
      dispatch({ type: ActionTypes.TOGGLE_MOBILE_MENU });
    },
  }), [dispatch]);

  // Load notifications (needs state access, so separate useCallback)
  const loadNotifications = useCallback(async () => {
    if (state.isAuthenticated && state.user) {
      try {
        const { getUserNotifications } = await import('../api/notifications');
        const response = await getUserNotifications();
        const notifications = response.notifications || response.data || [];
        dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications });
      } catch (error) {
        console.error('Failed to load notifications:', error);
        dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: [] });
      }
    }
  }, [state.isAuthenticated, state.user, dispatch]);
  
  // =============================================================================
  // COMPUTED VALUES
  // =============================================================================
  
  const computedValues = useMemo(() => ({
    unreadNotificationCount: (Array.isArray(state.notifications) ? state.notifications : []).filter(n => !n.read).length,
    hasUnreadNotifications: (Array.isArray(state.notifications) ? state.notifications : []).some(n => !n.read),
    userInitials: state.user?.name 
      ? state.user.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
      : 'U',
    userAvatar: state.user?.picture || state.user?.googleAvatar || state.user?.avatar || null,
    totalUserRooms: state.userRooms.length,
    totalUserItems: state.userItems.length,
  }), [state.notifications, state.user, state.userRooms, state.userItems]);
  
  const contextValue = useMemo(() => ({
    // State
    ...state,
    // Actions
    ...actions,
    // Computed values
    ...computedValues,
    // Separate memoized action
    loadNotifications,
  }), [state, actions, computedValues, loadNotifications]);
  
  return (
    <UniShareContext.Provider value={contextValue}>
      {children}
    </UniShareContext.Provider>
  );
};

// =============================================================================
// CUSTOM HOOK
// =============================================================================

export const useUniShare = () => {
  const context = useContext(UniShareContext);
  
  if (!context) {
    throw new Error('useUniShare must be used within a UniShareProvider');
  }
  
  return context;
};

// =============================================================================
// HIGHER-ORDER COMPONENT FOR AUTHENTICATION
// =============================================================================

export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, authLoading, darkMode } = useUniShare();
    
    if (authLoading) {
      return (
        <div className={`flex items-center justify-center min-h-screen transition-all duration-500 ${
          darkMode 
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900" 
            : "bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300"
        }`}>
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            darkMode ? "border-blue-400" : "border-orange-600"
          }`}></div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      return (
        <div className={`flex items-center justify-center min-h-screen transition-all duration-500 ${
          darkMode 
            ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-blue-50" 
            : "bg-gradient-to-br from-orange-100 via-orange-200 to-orange-300 text-gray-900"
        }`}>
          <ThemeCard className="p-8 text-center max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className={`mb-6 ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
              Please log in to access this page.
            </p>
            <ThemeButton 
              onClick={() => window.location.href = '/login'}
              className="w-full"
            >
              Go to Login
            </ThemeButton>
          </ThemeCard>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

export const useAuth = () => {
  const context = useUniShare();
  return useMemo(() => ({
    isAuthenticated: context.isAuthenticated,
    user: context.user,
    authLoading: context.authLoading,
    login: context.login,
    logout: context.logout,
    updateUser: context.updateUser,
    userInitials: context.userInitials,
    userAvatar: context.userAvatar,
  }), [context.isAuthenticated, context.user, context.authLoading, context.login, context.logout, context.updateUser, context.userInitials, context.userAvatar]);
};

export const useNotifications = () => {
  const context = useUniShare();
  return useMemo(() => ({
    notifications: context.notifications,
    unreadCount: context.unreadNotificationCount,
    hasUnread: context.hasUnreadNotifications,
    addNotification: context.addNotification,
    markNotificationRead: context.markNotificationRead,
    markAllNotificationsRead: context.markAllNotificationsRead,
    removeNotification: context.removeNotification,
    setNotifications: context.setNotifications,
    loadNotifications: context.loadNotifications,
  }), [context.notifications, context.unreadNotificationCount, context.hasUnreadNotifications, context.addNotification, context.markNotificationRead, context.markAllNotificationsRead, context.removeNotification, context.setNotifications, context.loadNotifications]);
};

export const useUI = () => {
  const context = useUniShare();
  return useMemo(() => ({
    darkMode: context.darkMode,
    mobileMenuOpen: context.mobileMenuOpen,
    searchValue: context.searchValue,
    searchFocused: context.searchFocused,
    logoRotation: context.logoRotation,
    navigationLoading: context.navigationLoading,
    navigationMessage: context.navigationMessage,
    initialLoading: context.initialLoading,
    initialMessage: context.initialMessage,
    appReady: context.appReady,
    setDarkMode: context.setDarkMode,
    toggleDarkMode: context.toggleDarkMode,
    setMobileMenu: context.setMobileMenu,
    toggleMobileMenu: context.toggleMobileMenu,
    setSearchValue: context.setSearchValue,
    setSearchFocused: context.setSearchFocused,
    setLogoRotation: context.setLogoRotation,
    setNavigationLoading: context.setNavigationLoading,
    setNavigationMessage: context.setNavigationMessage,
    startNavigationLoading: context.startNavigationLoading,
    stopNavigationLoading: context.stopNavigationLoading,
    showFormLoading: context.showFormLoading,
    showApiLoading: context.showApiLoading,
    showUploadLoading: context.showUploadLoading,
    showAuthLoading: context.showAuthLoading,
    setInitialLoading: context.setInitialLoading,
    setInitialMessage: context.setInitialMessage,
    setAppReady: context.setAppReady,
    startInitialLoading: context.startInitialLoading,
  }), [context.darkMode, context.mobileMenuOpen, context.searchValue, context.searchFocused, context.logoRotation, context.navigationLoading, context.navigationMessage, context.initialLoading, context.initialMessage, context.appReady, context.setDarkMode, context.toggleDarkMode, context.setMobileMenu, context.toggleMobileMenu, context.setSearchValue, context.setSearchFocused, context.setLogoRotation, context.setNavigationLoading, context.setNavigationMessage, context.startNavigationLoading, context.stopNavigationLoading, context.showFormLoading, context.showApiLoading, context.showUploadLoading, context.showAuthLoading, context.setInitialLoading, context.setInitialMessage, context.setAppReady, context.startInitialLoading]);
};

export const useMessages = () => {
  const context = useUniShare();
  return useMemo(() => ({
    error: context.error,
    success: context.success,
    loading: context.loading,
    setError: context.setError,
    clearError: context.clearError,
    setSuccess: context.setSuccess,
    clearSuccess: context.clearSuccess,
    showTemporaryMessage: context.showTemporaryMessage,
    setLoading: context.setLoading,
  }), [context.error, context.success, context.loading, context.setError, context.clearError, context.setSuccess, context.clearSuccess, context.showTemporaryMessage, context.setLoading]);
};

export const useUserData = () => {
  const context = useUniShare();
  return useMemo(() => ({
    userRooms: context.userRooms,
    userItems: context.userItems,
    totalUserRooms: context.totalUserRooms,
    totalUserItems: context.totalUserItems,
    setUserRooms: context.setUserRooms,
    setUserItems: context.setUserItems,
    addUserRoom: context.addUserRoom,
    addUserItem: context.addUserItem,
    removeUserRoom: context.removeUserRoom,
    removeUserItem: context.removeUserItem,
    updateUserRoom: context.updateUserRoom,
    updateUserItem: context.updateUserItem,
  }), [context.userRooms, context.userItems, context.totalUserRooms, context.totalUserItems, context.setUserRooms, context.setUserItems, context.addUserRoom, context.addUserItem, context.removeUserRoom, context.removeUserItem, context.updateUserRoom, context.updateUserItem]);
};
