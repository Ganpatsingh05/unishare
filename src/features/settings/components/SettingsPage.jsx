"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import { m, useReducedMotion } from "framer-motion";
import { Check, LogOut, Trash2 } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { useAuth, useUI } from "@contexts/UniShareContext";
import { getAccount } from "@features/profile/services/account.service";
import { PROFILE_STRINGS } from "@features/profile/constants/profileStrings";
import useMyProfile from "@features/profile/hooks/useMyProfile";
import { initialsOf } from "@features/profile/utils/profileModel";
import { DeleteDialog, PasswordDialog } from "@features/profile/components/AccountDialogs";
import { CONTACT_EMAIL } from "@features/info/legal/legalShared";
import { SETTINGS_STRINGS as S } from "../settingsStrings";

const MODE_KEY = "unishare_theme_mode"; // remembers "system" for this browser only
// Data kept in this browser that isn't needed to stay signed in or keep the theme.
const DEVICE_KEYS = ["unishare:housing-shortlist:v1", "unishare:post-ride-draft:v1", "unishare_notices_cache", "unishare_announcement_dismiss"];
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });

/** A section card with its own heading; the anchor target for the side nav. */
function Section({ id, title, tone, children, t }) {
  const c = t.color;
  const danger = tone === "danger";
  return (
    <Panel
      component="section"
      id={id}
      aria-labelledby={`${id}-title`}
      radius="xl"
      variant={danger ? "flat" : "raised"}
      sx={{ p: { xs: 2.25, sm: 3 }, scrollMarginTop: `${t.layout.stickyTop + 16}px`, ...(danger ? { borderColor: c.danger, backgroundColor: c.dangerSoft } : null) }}
    >
      <Box component="h2" id={`${id}-title`} sx={{ m: 0, mb: 1.5, fontSize: 19, fontWeight: 850, color: danger ? c.danger : c.text }}>{title}</Box>
      {children}
    </Panel>
  );
}

/** One setting: label and hint on the left, its control on the right (stacked on phones). */
function SettingRow({ label, hint, children, t, first }) {
  const c = t.color;
  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: { xs: 1.25, sm: 3 }, py: 2, borderTop: first ? 0 : `1px solid ${c.border}`, pt: first ? 0.5 : 2 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ fontSize: 15.5, fontWeight: 750, color: c.text }}>{label}</Box>
        {hint ? <Box sx={{ mt: 0.25, fontSize: 14, lineHeight: 1.5, color: c.textSecondary }}>{hint}</Box> : null}
      </Box>
      {children ? <Box sx={{ flexShrink: 0, display: "flex", gap: 1, flexWrap: "wrap" }}>{children}</Box> : null}
    </Box>
  );
}

const pill = (t) => ({ minHeight: 42, px: 2.25, borderRadius: `${t.radius.pill}px`, fontWeight: 750, textTransform: "none", fontSize: 14.5 });

