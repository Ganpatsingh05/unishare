"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { useAuth } from "@contexts/UniShareContext";
import { getPublicUserProfile } from "@lib/api/userProfile";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { normalizeProfile } from "../utils/profileModel";
import PassCard from "./PassCard";

const S = PROFILE_STRINGS;

/**
 * A student's public pass (GET /api/profile/:username returns only public
 * fields: name, username, photo, bio and join date). This is where the QR
 * code on the back of a pass leads.
 */
function PublicContent({ handle }) {
  const t = useRideTokens();
  const c = t.color;
  const { user } = useAuth();
  const phone = useMediaQuery("(max-width:599.95px)");
  const [state, setState] = useState({ status: "loading", raw: null });

  useEffect(() => {
    let alive = true;
    getPublicUserProfile(handle)
      .then((r) => alive && setState(r?.data ? { status: "ready", raw: r.data } : { status: "notfound", raw: null }))
      .catch(() => alive && setState({ status: "notfound", raw: null }));
    return () => {
      alive = false;
    };
  }, [handle]);

  const container = { width: "100%", maxWidth: 900, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } };
  if (state.status === "notfound") {
    return <Box sx={container}><Panel radius="xl" sx={{ mt: 4 }}><StateBlock title={S.public.notFound.title} body={S.public.notFound.body} action={<Button component={Link} href="/" variant="contained" sx={{ minHeight: 44 }}>{S.public.notFound.cta}</Button>} /></Panel></Box>;
  }
  // Public data only: no auth fallbacks, so nothing private leaks onto the card.
  const profile = state.raw ? { ...normalizeProfile(state.raw, {}), campus: "" } : null;
  const own = Boolean(user?.id && state.raw?.user_id && String(user.id) === String(state.raw.user_id));

  return (
    <Box sx={container}>
      <Box sx={{ display: "grid", gap: { xs: 3, md: 6 }, gridTemplateColumns: { xs: "1fr", md: "320px 1fr" }, alignItems: "center" }}>
        <Box sx={{ mt: { xs: 0, md: -2 } }}>{profile ? <PassCard profile={profile} width={phone ? 250 : 290} /> : <Skeleton variant="rounded" sx={{ width: 290, height: 560, mx: "auto", borderRadius: "26px" }} />}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Box component="h1" sx={{ m: 0, fontSize: { xs: 34, md: 46 }, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, lineHeight: 1.08, overflowWrap: "anywhere" }}>{profile ? profile.name || `@${profile.handle}` : <Skeleton width="60%" />}</Box>
          {profile?.handle ? <Box sx={{ mt: 0.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 16, fontWeight: 700, color: c.accentText }}>@{profile.handle}</Box> : null}
          {profile?.bio ? (
            <Box sx={{ mt: 3 }}>
              <Box component="h2" sx={{ m: 0, mb: 0.75, fontSize: 15, fontWeight: 780, color: c.textMuted }}>{S.public.about}</Box>
              <Box sx={{ fontSize: 16.5, lineHeight: 1.6, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{profile.bio}</Box>
            </Box>
          ) : null}
          {own ? (
            <Panel variant="flat" radius="lg" sx={{ mt: 3, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ fontSize: 14.5, color: c.textSecondary }}>{S.public.own}</Box>
              <Button component={Link} href="/profile" variant="contained" sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{S.public.toProfile}</Button>
            </Panel>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

export default function PublicPass({ handle }) {
  return (
    <RideThemeBridge>
      <PublicContent handle={handle} />
    </RideThemeBridge>
  );
}
