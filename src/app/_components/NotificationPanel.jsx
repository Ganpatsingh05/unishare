"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Trash2, MessageCircle, Megaphone, AlertTriangle, Info } from "lucide-react";

/**
 * NotificationPanel
 * - Mobile-first bottom sheet; desktop renders as a dropdown panel
 * - Props:
 *   - open: boolean
 *   - onClose: () => void
 *   - darkMode: boolean
 *   - notifications: Array<{id:string,title:string,body:string,time:string,type:'message'|'announcement'|'alert'|'info',read:boolean}>
 *   - setNotifications: (updater) => void (state setter from parent)
 */
export default function NotificationPanel({ open, onClose, darkMode, notifications, setNotifications }) {
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'
  const panelRef = useRef(null);
  const [removing, setRemoving] = useState({}); // id => true while animating out

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Filtered list
  const list = useMemo(() => {
    if (filter === 'Unread') return notifications.filter(n => !n.read);
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications(() => []);
  };

  const toggleRead = (id) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const removeItem = (id) => {
    setRemoving((r) => ({ ...r, [id]: true }));
    // Wait for swipe-out animation then remove
    setTimeout(() => {
      setNotifications((prev) => prev.filter(n => n.id !== id));
      setRemoving((r) => { const { [id]: _, ...rest } = r; return rest; });
    }, 220);
  };

  const TypeIcon = ({ type, className }) => {
    const base = "w-5 h-5";
    switch (type) {
      case 'message': return <MessageCircle className={`${base} ${className || ''}`} />
      case 'announcement': return <Megaphone className={`${base} ${className || ''}`} />
      case 'alert': return <AlertTriangle className={`${base} ${className || ''}`} />
      default: return <Info className={`${base} ${className || ''}`} />
    }
  };

  // Hidden when closed to avoid tab stops
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:z-50" aria-modal="true" role="dialog">
      {/* Overlay */}
      <div
        className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} animate-fade-in-up`}
        onClick={onClose}
      />

      {/* Mobile bottom sheet */}
      <div
        ref={panelRef}
        className={`md:hidden absolute inset-x-0 bottom-0 rounded-t-2xl shadow-2xl border-t max-h-[85vh] flex flex-col overflow-hidden ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } animate-slide-up-soft`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* Grab handle */}
        <div className="flex justify-center py-2">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-300'} h-1.5 w-12 rounded-full`} />
        </div>

        {/* Header */}
        <div className="px-4 pt-1 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`w-5 h-5 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
            <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Notifications</h2>
            {unreadCount > 0 && (
              <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-700'}`}>{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter(f => f === 'All' ? 'Unread' : 'All')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            >
              {filter === 'All' ? 'Show Unread' : 'Show All'}
            </button>
            <button
              onClick={markAllRead}
              className={`p-2 rounded-lg text-xs border flex items-center gap-1 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-2 pb-4 flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className={`text-center text-sm py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications</div>
          ) : (
            <ul className="space-y-2">
              {list.map((n, idx) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-200 ${
                    darkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 active:scale-[0.995]' : 'bg-white border-gray-200 hover:bg-gray-50 active:scale-[0.995]'
                  } ${removing[n.id] ? 'animate-swipe-out' : 'animate-item-in'}`}
                  style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                      <span className={`text-[10px] whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.time}</span>
                    </div>
                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{n.body}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {!n.read && <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-blue-600'}`} aria-label="Unread" />}
                      <button onClick={() => toggleRead(n.id)} className={`text-xs underline ${darkMode ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-700 hover:text-blue-700'}`}>
                        Mark as {n.read ? 'unread' : 'read'}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(n.id)}
                    className={`self-start p-2 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-300' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'} transition-transform active:scale-95`}
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        <div className={`px-4 py-3 flex items-center justify-between border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <button onClick={onClose} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Close</button>
          <button onClick={clearAll} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
            <Trash2 className="w-4 h-4" />
            Clear all
          </button>
        </div>
      </div>

      {/* Desktop dropdown */}
      <div className="hidden md:block absolute right-4 top-24">
        <div className={`w-[22rem] rounded-2xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} animate-dropdown-in`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`w-5 h-5 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-700'}`}>{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFilter(f => f === 'All' ? 'Unread' : 'All')} className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>{filter === 'All' ? 'Show Unread' : 'Show All'}</button>
              <button onClick={markAllRead} className={`p-2 rounded-lg text-xs border flex items-center gap-1 ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`} title="Mark all as read">
                <CheckCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto px-2 pb-2">
            {list.length === 0 ? (
              <div className={`text-center text-sm py-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No notifications</div>
            ) : (
              <ul className="space-y-2">
                {list.map((n, idx) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-200 ${darkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 active:scale-[0.995]' : 'bg-white border-gray-200 hover:bg-gray-50 active:scale-[0.995]'} ${removing[n.id] ? 'animate-swipe-out' : 'animate-item-in'}`}
                    style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
                  >
                    <div className={`mt-0.5 p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                      <TypeIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                        <span className={`text-[10px] whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{n.time}</span>
                      </div>
                      <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{n.body}</p>
                      <div className="mt-2 flex items-center gap-2">
                        {!n.read && <span className={`inline-block w-2 h-2 rounded-full ${darkMode ? 'bg-yellow-300' : 'bg-blue-600'}`} aria-label="Unread" />}
                        <button onClick={() => toggleRead(n.id)} className={`text-xs underline ${darkMode ? 'text-gray-300 hover:text-yellow-300' : 'text-gray-700 hover:text-blue-700'}`}>Mark as {n.read ? 'unread' : 'read'}</button>
                      </div>
                    </div>
                    <button onClick={() => removeItem(n.id)} className={`self-start p-2 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-300' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'} transition-transform active:scale-95`} aria-label="Remove">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className={`px-4 py-3 flex items-center justify-between border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <button onClick={onClose} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Close</button>
            <button onClick={clearAll} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-red-500/10 text-red-300 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
