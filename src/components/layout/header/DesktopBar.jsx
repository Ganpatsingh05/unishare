"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bell, ChevronDown, LogOut, Plus, Search } from "lucide-react";
import { useNotifications } from "@contexts/UniShareContext";
import { ACCOUNT_LINKS, FEATURES, HELP_LINKS, QUICK_ACTIONS, featureByKey, isCurrent, sectionFor } from "./navConfig";
import { GLASS, HeaderAvatar, RING, Wordmark } from "./headerKit";
import ThemeButton from "./ThemeButton";
import { Kbd } from "./SearchPalette";

const EASE = [0.22, 1, 0.36, 1];

/** Close a popover on outside press or Esc; returns focus to its trigger on Esc. */
function useDismiss(open, setOpen, boxRef, triggerRef) {
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen, boxRef, triggerRef]);
}

// The outer box only positions; the inner one animates, so their transforms never clash.
function Popover({ open, id, className, children, reduce }) {
  return (
    <div className={`absolute top-[calc(100%+10px)] z-10 ${className}`}>
      <AnimatePresence>
        {open ? (
          <motion.div
            id={id}
            className="overflow-hidden rounded-[22px] border border-[var(--hd-border)] bg-[var(--hd-panel)] text-[var(--hd-text)] shadow-[var(--hd-shadow)]"
            initial={reduce ? false : { opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: reduce ? 0 : 0.18, ease: EASE }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** "Explore": every feature with a one-liner, plus the common things to post. */
function ExploreMenu({ dark, pathname, pill, reduce, active }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const hoverTimer = useRef(0);
  const id = useId();
  useDismiss(open, setOpen, boxRef, triggerRef);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  // Open on hover for mouse users, with a short delay so passing over it does nothing.
  const enter = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(true), 110);
  };
  const leave = (e) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpen(false), 180);
  };

  return (
    // Not positioned on purpose: the panel anchors to the whole bar, so it stays centred and on screen.
    <div ref={boxRef} onPointerEnter={enter} onPointerLeave={leave}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={pill.enter}
        className={`relative flex h-10 items-center gap-1.5 rounded-full px-3.5 text-[14.5px] font-semibold transition-colors ${active || open ? "text-[var(--hd-text)]" : "text-[var(--hd-muted)] hover:text-[var(--hd-text)]"} ${RING}`}
      >
        {pill.render}
        <span className="relative">Explore</span>
        <ChevronDown size={16} aria-hidden className="relative transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      <div className="absolute left-1/2 top-0 h-full w-0">
        <Popover open={open} id={id} reduce={reduce} className="left-0 w-[min(760px,calc(100vw-48px))] -translate-x-1/2">
          <div className="grid grid-cols-[minmax(0,1fr)_228px] gap-2 p-2.5">
            <ul className="grid grid-cols-2 gap-0.5">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                const ink = f.ink[dark ? 1 : 0];
                const here = isCurrent(pathname, f.base);
                return (
                  <li key={f.key}>
                    <Link
                      href={f.href}
                      aria-current={here ? "page" : undefined}
                      className={`group flex items-center gap-3 rounded-[16px] p-2.5 transition-colors hover:bg-[var(--hd-hover)] ${here ? "bg-[var(--hd-hover)]" : ""} ${RING}`}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[13px] transition-transform duration-200 group-hover:scale-[1.06]" style={{ color: ink, backgroundColor: `${ink}${dark ? "26" : "1A"}` }}>
                        <Icon size={21} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14.5px] font-bold leading-tight">{f.label}</span>
                        <span className="mt-0.5 block truncate text-[13px] text-[var(--hd-muted)]">{f.desc}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-col rounded-[16px] bg-[var(--hd-hover)] p-3">
              <div className="px-1 pb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[var(--hd-muted)]">Post something</div>
              <ul className="flex flex-col gap-0.5">
                {QUICK_ACTIONS.map((a) => {
                  const ink = featureByKey[a.feature].ink[dark ? 1 : 0];
                  return (
                    <li key={a.href}>
                      <Link href={a.href} className={`flex items-center gap-2.5 rounded-[12px] px-2 py-2 text-[14px] font-semibold transition-colors hover:bg-[var(--hd-panel)] ${RING}`}>
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full" style={{ color: ink, backgroundColor: `${ink}${dark ? "2E" : "1F"}` }}>
                          <Plus size={14} strokeWidth={2.5} aria-hidden />
                        </span>
                        {a.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link href="/#how-it-works" className={`group mt-auto flex items-center justify-between rounded-[12px] px-2 pt-3 text-[13.5px] font-semibold text-[var(--hd-accent)] ${RING}`}>
                How UniShare works
                <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}

/** Avatar button and the account menu under it. */
function AccountMenu({ me, onSignOut, pathname, reduce }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const triggerRef = useRef(null);
  const id = useId();
  useDismiss(open, setOpen, boxRef, triggerRef);
  useEffect(() => setOpen(false), [pathname]);
  const links = [...ACCOUNT_LINKS, HELP_LINKS[0]];

  return (
    <div ref={boxRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        aria-label={`Account menu for ${me.name || "you"}`}
        onClick={() => setOpen((v) => !v)}
        className={`ml-1 grid place-items-center rounded-full p-[2px] transition-shadow ${RING}`}
        style={{ boxShadow: open ? "0 0 0 2px var(--hd-accent)" : "0 0 0 2px var(--hd-border)" }}
      >
        <HeaderAvatar me={me} size={36} />
      </button>
      <Popover open={open} id={id} reduce={reduce} className="right-0 w-[290px]">
        <div className="flex items-center gap-3 border-b border-[var(--hd-border)] p-4">
          <HeaderAvatar me={me} size={44} />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-bold">{me.name || "Welcome"}</div>
            <div className="truncate text-[13px] text-[var(--hd-muted)]">{me.handle ? `@${me.handle}` : me.email}</div>
          </div>
        </div>
        <ul role="menu" aria-label="Account" className="p-1.5">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <li key={l.href} role="none">
                <Link role="menuitem" href={l.href} className={`flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[14.5px] font-semibold transition-colors hover:bg-[var(--hd-hover)] ${RING}`}>
                  <Icon size={18} className="text-[var(--hd-muted)]" aria-hidden />
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li role="none" className="mt-1 border-t border-[var(--hd-border)] pt-1">
            <button role="menuitem" type="button" onClick={onSignOut} className={`flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left text-[14.5px] font-semibold text-[var(--hd-danger)] transition-colors hover:bg-[var(--hd-hover)] ${RING}`}>
              <LogOut size={18} aria-hidden />
              Sign out
            </button>
          </li>
        </ul>
      </Popover>
    </div>
  );
}

/**
 * The desktop and tablet header: brand and current section on the left, the
 * main navigation in the middle, search and account on the right, on frosted glass.
 */
export default function DesktopBar({ dark, me, onSearch, bellRef, onBell, onSignOut, shortcut }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { hasUnread } = useNotifications();
  const section = sectionFor(pathname);
  const [hovered, setHovered] = useState(null);

  const items = [
    { key: "explore", active: Boolean(section) },
    ...(me.signedIn ? [{ key: "activity", label: "My activity", href: "/my-activity", lgOnly: true }] : []),
    { key: "help", label: "Help", href: "/info/help" },
  ].map((it) => ({ ...it, active: it.active ?? isCurrent(pathname, it.href) }));
  const restingKey = items.find((it) => it.active)?.key || null;
  const pillKey = hovered || restingKey;

  // A soft pill that slides to the hovered item and rests on the current one.
  const pillFor = (key) => ({
    enter: () => setHovered(key),
    render:
      pillKey === key ? (
        <motion.span layoutId="hd-pill" aria-hidden className="absolute inset-0 rounded-full bg-[var(--hd-hover)]" transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 480, damping: 38 }} />
      ) : null,
  });

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[70] hidden justify-center px-4 md:flex">
      <div
        className="pointer-events-auto relative grid w-full max-w-[1180px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] h-16 items-center rounded-[22px] px-2.5 text-[var(--hd-text)]"
        style={GLASS}
      >
        {/* Brand, then the section you're in. */}
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/" aria-label="UniShare home" className={`flex shrink-0 items-center gap-2.5 rounded-[14px] py-1 pl-1.5 pr-2 ${RING}`}>
            <Image src="/images/logos/logounishare1.png" alt="" width={34} height={34} priority className="h-[34px] w-[34px] object-contain" />
            <Wordmark dark={dark} className="text-[21px]" />
          </Link>
          <AnimatePresence mode="wait" initial={false}>
            {section ? (
              <motion.div
                key={section.key}
                className="hidden min-w-0 items-center gap-2 lg:flex"
                initial={reduce ? false : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -6 }}
                transition={{ duration: reduce ? 0 : 0.2, ease: EASE }}
              >
                <span aria-hidden className="text-[20px] font-light text-[var(--hd-border)]" style={{ color: "var(--hd-muted)", opacity: 0.5 }}>/</span>
                <Link href={section.href} className={`flex min-w-0 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-[14.5px] font-bold transition-colors hover:bg-[var(--hd-hover)] ${RING}`}>
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ color: section.ink[dark ? 1 : 0], backgroundColor: `${section.ink[dark ? 1 : 0]}${dark ? "26" : "1A"}` }}>
                    <section.icon size={15} aria-hidden />
                  </span>
                  <span className="truncate">{section.label}</span>
                </Link>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {/* Main navigation. */}
        <nav aria-label="Main" onPointerLeave={() => setHovered(null)}>
          <ul className="flex items-center gap-0.5">
            {items.map((it) =>
              it.key === "explore" ? (
                <li key={it.key}>
                  <ExploreMenu dark={dark} pathname={pathname} pill={pillFor(it.key)} reduce={reduce} active={it.active} />
                </li>
              ) : (
                <li key={it.key} className={it.lgOnly ? "hidden lg:block" : undefined}>
                  <Link
                    href={it.href}
                    aria-current={it.active ? "page" : undefined}
                    onPointerEnter={pillFor(it.key).enter}
                    className={`relative flex h-10 items-center rounded-full px-3.5 text-[14.5px] font-semibold transition-colors ${it.active ? "text-[var(--hd-text)]" : "text-[var(--hd-muted)] hover:text-[var(--hd-text)]"} ${RING}`}
                  >
                    {pillFor(it.key).render}
                    <span className="relative">{it.label}</span>
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Search, theme, notifications, account. */}
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onSearch}
            aria-label="Search UniShare"
            aria-keyshortcuts={shortcut === "⌘" ? "Meta+K" : "Control+K"}
            className={`flex h-10 items-center gap-2 rounded-full text-[var(--hd-muted)] transition-colors hover:bg-[var(--hd-hover)] hover:text-[var(--hd-text)] whitespace-nowrap lg:mr-1 lg:w-[236px] lg:border lg:border-[var(--hd-border)] lg:pl-3.5 lg:pr-1.5 ${RING} w-10 justify-center lg:justify-start`}
          >
            <Search size={18} aria-hidden className="shrink-0" />
            <span className="hidden flex-1 text-left text-[14px] font-medium lg:inline">Search UniShare…</span>
            <span className="hidden items-center gap-0.5 lg:inline-flex" aria-hidden>
              <Kbd>{shortcut === "⌘" ? "⌘" : "Ctrl"}</Kbd>
              <Kbd>K</Kbd>
            </span>
          </button>
          <ThemeButton />
          {me.signedIn ? (
            <>
              <button
                ref={bellRef}
                type="button"
                onClick={onBell}
                aria-label={hasUnread ? "Notifications, you have unread ones" : "Notifications"}
                className={`relative grid h-10 w-10 place-items-center rounded-full text-[var(--hd-text)] transition-colors hover:bg-[var(--hd-hover)] ${RING}`}
              >
                <Bell size={19} aria-hidden />
                {hasUnread ? <span aria-hidden className="absolute right-[9px] top-[9px] h-2.5 w-2.5 rounded-full border-2 border-[var(--hd-panel)] bg-[#EF4444]" /> : null}
              </button>
              <AccountMenu me={me} onSignOut={onSignOut} pathname={pathname} reduce={reduce} />
            </>
          ) : me.loading ? (
            <span aria-hidden className="ml-1 h-10 w-24 animate-pulse rounded-full bg-[var(--hd-hover)]" />
          ) : (
            <Link href="/login" className={`group ml-1 flex h-10 items-center gap-1.5 rounded-full bg-[var(--hd-accent)] px-4 text-[14.5px] font-bold text-[var(--hd-on-accent)] transition-transform hover:-translate-y-px ${RING}`}>
              Sign in
              <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
