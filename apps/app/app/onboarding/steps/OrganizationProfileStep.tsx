"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import {
  Button,
  Field,
  FieldError,
  FieldHint,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@netlium/ui";
import {
  organizationProfileStepSchema,
  organizationSizes,
  type ProvisioningPayload
} from "@netlium/lib";

export interface OrganizationProfileStepProps {
  readonly data: Partial<ProvisioningPayload>;
  readonly onNext: (payload: Partial<ProvisioningPayload>) => void;
  readonly onBack: () => void;
}

export function OrganizationProfileStep({ data, onNext, onBack }: OrganizationProfileStepProps) {
  const [companyName, setCompanyName] = useState(data.companyName ?? "");
  const [role, setRole] = useState(data.role ?? "");
  const [website, setWebsite] = useState(data.website ?? "");
  const [industry, setIndustry] = useState(data.industry ?? "");
  const [country, setCountry] = useState(data.country ?? "");
  const [organizationSize, setOrganizationSize] = useState(data.organizationSize ?? "");
  const [aumRange, setAumRange] = useState(data.aumRange ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = organizationProfileStepSchema.safeParse({
      companyName,
      role,
      website,
      industry,
      country,
      organizationSize,
      aumRange: aumRange || undefined
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
      <div className="space-y-1">
        <h2 className="text-h4 font-semibold tracking-tight text-text-primary">Organization profile</h2>
        <p className="text-body-sm text-text-secondary">Establish the organization operating this account.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field className="sm:col-span-2">
          <Label htmlFor="company-name">Company name</Label>
          <Input
            id="company-name"
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            autoComplete="organization"
            placeholder="Acme Capital LLC"
          />
        </Field>

        <Field>
          <Label htmlFor="role">Your role</Label>
          <Input
            id="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            autoComplete="organization-title"
            placeholder="e.g. Chief Financial Officer"
          />
        </Field>

        <Field>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            autoComplete="url"
            placeholder="https://"
          />
          <FieldHint>Optional.</FieldHint>
        </Field>

        <Field>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="e.g. Asset Management"
          />
        </Field>

        <Field>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            autoComplete="country-name"
            placeholder="United States"
          />
        </Field>

        <Field>
          <Label htmlFor="organization-size">Organization size</Label>
          <Select value={organizationSize} onValueChange={setOrganizationSize}>
            <SelectTrigger id="organization-size">
              <SelectValue placeholder="Select organization size" />
            </SelectTrigger>
            <SelectContent>
              {organizationSizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size} employees
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="aum-range">Assets under management</Label>
          <Input
            id="aum-range"
            value={aumRange}
            onChange={(event) => setAumRange(event.target.value)}
            placeholder="e.g. $50M–$250M"
          />
          <FieldHint>Optional.</FieldHint>
          <FieldError>{error}</FieldError>
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-2">
        <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto sm:min-w-24" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto sm:min-w-32">
          Continue
        </Button>
      </div>
    </form>
  );
}
