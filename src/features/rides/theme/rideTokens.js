// Ride-share design tokens: the single source for colour, radius, spacing,
// elevation and motion. Both the MUI theme and the Ant Design ConfigProvider
// are generated from these values (see RideThemeBridge.jsx).
//
// Brand hues were sampled from /public/images/logos/logounishare1.png.
// Neutrals and surfaces are NOT defined here: they are read live from the
// global theme's CSS variables (see useGlobalSurfaces.js), so the page follows
// the app's light/dark mode and never paints its own page background.

export const brand = {
  yellow: "#FFD24C", // "Uni" and the driver hand
  yellowDeep: "#E0A800", // yellow edge on light surfaces (non-text only)
  sky: "#06A8E0", // "Share" and the rider path tip
  skyBright: "#3CC3F2", // sky tuned for dark surfaces
  actionBlue: "#1565D8", // light-mode actions, links and text accents
  deepBlue: "#254790", // base of the U's left tip
  inkNavy: "#12233A", // text on yellow or sky fills
  magenta: "#DA0C7A", // micro-accent only, under 2% of any view
  purple: "#622682", // base of the U's right tip
  handBlue: "#A7D2DD", // rider hand
};

// Fallbacks mirror src/app/globals.css so SSR markup matches the first paint.
export const globalSurfaceFallback = {
  light: {
    surface: "#ffffff",
    surfaceAlt: "#f8fafc",
    surfaceInteractive: "#f1f5f9",
    border: "#e2e8f0",
    borderStrong: "#cbd5e1",
    text: "#0f172a",
    textSecondary: "#334155",
    textMuted: "#64748b",
  },
  dark: {
    surface: "#1e293b",
    surfaceAlt: "#0f172a",
    surfaceInteractive: "#334155",
    border: "rgba(255, 255, 255, 0.1)",
    borderStrong: "rgba(255, 255, 255, 0.2)",
    text: "#ffffff",
    textSecondary: "#e2e8f0",
    textMuted: "#94a3b8",
  },
};

// Contrast on #ffffff: action 5.4:1, success 5.4:1, danger 5.4:1, warning 5.7:1,
// textMuted (global #64748b) 4.8:1, inkNavy on yellow 11.0:1.
// textMuted on surfaceInteractive is only 4.3:1, so small text on inset
// surfaces must use textSecondary (see color.textOnInset).
const lightRole = {
  action: brand.actionBlue,
  actionHover: "#0F52B5",
  onAction: "#ffffff",
  rider: brand.sky,
  driver: brand.yellow,
  driverEdge: brand.yellowDeep,
  accentText: brand.actionBlue,
  highlight: brand.yellow,
  onHighlight: brand.inkNavy,
  success: "#13795B",
  successSoft: "rgba(19, 121, 91, 0.10)",
  danger: "#C62F3B",
  dangerSoft: "rgba(198, 47, 59, 0.09)",
  warning: "#9A5600",
  focus: brand.actionBlue,
  actionSoft: "rgba(21, 101, 216, 0.08)",
  actionSoftStrong: "rgba(21, 101, 216, 0.14)",
  driverSoft: "rgba(255, 210, 76, 0.30)",
  riderSoft: "rgba(6, 168, 224, 0.12)",
  scrim: "rgba(18, 35, 58, 0.42)",
  stageInk: "rgba(18, 35, 58, 0.06)",
  stageInkStrong: "rgba(18, 35, 58, 0.16)",
  glass: "rgba(255, 255, 255, 0.78)",
};

