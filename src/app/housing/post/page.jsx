'use client';
import { useState, useEffect } from 'react';
import { Moon, Sun, Home, MapPin, Bed, Calendar, Mail, Phone, Instagram, Camera, Upload, LogIn, User } from 'lucide-react';
import { postRoom, startGoogleLogin } from '../../lib/api';
import { useAuth, useUI, useMessages } from '../../lib/contexts/UniShareContext';
import { HousingNotifications } from '../../lib/utils/actionNotifications';

export default function AuthProtectedRoomForm() {
  const { isAuthenticated, user, authLoading, userAvatar, userInitials } = useAuth();
  const { darkMode, toggleDarkMode, showFormLoading, stopNavigationLoading } = useUI();
  const { setError, setSuccess, showTemporaryMessage, loading, setLoading } = useMessages();

  const [form, setForm] = useState({
    title: '',
    description: '',
    rent: '',
    location: '',
    beds: '',
    move_in_date: '',
    email: '',
    mobile: '',
    instagram: ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Pre-fill email when user data is available
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm(prev => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = [...e.target.files];
    setImages(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the removed URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Please log in to post a room');
      return;
    }

    // Show custom navigation loader
    showFormLoading('Posting your room listing...');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('rent', form.rent);
    formData.append('location', form.location);
    formData.append('beds', form.beds);
    formData.append('move_in_date', form.move_in_date);

    const contactInfo = {
      email: form.email,
      mobile: form.mobile,
      instagram: form.instagram
    };
    formData.append('contact_info', JSON.stringify(contactInfo));

    images.forEach((file) => {
      formData.append('photos', file);
    });

    try {
      const res = await postRoom(formData);
      
      if (res.success) {
        // Show Dynamic Island notification
        HousingNotifications.roomPosted(form.title);
        
        showTemporaryMessage('Room posted successfully! Your listing is now live and visible to potential roommates.', true, 5000);
        
        // Reset form on success
        setForm({
          title: '',
          description: '',
          rent: '',
          location: '',
          beds: '',
          move_in_date: '',
          email: user.email || '',
          mobile: '',
          instagram: ''
        });
        setImages([]);
        setImagePreviews([]);
      } else {
        setError(res.error || 'Failed to post room');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while posting the room');
    } finally {
      stopNavigationLoading();
    }
  };

  const themeClasses = darkMode 
    ? 'bg-gray-900 text-white min-h-screen' 
    : 'bg-gray-50 text-gray-900 min-h-screen';

  const cardClasses = darkMode
    ? 'bg-gray-800 border-gray-700 shadow-2xl'
    : 'bg-white border-gray-200 shadow-xl';

  const inputClasses = darkMode
    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500';

  const buttonClasses = darkMode
    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-400'
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className={themeClasses}>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Checking authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login required message if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className={themeClasses}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Home className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Post Your Room
              </h1>
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Login Required Card */}
          <div className={`max-w-md mx-auto rounded-2xl border p-8 text-center ${cardClasses}`}>
            <LogIn className="w-16 h-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold mb-4">Login Required</h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              You need to be logged in to post room listings. This helps ensure the authenticity of listings and allows you to manage your posts.
            </p>
            <button
              onClick={startGoogleLogin}
              className={`w-full p-4 text-white font-semibold rounded-xl transition-all focus:ring-2 focus:outline-none ${buttonClasses}`}
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={themeClasses}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-4">
            <Home className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Post Your Room
            </h1>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt="User avatar" 
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                {userInitials}
              </div>
            )}
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Logged in as {user.name}
            </span>
          </div>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Find the perfect roommate for your space
          </p>
        </div>

        {/* Form Card */}
        <div className={`max-w-2xl mx-auto rounded-2xl border p-8 ${cardClasses}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-500" />
                Property Details
              </h2>
              
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Property Title"
                  value={form.title}
                  onChange={handleChange}
                  className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  required
                />
                <Home className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>

              <div>
                <textarea
                  name="description"
                  placeholder="Describe your room, amenities, preferences, neighborhood..."
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full p-4 border rounded-xl transition-all focus:ring-2 focus:outline-none resize-none ${inputClasses}`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    name="rent"
                    placeholder="Monthly Rent ($)"
                    value={form.rent}
                    onChange={handleChange}
                    className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                    required
                  />
                  <span className="absolute left-4 top-4 text-gray-400 font-semibold">$</span>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    name="beds"
                    placeholder="Number of Beds"
                    value={form.beds}
                    onChange={handleChange}
                    className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                    required
                  />
                  <Bed className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={form.location}
                  onChange={handleChange}
                  className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  required
                />
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>

              <div className="relative">
                <input
                  type="date"
                  name="move_in_date"
                  value={form.move_in_date}
                  onChange={handleChange}
                  className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  required
                />
                <Calendar className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact Information
              </h2>
              
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  required
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    name="mobile"
                    placeholder="Phone Number (optional)"
                    value={form.mobile}
                    onChange={handleChange}
                    className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  />
                  <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    name="instagram"
                    placeholder="Instagram (optional)"
                    value={form.instagram}
                    onChange={handleChange}
                    className={`w-full p-4 pl-12 border rounded-xl transition-all focus:ring-2 focus:outline-none ${inputClasses}`}
                  />
                  <Instagram className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-500" />
                Photos
              </h2>
              
              <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Click to upload photos</p>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    PNG, JPG up to 5MB each
                  </p>
                </label>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full p-4 text-white font-semibold rounded-xl transition-all focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Posting Room...
                </div>
              ) : (
                'Post Room'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}