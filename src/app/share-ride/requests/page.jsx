"use client";

import React, { useState, useEffect, useCallback } from "react";
import Footer from "../../_components/Footer";
import {
  User,
  MapPin,
  Calendar,
  Clock,
  Users,
  Phone,
  Instagram,
  Mail,
  Link2,
  Check,
  X,
  MessageSquare,
  IndianRupee,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { useUI, useAuth, useMessages } from "../../lib/contexts/UniShareContext";
import Link from "next/link";

// Loading Component
function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300 text-lg">Loading requests...</p>
      </div>
    </div>
  );
}

// Request Status Badge Component
function StatusBadge({ status }) {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
          icon: <Clock className="w-3 h-3" />,
          label: 'Pending'
        };
      case 'confirmed':
      case 'accepted':
        return {
          bg: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
          icon: <CheckCircle className="w-3 h-3" />,
          label: 'Confirmed'
        };
      case 'declined':
      case 'rejected':
        return {
          bg: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
          icon: <XCircle className="w-3 h-3" />,
          label: 'Declined'
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800',
          icon: <AlertCircle className="w-3 h-3" />,
          label: status
        };
    }
  };

  const config = getStatusConfig(status);
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

// Contact Icon Component
function ContactIcon({ type }) {
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
}

// Request Card Component for Received Requests
function ReceivedRequestCard({ request, onApprove, onDecline, darkMode, responding, currentUser }) {
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const requester = request.requester || {};
  const requesterProfile = request.requester_profile || null;
  const ride = request.ride || {};
  
  // Determine the profile image to use
  const getProfileImage = () => {
    // Always start with owner/requester data (reliable), then enhance with profile data if available
    if (requester?.picture) {
      return requester.picture;
    }
    if (requesterProfile?.profile_image_url) {
      return requesterProfile.profile_image_url;
    }
    return '/images/default-avatar.svg';
  };

  // Get display name with proper priority
  const getDisplayName = () => {
    // Use custom display name if available, otherwise use requester name
    return requesterProfile?.display_name || requester?.name || 'Anonymous User';
  };
  
  // Format date and time
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `₹${price}`;
  };

  const cardBg = darkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-gray-200";
  
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`${cardBg} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
      {/* Header with requester info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={getProfileImage()}
            alt={requester?.name || 'Requester'}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            onError={(e) => {
              // Simple fallback chain - if Google avatar fails, try custom or default
              if (e.target.src !== '/images/default-avatar.svg') {
                if (requester?.picture && e.target.src === requester.picture) {
                  // Try custom profile image
                  if (requesterProfile?.profile_image_url) {
                    e.target.src = requesterProfile.profile_image_url;
                  } else {
                    e.target.src = '/images/default-avatar.svg';
                  }
                } else {
                  // Fallback to default
                  e.target.src = '/images/default-avatar.svg';
                }
              }
            }}
          />
          <div>
            <h3 className={`font-semibold ${textPrimary}`}>
              {requesterProfile?.display_name || requester?.name || 'Anonymous User'}
            </h3>
            {requesterProfile?.custom_user_id && (
              <p className={`text-sm ${textMuted}`}>{requesterProfile?.custom_user_id}</p>
            )}
            <p className={`text-xs ${textMuted}`}>
              Requested {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Ride Details */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className={`font-medium ${textPrimary} mb-3`}>Ride Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Route */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className={`text-sm ${textSecondary}`}>
              <span className="font-medium">{ride.from_location || 'Unknown'}</span>
              <span className="mx-1">→</span>
              <span className="font-medium">{ride.to_location || 'Unknown'}</span>
            </div>
          </div>
          
          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatDate(ride.date)} at {formatTime(ride.time)}
            </span>
          </div>
          
          {/* Seats & Price */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {request.seats_requested || 1} seat(s) requested
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatPrice(ride.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${textPrimary}`}>Message from requester:</span>
          </div>
          <div className={`text-sm ${textSecondary} p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500`}>
            {showFullMessage || request.message.length <= 150 ? (
              request.message
            ) : (
              <>
                {request.message.slice(0, 150)}...
                <button
                  onClick={() => setShowFullMessage(true)}
                  className="text-blue-500 hover:text-blue-600 ml-1 font-medium"
                >
                  Show more
                </button>
              </>
            )}
            {showFullMessage && request.message.length > 150 && (
              <button
                onClick={() => setShowFullMessage(false)}
                className="text-blue-500 hover:text-blue-600 ml-1 font-medium"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Method */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <ContactIcon type={request.contact_method} />
          <span className={`text-sm ${textSecondary}`}>
            Prefers contact via {request.contact_method}
          </span>
        </div>
      </div>

      {/* Bio if available */}
      {requesterProfile?.bio && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>About {requester?.name}:</h5>
          <p className={`text-sm ${textSecondary}`}>{requesterProfile?.bio}</p>
        </div>
      )}

      {/* Action Buttons */}
      {request.status === 'pending' && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(request.id)}
            disabled={responding === request.id}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {responding === request.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Approve
          </button>
          <button
            onClick={() => onDecline(request.id)}
            disabled={responding === request.id}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {responding === request.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            Decline
          </button>
        </div>
      )}

      {/* Response Message */}
      {request.response_message && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>Your response:</h5>
          <p className={`text-sm ${textSecondary}`}>{request.response_message}</p>
        </div>
      )}
    </div>
  );
}

