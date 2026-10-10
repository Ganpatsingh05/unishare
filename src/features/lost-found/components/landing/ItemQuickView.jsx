"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import { CloseIcon as Close } from "@solar-icons/react/linear/close";
import InstagramLogo from "@components/ui/icons/InstagramIcon";
import { CalendarIcon as Calendar } from "@solar-icons/react/bold-duotone/calendar";
import { LetterIcon as Letter } from "@solar-icons/react/bold-duotone/letter";
import { MapPointIcon as MapPoint } from "@solar-icons/react/bold-duotone/map-point";
import { PhoneIcon as Phone } from "@solar-icons/react/bold-duotone/phone";
import { VerifiedCheckIcon as VerifiedCheck } from "@solar-icons/react/bold-duotone/verified-check";
import { ShieldCheckIcon as ShieldCheck } from "@solar-icons/react/bold-duotone/shield-check";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import { DangerCircleIcon as DangerCircle } from "@solar-icons/react/bold-duotone/danger-circle";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { useAuth } from "@contexts/UniShareContext";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";
import { CATEGORY_ICONS } from "./categoryIcons";
import { whenText } from "./ItemCard";
import ClaimForm from "./ClaimForm";

const s = LOST_FOUND_STRINGS.view;
const dateFmt = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "long" });

function contactLinks(contact) {
  const list = [];
  const phone = contact.mobile || contact.phone;
  if (phone) list.push({ icon: Phone, text: phone, href: `tel:${String(phone).replace(/\s/g, "")}` });
  if (contact.email) list.push({ icon: Letter, text: contact.email, href: `mailto:${contact.email}` });
  if (contact.instagram) {
    const handle = String(contact.instagram).replace(/^@/, "");
    list.push({ icon: InstagramLogo, text: `@${handle}`, href: `https://instagram.com/${handle}` });
  }
  return list;
}

/** Details for one post in a sheet: photos, where and when, notes and contact. */
export default function ItemQuickView({ item, open, onClose }) {
  const t = useRideTokens();
  const c = t.color;
  const { isAuthenticated } = useAuth();
  const [photo, setPhoto] = useState(0);
  useEffect(() => setPhoto(0), [item?.id]);
  if (!item) return null;

  const lost = item.mode === "lost";
  const accent = lost ? c.danger : c.success;
  const soft = lost ? c.dangerSoft : c.successSoft;
  const Icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS.other;
  const links = contactLinks(item.contact);
  const loginHref = `/login?redirect=${encodeURIComponent(typeof window === "undefined" ? "/lost-found" : window.location.pathname)}`;
  const fact = (FactIcon, label, value) => (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
      <Box aria-hidden sx={{ flexShrink: 0, display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: `${t.radius.sm}px`, backgroundColor: c.surfaceInteractive, color: c.textOnInset }}>
        <FactIcon size={19} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted }}>{label}</Box>
        <Box sx={{ fontSize: 15, fontWeight: 700, overflowWrap: "anywhere" }}>{value}</Box>
      </Box>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      container={typeof document === "undefined" ? undefined : document.body}
      aria-labelledby="lf-view-title"
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { m: { xs: 1.5, sm: 4 }, width: { xs: "calc(100% - 24px)", sm: undefined }, borderRadius: `${t.radius.xl}px`, backgroundColor: c.surface, backgroundImage: "none", overflow: "hidden" } } }}
    >
      <Box sx={{ position: "relative" }}>
        <Box sx={{ aspectRatio: "16 / 10", backgroundColor: soft, display: "grid", placeItems: "center", overflow: "hidden" }}>
          {item.images.length ? (
            <Box component="img" src={item.images[photo]} alt={s.photo(photo + 1, item.images.length)} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <Icon size={84} color={accent} aria-hidden />
          )}
        </Box>
        <IconButton onClick={onClose} aria-label={s.close} sx={{ position: "absolute", top: 12, right: 12, width: 44, height: 44, backgroundColor: "rgba(8,18,32,0.6)", color: "#fff", "&:hover": { backgroundColor: "rgba(8,18,32,0.8)" } }}>
          <Close size={22} aria-hidden />
        </IconButton>
        {item.images.length > 1 ? (
          <Box sx={{ position: "absolute", left: 12, bottom: 12, display: "flex", gap: 0.75 }}>
            {item.images.map((src, i) => (
              <ButtonBase key={src} onClick={() => setPhoto(i)} aria-label={s.photo(i + 1, item.images.length)} aria-current={i === photo} sx={{ width: 48, height: 40, borderRadius: `${t.radius.sm}px`, overflow: "hidden", outline: i === photo ? `3px solid ${t.brand.yellow}` : "2px solid rgba(255,255,255,0.7)", outlineOffset: -2, "&.Mui-focusVisible": { outline: `3px solid ${c.focus}` } }}>
                <Box component="img" src={src} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </ButtonBase>
            ))}
          </Box>
        ) : null}
      </Box>

      <Box sx={{ p: { xs: 2.25, sm: 3 }, display: "flex", flexDirection: "column", gap: 2.25, maxHeight: "60vh", overflowY: "auto" }}>
        <Box>
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1.1, py: 0.4, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 850, letterSpacing: "0.12em", textTransform: "uppercase", background: `linear-gradient(${soft}, ${soft}), ${c.surface}`, color: accent }}>
            {lost ? <DangerCircle size={16} aria-hidden /> : <VerifiedCheck size={16} aria-hidden />}
            {lost ? LOST_FOUND_STRINGS.card.lost : LOST_FOUND_STRINGS.card.found}
          </Box>
          <Box component="h2" id="lf-view-title" sx={{ m: 0, mt: 1, fontSize: { xs: 22, sm: 26 }, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em", overflowWrap: "anywhere" }}>{item.name}</Box>
          <Box sx={{ mt: 0.5, fontSize: 13.5, color: c.textMuted }}>{s.posted(item.poster || s.anonymous, whenText(item))}</Box>
        </Box>

        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
          {fact(MapPoint, s.where[item.mode], item.place || LOST_FOUND_STRINGS.card.noPlace)}
          {fact(Calendar, s.when[item.mode], item.date ? `${dateFmt.format(item.date)}${item.time ? `, ${item.time}` : ""}` : LOST_FOUND_STRINGS.when.unknown)}
        </Box>

        <Box>
          <Box component="h3" sx={{ m: 0, mb: 0.5, fontSize: 15, fontWeight: 760 }}>{s.about}</Box>
          <Box sx={{ fontSize: 15, lineHeight: 1.6, color: item.description ? c.textSecondary : c.textMuted, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{item.description || s.noDescription}</Box>
        </Box>

        {links.length ? (
          <Box>
            <Box component="h3" sx={{ m: 0, mb: 1, fontSize: 15, fontWeight: 760 }}>{s.contact}</Box>
            {isAuthenticated ? (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {links.map(({ icon: LinkIcon, text, href }) => (
                  <Button key={href} component="a" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" variant="outlined" startIcon={<LinkIcon size={19} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, textTransform: "none" }}>
                    {text}
                  </Button>
                ))}
              </Box>
            ) : (
              <Button component={Link} href={loginHref} variant="outlined" startIcon={<Login2 size={19} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.contactSignIn}</Button>
            )}
          </Box>
        ) : null}

        <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: c.surfaceInteractive, fontSize: 13.5, lineHeight: 1.5, color: c.textSecondary }}>
          <ShieldCheck size={22} color={c.accentText} aria-hidden style={{ flexShrink: 0 }} />
          {s.proof}
        </Box>

        <ClaimForm item={item} />
      </Box>
    </Dialog>
  );
}
