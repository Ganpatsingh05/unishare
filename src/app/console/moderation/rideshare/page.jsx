"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ListingModeration, { Mono, day, when } from "@features/admin/console/ListingModeration";
import { fetchRides, deleteRide } from "@features/rides/services/rides.service";

const departs = (r) => when(r.date, r.time);
const upcoming = (r, now) => (departs(r)?.getTime() ?? 0) >= now;
const driver = (r) => r.users?.name || r.driver_name || null;
const STATUS_TONE = { active: "good", completed: "info", cancelled: "bad" };

const config = {
  title: "Rides",
  lead: "Every ride offer students have posted. Open one to check the details, delete it if it breaks the rules.",
  noun: { one: "ride", many: "rides", column: "Route" },

  // fetchRides and deleteRide report failure as { success: false, error } instead of throwing.
  load: async () => {
    const res = await fetchRides();
    if (!res?.success) throw new Error(res?.error || "Couldn't load rides.");
    return res.data || [];
  },
  remove: async (r) => {
    const res = await deleteRide(r.id);
    if (res && res.success === false) throw new Error(res.error || "Couldn't delete the ride.");
  },

  tabs: [
    { value: "upcoming", label: "Upcoming", test: (r, now) => upcoming(r, now) },
    { value: "past", label: "Past", test: (r, now) => !upcoming(r, now) },
    { value: "all", label: "All", test: () => true },
  ],
  search: (r) => [r.from_location, r.to_location, driver(r), r.vehicle_info].filter(Boolean).join(" "),
  searchPlaceholder: "Search from, to or driver",
  stats: (items, now) => [
    { label: "All rides", value: items.length },
    { label: "Upcoming", value: items.filter((r) => upcoming(r, now)).length },
    { label: "Past, still listed", value: items.filter((r) => !upcoming(r, now)).length, mark: true },
    { label: "Fully booked", value: items.filter((r) => upcoming(r, now) && Number(r.available_seats) === 0).length },
  ],

  name: (r) => (r.from_location || r.to_location ? `${r.from_location || "—"} → ${r.to_location || "—"}` : null),
  subtitle: (r) => r.vehicle_info || null,
  owner: driver,
  price: (r) => r.price,
  status: (r) => (r.status ? { label: r.status, tone: STATUS_TONE[r.status] || "neutral" } : null),
  posted: (r) => r.created_at,
  updated: (r) => r.updated_at,
  columns: [
    { label: "Departs", mono: true, render: (r) => (r.date ? `${day(r.date)}${r.time ? ` · ${String(r.time).slice(0, 5)}` : ""}` : null) },
    { label: "Seats free", align: "right", mono: true, render: (r) => (r.seats != null ? `${r.available_seats ?? "—"}/${r.seats}` : null) },
  ],

  facts: (r) => [
    ["From", r.from_location || "—"],
    ["To", r.to_location || "—"],
    ["Date", <Mono key="d">{r.date ? day(r.date) : null}</Mono>],
    ["Time", <Mono key="t">{r.time ? String(r.time).slice(0, 5) : null}</Mono>],
    ["Seats", <Mono key="s">{r.seats != null ? `${r.available_seats ?? "—"} free of ${r.seats}` : null}</Mono>],
    ["Driver", r.driver_name || "—"],
    ["Vehicle", r.vehicle_info || "—"],
    r.preferences ? ["Preferences", r.preferences] : null,
  ],
  description: (r) => r.description,
  contact: (r) => r.contact_info,
};

export default function RideshareModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ListingModeration {...config} />
      </AdminLayout>
    </AdminGuard>
  );
}
