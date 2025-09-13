"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoImage from '../assets/images/logounishare1.png';
import { Search, Globe, Bell, Sun, Moon, User, LogOut, Menu, X, Settings, Camera, Edit3, Shield, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { useAuth, useNotifications, useUI } from '../lib/contexts/UniShareContext';

export default function HeaderMobile() {
  const router = useRouter();
  const logoRef = useRef(null);

  // Context hooks
  const { 
    isAuthenticated, 
    user, 
    authLoading, 
    logout: contextLogout, 
    userInitials, 
    userAvatar 
  } = useAuth();
  
  const {
    notifications,
    unreadCount,
    hasUnread,
    markNotificationRead,
    markAllNotificationsRead
  } = useNotifications();
  
  const {
    darkMode,
    mobileMenuOpen,
    searchValue,
    searchFocused,
    toggleDarkMode,
    setMobileMenu,
    toggleMobileMenu,
    setSearchValue,
    setSearchFocused
  } = useUI();

  // Local state for mobile menu sections
  const [logoRotation, setLogoRotation] = useState(0);
  const [notifInlineOpen, setNotifInlineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifInlineFilter, setNotifInlineFilter] = useState('All');

  const handleLogout = async () => {
    try {
      await contextLogout();
      setMobileMenu(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setNotifInlineOpen(false);
    setSettingsOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Logo rotation effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!logoRef.current) return;
      
      const rect = logoRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 100) {
        const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        const intensity = Math.max(0, (100 - distance) / 100);
        setLogoRotation(angle * intensity * 0.3);
      } else {
        setLogoRotation(0);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const HamburgerIcon = ({ isOpen }) => (
    <div className="relative w-5 h-5 transform transition-transform duration-300 ease-in-out">
      <span className={`absolute top-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out origin-center ${
        isOpen ? 'rotate-45 translate-y-2' : 'rotate-0 translate-y-0'
      }`} />
      <span className={`absolute top-2 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
      }`} />
      <span className={`absolute top-4 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out origin-center ${
        isOpen ? '-rotate-45 -translate-y-2' : 'rotate-0 translate-y-0'
      }`} />
    </div>
  );

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        {/* Logo left, name centered */}
        <Link className="block group cursor-pointer z-10" href="/">
          <span className="sr-only">UniShare Home</span>
          <div className="flex items-center">
            <div
              ref={logoRef}
              className="h-12 w-12 transform group-hover:scale-110"
              style={{
                transform: `scale(1) rotate(${logoRotation}deg)`,
                transition: 'transform 120ms ease-out',
                filter: darkMode ? 'drop-shadow(0 0 14px rgba(251, 191, 36, 0.25))' : 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.2))'
              }}
            >
              <Image
                src={logoImage}
                alt="UniShare Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain bg-transparent"
                priority
              />
            </div>
          </div>
        </Link>
        
        <div className="absolute left-0 right-0 mx-auto flex justify-center items-center h-16 pointer-events-none">
          <span className="brand-wordmark font-bold text-xl whitespace-nowrap">
            <span className="brand-uni">Uni</span>
            <span className="brand-share">Share</span>
          </span>
        </div>

        {/* Hamburger with proper z-index to stay on top */}
        <button
          className={`relative z-50 inline-flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
            darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-controls="navbar-hamburger"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          onClick={toggleMobileMenu}
        >
          <HamburgerIcon isOpen={mobileMenuOpen} />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-40 transition-all duration-300 shadow-2xl h-[90vh] w-[85vw] max-w-sm transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          background: darkMode ? 'rgba(17,24,39,0.98)' : 'rgba(249,250,251,0.98)',
          backdropFilter: 'blur(12px)',
          borderRadius: '1.25rem 0 0 1.25rem',
          border: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
        id="navbar-hamburger"
      >
        <div className={`flex flex-col h-full overflow-hidden ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
          {/* Profile section */}
          <div className={`px-6 py-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {authLoading ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-offset-2 ring-offset-transparent ring-blue-500"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold ring-2 ring-offset-2 ring-offset-transparent ${
                      darkMode ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 ring-yellow-400' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-blue-500'
                    }`}>
                      {userInitials}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                    {user.name}
                  </h3>
                  <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {user.email}
                  </p>
                  <Link 
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
                      darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    View Profile
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Not logged in</p>
                <Link 
                  href="/login"
                  onClick={closeMobileMenu}
                  className={`mt-3 inline-block px-4 py-2 rounded-lg font-medium ${
                    darkMode ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400' : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Scrollable menu content */}
          <div className="flex-1 overflow-y-auto">
            <ul className="py-2">
              {/* Search */}
              <li className="px-4 pb-4 pt-2">
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm transition-all duration-200 ${
                      searchFocused
                        ? darkMode
                          ? 'bg-gray-800 text-gray-100 border-yellow-400 ring-2 ring-yellow-400/20'
                          : 'bg-white text-gray-900 border-blue-500 ring-2 ring-blue-500/20'
                        : darkMode
                        ? 'bg-gray-800 text-gray-100 border-gray-600 hover:border-gray-500'
                        : 'bg-gray-50 text-gray-900 border-gray-300 hover:border-gray-400'
                    } placeholder-gray-400 focus:outline-none`}
                  />
                </div>
              </li>

              {/* Menu Items */}
              <li>
                <button
                  onClick={() => { setNotifInlineOpen(!notifInlineOpen); setSettingsOpen(false); }}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasUnread && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>
                        {unreadCount}
                      </span>
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${notifInlineOpen ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                
                {notifInlineOpen && (
                  <div className={`mx-4 mb-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/30'} overflow-hidden`}>
                    <div className="px-4 pt-3 pb-2 flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        darkMode ? 'bg-yellow-400/20 text-yellow-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {unreadCount} unread
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNotifInlineFilter(f => f === 'All' ? 'Unread' : 'All')}
                          className={`px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                            darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {notifInlineFilter === 'All' ? 'Unread' : 'All'}
                        </button>
                        <button
                          onClick={markAllNotificationsRead}
                          className={`px-2 py-1 rounded-md text-xs font-medium border transition-colors ${
                            darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          Mark All
                        </button>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto px-2 pb-2">
                      {(notifInlineFilter === 'Unread' ? notifications.filter(n => !n.read) : notifications).length === 0 ? (
                        <div className={`text-center text-xs py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          No notifications
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(notifInlineFilter === 'Unread' ? notifications.filter(n => !n.read) : notifications).map((n) => (
                            <div key={n.id} className={`px-3 py-2 rounded-md border transition-colors ${
                              darkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-200 hover:bg-gray-50'
                            }`}>
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    {!n.read && (
                                      <span className={`inline-block w-2 h-2 rounded-full ${
                                        darkMode ? 'bg-yellow-400' : 'bg-blue-600'
                                      }`} />
                                    )}
                                    <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                      {n.title}
                                    </p>
                                  </div>
                                  <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {n.body}
                                  </p>
                                  <button
                                    onClick={() => markNotificationRead(n.id)}
                                    className={`text-xs underline transition-colors ${
                                      darkMode ? 'text-gray-400 hover:text-yellow-300' : 'text-gray-600 hover:text-blue-700'
                                    }`}
                                  >
                                    {n.read ? 'Mark unread' : 'Mark read'}
                                  </button>
                                </div>
                                <span className={`text-xs whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                  {n.time}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>

              {/* Theme toggle */}
              <li>
                <button
                  onClick={toggleDarkMode}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span className="font-medium">Toggle Theme</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </button>
              </li>

              {/* Settings */}
              <li>
                <button
                  onClick={() => { setSettingsOpen(!settingsOpen); setNotifInlineOpen(false); }}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${settingsOpen ? 'rotate-90' : ''}`} />
                </button>
                
                {settingsOpen && (
                  <div className={`mx-4 mb-3 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/30'} overflow-hidden`}>
                  <div className="py-2">
                    {/* Privacy */}
                    <button className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700/30' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4" />
                        <span>Privacy</span>
                      </div>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {/* Help */}
                    <button className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700/30' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-4 h-4" />
                        <span>Help & Support</span>
                      </div>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {/* About */}
                    <button className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700/30' : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4" />
                        <span>About</span>
                      </div>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                  </div>
                )}
              </li>

              {/* Profile/Login - Conditionally show based on authentication */}
              {isAuthenticated ? (
                <li>
                  <Link
                    href="/profile"
                    onClick={closeMobileMenu}
                    className={`w-full inline-flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                      darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className={`w-full inline-flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                      darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                </li>
              )}

              {/* Logout - Only show if user is logged in */}
              {isAuthenticated && (
                <li>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors duration-200 ${
                      darkMode ? 'text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Footer with UniShare trademark */}
          <div className={`px-4 py-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1">
                <span className="brand-wordmark text-xs font-semibold tracking-wide">
                  <span className="brand-uni">Uni</span>
                  <span className="brand-share">Share</span>
                </span>
                <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  ™
                </span>
              </div>
            </div>
            <div className={`text-center text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © 2025 All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}