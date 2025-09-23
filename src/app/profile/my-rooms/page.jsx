'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, Home, Plus, AlertCircle, CheckCircle, X,
  MapPin, Building, Sofa, Users, Phone, Mail, Edit3, Trash2, 
  Wifi, Car, Utensils, Waves, Dumbbell, Shield, Zap, Star, Eye, Heart,
  Calendar, Camera, ChevronLeft, ChevronRight, ExternalLink, Share2
} from 'lucide-react';

// Import API functions
import { 
  fetchMyRooms,   
  createRoom, 
  updateRoom, 
  deleteRoom, 
  prepareRoomFormData 
} from '../../lib/api/housing';

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

// Enhanced amenity icons mapping
const amenityIcons = {
  wifi: Wifi, internet: Wifi, 'wi-fi': Wifi,
  parking: Car, 'car parking': Car,
  kitchen: Utensils, 'shared kitchen': Utensils,
  pool: Waves, swimming: Waves,
  gym: Dumbbell, fitness: Dumbbell,
  security: Shield, 'security guard': Shield,
  electricity: Zap, power: Zap,
  furnished: Sofa, furniture: Sofa
};

// Helper function to safely render contact information
const renderContactInfo = (contactInfo) => {
  if (!contactInfo) return null;
  
  if (typeof contactInfo === 'string') {
    return contactInfo;
  }
  
  if (typeof contactInfo === 'object') {
    const parts = [];
    if (contactInfo.mobile) parts.push(`${contactInfo.mobile}`);
    if (contactInfo.email) parts.push(`${contactInfo.email}`);
    if (contactInfo.instagram) parts.push(`${contactInfo.instagram.startsWith('@') ? contactInfo.instagram : '@' + contactInfo.instagram}`);
    return parts.length > 0 ? parts.join(' • ') : 'Contact available';
  }
  
  return 'Contact available';
};

