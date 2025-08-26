"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Cookie, 
  Settings, 
  Eye, 
  BarChart3, 
  Shield, 
  Globe, 
  Zap,
  Target,
  Calendar,
  Info,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Download,
  RefreshCw,
  Mail
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import Reveal from '../../_components/Reveal';
import MobileQuickNav from '../../_components/MobileQuickNav';
import { useRouter } from 'next/navigation';

export default function CookiesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });
  const router = useRouter();

  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: 'overview', title: 'What Are Cookies', icon: Cookie },
    { id: 'types', title: 'Types of Cookies', icon: BarChart3 },
    { id: 'usage', title: 'How We Use Cookies', icon: Target },
    { id: 'settings', title: 'Cookie Settings', icon: Settings },
    { id: 'control', title: 'Your Controls', icon: Shield },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  const cookieTypes = [
    {
      type: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      required: true,
      examples: [
        'User authentication and session management',
        'Security and fraud prevention',
        'Basic website functionality',
        'Load balancing and performance'
      ]
    },
    {
      type: 'Analytics Cookies',
      description: 'Help us understand how you use our website so we can improve your experience.',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      required: false,
      examples: [
        'Page view tracking and user journeys',
        'Feature usage statistics',
        'Error reporting and debugging',
        'Performance monitoring'
      ]
    },
    {
      type: 'Preference Cookies',
      description: 'Remember your settings and preferences to provide a personalized experience.',
      icon: Settings,
      color: 'from-green-500 to-emerald-500',
      required: false,
      examples: [
        'Dark/light mode preferences',
        'Language and region settings',
        'Dashboard customizations',
        'Notification preferences'
      ]
    },
    {
      type: 'Marketing Cookies',
      description: 'Used to show you relevant advertisements and measure campaign effectiveness.',
      icon: Target,
      color: 'from-purple-500 to-violet-500',
      required: false,
      examples: [
        'Advertising campaign tracking',
        'Social media integration',
        'Retargeting and remarketing',
        'Third-party advertising partners'
      ]
    }
  ];

  const thirdPartyServices = [
    {
      service: 'Google Analytics',
      purpose: 'Website usage analytics and performance monitoring',
      dataCollected: 'Page views, user interactions, device information',
      retention: '26 months',
      optOut: 'https://tools.google.com/dlpage/gaoptout'
    },
    {
      service: 'Google Fonts',
      purpose: 'Loading web fonts for consistent typography',
      dataCollected: 'IP address, browser information',
      retention: '1 day',
      optOut: 'Block in browser settings'
    },
    {
      service: 'Cloudflare',
      purpose: 'Content delivery and security protection',
      dataCollected: 'IP address, security threat data',
      retention: '30 days',
      optOut: 'Not applicable (security essential)'
    }
  ];

  const handleCookieToggle = (type) => {
    if (type === 'essential') return; // Can't toggle essential cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to localStorage and apply settings
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved successfully!');
  };

  const clearAllCookies = () => {
    // In a real app, this would clear non-essential cookies
    if (confirm('Are you sure you want to clear all non-essential cookies? This may affect your user experience.')) {
      // Clear cookies logic here
      alert('Non-essential cookies cleared!');
    }
  };

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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Cookie Policy</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <Reveal className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-orange-300/20 text-orange-300 border border-orange-300/40' 
              : 'bg-orange-100 text-orange-700 border border-orange-200'
          }`}>
            <Cookie className="w-4 h-4" />
            <span>Cookie Policy & Preferences</span>
          </Reveal>

          <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Cookie Policy
          </Reveal>
          
          <Reveal delay={80} className={`text-xl mb-6 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Learn about how UniShare uses cookies and similar technologies to improve your experience.
          </Reveal>

          <Reveal delay={120} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
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
                Quick Navigation
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
              
              <div className="mt-6 pt-4 border-t border-gray-300/20">
                <button
                  onClick={() => scrollToSection('settings')}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Manage Cookie Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Overview Section */}
            <section id="overview" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Cookie className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    What Are Cookies
                  </h2>
                </div>
                <div className={`space-y-4 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    Cookies are small text files that are stored on your device when you visit a website. 
                    They help websites remember information about your visit, which can make your next 
                    visit easier and the site more useful to you.
                  </p>
                  <p>
                    At UniShare, we use cookies to enhance your experience, analyze how our platform is used, 
                    and provide personalized features. We're committed to being transparent about what data 
                    we collect and how we use it.
                  </p>
                  <div className={`p-4 rounded-xl border-l-4 ${
                    darkMode 
                      ? 'bg-blue-300/10 border-blue-300 text-blue-200' 
                      : 'bg-blue-50 border-blue-400 text-blue-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 mt-1" />
                      <div>
                        <p className="font-semibold mb-1">Your Control:</p>
                        <p className="text-sm">
                          You can control and configure which cookies you accept through our cookie settings panel below.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* Types of Cookies */}
            <section id="types" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Types of Cookies We Use
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-6">
                {cookieTypes.map((cookie, index) => (
                  <Reveal key={index} delay={index * 70}>
                    <div
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${cookie.color} text-white`}>
                          <cookie.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={`text-lg font-bold ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {cookie.type}
                            </h3>
                            <div className="flex items-center gap-2">
                              {cookie.required ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-700'
                                }`}>
                                  Required
                                </span>
                              ) : (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'
                                }`}>
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>
                          <p className={`text-sm mb-4 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {cookie.description}
                          </p>
                          <div className="space-y-1">
                            <p className={`text-sm font-medium ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Examples:
                            </p>
                            <ul className="space-y-1">
                              {cookie.examples.map((example, idx) => (
                                <li key={idx} className={`flex items-center gap-2 text-xs ${
                                  darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Cookie Settings */}
            <section id="settings" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Settings className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Cookie Settings
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-4 mb-6">
                {Object.entries(cookieSettings).map(([key, enabled]) => {
                  const cookieInfo = cookieTypes.find(c => 
                    c.type.toLowerCase().includes(key) || 
                    (key === 'essential' && c.required) ||
                    (key === 'analytics' && c.type.includes('Analytics')) ||
                    (key === 'marketing' && c.type.includes('Marketing')) ||
                    (key === 'preferences' && c.type.includes('Preference'))
                  );
                  
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold capitalize ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {key} Cookies
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {cookieInfo?.description || `${key} cookies for enhanced functionality`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCookieToggle(key)}
                          disabled={key === 'essential'}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 active:scale-95 ${
                            key === 'essential'
                              ? darkMode
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : enabled
                                ? darkMode
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-green-500 text-white hover:bg-green-600'
                                : darkMode
                                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-700'
                                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          {enabled ? (
                            <>
                              <ToggleRight className="w-5 h-5" />
                              <span>Enabled</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="w-5 h-5" />
                              <span>Disabled</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

        <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={saveSettings}
          className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Save Preferences
                </button>
                <button
                  onClick={clearAllCookies}
          className={`flex-1 px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'border-red-600 text-red-400 hover:bg-red-900/20' 
                      : 'border-red-500 text-red-600 hover:bg-red-50'
                  }`}
                >
                  Clear Cookies
                </button>
              </div>
            </section>

            {/* Third Party Services */}
            <section id="third-party" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Globe className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Third-Party Services
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-4">
                {thirdPartyServices.map((service, index) => (
                  <Reveal key={index} delay={index * 60}>
                    <div
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <h4 className={`font-semibold mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {service.service}
                          </h4>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {service.purpose}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Data Collected:
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {service.dataCollected}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Retention:
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {service.retention}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Opt-out:
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {service.optOut}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Mail className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Questions About Cookies?
                  </h2>
                </div>
                
                <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    If you have any questions about our use of cookies or this policy, please don't hesitate to contact us.
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
                    Contact Privacy Team
                  </button>
                  <button 
                    onClick={() => router.push('/footerpages/privacy')}
                    className={`flex-1 px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      darkMode 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-700 hover:bg-white'
                    }`}
                  >
                    View Privacy Policy
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
          label="Quick Navigation"
        />

      <Footer darkMode={darkMode} />
    </div>
  );
}
