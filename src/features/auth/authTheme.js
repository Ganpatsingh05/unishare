/**
 * One visual language for the auth views.
 *
 * The login surface is always dark regardless of the app theme, so these are
 * absolute values rather than the theme'd CSS variables. Using the theme tokens
 * here would render dark-grey text on a dark card for anyone whose saved
 * preference is light.
 */

export const AUTH = {
  // Deep night sky, with a single warm horizon so the brand yellow has a source.
  sky: "linear-gradient(180deg, #060B14 0%, #0A1424 34%, #101F36 68%, #16283F 100%)",
  panel: "#0C1526",
  panelGranted: "#0B231B",
  hairline: "rgba(255, 255, 255, 0.10)",
  title: "#F4F8FD",
  body: "rgba(228, 238, 250, 0.70)",
  faint: "rgba(228, 238, 250, 0.46)",
  yellow: "#FFD24C",
  cyan: "#3CC3F2",
  blue: "#2E7BE0",
  danger: "#FCA5A5",
  success: "#6EE7B7",
};

const base =
  "w-full rounded-xl border border-white/12 bg-white/[0.06] text-[15px] text-white " +
  "placeholder:text-white/35 outline-none transition-colors duration-200 " +
  "hover:border-white/20 focus:border-[#3CC3F2] focus:bg-white/[0.09] " +
  "focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/35 focus-visible:ring-offset-0";

/** Text input. Padding is set by the field component so the icon and the eye fit. */
export const fieldClass = `${base} py-3`;

/** Primary action: dark navy on the brand gradient, so contrast is high at both ends. */
export const primaryButtonClass =
  "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold " +
  "text-[#06101F] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 " +
  "bg-[linear-gradient(100deg,#FFD24C_0%,#8ADCF6_52%,#3CC3F2_100%)] " +
  "hover:brightness-[1.08] active:brightness-95 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1526]";

/** OAuth provider button. */
export const providerButtonClass =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/14 bg-white/[0.05] " +
  "px-3 py-2.5 text-sm font-medium text-white/90 transition-colors duration-200 " +
  "hover:border-white/25 hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-55 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/45";

/** Inline text link. */
export const linkClass =
  "rounded font-medium text-[#7FD7F5] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/45";
