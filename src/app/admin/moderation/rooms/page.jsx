"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, Eye, Trash2, Home, MapPin, Calendar, AlertTriangle } from 'lucide-react';
import AdminGuard from "../../_components/AdminGuard";
import AdminLayout from "../../_components/AdminLayout";
import { fetchRooms, deleteRoom } from "../../../lib/api/rooms";

/*
  Rooms Moderation Page
  - Lists room/accommodation listings with comprehensive details
  - Filters: search (title/location), rent range, available date
  - Actions: view details, remove listing
  - Real API integration with delete functionality
*/

export default function RoomsModerationPage() {
  const [rooms, setRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailRoom, setDetailRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRooms = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const result = await fetchRooms();
      if (result && result.success && Array.isArray(result.data)) {
        setRooms(result.data.map(room => ({
          id: room.id,
          title: room.title,
          rent: room.rent,
          location: room.location,
          beds: room.beds,
          move_in_date: room.move_in_date,
          contact_info: room.contact_info,
          photos: room.photos || [],
          user_id: room.user_id,
          created_at: room.created_at,
          // Add users data if available in API response
          users: room.users || null
        })));
      } else if (result && Array.isArray(result.data)) {
        // Handle case where success flag might not be present
        setRooms(result.data.map(room => ({
          id: room.id,
          title: room.title,
          rent: room.rent,
          location: room.location,
          beds: room.beds,
          move_in_date: room.move_in_date,
          contact_info: room.contact_info,
          photos: room.photos || [],
          user_id: room.user_id,
          created_at: room.created_at,
          users: room.users || null
        })));
      } else {
        // If no rooms or API returns empty/error, just set empty array
        setRooms([]);
        console.warn('No rooms data available or API returned unexpected format');
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setError(`Failed to fetch rooms: ${error.message || 'Network error'}`);
      // Set empty rooms array on error so the page still loads
      setRooms([]);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => { loadRooms(); }, []);

  const handleDelete = async (roomId) => {
    try {
      setRefreshing(true);
      await deleteRoom(roomId);
      await loadRooms(); // Refresh the list
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete room:', error);
      setError(`Failed to delete room: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(() => rooms.filter(room => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || 
      room.title.toLowerCase().includes(q) || 
      room.location.toLowerCase().includes(q);
    return matchesSearch;
  }), [rooms, search]);

  const panelBg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms Moderation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage room/accommodation listings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadRooms(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {refreshing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={search} 
                  onChange={e=>setSearch(e.target.value)} 
                  placeholder="Search rooms by title or location..." 
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" 
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Home className="w-4 h-4 mr-2" />
                {filtered.length} room{filtered.length !== 1 ? 's' : ''} found
              </div>
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
              <p className="text-gray-500">Loading room listings...</p>
            </div>
          )}

          {/* Room List */}
          <div className={`rounded-xl border ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Room Details</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Location & Beds</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell text-gray-700 dark:text-gray-200">Contact</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Rent</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Available From</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No rooms found.</td></tr>
                  )}
                  {filtered.map(room => (
                    <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 max-w-[280px]">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{room.title}</p>
                          <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">ID: {room.user_id}</p>
                          {room.photos.length > 0 && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200 mt-1">
                              📷 {room.photos.length} photo{room.photos.length !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div>
                          <p className="font-medium truncate max-w-[120px]" title={room.location}>📍 {room.location}</p>
                          <p className="text-gray-600 dark:text-gray-400">🛏️ {room.beds} bed{room.beds !== 1 ? 's' : ''}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-700 dark:text-gray-300">
                        <div>
                          {room.contact_info?.email && <p>✉️ {room.contact_info.email}</p>}
                          {room.contact_info?.mobile && <p>📱 {room.contact_info.mobile}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-200">
                          ₹{room.rent}/month
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(room.move_in_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setDetailRoom(room)} 
                            className="p-1.5 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" 
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(room.id)} 
                            className="p-1.5 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" 
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {confirmDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
              <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Room Listing</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Are you sure you want to delete this room listing? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setConfirmDelete(null)} 
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleDelete(confirmDelete)} 
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    disabled={refreshing}
                  >
                    {refreshing ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Room Detail Modal */}
          {detailRoom && (
            <div className="fixed inset-0 z-[110] flex">
              <div className="flex-1 bg-black/40" onClick={() => setDetailRoom(null)} />
              <div className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Room Details</h2>
                  <button onClick={() => setDetailRoom(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Room Title</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{detailRoom.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Monthly Rent</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">₹{detailRoom.rent}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Number of Beds</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailRoom.beds} bed{detailRoom.beds !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Location</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">📍 {detailRoom.location}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Available From</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{new Date(detailRoom.move_in_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact Information</p>
                    <div className="mt-1 space-y-1">
                      {detailRoom.contact_info?.email && (
                        <p className="text-gray-800 dark:text-gray-200">✉️ {detailRoom.contact_info.email}</p>
                      )}
                      {detailRoom.contact_info?.mobile && (
                        <p className="text-gray-800 dark:text-gray-200">📱 {detailRoom.contact_info.mobile}</p>
                      )}
                      {detailRoom.contact_info?.instagram && (
                        <p className="text-gray-800 dark:text-gray-200">📷 {detailRoom.contact_info.instagram}</p>
                      )}
                    </div>
                  </div>
                  {detailRoom.photos && detailRoom.photos.length > 0 && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Room Photos</p>
                      <div className="mt-2 space-y-2">
                        {detailRoom.photos.map((photo, index) => (
                          <img 
                            key={index}
                            src={photo} 
                            alt={`Room photo ${index + 1}`} 
                            className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Posted By</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">User ID: {detailRoom.user_id}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Listed on {new Date(detailRoom.created_at).toLocaleString()}</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    <button 
                      onClick={() => { handleDelete(detailRoom.id); setDetailRoom(null); }} 
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete Listing
                    </button>
                    <button 
                      onClick={() => setDetailRoom(null)} 
                      className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </AdminLayout>
    </AdminGuard>
  );
}