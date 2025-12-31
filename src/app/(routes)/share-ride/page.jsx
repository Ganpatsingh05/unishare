"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
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
  const [isMobile, setIsMobile] = useState(false);

  // ✅ PERFORMANCE: Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ✅ PERFORMANCE: Detect low-performance devices
  const isLowPerf = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    const deviceMem = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 4;
    return isMobile || deviceMem <= 4 || cores <= 2;
  }, [isMobile]);

  // ✅ PERFORMANCE: Adaptive blur for mobile
  const adaptiveBlur = useMemo(() => {
    if (isMobile) return 'backdrop-blur-sm';
    if (isLowPerf) return 'backdrop-blur-md';
    return 'backdrop-blur-lg';
  }, [isMobile, isLowPerf]);

  // ✅ PERFORMANCE: Memoized card styling based on theme and device
  const cardStyle = useMemo(() => {
    if (darkMode) {
      return {
        background: '#1D3557',
        borderColor: 'rgba(255,255,255,0.05)',
        boxShadow: isMobile
          ? '0 15px 30px -8px rgba(29, 53, 87, 0.25), 0 6px 12px -3px rgba(0,0,0,0.2)'
          : '0 20px 40px -10px rgba(29, 53, 87, 0.25), 0 8px 16px -4px rgba(0,0,0,0.2)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        boxShadow: isMobile
          ? '0 15px 30px -8px rgba(100, 116, 139, 0.15), 0 6px 12px -3px rgba(71, 85, 105, 0.1)'
          : '0 20px 40px -10px rgba(100, 116, 139, 0.15), 0 8px 16px -4px rgba(71, 85, 105, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.5)'
      };
    }
  }, [darkMode, isMobile]);

  const smallCardStyle = useMemo(() => {
    if (darkMode) {
      return {
        background: '#1D3557',
        borderColor: 'rgba(255,255,255,0.05)',
        boxShadow: isMobile
          ? '0 10px 25px -8px rgba(29, 53, 87, 0.25), 0 4px 8px -2px rgba(0,0,0,0.2)'
          : '0 15px 35px -10px rgba(29, 53, 87, 0.25), 0 6px 12px -3px rgba(0,0,0,0.2)'
      };
    } else {
      return {
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        boxShadow: isMobile
          ? '0 10px 25px -8px rgba(100, 116, 139, 0.15), 0 4px 8px -2px rgba(71, 85, 105, 0.1)'
          : '0 15px 35px -10px rgba(100, 116, 139, 0.15), 0 6px 12px -3px rgba(71, 85, 105, 0.1), inset 0 2px 0 rgba(255, 255, 255, 0.5)'
      };
    }
  }, [darkMode, isMobile]);

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
    <div className={`min-h-screen flex flex-col relative transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-sky-50'}`}>
      {/* ShareRide Mercury Gray Theme */}
      <ShareRideTheme />
      
      <main className="relative flex-1 min-h-[115vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-8">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 sm:mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight"
              style={{
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                letterSpacing: '-0.03em'
              }}>
              <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Ride</span> <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>Sharing</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base font-medium" style={{ color: darkMode ? '#93C5FD' : '#0369a1' }}>
              What would you like to do?
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Find a ride */}
            <Link
              href="/share-ride/findride"
              className={`group h-full transform rounded-[28px] border ${adaptiveBlur} hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 relative overflow-hidden`}
              style={cardStyle}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-105`} />
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-108`} />
                <div className={`absolute top-10 left-10 w-4 h-4 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/30'}`} />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/15' : 'bg-blue-400/20'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/25' : 'bg-blue-400/30'}`} />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: darkMode 
                  ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-[18px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: darkMode ? '#1D3557' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: darkMode 
                        ? '0 12px 24px -6px rgba(29, 53, 87, 0.6)' 
                        : '0 12px 24px -6px rgba(14, 165, 233, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
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
                        <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Find</span> <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>a ride</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                        color: darkMode ? '#38bdf8' : '#0284c7',
                        border: darkMode ? '1.2px solid rgba(56, 189, 248, 0.3)' : '1.2px solid rgba(14, 165, 233, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>Popular</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: darkMode ? '#38bdf8' : '#0369a1'
                    }}>
                      Browse available rides posted by students. Filter by route, time, and seats.
                    </p>
                    <span className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border text-xs font-bold group-hover:gap-3 transition-all duration-300 ${
                      darkMode ? 'bg-white/10 border-white/20' : 'bg-blue-50/50 border-blue-200/50'
                    }`} style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>
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
              className={`group h-full transform rounded-[28px] border ${adaptiveBlur} hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 relative overflow-hidden`}
              style={cardStyle}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-105`} />
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-108`} />
                <div className={`absolute top-10 left-10 w-4 h-4 rounded-full ${darkMode ? 'bg-white/20' : 'bg-amber-400/30'}`} />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/15' : 'bg-amber-400/20'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-amber-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-amber-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/25' : 'bg-amber-400/30'}`} />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: darkMode 
                  ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: darkMode ? '#1D3557' : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      boxShadow: darkMode 
                        ? '0 12px 24px -6px rgba(29, 53, 87, 0.6)' 
                        : '0 12px 24px -6px rgba(245, 158, 11, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
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
                        <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Offer</span> <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>a ride</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: darkMode ? 'rgba(250, 204, 21, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                        color: darkMode ? '#facc15' : '#d97706',
                        border: darkMode ? '1.2px solid rgba(250, 204, 21, 0.3)' : '1.2px solid rgba(245, 158, 11, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>New</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: darkMode ? '#facc15' : '#92400e'
                    }}>
                      Share your ride with others going the same way. Set price and available seats.
                    </p>
                    <span className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border text-xs font-bold group-hover:gap-3 transition-all duration-300 ${
                      darkMode ? 'bg-white/10 border-white/20' : 'bg-amber-50/50 border-amber-200/50'
                    }`} style={{ color: darkMode ? '#facc15' : '#b45309' }}>
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
              className={`group h-full transform rounded-[28px] border ${adaptiveBlur} hover:-translate-y-2 hover:scale-[1.01] transition-all duration-500 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2 relative overflow-hidden`}
              style={cardStyle}
            >
              {/* Decorative background elements */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                <div className={`absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-105`} />
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} transition-transform duration-400 group-hover:scale-108`} />
                <div className={`absolute top-10 left-10 w-4 h-4 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/30'}`} />
                <div className="absolute bottom-10 right-10 grid grid-cols-2 gap-2">
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/15' : 'bg-blue-400/20'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                  <div className={`w-2 h-2 rounded-full ${darkMode ? 'bg-white/25' : 'bg-blue-400/30'}`} />
                </div>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{
                background: darkMode 
                  ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                opacity: 0.6
              }} />
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-4deg]"
                    style={{
                      background: darkMode ? '#1D3557' : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      boxShadow: darkMode 
                        ? '0 12px 24px -6px rgba(29, 53, 87, 0.6)' 
                        : '0 12px 24px -6px rgba(14, 165, 233, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
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
                        <span style={{ color: darkMode ? '#facc15' : '#f59e0b' }}>Manage</span> <span style={{ color: darkMode ? '#38bdf8' : '#0ea5e9' }}>requests</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase" style={{
                        background: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.15)',
                        color: darkMode ? '#38bdf8' : '#0284c7',
                        border: darkMode ? '1.2px solid rgba(56, 189, 248, 0.3)' : '1.2px solid rgba(14, 165, 233, 0.3)',
                        letterSpacing: '0.08em',
                        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                      }}>Manage</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{
                      lineHeight: '1.6',
                      fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                      fontWeight: 400,
                      color: darkMode ? '#38bdf8' : '#0369a1'
                    }}>
                      Review and respond to ride requests for your posted rides.
                    </p>
                    <span className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm border text-xs font-bold group-hover:gap-3 transition-all duration-300 ${
                      darkMode ? 'bg-white/10 border-white/20' : 'bg-blue-50/50 border-blue-200/50'
                    }`} style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>
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
              <h2 className={`text-lg sm:text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Recent rides</h2>
              <Link href="/share-ride/findride" className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'} hover:underline`}>
                View all
              </Link>
            </div>

            {loadingRides ? (
              <div className={`rounded-[28px] border ${adaptiveBlur} p-6 text-sm relative overflow-hidden`}
                style={smallCardStyle}>
                {/* Decorative background elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
                  <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`} />
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'}`} />
                  <div className={`absolute top-6 left-6 w-3 h-3 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/30'}`} />
                  <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/15' : 'bg-blue-400/20'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                    <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/25' : 'bg-blue-400/30'}`} />
                  </div>
                </div>
                {/* Gradient overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background: darkMode 
                    ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)',
                  opacity: 0.6
                }} />
                <p className={`relative z-10 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Loading latest rides...</p>
              </div>
            ) : recentRides.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recentRides.map((ride) => (
                  <Link
                    href="/share-ride/findride"
                    key={ride.id} 
                    className={`group rounded-2xl ${adaptiveBlur} hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer relative overflow-hidden`}
                    style={smallCardStyle}
                  >
                    {/* ✅ PERFORMANCE: Only render decorative SVGs on desktop */}
                    {!isMobile && (
                    <>
                    {/* Road Path - Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 opacity-20 pointer-events-none">
                      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full h-full">
                        {/* Road */}
                        <path d="M0,60 Q100,50 200,55 T400,60 L400,80 L0,80 Z" 
                          fill={darkMode ? 'white' : '#1e293b'} 
                          opacity="0.3"/>
                        {/* Road markings - reduced from 6 to 3 */}
                        <rect x="100" y="62" width="30" height="3" 
                          fill={darkMode ? '#1D3557' : '#f8fafc'} 
                          opacity="0.6"/>
                        <rect x="200" y="62" width="30" height="3" 
                          fill={darkMode ? '#1D3557' : '#f8fafc'} 
                          opacity="0.6"/>
                        <rect x="300" y="62" width="30" height="3" 
                          fill={darkMode ? '#1D3557' : '#f8fafc'} 
                          opacity="0.6"/>
                      </svg>
                    </div>

                    {/* Car Icon - Bottom Left */}
                    <div className="absolute bottom-3 left-4 opacity-15 pointer-events-none">
                      <svg width="40" height="24" viewBox="0 0 24 14" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 11.5a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm10 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm-9.5-6L7 3h10l1.5 2.5M2 8.5h20v3H2v-3z" 
                          fill={darkMode ? 'white' : '#1e293b'} 
                          stroke={darkMode ? 'white' : '#1e293b'} 
                          strokeWidth="0.5"/>
                      </svg>
                    </div>

                    {/* Dotted Route Line - Simplified */}
                    <div className="absolute top-8 left-8 right-8 opacity-10 pointer-events-none">
                      <svg width="100%" height="40" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <path d="M0,35 Q50,15 100,25 T200,20" 
                          stroke={darkMode ? 'white' : '#1e293b'}
                          strokeWidth="2" 
                          strokeDasharray="5,5" 
                          fill="none"
                          opacity="0.4"/>
                      </svg>
                    </div>
                    </>
                    )}

                    {/* Main Card Content */}
                    <div className="p-4 relative z-10">
                      {/* Journey Section */}
                      <div className="flex items-center justify-between mb-3">
                        {/* Source */}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold truncate" style={{ color: darkMode ? '#67E8F9' : '#0284c7' }}>
                            {ride.from}
                          </div>
                        </div>

                        {/* Arrow */}
                        <div className="mx-3">
                          <span className={`text-lg font-bold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>→</span>
                        </div>

                        {/* Destination */}
                        <div className="flex-1 min-w-0 text-right">
                          <div className="text-sm font-bold truncate" style={{ color: darkMode ? '#BEF264' : '#16a34a' }}>
                            {ride.to}
                          </div>
                        </div>
                      </div>

                      {/* Time & Price */}
                      <div className="flex items-center justify-between">
                        {/* Time with icon */}
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                          <span className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {ride.time}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-0.5">
                          <IndianRupee className="w-4 h-4" style={{ color: darkMode ? '#facc15' : '#d97706' }} />
                          <span className="text-lg font-bold" style={{ color: darkMode ? '#facc15' : '#d97706' }}>
                            {ride.price !== '-' ? ride.price : '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={`rounded-[28px] border ${adaptiveBlur} p-8 text-center relative overflow-hidden`}
                style={smallCardStyle}>
                {/* Decorative Elements */}
                <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} pointer-events-none`} />
                <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/30'} pointer-events-none`} />
                <div className={`absolute top-8 left-8 w-3 h-3 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/30'} pointer-events-none`} />
                <div className="absolute bottom-8 right-8 grid grid-cols-2 gap-1.5 pointer-events-none">
                  <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-blue-400/15'}`} />
                </div>

                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-60 rounded-[28px]"
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
                  }}
                />

                <div className="relative z-10">
                  <p className="text-sm font-medium">
                    <span style={{ color: darkMode ? '#facc15' : '#d97706' }}>No recent rides yet. </span>
                    <span style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>Be the first to post one!</span>
                  </p>
                  <div className="mt-4">
                    <Link href="/share-ride/postride" className="inline-flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity" style={{ color: darkMode ? '#facc15' : '#d97706' }}>
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
            <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>or</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
          </div>

          {/* Helpful tips */}
          <div className={`rounded-[28px] border ${adaptiveBlur} p-5 sm:p-6 relative overflow-hidden`}
            style={{
              ...smallCardStyle,
              borderColor: darkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(245, 158, 11, 0.3)'
            }}>
            {/* Decorative Elements */}
            <div className={`absolute -bottom-20 -left-20 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-amber-300/30'} pointer-events-none`} />
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-amber-300/30'} pointer-events-none`} />
            <div className={`absolute top-8 left-8 w-3 h-3 rounded-full ${darkMode ? 'bg-white/20' : 'bg-amber-400/30'} pointer-events-none`} />
            <div className="absolute bottom-8 right-8 grid grid-cols-2 gap-1.5 pointer-events-none">
              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-amber-400/25'}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-amber-400/20'}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-amber-400/20'}`} />
              <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-amber-400/15'}`} />
            </div>

            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-60 rounded-[28px]"
              style={{
                background: darkMode 
                  ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
              }}
            />

            <div className="relative z-10 flex items-start gap-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-lg"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)' 
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: darkMode 
                    ? '0 8px 25px rgba(250, 204, 21, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
                    : '0 8px 25px rgba(245, 158, 11, 0.3), inset 0 2px 0 rgba(255, 255, 255, 0.3)'
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
                <span style={{ color: darkMode ? '#facc15' : '#d97706' }}>Safety tip:</span> <span style={{ color: darkMode ? '#38bdf8' : '#0369a1' }}>meet in public places for pickups, verify profiles, and share your trip with a friend.</span>
              </p>
            </div>
          </div>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}
