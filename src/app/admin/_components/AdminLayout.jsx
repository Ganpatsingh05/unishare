"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Shield, 
  Settings, 
  FileText,
  Phone, 
  Car, 
  Package, 
  Search,   
  Menu,
  X,
  LogOut,
  Home,
  Bell,
  Activity,
  Megaphone,
  BookOpen,
  NotebookPen
} from "lucide-react";
import { useAuth, useUI } from "../../lib/contexts/UniShareContext";

const adminNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview and statistics"
  },
  {
    title: "User Management", 
    href: "/admin/users",
    icon: Users,
    description: "Manage users and roles"
  },
  {
    title: "Analytics",
    href: "/admin/analytics", 
    icon: BarChart3,
    description: "System analytics and reports"
  },
  {
    title: "Announcements",
    href: "/admin/announcements",
    icon: Megaphone,
    description: "Manage site-wide notices"
  },
  {
    title: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    description: "Broadcast notifications"
  },
  {
    title: "Notice",
    href: "/admin/notice",
    icon: NotebookPen,
    description: "Manage system notices"
  },
  {
    title: "Contacts",
    href: "/admin/contacts",
    icon: Phone,
    description: "Manage public directory"
  },
  {
    title: "Resources & Notes",
    href: "/admin/resources",
    icon: BookOpen,
    description: "Manage shared resources and notes"
  },
  {
    title: "Content Moderation",
    href: "/admin/moderation",
    icon: Shield,
    description: "Moderate posts and reports"
  },
  {
    title: "Lost & Found",
    href: "/admin/moderation/lost-found",
    icon: Search,
    description: "Moderate lost-found items"
  },
  {
    title: "Rideshare",
    href: "/admin/moderation/rideshare", 
    icon: Car,
    description: "Moderate ride posts"
  },
  {
    title: "Marketplace",
    href: "/admin/moderation/marketplace",
    icon: Package,
    description: "Moderate marketplace items"
  },
  {
    title: "Tickets",
    href: "/admin/moderation/ticket",
    icon: FileText,
    description: "Moderate ticket listings"
  },
  {
    title: "Rooms",
    href: "/admin/moderation/rooms",
    icon: Home,
    description: "Moderate room listings"
  }
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { darkMode } = useUI();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock notifications - replace with real data
  useEffect(() => {
    setNotifications([
      { id: 1, type: "warning", message: "3 reports pending review", time: "2 min ago" },
      { id: 2, type: "info", message: "New user registrations: 15", time: "1 hour ago" },
      { id: 3, type: "success", message: "System backup completed", time: "3 hours ago" }
    ]);
  }, []);

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex flex-col`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                UniShare Admin
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Control Panel
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Admin User Info */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name || 'Admin User'}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.email || 'admin@unishare.com'}
              </p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive(item.href)
                  ? darkMode
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                  : darkMode
                    ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${
                isActive(item.href) 
                  ? darkMode ? 'text-white' : 'text-blue-700'
                  : darkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'
              }`} />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className={`text-xs ${
                  isActive(item.href)
                    ? darkMode ? 'text-blue-200' : 'text-blue-600'
                    : darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Back to Site</span>
          </Link>
          
          <button className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mt-2 ${
            darkMode 
              ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' 
              : 'text-red-600 hover:bg-red-50'
          }`}>
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 sm:px-6 py-4 flex-shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {adminNavItems.find(item => isActive(item.href))?.title || 'Admin Dashboard'}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>
                  {adminNavItems.find(item => isActive(item.href))?.description || 'Manage your UniShare platform'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>

              {/* System Status */}
              <div className="hidden sm:flex items-center space-x-2">
                <Activity className="w-4 h-4 text-green-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  All Systems Operational
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}