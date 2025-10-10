"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Package } from 'lucide-react';
import { useUI } from '../lib/contexts/UniShareContext';

const RequestButton = ({ module, itemId, onRequestSent, disabled = false, className = '' }) => {
  const { darkMode } = useUI();
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

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-white',
    modal: darkMode ? 'bg-gray-800' : 'bg-white',
    card: darkMode ? 'bg-gray-700' : 'bg-gray-50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-300' : 'text-gray-600',
    border: darkMode ? 'border-gray-600' : 'border-gray-300',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
  };

  const sendRequest = async () => {
    setIsLoading(true);
    try {
      // Dynamic import based on module
      const { roomsAPI, marketplaceAPI, lostFoundAPI, ticketsAPI, ridesAPI } = await import('../lib/api/requests');
      
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

      const response = await api.sendRequest(itemId, payload);
      
      // Show success message
      const event = new CustomEvent('showMessage', {
        detail: { message: 'Request sent successfully!', type: 'success' }
      });
      window.dispatchEvent(event);
      
      setShowModal(false);
      setMessage('');
      setQuantity(1);
      setPreferredContactMethod('mobile');
      setContactValue('');
      setOfferedPrice('');
      setPickupPreference('');
      onRequestSent?.(response.data);
    } catch (error) {
      // Show error message
      const event = new CustomEvent('showMessage', {
        detail: { message: error.message || 'Failed to send request', type: 'error' }
      });
      window.dispatchEvent(event);
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
        onClick={() => setShowModal(true)}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200
          ${theme.button}
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:shadow-lg
          ${className}
        `}
      >
        <Send className="w-4 h-4" />
        Send Request
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
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

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${theme.text}`}>
                  Preferred Contact Method
                </label>
                <select
                  value={preferredContactMethod}
                  onChange={(e) => {
                    setPreferredContactMethod(e.target.value);
                    setContactValue(''); // Clear contact value when method changes
                  }}
                  className={`
                    w-full px-4 py-3 rounded-xl border transition-colors
                    ${theme.input}
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  `}
                >
                  <option value="mobile">Mobile/Phone</option>
                  <option value="email">Email</option>
                  <option value="instagram">Instagram</option>
                </select>
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