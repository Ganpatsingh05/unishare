'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowLeft, Car, Plus, AlertCircle, CheckCircle, X,
  Navigation, Calendar, Clock, DollarSign, Users, Phone, Mail, Edit3, Trash2
} from 'lucide-react';

// Import API functions
import { 
  getMyRides, 
  createRide, 
  updateRide, 
  deleteRide 
} from '../../lib/api/rideSharing';

// Import contexts
import { useAuth, useUI, useUniShare } from '../../lib/contexts/UniShareContext';

// Import components
import Footer from '../../_components/Footer';
import SmallFooter from '../../_components/SmallFooter';


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

const RideCard = ({ ride, theme, onEdit, onDelete, onUpdate, showMessage }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle edit ride
  const handleEdit = () => {
    if (onEdit) {
      onEdit(ride, 'rides');
    } else {
      // Fallback: navigate to edit page
      window.location.href = `/share-ride/edit/${ride.id || ride._id}`;
    }
  };

  // Handle delete ride
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ride from "${ride.from_location || ride.from}" to "${ride.to_location || ride.to}"? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteRide(ride.id || ride._id);
      if (result.success) {
        showMessage?.(result.message || 'Ride deleted successfully', 'success');
        if (onDelete) {
          onDelete(ride, 'rides');
        } else if (onUpdate) {
          onUpdate(); // Refresh the list
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      showMessage?.(error.message || 'Failed to delete ride', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className={`${theme.card} rounded-xl border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 p-4 space-y-3`}
  >
    <div className="flex items-center justify-between">
      <Car className="w-8 h-8 text-purple-500" />
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        ride.status === 'active' ? 'bg-purple-500 text-white' : 'bg-gray-500 text-white'
      }`}>
        {ride.status || 'active'}
      </span>
    </div>

    <div>
      <h3 className={`font-semibold ${theme.text} mb-2 flex items-center gap-2`}>
        <Navigation className="w-4 h-4 text-purple-500" />
        {ride.from_location || ride.from} → {ride.to_location || ride.to}
      </h3>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Calendar className="w-4 h-4 text-purple-500" />
          <span>{ride.date}</span>
        </div>
        <div className={`${theme.textMuted} flex items-center gap-2`}>
          <Clock className="w-4 h-4 text-purple-500" />
          <span>{ride.time}</span>
        </div>
      </div>
    </div>

    <div className="space-y-1">
      <span className={`text-sm font-medium ${theme.text}`}>Vehicle:</span>
      <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
        <Car className="w-4 h-4 text-purple-500" />
        <span>{ride.vehicle_info || ride.vehicle || ride.car_details || 'Vehicle info not available'}</span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
        <DollarSign className="w-4 h-4 text-purple-500" />
        <span className="font-medium">₹{ride.price_per_seat || ride.price}/seat</span>
      </div>
      {(ride.available_seats || ride.seats) && (
        <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
          <Users className="w-4 h-4 text-purple-500" />
          <span>{ride.available_seats || ride.seats} seats</span>
        </div>
      )}
    </div>

    {(ride.notes || ride.description || ride.additional_info) && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Additional Info:</span>
        <p className={`text-sm ${theme.textMuted} leading-relaxed`}>
          {ride.notes || ride.description || ride.additional_info}
        </p>
      </div>
    )}

    {(ride.contact_info || ride.phone || ride.email) && (
      <div className="space-y-1">
        <span className={`text-sm font-medium ${theme.text}`}>Contact:</span>
        <div className="space-y-1">
          {(ride.phone || ride.contact_info) && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Phone className="w-3 h-3 text-purple-500" />
              <span>{ride.phone || renderContactInfo(ride.contact_info)}</span>
            </div>
          )}
          {ride.email && (
            <div className={`${theme.textMuted} flex items-center gap-2 text-sm`}>
              <Mail className="w-3 h-3 text-purple-500" />
              <span>{ride.email}</span>
            </div>
          )}
        </div>
      </div>
    )}
    
    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
      <span className={`text-xs ${theme.textMuted}`}>
        Posted {ride.created_at ? new Date(ride.created_at).toLocaleDateString() : 'Recently'}
      </span>
      <div className="flex space-x-1">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleEdit}
          disabled={isDeleting}
          className={`p-1 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded transition-colors disabled:opacity-50`}
          title="Edit Ride"
        >
          <Edit3 className="w-3 h-3 text-purple-600" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50`}
          title={isDeleting ? "Deleting..." : "Delete Ride"}
        >
          <Trash2 className={`w-3 h-3 text-red-500 ${isDeleting ? 'animate-spin' : ''}`} />
        </motion.button>
      </div>
    </div>
  </motion.div>
  );
};

