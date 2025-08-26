"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  UserCheck, 
  Globe, 
  Mail, 
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  Download,
  Trash2,
  Edit3,
  Share2
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';
import Reveal from '../../_components/Reveal';
import MobileQuickNav from '../../_components/MobileQuickNav';

export default function PrivacyPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: 'overview', title: 'Overview', icon: Shield },
    { id: 'collection', title: 'Information We Collect', icon: Database },
    { id: 'usage', title: 'How We Use Your Data', icon: Settings },
    { id: 'sharing', title: 'Information Sharing', icon: Share2 },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'rights', title: 'Your Rights', icon: UserCheck },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Eye },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  const dataTypes = [
    {
      category: 'Account Information',
      items: [
        'University email address',
        'Full name and profile photo',
        'University and graduation year',
        'Phone number (optional)',
        'Emergency contact (for rides)'
      ],
      icon: UserCheck,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'Activity Data',
      items: [
        'Ride sharing history',
        'Marketplace transactions',
        'Housing searches and listings',
        'Messages and communications',
        'App usage patterns'
      ],
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'Device Information',
      items: [
        'IP address and location',
        'Device type and browser',
        'App version and settings',
        'Crash reports and diagnostics'
      ],
      icon: Globe,
      color: 'from-purple-500 to-violet-500'
    }
  ];

  const yourRights = [
    {
      right: 'Access Your Data',
      description: 'Request a copy of all personal data we have about you',
      icon: Download,
      action: 'Request Data Export'
    },
    {
      right: 'Correct Information',
      description: 'Update or correct any inaccurate personal information',
      icon: Edit3,
      action: 'Edit Profile'
    },
    {
      right: 'Delete Account',
      description: 'Permanently delete your account and associated data',
      icon: Trash2,
      action: 'Delete Account'
    },
    {
      right: 'Control Communications',
      description: 'Manage email preferences and notification settings',
      icon: Mail,
      action: 'Manage Preferences'
    }
  ];

  const securityMeasures = [
    {
      measure: 'End-to-End Encryption',
      description: 'All sensitive communications are encrypted in transit and at rest'
    },
    {
      measure: 'Regular Security Audits',
      description: 'Third-party security assessments and vulnerability testing'
    },
    {
      measure: 'Access Controls',
      description: 'Strict employee access controls and authentication requirements'
    },
    {
      measure: 'Data Minimization',
      description: 'We only collect and retain data necessary for our services'
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Privacy Policy</span>
        </div>
      </div>

    {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
      <Reveal className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-green-300/20 text-green-300 border border-green-300/40' 
              : 'bg-green-100 text-green-700 border border-green-200'
      }`}>
            <Shield className="w-4 h-4" />
            <span>Your Privacy Matters</span>
      </Reveal>

      <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
      }`}>
            Privacy Policy
      </Reveal>
          
      <Reveal delay={100} className={`text-xl mb-6 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
            We believe in transparency about how we collect, use, and protect your personal information.
      </Reveal>

      <Reveal delay={150} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-600'
      }`}>
            <Calendar className="w-4 h-4" />
            <span>Last updated: {lastUpdated}</span>
      </Reveal>
        </div>

        {/* Navigation Sidebar and Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Table of Contents (hidden on mobile) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className={`sticky top-8 p-6 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <h3 className={`text-lg font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Table of Contents
              </h3>
      <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 active:scale-95 ${
                      activeSection === section.id
                        ? darkMode
                          ? 'bg-yellow-300/20 text-yellow-300 border-l-2 border-yellow-300'
                          : 'bg-blue-100 text-blue-700 border-l-2 border-blue-600'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Overview Section */}
            <section id="overview" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Shield className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Overview
                </h2>
              </div>
              <div className={`space-y-4 text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  At UniShare, your privacy is fundamental to our mission. This policy explains how we collect, 
                  use, and protect your personal information when you use our platform to connect with other students.
                </p>
                <p>
                  We are committed to being transparent about our data practices and giving you control over 
                  your personal information. This policy applies to all UniShare services, including our website, 
                  mobile app, and any related services.
                </p>
              </div>
              </Reveal>
            </section>

            {/* Information We Collect */}
            <section id="collection" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Database className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Information We Collect
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {dataTypes.map((type, index) => (
                  <Reveal
                    key={index}
                    delay={index * 80}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                        : 'bg-gray-50 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r ${type.color} text-white`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-bold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {type.category}
                    </h3>
                    <ul className="space-y-2">
                      {type.items.map((item, idx) => (
                        <li key={idx} className={`flex items-center gap-2 text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
              </Reveal>
            </section>

            {/* How We Use Your Data */}
            <section id="usage" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Settings className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  How We Use Your Data
                </h2>
              </div>
              <div className={`space-y-4 text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>We use your personal information to:</p>
                <ul className="space-y-2 ml-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Provide and improve our platform services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Verify your student status and university affiliation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Facilitate connections between students for rides, housing, and marketplace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Send important updates about your transactions and account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Ensure platform safety and prevent fraud or abuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <span>Analyze usage patterns to improve user experience</span>
                  </li>
                </ul>
              </div>
              </Reveal>
            </section>

            {/* Your Rights */}
            <section id="rights" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <UserCheck className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Your Rights
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {yourRights.map((right, index) => (
                  <Reveal
                    key={index}
                    delay={index * 70}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                        : 'bg-gray-50 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${
                        darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <right.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`text-lg font-bold mb-2 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {right.right}
                        </h3>
                        <p className={`text-sm mb-4 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {right.description}
                        </p>
                        <button className={`text-sm font-medium transition-colors duration-200 active:scale-95 ${
                          darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-blue-600 hover:text-blue-700'
                        }`}>
                          {right.action} →
                        </button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              </Reveal>
            </section>

            {/* Data Security */}
            <section id="security" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Lock className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Data Security
                </h2>
              </div>
              
              <div className={`mb-6 text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  We implement industry-standard security measures to protect your personal information:
                </p>
              </div>

              <div className="space-y-4">
                {securityMeasures.map((measure, index) => (
                  <Reveal
                    key={index}
                    delay={index * 60}
                    className={`p-4 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-700/30 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Shield className={`w-5 h-5 mt-1 ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`} />
                      <div>
                        <h4 className={`font-semibold mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {measure.measure}
                        </h4>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {measure.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              </Reveal>
            </section>

            {/* Contact Section */}
            <section id="contact" className="">
              <Reveal className={`p-8 rounded-2xl border-2 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Mail className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Us About Privacy
                </h2>
              </div>
              
              <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  If you have any questions about this privacy policy or how we handle your data, 
                  please don't hesitate to contact us:
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.open('mailto:privacy@unishare.com')}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Email Privacy Team
                </button>
                <button 
                  onClick={() => router.push('/footerpages/help')}
                  className={`flex-1 px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-white'
                  }`}
                >
                  Visit Help Center
                </button>
              </div>
              </Reveal>
            </section>
          </div>
        </div>
      </div>

        {/* Mobile Quick Navigation */}
        <MobileQuickNav
          sections={sections}
          activeSection={activeSection}
          onSelect={scrollToSection}
          darkMode={darkMode}
          label="Table of Contents"
        />

      <Footer darkMode={darkMode} />
    </div>
  );
}
