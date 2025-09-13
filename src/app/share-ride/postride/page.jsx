"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../_components/Footer";
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
  ArrowLeft,
  Plus,
  Trash2,
  IndianRupee,
  Upload,
  Check,
  X,
} from "lucide-react";
import { useUI, useAuth, useMessages } from "../../lib/contexts/UniShareContext";
import Link from "next/link";

// Loading Component
function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    const textVariations = [
      "Setting up form",
      "Loading options",
      "Almost ready"
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

        <h2 className="text-2xl font-bold text-white mb-2">
          {loadingText}{dots}
        </h2>
        <p className="text-blue-100 mb-8 text-sm">
          Preparing ride posting form...
        </p>

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

export default function PostRidePage() {
  const { darkMode } = useUI();
  const { user, isAuthenticated } = useAuth();
  const { showTemporaryMessage } = useMessages();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: "mobile", value: "" }]);

  // Form validation
  const [errors, setErrors] = useState({});

  const handleLoadingComplete = () => setIsLoading(false);

  // Contact management
  const addContact = () => {
    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    setContacts([...contacts, { id: newId, type: "mobile", value: "" }]);
  };

  const removeContact = (id) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const updateContact = (id, field, value) => {
    setContacts(contacts.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!fromLoc.trim()) newErrors.fromLoc = "Starting location is required";
    if (!toLoc.trim()) newErrors.toLoc = "Destination is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (!vehicle.trim()) newErrors.vehicle = "Vehicle information is required";
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Valid price is required";
    }
    
    // Validate at least one contact
    const validContacts = contacts.filter(c => c.value.trim());
    if (validContacts.length === 0) {
      newErrors.contacts = "At least one contact method is required";
    }

    // Validate date is not in the past
    const selectedDate = new Date(date + " " + time);
    if (selectedDate <= new Date()) {
      newErrors.datetime = "Date and time must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showTemporaryMessage("Please login to post a ride", "error");
      return;
    }

    if (!validateForm()) {
      showTemporaryMessage("Please fix the errors in the form", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const { createRide } = await import('../../lib/api');
      
      const rideData = {
        from: fromLoc.trim(),
        to: toLoc.trim(),
        date,
        time,
        seats: Number(seats),
        price: Number(price),
        vehicle: vehicle.trim(),
        description: description.trim(),
        contacts: contacts.filter(c => c.value.trim()),
        driver: user?.name || "Anonymous"
      };

      console.log("Posting ride:", rideData);
      
      const result = await createRide(rideData);
      
      if (result.success) {
        showTemporaryMessage(result.message || "Ride posted successfully!", "success");
        
        // Reset form
        setFromLoc("");
        setToLoc("");
        setDate("");
        setTime("");
        setSeats(1);
        setPrice("");
        setVehicle("");
        setDescription("");
        setContacts([{ id: 1, type: "mobile", value: "" }]);
        setErrors({});
      } else {
        throw new Error(result.error || 'Failed to post ride');
      }
      
    } catch (error) {
      console.error("Error posting ride:", error);
      showTemporaryMessage(error.message || "Failed to post ride. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const iconForType = (type) => {
    switch (type) {
      case "mobile":
        return <Phone className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "email":
        return <Mail className="w-4 h-4" />;
      default:
        return <Link2 className="w-4 h-4" />;
    }
  };

  // Common styles
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500"
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const cardBg = darkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-gray-200";

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/share-ride" 
            className="inline-flex items-center gap-2 text-emerald-500 hover:text-emerald-600 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Share Ride Hub
          </Link>
          
          <div className="text-center">
            <h1 className={`text-2xl sm:text-3xl font-bold ${titleClr} mb-2`}>
              Offer a Ride
            </h1>
            <p className={`text-sm ${labelClr}`}>
              Share your ride with fellow students and help the community
            </p>
          </div>
        </div>

        {/* Authentication Check */}
        {!isAuthenticated && (
          <div className={`p-4 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 mb-6`}>
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-yellow-600" />
              <p className="text-yellow-800 dark:text-yellow-300">
                You need to be logged in to post a ride. 
                <Link href="/login" className="underline ml-1 hover:text-yellow-900 dark:hover:text-yellow-200">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={`p-6 rounded-xl border ${cardBg}`}>
          {/* Route Information */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Route Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  From Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={fromLoc}
                    onChange={(e) => setFromLoc(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                      errors.fromLoc ? 'border-red-500' : ''
                    }`}
                    placeholder="Starting point..."
                  />
                </div>
                {errors.fromLoc && (
                  <p className="text-red-500 text-sm mt-1">{errors.fromLoc}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  To Location *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={toLoc}
                    onChange={(e) => setToLoc(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                      errors.toLoc ? 'border-red-500' : ''
                    }`}
                    placeholder="Destination..."
                  />
                </div>
                {errors.toLoc && (
                  <p className="text-red-500 text-sm mt-1">{errors.toLoc}</p>
                )}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Schedule</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Time *
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                      errors.time ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
              </div>
            </div>
            {errors.datetime && (
              <p className="text-red-500 text-sm mt-2">{errors.datetime}</p>
            )}
          </div>

          {/* Vehicle & Capacity */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Vehicle Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Vehicle Details *
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                      errors.vehicle ? 'border-red-500' : ''
                    }`}
                    placeholder="e.g., Honda City, White, MH12AB1234"
                  />
                </div>
                {errors.vehicle && (
                  <p className="text-red-500 text-sm mt-1">{errors.vehicle}</p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                  Available Seats *
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg}`}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n} seat{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-6">
            <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Pricing</h2>
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                Price per Person (₹) *
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg} ${
                    errors.price ? 'border-red-500' : ''
                  }`}
                  placeholder="Enter fare per person..."
                  min="0"
                  step="10"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
              Additional Information
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`w-full px-3 py-3 border rounded-lg transition-colors ${inputBg}`}
              placeholder="Any additional details about the ride, pickup points, etc..."
            />
          </div>

          {/* Contact Information */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${titleClr}`}>Contact Information *</h2>
              <button
                type="button"
                onClick={addContact}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Contact
              </button>
            </div>

            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex gap-2">
                  <select
                    value={contact.type}
                    onChange={(e) => updateContact(contact.id, "type", e.target.value)}
                    className={`px-3 py-2 border rounded-lg transition-colors ${inputBg}`}
                  >
                    <option value="mobile">Mobile</option>
                    <option value="email">Email</option>
                    <option value="instagram">Instagram</option>
                  </select>
                  
                  <div className="flex-1 relative">
                    {iconForType(contact.type)}
                    <input
                      value={contact.value}
                      onChange={(e) => updateContact(contact.id, "value", e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg transition-colors ${inputBg}`}
                      placeholder={
                        contact.type === "mobile" ? "Phone number..." :
                        contact.type === "email" ? "Email address..." :
                        "Username..."
                      }
                    />
                  </div>
                  
                  {contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(contact.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.contacts && (
              <p className="text-red-500 text-sm mt-2">{errors.contacts}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Link 
              href="/share-ride"
              className={`flex-1 py-3 px-6 border rounded-lg text-center transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Cancel
            </Link>
            
            <button
              type="submit"
              disabled={isSubmitting || !isAuthenticated}
              className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors flex items-center justify-center gap-2 ${
                isSubmitting || !isAuthenticated
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Post Ride
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}