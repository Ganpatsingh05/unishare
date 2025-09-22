"use client";

import React, { useState, useEffect, useCallback } from "react";
import Footer from "../../_components/Footer";
import SmallFooter from "../../_components/SmallFooter";
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
  const { darkMode } = useUI();
  const { user, isAuthenticated } = useAuth();
  const { showTemporaryMessage } = useMessages();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

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

      const result = await createRide(rideData);
      
      if (result.success) {
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

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-950" : "bg-gray-50"}`}>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
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
        <form onSubmit={handleSubmit} className={`${cardBg} rounded-xl shadow-lg border p-6`}>
          <div className="space-y-6">
            {/* Route Information */}
            <div>
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
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Schedule</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-3 ${labelClr}`}>
                    Date *
                  </label>
                  <div className="relative group">
                    <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors z-10" />
                    <CustomDatePicker
                      value={date}
                      onChange={(dateValue) => setDate(dateValue)}
                      className={`${inputBg}`}
                      darkMode={darkMode}
                      errors={errors.date}
                      minDate={new Date().toISOString().split('T')[0]}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {errors.date && (
                    <div className="flex items-center gap-2 mt-2">
                      <X className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.date}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-3 ${labelClr}`}>
                    Time *
                  </label>
                  <div className="relative group">
                    <Clock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors z-10" />
                    <CustomTimePicker
                      value={time}
                      onChange={(timeValue) => setTime(timeValue)}
                      className={`${inputBg}`}
                      darkMode={darkMode}
                      errors={errors.time}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  {errors.time && (
                    <div className="flex items-center gap-2 mt-2">
                      <X className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm">{errors.time}</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.datetime && (
                <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <X className="w-4 h-4 text-red-500" />
                  <p className="text-red-500 text-sm">{errors.datetime}</p>
                </div>
              )}
            </div>
          
          
          {/* Vehicle & Capacity */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Vehicle & Seats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
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
                <label className={`block text-sm font-medium mb-3 ${labelClr}`}>
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
                    className={`${inputBg}`}
                    darkMode={darkMode}
                    icon={Users}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-50 to-transparent dark:from-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
                {errors.seats && (
                  <div className="flex items-center gap-2 mt-2">
                    <X className="w-4 h-4 text-red-500" />
                    <p className="text-red-500 text-sm">{errors.seats}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

            {/* Price */}
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Price</h2>
              <div className="max-w-sm">
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
            <div>
              <h2 className={`text-lg font-semibold mb-4 ${titleClr}`}>Description (Optional)</h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`w-full px-3 py-3 border rounded-lg transition-colors ${inputBg} resize-none`}
                placeholder="Any additional details about the ride, pickup points, preferences, etc..."
              />
            </div>

            {/* Contact Information */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-lg font-semibold ${titleClr}`}>Contact Information *</h2>
                <button
                  type="button"
                  onClick={addContact}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Contact
                </button>
              </div>

              <div className="space-y-3">
                {contacts.map((contact, index) => (
                  <div key={contact.id} className="flex gap-3 items-center">
                    <div className="w-40">
                      <CustomDropdown
                        value={contact.type}
                        onChange={(value) => updateContact(contact.id, "type", value)}
                        options={[
                          { value: 'mobile', label: 'Mobile', icon: '📱' },
                          { value: 'email', label: 'Email', icon: '📧' },
                          { value: 'instagram', label: 'Instagram', icon: '📷' }
                        ]}
                        placeholder="Contact type"
                        className={`${inputBg} py-3 text-sm`}
                        darkMode={darkMode}
                      />
                    </div>
                    
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {iconForType(contact.type)}
                      </div>
                      <input
                        value={contact.value}
                        onChange={(e) => updateContact(contact.id, "value", e.target.value)}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg transition-colors ${inputBg}`}
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
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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