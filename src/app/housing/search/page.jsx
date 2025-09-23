//housing/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, IndianRupee, Calendar, Bed, Heart, Share2, Phone, Mail, Instagram, Filter, ChevronDown, Eye } from "lucide-react";
import { fetchhousedata } from "../../lib/api";


const Footer = ({ darkMode }) => (
  <footer className={`border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'} p-4 mt-12`}>
    <div className="max-w-6xl mx-auto text-center">
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        © 2025 RoomFinder. Find your perfect room.
      </p>
    </div>
  </footer>
);

// Room Card Component
const RoomCard = ({ room, darkMode }) => {
  const [liked, setLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const cardBg = darkMode ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200';
  const textPrimary = darkMode ? 'text-gray-100' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-300' : 'text-gray-600';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const nextImage = () => {
    if (room.photos && room.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % room.photos.length);
    }
  };

  const prevImage = () => {
    if (room.photos && room.photos.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + room.photos.length) % room.photos.length);
    }
  };

  return (
    <div className={`rounded-2xl border ${cardBg} overflow-hidden hover:shadow-xl transition-all duration-300 group`}>
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {room.photos && room.photos.length > 0 ? (
          <>
            <img
              src={room.photos[currentImageIndex]}
              alt={room.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {room.photos.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ←
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {room.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className={`w-full h-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
            <div className="text-center">
              <Bed className={`w-12 h-12 mx-auto mb-2 ${textMuted}`} />
              <p className={`text-sm ${textMuted}`}>No photos available</p>
            </div>
          </div>
        )}
        
        {/* Top Actions */}
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => setLiked(!liked)}
            className={`w-8 h-8 rounded-full ${
              liked ? 'bg-red-500 text-white' : 'bg-black/50 text-white'
            } flex items-center justify-center transition-colors`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ₹{room.rent?.toLocaleString()}/month
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className={`font-semibold text-lg mb-2 ${textPrimary} line-clamp-2`}>
          {room.title}
        </h3>
        
        <div className={`flex items-center gap-1 mb-3 ${textSecondary}`}>
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{room.location}</span>
          {room.landmark && (
            <span className={`text-sm ${textMuted}`}>• {room.landmark}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`flex items-center gap-2 ${textSecondary}`}>
            <Bed className="w-4 h-4" />
            <span className="text-sm">{room.beds} bed{room.beds > 1 ? 's' : ''}</span>
          </div>
          <div className={`flex items-center gap-2 ${textSecondary}`}>
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Move by {formatDate(room.move_in_date)}</span>
          </div>
        </div>

        {room.description && (
          <p className={`text-sm ${textMuted} mb-4 line-clamp-2`}>
            {room.description}
          </p>
        )}

        {room.preferences && (
          <div className="mb-4">
            <span className={`text-xs font-medium ${textSecondary} bg-gray-100 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} px-2 py-1 rounded-full`}>
              {room.preferences}
            </span>
          </div>
        )}

        {/* Contact Info */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {room.contact_info?.mobile && (
              <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </button>
            )}
            {room.contact_info?.email && (
              <button className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </button>
            )}
            {room.contact_info?.instagram && (
              <button className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HousingSearchPage() {
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [logoRotation, setLogoRotation] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

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

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async (searchParams = {}) => {
    setLoading(true);
    const response = await fetchhousedata(searchParams);
    setRooms(response.data || []);
    setPagination(response.pagination);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    
    const searchParams = {};
    if (q) searchParams.q = q;
    if (location) searchParams.location = location;
    if (budget) searchParams.maxRent = budget;
    if (moveIn) searchParams.moveInDate = moveIn;
    if (sortBy !== "newest") searchParams.sort = sortBy;

    await loadRooms(searchParams);
    setSearching(false);
  };

  const handleReset = () => {
    setQ("");
    setLocation("");
    setBudget("");
    setMoveIn("");
    setSortBy("newest");
    loadRooms();
  };

  const handleThemeToggle = () => setDarkMode((p) => !p);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100" : "bg-white border-gray-200 text-gray-900";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-900";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-600";
  const boxBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const boxBg = darkMode ? "bg-gray-900/60" : "bg-gray-50";

  return (
    <div className="min-h-screen">

      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl">

          {/* Search Form */}
          <div onSubmit={handleSearch} className={`mb-8 p-6 rounded-2xl border ${boxBorder} ${boxBg}`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="e.g., 1BHK near campus, female roommate"
                    className={`w-full pl-9 pr-3 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Area / landmark"
                    className={`w-full pl-9 pr-3 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Max budget (₹/month)</label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="5000"
                    className={`w-full pl-9 pr-3 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Filters */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 text-sm ${labelClr} hover:text-blue-600 transition-colors`}
              >
                <Filter className="w-4 h-4" />
                More Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Move-in by</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={moveIn}
                        onChange={(e) => setMoveIn(e.target.value)}
                        className={`w-full pl-9 pr-3 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Sort by</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="newest">Newest first</option>
                      <option value="rent_low">Rent: Low to High</option>
                      <option value="rent_high">Rent: High to Low</option>
                      <option value="move_in">Move-in date</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="submit" 
                disabled={searching}
                onClick={handleSearch}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition-colors"
              >
                <Search className="w-4 h-4" />
                {searching ? 'Searching...' : 'Search'}
              </button>
              <button 
                type="button" 
                onClick={handleReset}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  darkMode 
                    ? 'border-gray-700 text-gray-200 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                }`}
              >
                Reset
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className={`text-xl font-semibold ${titleClr}`}>
              {loading ? 'Loading...' : `${rooms.length} rooms found`}
            </h2>
            {pagination && (
              <p className={`text-sm ${textMuted}`}>
                Page {pagination.page} of {pagination.pages}
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`rounded-2xl border ${boxBorder} ${boxBg} overflow-hidden animate-pulse`}>
                  <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded mb-4 w-3/4"></div>
                    <div className="flex gap-2">
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results Grid */}
          {!loading && rooms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} darkMode={darkMode} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && rooms.length === 0 && (
            <div className={`text-center py-12 rounded-2xl border ${boxBorder} ${boxBg}`}>
              <Search className={`w-16 h-16 mx-auto mb-4 ${textMuted}`} />
              <h3 className={`text-lg font-semibold ${titleClr} mb-2`}>No rooms found</h3>
              <p className={`${textMuted} mb-4`}>
                Try adjusting your search criteria or location
              </p>
              <button 
                onClick={handleReset}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}