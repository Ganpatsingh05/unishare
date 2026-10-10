"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminGuard from "@features/admin/components/AdminGuard";
import AdminLayout from "@features/admin/components/AdminLayout";
import { getAdminReports, updateReportStatus } from "@lib/api/api";
import {
  Button,
  Drawer,
  Empty,
  Facts,
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
  Th,
  Toolbar,
  Tr,
  TwoLine,
  dateTime,
  since,
  useFlash,
} from "@features/admin/console/ui";

const STATUS_TONE = { pending: "mark", reviewing: "info", resolved: "good", dismissed: "neutral" };
const PRIORITY_TONE = { high: "bad", medium: "neutral", low: "neutral" };
const CATEGORY_OPTIONS = [
  { value: "all", label: "Any category" },
  { value: "rideshare", label: "Rideshare" },
  { value: "marketplace", label: "Marketplace" },
  { value: "lost-found", label: "Lost and found" },
  { value: "announcements", label: "Announcements" },
  { value: "user-profile", label: "User profile" },
];
const PRIORITY_OPTIONS = [
  { value: "all", label: "Any priority" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];
const NOTES_MAX = 500;

/** "inappropriate_content" -> "Inappropriate content". */
const humanize = (s) => {
  if (!s) return null;
  const t = String(s).replace(/[_-]+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
};
/** The API sends "Unknown" when it can't resolve a user; show a dash instead. */
const who = (email) => (email && email !== "Unknown" ? email : "—");
const isOpen = (r) => r.status === "pending" || r.status === "reviewing";

function ReportsSection() {
  const [reports, setReports] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("pending");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(null); // null | "resolved" | "dismissed"
  const [actionError, setActionError] = useState(null);
  const [flash, showFlash] = useFlash();

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await getAdminReports({
        category: category !== "all" ? category : undefined,
        priority: priority !== "all" ? priority : undefined,
        limit: 100,
      });
      if (!res?.success) throw new Error(res?.message || "Failed to load reports");
      setReports(res.reports || []);
      setStatus("ready");
    } catch (e) {
      setError(e.message || "Failed to load reports");
      setStatus((s) => (s === "ready" ? "ready" : "error"));
    }
  }, [category, priority]);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const c = { pending: 0, reviewing: 0, resolved: 0, dismissed: 0, highPending: 0 };
    reports.forEach((r) => {
      if (c[r.status] != null) c[r.status] += 1;
      if (r.status === "pending" && r.priority === "high") c.highPending += 1;
    });
    return c;
  }, [reports]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reports.filter((r) => {
      if (tab !== "all" && r.status !== tab) return false;
      if (!q) return true;
      return [r.content, r.reason, r.reportedBy, r.reportedUser, r.type].some((v) => v && String(v).toLowerCase().includes(q));
    });
  }, [reports, tab, query]);

  const openReport = (r) => {
    setNotes("");
    setActionError(null);
    setOpen(r);
  };
  const close = useCallback(() => setOpen(null), []);

  const decide = async (r, next) => {
    const action = next === "resolved" ? "Content removed" : "no_action";
    const fallbackNotes = next === "resolved" ? `Report resolved with action: ${action}` : "Report dismissed - no action required";
    const finalNotes = notes.trim() || fallbackNotes;
    setBusy(next);
    setActionError(null);
    try {
      await updateReportStatus(r.id, next, action, finalNotes);
      setReports((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: next, action, resolutionNotes: finalNotes, updatedAt: new Date().toISOString() } : x)));
      showFlash(next === "resolved" ? `Resolved report ${r.id}` : `Dismissed report ${r.id}`);
      setOpen(null);
    } catch (err) {
      setActionError(err.message || (next === "resolved" ? "Couldn't resolve it. Try again." : "Couldn't dismiss it. Try again."));
    } finally {
      setBusy(null);
    }
  };

  const filtered = query || category !== "all" || priority !== "all";

  return (
    <div className="grid gap-5">
      <PageHead
        title="Reports"
        lead="Content students have flagged. Review each one, then resolve it or dismiss it."
        actions={<Button tone="ghost" onClick={load}>Refresh</Button>}
      />

      <Stats
        items={[
          { label: "Pending", value: counts.pending, mark: true },
          { label: "High priority, pending", value: counts.highPending, mark: true },
          { label: "Resolved", value: counts.resolved },
          { label: "Dismissed", value: counts.dismissed },
        ]}
      />

      <Panel>
        <Toolbar>
          <Segmented
            label="Report status"
            value={tab}
            onChange={setTab}
            options={[
              { value: "pending", label: "Pending", count: counts.pending },
              { value: "reviewing", label: "Reviewing", count: counts.reviewing },
              { value: "resolved", label: "Resolved", count: counts.resolved },
              { value: "dismissed", label: "Dismissed", count: counts.dismissed },
              { value: "all", label: "All", count: reports.length },
            ]}
          />
          <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto">
            <SearchField value={query} onChange={setQuery} placeholder="Search reason, content or email" className="flex-1 sm:w-[260px] sm:flex-none" />
            <Select label="Category" value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
            <Select label="Priority" value={priority} onChange={setPriority} options={PRIORITY_OPTIONS} />
          </div>
        </Toolbar>

        {status === "loading" ? (
          <SkeletonRows />
        ) : status === "error" ? (
          <Failed message={error} onRetry={load} />
        ) : shown.length === 0 ? (
          <Empty
            title={filtered ? "no matches" : tab === "pending" ? "nothing to review" : "nothing here"}
            body={filtered ? "Try a different search, category or priority." : tab === "pending" ? "New reports from students land here." : "No reports with this status."}
          />
        ) : (
          <Table label="Reports" minWidth={860}>
            <thead>
              <tr>
                <Th>Report</Th>
                <Th>Category</Th>
                <Th>Priority</Th>
                {tab === "all" ? <Th>Status</Th> : null}
                <Th>Reported by</Th>
                <Th>Received</Th>
                <Th align="right">
                  <span className="sr-only">Actions</span>
                </Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((r) => (
                <Tr key={r.id} onClick={() => openReport(r)} selected={open?.id === r.id}>
                  <Td className="max-w-[380px]">
                    <TwoLine title={r.reason || humanize(r.type) || "—"} sub={r.content} />
                    <div className="c-mono mt-1 text-[11px] text-[var(--c-faint)]">
                      #{r.id}
                      {r.type ? ` · ${String(r.type).replace(/_/g, " ")}` : ""}
                    </div>
                  </Td>
                  <Td>{r.category ? <Tag>{r.category}</Tag> : "—"}</Td>
                  <Td>{r.priority ? <Tag tone={PRIORITY_TONE[r.priority] || "neutral"}>{r.priority}</Tag> : "—"}</Td>
                  {tab === "all" ? <Td>{r.status ? <Tag tone={STATUS_TONE[r.status] || "neutral"}>{r.status}</Tag> : "—"}</Td> : null}
                  <Td mono className="text-[var(--c-muted)]">{who(r.reportedBy)}</Td>
                  <Td mono className="whitespace-nowrap text-[var(--c-muted)]">{since(r.createdAt)}</Td>
                  <Td align="right">
                    <Button
                      size="sm"
                      tone={isOpen(r) ? "plain" : "ghost"}
                      onClick={(e) => {
                        e.stopPropagation();
                        openReport(r);
                      }}
                    >
                      {isOpen(r) ? "Review" : "View"}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
        <FlashLine flash={flash} hint={`${counts.pending} pending · / to search`} />
      </Panel>

      <Drawer
        open={open !== null}
        onClose={close}
        title={open ? open.reason || humanize(open.type) || `Report ${open.id}` : "Report"}
        subtitle={open ? `report #${open.id} · received ${since(open.createdAt)}` : null}
        width={560}
        footer={
          open && isOpen(open) ? (
            <>
              {actionError ? <p role="alert" className="mr-auto text-[12.5px] text-[var(--c-bad)]">{actionError}</p> : null}
              <Button tone="plain" disabled={busy !== null} onClick={() => decide(open, "dismissed")}>
                {busy === "dismissed" ? "Dismissing…" : "Dismiss"}
              </Button>
              <Button tone="primary" disabled={busy !== null} onClick={() => decide(open, "resolved")}>
                {busy === "resolved" ? "Resolving…" : "Resolve"}
              </Button>
            </>
          ) : (
            <Button tone="ghost" onClick={close}>Close</Button>
          )
        }
      >
        {open ? (
          <div className="grid gap-5">
            <div className="flex flex-wrap gap-1.5">
              {open.status ? <Tag tone={STATUS_TONE[open.status] || "neutral"}>{open.status}</Tag> : null}
              {open.priority ? <Tag tone={PRIORITY_TONE[open.priority] || "neutral"}>{open.priority} priority</Tag> : null}
              {open.category ? <Tag>{open.category}</Tag> : null}
            </div>

            <section>
              <h3 className="c-mono text-[11.5px] text-[var(--c-faint)]">Reported content</h3>
              <p className="mt-2 whitespace-pre-wrap break-words rounded-[10px] border border-[var(--c-line)] bg-[var(--c-panel-2)] px-3.5 py-3 text-[14px] leading-relaxed">{open.content || "—"}</p>
            </section>

            <Facts
              rows={[
                ["Reason", open.reason || "—"],
                ["Type", humanize(open.type) || "—"],
                ["Reported by", <span key="by" className="c-mono text-[12.5px]">{who(open.reportedBy)}</span>],
                ["Reported user", <span key="user" className="c-mono text-[12.5px]">{who(open.reportedUser)}</span>],
                ["Content ID", open.contentId ? <span key="cid" className="c-mono text-[12.5px]">{open.contentId}</span> : "—"],
                ["Received", <span key="rcv" className="c-mono text-[12.5px]">{dateTime(open.createdAt)}</span>],
                ["Updated", <span key="upd" className="c-mono text-[12.5px]">{dateTime(open.updatedAt)}</span>],
                open.screenshots?.length ? ["Screenshots", <span key="shots" className="c-mono text-[12.5px]">{open.screenshots.length}</span>] : null,
                open.action ? ["Action taken", open.action] : null,
                open.resolutionNotes ? ["Notes", open.resolutionNotes] : null,
              ]}
            />

            {isOpen(open) ? (
              <Field label="Notes" count={`${notes.length}/${NOTES_MAX}`} hint="Optional. Saved with your decision.">
                {(id) => <TextArea id={id} rows={4} value={notes} maxLength={NOTES_MAX} onChange={(e) => setNotes(e.target.value)} placeholder="What you checked and why you decided this way." />}
              </Field>
            ) : null}
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

export default function AdminModerationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ReportsSection />
      </AdminLayout>
    </AdminGuard>
  );
}
