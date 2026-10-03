"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchRooms } from "../services/housing.service";
import { normalizeRoom } from "../utils/roomModel";

// The list endpoint caps a page at 50; the landing loads the 50 newest rooms
// and filters them in the browser so every control responds instantly.
const LANDING_LIMIT = 50;

export default function useRoomListings() {
  const [rooms, setRooms] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const result = await fetchRooms({ limit: LANDING_LIMIT, page: 1, cache: false });
      setRooms((result.data || []).map(normalizeRoom));
      setTotal(result.pagination?.total ?? result.total ?? (result.data || []).length);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { rooms, total, status, reload: load };
}
