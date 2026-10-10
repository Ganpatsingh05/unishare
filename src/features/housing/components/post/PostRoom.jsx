"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Bed,
  CalendarBlank,
  ChatCircleText,
  Check,
  CurrencyInr,
  EnvelopeSimple,
  ImagesSquare,
  InstagramLogo,
  MapPin,
  Minus,
  PaperPlaneTilt,
  Phone,
  Plus,
  SignIn,
  TextT,
} from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { useAuth } from "@contexts/UniShareContext";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import { createRoom } from "../../services/housing.service";
import { DESCRIPTION_MAX, INITIAL_ROOM, cleanRent, dayKey, firstOfNextMonth, readiness, toFormData, validateRoom } from "../../utils/postRoom";
import RoomTagCard from "../search/RoomTagCard";
import HousingTopBar from "../manage/HousingTopBar";
import PhotoDrop from "./PhotoDrop";

const s = HOUSING_STRINGS.post;
const f = s.fields;
const CHECKS = ["photos", "basics", "price", "date", "contact"];
const FIELD_ORDER = ["title", "location", "rent", "beds", "moveIn", "mobile", "email", "contact"];
const FIELD_ID = { title: "hp-title", location: "hp-location", rent: "hp-rent", beds: "hp-beds", moveIn: "hp-movein", mobile: "hp-mobile", email: "hp-email", contact: "hp-mobile" };

function fieldSx(t) {
  return { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surface }, "& .MuiFormHelperText-root": { mx: 0.25, fontSize: 13 } };
}
const adorn = (Icon) => ({ startAdornment: <InputAdornment position="start"><Icon size={19} weight="duotone" aria-hidden /></InputAdornment> });

function Section({ icon: Icon, title, index, children }) {
  const t = useRideTokens();
  return (
    <Panel component="section" aria-labelledby={`hp-sec-${index}`} radius="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.25 }}>
        <Box sx={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: `${t.radius.sm}px`, backgroundColor: t.color.actionSoft, color: t.color.accentText }}>
          <Icon size={20} weight="duotone" aria-hidden />
        </Box>
        <Box component="h2" id={`hp-sec-${index}`} sx={{ m: 0, fontSize: 18, fontWeight: 760 }}>
          {title}
        </Box>
      </Box>
      {children}
    </Panel>
  );
}

/**
 * Readiness as a key ring: five arcs around a key, one per requirement.
 * Each arc fills when its part is done; when all five are, the key turns.
 */
