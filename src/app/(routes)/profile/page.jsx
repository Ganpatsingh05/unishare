"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Award,
  Camera,
  Car,
  ChevronRight,
  Crown,
  Edit2,
  Flame,
  Home,
  Loader2,
  Mail,
  MapPin,
  Moon,
  Package,
  Save,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  Target,
  Ticket,
  TrendingUp,
  User,
  X
} from "lucide-react";
import { fetchUserDashboardData, formatDate, getTimeSince } from "../../lib/api/utils";
import {
  getCurrentUserProfile,
  updateUserProfile as saveUserProfile,
  validateProfileDataEnhanced,
  validateProfileImage
} from "../../lib/api/userProfile";
import { useUI } from "../../lib/contexts/UniShareContext";

// Galaxy Background for dark mode (same as home page)
const GalaxyDesktop = dynamic(() => import("../../_components/ui/GalaxyDesktop"), { 
  ssr: false,
  loading: () => null
});

// Small Footer
import SmallFooter from "../../_components/layout/SmallFooter";

// Card colors matching home page style - Same solid colors for both modes
const CARD_COLORS = {
  blue: '#1D3557',      // Deep Ocean Blue
  green: '#2A4A3E',     // Forest Green
  purple: '#524463',    // Midnight Purple
  pink: '#8B5A6F',      // Rich Mauve
  orange: '#5C3A3A',    // Warm Burgundy
  teal: '#2D5F5D',      // Deep Teal
  slate: '#3A3F47',     // Graphite Smoke
};

// Border colors for outer card frames in light mode
const BORDER_COLORS = {
  blue: '#1D3557',
  green: '#2A4A3E', 
  purple: '#524463',
  pink: '#8B5A6F',
  orange: '#5C3A3A',
  teal: '#2D5F5D',
  slate: '#3A3F47',
};

// Reusable Content Card Component matching home page design
// Uses solid dark backgrounds with floating white inner card in light mode
const ContentCard = ({ children, color = 'blue', className = '', darkMode }) => {
  const cardColor = CARD_COLORS[color] || CARD_COLORS.blue;
  
  return (
    <div 
      className={`relative rounded-[28px] overflow-hidden ${className}`}
      style={{
        background: cardColor,
        boxShadow: `0 20px 40px -10px ${cardColor}40, 0 8px 16px -4px rgba(0,0,0,0.2)`,
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
        {/* Large decorative circle bottom left */}
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full border-2 border-white/10" />
        {/* Medium circle top right */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full border-2 border-white/10" />
        {/* Small accent circle */}
        <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-white/20" />
      </div>
      
      {/* Decorative dots cluster - bottom right */}
      <div className="absolute bottom-6 right-6 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-white/15" />
        <div className="w-2 h-2 rounded-full bg-white/20" />
      </div>
      
      {/* Content directly on dark background */}
      <div className="relative p-5 sm:p-6 z-10">
        {children}
      </div>
    </div>
  );
};

const DEFAULT_STATS = {
  itemsShared: 0,
  ridesOffered: 0,
  roomsPosted: 0,
  rating: "—",
  responseRate: 0
};

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "listings", label: "My Listings", icon: Package },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "settings", label: "Settings", icon: Settings }
];

const achievementIcons = [ShieldCheck, Target, Sparkles, Flame, Crown, Award];

