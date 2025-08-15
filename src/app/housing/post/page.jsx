"use client";

import { useEffect, useState } from "react";
import { UploadCloud, Image as ImageIcon, IndianRupee, MapPin, Calendar, Phone, Instagram, Mail, Link2, Plus, Trash2 } from "lucide-react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";

export default function PostRoomPage() {
  const [title, setTitle] = useState("");
  const [rent, setRent] = useState("");
  const [location, setLocation] = useState("");
  const [landmark, setLandmark] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [availableFrom, setAvailableFrom] = useState("");
  const [desc, setDesc] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);
  const [contacts, setContacts] = useState([
    { id: 1, type: "mobile", value: "" },
  ]);
  const [preferences, setPreferences] = useState("");
  const [images, setImages] = useState([]); // File[]
  const [previews, setPreviews] = useState([]); // string[]

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

  const handleThemeToggle = () => setDarkMode((p) => !p);

  const pageBg = darkMode
    ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
    : "bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800";
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const dropBorder = darkMode ? "border-gray-800" : "border-gray-300";
  const divider = darkMode ? "bg-gray-800" : "bg-gray-200";

  // Contacts helpers
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

  // Image previews
  useEffect(() => {
    // revoke previous URLs
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className={`min-h-screen ${pageBg}`}>
      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} logoRotation={logoRotation} />

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Post a room</h1>

          <form className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <div className="sm:col-span-2">
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cozy room near campus"
              className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Monthly rent (₹)</label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="number"
                min="0"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="6500"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Area / landmark"
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
              />
            </div>
          </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Landmark (optional)</label>
              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder="Near main gate / library / metro"
                className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
              />
            </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Beds</label>
            <input
              type="number"
              min={1}
                max={6}
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
              className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Move-in date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={4}
              placeholder="Share details, preferences, and amenities."
              className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
            />
          </div>

            {/* Preferences / Requirements */}
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Preferences / Requirements</label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
                placeholder="e.g., Non-smoker, vegetarian preferred, quiet hours after 10PM"
                className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
              />
            </div>

          <div className="sm:col-span-2">
            <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Photos</label>
              <label className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-900/50' : 'hover:bg-gray-50'} ${dropBorder}`}>
                <ImageIcon className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Click to upload or drag and drop</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setImages(files);
                    const urls = files.map((f) => URL.createObjectURL(f));
                    setPreviews(urls);
                  }}
                />
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

            {/* Contact Info */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-medium ${labelClr}`}>Contact info (your choice)</label>
                <button
                  type="button"
                  onClick={() => setContacts((prev) => [...prev, { id: Date.now(), type: 'mobile', value: '' }])}
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {contacts.map((c, idx) => {
                  const Icon = iconForType(c.type);
                  return (
                    <div key={c.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <select
                        value={c.type}
                        onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, type: e.target.value } : x))}
                        className={`sm:col-span-1 px-3 py-2.5 rounded-lg border ${inputBg}`}
                      >
                        <option value="mobile">Mobile</option>
                        <option value="instagram">Instagram</option>
                        <option value="email">Email</option>
                        <option value="link">Link</option>
                      </select>
                      <div className="sm:col-span-2 relative">
                        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          value={c.value}
                          onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))}
                          placeholder={placeholderForType(c.type)}
                          className={`w-full pl-9 pr-10 py-2.5 rounded-lg border ${inputBg}`}
                        />
                        <button
                          type="button"
                          onClick={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-red-500/10 text-red-600"
                          aria-label="Remove contact"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          <div className="sm:col-span-2 flex items-center gap-3">
            <button type="button" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium">
              <UploadCloud className="w-4 h-4" />
              Publish listing
            </button>
            <button type="reset" onClick={() => { setTitle(""); setRent(""); setLocation(""); setLandmark(""); setBedrooms(1); setAvailableFrom(""); setDesc(""); setPreferences(""); setContacts([{ id: 1, type: 'mobile', value: '' }]); setImages([]); setPreviews([]); }} className={`px-3 py-2.5 rounded-lg border text-sm ${darkMode ? 'border-gray-700 text-gray-200' : 'border-gray-300 text-gray-800'}`}>
              Reset
             </button>
           </div>
         </form>

         {/* Placeholder */}
         <div className={`mt-6 text-xs ${textMuted}`}>Submitting will be wired to backend later.</div>
       </div>
     </main>

     <Footer darkMode={darkMode} />
   </div>
  );
}
