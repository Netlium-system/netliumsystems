"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Field,
  FieldError,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@netlium/ui";
import {
  individualProfileStepSchema,
  investmentExperienceLevels,
  preferredCurrencies,
  riskPreferences,
  type InvestmentExperienceLevel,
  type PreferredCurrency,
  type ProvisioningPayload,
  type RiskPreference
} from "@netlium/lib";

const experienceLabels: Record<InvestmentExperienceLevel, string> = {
  new: "New to investing",
  intermediate: "Intermediate",
  experienced: "Experienced",
  professional: "Professional"
};

const riskLabels: Record<RiskPreference, string> = {
  conservative: "Conservative",
  balanced: "Balanced",
  growth: "Growth",
  aggressive: "Aggressive"
};

export interface IndividualProfileStepProps {
  readonly data: Partial<ProvisioningPayload>;
  readonly onNext: (payload: Partial<ProvisioningPayload>) => void;
  readonly onBack: () => void;
}

export function IndividualProfileStep({ data, onNext, onBack }: IndividualProfileStepProps) {
  const [primaryObjective, setPrimaryObjective] = useState(data.primaryObjective ?? "");
  const [investmentExperience, setInvestmentExperience] = useState(data.investmentExperience ?? "");
  const [preferredCurrency, setPreferredCurrency] = useState(data.preferredCurrency ?? "");
  const [riskPreference, setRiskPreference] = useState(data.riskPreference ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = individualProfileStepSchema.safeParse({
      primaryObjective,
      investmentExperience,
      preferredCurrency,
      riskPreference
    });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please complete this step.");
      return;
    }
    setError(null);
    onNext(result.data);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="space-y-1 text-center">
        <h1 className="text-h4 font-semibold tracking-tight text-text-warm">Investor Profile</h1>
        <p className="text-body-sm text-text-secondary">Tell us how you plan to invest.</p>
      </div>

      <Field>
        <Label htmlFor="primary-objective">Primary objective</Label>
        <Input
          id="primary-objective"
          value={primaryObjective}
          onChange={(event) => setPrimaryObjective(event.target.value)}
          placeholder="e.g. Long-term capital growth"
        />
      </Field>

      <Field>
        <Label htmlFor="investment-experience">Investment experience</Label>
        <Select value={investmentExperience} onValueChange={(value) => setInvestmentExperience(value as InvestmentExperienceLevel)}>
          <SelectTrigger id="investment-experience">
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            {investmentExperienceLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {experienceLabels[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <Label htmlFor="preferred-currency">Preferred currency</Label>
        <Select value={preferredCurrency} onValueChange={(value) => setPreferredCurrency(value as PreferredCurrency)}>
          <SelectTrigger id="preferred-currency">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            {preferredCurrencies.map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field>
        <Label htmlFor="risk-preference">Risk preference</Label>
        <Select value={riskPreference} onValueChange={(value) => setRiskPreference(value as RiskPreference)}>
          <SelectTrigger id="risk-preference">
            <SelectValue placeholder="Select risk preference" />
          </SelectTrigger>
          <SelectContent>
            {riskPreferences.map((risk) => (
              <SelectItem key={risk} value={risk}>
                {riskLabels[risk]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>{error}</FieldError>
      </Field>

      <div className="flex gap-3">
        <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="accent" size="lg" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  );
}
