"use client";

import React from "react";
import RequestManager from "../../../_components/RequestManager";
import SmallFooter from "../../../_components/SmallFooter";

export default function LostFoundRequestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <RequestManager 
            module="lostfound" 
            title="Lost & Found Requests"
            className="mb-8"
          />
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}
