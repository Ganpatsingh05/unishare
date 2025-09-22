"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../_components/Footer";
import SmallFooter from "../_components/SmallFooter";
import { Search, Package, FileText, ArrowRight, Calendar, MapPin, Eye, Plus } from "lucide-react";
import { fetchLostFoundItems } from "../lib/api";
import { useMessages } from "../lib/contexts/UniShareContext";

export default function LostFoundHubPage() {
  const { showTemporaryMessage } = useMessages();
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch recent items
  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const result = await fetchLostFoundItems({
          status: 'active',
          sort: 'created_at',
          order: 'desc',
          limit: 6
        });
        
        if (result.success) {
          setRecentItems(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching recent items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentItems();
  }, []);

  const handleThemeToggle = () => setDarkMode((p) => !p);

  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-600";
  const cardBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-900/70" : "bg-white/80";

  return (
    <div className="min-h-screen">
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold ${titleClr}`}>Lost &amp; Found</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>Report a lost item or share something you&rsquo;ve found on campus.</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/lost-found/report" className={`group rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-blue-500/10 text-blue-300' : 'bg-blue-50 text-blue-600'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Report Lost Item</h2>
                  <p className={`mt-1 text-sm ${textMuted}`}>Describe what you lost and when you last saw it.</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Start report <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/lost-found/view-found" className={`group rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-emerald-500/10 text-emerald-300' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>View Found Items</h2>
                  <p className={`mt-1 text-sm ${textMuted}`}>Search items reported found by other students.</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Browse now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            <Link href="/lost-found/view-lost" className={`group rounded-2xl border ${cardBorder} ${cardBg} p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-red-500/10 text-red-300' : 'bg-red-50 text-red-600'}`}>
                  <Search className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>View Lost Items</h2>
                  <p className={`mt-1 text-sm ${textMuted}`}>Browse items others are looking for.</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                    Browse now <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Items Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${titleClr}`}>Recent Lost & Found Items</h2>
              <Link href="/lost-found/view-found" className={`text-sm ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} font-medium flex items-center gap-1`}>
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`rounded-xl border ${cardBorder} ${cardBg} p-4 animate-pulse`}>
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : recentItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentItems.map((item) => (
                  <div key={item.id} className={`rounded-xl border ${cardBorder} ${cardBg} p-4 hover:shadow-lg transition-all`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.mode === 'lost' 
                          ? (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-50 text-red-600')
                          : (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
                      }`}>
                        {item.mode === 'lost' ? <Search className="w-5 h-5" /> : <Package className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-medium ${titleClr} truncate`}>{item.item_name}</h3>
                        <p className={`text-xs ${textMuted} flex items-center gap-1 mt-1`}>
                          <MapPin className="w-3 h-3" />
                          {item.mode === 'lost' ? item.where_last_seen : item.where_found}
                        </p>
                        <p className={`text-xs ${textMuted} flex items-center gap-1 mt-1`}>
                          <Calendar className="w-3 h-3" />
                          {item.mode === 'lost' 
                            ? (item.date_lost ? new Date(item.date_lost).toLocaleDateString() : 'Date not specified')
                            : (item.date_found ? new Date(item.date_found).toLocaleDateString() : 'Date not specified')
                          }
                        </p>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                          item.mode === 'lost'
                            ? (darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
                            : (darkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                        }`}>
                          {item.mode === 'lost' ? 'Lost Item' : 'Found Item'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-8 ${textMuted}`}>
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No recent lost or found items</p>
                <Link href="/lost-found/report" className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white text-sm font-medium transition-colors`}>
                  <Plus className="w-4 h-4" />
                  Report an item
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}
