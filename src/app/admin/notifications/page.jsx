"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Send, Bell, Users, Loader2, CheckCircle2, XCircle, RefreshCcw, Search, Filter, X, Plus, Tag } from 'lucide-react';
import { useUI } from "../../lib/contexts/UniShareContext";
import { sendAdminNotification } from "../../lib/api";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";

/*
  Admin Notifications Page (Refined)
  - Matches styling/structure patterns of Announcements page
  - Two-column layout on large screens (left form, right history)
  - Audience modes: All Users / Specific Emails / Test (Self)
  - Email chip parsing & removal
  - Title + Message + Type
  - LocalStorage persisted history (key: unishare_notification_history)
  - Search + Type filter + status filter (client-side)
  - Optimistic sending with status (sending/sent/failed)
*/

const HISTORY_STORAGE_KEY = 'unishare_notification_history';

export default function AdminNotificationsPage() {
  const { darkMode } = useUI();
  const [audienceMode, setAudienceMode] = useState('all'); // all | emails | self
  const [emailInput, setEmailInput] = useState('');
  const [emails, setEmails] = useState([]); // parsed chips
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info'
  });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const emailInputRef = useRef(null);

  // Load history from localStorage (with simple seed if empty)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      } else {
        const seed = [
          { id: 'seed-1', title: 'Scheduled Maintenance', users: ['ALL'], message: 'System maintenance tonight 10PM IST', type: 'warning', status: 'sent', createdAt: new Date(Date.now() - 3600_000).toISOString() }
        ];
        setHistory(seed);
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(seed));
      }
    } catch (e) {
      console.warn('History load failed', e);
    }
  }, []);

  // Persist history
  useEffect(() => {
    try { localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history)); } catch(_){}
  }, [history]);

  const panelBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputBase = darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  // Add emails when user types comma / enter / blur
  const ingestEmails = (raw) => {
    const parts = raw.split(/[,\n]/).map(p=>p.trim()).filter(Boolean);
    if (!parts.length) return;
    setEmails(prev => Array.from(new Set([...prev, ...parts])));
    setEmailInput('');
  };

  const removeEmail = (e) => {
    setEmails(prev => prev.filter(x => x !== e));
  };

  const handleEmailKey = (e) => {
    if (['Enter','Tab',','].includes(e.key)) {
      e.preventDefault();
      ingestEmails(emailInput);
    } else if (e.key === 'Backspace' && !emailInput && emails.length) {
      // quick remove last
      setEmails(prev => prev.slice(0,-1));
    }
  };

  const resetForm = () => {
    setForm({ title: '', message: '', type: 'info' });
    setEmails([]);
    setAudienceMode('all');
    setEmailInput('');
  };

  const validate = () => {
    if (!form.message.trim()) return 'Message is required';
    if (audienceMode === 'emails' && emails.length === 0) return 'Add at least one email or switch audience mode';
    return null;
  };

  const buildUsersArray = () => {
    if (audienceMode === 'all') return ['ALL'];
    if (audienceMode === 'self') return ['SELF']; // backend can translate SELF to current admin
    return emails;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    const v = validate();
    if (v) { setError(v); return; }
    const usersArray = buildUsersArray();
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      title: form.title.trim() || null,
      users: usersArray,
      message: form.message.trim(),
      type: form.type,
      status: 'sending',
      createdAt: new Date().toISOString()
    };
    setHistory(h => [optimistic, ...h]);
    setSending(true);
    try {
      await sendAdminNotification({ users: usersArray, message: form.message.trim(), type: form.type, title: form.title.trim() || undefined });
      setHistory(h => h.map(n => n.id === tempId ? { ...n, status: 'sent' } : n));
      setSuccess('Notification sent');
      resetForm();
    } catch (err) {
      console.error(err);
      setHistory(h => h.map(n => n.id === tempId ? { ...n, status: 'failed', error: err.message } : n));
      setError(err.message || 'Failed to send');
    } finally {
      setSending(false);
    }
  };

  const filtered = useMemo(() => {
    return history.filter(h => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || h.message.toLowerCase().includes(q) || (h.title?.toLowerCase().includes(q));
      const matchesType = typeFilter === 'all' || h.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [history, search, typeFilter, statusFilter]);

  const refreshHistory = () => {
    setRefreshing(true);
    // Placeholder for future backend re-fetch
    setTimeout(() => setRefreshing(false), 600);
  };

  const typeBadge = (t) => ({
    info: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    success: 'bg-green-500/15 text-green-600 dark:bg-green-500/20 dark:text-green-300',
    warning: 'bg-yellow-500/15 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
    error: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-300'
  })[t] || 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300';

  const statusBadge = (s) => ({
    sending: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    sent: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
  })[s] || 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h1>
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>Broadcast messages to users with priority context.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={refreshHistory} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Panel */}
            <div className={`lg:col-span-5 rounded-xl border ${panelBg} p-6 space-y-6`}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Title (optional)</label>
                  <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} maxLength={120} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`} placeholder="Maintenance Notice" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Message</label>
                  <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} required rows={5} className={`w-full px-3 py-2 rounded-lg border resize-none ${inputBase}`} placeholder="Write the notification content..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Type</label>
                    <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Audience Mode</label>
                    <select value={audienceMode} onChange={e=>setAudienceMode(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                      <option value="all">All Users</option>
                      <option value="emails">Specific Emails</option>
                      <option value="self">Test (Only Me)</option>
                    </select>
                  </div>
                </div>
                {audienceMode === 'emails' && (
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Emails</label>
                    <div className={`w-full rounded-lg border p-2 flex flex-wrap gap-1 cursor-text min-h-[46px] ${inputBase}`} onClick={()=>emailInputRef.current?.focus()}>
                      {emails.map(e => (
                        <span key={e} className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-md ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-700'}`}>
                          {e}
                          <button type="button" onClick={()=>removeEmail(e)} className="opacity-60 hover:opacity-100">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        ref={emailInputRef}
                        value={emailInput}
                        onChange={e=>setEmailInput(e.target.value)}
                        onBlur={()=>ingestEmails(emailInput)}
                        onKeyDown={handleEmailKey}
                        className={`flex-1 min-w-[120px] bg-transparent outline-none text-sm ${darkMode? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
                        placeholder={emails.length ? '' : 'Type email & press Enter'}
                      />
                    </div>
                    <p className="text-[11px] mt-1 text-gray-500">Press Enter or comma to add. Duplicates ignored.</p>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-500"><XCircle className="w-4 h-4" />{error}</div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-sm text-green-500"><CheckCircle2 className="w-4 h-4" />{success}</div>
                )}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button type="button" onClick={resetForm} disabled={sending} className={`px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'} disabled:opacity-50`}>Reset</button>
                  <button type="submit" disabled={sending} className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold ${sending ? 'opacity-70 cursor-not-allowed' : ''} ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send</button>
                </div>
              </form>
            </div>

            {/* History Panel */}
            <div className={`lg:col-span-7 space-y-4`}>
              <div className={`p-4 rounded-xl border ${panelBg}`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title or message" className={`w-full pl-9 pr-3 py-2 rounded-lg border ${inputBase}`} />
                  </div>
                  <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                    <option value="all">All Types</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                  <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                    <option value="all">All Status</option>
                    <option value="sending">Sending</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
              <div className={`rounded-xl border ${panelBg}`}>
                <div className="overflow-x-auto divide-y divide-gray-200 dark:divide-gray-800">
                  {filtered.length === 0 && (
                    <div className="p-10 text-center text-sm text-gray-500">No notifications found.</div>
                  )}
                  {filtered.map(n => (
                    <div key={n.id} className="p-5 flex flex-col md:flex-row md:items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${typeBadge(n.type)}`}>{n.type.toUpperCase()}</span>
                          {n.title && <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{n.title}</span>}
                          <span className="text-[11px] text-gray-500 dark:text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge(n.status)}`}>{n.status}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{n.message}</p>
                        <div className="flex flex-wrap gap-1">
                          {n.users.slice(0,8).map(u => (
                            <span key={u} className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{u === 'ALL' ? 'All Users' : (u === 'SELF' ? 'Only Me' : u)}</span>
                          ))}
                          {n.users.length > 8 && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>+{n.users.length - 8} more</span>
                          )}
                        </div>
                        {n.error && <p className="text-xs text-red-500">Error: {n.error}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
