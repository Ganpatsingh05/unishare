"use client";

import RequestManager from "../../../_components/RequestManager";
import SmallFooter from "../../../_components/SmallFooter";

export default function AnnouncementRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Announcement Requests
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Announcement requests coming soon!
            </p>
          </div>
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}