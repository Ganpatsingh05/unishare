"use client";

import { useState, useEffect } from 'react';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Book, 
  Video, 
  ChevronRight, 
  ChevronDown,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import Header from '../../_components/Header';
// import Header from '../_components/Header';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';

export default function HelpCenter() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const router = useRouter();

  const categories = [
    { id: 'all', name: 'All Topics', icon: Book, color: 'from-blue-500 to-cyan-500' },
    { id: 'getting-started', name: 'Getting Started', icon: HelpCircle, color: 'from-green-500 to-emerald-500' },
    { id: 'rides', name: 'Rides & Transport', icon: MessageCircle, color: 'from-purple-500 to-violet-500' },
    { id: 'marketplace', name: 'Marketplace', icon: Video, color: 'from-orange-500 to-red-500' },
    { id: 'housing', name: 'Housing & Roommates', icon: CheckCircle, color: 'from-indigo-500 to-blue-500' },
    { id: 'account', name: 'Account & Settings', icon: AlertCircle, color: 'from-pink-500 to-rose-500' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I sign up for UniShare?',
      answer: 'Simply use your university email address to create an account. We\'ll verify your student status automatically. The whole process takes less than 2 minutes!',
      popularity: 95,
      helpful: 128,
      notHelpful: 12
    },
    {
      id: 2,
      category: 'rides',
      question: 'How does ride sharing work?',
      answer: 'Post where you\'re going or browse existing ride offers. Connect with other students, split costs, and travel safely together. All riders are verified university students.',
      popularity: 88,
      helpful: 95,
      notHelpful: 8
    },
    {
      id: 3,
      category: 'marketplace',
      question: 'Is it safe to buy/sell items on UniShare?',
      answer: 'Yes! All users are verified students. We recommend meeting in public campus locations, using secure payment methods, and trusting your instincts. Report any suspicious activity.',
      popularity: 92,
      helpful: 156,
      notHelpful: 23
    },
    {
      id: 4,
      category: 'housing',
      question: 'How do I find roommates?',
      answer: 'Use our roommate matching system! Fill out your preferences, lifestyle, and study habits. Our algorithm will suggest compatible matches from your university.',
      popularity: 85,
      helpful: 74,
      notHelpful: 6
    },
    {
      id: 5,
      category: 'account',
      question: 'Can I change my university after signing up?',
      answer: 'Unfortunately, you cannot change your university once verified. This ensures community integrity. If you transfer schools, you\'ll need to create a new account with your new university email.',
      popularity: 67,
      helpful: 45,
      notHelpful: 18
    },
    {
      id: 6,
      category: 'getting-started',
      question: 'What makes UniShare different from other platforms?',
      answer: 'UniShare is exclusively for university students, creating a trusted community. We focus on student-specific needs: rides, textbooks, housing, and study resources - all in one platform.',
      popularity: 78,
      helpful: 89,
      notHelpful: 11
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get personalized help from our team',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      action: () => router.push('/contact')
    },
    {
      title: 'Video Tutorials',
      description: 'Learn with step-by-step guides',
      icon: Video,
      color: 'from-purple-500 to-violet-500',
      action: () => window.open('https://youtube.com/unishare', '_blank')
    },
    {
      title: 'Community Forum',
      description: 'Ask questions to other students',
      icon: MessageCircle,
      color: 'from-green-500 to-emerald-500',
      action: () => router.push('/community')
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => b.popularity - a.popularity);

  const handleVote = (faqId, type) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: type
    }));
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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Help Center</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-yellow-300/20 text-yellow-300 border border-yellow-300/40' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <HelpCircle className="w-4 h-4" />
            <span>Help & Support Center</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            How can we help you today?
          </h1>
          
          <p className={`text-xl mb-8 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find answers to common questions, get support, or learn how to make the most of UniShare
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-12">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search for help articles, guides, or common questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:ring-yellow-400/20 focus:border-yellow-400' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/20 focus:border-blue-500'
              } shadow-xl hover:shadow-2xl`}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`group p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 ${
                darkMode
                  ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80 hover:border-gray-600'
                  : 'bg-white/50 border-gray-200 hover:bg-white/80 hover:border-gray-300'
              } backdrop-blur-md shadow-xl hover:shadow-2xl`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {action.title}
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {action.description}
              </p>
              <ChevronRight className={`w-5 h-5 mt-3 transition-transform duration-300 group-hover:translate-x-1 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </button>
          ))}
        </div>

        {/* Categories Filter */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Browse by Category
          </h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : darkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Frequently Asked Questions
            </h2>
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {filteredFAQs.length} articles found
            </span>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                } backdrop-blur-md shadow-lg hover:shadow-xl`}
              >
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {faq.question}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className={`w-4 h-4 ${
                            darkMode ? 'text-yellow-400' : 'text-yellow-500'
                          }`} />
                          <span className={`${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {faq.popularity}% helpful
                          </span>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {categories.find(c => c.id === faq.category)?.name}
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  </div>
                </button>

                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6">
                    <div className={`text-base leading-relaxed mb-6 ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {faq.answer}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200/20">
                      <div className="flex items-center gap-4">
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Was this helpful?
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVote(faq.id, 'helpful')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                              helpfulVotes[faq.id] === 'helpful'
                                ? 'bg-green-500/20 text-green-400'
                                : darkMode
                                  ? 'text-gray-400 hover:text-green-400'
                                  : 'text-gray-500 hover:text-green-600'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{faq.helpful}</span>
                          </button>
                          <button
                            onClick={() => handleVote(faq.id, 'notHelpful')}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                              helpfulVotes[faq.id] === 'notHelpful'
                                ? 'bg-red-500/20 text-red-400'
                                : darkMode
                                  ? 'text-gray-400 hover:text-red-400'
                                  : 'text-gray-500 hover:text-red-600'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>{faq.notHelpful}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No results found</h3>
              <p>Try adjusting your search or browse different categories</p>
            </div>
          )}
        </div>

        {/* Contact Support Section */}
        <div className={`mt-16 p-8 rounded-2xl text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Still need help?
          </h3>
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Our support team is here to help you with any questions or issues
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}>
              Contact Support
            </button>
            <button className={`px-8 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                : 'border-gray-300 text-gray-700 hover:bg-white'
            }`}>
              Join Community
            </button>
          </div>
        </div>
      </div>

      <Footer darkMode={darkMode} />
    </div>
  );
}