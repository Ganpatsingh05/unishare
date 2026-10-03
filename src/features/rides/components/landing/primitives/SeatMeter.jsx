import Box from "@mui/material/Box";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";

const MAX_CAPSULES = 6;

/**
 * Seat availability as capsules plus text. Free seats are outlined in the
 * driver colour with a centre dot; taken seats are solid muted. The text label
 * carries the same information for screen readers and colour-blind users.
 * @param {"left"|"filled"} mode "left" for riders, "filled" for drivers
 */
export default function SeatMeter({ left, total, mode = "left", showLabel = true, size = "md" }) {
  const t = useRideTokens();
  const safeTotal = Math.max(total, left, 0);
  const shown = Math.min(safeTotal, MAX_CAPSULES);
  const freeShown = Math.min(left, shown);
  const filled = safeTotal - left;
  const label =
    mode === "filled"
      ? RIDE_STRINGS.manage.seatsFilled(filled, safeTotal)
      : RIDE_STRINGS.recent.seatsLeftLabel(left, safeTotal);
  const w = size === "sm" ? 12 : 16;
  const h = size === "sm" ? 16 : 20;

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
      <Box component="span" aria-hidden sx={{ display: "inline-flex", gap: 0.5 }}>
        {Array.from({ length: shown }, (_, i) => {
          const free = mode === "filled" ? i >= shown - freeShown : i < freeShown;
          return (
            <Box
              key={i}
              component="span"
              sx={{
                position: "relative",
                width: w,
                height: h,
                borderRadius: "6px 6px 4px 4px",
                border: `2px solid ${free ? t.color.driverEdge : "transparent"}`,
                backgroundColor: free ? t.color.driverSoft : t.color.textMuted,
                opacity: free ? 1 : 0.55,
                "&::after": free
                  ? {
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: 4,
                      height: 4,
                      borderRadius: "50%",
                      transform: "translate(-50%, -50%)",
                      backgroundColor: t.color.driverEdge,
                    }
                  : undefined,
              }}
            />
          );
        })}
      </Box>
      {showLabel ? (
        <Box component="span" sx={{ fontSize: 13, fontWeight: 600, color: t.color.textSecondary, whiteSpace: "nowrap" }}>
          {label}
        </Box>
      ) : (
        <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {label}
        </Box>
      )}
    </Box>
  );
}