export default function ProfilePage() {
  const { darkMode, setDarkMode } = useUI();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    joinDate: "",
    bio: "",
    avatar: "",
    stats: DEFAULT_STATS
  });
  const [editedData, setEditedData] = useState({
    display_name: "",
    bio: "",
    custom_user_id: "",
    phone: "",
    campus_name: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [activityItems, setActivityItems] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [rawProfile, setRawProfile] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const fileInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const normalizedJoinDate = useMemo(() => {
    if (!profileData.joinDate) return "�";
    return formatDate(profileData.joinDate, { month: "long", year: "numeric" });
  }, [profileData.joinDate]);

  const buildActivity = (dashboard) => {
    if (!dashboard) return [];
    const now = new Date();
    const items = [];

    const pushWithMeta = (source, type, titleKey = "title", timeKey = "created_at") => {
      (source || []).forEach((item, idx) => {
        const dateValue = item[timeKey] || item.createdAt || now.toISOString();
        items.push({
          id: `${type}-${item.id || idx}`,
          type,
          action: type === "ride" ? "Offered" : type === "ticket" ? "Submitted" : "Listed",
          item: item[titleKey] || item.title || item.name || "Item",
          time: getTimeSince(dateValue),
          timestamp: dateValue,
          icon: type === "ride" ? Car : type === "room" ? Home : type === "ticket" ? Ticket : Package
        });
      });
    };

    pushWithMeta(dashboard.rooms, "room");
    pushWithMeta(dashboard.items, "marketplace");
    pushWithMeta(dashboard.rides, "ride", "route");
    pushWithMeta(dashboard.tickets, "ticket", "issue");
    pushWithMeta(dashboard.lostFound, "lostfound");

    return items
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const buildListings = (dashboard) => {
    if (!dashboard) return [];
    const combined = [];

    const pushListing = (source, category) => {
      (source || []).forEach((item, idx) => {
        combined.push({
          id: `${category}-${item.id || idx}`,
          category,
          title: item.title || item.name || "Untitled",
          status: (item.status || item.is_active) ? "active" : "inactive",
          views: item.views || item.view_count || 0,
          interested: item.interested || item.favorites_count || 0
        });
      });
    };

    pushListing(dashboard.items, "Marketplace");
    pushListing(dashboard.rides, "RideShare");
    pushListing(dashboard.rooms, "Housing");
    pushListing(dashboard.tickets, "Tickets");
    pushListing(dashboard.lostFound, "Lost & Found");

    return combined.slice(0, 10);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileResponse, dashboardResponse] = await Promise.all([
        getCurrentUserProfile(),
        fetchUserDashboardData()
      ]);

      const profilePayload = profileResponse?.data || profileResponse?.user || profileResponse || {};
      const dashboard = dashboardResponse?.data || {};
      setRawProfile(profilePayload);

      const stats = {
        itemsShared: dashboard.stats?.totalItems ?? profilePayload.items_shared ?? DEFAULT_STATS.itemsShared,
        ridesOffered: dashboard.stats?.totalRides ?? profilePayload.rides_offered ?? DEFAULT_STATS.ridesOffered,
        roomsPosted: dashboard.stats?.totalRooms ?? profilePayload.rooms_posted ?? DEFAULT_STATS.roomsPosted,
        tickets: dashboard.stats?.totalTickets ?? dashboard.tickets?.length ?? profilePayload.tickets_count ?? 0,
        responseRate: profilePayload.response_rate ?? DEFAULT_STATS.responseRate
      };

      setProfileData({
        name: profilePayload.display_name || profilePayload.full_name || profilePayload.name || "Your Name",
        email: profilePayload.email || "Not provided",
        phone: profilePayload.phone_number || profilePayload.phone || "",
        location: profilePayload.campus_name || profilePayload.location || "Campus",
        joinDate: profilePayload.created_at || profilePayload.joined_at || profilePayload.createdAt || "",
        bio: profilePayload.bio || "",
        avatar: profilePayload.profile_image_url || profilePayload.avatar_url || profilePayload.avatar || "",
        banner: profilePayload.banner_image_url || profilePayload.banner || "",
        stats
      });

      setIsAdmin(profilePayload.role === "admin" || profilePayload.is_admin === true);

      setEditedData({
        display_name: profilePayload.display_name || profilePayload.full_name || profilePayload.name || "",
        bio: profilePayload.bio || "",
        custom_user_id: profilePayload.custom_user_id || "",
        phone: profilePayload.phone_number || profilePayload.phone || "",
        campus_name: profilePayload.campus_name || ""
      });

      setActivityItems(buildActivity(dashboard));
      setListings(buildListings(dashboard));
      setReviews(dashboard.reviews || []);
    } catch (err) {
      setError(err?.message || "Unable to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
    setFormErrors({});
    setAvatarPreview(null);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormErrors({});
    setAvatarFile(null);
    setAvatarPreview(null);
    setBannerFile(null);
    setBannerPreview(null);
    setEditedData({
      display_name: rawProfile.display_name || rawProfile.full_name || rawProfile.name || profileData.name || "",
      bio: rawProfile.bio || profileData.bio || "",
      custom_user_id: rawProfile.custom_user_id || "",
      phone: rawProfile.phone_number || rawProfile.phone || profileData.phone || "",
      campus_name: rawProfile.campus_name || profileData.location || ""
    });
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const validation = validateProfileImage(file);
      if (!validation.valid) {
        setFormErrors((prev) => ({ ...prev, avatar: validation.message }));
        return;
      }
      setFormErrors((prev) => ({ ...prev, avatar: null }));
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, avatar: err.message }));
    }
  };

  const handleBannerChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const validation = validateProfileImage(file);
      if (!validation.valid) {
        setFormErrors((prev) => ({ ...prev, banner: validation.message }));
        return;
      }
      setFormErrors((prev) => ({ ...prev, banner: null }));
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, banner: err.message }));
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "custom_user_id" && value && !value.startsWith("@")) {
      value = `@${value}`;
    }
    setEditedData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSave = async () => {
    const validation = validateProfileDataEnhanced(editedData, avatarFile);
    if (!validation.valid) {
      setFormErrors(validation.errors || {});
      return;
    }

    setSaving(true);
    setFormErrors({});
    try {
      const updated = await saveUserProfile(editedData, avatarFile);
      const payload = updated?.data || updated?.user || updated || {};
      setRawProfile(payload);

      setProfileData((prev) => ({
        ...prev,
        name: payload.display_name || payload.full_name || payload.name || editedData.display_name || prev.name,
        bio: payload.bio ?? editedData.bio ?? prev.bio,
        phone: payload.phone_number || payload.phone || editedData.phone || prev.phone,
        location: payload.campus_name || editedData.campus_name || prev.location,
        avatar: payload.profile_image_url || prev.avatar,
        stats: prev.stats
      }));

      setIsEditMode(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      setFormErrors({ form: err?.message || "Failed to save profile" });
    } finally {
      setSaving(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color }) => {
    // Map gradient colors to solid card colors (matching home page - same dark colors for both modes)
    const colorMap = {
      'from-blue-600 to-blue-700': '#1e3a5f',
      'from-slate-600 to-slate-700': '#475569', 
      'from-gray-700 to-gray-800': '#374151',
      'from-stone-700 to-stone-800': '#44403c',
      'from-teal-700 to-teal-800': '#115e59',
    };
    const cardColor = colorMap[color] || '#1D3557';
    
    // Map gradient to icon background colors
    const iconBgMap = {
      'from-blue-600 to-blue-700': 'from-blue-500 to-blue-600',
      'from-slate-600 to-slate-700': 'from-slate-500 to-slate-600',
      'from-gray-700 to-gray-800': 'from-gray-600 to-gray-700',
      'from-stone-700 to-stone-800': 'from-stone-600 to-stone-700',
      'from-teal-700 to-teal-800': 'from-teal-600 to-teal-700',
    };
    const iconBg = iconBgMap[color] || 'from-blue-400 to-blue-500';
    
    return (
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        className="relative rounded-[20px] overflow-hidden transition-all duration-300"
        style={{
          background: cardColor,
          boxShadow: `0 20px 40px -10px ${cardColor}40, 0 8px 16px -4px rgba(0,0,0,0.2)`,
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border-2 border-white/10" />
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 border-white/10" />
        </div>
        
        {/* Decorative dots */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
        
        {/* Content directly on dark background */}
        <div className="relative p-4 sm:p-5 z-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div 
              className={`p-2.5 sm:p-3 rounded-xl bg-gradient-to-br ${iconBg}`}
              style={{
                boxShadow: `0 8px 16px -4px ${cardColor}60`,
              }}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-white">
                {value}
              </p>
              <p className="text-xs sm:text-sm text-white/70">
                {label}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const quickStats = useMemo(() => {
    const totalListings = listings.length;
    const completedDeals = listings.filter((l) => l.status !== "active").length;
    return {
      totalListings,
      completedDeals,
      activeListings: totalListings - completedDeals,
      memberSince: normalizedJoinDate
    };
  }, [listings, normalizedJoinDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: darkMode ? '#0a0a0a' : '#f0f9ff' }}>
        <div className={`flex items-center gap-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading your profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: darkMode ? '#0a0a0a' : '#f0f9ff' }}>
      {/* Galaxy/Sky Background - same as home page (renders for both light and dark modes) */}
      <GalaxyDesktop />
      
      {/* Main Content - z-10 to appear above background */}
      <div className="relative z-10">
        {/* Floating Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed left-0 right-0 w-full z-50"
        >
          <div className="flex justify-center w-full pt-3 px-4">
            <nav 
              className="relative backdrop-blur rounded-full px-6 sm:px-10 py-3 sm:py-4 max-w-6xl w-full flex items-center justify-between gap-4"
              style={{
                backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.85)',
                borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: '1px',
                borderStyle: 'solid',
                boxShadow: darkMode ? '0 8px 30px rgba(0,0,0,0.35)' : '0 8px 30px rgba(0,0,0,0.15)'
              }}
            >
              {/* Logo */}
              <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                <Image
                  src="/images/logos/logounishare1.png"
                  alt="UniShare"
                width={36}
                height={36}
                className="rounded"
                priority
              />
              <span className="brand-wordmark font-bold text-xl whitespace-nowrap hidden sm:block">
                <span className="brand-uni">Uni</span>
                <span className="brand-share">Share</span>
              </span>
            </Link>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center">
              <Link href="/" className={`group relative inline-flex items-center px-3 py-1.5 text-sm font-bold transition-colors ${darkMode ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>
                <span className="relative z-10">Home</span>
                <span className={`pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}></span>
              </Link>
              <Link href="/marketplace" className={`group relative inline-flex items-center px-3 py-1.5 text-sm font-bold transition-colors ${darkMode ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>
                <span className="relative z-10">Marketplace</span>
                <span className={`pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}></span>
              </Link>
              <Link href="/share-ride" className={`group relative inline-flex items-center px-3 py-1.5 text-sm font-bold transition-colors ${darkMode ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>
                <span className="relative z-10">Rides</span>
                <span className={`pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}></span>
              </Link>
              <Link href="/housing" className={`group relative inline-flex items-center px-3 py-1.5 text-sm font-bold transition-colors ${darkMode ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-black'}`}>
                <span className="relative z-10">Housing</span>
                <span className={`pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}></span>
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-10 w-10 ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-black/5 text-gray-700'}`}
                aria-label="Toggle theme"
              >
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>
              <Link
                href="/settings"
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-10 w-10 ${darkMode ? 'hover:bg-white/5 text-white' : 'hover:bg-black/5 text-gray-700'}`}
                aria-label="Settings"
              >
                <Settings className="h-5 w-5" />
              </Link>
            </div>
          </nav>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-6 sm:pb-8">
        {error && (
          <div className={`mb-4 rounded-xl border px-4 py-3 ${
            darkMode 
              ? 'border-red-900 bg-red-900/20 text-red-200' 
              : 'border-red-200 bg-red-50 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Cover Image & Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl sm:rounded-[2rem] overflow-hidden mb-4 sm:mb-8 max-w-5xl mx-auto"
          style={{
            background: darkMode ? '#1F2937' : '#ffffff',
            border: darkMode ? '4px solid #374151' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: darkMode 
              ? '0 25px 50px -12px rgba(0,0,0,0.5)'
              : '0 4px 20px -4px rgba(99,102,241,0.15), 0 8px 40px -8px rgba(0,0,0,0.08)',
          }}
        >
          {/* Cover Video/Image */}
          <div className="relative h-48 sm:h-72 md:h-96 bg-gradient-to-br from-slate-700 to-slate-900 overflow-hidden">
            {/* Background Video */}
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/images/animations/UniShare_Promotional_Video_Generation.mp4" type="video/mp4" />
            </video>
            {/* Custom banner image overlay if set */}
            {(bannerPreview || profileData.banner) && (
              <img
                src={bannerPreview || profileData.banner}
                alt="Profile banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/25" />
            {isAdmin && (
              <button 
                onClick={() => bannerInputRef.current?.click()}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/20 backdrop-blur-md text-white px-2 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Change Banner</span>
              </button>
            )}
            <input
              ref={bannerInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerChange}
            />
          </div>

          {/* Profile Info */}
          <div className="relative px-4 sm:px-8 pb-4 sm:pb-8">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3 sm:gap-6 -mt-12 sm:-mt-16 md:-mt-20">
              <div className="relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-gray-600 to-gray-500 p-1 shadow-2xl">
                  <div className={`w-full h-full rounded-full flex items-center justify-center text-3xl sm:text-5xl md:text-6xl font-bold text-white overflow-hidden ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    {(avatarPreview || profileData.avatar) ? (
                      <img
                        src={avatarPreview || profileData.avatar}
                        alt={profileData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profileData.name?.charAt(0) || "U"
                    )}
                  </div>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-sky-600 text-white p-2 sm:p-3 rounded-full hover:bg-sky-700 transition-all shadow-lg"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Name & Info */}
              <div className="flex-1 text-center sm:text-left w-full mt-6 sm:mt-8 md:mt-10">
                {isEditMode ? (
                  <input
                    type="text"
                    value={editedData.display_name}
                    onChange={(e) => handleInputChange("display_name", e.target.value)}
                    className={`text-2xl sm:text-3xl md:text-4xl font-bold rounded-lg px-3 sm:px-4 py-2 mb-2 w-full ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900 border border-gray-300'}`}
                    placeholder="Display name"
                  />
                ) : (
                  <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {profileData.name}
                  </h1>
                )}

                {isEditMode && formErrors.display_name && (
                  <p className="text-xs text-red-500 mb-1">{formErrors.display_name.message}</p>
                )}

                {isEditMode && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-2">
                    <div className="text-left">
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Username</label>
                      <input
                        type="text"
                        value={editedData.custom_user_id}
                        onChange={(e) => handleInputChange("custom_user_id", e.target.value)}
                        placeholder="@your-id"
                        className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border`}
                      />
                      {formErrors.custom_user_id && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.custom_user_id.message}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <label className={`block text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Campus / Location</label>
                      <input
                        type="text"
                        value={editedData.campus_name}
                        onChange={(e) => handleInputChange("campus_name", e.target.value)}
                        placeholder="Campus, City"
                        className={`w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-300'} border`}
                      />
                      {formErrors.campus_name && (
                        <p className="text-xs text-red-500 mt-1">{formErrors.campus_name.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {isEditMode ? (
                  <textarea
                    value={editedData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    className={`text-sm sm:text-base rounded-lg px-4 py-2 w-full resize-none ${darkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100 border border-gray-300'}`}
                    rows={3}
                    placeholder="Tell the UniShare community about you"
                  />
                ) : (
                  <p className={`text-sm sm:text-base mb-3 sm:mb-4 max-w-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {profileData.bio || "Add a short bio to build trust with other students."}
                  </p>
                )}

                {isEditMode && formErrors.bio && (
                  <p className="text-xs text-red-500 mt-1">{formErrors.bio.message}</p>
                )}

                <div className={`flex flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <CalendarIcon />
                    <span>Joined {normalizedJoinDate}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-3">
                {isEditMode ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold disabled:opacity-70"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3 h-3 sm:w-4 sm:h-4" />}
                      <span className="hidden sm:inline">Save</span>
                      <span className="sm:hidden">Save</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Cancel</span>
                      <span className="sm:hidden">Close</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2 text-sm sm:text-base font-semibold"
                  >
                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Edit Profile</span>
                    <span className="sm:hidden">Edit</span>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Inline validation */}
        {(formErrors.form || formErrors.avatar) && (
          <div className={`mb-4 rounded-xl border px-4 py-3 ${darkMode ? 'border-amber-900 bg-amber-900/20 text-amber-100' : 'border-amber-200 bg-amber-50 text-amber-800'}`}>
            {formErrors.form || formErrors.avatar}
          </div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-8"
        >
          <StatCard icon={Package} label="Items Shared" value={profileData.stats.itemsShared} color="from-blue-600 to-blue-700" />
          <StatCard icon={Car} label="Rides Offered" value={profileData.stats.ridesOffered} color="from-slate-600 to-slate-700" />
          <StatCard icon={Home} label="Rooms Posted" value={profileData.stats.roomsPosted} color="from-gray-700 to-gray-800" />
          <StatCard icon={Ticket} label="Tickets" value={profileData.stats.tickets || 0} color="from-stone-700 to-stone-800" />
          <StatCard icon={TrendingUp} label="Response Rate" value={`${profileData.stats.responseRate}%`} color="from-teal-700 to-teal-800" />
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-[20px] overflow-hidden mb-4 sm:mb-8"
          style={{
            background: '#2C3E50',
            boxShadow: '0 20px 40px -10px rgba(44, 62, 80, 0.4), 0 8px 16px -4px rgba(0,0,0,0.2)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border-2 border-white/10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full border-2 border-white/10" />
          </div>
          <div className="absolute bottom-3 right-3 flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          </div>
          
          <div className="relative z-10 p-3">
            <div className="flex overflow-x-auto gap-2 scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
                <div className="lg:col-span-2 space-y-3 sm:space-y-6">
                  {/* Recent Activity */}
                  <ContentCard color="teal" darkMode={darkMode}>
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-white">
                      <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                      Recent Activity
                    </h2>
                    <div className="space-y-2 sm:space-y-4">
                      {activityItems.length === 0 && (
                        <p className="text-sm text-white/60">No activity yet. Start listing items, rides, or rooms.</p>
                      )}
                      {activityItems.map((item) => (
                        <motion.div
                          key={item.id}
                          whileHover={{ x: 5, scale: 1.01 }}
                          className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all cursor-pointer bg-white/10 hover:bg-white/15 border border-white/10"
                        >
                          <div className="p-2 sm:p-3 rounded-xl bg-blue-600 flex-shrink-0 shadow-lg">
                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm sm:text-base truncate text-white">
                              {item.action} <span className="text-sky-300">{item.item}</span>
                            </p>
                            <p className="text-xs sm:text-sm text-white/60">{item.time}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/40" />
                        </motion.div>
                      ))}
                    </div>
                  </ContentCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-3 sm:space-y-6">
                  {/* Quick Stats */}
                  <ContentCard color="teal" darkMode={darkMode}>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-white">Quick Stats</h3>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/10">
                        <span className="text-sm sm:text-base text-white/80">Total Listings</span>
                        <span className="font-bold text-sm sm:text-base px-2 py-0.5 rounded text-white bg-white/20">{quickStats.totalListings}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/10">
                        <span className="text-sm sm:text-base text-white/80">Active Listings</span>
                        <span className="font-bold text-sm sm:text-base px-2 py-0.5 rounded text-emerald-300 bg-emerald-500/20">{quickStats.activeListings}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/10">
                        <span className="text-sm sm:text-base text-white/80">Completed Deals</span>
                        <span className="font-bold text-sm sm:text-base px-2 py-0.5 rounded text-cyan-300 bg-cyan-500/20">{quickStats.completedDeals}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg bg-white/10">
                        <span className="text-sm sm:text-base text-white/80">Member Since</span>
                        <span className="font-bold text-sm sm:text-base text-white">{quickStats.memberSince}</span>
                      </div>
                    </div>
                  </ContentCard>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === "activity" && (
              <ContentCard color="blue" darkMode={darkMode}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">All Activity</h2>
                <div className="space-y-2 sm:space-y-3">
                  {activityItems.length === 0 && (
                    <p className="text-sm text-white/60">No activity yet.</p>
                  )}
                  {activityItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all cursor-pointer bg-white/10 hover:bg-white/15 border border-white/10"
                    >
                      <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex-shrink-0 shadow-lg shadow-blue-500/25">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate text-white">
                          {item.action} <span className="text-cyan-300">{item.item}</span>
                        </p>
                        <p className="text-xs sm:text-sm flex items-center gap-1 text-white/60">
                          {item.time}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-white/40" />
                    </motion.div>
                  ))}
                </div>
              </ContentCard>
            )}

            {/* Listings Tab */}
            {activeTab === "listings" && (
              <ContentCard color="green" darkMode={darkMode}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">My Listings</h2>
                <div className="space-y-3 sm:space-y-4">
                  {listings.length === 0 && (
                    <p className="text-sm text-white/60">No listings yet.</p>
                  )}
                  {listings.map((listing) => (
                    <motion.div
                      key={listing.id}
                      whileHover={{ scale: 1.02, x: 4 }}
                      className="p-4 sm:p-6 rounded-xl transition-all cursor-pointer bg-white/10 hover:bg-white/15 border border-white/10"
                    >
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full inline-block text-emerald-300 bg-emerald-500/20">
                            {listing.category}
                          </span>
                          <h3 className="text-base sm:text-xl font-bold mt-2 truncate text-white">{listing.title}</h3>
                        </div>
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ml-2 flex-shrink-0 ${
                          listing.status === "active"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-white/10 text-white/60"
                        }`}>
                          {listing.status}
                        </span>
                      </div>
                      <div className="flex gap-3 sm:gap-6 text-xs sm:text-sm text-white/70">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                          {listing.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                          {listing.interested} interested
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ContentCard>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <ContentCard color="slate" darkMode={darkMode}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Reviews & Ratings</h2>
                {reviews.length === 0 ? (
                  <p className="text-sm text-white/60">No reviews yet.</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {reviews.map((review) => (
                      <motion.div
                        key={review.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="p-4 sm:p-6 rounded-xl transition-all bg-white/10 hover:bg-white/15 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm sm:text-base truncate text-white">{review.from}</h4>
                            <p className="text-xs sm:text-sm text-white/60">{review.date}</p>
                          </div>
                          <div className="flex gap-0.5 sm:gap-1 flex-shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 sm:w-5 sm:h-5 ${
                                  i < review.rating ? "text-amber-400 fill-amber-400 drop-shadow-sm" : "text-white/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm sm:text-base text-white/80">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ContentCard>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <ContentCard color="slate" darkMode={darkMode}>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white">Account Settings</h2>
                <p className="text-sm mb-6 text-white/60">Update your profile information and preferences</p>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Display Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Display Name <span className="text-sky-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editedData.display_name}
                      onChange={(e) => handleInputChange("display_name", e.target.value)}
                      placeholder="Your display name"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-sky-500 focus:bg-white/15"
                    />
                    {formErrors.display_name && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.display_name.message}</p>
                    )}
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editedData.custom_user_id}
                      onChange={(e) => handleInputChange("custom_user_id", e.target.value)}
                      placeholder="@username"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-sky-500 focus:bg-white/15"
                    />
                    {formErrors.custom_user_id && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.custom_user_id.message}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Bio
                    </label>
                    <textarea
                      value={editedData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell others about yourself..."
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all resize-none bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-sky-500 focus:bg-white/15"
                    />
                    {formErrors.bio && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.bio.message}</p>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Email <span className="text-xs text-white/50">(cannot be changed)</span>
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none opacity-70 cursor-not-allowed bg-white/5 border-white/10 text-white/60"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-sky-500 focus:bg-white/15"
                    />
                    {formErrors.phone && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.phone.message}</p>
                    )}
                  </div>

                  {/* Campus/Location */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold mb-2 text-white/90">
                      Campus / Location
                    </label>
                    <input
                      type="text"
                      value={editedData.campus_name}
                      onChange={(e) => handleInputChange("campus_name", e.target.value)}
                      placeholder="Your campus or city"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 focus:outline-none transition-all bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-sky-500 focus:bg-white/15"
                    />
                    {formErrors.campus_name && (
                      <p className="mt-1 text-xs text-red-400">{formErrors.campus_name.message}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {formErrors.form && (
                    <div className="rounded-xl border-2 px-4 py-3 border-red-400/30 bg-red-500/20 text-red-200">
                      {formErrors.form}
                    </div>
                  )}

                  {/* Save Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Settings
                      </>
                    )}
                  </motion.button>
                </div>
              </ContentCard>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Footer */}
        <SmallFooter />
      </div>
      </div> {/* End of z-10 wrapper */}
    </div>
  );
}

// Small calendar icon to keep imports tidy
function CalendarIcon() {
  return <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
}








