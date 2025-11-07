"use client";

import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, Package, ChevronDown, Calendar, Phone, Mail, Instagram } from "lucide-react";
import { useUI } from "./../../lib/contexts/UniShareContext";
import { useDynamicIslandNotification } from "./../../lib/hooks/useDynamicIslandNotification";

const RequestButton = ({ module, itemId, onRequestSent, disabled = false, className = '', isOwnItem = false }) => {
  const { darkMode } = useUI();
  const { showRequestSuccess, showError, showLoginRequired } = useDynamicIslandNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1); // For tickets only
  const [preferredContactMethod, setPreferredContactMethod] = useState('mobile'); // Default to mobile
  
  // Contact information fields
  const [contactValue, setContactValue] = useState('');
  
  // Additional request fields
  const [offeredPrice, setOfferedPrice] = useState('');
  const [pickupPreference, setPickupPreference] = useState('');
  const [moveInDate, setMoveInDate] = useState(null);
  
  // Custom dropdown states
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  
  // Refs for dropdown management
  const contactDropdownRef = useRef(null);
  const dateDropdownRef = useRef(null);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Handle click outside for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setShowContactDropdown(false);
      }
      if (dateDropdownRef.current && !dateDropdownRef.current.contains(event.target)) {
        setShowDateDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    modal: darkMode ? 'bg-gray-800' : 'bg-white',
    card: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-600' : 'border-gray-300',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    dropdown: darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300',
    dropdownHover: darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'
  };

  // Contact method options
  const contactMethods = [
    { value: 'mobile', label: 'Mobile/Phone', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'instagram', label: 'Instagram', icon: Instagram }
  ];

  // Generate date options (next 60 days)
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const value = date.toISOString().split('T')[0];
      const label = i === 0 ? 'Today' : 
                   i === 1 ? 'Tomorrow' :
                   date.toLocaleDateString('en-US', { 
                     weekday: 'short', 
                     month: 'short', 
                     day: 'numeric' 
                   });
      
      options.push({ value, label, fullDate: date.toLocaleDateString('en-US') });
    }
    
    return options;
  };

  const dateOptions = generateDateOptions();

  const sendRequest = async () => {
    // Prevent users from requesting their own items
    if (isOwnItem) {
      const itemType = module === 'rooms' ? 'room' : 
                      module === 'itemsell' ? 'item' : 
                      module === 'ticketsell' ? 'ticket' : 
                      module === 'shareride' ? 'ride' : 'listing';
      
      const event = new CustomEvent('showMessage', {
        detail: { 
          message: `You cannot request your own ${itemType}. This is your listing!`, 
          type: 'error' 
        }
      });
      window.dispatchEvent(event);
      return;
    }

    setIsLoading(true);
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

      // Format contact information for the message
      let finalMessage = message.trim();
      if (contactValue.trim()) {
        let contactLabel = '';
        let formattedContact = contactValue.trim();
        
        switch (preferredContactMethod) {
          case 'mobile':
            contactLabel = '📱 Phone';
            break;
          case 'email':
            contactLabel = '📧 Email';
            break;
          case 'instagram':
            contactLabel = '📸 Instagram';
            formattedContact = formattedContact.startsWith('@') ? formattedContact : `@${formattedContact}`;
            break;
        }

        const contactSection = `\n\n📞 Contact me via:\n${contactLabel}: ${formattedContact}`;
        finalMessage = finalMessage ? `${finalMessage}${contactSection}` : `Hi! I'm interested in this item.${contactSection}`;
      }

      const payload = { 
        message: finalMessage,
        contactMethod: preferredContactMethod 
      };
      
      // Add offered price if provided (for marketplace items)
      if (module === 'itemsell' && offeredPrice.trim()) {
        payload.offeredPrice = parseFloat(offeredPrice);
      }
      
      // Add pickup preference if provided
      if (pickupPreference.trim()) {
        payload.pickupPreference = pickupPreference.trim();
      }
      
      // Add quantity for tickets
      if (module === 'ticketsell') {
        payload.quantity = quantity;
      }

      // Add move-in date for rooms (required)
      if (module === 'rooms') {
        if (!moveInDate) {
          throw new Error('Preferred move-in date is required');
        }
        // Convert Date object to ISO string format
        const dateString = moveInDate instanceof Date 
          ? moveInDate.toISOString().split('T')[0] 
          : moveInDate;
        payload.moveInDate = dateString;
      }

      const response = await api.sendRequest(itemId, payload);
      
      // Show success message using Dynamic Island
      showRequestSuccess('sent');
      
      setShowModal(false);
      setMessage('');
      setQuantity(1);
      setPreferredContactMethod('mobile');
      setContactValue('');
      setOfferedPrice('');
      setPickupPreference('');
      setMoveInDate(null);
      setShowContactDropdown(false);
      setShowDateDropdown(false);
      onRequestSent?.(response.data);
    } catch (error) {
      // Show error message with better handling for specific cases
      let errorMessage = error.message || 'Failed to send request';
      
      // Handle specific error cases with user-friendly messages
      if (error.message?.includes('cannot request your own')) {
        errorMessage = module === 'rooms' 
          ? "You cannot request your own room listing. This is your property!" 
          : "You cannot request your own item listing.";
      } else if (error.message?.includes('Preferred move-in date is required')) {
        errorMessage = 'Please select your preferred move-in date.';
      } else if (error.message?.includes('authentication') || error.message?.includes('login')) {
        // Show login required notification for auth errors
        showLoginRequired(window.location.pathname);
        return; // Don't show generic error for auth issues
      }
      
      // Show error using Dynamic Island
      showError(errorMessage, 'Request Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const getModuleTitle = () => {
    switch (module) {
      case 'rooms': return 'Room Request';
      case 'itemsell': return 'Purchase Request';
      case 'lostfound': return 'Claim Request';
      case 'ticketsell': return 'Ticket Request';
      case 'shareride': return 'Ride Request';
      default: return 'Request';
    }
  };

  const getPlaceholder = () => {
    switch (module) {
      case 'rooms': return 'Tell the landlord why you\'re interested (optional)...';
      case 'itemsell': return 'Add any additional details or questions (optional)...';
      case 'lostfound': return 'Provide details to help verify ownership...';
      case 'ticketsell': return 'Add any special requests or questions (optional)...';
      case 'shareride': return 'Let the driver know your pickup details (optional)...';
      default: return 'Add a message (optional)...';
    }
  };

  return (
    <>
      <button
        onClick={() => isOwnItem ? null : setShowModal(true)}
        disabled={disabled || isLoading || isOwnItem}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
          ${isOwnItem 
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
            : theme.button
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:shadow-lg
          ${className}
        `}
        title={isOwnItem ? "You cannot request your own listing" : ""}
      >
        <Send className="w-4 h-4" />
        {isOwnItem ? 'Your Listing' : 'Send Request'}
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]"
            onClick={() => setShowModal(false)}
            onMouseLeave={undefined} // Prevent mouse leave from affecting the modal
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`
                ${theme.modal} rounded-2xl p-6 w-full max-w-md shadow-2xl
                border ${theme.border}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${theme.text}`}>
                  {getModuleTitle()}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {module === 'ticketsell' && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme.input}
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    `}
                  />
                </div>
              )}

              {/* Move-in Date for Housing Requests */}
              {module === 'rooms' && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                    Preferred Move-in Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={moveInDate}
                    onChange={date => setMoveInDate(date)}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select move-in date"
                    className={`w-full px-4 py-3 rounded-xl border transition-colors ${theme.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    required
                  />
                  <p className={`text-xs mt-1 ${theme.textMuted}`}>
                    When would you like to move in?
                  </p>
                </div>
              )}

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Preferred Contact Method
                </label>
                <div className="relative" ref={contactDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setShowContactDropdown(!showContactDropdown)}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors text-left flex items-center justify-between
                      ${theme.input}
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {(() => {
                        const method = contactMethods.find(m => m.value === preferredContactMethod);
                        const IconComponent = method?.icon;
                        return (
                          <>
                            {IconComponent && <IconComponent className="w-4 h-4" />}
                            <span>{method?.label}</span>
                          </>
                        );
                      })()}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showContactDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {showContactDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`
                          absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-lg z-50
                          ${theme.dropdown}
                        `}
                      >
                        {contactMethods.map((method) => {
                          const IconComponent = method.icon;
                          return (
                            <button
                              key={method.value}
                              type="button"
                              onClick={() => {
                                setPreferredContactMethod(method.value);
                                setContactValue(''); // Clear contact value when method changes
                                setShowContactDropdown(false);
                              }}
                              className={`
                                w-full px-4 py-3 text-left flex items-center gap-3 transition-colors first:rounded-t-xl last:rounded-b-xl
                                ${theme.dropdownHover}
                                ${preferredContactMethod === method.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                              `}
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{method.label}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Dynamic Contact Information Input */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Your {preferredContactMethod === 'mobile' ? 'Phone Number' : 
                        preferredContactMethod === 'email' ? 'Email Address' : 
                        'Instagram Handle'}
                </label>
                <input
                  type={preferredContactMethod === 'email' ? 'email' : 'text'}
                  placeholder={
                    preferredContactMethod === 'mobile' ? 'Enter your phone number' :
                    preferredContactMethod === 'email' ? 'Enter your email address' :
                    '@username'
                  }
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme.input}
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  `}
                />
                <p className={`text-xs mt-1 ${theme.textMuted}`}>
                  {preferredContactMethod === 'mobile' ? 'The seller will contact you on this number' :
                   preferredContactMethod === 'email' ? 'The seller will email you at this address' :
                   'The seller can reach you via Instagram DM'}
                </p>
              </div>

              {/* Offered Price - Only for marketplace items */}
              {module === 'itemsell' && (
                <div className="mb-4">
                  <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                    Offer Price (Optional)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter your offer amount"
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(e.target.value)}
                    className={`
                      w-full px-4 py-3 rounded-xl border transition-colors
                      ${theme.input}
                      focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    `}
                  />
                  <p className={`text-xs mt-1 ${theme.textMuted}`}>
                    Suggest a different price if you want to negotiate
                  </p>
                </div>
              )}

              {/* Pickup Preference */}
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Pickup Preference (Optional)
                </label>
                <input
                  type="text"
                  placeholder={
                    module === 'itemsell' ? 'e.g., Evening pickup, Weekend only' :
                    module === 'shareride' ? 'e.g., Near main gate, specific landmark' :
                    'Any specific preferences'
                  }
                  value={pickupPreference}
                  onChange={(e) => setPickupPreference(e.target.value)}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme.input}
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  `}
                />
                <p className={`text-xs mt-1 ${theme.textMuted}`}>
                  {module === 'itemsell' ? 'Specify your preferred pickup time or conditions' :
                   module === 'shareride' ? 'Mention your pickup location or preferences' :
                   'Any additional preferences for this request'}
                </p>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Message
                </label>
                <textarea
                  placeholder={getPlaceholder()}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors resize-none
                    ${theme.input}
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  `}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={sendRequest}
                  disabled={isLoading}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium
                    ${theme.button}
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Request
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className={`
                    px-4 py-3 rounded-xl font-medium transition-colors
                    ${theme.buttonSecondary}
                  `}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RequestButton;
