import { z } from "zod";

export const investorTypes = [
  "individual",
  "family_office",
  "business",
  "investment_firm",
  "treasury_team",
  "capital_partner"
] as const;
export type InvestorType = (typeof investorTypes)[number];

export function isOrganizationPurpose(investorType: InvestorType): boolean {
  return investorType !== "individual";
}

export const purposeStepSchema = z.object({
  investorType: z.enum(investorTypes),
  purpose: z.string().min(1, "Tell us the purpose of this account.").max(500)
});
export type PurposeStepInput = z.infer<typeof purposeStepSchema>;

export const investmentExperienceLevels = ["new", "intermediate", "experienced", "professional"] as const;
export const preferredCurrencies = ["USD", "EUR", "GBP", "CHF"] as const;
export const riskPreferences = ["conservative", "balanced", "growth", "aggressive"] as const;

export type InvestmentExperienceLevel = (typeof investmentExperienceLevels)[number];
export type PreferredCurrency = (typeof preferredCurrencies)[number];
export type RiskPreference = (typeof riskPreferences)[number];

export const individualProfileStepSchema = z.object({
  primaryObjective: z.string().min(1, "Primary objective is required.").max(200),
  investmentExperience: z.enum(investmentExperienceLevels),
  preferredCurrency: z.enum(preferredCurrencies),
  riskPreference: z.enum(riskPreferences)
});
export type IndividualProfileStepInput = z.infer<typeof individualProfileStepSchema>;

export const organizationSizes = ["1-10", "11-50", "51-200", "201-1000", "1000+"] as const;

export const organizationProfileStepSchema = z.object({
  companyName: z.string().min(1, "Company name is required.").max(200),
  role: z.string().min(1, "Your role is required.").max(120),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  industry: z.string().min(1, "Industry is required.").max(120),
  country: z.string().min(1, "Country is required.").max(100),
  organizationSize: z.enum(organizationSizes),
  aumRange: z.string().max(60).optional()
});
export type OrganizationProfileStepInput = z.infer<typeof organizationProfileStepSchema>;

export const complianceStepSchema = z.object({
  complianceAcknowledged: z.literal(true)
});
export type ComplianceStepInput = z.infer<typeof complianceStepSchema>;

// A flat superset rather than a discriminated union — the wizard accumulates
// this incrementally as `Partial<ProvisioningPayload>`, and TypeScript's
// mapped types don't distribute the way you'd want over `Partial<A | B>`
// (it collapses to the keys common to both branches). Branch-specific
// requiredness is enforced below in `superRefine`, and again per-step by
// `individualProfileStepSchema` / `organizationProfileStepSchema`.
export const provisioningPayloadSchema = z
  .object({
    investorType: z.enum(investorTypes),
    purpose: z.string().min(1).max(500),
    primaryObjective: z.string().max(200).optional(),
    investmentExperience: z.enum(investmentExperienceLevels).optional(),
    preferredCurrency: z.enum(preferredCurrencies).optional(),
    riskPreference: z.enum(riskPreferences).optional(),
    companyName: z.string().max(200).optional(),
    role: z.string().max(120).optional(),
    website: z.union([z.string().url(), z.literal("")]).optional(),
    industry: z.string().max(120).optional(),
    country: z.string().max(100).optional(),
    organizationSize: z.enum(organizationSizes).optional(),
    aumRange: z.string().max(60).optional(),
    complianceAcknowledged: z.literal(true)
  })
  .superRefine((data, ctx) => {
    const required = isOrganizationPurpose(data.investorType)
      ? (["companyName", "role", "industry", "country", "organizationSize"] as const)
      : (["primaryObjective", "investmentExperience", "preferredCurrency", "riskPreference"] as const);

    for (const field of required) {
      if (!data[field]) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [field], message: "This field is required." });
      }
    }
  });
export type ProvisioningPayload = z.infer<typeof provisioningPayloadSchema>;
