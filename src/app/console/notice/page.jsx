"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { useAuth } from "@contexts/UniShareContext";
import { createNotice, deleteNotice, getAllNotices, updateNotice } from "@features/notice/services/notice.service";
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
  Toggle,
  Toolbar,
  Tr,
  TwoLine,
  since,
  useFlash,
} from "@features/admin/console/ui";

const EMPTY_FORM = { heading: "", body: "", priority: "normal", active: true };
const PRIORITY_TONE = { high: "bad", normal: "neutral", low: "neutral" };

/** The notice services report failure as { success: false, error } instead of throwing. */
const ensure = (res, fallback) => {
  if (!res?.success) throw new Error(res?.error || res?.message || fallback);
  return res;
};

/** How the line will read in the site's notice bar. */
function NoticePreview({ heading, body, priority }) {
  return (
    <div>
      <p className="c-mono mb-1.5 text-[11px] text-[var(--c-faint)]">Preview</p>
      <div className="flex items-center gap-2.5 overflow-hidden rounded-[8px] border border-[var(--c-line)] bg-[var(--c-panel-2)] px-3 py-2">
        <Tag tone={PRIORITY_TONE[priority] || "neutral"}>{priority}</Tag>
        <p className="min-w-0 flex-1 truncate text-[13px]">
          <span className="font-semibold text-[var(--c-text)]">{heading.trim() || "—"}</span>
          <span className="text-[var(--c-muted)]">{"  ·  "}{body.trim() || "—"}</span>
        </p>
      </div>
    </div>
  );
}

