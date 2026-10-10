"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { ArrowLink, InfoHero, PrimaryLink, containerSx } from "../shared/infoKit";
import { ALL_FAQS, FAQ_GROUPS, searchFaqs } from "./faqContent";

/** One question that opens to its answer. */
function FaqItem({ item, open, onToggle, groupLabel, t }) {
  const c = t.color;
  const reduce = useReducedMotion();
  const panelId = useId();
  return (
    <Box component="li" id={item.id} sx={{ listStyle: "none", borderTop: `1px solid ${c.border}`, "&:first-of-type": { borderTop: 0 }, scrollMarginTop: `${t.layout.stickyTop + 24}px` }}>
      <Box component="h3" sx={{ m: 0 }}>
        <ButtonBase
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          sx={{ width: "100%", justifyContent: "space-between", gap: 2, textAlign: "left", fontFamily: "inherit", px: { xs: 2, sm: 2.5 }, py: 2, "&:hover": { backgroundColor: c.surfaceInteractive }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: -2 } }}
        >
          <Box sx={{ minWidth: 0 }}>
            {groupLabel ? <Box component="span" sx={{ display: "block", fontSize: 12.5, fontWeight: 700, color: c.textMuted, mb: 0.25 }}>{groupLabel}</Box> : null}
            <Box component="span" sx={{ fontSize: 16.5, fontWeight: 750, color: c.text, lineHeight: 1.35 }}>{item.q}</Box>
          </Box>
          <Box component="span" aria-hidden sx={{ display: "inline-flex", color: open ? c.accentText : c.textMuted, transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>
            <ChevronDown size={20} />
          </Box>
        </ButtonBase>
      </Box>
      <AnimatePresence initial={false}>
        {open ? (
          <m.div id={panelId} initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
            <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.25 }}>
              <Box component="p" sx={{ m: 0, fontSize: 15.5, lineHeight: 1.65, color: c.textSecondary, maxWidth: 640 }}>{item.a}</Box>
              {item.link ? <ArrowLink href={item.link.href} t={t} sx={{ mt: 1 }}>{item.link.label}</ArrowLink> : null}
            </Box>
          </m.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}

function FaqContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(() => new Set());
  const [activeGroup, setActiveGroup] = useState(FAQ_GROUPS[0].key);

  const results = useMemo(() => searchFaqs(query), [query]);
  const searching = query.trim().length > 0;

  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // /info/faqs#cost opens that answer; "/" focuses the search.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (!ALL_FAQS.some((f) => f.id === id)) return;
      setOpen((prev) => new Set(prev).add(id));
      // Wait for the page to settle; the router resets scroll right after load.
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }), 200);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    const onKey = (e) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const el = document.activeElement;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("hashchange", fromHash);
      document.removeEventListener("keydown", onKey);
    };
  }, [reduce]);

  // Highlight the group being read in the side list.
  useEffect(() => {
    if (searching) return undefined;
    const els = FAQ_GROUPS.map((g) => document.getElementById(`group-${g.key}`)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (seen) setActiveGroup(seen.target.id.replace("group-", ""));
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [searching]);

  const goToGroup = (key) => {
    setActiveGroup(key);
    document.getElementById(`group-${key}`)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const groupNavItem = (g, compact) => {
    const on = g.key === activeGroup;
    return (
      <ButtonBase
        key={g.key}
        onClick={() => goToGroup(g.key)}
        aria-current={on ? "true" : undefined}
        sx={
          compact
            ? { minHeight: 36, px: 1.5, borderRadius: 99, fontFamily: "inherit", fontSize: 14, fontWeight: 700, color: c.textSecondary, border: `1px solid ${c.border}`, backgroundColor: c.surface, "&:hover": { color: c.text }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }
            : { width: "100%", justifyContent: "space-between", minHeight: 40, px: 1.5, borderRadius: `${t.radius.sm}px`, fontFamily: "inherit", fontSize: 14.5, fontWeight: on ? 800 : 650, color: on ? c.accentText : c.textSecondary, backgroundColor: on ? c.actionSoft : "transparent", textAlign: "left", "&:hover": { color: c.text }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }
        }
      >
        {g.label}
        {compact ? null : <Box component="span" sx={{ fontSize: 13, fontWeight: 700, color: c.textMuted, fontVariantNumeric: "tabular-nums" }}>{g.items.length}</Box>}
      </ButtonBase>
    );
  };

  return (
    <Box sx={containerSx(t)}>
      <InfoHero eyebrow="FAQs" lead="Questions," accent="answered." intro="Quick answers about how UniShare works. For step-by-step guides, try the help centre." t={t} />

      {/* Search. */}
      <Box role="search" sx={{ mt: 3, maxWidth: 640, display: "flex", alignItems: "center", gap: 1.5, px: 2, minHeight: 56, borderRadius: "18px", border: `1.5px solid ${c.border}`, backgroundColor: c.surface, boxShadow: t.elevation[1], "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 4px ${c.actionSoft}` } }}>
        <Box component="span" aria-hidden sx={{ display: "inline-flex", color: c.textMuted }}>
          <Search size={20} />
        </Box>
        <InputBase
          inputRef={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search questions"
          inputProps={{ "aria-label": "Search questions" }}
          sx={{ flex: 1, fontSize: 16.5, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 } }}
        />
        {searching ? (
          <ButtonBase aria-label="Clear search" onClick={() => (setQuery(""), inputRef.current?.focus())} sx={{ width: 32, height: 32, borderRadius: "50%", color: c.textMuted, "&:hover": { backgroundColor: c.surfaceInteractive, color: c.text }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
            <X size={18} />
          </ButtonBase>
        ) : (
          <Box component="kbd" aria-hidden sx={{ display: { xs: "none", sm: "inline-grid" }, placeItems: "center", minWidth: 24, height: 24, px: 0.75, borderRadius: "6px", border: `1px solid ${c.border}`, fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", color: c.textMuted }}>/</Box>
        )}
      </Box>

      {searching ? (
        <Box sx={{ mt: 4, maxWidth: 760 }}>
          <Box aria-live="polite" sx={{ mb: 1.5, fontSize: 14.5, fontWeight: 700, color: c.textSecondary }}>
            {results.length ? `${results.length} ${results.length === 1 ? "answer" : "answers"}` : "No answers"}
          </Box>
          {results.length ? (
            <Panel radius="xl" sx={{ overflow: "hidden" }}>
              <Box component="ul" sx={{ m: 0, p: 0 }}>
                {results.map((f) => (
                  <FaqItem key={f.id} item={f} open={open.has(f.id)} onToggle={() => toggle(f.id)} groupLabel={f.groupLabel} t={t} />
                ))}
              </Box>
            </Panel>
          ) : (
            <Panel radius="xl">
              <StateBlock title="No questions match that" body="Try fewer words, or look in the help centre for step-by-step guides." />
            </Panel>
          )}
        </Box>
      ) : (
        <>
          {/* Topic chips on small screens. */}
          <Box component="nav" aria-label="Topics" sx={{ mt: 2.5, display: { xs: "flex", md: "none" }, flexWrap: "wrap", gap: 1 }}>
            {FAQ_GROUPS.map((g) => groupNavItem(g, true))}
          </Box>

          <Box sx={{ mt: { xs: 3, md: 5 }, display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "220px minmax(0, 1fr)" }, alignItems: "start" }}>
            <Box component="nav" aria-label="Topics" sx={{ display: { xs: "none", md: "grid" }, gap: 0.5, position: "sticky", top: t.layout.stickyTop + 16 }}>
              <Box sx={{ px: 1.5, mb: 0.5, fontSize: 13, fontWeight: 800, color: c.textMuted }}>Topics</Box>
              {FAQ_GROUPS.map((g) => groupNavItem(g, false))}
            </Box>

            <Box sx={{ display: "grid", gap: { xs: 4, md: 5 }, minWidth: 0 }}>
              {FAQ_GROUPS.map((g) => (
                <Box component="section" key={g.key} id={`group-${g.key}`} aria-labelledby={`group-${g.key}-title`} sx={{ scrollMarginTop: `${t.layout.stickyTop + 16}px` }}>
                  <Box component="h2" id={`group-${g.key}-title`} sx={{ m: 0, mb: 1.5, fontFamily: t.typography.family, fontSize: { xs: 22, sm: 24 }, fontWeight: 850, letterSpacing: "-0.02em", color: c.text }}>{g.label}</Box>
                  <Panel radius="xl" sx={{ overflow: "hidden" }}>
                    <Box component="ul" sx={{ m: 0, p: 0 }}>
                      {g.items.map((f) => (
                        <FaqItem key={f.id} item={f} open={open.has(f.id)} onToggle={() => toggle(f.id)} t={t} />
                      ))}
                    </Box>
                  </Panel>
                </Box>
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Where to go next. */}
      <Panel variant="inset" radius="xl" sx={{ mt: { xs: 6, md: 8 }, p: { xs: 2.5, sm: 3.5 }, display: "flex", flexWrap: "wrap", gap: 2.5, alignItems: "center", justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0, maxWidth: 520 }}>
          <Box component="h2" sx={{ m: 0, fontSize: 20, fontWeight: 850, color: c.text }}>Didn&apos;t find your answer?</Box>
          <Box component="p" sx={{ m: 0, mt: 0.5, fontSize: 15.5, lineHeight: 1.55, color: c.textSecondary }}>The help centre walks through each feature step by step. If something&apos;s broken or wrong, tell us.</Box>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center" }}>
          <PrimaryLink href="/info/help" t={t}>Help centre</PrimaryLink>
          <ArrowLink href="/info/report" t={t}>Report a problem</ArrowLink>
        </Box>
      </Panel>
    </Box>
  );
}

export default function FaqPage() {
  return (
    <RideThemeBridge>
      <FaqContent />
    </RideThemeBridge>
  );
}
