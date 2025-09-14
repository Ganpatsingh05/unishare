"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Tag, ExternalLink, Copy, Check, Pencil, Trash2, X, Save, Filter, BookOpen, NotebookPen } from 'lucide-react';
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";

// Storage keys
const RESOURCES_KEY = 'resourcesDirectory';
const NOTES_KEY = 'notesDirectory';

// Seeds (existing from pages)
const RESOURCE_SEED = [
  { id: 1, title: 'Academic Calendar', desc: 'Official academic schedule and holidays', category: 'academics', type: 'doc', url: 'https://university.edu/academic-calendar.pdf', tags: ['calendar','dates'] },
  { id: 2, title: 'CS101 Syllabus', desc: 'Course outline and grading policy', category: 'docs', type: 'pdf', url: '#', tags: ['cs','syllabus'] },
  { id: 3, title: 'Library Portal', desc: 'Search books, journals, and e-resources', category: 'campus', type: 'link', url: 'https://library.university.edu', tags: ['library','books'] },
  { id: 4, title: 'Discounted Software', desc: 'Student access to dev tools', category: 'tools', type: 'link', url: 'https://education.github.com/pack', tags: ['software','dev'] },
  { id: 5, title: 'Exam Prep Playlist', desc: 'Video lectures and tips', category: 'videos', type: 'video', url: 'https://youtube.com/playlist?list=123', tags: ['exam','prep'] },
];

const NOTES_SEED = [
  { id:1, title:'DSA Cheatsheet', course:'CS101', semester:'1', type:'pdf', url:'#', tags:['dsa','algorithms'], desc:'Quick reference for core DSA concepts' },
  { id:2, title:'Operating Systems Summary', course:'CS202', semester:'3', type:'doc', url:'#', tags:['os','summary'], desc:'Important OS topics condensed'},
  { id:3, title:'Math Formulas Pack', course:'MTH110', semester:'1', type:'pdf', url:'#', tags:['math','formulas'], desc:'Common calculus & algebra formulas'}
];

const RESOURCE_CATEGORIES = [
  { key: 'academics', label: 'Academics' },
  { key: 'tools', label: 'Tools' },
  { key: 'campus', label: 'Campus' },
  { key: 'docs', label: 'Docs' },
  { key: 'videos', label: 'Videos' }
];

const NOTE_TYPES = ['pdf','doc','link','other'];

