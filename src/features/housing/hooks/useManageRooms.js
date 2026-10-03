"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import {
  cancelRoomRequest,
  deleteRoom,
  fetchMyRooms,
  fetchReceivedRoomRequests,
  fetchSentRoomRequests,
  respondToRoomRequest,
} from "../services/housing.service";
import { normalizeRoom } from "../utils/roomModel";

const parseDay = (value) => {
  if (!value) return null;
  const [y, mo, d] = String(value).slice(0, 10).split("-").map(Number);
  return y ? new Date(y, mo - 1, d) : null;
};

/** One room request from the API, flattened for the cards. */
function toRequest(raw) {
  const person = raw.requester || raw.landlord || {};
  return {
    id: raw.id,
    roomId: raw.room_id ?? raw.room?.id,
    status: raw.status || "pending",
    name: person.name || person.email || "Student",
    email: person.email || "",
    picture: person.picture || "",
    message: (raw.message || "").trim(),
    reply: (raw.response_message || "").trim(),
    moveIn: parseDay(raw.move_in_date),
    stay: raw.stay_duration || "",
    occupants: Number(raw.occupants) || 1,
    createdAt: raw.created_at ? new Date(raw.created_at) : null,
    room: raw.room ? normalizeRoom(raw.room) : null,
  };
}

/**
 * The signed-in user's listings (with the requests each one received) and
 * the requests they sent. Answers are applied optimistically and rolled back
 * if the server refuses.
 */
export default function useManageRooms({ onError } = {}) {
  const { isAuthenticated, authLoading } = useAuth();
  const [state, setState] = useState({ status: "loading", rooms: [], received: [], sent: [] });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!isAuthenticated) {
      setState({ status: "signedout", rooms: [], received: [], sent: [] });
      return undefined;
    }
    let alive = true;
    setState((prev) => ({ ...prev, status: "loading" }));
    Promise.all([fetchMyRooms({ cache: false, limit: 50 }), fetchReceivedRoomRequests(), fetchSentRoomRequests()])
      .then(([mine, received, sent]) => {
        if (!alive) return;
        setState({
          status: "ready",
          rooms: (mine.data || []).map(normalizeRoom),
          received: received.map(toRequest),
          sent: sent.map(toRequest),
        });
      })
      .catch((error) => alive && setState((prev) => ({ ...prev, status: error?.status === 401 ? "signedout" : "error" })));
    return () => {
      alive = false;
    };
  }, [isAuthenticated, authLoading, nonce]);

  const listings = useMemo(
    () =>
      state.rooms.map((room) => {
        const requests = state.received.filter((req) => String(req.roomId) === String(room.id));
        return { room, requests, pending: requests.filter((req) => req.status === "pending") };
      }),
    [state.rooms, state.received]
  );

  const patchReceived = (id, patch) =>
    setState((prev) => ({ ...prev, received: prev.received.map((req) => (req.id === id ? { ...req, ...patch } : req)) }));

  const respond = useCallback(
    async (request, status, reply) => {
      patchReceived(request.id, { status, reply: reply || "" });
      try {
        await respondToRoomRequest(request.id, status, reply || undefined);
        return { success: true };
      } catch (error) {
        patchReceived(request.id, { status: request.status, reply: request.reply });
        onError?.(error?.message);
        return { success: false, error: error?.message };
      }
    },
    [onError]
  );

  const removeRoom = useCallback(async (room) => {
    try {
      await deleteRoom(room.id);
      setState((prev) => ({ ...prev, rooms: prev.rooms.filter((r) => r.id !== room.id) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }, []);

  const cancelRequest = useCallback(async (request) => {
    try {
      await cancelRoomRequest(request.id);
      setState((prev) => ({ ...prev, sent: prev.sent.map((req) => (req.id === request.id ? { ...req, status: "cancelled" } : req)) }));
      return { success: true };
    } catch (error) {
      return { success: false, error: error?.message };
    }
  }, []);

  return {
    status: state.status,
    listings,
    sent: state.sent,
    respond,
    removeRoom,
    cancelRequest,
    reload: () => setNonce((n) => n + 1),
  };
}
