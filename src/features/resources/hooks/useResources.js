"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@lib/api/base";
import { normalizeResource } from "../utils/resourceModel";

/** Active resources (GET /api/resources), newest first. */
export default function useResources() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    apiCall("/api/resources", { method: "GET", cache: false })
      .then((result) => {
        if (!alive) return;
        const list = (result?.data || []).map(normalizeResource);
        list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        setItems(list);
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [nonce]);

  return { items, status, reload: () => setNonce((n) => n + 1) };
}
