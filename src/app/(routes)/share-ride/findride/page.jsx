"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
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
  Star,
  Shield,
  ArrowLeft,
  Search,
  Filter,
  IndianRupee,
  Plus,
  X,
  Eye,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
} from "lucide-react";
import { useUI, useAuth, useMessages } from "./../../../lib/contexts/UniShareContext";
import Link from "next/link";

// Custom Dropdown Component for Seats
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
        className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 focus:border-orange-500 hover:border-orange-300 cursor-pointer ${className} border-gray-200 dark:border-gray-600 text-sm font-medium flex items-center justify-between relative`}
      >
        {Icon && (
          <Icon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors pointer-events-none" />
        )}
        <span className={selectedOption ? (darkMode ? 'text-gray-100' : 'text-gray-900') : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Inline Options */}
      {isOpen && (
        <div className={`mt-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl overflow-hidden max-h-64 overflow-y-auto`}>
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-3 ${
                value === option.value 
                  ? 'bg-orange-500 text-white' 
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
    </div>
  );
}

// Custom DatePicker Component
function CustomDatePicker({ value, onChange, className, darkMode, minDate }) {
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

  const days = useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);

  return (
    <div className="relative">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/30 focus:border-purple-500 hover:border-purple-300 cursor-pointer ${className} border-gray-200 dark:border-gray-600 text-sm font-medium flex items-center justify-between relative`}
      >
        {/* Calendar icon placeholder - actual icon rendered outside by parent */}
        <span className={selectedDate ? (darkMode ? 'text-gray-100' : 'text-gray-900') : 'text-gray-500'}>
          {formatDisplayDate(selectedDate)}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Inline Calendar */}
      {isOpen && (
        <div className={`mt-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-2xl overflow-hidden`}>
          {/* Header with month navigation */}
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-gray-200'} border-b flex items-center justify-between`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateMonth(-1);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-purple-100 text-gray-700'} transition-colors`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateMonth(1);
              }}
              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-purple-100 text-gray-700'} transition-colors`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className={`grid grid-cols-7 ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} border-b ${darkMode ? 'border-gray-600' : 'border-purple-100'}`}>
            {weekDays.map((day) => (
              <div key={day} className={`p-2 text-center text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-purple-600'}`}>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDateSelect(date);
                    }}
                    disabled={isDateDisabled(date)}
                    className={`w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center relative ${
                      isSelected(date)
                        ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                        : isToday(date)
                        ? darkMode
                          ? 'bg-purple-900/30 text-purple-400 border border-purple-500'
                          : 'bg-purple-100 text-purple-600 border border-purple-300'
                        : isDateDisabled(date)
                        ? darkMode
                          ? 'text-gray-600 cursor-not-allowed opacity-50'
                          : 'text-gray-400 cursor-not-allowed opacity-50'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                    }`}
                  >
                    {date.getDate()}
                    {isToday(date) && !isSelected(date) && (
                      <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                        darkMode ? 'bg-purple-400' : 'bg-purple-600'
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
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-purple-50 border-purple-100'} border-t flex justify-between items-center`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToToday();
              }}
              className="text-sm text-purple-500 hover:text-purple-600 transition-colors font-medium px-2 py-1 rounded hover:bg-purple-100 dark:hover:bg-purple-900/30"
            >
              📅 Today
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className={`text-sm px-2 py-1 rounded transition-colors ${darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-600' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'}`}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FindRidePage() {
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const { showTemporaryMessage } = useMessages();
  
  // Search filters
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [date, setDate] = useState("");
  const [seatsNeeded, setSeatsNeeded] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Remove active section state - now only search functionality

  // State for rides data
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state for detailed view
  const [selectedRide, setSelectedRide] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Join confirmation modal state
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [rideToJoin, setRideToJoin] = useState(null);
  const [joiningRide, setJoiningRide] = useState(false);
  
  // Error modal state
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '', type: 'error' });

  // State for tracking user's sent requests (for checking join status only)
  const [userSentRequests, setUserSentRequests] = useState([]);
  
  // State for tracking last refresh time
  const [lastRefreshTime, setLastRefreshTime] = useState(null);

  // Fetch rides from API
  const fetchRides = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) setLoading(true);
      setError(null);
      
      const { fetchRides: fetchRidesAPI } = await import("../../../lib/api");
      
      const filters = {};
      if (fromLoc.trim()) filters.from = fromLoc.trim();
      if (toLoc.trim()) filters.to = toLoc.trim();
      if (date) filters.date = date;
      if (seatsNeeded > 1) filters.seatsNeeded = seatsNeeded;
      
      const result = await fetchRidesAPI(filters);
      
      if (result.success) {
        // Transform backend data to match frontend format
        const transformedRides = result.data.map(ride => ({
          id: ride.id,
          driver: ride.driver_name || ride.users?.name || 'Anonymous',
          driverId: ride.driver_id || ride.user_id,
          from: ride.from_location,
          to: ride.to_location,
          date: ride.date,
          time: ride.time.substring(0, 5), // Format time to HH:MM (remove seconds)
          seats: ride.available_seats,
          price: ride.price,
          vehicle: ride.vehicle_info,
          description: ride.description,
          contacts: Object.entries(ride.contact_info || {}).map(([type, value]) => ({
            type,
            value
          }))
        }));
        
        // Filter out user's own rides (you can't join your own ride)
        const filteredRides = user && user.id 
          ? transformedRides.filter(ride => ride.driverId !== user.id)
          : transformedRides;
        
        setRides(filteredRides);
        setLastRefreshTime(new Date());
      } else {
        throw new Error(result.error || 'Failed to fetch rides');
      }
    } catch (error) {
      setError(error.message);
      setRides([]);
    } finally {
      if (showLoadingState) setLoading(false);
    }
  }, [fromLoc, toLoc, date, seatsNeeded, user?.id]);

  // Fetch user's sent requests
  const fetchUserSentRequests = useCallback(async (showLoadingState = true) => {
    if (!isAuthenticated || !user?.id) {
      setUserSentRequests([]);
      return;
    }

    try {
      const { getUserSentRequests } = await import("../../../lib/api");
      const result = await getUserSentRequests();
      
      if (result.success) {
        setUserSentRequests(result.data || []);
        setLastRefreshTime(new Date());
      } else {
        setUserSentRequests([]);
      }
    } catch (error) {
      setUserSentRequests([]);
    }
  }, [isAuthenticated, user?.id]);

  // Fetch rides on component mount and when filters or user changes
  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  // Fetch user's sent requests when user is authenticated
  useEffect(() => {
    fetchUserSentRequests();
  }, [fetchUserSentRequests]);

  // Refresh data when user returns to the page (from other tabs/pages)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden && isAuthenticated) {
        // Page became visible, refresh data
        await Promise.all([
          fetchUserSentRequests(false),
          fetchRides(false)
        ]);
      }
    };

    const handleFocus = async () => {
      if (isAuthenticated) {
        // Window got focus, refresh data
        await Promise.all([
          fetchUserSentRequests(false),
          fetchRides(false)
        ]);
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [isAuthenticated, fetchUserSentRequests, fetchRides]);

  // Filter rides to show only those user hasn't requested or can request again
  const filteredRides = useMemo(() => {
    // Helper function to check if user has requested a specific ride
    const getUserRequestStatus = (rideId) => {
      const request = userSentRequests.find(req => req.ride_id === rideId);
      if (!request) return { hasRequested: false, status: null };
      return { hasRequested: true, status: request.status };
    };

    // Show rides user hasn't requested OR rides where previous request was rejected/cancelled
    // Hide only: pending and accepted requests
    return rides.filter(ride => {
      const requestStatus = getUserRequestStatus(ride.id);
      return !requestStatus.hasRequested || 
             requestStatus.status === 'rejected' || 
             requestStatus.status === 'cancelled';
    });
  }, [rides, userSentRequests]);

  // Helper function to check if user has requested a specific ride (for UI components)
  const getUserRequestStatus = (rideId) => {
    const request = userSentRequests.find(req => req.ride_id === rideId);
    if (!request) return { hasRequested: false, status: null };
    return { hasRequested: true, status: request.status };
  };

  // Enhanced manual refresh function
  const handleManualRefresh = async () => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        await Promise.all([
          fetchUserSentRequests(false),
          fetchRides(false)
        ]);
      } else {
        await fetchRides(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle view details
  const handleViewDetails = (ride) => {
    setSelectedRide(ride);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedRide(null);
  };

  // Show user-friendly instruction messages
  const showInstructionMessage = (message, title = 'Information') => {
    let messageConfig = {
      title: title,
      message: message,
      type: 'info'
    };

    // Customize messages to be more instructional and friendly
    if (message.includes('You already have a pending request for this ride') || 
        message.includes('You have already requested to join this ride')) {
      messageConfig = {
        title: 'Hold On!',
        message: 'Good news! You\'ve already requested to join this ride. The provider will review your request soon and notify you of their decision. Feel free to browse other rides in the meantime!',
        type: 'pending',
        actionText: 'Browse More Rides'
      };
    } else if (message.includes('You cannot request to join your own ride')) {
      messageConfig = {
        title: 'That\'s Your Ride!',
        message: 'This is the ride you posted! You can\'t join your own ride, but you can check who has requested to join by visiting your ride management page.',
        type: 'info',
        actionText: 'Manage My Rides'
      };
    } else if (message.includes('Not enough seats available')) {
      messageConfig = {
        title: 'Seats Full',
        message: 'This ride is currently full, but don\'t worry! More rides are posted regularly. Try setting up search filters or check back later for new opportunities.',
        type: 'suggestion',
        actionText: 'Set Filters'
      };
    } else if (message.includes('Ride not found or not active')) {
      messageConfig = {
        title: 'Ride Unavailable',
        message: 'This ride is no longer available - it may have been completed or cancelled. Don\'t worry, there are plenty of other rides available!',
        type: 'suggestion',
        actionText: 'Find Other Rides'
      };
    } else if (message.includes('Failed to create ride request')) {
      messageConfig = {
        title: 'Connection Issue',
        message: 'We\'re having trouble processing your request right now. This usually resolves quickly - please try again in a moment!',
        type: 'retry',
        actionText: 'Try Again'
      };
    } else if (message.includes('Please login')) {
      messageConfig = {
        title: 'Join the Community',
        message: 'To connect with ride providers and join rides, you\'ll need to sign in to your account. It just takes a moment!',
        type: 'login',
        actionText: 'Sign In'
      };
    }

    setErrorDetails(messageConfig);
    setShowErrorModal(true);
  };

  // Handle join ride request - show confirmation modal
  const handleJoinRide = async (rideId, ride) => {
    if (!isAuthenticated) {
      showInstructionMessage("Please log in to your account to join rides and connect with other users.", "Login Required");
      return;
    }

    // Show confirmation modal
    setRideToJoin({ id: rideId, ...ride });
    setShowJoinModal(true);
  };

  // Enhanced actual join ride function with proper state management
  const confirmJoinRide = async () => {
    if (!rideToJoin) return;
    
    setJoiningRide(true);
    
    // Store original state for potential rollback
    const originalRequests = userSentRequests;
    
    try {
      const { requestRideJoin } = await import("../../../lib/api");
      
      const requestData = {
        seatsRequested: 1,
        message: `Hi! I would like to join your ride from ${rideToJoin.from} to ${rideToJoin.to} on ${rideToJoin.date}.`,
        contactMethod: 'mobile'
      };

      // Optimistic update - add request immediately
      const optimisticRequest = {
        id: Date.now(), // Temporary ID
        ride_id: rideToJoin.id,
        status: 'pending',
        created_at: new Date().toISOString(),
        seats_requested: 1,
        message: requestData.message
      };
      
      setUserSentRequests(prev => [...prev, optimisticRequest]);

      const result = await requestRideJoin(rideToJoin.id, requestData);
      
      if (result.success) {
        // Update with real data from server
        const newRequest = {
          id: result.data?.id || optimisticRequest.id,
          ride_id: rideToJoin.id,
          status: 'pending',
          created_at: new Date().toISOString(),
          seats_requested: 1,
          message: requestData.message
        };
        
        // Replace optimistic update with real data
        setUserSentRequests(prev => 
          prev.map(req => 
            req.id === optimisticRequest.id ? newRequest : req
          )
        );
        
        // Refresh both data sources in background to ensure consistency
        Promise.all([
          fetchUserSentRequests(false),
          fetchRides(false)
        ]);
        
        // Show success message with enhanced callback
        setErrorDetails({
          title: 'Request Sent Successfully!',
          message: 'Your ride request has been sent to the provider. You can check the status in your requests page.',
          type: 'success',
          actionText: 'View My Requests',
          actionCallback: () => {
            // Close modal and redirect to requests page
            setShowErrorModal(false);
            window.location.href = '/my-activity/requests/sharerideREQ';
          }
        });
        setShowErrorModal(true);
        setShowJoinModal(false);
        setRideToJoin(null);
      } else {
        // Rollback optimistic update on failure
        setUserSentRequests(originalRequests);
        showInstructionMessage(result.message || result.error || 'Failed to send request');
      }
    } catch (error) {
      // Rollback optimistic update on error
      setUserSentRequests(originalRequests);
      showInstructionMessage(error.message || 'Network error. Please check your connection and try again.');
    } finally {
      setJoiningRide(false);
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

  // Modal Component for Detailed View
  const RideDetailsModal = () => {
    if (!showModal || !selectedRide) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${cardBg} border border-white/10`}>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${titleClr}`}>Ride Details</h2>
            <button
              onClick={closeModal}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${labelClr}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Provider & Vehicle Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${titleClr}`}>{selectedRide.driver}</h3>
                <p className={`text-sm ${labelClr}`}>{selectedRide.vehicle}</p>
              </div>
            </div>

            {/* Route Information */}
            <div className="space-y-3">
              <h4 className={`font-semibold ${titleClr}`}>Route Information</h4>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span className={`font-medium ${titleClr}`}>
                  {selectedRide.from} → {selectedRide.to}
                </span>
              </div>
            </div>

            {/* Trip Details */}
            <div className="space-y-3">
              <h4 className={`font-semibold ${titleClr}`}>Trip Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <div>
                    <p className={`text-xs ${labelClr}`}>Date</p>
                    <p className={`font-medium ${titleClr}`}>{selectedRide.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className={`text-xs ${labelClr}`}>Time</p>
                    <p className={`font-medium ${titleClr}`}>{selectedRide.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className={`text-xs ${labelClr}`}>Available Seats</p>
                    <p className={`font-medium ${titleClr}`}>{selectedRide.seats}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <h4 className={`font-semibold ${titleClr}`}>Price</h4>
              <div className="flex items-center gap-1 text-2xl font-bold text-emerald-600">
                <IndianRupee className="w-6 h-6" />
                {selectedRide.price}
                <span className={`text-sm font-normal ${labelClr}`}>per person</span>
              </div>
            </div>

            {/* Description */}
            {selectedRide.description && (
              <div className="space-y-2">
                <h4 className={`font-semibold ${titleClr}`}>Description</h4>
                <p className={`${labelClr}`}>{selectedRide.description}</p>
              </div>
            )}

            {/* Contact Information */}
            {selectedRide.contacts && selectedRide.contacts.length > 0 && (
              <div className="space-y-3">
                <h4 className={`font-semibold ${titleClr}`}>Contact</h4>
                <div className="flex flex-wrap gap-3">
                  {selectedRide.contacts.map((contact, idx) => (
                    <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
                    }`}>
                      {iconForType(contact.type)}
                      <span className={`text-sm ${titleClr}`}>{contact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {(() => {
                const requestStatus = getUserRequestStatus(selectedRide.id);
                
                if (requestStatus.hasRequested) {
                  // Show different button based on request status
                  if (requestStatus.status === 'accepted') {
                    return (
                      <button
                        disabled
                        className="w-full px-6 py-3 bg-green-500 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        You've Joined This Ride
                      </button>
                    );
                  } else if (requestStatus.status === 'rejected') {
                    return (
                      <button
                        disabled
                        className="w-full px-6 py-3 bg-red-500 text-white rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Request Rejected
                      </button>
                    );
                  } else {
                    // Pending status
                    return (
                      <button
                        onClick={() => window.location.href = '/my-activity/requests/sharerideREQ'}
                        className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Clock className="w-5 h-5" />
                        View Status
                      </button>
                    );
                  }
                } else {
                  // User hasn't requested this ride yet
                  return (
                    <button
                      onClick={() => {
                        closeModal();
                        handleJoinRide(selectedRide.id, selectedRide);
                      }}
                      className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Join This Ride
                    </button>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Join Confirmation Modal
  const JoinRideModal = () => {
    if (!showJoinModal || !rideToJoin) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className={`max-w-md w-full rounded-xl shadow-2xl ${cardBg} border border-white/10`}>
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-xl font-bold ${titleClr}`}>Join Ride</h2>
            <button
              onClick={() => {
                setShowJoinModal(false);
                setRideToJoin(null);
              }}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${labelClr}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-4">
            {/* Ride Summary */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`font-semibold ${titleClr}`}>{rideToJoin.driver}</p>
                  <p className={`text-sm ${labelClr}`}>{rideToJoin.vehicle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className={`text-sm font-medium ${titleClr}`}>
                  {rideToJoin.from} → {rideToJoin.to}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span className={labelClr}>{rideToJoin.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className={labelClr}>{rideToJoin.time}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <IndianRupee className="w-4 h-4" />
                  <span className="font-semibold">{rideToJoin.price}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'
            } border`}>
              <h4 className={`font-semibold mb-2 ${titleClr}`}>Request Details</h4>
              <p className={`text-sm ${labelClr} mb-2`}>
                You're requesting to join this ride for <strong>1 seat</strong>.
              </p>
              <p className={`text-xs ${labelClr}`}>
                The provider will receive your request and can accept or decline it. 
                You'll be notified of their decision.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setRideToJoin(null);
                }}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
                disabled={joiningRide}
              >
                Cancel
              </button>
              <button
                onClick={confirmJoinRide}
                disabled={joiningRide}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {joiningRide ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Instruction Modal (previously Error Modal)
  const InstructionModal = () => {
    if (!showErrorModal) return null;

    const getIcon = () => {
      switch (errorDetails.type) {
        case 'success':
          return <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>;
        case 'pending':
          return <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-white" />
          </div>;
        case 'suggestion':
          return <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>;
        case 'retry':
          return <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <ArrowLeft className="w-8 h-8 text-white rotate-180" />
          </div>;
        case 'login':
          return <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>;
        case 'info':
        default:
          return <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <Info className="w-8 h-8 text-white" />
          </div>;
      }
    };

    const getGradient = () => {
      switch (errorDetails.type) {
        case 'success':
          return 'from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border-emerald-200 dark:border-emerald-700';
        case 'pending':
          return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700';
        case 'suggestion':
          return 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700';
        case 'retry':
          return 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700';
        case 'login':
          return 'from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 border-indigo-200 dark:border-indigo-700';
        case 'info':
        default:
          return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700';
      }
    };

    const getButtonStyle = () => {
      switch (errorDetails.type) {
        case 'success':
          return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700';
        case 'pending':
          return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
        case 'suggestion':
          return 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700';
        case 'retry':
          return 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700';
        case 'login':
          return 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700';
        case 'info':
        default:
          return 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className={`max-w-lg w-full rounded-2xl shadow-2xl ${cardBg} overflow-hidden border border-white/10`}>
          {/* Decorative Header */}
          <div className={`h-2 bg-gradient-to-r ${errorDetails.type === 'success' ? 'from-emerald-400 to-emerald-600' : errorDetails.type === 'pending' ? 'from-blue-400 to-blue-600' : errorDetails.type === 'suggestion' ? 'from-purple-400 to-purple-600' : errorDetails.type === 'retry' ? 'from-orange-400 to-orange-600' : errorDetails.type === 'login' ? 'from-indigo-400 to-indigo-600' : 'from-blue-400 to-blue-600'}`}></div>
          
          {/* Modal Content */}
          <div className="p-8 text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              {getIcon()}
            </div>

            {/* Title */}
            <div>
              <h2 className={`text-2xl font-bold ${titleClr} mb-2`}>
                {errorDetails.title}
              </h2>
            </div>

            {/* Message */}
            <div className={`p-6 rounded-xl border-2 bg-gradient-to-br ${getGradient()}`}>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {errorDetails.message}
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={async () => {
                // If there's a callback, execute it
                if (errorDetails.actionCallback) {
                  await errorDetails.actionCallback();
                } else {
                  setShowErrorModal(false);
                  setErrorDetails({ title: '', message: '', type: 'error' });
                }
              }}
              className={`w-full px-6 py-4 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 ${getButtonStyle()} shadow-lg`}
            >
              {errorDetails.actionText || (errorDetails.type === 'success' ? 'Awesome!' : 'Got it!')}
            </button>

            {/* Secondary Action for certain types */}
            {errorDetails.type === 'suggestion' && (
              <button
                onClick={() => {
                  setShowErrorModal(false);
                  setShowFilters(true);
                }}
                className={`w-full px-6 py-3 border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-300 font-medium rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors`}
              >
                Set Search Filters
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* ShareRide Mercury Gray Theme */}
      <ShareRideTheme />
      
      {/* Modals */}
      <RideDetailsModal />
      <JoinRideModal />
      <InstructionModal />
      
      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        

        {/* Compact Search Bar */}
        <section className="mb-6">
          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 sm:px-5 py-3 rounded-xl border backdrop-blur-lg transition-all duration-300 relative overflow-hidden group hover:shadow-xl"
            style={{
              background: darkMode 
                ? '#1D3557' 
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
              borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(148, 163, 184, 0.2)',
              boxShadow: darkMode 
                ? '0 4px 16px -4px rgba(29, 53, 87, 0.4)'
                : '0 4px 16px -4px rgba(100, 116, 139, 0.2)'
            }}>
            {/* Decorative Elements */}
            <div className={`absolute -bottom-8 -left-8 w-24 h-24 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/20'} pointer-events-none`} />
            <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/20'} pointer-events-none`} />
            <div className={`absolute top-3 right-12 w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'} pointer-events-none`} />
            <div className={`absolute bottom-3 left-20 w-2 h-2 rounded-full ${darkMode ? 'bg-white/5' : 'bg-blue-400/15'} pointer-events-none`} />
            
            {/* Gradient Overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-60 rounded-xl"
              style={{
                background: darkMode 
                  ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
              }}
            />

            {/* Content - with relative z-index to stay above decorations */}
            <div className="relative z-10 flex items-center gap-3 w-full">
              {/* Search Icon */}
              <Search className="w-5 h-5 flex-shrink-0" style={{ color: darkMode ? '#facc15' : '#d97706' }} />
              
              {/* Search Text */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 text-left min-w-0"
              >
                {(fromLoc || toLoc || date || seatsNeeded > 1) ? (
                  <p className={`text-sm sm:text-base font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {[
                      fromLoc && `${fromLoc}`,
                      toLoc && `${toLoc}`,
                      date,
                      seatsNeeded > 1 && `${seatsNeeded} seats`
                    ].filter(Boolean).join(' • ')}
                  </p>
                ) : (
                  <p className="text-sm sm:text-base font-normal" style={{ color: darkMode ? '#93C5FD' : '#3b82f6' }}>
                    Search rides...
                  </p>
                )}
              </button>

              {/* Filter Icon */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex-shrink-0 p-1.5 rounded-full backdrop-blur-md border transition-all duration-300"
                style={{
                  background: darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                  borderColor: darkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} style={{ color: darkMode ? '#38bdf8' : '#3b82f6' }} />
              </button>
            </div>
          </div>

          {/* Expandable Filters Panel */}
          <div className={`transition-all duration-500 ${
            showFilters ? 'max-h-[1000px] opacity-100 mt-4 mb-4' : 'max-h-0 opacity-0'
          }`}>
            <div className="p-4 sm:p-6 rounded-[20px] border backdrop-blur-lg relative"
              style={{
                background: darkMode 
                  ? '#1D3557' 
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(148, 163, 184, 0.2)',
                boxShadow: darkMode 
                  ? '0 8px 20px -6px rgba(29, 53, 87, 0.3)'
                  : '0 8px 20px -6px rgba(100, 116, 139, 0.2)',
                overflow: 'visible'
              }}>
              {/* Decorative Elements */}
              <div className={`absolute -bottom-16 -left-16 w-48 h-48 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/20'} pointer-events-none -z-10`} />
              <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/20'} pointer-events-none -z-10`} />
              
              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-60 rounded-[20px] -z-10"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
                }}
              />

              <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-4">
              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors" style={{ color: darkMode ? '#facc15' : '#d97706' }}>
                  📍 From Location
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    value={fromLoc}
                    onChange={(e) => setFromLoc(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 hover:border-blue-300 ${inputBg}`}
                    placeholder="Starting point..."
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors" style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>
                  🎯 To Location
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  <input
                    value={toLoc}
                    onChange={(e) => setToLoc(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-sm transition-all duration-200 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/30 focus:border-emerald-500 hover:border-emerald-300 ${inputBg}`}
                    placeholder="Destination..."
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="block text-sm font-semibold mb-3 transition-colors" style={{ color: darkMode ? '#facc15' : '#d97706' }}>
                  📅 Date
                </label>
                <div className="relative">
                  <Calendar className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-purple-500 transition-colors pointer-events-none" />
                  <CustomDatePicker
                    value={date}
                    onChange={(dateValue) => setDate(dateValue)}
                    className={`${inputBg}`}
                    darkMode={darkMode}
                    minDate={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold mb-3 transition-colors" style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>
                  👥 Seats Needed
                </label>
                <div className="relative">
                  <CustomDropdown
                    value={seatsNeeded}
                    onChange={(value) => setSeatsNeeded(Number(value))}
                    options={[
                      { value: 1, label: '1 seat', icon: '👤' },
                      { value: 2, label: '2 seats', icon: '👥' },
                      { value: 3, label: '3 seats', icon: '👥' },
                      { value: 4, label: '4 seats', icon: '👥' },
                      { value: 5, label: '5 seats', icon: '👥' }
                    ]}
                    placeholder="Select seats"
                    className={`${inputBg}`}
                    darkMode={darkMode}
                    icon={Users}
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {(fromLoc || toLoc || date || seatsNeeded > 1) && (
              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm font-medium" style={{ color: '#93C5FD' }}>
                  Active filters: {[fromLoc && 'From', toLoc && 'To', date && 'Date', seatsNeeded > 1 && 'Seats'].filter(Boolean).join(', ')}
                </div>
                <button
                  onClick={() => {
                    setFromLoc("");
                    setToLoc("");
                    setDate("");
                    setSeatsNeeded(1);
                  }}
                  className="px-4 py-2 text-sm font-medium backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  style={{ color: '#ef4444' }}
                >
                  Clear all filters
                </button>
              </div>
            )}
              </div>
            </div>
          </div>
        </section>

        {/* Modern Results Header */}
        <div className="flex items-center justify-between mb-6 mt-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className={`text-2xl font-bold ${titleClr} flex items-center gap-2`}>
                <Car className="w-7 h-7 text-blue-500" />
                Available Rides
              </h2>
              <p className={`text-sm ${labelClr} mt-1`}>
                {loading ? 'Searching...' : `${filteredRides.length} ride${filteredRides.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Live Status Indicator */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              darkMode 
                ? 'bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-800' 
                : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300'
            }`}>
              <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`}></div>
              <span className={`text-sm font-medium ${darkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {loading ? 'Updating...' : 'Live Results'}
              </span>
            </div>
            
            {/* Stats */}
            {lastRefreshTime && !loading && (
              <div className={`text-xs hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Last updated {lastRefreshTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            )}
          </div>
        </div>

        {/* Rides List */}
        <section className="space-y-4">
          {loading ? (
            <div className={`text-center py-12 rounded-xl border ${cardBg}`}>
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              <h3 className={`text-xl font-semibold mb-2 ${titleClr}`}>
                Loading Rides...
              </h3>
              <p className={`${labelClr}`}>
                Searching for available rides
              </p>
            </div>
          ) : error ? (
            <div className={`text-center py-12 rounded-xl border-2 border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-700`}>
              <X className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <h3 className={`text-xl font-semibold mb-2 text-red-700 dark:text-red-300`}>Error Loading Rides</h3>
              <p className={`text-red-600 dark:text-red-400 mb-4`}>{error}</p>
              <button
                onClick={fetchRides}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : filteredRides.length === 0 ? (
            <div className={`text-center py-12 rounded-xl border-2 border-dashed ${
              darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-300 bg-gray-50'
            }`}>
              <Car className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className={`text-xl font-semibold mb-2 ${titleClr}`}>No Rides Found</h3>
              <p className={`${labelClr} mb-4`}>
                Try adjusting your search criteria or check back later for new rides.
              </p>
              <Link 
                href="/share-ride/postride"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Post Your Ride Instead
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRides.map((ride) => {
                // Check if user has a previous request for this ride
                const requestStatus = getUserRequestStatus(ride.id);
                const hasPreviousRequest = requestStatus.hasRequested && 
                  (requestStatus.status === 'rejected' || requestStatus.status === 'cancelled');
                
                return (
                <div 
                  key={ride.id} 
                  onClick={() => handleJoinRide(ride.id, ride)}
                  className="group rounded-2xl border backdrop-blur-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative cursor-pointer"
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

                  {/* Detailed Location Pins & Path - Center */}
                  <div className="absolute top-1/3 right-1/4 w-28 h-28 opacity-12 pointer-events-none">
                    <svg viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
                      {/* Starting location pin - detailed */}
                      <path d="M 50 40 L 50 60 L 55 65 L 50 60 L 45 65 Z" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
                      <circle cx="50" cy="48" r="7" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
                      <circle cx="50" cy="48" r="3" fill="white" opacity="0.7"/>
                      
                      {/* Destination location pin - detailed */}
                      <path d="M 100 90 L 100 110 L 105 115 L 100 110 L 95 115 Z" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
                      <circle cx="100" cy="98" r="7" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
                      <circle cx="100" cy="98" r="3" fill="white" opacity="0.7"/>
                      
                      {/* Travel path - curved with direction */}
                      <path d="M 55 55 Q 70 65 85 80 T 98 95" fill="none" stroke="white" strokeWidth="2" strokeDasharray="6,6" opacity="0.5"/>
                      
                      {/* Waypoint markers */}
                      <circle cx="65" cy="62" r="3" fill="white" opacity="0.6"/>
                      <circle cx="75" cy="70" r="3" fill="white" opacity="0.6"/>
                      <circle cx="85" cy="80" r="3" fill="white" opacity="0.6"/>
                      
                      {/* Direction arrow */}
                      <path d="M 95 92 L 98 95 L 95 98" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
                    </svg>
                  </div>

                  {/* Compass Rose - Bottom Center - Bold & Clear */}
                  <div className="absolute bottom-5 left-1/2 w-20 h-20 opacity-15 -translate-x-1/2 pointer-events-none">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                      {/* Outer circle */}
                      <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="2.5" opacity="0.6"/>
                      <circle cx="50" cy="50" r="24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                      {/* Main cross lines */}
                      <line x1="50" y1="22" x2="50" y2="78" stroke="white" strokeWidth="2" opacity="0.6"/>
                      <line x1="22" y1="50" x2="78" y2="50" stroke="white" strokeWidth="2" opacity="0.6"/>
                      {/* Diagonal lines */}
                      <line x1="33" y1="33" x2="67" y2="67" stroke="white" strokeWidth="1.3" opacity="0.5"/>
                      <line x1="67" y1="33" x2="33" y2="67" stroke="white" strokeWidth="1.3" opacity="0.5"/>
                      {/* North arrow - bold and prominent */}
                      <path d="M 50 22 L 46 36 L 50 34 L 54 36 Z" fill="white" opacity="0.8"/>
                      <path d="M 50 22 L 46 36 L 50 34 L 54 36 Z" fill="none" stroke="white" strokeWidth="1.5" opacity="0.7"/>
                      {/* Direction markers */}
                      <path d="M 78 50 L 68 46 L 70 50 L 68 54 Z" fill="white" opacity="0.6"/>
                      <path d="M 50 78 L 46 68 L 50 70 L 54 68 Z" fill="white" opacity="0.6"/>
                      <path d="M 22 50 L 32 46 L 30 50 L 32 54 Z" fill="white" opacity="0.6"/>
                      {/* Center point */}
                      <circle cx="50" cy="50" r="6" fill="white" opacity="0.7"/>
                      <circle cx="50" cy="50" r="3" fill="white" opacity="0.9"/>
                      {/* Cardinal directions text */}
                      <text x="50" y="17" fontSize="10" fontWeight="bold" fill="white" opacity="0.8" textAnchor="middle" fontFamily="Arial">N</text>
                      <text x="84" y="53" fontSize="8" fontWeight="bold" fill="white" opacity="0.7" textAnchor="middle" fontFamily="Arial">E</text>
                      <text x="50" y="90" fontSize="8" fontWeight="bold" fill="white" opacity="0.7" textAnchor="middle" fontFamily="Arial">S</text>
                      <text x="15" y="53" fontSize="8" fontWeight="bold" fill="white" opacity="0.7" textAnchor="middle" fontFamily="Arial">W</text>
                    </svg>
                  </div>

                  {/* Detailed Road with Car - Bottom Right */}
                  <div className="absolute bottom-8 right-8 w-24 h-24 opacity-12 pointer-events-none">
                    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                      {/* Winding road - more prominent */}
                      <path d="M 20 100 Q 40 80 60 70 T 100 40" fill="none" stroke="white" strokeWidth="10" opacity="0.3"/>
                      <path d="M 20 100 Q 40 80 60 70 T 100 40" fill="none" stroke="white" strokeWidth="2" strokeDasharray="8,8" opacity="0.6"/>
                      
                      {/* Road edges */}
                      <path d="M 17 103 Q 37 83 57 73 T 97 43" fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
                      <path d="M 23 97 Q 43 77 63 67 T 103 37" fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
                      
                      
                    </svg>
                  </div>

                  {/* Modern Skyscrapers - Top Center Right */}
                  <div className="absolute top-8 right-20 w-24 h-24 opacity-12 pointer-events-none">
                    <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                      {/* Tallest building - center */}
                      <rect x="50" y="20" width="20" height="80" fill="none" stroke="white" strokeWidth="2" opacity="0.6"/>
                      {/* Antenna */}
                      <line x1="60" y1="20" x2="60" y2="10" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                      <circle cx="60" cy="10" r="2" fill="white" opacity="0.7"/>
                      {/* Building 2 - left */}
                      <rect x="25" y="45" width="18" height="55" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
                      {/* Building 3 - right */}
                      <rect x="75" y="55" width="16" height="45" fill="none" stroke="white" strokeWidth="1.8" opacity="0.6"/>
                      {/* Building 4 - far left */}
                      <rect x="10" y="65" width="12" height="35" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                      {/* Building 5 - far right */}
                      <rect x="95" y="70" width="13" height="30" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"/>
                      
                      {/* Windows - Building 1 (center tall) - 3 columns */}
                      <rect x="53" y="28" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="28" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="28" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="38" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="38" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="38" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="48" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="48" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="48" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="58" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="58" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="58" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="68" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="68" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="68" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="78" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="78" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="78" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="53" y="88" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="58" y="88" width="3" height="4" fill="white" opacity="0.5"/>
                      <rect x="63" y="88" width="3" height="4" fill="white" opacity="0.5"/>
                      
                      {/* Windows - Building 2 (left) - 2 columns */}
                      <rect x="28" y="52" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="35" y="52" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="28" y="60" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="35" y="60" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="28" y="68" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="35" y="68" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="28" y="76" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="35" y="76" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="28" y="84" width="3" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="35" y="84" width="3" height="3.5" fill="white" opacity="0.5"/>
                      
                      {/* Windows - Building 3 (right) - 2 columns */}
                      <rect x="78" y="62" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="84" y="62" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="78" y="70" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="84" y="70" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="78" y="78" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="84" y="78" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="78" y="86" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      <rect x="84" y="86" width="2.5" height="3.5" fill="white" opacity="0.5"/>
                      
                      {/* Windows - Building 4 (far left) - 1 column */}
                      <rect x="13" y="72" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="17" y="72" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="13" y="80" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="17" y="80" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="13" y="88" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="17" y="88" width="2" height="3" fill="white" opacity="0.4"/>
                      
                      {/* Windows - Building 5 (far right) - 1 column */}
                      <rect x="97" y="77" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="102" y="77" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="97" y="85" width="2" height="3" fill="white" opacity="0.4"/>
                      <rect x="102" y="85" width="2" height="3" fill="white" opacity="0.4"/>
                    </svg>
                  </div>

                  {/* Small Decorative Lotus - Top Center */}
                  <div className="absolute top-3 left-1/2 w-12 h-12 opacity-12 -translate-x-1/2 pointer-events-none">
                    <svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
                      {/* Center */}
                      <circle cx="35" cy="35" r="4" fill="white" opacity="0.7"/>
                      {/* Inner petals - 4 main directions */}
                      <ellipse cx="35" cy="24" rx="4" ry="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                      <ellipse cx="35" cy="46" rx="4" ry="10" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                      <ellipse cx="24" cy="35" rx="10" ry="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                      <ellipse cx="46" cy="35" rx="10" ry="4" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6"/>
                      {/* Diagonal petals */}
                      <ellipse cx="28" cy="28" rx="7" ry="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" transform="rotate(-45 28 28)"/>
                      <ellipse cx="42" cy="28" rx="7" ry="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" transform="rotate(45 42 28)"/>
                      <ellipse cx="28" cy="42" rx="7" ry="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" transform="rotate(45 28 42)"/>
                      <ellipse cx="42" cy="42" rx="7" ry="7" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" transform="rotate(-45 42 42)"/>
                    </svg>
                  </div>
                  
                  {/* Offer Banner - Top (Like MakeMyTrip) */}
                  {ride.description && (
                    <div className="px-4 py-2 bg-orange-100/10 border-b border-orange-200/20 relative z-10">
                      <p className="text-xs text-orange-300 font-medium flex items-center gap-2">
                        <span className="text-orange-400">●</span>
                        {ride.description}
                      </p>
                    </div>
                  )}

                  {/* Main Card Content */}
                  <div className="p-4 relative z-10">
                    {/* Top Section - Driver Info & Badge */}
                    <div className={`flex items-center justify-between mb-4 pb-3 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-md">
                          <Car className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ride.driver}</h3>
                          <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{ride.vehicle}</p>
                        </div>
                      </div>
                      
                      {hasPreviousRequest && (
                        <div className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: requestStatus.status === 'cancelled' ? 'rgba(156, 163, 175, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: requestStatus.status === 'cancelled' ? '#9CA3AF' : '#EF4444',
                            border: `1px solid ${requestStatus.status === 'cancelled' ? 'rgba(156, 163, 175, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                          }}
                        >
                          {requestStatus.status === 'cancelled' ? 'Reapply' : 'Try Again'}
                        </div>
                      )}
                    </div>

                    {/* Journey Section - MakeMyTrip Perfect Layout */}
                    <div className="mb-4">
                      {/* Top Row - Times, Route, and Price */}
                      <div className="flex items-center justify-between mb-2">
                        {/* Departure Time */}
                        <div className="w-20">
                          <div className={`text-2xl font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ride.time}</div>
                        </div>

                        {/* Center - Date & Journey Line */}
                        <div className="flex-1 px-6">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`text-[11px] font-medium ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                              {new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="w-full relative flex items-center">
                              <div className={`flex-1 h-px ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                            </div>
                            <div className="px-2.5 py-0.5 bg-orange-500/20 border border-orange-500/30 rounded text-[11px] font-semibold text-orange-400 flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{ride.seats}</span>
                            </div>
                          </div>
                        </div>

                        {/* Arrival Time Placeholder */}
                        <div className="w-20 text-center">
                          <div className={`text-[11px] font-medium leading-none ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>~varies</div>
                        </div>

                        {/* Price */}
                        <div className="ml-6 text-right min-w-[100px]">
                          <div className="flex items-center justify-end gap-0.5">
                            <IndianRupee className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
                            <span className={`text-2xl font-bold leading-none ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ride.price.toLocaleString()}</span>
                          </div>
                          <div className={`text-xs leading-tight mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>per adult</div>
                        </div>
                      </div>

                      {/* Bottom Row - Location Names */}
                      <div className="flex items-center mt-3">
                        {/* Departure Location */}
                        <div className="flex-shrink-0">
                          <div className="text-base font-bold leading-tight" style={{ color: '#67E8F9' }}>
                            {ride.from}
                          </div>
                        </div>

                        {/* Arrow - extends dynamically */}
                        <div className="flex-1 mx-4 flex items-center justify-center">
                          <div className="w-full flex items-center">
                            <div className="flex-1 h-0.5" style={{ backgroundColor: '#9CA3AF' }}></div>
                            <span className="mx-2 text-xl font-bold" style={{ color: '#9CA3AF' }}>→</span>
                            <div className="flex-1 h-0.5" style={{ backgroundColor: '#9CA3AF' }}></div>
                          </div>
                        </div>

                        {/* Arrival Location */}
                        <div className="flex-shrink-0">
                          <div className="text-base font-bold leading-tight" style={{ color: '#BEF264' }}>
                            {ride.to}
                          </div>
                        </div>

                        {/* Empty space to maintain alignment with price */}
                        <div className="ml-6 w-[100px] flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </section>

        {/* Modern Quick Actions */}
        <section className="mt-16">
          <div className="text-center mb-8">
            <h3 className={`text-2xl font-bold ${titleClr} mb-2`}>
              Can't find what you're looking for?
            </h3>
            <p className={`text-lg ${labelClr}`}>
              Don't worry! We have other options to help you get around.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {/* Post Ride Card */}
            <Link 
              href="/share-ride/postride"
              className="group relative p-4 sm:p-6 rounded-[24px] border backdrop-blur-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 overflow-hidden"
              style={{
                background: darkMode 
                  ? '#1D3557' 
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(148, 163, 184, 0.3)',
                boxShadow: darkMode
                  ? '0 15px 35px -10px rgba(29, 53, 87, 0.25), 0 6px 12px -3px rgba(0,0,0,0.2)'
                  : '0 15px 35px -10px rgba(100, 116, 139, 0.2), 0 6px 12px -3px rgba(71, 85, 105, 0.12)'
              }}
            >
              {/* Decorative Elements */}
              <div className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/25'} pointer-events-none`} />
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/25'} pointer-events-none`} />
              <div className={`absolute top-6 left-6 w-3 h-3 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'} pointer-events-none`} />
              <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-1.5 pointer-events-none">
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-blue-400/15'}`} />
              </div>

              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-60 rounded-[24px]"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
                }}
              />

              <div className="relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-sm border rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  darkMode ? 'bg-white/10 border-white/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <Car className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                  }}>
                  <span style={{ color: darkMode ? '#facc15' : '#d97706' }}>Post Your</span> <span style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>Own Ride</span>
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                  Offer a ride to fellow students and earn some money while helping the community.
                </p>
                <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span>Get Started</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* My Requests Card */}
            <Link
              href="/my-activity/requests/sharerideREQ"
              className="group relative p-4 sm:p-6 rounded-[24px] border backdrop-blur-lg hover:-translate-y-1 hover:scale-[1.01] transition-all duration-500 overflow-hidden"
              style={{
                background: darkMode 
                  ? '#1D3557' 
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
                borderColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(148, 163, 184, 0.3)',
                boxShadow: darkMode
                  ? '0 15px 35px -10px rgba(29, 53, 87, 0.25), 0 6px 12px -3px rgba(0,0,0,0.2)'
                  : '0 15px 35px -10px rgba(100, 116, 139, 0.2), 0 6px 12px -3px rgba(71, 85, 105, 0.12)'
              }}
            >
              {/* Decorative Elements */}
              <div className={`absolute -bottom-16 -left-16 w-40 h-40 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/25'} pointer-events-none`} />
              <div className={`absolute -top-8 -right-8 w-28 h-28 rounded-full border-2 ${darkMode ? 'border-white/10' : 'border-gray-300/25'} pointer-events-none`} />
              <div className={`absolute top-6 left-6 w-3 h-3 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'} pointer-events-none`} />
              <div className="absolute bottom-6 right-6 grid grid-cols-2 gap-1.5 pointer-events-none">
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/20' : 'bg-blue-400/25'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/10' : 'bg-blue-400/20'}`} />
                <div className={`w-1.5 h-1.5 rounded-full ${darkMode ? 'bg-white/5' : 'bg-blue-400/15'}`} />
              </div>

              {/* Gradient Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-60 rounded-[24px]"
                style={{
                  background: darkMode 
                    ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 100%)'
                    : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 100%)'
                }}
              />

              <div className="relative z-10">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-sm border rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 ${
                  darkMode ? 'bg-white/10 border-white/20' : 'bg-blue-50 border-blue-200'
                }`}>
                  <Users className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-white' : 'text-blue-600'}`} />
                </div>
                <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
                  style={{
                    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif'
                  }}>
                  <span style={{ color: darkMode ? '#facc15' : '#d97706' }}>View My</span> <span style={{ color: darkMode ? '#38bdf8' : '#0284c7' }}>Requests</span>
                </h4>
                <p className={`text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 font-medium ${darkMode ? 'text-blue-300' : 'text-gray-700'}`}>
                  Check the status of your ride requests and manage your bookings.
                </p>
                <div className={`flex items-center gap-2 text-xs sm:text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span>View Requests</span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      
      <SmallFooter />
    </div>
  );
}
