"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ darkMode, onThemeToggle }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleProfileMenuToggle = () => setProfileMenuOpen((prev) => !prev);

  return (
    <header className={`transition-all duration-300 shadow-sm ${
      darkMode ? 'bg-gray-900 border-b border-gray-800' : 'bg-white border-b border-gray-100'
    }`}>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo and Search Section */}
          <div className="flex items-center gap-6">
            <Link className={`block ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} href="/">
              <span className="sr-only">QuickCampus Home</span>
              <div className="flex items-center gap-3">
                {/* Logo placeholder - replace with your actual logo */}
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  darkMode ? 'bg-yellow-300 text-gray-900' : 'bg-blue-600 text-white'
                }`}>
                  QC
                </div>
                <span className="font-bold text-2xl">QuickCampus</span>
              </div>
            </Link>
            
            {/* Search Bar */}
            <div className="hidden md:flex items-center relative">
              <span className={`absolute left-4 text-lg pointer-events-none ${
                darkMode ? 'text-yellow-300' : 'text-blue-500'
              }`}>🔍</span>
              <input
                type="text"
                placeholder="Search..."
                className={`w-96 pl-12 pr-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-yellow-300 focus:bg-gray-750' 
                    : 'bg-gray-50 text-gray-800 border-gray-200 focus:border-blue-500 focus:bg-white'
                } outline-none focus:shadow-sm`}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              
              {/* Language Toggle */}
              <button 
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium text-sm tracking-wide transition-all duration-200 ${
                  darkMode 
                    ? 'border-yellow-300 bg-gray-800 text-yellow-300 hover:bg-gray-750' 
                    : 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
                onClick={() => alert('Language toggle clicked!')}
              >
                <span>🌐</span>
                <span>EN | HI</span>
              </button>

              {/* Notifications */}
              <button 
                className={`hidden sm:flex p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-100 hover:bg-gray-800 bg-gray-850' 
                    : 'text-blue-600 hover:bg-gray-100 bg-gray-50'
                }`}
                onClick={() => alert('Notifications clicked!')}
                title="Notifications"
              >
                <span className="text-xl">🔔</span>
              </button>

              {/* Theme Toggle */}
              <button 
                className={`hidden sm:flex p-3 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? 'text-yellow-300 hover:bg-gray-800 bg-gray-850' 
                    : 'text-yellow-600 hover:bg-gray-100 bg-gray-50'
                }`}
                onClick={onThemeToggle}
                title="Toggle theme"
              >
                <span className="text-xl">{darkMode ? '🌙' : '☀️'}</span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className={`overflow-hidden rounded-xl border-2 shadow-sm transition-all duration-200 ${
                    darkMode 
                      ? 'border-gray-600 hover:border-yellow-300' 
                      : 'border-gray-300 hover:border-blue-500'
                  }`}
                  onClick={handleProfileMenuToggle}
                >
                  <span className="sr-only">Toggle profile menu</span>
                  <div className={`size-12 flex items-center justify-center font-bold text-xl ${
                    darkMode ? 'bg-yellow-300 text-gray-900' : 'bg-blue-600 text-white'
                  }`}>
                    👤
                  </div>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div
                    className={`absolute end-0 z-10 mt-2 w-64 rounded-xl border-2 shadow-xl ${
                      darkMode 
                        ? 'border-gray-700 bg-gray-900' 
                        : 'border-gray-200 bg-white'
                    }`}
                    role="menu"
                  >
                    <div className="p-3">
                      <Link
                        href="/profile"
                        className={`block rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        role="menuitem"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        className={`block rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <Link
                        href="/my-posts"
                        className={`block rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        role="menuitem"
                      >
                        My Posts
                      </Link>
                      <Link
                        href="/help"
                        className={`block rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        role="menuitem"
                      >
                        Help Center
                      </Link>
                      <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                      <button
                        type="button"
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
                          darkMode 
                            ? 'text-red-400 hover:bg-red-600/10' 
                            : 'text-red-700 hover:bg-red-50'
                        }`}
                        role="menuitem"
                        onClick={() => alert('Logout clicked!')}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="flex items-center relative">
            <span className={`absolute left-4 text-lg pointer-events-none ${
              darkMode ? 'text-yellow-300' : 'text-blue-500'
            }`}>🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 text-sm transition-all duration-200 ${
                darkMode 
                  ? 'bg-gray-800 text-gray-100 border-gray-700 focus:border-yellow-300' 
                  : 'bg-gray-50 text-gray-800 border-gray-200 focus:border-blue-500'
              } outline-none focus:shadow-sm`}
            />
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="sm:hidden flex items-center justify-center gap-3 pb-4">
          <button 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-medium text-sm ${
              darkMode 
                ? 'border-yellow-300 bg-gray-800 text-yellow-300' 
                : 'border-blue-500 bg-blue-50 text-blue-600'
            }`}
            onClick={() => alert('Language toggle clicked!')}
          >
            <span>🌐</span>
            <span>EN | HI</span>
          </button>
          
          <button 
            className={`p-3 rounded-xl ${
              darkMode ? 'text-gray-100 bg-gray-800' : 'text-blue-600 bg-gray-50'
            }`}
            onClick={() => alert('Notifications clicked!')}
          >
            <span className="text-lg">🔔</span>
          </button>
          
          <button 
            className={`p-3 rounded-xl ${
              darkMode ? 'text-yellow-300 bg-gray-800' : 'text-yellow-600 bg-gray-50'
            }`}
            onClick={onThemeToggle}
          >
            <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;