"use client";

import Link from 'next/link';
import { Car, ShoppingCart, Tag, Search, Star, Home, Megaphone, BookOpen, Phone, Users, RotateCw, CheckCircle } from 'lucide-react';

const Main = ({ darkMode }) => {
  const sections = [
    {
      title: 'Share a Ride',
      description: 'Find or share info about destinations, connect with others to share taxi/auto fares.',
      icon: <Car className="w-10 h-10" />,
      href: '/share-ride'
    },
    {
      title: 'Buy Items',
      description: 'Browse and buy new or used items uploaded by users.',
      icon: <ShoppingCart className="w-10 h-10" />,
      href: '/marketplace/buy'
    },
    {
      title: 'Sell Items',
      description: 'Sell your unused or used items to others in the community.',
      icon: <Tag className="w-10 h-10" />,
      href: '/marketplace/sell'
    },
    {
      title: 'Report Lost Item',
      description: 'Report lost items and provide your info so others can help you recover them.',
      icon: <Search className="w-10 h-10" />,
      href: '/lost-found/report'
    },
    {
      title: 'Found Item',
      description: 'Share info about items you found so the rightful owner can claim them.',
      icon: <Star className="w-10 h-10" />,
      href: '/lost-found/found'
    },
    {
      title: 'Room & Roommate',
      description: 'Search for available rooms or roommates that match your preferences.',
      icon: <Home className="w-10 h-10" />,
      href: '/housing'
    },
    {
      title: 'Announcements',
      description: 'See important and urgent announcements from the community.',
      icon: <Megaphone className="w-10 h-10" />,
      href: '/announcements'
    },
    {
      title: 'Notes & Resources',
      description: 'Access notes, syllabus, PPTs, PDFs, previous year questions, and more.',
      icon: <BookOpen className="w-10 h-10" />,
      href: '/resources'
    },
    {
      title: 'Important Contacts',
      description: 'Find essential contacts and information for your locality or institution.',
      icon: <Phone className="w-10 h-10" />,
      href: '/contacts'
    }
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        Welcome to the Community Platform
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link key={index} href={section.href} className="block">
            <section 
              className={`rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer group h-full ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-750 shadow-gray-900/20' 
                  : 'bg-gray-100 hover:bg-white shadow-gray-900/10'
              }`}
            >
              <div className="mb-3 group-hover:scale-110 transition-transform duration-300">
                {section.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-3 ${
                darkMode ? 'text-yellow-300' : 'text-blue-600'
              }`}>
                {section.title}
              </h3>
              <p className={`leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {section.description}
              </p>
            </section>
          </Link>
        ))}
      </div>

      {/* Quick Stats Section */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Users', value: '2,500+', icon: <Users className="w-8 h-8" /> },
          { label: 'Items Traded', value: '850+', icon: <RotateCw className="w-8 h-8" /> },
          { label: 'Rides Shared', value: '1,200+', icon: <Car className="w-8 h-8" /> },
          { label: 'Items Found', value: '95%', icon: <CheckCircle className="w-8 h-8" /> }
        ].map((stat, index) => (
          <div key={index} className={`text-center p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white/80'
          }`}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${
              darkMode ? 'text-yellow-300' : 'text-blue-600'
            }`}>
              {stat.value}
            </div>
            <div className="text-sm opacity-75">{stat.label}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Main;
