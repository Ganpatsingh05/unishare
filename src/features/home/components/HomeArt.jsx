"use client";

import { useState } from "react";
import Image from "next/image";
import { featureByKey } from "@components/layout/header/navConfig";
import { FEATURE_ART } from "../featureArt";
import { BRAND } from "../homeData";

// Files that failed once, so every copy of the same picture (the handshake
// draws a slide three times) goes straight to the placeholder without a flash.
const missing = new Set();

/**
 * A home page picture that never shows as broken: until its file exists in
 * /public/images/home it renders a placeholder in the feature's colours.
 * `kind` is "photo" (hero slides, fills the frame) or "art" (transparent
 * illustrations, contained).
 */
export default function HomeArt({ src, feature, kind = "art", dark = false, sizes, priority = false, style }) {
  const [failed, setFailed] = useState(() => missing.has(src));
  const f = featureByKey[feature];
  const ink = f ? f.ink[dark ? 1 : 0] : BRAND.blue;
  const Icon = FEATURE_ART[feature];

  if (failed) {
    if (kind === "photo") {
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: `color-mix(in srgb, ${ink} 30%, ${BRAND.navy})` }}>
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.5)_1.2px,transparent_1.2px)] [background-size:24px_24px]" />
          {Icon ? <Icon weight="duotone" className="absolute right-[12%] top-1/2 h-[46%] w-[46%] -translate-y-1/2 text-white/30" /> : null}
        </div>
      );
    }
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center">
        <div className="grid aspect-square w-[52%] max-w-[300px] place-items-center rounded-full" style={{ backgroundColor: `${ink}22`, boxShadow: `inset 0 0 0 2px ${ink}33` }}>
          {Icon ? <Icon weight="duotone" className="h-[46%] w-[46%]" style={{ color: ink }} /> : null}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      priority={priority}
      className={kind === "photo" ? "object-cover" : "object-contain"}
      style={style}
      onError={() => {
        missing.add(src);
        setFailed(true);
      }}
    />
  );
}
