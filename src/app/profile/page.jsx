"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, useTrail, config } from '@react-spring/web';
import Lottie from 'lottie-react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen,
  Camera,
  Edit3,
  Save,
  X,
  ArrowLeft,
  Settings,
  ChevronRight,
  Laptop,
  Smartphone,
  Home,
  ShoppingBag,
  Plus,
  Trash2,
  IndianRupee,
  Bed,
  ImageIcon,
  Loader,
  AlertCircle,
  CheckCircle,
  Star,
  Eye,
  MessageSquare,
  Heart,
  Shield,
  LogOut,
  CreditCard,
  Bell,
  Award,
  TrendingUp,
  Users,
  Activity,
  Zap,
  Clock,
  Target,
  Upload,
  Share2,
  Download,
  Filter,
  Search,
  Grid,
  List,
  MoreHorizontal,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Link as LinkIcon,
  Bookmark,
  Tag,
  Calendar as CalendarIcon,
  Timer,
  Briefcase,
  GraduationCap,
  Coffee,
  Sparkles,
  Flame,
  Rocket,
  Crown
} from 'lucide-react';
import { 
  FiSun, 
  FiMoon, 
  FiMonitor, 
  FiPalette,
  FiUser,
  FiHome,
  FiShoppingCart,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiInstagram,
  FiFacebook,
  FiSettings,
  FiHeart,
  FiCamera,
  FiEdit,
  FiUpload,
  FiShare2,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiTrendingUp,
  FiZap,
  FiAward,
  FiBell,
  FiMessageSquare,
  FiMapPin,
  FiMail,
  FiPhone,
  FiCalendar
} from 'react-icons/fi';
import { 
  HiOutlineSparkles, 
  HiOutlineLightBulb, 
  HiOutlineColorSwatch,
  HiOutlineFire,
  HiOutlinePhotograph,
  HiOutlineClipboardList,
  HiOutlineChat,
  HiOutlineGlobe
} from 'react-icons/hi';
import { 
  BsStars, 
  BsMagic, 
  BsPalette2,
  BsLightning,
  BsRocket,
  BsGem,
  BsFire
} from 'react-icons/bs';
import Link from 'next/link';
import Footer from '../_components/Footer';
import { 
  fetchMyRooms, 
  fetchMyItems, 
  updateUserProfile, 
  deleteRoom, 
  deleteItem 
} from '../lib/api';
import { useAuth, useUI, useUserData, useMessages } from '../lib/contexts/UniShareContext';

