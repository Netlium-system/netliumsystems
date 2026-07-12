"use client";

import { ShieldCheck } from "lucide-react";
import { Badge, Button } from "@netlium/ui";

export interface SecurityStepProps {
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const commitments = [
  "Secure credential established at account creation",
  "Session traffic encrypted end-to-end",
  "Account activity continuously monitored"
] as const;

export function SecurityStep({ onNext, onBack }: SecurityStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Security</h1>
        <p className="text-body-sm text-text-secondary">Your account is protected by institutional-grade infrastructure.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-[color:var(--color-border-whisper)] bg-surface-1 p-5">
        {commitments.map((commitment) => (
          <div key={commitment} className="flex items-center gap-3">
            <ShieldCheck className="size-4 shrink-0 text-accent-emerald" aria-hidden="true" />
            <span className="text-body-sm text-text-primary">{commitment}</span>
          </div>
        ))}
        <Badge tone="success" className="w-fit">
          Security Protected
        </Badge>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="accent" size="lg" className="flex-1" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
