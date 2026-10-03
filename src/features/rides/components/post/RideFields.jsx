"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { CarProfile, EnvelopeSimple, InstagramLogo, Minus, Phone, Plus, Sparkle } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { formatRupee } from "../../utils/rideFormat";
import { CONTACT_TYPES, FARE_STEP, cleanFare } from "../../utils/postRide";

const s = RIDE_STRINGS.post;
const CONTACT_ICONS = { mobile: Phone, email: EnvelopeSimple, instagram: InstagramLogo };
const CONTACT_INPUT = {
  mobile: { type: "tel", inputMode: "tel", autoComplete: "tel" },
  email: { type: "email", inputMode: "email", autoComplete: "email" },
  instagram: { type: "text", inputMode: "text", autoComplete: "off" },
};

export const POST_IDS = {
  vehicle: "rs-post-vehicle",
  price: "rs-post-price",
  notes: "rs-post-notes",
  contact: (type) => `rs-post-contact-${type}`,
  contactGroup: "rs-post-contacts",
};

function fieldSx(t) {
  return {
    "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surface, minHeight: 52 },
    "& .MuiFormHelperText-root": { mx: 0.25, fontSize: 13 },
  };
}

/** Car and fare: the vehicle text and a fare stepper with a route-based hint. */
export function RideStep({ form, onChange, errors, typicalFare }) {
  const t = useRideTokens();
  const c = t.color;
  const price = Number(form.price) || 0;
  // Any positive amount, paise included; the steppers move by ₹10 from wherever it is.
  const setPrice = (value) => onChange({ price: value });
  const step = (delta) => {
    const next = Math.max(0, Math.round((price + delta) * 100) / 100);
    setPrice(next ? String(next) : "");
  };
  const seats = Number(form.seats) || 1;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <TextField
        id={POST_IDS.vehicle}
        label={s.vehicle}
        placeholder={s.vehiclePlaceholder}
        value={form.vehicle}
        onChange={(event) => onChange({ vehicle: event.target.value.slice(0, 80) })}
        error={Boolean(errors.vehicle)}
        helperText={errors.vehicle || s.vehicleHint}
        fullWidth
        required
        sx={fieldSx(t)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <CarProfile size={20} weight="duotone" aria-hidden />
              </InputAdornment>
            ),
          },
        }}
      />

      <Box>
        <Box component="label" htmlFor={POST_IDS.price} sx={{ display: "block", fontSize: 14, fontWeight: 700, color: c.textSecondary, mb: 1 }}>
          {s.fare}
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: 1.25,
            borderRadius: `${t.radius.lg}px`,
            border: `1px solid ${errors.price ? c.danger : c.border}`,
            backgroundColor: c.surface,
            "&:focus-within": { borderColor: errors.price ? c.danger : c.action, boxShadow: `0 0 0 3px ${c.actionSoft}` },
          }}
        >
          <IconButton aria-label={s.fareLower} onClick={() => step(-FARE_STEP)} disabled={price <= 0} sx={{ width: 48, height: 48, border: `1px solid ${c.border}` }}>
            <Minus size={20} aria-hidden />
          </IconButton>
          <Box sx={{ flex: 1, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 0.5, minWidth: 0 }}>
            <Box component="span" aria-hidden sx={{ fontSize: 26, fontWeight: 700, color: c.textMuted }}>
              ₹
            </Box>
            <Box
              component="input"
              id={POST_IDS.price}
              inputMode="decimal"
              placeholder="0"
              value={form.price}
              aria-invalid={Boolean(errors.price) || undefined}
              aria-describedby={`${POST_IDS.price}-hint`}
              onChange={(event) => {
                setPrice(cleanFare(event.target.value));
              }}
              sx={{
                width: `${Math.max(2, String(form.price || "0").length) + 0.5}ch`,
                minWidth: 0,
                border: 0,
                outline: 0,
                background: "transparent",
                color: c.text,
                font: "inherit",
                fontSize: 40,
                fontWeight: 760,
                letterSpacing: "-0.03em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
              }}
            />
          </Box>
          <IconButton aria-label={s.fareRaise} onClick={() => step(FARE_STEP)} sx={{ width: 48, height: 48, border: `1px solid ${c.border}` }}>
            <Plus size={20} aria-hidden />
          </IconButton>
        </Box>
        <Box id={`${POST_IDS.price}-hint`} sx={{ mt: 1, fontSize: 13, color: errors.price ? c.danger : c.textMuted, fontWeight: errors.price ? 600 : 500 }}>
          {errors.price || (price > 0 ? s.fareEarn(formatRupee(price * seats), seats) : s.fareHint)}
        </Box>
        {typicalFare ? (
          <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", p: 1.25, borderRadius: `${t.radius.md}px`, backgroundColor: c.driverSoft }}>
            <Sparkle size={18} weight="fill" aria-hidden color={t.mode === "dark" ? c.driver : t.brand.yellowDeep} />
            <Box sx={{ flex: 1, minWidth: 160, fontSize: 13.5, fontWeight: 600, color: t.mode === "dark" ? c.text : t.brand.inkNavy }}>
              {s.fareTypical(formatRupee(typicalFare))}
            </Box>
            {price !== typicalFare ? (
              <ButtonBase
                onClick={() => setPrice(String(typicalFare))}
                sx={{
                  minHeight: 36,
                  px: 1.5,
                  borderRadius: `${t.radius.pill}px`,
                  backgroundColor: c.highlight,
                  color: c.onHighlight,
                  fontSize: 13.5,
                  fontWeight: 700,
                  "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 },
                }}
              >
                {s.fareMatch(formatRupee(typicalFare))}
              </ButtonBase>
            ) : null}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}

/** Contact methods (at least one) and optional notes for riders. */
export function ContactStep({ form, onChange, errors }) {
  const t = useRideTokens();
  const c = t.color;
  const setContact = (type, value) => onChange({ contacts: { ...form.contacts, [type]: value } });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box component="fieldset" aria-describedby={`${POST_IDS.contactGroup}-hint`} sx={{ border: 0, m: 0, p: 0, minWidth: 0 }}>
        <Box component="legend" sx={{ p: 0, fontSize: 14, fontWeight: 700, color: c.textSecondary }}>
          {s.contact}
        </Box>
        <Box id={`${POST_IDS.contactGroup}-hint`} sx={{ fontSize: 13, color: errors.contacts ? c.danger : c.textMuted, fontWeight: errors.contacts ? 600 : 500, mt: 0.25, mb: 1.5 }}>
          {errors.contacts || s.contactHint}
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {CONTACT_TYPES.map((type) => {
            const Icon = CONTACT_ICONS[type];
            const filled = Boolean((form.contacts[type] || "").trim());
            return (
              <TextField
                key={type}
                id={POST_IDS.contact(type)}
                label={s.contactTypes[type]}
                placeholder={s.contactPlaceholders[type]}
                value={form.contacts[type]}
                onChange={(event) => setContact(type, event.target.value.slice(0, 120))}
                error={Boolean(errors[type])}
                helperText={errors[type] || undefined}
                fullWidth
                sx={fieldSx(t)}
                slotProps={{
                  htmlInput: CONTACT_INPUT[type],
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          component="span"
                          sx={{
                            display: "grid",
                            placeItems: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: filled ? c.actionSoftStrong : c.surfaceInteractive,
                            color: filled ? c.accentText : c.textOnInset,
                            transition: "background-color 160ms ease, color 160ms ease",
                          }}
                        >
                          <Icon size={17} weight={filled ? "fill" : "regular"} aria-hidden />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      <TextField
        id={POST_IDS.notes}
        label={`${s.notes} (${s.notesOptional})`}
        placeholder={s.notesPlaceholder}
        value={form.description}
        onChange={(event) => onChange({ description: event.target.value.slice(0, 500) })}
        helperText={`${form.description.length}/500`}
        multiline
        minRows={3}
        fullWidth
        sx={fieldSx(t)}
      />
    </Box>
  );
}
