"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Tag, Calendar, ExternalLink, Link2, Check, Megaphone, Filter } from "lucide-react";
import Header from "./../../../_components/layout/Header";

import Footer from "./../../../_components/layout/Footer";
import { getActiveAnnouncements } from "./../../../lib/api/announcements";
import { useUI } from "./../../../lib/contexts/UniShareContext";

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'events', label: 'Events' },
  { key: 'academics', label: 'Academics' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'clubs', label: 'Clubs' },
];

export default function ShowAnnouncementsPage() {
  const { darkMode } = useUI();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBg = darkMode ? "bg-gray-900/50 border-gray-800" : "bg-white border-gray-200";

  // Load announcements
  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true);
      try {
        console.log('Loading announcements...');
        const result = await getActiveAnnouncements();
        console.log('API result:', result);
        
        if (result.success) {
          const announcements = result.announcements || result.data || [];
          console.log('Setting announcements:', announcements);
          setAnnouncements(announcements);
        } else {
          console.warn('API returned failure:', result);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error('Error loading announcements:', error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnnouncements();
  }, []);

  // Filter announcements
  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesQuery = !query.trim() || 
        announcement.title.toLowerCase().includes(query.toLowerCase()) ||
        announcement.body.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = category === 'all' || announcement.category === category;
      
      return matchesQuery && matchesCategory;
    });
  }, [announcements, query, category]);

  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1200);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-950' : 'bg-gray-50'}`}>

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <header className="mb-6 sm:mb-8">
            <Link 
              href="/announcements" 
              className={`inline-flex items-center gap-2 text-sm ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} mb-4`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Announcements
            </Link>
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                <Megaphone className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>All Announcements</h1>
                <p className={`mt-1 text-sm sm:text-base ${textMuted}`}>
                  {loading ? 'Loading...' : `${filteredAnnouncements.length} announcements found`}
                </p>
              </div>
            </div>
          </header>

          {/* Filters */}
          <div className={`rounded-xl border p-4 mb-6 ${cardBg}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search announcements..."
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                >
                  {CATEGORIES.map(({ key, label }) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Announcements List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className={textMuted}>Loading announcements...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border ${cardBg}`}>
              <Megaphone className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <p className={`text-lg font-medium ${titleClr} mb-2`}>No announcements found</p>
              <p className={textMuted}>
                {query.trim() || category !== 'all'
                  ? 'Try adjusting your filters'
                  : 'There are no announcements at the moment.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className={`rounded-xl border p-6 ${cardBg} hover:shadow-lg transition-shadow`}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-lg ${darkMode ? 'bg-blue-500/10' : 'bg-blue-50'} flex-shrink-0`}>
                      <Megaphone className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`text-lg font-semibold ${titleClr} leading-snug`}>
                          {announcement.title}
                        </h3>
                      </div>
                      
                      <p className={`${textMuted} text-sm leading-relaxed mb-4`}>
                        {announcement.body}
                      </p>
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 text-xs">
                          {announcement.createdAt && (
                            <span className={`inline-flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              <Calendar className="w-3 h-3" />
                              {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {announcement.link && (
                            <a
                              href={announcement.link}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Open Link
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleCopy(announcement.id, `${announcement.title} — ${announcement.body}`)}
                            className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-colors ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                          >
                            {copiedId === announcement.id ? (
                              <>
                                <Check className="w-3 h-3" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Link2 className="w-3 h-3" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
