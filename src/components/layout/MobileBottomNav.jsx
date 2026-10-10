"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Drawer from "@mui/material/Drawer";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Compass, History, House, Plus, UserRound, X } from "lucide-react";
import { useUI } from "@contexts/UniShareContext";
import { FEATURES, featureByKey } from "./header/navConfig";

// Things a student can post, in the order people post them most.
const POST_ACTIONS = [
  { label: "Offer a ride", hint: "Share the empty seats", href: "/share-ride/postride", feature: "rides" },
  { label: "Sell an item", hint: "Pass on what you don't need", href: "/marketplace/sell", feature: "market" },
  { label: "List a room", hint: "Find someone for a spare room", href: "/housing/post", feature: "rooms" },
  { label: "Sell a ticket", hint: "An event you can't make", href: "/ticket/sell", feature: "tickets" },
  { label: "Report lost or found", hint: "Help it get home", href: "/lost-found/report", feature: "lostfound" },
  { label: "Post an announcement", hint: "Reviewed before it goes up", href: "/announcements/submit", feature: "announcements" },
  { label: "Share notes", hint: "Suggest a resource", href: "/resources/suggest", feature: "resources" },
];

const ink = (dark) => ({
  text: dark ? "#E6EDF6" : "#12233A",
  muted: dark ? "#A3B1C2" : "#4B5B70",
  active: dark ? "#3CC3F2" : "#1565D8",
  activeBg: dark ? "rgba(60,195,242,0.16)" : "rgba(21,101,216,0.10)",
  bar: dark ? "rgba(17,24,33,0.92)" : "rgba(255,255,255,0.9)",
  border: dark ? "rgba(255,255,255,0.08)" : "rgba(18,35,58,0.08)",
  sheet: dark ? "#141B24" : "#FFFFFF",
  tile: dark ? "rgba(255,255,255,0.04)" : "#F4F7FB",
  focus: dark ? "#7CD4F5" : "#1565D8",
});

/** Bottom sheet used by Explore and Post. MUI's Drawer handles focus and Escape. */
function Sheet({ open, onClose, title, dark, children }) {
  const c = ink(dark);
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      aria-labelledby="mbn-sheet-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: c.sheet,
            backgroundImage: "none",
            color: c.text,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "85dvh",
            pb: "calc(16px + env(safe-area-inset-bottom))",
          },
        },
        backdrop: { sx: { backgroundColor: "rgba(10,18,30,0.45)" } },
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }} aria-hidden>
        <span style={{ width: 40, height: 4, borderRadius: 4, background: c.border.replace("0.08", "0.25") }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px 6px 20px" }}>
        <h2 id="mbn-sheet-title" style={{ margin: 0, fontSize: 19, fontWeight: 850, letterSpacing: "-0.01em" }}>{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="mbn-focus" style={{ width: 40, height: 40, display: "grid", placeItems: "center", borderRadius: 999, border: 0, background: c.tile, color: c.muted, cursor: "pointer" }}>
          <X size={20} aria-hidden />
        </button>
      </div>
      <div style={{ padding: "6px 16px 0" }}>{children}</div>
    </Drawer>
  );
}

function FeatureIcon({ feature, dark, size = 40 }) {
  const f = featureByKey[feature];
  const color = f.ink[dark ? 1 : 0];
  const Icon = f.icon;
  return (
    <span aria-hidden style={{ width: size, height: size, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 12, color, background: `color-mix(in srgb, ${color} ${dark ? 18 : 12}%, transparent)` }}>
      <Icon size={size * 0.5} />
    </span>
  );
}

