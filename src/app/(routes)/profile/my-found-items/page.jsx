'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Plus, CheckCircle, Camera,
  Search as SearchIcon, MapPin, Calendar, Clock, Info, Instagram, Mail, Phone, Edit3, Trash2 } from "lucide-react";

// Import API functions
import { 
  fetchMyLostFoundItems, 
  createLostFoundItem, 
  updateLostFoundItem, 
  deleteLostFoundItem 
} from "./../../../lib/api/lostFound";

// Import contexts
import { useAuth, useUI } from "./../../../lib/contexts/UniShareContext";

// Import components
import Footer from "./../../../_components/layout/Footer";
import SmallFooter from "./../../../_components/layout/SmallFooter";


const LostFoundCard = ({ item, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit item
  const handleEdit = () => {
    if (onEdit) {
      onEdit(item, 'lostfound');
    } else {
      // Fallback: navigate to edit page
      const mode = item.mode || item.type;
      window.location.href = `/lost-found/${mode === 'found' ? 'found' : 'report'}/edit/${item.id || item._id}`;
    }
  };

  // Handle delete item
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.item_name || item.title || item.name}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteLostFoundItem(item.id || item._id);
      if (result.success) {
        showMessage?.(result.message || 'Item deleted successfully', 'success');
        if (onDelete) {
          onDelete(item, 'lostfound');
        } else if (onUpdate) {
          onUpdate(); // Refresh the list
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage?.(error.message || 'Failed to delete item', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl overflow-hidden border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
  >
    <div className="aspect-video bg-gradient-to-br from-red-100 to-red-200 relative">
      {(item.image_urls && item.image_urls.length > 0) ? (
        <img 
          src={item.image_urls[0]} 
          alt={item.item_name || item.title || item.name} 
          className="w-full h-full object-cover" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
          }}
        />
      ) : null}
      <div className="w-full h-full flex items-center justify-center fallback-icon" style={{ display: (item.image_urls && item.image_urls.length > 0) ? 'none' : 'flex' }}>
        <SearchIcon className="w-12 h-12 text-red-500" />
      </div>
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          (item.mode || item.type) === 'lost' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`}>
          {item.mode || item.type || 'lost'}
        </span>
      </div>
      {item.reward && (
        <div className="absolute bottom-2 left-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500 text-white">
            ₹{item.reward} Reward
          </span>
        </div>
      )}
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className={`font-semibold ${theme.text} mb-1`}>
          {item.item_name || item.title || item.name}
        </h3>
        {item.category && (
          <span className={`text-sm ${theme.textMuted} bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded`}>
            {item.category}
          </span>
        )}
      </div>

      {item.description && (
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{item.description}</p>
      )}

      <div className="grid grid-cols-1 gap-2 text-sm">
        {/* Location - different field names for lost vs found */}
        {(item.where_last_seen || item.where_found || item.location) && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-red-500" />
            <span>
              {item.mode === 'lost' ? 'Last seen: ' : 'Found at: '}
              {item.where_last_seen || item.where_found || item.location}
            </span>
          </div>
        )}
        
        {/* Date */}
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Calendar className="w-4 h-4 text-red-500" />
          <span>
            {(item.mode || item.type) === 'lost' ? 'Lost on: ' : 'Found on: '}
            {item.date_lost || item.date_found || item.date || 'Not specified'}
          </span>
        </div>
        
        {/* Time */}
        {(item.time_lost || item.time_found || item.time) && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Clock className="w-4 h-4 text-red-500" />
            <span>
              {item.mode === 'lost' ? 'Time lost: ' : 'Time found: '}
              {item.time_lost || item.time_found || item.time}
            </span>
          </div>
        )}
      </div>

      {/* Contact Information */}
      {item.contact_info && Object.keys(item.contact_info).length > 0 && (
        <div className="space-y-2">
          <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
          <div className="space-y-1">
            {item.contact_info.instagram && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Instagram className="w-4 h-4 text-pink-500" />
                <span>@{item.contact_info.instagram}</span>
              </div>
            )}
            {item.contact_info.email && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Mail className="w-4 h-4 text-blue-500" />
                <span>{item.contact_info.email}</span>
              </div>
            )}
            {item.contact_info.mobile && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Phone className="w-4 h-4 text-green-500" />
                <span>{item.contact_info.mobile}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {item.status && item.status !== 'active' && (
        <div className={`text-sm font-medium flex items-center gap-1 ${
          item.status === 'resolved' ? 'text-green-600' : 'text-yellow-600'
        }`}>
          <Info className="w-4 h-4" />
          <span>Status: {item.status}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
        <span className={`text-xs ${theme.textMuted}`}>
          Posted {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recently'}
        </span>
        <div className="flex space-x-1">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleEdit}
            disabled={isDeleting}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50`}
            title="Edit Item"
          >
            <Edit3 className="w-3 h-3 text-red-600" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50`}
            title={isDeleting ? "Deleting..." : "Delete Item"}
          >
            <Trash2 className={`w-3 h-3 text-red-500 ${isDeleting ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const MyFoundItemsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { darkMode } = useUI();
  
  // State
  const [foundItems, setFoundItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    item_name: '',
    description: '',
    where_found: '',
    date_found: '',
    time_found: '',
    contact_phone: '',
    contact_email: '',
    contact_instagram: ''
  });
  
  // Image state
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    accent: 'text-green-600',
    accentBg: 'bg-green-50',
    accentDark: darkMode ? 'bg-green-900/20' : 'bg-green-50'
  };

  // Message handlers
  const showMessage = (message, type) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(message);
      setSuccess('');
      setTimeout(() => setError(''), 5000);
    }
  };

  // Load found items on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadFoundItems();
    }
  }, [isAuthenticated]);

  const loadFoundItems = async () => {
    try {
      setIsLoading(true);
      const result = await fetchMyLostFoundItems();
      if (result.success) {
        // Filter only found items
        const found = (result.data || []).filter(item => item.mode === 'found');
        setFoundItems(found);
      } else {
        setError(result.message || 'Failed to load found items');
      }
    } catch (error) {
      console.error('Error loading found items:', error);
      setError('Failed to load found items');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 3) {
      showMessage('You can only upload up to 3 images', 'error');
      return;
    }
    
    setSelectedImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  // Remove selected image
  const removeSelectedImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    
    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(imagePreview[index]);
    
    setSelectedImages(newImages);
    setImagePreview(newPreviews);
  };

  // Remove existing image
  const removeExistingImage = (index) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
  };

  // Reset image states
  const resetImageStates = () => {
    imagePreview.forEach(url => URL.revokeObjectURL(url));
    setSelectedImages([]);
    setImagePreview([]);
    setExistingImages([]);
  };

  // Handle create found item
  const handleCreate = () => {
    setSelectedItem(null);
    setFormData({
      item_name: '',
      description: '',
      where_found: '',
      date_found: '',
      time_found: '',
      contact_phone: '',
      contact_email: '',
      contact_instagram: ''
    });
    resetImageStates();
    setIsCreateModalOpen(true);
  };

  // Handle edit found item
  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      item_name: item.item_name || '',
      description: item.description || '',
      where_found: item.where_found || '',
      date_found: item.date_found || '',
      time_found: item.time_found || '',
      contact_phone: item.contact_info?.mobile || '',
      contact_email: item.contact_info?.email || '',
      contact_instagram: item.contact_info?.instagram || ''
    });
    
    // Handle existing images
    if (item.image_urls && item.image_urls.length > 0) {
      setExistingImages(item.image_urls);
    } else if (item.image_url) {
      setExistingImages([item.image_url]);
    } else {
      setExistingImages([]);
    }
    
    setIsEditModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare found item data
      const itemData = {
        item_name: formData.item_name,
        description: formData.description,
        mode: 'found',
        where_found: formData.where_found,
        date_found: formData.date_found,
        time_found: formData.time_found || null,
        contact_info: {
          mobile: formData.contact_phone || '',
          email: formData.contact_email || '',
          instagram: formData.contact_instagram || ''
        },
        status: 'active'
      };

      // Remove empty contact info
      if (!itemData.contact_info.mobile && !itemData.contact_info.email && !itemData.contact_info.instagram) {
        delete itemData.contact_info;
      }

      // Remove null/empty values
      Object.keys(itemData).forEach(key => {
        if (itemData[key] === null || itemData[key] === '') {
          delete itemData[key];
        }
      });

      let result;
      if (selectedItem) {
        // Update existing item
        if (selectedImages.length > 0) {
          result = await updateLostFoundItem(selectedItem.id, itemData, selectedImages);
        } else {
          result = await updateLostFoundItem(selectedItem.id, itemData);
        }
        
        if (result.success) {
          setFoundItems(prev => prev.map(item => 
            item.id === selectedItem.id ? { ...item, ...itemData } : item
          ));
          showMessage('Found item updated successfully!', 'success');
        }
      } else {
        // Create new item
        result = await createLostFoundItem(itemData, selectedImages);
        if (result.success && result.data) {
          setFoundItems(prev => [result.data, ...prev]);
          showMessage('Found item reported successfully!', 'success');
        }
      }

      if (!result.success) {
        throw new Error(result.message || 'Failed to save found item');
      }

      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedItem(null);
      resetImageStates();
    } catch (error) {
      console.error('Error saving found item:', error);
      showMessage(error.message || 'Failed to save found item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete item
  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsSubmitting(true);
    try {
      const result = await deleteLostFoundItem(itemToDelete.id);
      if (result.success) {
        setFoundItems(prev => prev.filter(item => item.id !== itemToDelete.id));
        showMessage('Found item deleted successfully!', 'success');
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        throw new Error(result.message || 'Failed to delete found item');
      }
    } catch (error) {
      console.error('Error deleting found item:', error);
      showMessage(error.message || 'Failed to delete found item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center`}>
        <div className="text-center">
          <h1 className={`text-2xl font-bold ${theme.text} mb-4`}>Please log in to view your found items</h1>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Header */}
      <div className={`${theme.card} shadow-sm border-b ${theme.border}`}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/profile" 
                className={`flex items-center gap-2 ${theme.textMuted} hover:${theme.text} transition-colors`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Profile</span>
              </Link>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Report Found Item</span>
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <h1 className={`text-3xl font-bold ${theme.text}`}>My Found Items</h1>
            </div>
            <p className={`${theme.textMuted}`}>Manage your found item reports</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-100 border border-red-200 flex items-center gap-3"
              >
                <span className="text-red-700">{error}</span>
                <button onClick={() => setError('')} className="ml-auto text-red-500">×</button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3"
              >
                <span className="text-green-700">{success}</span>
                <button onClick={() => setSuccess('')} className="ml-auto text-green-500">×</button>
              </motion.div>
            )}
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className={theme.textMuted}>Loading found items...</p>
          </div>
        ) : foundItems.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No Found Items Reported</h3>
            <p className={`${theme.textMuted} mb-6`}>You haven't reported any found items yet. Start by reporting your first found item to help others.</p>
            <button
              onClick={handleCreate}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Report Found Item
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {foundItems.map((item) => (
              <LostFoundCard
                key={item.id}
                item={item}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDeleteConfirm(item)}
                theme={theme}
              />
            ))}
          </div>
        )}
      </main>

      <SmallFooter />

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${theme.card} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-xl font-semibold ${theme.text}`}>
                {selectedItem ? 'Edit Found Item' : 'Report Found Item'}
              </h2>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedItem(null);
                  resetImageStates();
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-1`}>Item Name *</label>
                <input
                  type="text"
                  value={formData.item_name}
                  onChange={(e) => setFormData(prev => ({...prev, item_name: e.target.value}))}
                  className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                  placeholder="What item did you find?"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-1`}>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card} resize-none`}
                  placeholder="Detailed description of the item..."
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Where Found *</label>
                  <input
                    type="text"
                    value={formData.where_found}
                    onChange={(e) => setFormData(prev => ({...prev, where_found: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    placeholder="Where did you find it?"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-1`}>Date Found *</label>
                  <input
                    type="date"
                    value={formData.date_found}
                    onChange={(e) => setFormData(prev => ({...prev, date_found: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-1`}>Time Found (Optional)</label>
                <input
                  type="time"
                  value={formData.time_found}
                  onChange={(e) => setFormData(prev => ({...prev, time_found: e.target.value}))}
                  className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                />
              </div>
              
              {/* Image Upload */}
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${theme.text} mb-2`}>Item Images</label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <p className={`text-sm ${theme.textMuted}`}>Current Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {existingImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Item image ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Upload */}
                <div className="space-y-2">
                  <input
                    type="file"
                    id="found-images"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="found-images"
                    className={`flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 ${theme.border} ${theme.textMuted}`}
                  >
                    <Camera className="w-5 h-5" />
                    <span>Choose Images (Max 3)</span>
                  </label>
                  {imagePreview.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className={`text-sm font-medium ${theme.text}`}>Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Phone</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData(prev => ({...prev, contact_phone: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData(prev => ({...prev, contact_email: e.target.value}))}
                      className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.textMuted} mb-1`}>Instagram</label>
                  <input
                    type="text"
                    value={formData.contact_instagram}
                    onChange={(e) => setFormData(prev => ({...prev, contact_instagram: e.target.value}))}
                    className={`w-full p-2 border rounded-lg ${theme.border} ${theme.card}`}
                    placeholder="@your_handle"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setIsEditModalOpen(false);
                    setSelectedItem(null);
                    resetImageStates();
                  }}
                  className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${theme.border} ${theme.text}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : (selectedItem ? 'Update' : 'Report')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.card} rounded-lg p-6 m-4 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text}`}>Delete Found Item</h2>
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className={theme.textMuted}>
                Are you sure you want to delete this found item report? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className={`px-4 py-2 border rounded hover:bg-gray-50 ${theme.text}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyFoundItemsPage;
