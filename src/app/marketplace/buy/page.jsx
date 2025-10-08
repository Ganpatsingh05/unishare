"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  SlidersHorizontal, 
  Tag, 
  MapPin, 
  DollarSign, 
  Star, 
  ArrowUpDown, 
  ImageIcon, 
  IndianRupee, 
  Calendar, 
  Phone, 
  Instagram, 
  Mail, 
  Link2, 
  AlertCircle, 
  Loader,
  X,
  ArrowLeft
} from "lucide-react";
import Footer from "../../_components/Footer";
import SmallFooter from "../../_components/SmallFooter";
import useIsMobile from "../../_components/useIsMobile";
import { fetchMarketplaceItems } from "../../lib/api";
import { 
  useUniShare, 
  useAuth, 
  useMessages, 
  useUI 
} from "../../lib/contexts/UniShareContext";

export default function MarketplaceBuyPage() {
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setLoading } = useMessages();
  const { darkMode, toggleDarkMode, searchValue, setSearchValue } = useUI();
  const isMobile = useIsMobile();

  // Local state
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  // Filter states
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent");

  // Theme classes
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const cardBg = darkMode ? "bg-gray-950 border-gray-900" : "bg-white border-gray-200";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const subClr = darkMode ? "text-gray-400" : "text-gray-600";

  // Fetch items from backend
  const fetchItems = async () => {
    setLoading(true);
    clearError();
    
    try {
      const filters = {
        search: searchValue || undefined,
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
  }, [searchValue, category, condition, minPrice, maxPrice, location, sort]);

  const handleReset = () => {
    setSearchValue("");
    setCategory("all");
    setCondition("all");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    setSort("recent");
    clearError();
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

  // Item detail modal component
  const ItemDetailModal = ({ item, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${cardBg} p-6`} 
        onClick={() => {
          setSelectedItem(item);
        }}

      >
        <div className="flex items-start justify-between mb-6">
          <h2 className={`text-2xl font-bold ${titleClr}`}>{item.title}</h2>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Item photos placeholder */}
          <div className={`w-full h-64 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {item.image_url && item.photos.length > 0 ? (
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <ImageIcon className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Price and tags */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-3xl font-bold text-emerald-500">
              <IndianRupee size={24} />
              {item.price}
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${subClr}`}>
                {item.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                item.condition === 'new' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                item.condition === 'like-new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                item.condition === 'good' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                item.condition === 'fair' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {item.condition}
              </span>
            </div>
          </div>

          {/* Location and availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <MapPin className="w-5 h-5 text-purple-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Location</p>
                <p className={`font-medium ${titleClr}`}>{item.location}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Available from</p>
                <p className={`font-medium ${titleClr}`}>{formatDate(item.available_from)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div>
              <h3 className={`font-semibold mb-3 ${titleClr}`}>Description</h3>
              <p className={`leading-relaxed ${subClr}`}>{item.description}</p>
            </div>
          )}

          {/* Contact Information */}
          {item.contact_info && Object.keys(item.contact_info).length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${titleClr}`}>Contact Information</h3>
              <div className="space-y-3">
                {Object.entries(item.contact_info).map(([type, value]) => {
                  const Icon = getContactIcon(type);
                  return (
                    <div key={type} className={`flex items-center gap-3 p-3 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div>
                        <p className={`text-xs ${subClr} capitalize`}>{type}</p>
                        <p className={`font-medium ${titleClr}`}>{formatContactValue(type, value)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Seller info */}
          <div className={`pt-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${subClr}`}>Listed by</p>
                <p className={`font-medium ${titleClr}`}>{item.users?.name || 'Anonymous'}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${subClr}`}>Posted on</p>
                <p className={`font-medium ${titleClr}`}>{formatDate(item.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg">
              Contact Seller
            </button>
            <button className={`px-4 py-3 rounded-xl border transition-colors ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}>
              <Star className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">

      <main className={`${isMobile ? 'px-3 py-4' : 'max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10'}`}>
        <div className={`rounded-2xl border shadow-xl ${isMobile ? 'p-3' : 'p-4 sm:p-6'} ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-white/80 border-gray-200'} backdrop-blur-sm`}>
          
          {/* Search and filters header */}
          <div className={`flex items-center justify-between gap-3 ${isMobile ? 'flex-col' : 'flex-wrap'} mb-6`}>
            <h2 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold ${titleClr}`}>Browse Items</h2>
            <div className={`flex items-center gap-2 ${isMobile ? 'w-full' : ''}`}>
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={searchValue} 
                  onChange={(e) => setSearchValue(e.target.value)} 
                  placeholder="Search items..." 
                  className={`${isMobile ? 'w-full' : 'w-56 sm:w-64'} pl-9 pr-3 py-2.5 rounded-lg border shadow-sm ${inputBg}`} 
                />
              </div>
              <button 
                onClick={handleReset} 
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${darkMode ? 'border-gray-800 text-gray-300 hover:bg-gray-900' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
              >
                <SlidersHorizontal className="w-4 h-4" /> Reset
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 md:grid-cols-6 gap-3'} mb-6`}>
            <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className={`w-full px-3 ${isMobile ? 'py-2' : 'py-2.5'} rounded-lg border ${inputBg}`}
              >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="books">Books</option>
                <option value="furniture">Furniture</option>
                <option value="accessories">Accessories</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={`${isMobile ? 'col-span-1' : 'col-span-1'}`}>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Condition</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)} 
                className={`w-full px-3 ${isMobile ? 'py-2' : 'py-2.5'} rounded-lg border ${inputBg}`}
              >
                <option value="all">All Conditions</option>
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            {!isMobile && (
              <>
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
                    <select 
                      value={sort} 
                      onChange={(e) => setSort(e.target.value)} 
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile-only additional filters row */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Price Range</label>
                <select 
                  value={minPrice || maxPrice ? 'custom' : 'all'} 
                  onChange={(e) => {
                    if (e.target.value === 'all') {
                      setMinPrice('');
                      setMaxPrice('');
                    } else if (e.target.value === '0-500') {
                      setMinPrice('0');
                      setMaxPrice('500');
                    } else if (e.target.value === '500-2000') {
                      setMinPrice('500');
                      setMaxPrice('2000');
                    } else if (e.target.value === '2000+') {
                      setMinPrice('2000');
                      setMaxPrice('');
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border ${inputBg}`}
                >
                  <option value="all">All Prices</option>
                  <option value="0-500">₹0 - ₹500</option>
                  <option value="500-2000">₹500 - ₹2000</option>
                  <option value="2000+">₹2000+</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Sort</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)} 
                  className={`w-full px-3 py-2 rounded-lg border ${inputBg}`}
                >
                  <option value="recent">Latest</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 backdrop-blur-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-500">{error}</span>
              <button onClick={clearError} className="ml-auto">
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-3" />
                <p className={`text-sm ${subClr}`}>Finding the best items for you...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div>
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm ${subClr}`}>
                  {items.length} {items.length === 1 ? 'item' : 'items'} found
                </p>
              </div>

              {/* Items grid - Mobile vs Desktop */}
              <div className={`grid gap-4 ${
                isMobile 
                  ? 'grid-cols-2' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {items.length === 0 && !error && (
                  <div className={`col-span-full text-center py-12 ${subClr}`}>
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No items found</h3>
                    <p className="mb-4">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={handleReset}
                      className="text-blue-500 hover:text-blue-600 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
                
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`group rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                      isMobile 
                        ? 'p-2 hover:scale-[1.01]' 
                        : 'p-4 hover:scale-[1.02]'
                    } ${cardBg}`} 
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="space-y-3">
                      {/* Item image */}
                      <div className={`w-full rounded-lg flex items-center justify-center overflow-hidden ${
                        isMobile ? 'h-24' : 'h-40'
                      } ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {item.image_url ? (
                          <img 
                            src={item.image_url} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : item.photos && item.photos.length > 0 ? (
                          <img 
                            src={item.photos[0]} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <ImageIcon className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} text-gray-400`} />
                        )}
                      </div>

                      {/* Item details */}
                      <div className={isMobile ? 'space-y-1.5' : 'space-y-2'}>
                        <h3 className={`font-semibold ${titleClr} line-clamp-2 ${
                          isMobile ? 'text-sm leading-tight' : 'text-base'
                        }`}>
                          {item.title}
                        </h3>
                        
                        <div className="flex items-center justify-between">
                          <div className={`flex items-center gap-1 text-emerald-500 font-bold ${
                            isMobile ? 'text-sm' : 'text-lg'
                          }`}>
                            <IndianRupee size={isMobile ? 14 : 18} />
                            {item.price}
                          </div>
                          {!isMobile && (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                                {item.category}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className={`flex items-center gap-2 text-xs ${subClr} ${
                          isMobile ? 'justify-between' : 'gap-4'
                        }`}>
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {isMobile ? item.location.split(' ')[0] : item.location}
                          </span>
                          <span className={`${
                            isMobile 
                              ? 'px-1.5 py-0.5 rounded text-xs bg-gray-100 dark:bg-gray-800' 
                              : ''
                          }`}>
                            {item.condition}
                          </span>
                        </div>

                        {!isMobile && (
                          <div className={`text-xs ${subClr}`}>
                            Posted {formatDate(item.created_at)}
                          </div>
                        )}

                        <button className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg group-hover:scale-[1.02] ${
                          isMobile ? 'py-1.5 px-2 text-xs' : 'py-2.5 px-4'
                        }`}>
                          {isMobile ? 'View' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
      <SmallFooter />

    </div>
  );
}