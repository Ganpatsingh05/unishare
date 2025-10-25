"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUI } from "../lib/contexts/UniShareContext";
import { Search, Car, ArrowRight, Users, MapPin, Calendar, Clock, IndianRupee, Eye, Plus } from "lucide-react";
import SmallFooter from "../_components/SmallFooter";

export default function ShareRideHubPage() {
  // Use proper dark mode from context
  const { darkMode } = useUI();

  const [recentRides, setRecentRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);

  const cardBorder = darkMode ? "border-gray-700/50" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-800/50" : "bg-white/80";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-800";
  const tipBg = darkMode ? "bg-gray-800/60" : "bg-gray-100";
  const tipBorder = darkMode ? "border-gray-700/50" : "border-gray-300";
  const badgeBlue = darkMode ? "text-blue-300 bg-blue-500/20" : "text-blue-700 bg-blue-100";
  const badgeGreen = darkMode ? "text-emerald-300 bg-emerald-500/20" : "text-emerald-700 bg-emerald-100";
  const badgePurple = darkMode ? "text-purple-300 bg-purple-500/20" : "text-purple-700 bg-purple-100";

  // Fetch latest rides on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchRides } = await import("../lib/api");
        const result = await fetchRides({ sort: "created_at", order: "desc", limit: 6 });
        if (!cancelled && result?.success) {
          const data = Array.isArray(result.data) ? result.data : [];
          // Normalize field names to display
          const normalized = data.map((ride) => ({
            id: ride.id ?? ride._id ?? Math.random().toString(36).slice(2),
            driver: ride.driver_name || ride.users?.name || ride.user?.name || "Anonymous",
            from: ride.from || ride.from_location || "-",
            to: ride.to || ride.to_location || "-",
            date: ride.date || "",
            time: ride.time || "",
            seats: ride.seats ?? ride.available_seats ?? "-",
            price: ride.price ?? "-",
          }));
          setRecentRides(normalized);
        }
      } catch (e) {
        // silently fail; keep empty state
      } finally {
        if (!cancelled) setLoadingRides(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50'}`}>
      <main className="relative flex-1 min-h-[115vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-24">
        {/* subtle background glow */}
        <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 w-[42rem] max-w-[90vw] h-72 rounded-full bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Ride Sharing</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>What would you like to do?</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Find a ride */}
            <Link
              href="/share-ride/findride"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeBlue}`}>
                  <Search className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Find a ride</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeBlue}`}>Popular</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    Browse available rides posted by students. Filter by route, time, and seats.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Start browsing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Offer a ride */}
            <Link
              href="/share-ride/postride"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeGreen}`}>
                  <Car className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Offer a ride</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeGreen}`}>New</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    Share your ride with others going the same way. Set price and available seats.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Create a listing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Manage requests */}
            <Link
              href="/share-ride/requests"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgePurple}`}>
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Manage requests</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgePurple}`}>Manage</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    Review and respond to ride requests for your posted rides.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                    Open requests
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent rides */}
          <section className="mt-8 sm:mt-10">
            <div className="mb-4 sm:mb-6 flex items-center justify-between">
              <h2 className={`text-lg sm:text-xl font-semibold ${titleClr}`}>Recent rides</h2>
              <Link href="/share-ride/findride" className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'} hover:underline`}>
                View all
              </Link>
            </div>

            {loadingRides ? (
              <div className={`rounded-2xl border ${cardBorder} ${cardBg} p-6 text-sm ${textMuted}`}>
                Loading latest rides...
              </div>
            ) : recentRides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className={`p-4 rounded-xl border hover:shadow-lg transition-all duration-200 cursor-pointer ${cardBg} hover:border-blue-300 dark:hover:border-blue-600`}
                  >
                    {/* Route with Visual Connector */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${titleClr} truncate`}>
                            {ride.from}
                          </p>
                          <p className={`text-sm font-medium ${titleClr} truncate mt-1`}>
                            {ride.to}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time - Horizontal */}
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-emerald-500" />
                        <span className={`${textMuted}`}>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-purple-500" />
                        <span className={`${textMuted}`}>{ride.time}</span>
                      </div>
                    </div>

                    {/* Price & Seats */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4 text-emerald-600" />
                        <span className="text-lg font-bold text-emerald-600">{ride.price !== '-' ? ride.price : '—'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-orange-500" />
                        <span className={`text-sm ${textMuted}`}>{ride.seats} seats</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Link
                        href="/share-ride/findride"
                        className={`flex-1 px-3 py-2 border text-xs rounded-lg transition-colors flex items-center justify-center gap-1 ${
                          darkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </Link>
                      <Link
                        href="/share-ride/findride"
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Join
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`rounded-2xl border ${cardBorder} ${cardBg} p-6 text-center`}>
                <p className={`text-sm ${textMuted}`}>No recent rides yet. Be the first to post one!</p>
                <div className="mt-4">
                  <Link href="/share-ride/postride" className={`inline-flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-700'} hover:underline`}>
                    Post your ride <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Or divider */}
          <div className="my-8 flex items-center gap-3">
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
            <span className={`text-xs ${textMuted}`}>or</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          {/* Helpful tips */}
          <div className={`rounded-2xl border ${tipBorder} ${tipBg} p-4 sm:p-5`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-yellow-500/10 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                <Users className="w-4 h-4" />
              </div>
              <p className={`text-xs sm:text-sm ${textMuted}`}>
                Safety tip: meet in public places for pickups, verify profiles, and share your trip with a friend.
              </p>
            </div>
          </div>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}