"use client";

import React, { useMemo, useState, useEffect } from "react";
import Footer from "../../_components/Footer";
import {
  Car,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Instagram,
  Mail,
  Link2,
  ArrowLeft,
  Search,
  Filter,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";
import { useUI, useAuth, useMessages } from "../../lib/contexts/UniShareContext";
import Link from "next/link";

// Loading Component
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");
  const [dots, setDots] = useState("");

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    // Animated dots
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    // Loading text variations
    const textVariations = [
      "Finding rides",
      "Loading drivers", 
      "Searching routes",
      "Almost ready"
    ];
    let textIndex = 0;
    const textInterval = setInterval(() => {
      setLoadingText(textVariations[textIndex]);
      textIndex = (textIndex + 1) % textVariations.length;
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotsInterval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900">
      <div className="relative z-10 text-center">
        <div className="mb-8 relative">
          <div className="w-56 h-56 mx-auto mb-4 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
            <img 
              src="/rideshare.gif" 
              alt="RideShare Navigator" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-blue-400/40 rounded-full animate-ping" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {loadingText}{dots}
        </h2>
        <p className="text-blue-100 mb-8 text-sm">
          Searching for available rides...
        </p>

        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 h-full rounded-full transition-all duration-100 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-white/80 text-xs font-medium">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindRidePage() {
  const { darkMode } = useUI();
  const { isAuthenticated } = useAuth();
  const { showTemporaryMessage } = useMessages();
  const [isLoading, setIsLoading] = useState(true);
  
  // Search filters
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState("");
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // State for rides data
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rides from API
  const fetchRides = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { fetchRides: fetchRidesAPI } = await import('../../lib/api');
      
      const filters = {};
      if (fromLoc.trim()) filters.from = fromLoc.trim();
      if (toLoc.trim()) filters.to = toLoc.trim();
      if (date) filters.date = date;
      if (seatsNeeded > 1) filters.seatsNeeded = seatsNeeded;
      
      const result = await fetchRidesAPI(filters);
      
      if (result.success) {
        // Transform backend data to match frontend format
        const transformedRides = result.data.map(ride => ({
          id: ride.id,
          driver: ride.driver_name || ride.users?.name || 'Anonymous',
          from: ride.from_location,
          to: ride.to_location,
          date: ride.date,
          time: ride.time,
          seats: ride.available_seats,
          price: ride.price,
          vehicle: ride.vehicle_info,
          description: ride.description,
          contacts: Object.entries(ride.contact_info || {}).map(([type, value]) => ({
            type,
            value
          }))
        }));
        
        setRides(transformedRides);
      } else {
        throw new Error(result.error || 'Failed to fetch rides');
      }
    } catch (error) {
      console.error('Error fetching rides:', error);
      setError(error.message);
      setRides([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch rides on component mount and when filters change
  useEffect(() => {
    fetchRides();
  }, [fromLoc, toLoc, date, seatsNeeded]);

  const filteredRides = rides;

  const handleLoadingComplete = () => setIsLoading(false);

  // Handle join ride request
  const handleJoinRide = async (rideId, ride) => {
    if (!isAuthenticated) {
      showTemporaryMessage("Please login to join rides", "error");
      return;
    }

    try {
      const { requestRideJoin } = await import('../../lib/api');
      
      const requestData = {
        seatsRequested: 1,
        message: `Hi! I would like to join your ride from ${ride.from} to ${ride.to} on ${ride.date}.`,
        contactMethod: 'mobile'
      };

      const result = await requestRideJoin(rideId, requestData);
      
      if (result.success) {
        showTemporaryMessage(result.message || "Join request sent successfully!", "success");
      } else {
        throw new Error(result.error || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error joining ride:', error);
      showTemporaryMessage(error.message || "Failed to send join request", "error");
    }
  };

  const iconForType = (type) => {
    switch (type) {
      case "mobile":
        return <Phone className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Link2 className="w-4 h-4" />;
    }
  };

  // Common styles
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const cardBg = darkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-gray-200";

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/share-ride" 
            className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Share Ride Hub
          </Link>
          
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${titleClr} mb-2`}>
                Find a Ride
              </h1>
              <p className={`text-sm ${labelClr}`}>
                Search for available rides to your destination
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters 
                  ? "bg-blue-500 text-white border-blue-500" 
                  : darkMode 
                    ? "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700" 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Search Filters */}
        <section className={`mb-8 p-6 rounded-xl border transition-all ${cardBg} ${
          showFilters ? "block" : "hidden"
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>
                From Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={fromLoc}
                  onChange={(e) => setFromLoc(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors ${inputBg}`}
                  placeholder="Starting point..."
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>
                To Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={toLoc}
                  onChange={(e) => setToLoc(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors ${inputBg}`}
                  placeholder="Destination..."
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>
                Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors ${inputBg}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>
                Seats Needed
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={seatsNeeded}
                  onChange={(e) => setSeatsNeeded(Number(e.target.value))}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-colors ${inputBg}`}
                >
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {(fromLoc || toLoc || date || seatsNeeded > 1) && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setFromLoc("");
                  setToLoc("");
                  setDate("");
                  setSeatsNeeded(1);
                }}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-semibold ${titleClr}`}>
            Available Rides ({loading ? '...' : filteredRides.length})
          </h2>
          <div className="flex items-center gap-4">
            {error && (
              <button
                onClick={fetchRides}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                <Search className="w-4 h-4" />
                Retry
              </button>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : `${filteredRides.length} result${filteredRides.length !== 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        {/* Rides List */}
        <section className="space-y-4">
          {loading ? (
            <div className={`text-center py-12 rounded-xl border ${cardBg}`}>
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <h3 className={`text-xl font-semibold mb-2 ${titleClr}`}>Loading Rides...</h3>
              <p className={`${labelClr}`}>Searching for available rides</p>
            </div>
          ) : error ? (
            <div className={`text-center py-12 rounded-xl border-2 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700`}>
              <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className={`text-xl font-semibold mb-2 text-red-700 dark:text-red-300`}>Error Loading Rides</h3>
              <p className={`text-red-600 dark:text-red-400 mb-4`}>{error}</p>
              <button
                onClick={fetchRides}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
              darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <Car className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${titleClr}`}>No Rides Found</h3>
              <p className={`${labelClr} mb-4`}>
                Try adjusting your search criteria or check back later for new rides.
              </p>
              <Link 
                href="/share-ride/postride"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Post Your Ride Instead
              </Link>
            </div>
          ) : (
            filteredRides.map((ride) => (
              <div key={ride.id} className={`p-6 rounded-xl border hover:shadow-lg transition-all ${cardBg}`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Driver Info */}
                  <div className="flex items-center gap-3 min-w-0 lg:w-48">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-semibold truncate ${titleClr}`}>{ride.driver}</p>
                      <p className={`text-sm truncate ${labelClr}`}>{ride.vehicle}</p>
                    </div>
                  </div>

                  {/* Route Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className={`text-sm font-medium truncate ${titleClr}`}>
                        {ride.from} → {ride.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span className={labelClr}>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span className={labelClr}>{ride.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className={labelClr}>{ride.seats} seats</span>
                      </div>
                    </div>
                    {ride.description && (
                      <p className={`text-sm mt-2 ${labelClr} line-clamp-2`}>{ride.description}</p>
                    )}
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between lg:flex-col lg:items-end gap-4 lg:w-40">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
                        <IndianRupee className="w-4 h-4" />
                        {ride.price}
                      </div>
                      <p className={`text-xs ${labelClr}`}>per person</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 lg:items-end">
                      <div className="flex gap-2">
                        {ride.contacts && ride.contacts.map((contact, idx) => (
                          <button
                            key={idx}
                            className={`p-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              darkMode ? 'border-gray-700' : 'border-gray-300'
                            }`}
                            title={`${contact.type}: ${contact.value}`}
                          >
                            {iconForType(contact.type)}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleJoinRide(ride.id, ride)}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Join Ride
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Quick Actions */}
        <section className="mt-12 text-center">
          <p className={`mb-4 ${labelClr}`}>
            Can't find what you're looking for?
          </p>
          <Link 
            href="/share-ride/postride"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Post Your Own Ride
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}