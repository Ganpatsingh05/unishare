"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Shield, 
  Lock, 
  Database, 
  Key, 
  Eye, 
  Server, 
  Globe,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
  Settings,
  FileText,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  RefreshCw,
  UserCheck,
  AlertCircle,
  Info,
  ExternalLink,
  Scale
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import Reveal from '../../_components/Reveal';
import MobileQuickNav from '../../_components/MobileQuickNav';
import { useRouter } from 'next/navigation';

export default function DataProtectionPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [gdprRequest, setGdprRequest] = useState('');
  const router = useRouter();

  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: 'overview', title: 'Data Protection Overview', icon: Shield },
    { id: 'legal-basis', title: 'Legal Basis', icon: FileText },
    { id: 'data-collection', title: 'Data Collection', icon: Database },
    { id: 'data-processing', title: 'Data Processing', icon: Settings },
    { id: 'data-sharing', title: 'Data Sharing', icon: Globe },
    { id: 'security', title: 'Security Measures', icon: Lock },
    { id: 'retention', title: 'Data Retention', icon: Clock },
    { id: 'rights', title: 'Your Rights', icon: UserCheck },
    { id: 'gdpr', title: 'GDPR Compliance', icon: CheckCircle },
    { id: 'contact', title: 'Contact DPO', icon: Mail }
  ];

  const legalBases = [
    {
      basis: 'Legitimate Interest',
      description: 'Processing necessary for our legitimate interests in providing student services',
      examples: [
        'Platform security and fraud prevention',
        'Service improvement and analytics',
        'Customer support and communication',
        'Marketing to existing users'
      ],
      icon: Scale,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      basis: 'Contract Performance',
      description: 'Processing necessary to provide the services you requested',
      examples: [
        'Account creation and management',
        'Facilitating ride shares and transactions',
        'Payment processing and billing',
        'Delivery of platform features'
      ],
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      basis: 'Consent',
      description: 'Processing based on your explicit consent',
      examples: [
        'Marketing communications',
        'Optional analytics cookies',
        'Location services for rides',
        'Photo uploads and sharing'
      ],
      icon: CheckCircle,
      color: 'from-purple-500 to-violet-500'
    },
    {
      basis: 'Legal Obligation',
      description: 'Processing required by law or regulation',
      examples: [
        'Tax reporting and compliance',
        'Fraud investigation cooperation',
        'University verification requirements',
        'Data breach notifications'
      ],
      icon: Scale,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const dataCategories = [
    {
      category: 'Identity Data',
      types: ['Full name', 'Email address', 'Phone number', 'Student ID', 'Profile photo'],
      purpose: 'Account management and user verification',
      retention: '2 years after account deletion',
      lawful_basis: 'Contract Performance'
    },
    {
      category: 'Contact Data',
      types: ['University', 'Graduation year', 'Emergency contacts', 'Communication preferences'],
      purpose: 'Platform functionality and safety',
      retention: '2 years after account deletion',
      lawful_basis: 'Contract Performance'
    },
    {
      category: 'Transaction Data',
      types: ['Ride history', 'Marketplace purchases', 'Housing searches', 'Payment records'],
      purpose: 'Service delivery and support',
      retention: '7 years (financial records)',
      lawful_basis: 'Contract Performance'
    },
    {
      category: 'Technical Data',
      types: ['IP address', 'Browser type', 'Device information', 'App usage data'],
      purpose: 'Platform security and improvement',
      retention: '2 years',
      lawful_basis: 'Legitimate Interest'
    },
    {
      category: 'Marketing Data',
      types: ['Email preferences', 'Campaign interactions', 'Feature usage patterns'],
      purpose: 'Service improvement and marketing',
      retention: 'Until consent withdrawn',
      lawful_basis: 'Consent'
    }
  ];

  const securityMeasures = [
    {
      measure: 'Encryption',
      description: 'End-to-end encryption for sensitive data transmission and storage',
      implementation: 'AES-256 encryption, TLS 1.3, encrypted databases',
      icon: Lock
    },
    {
      measure: 'Access Controls',
      description: 'Strict authentication and authorization for data access',
      implementation: 'Multi-factor authentication, role-based access, audit logs',
      icon: Key
    },
    {
      measure: 'Data Minimization',
      description: 'Only collect and retain data necessary for our services',
      implementation: 'Regular data audits, automated deletion, purpose limitation',
      icon: Database
    },
    {
      measure: 'Security Monitoring',
      description: '24/7 monitoring for threats and vulnerabilities',
      implementation: 'Intrusion detection, vulnerability scanning, incident response',
      icon: Eye
    },
    {
      measure: 'Regular Audits',
      description: 'Third-party security assessments and compliance checks',
      implementation: 'Annual penetration testing, GDPR compliance audits, ISO certifications',
      icon: CheckCircle
    },
    {
      measure: 'Staff Training',
      description: 'Regular data protection training for all team members',
      implementation: 'GDPR training, security awareness, incident response drills',
      icon: UserCheck
    }
  ];

  const yourRights = [
    {
      right: 'Right to Access',
      description: 'Request a copy of all personal data we hold about you',
      action: 'Submit data export request',
      timeframe: '30 days',
      icon: Download
    },
    {
      right: 'Right to Rectification',
      description: 'Correct any inaccurate or incomplete personal data',
      action: 'Update your profile or contact us',
      timeframe: '30 days',
      icon: Settings
    },
    {
      right: 'Right to Erasure',
      description: 'Request deletion of your personal data',
      action: 'Delete account or submit erasure request',
      timeframe: '30 days',
      icon: Trash2
    },
    {
      right: 'Right to Restrict Processing',
      description: 'Limit how we process your personal data',
      action: 'Contact our Data Protection Officer',
      timeframe: '30 days',
      icon: AlertTriangle
    },
    {
      right: 'Right to Data Portability',
      description: 'Receive your data in a machine-readable format',
      action: 'Request data export in JSON/CSV format',
      timeframe: '30 days',
      icon: RefreshCw
    },
    {
      right: 'Right to Object',
      description: 'Object to processing based on legitimate interests',
      action: 'Contact us with your objection',
      timeframe: '30 days',
      icon: AlertCircle
    }
  ];

  const gdprCompliance = [
    {
      requirement: 'Lawful Basis',
      status: 'Compliant',
      description: 'Clear legal basis for all data processing activities'
    },
    {
      requirement: 'Data Protection by Design',
      status: 'Compliant',
      description: 'Privacy considerations built into all systems and processes'
    },
    {
      requirement: 'Data Protection Impact Assessments',
      status: 'Compliant',
      description: 'Regular DPIAs conducted for high-risk processing'
    },
    {
      requirement: 'Breach Notification',
      status: 'Compliant',
      description: '72-hour breach notification procedures in place'
    },
    {
      requirement: 'Data Protection Officer',
      status: 'Compliant',
      description: 'Qualified DPO appointed and contactable'
    },
    {
      requirement: 'International Transfers',
      status: 'Compliant',
      description: 'Adequate safeguards for any data transfers outside EU'
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGdprRequest = (requestType) => {
    setGdprRequest(requestType);
    // In a real app, this would redirect to a form or email
    window.open(`mailto:dpo@unishare.com?subject=GDPR Request: ${requestType}&body=Please provide details about your ${requestType} request.`);
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Data Protection</span>
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
            <Shield className="w-4 h-4" />
            <span>GDPR Compliant</span>
          </Reveal>

          <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Data Protection
          </Reveal>
          
          <Reveal delay={80} className={`text-xl mb-6 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Comprehensive information about how we protect your personal data and comply with data protection regulations.
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
                  onClick={() => scrollToSection('rights')}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Exercise Your Rights
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
                  <Shield className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Data Protection Overview
                  </h2>
                </div>
                <div className={`space-y-4 text-lg leading-relaxed ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    At UniShare, we are committed to protecting your personal data and respecting your privacy rights. 
                    We comply with the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), 
                    and other applicable data protection laws.
                  </p>
                  <p>
                    This page provides detailed information about how we collect, process, store, and protect your 
                    personal data, as well as your rights regarding that data.
                  </p>
                  <div className={`p-4 rounded-xl border-l-4 ${
                    darkMode 
                      ? 'bg-green-300/10 border-green-300 text-green-200' 
                      : 'bg-green-50 border-green-400 text-green-800'
                  }`}>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-1" />
                      <div>
                        <p className="font-semibold mb-1">GDPR Compliant:</p>
                        <p className="text-sm">
                          We have implemented comprehensive measures to ensure full compliance with data protection regulations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* Legal Basis */}
            <section id="legal-basis" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <FileText className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Legal Basis for Processing
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {legalBases.map((basis, index) => (
                  <Reveal key={index} delay={index * 60}>
                    <div
                      className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r ${basis.color} text-white`}>
                        <basis.icon className="w-6 h-6" />
                      </div>
                      <h3 className={`text-lg font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {basis.basis}
                      </h3>
                      <p className={`text-sm mb-4 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {basis.description}
                      </p>
                      <ul className="space-y-1">
                        {basis.examples.map((example, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Data Collection */}
            <section id="data-collection" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Database className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Data Collection & Processing
                  </h2>
                </div>
              </Reveal>
              
              <div className="space-y-6">
                {dataCategories.map((category, index) => (
                  <Reveal key={index} delay={index * 50}>
                    <div
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div>
                          <h3 className={`font-semibold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {category.category}
                          </h3>
                          <div className="flex flex-wrap gap-1">
                            {category.types.map((type, idx) => (
                              <span key={idx} className={`px-2 py-1 rounded text-xs ${
                                darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                              }`}>
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Purpose:
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {category.purpose}
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
                            {category.retention}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium mb-1 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Legal Basis:
                          </p>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {category.lawful_basis}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Security Measures */}
            <section id="security" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Lock className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Security Measures
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {securityMeasures.map((measure, index) => (
                  <Reveal key={index} delay={index * 60}>
                    <div
                      className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600 hover:bg-gray-700/50'
                          : 'bg-gray-50 border-gray-200 hover:bg-white'
                      }`}
                    >
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 ${
                        darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <measure.icon className="w-5 h-5" />
                      </div>
                      <h3 className={`font-semibold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {measure.measure}
                      </h3>
                      <p className={`text-sm mb-3 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {measure.description}
                      </p>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {measure.implementation}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Your Rights */}
            <section id="rights" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <UserCheck className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Data Protection Rights
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {yourRights.map((right, index) => (
                  <Reveal key={index} delay={index * 60}>
                    <div
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          darkMode ? 'bg-yellow-300/20 text-yellow-300' : 'bg-blue-100 text-blue-600'
                        }`}>
                          <right.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {right.right}
                          </h3>
                          <p className={`text-sm mb-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {right.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => handleGdprRequest(right.right)}
                              className={`text-sm font-medium transition-colors duration-200 active:scale-95 ${
                                darkMode ? 'text-yellow-300 hover:text-yellow-200' : 'text-blue-600 hover:text-blue-700'
                              }`}
                            >
                              {right.action} →
                            </button>
                            <span className={`text-xs ${
                              darkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {right.timeframe}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal className={`p-4 rounded-xl border-l-4 ${
                darkMode 
                  ? 'bg-blue-300/10 border-blue-300 text-blue-200' 
                  : 'bg-blue-50 border-blue-400 text-blue-800'
              }`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold mb-1">Exercise Your Rights:</p>
                    <p className="text-sm">
                      To exercise any of these rights, contact our Data Protection Officer at dpo@unishare.com 
                      or use the contact form below. We will respond within 30 days.
                    </p>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* GDPR Compliance */}
            <section id="gdpr" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    GDPR Compliance Status
                  </h2>
                </div>
              </Reveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gdprCompliance.map((item, index) => (
                  <Reveal key={index} delay={index * 50}>
                    <div
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-green-900/20 border-green-800'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-green-300' : 'text-green-700'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <h3 className={`font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {item.requirement}
                      </h3>
                      <p className={`text-xs ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Contact DPO */}
            <section id="contact" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <Reveal>
                <div className="flex items-center gap-3 mb-6">
                  <Mail className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Contact Our Data Protection Officer
                  </h2>
                </div>
                
                <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <p>
                    If you have any questions about how we handle your personal data or wish to exercise 
                    your data protection rights, please contact our Data Protection Officer.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700/30 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className={`w-4 h-4 ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          dpo@unishare.com
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className={`w-4 h-4 ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          +1 (555) 123-4567 ext. 301
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className={`w-4 h-4 mt-0.5 ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Data Protection Officer<br />
                          UniShare Inc.<br />
                          123 Student Street<br />
                          University City, CA 90210
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border ${
                    darkMode
                      ? 'bg-gray-700/30 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Response Times
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          General Inquiries
                        </span>
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`}>
                          24-48 hours
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Data Subject Requests
                        </span>
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`}>
                          Within 30 days
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Urgent Privacy Matters
                        </span>
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-yellow-300' : 'text-blue-600'
                        }`}>
                          Within 24 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.open('mailto:dpo@unishare.com')}
                    className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      darkMode 
                        ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Contact Data Protection Officer
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
