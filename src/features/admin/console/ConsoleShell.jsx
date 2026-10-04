"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Search, Sun } from "lucide-react";
import { useAuth, useUI } from "@contexts/UniShareContext";
import { ConsoleProvider, consoleVars, useConsole } from "./consoleData";
import { CONSOLE_CSS } from "./ui";

const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--c-bg)]";

// Text-only navigation, grouped by the job being done. `count` names the
// overview figure shown beside an item.
const NAV = [
  { group: null, items: [{ label: "Overview", href: "/console", exact: true, count: "inbox" }] },
  { group: "People", items: [{ label: "Users", href: "/console/users" }] },
  {
    group: "Content",
    items: [
      { label: "Announcements", href: "/console/announcements", count: "announcement" },
      { label: "Resources", href: "/console/resources", count: "resource" },
      { label: "Notices", href: "/console/notice" },
      { label: "Contacts", href: "/console/contacts" },
    ],
  },
  {
    group: "Listings",
    items: [
      { label: "Reports", href: "/console/moderation", exact: true, count: "report" },
      { label: "Rides", href: "/console/moderation/rideshare" },
      { label: "Housing", href: "/console/moderation/rooms" },
      { label: "Marketplace", href: "/console/moderation/marketplace" },
      { label: "Tickets", href: "/console/moderation/ticket" },
      { label: "Lost & Found", href: "/console/moderation/lost-found" },
    ],
  },
  { group: "Reach", items: [{ label: "Notifications", href: "/console/notifications" }] },
  { group: "Data", items: [{ label: "Analytics", href: "/console/analytics" }] },
];
const ALL = NAV.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group || "Console" })));

const isOn = (pathname, item) => (item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`));

function useCounts() {
  const { data } = useConsole();
  return useMemo(() => {
    const inbox = data?.inbox || [];
    const by = (k) => inbox.filter((i) => i.kind === k).length;
    return { inbox: inbox.length, announcement: by("announcement"), resource: by("resource"), report: by("report") };
  }, [data]);
}

function NavList({ onNavigate }) {
  const pathname = usePathname();
  const counts = useCounts();
  return (
    <nav aria-label="Console" className="flex flex-col gap-5">
      {NAV.map((g, gi) => (
        <div key={gi}>
          {g.group ? <div className="mb-1 px-3 text-[12px] font-semibold text-[var(--c-faint)]">{g.group}</div> : null}
          <ul className="flex flex-col">
            {g.items.map((item) => {
              const on = isOn(pathname, item);
              const n = item.count ? counts[item.count] : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={on ? "page" : undefined}
                    className={`group relative flex h-9 items-center justify-between rounded-[9px] px-3 text-[14.5px] transition-colors ${on ? "bg-[var(--c-accent-soft)] font-semibold text-[var(--c-accent-text)]" : "font-medium text-[var(--c-muted)] hover:bg-[var(--c-panel-2)] hover:text-[var(--c-text)]"} ${RING}`}
                  >
                    {on ? <span aria-hidden className="absolute left-0 top-2 h-5 w-[3px] rounded-full bg-[var(--c-accent)]" /> : null}
                    <span>{item.label}</span>
                    {n ? (
                      <span className="c-mono min-w-[22px] rounded-full bg-[var(--c-mark)] px-1.5 text-center text-[12px] font-bold leading-[20px] text-[var(--c-on-mark)]" aria-label={`${n} waiting`}>
                        {n}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Identity() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const name = user?.name || "You";
  const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="border-t border-[var(--c-line)] p-3">
      <div className="flex items-center gap-2.5 px-1">
        <span aria-hidden className="c-mono grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-[var(--c-text)] text-[12px] font-semibold text-[var(--c-bg)]">{initials}</span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[13.5px] font-semibold text-[var(--c-text)]">{name}</div>
          <div className="truncate text-[12.5px] text-[var(--c-muted)]">{user?.email}</div>
        </div>
        <button type="button" onClick={toggleDarkMode} aria-label={darkMode ? "Switch to light" : "Switch to dark"} className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[var(--c-muted)] hover:bg-[var(--c-panel-2)] hover:text-[var(--c-text)] ${RING}`}>
          {darkMode ? <Sun size={15} aria-hidden /> : <Moon size={15} aria-hidden />}
        </button>
      </div>
      <Link href="/" className={`mt-2 flex h-8 items-center rounded-[8px] px-2 text-[13px] text-[var(--c-muted)] hover:bg-[var(--c-panel-2)] hover:text-[var(--c-text)] ${RING}`}>
        ← Back to UniShare
      </Link>
    </div>
  );
}

