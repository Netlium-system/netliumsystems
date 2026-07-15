"use client";

import { useActionState, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { login } from "../actions";
import { initialAuthActionState } from "../schema";
import { AuthShell } from "../components/AuthShell";
import { AuthCard } from "../components/AuthCard";
import { NeptliumMark } from "../components/NeptliumMark";

const inputClass =
  "h-10 border-[color:var(--color-border-whisper)] bg-surface-1 transition-[border-color,box-shadow] focus:border-accent-primary focus:shadow-[var(--shadow-focus-ring)]";
const ctaClass = "h-11 w-full";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialAuthActionState);
  const [capsLock, setCapsLock] = useState(false);

  function trackCapsLock(event: KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState?.("CapsLock") ?? false);
  }

  return (
    <AuthShell>
      <AuthCard>
        <form action={formAction} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <NeptliumMark size={36} />
            <div className="space-y-1">
              <h1 className="text-h4 font-semibold leading-tight tracking-tight text-text-primary">
                Sign In
              </h1>
              <p className="text-body-sm text-text-secondary">
                Sign in to your Neptlium Account.
              </p>
            </div>
          </div>

          <Field>
            <Label htmlFor="login-email">Email address</Label>
            <Input
              id="login-email"
              name="email"
              type="email"
              autoFocus
              autoComplete="email"
              inputMode="email"
              placeholder="investor@example.com"
              aria-invalid={Boolean(state.error)}
              className={inputClass}
            />
          </Field>

          <Field>
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              onKeyUp={trackCapsLock}
              aria-invalid={Boolean(state.error)}
              className={inputClass}
            />
            {capsLock && <FieldHint>Caps Lock is on</FieldHint>}
            <FieldError>{state.error}</FieldError>
          </Field>

          <Button type="submit" variant="accent" className={ctaClass} loading={isPending}>
            Sign In
          </Button>

          <div className="flex items-center justify-between text-body-sm">
            <Link href="/reset-password" className="text-text-secondary hover:text-text-primary">
              Forgot your password?
            </Link>
            <Link href="/signup" className="font-medium text-accent-primary hover:brightness-110">
              Create account
            </Link>
          </div>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
