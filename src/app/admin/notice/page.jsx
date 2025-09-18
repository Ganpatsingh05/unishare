"use client";

import { useEffect, useState, useMemo } from "react";
import { Megaphone, Plus, RefreshCw, Edit, Trash2, X, Check, Loader2, Search, Filter } from "lucide-react";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import { useUI } from "../../lib/contexts/UniShareContext";

/*
  Admin Notice Management Page
  Features:
  - Two tabs: Notice (active) and Requested (inactive)
  - Create, edit, delete notices
  - Activate/deactivate toggle
  - Basic client-side filtering & search
  - Uses API helper functions (graceful fallback to mock if backend missing)
*/

export default function AdminNoticePage() {
  const { darkMode, user } = useUI();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('notice'); // 'notice' | 'requested'
  const [allNotices, setAllNotices] = useState([]);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    heading: '',
    body: '',
    priority: 'normal',
    active: true
  });
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // id to delete

  const priorityColors = {
    high: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-300',
    normal: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    low: 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
  };

  const loadAllNotices = async () => {
    setError(null);
    try {
      const { getAllNotices } = await import('../../lib/api/notice');
      const res = await getAllNotices();
      if (res.success) {
        setAllNotices(res.notices || res.data || []);
      } else {
        throw new Error(res.message || 'Failed to load notices');
      }
    } catch (e) {
      console.error('Notice fetch failed:', e);
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadAllNotices(); }, []);

  // Filtering - separate active and inactive notices based on current tab
  const activeNotices = useMemo(() => allNotices.filter(n => n.active === true), [allNotices]);
  const inactiveNotices = useMemo(() => allNotices.filter(n => n.active === false), [allNotices]);

  const filtered = useMemo(() => {
    const sourceNotices = activeTab === 'notice' ? activeNotices : inactiveNotices;
    return sourceNotices.filter(n => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || n.heading?.toLowerCase().includes(q) || n.body?.toLowerCase().includes(q);
      const matchesPriority = priorityFilter === 'all' || n.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [activeNotices, inactiveNotices, activeTab, search, priorityFilter]);

  const resetForm = () => {
    setForm({ heading: '', body: '', priority: 'normal', active: true });
    setEditingId(null);
  };

  const startCreate = () => { resetForm(); setCreating(true); };
  const closeCreate = () => { setCreating(false); resetForm(); };

  const startEdit = (notice) => {
    setEditingId(notice.id);
    setForm({
      heading: notice.heading || '',
      body: notice.body || '',
      priority: notice.priority || 'normal',
      active: !!notice.active
    });
    setCreating(true); // reuse drawer/modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.heading.trim() || !form.body.trim()) return;
    setSubmitting(true);
    try {
      const { createNotice, updateNotice } = await import('../../lib/api/notice');

      const payload = {
        user_id: user?.id, // Admin's user ID for new notices
        heading: form.heading.trim(),
        body: form.body.trim(),
        priority: form.priority,
        active: form.active
      };

      if (editingId) {
        // For updates, don't include user_id as it shouldn't change
        const updatePayload = { ...payload };
        delete updatePayload.user_id;
        await updateNotice(editingId, updatePayload);
      } else {
        await createNotice(payload);
      }
      await loadAllNotices(); // Reload all notices
      closeCreate();
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save notice: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (notice) => {
    try {
      const { updateNotice } = await import('../../lib/api/notice');
      const newActive = !notice.active;
      // Update only the active status, keep other fields unchanged
      await updateNotice(notice.id, {
        heading: notice.heading,
        body: notice.body,
        priority: notice.priority,
        active: newActive
      });
      await loadAllNotices(); // Reload all notices
    } catch (e) {
      console.error('Toggle failed:', e);
      alert('Failed to update status');
    }
  };

  const performDelete = async (id) => {
    try {
      const { deleteNotice } = await import('../../lib/api/notice');
      await deleteNotice(id);
      await loadAllNotices(); // Reload all notices
      setConfirmDelete(null);
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Failed to delete notice');
    }
  };

  const panelBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputBase = darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notice Management</h1>
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>Manage system notices. Active notices appear in Notice tab, inactive/requested notices in Requested tab.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadAllNotices(); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />} Refresh
              </button>
              {activeTab === 'notice' && (
                <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> New
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 text-sm">
            <button 
              onClick={() => setActiveTab('notice')} 
              className={`px-4 py-2 rounded-t-lg border flex items-center gap-2 ${
                activeTab === 'notice' 
                  ? 'bg-gray-950 border-gray-700 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Notice 
              <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-xs">
                {activeNotices.length}
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('requested')} 
              className={`px-4 py-2 rounded-t-lg border flex items-center gap-2 ${
                activeTab === 'requested' 
                  ? 'bg-gray-950 border-gray-700 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Requested 
              <span className="px-2 py-0.5 rounded-full bg-yellow-600 text-white text-xs">
                {inactiveNotices.length}
              </span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <Megaphone className="w-4 h-4" />
              <span>Error: {error}</span>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${activeTab}`} className={`w-full pl-9 pr-3 py-2 rounded-lg border ${inputBase}`} />
              </div>
              <select value={priorityFilter} onChange={(e)=>setPriorityFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="normal">Normal</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className={`rounded-xl border ${panelBg}`}> 
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className={darkMode ? 'bg-gray-800/60' : 'bg-gray-100'}>
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Heading</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Priority</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Created By</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No notices found.</td></tr>
                  )}
                  {filtered.map(n => (
                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                      <td className="px-4 py-3 align-top w-[30%]">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5"><Megaphone className="w-4 h-4 text-blue-500" /></div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{n.heading}</p>
                            <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{n.body}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[n.priority] || priorityColors.normal}`}>{n.priority || 'normal'}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {n.users ? (
                          <div>
                            <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{n.users.name}</div>
                            <div className="text-gray-500">{n.users.email}</div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">{n.created_at ? new Date(n.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${n.active ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}>{n.active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === 'notice' ? (
                            // Actions for active notices
                            <>
                              <button onClick={() => startEdit(n)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} title="Edit"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => toggleActive(n)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Deactivate"><X className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete(n.id)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </>
                          ) : (
                            // Actions for inactive/requested notices  
                            <>
                              <button onClick={() => toggleActive(n)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-green-300' : 'hover:bg-gray-100 text-green-600'}`} title="Activate"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete(n.id)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create / Edit Modal */}
          {creating && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeCreate} />
              <div className="relative w-full md:max-w-xl md:rounded-2xl border-t md:border border-gray-800 bg-gray-950 p-6 animate-slide-up-soft md:animate-dropdown-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Notice' : 'New Notice'}</h2>
                  <button onClick={closeCreate} className="text-gray-400 hover:text-gray-200"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Heading</label>
                    <input value={form.heading} onChange={e => setForm(f => ({...f, heading: e.target.value}))} required className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500" placeholder="Notice heading" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Body</label>
                    <textarea value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))} required rows={4} className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-500" placeholder="Notice content" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Priority</label>
                      <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100">
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Status</label>
                      <select value={form.active ? 'active' : 'inactive'} onChange={e => setForm(f => ({...f, active: e.target.value === 'active'}))} className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={closeCreate} className="flex-1 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
                    <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : (editingId ? 'Update' : 'Create')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
              <div className="relative bg-gray-950 border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-white mb-2">Delete Notice</h3>
                <p className="text-gray-400 mb-6">Are you sure you want to delete this notice? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800">Cancel</button>
                  <button onClick={() => performDelete(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}