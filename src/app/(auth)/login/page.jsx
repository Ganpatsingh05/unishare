"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, Sparkles, Shield, Zap, ChevronRight, CheckCircle2, AlertCircle, Loader2, KeyRound, UserPlus, LogIn, Fingerprint, ShieldCheck, Rocket } from "lucide-react";
import { startGoogleLogin, loginWithEmail, registerWithEmail, fetchCurrentUser } from "./../../lib/api";
import { useUI, useAuth } from "./../../lib/contexts/UniShareContext";
import SmallFooter from "../../_components/layout/SmallFooter";
import ClientHeader from "../../_components/layout/ClientHeader";

const LoginPage = () => {
  const router = useRouter();
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Handle authenticated user redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const handleInputChange = (field, value) => {
    if (activeTab === 'login') {
      setLoginData(prev => ({ ...prev, [field]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    setIsLoginLoading(true);
    
    try {
      const result = await loginWithEmail(loginData.email, loginData.password);
      
      if (result.success) {
        setSuccess('Login successful! Redirecting...');
        // Refresh auth state
        const user = await fetchCurrentUser();
        if (user) {
          const redirectUrl = searchParams.get('redirect') || '/';
          router.push(redirectUrl);
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    if (!registerData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsRegisterLoading(true);
    
    try {
      const result = await registerWithEmail({
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        email: registerData.email,
        password: registerData.password,
        university: registerData.university
      });
      
      if (result.success) {
        setSuccess('Account created successfully! Please check your email for verification.');
        // Clear form
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          university: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsRegisterLoading(false);
    }
  };

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

  return (
    <>
      {/* Header - Desktop */}
      <div className="hidden md:block">
        <ClientHeader />
      </div>
      
      <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/90'
      }`} style={{ paddingTop: '80px' }}>
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500">
          {/* Primary gradient orb */}
          <div className={`absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px] animate-pulse transition-colors duration-500 ${darkMode ? 'bg-cyan-600/20' : 'bg-cyan-400/30'}`} style={{ animationDuration: '4s' }}></div>
          {/* Secondary gradient orb */}
          <div className={`absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse transition-colors duration-500 ${darkMode ? 'bg-yellow-600/15' : 'bg-yellow-400/25'}`} style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          {/* Accent orb */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px] transition-colors duration-500 ${darkMode ? 'bg-purple-600/15' : 'bg-indigo-400/20'}`}></div>
          {/* Grid pattern overlay */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${darkMode ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] opacity-100' : 'bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] opacity-40'}`} style={{ backgroundSize: '60px 60px' }}></div>
        </div>

        {/* Main Container */}
        <div className="relative w-full max-w-7xl mx-auto px-4 py-8 md:px-6 lg:px-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <Image 
              src="/images/logos/logounishare1.png" 
              alt="UniShare" 
              width={48} 
              height={48} 
              className="rounded-xl"
            />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <span className="text-yellow-400">Uni</span>
              <span className="text-cyan-400">Share</span>
            </h1>
          </div>

          {/* Dual Side Layout - Creative Arrangement */}
          <div className="grid lg:grid-cols-2 gap-0 items-stretch relative">
            
            {/* Connecting Bridge Element - Premium */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center">
              {/* Subtle outer ring */}
              <div className={`absolute w-[88px] h-[88px] rounded-full transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-cyan-500/10 to-yellow-500/10 blur-sm' : 'bg-gradient-to-br from-cyan-400/15 to-amber-400/15 blur-sm'}`} />
              
              {/* Main circular container */}
              <div className={`relative w-20 h-20 rounded-full transition-all duration-500 group/bridge cursor-pointer ${darkMode ? 'bg-gray-900 shadow-2xl shadow-black/70 border border-gray-700/60' : 'bg-white shadow-xl shadow-gray-400/40 border-2 border-gray-200'}`}>
                
                {/* Gradient ring */}
                <div className={`absolute -inset-[2px] rounded-full opacity-60 ${darkMode ? 'bg-gradient-to-br from-cyan-500 via-transparent to-yellow-500' : 'bg-gradient-to-br from-cyan-400 via-transparent to-amber-400'}`} style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'xor', WebkitMaskComposite: 'xor', padding: '2px' }} />
                
                {/* Inner content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Logo image */}
                  <Image 
                    src="/images/logos/logounishare1.png" 
                    alt="UniShare" 
                    width={44} 
                    height={44} 
                    className="rounded-lg transition-transform duration-300 group-hover/bridge:scale-110"
                  />
                </div>
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-full opacity-0 group-hover/bridge:opacity-100 transition-opacity duration-300 ${darkMode ? 'bg-gradient-to-br from-cyan-500/20 to-yellow-500/20' : 'bg-gradient-to-br from-cyan-400/20 to-amber-400/20'}`} />
              </div>
            </div>
            
            {/* LEFT SIDE - LOGIN */}
            <div className={`group relative overflow-hidden lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-tl-[2.5rem] transition-shadow duration-500 ${darkMode ? 'shadow-2xl shadow-black/40' : 'shadow-2xl shadow-gray-300/60'}`}>
              
              {/* Slide Overlay - Modern Glassmorphic */}
              <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-[800ms] ease-out group-hover:translate-x-[-5%] group-hover:opacity-0 group-hover:backdrop-blur-none group-hover:pointer-events-none group-hover:duration-[6000ms] group-hover:ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl ${darkMode ? 'bg-gray-900/70' : 'bg-slate-800/50'}`}>
                {/* Gradient mesh background */}
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-cyan-600/40 via-blue-600/30 to-indigo-700/40' : 'bg-gradient-to-br from-cyan-600/50 via-blue-700/40 to-indigo-800/50'}`} />
                
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-cyan-500/30' : 'bg-cyan-500/50'}`} style={{ animationDuration: '4s' }} />
                  <div className={`absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-indigo-500/25' : 'bg-indigo-600/45'}`} style={{ animationDuration: '5s', animationDelay: '1s' }} />
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-blue-500/20' : 'bg-blue-600/35'}`} style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                </div>
                
                {/* Grid pattern */}
                <div className={`absolute inset-0 ${darkMode ? 'opacity-10' : 'opacity-5'}`} style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-cyan-400/60' : 'bg-cyan-500/50'}`}
                      style={{
                        top: `${20 + i * 15}%`,
                        left: `${10 + i * 18}%`,
                        animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Content */}
                <div className="relative text-center px-10 py-8">
                  <h3 className={`text-3xl font-bold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-white'}`}>Welcome Back</h3>
                  <p className={`text-base mb-8 max-w-xs mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>Sign in to access your campus community</p>
                  
                  {/* CTA Button */}
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-sm transition-all cursor-pointer hover:scale-105 ${darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg'}`}>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-cyan-400' : 'bg-cyan-300'}`} />
                    <span className="text-sm font-medium">Hover to sign in</span>
                    <ArrowRight className="w-4 h-4 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDirection: 'alternate' }} />
                  </div>
                </div>
                
                {/* Bottom gradient fade */}
                <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${darkMode ? 'from-gray-900/50 to-transparent' : 'from-white/30 to-transparent'}`} />
              </div>
              
              {/* Form Container */}
              <div className={`relative backdrop-blur-2xl lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-tl-[2.5rem] border-r-0 lg:border-r-0 p-8 lg:p-10 min-h-[650px] flex flex-col justify-center transition-all duration-500 overflow-hidden ${
                darkMode 
                  ? 'bg-gray-900/90 border border-gray-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
                  : 'bg-white/98 border border-gray-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
              }`}>
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-tl-[2.5rem]">
                  {/* Dark mode: geometric elements in corners */}
                  {darkMode && (
                    <>
                      {/* Top-left corner accent */}
                      <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full border-[3px] border-cyan-500/10" />
                      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-cyan-500/8 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
                      {/* Bottom-left corner curve */}
                      <svg className="absolute -bottom-2 -left-2 w-40 h-40 text-cyan-500/10" viewBox="0 0 200 200" fill="none">
                        <path d="M0,200 Q0,100 100,100 T200,0" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                      {/* Bottom-right corner glow */}
                      <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-tl from-blue-500/8 to-transparent blur-2xl" />
                      {/* Top-right dotted pattern */}
                      <div className="absolute top-4 right-4 grid grid-cols-3 gap-1.5 opacity-15">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-cyan-400" />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Light mode: soft corner accents */}
                  {!darkMode && (
                    <>
                      {/* Top-left soft gradient */}
                      <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-br from-sky-100/90 via-cyan-50/60 to-transparent blur-2xl" />
                      {/* Bottom-left corner wave */}
                      <svg className="absolute bottom-0 left-0 w-32 h-32 text-cyan-100/60" viewBox="0 0 100 100" fill="none">
                        <path d="M0,100 Q0,50 50,50 Q100,50 100,0" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                      </svg>
                      {/* Bottom-right glow */}
                      <div className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-tl from-blue-100/80 via-indigo-50/50 to-transparent blur-2xl" />
                      {/* Top-right corner circles */}
                      <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border-2 border-cyan-200/40" />
                      <div className="absolute top-2 right-2 w-12 h-12 rounded-full border border-blue-200/30" />
                      {/* Left edge accent dots */}
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                        <div className="w-1 h-1 rounded-full bg-blue-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
                      </div>
                      {/* Bottom edge line */}
                      <div className="absolute bottom-4 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
                    </>
                  )}
                </div>
                {/* Mesh gradient texture */}
                <div className={`absolute inset-0 lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-tl-[2.5rem] pointer-events-none overflow-hidden transition-opacity duration-500 ${darkMode ? 'opacity-40' : 'opacity-30'}`}>
                  <div className={`absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-3xl transition-colors duration-500 ${darkMode ? 'bg-gradient-to-br from-cyan-500/15 to-transparent' : 'bg-gradient-to-br from-cyan-400/25 to-transparent'}`} />
                  <div className={`absolute -bottom-1/4 -right-1/4 w-3/4 h-3/4 rounded-full blur-3xl transition-colors duration-500 ${darkMode ? 'bg-gradient-to-tl from-blue-600/10 to-transparent' : 'bg-gradient-to-tl from-blue-500/20 to-transparent'}`} />
                </div>
                {/* Subtle inner glow */}
                <div className={`absolute inset-0 lg:rounded-l-[2.5rem] lg:rounded-r-none rounded-t-[2.5rem] lg:rounded-t-none lg:rounded-tl-[2.5rem] pointer-events-none transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent' : 'bg-gradient-to-br from-cyan-50/50 via-transparent to-transparent'}`} />

                {/* Header */}
                <div className="relative mb-6">
                  <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Welcome Back
                  </h2>
                  <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Sign in to your account
                  </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${darkMode ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${darkMode ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading || isLoginLoading}
                  className={`relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-medium transition-all duration-300 mb-6 group/btn disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                    darkMode
                      ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 ${darkMode ? 'bg-gradient-to-r from-cyan-500/10 via-transparent to-yellow-500/10' : 'bg-gradient-to-r from-cyan-100/50 via-transparent to-yellow-100/50'}`} />
                  {isLoading ? (
                    <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${darkMode ? 'border-white' : 'border-gray-900'}`}></div>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5 relative">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span className="relative font-semibold">Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative mb-6 flex items-center">
                  <div className={`flex-1 h-px transition-colors duration-500 ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-600/80 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
                  <span className={`px-4 text-sm font-medium transition-colors duration-500 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or continue with email</span>
                  <div className={`flex-1 h-px transition-colors duration-500 ${darkMode ? 'bg-gradient-to-r from-transparent via-gray-600/80 to-transparent' : 'bg-gradient-to-r from-transparent via-gray-300 to-transparent'}`}></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="group/input relative">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      {/* Glow effect on focus */}
                      <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-400/30'}`} />
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-300 z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-cyan-500/20' : 'bg-gray-100 group-focus-within/input:bg-cyan-50'}`}>
                        <Mail className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-cyan-400' : 'text-gray-500 group-focus-within/input:text-cyan-600'}`} />
                      </div>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@university.edu"
                        className={`relative w-full pl-14 pr-4 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-800/80'
                            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white'
                        } focus:outline-none`}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="group/input relative">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Password
                    </label>
                    <div className="relative">
                      {/* Glow effect on focus */}
                      <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-400/30'}`} />
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all duration-300 z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-cyan-500/20' : 'bg-gray-100 group-focus-within/input:bg-cyan-50'}`}>
                        <Lock className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-cyan-400' : 'text-gray-500 group-focus-within/input:text-cyan-600'}`} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Enter your password"
                        className={`relative w-full pl-14 pr-12 py-3.5 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:bg-gray-800/80'
                            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-cyan-500 focus:bg-white'
                        } focus:outline-none`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all z-10 ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group/check">
                      <div className="relative">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 transition-all peer-checked:bg-gradient-to-br peer-checked:from-cyan-500 peer-checked:to-blue-500 peer-checked:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`}>
                          <CheckCircle2 className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-0.5" />
                        </div>
                      </div>
                      <span className={`ml-2.5 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Remember me
                      </span>
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className={`text-sm font-semibold transition-colors ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-600 hover:text-cyan-700'}`}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className={`relative w-full overflow-hidden text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-400 hover:via-blue-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 hover:shadow-xl' 
                        : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-600 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-600/35 hover:shadow-xl'
                    }`}
                  >
                    {isLoginLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
                        <span className="relative z-10">Signing In...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Sign In</span>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT SIDE - REGISTER */}
            <div className={`group relative overflow-hidden lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-br-[2.5rem] transition-shadow duration-500 ${darkMode ? 'shadow-2xl shadow-black/40' : 'shadow-2xl shadow-gray-300/60'}`}>
              
              {/* Slide Overlay - Modern Glassmorphic */}
              <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-all duration-[800ms] ease-out group-hover:translate-x-[5%] group-hover:opacity-0 group-hover:backdrop-blur-none group-hover:pointer-events-none group-hover:duration-[6000ms] group-hover:ease-[cubic-bezier(0.16,1,0.3,1)] backdrop-blur-xl ${darkMode ? 'bg-gray-900/70' : 'bg-slate-800/50'}`}>
                {/* Gradient mesh background */}
                <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-yellow-600/40 via-orange-600/30 to-rose-700/40' : 'bg-gradient-to-br from-amber-600/50 via-orange-700/40 to-rose-800/50'}`} />
                
                {/* Animated gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-yellow-500/30' : 'bg-amber-500/50'}`} style={{ animationDuration: '4s' }} />
                  <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl animate-pulse ${darkMode ? 'bg-rose-500/25' : 'bg-rose-600/45'}`} style={{ animationDuration: '5s', animationDelay: '1s' }} />
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-2xl animate-pulse ${darkMode ? 'bg-orange-500/20' : 'bg-orange-600/35'}`} style={{ animationDuration: '3s', animationDelay: '0.5s' }} />
                </div>
                
                {/* Grid pattern */}
                <div className={`absolute inset-0 ${darkMode ? 'opacity-10' : 'opacity-5'}`} style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                
                {/* Floating particles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className={`absolute w-1 h-1 rounded-full ${darkMode ? 'bg-yellow-400/60' : 'bg-amber-500/50'}`}
                      style={{
                        top: `${25 + i * 12}%`,
                        right: `${15 + i * 15}%`,
                        animation: `float ${3.5 + i * 0.4}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
                
                {/* Content */}
                <div className="relative text-center px-10 py-8">
                  <h3 className={`text-3xl font-bold mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-white'}`}>Join UniShare</h3>
                  <p className={`text-base mb-8 max-w-xs mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-200'}`}>Create your account in seconds</p>
                  
                  {/* CTA Button */}
                  <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full border backdrop-blur-sm transition-all cursor-pointer hover:scale-105 ${darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-white/20 border-white/30 text-white hover:bg-white/30 shadow-lg'}`}>
                    <ArrowRight className="w-4 h-4 rotate-180 animate-[bounce_1s_ease-in-out_infinite]" style={{ animationDirection: 'alternate' }} />
                    <span className="text-sm font-medium">Hover to sign up</span>
                    <div className={`w-2 h-2 rounded-full animate-pulse ${darkMode ? 'bg-yellow-400' : 'bg-amber-500'}`} />
                  </div>
                </div>
                
                {/* Bottom gradient fade */}
                <div className={`absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t ${darkMode ? 'from-gray-900/50 to-transparent' : 'from-white/30 to-transparent'}`} />
              </div>
              
              {/* Form Container */}
              <div className={`relative backdrop-blur-2xl lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-br-[2.5rem] border-l-0 lg:border-l-0 p-8 lg:p-10 min-h-[650px] flex flex-col justify-center transition-all duration-500 overflow-hidden ${
                darkMode 
                  ? 'bg-gray-900/90 border border-gray-700/60 shadow-[0_8px_32px_rgba(0,0,0,0.5)]' 
                  : 'bg-white/98 border border-gray-200/60 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
              }`}>
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-br-[2.5rem]">
                  {/* Dark mode: geometric elements in corners */}
                  {darkMode && (
                    <>
                      {/* Top-right corner accent */}
                      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full border-[3px] border-yellow-500/10" />
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-yellow-500/8 to-transparent" style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 0)' }} />
                      {/* Bottom-right corner curve */}
                      <svg className="absolute -bottom-2 -right-2 w-40 h-40 text-yellow-500/10" viewBox="0 0 200 200" fill="none">
                        <path d="M200,200 Q200,100 100,100 T0,0" stroke="currentColor" strokeWidth="2" fill="none" />
                      </svg>
                      {/* Bottom-left corner glow */}
                      <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gradient-to-tr from-orange-500/8 to-transparent blur-2xl" />
                      {/* Top-left dotted pattern */}
                      <div className="absolute top-4 left-4 grid grid-cols-3 gap-1.5 opacity-15">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-1 h-1 rounded-full bg-yellow-400" />
                        ))}
                      </div>
                      {/* Hexagon accent bottom */}
                      <svg className="absolute bottom-6 right-6 w-12 h-12 text-orange-400/10" viewBox="0 0 60 52" fill="none">
                        <path d="M30 0L56.6 15V41L30 52L3.4 41V15L30 0Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      </svg>
                    </>
                  )}
                  {/* Light mode: warm corner accents */}
                  {!darkMode && (
                    <>
                      {/* Top-right soft gradient */}
                      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-bl from-amber-100/90 via-orange-50/60 to-transparent blur-2xl" />
                      {/* Bottom-right corner wave */}
                      <svg className="absolute bottom-0 right-0 w-32 h-32 text-amber-100/60" viewBox="0 0 100 100" fill="none">
                        <path d="M100,100 Q100,50 50,50 Q0,50 0,0" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                      </svg>
                      {/* Bottom-left glow */}
                      <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-gradient-to-tr from-yellow-100/80 via-rose-50/50 to-transparent blur-2xl" />
                      {/* Top-left corner circles */}
                      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full border-2 border-amber-200/40" />
                      <div className="absolute top-2 left-2 w-12 h-12 rounded-full border border-orange-200/30" />
                      {/* Right edge accent dots */}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 opacity-30">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                        <div className="w-1 h-1 rounded-full bg-orange-300" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                      </div>
                      {/* Bottom edge line */}
                      <div className="absolute bottom-4 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
                      {/* Sun burst corner accent */}
                      <svg className="absolute top-3 right-3 w-16 h-16 text-amber-200/40" viewBox="0 0 80 80" fill="none">
                        <circle cx="40" cy="40" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
                        <line x1="40" y1="20" x2="40" y2="28" stroke="currentColor" strokeWidth="1" />
                        <line x1="40" y1="52" x2="40" y2="60" stroke="currentColor" strokeWidth="1" />
                        <line x1="20" y1="40" x2="28" y2="40" stroke="currentColor" strokeWidth="1" />
                        <line x1="52" y1="40" x2="60" y2="40" stroke="currentColor" strokeWidth="1" />
                      </svg>
                    </>
                  )}
                </div>
                {/* Mesh gradient texture */}
                <div className={`absolute inset-0 lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-br-[2.5rem] pointer-events-none overflow-hidden transition-opacity duration-500 ${darkMode ? 'opacity-40' : 'opacity-30'}`}>
                  <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-3xl transition-colors duration-500 ${darkMode ? 'bg-gradient-to-bl from-yellow-500/15 to-transparent' : 'bg-gradient-to-bl from-yellow-400/25 to-transparent'}`} />
                  <div className={`absolute -bottom-1/4 -left-1/4 w-3/4 h-3/4 rounded-full blur-3xl transition-colors duration-500 ${darkMode ? 'bg-gradient-to-tr from-orange-600/10 to-transparent' : 'bg-gradient-to-tr from-orange-500/20 to-transparent'}`} />
                </div>
                {/* Subtle inner glow */}
                <div className={`absolute inset-0 lg:rounded-r-[2.5rem] lg:rounded-l-none rounded-b-[2.5rem] lg:rounded-b-none lg:rounded-br-[2.5rem] pointer-events-none transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-yellow-500/5 via-transparent to-transparent' : 'bg-gradient-to-br from-yellow-50/50 via-transparent to-transparent'}`} />
                
                {/* Header */}
                <div className="relative mb-6">
                  <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Create Account
                  </h2>
                  <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Join your campus community
                  </p>
                </div>

                {/* Error/Success Messages */}
                {error && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${darkMode ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-600'}`}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${darkMode ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-green-50 border border-green-200 text-green-600'}`}>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

              {/* Register Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/input relative">
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        First Name
                      </label>
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                          <User className={`w-3.5 h-3.5 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                        </div>
                        <input
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="John"
                          className={`relative w-full pl-11 pr-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                    </div>
                    <div className="group/input relative">
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Last Name
                      </label>
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                          <User className={`w-3.5 h-3.5 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                        </div>
                        <input
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Doe"
                          className={`relative w-full pl-11 pr-3 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                          } focus:outline-none`}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="group/input relative">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                        <Mail className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                      </div>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@university.edu"
                        className={`relative w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                        } focus:outline-none`}
                        required
                      />
                    </div>
                  </div>

                  {/* University Field */}
                  <div className="group/input relative">
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      University/College
                    </label>
                    <div className="relative">
                      <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                      <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                        <GraduationCap className={`w-4 h-4 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                      </div>
                      <input
                        type="text"
                        value={registerData.university}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, university: e.target.value }))}
                        placeholder="Your University Name"
                        className={`relative w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                          darkMode
                            ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                            : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                        } focus:outline-none`}
                      />
                    </div>
                  </div>

                  {/* Password Fields Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group/input relative">
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Password
                      </label>
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                          <Lock className={`w-3.5 h-3.5 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Create"
                          className={`relative w-full pl-11 pr-10 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                          } focus:outline-none`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all z-10 ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="group/input relative">
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        Confirm
                      </label>
                      <div className="relative">
                        <div className={`absolute -inset-0.5 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity duration-300 ${darkMode ? 'bg-yellow-500/20' : 'bg-yellow-400/30'}`} />
                        <div className={`absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors z-10 ${darkMode ? 'bg-gray-700/50 group-focus-within/input:bg-yellow-500/20' : 'bg-gray-100 group-focus-within/input:bg-yellow-50'}`}>
                          <Lock className={`w-3.5 h-3.5 transition-colors ${darkMode ? 'text-gray-400 group-focus-within/input:text-yellow-400' : 'text-gray-500 group-focus-within/input:text-yellow-600'}`} />
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm"
                          className={`relative w-full pl-11 pr-10 py-3 rounded-xl border-2 transition-all duration-300 ${
                            darkMode
                              ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:bg-gray-800/80'
                              : 'bg-gray-50/80 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-yellow-500 focus:bg-white'
                          } focus:outline-none focus:ring-4 focus:ring-yellow-500/10`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'}`}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start gap-3">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        checked={registerData.agreeToTerms}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className={`w-5 h-5 rounded-md border-2 transition-all cursor-pointer peer-checked:bg-gradient-to-br peer-checked:from-yellow-500 peer-checked:to-orange-500 peer-checked:border-transparent ${darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-white'}`} onClick={() => setRegisterData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}>
                        <CheckCircle2 className={`w-full h-full text-white p-0.5 transition-opacity ${registerData.agreeToTerms ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                    </div>
                    <label htmlFor="agreeToTerms" className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      I agree to UniShare's{' '}
                      <Link href="/info/terms" className={`font-semibold underline transition-colors ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}>
                        Terms
                      </Link>
                      {' '}and{' '}
                      <Link href="/info/privacy" className={`font-semibold underline transition-colors ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-yellow-600 hover:text-yellow-700'}`}>
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isRegisterLoading}
                    className={`relative w-full overflow-hidden text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group/btn disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                      darkMode 
                        ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-rose-500 hover:from-yellow-400 hover:via-orange-400 hover:to-rose-400 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-400/30 hover:shadow-xl' 
                        : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-rose-500 hover:from-yellow-600 hover:via-orange-600 hover:to-rose-600 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-600/35 hover:shadow-xl'
                    }`}
                  >
                    {isRegisterLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 relative z-10 animate-spin" />
                        <span className="relative z-10">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span className="relative z-10">Create Account</span>
                        <ArrowRight className="w-5 h-5 relative z-10 transition-transform group-hover/btn:translate-x-1" />
                      </>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer - Desktop */}
      <div className="hidden md:block">
        <SmallFooter />
      </div>
    </>
  );
};

export default LoginPage;
