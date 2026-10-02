"use client";

import Box from "@mui/material/Box";
import Statistic from "antd/es/statistic";
import { Pulse } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { formatRupee } from "../../../utils/rideFormat";
import Panel from "../primitives/Panel";
import { Eyebrow } from "../primitives/SectionHeader";
import CountUp from "./CountUp";

const S = RIDE_STRINGS.live;
const CELL_PX = { xs: 2, sm: 2.5, lg: 3.5 };

/** Static "live" marker: the page's magenta micro-accent inside a hairline ring. */
function LiveDot({ t }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        position: "relative",
        display: "inline-block",
        width: 14,
        height: 14,
        borderRadius: "50%",
        border: `1px solid ${t.color.borderStrong}`,
        flexShrink: 0,
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 6,
          height: 6,
          borderRadius: "50%",
          backgroundColor: t.brand.magenta,
        },
      }}
    />
  );
}

/**
 * The shared-route ribbon (rider and driver strokes 3px apart) running out of
 * the label and into the numbers. It ends on the panel hairline it meets.
 */
function Ribbon({ t, sx }) {
  const stroke = { height: 2, borderRadius: 1 };
  return (
    <Box component="span" aria-hidden sx={{ display: "grid", gap: "3px", minWidth: 0, ...sx }}>
      <Box component="span" sx={{ ...stroke, backgroundColor: t.color.rider }} />
      <Box component="span" sx={{ ...stroke, backgroundColor: t.color.driver }} />
    </Box>
  );
}

function StatCell({ t, label, value, format, index, count }) {
  const lastOddOnMobile = count % 2 === 1 && index === count - 1;
  const hairline = `1px solid ${t.color.border}`;
  return (
    <Box
      sx={{
        minWidth: 0,
        px: CELL_PX,
        py: { xs: 2, sm: 2.5 },
        display: "flex",
        alignItems: "center",
        gridColumn: { xs: lastOddOnMobile ? "1 / -1" : "auto", sm: "auto" },
        borderInlineStart: { xs: index % 2 === 1 ? hairline : "none", sm: index > 0 ? hairline : "none" },
        borderTop: { xs: index >= 2 ? hairline : "none", sm: "none" },
      }}
    >
      <Statistic
        title={label}
        value={value}
        formatter={() => (
          <Box
            component="span"
            sx={{
              display: "block",
              fontSize: { xs: 26, md: 34 },
              lineHeight: 1.1,
              fontWeight: t.typography.displayWeight,
              letterSpacing: t.typography.displayTracking,
              color: t.color.text,
            }}
          >
            <CountUp value={value} format={format} />
          </Box>
        )}
        styles={{
          title: {
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 550,
            lineHeight: 1.35,
            color: t.color.textMuted,
          },
        }}
      />
    </Box>
  );
}

/**
 * Live numbers band under the hero: one flat panel, cells split by hairlines
 * (a 2x2 grid on phones). The leading label is the section's h2; a short
 * braided ribbon runs from it into the numbers (across the top row below
 * desktop, under the label in the side cell on desktop).
 * @param {{ stats: { ridesToday: number, openSeats: number, avgPrice: number|null, activeRoutes: number } }} props
 */
export default function LiveStrip({ stats }) {
  const t = useRideTokens();
  const hairline = `1px solid ${t.color.border}`;
  const cells = [
    { key: "ridesToday", label: S.ridesToday, value: stats.ridesToday },
    { key: "openSeats", label: S.openSeats, value: stats.openSeats },
    stats.avgPrice === null || stats.avgPrice === undefined
      ? null
      : { key: "avgPrice", label: S.avgPrice, value: stats.avgPrice, format: formatRupee },
    { key: "activeRoutes", label: S.activeRoutes, value: stats.activeRoutes },
  ].filter(Boolean);

  return (
    <Panel
      variant="flat"
      radius="lg"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "auto minmax(0, 1fr)" },
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          pl: CELL_PX,
          pr: 0,
          py: { xs: 1.75, lg: 2.5 },
          display: "flex",
          flexDirection: { xs: "row", lg: "column" },
          alignItems: { xs: "center", lg: "stretch" },
          justifyContent: "center",
          gap: { xs: 2, lg: 1.75 },
          borderInlineEnd: { lg: hairline },
          borderBottom: { xs: hairline, lg: "none" },
        }}
      >
        <Box
          component="h2"
          id="rs-live-title"
          sx={{
            m: 0,
            pr: { lg: 3.5 },
            fontSize: 12,
            lineHeight: 1.4,
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <Eyebrow icon={Pulse}>{S.label}</Eyebrow>
          <LiveDot t={t} />
        </Box>
        <Ribbon t={t} sx={{ flex: { xs: "1 1 auto", lg: "0 0 auto" } }} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: `repeat(${cells.length}, minmax(0, 1fr))` },
          alignItems: "stretch",
        }}
      >
        {cells.map((cell, index) => (
          <StatCell key={cell.key} t={t} index={index} count={cells.length} {...cell} />
        ))}
      </Box>
    </Panel>
  );
}
