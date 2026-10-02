"use client";

import { useCallback, useId, useRef } from "react";
import ConfigProvider from "antd/es/config-provider";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { m } from "framer-motion";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";

/**
 * Mobile bottom sheet for one hero field: puller, h3 title, scrollable body
 * and a full-width Done button above the home indicator. Ant popups opened
 * inside (pickers, selects) render into the sheet body so they sit above the
 * drawer instead of behind it.
 */
export default function FieldSheet({ open, onClose, onOpen, title, children }) {
  const t = useRideTokens();
  const titleId = useId();
  const bodyRef = useRef(null);
  const getPopupContainer = useCallback(() => bodyRef.current || document.body, []);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={onOpen}
      disableSwipeToOpen
      disableDiscovery
      slotProps={{
        paper: {
          role: "dialog",
          "aria-modal": true,
          "aria-labelledby": titleId,
          sx: {
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderTopLeftRadius: `${t.radius.xl}px`,
            borderTopRightRadius: `${t.radius.xl}px`,
            backgroundColor: t.color.surface,
            backgroundImage: "none",
          },
        },
      }}
    >
      <Box aria-hidden sx={{ display: "flex", justifyContent: "center", pt: 1.25, pb: 0.5, flexShrink: 0 }}>
        <Box sx={{ width: 40, height: 4, borderRadius: `${t.radius.pill}px`, backgroundColor: t.color.borderStrong }} />
      </Box>
      <Box
        component="h3"
        id={titleId}
        sx={{
          m: 0,
          px: 2,
          pt: 1,
          pb: 1.5,
          flexShrink: 0,
          fontSize: 19,
          fontWeight: t.typography.displayWeight,
          letterSpacing: "-0.02em",
          lineHeight: 1.25,
          color: t.color.text,
        }}
      >
        {title}
      </Box>
      <Box
        ref={bodyRef}
        sx={{
          position: "relative",
          flex: "1 1 auto",
          minHeight: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          px: 2,
          pb: 2,
        }}
      >
        <ConfigProvider getPopupContainer={getPopupContainer}>{children}</ConfigProvider>
      </Box>
      <Box
        sx={{
          flexShrink: 0,
          px: 2,
          pt: 1.5,
          pb: "calc(16px + env(safe-area-inset-bottom))",
          borderTop: `1px solid ${t.color.border}`,
          backgroundColor: t.color.surface,
        }}
      >
        <Button component={m.button} whileTap={{ scale: 0.97 }} variant="contained" color="primary" size="large" fullWidth onClick={onClose}>
          {RIDE_STRINGS.hero.done}
        </Button>
      </Box>
    </SwipeableDrawer>
  );
}
