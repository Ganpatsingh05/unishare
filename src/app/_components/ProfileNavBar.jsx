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

export default function ProfileNavBar() {
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
    <div className={`fixed bottom-0 left-0 right-0 z-50 md:hidden ${
      darkMode 
        ? 'bg-gray-900/95 border-gray-700' 
        : 'bg-white/95 border-gray-200'
    } border-t backdrop-blur-lg`}>
      <div className="flex items-center justify-around py-12 px-3">
        
        {/* Home Button */}
        <Link 
          href="/"
          className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 group min-w-0 flex-1 ${
            getColorClasses('yellow', isActive('/'))
          }`}
        >
          <Home className={`w-9 h-9 mb-3 transition-transform duration-200 ${
            isActive('/') ? 'scale-110' : 'group-hover:scale-110'
          }`} />
          <span className={`text-sm font-medium truncate ${
            isActive('/') ? 'font-semibold' : ''
          }`}>
            Home
          </span>
        </Link>

        {/* Profile Indicator (Current Page) */}
        <div className={`flex flex-col items-center py-3 px-4 rounded-xl min-w-0 flex-1 ${
          darkMode ? 'text-blue-300 bg-blue-300/20' : 'text-blue-600 bg-blue-100'
        }`}>
          <User className="w-9 h-9 mb-3 scale-110" />
          <span className="text-sm font-semibold truncate">
            Profile
          </span>
        </div>

        {/* Activity Button */}
        <Link 
          href="/my-activity"
          className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 group min-w-0 flex-1 ${
            getColorClasses('green', isActive('/my-activity'))
          }`}
        >
          <Activity className={`w-9 h-9 mb-3 transition-transform duration-200 ${
            isActive('/my-activity') ? 'scale-110' : 'group-hover:scale-110'
          }`} />
          <span className={`text-sm font-medium truncate ${
            isActive('/my-activity') ? 'font-semibold' : ''
          }`}>
            Activity
          </span>
        </Link>

        {/* Settings Button */}
        <Link 
          href="/settings"
          className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 group min-w-0 flex-1 ${
            getColorClasses('purple', isActive('/settings'))
          }`}
        >
          <Settings className={`w-9 h-9 mb-3 transition-transform duration-200 ${
            isActive('/settings') ? 'scale-110' : 'group-hover:scale-110'
          }`} />
          <span className={`text-sm font-medium truncate ${
            isActive('/settings') ? 'font-semibold' : ''
          }`}>
            Settings
          </span>
        </Link>

      </div>
    </div>
  );
}