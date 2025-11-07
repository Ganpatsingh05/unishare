"use client";

import React, { useEffect, useState } from "react";
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
  Loader
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createItem, formatContactInfo } from "./../../../lib/api";
import { 
  useAuth, 
  useMessages, 
  useUI, 
  useUserData 
} from "./../../../lib/contexts/UniShareContext";
import { MarketplaceNotifications } from "./../../../lib/utils/actionNotifications";
import Footer from "./../../../_components/layout/Footer";
import SmallFooter from "./../../../_components/layout/SmallFooter";
import MarketplaceSellTheme from "./../../../_components/ServicesTheme/MarsTheme";
import useIsMobile from "./../../../_components/ui/useIsMobile";

export default function MarketplaceSellPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading, user } = useAuth();
  const { error, success, loading, setError, clearError, setSuccess, clearSuccess, setLoading, showTemporaryMessage } = useMessages();
  const { darkMode, toggleDarkMode, showFormLoading, stopNavigationLoading } = useUI();
  const { addUserItem } = useUserData();
  const isMobile = useIsMobile();
  
  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [condition, setCondition] = useState("like-new");
  const [location, setLocation] =useState("");
  const [availableFrom, setAvailableFrom] = useState("");
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

  // Set default available date to today
  useEffect(() => {
    if (!availableFrom) {
      setAvailableFrom(new Date().toISOString().split('T')[0]);
    }
  }, [availableFrom]);

  // Theme classes
  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
  const cardBg = darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200";
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
    const fileInput = document.getElementById('imageInput');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError("Please log in to create an item listing");
      return;
    }

    // Show custom navigation loader for form submission
    showFormLoading('Creating your item listing...');
    clearError();
    clearSuccess();

    try {
      // Validate required fields
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      if (!price || isNaN(price) || parseFloat(price) <= 0) {
        throw new Error("Valid price is required");
      }
      if (!location.trim()) {
        throw new Error("Location is required");
      }
      if (!availableFrom) {
        throw new Error("Available from date is required");
      }

      // Format contact info
      const contactInfo = formatContactInfo(contacts);
      if (Object.keys(contactInfo).length === 0) {
        throw new Error("At least one contact method is required");
      }

      // Prepare item data
      const itemData = {
        title: title.trim(),
        price: parseFloat(price),
        category,
        condition,
        location: location.trim(),
        available_from: availableFrom,
        description: description.trim(),
        photos: [],
        contact_info: contactInfo
      };

      // Call createItem with image file
      const result = await createItem(itemData, imageFile);
      
      if (result.success) {
        // Show Dynamic Island notification
        MarketplaceNotifications.itemListed(result.data.title);
        
        // Add to context state
        addUserItem(result.data);
        
        showTemporaryMessage(`Item "${result.data.title}" created successfully!`, true, 4000);
        
        // Reset form
        handleReset();
        
        // Redirect to marketplace after a delay
        setTimeout(() => {
          router.push('/marketplace/buy');
        }, 2000);
      } else {
        throw new Error(result.message || "Failed to create item");
      }

    } catch (error) {
      setError(error.message);
    } finally {
      stopNavigationLoading();
    }
  };

  const handleReset = () => {
    setTitle("");
    setPrice("");
    setCategory("electronics");
    setCondition("like-new");
    setLocation("");
    setAvailableFrom(new Date().toISOString().split('T')[0]);
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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen">
        {/* Marketplace Sell Mars Red Theme */}
        <MarketplaceSellTheme />
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className={titleClr}>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        {/* Marketplace Sell Mars Red Theme */}
        <MarketplaceSellTheme />
        <main className={`relative ${isMobile ? 'px-3 py-4' : 'max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10'}`}>
          <div className={`rounded-2xl border shadow-xl ${isMobile ? 'p-6' : 'p-8'} text-center ${cardBg} backdrop-blur-sm`}>
            <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center`}>
              <AlertCircle className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-orange-500`} />
            </div>
            <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-4 ${titleClr}`}>Login Required</h2>
            <p className={`mb-6 ${isMobile ? 'text-sm' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You need to be logged in to create item listings and start selling.
            </p>
            <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'flex-row justify-center'}`}>
              <Link 
                href="/login"
                className={`inline-flex items-center ${isMobile ? 'justify-center' : ''} gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-md hover:shadow-lg ${isMobile ? 'py-3 px-4 text-sm' : 'px-6 py-3'}`}
              >
                Go to Login
              </Link>
              <Link 
                href="/marketplace/buy"
                className={`inline-flex items-center ${isMobile ? 'justify-center' : ''} gap-2 border rounded-lg font-medium transition-all ${isMobile ? 'py-3 px-4 text-sm' : 'px-6 py-3'} ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
              >
                Browse Items
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Marketplace Sell Mars Red Theme */}
      <MarketplaceSellTheme />
      

      <main className={`relative ${isMobile ? 'px-3 py-4' : 'max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10'}`}>
        <div className={`rounded-2xl border shadow-xl ${isMobile ? 'p-3 sm:p-4' : 'p-4 sm:p-6'} ${cardBg} backdrop-blur-sm`}>
          <div className="mb-6">
            <h2 className={`${isMobile ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'} font-semibold ${titleClr} mb-2`}>Create Item Listing</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Fill out the details below to list your item for sale
            </p>
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
            {/* Title */}
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>
                Item Title *
              </label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Scientific Calculator TI-84 Plus" 
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                required
              />
            </div>

            {/* Price & Category */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Price *</label>
              <div className="relative">
                <IndianRupee className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} 
                  placeholder="1000" 
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Category *</label>
              <div className="relative">
                <Tag className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  required
                >
                  <option value="electronics">Electronics</option>
                  <option value="books">Books</option>
                  <option value="furniture">Furniture</option>
                  <option value="accessories">Accessories</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Condition & Location */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Condition *</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)} 
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                required
              >
                <option value="new">New</option>
                <option value="like-new">Like New</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Location *</label>
              <div className="relative">
                <MapPin className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Building / area" 
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  required
                />
              </div>
            </div>

            {/* Available From */}
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Available From *</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  value={availableFrom} 
                  onChange={(e) => setAvailableFrom(e.target.value)} 
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-2 ${labelClr}`}>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={4} 
                placeholder="Describe your item - key details, specifications, condition, included accessories, reason for selling..." 
                className={`w-full px-4 py-3 rounded-lg border ${inputBg} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none`} 
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium mb-3 ${labelClr}`}>Item Photo</label>
              
              {!imagePreview ? (
                <label className={`flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${darkMode ? 'hover:bg-gray-900/50 border-gray-700 hover:border-gray-600' : 'hover:bg-gray-50 border-gray-300 hover:border-gray-400'} ${dropBorder}`}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center">
                    <p className={`text-base font-medium ${titleClr} mb-1`}>
                      Upload Item Photo
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      JPEG, PNG, or WebP up to 5MB
                    </p>
                  </div>
                  <input 
                    id="imageInput"
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
                    alt="Item preview" 
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
                          className={`px-4 py-3 rounded-lg border ${inputBg}`}
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
                            className={`w-full pl-10 ${contacts.length > 1 ? 'pr-12' : 'pr-4'} py-3 rounded-lg border ${inputBg}`} 
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
                    Creating Listing...
                  </>
                ) : (
                  'Publish Listing'
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
            </div>
          </form>
        </div>
      </main>
      <SmallFooter />
    </div>
  );
}
