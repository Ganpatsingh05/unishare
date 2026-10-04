"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { createContact, deleteContact, getAllContacts, toggleContactStatus, updateContact } from "@features/contacts/services/contacts.service";
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
  TextInput,
  Th,
  Toggle,
  Toolbar,
  Tr,
  TwoLine,
  RING,
  useFlash,
} from "@features/admin/console/ui";

// Same categories as the public contacts page.
const CATEGORIES = [
  { key: "emergency", label: "Emergency" },
  { key: "administration", label: "Administration" },
  { key: "academics", label: "Academics" },
  { key: "hostel", label: "Hostel" },
  { key: "student", label: "Student & clubs" },
];
const categoryLabel = (key) => CATEGORIES.find((c) => c.key === key)?.label || key || "—";

const PAGE = 20;
const EMPTY_FORM = { name: "", role: "", category: "emergency", phones: [{ type: "", value: "" }], emails: [{ type: "", value: "" }], location: "", hours: "", active: true };

/**
 * Phones and emails arrive as arrays of strings, arrays of objects like
 * { type, number } / { type, address }, or a single comma-separated string.
 * Returns [{ type, value }] without duplicates.
 */
function entries(list, single, key) {
  const out = [];
  const add = (type, value) => {
    const v = String(value ?? "").trim();
    if (v && !out.some((e) => e.value === v)) out.push({ type: type || "", value: v });
  };
  const take = (x) => {
    if (x == null) return;
    if (typeof x === "object") add(x.type, x[key] ?? x.value);
    else String(x).split(/[,;]/).forEach((part) => add("", part));
  };
  if (Array.isArray(list)) list.forEach(take);
  take(single);
  return out;
}
const phonesOf = (c) => entries(c?.phones, c?.phone, "number");
const emailsOf = (c) => entries(c?.emails, c?.email, "address");
const labelled = (list) => Array.isArray(list) && list.some((x) => x && typeof x === "object");
const telHref = (n) => `tel:${String(n).replace(/(?!^\+)[^\d]/g, "")}`;
const isListed = (c) => c.active !== false;

