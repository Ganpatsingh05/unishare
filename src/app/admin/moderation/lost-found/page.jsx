"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, Eye, CheckCircle, XCircle, Trash2, Flag, Clock, AlertTriangle, Filter } from 'lucide-react';
import AdminGuard from "../../_components/AdminGuard";
import AdminLayout from "../../_components/AdminLayout";
import { fetchLostFoundItems, deleteLostFoundItem } from "../../../lib/api/lostFound";

/*
  Lost & Found Moderation Page
  - Lists lost & found posts with basic metadata
  - Filters: status, type (lost/found), search text
  - Actions: mark resolved, dismiss, delete (mock)
  - Uses mock data now; pluggable API later
*/

const mockLostFound = [
  { id: 'lf-1', mode: 'lost', itemName: 'Black Wallet', description: 'Lost near library entrance', status: 'open', reporter: 'alice@uni.edu', createdAt: new Date(Date.now()-3600_000).toISOString(), updatedAt: new Date(Date.now()-1800_000).toISOString() },
  { id: 'lf-2', mode: 'found', itemName: 'Silver Water Bottle', description: 'Found in cafeteria, has stickers', status: 'open', reporter: 'bob@uni.edu', createdAt: new Date(Date.now()-7200_000).toISOString(), updatedAt: new Date(Date.now()-7000_000).toISOString() },
  { id: 'lf-3', mode: 'lost', itemName: 'Physics Notebook', description: 'Blue cover, many formulas', status: 'resolved', reporter: 'carol@uni.edu', createdAt: new Date(Date.now()-86400_000).toISOString(), updatedAt: new Date(Date.now()-40000_000).toISOString() },
];

export default function LostFoundModerationPage() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadItems = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const result = await fetchLostFoundItems();
      if (result.success && result.data) {
        setItems(result.data.map(item => ({
          id: item.id,
          mode: item.mode,
          item_name: item.item_name,
          description: item.description,
          where_last_seen: item.where_last_seen,
          where_found: item.where_found,
          date_lost: item.date_lost,
          date_found: item.date_found,
          time_lost: item.time_lost,
          time_found: item.time_found,
          contact_info: item.contact_info,
          image_urls: item.image_urls || [],
          status: item.status || 'open',
          users: item.users,
          user_id: item.user_id,
          createdAt: item.created_at,
          updatedAt: item.updated_at || item.created_at,
          // Legacy fields for backward compatibility
          itemName: item.item_name,
          reporter: item.contact_info?.email || item.users?.email || 'Unknown User',
          reporterName: item.users?.name || 'Anonymous',
          location: item.where_last_seen || item.where_found,
          contactInfo: item.contact_info,
          images: item.image_urls || []
        })));
      } else {
        // Fallback to mock data if API fails
        setItems(mockLostFound);
      }
    } catch (error) {
      console.error('Failed to load lost/found items:', error);
      setError(error.message);
      // Fallback to mock data on error
      setItems(mockLostFound);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { loadItems(); }, []);

  const handleDelete = async (itemId) => {
    try {
      setRefreshing(true);
      await deleteLostFoundItem(itemId);
      await loadItems(); // Refresh the list
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete item:', error);
      setError(`Failed to delete item: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => items.filter(i => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || i.itemName.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesMode = modeFilter === 'all' || i.mode === modeFilter;
    return matchesSearch && matchesStatus && matchesMode;
  }), [items, search, statusFilter, modeFilter]);

  const updateStatus = (id, status) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status, updatedAt: new Date().toISOString() } : i));
  };

  // deleteItem function removed - now using handleDelete with API call

  const panelBg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lost & Found Moderation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage lost & found submissions.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadItems(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {refreshing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items..." className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
              </div>
              <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
              </select>
              <select value={modeFilter} onChange={e=>setModeFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="all">All Types</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCcw className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">Loading lost & found items...</p>
            </div>
          )}

          {/* List */}
          <div className={`rounded-xl border ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Item Details</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Location & Date</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell text-gray-700 dark:text-gray-200">Reporter</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No lost & found items.</td></tr>
                  )}
                  {filtered.map(i => (
                    <tr key={i.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 max-w-[280px]">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{i.item_name}</p>
                          <p className="text-xs mt-1 line-clamp-2 text-gray-600 dark:text-gray-400">{i.description}</p>
                          <div className="mt-1">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${i.mode === 'lost' ? 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200' : 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200'}`}>
                              {i.mode}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div>
                          {i.mode === 'lost' ? (
                            <>
                              {i.where_last_seen && <p className="font-medium truncate max-w-[120px]" title={i.where_last_seen}>📍 {i.where_last_seen}</p>}
                              {i.date_lost && <p className="text-gray-600 dark:text-gray-400">Lost: {new Date(i.date_lost).toLocaleDateString()}</p>}
                              {i.time_lost && <p className="text-gray-500 text-xs">⏰ {i.time_lost}</p>}
                            </>
                          ) : (
                            <>
                              {i.where_found && <p className="font-medium truncate max-w-[120px]" title={i.where_found}>📍 {i.where_found}</p>}
                              {i.date_found && <p className="text-gray-600 dark:text-gray-400">Found: {new Date(i.date_found).toLocaleDateString()}</p>}
                              {i.time_found && <p className="text-gray-500 text-xs">⏰ {i.time_found}</p>}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-700 dark:text-gray-300">
                        <div>
                          <p className="font-medium">{i.users?.name || 'Anonymous'}</p>
                          <p className="text-gray-500">ID: {i.user_id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div>
                          {i.contact_info?.phone && <p>📞 {i.contact_info.phone}</p>}
                          {i.contact_info?.email && <p>✉️ {i.contact_info.email}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={()=>updateStatus(i.id, i.status === 'open' ? 'resolved' : 'open')} className={`px-2 py-1 rounded-md text-xs font-medium ${i.status === 'open' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>{i.status === 'open' ? 'Open' : 'Resolved'}</button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" title="View"><Eye className="w-4 h-4" /></button>
                          {i.status === 'open' && <button onClick={()=>updateStatus(i.id,'resolved')} className="p-1.5 rounded-md text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30" title="Mark Resolved"><CheckCircle className="w-4 h-4" /></button>}
                          <button onClick={()=>setConfirmDelete(i.id)} className="p-1.5 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={()=>setConfirmDelete(null)} />
              <div className="relative w-full max-w-sm rounded-xl border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Delete Item</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this lost & found entry? This action cannot be undone.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={()=>setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button 
                    onClick={() => handleDelete(confirmDelete)} 
                    disabled={refreshing}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {refreshing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
