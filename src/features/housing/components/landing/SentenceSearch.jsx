"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

/** Focuses the field once the picker opens, without scrolling the page to it. */
function useQuietFocus() {
  const ref = useRef(null);
  useEffect(() => {
    const id = requestAnimationFrame(() => ref.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(id);
  }, []);
  return ref;
}
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Popover from "@mui/material/Popover";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m } from "framer-motion";
import { ArrowCounterClockwise, Bed, CalendarBlank, CaretDown, Check, CurrencyInr, MagnifyingGlass } from "@phosphor-icons/react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { formatRupee } from "@features/rides/utils/rideFormat";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import { moveInOptions } from "../../utils/roomModel";
import usePageScrollLock from "../../hooks/usePageScrollLock";

const s = HOUSING_STRINGS.sentence;
const monthFmt = new Intl.DateTimeFormat("en-IN", { month: "short" });
const dayFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const isDate = (v) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);

export const INITIAL_FILTERS = { beds: null, area: null, maxRent: null, moveIn: null };
export const filtersActive = (f) => Boolean(f.beds || f.area || f.maxRent || f.moveIn);

/** A word in the sentence that opens its picker. Set words are highlighted. */
function Token({ value, set, label, onOpen, open, controls }) {
  const t = useRideTokens();
  const accent = t.mode === "dark" ? t.brand.skyBright : t.brand.actionBlue;
  return (
    <ButtonBase
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? controls : undefined}
      aria-label={s.change(label, value)}
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: "0.15em",
        mx: "0.12em",
        px: "0.28em",
        py: "0.02em",
        borderRadius: "0.32em",
        font: "inherit",
        fontWeight: 800,
        lineHeight: "inherit",
        verticalAlign: "baseline",
        color: set ? t.brand.inkNavy : accent,
        backgroundColor: set ? t.brand.yellow : open ? t.color.actionSoft : "transparent",
        boxShadow: set ? "none" : `inset 0 -0.09em 0 ${accent}`,
        transition: "background-color 180ms ease, color 180ms ease",
        "&:hover": { backgroundColor: set ? t.brand.yellow : t.color.actionSoft },
        "&.Mui-focusVisible": { outline: `3px solid ${t.color.focus}`, outlineOffset: 2 },
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span key={value} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }}>
          {value}
        </m.span>
      </AnimatePresence>
      <CaretDown size="0.5em" weight="bold" aria-hidden style={{ alignSelf: "center" }} />
    </ButtonBase>
  );
}

/**
 * Typing row at the top of every picker. Enter (or the tick) applies what was
 * typed; the list underneath stays available for one-tap choices.
 */
function Entry({ icon: Icon, label, type = "text", inputMode, initial = "", clean = (v) => v, onApply, min }) {
  const t = useRideTokens();
  const [text, setText] = useState(initial);
  const inputRef = useQuietFocus();
  return (
    <Box
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(text.trim());
      }}
      sx={{ display: "flex", alignItems: "center", gap: 1, mx: 1, mt: 0.5, mb: 0.5, pl: 1.25, pr: 0.5, minHeight: 46, borderRadius: `${t.radius.sm}px`, backgroundColor: t.color.surfaceInteractive, "&:focus-within": { boxShadow: `0 0 0 2px ${t.color.focus}` } }}
    >
      <Icon size={18} aria-hidden />
      <InputBase
        inputRef={inputRef}
        type={type}
        value={text}
        onChange={(event) => setText(clean(event.target.value))}
        placeholder={label}
        inputProps={{ "aria-label": label, inputMode, min }}
        sx={{ flex: 1, fontSize: 15, fontWeight: 650, colorScheme: t.mode }}
      />
      <ButtonBase
        type="submit"
        aria-label={s.apply}
        disabled={!text.trim()}
        sx={{ width: 36, height: 36, borderRadius: `${t.radius.sm}px`, backgroundColor: text.trim() ? t.brand.yellow : "transparent", color: t.brand.inkNavy, "&.Mui-disabled": { color: t.color.textMuted } }}
      >
        <Check size={16} weight="bold" aria-hidden />
      </ButtonBase>
    </Box>
  );
}

/** A scrollable list of choices inside a picker. */
function Options({ options, value, onPick }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box component="ul" role="listbox" data-scroll sx={{ listStyle: "none", m: 0, p: 0.5, display: "flex", flexDirection: "column", maxHeight: { xs: "none", sm: 264 }, flex: { xs: "1 1 auto", sm: "0 1 auto" }, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain" }}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Box component="li" key={String(option.value)} role="option" aria-selected={selected}>
            <ButtonBase
              onClick={() => onPick(option.value)}
              sx={{
                width: "100%",
                justifyContent: "space-between",
                gap: 2,
                minHeight: 44,
                px: 1.5,
                borderRadius: `${t.radius.sm}px`,
                fontSize: 15,
                fontWeight: selected ? 760 : 600,
                color: c.text,
                backgroundColor: selected ? c.driverSoft : "transparent",
                "&:hover": { backgroundColor: selected ? c.driverSoft : c.surfaceInteractive },
                "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: -2 },
              }}
            >
              <span>{option.label}</span>
              {option.hint ? <Box component="span" sx={{ fontSize: 13, color: c.textMuted, fontWeight: 600 }}>{option.hint}</Box> : null}
              {selected ? <Check size={16} weight="bold" aria-hidden /> : null}
            </ButtonBase>
          </Box>
        );
      })}
    </Box>
  );
}