/** Several values in one cell, each a link, in mono. */
function LinkList({ items, href }) {
  if (!items.length) return <span className="text-[var(--c-faint)]">—</span>;
  return (
    <ul className="grid gap-0.5">
      {items.map((e) => (
        <li key={e.value} className="flex min-w-0 items-baseline gap-1.5">
          <a href={href(e.value)} className={`c-mono truncate rounded text-[12.5px] text-[var(--c-text)] underline-offset-2 hover:text-[var(--c-link)] hover:underline ${RING}`}>
            {e.value}
          </a>
          {e.type ? <span className="c-mono shrink-0 text-[10.5px] text-[var(--c-faint)]">{e.type}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** Add/remove rows of phone numbers or email addresses. */
function MultiField({ legend, noun, rows, onChange, withType, type, placeholder, hint }) {
  const set = (i, patch) => onChange(rows.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1.5 text-[13px] font-semibold text-[var(--c-text)]">{legend}</legend>
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="c-mono min-w-0 flex-1">
            <TextInput type={type} aria-label={`${noun} ${i + 1}`} value={r.value} onChange={(e) => set(i, { value: e.target.value })} placeholder={placeholder} />
          </div>
          {withType ? (
            <div className="w-[110px] shrink-0">
              <TextInput aria-label={`${noun} ${i + 1} label`} value={r.type} onChange={(e) => set(i, { type: e.target.value })} placeholder="label" />
            </div>
          ) : null}
          <Button size="sm" tone="ghost" aria-label={`Remove ${noun.toLowerCase()} ${i + 1}`} disabled={rows.length === 1 && !r.value && !r.type} onClick={() => onChange(rows.length === 1 ? [{ type: "", value: "" }] : rows.filter((_, j) => j !== i))}>
            Remove
          </Button>
        </div>
      ))}
      <div className="flex items-center justify-between gap-2">
        <Button size="sm" tone="plain" onClick={() => onChange([...rows, { type: "", value: "" }])}>Add {noun.toLowerCase()}</Button>
        {hint ? <p className="text-[12px] text-[var(--c-faint)]">{hint}</p> : null}
      </div>
    </fieldset>
  );
}

function ContactsSection() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");
  const [listing, setListing] = useState("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [editing, setEditing] = useState(null); // null | "new" | contact
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getAllContacts();
      if (!res?.success) throw new Error(res?.message || "Failed to load contacts");
      setItems(res.contacts || []);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => setLimit(PAGE), [category, listing, query]);

  const listed = useMemo(() => items.filter(isListed), [items]);
  const unreachable = useMemo(() => listed.filter((c) => !phonesOf(c).length && !emailsOf(c).length), [listed]);

  const categoryOptions = useMemo(() => {
    const seen = [...new Set(items.map((c) => String(c.category ?? "")).filter(Boolean))];
    const keys = [...CATEGORIES.map((c) => c.key), ...seen.filter((k) => !CATEGORIES.some((c) => c.key === k)).sort()];
    return [{ value: "all", label: "All", count: items.length }, ...keys.map((k) => ({ value: k, label: categoryLabel(k), count: items.filter((c) => c.category === k).length }))];
  }, [items]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((c) => {
      if (category !== "all" && String(c.category ?? "") !== category) return false;
      if (listing === "listed" && !isListed(c)) return false;
      if (listing === "hidden" && isListed(c)) return false;
      if (!q) return true;
      const text = [c.name, c.role, c.location, c.hours, ...phonesOf(c).map((e) => e.value), ...emailsOf(c).map((e) => e.value)].join(" ").toLowerCase();
      return text.includes(q);
    });
  }, [items, category, listing, query]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM, category: category !== "all" ? category : EMPTY_FORM.category });
    setFormError(null);
    setEditing("new");
  };
  const openEdit = (c) => {
    const phones = phonesOf(c);
    const emails = emailsOf(c);
    setForm({
      name: String(c.name ?? ""),
      role: String(c.role ?? ""),
      category: String(c.category ?? "emergency"),
      phones: phones.length ? phones : [{ type: "", value: "" }],
      emails: emails.length ? emails : [{ type: "", value: "" }],
      location: String(c.location ?? ""),
      hours: String(c.hours ?? ""),
      active: isListed(c),
    });
    setFormError(null);
    setEditing(c);
  };
  const close = useCallback(() => setEditing(null), []);

  const save = async (e) => {
    e?.preventDefault();
    if (!form.name.trim() || !form.role.trim()) {
      setFormError("Name and role are required.");
      return;
    }
    const phones = form.phones.map((r) => ({ type: r.type.trim(), value: r.value.trim() })).filter((r) => r.value);
    const emails = form.emails.map((r) => ({ type: r.type.trim(), value: r.value.trim() })).filter((r) => r.value);
    const badEmail = emails.find((r) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.value));
    if (badEmail) {
      setFormError(`“${badEmail.value}” doesn't look like an email address.`);
      return;
    }
    setSaving(true);
    setFormError(null);
    // phone and email are what the service and the public page read; several
    // values are joined with commas, which the public page splits again.
    const payload = {
      name: form.name.trim(),
      role: form.role.trim(),
      category: form.category,
      phone: phones.map((r) => r.value).join(", ") || null,
      email: emails.map((r) => r.value).join(", ") || null,
      location: form.location.trim() || null,
      hours: form.hours.trim() || null,
      active: form.active,
    };
    // Keep stored phones/emails lists in step, in the shape they already use.
    if (editing !== "new" && Array.isArray(editing.phones)) payload.phones = labelled(editing.phones) ? phones.map((r) => ({ type: r.type || null, number: r.value })) : phones.map((r) => r.value);
    if (editing !== "new" && Array.isArray(editing.emails)) payload.emails = labelled(editing.emails) ? emails.map((r) => ({ type: r.type || null, address: r.value })) : emails.map((r) => r.value);
    try {
      const res = editing === "new" ? await createContact(payload) : await updateContact(editing.id, payload);
      if (!res?.success) throw new Error(res?.message || "Couldn't save the contact");
      await load();
      showFlash(editing === "new" ? `Added ${payload.name}` : `Saved ${payload.name}`);
      setEditing(null);
    } catch (err) {
      setFormError(err.message || "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const setListed = async (c, active) => {
    try {
      const res = await toggleContactStatus(c.id, active);
      if (!res?.success) throw new Error(res?.message || "Couldn't update it");
      await load();
      showFlash(active ? `Listed ${c.name}` : `Hid ${c.name}`);
    } catch (err) {
      showFlash(err.message || "Couldn't update it", false);
    }
  };

  const remove = async (c) => {
    try {
      const res = await deleteContact(c.id);
      if (!res?.success) throw new Error(res?.message || "Couldn't delete it");
      await load();
      showFlash(`Deleted ${c.name}`);
    } catch (err) {
      showFlash(err.message || "Couldn't delete it", false);
    }
  };

  const filtering = query || listing !== "all" || category !== "all";
  const formCategories = useMemo(() => {
    const opts = CATEGORIES.map((c) => ({ value: c.key, label: c.label }));
    return form.category && !CATEGORIES.some((c) => c.key === form.category) ? [...opts, { value: form.category, label: form.category }] : opts;
  }, [form.category]);
  const phoneLabels = editing && editing !== "new" && labelled(editing.phones);
  const emailLabels = editing && editing !== "new" && labelled(editing.emails);

  return (
    <div className="grid gap-5">
      <PageHead
        title="Contacts"
        lead="The public campus directory. Hidden contacts stay here but are not shown to students."
        actions={
          <>
            {!process.env.NEXT_PUBLIC_BACKEND_URL ? <Tag tone="bad">backend not configured</Tag> : null}
            <Button tone="ghost" onClick={load}>Refresh</Button>
            <Button tone="primary" onClick={openNew}>New contact</Button>
          </>
        }
      />

      <Stats
        items={[
          { label: "Listed", value: listed.length },
          { label: "Hidden", value: items.length - listed.length },
          { label: "Emergency, listed", value: listed.filter((c) => c.category === "emergency").length },
          { label: "Listed, no phone or email", value: unreachable.length, mark: true },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented label="Category" value={category} onChange={setCategory} options={categoryOptions} />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search name, role, phone or email" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Status" value={listing} onChange={setListing} options={[{ value: "all", label: "Any status" }, { value: "listed", label: "Listed" }, { value: "hidden", label: "Hidden" }]} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtering ? "no matches" : "no contacts"}
            body={filtering ? "Try a different search, category or status." : "Add the offices and helplines students should be able to reach."}
            action={!filtering ? <Button tone="primary" onClick={openNew}>New contact</Button> : null}
          />
        ) : (
          <>
            <Table label="Contacts" minWidth={980}>
              <thead>
                <tr>
                  <Th>Contact</Th>
                  <Th>Category</Th>
                  <Th>Phone</Th>
                  <Th>Email</Th>
                  <Th>Location and hours</Th>
                  <Th>Status</Th>
                  <Th align="right">
                    <span className="sr-only">Actions</span>
                  </Th>
                </tr>
              </thead>
              <tbody>
                {shown.slice(0, limit).map((c) => {
                  const listedNow = isListed(c);
                  return (
                    <Tr key={c.id}>
                      <Td className="max-w-[240px]">
                        <TwoLine title={c.name || "—"} sub={c.role} />
                      </Td>
                      <Td>
                        <Tag tone={c.category === "emergency" ? "bad" : "neutral"}>{categoryLabel(c.category)}</Tag>
                      </Td>
                      <Td className="max-w-[200px]">
                        <LinkList items={phonesOf(c)} href={telHref} />
                      </Td>
                      <Td className="max-w-[240px]">
                        <LinkList items={emailsOf(c)} href={(v) => `mailto:${v}`} />
                      </Td>
                      <Td className="max-w-[220px]">
                        {c.location || c.hours ? (
                          <div className="min-w-0">
                            <div className="truncate text-[13px]">{c.location || "—"}</div>
                            <div className="c-mono mt-0.5 truncate text-[11.5px] text-[var(--c-faint)]">{c.hours || "—"}</div>
                          </div>
                        ) : (
                          <span className="text-[var(--c-faint)]">—</span>
                        )}
                      </Td>
                      <Td>
                        <Tag tone={listedNow ? "good" : "neutral"}>{listedNow ? "listed" : "hidden"}</Tag>
                      </Td>
                      <Td align="right">
                        <div className="flex items-center justify-end gap-1">
                          {listedNow ? (
                            <Button size="sm" tone="ghost" onClick={() => setListed(c, false)}>Hide</Button>
                          ) : (
                            <Button size="sm" tone="primary" onClick={() => setListed(c, true)}>List</Button>
                          )}
                          <Button size="sm" tone="ghost" onClick={() => openEdit(c)}>Edit</Button>
                          <ConfirmButton onConfirm={() => remove(c)} />
                        </div>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
            {shown.length > limit ? (
              <div className="flex justify-center border-t border-[var(--c-line)] px-5 py-3">
                <Button size="sm" tone="plain" onClick={() => setLimit((n) => n + PAGE)}>
                  Show more <span className="c-mono text-[var(--c-faint)]">{shown.length - limit} left</span>
                </Button>
              </div>
            ) : null}
          </>
        )}
        <FlashLine flash={flash} hint={status === "ready" ? `${Math.min(limit, shown.length)} of ${shown.length} shown · / to search` : "/ to search"} />
      </Panel>

      <Drawer
        open={editing !== null}
        onClose={close}
        title={editing === "new" ? "New contact" : "Edit contact"}
        subtitle={editing && editing !== "new" ? `${categoryLabel(editing.category)} · ${isListed(editing) ? "listed" : "hidden"}` : "shows in the public directory as soon as you save, unless you switch it off"}
        width={560}
        footer={
          <>
            {formError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{formError}</p> : null}
            <Button tone="ghost" onClick={close}>Cancel</Button>
            <Button tone="primary" onClick={save} disabled={saving}>{saving ? "Saving…" : editing === "new" ? "Create" : "Save"}</Button>
          </>
        }
      >
        <form onSubmit={save} className="grid gap-5">
          <Field label="Name">
            {(id) => <TextInput id={id} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Campus security" />}
          </Field>
          <Field label="Role" hint="What they handle, e.g. 24x7 helpline or Examinations and results.">
            {(id) => <TextInput id={id} required value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Role or department" />}
          </Field>
          <Field label="Category">
            {(id) => <SelectInput id={id} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={formCategories} />}
          </Field>
          <MultiField legend="Phone numbers" noun="Phone" type="tel" rows={form.phones} withType={phoneLabels} onChange={(phones) => setForm({ ...form, phones })} placeholder="+91 98765 43210" hint={phoneLabels ? "Label is optional, e.g. office." : null} />
          <MultiField legend="Email addresses" noun="Email" type="email" rows={form.emails} withType={emailLabels} onChange={(emails) => setForm({ ...form, emails })} placeholder="office@university.edu" hint={emailLabels ? "Label is optional, e.g. work." : null} />
          <Field label="Location">
            {(id) => <TextInput id={id} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="A-Block, room 101" />}
          </Field>
          <Field label="Hours" hint="Written like Mon-Fri 9:00-17:00 or 24/7, the public page can show whether it's open now.">
            {(id) => <div className="c-mono"><TextInput id={id} value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} placeholder="Mon-Fri 9:00-17:00" /></div>}
          </Field>
          <Toggle checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Listed" hint={form.active ? "Students can see it in the directory." : "Saved, but hidden from the directory."} />
          <button type="submit" className="hidden" />
        </form>
      </Drawer>
    </div>
  );
}

export default function AdminContactsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ContactsSection />
      </AdminLayout>
    </AdminGuard>
  );
}
