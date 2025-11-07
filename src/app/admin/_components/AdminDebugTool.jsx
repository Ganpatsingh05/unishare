"use client";

import { useState } from "react";

export default function AdminDebugTool() {
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    const results = {};

    try {
      // Test 1: Check environment variables
      results.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'NOT CONFIGURED';
      
      // Test 2: Test basic API connectivity
      try {
        const { fetchCurrentUser } = await import("../../lib/api");
        const currentUser = await fetchCurrentUser();
        results.currentUser = currentUser ? 'User found' : 'No user authenticated';
        results.userEmail = currentUser?.email || 'No email';
      } catch (error) {
        results.currentUserError = error.message;
      }

      // Test 3: Test admin users endpoint
      try {
        const { getAdminUsers } = await import("../../lib/api");
        const adminUsersResponse = await getAdminUsers();
        results.adminUsersSuccess = adminUsersResponse.success;
        results.adminUsersCount = adminUsersResponse.users?.length || 0;
        results.adminUsersData = adminUsersResponse;
      } catch (error) {
        results.adminUsersError = error.message;
      }

      // Test 4: Test direct API call
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (backendUrl) {
          const response = await fetch(`${backendUrl}/auth/me`, {
            credentials: 'include'
          });
          const data = await response.json();
          results.directApiCall = { status: response.status, data };
        }
      } catch (error) {
        results.directApiError = error.message;
      }

      setTestResults(results);
    } catch (error) {
      results.generalError = error.message;
      setTestResults(results);
    }
    
    setTesting(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 m-4">
      <h2 className="text-xl font-bold mb-4">Admin Debug Tool</h2>
      
      <button
        onClick={runTests}
        disabled={testing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-4"
      >
        {testing ? 'Running Tests...' : 'Run Debug Tests'}
      </button>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Test Results:</h3>
          <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm overflow-auto max-h-96">
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
