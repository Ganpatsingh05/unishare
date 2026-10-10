"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ArrowRightIcon as ArrowRight } from "@solar-icons/react/linear/arrow-right";
import { CheckCircleIcon as CheckCircle } from "@solar-icons/react/bold-duotone/check-circle";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import { useAuth } from "@contexts/UniShareContext";
import { lostFoundAPI } from "@lib/api/requests";
import { LOST_FOUND_STRINGS } from "../../constants/lostFoundStrings";

const s = LOST_FOUND_STRINGS.claim;

/**
 * Respond to a post from its quick view (POST /api/lostfound/:id/request):
 * "This is mine" on found items (with an optional proof), "I found it" on
 * lost items. Signed-in students only, and not on your own post.
 */
export default function ClaimForm({ item }) {
  const t = useRideTokens();
  const c = t.color;
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [proof, setProof] = useState("");
  const [shown, setShown] = useState(false);
  const [state, setState] = useState("idle"); // idle | sending | sent | already | failed
  const kind = item.mode; // "found" → claim, "lost" → I found it
  const own = Boolean(user?.id && item.ownerId && String(user.id) === String(item.ownerId));

  // Already responded to this post?
  useEffect(() => {
    if (!isAuthenticated || own) return undefined;
    let alive = true;
    lostFoundAPI
      .getSentRequests()
      .then((result) => {
        const list = result?.data || [];
        if (alive && list.some((r) => String(r.item_id ?? r.item?.id) === String(item.id) && r.status !== "cancelled")) setState("already");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [isAuthenticated, own, item.id]);

  const box = { p: 2, borderRadius: `${t.radius.lg}px`, border: `1px solid ${c.border}`, backgroundColor: c.surface };
  const heading = <Box component="h3" sx={{ m: 0, fontSize: 16, fontWeight: 780 }}>{s.title[kind]}</Box>;

  if (own) return null;
  if (!isAuthenticated) {
    const href = `/login?redirect=${encodeURIComponent(typeof window === "undefined" ? "/lost-found" : window.location.pathname)}`;
    return (
      <Box sx={box}>
        {heading}
        <Button component={Link} href={href} variant="outlined" startIcon={<Login2 size={19} aria-hidden />} sx={{ mt: 1.25, minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{s.signIn}</Button>
      </Box>
    );
  }
  if (state === "sent" || state === "already") {
    return (
      <Box role="status" sx={{ ...box, display: "flex", alignItems: "center", gap: 1.25, backgroundColor: c.successSoft, borderColor: "transparent" }}>
        <CheckCircle size={26} color={c.success} aria-hidden />
        <Box sx={{ fontSize: 14.5, fontWeight: 700 }}>{state === "sent" ? s.sent : s.already}</Box>
      </Box>
    );
  }

  const short = message.trim().length < 10;
  const send = async (e) => {
    e.preventDefault();
    setShown(true);
    if (short) return;
    setState("sending");
    const email = user?.email;
    try {
      await lostFoundAPI.sendRequest(item.id, {
        message: `${message.trim()}${email ? `\n\nContact me via email: ${email}` : ""}`.slice(0, 1000),
        contactMethod: "email",
        ...(kind === "found" && proof.trim() ? { proofDescription: proof.trim() } : {}),
      });
      setState("sent");
    } catch (error) {
      setState(/already/i.test(error?.message || "") ? "already" : "failed");
    }
  };

  return (
    <Box component="form" noValidate onSubmit={send} sx={{ ...box, display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box>
        {heading}
        <Box sx={{ mt: 0.25, fontSize: 13.5, color: c.textSecondary }}>{s.lead[kind]}</Box>
      </Box>
      <TextField
        label={s.message[kind]}
        value={message}
        onChange={(e) => setMessage(e.target.value.slice(0, 900))}
        error={shown && short}
        helperText={shown && short ? s.tooShort : s.messageHint(message.length)}
        multiline
        minRows={2}
        size="small"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }}
      />
      {kind === "found" ? (
        <TextField label={s.proof} placeholder={s.proofHint} value={proof} onChange={(e) => setProof(e.target.value.slice(0, 1000))} size="small" sx={{ "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } }} />
      ) : null}
      {state === "failed" ? <Box role="alert" sx={{ fontSize: 13.5, fontWeight: 700, color: c.danger }}>{s.failed}</Box> : null}
      <Button type="submit" variant="contained" disabled={state === "sending"} endIcon={<ArrowRight size={18} aria-hidden />} sx={{ alignSelf: "flex-start", minHeight: 44, px: 2.5, borderRadius: `${t.radius.pill}px` }}>
        {state === "sending" ? s.sending : s.send}
      </Button>
    </Box>
  );
}
