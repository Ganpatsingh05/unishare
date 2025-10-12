'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Camera, Star, Key, TrendingUp, Volume2, Share2, ArrowLeft, 
  Edit3, ShoppingBag, Search, Home, Car, Ticket, MapPin, User, Settings,Bell,
  Save, X, Upload, Store, Eye, PartyPopper, Navigation, Calendar, LogOut,
  Copy, Check, ExternalLink, Phone, GraduationCap
} from 'lucide-react';
import logoImage from '../assets/images/logounishare1.png';
import { useAuth } from '../lib/contexts/UniShareContext';
import SmallFooter from '../_components/SmallFooter';
import { 
  getCurrentUserProfile, 
  updateUserProfile, 
  validateProfileDataEnhanced,
  validateCampusName
} from '../lib/api/userProfile';
import { fetchMyItems } from '../lib/api/marketplace';
import { fetchMyLostFoundItems } from '../lib/api/lostFound';
import { fetchMyRooms } from '../lib/api/housing';
import { getMyRides } from '../lib/api/rideSharing';
import { fetchMyTickets } from '../lib/api/tickets';

export default function ProfilePage() {
  const { user, isAuthenticated, authLoading, logout } = useAuth();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Loading...",
    bio: "Loading...",
    email: "",
    phone: "",
    campusName: "",
    profileImage: "https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg"
  });
  
  const [editForm, setEditForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  // Activity data state
  const [activityData, setActivityData] = useState({
    myItems: { count: 0, loading: true },
    lostItems: { count: 0, loading: true },
    foundItems: { count: 0, loading: true },
    myRooms: { count: 0, loading: true },
    myRides: { count: 0, loading: true },
    myTickets: { count: 0, loading: true }
  });

  // Fetch profile data on component mount
  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }
    
    if (isAuthenticated === false) {
      // User is not authenticated, stop loading and redirect to login
      setLoading(false);
      router.push('/login');
      return;
    }
    
    if (isAuthenticated === true) {
      fetchProfileData();
      fetchActivityData();
    }
  }, [isAuthenticated, authLoading, router]);

  // Check if profile is complete
  const isProfileComplete = (profile) => {
    return profile.display_name && 
           profile.bio && 
           profile.bio !== "Welcome to my UniShare profile! I'm a student passionate about sharing resources and connecting with fellow students." &&
           profile.campus_name && 
           profile.campus_name.length > 0;
  };

  // Auto-populate profile from Google auth data
  const createDefaultProfile = async () => {
    try {
      if (!user) return;

      const defaultProfile = {
        display_name: user.name || user.full_name || "Student",
        bio: "Welcome to my UniShare profile! I'm a student passionate about sharing resources and connecting with fellow students.",
        email: user.email || "",
        phone: "",
        campus_name: "",
        profile_image_url: user.picture || user.avatar_url || "",
        custom_user_id: ""
      };

      // Save the default profile to backend
      const response = await updateUserProfile(defaultProfile, null);
      
      if (response.success) {
        setProfileData({
          name: defaultProfile.display_name,
          bio: defaultProfile.bio,
          email: defaultProfile.email,
          phone: defaultProfile.phone,
          campusName: defaultProfile.campus_name,
          profileImage: defaultProfile.profile_image_url || "https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg",
          customUserId: defaultProfile.custom_user_id
        });
        
        setIsNewUser(true);
        setShowProfileCompletion(true);
      }
    } catch (error) {
      console.error('Error creating default profile:', error);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getCurrentUserProfile();
      
      if (response.success && (response.profile || response.data)) {
        const profile = response.profile || response.data;
        
        // Check if profile is complete
        if (!isProfileComplete(profile)) {
          setIsNewUser(true);
          setShowProfileCompletion(true);
        }
        
        setProfileData({
          name: profile.display_name || user?.name || user?.full_name || "Your Name",
          bio: profile.bio || "Welcome to my UniShare profile! I'm a student passionate about sharing resources and connecting with fellow students.",
          email: profile.email || user?.email || "",
          phone: profile.phone_number || "",
          campusName: profile.campus_name || "",
          profileImage: profile.profile_image_url || user?.picture || user?.avatar_url || "https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg",
          customUserId: profile.custom_user_id || ""
        });
      } else {
        // No profile exists - create default profile from Google auth
        await createDefaultProfile();
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data. Please refresh the page.');
      
      // Use fallback data with Google auth info
      setProfileData({
        name: user?.name || user?.full_name || "Your Name",
        bio: "Welcome to my UniShare profile! I'm a student passionate about sharing resources and connecting with fellow students.",
        email: user?.email || "",
        phone: "",
        campusName: "",
        profileImage: user?.picture || user?.avatar_url || "https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg",
        customUserId: ""
      });
      
      setIsNewUser(true);
      setShowProfileCompletion(true);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all activity data
  const fetchActivityData = async () => {
    if (!isAuthenticated) return;

    const fetchActivities = async () => {
      try {
        // Fetch marketplace items (My Items)
        try {
          const itemsResponse = await fetchMyItems({ limit: 1 });
          setActivityData(prev => ({
            ...prev,
            myItems: { count: itemsResponse.total || itemsResponse.data?.length || 0, loading: false }
          }));
        } catch (error) {
          console.error('Error fetching my items:', error);
          setActivityData(prev => ({
            ...prev,
            myItems: { count: 0, loading: false }
          }));
        }

        // Fetch lost and found items
        try {
          const lostFoundResponse = await fetchMyLostFoundItems();
          if (lostFoundResponse.success && lostFoundResponse.data) {
            const lostItems = lostFoundResponse.data.filter(item => item.mode === 'lost') || [];
            const foundItems = lostFoundResponse.data.filter(item => item.mode === 'found') || [];
            
            setActivityData(prev => ({
              ...prev,
              lostItems: { count: lostItems.length, loading: false },
              foundItems: { count: foundItems.length, loading: false }
            }));
          } else {
            setActivityData(prev => ({
              ...prev,
              lostItems: { count: 0, loading: false },
              foundItems: { count: 0, loading: false }
            }));
          }
        } catch (error) {
          console.error('Error fetching lost/found items:', error);
          setActivityData(prev => ({
            ...prev,
            lostItems: { count: 0, loading: false },
            foundItems: { count: 0, loading: false }
          }));
        }

        // Fetch room listings
        try {
          const roomsResponse = await fetchMyRooms({ limit: 1 });
          setActivityData(prev => ({
            ...prev,
            myRooms: { count: roomsResponse.total || roomsResponse.data?.length || 0, loading: false }
          }));
        } catch (error) {
          console.error('Error fetching my rooms:', error);
          setActivityData(prev => ({
            ...prev,
            myRooms: { count: 0, loading: false }
          }));
        }

        // Fetch ride shares
        try {
          const ridesResponse = await getMyRides({ limit: 1 });
          setActivityData(prev => ({
            ...prev,
            myRides: { count: ridesResponse.total || ridesResponse.data?.length || 0, loading: false }
          }));
        } catch (error) {
          console.error('Error fetching my rides:', error);
          setActivityData(prev => ({
            ...prev,
            myRides: { count: 0, loading: false }
          }));
        }

        // Fetch tickets
        try {
          const ticketsResponse = await fetchMyTickets({ limit: 1 });
          setActivityData(prev => ({
            ...prev,
            myTickets: { count: ticketsResponse.total || ticketsResponse.data?.length || 0, loading: false }
          }));
        } catch (error) {
          console.error('Error fetching my tickets:', error);
          setActivityData(prev => ({
            ...prev,
            myTickets: { count: 0, loading: false }
          }));
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
        // Set all counts to 0 and loading to false on general error
        setActivityData({
          myItems: { count: 0, loading: false },
          lostItems: { count: 0, loading: false },
          foundItems: { count: 0, loading: false },
          myRooms: { count: 0, loading: false },
          myRides: { count: 0, loading: false },
          myTickets: { count: 0, loading: false }
        });
      }
    };

    fetchActivities();
  };

  const handleProfileEdit = () => {
    const newEditForm = {
      display_name: profileData.name,
      bio: profileData.bio,
      phone: profileData.phone,
      campus_name: profileData.campusName,
      custom_user_id: profileData.customUserId
    };
    
    setEditForm(newEditForm);
    setPreviewImage(null);
    setProfileImageFile(null);
    setValidationErrors({});
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setValidationErrors({});

      // Validate the form data
      const validation = validateProfileDataEnhanced(editForm, profileImageFile);
      if (!validation.valid) {
        setValidationErrors(validation.errors);
        return;
      }

      // Update profile via API
      const response = await updateUserProfile(editForm, profileImageFile);
      
      if (response.success) {
        // Update local state with the response data
        const updatedProfile = response.profile || response.data || {};
        setProfileData({
          name: updatedProfile.display_name || editForm.display_name,
          bio: updatedProfile.bio || editForm.bio,
          email: profileData.email, // Keep existing email - not editable in forms
          phone: updatedProfile.phone_number || editForm.phone,
          campusName: updatedProfile.campus_name || editForm.campus_name,
          profileImage: updatedProfile.profile_image_url || profileData.profileImage,
          customUserId: updatedProfile.custom_user_id || editForm.custom_user_id
        });
        
        setIsEditingProfile(false);
        setPreviewImage(null);
        setProfileImageFile(null);
        
        // Close profile completion modal if this was from new user onboarding
        if (isNewUser) {
          setShowProfileCompletion(false);
          setIsNewUser(false);
        }
      } else {
        setError(response.message || 'Failed to update profile. Please try again.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditForm({});
    setPreviewImage(null);
    setProfileImageFile(null);
    setValidationErrors({});
    setError(null);
  };

  // Profile completion handlers
  const handleCompleteProfile = () => {
    setEditForm({
      display_name: profileData.name,
      bio: profileData.bio,
      phone: profileData.phone,
      campus_name: profileData.campusName,
      custom_user_id: profileData.customUserId
    });
    setShowProfileCompletion(false);
    setIsEditingProfile(true);
  };

  const handleSkipProfileCompletion = () => {
    setShowProfileCompletion(false);
    setIsNewUser(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Logout function should handle redirect
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Account Settings Button Handlers
  const handlePrivacySettings = () => {
    router.push('/settings');
  };

  const handleYourActivity = () => {
    // For now, we'll leave this as a placeholder
    // This can be implemented later with activity tracking
    alert('Activity tracking will be available soon!');
  };

  const handleNotifications = () => {
    // Link to notifications section of settings
    router.push('/settings#notifications');
  };

  const handleShareProfile = async () => {
    try {
      const profileUrl = `${window.location.origin}/profile/${user?.id || 'public'}`;
      
      if (navigator.share) {
        // Use native sharing if available (mobile)
        await navigator.share({
          title: `${profileData.name}'s UniShare Profile`,
          text: `Check out ${profileData.name}'s profile on UniShare!`,
          url: profileUrl,
        });
      } else {
        // Copy to clipboard for desktop
        await navigator.clipboard.writeText(profileUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing profile:', error);
      // Fallback: copy to clipboard
      try {
        const profileUrl = `${window.location.origin}/profile/${user?.id || 'public'}`;
        await navigator.clipboard.writeText(profileUrl);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
      } catch (clipboardError) {
        console.error('Clipboard error:', clipboardError);
        alert('Unable to copy link. Please copy the URL manually.');
      }
    }
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any existing image validation errors
      if (validationErrors.profileImage) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.profileImage;
          return newErrors;
        });
      }
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  // Show loading spinner while fetching data or checking authentication
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">
            {authLoading ? 'Checking authentication...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    );
  }

  // Show error state if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 mb-4">Please log in to view your profile.</p>
          <Link 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%); /* Dark gradient background */
          overflow-x: hidden;
          min-height: 100vh;
        }

        .profile-container {
          min-height: 100vh;
          position: relative;
        }

        /* Background Grid */
        .bg-grid {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: 
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px 45px),
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px 45px);
          background-size: 45px 45px;
          background-position: 50% 50%;
          mask-image: linear-gradient(-20deg, transparent 50%, white);
          -webkit-mask-image: linear-gradient(-20deg, transparent 50%, white);
          pointer-events: none;
          z-index: 0;
          opacity: 0.3;
        }

        /* Logo and Brand positioned exactly like other pages */
        .header-brand {
          position: fixed;
          top: 0.5rem; /* Moved up from 1rem */
          left: 2rem;
          z-index: 150;
        }

        .header-brand .logo-container {
          width: 5rem; /* w-20 - 80px */
          height: 5rem; /* h-20 - 80px */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
        }

        .header-brand .logo-image {
          height: 4rem; /* h-16 - 64px */
          width: 4rem; /* w-16 - 64px */
          transition: all 0.3s ease;
          transform: scale(1);
          filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.2));
        }

        .header-brand:hover .logo-image {
          transform: scale(1.25);
        }

        .brand-wordmark {
          font-weight: bold;
          font-size: 1.5rem; /* text-2xl */
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        /* Back Navigation Button - matching Header.jsx structure */
        .back-nav-button {
          position: fixed;
          top: 1rem;
          right: 2rem;
          z-index: 150;
          width: 3rem; /* w-12 */
          height: 3rem; /* h-12 */
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          cursor: pointer;
          color: #374151; /* text-gray-700 */
        }

        .back-nav-button:hover {
          background: #f9fafb; /* hover:bg-gray-50 */
          transform: scale(1.05);
          color: #111827; /* hover:text-gray-900 */
        }

        /* Dark mode styles for back button */
        @media (prefers-color-scheme: dark) {
          .back-nav-button {
            background: #1f2937; /* dark:bg-gray-800 */
            border-color: rgba(255, 255, 255, 0.1);
            color: #e5e7eb; /* dark:text-gray-200 */
          }
          
          .back-nav-button:hover {
            background: #374151; /* dark:hover:bg-gray-700 */
            color: white; /* dark:hover:text-white */
          }
        }

        /* Mobile-specific styles */
        @media (max-width: 768px) {
          .header-brand {
            left: 1rem; /* Shift left on mobile */
            top: 0.5rem; /* Moved up from 1rem on mobile */
          }
          
          .header-brand .logo-container {
            width: 3rem; /* Smaller logo container - 48px */
            height: 3rem;
          }
          
          .header-brand .logo-image {
            width: 2.5rem; /* Smaller logo image - 40px */
            height: 2.5rem;
          }
          
          .back-nav-button {
            right: 1rem; /* Adjust back button position */
            width: 2.5rem; /* Smaller back button */
            height: 2.5rem;
          }

          /* Mobile notification bell styling */
          .mobile-notification-bell {
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 150;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            transition: all 0.3s ease;
            cursor: pointer;
            color: #374151;
          }

          .mobile-notification-bell:hover {
            background: rgba(249, 250, 251, 0.95);
            transform: scale(1.05);
            color: #111827;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }

          /* Dark mode styles for mobile notification bell */
          @media (prefers-color-scheme: dark) {
            .mobile-notification-bell {
              background: rgba(31, 41, 55, 0.9);
              border-color: rgba(255, 255, 255, 0.1);
              color: #e5e7eb;
            }
            
            .mobile-notification-bell:hover {
              background: rgba(55, 65, 81, 0.95);
              color: white;
            }
          }
        }

        .brand-uni {
          background: linear-gradient(to right, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-share {
          background: linear-gradient(to right, #3b82f6, #1d4ed8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Header - Fixed with Gradual Fade and Move Animation */
        .profile-header {
          position: fixed;
          top: -50px;
          height: 260px;
          width: 100%;
          z-index: 10;
          background: rgba(255, 255, 255, 0);
          animation: headerGradualFade both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
        }
        
        /* For larger screens (desktop) */
        @media (min-width: 768px) {
          .profile-header {
            height: 280px;
          }
        }

        @keyframes headerGradualFade {
          0% {
            top: 0px;
            height: 260px;
            background: rgba(15, 23, 42, 0); /* slate-900 transparent */
            box-shadow: none;
            backdrop-filter: blur(0px);
          }
          10% {
            top: 0px;
            height: 240px;
            background: rgba(15, 23, 42, 0.1);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
            backdrop-filter: blur(2px);
          }
          25% {
            top: 0px;
            height: 200px;
            background: rgba(15, 23, 42, 0.25);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(4px);
          }
          40% {
            top: 0px;
            height: 160px;
            background: rgba(15, 23, 42, 0.4);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
            backdrop-filter: blur(6px);
          }
          50% {
            top: 0px;
            height: 80px; /* Height reduction stops here - reduced further */
            background: rgba(15, 23, 42, 0.5);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.18);
            backdrop-filter: blur(7px);
          }
          55% {
            top: 0px;
            height: 80px; /* Height stays constant from here */
            background: rgba(15, 23, 42, 0.55);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
          }
          70% {
            top: 0px;
            height: 80px; /* Height remains constant */
            background: rgba(15, 23, 42, 0.65);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
            backdrop-filter: blur(10px);
          }
          85% {
            top: 0px;
            height: 80px; /* Height remains constant */
            background: rgba(15, 23, 42, 0.7);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(12px);
          }
          100% {
            top: 0px;
            height: 80px; /* Final height stays at 80px */
            background: rgba(15, 23, 42, 0.75); /* 75% opacity for glass effect */
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(15px);
          }
        }

        /* Dynamic Island Container */
        .island-container {
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 40px;
          border-radius: 40px;
          background: black;
          z-index: 100;
        }

        .island {
          filter: url(#fancy-goo);
        }

        .island-bar {
          width: 200px;
          height: 40px;
          border-radius: 40px;
          background: black;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }

        .island-bar::after {
          content: '';
          position: absolute;
          left: 15px; /* Positioned for better spacing */
          top: 50%;
          transform: translateY(-50%);
          width: 8px; /* Small and simple */
          height: 8px; /* Small and simple */
          background: #ff3b30;
          border-radius: 50%;
          z-index: 2;
          opacity: 1;
          transition: opacity 0.3s ease;
          animation: redDotFade both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
        }

        /* Profile picture in island */
        .island-profile-pic {
          position: absolute;
          left: 15px; /* Match red dot position */
          top: 50%;
          transform: translateY(-50%);
          width: 20px; /* Slightly smaller */
          height: 20px; /* Slightly smaller */
          border-radius: 50%;
          z-index: 3;
          opacity: 0;
          object-fit: cover;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: profilePicFade both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
        }

        @keyframes redDotFade {
          0% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0; /* Completely hidden at end */
          }
        }

        @keyframes profilePicFade {
          0% {
            opacity: 0;
          }
          70% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Avatar */
        .avatar {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: black;
          position: fixed;
          left: 50%;
          top: 65px;
          transform: translateX(-50%);
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
          animation: avatarShrink both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
          z-index: 99;
        }

        /* === THIS IS THE FIX === */
        @keyframes avatarShrink {
          to {
            /* Move up 90px to center on the island and scale to 0 to disappear */
            transform: translateX(-50%) translateY(-90px) scale(0);
          }
        }

        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: avatarFade both linear;
          animation-timeline: scroll(root);
          animation-range: 0 160px;
        }

        @keyframes avatarFade {
          to {
            filter: blur(10px);
            opacity: 0;
          }
        }

        /* Name */
        .profile-name {
          position: fixed;
          top: 290px; /* Increased from 270px to add space */
          left: 50%;
          transform: translateX(-50%) translateY(-100%);
          font-size: 2rem; /* Reduced from 3rem */
          font-weight: 700;
          color: #f1f5f9; /* Updated to match dark theme */
          white-space: nowrap;
          z-index: 101; /* Higher than island (100) to appear on top */
          animation: nameSlideUp both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
          
          /* Text truncation for dynamic island */
          max-width: 300px; /* Increased for longer names */
          overflow: hidden;
          text-overflow: ellipsis;
          padding: 0 25px 0 40px; /* Asymmetric padding - more space for profile pic */
          text-align: center; /* Center align within available space */
          
          /* Responsive behavior for long names */
          @media (max-width: 480px) {
            font-size: 1.5rem;
            max-width: 250px;
            top: 310px; /* Move down slightly on mobile */
          }
        }

        @keyframes nameSlideUp {
          0% {
            top: 290px; /* Updated to match new starting position */
            transform: translateX(-50%) translateY(-100%);
            font-size: 2rem; /* Updated to match new smaller size */
            color: #f1f5f9; /* light slate for dark background */
            max-width: 100vw; /* Full width at start */
            padding: 0; /* No padding at start */
            left: 50%; /* Centered at start */
          }
          100% {
            top: 40px; /* Move into the dynamic island area */
            transform: translateX(-50%) translateY(-50%); /* Keep centered horizontally */
            font-size: 0.85rem; /* Island text size */
            color: #ffffff; /* White text for contrast against black island */
            max-width: 160px; /* Truncated width in island */
            padding: 0 25px 0 40px; /* Less padding, more space for profile pic on left */
            left: 50%; /* Stay centered */
          }
        }

        /* Main Content */
        .main-content {
          min-height: calc(100vh - 200px);
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 22rem; /* Increased padding to prevent overlap with name */
          padding-bottom: 0; /* Remove bottom padding to eliminate gap */
          position: relative;
          z-index: 5;
        }

        /* Bio Section */
        .bio-section {
          width: 100%;
          max-width: 600px;
          padding: 0 1rem;
          margin-bottom: 2rem;
        }

        .bio-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bio-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bio-text {
          color: #e2e8f0;
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 500;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Profile Picture Edit Icon */
        .profile-edit-icon {
          position: fixed;
          top: 170px; /* Avatar top (65px) + avatar height (130px) - icon size/2 (18px) */
          left: calc(50% + 45px); /* Avatar center + avatar radius (65px) - icon radius (18px) */
          width: 36px;
          height: 36px;
          background: rgba(59, 130, 246, 0.95);
          border: 2px solid rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          transition: all 0.3s ease;
          animation: editIconFade both linear;
          animation-timeline: scroll(root);
          animation-range: 0 200px;
          z-index: 9999;
        }

        .profile-edit-icon:hover {
          background: rgba(29, 78, 216, 0.95);
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
        }

        @keyframes editIconFade {
          to {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        /* Profile Navigation Sections */
        .profile-nav-section, .account-section {
          width: 100%;
          max-width: 600px;
          padding: 0 1rem;
          margin-bottom: 0; /* Remove bottom margin to eliminate gap */
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9; /* light color for dark background */
          margin-bottom: 1rem;
          padding-left: 0.5rem;
        }

        /* Activity Cards Grid */
        .activity-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .activity-card {
          background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(51, 65, 85, 0.9));
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.25rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          position: relative;
          overflow: visible;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: center;
        }

        .activity-card:hover {
          transform: translateY(-10px) scale(1.06);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(79, 172, 254, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .activity-card-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
          overflow: visible;
        }

        .activity-card-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 
            0 6px 16px rgba(79, 172, 254, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
          position: relative;
          overflow: visible;
        }
          overflow: hidden;
        }

        .activity-card:hover .activity-card-icon {
          transform: scale(1.08) rotate(3deg);
          box-shadow: 
            0 10px 24px rgba(79, 172, 254, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }

        /* Unique gradients for each card type */
        .activity-card:nth-child(1) .activity-card-icon {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .activity-card:nth-child(2) .activity-card-icon {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 6px 16px rgba(240, 147, 251, 0.4);
        }

        .activity-card:nth-child(3) .activity-card-icon {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4);
        }

        .activity-card:nth-child(4) .activity-card-icon {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          box-shadow: 0 6px 16px rgba(67, 233, 123, 0.4);
        }

        .activity-card:nth-child(5) .activity-card-icon {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          box-shadow: 0 6px 16px rgba(250, 112, 154, 0.4);
        }

        .activity-card:nth-child(6) .activity-card-icon {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          box-shadow: 0 6px 16px rgba(168, 237, 234, 0.4);
        }

        /* Notification badge for activity cards */
        .activity-notification-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          border-radius: 12px;
          min-width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          border: 3px solid #0f1419;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
          animation: badgePulse 2s ease-in-out infinite;
        }

        @keyframes badgePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .activity-card-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
          line-height: 1.2;
          letter-spacing: -0.025em;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .activity-card-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: auto;
          padding-top: 0.25rem;
        }

        .activity-card-count {
          color: #cbd5e1;
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 10px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .activity-card:hover .activity-card-count {
          background: rgba(255, 255, 255, 0.15);
          color: #f1f5f9;
          transform: scale(1.05);
        }

        /* Medium screens (tablets) */
        @media (max-width: 768px) and (min-width: 641px) {
          .activity-card-icon {
            width: 52px;
            height: 52px;
          }
          .activity-card-icon svg {
            width: 30px !important;
            height: 30px !important;
          }
        }

        @media (max-width: 640px) {
          .activity-cards-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          
          .activity-card {
            padding: 1.25rem 1rem;
            border-radius: 18px;
          }
          
          .activity-card-icon {
            width: 64px;
            height: 64px;
            border-radius: 18px;
          }

          .activity-card-icon svg {
            width: 42px !important;
            height: 42px !important;
          }
          
          .activity-card-title {
            font-size: 0.8rem;
            line-height: 1.2;
          }

          .activity-notification-badge {
            min-width: 24px;
            height: 24px;
            font-size: 12px;
            top: -6px;
            right: -6px;
            border: 3px solid white;
          }
          
          .activity-card-count {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
            border-radius: 10px;
          }
        }

        .menu-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 0;
          margin: 0;
          width: 100%;
          max-width: 600px;
          padding: 0 1rem;
        }

        .menu-item {
          width: 100%;
        }

        .context-info {
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 8px;
          color: #94a3b8; /* slate-400 */
          font-size: 14px;
        }

        .menu-button, .menu-link {
          width: 100%;
          height: 44px;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0 1rem;
          border: 2px solid transparent;
          border-radius: 8px;
          background: rgba(30, 41, 59, 0.8); /* dark slate with transparency */
          backdrop-filter: blur(12px);
          color: #e2e8f0; /* light slate */
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
          justify-content: space-between;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .menu-arrow {
          font-size: 18px;
          color: #64748b; /* slate-500 */
          transition: all 0.2s ease;
          margin-left: auto;
        }

        .menu-button:hover, .menu-link:hover,
        .menu-button:focus-visible, .menu-link:focus-visible {
          background: rgba(51, 65, 85, 0.9); /* darker slate on hover */
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .menu-link:hover .menu-arrow {
          color: #3b82f6; /* blue on hover */
          transform: translateX(4px);
        }

        .menu-button:active, .menu-link:active {
          transform: translateY(0);
        }

        .menu-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
        }

        .star-icon {
          color: #fbbf24;
          fill: #fbbf24;
        }

        /* Safari/webkit scroll animation support */
        @supports (animation-timeline: scroll()) {
          /* Animations are defined above */
        }

        @media (max-width: 640px) {
          .profile-name {
            font-size: 2rem;
          }
          
          .menu-list {
            max-width: calc(100vw - 2rem);
          }

          .bio-section {
            padding: 0 0.75rem; /* Adjust padding for mobile */
          }

          .bio-container {
            padding: 1.25rem; /* Slightly less padding on mobile */
          }
        }

        /* Edit Profile Modal */
        .edit-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .edit-modal {
          background: linear-gradient(135deg, #1e293b, #334155); /* dark slate gradient */
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .edit-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .edit-modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9; /* light slate */
        }

        .close-btn {
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: none;
          background: rgba(51, 65, 85, 0.8); /* slate-700 */
          color: #cbd5e1; /* slate-300 */
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(71, 85, 105, 0.9); /* slate-600 */
          color: #f1f5f9;
        }

        .edit-modal-content {
          padding: 1.5rem;
        }

        .profile-image-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 2rem;
        }

        .profile-image-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .upload-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(51, 65, 85, 0.8); /* slate-700 */
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #cbd5e1; /* slate-300 */
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .upload-btn:hover {
          background: rgba(71, 85, 105, 0.9); /* slate-600 */
          border-color: rgba(59, 130, 246, 0.5);
          color: #f1f5f9;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: #cbd5e1; /* slate-300 */
          margin-bottom: 0.5rem;
          font-size: 14px;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.2s ease;
          background: rgba(51, 65, 85, 0.8); /* slate-700 */
          color: #f1f5f9; /* slate-100 */
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #64748b; /* slate-500 */
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
          background: rgba(71, 85, 105, 0.9);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-secondary, .btn-primary {
          flex: 1;
          height: 44px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn-secondary {
          background: rgba(51, 65, 85, 0.8); /* slate-700 */
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1; /* slate-300 */
        }

        .btn-secondary:hover {
          background: rgba(71, 85, 105, 0.9); /* slate-600 */
          color: #f1f5f9;
        }

        .btn-primary {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border: 1px solid #3b82f6;
          color: white;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-color: #2563eb;
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
        }

        /* Error states */
        .form-error {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-field.error input,
        .form-field.error textarea {
          border-color: #ef4444;
          box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.3);
        }

        /* Disabled states */
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        /* Loading spinner */
        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* Inline spinner for activity cards */
        .inline-spinner {
          display: inline-block;
          width: 12px;
          height: 12px;
          border: 1.5px solid transparent;
          border-top: 1.5px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Logout button styling */
        .logout-button {
          color: #ef4444 !important;
        }

        .logout-button:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
        }

        .logout-button .menu-icon {
          color: #ef4444 !important;
        }

        /* Share Profile Button Success State */
        .menu-button.success {
          background: rgba(16, 185, 129, 0.1) !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
        }

        .menu-button.success .menu-icon {
          color: #10b981 !important;
        }

        /* Account Settings Button Hover Effects */
        .menu-button:hover .menu-arrow {
          transform: scale(1.1);
        }

        .menu-button:active {
          transform: translateY(1px);
        }

        /* Success feedback for sharing */
        .share-success {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: #10b981;
        }

        /* Toast Animation */
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }

        /* Profile Completion Modal */
        .profile-completion-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(15px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .profile-completion-modal {
          background: linear-gradient(135deg, #1e293b, #334155);
          border-radius: 20px;
          width: 100%;
          max-width: 450px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.1);
          animation: slideInFromBottom 0.4s ease-out;
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .completion-modal-header {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          padding: 1.5rem;
          text-align: center;
          position: relative;
        }

        .completion-modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.1) 100%);
          pointer-events: none;
        }

        .completion-welcome-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          border: 3px solid rgba(255, 255, 255, 0.3);
        }

        .completion-modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
        }

        .completion-modal-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .completion-modal-content {
          padding: 1.5rem;
        }

        .completion-feature-list {
          list-style: none;
          margin: 1rem 0;
          padding: 0;
        }

        .completion-feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          margin-bottom: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .completion-feature-item:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(3px);
        }

        .completion-feature-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .completion-feature-text {
          color: #e2e8f0;
          font-size: 0.85rem;
          line-height: 1.3;
        }

        .completion-modal-actions {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-complete-primary {
          flex: 2;
          height: 44px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #10b981, #059669);
          border: 1px solid #10b981;
          color: white;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          font-size: 0.9rem;
        }

        .btn-complete-primary:hover {
          background: linear-gradient(135deg, #059669, #047857);
          border-color: #059669;
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
          transform: translateY(-2px);
        }

        .btn-complete-secondary {
          flex: 1;
          height: 44px;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(51, 65, 85, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .btn-complete-secondary:hover {
          background: rgba(71, 85, 105, 0.9);
          color: #f1f5f9;
          transform: translateY(-1px);
        }

        /* Profile Page Mobile Navigation Fixes */
        @media (max-width: 768px) {
          /* Reduce body bottom padding for profile page */
          body {
            padding-bottom: 63px !important; /* Reduced for shorter navbar */
          }
          
          /* Ensure last content section has minimal bottom margin */
          .account-section {
            margin-bottom: 0.25rem !important;
          }
          
          .activity-cards-grid {
            margin-bottom: 0.5rem !important; /* Reduced bottom margin */
          }
          
          /* Main content specific adjustments */
          .main-content {
            padding-bottom: 0 !important; /* No bottom padding */
          }
          
          /* Enhanced mobile nav positioning and sizing for profile page */
          .mobile-bottom-nav {
            bottom: 0 !important;
            padding-bottom: env(safe-area-inset-bottom, 0) !important;
            height: auto !important;
            min-height: 62px; /* Reduced from 64px */
          }
          
          /* Profile page navbar content styling */
          .mobile-bottom-nav .flex {
            padding: 6px 16px !important; /* Reduced padding for less height */
          }
          
          /* Keep icon size same but increase spacing */
          .mobile-bottom-nav .flex a {
            padding: 8px 8px !important; /* Increased vertical padding */
          }
          
          .mobile-bottom-nav svg {
            width: 18px !important; /* Keep same size */
            height: 18px !important;
            stroke-width: 1.5 !important; /* Reduced stroke width for less bold icons */
          }
          
          .mobile-bottom-nav span {
            font-size: 11px !important; /* Keep same text size */
            font-weight: 150 !important; /* Reduced from 300 to extra light weight */
            margin-top: 2px !important; /* More space between icon and text */
            letter-spacing: -0.01em !important; /* Reduce space between letters */
          }
          
          /* Profile page container adjustments */
          .profile-container {
            padding-bottom: 0 !important;
            margin-bottom: 0 !important;
          }
          
          /* Menu list adjustments */
          .menu-list {
            margin-bottom: 0 !important;
            padding-bottom: 0.5rem !important;
          }
        }
      `}</style>

      {/* SVG Filters */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="fancy-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="min-h-screen">
        <div className="profile-container">
        {/* Header Brand and Navigation - positioned exactly like other pages */}
        {/* Desktop */}
        <div className="hidden md:block">
          <Link href="/" className="header-brand group cursor-pointer">
            <span className="sr-only">UniShare Home</span>
            <div className="flex items-center gap-3">
              <div className="logo-container">
                <Image
                  src={logoImage}
                  alt="UniShare Logo"
                  width={64}
                  height={64}
                  className="logo-image object-contain bg-transparent"
                  priority
                />
              </div>
              <span className="brand-wordmark">
                <span className="brand-uni">Uni</span>
                <span className="brand-share">Share</span>
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <Link href="/" className="header-brand group cursor-pointer">
            <span className="sr-only">UniShare Home</span>
            <div className="logo-container">
              <Image
                src={logoImage}
                alt="UniShare Logo"
                width={40}
                height={40}
                className="logo-image object-contain bg-transparent"
                priority
              />
            </div>
          </Link>
          
          {/* Mobile notification bell icon */}
          <button
            onClick={handleNotifications}
            className="mobile-notification-bell"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
        </div>

        {/* Background Grid */}
        <div className="bg-grid"></div>

        {/* Header */}
        <header className="profile-header">
          {/* Dynamic Island */}
          <div className="island-container">
            <div className="island">
              <div className="island-bar">
                {/* Profile picture that appears in island */}
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="island-profile-pic"
                />
              </div>
              
              {/* Avatar */}
              <div className="avatar">
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                />
              </div>
              
              {/* Edit Icon - positioned relative to avatar */}
              <button 
                onClick={handleProfileEdit}
                className="profile-edit-icon"
                aria-label="Edit Profile"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>

          {/* Name */}
          <h1 className="profile-name">{profileData.name}.</h1>
        </header>

        {/* Main Content */}
      <div className="main-content">
          {/* Bio/About Section */}
          <div className="bio-section">
            <div className="bio-container">
              <div className="bio-content">
                <p className="bio-text">{profileData.bio}</p>
                {isNewUser && (
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '0.75rem', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    border: '1px solid rgba(59, 130, 246, 0.3)', 
                    borderRadius: '12px', 
                    textAlign: 'center' 
                  }}>
                    <p style={{ color: '#3b82f6', fontSize: '0.875rem', margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                      📝 Complete your profile to unlock all features
                    </p>
                    <button 
                      onClick={handleCompleteProfile}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Complete Now
                    </button>
                  </div>
                )}
                <div className="contact-info">
                  {profileData.phone && (
                    <div className="contact-item">
                      <Phone size={16} />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  {profileData.campusName && (
                    <div className="contact-item">
                      <GraduationCap size={16} />
                      <span>{profileData.campusName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Profile Navigation Menu */}
          <div className="profile-nav-section">
            <h2 className="section-title">My Activities</h2>
            <div className="activity-cards-grid">
              <Link href="/profile/my-items" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <Store size={40} />
                    {!activityData.myItems.loading && activityData.myItems.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.myItems.count > 99 ? '99+' : activityData.myItems.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">My Items</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.myItems.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Marketplace'
                    )}
                  </span>
                </div>
              </Link>

              <Link href="/profile/my-lost-items" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <Eye size={40} />
                    {!activityData.lostItems.loading && activityData.lostItems.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.lostItems.count > 99 ? '99+' : activityData.lostItems.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">Lost Items</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.lostItems.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Reported'
                    )}
                  </span>
                </div>
              </Link>

              <Link href="/profile/my-found-items" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <PartyPopper size={40} />
                    {!activityData.foundItems.loading && activityData.foundItems.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.foundItems.count > 99 ? '99+' : activityData.foundItems.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">Found Items</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.foundItems.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Discovered'
                    )}
                  </span>
                </div>
              </Link>

              <Link href="/profile/my-rooms" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <MapPin size={40} />
                    {!activityData.myRooms.loading && activityData.myRooms.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.myRooms.count > 99 ? '99+' : activityData.myRooms.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">My Rooms</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.myRooms.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Housing'
                    )}
                  </span>
                </div>
              </Link>

              <Link href="/profile/my-rides" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <Navigation size={40} />
                    {!activityData.myRides.loading && activityData.myRides.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.myRides.count > 99 ? '99+' : activityData.myRides.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">My Rides</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.myRides.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Transportation'
                    )}
                  </span>
                </div>
              </Link>

              <Link href="/profile/my-tickets" className="activity-card">
                <div className="activity-card-header">
                  <div className="activity-card-icon">
                    <Calendar size={40} />
                    {!activityData.myTickets.loading && activityData.myTickets.count > 0 && (
                      <span className="activity-notification-badge">
                        {activityData.myTickets.count > 99 ? '99+' : activityData.myTickets.count}
                      </span>
                    )}
                  </div>
                  <h3 className="activity-card-title">My Tickets</h3>
                </div>
                <div className="activity-card-footer">
                  <span className="activity-card-count">
                    {activityData.myTickets.loading ? (
                      <div className="inline-spinner"></div>
                    ) : (
                      'Events'
                    )}
                  </span>
                </div>
              </Link>
            </div>
          </div>

          {/* Account Settings */}
          <div className="account-section">
            <h2 className="section-title">Account Settings</h2>
            <ul className="menu-list">
              <li className="menu-item">
                <button className="menu-button" onClick={handlePrivacySettings}>
                  <Settings className="menu-icon" />
                  <span>Privacy Settings</span>
                  <ExternalLink className="menu-arrow" size={16} />
                </button>
              </li>

              <li className="menu-item">
                <button className="menu-button" onClick={handleYourActivity}>
                  <TrendingUp className="menu-icon" />
                  <span>Your Activity</span>
                  <span className="menu-arrow">→</span>
                </button>
              </li>

              <li className="menu-item">
                <button className="menu-button" onClick={handleNotifications}>
                  <Volume2 className="menu-icon" />
                  <span>Notifications</span>
                  <ExternalLink className="menu-arrow" size={16} />
                </button>
              </li>

              <li className="menu-item">
                <button className="menu-button" onClick={handleShareProfile}>
                  <Share2 className="menu-icon" />
                  <span>Share Profile</span>
                  {linkCopied ? (
                    <Check className="menu-arrow" size={16} style={{ color: '#10b981' }} />
                  ) : (
                    <Copy className="menu-arrow" size={16} />
                  )}
                </button>
              </li>

              <li className="menu-item">
                <button 
                  className="menu-button logout-button" 
                  onClick={handleLogout}
                >
                  <LogOut className="menu-icon" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Profile Completion Modal for New Users */}
        {showProfileCompletion && (
          <div className="profile-completion-overlay">
            <div className="profile-completion-modal">
              <div className="completion-modal-header">
                <div className="completion-welcome-icon">
                  <User size={28} />
                </div>
                <h2 className="completion-modal-title">Welcome to UniShare!</h2>
                <p className="completion-modal-subtitle">
                  Complete your profile to unlock all features
                </p>
              </div>
              
              <div className="completion-modal-content">
                <ul className="completion-feature-list">
                  <li className="completion-feature-item">
                    <div className="completion-feature-icon">
                      <User size={16} />
                    </div>
                    <div className="completion-feature-text">
                      Personalize your profile with custom bio and location
                    </div>
                  </li>
                  <li className="completion-feature-item">
                    <div className="completion-feature-icon">
                      <Store size={16} />
                    </div>
                    <div className="completion-feature-text">
                      Start buying and selling items in the marketplace
                    </div>
                  </li>
                  <li className="completion-feature-item">
                    <div className="completion-feature-icon">
                      <Eye size={16} />
                    </div>
                    <div className="completion-feature-text">
                      Report lost items and help others find their belongings
                    </div>
                  </li>
                  <li className="completion-feature-item">
                    <div className="completion-feature-icon">
                      <Navigation size={16} />
                    </div>
                    <div className="completion-feature-text">
                      Connect with roommates and share rides
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="completion-modal-actions">
                <button 
                  onClick={handleSkipProfileCompletion}
                  className="btn-complete-secondary"
                >
                  Skip for now
                </button>
                <button 
                  onClick={handleCompleteProfile}
                  className="btn-complete-primary"
                >
                  <Edit3 size={18} />
                  Complete Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="edit-modal-overlay" onClick={handleCancelEdit}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>

        {/* Success Toast for Link Copied */}
        {linkCopied && (
          <div className="fixed top-20 right-4 z-[9999] bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-in-right">
            <Check size={16} />
            <span>Profile link copied to clipboard!</span>
          </div>
        )}
              <div className="edit-modal-header">
                <h2 className="edit-modal-title">Edit Profile</h2>
                <button onClick={handleCancelEdit} className="close-btn">
                  <X size={20} />
                </button>
              </div>

              <div className="edit-modal-content">
                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <p>{error}</p>
                  </div>
                )}

                {/* Profile Image Section */}
                <div className="profile-image-section">
                  <img
                    src={previewImage || profileData.profileImage}
                    alt="Profile Preview"
                    className="profile-image-preview"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="upload-btn"
                  >
                    <Camera size={16} />
                    Change Photo
                  </button>
                  {validationErrors.profileImage && (
                    <p className="field-error">{validationErrors.profileImage.message}</p>
                  )}
                </div>

                {/* Form Fields */}
                <div className="form-group">
                  <label className="form-label">Display Name</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.display_name ? 'error' : ''}`}
                    value={editForm.display_name || ''}
                    onChange={(e) => handleInputChange('display_name', e.target.value)}
                    placeholder="Enter your display name"
                  />
                  {validationErrors.display_name && (
                    <p className="field-error">{validationErrors.display_name.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Username (Optional)</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.custom_user_id ? 'error' : ''}`}
                    value={editForm.custom_user_id || ''}
                    onChange={(e) => handleInputChange('custom_user_id', e.target.value)}
                    placeholder="@yourusername"
                  />
                  {validationErrors.custom_user_id && (
                    <p className="field-error">{validationErrors.custom_user_id.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea
                    className={`form-textarea ${validationErrors.bio ? 'error' : ''}`}
                    value={editForm.bio || ''}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  {validationErrors.bio && (
                    <p className="field-error">{validationErrors.bio.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                    value={editForm.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                  {validationErrors.phone && (
                    <p className="field-error">{validationErrors.phone.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Campus/University (Optional)</label>
                  <input
                    type="text"
                    className={`form-input ${validationErrors.campus_name ? 'error' : ''}`}
                    value={editForm.campus_name || ''}
                    onChange={(e) => handleInputChange('campus_name', e.target.value)}
                    placeholder="e.g., Stanford University, MIT, UC Berkeley"
                    list="campus-suggestions"
                  />
                  <datalist id="campus-suggestions">
                    <option value="Stanford University" />
                    <option value="MIT" />
                    <option value="Harvard University" />
                    <option value="University of California, Berkeley" />
                    <option value="Texas A&M University" />
                    <option value="Georgia Tech" />
                    <option value="Carnegie Mellon University" />
                    <option value="UCLA" />
                    <option value="University of Michigan" />
                    <option value="Cal Poly (SLO)" />
                  </datalist>
                  {validationErrors.campus_name && (
                    <p className="field-error">{validationErrors.campus_name.message}</p>
                  )}
                  <small className="field-help">Enter your university or college name (2-100 characters)</small>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  onClick={handleCancelEdit} 
                  className="btn-secondary"
                  disabled={saving}
                >
                  <X size={16} />
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile} 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="spinner"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Small Footer */}
      <div className='hidden md:block'>
        <SmallFooter />
      </div>
    </div>
    </>
  );
}