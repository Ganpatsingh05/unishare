"use client";
import React, { useMemo, useState, useEffect } from "react";
import Footer from "../../_components/Footer";
import { Search, Calendar, MapPin, Clock, Image as ImageIcon, Loader, Package } from "lucide-react";
import { fetchLostFoundItems } from "../../lib/api";
import { useMessages } from "../../lib/contexts/UniShareContext";

export default function ViewLostPage() {
  const { showTemporaryMessage } = useMessages();
  const [darkMode, setDarkMode] = useState(true);
  const [palette, setPalette] = useState('neutral');
  
  // Palette-based styling (keeping the same system as view-found)
  const isCool = palette === 'cool';
  const isNeutral = palette === 'neutral';
  const isGradient = palette === 'gradient';
  const isDark = palette === 'dark';
  
  const labelClr = isGradient
    ? 'text-white/90'
    : isDark
      ? 'text-white/85'
      : isNeutral
        ? 'text-[#333333]/85'
        : (isCool ? 'text-[#1A1A1A]/85' : 'text-[#2D2D2D]/80');
        
  const inputBg = isGradient
    ? 'bg-white/10 border-white/25 text-white placeholder-white/70 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
    : isDark
      ? 'bg-[#0B1220]/60 border-[#334155] text-[#E5E7EB] placeholder-[#E5E7EB]/50 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
      : isNeutral
        ? 'bg-white border-[#FFD6C8] text-[#333333] placeholder-[#333333]/50 focus:ring-4 focus:ring-[#FF6F3C33] focus:border-[#FF6F3C]'
        : (isCool
          ? 'bg-white border-[#BBD4FF] text-[#1A1A1A] placeholder-[#1A1A1A]/50 focus:ring-4 focus:ring-[#1E90FF33] focus:border-[#1E90FF]'
          : 'bg-white border-[#FFD1B0] text-[#2D2D2D] placeholder-[#2D2D2D]/50 focus:ring-4 focus:ring-[#FF914D33] focus:border-[#FF914D]');
          
  const titleClr = (isGradient || isDark)
    ? 'text-white'
    : (isNeutral ? 'text-[#333333]' : (isCool ? 'text-[#1A1A1A]' : 'text-[#2D2D2D]'));
  
  const cardMainText = isDark ? 'text-[#E5E7EB]' : (isGradient ? 'text-[#333333]' : 'text-[#2D2D2D]');
  const cardSub1Text = isDark ? 'text-[#E5E7EB]/75' : (isGradient ? 'text-[#333333]/70' : 'text-[#2D2D2D]/70');
  const cardSub2Text = isDark ? 'text-[#E5E7EB]/65' : (isGradient ? 'text-[#333333]/60' : 'text-[#2D2D2D]/60');

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch lost items from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 Fetching lost items...');
        
        // Create filters for API call
        const filters = {
          mode: 'lost', // Only show lost items
          status: 'active',
          search: query.trim() || undefined,
          location: location.trim() || undefined,
          sort: 'created_at',
          order: 'desc'
        };

        const result = await fetchLostFoundItems(filters);
        
        if (result.success) {
          setItems(result.data || []);
          console.log(`✅ Loaded ${result.data?.length || 0} lost items`);
        } else {
          throw new Error(result.message || 'Failed to fetch items');
        }
      } catch (error) {
        console.error('❌ Error fetching lost items:', error);
        setError(error.message);
        showTemporaryMessage('Failed to load lost items', 'error');
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(fetchData, 300);
    return () => clearTimeout(timeoutId);
  }, [query, location, showTemporaryMessage]);

  // Filter items by date (client-side filtering for date range)
  const filtered = useMemo(() => {
    if (!items.length) return [];
    
    return items.filter(item => {
      const itemDate = item.date_lost || item.created_at?.split('T')[0];
      const inFrom = !dateFrom || itemDate >= dateFrom;
      const inTo = !dateTo || itemDate <= dateTo;
      return inFrom && inTo;
    });
  }, [items, dateFrom, dateTo]);

  return (
    <div className="min-h-dvh">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div
          className={`relative overflow-hidden rounded-2xl border p-4 sm:p-6 transition-colors shadow-lg ${
            isGradient
              ? 'text-white border-transparent shadow-[0_10px_30px_-10px_rgba(255,111,60,0.35)]'
              : isDark
                ? 'bg-[#0F172A] border-[#1F2937] text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)]'
              : isNeutral
                ? 'bg-[#FFFFFF] border-[#FF6F3C] text-[#333333] shadow-[0_10px_30px_-10px_rgba(255,111,60,0.35)]'
                : isCool
                  ? 'bg-[#E6F2FF] border-[#CFE6FF] text-[#1A1A1A]'
                  : 'bg-[#FFF5E6] border-[#FFE2BF] text-[#2D2D2D]'
          }`}
          style={isGradient ? { background: 'linear-gradient(135deg, #FF7E5F, #FEB47B)' } : undefined}
        >
          {!isGradient && (
            <div className={`absolute inset-x-0 top-0 h-1.5 ${
              isNeutral
                ? 'bg-[#FF6F3C]'
                : isCool
                  ? 'bg-[#1E90FF]'
                  : isDark
                    ? 'bg-[#FF6F3C]'
                    : 'bg-[#FF914D]'
            }`}></div>
          )}

          <h1 className={`text-xl sm:text-2xl font-bold mb-1 ${titleClr}`}>Lost Items</h1>
          <p className={`text-sm sm:text-base mb-6 ${labelClr}`}>Help find items reported lost by other students</p>

          {/* Search and filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Search</label>
              <div className="relative">
                <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Item name or description" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Building / area" className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>From</label>
              <div className="relative">
                <Calendar className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>To</label>
              <div className="relative">
                <Calendar className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isGradient ? 'text-white' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} />
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-medium ${labelClr}`}>Lost Items</h2>
              {loading && (
                <div className="flex items-center gap-2">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span className={`text-xs ${labelClr}`}>Loading...</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {error && (
                <div className={`col-span-full text-sm ${isGradient ? 'text-red-300' : 'text-red-600'} bg-red-50 border border-red-200 rounded-lg p-4`}>
                  Error: {error}
                </div>
              )}
              
              {!loading && !error && filtered.length === 0 && (
                <div className={`col-span-full text-sm ${isGradient ? 'text-white/85' : (isDark ? 'text-white/80' : (isNeutral ? 'text-[#333333]/70' : (isCool ? 'text-[#1A1A1A]/70' : 'text-[#2D2D2D]/70')))}`}>
                  No lost items match your filters.
                </div>
              )}
              
              {!loading && !error && filtered.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-xl border p-4 transition-all hover:shadow-md cursor-pointer ${
                    isGradient
                      ? 'bg-white border-[#FFC2A6] text-[#333333] shadow-[0_10px_25px_-12px_rgba(255,127,95,0.25)]'
                      : isDark
                        ? 'bg-[#111827] border-[#FF6F3C33] text-[#E5E7EB] shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)]'
                        : 'bg-white ' + (isNeutral
                          ? 'border-[#FF6F3C] text-[#333333] shadow-[0_10px_25px_-12px_rgba(255,111,60,0.25)]'
                          : isCool
                            ? 'border-[#BBD4FF] text-[#1A1A1A]'
                            : 'border-[#FFD1B0] text-[#2D2D2D]')
                  }`}
                > 
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                        isGradient
                          ? 'bg-[#FFF0E9] border-[#FFC2A6]'
                          : isDark
                            ? 'bg-[#0F172A] border-[#334155]'
                            : isNeutral
                              ? 'bg-white border-[#FF6F3C]'
                              : isCool
                                ? 'bg-[#E6F2FF] border-[#CFE6FF]'
                                : 'bg-[#FFF5E6] border-[#FFE2BF]'
                      }`}
                    >
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img 
                          src={item.image_urls[0]} 
                          alt={item.item_name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className={`${isGradient ? 'text-[#FF6F3C]' : (isDark ? 'text-[#FF6F3C]' : (isNeutral ? 'text-[#FF6F3C]' : (isCool ? 'text-[#1E90FF]' : 'text-[#FF914D]')))}`} size={18} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${cardMainText}`}>
                        {item.item_name}
                      </div>
                      <div className={`text-xs mt-1 ${cardSub1Text} flex items-center gap-1`}>
                        <MapPin className="w-3 h-3" />
                        Last seen: {item.where_last_seen}
                      </div>
                      <div className={`text-xs mt-1 ${cardSub2Text} flex items-center gap-1`}>
                        <Calendar className="w-3 h-3" />
                        Lost: {item.date_lost ? new Date(item.date_lost).toLocaleDateString() : 'Date not specified'}
                      </div>
                      {item.description && (
                        <div className={`text-xs mt-2 ${cardSub2Text} line-clamp-2`}>
                          {item.description}
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${cardSub1Text}`}>
                        By: {item.users?.name || 'Anonymous'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}