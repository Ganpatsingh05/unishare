"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, 
  Car, 
  Package, 
  Search, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  BarChart3,
  Eye,
  MessageSquare,
  ArrowRight,
  Bell,
  Shield,
  UserPlus,
  Server,
  Home
} from "lucide-react";
import AdminGuard from "./_components/AdminGuard";
import AdminLayout from "./_components/AdminLayout";

import AdminLoader from "./_components/AdminLoader";
import { useAuth } from "../lib/contexts/UniShareContext";

const quickActions = [
  { title: "User Management", href: "/admin/users", icon: Users, description: "Manage users and roles", color: "bg-blue-500" },
  { title: "Content Moderation", href: "/admin/moderation", icon: Shield, description: "Review reported content", color: "bg-red-500" },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3, description: "View platform insights", color: "bg-green-500" },
  { title: "System Health", href: "/admin/system", icon: Activity, description: "Monitor system status", color: "bg-purple-500" }
];

// Helper function to get icon component from string
const getIconComponent = (iconName) => {
  const iconMap = {
    'Users': Users,
    'Car': Car,
    'Package': Package,
    'Search': Search,
    'AlertTriangle': AlertTriangle,
    'Activity': Activity,
    'MessageSquare': MessageSquare,
    'Eye': Eye
  };
  return iconMap[iconName] || Users; // Default to Users icon
};