// Image carousel component
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="text-center">
          <Home className="w-16 h-16 text-blue-400 mx-auto mb-2" />
          <span className="text-sm text-gray-500">No images</span>
        </div>
      </div>
    );
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative w-full h-full group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={images[currentIndex]} 
        alt={`${title} - Image ${currentIndex + 1}`}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Navigation arrows */}
      {images.length > 1 && isHovered && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
          <Camera className="w-3 h-3" />
          {currentIndex + 1}/{images.length}
        </div>
      )}
      
      {/* Image dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ModernRoomCard = ({ room, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const price = room.rent || room.price || room.monthly_rent || room.monthlyRent || room.roomPrice || room.rental_price;
  const images = room.photos ? (Array.isArray(room.photos) ? room.photos : [room.photos]) : 
               room.image_url ? [room.image_url] : 
               room.image ? [room.image] : [];

  const truncatedDescription = room.description?.length > 80 ? 
    `${room.description.substring(0, 80)}...` : room.description;

  // Handle edit room
  const handleEdit = () => {
    if (onEdit) {
      onEdit(room);
    } else {
      // Fallback: navigate to edit page or show edit modal
      window.location.href = `/housing/edit/${room.id || room._id}`;
    }
  };

  // Handle delete room
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${room.title}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteRoom(room.id || room._id);
      if (result.success) {
        showMessage?.(result.message || 'Room deleted successfully', 'success');
        if (onDelete) {
          onDelete(room);
        } else if (onUpdate) {
          onUpdate(); // Refresh the list
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage?.(error.message || 'Failed to delete room', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.title,
          text: `Check out this room: ${room.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={`group relative ${theme.card} rounded-2xl overflow-hidden border ${theme.border} 
      shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
      before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-500/5 before:to-purple-500/5 
      before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-500 before:pointer-events-none`}>
      
      {/* Image Section */}
      <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
        <ImageCarousel images={images} title={room.title} />
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${
            room.status === 'available' 
              ? 'bg-green-500/90 text-white border-green-400/30 shadow-lg shadow-green-500/25' 
              : 'bg-red-500/90 text-white border-red-400/30 shadow-lg shadow-red-500/25'
          }`}>
            {room.status || 'Available'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className={`p-2 rounded-full backdrop-blur-sm border transition-all duration-200 hover:scale-110 ${
              isLiked 
                ? 'bg-red-500/90 text-white border-red-400/30' 
                : 'bg-white/90 text-gray-600 border-white/30 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/90 text-gray-600 border border-white/30 
              backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-white/20">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">₹{price || 'N/A'}</span>
              <span className="text-sm text-gray-600">/month</span>
            </div>
          </div>
        </div>

        {/* Area Badge */}
        {room.area && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-blue-500/90 text-white px-3 py-1.5 rounded-xl text-sm font-medium 
              backdrop-blur-sm border border-blue-400/30 shadow-lg">
              {room.area} sq ft
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title and Rating */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-bold text-lg leading-tight ${theme.text} group-hover:text-blue-600 transition-colors`}>
              {room.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {room.description && (
          <div className="space-y-1">
            <p className={`text-sm leading-relaxed ${theme.textMuted}`}>
              {showFullDescription ? room.description : truncatedDescription}
            </p>
            {room.description?.length > 80 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}
        

        {/* Contact Information */}
        {(room.contact_info || room.phone || room.email) && (
          <div className="space-y-2 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
            <h4 className={`text-sm font-semibold ${theme.text} flex items-center gap-2`}>
              <div className="w-1 h-4 bg-green-600 rounded-full"></div>
              Contact Info
            </h4>
            <div className="space-y-2">
              {(room.phone || room.contact_info) && (
                <div className={`${theme.textMuted} flex items-center gap-3 text-sm`}>
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="font-mono">{room.phone || renderContactInfo(room.contact_info)}</span>
                </div>
              )}
              {room.email && (
                <div className={`${theme.textMuted} flex items-center gap-3 text-sm`}>
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="font-mono break-all">{room.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`text-xs ${theme.textMuted}`}>
              {room.created_at ? new Date(room.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Recently posted'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              disabled={isDeleting}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl 
                transition-all duration-200 hover:scale-110 group/btn disabled:opacity-50"
              title="Edit Room"
            >
              <Edit3 className="w-4 h-4 text-blue-600 group-hover/btn:scale-110 transition-transform" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl 
                transition-all duration-200 hover:scale-110 group/btn disabled:opacity-50"
              title={isDeleting ? "Deleting..." : "Delete Room"}
            >
              <Trash2 className={`w-4 h-4 text-red-500 group-hover/btn:scale-110 transition-transform ${
                isDeleting ? 'animate-spin' : ''
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
    </div>
  );
};

const MyRoomsPage = () => {
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
  const [userRooms, setUserRooms] = useState([]);
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

  // Loading states for operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset image states helper function
  const resetImageStates = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  // Theme configuration
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
  };

  // Load user rooms data
  const loadUserRooms = async () => {
    if (!user?.id) return;
    
    setIsLoadingUserData(true);
    try {
      const result = await fetchMyRooms({ 
        limit: 50, 
        cache: true, 
        cacheTTL: 2 * 60 * 1000
      });
      
      if (result?.success) {
        setUserRooms(result.data || []);
      } else {
        setUserRooms([]);
      }
    } catch (error) {
      try {
        showMessage('Failed to load rooms data', 'error');
      } catch (msgError) {
        alert('Error: Failed to load rooms data');
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

  const removeExistingImage = (index) => {
    const newExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExisting);
    setEditFormData(prev => ({
      ...prev,
      imagesToDelete: [...(prev.imagesToDelete || []), existingImages[index]]
    }));
  };


  const handleEdit = (room) => {
    setSelectedItem({ ...room, type: 'rooms' });
    const formData = {
      ...room,
      contact_phone: room.contact_info?.mobile || '',
      contact_email: room.contact_info?.email || '',
      contact_instagram: room.contact_info?.instagram || '',
      contact_info: room.contact_info || {}
    };
    setEditFormData(formData);
    
    if (room.photos) {
      const images = Array.isArray(room.photos) ? room.photos : [room.photos];
      setExistingImages(images.filter(Boolean));
    } else if (room.image) {
      setExistingImages([room.image]);
    } else {
      setExistingImages([]);
    }
    
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = (room) => {
    setItemToDelete({ ...room, type: 'rooms' });
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem({ type: 'rooms' });
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
        // Edit existing room
        const roomUpdateData = {
          ...editFormData,
          existingImages: existingImages,
          imagesToDelete: editFormData.imagesToDelete || [],
          contact_info: formatContactInfo(editFormData)
        };
        const roomFormData = prepareRoomFormData(roomUpdateData, selectedImages);
        result = await updateRoom(id, roomFormData);
        
        if (result.success && result.data) {
          setUserRooms(prev => prev.map(room => room.id === id ? result.data : room));
        }
      } else {
        // Create new room
        const roomCreateData = {
          ...editFormData,
          contact_info: formatContactInfo(editFormData)
        };
        const roomCreateFormData = prepareRoomFormData(roomCreateData, selectedImages);
        result = await createRoom(roomCreateFormData);
        if (result.success && result.data) {
          setUserRooms(prev => [result.data, ...prev]);
        }
      }

      try {
        showMessage(`Room ${id ? 'updated' : 'created'} successfully!`, 'success');
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
      await deleteRoom(itemToDelete.id);
      setUserRooms(prev => prev.filter(room => room.id !== itemToDelete.id));

      try {
        showMessage('Room deleted successfully!', 'success');
      } catch (msgError) {
        console.error('Error showing success message:', msgError);
      }
      
      setIsDeleteModalOpen(false);
      setItemToDelete(null);

    } catch (error) {
      console.error('Delete error:', error);
      try {
        showMessage(error.message || 'Failed to delete room', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to delete room'}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserRooms();
    }
  }, [isAuthenticated, user]);

  const clearSuccess = () => setSuccess('');
  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your rooms...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your rooms.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all duration-300 transform hover:scale-105"
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                <Home className="w-8 h-8 text-blue-500" />
                My Rooms
              </h1>
              <p className={`${theme.textMuted} mt-1`}>Manage your room listings</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Room
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
                className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max">
              {userRooms.length > 0 ? (
                userRooms.map((room) => (
                  <ModernRoomCard key={room.id} room={room} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <Home className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No Rooms Listed</h3>
                  <p className={`${theme.textMuted} mb-6`}>You haven't listed any rooms yet. Start by posting your first room listing.</p>
                  <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    List Your First Room
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
                {selectedItem?.id ? 'Edit Room' : 'Create New Room'}
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
                      Room Title *
                    </label>
                    <input
                      type="text"
                      value={editFormData.title || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="e.g., Cozy single room near campus"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Monthly Rent (₹) *
                    </label>
                    <input
                      type="number"
                      value={editFormData.rent || editFormData.price || editFormData.monthly_rent || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, rent: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="15000"
                      required
                    />
                  </div>
                </div>

                {/* Location and Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Location *
                    </label>
                    <input
                      type="text"
                      value={editFormData.location || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                      placeholder="e.g., Sector 62, Noida"
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
                    className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none`}
                    placeholder="Describe your room, amenities, nearby facilities, house rules, etc."
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
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
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
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                    Room Photos
                  </label>
                  <div className={`border-2 border-dashed ${theme.border} rounded-xl p-6 text-center transition-colors hover:border-blue-400`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setSelectedImages(files);
                        // Create preview URLs
                        const previews = files.map(file => URL.createObjectURL(file));
                        setImagePreviews(previews);
                      }}
                      className="hidden"
                      id="room-images"
                    />
                    <label htmlFor="room-images" className="cursor-pointer">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className={`text-sm ${theme.textMuted} mb-2`}>
                        Click to upload room photos
                      </p>
                      <p className={`text-xs ${theme.textMuted}`}>
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </label>
                  </div>
                  
                  {/* Image Previews */}
                  {(imagePreviews.length > 0 || existingImages.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {existingImages.map((image, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img 
                            src={image} 
                            alt={`Room ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = existingImages.filter((_, i) => i !== index);
                              setExistingImages(newImages);
                              setEditFormData({
                                ...editFormData,
                                imagesToDelete: [...(editFormData.imagesToDelete || []), image]
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {imagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img 
                            src={preview} 
                            alt={`New ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(preview);
                              const newPreviews = imagePreviews.filter((_, i) => i !== index);
                              const newFiles = selectedImages.filter((_, i) => i !== index);
                              setImagePreviews(newPreviews);
                              setSelectedImages(newFiles);
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
                disabled={isSubmitting || !editFormData.title || !editFormData.location}
                className={`px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
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
                  selectedItem?.id ? 'Update Room' : 'Create Room'
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
                Delete Room Listing
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
                    'Delete Room'
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

export default MyRoomsPage;