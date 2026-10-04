"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bell, ChevronRight, LogOut, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useNotifications, useUI } from "@contexts/UniShareContext";
import { ACCOUNT_LINKS, FEATURES, HELP_LINKS, isCurrent } from "./navConfig";
import { GLASS, HeaderAvatar, RING, Wordmark, headerVars, useScrollLock } from "./headerKit";
import ThemeButton from "./ThemeButton";

const EASE = [0.22, 1, 0.36, 1];

/** Two-way Light / Dark switch for the menu sheet. */
function ThemeSwitch() {
  const { darkMode, setDarkMode } = useUI();
  const options = [
    { value: false, label: "Light", icon: Sun },
    { value: true, label: "Dark", icon: Moon },
  ];
  return (
    <div role="radiogroup" aria-label="Theme" className="grid grid-cols-2 gap-1 rounded-[16px] bg-[var(--hd-hover)] p-1">
      {options.map((o) => {
        const on = darkMode === o.value;
        const Icon = o.icon;
        return (
          <button
            key={o.label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => !on && setDarkMode(o.value)}
            className={`flex h-11 items-center justify-center gap-2 rounded-[12px] text-[14.5px] font-semibold transition-colors ${on ? "bg-[var(--hd-panel)] text-[var(--hd-text)] shadow-sm" : "text-[var(--hd-muted)]"} ${RING}`}
          >
            <Icon size={17} aria-hidden />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The phone menu: a sheet from the bottom with your profile, every feature,
 * account and help links, the theme switch and sign out. Drag it down, tap
 * outside or press Esc to close.
 */
function MenuSheet({ open, onClose, me, onSignOut }) {
  const { darkMode } = useUI();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const closeRef = useRef(null);
  useScrollLock(open);

  useEffect(() => {
    if (!open) return undefined;
    const back = document.activeElement;
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      back?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  const links = [...ACCOUNT_LINKS.filter(() => me.signedIn), ...HELP_LINKS];

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div key="sheet" className="fixed inset-0 z-[90] md:hidden" style={headerVars(darkMode)} initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[rgba(8,12,20,0.5)]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute inset-x-0 bottom-0 flex max-h-[90dvh] flex-col rounded-t-[28px] border-t border-[var(--hd-border)] bg-[var(--hd-panel)] text-[var(--hd-text)] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.45)]"
            initial={reduce ? { opacity: 0 } : { y: "100%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 40 }}
            drag={reduce ? false : "y"}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => (info.offset.y > 110 || info.velocity.y > 600) && onClose()}
          >
            <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-2.5">
              <span aria-hidden className="absolute left-1/2 top-2 h-1.5 w-11 -translate-x-1/2 rounded-full bg-[var(--hd-border)]" style={{ backgroundColor: "var(--hd-muted)", opacity: 0.35 }} />
              <span className="pt-4 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--hd-muted)]">Menu</span>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className={`mt-3 grid h-10 w-10 place-items-center rounded-full bg-[var(--hd-hover)] ${RING}`}>
                <X size={19} aria-hidden />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
              {/* You. */}
              {me.signedIn ? (
                <Link href="/profile" onClick={onClose} className={`mt-2 flex items-center gap-3 rounded-[20px] border border-[var(--hd-border)] p-3 ${RING}`}>
                  <HeaderAvatar me={me} size={48} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] font-bold">{me.name || "Your profile"}</span>
                    <span className="block truncate text-[13.5px] text-[var(--hd-muted)]">{me.handle ? `@${me.handle}` : me.email}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-0.5 text-[13.5px] font-semibold text-[var(--hd-accent)]">
                    View
                    <ChevronRight size={16} aria-hidden />
                  </span>
                </Link>
              ) : (
                <div className="mt-2 rounded-[20px] border border-[var(--hd-border)] p-4">
                  <div className="text-[16px] font-bold">Sign in to UniShare</div>
                  <div className="mt-0.5 text-[14px] text-[var(--hd-muted)]">Post rides, rooms and more, and keep track of it all.</div>
                  <Link href="/login" onClick={onClose} className={`mt-3 flex h-11 items-center justify-center gap-1.5 rounded-full bg-[var(--hd-accent)] text-[15px] font-bold text-[var(--hd-on-accent)] ${RING}`}>
                    Sign in
                    <ArrowRight size={17} aria-hidden />
                  </Link>
                </div>
              )}

              {/* Every feature. */}
              <h2 className="px-1 pb-2 pt-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--hd-muted)]">Explore</h2>
              <ul className="grid grid-cols-4 gap-1.5">
                {FEATURES.map((f, i) => {
                  const Icon = f.icon;
                  const ink = f.ink[darkMode ? 1 : 0];
                  const here = isCurrent(pathname, f.base);
                  return (
                    <motion.li
                      key={f.key}
                      initial={reduce ? false : { opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: reduce ? 0 : 0.05 + i * 0.025, duration: reduce ? 0 : 0.25, ease: EASE }}
                    >
                      <Link
                        href={f.href}
                        onClick={onClose}
                        aria-current={here ? "page" : undefined}
                        className={`flex flex-col items-center gap-1.5 rounded-[16px] px-1 py-2.5 text-center transition-colors active:bg-[var(--hd-hover)] ${here ? "bg-[var(--hd-hover)]" : ""} ${RING}`}
                      >
                        <span className="grid h-12 w-12 place-items-center rounded-[15px]" style={{ color: ink, backgroundColor: `${ink}${darkMode ? "26" : "1A"}` }}>
                          <Icon size={22} aria-hidden />
                        </span>
                        <span className="line-clamp-2 w-full break-words text-[12.5px] font-semibold leading-[1.2]">{f.short || f.label}</span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Account and help. */}
              <ul className="mt-4 overflow-hidden rounded-[20px] border border-[var(--hd-border)]">
                {links.map((l, i) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.href} className={i ? "border-t border-[var(--hd-border)]" : undefined}>
                      <Link href={l.href} onClick={onClose} className={`flex min-h-[52px] items-center gap-3 px-4 text-[15px] font-semibold active:bg-[var(--hd-hover)] ${RING}`}>
                        <Icon size={19} className="text-[var(--hd-muted)]" aria-hidden />
                        <span className="flex-1">{l.label}</span>
                        <ChevronRight size={17} className="text-[var(--hd-muted)]" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <h2 className="px-1 pb-2 pt-5 text-[13px] font-bold uppercase tracking-[0.08em] text-[var(--hd-muted)]">Appearance</h2>
              <ThemeSwitch />

              {me.signedIn ? (
                <button type="button" onClick={onSignOut} className={`mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[16px] border border-[var(--hd-border)] text-[15px] font-bold text-[var(--hd-danger)] active:bg-[var(--hd-hover)] ${RING}`}>
                  <LogOut size={18} aria-hidden />
                  Sign out
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

/**
 * The phone header: back (or the logo on home), the wordmark in the middle,
 * then search, notifications and your avatar, which opens the menu sheet.
 */
export default function MobileBar({ dark, me, onSearch, onBell, onSignOut, fixed = true }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasUnread } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const home = pathname === "/";
  useEffect(() => setMenuOpen(false), [pathname]);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };
  const iconBtn = `relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--hd-text)] transition-colors active:bg-[var(--hd-hover)] ${RING}`;

  return (
    <div className={`${fixed ? "fixed inset-x-0 top-2 z-[70]" : "relative"} px-3 md:hidden`}>
      <div
        className="relative flex h-14 items-center justify-between rounded-[18px] px-1.5 text-[var(--hd-text)]"
        style={GLASS}
      >
        {home ? (
          <span className="grid h-10 w-10 place-items-center">
            <Image src="/images/logos/logounishare1.png" alt="" width={30} height={30} priority className="h-[30px] w-[30px] object-contain" />
          </span>
        ) : (
          <button type="button" onClick={goBack} aria-label="Go back" className={iconBtn}>
            <ArrowLeft size={21} aria-hidden />
          </button>
        )}

        <Link href="/" aria-label="UniShare home" className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-[12px] px-1.5 py-1 ${RING}`}>
          <Wordmark dark={dark} className="text-[19px]" />
        </Link>

        <div className="flex items-center">
          <button type="button" onClick={onSearch} aria-label="Search UniShare" className={iconBtn}>
            <Search size={20} aria-hidden />
          </button>
          {me.signedIn ? (
            <>
              <button type="button" onClick={onBell} aria-label={hasUnread ? "Notifications, you have unread ones" : "Notifications"} className={iconBtn}>
                <Bell size={20} aria-hidden />
                {hasUnread ? <span aria-hidden className="absolute right-[9px] top-[9px] h-2.5 w-2.5 rounded-full border-2 border-[var(--hd-panel)] bg-[#EF4444]" /> : null}
              </button>
              <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} className={`ml-0.5 grid place-items-center rounded-full p-[2px] ${RING}`} style={{ boxShadow: "0 0 0 2px var(--hd-border)" }}>
                <HeaderAvatar me={me} size={34} />
              </button>
            </>
          ) : (
            <>
              <ThemeButton />
              <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} className={iconBtn}>
                <Menu size={21} aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>
      <MenuSheet open={menuOpen} onClose={closeMenu} me={me} onSignOut={onSignOut} />
    </div>
  );
}
