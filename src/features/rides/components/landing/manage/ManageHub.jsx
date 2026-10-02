"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tabs from "antd/es/tabs";
import Skeleton from "antd/es/skeleton";
import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, SignIn, SteeringWheel } from "@phosphor-icons/react";
import { useAuth } from "@contexts/UniShareContext";
import Panel from "../primitives/Panel";
import SectionHeader from "../primitives/SectionHeader";
import StateBlock from "../primitives/StateBlock";
import RequestQueue from "./RequestQueue";
import UpcomingRides from "./UpcomingRides";
import EditRideSheet from "./EditRideSheet";
import useRideRequests from "../../../hooks/useRideRequests";
import useMyUpcomingRides from "../../../hooks/useMyUpcomingRides";
import useRideFeedback from "../../../hooks/useRideFeedback";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { RIDE_ROUTES, buildLoginHref } from "../../../utils/rideLinks";
import { parseRideDateTime } from "../../../utils/rideFormat";

const S = RIDE_STRINGS.manage;
const TITLE_ID = "rs-manage-title";
// Long queues stay scannable; the rest lives on the activity page.
const MAX_REQUESTS = 4;
const MAX_RIDES = 5;

function ActivityLink({ children, t }) {
  return (
    <Button
      component={Link}
      href={RIDE_ROUTES.manage}
      variant="text"
      endIcon={<ArrowRight size={18} weight="regular" aria-hidden />}
      // Pull the label onto the gutter so its text, not its hit area, aligns.
      sx={{ px: 1.5, mx: -1.5, color: t.color.accentText, fontWeight: 650 }}
    >
      {children}
    </Button>
  );
}

function CountPill({ count, tone, t }) {
  const hot = tone === "hot" && count > 0;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        height: 26,
        px: 1.25,
        borderRadius: `${t.radius.pill}px`,
        fontSize: 12.5,
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        backgroundColor: hot ? t.color.actionSoft : t.color.surfaceInteractive,
        color: hot ? t.color.text : t.color.textSecondary,
        whiteSpace: "nowrap",
      }}
    >
      {hot ? (
        <Box
          component="span"
          aria-hidden
          sx={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: t.brand.magenta }}
        />
      ) : null}
      {tone === "hot" ? S.requestsCount(count) : count}
    </Box>
  );
}

function ColumnHeader({ title, count, tone, t }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1.5,
        pb: 1.5,
        borderBottom: `1px solid ${t.color.border}`,
      }}
    >
      <Box
        component="h3"
        sx={{ m: 0, fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", color: t.color.text, minWidth: 0 }}
      >
        {title}
      </Box>
      {count === null ? null : <CountPill count={count} tone={tone} t={t} />}
    </Box>
  );
}

function MoreFooter({ hidden, label, t }) {
  if (hidden <= 0) return null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        pt: 1.5,
        mt: 0.5,
        borderTop: `1px solid ${t.color.border}`,
        fontSize: 13.5,
        color: t.color.textMuted,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span>{label}</span>
      <ActivityLink t={t}>{S.viewAll}</ActivityLink>
    </Box>
  );
}

function Column({ children, t, index = 0 }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: "some", margin: "0px 0px -64px 0px" }}
      transition={{ ...t.motion.spring, delay: reduce ? 0 : index * t.motion.stagger }}
      style={{ minWidth: 0 }}
    >
      <Panel variant="raised" radius="lg" sx={{ p: { xs: 2, sm: 2.5, lg: 3 }, minWidth: 0 }}>
        {children}
      </Panel>
    </m.div>
  );
}

