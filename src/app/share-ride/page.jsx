"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "../_components/Footer";
import { Car, Users, Search, Plus, ArrowRight, Calendar, MapPin, Eye, Navigation } from "lucide-react";
import { useUI } from "../lib/contexts/UniShareContext";

export default function ShareRideHubPage() {
  const { darkMode } = useUI();
  const [logoRotation, setLogoRotation] = useState(0);
  const [recentRides, setRecentRides] = useState([]);
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

  // Fetch recent rides from API
  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const { fetchRides } = await import('../lib/api');
        
        const result = await fetchRides({
          sort: 'created_at',
          order: 'desc',
          limit: 6
        });
        
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
            price: ride.price
          }));
          
          setRecentRides(transformedRides);
        }
      } catch (error) {
        console.error('Error fetching recent rides:', error);
        setRecentRides([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentRides();
  }, []);

  // Loading Component
  function LoadingScreen() {
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
              <div className="w-64 h-64 border-2 border-emerald-400/40 rounded-full animate-ping" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading...</h2>
          <p className="text-blue-100 mb-8 text-sm">
            Connecting riders and Provider...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingScreen />;
  }

  const cardBg = darkMode
    ? "bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700"
    : "bg-gradient-to-br from-white to-gray-50 border-gray-200";
  
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div 
              className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-2xl"
              style={{ transform: `rotate(${logoRotation}deg)` }}
            >
              <Car className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full blur-xl opacity-60 animate-pulse" />
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${textPrimary}`}>
            Share Your Ride
          </h1>
          <p className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto ${textSecondary}`}>
            Connect with fellow students to share rides, save money, and reduce your carbon footprint. 
            Find rides or offer yours to help the community.
          </p>
        </section>

        {/* Action Cards */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Find Ride Card */}
          <Link href="/share-ride/findride">
            <div className={`p-8 rounded-2xl border-2 hover:border-blue-400 transition-all duration-300 cursor-pointer group hover:shadow-2xl ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-blue-500 group-hover:translate-x-2 transition-transform" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>
                Find a Ride
              </h3>
              <p className={`text-base mb-4 ${textSecondary}`}>
                Search for available rides to your destination. Filter by location, time, and available seats.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Search filters
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Real-time updates
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  Contact drivers
                </span>
              </div>
            </div>
          </Link>

          {/* Post Ride Card */}
          <Link href="/share-ride/postride">
            <div className={`p-8 rounded-2xl border-2 hover:border-emerald-400 transition-all duration-300 cursor-pointer group hover:shadow-2xl ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-emerald-500 group-hover:translate-x-2 transition-transform" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>
                Offer a Ride
              </h3>
              <p className={`text-base mb-4 ${textSecondary}`}>
                Share your ride with others going in the same direction. Set your route, price, and available seats.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                  Easy posting
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                  Set your price
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-700'}`}>
                  Manage bookings
                </span>
              </div>
            </div>
          </Link>

          {/* Manage Requests Card */}
          <Link href="/share-ride/requests">
            <div className={`p-8 rounded-2xl border-2 hover:border-purple-400 transition-all duration-300 cursor-pointer group hover:shadow-2xl ${cardBg}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <ArrowRight className="w-6 h-6 text-purple-500 group-hover:translate-x-2 transition-transform" />
              </div>
              
              <h3 className={`text-2xl font-bold mb-3 ${textPrimary}`}>
                Manage Requests
              </h3>
              <p className={`text-base mb-4 ${textSecondary}`}>
                Review and respond to ride requests from other students. Approve or decline requests for your rides.
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  Request management
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  Instant notifications
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'}`}>
                  User profiles
                </span>
              </div>
            </div>
          </Link>
        </section>

        {/* Recent Rides Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${textPrimary}`}>Recent Rides</h2>
            <Link 
              href="/share-ride/findride" 
              className="text-blue-500 hover:text-blue-600 font-medium flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRides.map((ride) => (
              <div key={ride.id} className={`p-6 rounded-xl border transition-all hover:shadow-lg ${cardBg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className={`font-semibold ${textPrimary}`}>{ride.driver}</p>
                    <p className={`text-sm ${textSecondary}`}>Provider</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm ${textSecondary}`}>
                      {ride.from} → {ride.to}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span className={`text-sm ${textSecondary}`}>
                      {ride.date} at {ride.time}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-lg ${textPrimary}`}>₹{ride.price}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {ride.seats} seats
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {recentRides.length === 0 && (
            <div className={`text-center py-12 rounded-xl border-2 border-dashed ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
              <Navigation className={`w-16 h-16 mx-auto mb-4 ${textSecondary}`} />
              <h3 className={`text-xl font-semibold mb-2 ${textPrimary}`}>No Recent Rides</h3>
              <p className={`${textSecondary} mb-4`}>Be the first to post a ride and start building the community!</p>
              <Link 
                href="/share-ride/postride"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Post Your Ride
              </Link>
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="text-center">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-xl ${cardBg}`}>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${textPrimary}`}>Smart Search</h3>
              <p className={`text-sm ${textSecondary}`}>Find rides with advanced filters</p>
            </div>
            
            <div className={`p-6 rounded-xl ${cardBg}`}>
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${textPrimary}`}>Safe Community</h3>
              <p className={`text-sm ${textSecondary}`}>Verified student providers</p>
            </div>
            
            <div className={`p-6 rounded-xl ${cardBg}`}>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Car className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${textPrimary}`}>Easy Booking</h3>
              <p className={`text-sm ${textSecondary}`}>One-click ride requests</p>
            </div>
            
            <div className={`p-6 rounded-xl ${cardBg}`}>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Navigation className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className={`font-semibold mb-2 ${textPrimary}`}>Real-time Updates</h3>
              <p className={`text-sm ${textSecondary}`}>Live ride status tracking</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}