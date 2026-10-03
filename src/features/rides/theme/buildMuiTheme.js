import { createTheme } from "@mui/material/styles";

function focusRing(t) {
  return {
    outline: `2px solid ${t.color.focus}`,
    outlineOffset: 2,
  };
}

/**
 * MUI theme generated from the ride tokens.
 * @param {object} t tokens
 * @param {{portalContainer: HTMLElement|null}} options where modals and poppers mount
 */
export default function buildMuiTheme(t, { portalContainer = null } = {}) {
  const container = portalContainer || undefined;
  const c = t.color;
  return createTheme({
    cssVariables: { cssVarPrefix: "rs" },
    breakpoints: { values: t.breakpoints },
    palette: {
      mode: t.mode,
      primary: { main: c.action, dark: c.actionHover, contrastText: c.onAction },
      secondary: { main: c.highlight, contrastText: c.onHighlight },
      success: { main: c.success },
      error: { main: c.danger },
      warning: { main: c.warning },
      text: { primary: c.text, secondary: c.textMuted },
      background: { paper: c.surface, default: c.surfaceAlt },
      divider: c.border,
    },
    shape: { borderRadius: t.radius.md },
    typography: {
      fontFamily: t.typography.family,
      htmlFontSize: t.typography.htmlFontSize,
      button: { textTransform: "none", fontWeight: 650, letterSpacing: "-0.005em" },
    },
    transitions: {
      easing: { easeOut: "cubic-bezier(0.22, 1, 0.36, 1)" },
    },
    components: {
      MuiModal: { defaultProps: { container } },
      MuiPopper: { defaultProps: { container } },
      MuiButtonBase: {
        defaultProps: { disableRipple: true },
        styleOverrides: { root: { "&.Mui-focusVisible": focusRing(t) } },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            minHeight: t.layout.touch,
            borderRadius: t.radius.pill,
            paddingInline: t.space(5),
            fontSize: 15,
            transition: "background-color 160ms, color 160ms, border-color 160ms, transform 160ms",
          },
          sizeLarge: { minHeight: t.layout.controlHeightLg, paddingInline: t.space(7), fontSize: 16 },
          sizeSmall: { minHeight: 36, paddingInline: t.space(3.5), fontSize: 13.5 },
          containedPrimary: {
            backgroundColor: c.action,
            color: c.onAction,
            "&:hover": { backgroundColor: c.actionHover },
          },
          containedSecondary: {
            backgroundColor: c.highlight,
            color: c.onHighlight,
            "&:hover": { backgroundColor: c.highlight, filter: "brightness(0.96)" },
          },
          outlined: {
            borderColor: c.borderStrong,
            color: c.text,
            "&:hover": { borderColor: c.action, backgroundColor: c.actionSoft },
          },
          text: { color: c.accentText, "&:hover": { backgroundColor: c.actionSoft } },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            width: t.layout.touch,
            height: t.layout.touch,
            borderRadius: t.radius.sm,
            color: c.textSecondary,
            "&:hover": { backgroundColor: c.actionSoft, color: c.accentText },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            height: 32,
            borderRadius: t.radius.pill,
            fontWeight: 600,
            fontSize: 13,
            border: `1px solid ${c.border}`,
            backgroundColor: c.surface,
            color: c.textSecondary,
          },
          clickable: { "&:hover": { borderColor: c.action, backgroundColor: c.actionSoft } },
        },
      },
      MuiTooltip: {
        defaultProps: { arrow: true, enterDelay: 300 },
        styleOverrides: {
          tooltip: {
            backgroundColor: t.mode === "dark" ? "#F4F7FB" : t.brand.inkNavy,
            color: t.mode === "dark" ? t.brand.inkNavy : "#FFFFFF",
            fontSize: 12.5,
            fontWeight: 550,
            borderRadius: t.radius.sm,
            padding: "6px 10px",
            boxShadow: t.elevation[2],
          },
          arrow: { color: t.mode === "dark" ? "#F4F7FB" : t.brand.inkNavy },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: t.elevation[3],
            textTransform: "none",
            fontWeight: 700,
            "&:active": { boxShadow: t.elevation[2] },
          },
          extended: { height: 52, borderRadius: t.radius.pill, paddingInline: t.space(5), gap: t.space(2) },
          secondary: { backgroundColor: c.highlight, color: c.onHighlight, "&:hover": { backgroundColor: c.highlight } },
        },
      },
      MuiBadge: {
        styleOverrides: {
          badge: { fontWeight: 700, fontSize: 11, minWidth: 20, height: 20, borderRadius: t.radius.pill },
          colorError: { backgroundColor: t.brand.magenta, color: "#FFFFFF" },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: "none" } },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: c.surface,
            color: c.text,
            borderTopLeftRadius: t.radius.xl,
            borderTopRightRadius: t.radius.xl,
            boxShadow: t.elevation[4],
          },
        },
      },
      MuiBackdrop: {
        styleOverrides: { root: { backgroundColor: c.scrim } },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: t.mode === "dark" ? "#F4F7FB" : t.brand.inkNavy,
            color: t.mode === "dark" ? t.brand.inkNavy : "#FFFFFF",
            borderRadius: t.radius.md,
            fontWeight: 550,
            boxShadow: t.elevation[3],
            minWidth: "auto",
          },
          action: { marginRight: 0 },
        },
      },
      MuiToggleButtonGroup: {
        styleOverrides: { root: { gap: 0 } },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            border: 0,
            textTransform: "none",
            fontWeight: 650,
            color: c.textMuted,
            "&.Mui-selected, &.Mui-selected:hover": { backgroundColor: "transparent", color: c.text },
          },
        },
      },
    },
  });
}
