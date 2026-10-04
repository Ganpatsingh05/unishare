"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { m } from "framer-motion";
import { Sun as Sun } from "lucide-react";
import { Moon as Moon } from "lucide-react";
import { Monitor as Monitor } from "lucide-react";
import { LogOut as Logout } from "lucide-react";
import { History } from "lucide-react";
import { LockKeyhole as LockPassword } from "lucide-react";
import { TriangleAlert as DangerTriangle } from "lucide-react";
import { Trash2 as TrashBin } from "lucide-react";
import { CircleCheck as CheckCircle } from "lucide-react";
import { ChevronRight as AltArrowRight } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { useAuth, useUI } from "@contexts/UniShareContext";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { changePassword, deleteAccount, getAccount } from "../services/account.service";

const S = PROFILE_STRINGS;
const s = S.settings;
const MODE_KEY = "unishare_theme_mode"; // remembers "system" for this browser only
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** 0–4 strength from length and variety. */
function strength(pw) {
  if (pw.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[a-zA-Z]/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw) || pw.length >= 14) score += 1;
  return Math.min(score, 4);
}

function Row({ label, value }) {
  const t = useRideTokens();
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, py: 1, borderBottom: `1px solid ${t.color.border}`, fontSize: 14 }}>
      <Box sx={{ color: t.color.textMuted }}>{label}</Box>
      <Box sx={{ fontWeight: 700, textAlign: "right", overflowWrap: "anywhere" }}>{value}</Box>
    </Box>
  );
}

function PasswordDialog({ open, hasPassword, onClose, onDone }) {
  const t = useRideTokens();
  const c = t.color;
  const p = S.passwordDialog;
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setCurrent("");
      setNext("");
      setAgain("");
      setError("");
      setShow(false);
    }
  }, [open]);

  const level = strength(next);
  const rules = { length: next.length >= 8, mix: /\d/.test(next) && /[a-zA-Z]/.test(next), match: next.length > 0 && next === again };
  const ok = rules.length && rules.match && (!hasPassword || current.length > 0);
  const colors = [c.danger, c.danger, c.warning, c.success, c.success];
  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };

  const submit = async (e) => {
    e.preventDefault();
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await changePassword(hasPassword ? current : undefined, next);
      onDone(hasPassword ? p.changed : p.set);
    } catch (err) {
      setError(err?.message || p.failed);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} container={typeof document === "undefined" ? undefined : document.body} aria-labelledby="pw-title" fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: `${t.radius.xl}px`, backgroundImage: "none" } } }}>
      <Box component="form" noValidate onSubmit={submit} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box aria-hidden sx={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: "13px", backgroundColor: c.actionSoft, color: c.accentText }}><LockPassword size={24} /></Box>
          <Box component="h2" id="pw-title" sx={{ m: 0, fontSize: 20, fontWeight: 800 }}>{hasPassword ? p.titleChange : p.titleSet}</Box>
        </Box>
        {hasPassword ? <TextField type={show ? "text" : "password"} label={p.current} value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" fullWidth sx={field} /> : null}
        <TextField type={show ? "text" : "password"} label={p.next} value={next} onChange={(e) => setNext(e.target.value.slice(0, 128))} autoComplete="new-password" fullWidth sx={field} />
        {/* Strength meter. */}
        <Box aria-live="polite">
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0.5 }} aria-hidden>
            {[1, 2, 3, 4].map((i) => (
              <Box key={i} component={m.span} animate={{ backgroundColor: next && level >= i ? colors[level] : c.surfaceInteractive }} sx={{ height: 6, borderRadius: 3 }} />
            ))}
          </Box>
          {next ? <Box sx={{ mt: 0.5, fontSize: 12.5, fontWeight: 700, color: colors[level] }}>{p.strength[level]}</Box> : null}
        </Box>
        <TextField type={show ? "text" : "password"} label={p.confirm} value={again} onChange={(e) => setAgain(e.target.value.slice(0, 128))} autoComplete="new-password" fullWidth sx={field} />
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.5 }}>
          {Object.entries(p.rules).map(([k, text]) => (
            <Box component="li" key={k} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13, fontWeight: 650, color: rules[k] ? c.success : c.textMuted }}>
              <CheckCircle size={16} aria-hidden style={{ opacity: rules[k] ? 1 : 0.4 }} />
              {text}
            </Box>
          ))}
        </Box>
        <FormControlLabel control={<Checkbox checked={show} onChange={(e) => setShow(e.target.checked)} />} label={p.show} sx={{ "& .MuiFormControlLabel-label": { fontSize: 14 } }} />
        {error ? <Box role="alert" sx={{ fontSize: 13.5, fontWeight: 700, color: c.danger }}>{error}</Box> : null}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose} disabled={busy} sx={{ minHeight: 44 }}>{p.cancel}</Button>
          <Button type="submit" variant="contained" disabled={!ok || busy} sx={{ minHeight: 44, px: 3, borderRadius: `${t.radius.pill}px` }}>{busy ? p.saving : p.save}</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

