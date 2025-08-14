"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  Lock,
  Mail,
  Phone,
  MapPin,
  Camera,
  Toggle
} from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [settings, setSettings] = useState({
    // Profile Settings
    name: 'Sarah Johnson',
    email: 'sarah.johnson@college.edu',
    phone: '+1 (555) 123-4567',
    location: 'Palo Alto, CA',
    bio: 'Passionate about technology and connecting with fellow students.',
    
    // Privacy Settings
    profileVisibility: 'public', // public, friends, private
    showEmail: true,
    showPhone: false,
    showLocation: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    rideReminders: true,
    marketplaceUpdates: true,
    lostFoundAlerts: true,
    communityNews: false,
    
    // App Settings
    theme: 'dark',
    language: 'en',
    autoRefresh: true,
    compactView: false,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    passwordExpiry: 90
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSettings = () => {
    // Here you would save to API
    alert('Settings saved successfully!');
  };

  const exportData = () => {
    // Here you would export user data
    alert('Data export started. You will receive an email when ready.');
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion process initiated.');
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/profile" 
            className={`inline-flex items-center gap-2 mb-4 text-sm font-medium transition-colors duration-300 ${
              darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your account preferences and privacy settings
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className={`sticky top-8 rounded-2xl border-2 p-4 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'privacy', label: 'Privacy', icon: Shield },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'appearance', label: 'Appearance', icon: Moon },
                { id: 'security', label: 'Security', icon: Lock },
                { id: 'data', label: 'Data & Export', icon: Download }
              ].map((item) => (
                <button
                  key={item.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 mb-2 ${
                    darkMode 
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Profile Settings */}
            <div className={`rounded-2xl border-2 p-6 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Profile Information
              </h2>
              
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold bg-gradient-to-br ${
                    darkMode ? 'from-yellow-400 to-yellow-600' : 'from-blue-500 to-blue-700'
                  } text-white relative`}>
                    {settings.name.charAt(0)}
                    <button className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-blue-600'
                    }`}>
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>
                  <div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Profile Photo
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Upload a new profile picture
                    </p>
                    <button className={`mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      darkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      <Upload className="w-4 h-4 inline mr-2" />
                      Upload Photo
                    </button>
                  </div>
                </div>

                {/* Profile Fields */}
                {[
                  { label: 'Full Name', key: 'name', icon: User, type: 'text' },
                  { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
                  { label: 'Phone Number', key: 'phone', icon: Phone, type: 'tel' },
                  { label: 'Location', key: 'location', icon: MapPin, type: 'text' }
                ].map((field) => (
                  <div key={field.key}>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {field.label}
                    </label>
                    <div className="relative">
                      <field.icon className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type={field.type}
                        value={settings[field.key]}
                        onChange={(e) => handleSettingChange(field.key, e.target.value)}
                        className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } outline-none`}
                      />
                    </div>
                  </div>
                ))}

                {/* Bio */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Bio
                  </label>
                  <textarea
                    value={settings.bio}
                    onChange={(e) => handleSettingChange('bio', e.target.value)}
                    rows={3}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-300 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } outline-none resize-none`}
                    placeholder="Tell others about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className={`rounded-2xl border-2 p-6 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Privacy & Visibility
              </h2>
              
              <div className="space-y-6">
                {/* Profile Visibility */}
                <div>
                  <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Profile Visibility
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'public', label: 'Public', desc: 'Anyone can see your profile' },
                      { value: 'friends', label: 'Friends Only', desc: 'Only your connections can see your profile' },
                      { value: 'private', label: 'Private', desc: 'Only you can see your profile' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value={option.value}
                          checked={settings.profileVisibility === option.value}
                          onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                          className={`w-4 h-4 ${darkMode ? 'text-yellow-400' : 'text-blue-600'}`}
                        />
                        <div>
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {option.label}
                          </div>
                          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {option.desc}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Contact Information Visibility */}
                <div className="space-y-4">
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Contact Information Visibility
                  </h3>
                  {[
                    { key: 'showEmail', label: 'Show email address', icon: Mail },
                    { key: 'showPhone', label: 'Show phone number', icon: Phone },
                    { key: 'showLocation', label: 'Show location', icon: MapPin }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSettingChange(item.key, !settings[item.key])}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          settings[item.key] 
                            ? darkMode ? 'bg-yellow-600' : 'bg-blue-600'
                            : 'bg-gray-400'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className={`rounded-2xl border-2 p-6 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h2>
              
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email notifications', desc: 'Receive notifications via email' },
                  { key: 'pushNotifications', label: 'Push notifications', desc: 'Receive browser push notifications' },
                  { key: 'rideReminders', label: 'Ride reminders', desc: 'Get notified about upcoming rides' },
                  { key: 'marketplaceUpdates', label: 'Marketplace updates', desc: 'Updates on your listings and purchases' },
                  { key: 'lostFoundAlerts', label: 'Lost & Found alerts', desc: 'Notifications about lost/found items' },
                  { key: 'communityNews', label: 'Community news', desc: 'Updates about campus events and news' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.label}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {item.desc}
                      </div>
                    </div>
                    <button
                      onClick={() => handleSettingChange(item.key, !settings[item.key])}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings[item.key] 
                          ? darkMode ? 'bg-yellow-600' : 'bg-blue-600'
                          : 'bg-gray-400'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings[item.key] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Settings */}
            <div className={`rounded-2xl border-2 p-6 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Security
              </h2>
              
              <div className="space-y-6">
                {/* Change Password */}
                <div>
                  <h3 className={`font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Change Password
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.current}
                          onChange={(e) => handlePasswordChange('current', e.target.value)}
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.new}
                          onChange={(e) => handlePasswordChange('new', e.target.value)}
                          className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white focus:border-yellow-400' 
                              : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                          } outline-none`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}>
                      Update Password
                    </button>
                  </div>
                </div>

                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Two-Factor Authentication
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Add an extra layer of security to your account
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('twoFactorAuth', !settings.twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.twoFactorAuth 
                        ? darkMode ? 'bg-yellow-600' : 'bg-blue-600'
                        : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Data & Export */}
            <div className={`rounded-2xl border-2 p-6 ${
              darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Data & Export
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Export Your Data
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Download a copy of all your data
                    </div>
                  </div>
                  <button
                    onClick={exportData}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105 ${
                      darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Download className="w-4 h-4 inline mr-2" />
                    Export
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className={`font-medium text-red-500`}>
                      Delete Account
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Permanently delete your account and all data
                    </div>
                  </div>
                  <button
                    onClick={deleteAccount}
                    className="px-4 py-2 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={saveSettings}
                className={`px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 ${
                  darkMode 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                }`}
              >
                <Save className="w-5 h-5 inline mr-2" />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
