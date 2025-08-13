"use client";

import { useState, useEffect } from 'react';
import { Car, ShoppingCart, Tag, Search, Star, Home as HomeIcon, Megaphone, BookOpen, Phone, GraduationCap } from 'lucide-react';

const Footer = ({ darkMode = false }) => {
  const [email, setEmail] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  const popularLocations = [
    'Kolkata',
    'Mumbai', 
    'Chennai',
    'Pune'
  ];

  const trendingLocations = [
    'Bhubaneswar',
    'Faridabad',
    'Chandigarh', 
    'Nashik'
  ];

  const aboutLinks = [
    'Tech@OLX',
    'Careers'
  ];

  const quickCampusLinks = [
    'Blog',
    'Help',
    'Sitemap',
    'Legal & Privacy information',
    'Vulnerability Disclosure Program'
  ];

  // Updated company features with matching icons from main (excluding QuickCampus)
  const companyFeatures = [
    { name: 'Share a Ride', icon: <Car className="w-6 h-6" /> },
    { name: 'Buy Items', icon: <ShoppingCart className="w-6 h-6" /> },
    { name: 'Sell Items', icon: <Tag className="w-6 h-6" /> },
    { name: 'Report Lost Item', icon: <Search className="w-6 h-6" /> },
    { name: 'Found Item', icon: <Star className="w-6 h-6" /> },
    { name: 'Room & Roommate', icon: <HomeIcon className="w-6 h-6" /> },
    { name: 'Announcements', icon: <Megaphone className="w-6 h-6" /> },
    { name: 'Notes & Resources', icon: <BookOpen className="w-6 h-6" /> },
    { name: 'Important Contacts', icon: <Phone className="w-6 h-6" /> }
  ];

  const socialLinks = [
    { name: 'Facebook', iconUrl: 'https://img.icons8.com/color/48/000000/facebook-new.png', href: '#' },
    { name: 'Instagram', iconUrl: 'https://img.icons8.com/color/48/000000/instagram-new.png', href: '#' },
    { name: 'Youtube', iconUrl: 'https://img.icons8.com/color/48/000000/youtube-play.png', href: '#' },
    { name: 'Twitter', iconUrl: 'https://img.icons8.com/color/48/000000/twitter.png', href: '#' },
    { name: 'WhatsApp', iconUrl: 'https://img.icons8.com/color/48/000000/whatsapp.png', href: '#' },
    { name: 'LinkedIn', iconUrl: 'https://img.icons8.com/color/48/000000/linkedin.png', href: '#' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing with email: ${email}`);
    setEmail('');
  };

  // Slideshow effect for company features - one at a time rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % companyFeatures.length);
    }, 2000); // Change feature every 2 seconds

    return () => clearInterval(interval);
  }, [companyFeatures.length]);

  const getVisibleFeatures = () => {
    const itemsToShow = 5; // Show 5 features at a time
    const visibleFeatures = [];
    
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentSlide + i) % companyFeatures.length;
      visibleFeatures.push({
        ...companyFeatures[index],
        key: `${currentSlide}-${i}`
      });
    }
    
    return visibleFeatures;
  };

  return (
    <footer className={`transition-all duration-300 ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          
          {/* Popular Locations */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              Popular Locations
            </h4>
            <ul className="space-y-3">
              {popularLocations.map((location, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:text-yellow-300' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending Locations */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              Trending Locations
            </h4>
            <ul className="space-y-3">
              {trendingLocations.map((location, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:text-yellow-300' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {location}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              About Us
            </h4>
            <ul className="space-y-3">
              {aboutLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:text-yellow-300' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* QuickCampus Links */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              QuickCampus
            </h4>
            <ul className="space-y-3">
              {quickCampusLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className={`text-sm transition-colors ${
                      darkMode 
                        ? 'text-gray-300 hover:text-yellow-300' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              Support Us
            </h4>
            <div className="space-y-4">
              <a
                href="https://www.buymeacoffee.com/quickcampus"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  darkMode
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                }`}
              >
                ☕ Buy me a coffee
              </a>
              <div className="space-y-2">
                <p className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Help us keep the platform running!
                </p>
                <div className="flex space-x-2">
                  <button className={`px-3 py-1 text-xs rounded transition-colors ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}>
                    Donate
                  </button>
                  <button className={`px-3 py-1 text-xs rounded transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}>
                    Sponsor
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Follow Us & App Download */}
          <div>
            <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wide ${
              darkMode ? 'text-yellow-300' : 'text-gray-800'
            }`}>
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`p-2 rounded-md transition-colors text-lg ${
                    darkMode 
                      ? 'bg-white/5 hover:bg-white/10' 
                      : 'bg-white/0 hover:bg-gray-100'
                  }`}
                  aria-label={social.name}
                >
                  <img src={social.iconUrl} alt={social.name} className="w-6 h-6" />
                </a>
              ))}
            </div>

            {/* App Download Buttons */}
            <div className="space-y-2">
              <a 
                href="#" 
                className="block w-full max-w-40"
              >
                <div className="bg-black text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors text-xs">
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-black text-xs font-bold">▶</span>
                  </div>
                  <div>
                    <div className="text-gray-300 text-xs">GET IT ON</div>
                    <div className="font-semibold text-xs">Google Play</div>
                  </div>
                </div>
              </a>
              
              <a 
                href="#" 
                className="block w-full max-w-40"
              >
                <div className="bg-black text-white px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors text-xs">
                  <svg className="w-4 h-5" viewBox="0 0 384 512" fill="currentColor">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-42.8-35.5-1.1-67.9 21.2-85.6 21.2-18.5 0-45.3-21.1-74.7-20.6-37.4 .4-72.4 21.7-91.4 55.5-39.2 67.9-10.1 168.7 27.3 224.2 18.9 27.4 40.2 57.4 69.5 56.4 28.2-1 38.9-17.7 73-17.7s43.9 17.7 73.7 17.1c30.4-.4 48.8-26.6 67.1-54.6 21.3-32.1 30.1-63.2 30.4-64.8-.6-.3-58.5-22.2-58.9-88.2zM207.1 105.2c15.3-20.3 25.6-48.4 22.8-76.3-21.9.9-49.3 15.5-65.8 35.5-14.4 17.3-27.1 45.3-23.7 72.1 24.9 2.1 50.4-12.8 66.7-31.3z"/>
                  </svg>
                  <div>
                    <div className="text-gray-300 text-xs">Download on the</div>
                    <div className="font-semibold text-xs">App Store</div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Slideshow Section */}
      <div className={`py-8 transition-all duration-300 ${
        darkMode ? 'bg-gray-900' : 'bg-blue-900'
      } text-white relative overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Static QuickCampus Logo - Far Left */}
            <div className="flex flex-col items-center justify-center text-center flex-shrink-0 mr-8">
              <div className="text-4xl mb-2"><GraduationCap className="w-8 h-8" /></div>
              <div className="text-lg font-bold whitespace-nowrap">QuickCampus</div>
            </div>
            
            {/* Rotating Features - Fill remaining space */}
            <div className="flex-1 flex items-center justify-center space-x-8 md:space-x-12 lg:space-x-16">
              {getVisibleFeatures().map((feature, index) => (
                <div 
                  key={feature.key} 
                  className="flex flex-col items-center justify-center text-center animate-slideIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl mb-2 transform hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div className="text-xs font-normal opacity-90 leading-tight whitespace-nowrap">
                    {feature.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-1 mt-6">
            {companyFeatures.map((_, index) => (
              <button
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-yellow-400' : 'bg-white/30'
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className={`border-t transition-all duration-300 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-900 border-blue-800'
      } text-white`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-2 md:mb-0">
              <a href="/help" className="hover:underline mr-4">Help</a>
              <span className="mr-4">•</span>
              <a href="/sitemap" className="hover:underline mr-4">Sitemap</a>
              <span className="mr-4">•</span>
              <a href="/privacy" className="hover:underline mr-4">Privacy Policy</a>
              <span className="mr-4">•</span>
              <a href="/terms" className="hover:underline mr-4">Terms of Service</a>
              <span className="mr-4">•</span>
              <a href="/cookies" className="hover:underline">Cookies Policy</a>
            </div>
            <div className="text-sm opacity-80">
              All rights reserved © {new Date().getFullYear()} QuickCampus
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px) scale(0.9); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
