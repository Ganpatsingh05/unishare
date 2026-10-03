import Empty from "antd/es/empty";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { ArrowClockwise } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";

/**
 * A folded paper map with a dashed route that ends at a waiting pin.
 * The error variant replaces the pin with a warning mark.
 */
function FoldedMap({ t, broken }) {
  const panel = t.color.surfaceInteractive;
  const fold = t.color.stageInkStrong;
  return (
    <svg width="140" height="88" viewBox="0 0 140 88" fill="none" aria-hidden focusable="false">
      <path d="M14 22 L50 12 L50 74 L14 82 Z" fill={panel} />
      <path d="M50 12 L90 22 L90 84 L50 74 Z" fill={panel} opacity="0.75" />
      <path d="M90 22 L126 12 L126 74 L90 84 Z" fill={panel} />
      <path d="M50 12 L50 74 M90 22 L90 84" stroke={fold} strokeWidth="1.5" />
      <path
        d="M26 66 C 40 60, 44 44, 60 46 S 84 62, 98 48"
        stroke={t.color.rider}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 7"
      />
      <circle cx="26" cy="66" r="4.5" fill={t.color.surface} stroke={t.color.rider} strokeWidth="2.5" />
      {broken ? (
        <g>
          <circle cx="106" cy="36" r="13" fill={t.color.dangerSoft} />
          <path d="M106 29 v8" stroke={t.color.danger} strokeWidth="3" strokeLinecap="round" />
          <circle cx="106" cy="42" r="1.8" fill={t.color.danger} />
        </g>
      ) : (
        <g>
          <path
            d="M106 22 c-7 0 -12 5.2 -12 11.6 c0 8.4 12 18.4 12 18.4 s12 -10 12 -18.4 C118 27.2 113 22 106 22 Z"
            fill={t.brand.yellow}
            stroke={t.brand.inkNavy}
            strokeWidth="2"
          />
          <circle cx="106" cy="33.5" r="4" fill={t.brand.inkNavy} />
        </g>
      )}
    </svg>
  );
}

/**
 * Empty and error states. `tone="error"` adds a retry button.
 */
export default function StateBlock({ tone = "empty", title, body, action, onRetry, retryLabel, compact = false }) {
  const t = useRideTokens();
  return (
    <Box
      role={tone === "error" ? "alert" : undefined}
      sx={{ py: compact ? 3 : 5, px: 2, display: "flex", justifyContent: "center" }}
    >
      <Empty
        image={<FoldedMap t={t} broken={tone === "error"} />}
        styles={{ image: { height: 88, marginBottom: 16 } }}
        description={
          <Box sx={{ maxWidth: 340, mx: "auto" }}>
            <Box component="p" sx={{ m: 0, fontSize: 16, fontWeight: 700, color: t.color.text }}>
              {title}
            </Box>
            {body ? (
              <Box component="p" sx={{ m: 0, mt: 0.75, fontSize: 14, lineHeight: 1.5, color: t.color.textMuted }}>
                {body}
              </Box>
            ) : null}
          </Box>
        }
      >
        {tone === "error" && onRetry ? (
          <Button variant="outlined" onClick={onRetry} startIcon={<ArrowClockwise size={18} aria-hidden />}>
            {retryLabel}
          </Button>
        ) : (
          action || null
        )}
      </Empty>
    </Box>
  );
}
