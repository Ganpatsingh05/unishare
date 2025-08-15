"use client";

import { useEffect, useState } from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";
import { Calendar, Clock, MapPin, Image as ImageIcon, Phone, Instagram, Mail, Link2, Plus, Trash2 } from "lucide-react";

export default function ReportLostFoundPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [mode, setMode] = useState('lost'); // 'lost' | 'found'
  const [whereLastSeen, setWhereLastSeen] = useState("");
  const [landmark, setLandmark] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [timeLost, setTimeLost] = useState("");
  const [whereFound, setWhereFound] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [timeFound, setTimeFound] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const onMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const rot = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI) * 0.1;
      setLogoRotation((prev) => (Math.abs(prev - rot) < 0.1 ? prev : rot));
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const handleThemeToggle = () => setDarkMode((p) => !p);

  const pageBg = darkMode ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100" : "bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800";
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const dropBorder = darkMode ? "border-gray-800" : "border-gray-300";

  const iconForType = (type) => {
    switch (type) {
      case 'mobile': return Phone;
      case 'instagram': return Instagram;
      case 'email': return Mail;
      case 'link': return Link2;
      default: return Link2;
    }
  };

  const placeholderForType = (type) => {
    switch (type) {
      case 'mobile': return '+91 98765 43210';
      case 'instagram': return '@username';
      case 'email': return 'name@university.edu';
      case 'link': return 'https://...';
      default: return '';
    }
  };

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Report Lost / Found</h1>
            <div className={`inline-flex p-1 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <button type="button" onClick={() => setMode('lost')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='lost' ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white') : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>I Lost</button>
              <button type="button" onClick={() => setMode('found')} className={`px-3 py-1.5 text-sm rounded-lg ${mode==='found' ? (darkMode ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white') : (darkMode ? 'text-gray-300' : 'text-gray-700')}`}>I Found</button>
            </div>
          </div>

          <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Item title</label>
              <input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g., Laptop in black sleeve" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Brand, color, last seen condition, stickers, etc." className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
            </div>

            {mode === 'lost' ? (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Where last seen</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={whereLastSeen} onChange={(e) => setWhereLastSeen(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Where found</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={whereFound} onChange={(e) => setWhereFound(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Landmark (optional)</label>
              <input value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="Near library / main gate" className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} />
            </div>

            {mode === 'lost' ? (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Date lost</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={dateLost} onChange={(e) => setDateLost(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Date found</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" value={dateFound} onChange={(e) => setDateFound(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            )}

            {mode === 'lost' ? (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Time lost (optional)</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="time" value={timeLost} onChange={(e) => setTimeLost(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            ) : (
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Time found (optional)</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="time" value={timeFound} onChange={(e) => setTimeFound(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
                </div>
              </div>
            )}

            {/* Photos */}
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Photos (optional)</label>
              <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'} ${dropBorder}`}>
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Click to upload or drag and drop</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setImages(files);
                  const urls = files.map((f) => URL.createObjectURL(f));
                  setPreviews(urls);
                }} />
              </label>
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className={`relative rounded-lg overflow-hidden border ${dropBorder}`}>
                      <img src={src} alt={`Preview ${i + 1}`} className="aspect-square object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-medium ${labelClr}`}>Contact info (your choice)</label>
                <button type="button" onClick={() => setContacts((p) => [...p, { id: Date.now(), type: 'mobile', value: '' }])} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {contacts.map((c, idx) => {
                  const Icon = iconForType(c.type);
                  return (
                    <div key={c.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <select value={c.type} onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, type: e.target.value } : x))} className={`sm:col-span-1 px-3 py-2.5 rounded-lg border ${inputBg}`}>
                        <option value="mobile">Mobile</option>
                        <option value="instagram">Instagram</option>
                        <option value="email">Email</option>
                        <option value="link">Link</option>
                      </select>
                      <div className="sm:col-span-2 relative">
                        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input value={c.value} onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} placeholder={placeholderForType(c.type)} className={`w-full pl-9 pr-10 py-2.5 rounded-lg border ${inputBg}`} />
                        <button type="button" onClick={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-red-500/10 text-red-600" aria-label="Remove contact">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button type="button" className={`px-4 py-2.5 rounded-lg text-white text-sm font-medium ${mode==='lost' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                Submit {mode === 'lost' ? 'lost' : 'found'} report
              </button>
              <button
                type="reset"
                onClick={() => {
                  setMode('lost');
                  setItemName(""); setDescription(""); setWhereLastSeen(""); setWhereFound(""); setLandmark("");
                  setDateLost(""); setTimeLost(""); setDateFound(""); setTimeFound("");
                  setContacts([{ id: 1, type: 'mobile', value: '' }]); setImages([]); setPreviews([]);
                }}
                className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}

