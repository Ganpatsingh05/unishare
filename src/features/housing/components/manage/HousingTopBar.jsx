"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ArrowLeft, HouseLine } from "@phosphor-icons/react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { HOUSING_STRINGS } from "../../constants/housingStrings";

export const MANAGE_HREF = "/housing/manage";

/** "Manage listings" pill that opens /housing/manage. */
export function ManageLink({ sx }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Button
      component={Link}
      href={MANAGE_HREF}
      variant="outlined"
      startIcon={<HouseLine size={17} weight="duotone" aria-hidden />}
      sx={[{ minHeight: 40, px: 1.75, borderRadius: `${t.radius.pill}px`, borderColor: c.border, color: c.text, backgroundColor: c.surface, fontWeight: 700, "&:hover": { borderColor: c.action, backgroundColor: c.surface } }, ...(Array.isArray(sx) ? sx : [sx])]}
    >
      {HOUSING_STRINGS.manageLink}
    </Button>
  );
}

/** Top row on housing pages: back link on the left, Manage listings on the right. */
export default function HousingTopBar({ backHref, backLabel, sx }) {
  const t = useRideTokens();
  return (
    <Box sx={[{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, mb: 1 }, ...(Array.isArray(sx) ? sx : [sx])]}>
      <Button component={Link} href={backHref} variant="text" startIcon={<ArrowLeft size={16} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, color: t.color.textSecondary }}>
        {backLabel}
      </Button>
      <ManageLink />
    </Box>
  );
}
