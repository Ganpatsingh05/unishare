"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { PhoneIcon as Phone } from "@solar-icons/react/bold-duotone/phone";
import { LetterIcon as Letter } from "@solar-icons/react/bold-duotone/letter";
import { MapPointIcon as MapPoint } from "@solar-icons/react/bold-duotone/map-point";
import { ClockCircleIcon as ClockCircle } from "@solar-icons/react/bold-duotone/clock-circle";
import { CopyIcon as Copy } from "@solar-icons/react/bold-duotone/copy";
import { CopyCheckIcon as CopyCheck } from "@solar-icons/react/bold-duotone/copy-check";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { CONTACT_STRINGS } from "../constants/contactStrings";
import { isOpenNow, telHref } from "../utils/contactModel";
import { categoryIcon } from "./contactIcons";

const s = CONTACT_STRINGS.card;

/** Open-now dot, only when the hours could be read with confidence. */
export function OpenBadge({ hours }) {
  const t = useRideTokens();
  const c = t.color;
  const open = isOpenNow(hours);
  if (open === null) return null;
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, px: 1, py: 0.3, borderRadius: `${t.radius.pill}px`, fontSize: 12, fontWeight: 800, background: `linear-gradient(${open ? c.successSoft : c.surfaceInteractive}, ${open ? c.successSoft : c.surfaceInteractive}), ${c.surface}`, color: open ? c.success : c.textSecondary, whiteSpace: "nowrap" }}>
      <Box component="span" aria-hidden sx={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: open ? c.success : c.textMuted }} />
      {open ? s.openNow : s.closed}
    </Box>
  );
}

/**
 * One directory entry: a category badge, name and role, where and when, and
 * a button per phone number (tap to call) and email (tap to write).
 */
export default function ContactCard({ contact, copied, onCopy }) {
  const t = useRideTokens();
  const c = t.color;
  const Icon = categoryIcon(contact.category);
  const urgent = contact.category === "emergency";
  const headingId = `ct-${contact.id}`;

  return (
    <Box component="article" aria-labelledby={headingId} sx={{ height: "100%", display: "flex", flexDirection: "column", gap: 1.5, p: 2.25, borderRadius: `${t.radius.lg}px`, backgroundColor: c.surface, border: `1px solid ${urgent ? c.danger : c.border}`, boxShadow: t.elevation[1] }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box aria-hidden sx={{ flexShrink: 0, display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: `${t.radius.md}px`, backgroundColor: urgent ? c.dangerSoft : c.actionSoft, color: urgent ? c.danger : c.accentText }}>
          <Icon size={26} />
        </Box>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
            <Box component="h3" id={headingId} sx={{ m: 0, fontSize: 17, fontWeight: 780, lineHeight: 1.25, overflowWrap: "anywhere" }}>{contact.name}</Box>
            <OpenBadge hours={contact.hours} />
          </Box>
          {contact.role ? <Box sx={{ mt: 0.25, fontSize: 14, color: c.textSecondary }}>{contact.role}</Box> : null}
        </Box>
      </Box>

      {contact.location || contact.hours ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, fontSize: 13.5, color: c.textSecondary }}>
          {contact.location ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <MapPoint size={17} aria-hidden style={{ flexShrink: 0 }} />
              {contact.location}
            </Box>
          ) : null}
          {contact.hours ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <ClockCircle size={17} aria-hidden style={{ flexShrink: 0 }} />
              {contact.hours}
            </Box>
          ) : null}
        </Box>
      ) : null}

      <Box sx={{ mt: "auto", display: "flex", flexDirection: "column", gap: 0.75 }}>
        {contact.phones.map((number) => (
          <Box key={number} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Button component="a" href={telHref(number)} aria-label={s.call(number)} variant={urgent ? "contained" : "outlined"} color={urgent ? "error" : "primary"} startIcon={<Phone size={19} aria-hidden />} sx={{ flex: 1, justifyContent: "flex-start", minHeight: 44, borderRadius: `${t.radius.pill}px`, fontVariantNumeric: "tabular-nums", fontWeight: 760, textTransform: "none" }}>
              {number}
            </Button>
            <Tooltip title={copied === number ? s.copied : s.copy}>
              <IconButton onClick={() => onCopy(number)} aria-label={`${s.copy}: ${number}`} sx={{ width: 44, height: 44, color: copied === number ? c.success : c.textMuted }}>
                {copied === number ? <CopyCheck size={19} aria-hidden /> : <Copy size={19} aria-hidden />}
              </IconButton>
            </Tooltip>
          </Box>
        ))}
        {contact.emails.map((address) => (
          <Button key={address} component="a" href={`mailto:${address}`} aria-label={s.email(address)} variant="text" startIcon={<Letter size={19} aria-hidden />} sx={{ justifyContent: "flex-start", minHeight: 40, px: 1.5, textTransform: "none", color: c.accentText, overflowWrap: "anywhere", textAlign: "left" }}>
            {address}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
