"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import { Plus } from "@phosphor-icons/react";
import { useRideTokens } from "../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import useHideOnScroll from "../../hooks/useHideOnScroll";

/**
 * Mobile-only extended FAB. Hides while scrolling down, while the hero form is
 * on screen and while the footer is on screen. Sits above the global mobile
 * bottom nav and respects the safe-area inset.
 */
export default function PostRideFab({ href, suppressed }) {
  const t = useRideTokens();
  const scrollingDown = useHideOnScroll();
  const hidden = suppressed || scrollingDown;

  return (
    <Box
      sx={{
        display: { xs: "block", sm: "none" },
        position: "fixed",
        right: t.layout.gutterMobile,
        bottom: `calc(${t.layout.fabOffsetMobile}px + env(safe-area-inset-bottom, 0px))`,
        zIndex: 55, // above the bottom nav (50), below the header (70)
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      {/* A CSS transition, not framer: the visibility can change before the
          lazily loaded motion features arrive, and that update must not be lost. */}
      <Box
        sx={{
          transform: hidden ? "translateY(24px) scale(0.92)" : "none",
          opacity: hidden ? 0 : 1,
          transition: `transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms linear`,
          "& .MuiFab-root:active": { transform: "scale(0.96)" },
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
        }}
      >
        <Fab
          component={Link}
          href={href}
          variant="extended"
          color="secondary"
          tabIndex={hidden ? -1 : 0}
          aria-hidden={hidden || undefined}
          sx={{ minHeight: 52 }}
        >
          <Plus size={20} weight="bold" aria-hidden />
          {RIDE_STRINGS.fab.post}
        </Fab>
      </Box>
    </Box>
  );
}
