"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { ANNOUNCEMENT_STRINGS } from "../../constants/announcementStrings";

/** "Your announcements" pill that opens /announcements/manage. */
export default function ManageLink({ sx }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Button
      component={Link}
      href="/announcements/manage"
      variant="outlined"
      sx={[{ minHeight: 40, px: 2.25, borderRadius: `${t.radius.pill}px`, borderColor: c.border, color: c.text, backgroundColor: c.surface, fontWeight: 700, "&:hover": { borderColor: c.action, backgroundColor: c.surface } }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {ANNOUNCEMENT_STRINGS.manage.link}
    </Button>
  );
}
