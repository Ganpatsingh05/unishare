"use client";

/**
 * Reveal
 * - Previously used IntersectionObserver to reveal on scroll
 * - Now renders content immediately for better perceived performance
 * - Keeps the same API so no changes needed in consuming components
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.15,
  once = true,
  children,
}) {
  return (
    <Tag
      className={[
        "opacity-100 translate-y-0",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