function NoticesSection() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("live");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | notice
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getAllNotices();
      if (!res?.success) throw new Error(res?.message || "Failed to load notices");
      setItems(res.notices || res.data || []);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const live = useMemo(() => items.filter((n) => n.active === true), [items]);
  const hidden = useMemo(() => items.filter((n) => n.active !== true), [items]);
  const source = tab === "live" ? live : hidden;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((n) => {
      const hit = !q || n.heading?.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q);
      return hit && (priority === "all" || (n.priority || "normal") === priority);
    });
  }, [source, query, priority]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditing("new");
  };
  const openEdit = (n) => {
    setForm({ heading: n.heading || "", body: n.body || "", priority: n.priority || "normal", active: !!n.active });
    setFormError(null);
    setEditing(n);
  };
  const close = useCallback(() => setEditing(null), []);

  const save = async (e) => {
    e?.preventDefault();
    if (!form.heading.trim() || !form.body.trim()) {
      setFormError("Give it a heading and a message.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = { heading: form.heading.trim(), body: form.body.trim(), priority: form.priority, active: form.active };
    try {
      if (editing === "new") ensure(await createNotice({ ...payload, user_id: user?.id }), "Couldn't create the notice");
      else ensure(await updateNotice(editing.id, payload), "Couldn't save the notice");
      await load();
      showFlash(editing === "new" ? `Created “${payload.heading}”` : `Saved “${payload.heading}”`);
      setEditing(null);
    } catch (err) {
      setFormError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const setLive = async (n, active) => {
    try {
      ensure(await updateNotice(n.id, { heading: n.heading, body: n.body, priority: n.priority, active }), "Couldn't update it");
      await load();
      showFlash(active ? `Published “${n.heading}”` : `Hid “${n.heading}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't update it", false);
    }
  };

  const remove = async (n) => {
    try {
      ensure(await deleteNotice(n.id), "Couldn't delete it");
      await load();
      showFlash(`Deleted “${n.heading}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't delete it", false);
    }
  };

  const filtering = query || priority !== "all";

  return (
    <div className="grid gap-5">
      <PageHead
        title="Notices"
        lead="Short lines shown in the notice bar across the site. Only live notices appear."
        actions={
          <>
            <Button tone="ghost" onClick={load}>Refresh</Button>
            <Button tone="primary" onClick={openNew}>New notice</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Live", value: live.length },
          { label: "Hidden", value: hidden.length },
          { label: "High priority, live", value: live.filter((n) => n.priority === "high").length },
          { label: "Total", value: items.length },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented
            label="Which notices"
            value={tab}
            onChange={setTab}
            options={[
              { value: "live", label: "Live", count: live.length },
              { value: "hidden", label: "Hidden", count: hidden.length },
            ]}
          />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search heading or message" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Priority" value={priority} onChange={setPriority} options={[{ value: "all", label: "Any priority" }, { value: "high", label: "High" }, { value: "normal", label: "Normal" }, { value: "low", label: "Low" }]} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtering ? "no matches" : "nothing here"}
            body={filtering ? "Try a different search or priority." : tab === "live" ? "Nothing is in the notice bar right now." : "Notices you hide end up here."}
            action={tab === "live" && !filtering ? <Button tone="primary" onClick={openNew}>New notice</Button> : null}
          />
        ) : (
          <Table label="Notices" minWidth={760}>
            <thead>
              <tr>
                <Th>Notice</Th>
                <Th>Priority</Th>
                <Th>From</Th>
                <Th>Posted</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((n) => (
                <Tr key={n.id}>
                  <Td className="max-w-[420px]">
                    <TwoLine title={n.heading || "—"} sub={n.body} />
                  </Td>
                  <Td>
                    <Tag tone={PRIORITY_TONE[n.priority] || "neutral"}>{n.priority || "normal"}</Tag>
                  </Td>
                  <Td>
                    {n.users ? (
                      <div className="min-w-0">
                        <div className="text-[13px]">{n.users.name || "—"}</div>
                        {n.users.email ? <div className="c-mono truncate text-[11.5px] text-[var(--c-faint)]">{n.users.email}</div> : null}
                      </div>
                    ) : (
                      <span className="text-[var(--c-faint)]">—</span>
                    )}
                  </Td>
                  <Td mono className="text-[var(--c-muted)]">{since(n.created_at)}</Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">
                      {n.active ? (
                        <Button size="sm" tone="ghost" onClick={() => setLive(n, false)}>Hide</Button>
                      ) : (
                        <Button size="sm" tone="primary" onClick={() => setLive(n, true)}>Publish</Button>
                      )}
                      <Button size="sm" tone="ghost" onClick={() => openEdit(n)}>Edit</Button>
                      <ConfirmButton onConfirm={() => remove(n)} />
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint="/ to search" />
      </Panel>

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New notice" : "Edit notice"}
        subtitle={editing && editing !== "new" ? `posted ${since(editing.created_at)}${editing.users?.name ? ` by ${editing.users.name}` : ""}` : "shows in the notice bar as soon as you save, unless you switch it off"}
        footer={
          <>
            {formError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{formError}</p> : null}
            <Button tone="ghost" onClick={close}>Cancel</Button>
            <Button tone="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editing === "new" ? "Create" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={save} className="grid gap-5">
          <NoticePreview heading={form.heading} body={form.body} priority={form.priority} />
          <Field label="Heading" count={`${form.heading.length} chars`}>
            {(id) => <TextInput id={id} value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} placeholder="Library closed on Friday" />}
          </Field>
          <Field label="Message" count={`${form.body.length} chars`}>
            {(id) => <TextArea id={id} rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="One or two sentences. Keep it short; it runs in a single line." />}
          </Field>
          <Field label="Priority" hint="High priority notices are marked urgent in the notice bar.">
            {() => <Choice label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={[{ value: "low", label: "Low" }, { value: "normal", label: "Normal" }, { value: "high", label: "High" }]} />}
          </Field>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Live" hint={form.active ? "Shows in the notice bar." : "Saved, but hidden from the notice bar."} />
          <button type="submit" className="hidden" />
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminNoticePage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <NoticesSection />
      </AdminLayout>
    </AdminGuard>
  );
}
