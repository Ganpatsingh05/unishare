"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUI } from "./../../lib/contexts/UniShareContext";
import { Search, Car, ArrowRight, Users, MapPin, Calendar, Clock, IndianRupee, Eye, Plus } from "lucide-react";
import SmallFooter from "./../../_components/layout/SmallFooter";
import ShareRideTheme from "./../../_components/ServicesTheme/EarthTheme";

export default function ShareRideHubPage() {
  // Use proper dark mode from context
  const { darkMode } = useUI();

  const [recentRides, setRecentRides] = useState([]);
  const [loadingRides, setLoadingRides] = useState(true);

  const cardBorder = darkMode ? "border-gray-600/30" : "border-gray-300/40";
  const cardBg = darkMode ? "bg-[#1a1a1a]/80 backdrop-blur-2xl" : "bg-[#2a2a2a]/75 backdrop-blur-2xl";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-200";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-100";
  const tipBg = darkMode ? "bg-[#1a1a1a]/80 backdrop-blur-2xl" : "bg-[#2a2a2a]/75 backdrop-blur-2xl";
  const tipBorder = darkMode ? "border-gray-600/30" : "border-gray-500/30";
  const badgeBlue = darkMode ? "text-blue-300 bg-blue-500/20" : "text-blue-700 bg-blue-100";
  const badgeGreen = darkMode ? "text-emerald-300 bg-emerald-500/20" : "text-emerald-700 bg-emerald-100";
  const badgePurple = darkMode ? "text-purple-300 bg-purple-500/20" : "text-purple-700 bg-purple-100";

  // Fetch latest rides on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { fetchRides } = await import("../../lib/api");
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
    <div className={`min-h-screen flex flex-col relative transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* ShareRide Mercury Gray Theme */}
      <ShareRideTheme />
      
      <main className="relative flex-1 min-h-[115vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                letterSpacing: '-0.03em'
              }}>
              <span style={{ color: '#facc15' }}>Ride</span> <span style={{ color: '#38bdf8' }}>Sharing</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium" style={{ color: '#93C5FD' }}>
              What would you like to do?
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Find a ride */}
            <Link
              href="/share-ride/findride"
              className="group h-full transform rounded-[28px] border backdrop-blur-lg hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 relative overflow-hidden"
              style={{
                background: '#1D3557',
                borderColor: 'rgba(255,255,255,0.05)',
                boxShadow: `
                  0 20px 40px -10px rgba(29, 53, 87, 0.25),
                  0 8px 16px -4px rgba(0,0,0,0.2)
                `
              }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-105" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-108" />
                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/25" />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-[18px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: '#1D3557',
                      boxShadow: '0 12px 24px -6px rgba(29, 53, 87, 0.6)',
                      color: '#ffffff'
                    }}>
                    <Search className="w-6 h-6" style={{ transform: 'scale(1.05)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-lg font-black tracking-tight leading-tight"
                        style={{
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                        <span style={{ color: '#facc15' }}>Find</span> <span style={{ color: '#38bdf8' }}>a ride</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1.2px solid rgba(56, 189, 248, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>Popular</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: '#38bdf8'
                    }}>
                      Browse available rides posted by students. Filter by route, time, and seats.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold group-hover:gap-3 transition-all duration-300" style={{ color: '#38bdf8' }}>
                      Start browsing
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Offer a ride */}
            <Link
              href="/share-ride/postride"
              className="group h-full transform rounded-[28px] border backdrop-blur-lg hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 relative overflow-hidden"
              style={{
                background: '#1D3557',
                borderColor: 'rgba(255,255,255,0.05)',
                boxShadow: `
                  0 20px 40px -10px rgba(29, 53, 87, 0.25),
                  0 8px 16px -4px rgba(0,0,0,0.2)
                `
              }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-105" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-108" />
                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/25" />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: '#1D3557',
                      boxShadow: '0 12px 24px -6px rgba(29, 53, 87, 0.6)',
                      color: '#ffffff'
                    }}>
                    <Car className="w-6 h-6" style={{ transform: 'scale(1.05)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-lg font-black tracking-tight leading-tight"
                        style={{
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                        <span style={{ color: '#facc15' }}>Offer</span> <span style={{ color: '#38bdf8' }}>a ride</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: 'rgba(250, 204, 21, 0.15)',
                        color: '#facc15',
                        border: '1.2px solid rgba(250, 204, 21, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>New</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: '#facc15'
                    }}>
                      Share your ride with others going the same way. Set price and available seats.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold group-hover:gap-3 transition-all duration-300" style={{ color: '#facc15' }}>
                      Create a listing
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Manage requests */}
            <Link
              href="/my-activity/requests/sharerideREQ"
              className="group h-full transform rounded-[28px] border backdrop-blur-lg hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2 relative overflow-hidden"
              style={{
                background: '#1D3557',
                borderColor: 'rgba(255,255,255,0.05)',
                boxShadow: `
                  0 20px 40px -10px rgba(29, 53, 87, 0.25),
                  0 8px 16px -4px rgba(0,0,0,0.2)
                `
              }}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-105" />
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/10 transition-transform duration-400 group-hover:scale-108" />
                <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-white/25" />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: '#1D3557',
                      boxShadow: '0 12px 24px -6px rgba(29, 53, 87, 0.6)',
                      color: '#ffffff'
                    }}>
                    <Users className="w-6 h-6" style={{ transform: 'scale(1.05)' }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-lg font-black tracking-tight leading-tight"
                        style={{
                          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                          letterSpacing: '-0.02em'
                        }}>
                        <span style={{ color: '#facc15' }}>Manage</span> <span style={{ color: '#38bdf8' }}>requests</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        border: '1.2px solid rgba(56, 189, 248, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>Manage</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: '#38bdf8'
                    }}>
                      Review and respond to ride requests for your posted rides.
                    </p>
                    <span className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold group-hover:gap-3 transition-all duration-300" style={{ color: '#38bdf8' }}>
                      Open requests
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
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
              <div className="rounded-[28px] border backdrop-blur-lg p-6 text-sm relative overflow-hidden"
                style={{
                  background: '#1D3557',
                  borderColor: 'rgba(255,255,255,0.05)',
                  boxShadow: `
                    0 20px 40px -10px rgba(29, 53, 87, 0.25),
                    0 8px 16px -4px rgba(0,0,0,0.2)
                  `
                }}>
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-2 border-white/10" />
                  <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 border-white/10" />
                  <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-white/20" />
                  <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/25" />
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)',
                  opacity: 0.6
                }} />
                <p className="text-white relative z-10">Loading latest rides...</p>
              </div>
            ) : recentRides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recentRides.map((ride) => (
                  <div 
                    key={ride.id} 
                    className="group p-5 rounded-[24px] border backdrop-blur-lg hover:shadow-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 cursor-pointer relative overflow-hidden"
                    style={{
                      background: '#1D3557',
                      borderColor: 'rgba(255,255,255,0.05)',
                      boxShadow: `
                        0 15px 35px -10px rgba(29, 53, 87, 0.25),
                        0 6px 12px -3px rgba(0,0,0,0.2)
                      `
                    }}
                  >
                    {/* Decorative Elements */}
                    <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full border-2 border-white/10 pointer-events-none" />
                    <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 border-white/10 pointer-events-none" />
                    <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-white/20 pointer-events-none" />
                    <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-1.5 pointer-events-none">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                    </div>

                    {/* Gradient Overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-60 rounded-[24px]"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                      }}
                    />
                  
                    {/* Route with Visual Connector */}
                    <div className="mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <div className="w-0.5 h-4 bg-gradient-to-b from-blue-500 to-emerald-500"></div>
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: '#facc15' }}>
                            {ride.from}
                          </p>
                          <p className="text-sm font-bold truncate mt-1" style={{ color: '#38bdf8' }}>
                            {ride.to}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Date & Time - Horizontal */}
                    <div className="flex items-center justify-between mb-3 text-xs relative z-10">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" style={{ color: '#facc15' }} />
                        <span style={{ color: '#facc15' }}>{ride.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" style={{ color: '#38bdf8' }} />
                        <span style={{ color: '#38bdf8' }}>{ride.time}</span>
                      </div>
                    </div>

                    {/* Price & Seats */}
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-4 h-4" style={{ color: '#facc15' }} />
                        <span className="text-lg font-bold" style={{ color: '#facc15' }}>{ride.price !== '-' ? ride.price : '—'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" style={{ color: '#38bdf8' }} />
                        <span className="text-sm" style={{ color: '#38bdf8' }}>{ride.seats} seats</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 relative z-10">
                      <Link
                        href="/share-ride/findride"
                        className="flex-1 px-3 py-2.5 border border-white/10 text-xs font-medium rounded-xl backdrop-blur-md bg-white/5 text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-1.5 group"
                      >
                        <Eye className="w-3.5 h-3.5 group-hover:scale-110 transition-transform duration-300" />
                        Details
                      </Link>
                      <Link
                        href="/share-ride/findride"
                        className="flex-1 px-3 py-2.5 text-xs font-medium rounded-xl backdrop-blur-md border border-white/10 bg-white/10 text-white hover:bg-white/20 hover:border-white/20 transition-all duration-500 flex items-center justify-center gap-1.5 group"
                      >
                        <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-500" />
                        Join
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border backdrop-blur-lg p-8 text-center relative overflow-hidden"
                style={{
                  background: '#1D3557',
                  borderColor: 'rgba(255,255,255,0.05)',
                  boxShadow: `
                    0 15px 35px -10px rgba(29, 53, 87, 0.25),
                    0 6px 12px -3px rgba(0,0,0,0.2)
                  `
                }}>
                {/* Decorative Elements */}
                <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full border-2 border-white/10 pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border-2 border-white/10 pointer-events-none" />
                <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-white/20 pointer-events-none" />
                <div className="absolute bottom-8 right-8 grid grid-cols-2 gap-1.5 pointer-events-none">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                </div>

                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-60 rounded-[28px]"
                  style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  }}
                />

                <div className="relative z-10">
                  <p className="text-sm font-medium" style={{ color: '#facc15' }}>No recent rides yet. <span style={{ color: '#38bdf8' }}>Be the first to post one!</span></p>
                  <div className="mt-4">
                    <Link href="/share-ride/postride" className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity" style={{ color: '#facc15' }}>
                      Post your ride <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
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
          <div className="rounded-[28px] border backdrop-blur-lg p-5 sm:p-6 relative overflow-hidden"
            style={{
              background: '#1D3557',
              borderColor: 'rgba(251, 191, 36, 0.2)',
              boxShadow: `
                0 15px 35px -10px rgba(29, 53, 87, 0.25),
                0 6px 12px -3px rgba(0,0,0,0.2)
              `
            }}>
            {/* Decorative Elements */}
            <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full border-2 border-white/10 pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full border-2 border-white/10 pointer-events-none" />
            <div className="absolute top-8 left-8 w-3 h-3 rounded-full bg-white/20 pointer-events-none" />
            <div className="absolute bottom-8 right-8 grid grid-cols-2 gap-1.5 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
            </div>

            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-60 rounded-[28px]"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
              }}
            />

            <div className="relative z-10 flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
                  boxShadow: `
                    0 8px 25px rgba(250, 204, 21, 0.3),
                    inset 0 2px 0 rgba(255, 255, 255, 0.3)
                  `
                }}>
                <Users className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 70%)`
                  }} />
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-medium"
                style={{ 
                  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                }}>
                <span style={{ color: '#facc15' }}>Safety tip:</span> <span style={{ color: '#38bdf8' }}>meet in public places for pickups, verify profiles, and share your trip with a friend.</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}
