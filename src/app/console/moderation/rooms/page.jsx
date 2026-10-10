"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ListingModeration, { Mono, day, money } from "@features/admin/console/ListingModeration";
import { fetchRooms, deleteRoom } from "@lib/api/rooms";

const photos = (r) => (Array.isArray(r.photos) ? r.photos : []);
const moveIn = (r) => (r.move_in_date ? new Date(r.move_in_date).getTime() : null);
const availableNow = (r, now) => moveIn(r) == null || moveIn(r) <= now;
const hasContact = (c) => !!c && (typeof c === "string" ? c.trim() !== "" : !!(c.email || c.mobile || c.phone || c.instagram));

const config = {
  title: "Housing",
  lead: "Every room and flat students have listed. Open one to check the details, delete it if it breaks the rules.",
  noun: { one: "listing", many: "listings", column: "Room" },

  load: async () => {
    const res = await fetchRooms();
    if (res && res.success === false) throw new Error(res.error || res.message || "Couldn't load housing listings.");
    return Array.isArray(res?.data) ? res.data : [];
  },
  remove: (r) => deleteRoom(r.id),

  tabs: [
    { value: "all", label: "All", test: () => true },
    { value: "now", label: "Available now", test: (r, now) => availableNow(r, now) },
    { value: "later", label: "Later", test: (r, now) => !availableNow(r, now) },
  ],
  search: (r) => [r.title, r.location, r.users?.name].filter(Boolean).join(" "),
  searchPlaceholder: "Search title or location",
  stats: (items, now) => [
    { label: "All listings", value: items.length },
    { label: "Available now", value: items.filter((r) => availableNow(r, now)).length },
    { label: "With photos", value: items.filter((r) => photos(r).length > 0).length },
    { label: "No contact details", value: items.filter((r) => !hasContact(r.contact_info)).length, mark: true },
  ],

  name: (r) => r.title,
  subtitle: (r) => r.location,
  owner: (r) => r.users?.name || null,
  price: (r) => r.rent,
  priceLabel: "Rent / mo",
  posted: (r) => r.created_at,
  updated: (r) => r.updated_at,
  columns: [
    { label: "Beds", align: "right", mono: true, render: (r) => (r.beds != null ? r.beds : null) },
    { label: "Move-in", mono: true, render: (r) => (r.move_in_date ? day(r.move_in_date) : null) },
    { label: "Photos", align: "right", mono: true, render: (r) => photos(r).length },
  ],

  facts: (r) => [
    ["Rent", <Mono key="r">{r.rent != null && r.rent !== "" ? `${money(r.rent)} / month` : null}</Mono>],
    ["Location", r.location || "—"],
    ["Beds", <Mono key="b">{r.beds}</Mono>],
    ["Move-in", <Mono key="m">{r.move_in_date ? day(r.move_in_date) : null}</Mono>],
  ],
  description: (r) => r.description,
  images: photos,
  contact: (r) => r.contact_info,
};

export default function RoomsModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ListingModeration {...config} />
      </AdminLayout>
    </AdminGuard>
  );
}
