"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  Scale, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  Users,
  Shield,
  CreditCard,
  Gavel,
  Mail,
  Calendar,
  Info,
  BookOpen,
  Car,
  Home,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import Reveal from '../../_components/Reveal';
import MobileQuickNav from '../../_components/MobileQuickNav';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const router = useRouter();

  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 1, 2024";

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'services', title: 'Our Services', icon: Users },
    { id: 'accounts', title: 'User Accounts', icon: User },
    { id: 'conduct', title: 'User Conduct', icon: Shield },
    { id: 'content', title: 'Content & Intellectual Property', icon: BookOpen },
    { id: 'payments', title: 'Payments & Fees', icon: CreditCard },
    { id: 'liability', title: 'Liability & Disclaimers', icon: AlertTriangle },
    { id: 'termination', title: 'Termination', icon: XCircle },
    { id: 'changes', title: 'Changes to Terms', icon: Scale },
    { id: 'contact', title: 'Contact Information', icon: Mail }
  ];

  const serviceFeatures = [
    {
      service: 'Ride Sharing',
      description: 'Connect with verified students for shared transportation',
      icon: Car,
      terms: [
        'Drivers must have valid licenses and insurance',
        'All rides are arranged between students directly',
        'UniShare facilitates connections but is not a transportation provider'
      ]
    },
    {
      service: 'Student Marketplace',
      description: 'Buy and sell items within your university community',
      icon: ShoppingBag,
      terms: [
        'Items must be legal and appropriate for campus',
        'Transactions are between users directly',
        'UniShare provides the platform but not payment processing'
      ]
    },
    {
      service: 'Housing Network',
      description: 'Find roommates and housing options',
      icon: Home,
      terms: [
        'Listings must be accurate and truthful',
        'Housing arrangements are between users',
        'Verify all housing details independently'
      ]
    },
    {
      service: 'Study Resources',
      description: 'Share and access academic materials',
      icon: BookOpen,
      terms: [
        'Respect copyright and intellectual property rights',
        'Share only your own work or appropriately licensed materials',
        'Use shared materials for personal academic purposes only'
      ]
    }
  ];

  const prohibitedActivities = [
    'Posting false, misleading, or deceptive information',
    'Harassment, bullying, or discriminatory behavior',
    'Spam, phishing, or fraudulent activities',
    'Sharing copyrighted material without permission',
    'Using the platform for illegal activities',
    'Impersonating other users or entities',
    'Circumventing security measures or platform rules',
    'Commercial solicitation outside marketplace features'
  ];

  const userRights = [
    {
      right: 'Use Platform Services',
      description: 'Access and use UniShare features as intended',
      icon: CheckCircle
    },
    {
      right: 'Data Portability',
      description: 'Request your data in a portable format',
      icon: CheckCircle
    },
    {
      right: 'Account Deletion',
      description: 'Delete your account and associated data',
      icon: CheckCircle
    },
    {
      right: 'Fair Treatment',
      description: 'Equal access without discrimination',
      icon: CheckCircle
    }
  ];

  const userResponsibilities = [
    {
      responsibility: 'Accurate Information',
      description: 'Provide truthful and up-to-date account information',
      icon: User
    },
    {
      responsibility: 'Safe Interactions',
      description: 'Follow safety guidelines for all platform activities',
      icon: Shield
    },
    {
      responsibility: 'Respect Others',
      description: 'Treat all community members with respect',
      icon: Users
    },
    {
      responsibility: 'Legal Compliance',
      description: 'Follow all applicable laws and regulations',
      icon: Scale
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Terms of Service</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
          <Reveal className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-blue-300/20 text-blue-300 border border-blue-300/40' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <Scale className="w-4 h-4" />
            <span>Legal Terms & Conditions</span>
          </Reveal>

          <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Terms of Service
          </Reveal>
          
          <Reveal delay={80} className={`text-xl mb-6 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            These terms govern your use of UniShare and outline our mutual rights and responsibilities.
          </Reveal>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Reveal delay={120} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              darkMode ? 'bg-gray-800/50 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </Reveal>
            <Reveal delay={160} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
              darkMode ? 'bg-green-800/50 text-green-400' : 'bg-green-100 text-green-600'
            }`}>
              <CheckCircle className="w-4 h-4" />
              <span>Effective: {effectiveDate}</span>
            </Reveal>
          </div>
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
            <section id="overview" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Overview
                  </h2>
                </div>
                <div className={`space-y-4 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    Welcome to UniShare! These Terms of Service ("Terms") govern your access to and use of 
                    UniShare's platform, website, and mobile application. By creating an account or using 
                    our services, you agree to be bound by these Terms.
                  </p>
                  <p>
                    UniShare is a platform designed exclusively for university students to connect, share 
                    resources, and collaborate within their campus communities. We facilitate connections 
                    for ride sharing, marketplace transactions, housing arrangements, and academic resources.
                  </p>
                </div>
              </Reveal>
            </section>

            {/* Acceptance of Terms */}
            <section id="acceptance" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Acceptance of Terms
                  </h2>
                </div>
                <div className={`space-y-4 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    By accessing or using UniShare, you acknowledge that you have read, understood, and 
                    agree to be bound by these Terms and our Privacy Policy. If you do not agree to these 
                    Terms, you may not use our services.
                  </p>
                  <div className={`p-4 rounded-xl border-l-4 ${
                    darkMode 
                      ? 'bg-yellow-300/10 border-yellow-300 text-yellow-200' 
                      : 'bg-yellow-50 border-yellow-400 text-yellow-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 mt-1" />
                      <div>
                        <p className="font-semibold mb-1">Important:</p>
                        <p className="text-sm">
                          You must be at least 18 years old and enrolled at an accredited university to use UniShare.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* Our Services */}
            <section id="services" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Users className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Our Services
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {serviceFeatures.map((service, index) => (
                  <Reveal key={index} delay={index * 60}>
                    <div
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                        darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {service.service}
                      </h3>
                      <p className={`text-sm mb-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {service.description}
                      </p>
                      <ul className="space-y-2">
                        {service.terms.map((term, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                            <span>{term}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* User Conduct */}
            <section id="conduct" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Shield className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    User Conduct
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Rights */}
                <Reveal>
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Rights
                  </h3>
                  <div className="space-y-3">
                    {userRights.map((right, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <right.icon className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {right.right}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {right.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </Reveal>

                {/* User Responsibilities */}
                <Reveal delay={80}>
                <div>
                  <h3 className={`text-xl font-bold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Your Responsibilities
                  </h3>
                  <div className="space-y-3">
                    {userResponsibilities.map((resp, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <resp.icon className={`w-5 h-5 mt-1 ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {resp.responsibility}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {resp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                </Reveal>
              </div>

              {/* Prohibited Activities */}
              <Reveal className="mt-8">
                <h3 className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Prohibited Activities
                </h3>
                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'
                }`}>
                  <p className={`text-sm mb-3 ${
                    darkMode ? 'text-red-300' : 'text-red-700'
                  }`}>
                    The following activities are strictly prohibited on UniShare:
                  </p>
                  <ul className="space-y-1">
                    {prohibitedActivities.map((activity, index) => (
                      <li key={index} className={`flex items-start gap-2 text-sm ${
                        darkMode ? 'text-red-300' : 'text-red-700'
                      }`}>
                        <XCircle className="w-4 h-4 mt-0.5" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </section>

            {/* Liability & Disclaimers */}
            <section id="liability" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Liability & Disclaimers
                  </h2>
                </div>
                <div className={`space-y-4 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className={`p-4 rounded-xl border-l-4 ${
                    darkMode 
                      ? 'bg-orange-300/10 border-orange-300 text-orange-200' 
                      : 'bg-orange-50 border-orange-400 text-orange-800'
                  }`}>
                    <p className="font-semibold mb-2">Important Disclaimer:</p>
                    <p className="text-sm">
                      UniShare is a platform that facilitates connections between students. We do not provide 
                      transportation, housing, or guarantee the quality of items sold through our marketplace. 
                      All interactions and transactions are between users directly.
                    </p>
                  </div>
                  <p>
                    While we strive to maintain a safe platform, users are responsible for their own safety 
                    and should exercise caution in all interactions. We encourage users to meet in public 
                    places, verify identities, and trust their instincts.
                  </p>
                </div>
              </Reveal>
            </section>

            {/* Contact Information */}
            <section id="contact" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Mail className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Contact Information
                  </h2>
                </div>
                
                <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.open('mailto:legal@unishare.com')}
                    className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      darkMode 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Email Legal Team
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
