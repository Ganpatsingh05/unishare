"use client";

import { useState, useEffect } from "react";
import { Megaphone, X } from "lucide-react";
import { useUI } from "./../../lib/contexts/UniShareContext";

export default function AnnouncementBar() {
  const { darkMode } = useUI();
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState({
    id: 'fallback-welcome',
    title: 'Welcome to UniShare',
    body: 'Your campus hub for rides, deals, rooms, and notes. Stay connected!',
    priority: 'normal'
  }); // Start with fallback value
  const [visible, setVisible] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState(null);

  // LocalStorage key for dismiss (stores announcement id & timestamp)
  const DISMISS_KEY = 'unishare_announcement_dismiss';
  const FIRST_VISIT_KEY = 'unishare_first_visit';

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        // Check if this is the first visit
        const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
        
        const { getNoticesForNoticeBar } = await import("../../lib/api");
        const res = await getNoticesForNoticeBar();
        const list = res.announcements || res.data || (Array.isArray(res) ? res : []);
        // Pick most recent active (optionally check expiresAt)
        const active = list
          .filter(a => a.active !== false && (!a.expiresAt || new Date(a.expiresAt) > new Date()))
          .sort((a,b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0));
        const latest = active[0];
        if (!cancelled) {
          if (latest) {
            // Check dismiss record
            try {
              const raw = localStorage.getItem(DISMISS_KEY);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.id === latest.id) {
                  setVisible(false);
                  setShowPopup(false);
                } else {
                  // Update to fetched announcement if not dismissed
                  setAnnouncement(latest);
                  setVisible(true);
                  // Show popup only on first visit or if not dismissed
                  if (!hasVisited) {
                    setShowPopup(true);
                    localStorage.setItem(FIRST_VISIT_KEY, 'true');
                  }
                }
              } else {
                // No dismiss record, show the announcement
                setAnnouncement(latest);
                setVisible(true);
                // Show popup only on first visit
                if (!hasVisited) {
                  setShowPopup(true);
                  localStorage.setItem(FIRST_VISIT_KEY, 'true');
                }
              }
            } catch { 
              // If localStorage fails, show the announcement anyway
              setAnnouncement(latest);
              setVisible(true);
              setShowPopup(true);
            }
          } else {
            // No latest announcement, use fallback only on first visit
            if (!hasVisited) {
              setVisible(true);
              setShowPopup(true);
              localStorage.setItem(FIRST_VISIT_KEY, 'true');
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          // Keep the fallback announcement on error, show only on first visit
          const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
          if (!hasVisited) {
            setVisible(true);
            setShowPopup(true);
            localStorage.setItem(FIRST_VISIT_KEY, 'true');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const dismiss = () => {
    if (announcement?.id) {
      try {
        localStorage.setItem(DISMISS_KEY, JSON.stringify({ id: announcement.id, ts: Date.now() }));
      } catch {/* ignore */}
    }
    setVisible(false);
    setShowPopup(false);
  };

  if (!visible || !showPopup) return null;

  const priorityAccent = announcement?.priority === 'high'
    ? (darkMode ? 'text-red-400' : 'text-red-600')
    : announcement?.priority === 'low'
      ? (darkMode ? 'text-gray-400' : 'text-gray-600')
      : (darkMode ? 'text-yellow-400' : 'text-orange-600');

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={dismiss}
      />
      
      {/* Popup Modal - Notice Board Style */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none overflow-y-auto py-4 sm:py-8">
        <div 
          className="pointer-events-auto w-full max-w-3xl mx-4 animate-slideInUp"
          style={{
            animation: 'slideInUp 0.4s ease-out'
          }}
        >
          <div 
            className={`relative rounded-2xl shadow-2xl transition-all duration-300 overflow-visible ${
              darkMode 
                ? 'bg-gradient-to-br from-[#2d1810] to-[#1a0f08]' 
                : 'bg-gradient-to-br from-[#8B4513] to-[#654321]'
            }`}
            style={{
              backdropFilter: 'blur(30px)',
              boxShadow: darkMode
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.2)',
              maxHeight: 'calc(100vh - 2rem)'
            }}
          >
            {/* Cork board texture overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                backgroundSize: '100px 100px',
                mixBlendMode: 'overlay'
              }}
            />

            {/* Decorative pins at corners */}
            <div className="absolute top-4 left-4 w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg" 
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }} 
            />
            <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg" 
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }} 
            />
            <div className="absolute bottom-4 left-4 w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg" 
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }} 
            />
            <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg" 
              style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' }} 
            />
            
            {/* Paper notice */}
            <div className="m-4 sm:m-6 md:m-8 relative overflow-y-auto" style={{ maxHeight: 'calc(100vh - 6rem)' }}>
              <div 
                className={`relative rounded-lg p-6 sm:p-8 md:p-10 ${
                  darkMode 
                    ? 'bg-gradient-to-br from-amber-50 to-yellow-50' 
                    : 'bg-gradient-to-br from-white to-yellow-50'
                }`}
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(139, 69, 19, 0.2)'
                }}
              >
                {/* Paper texture */}
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none rounded-lg"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23paper)' opacity='0.3'/%3E%3C/svg%3E")`,
                    backgroundSize: '150px 150px',
                  }}
                />

                

                {/* Notice Header with decorative line */}
                <div className="text-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-dashed border-amber-800/30">
                  <div className="inline-flex items-center gap-3 mb-2">
                    <div className="w-6 sm:w-8 h-[2px] bg-amber-800/40" />
                    <Megaphone className="w-5 sm:w-6 h-5 sm:h-6 text-amber-800" />
                    <div className="w-6 sm:w-8 h-[2px] bg-amber-800/40" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wider"
                    style={{
                      fontFamily: 'Georgia, serif',
                      textShadow: '1px 1px 0 rgba(0,0,0,0.1)'
                    }}
                  >
                    NOTICE
                  </h2>
                  <div className="mt-2 w-20 sm:w-24 h-1 bg-amber-800/60 mx-auto" />
                </div>

                {/* Notice Content */}
                <div className="relative space-y-3 sm:space-y-4">
                  {/* Date stamp - top right corner */}
                  {announcement.expiresAt && (
                    <div className="absolute -top-2 right-0 transform rotate-12">
                      <div className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold shadow-md border-2 border-red-700"
                        style={{
                          fontFamily: 'Courier New, monospace',
                          letterSpacing: '0.5px'
                        }}
                      >
                        VALID UNTIL: {new Date(announcement.expiresAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }).toUpperCase()}
                      </div>
                    </div>
                  )}

                  {/* Notice By Line */}
                  <div className="text-center mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-600 italic"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Notice by
                    </p>
                    <h4 className="text-base sm:text-lg font-bold text-amber-900 uppercase tracking-wide"
                      style={{ 
                        fontFamily: 'Georgia, serif',
                        letterSpacing: '1.5px'
                      }}
                    >
                      UniShare Corporation
                    </h4>
                    <div className="w-24 sm:w-32 h-[1px] bg-amber-800/40 mx-auto mt-2" />
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 underline decoration-wavy decoration-amber-600 text-center"
                      style={{
                        fontFamily: 'Georgia, serif',
                        lineHeight: '1.3'
                      }}
                    >
                      {announcement.title}
                    </h3>
                  </div>

                  {/* Body text */}
                  <div className="prose prose-sm sm:prose-lg max-w-none">
                    <p className="text-sm sm:text-base md:text-lg text-gray-800 leading-relaxed text-center px-2 sm:px-4"
                      style={{
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      {announcement.body}
                    </p>
                  </div>

                  {/* Horizontal line separator */}
                  <div className="flex items-center justify-center gap-2 py-3 sm:py-4">
                    <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-800/40 to-amber-800/40" />
                    <div className="w-2 h-2 rounded-full bg-amber-800/40" />
                    <div className="w-16 sm:w-24 h-[2px] bg-gradient-to-l from-transparent via-amber-800/40 to-amber-800/40" />
                  </div>

                  {/* Additional Information */}
                  <div className="bg-amber-50/50 rounded-lg p-3 sm:p-4 border border-amber-200/50">
                    <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      <div className="flex items-start gap-2">
                        <span className="font-semibold min-w-[80px]">Reference:</span>
                        <span className="text-gray-600">USH/{new Date().getFullYear()}/NOT/{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold min-w-[80px]">Date Issued:</span>
                        <span className="text-gray-600">{new Date().toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold min-w-[80px]">Contact:</span>
                        <span className="text-gray-600">support@unishare.com</span>
                      </div>
                    </div>
                  </div>

                  {/* Priority stamp */}
                  {announcement.priority === 'high' && (
                    <div className="flex justify-center mt-3 sm:mt-4">
                      <div className="bg-red-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-bold shadow-lg border-2 border-red-700 uppercase transform -rotate-2"
                        style={{
                          fontFamily: 'Impact, sans-serif',
                          letterSpacing: '1px'
                        }}
                      >
                        ⚠ URGENT ⚠
                      </div>
                    </div>
                  )}

                  {/* Signature line */}
                  <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t-2 border-dashed border-amber-800/30">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-sm sm:text-base text-gray-800 font-bold mb-1"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          UniShare Administration Office
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600 italic">
                          Official Campus Notice Board
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                          © {new Date().getFullYear()} UniShare Corporation. All rights reserved.
                        </p>
                      </div>
                      
                      <button
                        onClick={dismiss}
                        className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base text-white bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        style={{
                          fontFamily: 'Georgia, serif',
                          boxShadow: '0 4px 10px rgba(139, 69, 19, 0.4)',
                          letterSpacing: '0.5px'
                        }}
                      >
                        Acknowledged
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}
