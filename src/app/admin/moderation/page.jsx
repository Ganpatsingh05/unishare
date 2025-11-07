"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Trash2, 
  AlertTriangle,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Search,
  MoreVertical,
  Ban,
  Archive
} from "lucide-react";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import AdminLoader, { AdminTableSkeleton } from "../_components/AdminLoader";

// Mock moderation data - replace with real API
const mockReports = [
  {
    id: 1,
    type: "inappropriate_content",
    category: "rideshare",
    reportedBy: "john.doe@university.edu",
    reportedUser: "bad.actor@university.edu",
    content: "Inappropriate ride post with offensive language and inappropriate requests",
    contentId: "ride_123",
    status: "pending",
    priority: "high",
    createdAt: "2024-02-15T10:30:00Z",
    updatedAt: "2024-02-15T10:30:00Z",
    reason: "Contains offensive language and inappropriate content",
    screenshots: ["screenshot1.jpg"]
  },
  {
    id: 2,
    type: "spam",
    category: "marketplace",
    reportedBy: "jane.smith@university.edu", 
    reportedUser: "spammer@university.edu",
    content: "Repeated posting of the same item multiple times across different categories",
    contentId: "item_456",
    status: "reviewing",
    priority: "medium",
    createdAt: "2024-02-14T15:20:00Z",
    updatedAt: "2024-02-15T09:15:00Z",
    reason: "Spam posting - same content posted 5 times",
    screenshots: []
  },
  {
    id: 3,
    type: "harassment",
    category: "lost-found", 
    reportedBy: "mike.wilson@university.edu",
    reportedUser: "harasser@university.edu",
    content: "User sending harassing messages through lost & found posts",
    contentId: "lost_789",
    status: "resolved",
    priority: "high",
    createdAt: "2024-02-13T08:45:00Z",
    updatedAt: "2024-02-14T16:30:00Z",
    reason: "Harassment via direct messages",
    action: "User suspended for 7 days",
    screenshots: ["dm1.jpg", "dm2.jpg"]
  },
  {
    id: 4,
    type: "scam",
    category: "marketplace",
    reportedBy: "sarah.jones@university.edu",
    reportedUser: "scammer@university.edu", 
    content: "Fake item listing with stolen photos, requesting payment upfront",
    contentId: "item_101",
    status: "pending",
    priority: "high",
    createdAt: "2024-02-15T14:20:00Z",
    updatedAt: "2024-02-15T14:20:00Z",
    reason: "Suspected scam - fake photos and upfront payment requests",
    screenshots: ["fake_item.jpg"]
  },
  {
    id: 5,
    type: "misinformation",
    category: "announcements",
    reportedBy: "admin@university.edu",
    reportedUser: "misinformer@university.edu",
    content: "Posting false information about university policies and procedures", 
    contentId: "announcement_202",
    status: "reviewing",
    priority: "medium",
    createdAt: "2024-02-12T11:10:00Z",
    updatedAt: "2024-02-15T08:00:00Z",
    reason: "Spreading misinformation about university policies",
    screenshots: []
  }
];

export default function AdminModeration() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedReports, setSelectedReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const { getAdminReports } = await import("../../lib/api");
        const response = await getAdminReports({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          category: categoryFilter !== 'all' ? categoryFilter : undefined,
          priority: priorityFilter !== 'all' ? priorityFilter : undefined,
          limit: 100
        });
        
        if (response.success) {
          const reportsData = response.reports || [];
          setReports(reportsData);
          setFilteredReports(reportsData);
        } else {
          throw new Error(response.message || 'Failed to fetch reports');
        }
      } catch (error) {
        // Silently handle error
        // Fall back to mock data if there's an error
        setReports(mockReports);
        setFilteredReports(mockReports);
      }
      setLoading(false);
    };

    fetchReports();
  }, [statusFilter, categoryFilter, priorityFilter]);

  // Filter reports
  useEffect(() => {
    let filtered = reports.filter(report => {
      const matchesSearch = 
        report.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reportedUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || report.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
      const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });

    setFilteredReports(filtered);
  }, [reports, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      dismissed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
      medium: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    };
    return badges[priority] || badges.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      rideshare: "🚗",
      marketplace: "🛍️", 
      "lost-found": "🔍",
      announcements: "📢"
    };
    return icons[category] || "📝";
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleSelectAll = () => {
    if (selectedReports.length === filteredReports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(filteredReports.map(report => report.id));
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      const { updateReportStatus } = await import("../../lib/api");
      await updateReportStatus(reportId, "resolved", action, `Report resolved with action: ${action}`);
      
      // Update local state
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "resolved", action, updatedAt: new Date().toISOString() }
          : report
      ));
    } catch (error) {
      // Silently handle error
      alert('Failed to resolve report: ' + error.message);
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      const { updateReportStatus } = await import("../../lib/api");
      await updateReportStatus(reportId, "dismissed", "no_action", "Report dismissed - no action required");
      
      // Update local state
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "dismissed", updatedAt: new Date().toISOString() }
          : report
      ));
    } catch (error) {
      // Silently handle error
      alert('Failed to dismiss report: ' + error.message);
    }
  };

  const ReportRow = ({ report }) => (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selectedReports.includes(report.id)}
          onChange={() => handleSelectReport(report.id)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getCategoryIcon(report.category)}</div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              Report #{report.id}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {report.type.replace(/_/g, ' ')}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="max-w-xs">
          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
            {report.content}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Reason: {report.reason}
          </p>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm">
          <div className="text-gray-900 dark:text-white">
            Reported: {report.reportedUser.split('@')[0]}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            By: {report.reportedBy.split('@')[0]}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadge(report.priority)}`}>
          {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(report.status)}`}>
          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {new Date(report.createdAt).toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
            <Eye className="w-4 h-4" />
          </button>
          {report.status === "pending" && (
            <>
              <button 
                onClick={() => handleResolveReport(report.id, "Content removed")}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDismissReport(report.id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </>
          )}
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
                Content Moderation
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Review and moderate reported content across the platform
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                <Filter className="w-4 h-4 mr-2" />
                Advanced Filters
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Pending Reports
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {reports.filter(r => r.status === 'pending').length}
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
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Under Review
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {reports.filter(r => r.status === 'reviewing').length}
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
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Resolved Today
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {reports.filter(r => r.status === 'resolved').length}
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
                    <Flag className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        High Priority
                      </dt>
                      <dd className="text-lg font-medium text-gray-900 dark:text-white">
                        {reports.filter(r => r.priority === 'high').length}
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
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="reviewing">Under Review</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="rideshare">Rideshare</option>
                    <option value="marketplace">Marketplace</option>
                    <option value="lost-found">Lost & Found</option>
                    <option value="announcements">Announcements</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedReports.length === filteredReports.length && filteredReports.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
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
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    filteredReports.map((report) => <ReportRow key={report.id} report={report} />)
                  )}
                </tbody>
              </table>
            </div>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {selectedReports.length} report{selectedReports.length !== 1 ? 's' : ''} selected
                  </span>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300">
                      <Ban className="w-4 h-4 mr-1" />
                      Take Action
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
