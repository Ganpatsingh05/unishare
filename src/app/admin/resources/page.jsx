"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Tag, ExternalLink, Copy, Check, Pencil, Trash2, X, Save, Filter, AlertCircle } from 'lucide-react';
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";
import { getAllResources, getResourceCategories, createResource, updateResource, deleteResource, toggleResourceActive } from "../../lib/api/resources";



// Seeds (existing from pages)
const RESOURCE_SEED = [
  { id: 1, title: 'Academic Calendar', desc: 'Official academic schedule and holidays', category: 'academics', type: 'link', url: 'https://drive.google.com/file/d/example1', tags: ['calendar','dates'] },
  { id: 2, title: 'CS101 Syllabus', desc: 'Course outline and grading policy', category: 'docs', type: 'link', url: 'https://drive.google.com/file/d/example2', tags: ['cs','syllabus'] },
  { id: 3, title: 'Library Resources', desc: 'Digital library access and study materials', category: 'campus', type: 'link', url: 'https://drive.google.com/folder/d/example3', tags: ['library','books'] },
  { id: 4, title: 'Student Software Pack', desc: 'Essential software and tools for students', category: 'tools', type: 'link', url: 'https://drive.google.com/folder/d/example4', tags: ['software','tools'] },
  { id: 5, title: 'Campus Resources', desc: 'Maps, guides and campus information', category: 'campus', type: 'link', url: 'https://drive.google.com/folder/d/example5', tags: ['campus','guides'] },
];

const RESOURCE_CATEGORIES = [
  { key: 'academics', label: 'Academics' },
  { key: 'tools', label: 'Tools' },
  { key: 'campus', label: 'Campus' },
  { key: 'docs', label: 'Docs' },
  { key: 'media', label: 'Media' }
];

// Helper function to get appropriate icon for file type
const getTypeIcon = (type) => {
  // Since we only support drive links now, always return the link icon
  return <ExternalLink className="text-green-400" size={18}/>;
};

