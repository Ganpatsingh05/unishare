"use client";

import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Camera as Camera } from "lucide-react";
import { X as Close } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { validateCampus, validateProfileImage, validateUsername } from "@lib/api/userProfile";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { initialsOf, LIMITS } from "../utils/profileModel";

const s = PROFILE_STRINGS.edit;

/**
 * Field errors for the form; empty when valid.
 *
 * The username rule is the backend's own, so nothing valid is blocked and
 * nothing invalid reaches the request.
 */
function validate(form) {
  const errors = {};
  const username = validateUsername(form.username);
  if (!username.valid) errors.username = username.message;
  const campus = validateCampus(form.campus);
  if (!campus.valid) errors.campus = campus.message;
  if (form.bio.length > LIMITS.bio) errors.bio = `Up to ${LIMITS.bio} characters`;
  return errors;
}

/**
 * Edit the profile in a side sheet (bottom sheet on phones). Every change is
 * reported upward straight away so the pass on the page previews it live.
 *
 * Only what the backend stores is editable: username, campus (universityName),
 * about (bio) and the photo. There is no availability probe — the backend has
 * no such endpoint, and it rejects a taken username with its own message.
 */
export default function EditSheet({ open, profile, form, onForm, photo, onPhoto, onClose, onSave, busy }) {
  const t = useRideTokens();
  const c = t.color;
  const phone = useMediaQuery("(max-width:899.95px)");
  const fileRef = useRef(null);
  const [shown, setShown] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    if (open) {
      setShown(false);
      setPhotoError("");
    }
  }, [open]);

  const errors = validate(form);
  const show = (k) => (shown && errors[k]) || "";
  const set = (k, max) => (e) => onForm({ ...form, [k]: max ? e.target.value.slice(0, max) : e.target.value });
  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };

  const pick = (file) => {
    if (!file) return;
    const check = validateProfileImage(file);
    if (!check.valid) {
      setPhotoError(check.message);
      return;
    }
    setPhotoError("");
    onPhoto({ file, url: URL.createObjectURL(file), remove: false });
  };
  const submit = (e) => {
    e.preventDefault();
    setShown(true);
    if (Object.keys(errors).length) return;
    onSave();
  };

  const preview = photo?.url || profile.photo;

  return (
    <Drawer
      anchor={phone ? "bottom" : "right"}
      open={open}
      onClose={onClose}
      container={typeof document === "undefined" ? undefined : document.body}
      slotProps={{ paper: { sx: { width: { xs: "100%", md: 460 }, maxHeight: { xs: "92dvh", md: "100%" }, borderRadius: { xs: "24px 24px 0 0", md: "24px 0 0 24px" }, backgroundColor: c.surface, backgroundImage: "none" } }, backdrop: { sx: { backgroundColor: "rgba(6,20,45,0.35)" } } }}
    >
      <Box component="form" noValidate onSubmit={submit} aria-labelledby="pe-title" sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 1.5, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Box component="h2" id="pe-title" sx={{ m: 0, fontSize: 22, fontWeight: 820 }}>{s.title}</Box>
            <Box sx={{ mt: 0.25, fontSize: 14, color: c.textMuted }}>{s.lead}</Box>
          </Box>
          <IconButton onClick={onClose} aria-label={s.close} sx={{ width: 44, height: 44, mr: -1 }}><Close size={22} aria-hidden /></IconButton>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto", px: 3, py: 1, display: "flex", flexDirection: "column", gap: 2.25 }}>
          {/* Photo. */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ position: "relative", width: 76, height: 76, borderRadius: "20px", overflow: "hidden", flexShrink: 0, background: "linear-gradient(135deg, #FFD43B, #FF9F1C 55%, #1D6FE0)", display: "grid", placeItems: "center" }}>
              {preview ? <Box component="img" src={preview} alt="" referrerPolicy="no-referrer" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Box component="span" sx={{ fontSize: 28, fontWeight: 900, color: "#0B2147" }}>{initialsOf(form.username)}</Box>}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button variant="outlined" size="small" onClick={() => fileRef.current?.click()} startIcon={<Camera size={18} aria-hidden />} sx={{ minHeight: 40, borderRadius: `${t.radius.pill}px` }}>{s.changePhoto}</Button>
              </Box>
              <Box role={photoError ? "alert" : undefined} sx={{ mt: 0.5, fontSize: 12.5, fontWeight: photoError ? 700 : 500, color: photoError ? c.danger : c.textMuted }}>{photoError || s.photoHint}</Box>
            </Box>
          </Box>

          <TextField
            label={s.username}
            value={form.username}
            onChange={(e) => onForm({ ...form, username: e.target.value.slice(0, LIMITS.username) })}
            error={Boolean(show("username"))}
            helperText={show("username") || s.usernameHint}
            fullWidth
            sx={field}
            slotProps={{ htmlInput: { autoComplete: "username", autoCapitalize: "none", autoCorrect: "off", spellCheck: false } }}
          />
          <TextField label={s.campus} placeholder={s.campusPlaceholder} value={form.campus} onChange={set("campus", LIMITS.campus)} error={Boolean(show("campus"))} helperText={show("campus") || " "} fullWidth sx={field} />
          <TextField label={s.bio} placeholder={s.bioPlaceholder} value={form.bio} onChange={set("bio", LIMITS.bio)} error={Boolean(show("bio"))} helperText={show("bio") || s.count(form.bio.length, LIMITS.bio)} fullWidth multiline minRows={3} sx={field} />
        </Box>

        <Box sx={{ px: 3, py: 2, display: "flex", gap: 1, justifyContent: "flex-end", borderTop: `1px solid ${c.border}` }}>
          <Button onClick={onClose} sx={{ minHeight: 48 }}>{s.cancel}</Button>
          <Button type="submit" variant="contained" disabled={busy} sx={{ minHeight: 48, px: 3.5, borderRadius: `${t.radius.pill}px` }}>{busy ? s.saving : s.save}</Button>
        </Box>
      </Box>
    </Drawer>
  );
}
