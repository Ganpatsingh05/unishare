"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { MARKET_STRINGS } from "../constants/marketStrings";
import { rupees } from "../utils/itemModel";

const s = MARKET_STRINGS.receipt;
const ROWS = 5;
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
// Zig-zag tear along the bottom edge of the paper.
const TEAR = "linear-gradient(135deg, transparent 50%, #FFFDF7 50%) 0 0 / 14px 14px repeat-x, linear-gradient(-135deg, transparent 50%, #FFFDF7 50%) 0 0 / 14px 14px repeat-x";

/**
 * "Just listed" as a till receipt that prints out of a dark slot: the paper
 * feeds down on load, each line is a new listing with its price, and tapping
 * a line opens that item. The paper is the same in both themes, like real paper.
 */
export default function Receipt({ items, status, onOpen }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const rows = items.slice(0, ROWS);
  const ink = "#2A2A2A";
  const faint = "#6B6B6B";

  return (
    <Box sx={{ position: "relative", maxWidth: 400, mx: { xs: "auto", md: 0 }, ml: { md: "auto" }, width: "100%" }}>
      {/* The printer slot. */}
      <Box aria-hidden sx={{ position: "relative", zIndex: 2, height: 30, borderRadius: "14px", background: "linear-gradient(180deg, #2B3446, #121826)", boxShadow: "0 10px 24px -12px rgba(8,18,32,0.6)", "&::after": { content: '""', position: "absolute", left: 18, right: 18, top: 13, height: 5, borderRadius: 3, backgroundColor: "#05080F" } }} />
      <Box sx={{ position: "relative", mx: 2.5, mt: "-12px", overflow: "hidden", pb: "14px" }}>
        <Box
          component={m.div}
          initial={reduce ? false : { y: "-100%" }}
          animate={{ y: 0 }}
          transition={{ duration: reduce ? 0 : 1.4, delay: 0.3, ease: [0.25, 0.6, 0.3, 1] }}
          sx={{ position: "relative", px: 2.25, pt: 3, pb: 2.5, backgroundColor: "#FFFDF7", color: ink, fontFamily: MONO, boxShadow: "inset 0 10px 10px -10px rgba(0,0,0,0.35)" }}
        >
          <Box sx={{ textAlign: "center", fontSize: 13, fontWeight: 800, letterSpacing: "0.2em" }}>{s.store}</Box>
          <Box component="h2" sx={{ m: 0, mt: 0.25, textAlign: "center", fontFamily: MONO, fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: faint, textTransform: "uppercase" }}>{s.title}</Box>
          <Box aria-hidden sx={{ my: 1.5, borderTop: `2px dashed ${faint}`, opacity: 0.5 }} />
          {status !== "ready" ? (
            <Box aria-busy="true" aria-label={s.loading} sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {Array.from({ length: ROWS }, (_, i) => <Box key={i} sx={{ height: 14, borderRadius: 1, backgroundColor: "rgba(0,0,0,0.07)", width: `${90 - i * 9}%` }} />)}
            </Box>
          ) : rows.length ? (
            <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0 }}>
              {rows.map((item, i) => (
                <Box component="li" key={item.id}>
                  <ButtonBase
                    onClick={() => onOpen(item.id)}
                    aria-label={s.open(item.title)}
                    sx={{ width: "100%", display: "grid", gridTemplateColumns: "22px minmax(0, 1fr) auto", gap: 1, alignItems: "baseline", py: 0.75, px: 0.5, mx: -0.5, borderRadius: "4px", fontFamily: MONO, fontSize: 13.5, textAlign: "left", color: ink, "&:hover": { backgroundColor: "rgba(255,212,59,0.35)" }, "&.Mui-focusVisible": { outline: `2px solid ${t.brand.actionBlue}` } }}
                  >
                    <Box component="span" sx={{ color: faint }}>{String(i + 1).padStart(2, "0")}</Box>
                    <Box component="span" sx={{ fontWeight: 700, textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</Box>
                    <Box component="span" sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{rupees(item.price)}</Box>
                  </ButtonBase>
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ py: 2, textAlign: "center", fontSize: 13, fontWeight: 700, color: faint }}>{s.empty}</Box>
          )}
          <Box aria-hidden sx={{ my: 1.5, borderTop: `2px dashed ${faint}`, opacity: 0.5 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 800 }}>
            <span>{status === "ready" ? s.total(items.length) : ""}</span>
          </Box>
          {/* Barcode and sign-off. */}
          <Box aria-hidden sx={{ mt: 1.75, height: 34, mx: "auto", width: "70%", background: `repeating-linear-gradient(90deg, ${ink} 0 2px, transparent 2px 4px, ${ink} 4px 5px, transparent 5px 8px, ${ink} 8px 11px, transparent 11px 13px)` }} />
          <Box sx={{ mt: 1, textAlign: "center", fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", color: faint }}>{s.thanks}</Box>
          <Box aria-hidden sx={{ position: "absolute", left: 0, right: 0, bottom: -14, height: 14, background: TEAR, transform: "rotate(180deg)" }} />
        </Box>
      </Box>
    </Box>
  );
}
