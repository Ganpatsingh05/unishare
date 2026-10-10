"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, ShieldCheck, UserRound } from "lucide-react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { featureByKey } from "@components/layout/header/navConfig";
import { HELP_TOPICS, searchHelp } from "./helpTopics";

// Icon and colour per topic: features use their own; the rest get one each.
function topicLook(key, t) {
  const dark = t.mode === "dark";
  if (featureByKey[key]) return { Icon: featureByKey[key].icon, ink: featureByKey[key].ink[dark ? 1 : 0] };
  if (key === "start") return { Icon: UserRound, ink: dark ? t.brand.skyBright : t.brand.actionBlue };
  return { Icon: ShieldCheck, ink: dark ? "#6EE7B7" : "#047857" };
}

/** One question that opens to its answer, steps and a link to the right page. */
function Article({ article, open, onToggle, topicLabel, t }) {
  const c = t.color;
  const reduce = useReducedMotion();
  const panelId = useId();
  return (
    <Box component="li" sx={{ listStyle: "none", borderTop: `1px solid ${c.border}`, "&:first-of-type": { borderTop: 0 } }}>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        sx={{ width: "100%", justifyContent: "space-between", gap: 2, textAlign: "left", px: { xs: 2, sm: 2.5 }, py: 2, "&:hover": { backgroundColor: c.surfaceInteractive }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: -2 } }}
      >
        <Box sx={{ minWidth: 0 }}>
          {topicLabel ? <Box sx={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted, mb: 0.25 }}>{topicLabel}</Box> : null}
          <Box component="span" sx={{ fontSize: 16, fontWeight: 750, color: c.text, lineHeight: 1.35 }}>{article.q}</Box>
        </Box>
        <Box component="span" aria-hidden sx={{ display: "inline-flex", color: c.textMuted, transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>
          <ChevronDown size={20} />
        </Box>
      </ButtonBase>
      <AnimatePresence initial={false}>
        {open ? (
          <m.div id={panelId} initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
            <Box sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5 }}>
              <Box component="p" sx={{ m: 0, fontSize: 15.5, lineHeight: 1.65, color: c.textSecondary, maxWidth: 680 }}>{article.a}</Box>
              {article.steps ? (
                <Box component="ol" sx={{ m: 0, mt: 1.5, p: 0, listStyle: "none", display: "grid", gap: 1, counterReset: "step" }}>
                  {article.steps.map((step) => (
                    <Box component="li" key={step} sx={{ display: "flex", gap: 1.25, alignItems: "baseline", fontSize: 15, color: c.text, counterIncrement: "step", "&::before": { content: "counter(step)", flexShrink: 0, display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: "50%", fontSize: 12, fontWeight: 800, backgroundColor: c.actionSoft, color: c.accentText, transform: "translateY(-1px)" } }}>
                      {step}
                    </Box>
                  ))}
                </Box>
              ) : null}
              {article.link ? (
                <Box
                  component={Link}
                  href={article.link.href}
                  sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 0.75, minHeight: 40, px: 2, borderRadius: 99, fontSize: 14.5, fontWeight: 750, textDecoration: "none", backgroundColor: c.action, color: c.onAction, "&:hover .go": { transform: "translateX(3px)" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
                >
                  {article.link.label}
                  <Box component="span" className="go" sx={{ display: "inline-flex", transition: "transform 150ms ease" }}>
                    <ArrowRight size={16} aria-hidden />
                  </Box>
                </Box>
              ) : null}
            </Box>
          </m.div>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}

function HelpContent() {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState(HELP_TOPICS[0].key);
  const [open, setOpen] = useState(null);

  // Deep links: /info/help#rides opens that topic.
  useEffect(() => {
    const fromHash = () => {
      const k = window.location.hash.slice(1);
      if (HELP_TOPICS.some((x) => x.key === k)) setTopic(k);
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
  }, []);

  const results = useMemo(() => searchHelp(query), [query]);
  const searching = query.trim().length > 0;
  const current = HELP_TOPICS.find((x) => x.key === topic);

  const pickTopic = (k) => {
    setTopic(k);
    setOpen(null);
    history.replaceState(null, "", `#${k}`);
    requestAnimationFrame(() => listRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }));
  };

  const accentSx = dark ? { color: t.brand.yellow } : { color: t.brand.yellow, WebkitTextStroke: `0.06em ${t.brand.inkNavy}`, paintOrder: "stroke fill" };
  const container = { width: "100%", maxWidth: 1040, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 14, md: 9 } };

  return (
    <Box sx={container}>
      <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54 }, lineHeight: 1.04, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
        <Box component="span" sx={{ color: dark ? t.brand.skyBright : t.brand.actionBlue }}>How can we</Box> <Box component="span" sx={accentSx}>help?</Box>
      </Box>
      <Box component="p" sx={{ m: 0, mt: 1.25, maxWidth: 560, fontSize: 17, lineHeight: 1.55, color: c.textSecondary }}>
        Short answers about rides, rooms, the marketplace and the rest of UniShare, with a link to the right page.
      </Box>

      {/* Search. */}
      <Box sx={{ mt: 3, maxWidth: 640, display: "flex", alignItems: "center", gap: 1.5, px: 2, minHeight: 58, borderRadius: "18px", border: `1.5px solid ${c.border}`, backgroundColor: c.surface, boxShadow: t.elevation[1], "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 4px ${c.actionSoft}` } }}>
        <Box component="span" aria-hidden sx={{ display: "inline-flex", color: c.textMuted }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </Box>
        <InputBase
          inputRef={inputRef}
          value={query}
          onChange={(e) => (setQuery(e.target.value), setOpen(null))}
          placeholder="Search help, like “cancel a request”"
          inputProps={{ "aria-label": "Search help" }}
          sx={{ flex: 1, fontSize: 16.5, color: c.text }}
        />
        {query ? (
          <ButtonBase onClick={() => setQuery("")} sx={{ px: 1.25, height: 32, borderRadius: 99, fontSize: 13.5, fontWeight: 700, color: c.textSecondary, "&:hover": { backgroundColor: c.surfaceInteractive }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}` } }}>
            Clear
          </ButtonBase>
        ) : (
          <Box component="kbd" sx={{ px: 0.75, borderRadius: "6px", border: `1px solid ${c.border}`, fontSize: 12, color: c.textMuted, fontFamily: "inherit" }}>/</Box>
        )}
      </Box>

      {searching ? (
        <Box component="section" aria-label="Search results" sx={{ mt: 3 }}>
          <Box role="status" sx={{ fontSize: 14, color: c.textMuted, mb: 1.25 }}>
            {results.length ? `${results.length} answer${results.length === 1 ? "" : "s"} for “${query.trim()}”` : ""}
          </Box>
          {results.length ? (
            <Panel radius="xl" sx={{ overflow: "hidden" }}>
              <Box component="ul" sx={{ m: 0, p: 0 }}>
                {results.map((a) => (
                  <Article key={a.id} article={a} topicLabel={a.topicLabel} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} t={t} />
                ))}
              </Box>
            </Panel>
          ) : (
            <Panel radius="xl">
              <StateBlock title="No answers match that" body="Try fewer words, or pick a topic below. You can also ask us directly." />
            </Panel>
          )}
        </Box>
      ) : null}

      {/* Topics. */}
      <Box component="section" aria-labelledby="help-topics" sx={{ mt: { xs: 4, md: 5 } }}>
        <Box component="h2" id="help-topics" sx={{ m: 0, fontSize: 20, fontWeight: 800, color: c.text }}>Browse by topic</Box>
        <Box component="ul" sx={{ m: 0, mt: 1.5, p: 0, listStyle: "none", display: "grid", gap: 1.25, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" } }}>
          {HELP_TOPICS.map((tp) => {
            const { Icon, ink } = topicLook(tp.key, t);
            const on = !searching && tp.key === topic;
            return (
              <li key={tp.key}>
                <ButtonBase
                  onClick={() => (setQuery(""), pickTopic(tp.key))}
                  aria-pressed={on}
                  sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 1, p: 2, borderRadius: "18px", textAlign: "left", border: `1.5px solid ${on ? ink : c.border}`, backgroundColor: on ? `${ink}${dark ? "1F" : "12"}` : c.surface, transition: "border-color 150ms ease, transform 150ms ease", "&:hover": { borderColor: ink, transform: "translateY(-2px)" }, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
                >
                  <Box component="span" sx={{ display: "grid", placeItems: "center", width: 40, height: 40, borderRadius: "12px", color: ink, backgroundColor: `${ink}${dark ? "29" : "1A"}` }}>
                    <Icon size={20} aria-hidden />
                  </Box>
                  <Box component="span" sx={{ fontSize: 15.5, fontWeight: 800, color: c.text, lineHeight: 1.25 }}>{tp.label}</Box>
                  <Box component="span" sx={{ fontSize: 13, color: c.textMuted, lineHeight: 1.4 }}>{tp.blurb}</Box>
                </ButtonBase>
              </li>
            );
          })}
        </Box>
      </Box>

      {/* The chosen topic's questions. */}
      {!searching && current ? (
        <Box component="section" ref={listRef} aria-labelledby="help-current" sx={{ mt: 3, scrollMarginTop: 96 }}>
          <Box component="h2" id="help-current" sx={{ m: 0, mb: 1.25, fontSize: 20, fontWeight: 800, color: c.text }}>{current.label}</Box>
          <Panel radius="xl" sx={{ overflow: "hidden" }}>
            <Box component="ul" sx={{ m: 0, p: 0 }}>
              {current.articles.map((a) => (
                <Article key={a.id} article={a} open={open === a.id} onToggle={() => setOpen(open === a.id ? null : a.id)} t={t} />
              ))}
            </Box>
          </Panel>
        </Box>
      ) : null}

      {/* Still stuck. */}
      <Box component="section" aria-labelledby="help-more" sx={{ mt: { xs: 5, md: 6 }, p: { xs: 2.5, sm: 3.5 }, borderRadius: "24px", color: "#fff", background: `linear-gradient(135deg, ${t.brand.inkNavy}, ${t.brand.deepBlue})` }}>
        <Box component="h2" id="help-more" sx={{ m: 0, fontSize: { xs: 24, sm: 28 }, fontWeight: 850, letterSpacing: "-0.02em" }}>Still stuck?</Box>
        <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 15.5, color: "rgba(255,255,255,0.82)", maxWidth: 520 }}>Tell us what's going on. Messages go straight to the UniShare team.</Box>
        <Box sx={{ mt: 2.5, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" } }}>
          {[
            { label: "Send feedback", sub: "Ideas, questions or something confusing", href: "/info/feedback" },
            { label: "Report a problem", sub: "A bug, a bad post or someone breaking the rules", href: "/info/report" },
            { label: "Read the FAQs", sub: "Longer answers about how UniShare works", href: "/info/faqs" },
          ].map((x) => (
            <Box
              key={x.href}
              component={Link}
              href={x.href}
              sx={{ display: "block", p: 2, borderRadius: "16px", textDecoration: "none", color: "#fff", backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", transition: "background-color 150ms ease", "&:hover": { backgroundColor: "rgba(255,255,255,0.14)" }, "&:hover .go": { transform: "translateX(3px)" }, "&:focus-visible": { outline: `2px solid ${t.brand.yellow}`, outlineOffset: 2 } }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, fontSize: 16, fontWeight: 800 }}>
                {x.label}
                <Box component="span" className="go" sx={{ display: "inline-flex", color: t.brand.yellow, transition: "transform 150ms ease" }}>
                  <ArrowRight size={18} aria-hidden />
                </Box>
              </Box>
              <Box sx={{ mt: 0.5, fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.45 }}>{x.sub}</Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/** The help centre. */
export default function HelpCenter() {
  return (
    <RideThemeBridge>
      <HelpContent />
    </RideThemeBridge>
  );
}
