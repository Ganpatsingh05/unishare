"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  loginWithEmail,
  registerWithEmail,
  requestPasswordReset,
  startGithubLogin,
  startGoogleLogin,
} from "@lib/api/api";
import { useAuth } from "@contexts/UniShareContext";

/**
 * Everything the login surface does, in one place, so the responsive layout
 * carries no branching copy of it.
 *
 * Sign-in ends in a full navigation rather than a client transition: the session
 * lives in an httpOnly cookie that is only read while the app boots, so a
 * router.push left the header and context believing the visitor was still signed
 * out until the page was manually reloaded.
 */

const GRANTED_MS = 550;
const OPENING_MS = 900;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STRENGTH_RULES = [
  (value) => value.length >= 8,
  (value) => /[A-Z]/.test(value),
  (value) => /[a-z]/.test(value),
  (value) => /[0-9]/.test(value),
  (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
];

export function passwordStrength(password = "") {
  const checks = STRENGTH_RULES.map((rule) => rule(password));
  const score = checks.filter(Boolean).length;

  if (!password) return { checks, score, label: "", tone: "weak" };
  if (score === 5) return { checks, score, label: "Strong", tone: "strong" };
  if (score >= 3) return { checks, score, label: "Medium", tone: "medium" };
  return { checks, score, label: "Weak", tone: "weak" };
}

/** Keeps the post-login destination on this site: `?redirect=` is attacker-controlled. */
function safeRedirect(raw) {
  if (!raw || typeof raw !== "string") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw === "/login" ? "/" : raw;
}

function validateLogin(values) {
  const found = {};
  const email = values.email.trim();

  if (!email) found.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) found.email = "That does not look like a valid email address.";
  if (!values.password) found.password = "Enter your password.";

  return found;
}

