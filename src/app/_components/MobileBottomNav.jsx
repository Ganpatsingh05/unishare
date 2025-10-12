"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  User,
  Activity,
  Settings
} from 'lucide-react';
import { useUI } from "../lib/contexts/UniShareContext";

export default function MobileBottomNav() {
  const { darkMode } = useUI();
  const pathname = usePathname();

  // Check if current path matches the nav item
  const isActive = (path) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const navItems = [
    { 
      name: 'Home', 
      href: '/', 
      icon: Home,
      color: 'yellow'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: User,
      color: 'blue'
    },
    { 
      name: 'Activity', 
      href: '/my-activity', 
      icon: Activity,
      color: 'green'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: Settings,
      color: 'purple'
    }
  ];

  const getColorClasses = (color, active = false) => {
    const colorMap = {
      yellow: {
        active: darkMode ? 'text-yellow-300 bg-yellow-300/20' : 'text-yellow-600 bg-yellow-100',
        inactive: darkMode ? 'text-gray-400 hover:text-yellow-300 hover:bg-gray-800/50' : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
      },
      blue: {
        active: darkMode ? 'text-blue-300 bg-blue-300/20' : 'text-blue-600 bg-blue-100',
        inactive: darkMode ? 'text-gray-400 hover:text-blue-300 hover:bg-gray-800/50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      },
      green: {
        active: darkMode ? 'text-green-300 bg-green-300/20' : 'text-green-600 bg-green-100',
        inactive: darkMode ? 'text-gray-400 hover:text-green-300 hover:bg-gray-800/50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
      },
      purple: {
        active: darkMode ? 'text-purple-300 bg-purple-300/20' : 'text-purple-600 bg-purple-100',
        inactive: darkMode ? 'text-gray-400 hover:text-purple-300 hover:bg-gray-800/50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
      }
    };
    
    return active ? colorMap[color].active : colorMap[color].inactive;
  };

  return (
    <div className={`mobile-bottom-nav fixed bottom-0 left-0 right-0 z-[10000] md:hidden ${
      darkMode 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    } border-t backdrop-blur-lg shadow-2xl`}>
      <div className="flex items-center justify-around py-2 px-4 safe-area-pb">
        
        {navItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 group min-w-0 flex-1 ${
                getColorClasses(item.color, active)
              }`}
            >
              <Icon className={`w-5 h-5 mb-1 transition-transform duration-200 ${
                active ? 'scale-110' : 'group-hover:scale-110'
              }`} />
              <span className={`text-xs font-medium truncate ${
                active ? 'font-semibold' : ''
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>
    </div>
  );
}