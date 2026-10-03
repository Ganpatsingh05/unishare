"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";

/** "Your suggestions" pill (no icon) that opens /resources/manage. */
export default function SuggestionsLink({ sx }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Button component={Link} href="/resources/manage" variant="outlined" sx={[{ minHeight: 40, px: 2.25, borderRadius: `${t.radius.pill}px`, borderColor: c.border, color: c.text, backgroundColor: c.surface, fontWeight: 700, "&:hover": { borderColor: c.action, backgroundColor: c.surface } }, ...(Array.isArray(sx) ? sx : [sx])]}>
      {RESOURCE_STRINGS.hero.manage}
    </Button>
  );
}
