"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX, 
  Mail, 
  Calendar,
  Eye,
  Download,
  UserPlus,
  Settings
} from "lucide-react";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import AdminLoader, { AdminTableSkeleton } from "../_components/AdminLoader";


// Mock user data - replace with real API
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-02-15",
    postsCount: 12,
    ridesCount: 5,
    avatar: null
  },
  {
    id: 2,
    name: "Jane Smith", 
    email: "jane.smith@university.edu",
    role: "student",
    status: "active",
    joinDate: "2024-01-20",
    lastActive: "2024-02-14",
    postsCount: 8,
    ridesCount: 3,
    avatar: null
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike.wilson@university.edu", 
    role: "moderator",
    status: "active",
    joinDate: "2023-09-10",
    lastActive: "2024-02-15",
    postsCount: 25,
    ridesCount: 10,
    avatar: null
  },
  {
    id: 4,
    name: "Sarah Jones",
    email: "sarah.jones@university.edu",
    role: "student", 
    status: "suspended",
    joinDate: "2024-02-01",
    lastActive: "2024-02-10",
    postsCount: 2,
    ridesCount: 0,
    avatar: null
  },
  {
    id: 5,
    name: "Alex Brown",
    email: "alex.brown@university.edu",
    role: "student",
    status: "pending",
    joinDate: "2024-02-14",
    lastActive: "2024-02-14", 
    postsCount: 0,
    ridesCount: 0,
    avatar: null
  }
];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch users from backend API
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // First check if backend URL is configured
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        if (!backendUrl) {
          throw new Error('Backend URL not configured. Please set NEXT_PUBLIC_BACKEND_URL in .env.local file.');
        }

        const { getAdminUsers } = await import("../../lib/api");
        const response = await getAdminUsers();
        
        if (response.success) {
          
          // Transform backend user data to match frontend expectations
          const transformedUsers = (response.users || []).map(user => ({
            ...user,
            // Map backend fields to frontend expected fields
            id: user.id || user.user_id || Math.random().toString(),
            name: user.name || user.display_name || user.username || 'Unknown User',
            email: user.email || 'No email',
            role: user.role || 'user',
            status: user.status || user.is_active ? 'active' : 'inactive',
            joinDate: user.created_at || user.join_date || new Date().toISOString(),
            lastActive: user.updated_at || user.last_login || user.last_active || new Date().toISOString(),
            postsCount: user.posts_count || user.postsCount || 0,
            ridesCount: user.rides_count || user.ridesCount || 0,
            picture: user.picture || user.avatar || null
          }));

          setUsers(transformedUsers);
          setFilteredUsers(transformedUsers);
        } else {
          throw new Error(response.message || 'Failed to fetch users');
        }
      } catch (error) {
        // Silently handle error
        // Handle specific error cases
        if (error.message.includes('Authentication required')) {
          alert('Please login to access admin panel');
        } else if (error.message.includes('Access denied')) {
          alert('You do not have admin privileges to view users');
        } else {
          alert('Failed to load users: ' + error.message);
        }
        // Fallback to mock data for development
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, statusFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300", 
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    return badges[status] || badges.active;
  };

  const getRoleBadge = (role) => {
    const badges = {
      student: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      moderator: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      admin: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    };
    return badges[role] || badges.student;
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const UserRow = ({ user }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedUsers.includes(user.id)}
          onChange={() => handleSelectUser(user.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {user.name ? user.name.split(' ').map(n => n[0] || '').join('') : (user.email ? user.email[0].toUpperCase() : 'U')}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.name || user.email || 'Unknown User'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.email || 'No email'}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role || 'user')}`}>
          {user.role ? (user.role.charAt(0).toUpperCase() + user.role.slice(1)) : 'User'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status || 'active')}`}>
          {user.status ? (user.status.charAt(0).toUpperCase() + user.status.slice(1)) : 'Active'}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 
         user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 
         user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        <div className="flex space-x-4">
          <span>Posts: {user.postsCount || 0}</span>
          <span>Rides: {user.ridesCount || 0}</span>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage user accounts, roles, and permissions
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Debug Tool - Temporary for troubleshooting */}


          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Total Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Active Users
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.filter(u => u.status === 'active').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserX className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Suspended
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.filter(u => u.status === 'suspended').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Moderators
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {users.filter(u => u.role === 'moderator').length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex space-x-3">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="student">Student</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Join Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4">
                        <AdminTableSkeleton rows={5} cols={8} />
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => <UserRow key={user.id} user={user} />)
                  )}
                </tbody>
              </table>
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                      <UserCheck className="w-4 h-4 mr-1" />
                      Activate
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">
                      <UserX className="w-4 h-4 mr-1" />
                      Suspend
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}