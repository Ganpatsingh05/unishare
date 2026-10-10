// Smooth, atomic theme switching.
//
// Why: the page mixes CSS-class theming (Tailwind `dark`, globals.css) and
// React/MUI theming, each with its own transition length, so a plain toggle
// changes some regions first and fades others later. Here every part flips in
// the same frame, with per-element transitions paused, and the browser's View
// Transitions API reveals the new theme as a circle growing from the click.
// Without View Transitions (or with reduced motion) the swap is still atomic.

import { flushSync } from "react-dom";

const SWITCHING = "theme-switching";
let lastPointer = null;

/** Remember where the user last pressed, so the reveal starts there. */
export function trackThemeOrigin() {
  if (typeof window === "undefined") return () => {};
  const remember = (e) => {
    lastPointer = { x: e.clientX, y: e.clientY };
  };
  window.addEventListener("pointerdown", remember, { capture: true, passive: true });
  return () => window.removeEventListener("pointerdown", remember, { capture: true });
}

/** Put the theme classes and attributes on <html>/<body> right now. */
export function applyThemeToDom(isDark) {
  if (typeof document === "undefined") return;
  const body = document.body;
  const html = document.documentElement;
  const drop = isDark ? /\b(light|theme-warm)\b/g : /\b(dark|theme-ocean)\b/g;
  const add = isDark ? ["dark", "theme-ocean"] : ["light", "theme-warm"];
  body.className = body.className.replace(drop, "").replace(/\s+/g, " ").trim();
  add.forEach((c) => body.classList.add(c));
  html.setAttribute("data-theme", isDark ? "dark" : "light");
  html.style.colorScheme = isDark ? "dark" : "light";
  html.style.setProperty("--theme-bg", isDark ? "#1a1a1a" : "#F9FAFB");
  html.style.setProperty("--theme-text", isDark ? "#FFFFFF" : "#1f2937");
}

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Switch to `isDark`, committing React state (via `commit`) and the DOM
 * classes in one synchronous step.
 */
export function switchTheme(isDark, commit) {
  if (typeof document === "undefined") {
    commit();
    return;
  }
  const html = document.documentElement;
  const apply = () => {
    flushSync(commit);
    applyThemeToDom(isDark);
  };

  html.classList.add(SWITCHING);
  const done = () => requestAnimationFrame(() => requestAnimationFrame(() => html.classList.remove(SWITCHING)));

  if (!document.startViewTransition || reducedMotion()) {
    apply();
    done();
    return;
  }

  const x = lastPointer?.x ?? window.innerWidth - 60;
  const y = lastPointer?.y ?? 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  const transition = document.startViewTransition(apply);
  transition.ready
    .then(() => {
      html.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.4, 0, 0.2, 1)", pseudoElement: "::view-transition-new(root)" }
      );
    })
    .catch(() => {});
  transition.finished.finally(done);
}