// Request Card Component for Sent Requests
function SentRequestCard({ request, darkMode }) {
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const ride = request.ride || {};
  const rideOwner = ride.owner || {};
  const rideOwnerProfile = request.ride_owner_profile || null;
  
  // Determine the profile image to use
  const getProfileImage = () => {
    // Always start with owner data (reliable), then enhance with profile data if available
    if (rideOwner?.picture) {
      return rideOwner.picture;
    }
    if (rideOwnerProfile?.profile_image_url) {
      return rideOwnerProfile.profile_image_url;
    }
    return '/images/default-avatar.svg';
  };

  // Get display name with proper priority
  const getDisplayName = () => {
    // Use custom display name if available, otherwise use owner name
    return rideOwnerProfile?.display_name || rideOwner?.name || 'Anonymous User';
  };
  
  // Format date and time
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `₹${price}`;
  };

  const cardBg = darkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-gray-200";
  
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`${cardBg} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
      {/* Header with ride owner info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={getProfileImage()}
            alt={rideOwner?.name || 'Ride Owner'}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            onError={(e) => {
              // Simple fallback chain - if Google avatar fails, try custom or default
              if (e.target.src !== '/images/default-avatar.svg') {
                if (rideOwner?.picture && e.target.src === rideOwner.picture) {
                  // Try custom profile image
                  if (rideOwnerProfile?.profile_image_url) {
                    e.target.src = rideOwnerProfile.profile_image_url;
                  } else {
                    e.target.src = '/images/default-avatar.svg';
                  }
                } else {
                  // Fallback to default
                  e.target.src = '/images/default-avatar.svg';
                }
              }
            }}
          />
          <div>
            <h3 className={`font-semibold ${textPrimary}`}>
              {getDisplayName()}
            </h3>
            {rideOwnerProfile?.custom_user_id && (
              <p className={`text-sm ${textMuted}`}>{rideOwnerProfile?.custom_user_id}</p>
            )}
            <p className={`text-xs ${textMuted}`}>
              Your request sent {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Ride Details */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className={`font-medium ${textPrimary} mb-3`}>Ride Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Route */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className={`text-sm ${textSecondary}`}>
              <span className="font-medium">{ride.from_location || 'Unknown'}</span>
              <span className="mx-1">→</span>
              <span className="font-medium">{ride.to_location || 'Unknown'}</span>
            </div>
          </div>
          
          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatDate(ride.date)} at {formatTime(ride.time)}
            </span>
          </div>
          
          {/* Seats & Price */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {request.seats_requested || 1} seat(s) requested
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatPrice(ride.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Your Message */}
      {request.message && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${textPrimary}`}>Your message to the driver:</span>
          </div>
          <div className={`text-sm ${textSecondary} p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500`}>
            {showFullMessage || request.message.length <= 150 ? (
              request.message
            ) : (
              <>
                {request.message.slice(0, 150)}...
                <button
                  onClick={() => setShowFullMessage(true)}
                  className="text-green-500 hover:text-green-600 ml-1 font-medium"
                >
                  Show more
                </button>
              </>
            )}
            {showFullMessage && request.message.length > 150 && (
              <button
                onClick={() => setShowFullMessage(false)}
                className="text-green-500 hover:text-green-600 ml-1 font-medium"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bio if available */}
      {rideOwnerProfile?.bio && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>About {rideOwner?.name}:</h5>
          <p className={`text-sm ${textSecondary}`}>{rideOwnerProfile?.bio}</p>
        </div>
      )}

      {/* Status Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {request.status === 'pending' 
              ? 'Your request is pending. The ride owner will review and respond soon.'
              : request.status === 'confirmed' || request.status === 'accepted'
              ? 'Great! Your request has been accepted. You can join this ride.'
              : 'This request was declined by the ride owner.'
            }
          </p>
        </div>
      </div>

      {/* Response Message */}
      {request.response_message && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>Response from driver:</h5>
          <p className={`text-sm ${textSecondary}`}>{request.response_message}</p>
        </div>
      )}
    </div>
  );
}

