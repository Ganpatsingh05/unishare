"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logoImage from '../assets/images/logounishare1.png'; // Adjust path as needed
import { Search, Globe, Bell, Sun, Moon, User, LogOut, Settings, FileText, HelpCircle, UserCircle, Menu, X } from 'lucide-react';

const Header = ({ darkMode, onThemeToggle, logoRotation = 0 }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [isNotificationActive, setIsNotificationActive] = useState(false);
  const [isLanguageActive, setIsLanguageActive] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleProfileMenuToggle = () => setProfileMenuOpen((prev) => !prev);

  const handleNotificationClick = () => {
    setIsNotificationActive(true);
    setTimeout(() => setIsNotificationActive(false), 200);
    alert('Notifications clicked!');
  };

  const handleLanguageToggle = () => {
    setIsLanguageActive(true);
    setLanguage(prev => (prev === 'EN' ? 'HI' : 'EN'));
    setTimeout(() => setIsLanguageActive(false), 200);
  };

  const handleThemeToggle = () => {
    onThemeToggle();
    // Add a brief animation class
    const button = document.querySelector('[data-theme-toggle]');
    if (button) {
      button.classList.add('animate-spin');
      setTimeout(() => button.classList.remove('animate-spin'), 300);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('unishare_user');
      localStorage.removeItem('token');
    } catch (e) {}
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header className={`sticky top-0 z-50 w-full overflow-x-clip transition-all duration-300 shadow-lg backdrop-blur-md border-b ${
      darkMode ? 'bg-gray-900/95 border-gray-800 shadow-gray-900/20' : 'bg-white/95 border-gray-200 shadow-gray-200/50'
    }`}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* 🔧 HEADER HEIGHT CHANGE: Changed from h-16 to h-28 to increase header height for larger logo */}
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo and Search Section */}
          <div className="flex items-center gap-4 flex-1">
            <Link className="block group cursor-pointer" href="/">
              <span className="sr-only">UniShare Home</span>
              <div className="flex items-center gap-3">
                {/* Enhanced Interactive Logo */}
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
                {/* Styled Text Logo */}
                <span className="font-bold text-2xl transition-all duration-300 group-hover:text-opacity-80 whitespace-nowrap">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-yellow-300 group-hover:text-yellow-200' : 'text-yellow-500 group-hover:text-yellow-600'
                  }`}>
                    Uni
                  </span>
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-sky-300 group-hover:text-sky-200' : 'text-sky-500 group-hover:text-sky-600'
                  }`}>
                    Share
                  </span>
                </span>
              </div>
            </Link>
            
            {/* Enhanced Search Bar with better positioning */}
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
            {/* Mobile Hamburger */}
            <button
              className={`md:hidden inline-flex items-center justify-center p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Open menu"
              aria-controls="navbar-hamburger"
              aria-expanded={mobileMenuOpen ? 'true' : 'false'}
              onClick={() => setMobileMenuOpen((o) => !o)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              
              {/* Enhanced Language Toggle */}
              <button 
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium text-sm tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
                  isLanguageActive 
                    ? `animate-pulse ${darkMode ? 'border-yellow-400 bg-yellow-400/20' : 'border-blue-600 bg-blue-600/20'}`
                    : `${darkMode 
                        ? 'border-yellow-300 bg-gray-800 text-yellow-300 hover:bg-yellow-300/10 hover:shadow-lg hover:shadow-yellow-300/20' 
                        : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-500/20'
                      }`
                }`}
                onClick={handleLanguageToggle}
              >
                <Globe className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>EN | HI</span>
              </button>

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
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
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
                <Link 
                  href="/login"
                  className={`overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer inline-block ${
                    darkMode 
                      ? 'border-gray-600 hover:border-yellow-300 hover:shadow-yellow-300/20' 
                      : 'border-gray-300 hover:border-blue-500 hover:shadow-blue-500/20'
                  }`}
                >
                  <span className="sr-only">Login / Profile</span>
                  <div className={`size-12 flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                    darkMode ? 'bg-gradient-to-br from-yellow-400 to-yellow-300 text-gray-900' : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                  }`}>
                    <User className="w-5 h-5" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Flowbite-like collapsible mobile menu */}
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
            {/* Language with EN | HI labels on toggle */}
            <li>
              <div className={`flex items-center justify-between py-2.5 px-3 ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}>
                <div className="inline-flex items-center gap-3">
                  <Globe className="w-5 h-5" />
                  <span>Language</span>
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
                  {/* Labels */}
                  <span className={`absolute left-2 text-[10px] font-semibold tracking-wide ${
                    language === 'EN' ? (darkMode ? 'text-yellow-300' : 'text-blue-700') : (darkMode ? 'text-gray-300' : 'text-gray-700')
                  }`}>EN</span>
                  <span className={`absolute right-2 text-[10px] font-semibold tracking-wide ${
                    language === 'HI' ? (darkMode ? 'text-yellow-300' : 'text-blue-700') : (darkMode ? 'text-gray-300' : 'text-gray-700')
                  }`}>HI</span>
                  {/* Knob */}
                  <span
                    className={`absolute h-6 w-12 rounded-full bg-white shadow transition-transform duration-200 ${
                      language === 'HI' ? 'translate-x-12' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </li>
            {/* Notifications */}
            <li>
              <button
                onClick={handleNotificationClick}
                className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
              >
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
              </button>
            </li>
            {/* Theme toggle */}
            <li>
              <button
                data-theme-toggle
                onClick={handleThemeToggle}
                className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-gray-200 hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'}`}
                title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
              >
                {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                <span>Toggle Theme</span>
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
                <span>Login / Profile</span>
              </Link>
            </li>
            {/* Logout */}
            <li>
              <button
                onClick={() => { try { localStorage.removeItem('unishare_user'); localStorage.removeItem('token'); } catch(e){}; setMobileMenuOpen(false); router.push('/login'); }}
                className={`w-full flex items-center gap-3 py-2.5 px-3 text-left rounded-none ${darkMode ? 'text-red-300 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'}`}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
      
    </header>
  );
};

export default Header;