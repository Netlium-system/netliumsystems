"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@netlium/ui";

export interface SecurityStepProps {
  readonly onNext: () => void;
  readonly onBack: () => void;
}

const commitments = [
  "Password established and secured at account creation",
  "Session traffic encrypted end-to-end",
  "Account activity continuously monitored for unauthorized access"
] as const;

export function SecurityStep({ onNext, onBack }: SecurityStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Security controls</h2>
        <p className="text-body-sm text-text-secondary">Review the controls protecting account access and capital operations.</p>
      </div>

      <div className="flex flex-col gap-3 rounded-md border border-border-default bg-surface-2 p-5">
        {commitments.map((commitment) => (
          <div key={commitment} className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
            <span className="text-body-sm text-text-primary">{commitment}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-24" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="accent" size="lg" className="w-full sm:w-auto sm:min-w-32" onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
}