function validateRegister(values) {
  const found = {};
  const email = values.email.trim();

  if (!values.firstName.trim()) found.firstName = "Enter your first name.";
  if (!values.lastName.trim()) found.lastName = "Enter your last name.";

  if (!email) found.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) found.email = "That does not look like a valid email address.";

  if (!values.password) found.password = "Choose a password.";
  else if (values.password.length < 8) found.password = "Use at least 8 characters.";
  else if (!/[A-Z]/.test(values.password)) found.password = "Add an uppercase letter.";
  else if (!/[a-z]/.test(values.password)) found.password = "Add a lowercase letter.";
  else if (!/[0-9]/.test(values.password)) found.password = "Add a number.";
  else if (!/[!@#$%^&*(),.?":{}|<>]/.test(values.password)) found.password = "Add a symbol.";

  if (!values.confirmPassword) found.confirmPassword = "Repeat your password.";
  else if (values.confirmPassword !== values.password) found.confirmPassword = "Both passwords must match.";

  return found;
}

export default function useAuthFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();

  const target = useMemo(() => safeRedirect(searchParams.get("redirect")), [searchParams]);

  const [tab, setTabState] = useState("login");
  const [view, setView] = useState("form"); // "form" | "reset"
  const [gate, setGate] = useState("idle"); // "idle" | "granted" | "opening"
  const [busy, setBusy] = useState(null); // "login" | "register" | "reset" | "oauth"
  const [banner, setBanner] = useState(null); // { tone: "error" | "success", text }
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [resetData, setResetData] = useState({ email: "" });

  const timers = useRef([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(window.clearTimeout);
      pending.length = 0;
    };
  }, []);

  // Someone who is already signed in has no business on this page.
  useEffect(() => {
    if (!isAuthenticated || !user || gate !== "idle") return;
    router.replace(target);
  }, [isAuthenticated, user, gate, target, router]);

  const clearMessages = useCallback(() => {
    setBanner(null);
    setErrors({});
  }, []);

  const setTab = useCallback(
    (next) => {
      setTabState(next);
      clearMessages();
    },
    [clearMessages]
  );

  const openReset = useCallback(() => {
    clearMessages();
    setView("reset");
  }, [clearMessages]);

  const closeReset = useCallback(() => {
    clearMessages();
    setView("form");
  }, [clearMessages]);

  /** Writes one field and drops its error as soon as the visitor edits it. */
  const updateField = useCallback((setter, field, value) => {
    setter((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }, []);

  const setLoginField = useCallback(
    (field, value) => updateField(setLoginData, field, value),
    [updateField]
  );
  const setRegisterField = useCallback(
    (field, value) => updateField(setRegisterData, field, value),
    [updateField]
  );
  const setResetField = useCallback(
    (field, value) => updateField(setResetData, field, value),
    [updateField]
  );

  const handOff = useCallback(() => {
    setGate("granted");
    timers.current.push(window.setTimeout(() => setGate("opening"), GRANTED_MS));
    timers.current.push(
      window.setTimeout(() => {
        window.location.assign(target);
      }, GRANTED_MS + OPENING_MS)
    );
  }, [target]);

  const submitLogin = useCallback(
    async (event) => {
      event.preventDefault();
      setBanner(null);

      const found = validateLogin(loginData);
      setErrors(found);
      if (Object.keys(found).length > 0) return;

      setBusy("login");
      let handedOff = false;
      try {
        const result = await loginWithEmail(loginData.email.trim(), loginData.password);
        if (!result.success) {
          setBanner({
            tone: "error",
            text: result.message || "We could not sign you in. Check your details and try again.",
          });
          return;
        }
        handedOff = true;
        handOff();
      } catch {
        setBanner({ tone: "error", text: "Something went wrong reaching UniShare. Please try again." });
      } finally {
        if (!handedOff) setBusy(null);
      }
    },
    [loginData, handOff]
  );

  const submitRegister = useCallback(
    async (event) => {
      event.preventDefault();
      setBanner(null);

      const found = validateRegister(registerData);
      if (!registerData.agreeToTerms) found.terms = "Accept the Terms and Privacy Policy to continue.";
      setErrors(found);
      if (Object.keys(found).length > 0) return;

      setBusy("register");
      let handedOff = false;
      try {
        // The backend registers and signs in in one step, so this ends the same
        // way a sign-in does — not with a "check your email" dead end.
        const result = await registerWithEmail({
          firstName: registerData.firstName.trim(),
          lastName: registerData.lastName.trim(),
          email: registerData.email.trim(),
          password: registerData.password,
        });
        if (!result.success) {
          setBanner({
            tone: "error",
            text: result.message || "We could not create your account. Please try again.",
          });
          return;
        }
        handedOff = true;
        handOff();
      } catch {
        setBanner({ tone: "error", text: "Something went wrong reaching UniShare. Please try again." });
      } finally {
        if (!handedOff) setBusy(null);
      }
    },
    [registerData, handOff]
  );

  const submitReset = useCallback(
    async (event) => {
      event.preventDefault();
      setBanner(null);

      const email = resetData.email.trim();
      const found = {};
      if (!email) found.email = "Enter your email address.";
      else if (!EMAIL_PATTERN.test(email)) found.email = "That does not look like a valid email address.";
      setErrors(found);
      if (Object.keys(found).length > 0) return;

      setBusy("reset");
      try {
        const result = await requestPasswordReset(email);
        if (result.success) {
          setBanner({ tone: "success", text: result.message || "Check your inbox for the reset link." });
        } else {
          setBanner({ tone: "error", text: result.message || "We could not send that email. Please try again." });
        }
      } catch {
        setBanner({ tone: "error", text: "Something went wrong reaching UniShare. Please try again." });
      } finally {
        setBusy(null);
      }
    },
    [resetData]
  );

  const signInWithProvider = useCallback(
    (provider) => {
      setBusy("oauth");
      if (target !== "/") {
        try {
          window.sessionStorage.setItem("oauth_redirect", target);
        } catch {
          // Private modes can block storage; the redirect hint is not essential.
        }
      }
      try {
        if (provider === "github") startGithubLogin();
        else startGoogleLogin();
      } catch {
        setBusy(null);
        setBanner({ tone: "error", text: "We could not start that sign-in. Please try again." });
      }
    },
    [target]
  );

  const strength = useMemo(() => passwordStrength(registerData.password), [registerData.password]);

  return {
    tab,
    setTab,
    view,
    openReset,
    closeReset,
    gate,
    target,
    busy,
    locked: Boolean(busy) || gate !== "idle",
    banner,
    errors,
    loginData,
    setLoginField,
    submitLogin,
    registerData,
    setRegisterField,
    submitRegister,
    resetData,
    setResetField,
    submitReset,
    signInWithProvider,
    strength,
  };
}
