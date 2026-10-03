"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { ArrowLeftIcon as ArrowLeft } from "@solar-icons/react/linear/arrow-left";
import { BookmarkOpenedIcon as BookmarkOpened } from "@solar-icons/react/bold-duotone/bookmark-opened";
import { PenIcon as Pen } from "@solar-icons/react/bold-duotone/pen";
import { EyeIcon as Eye } from "@solar-icons/react/bold-duotone/eye";
import { TrashBinTrashIcon as TrashBinTrash } from "@solar-icons/react/bold-duotone/trash-bin-trash";
import { Login2Icon as Login2 } from "@solar-icons/react/bold-duotone/login-2";
import { InfoCircleIcon as InfoCircle } from "@solar-icons/react/bold-duotone/info-circle";
import RideThemeBridge, { useRideTokens } from "@features/rides/theme/RideThemeBridge";
import useRideFeedback, { RideFeedbackProvider } from "@features/rides/hooks/useRideFeedback";
import Panel from "@features/rides/components/landing/primitives/Panel";
import StateBlock from "@features/rides/components/landing/primitives/StateBlock";
import { useAuth } from "@contexts/UniShareContext";
import { RESOURCE_STRINGS } from "../../constants/resourceStrings";
import { deleteMyResource, getMyResources, updateMyResource } from "../../services/resources.service";
import { normalizeResource, safeUrl } from "../../utils/resourceModel";
import { LIMITS, toPayload, validateSuggestion } from "../../utils/suggestResource";
import ResourceCard from "../landing/ResourceCard";
import { CategoryPicker, Counter, InReviewStamp, LinkField, LiveStamp, TagInput, TypePicker } from "../suggest/fields";

const S = RESOURCE_STRINGS;
const s = S.manage;
const FILTERS = ["all", "review", "live"];

/** The signed-in student's suggestions (GET /api/resources/my). */
function useMine(enabled) {
  const [state, setState] = useState({ status: "loading", list: [] });
  const [nonce, setNonce] = useState(0);
  useEffect(() => {
    if (!enabled) return undefined;
    let alive = true;
    setState((prev) => ({ ...prev, status: "loading" }));
    getMyResources().then((result) => {
      if (!alive) return;
      if (!result?.success) {
        setState({ status: "error", list: [] });
        return;
      }
      const list = (result.data || []).map((raw) => ({ ...normalizeResource(raw), active: raw.active === true, rawUrl: raw.url || "" }));
      list.sort((a, b) => Number(a.active) - Number(b.active) || (b.createdAt || 0) - (a.createdAt || 0));
      setState({ status: "ready", list });
    });
    return () => {
      alive = false;
    };
  }, [enabled, nonce]);
  const patch = useCallback((id, next) => setState((prev) => ({ ...prev, list: prev.list.map((r) => (r.id === id ? { ...r, ...next } : r)) })), []);
  const drop = useCallback((id) => setState((prev) => ({ ...prev, list: prev.list.filter((r) => r.id !== id) })), []);
  return { ...state, reload: () => setNonce((n) => n + 1), patch, drop };
}

