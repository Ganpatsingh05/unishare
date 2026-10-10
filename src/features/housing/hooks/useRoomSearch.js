"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchRooms } from "../services/housing.service";
import { matchRooms, normalizeRoom } from "../utils/roomModel";

const PAGE = 24;

/**
 * Server-paged room search. Area, max rent and an exact bed count go to the
 * API (GET /api/rooms: location, max_rent, beds); "4+ beds" and move-in date
 * are not API filters, so they are applied to each page in the browser.
 */
export default function useRoomSearch(filters) {
  const [rooms, setRooms] = useState([]);
  const [status, setStatus] = useState("loading");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const reqRef = useRef(0);
  const [nonce, setNonce] = useState(0);

  const query = useCallback(
    (p) => {
      const params = { page: p, limit: PAGE, cache: false };
      if (filters.area) params.location = filters.area;
      if (filters.maxRent) params.max_rent = filters.maxRent;
      if (filters.beds && filters.beds !== "4+") params.beds = filters.beds;
      return fetchRooms(params);
    },
    [filters.area, filters.maxRent, filters.beds]
  );

  // A new search starts from page one.
  useEffect(() => {
    const id = (reqRef.current += 1);
    setStatus("loading");
    query(1)
      .then((result) => {
        if (id !== reqRef.current) return;
        setRooms((result.data || []).map(normalizeRoom));
        setPage(1);
        setPages(result.pagination?.pages || 1);
        setTotal(result.pagination?.total ?? (result.data || []).length);
        setStatus("ready");
      })
      .catch(() => id === reqRef.current && setStatus("error"));
  }, [query, nonce]);

  const loadMore = useCallback(async () => {
    if (page >= pages || status === "more") return;
    const id = reqRef.current;
    setStatus("more");
    try {
      const result = await query(page + 1);
      if (id !== reqRef.current) return;
      setRooms((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        return [...prev, ...(result.data || []).map(normalizeRoom).filter((r) => !seen.has(r.id))];
      });
      setPage((n) => n + 1);
      setStatus("ready");
    } catch {
      if (id === reqRef.current) setStatus("ready");
    }
  }, [page, pages, status, query]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return {
    rooms: matchRooms(rooms, { ...filters, area: null, maxRent: null }),
    status,
    total,
    hasMore: page < pages,
    loadMore,
    reload,
  };
}
