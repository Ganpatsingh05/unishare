"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Siren } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { useAuth } from "@contexts/UniShareContext";
import { DETAILS_MAX, DETAILS_MIN, NEXT_STEPS, REPORT_TYPES, URGENCY } from "./reportContent";
import { submitReport } from "./report.service";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const hidden = { position: "absolute", opacity: 0, width: 1, height: 1, m: 0, pointerEvents: "none" };

/** Label, optional hint and error around one field. */
function Field({ id, label, optional, hint, error, children, t }) {
  const c = t.color;
  return (
    <Box>
      <Box component="label" htmlFor={id} sx={{ display: "block", fontSize: 15.5, fontWeight: 800, color: c.text }}>
        {label}
        {optional ? <Box component="span" sx={{ ml: 0.75, fontSize: 13.5, fontWeight: 600, color: c.textMuted }}>Optional</Box> : null}
      </Box>
      {hint ? <Box id={`${id}-hint`} sx={{ mt: 0.25, fontSize: 14, color: c.textSecondary }}>{hint}</Box> : null}
      <Box sx={{ mt: 1 }}>{children}</Box>
      {error ? <Box id={`${id}-error`} sx={{ mt: 0.75, fontSize: 14, fontWeight: 650, color: c.danger }}>{error}</Box> : null}
    </Box>
  );
}

function inputSx(t, invalid) {
  const c = t.color;
  return {
    width: "100%",
    boxSizing: "border-box",
    font: "inherit",
    fontSize: 16,
    lineHeight: 1.5,
    color: c.text,
    backgroundColor: c.surface,
    border: `1.5px solid ${invalid ? c.danger : c.border}`,
    borderRadius: `${t.radius.md}px`,
    px: 1.75,
    py: 1.25,
    outline: "none",
    transition: "border-color 150ms ease, box-shadow 150ms ease",
    "&::placeholder": { color: c.textMuted, opacity: 1 },
    "&:focus": { borderColor: invalid ? c.danger : c.action, boxShadow: `0 0 0 4px ${invalid ? c.dangerSoft : c.actionSoft}` },
  };
}

/** A radio styled as a selectable card. */
function ChoiceCard({ name, value, checked, onChange, label, hint, t, compact }) {
  const c = t.color;
  return (
    <Box
      component="label"
      sx={{
        position: "relative",
        display: "block",
        cursor: "pointer",
        borderRadius: `${t.radius.md}px`,
        border: `1.5px solid ${checked ? c.action : c.border}`,
        backgroundColor: checked ? c.actionSoft : c.surface,
        px: 1.75,
        py: compact ? 1.25 : 1.5,
        transition: "border-color 150ms ease, background-color 150ms ease",
        "&:hover": { borderColor: checked ? c.action : c.textMuted },
        "&:has(input:focus-visible)": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
      }}
    >
      <Box component="input" type="radio" name={name} value={value} checked={checked} onChange={onChange} sx={hidden} />
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.25 }}>
        <Box component="span" aria-hidden sx={{ mt: "3px", flexShrink: 0, width: 18, height: 18, borderRadius: "50%", border: `2px solid ${checked ? c.action : c.textMuted}`, display: "grid", placeItems: "center" }}>
          {checked ? <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: c.action }} /> : null}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ fontSize: 15.5, fontWeight: 750, color: c.text, lineHeight: 1.35 }}>{label}</Box>
          <Box sx={{ mt: 0.25, fontSize: 13.5, lineHeight: 1.45, color: c.textSecondary }}>{hint}</Box>
        </Box>
      </Box>
    </Box>
  );
}

