"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * Google OAuth Callback Handler
 * This page receives the OAuth code from Google and forwards it to the backend
 */
export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent double execution in development mode
    if (hasRun.current) return;
    hasRun.current = true;

    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      console.error("Google OAuth error:", error);
      router.push("/login?error=oauth_failed");
      return;
    }

    if (!code) {
      console.error("No OAuth code received");
      router.push("/login?error=no_code");
      return;
    }

    // Forward the code to backend by redirecting to backend callback
    const backendCallbackUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/callback?code=${encodeURIComponent(code)}`;
    
    // Get the redirect URL from session storage if it exists
    const redirectAfterLogin = sessionStorage.getItem('oauth_redirect') || '/';
    
    // Redirect to backend callback - backend will set the auth cookie and redirect back to frontend
    window.location.href = backendCallbackUrl;
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Completing Google Sign In...
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          Please wait while we authenticate you
        </p>
      </div>
    </div>
  );
}
