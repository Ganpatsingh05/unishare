"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowSquareOut,
  CalendarBlank,
  Check,
  Clock,
  HouseLine,
  ImageSquare,
  MagnifyingGlass,
  MapPin,
  PaperPlaneTilt,
  Plus,
  Trash,
  Users,
  X,
} from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import { formatRupee } from "@features/rides/utils/rideFormat";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import PersonAvatar from "@features/rides/components/landing/primitives/PersonAvatar";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import useManageRooms from "../../hooks/useManageRooms";

const s = HOUSING_STRINGS.manage;
const TABS = [
  { key: "listings", icon: HouseLine },
  { key: "sent", icon: PaperPlaneTilt },
];
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" });
const ORDER = { pending: 0, approved: 1, rejected: 2, cancelled: 3 };

/** ?tab= so the view can be linked (My Activity links to ?tab=sent). */
function useTabParam() {
  const [tab, setTab] = useState("listings");
  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get("tab");
    if (TABS.some((x) => x.key === value)) setTab(value);
  }, []);
  const update = useCallback((next) => {
    setTab(next);
    const params = new URLSearchParams(window.location.search);
    params.set("tab", next);
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${params}`);
  }, []);
  return [tab, update];
}

function TabBar({ value, onChange, counts }) {
  const t = useRideTokens();
  const c = t.color;
  const onKeyDown = (event, index) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const next = TABS[(index + delta + TABS.length) % TABS.length];
    onChange(next.key);
    document.getElementById(`hm-tab-${next.key}`)?.focus();
  };
  return (
    <Box role="tablist" aria-label={s.tabsLabel} sx={{ display: "inline-flex", alignSelf: "flex-start", gap: 0.5, p: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive, maxWidth: "100%" }}>
      {TABS.map((tab, index) => {
        const selected = tab.key === value;
        const Icon = tab.icon;
        return (
          <ButtonBase
            key={tab.key}
            id={`hm-tab-${tab.key}`}
            role="tab"
            aria-selected={selected}
            aria-controls="hm-panel"
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => onKeyDown(event, index)}
            sx={{ position: "relative", minHeight: 48, px: { xs: 2, sm: 2.75 }, borderRadius: `${t.radius.pill}px`, fontSize: 15, fontWeight: 720, color: selected ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}
          >
            {selected ? <Box component={m.span} layoutId="hm-tab" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 1 }}>
              <Icon size={19} weight={selected ? "duotone" : "regular"} aria-hidden />
              {s.tabs[tab.key]}
              {counts[tab.key] ? (
                <Box component="span" sx={{ minWidth: 22, height: 22, px: 0.75, display: "inline-grid", placeItems: "center", borderRadius: 11, fontSize: 12, fontWeight: 800, backgroundColor: c.highlight, color: c.onHighlight }}>
                  {counts[tab.key]}
                </Box>
              ) : null}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** Status as a small stamp: yellow while waiting, green approved, muted otherwise. */
function StatusStamp({ status }) {
  const t = useRideTokens();
  const c = t.color;
  const look = {
    pending: { bg: c.highlight, fg: c.onHighlight, icon: Clock },
    approved: { bg: c.successSoft, fg: c.success, icon: Check },
    rejected: { bg: c.dangerSoft, fg: c.danger, icon: X },
    cancelled: { bg: c.surfaceInteractive, fg: c.textOnInset, icon: X },
  }[status] || { bg: c.surfaceInteractive, fg: c.textOnInset, icon: Clock };
  const Icon = look.icon;
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1.1, py: 0.4, borderRadius: `${t.radius.pill}px`, fontSize: 12.5, fontWeight: 760, background: `linear-gradient(${look.bg}, ${look.bg}), ${c.surface}`, color: look.fg, whiteSpace: "nowrap" }}>
      <Icon size={13} weight="bold" aria-hidden />
      {s.status[status] || status}
    </Box>
  );
}

function Meta({ icon: Icon, children }) {
  const t = useRideTokens();
  return (
    <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, fontSize: 13, fontWeight: 650, color: t.color.textSecondary }}>
      <Icon size={15} weight="duotone" aria-hidden />
      {children}
    </Box>
  );
}

function RoomThumb({ room, size = 72 }) {
  const t = useRideTokens();
  return (
    <Box sx={{ flexShrink: 0, width: size, height: size, borderRadius: `${t.radius.md}px`, overflow: "hidden", backgroundColor: t.color.surfaceInteractive, display: "grid", placeItems: "center", color: t.color.textOnInset }}>
      {room?.photos?.[0] ? <Box component="img" src={room.photos[0]} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <ImageSquare size={26} weight="duotone" aria-hidden />}
    </Box>
  );
}

/** A request on one of my rooms: who, when, how many, their note, and my answer. */
function IncomingRequest({ request, onRespond }) {
  const t = useRideTokens();
  const c = t.color;
  const [replyOpen, setReplyOpen] = useState(false);
  const [reply, setReply] = useState("");
  const pending = request.status === "pending";
  const replyId = `hm-reply-${request.id}`;
  return (
    <Box sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: `${t.radius.lg}px`, backgroundColor: pending ? c.surface : c.surfaceInteractive, border: `1px solid ${pending ? c.border : "transparent"}` }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <PersonAvatar name={request.name} src={request.picture} size={40} role="rider" decorative />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ fontSize: 15.5, fontWeight: 760, overflowWrap: "anywhere" }}>{request.name}</Box>
            <StatusStamp status={request.status} />
          </Box>
          <Box sx={{ mt: 0.5, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {request.moveIn ? <Meta icon={CalendarBlank}>{s.listing.moveIn(dateFmt.format(request.moveIn))}</Meta> : null}
            <Meta icon={Users}>{s.listing.people(request.occupants)}</Meta>
            {request.stay ? <Meta icon={Clock}>{request.stay}</Meta> : null}
          </Box>
          {request.message ? (
            <Box component="blockquote" sx={{ m: 0, mt: 1.25, pl: 1.5, borderLeft: `3px solid ${t.brand.yellow}`, fontSize: 14.5, lineHeight: 1.55, color: c.textSecondary, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>
              {request.message}
            </Box>
          ) : null}
          {!pending && request.reply ? (
            <Box sx={{ mt: 1, fontSize: 13.5, color: c.textSecondary, overflowWrap: "anywhere" }}>
              <Box component="span" sx={{ fontWeight: 700 }}>{s.listing.yourReply}: </Box>
              {request.reply}
            </Box>
          ) : null}
          {pending ? (
            <>
              <Collapse in={replyOpen} unmountOnExit>
                <TextField id={replyId} label={s.listing.reply} helperText={s.listing.replyHint} value={reply} onChange={(e) => setReply(e.target.value.slice(0, 500))} multiline minRows={2} fullWidth size="small" sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }} />
              </Collapse>
              <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                <Button variant="contained" onClick={() => onRespond(request, "approved", reply.trim())} startIcon={<Check size={16} weight="bold" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
                  {s.listing.approve}
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => onRespond(request, "rejected", reply.trim())} startIcon={<X size={16} weight="bold" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, borderColor: c.border, color: c.textSecondary }}>
                  {s.listing.decline}
                </Button>
                {!replyOpen ? (
                  <Button variant="text" onClick={() => setReplyOpen(true)} sx={{ minHeight: 44, color: c.accentText }}>
                    {s.listing.reply}
                  </Button>
                ) : null}
              </Box>
            </>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
}

/** One of my listings with the requests it received, waiting ones first. */
function ListingCard({ entry, onRespond, onRemove }) {
  const t = useRideTokens();
  const c = t.color;
  const { room, requests, pending } = entry;
  const sorted = [...requests].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9) || (b.createdAt || 0) - (a.createdAt || 0));
  const headingId = `hm-room-${room.id}`;
  return (
    <Panel radius="xl" component="article" aria-labelledby={headingId} sx={{ p: { xs: 1.75, sm: 2.25 }, borderTop: pending.length ? `4px solid ${t.brand.yellow}` : undefined }}>
      <Box sx={{ display: "flex", gap: 1.75, alignItems: "flex-start" }}>
        <RoomThumb room={room} size={80} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Box sx={{ minWidth: 0 }}>
              <Box component="h2" id={headingId} sx={{ m: 0, fontSize: 18, fontWeight: 770, lineHeight: 1.25, overflowWrap: "anywhere" }}>{room.title}</Box>
              <Box sx={{ mt: 0.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
                <Box component="span" sx={{ fontSize: 15, fontWeight: 800 }}>
                  {Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}
                  <Box component="span" sx={{ fontSize: 12.5, fontWeight: 600, color: c.textMuted }}> {HOUSING_STRINGS.results.perMonth}</Box>
                </Box>
                {room.location ? <Meta icon={MapPin}>{room.location}</Meta> : null}
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Button component={Link} href={`/housing/${room.id}`} size="small" startIcon={<ArrowSquareOut size={16} aria-hidden />} sx={{ minHeight: 40, color: c.textSecondary }}>
                {s.listing.view}
              </Button>
              <Button size="small" onClick={() => onRemove(entry)} startIcon={<Trash size={16} aria-hidden />} sx={{ minHeight: 40, color: c.danger }}>
                {s.listing.remove}
              </Button>
            </Box>
          </Box>
          <Box sx={{ mt: 0.75, fontSize: 13.5, fontWeight: 700, color: pending.length ? c.text : c.textMuted }}>
            {requests.length ? s.listing.requests(requests.length) : s.listing.noRequests}
          </Box>
        </Box>
      </Box>
      {sorted.length ? (
        <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 2, p: 0, display: "flex", flexDirection: "column", gap: 1.25 }}>
          {sorted.map((request) => (
            <Box component="li" key={request.id}>
              <IncomingRequest request={request} onRespond={onRespond} />
            </Box>
          ))}
        </Box>
      ) : null}
    </Panel>
  );
}

/** A request I sent: the room, its status, what I said and the owner's reply. */
function SentCard({ request, onCancel }) {
  const t = useRideTokens();
  const c = t.color;
  const room = request.room;
  const headingId = `hm-sent-${request.id}`;
  return (
    <Panel radius="xl" component="article" aria-labelledby={headingId} sx={{ p: { xs: 1.75, sm: 2.25 }, opacity: request.status === "cancelled" ? 0.75 : 1 }}>
      <Box sx={{ display: "flex", gap: 1.75, alignItems: "flex-start" }}>
        <RoomThumb room={room} size={88} />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <Box component="h2" id={headingId} sx={{ m: 0, fontSize: 17.5, fontWeight: 770, lineHeight: 1.25, overflowWrap: "anywhere" }}>
              {room ? (
                <Box component={Link} href={`/housing/${room.id}`} sx={{ color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  {room.title}
                </Box>
              ) : (
                HOUSING_STRINGS.detail.notFound.title
              )}
            </Box>
            <StatusStamp status={request.status} />
          </Box>
          <Box sx={{ mt: 0.5, display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            {room && Number.isFinite(room.rent) ? (
              <Box component="span" sx={{ fontSize: 15, fontWeight: 800 }}>
                {formatRupee(room.rent)}
                <Box component="span" sx={{ fontSize: 12.5, fontWeight: 600, color: c.textMuted }}> {HOUSING_STRINGS.results.perMonth}</Box>
              </Box>
            ) : null}
            {room?.location ? <Meta icon={MapPin}>{room.location}</Meta> : null}
          </Box>
          <Box sx={{ mt: 0.75, display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {request.moveIn ? <Meta icon={CalendarBlank}>{s.listing.moveIn(dateFmt.format(request.moveIn))}</Meta> : null}
            <Meta icon={Users}>{s.listing.people(request.occupants)}</Meta>
            {request.stay ? <Meta icon={Clock}>{request.stay}</Meta> : null}
          </Box>
        </Box>
      </Box>
      {request.reply ? (
        <Box sx={{ mt: 1.75, p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: request.status === "approved" ? c.successSoft : c.surfaceInteractive }}>
          <Box sx={{ fontSize: 12.5, fontWeight: 760, color: request.status === "approved" ? c.success : c.textOnInset }}>
            {s.sent.reply}
            {request.name ? ` · ${request.name}` : ""}
          </Box>
          <Box sx={{ mt: 0.5, fontSize: 14.5, lineHeight: 1.5, color: c.text, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{request.reply}</Box>
        </Box>
      ) : null}
      {request.status === "pending" ? (
        <Box sx={{ mt: 1.5, display: "flex", justifyContent: "flex-end" }}>
          <Button onClick={() => onCancel(request)} startIcon={<X size={16} aria-hidden />} sx={{ minHeight: 44, color: c.danger }}>
            {s.sent.cancel}
          </Button>
        </Box>
      ) : null}
    </Panel>
  );
}

function Confirm({ open, title, body, ok, keep, onOk, onClose }) {
  const t = useRideTokens();
  return (
    <Dialog open={open} onClose={onClose} container={typeof document === "undefined" ? undefined : document.body} aria-labelledby="hm-confirm-title" slotProps={{ paper: { sx: { borderRadius: `${t.radius.xl}px`, p: 1, maxWidth: 420 } } }}>
      <DialogTitle id="hm-confirm-title" sx={{ fontWeight: 760 }}>{title}</DialogTitle>
      <DialogContent sx={{ color: t.color.textSecondary, fontSize: 15, lineHeight: 1.5 }}>{body}</DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ minHeight: 44 }} autoFocus>{keep}</Button>
        <Button onClick={onOk} variant="contained" color="error" sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{ok}</Button>
      </DialogActions>
    </Dialog>
  );
}

function ManageContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const data = useManageRooms({ onError: (message) => notify({ message: message || s.listing.respondFailed, tone: "error" }) });
  const [tab, setTab] = useTabParam();
  const [confirm, setConfirm] = useState(null); // { kind: "room" | "request", item }

  const waiting = data.listings.reduce((sum, x) => sum + x.pending.length, 0);
  const approved = data.sent.filter((x) => x.status === "approved").length;
  const listings = [...data.listings].sort((a, b) => b.pending.length - a.pending.length);
  const sent = [...data.sent].sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9) || (b.createdAt || 0) - (a.createdAt || 0));

  const respond = async (request, status, reply) => {
    const result = await data.respond(request, status, reply);
    if (result.success) notify({ message: status === "approved" ? s.listing.approved(request.name) : s.listing.declined(request.name), tone: "success" });
  };

  const onConfirm = async () => {
    const current = confirm;
    setConfirm(null);
    if (!current) return;
    if (current.kind === "room") {
      const result = await data.removeRoom(current.item.room);
      notify(result.success ? { message: s.listing.removed, tone: "success" } : { message: result.error || s.listing.removeFailed, tone: "error" });
    } else {
      const result = await data.cancelRequest(current.item);
      notify(result.success ? { message: s.sent.cancelled, tone: "success" } : { message: result.error || s.sent.cancelFailed, tone: "error" });
    }
  };

  const items = tab === "listings" ? listings : sent;
  let body;
  if (data.status === "loading") {
    body = (
      <Box aria-busy="true" sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {[0, 1, 2].map((key) => <Skeleton key={key} variant="rounded" height={140} sx={{ borderRadius: `${t.radius.xl}px` }} />)}
      </Box>
    );
  } else if (data.status === "signedout") {
    const href = `/login?redirect=${encodeURIComponent(typeof window === "undefined" ? "/housing/manage" : window.location.pathname + window.location.search)}`;
    body = (
      <Panel radius="xl">
        <StateBlock title={s.signIn.title} body={s.signIn.body} action={<Button component={Link} href={href} variant="contained" sx={{ minHeight: 48, px: 4, borderRadius: `${t.radius.pill}px` }}>{s.signIn.cta}</Button>} />
      </Panel>
    );
  } else if (data.status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={data.reload} retryLabel={s.error.retry} /></Panel>;
  } else if (!items.length) {
    const empty = s.empty[tab];
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock
          title={empty.title}
          body={empty.body}
          action={
            <Button component={Link} href={tab === "listings" ? "/housing/post" : "/housing/search"} variant="contained" startIcon={tab === "listings" ? <Plus size={16} weight="bold" aria-hidden /> : <MagnifyingGlass size={16} aria-hidden />} sx={{ minHeight: 44 }}>
              {tab === "listings" ? s.post : s.find}
            </Button>
          }
        />
      </Panel>
    );
  } else {
    body = (
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        <AnimatePresence initial={false}>
          {items.map((item, index) => (
            <Box
              component={m.li}
              key={tab === "listings" ? item.room.id : item.id}
              layout={reduce ? false : "position"}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.26, delay: Math.min(index, 6) * 0.04, ease: t.motion.ease } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {tab === "listings" ? (
                <ListingCard entry={item} onRespond={respond} onRemove={(entry) => setConfirm({ kind: "room", item: entry })} />
              ) : (
                <SentCard request={item} onCancel={(request) => setConfirm({ kind: "request", item: request })} />
              )}
            </Box>
          ))}
        </AnimatePresence>
      </Box>
    );
  }

  const signedOut = data.status === "signedout";
  return (
    <Box sx={{ width: "100%", maxWidth: 960 + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href="/housing" variant="text" startIcon={<ArrowLeft size={16} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: c.textSecondary }}>{s.back}</Button>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 28, sm: 36, md: 42 }, lineHeight: 1.08, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>{s.title}</Box>
            <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>{s.lead}</Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button component={Link} href="/housing/search" variant="outlined" startIcon={<MagnifyingGlass size={17} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.find}</Button>
            <Button component={Link} href="/housing/post" variant="contained" startIcon={<Plus size={17} weight="bold" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.post}</Button>
          </Box>
        </Box>
        {data.status === "ready" ? (
          <Box component="ul" aria-label={s.stats.label} sx={{ listStyle: "none", m: 0, mt: 2, p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {[
              { key: "waiting", label: s.stats.waiting(waiting), strong: waiting > 0 },
              { key: "listings", label: s.stats.listings(data.listings.length) },
              { key: "approved", label: s.stats.approved(approved) },
            ].map((item) => (
              <Box component="li" key={item.key} sx={{ px: 1.5, py: 0.75, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, backgroundColor: item.strong ? c.highlight : c.surface, color: item.strong ? c.onHighlight : c.textSecondary, border: item.strong ? "1px solid transparent" : `1px solid ${c.border}` }}>
                {item.label}
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>

      {!signedOut ? (
        <Box sx={{ mb: 2.5 }}>
          <TabBar value={tab} onChange={setTab} counts={{ listings: waiting, sent: 0 }} />
        </Box>
      ) : null}

      <Box id="hm-panel" role={!signedOut ? "tabpanel" : undefined} aria-labelledby={!signedOut ? `hm-tab-${tab}` : undefined}>
        {body}
      </Box>

      <Confirm
        open={Boolean(confirm)}
        title={confirm?.kind === "room" ? s.listing.confirmTitle : s.sent.confirmTitle}
        body={confirm?.kind === "room" ? s.listing.confirmBody(confirm.item.pending.length) : s.sent.confirmBody}
        ok={confirm?.kind === "room" ? s.listing.confirmOk : s.sent.confirmOk}
        keep={confirm?.kind === "room" ? s.listing.keep : s.sent.keep}
        onOk={onConfirm}
        onClose={() => setConfirm(null)}
      />
    </Box>
  );
}

/** The Manage rooms page body. The route page renders the footer after it. */
export default function ManageRooms() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ManageContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
