"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Briefcase, Building2, Landmark, User, Users, Wallet } from "lucide-react";
import { Field, FieldError, Label, OptionCard, RadioGroup, Button, Textarea } from "@netlium/ui";
import { purposeStepSchema, type InvestorType, type ProvisioningPayload } from "@netlium/lib";

interface InvestorTypeOption {
  readonly value: InvestorType;
  readonly label: string;
  readonly description: string;
  readonly icon: ReactNode;
}

const investorTypeOptions: readonly InvestorTypeOption[] = [
  {
    value: "individual",
    label: "Individual Investor",
    description: "Personal capital, managed by one person.",
    icon: <User className="size-4" aria-hidden="true" />
  },
  {
    value: "family_office",
    label: "Family Office",
    description: "Capital management for a single family's institutional needs.",
    icon: <Landmark className="size-4" aria-hidden="true" />
  },
  {
    value: "business",
    label: "Business",
    description: "Corporate treasury and operating capital.",
    icon: <Building2 className="size-4" aria-hidden="true" />
  },
  {
    value: "investment_firm",
    label: "Investment Firm",
    description: "Capital deployed on behalf of clients or funds.",
    icon: <Briefcase className="size-4" aria-hidden="true" />
  },
  {
    value: "treasury_team",
    label: "Treasury Team",
    description: "Institutional cash and liquidity management.",
    icon: <Wallet className="size-4" aria-hidden="true" />
  },
  {
    value: "capital_partner",
    label: "Capital Partner",
    description: "Allocating alongside or into Neptlium-connected strategies.",
    icon: <Users className="size-4" aria-hidden="true" />
  }
];

export interface PurposeStepProps {
  readonly data: Partial<ProvisioningPayload>;
  readonly onNext: (payload: Partial<ProvisioningPayload>) => void;
}

export function PurposeStep({ data, onNext }: PurposeStepProps) {
  const [investorType, setInvestorType] = useState<InvestorType | undefined>(data.investorType);
  const [purpose, setPurpose] = useState(data.purpose ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = purposeStepSchema.safeParse({ investorType, purpose });
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
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Account mandate</h2>
        <p className="text-body-sm text-text-secondary">Define how this Neptlium Account will be used.</p>
      </div>

      <Field>
        <Label>Account purpose</Label>
        <RadioGroup
          value={investorType ?? null}
          onValueChange={(value) => setInvestorType(value as InvestorType)}
          className="grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {investorTypeOptions.map((option) => (
            <OptionCard
              key={option.value}
              value={option.value}
              label={option.label}
              description={option.description}
              icon={option.icon}
              selected={investorType === option.value}
            />
          ))}
        </RadioGroup>
      </Field>

      <Field>
        <Label htmlFor="purpose">Mandate description</Label>
        <Textarea
          id="purpose"
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          placeholder="Describe how you plan to deploy capital through Neptlium."
          rows={3}
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
