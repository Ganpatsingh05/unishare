"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { m, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft } from "@solar-icons/react/linear/arrow-left";
import { ArrowRightIcon as ArrowRight } from "@solar-icons/react/linear/arrow-right";
import { AddCircleIcon as AddCircle } from "@solar-icons/react/bold-duotone/add-circle";
import { LinkRoundIcon as LinkRound } from "@solar-icons/react/bold-duotone/link-round";
import { DocumentTextIcon as DocumentText } from "@solar-icons/react/bold-duotone/document-text";
import { LibraryIcon as Library } from "@solar-icons/react/bold-duotone/library";
import { ShieldCheckIcon as ShieldCheck } from "@solar-icons/react/bold-duotone/shield-check";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { useAuth } from "@contexts/UniShareContext";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import { submitResourceSuggestion } from "../../services/resources.service";
import { domainOf, safeUrl } from "../../utils/resourceModel";
import { initialSuggestion, LIMITS, toPayload, validateSuggestion } from "../../utils/suggestResource";
import ResourceCard from "../landing/ResourceCard";
import SuggestionsLink from "../manage/SuggestionsLink";
import { CategoryPicker, Counter, InReviewStamp, LinkField, TagInput, TypePicker } from "./fields";

const S = RESOURCE_STRINGS;
const s = S.suggest;
const f = s.fields;

