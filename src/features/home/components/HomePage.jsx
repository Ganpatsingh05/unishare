"use client";

import { useAuth, useUI } from "@contexts/UniShareContext";
import { homeVars } from "../homeData";
import HandshakeHero from "./HandshakeHero";
import BrandRibbons from "./BrandRibbons";
import FeatureBento from "./FeatureBento";
import HowItWorks from "./HowItWorks";
import Promises from "./Promises";
import ShareBand from "./ShareBand";

/** The UniShare home page, built around the logo: two arms meeting in a handshake. */
export default function HomePage() {
  const { darkMode } = useUI();
  const { isAuthenticated } = useAuth();
  // From tablets up the page renders at 90% so more of it fits on screen;
  // phones stay at full size to keep text readable and taps easy.
  return (
    <main style={homeVars(darkMode)} className="relative flex flex-col gap-16 overflow-x-clip pb-28 pt-4 sm:gap-20 md:pt-8 md:[zoom:0.9] lg:gap-28 lg:pb-24">
      <HandshakeHero dark={darkMode} />
      <BrandRibbons />
      <FeatureBento dark={darkMode} />
      <HowItWorks dark={darkMode} />
      <Promises dark={darkMode} />
      <ShareBand signedIn={Boolean(isAuthenticated)} />
    </main>
  );
}
