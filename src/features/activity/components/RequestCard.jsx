"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { featureByKey } from "@components/layout/header/navConfig";
import { ACTIVITY_STRINGS } from "../constants/activityStrings";

const s = ACTIVITY_STRINGS.card;

function ago(iso) {
  if (!iso) return "";
  const sec = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 7 * 86400) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
const rupees = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

function StatusPill({ status, t }) {
  const c = t.color;
  const tone = {
    pending: { bg: `${t.brand.yellow}38`, fg: t.mode === "dark" ? t.brand.yellow : "#7A5200", label: s.status.pending },
    accepted: { bg: c.successSoft, fg: t.mode === "dark" ? c.success : "#14532D", label: s.status.accepted },
    declined: { bg: c.dangerSoft, fg: t.mode === "dark" ? c.danger : "#7F1D1D", label: s.status.declined },
    cancelled: { bg: c.surfaceInteractive, fg: c.textMuted, label: s.status.cancelled },
  }[status];
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, height: 26, px: 1.25, borderRadius: 99, fontSize: 12.5, fontWeight: 750, backgroundColor: tone.bg, color: tone.fg, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "currentColor" }} />
      {tone.label}
    </Box>
  );
}

function Avatar({ person, t }) {
  const name = person?.name || person?.email || "?";
  const initials = name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return person?.picture ? (
    <Box component="img" src={person.picture} alt="" referrerPolicy="no-referrer" sx={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  ) : (
    <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "grid", placeItems: "center", fontSize: 14, fontWeight: 800, color: "#fff", background: `linear-gradient(135deg, ${t.brand.actionBlue}, ${t.brand.inkNavy})` }}>
      {initials}
    </Box>
  );
}

/**
 * One request. Received and still waiting: Accept or Decline, with an
 * optional note back. Sent and still waiting: Cancel, after a confirm.
 */
