"use client";

import { useEffect, useId, useMemo, useState } from "react";
import AutoComplete from "antd/es/auto-complete";
import Input from "antd/es/input";
import Box from "@mui/material/Box";
import { GlobeHemisphereEast, MapPin, Path, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { buildPlaceSuggestions } from "../../../utils/placeSuggestions";
import { rememberPlace, suggestPlaces } from "../../../utils/geo";

const MAP_SEARCH_DELAY_MS = 300;

const PLACE_MAX_LENGTH = 120;

const clampLines = (lines) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  wordBreak: "break-word",
});

/** Origin ring (rider) or destination diamond (driver), matching RouteLine stops. */
export function StopGlyph({ kind, size = 14 }) {
  const t = useRideTokens();
  if (kind === "origin") {
    return (
      <Box
        component="span"
        aria-hidden
        sx={{
          display: "block",
          flexShrink: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          border: `3px solid ${t.color.rider}`,
          backgroundColor: t.color.surface,
        }}
      />
    );
  }
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "block",
        flexShrink: 0,
        width: size - 2,
        height: size - 2,
        m: "1px",
        borderRadius: "3px",
        transform: "rotate(45deg)",
        backgroundColor: t.color.driver,
        boxShadow: `0 0 0 2px ${t.color.surface}, 0 0 0 3px ${t.color.driverEdge}`,
      }}
    />
  );
}

/** Inline validation message, paired with an icon so it never relies on colour. */
export function FieldError({ id, children }) {
  const t = useRideTokens();
  if (!children) return null;
  return (
    <Box
      id={id}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 0.75,
        mt: 0.5,
        fontSize: 12.5,
        fontWeight: 600,
        lineHeight: 1.4,
        color: t.color.danger,
      }}
    >
      <Box component="span" sx={{ display: "inline-flex", mt: "1px", flexShrink: 0 }}>
        <WarningCircle size={15} weight="fill" aria-hidden />
      </Box>
      <span>{children}</span>
    </Box>
  );
}

/**
 * One cell of the hero form: a leading glyph column, a label above the
 * control and an inline error. Borderless; hover tints the cell and focus
 * inside draws an inset ring (the parent group clips overflow).
 * @param {"down"|"up"|undefined} connector dashed rail from the glyph toward the sibling stop (>= 900px only)
 * @param {"center"|"start"} align vertical placement of label and control; "start" keeps labels on one line across a row of cells
 */
export function FieldSegment({ label, htmlFor, leading, connector, error, errorId, children, sx, align = "center" }) {
  const t = useRideTokens();
  // The spacer always takes its share of the column so the glyph stays centred;
  // only the dashed border is breakpoint-dependent.
  const rail = {
    flex: 1,
    width: 0,
    borderInlineStart: { xs: "none", md: `2px dashed ${t.color.borderStrong}` },
  };
  return (
    <Box
      sx={[
        {
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          gap: 1.5,
          minWidth: 0,
          minHeight: t.layout.controlHeightLg + 8,
          px: 1.75,
          py: 1,
          backgroundColor: t.color.surface,
          transition: `background-color ${t.motion.duration.fast}s`,
          "@media (hover: hover)": {
            "&:hover": {
              backgroundColor: t.color.surfaceInteractive,
              // Muted placeholder text fails AA on the inset tint.
              "& input::placeholder, & .ant-select-selection-placeholder": { color: t.color.textOnInset },
            },
          },
        },
        error ? { boxShadow: `inset 0 0 0 1.5px ${t.color.danger}` } : null,
        { "&:focus-within": { boxShadow: `inset 0 0 0 2px ${t.color.focus}` } },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {leading ? (
        <Box
          aria-hidden
          sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 20, flexShrink: 0, my: -1 }}
        >
          <Box sx={connector === "up" ? { ...rail, mb: { md: 0.5 } } : { flex: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: 20 }}>{leading}</Box>
          <Box sx={connector === "down" ? { ...rail, mt: { md: 0.5 } } : { flex: 1 }} />
        </Box>
      ) : null}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: align === "start" ? "flex-start" : "center",
        }}
      >
        <Box
          component="label"
          htmlFor={htmlFor}
          sx={{ display: "block", fontSize: 12.5, fontWeight: 650, lineHeight: 1.4, color: t.color.textSecondary }}
        >
          {label}
        </Box>
        {children}
        <FieldError id={errorId}>{error}</FieldError>
      </Box>
    </Box>
  );
}

