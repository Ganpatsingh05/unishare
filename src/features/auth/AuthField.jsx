"use client";

import { useId, useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { AUTH, fieldClass } from "./authTheme";

/**
 * A labelled auth input.
 *
 * The label is a real <label> bound to the input, errors are announced through
 * aria-describedby, and every control has an accessible name — the previous
 * placeholder-only fields were invisible to screen readers and lost their
 * context as soon as a value was typed.
 */
export default function AuthField({
  label,
  hint = null,
  icon: Icon = null,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  inputMode,
  error = "",
  className = "",
  disabled = false,
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium" style={{ color: AUTH.body }}>
          {label}
        </label>
        {hint}
      </div>

      <div className="relative">
        {Icon ? (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-white/40"
          />
        ) : null}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${fieldClass} ${Icon ? "pl-11" : "pl-4"} ${isPassword ? "pr-11" : "pr-4"}`}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setRevealed((previous) => !previous)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/45 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3CC3F2]/50"
          >
            {revealed ? (
              <EyeOff className="h-[18px] w-[18px]" aria-hidden="true" />
            ) : (
              <Eye className="h-[18px] w-[18px]" aria-hidden="true" />
            )}
          </button>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className="flex items-start gap-1.5 text-[12.5px]" style={{ color: AUTH.danger }}>
          <AlertCircle className="mt-[2px] h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}
