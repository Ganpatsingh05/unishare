"use client";

import { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronRight,
  ArrowLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Book,
  Users,
  Car,
  ShoppingBag,
  Home,
  Shield,
  Settings,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  RotateCw
} from 'lucide-react';
import Header from '../../_components/Header';
import Footer from '../../_components/Footer';
import { useRouter } from 'next/navigation';

export default function FAQs() {
  const [darkMode, setDarkMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});
  const [sortBy, setSortBy] = useState('popular');
  const router = useRouter();

  const categories = [
    { 
      id: 'all', 
      name: 'All FAQs', 
      icon: Book, 
      color: 'from-blue-500 to-cyan-500',
      count: 24
    },
    { 
      id: 'getting-started', 
      name: 'Getting Started', 
      icon: HelpCircle, 
      color: 'from-green-500 to-emerald-500',
      count: 8
    },
    { 
      id: 'rides', 
      name: 'Rides & Transport', 
      icon: Car, 
      color: 'from-purple-500 to-violet-500',
      count: 6
    },
    { 
      id: 'marketplace', 
      name: 'Marketplace', 
      icon: ShoppingBag, 
      color: 'from-orange-500 to-red-500',
      count: 5
    },
    { 
      id: 'housing', 
      name: 'Housing', 
      icon: Home, 
      color: 'from-indigo-500 to-blue-500',
      count: 3
    },
    { 
      id: 'safety', 
      name: 'Safety', 
      icon: Shield, 
      color: 'from-red-500 to-rose-500',
      count: 4
    },
    { 
      id: 'account', 
      name: 'Account & Settings', 
      icon: Settings, 
      color: 'from-pink-500 to-rose-500',
      count: 6
    },
    { 
      id: 'technical', 
      name: 'Technical', 
      icon: Zap, 
      color: 'from-yellow-500 to-orange-500',
      count: 4
    }
  ];

  const faqs = [
    // Getting Started
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I sign up for UniShare?',
      answer: 'Creating your UniShare account is super easy! Just visit our homepage and click "Sign Up". You\'ll need your university email address - we use this to verify you\'re actually a student. Once you verify your email (check your inbox!), you can complete your profile and start exploring everything UniShare has to offer. The whole process takes less than 5 minutes!',
      tags: ['signup', 'registration', 'email', 'verification'],
      popularity: 98,
      helpful: 245,
      notHelpful: 12,
      lastUpdated: '2024-01-15',
      featured: true
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'What universities are supported?',
      answer: 'We\'re currently available at over 200+ universities across the US, Canada, and UK! We\'re constantly adding new schools based on student demand. If your university isn\'t listed yet, you can request it through our "Request University" form, and we\'ll prioritize adding it. We typically add 5-10 new universities each month.',
      tags: ['universities', 'schools', 'availability', 'expansion'],
      popularity: 87,
      helpful: 156,
      notHelpful: 18,
      lastUpdated: '2024-01-20'
    },
    {
      id: 3,
      category: 'getting-started',
      question: 'Is UniShare really free to use?',
      answer: 'Yes, absolutely! UniShare is completely free for all students. We believe in making campus life easier without adding financial stress. We don\'t charge listing fees, transaction fees, or subscription costs. Our platform is supported through partnerships and optional premium features that enhance your experience but aren\'t required.',
      tags: ['free', 'cost', 'pricing', 'premium'],
      popularity: 94,
      helpful: 203,
      notHelpful: 9,
      lastUpdated: '2024-01-10',
      featured: true
    },

    // Rides & Transport
    {
      id: 4,
      category: 'rides',
      question: 'How does ride sharing work on UniShare?',
      answer: 'Ride sharing is one of our most popular features! You can either post a ride you\'re offering or search for rides others have posted. Simply enter your destination, date, and time preferences. The system will show you compatible matches. You can message the driver/passengers directly through our platform to coordinate pickup details and split costs. All users are verified students from your university!',
      tags: ['rideshare', 'transportation', 'carpooling', 'travel'],
      popularity: 91,
      helpful: 189,
      notHelpful: 15,
      lastUpdated: '2024-01-18'
    },
    {
      id: 5,
      category: 'rides',
      question: 'How do I split ride costs fairly?',
      answer: 'Great question! We recommend splitting costs based on distance and gas prices. Our ride calculator suggests fair splits automatically based on current gas prices and the total distance. Most students split costs evenly among all passengers, but you can also factor in pickup/drop-off convenience. Always agree on the cost split before the trip!',
      tags: ['cost-splitting', 'payment', 'fair-share', 'calculator'],
      popularity: 78,
      helpful: 134,
      notHelpful: 22,
      lastUpdated: '2024-01-12'
    },

    // Marketplace
    {
      id: 6,
      category: 'marketplace',
      question: 'What can I buy and sell on UniShare?',
      answer: 'You can buy and sell almost anything students need! Popular items include textbooks, furniture, electronics, bikes, dorm decor, kitchen supplies, and even event tickets. We don\'t allow illegal items, weapons, or anything that violates university policies. Check our community guidelines for the complete list. Most transactions happen within 24-48 hours!',
      tags: ['marketplace', 'buying', 'selling', 'items', 'textbooks'],
      popularity: 85,
      helpful: 167,
      notHelpful: 19,
      lastUpdated: '2024-01-16'
    },
    {
      id: 7,
      category: 'marketplace',
      question: 'How do I ensure safe transactions?',
      answer: 'Safety first! Always meet in public campus locations like the library, student center, or cafeteria. Inspect items thoroughly before paying. Use secure payment methods like Venmo, PayPal, or cash (bring exact change). Trust your instincts - if something feels off, don\'t proceed. Report any suspicious behavior immediately. Most importantly, all users are verified students, which adds an extra layer of security.',
      tags: ['safety', 'transactions', 'security', 'payment', 'meeting'],
      popularity: 89,
      helpful: 201,
      notHelpful: 13,
      lastUpdated: '2024-01-14',
      featured: true
    },

    // Housing
    {
      id: 8,
      category: 'housing',
      question: 'How does roommate matching work?',
      answer: 'Our roommate matching system is like a dating app for finding your perfect living companion! Fill out our comprehensive questionnaire about your lifestyle, study habits, cleanliness preferences, sleep schedule, and social preferences. Our algorithm matches you with compatible students. You can browse profiles, message potential roommates, and even do video calls before deciding. We have a 94% compatibility success rate!',
      tags: ['roommates', 'housing', 'matching', 'compatibility', 'algorithm'],
      popularity: 82,
      helpful: 143,
      notHelpful: 25,
      lastUpdated: '2024-01-19'
    },
    {
      id: 9,
      category: 'housing',
      question: 'Can I find housing off-campus?',
      answer: 'Absolutely! We have listings for both on-campus and off-campus housing. Many students use UniShare to find apartments, houses, and shared living spaces near campus. You can filter by distance from campus, price range, amenities, and more. We also have a feature to connect with other students looking for the same area to increase your chances of finding great housing.',
      tags: ['off-campus', 'apartments', 'housing', 'listings', 'filters'],
      popularity: 76,
      helpful: 98,
      notHelpful: 17,
      lastUpdated: '2024-01-11'
    },

    // Safety
    {
      id: 10,
      category: 'safety',
      question: 'How does UniShare verify students?',
      answer: 'Student verification is a multi-step process that ensures community safety. First, you must sign up with your official university email address (.edu). We then verify your student status through our partnership with universities and third-party verification services. Some users may need to provide additional documentation like student ID or enrollment verification. This process typically takes 24-48 hours.',
      tags: ['verification', 'safety', 'student-id', 'security', 'authentication'],
      popularity: 93,
      helpful: 187,
      notHelpful: 11,
      lastUpdated: '2024-01-13',
      featured: true
    },
    {
      id: 11,
      category: 'safety',
      question: 'What should I do if I encounter inappropriate behavior?',
      answer: 'Your safety is our top priority! If you encounter harassment, inappropriate messages, or any behavior that makes you uncomfortable, report it immediately through our in-app reporting system. Take screenshots if possible. We have a zero-tolerance policy for harassment and typically respond to safety reports within 2 hours. You can also block users instantly and contact campus security if needed.',
      tags: ['reporting', 'harassment', 'inappropriate-behavior', 'blocking', 'safety'],
      popularity: 86,
      helpful: 154,
      notHelpful: 16,
      lastUpdated: '2024-01-17'
    },

    // Account & Settings
    {
      id: 12,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Keeping your profile updated is easy! Go to Settings > Profile from the main menu. You can update your photo, bio, interests, contact preferences, and privacy settings. Some information like your university email cannot be changed for security reasons. If you need to update your university (like if you transfer), you\'ll need to contact support for manual verification.',
      tags: ['profile', 'settings', 'update', 'information', 'privacy'],
      popularity: 71,
      helpful: 89,
      notHelpful: 12,
      lastUpdated: '2024-01-09'
    },
    {
      id: 13,
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account anytime from Settings > Account > Delete Account. This will permanently remove all your data, listings, and messages. Consider deactivating your account first if you just want a break - this hides your profile but keeps your data safe for when you return. Account deletion cannot be undone, so make sure you really want to leave us!',
      tags: ['delete-account', 'deactivate', 'data-removal', 'permanent'],
      popularity: 65,
      helpful: 76,
      notHelpful: 8,
      lastUpdated: '2024-01-08'
    },

    // Technical
    {
      id: 14,
      category: 'technical',
      question: 'Why is the app running slowly?',
      answer: 'Several factors can affect app performance. First, check your internet connection - UniShare works best with stable WiFi or good cellular data. Clear your app cache (Settings > Storage > Clear Cache) and make sure you have the latest version from your app store. If you\'re still experiencing issues, try restarting your phone. Our servers are optimized for peak usage during college hours.',
      tags: ['performance', 'slow', 'troubleshooting', 'cache', 'connection'],
      popularity: 73,
      helpful: 92,
      notHelpful: 15,
      lastUpdated: '2024-01-21'
    },
    {
      id: 15,
      category: 'technical',
      question: 'I\'m not receiving notifications. How do I fix this?',
      answer: 'Notification issues are usually easy to fix! First, check your phone\'s notification settings for UniShare - make sure notifications are enabled. In the app, go to Settings > Notifications and verify your preferences are set correctly. Also check if "Do Not Disturb" mode is affecting your notifications. For urgent safety notifications, we recommend enabling all notification types.',
      tags: ['notifications', 'alerts', 'settings', 'push-notifications', 'troubleshooting'],
      popularity: 79,
      helpful: 108,
      notHelpful: 19,
      lastUpdated: '2024-01-19'
    },

    // More Getting Started
    {
      id: 16,
      category: 'getting-started',
      question: 'How do I make my first post?',
      answer: 'Making your first post is exciting! Tap the "+" button (usually at the bottom center of your screen). Choose what you want to post - a ride offer, item for sale, housing listing, etc. Fill in all the details, add clear photos if applicable, set your price or terms, and hit "Post"! Pro tip: posts with good photos and detailed descriptions get 3x more responses.',
      tags: ['first-post', 'posting', 'listing', 'photos', 'descriptions'],
      popularity: 88,
      helpful: 145,
      notHelpful: 11,
      lastUpdated: '2024-01-16'
    },
    {
      id: 17,
      category: 'getting-started',
      question: 'What makes a good profile?',
      answer: 'A great profile builds trust and gets better responses! Use a clear, friendly profile photo (not a group photo or meme). Write a genuine bio that mentions your major, year, and interests. Set your communication preferences clearly. Keep your profile updated and respond to messages promptly. Profiles with photos get 5x more messages than blank profiles!',
      tags: ['profile-tips', 'photos', 'bio', 'trust', 'communication'],
      popularity: 84,
      helpful: 127,
      notHelpful: 14,
      lastUpdated: '2024-01-12'
    },

    // More Marketplace
    {
      id: 18,
      category: 'marketplace',
      question: 'How do I price my items fairly?',
      answer: 'Pricing can be tricky! Research similar items on UniShare and other platforms to get a baseline. Consider the item\'s condition, age, and original price. Popular items like textbooks can hold value well, while electronics depreciate faster. Our built-in price suggestion tool analyzes recent sales to recommend competitive prices. Remember, you can always negotiate!',
      tags: ['pricing', 'fair-price', 'valuation', 'negotiation', 'price-tool'],
      popularity: 77,
      helpful: 98,
      notHelpful: 21,
      lastUpdated: '2024-01-15'
    },
    {
      id: 19,
      category: 'marketplace',
      question: 'What if a buyer doesn\'t show up?',
      answer: 'No-shows are frustrating but happen sometimes! Always confirm meeting details a few hours beforehand. If someone doesn\'t show, wait 15-20 minutes then message them. People get busy or forget, so be understanding. If it becomes a pattern, you can leave feedback on their profile. Most students are reliable - don\'t let one bad experience discourage you!',
      tags: ['no-show', 'buyers', 'reliability', 'confirmation', 'feedback'],
      popularity: 69,
      helpful: 87,
      notHelpful: 16,
      lastUpdated: '2024-01-13'
    },

    // More Safety
    {
      id: 20,
      category: 'safety',
      question: 'Are all users really verified students?',
      answer: 'Yes! Every single user must verify their student status with an active university email address. We also use additional verification methods including student ID verification and enrollment confirmation through university partnerships. Fake accounts are extremely rare and quickly removed. The verification badge on profiles shows confirmed student status.',
      tags: ['verification', 'student-status', 'fake-accounts', 'verification-badge', 'security'],
      popularity: 90,
      helpful: 176,
      notHelpful: 9,
      lastUpdated: '2024-01-18',
      featured: true
    },
    {
      id: 21,
      category: 'safety',
      question: 'How do I report suspicious activity?',
      answer: 'Reporting suspicious activity helps keep everyone safe! You can report users, posts, or messages directly through the app. Tap the three dots (...) on any profile or post, select "Report," and choose the appropriate category. For urgent safety concerns, use our emergency report feature or contact campus security immediately. We review all reports within 2 hours.',
      tags: ['reporting', 'suspicious-activity', 'emergency', 'safety', 'review-process'],
      popularity: 83,
      helpful: 142,
      notHelpful: 12,
      lastUpdated: '2024-01-17'
    },

    // More Rides
    {
      id: 22,
      category: 'rides',
      question: 'What if plans change and I can\'t take a ride?',
      answer: 'Plans change - we get it! Always message the driver/passengers as soon as possible if you can\'t make it. Most students are understanding about genuine emergencies or scheduling conflicts. Repeatedly canceling last minute can affect your reliability rating, so try to be certain about your plans before committing to rides.',
      tags: ['cancellation', 'plans-change', 'reliability', 'communication', 'rating'],
      popularity: 74,
      helpful: 96,
      notHelpful: 18,
      lastUpdated: '2024-01-14'
    },
    {
      id: 23,
      category: 'rides',
      question: 'Can I bring extra luggage on rides?',
      answer: 'Always ask first! Different cars have different space limitations. When booking or offering rides, mention any large bags, sports equipment, or extra items. Most drivers are accommodating if you ask politely and it doesn\'t overcrowd the car. Consider offering to pay a bit extra for large items that take up passenger space.',
      tags: ['luggage', 'extra-items', 'space', 'communication', 'courtesy'],
      popularity: 68,
      helpful: 79,
      notHelpful: 13,
      lastUpdated: '2024-01-11'
    },

    // More Technical
    {
      id: 24,
      category: 'technical',
      question: 'How do I update the app?',
      answer: 'Keeping your app updated ensures you have the latest features and security improvements! For iOS: Open the App Store, tap your profile icon, scroll down to see pending updates, and tap "Update" next to UniShare. For Android: Open Google Play Store, tap Menu > My apps & games, find UniShare in the list, and tap "Update". Enable automatic updates to never miss important improvements!',
      tags: ['app-update', 'ios', 'android', 'app-store', 'google-play', 'automatic-updates'],
      popularity: 70,
      helpful: 88,
      notHelpful: 14,
      lastUpdated: '2024-01-20'
    }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular', icon: TrendingUp },
    { id: 'helpful', name: 'Most Helpful', icon: ThumbsUp },
    { id: 'recent', name: 'Recently Updated', icon: Clock },
    { id: 'featured', name: 'Featured', icon: Star }
  ];

  const filteredAndSortedFAQs = () => {
    let filtered = faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });

    // Sort based on selected option
    switch(sortBy) {
      case 'helpful':
        return filtered.sort((a, b) => b.helpful - a.helpful);
      case 'recent':
        return filtered.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
      case 'featured':
        return filtered.sort((a, b) => (b.featured || false) - (a.featured || false));
      default: // popular
        return filtered.sort((a, b) => b.popularity - a.popularity);
    }
  };

  const handleVote = (faqId, type) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: type
    }));
    // In a real app, you'd send this to your backend
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const popularQuestions = faqs
    .filter(faq => faq.featured)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4);

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
          <span className={darkMode ? 'text-yellow-300' : 'text-blue-600'}>Frequently Asked Questions</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 transition-all duration-300 ${
            darkMode 
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Got Questions? We've Got Answers!
          </h1>
          
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find quick answers to the most common questions about UniShare. 
            Can't find what you're looking for? Our support team is always happy to help!
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search FAQs, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:scale-105 ${
                darkMode 
                  ? 'bg-gray-800/80 border-gray-700 text-white placeholder-gray-400 focus:ring-yellow-400/20 focus:border-yellow-400' 
                  : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/20 focus:border-blue-500'
              } shadow-xl hover:shadow-2xl`}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: 'Total FAQs', value: faqs.length, icon: Book },
              { label: 'Avg. Helpfulness', value: '94%', icon: ThumbsUp },
              { label: 'Response Time', value: '<2hrs', icon: Clock }
            ].map((stat, index) => (
              <div key={index} className={`p-4 rounded-xl border transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/50 border-gray-700' 
                  : 'bg-white/50 border-gray-200'
              }`}>
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className={`text-2xl font-bold ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
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

        {/* Popular Questions (Featured) */}
        {searchTerm === '' && selectedCategory === 'all' && (
          <div className="mb-16">
            <h2 className={`text-2xl font-bold mb-8 text-center ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Most Popular Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {popularQuestions.map((faq) => (
                <div
                  key={faq.id}
                  className={`group p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 ${
                    darkMode
                      ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-yellow-500/30 hover:border-yellow-400/60'
                      : 'bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200 hover:border-blue-400'
                  } backdrop-blur-md shadow-lg hover:shadow-xl`}
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-yellow-400/20 text-yellow-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      <Star className="w-3 h-3" />
                      Popular
                    </div>
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {faq.popularity}% helpful
                    </div>
                  </div>
                  <h3 className={`text-lg font-bold mb-3 group-hover:text-opacity-80 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {faq.question}
                  </h3>
                  <p className={`text-sm leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {faq.answer.length > 120 ? `${faq.answer.substring(0, 120)}...` : faq.answer}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* Categories Filter */}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Browse by Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <category.icon className="w-4 h-4" />
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedCategory === category.id 
                      ? 'bg-white/20' 
                      : darkMode 
                        ? 'bg-gray-700' 
                        : 'bg-gray-200'
                  }`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Sort by
            </h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                    sortBy === option.id
                      ? darkMode
                        ? 'bg-yellow-400 text-gray-900'
                        : 'bg-blue-600 text-white'
                      : darkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {selectedCategory === 'all' ? 'All Questions' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {filteredAndSortedFAQs().length} questions found
            </span>
          </div>

          <div className="space-y-4">
            {filteredAndSortedFAQs().map((faq) => (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 ${
                  darkMode
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80'
                    : 'bg-white/50 border-gray-200 hover:bg-white/80'
                } backdrop-blur-md shadow-lg hover:shadow-xl`}
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-6 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {faq.featured && (
                          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode ? 'bg-yellow-400/20 text-yellow-300' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <Star className="w-3 h-3" />
                            Featured
                          </div>
                        )}
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {categories.find(c => c.id === faq.category)?.name}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          Updated {new Date(faq.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold mb-2 ${
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
                        <div className="flex flex-wrap gap-1">
                          {faq.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className={`text-xs px-2 py-0.5 rounded-full ${
                              darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                              #{tag}
                            </span>
                          ))}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(faq.id, 'helpful');
                            }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              helpfulVotes[faq.id] === 'helpful'
                                ? 'bg-green-500/20 text-green-400 transform scale-105'
                                : darkMode
                                  ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                                  : 'text-gray-500 hover:text-green-600 hover:bg-green-100'
                            }`}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            <span>{faq.helpful}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVote(faq.id, 'notHelpful');
                            }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all duration-200 ${
                              helpfulVotes[faq.id] === 'notHelpful'
                                ? 'bg-red-500/20 text-red-400 transform scale-105'
                                : darkMode
                                  ? 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                                  : 'text-gray-500 hover:text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            <span>{faq.notHelpful}</span>
                          </button>
                        </div>
                      </div>
                      <button
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                          darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600'
                        }`}
                        onClick={() => router.push('/help')}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Need more help?
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredAndSortedFAQs().length === 0 && (
            <div className={`text-center py-16 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No questions found</h3>
              <p className="mb-6">Try adjusting your search terms or browse different categories</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <RotateCw className="w-4 h-4" />
                  Clear Filters
                </button>
                <button
                  onClick={() => router.push('/help')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    darkMode 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className={`mt-16 p-8 rounded-2xl text-center ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <MessageCircle className={`w-16 h-16 mx-auto mb-6 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Still need help?
          </h3>
          <p className={`text-lg mb-6 max-w-2xl mx-auto ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Can't find the answer you're looking for? Our friendly support team is here to help you 
            with any questions or issues you might have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/help')}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Contact Support
            </button>
            <button 
              onClick={() => router.push('/community')}
              className={`px-8 py-4 border-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                  : 'border-gray-300 text-gray-700 hover:bg-white'
              }`}
            >
              Join Community Discussion
            </button>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-16">
          <h3 className={`text-2xl font-bold mb-8 text-center ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Tips for New Users
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Users,
                title: 'Complete Your Profile',
                description: 'Add a photo and bio to build trust with other students.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Star,
                title: 'Check Ratings',
                description: 'Always review user ratings and feedback before engaging.',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Shield,
                title: 'Stay Safe',
                description: 'Meet in public places and trust your instincts.',
                color: 'from-red-500 to-rose-500'
              },
              {
                icon: MessageCircle,
                title: 'Communicate Clearly',
                description: 'Be clear about expectations and ask questions upfront.',
                color: 'from-blue-500 to-purple-500'
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