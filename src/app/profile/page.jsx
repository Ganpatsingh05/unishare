'use client';

import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  AlertCircle, CheckCircle, X, Home, ShoppingBag, Car, Ticket, Search, Plus, AtSign, Calendar
} from 'lucide-react';


// Import API functions for data fetching only
import { fetchMyRooms } from '../lib/api/housing';
import { fetchMyItems } from '../lib/api/marketplace';
import { getMyRides } from '../lib/api/rideSharing';
import { fetchMyTickets } from '../lib/api/tickets';
import { fetchMyLostFoundItems } from '../lib/api/lostFound';
import { getCurrentUserProfile, updateUserProfile } from '../lib/api/userProfile';


// Import contexts
import { useAuth, useUI, useUniShare } from '../lib/contexts/UniShareContext';

// Import components
import Footer from '../_components/Footer';
import ProfileEditModal from '../_components/ProfileEditModal';

// Import profile card components
// FeatureGrid moved inline

const FeatureGrid = ({ 
  userRooms, 
  userItems, 
  userRides, 
  userTickets, 
  userLostFoundItems, 
  theme,
  isLoadingUserData 
}) => {
  const features = useMemo(() => [
    { 
      id: 'rooms', 
      title: 'My Rooms', 
      icon: Home, 
      count: userRooms?.length || 0, 
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      shadowColor: 'shadow-blue-500/25',
      href: '/profile/my-rooms'
    },
    { 
      id: 'items', 
      title: 'My Items', 
      icon: ShoppingBag, 
      count: userItems?.length || 0, 
      gradient: 'from-green-500 via-emerald-600 to-teal-600',
      shadowColor: 'shadow-green-500/25',
      href: '/profile/my-items'
    },
    { 
      id: 'rides', 
      title: 'My Rides', 
      icon: Car, 
      count: userRides?.length || 0, 
      gradient: 'from-purple-500 via-violet-600 to-purple-700',
      shadowColor: 'shadow-purple-500/25',
      href: '/profile/my-rides'
    },
    { 
      id: 'tickets', 
      title: 'My Tickets', 
      icon: Ticket, 
      count: userTickets?.length || 0, 
      gradient: 'from-orange-500 via-amber-500 to-yellow-500',
      shadowColor: 'shadow-orange-500/25',
      href: '/profile/my-tickets'
    },
    { 
      id: 'lost', 
      title: 'Lost Items', 
      icon: Search, 
      count: userLostFoundItems?.filter(item => item.mode === 'lost').length || 0, 
      gradient: 'from-red-500 via-rose-600 to-pink-600',
      shadowColor: 'shadow-red-500/25',
      href: '/profile/my-lost-items'
    },
    { 
      id: 'found', 
      title: 'Found Items', 
      icon: CheckCircle, 
      count: userLostFoundItems?.filter(item => item.mode === 'found').length || 0, 
      gradient: 'from-emerald-500 via-green-600 to-teal-600',
      shadowColor: 'shadow-emerald-500/25',
      href: '/profile/my-found-items'
    }
  ], [userRooms, userItems, userRides, userTickets, userLostFoundItems]);

  const NotificationBadge = memo(({ count, gradient }) => (
    count > 0 ? (
      <div className={`
        absolute -top-2 -right-2 z-20
        min-w-[24px] h-6 px-2
        bg-gradient-to-r ${gradient}
        rounded-full flex items-center justify-center
        shadow-lg
        ring-2 ring-white/20
      `}>
        <span className="text-white text-xs font-bold">
          {count > 99 ? '99+' : count}
        </span>
      </div>
    ) : null
  ));
  NotificationBadge.displayName = 'NotificationBadge';

  const ActivityCard = memo(({ feature, index }) => {
    const IconComponent = feature.icon;
    
    return (
      <Link href={feature.href}>
        <div
          className={`
            relative cursor-pointer
            ${theme.cardSecondary} ${theme.borderLight}
            border rounded-3xl p-6
            shadow-lg
            overflow-hidden
            w-fit mx-auto min-w-[140px]
          `}
        >
          {/* Animated Background Gradient */}
          <div className={`
            absolute inset-0 opacity-5 
            bg-gradient-to-br ${feature.gradient}
            rounded-3xl
          `} />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-4">
            {/* Icon with Notification Badge */}
            <div className="relative">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center
                bg-gradient-to-r ${feature.gradient}
                shadow-lg
                ring-1 ring-white/20
              `}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>
              <NotificationBadge count={feature.count} gradient={feature.gradient} />
            </div>
            
            {/* Text Content */}
            <div>
              <h3 className={`text-xl font-bold ${theme.text} whitespace-nowrap`}>
                {feature.title}
              </h3>
            </div>
          </div>
        </div>
      </Link>
    );
  });
  ActivityCard.displayName = 'ActivityCard';

  if (isLoadingUserData) {
    return (
      <div className="flex justify-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 sm:gap-6">
      {features.map((feature, index) => (
        <ActivityCard key={feature.id} feature={feature} index={index} />
      ))}
    </div>
  );
};

// Import utilities
import { getProfileImageUrl, getUserInitials, getDisplayName } from '../lib/utils/profileUtils';
import SmallFooter from '../_components/SmallFooter';

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

const ProfilePage = () => {
  // Get data from UniShare context
  const { isAuthenticated, user, userInitials, userAvatar, authLoading } = useAuth();
  const { darkMode } = useUI();
  const uniShareContext = useUniShare();
  
  // Debug the context to see what's available
  
  // Safely extract showMessage with a fallback
  const showMessage = uniShareContext?.showMessage || ((message, type) => {
    // Fallback to alert if no context showMessage
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  });

  // State variables
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  
  // Data states
  const [userRooms, setUserRooms] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [userRides, setUserRides] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [userLostFoundItems, setUserLostFoundItems] = useState([]);

  // Profile data states
  const [userProfile, setUserProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isProfileEditModalOpen, setIsProfileEditModalOpen] = useState(false);

  // Loading state for profile updates
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Message states
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Memoized theme configuration to prevent unnecessary rerenders
  const theme = useMemo(() => ({
    bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
    card: darkMode ? 'bg-gray-800' : 'bg-white',
    cardSecondary: darkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/70 backdrop-blur-xl',
    border: darkMode ? 'border-gray-700' : 'border-gray-200',
    borderLight: darkMode ? 'border-gray-700/50' : 'border-white/20',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    textSecondary: darkMode ? 'text-gray-300' : 'text-gray-700',
    profileImageBg: darkMode ? 'bg-gray-700' : 'bg-gray-100',
    buttonBorder: darkMode ? 'border-gray-800' : 'border-white',
    loadingSkeleton: darkMode ? 'bg-gray-700' : 'bg-gray-200',
    errorBg: darkMode ? 'bg-red-900/20' : 'bg-red-100',
    errorBorder: darkMode ? 'border-red-800' : 'border-red-200',
    errorText: darkMode ? 'text-red-400' : 'text-red-700',
    successBg: darkMode ? 'bg-green-900/20' : 'bg-green-100',
    successBorder: darkMode ? 'border-green-800' : 'border-green-200',
    successText: darkMode ? 'text-green-400' : 'text-green-700',
  }), [darkMode]);

  // Profile user data
  const profileUser = {
    name: user?.name || 'User',
    bio: user?.bio || 'Welcome to UniShare!',
    location: user?.location || 'Campus',
    interests: user?.interests || [],
    socialLinks: user?.socialLinks || {}
  };

  // Optimized user data loading with caching and error handling
  const loadUserData = async () => {
    if (!user?.id) return;
    
    setIsLoadingUserData(true);
    try {
      // Use Promise.allSettled for better error handling and faster parallel requests
      const [roomsResult, itemsResult, ridesResult, ticketsResult, lostFoundResult, profileResult] = await Promise.allSettled([
        fetchMyRooms({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 // 2 minute cache
        }),
        fetchMyItems({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        getMyRides({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        fetchMyTickets({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        fetchMyLostFoundItems({ 
          limit: 50, 
          cache: true, 
          cacheTTL: 2 * 60 * 1000 
        }),
        getCurrentUserProfile()
      ]);

      // Handle rooms data with enhanced error reporting
      if (roomsResult.status === 'fulfilled' && roomsResult.value?.success) {
        setUserRooms(roomsResult.value.data || []);
      } else if (roomsResult.status === 'rejected') {
        setUserRooms([]); // Set empty array on failure
      }

      // Handle items data with enhanced error reporting
      if (itemsResult.status === 'fulfilled' && itemsResult.value?.success) {
        setUserItems(itemsResult.value.data || []);
      } else if (itemsResult.status === 'rejected') {
        setUserItems([]);
      }

      // Handle rides data with enhanced error reporting
      if (ridesResult.status === 'fulfilled' && ridesResult.value?.success) {
        setUserRides(ridesResult.value.data || []);
      } else if (ridesResult.status === 'rejected') {
        setUserRides([]);
      }

      // Handle tickets data with enhanced error reporting
      if (ticketsResult.status === 'fulfilled' && ticketsResult.value?.success) {
        setUserTickets(ticketsResult.value.data || []);
      } else if (ticketsResult.status === 'rejected') {
        setUserTickets([]);
      }

      // Handle lost & found data with enhanced error reporting
      if (lostFoundResult.status === 'fulfilled' && lostFoundResult.value?.success) {
        setUserLostFoundItems(lostFoundResult.value.data || []);
      } else if (lostFoundResult.status === 'rejected') {
        setUserLostFoundItems([]);
      }

      // Handle profile data
      if (profileResult.status === 'fulfilled' && profileResult.value?.success) {
        setUserProfile(profileResult.value.data || null);
      } else if (profileResult.status === 'rejected') {
        setUserProfile(null);
      }
      setIsProfileLoading(false);

    } catch (error) {
      // Safe showMessage call
      try {
        showMessage('Failed to load profile data', 'error');
      } catch (msgError) {
        alert('Error: Failed to load profile data');
      }
    } finally {
      setIsLoadingUserData(false);
    }
  };

  // ============== PROFILE MANAGEMENT ==============

  // Handle profile edit
  const handleEditProfile = () => {
    setIsProfileEditModalOpen(true);
  };

  // Handle profile save
  const handleProfileSave = async (profileData, profileImage) => {
    setIsUpdatingProfile(true);
    try {
      const result = await updateUserProfile(profileData, profileImage);
      if (result.success) {
        setUserProfile(result.data);
        showMessage('Profile updated successfully!', 'success');
        setIsProfileEditModalOpen(false);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error; // Re-throw so the modal can handle it
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // ============== END PROFILE MANAGEMENT ==============

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const clearSuccess = () => setSuccess('');
  const clearError = () => setError('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
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
          <p className="text-gray-600 mb-6">Please sign in to view your profile dashboard.</p>
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
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/5 to-blue-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Profile Display Component */}
        <div className={`${theme.card} rounded-2xl shadow-lg ${theme.border} border p-6 mb-6`}>
          {/* Profile Content */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image with Edit Button */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative group">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-green-500 p-1 shadow-xl">
                  <div className={`w-full h-full rounded-xl overflow-hidden ${theme.profileImageBg} flex items-center justify-center`}>
                    {getProfileImageUrl(userProfile, user) ? (
                      <img
                        src={getProfileImageUrl(userProfile, user)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
                        {getUserInitials(getDisplayName(userProfile, user))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Plus Button Overlay */}
                <button
                  onClick={handleEditProfile}
                  className={`absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110 border-4 ${theme.buttonBorder} hover:rotate-90`}
                >
                  <Plus className="w-5 h-5 transition-transform duration-300" />
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 space-y-4">
              {/* Name and Title */}
              <div className="text-center md:text-left">
                <h1 className={`text-2xl md:text-3xl font-bold ${theme.text} mb-2`}>
                  {isProfileLoading ? (
                    <div className={`h-8 ${theme.loadingSkeleton} rounded animate-pulse`}></div>
                  ) : (
                    userProfile?.full_name || user?.name || 'Anonymous User'
                  )}
                </h1>
                
                {userProfile?.custom_user_id && (
                  <div className={`flex items-center justify-center md:justify-start ${theme.textMuted} mb-3`}>
                    <span className="text-sm">{userProfile.custom_user_id}</span>
                  </div>
                )}

                {userProfile?.bio && (
                  <p className={`${theme.textSecondary} text-sm leading-relaxed max-w-2xl`}>
                    {userProfile.bio}
                  </p>
                )}
              </div>

              {/* Profile Stats/Info */}
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {user?.email && (
                  <div className={`flex items-center gap-2 ${theme.textMuted} text-sm`}>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Verified Email</span>
                  </div>
                )}
                
                {user?.created_at && (
                  <div className={`flex items-center gap-2 ${theme.textMuted} text-sm`}>
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(user.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* My Activities Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-6 text-center">
            <h2 className={`text-2xl font-bold ${theme.text} mb-2`}> My Activities </h2>
            <p className={`${theme.textMuted} text-sm`}> Manage all your UniShare listings and activities</p>
         </div>
          
          <FeatureGrid 
            userRooms={userRooms}
            userItems={userItems}
            userRides={userRides}
            userTickets={userTickets}
            userLostFoundItems={userLostFoundItems}
            theme={theme}
            isLoadingUserData={isLoadingUserData}
          />
        </motion.div>

        

        {/* Success/Error Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-xl ${theme.errorBg} ${theme.errorBorder} border flex items-center gap-3`}
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className={theme.errorText}>{error}</span>
                <button onClick={clearError} className="ml-auto">
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 p-4 rounded-xl ${theme.successBg} ${theme.successBorder} border flex items-center gap-3`}
              >
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className={theme.successText}>{success}</span>
                <button onClick={clearSuccess} className="ml-auto">
                  <X className="w-4 h-4 text-green-500" />
                </button>
              </motion.div>
            )}
          </div>
        )}

      </main>

      <SmallFooter />

      {/* Profile Edit Modal */}
      {isProfileEditModalOpen && (
        <ProfileEditModal
          isOpen={isProfileEditModalOpen}
          onClose={() => setIsProfileEditModalOpen(false)}
          userProfile={userProfile}
          onSave={handleProfileSave}
          isLoading={isUpdatingProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
