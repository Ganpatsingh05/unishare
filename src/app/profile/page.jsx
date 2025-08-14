"use client";

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen,
  Star,
  Camera,
  Edit3,
  Save,
  X,
  Shield,
  Heart,
  Award,
  TrendingUp,
  Users,
  Car,
  ShoppingBag,
  Home as HomeIcon,
  Settings,
  LogOut,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ProfilePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Login/Register form data
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    college: '',
    year: '',
    branch: ''
  });

  // User profile data
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    phone: '+1 (555) 123-4567',
    college: 'Stanford University',
    year: 'Senior',
    branch: 'Computer Science',
    location: 'Palo Alto, CA',
    joinDate: 'September 2021',
    bio: 'Passionate about technology and connecting with fellow students. Love sharing resources and helping others succeed!',
    avatar: null,
    verified: true,
    rating: 4.8,
    totalReviews: 124,
    stats: {
      ridesShared: 45,
      itemsSold: 23,
      itemsBought: 31,
      resourcesShared: 89,
      helpfulReviews: 156
    },
    achievements: [
      { name: 'Top Seller', icon: Award, color: 'from-yellow-400 to-yellow-600' },
      { name: 'Helpful Reviewer', icon: Star, color: 'from-blue-400 to-blue-600' },
      { name: 'Eco Warrior', icon: Car, color: 'from-green-400 to-green-600' },
      { name: 'Community Helper', icon: Heart, color: 'from-pink-400 to-pink-600' }
    ],
    recentActivity: [
      { action: 'Shared ride to downtown', time: '2 hours ago', type: 'ride' },
      { action: 'Sold Calculus textbook', time: '1 day ago', type: 'sale' },
      { action: 'Found lost iPhone', time: '3 days ago', type: 'found' },
      { action: 'Shared study materials', time: '1 week ago', type: 'resource' }
    ]
  });

  useEffect(() => {
    // Check if user is logged in (you would check localStorage, cookies, or API here)
    const checkLoginStatus = () => {
      // Simulate checking login status
      const logged = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(logged);
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation
    if (loginData.email && loginData.password) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      alert('Please fill in all fields');
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation
    if (loginData.password !== loginData.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (loginData.email && loginData.password && loginData.name && loginData.college) {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      alert('Please fill in all required fields');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setLoginData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      college: '',
      year: '',
      branch: ''
    });
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to API
    alert('Profile updated successfully!');
  };

  // Login/Register Component
  const AuthComponent = () => (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-3xl font-bold">
              <span className={darkMode ? 'text-yellow-300' : 'text-yellow-500'}>Uni</span>
              <span className={darkMode ? 'text-sky-300' : 'text-sky-500'}>Share</span>
            </span>
          </Link>
          <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isLoginMode ? 'Welcome Back!' : 'Join UniShare'}
          </h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLoginMode 
              ? 'Sign in to access your campus community' 
              : 'Create your account to get started'
            }
          </p>
        </div>

        {/* Form */}
        <div className={`rounded-2xl border-2 p-8 backdrop-blur-sm ${
          darkMode 
            ? 'bg-gray-800/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-6">
            
            {/* Registration fields */}
            {!isLoginMode && (
              <>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      required
                      value={loginData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } outline-none`}
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Year
                    </label>
                    <select
                      value={loginData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } outline-none`}
                    >
                      <option value="">Select Year</option>
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="tel"
                        value={loginData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } outline-none`}
                        placeholder="Phone number"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    College/University *
                  </label>
                  <div className="relative">
                    <BookOpen className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      required
                      value={loginData.college}
                      onChange={(e) => handleInputChange('college', e.target.value)}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                      } outline-none`}
                      placeholder="Enter your college/university"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address *
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password *
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } outline-none`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password for registration */}
            {!isLoginMode && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={loginData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } outline-none`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode 
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : (
                isLoginMode ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between login/register */}
          <div className="mt-6 text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className={`ml-2 font-semibold transition-colors duration-300 ${
                  darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {isLoginMode ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Social login options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { name: 'Google', color: 'text-red-500', bg: 'hover:bg-red-50' },
                { name: 'GitHub', color: 'text-gray-900', bg: 'hover:bg-gray-50', icon: Github },
                { name: 'Microsoft', color: 'text-blue-600', bg: 'hover:bg-blue-50' }
              ].map((provider, index) => (
                <button
                  key={index}
                  className={`inline-flex w-full justify-center rounded-xl border py-3 px-4 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {provider.icon && <provider.icon className="w-5 h-5" />}
                  {!provider.icon && (
                    <span className={`w-5 h-5 ${provider.color}`}>
                      {provider.name.charAt(0)}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // User Profile Component
  const UserProfileComponent = () => (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with back link */}
        <div className="mb-8">
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Profile Header */}
        <div className={`rounded-2xl border-2 p-8 mb-8 ${
          darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar Section */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-2xl flex items-center justify-center text-4xl font-bold bg-gradient-to-br ${
                darkMode ? 'from-yellow-400 to-yellow-600' : 'from-blue-500 to-blue-700'
              } text-white`}>
                {userProfile.avatar ? (
                  <Image src={userProfile.avatar} alt="Profile" className="rounded-2xl" />
                ) : (
                  userProfile.name.charAt(0)
                )}
              </div>
              {isEditing && (
                <button className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-yellow-400' : 'bg-white border-gray-300 text-blue-600'
                }`}>
                  <Camera className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                      className={`text-3xl font-bold mb-2 bg-transparent border-b-2 outline-none ${
                        darkMode ? 'text-white border-yellow-400' : 'text-gray-900 border-blue-500'
                      }`}
                    />
                  ) : (
                    <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {userProfile.name}
                      {userProfile.verified && (
                        <Shield className={`inline-block w-6 h-6 ml-2 ${darkMode ? 'text-yellow-400' : 'text-blue-500'}`} />
                      )}
                    </h1>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${
                            i < Math.floor(userProfile.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : darkMode ? 'text-gray-600' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                      <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {userProfile.rating} ({userProfile.totalReviews} reviews)
                      </span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          className="bg-transparent border-b outline-none"
                        />
                      ) : (
                        userProfile.email
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          className="bg-transparent border-b outline-none"
                        />
                      ) : (
                        userProfile.phone
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {userProfile.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {userProfile.college}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {userProfile.year} - {userProfile.branch}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Joined {userProfile.joinDate}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveProfile}
                        className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          darkMode ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                          darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-500 hover:bg-gray-600 text-white'
                        }`}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                        darkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                    }`}
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bio
                </h3>
                {isEditing ? (
                  <textarea
                    value={userProfile.bio}
                    onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } outline-none resize-none`}
                  />
                ) : (
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {userProfile.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Rides Shared', value: userProfile.stats.ridesShared, icon: Car, color: 'from-blue-500 to-cyan-500' },
            { label: 'Items Sold', value: userProfile.stats.itemsSold, icon: ShoppingBag, color: 'from-green-500 to-emerald-500' },
            { label: 'Items Bought', value: userProfile.stats.itemsBought, icon: ShoppingBag, color: 'from-purple-500 to-pink-500' },
            { label: 'Resources Shared', value: userProfile.stats.resourcesShared, icon: BookOpen, color: 'from-orange-500 to-red-500' },
            { label: 'Helpful Reviews', value: userProfile.stats.helpfulReviews, icon: Star, color: 'from-yellow-500 to-amber-500' }
          ].map((stat, index) => (
            <div key={index} className={`rounded-2xl border-2 p-6 text-center transition-all duration-300 hover:scale-105 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-gradient-to-br ${stat.color} text-white`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Achievements and Activity */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Achievements */}
          <div className={`rounded-2xl border-2 p-6 ${
            darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {userProfile.achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'border-gray-600 hover:border-yellow-400' : 'border-gray-200 hover:border-blue-400'
                }`}>
                  <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center bg-gradient-to-br ${achievement.color} text-white`}>
                    <achievement.icon className="w-5 h-5" />
                  </div>
                  <div className={`text-sm font-medium text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {achievement.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`rounded-2xl border-2 p-6 ${
            darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
          }`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {userProfile.recentActivity.map((activity, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-xl ${
                  darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.type === 'ride' ? 'bg-blue-500' :
                    activity.type === 'sale' ? 'bg-green-500' :
                    activity.type === 'found' ? 'bg-yellow-500' :
                    'bg-purple-500'
                  } text-white`}>
                    {activity.type === 'ride' && <Car className="w-4 h-4" />}
                    {activity.type === 'sale' && <ShoppingBag className="w-4 h-4" />}
                    {activity.type === 'found' && <Star className="w-4 h-4" />}
                    {activity.type === 'resource' && <BookOpen className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.action}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {isLoggedIn ? <UserProfileComponent /> : <AuthComponent />}
    </div>
  );
};

export default ProfilePage;
