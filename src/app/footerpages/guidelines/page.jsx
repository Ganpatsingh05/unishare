"use client";

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ChevronRight, 
  Users, 
  Shield, 
  Heart, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  MessageCircle,
  Flag,
  Eye,
  UserCheck,
  Lock,
  Scale,
  Mail,
  Calendar,
  Car,
  Home,
  ShoppingBag,
  BookOpen,
  Camera,
  Phone,
  MapPin,
  CreditCard,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';
import Reveal from '../../_components/Reveal';
import MobileQuickNav from '../../_components/MobileQuickNav';

export default function GuidelinesPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [reportType, setReportType] = useState('');
  const router = useRouter();

  const lastUpdated = "January 15, 2024";

  const sections = [
    { id: 'overview', title: 'Community Overview', icon: Users },
    { id: 'core-values', title: 'Core Values', icon: Heart },
    { id: 'ride-sharing', title: 'Ride Sharing', icon: Car },
    { id: 'marketplace', title: 'Marketplace', icon: ShoppingBag },
    { id: 'housing', title: 'Housing', icon: Home },
    { id: 'communication', title: 'Communication', icon: MessageCircle },
    { id: 'prohibited', title: 'Prohibited Behavior', icon: XCircle },
    { id: 'reporting', title: 'Reporting & Safety', icon: Flag },
    { id: 'consequences', title: 'Consequences', icon: Scale },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ];

  const coreValues = [
    {
      value: 'Safety First',
      description: 'Every interaction should prioritize the safety and wellbeing of all community members',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      principles: [
        'Verify identities before meeting in person',
        'Meet in public, well-lit places',
        'Trust your instincts and report concerns',
        'Share location with friends for in-person meetings'
      ]
    },
    {
      value: 'Respect & Inclusion',
      description: 'Treat everyone with dignity regardless of background, identity, or beliefs',
      icon: Heart,
      color: 'from-purple-500 to-violet-500',
      principles: [
        'Use inclusive and respectful language',
        'Embrace diversity in all its forms',
        'No harassment, discrimination, or hate speech',
        'Be understanding of different perspectives'
      ]
    },
    {
      value: 'Honesty & Transparency',
      description: 'Build trust through honest communication and transparent interactions',
      icon: UserCheck,
      color: 'from-blue-500 to-cyan-500',
      principles: [
        'Provide accurate information in all listings',
        'Be transparent about conditions and expectations',
        'Honor your commitments and agreements',
        'Communicate clearly and promptly'
      ]
    },
    {
      value: 'Mutual Support',
      description: 'Help fellow students succeed and build a supportive community',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      principles: [
        'Share knowledge and resources generously',
        'Offer help when you can',
        'Celebrate others\' successes',
        'Build lasting friendships and connections'
      ]
    }
  ];

  const serviceGuidelines = [
    {
      service: 'Ride Sharing',
      icon: Car,
      color: 'from-blue-500 to-cyan-500',
      guidelines: [
        {
          category: 'For Drivers',
          rules: [
            'Valid driver\'s license and current vehicle insurance required',
            'Vehicle must be in safe, working condition',
            'Accurately describe your vehicle and departure times',
            'Communicate any changes to pickup times promptly',
            'Respect passenger comfort and safety preferences'
          ]
        },
        {
          category: 'For Passengers',
          rules: [
            'Be ready at the agreed pickup time and location',
            'Contribute to fuel costs as agreed',
            'Respect the driver\'s vehicle and rules',
            'Communicate if you need to cancel',
            'Help with navigation if needed'
          ]
        }
      ]
    },
    {
      service: 'Marketplace',
      icon: ShoppingBag,
      color: 'from-green-500 to-emerald-500',
      guidelines: [
        {
          category: 'For Sellers',
          rules: [
            'Post clear, accurate photos of items',
            'Describe condition honestly, including any flaws',
            'Price items fairly based on condition and market value',
            'Respond to inquiries promptly and courteously',
            'Complete transactions as agreed'
          ]
        },
        {
          category: 'For Buyers',
          rules: [
            'Ask questions if item details are unclear',
            'Inspect items before purchasing when possible',
            'Follow through on purchase commitments',
            'Leave honest feedback after transactions',
            'Report any issues promptly'
          ]
        }
      ]
    },
    {
      service: 'Housing',
      icon: Home,
      color: 'from-purple-500 to-violet-500',
      guidelines: [
        {
          category: 'For Housing Providers',
          rules: [
            'Provide accurate photos and descriptions',
            'Be transparent about costs, rules, and expectations',
            'Respond to inquiries within 24 hours',
            'Treat all potential tenants fairly and equally',
            'Maintain properties in good condition'
          ]
        },
        {
          category: 'For Housing Seekers',
          rules: [
            'Provide honest information about yourself',
            'Ask important questions before committing',
            'Respect property viewing appointments',
            'Follow through on housing commitments',
            'Be a considerate roommate or tenant'
          ]
        }
      ]
    }
  ];

  const prohibitedBehaviors = [
    {
      category: 'Safety Violations',
      behaviors: [
        'Sharing personal information of others without consent',
        'Meeting in unsafe or private locations for first encounters',
        'Driving under the influence or with impaired abilities',
        'Bringing unauthorized passengers or items'
      ],
      severity: 'High'
    },
    {
      category: 'Harassment & Discrimination',
      behaviors: [
        'Sending unwanted romantic or sexual messages',
        'Making discriminatory comments based on identity',
        'Persistent contact after being asked to stop',
        'Threatening or intimidating behavior'
      ],
      severity: 'High'
    },
    {
      category: 'Fraudulent Activity',
      behaviors: [
        'Posting fake listings or false information',
        'Accepting payment without delivering promised goods/services',
        'Using fake photos or impersonating others',
        'Promoting pyramid schemes or scams'
      ],
      severity: 'High'
    },
    {
      category: 'Platform Misuse',
      behaviors: [
        'Spam messaging or excessive promotional content',
        'Creating multiple accounts to circumvent restrictions',
        'Using the platform for commercial business (non-student)',
        'Sharing inappropriate or explicit content'
      ],
      severity: 'Medium'
    }
  ];

  const reportingCategories = [
    'Safety Concern',
    'Harassment or Discrimination',
    'Fraudulent Activity',
    'Inappropriate Content',
    'Spam or Abuse',
    'Technical Issue',
    'Other'
  ];

  const consequences = [
    {
      violation: 'First Minor Violation',
      action: 'Warning and educational guidance',
      duration: 'N/A',
      icon: AlertTriangle,
      color: 'text-yellow-500'
    },
    {
      violation: 'Repeated Minor Violations',
      action: 'Temporary account restriction',
      duration: '3-7 days',
      icon: Clock,
      color: 'text-orange-500'
    },
    {
      violation: 'Major Safety Violation',
      action: 'Immediate temporary suspension',
      duration: '7-30 days',
      icon: Shield,
      color: 'text-red-500'
    },
    {
      violation: 'Severe or Repeated Major Violations',
      action: 'Permanent account termination',
      duration: 'Permanent',
      icon: XCircle,
      color: 'text-red-600'
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Community Guidelines</span>
        </div>
      </div>

    {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-12">
        <div className="text-center mb-12">
      <Reveal className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-purple-300/20 text-purple-300 border border-purple-300/40' 
              : 'bg-purple-100 text-purple-700 border border-purple-200'
      }`}>
            <Users className="w-4 h-4" />
            <span>Building a Safe Community</span>
      </Reveal>

      <Reveal className={`text-4xl md:text-6xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
      }`}>
            Community Guidelines
      </Reveal>
          
      <Reveal delay={100} className={`text-xl mb-6 max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
      }`}>
            These guidelines help us maintain a safe, respectful, and supportive community for all students.
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
                  onClick={() => router.push('/footerpages/report')}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Report a Problem
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
              <div className="flex items-center gap-3 mb-6">
                <Users className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Community Overview
                </h2>
              </div>
              <div className={`space-y-4 text-lg leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  UniShare exists to help students connect, collaborate, and support each other throughout 
                  their university journey. Our community guidelines ensure that everyone can participate 
                  safely and respectfully.
                </p>
                <p>
                  These guidelines apply to all interactions on our platform, including ride sharing, 
                  marketplace transactions, housing arrangements, and all forms of communication. 
                  By using UniShare, you agree to follow these guidelines and help create a positive 
                  experience for everyone.
                </p>
              </div>
            </section>

            {/* Core Values */}
            <section id="core-values" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Heart className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Core Values
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreValues.map((value, index) => (
                  <Reveal
                    key={index}
                    delay={index * 80}
                    className={`p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
                      darkMode
                        ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700/80'
                        : 'bg-gray-50 border-gray-200 hover:bg-white'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-gradient-to-r ${value.color} text-white`}>
                      <value.icon className="w-6 h-6" />
                    </div>
                    <h3 className={`text-lg font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {value.value}
                    </h3>
                    <p className={`text-sm mb-4 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {value.description}
                    </p>
                    <ul className="space-y-1">
                      {value.principles.map((principle, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Service-Specific Guidelines */}
            {serviceGuidelines.map((service) => (
              <section 
                key={service.service.toLowerCase().replace(' ', '-')} 
                id={service.service.toLowerCase().replace(' ', '-')} 
                className={`p-8 rounded-2xl border-2 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white/50 border-gray-200'
                } backdrop-blur-md`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <service.icon className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {service.service} Guidelines
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {service.guidelines.map((guideline, index) => (
                    <Reveal
                      key={index}
                      delay={index * 70}
                      className={`p-4 rounded-xl border ${
                        darkMode
                          ? 'bg-gray-700/30 border-gray-600'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <h3 className={`text-lg font-semibold mb-3 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {guideline.category}
                      </h3>
                      <ul className="space-y-2">
                        {guideline.rules.map((rule, idx) => (
                          <li key={idx} className={`flex items-start gap-2 text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}

            {/* Prohibited Behavior */}
            <section id="prohibited" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <XCircle className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Prohibited Behavior
                </h2>
              </div>
              
              <div className="space-y-6">
                {prohibitedBehaviors.map((category, index) => (
                  <Reveal
                    key={index}
                    delay={index * 60}
                    className={`p-4 rounded-xl border ${
                      category.severity === 'High'
                        ? darkMode
                          ? 'bg-red-900/20 border-red-800'
                          : 'bg-red-50 border-red-200'
                        : darkMode
                          ? 'bg-orange-900/20 border-orange-800'
                          : 'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`text-lg font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {category.category}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.severity === 'High'
                          ? darkMode
                            ? 'bg-red-800 text-red-300'
                            : 'bg-red-100 text-red-700'
                          : darkMode
                            ? 'bg-orange-800 text-orange-300'
                            : 'bg-orange-100 text-orange-700'
                      }`}>
                        {category.severity} Risk
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {category.behaviors.map((behavior, idx) => (
                        <li key={idx} className={`flex items-start gap-2 text-sm ${
                          category.severity === 'High'
                            ? darkMode ? 'text-red-300' : 'text-red-700'
                            : darkMode ? 'text-orange-300' : 'text-orange-700'
                        }`}>
                          <XCircle className="w-4 h-4 mt-0.5" />
                          <span>{behavior}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* Reporting & Safety */}
            <section id="reporting" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Flag className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reporting & Safety
                </h2>
              </div>
              
              <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  If you encounter behavior that violates our guidelines or makes you feel unsafe, 
                  please report it immediately. We take all reports seriously and investigate 
                  them promptly.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {reportingCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setReportType(category)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all duration-200 ${
                      reportType === category
                        ? darkMode
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-red-500 text-white border-red-400'
                        : darkMode
                          ? 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-700'
                          : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push('/footerpages/report')}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  Submit Report
                </button>
                <button 
                  onClick={() => window.open('mailto:safety@unishare.com')}
                  className={`flex-1 px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-white'
                  }`}
                >
                  Contact Safety Team
                </button>
              </div>
            </section>

            {/* Consequences */}
            <section id="consequences" className={`p-8 rounded-2xl border-2 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            } backdrop-blur-md`}>
              <div className="flex items-center gap-3 mb-6">
                <Scale className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Consequences
                </h2>
              </div>
              
              <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  Violations of our community guidelines result in appropriate consequences 
                  designed to maintain safety and encourage positive behavior.
                </p>
              </div>

              <div className="space-y-4">
                {consequences.map((consequence, index) => (
                  <Reveal
                    key={index}
                    delay={index * 70}
                    className={`p-4 rounded-xl border ${
                      darkMode
                        ? 'bg-gray-700/30 border-gray-600'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <consequence.icon className={`w-6 h-6 ${consequence.color}`} />
                      <div className="flex-1">
                        <h3 className={`font-semibold mb-1 ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {consequence.violation}
                        </h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {consequence.action}
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {consequence.duration}
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
              <div className="flex items-center gap-3 mb-6">
                <Mail className={`w-6 h-6 ${darkMode ? 'text-yellow-300' : 'text-blue-600'}`} />
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Questions About Guidelines?
                </h2>
              </div>
              
              <div className={`space-y-4 text-lg leading-relaxed mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <p>
                  If you have questions about our community guidelines or need clarification 
                  about what's acceptable, we're here to help.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => window.open('mailto:community@unishare.com')}
                  className={`flex-1 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Contact Community Team
                </button>
                <button 
                  onClick={() => router.push('/footerpages/help')}
                  className={`flex-1 px-6 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                      : 'border-gray-300 text-gray-700 hover:bg-white'
                  }`}
                >
                  Visit Help Center
                </button>
              </div>
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