function FilterBar({ value, onChange, counts }) {
  const t = useRideTokens();
  const c = t.color;
  return (
    <Box role="radiogroup" aria-label={s.filterLabel} sx={{ display: "inline-flex", gap: 0.5, p: 0.5, borderRadius: `${t.radius.pill}px`, backgroundColor: c.surfaceInteractive }}>
      {FILTERS.map((key) => {
        const on = key === value;
        return (
          <ButtonBase key={key} role="radio" aria-checked={on} onClick={() => onChange(key)} sx={{ position: "relative", minHeight: 42, px: 2, borderRadius: `${t.radius.pill}px`, fontSize: 14, fontWeight: 720, color: on ? c.text : c.textOnInset, "&.Mui-focusVisible": { outline: `2px solid ${c.focus}`, outlineOffset: 1 } }}>
            {on ? <Box component={m.span} layoutId="rm-filter" transition={t.motion.spring} aria-hidden sx={{ position: "absolute", inset: 0, borderRadius: "inherit", backgroundColor: c.surface, boxShadow: t.elevation[1] }} /> : null}
            <Box component="span" sx={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0.75 }}>
              {s.filters[key]}
              <Box component="span" sx={{ fontVariantNumeric: "tabular-nums", color: c.textSecondary, fontWeight: 650 }}>{counts[key]}</Box>
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
}

/** Inline editor for a suggestion that is still in review. */
function EditForm({ item, onCancel, onSaved }) {
  const t = useRideTokens();
  const [form, setForm] = useState({ url: item.url || item.rawUrl, title: item.title, desc: item.desc, category: item.category, type: item.type, tags: item.tags });
  const [shown, setShown] = useState(false);
  const [busy, setBusy] = useState(false);
  const errors = validateSuggestion(form);
  const show = (key) => (shown && errors[key] ? S.suggest.errors[errors[key]] : "");
  const field = { "& .MuiOutlinedInput-root": { borderRadius: `${t.radius.md}px` } };
  const f = S.suggest.fields;

  const save = async (e) => {
    e.preventDefault();
    setShown(true);
    if (Object.keys(errors).length) return;
    setBusy(true);
    const payload = toPayload(form);
    const result = await updateMyResource(item.id, payload);
    setBusy(false);
    onSaved(result.success ? payload : null, result.error);
  };

  return (
    <Box component="form" noValidate onSubmit={save} aria-label={`${s.editing}: ${item.title}`} sx={{ mt: 1.5, p: { xs: 2, sm: 2.5 }, borderRadius: `${t.radius.lg}px`, border: `1px dashed ${t.color.borderStrong}`, backgroundColor: t.color.surface, display: "flex", flexDirection: "column", gap: 2.25 }}>
      <LinkField value={form.url} onChange={(url) => setForm((p) => ({ ...p, url }))} onGuess={() => {}} error={show("url")} />
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}><Counter n={form.title.length} max={LIMITS.title} /></Box>
        <TextField label={f.title} value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value.slice(0, LIMITS.title) }))} error={Boolean(show("title"))} helperText={show("title") || " "} required fullWidth sx={field} />
      </Box>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 0.5 }}><Counter n={form.desc.length} max={LIMITS.desc} /></Box>
        <TextField label={f.desc} value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value.slice(0, LIMITS.desc) }))} fullWidth multiline minRows={3} sx={field} />
      </Box>
      <TagInput value={form.tags} onChange={(tags) => setForm((p) => ({ ...p, tags }))} />
      <CategoryPicker value={form.category} onChange={(category) => setForm((p) => ({ ...p, category }))} error={Boolean(show("category"))} />
      <TypePicker value={form.type} onChange={(type) => setForm((p) => ({ ...p, type }))} />
      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
        <Button onClick={onCancel} sx={{ minHeight: 44 }}>{s.cancel}</Button>
        <Button type="submit" variant="contained" disabled={busy} sx={{ minHeight: 44, px: 3, borderRadius: `${t.radius.pill}px` }}>{busy ? s.saving : s.save}</Button>
      </Box>
    </Box>
  );
}

