"use client";

import Link from "next/link";
import { useUI } from "../lib/contexts/UniShareContext";
import { Search, Car, ArrowRight, Users } from "lucide-react";
import SmallFooter from "../_components/SmallFooter";

export default function ShareRideHubPage() {
  // Align styling and behavior with Ticket landing page
  let darkMode = false;
  try { darkMode = useUI()?.darkMode ?? false; } catch {}

  const cardBorder = darkMode ? "border-gray-800" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-900/70" : "bg-white/80";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-800";
  const tipBg = darkMode ? "bg-gray-900/60" : "bg-gray-100";
  const tipBorder = darkMode ? "border-gray-800" : "border-gray-300";
  const badgeBlue = darkMode ? "text-blue-300 bg-blue-500/10" : "text-blue-700 bg-blue-100";
  const badgeGreen = darkMode ? "text-emerald-300 bg-emerald-500/10" : "text-emerald-700 bg-emerald-100";
  const badgePurple = darkMode ? "text-purple-300 bg-purple-500/10" : "text-purple-700 bg-purple-100";

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50'}`}>
      <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Ride Sharing</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>What would you like to do?</p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Find a ride */}
            <Link
              href="/share-ride/findride"
              className={`group rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2`}
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

            {/* Manage requests */}
            <Link
              href="/share-ride/requests"
              className={`group rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2`}
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

            {/* Offer a ride */}
            <Link
              href="/share-ride/postride"
              className={`group rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2`}
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
          </div>

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