"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Phone, Mail, MapPin, Clock, Copy, Check, Trash2, Pencil, X, Filter, Building2, GraduationCap, ShieldAlert, Home, Users, Save, ListFilter } from 'lucide-react';
import AdminGuard from "../_components/AdminGuard";
import AdminLayout from "../_components/AdminLayout";

// Mirror categories used on public page
const CATEGORIES = [
  { key: 'emergency', label: 'Emergency', icon: ShieldAlert },
  { key: 'administration', label: 'Administration', icon: Building2 },
  { key: 'academics', label: 'Academics', icon: GraduationCap },
  { key: 'hostel', label: 'Hostel', icon: Home },
  { key: 'student', label: 'Student & Clubs', icon: Users },
];

// LocalStorage key
const STORAGE_KEY = 'campusContacts';

// Default seed data (same as public page) - used if no storage present
const SEED_CONTACTS = [
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
];

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', role: '', category: 'emergency', phones: [''], emails: [''], location: '', hours: '' });
  const [errors, setErrors] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [copied, setCopied] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  // Load from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          setContacts(parsed);
          return;
        }
      }
      setContacts(SEED_CONTACTS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CONTACTS));
    } catch (e) {
      console.error('Failed loading contacts', e);
      setContacts(SEED_CONTACTS);
    }
  }, []);

  // Persist on change
  useEffect(() => {
    if (contacts.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
    }
  }, [contacts]);

  const resetForm = () => {
    setForm({ name: '', role: '', category: 'emergency', phones: [''], emails: [''], location: '', hours: '' });
    setErrors([]);
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditing(contact);
    setForm({
      name: contact.name || '',
      role: contact.role || '',
      category: contact.category || 'emergency',
      phones: contact.phones && contact.phones.length ? [...contact.phones] : [''],
      emails: contact.emails && contact.emails.length ? [...contact.emails] : [''],
      location: contact.location || '',
      hours: contact.hours || '',
    });
    setErrors([]);
    setModalOpen(true);
  };

  const validate = () => {
    const errs = [];
    if (!form.name.trim()) errs.push('Name required');
    if (!form.role.trim()) errs.push('Role required');
    if (!form.category) errs.push('Category required');
    const phoneList = form.phones.filter(p => p.trim());
    const emailList = form.emails.filter(e => e.trim());
    if (!phoneList.length && !emailList.length) errs.push('At least one phone or email required');
    return errs;
  };

  const save = () => {
    const errs = validate();
    setErrors(errs);
    if (errs.length) return;

    const next = {
      id: editing ? editing.id : Math.max(0, ...contacts.map(c => c.id)) + 1,
      name: form.name.trim(),
      role: form.role.trim(),
      category: form.category,
      phones: form.phones.filter(p => p.trim()),
      emails: form.emails.filter(e => e.trim()),
      location: form.location.trim(),
      hours: form.hours.trim(),
    };

    if (editing) {
      setContacts(prev => prev.map(c => c.id === editing.id ? next : c));
    } else {
      setContacts(prev => [...prev, next]);
    }
    setModalOpen(false);
    resetForm();
  };

  const askDelete = (id) => setConfirmDelete(id);
  const doDelete = () => {
    setContacts(prev => prev.filter(c => c.id !== confirmDelete));
    setConfirmDelete(null);
    if (editing && editing.id === confirmDelete) {
      setModalOpen(false);
      resetForm();
    }
  };

  const filtered = useMemo(() => contacts.filter(c => {
    const q = query.trim().toLowerCase();
    const inQ = !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.phones.join(' ').toLowerCase().includes(q) || c.emails.join(' ').toLowerCase().includes(q) || (c.location || '').toLowerCase().includes(q);
    const inCat = category === 'all' || c.category === category;
    return inQ && inCat;
  }), [contacts, query, category]);

  const doCopy = async (value) => {
    try { await navigator.clipboard.writeText(value); setCopied(value); setTimeout(() => setCopied(null), 1200);} catch {}
  };

  const addPhoneField = () => setForm(f => ({ ...f, phones: [...f.phones, ''] }));
  const addEmailField = () => setForm(f => ({ ...f, emails: [...f.emails, ''] }));
  const updatePhone = (i, val) => setForm(f => ({ ...f, phones: f.phones.map((p, idx) => idx === i ? val : p) }));
  const updateEmail = (i, val) => setForm(f => ({ ...f, emails: f.emails.map((e, idx) => idx === i ? val : e) }));
  const removePhone = (i) => setForm(f => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }));
  const removeEmail = (i) => setForm(f => ({ ...f, emails: f.emails.filter((_, idx) => idx !== i) }));

  return (
    <AdminGuard>
      <AdminLayout>
        <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Contacts Directory</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage campus important contacts displayed publicly.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFilters(s => !s)} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900"><ListFilter size={14}/> {showFilters ? 'Hide' : 'Show'} Filters</button>
          <button onClick={openCreate} className="inline-flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-blue-600 text-white hover:bg-blue-700"><Plus size={14}/> Add Contact</button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search contacts" className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-800 bg-gray-900 text-gray-100 placeholder-gray-500 text-sm" />
          </div>
          <div className="md:col-span-2 flex flex-wrap gap-2 items-start">
            <button onClick={() => setCategory('all')} className={`px-3 py-1.5 rounded-lg border text-xs ${category==='all' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>All</button>
            {CATEGORIES.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setCategory(key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs ${category===key ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-800 text-gray-300 hover:bg-gray-900'}`}>
                {Icon && <Icon size={14} />} {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.length === 0 && (
          <div className="text-sm text-gray-400">No contacts found.</div>
        )}
        {filtered.map(c => (
          <div key={c.id} className="rounded-xl border border-gray-800 bg-gray-950 p-4 relative group">
            <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
              <button onClick={() => openEdit(c)} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800"><Pencil size={14}/></button>
              <button onClick={() => askDelete(c.id)} className="p-1 rounded-md bg-gray-900 border border-gray-800 text-red-400 hover:bg-red-500/10"><Trash2 size={14}/></button>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-900">
                <Phone className="text-gray-400" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white leading-tight">{c.name}</div>
                <div className="text-xs text-gray-400">{c.role}</div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {c.phones.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900 text-gray-300"><Phone size={12}/> {p}</span>
                  ))}
                  {c.emails.map(m => (
                    <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-900 text-gray-300"><Mail size={12}/> {m}</span>
                  ))}
                </div>
                <div className="mt-2 text-[11px] flex flex-wrap items-center gap-3 text-gray-500">
                  {c.location && (<span className="inline-flex items-center gap-1"><MapPin size={12}/> {c.location}</span>)}
                  {c.hours && (<span className="inline-flex items-center gap-1"><Clock size={12}/> {c.hours}</span>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.phones[0] && (<a href={`tel:${c.phones[0]}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Call</a>)}
                  {c.emails[0] && (<a href={`mailto:${c.emails[0]}`} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Email</a>)}
                  {[...c.phones, ...c.emails].map(val => (
                    <button key={val} onClick={() => doCopy(val)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900">
                      {copied === val ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setModalOpen(false); resetForm(); }} />
          <div className="relative w-full md:max-w-lg md:rounded-2xl border-t md:border border-gray-800 bg-gray-950 p-6 max-h-[90vh] overflow-y-auto animate-slide-up-soft md:animate-dropdown-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{editing ? 'Edit Contact' : 'New Contact'}</h2>
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="text-gray-400 hover:text-gray-200"><X className="w-5 h-5"/></button>
            </div>
            {errors.length > 0 && (
              <div className="rounded-lg border border-red-900 bg-red-950/40 p-3 mb-4">
                <ul className="text-xs text-red-300 space-y-1 list-disc list-inside">
                  {errors.map(er => <li key={er}>{er}</li>)}
                </ul>
              </div>
            )}
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Campus Security" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Role / Description</label>
                <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="24x7 Helpline" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100">
                  {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium uppercase tracking-wide">Phones</label>
                  <button type="button" onClick={addPhoneField} className="text-[11px] text-blue-400 hover:text-blue-300">Add</button>
                </div>
                <div className="space-y-2 mt-2">
                  {form.phones.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={p} onChange={e => updatePhone(i, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="+91 ..." />
                      {form.phones.length > 1 && <button onClick={() => removePhone(i)} className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-900"><X size={14}/></button>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium uppercase tracking-wide">Emails</label>
                  <button type="button" onClick={addEmailField} className="text-[11px] text-blue-400 hover:text-blue-300">Add</button>
                </div>
                <div className="space-y-2 mt-2">
                  {form.emails.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input value={m} onChange={e => updateEmail(i, e.target.value)} className="flex-1 px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="security@university.edu" />
                      {form.emails.length > 1 && <button onClick={() => removeEmail(i)} className="p-2 rounded-lg border border-gray-800 text-gray-400 hover:bg-gray-900"><X size={14}/></button>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Location</label>
                <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="Main Gate Booth" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 uppercase tracking-wide">Hours</label>
                <input value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-800 bg-gray-900 text-sm text-gray-100" placeholder="24/7" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
                <button onClick={save} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"><Save size={14}/> {editing ? 'Save Changes' : 'Create Contact'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl border border-gray-800 bg-gray-950 p-5 z-[61]">
            <h3 className="text-sm font-semibold text-white">Delete Contact</h3>
            <p className="text-xs text-gray-400 mt-1">This action cannot be undone. The contact will be removed from the public directory.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-300 hover:bg-gray-900 text-xs">Cancel</button>
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
