"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import logoImage from '../assets/images/logounishare1.png'; // Same path as header
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Heart, 
  Coffee,
  ExternalLink,
  ChevronUp,
  Send,
  User,
  BookOpen,
  Home,
  Car,
  ShoppingBag,
  MessageCircle,
  ArrowUp
} from 'lucide-react';

const Footer = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(true);
  const [hoveredSocial, setHoveredSocial] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Find Rides', href: '/share-ride', icon: Car },
      { name: 'Buy & Sell', href: '/marketplace/buy', icon: ShoppingBag },
      { name: 'Find Rooms', href: '/housing', icon: Home },
      { name: 'Study Materials', href: '/resources', icon: BookOpen },
      { name: 'Community contacts', href: '/contacts', icon: MessageCircle }
    ],
    support: [
      { name: 'Help Center', href: '/footerpages/help' },
      { name: 'Safety Guidelines', href: '/footerpages/support-guidelines' },
      { name: 'Report Issues', href: '/footerpages/report' },
      { name: 'FAQs', href: '/footerpages/faqs' }
    ],
    company: [
      { name: 'About UniShare', href: '/about' },
      { name: 'Our Mission', href: '/mission' },
      { name: 'Careers', href: '/careers' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Community Guidelines', href: '/guidelines' },
      { name: 'Data Protection', href: '/data-protection' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/unishare', icon: Facebook, color: 'hover:bg-blue-600' },
    { name: 'Twitter', href: 'https://twitter.com/unishare', icon: Twitter, color: 'hover:bg-blue-400' },
    { name: 'Instagram', href: 'https://instagram.com/unishare', icon: Instagram, color: 'hover:bg-pink-600' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/unishare', icon: Linkedin, color: 'hover:bg-blue-700' },
    { name: 'YouTube', href: 'https://youtube.com/unishare', icon: Youtube, color: 'hover:bg-red-600' }
  ];

  return (
    <footer className={`relative transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 border-t border-gray-800' 
        : 'bg-gradient-to-b from-gray-50 to-white text-gray-800 border-t border-gray-200'
    }`}>
      
      {/* Main Footer Content */}
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Top Section - Logo, Description, Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block group mb-6">
              <div className="flex items-center gap-4">
                {/* UniShare Logo */}
                <div className="h-12 w-12 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3">
                  <Image
                    src={logoImage}
                    alt="UniShare Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain bg-transparent"
                    priority
                  />
                </div>
                <span className="font-bold text-2xl">
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-yellow-300 group-hover:text-yellow-200' : 'text-yellow-500 group-hover:text-yellow-600'
                  }`}>
                    Uni
                  </span>
                  <span className={`transition-colors duration-300 ${
                    darkMode ? 'text-sky-300 group-hover:text-sky-200' : 'text-sky-500 group-hover:text-sky-600'
                  }`}>
                    Share
                  </span>
                </span>
              </div>
            </Link>
            
            <p className={`text-lg leading-relaxed mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Connect, share, and thrive with your university community. From rides to resources, 
              UniShare makes student life easier and more collaborative.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode ? 'bg-gray-800 group-hover:bg-yellow-300/20' : 'bg-gray-100 group-hover:bg-yellow-100'
                }`}>
                  <Mail className={`w-4 h-4 transition-colors duration-200 ${
                    darkMode ? 'text-yellow-300 group-hover:text-yellow-200' : 'text-yellow-600 group-hover:text-yellow-700'
                  }`} />
                </div>
                <span className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  support@unishare.com
                </span>
              </div>
              
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  darkMode ? 'bg-gray-800 group-hover:bg-sky-300/20' : 'bg-gray-100 group-hover:bg-sky-100'
                }`}>
                  <Phone className={`w-4 h-4 transition-colors duration-200 ${
                    darkMode ? 'text-sky-300 group-hover:text-sky-200' : 'text-sky-600 group-hover:text-sky-700'
                  }`} />
                </div>
                <span className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-300 group-hover:text-white' : 'text-gray-600 group-hover:text-gray-800'
                }`}>
                  +1 (555) 123-4567
                </span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              
              {/* Platform Links */}
              <div>
                <h3 className={`font-semibold text-lg mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Platform
                </h3>
                <ul className="space-y-3">
                  {footerLinks.platform.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-2 transition-all duration-200 group ${
                          darkMode 
                            ? 'text-gray-400 hover:text-yellow-300 hover:translate-x-1' 
                            : 'text-gray-600 hover:text-yellow-600 hover:translate-x-1'
                        }`}
                        onMouseEnter={() => setHoveredLink(`platform-${index}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <link.icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                        <span className="group-hover:underline">{link.name}</span>
                        {hoveredLink === `platform-${index}` && (
                          <ExternalLink className="w-3 h-3 opacity-50" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className={`font-semibold text-lg mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Support
                </h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`transition-all duration-200 group ${
                          darkMode 
                            ? 'text-gray-400 hover:text-sky-300 hover:translate-x-1' 
                            : 'text-gray-600 hover:text-sky-600 hover:translate-x-1'
                        }`}
                        onMouseEnter={() => setHoveredLink(`support-${index}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <span className="group-hover:underline">{link.name}</span>
                        {hoveredLink === `support-${index}` && (
                          <ExternalLink className="w-3 h-3 opacity-50 inline ml-1" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className={`font-semibold text-lg mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`transition-all duration-200 group ${
                          darkMode 
                            ? 'text-gray-400 hover:text-yellow-300 hover:translate-x-1' 
                            : 'text-gray-600 hover:text-yellow-600 hover:translate-x-1'
                        }`}
                        onMouseEnter={() => setHoveredLink(`company-${index}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <span className="group-hover:underline">{link.name}</span>
                        {hoveredLink === `company-${index}` && (
                          <ExternalLink className="w-3 h-3 opacity-50 inline ml-1" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className={`font-semibold text-lg mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`transition-all duration-200 group ${
                          darkMode 
                            ? 'text-gray-400 hover:text-sky-300 hover:translate-x-1' 
                            : 'text-gray-600 hover:text-sky-600 hover:translate-x-1'
                        }`}
                        onMouseEnter={() => setHoveredLink(`legal-${index}`)}
                        onMouseLeave={() => setHoveredLink(null)}
                      >
                        <span className="group-hover:underline">{link.name}</span>
                        {hoveredLink === `legal-${index}` && (
                          <ExternalLink className="w-3 h-3 opacity-50 inline ml-1" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className={`rounded-2xl p-8 mb-12 border-2 transition-all duration-300 ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700 hover:border-yellow-300/50' 
            : 'bg-gray-50 border-gray-200 hover:border-yellow-300/50'
        }`}>
          <div className="max-w-2xl mx-auto text-center">
            <h3 className={`text-2xl font-bold mb-3 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Stay Updated with UniShare
            </h3>
            <p className={`text-lg mb-6 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Get the latest updates on new features, campus events, and community highlights.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your university email"
                required
                className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/20' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20'
                } outline-none`}
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap ${
                  isSubscribed
                    ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white')
                    : (darkMode 
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 text-gray-900 hover:from-yellow-300 hover:to-yellow-200' 
                        : 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-white hover:from-yellow-600 hover:to-yellow-500'
                      )
                }`}
              >
                {isSubscribed ? (
                  <>
                    <span>✓ Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Social Media & Support Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
          
          {/* Social Media Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 text-center lg:text-left ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Follow UniShare
            </h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                    hoveredSocial === index
                      ? `${social.color} text-white shadow-lg`
                      : (darkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )
                  }`}
                  onMouseEnter={() => setHoveredSocial(index)}
                  onMouseLeave={() => setHoveredSocial(null)}
                  title={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Support UniShare Section */}
          <div className="text-center">
            <h4 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Support UniShare
            </h4>
            <Link
              href="https://buymeacoffee.com/unishare"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                darkMode 
                  ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500' 
                  : 'bg-gradient-to-r from-orange-500 to-orange-400 text-white hover:from-orange-600 hover:to-orange-500'
              }`}
            >
              <Coffee className="w-5 h-5" />
              <span>Buy us a coffee</span>
              <Heart className="w-4 h-4 animate-pulse" />
            </Link>
            <p className={`text-sm mt-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Help keep UniShare free for students
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © {currentYear} UniShare. Made with <Heart className="w-4 h-4 inline text-red-500" /> for students, by students.
          </p>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Built with Next.js & Tailwind CSS
            </span>
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className={`p-2 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95 ${
                  darkMode 
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                }`}
                title="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;