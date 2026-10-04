"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { Check, X } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { ActivityTabs, ArrowLink, EmergencyCard, InfoHero, JumpLinks, PageEnd, PrimaryLink, Section, containerSx } from "../shared/infoKit";
import { ACTIVITIES, BASICS, CONSEQUENCES, NEVER, NEVER_NOTE, RELATED, REPORT_STEPS, UPDATED } from "./guidelinesContent";

const JUMPS = [
  { id: "basics", label: "The basics" },
  { id: "activity", label: "By activity" },
  { id: "never", label: "Never allowed" },
  { id: "report", label: "Report a problem" },
  { id: "consequences", label: "If rules are broken" },
];

/** A short list with a tick or a cross in front of each line. */
function RuleList({ kind, items, t }) {
  const c = t.color;
  const good = kind === "do";
  const ink = good ? c.success : c.danger;
  const Icon = good ? Check : X;
  return (
    <Box>
      <Box component="h3" sx={{ m: 0, fontSize: 15, fontWeight: 850, color: ink, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {good ? "Do" : "Don't"}
      </Box>
      <Box component="ul" sx={{ m: 0, mt: 1.25, p: 0, listStyle: "none", display: "grid", gap: 1.25 }}>
        {items.map((line) => (
          <Box component="li" key={line} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", fontSize: 16, lineHeight: 1.45, color: c.text }}>
            <Box component="span" aria-hidden sx={{ mt: "1px", flexShrink: 0, width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: good ? c.successSoft : c.dangerSoft, color: ink }}>
              <Icon size={14} strokeWidth={3} />
            </Box>
            {line}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function GuidelinesContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const [activity, setActivity] = useState(ACTIVITIES[0].key);

  return (
    <Box sx={containerSx(t)}>
      <InfoHero
        eyebrow="Community guidelines"
        lead="Share well,"
        accent="together."
        intro="UniShare works because students trust each other. These are the rules that keep it that way. It takes about two minutes to read."
        t={t}
      />
      <JumpLinks items={JUMPS} t={t} />

      <Section id="basics" title="The basics" sub="If you only remember four things, make it these." t={t}>
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" } }}>
          {BASICS.map((b, i) => (
            <Panel component="li" key={b.title} radius="lg" sx={{ p: { xs: 1.75, sm: 2.25 } }}>
              <Box aria-hidden sx={{ fontFamily: t.typography.family, fontSize: 30, fontWeight: 900, lineHeight: 1, color: dark ? t.brand.yellow : t.brand.actionBlue }}>{i + 1}</Box>
              <Box component="h3" sx={{ m: 0, mt: 1.25, fontSize: 17.5, fontWeight: 850, color: c.text }}>{b.title}</Box>
              <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15, lineHeight: 1.5, color: c.textSecondary }}>{b.text}</Box>
            </Panel>
          ))}
        </Box>
      </Section>

      <Section id="activity" title="What are you doing?" sub="Pick one to see the rules for it." t={t}>
        <ActivityTabs
          items={ACTIVITIES}
          active={activity}
          onChange={setActivity}
          t={t}
          renderPanel={(a) => (
            <>
              <Box component="p" sx={{ m: 0, fontSize: 17, lineHeight: 1.5, fontWeight: 650, color: c.text, maxWidth: 640 }}>{a.lead}</Box>
              <Box sx={{ mt: 3, display: "grid", gap: { xs: 3, sm: 4 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                <RuleList kind="do" items={a.do} t={t} />
                <RuleList kind="dont" items={a.dont} t={t} />
              </Box>
            </>
          )}
          footer={(a) => <ArrowLink href={a.link.href} t={t}>{a.link.label}</ArrowLink>}
        />
      </Section>

      <Section id="never" title="Never allowed" sub="Anywhere on UniShare, no exceptions." t={t}>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {NEVER.map((n) => (
            <Panel component="li" key={n.title} variant="flat" radius="lg" sx={{ p: 2.25, display: "flex", gap: 1.5, alignItems: "flex-start" }}>
              <Box component="span" aria-hidden sx={{ mt: "2px", flexShrink: 0, width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: c.dangerSoft, color: c.danger }}>
                <X size={15} strokeWidth={3} />
              </Box>
              <Box>
                <Box component="h3" sx={{ m: 0, fontSize: 16.5, fontWeight: 850, color: c.text }}>{n.title}</Box>
                <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15, lineHeight: 1.5, color: c.textSecondary }}>{n.text}</Box>
              </Box>
            </Panel>
          ))}
        </Box>
        <Box component="p" sx={{ m: 0, mt: 2, fontSize: 15, lineHeight: 1.55, color: c.textSecondary, maxWidth: 680 }}>{NEVER_NOTE}</Box>
      </Section>

      <Section id="report" title="Something wrong?" sub="If someone breaks these rules or makes you feel unsafe, tell us." t={t}>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.4fr) minmax(0, 1fr)" } }}>
          <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, counterReset: "step" }}>
              {REPORT_STEPS.map((s) => (
                <Box component="li" key={s} sx={{ display: "flex", gap: 1.5, alignItems: "baseline", fontSize: 16, lineHeight: 1.45, color: c.text, counterIncrement: "step", "&::before": { content: "counter(step)", flexShrink: 0, display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: "50%", fontSize: 13, fontWeight: 850, backgroundColor: c.actionSoft, color: c.accentText, transform: "translateY(-2px)" } }}>
                  {s}
                </Box>
              ))}
            </Box>
            <PrimaryLink href="/info/report" t={t} sx={{ mt: 2.5 }}>Report a problem</PrimaryLink>
          </Panel>
          <EmergencyCard t={t} />
        </Box>
      </Section>

      <Section id="consequences" title="If the rules are broken" sub="What we do depends on how serious it was." t={t}>
        <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3 } }}>
          <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: { xs: 2, md: 2.5 }, gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" } }}>
            {CONSEQUENCES.map((s, i) => {
              // Bar deepens from amber to red as it gets more serious.
              const ink = ["#F2B33D", "#E8893A", "#DB5A3B", c.danger][i];
              return (
                <Box component="li" key={s.title} sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, gap: { xs: 1.5, md: 1.25 } }}>
                  <Box aria-hidden sx={{ flexShrink: 0, width: { xs: 4, md: "100%" }, height: { xs: "auto", md: 4 }, borderRadius: 99, backgroundColor: ink }} />
                  <Box>
                    <Box component="h3" sx={{ m: 0, fontSize: 16.5, fontWeight: 850, color: c.text }}>{s.title}</Box>
                    <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 14.5, lineHeight: 1.5, color: c.textSecondary }}>{s.text}</Box>
                  </Box>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ mt: 2.5, display: { xs: "none", md: "flex" }, justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: c.textMuted }}>
            <span>Less serious</span>
            <span>More serious</span>
          </Box>
        </Panel>
      </Section>

      <PageEnd updated={UPDATED} related={RELATED} t={t} />
    </Box>
  );
}

export default function GuidelinesPage() {
  return (
    <RideThemeBridge>
      <GuidelinesContent />
    </RideThemeBridge>
  );
}