function HubSkeleton({ t }) {
  const column = (
    <Panel variant="raised" radius="lg" sx={{ p: { xs: 2, sm: 2.5, lg: 3 } }}>
      <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 0 }} />
      <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${t.color.border}` }}>
        <Skeleton active avatar={{ size: 40 }} paragraph={{ rows: 3 }} />
      </Box>
    </Panel>
  );
  return (
    <Box aria-busy="true">
      <Box
        aria-hidden
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "7fr 5fr" },
          gap: { xs: 2, md: 3 },
        }}
      >
        {column}
        <Box sx={{ display: { xs: "none", md: "block" } }}>{column}</Box>
      </Box>
    </Box>
  );
}

function SignedOut() {
  return (
    <Panel variant="raised" radius="lg">
      <StateBlock
        title={S.signedOutTitle}
        body={S.signedOutBody}
        action={
          <Button
            component={Link}
            href={buildLoginHref()}
            variant="contained"
            color="primary"
            startIcon={<SignIn size={18} weight="regular" aria-hidden />}
          >
            {S.signIn}
          </Button>
        }
      />
    </Panel>
  );
}

function TabLabel({ text, count, hot, t }) {
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      {text}
      {count === null ? null : hot ? (
        <Badge
          color="error"
          badgeContent={count}
          max={99}
          sx={{ "& .MuiBadge-badge": { position: "static", transform: "none" } }}
        />
      ) : (
        <Box
          component="span"
          sx={{
            minWidth: 20,
            height: 20,
            px: 0.75,
            borderRadius: `${t.radius.pill}px`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            backgroundColor: t.color.surfaceInteractive,
            color: t.color.textSecondary,
          }}
        >
          {count}
        </Box>
      )}
    </Box>
  );
}

function SignedIn({ user, t }) {
  const { notify, announce } = useRideFeedback();
  const stacked = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [editing, setEditing] = useState({ ride: null, open: false });

  const onCommitError = useCallback(() => {
    notify({ message: RIDE_STRINGS.errors.respondFailed, tone: "error" });
  }, [notify]);

  const requestsApi = useRideRequests({ enabled: true, onCommitError });
  const ridesApi = useMyUpcomingRides({ enabled: true, userId: user.id });
  const { respond: hookRespond, undo } = requestsApi;
  const { cancel: hookCancel, update: hookUpdate } = ridesApi;

  const respond = useCallback(
    (request, action) => {
      hookRespond(request, action);
      notify({
        message: action === "confirm" ? S.accepted(request.name) : S.declined(request.name),
        tone: "success",
        actionLabel: S.undo,
        onAction: () => {
          if (undo(request.id)) announce(S.undone);
        },
      });
    },
    [hookRespond, notify, undo, announce]
  );

  const cancel = useCallback(
    async (ride) => {
      const result = await hookCancel(ride);
      if (result?.success) notify({ message: S.cancelled, tone: "success" });
      else notify({ message: RIDE_STRINGS.errors.cancelFailed, tone: "error" });
    },
    [hookCancel, notify]
  );

  const save = useCallback(
    async (ride, patch) => {
      // Keep derived fields in step so the optimistic row renders correctly.
      const booked = Math.max(0, ride.seatsTotal - ride.seatsLeft);
      const result = await hookUpdate(ride, {
        ...patch,
        startsAt: parseRideDateTime(patch.date, patch.time),
        seatsLeft: Math.max(0, patch.seatsTotal - booked),
      });
      if (result?.success) notify({ message: S.saved, tone: "success" });
      else notify({ message: RIDE_STRINGS.errors.updateFailed, tone: "error" });
      return result;
    },
    [hookUpdate, notify]
  );

  const pendingByRide = useMemo(() => {
    const map = {};
    for (const request of requestsApi.requests) map[request.rideId] = (map[request.rideId] || 0) + 1;
    return map;
  }, [requestsApi.requests]);

  const openEdit = useCallback((ride) => setEditing({ ride, open: true }), []);
  const closeEdit = useCallback(() => setEditing((prev) => ({ ...prev, open: false })), []);
  const onSave = useCallback((patch) => save(editing.ride, patch), [save, editing.ride]);

  const requestCount = requestsApi.requests.length;
  const rideCount = ridesApi.rides.length;
  const countsReady = { requests: requestsApi.status === "ready", rides: ridesApi.status === "ready" };

  const requestsBody = (
    <>
      <RequestQueue
        requests={requestsApi.requests.slice(0, MAX_REQUESTS)}
        status={requestsApi.status}
        onRespond={respond}
        onRetry={requestsApi.reload}
      />
      <MoreFooter hidden={requestCount - MAX_REQUESTS} label={RIDE_STRINGS.manage.moreRequests(requestCount - MAX_REQUESTS)} t={t} />
    </>
  );

  const ridesBody = (
    <>
      <UpcomingRides
        rides={ridesApi.rides.slice(0, MAX_RIDES)}
        status={ridesApi.status}
        pendingByRide={pendingByRide}
        onCancel={cancel}
        onEdit={openEdit}
        onRetry={ridesApi.reload}
      />
      <MoreFooter hidden={rideCount - MAX_RIDES} label={RIDE_STRINGS.manage.moreRides(rideCount - MAX_RIDES)} t={t} />
    </>
  );

  return (
    <>
      {stacked ? (
        <Tabs
          defaultActiveKey="requests"
          items={[
            {
              key: "requests",
              label: (
                <TabLabel
                  text={S.tabRequests}
                  count={countsReady.requests ? requestCount : null}
                  hot={requestCount > 0}
                  t={t}
                />
              ),
              children: <Column t={t}>{requestsBody}</Column>,
            },
            {
              key: "rides",
              label: <TabLabel text={S.tabRides} count={countsReady.rides ? rideCount : null} hot={false} t={t} />,
              children: <Column t={t}>{ridesBody}</Column>,
            },
          ]}
          styles={{ header: { marginBottom: 16 } }}
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr", lg: "7fr 5fr" },
            gap: 3,
            alignItems: "start",
          }}
        >
          <Column t={t}>
            <ColumnHeader title={S.requestsTitle} count={countsReady.requests ? requestCount : null} tone="hot" t={t} />
            {requestsBody}
          </Column>
          <Column t={t} index={1}>
            <ColumnHeader title={S.ridesTitle} count={countsReady.rides ? rideCount : null} tone="plain" t={t} />
            {ridesBody}
          </Column>
        </Box>
      )}
      <EditRideSheet ride={editing.ride} open={editing.open} onClose={closeEdit} onSave={onSave} />
    </>
  );
}

/** "Your rides": pending requests to decide on and the driver's upcoming rides. */
export default function ManageHub() {
  const t = useRideTokens();
  const { isAuthenticated, user, authLoading } = useAuth();

  const signedIn = !authLoading && isAuthenticated && Boolean(user);
  let body;
  if (authLoading) body = <HubSkeleton t={t} />;
  else if (!signedIn) body = <SignedOut />;
  else body = <SignedIn user={user} t={t} />;

  return (
    <Box component="section" aria-labelledby={TITLE_ID}>
      <SectionHeader
        id={TITLE_ID}
        eyebrow={S.eyebrow}
        eyebrowIcon={SteeringWheel}
        title={S.title}
        trailing={signedIn ? <ActivityLink t={t}>{S.viewAll}</ActivityLink> : null}
      />
      {body}
    </Box>
  );
}
