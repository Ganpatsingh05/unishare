"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import { ChevronRight, History, LockKeyhole, Palette, ShieldCheck } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { PROFILE_STRINGS } from "../constants/profileStrings";

const s = PROFILE_STRINGS.settings;

/** Links from the profile to the settings page and My activity. */
export default function SettingsShortcut() {
  const t = useRideTokens();
  const c = t.color;
  const links = [
    { href: "/settings#signin", label: s.shortcut.signin, Icon: LockKeyhole },
    { href: "/settings#appearance", label: s.shortcut.appearance, Icon: Palette },
    { href: "/settings#privacy", label: s.shortcut.privacy, Icon: ShieldCheck },
    { href: "/my-activity", label: s.activity, Icon: History },
  ];
  return (
    <Panel radius="xl" component="section" aria-labelledby="pf-settings-title" sx={{ p: { xs: 2.25, sm: 2.75 } }}>
      <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 2 }}>
        <Box component="h2" id="pf-settings-title" sx={{ m: 0, fontSize: 20, fontWeight: 820 }}>{s.title}</Box>
        <Box component={Link} href="/settings" sx={{ fontSize: 14.5, fontWeight: 750, color: c.accentText, textDecoration: "none", "&:hover": { textDecoration: "underline" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2, borderRadius: "4px" } }}>{s.shortcut.all}</Box>
      </Box>
      <Box component="ul" sx={{ m: 0, mt: 1, p: 0, listStyle: "none" }}>
        {links.map(({ href, label, Icon }) => (
          <Box component="li" key={href} sx={{ borderTop: `1px solid ${c.border}`, "&:first-of-type": { borderTop: 0 } }}>
            <Box component={Link} href={href} sx={{ display: "flex", alignItems: "center", gap: 1.5, minHeight: 52, px: 0.5, color: c.text, textDecoration: "none", fontSize: 15, fontWeight: 700, borderRadius: "8px", "&:hover": { color: c.accentText }, "&:hover .go": { transform: "translateX(3px)" }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
              <Box component="span" aria-hidden sx={{ display: "inline-flex", color: c.textSecondary }}><Icon size={19} /></Box>
              <Box component="span" sx={{ flex: 1 }}>{label}</Box>
              <Box component="span" className="go" aria-hidden sx={{ display: "inline-flex", color: c.textMuted, transition: "transform 150ms ease" }}><ChevronRight size={18} /></Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Panel>
  );
}