/** Points people in danger to campus contacts before anything else. */
function EmergencyNote({ t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  return (
    <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", p: { xs: 2, sm: 2.25 }, borderRadius: `${t.radius.lg}px`, backgroundColor: c.dangerSoft, border: `1px solid ${dark ? "rgba(255,138,147,0.35)" : "rgba(198,47,59,0.28)"}` }}>
      <Box component="span" aria-hidden sx={{ display: "inline-flex", color: c.danger, mt: "2px", flexShrink: 0 }}>
        <Siren size={20} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 15.5, fontWeight: 800, color: c.text }}>In danger right now? Don&apos;t wait for a reply.</Box>
        <Box sx={{ mt: 0.25, fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary }}>
          Call campus security or the emergency services first, then tell us what happened.{" "}
          <Box component={Link} href="/contacts" sx={{ color: c.danger, fontWeight: 750, textUnderlineOffset: 3, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2, borderRadius: 4 } }}>
            Campus contacts
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function PrimaryButton({ children, t, ...rest }) {
  const c = t.color;
  return (
    <ButtonBase
      {...rest}
      sx={{ minHeight: 48, px: 3, borderRadius: 99, fontSize: 15.5, fontWeight: 800, fontFamily: "inherit", backgroundColor: c.action, color: c.onAction, gap: 1, "&:hover .go": { transform: "translateX(3px)" }, "&.Mui-disabled": { opacity: 0.6 }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
    >
      {children}
    </ButtonBase>
  );
}

function ReportContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const { user, isAuthenticated } = useAuth();
  const uid = useId();
  const ids = { type: `${uid}-type`, where: `${uid}-where`, details: `${uid}-details`, urgency: `${uid}-urgency`, email: `${uid}-email` };

  const [type, setType] = useState("");
  const [where, setWhere] = useState("");
  const [details, setDetails] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const doneRef = useRef(null);
  const formRef = useRef(null);

  const accountEmail = isAuthenticated ? user?.email : "";
  const replyTo = accountEmail || email.trim();

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const validate = () => {
    const next = {};
    if (!type) next.type = "Choose what the problem is about.";
    const len = details.trim().length;
    if (len < DETAILS_MIN) next.details = `Tell us a little more, at least ${DETAILS_MIN} characters.`;
    if (!accountEmail && email.trim() && !EMAIL_RE.test(email.trim())) next.email = "That email doesn't look right.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      const el = formRef.current?.querySelector(first === "type" ? `input[name="${ids.type}"]` : `#${CSS.escape(ids[first])}`);
      el?.focus();
      return;
    }
    setStatus("sending");
    const name = isAuthenticated ? user?.name || user?.displayName || user?.username || "" : "";
    const { success } = await submitReport({ name, email: replyTo, type, details: details.trim(), where: where.trim(), urgency });
    setStatus(success ? "sent" : "failed");
  };

  const reset = () => {
    setType("");
    setWhere("");
    setDetails("");
    setUrgency("medium");
    setErrors({});
    setStatus("idle");
  };

  const clearError = (k) => errors[k] && setErrors((x) => ({ ...x, [k]: undefined }));
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const container = { width: "100%", maxWidth: 1040, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } };
  const legendSx = { p: 0, fontSize: 15.5, fontWeight: 800, color: c.text };
  const fade = { initial: reduce ? false : { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: reduce ? { opacity: 0 } : { opacity: 0, y: -8 }, transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] } };
  const typeLabel = REPORT_TYPES.find((x) => x.id === type)?.label;

  return (
    <Box sx={container}>
      <Box sx={{ fontSize: 13.5, fontWeight: 800, color: c.accentText }}>Report a problem</Box>
      <Box component="h1" sx={{ m: 0, mt: 0.5, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
        <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>Tell us what&apos;s</Box> <Box component="span" sx={accentSx}>wrong.</Box>
      </Box>
      <Box component="p" sx={{ m: 0, mt: 1.25, maxWidth: 580, fontSize: 17, lineHeight: 1.55, color: c.textSecondary }}>
        A person, a post or a page that isn&apos;t working. Reports go straight to the UniShare team.
      </Box>

      <Box sx={{ mt: { xs: 3, md: 4 }, display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 300px" }, alignItems: "start" }}>
        <Box sx={{ display: "grid", gap: 2.5, minWidth: 0 }}>
          <EmergencyNote t={t} />

          <AnimatePresence mode="wait" initial={false}>
            {status === "sent" ? (
              <m.div key="sent" {...fade}>
                <Panel radius="xl" sx={{ p: { xs: 3, sm: 4 } }}>
                  <Box aria-hidden sx={{ width: 48, height: 48, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: c.successSoft, color: c.success }}>
                    <Check size={24} strokeWidth={2.5} />
                  </Box>
                  <Box component="h2" ref={doneRef} tabIndex={-1} sx={{ m: 0, mt: 2, fontSize: 26, fontWeight: 850, color: c.text, outline: "none" }}>Report sent</Box>
                  <Box component="p" sx={{ m: 0, mt: 1, fontSize: 16, lineHeight: 1.6, color: c.textSecondary, maxWidth: 520 }}>
                    Thanks for telling us{typeLabel ? <> about <Box component="strong" sx={{ color: c.text }}>{typeLabel.toLowerCase()}</Box></> : null}. The UniShare team will look into it.{" "}
                    {replyTo ? <>If we need more detail, we&apos;ll write to <Box component="strong" sx={{ color: c.text, wordBreak: "break-all" }}>{replyTo}</Box>.</> : "You didn't leave an email, so we won't be able to reply."}
                  </Box>
                  <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
                    <PrimaryButton t={t} onClick={reset}>Report something else</PrimaryButton>
                    <Box component={Link} href="/" sx={{ minHeight: 48, display: "inline-flex", alignItems: "center", px: 2, borderRadius: 99, fontSize: 15.5, fontWeight: 750, color: c.text, textDecoration: "none", border: `1.5px solid ${c.border}`, "&:hover": { backgroundColor: c.surfaceInteractive }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
                      Back to home
                    </Box>
                  </Box>
                </Panel>
              </m.div>
            ) : (
              <m.div key="form" {...fade}>
                <Panel radius="xl" component="form" ref={formRef} noValidate onSubmit={onSubmit} sx={{ p: { xs: 2.25, sm: 3.5 }, display: "grid", gap: 3.5 }}>
                  <Box component="fieldset" aria-describedby={errors.type ? `${ids.type}-error` : undefined} sx={{ m: 0, p: 0, border: 0, minWidth: 0 }}>
                    <Box component="legend" sx={legendSx}>What&apos;s it about?</Box>
                    <Box sx={{ mt: 1.25, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                      {REPORT_TYPES.map((r) => (
                        <ChoiceCard key={r.id} name={ids.type} value={r.id} checked={type === r.id} onChange={() => (setType(r.id), clearError("type"))} label={r.label} hint={r.hint} t={t} />
                      ))}
                    </Box>
                    {errors.type ? <Box id={`${ids.type}-error`} sx={{ mt: 0.75, fontSize: 14, fontWeight: 650, color: c.danger }}>{errors.type}</Box> : null}
                  </Box>

                  <Field id={ids.where} label="Where did it happen?" optional hint="A link to the post, or the person's username." t={t}>
                    <Box component="input" id={ids.where} type="text" value={where} maxLength={300} onChange={(e) => setWhere(e.target.value)} aria-describedby={`${ids.where}-hint`} placeholder="Paste a link, or @username" sx={inputSx(t, false)} />
                  </Field>

                  <Field id={ids.details} label="What happened?" hint="When it happened, what was said or done, and anything you've already tried." error={errors.details} t={t}>
                    <Box
                      component="textarea"
                      id={ids.details}
                      rows={6}
                      value={details}
                      maxLength={DETAILS_MAX}
                      onChange={(e) => (setDetails(e.target.value), clearError("details"))}
                      aria-invalid={Boolean(errors.details)}
                      aria-describedby={`${ids.details}-hint${errors.details ? ` ${ids.details}-error` : ""} ${ids.details}-count`}
                      sx={{ ...inputSx(t, Boolean(errors.details)), resize: "vertical", minHeight: 140, display: "block" }}
                    />
                    <Box id={`${ids.details}-count`} sx={{ mt: 0.5, fontSize: 13, color: c.textMuted, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      {details.length} / {DETAILS_MAX}
                    </Box>
                  </Field>

                  <Box component="fieldset" sx={{ m: 0, p: 0, border: 0, minWidth: 0 }}>
                    <Box component="legend" sx={legendSx}>How urgent is it?</Box>
                    <Box sx={{ mt: 1.25, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
                      {URGENCY.map((u) => (
                        <ChoiceCard key={u.id} compact name={ids.urgency} value={u.id} checked={urgency === u.id} onChange={() => setUrgency(u.id)} label={u.label} hint={u.hint} t={t} />
                      ))}
                    </Box>
                  </Box>

                  {accountEmail ? (
                    <Box sx={{ fontSize: 14.5, color: c.textSecondary }}>
                      We&apos;ll reply to <Box component="strong" sx={{ color: c.text, wordBreak: "break-all" }}>{accountEmail}</Box> if we need more detail.
                    </Box>
                  ) : (
                    <Field id={ids.email} label="Your email" optional hint="Only if you'd like us to reply. You're not signed in." error={errors.email} t={t}>
                      <Box
                        component="input"
                        id={ids.email}
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => (setEmail(e.target.value), clearError("email"))}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={`${ids.email}-hint${errors.email ? ` ${ids.email}-error` : ""}`}
                        sx={{ ...inputSx(t, Boolean(errors.email)), maxWidth: 420 }}
                      />
                    </Field>
                  )}

                  {status === "failed" ? (
                    <Box role="alert" sx={{ p: 1.75, borderRadius: `${t.radius.md}px`, backgroundColor: c.dangerSoft, color: c.text, fontSize: 14.5, lineHeight: 1.5 }}>
                      <Box component="strong" sx={{ color: c.danger }}>Your report didn&apos;t send.</Box> Check your connection and try again. Nothing you wrote has been lost.
                    </Box>
                  ) : null}

                  <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
                    <PrimaryButton t={t} type="submit" disabled={status === "sending"}>
                      {status === "sending" ? "Sending…" : status === "failed" ? "Try again" : "Send report"}
                      {status === "sending" ? null : (
                        <Box component="span" className="go" sx={{ display: "inline-flex", transition: "transform 150ms ease" }}>
                          <ArrowRight size={17} aria-hidden />
                        </Box>
                      )}
                    </PrimaryButton>
                    <Box sx={{ fontSize: 13.5, color: c.textMuted }}>The person you report won&apos;t see who sent it.</Box>
                  </Box>
                </Panel>
              </m.div>
            )}
          </AnimatePresence>
        </Box>

        {/* What happens next, and where else to look. */}
        <Box component="aside" sx={{ display: "grid", gap: 2, position: { md: "sticky" }, top: { md: t.layout.stickyTop + 16 } }}>
          <Panel variant="flat" radius="xl" sx={{ p: 2.5 }}>
            <Box component="h2" sx={{ m: 0, fontSize: 16.5, fontWeight: 850, color: c.text }}>What happens next</Box>
            <Box component="ol" sx={{ m: 0, mt: 1.5, p: 0, listStyle: "none", display: "grid", gap: 1.5, counterReset: "step" }}>
              {NEXT_STEPS.map((s) => (
                <Box component="li" key={s} sx={{ display: "flex", gap: 1.25, alignItems: "baseline", fontSize: 14.5, lineHeight: 1.5, color: c.textSecondary, counterIncrement: "step", "&::before": { content: "counter(step)", flexShrink: 0, display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%", fontSize: 12, fontWeight: 800, backgroundColor: c.actionSoft, color: c.accentText, transform: "translateY(-1px)" } }}>
                  {s}
                </Box>
              ))}
            </Box>
          </Panel>
          <Panel variant="flat" radius="xl" sx={{ p: 2.5 }}>
            <Box component="h2" sx={{ m: 0, fontSize: 16.5, fontWeight: 850, color: c.text }}>Not sure it&apos;s a problem?</Box>
            <Box component="ul" sx={{ m: 0, mt: 1, p: 0, listStyle: "none" }}>
              {[
                { label: "Community guidelines", href: "/info/guidelines" },
                { label: "Safety guidelines", href: "/info/support-guidelines" },
                { label: "Help centre", href: "/info/help" },
              ].map((l) => (
                <Box component="li" key={l.href} sx={{ borderTop: `1px solid ${c.border}`, "&:first-of-type": { borderTop: 0 } }}>
                  <Box component={Link} href={l.href} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 44, fontSize: 15, fontWeight: 700, color: c.text, textDecoration: "none", "&:hover": { color: c.accentText }, "&:hover .go": { transform: "translateX(3px)" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2, borderRadius: 6 } }}>
                    {l.label}
                    <Box component="span" className="go" aria-hidden sx={{ display: "inline-flex", color: c.textMuted, transition: "transform 150ms ease" }}>
                      <ArrowRight size={16} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Panel>
        </Box>
      </Box>
    </Box>
  );
}

export default function ReportPage() {
  return (
    <RideThemeBridge>
      <ReportContent />
    </RideThemeBridge>
  );
}
