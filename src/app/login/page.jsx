"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home,
  ArrowLeft
} from 'lucide-react';
import logoImage from '../assets/images/logounishare1.png';
import { startGoogleLogin } from '../lib/api';

const LoginPage = () => {
  const [showOwlMessage, setShowOwlMessage] = useState(false);
  const [currentOwlMessage, setCurrentOwlMessage] = useState('');

  const handleGoogleLogin = () => {
    startGoogleLogin();
  };

  const handleOwlClick = () => {
    const owlMessages = [
      "Keep going to login process dont disturb me",
      "Hoot! I'm watching you study... 👀",
      "Stop clicking me and focus on your login!",
      "I'm busy guarding your campus secrets 🤫",
      "Wise owls don't get distracted during login",
      "Click less, study more! 📚",
      "I'm not your entertainment, I'm your guardian!",
      "Focus on your password, not on me!",
      "Every click delays your campus journey...",
      "Hoot hoot! Pay attention to the form!"
    ];
    
    const randomMessage = owlMessages[Math.floor(Math.random() * owlMessages.length)];
    console.log(`🦉 "${randomMessage}"`);
    
    setCurrentOwlMessage(randomMessage);
    setShowOwlMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowOwlMessage(false);
    }, 3000);
  };

  return (
    <>
      {/* Mobile Layout (hidden on lg and above) */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
        {/* Mobile Header */}
        <div className="relative p-6 text-center">
          {/* Back to Home Button */}
          <div className="absolute top-6 left-6 z-20">
            <Link 
              href="/" 
              className="flex items-center justify-center w-10 h-10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-slate-600/50"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
          </div>

          {/* Mobile Logo */}
          <div className="relative z-10 flex items-center justify-center gap-3 mb-6">
            <Image src={logoImage} alt="UniShare" width={40} height={40} className="rounded-lg" />
            <span className="text-2xl font-bold text-white">
              <span className="text-yellow-400">Uni</span>
              <span className="text-cyan-400">Share</span>
            </span>
          </div>

          {/* Mobile Welcome Text */}
          <h1 className="text-xl font-bold text-white leading-tight mb-3">
            Welcome Back!
          </h1>
          <p className="text-slate-300 text-sm mb-6">
            Sign in to your campus community
          </p>
        </div>

        {/* Mobile Form Container */}
        <div className="flex-1 px-6 pb-6">
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6">
            {/* Mobile Owl Mascot */}
            <div className="absolute -top-12 right-4 z-10">
              <div className="relative cursor-pointer" onClick={handleOwlClick}>
                <div className="w-16 h-16 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <div className="text-4xl">🦉</div>
                </div>
                
                {/* Mobile Speech Bubble */}
                {showOwlMessage && (
                  <div className="absolute -bottom-8 -left-28 bg-white text-gray-800 text-xs px-3 py-2 rounded-2xl shadow-lg border-2 border-gray-200 transform transition-all duration-300 z-20 max-w-xs">
                    <div className="font-medium">"{currentOwlMessage}"</div>
                    <div className="absolute top-0 right-6 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-200"></div>
                    <div className="absolute top-0 right-6 transform -translate-y-1/2 translate-y-0.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"></div>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-xl font-bold text-white mb-6 text-center">LOGIN</h2>

            {/* Mobile Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-gray-200"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span>Continue with Google</span>
            </button>

            {/* Mobile Create Account Link */}
            <div className="text-center mt-6">
              <p className="text-slate-400 text-sm mb-3">Don't have an account?</p>
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-6 py-2.5 bg-transparent border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white font-semibold rounded-xl transition-all duration-300"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <footer className="bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 py-4 px-6">
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-400 mb-3">
              <Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy</Link>
              <Link href="/support" className="hover:text-cyan-400 transition-colors">Support</Link>
            </div>
            <div className="text-xs text-slate-500">© 2024-2025 UniShare. All rights reserved.</div>
          </div>
        </footer>
      </div>

      {/* Desktop Layout (hidden below lg) */}
      <div className="hidden lg:flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Back to Home Button */}
          <div className="absolute top-8 left-8 z-20">
            <Link 
              href="/" 
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-slate-600/50"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm font-medium">Home</span>
            </Link>
          </div>

          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-0">
            {/* Left Side - Brand/Welcome */}
            <div className="flex flex-col justify-center items-start p-4 sm:p-6 lg:p-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl lg:rounded-r-none border border-slate-700/50 order-2 lg:order-1">
              {/* Logo */}
              <div className="flex items-center gap-3 mb-4 lg:mb-6 w-full justify-center lg:justify-start">
                <Image src={logoImage} alt="UniShare" width={36} height={36} className="rounded-lg" />
                <span className="text-lg sm:text-xl font-bold text-white">
                  <span className="text-yellow-400">Uni</span>
                  <span className="text-cyan-400">Share</span>
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight mb-3 lg:mb-4 text-center lg:text-left">
                ONE ACCOUNT FOR ALL UNISHARE SERVICES
              </h1>
              
              <p className="text-slate-300 text-sm lg:text-base mb-4 lg:mb-6 leading-relaxed text-center lg:text-left">
                Hi there! Sign in to your account and enjoy your campus community experience on UniShare.
              </p>

              <div className="w-full flex justify-center lg:justify-start">
                <Link 
                  href="/register" 
                  className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25 text-sm"
                >
                  CREATE NEW ACCOUNT
                </Link>
              </div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="relative flex flex-col justify-center p-4 sm:p-6 lg:p-12 bg-slate-700/50 backdrop-blur-sm rounded-2xl lg:rounded-l-none border border-slate-600/50 order-1 lg:order-2">
              {/* Peeking Owl Mascot */}
              <div className="absolute -top-16 right-8 sm:-top-18 sm:right-10 z-10">
                <div className="relative cursor-pointer" onClick={handleOwlClick}>
                  {/* Owl Container */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center hover:scale-110 transition-transform duration-300">
                    <div className="text-5xl sm:text-6xl lg:text-7xl">
                      🦉
                    </div>
                  </div>
                  
                  {/* Speech Bubble Message */}
                  {showOwlMessage && (
                    <div className="absolute -bottom-10 -left-32 sm:-left-40 lg:-left-48 bg-white text-gray-800 text-xs sm:text-sm px-3 py-2 rounded-2xl shadow-lg border-2 border-gray-200 transform transition-all duration-300 whitespace-nowrap z-20 max-w-xs">
                      <div className="font-medium">
                        "{currentOwlMessage}"
                      </div>
                      {/* Speech bubble tail */}
                      <div className="absolute top-0 right-8 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-gray-200"></div>
                      <div className="absolute top-0 right-8 transform -translate-y-1/2 translate-y-0.5 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-b-4 border-b-white"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full max-w-sm mx-auto">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 lg:mb-6 text-center lg:text-left">LOGIN</h2>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-4 py-2.5 sm:py-3 bg-white hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg border border-gray-200"
                >
                  {/* Custom Google G Icon */}
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <span className="text-sm">Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Desktop Footer */}
        <footer className="relative z-10 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Footer Links */}
            <div className="flex flex-wrap justify-center lg:justify-between items-center gap-4 mb-4">
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
                <Link href="/about" className="hover:text-cyan-400 transition-colors">
                  About UniShare
                </Link>
                <Link href="/support" className="hover:text-cyan-400 transition-colors">
                  Support
                </Link>
                <Link href="/contact" className="hover:text-cyan-400 transition-colors">
                  Contact Us
                </Link>
                <Link href="/terms" className="hover:text-cyan-400 transition-colors">
                  Terms of Use
                </Link>
                <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
                  Privacy Policy
                </Link>
              </div>
              
              {/* Language Selector */}
              <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                <span>🌐</span>
                <span>English</span>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center text-xs sm:text-sm text-slate-500">
              © 2024-2025 UniShare Campus Community. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LoginPage;