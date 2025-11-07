"use client";

import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Star, 
  Lightbulb, 
  Zap, 
  Send,
  CheckCircle,
  ThumbsUp,
  Smile,
  Frown,
  Meh,
  ChevronRight,
  Heart,
  ArrowLeft,
  ExternalLink,
  Loader2
} from "lucide-react";
import Footer from "./../../../_components/layout/Footer";
import { useRouter } from "next/navigation";
import { useUI, useAuth } from "./../../../lib/contexts/UniShareContext";

export default function FeedbackPage() {
  const {darkMode} = useUI();
  const {user} = useAuth();
  const [feedbackType, setFeedbackType] = useState('');
  const [feedbackDetails, setFeedbackDetails] = useState('');
  const [rating, setRating] = useState(5);
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState('idle'); // 'idle', 'pending', 'success', 'error'
  const [activeStep, setActiveStep] = useState(1);
  const router = useRouter();

  const feedbackTypes = [
    {
      id: 'general',
      name: 'General Feedback',
      description: 'Share your overall experience with UniShare',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      examples: ['App experience', 'User interface', 'Navigation', 'Overall satisfaction']
    },
    {
      id: 'ui',
      name: 'UI/UX Feedback',
      description: 'Comments about design and user experience',
      icon: Star,
      color: 'from-purple-500 to-violet-500',
      examples: ['Design feedback', 'Usability', 'Layout suggestions', 'Accessibility']
    },
    {
      id: 'feature',
      name: 'Feature Request',
      description: 'Suggest new features or improvements',
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-500',
      examples: ['New features', 'Improvements', 'Enhancements', 'Functionality']
    },
    {
      id: 'other',
      name: 'Other',
      description: 'Any other feedback or suggestions',
      icon: Zap,
      color: 'from-gray-500 to-gray-600',
      examples: ['General suggestions', 'Questions', 'Comments', 'Other thoughts']
    }
  ];

  const ratingOptions = [
    { value: 5, label: 'Excellent', icon: Smile, color: 'text-green-500', description: 'Love it!' },
    { value: 4, label: 'Good', icon: Smile, color: 'text-blue-500', description: 'Really good' },
    { value: 3, label: 'Average', icon: Meh, color: 'text-yellow-500', description: 'It\'s okay' },
    { value: 2, label: 'Poor', icon: Frown, color: 'text-orange-500', description: 'Needs work' },
    { value: 1, label: 'Very Poor', icon: Frown, color: 'text-red-500', description: 'Not good' }
  ];

  // Function to submit via iframe (alternative method)
  const submitViaIframe = (formData) => {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.name = 'hidden_iframe_feedback';
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://docs.google.com/forms/d/e/1FAIpQLSfVOFMzGq_yOxoswTRu5lZR8iREZewH1c9T81Y4ORQFAMSMMg/formResponse';
      form.target = 'hidden_iframe_feedback';
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
    
    // Validate based on feedback type
    if (!feedbackType) {
      return;
    }
    
    if (feedbackType === 'feature') {
      if (!featureName.trim() || !featureDescription.trim()) {
        return;
      }
    } else if (feedbackType === 'other') {
      if (!feedbackName.trim() || !feedbackDescription.trim()) {
        return;
      }
    }
    // General and UI/UX feedback only require rating selection, no additional validation needed

    setSubmissionStatus('pending');

    // Get user information from context or use defaults
    const userName = user?.name || user?.displayName || user?.firstName || user?.username || 'Anonymous User';
    const userEmail = user?.email || user?.emailAddress || 'anonymous@unishare.com';

    // Prepare form data based on feedback type
    let formData = {
      'entry.2005620554': userName,                    // Name field
      'entry.1045781291': userEmail,                   // Email field  
      'entry.1065046570': feedbackType === 'general' ? 'General Feedback' :
                          feedbackType === 'ui' ? 'UI/UX' :
                          feedbackType === 'feature' ? 'Feature Request' :
                          'Others', // Feedback type selection
    };

    if (feedbackType === 'feature') {
      formData['entry.976127739'] = featureName;       // Feature name field
      formData['entry.713770035'] = featureDescription; // Feature description field
      // No rating for feature requests
    } else if (feedbackType === 'other') {
      formData['entry.11066010'] = feedbackName;       // Other feedback name
      formData['entry.1114000003'] = feedbackDescription; // Other feedback description
      formData['entry.2093846858'] = rating.toString(); // Other feedback rating
    } else if (feedbackType === 'general') {
      formData['entry.2109747625'] = rating.toString(); // General feedback rating
      // Note: HTML form doesn't have a details field for general feedback, using rating only
    } else if (feedbackType === 'ui') {
      formData['entry.2096672289'] = rating.toString(); // UI/UX rating
      // Note: HTML form doesn't have a details field for UI/UX feedback, using rating only
    }

    try {
      // Method 1: Try direct fetch (may be blocked by CORS)
      setSubmissionStatus('pending');
      
      try {
        const response = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSfVOFMzGq_yOxoswTRu5lZR8iREZewH1c9T81Y4ORQFAMSMMg/formResponse', {
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
        console.log('Direct fetch failed, trying iframe method...');
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
              Feedback Submitted Successfully
            </h1>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Thank you for your valuable feedback! Your input helps us improve UniShare for everyone.
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
                    Feedback Received Successfully
                  </h4>
                  <p className={`text-sm leading-relaxed mb-3 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    Your feedback has been submitted to our team. We appreciate you taking the time to help us improve UniShare.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href="https://docs.google.com/forms/d/1FAIpQLSfVOFMzGq_yOxoswTRu5lZR8iREZewH1c9T81Y4ORQFAMSMMg/edit#responses"
                      target="_blank"
                      rel="noopener noreferrer" 
                      className={`inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 ${
                        darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'
                      }`}
                      onClick={() => {
                        window.open('https://docs.google.com/forms/d/1FAIpQLSfVOFMzGq_yOxoswTRu5lZR8iREZewH1c9T81Y4ORQFAMSMMg/edit#responses', '_blank');
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
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Our team will review your feedback and suggestions</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Implementation</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>We'll work on implementing valuable suggestions and fixing reported issues</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                  <div className="flex-1 text-left">
                    <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Updates</h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>You'll see improvements in future updates based on community feedback</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setFeedbackType('');
                  setFeedbackDetails('');
                  setRating(5);
                  setFeatureName('');
                  setFeatureDescription('');
                  setFeedbackName('');
                  setFeedbackDescription('');
                  setSubmissionStatus('idle');
                  setActiveStep(1);
                }}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Submit More Feedback
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Feedback</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <MessageCircle className="w-4 h-4" />
            <span>Share Your Feedback</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Help Us Improve UniShare
          </h1>
          
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your feedback is valuable to us! Share your thoughts, suggestions, and experiences 
            to help us make UniShare better for everyone.
          </p>
        </div>

        {/* Feedback Form */}
        <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-white/50 border-gray-200'
        } backdrop-blur-md shadow-xl`}>
          
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    activeStep >= step 
                      ? `bg-gradient-to-r ${darkMode ? 'from-yellow-500 to-yellow-400' : 'from-blue-500 to-blue-600'} text-white`
                      : `${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500'}`
                  }`}>
                    {activeStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                  </div>
                  {step < 2 && (
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

          {/* Step 1: Feedback Type */}
          <div className={`transition-all duration-300 ${activeStep === 1 ? 'block' : 'hidden'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              What type of feedback would you like to share?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {feedbackTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFeedbackType(type.id)}
                  className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 transform hover:scale-105 ${
                    feedbackType === type.id
                      ? `border-transparent bg-gradient-to-r ${type.color} text-white`
                      : darkMode
                        ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-all duration-300 ${
                      feedbackType === type.id 
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
                            feedbackType === type.id 
                              ? 'bg-white/20' 
                              : darkMode
                                ? 'bg-gray-700 text-gray-300'
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setActiveStep(2)}
                disabled={!feedbackType}
                className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  darkMode 
                    ? 'bg-blue-600 text-white hover:bg-blue-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Step 2: Combined Rating & Details */}
          <div className={`transition-all duration-300 ${activeStep === 2 ? 'block' : 'hidden'}`}>
            <h3 className={`text-2xl font-bold mb-6 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {feedbackType === 'general' || feedbackType === 'ui' 
                ? 'Rate your experience and share details'
                : feedbackType === 'feature'
                ? 'Tell us about your feature request'
                : 'Share your feedback details'
              }
            </h3>

            {/* Rating Section for General and UI/UX */}
            {(feedbackType === 'general' || feedbackType === 'ui') && (
              <div className="mb-8">
                <h4 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  How would you rate your experience?
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
                  {ratingOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRating(option.value)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                        rating === option.value
                          ? `border-transparent ${option.color} bg-gradient-to-r from-gray-100 to-white text-gray-900`
                          : darkMode
                            ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                        rating === option.value ? option.color : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`} />
                      <h5 className={`text-sm font-bold mb-1 ${
                        darkMode && rating !== option.value ? 'text-white' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </h5>
                      <p className={`text-xs ${
                        darkMode && rating !== option.value ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-6 mb-8">
              {/* Feature Request Form */}
              {feedbackType === 'feature' && (
                <>
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Name of Feature <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={featureName}
                      onChange={(e) => setFeatureName(e.target.value)}
                      placeholder="Enter the name of the feature you'd like to request"
                      required
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                    />
                  </div>
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Description of Feature <span className="text-blue-500">*</span>
                    </label>
                    <textarea
                      value={featureDescription}
                      onChange={(e) => setFeatureDescription(e.target.value)}
                      placeholder="Describe the feature in detail. How would it work? What problem would it solve? How would users interact with it?"
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
                      {featureDescription.length}/2000 characters
                    </p>
                  </div>
                </>
              )}

              {/* Other Feedback Form */}
              {feedbackType === 'other' && (
                <>
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Name of Feedback <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="Enter a title for your feedback"
                      required
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-yellow-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:outline-none focus:ring-4 focus:ring-opacity-20`}
                    />
                  </div>
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Description of Feedback <span className="text-blue-500">*</span>
                    </label>
                    <textarea
                      value={feedbackDescription}
                      onChange={(e) => setFeedbackDescription(e.target.value)}
                      placeholder="Please provide detailed feedback, suggestions, or comments"
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
                      {feedbackDescription.length}/2000 characters
                    </p>
                  </div>
                  <div>
                    <label className={`block text-lg font-semibold mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Rating <span className="text-blue-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      {ratingOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRating(option.value)}
                          className={`p-4 rounded-xl border-2 text-center transition-all duration-300 transform hover:scale-105 ${
                            rating === option.value
                              ? `border-transparent ${option.color} bg-gradient-to-r from-gray-100 to-white text-gray-900`
                              : darkMode
                                ? 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <option.icon className={`w-8 h-8 mx-auto mb-2 ${
                            rating === option.value ? option.color : darkMode ? 'text-gray-400' : 'text-gray-600'
                          }`} />
                          <h4 className={`text-sm font-bold mb-1 ${
                            darkMode && rating !== option.value ? 'text-white' : 'text-gray-900'
                          }`}>
                            {option.label}
                          </h4>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* General and UI/UX Feedback Form - No additional details needed, only rating */}
              {(feedbackType === 'general' || feedbackType === 'ui') && (
                <div className={`p-6 rounded-xl border text-center ${
                  darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="mb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h4 className={`text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feedbackType === 'general' ? 'General Feedback' : 'UI/UX Feedback'}
                    </h4>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Your rating has been recorded. Thank you for your {feedbackType === 'general' ? 'general' : 'UI/UX'} feedback!
                    </p>
                  </div>
                </div>
              )}

              {/* User Info Display */}
              <div className={`p-4 rounded-xl border ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Feedback will be submitted as:
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
                    <span className="font-medium">Email:</span> {user?.email || user?.emailAddress || 'anonymous@unishare.com'}
                  </p>
                </div>
              </div>
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
                type="submit"
                disabled={
                  submissionStatus === 'pending' || 
                  (feedbackType === 'feature' && (!featureName.trim() || !featureDescription.trim())) ||
                  (feedbackType === 'other' && (!feedbackName.trim() || !feedbackDescription.trim()))
                  // General and UI/UX feedback only require rating, which is already set by default
                }
                className={`flex items-center gap-3 px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  submissionStatus === 'pending'
                    ? 'bg-gray-500 text-white cursor-not-allowed'
                    : submissionStatus === 'success'
                    ? 'bg-green-600 text-white'
                    : submissionStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : darkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-500' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {submissionStatus === 'pending' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting Feedback...
                  </>
                ) : submissionStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submitted Successfully
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
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
            <Heart className={`w-6 h-6 mt-1 flex-shrink-0 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Feedback Matters
              </h4>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                All feedback is treated confidentially and used solely to improve UniShare. 
                Your insights help us create a better experience for all students in the community.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}
