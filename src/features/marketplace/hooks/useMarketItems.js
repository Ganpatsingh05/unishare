"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@lib/api/base";
import { normalizeItem } from "../utils/itemModel";

/** Items for sale (GET /api/itemsell), up to the API's page cap of 100. */
export default function useMarketItems() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    apiCall("/api/itemsell?limit=100&sort=created_at&order=desc", { method: "GET", cache: false })
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
