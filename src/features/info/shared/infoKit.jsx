"use client";

import { useRef } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, Siren } from "lucide-react";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { featureByKey } from "@components/layout/header/navConfig";

// Building blocks shared by the info pages (guidelines, safety, ...). They
// read colours from the ride tokens, so render them inside RideThemeBridge.

export function containerSx(t) {
  return { width: "100%", maxWidth: 1040, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } };
}

export const focusRing = (t) => ({ "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 } });

/** Eyebrow, two-tone headline and one-line intro. */
export function InfoHero({ eyebrow, lead, accent, intro, t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  return (
    <>
      <Box sx={{ fontSize: 13.5, fontWeight: 800, color: c.accentText }}>{eyebrow}</Box>
      <Box component="h1" sx={{ m: 0, mt: 0.5, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
        <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{lead}</Box> <Box component="span" sx={accentSx}>{accent}</Box>
      </Box>
      <Box component="p" sx={{ m: 0, mt: 1.25, maxWidth: 580, fontSize: 17, lineHeight: 1.55, color: c.textSecondary }}>{intro}</Box>
    </>
  );
}

/** Pill links that jump to sections further down. */
export function JumpLinks({ items, t }) {
  const c = t.color;
  return (
    <Box component="nav" aria-label="On this page" sx={{ mt: 2.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((j) => (
        <Box key={j.id} component="a" href={`#${j.id}`} sx={{ display: "inline-flex", alignItems: "center", minHeight: 36, px: 1.5, borderRadius: 99, fontSize: 14, fontWeight: 700, color: c.textSecondary, textDecoration: "none", border: `1px solid ${c.border}`, backgroundColor: c.surface, "&:hover": { color: c.text, borderColor: c.textMuted }, ...focusRing(t) }}>
          {j.label}
        </Box>
      ))}
    </Box>
  );
}

/** A page section with a heading and an optional one-line explanation. */
export function Section({ id, title, sub, t, children }) {
  const c = t.color;
  return (
    <Box component="section" id={id} aria-labelledby={`${id}-title`} sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop + 16}px` }}>
      <Box sx={{ mb: 2.25 }}>
        <Box component="h2" id={`${id}-title`} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 25, sm: 30 }, lineHeight: 1.15, fontWeight: 850, letterSpacing: "-0.02em", color: c.text }}>{title}</Box>
        {sub ? <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 16, lineHeight: 1.55, color: c.textSecondary, maxWidth: 620 }}>{sub}</Box> : null}
      </Box>
      {children}
    </Box>
  );
}

/** Text link with a nudging arrow. */
export function ArrowLink({ href, children, t, color, sx }) {
  return (
    <Box component={Link} href={href} sx={[{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 32, fontSize: 15, fontWeight: 750, color: color || t.color.accentText, textDecoration: "none", borderRadius: "6px", "&:hover .go": { transform: "translateX(3px)" }, ...focusRing(t) }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
      <Box component="span" className="go" aria-hidden sx={{ display: "inline-flex", transition: "transform 150ms ease" }}>
        <ArrowRight size={16} />
      </Box>
    </Box>
  );
}

/** Filled pill link for the one main action in a block. */
export function PrimaryLink({ href, children, t, sx }) {
  const c = t.color;
  return (
    <Box component={Link} href={href} sx={[{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 46, px: 2.5, borderRadius: 99, fontSize: 15.5, fontWeight: 800, textDecoration: "none", backgroundColor: c.action, color: c.onAction, "&:hover .go": { transform: "translateX(3px)" }, ...focusRing(t) }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {children}
      <Box component="span" className="go" aria-hidden sx={{ display: "inline-flex", transition: "transform 150ms ease" }}>
        <ArrowRight size={16} />
      </Box>
    </Box>
  );
}

/** Red box that sends people in danger to campus contacts first. */
export function EmergencyCard({ title = "In danger? Don't wait for us.", text = "Call campus security or the emergency services first. Their numbers are on the Contacts page.", t, sx }) {
  const c = t.color;
  const dark = t.mode === "dark";
  return (
    <Box sx={[{ p: { xs: 2.5, sm: 3 }, borderRadius: `${t.radius.xl}px`, backgroundColor: c.dangerSoft, border: `1px solid ${dark ? "rgba(255,138,147,0.35)" : "rgba(198,47,59,0.28)"}` }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Box aria-hidden sx={{ display: "inline-flex", color: c.danger }}>
        <Siren size={22} />
      </Box>
      <Box component="h3" sx={{ m: 0, mt: 1, fontSize: 17.5, fontWeight: 850, color: c.text }}>{title}</Box>
      <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15, lineHeight: 1.55, color: c.textSecondary }}>{text}</Box>
      <ArrowLink href="/contacts" t={t} color={c.danger} sx={{ mt: 1.25, fontWeight: 800 }}>Campus contacts</ArrowLink>
    </Box>
  );
}

/**
 * Pill tabs, one per activity, with the chosen one's content in a panel
 * below. `items` need `key`, `label` and `feature` (a header feature key).
 */
export function ActivityTabs({ items, active, onChange, renderPanel, footer, label = "Activity", t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const tabs = useRef([]);
  const panelId = `${label.toLowerCase().replace(/\W+/g, "-")}-panel`;
  const current = items.find((a) => a.key === active) || items[0];

  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    let next = null;
    if (step) next = (i + step + items.length) % items.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = items.length - 1;
    if (next === null) return;
    e.preventDefault();
    onChange(items[next].key);
    tabs.current[next]?.focus();
  };

  return (
    <Box>
      <Box role="tablist" aria-label={label} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {items.map((a, i) => {
          const f = featureByKey[a.feature];
          const Icon = f.icon;
          const ink = f.ink[dark ? 1 : 0];
          const on = a.key === current.key;
          return (
            <ButtonBase
              key={a.key}
              ref={(el) => (tabs.current[i] = el)}
              role="tab"
              id={`${panelId}-tab-${a.key}`}
              aria-selected={on}
              aria-controls={panelId}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(a.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              sx={{
                gap: 1,
                minHeight: 44,
                px: 1.75,
                borderRadius: 99,
                fontFamily: "inherit",
                fontSize: 15,
                fontWeight: 750,
                border: `1.5px solid ${on ? ink : c.border}`,
                backgroundColor: on ? `color-mix(in srgb, ${ink} ${dark ? 18 : 10}%, ${c.surface})` : c.surface,
                color: on ? c.text : c.textSecondary,
                transition: "background-color 150ms ease, border-color 150ms ease, color 150ms ease",
                "&:hover": { borderColor: ink, color: c.text },
                "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
              }}
            >
              <Box component="span" aria-hidden sx={{ display: "inline-flex", color: ink }}>
                <Icon size={18} />
              </Box>
              {a.label}
            </ButtonBase>
          );
        })}
      </Box>

      <Panel radius="xl" id={panelId} role="tabpanel" aria-labelledby={`${panelId}-tab-${current.key}`} sx={{ mt: 2, overflow: "hidden" }}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div key={current.key} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }} transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}>
            <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>{renderPanel(current)}</Box>
            {footer ? <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 1.75, borderTop: `1px solid ${c.border}`, backgroundColor: c.surfaceInteractive }}>{footer(current)}</Box> : null}
          </m.div>
        </AnimatePresence>
      </Panel>
    </Box>
  );
}

/** Closing line with the date and related pages. */
export function PageEnd({ updated, related, t }) {
  const c = t.color;
  return (
    <Box sx={{ mt: { xs: 6, md: 8 }, pt: 3, borderTop: `1px solid ${c.border}`, display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ fontSize: 14, color: c.textMuted }}>Last updated {updated}. When this changes, we update this date.</Box>
      <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "flex", flexWrap: "wrap", gap: 2.5 }}>
        {related.map((r) => (
          <li key={r.href}>
            <Box component={Link} href={r.href} sx={{ fontSize: 14.5, fontWeight: 750, color: c.accentText, textUnderlineOffset: 3, borderRadius: "4px", ...focusRing(t) }}>{r.label}</Box>
          </li>
        ))}
      </Box>
    </Box>
  );
}