// Original Request Card Component (keeping for compatibility)
function RequestCard({ request, onApprove, onDecline, darkMode, responding, currentUser }) {
  const [showFullMessage, setShowFullMessage] = useState(false);
  
  const requester = request.requester || {};
  const requesterProfile = request.requester_profile || {};
  const ride = request.ride || {};
  
  // Format date and time
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return timeStr;
    }
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return `₹${price}`;
  };

  const cardBg = darkMode 
    ? "bg-gray-900 border-gray-800" 
    : "bg-white border-gray-200";
  
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-700";
  const textMuted = darkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className={`${cardBg} border rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
      {/* Header with requester info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={requesterProfile.profile_image_url || requester.picture || '/images/default-avatar.png'}
            alt={requester?.name || 'Requester'}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
            onError={(e) => {
              e.target.src = '/images/default-avatar.png';
            }}
          />
          <div>
            <h3 className={`font-semibold ${textPrimary}`}>
              {requesterProfile?.display_name || requester?.name || 'Anonymous User'}
            </h3>
            {requesterProfile?.custom_user_id && (
              <p className={`text-sm ${textMuted}`}>{requesterProfile?.custom_user_id}</p>
            )}
            <p className={`text-xs ${textMuted}`}>
              Requested {new Date(request.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      {/* Ride Details */}
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 className={`font-medium ${textPrimary} mb-3`}>Ride Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Route */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <div className={`text-sm ${textSecondary}`}>
              <span className="font-medium">{ride.from_location || 'Unknown'}</span>
              <span className="mx-1">→</span>
              <span className="font-medium">{ride.to_location || 'Unknown'}</span>
            </div>
          </div>
          
          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatDate(ride.date)} at {formatTime(ride.time)}
            </span>
          </div>
          
          {/* Seats & Price */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {request.seats_requested || 1} seat(s) requested
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-purple-500 flex-shrink-0" />
            <span className={`text-sm ${textSecondary}`}>
              {formatPrice(ride.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Message */}
      {request.message && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${textPrimary}`}>Message from requester:</span>
          </div>
          <div className={`text-sm ${textSecondary} p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500`}>
            {showFullMessage || request.message.length <= 150 ? (
              request.message
            ) : (
              <>
                {request.message.slice(0, 150)}...
                <button
                  onClick={() => setShowFullMessage(true)}
                  className="text-blue-500 hover:text-blue-600 ml-1 font-medium"
                >
                  Show more
                </button>
              </>
            )}
            {showFullMessage && request.message.length > 150 && (
              <button
                onClick={() => setShowFullMessage(false)}
                className="text-blue-500 hover:text-blue-600 ml-1 font-medium"
              >
                Show less
              </button>
            )}
          </div>
        </div>
      )}

      {/* Contact Method */}
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <ContactIcon type={request.contact_method} />
          <span className={`text-sm ${textSecondary}`}>
            Prefers contact via {request.contact_method}
          </span>
        </div>
      </div>

      {/* Bio if available */}
      {requesterProfile?.bio && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>About {requester?.name}:</h5>
          <p className={`text-sm ${textSecondary}`}>{requesterProfile?.bio}</p>
        </div>
      )}

      {/* Action Buttons */}
      {request.status === 'pending' && request.driver_id === currentUser?.id && (
        <div className="flex gap-3">
          <button
            onClick={() => onApprove(request.id)}
            disabled={responding === request.id}
            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {responding === request.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Approve
          </button>
          <button
            onClick={() => onDecline(request.id)}
            disabled={responding === request.id}
            className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {responding === request.id ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
            Decline
          </button>
        </div>
      )}

      {/* Info message for requests where user is not the driver */}
      {request.status === 'pending' && request.driver_id !== currentUser?.id && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              This is a request you made to join someone else's ride. Only the ride owner can approve or decline it.
            </p>
          </div>
        </div>
      )}

      {/* Response Message */}
      {request.response_message && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 className={`text-sm font-medium ${textPrimary} mb-1`}>Your response:</h5>
          <p className={`text-sm ${textSecondary}`}>{request.response_message}</p>
        </div>
      )}
    </div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange, darkMode }) {
  if (totalPages <= 1) return null;

  const textColor = darkMode ? "text-gray-300" : "text-gray-700";
  const buttonBg = darkMode 
    ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700" 
    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50";
  const activeButton = darkMode
    ? "bg-blue-600 border-blue-600 text-white"
    : "bg-blue-500 border-blue-500 text-white";

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonBg}`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <span className={`px-4 py-2 ${textColor}`}>
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonBg}`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// Main Component
export default function RideRequestsPage() {
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const { showTemporaryMessage } = useMessages();
  
  // State management
  const [activeSection, setActiveSection] = useState('sent'); // 'sent' or 'received' - 'sent' (My Requests) is default
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responding, setResponding] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNotification, setHasNotification] = useState(false); // Red dot for Requests Received
  
  const requestsPerPage = 10;

  // Monitor receivedRequests for pending requests to show notification dot
  useEffect(() => {
    const hasPendingReceived = receivedRequests.some(req => req.status === 'pending');
    if (hasPendingReceived && activeSection !== 'received') {
      setHasNotification(true);
    } else if (activeSection === 'received') {
      setHasNotification(false);
    }
  }, [receivedRequests, activeSection]);

  // Fetch requests from API
  const fetchRequests = useCallback(async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setSectionLoading(true);
      }
      setError(null);
      
      // Import both API functions
      const { getRideRequests, getUserSentRequests } = await import('../../lib/api');
      
      // Fetch both types of requests in parallel
      const [receivedResult, sentResult] = await Promise.all([
        getRideRequests(), // Requests TO user's rides
        getUserSentRequests() // Requests FROM user to other rides
      ]);
      
      if (receivedResult.success && sentResult.success) {
        const receivedRequests = receivedResult.data || [];
        const sentRequests = sentResult.data || [];
        
        setReceivedRequests(receivedRequests);
        setSentRequests(sentRequests);
        
        // Set pagination based on current section
        const currentRequests = activeSection === 'received' ? receivedRequests : sentRequests;
        setTotalPages(Math.ceil(currentRequests.length / requestsPerPage));
        setCurrentPage(1); // Reset to first page when fetching
      } else {
        throw new Error(
          receivedResult.error || sentResult.error || 'Failed to fetch requests'
        );
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.message);
      setReceivedRequests([]);
      setSentRequests([]);
    } finally {
      setLoading(false);
      setSectionLoading(false);
      setRefreshing(false);
    }
  }, [activeSection]);

  // Handle section switch
  const handleSectionSwitch = async (newSection) => {
    if (newSection === activeSection) return;
    
    setActiveSection(newSection);
    setCurrentPage(1);
    setSectionLoading(true);
    
    // Clear notification dot when switching to received requests
    if (newSection === 'received') {
      setHasNotification(false);
    }
    
    // Update pagination based on new section
    const currentRequests = newSection === 'received' ? receivedRequests : sentRequests;
    setTotalPages(Math.ceil(currentRequests.length / requestsPerPage));
    setSectionLoading(false);
  };

  // Get current section's requests with pagination
  const getCurrentSectionRequests = () => {
    const allRequests = activeSection === 'received' ? receivedRequests : sentRequests;
    const startIndex = (currentPage - 1) * requestsPerPage;
    const endIndex = startIndex + requestsPerPage;
    return allRequests.slice(startIndex, endIndex);
  };

  // Handle approve request
  const handleApprove = async (requestId) => {
    try {
      setResponding(requestId);
      
      // Optimistic update - immediately update UI
      setReceivedRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'confirmed', responded_at: new Date().toISOString() }
          : req
      ));
      
      const { respondToRideRequest } = await import('../../lib/api');
      const result = await respondToRideRequest(requestId, 'confirm');
      
      if (result.success) {
        showTemporaryMessage('Request approved successfully! The requester will be notified.', 'success');
        
        // Clear specific API cache entries for ride requests
        const { clearAPICache } = await import('../../lib/api/base');
        clearAPICache('/api/shareride/my/requests');
        clearAPICache('/api/shareride/my/requested');
        
        // Force a complete data refresh to get updated data from backend
        await fetchRequests(false);
      } else {
        // Revert optimistic update on failure
        setReceivedRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'pending', responded_at: null }
            : req
        ));
        throw new Error(result.error || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      showTemporaryMessage(error.message || 'Failed to approve request', 'error');
      
      // Revert optimistic update on error
      setReceivedRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'pending', responded_at: null }
          : req
      ));
    } finally {
      setResponding(null);
    }
  };

  // Handle decline request
  const handleDecline = async (requestId) => {
    try {
      setResponding(requestId);
      
      // Optimistic update - immediately update UI
      setReceivedRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'declined', responded_at: new Date().toISOString() }
          : req
      ));
      
      const { respondToRideRequest } = await import('../../lib/api');
      const result = await respondToRideRequest(requestId, 'decline');
      
      if (result.success) {
        showTemporaryMessage('Request declined. The requester will be notified.', 'info');
        
        // Clear specific API cache entries for ride requests
        const { clearAPICache } = await import('../../lib/api/base');
        clearAPICache('/api/shareride/my/requests');
        clearAPICache('/api/shareride/my/requested');
        
        // Force a complete data refresh to get updated data from backend
        await fetchRequests(false);
      } else {
        // Revert optimistic update on failure
        setReceivedRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, status: 'pending', responded_at: null }
            : req
        ));
        throw new Error(result.error || 'Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
      showTemporaryMessage(error.message || 'Failed to decline request', 'error');
      
      // Revert optimistic update on error
      setReceivedRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'pending', responded_at: null }
          : req
      ));
    } finally {
      setResponding(null);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests(currentPage);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchRequests(newPage);
    }
  };

  // Fetch requests on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated, fetchRequests]);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Login Required
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please log in to view your ride requests.
          </p>
          <Link
            href="/login"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingScreen />;
  }

  // Common styles
  const bgColor = darkMode 
    ? "bg-gray-900 text-white" 
    : "bg-gray-50 text-gray-900";
  const textPrimary = darkMode ? "text-white" : "text-gray-900";
  const textSecondary = darkMode ? "text-gray-300" : "text-gray-600";

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold ${textPrimary} mb-2`}>
              Ride Requests
            </h1>
            <p className={textSecondary}>
              Manage your ride sharing requests - both received and sent
            </p>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {/* My Requests - First Tab */}
              <button
                onClick={() => handleSectionSwitch('sent')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeSection === 'sent'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  My Requests ({sentRequests.length})
                </div>
              </button>
              
              {/* Requests Received - Second Tab with notification dot */}
              <button
                onClick={() => handleSectionSwitch('received')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeSection === 'received'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2 relative">
                  <Users className="w-4 h-4" />
                  Requests Received ({receivedRequests.length})
                  {/* Red notification dot */}
                  {hasNotification && activeSection !== 'received' && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">
                Error loading requests: {error}
              </p>
            </div>
          </div>
        )}

        {/* Section Loading State */}
        {sectionLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading {activeSection === 'received' ? 'received' : 'sent'} requests...
            </p>
          </div>
        )}

        {/* Section Content */}
        {!sectionLoading && (
          <>
            {/* Empty State for Current Section */}
            {getCurrentSectionRequests().length === 0 && (
              <div className="text-center py-16">
                {activeSection === 'received' ? (
                  <>
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                      No requests received yet
                    </h3>
                    <p className={textSecondary}>
                      When people request to join your rides, they'll appear here.
                    </p>
                    <Link
                      href="/share-ride"
                      className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Post a Ride
                    </Link>
                  </>
                ) : (
                  <>
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className={`text-xl font-semibold ${textPrimary} mb-2`}>
                      No requests sent yet
                    </h3>
                    <p className={textSecondary}>
                      When you request to join other rides, they'll appear here.
                    </p>
                    <Link
                      href="/share-ride/findride"
                      className="inline-block mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Find a Ride
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Requests List for Current Section */}
            {getCurrentSectionRequests().length > 0 && (
              <>
                <div className="space-y-6 mb-8">
                  {getCurrentSectionRequests().map((request) => (
                    activeSection === 'received' ? (
                      <ReceivedRequestCard
                        key={request.id}
                        request={request}
                        onApprove={handleApprove}
                        onDecline={handleDecline}
                        isResponding={responding === request.id}
                        currentUser={user}
                        darkMode={darkMode}
                      />
                    ) : (
                      <SentRequestCard
                        key={request.id}
                        request={request}
                        darkMode={darkMode}
                      />
                    )
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(pageNum => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border border-blue-600'
                            : 'text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
