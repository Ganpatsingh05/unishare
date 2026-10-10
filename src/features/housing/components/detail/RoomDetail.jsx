"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import {
  Bed,
  CalendarCheck,
  CaretLeft,
  CaretRight,
  Check,
  Clock,
  EnvelopeSimple,
  Heart,
  ImageSquare,
  InstagramLogo,
  MapPin,
  Minus,
  PaperPlaneTilt,
  Phone,
  Plus,
  ShareNetwork,
  SignIn,
} from "@phosphor-icons/react";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import { formatRupee } from "@features/rides/utils/rideFormat";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { HOUSING_STRINGS } from "../../constants/housingStrings";
import HousingTopBar from "../manage/HousingTopBar";
import useRoomDetail from "../../hooks/useRoomDetail";
import useShortlist from "../../hooks/useShortlist";
import { dayKey } from "../../utils/postRoom";

const s = HOUSING_STRINGS.detail;
const q = s.request;
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" });
const DAY = 86400000;

function ago(date) {
  if (!date) return "—";
  const days = Math.floor((Date.now() - date.getTime()) / DAY);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return dateFmt.format(date);
}

/** Large photo with arrows, swipe, arrow keys and a thumbnail strip. */
function Gallery({ photos, title }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const n = photos.length;
  const go = (next) => {
    setDir(next > index || (index === n - 1 && next === 0) ? 1 : -1);
    setIndex((next + n) % n);
  };
  if (!n) {
    return (
      <Box sx={{ aspectRatio: "16 / 10", borderRadius: `${t.radius.xl}px`, backgroundColor: c.surfaceInteractive, display: "grid", placeItems: "center", color: c.textOnInset }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, fontWeight: 650 }}>
          <ImageSquare size={44} weight="duotone" aria-hidden />
          {s.noPhotos}
        </Box>
      </Box>
    );
  }
  const arrow = (side) => (
    <IconButton
      aria-label={side === "left" ? s.prev : s.next}
      onClick={() => go(index + (side === "left" ? -1 : 1))}
      sx={{ position: "absolute", top: "50%", [side]: 12, mt: "-22px", width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.9)", color: t.brand.inkNavy, boxShadow: t.elevation[2], "&:hover": { backgroundColor: "#fff" } }}
    >
      {side === "left" ? <CaretLeft size={20} weight="bold" aria-hidden /> : <CaretRight size={20} weight="bold" aria-hidden />}
    </IconButton>
  );
  return (
    <Box>
      <Box
        role="region"
        aria-roledescription="carousel"
        aria-label={title}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") go(index - 1);
          if (e.key === "ArrowRight") go(index + 1);
        }}
        sx={{ position: "relative", aspectRatio: { xs: "4 / 3", md: "16 / 10" }, borderRadius: `${t.radius.xl}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive, outline: "none", "&:focus-visible": { boxShadow: `0 0 0 3px ${c.focus}` } }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <Box
            key={photos[index]}
            component={m.img}
            src={photos[index]}
            alt={s.photo(index + 1, n)}
            custom={dir}
            initial={reduce ? false : { x: `${dir * 8}%`, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: `${-dir * 8}%`, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={n > 1 && !reduce ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              else if (info.offset.x > 60) go(index - 1);
            }}
            sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", cursor: n > 1 ? "grab" : "default" }}
          />
        </AnimatePresence>
        {n > 1 ? (
          <>
            {arrow("left")}
            {arrow("right")}
            <Box aria-live="polite" sx={{ position: "absolute", right: 14, bottom: 14, px: 1.25, py: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: "rgba(8,18,32,0.7)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
              {index + 1} / {n}
            </Box>
          </>
        ) : null}
      </Box>
      {n > 1 ? (
        <Box sx={{ display: "flex", gap: 1, mt: 1.25, overflowX: "auto", pb: 0.5 }}>
          {photos.map((src, i) => (
            <ButtonBase
              key={src}
              onClick={() => go(i)}
              aria-label={s.photo(i + 1, n)}
              aria-current={i === index}
              sx={{ flex: "0 0 auto", width: 84, height: 64, borderRadius: `${t.radius.md}px`, overflow: "hidden", opacity: i === index ? 1 : 0.6, outline: i === index ? `3px solid ${t.brand.yellow}` : "none", outlineOffset: -3, transition: "opacity 160ms ease", "&:hover": { opacity: 1 }, "&.Mui-focusVisible": { outline: `3px solid ${c.focus}` } }}
            >
              <Box component="img" src={src} alt="" loading="lazy" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </ButtonBase>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function Fact({ icon: Icon, label, value }) {
  const t = useRideTokens();
  return (
    <Box sx={{ p: 1.75, borderRadius: `${t.radius.lg}px`, backgroundColor: t.color.surfaceInteractive, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 12.5, fontWeight: 700, color: t.color.textOnInset }}>
        <Icon size={16} weight="duotone" aria-hidden />
        {label}
      </Box>
      <Box sx={{ mt: 0.5, fontSize: 16, fontWeight: 760, color: t.color.text }}>{value}</Box>
    </Box>
  );
}

function ContactCard({ contact, isAuthenticated }) {
  const t = useRideTokens();
  const c = t.color;
  const items = [
    contact.mobile ? { icon: Phone, text: contact.mobile, href: `tel:${contact.mobile.replace(/\s/g, "")}` } : null,
    contact.email ? { icon: EnvelopeSimple, text: contact.email, href: `mailto:${contact.email}` } : null,
    contact.instagram ? { icon: InstagramLogo, text: contact.instagram.startsWith("@") ? contact.instagram : `@${contact.instagram}`, href: `https://instagram.com/${contact.instagram.replace(/^@/, "")}` } : null,
  ].filter(Boolean);
  if (!items.length) return null;
  return (
    <Box>
      <Box component="h2" sx={{ m: 0, mb: 1.25, fontSize: 18, fontWeight: 760 }}>{s.contact}</Box>
      {isAuthenticated ? (
        <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "flex", flexWrap: "wrap", gap: 1 }}>
          {items.map(({ icon: Icon, text, href }) => (
            <Box component="li" key={href}>
              <Button component="a" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" variant="outlined" startIcon={<Icon size={18} weight="duotone" aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, textTransform: "none" }}>
                {text}
              </Button>
            </Box>
          ))}
        </Box>
      ) : (
        <Button component={Link} href={`/login?redirect=${encodeURIComponent(typeof window === "undefined" ? "/housing" : window.location.pathname)}`} variant="outlined" startIcon={<SignIn size={18} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, color: c.textSecondary }}>
          {s.contactSignIn}
        </Button>
      )}
    </Box>
  );
}