export default function RequestCard({ req, onRespond, onCancel, index = 0 }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const f = featureByKey[req.module];
  const ink = f.ink[dark ? 1 : 0];
  const Icon = f.icon;
  const [busy, setBusy] = useState(null);
  const [replying, setReplying] = useState(false);
  const [note, setNote] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);
  const waiting = req.status === "pending";
  const received = req.direction === "received";

  const run = async (kind, fn) => {
    setBusy(kind);
    try {
      await fn();
    } finally {
      setBusy(null);
    }
  };

  const offerDiff = req.offer != null && req.price != null ? req.offer - req.price : null;

  return (
    <Box
      component={m.article}
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: reduce ? 0 : Math.min(index, 8) * 0.04 }}
      aria-label={`${received ? s.from : s.to} ${req.other?.name || s.someone}: ${req.title}`}
      sx={{ position: "relative", borderRadius: "20px", border: `1px solid ${waiting && received ? `${t.brand.yellow}` : c.border}`, backgroundColor: c.surface, overflow: "hidden", boxShadow: waiting && received ? `0 0 0 3px ${t.brand.yellow}33` : "none" }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        {/* Feature, status and when. */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, height: 26, pl: 0.5, pr: 1.25, borderRadius: 99, fontSize: 12.5, fontWeight: 750, color: dark ? ink : `color-mix(in srgb, ${ink} 72%, #000)`, backgroundColor: `${ink}${dark ? "26" : "18"}` }}>
            <Box component="span" sx={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", backgroundColor: `${ink}${dark ? "33" : "22"}` }}>
              <Icon size={12} aria-hidden />
            </Box>
            {f.label}
            {req.kind ? ` · ${req.kind}` : ""}
          </Box>
          <StatusPill status={req.status} t={t} />
          <Box component="span" sx={{ ml: "auto", fontSize: 13, color: c.textMuted }}>{ago(req.createdAt)}</Box>
        </Box>

        {/* What it's about. */}
        <Box component="h3" sx={{ m: 0, mt: 1.5, fontSize: { xs: 17, sm: 18.5 }, fontWeight: 800, letterSpacing: "-0.01em", lineHeight: 1.25, color: c.text }}>{req.title}</Box>
        <Box sx={{ mt: 0.5, display: "flex", flexWrap: "wrap", columnGap: 1.5, rowGap: 0.25, fontSize: 14, color: c.textSecondary }}>
          {req.when ? <span>{new Date(req.when).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span> : null}
          {req.place ? <span>{req.place}</span> : null}
          {req.details.map((d) => <span key={d}>{d}</span>)}
        </Box>

        {/* Price and any offer. */}
        {req.price != null || req.offer != null ? (
          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 1.5 }}>
            {req.price != null ? (
              <Box sx={{ fontSize: 14, color: c.textSecondary }}>
                {s.listedAt} <Box component="span" sx={{ fontSize: 16, fontWeight: 800, color: c.text, fontVariantNumeric: "tabular-nums" }}>{rupees(req.price)}</Box>
                {req.priceUnit ? ` ${req.priceUnit}` : ""}
              </Box>
            ) : null}
            {req.offer != null && offerDiff !== 0 ? (
              <Box sx={{ display: "inline-flex", alignItems: "baseline", gap: 0.75, px: 1.25, py: 0.5, borderRadius: "10px", backgroundColor: c.actionSoft, fontSize: 14, color: c.accentText }}>
                {received ? s.theyOffer : s.youOffered} <Box component="span" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{rupees(req.offer)}</Box>
                {offerDiff != null ? <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700 }}>({offerDiff > 0 ? "+" : "−"}{rupees(Math.abs(offerDiff))})</Box> : null}
              </Box>
            ) : null}
          </Box>
        ) : null}

        {/* Who. */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.25 }}>
          <Avatar person={req.other} t={t} />
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ fontSize: 12.5, color: c.textMuted }}>{received ? s.from : s.to}</Box>
            <Box sx={{ fontSize: 15, fontWeight: 750, color: c.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.other?.name || req.other?.email || s.someone}</Box>
          </Box>
        </Box>

        {/* Their message, and the reply if there is one. */}
        {req.message ? (
          <Box component="blockquote" sx={{ m: 0, mt: 1.5, px: 1.75, py: 1.25, borderRadius: "14px", backgroundColor: c.surfaceInteractive, fontSize: 14.5, lineHeight: 1.55, color: c.text, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
            {req.message}
          </Box>
        ) : null}
        {req.reply ? (
          <Box sx={{ mt: 1, px: 1.75, py: 1, borderRadius: "14px", border: `1px dashed ${c.border}`, fontSize: 14, color: c.textSecondary }}>
            <Box component="span" sx={{ fontWeight: 750, color: c.text }}>{received ? s.yourReply : s.theirReply}</Box> {req.reply}
          </Box>
        ) : null}

        {/* How to reach them (received requests only). */}
        {req.contact ? (
          <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {req.contact.phone ? <ContactLink t={t} href={`tel:${req.contact.phone.replace(/[^\d+]/g, "")}`} label={s.call} value={req.contact.phone} /> : null}
            {req.contact.email ? <ContactLink t={t} href={`mailto:${req.contact.email}`} label={s.email} value={req.contact.email} /> : null}
            {req.contact.instagram ? <ContactLink t={t} href={`https://instagram.com/${encodeURIComponent(req.contact.instagram)}`} label="Instagram" value={`@${req.contact.instagram}`} external /> : null}
          </Box>
        ) : null}
      </Box>

      {/* Actions. */}
      {waiting ? (
        <Box sx={{ borderTop: `1px solid ${c.border}`, px: { xs: 2, sm: 2.5 }, py: 1.5, backgroundColor: c.surfaceAlt || c.surface }}>
          {received ? (
            req.rideInPast ? (
              <Box sx={{ fontSize: 14, color: c.textMuted }}>{s.ridePassed}</Box>
            ) : replying ? (
              <Box sx={{ display: "grid", gap: 1 }}>
                <InputBase
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={s.notePlaceholder}
                  inputProps={{ "aria-label": s.noteLabel, maxLength: 300 }}
                  multiline
                  minRows={2}
                  sx={{ px: 1.5, py: 1, borderRadius: "12px", border: `1px solid ${c.border}`, backgroundColor: c.surface, fontSize: 14.5 }}
                />
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button variant="contained" disabled={Boolean(busy)} onClick={() => run("accept", () => onRespond(req, "accept", note.trim()))} sx={{ minHeight: 40, borderRadius: 99, px: 2.5 }}>
                    {busy === "accept" ? s.working : s.acceptSend}
                  </Button>
                  <Button variant="outlined" color="error" disabled={Boolean(busy)} onClick={() => run("decline", () => onRespond(req, "decline", note.trim()))} sx={{ minHeight: 40, borderRadius: 99, px: 2.25 }}>
                    {busy === "decline" ? s.working : s.declineSend}
                  </Button>
                  <Button variant="text" onClick={() => (setReplying(false), setNote(""))} sx={{ minHeight: 40, borderRadius: 99 }}>
                    {s.back}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                <Button variant="contained" disabled={Boolean(busy)} onClick={() => run("accept", () => onRespond(req, "accept", ""))} sx={{ minHeight: 40, borderRadius: 99, px: 2.5 }}>
                  {busy === "accept" ? s.working : s.accept}
                </Button>
                <Button variant="outlined" color="error" disabled={Boolean(busy)} onClick={() => run("decline", () => onRespond(req, "decline", ""))} sx={{ minHeight: 40, borderRadius: 99, px: 2.25 }}>
                  {busy === "decline" ? s.working : s.decline}
                </Button>
                <Button variant="text" disabled={Boolean(busy)} onClick={() => setReplying(true)} sx={{ minHeight: 40, borderRadius: 99 }}>
                  {s.withNote}
                </Button>
              </Box>
            )
          ) : confirmCancel ? (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Box sx={{ fontSize: 14, fontWeight: 650, color: c.text, mr: 0.5 }}>{s.cancelAsk}</Box>
              <Button variant="contained" color="error" disabled={Boolean(busy)} onClick={() => run("cancel", () => onCancel(req))} sx={{ minHeight: 40, borderRadius: 99, px: 2.25 }}>
                {busy ? s.working : s.cancelYes}
              </Button>
              <Button variant="text" onClick={() => setConfirmCancel(false)} sx={{ minHeight: 40, borderRadius: 99 }}>
                {s.keep}
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ fontSize: 14, color: c.textSecondary, flex: 1, minWidth: 180 }}>{s.waitingOnThem}</Box>
              <Button variant="outlined" color="error" onClick={() => setConfirmCancel(true)} sx={{ minHeight: 40, borderRadius: 99, px: 2.25 }}>
                {s.cancel}
              </Button>
            </Box>
          )}
        </Box>
      ) : null}
    </Box>
  );
}

function ContactLink({ t, href, label, value, external }) {
  const c = t.color;
  return (
    <Box
      component="a"
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      sx={{ display: "inline-flex", alignItems: "baseline", gap: 0.75, minHeight: 36, px: 1.5, py: 0.75, borderRadius: "12px", border: `1px solid ${c.border}`, color: c.text, textDecoration: "none", fontSize: 14, "&:hover": { borderColor: c.action }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
    >
      <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted }}>{label}</Box>
      <Box component="span" sx={{ fontWeight: 650 }}>{value}</Box>
    </Box>
  );
}
