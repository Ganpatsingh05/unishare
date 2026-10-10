"use client";

import { useAuth } from "@contexts/UniShareContext";
import { useConsole } from "../consoleData";
import Pulse from "./Pulse";
import Inbox from "./Inbox";
import Ledger from "./Ledger";
import PostMix from "./PostMix";
import FeatureTable from "./FeatureTable";

function greeting() {
  const h = new Date().getHours();
  return h < 5 ? "Working late" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

function Skeleton() {
  const block = "animate-pulse rounded-[12px] border border-[var(--c-line)] bg-[var(--c-panel)]";
  return (
    <div aria-busy="true" aria-label="Loading the overview" className="grid gap-5">
      <div className={`${block} h-[150px]`} />
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className={`${block} h-[420px]`} />
        <div className={`${block} h-[420px]`} />
      </div>
      <div className={`${block} h-[140px]`} />
    </div>
  );
}

/** The console home. */
export default function ConsoleOverview() {
  const { user } = useAuth();
  const { data, status, error, reload } = useConsole();
  const first = (user?.name || "").split(/\s+/)[0];
  const waiting = data?.inbox?.length || 0;

  return (
    <div className="grid gap-5 lg:gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[15px] font-medium text-[var(--c-muted)]">{greeting()}{first ? `, ${first}` : ""}.</p>
          <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
            {status !== "ready" ? (
              "Overview"
            ) : waiting ? (
              <>
                <span className="relative inline-block px-1">
                  <span aria-hidden className="absolute inset-x-0 bottom-[0.02em] top-[0.12em] -skew-x-6 rounded-[3px] bg-[var(--c-mark)]" />
                  <span className="relative text-[var(--c-on-mark)]">{waiting} {waiting === 1 ? "thing needs" : "things need"}</span>
                </span>{" "}
                you today.
              </>
            ) : (
              "All caught up."
            )}
          </h1>
        </div>
        <p className="text-[14px] text-[var(--c-muted)]">{new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </header>

      {status === "loading" ? (
        <Skeleton />
      ) : status === "error" ? (
        <div role="alert" className="rounded-[12px] border border-[var(--c-line)] bg-[var(--c-panel)] px-6 py-10 text-center">
          <div className="text-[16px] font-semibold text-[var(--c-bad-ink)]">Couldn't load the overview</div>
          <p className="mt-2 text-[14px] text-[var(--c-muted)]">{error}</p>
          <button type="button" onClick={reload} className="mt-4 h-9 rounded-[8px] bg-[var(--c-text)] px-4 text-[13px] font-semibold text-[var(--c-bg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-ring)]">
            Try again
          </button>
        </div>
      ) : data ? (
        <>
          <Pulse data={data} />
          <div className="grid gap-5 xl:h-[520px] xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-6">
            <Inbox items={data.inbox || []} />
            <Ledger items={data.activity || []} />
          </div>
          {data.missing.length ? (
            <p role="status" className="-mt-2 text-[13.5px] text-[var(--c-muted)]">Couldn't load {data.missing.join(", ")}. Everything else is up to date.</p>
          ) : null}
          {data.posts ? <PostMix posts={data.posts} /> : null}
          <FeatureTable posts={data.posts} content={data.content} />
        </>
      ) : null}
    </div>
  );
}
