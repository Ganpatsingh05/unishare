"use client";

import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);

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
    bio: 'Passionate about technology and connecting with fellow students. Love sharing resources and helping others succeed! Always open to collaborate on interesting projects and help fellow students with their academic journey.',
    avatar: null
  });

  const handleProfileUpdate = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveProfile = () => {
    setIsEditing(false);
    // Here you would typically save to API
  };

  const profileMenuItems = [
    { 
      icon: Settings, 
      label: 'Account Settings', 
      description: 'Privacy, security, and notifications',
      action: () => console.log('Navigate to settings')
    },
    { 
      icon: BookOpen, 
      label: 'My Posts', 
      description: 'View and manage your listings',
      action: () => console.log('Navigate to my posts')
    },
    { 
      icon: User, 
      label: 'Help & Support', 
      description: 'Get help and contact support',
      action: () => console.log('Navigate to help')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero */}
      <div className="relative h-40 md:h-56 bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600">
        {/* Top App Bar */}
        <div className="absolute inset-x-0 top-0 z-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-white/90 font-semibold">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isEditing 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              aria-label={isEditing ? 'Save profile' : 'Edit profile'}
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Decorative blur circles */}
        <div className="absolute -bottom-10 right-6 w-28 h-28 bg-white/20 blur-2xl rounded-full pointer-events-none" />
        <div className="absolute -top-6 left-10 w-24 h-24 bg-white/10 blur-xl rounded-full pointer-events-none" />
      </div>

      {/* Content */}
      <div className="relative -mt-12 md:-mt-16 px-4 pb-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {/* Summary Card (Sticky on desktop) */}
          <aside className="md:sticky md:top-6 h-fit">
            <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200/80 p-6">
              <div className="flex flex-col items-center">
                <div className="relative -mt-14 mb-2">
                  <div className="w-28 h-28 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold ring-4 ring-white">
                    {userProfile.avatar ? (
                      <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      userProfile.name.charAt(0)
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors" aria-label="Change avatar">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Name */}
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    className="text-2xl md:text-3xl font-bold text-gray-900 text-center bg-transparent border-b-2 border-blue-400 outline-none mb-2 px-2"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">{userProfile.name}</h2>
                )}

                {/* Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">{userProfile.year}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-violet-50 text-violet-700 border border-violet-100">{userProfile.branch}</span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-slate-50 text-slate-700 border border-slate-200">{userProfile.college}</span>
                </div>

                <div className="w-full grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <p className="text-sm text-gray-700">{userProfile.location}</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <Calendar className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-gray-700">Member since {userProfile.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Column */}
          <main className="md:col-span-2 space-y-6">
            {/* About Card */}
            <section className={`bg-white rounded-2xl shadow-xl shadow-black/5 border p-6 ${isEditing ? 'border-blue-300' : 'border-gray-200/80'}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
              {isEditing ? (
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  rows={5}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl resize-none outline-none focus:border-blue-400 transition-colors"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    {showFullBio ? userProfile.bio : `${userProfile.bio.slice(0, 160)}...`}
                  </p>
                  {userProfile.bio.length > 160 && (
                    <button
                      onClick={() => setShowFullBio(!showFullBio)}
                      className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors"
                    >
                      {showFullBio ? 'Show less' : 'Show more'}
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200/80 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/40 transition-colors">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userProfile.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        className="text-gray-900 font-medium bg-transparent border-b border-gray-300 outline-none w-full"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{userProfile.email}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:bg-green-50/40 transition-colors">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Phone</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userProfile.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="text-gray-900 font-medium bg-transparent border-b border-gray-300 outline-none w-full"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{userProfile.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Options */}
            <section className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200/80 p-2">
              <h3 className="text-lg font-semibold text-gray-900 px-4 pt-4">More Options</h3>
              <div className="mt-2 divide-y divide-gray-100">
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-gray-900 font-medium">{item.label}</p>
                      <p className="text-gray-500 text-sm">{item.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </button>
                ))}
              </div>
            </section>
          </main>
        </div>

        {/* Save/Cancel Bar */}
        {isEditing && (
          <div className="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[700px] z-50">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/10 border border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
              >
                <X className="w-5 h-5 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={saveProfile}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
              >
                <Save className="w-5 h-5 inline mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
