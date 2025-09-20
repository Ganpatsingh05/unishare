'use client';
import { useState, useRef, useEffect } from 'react';
import { X, Camera, Trash2, User, AtSign, FileText, Check, AlertTriangle, Loader } from 'lucide-react';
import { 
  validateProfileDataEnhanced, 
  useUsernameValidation,
  checkUsernameAvailability 
} from '../lib/api/userProfile';

const ProfileEditModal = ({ 
  isOpen, 
  onClose, 
  userProfile, 
  onSave, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    custom_user_id: ''
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Enhanced username validation hook
  const {
    availability,
    suggestions,
    loading: checkingAvailability,
    checkAvailability,
    reset: resetUsernameValidation
  } = useUsernameValidation();
  
  // Debounced username checking
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.custom_user_id && formData.custom_user_id.length >= 3) {
        // Only check if it's different from the current user's username
        if (formData.custom_user_id !== userProfile?.custom_user_id) {
          checkAvailability(formData.custom_user_id);
        }
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.custom_user_id, userProfile?.custom_user_id, checkAvailability]);
  
  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({
        display_name: userProfile.display_name || '',
        bio: userProfile.bio || '',
        custom_user_id: userProfile.custom_user_id || ''
      });
      setImagePreview(userProfile.profile_image_url || null);
      setSelectedImage(null);
      setErrors({});
      resetUsernameValidation();
    }
  }, [isOpen, userProfile]); // Removed resetUsernameValidation from dependencies

  // Handle input changes with enhanced validation
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
    
    // Auto-format custom user ID
    if (field === 'custom_user_id') {
      let formattedValue = value;
      // Auto-add @ if user doesn't include it
      if (formattedValue && !formattedValue.startsWith('@')) {
        formattedValue = '@' + formattedValue;
        setFormData(prev => ({
          ...prev,
          [field]: formattedValue
        }));
      }
    }
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      
      // Clear any previous image errors
      if (errors.profileImage) {
        setErrors(prev => ({
          ...prev,
          profileImage: null
        }));
      }
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(userProfile?.profile_image_url || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission with enhanced validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Enhanced validation
      const validation = validateProfileDataEnhanced(formData, selectedImage);
      if (!validation.valid) {
        setErrors(validation.errors);
        setIsSubmitting(false);
        return;
      }

      // Check username availability if username was changed
      if (formData.custom_user_id && formData.custom_user_id !== userProfile?.custom_user_id) {
        if (!availability || !availability.available) {
          setErrors(prev => ({
            ...prev,
            custom_user_id: {
              message: availability?.message || 'Please check username availability',
              error_code: availability?.error_code || 'AVAILABILITY_CHECK_REQUIRED'
            }
          }));
          setIsSubmitting(false);
          return;
        }
      }

      // Submit the form
      await onSave(formData, selectedImage);
      
      // Reset form on success
      setErrors({});
      resetUsernameValidation();
      onClose();
      
    } catch (error) {
      console.error('Profile save error:', error);
      
      // Handle specific API errors
      if (error.message && error.message.includes('USERNAME_TAKEN')) {
        setErrors(prev => ({
          ...prev,
          custom_user_id: {
            message: error.message,
            error_code: 'USERNAME_TAKEN'
          }
        }));
      } else if (error.message && error.message.includes('already taken')) {
        setErrors(prev => ({
          ...prev,
          custom_user_id: {
            message: 'This username is already taken',
            error_code: 'USERNAME_TAKEN'
          }
        }));
      } else {
        // Generic error handling
        setErrors(prev => ({
          ...prev,
          general: {
            message: error.message || 'An error occurred while saving your profile',
            error_code: 'SAVE_ERROR'
          }
        }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setFormData(prev => ({
      ...prev,
      custom_user_id: suggestion.username
    }));
    
    // Clear any existing errors
    if (errors.custom_user_id) {
      setErrors(prev => ({
        ...prev,
        custom_user_id: null
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              
              {/* Camera overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                disabled={isLoading}
              >
                <Camera className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Upload Photo
              </button>
              
              {(imagePreview || selectedImage) && (
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            {errors.profileImage && (
              <p className="text-red-500 text-sm">{errors.profileImage}</p>
            )}
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <User className="w-4 h-4 inline mr-2" />
              Display Name
            </label>
            <input
              type="text"
              value={formData.display_name}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              placeholder="Enter your display name"
              maxLength={100}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              disabled={isLoading}
            />
            {errors.display_name && (
              <p className="text-red-500 text-sm">{errors.display_name}</p>
            )}
          </div>

          {/* Enhanced Custom User ID */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <AtSign className="w-4 h-4 inline mr-2" />
              Custom User ID
            </label>
            
            <div className="relative">
              <input
                type="text"
                value={formData.custom_user_id}
                onChange={(e) => handleInputChange('custom_user_id', e.target.value)}
                placeholder="@username"
                maxLength={21}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${
                  errors.custom_user_id
                    ? 'border-red-300 dark:border-red-600' 
                    : availability?.available === false
                    ? 'border-orange-300 dark:border-orange-600'
                    : availability?.available === true
                    ? 'border-green-300 dark:border-green-600'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                disabled={isLoading || isSubmitting}
              />
              
              {/* Status Icon */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {checkingAvailability && (
                  <Loader className="w-5 h-5 text-gray-400 animate-spin" />
                )}
                {!checkingAvailability && availability?.available === true && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
                {!checkingAvailability && availability?.available === false && (
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                )}
              </div>
            </div>
            
            {/* Status Messages */}
            {availability && !checkingAvailability && (
              <div className={`text-sm ${
                availability.available 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {availability.message}
              </div>
            )}
            
            {checkingAvailability && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Checking availability...
              </div>
            )}
            
            {/* Error Messages */}
            {errors.custom_user_id && (
              <p className="text-red-500 text-sm">
                {typeof errors.custom_user_id === 'object' 
                  ? errors.custom_user_id.message 
                  : errors.custom_user_id}
              </p>
            )}
            
            {/* Username Suggestions */}
            {suggestions.length > 0 && !availability?.available && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Try these available alternatives:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 5).map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900 dark:hover:bg-purple-800 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium transition-colors"
                    >
                      {suggestion.username}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              2-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              <FileText className="w-4 h-4 inline mr-2" />
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell people about yourself..."
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              disabled={isLoading}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formData.bio.length}/500 characters
              </p>
              {errors.bio && (
                <p className="text-red-500 text-sm">{errors.bio}</p>
              )}
            </div>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {typeof errors.general === 'object' ? errors.general.message : errors.general}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={isLoading || isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              disabled={
                isLoading || 
                isSubmitting || 
                checkingAvailability ||
                (formData.custom_user_id && formData.custom_user_id !== userProfile?.custom_user_id && availability && !availability.available)
              }
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              <span>
                {isSubmitting 
                  ? 'Saving...' 
                  : checkingAvailability 
                  ? 'Checking...' 
                  : 'Save Profile'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditModal;