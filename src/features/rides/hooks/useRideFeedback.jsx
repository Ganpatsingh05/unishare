"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { motion as motionTokens } from "../theme/rideTokens";

const FeedbackContext = createContext(null);

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  margin: "-1px",
  padding: 0,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/**
 * Page-level feedback: one Snackbar queue for toasts (with optional undo) and
 * one polite aria-live region for status announcements.
 */
export function RideFeedbackProvider({ children }) {
  const [toast, setToast] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  const idRef = useRef(0);

  const announce = useCallback((message) => {
    // Clear first so repeating the same message is still announced.
    setAnnouncement("");
    requestAnimationFrame(() => setAnnouncement(message));
  }, []);

  /**
   * @param {{message: string, tone?: "success"|"error"|"info", actionLabel?: string,
   *          onAction?: () => void, duration?: number}} options
   */
  const notify = useCallback(
    (options) => {
      idRef.current += 1;
      setToast({ key: idRef.current, tone: "info", ...options });
      announce(options.message);
    },
    [announce]
  );

  const close = useCallback((_, reason) => {
    if (reason === "clickaway") return;
    setToast(null);
  }, []);

  const value = useMemo(() => ({ notify, announce }), [notify, announce]);
  const Icon = toast?.tone === "error" ? WarningCircle : CheckCircle;

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Box sx={visuallyHidden} role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </Box>
      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        onClose={close}
        autoHideDuration={toast?.duration ?? (toast?.onAction ? motionTokens.undoWindowMs : 4000)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ bottom: { xs: 104, md: 32 } }}
        message={
          <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1.25 }}>
            <Icon size={20} weight="fill" aria-hidden />
            {toast?.message}
          </Box>
        }
        slotProps={{ content: { role: "presentation" } }}
        action={
          toast?.onAction ? (
            <Button
              size="small"
              onClick={() => {
                toast.onAction();
                setToast(null);
              }}
              sx={(theme) => ({
                color: "inherit",
                fontWeight: 700,
                textDecoration: "underline",
                textUnderlineOffset: 3,
                "&:hover": { backgroundColor: theme.vars ? "rgba(127,127,127,0.16)" : undefined },
              })}
            >
              {toast.actionLabel}
            </Button>
          ) : null
        }
      />
    </FeedbackContext.Provider>
  );
}

export default function useRideFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useRideFeedback must be used inside RideFeedbackProvider");
  return ctx;
}
