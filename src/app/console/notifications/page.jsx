"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { deleteAdminNotification, getAllAdminNotifications, getNotificationStats, sendAdminNotification } from "@lib/api/api";
import {
  Button,
  Choice,
  ConfirmButton,
  Drawer,
  Empty,
  Failed,
  Field,
  FlashLine,
  PageHead,
  Panel,
  SearchField,
  Segmented,
  Select,
  SkeletonRows,
  Stats,
  Table,
  Tag,
  Td,
  TextArea,
  TextInput,
  Th,
  Toolbar,
  Tr,
  TwoLine,
  since,
  useFlash,
} from "@features/admin/console/ui";

const EMPTY_FORM = { title: "", message: "", type: "info", audience: "all", emails: "" };
const TYPE_TONE = { info: "info", success: "good", warning: "neutral", error: "bad" };
const TYPE_OPTIONS = [
  { value: "info", label: "Info" },
  { value: "success", label: "Success" },
  { value: "warning", label: "Warning" },
  { value: "error", label: "Error" },
];
const AUDIENCE_OPTIONS = [
  { value: "all", label: "All users" },
  { value: "emails", label: "Specific emails" },
  { value: "self", label: "Only me" },
];
const TITLE_MAX = 120;

/** Split a comma or newline separated list into unique, trimmed emails. */
const parseEmails = (raw) => Array.from(new Set(raw.split(/[,\n;]/).map((p) => p.trim()).filter(Boolean)));

