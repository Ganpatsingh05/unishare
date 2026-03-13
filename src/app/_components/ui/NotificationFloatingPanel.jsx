"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageCircle,
  Megaphone,
  AlertTriangle,
  Info,
  Loader2,
  X,
  Filter,
} from "lucide-react";
import {
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
} from "../../lib/api/notifications";
import { useAuth, useNotifications, useUI } from "../../lib/contexts/UniShareContext";

// ─── Date formatter ────────────────────────────────────────────────
const formatNotificationDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMin = Math.floor((now - date) / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return `${diffD}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      ...(date.getFullYear() !== now.getFullYear() && { year: "numeric" }),
    });
  } catch {
    return "";
  }
};

// ─── Type icon helper ──────────────────────────────────────────────
const TypeIcon = ({ type }) => {
  const cls = "w-4 h-4";
  switch (type) {
    case "message":
      return <MessageCircle className={cls} />;
    case "announcement":
      return <Megaphone className={cls} />;
    case "alert":
      return <AlertTriangle className={cls} />;
    default:
      return <Info className={cls} />;
  }
};

// ─── Single notification row ───────────────────────────────────────
const NotificationItem = React.memo(function NotificationItem({
  n,
  darkMode,
  onToggleRead,
  onRemove,
  actionLoading,
  removing,
}) {
  return (
    <div
      className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-200
        ${removing ? "opacity-0 translate-x-8 scale-95" : "opacity-100 translate-x-0 scale-100"}
        ${
          actionLoading
            ? darkMode
              ? "bg-gray-800/50 border-gray-700"
              : "bg-gray-100 border-gray-300"
            : darkMode
            ? "bg-gray-800/40 border-gray-700/60 hover:bg-gray-800/70"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
        ${!n.read ? (darkMode ? "ring-1 ring-yellow-400/20" : "ring-1 ring-blue-500/20") : ""}
      `}
    >
      {/* Icon */}
      <div
        className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${
          darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
        }`}
      >
        <TypeIcon type={n.type} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-semibold truncate ${
              darkMode ? "text-gray-100" : "text-gray-900"
            }`}
          >
            {n.title}
          </p>
          <span
            className={`text-[10px] whitespace-nowrap flex-shrink-0 ${
              darkMode ? "text-gray-500" : "text-gray-400"
            }`}
          >
            {formatNotificationDate(n.created_at || n.time)}
          </span>
        </div>
        <p
          className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {n.message || n.body}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {!n.read && (
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full ${
                darkMode ? "bg-yellow-400" : "bg-blue-500"
              }`}
            />
          )}
          <button
            onClick={() => onToggleRead(n.id)}
            disabled={actionLoading}
            className={`text-[11px] font-medium transition-colors ${
              actionLoading
                ? "opacity-50 cursor-not-allowed"
                : n.read
                ? darkMode
                  ? "text-gray-500 hover:text-yellow-300"
                  : "text-gray-500 hover:text-blue-600"
                : darkMode
                ? "text-yellow-400 hover:text-yellow-300"
                : "text-blue-600 hover:text-blue-700"
            }`}
          >
            {actionLoading ? "..." : n.read ? "Mark unread" : "Mark read"}
          </button>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => onRemove(n.id)}
        disabled={removing}
        className={`self-start p-1.5 rounded-md flex-shrink-0 transition-colors ${
          darkMode
            ? "text-gray-500 hover:bg-gray-700 hover:text-red-400"
            : "text-gray-400 hover:bg-gray-100 hover:text-red-500"
        } disabled:opacity-40`}
        aria-label="Remove notification"
      >
        {removing ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <X className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
});

// ═══════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
const NotificationFloatingPanel = React.memo(function NotificationFloatingPanel({
  open,
  onClose,
  anchorRef, // ref to the bell button for positioning
}) {
  const { darkMode } = useUI();
  const { isAuthenticated } = useAuth();
  const {
    notifications,
    unreadCount,
    hasUnread,
    setNotifications,
    loadNotifications,
  } = useNotifications();

  const [filter, setFilter] = useState("All");
  const [removing, setRemoving] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const panelRef = useRef(null);

  // ── Filtered list ──
  const list = useMemo(() => {
    const items = notifications || [];
    return filter === "Unread" ? items.filter((n) => !n.read) : items;
  }, [notifications, filter]);

  // ── Load notifications on open ──
  useEffect(() => {
    if (open && isAuthenticated && loadNotifications) {
      loadNotifications();
    }
  }, [open, isAuthenticated, loadNotifications]);

  // ── Close on ESC ──
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // ── Click-outside to close ──
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose?.();
      }
    };
    // Delay to avoid closing immediately on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose, anchorRef]);

  // ── Mark single as read ──
  const toggleRead = useCallback(
    async (id) => {
      const notif = (notifications || []).find((n) => n.id === id);
      if (!notif) return;
      setActionLoading((prev) => ({ ...prev, [id]: true }));
      try {
        if (!notif.read) {
          const result = await markNotificationAsRead(id);
          if (result.success) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            if (loadNotifications) setTimeout(() => loadNotifications(), 300);
          }
        } else {
          // Toggle back to unread locally
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: false } : n))
          );
        }
      } catch (err) {
        console.error("Error toggling read:", err);
      } finally {
        setActionLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [notifications, setNotifications, loadNotifications]
  );

  // ── Mark all read ──
  const markAllRead = useCallback(async () => {
    setActionLoading((prev) => ({ ...prev, _all: true }));
    try {
      const result = await markAllNotificationsAsRead();
      if (result.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        if (filter === "Unread") setTimeout(() => setFilter("All"), 300);
        if (loadNotifications) setTimeout(() => loadNotifications(), 500);
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    } finally {
      setActionLoading((prev) => ({ ...prev, _all: false }));
    }
  }, [setNotifications, filter, loadNotifications]);

  // ── Remove single ──
  const removeItem = useCallback(
    async (id) => {
      setRemoving((r) => ({ ...r, [id]: true }));
      try {
        await deleteUserNotification(id);
      } catch (err) {
        console.warn("Backend delete failed, removing locally:", err);
      }
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setRemoving((r) => {
          const { [id]: _, ...rest } = r;
          return rest;
        });
      }, 250);
    },
    [setNotifications]
  );

  // ── Clear all ──
  const clearAll = useCallback(() => {
    setNotifications(() => []);
  }, [setNotifications]);

  if (!open || !isAuthenticated) return null;

  // ═══════════════════════════════════════════════════════════════
  //  RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className="fixed inset-0 z-[80] md:hidden bg-black/40"
        onClick={onClose}
      />

      {/* ─── Mobile: Bottom sheet ─── */}
      <div
        ref={panelRef}
        className={`
          fixed inset-x-0 bottom-0 z-[81] md:hidden
          rounded-t-2xl shadow-2xl border-t max-h-[80vh] flex flex-col
          ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
          animate-slide-up-soft
        `}
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Grab handle */}
        <div className="flex justify-center py-2.5">
          <div className={`h-1 w-10 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-300"}`} />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`w-5 h-5 ${darkMode ? "text-yellow-300" : "text-blue-600"}`} />
            <h2 className={`text-base font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  darkMode ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-100 text-blue-700"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter((f) => (f === "All" ? "Unread" : "All"))}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === "Unread"
                  ? darkMode
                    ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
                    : "border-purple-200 bg-purple-50 text-purple-700"
                  : darkMode
                  ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                  : "border-gray-200 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {filter === "All" ? "Unread" : "All"}
            </button>
            <button
              onClick={markAllRead}
              disabled={actionLoading._all || unreadCount === 0}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                actionLoading._all || unreadCount === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              } ${
                darkMode
                  ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {actionLoading._all ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}
              <span className="hidden sm:inline">{actionLoading._all ? "Marking..." : "Read all"}</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-2">
          {list.length === 0 ? (
            <EmptyState darkMode={darkMode} filter={filter} totalCount={(notifications || []).length} />
          ) : (
            list.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                darkMode={darkMode}
                onToggleRead={toggleRead}
                onRemove={removeItem}
                actionLoading={!!actionLoading[n.id]}
                removing={!!removing[n.id]}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 flex items-center justify-between border-t ${darkMode ? "border-gray-800" : "border-gray-200"}`}>
          <button onClick={onClose} className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Close
          </button>
          {(notifications || []).length > 0 && (
            <button
              onClick={clearAll}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                darkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ─── Desktop: Floating dropdown ─── */}
      <div
        ref={panelRef}
        className={`
          hidden md:block fixed z-[81]
          w-[380px] max-h-[520px]
          rounded-2xl shadow-2xl border overflow-hidden
          ${darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-200"}
        `}
        style={{
          top: anchorRef?.current
            ? anchorRef.current.getBoundingClientRect().bottom + 12
            : 80,
          right: Math.max(
            16,
            anchorRef?.current
              ? window.innerWidth - anchorRef.current.getBoundingClientRect().right - 40
              : 32
          ),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Arrow pointer */}
        <div
          className={`absolute -top-2 right-12 w-4 h-4 rotate-45 border-l border-t ${
            darkMode ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-200"
          }`}
        />

        {/* Header */}
        <div className={`px-4 py-3 flex items-center justify-between border-b ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          <div className="flex items-center gap-2">
            <Bell className={`w-4 h-4 ${darkMode ? "text-yellow-300" : "text-blue-600"}`} />
            <h3 className={`text-sm font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                  darkMode ? "bg-yellow-400/20 text-yellow-300" : "bg-blue-100 text-blue-700"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter((f) => (f === "All" ? "Unread" : "All"))}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                filter === "Unread"
                  ? darkMode
                    ? "border-purple-400/30 bg-purple-400/10 text-purple-300"
                    : "border-purple-200 bg-purple-50 text-purple-700"
                  : darkMode
                  ? "border-gray-700 text-gray-400 hover:bg-gray-800"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {filter === "All" ? "Unread" : "All"}
            </button>
            <button
              onClick={markAllRead}
              disabled={actionLoading._all || unreadCount === 0}
              className={`px-2 py-1 rounded-md text-[11px] font-medium border transition-colors flex items-center gap-1 ${
                actionLoading._all || unreadCount === 0
                  ? "opacity-40 cursor-not-allowed"
                  : ""
              } ${
                darkMode
                  ? "border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
              title="Mark all as read"
            >
              {actionLoading._all ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3 h-3" />}
              All read
            </button>
            <button
              onClick={onClose}
              className={`p-1 rounded-md transition-colors ${
                darkMode ? "text-gray-500 hover:bg-gray-800 hover:text-gray-300" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-[380px] overflow-y-auto px-3 py-2 space-y-2">
          {list.length === 0 ? (
            <EmptyState darkMode={darkMode} filter={filter} totalCount={(notifications || []).length} />
          ) : (
            list.map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                darkMode={darkMode}
                onToggleRead={toggleRead}
                onRemove={removeItem}
                actionLoading={!!actionLoading[n.id]}
                removing={!!removing[n.id]}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div className={`px-4 py-2.5 flex items-center justify-between border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}>
          <span className={`text-[11px] ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            {(notifications || []).length} notification{(notifications || []).length !== 1 ? "s" : ""}
          </span>
          {(notifications || []).length > 0 && (
            <button
              onClick={clearAll}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                darkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"
              }`}
            >
              <Trash2 className="w-3 h-3" />
              Clear all
            </button>
          )}
        </div>
      </div>
    </>
  );
});

// ─── Empty state component ─────────────────────────────────────────
function EmptyState({ darkMode, filter, totalCount }) {
  return (
    <div className={`text-center py-10 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
      <div
        className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
          darkMode ? "bg-gray-800" : "bg-gray-100"
        }`}
      >
        <Bell className={`w-5 h-5 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
      </div>
      <p className="text-sm font-medium mb-1">
        {filter === "Unread"
          ? totalCount === 0
            ? "No notifications yet"
            : "All caught up!"
          : "No notifications yet"}
      </p>
      <p className="text-xs opacity-70">
        {filter === "Unread"
          ? totalCount === 0
            ? "New ones will appear here"
            : "All notifications have been read"
          : "New ones will appear here"}
      </p>
    </div>
  );
}

NotificationFloatingPanel.displayName = "NotificationFloatingPanel";

export default NotificationFloatingPanel;
