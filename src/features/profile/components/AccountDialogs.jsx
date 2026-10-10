"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { m } from "framer-motion";
import { LockKeyhole as LockPassword } from "lucide-react";
import { TriangleAlert as DangerTriangle } from "lucide-react";
import { Trash2 as TrashBin } from "lucide-react";
import { CircleCheck as CheckCircle } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { changePassword, deleteAccount } from "../services/account.service";

// Password and delete-account dialogs, used by the settings page.

const S = PROFILE_STRINGS;

/** 0–4 strength from length and variety. */
function strength(pw) {
  if (pw.length < 8) return 0;
  let score = 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[a-zA-Z]/.test(pw)) score += 1;
  if (/[^a-zA-Z0-9]/.test(pw) || pw.length >= 14) score += 1;
  return Math.min(score, 4);
}

export function PasswordDialog({ open, hasPassword, onClose, onDone }) {
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

export function DeleteDialog({ open, hasPassword, onClose, onDeleted }) {
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
          <Box sx={{ mt: 1, fontSize: 13, lineHeight: 1.5, color: c.textSecondary }}>
            {d.leftover}{" "}
            <Box component={Link} href="/info/data-protection#delete" sx={{ color: c.accentText, fontWeight: 700 }}>{d.leftoverLink}</Box>
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
