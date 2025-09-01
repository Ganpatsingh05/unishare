//markateplace/buy/page.jsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import { Search, SlidersHorizontal, Tag, MapPin, DollarSign, Star, ArrowUpDown, ImageIcon, IndianRupee, Calendar, Phone, Instagram, Mail, Link2, AlertCircle, Loader } from "lucide-react";
import { fetchMarketplaceItems } from "../../lib/api";

// Mock components - replace with your actual components
const Header = ({ darkMode, onThemeToggle }) => (
  <div className="p-4 border-b">
    <button onClick={onThemeToggle}>Toggle {darkMode ? 'Light' : 'Dark'} Mode</button>
  </div>
);

const Footer = ({ darkMode }) => (
  <div className="p-4 border-t">Footer Content</div>
);

export default function MarketplaceBuyPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filters & sorting
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent"); // recent | price-asc | price-desc

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const cardBg = darkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-200";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const subClr = darkMode ? "text-gray-400" : "text-gray-600";

  // Fetch items from backend
  const fetchItems = async () => {
    setLoading(true);
    setError("");
    
    try {
      const filters = {
        search: query || undefined,
        category: category !== 'all' ? category : undefined,
        condition: condition !== 'all' ? condition : undefined,
        min_price: minPrice || undefined,
        max_price: maxPrice || undefined,
        location: location || undefined,
        sort: sort === 'recent' ? 'created_at' : sort === 'price-asc' ? 'price' : sort === 'price-desc' ? 'price' : 'created_at',
        order: sort === 'price-desc' ? 'desc' : sort === 'price-asc' ? 'asc' : 'desc',
        limit: 50
      };

      const result = await fetchMarketplaceItems(filters);
      
      if (result.success) {
        setItems(result.data || []);
      } else {
        setError(result.error || "Failed to fetch items");
        setItems([]);
      }
    } catch (error) {
      setError(error.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch items on component mount and when filters change
  useEffect(() => {
    fetchItems();
  }, [query, category, condition, minPrice, maxPrice, location, sort]);

  const handleReset = () => {
    setQuery("");
    setCategory("all");
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setSort("recent");
    setError("");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getContactIcon = (type) => {
    switch (type) {
      case 'mobile': return Phone;
      case 'instagram': return Instagram;
      case 'email': return Mail;
      case 'link': return Link2;
      default: return Link2;
    }
  };

  const formatContactValue = (type, value) => {
    switch (type) {
      case 'mobile': return value;
      case 'instagram': return value.startsWith('@') ? value : `@${value}`;
      case 'email': return value;
      case 'link': return value;
      default: return value;
    }
  };

  // Item detail modal/card component
  const ItemDetailCard = ({ item, onClose }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border ${cardBg} p-6`} onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <h2 className={`text-xl font-semibold ${titleClr}`}>{item.title}</h2>
          <button onClick={onClose} className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-800' : ''}`}>
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-2xl font-bold text-emerald-500">
              <IndianRupee size={20} />
              {item.price}
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${subClr}`}>
                {item.category}
              </span>
              <span className={`px-2 py-1 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${subClr}`}>
                {item.condition}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className={`flex items-center gap-2 ${subClr}`}>
              <MapPin size={16} />
              {item.location}
            </div>
            <div className={`flex items-center gap-2 ${subClr}`}>
              <Calendar size={16} />
              Available from {formatDate(item.available_from)}
            </div>
          </div>

          {item.description && (
            <div>
              <h3 className={`font-medium mb-2 ${titleClr}`}>Description</h3>
              <p className={`text-sm ${subClr}`}>{item.description}</p>
            </div>
          )}

          {item.contact_info && Object.keys(item.contact_info).length > 0 && (
            <div>
              <h3 className={`font-medium mb-2 ${titleClr}`}>Contact Information</h3>
              <div className="space-y-2">
                {Object.entries(item.contact_info).map(([type, value]) => {
                  const Icon = getContactIcon(type);
                  return (
                    <div key={type} className={`flex items-center gap-3 p-2 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                      <Icon size={16} className="text-gray-400" />
                      <span className="text-sm">{formatContactValue(type, value)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className={`text-xs ${subClr} pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            Listed by {item.users?.name || 'Anonymous'} on {formatDate(item.created_at)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={darkMode ? "min-h-screen bg-black" : "min-h-screen bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Buy Items</h1>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Search items..." 
                  className={`w-56 sm:w-64 pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} 
                />
              </div>
              <button 
                onClick={handleReset} 
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                <option value="all">All</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}>
                <option value="all">All</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Min Price</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={minPrice} 
                  onChange={(e) => setMinPrice(e.target.value.replace(/[^0-9]/g, ''))} 
                  placeholder="0" 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} 
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Max Price</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={maxPrice} 
                  onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9]/g, ''))} 
                  placeholder="5000" 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} 
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Building / area" 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`} 
                />
              </div>
            </div>
            <div className="col-span-1">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Sort by</label>
              <div className="relative">
                <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select value={sort} onChange={(e) => setSort(e.target.value)} className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}>
                  <option value="recent">Most recent</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-6 flex items-center justify-center py-8">
              <Loader className="w-6 h-6 animate-spin text-blue-500" />
              <span className={`ml-2 text-sm ${subClr}`}>Loading items...</span>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.length === 0 && !error && (
                <div className={`col-span-full text-center py-8 ${subClr}`}>
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No items match your filters.</p>
                  <button 
                    onClick={handleReset}
                    className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
              
              {items.map((item) => (
                <div key={item.id} className={`rounded-xl border p-4 ${cardBg} hover:shadow-sm cursor-pointer transition-shadow`} onClick={() => setSelectedItem(item)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                      <ImageIcon className={darkMode ? 'text-gray-400' : 'text-gray-500'} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${titleClr} truncate`}>{item.title}</div>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span className={`${subClr} inline-flex items-center gap-1`}>
                          <Tag size={12} /> {item.category}
                        </span>
                        <span className={`${subClr}`}>{item.condition}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                          <IndianRupee size={16} /> {item.price}
                        </div>
                        <div className={`text-xs ${subClr}`}>
                          {formatDate(item.created_at)}
                        </div>
                      </div>
                      <div className={`mt-2 text-xs ${subClr} inline-flex items-center gap-1`}>
                        <MapPin size={12} /> {item.location}
                      </div>
                    </div>
                  </div>
                  <button className={`mt-4 w-full text-sm py-2.5 rounded-lg font-medium ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                    View details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailCard 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      <Footer darkMode={darkMode} />
    </div>
  );
}