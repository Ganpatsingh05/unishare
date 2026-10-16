"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader2, Lock, Mail, User } from "lucide-react";
import AuthScene from "@features/auth/AuthScene";
import AuthField from "@features/auth/AuthField";
import {
  AuthAlert,
  AuthCheckbox,
  AuthLegal,
  AuthTabs,
  ProviderButtons,
  StrengthMeter,
} from "@features/auth/AuthControls";
import useAuthFlow from "@features/auth/useAuthFlow";
import { AUTH, linkClass, primaryButtonClass } from "@features/auth/authTheme";

/**
 * The UniShare sign-in surface.
 *
 * One responsive layout rather than a desktop page plus a separate mobile page:
 * the two had drifted into different designs, different theme handling and
 * different register flows, and keeping them in step costs more than a handful
 * of breakpoints does.
 */

const Wordmark = () => (
  <span className="text-[26px] font-extrabold leading-none tracking-[-0.02em] sm:text-[30px]">
    <span style={{ color: AUTH.yellow }}>Uni</span>
    <span style={{ color: AUTH.cyan }}>Share</span>
  </span>
);

const Divider = () => (
  <div className="flex items-center gap-3" aria-hidden="true">
    <span className="h-px flex-1 bg-white/10" />
    <span className="text-[11.5px] uppercase tracking-[0.14em]" style={{ color: AUTH.faint }}>
      or continue with email
    </span>
    <span className="h-px flex-1 bg-white/10" />
  </div>
);

