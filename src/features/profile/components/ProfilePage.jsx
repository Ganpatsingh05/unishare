"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { m, useReducedMotion } from "framer-motion";
import { SquarePen as PenNewSquare } from "lucide-react";
import { Share2 as Share } from "lucide-react";
import { LogIn as Login2 } from "lucide-react";
import { CircleCheck as CheckCircle } from "lucide-react";
import { CirclePlus as AddCircle } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { deleteProfileImage, getCurrentUserProfile, updateUserProfile } from "@lib/api/userProfile";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import useMyProfile from "../hooks/useMyProfile";
import useFootprint from "../hooks/useFootprint";
import { COMPLETENESS, completeness, passUrl, toProfilePayload } from "../utils/profileModel";
import PassCard from "./PassCard";
import FootprintStamps from "./FootprintStamps";
import ActivityList from "./ActivityList";
import EditSheet from "./EditSheet";
import SettingsShortcut from "./SettingsShortcut";

const S = PROFILE_STRINGS;

const formFrom = (p) => ({ name: p.name, handle: p.handle, campus: p.campus, phone: p.phone, bio: p.bio });

/** "Your pass is 67% complete" as a ring plus one chip per item; missing ones open the editor. */
function Completeness({ profile, onEdit }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { done, pct } = completeness(profile);
  const r = 26;
  const len = 2 * Math.PI * r;
  return (
    <Panel variant="flat" radius="xl" sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
      <Box sx={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
        <Box component="svg" viewBox="0 0 64 64" aria-hidden sx={{ width: 64, height: 64, transform: "rotate(-90deg)" }}>
          <circle cx="32" cy="32" r={r} fill="none" stroke={c.surfaceInteractive} strokeWidth="7" />
          <m.circle cx="32" cy="32" r={r} fill="none" stroke={pct === 100 ? c.success : t.brand.yellow} strokeWidth="7" strokeLinecap="round" strokeDasharray={len} initial={reduce ? false : { strokeDashoffset: len }} animate={{ strokeDashoffset: len * (1 - pct / 100) }} transition={{ duration: reduce ? 0 : 1.1, delay: 0.5, ease: "easeOut" }} />
        </Box>
        <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 15, fontWeight: 850 }}>{pct}%</Box>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 15, fontWeight: 780 }}>{S.completeness.title(pct)}</Box>
        <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 1, p: 0, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {COMPLETENESS.map((k) => (
            <Box component="li" key={k}>
              <ButtonBase onClick={done[k] ? undefined : onEdit} disabled={done[k]} sx={{ gap: 0.5, minHeight: 32, px: 1.1, borderRadius: `${t.radius.pill}px`, fontSize: 12.5, fontWeight: 700, border: `1px solid ${done[k] ? "transparent" : c.border}`, backgroundColor: done[k] ? c.successSoft : c.surface, color: done[k] ? c.success : c.textSecondary, "&.Mui-disabled": { color: c.success }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
                {done[k] ? <CheckCircle size={15} aria-hidden /> : <AddCircle size={15} aria-hidden />}
                {S.completeness.items[k]}
                <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>{done[k] ? S.completeness.done : S.completeness.todo}</Box>
              </ButtonBase>
            </Box>
          ))}
        </Box>
      </Box>
    </Panel>
  );
}

function ProfileContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const me = useMyProfile();
  const footprint = useFootprint(me.status === "ready");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => formFrom(me.profile));
  const [photo, setPhoto] = useState(null); // { file, url } | { remove: true } | null
  const [busy, setBusy] = useState(false);
  const phone = useMediaQuery("(max-width:599.95px)");
  const passWidth = phone ? 250 : 290;

  // The pass shows edits live while the sheet is open.
  const shown = useMemo(() => {
    if (!editing) return me.profile;
    const p = { ...me.profile, ...form };
    if (photo?.remove) p.photo = null;
    else if (photo?.url) p.photo = photo.url;
    return p;
  }, [editing, me.profile, form, photo]);

  const openEditor = () => {
    setForm(formFrom(me.profile));
    setPhoto(null);
    setEditing(true);
  };
  const closeEditor = () => {
    if (photo?.url) URL.revokeObjectURL(photo.url);
    setPhoto(null);
    setEditing(false);
  };

  const save = async () => {
    const before = completeness(me.profile).pct;
    setBusy(true);
    try {
      if (photo?.remove) await deleteProfileImage();
      await updateUserProfile(toProfilePayload(form), photo?.file || null);
      const fresh = await getCurrentUserProfile();
      me.replace(fresh?.data || {});
      closeEditor();
      notify({ message: S.edit.saved, tone: "success" });
      // A small celebration the first time the pass is complete.
      const after = completeness({ ...me.profile, ...form, photo: photo?.remove ? null : photo?.url || me.profile.photo }).pct;
      if (before < 100 && after === 100 && !reduce) {
        import("canvas-confetti").then(({ default: confetti }) => confetti({ particleCount: 90, spread: 70, origin: { y: 0.35 }, colors: ["#FFD43B", "#1D6FE0", "#7DD3FC", "#FFFFFF"], disableForReducedMotion: true }));
      }
    } catch (error) {
      notify({ message: error?.message || S.edit.failed, tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  const share = async () => {
    if (!me.profile.handle) {
      notify({ message: S.hero.needsHandle, tone: "error" });
      openEditor();
      return;
    }
    const url = passUrl(me.profile.handle);
    try {
      if (navigator.share) await navigator.share({ title: me.profile.name, url });
      else {
        await navigator.clipboard.writeText(url);
        notify({ message: S.hero.copied, tone: "success" });
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  const container = { width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } };

  if (me.status === "signedout") {
    return (
      <Box sx={container}>
        <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", maxWidth: 560, mx: "auto", mt: 4 }}>
          <Box sx={{ mx: "auto", mb: 2, display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: "50%", backgroundColor: c.actionSoft, color: c.accentText }}><Login2 size={32} aria-hidden /></Box>
          <Box component="h1" sx={{ m: 0, fontSize: 24, fontWeight: 800 }}>{S.signIn.title}</Box>
          <Box component="p" sx={{ mt: 1, mb: 3, color: c.textSecondary, fontSize: 15.5 }}>{S.signIn.body}</Box>
          <Button component={Link} href={`/login?redirect=${encodeURIComponent("/profile")}`} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>{S.signIn.cta}</Button>
        </Panel>
      </Box>
    );
  }
  if (me.status === "error") {
    return <Box sx={container}><Panel radius="xl"><StateBlock tone="error" title={S.error.title} body={S.error.body} onRetry={me.reload} retryLabel={S.error.retry} /></Panel></Box>;
  }

  const loading = me.status === "loading";
  const first = (me.profile.name || "").split(/\s+/)[0] || S.hero.fallbackName;
  const nameSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };

  return (
    <Box sx={container}>
      {/* Hero: the pass on the left (stays visible while editing), words on the right. */}
      <Box component="section" aria-labelledby="pf-title" sx={{ display: "grid", gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "340px minmax(0, 1fr)" }, alignItems: "center" }}>
        <Box sx={{ mt: { xs: 0, md: -2 } }}>
          {loading ? <Skeleton variant="rounded" sx={{ width: passWidth, height: Math.round(passWidth * 1.55) + (phone ? 40 : 96), mx: "auto", borderRadius: "26px" }} /> : <PassCard profile={shown} width={passWidth} />}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box component="h1" id="pf-title" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 52, md: 60 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
            {loading ? <Skeleton width="70%" /> : (
              <>
                <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>Hey,</Box>{" "}
                <Box component="span" sx={{ ...nameSx, overflowWrap: "anywhere" }}>{first}.</Box>
              </>
            )}
          </Box>
          <Box component="p" sx={{ m: 0, mt: 1.75, maxWidth: 520, fontSize: 16.5, lineHeight: 1.55, color: me.profile.bio ? c.text : c.textSecondary, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
            {loading ? <Skeleton /> : me.profile.bio || S.hero.noBio}
          </Box>
          <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 520, fontSize: 14.5, color: c.textMuted }}>{S.hero.lead}</Box>
          <Box sx={{ mt: 3, display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button variant="contained" onClick={openEditor} disabled={loading} startIcon={<PenNewSquare size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{S.hero.edit}</Button>
            <Button variant="outlined" onClick={share} disabled={loading} startIcon={<Share size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px` }}>{S.hero.share}</Button>
          </Box>
          {!loading ? <Box sx={{ mt: 3, maxWidth: 560 }}><Completeness profile={me.profile} onEdit={openEditor} /></Box> : null}
        </Box>
      </Box>

      {/* Footprint. */}
      <Box component="section" aria-labelledby="pf-footprint-title" sx={{ mt: { xs: 6, md: 8 } }}>
        <Box component="h2" id="pf-footprint-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 820, letterSpacing: "-0.02em" }}>{S.footprint.title}</Box>
        <Box sx={{ mt: 0.5, mb: 3, fontSize: 15, color: c.textSecondary }}>{footprint.status === "ready" ? S.footprint.lead : S.footprint.loading}</Box>
        <FootprintStamps counts={footprint.counts} status={footprint.status} />
      </Box>

      {/* Activity and settings. */}
      <Box sx={{ mt: { xs: 6, md: 8 }, display: "grid", gap: { xs: 4, md: 4 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.4fr) minmax(0, 1fr)" }, alignItems: "start" }}>
        <Box component="section" aria-labelledby="pf-activity-title">
          <Box component="h2" id="pf-activity-title" sx={{ m: 0, mb: 2, fontSize: 20, fontWeight: 820 }}>{S.activity.title}</Box>
          <ActivityList items={footprint.recent} status={footprint.status} />
        </Box>
        <SettingsShortcut />
      </Box>

      <EditSheet open={editing} profile={me.profile} form={form} onForm={setForm} photo={photo} onPhoto={(next) => { if (photo?.url) URL.revokeObjectURL(photo.url); setPhoto(next); }} onClose={closeEditor} onSave={save} busy={busy} />
    </Box>
  );
}

/** Profile page body. The route page renders the footer after it. */
export default function ProfilePage() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ProfileContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