const MyRidesPage = () => {
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
  const [userRides, setUserRides] = useState([]);
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

  // Load user rides data
  const loadUserRides = async () => {
    if (!user?.id) return;
    
    setIsLoadingUserData(true);
    try {
      const result = await getMyRides({ 
        limit: 50, 
        cache: true, 
        cacheTTL: 2 * 60 * 1000
      });
      
      if (result?.success) {
        setUserRides(result.data || []);
      } else {
        setUserRides([]);
      }
    } catch (error) {
      try {
        showMessage('Failed to load rides data', 'error');
      } catch (msgError) {
        alert('Error: Failed to load rides data');
      }
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // CRUD handlers
  const handleEdit = (ride) => {
    setSelectedItem({ ...ride, type: 'rides' });
    const formData = {
      title: ride.title || '',
      driver_name: ride.driver_name || '',
      from_location: ride.from_location || '',
      to_location: ride.to_location || '',
      date: ride.date || '',
      time: ride.time || '',
      seats: ride.seats || '',
      price: ride.price || '',
      contact_phone: ride.contact_phone || '',
      contact_email: ride.contact_email || '',
      contact_instagram: ride.contact_instagram || '',
      contact_link: ride.contact_link || '',
      description: ride.description || '',
      vehicle_info: ride.vehicle_info || ride.car_details || ''
    };
    setEditFormData(formData);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = (ride) => {
    setItemToDelete({ ...ride, type: 'rides' });
    setIsDeleteModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedItem({ type: 'rides' });
    setEditFormData({});
    setIsCreateModalOpen(true);
  };

  const handleSubmit = async () => {
    if (isSubmitting || !editFormData.title || !editFormData.from_location || !editFormData.to_location) {
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (selectedItem?.id) {
        // Update existing ride
        response = await updateRide(selectedItem.id, editFormData);
        setUserRides(userRides.map(ride => 
          ride.id === selectedItem.id ? { ...ride, ...response } : ride
        ));
      } else {
        // Create new ride
        response = await createRide(editFormData);
        setUserRides([response, ...userRides]);
      }

      // Close modal and reset
      setIsEditModalOpen(false);
      setIsCreateModalOpen(false);
      setSelectedItem(null);
      setEditFormData({});
      
    } catch (error) {
      console.error('Error saving ride:', error);
      // Handle error (show toast notification)
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    setError('');

    try {
      await deleteRide(itemToDelete.id);
      setUserRides(prev => prev.filter(ride => ride.id !== itemToDelete.id));

      try {
        showMessage('Ride deleted successfully!', 'success');
      } catch (msgError) {
        console.error('Error showing success message:', msgError);
      }
      
      setItemToDelete(null);

    } catch (error) {
      console.error('Delete error:', error);
      try {
        showMessage(error.message || 'Failed to delete ride', 'error');
      } catch (msgError) {
        console.error('Error showing error message:', msgError);
        alert(`Error: ${error.message || 'Failed to delete ride'}`);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserRides();
    }
  }, [isAuthenticated, user]);

  const clearSuccess = () => setSuccess('');
  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your rides...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your rides.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium transition-all duration-300 transform hover:scale-105"
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
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                <Car className="w-8 h-8 text-purple-500" />
                My Rides
              </h1>
              <p className={`${theme.textMuted} mt-1`}>Manage your ride sharing listings</p>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post Ride
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
                className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 auto-rows-max">
              {userRides.length > 0 ? (
                userRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} theme={theme} onEdit={handleEdit} onDelete={handleDeleteConfirm} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <Car className="w-16 h-16 text-gray-400 mb-4" />
                  <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>No Rides Posted</h3>
                  <p className={`${theme.textMuted} mb-6`}>You haven't posted any rides yet. Start by offering your first ride.</p>
                  <button
                    onClick={handleCreate}
                    className="px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Post Your First Ride
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${theme.card} rounded-lg p-6 m-4 max-w-md w-full`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${theme.text}`}>Delete Ride</h2>
              <button
                onClick={() => setItemToDelete(null)}
                className={`text-gray-500 hover:text-gray-700 text-xl`}
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <p className={theme.textMuted}>
                Are you sure you want to delete this ride? This action cannot be undone.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setItemToDelete(null)}
                  className={`px-4 py-2 border rounded hover:bg-gray-50 ${theme.text}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                {selectedItem?.id ? 'Edit Ride' : 'Create New Ride'}
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsCreateModalOpen(false);
                  setSelectedItem(null);
                  setEditFormData({});
                }}
                className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="p-6 space-y-6">
                {/* Route Information */}
                <div className="space-y-4">
                  <h3 className={`text-lg font-semibold ${theme.text}`}>Route Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                        From Location *
                      </label>
                      <input
                        type="text"
                        value={editFormData.from_location || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, from_location: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="Starting location"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                        To Location *
                      </label>
                      <input
                        type="text"
                        value={editFormData.to_location || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, to_location: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                        placeholder="Destination"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Provider Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.driver_name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, driver_name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Date, Time, and Seats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Date *
                    </label>
                    <input
                      type="date"
                      value={editFormData.date || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Time *
                    </label>
                    <input
                      type="time"
                      value={editFormData.time || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Available Seats *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={editFormData.seats || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, seats: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="4"
                      required
                    />
                  </div>
                </div>

                {/* Price and Vehicle Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Price per Person (₹)
                    </label>
                    <input
                      type="number"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="500"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${theme.text} mb-2`}>
                      Vehicle Information
                    </label>
                    <input
                      type="text"
                      value={editFormData.vehicle_info || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, vehicle_info: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border ${theme.border} ${theme.card} ${theme.text} focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all`}
                      placeholder="Honda City, White"
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
                    placeholder="Trip details, stops, preferences, etc."
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
                }}
                className={`px-6 py-2 rounded-xl border ${theme.border} ${theme.textMuted} hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !editFormData.title || !editFormData.from_location || !editFormData.to_location}
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
                  selectedItem?.id ? 'Update Ride' : 'Create Ride'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <SmallFooter />
    </div>
  );
};

export default MyRidesPage;