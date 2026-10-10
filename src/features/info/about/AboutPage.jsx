"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import { ArrowRight } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { FEATURES } from "@components/layout/header/navConfig";
import { ArrowLink, InfoHero, PrimaryLink, Section, containerSx, focusRing } from "../shared/infoKit";
import { FEATURE_BLURBS, HOW_IT_WORKS, NEXT_LINKS, PRINCIPLES } from "./aboutContent";

/** One feature as a link card: icon in its own colour, name, one line. */
function FeatureCard({ f, t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  const ink = f.ink[dark ? 1 : 0];
  const Icon = f.icon;
  return (
    <Box
      component={Link}
      href={f.href}
      sx={{
        display: "flex",
        flexDirection: { xs: "row", sm: "column" },
        alignItems: { xs: "flex-start", sm: "stretch" },
        gap: { xs: 1.75, sm: 1.25 },
        height: "100%",
        p: { xs: 2, sm: 2.25 },
        borderRadius: `${t.radius.lg}px`,
        border: `1px solid ${c.border}`,
        backgroundColor: c.surface,
        textDecoration: "none",
        transition: "border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease",
        "&:hover": { borderColor: ink, transform: "translateY(-2px)", boxShadow: t.elevation[2] },
        "&:hover .go": { opacity: 1, transform: "translateX(0)" },
        "@media (prefers-reduced-motion: reduce)": { "&:hover": { transform: "none" } },
        ...focusRing(t),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <Box aria-hidden sx={{ width: 42, height: 42, borderRadius: "12px", display: "grid", placeItems: "center", color: ink, backgroundColor: `color-mix(in srgb, ${ink} ${dark ? 18 : 11}%, transparent)` }}>
          <Icon size={21} />
        </Box>
        <Box component="span" className="go" aria-hidden sx={{ display: { xs: "none", sm: "inline-flex" }, color: c.textMuted, opacity: 0, transform: "translateX(-4px)", transition: "opacity 160ms ease, transform 160ms ease" }}>
          <ArrowRight size={18} />
        </Box>
      </Box>
      <Box>
        <Box component="h3" sx={{ m: 0, fontSize: 17, fontWeight: 850, color: c.text }}>{f.label}</Box>
        <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 14.5, lineHeight: 1.5, color: c.textSecondary }}>{FEATURE_BLURBS[f.key]}</Box>
      </Box>
    </Box>
  );
}

function AboutContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const stepInk = dark ? t.brand.yellow : t.brand.actionBlue;

  return (
    <Box sx={containerSx(t)}>
      <InfoHero
        eyebrow="About UniShare"
        lead="Made for campus,"
        accent="shared by students."
        intro="UniShare is one place for students to help each other out: share rides and rooms, pass on things and tickets, find what's lost, and keep up with campus."
        t={t}
      />
      <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
        <PrimaryLink href="/" t={t}>Start exploring</PrimaryLink>
        <ArrowLink href="/info/mission" t={t}>Read our mission</ArrowLink>
      </Box>

      {/* Everything in one place. */}
      <Section id="features" title="What you can do" sub="Eight parts of campus life, in one place. Pick one to jump in." t={t}>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
          {FEATURES.map((f) => (
            <li key={f.key}>
              <FeatureCard f={f} t={t} />
            </li>
          ))}
        </Box>
      </Section>

      {/* The loop every feature shares. */}
      <Section id="how" title="How it works" sub="Every feature follows the same three steps." t={t}>
        <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: { xs: 2.5, md: 3 }, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
            {HOW_IT_WORKS.map((s, i) => (
              <Box component="li" key={s.title} sx={{ position: "relative", display: "flex", flexDirection: { xs: "row", md: "column" }, gap: { xs: 1.75, md: 1.5 } }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
                  <Box aria-hidden sx={{ width: 40, height: 40, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: t.typography.family, fontSize: 18, fontWeight: 900, color: dark ? t.brand.inkNavy : "#fff", backgroundColor: stepInk }}>{i + 1}</Box>
                  {/* Connector to the next step, desktop only. */}
                  {i < HOW_IT_WORKS.length - 1 ? <Box aria-hidden sx={{ display: { xs: "none", md: "block" }, flex: 1, height: 2, borderRadius: 2, backgroundImage: `linear-gradient(90deg, ${stepInk}, transparent)`, opacity: 0.45, minWidth: 80 }} /> : null}
                </Box>
                <Box>
                  <Box component="h3" sx={{ m: 0, fontSize: 18, fontWeight: 850, color: c.text }}>{s.title}</Box>
                  <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15.5, lineHeight: 1.55, color: c.textSecondary }}>{s.text}</Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Panel>
      </Section>

      {/* What we hold to. */}
      <Section id="principles" title="What we stand for" sub="Not slogans: this is how UniShare works today." t={t}>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {PRINCIPLES.map((p) => (
            <Panel component="li" key={p.title} variant="flat" radius="lg" sx={{ p: { xs: 2.25, sm: 2.75 }, borderTop: `3px solid ${dark ? t.brand.yellow : t.brand.actionBlue}` }}>
              <Box component="h3" sx={{ m: 0, fontSize: 18, fontWeight: 850, color: c.text }}>{p.title}</Box>
              <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 15.5, lineHeight: 1.55, color: c.textSecondary }}>{p.text}</Box>
            </Panel>
          ))}
        </Box>
      </Section>

      {/* Where to next. */}
      <Panel variant="inset" radius="xl" sx={{ mt: { xs: 6, md: 8 }, p: { xs: 2.5, sm: 3.5 }, display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ maxWidth: 520 }}>
          <Box component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 850, color: c.text }}>Got an idea for UniShare?</Box>
          <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15.5, lineHeight: 1.55, color: c.textSecondary }}>UniShare grows with what students need. Tell us what would make campus easier.</Box>
        </Box>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          {NEXT_LINKS.map((l, i) => (
            <li key={l.href}>{i === NEXT_LINKS.length - 1 ? <PrimaryLink href={l.href} t={t}>{l.label}</PrimaryLink> : <ArrowLink href={l.href} t={t}>{l.label}</ArrowLink>}</li>
          ))}
        </Box>
      </Panel>
    </Box>
  );
}

export default function AboutPage() {
  return (
    <RideThemeBridge>
      <AboutContent />
    </RideThemeBridge>
  );
}
