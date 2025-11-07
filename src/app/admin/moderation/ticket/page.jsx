"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, RefreshCcw, Eye, Trash2, CheckCircle, AlertTriangle } from "lucide-react";
import AdminGuard from "../../_components/AdminGuard";
import AdminLayout from "../../_components/AdminLayout";
import { fetchTickets, deleteTicket } from "./../../../lib/api/tickets";

/*
  Tickets Moderation Page
  - Lists event tickets (title/event, type, price, seller, remaining, date)
  - Filters: search (title), type, status (active/soldout/removed), date (upcoming/past)
  - Actions: mark sold out, remove, view details drawer
  - Mock dataset for now
*/

const mockTickets = [
  { id: 't-1', title: 'Tech Fest Pass', type: 'Event', price: 800, seller: 'alice@uni.edu', status: 'active', remaining: 5, total: 10, date: new Date(Date.now()+3*86400_000).toISOString(), description: 'Full access to all tech fest events.', createdAt: new Date(Date.now()-86400_000).toISOString(), updatedAt: new Date(Date.now()-86000_000).toISOString() },
  { id: 't-2', title: 'Music Night Ticket', type: 'Concert', price: 500, seller: 'bob@uni.edu', status: 'active', remaining: 1, total: 1, date: new Date(Date.now()+86400_000).toISOString(), description: 'Single general admission.', createdAt: new Date(Date.now()-3400_000).toISOString(), updatedAt: new Date(Date.now()-3200_000).toISOString() },
  { id: 't-3', title: 'Cricket Match Pass', type: 'Sports', price: 1200, seller: 'carol@uni.edu', status: 'soldout', remaining: 0, total: 4, date: new Date(Date.now()+5*86400_000).toISOString(), description: 'Good seating location.', createdAt: new Date(Date.now()-4*86400_000).toISOString(), updatedAt: new Date(Date.now()-3*86400_000).toISOString() },
  { id: 't-4', title: 'Drama Society Play', type: 'Theatre', price: 300, seller: 'dave@uni.edu', status: 'active', remaining: 8, total: 12, date: new Date(Date.now()-86400_000).toISOString(), description: 'Student production, one evening only.', createdAt: new Date(Date.now()-2*86400_000).toISOString(), updatedAt: new Date(Date.now()-86400_000).toISOString() }
];

const types = ['All','Event','Concert','Sports','Theatre'];

