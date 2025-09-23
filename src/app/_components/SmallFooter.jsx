"use client";

import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  Car, 
  ShoppingBag, 
  BookOpen, 
  MessageCircle,
  Heart,
  Coffee,
  ExternalLink,
  ArrowUp,
  Mail,
  Phone
} from 'lucide-react';
import { useUI } from "../lib/contexts/UniShareContext";
import logoImage from '../assets/images/logounishare1.png';

export default function SmallFooter() {
  const { darkMode } = useUI();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Rides', href: '/share-ride', icon: Car },
    { name: 'Marketplace', href: '/marketplace/buy', icon: ShoppingBag },
    { name: 'Housing', href: '/housing', icon: Home },
    { name: 'Resources', href: '/resources', icon: BookOpen },
    { name: 'Contacts', href: '/contacts', icon: MessageCircle }
  ];

  const supportLinks = [
    { name: 'Help', href: '/info/help' },
    { name: 'About', href: '/info/about' },
    { name: 'Privacy', href: '/info/privacy' },
    { name: 'Terms', href: '/info/terms' }
  ];

  return (
    <footer className={`relative transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100 border-t border-gray-700' 
        : 'bg-gradient-to-b from-orange-50 to-orange-100 text-gray-800 border-t border-gray-200'
    }`}>
      
      {/* Desktop Version - More Content */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-6xl px-6 py-8">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-6">
            
            {/* Logo and Brief Description */}
            <div className="lg:col-span-1">
              <Link href="/" className="inline-block group mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 transition-transform duration-300 group-hover:scale-110">
                    <Image
                      src={logoImage}
                      alt="UniShare"
                      width={32}
                      height={32}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="brand-wordmark font-bold text-xl">
                    <span className="brand-uni">Uni</span>
                    <span className="brand-share">Share</span>
                  </span>
                </div>
              </Link>
              
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Your university community platform for sharing rides, resources, and connections.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Quick Access
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 text-sm transition-all duration-200 group ${
                        darkMode 
                          ? 'text-gray-400 hover:text-yellow-300 hover:translate-x-1' 
                          : 'text-gray-600 hover:text-yellow-600 hover:translate-x-1'
                      }`}
                    >
                      <link.icon className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                      <span className="group-hover:underline">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Support
              </h3>
              <ul className="space-y-2">
                {supportLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-200 hover:underline ${
                        darkMode 
                          ? 'text-gray-400 hover:text-sky-300' 
                          : 'text-gray-600 hover:text-sky-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Scroll Top */}
            <div>
              <h3 className={`font-semibold text-sm mb-4 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Contact
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className={`w-3 h-3 ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    support@unishare.com
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className={`w-3 h-3 ${darkMode ? 'text-sky-300' : 'text-sky-600'}`} />
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    +1 (555) 123-4567
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Copyright */}
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                © {new Date().getFullYear()} UniShare. All rights reserved.
              </div>

              {/* Made with Love */}
              <div className="flex items-center gap-2 text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Made with
                </span>
                <Heart className={`w-4 h-4 fill-current ${
                  darkMode ? 'text-red-400' : 'text-red-500'
                }`} />
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  for students
                </span>
                <Coffee className={`w-4 h-4 ${
                  darkMode ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Version - Minimal Content */}
      <div className="block md:hidden">
        <div className="px-4 py-6">
          
          {/* Mobile Logo */}
          <div className="flex items-center justify-center mb-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-6 w-6 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={logoImage}
                  alt="UniShare"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="brand-wordmark font-bold text-lg">
                <span className="brand-uni">Uni</span>
                <span className="brand-share">Share</span>
              </span>
            </Link>
          </div>

          {/* Mobile Copyright */}
          <div className="text-center">
            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              © {new Date().getFullYear()} UniShare™ • All rights reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}