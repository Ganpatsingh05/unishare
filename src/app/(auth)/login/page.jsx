"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, GraduationCap, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { startGoogleLogin, loginWithEmail, registerWithEmail, fetchCurrentUser } from "./../../lib/api";
import { useUI, useAuth } from "./../../lib/contexts/UniShareContext";
import SmallFooter from "../../_components/layout/SmallFooter";
import MobileLoginPage from "./MobileLoginPage";

// ═══════════════════════════════════════════════════════════════════════════════
// CINEMATIC CAMPUS GATE LOGIN
// ═══════════════════════════════════════════════════════════════════════════════
const LoginPage = () => {
  const router = useRouter();
  const { darkMode } = useUI();
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();

  // ─── UI State ─────────────────────────────────────────────────────────
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const [isMobile, setIsMobile] = useState(false);

  // ─── Cinematic State ──────────────────────────────────────────────────
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [sceneReady, setSceneReady] = useState(false);
  const [gateOpening, setGateOpening] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const sceneRef = useRef(null);

  // ─── Form State ───────────────────────────────────────────────────────
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', university: '',
    gender: 'male', password: '', confirmPassword: '', agreeToTerms: false
  });
  const [bowAnimating, setBowAnimating] = useState(false);
  const [bowDirection, setBowDirection] = useState('toFemale');

  // ─── Effects ──────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Scene entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setSceneReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const redirectUrl = searchParams.get('redirect');

  useEffect(() => {
    if (isAuthenticated && user) {
      const targetUrl = redirectUrl || '/';
      router.push(targetUrl === '/login' ? '/' : targetUrl);
    }
  }, [isAuthenticated, user, router, redirectUrl]);

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    if (!sceneRef.current) return;
    const rect = sceneRef.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  if (isMobile) return <MobileLoginPage />;

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleGenderToggle = () => {
    const g = registerData.gender === 'male' ? 'female' : 'male';
    setBowDirection(g === 'female' ? 'toFemale' : 'toMale');
    setBowAnimating(true);
    setRegisterData(p => ({ ...p, gender: g }));
    setTimeout(() => setBowAnimating(false), 550);
  };

  const triggerGateOpen = (redirectTo) => {
    setAccessGranted(true);
    setTimeout(() => {
      setGateOpening(true);
      setTimeout(() => {
        router.push(redirectTo);
      }, 1400);
    }, 800);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!loginData.email || !loginData.password) { setError('Please fill in all fields'); return; }
    setIsLoginLoading(true);
    try {
      const r = await loginWithEmail(loginData.email, loginData.password);
      if (r.success) {
        setSuccess('Access Granted!');
        const u = await fetchCurrentUser();
        if (u) triggerGateOpen(searchParams.get('redirect') || '/');
      } else setError(r.message || 'Login failed. Please check your credentials.');
    } catch (err) { setError('An error occurred. Please try again.'); }
    finally { setIsLoginLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.confirmPassword) { setError('Please fill in all required fields'); return; }
    if (registerData.password !== registerData.confirmPassword) { setError('Passwords do not match'); return; }
    if (registerData.password.length < 8) { setError('Password must be at least 8 characters long'); return; }
    if (!/[A-Z]/.test(registerData.password)) { setError('Password must contain at least one uppercase letter'); return; }
    if (!/[a-z]/.test(registerData.password)) { setError('Password must contain at least one lowercase letter'); return; }
    if (!/[0-9]/.test(registerData.password)) { setError('Password must contain at least one number'); return; }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(registerData.password)) { setError('Password must contain at least one special character'); return; }
    if (!registerData.agreeToTerms) { setError('Please agree to the Terms of Service and Privacy Policy'); return; }
    setIsRegisterLoading(true);
    try {
      const r = await registerWithEmail({ firstName: registerData.firstName, lastName: registerData.lastName, email: registerData.email, password: registerData.password, university: registerData.university });
      if (r.success) {
        setSuccess('Account created! Please check your email for verification.');
        setRegisterData({ firstName: '', lastName: '', email: '', university: '', password: '', confirmPassword: '', agreeToTerms: false, gender: 'male' });
      } else setError(r.message || 'Registration failed. Please try again.');
    } catch (err) { setError('An error occurred. Please try again.'); }
    finally { setIsRegisterLoading(false); }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const r = searchParams.get('redirect');
    if (r) sessionStorage.setItem('oauth_redirect', r);
    try { startGoogleLogin(); } catch (err) { setIsLoading(false); }
  };

  const switchTab = (t) => { setActiveTab(t); setError(''); setSuccess(''); };

  // ─── Password strength ────────────────────────────────────────────────
  const pwC = [
    registerData.password.length >= 8, /[A-Z]/.test(registerData.password),
    /[a-z]/.test(registerData.password), /[0-9]/.test(registerData.password),
    /[!@#$%^&*(),.?":{}|<>]/.test(registerData.password)
  ];
  const pwS = pwC.filter(Boolean).length;
  const pwL = pwS === 5 ? 'Strong' : pwS >= 3 ? 'Medium' : pwS >= 1 ? 'Weak' : '';
  const pwCol = pwS === 5 ? 'green' : pwS >= 3 ? 'yellow' : 'red';

  // ─── Parallax offsets ─────────────────────────────────────────────────
  const px = (mousePos.x - 0.5);
  const py = (mousePos.y - 0.5);

  const inputCls = `w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none bg-white/15 border-white/25 text-white placeholder-white/60 focus:border-cyan-400 focus:bg-white/20 focus:outline-0`;
  const inputSmCls = `w-full pl-9 pr-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none bg-white/15 border-white/25 text-white placeholder-white/60 focus:border-cyan-400 focus:bg-white/20 focus:outline-0`;

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════════════════
  return (
    <>
      <div
        ref={sceneRef}
        onMouseMove={handleMouseMove}
        className={`fixed inset-0 overflow-hidden cursor-default transition-opacity duration-1000 ${sceneReady ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* ── LAYER 1: Sky Background ──────────────────────────────────── */}
        <div
          className="absolute inset-0 transition-transform duration-[1500ms] ease-out"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #533483 80%, #e94560 95%, #ff6b6b 100%)',
            transform: `translate(${px * -5}px, ${py * -5}px) scale(1.1)`,
          }}
        />

        {/* Stars */}
        <div className="absolute inset-0 overflow-hidden" style={{ transform: `translate(${px * -8}px, ${py * -8}px)` }}>
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${1 + Math.random() * 2}px`,
                height: `${1 + Math.random() * 2}px`,
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.5,
                animation: `starTwinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Clouds */}
        <div className="absolute w-[200%] h-[30%] top-[5%] opacity-20" style={{ animation: 'cloudDrift 60s linear infinite' }}>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white/30 blur-2xl"
              style={{
                width: `${150 + Math.random() * 200}px`,
                height: `${40 + Math.random() * 40}px`,
                top: `${Math.random() * 100}%`,
                left: `${i * 17}%`,
              }}
            />
          ))}
        </div>

        {/* ── LAYER 2: Campus Background Image ─────────────────────────── */}
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-out"
          style={{ transform: `translate(${px * -15}px, ${py * -10}px) scale(1.15)` }}
        >
          <Image
            src="/images/backgrounds/campus-gate.jpg"
            alt="Campus Gate"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Cinematic color grading overlay — stronger in light mode for text contrast */}
          <div className="absolute inset-0" style={{
            background: darkMode
              ? 'linear-gradient(180deg, rgba(26,26,46,0.4) 0%, rgba(15,52,96,0.3) 40%, rgba(0,0,0,0.5) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,20,0.6) 40%, rgba(0,0,0,0.75) 100%)',
          }} />
        </div>

        {/* ── LAYER 3: Birds ───────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${8 + i * 5}%`,
                animation: `birdFly ${12 + i * 4}s linear infinite`,
                animationDelay: `${i * 3}s`,
                opacity: 0.6 - i * 0.08,
              }}
            >
              <svg width={20 + i * 4} height={10 + i * 2} viewBox="0 0 30 15" fill="none">
                <path d="M15 8 C12 2, 5 0, 0 4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" style={{ animation: `wingFlap ${0.4 + i * 0.1}s ease-in-out infinite` }} />
                <path d="M15 8 C18 2, 25 0, 30 4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" style={{ animation: `wingFlap ${0.4 + i * 0.1}s ease-in-out infinite reverse` }} />
              </svg>
            </div>
          ))}
        </div>

        {/* ── LAYER 4: Floating Light Particles ────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: i % 3 === 0 ? 'rgba(250,204,21,0.6)' : 'rgba(56,189,248,0.5)',
                top: `${30 + Math.random() * 60}%`,
                left: `${Math.random() * 100}%`,
                animation: `particleFloat ${4 + Math.random() * 6}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
                filter: 'blur(0.5px)',
              }}
            />
          ))}
        </div>

        {/* ── LAYER 5: Gate Pillars (Foreground) ───────────────────────── */}
        {/* Left Pillar */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[8%] xl:w-[12%] transition-all duration-[1200ms] ease-out z-20"
          style={{
            transform: gateOpening
              ? `translateX(-120%) translate(${px * 25}px, ${py * 5}px)`
              : `translate(${px * 25}px, ${py * 5}px)`,
            background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)',
            }}
          />
        </div>
        {/* Right Pillar */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[8%] xl:w-[12%] transition-all duration-[1200ms] ease-out z-20"
          style={{
            transform: gateOpening
              ? `translateX(120%) translate(${px * 25}px, ${py * 5}px)`
              : `translate(${px * 25}px, ${py * 5}px)`,
            background: 'linear-gradient(270deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 21px)',
            }}
          />
        </div>

        {/* ── LAYER 6: Bottom Vignette ─────────────────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[35%] z-10"
          style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)' }}
        />

        {/* ── ZOOM EFFECT ON GATE OPEN ──────────────────────────────── */}
        <div
          className="absolute inset-0 transition-all z-30 pointer-events-none"
          style={{
            backgroundColor: gateOpening ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0)',
            transitionDuration: '1200ms',
            transitionDelay: '400ms',
          }}
        />

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* HOLOGRAPHIC LOGIN PANEL                                         */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center transition-all duration-700 ${
            gateOpening ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
          style={{ transform: `translate(${px * 5}px, ${py * 5}px)` }}
        >
          <div
            className={`relative w-[420px] max-w-[92vw] transition-all duration-700 ${
              sceneReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            {/* Holo glow behind card */}
            <div className="absolute -inset-4 rounded-3xl opacity-40 blur-xl"
              style={{
                background: accessGranted
                  ? 'radial-gradient(circle, rgba(52,211,153,0.5), transparent 70%)'
                  : 'radial-gradient(circle, rgba(56,189,248,0.3), rgba(250,204,21,0.15), transparent 70%)',
                transition: 'background 0.6s',
              }}
            />

            {/* Scan line effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-10">
              <div className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                }}
              />
              <div className="absolute w-full h-[2px] bg-cyan-400/20"
                style={{ animation: 'holoScan 3s ease-in-out infinite' }}
              />
            </div>

            {/* Main Card — solid opaque background so text is always readable */}
            <div className="relative rounded-2xl border border-white/20 overflow-hidden"
              style={{
                background: accessGranted
                  ? '#0d2e20'
                  : '#080e1f',
                boxShadow: '0 8px 64px rgba(0,0,0,0.7)',
                transition: 'background 0.6s',
              }}
            >
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: accessGranted
                    ? '0 0 30px rgba(52,211,153,0.3), inset 0 0 30px rgba(52,211,153,0.05)'
                    : '0 0 20px rgba(56,189,248,0.15), inset 0 0 20px rgba(56,189,248,0.03)',
                  transition: 'box-shadow 0.6s',
                }}
              />

              <div className="relative z-10 p-8">
                {/* ── Welcome Header ────────────────────────────────── */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10 border border-white/10 backdrop-blur">
                      <Image src="/images/logos/logounishare1.png" alt="UniShare" width={36} height={36} className="rounded-lg" />
                    </div>
                  </div>
                  <p className="text-cyan-300 text-xs font-mono tracking-[0.3em] uppercase mb-2"
                    style={{ animation: sceneReady ? 'none' : undefined }}
                  >
                    Welcome To
                  </p>
                  <h1 className="text-3xl font-bold text-white tracking-tight">
                    UniShare
                  </h1>
                  <p className="text-white/75 text-sm mt-1">Your Campus. Connected.</p>
                </div>

                {/* ── Tab Switcher ───────────────────────────────────── */}
                <div className="relative flex rounded-xl p-1 mb-5 bg-white/5 border border-white/10">
                  <div
                    className="absolute top-1 bottom-1 rounded-lg transition-all duration-300 ease-out bg-white/10"
                    style={{
                      width: 'calc(50% - 4px)',
                      left: activeTab === 'login' ? '4px' : 'calc(50%)',
                    }}
                  />
                  {['login', 'register'].map(t => (
                    <button
                      key={t} type="button" onClick={() => switchTab(t)}
                      className={`relative flex-1 py-2 text-sm font-medium rounded-lg transition-colors duration-200 z-10 ${
                        activeTab === t ? 'text-white' : 'text-white/60 hover:text-white/80'
                      }`}
                    >
                      {t === 'login' ? 'Sign In' : 'Sign Up'}
                    </button>
                  ))}
                </div>

                {/* ── Messages ───────────────────────────────────────── */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-red-500/15 border border-red-500/20 text-red-300">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-4 p-3 rounded-lg flex items-center gap-2 text-sm bg-emerald-500/15 border border-emerald-500/20 text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{success}</span>
                  </div>
                )}

                {/* ── Google Login ───────────────────────────────────── */}
                <button
                  onClick={handleGoogleLogin} disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-lg font-medium transition-all duration-200 mb-4 disabled:opacity-50 bg-white/10 hover:bg-white/15 text-white border border-white/20 hover:border-white/30"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-t-transparent border-white/60 rounded-full animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center mb-4">
                  <div className="flex-1 h-px bg-white/20" />
                  <span className="px-3 text-xs text-white/60">or</span>
                  <div className="flex-1 h-px bg-white/20" />
                </div>

                {/* ═══════ LOGIN FORM ═══════ */}
                {activeTab === 'login' && (
                  <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input type="email" value={loginData.email} onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} placeholder="your.email@university.edu" className={inputCls} required />
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 z-10">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input type={showPassword ? 'text' : 'password'} value={loginData.password} onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} placeholder="Enter your password" className={`${inputCls} !pr-10`} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white z-10">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-4 h-4 rounded border border-white/20 bg-white/5 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all">
                          <CheckCircle2 className="w-full h-full text-white opacity-0 peer-checked:opacity-100 p-[1px]" />
                        </div>
                        <span className="ml-2 text-xs text-white/75">Remember me</span>
                      </label>
                      <Link href="/forgot-password" className="text-xs text-cyan-300 hover:text-white">Forgot password?</Link>
                    </div>
                    <button
                      type="submit" disabled={isLoginLoading}
                      className="w-full font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 text-white border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                      style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.3), rgba(250,204,21,0.15))' }}
                    >
                      {isLoginLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /><span>Verifying...</span></>
                      ) : (
                        <><span>Enter Campus</span><ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-white/70">
                      Don't have an account?{' '}
                      <button type="button" onClick={() => switchTab('register')} className="text-cyan-300 hover:text-white font-medium">Sign up</button>
                    </p>
                  </form>
                )}

                {/* ═══════ REGISTER FORM ═══════ */}
                {activeTab === 'register' && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2.5">
                      {[['firstName', 'First'], ['lastName', 'Last']].map(([field, ph]) => (
                        <div key={field} className="relative">
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 z-10">
                            <User className="w-3.5 h-3.5" />
                          </div>
                          <input type="text" value={registerData[field]} onChange={e => setRegisterData(p => ({ ...p, [field]: e.target.value }))} placeholder={ph} className={inputSmCls} required />
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input type="email" value={registerData.email} onChange={e => setRegisterData(p => ({ ...p, email: e.target.value }))} placeholder="yourmail@gmail.com" className={inputCls} required />
                    </div>
                    <div className="flex gap-2.5 items-end">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 z-10">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <input type="text" value={registerData.university} onChange={e => setRegisterData(p => ({ ...p, university: e.target.value }))} placeholder="University name" className={inputCls} />
                      </div>
                      {/* Gender Toggle */}
                      <div className="relative" style={{ overflow: 'visible' }}>
                        <button type="button" onClick={handleGenderToggle}
                          className={`h-[44px] w-[105px] pl-1 pr-1.5 rounded-full font-semibold text-xs border flex items-center gap-3 ${
                            registerData.gender === 'female'
                              ? 'bg-pink-500/20 border-pink-500/40 text-pink-300'
                              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                          }`}
                          style={{ transition: 'background-color 0.6s, border-color 0.6s', overflow: 'visible' }}
                        >
                          <div className="relative flex-shrink-0" style={{ overflow: 'visible' }}>
                            <div className={`w-9 h-9 rounded-full bg-white/90 transition-all duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                              registerData.gender === 'female'
                                ? 'shadow-[0_1px_4px_rgba(233,30,99,0.35)] border border-pink-300 rotate-[-135deg]'
                                : 'shadow-[0_1px_4px_rgba(56,189,248,0.35)] border border-cyan-300 rotate-0'
                            }`} />
                            <div className={`absolute ${bowAnimating ? (bowDirection === 'toFemale' ? 'bow-animate-to-top' : 'bow-animate-to-bottom') : (registerData.gender === 'female' ? 'bow-position-top' : 'bow-position-bottom')}`} style={{ top: '50%', left: '50%' }}>
                              <svg width="16" height="10" viewBox="0 0 24 14" fill="none" className="bow-color-transition">
                                <style>{`.bow-color-transition path,.bow-color-transition rect{transition:fill 0.45s cubic-bezier(0.34,1.56,0.64,1),stroke 0.45s cubic-bezier(0.34,1.56,0.64,1)}`}</style>
                                <path d="M0 2C0 0.9 0.9 0 2 0C4.5 0 7 1.5 9 4V10C7 12.5 4.5 14 2 14C0.9 14 0 13.1 0 12V2Z" fill={registerData.gender === 'female' ? '#e91e63' : '#67e8f9'} />
                                <path d="M24 2C24 0.9 23.1 0 22 0C19.5 0 17 1.5 15 4V10C17 12.5 19.5 14 22 14C23.1 14 24 13.1 24 12V2Z" fill={registerData.gender === 'female' ? '#e91e63' : '#67e8f9'} />
                                <rect x="9" y="3" width="6" height="8" rx="1.5" fill="white" />
                                <rect x="9.5" y="3.5" width="5" height="7" rx="1" stroke={registerData.gender === 'female' ? '#e91e63' : '#67e8f9'} strokeWidth="1" fill="none" />
                              </svg>
                            </div>
                          </div>
                          <div className="relative inline-flex items-center">
                            <span className="uppercase font-bold tracking-wide absolute right-full" style={{ color: '#e91e63', opacity: registerData.gender === 'female' ? 1 : 0, transition: 'opacity 0.3s', fontSize: '10px' }}>FE</span>
                            <span className="uppercase font-bold tracking-wide" style={{ color: registerData.gender === 'female' ? '#e91e63' : '#67e8f9', transition: 'color 0.3s', fontSize: '10px' }}>MALE</span>
                          </div>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="relative">
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 z-10">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input type={showPassword ? 'text' : 'password'} value={registerData.password} onChange={e => setRegisterData(p => ({ ...p, password: e.target.value }))} onFocus={() => setPasswordFocused(true)} onBlur={() => setPasswordFocused(false)} placeholder="Password" className={`${inputSmCls} !pr-8`} required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 z-10">
                          {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 z-10">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input type={showConfirmPassword ? 'text' : 'password'} value={registerData.confirmPassword} onChange={e => setRegisterData(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm" className={`${inputSmCls} !pr-8`} required />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 z-10">
                          {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {passwordFocused && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-white/30">Strength</span>
                          <span className={`text-[10px] font-bold ${pwCol === 'green' ? 'text-emerald-400' : pwCol === 'yellow' ? 'text-yellow-400' : 'text-red-400'}`}>{pwL}</span>
                        </div>
                        <div className="flex gap-0.5">{pwC.map((m, i) => (<div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${m ? (pwCol === 'green' ? 'bg-emerald-500' : pwCol === 'yellow' ? 'bg-yellow-500' : 'bg-red-500') : 'bg-white/10'}`} />))}</div>
                      </div>
                    )}

                    <div className="flex items-start gap-2">
                      <div
                        className={`mt-0.5 w-4 h-4 rounded border cursor-pointer transition-all ${registerData.agreeToTerms ? 'border-cyan-400 bg-cyan-500' : 'border-white/20 bg-white/5'}`}
                        onClick={() => setRegisterData(p => ({ ...p, agreeToTerms: !p.agreeToTerms }))}
                      >
                        <CheckCircle2 className={`w-full h-full text-white p-[1px] transition-opacity ${registerData.agreeToTerms ? 'opacity-100' : 'opacity-0'}`} />
                      </div>
                      <span className="text-xs text-white/40 leading-relaxed">
                        I agree to <Link href="/info/terms" className="text-cyan-400/70 underline">Terms</Link> and <Link href="/info/privacy" className="text-cyan-400/70 underline">Privacy Policy</Link>
                      </span>
                    </div>

                    <button
                      type="submit" disabled={isRegisterLoading}
                      className="w-full font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 text-white border border-cyan-400/30 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                      style={{ background: 'linear-gradient(135deg, rgba(56,189,248,0.3), rgba(250,204,21,0.15))' }}
                    >
                      {isRegisterLoading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /><span>Creating...</span></>
                      ) : (
                        <><span>Create Account</span><ArrowRight className="w-5 h-5" /></>
                      )}
                    </button>
                    <p className="text-center text-xs text-white/30">
                      Already have an account?{' '}
                      <button type="button" onClick={() => switchTab('login')} className="text-cyan-400/70 hover:text-cyan-400 font-medium">Sign in</button>
                    </p>
                  </form>
                )}

                {/* Footer */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <SmallFooter />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ANIMATIONS                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        @keyframes cloudDrift {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes birdFly {
          0% { left: -5%; opacity: 0; }
          5% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { left: 105%; opacity: 0; }
        }
        @keyframes wingFlap {
          0%, 100% { d: path("M15 8 C12 2, 5 0, 0 4"); }
          50% { d: path("M15 8 C12 6, 5 7, 0 8"); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.4; }
          25% { transform: translateY(-20px) translateX(5px); opacity: 0.7; }
          50% { transform: translateY(-35px) translateX(-5px); opacity: 0.5; }
          75% { transform: translateY(-15px) translateX(8px); opacity: 0.8; }
        }
        @keyframes holoScan {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        @keyframes bowToTop {
          0% { transform: translate(-50%, 70%) rotate(0deg); }
          20% { transform: translate(5%, 30%) rotate(-30deg); }
          40% { transform: translate(35%, -20%) rotate(-65deg); }
          60% { transform: translate(40%, -80%) rotate(-100deg); }
          80% { transform: translate(28%, -145%) rotate(-142deg); }
          90% { transform: translate(32%, -125%) rotate(-132deg); }
          100% { transform: translate(30%, -130%) rotate(-135deg); }
        }
        @keyframes bowToBottom {
          0% { transform: translate(30%, -130%) rotate(-135deg); }
          20% { transform: translate(42%, -70%) rotate(-95deg); }
          40% { transform: translate(35%, -15%) rotate(-60deg); }
          60% { transform: translate(5%, 35%) rotate(-25deg); }
          80% { transform: translate(-58%, 82%) rotate(8deg); }
          90% { transform: translate(-48%, 65%) rotate(-5deg); }
          100% { transform: translate(-50%, 70%) rotate(0deg); }
        }
        .bow-animate-to-top { animation: bowToTop 0.5s ease-out forwards !important; }
        .bow-animate-to-bottom { animation: bowToBottom 0.5s ease-out forwards !important; }
        .bow-position-top { transform: translate(30%, -130%) rotate(-135deg); }
        .bow-position-bottom { transform: translate(-50%, 70%) rotate(0deg); }
      `}} />
    </>
  );
};

const LoginPageWrapper = () => (
  <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#1a1a2e] text-white/50">Loading...</div>}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWrapper;
