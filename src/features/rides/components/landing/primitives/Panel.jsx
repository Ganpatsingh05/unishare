import { forwardRef } from "react";
import Box from "@mui/material/Box";
import { useRideTokens } from "../../../theme/RideThemeBridge";

/**
 * Base surface for every block on the page. Colours come from the global
 * theme's surface tokens; never a page background.
 * @param {"raised"|"flat"|"inset"} variant
 */
const Panel = forwardRef(function Panel({ variant = "raised", radius = "lg", sx, children, ...rest }, ref) {
  const t = useRideTokens();
  const c = t.color;
  const variants = {
    raised: { backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: t.elevation[2] },
    flat: { backgroundColor: c.surface, border: `1px solid ${c.border}`, boxShadow: "none" },
    inset: { backgroundColor: c.surfaceInteractive, border: "1px solid transparent", boxShadow: "none" },
  };
  return (
    <Box
      ref={ref}
      sx={[
        { position: "relative", borderRadius: `${t.radius[radius]}px`, color: c.text, ...variants[variant] },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    >
      {children}
    </Box>
  );
});

export default Panel;
