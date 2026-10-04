"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { useAuth } from "@contexts/UniShareContext";
import {
  createSystemAnnouncement,
  deleteSystemAnnouncement,
  getAllSystemAnnouncements,
  updateSystemAnnouncement,
} from "@features/announcements/services/announcements.service";
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

const EMPTY_FORM = { title: "", body: "", priority: "normal", tags: "", active: true, expiresAt: "" };
const PRIORITY_TONE = { high: "bad", normal: "neutral", low: "neutral" };
const BODY_MAX = 1000;

function AnnouncementsSection() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("live");
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | announcement
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getAllSystemAnnouncements();
      if (!res?.success) throw new Error(res?.message || "Failed to load announcements");
      setItems(res.announcements || res.data || []);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const live = useMemo(() => items.filter((a) => a.active), [items]);
  const submissions = useMemo(() => items.filter((a) => !a.active && a.user_id && a.users), [items]);
  const hidden = useMemo(() => items.filter((a) => !a.active && !submissions.includes(a)), [items, submissions]);
  const source = tab === "live" ? live : tab === "submitted" ? submissions : hidden;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((a) => {
      const hit = !q || a.title?.toLowerCase().includes(q) || a.body?.toLowerCase().includes(q) || a.tags?.some((t) => t.toLowerCase().includes(q));
      return hit && (priority === "all" || (a.priority || "normal") === priority);
    });
  }, [source, query, priority]);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditing("new");
  };
  const openEdit = (a) => {
    setForm({ title: a.title || "", body: a.body || "", priority: a.priority || "normal", tags: (a.tags || []).join(", "), active: !!a.active, expiresAt: a.expires_at ? a.expires_at.split("T")[0] : "" });
    setFormError(null);
    setEditing(a);
  };
  const close = useCallback(() => setEditing(null), []);

  const save = async (e) => {
    e?.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      setFormError("Give it a title and a message.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      title: form.title.trim(),
      body: form.body.trim(),
      priority: form.priority,
      active: form.active,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
    };
    try {
      if (editing === "new") await createSystemAnnouncement({ ...payload, user_id: user?.id });
      else await updateSystemAnnouncement(editing.id, payload);
      await load();
      showFlash(editing === "new" ? `Created “${payload.title}”` : `Saved “${payload.title}”`);
      setEditing(null);
    } catch (err) {
      setFormError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const setLive = async (a, active) => {
    try {
      await updateSystemAnnouncement(a.id, { title: a.title, body: a.body, priority: a.priority, tags: a.tags || [], active, expiresAt: a.expires_at });
      await load();
      showFlash(active ? `Published “${a.title}”` : `Hid “${a.title}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't update it", false);
    }
  };

  const remove = async (a) => {
    try {
      await deleteSystemAnnouncement(a.id);
      await load();
      showFlash(`Deleted “${a.title}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't delete it", false);
    }
  };

  return (
    <div className="grid gap-5">
      <PageHead
        title="Announcements"
        lead="What students see on the announcements page. Student submissions wait here until you publish them."
        actions={
          <>
            <Button tone="ghost" onClick={load}>Refresh</Button>
            <Button tone="primary" onClick={openNew}>New announcement</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Live", value: live.length },
          { label: "Waiting for review", value: submissions.length, mark: true },
          { label: "Hidden", value: hidden.length },
          { label: "High priority, live", value: live.filter((a) => a.priority === "high").length },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented
            label="Which announcements"
            value={tab}
            onChange={setTab}
            options={[
              { value: "live", label: "Live", count: live.length },
              { value: "submitted", label: "Submitted", count: submissions.length },
              { value: "hidden", label: "Hidden", count: hidden.length },
            ]}
          />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search title, message or tag" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Priority" value={priority} onChange={setPriority} options={[{ value: "all", label: "Any priority" }, { value: "high", label: "High" }, { value: "normal", label: "Normal" }, { value: "low", label: "Low" }]} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={query || priority !== "all" ? "no matches" : tab === "submitted" ? "nothing to review" : "nothing here"}
            body={query || priority !== "all" ? "Try a different search or priority." : tab === "live" ? "Nothing is live. Publish a submission or write a new announcement." : tab === "submitted" ? "Student submissions land here for review." : "Announcements you hide end up here."}
            action={tab === "live" && !query ? <Button tone="primary" onClick={openNew}>New announcement</Button> : null}
          />
        ) : (
          <Table label="Announcements" minWidth={760}>
            <thead>
              <tr>
                <Th>Announcement</Th>
                <Th>Priority</Th>
                <Th>From</Th>
                <Th>Posted</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((a) => (
                <Tr key={a.id}>
                  <Td className="max-w-[420px]">
                    <TwoLine title={a.title} sub={a.body} />
                    {a.tags?.length ? <div className="c-mono mt-1 truncate text-[11px] text-[var(--c-faint)]">{a.tags.map((t) => `#${t}`).join("  ")}</div> : null}
                  </Td>
                  <Td>
                    <Tag tone={PRIORITY_TONE[a.priority] || "neutral"}>{a.priority || "normal"}</Tag>
                  </Td>
                  <Td>
                    <span className="text-[13px]">{a.users?.name || "Admin"}</span>
                  </Td>
                  <Td mono className="text-[var(--c-muted)]">{since(a.created_at)}</Td>
                  <Td align="right">
                    <div className="flex items-center justify-end gap-1">
                      {a.active ? (
                        <Button size="sm" tone="ghost" onClick={() => setLive(a, false)}>Hide</Button>
                      ) : (
                        <Button size="sm" tone="primary" onClick={() => setLive(a, true)}>Publish</Button>
                      )}
                      <Button size="sm" tone="ghost" onClick={() => openEdit(a)}>Edit</Button>
                      <ConfirmButton onConfirm={() => remove(a)} />
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
        title={editing === "new" ? "New announcement" : "Edit announcement"}
        subtitle={editing && editing !== "new" ? `posted ${since(editing.created_at)}${editing.users?.name ? ` by ${editing.users.name}` : ""}` : "goes live as soon as you save, unless you switch it off"}
        footer={
          <>
            {formError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{formError}</p> : null}
            <Button tone="ghost" onClick={close}>Cancel</Button>
            <Button tone="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editing === "new" ? "Create" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={save} className="grid gap-5">
          <Field label="Title" count={`${form.title.length}/120`}>
            {(id) => <TextInput id={id} value={form.title} maxLength={120} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Coding club meetup, Thursday 5 PM" />}
          </Field>
          <Field label="Message" count={`${form.body.length}/${BODY_MAX}`}>
            {(id) => <TextArea id={id} rows={7} value={form.body} maxLength={BODY_MAX} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="What, where, when, and anything students need to bring." />}
          </Field>
          <Field label="Priority" hint="High priority shows first on the announcements page.">
            {() => <Choice label="Priority" value={form.priority} onChange={(v) => setForm({ ...form, priority: v })} options={[{ value: "low", label: "Low" }, { value: "normal", label: "Normal" }, { value: "high", label: "High" }]} />}
          </Field>
          <Field label="Tags" hint="Separate with commas, like: events, clubs">
            {(id) => <TextInput id={id} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="events, clubs" />}
          </Field>
          <Field label="Expires on" hint="Optional. Leave empty to keep it up until you hide it.">
            {(id) => <TextInput id={id} type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />}
          </Field>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Live" hint={form.active ? "Students can see it." : "Saved, but hidden from students."} />
          <button type="submit" className="hidden" />
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminAnnouncementsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AnnouncementsSection />
      </AdminLayout>
    </AdminGuard>
  );
}
