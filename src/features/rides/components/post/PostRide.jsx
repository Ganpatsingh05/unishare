"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle, Info, PaperPlaneTilt, SignIn } from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "../../theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "../../hooks/useRideFeedback";
import useResolvedRoute from "../../hooks/useResolvedRoute";
import { useAuth } from "@contexts/UniShareContext";
import { RIDE_STRINGS } from "../../constants/rideStrings";
import { SEAT_LIMITS } from "../../constants/ridePlaces";
import { createRide, fetchRides } from "../../services/rides.service";
import { normalizeRide } from "../../utils/rideModel";
import { routeTier } from "../../utils/rideMatch";
import { buildFindHref, buildLoginHref, readRidePrefill, RIDE_ROUTES } from "../../utils/rideLinks";
import { INITIAL_POST, clearDraft, departure, loadDraft, saveDraft, toCreatePayload, validateStep } from "../../utils/postRide";
import Panel from "../landing/primitives/Panel";
import { CompactFields, InlineFields, VerifyNotes, validatePost } from "../landing/hero/CommandHero";
import ResultCard from "../find/ResultCard";
import { ContactStep, POST_IDS, RideStep } from "./RideFields";

const RouteMap = dynamic(() => import("../landing/hero/RouteMap"), {
  ssr: false,
  loading: () => <Box aria-hidden sx={{ position: "absolute", inset: 0 }} />,
});

const s = RIDE_STRINGS.post;
const STEPS = ["route", "ride", "contact"];
const HERO_IDS = { from: "rs-hero-from", to: "rs-hero-to", when: "rs-hero-date" };
const FIRST_FIELD = {
  route: (errors) => HERO_IDS[["from", "to", "when"].find((key) => errors[key])],
  ride: (errors) => (errors.vehicle ? POST_IDS.vehicle : POST_IDS.price),
  contact: (errors) => POST_IDS.contact(["mobile", "email", "instagram"].find((type) => errors[type]) || "mobile"),
};
const DRAFT_SAVE_MS = 500;

/** Median fare of active rides on the same route, once there are at least two. */
function useTypicalFare(from, to) {
  const [rides, setRides] = useState([]);
  useEffect(() => {
    let alive = true;
    fetchRides({ sort: "date", order: "asc", limit: 100 }).then((result) => {
      if (alive && result.success) setRides((result.data || []).map((raw) => normalizeRide(raw, null)));
    });
    return () => {
      alive = false;
    };
  }, []);
  return useMemo(() => {
    if (!from.trim() || !to.trim()) return null;
    const prices = rides
      .filter((ride) => routeTier(ride, from, to) === "exact" && Number.isFinite(ride.price) && ride.price > 0)
      .map((ride) => ride.price)
      .sort((a, b) => a - b);
    if (prices.length < 2) return null;
    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;
    return Math.round(median / 10) * 10;
  }, [rides, from, to]);
}

