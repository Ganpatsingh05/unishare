"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useUI } from "@contexts/UniShareContext";
import { RING } from "./headerKit";

/** Light/dark switch. The icon spins out and the next one spins in. */
export default function ThemeButton({ size = 40 }) {
  const { darkMode, toggleDarkMode } = useUI();
  const reduce = useReducedMotion();
  const Icon = darkMode ? Moon : Sun;
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full text-[var(--hd-text)] transition-colors hover:bg-[var(--hd-hover)] ${RING}`}
      style={{ width: size, height: size }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={darkMode ? "moon" : "sun"}
          className="grid place-items-center"
          initial={reduce ? false : { rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <Icon size={19} strokeWidth={2} aria-hidden />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
