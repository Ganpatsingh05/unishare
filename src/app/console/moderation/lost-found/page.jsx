"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ListingModeration, { Mono, day } from "@features/admin/console/ListingModeration";
import { fetchLostFoundItems, deleteLostFoundItem } from "@features/lost-found/services/lostFound.service";

const statusOf = (i) => i.status || "open";
const isLost = (i) => i.mode === "lost";
const place = (i) => (isLost(i) ? i.where_last_seen : i.where_found) || i.where_last_seen || i.where_found || null;
const happened = (i) => (isLost(i) ? i.date_lost : i.date_found) || null;
const at = (i) => (isLost(i) ? i.time_lost : i.time_found) || null;
const reporter = (i) => i.users?.name || null;

const config = {
  title: "Lost & Found",
  lead: "Lost and found reports from students. Open one to check the details, delete it if it breaks the rules.",
  noun: { one: "report", many: "reports", column: "Item" },

  load: async () => {
    const res = await fetchLostFoundItems();
    if (!res?.success || !Array.isArray(res.data)) throw new Error(res?.error || res?.message || "Couldn't load lost and found reports.");
    return res.data;
  },
  remove: (i) => deleteLostFoundItem(i.id),

  tabs: [
    { value: "all", label: "All", test: () => true },
    { value: "open", label: "Open", test: (i) => statusOf(i) === "open" },
    { value: "resolved", label: "Resolved", test: (i) => statusOf(i) === "resolved" },
  ],
  filters: [
    {
      key: "mode",
      label: "Lost or found",
      all: "Lost and found",
      options: [
        { value: "lost", label: "Lost" },
        { value: "found", label: "Found" },
      ],
      test: (i, v) => i.mode === v,
    },
  ],
  search: (i) => [i.item_name, i.description, place(i), reporter(i)].filter(Boolean).join(" "),
  searchPlaceholder: "Search item, description or place",
  stats: (items) => [
    { label: "All reports", value: items.length },
    { label: "Open", value: items.filter((i) => statusOf(i) === "open").length, mark: true },
    { label: "Lost", value: items.filter((i) => i.mode === "lost").length },
    { label: "Found", value: items.filter((i) => i.mode === "found").length },
  ],

  name: (i) => i.item_name,
  subtitle: (i) => i.description,
  owner: reporter,
  status: (i) => ({ label: statusOf(i), tone: statusOf(i) === "resolved" ? "good" : "neutral" }),
  posted: (i) => i.created_at,
  updated: (i) => i.updated_at,
  columns: [
    { label: "Type", render: (i) => (i.mode ? <span className="c-mono text-[12px] text-[var(--c-muted)]">{i.mode}</span> : null) },
    { label: "Where", render: (i) => place(i) },
    { label: "When", mono: true, render: (i) => (happened(i) ? `${day(happened(i))}${at(i) ? ` · ${String(at(i)).slice(0, 5)}` : ""}` : null) },
  ],

  facts: (i) => [
    ["Type", i.mode || "—"],
    [isLost(i) ? "Last seen" : "Found at", place(i) || "—"],
    [isLost(i) ? "Date lost" : "Date found", <Mono key="d">{happened(i) ? day(happened(i)) : null}</Mono>],
    [isLost(i) ? "Time lost" : "Time found", <Mono key="t">{at(i) ? String(at(i)).slice(0, 5) : null}</Mono>],
  ],
  description: (i) => i.description,
  images: (i) => (Array.isArray(i.image_urls) ? i.image_urls : []),
  contact: (i) => i.contact_info,
};

export default function LostFoundModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ListingModeration {...config} />
      </AdminLayout>
    </AdminGuard>
  );
}
