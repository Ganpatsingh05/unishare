"use client";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { m, useReducedMotion } from "framer-motion";
import { MagnifyingGlass, SteeringWheel } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";

const OPTIONS = [
  { value: "find", label: RIDE_STRINGS.hero.modeFind, Icon: MagnifyingGlass },
  { value: "post", label: RIDE_STRINGS.hero.modePost, Icon: SteeringWheel },
];

/**
 * Find / Post switch. A raised pill slides behind the selected option on an
 * inset track; its bottom ribbon is rider sky for Find and driver yellow for
 * Post, and the label weight changes too, so state never rests on colour.
 */
export default function ModeSwitch({ value, onChange }) {
  const t = useRideTokens();
  const reduceMotion = useReducedMotion();

  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={value}
      onChange={(_, next) => {
        if (next) onChange(next);
      }}
      aria-label={RIDE_STRINGS.hero.modeLabel}
      sx={{
        p: 0.5,
        gap: 0.5,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: t.color.surfaceInteractive,
        "&& .MuiToggleButtonGroup-grouped": {
          m: 0,
          border: 0,
          borderRadius: `${t.radius.pill}px`,
        },
      }}
    >
      {OPTIONS.map(({ value: optionValue, label, Icon }) => {
        const selected = value === optionValue;
        return (
          <ToggleButton
            key={optionValue}
            value={optionValue}
            component={m.button}
            nativeButton
            whileTap={{ scale: 0.97 }}
            sx={{
              position: "relative",
              flex: 1,
              minWidth: 0,
              minHeight: t.layout.touch,
              px: { xs: 1.5, sm: 2 },
              gap: 1,
              fontSize: 15,
              fontWeight: selected ? 700 : 600,
              color: selected ? t.color.text : t.color.textOnInset,
              backgroundColor: "transparent",
              transition: `color ${t.motion.duration.fast}s`,
              "@media (hover: hover)": { "&:hover": { backgroundColor: "transparent", color: t.color.text } },
              "&.Mui-focusVisible, &:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
            }}
          >
            {selected ? (
              <Box
                component={m.span}
                layoutId="rs-mode-indicator"
                transition={reduceMotion ? { duration: 0 } : t.motion.springSnappy}
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: `${t.radius.pill}px`,
                  backgroundColor: t.color.surface,
                  boxShadow: t.elevation[1],
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: "28%",
                    right: "28%",
                    bottom: 3,
                    height: 2,
                    borderRadius: `${t.radius.pill}px`,
                    backgroundColor: optionValue === "find" ? t.color.rider : t.color.driver,
                  },
                }}
              />
            ) : null}
            <Box
              component="span"
              sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1, minWidth: 0 }}
            >
              <Icon size={18} weight="regular" aria-hidden />
              <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {label}
              </Box>
            </Box>
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}
