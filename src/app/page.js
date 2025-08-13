"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Car,
  ShoppingCart,
  Home as HomeIcon,
} from "lucide-react";
import Header from "./_components/Header";
import Main from "./_components/Main";
import Footer from "./_components/Footer";

/**
 * Page component — fixed to avoid SSR/CSR hydration mismatch
 * - Particles are generated in useEffect (client only)
 * - Scroll offset is handled in useEffect (client only)
 */
export default function Page() {
  const [darkMode, setDarkMode] = useState(false);
  const [offset, setOffset] = useState(0);

  // Client-only particle state — empty on server render to avoid mismatches
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Scroll parallax (client-side only)
    const handleScroll = () => setOffset(window.scrollY * 0.3);
    window.addEventListener("scroll", handleScroll);

    // Generate particle positions/sizes/durations ONCE on client
    const p = Array.from({ length: 20 }).map(() => {
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 7 + 4}px`,
        height: `${Math.random() * 7 + 4}px`,
        animationDuration: `${Math.random() * 4 + 3}s`,
        opacity: `${Math.random() * 0.35 + 0.15}`,
      };
    });
    setParticles(p);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleThemeToggle = () => setDarkMode((prev) => !prev);

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
          : "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800"
      }`}
    >
      {/* Announcement bar — kept subtle and professional */}
      <div
        className={`py-2 text-center font-semibold ${
          darkMode ? "bg-neutral-800 text-yellow-300" : "bg-yellow-100 text-gray-800"
        }`}
      >
        🚨 Important Announcement: Welcome to our community platform!
      </div>

      <Header darkMode={darkMode} onThemeToggle={handleThemeToggle} />

      {/* HERO */}
      <section
        className="relative h-screen flex flex-col justify-center items-center overflow-hidden"
        style={{
          // small parallax offset applied by transform; offset is 0 on server, updated on client
          background: darkMode
            ? "linear-gradient(135deg, #0f172a 0%, #0b1220 100%)"
            : "linear-gradient(135deg, #e6f0ff 0%, #fef9e6 100%)",
        }}
      >
        {/* Soft particles area — **rendered only after mount** (particles state) */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((pt, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/20 animate-ping"
              style={{
                top: pt.top,
                left: pt.left,
                width: pt.width,
                height: pt.height,
                opacity: pt.opacity,
                animationDuration: pt.animationDuration, // camelCase ok in JS style
              }}
            />
          ))}
        </div>

        {/* subtle blurred campus image overlay (optional) */}
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581091012184-5c1b4e0a1f6c?w=1600&auto=format&fit=crop&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: darkMode ? "brightness(0.45) blur(3px)" : "brightness(0.65) blur(3px)",
            transform: `translateY(${offset * 0.02}px) scale(${1 + offset * 0.0002})`,
            zIndex: -2,
          }}
        />

        {/* overlay to ensure text readability */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: darkMode ? "rgba(2,6,23,0.45)" : "rgba(255,255,255,0.25)",
            zIndex: -1,
          }}
        />

        {/* Content: Quote + Stats */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1
            className={`font-extrabold mb-4 leading-tight ${
              darkMode ? "text-yellow-300 text-4xl md:text-5xl lg:text-6xl" : "text-blue-700 text-4xl md:text-5xl lg:text-6xl"
            }`}
          >
            From Rides to Rooms, Lost to Found —{" "}
            <span className={darkMode ? "text-white" : "text-gray-900"}>QuickCampus Connects It All</span>
          </h1>

          <p className={`mb-8 text-lg md:text-xl ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Your one-stop platform for campus life — rides, marketplace, housing, and more.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              className={`px-8 py-3 rounded-lg font-semibold transition transform hover:scale-[1.03] ${
                darkMode ? "bg-yellow-400 text-gray-900" : "bg-blue-600 text-white"
              }`}
            >
              🚀 Get Started
            </button>
            <button
              className={`px-8 py-3 rounded-lg font-semibold border-2 transition transform hover:scale-[1.03] ${
                darkMode ? "border-yellow-300 text-yellow-300" : "border-blue-600 text-blue-600"
              }`}
            >
              📖 Learn More
            </button>
          </div>

          {/* Feature Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Car, label: "Share Rides", count: "1.2K+" },
              { icon: ShoppingCart, label: "Items Traded", count: "850+" },
              { icon: HomeIcon, label: "Housing", count: "200+" },
              { icon: Users, label: "Active Users", count: "2.5K+" },
            ].map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-xl backdrop-blur-md border shadow-md flex flex-col items-center ${
                    darkMode ? "bg-gray-800/55 border-gray-700" : "bg-white/55 border-gray-200"
                  }`}
                >
                  <Icon className={`w-7 h-7 mb-2 ${darkMode ? "text-yellow-300" : "text-blue-600"}`} />
                  <div className={`text-2xl font-bold ${darkMode ? "text-yellow-300" : "text-blue-600"}`}>
                    {f.count}
                  </div>
                  <div className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{f.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll-down hint (center bottom) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <svg className="w-8 h-8 animate-bounce opacity-80" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14" stroke={darkMode ? "#F8FAFC" : "#0F172A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 12l-7 7-7-7" stroke={darkMode ? "#F8FAFC" : "#0F172A"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* Main + Footer */}
      <Main darkMode={darkMode} />
      <Footer darkMode={darkMode} />
    </div>
  );
}
