"use client";

import { useActionState, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { signup } from "../actions";
import { initialAuthActionState } from "../schema";
import { AuthShell } from "../components/AuthShell";
import { AuthCard } from "../components/AuthCard";
import { NetliumMark } from "../components/NetliumMark";

const inputClass =
  "h-10 border-[color:var(--color-border-whisper)] bg-surface-1 transition-[border-color,box-shadow] focus:border-accent-emerald focus:shadow-[var(--shadow-focus-ring-emerald)]";
const ctaClass = "h-11 w-full";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, initialAuthActionState);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [capsLock, setCapsLock] = useState(false);

  function trackCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (password.length < 8) {
      event.preventDefault();
      setPasswordError("Secure credential must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      event.preventDefault();
      setPasswordError("Secure credentials do not match.");
      return;
    }
    setPasswordError(null);
  }

  if (state.success) {
    return (
      <AuthShell>
        <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-accent-emerald/10 text-accent-emerald">
            <MailCheck className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Identity confirmation sent</h1>
            <p className="text-body-sm text-text-secondary text-balance">
              Follow the link we sent to your email address to activate your account.
            </p>
          </div>
          <Link href="/login" className="text-body-sm font-medium text-accent-emerald hover:brightness-110">
            Return to Access Platform
          </Link>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard>
        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <NetliumMark size={36} />
            <div className="space-y-1">
              <h1 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                Open Netlium Account
              </h1>
              <p className="text-body-sm text-text-secondary">
                Establish your institutional capital workspace.
              </p>
            </div>
          </div>

          <Field>
            <Label htmlFor="signup-email">Email address</Label>
            <Input
              id="signup-email"
              name="email"
              type="email"
              autoFocus
              autoComplete="email"
              inputMode="email"
              placeholder="investor@example.com"
              className={inputClass}
            />
          </Field>

          <Field>
            <Label htmlFor="signup-password">Secure credential</Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (passwordError) setPasswordError(null);
              }}
              onKeyUp={trackCapsLock}
              aria-invalid={Boolean(passwordError)}
              className={inputClass}
            />
            {capsLock && <FieldHint>Caps Lock is on</FieldHint>}
            <FieldHint>At least 8 characters.</FieldHint>
          </Field>

          <Field>
            <Label htmlFor="signup-confirm-password">Confirm secure credential</Label>
            <Input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (passwordError) setPasswordError(null);
              }}
              aria-invalid={Boolean(passwordError)}
              className={inputClass}
            />
            <FieldError>{passwordError ?? state.error}</FieldError>
          </Field>

          <Button type="submit" variant="accent" className={ctaClass} loading={isPending}>
            Open Netlium Account
          </Button>

          <p className="text-center text-body-sm text-text-secondary">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-accent-emerald hover:brightness-110">
              Access Platform
            </Link>
          </p>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
