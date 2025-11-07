"use client";
import { useEffect, useState } from "react";
import { useUI } from "./../../lib/contexts/UniShareContext";
import Link from "next/link";
import { ShoppingCart, Tag, ArrowRight, Users, Ticket, IndianRupee, MapPin, Clock, Music } from "lucide-react";
import SmallFooter from "./../../_components/layout/SmallFooter";
import MarketplaceTicketTheme from "./../../_components/ServicesTheme/JupiterTheme";
import { fetchTickets } from "./../../lib/api";

export default function TicketHubPage() {
  // Use proper dark mode from context
  const { darkMode } = useUI();

  // Local state for recent tickets
  const [recentTickets, setRecentTickets] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(false);


  const cardBorder = darkMode ? "border-gray-700/50" : "border-gray-200";
  const cardBg = darkMode ? "bg-gray-800/50" : "bg-white/80";
  const textMuted = darkMode ? "text-gray-300" : "text-gray-700";
  const titleClr = darkMode ? "text-gray-100" : "text-gray-800";
  const tipBg = darkMode ? "bg-gray-800/60" : "bg-gray-100";
  const tipBorder = darkMode ? "border-gray-700/50" : "border-gray-300";
  const badgeBlue = darkMode ? "text-blue-300 bg-blue-500/20" : "text-blue-700 bg-blue-100";
  const badgeGreen = darkMode ? "text-emerald-300 bg-emerald-500/20" : "text-emerald-700 bg-emerald-100";

  // Helpers reused from buy page for consistency
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return "";
    const eventDate = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Tomorrow";
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return "Past event";
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

  // Fetch recent tickets on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoadingRecent(true);
  const result = await fetchTickets({ sort: 'created_at', order: 'desc', limit: 3 });
        const list = result?.success ? (result.data || []) : (Array.isArray(result) ? result : (result?.data || []));
        if (!active) return;
  setRecentTickets(Array.isArray(list) ? list.slice(0, 3) : []);
      } catch (e) {
        if (active) setRecentTickets([]);
      } finally {
        if (active) setLoadingRecent(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col relative transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Ticket Jupiter Yellow/Brown/Red Bands Theme */}
      <MarketplaceTicketTheme />

      <main className="relative flex-1 min-h-[115vh] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-6 sm:mb-8">
            <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${titleClr}`}>Event Tickets</h1>
            <p className={`mt-2 text-sm sm:text-base ${textMuted}`}>What would you like to do?</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Browse tickets */}
            <Link
              href="/ticket/buy"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeBlue}`}>
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Browse tickets</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeBlue}`}>Popular</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    See tickets posted by students. Filter by event type, price, and date.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                    Start browsing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Sell tickets */}
            <Link
              href="/ticket/sell"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${badgeGreen}`}>
                  <Tag className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>Sell your tickets</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeGreen}`}>New</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    List extra tickets with photos and details. Connect with interested buyers.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-600'}`}>
                    Create a listing
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>

            {/* My tickets */}
            <Link
              href="/profile/my-tickets"
              className={`group h-full transform rounded-2xl border ${cardBorder} ${cardBg} shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 p-5 sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 focus-visible:ring-offset-2`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${darkMode ? 'text-purple-300 bg-purple-500/10' : 'text-purple-700 bg-purple-100'}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className={`text-base sm:text-lg font-semibold ${titleClr}`}>My tickets</h2>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${darkMode ? 'text-purple-300 bg-purple-500/10' : 'text-purple-700 bg-purple-100'}`}>Manage</span>
                  </div>
                  <p className={`mt-1 text-sm ${textMuted} line-clamp-2`}>
                    View and manage tickets you�ve listed or purchased.
                  </p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-sm font-medium ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                    Open dashboard
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
                Safety tip: meet in public places for ticket exchanges and verify event details before purchasing.
              </p>
            </div>
          </div>

          {/* Recent tickets */}
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${titleClr}`}>Recent tickets</h2>
              <Link href="/ticket/buy" className={`text-sm font-medium hover:underline ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Browse all
              </Link>
            </div>

            {loadingRecent && (
              <div className={`text-sm ${textMuted} py-4`}>Loading recent tickets...</div>
            )}

            {!loadingRecent && recentTickets.length === 0 && (
              <div className={`rounded-xl border ${cardBorder} ${cardBg} p-6 text-center`}>
                <Ticket className="w-10 h-10 mx-auto mb-2 opacity-60" />
                <p className={`${textMuted}`}>No recent tickets yet. Be the first to list one!</p>
              </div>
            )}

            {!loadingRecent && recentTickets.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentTickets.map((t) => {
                  const cat = t.category || 'other';
                  const EventIcon = getEventTypeIcon(t.event_type, cat);
                  return (
                    <div key={t.id} className={`group rounded-2xl border ${cardBorder} ${cardBg} p-4 hover:shadow-lg transition-all`}>
                      {/* Image or icon */}
                      <div className={`w-full h-40 rounded-xl flex items-center justify-center overflow-hidden mb-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
                        {t.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.image_url} alt={t.title || 'Ticket'} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform" />
                        ) : (
                          <div className="text-center">
                            <EventIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className={`text-xs capitalize ${textMuted}`}>{cat}</p>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`font-semibold ${titleClr} line-clamp-2`}>{t.title || 'Untitled'}</h3>

                      {/* Price and chips */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 text-emerald-500 font-bold text-lg">
                          <IndianRupee size={18} />
                          {t.price ?? '-'}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{cat}</span>
                          {cat === 'event' && t.event_type && (
                            <span className={`hidden sm:inline px-2 py-1 rounded-full text-xs capitalize ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>{t.event_type}</span>
                          )}
                        </div>
                      </div>

                      {/* Meta */}
                      <div className={`flex items-center gap-4 text-xs ${textMuted} mt-3`}>
                        {t.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {t.location}
                          </span>
                        )}
                        {typeof t.quantity_available === 'number' && (
                          <span className="flex items-center gap-1">
                            <Ticket size={12} />
                            {t.quantity_available} left
                          </span>
                        )}
                      </div>

                      {/* Dates */}
                      {t.event_date && (
                        <div className={`text-xs ${textMuted} mt-2`}>
                          <p className="font-medium">{formatEventDate(t.event_date)}</p>
                          <p>{formatDate(t.event_date)}</p>
                        </div>
                      )}

                      {/* Action */}
                      <Link href="/ticket/buy" className="mt-3 inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:from-blue-700 hover:to-indigo-700 transition-all">
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <SmallFooter />
    </div>
  );
}
