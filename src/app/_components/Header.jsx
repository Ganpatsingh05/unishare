"use client";

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoImage from '../assets/images/logounishare1.png'; 
import { Search, Bell, Sun, Moon, User, LogOut, Settings, Menu, X } from 'lucide-react';
import NotificationPanel from './NotificationPanel';
import HeaderMobile from './HeaderMobile';
import { useUniShare, useAuth, useUI, useNotifications } from '../lib/contexts/UniShareContext';

const Header = ({ logoRotation = 0 }) => {
  const router = useRouter();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [notifInlineOpen, setNotifInlineOpen] = useState(false);
  const [notifInlineFilter, setNotifInlineFilter] = useState('All');
  
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
    logout 
  } = useAuth();
  
  const { 
    notifications, 
    hasUnread, 
    markNotificationRead, 
    markAllNotificationsRead 
  } = useNotifications();

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
    toggleDarkMode();
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.classList.add('animate-spin');
      setTimeout(() => button.classList.remove('animate-spin'), 300);
    }
  };

   const handleLogout = async () => {
    try {
      // Call the logout function from context
      await logout();
      setProfileMenuOpen(false);
      setMobileMenu(false);
      
      // Force a full page reload to clear any cached state
      window.location.href = '/login';
    } catch (e) {
      console.error('Logout error:', e);
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
    <header className={`sticky top-0 z-50 w-full overflow-x-clip overflow-y-visible transition-all duration-300 backdrop-blur-md ${
      darkMode ? 'bg-transparent shadow-gray-900/10' : 'bg-transparent shadow-orange-200/20'
    }`}>
      {/* Mobile-only header */}
      <div className="md:hidden">
        <HeaderMobile 
          logoRotation={logoRotation}
        />
      </div>

      {/* Desktop/Tablet header */}
      <div className="hidden md:block mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          
          {/* Logo and Search Section */}
          <div className="flex items-center gap-4 flex-1 py-2">
            <Link className="block group cursor-pointer" href="/">
              <span className="sr-only">UniShare Home</span>
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 flex items-end justify-center overflow-visible pb-2">
                  <div 
                    className="h-16 w-16 transition-all duration-300 transform group-hover:scale-125 animate-float"
                    style={{ 
                      transform: `scale(1) rotate(${logoRotation}deg)`,
                      filter: darkMode ? 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.3))' : 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.2))'
                    }}
                  >
                    <Image
                      src={logoImage}
                      alt="UniShare Logo"
                      width={100}
                      height={100}
                      className="w-full h-full object-contain bg-transparent transition-all duration-300 group-hover:animate-pulse-glow"
                      priority
                    />
                  </div>
                </div>
                <span className="brand-wordmark font-bold text-2xl transition-all duration-300 group-hover:opacity-90 whitespace-nowrap">
                  <span className="brand-uni">Uni</span>
                  <span className="brand-share">Share</span>
                </span>
              </div>
            </Link>
            
            {/* Enhanced Search Bar */}
            <div className="hidden md:flex items-center relative flex-1 max-w-2xl mx-4">
              <div className={`absolute left-4 transition-all duration-300 z-10 ${
                searchFocused || searchValue 
                  ? (darkMode ? 'text-yellow-300 transform scale-110' : 'text-blue-500 transform scale-110')
                  : (darkMode ? 'text-gray-400' : 'text-gray-500')
              }`}>
                <Search className="w-5 h-5" />
              </div>
              
              <input
                type="text"
                placeholder="Search for rides, items, rooms, or resources..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`w-full pl-12 pr-12 py-3 rounded-2xl border-2 text-sm transition-all duration-300 transform cursor-text ${
                  searchFocused 
                    ? `scale-[1.02] ${darkMode 
                        ? 'bg-gray-700 text-gray-100 border-yellow-300 shadow-xl shadow-yellow-300/20 ring-2 ring-yellow-300/20' 
                        : 'bg-white text-gray-800 border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/20'
                      }` 
                    : `${darkMode 
                        ? 'bg-gray-800 text-gray-100 border-gray-700 hover:border-gray-600 hover:bg-gray-750' 
                        : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-white hover:shadow-md'
                      }`
                } outline-none placeholder-gray-500`}
              />
              
              {searchValue && (
                <button
                  onClick={() => setSearchValue('')}
                  className={`absolute right-4 p-1 rounded-full transition-all duration-200 hover:scale-110 cursor-pointer ${
                    darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              
              {/* Search suggestions dropdown */}
              {searchFocused && searchValue.length > 0 && (
                <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border-2 shadow-xl z-50 ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <div className="p-2">
                    {['rides to downtown', 'textbooks for sale', 'single room available', 'study materials'].filter(suggestion => 
                      suggestion.toLowerCase().includes(searchValue.toLowerCase())
                    ).slice(0, 4).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchValue(suggestion);
                          setSearchFocused(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-3 cursor-pointer ${
                          darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <Search className="w-4 h-4 opacity-50" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              
              {/* Enhanced Notifications */}
              <button 
                className={`hidden sm:flex p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 relative cursor-pointer ${
                  isNotificationActive 
                    ? `animate-bounce ${darkMode ? 'bg-yellow-300/20' : 'bg-blue-600/20'}`
                    : `${darkMode 
                        ? 'text-gray-100 hover:bg-gray-800 bg-gray-850 hover:shadow-lg hover:text-yellow-300' 
                        : 'text-blue-600 hover:bg-gray-100 bg-gray-50 hover:shadow-lg hover:text-blue-700'
                      }`
                }`}
                onClick={handleNotificationClick}
                title="Notifications"
              >
                <Bell className="w-5 h-5 transition-all duration-300" />
                {/* Notification badge */}
                {hasUnread && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Enhanced Theme Toggle */}
              <button 
                data-theme-toggle
                className={`hidden sm:flex p-3 rounded-xl transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer ${
                  darkMode 
                    ? 'text-yellow-300 hover:bg-gray-800 bg-gray-850 hover:shadow-lg hover:shadow-yellow-300/30 hover:text-yellow-200' 
                    : 'text-yellow-600 hover:bg-gray-100 bg-gray-50 hover:shadow-lg hover:shadow-yellow-600/30 hover:text-yellow-700'
                }`}
                onClick={handleThemeToggle}
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                <div className="relative">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
              </button>

              {/* Enhanced Profile Dropdown */}
              <div className="relative hidden md:block">
                <button 
                  onClick={handleProfileMenuToggle}
                  className={`overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer inline-block ${
                    darkMode 
                      ? 'border-gray-600 hover:border-yellow-300 hover:shadow-yellow-300/20' 
                      : 'border-gray-300 hover:border-blue-500 hover:shadow-blue-500/20'
                  }`}
                >
                  <span className="sr-only">{isAuthenticated ? 'Profile' : 'Login'}</span>
                  <div className={`size-12 flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                    darkMode 
                      ? isAuthenticated ? 'bg-gradient-to-br from-yellow-400 to-yellow-300 text-gray-900' : 'bg-gray-700 text-gray-300' 
                      : isAuthenticated ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isAuthenticated && userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt="User Avatar"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && isAuthenticated && (
                  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border-2 z-50 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </div>
                      </Link>
                      <Link
                        href="/settings"
                        className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'text-gray-200 hover:bg-gray-700' 
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                          darkMode 
                            ? 'text-red-300 hover:bg-gray-700' 
                            : 'text-red-600 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden w-full mt-2`} id="navbar-hamburger">
          <ul className={`flex flex-col font-medium rounded-lg border overflow-hidden ${
            darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            {/* Search row */}
            <li className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <div className="px-3 py-2">
                <div className="relative">
                  <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-10 pr-3 py-2 rounded-md border text-sm ${
                      darkMode ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400' : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </li>
            
            {/* Mobile menu items can be added here using similar pattern */}
          </ul>
        </div>
      </div>
      
      {/* Notification Panel Portal */}
      <NotificationPanel
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        darkMode={darkMode}
        notifications={notifications}
        setNotifications={() => {}} // This should use context action
      />
    </header>
  );
};

export default Header;