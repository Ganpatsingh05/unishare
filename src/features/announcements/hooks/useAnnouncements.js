"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@lib/api/base";
import { normalizeAnnouncement, sortFeed } from "../utils/announcementModel";

/** Active announcements (GET /api/announcements), newest first. */
export default function useAnnouncements() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    apiCall("/api/announcements", { method: "GET", cache: false })
      .then((result) => {
        if (!alive) return;
        setItems(sortFeed((result?.data || []).map(normalizeAnnouncement)));
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [nonce]);

  return { items, status, reload: () => setNonce((n) => n + 1) };
}
