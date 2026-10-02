"use client";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Steps from "antd/es/steps";
import Tag from "antd/es/tag";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, CheckCircle, MapPin, X, XCircle } from "@phosphor-icons/react";
import PersonAvatar from "../primitives/PersonAvatar";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { formatAgo, formatRideDay, formatRideTime } from "../../../utils/rideFormat";

const S = RIDE_STRINGS.manage;

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

const AVATAR = 40;
// Body lines start under the name, not under the avatar.
const INDENT = AVATAR + 12;
// Three dot steps need ~324px for their centred titles; they only appear when
// the row has room for them beside the two actions.
const STEPS_WIDTH = 324;
const STEPS_MIN_ROW = 590;

const oneLine = { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" };

export function RingGlyph({ t }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        flexShrink: 0,
        width: 10,
        height: 10,
        borderRadius: "50%",
        border: `2.5px solid ${t.color.rider}`,
        backgroundColor: t.color.surface,
      }}
    />
  );
}

export function DiamondGlyph({ t }) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        flexShrink: 0,
        width: 9,
        height: 9,
        mx: "1px",
        borderRadius: "2px",
        transform: "rotate(45deg)",
        backgroundColor: t.color.driver,
        boxShadow: `0 0 0 1px ${t.color.driverEdge}`,
      }}
    />
  );
}

/**
 * Origin ring, dashed rail, destination diamond. Stays on one line when it
 * fits; otherwise the destination wraps as a unit and only a place longer
 * than the whole row is ellipsised.
 */
function CompactRoute({ from, to, t }) {
  const group = { display: "inline-flex", alignItems: "center", gap: 0.75, minWidth: 0, maxWidth: "100%" };
  const place = { ...oneLine, color: t.color.text };
  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        columnGap: 0.75,
        rowGap: 0.25,
        minWidth: 0,
        fontSize: 14,
        fontWeight: 650,
        lineHeight: 1.4,
      }}
    >
      <Box component="span" sx={group}>
        <RingGlyph t={t} />
        <Box component="span" sx={visuallyHidden}>
          {RIDE_STRINGS.manage.routeFrom}
        </Box>
        <Box component="span" sx={place} title={from}>
          {from}
        </Box>
      </Box>
      <Box component="span" sx={group}>
        <Box
          component="span"
          aria-hidden
          sx={{ flex: "0 0 16px", height: 0, borderTop: `2px dashed ${t.color.borderStrong}` }}
        />
        <DiamondGlyph t={t} />
        <Box component="span" sx={visuallyHidden}>
          {RIDE_STRINGS.manage.routeTo}
        </Box>
        <Box component="span" sx={place} title={to}>
          {to}
        </Box>
      </Box>
    </Box>
  );
}

function Separator() {
  return (
    <Box component="span" aria-hidden>
      ·
    </Box>
  );
}

function DecisionLayer({ decision, name, t, reduce }) {
  const accepted = decision === "confirm";
  const soft = accepted ? t.color.successSoft : t.color.dangerSoft;
  const Icon = accepted ? CheckCircle : XCircle;
  return (
    <m.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: t.motion.duration.fast }}
      style={{ position: "absolute", inset: 0, zIndex: 1 }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.25,
          px: 2,
          borderRadius: `${t.radius.md}px`,
          backgroundColor: t.color.surface,
          backgroundImage: `linear-gradient(${soft}, ${soft})`,
          color: accepted ? t.color.success : t.color.danger,
          fontWeight: 700,
          fontSize: 15.5,
          textAlign: "center",
        }}
      >
        <m.span
          initial={reduce ? false : { scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={t.motion.springSnappy}
          style={{ display: "inline-flex", flexShrink: 0 }}
        >
          <Icon size={24} weight="fill" aria-hidden />
        </m.span>
        <Box component="span" sx={{ minWidth: 0, wordBreak: "break-word" }}>
          {accepted ? S.accepted(name) : S.declined(name)}
        </Box>
      </Box>
    </m.div>
  );
}

/**
 * One pending join request: who, which ride, what they asked for, and the
 * accept / decline decision. `decision` ("confirm"|"decline") swaps the row
 * into its confirmation state while the queue plays the exit.
 */
