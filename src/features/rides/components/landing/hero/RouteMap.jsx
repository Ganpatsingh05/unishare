"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import { keyframes } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import { useReducedMotion } from "framer-motion";
import { CircleNotch, Minus, NavigationArrow, Plus, WarningCircle } from "@phosphor-icons/react";
import { useRideTokens } from "../../../theme/RideThemeBridge";
import { RIDE_STRINGS } from "../../../constants/rideStrings";
import { CAMPUS_ORIGIN } from "../../../constants/ridePlaces";

const s = RIDE_STRINGS.stage;

// Keyless Esri tiles: a quiet gray canvas (or imagery) plus a separate
// place-name layer, so nearby towns read like a navigation map while the
// route stays the loudest thing on it. Canvas tiles stop at zoom 16 and are
// upscaled beyond.
const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services";
const BASE_LAYERS = {
  map: {
    light: `${ESRI}/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    dark: `${ESRI}/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
    labels: {
      light: `${ESRI}/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
      dark: `${ESRI}/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`,
    },
    attribution: "Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
    maxNativeZoom: 16,
  },
  satellite: {
    light: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    dark: `${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`,
    labels: {
      light: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
      dark: `${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`,
    },
    attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
    maxNativeZoom: 18,
  },
};
const LABEL_MAX = 240;
const LABEL_MAX_COMPACT = 196;
const LABEL_PANE = "rs-place-names";
const FLOW_CLASS = "rs-route-flow";
// Centre-lane dots drift toward the destination (stroke offset only).
const laneFlow = keyframes`from { stroke-dashoffset: 22; } to { stroke-dashoffset: 0; }`;

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);

// Leaflet markers live outside React, so their markup is built as strings
// with inline styles taken from the tokens.
function stopIcon(t, kind, label, side, compact = false) {
  const marker =
    kind === "origin"
      ? `<span style="display:block;width:20px;height:20px;border-radius:50%;border:5px solid ${t.brand.sky};background:#fff;box-shadow:0 0 0 2px rgba(18,35,58,.45),0 4px 10px rgba(0,0,0,.25);"></span>`
      : `<span style="display:block;width:18px;height:18px;margin:1px;border-radius:4px;transform:rotate(45deg);background:${t.brand.yellow};box-shadow:0 0 0 2.5px ${t.brand.inkNavy},0 4px 10px rgba(0,0,0,.3);"></span>`;
  const place = { top: "bottom:28px", bottom: "top:28px" }[side];
  const chip = `<span style="position:absolute;${place};left:50%;transform:translateX(-50%);display:inline-flex;align-items:center;max-width:${compact ? LABEL_MAX_COMPACT : LABEL_MAX}px;padding:${compact ? "5px 9px" : "6px 11px"};border-radius:999px;background:${t.color.surface};color:${t.color.text};box-shadow:${t.elevation[2]};font:650 ${compact ? 12 : 13}px/1.2 ${t.typography.family};white-space:nowrap;"><span style="overflow:hidden;text-overflow:ellipsis;">${escapeHtml(label)}</span></span>`;
  return L.divIcon({
    className: "rs-map-icon",
    html: `<span style="position:relative;display:block;width:20px;height:20px;">${marker}${chip}</span>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

/** Labels sit above or below their stop, facing away from the other one. */
function labelSides(a, b) {
  return b.lat >= a.lat ? ["bottom", "top"] : ["top", "bottom"];
}

/**
 * Room around the route for the centred labels (half their width sideways,
 * a chip's height plus the overlays above and below).
 */
function fitPadding(compact) {
  return compact
    ? { paddingTopLeft: [LABEL_MAX_COMPACT / 2 + 8, 84], paddingBottomRight: [LABEL_MAX_COMPACT / 2 + 8, 92] }
    : { paddingTopLeft: [96, 104], paddingBottomRight: [96, 124] };
}

function animateDraw(layer, reduce) {
  const path = layer.getElement?.();
  if (!path || reduce || typeof path.getTotalLength !== "function") return;
  const length = path.getTotalLength();
  path.style.transition = "none";
  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;
  path.getBoundingClientRect();
  path.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)";
  path.style.strokeDashoffset = "0";
  path.addEventListener(
    "transitionend",
    () => {
      path.style.strokeDasharray = "";
      path.style.transition = "";
    },
    { once: true }
  );
}

function StatusChip({ t, tone, icon, single, children }) {
  return (
    <Box
      aria-hidden
      title={single && typeof children === "string" ? children : undefined}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 1,
        maxWidth: "100%",
        ...(single ? { whiteSpace: "nowrap" } : null),
        px: 1.5,
        py: 0.875,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: t.color.surface,
        boxShadow: t.elevation[2],
        color: tone === "warn" ? t.color.warning : t.color.text,
        fontSize: 13,
        fontWeight: 600,
        lineHeight: 1.3,
      }}
    >
      {icon}
      <Box component="span" sx={{ minWidth: 0, ...(single ? { overflow: "hidden", textOverflow: "ellipsis" } : null) }}>
        {children}
      </Box>
    </Box>
  );
}

function MapTypeSwitch({ t, value, onChange }) {
  const options = [
    { key: "map", label: s.mapTypeMap },
    { key: "satellite", label: s.mapTypeSatellite },
  ];
  const onKeyDown = (event) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const index = options.findIndex((option) => option.key === value);
    const next = options[(index + keys[event.key] + options.length) % options.length];
    onChange(next.key);
    event.currentTarget.querySelector(`[data-option="${next.key}"]`)?.focus();
  };
  return (
    <Box
      role="radiogroup"
      aria-label={s.mapTypeLabel}
      onKeyDown={onKeyDown}
      sx={{
        display: "inline-flex",
        p: 0.5,
        gap: 0.5,
        borderRadius: `${t.radius.pill}px`,
        backgroundColor: t.color.surface,
        boxShadow: t.elevation[2],
      }}
    >
      {options.map((option) => {
        const selected = option.key === value;
        return (
          <Box
            key={option.key}
            component="button"
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            data-option={option.key}
            onClick={() => onChange(option.key)}
            sx={{
              minHeight: 32,
              px: 1.5,
              border: 0,
              borderRadius: `${t.radius.pill}px`,
              font: "inherit",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
              backgroundColor: selected ? t.color.action : "transparent",
              color: selected ? t.color.onAction : t.color.textSecondary,
              transition: "background-color 160ms, color 160ms",
              "&:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: 2 },
            }}
          >
            {option.label}
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * Route map for the hero: a clean, label-free base map (or satellite
 * imagery) showing only the start, the destination and the road between.
 *
 * @param {object} props
 * @param {boolean} props.preview true while showing the default campus route
 * @param {{status: string, place: object|null}} props.origin
 * @param {{status: string, place: object|null}} props.destination
 * @param {{points: Array<[number, number]>, distanceKm: number|null, minutes: number|null} | null} props.route
 * @param {string} props.routeStatus
 * @param {string} props.toText raw destination text, for messages
 * @param {boolean} props.compact phone layout: no dragging
 */
export default function RouteMap({ preview, origin, destination, route, routeStatus, toText, compact = false }) {
  const t = useRideTokens();
  const reduce = useReducedMotion();
  const hostRef = useRef(null);
  const mapRef = useRef(null);
  const baseRef = useRef(null);
  const overlayRef = useRef(null);
  const fitKeyRef = useRef("");
  const [mapType, setMapType] = useState("map");
  const [tilesReady, setTilesReady] = useState(false);

  // Create the map once per layout.
  useEffect(() => {
    const map = L.map(hostRef.current, {
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: false,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      keyboard: true,
      zoomSnap: 0.25,
      minZoom: 5,
      maxZoom: 19,
    }).setView([CAMPUS_ORIGIN.lat, CAMPUS_ORIGIN.lng], 15);
    map.attributionControl.setPrefix(false);
    // Place names sit above the base tiles but under the route and stops.
    const names = map.createPane(LABEL_PANE);
    names.style.zIndex = "350";
    names.style.pointerEvents = "none";
    overlayRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    const resize = new ResizeObserver(() => map.invalidateSize({ pan: false }));
    resize.observe(hostRef.current);
    return () => {
      resize.disconnect();
      fitKeyRef.current = "";
      map.remove();
      mapRef.current = null;
      baseRef.current = null;
    };
  }, [compact]);

  // Base layer follows the map type and the theme. On a switch the current
  // tiles stay on screen until the new set has loaded, then cross-fade, so the
  // map never goes blank while the other theme downloads.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return undefined;
    const config = BASE_LAYERS[mapType];
    const shown = baseRef.current;
    const first = !shown;
    const options = { maxNativeZoom: config.maxNativeZoom, maxZoom: 19, opacity: first ? 1 : 0 };
    const layer = L.tileLayer(config[t.mode], { ...options, attribution: config.attribution });
    const labels = L.tileLayer(config.labels[t.mode], { ...options, pane: LABEL_PANE });
    layer.addTo(map);
    labels.addTo(map);
    layer.bringToBack();

    let revealed = false;
    let fallback;
    const reveal = () => {
      if (revealed || !mapRef.current) return;
      revealed = true;
      layer.setOpacity(1);
      labels.setOpacity(1);
      shown?.forEach((old) => map.removeLayer(old));
      baseRef.current = [layer, labels];
      setTilesReady(true);
    };
    layer.once("load", reveal);
    if (first) {
      baseRef.current = [layer, labels];
    } else {
      // Slow networks: swap anyway rather than keep the wrong theme.
      fallback = setTimeout(reveal, 2500);
    }
    return () => {
      clearTimeout(fallback);
      // A newer switch arrived before this one finished: drop the half-loaded set.
      if (!revealed && !first && mapRef.current) {
        map.removeLayer(layer);
        map.removeLayer(labels);
      }
    };
  }, [mapType, t.mode, compact]);

  const originPlace = origin.place;
  const destReady = destination.status === "verified" || destination.status === "default";
  const destPlace = destReady ? destination.place : null;

  // Redraw the stops and route whenever the resolved route changes.
  useEffect(() => {
    const map = mapRef.current;
    const group = overlayRef.current;
    if (!map || !group || !originPlace) return;
    group.clearLayers();
    // Theme changes only recolour: fly and draw only when the route itself changes.
    const fitKey = [compact, originPlace.lat, originPlace.lng, destPlace?.lat, destPlace?.lng, route?.points?.length].join("|");
    const moved = fitKey !== fitKeyRef.current;
    fitKeyRef.current = fitKey;
    const animate = !reduce;

    if (!destPlace) {
      L.marker([originPlace.lat, originPlace.lng], {
        icon: stopIcon(t, "origin", originPlace.label, "bottom", compact),
        keyboard: false,
        interactive: false,
      }).addTo(group);
      if (moved) map.flyTo([originPlace.lat, originPlace.lng], 15, { animate, duration: 0.9 });
      return;
    }

    const points = route?.points?.length
      ? route.points
      : [
          [originPlace.lat, originPlace.lng],
          [destPlace.lat, destPlace.lng],
        ];
    if (route?.points?.length) {
      const stroke = { lineCap: "round", lineJoin: "round", interactive: false };
      const dark = t.mode === "dark";
      // A road in brand colours: soft halo, navy kerb, solid blue carriageway
      // and a dotted yellow centre lane that drifts toward the destination.
      L.polyline(points, { ...stroke, color: dark ? t.brand.skyBright : t.brand.actionBlue, weight: 20, opacity: dark ? 0.16 : 0.12 }).addTo(group);
      L.polyline(points, { ...stroke, color: dark ? "#0B1626" : t.brand.inkNavy, weight: 12 }).addTo(group);
      const body = L.polyline(points, { ...stroke, color: dark ? t.brand.skyBright : t.brand.sky, weight: 8 }).addTo(group);
      animateDraw(body, reduce || !moved);
      L.polyline(points, {
        ...stroke,
        color: t.brand.yellow,
        weight: 2.5,
        dashArray: "0.5 10.5",
        className: reduce ? undefined : FLOW_CLASS,
      }).addTo(group);
    }
    const [originSide, destSide] = labelSides(originPlace, destPlace);
    L.marker([originPlace.lat, originPlace.lng], {
      icon: stopIcon(t, "origin", originPlace.label, originSide, compact),
      keyboard: false,
      interactive: false,
    }).addTo(group);
    L.marker([destPlace.lat, destPlace.lng], {
      icon: stopIcon(t, "destination", destPlace.label, destSide, compact),
      keyboard: false,
      interactive: false,
    }).addTo(group);
    if (moved) map.flyToBounds(L.latLngBounds(points), { ...fitPadding(compact), animate, duration: 0.9, maxZoom: 17 });
  }, [t, reduce, compact, originPlace, destPlace, route]);

  const label = s.mapLabel(originPlace?.label || s.fromFallback, destPlace?.label || "", mapType === "satellite");
  const summary = useMemo(() => {
    const spin = <CircleNotch size={16} aria-hidden />;
    const warn = <WarningCircle size={16} weight="fill" aria-hidden />;
    const nav = <NavigationArrow size={16} weight="fill" aria-hidden />;
    if (destination.status === "checking") return { icon: spin, text: s.checking(toText.trim()) };
    if (destination.status === "notfound") return { tone: "warn", icon: warn, text: s.notFound(toText.trim()) };
    if (destination.status === "error") return { tone: "warn", icon: warn, text: s.lookupFailed };
    if (destPlace && routeStatus === "loading") return { icon: spin, text: s.findingRoute };
    if (preview && destPlace) return { icon: nav, text: s.previewRoute(originPlace.label, destPlace.label) };
    if (destPlace && route?.distanceKm) {
      const km = route.distanceKm < 10 ? route.distanceKm.toFixed(1) : Math.round(route.distanceKm);
      return { icon: nav, text: s.routeSummary(km, route.minutes, route.mode) };
    }
    return null;
  }, [destination.status, destPlace, routeStatus, route, toText, preview, originPlace]);

  const zoomBy = (delta) => mapRef.current?.setZoom(mapRef.current.getZoom() + delta, { animate: !reduce });
  const edge = compact ? 10 : 16;

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "inherit",
        overflow: "hidden",
        backgroundColor: t.color.surfaceInteractive,
        isolation: "isolate",
      }}
    >
      {/* The page is scaled with CSS zoom on wider screens, which throws off
          Leaflet's pointer maths. The map host undoes the zoom; percentage
          sizes are not affected by zoom, so it still fills its slot. */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zoom: { xs: 1, sm: 1 / t.layout.pageZoom },
          "& .rs-map-icon": { background: "transparent", border: 0 },
          "& .leaflet-layer": { transition: "opacity 280ms ease" },
          [`& .${FLOW_CLASS}`]: { animation: `${laneFlow} 1.4s linear infinite` },
          "@media (prefers-reduced-motion: reduce)": { [`& .${FLOW_CLASS}`]: { animation: "none" } },
          // Two classes deep so these win over leaflet.css, which loads later.
          "& .leaflet-container": { backgroundColor: t.color.surfaceInteractive, fontFamily: t.typography.family },
          "& .leaflet-container .leaflet-control-attribution": {
            fontSize: 10,
            lineHeight: 1.4,
            background: t.mode === "dark" ? "rgba(18,35,58,0.7)" : "rgba(255,255,255,0.8)",
            color: t.color.textSecondary,
            borderTopLeftRadius: 6,
            padding: "1px 6px",
          },
          "& .leaflet-container .leaflet-control-attribution a": { color: "inherit" },
          "& .leaflet-container:focus-visible": { outline: `2px solid ${t.color.focus}`, outlineOffset: -2 },
        }}
      >
        {/* Leaflet adds its own classes to this element, so React must never
            set its className: theme changes would wipe them and break the map. */}
        <div ref={hostRef} role="region" aria-label={label} style={{ position: "absolute", inset: 0 }} />
      </Box>

      {!tilesReady ? (
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            color: t.color.textSecondary,
            fontSize: 13,
            fontWeight: 600,
            backgroundColor: t.color.surfaceInteractive,
            zIndex: 500,
          }}
        >
          {s.loadingMap}
        </Box>
      ) : null}

      {summary ? (
        <Box
          sx={{
            position: "absolute",
            zIndex: 600,
            pointerEvents: "none",
            // Phones: one line along the bottom, clear of the top-right switch.
            ...(compact ? { bottom: 22, left: edge, right: edge } : { top: edge, left: edge, right: 72 }),
          }}
        >
          <StatusChip t={t} tone={summary.tone} icon={summary.icon} single={compact}>
            {summary.text}
          </StatusChip>
        </Box>
      ) : null}

      {compact ? (
        <Box sx={{ position: "absolute", top: edge, right: edge, zIndex: 600 }}>
          <MapTypeSwitch t={t} value={mapType} onChange={setMapType} />
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: edge,
            right: edge,
            zIndex: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            pointerEvents: "none",
            "& > *": { pointerEvents: "auto" },
          }}
        >
          <Box
            aria-hidden
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 2,
              px: 1.5,
              py: 0.75,
              borderRadius: `${t.radius.pill}px`,
              backgroundColor: t.color.surface,
              boxShadow: t.elevation[2],
              fontSize: 12.5,
              fontWeight: 650,
              color: t.color.text,
            }}
          >
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              <Box component="span" sx={{ width: 10, height: 10, borderRadius: "50%", border: `2.5px solid ${t.brand.sky}` }} />
              {s.legendStart}
            </Box>
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              <Box
                component="span"
                sx={{ width: 9, height: 9, borderRadius: "2px", transform: "rotate(45deg)", backgroundColor: t.brand.yellow, boxShadow: `0 0 0 1.5px ${t.brand.inkNavy}` }}
              />
              {s.legendDestination}
            </Box>
          </Box>
          <Box sx={{ mb: 2.5 }}>
            <MapTypeSwitch t={t} value={mapType} onChange={setMapType} />
          </Box>
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          top: compact ? edge + 52 : edge,
          right: edge,
          zIndex: 600,
          display: "flex",
          flexDirection: "column",
          borderRadius: `${t.radius.md}px`,
          backgroundColor: t.color.surface,
          boxShadow: t.elevation[2],
          overflow: "hidden",
        }}
      >
        <IconButton aria-label={s.zoomIn} onClick={() => zoomBy(1)} sx={{ borderRadius: 0 }}>
          <Plus size={18} aria-hidden />
        </IconButton>
        <Box aria-hidden sx={{ height: "1px", backgroundColor: t.color.border }} />
        <IconButton aria-label={s.zoomOut} onClick={() => zoomBy(-1)} sx={{ borderRadius: 0 }}>
          <Minus size={18} aria-hidden />
        </IconButton>
      </Box>
    </Box>
  );
}
