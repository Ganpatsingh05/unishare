"use client";

import { useEffect, useState } from "react";
import { useAuth, useUI } from '@contexts/UniShareContext';
import { useRouter } from "next/navigation";
import { consoleVars } from "../console/consoleData";
import { checkAdminStatus } from '@lib/api/api';

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

        // Ask the backend; it checks the admin list on the server
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
        router.push('/login?redirect=' + encodeURIComponent('/console'));
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
        message="Sign in with a Console account to continue." 
        showLoginButton={true}
      />
    );
  }

  // If authenticated but not admin, show access denied
  if (!isAdmin) {
    return (
      <AdminAccessDenied 
        message={`You are signed in as ${user?.email || 'an unknown account'}, which does not have Console access.`}
        showLoginButton={false}
      />
    );
  }

  return <>{children}</>;
}

// The guard's own screens, in the console's look.
function GuardScreen({ children }) {
  const { darkMode } = useUI();
  return (
    <div style={consoleVars(darkMode)} className="fixed inset-0 z-[60] grid place-items-center bg-[var(--c-bg)] p-6 text-[var(--c-text)]" >
      <div className="w-full max-w-[380px]">{children}</div>
    </div>
  );
}

function AdminLoadingScreen() {
  return (
    <GuardScreen>
      <p role="status" className="text-center text-[14px] text-[var(--c-muted)]">Checking your access…</p>
    </GuardScreen>
  );
}

function AdminAccessDenied({ message, showLoginButton = true }) {
  const router = useRouter();
  return (
    <GuardScreen>
      <p className="text-[14px] font-semibold text-[var(--c-bad)]">Restricted</p>
      <h1 className="mt-2 text-[24px] font-semibold tracking-[-0.02em]">This is the UniShare Console.</h1>
      <p className="mt-2 text-[14px] leading-relaxed text-[var(--c-muted)]">{message}</p>
      <div className="mt-6 flex gap-2">
        {showLoginButton ? (
          <button type="button" onClick={() => router.push('/login?redirect=' + encodeURIComponent('/console'))} className="h-9 rounded-[8px] bg-[var(--c-text)] px-4 text-[13px] font-semibold text-[var(--c-bg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]">
            Sign in
          </button>
        ) : null}
        <button type="button" onClick={() => router.push('/')} className="h-9 rounded-[8px] border border-[var(--c-line)] px-4 text-[13px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]">
          Back to UniShare
        </button>
      </div>
    </GuardScreen>
  );
}
