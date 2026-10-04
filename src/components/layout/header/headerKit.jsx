"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import { getCurrentUserProfile } from "@lib/api/userProfile";
import { getDisplayName, getProfileImageUrl, getUserInitials } from "@lib/utils/profileUtils";

/**
 * Header colours as CSS variables, so every header part reads one palette and
 * the whole header flips in the same frame as the rest of the theme.
 */
export function headerVars(dark) {
  return dark
    ? {
        "--hd-glass": "linear-gradient(180deg, rgba(34, 43, 61, 0.52), rgba(14, 19, 29, 0.4))",
        "--hd-glass-edge": "rgba(255, 255, 255, 0.12)",
        "--hd-glass-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 12px 32px -16px rgba(0, 0, 0, 0.6)",
        "--hd-panel": "#131A26",
        "--hd-border": "rgba(255, 255, 255, 0.1)",
        "--hd-text": "#F1F5F9",
        "--hd-muted": "#94A3B8",
        "--hd-hover": "rgba(255, 255, 255, 0.07)",
        "--hd-accent": "#3CC3F2",
        "--hd-on-accent": "#12233A",
        "--hd-ring": "#FFD24C",
        "--hd-danger": "#FCA5A5",
        "--hd-shadow": "0 18px 44px -18px rgba(0, 0, 0, 0.7)",
      }
    : {
        "--hd-glass": "linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.38))",
        "--hd-glass-edge": "rgba(255, 255, 255, 0.7)",
        "--hd-glass-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.75), 0 10px 30px -16px rgba(18, 35, 58, 0.3)",
        "--hd-panel": "#FFFFFF",
        "--hd-border": "rgba(18, 35, 58, 0.1)",
        "--hd-text": "#12233A",
        "--hd-muted": "#55657A",
        "--hd-hover": "rgba(18, 35, 58, 0.06)",
        "--hd-accent": "#1565D8",
        "--hd-on-accent": "#FFFFFF",
        "--hd-ring": "#1565D8",
        "--hd-danger": "#B91C1C",
        "--hd-shadow": "0 18px 44px -20px rgba(18, 35, 58, 0.35)",
      };
}

/** Frosted glass for both bars: a see-through tint, blur behind, a bright top edge. */
export const GLASS = {
  background: "var(--hd-glass)",
  border: "1px solid var(--hd-glass-edge)",
  boxShadow: "var(--hd-glass-shadow)",
  backdropFilter: "blur(18px) saturate(180%)",
  WebkitBackdropFilter: "blur(18px) saturate(180%)",
};

/** Focus ring shared by every header control. */
export const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--hd-ring)] focus-visible:ring-offset-0";

/** The signed-in user's name, handle and photo, fetched once for the header. */
export function useHeaderProfile() {
  const { isAuthenticated, user, authLoading } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user || authLoading) {
      setProfile(null);
      return undefined;
    }
    let alive = true;
    getCurrentUserProfile()
      .then((r) => alive && setProfile(r?.data || r || null))
      .catch(() => alive && setProfile(null));
    return () => {
      alive = false;
    };
  }, [isAuthenticated, user, authLoading]);

  const name = isAuthenticated ? getDisplayName(profile, user) : "";
  const handle = String(profile?.custom_user_id || profile?.username || "").replace(/^@+/, "");
  return {
    signedIn: Boolean(isAuthenticated),
    loading: authLoading,
    name,
    handle,
    email: user?.email || "",
    photo: isAuthenticated ? getProfileImageUrl(profile, user) : null,
    initials: getUserInitials(name),
  };
}

/** Stop the page scrolling while an overlay is open, without a layout jump. */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return undefined;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = { overflow: html.style.overflow, paddingRight: html.style.paddingRight };
    html.style.overflow = "hidden";
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => {
      html.style.overflow = prev.overflow;
      html.style.paddingRight = prev.paddingRight;
    };
  }, [active]);
}

/** Round avatar: the photo, or initials when there is none or it fails. */
export function HeaderAvatar({ me, size = 36 }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [me.photo]);
  const showPhoto = me.photo && !broken;
  return (
    <span
      className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), background: "linear-gradient(135deg, #1565D8, #12233A)" }}
    >
      {showPhoto ? (
        <img src={me.photo} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <span aria-hidden>{me.initials}</span>
      )}
    </span>
  );
}

/** The UniShare wordmark. In light mode "Uni" gets a navy edge so it reads on white. */
export function Wordmark({ dark, className = "" }) {
  const uni = dark ? { color: "#FFD24C" } : { color: "#FFD24C", WebkitTextStroke: "0.07em #12233A", paintOrder: "stroke fill" };
  return (
    <span className={`whitespace-nowrap font-extrabold tracking-[-0.02em] ${className}`}>
      <span style={uni}>Uni</span>
      <span style={{ color: dark ? "#3CC3F2" : "#1565D8" }}>Share</span>
    </span>
  );
}
