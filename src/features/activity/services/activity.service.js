import { apiCall } from "@lib/api/base";

// Every feature's request endpoints and the words its backend uses. They
// differ: rides confirm/decline with `action`, the rest set a `status`, and
// "accepted" is `confirmed` for rides and `approved` for rooms.
export const MODULES = {
  rides: {
    base: "/api/shareride",
    accept: { action: "confirm" },
    decline: { action: "decline" },
  },
  rooms: {
    base: "/api/rooms",
    accept: { status: "approved" },
    decline: { status: "rejected" },
  },
  market: {
    base: "/api/itemsell",
    accept: { status: "accepted" },
    decline: { status: "rejected" },
  },
  tickets: {
    base: "/api/ticketsell",
    accept: { status: "accepted" },
    decline: { status: "rejected" },
  },
  lostfound: {
    base: "/api/lostfound",
    accept: { status: "accepted" },
    decline: { status: "rejected" },
  },
};

const rows = (res) => (Array.isArray(res?.data) ? res.data : []);

/**
 * Loads requests received and sent for every feature. A feature that fails
 * is reported in `failed` instead of failing the whole page.
 */
export async function loadAllRequests() {
  const keys = Object.keys(MODULES);
  const calls = keys.flatMap((k) => [apiCall(`${MODULES[k].base}/my/requests`, { retries: 0 }), apiCall(`${MODULES[k].base}/requests/sent`, { retries: 0 })]);
  const settled = await Promise.allSettled(calls);
  const out = { received: {}, sent: {}, failed: [], authError: false };
  keys.forEach((k, i) => {
    const [rec, sent] = [settled[i * 2], settled[i * 2 + 1]];
    if (rec.status === "fulfilled") out.received[k] = rows(rec.value);
    if (sent.status === "fulfilled") out.sent[k] = rows(sent.value);
    for (const r of [rec, sent]) {
      if (r.status === "rejected") {
        if (r.reason?.status === 401) out.authError = true;
        if (!out.failed.includes(k)) out.failed.push(k);
      }
    }
  });
  return out;
}

/** Accept or decline a request someone sent you. */
export function respondToRequest(module, requestId, decision, note = "") {
  const m = MODULES[module];
  const body = { ...(decision === "accept" ? m.accept : m.decline) };
  if (note) {
    if (module === "rides") body.message = note;
    else body.responseMessage = note;
  }
  return apiCall(`${m.base}/requests/${encodeURIComponent(requestId)}/respond`, { method: "PUT", body: JSON.stringify(body), retries: 0 });
}

/** Withdraw a request you sent (the backend marks it cancelled). */
export function cancelRequest(module, requestId) {
  return apiCall(`${MODULES[module].base}/requests/${encodeURIComponent(requestId)}`, { method: "DELETE", retries: 0 });
}
