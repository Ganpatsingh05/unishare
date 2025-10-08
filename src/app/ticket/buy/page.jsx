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
  ArrowLeft,
  Clock,
  Users,
  Plus,
  Ticket,
  CalendarDays,
  Music
} from "lucide-react";
import Link from "next/link";
import useIsMobile from "../../_components/useIsMobile";
import { fetchTickets } from "../../lib/api";
import { 
  useAuth, 
  useMessages, 
  useUI 
} from "../../lib/contexts/UniShareContext";

export default function TicketBuyPage() {
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setLoading } = useMessages();
  const { darkMode, toggleDarkMode, searchValue, setSearchValue } = useUI();
  const isMobile = useIsMobile();

  // Local state
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Filter states
  const [eventType, setEventType] = useState("all"); // legacy event subtype for events
  const [category, setCategory] = useState("all"); // new high-level category: event | travel | other
  const [priceRange, setPriceRange] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("recent");

  // Theme classes using global CSS custom properties and consistent focus states
  const labelClr = "text-secondary";
  const inputStyles = darkMode 
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-yellow-400/30 focus:border-yellow-400" 
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500";
  const cardBg = darkMode ? "bg-gray-950/60 border-gray-900" : "bg-white/80 border-gray-200";
  const titleClr = "text-primary";
  const subClr = "text-muted";



  // Fetch tickets from backend
  const fetchTicketData = async () => {
    setLoading(true);
    clearError();
    
    try {
      // Prepare filters for API call
      const filters = {
        search: searchValue || undefined,
        category: category !== 'all' ? category : undefined,
        event_type: eventType !== 'all' ? eventType : undefined,
        location: location || undefined,
        sort: sort === 'recent' ? 'created_at' : sort.replace('-', '_'),
        order: sort.includes('asc') ? 'asc' : 'desc'
      };

      // Handle price range
      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'under-500':
            filters.max_price = 500;
            break;
          case '500-1000':
            filters.min_price = 500;
            filters.max_price = 1000;
            break;
          case '1000-2000':
            filters.min_price = 1000;
            filters.max_price = 2000;
            break;
          case 'over-2000':
            filters.min_price = 2000;
            break;
        }
      }

      // Call the real API
      const result = await fetchTickets(filters);
      
      if (result.success) {
        setTickets(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to fetch tickets');
      }
      
    } catch (error) {
      console.error('❌ Error fetching tickets:', error);
      setError(error.message || 'Failed to load tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tickets on component mount and when filters change
  useEffect(() => {
    fetchTicketData();
  }, [searchValue, category, eventType, priceRange, dateRange, location, sort]);

  const handleReset = () => {
    setSearchValue("");
    setEventType("all");
    setCategory("all");
    setPriceRange("all");
    setDateRange("all");
    setLocation("");
    setSort("recent");
    clearError();
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (dateString) => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return "Past event";
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

  const getEventTypeIcon = (type, cat) => {
    if (cat === 'travel') return Clock; // representing journey
    if (cat === 'other') return Tag;
    switch (type) {
      case 'concert': return Music;
      case 'sports': return Users;
      case 'comedy': return Users;
      case 'theater': return Users;
      case 'conference': return Users;
      default: return Ticket;
    }
  };

  // Ticket detail modal component
  const TicketDetailModal = ({ ticket, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${cardBg} p-6`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className={`text-2xl font-bold ${titleClr}`}>{ticket.title}</h2>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Ticket image placeholder */}
          <div className={`w-full h-64 rounded-xl flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            {ticket.image_url ? (
              <img
                src={ticket.image_url}
                alt={ticket.title}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Ticket className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Price and event details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-3xl font-bold text-emerald-500">
              <IndianRupee size={24} />
              {ticket.price}
              <span className={`text-sm font-normal ${subClr} ml-2`}>per ticket</span>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm capitalize ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} ${subClr}`}>
                {ticket.event_type}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                {ticket.ticket_type}
              </span>
            </div>
          </div>

          {/* Event details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <CalendarDays className="w-5 h-5 text-blue-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Event Date</p>
                <p className={`font-medium ${titleClr}`}>{formatDate(ticket.event_date)}</p>
                <p className={`text-xs text-blue-500`}>{formatEventDate(ticket.event_date)}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <MapPin className="w-5 h-5 text-purple-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Venue</p>
                <p className={`font-medium ${titleClr}`}>{ticket.venue}</p>
                <p className={`text-xs ${subClr}`}>{ticket.location}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Ticket className="w-5 h-5 text-green-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Available</p>
                <p className={`font-medium ${titleClr}`}>{ticket.quantity_available} ticket{ticket.quantity_available > 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className={`text-xs ${subClr}`}>Listed</p>
                <p className={`font-medium ${titleClr}`}>{formatDate(ticket.created_at).split(',')[0]}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <div>
              <h3 className={`font-semibold mb-3 ${titleClr}`}>Description</h3>
              <p className={`leading-relaxed ${subClr}`}>{ticket.description}</p>
            </div>
          )}

          {/* Contact Information */}
          {ticket.contact_info && Object.keys(ticket.contact_info).length > 0 && (
            <div>
              <h3 className={`font-semibold mb-3 ${titleClr}`}>Contact Seller</h3>
              <div className="space-y-3">
                {Object.entries(ticket.contact_info).map(([type, value]) => {
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
                <p className={`text-sm ${subClr}`}>Seller</p>
                <p className={`font-medium ${titleClr}`}>{ticket.users?.name || 'Anonymous'}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm ${subClr}`}>Listed on</p>
                <p className={`font-medium ${titleClr}`}>{formatDate(ticket.created_at).split(',')[0]}</p>
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
    <>
      <main className={`${isMobile ? 'px-4 py-5' : 'max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10'}`}>
        <div className={`rounded-xl border ${isMobile ? 'p-4' : 'p-4 sm:p-6'} backdrop-blur-sm ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'}`}>
          
          {/* Header */}
          <div className={`flex items-center justify-between gap-4 ${isMobile ? 'mb-5' : 'mb-6'}`}>
            <div className="flex items-center gap-3">
              <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} rounded-xl bg-blue-500 flex items-center justify-center`}>
                <Ticket className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
              </div>
              <div>
                <h2 className={`${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'} font-semibold ${titleClr}`}>Buy Tickets</h2>
                <p className={`text-sm ${subClr}`}>Events, travel & more</p>
              </div>
            </div>
            <div className={`flex items-center gap-2 ${isMobile ? '' : 'gap-3'}`}>
              {isAuthenticated && (
                <Link 
                  href="/ticket/sell"
                  className={`inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors ${
                    isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2.5'
                  }`}
                >
                  <Plus className="w-4 h-4" /> {isMobile ? 'Sell' : 'Sell Tickets'}
                </Link>
              )}
              <button 
                onClick={handleReset} 
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
              >
                <SlidersHorizontal className="w-4 h-4" /> {isMobile ? '' : 'Reset'}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className={`${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div className="relative">
              <Search className={`w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              <input 
                value={searchValue} 
                onChange={(e) => setSearchValue(e.target.value)} 
                placeholder="Search events, venues..." 
                className={`w-full pl-10 pr-4 ${isMobile ? 'py-3' : 'py-3'} rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20`} 
              />
            </div>
          </div>

          {/* Filters */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 md:grid-cols-6 gap-3'} ${isMobile ? 'mb-4' : 'mb-6'}`}>
            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className={`w-full px-3 ${isMobile ? 'py-2.5' : 'py-2.5'} rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              >
                <option value="all">All</option>
                <option value="event">Event</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Event Type</label>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)} 
                className={`w-full px-3 ${isMobile ? 'py-2.5' : 'py-2.5'} rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
              >
                <option value="all">All Types</option>
                <option value="concert">Concerts</option>
                <option value="sports">Sports</option>
                <option value="comedy">Comedy</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
            {!isMobile && (
              <>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Price Range</label>
                  <select 
                    value={priceRange} 
                    onChange={(e) => setPriceRange(e.target.value)} 
                    className={`w-full px-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  >
                    <option value="all">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-1500">₹500 - ₹1500</option>
                    <option value="1500-5000">₹1500 - ₹5000</option>
                    <option value="5000+">Above ₹5000</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Date Range</label>
                  <select 
                    value={dateRange} 
                    onChange={(e) => setDateRange(e.target.value)} 
                    className={`w-full px-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                  >
                    <option value="all">Any Time</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="next-month">Next Month</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Location</label>
                  <div className="relative">
                    <MapPin className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <input 
                      value={location} 
                      onChange={(e) => setLocation(e.target.value)} 
                      placeholder="City" 
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`} 
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Sort by</label>
                  <div className="relative">
                    <ArrowUpDown className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                    <select 
                      value={sort} 
                      onChange={(e) => setSort(e.target.value)} 
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="date">Event Date</option>
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile-only additional filters */}
          {isMobile && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Price</label>
                <select 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)} 
                  className={`w-full px-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                >
                  <option value="all">All</option>
                  <option value="0-500">₹0-500</option>
                  <option value="500-1500">₹500-1.5K</option>
                  <option value="1500-5000">₹1.5K-5K</option>
                  <option value="5000+">₹5K+</option>
                </select>
              </div>
              <div>
                <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Sort</label>
                <select 
                  value={sort} 
                  onChange={(e) => setSort(e.target.value)} 
                  className={`w-full px-3 py-2.5 rounded-lg border transition-colors ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500`}
                >
                  <option value="recent">Latest</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="date">Date</option>
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
                <p className={`text-sm ${subClr}`}>Finding the best tickets for you...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div>
              {/* Results count */}
              <div className="flex items-center justify-between mb-4">
                <p className={`text-sm ${subClr}`}>
                  {tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'} found
                </p>
              </div>

              {/* Tickets grid - Mobile vs Desktop */}
              <div className={`grid gap-4 ${
                isMobile 
                  ? 'grid-cols-2' 
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              }`}>
                {tickets.length === 0 && !error && (
                  <div className={`col-span-full text-center py-12 ${
                    darkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className={`text-lg font-medium mb-2 ${
                      darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}>No tickets found</h3>
                    <p className="mb-4">Try adjusting your filters or search terms</p>
                    <button 
                      onClick={handleReset}
                      className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
                
                {tickets.map((ticket) => {
                  const cat = ticket.category || 'other';
                  const EventIcon = getEventTypeIcon(ticket.event_type, cat);
                  return (
                    <div 
                      key={ticket.id} 
                      className={`group rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        isMobile 
                          ? 'p-3 hover:scale-[1.01]' 
                          : 'p-4 hover:scale-[1.02]'
                      } ${darkMode 
                        ? 'bg-slate-800 border-slate-700 hover:shadow-slate-700/20' 
                        : 'bg-white border-slate-200 hover:shadow-slate-200/60'
                      }`} 
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <div className="space-y-3">
                        {/* Event image/icon */}
                        <div className={`w-full rounded-lg flex items-center justify-center overflow-hidden ${
                          isMobile ? 'h-24' : 'h-40'
                        } ${darkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                          {ticket.image_url ? (
                            <img 
                              src={ticket.image_url} 
                              alt={ticket.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="text-center">
                              <EventIcon className={`${isMobile ? 'w-8 h-8' : 'w-12 h-12'} ${
                                darkMode ? 'text-slate-500' : 'text-slate-400'
                              } mx-auto mb-2`} />
                              <p className={`text-xs capitalize ${
                                darkMode ? 'text-slate-400' : 'text-slate-500'
                              }`}>{cat}</p>
                            </div>
                          )}
                        </div>

                        {/* Event details */}
                        <div className={isMobile ? 'space-y-2' : 'space-y-2'}>
                          <h3 className={`font-semibold line-clamp-2 ${
                            isMobile ? 'text-sm leading-tight' : 'text-base'
                          } ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                            {ticket.title}
                          </h3>
                          
                          <div className="flex items-center justify-between">
                            <div className={`flex items-center gap-1 text-green-600 font-bold ${
                              isMobile ? 'text-sm' : 'text-lg'
                            }`}>
                              <IndianRupee size={isMobile ? 14 : 18} />
                              {ticket.price}
                            </div>
                            {!isMobile && (
                              <div className="flex items-center gap-1">
                                <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                                  darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                                }`}>{cat}</span>
                                {cat === 'event' && (
                                  <span className={`hidden sm:inline px-2 py-1 rounded-full text-xs capitalize ${
                                    darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
                                  }`}>{ticket.event_type}</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={`flex items-center text-xs ${
                            isMobile ? 'justify-between gap-1' : 'gap-4'
                          } ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span className="flex items-center gap-1">
                              <MapPin size={10} />
                              {isMobile ? ticket.location.split(' ')[0] : ticket.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Ticket size={10} />
                              {ticket.quantity_available} left
                            </span>
                          </div>

                          <div className={`text-xs ${isMobile ? 'space-y-1' : 'mb-3'} ${
                            darkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <p className={`${isMobile ? 'font-medium text-blue-500' : 'font-medium'}`}>
                              {formatEventDate(ticket.event_date)}
                            </p>
                            {!isMobile && (
                              <p>{formatDate(ticket.event_date)}</p>
                            )}
                          </div>

                          <button className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg group-hover:scale-[1.02] ${
                            isMobile ? 'py-1.5 px-2 text-xs' : 'py-2.5 px-4'
                          }`}>
                            {isMobile ? 'View' : 'View Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal 
          ticket={selectedTicket} 
          onClose={() => setSelectedTicket(null)} 
        />
      )}
    </>
  );
}
