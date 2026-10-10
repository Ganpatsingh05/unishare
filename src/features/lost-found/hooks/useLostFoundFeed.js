"use client";

import { useEffect, useState } from "react";
import { fetchLostFoundItems } from "../services/lostFound.service";
import { normalizeItem } from "../utils/itemModel";

/** Active lost and found posts, newest first (GET /api/lostfound). */
export default function useLostFoundFeed() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    fetchLostFoundItems({ status: "active", sort: "created_at", order: "desc", limit: 100 })
      .then((result) => {
        if (!alive) return;
        setItems((result?.data || []).map(normalizeItem));
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [nonce]);

  return { items, status, reload: () => setNonce((n) => n + 1) };
}
