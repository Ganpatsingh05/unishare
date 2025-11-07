"use client";

import RequestManager from "./../../../../_components/forms/RequestManager";
import SmallFooter from "./../../../../_components/layout/SmallFooter";
import ShareRideTheme from "./../../../../_components/ServicesTheme/EarthTheme";

export default function ShareRideRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ShareRide Theme */}
      <ShareRideTheme />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <RequestManager 
            module="shareride"
            title="Share Ride Requests"
            className="mb-8"
          />
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}
