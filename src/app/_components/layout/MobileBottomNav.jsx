"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  HouseIcon,
  UserIcon,
  ClockCounterClockwiseIcon,
  GearIcon
} from "@phosphor-icons/react";
import { useUI } from "./../../lib/contexts/UniShareContext";

export default function MobileBottomNav() {
  const { darkMode } = useUI();
  const pathname = usePathname();

  // Hide on auth pages (login/register) and admin pages
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isAdminPage = pathname?.startsWith("/admin");
  
  if (isAuthPage || isAdminPage) {
    return null;
  }

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
      icon: HouseIcon,
      color: 'blue'
    },
    { 
      name: 'Profile', 
      href: '/profile', 
      icon: UserIcon,
      color: 'green'
    },
    { 
      name: 'Activity', 
      href: '/my-activity', 
      icon: ClockCounterClockwiseIcon,
      color: 'purple'
    },
    { 
      name: 'Settings', 
      href: '/settings', 
      icon: GearIcon,
      color: 'yellow'
    }
  ];

  const getColorClasses = (color, active = false) => {
    const colorMap = {
      blue: {
        active: darkMode ? 'text-blue-400 bg-blue-500/20' : 'text-blue-600 bg-blue-100',
        inactive: darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
      },
      purple: {
        active: darkMode ? 'text-purple-400 bg-purple-500/20' : 'text-purple-600 bg-purple-100',
        inactive: darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-500 hover:text-purple-600'
      },
      yellow: {
        active: darkMode ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-100',
        inactive: darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-500 hover:text-yellow-600'
      },
      green: {
        active: darkMode ? 'text-green-400 bg-green-500/20' : 'text-green-600 bg-green-100',
        inactive: darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-600'
      }
    };
    
    return active ? colorMap[color].active : colorMap[color].inactive;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-3 pb-3 pointer-events-none">
      <div className={`mobile-bottom-nav rounded-[20px] pointer-events-auto border backdrop-blur-2xl shadow-2xl ${
        darkMode 
          ? 'supports-[backdrop-filter]:bg-black/50 bg-black/80 border-white/10' 
          : 'bg-white/30 border-white/20'
      }`}
      style={{
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      }}
      >
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-[14px] transition-all duration-300 group flex-1 ${
                  active 
                    ? getColorClasses(item.color, true)
                    : getColorClasses(item.color, false)
                }`}
              >
                <Icon 
                  className={`transition-all duration-300 ${
                    active ? 'mb-0.5' : ''
                  }`}
                  size={24}
                  weight={active ? 'bold' : 'regular'}
                />
                <span className="text-[9px] font-semibold tracking-tight mt-0.5">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
