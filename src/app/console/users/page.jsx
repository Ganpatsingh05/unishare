"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { getAdminUsers } from "@lib/api/api";
import { getPublicUserProfile } from "@lib/api/userProfile";
import { getProfileImageUrl, getUserInitials } from "@lib/utils/profileUtils";
import {
  Button,
  Drawer,
  Empty,
  Failed,
  Facts,
  FlashLine,
  PageHead,
  Panel,
  RING,
  SearchField,
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
} from "@features/admin/console/ui";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const STATUS_TONE = { active: "good", inactive: "bad" };

const text = (v) => (typeof v === "string" && v.trim() ? v.trim() : null);
const count = (v) => (v == null || Number.isNaN(Number(v)) ? null : Number(v));
const fmt = (v) => (v == null ? "—" : Number(v).toLocaleString());
const label = (v) => (v ? v.charAt(0).toUpperCase() + v.slice(1) : "—");

/** One shape for a row, from whatever the users table carries. Nothing is made up. */
function toPerson(u) {
  const username = text(u.custom_user_id);
  return {
    raw: u,
    id: u.id ?? u.user_id ?? null,
    name: text(u.name) || text(u.display_name) || text(u.username) || username,
    email: text(u.email),
    username,
    picture: text(u.picture) || text(u.avatar),
    role: text(u.role),
    status: text(u.status),
    joinedAt: u.created_at || u.join_date || null,
    updatedAt: u.updated_at || u.last_login || u.last_active || null,
    rides: count(u.ridesCount ?? u.rides_count),
    tickets: count(u.ticketsCount),
    lostFound: count(u.lostFoundCount),
    posts: count(u.postsCount ?? u.posts_count),
  };
}

function Initials({ name, size = 32 }) {
  return (
    <span aria-hidden className="c-mono inline-flex shrink-0 items-center justify-center rounded-[7px] border border-[var(--c-line-2)] bg-[var(--c-panel-2)] text-[11.5px] font-semibold text-[var(--c-muted)]" style={{ width: size, height: size }}>
      {getUserInitials(name || "")}
    </span>
  );
}

