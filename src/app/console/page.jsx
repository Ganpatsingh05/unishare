"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ConsoleOverview from "@features/admin/console/overview/ConsoleOverview";

export default function AdminOverviewPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ConsoleOverview />
      </AdminLayout>
    </AdminGuard>
  );
}
