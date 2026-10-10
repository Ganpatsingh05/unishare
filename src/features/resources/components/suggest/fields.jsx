"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { LinkRoundIcon as LinkRound } from "@solar-icons/react/bold-duotone/link-round";
import { HourglassIcon as Hourglass } from "@solar-icons/react/bold-duotone/hourglass";
import { ShieldCheckIcon as ShieldCheck } from "@solar-icons/react/bold-duotone/shield-check";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import { domainOf, RESOURCE_TYPES, safeUrl } from "../../utils/resourceModel";
import { cleanTag, guessType, LIMITS, SUGGEST_CATEGORIES } from "../../utils/suggestResource";
import { categoryIcon, typeIcon } from "../landing/resourceIcons";

// Form pieces shared by the suggest and manage pages.
const S = RESOURCE_STRINGS;
const f = S.suggest.fields;

export function Counter({ n, max }) {
  const t = useRideTokens();
  return <Box component="span" sx={{ fontSize: 12.5, fontWeight: 700, fontVariantNumeric: "tabular-nums", color: n > max * 0.9 ? t.color.warning : t.color.textMuted }}>{f.count(n, max)}</Box>;
}

function ChoiceChips({ label, options, value, onChange, iconFor, labelFor, error, errorText }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box>
      <Box sx={{ mb: 1, fontSize: 14, fontWeight: 760 }}>{label}</Box>
      <Box role="radiogroup" aria-label={label} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {options.map((key) => {
          const on = key === value;
          const Icon = iconFor(key);
          return (
            <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(key)} sx={{ minHeight: 44, px: 1.75, gap: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 14, fontWeight: 720, border: `1px solid ${on ? "transparent" : error ? c.danger : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
              <Icon size={19} aria-hidden />
              {labelFor(key)}
            </ButtonBase>
          );
        })}
      </Box>
      {error ? <Box role="alert" sx={{ mt: 1, fontSize: 13, fontWeight: 700, color: c.danger }}>{errorText}</Box> : null}
    </Box>
  );
}

/** Link field: shows the site it points at; pasting a link guesses the type. */
export function LinkField({ value, onChange, onGuess, error }) {
  const t = useRideTokens();
  const safe = safeUrl(value);
  return (
    <TextField
      label={f.url}
      placeholder={f.urlPlaceholder}
      type="url"
      value={value}
      onChange={(e) => {
        const next = e.target.value.slice(0, LIMITS.url);
        onChange(next);
        const guess = guessType(next);
        if (guess) onGuess(guess);
      }}
      error={Boolean(error)}
      helperText={error || (safe ? f.detected(domainOf(safe)) : f.urlHint)}
      required
      fullWidth
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }}
      slotProps={{ htmlInput: { inputMode: "url", autoComplete: "url" }, input: { startAdornment: <InputAdornment position="start"><LinkRound size={20} color={t.color.textMuted} aria-hidden /></InputAdornment> } }}
    />
  );
}

export function CategoryPicker({ value, onChange, error }) {
  return <ChoiceChips label={f.category} options={SUGGEST_CATEGORIES} value={value} onChange={onChange} iconFor={categoryIcon} labelFor={(k) => S.categories[k]} error={error} errorText={S.suggest.errors.category} />;
}

export function TypePicker({ value, onChange, guessed }) {
  const t = useRideTokens();
  return (
    <Box>
      <ChoiceChips label={f.type} options={RESOURCE_TYPES} value={value} onChange={onChange} iconFor={typeIcon} labelFor={(k) => S.types[k]} />
      {guessed ? <Box sx={{ mt: 1, fontSize: 13, color: t.color.textMuted }}>{f.typeAuto}</Box> : null}
    </Box>
  );
}

/** Tags as chips: type and press Enter or comma; Backspace removes the last. */
export function TagInput({ value, onChange }) {
  const t = useRideTokens();
  const c = t.color;
  const [draft, setDraft] = useState("");
  const full = value.length >= LIMITS.tags;
  const add = (text) => {
    const tag = cleanTag(text);
    if (tag && !value.includes(tag) && !full) onChange([...value, tag]);
    setDraft("");
  };
  return (
    <Box>
      <TextField
        label={f.tags}
        placeholder={full ? "" : f.tagsPlaceholder}
        value={draft}
        disabled={full}
        onChange={(e) => {
          const v = e.target.value;
          if (v.endsWith(",")) add(v.slice(0, -1));
          else setDraft(v.slice(0, LIMITS.tag + 1));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => draft.trim() && add(draft)}
        helperText={f.tagsHint(LIMITS.tags)}
        fullWidth
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }}
      />
      {value.length ? (
        <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 1, p: 0, display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          {value.map((tag) => (
            <Box component="li" key={tag} sx={{ display: "inline-flex", alignItems: "center", gap: 0.25, pl: 1.25, pr: 0.25, borderRadius: `${t.radius.pill}px`, fontSize: 13, fontWeight: 700, backgroundColor: c.surfaceInteractive, color: c.textSecondary }}>
              #{tag}
              <IconButton size="small" onClick={() => onChange(value.filter((x) => x !== tag))} aria-label={f.removeTag(tag)} sx={{ width: 32, height: 32, color: c.textMuted }}>
                <Close size={14} aria-hidden />
              </IconButton>
            </Box>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

export function InReviewStamp() {
  const t = useRideTokens();
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
      <Hourglass size={14} aria-hidden />
      {S.manage.inReview}
    </Box>
  );
}

export function LiveStamp() {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.35, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.1em", textTransform: "uppercase", background: `linear-gradient(${c.successSoft}, ${c.successSoft}), ${c.surface}`, color: c.success }}>
      <ShieldCheck size={14} aria-hidden />
      {S.manage.live}
    </Box>
  );
}
