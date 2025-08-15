"use client";

import React, { useMemo, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Search, BookMarked, FileText, Upload, Download } from "lucide-react";

export default function NotesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState('browse'); // 'browse' | 'upload'

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  // browse filters
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [sem, setSem] = useState("all");
  const [type, setType] = useState("all");

  const subjects = ["all","CS","Math","Physics","Chemistry","Electronics","Mechanical"]; // demo
  const semesters = ["all","Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6","Sem 7","Sem 8"];
  const types = ["all","Notes","Question Bank","Syllabus","Cheat Sheet","Assignment"];

  const items = useMemo(() => ([
    { id: 1, title: "DSA Notes", subject: "CS", sem: "Sem 3", type: "Notes", size: "2.1 MB" },
    { id: 2, title: "Calculus Cheatsheet", subject: "Math", sem: "Sem 1", type: "Cheat Sheet", size: "350 KB" },
    { id: 3, title: "Physics Question Bank", subject: "Physics", sem: "Sem 2", type: "Question Bank", size: "1.2 MB" },
    { id: 4, title: "Operating Systems Summary", subject: "CS", sem: "Sem 5", type: "Notes", size: "900 KB" },
  ]), []);

  const filtered = useMemo(() => items.filter(it => {
    const sQ = q.trim().toLowerCase();
    const inQ = !sQ || it.title.toLowerCase().includes(sQ);
    const inSubject = subject === 'all' || it.subject === subject;
    const inSem = sem === 'all' || it.sem === sem;
    const inType = type === 'all' || it.type === type;
    return inQ && inSubject && inSem && inType;
  }), [items, q, subject, sem, type]);

  // upload form
  const [nTitle, setNTitle] = useState("");
  const [nSubject, setNSubject] = useState("CS");
  const [nSem, setNSem] = useState("Sem 1");
  const [nType, setNType] = useState("Notes");
  const [nTags, setNTags] = useState("");
  const [files, setFiles] = useState([]);

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Notes</h1>
            <div className={`inline-flex p-1 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button type="button" onClick={() => setMode('browse')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='browse' ? 'bg-blue-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Browse</button>
              <button type="button" onClick={() => setMode('upload')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='upload' ? 'bg-emerald-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Upload</button>
            </div>
          </div>

          {mode === 'browse' ? (
            <section className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
                <div className="lg:col-span-4 space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Subject</label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                      {subjects.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Semester</label>
                    <select value={sem} onChange={(e) => setSem(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                      {semesters.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                      {types.map(s => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                </div>

                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.length === 0 && (
                    <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No notes match your filters.</div>
                  )}
                  {filtered.map((it) => (
                    <div key={it.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          <BookMarked className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${titleClr}`}>{it.title}</div>
                          <div className="mt-1 text-xs flex flex-wrap items-center gap-2">
                            <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{it.subject} • {it.sem} • {it.type}</span>
                            <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{it.size}</span>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                              <Download className="w-3 h-3" /> Download
                            </button>
                            <button className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                              <FileText className="w-3 h-3" /> Preview
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-6">
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Title</label>
                  <input value={nTitle} onChange={(e) => setNTitle(e.target.value)} placeholder="e.g., DSA Midterm Notes" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Subject</label>
                  <select value={nSubject} onChange={(e) => setNSubject(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                    {subjects.filter(s => s !== 'all').map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Semester</label>
                  <select value={nSem} onChange={(e) => setNSem(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                    {semesters.filter(s => s !== 'all').map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Type</label>
                  <select value={nType} onChange={(e) => setNType(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                    {types.filter(s => s !== 'all').map(s => (<option key={s} value={s}>{s}</option>))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Tags (comma separated)</label>
                  <input value={nTags} onChange={(e) => setNTags(e.target.value)} placeholder="e.g., dsa, trees, sorting" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Upload files</label>
                  <input type="file" multiple onChange={onFileChange} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                  {files.length > 0 && (
                    <ul className={`mt-2 text-xs list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {files.map((f) => (<li key={f.name}>{f.name}</li>))}
                    </ul>
                  )}
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="button" className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium inline-flex items-center gap-1.5">
                    <Upload className="w-4 h-4" /> Submit notes
                  </button>
                  <button type="reset" onClick={() => { setNTitle(''); setNSubject('CS'); setNSem('Sem 1'); setNType('Notes'); setNTags(''); setFiles([]); }} className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Reset</button>
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
