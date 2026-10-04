// Turns each feature's request rows into one shape the page can render.

const STATUS = {
  pending: "pending",
  confirmed: "accepted",
  approved: "accepted",
  accepted: "accepted",
  declined: "declined",
  rejected: "declined",
  cancelled: "cancelled",
};

export const normalStatus = (s) => STATUS[String(s || "").toLowerCase()] || "pending";

// Request forms append contact details to the message in a fixed block.
const CONTACT_MARK = "📞 Contact me via:";

export function splitMessage(message) {
  if (!message) return { text: "", contact: null };
  const [text, block] = String(message).split(CONTACT_MARK);
  if (!block) return { text: text.trim(), contact: null };
  const contact = {};
  for (const line of block.split("\n")) {
    const v = line.split(":").slice(1).join(":").trim();
    if (!v) continue;
    if (/Phone/i.test(line)) contact.phone = v;
    else if (/Email/i.test(line)) contact.email = v;
    else if (/Instagram/i.test(line)) contact.instagram = v.replace(/^@/, "");
  }
  return { text: text.trim(), contact: Object.keys(contact).length ? contact : null };
}

const person = (p, profile) =>
  p || profile
    ? {
        name: profile?.display_name || p?.name || null,
        email: p?.email || null,
        picture: profile?.profile_image_url || p?.picture || null,
      }
    : null;

const money = (n) => (n == null || n === "" ? null : Number(n));

/** Listing details for one request, per feature. */
function listing(module, r) {
  switch (module) {
    case "rides": {
      const ride = r.ride || {};
      return {
        title: ride.from_location || ride.to_location ? `${ride.from_location || "?"} → ${ride.to_location || "?"}` : "A ride",
        when: ride.date ? `${ride.date}${ride.time ? `T${String(ride.time).slice(0, 5)}` : ""}` : null,
        price: money(ride.price),
        priceUnit: "per seat",
        details: [r.seats_requested ? `${r.seats_requested} seat${r.seats_requested > 1 ? "s" : ""}` : null, r.pickup_location ? `Pickup: ${r.pickup_location}` : null],
        owner: ride.owner,
      };
    }
    case "rooms": {
      const room = r.room || {};
      return {
        title: room.title || "A room",
        place: room.location || null,
        price: money(room.rent),
        priceUnit: "per month",
        details: [r.move_in_date ? `Move in ${new Date(r.move_in_date).toLocaleDateString(undefined, { day: "numeric", month: "short" })}` : null, r.stay_duration ? `Stay: ${r.stay_duration}` : null, r.occupants ? `${r.occupants} occupant${r.occupants > 1 ? "s" : ""}` : null],
        owner: r.landlord,
      };
    }
    case "market": {
      const item = r.item || {};
      return {
        title: item.title || "An item",
        place: item.location || null,
        price: money(item.price),
        offer: money(r.offered_price),
        details: [item.condition ? `Condition: ${item.condition}` : null, r.pickup_preference ? `Pickup: ${r.pickup_preference}` : null],
        owner: r.seller,
      };
    }
    case "tickets": {
      const t = r.ticket || {};
      return {
        title: t.title || "A ticket",
        place: t.venue || t.location || null,
        price: money(t.price),
        offer: money(r.offered_price),
        details: [r.quantity_requested ? `${r.quantity_requested} ticket${r.quantity_requested > 1 ? "s" : ""}` : null, r.pickup_preference ? `Pickup: ${r.pickup_preference}` : null],
        owner: r.seller,
      };
    }
    case "lostfound": {
      const item = r.item || {};
      return {
        title: item.item_name || "An item",
        place: item.mode === "lost" ? item.where_last_seen : item.where_found,
        kind: item.mode === "lost" ? "Lost" : item.mode === "found" ? "Found" : null,
        details: [r.proof_description ? `Proof: ${r.proof_description}` : null],
        owner: r.owner,
      };
    }
    default:
      return { title: "Request", details: [] };
  }
}

/** One request, ready to show. `direction` is "received" or "sent". */
export function toRequest(module, direction, r) {
  const l = listing(module, r);
  const { text, contact } = splitMessage(r.message);
  const other =
    direction === "received"
      ? person(r.requester, r.requester_profile)
      : person(module === "rides" ? r.ride?.owner : l.owner, module === "rides" ? r.ride_owner_profile : null);
  return {
    key: `${module}:${direction}:${r.id}`,
    id: r.id,
    module,
    direction,
    status: normalStatus(r.status),
    createdAt: r.created_at,
    respondedAt: r.responded_at || null,
    title: l.title,
    place: l.place || null,
    when: l.when || null,
    kind: l.kind || null,
    price: l.price ?? null,
    priceUnit: l.priceUnit || null,
    offer: l.offer ?? null,
    details: (l.details || []).filter(Boolean),
    other,
    message: text,
    contact: direction === "received" ? contact : null,
    contactMethod: r.contact_method || null,
    reply: r.response_message || null,
    rideInPast: module === "rides" && l.when ? new Date(l.when) < new Date() : false,
  };
}

const ORDER = { pending: 0, accepted: 1, declined: 2, cancelled: 3 };

/** Waiting first, then newest. */
export const byPriority = (a, b) => ORDER[a.status] - ORDER[b.status] || new Date(b.createdAt) - new Date(a.createdAt);