function UsersSection() {
  const [people, setPeople] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("all");
  const [state, setState] = useState("all");
  const [open, setOpen] = useState(null);
  const [profiles, setProfiles] = useState({}); // username -> { status, data, error }
  const [flash, showFlash] = useFlash();
  const asked = useRef(new Set());
  const loaded = useRef(false);

  const load = useCallback(async () => {
    setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        throw new Error("Backend URL not configured. Set NEXT_PUBLIC_BACKEND_URL in .env.local.");
      }
      const res = await getAdminUsers();
      if (!res?.success) throw new Error(res?.message || "Failed to load users");
      setPeople((res.users || []).map(toPerson));
      if (loaded.current) showFlash("Refreshed");
      loaded.current = true;
      setStatus("ready");
    } catch (e) {
      const msg = e.message || "Failed to load users";
      setError(msg);
      if (loaded.current) showFlash(`Couldn't refresh: ${msg}`, false);
      else setStatus("error");
    }
  }, [showFlash]);

  useEffect(() => {
    load();
  }, [load]);

  const roles = useMemo(() => [...new Set(people.map((p) => p.role).filter(Boolean))].sort(), [people]);
  const states = useMemo(() => [...new Set(people.map((p) => p.status).filter(Boolean))].sort(), [people]);

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: people.length,
      week: people.filter((p) => p.joinedAt && now - new Date(p.joinedAt).getTime() <= WEEK_MS).length,
      active: people.filter((p) => p.status === "active").length,
      inactive: people.filter((p) => p.status === "inactive").length,
    };
  }, [people]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      const hit = !q || [p.name, p.email, p.username].some((v) => v?.toLowerCase().includes(q));
      return hit && (role === "all" || p.role === role) && (state === "all" || p.status === state);
    });
  }, [people, query, role, state]);

  const loadProfile = useCallback(async (username) => {
    if (!username || asked.current.has(username)) return;
    asked.current.add(username);
    setProfiles((m) => ({ ...m, [username]: { status: "loading" } }));
    try {
      const res = await getPublicUserProfile(username);
      const data = res?.data || null;
      setProfiles((m) => ({ ...m, [username]: { status: data ? "ready" : "none", data } }));
    } catch (e) {
      const notFound = /not found|404/i.test(e?.message || "");
      if (!notFound) asked.current.delete(username);
      setProfiles((m) => ({ ...m, [username]: notFound ? { status: "none" } : { status: "error", error: e?.message || "Couldn't load the profile" } }));
    }
  }, []);

  const openPerson = (p) => {
    setOpen(p);
    loadProfile(p.username);
  };
  const close = useCallback(() => setOpen(null), []);

  const filtered = query || role !== "all" || state !== "all";
  const profile = open?.username ? profiles[open.username] : null;
  const image = open ? getProfileImageUrl(profile?.data || null, { picture: open.picture }) : null;

  return (
    <div className="grid gap-5">
      <PageHead
        title="Users"
        lead="Everyone with a UniShare account, newest first. Open a person to see their account details and public profile."
        actions={<Button tone="ghost" onClick={load}>Refresh</Button>}
      />

      <Stats
        items={[
          { label: "Total users", value: status === "ready" ? fmt(stats.total) : null },
          { label: "Joined in the last 7 days", value: status === "ready" ? fmt(stats.week) : null },
          { label: "Active", value: status === "ready" ? fmt(stats.active) : null },
          { label: "Inactive", value: status === "ready" ? fmt(stats.inactive) : null },
        ]}
      />

      <Panel>
        <Toolbar>
          <SearchField value={query} onChange={setQuery} placeholder="Search name, email or username" className="w-full sm:w-[300px]" />
          <div className="ml-auto flex flex-wrap gap-2">
            <Select label="Role" value={role} onChange={setRole} options={[{ value: "all", label: "Any role" }, ...roles.map((r) => ({ value: r, label: label(r) }))]} />
            <Select label="Status" value={state} onChange={setState} options={[{ value: "all", label: "Any status" }, ...states.map((s) => ({ value: s, label: label(s) }))]} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty title={filtered ? "no matches" : "no users yet"} body={filtered ? "Try a different search, role or status." : "Accounts appear here once people sign in."} />
        ) : (
          <Table label="Users" minWidth={880}>
            <thead>
              <tr>
                <Th>Person</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Joined</Th>
                <Th>Updated</Th>
                <Th align="right">Rides</Th>
                <Th align="right">Tickets</Th>
                <Th align="right">Lost &amp; found</Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((p, i) => (
                <Tr key={p.id ?? p.email ?? i} onClick={() => openPerson(p)} selected={open?.id != null && open.id === p.id}>
                  <Td className="max-w-[340px]">
                    <button type="button" onClick={(e) => { e.stopPropagation(); openPerson(p); }} className={`flex w-full min-w-0 items-center gap-3 rounded-[6px] text-left ${RING}`}>
                      <Initials name={p.name || p.email} />
                      <TwoLine title={p.name || "—"} sub={p.email || "—"} />
                    </button>
                  </Td>
                  <Td>{p.role ? <Tag>{p.role}</Tag> : "—"}</Td>
                  <Td>{p.status ? <Tag tone={STATUS_TONE[p.status] || "neutral"}>{p.status}</Tag> : "—"}</Td>
                  <Td mono className="whitespace-nowrap text-[var(--c-muted)]">{since(p.joinedAt)}</Td>
                  <Td mono className="whitespace-nowrap text-[var(--c-muted)]">{since(p.updatedAt)}</Td>
                  <Td mono align="right">{fmt(p.rides)}</Td>
                  <Td mono align="right">{fmt(p.tickets)}</Td>
                  <Td mono align="right">{fmt(p.lostFound)}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint={status === "ready" ? `${shown.length} of ${people.length} shown · / to search` : "/ to search"} />
      </Panel>

      <Drawer open={open !== null} onClose={close} title={open?.name || open?.email || "User"} subtitle={open ? [open.username, open.joinedAt ? `joined ${since(open.joinedAt)}` : null].filter(Boolean).join(" · ") || undefined : undefined}>
        {open ? (
          <div className="grid gap-6">
            <div className="flex items-center gap-3">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt="" referrerPolicy="no-referrer" className="h-12 w-12 shrink-0 rounded-[9px] border border-[var(--c-line)] object-cover" />
              ) : (
                <Initials name={open.name || open.email} size={48} />
              )}
              <TwoLine title={open.name || "—"} sub={open.email || "—"} />
            </div>

            <section className="grid gap-2">
              <h3 className="c-mono text-[11px] text-[var(--c-faint)]">Account</h3>
              <Facts
                rows={[
                  ["Name", open.name],
                  ["Email", open.email ? <span className="c-mono text-[12.5px]">{open.email}</span> : null],
                  ["Username", open.username ? <span className="c-mono text-[12.5px]">{open.username}</span> : null],
                  ["Role", open.role ? <Tag>{open.role}</Tag> : null],
                  ["Status", open.status ? <Tag tone={STATUS_TONE[open.status] || "neutral"}>{open.status}</Tag> : null],
                  ["Joined", <span key="j" className="c-mono text-[12.5px]">{dateTime(open.joinedAt)}</span>],
                  ["Updated", <span key="u" className="c-mono text-[12.5px]">{dateTime(open.updatedAt)}</span>],
                ]}
              />
            </section>

            <section className="grid gap-2">
              <h3 className="c-mono text-[11px] text-[var(--c-faint)]">Activity</h3>
              <Facts
                rows={[
                  ["Rides", <span key="r" className="c-mono">{fmt(open.rides)}</span>],
                  ["Tickets", <span key="t" className="c-mono">{fmt(open.tickets)}</span>],
                  ["Lost & found", <span key="l" className="c-mono">{fmt(open.lostFound)}</span>],
                ]}
              />
            </section>

            <section className="grid gap-2">
              <h3 className="c-mono text-[11px] text-[var(--c-faint)]">Public profile</h3>
              {!open.username ? (
                <p className="text-[13.5px] text-[var(--c-muted)]">This person hasn&apos;t set up a public profile.</p>
              ) : !profile || profile.status === "loading" ? (
                <p aria-busy="true" className="c-mono text-[12px] text-[var(--c-faint)]">Loading profile…</p>
              ) : profile.status === "none" ? (
                <p className="text-[13.5px] text-[var(--c-muted)]">No public profile found for <span className="c-mono">{open.username}</span>.</p>
              ) : profile.status === "error" ? (
                <div role="alert" className="flex flex-wrap items-center gap-3">
                  <p className="text-[13.5px] text-[var(--c-bad)]">{profile.error}</p>
                  <Button size="sm" tone="plain" onClick={() => loadProfile(open.username)}>Try again</Button>
                </div>
              ) : (
                <Facts
                  rows={[
                    ["Display name", text(profile.data.display_name)],
                    ["Username", text(profile.data.custom_user_id) ? <span className="c-mono text-[12.5px]">{profile.data.custom_user_id}</span> : null],
                    ["Bio", text(profile.data.bio) ? <span className="whitespace-pre-line">{profile.data.bio}</span> : null],
                    ["Profile since", <span key="c" className="c-mono text-[12.5px]">{dateTime(profile.data.created_at)}</span>],
                  ]}
                />
              )}
            </section>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <UsersSection />
      </AdminLayout>
    </AdminGuard>
  );
}
