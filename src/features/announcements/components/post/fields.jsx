"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { SirenRoundedIcon as SirenRounded } from "@solar-icons/react/bold-duotone/siren-rounded";
import { HourglassIcon as Hourglass } from "@solar-icons/react/bold-duotone/hourglass";
import { ShieldCheckIcon as ShieldCheck } from "@solar-icons/react/bold-duotone/shield-check";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { ANNOUNCEMENT_STRINGS } from "../../constants/announcementStrings";
import { LIMITS, POST_TOPICS, PRIORITIES } from "../../utils/postAnnouncement";
import { tagIcon } from "../landing/tagIcons";

// Form pieces shared by the post and manage pages.
const S = ANNOUNCEMENT_STRINGS;
const s = S.post;
const f = s.fields;

export function Counter({ n, max }) {
  const t = useRideTokens();
  const near = n > max * 0.9;
  return <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: near ? t.color.warning : t.color.textMuted }}>{f.count(n, max)}</Box>;
}

/** Topic chips: multi-select, up to LIMITS.topics. */
export function TopicPicker({ value, onChange, error }) {
  const t = useRideTokens();
  const c = t.color;
  const full = value.length >= LIMITS.topics;
  return (
    <Box>
      <Box role="group" aria-label={s.sections.topics} aria-describedby="ap-topics-hint" sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {POST_TOPICS.map((key) => {
          const on = value.includes(key);
          const Icon = tagIcon(key);
          const disabled = !on && full;
          return (
            <ButtonBase
              key={key}
              aria-pressed={on}
              disabled={disabled}
              onClick={() => onChange(on ? value.filter((x) => x !== key) : [...value, key])}
              sx={{ minHeight: 44, px: 1.75, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 14, fontWeight: 720, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, opacity: disabled ? 0.45 : 1, transition: "background-color 160ms ease", "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}
            >
              <Icon size={19} aria-hidden />
              {S.tags[key]}
            </ButtonBase>
          );
        })}
      </Box>
      <Box id="ap-topics-hint" role={error ? "alert" : undefined} sx={{ mt: 1, fontSize: 13, fontWeight: error ? 700 : 500, color: error ? c.danger : c.textMuted }}>
        {error ? s.errors.topics : f.topicsHint(LIMITS.topics)}
      </Box>
    </Box>
  );
}

/** FYI / Normal / Urgent as three choice cards. */
export function PriorityPicker({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.sections.priority} sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
      {PRIORITIES.map((key) => {
        const on = key === value;
        const accent = key === "high" ? c.danger : key === "low" ? c.textSecondary : t.brand.yellowDeep;
        return (
          <ButtonBase
            key={key}
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(key)}
            onKeyDown={(e) => {
              const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
              if (!d) return;
              e.preventDefault();
              onChange(PRIORITIES[(PRIORITIES.indexOf(key) + d + PRIORITIES.length) % PRIORITIES.length]);
            }}
            sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 0.25, p: 1.75, pl: 2.25, textAlign: "left", borderRadius: `${t.radius.md}px`, border: `2px solid ${on ? accent : c.border}`, backgroundColor: c.surface, overflow: "hidden", "&::before": { content: '""', position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: accent, opacity: on ? 1 : 0.35 }, "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 } }}
          >
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontSize: 15.5, fontWeight: 780, color: on ? c.text : c.textSecondary }}>
              {key === "high" ? <SirenRounded size={18} color={c.danger} aria-hidden /> : null}
              {s.priority[key].title}
            </Box>
            <Box sx={{ fontSize: 13, color: c.textMuted }}>{s.priority[key].body}</Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

export function InReviewStamp() {
  const t = useRideTokens();
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
      <Hourglass size={14} aria-hidden />
      {s.mine.inReview}
    </Box>
  );
}


export function LiveStamp() {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", background: `linear-gradient(${c.successSoft}, ${c.successSoft}), ${c.surface}`, color: c.success }}>
      <ShieldCheck size={14} aria-hidden />
      {s.mine.live}
    </Box>
  );
}
