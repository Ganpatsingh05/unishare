"use client";

import { useEffect, useState, useMemo } from "react";
import { Megaphone, Plus, RefreshCcw, Edit, Trash2, X, Check, Loader2, Search, Filter, Tag, Calendar, Save } from "lucide-react";
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import { useUI } from "../../lib/contexts/UniShareContext";

/*
  Admin Announcements Page
  Features:
  - List announcements (title, status, created, last updated)
  - Create new announcement (title, message/body, priority, expiresAt optional, tags)
  - Edit & delete existing announcements
  - Activate / Deactivate toggle
  - Basic client-side filtering & search
  - Uses API helper functions (graceful fallback to mock if backend missing)
*/

export default function AdminAnnouncementsPage() {
  const { darkMode } = useUI();
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    body: '',
    priority: 'normal',
    tags: '',
    active: true,
    expiresAt: ''
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // id to delete

  const priorityColors = {
    high: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-300',
    normal: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    low: 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
  };

  const loadAnnouncements = async () => {
    setError(null);
    try {
      const { getSystemAnnouncements } = await import('../../lib/api');
      const res = await getSystemAnnouncements();
      if (res.success && Array.isArray(res.announcements || res.data)) {
        setAnnouncements(res.announcements || res.data);
      } else if (Array.isArray(res)) {
        // In case endpoint just returns array
        setAnnouncements(res);
      } else {
        throw new Error(res.message || 'Unexpected response');
      }
    } catch (e) {
      console.error('Announcements fetch failed, using mock:', e);
      // Fallback mock data
      setAnnouncements([
        {
          id: 'mock-1',
            title: 'Platform Update',
            body: 'We have introduced the new rideshare improvements.',
            priority: 'normal',
            active: true,
            createdAt: new Date(Date.now() - 3600_000).toISOString(),
            updatedAt: new Date(Date.now() - 3600_000).toISOString(),
            tags: ['update','rideshare']
        },
        {
          id: 'mock-2',
            title: 'Maintenance Window',
            body: 'Scheduled maintenance on Saturday 2:00-3:00 AM.',
            priority: 'high',
            active: false,
            createdAt: new Date(Date.now() - 86400_000).toISOString(),
            updatedAt: new Date(Date.now() - 4000_000).toISOString(),
            tags: ['maintenance']
        }
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadAnnouncements(); }, []);

  const filtered = useMemo(() => announcements.filter(a => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || a.title?.toLowerCase().includes(q) || a.body?.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q));
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? a.active : !a.active);
    const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  }), [announcements, search, statusFilter, priorityFilter]);

  const resetForm = () => {
    setForm({ title: '', body: '', priority: 'normal', tags: '', active: true, expiresAt: '' });
    setEditingId(null);
  };

  const startCreate = () => { resetForm(); setCreating(true); };
  const closeCreate = () => { setCreating(false); resetForm(); };

  const startEdit = (ann) => {
    setEditingId(ann.id);
    setForm({
      title: ann.title || '',
      body: ann.body || '',
      priority: ann.priority || 'normal',
      tags: (ann.tags || []).join(', '),
      active: !!ann.active,
      expiresAt: ann.expiresAt ? ann.expiresAt.split('T')[0] : ''
    });
    setCreating(true); // reuse drawer/modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    try {
      const { createSystemAnnouncement, updateSystemAnnouncement } = await import('../../lib/api');

      const payload = {
        title: form.title.trim(),
        body: form.body.trim(),
        priority: form.priority,
        active: form.active,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
      };

      if (editingId) {
        await updateSystemAnnouncement(editingId, payload);
        setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...payload, updatedAt: new Date().toISOString() } : a));
      } else {
        const res = await createSystemAnnouncement(payload);
        const created = res.announcement || res.data || { id: Math.random().toString(36).slice(2), ...payload };
        setAnnouncements(prev => [{ ...created, createdAt: created.createdAt || new Date().toISOString(), updatedAt: created.updatedAt || new Date().toISOString() }, ...prev]);
      }
      closeCreate();
    } catch (e) {
      console.error('Save failed:', e);
      alert('Failed to save announcement: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (ann) => {
    try {
      const { updateSystemAnnouncement } = await import('../../lib/api');
      const newActive = !ann.active;
      await updateSystemAnnouncement(ann.id, { active: newActive });
      setAnnouncements(prev => prev.map(a => a.id === ann.id ? { ...a, active: newActive, updatedAt: new Date().toISOString() } : a));
    } catch (e) {
      console.error('Toggle failed:', e);
      alert('Failed to update status');
    }
  };

  const performDelete = async (id) => {
    try {
      const { deleteSystemAnnouncement } = await import('../../lib/api');
      await deleteSystemAnnouncement(id);
      setAnnouncements(prev => prev.filter(a => a.id !== id));
      setConfirmDelete(null);
    } catch (e) {
      console.error('Delete failed:', e);
      alert('Failed to delete announcement');
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
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Announcements</h1>
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>Create and manage system-wide announcements displayed to users.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadAnnouncements(); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
              <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                <Plus className="w-4 h-4" /> New
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search title, body, tags" className={`w-full pl-9 pr-3 py-2 rounded-lg border ${inputBase}`} />
              </div>
              <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Priority</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Tags</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Created</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Updated</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className={darkMode ? 'divide-y divide-gray-800' : 'divide-y divide-gray-200'}>
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No announcements found.</td></tr>
                  )}
                  {filtered.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/70">
                      <td className="px-4 py-3 align-top w-[25%]">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5"><Megaphone className="w-4 h-4 text-blue-500" /></div>
                          <div>
                            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{a.title}</p>
                            <p className={`text-xs mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{a.body}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[a.priority] || priorityColors.normal}`}>{a.priority || 'normal'}</span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {(a.tags || []).map(t => <span key={t} className={`px-2 py-0.5 rounded-full text-[10px] ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>#{t}</span>)}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">{a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(a)} className={`px-2 py-1 rounded-md text-xs font-medium ${a.active ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}>{a.active ? 'Active' : 'Inactive'}</button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => startEdit(a)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => setConfirmDelete(a.id)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Create / Edit Drawer */}
          {creating && (
            <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeCreate} />
              <div className={`relative w-full md:max-w-xl md:rounded-2xl border-t md:border ${panelBg} p-6 animate-slide-up-soft md:animate-dropdown-in max-h-[90vh] overflow-y-auto`}> 
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
                  <button onClick={closeCreate} className={darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Title</label>
                    <input value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} required maxLength={120} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`} placeholder="e.g. Scheduled Maintenance" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Message</label>
                    <textarea value={form.body} onChange={e=>setForm(f=>({...f,body:e.target.value}))} required rows={5} className={`w-full px-3 py-2 rounded-lg border resize-none ${inputBase}`} placeholder="Write the announcement content..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Priority</label>
                      <select value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`}>
                        <option value="high">High</option>
                        <option value="normal">Normal</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Expires (optional)</label>
                      <input type="date" value={form.expiresAt} onChange={e=>setForm(f=>({...f,expiresAt:e.target.value}))} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Tags (comma separated)</label>
                    <input value={form.tags} onChange={e=>setForm(f=>({...f,tags:e.target.value}))} className={`w-full px-3 py-2 rounded-lg border ${inputBase}`} placeholder="maintenance, update" />
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="active-toggle" type="checkbox" checked={form.active} onChange={e=>setForm(f=>({...f,active:e.target.checked}))} className="rounded border-gray-400" />
                    <label htmlFor="active-toggle" className="text-sm">Active immediately</label>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={closeCreate} className={`px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Cancel</button>
                    <button type="submit" disabled={submitting} className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold ${submitting ? 'opacity-70 cursor-not-allowed' : ''} ${darkMode ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>{submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{editingId ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={()=>setConfirmDelete(null)} />
              <div className={`relative w-full max-w-sm rounded-xl border p-6 ${panelBg}`}>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Delete Announcement</h3>
                <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>Are you sure you want to delete this announcement? This action cannot be undone.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={()=>setConfirmDelete(null)} className={`px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>Cancel</button>
                  <button onClick={()=>performDelete(confirmDelete)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