function DeleteDialog({ open, hasPassword, onClose, onDeleted }) {
  const t = useRideTokens();
  const c = t.color;
  const d = S.deleteDialog;
  const [typed, setTyped] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (open) {
      setTyped("");
      setPassword("");
      setError("");
    }
  }, [open]);
  const ok = typed === d.word && (!hasPassword || password.length > 0);
  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };

  const submit = async (e) => {
    e.preventDefault();
    if (!ok) return;
    setBusy(true);
    setError("");
    try {
      await deleteAccount(hasPassword ? password : undefined);
      onDeleted();
    } catch (err) {
      setError(err?.message || d.failed);
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} container={typeof document === "undefined" ? undefined : document.body} aria-labelledby="del-title" fullWidth maxWidth="xs" slotProps={{ paper: { sx: { borderRadius: `${t.radius.xl}px`, backgroundImage: "none" } } }}>
      <Box component="form" noValidate onSubmit={submit} sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box aria-hidden sx={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: "13px", backgroundColor: c.dangerSoft, color: c.danger }}><DangerTriangle size={24} /></Box>
          <Box component="h2" id="del-title" sx={{ m: 0, fontSize: 20, fontWeight: 800 }}>{d.title}</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: 14.5, color: c.textSecondary }}>{d.lead}</Box>
          <Box component="ul" sx={{ m: 0, mt: 0.75, pl: 2.5, display: "grid", gap: 0.4, fontSize: 14, color: c.text }}>
            {d.items.map((item) => <li key={item}>{item}</li>)}
          </Box>
        </Box>
        <TextField label={d.typeLabel(d.word)} value={typed} onChange={(e) => setTyped(e.target.value.toUpperCase().slice(0, 10))} autoComplete="off" fullWidth sx={field} slotProps={{ htmlInput: { autoCapitalize: "characters", spellCheck: false } }} />
        {hasPassword ? <TextField type="password" label={d.password} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" fullWidth sx={field} /> : null}
        {error ? <Box role="alert" sx={{ fontSize: 13.5, fontWeight: 700, color: c.danger }}>{error}</Box> : null}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, flexWrap: "wrap" }}>
          <Button onClick={onClose} disabled={busy} variant="outlined" autoFocus sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{d.keep}</Button>
          <Button type="submit" variant="contained" color="error" disabled={!ok || busy} startIcon={<TrashBin size={18} aria-hidden />} sx={{ minHeight: 44, px: 2.5, borderRadius: `${t.radius.pill}px` }}>{busy ? d.deleting : d.confirm}</Button>
        </Box>
      </Box>
    </Dialog>
  );
}

