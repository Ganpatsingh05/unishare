"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { m, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon as ArrowLeft } from "@solar-icons/react/linear/arrow-left";
import { ArrowRightIcon as ArrowRight } from "@solar-icons/react/linear/arrow-right";
import { MapPointIcon as MapPoint } from "@solar-icons/react/bold-duotone/map-point";
import { CalendarIcon as Calendar } from "@solar-icons/react/bold-duotone/calendar";
import { ClockCircleIcon as ClockCircle } from "@solar-icons/react/bold-duotone/clock-circle";
import { ShieldCheckIcon as ShieldCheck } from "@solar-icons/react/bold-duotone/shield-check";
import { ShareIcon as Share } from "@solar-icons/react/bold-duotone/share";
import { PhoneIcon as Phone } from "@solar-icons/react/bold-duotone/phone";
import { LetterIcon as Letter } from "@solar-icons/react/bold-duotone/letter";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import { CheckCircleIcon as CheckCircle } from "@solar-icons/react/bold-duotone/check-circle";
import { UserRoundedIcon as UserRounded } from "@solar-icons/react/bold-duotone/user-rounded";
import InstagramLogo from "@components/ui/icons/InstagramIcon";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { useAuth } from "@contexts/UniShareContext";
import { apiCall } from "@lib/api/base";
import { marketplaceAPI } from "@lib/api/requests";
import { MARKET_STRINGS } from "../constants/marketStrings";
import { ageText, normalizeItem, rupees } from "../utils/itemModel";
import { categoryIcon, conditionColor } from "./marketIcons";

const S = MARKET_STRINGS;
const s = S.detail;
const q = s.request;
const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long" });

/** One item (GET /api/itemsell/:id) and whether the signed-in student has asked about it. */
function useItem(itemId) {
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState({ status: "loading", item: null });
  const [requested, setRequested] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState({ status: "loading", item: null });
    apiCall(`/api/itemsell/${encodeURIComponent(itemId)}`, { method: "GET", cache: false })
      .then((result) => {
        if (!alive) return;
        if (!result?.data) setState({ status: "notfound", item: null });
        else setState({ status: "ready", item: normalizeItem(result.data) });
      })
      .catch((error) => alive && setState({ status: error?.status === 404 || /not found/i.test(error?.message || "") ? "notfound" : "error", item: null }));
    return () => {
      alive = false;
    };
  }, [itemId, nonce]);

  useEffect(() => {
    if (!isAuthenticated) return;
    marketplaceAPI
      .getSentRequests()
      .then((result) => setRequested((result?.data || []).some((r) => String(r.item_id ?? r.item?.id) === String(itemId) && r.status !== "cancelled")))
      .catch(() => {});
  }, [isAuthenticated, itemId]);

  const own = Boolean(user?.id && state.item?.sellerId && String(user.id) === String(state.item.sellerId));
  return { ...state, requested, setRequested, own, isAuthenticated, email: user?.email || "", reload: () => setNonce((n) => n + 1) };
}

function Fact({ icon: Icon, label, value, color }) {
  const t = useRideTokens();
  return (
    <Box sx={{ p: 1.5, borderRadius: `${t.radius.md}px`, backgroundColor: t.color.surfaceInteractive, minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, fontSize: 12.5, fontWeight: 700, color: t.color.textOnInset }}>
        <Icon size={16} aria-hidden />
        {label}
      </Box>
      <Box sx={{ mt: 0.4, display: "flex", alignItems: "center", gap: 0.75, fontSize: 15, fontWeight: 760, color: t.color.text, overflowWrap: "anywhere" }}>
        {color ? <Box component="span" aria-hidden sx={{ flexShrink: 0, width: 9, height: 9, borderRadius: "50%", backgroundColor: color }} /> : null}
        {value}
      </Box>
    </Box>
  );
}

function contactLinks(contact) {
  const out = [];
  if (contact.mobile) out.push({ icon: Phone, text: contact.mobile, href: `tel:${String(contact.mobile).replace(/(?!^\+)[^\d]/g, "")}` });
  if (contact.email) out.push({ icon: Letter, text: contact.email, href: `mailto:${contact.email}` });
  if (contact.instagram) {
    const handle = String(contact.instagram).replace(/^@/, "").replace(/[^a-zA-Z0-9._]/g, "");
    if (handle) out.push({ icon: InstagramLogo, text: `@${handle}`, href: `https://instagram.com/${handle}` });
  }
  return out;
}

