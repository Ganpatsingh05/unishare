"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import ConfigProvider from "antd/es/config-provider";
import { LazyMotion, MotionConfig } from "framer-motion";
import { useUI } from "@contexts/UniShareContext";
import { buildRideTokens } from "./rideTokens";
import useGlobalSurfaces from "./useGlobalSurfaces";
import buildMuiTheme from "./buildMuiTheme";
import buildAntdTheme from "./buildAntdTheme";

const RideTokensContext = createContext(null);

// domMax is required for layoutId and layout animations; it is code-split so
// it never blocks first paint.
const loadMotionFeatures = () => import("./motionFeatures").then((mod) => mod.default);

/** Brand tokens for the current mode. Use inside RideThemeBridge only. */
export function useRideTokens() {
  const tokens = useContext(RideTokensContext);
  if (!tokens) throw new Error("useRideTokens must be used inside RideThemeBridge");
  return tokens;
}

/**
 * One token source feeding MUI and Ant Design, scoped to the ride-share page.
 * Light or dark comes from the global theme; this component never sets it.
 *
 * Style isolation:
 * - MUI: AppRouterCacheProvider with prepend (App Router equivalent of
 *   StyledEngineProvider injectFirst) and its own "rs" cache key.
 * - Ant Design: AntdRegistry with `layer`, so its styles sit in @layer antd
 *   above Tailwind's base layer. No CssBaseline or second reset is added.
 */
export default function RideThemeBridge({ children }) {
  const { darkMode } = useUI();
  const { mode, surfaces } = useGlobalSurfaces(darkMode);

  // The page root is scaled (layout.pageZoom). Popups and sheets portal into
  // it rather than <body>, so they share the same scale as the page.
  const [root, setRoot] = useState(null);
  const getPopupContainer = useCallback(() => root || document.body, [root]);

  const tokens = useMemo(() => buildRideTokens(mode, surfaces), [mode, surfaces]);
  const muiTheme = useMemo(() => buildMuiTheme(tokens, { portalContainer: root }), [tokens, root]);
  const antdTheme = useMemo(() => buildAntdTheme(tokens), [tokens]);

  return (
    <AppRouterCacheProvider options={{ key: "rs", prepend: true }}>
      <AntdRegistry layer>
        <ThemeProvider theme={muiTheme}>
          <ConfigProvider theme={antdTheme} wave={{ disabled: true }} getPopupContainer={getPopupContainer}>
            <RideTokensContext.Provider value={tokens}>
              <LazyMotion features={loadMotionFeatures} strict>
                <MotionConfig reducedMotion="user" transition={tokens.motion.spring}>
                  <Box
                    ref={setRoot}
                    sx={{
                      position: "relative",
                      // Phones keep full size so text and touch targets stay large.
                      zoom: { xs: 1, sm: tokens.layout.pageZoom },
                    }}
                  >
                    {children}
                  </Box>
                </MotionConfig>
              </LazyMotion>
            </RideTokensContext.Provider>
          </ConfigProvider>
        </ThemeProvider>
      </AntdRegistry>
    </AppRouterCacheProvider>
  );
}
