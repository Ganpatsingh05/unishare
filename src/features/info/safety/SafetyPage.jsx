"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import { Check, TriangleAlert, X } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { ActivityTabs, ArrowLink, EmergencyCard, InfoHero, JumpLinks, PageEnd, PrimaryLink, Section, containerSx } from "../shared/infoKit";
import { ACTIVITIES, MEETUP, PRIVATE_INFO, RELATED, SCAM_SIGNS, UPDATED } from "./safetyContent";

const JUMPS = [
  { id: "meetups", label: "Meeting up" },
  { id: "activity", label: "By activity" },
  { id: "scams", label: "Spot a scam" },
  { id: "privacy", label: "Your information" },
  { id: "help", label: "Get help" },
];

/** A list where every line starts with the same small marker. */
function MarkedList({ items, Icon, ink, soft, t, size = 16 }) {
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.25 }}>
      {items.map((line) => (
        <Box component="li" key={line} sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", fontSize: size, lineHeight: 1.45, color: t.color.text }}>
          <Box component="span" aria-hidden sx={{ mt: "1px", flexShrink: 0, width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", backgroundColor: soft, color: ink }}>
            <Icon size={13} strokeWidth={3} />
          </Box>
          {line}
        </Box>
      ))}
    </Box>
  );
}

function ListTitle({ children, color }) {
  return <Box component="h3" sx={{ m: 0, mb: 1.25, fontSize: 15, fontWeight: 850, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{children}</Box>;
}

function SafetyContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const [activity, setActivity] = useState(ACTIVITIES[0].key);
  const warnSoft = `color-mix(in srgb, ${c.warning} ${dark ? 22 : 12}%, transparent)`;
  const stepInk = dark ? t.brand.yellow : t.brand.actionBlue;

  return (
    <Box sx={containerSx(t)}>
      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 340px" }, alignItems: "end" }}>
        <Box>
          <InfoHero
            eyebrow="Safety guidelines"
            lead="Stay safe,"
            accent="every time."
            intro="Simple habits for meeting, riding and trading with other students. Most problems are avoided by the first few."
            t={t}
          />
          <JumpLinks items={JUMPS} t={t} />
        </Box>
        <EmergencyCard t={t} />
      </Box>

      {/* Any meet-up, step by step. */}
      <Section id="meetups" title="Every time you meet someone" sub="Rides, rooms, sales or a lost wallet: the same three steps keep you safe." t={t}>
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
          {MEETUP.map((s, i) => (
            <Panel component="li" key={s.key} radius="xl" sx={{ p: { xs: 2.5, sm: 3 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Box aria-hidden sx={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", fontFamily: t.typography.family, fontSize: 16, fontWeight: 900, color: dark ? t.brand.inkNavy : "#fff", backgroundColor: stepInk }}>{i + 1}</Box>
                <Box component="h3" sx={{ m: 0, fontSize: 18, fontWeight: 850, color: c.text }}>{s.title}</Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <MarkedList items={s.items} Icon={Check} ink={c.success} soft={c.successSoft} t={t} size={15.5} />
              </Box>
            </Panel>
          ))}
        </Box>
      </Section>

      {/* Per activity: habits and warning signs. */}
      <Section id="activity" title="Safety by activity" sub="Pick one to see what to do, and what should make you stop." t={t}>
        <ActivityTabs
          items={ACTIVITIES}
          active={activity}
          onChange={setActivity}
          label="Safety by activity"
          t={t}
          renderPanel={(a) => (
            <Box sx={{ display: "grid", gap: { xs: 3, sm: 4 }, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
              <Box>
                <ListTitle color={c.success}>Stay safe</ListTitle>
                <MarkedList items={a.tips} Icon={Check} ink={c.success} soft={c.successSoft} t={t} />
              </Box>
              <Box>
                <ListTitle color={c.warning}>Stop if</ListTitle>
                <MarkedList items={a.flags} Icon={TriangleAlert} ink={c.warning} soft={warnSoft} t={t} />
              </Box>
            </Box>
          )}
          footer={(a) => <ArrowLink href={a.link.href} t={t}>{a.link.label}</ArrowLink>}
        />
      </Section>

      {/* Scam warning signs. */}
      <Section id="scams" title="Spot a scam" sub="Scams on campus usually look like one of these. If you see one, stop and report it." t={t}>
        <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" } }}>
          {SCAM_SIGNS.map((s) => (
            <Panel component="li" key={s.title} variant="flat" radius="lg" sx={{ p: 2.25, borderLeft: `4px solid ${c.warning}` }}>
              <Box component="h3" sx={{ m: 0, fontSize: 16.5, fontWeight: 850, color: c.text }}>{s.title}</Box>
              <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15, lineHeight: 1.5, color: c.textSecondary }}>{s.text}</Box>
            </Panel>
          ))}
        </Box>
      </Section>

      {/* What to share and what to keep. */}
      <Section id="privacy" title="Your information" sub="Share only what someone needs to meet you. Nobody on UniShare needs your codes or bank details." t={t}>
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <ListTitle color={c.success}>Fine to share</ListTitle>
            <MarkedList items={PRIVATE_INFO.share} Icon={Check} ink={c.success} soft={c.successSoft} t={t} />
          </Panel>
          <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3 } }}>
            <ListTitle color={c.danger}>Keep to yourself</ListTitle>
            <MarkedList items={PRIVATE_INFO.keep} Icon={X} ink={c.danger} soft={c.dangerSoft} t={t} />
          </Panel>
        </Box>
      </Section>

      {/* Where to go when something goes wrong. */}
      <Section id="help" title="If something goes wrong" t={t}>
        <Panel radius="xl" sx={{ p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto" }, alignItems: "center" }}>
          <Box>
            <Box component="p" sx={{ m: 0, fontSize: 17, lineHeight: 1.55, fontWeight: 650, color: c.text, maxWidth: 560 }}>
              Leave, get somewhere safe, then tell us. Screenshots, the post and the time help us act quickly.
            </Box>
            <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 15, lineHeight: 1.55, color: c.textSecondary, maxWidth: 560 }}>
              If you&apos;re in danger, call campus security or the emergency services first.
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
            <PrimaryLink href="/info/report" t={t}>Report a problem</PrimaryLink>
            <ArrowLink href="/contacts" t={t}>Campus contacts</ArrowLink>
          </Box>
        </Panel>
      </Section>

      <PageEnd updated={UPDATED} related={RELATED} t={t} />
    </Box>
  );
}

export default function SafetyPage() {
  return (
    <RideThemeBridge>
      <SafetyContent />
    </RideThemeBridge>
  );
}