function SuggestionRow({ item, groupKey, t }) {
  const Icon = groupKey === "popular" ? MapPin : groupKey === "map" ? GlobeHemisphereEast : Path;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0, width: "100%", py: 0.25 }}>
      <Box
        component="span"
        sx={{ display: "inline-flex", flexShrink: 0, color: groupKey === "popular" ? t.color.textMuted : t.color.accentText }}
      >
        <Icon size={18} weight="regular" aria-hidden />
      </Box>
      <Box
        component="span"
        sx={{ ...clampLines(2), flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, lineHeight: 1.35, color: t.color.text }}
      >
        {item.value}
      </Box>
      {item.hint ? (
        <Box
          component="span"
          sx={{
            flexShrink: 0,
            maxWidth: "40%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: 12.5,
            // Rows sit on the inset tint when hovered or highlighted.
            color: t.color.textOnInset,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {item.hint}
        </Box>
      ) : null}
    </Box>
  );
}

function GroupTitle({ title, t }) {
  return (
    <Box
      component="span"
      sx={{
        ...clampLines(1),
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: t.typography.eyebrowTracking,
        textTransform: "uppercase",
        color: t.color.textMuted,
      }}
    >
      {title}
    </Box>
  );
}

/** Map search results for the typed text, debounced. */
function useMapSuggestions(query) {
  const [state, setState] = useState({ query: "", items: [] });
  useEffect(() => {
    const value = query.trim();
    if (value.length < 3) return undefined;
    const controller = new AbortController();
    const timer = setTimeout(() => {
      suggestPlaces(value, controller.signal)
        .then((places) => {
          const items = places.map((place) => {
            const text = place.detail ? `${place.label}, ${place.detail.split(",")[0]}` : place.label;
            rememberPlace(text, place);
            return { value: text, hint: place.detail, count: 0 };
          });
          setState({ query: value, items });
        })
        .catch(() => setState({ query: value, items: [] }));
    }, MAP_SEARCH_DELAY_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);
  return state.query === query.trim() ? state.items : [];
}

function usePlaceGroups({ query, field, otherValue, rides }) {
  const mapItems = useMapSuggestions(query);
  return useMemo(() => {
    const groups = buildPlaceSuggestions({ query, field, otherValue, rides });
    const seen = new Set(groups.flatMap((group) => group.items.map((item) => item.value.toLowerCase())));
    const extra = mapItems.filter((item) => !seen.has(item.value.toLowerCase()) && item.value.toLowerCase() !== otherValue.trim().toLowerCase());
    return extra.length ? [...groups, { key: "map", title: RIDE_STRINGS.hero.suggestionsMap, items: extra }] : groups;
  }, [query, field, otherValue, rides, mapItems]);
}

/**
 * Desktop and tablet place input: Ant AutoComplete with grouped, route-aware
 * suggestions. Typed text is always a valid value; Enter with no highlighted
 * option submits the surrounding form.
 */
export default function PlaceField({ field, value, onChange, otherValue, rides, error, id, connector }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const label = field === "from" ? s.from : s.to;
  const errorId = `${id}-error`;
  const groups = usePlaceGroups({ query: value, field, otherValue, rides });

  const options = useMemo(
    () =>
      groups.map((group) => ({
        key: group.key,
        title: group.title,
        label: <GroupTitle title={group.title} t={t} />,
        options: group.items.map((item) => ({
          value: item.value,
          label: <SuggestionRow item={item} groupKey={group.key} t={t} />,
        })),
      })),
    [groups, t]
  );

  return (
    <FieldSegment
      label={label}
      htmlFor={id}
      leading={<StopGlyph kind={field === "from" ? "origin" : "destination"} />}
      connector={connector}
      error={error}
      errorId={errorId}
    >
      <AutoComplete
        id={id}
        value={value}
        onChange={(next) => onChange(String(next ?? "").slice(0, PLACE_MAX_LENGTH))}
        options={options}
        variant="borderless"
        showSearch={{ filterOption: false }}
        allowClear={{ clearIcon: <XCircle size={18} weight="fill" aria-label={s.clear} /> }}
        placeholder={field === "from" ? s.fromPlaceholder : s.toPlaceholder}
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        styles={{
          root: { width: "100%", height: 36, paddingInline: 0, fontSize: 16, fontWeight: 600 },
          input: { fontSize: 16, fontWeight: 600 },
          placeholder: { fontWeight: 500, color: t.color.textMuted },
          popup: { root: { minWidth: 300, padding: 6, borderRadius: t.radius.md, boxShadow: t.elevation[3] } },
        }}
      />
    </FieldSegment>
  );
}

/**
 * Mobile sheet body for a place: an input plus suggestions as 56px tappable
 * rows. Arrow keys move through the list; Enter accepts the highlighted
 * option or, with none highlighted, the typed text.
 */
export function PlacePicker({ field, value, onChange, onAccept, otherValue, rides, inputId }) {
  const t = useRideTokens();
  const s = RIDE_STRINGS.hero;
  const listId = useId();
  const [active, setActive] = useState(-1);
  const groups = usePlaceGroups({ query: value, field, otherValue, rides });
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);
  const optionId = (index) => `${listId}-opt-${index}`;
  const label = field === "from" ? s.from : s.to;

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" && flat.length) {
      event.preventDefault();
      setActive((index) => (index + 1) % flat.length);
    } else if (event.key === "ArrowUp" && flat.length) {
      event.preventDefault();
      setActive((index) => (index <= 0 ? flat.length - 1 : index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      onAccept(active >= 0 && flat[active] ? flat[active].value : value);
    }
  };

  const offsets = groups.reduce((acc, group, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + groups[i - 1].items.length);
    return acc;
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
        <StopGlyph kind={field === "from" ? "origin" : "destination"} size={16} />
        <Input
          id={inputId}
          autoFocus
          size="large"
          value={value}
          maxLength={PLACE_MAX_LENGTH}
          onChange={(event) => {
            setActive(-1);
            onChange(event.target.value);
          }}
          onKeyDown={onKeyDown}
          allowClear={{ clearIcon: <XCircle size={18} weight="fill" aria-label={s.clear} /> }}
          placeholder={field === "from" ? s.fromPlaceholder : s.toPlaceholder}
          aria-label={label}
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={flat.length ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          enterKeyHint="done"
          autoComplete="off"
          style={{ height: t.layout.controlHeightLg, fontSize: 16, fontWeight: 600, borderRadius: t.radius.md }}
        />
      </Box>
      {flat.length === 0 ? (
        <Box component="p" sx={{ m: 0, px: 0.5, py: 2, fontSize: 14, lineHeight: 1.5, color: t.color.textMuted }}>
          {RIDE_STRINGS.hero.noSuggestions}
        </Box>
      ) : (
        <Box id={listId} role="listbox" aria-label={RIDE_STRINGS.hero.suggestionsLabel}>
          {groups.map((group, groupIndex) => (
            <Box key={group.key} role="group" aria-label={group.title} sx={{ "& + &": { mt: 1.5 } }}>
              <Box aria-hidden sx={{ px: 1.25, pb: 0.5 }}>
                <GroupTitle title={group.title} t={t} />
              </Box>
              {group.items.map((item, itemIndex) => {
                const index = offsets[groupIndex] + itemIndex;
                const selected = value.trim().toLowerCase() === item.value.toLowerCase();
                return (
                  <Box
                    key={item.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={selected}
                    onClick={() => onAccept(item.value)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      minHeight: t.layout.controlHeightLg,
                      px: 1.25,
                      borderRadius: `${t.radius.sm}px`,
                      cursor: "pointer",
                      backgroundColor: index === active ? t.color.surfaceInteractive : "transparent",
                      boxShadow: selected ? `inset 3px 0 0 ${t.color.action}` : "none",
                      "@media (hover: hover)": { "&:hover": { backgroundColor: t.color.surfaceInteractive } },
                      "&:active": { backgroundColor: t.color.actionSoft },
                    }}
                  >
                    <SuggestionRow item={item} groupKey={group.key} t={t} />
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
