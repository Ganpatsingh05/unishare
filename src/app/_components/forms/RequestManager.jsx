"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  Package, 
  Calendar,
  ExternalLink,
  Trash2,
  ArrowLeft,
  RefreshCw,
  Mail,
  Phone,
  Instagram,
  Shield,
  Star,
  MapPin,
  Home,
  Bed
} from "lucide-react";
import { useUI } from "./../../lib/contexts/UniShareContext";
import { SystemNotifications } from "./../../lib/utils/actionNotifications";

const RequestManager = ({ 
  module, 
  title = 'Requests',
  showBackButton = false,
  onBack,
  className = ''
}) => {
  const { darkMode } = useUI();
  const [activeTab, setActiveTab] = useState('received');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800/80' : 'bg-white/90',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-gray-100' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSuccess: 'bg-green-600 hover:bg-green-700 text-white',
    buttonDanger: 'bg-red-600 hover:bg-red-700 text-white',
    buttonSecondary: darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    tab: darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-100',
    tabActive: 'bg-blue-600 text-white'
  };

  const fetchRequests = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Dynamic import based on module
      const { roomsAPI, marketplaceAPI, lostFoundAPI, ticketsAPI, ridesAPI } = await import("../../lib/api/requests");
      
      let api;
      switch (module) {
        case 'rooms':
          api = roomsAPI;
          break;
        case 'itemsell':
          api = marketplaceAPI;
          break;
        case 'lostfound':
          api = lostFoundAPI;
          break;
        case 'ticketsell':
          api = ticketsAPI;
          break;
        case 'shareride':
          api = ridesAPI;
          break;
        default:
          throw new Error('Invalid module');
      }

      const response = activeTab === 'received' 
        ? await api.getReceivedRequests()
        : await api.getSentRequests();
        
      setRequests(response.data || []);
    } catch (error) {
      // Silently handle authentication errors (user not logged in)
      if (error?.message?.includes('Authentication required')) {
        setRequests([]);
        return;
      }
      
      const event = new CustomEvent('showMessage', {
        detail: { message: error.message || 'Failed to load requests', type: 'error' }
      });
      window.dispatchEvent(event);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeTab, module]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const respondToRequest = async (requestId, action) => {
    try {
      const { roomsAPI, marketplaceAPI, lostFoundAPI, ticketsAPI, ridesAPI } = await import("../../lib/api/requests");
      
      let api;
      switch (module) {
        case 'rooms':
          api = roomsAPI;
          break;
        case 'itemsell':
          api = marketplaceAPI;
          break;
        case 'lostfound':
          api = lostFoundAPI;
          break;
        case 'ticketsell':
          api = ticketsAPI;
          break;
        case 'shareride':
          api = ridesAPI;
          break;
        default:
          throw new Error('Invalid module');
      }

      await api.respondToRequest(requestId, action);
      
      // Show Dynamic Island notification
      if (action === 'confirm') {
        SystemNotifications.success('Request accepted successfully!');
      } else if (action === 'decline') {
        SystemNotifications.success('Request declined');
      }
      
      const event = new CustomEvent('showMessage', {
        detail: { 
          message: `Request ${action === 'confirm' ? 'accepted' : 'declined'} successfully!`, 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
      
      fetchRequests(); // Refresh the list
    } catch (error) {
      let errorMessage = error.message || `Failed to ${action} request`;
      
      // Provide more user-friendly error messages
      if (errorMessage.includes('already passed')) {
        errorMessage = 'Cannot respond to requests for rides that have already passed';
      } else if (errorMessage.includes('Invalid action')) {
        errorMessage = 'Invalid action. Please try again.';
      } else if (errorMessage.includes('unauthorized') || errorMessage.includes('Unauthorized')) {
        errorMessage = 'You are not authorized to perform this action';
      }
      
      const event = new CustomEvent('showMessage', {
        detail: { 
          message: errorMessage, 
          type: 'error' 
        }
      });
      window.dispatchEvent(event);
    }
  };

  const cancelRequest = async (requestId) => {
    try {
      const { roomsAPI, marketplaceAPI, lostFoundAPI, ticketsAPI, ridesAPI } = await import("../../lib/api/requests");
      
      let api;
      switch (module) {
        case 'rooms':
          api = roomsAPI;
          break;
        case 'itemsell':
          api = marketplaceAPI;
          break;
        case 'lostfound':
          api = lostFoundAPI;
          break;
        case 'ticketsell':
          api = ticketsAPI;
          break;
        case 'shareride':
          api = ridesAPI;
          break;
        default:
          throw new Error('Invalid module');
      }

      await api.cancelRequest(requestId);
      
      // Show Dynamic Island notification
      SystemNotifications.success('Request cancelled');
      
      const event = new CustomEvent('showMessage', {
        detail: { 
          message: 'Request cancelled successfully!', 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
      
      fetchRequests(); // Refresh the list
    } catch (error) {
      const event = new CustomEvent('showMessage', {
        detail: { 
          message: error.message || 'Failed to cancel request', 
          type: 'error' 
        }
      });
      window.dispatchEvent(event);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 border border-yellow-200`;
      case 'accepted':
        return `${baseClasses} bg-green-100 text-green-800 border border-green-200`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 border border-red-200`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800 border border-gray-200`;
      default:
        return `${baseClasses} bg-blue-100 text-blue-800 border border-blue-200`;
    }
  };

  const getItemTitle = (request) => {
    return request.item?.title || 
           request.room?.title || 
           request.ticket?.title || 
           request.ride?.title || 
           'Item';
  };

  const getItemPrice = (request) => {
    return request.item?.price || 
           request.room?.rent || 
           request.ticket?.price || 
           request.ride?.price || 
           null;
  };

  // Check if a ride has already passed
  const isRidePassed = (request) => {
    if (module !== 'shareride' || !request.ride) return false;
    
    const ride = request.ride;
    if (!ride.date || !ride.time) return false;
    
    try {
      // Combine date and time to create a proper datetime
      const rideDateTime = new Date(`${ride.date}T${ride.time}`);
      const now = new Date();
      return rideDateTime < now;
    } catch (error) {
      console.warn('Error parsing ride date/time:', error);
      return false;
    }
  };

  // Check if a room move-in date has passed
  const isRoomMoveInPassed = (request) => {
    if (module !== 'rooms') return false;
    
    // Check user's preferred move-in date from the request
    const moveInDate = request.move_in_date || request.room?.move_in_date;
    if (!moveInDate) return false;
    
    try {
      const requestedDate = new Date(moveInDate);
      const now = new Date();
      // Set time to start of day for accurate comparison
      requestedDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      console.log('Move-in date check:', {
        moveInDate,
        requestedDate: requestedDate.toDateString(),
        now: now.toDateString(),
        isPassed: requestedDate < now
      });
      
      return requestedDate < now;
    } catch (error) {
      console.warn('Error parsing room move-in date:', error);
      return false;
    }
  };

  // Parse contact information from message
  const parseContactInfo = (message) => {
    if (!message) return null;
    
    const contactSection = message.split('📞 Contact me via:')[1];
    if (!contactSection) return null;
    
    const contacts = {};
    const lines = contactSection.trim().split('\n');
    
    lines.forEach(line => {
      if (line.includes('📱 Phone:')) {
        contacts.phone = line.replace('📱 Phone:', '').trim();
      } else if (line.includes('📧 Email:')) {
        contacts.email = line.replace('📧 Email:', '').trim();
      } else if (line.includes('📸 Instagram:')) {
        contacts.instagram = line.replace('📸 Instagram:', '').trim();
      }
    });
    
    return Object.keys(contacts).length > 0 ? contacts : null;
  };

  // Get clean message without contact info
  const getCleanMessage = (message) => {
    if (!message) return '';
    return message.split('📞 Contact me via:')[0].trim();
  };

  // Format contact method display
  const getContactMethodIcon = (method) => {
    switch (method) {
      case 'mobile': return Phone;
      case 'email': return Mail;
      case 'instagram': return Instagram;
      default: return Mail;
    }
  };

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button
              onClick={onBack}
              className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h1 className={`text-2xl font-bold ${theme.text}`}>{title}</h1>
        </div>
        
        <button
          onClick={() => fetchRequests(true)}
          disabled={refreshing}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${theme.textMuted}`}
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button 
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'received' 
              ? theme.tabActive
              : theme.tab
          }`}
          onClick={() => setActiveTab('received')}
        >
          Received Requests
        </button>
        <button 
          className={`px-6 py-3 rounded-xl font-medium transition-colors ${
            activeTab === 'sent' 
              ? theme.tabActive
              : theme.tab
          }`}
          onClick={() => setActiveTab('sent')}
        >
          Sent Requests
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Request List */}
            {requests.length === 0 ? (
              <div className={`text-center py-16 ${theme.card} rounded-2xl border ${theme.border}`}>
                <Package className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
                <h3 className={`text-xl font-medium mb-2 ${theme.text}`}>No requests found</h3>
                <p className={`${theme.textMuted} mb-6`}>
                  {activeTab === 'received' 
                    ? "You haven't received any requests yet."
                    : "You haven't sent any requests yet."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request, index) => {
                  const contactInfo = parseContactInfo(request.message);
                  const cleanMessage = getCleanMessage(request.message);
                  const ContactIcon = getContactMethodIcon(request.contact_method);
                  
                  return (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`${theme.card} rounded-2xl border ${theme.border} shadow-lg overflow-hidden`}
                    >
                      {/* Request Header */}
                      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className={`text-xl font-bold ${theme.text}`}>
                                {getItemTitle(request)}
                              </h3>
                              <span className={getStatusBadge(request.status)}>
                                {request.status}
                              </span>
                            </div>
                            
                            {getItemPrice(request) && (
                              <div className="space-y-3">
                                {/* Original/Seller's Price */}
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm ${theme.textMuted} uppercase tracking-wide font-medium`}>
                                    {activeTab === 'received' ? 'Your Price:' : 'Original Price:'}
                                  </span>
                                  <div className="flex items-center gap-2 text-emerald-500 font-semibold text-lg">
                                    <span>₹{getItemPrice(request)}</span>
                                    {request.quantity && (
                                      <span className={`text-sm ${theme.textMuted}`}>
                                        × {request.quantity} items
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Offered Price - Show comparison if different */}
                                {request.offered_price && request.offered_price !== getItemPrice(request) && (
                                  <div className="p-3 rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <span className={`text-sm text-blue-600 dark:text-blue-400 uppercase tracking-wide font-medium block mb-1`}>
                                          {activeTab === 'received' ? "Buyer's Offer:" : "Your Offer:"}
                                        </span>
                                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xl">
                                          <span>₹{request.offered_price}</span>
                                          {request.quantity && (
                                            <span className="text-sm font-normal">
                                              × {request.quantity} items
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className={`text-sm font-medium ${
                                          request.offered_price > getItemPrice(request) 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {request.offered_price > getItemPrice(request) ? '+' : ''}
                                          ₹{request.offered_price - getItemPrice(request)}
                                        </div>
                                        <div className={`text-xs ${
                                          request.offered_price > getItemPrice(request) 
                                            ? 'text-green-600 dark:text-green-400' 
                                            : 'text-red-600 dark:text-red-400'
                                        }`}>
                                          {request.offered_price > getItemPrice(request) ? 'Higher' : 'Lower'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <div className={`flex items-center gap-2 text-sm ${theme.textMuted} mb-1`}>
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(request.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className={`flex items-center gap-2 text-sm ${theme.textMuted}`}>
                              <ContactIcon className="w-4 h-4" />
                              <span className="capitalize">{request.contact_method}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                        
                        {/* Requester Profile - Takes more space */}
                        {activeTab === 'received' && request.requester && (
                          <div className="lg:col-span-2">
                            <h4 className={`text-lg font-semibold mb-4 ${theme.text} flex items-center gap-2`}>
                              <User className="w-5 h-5" />
                              Requester Profile
                            </h4>
                            
                            <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                              <div className="flex items-start gap-4 mb-4">
                                {/* Profile Picture */}
                                <div className="relative">
                                  {request.requester.picture ? (
                                    <img
                                      src={request.requester.picture}
                                      alt={request.requester.name}
                                      className="w-16 h-16 rounded-full border-2 border-blue-500"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                      <span className="text-white font-bold text-xl">
                                        {request.requester.name?.charAt(0).toUpperCase() || 'U'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Shield className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                
                                {/* Profile Info */}
                                <div className="flex-1">
                                  <h5 className={`text-lg font-bold ${theme.text} mb-1`}>
                                    {request.requester.name}
                                  </h5>
                                  <div className={`flex items-center gap-2 text-sm ${theme.textMuted} mb-2`}>
                                    <Mail className="w-4 h-4" />
                                    <span>{request.requester.email}</span>
                                  </div>
                                  
                                </div>
                              </div>

                              {/* Contact Information */}
                              {contactInfo && (
                                <div className="space-y-3">
                                  <h6 className={`text-sm font-semibold ${theme.text} mb-2`}>Contact Information:</h6>
                                  {contactInfo.phone && (
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <Phone className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Phone</p>
                                        <p className={`font-semibold ${theme.text}`}>{contactInfo.phone}</p>
                                      </div>
                                    </div>
                                  )}
                                  {contactInfo.email && (
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">Email</p>
                                        <p className={`font-semibold ${theme.text}`}>{contactInfo.email}</p>
                                      </div>
                                    </div>
                                  )}
                                  {contactInfo.instagram && (
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                        <Instagram className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Instagram</p>
                                        <p className={`font-semibold ${theme.text}`}>{contactInfo.instagram}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Seller Profile for Sent Requests */}
                        {activeTab === 'sent' && request.seller && (
                          <div className="lg:col-span-2">
                            <h4 className={`text-lg font-semibold mb-4 ${theme.text} flex items-center gap-2`}>
                              <User className="w-5 h-5" />
                              {module === 'rooms' ? 'Landlord Profile' : 'Seller Profile'}
                            </h4>
                            
                            <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                              <div className="flex items-start gap-4 mb-4">
                                {/* Profile Picture */}
                                <div className="relative">
                                  {request.seller.picture ? (
                                    <img
                                      src={request.seller.picture}
                                      alt={request.seller.name}
                                      className="w-16 h-16 rounded-full border-2 border-green-500"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                      <span className="text-white font-bold text-xl">
                                        {request.seller.name?.charAt(0).toUpperCase() || 'S'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <Shield className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                                
                                {/* Profile Info */}
                                <div className="flex-1">
                                  <h5 className={`text-lg font-bold ${theme.text} mb-1`}>
                                    {request.seller.name}
                                  </h5>
                                  <div className={`flex items-center gap-2 text-sm ${theme.textMuted} mb-2`}>
                                    <Mail className="w-4 h-4" />
                                    <span>{request.seller.email}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Item/Room Information */}
                              {request.item && (
                                <div className="space-y-3">
                                  <h6 className={`text-sm font-semibold ${theme.text} mb-2`}>Item Details:</h6>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Package className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Item</p>
                                        <p className={`font-semibold ${theme.text}`}>{request.item.title}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Location</p>
                                        <p className={`font-semibold ${theme.text}`}>{request.item.location}</p>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Condition</p>
                                        <p className={`font-semibold ${theme.text} capitalize`}>{request.item.condition}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Room Information */}
                              {request.room && (
                                <div className="space-y-3">
                                  <h6 className={`text-sm font-semibold ${theme.text} mb-2`}>Room Details:</h6>
                                  <div className="grid grid-cols-1 gap-3">
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                        <Home className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Room</p>
                                        <p className={`font-semibold ${theme.text}`}>{request.room.title}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Location</p>
                                        <p className={`font-semibold ${theme.text}`}>{request.room.location}</p>
                                      </div>
                                    </div>

                                    {request.room.beds && (
                                      <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                        <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                                          <Bed className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Bedrooms</p>
                                          <p className={`font-semibold ${theme.text}`}>{request.room.beds} bed{request.room.beds > 1 ? 's' : ''}</p>
                                        </div>
                                      </div>
                                    )}

                                    {request.room.move_in_date && (
                                      <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                                          <Calendar className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Available From</p>
                                          <p className={`font-semibold ${theme.text}`}>
                                            {new Date(request.room.move_in_date).toLocaleDateString('en-IN', {
                                              day: 'numeric',
                                              month: 'short',
                                              year: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Message and Actions */}
                        <div className={`${(activeTab === 'received' && request.requester) || (activeTab === 'sent' && request.seller) ? 'lg:col-span-1' : 'lg:col-span-3'}`}>
                          {/* Message */}
                          {cleanMessage && (
                            <div className="mb-6">
                              <h4 className={`text-lg font-semibold mb-3 ${theme.text} flex items-center gap-2`}>
                                <MessageSquare className="w-5 h-5" />
                                Message
                              </h4>
                              <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                                <p className={`text-sm leading-relaxed ${theme.text}`}>{cleanMessage}</p>
                              </div>
                            </div>
                          )}

                          {/* Pickup Preference */}
                          {request.pickup_preference && (
                            <div className="mb-6">
                              <h4 className={`text-lg font-semibold mb-3 ${theme.text} flex items-center gap-2`}>
                                <MapPin className="w-5 h-5" />
                                Pickup Preference
                              </h4>
                              <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                                <p className={`text-sm leading-relaxed ${theme.text}`}>{request.pickup_preference}</p>
                              </div>
                            </div>
                          )}

                          {/* Move-in Date for Room Requests */}
                          {module === 'rooms' && request.move_in_date && (
                            <div className="mb-6">
                              <h4 className={`text-lg font-semibold mb-3 ${theme.text} flex items-center gap-2`}>
                                <Calendar className="w-5 h-5" />
                                Preferred Move-in Date
                              </h4>
                              <div className={`p-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                                <p className={`text-sm leading-relaxed ${theme.text}`}>
                                  {new Date(request.move_in_date).toLocaleDateString('en-IN', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </p>
                                {isRoomMoveInPassed(request) && (
                                  <p className={`text-xs mt-2 text-orange-600 dark:text-orange-400 italic`}>
                                    Note: This date has already passed
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="space-y-3">
                            {activeTab === 'received' && request.status === 'pending' && !isRidePassed(request) && !isRoomMoveInPassed(request) && (
                              <>
                                <button 
                                  onClick={() => respondToRequest(request.id, 'confirm')}
                                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${theme.buttonSuccess} hover:shadow-lg`}
                                >
                                  <CheckCircle className="w-5 h-5" />
                                  Accept Request
                                </button>
                                <button 
                                  onClick={() => respondToRequest(request.id, 'decline')}
                                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${theme.buttonDanger} hover:shadow-lg`}
                                >
                                  <XCircle className="w-5 h-5" />
                                  Decline Request
                                </button>
                              </>
                            )}
                            
                            {/* Show message for passed rides */}
                            {activeTab === 'received' && request.status === 'pending' && isRidePassed(request) && (
                              <div className={`text-center py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600`}>
                                <Clock className={`w-5 h-5 mx-auto mb-2 ${theme.textMuted}`} />
                                <span className={`text-sm ${theme.textMuted} italic`}>
                                  This ride has already passed
                                </span>
                              </div>
                            )}

                            {/* Show message for passed room move-in dates */}
                            {activeTab === 'received' && request.status === 'pending' && isRoomMoveInPassed(request) && (
                              <div className={`text-center py-3 px-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600`}>
                                <Clock className={`w-5 h-5 mx-auto mb-2 ${theme.textMuted}`} />
                                <span className={`text-sm ${theme.textMuted} italic`}>
                                  The preferred move-in date has already passed
                                </span>
                              </div>
                            )}
                            
                            {activeTab === 'sent' && request.status === 'pending' && (
                              <button 
                                onClick={() => cancelRequest(request.id)}
                                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${theme.buttonDanger} hover:shadow-lg`}
                              >
                                <Trash2 className="w-5 h-5" />
                                Cancel Request
                              </button>
                            )}

                            {request.status !== 'pending' && (
                              <div className={`text-center py-3 px-4 rounded-xl ${theme.bg} border ${theme.border}`}>
                                <span className={`text-sm ${theme.textMuted} capitalize`}>
                                  Request {request.status}
                                  {request.responded_at && (
                                    <span className="block text-xs mt-1">
                                      on {new Date(request.responded_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default RequestManager;
