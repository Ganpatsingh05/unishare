"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@contexts/UniShareContext";
import { roomsAPI } from "@lib/api/requests";
import { fetchRoom } from "../services/housing.service";
import { normalizeRoom } from "../utils/roomModel";

/**
 * One room (GET /api/rooms/:id) plus whether the signed-in user has already
 * asked about it, and an action to send a request
 * (POST /api/rooms/:id/request).
 */
export default function useRoomDetail(roomId) {
  const { user, isAuthenticated } = useAuth();
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState("loading");
  const [requested, setRequested] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!roomId) return undefined;
    let alive = true;
    setStatus("loading");
    fetchRoom(roomId, { cache: false })
      .then((result) => {
        if (!alive) return;
        if (!result.success || !result.data) {
          setStatus("notfound");
          return;
        }
        const raw = result.data;
        setRoom({
          ...normalizeRoom(raw),
          description: (raw.description || "").trim(),
          contact: raw.contact_info && typeof raw.contact_info === "object" ? raw.contact_info : {},
          ownerId: raw.user_id || null,
        });
        setStatus("ready");
      })
      .catch(() => alive && setStatus("error"));
    return () => {
      alive = false;
    };
  }, [roomId, nonce]);

  useEffect(() => {
    if (!isAuthenticated || !roomId) return;
    roomsAPI
      .getSentRequests()
      .then((result) => {
        const list = result?.data || [];
        setRequested(list.some((req) => String(req.room_id ?? req.room?.id) === String(roomId) && req.status !== "cancelled"));
      })
      .catch(() => {});
  }, [isAuthenticated, roomId]);

  /** @returns {Promise<{success: boolean, error?: string}>} */
  const sendRequest = useCallback(
    async (payload) => {
      try {
        await roomsAPI.sendRequest(roomId, payload);
        setRequested(true);
        return { success: true };
      } catch (error) {
        return { success: false, error: error?.message };
      }
    },
    [roomId]
  );

  return {
    room,
    status,
    reload: () => setNonce((n) => n + 1),
    requested,
    sendRequest,
    isAuthenticated,
    isOwner: Boolean(room && user?.id && room.ownerId === user.id),
    userEmail: user?.email || "",
  };
}