export default function AdminDashboard() {
  const { isAuthenticated, authLoading, user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    recentSignups: 0,
    totalRooms: 0,
    activeRooms: 0,
    systemUptime: "Loading..."
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch data if authentication is still loading or user is not authenticated
      if (authLoading || !isAuthenticated || !user) {
        return;
      }
      setLoading(true);
      try {
        const { getAdminAnalytics, getAdminUsers, getAdminRecentActivity, getAdminReports, fetchhousedata } = await import("../lib/api");
        
        // Fetch analytics data from new API endpoint
        const analyticsResponse = await getAdminAnalytics();
        
        // Fetch rooms data
        let roomsData = [];
        let totalRooms = 0;
        let activeRooms = 0;
        
        try {
          const roomsResponse = await fetchhousedata();
          if (roomsResponse.data) {
            roomsData = roomsResponse.data;
            totalRooms = roomsData.length;
            // Calculate active rooms (assuming available status means active)
            activeRooms = roomsData.filter(room => 
              room.status === 'available' || room.status === 'active' || !room.status
            ).length;
            setRooms(roomsData);
          }
        } catch (roomError) {
          // Silently handle rooms data fetch errors
        }
        
        // Fetch reports data for stats
        let totalReports = 0;
        let pendingReports = 0;
        try {
          const reportsResponse = await getAdminReports();
          if (reportsResponse.success && reportsResponse.reports) {
            totalReports = reportsResponse.reports.length;
            pendingReports = reportsResponse.reports.filter(report => 
              report.status === 'pending' || !report.status
            ).length;
          }
        } catch (reportsError) {
          // Silently handle reports data fetch errors
        }
        
        if (analyticsResponse.success) {
          const { overview, userStats, systemStats } = analyticsResponse.analytics;
          
          // Set stats from analytics API including rooms and reports data
          setStats({
            totalUsers: overview.totalUsers || 0,
            activeUsers: overview.activeUsers || 0,
            recentSignups: userStats?.monthlySignups?.[userStats.monthlySignups.length - 1] || 0,
            totalRooms: totalRooms,
            activeRooms: activeRooms,
            totalReports: totalReports,
            pendingReports: pendingReports,
            systemUptime: systemStats.uptime ? `${systemStats.uptime}%` : "99.8%"
          });
          
          // Also fetch users for any legacy components that might need it
          try {
            const usersResponse = await getAdminUsers();
            if (usersResponse.success) {
              setUsers(usersResponse.users);
            }
          } catch (userError) {
            // Silently handle users data fetch errors
          }
          
          setError(null);
        } else {
          throw new Error(analyticsResponse.message || 'Failed to fetch analytics data');
        }

        // Fetch recent activity data
        setActivityLoading(true);
        try {
          const activityResponse = await getAdminRecentActivity(5);
          if (activityResponse.success) {
            setRecentActivity(activityResponse.activities);
          }
        } catch (activityError) {
          // Silently handle activity data fetch errors, no fallback needed
          setRecentActivity([]);
        }
        setActivityLoading(false);
      } catch (error) {
        // Handle authentication errors gracefully
        if (error.message.includes('Authentication required') || error.message.includes('401')) {
          setError('Authentication required. Please login to view admin dashboard.');
          return; // Don't set error stats, let AdminGuard handle authentication
        } else if (error.message.includes('Access denied') || error.message.includes('403')) {
          setError('Access denied. Admin privileges required.');
        } else {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [authLoading, isAuthenticated, user]);

  if (authLoading || loading) {
    return (
      <AdminGuard>
        <AdminLayout>
          <AdminLoader text={authLoading ? "Checking authentication..." : "Loading dashboard data..."} />
        </AdminLayout>
      </AdminGuard>
    );
  }

  // Show error message if there's an authentication error
  if (error && error.includes('Authentication required')) {
    return (
      <AdminGuard>
        <AdminLayout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="w-full space-y-6 sm:space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 sm:p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">UniShare Admin Dashboard</h1>
                <p className="text-blue-100 text-base sm:text-lg">
                  Welcome back! Here's what's happening with your platform today.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4 sm:space-x-6">
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-300" />
                      <span className="text-xs sm:text-sm font-medium">System Status</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold">Operational</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                      <span className="text-xs sm:text-sm font-medium">Last Update</span>
                    </div>
                    <div className="text-lg sm:text-xl font-bold">Just Now</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 lg:gap-6">
            {/* Total Users */}
            <div className="group bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-blue-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-blue-700 dark:text-blue-300 font-medium">Registered users</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-green-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2 uppercase tracking-wide">Active Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.activeUsers}
                  </p>
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-green-700 dark:text-green-300 font-medium">Last 30 days</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                  <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Total Reports */}
            <div className="group bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-red-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2 uppercase tracking-wide">Total Reports</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalReports}
                  </p>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium">Content reports</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Pending Reports */}
            <div className="group bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-yellow-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-2 uppercase tracking-wide">Pending Reports</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.pendingReports}
                  </p>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 font-medium">Needs review</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-yellow-500 to-amber-600 shadow-lg group-hover:shadow-yellow-500/25 transition-all duration-300">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Total Rooms */}
            <div className="group bg-gradient-to-br from-orange-50 to-amber-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-orange-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">Total Rooms</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.totalRooms}
                  </p>
                  <div className="flex items-center">
                    <Home className="w-4 h-4 text-orange-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-orange-700 dark:text-orange-300 font-medium">Room listings</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg group-hover:shadow-orange-500/25 transition-all duration-300">
                  <Home className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Active Rooms */}
            <div className="group bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-4 sm:p-6 border border-teal-200/50 dark:border-gray-600 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-2 uppercase tracking-wide">Active Rooms</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stats.activeRooms}
                  </p>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-teal-500 mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-teal-700 dark:text-teal-300 font-medium">Available rooms</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg group-hover:shadow-teal-500/25 transition-all duration-300">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-600">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="group relative overflow-hidden bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-50/50 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative">
                      <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                        <action.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {action.description}
                      </p>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Access Now</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-600">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white ml-4">Recent Activity</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Live</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold flex items-center space-x-1 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {activityLoading ? (
                // Enhanced loading skeleton for recent activity
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 animate-pulse">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 dark:from-gray-600 dark:via-gray-700 dark:to-gray-600 rounded animate-pulse" style={{animationDelay: `${index * 0.2}s`}}></div>
                      <div className="h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-800 dark:to-gray-700 rounded w-3/4 animate-pulse" style={{animationDelay: `${index * 0.3}s`}}></div>
                    </div>
                    <div className="w-16 h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse" style={{animationDelay: `${index * 0.1}s`}}></div>
                  </div>
                ))
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const IconComponent = getIconComponent(activity.icon);
                  return (
                    <div 
                      key={activity.id} 
                      className="group flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className={`p-3 rounded-xl ${activity.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white mb-1">
                          {activity.action}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span>by</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {activity.user.includes('@') ? activity.user.split('@')[0] : activity.user}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {activity.time}
                          </span>
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Activity className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No recent activity</h3>
                  <p className="text-gray-500 dark:text-gray-400">Activity will appear here as it happens on your platform</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
