"use client";

import { useState } from "react";
import { Button, Checkbox } from "@netlium/ui";
import { complianceStepSchema } from "@netlium/lib";

export interface ComplianceStepProps {
  readonly onNext: (payload: { readonly complianceAcknowledged: true }) => void;
  readonly onBack: () => void;
}

export function ComplianceStep({ onNext, onBack }: ComplianceStepProps) {
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    const result = complianceStepSchema.safeParse({ complianceAcknowledged: acknowledged });
    if (!result.success) {
      setError("Acknowledgment is required to continue.");
      return;
    }
    setError(null);
    onNext(result.data);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Compliance</h1>
        <p className="text-body-sm text-text-secondary">Confirm the information provided is accurate.</p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-md border border-[color:var(--color-border-whisper)] bg-surface-1 p-4">
        <Checkbox
          checked={acknowledged}
          onCheckedChange={(checked) => {
            setAcknowledged(checked === true);
            setError(null);
          }}
          className="mt-0.5"
        />
        <span className="text-body-sm text-text-secondary">
          I certify that the information provided during this account opening is accurate and complete, and I agree
          to Netlium&rsquo;s institutional terms of service.
        </span>
      </label>
      {error && (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="accent" size="lg" className="flex-1" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