// Unified page
export default function AdminResourcesAndNotesPage(){
  const [activeTab, setActiveTab] = useState('resources'); // 'resources' | 'notes'
  const [resources,setResources] = useState([]);
  const [notes,setNotes] = useState([]);

  // Shared UI state
  const [query,setQuery] = useState('');
  const [showFilters,setShowFilters] = useState(true);
  const [copied,setCopied] = useState(null);
  const [category,setCategory] = useState('all'); // resources category
  const [noteCourse,setNoteCourse] = useState('all');
  const [noteSemester,setNoteSemester] = useState('all');
  const [noteType,setNoteType] = useState('all');

  // Modal state (announcements style)
  const [modalOpen,setModalOpen] = useState(false);
  const [editingItem,setEditingItem] = useState(null); // object + discriminator
  const [confirmDelete,setConfirmDelete] = useState(null); // { id, kind }
  const [errors,setErrors] = useState([]);
  const [form,setForm] = useState({
    // For resources
    title:'', desc:'', category:'academics', type:'link', url:'', tags:'',
    // For notes-specific
    course:'', semester:'', noteType:'pdf'
  });

  // Load existing localStorage on mount
  useEffect(()=>{
    try {
      const rRaw = localStorage.getItem(RESOURCES_KEY);
      if(rRaw){ const parsed = JSON.parse(rRaw); if(Array.isArray(parsed)&&parsed.length) setResources(parsed); else { setResources(RESOURCE_SEED); localStorage.setItem(RESOURCES_KEY, JSON.stringify(RESOURCE_SEED)); } }
      else { setResources(RESOURCE_SEED); localStorage.setItem(RESOURCES_KEY, JSON.stringify(RESOURCE_SEED)); }
    } catch { setResources(RESOURCE_SEED); }
    try {
      const nRaw = localStorage.getItem(NOTES_KEY);
      if(nRaw){ const parsed = JSON.parse(nRaw); if(Array.isArray(parsed)&&parsed.length) setNotes(parsed); else { setNotes(NOTES_SEED); localStorage.setItem(NOTES_KEY, JSON.stringify(NOTES_SEED)); } }
      else { setNotes(NOTES_SEED); localStorage.setItem(NOTES_KEY, JSON.stringify(NOTES_SEED)); }
    } catch { setNotes(NOTES_SEED); }
  },[]);

  useEffect(()=>{ localStorage.setItem(RESOURCES_KEY, JSON.stringify(resources)); },[resources]);
  useEffect(()=>{ localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); },[notes]);

  // Derived sets
  const noteCourses = useMemo(()=> Array.from(new Set(notes.map(n=> n.course))).sort(), [notes]);
  const noteSemesters = useMemo(()=> Array.from(new Set(notes.map(n=> n.semester))).sort((a,b)=> Number(a)-Number(b)), [notes]);

  // Filtering
  const filteredResources = useMemo(()=> resources.filter(r=>{
    const q=query.trim().toLowerCase();
    const matchesQ = !q || r.title.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q) || r.tags?.some(t=> t.toLowerCase().includes(q));
    const matchesCat = category==='all' || r.category===category;
    return matchesQ && matchesCat;
  }),[resources,query,category]);

  const filteredNotes = useMemo(()=> notes.filter(n=>{
    const q=query.trim().toLowerCase();
    const inQ = !q || n.title.toLowerCase().includes(q) || n.course.toLowerCase().includes(q) || n.tags?.some(t=> t.toLowerCase().includes(q));
    const inCourse = noteCourse==='all' || n.course===noteCourse;
    const inSem = noteSemester==='all' || n.semester===noteSemester;
    const inType = noteType==='all' || n.type===noteType;
    return inQ && inCourse && inSem && inType;
  }),[notes,query,noteCourse,noteSemester,noteType]);

  const openCreate = () => {
    resetForm();
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEdit = (item, kind) => {
    // kind: 'resource' | 'note'
    if(kind==='resource'){
      setForm({ title:item.title, desc:item.desc, category:item.category, type:item.type, url:item.url, tags:item.tags?.join(', ')||'', course:'', semester:'', noteType:'pdf' });
    } else {
      setForm({ title:item.title, desc:item.desc||'', category:'academics', type:'link', url:item.url, tags:item.tags?.join(', ')||'', course:item.course, semester:item.semester, noteType:item.type });
    }
    setErrors([]);
    setEditingItem({ id:item.id, kind });
    setModalOpen(true);
  };

  const resetForm = () => {
    setForm({ title:'', desc:'', category:'academics', type:'link', url:'', tags:'', course:'', semester:'', noteType:'pdf' });
    setErrors([]);
  };

  const validate = () => {
    const errs=[];
    if(!form.title.trim()) errs.push('Title required');
    if(!form.url.trim()) errs.push('URL required');
    if(activeTab==='resources'){
      if(!form.category) errs.push('Category required');
    } else {
      if(!form.course.trim()) errs.push('Course code required');
      if(!form.semester.trim()) errs.push('Semester required');
    }
    return errs;
  };

  const save = () => {
    const errs=validate(); setErrors(errs); if(errs.length) return;
    if(activeTab==='resources'){
      const next = { id: editingItem? editingItem.id : Math.max(0,...resources.map(r=>r.id))+1, title:form.title.trim(), desc:form.desc.trim(), category:form.category, type:form.type, url:form.url.trim(), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      if(editingItem){ setResources(prev=> prev.map(r=> r.id===editingItem.id? next: r)); }
      else { setResources(prev=> [next,...prev]); }
    } else {
      const next = { id: editingItem? editingItem.id : Math.max(0,...notes.map(n=>n.id))+1, title:form.title.trim(), course:form.course.trim(), semester:form.semester.trim(), type:form.noteType, url:form.url.trim(), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean), desc: form.desc.trim() };
      if(editingItem){ setNotes(prev=> prev.map(n=> n.id===editingItem.id? next: n)); }
      else { setNotes(prev=> [next,...prev]); }
    }
    setModalOpen(false); resetForm();
  };

  const askDelete = (id, kind) => setConfirmDelete({ id, kind });
  const doDelete = () => {
    if(confirmDelete){
      if(confirmDelete.kind==='resource') setResources(prev=> prev.filter(r=> r.id!==confirmDelete.id));
      else setNotes(prev=> prev.filter(n=> n.id!==confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  const handleCopy = async (val) => { try{ await navigator.clipboard.writeText(val); setCopied(val); setTimeout(()=> setCopied(null),1200);}catch{} };

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Resources & Notes</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage shared resources and academic notes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={()=> setShowFilters(s=>!s)} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"><Filter size={14}/> {showFilters? 'Hide':'Show'} Filters</button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Plus size={14}/> Add {activeTab==='resources'? 'Resource':'Note'}</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-gray-800 text-xs">
        <button onClick={()=> setActiveTab('resources')} className={`px-4 py-2 rounded-t-lg border ${activeTab==='resources'? 'bg-gray-950 border-gray-700 text-white':'border-transparent text-gray-400 hover:text-gray-200'}`}>Resources</button>
        <button onClick={()=> setActiveTab('notes')} className={`px-4 py-2 rounded-t-lg border ${activeTab==='notes'? 'bg-gray-950 border-gray-700 text-white':'border-transparent text-gray-400 hover:text-gray-200'}`}>Notes</button>
      </div>

      {showFilters && (
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={e=> setQuery(e.target.value)} placeholder={`Search ${activeTab}`} className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 text-sm" />
          </div>
          {activeTab==='resources' && (
            <div className="md:col-span-3 flex flex-wrap gap-2 items-start">
              <button onClick={()=> setCategory('all')} className={`px-3 py-1.5 rounded-lg border text-xs ${category==='all'? 'bg-blue-600 border-blue-600 text-white':'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>All</button>
              {RESOURCE_CATEGORIES.map(c=> (
                <button key={c.key} onClick={()=> setCategory(c.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${category===c.key? 'bg-blue-600 border-blue-600 text-white':'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>{c.label}</button>
              ))}
            </div>
          )}
          {activeTab==='notes' && (
            <>
              <div className="flex flex-wrap gap-2 items-start">
                <select value={noteCourse} onChange={e=> setNoteCourse(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 text-xs">
                  <option value="all">All Courses</option>
                  {noteCourses.map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={noteSemester} onChange={e=> setNoteSemester(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 text-xs">
                  <option value="all">All Semesters</option>
                  {noteSemesters.map(s=> <option key={s} value={s}>{`Sem ${s}`}</option>)}
                </select>
              </div>
              <div className="flex flex-wrap gap-2 items-start">
                <select value={noteType} onChange={e=> setNoteType(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-gray-300 text-xs">
                  <option value="all">All Types</option>
                  {NOTE_TYPES.map(t=> <option key={t} value={t}>{t.toUpperCase()}</option>)}
                </select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Lists */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {activeTab==='resources' && filteredResources.length===0 && (<div className="text-sm text-gray-400">No resources found.</div>)}
        {activeTab==='resources' && filteredResources.map(r=> (
          <div key={r.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 relative group">
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <button onClick={()=> openEdit(r,'resource')} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800"><Pencil size={14}/></button>
              <button onClick={()=> askDelete(r.id,'resource')} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900"><BookOpen className="text-gray-400" size={18}/></div>
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
                </div>
              </div>
            </div>
          </div>
        ))}
        {activeTab==='notes' && filteredNotes.length===0 && (<div className="text-sm text-gray-400">No notes found.</div>)}
        {activeTab==='notes' && filteredNotes.map(n=> (
          <div key={n.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 relative group">
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <button onClick={()=> openEdit(n,'note')} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800"><Pencil size={14}/></button>
              <button onClick={()=> askDelete(n.id,'note')} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white leading-tight">{n.title}</div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-900 text-gray-400">{n.type}</span>
              </div>
              <div className="text-[11px] text-gray-400">{n.desc}</div>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-full bg-gray-900 text-gray-300">{n.course}</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-900 text-gray-300">Sem {n.semester}</span>
                {n.tags?.slice(0,3).map(t=> <span key={t} className="px-2 py-0.5 rounded-full bg-gray-900 text-gray-400">#{t}</span> )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <a href={n.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"><ExternalLink size={12}/> Open</a>
                <button onClick={()=> handleCopy(n.url)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900">{copied===n.url? <><Check size={12}/> Copied</>: <><Copy size={12}/> Copy</>}</button>
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
              <h2 className="text-lg font-semibold text-white">{editingItem? `Edit ${editingItem.kind==='resource'? 'Resource':'Note'}`: `New ${activeTab==='resources'? 'Resource':'Note'}`}</h2>
              <button onClick={()=> { setModalOpen(false); resetForm(); setEditingItem(null); }} className="text-gray-400 hover:text-gray-200"><X className="w-5 h-5"/></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Title</label>
                <input value={form.title} onChange={e=> setForm(f=> ({...f,title:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Title" />
              </div>
              {activeTab==='resources' && (
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Description</label>
                  <textarea value={form.desc} onChange={e=> setForm(f=> ({...f,desc:e.target.value}))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Short description" />
                </div>
              )}
              {activeTab==='notes' && (
                <div>
                  <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Description (optional)</label>
                  <textarea value={form.desc} onChange={e=> setForm(f=> ({...f,desc:e.target.value}))} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Short summary" />
                </div>
              )}
              {activeTab==='resources' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Category</label>
                    <select value={form.category} onChange={e=> setForm(f=> ({...f,category:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">{RESOURCE_CATEGORIES.map(c=> <option key={c.key} value={c.key}>{c.label}</option>)}</select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Type</label>
                    <select value={form.type} onChange={e=> setForm(f=> ({...f,type:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">
                      <option value="link">Link</option>
                      <option value="pdf">PDF</option>
                      <option value="video">Video</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              )}
              {activeTab==='notes' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Course</label>
                    <input value={form.course} onChange={e=> setForm(f=> ({...f,course:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="CS101" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Semester</label>
                    <input value={form.semester} onChange={e=> setForm(f=> ({...f,semester:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="1" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Type</label>
                    <select value={form.noteType} onChange={e=> setForm(f=> ({...f,noteType:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">{NOTE_TYPES.map(t=> <option key={t} value={t}>{t.toUpperCase()}</option>)}</select>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">URL</label>
                <input value={form.url} onChange={e=> setForm(f=> ({...f,url:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Tags (comma separated)</label>
                <input value={form.tags} onChange={e=> setForm(f=> ({...f,tags:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="exam, prep" />
              </div>
              {errors.length>0 && (
                <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 -mt-2">
                  <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">{errors.map(er=> <li key={er}>{er}</li>)}</ul>
                </div>
              )}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={()=> { setModalOpen(false); resetForm(); setEditingItem(null); }} className="px-4 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
                <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"><Save size={14}/> {editingItem? 'Save Changes': `Create ${activeTab==='resources'? 'Resource':'Note'}`}</button>
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
            <h3 className="text-sm font-semibold text-white">Delete {confirmDelete.kind==='resource'? 'Resource':'Note'}</h3>
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