function ManageContent() {
  const t = useRideTokens();
  const c = t.color;
  const reduce = useReducedMotion();
  const { notify } = useRideFeedback();
  const { isAuthenticated, authLoading } = useAuth();
  const mine = useMine(isAuthenticated);
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const counts = useMemo(() => ({ all: mine.list.length, review: mine.list.filter((r) => !r.active).length, live: mine.list.filter((r) => r.active).length }), [mine.list]);
  const list = mine.list.filter((r) => (filter === "all" ? true : filter === "live" ? r.active : !r.active));

  const doDelete = async () => {
    const item = confirm;
    setConfirm(null);
    if (!item) return;
    const result = await deleteMyResource(item.id);
    if (result.success) {
      mine.drop(item.id);
      notify({ message: item.active ? s.removed : s.withdrawn, tone: "success" });
    } else notify({ message: result.error || s.deleteFailed, tone: "error" });
  };

  let body;
  if (authLoading || (isAuthenticated && mine.status === "loading")) {
    body = (
      <Box aria-busy="true" sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
        {[0, 1].map((i) => <Skeleton key={i} variant="rounded" height={220} sx={{ borderRadius: `${t.radius.lg}px` }} />)}
      </Box>
    );
  } else if (!isAuthenticated) {
    body = (
      <Panel radius="xl" sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", maxWidth: 560, mx: "auto" }}>
        <Box sx={{ mx: "auto", mb: 2, display: "grid", placeItems: "center", width: 64, height: 64, borderRadius: "50%", backgroundColor: c.actionSoft, color: c.accentText }}>
          <Login2 size={32} aria-hidden />
        </Box>
        <Box component="h2" sx={{ m: 0, fontSize: 22, fontWeight: 760 }}>{s.signIn.title}</Box>
        <Box component="p" sx={{ mt: 1, mb: 3, color: c.textSecondary, fontSize: 15.5, lineHeight: 1.5 }}>{s.signIn.body}</Box>
        <Button component={Link} href={`/login?redirect=${encodeURIComponent("/resources/manage")}`} variant="contained" size="large" sx={{ minHeight: 52, px: 4, borderRadius: `${t.radius.pill}px` }}>{s.signIn.cta}</Button>
      </Panel>
    );
  } else if (mine.status === "error") {
    body = <Panel radius="xl"><StateBlock tone="error" title={s.error.title} body={s.error.body} onRetry={mine.reload} retryLabel={s.error.retry} /></Panel>;
  } else if (!list.length) {
    const empty = s.empty[filter];
    body = (
      <Panel variant="flat" radius="xl">
        <StateBlock title={empty.title} body={empty.body} action={<Button component={Link} href="/resources/suggest" variant="contained" startIcon={<BookmarkOpened size={18} aria-hidden />} sx={{ minHeight: 44 }}>{s.suggest}</Button>} />
      </Panel>
    );
  } else {
    body = (
      <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0, display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, alignItems: "start" }}>
        <AnimatePresence initial={false}>
          {list.map((item, i) => {
            const isEditing = editing === item.id;
            return (
              <Box component={m.li} key={item.id} layout={reduce ? false : "position"} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.28, delay: Math.min(i, 5) * 0.04, ease: t.motion.ease } }} exit={{ opacity: 0, transition: { duration: 0.15 } }} sx={{ gridColumn: isEditing ? "1 / -1" : undefined }}>
                <ResourceCard item={item} preview stamp={item.active ? <LiveStamp /> : <InReviewStamp />} />
                <Collapse in={isEditing} unmountOnExit>
                  <EditForm
                    item={item}
                    onCancel={() => setEditing(null)}
                    onSaved={(payload, error) => {
                      if (payload) {
                        const url = safeUrl(payload.url);
                        mine.patch(item.id, { ...payload, url, rawUrl: payload.url, domain: url ? new URL(url).hostname.replace(/^www\./, "") : "" });
                        setEditing(null);
                        notify({ message: s.saved, tone: "success" });
                      } else notify({ message: error || s.saveFailed, tone: "error" });
                    }}
                  />
                </Collapse>
                {!isEditing ? (
                  <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    {item.active ? (
                      <>
                        <Button component={Link} href={`/resources?r=${encodeURIComponent(item.id)}`} startIcon={<Eye size={18} aria-hidden />} sx={{ minHeight: 44, color: c.accentText }}>{s.view}</Button>
                        <Button onClick={() => setConfirm(item)} startIcon={<TrashBinTrash size={18} aria-hidden />} sx={{ minHeight: 44, color: c.danger }}>{s.remove}</Button>
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, width: "100%", fontSize: 13, color: c.textMuted }}>
                          <InfoCircle size={16} aria-hidden />
                          {s.liveNote}
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => setEditing(item.id)} startIcon={<Pen size={18} aria-hidden />} sx={{ minHeight: 44, color: c.accentText }}>{s.edit}</Button>
                        <Button onClick={() => setConfirm(item)} startIcon={<TrashBinTrash size={18} aria-hidden />} sx={{ minHeight: 44, color: c.danger }}>{s.withdraw}</Button>
                      </>
                    )}
                  </Box>
                ) : null}
              </Box>
            );
          })}
        </AnimatePresence>
      </Box>
    );
  }

  const ready = isAuthenticated && mine.status === "ready";
  return (
    <Box sx={{ width: "100%", maxWidth: 1040 + 2 * t.layout.gutterDesktop, mx: "auto", px: { xs: `${t.layout.gutterMobile}px`, sm: `${t.layout.gutterTablet}px`, lg: `${t.layout.gutterDesktop}px` }, pt: { xs: 2, md: 4 }, pb: { xs: 12, md: 9 } }}>
      <Box component="header" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
        <Button component={Link} href="/resources" variant="text" startIcon={<ArrowLeft size={18} aria-hidden />} sx={{ minHeight: 40, px: 1, ml: -1, mb: 1, color: c.textSecondary }}>{s.back}</Button>
        <Box sx={{ display: "flex", alignItems: { xs: "flex-start", md: "flex-end" }, justifyContent: "space-between", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Box component="h1" sx={{ m: 0, fontFamily: t.typography.family, fontSize: { xs: 30, sm: 38, md: 44 }, lineHeight: 1.06, fontWeight: t.typography.displayWeight, letterSpacing: t.typography.displayTracking }}>{s.title}</Box>
            <Box component="p" sx={{ m: 0, mt: 1, maxWidth: 560, fontSize: 15.5, lineHeight: 1.5, color: c.textSecondary }}>{s.lead}</Box>
          </Box>
          <Button component={Link} href="/resources/suggest" variant="contained" startIcon={<BookmarkOpened size={20} aria-hidden />} sx={{ minHeight: 48, px: 2.75, borderRadius: `${t.radius.pill}px`, flexShrink: 0 }}>{s.suggest}</Button>
        </Box>
      </Box>

      {ready && mine.list.length ? (
        <Box sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
          <FilterBar value={filter} onChange={(v) => { setFilter(v); setEditing(null); }} counts={counts} />
          <Box sx={{ display: "flex", gap: 1, fontSize: 13.5, fontWeight: 700, color: c.textSecondary }}>
            <Box component="span">{s.stats.review(counts.review)}</Box>
            <Box component="span" aria-hidden>·</Box>
            <Box component="span">{s.stats.live(counts.live)}</Box>
          </Box>
        </Box>
      ) : null}

      {body}

      <Dialog open={Boolean(confirm)} onClose={() => setConfirm(null)} container={typeof document === "undefined" ? undefined : document.body} aria-labelledby="rm-confirm-title" slotProps={{ paper: { sx: { borderRadius: `${t.radius.xl}px`, p: 1, maxWidth: 420 } } }}>
        <DialogTitle id="rm-confirm-title" sx={{ fontWeight: 760 }}>{confirm?.active ? s.confirm.removeTitle : s.confirm.withdrawTitle}</DialogTitle>
        <DialogContent sx={{ color: c.textSecondary, fontSize: 15, lineHeight: 1.5 }}>{confirm?.active ? s.confirm.removeBody : s.confirm.withdrawBody}</DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setConfirm(null)} sx={{ minHeight: 44 }} autoFocus>{s.confirm.keep}</Button>
          <Button onClick={doDelete} variant="contained" color="error" sx={{ minHeight: 44, borderRadius: `${t.radius.pill}px` }}>{confirm?.active ? s.remove : s.withdraw}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

/** "Your suggestions" page body. The route page renders the footer after it. */
export default function ManageResources() {
  return (
    <RideThemeBridge>
      <RideFeedbackProvider>
        <ManageContent />
      </RideFeedbackProvider>
    </RideThemeBridge>
  );
}
