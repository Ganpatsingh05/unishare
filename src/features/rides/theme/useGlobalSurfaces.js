"use client";

import { useEffect, useState } from "react";
import { globalSurfaceFallback } from "./rideTokens";

const VAR_MAP = {
  surface: "--surface-primary",
  surfaceAlt: "--surface-secondary",
  surfaceInteractive: "--surface-interactive",
  border: "--border-default",
  borderStrong: "--border-strong",
  text: "--text-primary",
  textSecondary: "--text-secondary",
  textMuted: "--text-muted",
};

function readSurfaces(mode) {
  const fallback = globalSurfaceFallback[mode];
  const styles = getComputedStyle(document.documentElement);
  const next = {};
  for (const [key, cssVar] of Object.entries(VAR_MAP)) {
    next[key] = styles.getPropertyValue(cssVar).trim() || fallback[key];
  }
  return next;
}

function readMode(darkMode) {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "dark" || attr === "light") return attr;
  return darkMode ? "dark" : "light";
}

function sameSurfaces(a, b) {
  return Object.keys(VAR_MAP).every((key) => a[key] === b[key]);
}

/**
 * Reads the global theme (html[data-theme] plus its CSS variables) and keeps
 * it in sync live. UniShareProvider owns the mode; this hook never writes it.
 */
export default function useGlobalSurfaces(darkMode) {
  const [state, setState] = useState(() => {
    const mode = darkMode ? "dark" : "light";
    return { mode, surfaces: globalSurfaceFallback[mode] };
  });

  useEffect(() => {
    const sync = () => {
      const mode = readMode(darkMode);
      const surfaces = readSurfaces(mode);
      setState((prev) =>
        prev.mode === mode && sameSurfaces(prev.surfaces, surfaces) ? prev : { mode, surfaces }
      );
    };
    // The provider writes data-theme in its own effect, which runs after this
    // child effect, so also read on the next frame and on attribute changes.
    sync();
    const frame = requestAnimationFrame(sync);
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [darkMode]);

  return state;
}
