"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import InputAdornment from "@mui/material/InputAdornment";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft } from "@solar-icons/react/linear/arrow-left";
import { ArrowRightIcon as ArrowRight } from "@solar-icons/react/linear/arrow-right";
import { AddCircleIcon as AddCircle } from "@solar-icons/react/bold-duotone/add-circle";
import InstagramLogo from "@components/ui/icons/InstagramIcon";
import { TagIcon as Tag } from "@solar-icons/react/bold-duotone/tag";
import { MapPointSearchIcon as MapPointSearch } from "@solar-icons/react/bold-duotone/map-point-search";
import { GalleryAddIcon as GalleryAdd } from "@solar-icons/react/bold-duotone/gallery-add";
import { ChatRoundDotsIcon as ChatRoundDots } from "@solar-icons/react/bold-duotone/chat-round-dots";
import { MagnifierIcon as Magnifier } from "@solar-icons/react/line-duotone/magnifier";
import { HandHeartIcon as HandHeart } from "@solar-icons/react/line-duotone/hand-heart";
import { PhoneIcon as Phone } from "@solar-icons/react/bold-duotone/phone";
import { LetterIcon as Letter } from "@solar-icons/react/bold-duotone/letter";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import PhotoDrop from "@features/housing/components/post/PhotoDrop";
import { useAuth } from "@contexts/UniShareContext";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";
import { createLostFoundItem } from "../../services/lostFound.service";
import useLostFoundFeed from "../../hooks/useLostFoundFeed";
import { categoryOf, ticketCode } from "../../utils/itemModel";
import { dayKey, initialReport, LIMITS, PHOTO_LIMITS, readiness, toItemData, validateReport, yesterdayKey } from "../../utils/reportItem";
import { CATEGORY_ICONS } from "../landing/categoryIcons";
import ItemCard from "../landing/ItemCard";

const s = LOST_FOUND_STRINGS.report;
const f = s.fields;
const CHECKS = ["what", "where", "photos", "contact"];

