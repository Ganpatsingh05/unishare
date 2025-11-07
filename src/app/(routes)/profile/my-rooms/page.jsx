'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, Home, Plus, AlertCircle, CheckCircle, X, Search,
  MapPin, Building, Sofa, Users, Phone, Mail, Edit3, Trash2, 
  Wifi, Car, Utensils, Waves, Dumbbell, Shield, Zap, Star, Eye, Heart,
  Calendar, Camera, ChevronLeft, ChevronRight, ExternalLink, Share2
} from "lucide-react";

// Import API functions
import { 
  fetchMyRooms,   
  createRoom, 
  updateRoom, 
  deleteRoom, 
  prepareRoomFormData 
} from "./../../../lib/api/housing";

// Import contexts
import { useAuth, useUI, useUniShare } from "./../../../lib/contexts/UniShareContext";

// Import components
import Footer from "./../../../_components/layout/Footer";
import SmallFooter from "./../../../_components/layout/SmallFooter";


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

// Enhanced Image carousel component with perfect overlay positioning
const ImageCarousel = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="text-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 mx-auto w-fit">
            <Home className="w-12 h-12" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">No images available</span>
        </div>
      </div>
    );
  }

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setImageLoaded(false);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageLoaded(false);
  };

  return (
    <div 
      className="relative w-full h-full group overflow-hidden bg-gray-100 dark:bg-gray-800"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img 
          src={images[currentIndex]} 
          alt={`${title} - Image ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        
        {/* Loading shimmer effect */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        )}
      </div>
      
      {/* Subtle gradient overlay for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Enhanced Navigation arrows - only show on hover and when multiple images */}
      {images.length > 1 && isHovered && (
        <>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-2.5 rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 z-10 border border-white/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 hover:bg-black text-white p-2.5 rounded-full shadow-xl backdrop-blur-sm transition-all duration-200 z-10 border border-white/20"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </>
      )}
      
      {/* Image counter - only show when multiple images */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/80 text-white px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm border border-white/20">
          {currentIndex + 1}/{images.length}
        </div>
      )}
      
      {/* Image dots - only show for reasonable number of images */}
      {images.length > 1 && images.length <= 8 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
          {images.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
                setImageLoaded(false);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-white/60 hover:bg-white/90'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ModernRoomCard = ({ room, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const { darkMode } = useUI(); // Add this line to get darkMode from context
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const price = room.rent || room.price || room.monthly_rent || room.monthlyRent || room.roomPrice || room.rental_price;
  const images = room.photos ? (Array.isArray(room.photos) ? room.photos : [room.photos]) : 
               room.image_url ? [room.image_url] : 
               room.image ? [room.image] : [];

  const truncatedDescription = room.description?.length > 100 ? 
    `${room.description.substring(0, 100)}...` : room.description;

  // Handle edit room
  const handleEdit = () => {
    console.log('ModernRoomCard handleEdit called');
    console.log('onEdit prop:', typeof onEdit, onEdit);
    console.log('room data:', room);
    
    if (onEdit) {
      console.log('Calling onEdit with room:', room);
      onEdit(room);
    } else {
      console.log('No onEdit prop, using fallback');
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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative ${theme.cardBg} rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
        transition-all duration-500 transform hover:-translate-y-1 border ${
          darkMode
            ? 'border-gray-700 hover:border-blue-500/50' 
            : 'border-gray-200 hover:border-blue-300'
        } max-w-sm mx-auto`}
    >
      {/* Enhanced gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 
        group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 
        transition-all duration-700 pointer-events-none rounded-2xl" />
      
      {/* Image Section with enhanced styling */}
      <div className={`aspect-[4/3] bg-gradient-to-br ${theme.imageBg} relative overflow-hidden`}>
        <ImageCarousel images={images} title={room.title} />
        
        {/* Enhanced Status Badge - Top Left */}
        <div className="absolute top-3 left-3 z-20">
          <motion.span 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-lg border ${
              room.status === 'available' 
                ? 'bg-emerald-500/95 text-white border-emerald-400/40 shadow-emerald-500/25' 
                : 'bg-rose-500/95 text-white border-rose-400/40 shadow-rose-500/25'
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              room.status === 'available' ? 'bg-emerald-200' : 'bg-rose-200'
            } animate-pulse`} />
            {room.status === 'available' ? 'Available' : 'Occupied'}
          </motion.span>
        </div>
        

        {/* Area Badge - Bottom Right (only if area exists) */}
        {room.area && (
          <div className="absolute bottom-3 right-3 z-20">
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg 
                text-sm font-bold backdrop-blur-md shadow-lg border border-blue-400/20"
            >
              {room.area} sq ft
            </motion.span>
          </div>
        )}

        {/* Location Badge - Bottom Center (on hover) */}
        {room.location && (
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 
            transition-all duration-300 z-20">
            <span className="bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium 
              backdrop-blur-sm flex items-center gap-1.5 max-w-[200px]">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">
                {room.location.length > 25 ? `${room.location.substring(0, 25)}...` : room.location}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Enhanced Content Section */}
      <div className="p-6 space-y-5">
        {/* Title Section with improved typography */}
        <div className="space-y-3">
          <h3 className={`font-bold text-xl leading-tight ${theme.text} line-clamp-2`}>
            {room.title}
          </h3>
          
          {/* Location with icon */}
          {room.location && (
            <div className={`flex items-center gap-2 ${theme.textMuted}`}>
              <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{room.location}</span>
            </div>
          )}
        </div>

        {/* Enhanced Description */}
        {room.description && (
          <div className="space-y-2">
            <p className={`text-sm leading-relaxed ${theme.textMuted} line-clamp-3`}>
              {showFullDescription ? room.description : truncatedDescription}
            </p>
            {room.description?.length > 100 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors 
                  hover:underline flex items-center gap-1"
              >
                {showFullDescription ? (
                  <>Show less <ChevronLeft className="w-3 h-3" /></>
                ) : (
                  <>Show more <ChevronRight className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        )}

        {/* Price Display - Moved to content area */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${theme.text}`}>
              ₹{price ? Number(price).toLocaleString('en-IN') : 'N/A'}
            </span>
            <span className={`text-base font-semibold ${theme.textMuted}`}>/month</span>
          </div>
          {room.area && (
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-lg 
              text-sm font-bold">
              {room.area} sq ft
            </span>
          )}
        </div>

        {/* Enhanced Contact Information */}
        {(room.contact_info || room.phone || room.email) && (
          <div className={`space-y-3 p-4 rounded-xl ${
            darkMode
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <h4 className={`text-sm font-bold ${theme.text} flex items-center gap-2`}>
              <Phone className="w-4 h-4 text-emerald-600" />
              Contact Information
            </h4>
            <div className="space-y-1 text-sm">
              {(room.phone || room.contact_info) && (
                <div className={`${theme.textMuted} flex items-center gap-2`}>
                  <span className="font-mono">{room.phone || renderContactInfo(room.contact_info)}</span>
                </div>
              )}
              {room.email && (
                <div className={`${theme.textMuted} flex items-center gap-2`}>
                  <Mail className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <span className="font-mono text-xs break-all">{room.email}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Enhanced Footer */}
        <div className={`flex items-center justify-between pt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-gray-400" />
            <span className={`text-xs ${theme.textMuted}`}>
              {room.created_at ? new Date(room.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }) : 'Recently posted'}
            </span>
          </div>
          
          <div className="flex items-center gap-3 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Edit button clicked!', room.title);
                handleEdit();
              }}
              disabled={isDeleting}
              className={`px-3 py-2 rounded-lg font-medium border-2 flex items-center gap-2 transition-all duration-200 disabled:opacity-50 relative z-20 ${
                darkMode
                  ? 'border-blue-500 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200' 
                  : 'border-blue-500 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700'
              }`}
              title="Edit Room"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-semibold">Edit</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Delete button clicked!', room.title);
                handleDelete();
              }}
              disabled={isDeleting}
              className={`px-3 py-2 rounded-lg font-medium border-2 flex items-center gap-2 transition-all duration-200 disabled:opacity-50 relative z-20 ${
                darkMode
                  ? 'border-rose-500 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200' 
                  : 'border-rose-500 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700'
              }`}
              title={isDeleting ? "Deleting..." : "Delete Room"}
            >
              <Trash2 className={`w-4 h-4 ${isDeleting ? 'animate-spin' : ''}`} />
              <span className="text-sm font-semibold">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
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
  
  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Reset image states helper function
  const resetImageStates = () => {
    setSelectedImages([]);
    setImagePreviews([]);
    setExistingImages([]);
  };

  // Enhanced theme configuration with better color schemes
  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    accent: darkMode ? 'from-blue-400 to-purple-400' : 'from-blue-600 to-purple-600',
    buttonPrimary: darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700',
    buttonSecondary: darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200',
    cardBg: darkMode ? 'bg-gray-800' : 'bg-white',
    imageBg: darkMode ? 'from-gray-800 via-gray-700 to-gray-800' : 'from-gray-100 via-gray-50 to-gray-100',
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
    console.log('Main handleEdit called with room:', room);
    setSelectedItem({ ...room, type: 'rooms' });
    const formData = {
      ...room,
      contact_phone: room.contact_info?.mobile || '',
      contact_email: room.contact_info?.email || '',
      contact_instagram: room.contact_info?.instagram || '',
      contact_info: room.contact_info || {},
      beds: room.beds || '1',
      move_in_date: room.move_in_date ? new Date(room.move_in_date).toISOString().split('T')[0] : ''
    };
    console.log('Setting edit form data:', formData);
    setEditFormData(formData);
    
    if (room.photos) {
      const images = Array.isArray(room.photos) ? room.photos : [room.photos];
      setExistingImages(images.filter(Boolean));
    } else if (room.image) {
      setExistingImages([room.image]);
    } else {
      setExistingImages([]);
    }
    
    console.log('Opening edit modal...');
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

  // Frontend validation function
  const validateForm = () => {
    const errors = {};
    
    // Title validation
    if (!editFormData.title?.trim()) {
      errors.title = 'Room title is required';
    } else if (editFormData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (editFormData.title.trim().length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    // Rent validation
    const rent = editFormData.rent || editFormData.price || editFormData.monthly_rent;
    if (!rent) {
      errors.rent = 'Monthly rent is required';
    } else if (isNaN(rent) || Number(rent) <= 0) {
      errors.rent = 'Rent must be a valid positive number';
    } else if (Number(rent) < 1000) {
      errors.rent = 'Rent must be at least ₹1,000';
    } else if (Number(rent) > 1000000) {
      errors.rent = 'Rent seems too high (max ₹10,00,000)';
    }

    // Location validation
    if (!editFormData.location?.trim()) {
      errors.location = 'Location is required';
    } else if (editFormData.location.trim().length < 3) {
      errors.location = 'Location must be at least 3 characters long';
    }

    // Beds validation
    if (!editFormData.beds) {
      errors.beds = 'Number of beds is required';
    }

    // Move-in date validation
    if (!editFormData.move_in_date) {
      errors.move_in_date = 'Move-in date is required';
    } else {
      const selectedDate = new Date(editFormData.move_in_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.move_in_date = 'Move-in date cannot be in the past';
      }
      
      // Check if date is too far in future (2 years)
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() + 2);
      if (selectedDate > maxDate) {
        errors.move_in_date = 'Move-in date cannot be more than 2 years in the future';
      }
    }

    // Description validation (optional but if provided, check length)
    if (editFormData.description && editFormData.description.length > 1000) {
      errors.description = 'Description must be less than 1000 characters';
    }

    // Contact validation
    if (editFormData.contact_phone && !/^[6-9]\d{9}$/.test(editFormData.contact_phone)) {
      errors.contact_phone = 'Please enter a valid 10-digit phone number';
    }

    if (editFormData.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.contact_email)) {
      errors.contact_email = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedItem) return;

    // Run frontend validation first
    if (!validateForm()) {
      try {
        showMessage('Please fix the errors in the form', 'error');
      } catch (msgError) {
        console.error('Error showing validation message:', msgError);
      }
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { id } = selectedItem;
      let result;

      if (id) {
        // Edit existing room
        const roomUpdateData = {
          ...editFormData,
          // Ensure move_in_date is in proper format (YYYY-MM-DD)
          move_in_date: editFormData.move_in_date,
          existingImages: existingImages.length > 0 ? existingImages : [],
          imagesToDelete: editFormData.imagesToDelete || [],
          contact_info: formatContactInfo(editFormData)
        };
        
        // Debug: Log the data being sent
        console.log('Room update data:', {
          title: roomUpdateData.title,
          move_in_date: roomUpdateData.move_in_date,
          existingImages: roomUpdateData.existingImages,
          beds: roomUpdateData.beds,
          rent: roomUpdateData.rent,
          location: roomUpdateData.location
        });
        
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
      setFormErrors({});
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
    <div className={`min-h-screen ${theme.bg}`}>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Simplified Clean Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {/* Left: Simple Title */}
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${theme.accent} text-white shadow-lg`}>
                <Home className="w-6 h-6" />
              </div>
              <div>
                <h1 className={`text-2xl sm:text-3xl font-bold ${theme.text}`}>
                  My Rooms
                </h1>
                <p className={`${theme.textMuted} text-sm`}>
                  {userRooms.length} room{userRooms.length !== 1 ? 's' : ''} listed
                </p>
              </div>
            </div>

            {/* Right: Simple Add Button */}
            <button
              onClick={handleCreate}
              className={`px-4 py-2 bg-gradient-to-r ${theme.accent} text-white rounded-xl 
                hover:shadow-lg transition-all duration-300 font-medium text-sm
                flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          </div>
        </div>

        {/* Simplified Success/Error Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className={`mb-4 p-4 rounded-xl ${
                darkMode ? 'bg-red-900/20 border border-red-800 text-red-300' : 'bg-red-100 border border-red-200 text-red-800'
              } flex items-center gap-3`}>
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
                <button onClick={clearError} className="ml-auto p-1 hover:bg-red-200 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {success && (
              <div className={`mb-4 p-4 rounded-xl ${
                darkMode ? 'bg-green-900/20 border border-green-800 text-green-300' : 'bg-green-100 border border-green-200 text-green-800'
              } flex items-center gap-3`}>
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{success}</span>
                <button onClick={clearSuccess} className="ml-auto p-1 hover:bg-green-200 rounded-full transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Simplified Content Grid */}
        <div className="mt-6">
          {isLoadingUserData ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className={`w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mb-4`} />
              <p className={`${theme.textMuted}`}>Loading rooms...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRooms.length > 0 ? (
                userRooms.map((room) => (
                  <div key={room.id}>
                    <ModernRoomCard 
                      room={room} 
                      theme={theme} 
                      onEdit={handleEdit} 
                      onDelete={handleDeleteConfirm} 
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg max-w-md mx-auto`}>
                    <Home className={`w-16 h-16 ${theme.textMuted} mx-auto mb-4`} />
                    <h3 className={`text-xl font-bold ${theme.text} mb-2`}>
                      No Rooms Listed Yet
                    </h3>
                    <p className={`${theme.textMuted} mb-6 text-sm`}>
                      Start by listing your first room to earn extra income!
                    </p>
                    <button
                      onClick={handleCreate}
                      className={`w-full px-4 py-2 bg-gradient-to-r ${theme.accent} text-white 
                        rounded-xl hover:opacity-90 transition-opacity font-medium text-sm
                        flex items-center justify-center gap-2`}
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Room
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <SmallFooter />

      {/* Enhanced Edit/Create Modal */}
      {(isEditModalOpen || isCreateModalOpen) && (
        <div className="fixed rounded-3xl inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${theme.card} rounded-3xl border-2 ${theme.border} shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col backdrop-blur-sm mx-4`}
          >
            {/* Enhanced Modal Header */}
            <div className={`flex items-center justify-between p-8 border-b-2 ${theme.border} bg-gradient-to-r ${
              darkMode ? 'from-gray-800 to-gray-700' : 'from-white to-gray-50'
            }`}>
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.accent} text-white shadow-lg`}>
                  {selectedItem?.id ? <Edit3 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${theme.text}`}>
                    {selectedItem?.id ? 'Edit Room Listing' : 'Create New Room Listing'}
                  </h2>
                  <p className={`${theme.textMuted} mt-1`}>
                    {selectedItem?.id ? 'Update your room details' : 'Share your space with students'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                  setFormErrors({});
                  resetImageStates();
                }}
                className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-all duration-300 ${theme.textMuted}`}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Enhanced Modal Body */}
            <div 
              className="flex-1 overflow-y-auto scroll-smooth relative"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-8 space-y-8 pb-12">
                {/* Enhanced Basic Information Section */}
                <div className="space-y-6">
                  <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-3 pb-4 border-b ${theme.border}`}>
                    <Building className="w-6 h-6 text-blue-500" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text} flex items-center gap-2`}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Room Title *
                      </label>
                      <input
                        type="text"
                        value={editFormData.title || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, title: e.target.value });
                          // Clear error when user starts typing
                          if (formErrors.title) {
                            setFormErrors({ ...formErrors, title: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.title 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="e.g., Cozy single room near campus"
                        required
                      />
                      {formErrors.title && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.title}
                        </motion.p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text} flex items-center gap-2`}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Monthly Rent (₹) *
                      </label>
                      <input
                        type="number"
                        value={editFormData.rent || editFormData.price || editFormData.monthly_rent || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, rent: e.target.value });
                          if (formErrors.rent) {
                            setFormErrors({ ...formErrors, rent: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.rent 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="15000"
                        required
                      />
                      {formErrors.rent && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.rent}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text} flex items-center gap-2`}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Location *
                      </label>
                      <input
                        type="text"
                        value={editFormData.location || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, location: e.target.value });
                          if (formErrors.location) {
                            setFormErrors({ ...formErrors, location: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.location 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="e.g., Sector 62, Noida"
                        required
                      />
                      {formErrors.location && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.location}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text} flex items-center gap-2`}>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Number of Beds *
                      </label>
                      <select
                        value={editFormData.beds || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, beds: e.target.value });
                          if (formErrors.beds) {
                            setFormErrors({ ...formErrors, beds: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.beds 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          font-medium`}
                        required
                      >
                        <option value="">Select number of beds</option>
                        <option value="1">1 Bed</option>
                        <option value="2">2 Beds</option>
                        <option value="3">3 Beds</option>
                        <option value="4">4 Beds</option>
                        <option value="5+">5+ Beds</option>
                      </select>
                      {formErrors.beds && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.beds}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`block text-sm font-bold ${theme.text} flex items-center gap-2`}>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Move-in Date *
                    </label>
                    <input
                      type="date"
                      value={editFormData.move_in_date || ''}
                      onChange={(e) => {
                        setEditFormData({ ...editFormData, move_in_date: e.target.value });
                        if (formErrors.move_in_date) {
                          setFormErrors({ ...formErrors, move_in_date: '' });
                        }
                      }}
                      min={new Date().toISOString().split('T')[0]} // Prevent past dates
                      className={`w-full px-5 py-4 rounded-2xl border-2 ${
                        formErrors.move_in_date 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                      } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                        placeholder-gray-400 font-medium`}
                      required
                    />
                    {formErrors.move_in_date && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm font-medium flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {formErrors.move_in_date}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Enhanced Description Section */}
                <div className="space-y-4">
                  <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-3 pb-4 border-b ${theme.border}`}>
                    <Sofa className="w-6 h-6 text-purple-500" />
                    Description
                  </h3>
                  <div className="space-y-2">
                    <label className={`block text-sm font-bold ${theme.text}`}>
                      Room Description
                    </label>
                    <textarea
                      value={editFormData.description || ''}
                      onChange={(e) => {
                        setEditFormData({ ...editFormData, description: e.target.value });
                        if (formErrors.description) {
                          setFormErrors({ ...formErrors, description: '' });
                        }
                      }}
                      rows={5}
                      className={`w-full px-5 py-4 rounded-2xl border-2 ${
                        formErrors.description 
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                          : `${theme.border} focus:border-blue-500 focus:ring-blue-500/20`
                      } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                        resize-none placeholder-gray-400 font-medium`}
                      placeholder="Describe your room, amenities, nearby facilities, house rules, etc. Be detailed to attract the right tenants!"
                    />
                    <div className="flex justify-between items-center">
                      {formErrors.description && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.description}
                        </motion.p>
                      )}
                      <span className={`text-sm ${
                        (editFormData.description || '').length > 800 ? 'text-red-500' : theme.textMuted
                      } ml-auto`}>
                        {(editFormData.description || '').length}/1000
                      </span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Contact Information Section */}
                <div className="space-y-6">
                  <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-3 pb-4 border-b ${theme.border}`}>
                    <Phone className="w-6 h-6 text-green-500" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text}`}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editFormData.contact_phone || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, contact_phone: e.target.value });
                          if (formErrors.contact_phone) {
                            setFormErrors({ ...formErrors, contact_phone: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.contact_phone 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-green-500 focus:ring-green-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="+91 98765 43210"
                      />
                      {formErrors.contact_phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.contact_phone}
                        </motion.p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={editFormData.contact_email || ''}
                        onChange={(e) => {
                          setEditFormData({ ...editFormData, contact_email: e.target.value });
                          if (formErrors.contact_email) {
                            setFormErrors({ ...formErrors, contact_email: '' });
                          }
                        }}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${
                          formErrors.contact_email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' 
                            : `${theme.border} focus:border-green-500 focus:ring-green-500/20`
                        } ${theme.card} ${theme.text} focus:ring-4 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="your@email.com"
                      />
                      {formErrors.contact_email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm font-medium flex items-center gap-2"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.contact_email}
                        </motion.p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className={`block text-sm font-bold ${theme.text}`}>
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        value={editFormData.contact_instagram || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, contact_instagram: e.target.value })}
                        className={`w-full px-5 py-4 rounded-2xl border-2 ${theme.border} ${theme.card} ${theme.text} 
                          focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 
                          placeholder-gray-400 font-medium`}
                        placeholder="@username"
                      />
                    </div>
                  </div>
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="space-y-6">
                  <h3 className={`text-xl font-bold ${theme.text} flex items-center gap-3 pb-4 border-b ${theme.border}`}>
                    <Camera className="w-6 h-6 text-pink-500" />
                    Room Photos
                  </h3>
                  <div className={`border-3 border-dashed ${theme.border} rounded-3xl p-8 text-center 
                    transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/10 group cursor-pointer`}>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setSelectedImages(files);
                        const previews = files.map(file => URL.createObjectURL(file));
                        setImagePreviews(previews);
                      }}
                      className="hidden"
                      id="room-images"
                    />
                    <label htmlFor="room-images" className="cursor-pointer block">
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white w-fit mx-auto mb-6 group-hover:scale-110 transition-transform">
                        <Camera className="w-12 h-12" />
                      </div>
                      <p className={`text-lg font-bold ${theme.text} mb-2`}>
                        Upload Room Photos
                      </p>
                      <p className={`text-sm ${theme.textMuted}`}>
                        Drag & drop images here or click to browse
                      </p>
                      <p className={`text-xs ${theme.textMuted} mt-2`}>
                        PNG, JPG, JPEG up to 10MB each • Maximum 10 photos
                      </p>
                    </label>
                  </div>
                  
                  {/* Enhanced Image Previews */}
                  {(imagePreviews.length > 0 || existingImages.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {existingImages.map((image, index) => (
                        <motion.div 
                          key={`existing-${index}`} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img 
                            src={image} 
                            alt={`Room ${index + 1}`}
                            className="w-full h-28 object-cover rounded-2xl border-2 border-gray-200 shadow-lg group-hover:shadow-xl transition-all"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => {
                              const newImages = existingImages.filter((_, i) => i !== index);
                              setExistingImages(newImages);
                              setEditFormData({
                                ...editFormData,
                                imagesToDelete: [...(editFormData.imagesToDelete || []), image]
                              });
                            }}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                          <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            Existing
                          </div>
                        </motion.div>
                      ))}
                      {imagePreviews.map((preview, index) => (
                        <motion.div 
                          key={`new-${index}`} 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative group"
                        >
                          <img 
                            src={preview} 
                            alt={`New ${index + 1}`}
                            className="w-full h-28 object-cover rounded-2xl border-2 border-blue-200 shadow-lg group-hover:shadow-xl transition-all"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(preview);
                              const newPreviews = imagePreviews.filter((_, i) => i !== index);
                              const newFiles = selectedImages.filter((_, i) => i !== index);
                              setImagePreviews(newPreviews);
                              setSelectedImages(newFiles);
                            }}
                            className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-2 hover:bg-rose-600 transition-colors shadow-lg"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                          <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                            New
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </form>
              
              {/* Scroll indicator gradient */}
              <div className={`absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t ${
                darkMode ? 'from-gray-800 to-transparent' : 'from-white to-transparent'
              }`}></div>
            </div>

            {/* Enhanced Modal Footer */}
            <div className={`flex items-center justify-end gap-6 p-8 border-t-2 ${theme.border} bg-gradient-to-r ${
              darkMode ? 'from-gray-800 to-gray-700' : 'from-white to-gray-50'
            }`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                  resetImageStates();
                }}
                className={`px-8 py-4 rounded-2xl border-2 ${theme.border} ${theme.textMuted} ${theme.buttonSecondary} 
                  transition-all duration-300 font-bold shadow-lg hover:shadow-xl`}
                disabled={isSubmitting}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !editFormData.title || !editFormData.location || !editFormData.beds || !editFormData.move_in_date}
                className={`px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                  hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 
                  disabled:cursor-not-allowed flex items-center gap-3 font-bold shadow-lg hover:shadow-2xl 
                  border-2 border-transparent hover:border-white/20`}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    {selectedItem?.id ? 'Updating Room...' : 'Creating Room...'}
                  </>
                ) : (
                  <>
                    {selectedItem?.id ? <Edit3 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    {selectedItem?.id ? 'Update Room' : 'Create Room'}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Enhanced Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`${theme.card} rounded-3xl border-2 ${theme.border} shadow-2xl w-full max-w-md backdrop-blur-sm overflow-hidden`}
          >
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white w-fit mx-auto mb-4">
                  <Trash2 className="w-8 h-8" />
                </div>
                <h3 className={`text-2xl font-bold ${theme.text} mb-2`}>
                  Delete Room Listing
                </h3>
                <p className={`${theme.textMuted} text-lg`}>
                  Are you sure you want to delete <span className="font-semibold text-rose-600">"{itemToDelete.title}"</span>?
                </p>
                <p className={`${theme.textMuted} text-sm mt-2`}>
                  This action cannot be undone and will permanently remove this listing.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setItemToDelete(null);
                  }}
                  className={`flex-1 px-6 py-4 rounded-2xl border-2 ${theme.border} ${theme.textMuted} 
                    ${theme.buttonSecondary} transition-all duration-300 font-bold shadow-lg hover:shadow-xl`}
                  disabled={isDeleting}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 text-white 
                    hover:from-rose-700 hover:to-red-700 transition-all duration-300 disabled:opacity-50 
                    flex items-center justify-center gap-3 font-bold shadow-lg hover:shadow-2xl 
                    border-2 border-transparent hover:border-white/20`}
                >
                  {isDeleting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Delete Room
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyRoomsPage;
