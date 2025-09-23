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
  const { darkMode, user } = useUI();
  // Tab state
  const [activeTab, setActiveTab] = useState('announcements'); // 'announcements' | 'requested'
  const [allAnnouncements, setAllAnnouncements] = useState([]);
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
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // id to delete

  const priorityColors = {
    high: 'bg-red-500/15 text-red-600 dark:bg-red-500/20 dark:text-red-300',
    normal: 'bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300',
    low: 'bg-gray-500/15 text-gray-600 dark:bg-gray-500/20 dark:text-gray-300'
  };

  const loadAllAnnouncements = async () => {
    setError(null);
    try {
      const { getAllSystemAnnouncements } = await import('../../lib/api/announcements');
      const res = await getAllSystemAnnouncements();
      if (res.success) {
        setAllAnnouncements(res.announcements || res.data || []);
      } else {
        throw new Error(res.message || 'Failed to load announcements');
      }
    } catch (e) {
      console.error('Announcements fetch failed:', e);
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadAllAnnouncements(); }, []);

  // Filtering - separate active and inactive announcements based on current tab
  const activeAnnouncements = useMemo(() => allAnnouncements.filter(a => a.active === true), [allAnnouncements]);
  const inactiveAnnouncements = useMemo(() => allAnnouncements.filter(a => a.active === false), [allAnnouncements]);

  const filtered = useMemo(() => {
    const sourceAnnouncements = activeTab === 'announcements' ? activeAnnouncements : inactiveAnnouncements;
    return sourceAnnouncements.filter(a => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || a.title?.toLowerCase().includes(q) || a.body?.toLowerCase().includes(q) || a.tags?.some(t => t.toLowerCase().includes(q));
      const matchesPriority = priorityFilter === 'all' || a.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [activeAnnouncements, inactiveAnnouncements, activeTab, search, priorityFilter]);

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
      expiresAt: ann.expires_at ? ann.expires_at.split('T')[0] : ''
    });
    setCreating(true); // reuse drawer/modal
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) return;
    setSubmitting(true);
    try {
      const { createSystemAnnouncement, updateSystemAnnouncement } = await import('../../lib/api/announcements');

      const payload = {
        user_id: user?.id, // Admin's user ID for new announcements
        title: form.title.trim(),
        body: form.body.trim(),
        priority: form.priority,
        active: form.active,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null
      };

      if (editingId) {
        // For updates, don't include user_id as it shouldn't change
        const updatePayload = { ...payload };
        delete updatePayload.user_id;
        await updateSystemAnnouncement(editingId, updatePayload);
      } else {
        await createSystemAnnouncement(payload);
      }
      await loadAllAnnouncements(); // Reload all announcements
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
      const { updateSystemAnnouncement } = await import('../../lib/api/announcements');
      const newActive = !ann.active;
      // Update only the active status, keep other fields unchanged
      await updateSystemAnnouncement(ann.id, {
        title: ann.title,
        body: ann.body,
        priority: ann.priority,
        tags: ann.tags || [],
        active: newActive,
        expiresAt: ann.expires_at
      });
      await loadAllAnnouncements(); // Reload all announcements
    } catch (e) {
      console.error('Toggle failed:', e);
      alert('Failed to update status');
    }
  };

  const performDelete = async (id) => {
    try {
      const { deleteSystemAnnouncement } = await import('../../lib/api/announcements');
      await deleteSystemAnnouncement(id);
      await loadAllAnnouncements(); // Reload all announcements
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
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Announcements Management</h1>
              <p className={darkMode ? 'text-gray-400 text-sm' : 'text-gray-600 text-sm'}>Manage system announcements. Active announcements appear in Announcements tab, inactive/requested announcements in Requested tab.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadAllAnnouncements(); }} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}>
                {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
              {activeTab === 'announcements' && (
                <button onClick={startCreate} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="w-4 h-4" /> New
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 text-sm">
            <button 
              onClick={() => setActiveTab('announcements')} 
              className={`px-4 py-2 rounded-t-lg border flex items-center gap-2 ${
                activeTab === 'announcements' 
                  ? 'bg-gray-950 border-gray-700 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              Announcements 
              <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-xs">
                {activeAnnouncements.length}
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
                {inactiveAnnouncements.length}
              </span>
            </button>
          </div>

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
                    <th className="px-4 py-3 text-left font-semibold">Title</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Priority</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Tags</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Created By</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Date</th>
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
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {a.users ? (
                          <div>
                            <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{a.users.name}</div>
                            <div className="text-gray-500">{a.users.email}</div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">{a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${a.active ? (darkMode ? 'bg-green-600/20 text-green-400' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700')}`}>{a.active ? 'Active' : 'Inactive'}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {activeTab === 'announcements' ? (
                            // Actions for active announcements
                            <>
                              <button onClick={() => startEdit(a)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`} title="Edit"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => toggleActive(a)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Deactivate"><X className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete(a.id)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Delete"><Trash2 className="w-4 h-4" /></button>
                            </>
                          ) : (
                            // Actions for inactive/requested announcements  
                            <>
                              <button onClick={() => toggleActive(a)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-green-300' : 'hover:bg-gray-100 text-green-600'}`} title="Activate"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete(a.id)} className={`p-1.5 rounded-md ${darkMode ? 'hover:bg-gray-800 text-red-300' : 'hover:bg-gray-100 text-red-600'}`} title="Delete"><Trash2 className="w-4 h-4" /></button>
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
