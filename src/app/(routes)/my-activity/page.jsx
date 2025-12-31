"use client";

import { useState, useMemo, memo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Car, ShoppingCart, Home, Search, Megaphone, Ticket, LogIn, User } from "lucide-react";
import { useUI, useAuth } from "./../../lib/contexts/UniShareContext";


const NotificationBadge = memo(({ count, gradient }) => (
  count > 0 ? (
    <div className={`
      absolute -top-2 -right-2 z-20
      min-w-[24px] h-6 px-2
      bg-gradient-to-r ${gradient}
      rounded-full flex items-center justify-center
      shadow-lg
      ring-2 ring-white/20
    `}>
      <span className="text-white text-xs font-bold">
        {count > 99 ? '99+' : count}
      </span>
    </div>
  ) : null
));
NotificationBadge.displayName = 'NotificationBadge';

const ActivityCard = memo(({ category, index, theme }) => {
  const IconComponent = category.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={category.path}>
        <div className={`
          relative cursor-pointer
          ${theme.cardSecondary} ${theme.borderLight}
          border rounded-3xl p-6
          shadow-lg hover:shadow-xl
          overflow-hidden
          w-fit mx-auto min-w-[140px]
          transition-all duration-300 transform hover:scale-105
        `}>
          {/* Animated Background Gradient */}
          <div className={`
            absolute inset-0 opacity-5 
            bg-gradient-to-br ${category.color}
            rounded-3xl
          `} />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Icon with Notification Badge */}
            <div className="relative">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                bg-gradient-to-r ${category.color}
                shadow-lg
                ring-1 ring-white/20
                transition-transform duration-300 group-hover:scale-110
              `}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <NotificationBadge count={category.count} gradient={category.color} />
            </div>
            
            {/* Text Content */}
            <div>
              <h3 className={`text-xl font-bold ${theme.text} whitespace-nowrap`}>
                {category.name}
              </h3>
              <p className={`${theme.textMuted} text-sm mt-1`}>
                {category.description}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
ActivityCard.displayName = 'ActivityCard';

// Login Prompt Component
const LoginPrompt = memo(({ theme }) => (
  <div className={`min-h-screen ${theme.bg} relative overflow-hidden flex items-center justify-center`}>
    {/* Animated Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
    </div>

    {/* Main Content */}
    <div className="relative z-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto"
      >
        {/* Login Icon */}
        <div className="mb-8">
          <div className={`
            w-24 h-24 mx-auto rounded-full flex items-center justify-center
            bg-gradient-to-r from-blue-500 to-purple-500
            shadow-lg ring-4 ring-blue-500/20
          `}>
            <User className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Title and Message */}
        <h1 className={`text-3xl font-bold ${theme.text} mb-4`}>
          Login Required
        </h1>
        <p className={`${theme.textMuted} text-lg mb-8`}>
          You need to be logged in to view your activity and manage your requests.
        </p>

        {/* Login Button */}
        <Link href="/login?redirect=/my-activity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              inline-flex items-center justify-center gap-3
              px-8 py-4 rounded-2xl font-semibold text-lg
              bg-gradient-to-r from-blue-600 to-purple-600
              text-white shadow-lg hover:shadow-xl
              transition-all duration-300
              ring-2 ring-blue-500/20 hover:ring-blue-500/40
            `}
          >
            <LogIn className="w-5 h-5" />
            Login to Continue
          </motion.button>
        </Link>

        {/* Additional Links */}
        <div className="mt-8 space-y-2">
          <p className={`${theme.textMuted} text-sm`}>
            Don't have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  </div>
));
LoginPrompt.displayName = 'LoginPrompt';

export default function RequestsMadePage() {
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const [requestCounts, setRequestCounts] = useState({
    rooms: { total: 0 },
    marketplace: { total: 0 },
    lostFound: { total: 0 },
    tickets: { total: 0 },
    rides: { total: 0 },
    totalRequests: 0
  });
  const [loading, setLoading] = useState(true);

  const theme = useMemo(() => ({
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    cardSecondary: darkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    borderLight: darkMode ? 'border-gray-700/50' : 'border-white/20',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-700',
  }), [darkMode]);

  // Fetch request counts only when authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const fetchRequestCounts = async () => {
      try {
        const { getAllRequestCounts } = await import("../../lib/api/requests");
        const counts = await getAllRequestCounts();
        setRequestCounts(counts);
      } catch (error) {
        console.error('Failed to fetch request counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequestCounts();
  }, [isAuthenticated, user]);

  // Request categories with real counts - MUST be before conditional return
  const requestCategories = useMemo(() => [
    {
      name: "Share Ride",
      icon: Car,
      path: "/my-activity/requests/sharerideREQ",
      count: requestCounts.rides?.total || 0,
      color: "from-blue-500 to-cyan-500",
      description: "Ride requests you've made"
    },
    {
      name: "Buy/Sell",
      icon: ShoppingCart,
      path: "/my-activity/requests/buysellREQ",
      count: requestCounts.marketplace?.total || 0,
      color: "from-purple-500 to-pink-500",
      description: "Marketplace item requests"
    },
    {
      name: "Housing",
      icon: Home,
      path: "/my-activity/requests/roomsREQ",
      count: requestCounts.rooms?.total || 0,
      color: "from-green-500 to-emerald-500",
      description: "Room and housing requests"
    },
    {
      name: "Lost & Found",
      icon: Search,
      path: "/my-activity/requests/lostfoundREQ",
      count: requestCounts.lostFound?.total || 0,
      color: "from-orange-500 to-red-500",
      description: "Lost and found item requests"
    },
    {
      name: "Tickets",
      icon: Ticket,
      path: "/my-activity/requests/ticketsREQ",
      count: requestCounts.tickets?.total || 0,
      color: "from-indigo-500 to-purple-500",
      description: "Get Event ticket requests"
    },
    {
      name: "Announcements",
      icon: Megaphone,
      path: "/my-activity/requests/announcmentREQ",
      count: 0, // Announcements might not have requests
      color: "from-yellow-500 to-orange-500",
      description: "Announcement requests"
    }
  ], [requestCounts]);

  // Check if user is authenticated first
  if (!isAuthenticated || !user) {
    return <LoginPrompt theme={theme} />;
  }

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className={`text-3xl font-bold ${theme.text} mb-3`}>My Requests</h2>
            <p className={`${theme.textMuted} text-lg`}>
              Manage all your requests across UniShare services
              {requestCounts.totalRequests > 0 && (
                <span className="ml-2 text-blue-600 font-semibold">
                  ({requestCounts.totalRequests} active)
                </span>
              )}
            </p>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            /* Categories Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 sm:gap-6">
              {requestCategories.map((category, index) => (
                <ActivityCard 
                  key={category.name} 
                  category={category} 
                  index={index} 
                  theme={theme} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
