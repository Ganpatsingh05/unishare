"use client";

import { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { animate, useInView, useReducedMotion } from "framer-motion";

const DURATION = 0.9;
const EASE_OUT = [0.16, 1, 0.3, 1];
const defaultFormat = (n) => new Intl.NumberFormat("en-IN").format(n);

const srOnly = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

/**
 * Counts from 0 to `value` once, the first time it scrolls into view. The
 * animated digits are written straight to the DOM (no re-render per frame)
 * and hidden from assistive tech; screen readers get the final value.
 * The final value also sits invisibly in the same grid cell so the width
 * never changes while counting.
 */
export default function CountUp({ value, format = defaultFormat }) {
  const rootRef = useRef(null);
  const textRef = useRef(null);
  const fromRef = useRef(0);
  const formatRef = useRef(format);
  const inView = useInView(rootRef, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const target = Number.isFinite(Number(value)) ? Number(value) : 0;
  const finalText = format(target);

  useEffect(() => {
    formatRef.current = format;
  }, [format]);

  useEffect(() => {
    const node = textRef.current;
    if (!node) return undefined;
    if (reduce) {
      node.textContent = formatRef.current(target);
      fromRef.current = target;
      return undefined;
    }
    if (!inView) return undefined;
    const controls = animate(fromRef.current, target, {
      duration: DURATION,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        node.textContent = formatRef.current(Math.round(latest));
      },
    });
    fromRef.current = target;
    return () => controls.stop();
  }, [inView, reduce, target]);

  return (
    <Box
      component="span"
      ref={rootRef}
      sx={{ position: "relative", display: "inline-grid", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}
    >
      <Box component="span" aria-hidden sx={{ gridArea: "1 / 1", visibility: "hidden" }}>
        {finalText}
      </Box>
      <Box component="span" aria-hidden ref={textRef} sx={{ gridArea: "1 / 1", textAlign: "start" }}>
        {format(0)}
      </Box>
      <Box component="span" sx={srOnly}>
        {finalText}
      </Box>
    </Box>
  );
}
