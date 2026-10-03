"use client";

import Box from "@mui/material/Box";
import Skeleton from "antd/es/skeleton";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { Perforation, RIDE_CARD_METRICS, TicketShell } from "./RideCard";

function Bar({ width, height = 14 }) {
  return (
    <Box sx={{ width, minWidth: 0, flexShrink: 1, lineHeight: 0 }}>
      <Skeleton.Input active block size="small" style={{ width: "100%", minWidth: 0, height, borderRadius: 6 }} />
    </Box>
  );
}

/**
 * Placeholder on the same notched ticket with RideCard's exact row heights,
 * so swapping it for a real card never shifts the layout. Decorative; the
 * parent list sets aria-busy.
 */
export default function RideCardSkeleton() {
  const t = useRideTokens();
  const M = RIDE_CARD_METRICS;
  return (
    <TicketShell t={t} wrapperProps={{ "aria-hidden": true }}>
      <Box sx={{ minHeight: M.topRow, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Bar width={84} height={24} />
          <Bar width={52} height={20} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75 }}>
          <Bar width={56} height={22} />
          <Bar width={44} height={10} />
        </Box>
      </Box>

      <Box sx={{ mt: M.gap, minHeight: M.route, flex: "1 0 auto", display: "grid", alignContent: "start", gap: 1.5 }}>
        {[0, 1].map((stop) => (
          <Box key={stop} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Skeleton.Avatar active size={14} shape={stop === 0 ? "circle" : "square"} />
            <Bar width={stop === 0 ? "70%" : "56%"} height={16} />
          </Box>
        ))}
        <Box sx={{ pl: 3.25 }}>
          <Bar width="38%" height={10} />
        </Box>
      </Box>

      <Box sx={{ my: M.gap, flexShrink: 0 }}>
        <Perforation t={t} />
      </Box>

      <Box sx={{ height: M.driverRow, flexShrink: 0, display: "flex", alignItems: "center", gap: 1.5 }}>
        <Skeleton.Avatar active size={36} shape="circle" />
        <Box sx={{ flex: 1, minWidth: 0, display: "grid", gap: 0.75 }}>
          <Bar width="64%" height={14} />
          <Bar width="42%" height={10} />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.75 }}>
          <Bar width={56} height={16} />
          <Bar width={44} height={10} />
        </Box>
      </Box>

      <Box sx={{ mt: M.gap, flexShrink: 0, lineHeight: 0 }}>
        <Skeleton.Button
          active
          block
          shape="round"
          style={{ height: M.action, borderRadius: t.radius.pill }}
        />
      </Box>
    </TicketShell>
  );
}
