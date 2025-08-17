"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoImage from '../assets/images/logounishare1.png';
import { Search, Globe, Bell, Sun, Moon, User, LogOut, Menu, X, Settings, Camera, Edit3, Shield, HelpCircle, Info, ChevronRight } from 'lucide-react';
import { useLanguage } from "../_providers/LanguageProvider";

export default function HeaderMobile({ darkMode, onThemeToggle, onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const logoRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLanguageActive, setIsLanguageActive] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifInlineOpen, setNotifInlineOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifInlineFilter, setNotifInlineFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Welcome to UniShare', body: 'Thanks for joining! Explore rides, marketplace, housing and more.', time: 'Just now', type: 'announcement', read: false },
    { id: '2', title: 'New message', body: 'Alex: "Hey! Are you still selling the calculator?"', time: '5m', type: 'message', read: false },
    { id: '3', title: 'Safety tip', body: 'Meet in public places for trades. Keep it safe ✨', time: '1h', type: 'info', read: true },
  ]);
  
  // Mock user data - replace with actual user data from your auth system
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    profileImage: null, // null means no profile image uploaded
    initials: 'JD'
  });
  
  const router = useRouter();
  const { t } = useLanguage();

  const handleLanguageToggle = () => {
    setIsLanguageActive(true);
    toggleLanguage();
    setTimeout(() => setIsLanguageActive(false), 200);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('unishare_user');
      localStorage.removeItem('token');
    } catch (e) {}
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setNotifInlineOpen(false);
    setSettingsOpen(false);
    // Notify parent component about menu state change
    if (onMenuToggle) {
      onMenuToggle(false);
    }
  };

  // Handle menu toggle and notify parent
  const handleMenuToggle = () => {
    const newMenuState = !mobileMenuOpen;
    setMobileMenuOpen(newMenuState);
    if (onMenuToggle) {
      onMenuToggle(newMenuState);
    }
  };

  // Animate logo rotation on mobile (throttled + orientation support)
  useEffect(() => {
    let ticking = false;
    let inactivityTimer;

    const updateRotationFromPoint = (x, y) => {
      const rect = logoRef.current?.getBoundingClientRect();
      if (!rect) return;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const rot = Math.atan2(dy, dx) * (180 / Math.PI) * 0.18;
      setLogoRotation((prev) => (Math.abs(prev - rot) < 0.15 ? prev : rot));
    };

    const handleMove = (e) => {
      const point = e.touches && e.touches.length ? e.touches[0] : e;
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateRotationFromPoint(point.clientX, point.clientY);
          ticking = false;
        });
      }
    };

    const handleOrientation = (e) => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const gamma = e.gamma || 0;
          const beta = e.beta || 0;
          const rot = (gamma * 0.4 + beta * 0.1);
          setLogoRotation((prev) => (Math.abs(prev - rot) < 0.15 ? prev : rot));
          ticking = false;
        });
      }
    };

    const startSensors = async () => {
      window.addEventListener('mousemove', handleMove, { passive: true });
      window.addEventListener('touchmove', handleMove, { passive: true });
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        try {
          if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            const perm = await DeviceOrientationEvent.requestPermission();
            if (perm === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, { passive: true });
            }
          } else {
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
          }
        } catch {}
      }
      inactivityTimer = setInterval(() => {
        setLogoRotation((prev) => prev + 0.001);
      }, 3000);
    };

    startSensors();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      if (inactivityTimer) clearInterval(inactivityTimer);
    };
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
          <span className="font-bold text-xl whitespace-nowrap">
            <span className={darkMode ? 'text-yellow-300' : 'text-yellow-500'}>Uni</span>
            <span className={darkMode ? 'text-sky-300' : 'text-sky-500'}>Share</span>
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
          onClick={handleMenuToggle}
        >
          <HamburgerIcon isOpen={mobileMenuOpen} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 z-45 transition-all duration-300 shadow-2xl h-screen w-[85vw] max-w-sm transform ${
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
            <div className="flex items-center space-x-4">
              <div className="relative">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-offset-2 ring-offset-transparent ring-blue-500"
                  />
                ) : (
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold ring-2 ring-offset-2 ring-offset-transparent ${
                    darkMode ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 ring-yellow-400' : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white ring-blue-500'
                  }`}>
                    {userData.initials}
                  </div>
                )}
                <button className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                } transition-colors duration-200`}>
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userData.name}
                </h3>
                <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {userData.email}
                </p>
                <button className={`mt-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full border transition-colors ${
                  darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                }`}>
                  <Edit3 className="w-3 h-3" />
                  Edit Profile
                </button>
              </div>
            </div>
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
                    placeholder={t('common.searchPlaceholder')}
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
              
              {/* Theme Toggle */}
              <li>
                <button
                  onClick={onThemeToggle}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span className="font-medium">{t('common.toggleTheme')}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {darkMode ? 'Dark' : 'Light'}
                  </span>
                </button>
              </li>

              {/* Language Toggle */}
              <li>
                <button
                  onClick={handleLanguageToggle}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5" />
                    <span className="font-medium">{t('common.language')}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {language}
                  </span>
                </button>
              </li>

              {/* Notifications */}
              <li>
                <button
                  onClick={() => { setNotifInlineOpen(!notifInlineOpen); setSettingsOpen(false); }}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5" />
                    <span className="font-medium">{t('common.notifications')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {notifications.some(n => !n.read) && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'
                      }`}>
                        {notifications.filter(n => !n.read).length}
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
                        {notifications.filter(n => !n.read).length} unread
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
                          onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
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
                                    onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: !x.read } : x))}
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

              {/* Profile/Login */}
              <li>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className={`w-full inline-flex items-center gap-3 px-6 py-3 transition-colors duration-200 ${
                    darkMode ? 'text-gray-200 hover:bg-gray-800/50' : 'text-gray-900 hover:bg-gray-100/50'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{t('common.loginProfile')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer with trademark and logout */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            {/* Trademark */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-medium">Powered by</span>
                <span className="font-bold text-lg">
                  <span className="text-yellow-500">Uni</span>
                  <span className="text-blue-500">Share</span>
                </span>
              </div>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                © 2024 UniShare. All rights reserved.
              </p>
            </div>
            
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                darkMode ? 'text-red-300 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}