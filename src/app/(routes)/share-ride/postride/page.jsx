"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import SmallFooter from "./../../../_components/layout/SmallFooter";
import ShareRideTheme from "./../../../_components/ServicesTheme/EarthTheme";
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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useUI, useAuth, useMessages } from "./../../../lib/contexts/UniShareContext";
import { RideNotifications } from "./../../../lib/utils/actionNotifications";
import Link from "next/link";

// Success Popup Component
function SuccessPopup({ isVisible, onClose }) {
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(10);

  // Stabilize onClose with useCallback to prevent dependency changes
  const stableOnClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    // Initialize states when popup becomes visible
    setProgress(100);
    setTimeLeft(10);

    // Smooth progress bar animation (decreases from 100 to 0 over 10 seconds)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1; // Decrease by 1 every 100ms for smooth animation
      });
    }, 100); // Update every 100ms for smooth animation

    // Timer countdown and auto-close
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Use setTimeout to avoid calling onClose during render
          setTimeout(stableOnClose, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
    };
  }, [isVisible, stableOnClose]); // Now using stable reference

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
            
            {/* Success Message */}
            <h2 className="text-2xl font-bold text-center mb-2">
              🎉 Ride Posted Successfully!
            </h2>
            <p className="text-green-100 text-center text-sm">
              Your ride is now live and ready for bookings
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full"></div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={stableOnClose}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Close
            </button>
            <Link
              href="/share-ride"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium text-center"
            >
              View Rides
            </Link>
          </div>

          {/* Progress Bar - Moved to bottom */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-xs text-green-700 dark:text-green-400 text-center">
              💡 Your ride will be visible to other users immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Custom Dropdown Component
function CustomDropdown({ value, onChange, options, placeholder, className, darkMode, icon: Icon }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 hover:border-emerald-300 cursor-pointer ${className} border-gray-200 dark:border-gray-600 text-base font-medium flex items-center justify-between`}
      >
        {Icon && (
          <Icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        )}
        <span className={selectedOption ? (darkMode ? 'text-gray-100' : 'text-gray-900') : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto`}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                value === option.value 
                  ? 'bg-emerald-500 text-white' 
                  : darkMode 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {option.icon && (
                <span className="text-lg">{option.icon}</span>
              )}
              <span className="font-medium">{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Custom DatePicker Component
function CustomDatePicker({ value, onChange, className, darkMode, errors, minDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (value) {
      setSelectedDate(new Date(value));
      setCurrentMonth(new Date(value));
    } else {
      setCurrentMonth(new Date());
    }
  }, [value]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const formatDisplayDate = (date) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatValueDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date) => {
    if (!date || !minDate) return false;
    return date < new Date(minDate);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
    onChange(formatValueDate(date));
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    handleDateSelect(today);
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 hover:border-emerald-300 cursor-pointer ${className} ${
          errors ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 dark:border-gray-600'
        } text-base font-medium flex items-center justify-between`}
      >
        <span className={selectedDate ? (darkMode ? 'text-gray-100' : 'text-gray-900') : 'text-gray-500'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50 overflow-hidden min-w-[320px]`}>
          {/* Header with month navigation */}
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-b flex items-center justify-between`}>
            <button
              onClick={() => navigateMonth(-1)}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
            </div>

            <button
              onClick={() => navigateMonth(1)}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-700'} transition-colors`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className={`grid grid-cols-7 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b border-gray-200 dark:border-gray-600`}>
            {weekDays.map((day) => (
              <div key={day} className={`p-2 text-center text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 p-2">
            {days.map((date, index) => (
              <div key={index} className="aspect-square p-1">
                {date ? (
                  <button
                    onClick={() => handleDateSelect(date)}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center relative ${
                      isSelected(date)
                        ? 'bg-emerald-500 text-white shadow-lg'
                        : isToday(date)
                        ? darkMode
                          ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500'
                          : 'bg-emerald-100 text-emerald-600 border border-emerald-300'
                        : isDateDisabled(date)
                        ? darkMode
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-gray-400 cursor-not-allowed'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {date.getDate()}
                    {isToday(date) && !isSelected(date) && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        darkMode ? 'bg-emerald-400' : 'bg-emerald-600'
                      }`} />
                    )}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {/* Footer with Today button */}
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-t flex justify-between items-center`}>
            <button
              onClick={goToToday}
              className="text-sm text-emerald-500 hover:text-emerald-600 transition-colors font-medium"
            >
              Today
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} transition-colors`}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Custom TimePicker Component
function CustomTimePicker({ value, onChange, className, darkMode, errors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

  const handleMinuteSelect = (minute) => {
    const hour = selectedHour || '00';
    const timeValue = `${hour}:${minute}`;
    setSelectedMinute(minute);
    onChange(timeValue);
    setIsOpen(false); // Auto-close when minute is selected
  };

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
    // Don't close yet, wait for minute selection
  };

  const displayTime = value || 'Select time';

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 hover:border-emerald-300 cursor-pointer ${className} ${
          errors ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 dark:border-gray-600'
        } text-base font-medium flex items-center justify-between`}
      >
        <span className={value ? (darkMode ? 'text-gray-100' : 'text-gray-900') : 'text-gray-500'}>
          {displayTime}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl z-50 overflow-hidden`}>
          <div className="flex max-h-64">
            {/* Hours Column */}
            <div className="flex-1 border-r border-gray-200 dark:border-gray-700">
              <div className={`px-4 py-3 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'} border-b border-gray-200 dark:border-gray-700`}>
                Hours
              </div>
              <div className="max-h-48 overflow-y-auto">
                {hours.map((hour) => (
                  <div
                    key={hour}
                    onClick={() => handleHourSelect(hour)}
                    className={`px-4 py-3 cursor-pointer transition-colors text-center ${
                      selectedHour === hour 
                        ? 'bg-emerald-500 text-white' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {hour}
                  </div>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex-1">
              <div className={`px-4 py-3 text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-700'} border-b border-gray-200 dark:border-gray-700`}>
                Minutes
              </div>
              <div className="max-h-48 overflow-y-auto">
                {minutes.filter((_, i) => i % 5 === 0).map((minute) => ( // Show every 5 minutes
                  <div
                    key={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    className={`px-4 py-3 cursor-pointer transition-colors text-center ${
                      selectedMinute === minute 
                        ? 'bg-emerald-500 text-white' 
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {minute}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default function PostRidePage() {
  const router = useRouter();
  const { darkMode } = useUI();
  const { user, isAuthenticated } = useAuth();
  const { showTemporaryMessage } = useMessages();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasShownAuthNotification = useRef(false);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated && !hasShownAuthNotification.current) {
      hasShownAuthNotification.current = true;
      
      // Show Dynamic Island notification
      RideNotifications.authRequired();
      
      // Show temporary message
      showTemporaryMessage("Please login to post a ride", "error");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else if (isAuthenticated) {
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, router, showTemporaryMessage]);

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
      const { createRide } = await import("../../../lib/api");
      
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

      const result = await createRide(rideData);
      
      if (result.success) {
        // Show Dynamic Island notification
        RideNotifications.ridePosted(toLoc.trim());
        
        // Show beautiful success popup instead of temporary message
        setShowSuccessPopup(true);
        
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

  // Show loading state while checking authentication
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <ShareRideTheme />
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {!isAuthenticated ? 'Redirecting to login...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* ShareRide Mercury Gray Theme */}
      <ShareRideTheme />
      
      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              <span className="text-yellow-400">Offer</span> <span className="text-sky-400">a Ride</span>
            </h1>
            <p className="text-sm text-sky-100">
              Share your ride with fellow students and help the community
            </p>
          </div>
        </div>

        {/* Authentication Check */}
        {!isAuthenticated && (
          <div className="p-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 backdrop-blur-sm mb-6">
            <div className="flex items-center gap-2">
              <X className="w-5 h-5 text-yellow-400" />
              <p className="text-white">
                You need to be logged in to post a ride. 
                <Link href="/login" className="underline ml-1 hover:text-yellow-300 text-yellow-400 font-medium">
                  Login here
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className={`relative overflow-hidden rounded-2xl shadow-2xl border backdrop-blur-sm p-6 sm:p-8`}
          style={{ 
            background: darkMode 
              ? '#1b2d47' 
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            borderColor: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(148, 163, 184, 0.3)',
          }}
        >
          {/* Lotus Flower Pattern - Top Right */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-12 -translate-y-1/4 translate-x-1/4 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Center of lotus */}
              <circle cx="100" cy="100" r="10" fill="white" opacity="0.7"/>
              {/* Inner petals - 8 petals */}
              <ellipse cx="100" cy="75" rx="8" ry="20" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
              <ellipse cx="100" cy="125" rx="8" ry="20" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
              <ellipse cx="75" cy="100" rx="20" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
              <ellipse cx="125" cy="100" rx="20" ry="8" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
              <ellipse cx="82" cy="82" rx="14" ry="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6" transform="rotate(-45 82 82)"/>
              <ellipse cx="118" cy="82" rx="14" ry="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6" transform="rotate(45 118 82)"/>
              <ellipse cx="82" cy="118" rx="14" ry="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6" transform="rotate(45 82 118)"/>
              <ellipse cx="118" cy="118" rx="14" ry="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6" transform="rotate(-45 118 118)"/>
              {/* Outer petals - larger */}
              <ellipse cx="100" cy="60" rx="10" ry="28" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <ellipse cx="100" cy="140" rx="10" ry="28" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <ellipse cx="60" cy="100" rx="28" ry="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <ellipse cx="140" cy="100" rx="28" ry="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
              <ellipse cx="75" cy="75" rx="20" ry="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" transform="rotate(-45 75 75)"/>
              <ellipse cx="125" cy="75" rx="20" ry="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" transform="rotate(45 125 75)"/>
              <ellipse cx="75" cy="125" rx="20" ry="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" transform="rotate(45 75 125)"/>
              <ellipse cx="125" cy="125" rx="20" ry="20" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5" transform="rotate(-45 125 125)"/>
            </svg>
          </div>
          
          {/* Lotus Flower Pattern - Bottom Left */}
          <div className="absolute bottom-0 left-0 w-28 h-28 opacity-12 translate-y-1/4 -translate-x-1/4 pointer-events-none">
            <svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
              {/* Center */}
              <circle cx="80" cy="80" r="8" fill="white" opacity="0.7"/>
              {/* Inner petals */}
              <ellipse cx="80" cy="60" rx="6" ry="16" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
              <ellipse cx="80" cy="100" rx="6" ry="16" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
              <ellipse cx="60" cy="80" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
              <ellipse cx="100" cy="80" rx="16" ry="6" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
              <ellipse cx="66" cy="66" rx="11" ry="11" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6" transform="rotate(-45 66 66)"/>
              <ellipse cx="94" cy="66" rx="11" ry="11" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6" transform="rotate(45 94 66)"/>
              <ellipse cx="66" cy="94" rx="11" ry="11" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6" transform="rotate(45 66 94)"/>
              <ellipse cx="94" cy="94" rx="11" ry="11" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6" transform="rotate(-45 94 94)"/>
              {/* Outer petals */}
              <ellipse cx="80" cy="50" rx="7" ry="22" fill="none" stroke="white" strokeWidth="1.3" opacity="0.5"/>
              <ellipse cx="80" cy="110" rx="7" ry="22" fill="none" stroke="white" strokeWidth="1.3" opacity="0.5"/>
              <ellipse cx="50" cy="80" rx="22" ry="7" fill="none" stroke="white" strokeWidth="1.3" opacity="0.5"/>
              <ellipse cx="110" cy="80" rx="22" ry="7" fill="none" stroke="white" strokeWidth="1.3" opacity="0.5"/>
            </svg>
          </div>

          {/* Detailed Mountains & Sun - Center Left */}
          <div className="absolute top-1/2 left-0 w-24 h-24 opacity-12 -translate-y-1/2 -translate-x-1/3 pointer-events-none">
            <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
              {/* Sun with detailed rays */}
              <circle cx="40" cy="35" r="14" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
              <circle cx="40" cy="35" r="10" fill="white" opacity="0.5"/>
              {/* Sun rays - 8 directions */}
              <line x1="40" y1="16" x2="40" y2="12" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="56" y1="19" x2="59" y2="16" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="59" y1="35" x2="63" y2="35" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="56" y1="51" x2="59" y2="54" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="24" y1="19" x2="21" y2="16" stroke="white" strokeWidth="2" opacity="0.5"/>
              <line x1="21" y1="35" x2="17" y2="35" stroke="white" strokeWidth="2" opacity="0.5"/>
              
              {/* Mountain range - more detailed */}
              <path d="M 10 100 L 35 60 L 50 75 L 60 100 Z" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
              <path d="M 45 100 L 70 50 L 85 65 L 95 100 Z" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
              <path d="M 75 100 L 90 70 L 105 100 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.5"/>
              
              {/* Snow peaks */}
              <path d="M 35 60 L 32 67 L 38 67 Z" fill="white" opacity="0.6"/>
              <path d="M 70 50 L 67 58 L 73 58 Z" fill="white" opacity="0.6"/>
              <path d="M 90 70 L 88 75 L 92 75 Z" fill="white" opacity="0.5"/>
              
              {/* Mountain details - ridges */}
              <path d="M 35 60 L 40 72" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M 35 60 L 30 72" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M 70 50 L 75 62" stroke="white" strokeWidth="1" opacity="0.4"/>
              <path d="M 70 50 L 65 62" stroke="white" strokeWidth="1" opacity="0.4"/>
            </svg>
          </div>

          <div className="space-y-6 relative z-10">
            {/* Route Information */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <MapPin className="w-5 h-5 text-yellow-400" />
                Route Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                    From Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10" />
                    <input
                      value={fromLoc}
                      onChange={(e) => setFromLoc(e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-xl transition-colors backdrop-blur-sm ${
                        darkMode 
                          ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                          : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                      } ${
                        errors.fromLoc ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-4 focus:ring-sky-400/20'
                      }`}
                      placeholder="Starting point..."
                    />
                  </div>
                  {errors.fromLoc && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.fromLoc}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                    To Location *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sky-400 pointer-events-none z-10" />
                    <input
                      value={toLoc}
                      onChange={(e) => setToLoc(e.target.value)}
                      className={`w-full pl-10 pr-3 py-3 border rounded-xl transition-colors backdrop-blur-sm ${
                        darkMode 
                          ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                          : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                      } ${
                        errors.toLoc ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-4 focus:ring-sky-400/20'
                      }`}
                      placeholder="Destination..."
                    />
                  </div>
                  {errors.toLoc && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.toLoc}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Calendar className="w-5 h-5 text-yellow-400" />
                Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                    Date *
                  </label>
                  <div className="relative group">
                    <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 group-hover:text-yellow-300 transition-colors z-10 pointer-events-none" />
                    <CustomDatePicker
                      value={date}
                      onChange={(dateValue) => setDate(dateValue)}
                      className={`backdrop-blur-sm ${
                        darkMode 
                          ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                          : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                      } focus:ring-4 focus:ring-sky-400/20`}
                      darkMode={darkMode}
                      errors={errors.date}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {errors.date && (
                    <div className="flex items-center gap-2 mt-2">
                      <X className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{errors.date}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                    Time *
                  </label>
                  <div className="relative group">
                    <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 group-hover:text-sky-300 transition-colors z-10 pointer-events-none" />
                    <CustomTimePicker
                      value={time}
                      onChange={(timeValue) => setTime(timeValue)}
                      className={`backdrop-blur-sm ${
                        darkMode 
                          ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                          : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                      } focus:ring-4 focus:ring-sky-400/20`}
                      darkMode={darkMode}
                      errors={errors.time}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {errors.time && (
                    <div className="flex items-center gap-2 mt-2">
                      <X className="w-4 h-4 text-red-400" />
                      <p className="text-red-400 text-sm">{errors.time}</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.datetime && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-red-500/10 rounded-lg border border-red-500/30 backdrop-blur-sm">
                  <X className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">{errors.datetime}</p>
                </div>
              )}
            </div>
          
          
          {/* Vehicle & Capacity */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Car className="w-5 h-5 text-yellow-400" />
              Vehicle & Seats
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                  Vehicle Details *
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10" />
                  <input
                    value={vehicle}
                    onChange={(e) => setVehicle(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl transition-colors backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                        : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                    } ${
                      errors.vehicle ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-4 focus:ring-sky-400/20'
                    }`}
                    placeholder="e.g., Honda City, White, MH12AB1234"
                  />
                </div>
                {errors.vehicle && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.vehicle}
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                  Available Seats *
                </label>
                <div className="relative group">
                  <CustomDropdown
                    value={seats}
                    onChange={(value) => setSeats(Number(value))}
                    options={[
                      { value: 1, label: '1 seat', icon: '👤' },
                      { value: 2, label: '2 seats', icon: '👥' },
                      { value: 3, label: '3 seats', icon: '👥' },
                      { value: 4, label: '4 seats', icon: '👥' },
                      { value: 5, label: '5 seats', icon: '👥' },
                      { value: 6, label: '6 seats', icon: '👥' }
                    ]}
                    placeholder="Select seats"
                    className={`backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                        : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                    } focus:ring-4 focus:ring-sky-400/20`}
                    darkMode={darkMode}
                    icon={Users}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.seats && (
                  <div className="flex items-center gap-2 mt-2">
                    <X className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm">{errors.seats}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Price */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <IndianRupee className="w-5 h-5 text-yellow-400" />
                Price
              </h2>
              <div className="max-w-sm">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-sky-100' : 'text-gray-700'}`}>
                  Price per Person (₹) *
                </label>
                <div className="relative">
                  <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10" />
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full pl-10 pr-3 py-3 border rounded-xl transition-colors backdrop-blur-sm ${
                      darkMode 
                        ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                        : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                    } ${
                      errors.price ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'focus:ring-4 focus:ring-sky-400/20'
                    }`}
                    placeholder="Enter fare per person..."
                    min="0"
                    step="10"
                  />
                </div>
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.price}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Description (Optional)</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl transition-colors backdrop-blur-sm resize-none ${
                  darkMode 
                    ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                    : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                } focus:ring-4 focus:ring-sky-400/20`}
                placeholder="Any additional details about the ride, pickup points, preferences, etc..."
              />
            </div>

            {/* Contact Information */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Phone className="w-5 h-5 text-yellow-400" />
                Contact Information *
              </h2>

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="flex flex-col sm:flex-row gap-3">
                    <div className="w-full sm:w-40">
                      <CustomDropdown
                        value={contact.type}
                        onChange={(value) => updateContact(contact.id, "type", value)}
                        options={[
                          { value: 'mobile', label: 'Mobile', icon: '📱' },
                          { value: 'email', label: 'Email', icon: '📧' },
                          { value: 'instagram', label: 'Instagram', icon: '📷' }
                        ]}
                        placeholder="Contact type"
                        className={`backdrop-blur-sm py-3 text-sm ${
                          darkMode 
                            ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                            : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                        } focus:ring-4 focus:ring-sky-400/20`}
                        darkMode={darkMode}
                      />
                    </div>
                    
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 pointer-events-none z-10">
                        {iconForType(contact.type)}
                      </div>
                      <input
                        value={contact.value}
                        onChange={(e) => updateContact(contact.id, "value", e.target.value)}
                        className={`w-full pl-10 pr-3 py-3 border rounded-xl transition-colors backdrop-blur-sm ${
                          darkMode 
                            ? 'bg-white/5 text-white placeholder-gray-400 border-white/10 focus:border-sky-400' 
                            : 'bg-white/60 text-gray-900 placeholder-gray-500 border-gray-200 focus:border-sky-500'
                        } focus:ring-4 focus:ring-sky-400/20`}
                        placeholder={
                          contact.type === "mobile" ? "+91 98765 43210" :
                          contact.type === "email" ? "your.email@example.com" :
                          "@your_username"
                        }
                      />
                    </div>

                    {contacts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeContact(contact.id)}
                        className={`self-start sm:self-center p-3 rounded-lg transition-all ${
                          darkMode 
                            ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                            : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}

                {/* Add Contact Button */}
                <button
                  type="button"
                  onClick={addContact}
                  className={`w-full sm:w-auto px-4 py-2.5 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
                    darkMode 
                      ? 'border-sky-400/30 text-sky-400 hover:bg-sky-400/10 hover:border-sky-400/50' 
                      : 'border-sky-500/30 text-sky-600 hover:bg-sky-50 hover:border-sky-500/50'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Another Contact
                </button>
              </div>

              {errors.contacts && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                  <X className="w-3 h-3" />
                  {errors.contacts}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link 
                href="/share-ride"
                className={`flex-1 py-3 px-6 border rounded-xl text-center transition-all font-medium ${
                  darkMode 
                    ? 'border-white/20 text-white hover:bg-white/5 hover:border-white/30' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                Cancel
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className={`flex-1 py-3 px-6 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isSubmitting || !isAuthenticated
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-sky-400 hover:from-yellow-500 hover:to-sky-500'
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
          </div>
        </form>
      </main>

      <SmallFooter />
      
      {/* Success Popup */}
      <SuccessPopup 
        isVisible={showSuccessPopup} 
        onClose={() => setShowSuccessPopup(false)} 
      />
    </div>
  );
}
