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
      <div className="space-y-1">
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Account certification</h2>
        <p className="text-body-sm text-text-secondary">Certify the information supplied for institutional account activation.</p>
      </div>

      <div className="rounded-md border border-border-default bg-surface-2 p-5">
        <label className="flex cursor-pointer items-start gap-3">
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
            to Neptlium Systems&rsquo; institutional terms of service.
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="text-body-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-24" onClick={onBack}>
          Back
        </Button>
        <Button type="button" variant="accent" size="lg" className="w-full sm:w-auto sm:min-w-32" onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
