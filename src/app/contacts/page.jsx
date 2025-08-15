"use client";

import React, { useMemo, useState } from "react";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
import { Phone, Mail, MapPin, Clock, Search, Copy, Check, ShieldAlert, Building2, GraduationCap, Home, Users } from "lucide-react";

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'emergency', label: 'Emergency', icon: ShieldAlert },
  { key: 'administration', label: 'Administration', icon: Building2 },
  { key: 'academics', label: 'Academics', icon: GraduationCap },
  { key: 'hostel', label: 'Hostel', icon: Home },
  { key: 'student', label: 'Student & Clubs', icon: Users },
];

export default function ContactsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState('all');
  const [copied, setCopied] = useState(null); // id:type:value

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  const contacts = useMemo(() => ([
    {
      id: 1,
      name: "Campus Security",
      role: "24x7 Helpline",
      category: "emergency",
      phones: ["+91 100"],
      emails: ["security@university.edu"],
      location: "Main Gate Booth",
      hours: "24/7",
    },
    {
      id: 2,
      name: "Medical Center",
      role: "On-campus clinic",
      category: "emergency",
      phones: ["+91 98765 11111"],
      emails: ["clinic@university.edu"],
      location: "Health Block",
      hours: "Mon-Sun 8:00–20:00",
    },
    {
      id: 3,
      name: "Admin Office",
      role: "General Administration",
      category: "administration",
      phones: ["+91 98765 22222"],
      emails: ["admin@university.edu"],
      location: "A-Block, Room 101",
      hours: "Mon-Fri 9:00–17:00",
    },
    {
      id: 4,
      name: "Exam Cell",
      role: "Examinations & Results",
      category: "academics",
      phones: ["+91 98765 33333"],
      emails: ["examcell@university.edu"],
      location: "B-Block, Room 210",
      hours: "Mon-Fri 10:00–16:00",
    },
    {
      id: 5,
      name: "Hostel Warden - Dorm A",
      role: "Warden",
      category: "hostel",
      phones: ["+91 98765 44444"],
      emails: ["wardenA@university.edu"],
      location: "Dorm A Office",
      hours: "Mon-Sat 9:00–18:00",
    },
    {
      id: 6,
      name: "Student Affairs",
      role: "Clubs & Activities",
      category: "student",
      phones: ["+91 98765 55555"],
      emails: ["students@university.edu"],
      location: "Student Center",
      hours: "Mon-Fri 9:00–17:00",
    },
  ]), []);

  const filtered = useMemo(() => contacts.filter(c => {
    const q = query.trim().toLowerCase();
    const inQ = !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.phones.join(' ').toLowerCase().includes(q) || c.emails.join(' ').toLowerCase().includes(q) || (c.location || '').toLowerCase().includes(q);
    const inCat = category === 'all' || c.category === category;
    return inQ && inCat;
  }), [contacts, query, category]);

  const doCopy = async (id, type, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(`${id}:${type}:${value}`);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className={darkMode ? "min-h-dvh bg-black" : "min-h-dvh bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Important Contacts</h1>
          </div>

          <section className="mt-5">
            <div className="grid grid-cols-1 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, role, phone, email or place" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
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
                <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>No contacts found.</div>
              )}
              {filtered.map((c) => (
                <div key={c.id} className={`rounded-xl border p-4 ${darkMode ? 'bg-gray-950 border-gray-900' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <Phone className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${titleClr}`}>{c.name}</div>
                      <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>{c.role}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                        {c.phones.map((p) => (
                          <span key={p} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <Phone className="w-3 h-3" /> {p}
                          </span>
                        ))}
                        {c.emails.map((m) => (
                          <span key={m} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                            <Mail className="w-3 h-3" /> {m}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-[11px] flex flex-wrap items-center gap-3">
                        {c.location && (<span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} inline-flex items-center gap-1`}><MapPin className="w-3 h-3" /> {c.location}</span>)}
                        {c.hours && (<span className={`${darkMode ? 'text-gray-500' : 'text-gray-500'} inline-flex items-center gap-1`}><Clock className="w-3 h-3" /> {c.hours}</span>)}
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {c.phones[0] && (
                          <a href={`tel:${c.phones[0]}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Call</a>
                        )}
                        {c.emails[0] && (
                          <a href={`mailto:${c.emails[0]}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Email</a>
                        )}
                        {c.phones.map((p) => (
                          <button key={`copy-${c.id}-${p}`} type="button" onClick={() => doCopy(c.id, 'phone', p)} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                            {copied === `${c.id}:phone:${p}` ? (<><Check className="w-3 h-3" /> Copied</>) : (<><Copy className="w-3 h-3" /> Copy</>)}
                          </button>
                        ))}
                        {c.emails.map((m) => (
                          <button key={`copy-${c.id}-${m}`} type="button" onClick={() => doCopy(c.id, 'email', m)} className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}>
                            {copied === `${c.id}:email:${m}` ? (<><Check className="w-3 h-3" /> Copied</>) : (<><Copy className="w-3 h-3" /> Copy</>)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}
