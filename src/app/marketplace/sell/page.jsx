"use client";
import React, { useEffect, useState } from "react";
import { Calendar, ImageIcon, DollarSign, Tag, MapPin, Phone, Instagram, Mail, Link2, Plus, Trash2, IndianRupee, AlertCircle, CheckCircle, Upload, X } from "lucide-react";
import { createItem, formatContactInfo, checkAuthStatus } from "../../lib/api";

// Import your actual components here
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";

export default function MarketplaceSellPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("electronics");
  const [condition, setCondition] = useState("like-new");
  const [location, setLocation] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [description, setDescription] = useState("");
  const [contacts, setContacts] = useState([{ id: 1, type: 'mobile', value: '' }]);
  
  // Image handling state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated } = await checkAuthStatus();
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };
    checkAuth();
  }, []);

  // Clean up image preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const labelClr = darkMode ? "text-gray-300" : "text-gray-700";
  const inputBg = darkMode ? "bg-gray-900 border-gray-800 text-gray-100 placeholder-gray-500" : "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
  const titleClr = darkMode ? "text-white" : "text-gray-900";
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
    setError(""); // Clear any previous errors
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

    setLoading(true);
    setError("");
    setSuccess("");

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
        setSuccess(`Item "${result.data.title}" created successfully!`);
        
        // Reset form
        handleReset();
      } else {
        throw new Error(result.message || "Failed to create item");
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
    setCategory("electronics");
    setCondition("like-new");
    setLocation("");
    setAvailableFrom("");
    setDescription("");
    setContacts([{ id: 1, type: 'mobile', value: '' }]);
    
    // Clean up image
    handleRemoveImage();
    
    setError("");
    setSuccess("");
  };

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={darkMode ? "min-h-screen bg-black text-white" : "min-h-screen bg-white text-black"}>
        <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
          <div className={`rounded-2xl border p-6 text-center ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
            <h1 className={`text-xl font-semibold mb-2 ${titleClr}`}>Login Required</h1>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You need to be logged in to create item listings.
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Go to Login
            </button>
          </div>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className={darkMode ? "min-h-screen bg-black" : "min-h-screen bg-white"}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(p => !p)} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10">
        <div className={`rounded-2xl border p-4 sm:p-6 ${darkMode ? 'bg-gray-950/60 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
          <h1 className={`text-xl sm:text-2xl font-semibold ${titleClr}`}>Sell an Item</h1>

          {/* Error/Success Messages */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-500 text-sm">{error}</span>
            </div>
          )}
          
          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-500 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Title *</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="e.g., Scientific Calculator" 
                className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Price *</label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ''))} 
                  placeholder="1000" 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Category *</label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
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

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Condition *</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)} 
                className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`}
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
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Location *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  placeholder="Building / area" 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Available From *</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  value={availableFrom} 
                  onChange={(e) => setAvailableFrom(e.target.value)} 
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border ${inputBg}`}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-1 ${labelClr}`}>Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
                placeholder="Key details, specs, condition, included accessories..." 
                className={`w-full px-3 py-2.5 rounded-lg border ${inputBg}`} 
              />
            </div>

            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className={`block text-xs font-medium mb-2 ${labelClr}`}>Item Image</label>
              
              {!imagePreview ? (
                <label className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${darkMode ? 'hover:bg-gray-900/50 border-gray-700' : 'hover:bg-gray-50 border-gray-300'} ${dropBorder}`}>
                  <Upload className="w-8 h-8 text-gray-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
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
                    className="w-full h-48 object-cover rounded-xl border"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className={`text-xs font-medium ${labelClr}`}>Contact info *</label>
                <button 
                  type="button" 
                  onClick={() => setContacts((p) => [...p, { id: Date.now(), type: 'mobile', value: '' }])} 
                  className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
              <div className="space-y-3">
                {contacts.map((c, idx) => {
                  const Icon = iconForType(c.type);
                  return (
                    <div key={c.id} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                      <select 
                        value={c.type} 
                        onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, type: e.target.value } : x))} 
                        className={`sm:col-span-1 px-3 py-2.5 rounded-lg border ${inputBg}`}
                      >
                        <option value="mobile">Mobile</option>
                        <option value="instagram">Instagram</option>
                        <option value="email">Email</option>
                        <option value="link">Link</option>
                      </select>
                      <div className="sm:col-span-2 relative">
                        <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                          value={c.value} 
                          onChange={(e) => setContacts((prev) => prev.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))} 
                          placeholder={placeholderForType(c.type)} 
                          className={`w-full pl-9 pr-10 py-2.5 rounded-lg border ${inputBg}`} 
                        />
                        {contacts.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setContacts((prev) => prev.filter((x) => x.id !== c.id))} 
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-red-500/10 text-red-600" 
                            aria-label="Remove contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Publish listing'}
              </button>
              <button 
                type="button" 
                onClick={handleReset} 
                disabled={loading}
                className={`px-3 py-2.5 rounded-lg border text-sm disabled:opacity-50 ${darkMode ? 'border-gray-700 text-gray-200 hover:bg-gray-900' : 'border-gray-300 text-gray-800 hover:bg-gray-100'}`}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}