// Contrast on #1e293b: action 7.2:1, success 7.7:1, danger 6.5:1, warning 9.3:1,
// textMuted (global #94a3b8) 5.7:1, inkNavy on skyBright 7.8:1.
// textMuted on surfaceInteractive is only 4.0:1; use color.textOnInset there.
const darkRole = {
  action: brand.skyBright,
  actionHover: "#74D5F7",
  onAction: brand.inkNavy,
  rider: brand.skyBright,
  driver: brand.yellow,
  driverEdge: brand.yellow,
  accentText: brand.skyBright,
  highlight: brand.yellow,
  onHighlight: brand.inkNavy,
  success: "#4FD1A5",
  successSoft: "rgba(79, 209, 165, 0.14)",
  danger: "#FF8A93",
  dangerSoft: "rgba(255, 138, 147, 0.14)",
  warning: "#FFC46B",
  focus: brand.yellow,
  actionSoft: "rgba(60, 195, 242, 0.12)",
  actionSoftStrong: "rgba(60, 195, 242, 0.20)",
  driverSoft: "rgba(255, 210, 76, 0.16)",
  riderSoft: "rgba(60, 195, 242, 0.14)",
  scrim: "rgba(3, 8, 18, 0.62)",
  stageInk: "rgba(255, 255, 255, 0.05)",
  stageInkStrong: "rgba(255, 255, 255, 0.14)",
  glass: "rgba(30, 41, 59, 0.72)",
};

export const radius = { xs: 6, sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

// 4px base grid. space(4) === 16.
export const space = (n) => n * 4;

export const layout = {
  maxWidth: 1240,
  gutterMobile: 16,
  gutterTablet: 24,
  gutterDesktop: 40,
  touch: 44,
  controlHeight: 48,
  controlHeightLg: 56,
  fabOffsetMobile: 96, // clears the global mobile bottom nav (about 76px)
  stickyTop: 88, // below the fixed global header
  // The ride-share page renders at 80% scale (CSS zoom on the page root and
  // its portal host). Pointer-driven widgets such as the map undo it locally.
  pageZoom: 0.8,
};

// Mirrors the brief: mobile 0-599, tablet 600-1199, desktop 1200+.
export const breakpoints = { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 };

const elevationLight = {
  0: "none",
  1: "0 1px 2px rgba(18, 35, 58, 0.06), 0 1px 1px rgba(18, 35, 58, 0.04)",
  2: "0 1px 2px rgba(18, 35, 58, 0.05), 0 10px 24px -14px rgba(18, 35, 58, 0.22)",
  3: "0 2px 4px rgba(18, 35, 58, 0.05), 0 24px 48px -22px rgba(18, 35, 58, 0.30)",
  4: "0 4px 8px rgba(18, 35, 58, 0.06), 0 32px 64px -24px rgba(18, 35, 58, 0.38)",
};

const elevationDark = {
  0: "none",
  1: "inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 1px 2px rgba(0, 0, 0, 0.40)",
  2: "inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 12px 28px -14px rgba(0, 0, 0, 0.70)",
  3: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 28px 56px -24px rgba(0, 0, 0, 0.80)",
  4: "inset 0 1px 0 rgba(255, 255, 255, 0.07), 0 36px 72px -24px rgba(0, 0, 0, 0.85)",
};

export const motion = {
  spring: { type: "spring", stiffness: 260, damping: 26 },
  springSoft: { type: "spring", stiffness: 180, damping: 24 },
  springSnappy: { type: "spring", stiffness: 420, damping: 32 },
  ease: [0.22, 1, 0.36, 1],
  duration: { fast: 0.16, base: 0.24, slow: 0.42, draw: 1.1, converge: 0.5 },
  stagger: 0.06,
  pageBudget: 0.6, // total page-load orchestration in seconds
  undoWindowMs: 5000,
};

export const typography = {
  family: "var(--font-geist-sans), system-ui, -apple-system, 'Segoe UI', sans-serif",
  // globals.css sets the root font-size to 90%, so 1rem = 14.4px.
  htmlFontSize: 14.4,
  displayWeight: 760,
  displayTracking: "-0.035em",
  eyebrowTracking: "0.14em",
};

/**
 * Builds the full token set for one mode.
 * @param {"light"|"dark"} mode
 * @param {typeof globalSurfaceFallback.light} surfaces live values from the global theme
 */
export function buildRideTokens(mode, surfaces) {
  const role = mode === "dark" ? darkRole : lightRole;
  return {
    mode,
    brand,
    color: { ...surfaces, textOnInset: surfaces.textSecondary, ...role },
    radius,
    space,
    layout,
    breakpoints,
    elevation: mode === "dark" ? elevationDark : elevationLight,
    motion,
    typography,
  };
}
