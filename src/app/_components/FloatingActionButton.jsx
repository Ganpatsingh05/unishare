import { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, X, ChevronUp, Mail, Phone } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FloatingActionButton = ({ darkMode }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // FAQ data
  const faqs = [
    {
      question: "How to create my account?",
      answer: "Simply sign up with your email address. We'll send a verification link that you need to click within 24 hours , and there you go!"
    },
    {
      question: "Is UniShare really free to use?",
      answer: "Absolutely! UniShare is completely free for students. We believe education resources should be accessible to everyone."
    },
    {
      question: "How do I report inappropriate content or users?",
      answer: "Click the three dots on any post or profile and select 'Report'. Our team reviews all reports within 24 hours and takes appropriate action."
    },
    {
      question: "Can I delete my account anytime?",
      answer: "Yes, you can delete your account anytime from Settings > Account > Delete Account. All your data will be permanently removed within 30 days."
    },
    {
      question: "How do payments work for rides and items?",
      answer: "We don't handle payments directly. Users arrange payment methods themselves - cash, Venmo, PayPal, etc. Always meet in safe, public places."
    },
    {
      question: "What if someone doesn't show up or flakes?",
      answer: "You can rate users after each interaction. Users with low ratings will be flagged in the system. For serious issues, use our report feature."
    }
  ];

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Hide when near the bottom to avoid overlapping with footer
      const nearBottom = scrollY + windowHeight > documentHeight - 200;
      setIsVisible(!nearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modals when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowFAQ(false);
      setShowFeedback(false);
    }
  };

  const FAQModal = () => (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className={`w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b flex items-center justify-between ${
          darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Frequently Asked Questions
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get quick answers to common questions
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFAQ(false)}
            className={`p-2 rounded-full transition-colors ${
              darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="p-6 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className={`p-4 rounded-xl border transition-colors ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800/50 hover:bg-gray-800' 
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}>
                <h4 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h4>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Still have questions? 
              <button 
                onClick={() => {
                  setShowFAQ(false);
                  setShowFeedback(true);
                }}
                className="ml-1 text-blue-500 hover:text-blue-600 font-medium"
              >
                Send us feedback
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const FeedbackModal = () => {
    const [formData, setFormData] = useState({
      type: 'feedback',
      subject: '',
      message: '',
      email: ''
    });

    const handleSubmit = () => {
      // Validate required fields
      if (!formData.subject.trim() || !formData.message.trim()) {
        alert('Please fill in both subject and message fields.');
        return;
      }
      
      // Here you would typically send the feedback to your backend
      console.log('Feedback submitted:', formData);
      alert('Thank you for your feedback! We\'ll get back to you soon.');
      setShowFeedback(false);
      setFormData({ type: 'feedback', subject: '', message: '', email: '' });
    };

    return (
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
          darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Send Feedback
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  We'd love to hear from you
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFeedback(false)}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Type Selection */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                <option value="feedback">General Feedback</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="support">Support</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Subject
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Brief description of your feedback"
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Tell us more about your feedback, suggestion, or issue..."
                rows={4}
                className={`w-full px-3 py-2 rounded-lg border transition-colors resize-none ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email (optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your.email@university.edu"
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                Send Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Main FAB */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        {/* Action buttons (shown when expanded) */}
        <div className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          {/* FAQ Button */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-900/90 border-gray-700 text-gray-300' 
                : 'bg-white/90 border-gray-200 text-gray-700'
            }`}>
              <span className="text-sm font-medium whitespace-nowrap">FAQs</span>
            </div>
              <button
              onClick={() => router.push('/footerpages/faqs')}
              className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <HelpCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Feedback Button */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm border transition-all duration-200 ${
              darkMode 
                ? 'bg-gray-900/90 border-gray-700 text-gray-300' 
                : 'bg-white/90 border-gray-200 text-gray-700'
            }`}>
              <span className="text-sm font-medium whitespace-nowrap">Feedback</span>
            </div>
            <button
              onClick={() => router.push('/footerpages/help')}
              className={`w-12 h-12 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 flex items-center justify-center ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main FAB Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
            isOpen 
              ? darkMode 
                ? 'bg-red-600 hover:bg-red-700 rotate-45' 
                : 'bg-red-500 hover:bg-red-600 rotate-45'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
          } text-white`}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Modals */}
      {showFAQ && <FAQModal />}
      {showFeedback && <FeedbackModal />}
    </>
  );
};

export default FloatingActionButton;