'use client';

import React from 'react';
import Link from 'next/link';
import { Megaphone, PlusCircle, Eye } from 'lucide-react';
import { useUI } from '../lib/contexts/UniShareContext';
import Header from '../_components/Header';
import Footer from '../_components/Footer';

export default function AnnouncementsPage() {
  const { darkMode } = useUI();

  const titleClr = darkMode ? 'text-white' : 'text-gray-900';
  const textClr = darkMode ? 'text-gray-300' : 'text-gray-600';

  const cardBg = darkMode ? "bg-gray-900/70" : "bg-white/80";
  const cardBorder = darkMode ? "border-gray-800" : "border-gray-200";
  
  const cards = [
    {
      title: 'Submit Announcement',
      description: 'Create and share important announcements with the community',
      icon: <PlusCircle />,
      href: '/announcements/submit',
      gradient: 'from-blue-500 to-emerald-500',
      bgColor: cardBg,
      borderColor: cardBorder,
    },
    {
      title: 'View Announcements', 
      description: 'Browse all announcements and important updates',
      icon: <Eye />,
      href: '/announcements/show',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: cardBg,
      borderColor: cardBorder,
    },
  ];

  return (
    <div className="min-h-screen">
      
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Announcements</h1>
            <p className={`mt-2 text-sm sm:text-base ${textClr}`}>What would you like to do?</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {cards.map((card, index) => (
              <Link
                key={card.title}
                href={card.href}
                className={`group rounded-2xl border ${card.borderColor} ${card.bgColor} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient}`}>
                    {React.cloneElement(card.icon, { className: "w-5 h-5 text-white" })}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>{card.title}</h2>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${card.gradient === 'from-blue-500 to-emerald-500' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                        {card.title === 'Submit Announcement' ? 'Popular' : 'Browse'}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm ${textClr} line-clamp-2`}>
                      {card.description}
                    </p>
                    <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${card.gradient === 'from-blue-500 to-emerald-500' ? (darkMode ? 'text-blue-300' : 'text-blue-600') : (darkMode ? 'text-purple-300' : 'text-purple-600')}`}>
                      {card.title === 'Submit Announcement' ? 'Create announcement' : 'View all announcements'}
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Or divider */}
          <div className="my-8 flex items-center gap-3">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className={`text-xs ${textClr}`}>or</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          {/* Helpful tips */}
          <div className={`rounded-2xl border ${darkMode ? 'border-gray-800 bg-gray-900/60' : 'border-gray-200 bg-gray-50'} p-4 sm:p-5`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                <Megaphone className="w-4 h-4" />
              </div>
              <p className={`text-xs sm:text-sm ${textClr}`}>
                Community tip: Keep announcements clear and relevant. Use appropriate categories to help others find your updates easily.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
