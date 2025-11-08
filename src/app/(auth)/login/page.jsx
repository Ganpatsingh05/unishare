"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";

import { startGoogleLogin } from "./../../lib/api";
import { useUI, useAuth } from "./../../lib/contexts/UniShareContext";
import SmallFooter from "../../_components/layout/SmallFooter";
import ClientHeader from "../../_components/layout/ClientHeader";

const LoginPage = () => {
  const router = useRouter();
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Handle authenticated user redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const redirect = searchParams.get('redirect');
    if (redirect) {
      sessionStorage.setItem('oauth_redirect', redirect);
    }
    
    try {
      startGoogleLogin();
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add email/password login logic here
    console.log('Login with:', formData);
  };

  return (
    <>
      {/* Header - Hidden on mobile */}
      <div className="hidden md:block">
        <ClientHeader />
      </div>
      
      <div className={`min-h-0 md:min-h-screen flex items-start md:items-center justify-center relative overflow-hidden md:pt-20 ${
        darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100'
      }`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-cyan-500' : 'bg-cyan-400'
        }`}></div>
        <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          darkMode ? 'bg-yellow-500' : 'bg-yellow-400'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 ${
          darkMode ? 'bg-sky-500' : 'bg-sky-300'
        }`}></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto px-4 py-4 md:px-6 lg:px-8 md:py-0 grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
        
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src="/images/logos/logounishare1.png" 
                alt="UniShare" 
                width={56} 
                height={56} 
                className="rounded-xl shadow-lg"
              />
              <div>
                <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-yellow-400">Uni</span>
                  <span className="text-cyan-400">Share</span>
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your Campus Community
                </p>
              </div>
            </div>

            <h2 className={`text-4xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome back to <br />
              <span className="bg-gradient-to-r from-yellow-400 to-cyan-400 bg-clip-text text-transparent">
                your campus hub
              </span>
            </h2>

            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Connect, share, and thrive with your campus community. Access housing, rideshares, marketplace, and more.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              {['🏠 Housing', '🚗 Rideshare', '🛍️ Marketplace', '📚 Resources'].map((feature) => (
                <div
                  key={feature}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    darkMode 
                      ? 'bg-white/10 text-gray-200' 
                      : 'bg-white/60 text-gray-800'
                  } backdrop-blur-sm`}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className={`relative backdrop-blur-xl rounded-3xl border p-6 sm:p-8 shadow-2xl ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700/50' 
            : 'bg-white/80 border-white/60'
        }`}>
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
            <Image 
              src="/images/logos/logounishare1.png" 
              alt="UniShare" 
              width={48} 
              height={48} 
              className="rounded-xl"
            />
            <div className="text-center">
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <span className="text-yellow-400">Uni</span>
                <span className="text-cyan-400">Share</span>
              </h1>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign in to continue
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Access your campus community dashboard
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl font-medium transition-all duration-300 mb-5 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 hover:border-white/30'
                : 'bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300'
            }`}
          >
            {isLoading ? (
              <div className={`w-6 h-6 border-3 rounded-full animate-spin ${
                darkMode ? 'border-white/30 border-t-white' : 'border-gray-300 border-t-gray-900'
              }`}></div>
            ) : (
              <>
                <svg viewBox="0 0 24 24" className="w-6 h-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-base">Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-5 flex items-center">
            <div className={`flex-1 border-t ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}></div>
            <span className={`px-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Or continue with email
            </span>
            <div className={`flex-1 border-t ${darkMode ? 'border-gray-600' : 'border-gray-400'}`}></div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@university.edu"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                  } focus:outline-none focus:ring-4 focus:ring-cyan-500/20`}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl border-2 transition-all ${
                    darkMode
                      ? 'bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
                  } focus:outline-none focus:ring-4 focus:ring-cyan-500/20`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-cyan-500 focus:ring-cyan-500"
                />
                <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Remember me
                </span>
              </label>
              <Link 
                href="/forgot-password" 
                className="text-cyan-500 hover:text-cyan-600 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-cyan-400 hover:from-yellow-500 hover:to-cyan-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-cyan-500 hover:text-cyan-600 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className={`text-xs text-center mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            By continuing, you agree to UniShare's{' '}
            <Link href="/info/terms" className="underline hover:text-cyan-500">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/info/privacy" className="underline hover:text-cyan-500">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
    
    {/* Footer - Hidden on mobile */}
    <div className="hidden md:block">
      <SmallFooter />
    </div>
  </>
  );
};

export default LoginPage;
