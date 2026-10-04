"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import { getCurrentUserProfile } from "@lib/api/userProfile";
import { normalizeProfile } from "../utils/profileModel";

/** The signed-in student's profile (GET /api/profile), with auth-user fallbacks. */
export default function useMyProfile() {
  const { user, isAuthenticated, authLoading } = useAuth();
  const [state, setState] = useState({ status: "loading", raw: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!isAuthenticated) {
      setState({ status: "signedout", raw: null });
      return undefined;
    }
    let alive = true;
    setState((prev) => ({ ...prev, status: prev.raw ? "ready" : "loading" }));
    getCurrentUserProfile()
      .then((result) => alive && setState({ status: "ready", raw: result?.data || {} }))
      .catch(() => alive && setState((prev) => ({ ...prev, status: prev.raw ? "ready" : "error" })));
    return () => {
      alive = false;
    };
  }, [isAuthenticated, authLoading, nonce]);

  const replace = useCallback((raw) => setState({ status: "ready", raw }), []);
  return {
    status: state.status,
    profile: normalizeProfile(state.raw || {}, user || {}),
    user,
    reload: () => setNonce((n) => n + 1),
    replace,
  };
}
