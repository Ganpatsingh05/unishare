"use client";

// The Console's building blocks. Every section is made from these, so the
// whole Console reads as one tool. Hierarchy comes from size and weight:
// titles are large, values are bold, supporting text is smaller and muted.
// Blue marks what you can act on; yellow marks what is waiting on you.

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUI } from "@contexts/UniShareContext";
import { consoleVars } from "./consoleData";

export const RING = "outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--c-bg)]";

/** Fonts for anything rendered inside the Console (the shell and portals). */
export const CONSOLE_CSS = `
  .c-root { font-family: var(--font-geist-sans), system-ui, -apple-system, "Segoe UI", sans-serif; }
  .c-root .c-mono { font-variant-numeric: tabular-nums; }
  .c-root .c-code { font-family: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.92em; }
`;

/** "4m ago", "3h ago", "2d ago", or a short date. */
export function since(iso) {
  if (!iso) return "—";
  const s = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 7 * 86400) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export const dateTime = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");

/* ----------------------------------------------------------------- page */

/** Section title, one line of context, and the section's main actions. */
export function PageHead({ title, lead, actions, eyebrow }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[13px] font-medium text-[var(--c-muted)]">{eyebrow}</p> : null}
        <h1 className="mt-0.5 text-[28px] font-bold leading-tight tracking-[-0.02em] text-[var(--c-text)] sm:text-[32px]">{title}</h1>
        {lead ? <p className="mt-1.5 max-w-[62ch] text-[15px] leading-relaxed text-[var(--c-muted)]">{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** A row of figures; `mark` highlights one that needs attention. */
export function Stats({ items }) {
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => {
        const hot = it.mark && it.value;
        return (
          <div key={it.label} className="rounded-[14px] border p-4" style={{ borderColor: hot ? "var(--c-mark)" : "var(--c-line)", background: hot ? "color-mix(in srgb, var(--c-mark) 10%, var(--c-panel))" : "var(--c-panel)" }}>
            <dt className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--c-muted)]">
              {hot ? <span aria-hidden className="h-2 w-2 rounded-full bg-[var(--c-mark)]" /> : null}
              {it.label}
            </dt>
            <dd className="c-mono mt-1.5 text-[28px] font-bold leading-none tracking-[-0.02em] text-[var(--c-text)]">{it.value ?? "—"}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/** The card that holds a section's list. */
export function Panel({ children, className = "" }) {
  return <section className={`overflow-hidden rounded-[14px] border border-[var(--c-line)] bg-[var(--c-panel)] ${className}`}>{children}</section>;
}

/* -------------------------------------------------------------- controls */

const TONES = {
  primary: "border-transparent bg-[var(--c-accent)] text-[var(--c-on-accent)] hover:brightness-110 shadow-[0_1px_0_rgba(0,0,0,0.04)]",
  plain: "border-[var(--c-line-2)] bg-[var(--c-panel)] text-[var(--c-text)] hover:bg-[var(--c-panel-2)]",
  ghost: "border-transparent text-[var(--c-muted)] hover:bg-[var(--c-panel-2)] hover:text-[var(--c-text)]",
  danger: "border-transparent bg-[var(--c-bad)] text-white hover:brightness-110",
  mark: "border-transparent bg-[var(--c-mark)] text-[var(--c-on-mark)] hover:brightness-105",
};

export function Button({ tone = "plain", size = "md", className = "", children, ...rest }) {
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-9 px-4 text-[14px]" };
  return (
    <button type="button" className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[9px] border font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${sizes[size]} ${TONES[tone]} ${RING} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** A destructive button that asks once more, in place. */
export function ConfirmButton({ children = "Delete", question = "Delete?", confirmLabel = "Delete", onConfirm, size = "sm", disabled }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!asking) return undefined;
    const t = setTimeout(() => setAsking(false), 6000);
    return () => clearTimeout(t);
  }, [asking]);
  if (!asking) {
    return (
      <Button size={size} tone="ghost" disabled={disabled} onClick={() => setAsking(true)} className="text-[var(--c-bad)] hover:text-[var(--c-bad)]">
        {children}
      </Button>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-[13px] font-medium text-[var(--c-text)]">{question}</span>
      <Button
        size={size}
        tone="danger"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? "Deleting…" : confirmLabel}
      </Button>
      <Button size={size} tone="plain" onClick={() => setAsking(false)}>
        Keep
      </Button>
    </span>
  );
}

/** Text search with a "/" shortcut. */
export function SearchField({ value, onChange, placeholder = "Search", className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const el = document.activeElement;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      ref.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
  return (
    <label className={`flex h-9 min-w-0 items-center gap-2 rounded-[9px] border border-[var(--c-line-2)] bg-[var(--c-panel)] px-3 focus-within:border-[var(--c-accent)] ${className}`}>
      <span className="sr-only">{placeholder}</span>
      <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-[14px] text-[var(--c-text)] outline-none placeholder:text-[var(--c-faint)]" />
      {value ? (
        <button type="button" onClick={() => onChange("")} className={`rounded px-1 text-[12px] font-medium text-[var(--c-muted)] hover:text-[var(--c-text)] ${RING}`}>
          Clear
        </button>
      ) : (
        <kbd className="c-code rounded-[4px] border border-[var(--c-line-2)] px-1 text-[11px] text-[var(--c-faint)]">/</kbd>
      )}
    </label>
  );
}

const capital = (s) => (typeof s === "string" && s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** Tabs as a soft segmented control, each with an optional count. */
export function Segmented({ value, onChange, options, label }) {
  return (
    <div role="tablist" aria-label={label} className="flex max-w-full gap-0.5 overflow-x-auto rounded-[10px] bg-[var(--c-panel-2)] p-1 ring-1 ring-inset ring-[var(--c-line)] [scrollbar-width:none]">
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(o.value)}
            className={`inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[7px] px-3 text-[13.5px] font-semibold transition-colors ${on ? "bg-[var(--c-panel)] text-[var(--c-text)] shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"} ${RING}`}
          >
            {capital(o.label)}
            {o.count != null ? (
              <span className={`c-mono rounded-full px-1.5 text-[11.5px] font-semibold leading-[18px] ${on ? "bg-[var(--c-accent-soft)] text-[var(--c-accent-text)]" : "bg-[var(--c-line)] text-[var(--c-muted)]"}`}>{o.count}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

/** A native select in Console clothing. */
export function Select({ value, onChange, options, label, className = "" }) {
  return (
    <label className={`relative inline-flex h-9 items-center ${className}`}>
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`h-9 appearance-none rounded-[9px] border border-[var(--c-line-2)] bg-[var(--c-panel)] pl-3 pr-8 text-[14px] text-[var(--c-text)] ${RING}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-3 h-[6px] w-[10px] text-[var(--c-muted)]"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </label>
  );
}

/** Search, filters and tabs above a list. */
export function Toolbar({ children }) {
  return <div className="flex flex-wrap items-center gap-2.5 border-b border-[var(--c-line)] px-4 py-3 sm:px-5">{children}</div>;
}

/* ----------------------------------------------------------------- table */

export function Table({ children, minWidth = 720, label }) {
  return (
    <div className="overflow-x-auto">
      <table aria-label={label} className="w-full border-collapse text-left" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export function Th({ children, align = "left", className = "" }) {
  return (
    <th scope="col" className={`whitespace-nowrap border-b border-[var(--c-line)] bg-[var(--c-panel-2)] px-4 py-2.5 text-[12.5px] font-semibold text-[var(--c-muted)] first:pl-5 last:pr-5 ${align === "right" ? "text-right" : ""} ${className}`}>
      {children}
    </th>
  );
}

export function Tr({ children, onClick, selected }) {
  return (
    <tr onClick={onClick} className={`border-b border-[var(--c-line)] transition-colors last:border-b-0 ${onClick ? "cursor-pointer" : ""} ${selected ? "bg-[var(--c-accent-soft)]" : "hover:bg-[var(--c-panel-2)]"}`}>
      {children}
    </tr>
  );
}

export function Td({ children, align = "left", className = "", mono = false }) {
  return <td className={`px-4 py-3.5 align-middle text-[14px] text-[var(--c-text)] first:pl-5 last:pr-5 ${align === "right" ? "text-right" : ""} ${mono ? "c-mono text-[13.5px]" : ""} ${className}`}>{children}</td>;
}

/** Main line plus a quieter second line, for a table cell. */
export function TwoLine({ title, sub, clamp = true }) {
  return (
    <div className="min-w-0">
      <div className={`text-[14.5px] font-semibold text-[var(--c-text)] ${clamp ? "truncate" : ""}`}>{title}</div>
      {sub ? <div className={`mt-0.5 text-[13px] leading-snug text-[var(--c-muted)] ${clamp ? "line-clamp-1" : ""}`}>{sub}</div> : null}
    </div>
  );
}

/** A small coloured status pill. */
export function Tag({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "var(--c-panel-2)", fg: "var(--c-muted)", dot: "var(--c-faint)", ring: "var(--c-line-2)" },
    good: { bg: "var(--c-good-soft)", fg: "var(--c-good-ink)", dot: "var(--c-good)", ring: "transparent" },
    bad: { bg: "var(--c-bad-soft)", fg: "var(--c-bad-ink)", dot: "var(--c-bad)", ring: "transparent" },
    warn: { bg: "var(--c-warn-soft)", fg: "var(--c-warn-ink)", dot: "#F59E0B", ring: "transparent" },
    mark: { bg: "var(--c-mark)", fg: "var(--c-on-mark)", dot: "var(--c-on-mark)", ring: "transparent" },
    info: { bg: "var(--c-accent-soft)", fg: "var(--c-accent-text)", dot: "var(--c-accent)", ring: "transparent" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span className="inline-flex h-6 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold" style={{ background: t.bg, color: t.fg, boxShadow: `inset 0 0 0 1px ${t.ring}` }}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: t.dot }} />
      {capital(children)}
    </span>
  );
}

/** Placeholder rows while a list loads. */
export function SkeletonRows({ rows = 6 }) {
  return (
    <div aria-busy="true" aria-label="Loading" className="divide-y divide-[var(--c-line)]">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-3.5 w-1/3 animate-pulse rounded bg-[var(--c-panel-2)]" />
          <div className="h-3.5 w-1/5 animate-pulse rounded bg-[var(--c-panel-2)]" />
          <div className="ml-auto h-3.5 w-16 animate-pulse rounded bg-[var(--c-panel-2)]" />
        </div>
      ))}
    </div>
  );
}

export function Empty({ title = "Nothing here", body, action }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="text-[16px] font-semibold text-[var(--c-text)]">{capital(title)}</div>
      {body ? <p className="mt-1.5 max-w-[26rem] text-[14px] leading-relaxed text-[var(--c-muted)]">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Failed({ message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-14 text-center">
      <div className="text-[16px] font-semibold text-[var(--c-bad-ink)]">Couldn't load this</div>
      <p className="mt-1.5 max-w-[28rem] text-[14px] leading-relaxed text-[var(--c-muted)]">{message}</p>
      {onRetry ? (
        <Button tone="primary" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

/** A status line under a list ("Saved", "Couldn't delete …"). */
export function useFlash() {
  const [flash, setFlash] = useState(null);
  const timer = useRef(0);
  const show = useCallback((text, ok = true) => {
    clearTimeout(timer.current);
    setFlash({ text, ok });
    timer.current = setTimeout(() => setFlash(null), 5000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [flash, show];
}

export function FlashLine({ flash, hint }) {
  return (
    <div className="flex min-h-[42px] items-center justify-between gap-3 border-t border-[var(--c-line)] bg-[var(--c-panel-2)] px-5 py-2">
      <p className="hidden text-[12.5px] text-[var(--c-faint)] md:block">{hint}</p>
      <p role="status" aria-live="polite" className="ml-auto truncate text-[13px] font-semibold" style={{ color: flash ? (flash.ok ? "var(--c-good-ink)" : "var(--c-bad-ink)") : "transparent" }}>
        {flash?.text || "."}
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------- drawer */

/**
 * A panel that slides in from the right for creating, editing or reading one
 * thing. Esc or the backdrop closes it; focus moves in and comes back.
 */
export function Drawer({ open, onClose, title, subtitle, children, footer, width = 520 }) {
  const { darkMode } = useUI();
  const reduce = useReducedMotion();
  const panel = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const back = document.activeElement;
    const id = requestAnimationFrame(() => {
      const first = panel.current?.querySelector("input, textarea, select, button:not([data-close])");
      (first || panel.current)?.focus();
    });
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener("keydown", onKey);
      back?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div key="drawer" style={consoleVars(darkMode)} className="c-root fixed inset-0 z-[95] text-[var(--c-text)]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div aria-hidden className="absolute inset-0 bg-black/40" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.15 }} />
          <motion.aside
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 right-0 flex w-full flex-col border-l border-[var(--c-line)] bg-[var(--c-panel)] shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.35)] outline-none"
            style={{ maxWidth: width }}
            initial={reduce ? { opacity: 0 } : { x: "100%" }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: "100%" }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 42 }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--c-line)] px-6 py-5">
              <div className="min-w-0">
                <h2 id={titleId} className="text-[19px] font-bold leading-snug tracking-[-0.01em]">{title}</h2>
                {subtitle ? <p className="mt-1 truncate text-[13px] text-[var(--c-muted)]">{capital(subtitle)}</p> : null}
              </div>
              <Button size="sm" tone="plain" data-close onClick={onClose} aria-label="Close">
                Close
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer ? <div className="flex items-center justify-end gap-2 border-t border-[var(--c-line)] bg-[var(--c-panel-2)] px-6 py-3.5">{footer}</div> : null}
          </motion.aside>
          <style>{CONSOLE_CSS}</style>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

/* ----------------------------------------------------------------- forms */

const inputCls = `w-full rounded-[9px] border border-[var(--c-line-2)] bg-[var(--c-panel)] px-3 text-[14.5px] text-[var(--c-text)] placeholder:text-[var(--c-faint)] focus:border-[var(--c-accent)] ${RING}`;

/** Label, control and a hint or error underneath. */
export function Field({ label, hint, error, children, count }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-[14px] font-semibold text-[var(--c-text)]">{label}</label>
        {count ? <span className="c-mono text-[12px] text-[var(--c-faint)]">{count}</span> : null}
      </div>
      {typeof children === "function" ? children(id) : children}
      {error ? <p className="text-[13px] font-medium text-[var(--c-bad-ink)]">{error}</p> : hint ? <p className="text-[13px] text-[var(--c-muted)]">{hint}</p> : null}
    </div>
  );
}

export function TextInput({ id, ...rest }) {
  return <input id={id} className={`${inputCls} h-10`} {...rest} />;
}

export function TextArea({ id, rows = 5, ...rest }) {
  return <textarea id={id} rows={rows} className={`${inputCls} resize-y py-2.5 leading-relaxed`} {...rest} />;
}

export function SelectInput({ id, options, ...rest }) {
  return (
    <span className="relative block">
      <select id={id} className={`${inputCls} h-10 appearance-none pr-8`} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg aria-hidden viewBox="0 0 10 6" className="pointer-events-none absolute right-3 top-1/2 h-[6px] w-[10px] -translate-y-1/2 text-[var(--c-muted)]"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  );
}

/** One-of-a-few choice, shown as joined buttons. */
export function Choice({ value, onChange, options, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex gap-0.5 rounded-[10px] bg-[var(--c-panel-2)] p-1 ring-1 ring-inset ring-[var(--c-line)]">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button key={o.value} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)} className={`h-8 rounded-[7px] px-3.5 text-[13.5px] font-semibold transition-colors ${on ? "bg-[var(--c-panel)] text-[var(--c-text)] shadow-[0_1px_2px_rgba(0,0,0,0.12)]" : "text-[var(--c-muted)] hover:text-[var(--c-text)]"} ${RING}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** An on/off switch with its label. */
export function Toggle({ checked, onChange, label, hint }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`flex w-full items-start justify-between gap-4 rounded-[12px] border border-[var(--c-line-2)] px-4 py-3 text-left ${RING}`}>
      <span>
        <span className="block text-[14px] font-semibold">{label}</span>
        {hint ? <span className="mt-0.5 block text-[13px] text-[var(--c-muted)]">{hint}</span> : null}
      </span>
      <span aria-hidden className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--c-accent)]" : "bg-[var(--c-line-2)]"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

/** Label/value rows for a detail drawer. */
export function Facts({ rows }) {
  return (
    <dl className="divide-y divide-[var(--c-line)] rounded-[12px] border border-[var(--c-line)]">
      {rows.filter(Boolean).map(([k, v]) => (
        <div key={k} className="grid grid-cols-[140px_minmax(0,1fr)] gap-3 px-4 py-3">
          <dt className="text-[13px] font-medium text-[var(--c-muted)]">{k}</dt>
          <dd className="min-w-0 break-words text-[14px] text-[var(--c-text)]">{v ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
