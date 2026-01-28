"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, 
  CheckCircle2, AlertCircle, Loader2, ChevronLeft, X, Check, Calendar, Home, ArrowLeft
} from "lucide-react";
import { startGoogleLogin, loginWithEmail, registerWithEmail, fetchCurrentUser } from "./../../lib/api";
import { useUI, useAuth } from "./../../lib/contexts/UniShareContext";
import HeaderMobile from "./../../_components/layout/HeaderMobile";

// Password strength calculator
const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (password.length >= 12) strength += 10;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
  if (/\d/.test(password)) strength += 20;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 20;
  return Math.min(strength, 100);
};

const getStrengthLabel = (strength) => {
  if (strength < 30) return { label: 'Weak', color: 'bg-red-500' };
  if (strength < 60) return { label: 'Fair', color: 'bg-yellow-500' };
  if (strength < 80) return { label: 'Good', color: 'bg-blue-500' };
  return { label: 'Strong', color: 'bg-green-500' };
};

const MobileLoginPage = () => {
  const router = useRouter();
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  
  // Form states
  const [activeView, setActiveView] = useState('login'); // 'login', 'register', 'register-step2'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [focusedInput, setFocusedInput] = useState(null);
  
  // Animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const containerRef = useRef(null);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    gender: 'male',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  // Bow animation states for gender toggle
  const [bowAnimating, setBowAnimating] = useState(false);
  const [bowDirection, setBowDirection] = useState('toFemale');

  // Handle gender toggle with animation
  const handleGenderToggle = () => {
    const newGender = registerData.gender === 'male' ? 'female' : 'male';
    setBowDirection(newGender === 'female' ? 'toFemale' : 'toMale');
    setBowAnimating(true);
    setRegisterData(prev => ({ ...prev, gender: newGender }));
    setTimeout(() => setBowAnimating(false), 550);
  };

  // Password strength
  const passwordStrength = calculatePasswordStrength(registerData.password);
  const strengthInfo = getStrengthLabel(passwordStrength);

  // Handle authenticated user redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, user, router, searchParams]);

  // Swipe gesture handling
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activeView === 'login') {
        switchView('register');
      } else if (diff < 0 && activeView === 'register') {
        switchView('login');
      }
    }
    setTouchStart(null);
  };

  const switchView = (view) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setError('');
    setSuccess('');
    setTimeout(() => {
      setActiveView(view);
      setIsAnimating(false);
    }, 150);
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
        setSuccess('Welcome back! Redirecting...');
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

  const handleRegisterStep1 = (e) => {
    e.preventDefault();
    setError('');
    
    if (!registerData.firstName || !registerData.lastName || !registerData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    switchView('register-step2');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    if (!registerData.agreeToTerms) {
      setError('Please agree to the Terms and Privacy Policy');
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
        setSuccess('Account created! Check your email for verification.');
        setRegisterData({
          firstName: '',
          lastName: '',
          email: '',
          university: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false
        });
        setTimeout(() => switchView('login'), 2000);
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

  // Input component with premium styling
  const PremiumInput = ({ 
    icon: Icon, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    name,
    required = false,
    showToggle = false,
    isPassword = false,
    showPasswordState,
    onTogglePassword
  }) => {
    const isFocused = focusedInput === name;
    const hasValue = value && value.length > 0;
    
    return (
      <div className="relative group">
        {/* Animated border glow */}
        <div className={`absolute -inset-0.5 rounded-2xl transition-all duration-500 ${
          isFocused 
            ? activeView === 'login' 
              ? 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 opacity-100 blur-sm' 
              : 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-100 blur-sm'
            : 'opacity-0'
        }`} />
        
        <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
          darkMode 
            ? `bg-gray-800/80 ${isFocused ? 'border-transparent' : 'border-gray-700/50'}` 
            : `bg-white/90 ${isFocused ? 'border-transparent' : 'border-gray-200'}`
        }`}>
          {/* Icon container */}
          <div className={`flex-shrink-0 flex items-center justify-center w-12 h-14 pl-3 transition-colors duration-300 ${
            isFocused 
              ? activeView === 'login' ? 'text-cyan-400' : 'text-yellow-400'
              : darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
          
          {/* Input */}
          <input
            type={isPassword ? (showPasswordState ? 'text' : 'password') : type}
            value={value}
            onChange={onChange}
            onFocus={() => setFocusedInput(name)}
            onBlur={() => setFocusedInput(null)}
            placeholder={placeholder}
            required={required}
            className={`flex-1 h-14 pr-4 bg-transparent outline-none text-base transition-colors ${
              darkMode 
                ? 'text-white placeholder-gray-500' 
                : 'text-gray-900 placeholder-gray-400'
            }`}
          />
          
          {/* Password toggle */}
          {showToggle && (
            <button
              type="button"
              onClick={onTogglePassword}
              className={`flex items-center justify-center w-12 h-14 transition-colors ${
                darkMode ? 'text-gray-400 active:text-gray-300' : 'text-gray-500 active:text-gray-700'
              }`}
            >
              {showPasswordState ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {/* Valid indicator */}
          {hasValue && !isPassword && (
            <div className={`flex items-center justify-center w-10 h-14 ${
              activeView === 'login' ? 'text-cyan-400' : 'text-yellow-400'
            }`}>
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`min-h-screen relative overflow-hidden ${
        darkMode 
          ? 'bg-gray-950' 
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
      }`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic gradient orbs */}
        <div className={`absolute w-[300px] h-[300px] rounded-full blur-[100px] transition-all duration-1000 ${
          activeView === 'login' 
            ? '-top-20 -left-20 bg-cyan-500/20' 
            : '-top-20 -right-20 bg-yellow-500/20'
        }`} />
        <div className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] transition-all duration-1000 ${
          activeView === 'login' 
            ? '-bottom-32 -right-32 bg-blue-600/15' 
            : '-bottom-32 -left-32 bg-orange-600/15'
        }`} />
        
        {/* Subtle grid overlay */}
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)]' 
            : 'bg-[radial-gradient(rgba(0,0,0,0.02)_1px,transparent_1px)]'
        }`} style={{ backgroundSize: '32px 32px' }} />
      </div>

      {/* Main Content */}
      {/* Header - Same as home page */}
      <HeaderMobile />

      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col px-6 pt-2 pb-safe">

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 my-4">
          {['login', 'register', 'register-step2'].map((view, i) => (
            <div 
              key={view}
              className={`h-1 rounded-full transition-all duration-500 ${
                (activeView === view || (activeView === 'register-step2' && view === 'register'))
                  ? `w-8 ${activeView.includes('register') ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`
                  : `w-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`
              }`}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="flex-1 flex flex-col justify-center py-4">
          
          {/* View Title & Description */}
          <div className={`text-center mb-8 transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            {activeView === 'login' && (
              <>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Welcome Back
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Sign in to continue to UniShare
                </p>
              </>
            )}
            {activeView === 'register' && (
              <>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Create Account
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Step 1 of 2 • Personal Info
                </p>
              </>
            )}
            {activeView === 'register-step2' && (
              <>
                <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Set Your Password
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Step 2 of 2 • Almost done!
                </p>
              </>
            )}
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 animate-shake ${
              darkMode 
                ? 'bg-red-500/10 border border-red-500/30' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
              <p className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
            </div>
          )}
          {success && (
            <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${
              darkMode 
                ? 'bg-green-500/10 border border-green-500/30' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${darkMode ? 'text-green-400' : 'text-green-500'}`} />
              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{success}</p>
            </div>
          )}

          {/* Forms Container */}
          <div className={`transition-all duration-300 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            
            {/* LOGIN VIEW */}
            {activeView === 'login' && (
              <div className="space-y-5">
                {/* Google Button */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading || isLoginLoading}
                  className={`w-full flex items-center justify-center gap-3 h-14 rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 ${
                    darkMode
                      ? 'bg-white/5 border border-white/10 text-white active:bg-white/10'
                      : 'bg-white border border-gray-200 text-gray-900 shadow-sm active:bg-gray-50'
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                  <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>or</span>
                  <div className={`flex-1 h-px ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                </div>

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <PremiumInput
                    icon={Mail}
                    type="email"
                    name="loginEmail"
                    value={loginData.email}
                    onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email address"
                    required
                  />
                  
                  <PremiumInput
                    icon={Lock}
                    name="loginPassword"
                    value={loginData.password}
                    onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Password"
                    required
                    isPassword
                    showToggle
                    showPasswordState={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />

                  {/* Forgot Password */}
                  <div className="flex justify-end">
                    <Link 
                      href="/forgot-password" 
                      className={`text-sm font-semibold ${
                        darkMode ? 'text-cyan-400 active:text-cyan-300' : 'text-cyan-600 active:text-cyan-700'
                      }`}
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoginLoading}
                    className="w-full h-14 rounded-2xl font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-70 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                  >
                    {isLoginLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* REGISTER STEP 1 */}
            {activeView === 'register' && (
              <form onSubmit={handleRegisterStep1} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <PremiumInput
                    icon={User}
                    name="firstName"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="First name"
                    required
                  />
                  <PremiumInput
                    icon={User}
                    name="lastName"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Last name"
                    required
                  />
                </div>
                
                <PremiumInput
                  icon={Mail}
                  type="email"
                  name="registerEmail"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                  required
                />
                
                {/* University Field */}
                <PremiumInput
                  icon={GraduationCap}
                  name="university"
                  value={registerData.university}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="University (optional)"
                />

                {/* Year of Study & Gender Row */}
                <div className="flex gap-3 items-stretch">
                  {/* Year of Study - Custom Modern Dropdown */}
                  <div className="relative flex-[1.3]">
                    <button
                      type="button"
                      onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                      className={`w-full flex items-center h-14 rounded-2xl border-2 transition-all duration-300 ${
                        yearDropdownOpen
                          ? darkMode
                            ? 'bg-gray-800 border-yellow-500/50'
                            : 'bg-white border-yellow-400'
                          : darkMode 
                            ? 'bg-gray-800/80 border-gray-700/50 hover:border-gray-600' 
                            : 'bg-white/90 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`flex-shrink-0 flex items-center justify-center w-11 pl-3 transition-colors duration-300 ${
                        yearDropdownOpen
                          ? 'text-yellow-500'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        <Calendar className="w-5 h-5" strokeWidth={1.5} />
                      </div>
                      <span className={`flex-1 text-left text-sm ${
                        registerData.yearOfStudy 
                          ? (darkMode ? 'text-white' : 'text-gray-900')
                          : (darkMode ? 'text-gray-500' : 'text-gray-400')
                      }`}>
                        {registerData.yearOfStudy || 'Year'}
                      </span>
                      <div className={`pr-3 transition-transform duration-300 ${
                        yearDropdownOpen ? 'rotate-180' : ''
                      } ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                    
                    {/* Modern Dropdown Menu */}
                    {yearDropdownOpen && (
                      <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border-2 overflow-hidden z-50 shadow-xl ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-100'
                      }`}>
                        {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year+', 'Graduate'].map((year, index) => (
                          <button
                            key={year}
                            type="button"
                            onClick={() => {
                              setRegisterData(prev => ({ ...prev, yearOfStudy: year }));
                              setYearDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 flex items-center gap-3 ${
                              registerData.yearOfStudy === year
                                ? darkMode
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-yellow-50 text-yellow-600'
                                : darkMode
                                  ? 'text-gray-300 hover:bg-gray-700/50'
                                  : 'text-gray-700 hover:bg-gray-50'
                            } ${index !== 5 ? (darkMode ? 'border-b border-gray-700/50' : 'border-b border-gray-100') : ''}`}
                          >
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              registerData.yearOfStudy === year
                                ? 'border-yellow-500 bg-yellow-500'
                                : darkMode ? 'border-gray-600' : 'border-gray-300'
                            }`}>
                              {registerData.yearOfStudy === year && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </span>
                            {year}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Gender Toggle - Compact */}
                  <button
                    type="button"
                    onClick={handleGenderToggle}
                    className={`w-[115px] flex-shrink-0 h-14 pl-1 pr-2 rounded-2xl font-semibold text-sm border-2 flex items-center justify-center gap-5 ${
                      registerData.gender === 'female'
                        ? darkMode 
                          ? 'bg-pink-500/20 border-pink-500/50' 
                          : 'bg-pink-50/90 border-pink-300'
                        : darkMode 
                          ? 'bg-[#2a4a7a] border-[#4a7ab8]' 
                          : 'bg-blue-50/90 border-blue-300'
                    }`}
                    style={{
                      transition: 'background-color 0.6s ease-in-out, border-color 0.6s ease-in-out'
                    }}
                  >
                    {/* Circle with Bow */}
                    <div className="relative flex-shrink-0 w-9 h-9" style={{ overflow: 'visible' }}>
                      <div 
                        className={`absolute inset-0 rounded-full bg-white transition-all duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                          registerData.gender === 'female'
                            ? 'shadow-[0_0_6px_#ffe2fe]'
                            : 'shadow-[0_0_6px_#dae4ff]'
                        }`}
                      />
                      {/* Bow/Ribbon Icon */}
                      <div 
                        className={`absolute ${
                          bowAnimating 
                            ? (bowDirection === 'toFemale' ? 'bow-animate-to-top' : 'bow-animate-to-bottom')
                            : (registerData.gender === 'female' ? 'bow-position-top' : 'bow-position-bottom')
                        }`}
                        style={{
                          top: '50%',
                          left: '50%'
                        }}
                      >
                        <svg width="12" height="8" viewBox="0 0 24 14" fill="none" className="bow-color-transition">
                          <path 
                            d="M0 2C0 0.9 0.9 0 2 0C4.5 0 7 1.5 9 4V10C7 12.5 4.5 14 2 14C0.9 14 0 13.1 0 12V2Z" 
                            fill={registerData.gender === 'female' ? '#e91e63' : '#7aa0ff'}
                          />
                          <path 
                            d="M24 2C24 0.9 23.1 0 22 0C19.5 0 17 1.5 15 4V10C17 12.5 19.5 14 22 14C23.1 14 24 13.1 24 12V2Z" 
                            fill={registerData.gender === 'female' ? '#e91e63' : '#7aa0ff'}
                          />
                          <rect x="9" y="3" width="6" height="8" rx="1.5" fill="white"/>
                          <rect x="9.5" y="3.5" width="5" height="7" rx="1" stroke={registerData.gender === 'female' ? '#e91e63' : '#7aa0ff'} strokeWidth="1" fill="none"/>
                        </svg>
                      </div>
                    </div>
                    {/* Animated Gender Text - matching desktop */}
                    <div className="relative inline-flex items-center">
                      {/* "Fe" part - positioned absolutely so male stays fixed */}
                      <span 
                        className="uppercase font-bold tracking-wide text-[11px] absolute right-full"
                        style={{ 
                          color: '#e91e63',
                          opacity: registerData.gender === 'female' ? 1 : 0,
                          transition: 'opacity 0.3s ease-in-out'
                        }}
                      >
                        Fe
                      </span>
                      {/* "male" part - stays fixed, each letter changes color individually */}
                      <span className="uppercase font-bold tracking-wide text-[11px] inline-flex">
                        {['m', 'a', 'l', 'e'].map((letter, index) => (
                          <span
                            key={letter + index}
                            style={{
                              color: registerData.gender === 'female' ? '#e91e63' : '#7aa0ff',
                              transition: 'color 0.25s ease-in-out',
                              transitionDelay: registerData.gender === 'female' 
                                ? `${0.3 + index * 0.08}s`
                                : `${0.05 + (3 - index) * 0.08}s`
                            }}
                          >
                            {letter}
                          </span>
                        ))}
                      </span>
                    </div>
                  </button>
                </div>

                {/* Spacer */}
                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full h-14 rounded-2xl font-bold text-white transition-all duration-300 active:scale-[0.98] bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {/* REGISTER STEP 2 */}
            {activeView === 'register-step2' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <PremiumInput
                  icon={Lock}
                  name="registerPassword"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Create password"
                  required
                  isPassword
                  showToggle
                  showPasswordState={showPassword}
                  onTogglePassword={() => setShowPassword(!showPassword)}
                />
                
                {/* Password Strength Indicator */}
                {registerData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Password strength
                      </span>
                      <span className={`text-xs font-semibold ${
                        strengthInfo.label === 'Weak' ? 'text-red-500' :
                        strengthInfo.label === 'Fair' ? 'text-yellow-500' :
                        strengthInfo.label === 'Good' ? 'text-blue-500' :
                        'text-green-500'
                      }`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${strengthInfo.color}`}
                        style={{ width: `${passwordStrength}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[
                        { test: registerData.password.length >= 8, label: '8+ chars' },
                        { test: /[A-Z]/.test(registerData.password), label: 'Uppercase' },
                        { test: /[0-9]/.test(registerData.password), label: 'Number' },
                        { test: /[!@#$%^&*]/.test(registerData.password), label: 'Special' },
                      ].map((req, i) => (
                        <span 
                          key={i}
                          className={`text-xs px-2 py-1 rounded-full transition-colors ${
                            req.test 
                              ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                              : darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {req.test ? '✓' : '○'} {req.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <PremiumInput
                  icon={Lock}
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                  required
                  isPassword
                  showToggle
                  showPasswordState={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                />
                
                {/* Password Match Indicator */}
                {registerData.confirmPassword && (
                  <div className={`flex items-center gap-2 text-sm ${
                    registerData.password === registerData.confirmPassword
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}>
                    {registerData.password === registerData.confirmPassword ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Passwords don't match
                      </>
                    )}
                  </div>
                )}

                {/* Terms Agreement */}
                <div 
                  className={`flex items-start gap-3 p-4 rounded-2xl transition-colors ${
                    darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}
                  onClick={() => setRegisterData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                >
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    registerData.agreeToTerms 
                      ? 'bg-gradient-to-br from-yellow-500 to-orange-500 border-transparent' 
                      : darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    {registerData.agreeToTerms && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to UniShare's{' '}
                    <Link href="/info/terms" className={`font-semibold underline ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Terms
                    </Link>
                    {' '}and{' '}
                    <Link href="/info/privacy" className={`font-semibold underline ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Privacy Policy
                    </Link>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isRegisterLoading}
                  className="w-full h-14 rounded-2xl font-bold text-white transition-all duration-300 active:scale-[0.98] disabled:opacity-70 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 shadow-lg shadow-yellow-500/25 flex items-center justify-center gap-2"
                >
                  {isRegisterLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="py-6">
          {activeView === 'login' ? (
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button 
                onClick={() => switchView('register')}
                className={`font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <button 
                onClick={() => switchView('login')}
                className={`font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className={`text-center text-xs pb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          © {new Date().getFullYear()} UniShare. All rights reserved.
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes bowToTop {
          0% { transform: translate(-6px, 8px) rotate(0deg); }
          25% { transform: translate(4px, 2px) rotate(-45deg); }
          50% { transform: translate(6px, -8px) rotate(-90deg); }
          75% { transform: translate(4px, -14px) rotate(-120deg); }
          100% { transform: translate(2px, -18px) rotate(-135deg); }
        }
        
        @keyframes bowToBottom {
          0% { transform: translate(2px, -18px) rotate(-135deg); }
          25% { transform: translate(4px, -12px) rotate(-90deg); }
          50% { transform: translate(6px, -4px) rotate(-45deg); }
          75% { transform: translate(2px, 4px) rotate(-15deg); }
          100% { transform: translate(-6px, 8px) rotate(0deg); }
        }
        
        .bow-animate-to-top {
          animation: bowToTop 0.5s ease-out forwards !important;
        }
        
        .bow-animate-to-bottom {
          animation: bowToBottom 0.5s ease-out forwards !important;
        }
        
        .bow-position-top {
          transform: translate(2px, -18px) rotate(-135deg);
        }
        
        .bow-position-bottom {
          transform: translate(-6px, 8px) rotate(0deg);
        }
        
        .bow-color-transition path,
        .bow-color-transition rect {
          transition: fill 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        
        .pt-safe {
          padding-top: max(env(safe-area-inset-top), 1rem);
        }
        
        .pb-safe {
          padding-bottom: max(env(safe-area-inset-bottom), 1rem);
        }
      `}</style>
    </div>
  );
};

export default MobileLoginPage;
