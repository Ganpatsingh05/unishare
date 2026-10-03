"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Skeleton from "@mui/material/Skeleton";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { MagnifierIcon as Magnifier } from "@solar-icons/react/line-duotone/magnifier";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { CONTACT_STRINGS } from "../constants/contactStrings";
import useContacts from "../hooks/useContacts";
import { categoriesIn, KNOWN_CATEGORIES, matchContacts } from "../utils/contactModel";
import OnCallTitle from "./OnCallTitle";
import EmergencyPanel from "./EmergencyPanel";
import ContactCard from "./ContactCard";
import { categoryIcon } from "./contactIcons";

const s = CONTACT_STRINGS;

function CategoryChips({ options, value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.categories.label} sx={{ display: "flex", gap: 0.75, overflowX: "auto", pb: 0.5, mx: -0.5, px: 0.5, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {["all", ...options].map((key) => {
        const on = key === value;
        const Icon = categoryIcon(key);
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(on && key !== "all" ? "all" : key)} sx={{ flex: "0 0 auto", minHeight: 40, px: 1.5, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
            <Icon size={18} aria-hidden />
            {s.categories[key] || key}
          </ButtonBase>
        );
      })}
    </Box>
  );
}

function LandingContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { items, status, reload } = useContacts();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(null);

  const categories = useMemo(() => categoriesIn(items), [items]);
  const results = useMemo(() => matchContacts(items, { category, query }), [items, category, query]);
  // Group by category, in the known order, emergency first.
  const groups = useMemo(() => {
    const order = [...KNOWN_CATEGORIES, ...categories.filter((k) => !KNOWN_CATEGORIES.includes(k))];
    return order.map((key) => ({ key, items: results.filter((r) => r.category === key) })).filter((g) => g.items.length);
  }, [results, categories]);
  const filtered = category !== "all" || query.trim();

  const copy = async (number) => {
    try {
      await navigator.clipboard.writeText(number);
      setCopied(number);
      setTimeout(() => setCopied((cur) => (cur === number ? null : cur)), 1600);
    } catch {
      // Clipboard blocked; the number is still on screen.
    }
  };

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.directory.loading} sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
        {Array.from({ length: 6 }, (_, i) => <Skeleton key={i} variant="rounded" height={200} sx={{ borderRadius: `${t.radius.lg}px` }} />)}
      </Box>
    );
  } else if (status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={reload} retryLabel={s.error.retry} /></Panel>;
  } else if (!results.length) {
    const none = !items.length;
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock title={none ? s.empty.noneTitle : s.empty.title} body={none ? s.empty.noneBody : s.empty.body} action={filtered ? <Button variant="contained" onClick={() => { setCategory("all"); setQuery(""); }} sx={{ minHeight: 44 }}>{s.empty.reset}</Button> : null} />
      </Panel>
    );
  } else {
    body = (
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 3.5, md: 4.5 } }}>
        {groups.map((group) => {
          const Icon = categoryIcon(group.key);
          return (
            <Box component="section" key={group.key} aria-labelledby={`ct-group-${group.key}`}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Icon size={22} color={group.key === "emergency" ? c.danger : c.accentText} aria-hidden />
                <Box component="h3" id={`ct-group-${group.key}`} sx={{ m: 0, fontSize: 18, fontWeight: 800 }}>{s.categories[group.key] || group.key}</Box>
                <Box component="span" sx={{ fontSize: 14, fontWeight: 650, color: c.textMuted }}>{group.items.length}</Box>
              </Box>
              <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
                <AnimatePresence initial={false} mode="popLayout">
                  {group.items.map((contact, i) => (
                    <Box component={m.li} key={contact.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.26, delay: Math.min(i, 5) * 0.04, ease: t.motion.ease } }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
                      <ContactCard contact={contact} copied={copied} onCopy={copy} />
                    </Box>
                  ))}
                </AnimatePresence>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 3, md: 6 }, pb: { xs: 12, md: 9 } }}>
      <Box component="section" aria-labelledby="ct-title" sx={{ display: "grid", gap: { xs: 4, md: 5 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1fr) minmax(0, 1fr)" }, alignItems: "center" }}>
        <Box sx={{ minWidth: 0 }}>
          <OnCallTitle id="ct-title" before={s.hero.titleBefore} accent={s.hero.titleAccent} sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 40, sm: 54, md: 64 }, lineHeight: 1.02, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking, color: c.text }} />
          <Box component="p" sx={{ m: 0, mt: 2, maxWidth: 460, fontSize: 16.5, lineHeight: 1.55, color: c.textSecondary }}>{s.hero.lead}</Box>
        </Box>
        <EmergencyPanel
          items={items}
          status={status}
          onShow={() => {
            setQuery("");
            setCategory("emergency");
            document.getElementById("ct-directory")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
          }}
        />
      </Box>

      <Box component="section" id="ct-directory" aria-labelledby="ct-directory-title" sx={{ mt: { xs: 6, md: 8 }, scrollMarginTop: `${t.layout.stickyTop}px` }}>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 2 }}>
          <Box>
            <Box component="h2" id="ct-directory-title" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>{s.directory.title}</Box>
            <Box aria-live="polite" sx={{ mt: 0.5, fontSize: 14.5, color: c.textSecondary }}>{status === "ready" ? s.directory.count(results.length) : s.directory.loading}</Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: 420 }, display: "flex", alignItems: "center", gap: 1.25, minHeight: 52, px: 1.75, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surface, border: `1px solid ${c.borderStrong}`, transition: "border-color 160ms ease, box-shadow 160ms ease", "&:focus-within": { borderColor: c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` } }}>
            <Magnifier size={22} color={c.accentText} aria-hidden />
            <InputBase value={query} onChange={(e) => setQuery(e.target.value.slice(0, 80))} placeholder={s.directory.searchPlaceholder} inputProps={{ "aria-label": s.directory.searchLabel, type: "search", enterKeyHint: "search" }} sx={{ flex: 1, fontSize: 15.5, fontWeight: 600, color: c.text, "& input::placeholder": { color: c.textMuted, opacity: 1 }, "& input::-webkit-search-cancel-button": { display: "none" } }} />
            {query ? <IconButton onClick={() => setQuery("")} aria-label={s.directory.clear} sx={{ width: 36, height: 36, color: c.textMuted }}><Close size={18} aria-hidden /></IconButton> : null}
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          <CategoryChips options={categories} value={category} onChange={setCategory} />
        </Box>
        {body}
      </Box>
    </Box>
  );
}

/** Contacts page body. The route page renders the footer after it. */
export default function ContactsLanding() {
  return (
    <RideThemeBridge>
      <LandingContent />
    </RideThemeBridge>
  );
}
