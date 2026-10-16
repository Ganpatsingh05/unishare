"use client";

import Link from "next/link";
import { AlertCircle, Check, CheckCircle2, Loader2 } from "lucide-react";
import { AUTH, linkClass, providerButtonClass } from "./authTheme";

/* ── Tabs ─────────────────────────────────────────────────────────────────── */

export function AuthTabs({ value, onChange, disabled = false }) {
  const tabs = [
    { id: "login", label: "Sign in" },
    { id: "register", label: "Create account" },
  ];

  return (
    <div
      role="group"
      aria-label="Sign in or create an account"
      className="relative flex rounded-xl border border-white/10 bg-white/[0.05] p-1"
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 top-1 rounded-lg bg-white/[0.10] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition-[left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ width: "calc(50% - 4px)", left: value === "login" ? "4px" : "calc(50%)" }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          aria-pressed={value === tab.id}
          disabled={disabled}
          onClick={() => onChange(tab.id)}
          className={`relative z-10 flex-1 rounded-lg py-2 text-[13.5px] font-medium transition-colors duration-200 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/45 ${
            value === tab.id ? "text-white" : "text-white/55 hover:text-white/80"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ── Provider buttons ─────────────────────────────────────────────────────── */

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function ProviderButtons({ onGoogle, onGithub, busy = null, disabled = false }) {
  return (
    <div className="flex gap-2.5">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled || Boolean(busy)}
        className={providerButtonClass}
      >
        {busy === "oauth" ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
        ) : (
          <GoogleMark />
        )}
        <span>Google</span>
      </button>
      <button
        type="button"
        onClick={onGithub}
        disabled={disabled || Boolean(busy)}
        className={providerButtonClass}
      >
        {busy === "oauth" ? (
          <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
        ) : (
          <GitHubMark />
        )}
        <span>GitHub</span>
      </button>
    </div>
  );
}

/* ── Alert ────────────────────────────────────────────────────────────────── */

export function AuthAlert({ tone = "error", children }) {
  if (!children) return null;
  const isSuccess = tone === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className="flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[13px]"
      style={
        isSuccess
          ? { borderColor: "rgba(110,231,183,0.28)", background: "rgba(16,185,129,0.10)", color: AUTH.success }
          : { borderColor: "rgba(252,165,165,0.28)", background: "rgba(239,68,68,0.10)", color: AUTH.danger }
      }
    >
      <Icon className="mt-[1px] h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

/* ── Checkbox ─────────────────────────────────────────────────────────────── */

export function AuthCheckbox({ id, checked, onChange, children, error = "" }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-3">
        <span className="relative mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center">
          {/* A real checkbox, so the label toggles it, Space works and screen
              readers announce it without any custom role plumbing. */}
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            aria-invalid={error ? "true" : undefined}
            className="peer absolute inset-0 h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/20 bg-white/[0.05] transition-colors duration-200 hover:border-white/35 checked:border-[#3CC3F2] checked:bg-[#3CC3F2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/45"
            style={error ? { borderColor: "rgba(248,113,113,0.7)" } : undefined}
          />
          <Check
            aria-hidden="true"
            className="pointer-events-none h-3.5 w-3.5 text-[#06101F] opacity-0 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        <label htmlFor={id} className="cursor-pointer text-[13px] leading-relaxed" style={{ color: AUTH.body }}>
          {children}
        </label>
      </div>
      {error ? <p className="text-[12.5px]" style={{ color: AUTH.danger }}>{error}</p> : null}
    </div>
  );
}

/* ── Password strength ────────────────────────────────────────────────────── */

const STRENGTH_COLOR = { strong: "#34D399", medium: "#FBBF24", weak: "#F87171" };

export function StrengthMeter({ checks, label, tone }) {
  return (
    <div className="space-y-2" aria-live="polite">
      <div className="flex items-center justify-between">
        <span className="text-[12px]" style={{ color: AUTH.faint }}>
          Password strength
        </span>
        <span className="text-[12px] font-semibold" style={{ color: STRENGTH_COLOR[tone] }}>
          {label}
        </span>
      </div>
      <div className="flex gap-1">
        {checks.map((passed, index) => (
          <span
            key={index}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: passed ? STRENGTH_COLOR[tone] : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Legal footer ─────────────────────────────────────────────────────────── */

export function AuthLegal() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[12px]" style={{ color: AUTH.faint }}>
      <Link href="/info/terms" className={linkClass}>
        Terms
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/info/privacy" className={linkClass}>
        Privacy
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/info/help" className={linkClass}>
        Help
      </Link>
    </div>
  );
}
