"use client";

import { useCallback, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Box from "@mui/material/Box";
import { m, useInView } from "framer-motion";
import RideThemeBridge, { useRideTokens } from "../../theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "../../hooks/useRideFeedback";
import useRideFeed from "../../hooks/useRideFeed";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { buildPostHref } from "../../utils/rideLinks";
import CommandHero from "./hero/CommandHero";
import LiveStrip from "./rides/LiveStrip";
import PostRideFab from "./PostRideFab";

// Below-the-fold sections are code-split. Placeholders reserve their height
// so nothing shifts when they arrive.
const ManageHub = dynamic(() => import("./manage/ManageHub"), {
  ssr: false,
  loading: () => <Box aria-hidden sx={{ minHeight: { xs: 420, md: 460 } }} />,
});
const RecentRides = dynamic(() => import("./rides/RecentRides"), {
  ssr: false,
  loading: () => <Box aria-hidden sx={{ minHeight: { xs: 460, md: 520 } }} />,
});

const INITIAL_FORM = { mode: "find", from: "", to: "", date: null, time: null, seats: 1 };
/**
 * Page-width column. Pass `labelledBy` only when the child does not render
 * its own labelled <section>, so no landmark is duplicated.
 */
function Section({ children, labelledBy, sx }) {
  const t = useRideTokens();
  return (
    <Box
      component={labelledBy ? "section" : "div"}
      aria-labelledby={labelledBy}
      sx={{
        width: "100%",
        maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop,
        mx: "auto",
        px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}

const pageVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.02 } },
};
const blockVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } },
};

function LandingContent() {
  const { notify } = useRideFeedback();
  const [form, setForm] = useState(INITIAL_FORM);
  const onFormChange = useCallback((patch) => setForm((prev) => ({ ...prev, ...patch })), []);

  const onRequestResult = useCallback(
    (ride, result) => {
      notify(
        result.success
          ? { message: RIDE_STRINGS.recent.requestSent(ride.driverName), tone: "success" }
          : { message: result.error || RIDE_STRINGS.recent.requestFailed, tone: "error" }
      );
    },
    [notify]
  );
  const feed = useRideFeed({ onRequestResult });

  const heroRef = useRef(null);
  const endRef = useRef(null);
  const heroInView = useInView(heroRef, { amount: 0.25 });
  const endInView = useInView(endRef, { amount: 0 });
  const postHref = buildPostHref({ from: form.from, to: form.to });

  return (
    <m.div variants={pageVariants} initial="hidden" animate="show">
      <m.div variants={blockVariants} ref={heroRef}>
        <Section sx={{ pt: { xs: 3, md: 5 } }}>
          <CommandHero form={form} onFormChange={onFormChange} rides={feed.rides} />
        </Section>
      </m.div>

      {feed.stats ? (
        <m.div variants={blockVariants}>
          <Section labelledBy="rs-live-title" sx={{ mt: { xs: 3, md: 4 } }}>
            <LiveStrip stats={feed.stats} />
          </Section>
        </m.div>
      ) : null}

      <m.div variants={blockVariants}>
        <Section sx={{ mt: { xs: 7, md: 11 } }}>
          <ManageHub />
        </Section>
      </m.div>

      <m.div variants={blockVariants}>
        <Section labelledBy="rs-recent-title" sx={{ mt: { xs: 7, md: 11 }, mb: { xs: 6, md: 9 } }}>
          <RecentRides feed={feed} />
        </Section>
      </m.div>

      <Box ref={endRef} aria-hidden sx={{ height: "1px" }} />
      <PostRideFab href={postHref} suppressed={heroInView || endInView} />
    </m.div>
  );
}

/** Ride-share landing page body. The route page renders the footer after it. */
export default function RideLanding() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <LandingContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
