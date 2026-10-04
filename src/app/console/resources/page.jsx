"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { createResource, deleteResource, getAllResources, toggleResourceActive, updateResource } from "@features/resources/services/resources.service";
import {
  Button,
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
  SelectInput,
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
  RING,
  since,
  useFlash,
} from "@features/admin/console/ui";

const CATEGORIES = [
  { key: "academics", label: "Academics" },
  { key: "tools", label: "Tools" },
  { key: "campus", label: "Campus" },
  { key: "docs", label: "Docs" },
  { key: "media", label: "Media" },
];
const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key || "—";
const TYPES = [{ value: "link", label: "Drive link" }];

const EMPTY_FORM = { title: "", desc: "", category: "academics", type: "link", url: "", tags: "", active: true };
const isSuggestion = (r) => !r.active && !!r.user_id;
const safeHref = (url) => (/^https?:\/\//i.test(String(url || "").trim()) ? String(url).trim() : null);

/** Error text from a service result that reports failure instead of throwing. */
const failure = (res, fallback) => (Array.isArray(res?.errors) && res.errors.length ? res.errors.join(". ") : res?.message || fallback);

function ResourcesSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("live");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState(null); // null | "new" | resource
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getAllResources();
      if (!res?.success) throw new Error(res?.message || "Failed to load resources");
      setItems(res.resources || []);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const live = useMemo(() => items.filter((r) => r.active === true), [items]);
  const suggestions = useMemo(() => items.filter(isSuggestion), [items]);
  const hidden = useMemo(() => items.filter((r) => r.active !== true && !isSuggestion(r)), [items]);
  const source = tab === "live" ? live : tab === "suggested" ? suggestions : hidden;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return source.filter((r) => {
      const hit = !q || r.title?.toLowerCase().includes(q) || r.desc?.toLowerCase().includes(q) || r.url?.toLowerCase().includes(q) || r.tags?.some((t) => String(t).toLowerCase().includes(q));
      return hit && (category === "all" || r.category === category);
    });
  }, [source, query, category]);

  const categoryOptions = useMemo(() => {
    const extra = [...new Set(items.map((r) => r.category).filter((k) => k && !CATEGORIES.some((c) => c.key === k)))].sort();
    return [{ value: "all", label: "Any category" }, ...CATEGORIES.map((c) => ({ value: c.key, label: c.label })), ...extra.map((k) => ({ value: k, label: k }))];
  }, [items]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, category: category !== "all" ? category : EMPTY_FORM.category });
    setFormError(null);
    setEditing("new");
  };
  const openEdit = (r) => {
    setForm({ title: r.title || "", desc: r.desc || "", category: r.category || "academics", type: r.type || "link", url: r.url || "", tags: (r.tags || []).join(", "), active: !!r.active });
    setFormError(null);
    setEditing(r);
  };
  const close = useCallback(() => setEditing(null), []);

  const save = async (e) => {
    e?.preventDefault();
    const missing = [!form.title.trim() && "a title", !form.url.trim() && "a link", !form.category && "a category"].filter(Boolean);
    if (missing.length) {
      setFormError(`Add ${missing.join(" and ")}.`);
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      title: form.title.trim(),
      desc: form.desc.trim(),
      category: form.category,
      type: form.type,
      url: form.url.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      active: Boolean(form.active),
    };
    try {
      const res = editing === "new" ? await createResource(payload) : await updateResource(editing.id, payload);
      if (!res?.success) throw new Error(failure(res, "Couldn't save the resource"));
      await load();
      showFlash(editing === "new" ? `Created “${payload.title}”` : `Saved “${payload.title}”`);
      setEditing(null);
    } catch (err) {
      setFormError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (r) => {
    try {
      const res = await toggleResourceActive(r.id);
      if (!res?.success) throw new Error(failure(res, "Couldn't update it"));
      await load();
      showFlash(r.active ? `Hid “${r.title}”` : `Published “${r.title}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't update it", false);
    }
  };

  const remove = async (r) => {
    try {
      const res = await deleteResource(r.id);
      if (!res?.success) throw new Error(failure(res, "Couldn't delete it"));
      await load();
      showFlash(`Deleted “${r.title}”`);
    } catch (err) {
      showFlash(err.message || "Couldn't delete it", false);
    }
  };

  const copy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showFlash("Link copied");
    } catch {
      showFlash("Couldn't copy the link", false);
    }
  };

  const filtering = query || category !== "all";
  const typeOptions = form.type && !TYPES.some((t) => t.value === form.type) ? [...TYPES, { value: form.type, label: form.type }] : TYPES;
  const formCategories = form.category && !CATEGORIES.some((c) => c.key === form.category) ? [...CATEGORIES.map((c) => ({ value: c.key, label: c.label })), { value: form.category, label: form.category }] : CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
  const editingSuggestion = editing && editing !== "new" && isSuggestion(editing);

  return (
    <div className="grid gap-5">
      <PageHead
        title="Resources"
        lead="Study links shown on the resources page. Student suggestions wait here until you publish them."
        actions={
          <>
            {!process.env.NEXT_PUBLIC_BACKEND_URL ? <Tag tone="bad">backend not configured</Tag> : null}
            <Button tone="ghost" onClick={load}>Refresh</Button>
            <Button tone="primary" onClick={openNew}>New resource</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Live", value: live.length },
          { label: "Suggestions waiting", value: suggestions.length, mark: true },
          { label: "Hidden", value: hidden.length },
          { label: "Total", value: items.length },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented
            label="Which resources"
            value={tab}
            onChange={setTab}
            options={[
              { value: "live", label: "Live", count: live.length },
              { value: "suggested", label: "Suggestions", count: suggestions.length },
              { value: "hidden", label: "Hidden", count: hidden.length },
            ]}
          />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search title, link or tag" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Category" value={category} onChange={setCategory} options={categoryOptions} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtering ? "no matches" : tab === "suggested" ? "nothing to review" : "nothing here"}
            body={filtering ? "Try a different search or category." : tab === "live" ? "Nothing is live. Publish a suggestion or add a resource." : tab === "suggested" ? "Resources students suggest land here for review." : "Resources you hide end up here."}
            action={tab === "live" && !filtering ? <Button tone="primary" onClick={openNew}>New resource</Button> : null}
          />
        ) : (
          <Table label="Resources" minWidth={940}>
            <thead>
              <tr>
                <Th>Resource</Th>
                <Th>Type</Th>
                <Th>Category</Th>
                <Th>Link</Th>
                <Th>Added</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => {
                const href = safeHref(r.url);
                return (
                  <Tr key={r.id}>
                    <Td className="max-w-[340px]">
                      <TwoLine title={r.title || "—"} sub={r.desc} />
                      {r.tags?.length ? <div className="c-mono mt-1 truncate text-[11px] text-[var(--c-faint)]">{r.tags.map((t) => `#${t}`).join("  ")}</div> : null}
                    </Td>
                    <Td>
                      {r.type ? <Tag>{r.type}</Tag> : <span className="text-[var(--c-faint)]">—</span>}
                    </Td>
                    <Td>
                      <span className="text-[13px]">{categoryLabel(r.category)}</span>
                    </Td>
                    <Td className="max-w-[220px]">
                      {href ? (
                        <div className="flex min-w-0 items-center gap-1">
                          <a href={href} target="_blank" rel="noopener noreferrer" title={href} className={`c-mono block min-w-0 truncate rounded text-[12px] text-[var(--c-link)] underline-offset-2 hover:underline ${RING}`}>
                            {href.replace(/^https?:\/\//i, "")}
                          </a>
                          <Button size="sm" tone="ghost" className="h-6 px-1.5 text-[11px]" aria-label={`Copy link for ${r.title}`} onClick={() => copy(href)}>
                            Copy
                          </Button>
                        </div>
                      ) : (
                        <span className="c-mono block truncate text-[12px] text-[var(--c-faint)]">{r.url || "—"}</span>
                      )}
                    </Td>
                    <Td>
                      <div className="c-mono text-[12.5px] text-[var(--c-muted)]">{since(r.created_at)}</div>
                      <div className="mt-0.5 text-[11.5px] text-[var(--c-faint)]">{r.user_id ? "by a student" : "by an admin"}</div>
                    </Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1">
                        {r.active ? (
                          <Button size="sm" tone="ghost" onClick={() => toggle(r)}>Hide</Button>
                        ) : (
                          <Button size="sm" tone="primary" onClick={() => toggle(r)}>Publish</Button>
                        )}
                        <Button size="sm" tone="ghost" onClick={() => openEdit(r)}>Edit</Button>
                        <ConfirmButton onConfirm={() => remove(r)} />
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint="/ to search" />
      </Panel>

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New resource" : editingSuggestion ? "Review suggestion" : "Edit resource"}
        subtitle={editing && editing !== "new" ? `added ${since(editing.created_at)} ${editing.user_id ? "by a student" : "by an admin"}` : "goes live as soon as you save, unless you switch it off"}
        footer={
          <>
            {formError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{formError}</p> : null}
            <Button tone="ghost" onClick={close}>Cancel</Button>
            <Button tone="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editing === "new" ? "Create" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={save} className="grid gap-5">
          <Field label="Title">
            {(id) => <TextInput id={id} required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="CS101 syllabus" />}
          </Field>
          <Field label="Description" hint="Optional. One line on what it is and who it's for.">
            {(id) => <TextArea id={id} rows={3} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} placeholder="Course outline and grading policy" />}
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Category">
              {(id) => <SelectInput id={id} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={formCategories} />}
            </Field>
            <Field label="Type">
              {(id) => <SelectInput id={id} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} options={typeOptions} />}
            </Field>
          </div>
          <Field label="Link" hint="A shared Google Drive link anyone at the university can open.">
            {(id) => (
              <div className="c-mono">
                <TextInput id={id} required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://drive.google.com/…" />
              </div>
            )}
          </Field>
          <Field label="Tags" hint="Separate with commas, like: exam, prep">
            {(id) => <TextInput id={id} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="exam, prep" />}
          </Field>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Live" hint={form.active ? "Students can see it." : editingSuggestion ? "Still waiting under Suggestions." : "Saved, but hidden from students."} />
          <button type="submit" className="hidden" />
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminResourcesPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ResourcesSection />
      </AdminLayout>
    </AdminGuard>
  );
}