const MobileBottomNav = React.memo(function MobileBottomNav() {
  const { darkMode } = useUI();
  const pathname = usePathname() || "/";
  const reduce = useReducedMotion();
  const [sheet, setSheet] = useState(null); // "explore" | "post"
  const c = ink(darkMode);

  // Close any open sheet when the page changes.
  useEffect(() => setSheet(null), [pathname]);

  if (pathname === "/login" || pathname.startsWith("/console") || pathname.startsWith("/admin")) return null;

  const inFeature = FEATURES.some((f) => pathname.startsWith(f.base));
  const tabs = [
    { key: "home", label: "Home", href: "/", Icon: House, active: pathname === "/" },
    { key: "explore", label: "Explore", Icon: Compass, active: sheet === "explore" || (!sheet && inFeature), onClick: () => setSheet("explore") },
    { key: "post" },
    { key: "activity", label: "Activity", href: "/my-activity", Icon: History, active: !sheet && pathname.startsWith("/my-activity") },
    { key: "profile", label: "Profile", href: "/profile", Icon: UserRound, active: !sheet && (pathname.startsWith("/profile") || pathname.startsWith("/settings")) },
  ];

  const tabStyle = (active) => ({
    position: "relative",
    flex: 1,
    minWidth: 0,
    height: 56,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    border: 0,
    background: "transparent",
    color: active ? c.active : c.muted,
    textDecoration: "none",
    cursor: "pointer",
    borderRadius: 16,
    fontFamily: "inherit",
    WebkitTapHighlightColor: "transparent",
  });

  const tabInner = (t) => (
    <>
      {t.active ? (
        <motion.span
          layoutId="mbn-active"
          aria-hidden
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 38 }}
          style={{ position: "absolute", top: 6, width: 52, height: 30, borderRadius: 999, background: c.activeBg }}
        />
      ) : null}
      <t.Icon size={22} strokeWidth={t.active ? 2.4 : 2} aria-hidden style={{ position: "relative" }} />
      <span style={{ position: "relative", fontSize: 11.5, fontWeight: t.active ? 800 : 650, letterSpacing: "0.01em", lineHeight: 1 }}>{t.label}</span>
    </>
  );

  return (
    <>
      {/* Focus ring for everything in the bar and sheets. */}
      <style>{`.mbn-focus:focus-visible{outline:2px solid ${c.focus};outline-offset:2px}`}</style>
      <nav
        aria-label="Quick navigation"
        className="md:hidden"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 50, padding: "0 12px calc(10px + env(safe-area-inset-bottom))", pointerEvents: "none" }}
      >
        <LayoutGroup id="mbn">
          <div
            style={{
              pointerEvents: "auto",
              display: "flex",
              alignItems: "center",
              padding: "4px 6px",
              borderRadius: 24,
              background: c.bar,
              border: `1px solid ${c.border}`,
              boxShadow: darkMode ? "0 12px 32px rgba(0,0,0,0.45)" : "0 12px 32px rgba(18,35,58,0.16)",
              backdropFilter: "blur(20px) saturate(170%)",
              WebkitBackdropFilter: "blur(20px) saturate(170%)",
            }}
          >
            {tabs.map((t) => {
              if (t.key === "post") {
                return (
                  <div key="post" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                    <button
                      type="button"
                      onClick={() => setSheet("post")}
                      aria-label="Post something"
                      aria-haspopup="dialog"
                      aria-expanded={sheet === "post"}
                      className="mbn-focus"
                      style={{
                        width: 54,
                        height: 54,
                        marginTop: -22,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 999,
                        border: `4px solid ${darkMode ? "#111821" : "#FFFFFF"}`,
                        background: "#FFD24C",
                        color: "#12233A",
                        boxShadow: "0 8px 20px rgba(255,190,40,0.45)",
                        cursor: "pointer",
                        transition: "transform 160ms ease",
                        transform: sheet === "post" ? "rotate(45deg)" : "none",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      <Plus size={26} strokeWidth={2.75} aria-hidden />
                    </button>
                  </div>
                );
              }
              return t.href ? (
                <Link key={t.key} href={t.href} aria-current={t.active ? "page" : undefined} className="mbn-focus" style={tabStyle(t.active)}>
                  {tabInner(t)}
                </Link>
              ) : (
                <button key={t.key} type="button" onClick={t.onClick} aria-haspopup="dialog" aria-expanded={sheet === "explore"} className="mbn-focus" style={tabStyle(t.active)}>
                  {tabInner(t)}
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </nav>

      <Sheet open={sheet === "explore"} onClose={() => setSheet(null)} title="Explore UniShare" dark={darkMode}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
          {FEATURES.map((f) => {
            const here = pathname.startsWith(f.base);
            return (
              <li key={f.key}>
                <Link
                  href={f.href}
                  onClick={() => setSheet(null)}
                  aria-current={here ? "page" : undefined}
                  className="mbn-focus"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "12px 4px 10px", borderRadius: 16, textDecoration: "none", color: c.text, background: here ? c.activeBg : c.tile, textAlign: "center" }}
                >
                  <FeatureIcon feature={f.key} dark={darkMode} size={42} />
                  <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.2 }}>{f.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Sheet>

      <Sheet open={sheet === "post"} onClose={() => setSheet(null)} title="What do you want to post?" dark={darkMode}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 6 }}>
          {POST_ACTIONS.map((a) => (
            <li key={a.href}>
              <Link href={a.href} onClick={() => setSheet(null)} className="mbn-focus" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 12px", borderRadius: 16, textDecoration: "none", color: c.text, background: c.tile }}>
                <FeatureIcon feature={a.feature} dark={darkMode} />
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: "block", fontSize: 15.5, fontWeight: 750 }}>{a.label}</span>
                  <span style={{ display: "block", fontSize: 13, color: c.muted, marginTop: 1 }}>{a.hint}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
});

export default MobileBottomNav;
