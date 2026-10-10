"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useInView, useReducedMotion } from "framer-motion";

// The player loads on the client only, after the page is up.
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

/**
 * A decorative Lottie that plays only while it is on screen. With reduced
 * motion it rests on frame `rest`, chosen so the picture still makes sense.
 * `loop={false}` plays it once.
 */
export default function LottieLoop({ data, rest = 0, loop = true, className = "" }) {
  const box = useRef(null);
  const anim = useRef(null);
  const inView = useInView(box, { margin: "80px" });
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const a = anim.current;
    if (!ready || !a) return;
    if (reduce) a.goToAndStop(rest, true);
    else if (inView) a.play();
    else a.pause();
  }, [ready, inView, reduce, rest]);

  return (
    <div ref={box} aria-hidden className={className}>
      <Lottie lottieRef={anim} animationData={data} loop={loop} autoplay={false} onDOMLoaded={() => setReady(true)} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
