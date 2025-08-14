"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  BookOpen,
  Github,
  ArrowLeft,
  Chrome,
  Smartphone,
  Globe,
  Car,
  Home,
  Briefcase
} from 'lucide-react';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    college: '',
    year: '',
    branch: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (!isLoginMode && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      setLoading(false);
      return;
    }
    
    if (formData.email && formData.password) {
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/profile'; // Redirect to profile page
    } else {
      alert('Please fill in all required fields');
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Back Button */}
          <Link 
            href="/" 
            className={`inline-flex items-center gap-2 mb-8 text-sm font-medium transition-all duration-300 hover:scale-105 ${
              darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <span className="text-4xl font-bold">
                <span className={darkMode ? 'text-yellow-300' : 'text-yellow-500'}>Uni</span>
                <span className={darkMode ? 'text-sky-300' : 'text-sky-500'}>Share</span>
              </span>
            </div>
            <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {isLoginMode ? 'Welcome Back!' : 'Join Our Community'}
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {isLoginMode 
                ? 'Sign in to access your campus community' 
                : 'Create your account and connect with fellow students'
              }
            </p>
          </div>

          {/* Main Form Card */}
          <div className={`rounded-3xl border-2 p-8 backdrop-blur-xl shadow-2xl ${
            darkMode 
              ? 'bg-gray-800/90 border-gray-700/50' 
              : 'bg-white/90 border-gray-200/50'
          }`}>
            
            {/* Social Login Options */}
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Google', color: 'from-red-500 to-red-600', icon: Chrome },
                  { name: 'GitHub', color: 'from-gray-700 to-gray-800', icon: Github },
                  { name: 'Microsoft', color: 'from-blue-500 to-blue-600', icon: Globe }
                ].map((provider, index) => (
                  <button
                    key={index}
                    className={`flex items-center justify-center h-12 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                      darkMode 
                        ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-600/50' 
                        : 'border-gray-300 bg-white/50 hover:bg-gray-50'
                    }`}
                  >
                    {typeof provider.icon === 'string' ? (
                      <span className="text-xl">{provider.icon}</span>
                    ) : (
                      <provider.icon className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-4 font-medium ${
                    darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                  }`}>
                    Or continue with email
                  </span>
                </div>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Registration-only fields */}
              {!isLoginMode && (
                <>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                        } outline-none placeholder-gray-500`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Academic Year
                      </label>
                      <select
                        value={formData.year}
                        onChange={(e) => handleInputChange('year', e.target.value)}
                        className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                        } outline-none`}
                      >
                        <option value="">Select Year</option>
                        <option value="Freshman">Freshman</option>
                        <option value="Sophomore">Sophomore</option>
                        <option value="Junior">Junior</option>
                        <option value="Senior">Senior</option>
                        <option value="Graduate">Graduate</option>
                        <option value="PhD">PhD</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                            darkMode 
                              ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                              : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                          } outline-none placeholder-gray-500`}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      College/University *
                    </label>
                    <div className="relative">
                      <BookOpen className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => handleInputChange('college', e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                          darkMode 
                            ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                            : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                        } outline-none placeholder-gray-500`}
                        placeholder="Enter your college/university name"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email field */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                        : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                    } outline-none placeholder-gray-500`}
                    placeholder="Enter your college email"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Password *
                </label>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                      darkMode 
                        ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                        : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                    } outline-none placeholder-gray-500`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password for registration */}
              {!isLoginMode && (
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-12 pr-12 py-4 rounded-xl border-2 transition-all duration-300 focus:ring-4 ${
                        darkMode 
                          ? 'bg-gray-700/50 border-gray-600 text-white focus:border-yellow-400 focus:ring-yellow-400/20' 
                          : 'bg-white/50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500/20'
                      } outline-none placeholder-gray-500`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                        darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Terms and Privacy for registration */}
              {!isLoginMode && (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="terms" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    I agree to the{' '}
                    <Link href="/terms" className={`font-semibold ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className={`font-semibold ${darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl ${
                  darkMode 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-yellow-400/25' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-500/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    {isLoginMode ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLoginMode ? 'Sign In to UniShare' : 'Create My Account'
                )}
              </button>
            </form>

            {/* Toggle between login/register */}
            <div className="mt-8 text-center">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isLoginMode ? "Don't have an account?" : "Already have an account?"}
              </p>
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className={`mt-2 text-lg font-bold transition-all duration-300 hover:scale-105 ${
                  darkMode ? 'text-yellow-400 hover:text-yellow-300' : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {isLoginMode ? 'Create Account' : 'Sign In Instead'}
              </button>
            </div>

            {/* Forgot Password for login */}
            {isLoginMode && (
              <div className="mt-6 text-center">
                <Link 
                  href="/forgot-password"
                  className={`text-sm font-medium transition-colors duration-300 ${
                    darkMode ? 'text-gray-400 hover:text-yellow-400' : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Forgot your password?
                </Link>
              </div>
            )}
          </div>

          {/* Benefits section for registration */}
          {!isLoginMode && (
            <div className={`mt-8 p-6 rounded-2xl ${
              darkMode ? 'bg-gray-800/50' : 'bg-white/50'
            }`}>
              <h3 className={`text-lg font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Why Join UniShare?
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { icon: Car, text: 'Share rides & save money' },
                  { icon: BookOpen, text: 'Buy/sell textbooks easily' },
                  { icon: Home, text: 'Find perfect roommates' },
                  { icon: Briefcase, text: 'Access study resources' }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <benefit.icon className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {benefit.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