// Resources page
export default function AdminResourcesPage(){
  // Tab state
  const [activeTab, setActiveTab] = useState('resources'); // 'resources' | 'requested'
  
  const [allResources,setAllResources] = useState([]);

  // Shared UI state
  const [query,setQuery] = useState('');
  const [showFilters,setShowFilters] = useState(true);
  const [copied,setCopied] = useState(null);
  const [category,setCategory] = useState('all'); // resources category
  
  // API state
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [submitting,setSubmitting] = useState(false);

  // Modal state (announcements style)
  const [modalOpen,setModalOpen] = useState(false);
  const [editingItem,setEditingItem] = useState(null); // object + discriminator
  const [confirmDelete,setConfirmDelete] = useState(null); // resource id
  const [errors,setErrors] = useState([]);
  const [form,setForm] = useState({
    title:'', desc:'', category:'academics', type:'link', url:'', tags:'', active: true
  });

  // Load all resources from API on mount
  useEffect(() => {
    loadAllResources();
  }, []);

  const loadAllResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllResources();
      if (result.success) {
        setAllResources(result.resources || []);
      } else {
        throw new Error(result.message || 'Failed to load resources');
      }
    } catch (error) {
      console.error('Failed to load resources:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtering - separate active and inactive resources based on current tab
  const activeResources = useMemo(() => allResources.filter(r => r.active === true), [allResources]);
  const inactiveResources = useMemo(() => allResources.filter(r => r.active === false), [allResources]);

  const filteredResources = useMemo(()=> {
    const sourceResources = activeTab === 'resources' ? activeResources : inactiveResources;
    return sourceResources.filter(r=>{
      const q=query.trim().toLowerCase();
      const matchesQ = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.tags?.some(t=> t.toLowerCase().includes(q));
      const matchesCat = category==='all' || r.category===category;
      return matchesQ && matchesCat;
    });
  },[activeResources, inactiveResources, activeTab, query, category]);

  // For backwards compatibility, keep the old variable names
  const filteredRequestedResources = filteredResources;

  const openModal = (item=null) => {
    if(item) {
      setForm({ title:item.title, desc:item.desc, category:item.category, type:item.type, url:item.url, tags:item.tags?.join(', ')||'', active: item.active });
    }
    setErrors([]);
    setEditingItem(item);
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({ title:'', desc:'', category:'academics', type:'link', url:'', tags:'', active: true });
    setErrors([]);
  };

  const openCreate = () => {
    resetForm();
    setEditingItem(null);
    setModalOpen(true);
  };

  const validate = () => {
    const errs=[];
    if(!form.title.trim()) errs.push('Title required');
    if(!form.url.trim()) errs.push('URL required');
    if(!form.category) errs.push('Category required');
    return errs;
  };

  const save = async () => {
    const errs=validate(); setErrors(errs); if(errs.length) return;
    
    try {
      setSubmitting(true);
      setError(null);

      const resourceData = {
        title: form.title.trim(),
        desc: form.desc.trim(),
        category: form.category,
        type: form.type,
        url: form.url.trim(),
        tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean),
        active: Boolean(form.active)
      };

      let result;
      if(editingItem) {
        result = await updateResource(editingItem.id, resourceData);
      } else {
        result = await createResource(resourceData);
      }

      if (result.success) {
        await loadAllResources(); // Reload all resources from server
        setModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const askDelete = (id) => setConfirmDelete(id);
  const doDelete = async () => {
    if(confirmDelete){
      try {
        setError(null);
        
        const result = await deleteResource(confirmDelete);
        if (result.success) {
          await loadAllResources(); // Reload all resources from server
        }
        setConfirmDelete(null);
      } catch (error) {
        console.error('Failed to delete:', error);
        setError(error.message);
      }
    }
  };

  const handleCopy = async (val) => { try{ await navigator.clipboard.writeText(val); setCopied(val); setTimeout(()=> setCopied(null),1200);}catch{} };

  const handleToggleActive = async (resourceId) => {
    try {
      setError(null);
      const result = await toggleResourceActive(resourceId);
      if (result.success) {
        await loadAllResources(); // Reload all resources to show updated status
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to toggle resource status:', error);
      setError(error.message);
    }
  };

  const handleApprove = async (resourceId) => {
    try {
      setError(null);
      const result = await toggleResourceActive(resourceId);
      if (result.success) {
        await loadAllResources(); // reload all resources
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to activate resource:', error);
      setError(error.message);
    }
  };

  const handleDeleteRequest = async (resourceId) => {
    try {
      setError(null);
      const result = await deleteResource(resourceId);
      if (result.success) {
        await loadAllResources();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to delete resource:', error);
      setError(error.message);
    }
  };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Resources Management</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage shared resources. Active resources appear in Resources tab, inactive/requested resources in Requested tab.</p>
          {!process.env.NEXT_PUBLIC_BACKEND_URL && (
            <div className="mt-2 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
              Demo mode - Backend not configured
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={()=> setShowFilters(s=>!s)} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"><Filter size={14}/> {showFilters? 'Hide':'Show'} Filters</button>
          {activeTab === 'resources' && (
            <button onClick={openCreate} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Plus size={14}/> Add Resource</button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-gray-800 text-xs">
        <button onClick={()=> setActiveTab('resources')} className={`px-4 py-2 rounded-t-lg border flex items-center gap-2 ${activeTab==='resources'? 'bg-gray-950 border-gray-700 text-white':'border-transparent text-gray-400 hover:text-gray-200'}`}>
          Resources 
          <span className="px-2 py-0.5 rounded-full bg-green-600 text-white text-xs">{activeResources.length}</span>
        </button>
        <button onClick={()=> setActiveTab('requested')} className={`px-4 py-2 rounded-t-lg border flex items-center gap-2 ${activeTab==='requested'? 'bg-gray-950 border-gray-700 text-white':'border-transparent text-gray-400 hover:text-gray-200'}`}>
          Requested 
          <span className="px-2 py-0.5 rounded-full bg-yellow-600 text-white text-xs">{inactiveResources.length}</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>Error: {error}</span>
          <button 
            onClick={() => setError(null)} 
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {showFilters && (
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder={`Search ${activeTab}`} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 text-sm" />
          </div>
          <div className="md:col-span-3 flex flex-wrap gap-2 items-start">
            <button onClick={()=> setCategory('all')} className={`px-3 py-1.5 rounded-lg border text-xs ${category==='all'? 'bg-blue-600 border-blue-600 text-white':'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>All</button>
            {RESOURCE_CATEGORIES.map(c=> (
              <button key={c.key} onClick={()=> setCategory(c.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${category===c.key? 'bg-blue-600 border-blue-600 text-white':'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>{c.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Lists */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && (
          <div className="col-span-full text-center py-8 text-gray-400">
            Loading {activeTab}...
          </div>
        )}
        
        {/* Resources Tab */}
        {activeTab === 'resources' && !loading && filteredResources.length===0 && (
          <div className="col-span-full text-sm text-gray-400">No resources found.</div>
        )}
        
        {activeTab === 'resources' && !loading && filteredResources.map(r=> (
          <div key={r.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 relative group">
            {/* Status badge */}
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${r.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
              {r.active ? 'Active' : 'Inactive'}
            </div>
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <button onClick={()=> openModal(r)} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800"><Pencil size={14}/></button>
              <button onClick={()=> askDelete(r.id)} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900">{getTypeIcon(r.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white leading-tight">{r.title}</div>
                <div className="text-xs text-gray-400">{r.desc}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900 text-gray-300"><Tag size={12}/> {r.category}</span>
                  {r.tags?.slice(0,3).map(t=> <span key={t} className="px-2 py-0.5 rounded-full bg-gray-900 text-gray-400">#{t}</span> )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><ExternalLink size={12}/> Open</a>
                  <button onClick={()=> handleCopy(r.url)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900">{copied===r.url? <><Check size={12}/> Copied</>: <><Copy size={12}/> Copy</>}</button>
                  <button onClick={()=> handleToggleActive(r.id)} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${r.active ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                    {r.active ? <><X size={12}/> Deactivate</> : <><Check size={12}/> Activate</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Requested Resources Tab */}
        {activeTab === 'requested' && !loading && filteredRequestedResources.length===0 && (
          <div className="col-span-full text-sm text-gray-400">No requested resources found.</div>
        )}
        
        {activeTab === 'requested' && !loading && filteredRequestedResources.map(r=> (
          <div key={r.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 relative group">
            <div className="absolute top-2 right-2 flex gap-1">
              <div className={`px-2 py-1 rounded-md text-xs font-medium ${r.active ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                {r.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="flex items-start gap-3 mt-8">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900">{getTypeIcon('link')}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white leading-tight">{r.title}</div>
                <div className="text-xs text-gray-400">{r.desc}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900 text-gray-300"><Tag size={12}/> {r.category}</span>
                  {r.created_at && (
                    <span className="px-2 py-0.5 rounded-full bg-gray-900 text-gray-400">{new Date(r.created_at).toLocaleDateString()}</span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><ExternalLink size={12}/> View</a>
                  <button onClick={()=> handleCopy(r.url)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900">{copied===r.url? <><Check size={12}/> Copied</>: <><Copy size={12}/> Copy</>}</button>
                  {!r.active && (
                    <button onClick={()=> handleApprove(r.id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700"><Check size={12}/> Activate</button>
                  )}
                  <button onClick={()=> handleDeleteRequest(r.id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"><Trash2 size={12}/> Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=> { setModalOpen(false); resetForm(); setEditingItem(null); }} />
          <div className="relative w-full md:max-w-xl md:rounded-2xl border-t md:border border-gray-800 bg-gray-950 p-6 animate-slide-up-soft md:animate-dropdown-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editingItem? 'Edit Resource': 'New Resource'}</h2>
              <button onClick={()=> { setModalOpen(false); resetForm(); setEditingItem(null); }} className="text-gray-400 hover:text-gray-200"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Title</label>
                <input value={form.title} onChange={e=> setForm(f=> ({...f,title:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Title" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Description</label>
                <textarea value={form.desc} onChange={e=> setForm(f=> ({...f,desc:e.target.value}))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Short description" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Category</label>
                  <select value={form.category} onChange={e=> setForm(f=> ({...f,category:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">{RESOURCE_CATEGORIES.map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Type</label>
                  <select value={form.type} onChange={e=> setForm(f=> ({...f,type:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">
                    <option value="link">Drive Link</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Drive Link URL</label>
                <input value={form.url} onChange={e=> setForm(f=> ({...f,url:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="https://drive.google.com/..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Tags (comma separated)</label>
                <input value={form.tags} onChange={e=> setForm(f=> ({...f,tags:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="exam, prep" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Status</label>
                <div className="inline-flex rounded-lg border border-gray-800 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, active: true }))}
                    className={`px-3 py-1.5 text-xs ${form.active ? 'bg-green-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, active: false }))}
                    className={`px-3 py-1.5 text-xs border-l border-gray-800 ${!form.active ? 'bg-yellow-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-gray-800'}`}
                  >
                    Inactive
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-gray-500">Inactive resources appear under the Requested tab until activated.</p>
              </div>
              {errors.length>0 && (
                <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 -mt-2">
                  <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">{errors.map(er=> <li key={er}>{er}</li>)}</ul>
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={()=> { setModalOpen(false); resetForm(); setEditingItem(null); }} className="px-4 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
                <button 
                  onClick={save} 
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs"
                >
                  <Save size={14}/> 
                  {submitting ? 'Saving...' : (editingItem? 'Save Changes': 'Create Resource')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={()=> setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-5 z-[61]">
            <h3 className="text-sm font-semibold text-white">Delete Resource</h3>
            <p className="text-xs text-gray-400 mt-1">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={()=> setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
              <button onClick={doDelete} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
      </AdminLayout>
    </AdminGuard>
  );
}
