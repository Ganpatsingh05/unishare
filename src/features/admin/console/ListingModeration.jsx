"use client";

// One page for every "listings" section of the console (rides, housing,
// marketplace, tickets, lost & found). Each section passes a config that says
// how to load, describe and remove its items; the page does the rest.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  ConfirmButton,
  Drawer,
  Empty,
  Facts,
  Failed,
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
  Th,
  Toolbar,
  Tr,
  TwoLine,
  dateTime,
  since,
  useFlash,
} from "./ui";

/* --------------------------------------------------------------- helpers */

const blank = (v) => v == null || (typeof v === "string" && v.trim() === "");

/** "₹1,250", or "—" when there's no price. */
export function money(n) {
  if (blank(n) || Number.isNaN(Number(n))) return "—";
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

/** "12 Mar 2026", or "—". */
export function day(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/** A Date from a date ("2026-03-12" or ISO) and an optional "HH:MM" time. */
export function when(date, time) {
  if (!date) return null;
  const plain = /^\d{4}-\d{2}-\d{2}$/.test(String(date));
  const d = plain && time ? new Date(`${date}T${String(time).slice(0, 5)}`) : new Date(date);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** A value in the mono face, or "—". */
export const Mono = ({ children }) => (blank(children) ? "—" : <span className="c-mono text-[12.5px]">{children}</span>);

/** Fact rows for whatever contact details a listing carries (object or plain text). */
function contactRows(info) {
  if (blank(info)) return [];
  if (typeof info === "string") return [["Contact", info]];
  const link = (href, text) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="break-all text-[var(--c-link)] underline underline-offset-2">
      {text}
    </a>
  );
  const rows = [];
  if (!blank(info.email)) rows.push(["Email", link(`mailto:${info.email}`, info.email)]);
  if (!blank(info.phone)) rows.push(["Phone", <Mono key="p">{info.phone}</Mono>]);
  if (!blank(info.mobile)) rows.push(["Mobile", <Mono key="m">{info.mobile}</Mono>]);
  if (!blank(info.instagram)) rows.push(["Instagram", info.instagram]);
  if (!blank(info.link) && /^https?:\/\//i.test(info.link)) rows.push(["Link", link(info.link, info.link)]);
  return rows;
}

/* ------------------------------------------------------------------ page */

/**
 * Config:
 *  title, lead                 page heading and one line of context
 *  noun                        { one: "ride", many: "rides" } for copy
 *  load()                      resolves to an array of items; throws on failure
 *  remove(item)                deletes one item; throws on failure
 *  updateStatus(item, value)   optional; throws on failure
 *  statusActions(item)         optional; [{ value, label }] offered in the drawer
 *  tabs                        [{ value, label, test(item, now) }]; first is "all"-like
 *  defaultTab                  optional, defaults to tabs[0]
 *  filters                     optional [{ key, label, all, options(items) | options[], test(item, value) }]
 *  search(item)                text to match the search box against
 *  searchPlaceholder
 *  stats(items, now)           [{ label, value, mark }] for the figures row
 *  name(item), subtitle(item)  the listing cell
 *  owner(item)                 who posted it
 *  price(item), priceLabel    optional number or null; column heading (default "Price"). Omit price to hide the column
 *  status(item)                optional { label, tone } or null
 *  posted(item)                created timestamp
 *  updated(item)               optional updated timestamp
 *  columns                     optional extra [{ label, render(item), align, mono }] after the listing cell
 *  facts(item)                 Facts rows for the drawer
 *  description(item)           optional long text for the drawer
 *  images(item)                optional array of image URLs
 *  contact(item)               optional contact object or string already in the data
 */
const NO_FILTERS = [];

export default function ListingModeration(config) {
  const { title, lead, noun, load, remove, updateStatus, statusActions, tabs, defaultTab, filters = NO_FILTERS, search, searchPlaceholder, stats } = config;

  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(defaultTab || tabs[0].value);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState(() => Object.fromEntries(filters.map((f) => [f.key, "all"])));
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [flash, showFlash] = useFlash();

  const fetchAll = useCallback(async () => {
    setError(null);
    try {
      const list = await load();
      setItems(Array.isArray(list) ? list : []);
      setNow(Date.now());
      setState("ready");
      return true;
    } catch (e) {
      const msg = e?.message || `Couldn't load ${noun.many}.`;
      setError(msg);
      setState((s) => (s === "ready" ? "ready" : "error"));
      return msg;
    }
  }, [load, noun.many]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refresh = async () => {
    const r = await fetchAll();
    if (r === true) showFlash(`Refreshed ${noun.many}`);
    else if (state === "ready") showFlash(r, false);
  };

  const counts = useMemo(() => Object.fromEntries(tabs.map((t) => [t.value, items.filter((i) => t.test(i, now)).length])), [items, tabs, now]);

  const filterOptions = useMemo(
    () =>
      filters.map((f) => {
        const opts = typeof f.options === "function" ? f.options(items) : f.options;
        return { ...f, opts: [{ value: "all", label: f.all }, ...opts] };
      }),
    [filters, items]
  );

  const shown = useMemo(() => {
    const t = tabs.find((x) => x.value === tab) || tabs[0];
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      if (!t.test(i, now)) return false;
      if (q && !String(search(i) || "").toLowerCase().includes(q)) return false;
      return filters.every((f) => picked[f.key] === "all" || f.test(i, picked[f.key]));
    });
  }, [items, tabs, tab, query, search, filters, picked, now]);

  const filtering = !!query.trim() || filters.some((f) => picked[f.key] !== "all");
  const close = useCallback(() => setOpen(null), []);

  const doRemove = async (item) => {
    const name = config.name(item) || `untitled ${noun.one}`;
    try {
      await remove(item);
      setOpen((o) => (o === item ? null : o));
      showFlash(`Deleted “${name}”`);
      const r = await fetchAll();
      if (r !== true) showFlash(`Deleted “${name}”, but couldn't reload the list`, false);
    } catch (e) {
      showFlash(e?.message || `Couldn't delete “${name}”`, false);
    }
  };

  const doStatus = async (item, value, label) => {
    setBusy(true);
    try {
      await updateStatus(item, value);
      showFlash(`${label}: “${config.name(item)}”`);
      await fetchAll();
      setOpen(null);
    } catch (e) {
      showFlash(e?.message || "Couldn't change the status", false);
    } finally {
      setBusy(false);
    }
  };

  const extra = config.columns || [];
  const hasStatus = typeof config.status === "function";
  const hasPrice = typeof config.price === "function";

  return (
    <div className="grid gap-5">
      <PageHead title={title} lead={lead} actions={<Button tone="ghost" onClick={refresh}>Refresh</Button>} />

      <Stats items={state === "ready" ? stats(items, now) : stats([], now).map((s) => ({ ...s, value: null, mark: false }))} />

      <Panel>
        <Toolbar>
          <Segmented label={`Which ${noun.many}`} value={tab} onChange={setTab} options={tabs.map((t) => ({ value: t.value, label: t.label, count: state === "ready" ? counts[t.value] : null }))} />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder={searchPlaceholder} className="flex-1 sm:w-[260px] sm:flex-none" />
            {filterOptions.map((f) => (
              <Select key={f.key} label={f.label} value={picked[f.key]} onChange={(v) => setPicked((p) => ({ ...p, [f.key]: v }))} options={f.opts} />
            ))}
          </div>
        </Toolbar>

        {state === "loading" ? (
          <SkeletonRows />
        ) : state === "error" ? (
          <Failed message={error} onRetry={fetchAll} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtering ? "no matches" : items.length === 0 ? `no ${noun.many}` : "nothing here"}
            body={filtering ? "Try a different search or filter." : items.length === 0 ? `Nobody has posted any ${noun.many} yet.` : `No ${noun.many} in this tab.`}
            action={filtering ? <Button onClick={() => { setQuery(""); setPicked(Object.fromEntries(filters.map((f) => [f.key, "all"]))); }}>Clear filters</Button> : null}
          />
        ) : (
          <Table label={title} minWidth={860}>
            <thead>
              <tr>
                <Th>{noun.column || "Listing"}</Th>
                {extra.map((c) => (
                  <Th key={c.label} align={c.align}>{c.label}</Th>
                ))}
                <Th>Posted by</Th>
                {hasPrice ? <Th align="right">{config.priceLabel || "Price"}</Th> : null}
                {hasStatus ? <Th>Status</Th> : null}
                <Th>Posted</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((item) => {
                const st = hasStatus ? config.status(item) : null;
                return (
                  <Tr key={item.id} onClick={() => setOpen(item)} selected={open === item}>
                    <Td className="max-w-[300px]">
                      <TwoLine title={config.name(item) || "—"} sub={config.subtitle?.(item)} />
                    </Td>
                    {extra.map((c) => (
                      <Td key={c.label} align={c.align} mono={c.mono} className={c.mono ? "whitespace-nowrap" : ""}>
                        {c.render(item) ?? "—"}
                      </Td>
                    ))}
                    <Td>
                      <span className="whitespace-nowrap text-[13px]">{config.owner(item) || "—"}</span>
                    </Td>
                    {hasPrice ? <Td align="right" mono className="whitespace-nowrap">{money(config.price(item))}</Td> : null}
                    {hasStatus ? <Td>{st ? <Tag tone={st.tone}>{st.label}</Tag> : "—"}</Td> : null}
                    <Td mono className="whitespace-nowrap text-[var(--c-muted)]">{since(config.posted(item))}</Td>
                    <Td align="right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" tone="ghost" onClick={() => setOpen(item)} aria-label={`View ${config.name(item) || noun.one}`}>
                          View
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint={`/ to search · click a row for details · ${shown.length} shown`} />
      </Panel>

      <Detail
        item={open}
        config={config}
        onClose={close}
        onRemove={doRemove}
        onStatus={updateStatus && statusActions ? doStatus : null}
        busy={busy}
      />
    </div>
  );
}

/* ---------------------------------------------------------------- drawer */

function Detail({ item: current, config, onClose, onRemove, onStatus, busy }) {
  const { noun } = config;
  // Keep showing the last item while the drawer slides out.
  const [item, setItem] = useState(current);
  if (current && current !== item) setItem(current);
  const price = item && config.price ? config.price(item) : null;
  const images = item ? (config.images?.(item) || []).filter((u) => typeof u === "string" && /^(https?:)?\/\//i.test(u)) : [];
  const contact = item ? contactRows(config.contact?.(item)) : [];
  const description = item ? config.description?.(item) : null;
  const st = item && config.status ? config.status(item) : null;
  const actions = item && onStatus ? config.statusActions(item) : [];

  return (
    <Drawer
      open={!!current}
      onClose={onClose}
      title={item ? config.name(item) || `Untitled ${noun.one}` : ""}
      subtitle={item ? `posted ${since(config.posted(item))}${config.owner(item) ? ` by ${config.owner(item)}` : ""}` : ""}
      footer={
        item ? (
          <>
            <Button tone="ghost" className="mr-auto" onClick={onClose}>Close</Button>
            {actions.map((a) => (
              <Button key={a.value} disabled={busy} onClick={() => onStatus(item, a.value, a.label)}>
                {a.label}
              </Button>
            ))}
            <ConfirmButton size="md" question={`Delete this ${noun.one}?`} onConfirm={() => onRemove(item)}>
              Delete {noun.one}
            </ConfirmButton>
          </>
        ) : null
      }
    >
      {item ? (
        <div className="grid gap-5">
          {st || !blank(price) ? (
            <div className="flex flex-wrap items-center gap-2">
              {st ? <Tag tone={st.tone}>{st.label}</Tag> : null}
              {!blank(price) ? <span className="c-mono text-[15px] font-semibold">{money(price)}</span> : null}
            </div>
          ) : null}

          {images.length ? (
            <section aria-label="Photos">
              <h3 className="c-mono mb-2 text-[11px] text-[var(--c-faint)]">Photos <span className="ml-1">{images.length}</span></h3>
              <ul className="grid grid-cols-3 gap-2">
                {images.map((src, i) => (
                  <li key={src + i}>
                    <a href={src} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-[8px] border border-[var(--c-line)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={`Photo ${i + 1} of ${images.length}`} loading="lazy" className="aspect-square w-full bg-[var(--c-panel-2)] object-cover" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <Facts rows={config.facts(item)} />

          {!blank(description) ? (
            <section>
              <h3 className="c-mono mb-2 text-[11px] text-[var(--c-faint)]">Description</h3>
              <p className="whitespace-pre-wrap text-[14px] leading-relaxed">{description}</p>
            </section>
          ) : null}

          {contact.length ? (
            <section>
              <h3 className="c-mono mb-2 text-[11px] text-[var(--c-faint)]">Contact</h3>
              <Facts rows={contact} />
            </section>
          ) : null}

          <Facts
            rows={[
              ["Posted by", config.owner(item) || "—"],
              item.user_id ? ["User ID", <Mono key="u">{item.user_id}</Mono>] : null,
              ["Posted", <Mono key="c">{dateTime(config.posted(item))}</Mono>],
              config.updated?.(item) && config.updated(item) !== config.posted(item) ? ["Updated", <Mono key="up">{dateTime(config.updated(item))}</Mono>] : null,
              ["Listing ID", <Mono key="id">{item.id}</Mono>],
            ]}
          />
        </div>
      ) : null}
    </Drawer>
  );
}
