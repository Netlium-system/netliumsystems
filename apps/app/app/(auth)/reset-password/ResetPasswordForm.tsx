"use client";

import { useActionState, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button, Field, FieldError, Input, Label } from "@netlium/ui";
import { resetPassword } from "../actions";
import { initialAuthActionState } from "../schema";
import { AuthShell } from "../components/AuthShell";
import { AuthCard } from "../components/AuthCard";

const inputClass =
  "h-10 border-[color:var(--color-border-whisper)] bg-surface-1 transition-[border-color,box-shadow] focus:border-accent-primary focus:shadow-[var(--shadow-focus-ring)]";
const ctaClass = "h-11 w-full";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, initialAuthActionState);
  const [email, setEmail] = useState("");

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !email) {
      event.preventDefault();
    }
  }

  if (state.success) {
    return (
      <AuthShell>
        <AuthCard className="flex flex-col items-center gap-4 py-12 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
            <MailCheck className="size-4" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-h4 font-semibold tracking-tight text-text-primary">Check your email</h1>
            <p className="text-body-sm text-text-secondary text-balance">
              If an account exists for that email address, we sent a link to reset your password.
            </p>
          </div>
          <Link href="/login" className="text-body-sm font-medium text-accent-primary hover:brightness-110">
            Return to Sign In
          </Link>
        </AuthCard>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthCard>
        <form action={formAction} className="flex flex-col gap-6">
          <div className="space-y-2">
            <Link
              href="/login"
              className="mb-1 inline-flex items-center gap-2 text-body-sm text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to Sign In
            </Link>
            <h1 className="text-h4 font-semibold leading-tight tracking-tight text-text-primary">
              Reset your password
            </h1>
            <p className="text-body-sm text-text-secondary">
              Enter your email address and we&apos;ll send you a reset link.
            </p>
          </div>
          <Field>
            <Label htmlFor="reset-email">Email address</Label>
            <Input
              id="reset-email"
              name="email"
              type="email"
              autoFocus
              autoComplete="email"
              inputMode="email"
              placeholder="investor@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={handleKeyDown}
              aria-invalid={Boolean(state.error)}
              className={inputClass}
            />
            <FieldError>{state.error}</FieldError>
          </Field>
          <Button type="submit" variant="accent" className={ctaClass} loading={isPending}>
            Send reset link
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
