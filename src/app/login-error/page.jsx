"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages = {
    oauth_failed: "Google authentication failed. Please try again.",
    no_code: "No authorization code received from Google.",
    token_exchange_failed: "Failed to exchange authorization code for token.",
    invalid_token: "Invalid Google ID token.",
    default: "An error occurred during login. Please try again."
  };

  const message = errorMessages[error] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Login Failed
          </h1>

          {/* Error Message */}
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Login
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium transition-all duration-200"
            >
              Go to Home
            </button>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && error && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Error Code: {error}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
