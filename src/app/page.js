"use client";

import { useState } from 'react';
import Header from './_components/Header';
import Main from './_components/Main';
import Footer from './_components/Footer';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800'
    }`}>
      {/* Notice/Announcement Bar */}
      <div className="bg-yellow-300 py-2 text-center font-bold text-gray-800">
        🚨 Important Announcement: Welcome to our community platform! 🚨
      </div>

      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />
      
      {/* Quote Section */}
      <div className={`mx-auto mt-8 max-w-3xl rounded-2xl px-8 py-5 text-center text-xl font-semibold tracking-wide shadow-lg ${
        darkMode 
          ? 'bg-gray-800/90 text-yellow-300 shadow-gray-900/20' 
          : 'bg-white/85 text-blue-600 shadow-gray-900/10'
      }`}>
        <span>"From Rides to Rooms, Lost to Found — QuickCampus Connects It All."</span>
      </div>

      <Main darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}