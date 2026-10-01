// Admin Service - Admin panel APIs
export {
  getAdminUsers as fetchAllUsers,
  getAdminDashboardStats as fetchSystemStats,
  getAdminDashboardStats as fetchAuditLogs,
  getAdminUsers as getUserById,
  updateUserRole,
  updateUserStatus as deleteUser,
  suspendUser as moderateContent
} from './admin.service.js';
