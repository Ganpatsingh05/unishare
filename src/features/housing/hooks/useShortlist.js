"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Saved rooms live in this browser only (a convenience, not an account
// feature), so storage failures are ignored and the page still works.
const KEY = "unishare:housing-shortlist:v1";

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    const ids = raw ? JSON.parse(raw) : [];
    return Array.isArray(ids) ? ids.map(String) : [];
  } catch {
    return [];
  }
}

export default function useShortlist() {
  const [ids, setIds] = useState([]);
  const idsRef = useRef(ids);
  useEffect(() => {
    const stored = read();
    idsRef.current = stored;
    setIds(stored);
  }, []);

  const write = useCallback((next) => {
    idsRef.current = next;
    setIds(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const add = useCallback((id) => {
    const key = String(id);
    if (!idsRef.current.includes(key)) write([...idsRef.current, key]);
  }, [write]);
  const remove = useCallback((id) => write(idsRef.current.filter((x) => x !== String(id))), [write]);
  const clear = useCallback(() => write([]), [write]);
  const has = useCallback((id) => ids.includes(String(id)), [ids]);

  return { ids, add, remove, clear, has };
}