/** Area: type anything (matched against listing text) or pick a known area. */
function AreaPicker({ value, areas, onPick }) {
  const [text, setText] = useState(value || "");
  const query = text.trim().toLowerCase();
  const suggestions = areas.filter((a) => !query || a.name.toLowerCase().includes(query)).slice(0, 12);
  return (
    <>
      <Box>
        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            onPick(text.trim() || null);
          }}
        >
          <AreaInput text={text} setText={setText} />
        </Box>
      </Box>
      <Options
        value={value}
        onPick={onPick}
        options={[
          { value: null, label: s.areaAny },
          ...(query && !suggestions.some((a) => a.name.toLowerCase() === query) ? [{ value: text.trim(), label: s.areaUse(text.trim()) }] : []),
          ...suggestions.map((a) => ({ value: a.name, label: a.name, hint: String(a.count) })),
        ]}
      />
    </>
  );
}

function AreaInput({ text, setText }) {
  const t = useRideTokens();
  const inputRef = useQuietFocus();
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: 1, mt: 0.5, mb: 0.5, px: 1.25, minHeight: 46, borderRadius: `${t.radius.sm}px`, backgroundColor: t.color.surfaceInteractive, "&:focus-within": { boxShadow: `0 0 0 2px ${t.color.focus}` } }}>
      <MagnifyingGlass size={18} aria-hidden />
      <InputBase inputRef={inputRef} value={text} onChange={(event) => setText(event.target.value.slice(0, 60))} placeholder={s.areaSearch} inputProps={{ "aria-label": s.areaSearch }} sx={{ flex: 1, fontSize: 15, fontWeight: 650 }} />
    </Box>
  );
}

const digits = (max) => (v) => v.replace(/\D/g, "").replace(/^0+/, "").slice(0, max);

/**
 * The search as one sentence: "I need a 1 bed room near Law Gate under
 * ₹8,000 from Nov". Every highlighted word opens a picker where a value can be
 * typed or chosen from the list.
 */
