"use client";

import { useEffect, useState } from "react";
import { getPublicContacts } from "../services/contacts.service";
import { normalizeContact } from "../utils/contactModel";

/** Active campus contacts (GET /api/contacts). Never falls back to made-up data. */
export default function useContacts() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    getPublicContacts().then((result) => {
      if (!alive) return;
      if (!result?.success) {
        setStatus("error");
        return;
      }
      setItems((result.contacts || []).map(normalizeContact));
      setStatus("ready");
    });
    return () => {
      alive = false;
    };
  }, [nonce]);

  return { items, status, reload: () => setNonce((n) => n + 1) };
}