/** "Ask to buy": optional offer, pickup preference and a message (POST /api/itemsell/:id/request). */
function RequestPanel({ data }) {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { item } = data;
  const [offer, setOffer] = useState("");
  const [pickup, setPickup] = useState(q.pickups[0]);
  const [message, setMessage] = useState(q.messageDefault);
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const offerBad = offer.trim() !== "" && !(Number(offer) >= 0);
  const errors = shown ? { message: message.trim() ? null : q.tooShort, offer: offerBad ? q.badOffer : null } : {};

  const send = async (e) => {
    e.preventDefault();
    setShown(true);
    if (!message.trim() || offerBad) return;
    setBusy(true);
    try {
      await marketplaceAPI.sendRequest(item.id, {
        message: `${message.trim()}${data.email ? `\n\nContact me via email: ${data.email}` : ""}`.slice(0, 500),
        contactMethod: "email",
        ...(offer.trim() ? { offeredPrice: Number(offer) } : {}),
        pickupPreference: pickup,
      });
      setSent(true);
      data.setRequested(true);
    } catch (error) {
      notify({ message: error?.message || q.failed, tone: "error" });
    } finally {
      setBusy(false);
    }
  };

  let content;
  if (data.own) content = <Box sx={{ color: c.textSecondary, fontWeight: 600 }}>{q.own}</Box>;
  else if (!data.isAuthenticated) {
    content = (
      <Button component={Link} href={`/login?redirect=${encodeURIComponent(`/marketplace/buy/${item.id}`)}`} variant="contained" fullWidth size="large" startIcon={<Login2 size={20} aria-hidden />} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px` }}>{q.signIn}</Button>
    );
  } else if (sent || data.requested) {
    content = (
      <Box role="status" sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 1.25, py: 1 }}>
        <Box component={m.div} initial={reduce ? false : { scale: 0.5, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 180, damping: 12 }} sx={{ display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", backgroundColor: t.brand.yellow, color: t.brand.inkNavy }}>
          <CheckCircle size={30} aria-hidden />
        </Box>
        <Box sx={{ fontSize: 17, fontWeight: 760 }}>{sent ? q.sent : q.already}</Box>
        {sent ? <Box sx={{ fontSize: 14, color: c.textSecondary }}>{q.sentBody}</Box> : null}
        <Button component={Link} href="/my-activity" variant="text" endIcon={<ArrowRight size={18} aria-hidden />} sx={{ minHeight: 44 }}>{q.activity}</Button>
      </Box>
    );
  } else {
    const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };
    content = (
      <Box component="form" noValidate onSubmit={send} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label={q.offer} value={offer} onChange={(e) => setOffer(e.target.value.replace(/[^\d.]/g, "").slice(0, 8))} error={Boolean(errors.offer)} helperText={errors.offer || q.offerHint(rupees(item.price))} sx={field} slotProps={{ htmlInput: { inputMode: "decimal" }, input: { startAdornment: <InputAdornment position="start">₹</InputAdornment> } }} />
        <Box>
          <Box id="mk-pickup" sx={{ fontSize: 14, fontWeight: 700, mb: 0.75 }}>{q.pickup}</Box>
          <Box role="radiogroup" aria-labelledby="mk-pickup" sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
            {q.pickups.map((option) => {
              const on = option === pickup;
              return (
                <ButtonBase key={option} role="radio" aria-checked={on} onClick={() => setPickup(option)} sx={{ minHeight: 38, px: 1.5, borderRadius: `${t.radius.pill}px`, fontSize: 13.5, fontWeight: 700, border: `1px solid ${on ? "transparent" : c.border}`, backgroundColor: on ? t.brand.yellow : c.surface, color: on ? t.brand.inkNavy : c.textSecondary, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 2 } }}>
                  {option}
                </ButtonBase>
              );
            })}
          </Box>
        </Box>
        <TextField label={q.message} value={message} onChange={(e) => setMessage(e.target.value.slice(0, 450))} error={Boolean(errors.message)} helperText={errors.message || q.messageHint(message.length)} multiline minRows={3} sx={field} />
        <Button type="submit" variant="contained" size="large" disabled={busy} endIcon={<ArrowRight size={20} aria-hidden />} sx={{ minHeight: 52, borderRadius: `${t.radius.pill}px`, fontSize: 16 }}>{busy ? q.sending : q.send}</Button>
      </Box>
    );
  }

  return (
    <Panel radius="xl" component="aside" aria-labelledby="mk-request-title" sx={{ p: 2.5 }}>
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.5 }}>
        <Box sx={{ fontSize: 32, fontWeight: 850, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>{item.price === 0 ? S.card.free : rupees(item.price)}</Box>
      </Box>
      <Box component="h2" id="mk-request-title" sx={{ m: 0, fontSize: 17, fontWeight: 760 }}>{q.title}</Box>
      <Box sx={{ fontSize: 13.5, color: c.textMuted, mt: 0.5, mb: 2 }}>{q.lead}</Box>
      {content}
    </Panel>
  );
}

function DetailContent({ itemId }) {
  const t = useRideTokens();
  const c = t.color;
  const dark = t.mode === "dark";
  const { notify } = useRideFeedback();
  const data = useItem(itemId);
  const { item, status } = data;

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: item?.title, url });
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
        <Skeleton variant="rounded" sx={{ aspectRatio: "4 / 3", height: "auto", borderRadius: `${t.radius.xl}px` }} />
        <Skeleton variant="rounded" height={420} sx={{ borderRadius: `${t.radius.xl}px` }} />
      </Box>
    );
  } else if (status === "notfound") {
    body = <Panel radius="xl"><StateBlock title={s.notFound.title} body={s.notFound.body} action={<Button component={Link} href="/marketplace/buy" variant="contained" sx={{ minHeight: 44 }}>{s.notFound.cta}</Button>} /></Panel>;
  } else if (status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={data.reload} retryLabel={s.error.retry} /></Panel>;
  } else {
    const Icon = categoryIcon(item.category);
    const links = contactLinks(item.contact);
    const available = !item.availableFrom || item.availableFrom <= new Date() ? s.availableNow : dateFmt.format(item.availableFrom);
    body = (
      <Box sx={{ display: "grid", gap: { xs: 3, lg: 4 }, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 380px" }, alignItems: "start" }}>
        <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ position: "relative", aspectRatio: { xs: "1 / 1", sm: "4 / 3" }, borderRadius: `${t.radius.xl}px`, overflow: "hidden", backgroundColor: c.surfaceInteractive, display: "grid", placeItems: "center", color: c.textOnInset }}>
            {item.photo ? <Box component="img" src={item.photo} alt={item.title} sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", backgroundColor: dark ? "#0B1220" : "#F1F5FB" }} /> : <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, fontWeight: 650 }}><Icon size={64} aria-hidden />{s.noPhoto}</Box>}
          </Box>
          <Box>
            <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box component="h1" sx={{ m: 0, minWidth: 0, fontFamily: t.typography.family, fontSize: { xs: 26, md: 34 }, lineHeight: 1.12, fontWeight: t.typography.displayWeight, letterSpacing: "-0.02em", overflowWrap: "anywhere" }}>{item.title}</Box>
              <Button variant="outlined" onClick={share} startIcon={<Share size={18} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.share}</Button>
            </Box>
            <Box sx={{ mt: 2.25, display: "grid", gap: 1.25, gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" } }}>
              <Fact icon={ShieldCheck} label={s.facts.condition} value={S.conditions[item.condition]} color={conditionColor(item.condition, dark)} />
              <Fact icon={Icon} label={s.facts.category} value={S.categories[item.category]} />
              <Fact icon={MapPoint} label={s.facts.location} value={item.location || "—"} />
              <Fact icon={Calendar} label={s.facts.available} value={available} />
            </Box>
          </Box>
          <Box>
            <Box component="h2" sx={{ m: 0, mb: 1, fontSize: 18, fontWeight: 760 }}>{s.about}</Box>
            <Box sx={{ fontSize: 15.5, lineHeight: 1.65, color: item.description ? c.textSecondary : c.textMuted, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{item.description || s.noDescription}</Box>
          </Box>
          <Panel variant="flat" radius="lg" sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            <Box aria-hidden sx={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: "50%", backgroundColor: c.actionSoft, color: c.accentText }}>
              <UserRounded size={24} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Box sx={{ fontSize: 12.5, fontWeight: 700, color: c.textMuted }}>{s.seller}</Box>
              <Box sx={{ fontSize: 16, fontWeight: 760 }}>{item.seller || "—"}</Box>
            </Box>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6, fontSize: 13, color: c.textMuted }}>
              <ClockCircle size={16} aria-hidden />
              {s.facts.listed} {ageText(item.createdAt, S.when).toLowerCase()}
            </Box>
          </Panel>
          {links.length ? (
            <Box>
              <Box component="h2" sx={{ m: 0, mb: 1.25, fontSize: 18, fontWeight: 760 }}>{s.contact}</Box>
              {data.isAuthenticated ? (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {links.map(({ icon: LinkIcon, text, href }) => (
                    <Button key={href} component="a" href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" variant="outlined" startIcon={<LinkIcon size={19} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px`, textTransform: "none" }}>{text}</Button>
                  ))}
                </Box>
              ) : (
                <Button component={Link} href={`/login?redirect=${encodeURIComponent(`/marketplace/buy/${item.id}`)}`} variant="outlined" startIcon={<Login2 size={19} aria-hidden />} sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.contactSignIn}</Button>
              )}
            </Box>
          ) : null}
        </Box>
        <Box sx={{ position: { lg: "sticky" }, top: { lg: `${(t.layout.stickyTop + 16) / t.layout.pageZoom}px` } }}>
          <RequestPanel data={data} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", maxWidth: t.layout.maxWidth + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Button component={Link} href="/marketplace/buy" variant="text" startIcon={<ArrowLeft size={18} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 2, color: c.textSecondary }}>{s.back}</Button>
      {body}
    </Box>
  );
}

/** Marketplace item page body. The route page renders the footer after it. */
export default function ItemDetail({ itemId }) {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <DetailContent itemId={itemId} />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