/** Light / dark / system, each with a tiny preview of the page. */
function ThemePicker({ mode, onChoose, t }) {
  const c = t.color;
  const reduce = useReducedMotion();
  const looks = {
    light: { bg: "#F3F7FC", card: "#FFFFFF", line: "#D8E2EE", ink: "#1565D8" },
    dark: { bg: "#11161D", card: "#1E293B", line: "#334155", ink: "#3CC3F2" },
  };
  const Preview = ({ look }) => (
    <Box aria-hidden sx={{ height: 64, borderRadius: "10px", p: 1, backgroundColor: look.bg, border: `1px solid ${look.line}`, display: "grid", gap: 0.6, alignContent: "start" }}>
      <Box sx={{ height: 8, width: "55%", borderRadius: 4, backgroundColor: look.ink }} />
      <Box sx={{ height: 22, borderRadius: "6px", backgroundColor: look.card, border: `1px solid ${look.line}` }} />
      <Box sx={{ height: 6, width: "70%", borderRadius: 3, backgroundColor: look.line }} />
    </Box>
  );
  const options = ["light", "dark", "system"];
  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = options[(i + step + options.length) % options.length];
    onChoose(next);
    e.currentTarget.parentElement?.children[(i + step + options.length) % options.length]?.focus();
  };
  return (
    <Box role="radiogroup" aria-label={S.appearance.title} sx={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1.25 }}>
      {options.map((key, i) => {
        const on = mode === key;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChoose(key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            sx={{ position: "relative", flexDirection: "column", alignItems: "stretch", gap: 1, p: 1, borderRadius: `${t.radius.md}px`, border: `2px solid ${on ? c.action : c.border}`, backgroundColor: c.surface, textAlign: "left", fontFamily: "inherit", transition: "border-color 150ms ease", "&:hover": { borderColor: on ? c.action : c.textMuted }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
          >
            {key === "system" ? (
              <Box sx={{ position: "relative", height: 64, borderRadius: "10px", overflow: "hidden" }}>
                <Box sx={{ position: "absolute", inset: 0 }}><Preview look={looks.light} /></Box>
                <Box sx={{ position: "absolute", inset: 0, clipPath: "polygon(55% 0, 100% 0, 100% 100%, 45% 100%)" }}><Preview look={looks.dark} /></Box>
              </Box>
            ) : (
              <Preview look={looks[key]} />
            )}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.25, fontSize: 14, fontWeight: 750, color: c.text }}>
              {S.appearance.modes[key]}
              {on ? (
                <Box component={m.span} initial={reduce ? false : { scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} aria-hidden sx={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", backgroundColor: c.action, color: c.onAction }}>
                  <Check size={13} strokeWidth={3} />
                </Box>
              ) : null}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function SettingsContent() {
  const t = useRideTokens();
  const c = t.color;
  const router = useRouter();
  const { notify } = useRideFeedback();
  const { isAuthenticated, authLoading, logout } = useAuth();
  const { darkMode, setDarkMode } = useUI();
  const me = useMyProfile();
  const [mode, setMode] = useState(darkMode ? "dark" : "light");
  const [account, setAccount] = useState(null); // null loading, false failed
  const [nonce, setNonce] = useState(0);
  const [dialog, setDialog] = useState(null); // "password" | "delete"
  const [active, setActive] = useState("account");

  const signedIn = !authLoading && isAuthenticated;
  const signedOut = !authLoading && !isAuthenticated;

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem(MODE_KEY);
    } catch {
      saved = null;
    }
    setMode(saved === "system" ? "system" : darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    if (!signedIn) return undefined;
    let alive = true;
    setAccount(null);
    getAccount()
      .then((a) => alive && setAccount(a || false))
      .catch(() => alive && setAccount(false));
    return () => {
      alive = false;
    };
  }, [signedIn, nonce]);

  const sections = signedIn ? ["account", "signin", "appearance", "privacy", "danger"] : ["appearance"];

  // Highlight the section being read in the side nav.
  useEffect(() => {
    const els = sections.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActive(seen.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  const choose = (next) => {
    try {
      if (next === "system") localStorage.setItem(MODE_KEY, "system");
      else localStorage.removeItem(MODE_KEY);
    } catch {
      // Private mode: the choice still applies, it just isn't remembered.
    }
    setMode(next);
    setDarkMode(next === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches : next === "dark");
  };

  const signOut = async () => {
    await logout();
    router.push("/");
  };

  const clearDevice = () => {
    let removed = 0;
    try {
      DEVICE_KEYS.forEach((k) => {
        if (localStorage.getItem(k) !== null) {
          localStorage.removeItem(k);
          removed += 1;
        }
      });
    } catch {
      removed = 0;
    }
    notify({ message: removed ? S.privacy.cleared : S.privacy.nothing, tone: removed ? "success" : "info" });
  };

  const p = me.profile;
  const loadingProfile = me.status === "loading";
  const outlined = { ...pill(t), color: c.text, borderColor: c.border, "&:hover": { borderColor: c.textMuted, backgroundColor: c.surfaceInteractive } };

  return (
    <Box sx={{ width: "100%", maxWidth: 1040, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } }}>
      <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 34, sm: 42 }, lineHeight: 1.1, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }}>{S.title}</Box>
      <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 16.5, color: c.textSecondary }}>{S.lead}</Box>

      <Box sx={{ mt: { xs: 3, md: 4 }, display: "grid", gap: { xs: 2, md: 4 }, gridTemplateColumns: { xs: "1fr", md: "200px minmax(0, 1fr)" }, alignItems: "start" }}>
        {/* Section nav, desktop only. */}
        <Box component="nav" aria-label="Settings sections" sx={{ display: { xs: "none", md: "grid" }, gap: 0.5, position: "sticky", top: t.layout.stickyTop + 16 }}>
          {sections.map((id) => {
            const on = id === active;
            return (
              <Box
                key={id}
                component="a"
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                sx={{ display: "flex", alignItems: "center", minHeight: 40, px: 1.5, borderRadius: `${t.radius.sm}px`, fontSize: 14.5, fontWeight: on ? 800 : 650, textDecoration: "none", color: id === "danger" ? c.danger : on ? c.accentText : c.textSecondary, backgroundColor: on ? (id === "danger" ? c.dangerSoft : c.actionSoft) : "transparent", "&:hover": { color: id === "danger" ? c.danger : c.text }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
              >
                {S.nav[id]}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: "grid", gap: 2, minWidth: 0 }}>
          {signedOut ? (
            <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3 }, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Box component="h2" sx={{ m: 0, fontSize: 19, fontWeight: 850, color: c.text }}>{S.signedOut.title}</Box>
                <Box sx={{ mt: 0.25, fontSize: 14.5, color: c.textSecondary }}>{S.signedOut.body}</Box>
              </Box>
              <Button component={Link} href={`/login?redirect=${encodeURIComponent("/settings")}`} variant="contained" sx={pill(t)}>{S.signedOut.cta}</Button>
            </Panel>
          ) : null}

          {authLoading ? <Panel radius="xl" sx={{ p: 3 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={40} />)}</Panel> : null}

          {signedIn ? (
            <Section id="account" title={S.account.title} t={t}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                <Box sx={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", flexShrink: 0, display: "grid", placeItems: "center", backgroundColor: c.actionSoft, color: c.accentText, fontSize: 22, fontWeight: 850 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {loadingProfile ? <Skeleton variant="circular" width={64} height={64} /> : p.photo ? <img src={p.photo} alt="" width={64} height={64} style={{ width: "100%", height: "100%", objectFit: "cover" }} referrerPolicy="no-referrer" /> : initialsOf(p.name)}
                </Box>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Box sx={{ fontSize: 18, fontWeight: 850, color: c.text, overflowWrap: "anywhere" }}>{loadingProfile ? <Skeleton width={160} /> : p.name || S.account.noName}</Box>
                  <Box sx={{ fontSize: 14.5, color: c.textSecondary }}>{loadingProfile ? <Skeleton width={110} /> : p.handle ? `@${p.handle}` : S.account.noHandle}</Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button component={Link} href="/profile" variant="contained" sx={pill(t)}>{S.account.edit}</Button>
                  {p.handle ? (
                    <Button component={Link} href={`/u/${encodeURIComponent(p.handle)}`} variant="outlined" sx={outlined}>{S.account.pass}</Button>
                  ) : !loadingProfile ? (
                    <Button component={Link} href="/profile" variant="outlined" sx={outlined}>{S.account.pickHandle}</Button>
                  ) : null}
                </Box>
              </Box>

              <Box component="dl" sx={{ m: 0, mt: 2.5, display: "grid", gap: 0 }}>
                {account === null ? (
                  [0, 1, 2].map((i) => <Skeleton key={i} height={40} />)
                ) : account === false ? (
                  <Box role="alert" sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", fontSize: 14.5, color: c.textSecondary }}>
                    {S.account.loadFailed}
                    <Button onClick={() => setNonce((n) => n + 1)} size="small" sx={{ fontWeight: 750, textTransform: "none" }}>{S.account.retry}</Button>
                  </Box>
                ) : (
                  [
                    [S.account.email, account.email],
                    account.created_at ? [S.account.memberSince, dateFmt.format(new Date(account.created_at))] : null,
                    account.last_login ? [S.account.lastLogin, dateFmt.format(new Date(account.last_login))] : null,
                  ]
                    .filter(Boolean)
                    .map(([k, v]) => (
                      <Box key={k} sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1.25, borderTop: `1px solid ${c.border}`, fontSize: 14.5 }}>
                        <Box component="dt" sx={{ color: c.textSecondary }}>{k}</Box>
                        <Box component="dd" sx={{ m: 0, fontWeight: 700, color: c.text, textAlign: "right", overflowWrap: "anywhere" }}>{v}</Box>
                      </Box>
                    ))
                )}
              </Box>
            </Section>
          ) : null}

          {signedIn ? (
            <Section id="signin" title={S.signin.title} t={t}>
              <SettingRow first label={S.signin.methods} hint={S.signin.methodsHint} t={t}>
                {account
                  ? [
                      [S.signin.google, account.has_google],
                      [S.signin.password, account.has_password],
                    ].map(([label, on]) => (
                      <Box key={label} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 32, px: 1.25, borderRadius: 99, fontSize: 13.5, fontWeight: 750, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? c.successSoft : "transparent", color: on ? c.success : c.textSecondary }}>
                        {on ? <Check size={14} strokeWidth={3} aria-hidden /> : null}
                        {label}
                        <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>: {on ? S.signin.on : S.signin.off}</Box>
                      </Box>
                    ))
                  : <Skeleton width={180} height={32} />}
              </SettingRow>
              <SettingRow label={S.signin.passwordRow} hint={account?.has_password ? S.signin.passwordHint.has : S.signin.passwordHint.none} t={t}>
                <Button variant="outlined" onClick={() => setDialog("password")} disabled={!account} sx={outlined}>{account?.has_password ? S.signin.change : S.signin.set}</Button>
              </SettingRow>
              <SettingRow label={S.signin.device} hint={S.signin.deviceHint} t={t}>
                <Button variant="outlined" onClick={signOut} startIcon={<LogOut size={17} aria-hidden />} sx={outlined}>{S.signin.signOut}</Button>
              </SettingRow>
            </Section>
          ) : null}

          {!authLoading ? (
            <Section id="appearance" title={S.appearance.title} t={t}>
              <Box sx={{ mt: -0.75, mb: 1.75, fontSize: 14.5, color: c.textSecondary }}>{S.appearance.hint}</Box>
              <ThemePicker mode={mode} onChoose={choose} t={t} />
            </Section>
          ) : null}

          {signedIn ? (
            <Section id="privacy" title={S.privacy.title} t={t}>
              <SettingRow first label={S.privacy.visible} hint={S.privacy.visibleHint} t={t}>
                <Button component={Link} href="/info/privacy#public" variant="outlined" sx={outlined}>{S.privacy.visibleCta}</Button>
              </SettingRow>
              <SettingRow label={S.privacy.copy} hint={S.privacy.copyHint} t={t}>
                <Button component="a" href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Copy of my UniShare data")}`} variant="outlined" sx={outlined}>{S.privacy.copyCta}</Button>
              </SettingRow>
              <SettingRow label={S.privacy.device} hint={S.privacy.deviceHint} t={t}>
                <Button variant="outlined" onClick={clearDevice} sx={outlined}>{S.privacy.deviceCta}</Button>
              </SettingRow>
            </Section>
          ) : null}

          {signedIn && account ? (
            <Section id="danger" title={S.danger.title} tone="danger" t={t}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "stretch", sm: "center" }, gap: 2 }}>
                <Box sx={{ flex: 1, fontSize: 14.5, lineHeight: 1.55, color: c.text }}>{S.danger.body}</Box>
                <Button onClick={() => setDialog("delete")} variant="contained" color="error" startIcon={<Trash2 size={17} aria-hidden />} sx={{ ...pill(t), flexShrink: 0 }}>{S.danger.cta}</Button>
              </Box>
            </Section>
          ) : null}
        </Box>
      </Box>

      <PasswordDialog
        open={dialog === "password"}
        hasPassword={Boolean(account?.has_password)}
        onClose={() => setDialog(null)}
        onDone={(message) => {
          setDialog(null);
          setAccount((a) => (a ? { ...a, has_password: true } : a));
          notify({ message, tone: "success" });
        }}
      />
      <DeleteDialog
        open={dialog === "delete"}
        hasPassword={Boolean(account?.has_password)}
        onClose={() => setDialog(null)}
        onDeleted={async () => {
          setDialog(null);
          notify({ message: PROFILE_STRINGS.deleteDialog.done, tone: "success" });
          await logout();
          router.push("/");
        }}
      />
    </Box>
  );
}

export default function SettingsPage() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <SettingsContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
