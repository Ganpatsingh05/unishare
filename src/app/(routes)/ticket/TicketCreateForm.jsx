"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  ImageIcon, 
  DollarSign, 
  Tag, 
  MapPin, 
  Phone, 
  Instagram, 
  Mail, 
  Link2, 
  Plus, 
  Trash2, 
  IndianRupee, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  X,
  ArrowLeft,
  Loader,
  Clock,
  Users,
  Ticket,
  CalendarDays,
  Music
} from "lucide-react";
import { createTicket, formatContactInfo } from "./../../lib/api";
import { 
  useAuth, 
  useMessages, 
  useUI
} from "./../../lib/contexts/UniShareContext";

export default function TicketCreateForm({ onClose, onTicketCreated }) {
  const { isAuthenticated, user } = useAuth();
  const { error, success, loading, setError, clearError, setSuccess, clearSuccess, setLoading, showTemporaryMessage } = useMessages();
  const { darkMode } = useUI();
  
  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [eventType, setEventType] = useState("concert");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [quantityAvailable, setQuantityAvailable] = useState("1");
  const [ticketType, setTicketType] = useState("Standard");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  
  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Clean up image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Set default event date to tomorrow
  useEffect(() => {
    if (!eventDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setEventDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [eventDate]);

  // Theme classes using global CSS custom properties and consistent focus states
  const labelClr = "text-secondary";
  const inputStyles = darkMode 
    ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500 focus:ring-yellow-400/30 focus:border-yellow-400" 
    : "bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500/30 focus:border-blue-500";
  const titleClr = "text-primary";
  const cardBg = "glass-card";
  const dropBorder = darkMode ? "border-gray-800" : "border-gray-300";

  const iconForType = (type) => {
    switch (type) {
      case 'mobile': return Phone;
      case 'instagram': return Instagram;
      case 'email': return Mail;
      case 'link': return Link2;
      default: return Link2;
    }
  };

  const placeholderForType = (type) => {
    switch (type) {
      case 'mobile': return '+91 98765 43210';
      case 'instagram': return '@username';
      case 'email': return 'name@university.edu';
      case 'link': return 'https://...';
      default: return '';
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image must be less than 5MB');
      return;
    }

    // Clean up previous preview
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // Set new file and preview
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    clearError(); // Clear any previous errors
  };

  // Remove selected image
  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    
    // Clear the file input
    const fileInput = document.getElementById('ticketImageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please log in to create a ticket listing");
      return;
    }

    setLoading(true);
    clearError();
    clearSuccess();

    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error("Event title is required");
      }
      if (!price || isNaN(price) || parseFloat(price) <= 0) {
        throw new Error("Valid price is required");
      }
      if (!venue.trim()) {
        throw new Error("Venue is required");
      }
      if (!location.trim()) {
        throw new Error("Location is required");
      }
      if (!eventDate) {
        throw new Error("Event date is required");
      }
      if (!quantityAvailable || parseInt(quantityAvailable) <= 0) {
        throw new Error("Valid quantity is required");
      }

      // Combine date and time
      const eventDateTime = eventTime ? 
        `${eventDate}T${eventTime}:00.000Z` : 
        `${eventDate}T19:00:00.000Z`; // Default to 7 PM if no time specified

      // Format contact info
      const contactInfo = formatContactInfo(contacts);
      if (Object.keys(contactInfo).length === 0) {
        throw new Error("At least one contact method is required");
      }

      // Prepare ticket data
      const ticketData = {
        title: title.trim(),
        price: parseFloat(price),
        event_type: eventType,
        event_date: eventDateTime,
        venue: venue.trim(),
        location: location.trim(),
        quantity_available: parseInt(quantityAvailable),
        ticket_type: ticketType,
        description: description.trim(),
        contact_info: contactInfo
      };

      // Call createTicket with image file
      const result = await createTicket(ticketData, imageFile);
      
      if (result.success) {
        // Note: Could add ticket to context state here if needed
        
        showTemporaryMessage(`Ticket "${result.data.title}" listed successfully!`, true, 4000);
        
        // Reset form
        handleReset();
        
        // Notify parent component
        if (onTicketCreated) {
          onTicketCreated(result.data);
        }
        
        // Close form after delay
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to create ticket listing");
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setPrice("");
    setEventType("concert");
    setEventDate("");
    setEventTime("");
    setVenue("");
    setLocation("");
    setQuantityAvailable("1");
    setTicketType("Standard");
    setDescription("");
    setContacts([{ id: 1, type: 'mobile', value: '' }]);
    
    // Clean up image
    handleRemoveImage();
    
    clearError();
    clearSuccess();
  };

  const addContact = () => {
    setContacts(prev => [...prev, { id: Date.now(), type: 'mobile', value: '' }]);
  };

  const updateContact = (idx, field, value) => {
    setContacts(prev => prev.map((contact, i) => 
      i === idx ? { ...contact, [field]: value } : contact
    ));
  };

  const removeContact = (contactId) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto" 
      onClick={onClose}
    >
      <div 
        className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${cardBg} p-6 m-4`} 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Sell Event Tickets</h2>
              <p className={`text-sm text-muted`}>
                List your tickets for others to purchase safely
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-500">{error}</span>
            <button onClick={clearError} className="ml-auto">
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-500">{success}</span>
            <button onClick={clearSuccess} className="ml-auto">
              <X className="w-4 h-4 text-green-500" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Event Title */}
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
              Event Title *
            </label>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Concert: Taylor Swift - Eras Tour" 
              className={`w-full px-4 py-3 rounded-lg border ${inputStyles} focus:outline-none focus:ring-2 transition-colors`}
              required
            />
          </div>

          {/* Price & Event Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Price per Ticket *</label>
            <div className="relative">
              <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={price} 
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} 
                placeholder="2500" 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Type *</label>
            <div className="relative">
              <Tag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)} 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                required
              >
                <option value="concert">Concert</option>
                <option value="sports">Sports</option>
                <option value="comedy">Comedy</option>
                <option value="theater">Theater</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Event Date & Time */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Date *</label>
            <div className="relative">
              <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Event Time</label>
            <div className="relative">
              <Clock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="time" 
                value={eventTime} 
                onChange={(e) => setEventTime(e.target.value)} 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
              />
            </div>
          </div>

          {/* Venue & Location */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Venue *</label>
            <input 
              value={venue} 
              onChange={(e) => setVenue(e.target.value)} 
              placeholder="e.g., Wankhede Stadium, Phoenix MarketCity" 
              className={`w-full px-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>City *</label>
            <div className="relative">
              <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Mumbai, Delhi, Bangalore..." 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                required
              />
            </div>
          </div>

          {/* Quantity & Ticket Type */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Tickets Available *</label>
            <div className="relative">
              <Users className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="number" 
                min="1"
                max="20"
                value={quantityAvailable} 
                onChange={(e) => setQuantityAvailable(e.target.value)} 
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
                required
              />
            </div>
          </div>
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Ticket Type</label>
            <select 
              value={ticketType} 
              onChange={(e) => setTicketType(e.target.value)} 
              className={`w-full px-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors`}
            >
              <option value="General">General</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="VIP">VIP</option>
              <option value="Front Row">Front Row</option>
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Additional Details</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={4} 
              placeholder="Describe the seats, any special details, reason for selling..." 
              className={`w-full px-4 py-3 rounded-lg border ${inputStyles} focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none`} 
            />
          </div>

          {/* Image Upload */}
          <div className="sm:col-span-2">
            <label className={`block text-sm font-medium mb-3 ${labelClr}`}>Event/Ticket Photo (Optional)</label>
            
            {!imagePreview ? (
              <label className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${darkMode ? 'hover:bg-gray-900/50 border-gray-700 hover:border-gray-600' : 'hover:bg-gray-50 border-gray-300 hover:border-gray-400'} ${dropBorder}`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className={`text-base font-medium ${titleClr} mb-1`}>
                    Upload Event Photo
                  </p>
                  <p className={`text-sm text-muted`}>
                    JPEG, PNG, or WebP up to 5MB
                  </p>
                </div>
                <input 
                  id="ticketImageInput"
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSelect}
                />
              </label>
            ) : (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  className="w-full h-64 object-cover rounded-xl border shadow-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-medium ${labelClr}`}>Contact Information *</label>
              <button 
                type="button" 
                onClick={addContact}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Contact
              </button>
            </div>
            <div className="space-y-4">
              {contacts.map((contact, idx) => {
                const Icon = iconForType(contact.type);
                return (
                  <div key={contact.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select 
                        value={contact.type} 
                        onChange={(e) => updateContact(idx, 'type', e.target.value)}
                        className={`px-4 py-3 rounded-lg border ${inputStyles}`}
                      >
                        <option value="mobile">Mobile</option>
                        <option value="instagram">Instagram</option>
                        <option value="email">Email</option>
                        <option value="link">Link</option>
                      </select>
                      <div className="sm:col-span-2 relative">
                        <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          value={contact.value} 
                          onChange={(e) => updateContact(idx, 'value', e.target.value)}
                          placeholder={placeholderForType(contact.type)} 
                          className={`w-full pl-10 ${contacts.length > 1 ? 'pr-12' : 'pr-4'} py-3 rounded-lg border ${inputStyles}`} 
                        />
                        {contacts.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeContact(contact.id)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 transition-colors" 
                            title="Remove contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-3 pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Listing Tickets...
                </>
              ) : (
                'List Tickets for Sale'
              )}
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg border font-medium transition-colors disabled:opacity-50 ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              Reset Form
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              className={`w-full sm:w-auto px-6 py-3 rounded-lg border font-medium transition-colors disabled:opacity-50 ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-800' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
