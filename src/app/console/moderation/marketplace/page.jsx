"use client";

import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import ListingModeration, { Mono, day } from "@features/admin/console/ListingModeration";
import { fetchMarketplaceItems, deleteItem } from "@features/marketplace/services/marketplace.service";

const STATUS_TONE = { active: "good", sold: "info", removed: "bad" };
const statusOf = (i) => i.status || "active";

// `photos` arrives either as an array or as a JSON-encoded string.
function photoList(i) {
  let list = i.photos;
  if (typeof list === "string") {
    try {
      list = JSON.parse(list);
    } catch {
      list = [];
    }
  }
  const urls = Array.isArray(list) ? list.filter((u) => typeof u === "string") : [];
  return i.image_url && !urls.includes(i.image_url) ? [i.image_url, ...urls] : urls;
}

const seller = (i) => i.users?.name || null;
const distinct = (items, pick) => [...new Set(items.map(pick).filter(Boolean))].sort().map((v) => ({ value: v, label: v }));

const config = {
  title: "Marketplace",
  lead: "Everything students are selling. Open an item to check the details, delete it if it breaks the rules.",
  noun: { one: "item", many: "items", column: "Item" },

  // fetchMarketplaceItems returns { data: [], error } instead of throwing.
  load: async () => {
    const res = await fetchMarketplaceItems();
    if (res?.error) throw new Error(res.error);
    if (!Array.isArray(res?.data)) throw new Error("Couldn't load marketplace items.");
    return res.data;
  },
  remove: (i) => deleteItem(i.id),

  tabs: [
    { value: "all", label: "All", test: () => true },
    { value: "active", label: "Active", test: (i) => statusOf(i) === "active" },
    { value: "sold", label: "Sold", test: (i) => statusOf(i) === "sold" },
    { value: "removed", label: "Removed", test: (i) => statusOf(i) === "removed" },
  ],
  filters: [{ key: "category", label: "Category", all: "Any category", options: (items) => distinct(items, (i) => i.category), test: (i, v) => i.category === v }],
  search: (i) => [i.title, i.category, i.location, seller(i)].filter(Boolean).join(" "),
  searchPlaceholder: "Search title, category or seller",
  stats: (items, now) => {
    const week = now - 7 * 86400_000;
    return [
      { label: "All items", value: items.length },
      { label: "Active", value: items.filter((i) => statusOf(i) === "active").length },
      { label: "Sold", value: items.filter((i) => statusOf(i) === "sold").length },
      { label: "Posted this week", value: items.filter((i) => i.created_at && new Date(i.created_at).getTime() >= week).length },
    ];
  },

  name: (i) => i.title,
  subtitle: (i) => [i.category, i.condition].filter(Boolean).join(" · ") || null,
  owner: seller,
  price: (i) => i.price,
  status: (i) => ({ label: statusOf(i), tone: STATUS_TONE[statusOf(i)] || "neutral" }),
  posted: (i) => i.created_at,
  updated: (i) => i.updated_at,
  columns: [{ label: "Location", render: (i) => i.location || null }],

  facts: (i) => [
    ["Category", i.category || "—"],
    ["Condition", i.condition || "—"],
    ["Location", i.location || "—"],
    ["Available from", <Mono key="a">{i.available_from ? day(i.available_from) : null}</Mono>],
  ],
  description: (i) => i.description,
  images: photoList,
  contact: (i) => i.contact_info,
};

export default function MarketplaceModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ListingModeration {...config} />
      </AdminLayout>
    </AdminGuard>
  );
}
