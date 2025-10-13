'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, ShoppingBag, Plus, AlertCircle, CheckCircle, X,
  MapPin, Tag, Package, Phone, Mail, DollarSign, Edit3, Trash2, Camera 
} from 'lucide-react';

// Import API functions
import { 
  fetchMyItems, 
  createItem, 
  updateItem, 
  deleteItem 
} from '../../lib/api/marketplace';
import { MarketplaceNotifications } from '../../lib/utils/actionNotifications';

// Import contexts
import { useAuth, useUI, useUniShare } from '../../lib/contexts/UniShareContext';

// Import components
import Footer from '../../_components/Footer';
import SmallFooter from '../../_components/SmallFooter';


// Helper function to format contact information for API submission
const formatContactInfo = (editFormData) => {
  const contactInfo = {};
  if (editFormData.contact_phone) contactInfo.mobile = editFormData.contact_phone;
  if (editFormData.contact_email) contactInfo.email = editFormData.contact_email;
  if (editFormData.contact_instagram) contactInfo.instagram = editFormData.contact_instagram;
  if (editFormData.contact_link) contactInfo.link = editFormData.contact_link;
  
  return Object.keys(contactInfo).length > 0 ? contactInfo : editFormData.contact_info;
};

// Helper function to safely render contact information
const renderContactInfo = (contactInfo) => {
  if (!contactInfo) return null;
  
  // If it's a string, return it directly
  if (typeof contactInfo === 'string') {
    return contactInfo;
  }
  
  // If it's an object, extract and format the information
  if (typeof contactInfo === 'object') {
    const parts = [];
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.email) parts.push(`✉️ ${contactInfo.email}`);
    if (contactInfo.instagram) parts.push(`📸 ${contactInfo.instagram.startsWith('@') ? contactInfo.instagram : '@' + contactInfo.instagram}`);
    return parts.length > 0 ? parts.join(' • ') : 'Contact available';
  }
  
  return 'Contact available';
};

