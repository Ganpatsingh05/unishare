"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../lib/contexts/UniShareContext";
import { useRouter } from "next/navigation";
import { Shield, Lock, AlertTriangle } from "lucide-react";
import AdminLoader from "./AdminLoader";
import { checkAdminStatus } from "../../lib/api";

// Admin emails list - should match backend configuration
const ADMIN_EMAILS = [
  'itspracin750@gmail.com',
  'ask.gsinghr@gmail.com', 
  'mishrilalparihar30221@gmail.com',
  'sumanthjupudi22@gmail.com'
];

// Check if user has admin privileges using backend authentication
export const useAdminAuth = () => {
  const { user, isAuthenticated, authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      // Wait for authentication to complete
      if (authLoading) {
        setLoading(true);
        return;
      }

      try {


        if (!isAuthenticated || !user) {
          if (isMounted) {
            setIsAdmin(false);
            setLoading(false);
            setError(null);
          }
          return;
        }

        // Use backend admin check which validates against the same ADMIN_EMAILS list
        const { isAdmin: adminStatus, user: adminUser } = await checkAdminStatus();
        
        if (isMounted) {
          setIsAdmin(adminStatus);
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          setIsAdmin(false);
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAdmin();

    return () => {
      isMounted = false;
    };
  }, [user, isAuthenticated, authLoading]);

  return { isAdmin, loading: loading || authLoading, user, error };
};

// Admin Route Protection Component
export default function AdminGuard({ children }) {
  const router = useRouter();
  const { isAdmin, loading, user, error } = useAdminAuth();
  const { isAuthenticated } = useAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !hasRedirected) {
      if (!isAuthenticated) {
        setHasRedirected(true);
        router.push('/login?redirect=' + encodeURIComponent('/admin'));
        return;
      }
      
      if (!isAdmin) {

        // Don't redirect immediately, show access denied message instead
        return;
      }
    }
  }, [isAuthenticated, isAdmin, loading, router, hasRedirected, user]);

  // Show loading screen while authentication is being checked
  if (loading) {
    return <AdminLoadingScreen />;
  }

  // Handle authentication errors
  if (error) {
    return (
      <AdminAccessDenied 
        message={`Authentication Error: ${error}`}
        showLoginButton={error.includes('Authentication required')}
      />
    );
  }

  // If not authenticated, show login message instead of redirecting
  if (!isAuthenticated) {
    return (
      <AdminAccessDenied 
        message="Please login to access the admin panel" 
        showLoginButton={true}
      />
    );
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <AdminAccessDenied 
        message={`Access denied. Admin privileges required. Current user: ${user?.email || 'Unknown'}`}
        showLoginButton={false}
      />
    );
  }

  return <>{children}</>;
}

// Simple loading screen for admin authentication
function AdminLoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <AdminLoader text="Verifying admin access..." />
    </div>
  );
}

// Access denied screen
function AdminAccessDenied({ message, showLoginButton = true }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="relative mb-8">
          <Lock className="w-24 h-24 mx-auto text-red-400" />
          <AlertTriangle className="w-8 h-8 absolute -top-2 -right-2 text-yellow-400 animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-red-200 mb-8">{message}</p>
        
        {/* Info for non-admin users */}
        <div className="mb-6 p-3 bg-gray-800 rounded text-sm text-left">
          <p className="text-gray-300 mb-2"><strong>Admin Access Required</strong></p>
          <p className="text-gray-400">This area is restricted to authorized administrators only.</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-gray-500 text-xs mt-2">Dev Mode: Contact system admin for access</p>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Return to Home
          </button>
          {showLoginButton && (
            <button
              onClick={() => router.push('/login?redirect=' + encodeURIComponent('/admin'))}
              className="w-full px-6 py-3 border border-red-400 text-red-400 rounded-lg hover:bg-red-400 hover:text-white transition-colors"
            >
              Login as Admin
            </button>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400">
            Admin access is restricted to authorized personnel only. 
            Contact system administrators if you believe you should have access.
          </p>
        </div>
      </div>
    </div>
  );
}