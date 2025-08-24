"use client";

import { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Lock, 
  Users, 
  Car,
  ShoppingBag,
  Home,
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ArrowLeft,
  Lightbulb,
  UserCheck,
  Camera,
  MessageSquare,
  Flag
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';

export default function SafetyGuidelines() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [expandedSection, setExpandedSection] = useState(null);
  const router = useRouter();

  const safetyTabs = [
    { 
      id: 'general', 
      name: 'General Safety', 
      icon: Shield, 
      color: 'from-blue-500 to-cyan-500',
      description: 'Essential safety practices for all UniShare activities'
    },
    { 
      id: 'rides', 
      name: 'Ride Safety', 
      icon: Car, 
      color: 'from-green-500 to-emerald-500',
      description: 'Stay safe when sharing rides and transportation'
    },
    { 
      id: 'marketplace', 
      name: 'Trading Safety', 
      icon: ShoppingBag, 
      color: 'from-purple-500 to-violet-500',
      description: 'Secure practices for buying and selling items'
    },
    { 
      id: 'housing', 
      name: 'Housing Safety', 
      icon: Home, 
      color: 'from-orange-500 to-red-500',
      description: 'Safe roommate finding and housing arrangements'
    }
  ];

  const generalSafety = [
    {
      title: 'Verify Student Identity',
      icon: UserCheck,
      tips: [
        'All users must verify with university email addresses',
        'Look for verified badges on user profiles',
        'Report any suspicious or fake accounts immediately',
        'Never share personal information with unverified users'
      ],
      importance: 'critical'
    },
    {
      title: 'Meet in Public Places',
      icon: MapPin,
      tips: [
        'Always meet in well-lit, populated campus areas',
        'Use campus libraries, student centers, or cafeterias',
        'Avoid isolated locations, even during daytime',
        'Bring a friend if possible, especially for first meetings'
      ],
      importance: 'high'
    },
    {
      title: 'Trust Your Instincts',
      icon: Eye,
      tips: [
        'If something feels off, don\'t proceed with the transaction',
        'Pay attention to red flags in communication',
        'Don\'t feel pressured to complete any arrangement',
        'It\'s okay to change your mind if you feel uncomfortable'
      ],
      importance: 'critical'
    },
    {
      title: 'Keep Communication on Platform',
      icon: MessageSquare,
      tips: [
        'Use UniShare\'s messaging system for initial contact',
        'Avoid sharing personal phone numbers immediately',
        'Keep records of all communications',
        'Report inappropriate messages or behavior'
      ],
      importance: 'medium'
    }
  ];

  const rideSafety = [
    {
      title: 'Pre-Ride Verification',
      icon: CheckCircle,
      tips: [
        'Verify driver\'s license and vehicle registration',
        'Share ride details with a trusted friend or family member',
        'Confirm pickup location in advance',
        'Check driver ratings and reviews from other students'
      ],
      importance: 'critical'
    },
    {
      title: 'During the Ride',
      icon: Shield,
      tips: [
        'Sit in the back seat for safety and comfort',
        'Keep your phone charged and location services on',
        'Stay alert and avoid falling asleep',
        'Don\'t hesitate to speak up if you feel unsafe'
      ],
      importance: 'high'
    },
    {
      title: 'Emergency Protocols',
      icon: Phone,
      tips: [
        'Keep emergency contacts easily accessible',
        'Know campus security and local emergency numbers',
        'Have a plan for unexpected situations',
        'Don\'t get in a vehicle if driver appears impaired'
      ],
      importance: 'critical'
    }
  ];

  const tradingSafety = [
    {
      title: 'Secure Payment Methods',
      icon: Lock,
      tips: [
        'Use secure payment apps with buyer protection',
        'Avoid cash transactions for high-value items',
        'Never send money before seeing the item',
        'Be wary of deals that seem too good to be true'
      ],
      importance: 'high'
    },
    {
      title: 'Item Inspection',
      icon: Eye,
      tips: [
        'Thoroughly inspect items before purchasing',
        'Test electronics and check functionality',
        'Ask for original receipts or proof of purchase',
        'Take photos of items for your records'
      ],
      importance: 'medium'
    },
    {
      title: 'Meeting for Transactions',
      icon: Users,
      tips: [
        'Meet during daylight hours when possible',
        'Choose busy campus locations with security cameras',
        'Bring exact change to avoid showing large amounts of cash',
        'Let someone know where you\'re going and when you expect to return'
      ],
      importance: 'high'
    }
  ];

  const housingSafety = [
    {
      title: 'Roommate Screening',
      icon: Users,
      tips: [
        'Meet potential roommates in person before committing',
        'Check references and previous living arrangements',
        'Discuss lifestyle preferences and boundaries',
        'Run background checks if living off-campus'
      ],
      importance: 'high'
    },
    {
      title: 'Housing Verification',
      icon: Home,
      tips: [
        'Verify landlord credentials and property ownership',
        'Visit properties during different times of day',
        'Check neighborhood safety and transportation options',
        'Read lease agreements carefully before signing'
      ],
      importance: 'critical'
    },
    {
      title: 'Personal Safety',
      icon: Lock,
      tips: [
        'Keep personal belongings secure',
        'Don\'t share access codes or keys carelessly',
        'Install additional security measures if needed',
        'Know your rights as a tenant'
      ],
      importance: 'high'
    }
  ];

  const emergencyContacts = [
    { service: 'Campus Security', number: '(555) 123-SAFE', available: '24/7' },
    { service: 'Local Emergency', number: '911', available: '24/7' },
    { service: 'UniShare Support', number: '(555) 123-4567', available: 'Mon-Fri 9AM-6PM' },
    { service: 'Student Counseling', number: '(555) 123-HELP', available: '24/7' }
  ];

  const getCurrentSafetyContent = () => {
    switch(activeTab) {
      case 'rides': return rideSafety;
      case 'marketplace': return tradingSafety;
      case 'housing': return housingSafety;
      default: return generalSafety;
    }
  };

  const getImportanceColor = (importance) => {
    switch(importance) {
      case 'critical': return 'from-red-500 to-rose-500';
      case 'high': return 'from-orange-500 to-yellow-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  const getImportanceText = (importance) => {
    switch(importance) {
      case 'critical': return 'Critical';
      case 'high': return 'High Priority';
      default: return 'Important';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100"
        : "bg-gradient-to-br from-blue-50 via-gray-50 to-green-50 text-gray-800"
    }`}>
      <Header darkMode={darkMode} onThemeToggle={() => setDarkMode(!darkMode)} />
      
      {/* Navigation Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex items-center gap-2 text-sm mb-8">
          <button 
            onClick={() => router.push('/')}
            className={`flex items-center gap-2 transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:text-yellow-300' : 'text-gray-500 hover:text-blue-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Safety Guidelines</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <Shield className="w-4 h-4" />
            <span>Safety & Security Guidelines</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Your Safety is Our Priority
          </h1>
          
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Learn essential safety practices to protect yourself while using UniShare. 
            These guidelines help ensure a secure and positive experience for everyone in our community.
          </p>

          {/* Safety Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { label: 'Verified Students', value: '100%', icon: UserCheck },
              { label: 'Safety Incidents', value: '<0.1%', icon: Shield },
              { label: 'Response Time', value: '<2hrs', icon: Clock }
            ].map((stat, index) => (
              <div key={index} className={`p-6 rounded-2xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tabs */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            {safetyTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center gap-3 px-6 py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">{tab.name}</div>
                  <div className={`text-xs opacity-75 ${
                    activeTab === tab.id ? 'text-white' : ''
                  }`}>
                    {tab.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Safety Content */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold mb-8 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {safetyTabs.find(tab => tab.id === activeTab)?.name} Best Practices
          </h2>

          <div className="grid gap-6">
            {getCurrentSafetyContent().map((section, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                } backdrop-blur-md shadow-lg hover:shadow-xl`}
              >
                <button
                  onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${getImportanceColor(section.importance)} text-white`}>
                        <section.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {section.title}
                        </h3>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          section.importance === 'critical'
                            ? 'bg-red-500/20 text-red-400'
                            : section.importance === 'high'
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {getImportanceText(section.importance)}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                      expandedSection === index ? 'rotate-90' : ''
                    } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </button>

                {expandedSection === index && (
                  <div className="px-6 pb-6">
                    <div className="ml-16">
                      <ul className="space-y-3">
                        {section.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-3">
                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                              darkMode ? 'text-green-400' : 'text-green-600'
                            }`} />
                            <span className={`text-base ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                              {tip}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className={`p-8 rounded-2xl border-2 mb-16 ${
          darkMode 
            ? 'bg-red-900/20 border-red-800/50' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-4 ${
              darkMode 
                ? 'bg-red-500/20 text-red-300' 
                : 'bg-red-100 text-red-700'
            }`}>
              <Phone className="w-4 h-4" />
              <span>Emergency Contacts</span>
            </div>
            <h3 className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Important Numbers to Save
            </h3>
            <p className={`text-base ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Keep these contacts readily available for any safety concerns or emergencies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className={`p-4 rounded-xl border ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {contact.service}
                    </h4>
                    <p className={`text-2xl font-bold ${
                      darkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      {contact.number}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Available: {contact.available}
                    </p>
                  </div>
                  <Phone className={`w-8 h-8 ${
                    darkMode ? 'text-red-400' : 'text-red-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reporting Section */}
        <div className={`p-8 rounded-2xl text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <Flag className={`w-16 h-16 mx-auto mb-6 ${
            darkMode ? 'text-yellow-400' : 'text-blue-600'
          }`} />
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Report Safety Concerns
          </h3>
          <p className={`text-lg mb-6 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            If you encounter any safety issues or suspicious behavior, report it immediately. 
            Your reports help keep our community safe for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-red-600 text-white hover:bg-red-500' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}>
              Report Issue Now
            </button>
            <button className={`px-8 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-white'
            }`}>
              Safety Tips Guide
            </button>
          </div>
        </div>

        {/* Additional Safety Tips */}
        <div className="mt-16">
          <h3 className={`text-2xl font-bold mb-8 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Safety Reminders
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Trust Your Gut',
                description: 'If something doesn\'t feel right, don\'t proceed. Your instincts are your best protection.',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Camera,
                title: 'Document Everything',
                description: 'Keep screenshots of conversations and photos of items. Evidence helps in disputes.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Users,
                title: 'Tell Someone',
                description: 'Always let a friend know where you\'re going and who you\'re meeting.',
                color: 'from-green-500 to-teal-500'
              },
              {
                icon: Lock,
                title: 'Protect Your Info',
                description: 'Never share personal details like home address or financial information.',
                color: 'from-blue-500 to-indigo-500'
              },
              {
                icon: Star,
                title: 'Check Ratings',
                description: 'Always review user ratings and feedback before engaging in transactions.',
                color: 'from-amber-500 to-yellow-500'
              },
              {
                icon: AlertTriangle,
                title: 'Report Suspicious Activity',
                description: 'Help keep the community safe by reporting concerning behavior immediately.',
                color: 'from-red-500 to-rose-500'
              }
            ].map((tip, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                } backdrop-blur-md shadow-lg hover:shadow-xl`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${tip.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <tip.icon className="w-6 h-6" />
                </div>
                <h4 className={`text-lg font-bold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {tip.title}
                </h4>
                <p className={`text-sm leading-relaxed ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}