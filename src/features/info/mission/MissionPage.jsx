"use client";

import Box from "@mui/material/Box";
import { ArrowRight } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { featureByKey } from "@components/layout/header/navConfig";
import { ArrowLink, InfoHero, PrimaryLink, Section, containerSx } from "../shared/infoKit";
import { COMMITMENTS, SHIFTS, STATEMENT } from "./missionContent";

function MissionContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const accent = dark ? t.brand.yellow : t.brand.actionBlue;

  return (
    <Box sx={containerSx(t)}>
      <InfoHero
        eyebrow="Our mission"
        lead="Make campus life"
        accent="easier to share."
        intro="Every campus is full of empty car seats, spare rooms, unused tickets and things someone else needs. UniShare exists to put them to use."
        t={t}
      />

      {/* The mission in one sentence. */}
      <Box component="figure" sx={{ m: 0, mt: { xs: 4, md: 5 }, position: "relative", pl: { xs: 2.5, sm: 3.5 }, py: 0.5, borderLeft: `4px solid ${accent}` }}>
        <Box component="blockquote" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 24, sm: 32 }, lineHeight: 1.25, fontWeight: 800, letterSpacing: "-0.02em", color: c.text, maxWidth: 820 }}>
          {STATEMENT}
        </Box>
        <Box component="figcaption" sx={{ mt: 1.25, fontSize: 14.5, fontWeight: 700, color: c.textMuted }}>The UniShare mission</Box>
      </Box>

      {/* Before and after. */}
      <Section id="why" title="Why it matters" sub="Small, everyday problems that add up over a semester." t={t}>
        <Panel radius="xl" sx={{ overflow: "hidden" }}>
          <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "minmax(0, 1fr) 40px minmax(0, 1fr)", gap: 2, px: 3, py: 1.5, borderBottom: `1px solid ${c.border}`, backgroundColor: c.surfaceInteractive, fontSize: 13, fontWeight: 800, color: c.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            <span>Without sharing</span>
            <span />
            <span>With UniShare</span>
          </Box>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
            {SHIFTS.map((s) => {
              const f = featureByKey[s.feature];
              const ink = f.ink[dark ? 1 : 0];
              const Icon = f.icon;
              return (
                <Box
                  component="li"
                  key={s.feature}
                  sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 40px minmax(0, 1fr)" }, gap: { xs: 1, md: 2 }, alignItems: "center", px: { xs: 2.25, sm: 3 }, py: { xs: 2, md: 2.25 }, borderTop: `1px solid ${c.border}`, "&:first-of-type": { borderTop: 0 } }}
                >
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Box aria-hidden sx={{ flexShrink: 0, width: 34, height: 34, borderRadius: "10px", display: "grid", placeItems: "center", color: ink, backgroundColor: `color-mix(in srgb, ${ink} ${dark ? 18 : 11}%, transparent)` }}>
                      <Icon size={18} />
                    </Box>
                    <Box component="p" sx={{ m: 0, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary, pt: "5px" }}>
                      <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>{f.label}, without sharing: </Box>
                      {s.before}
                    </Box>
                  </Box>
                  <Box aria-hidden sx={{ display: { xs: "none", md: "grid" }, placeItems: "center", color: accent }}>
                    <ArrowRight size={20} />
                  </Box>
                  <Box component="p" sx={{ m: 0, pl: { xs: "50px", md: 0 }, fontSize: 16, lineHeight: 1.45, fontWeight: 750, color: c.text }}>
                    <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>With UniShare: </Box>
                    {s.after}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Panel>
      </Section>

      {/* What we won't trade away. */}
      <Section id="commitments" title="What guides us" sub="When we decide what to build next, these come first." t={t}>
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: { xs: 3, md: 4 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {COMMITMENTS.map((m, i) => (
            <Box component="li" key={m.title} sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
              <Box aria-hidden sx={{ flexShrink: 0, fontFamily: t.typography.family, fontSize: 40, lineHeight: 0.9, fontWeight: 900, color: accent, width: { xs: 50, sm: 56 }, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</Box>
              <Box>
                <Box component="h3" sx={{ m: 0, fontSize: 19, fontWeight: 850, color: c.text }}>{m.title}</Box>
                <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15.5, lineHeight: 1.6, color: c.textSecondary }}>{m.text}</Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Section>

      {/* Close. */}
      <Panel radius="xl" sx={{ mt: { xs: 6, md: 8 }, p: { xs: 3, sm: 4.5 }, textAlign: { xs: "left", sm: "center" }, overflow: "hidden", backgroundImage: dark ? `radial-gradient(120% 140% at 50% 0%, ${c.actionSoft}, transparent 60%)` : `radial-gradient(120% 140% at 50% 0%, rgba(21,101,216,0.07), transparent 60%)` }}>
        <Box component="h2" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 26, sm: 34 }, lineHeight: 1.15, fontWeight: 850, letterSpacing: "-0.02em", color: c.text }}>
          It works because students show up for each other.
        </Box>
        <Box component="p" sx={{ m: 0, mt: 1, mx: { sm: "auto" }, maxWidth: 520, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>
          Offer a seat, pass something on, or tell us how UniShare could help more.
        </Box>
        <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: { xs: "flex-start", sm: "center" } }}>
          <PrimaryLink href="/" t={t}>Start sharing</PrimaryLink>
          <ArrowLink href="/info/about" t={t}>About UniShare</ArrowLink>
          <ArrowLink href="/info/feedback" t={t}>Send feedback</ArrowLink>
        </Box>
      </Panel>
    </Box>
  );
}

export default function MissionPage() {
  return (
    <RideThemeBridge>
      <MissionContent />
    </RideThemeBridge>
  );
}