const ItemCard = ({ item, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit item
  const handleEdit = () => {
    if (onEdit) {
      onEdit(item, 'items');
    } else {
      // Fallback: navigate to edit page
      window.location.href = `/marketplace/edit/${item.id || item._id}`;
    }
  };

  // Handle delete item
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.title}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteItem(item.id || item._id);
      if (result.success) {
        showMessage?.(result.message || 'Item deleted successfully', 'success');
        if (onDelete) {
          onDelete(item, 'items');
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
    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 relative">
      {item.image_url || item.image ? (
        <img 
          src={item.image_url || item.image} 
          alt={item.title} 
          className="w-full h-full object-cover" 
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-green-500" />
        </div>
      )}
      <div className="absolute top-2 right-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          item.status === 'available' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
        }`}>
          {item.status || 'available'}
        </span>
      </div>
      {item.condition && (
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.condition === 'new' ? 'bg-blue-500 text-white' : 
            item.condition === 'excellent' ? 'bg-purple-500 text-white' :
            item.condition === 'good' ? 'bg-yellow-500 text-white' :
            'bg-orange-500 text-white'
          }`}>
            {item.condition}
          </span>
        </div>
      )}
    </div>
    <div className="p-4 space-y-3">
      <div>
        <h3 className={`font-semibold ${theme.text} mb-1`}>{item.title}</h3>
        <div className="flex items-center justify-between">
          <span className={`text-lg font-bold text-green-600`}>₹{item.price}</span>
          {item.category && (
            <span className={`text-sm ${theme.textMuted} bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded`}>
              {item.category}
            </span>
          )}
        </div>
      </div>

      {item.description && (
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>{item.description}</p>
      )}

      <div className="grid grid-cols-1 gap-2 text-sm">
        {item.brand && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Tag className="w-4 h-4 text-green-500" />
            <span>Brand: {item.brand}</span>
          </div>
        )}
        {item.model && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <Package className="w-4 h-4 text-green-500" />
            <span>Model: {item.model}</span>
          </div>
        )}
        {item.location && (
          <div className={`${theme.textMuted} flex items-center gap-2`}>
            <MapPin className="w-4 h-4 text-green-500" />
            <span>{item.location}</span>
          </div>
        )}
      </div>

      {item.specifications && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Specifications:</span>
          <p className={`text-xs ${theme.textMuted} leading-relaxed`}>{item.specifications}</p>
        </div>
      )}

      {(item.contact_info || item.phone || item.email) && (
        <div className="space-y-1">
          <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
          <div className="space-y-1">
            {(item.phone || item.contact_info) && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Phone className="w-3 h-3 text-green-500" />
                <span>{item.phone || renderContactInfo(item.contact_info)}</span>
              </div>
            )}
            {item.email && (
              <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
                <Mail className="w-3 h-3 text-green-500" />
                <span>{item.email}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {item.negotiable && (
        <div className={`text-sm text-green-600 font-medium flex items-center gap-1`}>
          <DollarSign className="w-4 h-4" />
          <span>Price Negotiable</span>
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
            className={`p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded transition-colors disabled:opacity-50`}
            title="Edit Item"
          >
            <Edit3 className="w-3 h-3 text-green-600" />
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

const MyItemsPage = () => {
  const { isAuthenticated, user, authLoading } = useAuth();
  const { darkMode } = useUI();
  const uniShareContext = useUniShare();
  
  const showMessage = uniShareContext?.showMessage || ((message, type) => {
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  });

  // State variables
  const [userItems, setUserItems] = useState([]);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);

  // Messages
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // CRUD Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Image upload states
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Helper function to reset image states
  const resetImageStates = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  // Loading states for operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
  };

  // Load user items data
  const loadUserItems = async () => {
    if (!user?.id) return;
    
    setIsLoadingUserData(true);
    try {
      const result = await fetchMyItems({ 
        limit: 50, 
        cache: true, 
        cacheTTL: 2 * 60 * 1000
      });
      
      if (result?.success) {
        setUserItems(result.data || []);
      } else {
        setUserItems([]);
      }
    } catch (error) {
      try {
        showMessage('Failed to load items data', 'error');
      } catch (msgError) {
        alert('Error: Failed to load items data');
      }
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // Image handlers
  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeSelectedImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  // CRUD handlers
  const handleEdit = (item) => {
    setSelectedItem({ ...item, type: 'items' });
    const formData = {
      ...item,
      contact_phone: item.contact_info?.mobile || '',
      contact_email: item.contact_info?.email || '',
      contact_instagram: item.contact_info?.instagram || '',
      contact_link: item.contact_info?.link || '',
      contact_info: item.contact_info || {}
    };
    setEditFormData(formData);
    
    if (item.image) {
      setExistingImages([item.image]);
    } else {
      setExistingImages([]);
    }
    
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = (item) => {
    setItemToDelete({ ...item, type: 'items' });
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem({ type: 'items' });
    setEditFormData({});
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedItem) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { id } = selectedItem;
      let result;

      if (id) {
        // Edit existing item
        const itemUpdateData = {
          title: editFormData.title,
          price: editFormData.price,
          category: editFormData.category,
          condition: editFormData.condition,
          location: editFormData.location,
          available_from: editFormData.available_from,
          description: editFormData.description || '',
          contact_info: formatContactInfo(editFormData)
        };
        const itemImageFile = selectedImages.length > 0 ? selectedImages[0] : null;
        result = await updateItem(id, itemUpdateData, itemImageFile);
        if (result.success && result.data) {
          // Show Dynamic Island notification
          MarketplaceNotifications.itemUpdated();
          
          setUserItems(prev => prev.map(item => item.id === id ? result.data : item));
        }
      } else {
        // Create new item
        const itemCreateData = {
          title: editFormData.title,
          price: editFormData.price,
          category: editFormData.category,
          condition: editFormData.condition,
          location: editFormData.location,
          available_from: editFormData.available_from,
          description: editFormData.description || '',
          contact_info: formatContactInfo(editFormData)
        };
        const itemCreateImageFile = selectedImages.length > 0 ? selectedImages[0] : null;
        result = await createItem(itemCreateData, itemCreateImageFile);
        if (result.success && result.data) {
          // Show Dynamic Island notification
          MarketplaceNotifications.itemListed(result.data.title);
          
          setUserItems(prev => [result.data, ...prev]);
        }
      }

      try {
        showMessage(`Item ${id ? 'updated' : 'created'} successfully!`, 'success');
      } catch (msgError) {
        console.error('Error showing success message:', msgError);
      }
      
      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setSelectedItem(null);
      setEditFormData({});
      resetImageStates();

    } catch (error) {
      console.error('Submit error:', error);
      try {
        showMessage(error.message || 'Failed to save changes', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to save changes'}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteItem(itemToDelete.id);
      
      // Show Dynamic Island notification
      MarketplaceNotifications.itemDeleted();
      
      setUserItems(prev => prev.filter(item => item.id !== itemToDelete.id));

      try {
        showMessage('Item deleted successfully!', 'success');
      } catch (msgError) {
        console.error('Error showing success message:', msgError);
      }
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);

    } catch (error) {
      console.error('Delete error:', error);
      try {
        showMessage(error.message || 'Failed to delete item', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to delete item'}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserItems();
    }
  }, [isAuthenticated, user]);

  const clearSuccess = () => setSuccess('');
  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your items...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your items.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-medium transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/profile" 
              className={`p-2 rounded-xl border ${theme.border} hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-3xl font-bold ${theme.text} flex items-center gap-3`}>
                <ShoppingBag className="w-8 h-8 text-green-500" />
                My Items
              </h1>
              <p className={`${theme.textMuted} mt-1`}>Manage your marketplace listings</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Item
          </motion.button>
        </div>

        {/* Success/Error Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-100 border border-red-200 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700">{error}</span>
                <button onClick={clearError} className="ml-auto">
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-xl bg-green-100 border border-green-200 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-700">{success}</span>
                <button onClick={clearSuccess} className="ml-auto">
                  <X className="w-4 h-4 text-green-500" />
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          {isLoadingUserData ? (
            <div className="flex justify-center py-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max">
              {userItems.length > 0 ? (
                userItems.map((item) => (
                  <ItemCard key={item.id} item={item} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No Items Listed</h3>
                  <p className={`${theme.textMuted} mb-6`}>You haven't listed any items for sale yet.</p>
                  <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    List Your First Item
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      <SmallFooter />

      {/* Edit/Create Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${theme.card} rounded-2xl border ${theme.border} shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden`}
          >
            {/* Modal Header */}
            <div className={`flex items-center justify-between p-6 border-b ${theme.border}`}>
              <h2 className={`text-xl font-bold ${theme.text}`}>
                {selectedItem?.id ? 'Edit Item' : 'Create New Item'}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                  resetImageStates();
                }}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Item Title *
                    </label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="e.g., iPhone 13 Pro Max"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="25000"
                      required
                    />
                  </div>
                </div>

                {/* Category and Condition */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Category *
                    </label>
                    <select
                      value={editFormData.category || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="electronics">Electronics</option>
                      <option value="textbooks">Textbooks</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="sports">Sports Equipment</option>
                      <option value="musical">Musical Instruments</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Condition *
                    </label>
                    <select
                      value={editFormData.condition || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    >
                      <option value="">Select condition</option>
                      <option value="new">Brand New</option>
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Location *
                    </label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="Campus Area"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Description
                  </label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none`}
                    placeholder="Describe your item, condition details, reason for selling, etc."
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editFormData.contact_phone || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contact_phone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                        Email
                      </label>
                      <input
                        type="email"
                        value={editFormData.contact_email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contact_email: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={editFormData.contact_instagram || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contact_instagram: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Item Photo
                  </label>
                  <div className={`border-2 border-dashed ${theme.border} rounded-xl p-6 text-center transition-colors hover:border-green-400`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setSelectedImages([file]);
                          setImagePreviews([URL.createObjectURL(file)]);
                        }
                      }}
                      className="hidden"
                      id="item-image"
                    />
                    <label htmlFor="item-image" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className={`text-sm ${theme.textMuted} mb-2`}>
                        Click to upload item photo
                      </p>
                      <p className={`text-xs ${theme.textMuted}`}>
                        PNG, JPG, JPEG up to 10MB
                      </p>
                    </label>
                  </div>
                  
                  {/* Image Preview */}
                  {(imagePreviews.length > 0 || existingImages.length > 0) && (
                    <div className="mt-4">
                      {existingImages.map((image, index) => (
                        <div key={`existing-${index}`} className="relative inline-block mr-4">
                          <img 
                            src={image} 
                            alt="Current item"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setExistingImages([]);
                              setEditFormData({
                                ...editFormData,
                                imagesToDelete: [image]
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative inline-block">
                          <img 
                            src={preview} 
                            alt="New item"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(preview);
                              setImagePreviews([]);
                              setSelectedImages([]);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className={`flex items-center justify-end gap-4 p-6 border-t ${theme.border}`}>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                  resetImageStates();
                }}
                className={`px-6 py-2 rounded-xl border ${theme.border} ${theme.textMuted} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !editFormData.title || !editFormData.price || !editFormData.category || !editFormData.condition}
                className={`px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    {selectedItem?.id ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  selectedItem?.id ? 'Update Item' : 'Create Item'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`${theme.card} rounded-2xl border ${theme.border} shadow-2xl w-full max-w-md`}
          >
            <div className="p-6">
              <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
                Delete Item Listing
              </h3>
              <p className={`${theme.textMuted} mb-6`}>
                Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.textMuted} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2`}
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    'Delete Item'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyItemsPage;