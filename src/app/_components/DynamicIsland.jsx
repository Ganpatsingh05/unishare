"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useUI } from '../lib/contexts/UniShareContext';
import { 
  CheckCircle, 
  XCircle, 
  Info, 
  AlertTriangle, 
  X, 
  LogIn, 
  LogOut,
  User, 
  Wifi, 
  WifiOff,
  Shield,
  Lock,
  Unlock,
  Bell,
  Settings,
  Download,
  Upload,
  Heart,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCheck,
  UserPlus,
  UserCheck,
  Package,
  ShoppingCart,
  Home,
  Search,
  FileText,
  AlertCircle
} from 'lucide-react';

// Wave Loading Component
const WaveLoading = ({ progress = 0, color = "from-white/40 to-white/60" }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <motion.div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${color}`}
        initial={{ height: "0%" }}
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Wave Animation */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-8"
          style={{
            background: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.1) 10px,
              rgba(255, 255, 255, 0.1) 20px
            )`
          }}
          animate={{
            x: [0, -20],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>
    </div>
  );
};

// Dynamic Island Notification System
const DynamicIsland = () => {
  const { darkMode } = useUI();
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showText, setShowText] = useState(false); // New state for text sliding
  const [currentNotification, setCurrentNotification] = useState(null);
  const [isIdle, setIsIdle] = useState(true);
  const [position, setPosition] = useState('center'); // left, center, right
  const [isDragging, setIsDragging] = useState(false);
  const longPressTimer = useRef(null);
  const dragX = useMotionValue(0);
  const opacity = useTransform(dragX, [-100, 0, 100], [0.5, 1, 0.5]);
  const animationInProgress = useRef(false);
  const MAX_QUEUE_SIZE = 10; // Prevent memory leak from too many notifications
  const hasShownWelcome = useRef(false);

  // Show welcome message on first visit
  useEffect(() => {
    // Check if this is the first visit
    const hasVisitedBefore = sessionStorage.getItem('uniShareVisited');
    
    if (!hasVisitedBefore && !hasShownWelcome.current) {
      hasShownWelcome.current = true;
      
      // Wait a brief moment for page to settle, then show welcome
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('dynamicIslandNotification', {
          detail: {
            type: 'home',
            title: 'Welcome to UniShare!',
            message: 'Connect and share with your campus community.',
            duration: 6000 // Show for 6 seconds on first visit
          }
        }));
        
        // Mark as visited
        sessionStorage.setItem('uniShareVisited', 'true');
      }, 1500); // 1.5 second delay after page load for smoother experience
    }
  }, []);

  // Auto-expand when notification appears
  useEffect(() => {
    if (notifications.length > 0 && !currentNotification && !animationInProgress.current) {
      console.log('🏝️ Starting animation', { notification: notifications[0], queueLength: notifications.length });
      animationInProgress.current = true;
      setCurrentNotification(notifications[0]);
      setIsIdle(false);
      setShowText(false);
      
      // Step 1: Show icon in circle first (400ms)
      const textTimer = setTimeout(() => {
        console.log('🏝️ Showing text');
        setShowText(true); // Text slides out from icon
      }, 400);
      
      // Step 2: Expand to full message immediately after text (200ms after text appears)
      const expandTimer = setTimeout(() => {
        console.log('🏝️ Expanding to full');
        setIsExpanded(true);
      }, 800); // 400ms icon + 400ms icon+text
      
      // Auto-collapse after 5 seconds of being expanded (5000ms)
      const duration = notifications[0].duration || 6000; // Default 5 seconds
      const collapseTimer = setTimeout(() => {
        console.log('🏝️ Collapsing');
        setIsExpanded(false);
        setShowText(false);
        
        // Contract to compact state
        const contractTimer = setTimeout(() => {
          setIsIdle(true);
          
          // Remove notification and show next one if exists
          const dismissTimer = setTimeout(() => {
            console.log('🏝️ Dismissed, next in queue:', notifications.length - 1);
            setCurrentNotification(null);
            setNotifications(prev => prev.slice(1));
            animationInProgress.current = false; // Reset flag to allow next notification
          }, 800);
        }, 400);
      }, duration + 800); // Total: 800ms animation + 5000ms display

      // Don't cleanup timers - let them run to completion
    }
  }, [notifications, currentNotification]);

  // Handle pointer events (disabled manual expansion)
  const handlePointerDown = () => {
    // Manual expansion disabled - auto-expands by itself
  };

  const handlePointerUp = () => {
    // Cleanup
  };

  // Handle swipe to dismiss
  // Handle swipe to dismiss
    const handleDragEnd = (event, info) => {
        const threshold = 100;
        if (Math.abs(info.offset.x) > threshold) {
            handleDismiss();
        }
    };


  // Listen for notification events
  useEffect(() => {
    const handleNotification = (event) => {
      const { 
        message, 
        type = 'info', 
        title,
        action,
        actionLabel,
        duration = 4000,
        persistent = false,
        showLoading = false,
        progress = 0
      } = event.detail;
      
      const id = Date.now() + Math.random();
      
      const newNotif = { 
        id, 
        message, 
        type, 
        title,
        action,
        actionLabel,
        duration,
        persistent,
        showLoading,
        progress,
        timestamp: new Date()
      };
      
      console.log('🏝️ New notification received:', { type, message, title });
      setNotifications(prev => {
        // Limit queue size to prevent memory leak
        const newQueue = [...prev, newNotif];
        if (newQueue.length > MAX_QUEUE_SIZE) {
          console.warn('🏝️ Queue limit reached, dropping oldest notification');
          const limited = newQueue.slice(-MAX_QUEUE_SIZE);
          console.log('🏝️ Queue size:', limited.length);
          return limited;
        }
        console.log('🏝️ Queue size:', newQueue.length);
        return newQueue;
      });
    };

    const handlePositionChange = (event) => {
      const { position } = event.detail;
      setPosition(position);
    };

    window.addEventListener('dynamicIslandNotification', handleNotification);
    window.addEventListener('dynamicIslandSetPosition', handlePositionChange);
    
    return () => {
      window.removeEventListener('dynamicIslandNotification', handleNotification);
      window.removeEventListener('dynamicIslandSetPosition', handlePositionChange);
    };
  }, []);

  const getIcon = (type) => {
    const iconMap = {
      success: CheckCircle,
      error: XCircle,
      warning: AlertTriangle,
      info: Info,
      auth: LogIn,
      login: LogIn,
      logout: LogOut,
      user: User,
      userplus: UserPlus,
      usercheck: UserCheck,
      network: Wifi,
      offline: WifiOff,
      security: Shield,
      locked: Lock,
      unlocked: Unlock,
      notification: Bell,
      settings: Settings,
      download: Download,
      upload: Upload,
      like: Heart,
      star: Star,
      message: MessageCircle,
      send: Send,
      request: Send,
      checkcheck: CheckCheck,
      package: Package,
      cart: ShoppingCart,
      home: Home,
      search: Search,
      file: FileText,
      alert: AlertCircle,
    };

    const IconComponent = iconMap[type] || Info;
    return <IconComponent className="w-3.5 h-3.5" />;
  };

  const getColors = (type) => {
    const colorMap = {
      success: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-500/20'
      },
      error: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-red-400' : 'text-red-600',
        iconBg: darkMode ? 'bg-red-500/20' : 'bg-red-500/20'
      },
      warning: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        iconBg: darkMode ? 'bg-yellow-500/20' : 'bg-yellow-500/20'
      },
      alert: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-orange-400' : 'text-orange-600',
        iconBg: darkMode ? 'bg-orange-500/20' : 'bg-orange-500/20'
      },
      auth: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      login: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      logout: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-gray-400' : 'text-gray-600',
        iconBg: darkMode ? 'bg-gray-500/20' : 'bg-gray-500/20'
      },
      user: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-purple-400' : 'text-purple-600',
        iconBg: darkMode ? 'bg-purple-500/20' : 'bg-purple-500/20'
      },
      userplus: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-500/20'
      },
      usercheck: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-500/20'
      },
      network: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-cyan-400' : 'text-cyan-600',
        iconBg: darkMode ? 'bg-cyan-500/20' : 'bg-cyan-500/20'
      },
      offline: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-gray-400' : 'text-gray-600',
        iconBg: darkMode ? 'bg-gray-500/20' : 'bg-gray-500/20'
      },
      security: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-indigo-400' : 'text-indigo-600',
        iconBg: darkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/20'
      },
      notification: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-pink-400' : 'text-pink-600',
        iconBg: darkMode ? 'bg-pink-500/20' : 'bg-pink-500/20'
      },
      like: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-pink-400' : 'text-pink-600',
        iconBg: darkMode ? 'bg-pink-500/20' : 'bg-pink-500/20'
      },
      star: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-yellow-400' : 'text-yellow-600',
        iconBg: darkMode ? 'bg-yellow-500/20' : 'bg-yellow-500/20'
      },
      message: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      send: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      request: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-orange-400' : 'text-orange-600',
        iconBg: darkMode ? 'bg-orange-500/20' : 'bg-orange-500/20'
      },
      download: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-500/20'
      },
      upload: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-400' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      package: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-amber-400' : 'text-amber-600',
        iconBg: darkMode ? 'bg-amber-500/20' : 'bg-amber-500/20'
      },
      cart: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-emerald-400' : 'text-emerald-600',
        iconBg: darkMode ? 'bg-emerald-500/20' : 'bg-emerald-500/20'
      },
      home: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-blue-500' : 'text-blue-600',
        iconBg: darkMode ? 'bg-blue-500/20' : 'bg-blue-500/20'
      },
      info: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-sky-400' : 'text-sky-600',
        iconBg: darkMode ? 'bg-sky-500/20' : 'bg-sky-500/20'
      },
      settings: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-slate-400' : 'text-slate-600',
        iconBg: darkMode ? 'bg-slate-500/20' : 'bg-slate-500/20'
      },
      search: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-violet-400' : 'text-violet-600',
        iconBg: darkMode ? 'bg-violet-500/20' : 'bg-violet-500/20'
      },
      file: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-indigo-400' : 'text-indigo-600',
        iconBg: darkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/20'
      },
      checkcheck: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-teal-400' : 'text-teal-600',
        iconBg: darkMode ? 'bg-teal-500/20' : 'bg-teal-500/20'
      },
      locked: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-red-400' : 'text-red-600',
        iconBg: darkMode ? 'bg-red-500/20' : 'bg-red-500/20'
      },
      unlocked: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-green-400' : 'text-green-600',
        iconBg: darkMode ? 'bg-green-500/20' : 'bg-green-500/20'
      },
      default: {
        bg: darkMode ? 'bg-black' : 'bg-white',
        ring: darkMode ? 'ring-white/10' : 'ring-black/10',
        text: darkMode ? 'text-white' : 'text-gray-900',
        iconColor: darkMode ? 'text-gray-400' : 'text-gray-600',
        iconBg: darkMode ? 'bg-gray-500/20' : 'bg-gray-500/20'
      }
    };

    return colorMap[type] || colorMap.default;
  };

  const handleAction = () => {
    if (currentNotification?.action) {
      currentNotification.action();
    }
    handleDismiss();
  };

  const handleDismiss = () => {
    setIsExpanded(false);
    setShowText(false);
    dragX.set(0);
    setTimeout(() => {
      setIsIdle(true);
      setTimeout(() => {
        setCurrentNotification(null);
        setNotifications(prev => prev.slice(1));
        animationInProgress.current = false; // Reset flag when manually dismissed
      }, 800);
    }, 400);
  };

  // Position classes based on selected position
  const getPositionClass = () => {
    switch (position) {
      case 'left':
        return 'left-4';
      case 'right':
        return 'right-4';
      default:
        return 'left-1/2 -translate-x-1/2';
    }
  };

  // Only show when there's a notification
  const colors = currentNotification ? getColors(currentNotification.type) : getColors('default');

  // Don't render anything if idle and no notification
  if (isIdle && !currentNotification) {
    return null;
  }

  return (
    <div 
      className={`fixed top-3 ${getPositionClass()} z-[9999] pointer-events-none`}
      style={{
        isolation: 'isolate',
        willChange: 'transform',
        position: 'fixed',
        top: '12px',
        transform: 'none !important',
        WebkitTransform: 'none !important'
      }}
    >
      {/* Glow effect when expanded */}
      <AnimatePresence>
        {isExpanded && currentNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`absolute inset-0 blur-3xl -z-10 ${darkMode ? 'bg-white/10' : 'bg-black/15'}`}
            style={{ transform: 'scale(1.8)' }}
          />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ width: 40, height: 40, borderRadius: 20, opacity: 0, scale: 0.8 }}
        animate={{ 
          width: isExpanded ? 'auto' : (showText ? 210 : 40),
          minWidth: isExpanded ? 300 : (showText ? 210 : 40),
          maxWidth: isExpanded ? 420 : 1000,
          height: isExpanded ? 'auto' : 40,
          minHeight: isExpanded ? 42 : 40,
          maxHeight: isExpanded ? 'auto' : 40,
          borderRadius: isExpanded ? 21 : (showText ? 20 : 20),
          opacity: 1,
          scale: 1,
        }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          x: dragX,
          opacity: isDragging ? opacity : 1,
          isolation: 'isolate',
          position: 'relative',
          flexShrink: 0,
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          display: 'flex',
          alignItems: 'center',
          ...(!isExpanded && {
            minHeight: '40px',
            maxHeight: '40px',
            height: '40px',
            lineHeight: '40px'
          })
        }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 400,
          mass: 0.8,
        }}
        drag={isExpanded ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`
          relative overflow-hidden pointer-events-auto
          ${darkMode ? 'bg-black' : 'bg-white'}
          backdrop-blur-2xl
          shadow-[0_8px_32px_rgba(0,0,0,0.4)]
          ring-2 ${colors.ring}
          ${isExpanded ? 'cursor-grab active:cursor-grabbing' : ''}
          transition-shadow duration-300
        `}
      >
        {/* Animated Background Effects */}
        {currentNotification && (
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 'inherit' }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <motion.div
                animate={{
                  x: [0, 100, 0],
                  y: [0, -50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute -top-2 -left-2 w-8 h-8 rounded-full blur-sm ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}
              />
              <motion.div
                animate={{
                  x: [100, 0, 100],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full blur-sm ${darkMode ? 'bg-white/10' : 'bg-black/10'}`}
              />
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isExpanded ? (
            /* Expanded State - Compact Single Line */
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-3 py-2 flex items-center gap-2.5 justify-between"
            > 
              {/* Left Side - Icon + Message */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon Circle */}
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring",
                    damping: 15,
                    stiffness: 300,
                    delay: 0.05
                  }}
                  className="relative flex-shrink-0"
                >
                  {/* Glowing Background */}
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 ${colors.iconColor} opacity-20 blur-lg rounded-full`}
                  />
                  
                  {/* Icon Container with Colored Background */}
                  <div className={`relative w-6 h-6 rounded-full ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}>
                    {getIcon(currentNotification.type)}
                  </div>
                </motion.div>

                {/* Message - Single Line */}
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-sm font-bold ${colors.text} truncate`}
                >
                  {currentNotification.message}
                </motion.p>
              </div>

              {/* Right Side - Action Button or Loading */}
              {currentNotification.showLoading ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  className="flex-shrink-0"
                >
                  <div className={`w-5 h-5 rounded-full border-2 animate-spin ${darkMode ? 'border-white/20 border-t-white/80' : 'border-gray-300 border-t-gray-700'}`} />
                </motion.div>
              ) : currentNotification.actionLabel ? (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction();
                  }}
                  className={`
                    flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold
                    ${darkMode ? 'bg-white/15 hover:bg-white/25' : 'bg-black/10 hover:bg-black/20'}
                    ${colors.text} backdrop-blur-sm
                    transition-all duration-200
                    ${darkMode ? 'border border-white/10' : 'border border-black/10'}
                    flex items-center gap-1
                  `}
                >
                  {currentNotification.actionLabel}
                  <ChevronRight className="w-3 h-3" />
                </motion.button>
              ) : (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
                >
                  <X className={`w-3 h-3 ${darkMode ? 'text-white/70' : 'text-gray-600'}`} />
                </motion.button>
              )}
            </motion.div>
          ) : (
            /* Compact State - Icon + Text Sliding */
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-[40px] flex items-center justify-center px-2"
            >
              <div className="flex items-center gap-2 h-full">
                {/* Icon Circle with Glow */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    rotate: 0
                  }}
                  transition={{ 
                    scale: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      type: "spring",
                      damping: 15,
                      stiffness: 300
                    }
                  }}
                  className="relative flex-shrink-0"
                >
                  {/* Glowing Background Circle */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className={`absolute inset-0 ${colors.iconColor} opacity-20 blur-xl rounded-full`}
                  />
                  
                  {/* Icon Container with Colored Background */}
                  <div className={`relative w-7 h-7 rounded-full ${colors.iconBg} flex items-center justify-center ${colors.iconColor}`}>
                    {getIcon(currentNotification.type)}
                  </div>
                </motion.div>

                {/* Text Sliding From Icon */}
                <AnimatePresence>
                  {showText && (
                    <motion.div
                      initial={{ width: 0, opacity: 0, x: -10 }}
                      animate={{ 
                        width: 'auto', 
                        opacity: 1, 
                        x: 0
                      }}
                      exit={{ width: 0, opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.4,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      className="overflow-hidden flex items-center"
                    >
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                        className={`text-sm font-bold ${colors.text} whitespace-nowrap leading-none`}
                      >
                        {currentNotification.title || currentNotification.message?.substring(0, 18) || 'Notification'}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default DynamicIsland;

// Utility function to trigger notifications
export const showDynamicIslandNotification = ({
  message,
  type = 'info',
  title,
  action,
  actionLabel,
  duration = 4000,
  persistent = false,
  showLoading = false,
  progress = 0
}) => {
  window.dispatchEvent(new CustomEvent('dynamicIslandNotification', {
    detail: {
      message,
      type,
      title,
      action,
      actionLabel,
      duration,
      persistent,
      showLoading,
      progress
    }
  }));
};

// Change Dynamic Island position
export const setDynamicIslandPosition = (position) => {
  window.dispatchEvent(new CustomEvent('dynamicIslandSetPosition', {
    detail: { position }
  }));
};

// Pre-defined notification types for common use cases
export const DynamicIslandNotifications = {
  // Authentication notifications
  loginRequired: (redirectAction) => showDynamicIslandNotification({
    type: 'auth',
    message: 'Please log in to continue',
  }),

  loginSuccess: (username) => showDynamicIslandNotification({
    type: 'success',
    title: 'Welcome back!',
    message: `Successfully logged in as ${username}`
  }),

  logoutSuccess: () => showDynamicIslandNotification({
    type: 'info',
    title: 'Logged out',
    message: 'You have been successfully logged out'
  }),

  // Network notifications
  networkError: () => showDynamicIslandNotification({
    type: 'offline',
    title: 'Connection Lost',
    message: 'Please check your internet connection',
    persistent: true
  }),

  networkRestored: () => showDynamicIslandNotification({
    type: 'network',
    title: 'Connection Restored',
    message: 'You are back online'
  }),

  // General notifications
  success: (message, title) => showDynamicIslandNotification({
    type: 'success',
    title: title || 'Success',
    message
  }),

  error: (message, title) => showDynamicIslandNotification({
    type: 'error',
    title: title || 'Error',
    message
  }),

  warning: (message, title) => showDynamicIslandNotification({
    type: 'warning',
    title: title || 'Warning',
    message
  }),

  info: (message, title) => showDynamicIslandNotification({
    type: 'info',
    title: title || 'Info',
    message
  }),

  // Feature-specific notifications
  requestSent: () => showDynamicIslandNotification({
    type: 'success',
    title: 'Request Sent',
    message: 'Your request has been sent successfully'
  }),

  newMessage: (count) => showDynamicIslandNotification({
    type: 'message',
    title: 'New Message',
    message: `You have ${count} new message${count > 1 ? 's' : ''}`
  }),

  itemLiked: () => showDynamicIslandNotification({
    type: 'like',
    title: 'Liked',
    message: 'Item added to your favorites'
  }),

  downloadComplete: (filename) => showDynamicIslandNotification({
    type: 'download',
    title: 'Download Complete',
    message: `${filename} has been downloaded`
  })
};