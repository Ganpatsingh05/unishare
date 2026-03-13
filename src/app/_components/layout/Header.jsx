"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

import {
  Search,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Menu,
  X,
  ArrowLeft,
  ArrowRight, // Add ArrowRight
} from "lucide-react";
import NotificationFloatingPanel from "../ui/NotificationFloatingPanel";
import HeaderMobile from "./HeaderMobile";
import { useUniShare, useAuth, useUI, useNotifications } from "./../../lib/contexts/UniShareContext";
import { getProfileImageUrl, getUserInitials } from "./../../lib/utils/profileUtils";
import { getCurrentUserProfile } from "./../../lib/api/userProfile";

const Header = ({ logoRotation = 0 }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Add user profile state
  const [notifOpen, setNotifOpen] = useState(false);
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const profileMenuRef = useRef(null); // Ref for profile menu
  const bellRef = useRef(null); // Ref for notification bell button
  
  // Use Framer Motion for smooth animations
  const headerTop = useMotionValue(50);
  const smoothHeaderTop = useSpring(headerTop, {
    stiffness: 300,
    damping: 30,
    mass: 0.5
  });
  
  // Check if we're on the home page
  const isHomePage = pathname === '/';
  
  // Check if we're on the profile page
  const isProfilePage = pathname === '/profile';
  
  // Function to go back to previous page
  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };
  
  // Use context hooks
  const { 
    darkMode, 
    mobileMenuOpen, 
    searchValue, 
    searchFocused,
    toggleDarkMode,
    setMobileMenu,
    setSearchValue,
    setSearchFocused 
  } = useUI();
  
  const { 
    isAuthenticated, 
    user, 
    userAvatar,
    authLoading,
    logout 
  } = useAuth();
  
  const { 
    hasUnread
  } = useNotifications();

  // Fetch user profile data when user is authenticated
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated && user && !authLoading) {
        try {
          const response = await getCurrentUserProfile();
          // Extract the actual profile data from the response
          const profileData = response?.data || response;
          setUserProfile(profileData);
        } catch (error) {
          console.error('Error fetching user profile in Header:', error);
          // Set to null so we fallback to auth data
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, user, authLoading]);

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  // Handle scroll to adjust header position
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Get the actual notice bar height from CSS custom property
      const noticeBarHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--notice-bar-height') || '0'
      );
      const gap = noticeBarHeight > 0 ? 2 : 0; // Only add gap if notice bar is visible
      const totalOffset = noticeBarHeight + gap;
      
      // Calculate new top position: starts at totalOffset, moves to 0 as we scroll
      const newTop = Math.max(0, totalOffset - scrollY);
      headerTop.set(newTop);
    };

    // Initial call to set correct position
    handleScroll();

    // Listen for notice bar changes via MutationObserver
    const observer = new MutationObserver(() => {
      handleScroll();
      // Trigger a tiny scroll to force position recalculation
      const currentScroll = window.scrollY;
      if (currentScroll === 0) {
        // If at top, scroll down 1px then back
        window.scrollTo({ top: 1, behavior: 'instant' });
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 10);
      } else {
        // If scrolled, scroll up 1px then back
        window.scrollTo({ top: currentScroll - 1, behavior: 'instant' });
        setTimeout(() => window.scrollTo({ top: currentScroll, behavior: 'smooth' }), 10);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [headerTop]);

  const handleProfileMenuToggle = () => {
    if (isAuthenticated) {
      setProfileMenuOpen((prev) => !prev);
    } else {
      router.push('/login');
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationActive(true);
    setTimeout(() => setIsNotificationActive(false), 150);
    setNotifOpen((prev) => !prev);
  };

  const handleThemeToggle = () => {
    // ✅ PERFORMANCE: Immediate visual feedback
    toggleDarkMode();
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.classList.add('animate-spin');
      setTimeout(() => button.classList.remove('animate-spin'), 200);
    }
  };

   const handleLogout = async () => {
    try {
      // Call the logout function from context (destroys session on server)
      await logout();
      setProfileMenuOpen(false);
      setMobileMenu(false);
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      // Always redirect to login page and force full reload to clear cached state
      window.location.href = '/login';
    }
  };

  const handleProfileClick = () => {
    if (isAuthenticated) {
      router.push('/profile');
    } else {
      router.push('/login');
    }
    setMobileMenu(false);
  };

  return (
    <motion.header
      className={`fixed left-0 right-0 w-full overflow-x-clip overflow-y-visible ${
        darkMode
          ? "bg-transparent"
          : "bg-transparent"
      }`}
      style={{ zIndex: 70, top: smoothHeaderTop }}
    >
      {/* Mobile-only header */}
      <div className="md:hidden">
        <HeaderMobile logoRotation={logoRotation} />
      </div>

      {/* Desktop/Tablet header */}
      <div className="hidden md:flex justify-center w-full pt-3">
        <nav
          className={`relative backdrop-blur-md supports-[backdrop-filter]:bg-white/70 bg-white/80 dark:supports-[backdrop-filter]:bg-black/50 dark:bg-black/80 border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.15)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] rounded-full px-8 sm:px-10 py-3 sm:py-4 max-w-6xl w-full flex items-center justify-between gap-6`}
          style={{ willChange: 'background-color, border-color' }}
        >
          <div className="flex items-center gap-6 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/logos/logounishare1.png"
                alt="UniShare"
                width={36}
                height={36}
                className="rounded"
                priority
              />
            </Link>
            
            <span className="brand-wordmark font-bold text-xl whitespace-nowrap">
              <span className="brand-uni">Uni</span>
              <span className="brand-share">Share</span>
            </span>
          </div>
          
          {/* Center: Navigation Links */}
          <div className="flex-1 flex items-center justify-end gap-1 mr-4">
            <Link href="#features" className="group relative inline-flex items-center px-3 py-1.5 text-sm font-bold text-neutral-700 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">
              <span className="relative z-10">Features</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
            <Link href="#how-it-works" className="group relative inline-flex items-center px-3 py-1.5 text-sm font-bold text-neutral-700 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">
              <span className="relative z-10">How it works</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
            <Link href="/info/help" className="group relative inline-flex items-center px-3 py-1.5 text-sm font-bold text-neutral-700 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">
              <span className="relative z-10">Help</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
            <Link href="/info/faqs" className="group relative inline-flex items-center px-3 py-1.5 text-sm font-bold text-neutral-700 hover:text-black dark:text-white/80 dark:hover:text-white transition-colors">
              <span className="relative z-10">FAQ</span>
              <span className="pointer-events-none absolute inset-0 rounded-full bg-black/5 dark:bg-white/5 opacity-0 transition-opacity group-hover:opacity-100"></span>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="ml-1">
              <button
                onClick={handleThemeToggle}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 w-10 hover:bg-transparent"
                aria-label="Toggle theme"
              >
                {darkMode ? <Moon className="h-[1.4rem] w-[1.4rem]" /> : <Sun className="h-[1.4rem] w-[1.4rem]" />}
              </button>
            </div>

            {/* Notification Bell */}
            {isAuthenticated && (
              <button
                ref={bellRef}
                onClick={handleNotificationClick}
                className="relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-10 w-10 hover:bg-transparent"
                aria-label="Notifications"
              >
                <Bell className={`h-[1.3rem] w-[1.3rem] transition-transform duration-150 ${isNotificationActive ? 'scale-90' : 'scale-100'}`} />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
                )}
              </button>
            )}

            {!isAuthenticated ? (
                <Link
                  href="/login"
                  className="group relative inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-1.5 text-sm font-medium text-neutral-900 shadow-inner transition-colors hover:bg-black/10 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  <span className="absolute -inset-px rounded-full bg-gradient-to-r from-white/10 via-white/0 to-white/10 opacity-0 blur transition-opacity group-hover:opacity-100"></span>
                  <span className="relative inline-flex items-center gap-2 align-middle">
                    Sign in
                  </span>
                  <ArrowRight className="relative h-4 w-4 opacity-80 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={handleProfileMenuToggle}
                    className="flex items-center gap-3 rounded-full transition-all duration-300 hover:scale-105 relative"
                  >
                    <div className="relative">
                      {/* Yellow + Blue border ring */}
                      <div className="absolute inset-0 rounded-full p-[3px]" style={{
                        background: 'linear-gradient(135deg, #EAB308 0%, #EAB308 45%, #3B82F6 55%, #3B82F6 100%)'
                      }}>
                        <div className="w-full h-full rounded-full backdrop-blur-md" style={{
                          background: 'rgba(255, 255, 255, 0.7)'
                        }} />
                      </div>
                      {/* Profile image */}
                      <div className="relative p-[3px]">
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300">
                        {(() => {
                          const profileImage = getProfileImageUrl(
                            userProfile,
                            user
                          );
                          if (profileImage) {
                            return (
                              <Image
                                src={profileImage}
                                alt="User"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            );
                          } else {
                            return (
                              <span className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                                {getUserInitials(userProfile, user)}
                              </span>
                            );
                          }
                        })()}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {profileMenuOpen && (
                    <div
                      className={`absolute right-0 top-full mt-3 w-64 origin-top-right rounded-2xl border shadow-2xl backdrop-blur-xl ${
                        darkMode
                          ? "border-white/10 bg-[#1a1a1a]/70"
                          : "border-gray-200/80 bg-white/70"
                      }`}
                      style={{
                        backdropFilter: "blur(12px) saturate(150%)",
                        WebkitBackdropFilter: "blur(12px) saturate(150%)",
                      }}
                    >
                      <div className="p-2">
                        <div className="px-3 py-2">
                          <p
                            className={`truncate text-sm font-semibold ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {userProfile?.fullName ||
                              userProfile?.username ||
                              "Welcome"}
                          </p>
                          <p
                            className={`truncate text-xs ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            {user?.email}
                          </p>
                        </div>
                        <hr
                          className={`my-1 ${
                            darkMode ? "border-white/10" : "border-gray-200/80"
                          }`}
                        />
                        <div className="py-1">
                          <Link
                            href="/profile"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              darkMode
                                ? "text-gray-300 hover:bg-white/5"
                                : "text-gray-700 hover:bg-black/5"
                            }`}
                          >
                            <User className="h-4 w-4" />
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/settings"
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              darkMode
                                ? "text-gray-300 hover:bg-white/5"
                                : "text-gray-700 hover:bg-black/5"
                            }`}
                          >
                            <Settings className="h-4 w-4" />
                            <span>Settings</span>
                          </Link>
                        </div>
                        <hr
                          className={`my-1 ${
                            darkMode ? "border-white/10" : "border-gray-200/80"
                          }`}
                        />
                        <div className="p-1">
                          <button
                            onClick={handleLogout}
                            className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                              darkMode
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-red-600 hover:bg-red-500/10"
                            }`}
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
          </div>
        </nav>
      </div>

      {/* Floating Notification Panel */}
      <NotificationFloatingPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        anchorRef={bellRef}
      />
    </motion.header>
  );
};

export default Header;