/** Numbered progress across the three steps; finished steps can be revisited. */
function StepRail({ step, maxReached, onJump }) {
  const t = useRideTokens();
  const c = t.color;
  const index = STEPS.indexOf(step);
  return (
    <Box component="nav" aria-label={s.stepLabel}>
      <Box component="ol" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 1 }}>
        {STEPS.map((key, i) => {
          const done = i < index;
          const current = i === index;
          const reachable = i <= maxReached && !current;
          return (
            <Box component="li" key={key} sx={{ minWidth: 0 }}>
              <ButtonBase
                disabled={!reachable}
                onClick={() => onJump(key)}
                aria-current={current ? "step" : undefined}
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: 1,
                  textAlign: "left",
                  borderRadius: `${t.radius.sm}px`,
                  py: 0.5,
                  "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 3 },
                }}
              >
                <Box aria-hidden sx={{ position: "relative", height: 6, borderRadius: 3, backgroundColor: c.surfaceInteractive, overflow: "hidden" }}>
                  {done || current ? (
                    <Box
                      component={m.span}
                      initial={false}
                      animate={{ scaleX: done ? 1 : 0.5 }}
                      transition={t.motion.spring}
                      sx={{ position: "absolute", inset: 0, transformOrigin: "left", borderRadius: 3, backgroundColor: done ? c.action : c.highlight }}
                    />
                  ) : null}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
                  <Box
                    component="span"
                    aria-hidden
                    sx={{
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      fontSize: 12,
                      fontWeight: 760,
                      backgroundColor: done ? c.action : current ? c.highlight : c.surfaceInteractive,
                      color: done ? c.onAction : current ? c.onHighlight : c.textOnInset,
                    }}
                  >
                    {done ? <Check size={13} weight="bold" /> : i + 1}
                  </Box>
                  <Box
                    component="span"
                    sx={{
                      // Phones show only the current step's name; the others keep their numbers.
                      display: { xs: current ? "block" : "none", sm: "block" },
                      fontSize: { xs: 12.5, sm: 13.5 },
                      fontWeight: current ? 760 : 600,
                      color: current ? c.text : c.textSecondary,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.steps[key]}
                  </Box>
                  {!current ? (
                    <Box component="span" sx={{ display: { xs: "inline", sm: "none" }, position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" }}>
                      {s.steps[key]}
                    </Box>
                  ) : null}
                </Box>
              </ButtonBase>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/** The ride as it will look in search, built from the form as it's filled. */
function TicketPreview({ form, driverName, live = false }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const when = departure(form);
  const ride = {
    id: "preview",
    driverName: driverName || RIDE_STRINGS.recent.driverFallback,
    driverAvatar: null,
    from: form.from.trim() || RIDE_STRINGS.hero.from,
    to: form.to.trim() || RIDE_STRINGS.hero.to,
    date: when ? when.format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    time: when ? when.format("HH:mm") : "--:--",
    startsAt: when ? when.toDate() : null,
    seatsTotal: Number(form.seats) || 1,
    seatsLeft: Number(form.seats) || 1,
    price: Number(form.price) || NaN,
    vehicle: form.vehicle.trim(),
    isOwn: false,
  };
  return (
    <Box sx={{ position: "relative" }}>
      {/* Visual only: the real card's controls are not reachable here. */}
      <Box aria-hidden inert sx={{ pointerEvents: "none" }}>
        <ResultCard
          ride={ride}
          tier="exact"
          showMatch={false}
          selected={live}
          onSelect={() => {}}
          onOpen={() => {}}
          headingId="rs-post-preview"
          placeholders={{ time: when ? undefined : "--:--", day: when ? undefined : s.previewDay, fare: s.previewFare }}
        />
      </Box>
      <AnimatePresence>
        {live ? (
          <Box
            component={m.div}
            aria-hidden
            initial={reduce ? false : { opacity: 0, scale: 1.8, rotate: -24 }}
            animate={{ opacity: 1, scale: 1, rotate: -12 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 }}
            sx={{
              position: "absolute",
              right: { xs: 12, sm: 24 },
              top: -14,
              px: 1.75,
              py: 0.5,
              border: `3px solid ${t.color.success}`,
              borderRadius: `${t.radius.sm}px`,
              color: t.color.success,
              backgroundColor: t.color.surface,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.12em",
              boxShadow: t.elevation[2],
            }}
          >
            LIVE
          </Box>
        ) : null}
      </AnimatePresence>
    </Box>
  );
}

function SignInGate() {
  const t = useRideTokens();
  const href = buildLoginHref(typeof window === "undefined" ? RIDE_ROUTES.post : window.location.pathname + window.location.search);
  return (
    <Panel radius="xl" sx={{ p: { xs: 3, md: 5 }, textAlign: "center", maxWidth: 560, mx: "auto" }}>
      <Box sx={{ display: "grid", placeItems: "center", width: 64, height: 64, mx: "auto", borderRadius: "50%", backgroundColor: t.color.actionSoft, color: t.color.accentText, mb: 2 }}>
        <SignIn size={30} weight="duotone" aria-hidden />
      </Box>
      <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 760 }}>
        {s.signIn.title}
      </Box>
      <Box component="p" sx={{ mt: 1, mb: 3, color: t.color.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>
        {s.signIn.body}
      </Box>
      <Button component={Link} href={href} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>
        {s.signIn.cta}
      </Button>
    </Panel>
  );
}

function Published({ form, onAnother, driverName }) {
  const t = useRideTokens();
  const findHref = buildFindHref({ from: form.from, to: form.to });
  return (
    <Box sx={{ maxWidth: 640, mx: "auto", display: "flex", flexDirection: "column", gap: 3, alignItems: "stretch", textAlign: "center" }}>
      <Box>
        <Box sx={{ display: "inline-flex", color: t.color.success, mb: 1 }}>
          <CheckCircle size={44} weight="fill" aria-hidden />
        </Box>
        <Box component="h2" sx={{ m: 0, fontSize: { xs: 24, md: 30 }, fontWeight: 760, letterSpacing: "-0.02em" }}>
          {s.done.title}
        </Box>
        <Box component="p" sx={{ mt: 1, mb: 0, color: t.color.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>
          {s.done.body(form.to.trim())}
        </Box>
      </Box>
      <Box sx={{ textAlign: "left", pt: 1.5 }}>
        <TicketPreview form={form} driverName={driverName} live />
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
        <Button component={Link} href={findHref} variant="contained" sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px` }}>
          {s.done.view}
        </Button>
        <Button component={Link} href={RIDE_ROUTES.manage} variant="outlined" sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px` }}>
          {s.done.manage}
        </Button>
        <Button variant="text" onClick={onAnother} sx={{ minHeight: 48 }}>
          {s.done.another}
        </Button>
      </Box>
    </Box>
  );
}

function PostContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { user, isAuthenticated, authLoading } = useAuth();
  const isWide = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("lg"));

  const [form, setForm] = useState(INITIAL_POST);
  const [step, setStep] = useState("route");
  const [maxReached, setMaxReached] = useState(0);
  const [direction, setDirection] = useState(1);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [restored, setRestored] = useState(false);
  const [status, setStatus] = useState("editing"); // editing | publishing | done
  const [published, setPublished] = useState(null);
  const headingRef = useRef(null);

  // Landing-page prefill wins; otherwise restore an unfinished draft.
  useEffect(() => {
    const prefill = readRidePrefill();
    if (prefill.from || prefill.to || prefill.date) {
      const date = prefill.date ? dayjs(prefill.date) : null;
      const time = prefill.time ? dayjs(`2000-01-01T${prefill.time}`) : null;
      setForm({
        ...INITIAL_POST,
        from: prefill.from || "",
        to: prefill.to || "",
        date: date && date.isValid() ? date : null,
        time: time && time.isValid() ? time : null,
        seats: prefill.seats ? Math.min(prefill.seats, SEAT_LIMITS.maxPost) : 1,
      });
      return;
    }
    const draft = loadDraft();
    if (draft) {
      setForm(draft);
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (status !== "editing") return undefined;
    const timer = setTimeout(() => saveDraft(form), DRAFT_SAVE_MS);
    return () => clearTimeout(timer);
  }, [form, status]);

  const resolved = useResolvedRoute(form.from, form.to);
  const typicalFare = useTypicalFare(form.from, form.to);
  const onChange = useCallback((patch) => setForm((prev) => ({ ...prev, ...patch })), []);
  const onSwap = useCallback(() => setForm((prev) => ({ ...prev, from: prev.to, to: prev.from })), []);

  const stepErrors = useCallback((key, value) => validateStep(key, value, key === "route" ? validatePost(value) : {}), []);
  // Once a step has been submitted, its errors update live as fields are fixed.
  useEffect(() => {
    if (showErrors) setErrors(stepErrors(step, form));
  }, [form, step, showErrors, stepErrors]);

  const goTo = (next) => {
    const from = STEPS.indexOf(step);
    const to = STEPS.indexOf(next);
    setDirection(to > from ? 1 : -1);
    setStep(next);
    setShowErrors(false);
    setErrors({});
    setMaxReached((max) => Math.max(max, to));
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const focusFirstError = (key, found) => {
    const id = FIRST_FIELD[key](found);
    requestAnimationFrame(() => document.getElementById(id)?.focus());
  };

  const advance = async (event) => {
    event?.preventDefault();
    const found = stepErrors(step, form);
    if (Object.keys(found).length) {
      setErrors(found);
      setShowErrors(true);
      notify({ message: s.errors.fixStep, tone: "error" });
      focusFirstError(step, found);
      return;
    }
    const index = STEPS.indexOf(step);
    if (index < STEPS.length - 1) {
      goTo(STEPS[index + 1]);
      return;
    }
    // Final check across every step before publishing.
    for (const key of STEPS) {
      const all = stepErrors(key, form);
      if (Object.keys(all).length) {
        goTo(key);
        requestAnimationFrame(() => {
          setErrors(all);
          setShowErrors(true);
        });
        return;
      }
    }
    setStatus("publishing");
    const result = await createRide(toCreatePayload(form, user?.name || RIDE_STRINGS.recent.driverFallback));
    if (result.success) {
      clearDraft();
      notify({ message: s.done.title, tone: "success" });
      setPublished(form);
      setStatus("done");
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    } else {
      setStatus("editing");
      notify({ message: result.error || s.errors.failed, tone: "error" });
    }
  };

  const startOver = () => {
    clearDraft();
    setForm(INITIAL_POST);
    setRestored(false);
    setStatus("editing");
    setPublished(null);
    setStep("route");
    setMaxReached(0);
    setErrors({});
    setShowErrors(false);
  };

  const shownErrors = showErrors ? errors : {};
  const index = STEPS.indexOf(step);
  const last = index === STEPS.length - 1;
  const busy = status === "publishing";

  const routeFields = isWide ? (
    <InlineFields form={form} onFormChange={onChange} rides={[]} errors={shownErrors} onSwap={onSwap} />
  ) : (
    <CompactFields form={form} onFormChange={onChange} rides={[]} errors={shownErrors} onSwap={onSwap} />
  );

  const map = (height) => (
    <Panel radius="xl" sx={{ position: "relative", height, overflow: "hidden", p: 0 }}>
      <RouteMap
        preview={resolved.preview}
        origin={resolved.origin}
        destination={resolved.destination}
        route={resolved.route}
        routeStatus={resolved.routeStatus}
        toText={form.to}
        compact={!isWide}
      />
    </Panel>
  );

  const slide = reduce
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, x: 28 * direction },
        animate: { opacity: 1, x: 0, transition: { duration: 0.26, ease: t.motion.ease } },
        exit: { opacity: 0, x: -20 * direction, transition: { duration: 0.16 } },
      };

  let body;
  if (authLoading) {
    body = <Skeleton variant="rounded" height={420} sx={{ borderRadius: `${t.radius.xl}px` }} />;
  } else if (!isAuthenticated) {
    body = <SignInGate />;
  } else if (status === "done" && published) {
    body = <Published form={published} onAnother={startOver} driverName={user?.name} />;
  } else {
    body = (
      <Box
        sx={{
          display: "grid",
          gap: { xs: 2.5, md: 3 },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.05fr) minmax(400px, 0.95fr)" },
          alignItems: "start",
        }}
      >
        <Panel radius="xl" component="form" noValidate onSubmit={advance} sx={{ p: { xs: 2, sm: 3 }, display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
          <StepRail step={step} maxReached={maxReached} onJump={goTo} />
          {restored ? (
            <Box role="status" sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", p: 1.25, borderRadius: `${t.radius.md}px`, backgroundColor: c.actionSoft, color: c.accentText, fontSize: 14, fontWeight: 600 }}>
              <Info size={18} weight="fill" aria-hidden />
              <Box sx={{ flex: 1, minWidth: 160 }}>{s.draftRestored}</Box>
              <Button size="small" variant="text" onClick={startOver} sx={{ minHeight: 36 }}>
                {s.draftDiscard}
              </Button>
            </Box>
          ) : null}
          <Box>
            <Box sx={{ fontSize: 13, fontWeight: 700, color: c.textMuted, letterSpacing: "0.04em" }}>{s.stepOf(index + 1, STEPS.length)}</Box>
            <Box component="h2" ref={headingRef} tabIndex={-1} sx={{ m: 0, mt: 0.25, fontSize: { xs: 21, sm: 24 }, fontWeight: 760, letterSpacing: "-0.02em", outline: "none" }}>
              {s.steps[step]}
            </Box>
          </Box>

          <Box sx={{ position: "relative", overflow: "hidden", mx: -0.5, px: 0.5, pb: 0.5, pt: 1, mt: -1 }}>
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <Box key={step} component={m.div} {...slide} sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {step === "route" ? (
                  <>
                    {!isDesktop ? map(isWide ? 300 : 220) : null}
                    {routeFields}
                    <VerifyNotes form={form} resolved={resolved} />
                  </>
                ) : null}
                {step === "ride" ? <RideStep form={form} onChange={onChange} errors={shownErrors} typicalFare={typicalFare} /> : null}
                {step === "contact" ? (
                  <>
                    <ContactStep form={form} onChange={onChange} errors={shownErrors} />
                    {!isDesktop ? (
                      <Box sx={{ mt: 1.5 }}>
                        <Box component="h3" sx={{ m: 0, mb: 1.25, fontSize: 15, fontWeight: 750 }}>
                          {s.preview}
                        </Box>
                        <TicketPreview form={form} driverName={user?.name} />
                      </Box>
                    ) : null}
                  </>
                ) : null}
              </Box>
            </AnimatePresence>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5, pt: 1, borderTop: `1px solid ${c.border}` }}>
            {index > 0 ? (
              <Button variant="text" onClick={() => goTo(STEPS[index - 1])} startIcon={<ArrowLeft size={17} aria-hidden />} sx={{ minHeight: 48 }}>
                {s.backStep}
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={busy}
              endIcon={last ? <PaperPlaneTilt size={18} weight="fill" aria-hidden /> : <ArrowRight size={18} aria-hidden />}
              sx={{ minHeight: 52, px: 3.5, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}
            >
              {last ? (busy ? s.publishing : s.publish) : s.next}
            </Button>
          </Box>
        </Panel>

        {isDesktop ? (
          <Box sx={{ position: "sticky", top: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px`, display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
            {map(360)}
            <Box>
              <Box component="h2" sx={{ m: 0, mb: 1.25, fontSize: 15, fontWeight: 750, color: c.textSecondary }}>
                {s.preview}
              </Box>
              <TicketPreview form={form} driverName={user?.name} />
            </Box>
          </Box>
        ) : null}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop,
        mx: "auto",
        px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` },
        pt: { xs: 2, md: 4 },
        pb: { xs: 12, md: 9 },
      }}
    >
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href={RIDE_ROUTES.home} variant="text" startIcon={<ArrowLeft size={16} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: c.textSecondary }}>
          {s.back}
        </Button>
        <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 28, sm: 36, md: 42 }, lineHeight: 1.08, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>
          {s.title}
        </Box>
        <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>
          {s.lead}
        </Box>
      </Box>
      {body}
    </Box>
  );
}

/** The Post a ride page body. The route page renders the footer after it. */
export default function PostRide() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <PostContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
