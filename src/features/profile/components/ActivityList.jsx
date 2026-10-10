"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import { m, useReducedMotion } from "framer-motion";
import { ChevronRight as AltArrowRight } from "lucide-react";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import Panel from "@features/rides/components/landing/primitives/Panel";
import { PROFILE_STRINGS } from "../constants/profileStrings";
import { ageText } from "../utils/profileModel";
import { STAMP_INK } from "./FootprintStamps";

const s = PROFILE_STRINGS.activity;

/** The latest posts across every feature, newest first, each linking to where it's managed. */
export default function ActivityList({ items, status }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();

  if (status !== "ready") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {[0, 1, 2].map((i) => <Skeleton key={i} variant="rounded" height={62} sx={{ borderRadius: `${t.radius.md}px` }} />)}
      </Box>
    );
  }
  if (!items.length) {
    return (
      <Panel variant="flat" radius="lg" sx={{ p: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ color: c.textSecondary, fontSize: 15 }}>{s.empty}</Box>
        <Button component={Link} href="/" variant="outlined" sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.emptyCta}</Button>
      </Panel>
    );
  }
  return (
    <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, position: "relative", "&::before": { content: '""', position: "absolute", left: 21, top: 12, bottom: 12, width: 2, borderRadius: 1, backgroundColor: c.border } }}>
      {items.map((item, i) => {
        const meta = STAMP_INK[item.source];
        const Icon = meta.icon;
        const ink = meta.ink[dark ? 1 : 0];
        const title = Array.isArray(item.title) ? s.ride(item.title[0] || "?", item.title[1] || "?") : item.title || "—";
        return (
          <Box component={m.li} key={item.key} initial={reduce ? false : { opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: Math.min(i, 6) * 0.05 }} sx={{ position: "relative" }}>
            <Box component={Link} href={item.href} sx={{ display: "flex", alignItems: "center", gap: 1.75, py: 1.1, pr: 1, color: "inherit", textDecoration: "none", borderRadius: `${t.radius.md}px`, "&:hover .ac-title": { color: c.accentText }, "&:focus-visible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
              <Box aria-hidden sx={{ position: "relative", zIndex: 1, flexShrink: 0, display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", backgroundColor: c.surface, border: `2px solid ${ink}`, color: ink }}>
                <Icon size={22} />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box className="ac-title" sx={{ fontSize: 15, fontWeight: 720, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", transition: "color 150ms ease" }}>{title}</Box>
                <Box sx={{ fontSize: 13, color: c.textMuted }}>
                  {PROFILE_STRINGS.footprint.stamps[item.source]}
                  {item.createdAt ? ` · ${ageText(item.createdAt, s.when)}` : ""}
                </Box>
              </Box>
              <AltArrowRight size={18} color={c.textMuted} aria-hidden />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
