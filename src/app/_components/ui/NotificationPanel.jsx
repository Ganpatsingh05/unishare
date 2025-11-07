"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, CheckCheck, Trash2, MessageCircle, Megaphone, AlertTriangle, Info, Loader2 } from "lucide-react";
import { markNotificationAsRead, markAllNotificationsAsRead, deleteUserNotification } from "./../../lib/api/notifications";

// Utility function to format date/time
const formatNotificationDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    // For older notifications, show the actual date
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * NotificationPanel - Backend-integrated user notifications
 * - Mobile-first bottom sheet; desktop renders as a dropdown panel
 * - Loads notifications from backend API and displays complete messages with formatted dates
 * - Props:
 *   - open: boolean
 *   - onClose: () => void
 *   - darkMode: boolean
 *   - notifications: Array<{id:number,title:string,message:string,created_at:string,type:'info'|'message'|'announcement'|'alert',read:boolean}>
 *   - setNotifications: (updater) => void (state setter from parent)
 *   - loadNotifications: () => void (function to refresh notifications)
 *   - isAuthenticated: boolean (whether user is logged in)
 */
export default function NotificationPanel({ open, onClose, darkMode, notifications: propNotifications, setNotifications: propSetNotifications, loadNotifications: propLoadNotifications, isAuthenticated }) {
  // Use context-provided data
  const notifications = propNotifications || [];
  const setNotifications = propSetNotifications || (() => {});
  const loadNotifications = propLoadNotifications || (() => {});
  const [filter, setFilter] = useState('All'); // 'All' | 'Unread'
  const [removing, setRemoving] = useState({}); // id => true while animating out
  const [actionLoading, setActionLoading] = useState({}); // Track loading states for individual actions
  
  // Calculate unread count
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );
  const panelRef = useRef(null);

  // Filtered list - handle both API format and fallback format
  const list = useMemo(() => {
    if (filter === 'Unread') return notifications.filter(n => !n.read);
    return notifications;
  }, [notifications, filter]);

  // Close on ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Don't render notifications if user is not logged in
  if (!isAuthenticated) {
    return null;
  }

  // Mark all notifications as read (with backend API)
  const markAllRead = async () => {
    try {
      setActionLoading(prev => ({ ...prev, markAll: true }));
      const result = await markAllNotificationsAsRead();
      
      if (result.success) {
        // Update local state optimistically
        setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
        
        // Switch to "All" view to show the updated notifications
        if (filter === 'Unread') {
          setTimeout(() => {
            setFilter('All');
          }, 300); // Small delay for smooth transition
        }
        
        // Reload notifications to sync with backend
        if (loadNotifications) {
          setTimeout(() => loadNotifications(), 500);
        }
      } else {
        console.error('Failed to mark all notifications as read:', result.error);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, markAll: false }));
    }
  };

  const clearAll = () => {
    setNotifications(() => []);
  };

  // Toggle read status (with backend API)
  const toggleRead = async (id) => {
    try {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      
      // Find current notification to determine action
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;
      
      // Call backend API to mark as read if currently unread
      if (!notification.read) {
        const result = await markNotificationAsRead(id);
        
        if (result.success) {
          // Update local state with optimistic update
          setNotifications((prev) => prev.map(n => 
            n.id === id ? { ...n, read: true } : n
          ));
          
          // If we're filtering by unread and this was the last unread item,
          // automatically switch to "All" view to prevent jarring empty state
          if (filter === 'Unread') {
            const unreadAfterUpdate = notifications.filter(n => n.id !== id && !n.read).length;
            if (unreadAfterUpdate === 0) {
              setTimeout(() => {
                setFilter('All');
              }, 500); // Small delay to let user see the change
            }
          }
          
          // Reload notifications to sync with backend
          if (loadNotifications) {
            setTimeout(() => loadNotifications(), 200);
          }
        } else {
          console.error('Failed to mark notification as read:', result.error);
        }
      } else {
        // For marking as unread, just update local state (backend doesn't have unread API)
        setNotifications((prev) => prev.map(n => 
          n.id === id ? { ...n, read: false } : n
        ));
      }
    } catch (error) {
      console.error('Error toggling notification read status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Remove notification (with backend API for personal notifications)
  const removeItem = async (id) => {
    try {
      setRemoving((r) => ({ ...r, [id]: true }));
      
      // Try to delete from backend
      const result = await deleteUserNotification(id);
      
      if (result.success) {
        // Wait for animation then remove from local state
        setTimeout(() => {
          setNotifications((prev) => prev.filter(n => n.id !== id));
          setRemoving((r) => { const { [id]: _, ...rest } = r; return rest; });
        }, 220);
      } else {
        // If deletion failed (e.g., global notification), still remove from UI but show message
        console.warn('Could not delete notification from backend:', result.error);
        setTimeout(() => {
          setNotifications((prev) => prev.filter(n => n.id !== id));
          setRemoving((r) => { const { [id]: _, ...rest } = r; return rest; });
        }, 220);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Still remove from UI even if backend call failed
      setTimeout(() => {
        setNotifications((prev) => prev.filter(n => n.id !== id));
        setRemoving((r) => { const { [id]: _, ...rest } = r; return rest; });
      }, 220);
    }
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
    <div className="fixed inset-0 z-[60] md:z-50" aria-modal="true" role="dialog" onClick={onClose}>
      {/* Mobile bottom sheet */}
      <div
        ref={panelRef}
        className={`md:hidden absolute inset-x-0 bottom-0 rounded-t-2xl shadow-2xl border-t max-h-[85vh] flex flex-col overflow-hidden ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        } animate-slide-up-soft`}
        onClick={(e) => e.stopPropagation()}
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
              className={`px-2.5 py-2 rounded-lg text-xs font-medium border transition-all duration-200 ${
                filter === 'Unread' 
                  ? `${darkMode ? 'border-purple-400/30 bg-purple-400/10 text-purple-300' : 'border-purple-200 bg-purple-50 text-purple-700'}`
                  : `${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`
              }`}
            >
              {filter === 'All' ? 'Show Unread' : 'Show All'}
            </button>
            <button
              onClick={markAllRead}
              disabled={actionLoading.markAll || unreadCount === 0}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1 ${
                actionLoading.markAll 
                  ? `${darkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-gray-100 text-gray-500'} cursor-not-allowed`
                  : unreadCount === 0
                    ? `${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'} cursor-not-allowed opacity-50`
                    : `${darkMode ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20' : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'}`
              }`}
              title="Mark all as read"
            >
              {actionLoading.markAll ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
              {actionLoading.markAll ? 'Marking...' : 'Mark all'}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="px-2 pb-4 flex-1 overflow-y-auto">
          {list.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <Bell className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              </div>
              <p className="text-sm font-medium mb-2">
                {filter === 'Unread' 
                  ? (notifications.length === 0 ? 'No notifications yet' : 'All caught up!') 
                  : 'No notifications yet'
                }
              </p>
              <p className="text-xs opacity-75">
                {filter === 'Unread' 
                  ? (notifications.length === 0 ? "You'll see new notifications here" : "All notifications have been read") 
                  : "You'll see new notifications here"
                }
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {list.map((n, idx) => (
                <li
                  key={n.id}
                  className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-300 ${
                    actionLoading[n.id] 
                      ? `${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'} scale-[0.98]`
                      : darkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 active:scale-[0.995]' : 'bg-white border-gray-200 hover:bg-gray-50 active:scale-[0.995]'
                  } ${removing[n.id] ? 'animate-swipe-out' : 'animate-item-in'} ${!n.read ? `${darkMode ? 'ring-1 ring-yellow-400/20' : 'ring-1 ring-blue-500/20'}` : ''}`}
                  style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
                >
                  <div className={`mt-0.5 p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                    <TypeIcon type={n.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                      <span className={`text-[10px] whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatNotificationDate(n.created_at || n.time)}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                      {n.message || n.body}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      {!n.read && <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-yellow-400' : 'bg-blue-500'}`} aria-label="Unread" />}
                      <button 
                        onClick={() => toggleRead(n.id)} 
                        disabled={actionLoading[n.id]}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                          actionLoading[n.id]
                            ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                            : n.read 
                              ? `${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-yellow-300' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-700'}`
                              : `${darkMode ? 'bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`
                        }`}
                      >
                        {actionLoading[n.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                        {actionLoading[n.id] ? 'Updating...' : `Mark as ${n.read ? 'unread' : 'read'}`}
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(n.id)}
                    disabled={removing[n.id]}
                    className={`self-start p-2 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-300' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'} transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label="Remove"
                  >
                    {removing[n.id] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
      <div className="hidden md:block absolute top-20 right-8 z-50" onClick={(e) => e.stopPropagation()}>
        <div className={`w-[22rem] lg:w-[24rem] xl:w-[26rem] rounded-2xl shadow-2xl border overflow-hidden ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} animate-dropdown-in`}>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className={`w-5 h-5 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Notifications</h3>
              {unreadCount > 0 && (
                <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-700'}`}>{unreadCount}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilter(f => f === 'All' ? 'Unread' : 'All')} 
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                  filter === 'Unread' 
                    ? `${darkMode ? 'border-purple-400/30 bg-purple-400/10 text-purple-300' : 'border-purple-200 bg-purple-50 text-purple-700'}`
                    : `${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`
                }`}
              >
                {filter === 'All' ? 'Unread' : 'All'}
              </button>
              <button 
                onClick={markAllRead} 
                disabled={actionLoading.markAll || unreadCount === 0}
                className={`px-2 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1 ${
                  actionLoading.markAll 
                    ? `${darkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-300 bg-gray-100 text-gray-500'} cursor-not-allowed`
                    : unreadCount === 0
                      ? `${darkMode ? 'border-gray-700 text-gray-500' : 'border-gray-300 text-gray-400'} cursor-not-allowed opacity-50`
                      : `${darkMode ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20' : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'}`
                }`} 
                title="Mark all as read"
              >
                {actionLoading.markAll ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <CheckCheck className="w-3 h-3" />
                )}
                {actionLoading.markAll ? 'Marking...' : 'All'}
              </button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto px-2 pb-2">
            {list.length === 0 ? (
              <div className={`text-center py-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <Bell className={`w-6 h-6 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm font-medium mb-1">
                  {filter === 'Unread' 
                    ? (notifications.length === 0 ? 'No notifications' : 'All caught up!') 
                    : 'No notifications'
                  }
                </p>
                <p className="text-xs opacity-75">
                  {filter === 'Unread' 
                    ? (notifications.length === 0 ? "New ones will appear here" : "Everything has been read") 
                    : "New ones will appear here"
                  }
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {list.map((n, idx) => (
                  <li
                    key={n.id}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl border transition-all duration-300 ${
                      actionLoading[n.id] 
                        ? `${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-300'} scale-[0.98]`
                        : darkMode ? 'bg-gray-900 border-gray-800 hover:bg-gray-800 active:scale-[0.995]' : 'bg-white border-gray-200 hover:bg-gray-50 active:scale-[0.995]'
                    } ${removing[n.id] ? 'animate-swipe-out' : 'animate-item-in'} ${!n.read ? `${darkMode ? 'ring-1 ring-yellow-400/20' : 'ring-1 ring-blue-500/20'}` : ''}`}
                    style={{ animationDelay: `${Math.min(idx * 40, 240)}ms` }}
                  >
                    <div className={`mt-0.5 p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                      <TypeIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{n.title}</p>
                        <span className={`text-[10px] whitespace-nowrap ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatNotificationDate(n.created_at || n.time)}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap`}>
                        {n.message || n.body}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {!n.read && <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-yellow-400' : 'bg-blue-500'}`} aria-label="Unread" />}
                        <button 
                          onClick={() => toggleRead(n.id)} 
                          disabled={actionLoading[n.id]}
                          className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-200 flex items-center gap-1 ${
                            actionLoading[n.id]
                              ? `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'} cursor-not-allowed`
                              : n.read 
                                ? `${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-yellow-300' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-700'}`
                                : `${darkMode ? 'bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`
                          }`}
                        >
                          {actionLoading[n.id] && <Loader2 className="w-3 h-3 animate-spin" />}
                          {actionLoading[n.id] ? 'Updating...' : `Mark as ${n.read ? 'unread' : 'read'}`}
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(n.id)} 
                      disabled={removing[n.id]}
                      className={`self-start p-2 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-red-300' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'} transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`} 
                      aria-label="Remove"
                    >
                      {removing[n.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
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