/** Ctrl/Cmd+K: jump to any console section by typing part of its name. */
function Jump({ open, onClose }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef(null);
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ALL.filter((x) => `${x.label} ${x.group}`.toLowerCase().includes(s)) : ALL;
  }, [q]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setI(0);
    const id = requestAnimationFrame(() => input.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);
  useEffect(() => setI(0), [q]);

  const go = (x) => {
    if (!x) return;
    onClose();
    router.push(x.href);
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.12 }}>
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Jump to"
            className="relative w-full max-w-[460px] overflow-hidden rounded-[12px] border border-[var(--c-line-2)] bg-[var(--c-panel)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
            initial={reduce ? false : { y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.14 }}
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--c-line)] px-3.5">
              <Search size={16} className="text-[var(--c-faint)]" aria-hidden />
              <input
                ref={input}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") (e.preventDefault(), setI((v) => Math.min(hits.length - 1, v + 1)));
                  else if (e.key === "ArrowUp") (e.preventDefault(), setI((v) => Math.max(0, v - 1)));
                  else if (e.key === "Enter") (e.preventDefault(), go(hits[i]));
                  else if (e.key === "Escape") (e.preventDefault(), onClose());
                }}
                placeholder="Jump to…"
                aria-label="Jump to a section"
                aria-controls="c-jump-list"
                aria-activedescendant={hits[i] ? `c-jump-${i}` : undefined}
                role="combobox"
                aria-expanded="true"
                className="h-12 flex-1 bg-transparent text-[15px] text-[var(--c-text)] outline-none placeholder:text-[var(--c-faint)]"
              />
              <kbd className="c-code rounded-[5px] border border-[var(--c-line-2)] px-1.5 text-[11px] text-[var(--c-muted)]">Esc</kbd>
            </div>
            <ul id="c-jump-list" role="listbox" className="max-h-[320px] overflow-y-auto p-1.5">
              {hits.map((x, n) => (
                <li
                  key={x.href}
                  id={`c-jump-${n}`}
                  role="option"
                  aria-selected={n === i}
                  onPointerMove={() => setI(n)}
                  onClick={() => go(x)}
                  className={`flex cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 text-[14px] ${n === i ? "bg-[var(--c-panel-2)] text-[var(--c-text)]" : "text-[var(--c-muted)]"}`}
                >
                  <span>{x.label}</span>
                  <span className="text-[12.5px] text-[var(--c-faint)]">{x.group}</span>
                </li>
              ))}
              {!hits.length ? <li className="px-3 py-6 text-center text-[13.5px] text-[var(--c-faint)]">No section called “{q}”.</li> : null}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Frame({ children }) {
  const pathname = usePathname();
  const { darkMode } = useUI();
  const { updatedAt, reload, status } = useConsole();
  const [menu, setMenu] = useState(false);
  const [jump, setJump] = useState(false);
  const closeJump = useCallback(() => setJump(false), []);
  const here = ALL.filter((x) => isOn(pathname, x)).sort((a, b) => b.href.length - a.href.length)[0];

  useEffect(() => setMenu(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setJump((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div style={consoleVars(darkMode)} className="c-root fixed inset-0 z-[60] flex overflow-hidden bg-[var(--c-bg)] text-[var(--c-text)]">
      {/* Sidebar (desktop). */}
      <aside className="hidden w-[236px] shrink-0 flex-col border-r border-[var(--c-line)] bg-[var(--c-panel)] lg:flex">
        <div className="flex h-14 items-center px-5">
          <Link href="/console" aria-label="UniShare Console home" className={`rounded-[8px] ${RING}`}>
            <span className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-[-0.01em] text-[var(--c-text)]">UniShare</span>
              <span className="rounded-full bg-[var(--c-accent-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--c-accent-text)]">Console</span>
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 pb-4 pt-1">
          <NavList />
        </div>
        <Identity />
      </aside>

      {/* Mobile menu. */}
      <AnimatePresence>
        {menu ? (
          <motion.div className="fixed inset-0 z-[90] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/40" onClick={() => setMenu(false)} aria-hidden />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Console menu"
              className="absolute inset-y-0 left-0 flex w-[272px] flex-col border-r border-[var(--c-line)] bg-[var(--c-panel)]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 420, damping: 40 }}
            >
              <div className="flex h-14 items-center justify-between px-5">
                <span className="flex items-center gap-2">
              <span className="text-[15px] font-bold tracking-[-0.01em] text-[var(--c-text)]">UniShare</span>
              <span className="rounded-full bg-[var(--c-accent-soft)] px-2 py-0.5 text-[12px] font-semibold text-[var(--c-accent-text)]">Console</span>
            </span>
                <button type="button" onClick={() => setMenu(false)} className={`h-8 rounded-[9px] border border-[var(--c-line-2)] px-3 text-[13px] font-semibold text-[var(--c-text)] ${RING}`}>Close</button>
              </div>
              <div className="flex-1 overflow-y-auto px-2.5 pb-4">
                <NavList onNavigate={() => setMenu(false)} />
              </div>
              <Identity />
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar. */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--c-line)] px-4 sm:px-6">
          <button type="button" onClick={() => setMenu(true)} className={`h-8 rounded-[9px] border border-[var(--c-line-2)] px-3 text-[13px] font-semibold text-[var(--c-text)] lg:hidden ${RING}`}>Menu</button>
          <nav aria-label="You are here" className="min-w-0 flex-1 truncate text-[14px]">
            <span className="text-[var(--c-muted)]">Console</span>
            {here && here.href !== "/console" ? (
              <>
                <span aria-hidden className="mx-2 text-[var(--c-faint)]">/</span>
                <span className="font-semibold text-[var(--c-text)]">{here.label}</span>
              </>
            ) : null}
          </nav>
          <span className="hidden text-[13px] text-[var(--c-faint)] md:inline" aria-live="polite">
            {status === "refreshing" ? "Refreshing…" : updatedAt ? `Updated ${new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
          </span>
          <button type="button" onClick={reload} className={`h-8 rounded-[9px] border border-[var(--c-line-2)] px-3 text-[13px] font-semibold text-[var(--c-text)] hover:bg-[var(--c-panel-2)] ${RING}`}>Refresh</button>
          <button type="button" onClick={() => setJump(true)} className={`hidden h-8 items-center gap-2 rounded-[9px] border border-[var(--c-line-2)] pl-3 pr-1.5 text-[13px] font-semibold text-[var(--c-text)] hover:bg-[var(--c-panel-2)] sm:flex ${RING}`}>
            Jump to
            <kbd className="c-code rounded-[5px] bg-[var(--c-panel-2)] px-1.5 text-[11px] font-medium text-[var(--c-muted)] ring-1 ring-inset ring-[var(--c-line)]">Ctrl K</kbd>
          </button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1320px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      <Jump open={jump} onClose={closeJump} />
      <style>{CONSOLE_CSS}</style>
    </div>
  );
}

/**
 * The admin console frame. It covers the whole window (the public site's
 * chrome stays out of the way) and shares one overview feed with every page.
 */
export default function ConsoleShell({ children }) {
  return (
    <ConsoleProvider>
      <Frame>{children}</Frame>
    </ConsoleProvider>
  );
}
