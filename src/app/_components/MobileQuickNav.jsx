"use client";

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import uniShareLogo from '../assets/images/logounishare1.png';

export default function MobileQuickNav({
  sections = [],
  activeSection,
  onSelect,
  darkMode = true,
  label = 'Quick Navigation',
}) {
  const [open, setOpen] = useState(false);

  // Close on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSelect = (id) => {
    // Apply scroll-margin-top to account for sticky header before scrolling
    try {
      const target = document.getElementById(id);
      if (target) {
        const headerEl = document.querySelector('header, [data-sticky-header]');
        const headerHeight = headerEl ? headerEl.getBoundingClientRect().height : 72;
        const spacing = 12; // extra breathing room
        target.style.scrollMarginTop = `${headerHeight + spacing}px`;
      }
    } catch {}

    setOpen(false);
    // Defer to allow close animation/state to apply before scroll
    if (onSelect) setTimeout(() => onSelect(id), 0);
  };

  // Lock background scroll while sheet is open (robust: fixed body + restore position)
  const scrollRef = useRef(0);
  useEffect(() => {
    if (!open) return;
    scrollRef.current = window.scrollY;
    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const prev = {
      overflow: bodyEl.style.overflow,
      position: bodyEl.style.position,
      top: bodyEl.style.top,
      width: bodyEl.style.width,
      touchAction: bodyEl.style.touchAction,
      overscroll: htmlEl.style.overscrollBehavior,
    };
    bodyEl.style.overflow = 'hidden';
    bodyEl.style.position = 'fixed';
    bodyEl.style.top = `-${scrollRef.current}px`;
    bodyEl.style.width = '100%';
    bodyEl.style.touchAction = 'none';
    htmlEl.style.overscrollBehavior = 'none';
    return () => {
      bodyEl.style.overflow = prev.overflow;
      bodyEl.style.position = prev.position;
      bodyEl.style.top = prev.top;
      bodyEl.style.width = prev.width;
      bodyEl.style.touchAction = prev.touchAction;
      htmlEl.style.overscrollBehavior = prev.overscroll;
      // Restore scroll position
      window.scrollTo(0, scrollRef.current);
    };
  }, [open]);

  return (
    <>
      {/* Floating action button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-4 z-40 grid place-items-center w-12 h-12 rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 lg:hidden bg-transparent`}
        aria-label={label}
      >
        <Image
          src={uniShareLogo}
          alt="UniShare"
          width={24}
          height={24}
          priority
          className="pointer-events-none select-none motion-safe:animate-spin"
          style={{ animationDuration: '8s' }}
        />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden overflow-hidden">
          <button
            className="absolute inset-0 bg-black/50"
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 max-h-[75vh] rounded-t-2xl border-t-2 shadow-2xl overflow-hidden ${
              darkMode
                ? 'bg-gray-900 border-gray-700 text-gray-100'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-500/20">
              <div className="flex items-center gap-2 relative w-full">
                <div className={`w-10 h-1 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 -top-2 ${
                  darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`} />
                <div className="flex items-center gap-2">
                  <Image
                    src={uniShareLogo}
                    alt="UniShare"
                    width={18}
                    height={18}
                    className="rounded motion-safe:animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className={`p-2 rounded-lg transition-colors active:scale-95 ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-3 py-2 overflow-y-auto overscroll-contain touch-pan-y">
              <nav className="grid grid-cols-1 gap-2">
                {sections.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => handleSelect(s.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left border transition-all duration-150 active:scale-95 ${
                      activeSection === s.id
                        ? darkMode
                          ? 'bg-yellow-300/10 text-yellow-300 border-yellow-300/40'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                        : darkMode
                          ? 'bg-gray-800/60 text-gray-300 border-gray-700 hover:bg-gray-800'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    {s.icon ? <s.icon className="w-4 h-4" /> : null}
                    <span className="text-sm font-medium">{s.title}</span>
                  </button>
                ))}
              </nav>
              <div className="h-4" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
