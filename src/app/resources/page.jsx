"use client";

import React, { useMemo, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Search, Link2, ExternalLink, Copy, Check, BookOpen, GraduationCap, Globe, Wrench, FileText, Video, Tag, Plus } from "lucide-react";

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'academics', label: 'Academics', icon: GraduationCap },
  { key: 'tools', label: 'Tools', icon: Wrench },
  { key: 'campus', label: 'Campus', icon: Globe },
  { key: 'docs', label: 'Docs', icon: FileText },
  { key: 'videos', label: 'Videos', icon: Video },
];

export default function ResourcesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState('browse'); // 'browse' | 'suggest'
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  const resources = useMemo(() => ([
    { id: 1, title: 'Academic Calendar', desc: 'Official academic schedule and holidays', category: 'academics', type: 'doc', url: 'https://university.edu/academic-calendar.pdf', tags: ['calendar','dates'] },
    { id: 2, title: 'CS101 Syllabus', desc: 'Course outline and grading policy', category: 'docs', type: 'pdf', url: '#', tags: ['cs','syllabus'] },
    { id: 3, title: 'Library Portal', desc: 'Search books, journals, and e-resources', category: 'campus', type: 'link', url: 'https://library.university.edu', tags: ['library','books'] },
    { id: 4, title: 'Discounted Software', desc: 'Student access to dev tools', category: 'tools', type: 'link', url: 'https://education.github.com/pack', tags: ['software','dev'] },
    { id: 5, title: 'Exam Prep Playlist', desc: 'Video lectures and tips', category: 'videos', type: 'video', url: 'https://youtube.com/playlist?list=123', tags: ['exam','prep'] },
  ]), []);

  const filtered = useMemo(() => resources.filter(r => {
    const q = query.trim().toLowerCase();
    const inText = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.tags?.some(t => t.toLowerCase().includes(q));
    const inCat = category === 'all' || r.category === category;
    return inText && inCat;
  }), [resources, query, category]);

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

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Resources</h1>
            <div className={`inline-flex p-1 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button type="button" onClick={() => setMode('browse')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='browse' ? 'bg-blue-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Browse</button>
              <button type="button" onClick={() => setMode('suggest')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='suggest' ? 'bg-emerald-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Suggest</button>
            </div>
          </div>

          {mode === 'browse' ? (
            <section className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search resources, tags, or descriptions" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ key, label, icon: Icon }) => (
                    <button key={key} type="button" onClick={() => setCategory(key)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${category===key ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-700')}`}>
                      {Icon && <Icon className="w-4 h-4" />} {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.length === 0 && (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No resources found.</div>
                )}
                {filtered.map((r) => (
                  <div key={r.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <BookOpen className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${titleClr}`}>{r.title}</div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-0.5`}>{r.desc}</div>
                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <Tag className="w-3 h-3" /> {r.category}
                          </span>
                          {r.tags?.slice(0,2).map((t) => (
                            <span key={t} className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>#{t}</span>
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
          ) : (
            <section className="mt-6">
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Title</label>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Scholarship Guide 2025" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Description</label>
                  <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Short description..." className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Category</label>
                  <select value={catNew} onChange={(e) => setCatNew(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                    {CATEGORIES.filter(c => c.key !== 'all').map(({ key, label }) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Type</label>
                  <select value={typeNew} onChange={(e) => setTypeNew(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                    <option value="link">Link</option>
                    <option value="pdf">PDF</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>{typeNew === 'link' ? 'URL' : 'Reference / URL'}</label>
                  <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={typeNew === 'link' ? 'https://...' : 'Link to reference or info'} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="button" className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium inline-flex items-center gap-1.5">
                    <Plus className="w-4 h-4" /> Submit resource
                  </button>
                  <button type="reset" onClick={() => { setTitle(''); setDesc(''); setCatNew('academics'); setTypeNew('link'); setUrl(''); }} className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Reset</button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
