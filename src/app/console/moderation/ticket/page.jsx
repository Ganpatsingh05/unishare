"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ListingModeration, { Mono, day } from "@features/admin/console/ListingModeration";
import { dateTime } from "@features/admin/console/ui";
import { fetchTickets, deleteTicket } from "@features/tickets/services/tickets.service";

const STATUS_TONE = { active: "good", soldout: "neutral", removed: "bad" };
const STATUS_LABEL = { active: "active", soldout: "sold out", removed: "removed" };
const statusOf = (t) => t.status || "active";
const kind = (t) => t.event_type || t.category || null;
const eventAt = (t) => (t.event_date ? new Date(t.event_date).getTime() : null);
const upcoming = (t, now) => (eventAt(t) ?? 0) >= now;
const seller = (t) => t.users?.name || null;
const distinct = (items, pick) => [...new Set(items.map(pick).filter(Boolean))].sort().map((v) => ({ value: v, label: v }));

const config = {
  title: "Tickets",
  lead: "Event tickets students are reselling. Open one to check the details, delete it if it breaks the rules.",
  noun: { one: "ticket", many: "tickets", column: "Ticket" },

  // fetchTickets returns { data: [], error } instead of throwing.
  load: async () => {
    const res = await fetchTickets();
    if (res?.error) throw new Error(res.error);
    if (!Array.isArray(res?.data)) throw new Error("Couldn't load tickets.");
    return res.data;
  },
  remove: (t) => deleteTicket(t.id),

  tabs: [
    { value: "upcoming", label: "Upcoming", test: (t, now) => upcoming(t, now) },
    { value: "past", label: "Past", test: (t, now) => !upcoming(t, now) },
    { value: "all", label: "All", test: () => true },
  ],
  filters: [
    {
      key: "status",
      label: "Status",
      all: "Any status",
      options: [
        { value: "active", label: "Active" },
        { value: "soldout", label: "Sold out" },
        { value: "removed", label: "Removed" },
      ],
      test: (t, v) => statusOf(t) === v,
    },
    { key: "type", label: "Event type", all: "Any type", options: (items) => distinct(items, kind), test: (t, v) => kind(t) === v },
  ],
  search: (t) => [t.title, t.venue, t.location, kind(t), seller(t)].filter(Boolean).join(" "),
  searchPlaceholder: "Search title, venue or seller",
  stats: (items, now) => [
    { label: "All tickets", value: items.length },
    { label: "Upcoming", value: items.filter((t) => upcoming(t, now)).length },
    { label: "Past, still listed", value: items.filter((t) => !upcoming(t, now) && statusOf(t) === "active").length, mark: true },
    { label: "Sold out", value: items.filter((t) => statusOf(t) === "soldout").length },
  ],

  name: (t) => t.title,
  subtitle: (t) => [kind(t), t.venue].filter(Boolean).join(" · ") || null,
  owner: seller,
  price: (t) => t.price,
  status: (t) => ({ label: STATUS_LABEL[statusOf(t)] || statusOf(t), tone: STATUS_TONE[statusOf(t)] || "neutral" }),
  posted: (t) => t.created_at,
  updated: (t) => t.updated_at,
  columns: [
    { label: "Event date", mono: true, render: (t) => (t.event_date ? day(t.event_date) : null) },
    { label: "Qty", align: "right", mono: true, render: (t) => (t.quantity_available != null ? t.quantity_available : null) },
  ],

  facts: (t) => [
    ["Category", t.category || "—"],
    ["Event type", t.event_type || "—"],
    ["Ticket type", t.ticket_type || "—"],
    ["Quantity", <Mono key="q">{t.quantity_available}</Mono>],
    ["Event date", <Mono key="e">{t.event_date ? dateTime(t.event_date) : null}</Mono>],
    ["Venue", t.venue || "—"],
    ["Location", t.location || "—"],
  ],
  description: (t) => t.description,
  images: (t) => (t.image_url ? [t.image_url] : []),
  contact: (t) => t.contact_info,
};

export default function TicketsModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ListingModeration {...config} />
      </AdminLayout>
    </AdminGuard>
  );
}
