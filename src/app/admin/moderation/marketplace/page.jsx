"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCcw, Eye, Trash2, Tag, CheckCircle } from 'lucide-react';
import AdminGuard from "../../_components/AdminGuard";
import AdminLayout from "../../_components/AdminLayout";

/*
  Marketplace Moderation Page
  - Lists marketplace listings (title, category, price, seller, created date)
  - Filters: search (title), category, status (active/sold/removed), price range placeholder
  - Actions: view detail drawer, mark sold, delete/remove
  - Mock dataset; ready for backend integration pattern
*/

const mockListings = [
  { id: 'mp-1', title: 'Second-hand Calculus Textbook', category: 'Books', price: 350, seller: 'alice@uni.edu', status: 'active', description: 'Well kept, minimal highlighting. 7th Edition.', images: [], createdAt: new Date(Date.now()-86400_000).toISOString(), updatedAt: new Date(Date.now()-86000_000).toISOString() },
  { id: 'mp-2', title: 'Gaming Chair - Black/Red', category: 'Furniture', price: 4200, seller: 'bob@uni.edu', status: 'active', description: 'Adjustable armrests, slight wear on cushion.', images: [], createdAt: new Date(Date.now()-5400_000).toISOString(), updatedAt: new Date(Date.now()-5200_000).toISOString() },
  { id: 'mp-3', title: 'Used Bicycle (Hybrid)', category: 'Transport', price: 5500, seller: 'carol@uni.edu', status: 'sold', description: 'Good for campus commute, includes lock.', images: [], createdAt: new Date(Date.now()-4*86400_000).toISOString(), updatedAt: new Date(Date.now()-2*86400_000).toISOString() },
  { id: 'mp-4', title: 'Dorm Mini Fridge', category: 'Appliances', price: 2500, seller: 'dave@uni.edu', status: 'active', description: 'Works perfectly, energy efficient model.', images: [], createdAt: new Date(Date.now()-2*86400_000).toISOString(), updatedAt: new Date(Date.now()-86400_000).toISOString() },
];

const categories = ['All','Books','Furniture','Transport','Appliances'];

export default function MarketplaceModerationPage(){
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [detailItem, setDetailItem] = useState(null);

  const loadListings = async () => {
    setRefreshing(true);
    try { setItems(mockListings); } catch(e){ setItems(mockListings); }
    finally { setRefreshing(false); }
  };
  useEffect(()=>{ loadListings(); },[]);

  const filtered = useMemo(()=> items.filter(i => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || i.title.toLowerCase().includes(q);
    const matchesCategory = category === 'All' || i.category === category;
    const matchesStatus = status === 'all' || i.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  }), [items, search, category, status]);

  const markSold = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'sold', updatedAt: new Date().toISOString() } : i));
  };

  const deleteItem = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'removed', updatedAt: new Date().toISOString() } : i));
    setConfirmDelete(null);
  };

  const panelBg = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace Moderation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and manage user listings.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={()=>{ setRefreshing(true); loadListings(); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                {refreshing ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />} Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`p-4 rounded-xl border ${panelBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title" className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500" />
              </div>
              <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="sold">Sold</option>
                <option value="removed">Removed</option>
              </select>
              <div className="flex items-center gap-2">
                <input disabled placeholder="Min" className="w-1/2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 text-sm" />
                <input disabled placeholder="Max" className="w-1/2 px-3 py-2 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 text-sm" />
              </div>
              <div className="hidden md:block" />
            </div>
          </div>

          {/* List */}
          <div className={`rounded-xl border ${panelBg}`}>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Title</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Category</th>
                    <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell text-gray-700 dark:text-gray-200">Seller</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-200">Price</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell text-gray-700 dark:text-gray-200">Status</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700 dark:text-gray-200">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-500">No listings found.</td></tr>}
                  {filtered.map(i => (
                    <tr key={i.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 max-w-[260px]">
                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{i.title}</p>
                        <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">Created {new Date(i.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-700 dark:text-gray-200">{i.category}</td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-700 dark:text-gray-200">{i.seller}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-200">₹{i.price}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium
                          ${i.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-600/30 dark:text-blue-200'
                          : i.status === 'sold' ? 'bg-green-100 text-green-700 dark:bg-green-600/30 dark:text-green-200'
                          : 'bg-red-100 text-red-700 dark:bg-red-600/30 dark:text-red-200'}`}>{i.status}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={()=>setDetailItem(i)} className="p-1.5 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" title="View"><Eye className="w-4 h-4" /></button>
                          {i.status === 'active' && <button onClick={()=>markSold(i.id)} className="p-1.5 rounded-md text-green-600 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/30" title="Mark Sold"><CheckCircle className="w-4 h-4" /></button>}
                          {i.status !== 'removed' && <button onClick={()=>setConfirmDelete(i.id)} className="p-1.5 rounded-md text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30" title="Remove"><Trash2 className="w-4 h-4" /></button>}
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
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Remove Listing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This will mark the listing as removed. Continue?</p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button onClick={()=>setConfirmDelete(null)} className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button onClick={()=>deleteItem(confirmDelete)} className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-600 text-white hover:bg-red-700">Remove</button>
                </div>
              </div>
            </div>
          )}

          {detailItem && (
            <div className="fixed inset-0 z-[110] flex">
              <div className="flex-1 bg-black/40" onClick={()=>setDetailItem(null)} />
              <div className="w-full max-w-md h-full overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 p-6 shadow-xl">
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Listing Details</h2>
                  <button onClick={()=>setDetailItem(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">✕</button>
                </div>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Title</p>
                    <p className="mt-1 font-medium text-gray-900 dark:text-gray-100">{detailItem.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Category</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.category}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Price</p>
                      <p className="mt-1 text-gray-800 dark:text-gray-200">₹{detailItem.price}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Seller</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.seller}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200">{detailItem.status}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Description</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{detailItem.description}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">Created {new Date(detailItem.createdAt).toLocaleString()}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Updated {new Date(detailItem.updatedAt).toLocaleString()}</p>
                  </div>
                  <div className="pt-4 flex justify-end gap-2">
                    {detailItem.status === 'active' && <button onClick={()=>{ markSold(detailItem.id); setDetailItem(x=> x ? { ...x, status: 'sold' } : x); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700">Mark Sold</button>}
                    {detailItem.status !== 'removed' && <button onClick={()=>{ deleteItem(detailItem.id); setDetailItem(x=> x ? { ...x, status: 'removed' } : x); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700">Remove</button>}
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
