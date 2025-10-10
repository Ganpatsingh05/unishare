"use client";

import RequestManager from "../../../_components/RequestManager";
import SmallFooter from "../../../_components/SmallFooter";

export default function RoomsRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <RequestManager 
            module="rooms" 
            title="Housing Requests"
            className="mb-8"
          />
        </div>
      </main>
      <div className="hidden md:block">
      <SmallFooter />
      </div>
    </div>
  );
}
