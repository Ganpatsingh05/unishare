"use client";

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Settings,
  Home,
  ShoppingBag,
  Plus,
  Trash2,
  IndianRupee,
  Bed,
  Instagram,
  Link2,
  ImageIcon,
  Loader,
  AlertCircle,
  CheckCircle,
  Star,
  Eye,
  MessageSquare,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { 
  fetchMyRooms, 
  fetchMyItems, 
  updateUserProfile, 
  deleteRoom, 
  deleteItem 
} from '../lib/api';
import { 
  useUniShare, 
  useAuth, 
  useMessages, 
  useUI, 
  useUserData 
} from '../lib/contexts/UniShareContext';

const ProfilePage = () => {
  // Context hooks
  const { user, isAuthenticated, authLoading, updateUser } = useAuth();
  const { error, success, loading, setError, clearError, setSuccess, clearSuccess, setLoading } = useMessages();
  const { darkMode, toggleDarkMode } = useUI();
  const { 
    userRooms, 
    userItems, 
    setUserRooms, 
    setUserItems, 
    removeUserRoom, 
    removeUserItem 
  } = useUserData();

  // Local component state
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [avatarHover, setAvatarHover] = useState(false);
  
  // Local user profile state for editing
  const [editedProfile, setEditedProfile] = useState(null);

  // Initialize edited profile when user data is available
  useEffect(() => {
    if (user && !editedProfile) {
      setEditedProfile({ ...user });
    }
  }, [user, editedProfile]);

  // Load user data on component mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      clearError();

      // Fetch user's rooms and items in parallel
      const [roomsResult, itemsResult] = await Promise.allSettled([
        fetchMyRooms(),
        fetchMyItems()
      ]);

      // Handle rooms data
      if (roomsResult.status === 'fulfilled' && roomsResult.value?.success) {
        setUserRooms(roomsResult.value.data || []);
      } else {
        console.error('Failed to fetch rooms:', roomsResult.reason);
        setUserRooms([]);
      }

      // Handle items data
      if (itemsResult.status === 'fulfilled' && itemsResult.value?.success) {
        setUserItems(itemsResult.value.data || []);
      } else {
        console.error('Failed to fetch items:', itemsResult.reason);
        setUserItems([]);
      }

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const themeClasses = darkMode 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white min-h-screen' 
    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 min-h-screen';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700 shadow-xl'
    : 'bg-white border-gray-200 shadow-lg';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500';

  const handleProfileUpdate = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    try {
      clearError();
      setLoading(true);

      const profileData = {
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        bio: editedProfile.bio,
        location: editedProfile.location,
        college: editedProfile.college,
        year: editedProfile.year,
        branch: editedProfile.branch,
        googleAvatar: editedProfile.googleAvatar || editedProfile.avatar || null,
      };

      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        // Update context with new user data
        updateUser(result.data);
        setEditedProfile(result.data);
        setIsEditing(false);
        setSuccess('Profile updated successfully!');
        setTimeout(() => clearSuccess(), 3000);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId, roomTitle) => {
    if (!confirm(`Are you sure you want to delete "${roomTitle}"?`)) return;
    
    setDeleteLoading(roomId);
    try {
      const result = await deleteRoom(roomId);
      
      if (result.success) {
        removeUserRoom(roomId);
        setSuccess(`Room "${roomTitle}" deleted successfully!`);
        setTimeout(() => clearSuccess(), 3000);
      } else {
        throw new Error(result.message || 'Failed to delete room');
      }
    } catch (err) {
      console.error('Error deleting room:', err);
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteItem = async (itemId, itemTitle) => {
    if (!confirm(`Are you sure you want to delete "${itemTitle}"?`)) return;
    
    setDeleteLoading(itemId);
    try {
      const result = await deleteItem(itemId);
      
      if (result.success) {
        removeUserItem(itemId);
        setSuccess(`Item "${itemTitle}" deleted successfully!`);
        setTimeout(() => clearSuccess(), 3000);
      } else {
        throw new Error(result.message || 'Failed to delete item');
      }
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const tabConfig = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'rooms', label: `My Rooms (${userRooms.length})`, icon: Home },
    { id: 'items', label: `My Items (${userItems.length})`, icon: ShoppingBag },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Show loading state during authentication
  if (authLoading) {
    return (
      <div className={themeClasses}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <p className="mt-4 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show login required if not authenticated
  if (!isAuthenticated) {
    return (
      <div className={themeClasses}>
        <div className="relative h-56 md:h-64 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
          <div className="absolute inset-x-0 top-0 z-50 px-4 py-3">
            <div className="flex items-center justify-between">
              <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <h1 className="text-white/90 font-semibold">Profile Dashboard</h1>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 right-6 w-28 h-28 bg-white/20 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute -top-6 left-10 w-24 h-24 bg-white/10 blur-xl rounded-full pointer-events-none" />
        </div>
        
        <div className="relative -mt-12 px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className={`rounded-2xl shadow-xl border p-8 text-center ${cardClasses}`}>
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Login Required</h2>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                You need to be logged in to view your profile dashboard.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium transition-all shadow-md hover:shadow-lg"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if user profile couldn't be loaded
  if (!user) {
    return (
      <div className={themeClasses}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 rounded-2xl shadow-xl border max-w-md mx-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-red-200 dark:border-red-800">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Profile</h2>
            <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {error || 'Unable to load profile data'}
            </p>
            <button 
              onClick={loadUserData}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      {/* Header */}
      <div className="relative h-48 md:h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-x-0 top-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between">
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-10 right-6 w-28 h-28 bg-white/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -top-6 left-10 w-24 h-24 bg-white/10 blur-xl rounded-full pointer-events-none" />
      </div>

      {/* Success/Error Messages */}
      {(error || success) && (
        <div className="px-4 py-2">
          <div className="max-w-5xl mx-auto">
            {error && (
              <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-500">{error}</span>
                <button onClick={clearError} className="ml-auto">
                  <X className="w-4 h-4 text-red-500" />
                </button>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-green-500">{success}</span>
                <button onClick={clearSuccess} className="ml-auto">
                  <X className="w-4 h-4 text-green-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative -mt-12 md:-mt-16 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          
          {/* Profile Summary Card */}
          <div className={`rounded-2xl shadow-xl border p-6 mb-6 ${cardClasses}`}>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative -mt-14 md:-mt-14">
                <div 
                  className="relative w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center text-white ring-4 ring-white shadow-xl overflow-hidden"
                  onMouseEnter={() => setAvatarHover(true)}
                  onMouseLeave={() => setAvatarHover(false)}
                >
                  {user.picture || user.googleAvatar || user.avatar ? (
                    <img 
                      src={user.picture || user.googleAvatar || user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-transform duration-300 ease-in-out"
                      style={{ transform: avatarHover ? 'scale(1.1)' : 'scale(1)' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-3xl font-bold">{user.name?.charAt(0) || 'U'}</span>
                    </div>
                  )}

                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${avatarHover ? 'opacity-100' : 'opacity-0'}`}>
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                {isEditing && (
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                    <Camera className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedProfile?.name || ''}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className={`text-2xl md:text-3xl font-bold mb-2 px-3 py-2 rounded-lg ${inputClasses} w-full md:w-auto`}
                    placeholder="Your name"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold mb-2">{user.name || 'User'}</h2>
                )}

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                  {user.year && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                      {user.year}
                    </span>
                  )}
                  {user.branch && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-violet-100 text-violet-700 border border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800">
                      {user.branch}
                    </span>
                  )}
                  {user.college && (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      {user.college}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.location && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <MapPin className="w-4 h-4 text-purple-600" />
                      <p className="text-sm">{user.location}</p>
                    </div>
                  )}
                  {user.created_at && (
                    <div className={`flex items-center gap-2 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <Calendar className="w-4 h-4 text-orange-600" />
                      <p className="text-sm">Member since {formatDate(user.created_at)}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => isEditing ? saveProfile() : setIsEditing(!isEditing)}
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  {loading ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : isEditing ? (
                    <Save className="w-4 h-4" />
                  ) : (
                    <Edit3 className="w-4 h-4" />
                  )}
                  {isEditing ? 'Save' : 'Edit'}
                </button>
                {isEditing && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProfile({ ...user });
                    }}
                    className={`p-2 rounded-lg border transition-colors ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className={`rounded-2xl shadow-xl border mb-6 ${cardClasses} overflow-hidden`}>
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabConfig.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-all whitespace-nowrap min-w-max ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner'
                        : darkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content - Profile */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* About Section */}
              <div className={`rounded-2xl shadow-xl border p-6 ${cardClasses}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About Me
                </h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile?.bio || ''}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={5}
                    className={`w-full p-3 border rounded-xl resize-none ${inputClasses}`}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div>
                    {user.bio ? (
                      <>
                        <p className="leading-relaxed">
                          {showFullBio || (user.bio.length <= 160) ? user.bio : `${user.bio.slice(0, 160)}...`}
                        </p>
                        {user.bio.length > 160 && (
                          <button
                            onClick={() => setShowFullBio(!showFullBio)}
                            className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors"
                          >
                            {showFullBio ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </>
                    ) : (
                      <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} italic`}>
                        No bio added yet. {!isEditing && 'Click Edit to add one.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className={`rounded-2xl shadow-xl border p-6 ${cardClasses}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {/* Email */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-all`}>
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editedProfile?.email || ''}
                          onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          className={`font-medium bg-transparent border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} outline-none w-full`}
                          placeholder="your.email@example.com"
                        />
                      ) : (
                        <p className="font-medium">{user.email || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className={`flex items-center gap-3 p-4 rounded-xl border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-all`}>
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editedProfile?.phone || ''}
                          onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          className={`font-medium bg-transparent border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'} outline-none w-full`}
                          placeholder="+91 98765 43210"
                        />
                      ) : (
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className={`rounded-2xl shadow-xl border p-6 ${cardClasses}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Social Links
                </h3>
                <div className="space-y-3">
                  <button className={`w-full flex items-center gap-3 p-3 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-all`}>
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="font-medium">Connect Facebook</span>
                  </button>
                  
                  <button className={`w-full flex items-center gap-3 p-3 rounded-lg border ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-all`}>
                    <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                      <Instagram className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="font-medium">Connect Instagram</span>
                  </button>
                </div>
              </div>

              {/* Stats Card */}
              <div className={`rounded-2xl shadow-xl border p-6 ${cardClasses}`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Profile Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="text-2xl font-bold text-blue-600">{userRooms.length}</div>
                    <div className="text-sm mt-1">Room Listings</div>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                    <div className="text-2xl font-bold text-green-600">{userItems.length}</div>
                    <div className="text-sm mt-1">Items for Sale</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content - Rooms */}
          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">My Room Listings</h2>
                <Link href="/housing/post" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg">
                  <Plus className="w-4 h-4" />
                  Add Room
                </Link>
              </div>

              {userRooms.length === 0 ? (
                <div className={`rounded-2xl border p-12 text-center ${cardClasses}`}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No room listings yet</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start by creating your first room listing
                  </p>
                  <Link href="/housing/post" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                    <Plus className="w-4 h-4" />
                    Post Your First Room
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userRooms.map((room) => (
                    <div key={room.id} className={`rounded-2xl border p-6 ${cardClasses} transition-all hover:shadow-xl`}>
                      <div className="flex flex-col gap-4">
                        <div className={`w-full h-40 rounded-lg overflow-hidden flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {room.photos && room.photos.length > 0 ? (
                            <img 
                              src={room.photos[0]} 
                              alt={room.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          ) : (
                            <Home className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2 line-clamp-1">{room.title}</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                            <div className="flex items-center gap-1 text-emerald-500 font-semibold">
                              <IndianRupee size={16} />
                              <span>{room.rent}/month</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed size={16} />
                              <span>{room.beds} bed{room.beds > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-1 col-span-2">
                              <MapPin size={16} />
                              <span className="truncate">{room.location}</span>
                            </div>
                            <div className="flex items-center gap-1 col-span-2">
                              <Calendar size={16} />
                              <span>Available from {formatDate(room.move_in_date)}</span>
                            </div>
                          </div>
                          
                          <div className={`text-xs pt-2 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                            Posted {formatDate(room.created_at)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Link 
                            href={`/housing/edit/${room.id}`} 
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            <Edit3 size={16} className="text-blue-500" />
                            <span>Edit</span>
                          </Link>
                          <button 
                            onClick={() => handleDeleteRoom(room.id, room.title)}
                            disabled={deleteLoading === room.id}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-50`}
                          >
                            {deleteLoading === room.id ? (
                              <Loader size={16} className="animate-spin text-red-500" />
                            ) : (
                              <Trash2 size={16} className="text-red-500" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Items */}
          {activeTab === 'items' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">My Marketplace Items</h2>
                <Link href="/marketplace/sell" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg">
                  <Plus className="w-4 h-4" />
                  Sell Item
                </Link>
              </div>

              {userItems.length === 0 ? (
                <div className={`rounded-2xl border p-12 text-center ${cardClasses}`}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No items listed yet</h3>
                  <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Start selling by creating your first item listing
                  </p>
                  <Link href="/marketplace/sell" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all">
                    <Plus className="w-4 h-4" />
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userItems.map((item) => (
                    <div key={item.id} className={`rounded-2xl border p-6 ${cardClasses} transition-all hover:shadow-xl`}>
                      <div className="flex flex-col gap-4">
                        <div className={`w-full h-40 rounded-lg overflow-hidden flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          {item.photos && item.photos.length > 0 ? (
                            <img 
                              src={item.photos[0]} 
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105"
                            />
                          ) : (
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2 line-clamp-1">{item.title}</h3>
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <div className="flex items-center gap-1 text-emerald-500 font-semibold">
                              <IndianRupee size={16} />
                              {item.price}
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {item.category}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                              {item.condition}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {item.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              Available from {formatDate(item.available_from)}
                            </span>
                          </div>
                          {item.description && (
                            <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.description}
                            </p>
                          )}
                          <div className={`text-xs pt-2 border-t ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
                            Posted {formatDate(item.created_at)}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <Link 
                            href={`/marketplace/edit/${item.id}`} 
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                          >
                            <Edit3 size={16} className="text-blue-500" />
                            <span>Edit</span>
                          </Link>
                          <button 
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            disabled={deleteLoading === item.id}
                            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} disabled:opacity-50`}
                          >
                            {deleteLoading === item.id ? (
                              <Loader size={16} className="animate-spin text-red-500" />
                            ) : (
                              <Trash2 size={16} className="text-red-500" />
                            )}
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab Content - Settings */}
          {activeTab === 'settings' && (
            <div className={`rounded-2xl shadow-xl border p-6 ${cardClasses}`}>
              <h2 className="text-xl font-semibold mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border">
                  <div>
                    <h3 className="font-medium">Dark Mode</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Toggle dark/light theme
                    </p>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      darkMode ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        darkMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Receive updates about your listings
                    </p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600`}>
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-xl border">
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Get alerts on your device
                    </p>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600`}>
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
                  </button>
                </div>
                
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                  <h3 className="font-medium text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                  <p className={`text-sm mb-4 ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                    Permanently delete your account and all associated data.
                  </p>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Changes Bar */}
      {isEditing && (
        <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-50 animate-fade-in">
          <div className={`rounded-2xl shadow-2xl border p-4 flex gap-3 backdrop-blur-sm ${darkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white/95 border-gray-200'}`}>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedProfile({ ...user });
              }}
              className={`flex-1 py-3 px-4 rounded-xl transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
            >
              <X className="w-5 h-5 inline mr-2" />
              Cancel
            </button>
            <button
              onClick={saveProfile}
              disabled={loading}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 inline mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;