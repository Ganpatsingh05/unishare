import Box from "@mui/material/Box";
import { MapPinLine } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";

/**
 * Small uppercase label above a heading. The leading mark is a section icon
 * set on a short route tick, so every section reads as a stop on one line.
 */
export function Eyebrow({ children, icon: Icon = MapPinLine, sx }) {
  const t = useRideTokens();
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: t.typography.eyebrowTracking,
        textTransform: "uppercase",
        color: t.color.textSecondary,
        ...sx,
      }}
    >
      <Box
        component="span"
        aria-hidden
        sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: t.color.accentText }}
      >
        <Icon size={16} weight="duotone" />
        <Box
          component="span"
          sx={{
            width: 14,
            height: 2,
            borderRadius: 2,
            backgroundImage: `linear-gradient(90deg, ${t.color.rider} 0 45%, transparent 45% 60%, ${t.color.driver} 60% 100%)`,
          }}
        />
      </Box>
      {children}
    </Box>
  );
}

/**
 * Section heading row: eyebrow, h2 title and an optional trailing slot
 * (filters, links, counts).
 */
export default function SectionHeader({ id, eyebrow, eyebrowIcon, title, trailing, sx }) {
  const t = useRideTokens();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "flex-end" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: { xs: 2.5, md: 3.5 },
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow ? <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow> : null}
        <Box
          component="h2"
          id={id}
          sx={{
            m: 0,
            mt: eyebrow ? 1 : 0,
            fontSize: { xs: 24, md: 30 },
            lineHeight: 1.15,
            fontWeight: t.typography.displayWeight,
            letterSpacing: t.typography.displayTracking,
            color: t.color.text,
            scrollMarginTop: `${t.layout.stickyTop}px`,
          }}
        >
          {title}
        </Box>
      </Box>
      {trailing ? <Box sx={{ flexShrink: 0, maxWidth: "100%" }}>{trailing}</Box> : null}
    </Box>
  );
}
