"use client";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { m, useReducedMotion } from "framer-motion";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import { categoryColor, typeIcon } from "./resourceIcons";

const s = RESOURCE_STRINGS.shelf;
const MAX = 9;

// Stable per-book variation so the shelf looks hand-stacked, not generated.
function variety(id = "") {
  let h = 7;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return { height: 78 + (h % 22), width: 44 + ((h >> 5) % 14), lean: (h >> 9) % 7 === 0 ? -6 : 0 };
}

/**
 * The newest resources as book spines on a shelf. Each spine is coloured by
 * category, shows the title up its length and the type at its foot. Hover
 * slides a book up; clicking jumps to its card in the library.
 */
export default function Bookshelf({ items, status, onOpen }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const reduce = useReducedMotion();
  const books = items.slice(0, MAX);
  const wood = dark ? "#3A2A1C" : "#B98552";
  const woodEdge = dark ? "#24190F" : "#8A5D33";

  return (
    <Box sx={{ position: "relative", p: { xs: 2, sm: 2.5 }, pb: 0, borderRadius: `${t.radius.xl}px`, backgroundColor: dark ? "#141C2C" : "#F4EBDD", boxShadow: `${t.elevation[2]}, inset 0 0 0 1px ${dark ? "rgba(255,255,255,0.05)" : "rgba(90,60,30,0.08)"}`, overflow: "hidden" }}>
      <Box component="h2" sx={{ m: 0, mb: 2, fontSize: 13, fontWeight: 850, letterSpacing: "0.16em", textTransform: "uppercase", color: dark ? "#C8B9A6" : "#7A5A3A" }}>{s.title}</Box>

      {/* Books standing on the plank. */}
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", alignItems: "flex-end", gap: 0.75, minHeight: 230, px: 1, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {status !== "ready"
          ? Array.from({ length: 6 }, (_, i) => <Box component="li" key={i} aria-hidden sx={{ flex: "0 0 auto", width: 48, height: `${70 + (i % 3) * 10}%`, minHeight: 160, borderRadius: "6px 6px 2px 2px", backgroundColor: dark ? "rgba(255,255,255,0.06)" : "rgba(90,60,30,0.1)" }} />)
          : books.length
            ? books.map((book, i) => {
                const v = variety(book.id);
                const color = categoryColor(book.category, dark);
                const TypeIcon = typeIcon(book.type);
                return (
                  <Box component="li" key={book.id} sx={{ flex: "0 0 auto", alignSelf: "flex-end" }}>
                    <ButtonBase
                      component={m.button}
                      nativeButton
                      onClick={() => onOpen(book.id)}
                      aria-label={s.open(book.title)}
                      initial={reduce ? false : { y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      whileHover={reduce ? undefined : { y: -12 }}
                      whileFocus={reduce ? undefined : { y: -12 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: reduce ? 0 : 0.2 + i * 0.05 }}
                      style={{ rotate: v.lean, originX: 1, originY: 1 }}
                      sx={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: v.width,
                        height: `${v.height * 2.2}px`,
                        py: 1.25,
                        borderRadius: "5px 5px 2px 2px",
                        background: `linear-gradient(90deg, rgba(0,0,0,0.18), rgba(255,255,255,0.12) 18%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.14)), ${color}`,
                        color: dark ? "#0B1220" : "#fff",
                        boxShadow: "inset 0 -10px 0 rgba(0,0,0,0.12), 2px 0 0 rgba(0,0,0,0.12)",
                        "&::before, &::after": { content: '""', position: "absolute", left: 4, right: 4, height: 2, borderRadius: 1, backgroundColor: "rgba(255,255,255,0.45)" },
                        "&::before": { top: 14 },
                        "&::after": { bottom: 34 },
                        "&.Mui-focusVisible": { outline: `3px solid ${c.focus}`, outlineOffset: 2 },
                      }}
                    >
                      <Box component="span" aria-hidden sx={{ mt: 1.5, flex: 1, minHeight: 0, writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: 13, fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxHeight: "100%", textShadow: dark ? "none" : "0 1px 1px rgba(0,0,0,0.25)" }}>
                        {book.title}
                      </Box>
                      <TypeIcon size={18} aria-hidden />
                    </ButtonBase>
                  </Box>
                );
              })
            : <Box component="li" sx={{ alignSelf: "center", mx: "auto", fontSize: 14, fontWeight: 700, color: c.textMuted }}>{s.empty}</Box>}
        {/* A bookend at the end of the row. */}
        {status === "ready" && books.length ? (
          <Box component="li" aria-hidden sx={{ flex: "0 0 auto", width: 34, height: 120, ml: 0.5, borderRadius: "4px 16px 2px 2px", background: dark ? "linear-gradient(135deg, #5A6478, #2E3646)" : "linear-gradient(135deg, #8C97AA, #5E6878)" }} />
        ) : null}
      </Box>

      {/* The plank. */}
      <Box aria-hidden sx={{ mx: { xs: -2, sm: -2.5 }, height: 18, background: `linear-gradient(180deg, ${wood}, ${woodEdge})`, boxShadow: "0 -2px 0 rgba(255,255,255,0.12) inset" }} />
    </Box>
  );
}
