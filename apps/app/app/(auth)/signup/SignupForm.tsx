"use client";

import { useActionState, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { signup } from "../actions";
import { initialAuthActionState } from "../schema";
import { AuthShell } from "../components/AuthShell";

/** Basic RFC-5322-ish email pattern for client-side step validation */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "h-12 rounded-md border-[color:var(--color-border-default)] bg-[color:var(--color-surface-1)] pl-10 transition-[border-color,box-shadow] focus:border-[color:var(--color-border-focus)] focus:shadow-[var(--shadow-focus-ring)]";

const ctaClass = "h-12 w-full rounded-full text-[15px] font-semibold";

type Step = "email" | "password";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialAuthActionState);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function handleEmailContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError(null);
    setStep("password");
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    if (password.length < 8) {
      event.preventDefault();
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      event.preventDefault();
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError(null);
  }

  /* ── Email sent / verify screen ── */
  if (state.success) {
    return (
      <AuthShell>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mb-10 flex items-center gap-2 text-[13px] text-text-muted hover:text-text-secondary"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent-primary/10">
            <MailCheck className="size-5 text-accent-primary" aria-hidden="true" />
          </div>

          <div className="space-y-1">
            <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-text-primary">
              Verify your email
            </h1>
            <p className="text-[15px] text-text-muted">
              We sent a secure verification link to
            </p>
            <p className="text-[15px] font-medium text-text-primary">{email}</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button variant="cta" size="lg" className={ctaClass} href="mailto:">
              Open email
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-full text-[15px]"
              onClick={() => {
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setStep("email");
              }}
            >
              Resend verification email
            </Button>
            <button
              type="button"
              className="pt-1 text-center text-[14px] text-accent-primary hover:brightness-110"
              onClick={() => {
                setEmail("");
                setStep("email");
              }}
            >
              Use a different email
            </button>
          </div>
        </div>
      </AuthShell>
    );
  }

  /* ── Step 1: Email ── */
  if (step === "email") {
    return (
      <AuthShell>
        <div className="flex flex-col gap-8">
          <div className="space-y-2">
            <h1 className="text-[36px] font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-[40px]">
              Create your<br />Neptlium account
            </h1>
            <p className="text-[15px] text-text-muted">
              Enter your email to get started.
            </p>
          </div>

          <form onSubmit={handleEmailContinue} className="flex flex-col gap-5">
            <Field>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoFocus
                  autoComplete="email"
                  inputMode="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  aria-invalid={Boolean(emailError)}
                  className={inputClass}
                />
              </div>
              <FieldError>{emailError}</FieldError>
            </Field>

            <Button type="submit" variant="cta" className={ctaClass}>
              Continue →
            </Button>
          </form>

          <p className="text-center text-[14px] text-text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent-primary hover:brightness-110">
              Sign in
            </Link>
          </p>
        </div>
      </AuthShell>
    );
  }

  /* ── Step 2: Password ── */
  return (
    <AuthShell>
      <button
        type="button"
        onClick={() => setStep("email")}
        className="mb-10 flex items-center gap-2 text-[13px] text-text-muted hover:text-text-secondary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back
      </button>

      <div className="flex flex-col gap-8">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold leading-[1.1] tracking-tight text-text-primary">
            Create your password
          </h1>
          <p className="text-[15px] text-text-muted">
            Signing up as <span className="text-text-secondary">{email}</span>
          </p>
        </div>

        <form action={formAction} onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
          {/* Hidden email field so the server action receives it */}
          <input type="hidden" name="email" value={email} />

          <Field>
            <Label htmlFor="signup-password">Password</Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoFocus
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              aria-invalid={Boolean(passwordError)}
              className="h-12 rounded-md border-[color:var(--color-border-default)] bg-[color:var(--color-surface-1)] transition-[border-color,box-shadow] focus:border-[color:var(--color-border-focus)] focus:shadow-[var(--shadow-focus-ring)]"
            />
            <FieldHint>8+ characters, 1 uppercase, 1 number, 1 special character</FieldHint>
          </Field>

          <Field>
            <Label htmlFor="signup-confirm-password">Confirm password</Label>
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) setPasswordError(null);
              }}
              aria-invalid={Boolean(passwordError)}
              className="h-12 rounded-md border-[color:var(--color-border-default)] bg-[color:var(--color-surface-1)] transition-[border-color,box-shadow] focus:border-[color:var(--color-border-focus)] focus:shadow-[var(--shadow-focus-ring)]"
            />
            <FieldError>{passwordError ?? state.error}</FieldError>
          </Field>

          <Button type="submit" variant="cta" className={ctaClass} loading={isPending}>
            Create account →
          </Button>
        </form>
      </div>
    </AuthShell>
  );
}

