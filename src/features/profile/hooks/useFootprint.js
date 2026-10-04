"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@lib/api/base";

// Each feature's "my posts" endpoint, where to manage it, and how to title a row.
export const SOURCES = [
  { key: "rides", endpoint: "/api/shareride/my", href: "/share-ride/manage", title: (r) => [r.from_location, r.to_location] },
  { key: "rooms", endpoint: "/api/rooms/mine", href: "/housing/manage", title: (r) => r.title },
  { key: "market", endpoint: "/api/itemsell/mine", href: "/marketplace/sell", title: (r) => r.title },
  { key: "tickets", endpoint: "/api/ticketsell/my", href: "/ticket/my-tickets", title: (r) => r.title },
  { key: "lostfound", endpoint: "/api/lostfound/my", href: "/lost-found", title: (r) => r.item_name },
  { key: "announcements", endpoint: "/api/announcements/my", href: "/announcements/manage", title: (r) => r.title },
  { key: "resources", endpoint: "/api/resources/my", href: "/resources/manage", title: (r) => r.title },
];

/**
 * Counts and the latest posts across every feature, fetched in parallel. A
 * feature that fails just counts as unknown; it never blocks the others.
 */
export default function useFootprint(enabled) {
  const [state, setState] = useState({ status: "loading", counts: {}, recent: [] });

  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    Promise.allSettled(SOURCES.map((src) => apiCall(src.endpoint, { method: "GET", cache: false }))).then((results) => {
      if (!alive) return;
      const counts = {};
      const recent = [];
      results.forEach((res, i) => {
        const src = SOURCES[i];
        if (res.status !== "fulfilled") {
          counts[src.key] = null;
          return;
        }
        const rows = Array.isArray(res.value?.data) ? res.value.data : Array.isArray(res.value) ? res.value : [];
        counts[src.key] = rows.length;
        rows.slice(0, 5).forEach((row) => {
          const title = src.title(row);
          recent.push({
            key: `${src.key}-${row.id}`,
            source: src.key,
            href: src.href,
            title: Array.isArray(title) ? title : String(title || "").trim(),
            createdAt: row.created_at ? new Date(row.created_at) : null,
          });
        });
      });
      recent.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setState({ status: "ready", counts, recent: recent.slice(0, 8) });
    });
    return () => {
      alive = false;
    };
  }, [enabled]);

  return state;
}