export default function RequestRow({ request, onDecide, decision = null }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const { name, ride } = request;
  const ago = formatAgo(request.createdAt);
  const day = formatRideDay(ride.date);
  const time = formatRideTime(ride.date, ride.time);
  const busy = Boolean(decision);
  const tap = busy || reduce ? undefined : { scale: 0.97 };

  return (
    <Box sx={{ position: "relative", py: 2 }} aria-busy={busy || undefined}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, minWidth: 0 }}>
        <PersonAvatar name={name} src={request.avatar} size={AVATAR} role="rider" decorative />
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: AVATAR,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            component="h4"
            title={name}
            sx={{
              m: 0,
              fontSize: 15.5,
              fontWeight: 700,
              lineHeight: 1.3,
              color: t.color.text,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {name}
          </Box>
          {ago ? (
            <Box sx={{ fontSize: 12.5, lineHeight: 1.4, color: t.color.textMuted, mt: 0.25 }}>
              {S.requestedAgo(ago)}
            </Box>
          ) : null}
        </Box>
        <Tag
          variant="filled"
          style={{
            marginInlineEnd: 0,
            marginTop: 2,
            flexShrink: 0,
            fontWeight: 650,
            fontVariantNumeric: "tabular-nums",
            backgroundColor: t.color.riderSoft,
            color: t.color.text,
          }}
        >
          {S.seatsRequested(request.seats)}
        </Tag>
      </Box>

      <Box sx={{ pl: { sm: `${INDENT}px` }, mt: 1.25, display: "grid", gap: 0.5, minWidth: 0 }}>
        <CompactRoute from={ride.from} to={ride.to} t={t} />
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            columnGap: 1,
            rowGap: 0.25,
            minWidth: 0,
            fontSize: 12.5,
            lineHeight: 1.4,
            color: t.color.textMuted,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <span>{day}</span>
          {time ? (
            <>
              <Separator />
              <span>{time}</span>
            </>
          ) : null}
          {request.pickup ? (
            <>
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                <Separator />
              </Box>
              <Box
                component="span"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  minWidth: 0,
                  maxWidth: "100%",
                  flexBasis: { xs: "100%", sm: "auto" },
                }}
              >
                <MapPin size={14} weight="regular" aria-hidden style={{ flexShrink: 0 }} />
                <Box component="span" sx={oneLine} title={request.pickup}>
                  {S.pickup}: {request.pickup}
                </Box>
              </Box>
            </>
          ) : null}
        </Box>
        {request.message ? (
          <Box
            component="blockquote"
            title={request.message}
            sx={{
              m: 0,
              mt: 0.75,
              pl: 1.25,
              borderLeft: `2px solid ${t.color.rider}`,
              fontSize: 14,
              lineHeight: 1.45,
              color: t.color.textSecondary,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            &ldquo;{request.message}&rdquo;
          </Box>
        ) : null}
      </Box>

      <Box sx={{ mt: 1.5, pl: { sm: `${INDENT}px` } }}>
        <Box sx={{ containerType: "inline-size", display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
          <Box
            role="group"
            aria-label={RIDE_STRINGS.manage.statusLabel}
            sx={{
              display: "none",
              flex: `0 0 ${STEPS_WIDTH}px`,
              [`@container (min-width: ${STEPS_MIN_ROW}px)`]: { display: "block" },
            }}
          >
            <Steps
              type="dot"
              size="small"
              current={1}
              items={[
                { key: "requested", title: RIDE_STRINGS.manage.stepRequested, status: "finish" },
                { key: "decision", title: RIDE_STRINGS.manage.stepDecision, status: "process" },
                { key: "ride", title: S.steps.ride, status: "wait" },
              ]}
              styles={{
              root: { width: STEPS_WIDTH },
              // Ant offsets dot icons for its 140px description column; our
              // titles are one or two words, so centre each dot over its title.
              itemIcon: { alignSelf: "center", marginInlineStart: 0 },
              itemSection: { width: "auto" },
              itemTitle: { fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" },
            }}
            />
          </Box>
          <Box
            sx={{
              ml: { sm: "auto" },
              flex: { xs: 1, sm: "0 0 auto" },
              display: "grid",
              gridTemplateColumns: { xs: "1fr 1fr", sm: "auto auto" },
              gap: 1.25,
            }}
          >
            <m.div whileTap={tap} style={{ display: "flex" }}>
              <Button
                fullWidth
                variant="outlined"
                disabled={busy}
                onClick={() => onDecide(request, "decline")}
                aria-label={RIDE_STRINGS.manage.declineLabel(name)}
                startIcon={<X size={18} weight="regular" aria-hidden />}
              >
                {S.decline}
              </Button>
            </m.div>
            <m.div whileTap={tap} style={{ display: "flex" }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={busy}
                onClick={() => onDecide(request, "confirm")}
                aria-label={RIDE_STRINGS.manage.acceptLabel(name)}
                startIcon={<Check size={18} weight="regular" aria-hidden />}
              >
                {S.accept}
              </Button>
            </m.div>
          </Box>
        </Box>
      </Box>

      <AnimatePresence>
        {decision ? <DecisionLayer key={decision} decision={decision} name={name} t={t} reduce={reduce} /> : null}
      </AnimatePresence>
    </Box>
  );
}
