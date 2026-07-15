"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Button, Field, FieldError, Input, Label } from "@netlium/ui";
import { identityStepSchema, type ProvisioningPayload } from "@netlium/lib";

export interface IdentityStepProps {
  readonly data: Partial<ProvisioningPayload>;
  readonly onNext: (payload: Partial<ProvisioningPayload>) => void;
}

export function IdentityStep({ data, onNext }: IdentityStepProps) {
  const [firstName, setFirstName] = useState(data.firstName ?? "");
  const [lastName, setLastName] = useState(data.lastName ?? "");
  const [residenceCountry, setResidenceCountry] = useState(data.residenceCountry ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = identityStepSchema.safeParse({ firstName, lastName, residenceCountry });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please complete this step.");
      return;
    }
    setError(null);
    onNext(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-1">
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Identity verification</h2>
        <p className="text-body-sm text-text-secondary">Establish the authorized account holder.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field>
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            placeholder="Jane"
          />
        </Field>

        <Field>
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            placeholder="Doe"
          />
        </Field>
      </div>

      <Field>
        <Label htmlFor="residence-country">Country of residence</Label>
        <Input
          id="residence-country"
          value={residenceCountry}
          onChange={(event) => setResidenceCountry(event.target.value)}
          autoComplete="country-name"
          placeholder="United States"
        />
        <FieldError>{error}</FieldError>
      </Field>

      <div className="flex justify-end pt-2">
        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto sm:min-w-32">
          Continue
        </Button>
      </div>
    </form>
  );
}