function Section({ icon: Icon, title, index, children }) {
  const t = useRideTokens();
  return (
    <Panel component="section" aria-labelledby={`sr-sec-${index}`} radius="xl" sx={{ p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.25 }}>
        <Box sx={{ position: "relative", display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: `${t.radius.sm}px`, backgroundColor: t.color.actionSoft, color: t.color.accentText }}>
          <Icon size={22} aria-hidden />
          <Box component="span" aria-hidden sx={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 850, backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>{index}</Box>
        </Box>
        <Box component="h2" id={`sr-sec-${index}`} sx={{ m: 0, fontSize: 18, fontWeight: 760 }}>{title}</Box>
      </Box>
      {children}
    </Panel>
  );
}

function SuggestContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { isAuthenticated, authLoading } = useAuth();
  const [form, setForm] = useState(initialSuggestion);
  const [typeTouched, setTypeTouched] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);

  const errors = validateSuggestion(form);
  const show = (key) => (shown && errors[key] ? s.errors[errors[key]] : "");
  const url = safeUrl(form.url);
  const preview = {
    id: "preview",
    title: form.title.trim() || f.titlePlaceholder.replace(/^e\.g\.\s*/, ""),
    desc: form.desc.trim(),
    url,
    domain: url ? domainOf(url) : "",
    category: form.category || "academics",
    type: form.type,
    tags: form.tags,
    createdAt: null,
  };

  const submit = async (e) => {
    e.preventDefault();
    setShown(true);
    if (Object.keys(errors).length) {
      document.querySelector("[aria-invalid='true']")?.focus();
      return;
    }
    setBusy(true);
    const result = await submitResourceSuggestion(toPayload(form));
    setBusy(false);
    if (!result.success) {
      notify({ message: result.error || s.failed, tone: "error" });
      return;
    }
    setDone({ ...preview, createdAt: new Date() });
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  const reset = () => {
    setForm(initialSuggestion());
    setTypeTouched(false);
    setGuessed(false);
    setShown(false);
    setDone(null);
  };

  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };
  let body;
  if (authLoading) {
    body = <Skeleton variant="rounded" height={520} sx={{ borderRadius: `${t.radius.xl}px` }} />;
  } else if (!isAuthenticated) {
    body = (
      <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", maxWidth: 560, mx: "auto" }}>
        <Box sx={{ mx: "auto", mb: 2, display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: "50%", backgroundColor: c.actionSoft, color: c.accentText }}>
          <Login2 size={32} aria-hidden />
        </Box>
        <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 760 }}>{s.signIn.title}</Box>
        <Box component="p" sx={{ mt: 1, mb: 3, color: c.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>{s.signIn.body}</Box>
        <Button component={Link} href={`/login?redirect=${encodeURIComponent("/resources/suggest")}`} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>{s.signIn.cta}</Button>
      </Panel>
    );
  } else if (done) {
    body = (
      <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, display: "grid", gap: { xs: 3, md: 5 }, gridTemplateColumns: { xs: "1fr", md: "360px 1fr" }, alignItems: "center" }}>
        <Box component={m.div} initial={reduce ? false : { y: -24, rotate: -3, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16 }}>
          <ResourceCard item={done} preview stamp={<InReviewStamp />} />
        </Box>
        <Box>
          <Box component="h2" sx={{ m: 0, fontSize: { xs: 26, md: 32 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.done.title}</Box>
          <Box component="p" sx={{ mt: 1, mb: 3, maxWidth: 440, fontSize: 16, lineHeight: 1.55, color: c.textSecondary }}>{s.done.body}</Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/resources" variant="contained" endIcon={<ArrowRight size={18} aria-hidden />} sx={{ minHeight: 48, px: 3, borderRadius: `${t.radius.pill}px` }}>{s.done.library}</Button>
            <SuggestionsLink sx={{ minHeight: 48 }} />
            <Button variant="text" onClick={reset} startIcon={<AddCircle size={19} aria-hidden />} sx={{ minHeight: 48, px: 2 }}>{s.done.another}</Button>
          </Box>
        </Box>
      </Panel>
    );
  } else {
    body = (
      <Box component="form" noValidate onSubmit={submit} sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 380px" }, alignItems: "start" }}>
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Section icon={LinkRound} title={s.sections.link} index={1}>
            <LinkField
              value={form.url}
              onChange={(next) => setForm((p) => ({ ...p, url: next }))}
              onGuess={(type) => {
                if (typeTouched) return;
                setForm((p) => ({ ...p, type }));
                setGuessed(true);
              }}
              error={show("url")}
            />
          </Section>
          <Section icon={DocumentText} title={s.sections.about} index={2}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}><Counter n={form.title.length} max={LIMITS.title} /></Box>
                <TextField label={f.title} placeholder={f.titlePlaceholder} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value.slice(0, LIMITS.title) }))} error={Boolean(show("title"))} helperText={show("title") || " "} required fullWidth sx={field} />
              </Box>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}><Counter n={form.desc.length} max={LIMITS.desc} /></Box>
                <TextField label={f.desc} placeholder={f.descPlaceholder} value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value.slice(0, LIMITS.desc) }))} fullWidth multiline minRows={3} sx={field} />
              </Box>
              <TagInput value={form.tags} onChange={(tags) => setForm((p) => ({ ...p, tags }))} />
            </Box>
          </Section>
          <Section icon={Library} title={s.sections.shelf} index={3}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <CategoryPicker value={form.category} onChange={(category) => setForm((p) => ({ ...p, category }))} error={Boolean(show("category"))} />
              <TypePicker
                value={form.type}
                guessed={guessed && !typeTouched}
                onChange={(type) => {
                  setTypeTouched(true);
                  setForm((p) => ({ ...p, type }));
                }}
              />
            </Box>
          </Section>
        </Box>

        <Box sx={{ position: { lg: "sticky" }, top: { lg: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` }, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ fontSize: 12.5, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: c.textMuted }}>{s.preview}</Box>
          <ResourceCard item={preview} preview />
          <Panel radius="xl" sx={{ p: 2.25, display: "flex", flexDirection: "column", gap: 1.75 }}>
            <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", fontSize: 13.5, lineHeight: 1.5, color: c.textSecondary }}>
              <ShieldCheck size={22} color={c.accentText} aria-hidden style={{ flexShrink: 0 }} />
              {s.review}
            </Box>
            <Button type="submit" variant="contained" size="large" disabled={busy} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>{busy ? s.submitting : s.submit}</Button>
          </Panel>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1 }}>
          <Button component={Link} href="/resources" variant="text" startIcon={<ArrowLeft size={18} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, color: c.textSecondary }}>{s.back}</Button>
          {isAuthenticated ? <SuggestionsLink /> : null}
        </Box>
        <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 30, sm: 38, md: 44 }, lineHeight: 1.06, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>{s.title}</Box>
        <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>{s.lead}</Box>
      </Box>
      {body}
    </Box>
  );
}

/** Suggest-a-resource page body. The route page renders the footer after it. */
export default function SuggestResource() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <SuggestContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