function LoginSurface() {
  const flow = useAuthFlow();
  const { locked, errors, banner } = flow;

  const submitLabel = {
    login: { idle: "Sign in", busy: "Signing in" },
    register: { idle: "Create account", busy: "Creating account" },
    reset: { idle: "Send reset link", busy: "Sending" },
  };

  return (
    <div className="relative min-h-svh w-full overflow-hidden">
      <AuthScene opening={flow.gate === "opening"} granted={flow.gate === "granted"} />

      <main
        className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-4 px-4 py-6 sm:gap-6 sm:px-6 md:py-10"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        <div
          className={`w-full max-w-[440px] transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            flow.gate === "idle" ? "translate-y-0 opacity-100" : "-translate-y-4 scale-[1.02] opacity-0"
          }`}
        >
          {/* Brand */}
          <header className="mb-5 flex flex-col items-center text-center sm:mb-6">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06] backdrop-blur-sm sm:mb-4 sm:h-14 sm:w-14">
              <Image
                src="/images/logos/logounishare1.png"
                alt=""
                width={34}
                height={34}
                className="rounded-lg"
                priority
              />
            </div>
            <h1>
              <Wordmark />
            </h1>
            <p className="mt-1.5 max-w-[34ch] text-[13px] leading-relaxed sm:text-[13.5px]" style={{ color: AUTH.body }}>
              Marketplace, rides, housing and notes — one account for campus.
            </p>
          </header>

          {/* Card */}
          <div
            className="rounded-2xl border p-4 shadow-[0_30px_80px_-24px_rgba(0,0,0,0.9)] sm:p-7"
            style={{
              borderColor: AUTH.hairline,
              background: flow.gate === "granted" ? AUTH.panelGranted : AUTH.panel,
              transition: "background 600ms ease-out",
            }}
          >
            {flow.view === "reset" ? (
              /* ── Password reset request ─────────────────────────────── */
              <div className="space-y-4 sm:space-y-5">
                <button
                  type="button"
                  onClick={flow.closeReset}
                  className="inline-flex items-center gap-1.5 rounded text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/45"
                  style={{ color: AUTH.body }}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to sign in
                </button>

                <div>
                  <h2 className="text-[19px] font-semibold" style={{ color: AUTH.title }}>
                    Reset your password
                  </h2>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: AUTH.body }}>
                    Enter the email on your account and we will send you a link to set a new password.
                  </p>
                </div>

                <AuthAlert tone={banner?.tone}>{banner?.text}</AuthAlert>

                <form onSubmit={flow.submitReset} className="space-y-4" noValidate>
                  <AuthField
                    label="Email address"
                    icon={Mail}
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@university.edu"
                    value={flow.resetData.email}
                    onChange={(event) => flow.setResetField("email", event.target.value)}
                    error={errors.email}
                    disabled={locked}
                  />

                  <button type="submit" className={primaryButtonClass} disabled={locked}>
                    {flow.busy === "reset" ? (
                      <>
                        <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
                        <span>{submitLabel.reset.busy}</span>
                      </>
                    ) : (
                      <>
                        <span>{submitLabel.reset.idle}</span>
                        <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* ── Sign in / create account ───────────────────────────── */
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <h2 className="text-[19px] font-semibold" style={{ color: AUTH.title }}>
                    {flow.tab === "login" ? "Welcome back" : "Join UniShare"}
                  </h2>
                  <p className="mt-1.5 text-[13px]" style={{ color: AUTH.body }}>
                    {flow.tab === "login"
                      ? "Sign in to pick up where you left off."
                      : "Create your account — it takes a moment."}
                  </p>
                </div>

                <AuthTabs value={flow.tab} onChange={flow.setTab} disabled={locked} />

                <AuthAlert tone={banner?.tone}>{banner?.text}</AuthAlert>

                <div className="space-y-5">
                  <ProviderButtons
                    onGoogle={() => flow.signInWithProvider("google")}
                    onGithub={() => flow.signInWithProvider("github")}
                    busy={flow.busy}
                    disabled={locked}
                  />
                  <Divider />
                </div>

                {flow.tab === "login" ? (
                  <form onSubmit={flow.submitLogin} className="space-y-4" noValidate>
                    <AuthField
                      label="Email address"
                      icon={Mail}
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@university.edu"
                      value={flow.loginData.email}
                      onChange={(event) => flow.setLoginField("email", event.target.value)}
                      error={errors.email}
                      disabled={locked}
                    />

                    <AuthField
                      label="Password"
                      icon={Lock}
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Your password"
                      value={flow.loginData.password}
                      onChange={(event) => flow.setLoginField("password", event.target.value)}
                      error={errors.password}
                      disabled={locked}
                      hint={
                        <button
                          type="button"
                          onClick={flow.openReset}
                          className={`text-[12.5px] ${linkClass}`}
                        >
                          Forgot password?
                        </button>
                      }
                    />

                    <button type="submit" className={primaryButtonClass} disabled={locked}>
                      {flow.busy === "login" ? (
                        <>
                          <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
                          <span>{submitLabel.login.busy}</span>
                        </>
                      ) : (
                        <>
                          <span>{submitLabel.login.idle}</span>
                          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[13px]" style={{ color: AUTH.body }}>
                      New to UniShare?{" "}
                      <button type="button" onClick={() => flow.setTab("register")} className={linkClass}>
                        Create an account
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={flow.submitRegister} className="space-y-4" noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <AuthField
                        label="First name"
                        icon={User}
                        name="given-name"
                        autoComplete="given-name"
                        placeholder="Aarav"
                        value={flow.registerData.firstName}
                        onChange={(event) => flow.setRegisterField("firstName", event.target.value)}
                        error={errors.firstName}
                        disabled={locked}
                      />
                      <AuthField
                        label="Last name"
                        icon={User}
                        name="family-name"
                        autoComplete="family-name"
                        placeholder="Sharma"
                        value={flow.registerData.lastName}
                        onChange={(event) => flow.setRegisterField("lastName", event.target.value)}
                        error={errors.lastName}
                        disabled={locked}
                      />
                    </div>

                    <AuthField
                      label="Email address"
                      icon={Mail}
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@university.edu"
                      value={flow.registerData.email}
                      onChange={(event) => flow.setRegisterField("email", event.target.value)}
                      error={errors.email}
                      disabled={locked}
                    />

                    <AuthField
                      label="Password"
                      icon={Lock}
                      type="password"
                      name="new-password"
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={flow.registerData.password}
                      onChange={(event) => flow.setRegisterField("password", event.target.value)}
                      error={errors.password}
                      disabled={locked}
                    />

                    {flow.registerData.password ? (
                      <StrengthMeter
                        checks={flow.strength.checks}
                        label={flow.strength.label}
                        tone={flow.strength.tone}
                      />
                    ) : null}

                    <AuthField
                      label="Confirm password"
                      icon={Lock}
                      type="password"
                      name="confirm-password"
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={flow.registerData.confirmPassword}
                      onChange={(event) => flow.setRegisterField("confirmPassword", event.target.value)}
                      error={errors.confirmPassword}
                      disabled={locked}
                    />

                    <AuthCheckbox
                      id="auth-terms"
                      checked={flow.registerData.agreeToTerms}
                      onChange={(next) => flow.setRegisterField("agreeToTerms", next)}
                      error={errors.terms}
                    >
                      I agree to the{" "}
                      <Link href="/info/terms" className={linkClass}>
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/info/privacy" className={linkClass}>
                        Privacy Policy
                      </Link>
                      .
                    </AuthCheckbox>

                    <button type="submit" className={primaryButtonClass} disabled={locked}>
                      {flow.busy === "register" ? (
                        <>
                          <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden="true" />
                          <span>{submitLabel.register.busy}</span>
                        </>
                      ) : (
                        <>
                          <span>{submitLabel.register.idle}</span>
                          <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-[13px]" style={{ color: AUTH.body }}>
                      Already have an account?{" "}
                      <button type="button" onClick={() => flow.setTab("login")} className={linkClass}>
                        Sign in
                      </button>
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>

          <footer className="mt-4 sm:mt-6">
            <AuthLegal />
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center" style={{ background: AUTH.panel }}>
          <Loader2 className="h-6 w-6 animate-spin text-white/40" aria-hidden="true" />
          <span className="sr-only">Loading sign-in</span>
        </div>
      }
    >
      <LoginSurface />
    </Suspense>
  );
}
