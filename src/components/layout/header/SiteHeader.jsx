"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth, useUI } from "@contexts/UniShareContext";
import NotificationFloatingPanel from "@components/ui/NotificationFloatingPanel";
import { headerVars, useHeaderProfile } from "./headerKit";
import DesktopBar from "./DesktopBar";
import MobileBar from "./MobileBar";
import SearchPalette from "./SearchPalette";

const typing = (el) => el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

/**
 * The global header. Desktop and phone get their own bar; both share the
 * search palette (Ctrl/Cmd+K or "/"), notifications and the signed-in user.
 */
export default function SiteHeader() {
  const { darkMode } = useUI();
  const { logout } = useAuth();
  const me = useHeaderProfile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [shortcut, setShortcut] = useState("Ctrl");
  const bellRef = useRef(null);

  useEffect(() => {
    setShortcut(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl");
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !typing(document.activeElement)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const closeNotif = useCallback(() => setNotifOpen(false), []);

  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Sign-out failed on the server; the reload below still clears this tab.
    } finally {
      window.location.href = "/login";
    }
  }, [logout]);

  return (
    <header style={headerVars(darkMode)}>
      <DesktopBar
        dark={darkMode}
        me={me}
        shortcut={shortcut}
        onSearch={openSearch}
        bellRef={bellRef}
        onBell={() => setNotifOpen((v) => !v)}
        onSignOut={signOut}
      />
      <MobileBar dark={darkMode} me={me} onSearch={openSearch} onBell={() => setNotifOpen(true)} onSignOut={signOut} />
      <SearchPalette open={searchOpen} onClose={closeSearch} />
      <NotificationFloatingPanel open={notifOpen} onClose={closeNotif} anchorRef={bellRef} />
    </header>
  );
}