export default function TicketsModerationPage(){
  const [tickets, setTickets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [status, setStatus] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming'); // upcoming | past | all
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickets = async () => {
    setRefreshing(true);
    setError(null);
    try {
      const result = await fetchTickets();
      if (result.data && Array.isArray(result.data)) {
        setTickets(result.data.map(ticket => ({
          id: ticket.id,
          title: ticket.title,
          price: ticket.price,
          category: ticket.category,
          event_type: ticket.event_type,
          event_date: ticket.event_date,
          venue: ticket.venue,
          location: ticket.location,
          quantity_available: ticket.quantity_available,
          ticket_type: ticket.ticket_type,
          description: ticket.description,
          contact_info: ticket.contact_info,
          image_url: ticket.image_url,
          users: ticket.users,
          user_id: ticket.user_id,
          status: ticket.status || 'active',
          createdAt: ticket.created_at,
          updatedAt: ticket.updated_at || ticket.created_at,
          // Legacy fields for backward compatibility
          type: ticket.event_type || ticket.category || 'Event',
          seller: ticket.contact_info?.email || ticket.users?.email || 'Unknown User',
          sellerName: ticket.users?.name || 'Anonymous',
          remaining: ticket.quantity_available || 0,
          total: ticket.quantity_available || 1,
          date: ticket.event_date
        })));
      } else {
        // Fallback to mock data if API fails
        setTickets(mockTickets);
      }
    } catch (error) {
      console.error('Failed to load tickets:', error);
      setError(error.message);
      // Fallback to mock data on error
      setTickets(mockTickets);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };
  useEffect(()=>{ loadTickets(); },[]);

  const handleDelete = async (ticketId) => {
    try {
      setRefreshing(true);
      await deleteTicket(ticketId);
      await loadTickets(); // Refresh the list
      setConfirmDelete(null);
    } catch (error) {
      console.error('Failed to delete ticket:', error);
      setError(`Failed to delete ticket: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const filtered = useMemo(()=> tickets.filter(t => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || t.title.toLowerCase().includes(q);
    const matchesType = typeFilter === 'All' || t.type === typeFilter;
    const matchesStatus = status === 'all' || t.status === status;
    const now = Date.now();
    const ticketDate = new Date(t.date).getTime();
    const matchesDate = dateFilter === 'all' || (dateFilter === 'upcoming' ? ticketDate >= now : ticketDate < now);
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  }), [tickets, search, typeFilter, status, dateFilter]);

  const markSoldOut = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'soldout', remaining: 0, updatedAt: new Date().toISOString() } : t));
  };

  // removeTicket function removed - now using handleDelete with API call

  const panelBg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets Moderation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage ticket listings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>{ setRefreshing(true); loadTickets(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {refreshing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title" className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
              </div>
              <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                {types.map(t => <option key={t}>{t}</option>)}
              </select>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="soldout">Sold Out</option>
                <option value="removed">Removed</option>
              </select>
              <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="all">All Dates</option>
              </select>
              <div className="flex items-center gap-2">
                <input disabled placeholder="Min ₹" className="w-1/2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 text-sm" />
                <input disabled placeholder="Max ₹" className="w-1/2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 text-sm" />
              </div>
              <div className="hidden md:block" />
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
              <p className="text-gray-500">Loading ticket listings...</p>
            </div>
          )}

          {/* List */}
          <div className={`rounded-xl border ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Event Details</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Venue & Date</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell text-gray-700 dark:text-gray-200">Seller</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Price</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Available</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-500">No tickets found.</td></tr>}
                  {filtered.map(t => (
                    <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 max-w-[280px]">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{t.title}</p>
                          <div className="text-xs mt-1 space-y-0.5">
                            <p className="text-gray-600 dark:text-gray-400">
                              {t.category && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200 mr-1">{t.category}</span>}
                              {t.event_type && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200">{t.event_type}</span>}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">ID: {t.user_id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div>
                          {t.venue && <p className="font-medium truncate max-w-[120px]" title={t.venue}>{t.venue}</p>}
                          {t.location && <p className="text-gray-500 truncate max-w-[120px]" title={t.location}>{t.location}</p>}
                          {t.event_date && <p className="text-gray-600 dark:text-gray-400">{new Date(t.event_date).toLocaleDateString()}</p>}
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-700 dark:text-gray-200">
                        <div>
                          <p className="font-medium">{t.users?.name || 'Anonymous'}</p>
                          <p className="text-gray-500">{t.contact_info?.email || t.contact_info?.phone || 'No contact'}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-200">₹{t.price}</span>
                        {t.ticket_type && <p className="text-xs text-gray-500 mt-0.5">{t.ticket_type}</p>}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-600/30 dark:text-indigo-200">{t.quantity_available || 0}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                          ${t.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-600/30 dark:text-green-200'
                          : t.status === 'soldout' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-600/30 dark:text-yellow-200'
                          : 'bg-red-100 text-red-700 dark:bg-red-600/30 dark:text-red-200'}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={()=>setDetailItem(t)} className="p-1.5 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" title="View"><Eye className="w-4 h-4" /></button>
                          {t.status === 'active' && <button onClick={()=>markSoldOut(t.id)} className="p-1.5 rounded-md text-yellow-600 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-yellow-900/30" title="Mark Sold Out"><CheckCircle className="w-4 h-4" /></button>}
                          {t.status !== 'removed' && <button onClick={()=>setConfirmDelete(t.id)} className="p-1.5 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Remove"><Trash2 className="w-4 h-4" /></button>}
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
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Remove Ticket</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This will mark the ticket as removed. Continue?</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={()=>setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button 
                    onClick={() => handleDelete(confirmDelete)} 
                    disabled={refreshing}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {refreshing ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {detailItem && (
            <div className="fixed inset-0 z-[110] flex">
              <div className="flex-1 bg-black/40" onClick={()=>setDetailItem(null)} />
              <div className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ticket Details</h2>
                  <button onClick={()=>setDetailItem(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Event Title</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{detailItem.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.category}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Event Type</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.event_type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Price</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">₹{detailItem.price}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Ticket Type</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.ticket_type || 'General'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Available Quantity</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.quantity_available}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</p>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          detailItem.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          detailItem.status === 'soldout' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {detailItem.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Venue</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.venue}</p>
                    {detailItem.location && <p className="text-xs text-gray-500 mt-0.5">📍 {detailItem.location}</p>}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Event Date</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{new Date(detailItem.event_date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Contact Information</p>
                    <div className="mt-1 space-y-1">
                      {detailItem.contact_info?.phone && (
                        <p className="text-gray-800 dark:text-gray-200">📞 {detailItem.contact_info.phone}</p>
                      )}
                      {detailItem.contact_info?.mobile && (
                        <p className="text-gray-800 dark:text-gray-200">📱 {detailItem.contact_info.mobile}</p>
                      )}
                      {detailItem.contact_info?.email && (
                        <p className="text-gray-800 dark:text-gray-200">✉️ {detailItem.contact_info.email}</p>
                      )}
                      {detailItem.contact_info?.instagram && (
                        <p className="text-gray-800 dark:text-gray-200">📷 {detailItem.contact_info.instagram}</p>
                      )}
                      {detailItem.contact_info?.link && (
                        <p className="text-gray-800 dark:text-gray-200">🔗 <a href={detailItem.contact_info.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{detailItem.contact_info.link}</a></p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Description</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{detailItem.description}</p>
                  </div>
                  {detailItem.image_url && (
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Event Image</p>
                      <div className="mt-2">
                        <img 
                          src={detailItem.image_url} 
                          alt="Event" 
                          className="w-full max-w-sm rounded-lg border border-gray-200 dark:border-gray-700"
                          onError={(e) => { e.target.style.display = 'none' }}
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Posted By</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.users?.name || 'Anonymous'} (ID: {detailItem.user_id})</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Created {new Date(detailItem.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Updated {new Date(detailItem.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    {detailItem.status === 'active' && <button onClick={()=>{ markSoldOut(detailItem.id); setDetailItem(x=> x ? { ...x, status: 'soldout', remaining: 0 } : x); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-yellow-500 text-white hover:bg-yellow-600">Mark Sold Out</button>}
                    {detailItem.status !== 'removed' && <button onClick={()=>{ handleDelete(detailItem.id); setDetailItem(null); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700">Remove</button>}
                    <button onClick={()=>setDetailItem(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Close</button>
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
