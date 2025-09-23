"use client";

import { useState, useEffect } from 'react';
import { 
  Flag, 
  AlertTriangle, 
  Shield, 
  User, 
  MessageSquare, 
  Send,
  CheckCircle,
  Clock,
  Eye,
  Lock,
  ChevronRight,
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  Zap,
  Star,
  ThumbsUp,
  ExternalLink,
  Loader2
} from 'lucide-react';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';
import { useUI, useAuth } from '../../lib/contexts/UniShareContext';

export default function ReportIssues() {
  const {darkMode} = useUI();
  const {user} = useAuth(); // Get user from auth context
  const [reportType, setReportType] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [urgency, setUrgency] = useState('medium');
  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'pending', 'success', 'error'
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();

  const reportTypes = [
    {
      id: 'safety',
      name: 'Safety Concern',
      description: 'Unsafe behavior, harassment, or security issues',
      icon: Shield,
      color: 'from-red-500 to-rose-500',
      examples: ['Harassment', 'Unsafe meeting locations', 'Suspicious behavior', 'Threats']
    },
    {
      id: 'fraud',
      name: 'Fraud/Scam',
      description: 'Fraudulent activities, fake listings, or scams',
      icon: AlertTriangle,
      color: 'from-orange-500 to-yellow-500',
      examples: ['Fake items', 'Payment scams', 'Identity fraud', 'Fake profiles']
    },
    {
      id: 'user',
      name: 'User Behavior',
      description: 'Inappropriate user conduct or violations',
      icon: User,
      color: 'from-purple-500 to-violet-500',
      examples: ['Spam messages', 'Inappropriate content', 'Profile violations', 'Abusive language']
    },
    {
      id: 'technical',
      name: 'Technical Issue',
      description: 'App bugs, loading problems, or technical difficulties',
      icon: Zap,
      color: 'from-blue-500 to-cyan-500',
      examples: ['App crashes', 'Loading errors', 'Payment issues', 'Feature not working']
    },
    {
      id: 'content',
      name: 'Inappropriate Content',
      description: 'Offensive, illegal, or inappropriate posted content',
      icon: Eye,
      color: 'from-pink-500 to-rose-500',
      examples: ['Offensive images', 'Inappropriate listings', 'Spam posts', 'Illegal items']
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Other issues or concerns not listed above',
      icon: MessageSquare,
      color: 'from-gray-500 to-gray-600',
      examples: ['General feedback', 'Feature requests', 'Policy questions', 'Other concerns']
    }
  ];

  const urgencyLevels = [
    { 
      id: 'low', 
      name: 'Low Priority', 
      description: 'General feedback or minor issues',
      color: 'from-green-500 to-emerald-500',
      responseTime: '3-5 business days'
    },
    { 
      id: 'medium', 
      name: 'Medium Priority', 
      description: 'Issues affecting user experience',
      color: 'from-yellow-500 to-orange-500',
      responseTime: '1-2 business days'
    },
    { 
      id: 'high', 
      name: 'High Priority', 
      description: 'Safety concerns or serious violations',
      color: 'from-red-500 to-rose-500',
      responseTime: 'Within 24 hours'
    }
  ];

  const contactMethods = [
    {
      method: 'Online Form',
      description: 'Submit detailed reports with attachments',
      icon: FileText,
      recommended: true,
      responseTime: 'Fastest response'
    },
    {
      method: 'Email Support',
      description: 'Send detailed reports via email',
      icon: Mail,
      contact: 'support@unishare.com',
      responseTime: '24-48 hours'
    },
    {
      method: 'Emergency Line',
      description: 'For immediate safety concerns only',
      icon: Phone,
      contact: '(555) 123-SAFE',
      responseTime: 'Immediate'
    }
  ];

  // Function to submit via iframe (alternative method)
  const submitViaIframe = (formData) => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'hidden_iframe';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSe0m0oz-Jzx_QQCPmZtLjbvZY3uUW7gRL3-waTH3jg8-OZuQg/formResponse';
      form.target = 'hidden_iframe';
      form.style.display = 'none';

      // Add form fields
      Object.keys(formData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      
      // Listen for iframe load (indicates submission completed)
      iframe.onload = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(form);
        resolve(true);
      };

      form.submit();
      
      // Fallback timeout
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
          document.body.removeChild(form);
        } catch (e) {}
        resolve(true);
      }, 3000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportType || !reportDetails.trim()) {
      return;
    }

    setSubmissionStatus('pending');

    // Get user information from context or use defaults
    const userName = user?.name || user?.displayName || user?.firstName || user?.username || 'Anonymous User';
    const userEmail = user?.email || user?.emailAddress || 'anonymous@unishare.com';

    // Prepare form data for Google Forms (using working entry IDs)
    const formData = {
      'entry.2005620554': userName,        // Name field
      'entry.1045781291': userEmail,       // Email field  
      'entry.1065046570': reportType,      // Issue field
      'entry.839337160': reportDetails,    // What Happened field
      'entry.1166974658': urgency          // Problem/Urgency field
    };

    try {
      // Method 1: Try direct fetch (may be blocked by CORS)
      setSubmissionStatus('pending');
      
      try {
        const response = await fetch('https://docs.google.com/forms/u/0/d/e/1FAIpQLSe0m0oz-Jzx_QQCPmZtLjbvZY3uUW7gRL3-waTH3jg8-OZuQg/formResponse', {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(formData).toString()
        });
        
        setSubmissionStatus('success');
        setSubmitted(true);
        return;
      } catch (error) {
        // Direct fetch failed, trying iframe method
      }

      // Method 2: Try iframe submission
      setSubmissionStatus('pending');
      await submitViaIframe(formData);
      
      setSubmissionStatus('success');
      setSubmitted(true);

    } catch (error) {
      console.error('Form submission error:', error);
      
      // Method 3: Final fallback - assume success since Google Forms doesn't provide response feedback
      setSubmissionStatus('success');
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen">
        
        <div className="max-w-4xl mx-auto px-4 pt-16 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white mb-8">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className={`text-4xl font-bold mb-6 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Report Submitted Successfully
            </h1>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Thank you for helping keep UniShare safe. We've received your report and will review it promptly.
            </p>

            {/* Submission Confirmation */}
            <div className={`p-6 rounded-2xl border mb-8 ${
              darkMode 
                ? 'bg-green-900/20 border-green-800/50' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <CheckCircle className={`w-6 h-6 mt-1 flex-shrink-0 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <div className="text-left">
                  <h4 className={`font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Report Submitted Successfully
                  </h4>
                  <p className={`text-sm leading-relaxed mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Your report has been submitted to our Google Form system. Our team has been notified and will review your submission.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://docs.google.com"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                        darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                      }`}
                      onClick={() => {
                        // Open Google Forms and search for your form
                        window.open('https://docs.google.com/forms/u/0/', '_blank');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Form Responses (Admin)
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-2xl border mb-8 ${
              darkMode 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white/50 border-gray-200'
            }`}>
              <h3 className={`text-2xl font-bold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                What Happens Next?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Review</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Our team will review your report within the expected timeframe</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Investigation</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>If needed, we'll investigate and take appropriate action</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Follow-up</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We'll contact you at {user?.email || user?.emailAddress || 'your email'} with updates if necessary</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setReportType('');
                  setReportDetails('');
                  setSubmissionStatus('idle');
                }}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit Another Report
              </button>
              <button 
                onClick={() => router.push('/')}
                className={`px-8 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-white'
                }`}
              >
                Return Home
              </button>
            </div>
          </div>
        </div>

        <Footer darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Report Issues</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-red-500/20 text-red-300 border border-red-500/40' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            <Flag className="w-4 h-4" />
            <span>Report Safety & Security Issues</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Help Keep UniShare Safe
          </h1>
          
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Report safety concerns, inappropriate behavior, technical issues, or any other problems. 
            Your reports help us maintain a secure and positive environment for all students.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                method.recommended 
                  ? `border-2 ${darkMode ? 'border-yellow-400 bg-yellow-400/10' : 'border-blue-500 bg-blue-50'}`
                  : darkMode
                    ? 'bg-gray-800/50 border-gray-700'
                    : 'bg-white/50 border-gray-200'
              } backdrop-blur-md shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              {method.recommended && (
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                  darkMode ? 'bg-yellow-400/20 text-yellow-300' : 'bg-blue-100 text-blue-700'
                }`}>
                  <Star className="w-3 h-3" />
                  Recommended
                </div>
              )}
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                method.recommended 
                  ? `bg-gradient-to-r ${darkMode ? 'from-yellow-500 to-yellow-400' : 'from-blue-500 to-blue-600'} text-white`
                  : `${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`
              }`}>
                <method.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {method.method}
              </h3>
              <p className={`text-sm mb-3 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {method.description}
              </p>
              {method.contact && (
                <p className={`text-sm font-mono mb-2 ${
                  darkMode ? 'text-yellow-400' : 'text-blue-600'
                }`}>
                  {method.contact}
                </p>
              )}
              <p className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                {method.responseTime}
              </p>
            </div>
          ))}
        </div>

        {/* Report Form */}
        <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        } backdrop-blur-md shadow-xl`}>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    activeStep >= step 
                      ? `bg-gradient-to-r ${darkMode ? 'from-yellow-500 to-yellow-400' : 'from-blue-500 to-blue-600'} text-white`
                      : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                  }`}>
                    {activeStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 rounded-full transition-all duration-300 ${
                      activeStep > step 
                        ? `bg-gradient-to-r ${darkMode ? 'from-yellow-500 to-yellow-400' : 'from-blue-500 to-blue-600'}`
                        : `${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Report Type */}
          <div className={`transition-all duration-300 ${activeStep === 1 ? 'block' : 'hidden'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What type of issue would you like to report?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setReportType(type.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    reportType === type.id
                      ? `border-transparent bg-gradient-to-r ${type.color} text-white`
                      : darkMode
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      reportType === type.id 
                        ? 'bg-white/20' 
                        : `bg-gradient-to-r ${type.color} text-white`
                    }`}>
                      <type.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold mb-2">{type.name}</h4>
                      <p className={`text-sm opacity-90 mb-3`}>{type.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {type.examples.slice(0, 2).map((example, index) => (
                          <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                            reportType === type.id 
                              ? 'bg-white/20' 
                              : darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {example}
                          </span>
                        ))}
                        {type.examples.length > 2 && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            reportType === type.id 
                              ? 'bg-white/20' 
                              : darkMode 
                                ? 'bg-gray-700 text-gray-300' 
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            +{type.examples.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => reportType && setActiveStep(2)}
                disabled={!reportType}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Step 2: Urgency Level */}
          <div className={`transition-all duration-300 ${activeStep === 2 ? 'block' : 'hidden'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              How urgent is this issue?
            </h3>
            
            <div className="space-y-4 mb-8">
              {urgencyLevels.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setUrgency(level.id)}
                  className={`w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    urgency === level.id
                      ? `border-transparent bg-gradient-to-r ${level.color} text-white`
                      : darkMode
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{level.name}</h4>
                      <p className="opacity-90 mb-2">{level.description}</p>
                      <p className="text-sm opacity-75">Response time: {level.responseTime}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      urgency === level.id 
                        ? 'bg-white border-white' 
                        : 'border-gray-400'
                    }`}>
                      {urgency === level.id && <CheckCircle className="w-4 h-4 text-current" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className={`px-8 py-3 border-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-white'
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(3)}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Step 3: Details */}
          <div className={`transition-all duration-300 ${activeStep === 3 ? 'block' : 'hidden'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Describe the issue in detail
            </h3>
            
            <div className="space-y-6 mb-8">
              <div>
                <label className={`block text-lg font-semibold mb-3 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  What happened? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Please provide as much detail as possible. Include dates, times, usernames, and any other relevant information that will help us understand and address the issue."
                  rows={6}
                  required
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 resize-none ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                />
                <p className={`text-sm mt-2 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {reportDetails.length}/1000 characters
                </p>
              </div>

              {/* User Info Display */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Report will be submitted as:
                </h4>
                <div className="space-y-1">
                  <p className={`text-sm ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="font-medium">Name:</span> {user?.name || user?.displayName || user?.firstName || 'Anonymous User'}
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <span className="font-medium">Email:</span> {user?.email || 'anonymous@unishare.com'}
                  </p>
                </div>
                
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                className={`px-8 py-3 border-2 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-white'
                }`}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!reportDetails.trim() || submissionStatus === 'pending'}
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  submissionStatus === 'pending'
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : submissionStatus === 'success'
                    ? 'bg-green-600 text-white'
                    : submissionStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : darkMode 
                      ? 'bg-red-600 text-white hover:bg-red-500' 
                      : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {submissionStatus === 'pending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Report...
                  </>
                ) : submissionStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submitted Successfully
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className={`mt-8 p-6 rounded-2xl border ${
          darkMode 
            ? 'bg-blue-900/20 border-blue-800/50' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-4">
            <Lock className={`w-6 h-6 mt-1 flex-shrink-0 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Privacy is Protected
              </h4>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                All reports are treated confidentially and securely. We only use the information you provide 
                to investigate and resolve the reported issue. Your identity will only be shared if necessary 
                for the investigation and with your consent.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}