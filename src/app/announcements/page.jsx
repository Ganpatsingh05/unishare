"use client";

import React, { useMemo, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Megaphone, Search, Tag, Calendar, ExternalLink, Link2, Check } from "lucide-react";

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'events', label: 'Events' },
  { key: 'academics', label: 'Academics' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'clubs', label: 'Clubs' },
];

export default function AnnouncementsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState('feed'); // 'feed' | 'submit'
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  // sample announcements
  const items = useMemo(() => ([
    { id: 1, title: 'Campus Cleanup Drive', body: 'Join us this Saturday 7 AM at Main Gate for the campus cleanup drive. Gloves and bags will be provided.', category: 'events', date: '2025-08-16', expires: '2025-08-18', link: '#' },
    { id: 2, title: 'Midterm Schedule Released', body: 'The midterm exam timetable for Sem 3 and Sem 5 has been published on the portal.', category: 'academics', date: '2025-08-12', expires: '2025-08-30', link: '#' },
    { id: 3, title: 'Emergency Water Shutdown', body: 'Maintenance in Dorm C: water will be unavailable on 17th Aug from 2 PM to 6 PM.', category: 'alerts', date: '2025-08-15', expires: '2025-08-17', link: '#' },
    { id: 4, title: 'Coding Club Meetup', body: 'Weekly meetup on Friday 5 PM at CS Block 201. Topic: Intro to Next.js.', category: 'clubs', date: '2025-08-14', expires: '2025-08-20', link: '#' },
    { id: 5, title: 'New Bike Parking Rules', body: 'Please park only in designated areas. Violations may result in fines.', category: 'general', date: '2025-08-10', expires: '2025-09-10' },
  ]), []);

  const today = new Date().toISOString().slice(0, 10);
  const filtered = useMemo(() => items.filter(it => {
    const q = query.trim().toLowerCase();
    const inQ = !q || it.title.toLowerCase().includes(q) || it.body.toLowerCase().includes(q) || it.category.toLowerCase().includes(q);
    const inCat = category === 'all' || it.category === category;
    const notExpired = !it.expires || it.expires >= today;
    return inQ && inCat && notExpired;
  }), [items, query, category, today]);

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch {
      // ignore
    }
  };

  // submit form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [catNew, setCatNew] = useState('general');
  const [link, setLink] = useState('');
  const [expires, setExpires] = useState('');

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Announcements</h1>
            <div className={`inline-flex p-1 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button type="button" onClick={() => setMode('feed')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='feed' ? 'bg-blue-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Feed</button>
              <button type="button" onClick={() => setMode('submit')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='submit' ? 'bg-emerald-600 text-white' : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>Submit</button>
            </div>
          </div>

          {mode === 'feed' ? (
            <section className="mt-6">
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search announcements" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(({ key, label }) => (
                    <button key={key} type="button" onClick={() => setCategory(key)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${category===key ? 'bg-blue-600 text-white border-blue-600' : (darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-200 text-gray-700')}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.length === 0 && (
                  <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No announcements found.</div>
                )}
                {filtered.map((a) => (
                  <div key={a.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        <Megaphone className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${titleClr}`}>{a.title}</div>
                        <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs mt-0.5`}>{a.body}</div>
                        <div className="mt-2 flex items-center gap-2 text-[11px]">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <Tag className="w-3 h-3" /> {a.category}
                          </span>
                          {a.date && (
                            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} inline-flex items-center gap-1`}><Calendar className="w-3 h-3" /> {a.date}</span>
                          )}
                          {a.expires && (
                            <span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} inline-flex items-center gap-1`}>valid till {a.expires}</span>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          {a.link && (
                            <a href={a.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                              <ExternalLink className="w-3 h-3" /> Open link
                            </a>
                          )}
                          <button type="button" onClick={() => handleCopy(a.id, `${a.title} — ${a.body}`)} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                            {copiedId === a.id ? (<><Check className="w-3 h-3" /> Copied</>) : (<><Link2 className="w-3 h-3" /> Copy text</>)}
                          </button>
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
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Scholarship Deadline Extended" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Details</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Write the announcement details..." className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
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
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Link (optional)</label>
                  <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://..." className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Valid till (optional)</label>
                  <input type="date" value={expires} onChange={(e) => setExpires(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
                <div className="sm:col-span-2 flex items-center gap-3">
                  <button type="button" className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium">Submit announcement</button>
                  <button type="reset" onClick={() => { setTitle(''); setBody(''); setCatNew('general'); setLink(''); setExpires(''); }} className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>Reset</button>
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
