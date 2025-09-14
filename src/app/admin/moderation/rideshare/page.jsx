"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, Eye, Trash2 } from 'lucide-react';
import AdminGuard from "../../_components/AdminGuard";
import AdminLayout from "../../_components/AdminLayout";

/*
  Rideshare Moderation Page
  - Lists ride offers with origin, destination, date/time, seats, price
  - Filters: date (upcoming/past/all), search (from/to)
  - Actions: view details drawer, delete (mock)
  - Mock dataset; ready for backend integration
*/

const mockRides = [
  { id: 'ride-1', from: 'Campus Gate', to: 'City Center', date: new Date(Date.now()+86400_000).toISOString(), time: '10:30', seats: 3, price: 150, owner: 'alice@uni.edu', vehicle: 'Maruti Swift (Blue)', contact: '+91 98765 43210', notes: 'Can drop near museum if needed.', createdAt: new Date(Date.now()-7200_000).toISOString(), updatedAt: new Date(Date.now()-3600_000).toISOString() },
  { id: 'ride-2', from: 'Hostel A', to: 'Airport', date: new Date(Date.now()+2*86400_000).toISOString(), time: '06:00', seats: 1, price: 500, owner: 'bob@uni.edu', vehicle: 'Hyundai i20 (White)', contact: '+91 91234 56780', notes: 'Early morning departure. Be on time.', createdAt: new Date(Date.now()-5400_000).toISOString(), updatedAt: new Date(Date.now()-5300_000).toISOString() },
  { id: 'ride-3', from: 'Library', to: 'Mall', date: new Date(Date.now()-86400_000).toISOString(), time: '13:15', seats: 0, price: 80, owner: 'carol@uni.edu', vehicle: 'Activa 5G (Black)', contact: '+91 90000 11111', notes: 'Return trip not available.', createdAt: new Date(Date.now()-200000_000).toISOString(), updatedAt: new Date(Date.now()-100000_000).toISOString() },
  { id: 'ride-4', from: 'Campus Gate', to: 'Metro Station', date: new Date(Date.now()+5*86400_000).toISOString(), time: '09:00', seats: 2, price: 60, owner: 'dave@uni.edu', vehicle: 'Kia Sonet (Red)', contact: '+91 95555 22222', notes: 'Will wait max 5 mins.', createdAt: new Date(Date.now()-86400_000).toISOString(), updatedAt: new Date(Date.now()-80000_000).toISOString() }
];

export default function RideshareModerationPage() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('upcoming'); // upcoming | past | all
  const [refreshing, setRefreshing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailRide, setDetailRide] = useState(null);

  const loadRides = async () => {
    setRefreshing(true);
    try {
      setRides(mockRides);
    } catch (e) {
      setRides(mockRides);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { loadRides(); }, []);

  const filtered = useMemo(() => rides.filter(r => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || r.from.toLowerCase().includes(q) || r.to.toLowerCase().includes(q);
    const now = Date.now();
    const rideDate = new Date(r.date).getTime();
    const matchesDate = dateFilter === 'all' || (dateFilter === 'upcoming' ? rideDate >= now : rideDate < now);
    return matchesSearch && matchesDate;
  }), [rides, search, dateFilter]);

  const deleteRide = (id) => {
    setRides(prev => prev.filter(r => r.id !== id));
    setConfirmDelete(null);
  };

  const panelBg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rideshare Moderation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage ride postings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => { setRefreshing(true); loadRides(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {refreshing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search from / to" className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
              </div>
              <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="all">All Dates</option>
              </select>
              <div className="hidden md:block" />
            </div>
          </div>

          {/* List */}
          <div className={`rounded-xl border ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Route</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Date</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Time</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell text-gray-700 dark:text-gray-200">Owner</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Seats</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Price</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-gray-500">No rides found.</td></tr>
                  )}
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 w-[30%]">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{r.from} → {r.to}</p>
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">Created {new Date(r.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">{new Date(r.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">{r.time}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-700 dark:text-gray-200">{r.owner}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-600/30 dark:text-blue-200">{r.seats}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-600/30 dark:text-purple-200">₹{r.price}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={()=>setDetailRide(r)} className="p-1.5 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" title="View"><Eye className="w-4 h-4" /></button>
                          <button onClick={()=>setConfirmDelete(r.id)} className="p-1.5 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {confirmDelete && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={()=>setConfirmDelete(null)} />
              <div className="relative w-full max-w-sm rounded-xl border p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-2xl">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Delete Ride</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Are you sure you want to delete this ride? This action cannot be undone.</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={()=>setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button onClick={()=>deleteRide(confirmDelete)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700">Delete</button>
                </div>
              </div>
            </div>
          )}

          {detailRide && (
            <div className="fixed inset-0 z-[110] flex">
              <div className="flex-1 bg-black/40" onClick={()=>setDetailRide(null)} />
              <div className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ride Details</h2>
                  <button onClick={()=>setDetailRide(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Route</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{detailRide.from} → {detailRide.to}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Date</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{new Date(detailRide.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Time</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailRide.time}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Seats</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailRide.seats}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Price</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">₹{detailRide.price}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Vehicle</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailRide.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailRide.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Notes</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{detailRide.notes || '—'}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Created {new Date(detailRide.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Updated {new Date(detailRide.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <button onClick={()=>setDetailRide(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Close</button>
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
