import Timeline from "antd/es/timeline";
import Box from "@mui/material/Box";
import { useRideTokens } from "../../../theme/RideThemeBridge";

function Stop({ kind, t }) {
  // Origin: rider ring. Destination: driver fill. Shape differs too, so the
  // ends never rely on colour alone.
  const size = 14;
  return kind === "origin" ? (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "block",
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid ${t.color.rider}`,
        backgroundColor: t.color.surface,
      }}
    />
  ) : (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: "block",
        width: size,
        height: size,
        borderRadius: "4px",
        transform: "rotate(45deg)",
        backgroundColor: t.color.driver,
        boxShadow: `0 0 0 2px ${t.color.surface}, 0 0 0 3px ${t.color.driverEdge}`,
      }}
    />
  );
}

/**
 * Origin-to-destination route as a two-stop timeline.
 * `fromMeta` and `toMeta` are optional secondary lines (time, date).
 */
export default function RouteLine({ from, to, fromMeta, toMeta, dense = false, clamp = 2 }) {
  const t = useRideTokens();
  const placeSx = {
    display: "-webkit-box",
    WebkitLineClamp: clamp,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    fontSize: dense ? 14 : 15.5,
    fontWeight: 650,
    lineHeight: 1.3,
    color: t.color.text,
  };
  const metaSx = { fontSize: 12.5, color: t.color.textMuted, mt: 0.25, fontVariantNumeric: "tabular-nums" };
  const item = (kind, place, meta) => ({
    key: kind,
    icon: <Stop kind={kind} t={t} />,
    content: (
      <Box sx={{ minWidth: 0, pb: kind === "origin" ? (dense ? 0.75 : 1.25) : 0 }}>
        <Box component="span" sx={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          {kind === "origin" ? "From " : "To "}
        </Box>
        <Box sx={placeSx} title={place}>
          {place}
        </Box>
        {meta ? <Box sx={metaSx}>{meta}</Box> : null}
      </Box>
    ),
  });

  return (
    <Timeline
      items={[item("origin", from, fromMeta), item("destination", to, toMeta)]}
      styles={{
        root: { margin: 0 },
        // Ant's timeline reserves room for long content; stops here are compact.
        item: { paddingBottom: 0, minHeight: 0 },
        itemWrapper: { minHeight: 0 },
        itemSection: { minHeight: 0, paddingBottom: 0 },
        itemIcon: { width: 14, height: 14, background: "transparent", border: 0 },
        itemRail: {
          borderInlineStartStyle: "dashed",
          borderInlineStartWidth: 2,
          borderColor: t.color.borderStrong,
        },
        itemContent: { minWidth: 0, minHeight: 0, paddingBottom: 0 },
      }}
    />
  );
}