const ProfilePage = () => {
  // Get data from UniShare context
  const { isAuthenticated, user, updateUser, userInitials, userAvatar, authLoading } = useAuth();
  const { darkMode, setDarkMode, toggleDarkMode } = useUI();
  const { 
    userRooms, 
    userItems, 
    setUserRooms, 
    setUserItems, 
    removeUserRoom, 
    removeUserItem 
  } = useUserData();
  const { error, success, setError, setSuccess, showTemporaryMessage, clearError, clearSuccess, loading, setLoading } = useMessages();

  // Local component state
  const [selectedListingTab, setSelectedListingTab] = useState('rooms');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('grid');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, type: '', id: '', title: '' });
  const [deleteLoading, setDeleteLoading] = useState(null);
  
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

  // Enhanced state management - only UI states, data comes from context
  const [currentTheme, setCurrentTheme] = useState(darkMode ? 'dark' : 'light');

  // Create a merged user object with defaults
  const profileUser = {
    name: user?.name || 'User',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || 'Welcome to UniShare! Update your profile to let others know more about you.',
    location: user?.location || '',
    college: user?.college || '',
    year: user?.year || '',
    branch: user?.branch || '',
    picture: user?.picture || userAvatar || null,
    created_at: user?.created_at || new Date().toISOString().split('T')[0],
    followers: user?.followers || 0,
    following: user?.following || 0,
    rating: user?.rating || 0.0,
    profileViews: user?.profileViews || 0,
    badges: user?.badges || [],
    interests: user?.interests || [],
    socialLinks: {
      github: user?.socialLinks?.github || '',
      linkedin: user?.socialLinks?.linkedin || '',
      twitter: user?.socialLinks?.twitter || '',
      ...user?.socialLinks
    }
  };

  // Advanced theme configurations with warm human touch
  const themes = {
    light: {
      bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
      card: 'bg-white/95 backdrop-blur-sm border border-orange-100/50 shadow-lg shadow-orange-100/20',
      cardHover: 'hover:bg-white hover:shadow-xl hover:shadow-orange-200/30 hover:border-orange-200/60',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-600',
      accent: 'bg-gradient-to-r from-orange-500 to-amber-500',
      accentHover: 'hover:from-orange-600 hover:to-amber-600',
      border: 'border-orange-200/60',
      overlay: 'bg-white/95 backdrop-blur-md border-b border-orange-200/50',
      glassy: 'bg-white/80 backdrop-blur-xl border border-orange-200/60 shadow-sm',
      primary: 'text-orange-600',
      secondary: 'text-amber-600',
      cardAccent: 'from-orange-100 to-amber-100',
      statColors: {
        blue: 'from-orange-100 to-orange-200 text-orange-800',
        purple: 'from-amber-100 to-amber-200 text-amber-800',
        green: 'from-yellow-100 to-yellow-200 text-yellow-800',
        orange: 'from-red-100 to-red-200 text-red-800'
      }
    },
    dark: {
      bg: 'bg-gradient-to-br from-gray-900 via-slate-900 to-zinc-900',
      card: 'bg-gray-800/95 backdrop-blur-sm border border-gray-700/50 shadow-lg shadow-black/20',
      cardHover: 'hover:bg-gray-800 hover:shadow-xl hover:shadow-blue-500/20',
      text: 'text-white',
      textSecondary: 'text-gray-300',
      textMuted: 'text-gray-400',
      accent: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      accentHover: 'hover:from-blue-600 hover:to-indigo-600',
      border: 'border-gray-700/60',
      overlay: 'bg-gray-900/95 backdrop-blur-md',
      glassy: 'bg-gray-800/20 backdrop-blur-xl border border-gray-700/30',
      primary: 'text-blue-400',
      secondary: 'text-indigo-400',
      cardAccent: 'from-gray-800 to-gray-700',
      statColors: {
        blue: 'from-blue-900/30 to-blue-800/30 text-blue-400',
        purple: 'from-purple-900/30 to-purple-800/30 text-purple-400',
        green: 'from-green-900/30 to-green-800/30 text-green-400',
        orange: 'from-orange-900/30 to-orange-800/30 text-orange-400'
      }
    },
    cosmic: {
      bg: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900',
      card: 'bg-purple-800/95 backdrop-blur-sm border border-purple-600/50 shadow-lg shadow-purple-500/20',
      cardHover: 'hover:bg-purple-800 hover:shadow-xl hover:shadow-purple-500/30',
      text: 'text-white',
      textSecondary: 'text-purple-200',
      textMuted: 'text-purple-300',
      accent: 'bg-gradient-to-r from-purple-500 to-pink-500',
      accentHover: 'hover:from-purple-600 hover:to-pink-600',
      border: 'border-purple-700/60',
      overlay: 'bg-purple-900/95 backdrop-blur-md',
      glassy: 'bg-purple-800/20 backdrop-blur-xl border border-purple-700/30',
      primary: 'text-purple-300',
      secondary: 'text-pink-300',
      cardAccent: 'from-purple-800 to-indigo-800',
      statColors: {
        blue: 'from-purple-800/30 to-purple-700/30 text-purple-300',
        purple: 'from-pink-800/30 to-pink-700/30 text-pink-300',
        green: 'from-indigo-800/30 to-indigo-700/30 text-indigo-300',
        orange: 'from-violet-800/30 to-violet-700/30 text-violet-300'
      }
    }
  };

  const theme = themes[currentTheme];

  // Generate real recent activity from user data
  const generateRecentActivity = () => {
    const activities = [];
    
    // Add recent room activities
    userRooms?.slice(0, 2).forEach((room, index) => {
      activities.push({
        id: `room_${room.id}`,
        type: 'room',
        title: `Room "${room.title}" posted`,
        time: `${index + 1} day${index > 0 ? 's' : ''} ago`,
        icon: <Home className="w-4 h-4" />
      });
    });
    
    // Add recent item activities
    userItems?.slice(0, 2).forEach((item, index) => {
      activities.push({
        id: `item_${item.id}`,
        type: 'item',
        title: `Item "${item.title}" ${item.status === 'sold' ? 'sold' : 'posted'}`,
        time: `${index + 2} day${index > 0 ? 's' : ''} ago`,
        icon: <ShoppingBag className="w-4 h-4" />
      });
    });
    
    // If no activities, show account created
    if (activities.length === 0) {
      activities.push({
        id: 'account_created',
        type: 'account',
        title: 'Account created',
        time: 'Welcome to UniShare!',
        icon: <User className="w-4 h-4" />
      });
    }
    
    return activities.slice(0, 4); // Show max 4 activities
  };

  const recentActivity = generateRecentActivity();

  // Calculate real stats from user data
  const availableRooms = userRooms?.filter(room => room.status === 'available')?.length || 0;
  const availableItems = userItems?.filter(item => item.status === 'available')?.length || 0;
  const totalUserRooms = userRooms?.length || 0;
  const totalUserItems = userItems?.length || 0;
  
  const quickStats = [
    { label: 'Total Listings', value: totalUserRooms + totalUserItems, change: '+0%', icon: <TrendingUp className="w-5 h-5" />, gradient: 'green' },
    { label: 'Items Listed', value: totalUserItems, change: '+0%', icon: <ShoppingBag className="w-5 h-5" />, gradient: 'blue' },
    { label: 'Rooms Listed', value: totalUserRooms, change: '+0%', icon: <Home className="w-5 h-5" />, gradient: 'purple' }
  ];

  const achievements = [
    { title: 'First Sale', description: 'Completed your first transaction', earned: true, icon: <Star className="w-6 h-6" /> },
    { title: 'Top Seller', description: 'Ranked in top 10% of sellers', earned: true, icon: <Crown className="w-6 h-6" /> },
    { title: 'Quick Responder', description: 'Average response time under 1 hour', earned: true, icon: <Zap className="w-6 h-6" /> },
    { title: 'Trust Builder', description: '50+ positive reviews', earned: false, icon: <Shield className="w-6 h-6" /> }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTheme = () => {
    toggleDarkMode(); // Use context's toggle function
  };

  // Sync currentTheme with context darkMode
  useEffect(() => {
    setCurrentTheme(darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Handle profile update
  const handleProfileUpdate = async (formData) => {
    setIsUpdatingProfile(true);
    try {
      clearError();
      
      const profileData = {
        name: formData.get ? formData.get('name') : formData.name || editedProfile?.name,
        email: formData.get ? formData.get('email') : formData.email || editedProfile?.email,
        phone: formData.get ? formData.get('phone') : formData.phone || editedProfile?.phone,
        bio: formData.get ? formData.get('bio') : formData.bio || editedProfile?.bio,
        location: formData.get ? formData.get('location') : formData.location || editedProfile?.location,
        college: formData.get ? formData.get('college') : formData.college || editedProfile?.college,
        year: formData.get ? formData.get('year') : formData.year || editedProfile?.year,
        branch: formData.get ? formData.get('branch') : formData.branch || editedProfile?.branch,
        googleAvatar: editedProfile?.googleAvatar || editedProfile?.avatar || user?.picture || null,
      };

      const result = await updateUserProfile(profileData);
      
      if (result.success) {
        // Update context with new user data
        updateUser(result.data);
        setEditedProfile(result.data);
        setShowEditProfileModal(false);
        showTemporaryMessage('Profile updated successfully!', true);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      showTemporaryMessage('Failed to update profile. Please try again.', false);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle editing items/rooms
  const handleEditItem = (type, item) => {
    console.log(`Editing ${type}:`, item);
    // TODO: Open edit modal or navigate to edit page
    showTemporaryMessage(`Edit ${type} functionality coming soon!`, true);
  };

  // Handle deleting items/rooms
  const handleDeleteItem = (type, id, title) => {
    setDeleteModal({
      isOpen: true,
      type,
      id,
      title
    });
  };

  // Confirm deletion
  const confirmDelete = async () => {
    const { type, id, title } = deleteModal;
    setDeleteLoading(id);
    
    try {
      let result;
      
      if (type === 'room') {
        result = await deleteRoom(id);
        if (result.success) {
          removeUserRoom(id);
          showTemporaryMessage(`Room "${title}" deleted successfully!`, true);
        } else {
          throw new Error(result.message || 'Failed to delete room');
        }
      } else if (type === 'item') {
        result = await deleteItem(id);
        if (result.success) {
          removeUserItem(id);
          showTemporaryMessage(`Item "${title}" deleted successfully!`, true);
        } else {
          throw new Error(result.message || 'Failed to delete item');
        }
      }
      
      setDeleteModal({ isOpen: false, type: '', id: '', title: '' });
    } catch (error) {
      console.error(`Delete ${type} error:`, error);
      showTemporaryMessage(`Failed to delete ${type}. Please try again.`, false);
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

  // Show loading state during authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-700">Loading your profile...</p>
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
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
            style={{
              left: `${5 + i * 6}%`,
              top: `${10 + i * 5}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content - Mobile Optimized */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8"
      >
        {/* Success/Error Messages */}
        {(error || success) && (
          <div className="mb-4 sm:mb-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Profile Card - Mobile First */}
          <motion.div variants={itemVariants} className="lg:col-span-1 order-1 lg:order-1">
            <div className={`${theme.card} rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 ${theme.border} border shadow-xl human-hover`}>
              {/* Profile Picture Section with Human Touch - Mobile Optimized */}
              <div className="text-center mb-4 sm:mb-6">
                <motion.div 
                  className="relative inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full ${theme.accent} p-1 animate-warmGlow`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                      {userAvatar ? (
                        <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className={`text-xl sm:text-2xl lg:text-3xl font-bold ${theme.primary}`}>{userInitials}</span>
                      )}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 ${theme.accent} text-white rounded-full flex items-center justify-center shadow-lg ${theme.accentHover} transition-all duration-300`}
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                  
                  {/* Warm ambient glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-200/20 to-amber-200/20 animate-pulse pointer-events-none" />
                </motion.div>

                <h2 className={`text-xl sm:text-2xl font-bold mt-3 sm:mt-4 ${theme.text}`}>{profileUser.name}</h2>
                <p className={`${theme.textMuted} flex items-center justify-center gap-1 text-sm sm:text-base`}>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                  {user.location}
                </p>
              </div>

              {/* Quick Stats Grid - Mobile Optimized */}
              <div className="grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-2 sm:p-3 lg:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{totalUserRooms + totalUserItems}</div>
                  <div className="text-xs sm:text-sm text-orange-500">Listings</div>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className={`font-semibold mb-2 ${theme.text}`}>About</h3>
                <p className={`text-sm leading-relaxed ${theme.textSecondary}`}>{user?.bio || 'No bio available'}</p>
              </div>

              {/* Interests - Mobile Optimized */}
              <div className="mb-4 sm:mb-6">
                <h3 className={`font-semibold mb-2 sm:mb-3 ${theme.text} text-sm sm:text-base`}>Interests</h3>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {profileUser.interests.map((interest, index) => (
                    <motion.span
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                    >
                      {interest}
                    </motion.span>
                  ))}
                  {profileUser.interests.length === 0 && (
                    <span className="text-sm text-gray-500">No interests added yet</span>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-4 sm:mb-6">
                <h3 className={`font-semibold mb-2 sm:mb-3 ${theme.text} text-sm sm:text-base`}>Connect</h3>
                <div className="flex gap-2 sm:gap-3">
                  {profileUser.socialLinks.github && (
                    <motion.a
                      href={profileUser.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 sm:p-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300 group border border-gray-200 shadow-sm"
                    >
                      <FiGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  )}
                  {profileUser.socialLinks.linkedin && (
                    <motion.a
                      href={profileUser.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 sm:p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 group border border-blue-200 shadow-sm"
                    >
                      <FiLinkedin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  )}
                  {profileUser.socialLinks.twitter && (
                    <motion.a
                      href={profileUser.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 sm:p-3 rounded-xl bg-sky-50 text-sky-500 hover:bg-sky-400 hover:text-white transition-all duration-300 group border border-sky-200 shadow-sm"
                    >
                      <FiTwitter className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.a>
                  )}
                  {Object.keys(profileUser.socialLinks).filter(key => profileUser.socialLinks[key]).length === 0 && (
                    <span className="text-sm text-gray-500">No social links added yet</span>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className={`w-4 h-4 ${theme.textMuted}`} />
                  <span className={`text-sm ${theme.textSecondary}`}>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className={`w-4 h-4 ${theme.textMuted}`} />
                  <span className={`text-sm ${theme.textSecondary}`}>{user.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className={`w-4 h-4 ${theme.textMuted}`} />
                  <span className={`text-sm ${theme.textSecondary}`}>{user.college}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEditProfileModal(true)}
                  className={`w-full py-3 ${theme.accent} text-white rounded-xl font-medium ${theme.accentHover} transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAchievements(true)}
                  className={`w-full py-3 border-2 border-blue-500 text-blue-500 rounded-xl font-medium hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2`}
                >
                  <Award className="w-4 h-4" />
                  View Achievements
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Right Content Area - Mobile Optimized */}
          <motion.div variants={itemVariants} className="lg:col-span-2 order-2 lg:order-2">
            {/* Tab Navigation - Mobile Optimized */}
            <div className={`${theme.card} rounded-xl sm:rounded-2xl p-1 sm:p-2 mb-4 sm:mb-6 ${theme.border} border shadow-lg`}>
              <div className="flex gap-0.5 sm:gap-1">
                {[
                  { id: 'overview', label: 'Overview', icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" />, shortLabel: 'Home' },
                  { id: 'rooms', label: 'Rooms', icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" />, shortLabel: 'Rooms' },
                  { id: 'items', label: 'Items', icon: <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />, shortLabel: 'Items' },
                  { id: 'listings', label: 'Listings', icon: <Activity className="w-3 h-3 sm:w-4 sm:h-4" />, shortLabel: 'All' }
                ].map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 sm:py-3 px-1 sm:px-4 rounded-lg sm:rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : `${theme.textSecondary} hover:bg-blue-50 hover:text-blue-600`
                    }`}
                  >
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Quick Stats - Mobile Optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {quickStats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${theme.card} rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 ${theme.border} border shadow-lg ${theme.cardHover} cursor-pointer group relative overflow-hidden`}
                      >
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${theme.statColors[stat.gradient]} group-hover:scale-110 transition-all duration-300`}>
                            <div className="text-current">{stat.icon}</div>
                          </div>
                          <span className="text-xs sm:text-sm text-green-500 font-medium bg-green-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full">{stat.change}</span>
                        </div>
                        <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${theme.text}`}>{stat.value}</h3>
                        <p className={`text-xs sm:text-sm ${theme.textMuted}`}>{stat.label}</p>
                        
                        {/* Human touch: Add subtle pulse animation */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-orange-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity */}
                  <div className={`${theme.card} rounded-2xl p-6 ${theme.border} border shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-semibold ${theme.text}`}>Recent Activity</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                      >
                        View All
                      </motion.button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group"
                        >
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${theme.text}`}>{activity.title}</h4>
                            <p className={`text-sm ${theme.textMuted}`}>{activity.time}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Rooms Tab */}
              {activeTab === 'rooms' && (
                <motion.div
                  key="rooms"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className={`${theme.card} rounded-2xl p-6 ${theme.border} border shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-semibold ${theme.text}`}>My Rooms</h3>
                      <Link href="/housing/post">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2 inline" />
                          Post Room
                        </motion.button>
                      </Link>
                    </div>
                    
                    {userRooms && userRooms.length > 0 ? (
                      <div className="max-h-[32rem] md:max-h-[36rem] lg:max-h-[40rem] xl:max-h-[44rem] overflow-y-auto pr-2 space-y-4">
                        {userRooms.map((room, index) => (
                          <motion.div
                            key={room.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${theme.surface} rounded-xl ${theme.border} border hover:shadow-lg transition-all duration-300 overflow-hidden`}
                          >
                            {/* Room Image */}
                            <div className="w-full h-48 bg-gray-100">
                              {room.images && room.images.length > 0 ? (
                                <img 
                                  src={room.images[0]} 
                                  alt={room.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : room.photos && room.photos.length > 0 ? (
                                <img 
                                  src={room.photos[0]} 
                                  alt={room.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                  <Home className="w-16 h-16 text-blue-400" />
                                  <span className={`ml-2 ${theme.textMuted}`}>No image available</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Room Details */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className={`font-bold ${theme.text} text-xl mb-2`}>{room.title}</h4>
                                  <div className="flex items-center gap-4 text-sm mb-2">
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <MapPin className="w-4 h-4" />
                                      {room.location}
                                    </span>
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Bed className="w-4 h-4" />
                                      {room.roomType}
                                    </span>
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Users className="w-4 h-4" />
                                      {room.occupancy} person(s)
                                    </span>
                                  </div>
                                  <p className={`text-2xl font-bold ${theme.primary} mb-2`}>₹{room.rent}/month</p>
                                  {room.description && (
                                    <p className={`${theme.textMuted} text-sm mb-3 line-clamp-2`}>{room.description}</p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditItem('room', room)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Room"
                                  >
                                    <Edit3 className="w-5 h-5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteItem('room', room.id, room.title)}
                                    disabled={deleteLoading === room.id}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete Room"
                                  >
                                    {deleteLoading === room.id ? (
                                      <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-5 h-5" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                              
                              {/* Status and Date */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  room.status === 'available' ? 'bg-green-100 text-green-600' :
                                  room.status === 'occupied' ? 'bg-red-100 text-red-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {room.status === 'available' ? 'Available' : 
                                   room.status === 'occupied' ? 'Occupied' : 'Pending'}
                                </span>
                                <span className={`text-sm ${theme.textMuted}`}>
                                  Posted {room.created_at ? formatDate(room.created_at) : 'Recently'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <Home className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
                        <h4 className={`text-lg font-medium ${theme.text} mb-2`}>No rooms posted yet</h4>
                        <p className={`${theme.textMuted} mb-4`}>Start by posting your first room</p>
                        <Link href="/housing/post">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2 inline" />
                            Post Room
                          </motion.button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Items Tab */}
              {activeTab === 'items' && (
                <motion.div
                  key="items"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className={`${theme.card} rounded-2xl p-6 ${theme.border} border shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-lg font-semibold ${theme.text}`}>My Items</h3>
                      <Link href="/marketplace/sell">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 mr-2 inline" />
                          Post Item
                        </motion.button>
                      </Link>
                    </div>
                    
                    {userItems && userItems.length > 0 ? (
                      <div className="max-h-[32rem] md:max-h-[36rem] lg:max-h-[40rem] xl:max-h-[44rem] overflow-y-auto pr-2 space-y-4">
                        {userItems.map((item, index) => (
                          <motion.div
                            key={item.id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${theme.surface} rounded-xl ${theme.border} border hover:shadow-lg transition-all duration-300 overflow-hidden`}
                          >
                            {/* Item Image */}
                            <div className="w-full h-48 bg-gray-100">
                              {item.image_url ? (
                                <img 
                                  src={item.image_url} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : item.images && item.images.length > 0 ? (
                                <img 
                                  src={item.images[0]} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : item.photos && item.photos.length > 0 ? (
                                <img 
                                  src={item.photos[0]} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                                  <ShoppingBag className="w-16 h-16 text-green-400" />
                                  <span className={`ml-2 ${theme.textMuted}`}>No image available</span>
                                </div>
                              )}
                            </div>
                            
                            {/* Item Details */}
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className={`font-bold ${theme.text} text-xl mb-2`}>{item.title}</h4>
                                  <div className="flex items-center gap-4 text-sm mb-2">
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Tag className="w-4 h-4" />
                                      {item.category}
                                    </span>
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Star className="w-4 h-4" />
                                      {item.condition || 'Good'}
                                    </span>
                                    {item.location && (
                                      <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                        <MapPin className="w-4 h-4" />
                                        {item.location}
                                      </span>
                                    )}
                                  </div>
                                  <p className={`text-2xl font-bold ${theme.primary} mb-2`}>₹{item.price}</p>
                                  {item.description && (
                                    <p className={`${theme.textMuted} text-sm mb-3 line-clamp-2`}>{item.description}</p>
                                  )}
                                </div>
                                <div className="flex flex-col gap-2 ml-4">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleEditItem('item', item)}
                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit Item"
                                  >
                                    <Edit3 className="w-5 h-5" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleDeleteItem('item', item.id, item.title)}
                                    disabled={deleteLoading === item.id}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Delete Item"
                                  >
                                    {deleteLoading === item.id ? (
                                      <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <Trash2 className="w-5 h-5" />
                                    )}
                                  </motion.button>
                                </div>
                              </div>
                              
                              {/* Status and Date */}
                              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === 'available' ? 'bg-green-100 text-green-600' :
                                  item.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                                  'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {item.status === 'available' ? 'Available' : 
                                   item.status === 'sold' ? 'Sold' : 'Pending'}
                                </span>
                                <span className={`text-sm ${theme.textMuted}`}>
                                  Posted {item.created_at ? formatDate(item.created_at) : 'Recently'}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                      >
                        <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
                        <h4 className={`text-lg font-medium ${theme.text} mb-2`}>No items posted yet</h4>
                        <p className={`${theme.textMuted} mb-4`}>Start by posting your first item</p>
                        <Link href="/marketplace/sell">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                          >
                            <Plus className="w-4 h-4 mr-2 inline" />
                            Post Item
                          </motion.button>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Listings Tab */}
              {activeTab === 'listings' && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Listings Header */}
                  <div className={`${theme.card} rounded-2xl p-6 ${theme.border} border shadow-lg`}>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className={`text-xl font-bold ${theme.text}`}>My Listings</h3>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedListingTab('rooms')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            selectedListingTab === 'rooms' 
                              ? 'bg-blue-500 text-white' 
                              : `${theme.surface} ${theme.textMuted} hover:bg-blue-50`
                          }`}
                        >
                          <Home className="w-4 h-4 mr-2 inline" />
                          Rooms ({totalUserRooms})
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedListingTab('items')}
                          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            selectedListingTab === 'items' 
                              ? 'bg-green-500 text-white' 
                              : `${theme.surface} ${theme.textMuted} hover:bg-green-50`
                          }`}
                        >
                          <ShoppingBag className="w-4 h-4 mr-2 inline" />
                          Items ({totalUserItems})
                        </motion.button>
                      </div>
                    </div>

                    {/* Rooms Tab */}
                    {selectedListingTab === 'rooms' && (
                      <div className="space-y-4">
                        {userRooms && userRooms.length > 0 ? (
                          <div className="max-h-[32rem] md:max-h-[36rem] lg:max-h-[40rem] xl:max-h-[44rem] overflow-y-auto pr-2 space-y-4">
                            {userRooms.map((room, index) => (
                              <motion.div
                                key={room.id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${theme.surface} rounded-xl p-4 ${theme.border} border hover:shadow-lg transition-all duration-300`}
                              >
                                <div className="mb-4">
                                  {(room.images && room.images.length > 0) ? (
                                    <img 
                                      src={room.images[0]} 
                                      alt={room.title}
                                      className="w-full h-48 rounded-lg object-cover"
                                    />
                                  ) : room.image_url ? (
                                    <img 
                                      src={room.image_url} 
                                      alt={room.title}
                                      className="w-full h-48 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                      <Home className="w-16 h-16 text-blue-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className={`font-semibold ${theme.text} text-xl mb-1`}>{room.title}</h4>
                                    <p className={`${theme.textMuted} text-base mb-2`}>{room.location}</p>
                                    <p className={`text-2xl font-bold ${theme.primary}`}>₹{room.rent}/month</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEditItem('room', room)}
                                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit Room"
                                    >
                                      <Edit3 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteItem('room', room.id, room.title)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete Room"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Bed className="w-4 h-4" />
                                      {room.roomType}
                                    </span>
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Users className="w-4 h-4" />
                                      {room.occupancy} person(s)
                                    </span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    room.status === 'available' ? 'bg-green-100 text-green-600' :
                                    room.status === 'occupied' ? 'bg-red-100 text-red-600' :
                                    'bg-yellow-100 text-yellow-600'
                                  }`}>
                                    {room.status === 'available' ? 'Available' : 
                                     room.status === 'occupied' ? 'Occupied' : 'Pending'}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <Home className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
                            <h4 className={`text-lg font-medium ${theme.text} mb-2`}>No rooms listed yet</h4>
                            <p className={`${theme.textMuted} mb-4`}>Start by posting your first room listing</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-2 inline" />
                              Post Room
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}

                    {/* Items Tab */}
                    {selectedListingTab === 'items' && (
                      <div className="space-y-4">
                        {userItems && userItems.length > 0 ? (
                          <div className="max-h-[32rem] md:max-h-[36rem] lg:max-h-[40rem] xl:max-h-[44rem] overflow-y-auto pr-2 space-y-4">
                            {userItems.map((item, index) => (
                              <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${theme.surface} rounded-xl p-4 ${theme.border} border hover:shadow-lg transition-all duration-300`}
                              >
                                <div className="mb-4">
                                  {item.image_url ? (
                                    <img 
                                      src={item.image_url} 
                                      alt={item.title || 'Item image'}
                                      className="w-full h-48 rounded-lg object-cover"
                                      onLoad={() => console.log('Item image loaded:', item.image_url)}
                                      onError={() => console.log('Item image failed:', item.image_url)}
                                    />
                                  ) : (
                                    <div className="w-full h-48 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center">
                                      <ShoppingBag className="w-16 h-16 text-green-500" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className={`font-semibold ${theme.text} text-xl mb-1`}>{item.title}</h4>
                                    <p className={`${theme.textMuted} text-base mb-2`}>{item.category}</p>
                                    <p className={`text-2xl font-bold ${theme.primary}`}>₹{item.price}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleEditItem('item', item)}
                                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit Item"
                                    >
                                      <Edit3 className="w-5 h-5" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => handleDeleteItem('item', item.id, item.title)}
                                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete Item"
                                    >
                                      <Trash2 className="w-5 h-5" />
                                    </motion.button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className={`flex items-center gap-1 ${theme.textMuted}`}>
                                      <Tag className="w-4 h-4" />
                                      {item.condition || 'Good'}
                                    </span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.status === 'available' ? 'bg-green-100 text-green-600' :
                                    item.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                                    'bg-yellow-100 text-yellow-600'
                                  }`}>
                                    {item.status === 'available' ? 'Available' : 
                                     item.status === 'sold' ? 'Sold' : 'Pending'}
                                  </span>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                          >
                            <ShoppingBag className={`w-16 h-16 mx-auto mb-4 ${theme.textMuted}`} />
                            <h4 className={`text-lg font-medium ${theme.text} mb-2`}>No items listed yet</h4>
                            <p className={`${theme.textMuted} mb-4`}>Start by posting your first item for sale</p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
                            >
                              <Plus className="w-4 h-4 mr-2 inline" />
                              Post Item
                            </motion.button>
                          </motion.div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.main>

      {/* Floating Action Button - Mobile Optimized */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 2000);
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 ${theme.accent} text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden ${theme.accentHover}`}
        >
          <Plus className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
          
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          <motion.div
            className="absolute inset-1 sm:inset-2 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      </motion.div>

      {/* Sparkle Effects */}
      <AnimatePresence>
        {showSparkles && (
          <div className="fixed inset-0 pointer-events-none z-40">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut",
                }}
                className="absolute w-4 h-4 bg-yellow-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.card} rounded-2xl p-6 max-w-md w-full ${theme.border} border shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Share Profile</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className={`p-2 rounded-lg ${theme.glassy} hover:bg-red-100 transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Copy Link */}
                <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200">
                  <LinkIcon className={`w-5 h-5 ${theme.textMuted}`} />
                  <input
                    type="text"
                    value={`${window.location.origin}/profile/${user.id}`}
                    readOnly
                    className={`flex-1 bg-transparent text-sm focus:outline-none ${theme.text}`}
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/profile/${user.id}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      const url = `https://twitter.com/intent/tweet?text=Check out ${profileUser.name}'s profile&url=${window.location.origin}/profile/${user?.id || ''}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <FiTwitter className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      const url = `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.origin}/profile/${user.id}`;
                      window.open(url, '_blank');
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <FiLinkedin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.card} rounded-2xl p-6 max-w-md w-full ${theme.border} border shadow-2xl max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Settings</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className={`p-2 rounded-lg ${theme.glassy} hover:bg-red-100 transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Theme Settings */}
                <div>
                  <h4 className={`font-semibold mb-3 ${theme.text}`}>Theme</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['light', 'dark', 'cosmic'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => setCurrentTheme(themeOption)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-colors capitalize ${
                          currentTheme === themeOption
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {themeOption}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className={`font-semibold mb-3 ${theme.text}`}>Notifications</h4>
                  <div className="space-y-2">
                    {[
                      'Email notifications',
                      'Push notifications',
                      'SMS updates',
                      'Marketing emails'
                    ].map((setting) => (
                      <label key={setting} className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h4 className={`font-semibold mb-3 ${theme.text}`}>Privacy</h4>
                  <div className="space-y-2">
                    {[
                      'Public profile',
                      'Show online status',
                      'Allow messages from strangers'
                    ].map((setting) => (
                      <label key={setting} className="flex items-center gap-3">
                        <input type="checkbox" className="rounded" defaultChecked />
                        <span className="text-sm">{setting}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Save settings logic here
                      setShowEditModal(false);
                    }}
                    className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowEditProfileModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`${theme.card} rounded-2xl p-6 max-w-lg w-full ${theme.border} border shadow-2xl max-h-[80vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${theme.text}`}>Edit Profile</h3>
                <button
                  onClick={() => setShowEditProfileModal(false)}
                  className={`p-2 rounded-lg ${theme.glassy} hover:bg-red-100 transition-colors`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="modal-content space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className={`w-24 h-24 rounded-full ${theme.accent} p-1`}>
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {userAvatar ? (
                          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className={`text-2xl font-bold ${theme.primary}`}>{userInitials}</span>
                        )}
                      </div>
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-sm ${theme.textMuted}`}>Click to change profile picture</p>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={profileUser.name}
                      className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={profileUser.email}
                      className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={profileUser.phone}
                      className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Location</label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={profileUser.location}
                      className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme.text}`}>Bio</label>
                  <textarea
                    rows={4}
                    name="bio"
                    defaultValue={profileUser.bio}
                    className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${theme.text}`}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${theme.text}`}>Social Links</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FiGithub className={`w-5 h-5 ${theme.textMuted}`} />
                      <input
                        type="url"
                        name="github"
                        defaultValue={profileUser.socialLinks.github}
                        className={`flex-1 p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <FiLinkedin className="w-5 h-5 text-blue-600" />
                      <input
                        type="url"
                        name="linkedin"
                        defaultValue={profileUser.socialLinks.linkedin}
                        className={`flex-1 p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <FiTwitter className="w-5 h-5 text-blue-400" />
                      <input
                        type="url"
                        name="twitter"
                        defaultValue={profileUser.socialLinks.twitter}
                        className={`flex-1 p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${theme.text}`}>Interests</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileUser.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        {interest}
                        <button className="hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className={`w-full p-3 rounded-xl border ${theme.border} focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${theme.text}`}
                    placeholder="Add new interest (press Enter)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        // Add new interest logic here
                        e.target.value = '';
                      }
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isUpdatingProfile}
                    onClick={(e) => {
                      e.preventDefault();
                      const form = e.target.closest('form') || e.target.closest('.modal-content').querySelector('form');
                      if (form) {
                        const formData = new FormData(form);
                        const updatedData = {
                          name: formData.get('name') || profileUser.name,
                          email: formData.get('email') || profileUser.email,
                          phone: formData.get('phone') || profileUser.phone,
                          location: formData.get('location') || profileUser.location,
                          bio: formData.get('bio') || profileUser.bio,
                          socialLinks: {
                            github: formData.get('github') || profileUser.socialLinks.github,
                            linkedin: formData.get('linkedin') || profileUser.socialLinks.linkedin,
                            twitter: formData.get('twitter') || profileUser.socialLinks.twitter
                          }
                        };
                        handleProfileUpdate(updatedData);
                      } else {
                        // Fallback - just close modal with success message
                        setShowEditProfileModal(false);
                        showTemporaryMessage('Profile updated successfully!', true);
                        setShowSparkles(true);
                        setTimeout(() => setShowSparkles(false), 2000);
                      }
                    }}
                    className={`flex-1 py-3 px-4 ${theme.accent} text-white rounded-xl font-medium ${theme.accentHover} transition-colors flex items-center justify-center gap-2 ${isUpdatingProfile ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingProfile && <Loader className="w-4 h-4 animate-spin" />}
                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals would go here */}
      {/* ... */}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteModal({ isOpen: false, type: '', id: '', title: '' })}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${theme.card} rounded-2xl p-6 max-w-md w-full mx-auto shadow-2xl`}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>
                  Delete {deleteModal.type === 'room' ? 'Room' : 'Item'}
                </h3>
                <p className={`${theme.textMuted} mb-6`}>
                  Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDeleteModal({ isOpen: false, type: '', id: '', title: '' })}
                    className={`flex-1 py-3 px-4 ${theme.surface} ${theme.text} rounded-xl font-medium border ${theme.border} hover:bg-gray-50 transition-colors`}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={confirmDelete}
                    className="flex-1 py-3 px-4 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ProfilePage;