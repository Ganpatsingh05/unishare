"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Reveal
 * - IntersectionObserver-based reveal on scroll
 * - Adds smooth translate/opacity + optional delay
 * - Mobile friendly (no hover needed)
 */
export default function Reveal({
  as: Tag = "div",
  className = "",
  delay = 0,
  threshold = 0.15,
  once = true,
  children,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold, once]);

  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "transition-all duration-500 will-change-transform will-change-opacity",
        visible ? "opacity-100 translate-y-0 animate-slide-up-soft" : "opacity-0 translate-y-4",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
