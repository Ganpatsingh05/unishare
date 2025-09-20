'use client';
import { useState, useEffect } from 'react';
import { User, Edit3, AtSign, Calendar, MapPin } from 'lucide-react';
import { formatProfileData } from '../lib/utils/profileUtils';

const ProfileDisplay = ({ 
  userProfile, 
  user, 
  onEditProfile, 
  isLoading = false 
}) => {
  const [displayData, setDisplayData] = useState({
    displayName: 'Loading...',
    customUserId: null,
    bio: null,
    profileImage: null,
    userInitials: 'U',
    memberSince: null,
    isGoogleImage: false
  });

  useEffect(() => {
    if (user) {
      const formattedData = formatProfileData(userProfile, user);
      setDisplayData(formattedData);
    }
  }, [userProfile, user]);

  const formatMemberSince = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Profile Information
        </h2>
        <button
          onClick={onEditProfile}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Profile Image with Enhanced Fallback */}
        <div className="flex-shrink-0 relative">
          {displayData.profileImage ? (
            <div className="relative">
              <img
                src={displayData.profileImage}
                alt={displayData.displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                onError={(e) => {
                  // If image fails to load, show default avatar
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback avatar (hidden by default) */}
              <div 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg absolute top-0 left-0"
                style={{ display: 'none' }}
              >
                <span className="text-white font-semibold text-lg sm:text-xl">
                  {displayData.userInitials}
                </span>
              </div>
              {/* Google profile indicator */}
              {displayData.isGoogleImage && (
                <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-semibold text-lg sm:text-xl">
                {displayData.userInitials}
              </span>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-3">
          {/* Display Name */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {displayData.displayName}
            </h3>
            {displayData.customUserId && (
              <p className="text-purple-600 dark:text-purple-400 flex items-center mt-1">
                {displayData.customUserId}
              </p>
            )}
          </div>

          {/* Bio */}
          {displayData.bio ? (
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {displayData.bio}
              </p>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic">
              <p>Add a bio to tell people about yourself</p>
            </div>
          )}

          {/* Member Since */}
          {displayData.memberSince && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Member since {formatMemberSince(displayData.memberSince)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion Hint */}
      {(!userProfile || (!userProfile.display_name && !userProfile.bio && !userProfile.custom_user_id)) && (
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
            </div>
            <div>
              <p className="text-sm text-purple-800 dark:text-purple-300">
                <strong>Complete your profile!</strong> Add a display name, bio, and custom user ID to help others find and connect with you.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 rounded-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Updating profile...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDisplay;