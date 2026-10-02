"use client";

import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popconfirm from "antd/es/popconfirm";
import Tag from "antd/es/tag";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { DiamondGlyph, RingGlyph } from "./RequestRow";
import SeatMeter from "../primitives/SeatMeter";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { formatRideDay, formatRideTime, formatRupee } from "../../../utils/rideFormat";

const S = RIDE_STRINGS.manage;

const visuallyHidden = {
  position: "absolute",
  width: "1px",
  height: "1px",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

/**
 * Two stacked stops joined by a short dashed rail. A tighter stand-in for
 * the dense RouteLine, whose timeline spacing leaves a tall gap in this row.
 */
function StackedRoute({ from, to, t }) {
  const place = {
    minWidth: 0,
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.35,
    color: t.color.text,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
  };
  const glyph = { display: "flex", alignItems: "center", justifyContent: "center", height: 19, width: 12 };
  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "12px minmax(0, 1fr)",
        columnGap: 1.25,
        rowGap: 0.75,
        "&::before": {
          content: '""',
          position: "absolute",
          left: 5,
          top: 15,
          bottom: 15,
          borderLeft: `2px dashed ${t.color.borderStrong}`,
        },
      }}
    >
      <Box component="span" sx={glyph}>
        <RingGlyph t={t} />
      </Box>
      <Box sx={place} title={from}>
        <Box component="span" sx={visuallyHidden}>
          {RIDE_STRINGS.manage.routeFrom}{" "}
        </Box>
        {from}
      </Box>
      <Box component="span" sx={glyph}>
        <DiamondGlyph t={t} />
      </Box>
      <Box sx={place} title={to}>
        <Box component="span" sx={visuallyHidden}>
          {RIDE_STRINGS.manage.routeTo}{" "}
        </Box>
        {to}
      </Box>
    </Box>
  );
}

// Fixed line boxes keep the date block a known height, so the timeline node
// in UpcomingRides can sit on its vertical centre.
const DAY_LINE = 16;
const TIME_LINE = 22;
const DATE_PAD_Y = { xs: 7, sm: 10 };

/** Distance from the top of an item to the centre of its date block. */
export const DATE_BLOCK_CENTER = {
  xs: DATE_PAD_Y.xs + TIME_LINE / 2,
  sm: DATE_PAD_Y.sm + (DAY_LINE + 2 + TIME_LINE) / 2,
};

/** Day and time: an inline chip on phones, a stacked block from 600px up. */
function DateBlock({ ride, t }) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        alignSelf: { xs: "flex-start", sm: "auto" },
        width: { sm: 88 },
        py: { xs: `${DATE_PAD_Y.xs}px`, sm: `${DATE_PAD_Y.sm}px` },
        px: { xs: 1.25, sm: 0.75 },
        display: { xs: "inline-flex", sm: "block" },
        alignItems: "baseline",
        gap: 1,
        borderRadius: `${t.radius.md}px`,
        backgroundColor: t.color.surfaceInteractive,
        textAlign: "center",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <Box
        sx={{
          fontSize: 11.5,
          lineHeight: `${DAY_LINE}px`,
          fontWeight: 700,
          letterSpacing: "0.03em",
          textTransform: "uppercase",
          color: t.color.textOnInset,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {formatRideDay(ride.date)}
      </Box>
      <Box
        sx={{
          mt: { sm: "2px" },
          fontSize: 16,
          lineHeight: `${TIME_LINE}px`,
          fontWeight: t.typography.displayWeight,
          letterSpacing: "-0.02em",
          color: t.color.text,
          whiteSpace: "nowrap",
        }}
      >
        {formatRideTime(ride.date, ride.time)}
      </Box>
    </Box>
  );
}

function CancelAction({ ride, onCancel, t }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };
  return (
    // Escape from inside the portalled popup bubbles here through React.
    <Box
      component="span"
      sx={{ display: "inline-flex" }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          close();
        }
      }}
    >
      <Popconfirm
        open={open}
        onOpenChange={setOpen}
        title={S.cancelConfirmTitle}
        description={S.cancelConfirmBody}
        okText={S.cancelConfirmOk}
        cancelText={S.cancelConfirmKeep}
        okButtonProps={{ danger: true }}
        cancelButtonProps={{ autoFocus: true }}
        onConfirm={() => {
          setOpen(false);
          onCancel(ride);
        }}
        onCancel={close}
        placement="topRight"
        destroyOnHidden
        icon={<Trash size={18} weight="regular" aria-hidden color={t.color.danger} style={{ marginTop: 2 }} />}
      >
        <Tooltip title={open ? "" : S.cancel}>
          <IconButton
            ref={triggerRef}
            aria-label={RIDE_STRINGS.manage.cancelLabel(ride.from, ride.to)}
            aria-haspopup="dialog"
            aria-expanded={open}
            sx={{ "&:hover": { backgroundColor: t.color.dangerSoft, color: t.color.danger } }}
          >
            <Trash size={20} weight="regular" aria-hidden />
          </IconButton>
        </Tooltip>
      </Popconfirm>
    </Box>
  );
}

/** One of the driver's own upcoming rides with edit and cancel actions. */
export default function UpcomingRideItem({ ride, pending = 0, onCancel, onEdit }) {
  const t = useRideTokens();
  const hasPrice = Number.isFinite(ride.price);
  // Action blue on the pale tag tint is under 4.5:1 at 12px in light mode.
  const pendingText = t.mode === "dark" ? t.color.accentText : t.color.actionHover;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.25, sm: 2 },
        alignItems: { xs: "stretch", sm: "flex-start" },
        minWidth: 0,
      }}
    >
      <DateBlock ride={ride} t={t} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", minWidth: 0 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <StackedRoute from={ride.from} to={ride.to} t={t} />
          </Box>
          {hasPrice ? (
            <Box
              sx={{
                flexShrink: 0,
                fontSize: 16,
                fontWeight: t.typography.displayWeight,
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                fontVariantNumeric: "tabular-nums",
                color: t.color.text,
              }}
            >
              {formatRupee(ride.price)}
            </Box>
          ) : null}
        </Box>
        <Box
          sx={{
            mt: 0.75,
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: 1.25,
              rowGap: 0.5,
            }}
          >
            <SeatMeter left={ride.seatsLeft} total={ride.seatsTotal} mode="filled" size="sm" />
            {pending > 0 ? (
              <Tag
                variant="filled"
                style={{
                  marginInlineEnd: 0,
                  fontWeight: 650,
                  fontVariantNumeric: "tabular-nums",
                  backgroundColor: t.color.actionSoftStrong,
                  color: pendingText,
                }}
              >
                {S.pendingCount(pending)}
              </Tag>
            ) : null}
          </Box>
          <Box sx={{ display: "inline-flex", flexShrink: 0, mr: -1.25 }}>
            <Tooltip title={S.edit}>
              <IconButton aria-label={RIDE_STRINGS.manage.editLabel(ride.from, ride.to)} onClick={() => onEdit(ride)}>
                <PencilSimple size={20} weight="regular" aria-hidden />
              </IconButton>
            </Tooltip>
            <CancelAction ride={ride} onCancel={onCancel} t={t} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
