"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { m, useReducedMotion } from "framer-motion";
import { SirenRoundedIcon as SirenRounded } from "@solar-icons/react/bold-duotone/siren-rounded";
import { ArrowDownIcon as ArrowDown } from "@solar-icons/react/linear/arrow-down";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { CONTACT_STRINGS } from "../constants/contactStrings";

const s = CONTACT_STRINGS.emergency;

/**
 * Compact "In an emergency" card for the hero. The list itself lives in the
 * directory below (it can be long); this jumps straight to it.
 */
export default function EmergencyPanel({ items, status, onShow }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const count = items.filter((c) => c.category === "emergency").length;

  return (
    <Box component="section" aria-labelledby="ct-emergency-title" sx={{ p: { xs: 2.25, sm: 3 }, borderRadius: `${t.radius.xl}px`, background: "linear-gradient(160deg, #B4232B, #7F1D1D)", color: "#fff", boxShadow: "0 24px 50px -22px rgba(127,29,29,0.75)" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box component={m.span} aria-hidden animate={reduce ? undefined : { rotate: [0, -12, 12, -8, 8, 0] }} transition={{ duration: 0.9, delay: 0.6, ease: "easeInOut" }} sx={{ flexShrink: 0, display: "grid", placeItems: "center", width: 52, height: 52, borderRadius: "16px", backgroundColor: "rgba(255,255,255,0.16)" }}>
          <SirenRounded size={30} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box component="h2" id="ct-emergency-title" sx={{ m: 0, fontSize: 21, fontWeight: 820 }}>{s.title}</Box>
          <Box sx={{ mt: 0.25, fontSize: 14.5, color: "rgba(255,255,255,0.9)" }}>{status === "ready" ? s.lead(count) : s.loading}</Box>
        </Box>
      </Box>
      <Button
        onClick={onShow}
        disabled={status !== "ready" || !count}
        endIcon={<ArrowDown size={18} aria-hidden />}
        sx={{ mt: 2.25, minHeight: 48, px: 2.5, borderRadius: `${t.radius.pill}px`, backgroundColor: "#fff", color: "#7F1D1D", fontWeight: 800, "&:hover": { backgroundColor: "#FFF1F1" }, "&.Mui-disabled": { backgroundColor: "rgba(255,255,255,0.4)", color: "#7F1D1D" }, "&.Mui-focusVisible": { outline: "3px solid #FFE58A", outlineOffset: 2 } }}
      >
        {status === "ready" && !count ? s.none : s.show}
      </Button>
    </Box>
  );
}
