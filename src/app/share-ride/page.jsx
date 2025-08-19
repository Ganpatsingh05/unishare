"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Header from "../_components/Header";
import Footer from "../_components/Footer";
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
  Plus,
  Trash2,
  IndianRupee,
} from "lucide-react";

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
          setTimeout(onComplete, 200); // Small delay after 100%
          return 100;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
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
      "Almost ready",
      "Start sharing"
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
        {/* GIF Container - Larger size */}
        <div className="mb-8 relative">
          <div className="w-56 h-56 mx-auto mb-4 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
            <img 
              src="/rideshare.gif" 
              alt="RideShare Navigator" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Pulsing ring around gif */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-emerald-400/40 rounded-full animate-ping" />
          </div>
          {/* Secondary pulsing ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-72 h-72 border border-blue-400/30 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-2xl font-bold text-white mb-2">
          {loadingText}{dots}
        </h2>
        <p className="text-blue-100 mb-8 text-sm">
          Connecting riders and drivers...
        </p>

        {/* Progress Bar */}
        <div className="w-64 mx-auto">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 h-full rounded-full transition-all duration-100 ease-out shadow-lg"
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

export default function ShareRidePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [mode, setMode] = useState("find"); // 'find' | 'offer'
  const [heroSrc, setHeroSrc] = useState("/assets/images/rideunishare.png");
  const [isLoading, setIsLoading] = useState(true);

  // Common styles
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";

  // Find ride filters
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState("");
  const [seatsNeeded, setSeatsNeeded] = useState(1);

  // Offer ride form
  const [ofFrom, setOfFrom] = useState("");
  const [ofTo, setOfTo] = useState("");
  const [ofDate, setOfDate] = useState("");
  const [ofTime, setOfTime] = useState("");
  const [ofSeats, setOfSeats] = useState(1);
  const [ofPrice, setOfPrice] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: "mobile", value: "" }]);

  const handleLoadingComplete = () => setIsLoading(false);

  const iconForType = (type) => {
    switch (type) {
      case "mobile":
        return Phone;
      case "instagram":
        return Instagram;
      case "email":
        return Mail;
      case "link":
        return Link2;
      default:
        return Link2;
    }
  };
  const placeholderForType = (type) => {
    switch (type) {
      case "mobile":
        return "+91 98765 43210";
      case "instagram":
        return "@username";
      case "email":
        return "example@gmail.com";
      case "link":
        return "https://...";
      default:
        return "";
    }
  };

  // Sample rides (client-only)
  const rides = useMemo(
    () => [
      {
        id: 1,
        driver: "Sumanth Jupudi",
        from: "BH3 Maingate",
        to: "LawGate to meet Balaji",
        date: "2025-08-20",
        time: "09:00",
        seats: 3,
        price: 60,
      },
      {
        id: 2,
        driver: "Balaji",
        from: "LawGate",
        to: "BH3 Maingate to meet jupudi",
        date: "2025-08-20",
        time: "8:30",
        seats: 2,
        price: 120,
      },
      {
        id: 3,
        driver: "Teja",
        from: "LawGate ",
        to: "LPU Library (to meet GF)",
        date: "2025-08-20",
        time: "9:00",
        seats: 1,
        price: 200,
      },
      {
        id: 4,
        driver: "Neha",
        from: "Dorm C",
        to: "Airport",
        date: "2025-08-17",
        time: "06:30",
        seats: 3,
        price: 400,
      },
    ],
    []
  );

  const filteredRides = useMemo(() => {
    return rides.filter((r) => {
      const f = fromLoc.trim().toLowerCase();
      const t = toLoc.trim().toLowerCase();
      const inFrom = !f || r.from.toLowerCase().includes(f);
      const inTo = !t || r.to.toLowerCase().includes(t);
      const inDate = !date || r.date === date;
      const inSeats = !seatsNeeded || r.seats >= Number(seatsNeeded);
      return inFrom && inTo && inDate && inSeats;
    });
  }, [rides, fromLoc, toLoc, date, seatsNeeded]);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div
      className={`min-h-dvh transition-colors ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50"
      }`}
    >
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode((p) => !p)} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Brand-themed hero banner with image (place /public/rideunishare.jpg) */}
        <section
          className="relative mb-6 sm:mb-10 rounded-2xl overflow-hidden border shadow-xl animate-dropdown-in"
          aria-label="Rides Hero"
        >
          <div
            className={`${
              darkMode ? "border-gray-800" : "border-gray-200"
            } absolute inset-0 pointer-events-none`}
          />
          <div className="relative aspect-[16/9]">
            <Image
              src={heroSrc}
              alt="Share rides with UniShare"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-scale-down"
              onError={() => setHeroSrc('/rideunishare.svg')}
            />
            <div
              className={`absolute inset-0 ${
                darkMode
                  ? "bg-gradient-to-tr from-gray-950/80 via-gray-900/50 to-transparent"
                  : "bg-gradient-to-tr from-blue-600/15 via-yellow-400/15 to-white/0"
              }`}
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
            <div className="max-w-xl animate-slide-up-soft">
              <h1
                className={`text-2xl sm:text-3xl font-extrabold drop-shadow ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Share a Ride, Save Together
              </h1>
              <p
                className={`${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } mt-1 text-sm sm:text-base`}
              >
                Find a lift or offer seats in seconds—made for campus life.
              </p>
            </div>
          </div>
        </section>

        <div
          className={`rounded-2xl border p-4 sm:p-6 ${
            darkMode
              ? "bg-gray-950/60 border-gray-900"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>
              Share a Ride
            </h1>
            <div
              className={`inline-flex p-1 rounded-xl border ${
                darkMode
                  ? "border-gray-800 bg-gray-900"
                  : "border-gray-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setMode("find")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  mode === "find"
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                Find Ride
              </button>
              <button
                type="button"
                onClick={() => setMode("offer")}
                className={`px-3 py-1.5 text-sm rounded-lg ${
                  mode === "offer"
                    ? "bg-emerald-600 text-white"
                    : darkMode
                    ? "text-gray-300"
                    : "text-gray-700"
                }`}
              >
                Offer Ride
              </button>
            </div>
          </div>

          {mode === "find" ? (
            <section className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={fromLoc}
                      onChange={(e) => setFromLoc(e.target.value)}
                      placeholder="Pickup location"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={toLoc}
                      onChange={(e) => setToLoc(e.target.value)}
                      placeholder="Drop location"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Seats needed
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      value={seatsNeeded}
                      onChange={(e) =>
                        setSeatsNeeded(Number(e.target.value) || 1)
                      }
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className={`text-sm font-medium ${labelClr}`}>Available rides</h2>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredRides.length === 0 && (
                    <div
                      className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm`}
                    >
                      No rides match your filters.
                    </div>
                  )}
                  {filteredRides.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-xl border p-4 ${
                        darkMode
                          ? "bg-gray-950 border-gray-900"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            darkMode ? "bg-gray-900" : "bg-gray-100"
                          }`}
                        >
                          <Car
                            className={darkMode ? "text-gray-400" : "text-gray-500"}
                            size={18}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium ${titleClr}`}>
                            {r.from} → {r.to}
                          </div>
                          <div className="mt-1 text-xs flex items-center gap-3">
                            <span
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } inline-flex items-center gap-1`}
                            >
                              <Calendar size={14} /> {r.date}
                            </span>
                            <span
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } inline-flex items-center gap-1`}
                            >
                              <Clock size={14} /> {r.time}
                            </span>
                            <span
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } inline-flex items-center gap-1`}
                            >
                              <Users size={14} /> {r.seats} seats
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                              <IndianRupee size={16} /> {r.price} / seat
                            </div>
                            <div
                              className={`${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              } text-xs`}
                            >
                              Driver: {r.driver}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className={`mt-4 w-full text-sm py-2.5 rounded-lg font-medium ${
                          darkMode
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        Request seat
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="mt-6">
              <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    From
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={ofFrom}
                      onChange={(e) => setOfFrom(e.target.value)}
                      placeholder="Pickup location"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    To
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={ofTo}
                      onChange={(e) => setOfTo(e.target.value)}
                      placeholder="Drop location"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={ofDate}
                      onChange={(e) => setOfDate(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={ofTime}
                      onChange={(e) => setOfTime(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Seats available
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min={1}
                      value={ofSeats}
                      onChange={(e) => setOfSeats(Number(e.target.value) || 1)}
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Price per seat
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      value={ofPrice}
                      onChange={(e) => setOfPrice(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="100"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className={`block text-xs font-medium mb-1 ${labelClr}`}>
                    Vehicle details (optional)
                  </label>
                  <input
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    placeholder="e.g., White Swift, RJ-14 AB 1234"
                    className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
                  />
                </div>

                {/* Contact */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className={`text-xs font-medium ${labelClr}`}>
                      Contact info
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setContacts((p) => [
                          ...p,
                          { id: Date.now(), type: "mobile", value: "" },
                        ])
                      }
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                  <div className="space-y-3">
                    {contacts.map((c, idx) => {
                      const Icon = iconForType(c.type);
                      return (
                        <div
                          key={c.id}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center"
                        >
                          <select
                            value={c.type}
                            onChange={(e) =>
                              setContacts((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { ...x, type: e.target.value } : x
                                )
                              )
                            }
                            className={`sm:col-span-1 px-3 py-2.5 rounded-lg border ${inputBg}`}
                          >
                            <option value="mobile">Mobile</option>
                            <option value="instagram">Instagram</option>
                            <option value="email">Email</option>
                            <option value="link">Link</option>
                          </select>
                          <div className="sm:col-span-2 relative">
                            <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              value={c.value}
                              onChange={(e) =>
                                setContacts((prev) =>
                                  prev.map((x, i) =>
                                    i === idx
                                      ? { ...x, value: e.target.value }
                                      : x
                                  )
                                )
                              }
                              placeholder={placeholderForType(c.type)}
                              className={`w-full pl-9 pr-10 py-2.5 rounded-lg border ${inputBg}`}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setContacts((prev) =>
                                  prev.filter((x) => x.id !== c.id)
                                )
                              }
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-red-500/10 text-red-600"
                              aria-label="Remove contact"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-center gap-3">
                  <button
                    type="button"
                    className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium"
                  >
                    Post ride
                  </button>
                  <button
                    type="reset"
                    onClick={() => {
                      setOfFrom("");
                      setOfTo("");
                      setOfDate("");
                      setOfTime("");
                      setOfSeats(1);
                      setOfPrice("");
                      setVehicle("");
                      setContacts([{ id: 1, type: "mobile", value: "" }]);
                    }}
                    className={`px-3 py-2.5 rounded-lg border text-sm ${
                      darkMode
                        ? "border-gray-700 text-gray-200"
                        : "border-gray-300 text-gray-800"
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </main>

      <Footer darkMode={darkMode} />
    </div>
  );
}