/** "I lost" / "I found" as two large choice cards. */
function ModeCards({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.modeLabel} sx={{ display: "grid", gap: 1.5, gridTemplateColumns: "1fr 1fr" }}>
      {["lost", "found"].map((key) => {
        const on = key === value;
        const accent = key === "lost" ? c.danger : c.success;
        const soft = key === "lost" ? c.dangerSoft : c.successSoft;
        const Icon = key === "lost" ? Magnifier : HandHeart;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(key)}
            onKeyDown={(e) => {
              if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                onChange(key === "lost" ? "found" : "lost");
              }
            }}
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              gap: 1.5,
              p: { xs: 1.75, sm: 2.25 },
              textAlign: "left",
              borderRadius: `${t.radius.lg}px`,
              backgroundColor: c.surface,
              border: `2px solid ${on ? accent : c.border}`,
              boxShadow: on ? `0 0 0 4px ${soft}` : t.elevation[1],
              transition: "border-color 180ms ease, box-shadow 180ms ease",
              "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 },
            }}
          >
            <Box aria-hidden sx={{ flexShrink: 0, display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: `${t.radius.md}px`, backgroundColor: soft, color: accent }}>
              <Icon size={28} strokeWidth={2} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ fontSize: { xs: 15, sm: 16.5 }, fontWeight: 780, color: c.text }}>{s.modes[key].title}</Box>
              <Box sx={{ mt: 0.25, fontSize: 13, color: c.textSecondary, display: { xs: "none", sm: "block" } }}>{s.modes[key].body}</Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function Section({ icon: Icon, title, index, children }) {
  const t = useRideTokens();
  return (
    <Panel component="section" aria-labelledby={`lr-sec-${index}`} radius="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.25 }}>
        <Box sx={{ position: "relative", display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: `${t.radius.sm}px`, backgroundColor: t.color.actionSoft, color: t.color.accentText }}>
          <Icon size={22} aria-hidden />
          <Box component="span" aria-hidden sx={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 850, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>{index}</Box>
        </Box>
        <Box component="h2" id={`lr-sec-${index}`} sx={{ m: 0, fontSize: 18, fontWeight: 760 }}>{title}</Box>
      </Box>
      {children}
    </Panel>
  );
}

function Chip({ selected, onClick, children }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <ButtonBase
      onClick={onClick}
      aria-pressed={selected}
      sx={{ minHeight: 36, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${selected ? "transparent" : c.border}`, backgroundColor: selected ? t.brand.yellow : c.surface, color: selected ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
    >
      {children}
    </ButtonBase>
  );
}

/**
 * Readiness as a magnifying glass: the rim fills in four arcs, one per part
 * of the form; when all required parts are done a check appears in the glass.
 */
function LensMeter({ ready }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const required = ["what", "where", "contact"];
  const all = required.every((k) => ready[k]);
  const r = 26;
  const len = (2 * Math.PI * r) / 4;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box component="svg" viewBox="0 0 80 80" aria-hidden sx={{ width: 76, height: 76, flexShrink: 0, overflow: "visible" }}>
        <path d="M 58 58 L 74 74" stroke={t.brand.inkNavy} strokeWidth="8" strokeLinecap="round" opacity={t.mode === "dark" ? 0.8 : 1} />
        <circle cx="36" cy="36" r={r} fill={all ? c.successSoft : c.surfaceInteractive} />
        {CHECKS.map((k, i) => (
          <m.circle
            key={k}
            cx="36"
            cy="36"
            r={r}
            fill="none"
            stroke={ready[k] ? (k === "photos" ? t.brand.skyBright : t.brand.yellow) : c.border}
            strokeWidth="7"
            strokeDasharray={`${len - 5} ${2 * Math.PI * r}`}
            strokeDashoffset={-i * len}
            transform="rotate(-90 36 36)"
            initial={false}
            animate={{ opacity: ready[k] ? 1 : 0.6 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          />
        ))}
        <AnimatePresence>
          {all ? (
            <m.path key="tick" d="M 25 37 L 33 45 L 48 29" fill="none" stroke={c.success} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} />
          ) : (
            <m.text key="count" x="36" y="41" textAnchor="middle" fontSize="15" fontWeight="800" fill={c.text} initial={false} exit={{ opacity: 0 }}>
              {CHECKS.filter((k) => ready[k]).length}/4
            </m.text>
          )}
        </AnimatePresence>
      </Box>
      <Box component="ul" aria-label={s.checklist.label} sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 0.4 }}>
        {CHECKS.map((k) => (
          <Box component="li" key={k} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13.5, fontWeight: 650, color: ready[k] ? c.text : c.textMuted }}>
            <Box component="span" aria-hidden sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: ready[k] ? (k === "photos" ? t.brand.skyBright : t.brand.yellowDeep) : c.border }} />
            {s.checklist[k]}
            <Box component="span" sx={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{ready[k] ? s.checklist.done : s.checklist.todo}</Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function SignInGate() {
  const t = useRideTokens();
  const href = `/login?redirect=${encodeURIComponent("/lost-found/report")}`;
  return (
    <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", maxWidth: 560, mx: "auto" }}>
      <Box sx={{ mx: "auto", mb: 2, display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: "50%", backgroundColor: t.color.actionSoft, color: t.color.accentText }}>
        <Login2 size={32} aria-hidden />
      </Box>
      <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 760 }}>{s.signIn}</Box>
      <Box component="p" sx={{ mt: 1, mb: 3, color: t.color.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>{f.contactHint}</Box>
      <Button component={Link} href={href} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>{s.signIn}</Button>
    </Panel>
  );
}

function ReportContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { user, isAuthenticated, authLoading } = useAuth();
  const { items } = useLostFoundFeed();
  const [form, setForm] = useState(() => initialReport());
  const [photos, setPhotos] = useState([]);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null); // the posted item, for the success view

  // Open in the mode chosen on the landing page (?mode=lost|found) and
  // prefill the signed-in student's email.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("mode");
    if (requested === "lost" || requested === "found") setForm((prev) => ({ ...prev, mode: requested }));
  }, []);
  useEffect(() => {
    if (user?.email) setForm((prev) => (prev.email ? prev : { ...prev, email: user.email }));
  }, [user?.email]);
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const errors = validateReport(form);
  const show = (key) => (shown && errors[key] ? s.errors[errors[key]] : "");
  const ready = readiness(form, photos);
  const category = categoryOf(form.name);
  const CategoryIcon = CATEGORY_ICONS[category];
  const lost = form.mode === "lost";

  // Most common places already on the board, as one-tap suggestions.
  const places = useMemo(() => {
    const counts = new Map();
    items.forEach((x) => x.place && counts.set(x.place, (counts.get(x.place) || 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([p]) => p);
  }, [items]);

  const preview = {
    id: "preview",
    mode: form.mode,
    name: form.name.trim() || f.namePlaceholder[form.mode].replace(/^e\.g\.\s*/, ""),
    description: form.description,
    place: form.place.trim(),
    date: form.date ? new Date(`${form.date}T00:00`) : null,
    time: form.time,
    images: photos.map((p) => p.url),
    contact: {},
    poster: user?.name || "",
    createdAt: new Date(),
    category,
  };

  const submit = async (e) => {
    e.preventDefault();
    setShown(true);
    if (Object.keys(errors).length) {
      const first = document.querySelector("[aria-invalid='true']");
      first?.focus();
      return;
    }
    setBusy(true);
    try {
      const result = await createLostFoundItem(toItemData(form), photos.map((p) => p.file));
      if (result?.success === false) throw new Error(result.message);
      setDone({ ...preview, id: result?.data?.id || "new" });
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } catch (error) {
      notify({ message: error?.message || s.failed, tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    setPhotos([]);
    setForm(initialReport(form.mode, user?.email || ""));
    setShown(false);
    setDone(null);
  };

  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };
  let body;
  if (authLoading) {
    body = <Skeleton variant="rounded" height={520} sx={{ borderRadius: `${t.radius.xl}px` }} />;
  } else if (!isAuthenticated) {
    body = <SignInGate />;
  } else if (done) {
    body = (
      <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "300px 1fr" }, alignItems: "center" }}>
        <Box component={m.div} initial={reduce ? false : { y: -40, rotate: -8, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} sx={{ maxWidth: 300, mx: "auto", width: "100%" }}>
          <ItemCard item={done} preview tilt={done.mode === "lost" ? -1.5 : 0} />
        </Box>
        <Box>
          <Box component="h2" sx={{ m: 0, fontSize: { xs: 26, md: 32 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.done.title[done.mode]}</Box>
          <Box component="p" sx={{ mt: 1, mb: 3, maxWidth: 440, fontSize: 16, lineHeight: 1.55, color: c.textSecondary }}>{s.done.body[done.mode]}</Box>
          {done.mode === "found" ? (
            <Box sx={{ mb: 3, display: "inline-flex", px: 1.5, py: 0.75, borderRadius: `${t.radius.sm}px`, backgroundColor: c.surfaceInteractive, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontWeight: 760 }}>
              {LOST_FOUND_STRINGS.card.ticket(ticketCode(done.id))}
            </Box>
          ) : null}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/lost-found#lf-board" variant="contained" endIcon={<ArrowRight size={18} aria-hidden />} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.done.board}</Button>
            <Button variant="outlined" onClick={reset} startIcon={<AddCircle size={19} aria-hidden />} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.done.another}</Button>
          </Box>
        </Box>
      </Panel>
    );
  } else {
    body = (
      <Box component="form" noValidate onSubmit={submit} sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" }, alignItems: "start" }}>
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <ModeCards value={form.mode} onChange={(mode) => setForm((prev) => ({ ...prev, mode }))} />

          <Section icon={Tag} title={s.sections.what} index={1}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={f.name}
                placeholder={f.namePlaceholder[form.mode]}
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value.slice(0, LIMITS.name) }))}
                error={Boolean(show("name"))}
                helperText={show("name") || " "}
                required
                sx={field}
                slotProps={{
                  input: {
                    endAdornment: form.name.trim() ? (
                      <InputAdornment position="end">
                        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1, py: 0.4, borderRadius: `${t.radius.pill}px`, fontSize: 12.5, fontWeight: 760, backgroundColor: c.surfaceInteractive, color: c.textSecondary, whiteSpace: "nowrap" }}>
                          <CategoryIcon size={16} aria-hidden />
                          {f.looksLike(LOST_FOUND_STRINGS.categories[category])}
                        </Box>
                      </InputAdornment>
                    ) : null,
                  },
                }}
              />
              <TextField
                label={f.description}
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value.slice(0, LIMITS.description) }))}
                error={Boolean(show("description"))}
                helperText={show("description") || f.descriptionHint[form.mode]}
                required
                multiline
                minRows={3}
                sx={field}
              />
            </Box>
          </Section>

          <Section icon={MapPointSearch} title={s.sections.where} index={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <TextField label={f.place[form.mode]} placeholder={f.placeHint} value={form.place} onChange={(e) => setForm((prev) => ({ ...prev, place: e.target.value.slice(0, LIMITS.place) }))} error={Boolean(show("place"))} helperText={show("place") || " "} required fullWidth sx={field} />
                {places.length ? (
                  <Box role="group" aria-label={f.recentPlaces} sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                    {places.map((p) => (
                      <Chip key={p} selected={form.place === p} onClick={() => setForm((prev) => ({ ...prev, place: p }))}>{p}</Chip>
                    ))}
                  </Box>
                ) : null}
              </Box>
              <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <Box>
                  <TextField type="date" label={f.date[form.mode]} value={form.date} onChange={set("date")} error={Boolean(show("date"))} helperText={show("date") || " "} required fullWidth sx={{ ...field, "& input": { colorScheme: t.mode } }} slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: dayKey() } }} />
                  <Box sx={{ display: "flex", gap: 0.75 }}>
                    <Chip selected={form.date === dayKey()} onClick={() => setForm((prev) => ({ ...prev, date: dayKey() }))}>{f.today}</Chip>
                    <Chip selected={form.date === yesterdayKey()} onClick={() => setForm((prev) => ({ ...prev, date: yesterdayKey() }))}>{f.yesterday}</Chip>
                  </Box>
                </Box>
                <TextField type="time" label={f.time} value={form.time} onChange={set("time")} fullWidth sx={{ ...field, "& input": { colorScheme: t.mode } }} slotProps={{ inputLabel: { shrink: true } }} />
              </Box>
            </Box>
          </Section>

          <Section icon={GalleryAdd} title={s.sections.photos} index={3}>
            <PhotoDrop photos={photos} onChange={setPhotos} max={PHOTO_LIMITS.max} mb={PHOTO_LIMITS.mb} accept={PHOTO_LIMITS.accept} />
          </Section>

          <Section icon={ChatRoundDots} title={s.sections.contact} index={4}>
            <Box sx={{ mb: 2, fontSize: 14, color: shown && errors.contact ? c.danger : c.textSecondary, fontWeight: shown && errors.contact ? 700 : 500 }} role={shown && errors.contact ? "alert" : undefined}>
              {shown && errors.contact ? s.errors.contact : f.contactHint}
            </Box>
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              {[
                { key: "mobile", icon: Phone, type: "tel", inputMode: "tel" },
                { key: "email", icon: Letter, type: "email", inputMode: "email" },
                { key: "instagram", icon: InstagramLogo, type: "text", inputMode: "text" },
              ].map(({ key, icon: Icon, type, inputMode }) => (
                <TextField
                  key={key}
                  type={type}
                  label={f[key]}
                  value={form[key]}
                  onChange={set(key)}
                  error={Boolean(show(key))}
                  helperText={show(key) || " "}
                  sx={field}
                  slotProps={{ htmlInput: { inputMode, autoComplete: key === "instagram" ? "off" : key === "mobile" ? "tel" : "email" }, input: { startAdornment: <InputAdornment position="start"><Icon size={20} aria-hidden color={c.textMuted} /></InputAdornment> } }}
                />
              ))}
            </Box>
          </Section>
        </Box>

        {/* Preview and readiness: sticky beside the form on desktop. */}
        <Box sx={{ position: { lg: "sticky" }, top: { lg: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` }, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textMuted }}>{s.preview}</Box>
          <Box sx={{ perspective: 900 }}>
            <AnimatePresence mode="wait" initial={false}>
              <Box key={form.mode} component={m.div} initial={reduce ? false : { rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { rotateY: 90, opacity: 0 }} transition={{ duration: 0.22, ease: "easeInOut" }} sx={{ pt: 1.5 }}>
                <ItemCard item={preview} preview tilt={lost ? -1.2 : 0} />
              </Box>
            </AnimatePresence>
          </Box>
          <Panel radius="xl" sx={{ p: 2.25, display: "flex", flexDirection: "column", gap: 2 }}>
            <LensMeter ready={ready} />
            <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>
              {busy ? s.publishing : s.publish[form.mode]}
            </Button>
          </Panel>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href="/lost-found" variant="text" startIcon={<ArrowLeft size={18} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: c.textSecondary }}>{s.back}</Button>
        <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 30, sm: 38, md: 44 }, lineHeight: 1.06, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>{s.title}</Box>
        <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>{s.lead}</Box>
      </Box>
      {body}
    </Box>
  );
}

/** Report page body. The route page renders the footer after it. */
export default function ReportItem() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ReportContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
