"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUI } from "../lib/contexts/UniShareContext";
import Footer from "../_components/Footer";
import { Search, Link2, ExternalLink, Copy, Check, BookOpen, GraduationCap, Globe, Wrench, FileText, Video, Tag, Plus, X } from "lucide-react";
import { getResources, getResourceCategories, submitResourceSuggestion } from "../lib/api/resources";

const DEFAULT_CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'academics', label: 'Academics', icon: GraduationCap },
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'campus', label: 'Campus', icon: Globe },
  { key: 'docs', label: 'Docs', icon: FileText },
  { key: 'media', label: 'Media', icon: Video },
];

export default function ResourcesPage() {
  const {darkMode} = useUI();
  const [mode, setMode] = useState('browse'); // browse mode retained for potential future use
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // API state
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  // Load resources and categories from API
  useEffect(() => {
    loadResources();
    loadCategories();
  }, []);

      const loadResources = async () => {
        try {
          setLoading(true);
          setError(null);
          const result = await getResources(category !== 'all' ? category : null);
          if (result.success) {
            const resourcesData = result.data || result.resources || [];
            // Ensure each resource has an id
            const resourcesWithIds = resourcesData.map((r, index) => ({
              ...r,
              id: r.id || `resource-${index}`
            }));
            setResources(resourcesWithIds);
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

  const loadCategories = async () => {
    try {
      const result = await getResourceCategories();
      if (result.success && result.categories?.length > 0) {
        const categoriesData = result.data || result.categories || [];
        
        // Add 'All' option to the beginning
        const categoriesWithAll = [
          { key: 'all', label: 'All' },
          ...categoriesData.map((cat, index) => ({
            key: typeof cat === 'string' ? cat : (cat.key || cat),
            label: typeof cat === 'string' ? cat : (cat.label || cat),
            icon: getCategoryIcon(typeof cat === 'string' ? cat : (cat.key || cat))
          }))
        ];
        setCategories(categoriesWithAll);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Keep default categories if API fails
    }
  };

  // Helper function to get appropriate icon for category
  const getCategoryIcon = (categoryKey) => {
    const iconMap = {
      academics: GraduationCap,
      tools: Wrench,
      campus: Globe,
      docs: FileText,
      media: Video
    };
    return iconMap[categoryKey] || FileText;
  };

  // Helper function to get appropriate icon for resource type
  const getTypeIcon = (type) => {
    switch(type) {
      case 'pdf': return <FileText className={darkMode ? 'text-red-400' : 'text-red-500'} size={18}/>;
      case 'image': return <Video className={darkMode ? 'text-blue-400' : 'text-blue-500'} size={18}/>;
      case 'doc': return <FileText className={darkMode ? 'text-blue-400' : 'text-blue-500'} size={18}/>;
      case 'link': return <ExternalLink className={darkMode ? 'text-green-400' : 'text-green-500'} size={18}/>;
      default: return <BookOpen className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18}/>;
    }
  };

  // Reload resources when category changes
  useEffect(() => {
    if (category !== 'all') {
      setLoading(true); // Show loading when changing categories
    }
    loadResources();
  }, [category]);

  const filtered = useMemo(() => resources.filter(r => {
    const q = query.trim().toLowerCase();
    if (!q) return true; // No text filter, show all resources (category filtering handled by API)
    
    return r.title.toLowerCase().includes(q) || 
           r.desc.toLowerCase().includes(q) || 
           r.tags?.some(t => t.toLowerCase().includes(q));
  }), [resources, query]);

  const handleCopy = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      // noop
    }
  };

  // Suggest resource form state
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [catNew, setCatNew] = useState("academics");
  const [typeNew, setTypeNew] = useState("link");
  const [url, setUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
   

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Resources</h1>
            <button type="button" onClick={() => setDrawerOpen(true)} className="px-3 py-2 rounded-lg text-sm bg-emerald-600 text-white hover:bg-emerald-700 inline-flex items-center gap-2"><Plus className="w-4 h-4"/> Suggest Resource</button>
          </div>

          {mode === 'browse' && (
            <section className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources, tags, or descriptions" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(({ key, label, icon: Icon }) => (
                    <button key={key} type="button" onClick={() => setCategory(key)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${category===key ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-700')}`}>
                      {Icon && <Icon className="w-4 h-4" />} {label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  Error loading resources: {error}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loading && (
                  <div className={`col-span-full text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loading resources...
                  </div>
                )}
                
                {!loading && filtered.length === 0 && (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No resources found.</div>
                )}
                
                {!loading && filtered.map((r) => (
                  <div key={r.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {getTypeIcon(r.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${titleClr}`}>{r.title}</div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-0.5`}>{r.desc}</div>
                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <Tag className="w-3 h-3" /> {r.category}
                          </span>
                          {r.tags?.slice(0,2).map((t, index) => (
                            <span key={`${r.id || 'unknown'}-tag-${index}-${t}`} className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>#{t}</span>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <a href={r.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                            <ExternalLink className="w-3 h-3" /> Open
                          </a>
                          <button type="button" onClick={() => handleCopy(r.id, r.url)} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                            {copiedId === r.id ? (<><Check className="w-3 h-3" /> Copied</>) : (<><Copy className="w-3 h-3" /> Copy link</>)}
                          </button>
                          {r.type === 'link' && (
                            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} inline-flex items-center gap-1 text-xs`}><Link2 className="w-3 h-3" /> Link</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} />

      {drawerOpen && (
        <div className="fixed inset-0 z-[120] flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-md h-full bg-gray-950 border-l border-gray-900 flex flex-col">
            <div className="p-4 border-b border-gray-900 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Suggest Resource</h2>
              <button onClick={()=> setDrawerOpen(false)} className="p-1.5 rounded-md hover:bg-gray-900 text-gray-400"><X className="w-4 h-4"/></button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="space-y-1.5">
                <label className={`text-[11px] uppercase tracking-wide font-medium ${labelClr}`}>Title</label>
                <input value={title} onChange={e=> setTitle(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBg}`} placeholder="e.g., Scholarship Guide 2025" />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] uppercase tracking-wide font-medium ${labelClr}`}>Description</label>
                <textarea value={desc} onChange={e=> setDesc(e.target.value)} rows={3} className={`w-full px-3 py-2 rounded-lg border ${inputBg}`} placeholder="Short description..." />
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] uppercase tracking-wide font-medium ${labelClr}`}>Category</label>
                <select value={catNew} onChange={e=> setCatNew(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBg}`}>
                  {categories.filter(c=> c.key!=='all').map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] uppercase tracking-wide font-medium ${labelClr}`}>Type</label>
                <select value={typeNew} onChange={e=> setTypeNew(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBg}`}>
                  <option value="link">Drive Link</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className={`text-[11px] uppercase tracking-wide font-medium ${labelClr}`}>{typeNew==='link' ? 'URL' : 'Reference / URL'}</label>
                <input value={url} onChange={e=> setUrl(e.target.value)} className={`w-full px-3 py-2 rounded-lg border ${inputBg}`} placeholder={typeNew==='link'? 'https://...' : 'Reference link'} />
              </div>
              {submitError && (
                <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 text-xs text-red-300">
                  {submitError}
                </div>
              )}
              {submitSuccess && (
                <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                  {submitSuccess}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-900 flex items-center justify-between gap-3">
              <button onClick={()=> setDrawerOpen(false)} className="px-4 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
              <button
                disabled={submitting}
                onClick={async ()=> {
                  setSubmitError(null); setSubmitSuccess(null);
                  // Basic client-side validation
                  const errors = [];
                  if (!title.trim()) errors.push('Title is required');
                  if (!url.trim()) errors.push('URL is required');
                  if (!catNew) errors.push('Category is required');
                  if (errors.length) { setSubmitError(errors.join(', ')); return; }

                  try {
                    setSubmitting(true);
                    const res = await submitResourceSuggestion({ title: title.trim(), desc: desc.trim(), category: catNew, type: typeNew, url: url.trim() });
                    if (res.success) {
                      setSubmitSuccess(res.message || 'Suggestion submitted successfully');
                      // Reset fields after short delay
                      setTimeout(() => {
                        setDrawerOpen(false);
                        setTitle(''); setDesc(''); setUrl(''); setCatNew('academics'); setTypeNew('link');
                        setSubmitSuccess(null);
                      }, 800);
                    } else {
                      setSubmitError((res.errors && res.errors[0]) || 'Failed to submit suggestion');
                    }
                  } catch (e) {
                    setSubmitError(e.message || 'Failed to submit suggestion');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${submitting ? 'bg-emerald-700/60' : 'bg-emerald-600 hover:bg-emerald-700'} text-white text-xs disabled:opacity-60`}
              >
                <Plus className="w-4 h-4"/> {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