export default function SentenceSearch({ filters, onChange, areas, budgets, matchCount, ready }) {
  const t = useRideTokens();
  const popId = useId();
  const phone = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const body = typeof document === "undefined" ? undefined : document.body;
  const [open, setOpen] = useState({ key: null, anchor: null });
  const close = () => setOpen({ key: null, anchor: null });
  usePageScrollLock(Boolean(open.key));
  const pick = (patch) => {
    onChange({ ...filters, ...patch });
    close();
  };
  // Words on the right half open their dropdown right-aligned, so it never runs off screen.
  const toggle = (key) => (event) => {
    const anchor = event.currentTarget;
    const rect = anchor.getBoundingClientRect();
    const side = rect.left + rect.width / 2 > window.innerWidth / 2 ? "right" : "left";
    setOpen((prev) => (prev.key === key ? { key: null, anchor: null } : { key, anchor, side }));
  };

  // While the pointer is over the dropdown, the wheel scrolls only its list,
  // never the page behind it.
  const paperRef = useCallback((node) => {
    if (!node) return;
    const onWheel = (event) => {
      event.preventDefault();
      const list = node.querySelector("[data-scroll]");
      if (list) list.scrollTop += event.deltaY;
    };
    node.addEventListener("wheel", onWheel, { passive: false });
  }, []);

  const moveIn = moveInOptions();
  const moveLabel = (key) => {
    if (isDate(key)) {
      const [y, mo, d] = key.split("-").map(Number);
      return dayFmt.format(new Date(y, mo - 1, d));
    }
    return key === "now" ? s.moveInNow : monthFmt.format(moveIn.find((o) => o.key === key)?.date || new Date());
  };
  const tokens = {
    beds: filters.beds ? s.beds(filters.beds) : s.bedsAny,
    area: filters.area || s.areaAny,
    budget: filters.maxRent ? formatRupee(filters.maxRent) : s.budgetAny,
    moveIn: filters.moveIn ? moveLabel(filters.moveIn) : s.moveInAny,
  };
  const today = new Date().toISOString().slice(0, 10);

  const panels = {
    beds: (
      <>
        <Entry icon={Bed} label={s.typeBeds} inputMode="numeric" clean={digits(2)} initial={filters.beds && filters.beds !== "4+" ? String(filters.beds) : ""} onApply={(v) => pick({ beds: v ? Number(v) : null })} />
        <Options value={filters.beds} onPick={(beds) => pick({ beds })} options={[{ value: null, label: s.bedsAny }, ...[1, 2, 3].map((n) => ({ value: n, label: s.beds(n) })), { value: "4+", label: s.beds("4+") }]} />
      </>
    ),
    area: <AreaPicker value={filters.area} areas={areas} onPick={(area) => pick({ area })} />,
    budget: (
      <>
        <Entry icon={CurrencyInr} label={s.typeBudget} inputMode="numeric" clean={digits(7)} initial={filters.maxRent ? String(filters.maxRent) : ""} onApply={(v) => pick({ maxRent: v ? Number(v) : null })} />
        <Options value={filters.maxRent} onPick={(maxRent) => pick({ maxRent })} options={[{ value: null, label: s.budgetAny }, ...budgets.map((b) => ({ value: b, label: formatRupee(b) }))]} />
      </>
    ),
    moveIn: (
      <>
        <Entry icon={CalendarBlank} label={s.typeDate} type="date" min={today} initial={isDate(filters.moveIn) ? filters.moveIn : ""} onApply={(v) => pick({ moveIn: v || null })} />
        <Options value={filters.moveIn} onPick={(next) => pick({ moveIn: next })} options={[{ value: null, label: s.moveInAny }, ...moveIn.map((o) => ({ value: o.key, label: o.key === "now" ? s.moveInNow : monthFmt.format(o.date) }))]} />
      </>
    ),
  };

  const pickerBody = open.key ? (
    <Box sx={{ pb: 0.5, display: "flex", flexDirection: "column", minHeight: 0, maxHeight: "inherit" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 0.5, fontSize: 12.5, fontWeight: 760, letterSpacing: "0.06em", textTransform: "uppercase", color: t.color.textMuted }}>{s.pick[open.key]}</Box>
      {panels[open.key]}
    </Box>
  ) : null;
  const word = (key, label) => <Token value={tokens[key]} set={Boolean(key === "budget" ? filters.maxRent : filters[key])} label={label} open={open.key === key} controls={popId} onOpen={toggle(key)} />;

  return (
    <Box component="section" aria-label={s.label}>
      <Box component="p" sx={{ m: 0, fontSize: { xs: 22, sm: 27, md: 30 }, lineHeight: 1.65, fontWeight: 650, letterSpacing: "-0.01em", color: t.color.text }}>
        {s.parts.start} {word("beds", s.pick.beds)} {s.parts.room} {s.parts.near} {word("area", s.pick.area)} {s.parts.under} {word("budget", s.pick.budget)}{" "}
        {s.parts.from} {word("moveIn", s.pick.moveIn)}
      </Box>
      <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
        <Box aria-live="polite" sx={{ fontSize: 15, fontWeight: 760, color: t.color.textSecondary }}>
          {ready ? s.match(matchCount) : " "}
        </Box>
        {filtersActive(filters) ? (
          <Button size="small" onClick={() => onChange(INITIAL_FILTERS)} startIcon={<ArrowCounterClockwise size={15} aria-hidden />} sx={{ minHeight: 36 }}>
            {s.reset}
          </Button>
        ) : null}
      </Box>

      {/* Phones get a bottom sheet; wider screens a dropdown under the word.
          Both render outside the page's 80% zoom so they sit where expected. */}
      {phone ? (
        <SwipeableDrawer
          anchor="bottom"
          open={Boolean(open.key)}
          onClose={close}
          onOpen={() => {}}
          disableSwipeToOpen
          container={body}
          ModalProps={{ keepMounted: false }}
          slotProps={{
            paper: {
              ref: paperRef,
              id: popId,
              role: "dialog",
              "aria-label": open.key ? s.pick[open.key] : undefined,
              sx: { borderTopLeftRadius: `${t.radius.xl}px`, borderTopRightRadius: `${t.radius.xl}px`, maxHeight: "80vh", pb: "calc(12px + env(safe-area-inset-bottom))", backgroundColor: t.color.surface, color: t.color.text },
            },
          }}
        >
          <Box aria-hidden sx={{ width: 40, height: 5, borderRadius: 3, backgroundColor: t.color.borderStrong, mx: "auto", mt: 1.25 }} />
          {pickerBody}
        </SwipeableDrawer>
      ) : (
        <Popover
          id={popId}
          open={Boolean(open.key)}
          anchorEl={open.anchor}
          onClose={close}
          container={body}
          disableAutoFocus
          // The site scales the whole page slightly, which MUI's edge check
          // does not see; a wider margin keeps the dropdown on screen.
          marginThreshold={32}
          anchorOrigin={{ vertical: "bottom", horizontal: open.side || "left" }}
          transformOrigin={{ vertical: "top", horizontal: open.side || "left" }}
          slotProps={{
            paper: {
              ref: paperRef,
              role: "dialog",
              "aria-label": open.key ? s.pick[open.key] : undefined,
              sx: { mt: 1, borderRadius: `${t.radius.lg}px`, width: 300, maxWidth: "calc(100vw - 32px)", maxHeight: "min(440px, calc(85vh - 96px))", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${t.color.border}`, boxShadow: t.elevation[3] || t.elevation[2] },
            },
          }}
        >
          {pickerBody}
        </Popover>
      )}
    </Box>
  );
}
