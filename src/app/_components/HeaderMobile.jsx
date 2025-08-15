"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoImage from '../assets/images/logounishare1.png';
import { Search, Globe, Bell, Sun, Moon, User, LogOut, Menu } from 'lucide-react';
import { useLanguage } from "../_providers/LanguageProvider";

export default function HeaderMobile({ darkMode, onThemeToggle }) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const logoRef = useRef(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLanguageActive, setIsLanguageActive] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifInlineOpen, setNotifInlineOpen] = useState(false);
  const [notifInlineFilter, setNotifInlineFilter] = useState('All');
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Welcome to UniShare', body: 'Thanks for joining! Explore rides, marketplace, housing and more.', time: 'Just now', type: 'announcement', read: false },
    { id: '2', title: 'New message', body: 'Alex: "+Hey! Are you still selling the calculator?+"', time: '5m', type: 'message', read: false },
    { id: '3', title: 'Safety tip', body: 'Meet in public places for trades. Keep it safe ✨', time: '1h', type: 'info', read: true },
  ]);
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
      const rot = Math.atan2(dy, dx) * (180 / Math.PI) * 0.18; // slightly less aggressive
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
          // Map beta/gamma to a subtle rotation
          const gamma = e.gamma || 0; // left-right tilt (-90,90)
          const beta = e.beta || 0;   // front-back tilt (-180,180)
          const rot = (gamma * 0.4 + beta * 0.1); // tuned blend
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
      // Kick logo slightly so it doesn't stick at 0 after long inactivity
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

  return (
    <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link className="block group cursor-pointer" href="/">
          <span className="sr-only">UniShare Home</span>
          <div className="flex items-center gap-3">
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
            <span className="font-bold text-xl whitespace-nowrap">
              <span className={darkMode ? 'text-yellow-300' : 'text-yellow-500'}>Uni</span>
              <span className={darkMode ? 'text-sky-300' : 'text-sky-500'}>Share</span>
            </span>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          className={`inline-flex items-center justify-center p-3 rounded-xl border transition-all duration-200 ${
            darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Open menu"
          aria-controls="navbar-hamburger"
          aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          onClick={() => setMobileMenuOpen(o => !o)}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Collapsible mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} w-full mt-2`} id="navbar-hamburger">
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
                  placeholder={t('common.searchPlaceholder')}
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

          {/* Language */}
          <li>
            <div className={`flex items-center justify-between py-2.5 px-3 ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
              <div className="inline-flex items-center gap-3">
                <Globe className="w-5 h-5" />
                <span>{t('common.language')}</span>
              </div>
              <button
                role="switch"
                aria-checked={language === 'HI'}
                onClick={handleLanguageToggle}
                className={`relative inline-flex h-7 w-24 items-center rounded-full border transition-colors duration-200 ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-300 border-gray-200'
                }`}
                title={`Language: ${language}`}
              >
                <span className={`absolute left-2 text-[10px] font-semibold tracking-wide ${
                  language === 'EN' ? (darkMode ? 'text-yellow-300' : 'text-blue-700') : (darkMode ? 'text-gray-300' : 'text-gray-700')
                }`}>EN</span>
                <span className={`absolute right-2 text-[10px] font-semibold tracking-wide ${
                  language === 'HI' ? (darkMode ? 'text-yellow-300' : 'text-blue-700') : (darkMode ? 'text-gray-300' : 'text-gray-700')
                }`}>HI</span>
                <span className={`absolute h-6 w-12 rounded-full bg-white shadow transition-transform duration-200 ${
                  language === 'HI' ? 'translate-x-12' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </li>

          {/* Notifications inline */}
          <li>
            <button
              onClick={() => { setNotifInlineOpen(o => !o); }}
              className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
              aria-expanded={notifInlineOpen}
              aria-controls="mobile-inline-notifs"
            >
              <Bell className="w-5 h-5" />
              <span>{t('common.notifications')}</span>
              {notifications.some(n => !n.read) && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            {notifInlineOpen && (
              <div id="mobile-inline-notifs" className={`mx-3 mb-2 rounded-lg border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                <div className="px-3 pt-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-700'}`}>
                      {notifications.filter(n => !n.read).length} unread
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNotifInlineFilter(f => f === 'All' ? 'Unread' : 'All')}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {notifInlineFilter === 'All' ? t('common.showUnread') : t('common.showAll')}
                    </button>
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className={`px-2 py-1 rounded-md text-[11px] font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
                    >
                      {t('common.markAll')}
                    </button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto px-2 pb-2">
                  {(
                    (notifInlineFilter === 'Unread')
                      ? notifications.filter(n => !n.read)
                      : notifications
                  ).length === 0 ? (
                    <div className={`text-center text-xs py-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications</div>
                  ) : (
                    <ul className="space-y-2">
                      {(
                        notifInlineFilter === 'Unread'
                          ? notifications.filter(n => !n.read)
                          : notifications
                      ).map((n) => (
                        <li key={n.id} className={`px-3 py-2 rounded-md border ${darkMode ? 'border-gray-800 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                              <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{n.body}</p>
                              <div className="mt-1 flex items-center gap-2">
                                {!n.read && <span className={`inline-block w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-blue-600'}`} />}
                                <button
                                  onClick={() => setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: !x.read } : x))}
                                  className={`text-[11px] underline ${darkMode ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-700 hover:text-blue-700'}`}
                                >
                                  Mark as {n.read ? 'unread' : 'read'}
                                </button>
                              </div>
                            </div>
                            <div className={`text-[10px] whitespace-nowrap mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.time}</div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className={`px-3 py-2 border-t flex items-center justify-between ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                  <button
                    className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    onClick={() => setNotifInlineOpen(false)}
                  >
                    Hide
                  </button>
                </div>
              </div>
            )}
          </li>

          {/* Theme toggle */}
          <li>
            <button
              data-theme-toggle
              onClick={onThemeToggle}
              className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
              title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <span>{t('common.toggleTheme')}</span>
            </button>
          </li>

          {/* Profile/Login */}
          <li>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full inline-flex items-center gap-3 py-2.5 px-3 rounded-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
            >
              <User className="w-5 h-5" />
              <span>{t('common.loginProfile')}</span>
            </Link>
          </li>

          {/* Logout */}
          <li>
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-red-300 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'}`}
            >
              <LogOut className="w-5 h-5" />
              <span>{t('common.logout')}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