function KeyRing({ ready }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const done = CHECKS.filter((k) => ready[k]).length;
  const all = done === CHECKS.length;
  const R = 34;
  const C = 2 * Math.PI * R;
  const gap = 6;
  const seg = C / CHECKS.length - gap;
  const dark = t.mode === "dark";
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ position: "relative", width: 84, height: 84, flexShrink: 0 }} role="img" aria-label={`${s.checklist.title}: ${done} of ${CHECKS.length}`}>
        <svg viewBox="0 0 84 84" width="84" height="84" style={{ transform: "rotate(-90deg)" }}>
          {CHECKS.map((k, i) => (
            <circle key={`bg-${k}`} cx="42" cy="42" r={R} fill="none" stroke={t.color.surfaceInteractive} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${seg} ${C - seg}`} strokeDashoffset={-i * (seg + gap)} />
          ))}
          {CHECKS.map((k, i) => (
            <m.circle
              key={k}
              cx="42"
              cy="42"
              r={R}
              fill="none"
              stroke={t.brand.yellow}
              strokeWidth="7"
              strokeLinecap="round"
              strokeDashoffset={-i * (seg + gap)}
              initial={false}
              animate={{ strokeDasharray: ready[k] ? `${seg} ${C - seg}` : `0 ${C}` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            />
          ))}
        </svg>
        <Box
          component={m.div}
          initial={false}
          animate={{ rotate: all ? 90 : 0, scale: all ? 1.08 : 1 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 160, damping: 12 }}
          sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}
        >
          <svg viewBox="0 0 28 28" width="34" height="34" aria-hidden>
            <circle cx="14" cy="8" r="6" fill="none" stroke={all ? t.brand.yellow : dark ? t.brand.skyBright : t.brand.actionBlue} strokeWidth="4" />
            <rect x="12" y="13" width="4" height="13" rx="1.5" fill={all ? t.brand.yellow : dark ? t.brand.skyBright : t.brand.actionBlue} />
            <path d="M 15.5 19 H 20 V 26 H 15.5 V 24 H 17.5 V 21 H 15.5 Z" fill={all ? t.brand.yellow : dark ? t.brand.skyBright : t.brand.actionBlue} />
          </svg>
        </Box>
      </Box>
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.5, minWidth: 0 }}>
        {CHECKS.map((k) => (
          <Box component="li" key={k} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13.5, fontWeight: ready[k] ? 700 : 550, color: ready[k] ? t.color.text : t.color.textMuted }}>
            <Box component="span" sx={{ display: "grid", placeItems: "center", width: 18, height: 18, borderRadius: "50%", flexShrink: 0, backgroundColor: ready[k] ? t.brand.yellow : "transparent", border: ready[k] ? "none" : `1.5px solid ${t.color.borderStrong}`, color: t.brand.inkNavy, transition: "background-color 200ms ease" }}>
              {ready[k] ? <Check size={11} weight="bold" aria-hidden /> : null}
            </Box>
            {s.checklist[k]}
            <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              {ready[k] ? ", done" : ", to do"}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SignInGate() {
  const t = useRideTokens();
  const href = `/login?redirect=${encodeURIComponent("/housing/post")}`;
  return (
    <Panel radius="xl" sx={{ p: { xs: 3, md: 5 }, textAlign: "center", maxWidth: 560, mx: "auto" }}>
      <Box sx={{ display: "grid", placeItems: "center", width: 64, height: 64, mx: "auto", borderRadius: "50%", backgroundColor: t.color.actionSoft, color: t.color.accentText, mb: 2 }}>
        <SignIn size={30} weight="duotone" aria-hidden />
      </Box>
      <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 760 }}>{s.signIn.title}</Box>
      <Box component="p" sx={{ mt: 1, mb: 3, color: t.color.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>{s.signIn.body}</Box>
      <Button component={Link} href={href} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>
        {s.signIn.cta}
      </Button>
    </Panel>
  );
}

function PostContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { user, isAuthenticated, authLoading } = useAuth();
  const [form, setForm] = useState(INITIAL_ROOM);
  const [photos, setPhotos] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState("editing");
  const [created, setCreated] = useState(null);

  useEffect(() => {
    if (user?.email) setForm((prev) => (prev.email ? prev : { ...prev, email: user.email }));
  }, [user?.email]);
  // Free preview URLs when leaving the page.
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (patch) => setForm((prev) => ({ ...prev, ...patch }));
  const errors = useMemo(() => (showErrors ? validateRoom(form) : {}), [form, showErrors]);
  const ready = readiness(form, photos);
  const today = dayKey();

  const preview = {
    id: "preview",
    title: form.title.trim() || s.previewTitle,
    rent: Number(form.rent) || NaN,
    location: form.location.trim() || s.previewPlace,
    beds: form.beds,
    moveIn: form.moveIn ? new Date(`${form.moveIn}T00:00`) : null,
    photos: photos.map((p) => p.url),
    createdAt: new Date(),
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateRoom(form);
    if (Object.keys(found).length) {
      setShowErrors(true);
      notify({ message: s.errors.fix, tone: "error" });
      const first = FIELD_ORDER.find((k) => found[k]);
      requestAnimationFrame(() => document.getElementById(FIELD_ID[first])?.focus());
      return;
    }
    setStatus("publishing");
    try {
      const result = await createRoom(toFormData(form, photos));
      setCreated(result.data || {});
      setStatus("done");
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } catch (error) {
      setStatus("editing");
      notify({ message: error?.details || error?.message || s.errors.failed, tone: "error" });
    }
  };

  const startOver = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setForm({ ...INITIAL_ROOM, email: user?.email || "" });
    setShowErrors(false);
    setCreated(null);
    setStatus("editing");
  };

  let body;
  if (authLoading) body = <Skeleton variant="rounded" height={480} sx={{ borderRadius: `${t.radius.xl}px` }} />;
  else if (!isAuthenticated) body = <SignInGate />;
  else if (status === "done") {
    body = (
      <Box sx={{ maxWidth: 560, mx: "auto", textAlign: "center", display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Box component={m.div} initial={reduce ? false : { rotate: -90, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 160, damping: 12 }} sx={{ display: "inline-grid", placeItems: "center", width: 72, height: 72, borderRadius: "50%", backgroundColor: t.brand.yellow, color: t.brand.inkNavy, mb: 1.5 }}>
            <Check size={36} weight="bold" aria-hidden />
          </Box>
          <Box component="h2" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 760 }}>{s.done.title}</Box>
          <Box component="p" sx={{ mt: 1, mb: 0, color: c.textSecondary, fontSize: 15.5 }}>{s.done.body}</Box>
        </Box>
        <Box sx={{ maxWidth: 320, mx: "auto", width: "100%", textAlign: "left" }} inert aria-hidden>
          <RoomTagCard room={preview} headingId="hp-done-card" preview />
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
          {created?.id ? (
            <Button component={Link} href={`/housing/${created.id}`} variant="contained" endIcon={<ArrowRight size={17} aria-hidden />} sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px` }}>
              {s.done.view}
            </Button>
          ) : null}
          <Button component={Link} href="/housing" variant="outlined" sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px` }}>
            {s.done.browse}
          </Button>
          <Button variant="text" onClick={startOver} sx={{ minHeight: 48 }}>
            {s.done.another}
          </Button>
        </Box>
      </Box>
    );
  } else {
    body = (
      <Box component="form" noValidate onSubmit={submit} sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 360px" }, alignItems: "start" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
          <Section icon={ImagesSquare} title={s.sections.photos} index={1}>
            <PhotoDrop photos={photos} onChange={setPhotos} />
          </Section>

          <Section icon={TextT} title={s.sections.basics} index={2}>
            <Box sx={{ display: "grid", gap: 2.25 }}>
              <TextField id={FIELD_ID.title} label={f.title} placeholder={f.titlePlaceholder} value={form.title} onChange={(e) => set({ title: e.target.value.slice(0, 80) })} error={Boolean(errors.title)} helperText={errors.title} required fullWidth sx={fieldSx(t)} />
              <TextField id={FIELD_ID.location} label={f.location} placeholder={f.locationPlaceholder} value={form.location} onChange={(e) => set({ location: e.target.value.slice(0, 120) })} error={Boolean(errors.location)} helperText={errors.location || f.locationHint} required fullWidth sx={fieldSx(t)} slotProps={{ input: adorn(MapPin) }} />
              <Box sx={{ display: "grid", gap: 2.25, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 1fr) auto" } }}>
                <TextField
                  id={FIELD_ID.rent}
                  label={f.rent}
                  value={form.rent}
                  onChange={(e) => set({ rent: cleanRent(e.target.value) })}
                  error={Boolean(errors.rent)}
                  helperText={errors.rent || " "}
                  required
                  fullWidth
                  sx={fieldSx(t)}
                  slotProps={{ htmlInput: { inputMode: "numeric" }, input: { ...adorn(CurrencyInr), endAdornment: <InputAdornment position="end">{HOUSING_STRINGS.results.perMonth}</InputAdornment> } }}
                />
                <Box>
                  <Box id="hp-beds-label" sx={{ fontSize: 13, fontWeight: 700, color: c.textSecondary, mb: 0.75 }}>{f.beds}</Box>
                  <Box role="group" aria-labelledby="hp-beds-label" sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: 56 }}>
                    <IconButton aria-label={f.bedsFewer} onClick={() => set({ beds: Math.max(1, form.beds - 1) })} disabled={form.beds <= 1} sx={{ width: 44, height: 44, border: `1px solid ${c.border}` }}>
                      <Minus size={18} aria-hidden />
                    </IconButton>
                    <Box id={FIELD_ID.beds} tabIndex={-1} aria-live="polite" sx={{ minWidth: 64, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 0.75, fontSize: 20, fontWeight: 760 }}>
                      <Bed size={20} weight="duotone" aria-hidden />
                      {form.beds}
                    </Box>
                    <IconButton aria-label={f.bedsMore} onClick={() => set({ beds: Math.min(20, form.beds + 1) })} disabled={form.beds >= 20} sx={{ width: 44, height: 44, border: `1px solid ${c.border}` }}>
                      <Plus size={18} aria-hidden />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <Box>
                <TextField
                  id={FIELD_ID.moveIn}
                  type="date"
                  label={f.moveIn}
                  value={form.moveIn}
                  onChange={(e) => set({ moveIn: e.target.value })}
                  error={Boolean(errors.moveIn)}
                  helperText={errors.moveIn}
                  required
                  fullWidth
                  sx={{ ...fieldSx(t), "& input": { colorScheme: t.mode } }}
                  slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: today }, input: adorn(CalendarBlank) }}
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                  {[
                    { label: f.moveInNow, value: today },
                    { label: f.moveInNextMonth, value: firstOfNextMonth() },
                  ].map((chip) => {
                    const on = form.moveIn === chip.value;
                    return (
                      <ButtonBase key={chip.label} onClick={() => set({ moveIn: chip.value })} aria-pressed={on} sx={{ minHeight: 36, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
                        {chip.label}
                      </ButtonBase>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Section>

          <Section icon={ChatCircleText} title={s.sections.about} index={3}>
            <TextField label={`${f.description} (${f.optional})`} placeholder={f.descriptionPlaceholder} value={form.description} onChange={(e) => set({ description: e.target.value.slice(0, DESCRIPTION_MAX) })} helperText={`${form.description.length}/${DESCRIPTION_MAX}`} multiline minRows={4} fullWidth sx={fieldSx(t)} />
          </Section>

          <Section icon={Phone} title={s.sections.contact} index={4}>
            <Box sx={{ fontSize: 13.5, color: errors.contact ? c.danger : c.textMuted, fontWeight: errors.contact ? 650 : 500, mb: 1.5 }}>{errors.contact || f.contactHint}</Box>
            <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" } }}>
              <TextField id={FIELD_ID.mobile} label={f.mobile} value={form.mobile} onChange={(e) => set({ mobile: e.target.value.slice(0, 20) })} error={Boolean(errors.mobile)} helperText={errors.mobile} fullWidth sx={fieldSx(t)} slotProps={{ htmlInput: { inputMode: "tel", autoComplete: "tel" }, input: adorn(Phone) }} />
              <TextField id={FIELD_ID.email} label={f.email} value={form.email} onChange={(e) => set({ email: e.target.value.slice(0, 120) })} error={Boolean(errors.email)} helperText={errors.email} fullWidth sx={fieldSx(t)} slotProps={{ htmlInput: { inputMode: "email", autoComplete: "email" }, input: adorn(EnvelopeSimple) }} />
              <TextField label={f.instagram} value={form.instagram} onChange={(e) => set({ instagram: e.target.value.slice(0, 40) })} fullWidth sx={fieldSx(t)} slotProps={{ input: adorn(InstagramLogo) }} />
            </Box>
          </Section>
        </Box>

        {/* Preview and readiness: sticky beside the form on desktop, after it on smaller screens. */}
        <Box sx={{ position: { lg: "sticky" }, top: { lg: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` }, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box>
            <Box sx={{ fontSize: 13, fontWeight: 760, letterSpacing: "0.06em", textTransform: "uppercase", color: c.textMuted, mb: 1.25 }}>{s.previewLabel}</Box>
            <Box inert aria-hidden sx={{ pointerEvents: "none" }}>
              <RoomTagCard room={preview} headingId="hp-preview-card" preview />
            </Box>
          </Box>
          <Panel radius="xl" sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2.25 }}>
            <KeyRing ready={ready} />
            <Button type="submit" variant="contained" size="large" disabled={status === "publishing"} endIcon={<PaperPlaneTilt size={18} weight="fill" aria-hidden />} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>
              {status === "publishing" ? s.publishing : s.publish}
            </Button>
          </Panel>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <HousingTopBar backHref="/housing" backLabel={s.back} />
        <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 30, sm: 38, md: 44 }, lineHeight: 1.06, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
          {s.title}
        </Box>
        <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>{s.lead}</Box>
      </Box>
      {body}
    </Box>
  );
}

/** The List your room page body. The route page renders the footer after it. */
export default function PostRoom() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <PostContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