function NotificationsSection() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [audienceTab, setAudienceTab] = useState("all");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [composing, setComposing] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const [notificationsRes, statsRes] = await Promise.all([getAllAdminNotifications({ limit: 100 }), getNotificationStats()]);
      // The API helpers return placeholder data when the server can't be reached; never show it.
      if (!notificationsRes?.success || notificationsRes.source === "fallback") throw new Error("Couldn't reach the notifications service.");
      setItems(notificationsRes.notifications || []);
      setStats(statsRes?.success && statsRes.source !== "fallback" ? statsRes.stats || null : null);
      setStatus("ready");
    } catch (e) {
      setError(e.message || "Failed to load notifications");
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toAll = useMemo(() => items.filter((n) => n.recipient_type === "all"), [items]);
  const toUser = useMemo(() => items.filter((n) => n.recipient_type !== "all"), [items]);
  const source = audienceTab === "all" ? items : audienceTab === "everyone" ? toAll : toUser;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source
      .filter((n) => {
        const hit = !q || n.message?.toLowerCase().includes(q) || n.title?.toLowerCase().includes(q);
        return hit && (type === "all" || n.type === type);
      })
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }, [source, query, type]);

  const emails = useMemo(() => parseEmails(form.emails), [form.emails]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setComposing(true);
  };
  const close = useCallback(() => setComposing(false), []);

  const send = async (e) => {
    e?.preventDefault();
    if (!form.message.trim()) {
      setFormError("Write a message.");
      return;
    }
    if (form.audience === "emails" && emails.length === 0) {
      setFormError("Add at least one email, or pick a different audience.");
      return;
    }
    const users = form.audience === "all" ? ["ALL"] : form.audience === "self" ? ["SELF"] : emails;
    setSending(true);
    setFormError(null);
    try {
      const result = await sendAdminNotification({
        users,
        message: form.message.trim(),
        type: form.type,
        title: form.title.trim() || undefined,
      });
      if (!result?.success) throw new Error(result?.error || "Failed to send notification");
      const n = result.data?.length || 0;
      showFlash(form.audience === "all" ? "Sent to all users" : form.audience === "self" ? "Sent to you" : `Sent to ${n} ${n === 1 ? "recipient" : "recipients"}`);
      setComposing(false);
      setForm(EMPTY_FORM);
      load();
    } catch (err) {
      setFormError(err.message || "Couldn't send. Try again.");
    } finally {
      setSending(false);
    }
  };

  const remove = async (n) => {
    const result = await deleteAdminNotification(n.id);
    if (result?.success) {
      showFlash(`Deleted “${n.title || "notification"}”`);
      await load();
    } else {
      showFlash(result?.error || "Couldn't delete it", false);
    }
  };

  const warnErr = stats?.byType ? (stats.byType.warning || 0) + (stats.byType.error || 0) : null;
  const filtered = query || type !== "all";

  return (
    <div className="grid gap-5">
      <PageHead
        title="Notifications"
        lead="Send a notification to every user, to specific people, or to yourself as a test."
        actions={
          <>
            <Button tone="ghost" onClick={load}>Refresh</Button>
            <Button tone="primary" onClick={openNew}>New notification</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Total", value: stats?.total },
          { label: "Unread", value: stats?.unread },
          { label: "Read", value: stats?.read },
          { label: "Warnings and errors", value: warnErr },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented
            label="Audience"
            value={audienceTab}
            onChange={setAudienceTab}
            options={[
              { value: "all", label: "All", count: items.length },
              { value: "everyone", label: "Everyone", count: toAll.length },
              { value: "user", label: "One user", count: toUser.length },
            ]}
          />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search title or message" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Type" value={type} onChange={setType} options={[{ value: "all", label: "Any type" }, ...TYPE_OPTIONS]} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtered ? "no matches" : "nothing sent yet"}
            body={filtered ? "Try a different search or type." : "Notifications you send show up here."}
            action={!filtered ? <Button tone="primary" onClick={openNew}>New notification</Button> : null}
          />
        ) : (
          <Table label="Sent notifications" minWidth={780}>
            <thead>
              <tr>
                <Th>Notification</Th>
                <Th>Type</Th>
                <Th>Audience</Th>
                <Th>Read</Th>
                <Th>Sent</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((n) => (
                <Tr key={n.id}>
                  <Td className="max-w-[420px]">
                    <TwoLine title={n.title || "Untitled"} sub={n.message} />
                  </Td>
                  <Td>{n.type ? <Tag tone={TYPE_TONE[n.type] || "neutral"}>{n.type}</Tag> : "—"}</Td>
                  <Td>
                    <div className="text-[13px]">{n.recipient_type === "all" ? "All users" : n.recipient?.email || "One user"}</div>
                    {n.sender?.name || n.sender?.email ? <div className="mt-0.5 text-[12px] text-[var(--c-faint)]">from {n.sender.name || n.sender.email}</div> : null}
                  </Td>
                  <Td>{typeof n.read === "boolean" ? <Tag>{n.read ? "read" : "unread"}</Tag> : "—"}</Td>
                  <Td mono className="whitespace-nowrap text-[var(--c-muted)]">{since(n.created_at)}</Td>
                  <Td align="right">
                    <ConfirmButton question="Delete?" onConfirm={() => remove(n)} />
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint="/ to search" />
      </Panel>

      <Drawer
        open={composing}
        onClose={close}
        title="New notification"
        subtitle="sends as soon as you press send"
        footer={
          <>
            {formError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{formError}</p> : null}
            <Button tone="ghost" onClick={close}>Cancel</Button>
            <Button tone="primary" onClick={send} disabled={sending}>{sending ? "Sending…" : "Send"}</Button>
          </>
        }
      >
        <form onSubmit={send} className="grid gap-5">
          <Field label="Title" count={`${form.title.length}/${TITLE_MAX}`} hint="Optional.">
            {(id) => <TextInput id={id} value={form.title} maxLength={TITLE_MAX} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Maintenance tonight" />}
          </Field>
          <Field label="Message" count={form.message.length ? `${form.message.length} chars` : null}>
            {(id) => <TextArea id={id} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What people need to know, in a sentence or two." />}
          </Field>
          <Field label="Type">
            {() => <Choice label="Type" value={form.type} onChange={(v) => setForm({ ...form, type: v })} options={TYPE_OPTIONS} />}
          </Field>
          <Field label="Audience" hint={form.audience === "self" ? "Sends only to you, to check how it looks." : null}>
            {() => <Choice label="Audience" value={form.audience} onChange={(v) => setForm({ ...form, audience: v })} options={AUDIENCE_OPTIONS} />}
          </Field>
          {form.audience === "emails" ? (
            <Field label="Emails" count={emails.length ? `${emails.length} ${emails.length === 1 ? "address" : "addresses"}` : null} hint="Separate with commas or new lines. Duplicates are ignored; unknown emails are skipped.">
              {(id) => <TextArea id={id} rows={3} value={form.emails} onChange={(e) => setForm({ ...form, emails: e.target.value })} placeholder="name@university.edu, other@university.edu" />}
            </Field>
          ) : null}

          <section aria-label="Preview">
            <h3 className="c-mono text-[11.5px] text-[var(--c-faint)]">Preview</h3>
            <div className="mt-2 rounded-[10px] border border-[var(--c-line)] bg-[var(--c-panel-2)] px-3.5 py-3">
              <div className="flex items-center gap-2">
                <Tag tone={TYPE_TONE[form.type] || "neutral"}>{form.type}</Tag>
                <span className="min-w-0 truncate text-[14px] font-semibold">{form.title.trim() || "No title"}</span>
              </div>
              <p className={`mt-1.5 whitespace-pre-wrap break-words text-[13.5px] leading-relaxed ${form.message.trim() ? "text-[var(--c-text)]" : "text-[var(--c-faint)]"}`}>{form.message.trim() || "Your message shows here."}</p>
              <p className="c-mono mt-2 text-[11px] text-[var(--c-faint)]">
                to {form.audience === "all" ? "all users" : form.audience === "self" ? "you only" : emails.length ? `${emails.length} ${emails.length === 1 ? "address" : "addresses"}` : "—"}
              </p>
            </div>
          </section>
          <button type="submit" className="hidden" />
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminNotificationsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <NotificationsSection />
      </AdminLayout>
    </AdminGuard>
  );
}
