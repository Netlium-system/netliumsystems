"use client";

import { useActionState, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Button, Field, FieldError, FieldHint, Input, Label } from "@netlium/ui";
import { updatePassword } from "../(auth)/actions";
import { initialAuthActionState } from "../(auth)/schema";
import { AuthShell } from "../(auth)/components/AuthShell";
import { AuthCard } from "../(auth)/components/AuthCard";
import { NetliumMark } from "../(auth)/components/NetliumMark";

const inputClass =
  "h-10 border-[color:var(--color-border-whisper)] bg-surface-1 transition-[border-color,box-shadow] focus:border-accent-emerald focus:shadow-[var(--shadow-focus-ring-emerald)]";
const ctaClass = "h-11 w-full";

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, initialAuthActionState);
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

  return (
    <AuthShell>
      <AuthCard>
        <form action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <NetliumMark size={36} />
            <div className="space-y-1">
              <h1 className="text-h4 font-semibold leading-tight tracking-tight text-text-warm">
                Set a new credential
              </h1>
              <p className="text-body-sm text-text-secondary">
                Choose a new secure credential for your Netlium workspace.
              </p>
            </div>
          </div>

          <Field>
            <Label htmlFor="update-password">New secure credential</Label>
            <Input
              id="update-password"
              name="password"
              type="password"
              autoFocus
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
            <Label htmlFor="update-confirm-password">Confirm secure credential</Label>
            <Input
              id="update-confirm-password"
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
            Update credential
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}