/** Appearance, account and security, and the danger zone. */
export default function SettingsPanel() {
  const t = useRideTokens();
  const c = t.color;
  const router = useRouter();
  const { notify } = useRideFeedback();
  const { logout } = useAuth();
  const { darkMode, setDarkMode } = useUI();
  const [mode, setMode] = useState(darkMode ? "dark" : "light");
  const [account, setAccount] = useState(null);
  const [dialog, setDialog] = useState(null); // "password" | "delete"

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
    getAccount().then(setAccount).catch(() => setAccount(false));
  }, []);

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

  const method = account ? (account.has_google && account.has_password ? s.methods.both : account.has_google ? s.methods.google : s.methods.password) : "";
  const modes = [
    { key: "light", icon: Sun },
    { key: "dark", icon: Moon },
    { key: "system", icon: Monitor },
  ];
  const heading = { m: 0, fontSize: 15, fontWeight: 800 };

  return (
    <Panel radius="xl" component="section" aria-labelledby="pf-settings-title" sx={{ p: { xs: 2.25, sm: 2.75 }, display: "flex", flexDirection: "column", gap: 3 }}>
      <Box component="h2" id="pf-settings-title" sx={{ m: 0, fontSize: 20, fontWeight: 820 }}>{s.title}</Box>

      {/* Appearance. */}
      <Box>
        <Box component="h3" id="pf-appearance" sx={heading}>{s.appearance}</Box>
        <Box sx={{ fontSize: 13, color: c.textMuted, mb: 1.25 }}>{s.appearanceHint}</Box>
        <Box role="radiogroup" aria-labelledby="pf-appearance" sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0.5, p: 0.5, borderRadius: `${t.radius.lg}px`, backgroundColor: c.surfaceInteractive }}>
          {modes.map(({ key, icon: Icon }) => {
            const on = mode === key;
            return (
              <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => choose(key)} sx={{ position: "relative", flexDirection: "column", minHeight: 64, borderRadius: `${t.radius.md}px`, fontSize: 13, fontWeight: 720, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}>
                {on ? <Box component={m.span} layoutId="pf-mode" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
                <Box component="span" sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0.4 }}>
                  <Icon size={22} aria-hidden />
                  {s.modes[key]}
                </Box>
              </ButtonBase>
            );
          })}
        </Box>
      </Box>

      {/* Account and security. */}
      <Box>
        <Box component="h3" sx={heading}>{s.account}</Box>
        {account === null ? (
          <Box aria-busy="true" aria-label={s.loading} sx={{ mt: 1 }}>{[0, 1, 2].map((i) => <Skeleton key={i} height={36} />)}</Box>
        ) : account ? (
          <Box sx={{ mt: 0.5 }}>
            <Row label={s.email} value={account.email} />
            <Row label={s.signInWith} value={method} />
            {account.created_at ? <Row label={s.memberSince} value={dateFmt.format(new Date(account.created_at))} /> : null}
            {account.last_login ? <Row label={s.lastLogin} value={dateFmt.format(new Date(account.last_login))} /> : null}
          </Box>
        ) : null}
        <Box sx={{ mt: 1.25, display: "flex", flexDirection: "column" }}>
          {account ? (
            <Button onClick={() => setDialog("password")} startIcon={<LockPassword size={20} aria-hidden />} endIcon={<AltArrowRight size={18} aria-hidden />} sx={{ justifyContent: "flex-start", "& .MuiButton-endIcon": { ml: "auto" }, minHeight: 48, px: 1.5, color: c.text, fontWeight: 700 }}>
              {account.has_password ? s.changePassword : s.setPassword}
            </Button>
          ) : null}
          {account && !account.has_password ? <Box sx={{ px: 1.5, mt: -0.5, mb: 0.5, fontSize: 12.5, color: c.textMuted }}>{s.passwordSet}</Box> : null}
          <Button component={Link} href="/my-activity" startIcon={<History size={20} aria-hidden />} endIcon={<AltArrowRight size={18} aria-hidden />} sx={{ justifyContent: "flex-start", "& .MuiButton-endIcon": { ml: "auto" }, minHeight: 48, px: 1.5, color: c.text, fontWeight: 700 }}>{s.activity}</Button>
          <Button onClick={signOut} startIcon={<Logout size={20} aria-hidden />} sx={{ justifyContent: "flex-start", minHeight: 48, px: 1.5, color: c.text, fontWeight: 700 }}>{s.signOut}</Button>
        </Box>
      </Box>

      {/* Danger zone. */}
      {account ? (
        <Box sx={{ p: 2, borderRadius: `${t.radius.lg}px`, border: `1px solid ${c.danger}`, backgroundColor: c.dangerSoft }}>
          <Box component="h3" sx={{ ...heading, color: c.danger, display: "flex", alignItems: "center", gap: 0.75 }}>
            <DangerTriangle size={18} aria-hidden />
            {s.danger}
          </Box>
          <Box sx={{ mt: 0.75, fontSize: 13.5, lineHeight: 1.5, color: c.textSecondary }}>{s.deleteBody}</Box>
          <Button onClick={() => setDialog("delete")} variant="outlined" color="error" startIcon={<TrashBin size={18} aria-hidden />} sx={{ mt: 1.5, minHeight: 44, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surface }}>{s.delete}</Button>
        </Box>
      ) : null}

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
          notify({ message: S.deleteDialog.done, tone: "success" });
          await logout();
          router.push("/");
        }}
      />
    </Panel>
  );
}