/** Request form: move-in date, people, stay length and a message. */
function RequestPanel({ room, data }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const earliest = room.moveIn && dayKey(room.moveIn) > dayKey() ? dayKey(room.moveIn) : dayKey();
  const [moveIn, setMoveIn] = useState(earliest);
  const [people, setPeople] = useState(1);
  const [stay, setStay] = useState(q.stays[0]);
  const [message, setMessage] = useState(q.messageDefault);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  useEffect(() => setMoveIn(earliest), [earliest]);

  const errors = shown ? { message: message.trim().length < 10 ? q.tooShort : null, moveIn: !moveIn || moveIn < dayKey() ? q.pastDate : null } : {};
  const submit = async (e) => {
    e.preventDefault();
    setShown(true);
    if (message.trim().length < 10 || !moveIn || moveIn < dayKey()) return;
    setBusy(true);
    const email = data.userEmail;
    const result = await data.sendRequest({
      message: `${message.trim()}${email ? `\n\nContact me via email: ${email}` : ""}`.slice(0, 1000),
      contactMethod: "email",
      moveInDate: moveIn,
      stayDuration: stay,
      occupants: people,
    });
    setBusy(false);
    if (result.success) setSent(true);
    else notify({ message: result.error || q.failed, tone: "error" });
  };

  const header = (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.5, mb: 0.5 }}>
      <Box sx={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em" }}>{Number.isFinite(room.rent) ? formatRupee(room.rent) : "—"}</Box>
      <Box sx={{ fontSize: 14, color: c.textMuted }}>{s.perMonth}</Box>
    </Box>
  );

  let content;
  if (data.isOwner) content = (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        <Box sx={{ color: c.textSecondary, fontWeight: 600 }}>{q.own}</Box>
        <Button component={Link} href="/housing/manage" variant="contained" fullWidth sx={{ minHeight: 48, borderRadius: `${t.radius.pill}px` }}>{q.manage}</Button>
      </Box>
    );
  else if (!data.isAuthenticated) {
    content = (
      <Button component={Link} href={`/login?redirect=${encodeURIComponent(typeof window === "undefined" ? "/housing" : window.location.pathname)}`} variant="contained" fullWidth size="large" startIcon={<SignIn size={18} aria-hidden />} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px` }}>
        {q.signIn}
      </Button>
    );
  } else if (sent || data.requested) {
    content = (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.25, py: 1 }}>
        <Box component={m.div} initial={reduce ? false : { scale: 0.5, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12 }} sx={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
          <Check size={28} weight="bold" aria-hidden />
        </Box>
        <Box sx={{ fontSize: 17, fontWeight: 760 }}>{sent ? q.sent : q.already}</Box>
        {sent ? <Box sx={{ fontSize: 14, color: c.textSecondary }}>{q.sentBody}</Box> : null}
        <Button component={Link} href="/housing/manage?tab=sent" variant="text" sx={{ minHeight: 44 }}>{q.activity}</Button>
      </Box>
    );
  } else {
    content = (
      <Box component="form" noValidate onSubmit={submit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField type="date" label={q.moveIn} value={moveIn} onChange={(e) => setMoveIn(e.target.value)} error={Boolean(errors.moveIn)} helperText={errors.moveIn} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: dayKey() } }} sx={{ "& input": { colorScheme: t.mode }, "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }} />
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box id="rd-people" sx={{ fontSize: 14, fontWeight: 700 }}>{q.occupants}</Box>
          <Box role="group" aria-labelledby="rd-people" sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <IconButton aria-label={q.fewer} disabled={people <= 1} onClick={() => setPeople(people - 1)} sx={{ width: 40, height: 40, border: `1px solid ${c.border}` }}><Minus size={16} aria-hidden /></IconButton>
            <Box aria-live="polite" sx={{ minWidth: 20, textAlign: "center", fontSize: 18, fontWeight: 760 }}>{people}</Box>
            <IconButton aria-label={q.more} disabled={people >= 20} onClick={() => setPeople(people + 1)} sx={{ width: 40, height: 40, border: `1px solid ${c.border}` }}><Plus size={16} aria-hidden /></IconButton>
          </Box>
        </Box>
        <Box>
          <Box id="rd-stay" sx={{ fontSize: 14, fontWeight: 700, mb: 0.75 }}>{q.stay}</Box>
          <Box role="radiogroup" aria-labelledby="rd-stay" sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {q.stays.map((option) => {
              const on = option === stay;
              return (
                <ButtonBase key={option} role="radio" aria-checked={on} onClick={() => setStay(option)} sx={{ minHeight: 38, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
                  {option}
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
        <TextField label={q.message} value={message} onChange={(e) => setMessage(e.target.value.slice(0, 900))} error={Boolean(errors.message)} helperText={errors.message || q.messageHint(message.length)} multiline minRows={3} sx={{ "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }} />
        <Button type="submit" variant="contained" size="large" disabled={busy} endIcon={<PaperPlaneTilt size={18} weight="fill" aria-hidden />} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>
          {busy ? q.sending : q.send}
        </Button>
      </Box>
    );
  }

  return (
    <Panel radius="xl" component="aside" aria-labelledby="rd-request-title" sx={{ p: 2.5 }}>
      {header}
      <Box component="h2" id="rd-request-title" sx={{ m: 0, fontSize: 17, fontWeight: 760 }}>{q.title}</Box>
      <Box sx={{ fontSize: 13.5, color: c.textMuted, mt: 0.5, mb: 2 }}>{q.lead}</Box>
      {content}
    </Panel>
  );
}

function DetailContent({ roomId }) {
  const t = useRideTokens();
  const c = t.color;
  const { notify } = useRideFeedback();
  const data = useRoomDetail(roomId);
  const shortlist = useShortlist();
  const { room, status } = data;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: room?.title, url });
      else {
        await navigator.clipboard.writeText(url);
        notify({ message: s.copied, tone: "success" });
      }
    } catch {
      // Share sheet dismissed.
    }
  };

  let body;
  if (status === "loading") {
    body = (
      <Box aria-busy="true" aria-label={s.loading} sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 380px" } }}>
        <Skeleton variant="rounded" sx={{ aspectRatio: "16 / 10", height: "auto", borderRadius: `${t.radius.xl}px` }} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: `${t.radius.xl}px` }} />
      </Box>
    );
  } else if (status === "notfound") {
    body = (
      <Panel radius="xl"><StateBlock title={s.notFound.title} body={s.notFound.body} action={<Button component={Link} href="/housing/search" variant="contained" sx={{ minHeight: 44 }}>{s.notFound.cta}</Button>} /></Panel>
    );
  } else if (status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={data.reload} retryLabel={s.error.retry} /></Panel>;
  } else {
    const saved = shortlist.has(room.id);
    const available = !room.moveIn || room.moveIn <= new Date() ? HOUSING_STRINGS.results.availableNow : dateFmt.format(room.moveIn);
    body = (
      <Box sx={{ display: "grid", gap: { xs: 3, lg: 4 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 380px" }, alignItems: "start" }}>
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          <Gallery photos={room.photos} title={room.title} />
          <Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box sx={{ minWidth: 0 }}>
                <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 26, md: 34 }, lineHeight: 1.12, fontWeight: t.typography.displayWeight, letterSpacing: "-0.02em" }}>{room.title}</Box>
                {room.location ? (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 0.75, fontSize: 15.5, color: c.textSecondary }}>
                    <MapPin size={18} weight="duotone" aria-hidden />
                    {room.location}
                  </Box>
                ) : null}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="outlined" onClick={() => (saved ? shortlist.remove(room.id) : shortlist.add(room.id))} aria-pressed={saved} startIcon={<Heart size={18} weight={saved ? "fill" : "regular"} color={saved ? t.brand.yellowDeep : undefined} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>
                  {saved ? s.saved : s.save}
                </Button>
                <Button variant="outlined" onClick={share} startIcon={<ShareNetwork size={18} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.share}</Button>
              </Box>
            </Box>
            <Box sx={{ mt: 2.5, display: "grid", gap: 1.25, gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
              <Fact icon={Bed} label={s.facts.beds} value={room.beds} />
              <Fact icon={CalendarCheck} label={s.facts.moveIn} value={available} />
              <Fact icon={Clock} label={s.facts.listed} value={ago(room.createdAt)} />
            </Box>
          </Box>
          <Box>
            <Box component="h2" sx={{ m: 0, mb: 1, fontSize: 18, fontWeight: 760 }}>{s.about}</Box>
            <Box sx={{ fontSize: 15.5, lineHeight: 1.65, color: room.description ? c.textSecondary : c.textMuted, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{room.description || s.noDescription}</Box>
          </Box>
          <ContactCard contact={room.contact} isAuthenticated={data.isAuthenticated} />
        </Box>
        <Box sx={{ position: { lg: "sticky" }, top: { lg: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` } }}>
          <RequestPanel room={room} data={data} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <HousingTopBar backHref="/housing/search" backLabel={s.back} sx={{ mb: 2 }} />
      {body}
    </Box>
  );
}

/** Room details page body. The route page renders the footer after it. */
export default function RoomDetail({ roomId }) {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <DetailContent roomId={roomId} />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
