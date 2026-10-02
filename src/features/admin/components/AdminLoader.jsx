"use client";

import { Loader2 } from "lucide-react";

// Simple, efficient loading component for admin panel
// No fancy animations, just functional loading states
export default function AdminLoader({ 
  text = "Loading...", 
  variant = "spinner", 
  size = "default",
  fullPage = false 
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6", 
    large: "w-8 h-8"
  };

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      {variant === "spinner" && (
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400`} />
      )}
      {variant === "dots" && (
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
        </div>
      )}
      {variant === "pulse" && (
        <div className={`${sizeClasses[size]} bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse`}></div>
      )}
      <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {text}
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <LoaderContent />
    </div>
  );
}

// Inline loading component for table rows or small sections
export function AdminInlineLoader({ text = "Loading...", className = "" }) {
  return (
    <div className={`flex items-center gap-2 text-gray-600 dark:text-gray-400 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}

// Text-only loader for use inside <p> tags or inline text
export function AdminTextLoader({ text = "Loading...", className = "" }) {
  return (
    <span className={`text-gray-600 dark:text-gray-400 ${className}`}>
      {text}
    </span>
  );
}

// Skeleton loading for table rows
export function AdminTableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div 
              key={j} 
              className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
