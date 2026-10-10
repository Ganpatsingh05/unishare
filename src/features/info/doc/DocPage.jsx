"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";

/*
 * A long-form page (guidelines, policies) made of sections. Content is data:
 *   sections: [{ id, title, intro?, blocks: [...] }]
 * Block types:
 *   { type: "p", text }
 *   { type: "list", items: [] }
 *   { type: "dodont", do: [], dont: [], doLabel?, dontLabel? }
 *   { type: "cards", items: [{ title, text }] }
 *   { type: "steps", items: [] }
 *   { type: "callout", title, text, link?: { label, href }, tone?: "info" | "warn" }
 */

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

function Block({ block, t }) {
  const c = t.color;
  const dark = t.mode === "dark";
  const text = { fontSize: 16, lineHeight: 1.7, color: c.textSecondary };
  switch (block.type) {
    case "p":
      return <Box component="p" sx={{ m: 0, ...text }}>{block.text}</Box>;
    case "list":
      return (
        <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: "disc", display: "grid", gap: 0.75, ...text, "& li": { display: "list-item" }, "& li::marker": { color: c.accentText } }}>
          {block.items.map((it) => <li key={it}>{it}</li>)}
        </Box>
      );
    case "steps":
      return (
        <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1.25, counterReset: "s" }}>
          {block.items.map((it) => (
            <Box component="li" key={it} sx={{ display: "flex", gap: 1.5, alignItems: "baseline", ...text, color: c.text, counterIncrement: "s", "&::before": { content: "counter(s)", flexShrink: 0, display: "inline-grid", placeItems: "center", width: 26, height: 26, borderRadius: "50%", fontSize: 13, fontWeight: 800, backgroundColor: c.actionSoft, color: c.accentText, transform: "translateY(-2px)" } }}>
              {it}
            </Box>
          ))}
        </Box>
      );
    case "dodont": {
      const good = dark ? "#6EE7B7" : "#047857";
      const bad = dark ? "#FCA5A5" : "#B91C1C";
      const col = (label, items, ink, Icon) => (
        <Box sx={{ p: 2.25, borderRadius: "18px", border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 14, fontWeight: 800, color: ink, mb: 1.25 }}>
            <Box component="span" sx={{ display: "grid", placeItems: "center", width: 24, height: 24, borderRadius: "50%", backgroundColor: `${ink}${dark ? "26" : "18"}` }}>
              <Icon size={14} strokeWidth={3} aria-hidden />
            </Box>
            {label}
          </Box>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 1 }}>
            {items.map((it) => (
              <Box component="li" key={it} sx={{ display: "flex", gap: 1.25, fontSize: 15, lineHeight: 1.55, color: c.text }}>
                <Box component="span" aria-hidden sx={{ mt: "9px", width: 6, height: 6, borderRadius: "50%", flexShrink: 0, backgroundColor: ink }} />
                {it}
              </Box>
            ))}
          </Box>
        </Box>
      );
      return (
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          {col(block.doLabel || "Do", block.do, good, Check)}
          {col(block.dontLabel || "Don't", block.dont, bad, X)}
        </Box>
      );
    }
    case "cards":
      return (
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {block.items.map((it, i) => (
            <Box key={it.title} sx={{ p: 2.25, borderRadius: "18px", border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.25 }}>
                {block.numbered === false ? null : <Box component="span" sx={{ fontSize: 13, fontWeight: 800, color: c.accentText, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</Box>}
                <Box component="h3" sx={{ m: 0, fontSize: 17, fontWeight: 800, color: c.text }}>{it.title}</Box>
              </Box>
              <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 15, lineHeight: 1.6, color: c.textSecondary }}>{it.text}</Box>
            </Box>
          ))}
        </Box>
      );
    case "callout": {
      const warn = block.tone === "warn";
      return (
        <Box sx={{ p: 2.25, borderRadius: "18px", borderLeft: `4px solid ${warn ? t.brand.yellow : c.action}`, backgroundColor: warn ? `${t.brand.yellow}${dark ? "1A" : "26"}` : c.actionSoft }}>
          {block.title ? <Box sx={{ fontSize: 16, fontWeight: 800, color: c.text }}>{block.title}</Box> : null}
          <Box component="p" sx={{ m: 0, mt: block.title ? 0.5 : 0, fontSize: 15, lineHeight: 1.6, color: c.text }}>{block.text}</Box>
          {block.link ? (
            <Box component={Link} href={block.link.href} sx={{ mt: 1.25, display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 15, fontWeight: 750, color: c.accentText, textDecoration: "none", "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2, borderRadius: "4px" } }}>
              {block.link.label}
              <ArrowRight size={16} aria-hidden />
            </Box>
          ) : null}
        </Box>
      );
    }
    case "table": {
      // A real table from tablet up; stacked cards with labels on phones.
      const cell = { px: 2, py: 1.5, fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary, textAlign: "left", verticalAlign: "top", borderTop: `1px solid ${c.border}` };
      return (
        <>
          <Box sx={{ display: { xs: "none", sm: "block" }, borderRadius: "18px", border: `1px solid ${c.border}`, backgroundColor: c.surface, overflow: "hidden" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              {block.caption ? <Box component="caption" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>{block.caption}</Box> : null}
              <thead>
                <tr>
                  {block.columns.map((col) => (
                    <Box component="th" scope="col" key={col} sx={{ ...cell, borderTop: 0, fontSize: 13, fontWeight: 800, color: c.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: c.surfaceInteractive }}>{col}</Box>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row[0]}>
                    {row.map((v, i) => (i === 0 ? <Box component="th" scope="row" key={i} sx={{ ...cell, fontWeight: 750, color: c.text }}>{v}</Box> : <Box component="td" key={i} sx={cell}>{v}</Box>))}
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
          <Box component="ul" sx={{ display: { xs: "grid", sm: "none" }, gap: 1.25, m: 0, p: 0, listStyle: "none" }}>
            {block.rows.map((row) => (
              <Box component="li" key={row[0]} sx={{ p: 2, borderRadius: "16px", border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
                <Box sx={{ fontSize: 15.5, fontWeight: 800, color: c.text }}>{row[0]}</Box>
                <Box component="dl" sx={{ m: 0, mt: 1, display: "grid", gap: 0.75 }}>
                  {row.slice(1).map((v, i) => (
                    <Box key={block.columns[i + 1]}>
                      <Box component="dt" sx={{ fontSize: 12.5, fontWeight: 800, color: c.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>{block.columns[i + 1]}</Box>
                      <Box component="dd" sx={{ m: 0, fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary }}>{v}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        </>
      );
    }
    default:
      return null;
  }
}

function Toc({ sections, active, onPick, t }) {
  const c = t.color;
  return (
    <Box component="nav" aria-label="On this page">
      <Box sx={{ fontSize: 13, fontWeight: 800, color: c.textMuted, mb: 1, px: 1.25 }}>On this page</Box>
      <Box component="ol" sx={{ m: 0, p: 0, listStyle: "none", display: "grid", gap: 0.25 }}>
        {sections.map((s, i) => {
          const on = s.id === active;
          return (
            <li key={s.id}>
              <Box
                component="a"
                href={`#${s.id}`}
                onClick={(e) => (e.preventDefault(), onPick(s.id))}
                aria-current={on ? "location" : undefined}
                sx={{ position: "relative", display: "flex", gap: 1, px: 1.25, py: 0.85, borderRadius: "10px", fontSize: 14.5, lineHeight: 1.35, textDecoration: "none", fontWeight: on ? 750 : 550, color: on ? c.accentText : c.textSecondary, backgroundColor: on ? c.actionSoft : "transparent", transition: "background-color 150ms ease, color 150ms ease", "&:hover": { color: c.text, backgroundColor: on ? c.actionSoft : c.surfaceInteractive }, "&:focus-visible": { outline: `2px solid ${c.focus}` } }}
              >
                <Box component="span" sx={{ fontVariantNumeric: "tabular-nums", opacity: 0.7, minWidth: 18 }}>{i + 1}</Box>
                {s.title}
              </Box>
            </li>
          );
        })}
      </Box>
    </Box>
  );
}

function DocContent({ doc }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const ids = useRef(doc.sections.map((s) => s.id)).current;
  const active = useActiveSection(ids);
  const [tocOpen, setTocOpen] = useState(false);

  const go = (id) => {
    setTocOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    history.replaceState(null, "", `#${id}`);
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    el.querySelector("h2")?.focus({ preventScroll: true });
  };

  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const activeIndex = Math.max(0, ids.indexOf(active));

  return (
    <Box sx={{ width: "100%", maxWidth: 1120, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } }}>
      {/* Title. */}
      <Box sx={{ maxWidth: 760 }}>
        {doc.eyebrow ? <Box sx={{ fontSize: 14, fontWeight: 750, color: c.accentText }}>{doc.eyebrow}</Box> : null}
        <Box component="h1" sx={{ m: 0, mt: 0.5, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
          <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>{doc.titleLead}</Box> <Box component="span" sx={accentSx}>{doc.titleAccent}</Box>
        </Box>
        <Box component="p" sx={{ m: 0, mt: 1.5, fontSize: 17.5, lineHeight: 1.6, color: c.textSecondary }}>{doc.intro}</Box>
        {doc.updated ? <Box sx={{ mt: 1.5, fontSize: 13.5, color: c.textMuted }}>Last updated {doc.updated}</Box> : null}
      </Box>

      {/* At a glance. */}
      {doc.summary ? (
        <Box component="section" aria-labelledby="doc-glance" sx={{ mt: 3.5, p: { xs: 2.25, sm: 3 }, borderRadius: "24px", backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: t.elevation[1] }}>
          <Box component="h2" id="doc-glance" sx={{ m: 0, fontSize: 18, fontWeight: 800, color: c.text }}>{doc.summaryTitle || "At a glance"}</Box>
          <Box component="ul" sx={{ m: 0, mt: 1.75, p: 0, listStyle: "none", display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: `repeat(${Math.min(doc.summary.length, 4)}, 1fr)` } }}>
            {doc.summary.map((s) => (
              <Box component="li" key={s.title} sx={{ pl: 1.75, borderLeft: `3px solid ${t.brand.yellow}` }}>
                <Box sx={{ fontSize: 16, fontWeight: 800, color: c.text }}>{s.title}</Box>
                <Box sx={{ mt: 0.25, fontSize: 14.5, lineHeight: 1.5, color: c.textSecondary }}>{s.text}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      ) : null}

      {/* Phones: contents in a disclosure. */}
      <Box sx={{ display: { xs: "block", lg: "none" }, mt: 2.5 }}>
        <ButtonBase onClick={() => setTocOpen((v) => !v)} aria-expanded={tocOpen} sx={{ width: "100%", justifyContent: "space-between", px: 2, minHeight: 50, borderRadius: "16px", border: `1px solid ${c.border}`, backgroundColor: c.surface, fontSize: 15, fontWeight: 750, color: c.text, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
          <span>
            On this page <Box component="span" sx={{ color: c.textMuted, fontWeight: 600 }}>· {doc.sections[activeIndex].title}</Box>
          </span>
          <Box component="span" sx={{ display: "inline-flex", transition: "transform 200ms ease", transform: tocOpen ? "rotate(180deg)" : "none" }}>
            <ChevronDown size={18} aria-hidden />
          </Box>
        </ButtonBase>
        <AnimatePresence initial={false}>
          {tocOpen ? (
            <m.div initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
              <Box sx={{ mt: 1, p: 1, borderRadius: "16px", border: `1px solid ${c.border}`, backgroundColor: c.surface }}>
                <Toc sections={doc.sections} active={active} onPick={go} t={t} />
              </Box>
            </m.div>
          ) : null}
        </AnimatePresence>
      </Box>

      <Box sx={{ mt: { xs: 3, lg: 5 }, display: "grid", gap: { lg: 6 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "240px minmax(0, 1fr)" } }}>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <Box sx={{ position: "sticky", top: `${t.layout.stickyTop + 8}px` }}>
            <Toc sections={doc.sections} active={active} onPick={go} t={t} />
            <Box aria-hidden sx={{ mt: 2, mx: 1.25, height: 4, borderRadius: 2, backgroundColor: c.surfaceInteractive, overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${((activeIndex + 1) / ids.length) * 100}%`, backgroundColor: t.brand.yellow, transition: "width 300ms ease" }} />
            </Box>
          </Box>
        </Box>

        <Box sx={{ minWidth: 0, maxWidth: 780, display: "grid", gap: { xs: 5, md: 6 } }}>
          {doc.sections.map((s, i) => (
            <Box component="section" key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} sx={{ scrollMarginTop: `${t.layout.stickyTop + 16}px` }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
                <Box component="span" aria-hidden sx={{ fontSize: 15, fontWeight: 800, color: c.accentText, fontVariantNumeric: "tabular-nums" }}>{String(i + 1).padStart(2, "0")}</Box>
                <Box component="h2" id={`${s.id}-h`} tabIndex={-1} sx={{ m: 0, fontSize: { xs: 24, sm: 28 }, fontWeight: 850, letterSpacing: "-0.02em", color: c.text, outline: "none" }}>{s.title}</Box>
              </Box>
              {s.intro ? <Box component="p" sx={{ m: 0, mt: 1, fontSize: 16.5, lineHeight: 1.65, color: c.textSecondary }}>{s.intro}</Box> : null}
              <Box sx={{ mt: 2, display: "grid", gap: 2 }}>
                {s.blocks.map((b, k) => <Block key={k} block={b} t={t} />)}
              </Box>
            </Box>
          ))}

          {doc.related ? (
            <Box component="nav" aria-label="Related pages" sx={{ pt: 3, borderTop: `1px solid ${c.border}` }}>
              <Box sx={{ fontSize: 15, fontWeight: 800, color: c.text, mb: 1.25 }}>Related</Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {doc.related.map((r) => (
                  <Box key={r.href} component={Link} href={r.href} sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 40, px: 1.75, borderRadius: 99, border: `1px solid ${c.border}`, backgroundColor: c.surface, color: c.text, fontSize: 14.5, fontWeight: 700, textDecoration: "none", "&:hover": { borderColor: c.action }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
                    {r.label}
                    <ArrowRight size={15} aria-hidden />
                  </Box>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

/** A long-form document page built from content data. */
export default function DocPage({ doc }) {
  return (
    <RideThemeBridge>
      <DocContent doc={doc} />
    </RideThemeBridge>
  );
}
