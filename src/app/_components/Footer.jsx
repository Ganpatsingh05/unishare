"use client";

import Link from 'next/link';
import { useState } from 'react';

const Footer = ({ darkMode }) => {
  const [email, setEmail] = useState('');

  const footerLinks = {
    'Quick Links': [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ],
    'Community': [
      { name: 'Guidelines', href: '/community/guidelines' },
      { name: 'Safety Tips', href: '/community/safety' },
      { name: 'Report Issue', href: '/community/report' },
      { name: 'Feedback', href: '/community/feedback' },
      { name: 'Join Discussion', href: '/community/discussion' }
    ],
    'Resources': [
      { name: 'Download App', href: '/download' },
      { name: 'User Guide', href: '/guide' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Developer Portal', href: '/developers' },
      { name: 'Status Page', href: '/status' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: 'https://facebook.com' },
    { name: 'Twitter', icon: '🐦', href: 'https://twitter.com' },
    { name: 'Instagram', icon: '📷', href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: '💼', href: 'https://linkedin.com' }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    alert(`Thanks for subscribing with email: ${email}`);
    setEmail('');
  };

  return (
    <footer className={`mt-16 border-t transition-all duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-gray-700 text-gray-300' 
        : 'bg-white border-gray-200 text-gray-600'
    }`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className={`text-2xl font-bold mb-4 ${
              darkMode ? 'text-yellow-300' : 'text-blue-600'
            }`}>
              <Link href="/">QuickCampus</Link>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Connecting campus communities through shared rides, marketplace, lost & found, and essential resources.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl hover:scale-110 transition-transform duration-200 ${
                    darkMode ? 'hover:text-yellow-300' : 'hover:text-blue-600'
                  }`}
                  aria-label={social.name}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className={`font-semibold mb-4 ${
                darkMode ? 'text-yellow-300' : 'text-blue-600'
              }`}>
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:underline ${
                        darkMode 
                          ? 'hover:text-yellow-300' 
                          : 'hover:text-blue-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className={`border-t pt-8 mb-8 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="max-w-md mx-auto text-center">
            <h4 className={`font-semibold mb-2 ${
              darkMode ? 'text-yellow-300' : 'text-blue-600'
            }`}>
              Stay Updated
            </h4>
            <p className="text-sm mb-4">
              Get the latest community updates and announcements
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className={`flex-1 px-4 py-2 rounded-lg border outline-none transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-300' 
                    : 'bg-gray-50 border-gray-300 text-gray-800 focus:border-blue-500'
                }`}
              />
              <button 
                type="submit"
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  darkMode 
                    ? 'bg-yellow-300 text-gray-800 hover:bg-yellow-400' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t text-sm ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="mb-4 md:mb-0">
            © {new Date().getFullYear()} QuickCampus. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className={`transition-colors duration-200 ${
              darkMode ? 'hover:text-yellow-300' : 'hover:text-blue-600'
            }`}>
              Privacy
            </Link>
            <Link href="/terms" className={`transition-colors duration-200 ${
              darkMode ? 'hover:text-yellow-300' : 'hover:text-blue-600'
            }`}>
              Terms
            </Link>
            <Link href="/cookies" className={`transition-colors duration-200 ${
              darkMode ? 'hover:text-yellow-300' : 'hover:text-blue-600'
            }`}>
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;