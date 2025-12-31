"use client";

import { useEffect } from "react";
import { Coffee } from "lucide-react";

export default function BuyCoffeePage() {
  useEffect(() => {
    // Redirect to external buy coffee link
    window.location.href = "https://www.buymeacoffee.com/unishare";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center p-8">
        <Coffee className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-bounce" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Redirecting to Buy Me a Coffee...
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for your support! ☕
        </p>
      </div>
    </div>
  );
}
